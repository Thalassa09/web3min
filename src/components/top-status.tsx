import { useState, useEffect, useRef } from "react";
import { Link } from "@tanstack/react-router";
import { Ticket, Volume2, VolumeX, Sparkles } from "lucide-react";
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
  to,
  floatColor = "#FFC61A",
  floatShadow = "#D99400",
}: {
  value: number;
  displayValue?: React.ReactNode;
  icon: React.ReactNode;
  title?: string;
  to?: string;
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

  const content = (
    <>
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
    </>
  );

  const className = `relative flex items-center gap-0.5 sm:gap-1 h-8 sm:h-9 px-1.5 sm:px-2.5 rounded-full bg-[#F7FAFC] hover:bg-[#F0F6FF] border-2 border-[#DCE7F5] shadow-[0_2px_0_#C8DBF0] text-[11px] sm:text-xs font-extrabold font-sans text-[#0D2340] transition-[transform,box-shadow,background-color] duration-150 shrink-0 ${to ? "cursor-pointer active:translate-y-[2px] active:shadow-none" : ""}`;

  if (to) {
    return (
      <Link
        to={to}
        className={className}
        style={{ animation: bump ? "pill-bump 420ms var(--ease-back)" : undefined }}
        title={title}
      >
        {content}
      </Link>
    );
  }

  return (
    <div
      className={className}
      style={{ animation: bump ? "pill-bump 420ms var(--ease-back)" : undefined }}
      title={title}
    >
      {content}
    </div>
  );
}

export function TopStatus({ brand = true }: { brand?: boolean }) {
  const streak = useProgress((s) => s.streak);
  const gems = useProgress((s) => s.gems);
  const xp = useProgress((s) => s.xp);
  const hearts = useProgress((s) => s.hearts);
  const raffleTickets = useProgress((s) => s.raffleTickets ?? 0);
  const sound = useProgress((s) => s.sound);
  const setSound = useProgress((s) => s.setSound);

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between gap-1 sm:gap-2 px-3 sm:px-5 bg-white/95 backdrop-blur-md border-b-2 border-[#DCE7F5] shadow-[0_2px_8px_rgba(9,48,102,0.04)] select-none overflow-hidden">
      {/* Brand on Mobile / Small screens: Only mascot coin on mobile, logo text on sm+ */}
      {brand ? (
        <Link to="/" className="mr-auto shrink-0 select-none flex items-center gap-1.5 lg:hidden" aria-label="Beranda">
          <span className="relative grid size-8 sm:size-9 place-items-center rounded-xl bg-[#FFC61A] border-2 border-[#D99400] shadow-[0_2px_0_#D99400] shrink-0">
            <img src="/mascot/idle.png" alt="" className="size-6 pixelated object-contain" />
          </span>
          <span className="hidden sm:inline font-display text-lg font-bold tracking-tight text-[#0B4FD1]">
            web3<span className="text-[#D98200]">min</span>
          </span>
        </Link>
      ) : (
        <span className="mr-auto" />
      )}
      <span className="mr-auto hidden lg:block" />

      {/* Responsive HUD Cluster */}
      <div className="flex min-w-0 items-center justify-end gap-1.5 sm:gap-2">
        {/* 0. XP (Desktop/Tablet only) */}
        <div className="hidden sm:block">
          <StatPill
            value={xp}
            displayValue={`${xp} XP`}
            icon={<Sparkles className="size-3.5 sm:size-4 shrink-0 text-[#B27B00]" />}
            title="Total Poin Belajar (XP)"
            floatColor="#FFC61A"
            floatShadow="#D99400"
          />
        </div>

        {/* 1. Streak (Flame with dynamic flicker, grayed out if 0) */}
        <StatPill
          value={streak}
          icon={
            <Fire
              className={`size-3.5 sm:size-4 shrink-0 ${
                streak > 0 ? "text-[#F2841F] flame-active" : "text-[#94A3B8] opacity-50"
              }`}
              weight={streak > 0 ? "fill" : "regular"}
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

        {/* 3. Tiket Undian (Tablet/Desktop only; reachable via bottom nav on mobile) */}
        <div className="hidden sm:block">
          <StatPill
            value={raffleTickets}
            icon={<Ticket className="size-3.5 sm:size-4 shrink-0 text-sky-600" />}
            title="Tiket Undian Hadiah"
            to="/leaderboard"
            floatColor="var(--color-sky-600, #1367E8)"
            floatShadow="#0B4FD1"
          />
        </div>

        {/* 4. Nyawa (Ruby Hearts) */}
        <StatPill
          value={hearts}
          displayValue={
            <>
              <span className="sm:hidden">{hearts}</span>
              <span className="hidden sm:inline">{hearts}/{MAX_HEARTS}</span>
            </>
          }
          icon={<Heart className="size-3.5 sm:size-4 shrink-0 text-[#E63329]" weight="fill" />}
          title="Nyawa Belajar"
          floatColor="#E63329"
          floatShadow="#B01E18"
        />

        {/* 5. Sound Toggle (Tablet/Desktop only; mobile has it in Settings) */}
        <div className="hidden sm:block">
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
            className="flex items-center justify-center size-8 sm:size-9 rounded-full bg-[#F7FAFC] hover:bg-[#F0F6FF] border-2 border-[#DCE7F5] shadow-[0_2px_0_#C8DBF0] text-[#1E3A5F] hover:text-[#0D2340] transition-[transform,box-shadow] duration-150 active:translate-y-[2px] active:shadow-none cursor-pointer shrink-0"
            title={sound ? "Matikan Suara" : "Nyalakan Suara"}
            aria-label={sound ? "Matikan Suara" : "Nyalakan Suara"}
          >
            {sound ? <Volume2 className="size-3.5 sm:size-4 text-[#0B63F6]" /> : <VolumeX className="size-3.5 sm:size-4 text-[#E63329]" />}
          </button>
        </div>
      </div>
    </header>
  );
}
