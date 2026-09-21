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
    <header className="sticky top-0 z-30 flex items-center justify-between gap-2 px-4 py-2.5 bg-[#0a0d14]/90 backdrop-blur-md border-b border-[#1a2130] select-none">
      {/* Brand on Mobile */}
      {brand ? (
        <BrandMark className="mr-auto min-w-0 lg:hidden" />
      ) : (
        <span className="mr-auto" />
      )}
      <span className="mr-auto hidden lg:block" />

      {/* Stats Cluster */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        {/* Streak */}
        <div
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-[12px] bg-[#121622] border border-[#1e2536] text-xs font-bold font-sans hover:border-[#2b354c] transition-colors"
          title="Streak Belajar"
        >
          <Fire className="size-4 shrink-0 text-[#ff9100]" weight="fill" />
          <span className="text-[#f1f4fa] tabular-nums">{streak}</span>
        </div>

        {/* Gems / Bintang */}
        <div
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-[12px] bg-[#121622] border border-[#1e2536] text-xs font-bold font-sans hover:border-[#2b354c] transition-colors"
          title="Bintang Belajar"
        >
          <BlockStamp size={14} className="text-[#f59e0b]" />
          <span className="text-[#f1f4fa] tabular-nums">{formatGems(gems)}</span>
        </div>

        {/* Raffle Tickets */}
        <Link
          to="/leaderboard"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-[12px] bg-[#121622] border border-[#1e2536] hover:border-[#00f59b]/50 text-xs font-bold font-sans transition-all active:scale-[0.97]"
          title="Tiket Undian Web3"
        >
          <Ticket className="size-3.5 shrink-0 text-[#00f59b]" />
          <span className="text-[#f1f4fa] tabular-nums">{raffleTickets}</span>
        </Link>

        {/* Hearts */}
        <div
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-[12px] bg-[#121622] border border-[#1e2536] text-xs font-bold font-sans hover:border-[#2b354c] transition-colors"
          title="Nyawa Tersisa"
        >
          <Heart className="size-4 shrink-0 text-[#ff4365]" weight="fill" />
          <span className="text-[#f1f4fa] tabular-nums">
            {hearts}/{MAX_HEARTS}
          </span>
        </div>

        {/* Sound Toggle */}
        <button
          type="button"
          onClick={() => setSound(!sound)}
          className="p-2 rounded-[12px] bg-[#121622] border border-[#1e2536] text-[#8e9ab2] hover:text-[#f1f4fa] hover:border-[#2b354c] transition-all active:scale-[0.95]"
          title={sound ? "Matikan Suara" : "Nyalakan Suara"}
          aria-label={sound ? "Matikan Suara" : "Nyalakan Suara"}
        >
          {sound ? <Volume2 className="size-4" /> : <VolumeX className="size-4" />}
        </button>
      </div>
    </header>
  );
}
