import { cn } from "@/lib/utils";

export function BrandMark({ className }: { className?: string }) {
  return (
    <span className={cn("flex items-center gap-2 select-none", className)}>
      <span className="relative grid size-9 place-items-center rounded-xl bg-[#FFC61A] border-2 border-[#D99400] shadow-[0_3px_0_#D99400]">
        <img src="/mascot/idle.png" alt="" className="size-7 pixelated object-contain -mt-0.5" />
      </span>
      <span className="font-display text-2xl font-bold tracking-tight text-[#0B4FD1] drop-shadow-[0_1px_0_#FFFFFF]">
        web3<span className="text-[#FFC61A] drop-shadow-[0_1px_0_#D99400]">min</span>
      </span>
    </span>
  );
}
