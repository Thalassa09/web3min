import { useState, useEffect, type ReactNode } from "react";
import { useProgress } from "@/lib/store";
import { QUESTS, questProgress } from "@/lib/quests";
import { Sparkles, X, ChevronLeft, Flame, Trophy } from "lucide-react";

export function GameOverlayHUD({ children }: { children?: ReactNode }) {
  const [isDesktopOpen, setIsDesktopOpen] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const streak = useProgress((s) => s.streak);
  const xpToday = useProgress((s) => s.xpToday);
  const dailyGoal = useProgress((s) => s.dailyGoal);
  const lessonsToday = useProgress((s) => s.lessonsToday);
  const perfectToday = useProgress((s) => s.perfectToday);
  const storiesToday = useProgress((s) => s.storiesToday);

  const stats = { xpToday, dailyGoal, lessonsToday, perfectToday, storiesToday };
  const completedQuests = QUESTS.filter((q) => questProgress(q.id, stats).done).length;

  // Handle escape key to close overlays
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsDesktopOpen(false);
        setIsMobileOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <>
      {/* ─────────────────────────────────────────────────────────────
          1. DESKTOP / TABLET GAME OVERLAY (>= 1024px)
          Starts collapsed as a tactile pill on the right side.
          Opens only when clicked by the user!
         ───────────────────────────────────────────────────────────── */}
      <div className="hidden lg:block fixed right-6 top-32 z-30 transition-all duration-300 ease-out">
        {isDesktopOpen ? (
          <>
            {/* Click-outside backdrop to dismiss */}
            <div
              className="fixed inset-0 z-30 bg-choco-900/40 backdrop-blur-xs animate-in fade-in"
              onClick={() => setIsDesktopOpen(false)}
              aria-label="Tutup overlay"
            />

            {/* Expanded HUD Card */}
            <div className="relative z-40 w-[330px] max-h-[calc(100vh-9.5rem)] rounded-[28px] bg-cream border-3 border-choco-900 shadow-[0_8px_0_#3B2218] overflow-hidden flex flex-col transition-all duration-200 animate-in fade-in zoom-in-95 text-choco-900">
              {/* Game HUD Header */}
              <div className="flex items-center justify-between px-4 py-2.5 bg-candy-100 text-choco-900 border-b-2 border-choco-900 shrink-0">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-pixel font-bold uppercase tracking-wider text-candy-700 flex items-center gap-1.5">
                    <Sparkles className="size-3.5 text-candy-700" />
                    Quest & Arena HUD
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white border border-choco-900 text-choco-900">
                    {completedQuests}/3 Misi
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    className="flex size-7 items-center justify-center rounded-full border border-choco-900 bg-white text-choco-900 shadow-[0_1px_0_#3B2218] hover:bg-candy-100 cursor-pointer transition-colors"
                    onClick={() => setIsDesktopOpen(false)}
                    title="Tutup HUD (Esc)"
                  >
                    <X className="size-3.5" />
                  </button>
                </div>
              </div>

              {/* Scrollable HUD Content */}
              <div className="overflow-y-auto no-scrollbar flex-1">
                {children}
              </div>
            </div>
          </>
        ) : (
          /* Minimized Floating HUD Pill on the right edge (Default state) */
          <button
            type="button"
            className="flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-cream border-2 border-choco-900 shadow-[0_3px_0_#3B2218] cursor-pointer hover:scale-105 active:translate-y-0.5 transition-all text-xs font-bold text-choco-900 group"
            onClick={() => setIsDesktopOpen(true)}
            title="Klik untuk membuka Quest & Arena HUD"
          >
            <ChevronLeft className="size-4 text-candy-700 transition-transform group-hover:-translate-x-0.5" />
            <div className="flex items-center gap-1.5 text-candy-700">
              <Flame className="size-4 fill-candy-500 text-candy-700" />
              <span>{streak}</span>
            </div>
            <span className="w-1 h-1 rounded-full bg-choco-300" />
            <div className="flex items-center gap-1.5 text-choco-700">
              <Sparkles className="size-3.5 text-candy-700" />
              <span>{completedQuests}/3</span>
            </div>
            <span className="w-1 h-1 rounded-full bg-choco-300" />
            <div className="flex items-center gap-1 text-amber-600">
              <Trophy className="size-3.5 text-amber-500" />
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
          className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-cream border-2 border-choco-900 shadow-[0_3px_0_#3B2218] cursor-pointer active:translate-y-0.5 transition-all text-xs font-bold text-choco-900"
          onClick={() => setIsMobileOpen(true)}
          title="Buka Misi & Arena"
        >
          <div className="flex items-center gap-1 text-candy-700">
            <Flame className="size-3.5 fill-candy-500 text-candy-700" />
            <span>{streak}</span>
          </div>
          <span className="w-1 h-1 rounded-full bg-choco-300" />
          <div className="flex items-center gap-1 text-choco-700">
            <Sparkles className="size-3.5 text-candy-700" />
            <span>{completedQuests}/3</span>
          </div>
        </button>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          3. MOBILE MODAL OVERLAY (< 1024px)
          Full drawer/modal when user taps the mobile HUD button
         ───────────────────────────────────────────────────────────── */}
      {isMobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-choco-900/60 backdrop-blur-xs animate-in fade-in">
          {/* Backdrop click to close */}
          <div
            className="absolute inset-0"
            onClick={() => setIsMobileOpen(false)}
            aria-label="Tutup overlay"
          />

          <div className="relative w-full max-w-md bg-cream border-t-3 sm:border-3 border-choco-900 rounded-t-[28px] sm:rounded-[28px] shadow-[0_8px_0_#3B2218] overflow-hidden max-h-[85vh] flex flex-col z-10 animate-in slide-in-from-bottom-6 duration-200 text-choco-900">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-5 py-3.5 bg-candy-100 text-choco-900 border-b-2 border-choco-900 shrink-0">
              <div className="flex items-center gap-2">
                <Sparkles className="size-4 text-candy-700" />
                <span className="text-xs font-pixel font-bold uppercase tracking-wider text-choco-900">
                  Misi Harian & Arena
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white border border-choco-900 text-candy-700">
                  {completedQuests}/3 Selesai
                </span>
              </div>
              <button
                type="button"
                className="flex size-8 items-center justify-center rounded-full border border-choco-900 bg-white text-choco-900 shadow-[0_1px_0_#3B2218] hover:bg-candy-100 cursor-pointer"
                onClick={() => setIsMobileOpen(false)}
                title="Tutup (Esc)"
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
