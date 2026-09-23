import { Link } from "@tanstack/react-router";
import { Flame, Sparkles, Trophy, ArrowRight } from "lucide-react";
import { useProgress } from "@/lib/store";

export function DeskRail() {
  const streak = useProgress((s) => s.streak);
  const xpToday = useProgress((s) => s.xpToday);
  const storiesToday = useProgress((s) => s.storiesToday ?? 0);
  const completedToday = xpToday > 0;

  return (
    <div className="flex flex-col gap-3 p-3.5">
      {/* 1. Streak Status Card */}
      <div className="p-3.5 rounded-2xl bg-white/85 border border-ink-900/10 shadow-xs flex items-center gap-3">
        <div className="grid size-11 shrink-0 place-items-center rounded-xl border border-ink-900/15 bg-candy-soft text-candy-deep">
          <Flame className="size-5.5 text-candy-deep stroke-[2.2] fill-candy" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-[11px] font-black uppercase tracking-wider text-candy-deep">
            {streak > 0 ? `Streak ${streak} Hari` : "Mulai Streak"}
          </div>
          <p className="mt-0.5 text-xs font-semibold text-ink-500 leading-snug truncate">
            {streak > 0 ? "Pertahankan api belajarmu!" : "Selesaikan 1 modul hari ini"}
          </p>
        </div>
      </div>

      {/* 2. Daily Quests Card */}
      <div className="p-4 rounded-2xl bg-white/85 border border-ink-900/10 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[11px] font-black tracking-wide uppercase text-ink-600 flex items-center gap-1.5">
            <Sparkles className="size-3.5 text-candy" />
            Misi Harian
          </span>
          <span className="text-[10px] font-bold text-ink-400">Reset 24j</span>
        </div>

        <div className="space-y-3">
          {/* Mission 1 */}
          <div className="pb-2.5 border-b border-ink-900/5">
            <div className="flex justify-between items-center mb-1">
              <span className="font-sans font-bold text-xs text-ink-900">
                Selesaikan 1 pelajaran
              </span>
              <span className="text-[10px] font-black px-2 py-0.5 rounded-full border border-candy-line bg-candy-soft text-candy-deep">
                +3 ★
              </span>
            </div>
            <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden border border-ink-900/5">
              <div
                className="h-full bg-candy rounded-full transition-all duration-300"
                style={{ width: completedToday ? "100%" : "0%" }}
              />
            </div>
          </div>

          {/* Mission 2 */}
          <div className="pb-2.5 border-b border-ink-900/5">
            <div className="flex justify-between items-center mb-1">
              <span className="font-sans font-bold text-xs text-ink-900">
                Raih 20 XP hari ini
              </span>
              <span className="text-[10px] font-black px-2 py-0.5 rounded-full border border-candy-line bg-candy-soft text-candy-deep">
                +5 ★
              </span>
            </div>
            <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden border border-ink-900/5">
              <div
                className="h-full bg-candy rounded-full transition-all duration-300"
                style={{ width: `${Math.min(100, Math.round((xpToday / 20) * 100))}%` }}
              />
            </div>
          </div>

          {/* Mission 3 */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="font-sans font-bold text-xs text-ink-900">
                Baca 1 Kisah On-Chain
              </span>
              <span className="text-[10px] font-black px-2 py-0.5 rounded-full border border-candy-line bg-candy-soft text-candy-deep">
                +4 ★
              </span>
            </div>
            <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden border border-ink-900/5">
              <div
                className="h-full bg-candy rounded-full transition-all duration-300"
                style={{ width: storiesToday > 0 ? "100%" : "0%" }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 3. Arena Weekly Preview */}
      <div className="p-4 rounded-2xl bg-white/85 border border-ink-900/10 shadow-xs">
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black bg-candy-soft text-candy-deep border border-candy-line">
            <Trophy className="size-3 text-coin" />
            Arena Mingguan
          </span>
          <span className="text-[11px] font-black text-coin">
            500 ★ Pool
          </span>
        </div>
        <h3 className="font-display text-sm font-black text-ink-900 tracking-tight">
          Kompetisi Belajar XP
        </h3>
        <p className="mt-0.5 text-xs text-ink-500 leading-relaxed">
          Top 10 pengumpul XP berbagi hadiah bintang toko. Cukup selesaikan modul belajar.
        </p>
        <div className="mt-3">
          <Link to="/leaderboard" className="block">
            <button
              type="button"
              className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-full bg-candy hover:bg-candy-deep text-white border border-ink-900/10 shadow-xs font-display text-xs font-black transition-all active:scale-95 cursor-pointer"
            >
              <span>Buka Klasemen Arena</span>
              <ArrowRight className="size-3.5 stroke-[2.4]" />
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
