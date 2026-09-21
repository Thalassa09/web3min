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
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between gap-1 sm:gap-2 px-2.5 sm:px-4 bg-[#0B63F6] border-b border-white/25 shadow-[0_4px_14px_rgba(11,79,209,0.3)] select-none">
      {/* Brand on Mobile / Small screens */}
      {brand ? (
        <Link to="/" className="mr-auto shrink-0 select-none flex items-center gap-1.5 lg:hidden" aria-label="Beranda">
          <span className="relative grid size-8 sm:size-9 place-items-center rounded-xl bg-[#FFC61A] border-2 border-[#D99400] shadow-[0_2px_0_#D99400]">
            <img src="/mascot/idle.png" alt="" className="size-6 pixelated object-contain" />
          </span>
          <span className="hidden md:inline font-display text-lg font-bold tracking-tight text-white drop-shadow-[0_1px_1px_rgba(11,79,209,0.5)]">
            web3<span className="text-[#FFC61A]">min</span>
          </span>
        </Link>
      ) : (
        <span className="mr-auto" />
      )}
      <span className="mr-auto hidden lg:block" />

      {/* 5 Fixed Slots HUD Cluster */}
      <div className="flex items-center gap-1 sm:gap-1.5 md:gap-2">
        {/* 1. Streak (Flame) */}
        <div
          className="flex items-center gap-1 h-8 sm:h-9 px-2 sm:px-2.5 rounded-full bg-white/95 hover:bg-white border-2 border-white/80 shadow-[0_2px_0_#0B4FD1] text-[11px] sm:text-xs font-extrabold font-sans text-[#0D2340] transition-colors"
          title="Streak Belajar Harian"
        >
          <Fire className="size-3.5 sm:size-4 shrink-0 text-[#FF7A18]" weight="fill" />
          <span className="tabular-nums">{streak}</span>
        </div>

        {/* 2. Bintang / Stars (Coin) */}
        <div
          className="flex items-center gap-1 h-8 sm:h-9 px-2 sm:px-2.5 rounded-full bg-white/95 hover:bg-white border-2 border-white/80 shadow-[0_2px_0_#0B4FD1] text-[11px] sm:text-xs font-extrabold font-sans text-[#0D2340] transition-colors"
          title="Saldo Bintang Belajar"
        >
          <BlockStamp size={13} className="text-[#FFC61A]" />
          <span className="tabular-nums">{formatGems(gems)}</span>
        </div>

        {/* 3. Tiket Undian (Ticket) */}
        <Link
          to="/leaderboard"
          className="flex items-center gap-1 h-8 sm:h-9 px-2 sm:px-2.5 rounded-full bg-white/95 hover:bg-white border-2 border-white/80 shadow-[0_2px_0_#0B4FD1] text-[11px] sm:text-xs font-extrabold font-sans text-[#0D2340] transition-all active:translate-y-[2px] active:shadow-none"
          title="Tiket Undian Hadiah"
        >
          <Ticket className="size-3.5 sm:size-4 shrink-0 text-[#0B63F6]" />
          <span className="tabular-nums">{raffleTickets}</span>
        </Link>

        {/* 4. Nyawa (Ruby Hearts) */}
        <div
          className="flex items-center gap-1 h-8 sm:h-9 px-2 sm:px-2.5 rounded-full bg-white/95 hover:bg-white border-2 border-white/80 shadow-[0_2px_0_#0B4FD1] text-[11px] sm:text-xs font-extrabold font-sans text-[#0D2340] transition-colors"
          title="Nyawa Belajar"
        >
          <Heart className="size-3.5 sm:size-4 shrink-0 text-[#E63329]" weight="fill" />
          <span className="tabular-nums">
            {hearts}/{MAX_HEARTS}
          </span>
        </div>

        {/* 5. Sound Toggle */}
        <button
          type="button"
          onClick={() => setSound(!sound)}
          className="flex items-center justify-center size-8 sm:size-9 rounded-full bg-white/95 hover:bg-white border-2 border-white/80 shadow-[0_2px_0_#0B4FD1] text-[#1E3A5F] hover:text-[#0D2340] transition-all active:translate-y-[2px] active:shadow-none cursor-pointer shrink-0"
          title={sound ? "Matikan Suara" : "Nyalakan Suara"}
          aria-label={sound ? "Matikan Suara" : "Nyalakan Suara"}
        >
          {sound ? <Volume2 className="size-3.5 sm:size-4" /> : <VolumeX className="size-3.5 sm:size-4 text-[#E63329]" />}
        </button>
      </div>
    </header>
  );
}
