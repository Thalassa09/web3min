import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";

export const Route = createFileRoute("/about")({ component: AboutPage });

function AboutPage() {
  return (
    <AppShell>
      <main className="mx-auto max-w-3xl px-4 py-8 select-none">
        {/* Header Hero Banner */}
        <div className="relative overflow-hidden rounded-3xl border-2 border-amber-500/40 bg-gradient-to-b from-[#FFFBEB] via-[#FEF3C7] to-[#FDE68A] p-6 md:p-8 shadow-[0_6px_0_#D97706,0_12px_28px_-4px_rgba(217,119,6,0.22)]">
          <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-5 text-center sm:text-left">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full border-2 border-choco-900/20 bg-white/80 px-3 py-0.5 text-xs font-bold text-choco-900 shadow-[0_1.5px_0_#3B2218]">
                Manifesto Belajar
              </span>
              <h1 className="mt-2 text-2xl md:text-3xl font-display font-bold text-choco-900 tracking-tight">
                Tentang web3min
              </h1>
              <p className="mt-2 text-xs md:text-sm font-semibold text-choco-800 max-w-lg leading-relaxed">
                Belajar crypto, wallet, DeFi, dan on-chain tanpa deposit, tanpa trading, dan tanpa harus konek dompet riil.
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
        <div className="mt-6 space-y-5">
          {/* Pod 1: Bahasa Orang & Bebas Boncos */}
          <div className="rounded-3xl border-2 border-choco-900/18 bg-gradient-to-b from-white via-[#FFF9F5] to-[#FDEEE4] p-6 shadow-[0_5px_0_#3B2218,0_10px_24px_-4px_rgba(59,34,24,0.12)]">
            <div className="flex items-center gap-2.5 mb-2">
              <div className="size-8 rounded-xl border-2 border-candy-500/40 bg-gradient-to-b from-[#FFF0F5] to-[#FFE4EC] flex items-center justify-center shadow-[0_2px_0_#B01F62]">
                <img src="/props/book.png" alt="Buku" className="size-5 object-contain pixelated" />
              </div>
              <h2 className="text-lg font-display font-bold text-choco-900">
                Web3 Pakai Bahasa Orang
              </h2>
            </div>
            <p className="text-xs md:text-sm font-semibold text-choco-700 leading-relaxed">
              web3min dibangun buat membedah teknologi terdesentralisasi pakai analogi dunia nyata yang membumi. Bukan produk jualan sinyal trading, bukan bujukan investasi. Tiap modul dirancang padat sekitar 3 menit: pahami logikanya dulu, baru uji pemahaman di kuis.
            </p>
          </div>

          {/* Pod 2: Keamanan & Privasi Mutlak */}
          <div className="rounded-3xl border-2 border-emerald-500/40 bg-gradient-to-b from-[#F0FDF4] via-[#DCFCE7] to-[#BBF7D0] p-6 shadow-[0_5px_0_#15803D,0_10px_24px_-4px_rgba(21,128,61,0.20)]">
            <div className="flex items-center gap-2.5 mb-2">
              <div className="size-8 rounded-xl border-2 border-emerald-600/40 bg-white/80 flex items-center justify-center shadow-[0_2px_0_#15803D]">
                <img src="/props/shield.png" alt="Perisai" className="size-5 object-contain pixelated" />
              </div>
              <h2 className="text-lg font-display font-bold text-choco-900">
                Hukum Besi: Seed Phrase Itu Nyawa
              </h2>
            </div>
            <p className="text-xs md:text-sm font-semibold text-choco-800 leading-relaxed">
              web3min <strong>tidak akan pernah</strong> meminta seed phrase, private key, atau kata sandi dompet pribadimu. Belajar di sini 100% menggunakan simulasi sandbox interaktif. Jangan pernah membocorkan seed phrase ke situs atau orang mana pun.
            </p>
          </div>

          {/* Pod 3: Sumber Terbuka & Verifikasi Fakta */}
          <div className="rounded-3xl border-2 border-choco-900/18 bg-gradient-to-b from-white via-[#FFF9F5] to-[#FDEEE4] p-6 shadow-[0_5px_0_#3B2218,0_10px_24px_-4px_rgba(59,34,24,0.12)]">
            <div className="flex items-center gap-2.5 mb-2">
              <div className="size-8 rounded-xl border-2 border-amber-500/40 bg-gradient-to-b from-[#FFFBEB] to-[#FEF3C7] flex items-center justify-center shadow-[0_2px_0_#D97706]">
                <img src="/props/star.png" alt="Bintang" className="size-5 object-contain pixelated" />
              </div>
              <h2 className="text-lg font-display font-bold text-choco-900">
                Bukan Klaim Medsos, Tapi Data Nyata
              </h2>
            </div>
            <ul className="mt-2 space-y-1.5 text-xs md:text-sm font-semibold text-choco-700 leading-relaxed list-disc list-inside">
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
              className="text-xs font-bold text-choco-700 underline hover:text-candy-600"
            >
              Kebijakan Privasi
            </Link>
            <span className="text-choco-400">·</span>
            <Link
              to="/settings"
              className="text-xs font-bold text-choco-700 underline hover:text-candy-600"
            >
              Pengaturan
            </Link>
          </div>

          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-2xl border-2 border-candy-600/60 bg-gradient-to-b from-[#FF6699] via-[#E8437F] to-[#D82668] px-5 py-2.5 text-xs md:text-sm font-bold text-white shadow-[0_4px_0_#B01F62,0_8px_16px_-2px_rgba(232,67,127,0.25)] hover:brightness-105 active:translate-y-[2px] active:shadow-none transition-all"
          >
            Kembali ke Peta Rantai →
          </Link>
        </div>
      </main>
    </AppShell>
  );
}
