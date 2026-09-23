import { useEffect, useRef, useState, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { Sparkles, Volume2, VolumeX } from "lucide-react";
import { Fire, Heart } from "@/lib/kicon";
import { BlockStamp } from "@/components/motif";
import { BubbleMenu } from "@/components/bubble-menu";
import { MAX_HEARTS, formatGems, useProgress } from "@/lib/store";
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

  return (
    <header className="sticky top-0 z-30 flex h-14 sm:h-16 select-none items-center gap-2 border-b-2 border-choco-900 bg-cream/95 px-3 backdrop-blur-xl shadow-[0_2px_0_rgba(59,34,24,0.06)] sm:px-5">
      {brand && (
        <Link
          to="/"
          aria-label="Beranda"
          className="flex shrink-0 items-center gap-2 lg:hidden"
        >
          <span className="grid size-8 sm:size-9 place-items-center rounded-full border-2 border-choco-900 bg-candy-100 shadow-[0_2px_0_#3B2218]">
            <img
              src="/mascot/idle.png"
              alt=""
              className="pixelated size-5 sm:size-6 object-contain"
            />
          </span>
          <span className="hidden font-pixel text-base sm:text-lg font-bold text-choco-900 sm:inline">
            web3<span className="text-candy-500">min</span>
          </span>
        </Link>
      )}

      <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
        <div className="hidden sm:block">
          <StatPill
            value={xp}
            display={`${xp} XP`}
            title="Total XP"
            icon={<Sparkles className="size-4 text-mint-deep fill-mint" />}
            floatColor="var(--color-mint-deep)"
          />
        </div>
        <StatPill
          value={streak}
          title="Streak Belajar Harian"
          icon={
            <Fire
              className={cn(
                "size-4",
                streak > 0
                  ? "flame-active text-streak fill-streak"
                  : "text-choco-600/40"
              )}
              weight={streak > 0 ? "fill" : "regular"}
            />
          }
          floatColor="var(--color-streak)"
        />
        <StatPill
          value={gems}
          display={formatGems(gems)}
          title="Saldo Bintang"
          icon={<BlockStamp size={14} className="text-lemon-deep fill-lemon" />}
          floatColor="var(--color-lemon-deep)"
        />
        <StatPill
          value={hearts}
          title="Nyawa"
          display={
            <span className="font-sans font-black text-xs sm:text-sm text-choco-900 leading-none">
              {hearts}
              <span className="text-choco-600/70 font-extrabold text-[10px] sm:text-xs">
                /{MAX_HEARTS}
              </span>
            </span>
          }
          icon={
            <Heart
              className="size-4 text-[#E5484D] fill-[#E5484D]"
              weight="fill"
            />
          }
          floatColor="#E5484D"
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
          className={cn(
            pillBase,
            "hidden size-9 justify-center px-0 active:translate-y-[2px] active:shadow-none sm:flex cursor-pointer"
          )}
        >
          {sound ? (
            <Volume2 className="size-4 text-choco-900" />
          ) : (
            <VolumeX className="size-4 text-danger" />
          )}
        </button>

        {/* Bubble Menu Global Trigger in Candy Pink */}
        <BubbleMenu
          compactTriggerOnly
          menuBg="#E8437F"
          menuContentColor="#ffffff"
        />
      </div>
    </header>
  );
}
