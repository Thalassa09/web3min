import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";

export const Route = createFileRoute("/about")({ component: AboutPage });

function AboutPage() {
  return (
    <AppShell>
      <main className="mx-auto max-w-3xl px-4 py-8 select-none">
        {/* Header Hero Banner */}
        <div className="relative overflow-hidden rounded-[28px] border-3 border-choco-900 bg-lemon p-6 md:p-8 shadow-[0_6px_0_#3B2218]">
          <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-5 text-center sm:text-left">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full border-2 border-choco-900 bg-white px-3 py-0.5 text-xs font-pixel font-bold text-choco-900 shadow-[0_2px_0_#3B2218]">
                Manifesto Belajar
              </span>
              <h1 className="mt-2 text-2xl md:text-3xl font-pixel font-bold text-choco-900 tracking-tight">
                Tentang web3min
              </h1>
              <p className="mt-2 text-xs md:text-sm font-semibold text-choco-700 max-w-lg leading-relaxed">
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
          <div className="rounded-[24px] border-3 border-choco-900 bg-cream p-6 shadow-[0_5px_0_#3B2218]">
            <div className="flex items-center gap-2.5 mb-2">
              <div className="size-8 rounded-lg border-2 border-choco-900 bg-candy-100 flex items-center justify-center shadow-[0_2px_0_#3B2218]">
                <img src="/props/book.png" alt="Buku" className="size-5 object-contain pixelated" />
              </div>
              <h2 className="text-lg font-pixel font-bold text-choco-900">
                Web3 Pakai Bahasa Orang
              </h2>
            </div>
            <p className="text-xs md:text-sm font-semibold text-choco-700 leading-relaxed">
              web3min dibangun buat membedah teknologi terdesentralisasi pakai analogi dunia nyata yang membumi. Bukan produk jualan sinyal trading, bukan bujukan investasi. Tiap modul dirancang padat sekitar 3 menit: pahami logikanya dulu, baru uji pemahaman di kuis.
            </p>
          </div>

          {/* Pod 2: Keamanan & Privasi Mutlak */}
          <div className="rounded-[24px] border-3 border-choco-900 bg-cream p-6 shadow-[0_5px_0_#3B2218]">
            <div className="flex items-center gap-2.5 mb-2">
              <div className="size-8 rounded-lg border-2 border-choco-900 bg-mint/20 flex items-center justify-center shadow-[0_2px_0_#3B2218]">
                <img src="/props/shield.png" alt="Perisai" className="size-5 object-contain pixelated" />
              </div>
              <h2 className="text-lg font-pixel font-bold text-choco-900">
                Hukum Besi: Seed Phrase Itu Nyawa
              </h2>
            </div>
            <p className="text-xs md:text-sm font-semibold text-choco-700 leading-relaxed">
              web3min <strong>tidak akan pernah</strong> meminta seed phrase, private key, atau kata sandi dompet pribadimu. Belajar di sini 100% menggunakan simulasi sandbox interaktif. Jangan pernah membocorkan seed phrase ke situs atau orang mana pun.
            </p>
          </div>

          {/* Pod 3: Sumber Terbuka & Verifikasi Fakta */}
          <div className="rounded-[24px] border-3 border-choco-900 bg-cream p-6 shadow-[0_5px_0_#3B2218]">
            <div className="flex items-center gap-2.5 mb-2">
              <div className="size-8 rounded-lg border-2 border-choco-900 bg-amber-100 flex items-center justify-center shadow-[0_2px_0_#3B2218]">
                <img src="/props/star.png" alt="Bintang" className="size-5 object-contain pixelated" />
              </div>
              <h2 className="text-lg font-pixel font-bold text-choco-900">
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
              className="font-pixel text-xs font-bold text-choco-700 underline hover:text-candy-600"
            >
              Kebijakan Privasi
            </Link>
            <span className="text-choco-400">·</span>
            <Link
              to="/settings"
              className="font-pixel text-xs font-bold text-choco-700 underline hover:text-candy-600"
            >
              Pengaturan
            </Link>
          </div>

          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-xl border-3 border-choco-900 bg-candy-500 px-5 py-2.5 text-xs md:text-sm font-pixel font-bold text-white shadow-[0_3px_0_#3B2218] transition-transform hover:-translate-y-0.5 active:translate-y-0.5"
          >
            Kembali ke Peta Rantai →
          </Link>
        </div>
      </main>
    </AppShell>
  );
}
