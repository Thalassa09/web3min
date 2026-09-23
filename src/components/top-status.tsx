import { useEffect, useRef, useState, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, Sparkles, Volume2, VolumeX } from "lucide-react";
import { Fire, Heart } from "@/lib/kicon";
import { BlockStamp } from "@/components/motif";
import { MAX_HEARTS, formatGems, useProgress } from "@/lib/store";
import { useNavStore } from "@/lib/nav-store";
import { playTap, setAudioEnabled } from "@/lib/audio";
import { cn } from "@/lib/utils";

const pillBase =
  "relative flex h-8 sm:h-9 shrink-0 items-center gap-1 sm:gap-1.5 rounded-full border-2 border-choco-900 bg-cream px-2 sm:px-2.5 text-xs sm:text-sm font-black text-choco-900 shadow-[0_2px_0_#3B2218] transition-transform duration-100 ease-out active:scale-95 active:translate-y-0.5";

function StatPill({
  value,
  display,
  icon,
  title,
  floatColor = "var(--color-lemon-deep)",
}: {
  value: number;
  display?: ReactNode;
  icon: ReactNode;
  title: string;
  floatColor?: string;
}) {
  const prev = useRef(value);
  const [delta, setDelta] = useState(0);
  const [bump, setBump] = useState(false);

  useEffect(() => {
    const gained = value - prev.current;
    prev.current = value;
    if (gained <= 0) return;
    setDelta(gained);
    setBump(true);
    const a = setTimeout(() => setDelta(0), 900);
    const b = setTimeout(() => setBump(false), 420);
    return () => {
      clearTimeout(a);
      clearTimeout(b);
    };
  }, [value]);

  return (
    <div
      title={title}
      className={pillBase}
      style={{
        animation: bump ? "pill-bump 420ms var(--ease-back)" : undefined,
      }}
    >
      <span className="grid size-4 shrink-0 place-items-center">{icon}</span>
      <span className="font-sans font-black text-xs sm:text-sm text-choco-900 tabular-nums tracking-tight leading-none">
        {display ?? value}
      </span>
      {delta > 0 && (
        <span
          className="pill-float"
          style={{
            color: floatColor,
            textShadow: "0 1px 0 var(--color-choco-900)",
          }}
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
  const xp = useProgress((s) => s.xp);
  const hearts = useProgress((s) => s.hearts);
  const sound = useProgress((s) => s.sound);
  const setSound = useProgress((s) => s.setSound);

  const isNavOpen = useNavStore((s) => s.isOpen);
  const toggleNav = useNavStore((s) => s.toggle);

  return (
    <header className="sticky top-0 z-30 flex h-14 sm:h-16 select-none items-center gap-2 border-b-2 border-choco-900 bg-cream/95 px-3 backdrop-blur-xl shadow-[0_2px_0_rgba(59,34,24,0.06)] sm:px-5">
      {brand && (
        <div className="flex items-center gap-2">
          {/* ─────────────────────────────────────────────────────────────
              DESKTOP ONLY MENU TRIGGER: "hidden lg:flex"
              Requirement: "untuk versi mobil tidak ada overlay"
              On mobile (< lg), this button does NOT render at all.
             ───────────────────────────────────────────────────────────── */}
          <button
            type="button"
            aria-label={isNavOpen ? "Sembunyikan Menu" : "Buka Menu Utama"}
            title="Menu Utama (Buka / Sembunyikan)"
            onClick={() => {
              if (sound) playTap();
              toggleNav();
            }}
            className={cn(
              pillBase,
              "hidden lg:flex gap-1.5 px-3 text-choco-900 hover:bg-candy-100 cursor-pointer active:translate-y-0.5",
              isNavOpen && "bg-candy-100 border-candy-500 text-candy-600"
            )}
          >
            <Menu className="size-4 text-candy-500" />
            <span className="font-pixel text-xs font-bold">
              Menu
            </span>
          </button>

          {/* Brand Logo & Title: Visible on all viewports */}
          <Link
            to="/"
            aria-label="Beranda"
            className="flex shrink-0 items-center gap-2"
          >
            <span className="grid size-8 sm:size-9 place-items-center rounded-full border-2 border-choco-900 bg-candy-100 shadow-[0_2px_0_#3B2218]">
              <img
                src="/mascot/idle.png"
                alt=""
                className="pixelated size-5 sm:size-6 object-contain"
              />
            </span>
            <span className="font-pixel text-base sm:text-lg font-bold text-choco-900">
              web3<span className="text-candy-500">min</span>
            </span>
          </Link>
        </div>
      )}

      {/* Resource Stats Pills & Controls */}
      <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
        <div className="hidden sm:block">
          <StatPill
            value={xp}
            title={`${xp} Total XP`}
            icon={<Sparkles className="size-3.5 text-candy-500 fill-candy-500" />}
            floatColor="var(--color-candy-500)"
          />
        </div>

        <StatPill
          value={streak}
          title={`${streak} hari beruntun`}
          icon={
            <Fire
              className={cn("size-3.5", streak > 0 ? "text-flame-500" : "text-choco-900/40")}
              weight={streak > 0 ? "fill" : "regular"}
            />
          }
          floatColor="var(--color-flame-500)"
        />

        <StatPill
          value={gems}
          display={formatGems(gems)}
          title={`${gems} Bintang`}
          icon={<BlockStamp size={16} lit={false} />}
          floatColor="var(--color-lemon-deep)"
        />

        <Link
          to="/shop"
          title={`Nyawa ${hearts}/${MAX_HEARTS}, ketuk untuk buka Toko`}
          className={cn(
            pillBase,
            hearts <= 1 && "animate-pulse border-danger text-danger bg-danger/10",
          )}
        >
          <span className="grid size-4 shrink-0 place-items-center">
            <Heart
              className={cn("size-3.5", hearts > 0 ? "text-danger" : "text-choco-900/40")}
              weight={hearts > 0 ? "fill" : "regular"}
            />
          </span>
          <span className="font-sans font-black text-xs sm:text-sm text-choco-900 tabular-nums tracking-tight leading-none">
            {hearts}
          </span>
          {hearts < MAX_HEARTS && (
            <span className="text-candy-500 text-xs font-black leading-none">+</span>
          )}
        </Link>

        {/* Sound FX Toggle Pill */}
        <button
          type="button"
          aria-label={sound ? "Matikan suara" : "Nyalakan suara"}
          title={sound ? "Suara aktif (klik untuk matikan)" : "Suara senyap (klik untuk aktifkan)"}
          onClick={() => {
            const next = !sound;
            setSound(next);
            setAudioEnabled(next);
            if (next) playTap();
          }}
          className={cn(
            pillBase,
            "px-2 sm:px-2.5",
            !sound && "opacity-60 bg-cream/70 text-choco-900/50"
          )}
        >
          {sound ? (
            <Volume2 className="size-4 text-choco-900" />
          ) : (
            <VolumeX className="size-4 text-danger" />
          )}
        </button>
      </div>
    </header>
  );
}
