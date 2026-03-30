import type { Metadata } from "next";
import Link from "next/link";
import { getTags } from "@/lib/api";
import TagBadge from "@/components/TagBadge";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Esplora categorie — FoxScan",
  description: "Sfoglia tutte le categorie di notizie cybersecurity su FoxScan.",
};

export default async function CategoryIndexPage() {
  const tags = await getTags().catch(() => []);

  return (
    <div className="max-w-3xl mx-auto fade-up py-4">

      {/* Header */}
      <div className="mb-8">
        <Link href="/" className="text-sm text-orange-600 dark:text-[#F97316] hover:underline">
          ← Torna alla homepage
        </Link>
        <h1 className="text-2xl md:text-3xl font-extrabold text-[#1C0E00] dark:text-slate-100 mt-4 mb-2 font-grotesk">
          Esplora categorie
        </h1>
        <p className="text-sm text-gray-500 dark:text-slate-400">
          {tags.length} categorie disponibili — clicca per leggere gli articoli.
        </p>
      </div>

      {tags.length === 0 ? (
        <p className="text-gray-400 dark:text-slate-500 text-sm">
          Nessuna categoria disponibile al momento.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Tutti — sempre primo */}
          <Link
            href="/category/tutti"
            className="card-blue p-4 flex items-center justify-between group hover:border-orange-300 dark:hover:border-[#F97316]/30 transition-colors"
          >
            <span className="inline-block px-3 py-1 rounded-full text-sm font-semibold bg-orange-100 text-orange-800 border border-orange-200 dark:bg-white/10 dark:text-[#F5E8D8] dark:border-white/10">
              Tutti
            </span>
            <span className="text-xs text-gray-400 dark:text-[#6B5743] font-mono group-hover:text-orange-600 dark:group-hover:text-[#F97316] transition-colors">
              tutti gli articoli →
            </span>
          </Link>

          {tags.map(({ tag, count }) => (
            <Link
              key={tag}
              href={`/category/${encodeURIComponent(tag)}`}
              className="card-blue p-4 flex items-center justify-between group hover:border-orange-300 dark:hover:border-[#F97316]/30 transition-colors"
            >
              <TagBadge tag={tag} linked={false} />
              <span className="text-xs text-gray-400 dark:text-[#6B5743] font-mono group-hover:text-orange-600 dark:group-hover:text-[#F97316] transition-colors">
                {count} articol{count !== 1 ? "i" : "o"} →
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
