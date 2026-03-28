"use client";

import Link from "next/link";
import { ArticleSummary } from "@/lib/api";

interface NewsTickerProps {
  articles: ArticleSummary[];
}

export default function NewsTicker({ articles }: NewsTickerProps) {
  if (articles.length === 0) return null;

  // Duplicate for seamless loop
  const items = [...articles, ...articles];

  return (
    <div className="overflow-hidden border-b border-blue-100/80 dark:border-white/5 bg-white/70 dark:bg-[#020817]/70 backdrop-blur-sm flex items-stretch h-9 shrink-0">
      {/* LIVE badge */}
      <div className="shrink-0 flex items-center px-4 bg-red-600 dark:bg-red-500/90 text-white text-[10px] font-black font-mono tracking-[0.25em] uppercase select-none">
        LIVE
      </div>

      {/* Separator */}
      <div className="shrink-0 w-px bg-red-200 dark:bg-red-500/30" />

      {/* Scrolling strip */}
      <div className="flex-1 overflow-hidden relative">
        {/* Fade edges */}
        <div className="absolute left-0 inset-y-0 w-8 bg-gradient-to-r from-white dark:from-[#020817] to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 inset-y-0 w-8 bg-gradient-to-l from-white dark:from-[#020817] to-transparent z-10 pointer-events-none" />

        <div className="flex h-full animate-ticker items-center">
          {items.map((a, i) => (
            <Link
              key={i}
              href={`/article/${a.id}`}
              className="shrink-0 inline-flex items-center gap-2 px-5 text-xs text-gray-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-[#00FFE5] transition-colors whitespace-nowrap group"
            >
              <span
                className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                  a.relevance_score >= 8
                    ? "bg-red-500 animate-pulse"
                    : a.relevance_score >= 5
                    ? "bg-orange-400"
                    : "bg-green-500"
                }`}
              />
              <span className="group-hover:underline underline-offset-2">{a.title}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
