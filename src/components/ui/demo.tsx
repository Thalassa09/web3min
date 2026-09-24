import GameProgress from "@/components/ui/8bit-game-progress";
import { StreakBadge } from "@/components/ui/streak-badge";

export default function GameProgressDemo() {
  return (
    <div className="flex flex-col items-center justify-center w-full min-h-[400px] p-8 gap-6 retro">
      <GameProgress className="min-w-[300px] max-w-[420px] w-full" />
      <div className="p-4 flex flex-wrap gap-4 items-center justify-center font-sans">
        <StreakBadge length={7} frequency="daily" variant="colored" />
        <StreakBadge length={14} frequency="daily" variant="flame" size="lg" />
        <StreakBadge length={3} frequency="daily" variant="candy" size="sm" />
      </div>
    </div>
  );
}

export { GameProgressDemo };
