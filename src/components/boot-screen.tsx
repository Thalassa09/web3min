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
        "relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-cream p-6 text-center select-none",
        exiting && "boot-out",
        className
      )}
      role="status"
      aria-live="polite"
    >
      {/* Center Blobi & Wordmark */}
      <div className="relative z-10 flex flex-col items-center">
        <div className="relative">
          <Mascot mood="wave" size={130} interactive />
        </div>

        <h1 className="mt-4 font-pixel text-4xl font-bold text-choco-900 tracking-tight">
          {title}
        </h1>

        <p className="mt-2 font-pixel text-xs font-bold text-choco-700 max-w-xs transition-opacity duration-200">
          {currentHint}
        </p>

        {/* Candy-Stripe Loading Bar with solid Choco border */}
        <div className="mt-6 w-[220px]" aria-hidden>
          <div className="relative h-5 w-full overflow-hidden rounded-full border-3 border-choco-900 bg-candy-100 shadow-[0_3px_0_#3B2218]">
            <div
              className="h-full candy-stripe-fill rounded-full transition-all duration-300 ease-out border-r-2 border-choco-900"
              style={{ width: `${stage === 0 ? 35 : stage === 1 ? 75 : 100}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
