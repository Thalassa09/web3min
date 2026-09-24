import { Link } from "@tanstack/react-router";
import { Sparkles, Trophy, ArrowRight } from "lucide-react";
import { useProgress } from "@/lib/store";
import { Card } from "@/components/ui/card";
import { ProgressBar } from "@/components/ui/progress-bar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { StreakBadge } from "@/components/ui/streak-badge";

export function DeskRail() {
  const streak = useProgress((s) => s.streak);
  const xpToday = useProgress((s) => s.xpToday);
  const storiesToday = useProgress((s) => s.storiesToday ?? 0);
  const completedToday = xpToday > 0;

  return (
    <div className="flex flex-col gap-4 p-4">
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
  );
}
