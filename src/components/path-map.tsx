import { useEffect, useRef, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Check, Lock } from "@/lib/kicon";
import type { Lesson, Unit } from "@/lib/curriculum";
import { firstIncompleteId, isUnlocked } from "@/lib/curriculum";
import { LESSON_ICONS } from "@/lib/icons";
import { TRAIL_DASH, kindOf, worldOf, type World, type WorldMark, type WorldWeather } from "@/lib/worlds";
import { needsCoach, useProgress } from "@/lib/store";
import { cn } from "@/lib/utils";
import { DuoButton } from "@/components/duo-button";
import { Dialog } from "@/components/dialog";
import { Mascot } from "@/components/mascot";
import { playBuy } from "@/lib/audio";

const OFFSETS = [0, -18, 7, 20, -4, -14, 12];

export function PathMap({ units, focusUnit }: { units: Unit[]; focusUnit?: string | null }) {
  const completed = useProgress((s) => s.completed);
  const currentId = firstIncompleteId(completed);
  const [chest, setChest] = useState<Lesson | null>(null);
  const [showAll, setShowAll] = useState(Boolean(focusUnit));
  const currentUnit = units.findIndex((u) => u.lessons.some((l) => l.id === currentId));

  useEffect(() => {
    if (focusUnit) setShowAll(true);
  }, [focusUnit]);

  return (
    <div className="flex flex-col overflow-x-clip pb-8">
      {!showAll && currentUnit > 0 ? (
        <button type="button" className="mx-4 mb-2 min-h-11 text-left text-sm font-medium text-primary" onClick={() => setShowAll(true)}>
          Lihat rute sebelumnya
        </button>
      ) : null}
      {units.map((unit, i) => {
        const next = units[i + 1];
        const near = currentUnit === -1 ? i === units.length - 1 : Math.abs(i - currentUnit) <= 1;
        const farAhead = !showAll && currentUnit !== -1 && i > currentUnit + 1;
        const farBehind = !showAll && currentUnit !== -1 && i < currentUnit;
        const lit = near || focusUnit === unit.id;
        if (farAhead) return null;
        if (farBehind) {
          return (
            <button
              key={unit.id}
              type="button"
              id={`unit-${unit.id}`}
              className="mx-4 my-1 flex min-h-11 scroll-mt-20 items-center gap-2 rounded-xl px-3 text-left text-sm text-muted"
              onClick={() => setShowAll(true)}
            >
              <Check className="size-4 text-primary" weight="bold" />
              Rute {unit.index} · {worldOf(unit.id).land}
            </button>
          );
        }
        return (
          <div key={unit.id}>
            <UnitBlock
              unit={unit}
              completed={completed}
              currentId={currentId}
              lit={lit}
              eager={i === currentUnit || focusUnit === unit.id}
              onChest={(lesson) => setChest(lesson)}
            />
            {next && (showAll || i <= currentUnit) ? (
              <WorldGate
                from={worldOf(unit.id)}
                to={worldOf(next.id)}
                open={isUnlocked(next.lessons[0]?.id ?? "", completed)}
                remaining={Math.max(
                  0,
                  unit.lessons.filter((l) => l.kind !== "chest" && !completed.includes(l.id)).length,
                )}
                nextTitle={next.title}
              />
            ) : null}
          </div>
        );
      })}
      {!showAll && currentUnit !== -1 && currentUnit < units.length - 2 ? (
        <button
          type="button"
          className="mx-4 mt-3 min-h-12 rounded-2xl bg-paper px-4 text-sm font-bold text-primary"
          onClick={() => setShowAll(true)}
        >
          Lihat seluruh rute
        </button>
      ) : null}
      {showAll && currentUnit >= 0 ? (
        <a href={`#unit-${units[currentUnit]?.id}`} className="mx-4 mt-3 min-h-11 text-sm font-bold text-primary">
          Kembali ke rute aktif
        </a>
      ) : null}
      <Dialog
        open={Boolean(chest)}
        title="Peti dibuka!"
        description={chest ? `Kamu menemukan ${chest.gems} bintang.` : undefined}
        onClose={() => setChest(null)}
      >
        <div className="flex flex-col items-center text-center">
          <Mascot mood="celebrate" size={120} interactive={false} />
          <DuoButton
            wide
            className="mt-4"
            onClick={() => {
              playBuy();
              setChest(null);
            }}
          >
            Ambil bintang
          </DuoButton>
        </div>
      </Dialog>
    </div>
  );
}

function UnitBlock({
  unit,
  completed,
  currentId,
  lit,
  eager,
  onChest,
}: {
  unit: Unit;
  completed: string[];
  currentId: string | null;
  lit: boolean;
  eager: boolean;
  onChest: (lesson: Lesson) => void;
}) {
  const world = worldOf(unit.id);
  const mirror = unit.index % 2 === 0;
  const completedCount = unit.lessons.filter((l) => completed.includes(l.id)).length;
  const isAllDone = completedCount === unit.lessons.length && unit.lessons.length > 0;

  return (
    <section
      className="relative mx-3 sm:mx-4 my-6 rounded-[16px] border-2 border-[#1B1440] shadow-[4px_4px_0_#1B1440] overflow-hidden scroll-mt-20 bg-white"
      id={`unit-${unit.id}`}
    >
      {/* Pixel Candy Unit Header */}
      <div className="bg-[#1B1440] text-white px-5 py-4 border-b-2 border-[#1B1440] flex items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className={cn("inline-block size-2 rounded-full", isAllDone ? "bg-[#1FCB8B]" : "bg-[#FF5C8A]")} />
            <span className="text-xs font-['Pixelify_Sans'] font-bold tracking-widest text-[#FFC23D] uppercase">
              UNIT {unit.index} // {kindOf(unit.id).toUpperCase()}
            </span>
          </div>
          <h2 className="mt-1 font-sans text-lg sm:text-xl font-extrabold tracking-tight text-white">
            {unit.title}
          </h2>
        </div>
        <div className="text-right shrink-0">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-[8px] bg-white border-[1.5px] border-[#1B1440] text-xs font-['Pixelify_Sans'] font-bold text-[#1B1440]">
            {completedCount}/{unit.lessons.length} Selesai
          </span>
        </div>
      </div>

      {/* Modern Learning Tree Track */}
      <div className="relative px-4 pb-10 pt-6 lg:px-8 lg:pb-12 bg-gradient-to-b from-slate-50/50 to-white">
        <ol className="relative mt-2 flex flex-col items-center gap-7 pt-1 lg:gap-10">
          <PathTrail
            count={unit.lessons.length}
            world={world}
            mirror={mirror}
            progress={completedCount / Math.max(1, unit.lessons.length)}
          />
          {unit.lessons.map((lesson, i) => (
            <PathNode
              key={lesson.id}
              index={i}
              lesson={lesson}
              shift={(OFFSETS[i % OFFSETS.length] ?? 0) * (mirror ? -1 : 1)}
              unlocked={isUnlocked(lesson.id, completed)}
              done={completed.includes(lesson.id)}
              current={currentId === lesson.id}
              onChest={onChest}
            />
          ))}
        </ol>
      </div>
    </section>
  );
}

function WorldGate({
  from,
  to,
  open,
  remaining,
  nextTitle,
}: {
  from: World;
  to: World;
  open: boolean;
  remaining: number;
  nextTitle: string;
}) {
  if (open) {
    return (
      <div className="world-gate relative z-10 mx-3 sm:mx-4 my-1 rounded-2xl border-2 border-line bg-white px-4 py-3 min-w-0">
        <p className="text-center text-[13px] font-extrabold text-ink-900">
          {from.land} → {to.land}
        </p>
        <p className="mt-0.5 text-center text-[12px] font-medium text-ink-500">{nextTitle} sudah terbuka</p>
      </div>
    );
  }

  return (
    <div className="world-gate relative z-10 mx-3 sm:mx-4 my-1 rounded-[22px] border-2 border-line bg-white px-4 py-4 min-w-0 shadow-[0_4px_0_#DCE7F5]">
      <div className="flex items-start gap-3">
        <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-sky-100 text-sky-600 border border-sky-300">
          <Lock className="size-5" weight="bold" />
        </span>
        <div className="min-w-0">
          <p className="text-[15px] font-extrabold text-ink-900 leading-tight">Rute berikutnya terkunci</p>
          <p className="mt-1 text-[13px] font-medium leading-5 text-ink-500">
            Selesaikan {remaining} pelajaran di {from.land} untuk membuka {to.land}: {nextTitle}.
          </p>
        </div>
      </div>
    </div>
  );
}

function PathTrail({
  count,
  world,
  mirror,
  progress = 0,
}: {
  count: number;
  world: World;
  mirror: boolean;
  progress?: number;
}) {
  const step = 148;
  const startY = 40;
  const vbW = 100;
  const mid = 50;
  const vbH = startY + Math.max(0, count - 1) * step + 40;
  const points = Array.from({ length: count }, (_, i) => {
    const s = (OFFSETS[i % OFFSETS.length] ?? 0) * (mirror ? -1 : 1);
    return [mid + s, startY + i * step] as const;
  });
  let d = "";
  points.forEach(([x, y], i) => {
    if (i === 0) d = `M ${x} ${y}`;
    else {
      const [x0, y0] = points[i - 1]!;
      const cy = (y0 + y) / 2;
      d += ` C ${x0} ${cy}, ${x} ${cy}, ${x} ${y}`;
    }
  });

  const pathRef = useRef<SVGPathElement>(null);
  const [len, setLen] = useState(0);

  useEffect(() => {
    setLen(pathRef.current?.getTotalLength() ?? 0);
  }, [d]);

  return (
    <svg
      aria-hidden
      viewBox={`0 0 ${vbW} ${vbH}`}
      className="pointer-events-none absolute inset-0 h-full w-full"
      preserveAspectRatio="none"
    >
      <path d={d} fill="none" stroke="var(--world-trail-ink)" strokeWidth="2.6" strokeLinecap="round" opacity="0.45" />
      <path
        d={d}
        fill="none"
        stroke="var(--world-trail)"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray={TRAIL_DASH[world.dash]}
      />
      {progress > 0 && len > 0 && (
        <path
          ref={pathRef}
          d={d}
          fill="none"
          stroke="var(--world-trail-done, #FFC61A)"
          strokeWidth="3.2"
          strokeLinecap="round"
          strokeDasharray={len}
          strokeDashoffset={len * (1 - progress)}
          style={{ transition: "stroke-dashoffset 900ms var(--ease-out-quint)" }}
        />
      )}
      {points.map(([x, y], i) => (
        <g key={i} transform={`translate(${x} ${y}) scale(0.28)`}>
          <TrailMark kind={world.mark} />
        </g>
      ))}
    </svg>
  );
}

function TrailMark({ kind }: { kind: WorldMark }) {
  const fill = "var(--world-mark)";
  const ink = "var(--world-trail-ink)";
  switch (kind) {
    case "stone":
      return <circle r="5" fill={fill} stroke={ink} strokeWidth="1.4" />;
    case "key":
      return <rect x={-4} y={-4} width="8" height="8" rx="1" fill={fill} transform="rotate(45)" />;
    case "coin":
      return <circle r="5" fill={fill} stroke={ink} strokeWidth="1.4" />;
    case "frame":
      return <rect x={-5} y={-5} width="10" height="10" rx="1" fill="none" stroke={fill} strokeWidth="2" />;
    case "ripple":
      return <circle r="6" fill="none" stroke={fill} strokeWidth="1.6" />;
    case "warn":
      return <polygon points="0,-6 6,5 -6,5" fill={fill} />;
    case "ember":
      return <polygon points="0,-6 4,0 0,6 -4,0" fill={fill} />;
    case "anchor":
      return <circle r="5" fill={fill} />;
    case "ticket":
      return <rect x={-6} y={-3} width="12" height="6" rx="1" fill={fill} />;
    case "page":
      return <rect x={-4} y={-5} width="8" height="10" rx="1" fill={fill} stroke={ink} />;
    case "brick":
      return <rect x={-6} y={-3} width="12" height="6" rx="1" fill={fill} />;
    case "bubble":
      return <circle r="5" fill="none" stroke={fill} strokeWidth="2" />;
    case "snow":
      return <circle r="4" fill={fill} stroke={ink} strokeWidth="1" />;
    case "cloud":
      return <ellipse rx="8" ry="4" fill={fill} opacity="0.95" />;
    case "gift":
      return <rect x={-5} y={-5} width="10" height="10" rx="2" fill={fill} />;
    case "crest":
      return <polygon points="0,-6 5,5 -5,5" fill={fill} />;
    case "neon":
      return <rect x={-4} y={-4} width="8" height="8" fill={fill} />;
    case "star":
      return <circle r="4" fill={fill} />;
    case "leaf":
      return <ellipse rx="6" ry="3" fill={fill} transform="rotate(-30)" />;
    default:
      return null;
  }
}

function WorldFx({ weather }: { weather: WorldWeather }) {
  const ref = useRef<HTMLDivElement>(null);
  const [on, setOn] = useState(false);
  const parked = weather === "firefly" || weather === "star" || weather === "neon";

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        const visible = Boolean(entry?.isIntersecting) && document.visibilityState === "visible";
        setOn(visible);
      },
      { rootMargin: "40px", threshold: 0.05 },
    );
    io.observe(el);
    const vis = () => {
      if (document.visibilityState !== "visible") setOn(false);
    };
    document.addEventListener("visibilitychange", vis);
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", vis);
    };
  }, []);

  return (
    <div ref={ref} className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {on
        ? Array.from({ length: 5 }, (_, i) => (
            <span
              key={i}
              className={cn("wx-bit", `wx-${weather}`)}
              style={{
                left: `${6 + ((i * 17) % 88)}%`,
                top: parked ? `${10 + ((i * 23) % 78)}%` : undefined,
                animationDelay: `${(i * 0.58) % 5}s`,
                animationDuration: parked ? `${1.7 + (i % 3) * 0.4}s` : `${5.4 + (i % 4)}s`,
              }}
            />
          ))
        : null}
    </div>
  );
}

function WorldProps({ world }: { world: World }) {
  return (
    <div className="pointer-events-none absolute inset-0 z-[1]" aria-hidden>
      {world.props.map((p, i) => (
        <img
          key={`${p.src}-${i}`}
          src={p.src}
          alt=""
          loading="lazy"
          decoding="async"
          className={cn("absolute pixelated object-contain drop-shadow-sm", p.side === "left" ? "left-1" : "right-1")}
          style={{
            top: p.top,
            width: p.size,
            height: p.size,
            transform: p.flip ? "scaleX(-1)" : undefined,
          }}
        />
      ))}
    </div>
  );
}

function PathNode({
  lesson,
  shift,
  unlocked,
  done,
  current,
  onChest,
  index = 0,
}: {
  lesson: Lesson;
  shift: number;
  unlocked: boolean;
  done: boolean;
  current: boolean;
  onChest: (lesson: Lesson) => void;
  index?: number;
}) {
  const navigate = useNavigate();
  const claimChest = useProgress((s) => s.claimChest);
  const coaching = useProgress((s) => needsCoach(s));
  const Icon = LESSON_ICONS[lesson.icon];
  const lockedLook = !unlocked && !done;

  function open() {
    if (!unlocked && !done) return;
    useProgress.getState().completeGuide();
    if (lesson.kind === "chest") {
      if (!done) {
        const ok = claimChest(lesson.id);
        if (ok) onChest(lesson);
      }
      return;
    }
    void navigate({ to: "/lesson/$lessonId", params: { lessonId: lesson.id } });
  }

  return (
    <li
      className="relative z-10 node-in"
      style={{
        left: `${shift}%`,
        animationDelay: `${index * 55}ms`,
      }}
    >
      {current ? (
        <span className="absolute -top-7 left-1/2 -translate-x-1/2 rounded-[6px] px-2.5 py-0.5 text-[11px] font-['Pixelify_Sans'] font-bold uppercase tracking-wider bg-[#FF5C8A] text-white border-[1.5px] border-[#1B1440] shadow-[2px_2px_0_#1B1440] whitespace-nowrap z-20">
          {lesson.kind === "checkpoint" ? "Checkpoint" : lesson.kind === "chest" ? "Item" : "Mulai"}
        </span>
      ) : null}
      {current && !coaching ? (
        <div className={cn("pointer-events-auto z-20 cursor-pointer absolute -top-2 lg:-top-4 size-14 lg:size-[76px]", shift > 8 ? "-left-16 lg:-left-20" : "-right-16 lg:-right-20")}>
          <Mascot mood="wave" fill interactive />
        </div>
      ) : null}
      <span className={cn("relative inline-flex", current && "node-pulse")}>
        <button
          type="button"
          onClick={open}
          disabled={lockedLook}
          aria-label={
            lockedLook
              ? `${lesson.title}. Selesaikan pelajaran sebelumnya untuk membuka rute ini.`
              : lesson.title
          }
          data-coach={current ? "node" : undefined}
          className={cn(
            "flex items-center justify-center rounded-[20px] sm:rounded-[22px] border-2 transition-all duration-100 cursor-pointer select-none",
            "active:not-disabled:translate-x-[2px] active:not-disabled:translate-y-[2px] active:not-disabled:shadow-[1px_1px_0_#1B1440]",
            current ? "size-[76px] lg:size-[84px] bg-[#FF5C8A] text-white border-[#1B1440] shadow-[4px_4px_0_#1B1440] ring-4 ring-[#FFE1EA]" :
            done && lesson.kind !== "chest" ? "size-[68px] lg:size-[76px] bg-[#1FCB8B] text-white border-[#1B1440] shadow-[3px_3px_0_#1B1440]" :
            lesson.kind === "chest" && !done ? "size-[68px] lg:size-[76px] bg-[#FFC23D] text-[#1B1440] border-[#1B1440] shadow-[3px_3px_0_#1B1440]" :
            lockedLook ? "size-[68px] lg:size-[76px] bg-[#E9E6F0] text-[#9C98B3] border-dashed border-[#1B1440] shadow-none cursor-not-allowed" :
            "size-[68px] lg:size-[76px] bg-white text-[#1B1440] border-[#1B1440] shadow-[3px_3px_0_#1B1440] hover:bg-[#FFF7EC]"
          )}
        >
          {done && lesson.kind !== "chest" ? (
            <Check className="size-7 sm:size-8" weight="bold" />
          ) : (
            <Icon className="size-7 sm:size-8" weight="bold" />
          )}
        </button>
        {lockedLook ? (
          <span className="absolute -bottom-1 -right-1 flex size-5 items-center justify-center rounded-[6px] bg-[#E9E6F0] text-[#5A5480] border-[1.5px] border-[#1B1440] shadow-xs">
            <Lock className="size-3" weight="bold" />
          </span>
        ) : null}
      </span>
      <p className="mt-2 max-w-32 rounded-[8px] px-1.5 py-0.5 text-center text-xs font-semibold leading-tight text-[#1B1440]">
        {lockedLook ? (
          <span className="text-[#9C98B3] font-normal">{lesson.title}</span>
        ) : (
          <span className={cn(current ? "text-[#1B1440] font-extrabold" : "text-[#5A5480] font-bold")}>{lesson.title}</span>
        )}
      </p>
    </li>
  );
}
