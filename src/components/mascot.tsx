import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { playMoodSfx, primeAudio } from "@/lib/audio";
import { wornList, type Worn } from "@/lib/accessories";
import { useProgress } from "@/lib/store";

export type MascotMood = "idle" | "wave" | "sad" | "celebrate" | "think" | "proud" | "angry" | "sleep";

const SRC: Record<MascotMood, string> = {
  idle: "/mascot/idle.png",
  wave: "/mascot/wave.png",
  sad: "/mascot/sad.png",
  celebrate: "/mascot/celebrate.png",
  think: "/mascot/think.png",
  proud: "/mascot/proud.png",
  angry: "/mascot/angry.png",
  sleep: "/mascot/sleep.png",
};

if (typeof window !== "undefined") {
  (Object.values(SRC)).forEach((src) => {
    const img = new Image();
    img.src = src;
  });
}

const PARTICLES: Partial<Record<MascotMood, { ch: string; className: string; delay: string }[]>> = {
  celebrate: [
    { ch: "*", className: "left-[10%] top-[12%] text-[0.7em] text-gold font-black", delay: "0s" },
    { ch: "*", className: "right-[12%] top-[16%] text-[0.8em] text-blob font-black", delay: "0.5s" },
  ],
  sad: [{ ch: "•", className: "left-[24%] top-[38%] text-[0.8em] font-bold text-candy-400", delay: "0.3s" }],
  angry: [
    { ch: "!", className: "right-[18%] top-[6%] text-[0.55em] font-black text-danger", delay: "0.2s" },
    { ch: "!", className: "left-[18%] top-[6%] text-[0.55em] font-black text-danger", delay: "0.6s" },
  ],
  sleep: [
    { ch: "z", className: "right-[18%] top-[14%] text-[0.5em] font-black text-choco-600", delay: "0s" },
    { ch: "Z", className: "right-[8%] top-[2%] text-[0.7em] font-black text-choco-600", delay: "0.8s" },
  ],
  think: [{ ch: "?", className: "right-[12%] top-[8%] text-[0.7em] font-black text-fg", delay: "0s" }],
  proud: [{ ch: "*", className: "right-[14%] top-[10%] text-[0.7em] text-gold font-black", delay: "0.2s" }],
};

type Props = {
  mood?: MascotMood;
  size?: number;
  float?: boolean;
  className?: string;
  interactive?: boolean;
  worn?: Worn;
  lite?: boolean;
  fill?: boolean;
  hideParticles?: boolean;
};

export function Mascot({
  mood = "idle",
  size = 180,
  className,
  interactive = true,
  worn: wornProp,
  lite = false,
  fill = false,
  hideParticles = false,
}: Props) {
  const storeWorn = useProgress((s) => s.worn);
  const worn = wornProp ?? storeWorn;
  const bits = wornList(worn);
  const [squish, setSquish] = useState(false);
  const [live, setLive] = useState(!lite);
  const root = useRef<HTMLDivElement>(null);
  const timer = useRef(0);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  useEffect(() => {
    if (lite) {
      setLive(false);
      return;
    }
    const node = root.current;
    if (!node) return;
    const vis = () => setLive(!document.hidden);
    vis();
    document.addEventListener("visibilitychange", vis);
    const io = new IntersectionObserver(([entry]) => setLive(Boolean(entry?.isIntersecting) && !document.hidden), {
      rootMargin: "60px",
      threshold: 0.05,
    });
    io.observe(node);
    return () => {
      document.removeEventListener("visibilitychange", vis);
      io.disconnect();
    };
  }, [lite]);

  const lastPoke = useRef(0);
  const poke = (clientX?: number) => {
    if (!interactive || lite) return;
    const now = performance.now();
    if (now - lastPoke.current < 150) return;
    lastPoke.current = now;
    void primeAudio();
    let pan = 0;
    const box = root.current?.getBoundingClientRect();
    if (box && typeof clientX === "number" && box.width > 0) {
      pan = ((clientX - box.left) / box.width) * 1.2 - 0.6;
    }
    playMoodSfx(mood, pan);
    setSquish(true);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setSquish(false), 480);
  };

  const fx = !lite && live;
  const particles = fx && !hideParticles ? (PARTICLES[mood] ?? []) : [];
  const anim = lite ? "" : squish ? "blobi-squishing" : `blobi-anim-${mood}`;

  return (
    <div
      ref={root}
      className={cn(
        "relative inline-flex items-end justify-center blobi-stage",
        lite && "blobi-lite",
        interactive && !lite && "cursor-pointer select-none touch-manipulation active:scale-95 transition-transform duration-75",
        className,
      )}
      style={fill ? { width: "100%", height: "100%" } : { width: size, height: size }}
      aria-label="web3min, maskot ikan blob"
      role={interactive && !lite ? "button" : "img"}
      tabIndex={interactive && !lite ? 0 : undefined}
      onClick={(e) => poke(e.clientX)}
      onPointerDown={(e) => {
        if (e.pointerType === "touch") {
          poke(e.clientX);
        }
      }}
      onKeyDown={(e) => {
        if (!interactive || lite) return;
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          poke();
        }
      }}
    >
      {fx ? <span className="blobi-shadow-ground" aria-hidden /> : null}
      {particles.map((p, i) => (
        <span
          key={`${mood}-${i}`}
          aria-hidden
          className={cn("blobi-particle", p.className)}
          style={{ animationDelay: p.delay } as CSSProperties}
        >
          {p.ch}
        </span>
      ))}
      <div className={cn("relative size-full blobi-gpu", anim, !live && !lite && "blobi-paused")}>
        <img
          src={SRC[mood]}
          alt=""
          width={size}
          height={size}
          loading="eager"
          decoding="sync"
          draggable={false}
          className={cn(
            "pixelated size-full object-contain object-bottom select-none",
            !lite && "mascot-shadow",
          )}
        />
        {bits.map((acc) => (
          <img
            key={acc.id}
            src={acc.src}
            alt=""
            decoding="async"
            draggable={false}
            className="pixelated pointer-events-none absolute select-none"
            style={{ left: acc.x, top: acc.y, width: acc.w, height: "auto" }}
          />
        ))}
      </div>
    </div>
  );
}

export function SpeechBubble({
  children,
  className,
  tail = "up",
  compact = false,
}: {
  children: ReactNode;
  className?: string;
  tail?: "up" | "left";
  compact?: boolean;
}) {
  return (
    <div className={cn("relative", className)}>
      {tail === "left" ? (
        <span
          aria-hidden
          className={cn(
            "absolute size-3.5 rotate-45 border-b-2 border-l-2 border-choco-900 bg-cream z-10",
            compact ? "top-4 -left-[7px]" : "top-5 -left-[7px]",
          )}
        />
      ) : (
        <span
          aria-hidden
          className="absolute -top-2 left-1/2 size-3.5 -translate-x-1/2 rotate-45 border-l-2 border-t-2 border-choco-900 bg-cream z-10"
        />
      )}
      <div
        className={cn(
          "rounded-[20px] border-2 border-choco-900 bg-cream text-left font-bold text-choco-900 shadow-[0_4px_0_#3B2218]",
          compact ? "px-3.5 py-2.5 text-xs sm:text-sm leading-snug" : "px-4 py-3 text-sm sm:text-base leading-snug",
        )}
      >
        {children}
      </div>
    </div>
  );
}

export function TypeLine({ text, onDone }: { text: string; onDone?: () => void }) {
  const [n, setN] = useState(0);
  const doneRef = useRef(onDone);
  doneRef.current = onDone;

  useEffect(() => {
    setN(0);
    if (!text) return;
    let i = 0;
    let raf = 0;
    let last = performance.now();
    const tick = (t: number) => {
      if (t - last >= 16) {
        last = t;
        i += 1;
        setN(i);
        if (i >= text.length) return;
      }
      raf = window.requestAnimationFrame(tick);
    };
    raf = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(raf);
  }, [text]);

  useEffect(() => {
    if (n >= text.length && text.length > 0) doneRef.current?.();
  }, [n, text]);

  return (
    <span>
      {text.slice(0, n)}
      {n < text.length ? <span className="type-caret">▍</span> : null}
    </span>
  );
}
