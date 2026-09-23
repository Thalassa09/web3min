import { useState, type ReactNode, useEffect } from "react";
import { Sparkles, Trophy, Flame, ChevronRight, ChevronLeft, X } from "lucide-react";
import { useProgress } from "@/lib/store";

interface GameOverlayHUDProps {
  children: ReactNode;
}

export function GameOverlayHUD({ children }: GameOverlayHUDProps) {
  const streak = useProgress((s) => s.streak);
  const xpToday = useProgress((s) => s.xpToday);
  const storiesToday = useProgress((s) => s.storiesToday ?? 0);

  // Compute daily quest count
  const q1 = xpToday > 0 ? 1 : 0;
  const q2 = xpToday >= 20 ? 1 : 0;
  const q3 = storiesToday > 0 ? 1 : 0;
  const completedQuests = q1 + q2 + q3;

  // Desktop overlay open/collapsed state (starts open on xl screens)
  const [isDesktopOpen, setIsDesktopOpen] = useState(true);
  // Mobile modal overlay state
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Responsive default setup
  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsDesktopOpen(window.innerWidth >= 1280);
    }
  }, []);

  return (
    <>
      {/* ─────────────────────────────────────────────────────────────
          1. DESKTOP / TABLET GAME OVERLAY (>= 1024px)
          Floating on the right side of the map without squeezing it
         ───────────────────────────────────────────────────────────── */}
      <div className="hidden lg:block fixed right-6 top-20 z-30 transition-all duration-300 ease-out">
        {isDesktopOpen ? (
          <div className="w-[320px] max-h-[calc(100vh-6.5rem)] rounded-[26px] bg-white/92 backdrop-blur-2xl border-2 border-ink-900 shadow-[6px_6px_0_#0D2340] overflow-hidden flex flex-col transition-all duration-200 animate-in fade-in zoom-in-95">
            {/* Game HUD Header */}
            <div className="flex items-center justify-between px-4 py-2.5 bg-ink-900 text-white border-b-2 border-ink-900 shrink-0">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-black uppercase tracking-wider text-candy flex items-center gap-1.5">
                  <Sparkles className="size-3.5 text-candy" />
                  Quest & Arena HUD
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/10 text-white/90">
                  {completedQuests}/3 Misi
                </span>
              </div>
              <button
                type="button"
                className="p-1 rounded-full text-white/70 hover:text-white hover:bg-white/10 cursor-pointer transition-colors"
                onClick={() => setIsDesktopOpen(false)}
                title="Sembunyikan HUD"
              >
                <ChevronRight className="size-4" />
              </button>
            </div>

            {/* Scrollable HUD Content */}
            <div className="overflow-y-auto no-scrollbar flex-1">
              {children}
            </div>
          </div>
        ) : (
          /* Minimized Floating HUD Pill on the right edge */
          <button
            type="button"
            className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-full bg-white/95 backdrop-blur-xl border-2 border-ink-900 shadow-[4px_4px_0_#0D2340] cursor-pointer hover:scale-105 active:scale-95 transition-all text-xs font-black text-ink-900 group"
            onClick={() => setIsDesktopOpen(true)}
            title="Buka Game HUD"
          >
            <ChevronLeft className="size-4 text-candy transition-transform group-hover:-translate-x-0.5" />
            <div className="flex items-center gap-1.5 text-candy-deep">
              <Flame className="size-4 fill-candy text-candy-deep" />
              <span>{streak}</span>
            </div>
            <span className="w-1 h-1 rounded-full bg-ink-300" />
            <div className="flex items-center gap-1.5 text-ink-700">
              <Sparkles className="size-3.5 text-candy" />
              <span>{completedQuests}/3</span>
            </div>
            <span className="w-1 h-1 rounded-full bg-ink-300" />
            <div className="flex items-center gap-1 text-coin-deep">
              <Trophy className="size-3.5 text-coin" />
            </div>
          </button>
        )}
      </div>

      {/* ─────────────────────────────────────────────────────────────
          2. MOBILE FLOATING GAME HUD BUTTON (< 1024px)
          Floating pill on the right side above the bottom dock
         ───────────────────────────────────────────────────────────── */}
      <div className="lg:hidden fixed right-4 bottom-20 z-25">
        <button
          type="button"
          className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-white/95 backdrop-blur-xl border-2 border-ink-900 shadow-[3px_3px_0_#0D2340] cursor-pointer active:scale-95 transition-all text-xs font-black text-ink-900"
          onClick={() => setIsMobileOpen(true)}
        >
          <div className="flex items-center gap-1 text-candy-deep">
            <Flame className="size-3.5 fill-candy text-candy-deep" />
            <span>{streak}</span>
          </div>
          <span className="w-1 h-1 rounded-full bg-ink-300" />
          <div className="flex items-center gap-1 text-ink-700">
            <Sparkles className="size-3.5 text-candy" />
            <span>{completedQuests}/3</span>
          </div>
        </button>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          3. MOBILE MODAL OVERLAY (< 1024px)
          Full drawer/modal when user taps the mobile HUD button
         ───────────────────────────────────────────────────────────── */}
      {isMobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-ink-900/60 backdrop-blur-xs animate-in fade-in">
          {/* Backdrop click to close */}
          <div
            className="absolute inset-0"
            onClick={() => setIsMobileOpen(false)}
          />

          <div className="relative w-full max-w-md bg-white border-t-2 sm:border-2 border-ink-900 rounded-t-[28px] sm:rounded-[28px] shadow-[0_-4px_24px_rgba(13,35,64,0.25)] overflow-hidden max-h-[85vh] flex flex-col z-10 animate-in slide-in-from-bottom-6 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-5 py-3.5 bg-ink-900 text-white border-b-2 border-ink-900 shrink-0">
              <div className="flex items-center gap-2">
                <Sparkles className="size-4 text-candy" />
                <span className="text-xs font-black uppercase tracking-wider text-white">
                  Misi Harian & Arena
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/10 text-candy">
                  {completedQuests}/3 Selesai
                </span>
              </div>
              <button
                type="button"
                className="p-1 rounded-full text-white/70 hover:text-white hover:bg-white/10 cursor-pointer"
                onClick={() => setIsMobileOpen(false)}
              >
                <X className="size-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="overflow-y-auto no-scrollbar flex-1 p-2 pb-6">
              {children}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
