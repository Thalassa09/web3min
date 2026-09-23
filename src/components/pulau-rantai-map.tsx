import React, { useState, useMemo, useEffect, useRef } from "react";
import { useNavigate } from "@tanstack/react-router";
import type { Unit, Lesson } from "@/lib/curriculum";
import { useProgress } from "@/lib/store";
import { PulauIcon } from "@/lib/pulau-icons";
import {
  catmullRomRoad,
  getWindingPoints,
  getPulauTheme,
  type RoadPoint,
} from "@/lib/pulau-rantai";
import { playTap, playClaim } from "@/lib/audio";
import { PulauRantaiProgres } from "@/components/pulau-rantai-progres";
import { DailyQuests } from "@/components/daily-quests";

export function PulauRantaiMap({
  units,
  focusUnit,
}: {
  units: Unit[];
  focusUnit?: string | null;
}) {
  const navigate = useNavigate();
  const completed = useProgress((s) => s.completed);
  const claimChest = useProgress((s) => s.claimChest);

  const [shakingId, setShakingId] = useState<string | null>(null);
  const [sheetLesson, setSheetLesson] = useState<{
    lesson: Lesson;
    unit: Unit;
    blockNo: number;
    status: "now" | "done" | "lock";
  } | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [showProgresModal, setShowProgresModal] = useState(false);
  const [showQuestsModal, setShowQuestsModal] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 2500);
  };

  // Find next active lesson sequentially across all units
  const nextLessonId = useMemo(() => {
    for (const u of units) {
      for (const l of u.lessons) {
        if (!completed.includes(l.id)) {
          return l.id;
        }
      }
    }
    return null;
  }, [units, completed]);

  // Order map for block numbers
  const blockNumberMap = useMemo(() => {
    const map = new Map<string, number>();
    let count = 0;
    for (const u of units) {
      for (const l of u.lessons) {
        if (l.kind !== "chest") {
          count++;
          map.set(l.id, count);
        }
      }
    }
    return map;
  }, [units]);

  // Auto scroll to active node or focused unit on mount
  useEffect(() => {
    if (!containerRef.current) return;
    if (focusUnit) {
      const el = containerRef.current.querySelector(`#unit-${focusUnit}`) as HTMLElement | null;
      if (el) {
        containerRef.current.scrollTop = Math.max(0, el.offsetTop - 80);
        return;
      }
    }
    const nowEl = containerRef.current.querySelector(".bn.now") as HTMLElement | null;
    if (nowEl) {
      containerRef.current.scrollTop = Math.max(0, nowEl.offsetTop - 200);
    }
  }, [focusUnit]);

  function handleNodeClick(lesson: Lesson, unit: Unit, status: "now" | "done" | "lock") {
    playTap();
    const isChest = lesson.kind === "chest";
    const blockNo = blockNumberMap.get(lesson.id) || 1;

    if (isChest) {
      if (status === "now") {
        const ok = claimChest(lesson.id);
        if (ok) {
          playClaim();
          showToast(`Peti terbuka! +${lesson.gems || 50} bintang 🌟`);
        } else {
          showToast("Peti ini sudah pernah dibuka.");
        }
      } else if (status === "done") {
        showToast("Peti ini sudah pernah kamu buka.");
      } else {
        triggerShake(lesson.id);
        showToast("Selesaikan blok sebelumnya untuk membuka peti ini.");
      }
      return;
    }

    if (status === "now") {
      setSheetLesson({ lesson, unit, blockNo, status });
    } else if (status === "done") {
      setSheetLesson({ lesson, unit, blockNo, status });
    } else {
      triggerShake(lesson.id);
      showToast("Blok ini belum bisa ditambang. Selesaikan blok sebelumnya.");
    }
  }

  function triggerShake(id: string) {
    setShakingId(id);
    setTimeout(() => setShakingId(null), 320);
  }

  function startLesson(lessonId: string) {
    setSheetLesson(null);
    void navigate({
      to: "/lesson/$lessonId",
      params: { lessonId },
    });
  }

  return (
    <div className="relative w-full max-w-lg mx-auto bg-ink-900 border-2 border-ink-900 rounded-[28px] overflow-hidden shadow-[6px_6px_0_#0D2340]">
      {/* Toast Notification */}
      <div
        className={`toast fixed left-1/2 -translate-x-1/2 bottom-24 z-50 bg-ink-900 text-white px-4 py-2.5 rounded-2xl text-xs font-bold transition-all duration-200 pointer-events-none border-2 border-white shadow-[3px_3px_0_#0D2340] max-w-[85%] text-center ${
          toastMsg ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
      >
        {toastMsg}
      </div>

      {/* Map Scroll View */}
      <div
        ref={containerRef}
        className="mapscroll h-[700px] sm:h-[760px] overflow-y-auto no-scrollbar relative pb-36"
      >
        {units.map((unit, wi) => {
          const theme = getPulauTheme(unit.id, unit.index);
          const lessonCount = unit.lessons.length;
          const H = wi === 0 ? 760 : Math.max(580, lessonCount * 110);
          const T = wi === 0 ? 250 : 130;

          const pts = getWindingPoints(lessonCount, H, T);
          const roadPoints: RoadPoint[] = [[50, 0], ...pts, [50, H]];
          const roadPath = catmullRomRoad(roadPoints);

          return (
            <div
              key={unit.id}
              id={`unit-${unit.id}`}
              className="world relative overflow-hidden"
              style={
                {
                  "--wbg": theme.bg,
                  height: `${H}px`,
                } as React.CSSProperties
              }
            >
              {/* World Cover Image */}
              <img
                className="art"
                src={`/worlds/${unit.id}.jpg`}
                alt=""
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />

              {/* Road SVG */}
              <svg
                className="road"
                viewBox={`0 0 100 ${H}`}
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                <path
                  d={roadPath}
                  fill="none"
                  stroke="#1B1440"
                  strokeWidth="34"
                  strokeLinecap="round"
                  vectorEffect="non-scaling-stroke"
                />
                <path
                  d={roadPath}
                  fill="none"
                  stroke="#FFF4E6"
                  strokeWidth="29"
                  strokeLinecap="round"
                  vectorEffect="non-scaling-stroke"
                />
                <path
                  d={roadPath}
                  fill="none"
                  stroke="#F26A99"
                  strokeWidth="5"
                  strokeLinecap="round"
                  strokeDasharray={theme.dash}
                  vectorEffect="non-scaling-stroke"
                />
              </svg>

              {/* Decorative World Props */}
              {theme.props.map((p, pi) => (
                <img
                  key={pi}
                  className="prop"
                  src={`/props/${p.name}.png`}
                  alt=""
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                  style={{
                    [p.side]: "8px",
                    top: `${T + (p.top * (H - T)) / 100 - p.size / 2}px`,
                    width: `${p.size * 1.25}px`,
                    transform: p.flip ? "scaleX(-1)" : undefined,
                  }}
                />
              ))}

              {/* World Sign Board */}
              <div
                className="wsign"
                style={{ top: "24px" }}
              >
                <p className="label font-extrabold text-[11px] text-[#D62A78] uppercase tracking-wider">
                  Rute {unit.index} · {theme.kind}
                </p>
                <h3 className="text-lg font-black font-display text-ink-900 mt-0.5">
                  {unit.title}
                </h3>
                <p className="text-xs text-ink-500 font-medium leading-relaxed mt-1">
                  {theme.look}
                </p>
              </div>

              {/* Lesson Nodes */}
              {unit.lessons.map((lesson, i) => {
                const [x, y] = pts[i] || [50, T + i * 90];
                const isChest = lesson.kind === "chest";
                const isDone = completed.includes(lesson.id);
                const isNow = nextLessonId === lesson.id;
                const status: "now" | "done" | "lock" = isDone
                  ? "done"
                  : isNow
                  ? "now"
                  : "lock";

                const blockNo = blockNumberMap.get(lesson.id) || i + 1;
                const nodeClasses = [
                  "bn",
                  isChest
                    ? status === "lock"
                      ? "chest"
                      : status === "now"
                      ? "ready"
                      : "opened"
                    : status,
                  shakingId === lesson.id ? "shake" : "",
                ]
                  .filter(Boolean)
                  .join(" ");

                const iconName = isChest
                  ? "chest"
                  : status === "done"
                  ? "check"
                  : status === "now"
                  ? "star"
                  : "lock";

                return (
                  <button
                    key={lesson.id}
                    type="button"
                    className={nodeClasses}
                    style={{ left: `${x}%`, top: `${y}px` }}
                    onClick={() => handleNodeClick(lesson, unit, status)}
                    aria-label={`Blok ${blockNo}: ${lesson.title}`}
                  >
                    <PulauIcon
                      name={iconName}
                      size={26}
                      fill={status === "now" && !isChest}
                    />
                    {status === "now" && !isChest && (
                      <span className="bubble">MULAI</span>
                    )}
                  </button>
                );
              })}
            </div>
          );
        })}
      </div>

      {/* Bottom Sheet Modal for Block Details */}
      <div className={`sheet ${sheetLesson ? "on" : ""}`}>
        {sheetLesson && (
          <div>
            <button
              type="button"
              className="xclose"
              onClick={() => setSheetLesson(null)}
              aria-label="Tutup"
            >
              <PulauIcon name="x" size={20} />
            </button>

            <p className="label font-extrabold text-[11px] text-[#D62A78] uppercase tracking-wider">
              Blok #{sheetLesson.blockNo} · Rute {sheetLesson.unit.index}{" "}
              {sheetLesson.unit.title}
            </p>
            <h3 className="text-xl font-black font-display text-ink-900 mt-1">
              {sheetLesson.lesson.title}
            </h3>
            <p className="text-xs text-ink-500 font-medium mt-1">
              {sheetLesson.lesson.exercises?.length || 3} soal kuis · +30 XP ·
              jawaban salah = −1 nyawa
            </p>

            <div className="flex gap-2 mt-4">
              <button
                type="button"
                className="btn btn-candy flex-1 py-3 rounded-2xl border-2 border-ink-900 font-bold text-sm text-white flex items-center justify-center gap-2 cursor-pointer transition-transform active:translate-y-1 shadow-[0_4px_0_#A51D5B]"
                onClick={() => startLesson(sheetLesson.lesson.id)}
              >
                <PulauIcon name="star" size={18} fill />
                <span>
                  {sheetLesson.status === "done"
                    ? "Latihan Lagi (+15 XP)"
                    : "Tambang blok ini (+30 XP)"}
                </span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Progres Analytics Modal */}
      {showProgresModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3">
          <div className="bg-canvas border-2 border-ink-900 rounded-[32px] w-full max-w-md max-h-[90vh] overflow-y-auto shadow-[6px_6px_0_#0D2340] relative">
            <PulauRantaiProgres onClose={() => setShowProgresModal(false)} />
          </div>
        </div>
      )}

      {/* Quests Modal Dialog */}
      {showQuestsModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border-2 border-ink-900 rounded-[28px] w-full max-w-md p-5 shadow-[6px_6px_0_#0D2340] relative">
            <button
              type="button"
              className="absolute top-4 right-4 p-2 text-ink-500 hover:text-ink-900 font-bold cursor-pointer"
              onClick={() => setShowQuestsModal(false)}
            >
              <PulauIcon name="x" size={20} />
            </button>
            <DailyQuests />
          </div>
        </div>
      )}
    </div>
  );
}
