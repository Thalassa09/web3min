import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { HowToList } from "@/components/how-to";
import { Mascot } from "@/components/mascot";

export const Route = createFileRoute("/cara")({ component: CaraPage });

function CaraPage() {
  return (
    <AppShell>
      <main className="px-4 py-5">
        <div className="flex items-start gap-3">
          <Mascot mood="think" size={72} className="shrink-0" interactive={false} />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-primary">Petunjuk</p>
            <h1 className="text-[28px] font-extrabold leading-[34px]">Cara main</h1>
          </div>
        </div>
        <p className="mt-4 text-base leading-6">
          Belajar tanpa deposit, trading, atau menghubungkan wallet. Ikuti rute, jangan lompat.
        </p>
        <p className="mt-2 text-sm leading-5 text-faint">Materi ini bersifat edukatif, bukan saran keuangan.</p>

        <div className="mt-6">
          <HowToList extra />
        </div>

        <p className="mt-8 text-base leading-6 text-muted">
          web3min tidak akan pernah meminta seed phrase, private key, atau password dompet. Kamu tidak perlu
          menghubungkan wallet untuk belajar.
        </p>

        <div className="mt-6 flex flex-col gap-2">
          <Link to="/" className="min-h-11 font-bold text-primary">
            Mulai pelajaran
          </Link>
          <Link to="/about" className="min-h-11 font-bold text-primary">
            Tentang web3min
          </Link>
        </div>
      </main>
    </AppShell>
  );
}
