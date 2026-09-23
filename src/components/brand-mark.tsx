import { cn } from "@/lib/utils";

export function BrandMark({ className }: { className?: string }) {
  return (
    <span className={cn("flex items-center gap-2.5 select-none", className)}>
      <span className="relative grid size-10 place-items-center rounded-md bg-blobi-soft border-2 border-ink-900 shadow-ink-sm overflow-hidden shrink-0">
        <img src="/mascot/idle.png" alt="Blobi" className="size-8 pixelated object-contain -mt-0.5" />
      </span>
      <span className="font-display text-[26px] font-bold tracking-tight text-ink-900 leading-none">
        web3<span className="text-blobi">min</span>
      </span>
    </span>
  );
}
