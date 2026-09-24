import { useState, useMemo } from "react";
import { Link } from "@tanstack/react-router";
import { Sparkles, Trophy, ArrowRight, BookOpen } from "lucide-react";
import { useProgress } from "@/lib/store";
import { UNITS, sequentialNodes } from "@/lib/curriculum";
import { PulauRantaiProgres } from "@/components/pulau-rantai-progres";
import { Card } from "@/components/ui/card";
import { ProgressBar } from "@/components/ui/progress-bar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { StreakBadge } from "@/components/ui/streak-badge";

export function DeskRail() {
  const [showProgresModal, setShowProgresModal] = useState(false);
  const streak = useProgress((s) => s.streak);
  const xpToday = useProgress((s) => s.xpToday);
  const storiesToday = useProgress((s) => s.storiesToday ?? 0);
  const completed = useProgress((s) => s.completed);
  const completedToday = xpToday > 0;

  const allNodes = useMemo(() => sequentialNodes(), []);
  const completedCount = completed.length;
  const totalCount = allNodes.length;
  const percent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const completedUnitsCount = useMemo(() => {
    return UNITS.filter((u) => {
      const lessons = u.lessons.filter((l) => l.kind !== "chest");
      return lessons.length > 0 && lessons.every((l) => completed.includes(l.id));
    }).length;
  }, [completed]);

  return (
    <>
      <div className="flex flex-col gap-4 p-4">
        {/* 0. Progres 20 Rute Pulau Rantai (Overlay HUD Card) */}
        <Card variant="default" padding="md" className="space-y-3 bg-cream border-2 border-choco-900 shadow-[0_3px_0_#3B2218]">
          <div className="flex items-center justify-between">
            <span className="font-pixel text-xs font-bold text-choco-900 flex items-center gap-1.5">
              <BookOpen className="size-4 text-candy-600" />
              Progres 20 Rute
            </span>
            <span className="px-2 py-0.5 rounded-full bg-candy-100 text-[10px] font-pixel font-bold text-candy-700 border border-choco-900">
              {completedUnitsCount}/20 Rute
            </span>
          </div>
          <div>
            <div className="flex justify-between items-center text-xs font-semibold text-choco-700 mb-1.5">
              <span>Blok Selesai</span>
              <span className="font-pixel text-candy-600 font-bold">{completedCount}/{totalCount} ({percent}%)</span>
            </div>
            <ProgressBar value={completedCount} max={totalCount} size="sm" />
          </div>
          <button
            type="button"
            onClick={() => setShowProgresModal(true)}
            className="w-full py-2 px-3 rounded-xl bg-candy-500 hover:bg-candy-600 text-white font-pixel text-xs font-bold border-2 border-choco-900 shadow-[0_2px_0_#3B2218] active:translate-y-0.5 transition-all cursor-pointer flex items-center justify-center gap-1.5"
          >
            <BookOpen className="size-3.5" />
            <span>Lihat Peta 20 Rute</span>
          </button>
        </Card>

        {/* 1. Streak Status Card */}
      <div className="flex justify-center">
        <StreakBadge
          length={streak}
          frequency="daily"
          variant="colored"
          subtitle={streak > 0 ? "Api Belajar Aktif" : "Mulai Hari Ini"}
          className="w-full"
        />
      </div>

      {/* 2. Daily Quests Card */}
      <Card variant="default" padding="md" className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="t-label text-ink-900 flex items-center gap-1.5">
            <Sparkles className="size-4 text-primary" />
            Misi Harian
          </span>
          <span className="t-caption text-ink-300 font-mono text-[11px]">Reset 24j</span>
        </div>

        <div className="space-y-3.5">
          {/* Mission 1 */}
          <div className="pb-3 border-b border-line space-y-1.5">
            <div className="flex justify-between items-center">
              <span className="t-body text-xs text-ink-900">
                Selesaikan 1 blok pelajaran
              </span>
              <Badge variant="coin" size="sm">
                +3 ★
              </Badge>
            </div>
            <ProgressBar value={completedToday ? 1 : 0} max={1} size="sm" />
          </div>

          {/* Mission 2 */}
          <div className="pb-3 border-b border-line space-y-1.5">
            <div className="flex justify-between items-center">
              <span className="t-body text-xs text-ink-900">
                Raih 20 XP hari ini
              </span>
              <Badge variant="coin" size="sm">
                +5 ★
              </Badge>
            </div>
            <ProgressBar value={Math.min(20, xpToday)} max={20} size="sm" />
          </div>

          {/* Mission 3 */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <span className="t-body text-xs text-ink-900">
                Baca 1 Kisah On-Chain
              </span>
              <Badge variant="coin" size="sm">
                +4 ★
              </Badge>
            </div>
            <ProgressBar value={storiesToday > 0 ? 1 : 0} max={1} size="sm" />
          </div>
        </div>
      </Card>

      {/* 3. Arena Weekly Preview */}
      <Card variant="default" padding="md" className="space-y-3">
        <div className="flex items-center justify-between gap-2">
          <Badge variant="brand" size="sm" className="gap-1">
            <Trophy className="size-3.5 text-coin" />
            Arena Mingguan
          </Badge>
          <Badge variant="coin" size="sm">
            500 ★ Pool
          </Badge>
        </div>
        <div>
          <h3 className="t-heading text-sm text-ink-900">
            Kompetisi Belajar XP
          </h3>
          <p className="t-caption text-ink-500 mt-1 leading-relaxed">
            Top 10 pengumpul XP berbagi pool bintang toko on-chain. Cukup validasi blok harianmu.
          </p>
        </div>
        <div className="pt-1">
          <Link to="/leaderboard" className="block">
            <Button
              variant="secondary"
              size="sm"
              wide
              iconAfter={<ArrowRight className="size-4" />}
            >
              Buka Klasemen Arena
            </Button>
          </Link>
        </div>
      </Card>
    </div>

      {/* Progres Analytics Modal from DeskRail */}
      {showProgresModal && (
        <div
          className="fixed inset-0 z-50 bg-choco-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-150"
          onClick={() => setShowProgresModal(false)}
        >
          <div
            className="bg-cream border-3 border-choco-900 rounded-[28px] w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-[0_8px_0_#3B2218] p-4 sm:p-5 relative animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <PulauRantaiProgres onClose={() => setShowProgresModal(false)} />
          </div>
        </div>
      )}
    </>
  );
}
