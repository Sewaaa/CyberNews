"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations("error");

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/error_nobg.png" alt="" className="w-28 h-28 object-contain mb-6 opacity-70 float-anim" />
      <h2 className="text-xl font-bold text-[#0B1F3A] dark:text-white mb-2">{t("title")}</h2>
      <p className="text-sm text-gray-500 dark:text-slate-400 mb-6 max-w-sm">
        {t("description")}
      </p>
      <button
        onClick={reset}
        className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-lg transition-colors"
      >
        {t("retry")}
      </button>
    </div>
  );
}
