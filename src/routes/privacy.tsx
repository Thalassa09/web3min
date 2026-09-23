import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";

export const Route = createFileRoute("/privacy")({ component: PrivacyPage });

function PrivacyPage() {
  return (
    <AppShell>
      <main className="px-4 py-5">
        <h1 className="text-[28px] font-extrabold leading-[34px]">Kebijakan privasi</h1>
        <p className="mt-3 text-base leading-6">
          Progress, username, dan pengaturan disimpan di perangkat (local storage). Kami tidak mengumpulkan seed phrase,
          private key, atau kata sandi dompet, dan kami tidak pernah memintanya.
        </p>
        <p className="mt-3 text-base leading-6 text-muted">
          Feed teman pada versi ini memakai data contoh di perangkat, bukan komunitas live. Tidak ada analitik yang
          mengumpulkan data sensitif.
        </p>
        <p className="mt-3 text-base leading-6 text-muted">
          Reset progres menghapus data lokal itu. Menghapus data situs di browser juga menghapus progres.
        </p>
        <p className="mt-3 text-base leading-6 text-muted">
          Kamu tidak perlu menghubungkan wallet. Jangan pernah memasukkan seed phrase ke web3min atau situs lain yang
          mengaku sebagai web3min.
        </p>
        <Link to="/about" className="mt-6 inline-flex min-h-11 font-bold text-primary">
          Tentang web3min
        </Link>
      </main>
    </AppShell>
  );
}
