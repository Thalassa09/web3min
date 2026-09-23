import { useEffect, useState } from "react";
import { Mascot } from "@/components/mascot";
import { ProgressBar } from "@/components/ui/progress-bar";
import { cn } from "@/lib/utils";

const STAGES = [
  { label: "Menyusun blok pertama…", width: "35%" },
  { label: "Memvalidasi rantai…", width: "75%" },
  { label: "Rantai tervalidasi!", width: "100%" },
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
        "relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-canvas p-6 text-center select-none",
        exiting && "boot-out",
        className
      )}
      role="status"
      aria-live="polite"
    >
      {/* Calm ambient background (Apple-style subtle glow) */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-primary-soft/50 blur-3xl" />
      </div>

      {/* Center Blobi & Wordmark */}
      <div className="relative z-10 flex flex-col items-center">
        <div className="relative">
          <Mascot mood="wave" size={130} interactive />
        </div>

        <h1 className="mt-4 font-sans text-[32px] font-black text-ink-900 tracking-tight">
          {title}
        </h1>

        <p className="mt-2 text-sm font-semibold text-ink-500 max-w-xs transition-opacity duration-200">
          {currentHint}
        </p>

        {/* Candy-Stripe Loading Bar */}
        <div className="mt-6 w-[200px]" aria-hidden>
          <ProgressBar
            value={stage === 0 ? 35 : stage === 1 ? 75 : 100}
            size="md"
          />
        </div>
      </div>
    </div>
  );
}
