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