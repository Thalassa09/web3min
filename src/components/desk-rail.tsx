import { Link } from "@tanstack/react-router";
import { Ticket, ArrowRight, Sparkles } from "lucide-react";
import { DailyQuests } from "@/components/daily-quests";
import { AirdropWall } from "@/components/proof-gallery";
import { useProgress } from "@/lib/store";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { TelemetryBadge } from "@/components/ui/telemetry-badge";

export function DeskRail() {
  const raffleTickets = useProgress((s) => s.raffleTickets ?? 0);
  const gems = useProgress((s) => s.gems);
  const buyRaffleTicketsWithGems = useProgress((s) => s.buyRaffleTicketsWithGems);

  return (
    <div className="flex flex-col gap-6">
      {/* Live Raffle Quick Entry Spotlight Card */}
      <SpotlightCard glowColor="rgba(0, 245, 155, 0.22)" className="w-full">
        <div className="flex items-center justify-between mb-3">
          <TelemetryBadge label="RAFFLE HUB" value="LIVE" tone="mint" pulsing />
          <span className="font-mono text-[10px] text-zinc-500">CHAINLINK VRF</span>
        </div>

        <h3 className="font-display font-black text-base text-zinc-100 leading-tight">
          100 USDT Web3 Learning Pool
        </h3>
        <p className="mt-1 text-xs text-zinc-400 font-sans leading-relaxed">
          Gunakan tiket hasil belajar untuk merebut hadiah bulanan terverifikasi on-chain.
        </p>

        <div className="mt-4 p-2.5 rounded-[12px] bg-[#070810] border border-[#1b1f33] flex items-center justify-between">
          <span className="text-xs font-mono text-zinc-400">SALDO TIKET:</span>
          <span className="text-sm font-mono font-black text-[#00f59b] flex items-center gap-1">
            <Ticket className="size-3.5" />
            {raffleTickets} TIKET
          </span>
        </div>

        <div className="mt-4 flex items-center gap-2">
          <Link
            to="/leaderboard"
            className="flex-1 inline-flex items-center justify-center gap-2 h-9 px-3 rounded-[12px] bg-[#00f59b] text-[#06080b] font-mono text-xs font-bold uppercase tracking-wider shadow-[0_3px_0_#00b875] hover:bg-[#1affaa] active:translate-y-[2px] active:shadow-none transition-all"
          >
            <span>Masuk Arena</span>
            <ArrowRight className="size-3.5" />
          </Link>

          <button
            type="button"
            disabled={gems < 10}
            onClick={() => buyRaffleTicketsWithGems(1)}
            className="inline-flex items-center justify-center h-9 px-3 rounded-[12px] bg-[#141726] border border-[#262c47] text-zinc-200 font-mono text-xs font-bold uppercase hover:bg-[#1c2138] hover:border-[#384166] active:scale-[0.96] disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            title="Tukar 10 Bintang jadi 1 Tiket"
          >
            <Sparkles className="size-3 text-[#f59e0b] mr-1" />
            <span>+1 Tiket</span>
          </button>
        </div>
      </SpotlightCard>

      {/* Daily Quests Block */}
      <div className="rounded-[24px] p-5 bg-[#090b14]/90 border border-[#1b1f33] backdrop-blur-md shadow-[0_4px_20px_rgba(0,0,0,0.4)]">
        <DailyQuests compact className="px-0 pt-0" />
      </div>

      {/* Airdrop Wall Proofs */}
      <AirdropWall compact />
    </div>
  );
}
