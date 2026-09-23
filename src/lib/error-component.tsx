import type { ErrorComponentProps } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { DuoButton } from "@/components/duo-button";
import { Mascot } from "@/components/mascot";

export function AppErrorComponent({ reset }: ErrorComponentProps) {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center bg-cream px-6 py-10 text-center select-none">
      <div className="w-full max-w-sm rounded-[28px] border-3 border-choco-900 bg-white p-7 text-center shadow-[0_6px_0_#3B2218] flex flex-col items-center">
        <Mascot mood="sad" size={120} interactive={false} />
        <h1 className="mt-4 font-pixel text-2xl font-bold text-choco-900 tracking-tight">
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
            className="inline-flex min-h-10 items-center justify-center font-pixel text-xs font-bold text-choco-900 underline hover:text-candy-600"
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
      <div className="w-full max-w-sm rounded-[28px] border-3 border-choco-900 bg-white p-7 text-center shadow-[0_6px_0_#3B2218] flex flex-col items-center">
        <Mascot mood="think" size={120} interactive={false} />
        <h1 className="mt-4 font-pixel text-2xl font-bold text-choco-900 tracking-tight">
          Blok Belum Ditambang!
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
