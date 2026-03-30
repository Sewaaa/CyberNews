import { notFound } from "next/navigation";
import { getArticle } from "@/lib/api";
import TagBadge from "@/components/TagBadge";
import SourcesList from "@/components/SourcesList";
import RelevanceDots from "@/components/RelevanceDots";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export const revalidate = 3600;

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  const article = await getArticle(Number(id)).catch(() => null);
  if (!article) return { title: "Articolo non trovato" };
  const url = `https://foxscan.vercel.app/article/${id}`;
  const image = article.image_url ?? "https://foxscan.vercel.app/testa_nobg.png";
  return {
    title: `${article.title} — FoxScan`,
    description: article.summary ?? undefined,
    openGraph: {
      title: article.title,
      description: article.summary ?? undefined,
      url,
      siteName: "FoxScan",
      images: [{ url: image }],
      locale: "it_IT",
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.summary ?? undefined,
      images: [image],
    },
  };
}

function getLevel(score: number) {
  if (score >= 8) return 3;
  if (score >= 5) return 2;
  return 1;
}


export default async function ArticlePage({ params }: PageProps) {
  const { id } = await params;
  const article = await getArticle(Number(id)).catch(() => null);
  if (!article) notFound();

  const level = getLevel(article.relevance_score);

  const publishedAt = new Date(article.published_at).toLocaleDateString("it-IT", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <article className="max-w-3xl mx-auto fade-up">

      {/* ── Back ── */}
      <div className="mb-5 md:mb-6">
        <a
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-orange-600 hover:text-orange-800 font-medium transition-colors py-1"
        >
          ← Torna alla homepage
        </a>
      </div>

      {/* ── Header ── */}
      <header className="mb-6 md:mb-8">
        {/* Title */}
        <h1 className="text-2xl md:text-3xl font-extrabold text-[#1C0E00] leading-tight mb-4 md:mb-5">
          {article.title}
        </h1>

        {/* Hero image */}
        <div
          className={`mb-5 md:mb-6 rounded-2xl overflow-hidden shadow-blue-md ${article.image_url ? "bg-orange-50" : "img-placeholder"}`}
          style={{ maxHeight: article.image_url ? undefined : "10rem", minHeight: "8rem" }}
        >
          {article.image_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={article.image_url}
              alt={article.title}
              className="w-full object-cover max-h-52 md:max-h-80"
            />
          ) : null}
        </div>

        {/* Summary box */}
        {article.summary && (
          <div className="byte-box relative overflow-hidden rounded-2xl mb-5 md:mb-6 border border-orange-200 dark:border-[#F97316]/20 bg-orange-50 dark:bg-[#1C1612]">
            {/* Top accent stripe */}
            <div className="h-0.5 w-full bg-gradient-to-r from-orange-400 via-orange-500 to-transparent dark:from-[#F97316]/70 dark:via-[#F97316]/30 dark:to-transparent" />

            <div className="flex gap-4 md:gap-5 p-5 md:p-6">
              {/* Mascot */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/sintesi_nobg.png"
                alt=""
                className="shrink-0 w-20 h-20 md:w-24 md:h-24 object-contain float-slow self-center opacity-95"
              />

              {/* Content */}
              <div className="flex-1 min-w-0 py-1">
                <p className="byte-label text-[10px] font-extrabold uppercase tracking-[0.18em] text-orange-500 dark:text-[#F97316] mb-2">
                  ✦ In sintesi
                </p>
                <div className="byte-text text-sm md:text-base text-orange-900 dark:text-[#F5E8D8] leading-relaxed font-medium">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      p: ({ children }) => <span>{children}</span>,
                      strong: ({ children }) => <strong className="font-bold text-orange-700 dark:text-[#F97316]">{children}</strong>,
                    }}
                  >
                    {article.summary}
                  </ReactMarkdown>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Metadata */}
        <div className="flex items-center gap-3 text-gray-500 flex-wrap">
          <time dateTime={article.published_at} className="text-xs md:text-sm">{publishedAt}</time>
          <span className="text-gray-300">·</span>
          <RelevanceDots score={article.relevance_score} />
          <span className="text-gray-300">·</span>
          <a href="#fonti" className="text-orange-600 dark:text-orange-400 hover:underline text-xs md:text-sm">
            {article.sources.length} fonte{article.sources.length !== 1 ? "i" : ""}
          </a>
        </div>
      </header>

      {/* ── Body ── */}
      <div className="prose-cyber">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{article.body}</ReactMarkdown>
      </div>

      {/* ── Sources ── */}
      <div id="fonti" className="mt-8 md:mt-10 pt-6 md:pt-8 border-t border-orange-100">
        <SourcesList sources={article.sources} />
      </div>
    </article>
  );
}
