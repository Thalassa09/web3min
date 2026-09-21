import { Link } from "@tanstack/react-router";
import { Ticket, Volume2, VolumeX } from "lucide-react";
import { Fire, Heart } from "@/lib/kicon";
import { BrandMark } from "@/components/brand-mark";
import { BlockStamp } from "@/components/motif";
import { MAX_HEARTS, formatGems, useProgress } from "@/lib/store";

export function TopStatus({ brand = true }: { brand?: boolean }) {
  const streak = useProgress((s) => s.streak);
  const gems = useProgress((s) => s.gems);
  const hearts = useProgress((s) => s.hearts);
  const raffleTickets = useProgress((s) => s.raffleTickets ?? 0);
  const sound = useProgress((s) => s.sound);
  const setSound = useProgress((s) => s.setSound);

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between gap-2 px-4 py-2.5 bg-[#070810]/90 backdrop-blur-xl border-b border-[#181d2e] select-none">
      {/* Brand / Logo */}
      {brand ? (
        <BrandMark className="mr-auto min-w-0 lg:hidden" />
      ) : (
        <span className="mr-auto" />
      )}
      <span className="mr-auto hidden lg:block" />

      {/* Telemetry Stat Cluster */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        {/* Streak Pill */}
        <div
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-[12px] bg-[#111322] border border-[#222842] text-[#ff9100] font-mono text-xs font-bold shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] hover:border-[#ff9100]/40 transition-colors"
          title="Streak Belajar Berturut-turut"
        >
          <Fire className="size-4 shrink-0" weight="fill" />
          <span className="text-zinc-100 tabular-nums">{streak}</span>
          <span className="hidden sm:inline text-[10px] text-zinc-500 uppercase">HARI</span>
        </div>

        {/* Gems / Bintang Pill */}
        <div
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-[12px] bg-[#111322] border border-[#222842] text-[#f59e0b] font-mono text-xs font-bold shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] hover:border-[#f59e0b]/40 transition-colors"
          title="Bintang Belajar"
        >
          <BlockStamp size={15} />
          <span className="text-zinc-100 tabular-nums">{formatGems(gems)}</span>
        </div>

        {/* Raffle Tickets Pill */}
        <Link
          to="/leaderboard"
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-[12px] bg-[#0c1a17] border border-[#00f59b]/35 text-[#00f59b] font-mono text-xs font-bold shadow-[0_0_12px_rgba(0,245,155,0.1),inset_0_1px_0_rgba(255,255,255,0.08)] hover:bg-[#102420] hover:border-[#00f59b]/60 transition-all active:scale-[0.96]"
          title="Tiket Undian Web3"
        >
          <Ticket className="size-3.5 shrink-0 animate-pulse" />
          <span className="text-white tabular-nums font-black">{raffleTickets}</span>
          <span className="hidden sm:inline text-[10px] text-[#00f59b] opacity-80 uppercase">TIKET</span>
        </Link>

        {/* Hearts / Nyawa Pill */}
        <div
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-[12px] bg-[#1a111a] border border-[#ff4365]/35 text-[#ff4365] font-mono text-xs font-bold shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] hover:border-[#ff4365]/60 transition-colors"
          title="Nyawa Tersisa"
        >
          <Heart className="size-4 shrink-0" weight="fill" />
          <span className="text-zinc-100 tabular-nums">
            {hearts}/{MAX_HEARTS}
          </span>
        </div>

        {/* Sound Toggle Button */}
        <button
          type="button"
          onClick={() => setSound(!sound)}
          className="p-1.5 rounded-[10px] bg-[#111322] border border-[#222842] text-zinc-400 hover:text-zinc-100 hover:border-zinc-600 transition-all active:scale-[0.92]"
          title={sound ? "Matikan Efek Suara" : "Nyalakan Efek Suara"}
          aria-label={sound ? "Matikan Efek Suara" : "Nyalakan Efek Suara"}
        >
          {sound ? <Volume2 className="size-4 text-[#00f59b]" /> : <VolumeX className="size-4 text-zinc-500" />}
        </button>
      </div>
    </header>
  );
}
