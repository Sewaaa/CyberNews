"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { getArticles, ArticleSummary } from "@/lib/api";
import TagBadge from "@/components/TagBadge";
import RelevanceDots from "@/components/RelevanceDots";
import CyberLoader from "@/components/CyberLoader";

const PAGE_SIZE = 12;

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const minutes = Math.floor(diff / 60_000);
  const hours = Math.floor(diff / 3_600_000);
  if (minutes < 2) return "pochi minuti fa";
  if (minutes < 60) return `${minutes} min fa`;
  if (hours < 24) return `${hours} or${hours === 1 ? "a" : "e"} fa`;
  return new Date(iso).toLocaleDateString("it-IT", { day: "2-digit", month: "short" });
}

function ArticleRow({ article }: { article: ArticleSummary }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <Link
        href={`/article/${article.id}`}
        className="card-blue flex gap-4 p-4 group hover:border-blue-300 dark:hover:border-[#00FFE5]/30 transition-colors"
      >
        {/* Immagine */}
        <div className={`shrink-0 w-20 h-20 rounded-xl overflow-hidden card-img-bg ${article.image_url ? "bg-blue-50" : "img-placeholder"}`}>
          {article.image_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={article.image_url}
              alt=""
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
                (e.target as HTMLImageElement).parentElement!.classList.add("img-placeholder");
              }}
            />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img src="/testa_nobg.png" alt="" className="w-full h-full object-contain p-3 opacity-10" />
          )}
        </div>

        {/* Contenuto */}
        <div className="flex-1 min-w-0 flex flex-col justify-between gap-1.5">
          <h3 className="card-title font-grotesk font-bold text-sm text-[#0B1F3A] dark:text-slate-100 leading-snug line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-[#00FFE5] transition-colors">
            {article.title}
          </h3>
          <div className="flex items-center gap-2 flex-wrap">
            {article.tags.slice(0, 2).map((tag) => (
              <TagBadge key={tag} tag={tag} linked={false} />
            ))}
          </div>
          <div className="flex items-center gap-3 mt-auto">
            <RelevanceDots score={article.relevance_score} showLabel={false} />
            <time className="text-xs text-gray-400 card-meta">{timeAgo(article.published_at)}</time>
            <span className="ml-auto text-xs text-blue-600 dark:text-[#00FFE5]/80 font-semibold shrink-0">
              Leggi →
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export default function TuttiPage() {
  const [articles, setArticles] = useState<ArticleSummary[]>([]);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const loadingRef = useRef(false);

  const loadMore = useCallback(async (currentOffset: number) => {
    if (loadingRef.current || !hasMore) return;
    loadingRef.current = true;
    setLoading(true);
    try {
      const res = await getArticles({ limit: PAGE_SIZE, offset: currentOffset });
      setArticles((prev) => [...prev, ...res.items]);
      const nextOffset = currentOffset + res.items.length;
      setOffset(nextOffset);
      if (nextOffset >= res.total || res.items.length < PAGE_SIZE) {
        setHasMore(false);
      }
    } catch {
      // silently fail
    } finally {
      setLoading(false);
      loadingRef.current = false;
    }
  }, [hasMore]);

  // Caricamento iniziale
  useEffect(() => {
    loadMore(0);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // IntersectionObserver per infinite scroll
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loadingRef.current) {
          setOffset((prev) => {
            loadMore(prev);
            return prev;
          });
        }
      },
      { rootMargin: "200px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [loadMore]);

  return (
    <div className="max-w-3xl mx-auto fade-up py-4">

      {/* Header */}
      <div className="mb-8">
        <Link href="/" className="text-sm text-blue-600 dark:text-[#00FFE5] hover:underline">
          ← Torna alla homepage
        </Link>
        <h1 className="text-2xl md:text-3xl font-extrabold text-[#0B1F3A] dark:text-slate-100 mt-4 mb-2 font-grotesk">
          Tutti gli articoli
        </h1>
        <p className="text-sm text-gray-500 dark:text-slate-400">
          Il feed completo — dal più recente.
        </p>
      </div>

      {/* Lista */}
      <div className="flex flex-col gap-3">
        {articles.map((a) => (
          <ArticleRow key={a.id} article={a} />
        ))}
      </div>

      {/* Sentinel + loader */}
      <div ref={sentinelRef} className="h-4" />
      {loading && (
        <div className="flex justify-center py-8">
          <CyberLoader size={48} />
        </div>
      )}
      {!hasMore && articles.length > 0 && (
        <p className="text-center text-xs text-gray-400 dark:text-slate-600 py-8 font-mono tracking-widest uppercase">
          — Fine del feed —
        </p>
      )}
    </div>
  );
}
