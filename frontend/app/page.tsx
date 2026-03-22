"use client";

import { useEffect, useState } from "react";
import { getArticles, getTags, ArticleSummary, TagCount } from "@/lib/api";
import ArticleCard from "@/components/ArticleCard";
import TagBadge from "@/components/TagBadge";
import Link from "next/link";

const PAGE_SIZE = 10;

export default function HomePage() {
  const [page, setPage] = useState(1);
  const [articles, setArticles] = useState<ArticleSummary[]>([]);
  const [total, setTotal] = useState(0);
  const [tags, setTags] = useState<TagCount[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const offset = (page - 1) * PAGE_SIZE;
    Promise.all([
      getArticles({ limit: PAGE_SIZE, offset }).catch(() => ({ total: 0, offset: 0, limit: PAGE_SIZE, items: [] })),
      getTags().catch(() => []),
    ]).then(([articlesRes, tagsRes]) => {
      setArticles(articlesRes.items);
      setTotal(articlesRes.total);
      setTags(tagsRes);
      setLoading(false);
    });
  }, [page]);

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

      {/* Tag cloud */}
      {topTags.length > 0 && (
        <div className="mb-8 flex flex-wrap gap-2">
          {topTags.map(({ tag, count }) => (
            <span key={tag} className="flex items-center gap-1.5">
              <TagBadge tag={tag} />
              <span className="text-xs text-zinc-600">{count}</span>
            </span>
          ))}
        </div>
      )}

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
          <p className="text-lg mb-2">Nessun articolo ancora.</p>
          <p className="text-sm">
            Avvia la pipeline dal pannello{" "}
            <a href="/admin" className="text-cyan-400 hover:underline">Admin</a>{" "}
            per generare i primi articoli.
          </p>
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
