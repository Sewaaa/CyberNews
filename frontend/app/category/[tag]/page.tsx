import Link from "next/link";
import { getArticles, getTags } from "@/lib/api";
import ArticleCard from "@/components/ArticleCard";
import TagBadge, { TAG_COLORS, DEFAULT_TAG_COLOR } from "@/components/TagBadge";

export const revalidate = 60;

interface PageProps {
  params: Promise<{ tag: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { tag } = await params;
  return {
    title: `#${tag} — FoxScan`,
    description: `Articoli di cybersecurity sul tema ${tag}`,
  };
}

export default async function CategoryPage({ params }: PageProps) {
  const { tag } = await params;
  const decoded = decodeURIComponent(tag);

  const [articlesRes, allTags] = await Promise.all([
    getArticles({ tag: decoded, limit: 30 }).catch(() => ({
      total: 0,
      offset: 0,
      limit: 30,
      items: [],
    })),
    getTags().catch(() => []),
  ]);

  return (
    <div>
      <div className="mb-6">
        <p className="text-sm text-gray-500 dark:text-slate-400 mb-2">Categoria</p>
        <h1 className="text-3xl font-bold text-[#0B1F3A] dark:text-slate-100">
          <TagBadge tag={decoded} linked={false} />
        </h1>
      </div>

      {/* Barra tag orizzontale */}
      <div className="mb-8 flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {/* Tutti */}
        <Link
          href="/category/tutti"
          className="shrink-0 px-3 py-1 rounded-full text-xs font-semibold border transition-all bg-blue-100 text-blue-800 border-blue-200 dark:bg-white/10 dark:text-slate-200 dark:border-white/10 opacity-60 hover:opacity-100"
        >
          Tutti
        </Link>
        {/* Tag attivo + altri */}
        {allTags.map(({ tag: t }) => {
          const isActive = t === decoded;
          const color = TAG_COLORS[t] ?? DEFAULT_TAG_COLOR;
          return (
            <Link
              key={t}
              href={`/category/${encodeURIComponent(t)}`}
              className={`shrink-0 px-3 py-1 rounded-full text-xs font-semibold border transition-all ${color} ${
                isActive
                  ? "ring-2 ring-offset-1 ring-current opacity-100 scale-105"
                  : "opacity-60 hover:opacity-100"
              }`}
            >
              {t}
            </Link>
          );
        })}
      </div>

      {articlesRes.items.length === 0 ? (
        <div className="text-center py-20 text-gray-500 dark:text-zinc-500">
          Nessun articolo per questa categoria.
        </div>
      ) : (
        <div className="space-y-4">
          {articlesRes.items.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      )}
    </div>
  );
}
