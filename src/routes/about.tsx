import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { BookOpen, ShieldCheck, Sparkles, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/about")({ component: AboutPage });

function AboutPage() {
  return (
    <AppShell>
      <main className="mx-auto max-w-3xl px-4 py-6 sm:py-8 select-none">
        {/* Header Hero Banner */}
        <div className="relative overflow-hidden rounded-[32px] border-4 border-choco-900 bg-linear-to-b from-[#FFFBEB] via-[#FEF3C7] to-[#FDE68A] p-6 md:p-8 shadow-[0_8px_0_#3B2218]">
          <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-5 text-center sm:text-left">
            <div className="flex-1">
              <span className="inline-flex items-center gap-1.5 rounded-full border-2 border-choco-900 bg-white px-3 py-1 font-pixel text-[10px] font-bold text-choco-900 shadow-[0_2px_0_#3B2218] mb-2">
                MANIFESTO WEB3MIN
              </span>
              <h1 className="mt-1 text-2xl md:text-3xl font-display font-black text-choco-900 tracking-tight">
                Tentang Web3min
              </h1>
              <p className="mt-2 text-xs md:text-sm font-semibold text-choco-800 max-w-lg leading-relaxed">
                Belajar crypto, wallet, DeFi, dan on-chain tanpa deposit, tanpa trading, dan tanpa harus menghubungkan dompet riil.
              </p>
            </div>
            <img
              src="/mascot/proud.png"
              alt="Blobi Bangga"
              className="size-20 sm:size-24 object-contain pixelated shrink-0"
            />
          </div>
        </div>

        {/* Bento Content Pods */}
        <div className="mt-6 space-y-4">
          {/* Pod 1: Bahasa Orang & Bebas Boncos */}
          <div className="rounded-2xl border-3 border-choco-900 bg-white p-5 sm:p-6 shadow-[0_5px_0_#3B2218]">
            <div className="flex items-center gap-3 mb-2.5">
              <div className="size-10 rounded-2xl border-2 border-choco-900 bg-candy-100 flex items-center justify-center shadow-[0_2px_0_#3B2218] shrink-0">
                <img src="/props/book.png" alt="Buku" className="size-6 object-contain pixelated" />
              </div>
              <div>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-pixel font-bold bg-amber-100 border border-choco-900 text-choco-800">
                  Prinsip 1
                </span>
                <h2 className="text-base sm:text-lg font-pixel font-bold text-choco-900 mt-0.5">
                  Web3 Pakai Bahasa Orang
                </h2>
              </div>
            </div>
            <p className="text-xs sm:text-sm font-semibold text-choco-700 leading-relaxed pl-0 sm:pl-13">
              Web3min dibangun buat membedah teknologi terdesentralisasi pakai analogi dunia nyata yang membumi. Bukan produk jualan sinyal trading, bukan bujukan investasi. Tiap modul dirancang padat sekitar 3 menit: pahami logikanya dulu, baru uji pemahaman di kuis.
            </p>
          </div>

          {/* Pod 2: Keamanan & Privasi Mutlak */}
          <div className="rounded-2xl border-3 border-choco-900 bg-emerald-50 p-5 sm:p-6 shadow-[0_5px_0_#3B2218]">
            <div className="flex items-center gap-3 mb-2.5">
              <div className="size-10 rounded-2xl border-2 border-choco-900 bg-emerald-200 flex items-center justify-center shadow-[0_2px_0_#3B2218] shrink-0">
                <img src="/props/shield.png" alt="Perisai" className="size-6 object-contain pixelated" />
              </div>
              <div>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-pixel font-bold bg-emerald-200 border border-choco-900 text-emerald-900">
                  Prinsip 2
                </span>
                <h2 className="text-base sm:text-lg font-pixel font-bold text-choco-900 mt-0.5">
                  Seed Phrase Itu Nyawa
                </h2>
              </div>
            </div>
            <p className="text-xs sm:text-sm font-semibold text-choco-800 leading-relaxed pl-0 sm:pl-13">
              Web3min <strong>tidak akan pernah</strong> meminta seed phrase, private key, atau kata sandi dompet pribadimu. Belajar di sini 100% menggunakan simulasi sandbox interaktif. Jangan pernah membocorkan seed phrase ke situs atau orang mana pun.
            </p>
          </div>

          {/* Pod 3: Sumber Terbuka & Verifikasi Fakta */}
          <div className="rounded-2xl border-3 border-choco-900 bg-white p-5 sm:p-6 shadow-[0_5px_0_#3B2218]">
            <div className="flex items-center gap-3 mb-2.5">
              <div className="size-10 rounded-2xl border-2 border-choco-900 bg-amber-200 flex items-center justify-center shadow-[0_2px_0_#3B2218] shrink-0">
                <img src="/props/star.png" alt="Bintang" className="size-6 object-contain pixelated" />
              </div>
              <div>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-pixel font-bold bg-amber-100 border border-choco-900 text-choco-800">
                  Prinsip 3
                </span>
                <h2 className="text-base sm:text-lg font-pixel font-bold text-choco-900 mt-0.5">
                  Bukan Klaim Medsos, Tapi Data Nyata
                </h2>
              </div>
            </div>
            <ul className="space-y-1.5 text-xs sm:text-sm font-semibold text-choco-700 leading-relaxed list-disc list-inside pl-0 sm:pl-13">
              <li>Dokumentasi resmi komunitas (Ethereum.org, Bitcoin.org, Uniswap, Etherscan).</li>
              <li>Kasus eksploitasi dan phising riil yang terdokumentasi di blockchain explorer.</li>
              <li>Bedah bukti transaksi asli untuk melatih kewaspadaan membaca smart contract.</li>
            </ul>
          </div>
        </div>

        {/* Footer Navigation Buttons */}
        <div className="mt-8 flex flex-wrap items-center justify-between gap-3 pt-4 border-t-2 border-choco-900/15">
          <div className="flex items-center gap-3">
            <Link
              to="/privacy"
              className="font-pixel text-xs font-bold text-choco-700 underline hover:text-candy-700"
            >
              Kebijakan Privasi
            </Link>
            <span className="text-choco-400">·</span>
            <Link
              to="/settings"
              className="font-pixel text-xs font-bold text-choco-700 underline hover:text-candy-700"
            >
              Pengaturan
            </Link>
          </div>

          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 rounded-2xl border-3 border-choco-900 bg-candy-800 hover:bg-candy-950 px-5 py-3 font-pixel text-xs sm:text-sm font-bold text-white shadow-[0_4px_0_#3B2218] active:translate-y-1 active:shadow-[0_1px_0_#3B2218] transition-all cursor-pointer"
          >
            <span>Kembali ke Peta Rantai</span>
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </main>
    </AppShell>
  );
}
