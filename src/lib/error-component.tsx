import type { ErrorComponentProps } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { DuoButton } from "@/components/duo-button";
import { Mascot } from "@/components/mascot";

export function AppErrorComponent({ reset }: ErrorComponentProps) {
  return (
    <main className="hex-wash flex min-h-dvh flex-col items-center justify-center bg-bg px-6 py-10 text-center text-fg">
      <Mascot mood="think" size={120} interactive={false} />
      <h1 className="mt-4 max-w-sm text-[28px] font-extrabold leading-[34px]">
        Terjadi masalah saat memuat pelajaran.
      </h1>
      <p className="mt-2 max-w-sm text-base leading-6 text-muted">Progresmu tetap aman.</p>
      <div className="mt-6 flex w-full max-w-xs flex-col gap-2">
        <DuoButton wide onClick={() => reset()}>
          Coba lagi
        </DuoButton>
        <Link to="/" className="inline-flex min-h-11 items-center justify-center font-bold text-primary">
          Kembali ke peta
        </Link>
      </div>
    </main>
  );
}

export function AppNotFound() {
  return (
    <main className="hex-wash flex min-h-dvh flex-col items-center justify-center bg-bg px-6 py-10 text-center text-fg">
      <Mascot mood="think" size={120} interactive={false} />
      <h1 className="mt-4 max-w-sm text-[28px] font-extrabold leading-[34px]">Rute ini tidak ketemu.</h1>
      <p className="mt-2 max-w-sm text-base leading-6 text-muted">
        Halaman itu tidak ada. Progresmu tetap aman.
      </p>
      <Link to="/" className="mt-6 inline-flex min-h-11 items-center justify-center font-bold text-primary">
        Kembali ke peta
      </Link>
    </main>
  );
}
