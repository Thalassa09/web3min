import { Link } from "@tanstack/react-router";
import { Ticket, ArrowRight, Sparkles } from "lucide-react";
import { SurfaceCard } from "@/components/ui/surface-card";
import { TactileButton } from "@/components/ui/tactile-button";
import { DailyQuests } from "@/components/daily-quests";
import { AirdropWall } from "@/components/proof-gallery";
import { useProgress } from "@/lib/store";

export function DeskRail() {
  const raffleTickets = useProgress((s) => s.raffleTickets ?? 0);
  const gems = useProgress((s) => s.gems);
  const buyRaffleTicketsWithGems = useProgress((s) => s.buyRaffleTicketsWithGems);

  return (
    <div className="hidden xl:flex flex-col gap-5 w-[320px] shrink-0 p-5 z-10">
      {/* Active Web3 Raffle Card */}
      <SurfaceCard className="p-5 bg-white">
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-[#E4F0FF] text-[#0B4FD1] border border-[#8FC2FF]">
            Undian In-Game
          </span>
          <span className="text-[11px] font-bold text-[#4A6580]">Acak Adil</span>
        </div>

        <h3 className="font-display font-bold text-lg text-[#0D2340]">
          Paket 500 Bintang Belajar
        </h3>
        <p className="mt-1 text-xs text-[#4A6580] leading-relaxed">
          Gunakan tiket hasil belajar untuk berkesempatan memenangkan hadiah in-game resmi.
        </p>

        <div className="mt-4 p-3 rounded-[14px] bg-[#E4F0FF] border-2 border-[#8FC2FF] flex items-center justify-between">
          <span className="text-xs font-bold text-[#1E3A5F]">Saldo Tiket:</span>
          <span className="text-xs font-extrabold text-[#0B4FD1] flex items-center gap-1.5">
            <Ticket className="size-4 text-[#0B63F6]" />
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
            className="inline-flex items-center justify-center h-10 px-3 rounded-[14px] bg-white border-2 border-[#B9CFE9] shadow-[0_3px_0_#C8DBF0] text-[#0D2340] text-xs font-extrabold hover:bg-[#F0F6FF] active:translate-y-[2px] active:shadow-none disabled:opacity-40 disabled:cursor-not-allowed transition-[transform,box-shadow,background-color,border-color,color] cursor-pointer"
            title="Tukar 10 Bintang jadi 1 Tiket"
          >
            <Sparkles className="size-3.5 text-[#FFC61A] mr-1" />
            <span>+1</span>
          </button>
        </div>
      </SurfaceCard>

      {/* Daily Quests Block */}
      <SurfaceCard className="p-5 bg-white">
        <DailyQuests compact className="px-0 pt-0 text-[#0D2340]" />
      </SurfaceCard>

      {/* Airdrop Wall Proofs */}
      <AirdropWall compact />
    </div>
  );
}
