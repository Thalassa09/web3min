import type { ErrorComponentProps } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { DuoButton } from "@/components/duo-button";
import { Mascot } from "@/components/mascot";

export function AppErrorComponent({ reset }: ErrorComponentProps) {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center bg-cream px-6 py-10 text-center select-none">
      <div className="w-full max-w-sm rounded-3xl border-2 border-choco-900/20 bg-gradient-to-b from-white via-[#FFF9F5] to-[#FDEEE4] p-7 text-center shadow-[0_6px_0_#3B2218,0_12px_28px_-4px_rgba(59,34,24,0.14)] flex flex-col items-center">
        <Mascot mood="sad" size={120} interactive={false} />
        <h1 className="mt-4 font-display text-2xl font-bold text-choco-900 tracking-tight">
          Nyangkut di Konsensus!
        </h1>
        <p className="mt-2 text-xs md:text-sm font-semibold text-choco-700 leading-relaxed">
          Ada kendala sinkronisasi data pelajaran. Santai, saldo XP dan progresmu tetap aman di rantai.
        </p>
        <div className="mt-6 flex w-full flex-col gap-3">
          <DuoButton wide onClick={() => reset()}>
            Coba Sinkron Ulang
          </DuoButton>
          <Link
            to="/"
            className="inline-flex min-h-10 items-center justify-center font-display text-xs font-bold text-choco-900 underline hover:text-candy-700"
          >
            ← Kembali ke Peta Rantai
          </Link>
        </div>
      </div>
    </main>
  );
}

export function AppNotFound() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center bg-cream px-6 py-10 text-center select-none">
      <div className="w-full max-w-sm rounded-3xl border-2 border-choco-900/20 bg-gradient-to-b from-white via-[#FFF9F5] to-[#FDEEE4] p-7 text-center shadow-[0_6px_0_#3B2218,0_12px_28px_-4px_rgba(59,34,24,0.14)] flex flex-col items-center">
        <Mascot mood="think" size={120} interactive={false} />
        <h1 className="mt-4 font-display text-2xl font-bold text-choco-900 tracking-tight">
          Blok Belum Dipelajari!
        </h1>
        <p className="mt-2 text-xs md:text-sm font-semibold text-choco-700 leading-relaxed">
          Rute atau halaman ini gak ketemu di buku besar. Yuk balik ke jalur belajar utama.
        </p>
        <div className="mt-6 w-full">
          <Link to="/" className="w-full inline-block">
            <DuoButton wide>
              Kembali ke Peta Rantai
            </DuoButton>
          </Link>
        </div>
      </div>
    </main>
  );
}
