import { cn } from "@/lib/utils";

/**
 * Loading skeleton. AGENTS.md: "Halaman: skeleton, kosong, error (+ tombol Coba
 * lagi)". A shimmering placeholder keeps layout stable so the page does not jump
 * when real rows land — the spinner it replaces caused a full reflow.
 */
export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "animate-pulse rounded-lg border-2 border-choco-900/15 bg-gradient-to-r from-cream via-white to-cream",
        className,
      )}
    />
  );
}

/** Rows shaped like the podium list, so the swap-in is invisible. */
export function SkeletonRows({ count = 5 }: { count?: number }) {
  return (
    <div className="divide-y-2 divide-choco-900/10" role="status" aria-label="Memuat data">
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="flex items-center gap-3 px-4 py-3.5 sm:px-6">
          <Skeleton className="size-9 shrink-0 rounded-full" />
          <div className="min-w-0 flex-1 space-y-2">
            <Skeleton className="h-3.5 w-32" />
            <Skeleton className="h-3 w-20" />
          </div>
          <Skeleton className="h-6 w-14 shrink-0 rounded-full" />
        </div>
      ))}
    </div>
  );
}

/** Grid cards shaped like items/raffles so page doesn't reflow. */
export function SkeletonCards({ count = 4 }: { count?: number }) {
  return (
    <div className="grid gap-6 grid-cols-1 md:grid-cols-2" role="status" aria-label="Memuat data">
      {Array.from({ length: count }, (_, i) => (
        <div
          key={i}
          className="rounded-[28px] border-3 border-choco-900/15 bg-white p-5 sm:p-6 shadow-[0_4px_0_rgba(59,34,24,0.06)] space-y-4"
        >
          <div className="flex items-center justify-between gap-2">
            <Skeleton className="h-6 w-24 rounded-full" />
            <Skeleton className="h-6 w-20 rounded-full" />
          </div>
          <div className="flex gap-4 items-center">
            <Skeleton className="size-18 rounded-2xl shrink-0" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-3.5 w-full" />
              <Skeleton className="h-3.5 w-1/2" />
            </div>
          </div>
          <div className="pt-2 border-t border-choco-900/10 flex items-center justify-between">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-9 w-32 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );
}