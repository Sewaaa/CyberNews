"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Filter, Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getArticles, getTags, ArticleSummary, TagCount } from "@/lib/api";
import TagBadge from "@/components/TagBadge";
import RelevanceDots from "@/components/RelevanceDots";
import CyberLoader from "@/components/CyberLoader";
import NewsTicker from "@/components/NewsTicker";
import Sidebar from "@/components/Sidebar";

const PAGE_SIZE = 9;

const LEVEL_RANGES: Record<number, { min_score?: number; max_score?: number }> = {
  0: {},
  1: { min_score: 1, max_score: 4 },
  2: { min_score: 5, max_score: 7 },
  3: { min_score: 8 },
};
const LEVEL_LABELS: Record<number, string> = { 0: "Tutti", 1: "Bassa", 2: "Media", 3: "Critica" };

function getLevel(score: number) {
  if (score >= 8) return 3;
  if (score >= 5) return 2;
  return 1;
}
function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60_000);
  const h = Math.floor(diff / 3_600_000);
  if (m < 2) return "pochi min fa";
  if (m < 60) return `${m} min fa`;
  if (h < 24) return `${h} or${h === 1 ? "a" : "e"} fa`;
  return new Date(iso).toLocaleDateString("it-IT", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });
}
function fmtShort(iso: string) {
  return new Date(iso).toLocaleDateString("it-IT", { day: "2-digit", month: "short" });
}

/* ── Framer Motion ────────────────────────────────────────────────────────── */
const cardGrid = {
  hidden: { opacity: 0 },
  show:   { opacity: 1, transition: { staggerChildren: 0.06, delayChildren: 0.04 } },
};
const cardItem = {
  hidden: { opacity: 0, y: 14, scale: 0.985 },
  show:   { opacity: 1, y: 0,  scale: 1, transition: { duration: 0.36, ease: [0.25, 0.46, 0.45, 0.94] as [number,number,number,number] } },
};

/* ── Pill classes ─────────────────────────────────────────────────────────── */
function pillCls(level: number) {
  if (level === 3) return "pill-high  bg-red-50    text-red-700    border border-red-200";
  if (level === 2) return "pill-medium bg-orange-50 text-orange-700 border border-orange-200";
  return              "pill-low   bg-green-50  text-green-700  border border-green-200";
}

/* ═══════════════════════════════════════════════════════════════════════════
   BENTO HERO CARD — large, first position (2-col wide)
   ═══════════════════════════════════════════════════════════════════════════ */
function BentoHeroCard({ article }: { article: ArticleSummary }) {
  const level = getLevel(article.relevance_score);
  const hasImage = !!article.image_url;
  return (
    <Link
      href={`/article/${article.id}`}
      className={`card-blue flex flex-col h-full group overflow-hidden ${level === 3 ? "critical-pulse" : ""}`}
    >
      {/* Image */}
      <div
        className={`relative overflow-hidden shrink-0 ${
          hasImage ? "bg-blue-50 card-img-bg" : "img-placeholder"
        }`}
        style={{ height: "clamp(200px, 32vw, 300px)" }}
      >
        {hasImage ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={article.image_url!}
              alt=""
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              onError={(e) => {
                const el = e.target as HTMLImageElement;
                el.style.display = "none";
                el.parentElement!.classList.add("img-placeholder");
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
          </>
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img src="/testa_nobg.png" alt="" className="absolute inset-0 w-full h-full object-contain p-12 opacity-10" />
        )}
        {/* Threat badge */}
        <div className="absolute top-3 left-3">
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold backdrop-blur-sm ${
            level === 3 ? "bg-red-600/85 text-white" :
            level === 2 ? "bg-orange-500/85 text-white" :
                          "bg-green-600/85 text-white"
          }`}>
            <span className="flex gap-0.5">
              {[0,1,2].map(i => <span key={i} className={`w-1.5 h-1.5 rounded-full ${i < level ? "bg-white" : "bg-white/30"}`} />)}
            </span>
            {LEVEL_LABELS[level]}
          </span>
        </div>
        {level === 3 && (
          <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-transparent via-red-500 to-transparent opacity-90" />
        )}
      </div>

      {/* Content */}
      <div className="p-5 xl:p-6 flex flex-col flex-1">
        <h3 className="card-title font-grotesk font-bold text-[#0B1F3A] text-lg xl:text-xl leading-snug mb-2.5 group-hover:text-blue-600 dark:group-hover:text-[#00FFE5] transition-colors line-clamp-2">
          {article.title}
        </h3>
        {article.summary && (
          <p className="text-sm text-gray-500 dark:text-slate-500 leading-relaxed line-clamp-2 xl:line-clamp-3 mb-4">
            {article.summary}
          </p>
        )}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {article.tags.slice(0, 4).map((tag) => <TagBadge key={tag} tag={tag} linked={false} />)}
        </div>
        <div className="mt-auto flex items-center justify-between border-t border-blue-50 dark:border-white/5 pt-3">
          <span className="text-xs text-gray-400 card-meta font-mono">
            {fmtShort(article.published_at)} · {article.sources.length} fonte{article.sources.length !== 1 ? "i" : ""}
          </span>
          <span className="text-blue-600 dark:text-[#00FFE5] font-semibold text-sm group-hover:translate-x-0.5 transition-transform inline-block">
            Leggi →
          </span>
        </div>
      </div>
    </Link>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   GRID CARD — compact, regular grid positions
   ═══════════════════════════════════════════════════════════════════════════ */
function GridCard({ article }: { article: ArticleSummary }) {
  const level = getLevel(article.relevance_score);
  const hasImage = !!article.image_url;
  return (
    <Link
      href={`/article/${article.id}`}
      className={`card-blue flex flex-col group overflow-hidden h-full ${level === 3 ? "critical-pulse" : ""}`}
    >
      {/* Thumbnail */}
      <div
        className={`relative shrink-0 overflow-hidden card-img-bg ${hasImage ? "bg-blue-50" : "img-placeholder"}`}
        style={{ height: 140 }}
      >
        {hasImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={article.image_url!}
            alt=""
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              (e.target as HTMLImageElement).parentElement!.classList.add("img-placeholder");
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img src="/testa_nobg.png" alt="" className="w-full h-full object-contain p-6 opacity-10" />
        )}
        {/* Threat accent line */}
        <div className={`absolute inset-x-0 bottom-0 h-0.5 ${
          level === 3 ? "bg-red-500" : level === 2 ? "bg-orange-400" : "bg-green-500"
        } opacity-60`} />
      </div>

      {/* Content */}
      <div className="p-3.5 xl:p-4 flex flex-col flex-1">
        <span className="card-title font-grotesk font-bold text-[#0B1F3A] text-sm leading-snug line-clamp-2 mb-2 group-hover:text-blue-600 dark:group-hover:text-[#00FFE5] transition-colors">
          {article.title}
        </span>
        <div className="hidden lg:flex flex-wrap gap-1 mb-2.5">
          {article.tags.slice(0, 2).map((tag) => <TagBadge key={tag} tag={tag} />)}
        </div>
        <div className="mt-auto flex items-center gap-2 pt-2 border-t border-blue-50 dark:border-white/5">
          <RelevanceDots score={article.relevance_score} showLabel={false} />
          <time className="text-xs text-gray-400 card-meta flex-1 truncate font-mono">{timeAgo(article.published_at)}</time>
          <span className="shrink-0 text-blue-600 dark:text-[#00FFE5]/80 font-semibold text-xs group-hover:translate-x-0.5 transition-transform inline-block">
            →
          </span>
        </div>
      </div>
    </Link>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   BENTO GRID — article[0] = hero (2-col), rest = uniform grid
   ═══════════════════════════════════════════════════════════════════════════ */
function BentoGrid({ articles }: { articles: ArticleSummary[] }) {
  if (articles.length === 0) return null;
  const [hero, ...rest] = articles;

  return (
    <motion.div variants={cardGrid} initial="hidden" animate="show">
      {/* Hero row: hero takes 2 cols, next 2 articles stack in 3rd col */}
      <div className="bento-grid grid gap-4">
        {/* Hero: 2-col span */}
        <motion.div variants={cardItem} className="bento-hero">
          <BentoHeroCard article={hero} />
        </motion.div>

        {/* Articles 1 & 2: stack in 3rd column (desktop) */}
        {rest.slice(0, 2).map((a) => (
          <motion.div key={a.id} variants={cardItem} className="bento-side">
            <GridCard article={a} />
          </motion.div>
        ))}

        {/* Remaining articles: fill 3-col rows */}
        {rest.slice(2).map((a) => (
          <motion.div key={a.id} variants={cardItem} className="bento-cell">
            <GridCard article={a} />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   DAILY BRIEFING — shown below grid on mobile (lg:hidden)
   ═══════════════════════════════════════════════════════════════════════════ */
function DailyBriefing({ articles }: { articles: ArticleSummary[] }) {
  const top5 = articles.slice(0, 5);
  if (top5.length === 0) return null;
  return (
    <section className="relative bg-blue-50 dark:bg-transparent border border-blue-100 dark:border-[#00FFE5]/10 rounded-3xl overflow-hidden mt-10">
      <div className="absolute inset-0 dot-grid-bg opacity-10 dark:opacity-100 dark:cyber-grid-bg" />
      <div className="absolute inset-0 dark:bg-gradient-to-br dark:from-[#00FFE5]/4 dark:via-transparent dark:to-[#7C3AED]/4 pointer-events-none" />
      <div className="relative z-10 px-5 py-8 md:px-8 md:py-10 md:flex items-center gap-10">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-4">
            <Zap size={16} className="text-blue-600 dark:text-[#00FFE5] shrink-0" />
            <h2 className="no-dark font-grotesk font-extrabold text-lg text-[#0B1F3A] dark:text-white">
              Top criticità di oggi
            </h2>
          </div>
          <ol className="space-y-2.5 mb-6">
            {top5.map((a, i) => {
              const level = getLevel(a.relevance_score);
              return (
                <li key={a.id}>
                  <Link href={`/article/${a.id}`} className="flex items-center gap-3 group py-0.5">
                    <span className="shrink-0 w-5 h-5 rounded-full bg-blue-100 dark:bg-[#00FFE5]/10 text-blue-600 dark:text-[#00FFE5] text-xs font-bold font-mono flex items-center justify-center">
                      {i + 1}
                    </span>
                    <span className="text-sm text-blue-900 dark:text-slate-300 group-hover:text-[#0B1F3A] dark:group-hover:text-white line-clamp-1 flex-1 transition-colors">
                      {a.title}
                    </span>
                    <span className="flex gap-0.5 shrink-0">
                      {[0,1,2].map(j => (
                        <span key={j} className={`w-1.5 h-1.5 rounded-full ${
                          j < level
                            ? level===1?"bg-green-400":level===2?"bg-orange-400":"bg-red-400"
                            : "bg-blue-200 dark:bg-white/10"
                        }`} />
                      ))}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ol>
          <Link href="/" className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#0B1F3A] dark:bg-[#00FFE5] text-white dark:text-[#020817] rounded-full text-sm font-bold font-grotesk hover:opacity-90 transition-opacity">
            Vedi tutte →
          </Link>
        </div>
        {/* Mascot */}
        <div className="shrink-0 flex justify-center mt-8 md:mt-0">
          <div className="relative w-40 h-40 md:w-52 md:h-52">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/podio_nobg.png" alt="" className="w-full h-full object-contain drop-shadow-2xl victory-anim neon-glow-logo"
              onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-32 h-8 bg-[#00FFE5] opacity-15 blur-xl rounded-full" />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   SKELETON
   ═══════════════════════════════════════════════════════════════════════════ */
function SkeletonBento() {
  return (
    <div className="bento-grid grid gap-4">
      {/* Hero skeleton */}
      <div className="bento-hero card-blue overflow-hidden cyber-scan">
        <div className="skeleton" style={{ height: "clamp(200px, 32vw, 300px)" }} />
        <div className="p-5">
          <div className="h-4 skeleton rounded w-1/4 mb-3" />
          <div className="h-6 skeleton rounded w-full mb-2" />
          <div className="h-6 skeleton rounded w-3/4 mb-4" />
          <div className="h-12 skeleton rounded-xl" />
        </div>
      </div>
      {/* Side skeletons */}
      {[0, 1].map((i) => (
        <div key={i} className="bento-side card-blue overflow-hidden">
          <div className="skeleton" style={{ height: 140 }} />
          <div className="p-3.5">
            <div className="h-4 skeleton rounded w-full mb-2" />
            <div className="h-4 skeleton rounded w-2/3" />
          </div>
        </div>
      ))}
      {/* Cell skeletons */}
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="bento-cell card-blue overflow-hidden">
          <div className="skeleton" style={{ height: 140 }} />
          <div className="p-3.5">
            <div className="h-4 skeleton rounded w-full mb-2" />
            <div className="h-4 skeleton rounded w-2/3" />
          </div>
        </div>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   MAIN PAGE
   ═══════════════════════════════════════════════════════════════════════════ */
export default function HomePage() {
  const [page, setPage] = useState(1);
  const goToPage = (n: number) => {
    setPage(n);
    setTimeout(() => document.getElementById("main-feed")?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
  };

  const [levelFilter, setLevelFilter] = useState(0);
  const [articles, setArticles]       = useState<ArticleSummary[]>([]);
  const [allLatest, setAllLatest]     = useState<ArticleSummary[]>([]);
  const [total, setTotal]             = useState(0);
  const [tags, setTags]               = useState<TagCount[]>([]);
  const [loading, setLoading]         = useState(true);
  const [tagsOpen, setTagsOpen]       = useState(false);
  const [retryCount, setRetryCount]   = useState(0);

  // Latest 20 for ticker + briefing
  useEffect(() => {
    getArticles({ limit: 20 }).then((r) => setAllLatest(r.items)).catch(() => {});
  }, [retryCount]);

  // Paginated filtered articles
  useEffect(() => {
    setLoading(true);
    const offset = (page - 1) * PAGE_SIZE;
    Promise.all([
      getArticles({ limit: PAGE_SIZE, offset, ...LEVEL_RANGES[levelFilter] }),
      getTags(),
    ]).then(([res, tagsRes]) => {
      setArticles(res.items);
      setTotal(res.total);
      setTags(tagsRes);
      setLoading(false);
    }).catch(() => {
      setLoading(false);
      if (retryCount < 4) setTimeout(() => setRetryCount((r) => r + 1), 5000 * (retryCount + 1));
    });
  }, [page, levelFilter, retryCount]);

  function changeLevel(lvl: number) { setLevelFilter(lvl); setPage(1); }

  const totalPages = Math.ceil(total / PAGE_SIZE);
  const topTags    = tags.slice(0, 15);
  const briefing   = allLatest.filter((a) => getLevel(a.relevance_score) >= 2).sort((a, b) => b.relevance_score - a.relevance_score);

  return (
    <div className="fade-up flex flex-col gap-0">

      {/* ── Ticker (negative margin to bleed to layout edge) ── */}
      <div className="-mx-4 sm:-mx-6">
        <NewsTicker articles={allLatest} />
      </div>

      {/* ── Layout: sidebar + main ── */}
      <div className="flex items-start gap-5 xl:gap-7 mt-6">

        {/* Sidebar (lg+) */}
        <aside className="hidden lg:block w-52 xl:w-60 shrink-0">
          <div className="sticky top-[4.5rem] overflow-y-auto max-h-[calc(100vh-5rem)] pb-4 scrollbar-hide">
            <Sidebar
              levelFilter={levelFilter}
              onLevelChange={changeLevel}
              tags={topTags}
              briefing={briefing}
              allArticles={articles}
            />
          </div>
        </aside>

        {/* Main feed */}
        <div id="main-feed" className="flex-1 min-w-0 scroll-mt-20">

          {/* Mobile filter bar (< lg) */}
          <div className="lg:hidden flex items-center gap-2 mb-4 overflow-x-auto scrollbar-hide pb-1">
            <button
              onClick={() => setTagsOpen(!tagsOpen)}
              className="tag-toggle-btn shrink-0 flex items-center gap-1.5 text-xs font-medium text-gray-500 px-3 py-2 border border-blue-100 dark:border-white/8 rounded-full bg-white dark:bg-[#080e1e]"
            >
              <Filter size={12} /> Categorie {tagsOpen ? "▲" : "▼"}
            </button>
            {([0, 1, 2, 3] as const).map((lvl) => (
              <button
                key={lvl}
                onClick={() => changeLevel(lvl)}
                className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                  levelFilter === lvl
                    ? "border-blue-600 bg-blue-600 text-white dark:border-[#00FFE5] dark:bg-[#00FFE5]/15 dark:text-[#00FFE5]"
                    : "filter-btn-inactive border-blue-200 bg-white"
                }`}
              >
                {lvl > 0 && (
                  <span className="flex gap-0.5">
                    {[0,1,2].map(i => <span key={i} className={`w-1.5 h-1.5 rounded-full ${
                      i < lvl ? lvl===1?"bg-green-500":lvl===2?"bg-orange-500":"bg-red-500"
                               : levelFilter===lvl?"bg-current opacity-30":"bg-blue-100 dark:bg-slate-600"
                    }`} />)}
                  </span>
                )}
                {LEVEL_LABELS[lvl]}
              </button>
            ))}
          </div>

          {/* Mobile tag expansion */}
          {tagsOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="lg:hidden flex flex-wrap gap-2 mb-4 overflow-hidden"
            >
              {topTags.map(({ tag }) => <TagBadge key={tag} tag={tag} />)}
            </motion.div>
          )}

          {/* Feed header */}
          <div className="flex items-center justify-between mb-4">
            <h1 className="font-grotesk font-extrabold text-lg text-[#0B1F3A] dark:text-slate-100">
              Ultime notizie
            </h1>
            {!loading && total > 0 && (
              <span className="text-xs font-mono text-gray-400 dark:text-slate-600">
                {total} articoli
              </span>
            )}
          </div>

          {/* Grid / Loading / Empty */}
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <div className="flex items-center gap-3 mb-6">
                  <CyberLoader size={44} />
                  <p className="text-xs font-mono tracking-widest text-gray-400 dark:text-[#00FFE5]/35 uppercase animate-pulse">
                    Caricamento feed...
                  </p>
                </div>
                <SkeletonBento />
              </motion.div>
            ) : articles.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-20"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/error_nobg.png" alt="" className="w-28 h-28 object-contain mx-auto mb-4 float-anim opacity-70 neon-glow-logo"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                <p className="font-grotesk font-semibold text-gray-500 dark:text-slate-400 mb-1">
                  {levelFilter > 0 ? `Nessun articolo con rilevanza "${LEVEL_LABELS[levelFilter]}".` : "Nessuna notizia ancora..."}
                </p>
                {levelFilter === 0 && (
                  <p className="text-sm text-gray-400 dark:text-slate-500">
                    Avvia la pipeline dal{" "}
                    <Link href="/admin" className="text-blue-600 dark:text-[#00FFE5] hover:underline font-medium">pannello Admin</Link>.
                  </p>
                )}
              </motion.div>
            ) : (
              <motion.div key={`grid-${page}-${levelFilter}`}>
                <BentoGrid articles={articles} />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Pagination */}
          {!loading && totalPages > 1 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.25 }}
              className="mt-8 flex items-center justify-center gap-2"
            >
              {page > 1 && (
                <button onClick={() => goToPage(page - 1)}
                  className="page-btn-prev px-5 py-2.5 text-sm rounded-full border border-blue-200 text-[#0B1F3A] font-medium hover:border-blue-400 hover:bg-blue-50 transition-all dark:bg-[#080e1e]">
                  ← Prec.
                </button>
              )}
              <span className="px-4 py-2 text-sm text-gray-400 dark:text-slate-500 font-mono">
                {page} / {totalPages}
              </span>
              {page < totalPages && (
                <button onClick={() => goToPage(page + 1)}
                  className="px-5 py-2.5 text-sm rounded-full bg-[#0B1F3A] dark:bg-[#00FFE5] text-white dark:text-[#020817] font-semibold hover:opacity-90 transition-opacity">
                  Succ. →
                </button>
              )}
            </motion.div>
          )}

          {/* Daily Briefing — mobile only (sidebar shows it on desktop) */}
          <div className="lg:hidden">
            <DailyBriefing articles={briefing} />
          </div>
        </div>
      </div>
    </div>
  );
}
