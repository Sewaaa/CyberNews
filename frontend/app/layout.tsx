import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import BackendStatus from "@/components/BackendStatus";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CyberNews — AI Cybersecurity Intelligence",
  description:
    "Le notizie di cybersecurity più rilevanti, sintetizzate automaticamente da AI in un unico articolo completo.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it">
      <body className={`${inter.className} bg-[#F8FAFF] text-[#0B1F3A] min-h-screen`}>
        <BackendStatus />

        {/* ── Navbar ── frosted glass sticky */}
        <header className="sticky top-0 z-50 glass border-b border-blue-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 rounded-lg bg-[#0B1F3A] flex items-center justify-center text-[#06E6D9] font-black text-xs tracking-tight select-none">
                CN
              </div>
              <span className="font-extrabold text-xl tracking-tight text-[#0B1F3A]">
                Cyber<span className="text-blue-600">News</span>
              </span>
              <span className="hidden sm:inline ml-1 text-[11px] text-blue-400 font-medium border border-blue-200 rounded-full px-2 py-0.5 bg-blue-50">
                AI‑Powered
              </span>
            </Link>

            {/* Nav */}
            <nav className="flex items-center gap-0.5 text-sm">
              <Link href="/" className="px-3 py-1.5 rounded-lg text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-all font-medium">
                Home
              </Link>
              <Link href="/about" className="px-3 py-1.5 rounded-lg text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-all font-medium">
                About
              </Link>
              <Link href="/rss" className="px-3 py-1.5 rounded-lg text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-all font-medium">
                RSS
              </Link>
              <Link href="/admin" className="px-3 py-1.5 rounded-lg text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-all font-medium">
                Admin
              </Link>
              <Link
                href="/rss"
                className="ml-2 px-4 py-1.5 rounded-full bg-[#0B1F3A] text-white text-sm font-semibold hover:bg-blue-700 transition-colors shadow-blue-sm"
              >
                Subscribe →
              </Link>
            </nav>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">{children}</main>

        {/* ── Footer ── */}
        <footer className="mt-20 border-t border-blue-100 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-8 mb-10">
              {/* Brand */}
              <div className="sm:col-span-1">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-[#0B1F3A] flex items-center justify-center text-[#06E6D9] font-black text-xs">
                    CN
                  </div>
                  <span className="font-extrabold text-lg text-[#0B1F3A]">
                    Cyber<span className="text-blue-600">News</span>
                  </span>
                </div>
                <p className="text-sm text-gray-500 leading-relaxed">
                  Il tuo guardiano cyber, 24/7. Notizie sintetizzate dall&apos;AI, sempre aggiornate.
                </p>
              </div>

              {/* Fonti */}
              <div>
                <h4 className="font-semibold text-[#0B1F3A] mb-3 text-sm">Fonti</h4>
                <ul className="space-y-2 text-sm text-gray-500">
                  <li>BleepingComputer</li>
                  <li>The Hacker News</li>
                  <li>Krebs on Security</li>
                  <li>Dark Reading</li>
                </ul>
              </div>

              {/* Categorie */}
              <div>
                <h4 className="font-semibold text-[#0B1F3A] mb-3 text-sm">Categorie</h4>
                <ul className="space-y-2 text-sm text-gray-500">
                  <li><Link href="/category/malware" className="hover:text-blue-600 transition-colors">Malware</Link></li>
                  <li><Link href="/category/ransomware" className="hover:text-blue-600 transition-colors">Ransomware</Link></li>
                  <li><Link href="/category/breach" className="hover:text-blue-600 transition-colors">Data Breach</Link></li>
                  <li><Link href="/category/CVE" className="hover:text-blue-600 transition-colors">CVE</Link></li>
                </ul>
              </div>

              {/* Piattaforma */}
              <div>
                <h4 className="font-semibold text-[#0B1F3A] mb-3 text-sm">Piattaforma</h4>
                <ul className="space-y-2 text-sm text-gray-500">
                  <li><Link href="/rss" className="hover:text-blue-600 transition-colors">Feed RSS</Link></li>
                  <li><Link href="/admin" className="hover:text-blue-600 transition-colors">Admin Panel</Link></li>
                  <li><Link href="/about" className="hover:text-blue-600 transition-colors">About</Link></li>
                </ul>
              </div>
            </div>

            {/* Bottom bar */}
            <div className="pt-6 border-t border-blue-100 flex flex-col sm:flex-row items-center justify-between gap-3">
              <p className="text-xs text-gray-400">
                © 2026 CyberNews — Articoli generati da AI · fonti sempre citate
              </p>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400 px-2.5 py-1 bg-blue-50 rounded-full border border-blue-100">
                  Powered by Groq AI
                </span>
                <span className="text-xs text-gray-400 px-2.5 py-1 bg-blue-50 rounded-full border border-blue-100">
                  LLaMA 3.1
                </span>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
