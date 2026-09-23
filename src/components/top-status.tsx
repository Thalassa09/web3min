import { useEffect, useRef, useState, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { Sparkles, Volume2, VolumeX, Menu } from "lucide-react";
import { Fire, Heart } from "@/lib/kicon";
import { BlockStamp } from "@/components/motif";
import { MAX_HEARTS, formatGems, useProgress } from "@/lib/store";
import { useNavStore } from "@/lib/nav-store";
import { playTap, setAudioEnabled } from "@/lib/audio";
import { cn } from "@/lib/utils";

const pillBase =
  "relative flex h-8 sm:h-9 shrink-0 items-center gap-1 sm:gap-1.5 rounded-full border-2 border-ink-900 bg-white/95 px-2.5 sm:px-3 text-xs font-black text-ink-900 shadow-[inset_0_1px_0_rgba(255,255,255,0.85),0_1px_0_var(--color-ink-900)] transition-transform duration-100 ease-out active:scale-95 active:translate-y-0.5";

function StatPill({ value, display, icon, title, floatColor = "var(--color-coin)" }: {
  value: number; display?: ReactNode; icon: ReactNode; title: string; floatColor?: string;
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
    return () => { clearTimeout(a); clearTimeout(b); };
  }, [value]);

  return (
    <div title={title} className={pillBase} style={{ animation: bump ? "pill-bump 420ms var(--ease-back)" : undefined }}>
      <span className="grid size-4 shrink-0 place-items-center">{icon}</span>
      <span className="tabular-nums tracking-tight">{display ?? value}</span>
      {delta > 0 && <span className="pill-float" style={{ color: floatColor, textShadow: "0 1px 0 var(--color-ink-900)" }}>+{delta}</span>}
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
    <header className="sticky top-0 z-30 flex h-14 sm:h-16 select-none items-center gap-2 border-b-2 border-ink-900 bg-white/80 px-3 backdrop-blur-xl backdrop-saturate-180 shadow-[inset_0_1px_0_rgba(255,255,255,0.9)] sm:px-5">
      {brand && (
        <div className="flex items-center gap-2">
          {/* Menu Hamburger Trigger Button */}
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
              "gap-1.5 px-2.5 sm:px-3 text-ink-900 hover:bg-candy-50 cursor-pointer active:translate-y-0.5",
              isNavOpen && "bg-candy-50 border-candy-deep text-candy-deep"
            )}
          >
            <Menu className="size-4 text-candy-deep" />
            <span className="hidden font-display text-xs font-black sm:inline">
              Menu
            </span>
          </button>

          <Link to="/" aria-label="Beranda" className="flex shrink-0 items-center gap-2">
            <span className="grid size-8 sm:size-9 place-items-center rounded-full border-2 border-ink-900 bg-candy-soft shadow-xs">
              <img src="/mascot/idle.png" alt="" className="pixelated size-5 sm:size-6 object-contain" />
            </span>
            <span className="hidden font-display text-base sm:text-lg font-black text-ink-900 sm:inline">
              web3<span className="text-candy">min</span>
            </span>
          </Link>
        </div>
      )}

      <div className="ml-auto flex items-center gap-2">
        <div className="hidden sm:block">
          <StatPill value={xp} display={`${xp} XP`} title="Total XP" icon={<Sparkles className="size-4 text-leaf" />} floatColor="var(--color-leaf)" />
        </div>
        <StatPill
          value={streak}
          title="Streak Belajar Harian"
          icon={<Fire className={cn("size-4", streak > 0 ? "flame-active text-flame" : "text-ink-300")} weight={streak > 0 ? "fill" : "regular"} />}
          floatColor="var(--color-flame)"
        />
        <StatPill value={gems} display={formatGems(gems)} title="Saldo Bintang" icon={<BlockStamp size={13} className="text-coin" />} />
        <StatPill
          value={hearts}
          title="Nyawa"
          display={<>{hearts}<span className="hidden sm:inline">/{MAX_HEARTS}</span></>}
          icon={<Heart className="size-4 text-ruby" weight="fill" />}
          floatColor="var(--color-ruby)"
        />
        <button
          type="button"
          aria-label={sound ? "Matikan Suara" : "Nyalakan Suara"}
          onClick={() => {
            const next = !sound;
            setSound(next);
            setAudioEnabled(next);
            if (next) playTap();
          }}
          className={cn(pillBase, "hidden size-9 justify-center px-0 active:translate-y-[2px] active:shadow-none sm:flex")}
        >
          {sound ? <Volume2 className="size-4" /> : <VolumeX className="size-4 text-ruby" />}
        </button>

        {/* Global Nav Menu Trigger in Candy Pink (Burger / X) */}
        <button
          type="button"
          aria-label={isNavOpen ? "Sembunyikan Menu Navigasi" : "Buka Menu Navigasi"}
          title="Menu Navigasi Web3min"
          onClick={() => {
            if (sound) playTap();
            toggleNav();
          }}
          className="bubble-trigger group relative flex size-9 sm:size-10 items-center justify-center rounded-full border-2 border-ink-900 bg-[#F26A99] text-white shadow-ink-sm transition-all duration-150 active:translate-y-0.5 active:shadow-none cursor-pointer hover:brightness-105"
        >
          <div className="flex flex-col items-center justify-center gap-1">
            <span
              className={cn(
                "block rounded-full bg-white transition-transform duration-200",
                isNavOpen ? "w-4.5 h-[2.5px] translate-y-[3.5px] rotate-45" : "w-4.5 h-[2.5px]"
              )}
            />
            <span
              className={cn(
                "block rounded-full bg-white transition-transform duration-200",
                isNavOpen ? "w-4.5 h-[2.5px] -translate-y-[3.5px] -rotate-45" : "w-4.5 h-[2.5px]"
              )}
            />
          </div>
        </button>
      </div>
    </header>
  );
}
