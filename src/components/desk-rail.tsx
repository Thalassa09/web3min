import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { useProgress } from "@/lib/store";

export function DeskRail() {
  const streak = useProgress((s) => s.streak);
  const xpToday = useProgress((s) => s.xpToday);
  const completed = useProgress((s) => s.completed);
  const completedToday = xpToday > 0;
  const storiesToday = useProgress((s) => s.storiesToday ?? 0);

  return (
    <div className="hidden xl:flex flex-col gap-4.5 w-[300px] shrink-0 p-5 z-10 sticky top-5 overflow-x-hidden">
      {/* Blobi Speech Bubble */}
      <div className="p-4 rounded-[16px] bg-white border-2 border-ink-900 shadow-[4px_4px_0_#1B1440] flex items-center gap-3">
        <img
          src="/mascot/idle.png"
          alt="Blobi"
          className="size-14 pixelated object-contain shrink-0"
        />
        <div className="relative p-2.5 rounded-[12px] bg-sky-100 border-2 border-ink-900 text-xs font-semibold text-ink-900 leading-snug">
          {streak > 0
            ? `Streak ${streak} hari! Selesaikan 1 pelajaran lagi biar apinya nggak padam.`
            : "Halo! Selesaikan 1 pelajaran pertamamu yuk, biar apinya menyala!"}
        </div>
      </div>

      {/* Daily Quests Card */}
      <div className="p-5 rounded-[16px] bg-white border-2 border-ink-900 shadow-[4px_4px_0_#1B1440]">
        <div className="font-['Pixelify_Sans'] text-xs font-semibold tracking-wider uppercase text-ink-500 mb-3">
          Misi Harian
        </div>

        <div className="space-y-3.5">
          {/* Mission 1 */}
          <div className="pb-3 border-b-2 border-dashed border-ink-900/15">
            <div className="flex justify-between items-center mb-2">
              <b className="font-sans font-bold text-xs text-ink-900">
                Selesaikan 1 pelajaran
              </b>
              <span className="font-['Pixelify_Sans'] text-xs font-bold px-2 py-0.5 rounded-[6px] border-[1.5px] border-ink-900 bg-cream text-ink-900">
                +3 ★
              </span>
            </div>
            <div className="grid grid-cols-1 gap-1">
              <span
                className={`h-2.5 rounded-[4px] border-2 border-ink-900 ${
                  completedToday ? "bg-leaf" : "bg-white"
                }`}
              />
            </div>
          </div>

          {/* Mission 2 */}
          <div className="pb-3 border-b-2 border-dashed border-ink-900/15">
            <div className="flex justify-between items-center mb-2">
              <b className="font-sans font-bold text-xs text-ink-900">
                Raih 20 XP hari ini
              </b>
              <span className="font-['Pixelify_Sans'] text-xs font-bold px-2 py-0.5 rounded-[6px] border-[1.5px] border-ink-900 bg-cream text-ink-900">
                +5 ★
              </span>
            </div>
            <div className="grid grid-cols-4 gap-1">
              {Array.from({ length: 4 }).map((_, i) => (
                <span
                  key={i}
                  className={`h-2.5 rounded-[4px] border-2 border-ink-900 ${
                    xpToday >= (i + 1) * 5 ? "bg-leaf" : "bg-white"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Mission 3 */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <b className="font-sans font-bold text-xs text-ink-900">
                Baca 1 Kisah
              </b>
              <span className="font-['Pixelify_Sans'] text-xs font-bold px-2 py-0.5 rounded-[6px] border-[1.5px] border-ink-900 bg-cream text-ink-900">
                +4 ★
              </span>
            </div>
            <div className="grid grid-cols-1 gap-1">
              <span
                className={`h-2.5 rounded-[4px] border-2 border-ink-900 ${
                  storiesToday > 0 ? "bg-leaf" : "bg-white"
                }`}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Arena Weekly Preview */}
      <div className="p-5 rounded-[16px] bg-sky-500 border-2 border-ink-900 shadow-[4px_4px_0_#1B1440] text-white">
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className="px-2 py-0.5 rounded-[6px] text-[11px] font-['Pixelify_Sans'] font-bold bg-white text-ink-900 border-[1.5px] border-ink-900">
            Arena Mingguan
          </span>
          <span className="text-[11px] font-bold text-coin">
            500 ★ Pool
          </span>
        </div>
        <h3 className="font-sans font-extrabold text-base text-white">
          Kompetisi Belajar XP
        </h3>
        <p className="mt-1 text-xs text-sky-100 leading-relaxed">
          Top 10 pengumpul XP berbagi 500 Bintang Toko Blobi. Gratis, tanpa deposit. Cukup belajar.
        </p>
        <div className="mt-3.5">
          <Link to="/leaderboard" className="block">
            <button
              type="button"
              className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-[10px] bg-coin text-ink-900 border-2 border-ink-900 shadow-[2px_2px_0_#1B1440] font-sans font-extrabold text-xs hover:brightness-105 active:translate-y-[1px] cursor-pointer"
            >
              <span>Buka Arena</span>
              <ArrowRight className="size-3.5" />
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
