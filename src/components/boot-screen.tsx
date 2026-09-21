import { Mascot } from "@/components/mascot";
import { cn } from "@/lib/utils";

export function BootScreen({
  title = "web3min",
  hint = "Menyiapkan rute…",
  className,
}: {
  title?: string;
  hint?: string;
  stamp?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-[#1F7BFF] to-[#0B4FD1] p-6 text-center select-none",
        className,
      )}
      role="status"
      aria-live="polite"
    >
      {/* 3 Soft Background Clouds */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-10 -left-12 w-64 h-32 rounded-full bg-white/20 blur-xl animate-pulse" />
        <div className="absolute top-1/4 -right-16 w-72 h-36 rounded-full bg-white/15 blur-2xl" />
        <div className="absolute bottom-16 -left-10 w-80 h-40 rounded-full bg-white/20 blur-xl" />
      </div>

      {/* Center Blobi & Wordmark */}
      <div className="relative z-10 flex flex-col items-center">
        <div className="relative">
          <Mascot mood="wave" size={140} interactive={false} />
        </div>

        <h1 className="mt-4 font-display text-[34px] font-bold text-white tracking-tight drop-shadow-[0_2px_4px_rgba(11,79,209,0.5)]">
          {title}
        </h1>

        <p className="mt-2 text-sm font-semibold text-[#E4F0FF] max-w-xs">
          {hint}
        </p>

        {/* Yellow Progress Track 180x10 with 2px White Border */}
        <div
          className="mt-6 h-2.5 w-[180px] overflow-hidden rounded-full bg-[#0B4FD1] border-2 border-white/90 shadow-inner"
          aria-hidden
        >
          <div className="h-full w-2/5 rounded-full bg-[#FFC61A] shadow-[0_0_8px_#FFC61A] animate-[boot-slide_1.2s_ease-in-out_infinite]" />
        </div>
      </div>
    </div>
  );
}
