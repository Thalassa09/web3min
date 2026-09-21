import { Link } from "@tanstack/react-router";
import { DailyQuests } from "@/components/daily-quests";
import { AirdropWall } from "@/components/proof-gallery";
import { useProgress } from "@/lib/store";

export function DeskRail() {
  const username = useProgress((s) => s.username);
  const friends = useProgress((s) => s.friends);

  return (
    <div className="flex flex-col gap-6">
      <DailyQuests compact className="px-0 pt-0" />
      <Link to="/leaderboard" className="block py-1">
        <p className="text-sm font-medium text-primary">Teman</p>
        <p className="mt-0.5 text-lg font-bold leading-tight">
          {friends.length === 0 ? "Masih sepi" : `${friends.length} orang`}
        </p>
        <p className="text-sm text-muted">@{username || "kamu"}</p>
      </Link>
      <AirdropWall compact />
    </div>
  );
}
