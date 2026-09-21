import { Link } from "@tanstack/react-router";
import { DailyQuests } from "@/components/daily-quests";
import { AirdropWall } from "@/components/proof-gallery";
import { useProgress } from "@/lib/store";

export function DeskRail() {
  const raffleTickets = useProgress((s) => s.raffleTickets ?? 0);

  return (
    <div className="flex flex-col gap-6">
      <DailyQuests compact className="px-0 pt-0" />
      <Link
        to="/leaderboard"
        className="group block rounded-sm border border-[#262633] bg-[#111116] p-4 transition-all hover:border-[#00f59b]/50 hover:bg-[#14141d]"
      >
        <div className="flex items-center justify-between font-mono text-[10px] font-black uppercase text-[#00f59b]">
          <span>// LIVE RAFFLE</span>
          <span className="size-1.5 rounded-full bg-[#00f59b] animate-ping" />
        </div>
        <p className="mt-2 font-mono text-base font-black leading-tight text-white group-hover:text-[#00f59b] transition-colors">
          100 USDT Learning Pool
        </p>
        <p className="mt-1 font-mono text-xs text-[#8b8b9e]">
          Tiket Anda: <span className="font-bold text-[#00f59b]">{raffleTickets} Tiket</span>
        </p>
        <div className="mt-3 flex items-center justify-between border-t border-[#1e1e26] pt-2 font-mono text-[11px] font-bold text-[#00f59b]">
          <span>IKUTI UNDIAN</span>
          <span>→</span>
        </div>
      </Link>
      <AirdropWall compact />
    </div>
  );
}
