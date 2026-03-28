"use client";

import Link from "next/link";
import { ArticleSummary, TagCount } from "@/lib/api";

const LEVEL_LABELS = ["Tutti", "Bassa", "Media", "Critica"] as const;

interface SidebarProps {
  levelFilter: number;
  onLevelChange: (lvl: number) => void;
  tags: TagCount[];
  briefing: ArticleSummary[];
  allArticles: ArticleSummary[];
}

function getLevel(score: number) {
  if (score >= 8) return 3;
  if (score >= 5) return 2;
  return 1;
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60_000);
  const h = Math.floor(diff / 3_600_000);
  if (m < 2) return "ora";
  if (m < 60) return `${m}m fa`;
  if (h < 24) return `${h}h fa`;
  return new Date(iso).toLocaleDateString("it-IT", { day: "2-digit", month: "short" });
}

export default function Sidebar({
  levelFilter,
  onLevelChange,
  tags,
  briefing,
  allArticles,
}: SidebarProps) {
  const total = allArticles.length || 1;
  const high   = allArticles.filter((a) => getLevel(a.relevance_score) === 3).length;
  const medium = allArticles.filter((a) => getLevel(a.relevance_score) === 2).length;
  const low    = allArticles.filter((a) => getLevel(a.relevance_score) === 1).length;

  const top3 = briefing.slice(0, 3);

  return (
    <div className="space-y-3 text-sm">

      {/* ── Threat Meter ── */}
      <div className="card-blue p-4">
        <h3 className="font-grotesk font-semibold uppercase tracking-widest text-[10px] text-gray-400 dark:text-slate-600 mb-3">
          Stato minacce
        </h3>
        <div className="space-y-2.5">
          {[
            { label: "Critica", count: high,   pct: (high   / total) * 100, bar: "bg-red-500",    text: "text-red-500 dark:text-red-400" },
            { label: "Media",   count: medium, pct: (medium / total) * 100, bar: "bg-orange-400", text: "text-orange-500 dark:text-orange-400" },
            { label: "Bassa",   count: low,    pct: (low    / total) * 100, bar: "bg-green-500",  text: "text-green-600 dark:text-green-400" },
          ].map(({ label, count, pct, bar, text }) => (
            <div key={label} className="flex items-center gap-2">
              <span className={`w-10 text-xs font-mono font-bold shrink-0 ${text}`}>{count}</span>
              <div className="flex-1 h-1.5 rounded-full bg-gray-100 dark:bg-white/5 overflow-hidden">
                <div
                  className={`h-full rounded-full ${bar} transition-all duration-1000`}
                  style={{ width: `${Math.max(pct, 3)}%` }}
                />
              </div>
              <span className="w-12 text-[11px] text-gray-400 dark:text-slate-600 text-right shrink-0">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Rilevanza filter ── */}
      <div className="card-blue p-4">
        <h3 className="font-grotesk font-semibold uppercase tracking-widest text-[10px] text-gray-400 dark:text-slate-600 mb-3">
          Rilevanza
        </h3>
        <div className="flex flex-col gap-1">
          {([0, 1, 2, 3] as const).map((lvl) => (
            <button
              key={lvl}
              onClick={() => onLevelChange(lvl)}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-left font-medium transition-all ${
                levelFilter === lvl
                  ? "bg-blue-600 dark:bg-[#00FFE5]/12 text-white dark:text-[#00FFE5] border border-blue-600 dark:border-[#00FFE5]/25"
                  : "text-gray-500 dark:text-slate-500 hover:bg-gray-50 dark:hover:bg-white/4 border border-transparent"
              }`}
            >
              {lvl > 0 && (
                <span className="flex gap-0.5 shrink-0">
                  {[0, 1, 2].map((i) => (
                    <span
                      key={i}
                      className={`w-1.5 h-1.5 rounded-full ${
                        i < lvl
                          ? lvl === 1 ? "bg-green-500"
                            : lvl === 2 ? "bg-orange-400"
                            : "bg-red-500"
                          : levelFilter === lvl
                          ? "bg-current opacity-25"
                          : "bg-gray-200 dark:bg-slate-700"
                      }`}
                    />
                  ))}
                </span>
              )}
              <span className="text-xs">{LEVEL_LABELS[lvl]}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ── Categorie ── */}
      {tags.length > 0 && (
        <div className="card-blue p-4">
          <h3 className="font-grotesk font-semibold uppercase tracking-widest text-[10px] text-gray-400 dark:text-slate-600 mb-3">
            Categorie
          </h3>
          <div className="space-y-0.5">
            {tags.slice(0, 10).map(({ tag, count }) => (
              <Link
                key={tag}
                href={`/category/${encodeURIComponent(tag)}`}
                className="flex items-center justify-between px-2 py-1.5 rounded-lg hover:bg-gray-50 dark:hover:bg-white/4 transition-colors group"
              >
                <span className="text-xs text-gray-600 dark:text-slate-400 group-hover:text-blue-600 dark:group-hover:text-[#00FFE5] transition-colors capitalize truncate">
                  {tag}
                </span>
                <span className="text-[11px] text-gray-400 dark:text-slate-700 font-mono ml-2 shrink-0">
                  {count}
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* ── Top Criticità ── */}
      {top3.length > 0 && (
        <div className="card-blue p-4">
          <h3 className="font-grotesk font-semibold uppercase tracking-widest text-[10px] text-gray-400 dark:text-slate-600 mb-3">
            Top criticità
          </h3>
          <ol className="space-y-3">
            {top3.map((a, i) => (
              <li key={a.id}>
                <Link href={`/article/${a.id}`} className="flex items-start gap-2.5 group">
                  <span className="shrink-0 w-5 h-5 rounded-full bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 text-[10px] font-bold font-mono flex items-center justify-center mt-0.5">
                    {i + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium text-gray-700 dark:text-slate-300 group-hover:text-blue-600 dark:group-hover:text-[#00FFE5] transition-colors line-clamp-2 leading-snug">
                      {a.title}
                    </p>
                    <span className="text-[10px] text-gray-400 dark:text-slate-600 font-mono mt-0.5 block">
                      {timeAgo(a.published_at)}
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ol>
        </div>
      )}

      {/* ── RSS link ── */}
      <Link
        href="/rss"
        className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-dashed border-blue-200 dark:border-white/8 text-xs text-gray-400 dark:text-slate-600 hover:text-blue-600 dark:hover:text-[#00FFE5] hover:border-blue-400 dark:hover:border-[#00FFE5]/20 transition-all"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 11a9 9 0 0 1 9 9"/><path d="M4 4a16 16 0 0 1 16 16"/><circle cx="5" cy="19" r="1"/>
        </svg>
        <span>Iscriviti al Feed RSS</span>
      </Link>

    </div>
  );
}
