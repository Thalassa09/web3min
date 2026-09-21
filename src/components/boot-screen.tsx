import { useEffect, useState } from "react";
import { Mascot } from "@/components/mascot";
import { cn } from "@/lib/utils";

const STAGES = [
  { label: "Menyiapkan rute…", width: "35%" },
  { label: "Memuat modul…", width: "75%" },
  { label: "Siap!", width: "100%" },
];

export function BootScreen({
  title = "web3min",
  hint,
  className,
  exiting = false,
}: {
  title?: string;
  hint?: string;
  stamp?: string;
  className?: string;
  exiting?: boolean;
}) {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    const t1 = setTimeout(() => setStage(1), 180);
    const t2 = setTimeout(() => setStage(2), 400);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  const currentHint = hint ?? STAGES[stage].label;
  const currentWidth = STAGES[stage].width;

  return (
    <div
      className={cn(
        "relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-[#1F7BFF] to-[#0B4FD1] p-6 text-center select-none",
        exiting && "boot-out",
        className,
      )}
      role="status"
      aria-live="polite"
    >
      {/* 3 Static High-Performance Background Clouds */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-10 -left-12 w-64 h-32 rounded-full bg-white/20 blur-xl" />
        <div className="absolute top-1/4 -right-16 w-72 h-36 rounded-full bg-white/15 blur-2xl" />
        <div className="absolute bottom-16 -left-10 w-80 h-40 rounded-full bg-white/20 blur-xl" />
      </div>

      {/* Center Blobi & Wordmark */}
      <div className="relative z-10 flex flex-col items-center">
        <div className="relative">
          <Mascot mood="wave" size={140} interactive />
        </div>

        <h1 className="mt-4 font-display text-[34px] font-bold text-white tracking-tight drop-shadow-[0_2px_4px_rgba(11,79,209,0.5)]">
          {title}
        </h1>

        <p className="mt-2 text-sm font-semibold text-[#E4F0FF] max-w-xs transition-opacity duration-200">
          {currentHint}
        </p>

        {/* Real Stepped Yellow Progress Track 180x10 */}
        <div
          className="mt-6 h-2.5 w-[180px] overflow-hidden rounded-full bg-[#0B4FD1] border-2 border-white/90 shadow-inner"
          aria-hidden
        >
          <div
            className="h-full rounded-full bg-[#FFC61A] shadow-[0_0_8px_#FFC61A] transition-[width,background-color] duration-300 ease-out"
            style={{ width: currentWidth }}
          />
        </div>
      </div>
    </div>
  );
}
