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

  return (
    <section
      className={cn(
        "relative mx-3 sm:mx-4 my-4 rounded-[26px] border-2 border-[#B9CFE9] shadow-[0_6px_0_#0B4FD1] overflow-hidden scroll-mt-20 [content-visibility:auto] [contain-intrinsic-size:720px]",
        world.skin
      )}
      id={`unit-${unit.id}`}
    >
      {lit ? (
        <img
          src={world.art}
          alt=""
          width={720}
          height={900}
          loading={eager ? "eager" : "lazy"}
          decoding="async"
          fetchPriority={eager ? "high" : "low"}
          sizes="(min-width: 1024px) 720px, 100vw"
          className="world-art pointer-events-none absolute inset-0 h-full w-full object-cover object-top pixelated"
        />
      ) : (
        <div className="world-art pointer-events-none absolute inset-0" style={{ background: "var(--world-banner, var(--color-paper))" }} />
      )}
      <div className="world-veil pointer-events-none absolute inset-0" />
      {lit ? <WorldFx weather={world.weather} /> : null}
      {lit ? <WorldProps world={world} /> : null}
      <div className="relative px-4 pb-7 pt-3 lg:px-8 lg:pb-10 lg:pt-5">
        <div className="world-flag route-sign mx-auto max-w-sm rounded-2xl border-b-4 px-4 py-3 lg:max-w-md">
          <p className="flex items-center gap-2 text-[13px] font-semibold leading-[18px] tracking-label opacity-90">
            <img src={world.stamp} alt="" className="size-5 pixelated object-contain" />
            Rute {unit.index} · {world.land}
            <span className="route-kind ml-auto">{kindOf(unit.id)}</span>
          </p>
          <h2 className="mt-1 text-xl font-bold leading-[26px]">{unit.title}</h2>
        </div>
        <ol className="relative mt-6 flex flex-col items-center gap-10 pt-1 lg:mt-8 lg:gap-12">
          <PathTrail
            count={unit.lessons.length}
            world={world}
            mirror={mirror}
            progress={unit.lessons.filter((l) => completed.includes(l.id)).length / Math.max(1, unit.lessons.length)}
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
}: {
  from: World;
  to: World;
  open: boolean;
}) {
  return (
    <div className="world-gate relative z-10 px-8 py-2">
      <div className="mx-auto flex max-w-sm items-center gap-2 px-2">
        <span className={cn("h-px flex-1 rounded-full", from.skin)} style={{ background: "var(--world-trail)" }} />
        <p className="shrink-0 text-[13px] font-medium leading-[18px] text-muted">
          {open ? `${from.land} → ${to.land}` : `Selesaikan pelajaran sebelumnya untuk membuka rute ini.`}
        </p>
        {open ? null : <Lock className="size-3 shrink-0 text-muted" weight="bold" />}
        <span className={cn("h-px flex-1 rounded-full", to.skin)} style={{ background: "var(--world-trail)" }} />
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
        <span className="world-start absolute -top-8 left-1/2 -translate-x-1/2 rounded-lg px-2 py-0.5 text-xs font-extrabold uppercase tracking-label path-bounce">
          {lesson.kind === "checkpoint" ? "Laga" : lesson.kind === "chest" ? "Item" : "Mulai"}
        </span>
      ) : null}
      {current && !coaching ? (
        <div className={cn("pointer-events-auto z-20 cursor-pointer absolute -top-2 lg:-top-4 size-16 lg:size-[88px]", shift > 8 ? "-left-16 lg:-left-24" : "-right-16 lg:-right-24")}>
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
            "flex items-center justify-center rounded-full border-b-[6px] transition-transform duration-[180ms]",
            "active:not-disabled:translate-y-1 active:not-disabled:border-b-2",
            current ? "size-[78px] lg:size-[88px]" : "size-[70px] lg:size-[80px]",
            lockedLook && "world-node-locked",
            !lockedLook && lesson.kind === "chest" && "world-node-chest",
            !lockedLook && lesson.kind !== "chest" && done && "world-node-done",
            !lockedLook && lesson.kind !== "chest" && !done && "world-node-btn",
            current && "world-node-now",
          )}
        >
          {done && lesson.kind !== "chest" ? (
            <Check className="size-8" weight="bold" />
          ) : (
            <Icon className="size-8" weight="bold" />
          )}
        </button>
        {lockedLook ? (
          <span className="world-lock-badge">
            <Lock className="size-3" weight="bold" />
          </span>
        ) : null}
      </span>
      <p className="world-caption mt-2 max-w-28 rounded-lg px-1.5 py-0.5 text-center text-[13px] font-semibold leading-[18px]">
        {lockedLook ? (
          <>
            Terkunci
            <span className="mt-0.5 block font-medium text-muted">{lesson.title}</span>
          </>
        ) : (
          lesson.title
        )}
      </p>
    </li>
  );
}
