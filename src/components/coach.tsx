import { useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Link } from "@tanstack/react-router";
import { DuoButton } from "@/components/duo-button";
import { Mascot, SpeechBubble, type MascotMood } from "@/components/mascot";
import { firstIncompleteId } from "@/lib/curriculum";
import { useProgress } from "@/lib/store";

type Target = "start" | "hearts" | "node";

type Step = {
  target: Target;
  mood: MascotMood;
  say: string;
  done: string;
  pad: number;
  radius: number;
};

const STEPS: Step[] = [
  {
    target: "start",
    mood: "wave",
    say: "Mulai petualanganmu dari sini. Baca 3 menit dulu, baru kuis.",
    done: "Paham, Lanjut",
    pad: 6,
    radius: 22,
  },
  {
    target: "hearts",
    mood: "think",
    say: "Salah jawab, nyawa berkurang. Habis? Buka Kisah — tidak memakai nyawa.",
    done: "Lanjut",
    pad: 8,
    radius: 999,
  },
  {
    target: "node",
    mood: "proud",
    say: "Rute terbuka berurutan. Yang terkunci = selesaikan pelajaran sebelumnya.",
    done: "Oke, aku mulai",
    pad: 10,
    radius: 999,
  },
];

type Box = { top: number; left: number; width: number; height: number };

function readBox(id: Target, pad: number): Box | null {
  const el = document.querySelector<HTMLElement>(`[data-coach="${id}"]`);
  if (!el) return null;
  const r = el.getBoundingClientRect();
  if (r.width < 8 || r.height < 8) return null;
  return {
    top: r.top - pad,
    left: r.left - pad,
    width: r.width + pad * 2,
    height: r.height + pad * 2,
  };
}

function placePanel(spot: Box, panelH: number, vw: number, vh: number) {
  const pad = 16;
  const nav = 80;
  const gap = 20;
  const width = Math.min(360, vw - pad * 2);
  const left = Math.max(pad, (vw - width) / 2);
  const minTop = 72; // Below top HUD (56px + 16px buffer)
  const maxTop = Math.max(minTop, vh - panelH - nav);
  const belowTop = spot.top + spot.height + gap;
  const aboveTop = spot.top - panelH - gap;
  const canBelow = belowTop <= maxTop;
  const canAbove = aboveTop >= minTop;
  const spotMid = spot.top + spot.height / 2;
  let top: number;
  if (spotMid < vh * 0.45 && canBelow) top = belowTop;
  else if (canAbove) top = aboveTop;
  else if (canBelow) top = belowTop;
  else top = maxTop;
  top = Math.min(maxTop, Math.max(minTop, top));
  return { top, left, width };
}

export function CoachTour() {
  const coachSeen = useProgress((s) => s.coachSeen);
  const completed = useProgress((s) => s.completed);
  const completeGuide = useProgress((s) => s.completeGuide);
  const reduceMotion = useProgress((s) => s.reduceMotion);
  const lessonId = firstIncompleteId(completed);
  const [step, setStep] = useState(0);
  const [spot, setSpot] = useState<Box | null>(null);
  const [panelBox, setPanelBox] = useState({ top: 120, left: 16, width: 320 });
  const panelRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const current = STEPS[step] ?? STEPS[0];
  const last = step >= STEPS.length - 1;
  const active = !coachSeen && completed.length === 0;

  useEffect(() => {
    if (!active) return;
    const id = current.target;
    const pad = current.pad;
    let tries = 0;
    let timer = 0;
    const measure = () => {
      const el = document.querySelector<HTMLElement>(`[data-coach="${id}"]`);
      if (el) {
        const reduce =
          reduceMotion || window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        el.scrollIntoView({
          behavior: reduce ? "auto" : "smooth",
          block: id === "node" ? "start" : "center",
          inline: "nearest",
        });
      }
      const box = readBox(id, pad);
      if (box) {
        setSpot(box);
        return;
      }
      tries += 1;
      if (tries < 24) timer = window.setTimeout(measure, 50);
      else setSpot(null);
    };
    timer = window.setTimeout(measure, 30);
    const onMove = () => {
      const box = readBox(id, pad);
      if (box) setSpot(box);
    };
    window.addEventListener("resize", onMove);
    window.addEventListener("scroll", onMove, true);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("resize", onMove);
      window.removeEventListener("scroll", onMove, true);
    };
  }, [active, current.target, current.pad, reduceMotion, step]);

  useLayoutEffect(() => {
    if (!spot) return;
    const place = () => {
      const h = panelRef.current?.offsetHeight ?? 220;
      const next = placePanel(spot, h, window.innerWidth, window.innerHeight);
      setPanelBox((prev) =>
        prev.top === next.top && prev.left === next.left && prev.width === next.width ? prev : next,
      );
    };
    place();
    const t = window.setTimeout(place, 80);
    return () => window.clearTimeout(t);
  }, [spot, step, current.say]);

  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        completeGuide();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active, completeGuide]);

  function next() {
    if (last) {
      completeGuide();
      return;
    }
    setStep((n) => n + 1);
  }

  if (!active || typeof document === "undefined") return null;

  return createPortal(
    <div className="coach-root" role="dialog" aria-modal="true" aria-labelledby={titleId}>
      <div className="coach-catch" />
      {spot ? (
        <div
          className="coach-spot"
          style={{
            top: spot.top,
            left: spot.left,
            width: spot.width,
            height: spot.height,
            borderRadius: current.radius,
          }}
        />
      ) : null}
      {current.target === "start" && lessonId && spot ? (
        <Link
          to="/lesson/$lessonId"
          params={{ lessonId }}
          className="coach-hit"
          style={{
            top: spot.top,
            left: spot.left,
            width: spot.width,
            height: spot.height,
            borderRadius: current.radius,
          }}
          aria-label="Mulai pelajaran"
          onClick={() => completeGuide()}
        />
      ) : null}
      <div
        ref={panelRef}
        className="coach-panel"
        style={{ top: panelBox.top, left: panelBox.left, width: panelBox.width }}
      >
        <div className="flex items-start gap-2">
          <Mascot mood={current.mood} size={72} className="shrink-0" interactive={false} lite />
          <SpeechBubble className="min-w-0 flex-1" tail="left" compact>
            <p id={titleId}>{current.say}</p>
          </SpeechBubble>
        </div>
        <div className="mt-4 flex items-center gap-2.5">
          <button
            type="button"
            className="flex-1 py-3 px-5 rounded-full bg-candy hover:bg-candy-deep text-white font-display font-black text-xs border-2 border-ink-900 shadow-[inset_0_1px_0_rgba(255,255,255,0.4),0_2px_0_#A51D5B] active:scale-95 transition-all cursor-pointer"
            onClick={next}
          >
            {current.done}
          </button>
          <button
            type="button"
            className="min-h-11 shrink-0 px-4 py-2.5 text-xs font-black text-ink-500 hover:text-ink-900 rounded-full border-2 border-ink-900/15 hover:border-ink-900 bg-slate-50 transition-all cursor-pointer"
            onClick={() => completeGuide()}
          >
            Lewati
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
