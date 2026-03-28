import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import Link from "next/link";
import BackendStatus from "@/components/BackendStatus";
import Header from "@/components/Header";
import AnimatedBackground from "@/components/AnimatedBackground";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-grotesk",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "FoxScan — AI Cybersecurity Intelligence",
  description:
    "Le notizie di cybersecurity più rilevanti, sintetizzate automaticamente da AI in un unico articolo completo.",
  icons: { icon: "/icofs.ico" },
  openGraph: {
    title: "FoxScan — AI Cybersecurity Intelligence",
    description: "Le notizie di cybersecurity più rilevanti, sintetizzate automaticamente da AI in un unico articolo completo.",
    url: "https://foxscan.vercel.app",
    siteName: "FoxScan",
    images: [{ url: "https://foxscan.vercel.app/testa_nobg.png", width: 512, height: 512 }],
    locale: "it_IT",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "FoxScan — AI Cybersecurity Intelligence",
    description: "Le notizie di cybersecurity più rilevanti, sintetizzate automaticamente da AI.",
    images: ["https://foxscan.vercel.app/testa_nobg.png"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it">
      {/* Prevent flash of wrong theme: default = dark */}
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var t=localStorage.getItem('theme');if(t==='light'){document.documentElement.classList.remove('dark')}else{document.documentElement.classList.add('dark')}})();`,
          }}
        />
      </head>
      <body
        className={`${inter.variable} ${spaceGrotesk.variable} font-sans bg-[#F0F4FF] dark:bg-[#020817] text-[#0B1F3A] dark:text-slate-200 min-h-screen relative`}
      >
        {/* Animated orb background — dark mode only */}
        <AnimatedBackground />

        <BackendStatus />
        <Header />

        <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-6 md:py-8">
          {children}
        </main>

        {/* ── Footer ── */}
        <footer className="relative z-10 mt-16 md:mt-24 border-t border-blue-100 dark:border-white/5 bg-white dark:bg-transparent overflow-hidden">
          {/* Cyber grid texture in dark mode */}
          <div className="absolute inset-0 cyber-grid-bg dark:opacity-100 opacity-0 pointer-events-none" />

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-10 md:py-14">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 md:gap-10 mb-8 md:mb-12">

              {/* Brand */}
              <div className="col-span-2 sm:col-span-1">
                <div className="mb-4 flex items-center gap-2.5">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/testa_nobg.png"
                    alt=""
                    className="h-9 w-9 object-contain neon-glow-logo"
                  />
                  <span className="font-extrabold text-xl tracking-tight font-grotesk">
                    <span className="text-[#0B1F3A] dark:text-white">Fox</span>
                    <span className="text-blue-600 dark:text-[#00FFE5]">Scan</span>
                  </span>
                </div>
                <p className="text-sm text-gray-500 dark:text-slate-500 leading-relaxed">
                  Il tuo guardiano cyber, 24/7. Notizie sintetizzate dall&apos;AI, sempre aggiornate.
                </p>
              </div>

              {/* Categorie */}
              <div>
                <h4 className="font-grotesk font-semibold text-[#0B1F3A] dark:text-slate-400 mb-3 text-xs uppercase tracking-widest">
                  Categorie
                </h4>
                <ul className="space-y-2.5 text-sm text-gray-500 dark:text-slate-500">
                  {[
                    ["/category/malware",    "Malware"],
                    ["/category/ransomware", "Ransomware"],
                    ["/category/breach",     "Data Breach"],
                    ["/category/CVE",        "CVE"],
                  ].map(([href, label]) => (
                    <li key={href}>
                      <Link
                        href={href}
                        className="hover:text-blue-600 dark:hover:text-[#00FFE5] transition-colors"
                      >
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Piattaforma */}
              <div>
                <h4 className="font-grotesk font-semibold text-[#0B1F3A] dark:text-slate-400 mb-3 text-xs uppercase tracking-widest">
                  Piattaforma
                </h4>
                <ul className="space-y-2.5 text-sm text-gray-500 dark:text-slate-500">
                  <li>
                    <Link href="/rss" className="hover:text-blue-600 dark:hover:text-[#00FFE5] transition-colors">
                      Feed RSS
                    </Link>
                  </li>
                  <li>
                    <Link href="/about" className="hover:text-blue-600 dark:hover:text-[#00FFE5] transition-colors">
                      Chi siamo
                    </Link>
                  </li>
                </ul>
              </div>
            </div>

            {/* Bottom bar */}
            <div className="pt-6 border-t border-blue-100 dark:border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex flex-col sm:flex-row items-center gap-1.5 sm:gap-2">
                <p className="text-xs text-gray-400 dark:text-slate-600 text-center sm:text-left">
                  © 2026 FoxScan
                </p>
                <span className="hidden sm:inline text-gray-300 dark:text-slate-700">·</span>
                <p className="text-xs text-gray-400 dark:text-slate-600 text-center sm:text-left">
                  Articoli sintetizzati da AI — fonti originali sempre citate
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500 dark:text-[#00FFE5]/40 px-3 py-1 rounded-full border border-blue-100 dark:border-[#00FFE5]/10 bg-blue-50 dark:bg-[#00FFE5]/4">
                  AI‑Powered
                </span>
                <span className="text-xs text-gray-500 dark:text-slate-600 px-3 py-1 rounded-full border border-blue-100 dark:border-white/5 bg-blue-50 dark:bg-white/[0.02]">
                  Aggiornamento continuo
                </span>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
