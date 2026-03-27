# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Backend
```bash
cd backend
python -m venv venv && venv/Scripts/activate   # Windows
pip install -r requirements.txt
uvicorn main:app --reload --port 8080
```

Required env vars in `backend/.env`:
```
GROQ_API_KEY=...
UNSPLASH_ACCESS_KEY=...          # optional
DATABASE_URL=postgresql://...    # optional, defaults to SQLite
```

### Frontend
```bash
cd frontend
npm install
npm run dev        # port 3000
npm run build      # production build
npm run lint       # ESLint
```

Required env vars in `frontend/.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:8080
```

---

## Architecture

### Pipeline (backend)

The core loop runs every 30 minutes via APScheduler and also once on startup (in a daemon thread — critical for Render free tier). A threading lock prevents concurrent runs.

```
discovery → clustering → [merger | scraper + synthesizer] → image_finder → DB save
```

1. **`pipeline/discovery.py`** — fetches 7 RSS feeds, deduplicates via SHA-256 URL hash, stores unprocessed `RssItem` rows
2. **`pipeline/clustering.py`** — groups items with `rapidfuzz.token_set_ratio` threshold 55 (greedy)
3. **`pipeline/merger.py`** — before clustering, tries to match each item against existing articles (< 24h, same threshold); if found, re-synthesizes in-place instead of creating a new article
4. **`pipeline/scraper.py`** — trafilatura with 2-worker ThreadPoolExecutor; falls back to RSS content cached in `rss_content` column
5. **`pipeline/synthesizer.py`** — Groq call (LLaMA 3.3 70B); returns `{titolo, sommario, corpo, tag, score_rilevanza, image_query}`; retries on 429 by parsing the wait time from the response
6. **`pipeline/image_finder.py`** — Unsplash API using LLM-provided `image_query`; falls back to tag + "cybersecurity"

Orchestration is in `scheduler.py → run_pipeline()`. Stats dict tracks counts at each step.

### Data models

Three SQLAlchemy tables:
- **Article** — `title, summary, body` (markdown), `tags` (JSON), `image_url`, `relevance_score` (1–10), `published_at`
- **Source** — FK to Article, stores `url` and `domain` of each scraped source
- **RssItem** — `url_hash` (unique, SHA-256), `rss_content` (fallback text), `processed` flag

`database.py` runs schema migrations on `init_db()` (adds missing columns like `image_url`, `rss_content`).

### API (`main.py`)

- `GET /articles` — supports `?tag=`, `?min_score=`, `?max_score=`, `?limit=`, `?offset=`
- `GET /articles/{id}` — includes markdown `body`
- `GET /tags` — tag counts
- `GET /rss` — RSS 2.0 (last 50 articles)
- `POST /admin/run-pipeline` — manual trigger
- `DELETE /admin/delete-all-articles`
- `GET /admin/stats`
- `GET /health`

CORS is currently `allow_origins=["*"]` — see `FRONTEND_URL` env var note below.

### Frontend

**Data flow**: `lib/api.ts` is the single API client — all fetches go through it. ISR caching via `next: { revalidate: 60 }` on all fetch calls.

**Page rendering strategy**:
- `app/page.tsx` — client-side; fetches on mount with exponential-backoff retry (handles Render cold starts: 5s → 10s → 15s → 20s, max 4 retries)
- `app/article/[id]/page.tsx` — server component, 1h ISR
- `app/category/[tag]/page.tsx` — server component, 1min ISR
- `app/admin/page.tsx` — client-side, polls `/admin/stats` every 15 seconds

**Homepage sections**:
- **In Evidenza** — articles from last 48h with `relevance_score ≥ 8`, shown as a featured strip
- **Ultime notizie** — paginated grid (9/page) with tag + relevance filters
- **Daily Briefing** — top 5 articles with `score ≥ 5` shown as a numbered list with mascot

**Relevance levels** (defined in `RelevanceDots.tsx`):
- Bassa: 1–4 (1 green dot)
- Media: 5–7 (2 orange dots)
- Critica: 8–10 (3 red dots)

**Tag colors** are defined in `TagBadge.tsx` — each tag category maps to a Tailwind color class.

---

## Key constraints

- **RAM**: Render free tier is 512MB. `MAX_ITEMS_PER_RUN = 20` and `max_workers = 2` in scraper are deliberate limits. Don't increase without testing.
- **Groq TPM**: `MAX_TEXT_CHARS_PER_ARTICLE = 3000` keeps token usage under the free-tier rate limit.
- **DB URL**: `config.py` auto-converts `postgres://` → `postgresql://` for Render's legacy connection string format.
- **Pipeline concurrency**: Only one pipeline run at a time. The `threading.Lock` in `scheduler.py` is critical — don't remove it.
- **Article rebranding**: The project was renamed CyberNews → FoxScan. Some legacy strings (`"CyberNews API"` title in `main.py`, `cybernews.db` default SQLite filename, `cybernews-frontend` in `package.json`) remain unrenamed.
