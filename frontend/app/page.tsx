"use client";

import { useEffect, useState } from "react";
import { getArticles, getTags, ArticleSummary, TagCount } from "@/lib/api";
import ArticleCard from "@/components/ArticleCard";
import TagBadge from "@/components/TagBadge";
import RelevanceDots, { getLevel } from "@/components/RelevanceDots";

const PAGE_SIZE = 10;
const EVIDENZA_HOURS = 48;

// Mappa livello → range di score
const LEVEL_RANGES: Record<number, { min_score?: number; max_score?: number }> = {
  0: {},
  1: { min_score: 1, max_score: 4 },
  2: { min_score: 5, max_score: 7 },
  3: { min_score: 8 },
};

const LEVEL_LABELS: Record<number, string> = {
  0: "Tutti",
  1: "Bassa",
  2: "Media",
  3: "Critica",
};

function isRecent(iso: string, hours: number) {
  return Date.now() - new Date(iso).getTime() < hours * 3_600_000;
}

export default function HomePage() {
  const [page, setPage] = useState(1);
  const [levelFilter, setLevelFilter] = useState(0);
  const [articles, setArticles] = useState<ArticleSummary[]>([]);
  const [inEvidenza, setInEvidenza] = useState<ArticleSummary[]>([]);
  const [total, setTotal] = useState(0);
  const [tags, setTags] = useState<TagCount[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch "In Evidenza" una sola volta (score 8-10, ultime 48h)
  useEffect(() => {
    getArticles({ min_score: 8, limit: 10 })
      .then((res) => setInEvidenza(res.items.filter((a) => isRecent(a.published_at, EVIDENZA_HOURS))))
      .catch(() => {});
  }, []);

  // Fetch articoli principali al cambio di pagina o filtro livello
  useEffect(() => {
    setLoading(true);
    const offset = (page - 1) * PAGE_SIZE;
    const scoreParams = LEVEL_RANGES[levelFilter];
    Promise.all([
      getArticles({ limit: PAGE_SIZE, offset, ...scoreParams }).catch(() => ({
        total: 0, offset: 0, limit: PAGE_SIZE, items: [],
      })),
      getTags().catch(() => []),
    ]).then(([articlesRes, tagsRes]) => {
      setArticles(articlesRes.items);
      setTotal(articlesRes.total);
      setTags(tagsRes);
      setLoading(false);
    });
  }, [page, levelFilter]);

  function changeLevel(lvl: number) {
    setLevelFilter(lvl);
    setPage(1);
  }

  const totalPages = Math.ceil(total / PAGE_SIZE);
  const topTags = tags.slice(0, 12);

  return (
    <div>
      {/* Hero */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">
          Cybersecurity digest <span className="text-cyan-400">in italiano</span>
        </h1>
        <p className="text-zinc-400">
          Le notizie più rilevanti da{" "}
          <span className="text-zinc-300">BleepingComputer, The Hacker News, Krebs, Dark Reading</span>{" "}
          e altre fonti — sintetizzate automaticamente da AI in un unico articolo.
        </p>
      </div>

      {/* In Evidenza */}
      {inEvidenza.length > 0 && (
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-red-400 font-bold text-sm uppercase tracking-widest">⚠ In Evidenza</span>
            <span className="text-xs text-zinc-600">ultime {EVIDENZA_HOURS}h · rilevanza critica</span>
          </div>
          <div className="space-y-3 border-l-2 border-red-800 pl-4">
            {inEvidenza.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        </div>
      )}

      {/* Tag cloud */}
      {topTags.length > 0 && (
        <div className="mb-6 flex flex-wrap gap-2">
          {topTags.map(({ tag, count }) => (
            <span key={tag} className="flex items-center gap-1.5">
              <TagBadge tag={tag} />
              <span className="text-xs text-zinc-600">{count}</span>
            </span>
          ))}
        </div>
      )}

      {/* Filtro per livello */}
      <div className="mb-6 flex items-center gap-2 flex-wrap">
        <span className="text-xs text-zinc-500 mr-1">Filtra per rilevanza:</span>
        {([0, 1, 2, 3] as const).map((lvl) => (
          <button
            key={lvl}
            onClick={() => changeLevel(lvl)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
              levelFilter === lvl
                ? "border-cyan-600 bg-cyan-900/30 text-cyan-300"
                : "border-zinc-700 text-zinc-400 hover:border-zinc-500 hover:text-zinc-200"
            }`}
          >
            {lvl === 0 ? (
              <span>Tutti</span>
            ) : (
              <>
                <RelevanceDots score={lvl === 1 ? 3 : lvl === 2 ? 6 : 9} showLabel={false} />
                <span>{LEVEL_LABELS[lvl]}</span>
              </>
            )}
          </button>
        ))}
      </div>

      {/* Articles */}
      {loading ? (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="border border-zinc-800 rounded-lg p-5 bg-zinc-900 animate-pulse">
              <div className="h-5 bg-zinc-700 rounded w-3/4 mb-3" />
              <div className="h-4 bg-zinc-800 rounded w-full mb-2" />
              <div className="h-4 bg-zinc-800 rounded w-2/3" />
            </div>
          ))}
        </div>
      ) : articles.length === 0 ? (
        <div className="text-center py-20 text-zinc-500">
          <p className="text-lg mb-2">
            {levelFilter > 0
              ? `Nessun articolo con rilevanza "${LEVEL_LABELS[levelFilter]}".`
              : "Nessun articolo ancora."}
          </p>
          {levelFilter === 0 && (
            <p className="text-sm">
              Avvia la pipeline dal pannello{" "}
              <a href="/admin" className="text-cyan-400 hover:underline">Admin</a>{" "}
              per generare i primi articoli.
            </p>
          )}
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {articles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="mt-10 flex items-center justify-center gap-2">
              {page > 1 && (
                <button
                  onClick={() => setPage(page - 1)}
                  className="px-4 py-2 text-sm rounded-lg border border-zinc-700 text-zinc-300 hover:border-zinc-500 hover:text-white transition-colors"
                >
                  ← Precedente
                </button>
              )}
              <span className="px-4 py-2 text-sm text-zinc-500">
                Pagina {page} di {totalPages}
              </span>
              {page < totalPages && (
                <button
                  onClick={() => setPage(page + 1)}
                  className="px-4 py-2 text-sm rounded-lg border border-zinc-700 text-zinc-300 hover:border-zinc-500 hover:text-white transition-colors"
                >
                  Successiva →
                </button>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
