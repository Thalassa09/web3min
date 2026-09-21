import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";

export const Route = createFileRoute("/about")({ component: AboutPage });

function AboutPage() {
  return (
    <AppShell>
      <main className="px-4 py-5">
        <h1 className="text-[28px] font-extrabold leading-[34px]">Tentang web3min</h1>
        <p className="mt-3 text-base leading-6">
          Belajar tanpa deposit, trading, atau menghubungkan wallet.
        </p>
        <p className="mt-3 text-base leading-6 text-muted">
          web3min adalah aplikasi edukasi Web3. Bukan produk trading, bukan saran investasi, bukan dompet. Kamu belajar
          wallet, DeFi, NFT, DAO, keamanan, dan kerja onchain lewat pelajaran singkat sekitar 3 menit.
        </p>
        <p className="mt-3 text-sm leading-5 text-faint">Materi ini bersifat edukatif, bukan saran keuangan.</p>

        <Link to="/cara" className="mt-5 inline-flex min-h-11 font-bold text-primary">
          Cara main
        </Link>

        <h2 className="mt-8 text-xl font-bold leading-[26px]">Cara materi dibuat</h2>
        <p className="mt-2 text-base leading-6 text-muted">
          Setiap rute disusun berjenjang: konsep dulu, contoh nyata, lalu kuis. Klaim yang beredar di media sosial
          dicek ke dokumentasi, explorer, atau laporan publik — bukan diulang sebagai fakta.
        </p>

        <h2 className="mt-8 text-xl font-bold leading-[26px]">Sumber dan referensi</h2>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-base leading-6 text-muted">
          <li>Dokumentasi publik (Ethereum.org, Bitcoin, Uniswap, Aave, dan sejenisnya)</li>
          <li>Kasus yang sudah terjadi dan dilaporkan di explorer atau media</li>
          <li>Tangkapan layar di Bedah bukti: postingan publik, dipakai untuk latihan membaca klaim</li>
        </ul>
        <p className="mt-2 text-sm leading-5 text-muted">Penyusun: tim web3min. Diperbarui September 2026.</p>

        <h2 className="mt-8 text-xl font-bold leading-[26px]">Keamanan wallet</h2>
        <p className="mt-2 text-base leading-6">
          web3min tidak akan pernah meminta seed phrase, private key, atau password dompetmu. Kamu tidak perlu
          menghubungkan wallet untuk belajar.
        </p>

        <h2 className="mt-8 text-xl font-bold leading-[26px]">Data di perangkat</h2>
        <p className="mt-2 text-base leading-6 text-muted">
          Progress, username, dan pengaturan tersimpan di penyimpanan lokal perangkatmu. Tidak ada akun server pada
          versi ini. Feed teman memakai data contoh, bukan komunitas live.
        </p>

        <h2 className="mt-8 text-xl font-bold leading-[26px]">Syarat pakai</h2>
        <p className="mt-2 text-base leading-6 text-muted">
          Pakai web3min untuk belajar. Jangan kirim seed atau kunci ke siapa pun, termasuk ke aplikasi ini. Reset
          progres menghapus data lokal di perangkat ini saja.
        </p>

        <h2 className="mt-8 text-xl font-bold leading-[26px]">Laporkan materi</h2>
        <p className="mt-2 text-base leading-6 text-muted">
          Jika menemukan kesalahan, buka Pengaturan lalu pilih Laporkan materi. Versi ini belum komunitas live.
        </p>

        <div className="mt-6 flex flex-col gap-2">
          <Link to="/privacy" className="min-h-11 font-bold text-primary">
            Kebijakan privasi
          </Link>
          <Link to="/settings" className="min-h-11 font-bold text-primary">
            Pengaturan
          </Link>
          <Link to="/" className="min-h-11 font-bold text-primary">
            Kembali belajar
          </Link>
        </div>
      </main>
    </AppShell>
  );
}
