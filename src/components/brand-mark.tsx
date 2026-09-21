import { Hexagon } from "@/lib/kicon";
import { cn } from "@/lib/utils";

export function BrandMark({ className }: { className?: string }) {
  return (
    <span className={cn("flex items-center gap-1.5", className)}>
      <span className="relative grid size-8 place-items-center">
        <Hexagon className="absolute size-8 text-primary" weight="fill" />
        <img src="/mascot/idle.png" alt="" className="relative size-6 pixelated object-contain" />
      </span>
      <span className="text-xl font-extrabold tracking-tight text-primary">web3min</span>
    </span>
  );
}
