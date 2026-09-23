import { useEffect, useRef, useState, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { Sparkles, Volume2, VolumeX } from "lucide-react";
import { Fire, Heart } from "@/lib/kicon";
import { BlockStamp } from "@/components/motif";
import { MAX_HEARTS, formatGems, useProgress } from "@/lib/store";
import { playTap, setAudioEnabled } from "@/lib/audio";
import { cn } from "@/lib/utils";

const pillBase =
  "relative flex h-9 shrink-0 items-center gap-1 rounded-md border-2 border-ink-900 bg-white px-2.5 text-xs font-extrabold text-ink-900 shadow-ink-sm";

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
      {icon}
      <span className="tabular-nums">{display ?? value}</span>
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

  return (
    <header className="sticky top-0 z-30 flex h-16 select-none items-center gap-2 border-b-2 border-ink-900 bg-white/95 px-3 backdrop-blur-md sm:px-5">
      {brand && (
        <Link to="/" aria-label="Beranda" className="flex shrink-0 items-center gap-1.5 lg:hidden">
          <span className="grid size-9 place-items-center rounded-md border-2 border-ink-900 bg-blobi-soft shadow-ink-sm">
            <img src="/mascot/idle.png" alt="" className="pixelated size-6 object-contain" />
          </span>
          <span className="hidden font-display text-lg font-bold text-ink-900 sm:inline">
            web3<span className="text-blobi">min</span>
          </span>
        </Link>
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
          className={cn(pillBase, "hidden w-9 justify-center px-0 active:translate-y-[2px] active:shadow-none sm:flex")}
        >
          {sound ? <Volume2 className="size-4" /> : <VolumeX className="size-4 text-ruby" />}
        </button>
      </div>
    </header>
  );
}
