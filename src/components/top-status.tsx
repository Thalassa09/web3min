import { useState, useEffect, useRef } from "react";
import { Link } from "@tanstack/react-router";
import { Ticket, Volume2, VolumeX } from "lucide-react";
import { Fire, Heart } from "@/lib/kicon";
import { BrandMark } from "@/components/brand-mark";
import { BlockStamp } from "@/components/motif";
import { MAX_HEARTS, formatGems, useProgress } from "@/lib/store";
import { playTap, setAudioEnabled } from "@/lib/audio";

function StatPill({
  value,
  displayValue,
  icon,
  title,
  floatColor = "#FFC61A",
  floatShadow = "#D99400",
}: {
  value: number;
  displayValue?: string | number;
  icon: React.ReactNode;
  title?: string;
  floatColor?: string;
  floatShadow?: string;
}) {
  const prev = useRef(value);
  const [delta, setDelta] = useState(0);
  const [bump, setBump] = useState(false);

  useEffect(() => {
    if (value > prev.current) {
      setDelta(value - prev.current);
      setBump(true);
      const a = setTimeout(() => setDelta(0), 900);
      const b = setTimeout(() => setBump(false), 420);
      return () => {
        clearTimeout(a);
        clearTimeout(b);
      };
    }
    prev.current = value;
  }, [value]);

  return (
    <div
      className="relative flex items-center gap-1 h-8 sm:h-9 px-2 sm:px-2.5 rounded-full bg-white/95 hover:bg-white border-2 border-white/80 shadow-[0_2px_0_#0B4FD1] text-[11px] sm:text-xs font-extrabold font-sans text-[#0D2340] transition-[transform,box-shadow,background-color] duration-150"
      style={{ animation: bump ? "pill-bump 420ms var(--ease-back)" : undefined }}
      title={title}
    >
      {icon}
      <span className="tabular-nums">{displayValue ?? value}</span>
      {delta > 0 && (
        <span
          className="pill-float"
          style={{ color: floatColor, textShadow: `0 1px 0 ${floatShadow}` }}
        >
          +{delta}
        </span>
      )}
    </div>
  );
}

export function TopStatus({ brand = true }: { brand?: boolean }) {
  const streak = useProgress((s) => s.streak);
  const gems = useProgress((s) => s.gems);
  const hearts = useProgress((s) => s.hearts);
  const raffleTickets = useProgress((s) => s.raffleTickets ?? 0);
  const sound = useProgress((s) => s.sound);
  const setSound = useProgress((s) => s.setSound);

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between gap-1 sm:gap-2 px-2.5 sm:px-4 bg-sky-600 border-b border-white/25 shadow-[0_4px_14px_rgba(11,79,209,0.3)] select-none">
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
        {/* 1. Streak (Flame with dynamic flicker) */}
        <StatPill
          value={streak}
          icon={
            <Fire
              className={`size-3.5 sm:size-4 shrink-0 text-flame ${streak > 0 ? "flame-active" : "opacity-60"}`}
              weight="fill"
            />
          }
          title="Streak Belajar Harian"
          floatColor="var(--color-flame, #F2841F)"
          floatShadow="var(--color-flame-shadow, #C85200)"
        />

        {/* 2. Bintang / Stars (Coin with float delta) */}
        <StatPill
          value={gems}
          displayValue={formatGems(gems)}
          icon={<BlockStamp size={13} className="text-[#FFC61A]" />}
          title="Saldo Bintang Belajar"
          floatColor="#FFC61A"
          floatShadow="#D99400"
        />

        {/* 3. Tiket Undian (Ticket) */}
        <Link
          to="/leaderboard"
          className="relative flex items-center gap-1 h-8 sm:h-9 px-2 sm:px-2.5 rounded-full bg-white/95 hover:bg-white border-2 border-white/80 shadow-[0_2px_0_#0B4FD1] text-[11px] sm:text-xs font-extrabold font-sans text-[#0D2340] transition-[transform,box-shadow] duration-150 active:translate-y-[2px] active:shadow-none"
          title="Tiket Undian Hadiah"
        >
          <Ticket className="size-3.5 sm:size-4 shrink-0 text-[#0B63F6]" />
          <span className="tabular-nums">{raffleTickets}</span>
        </Link>

        {/* 4. Nyawa (Ruby Hearts) */}
        <StatPill
          value={hearts}
          displayValue={`${hearts}/${MAX_HEARTS}`}
          icon={<Heart className="size-3.5 sm:size-4 shrink-0 text-[#E63329]" weight="fill" />}
          title="Nyawa Belajar"
          floatColor="#E63329"
          floatShadow="#B01E18"
        />

        {/* 5. Sound Toggle */}
        <button
          type="button"
          onClick={() => {
            const next = !sound;
            setSound(next);
            setAudioEnabled(next);
            if (next) {
              playTap();
            }
          }}
          className="flex items-center justify-center size-8 sm:size-9 rounded-full bg-white/95 hover:bg-white border-2 border-white/80 shadow-[0_2px_0_#0B4FD1] text-[#1E3A5F] hover:text-[#0D2340] transition-[transform,box-shadow] duration-150 active:translate-y-[2px] active:shadow-none cursor-pointer shrink-0"
          title={sound ? "Matikan Suara" : "Nyalakan Suara"}
          aria-label={sound ? "Matikan Suara" : "Nyalakan Suara"}
        >
          {sound ? <Volume2 className="size-3.5 sm:size-4" /> : <VolumeX className="size-3.5 sm:size-4 text-[#E63329]" />}
        </button>
      </div>
    </header>
  );
}
