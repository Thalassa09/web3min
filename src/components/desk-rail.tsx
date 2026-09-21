import { Link } from "@tanstack/react-router";
import { Ticket, ArrowRight, Sparkles } from "lucide-react";
import { DailyQuests } from "@/components/daily-quests";
import { AirdropWall } from "@/components/proof-gallery";
import { useProgress } from "@/lib/store";
import { SurfaceCard } from "@/components/ui/surface-card";
import { TactileButton } from "@/components/ui/tactile-button";

export function DeskRail() {
  const raffleTickets = useProgress((s) => s.raffleTickets ?? 0);
  const gems = useProgress((s) => s.gems);
  const buyRaffleTicketsWithGems = useProgress((s) => s.buyRaffleTicketsWithGems);

  return (
    <div className="flex flex-col gap-5">
      {/* Live Raffle Card */}
      <SurfaceCard className="p-5">
        <div className="flex items-center justify-between pb-2">
          <span className="text-xs font-bold text-[#00f59b]">Undian Berhadiah</span>
          <span className="text-[11px] text-[#8e9ab2]">Chainlink VRF</span>
        </div>

        <h3 className="font-display font-bold text-base text-[#f1f4fa]">
          100 USDT Web3 Learning Pool
        </h3>
        <p className="mt-1 text-xs text-[#8e9ab2] leading-relaxed">
          Gunakan tiket hasil belajar untuk berkesempatan memenangkan hadiah on-chain.
        </p>

        <div className="mt-4 p-2.5 rounded-[12px] bg-[#0c1017] border border-[#1e2536] flex items-center justify-between">
          <span className="text-xs text-[#8e9ab2]">Saldo Tiket:</span>
          <span className="text-xs font-bold text-[#00f59b] flex items-center gap-1">
            <Ticket className="size-3.5" />
            {raffleTickets} Tiket
          </span>
        </div>

        <div className="mt-4 flex items-center gap-2">
          <Link to="/leaderboard" className="flex-1">
            <TactileButton variant="primary" size="sm" fullWidth icon={<ArrowRight className="size-3.5" />}>
              Buka Undian
            </TactileButton>
          </Link>

          <button
            type="button"
            disabled={gems < 10}
            onClick={() => buyRaffleTicketsWithGems(1)}
            className="inline-flex items-center justify-center h-9 px-3 rounded-[12px] bg-[#141824] border border-[#232b3e] text-[#f1f4fa] text-xs font-semibold hover:bg-[#1a2030] disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            title="Tukar 10 Bintang jadi 1 Tiket"
          >
            <Sparkles className="size-3 text-[#f59e0b] mr-1" />
            <span>+1 Tiket</span>
          </button>
        </div>
      </SurfaceCard>

      {/* Daily Quests Block */}
      <SurfaceCard className="p-5">
        <DailyQuests compact className="px-0 pt-0" />
      </SurfaceCard>

      {/* Airdrop Wall Proofs */}
      <AirdropWall compact />
    </div>
  );
}
