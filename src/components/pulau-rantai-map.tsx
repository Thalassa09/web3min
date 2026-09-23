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
import { playTap, playClaim, playDeny, playMoodSfx } from "@/lib/audio";
import { PulauRantaiProgres } from "@/components/pulau-rantai-progres";
import { DailyQuests } from "@/components/daily-quests";
import { Mascot } from "@/components/mascot";
import { BlobiFloatingCompanion, BlobiLockedModal } from "@/components/blobi-guide";

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
  const sound = useProgress((s) => s.sound);

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

  // Mascot interaction state
  const [lockedWarn, setLockedWarn] = useState<{
    lesson: Lesson;
    unit: Unit;
    x: number;
    y: number;
  } | null>(null);

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

  // Active lesson and unit reference for Blobi guidance
  const activeInfo = useMemo(() => {
    for (const u of units) {
      for (const l of u.lessons) {
        if (!completed.includes(l.id)) {
          return { unit: u, lesson: l };
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

  const scrollToActive = () => {
    if (!containerRef.current) return;
    const nowEl = containerRef.current.querySelector(".bn.now") as HTMLElement | null;
    if (nowEl) {
      nowEl.scrollIntoView({ behavior: "smooth", block: "center" });
      triggerShake(nowEl.id || "");
    }
  };

  function handleNodeClick(
    lesson: Lesson,
    unit: Unit,
    status: "now" | "done" | "lock",
    x = 50,
    y = 0
  ) {
    playTap();
    const isChest = lesson.kind === "chest";
    const blockNo = blockNumberMap.get(lesson.id) || 1;

    if (isChest) {
      if (status === "now") {
        const ok = claimChest(lesson.id);
        if (ok) {
          playClaim();
          if (sound) playMoodSfx("celebrate");
          showToast(`Peti terbuka! +${lesson.gems || 50} bintang 🌟`);
        } else {
          showToast("Peti ini sudah pernah dibuka.");
        }
      } else if (status === "done") {
        showToast("Peti ini sudah pernah kamu buka.");
      } else {
        triggerShake(lesson.id);
        if (sound) {
          playDeny();
          playMoodSfx("think");
        }
        setLockedWarn({ lesson, unit, x, y });
      }
      return;
    }

    if (status === "now") {
      setSheetLesson({ lesson, unit, blockNo, status });
    } else if (status === "done") {
      setSheetLesson({ lesson, unit, blockNo, status });
    } else {
      triggerShake(lesson.id);
      if (sound) {
        playDeny();
        playMoodSfx("angry");
      }
      setLockedWarn({ lesson, unit, x, y });
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
    <div className="relative w-full bg-ink-900 overflow-hidden min-h-[calc(100vh-4rem)]">
      {/* Toast Notification */}
      <div
        className={`toast fixed left-1/2 -translate-x-1/2 bottom-24 z-50 bg-ink-900 text-white px-4 py-2.5 rounded-2xl text-xs font-bold transition-all duration-200 pointer-events-none border-2 border-white shadow-[3px_3px_0_#0D2340] max-w-[85%] text-center ${
          toastMsg ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
      >
        {toastMsg}
      </div>

      {/* Pulau Rantai Top Integrated Control Bar */}
      <header className="sticky top-0 z-20 w-full bg-white/92 backdrop-blur-xl border-b-2 border-ink-900 px-4 py-2.5 shadow-[0_2px_0_#0D2340]">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 sm:gap-3">
            <span className="text-xl sm:text-2xl">🏝️</span>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-display font-black text-sm sm:text-base text-ink-900 leading-tight">
                  Pulau Rantai
                </h2>
                <span className="hidden sm:inline-block px-2 py-0.5 rounded-full bg-candy-soft text-[10px] font-bold text-candy-deep border border-candy-line">
                  20 Rute
                </span>
              </div>
              <p className="text-[10px] font-bold text-candy-deep">
                Peta Petualangan On-Chain
              </p>
            </div>
            <button
              type="button"
              className="ml-2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-ink-900 border-2 border-ink-900 text-xs font-black transition-all active:scale-95 cursor-pointer shadow-xs"
              onClick={() => setShowProgresModal(true)}
              title="Lihat Rincian 20 Rute"
            >
              <PulauIcon name="book" size={14} />
              <span>Progres Rute</span>
            </button>
          </div>

          <div className="flex items-center gap-2 lg:hidden">
            <button
              type="button"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-candy-soft hover:bg-candy/20 text-candy-deep border border-candy-line text-xs font-bold transition-all active:scale-95 cursor-pointer shadow-xs"
              onClick={() => setShowQuestsModal(true)}
              title="Buka Misi Harian"
            >
              <PulauIcon name="star" size={14} fill />
              <span>Misi</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Adventure Scrolling Stage */}
      <div
        ref={containerRef}
        className="w-full overflow-y-auto overflow-x-hidden no-scrollbar pb-36"
        style={{ height: "calc(100vh - 4rem)" }}
      >
        {units.map((unit, wi) => {
          const theme = getPulauTheme(unit.id, wi + 1);
          const lessonCount = unit.lessons.length;
          const H = wi === 0 ? 760 : Math.max(580, lessonCount * 110);
          const T = 130;

          const pts = getWindingPoints(lessonCount, H, T);
          const roadPoints: RoadPoint[] = [[50, 0], ...pts, [50, H]];
          const roadPath = catmullRomRoad(roadPoints);

          return (
            <div
              key={unit.id}
              id={`unit-${unit.id}`}
              className="world relative overflow-hidden w-full"
              style={
                {
                  "--wbg": theme.bg,
                  height: `${H}px`,
                } as React.CSSProperties
              }
            >
              {/* World Cover Image — High Definition with Crisp Pixel Grid */}
              <img
                className="art"
                src={`/worlds/${unit.id}.jpg`}
                alt=""
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />

              {/* HD Atmospheric Lighting Overlay for rich depth & contrast */}
              <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-white/10 via-transparent to-ink-950/20 z-1" />
              <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_80px_rgba(13,35,64,0.18)] z-1" />

              {/* Playable Center Corridor */}
              <div className="relative w-full max-w-xl sm:max-w-2xl mx-auto h-full">
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
                    stroke="#FDF6E2"
                    strokeWidth="26"
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

                {/* Lesson Nodes & Mascot Interactions */}
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
                    <React.Fragment key={lesson.id}>
                      <button
                        type="button"
                        className={nodeClasses}
                        style={{ left: `${x}%`, top: `${y}px` }}
                        onClick={() => handleNodeClick(lesson, unit, status, x, y)}
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

                      {/* Blobi Mascot standing right on the active node */}
                      {isNow && !isChest && (
                        <div
                          className="absolute z-10 pointer-events-auto transition-all"
                          style={{
                            left: x < 50 ? `calc(${x}% + 42px)` : `calc(${x}% - 94px)`,
                            top: `${y - 38}px`,
                          }}
                        >
                          <div className="relative flex flex-col items-center">
                            {/* Playful callout bubble */}
                            <div className="mb-0.5 px-2 py-0.5 rounded-full bg-white border border-ink-900 shadow-[2px_2px_0_#0D2340] text-[10px] font-black text-candy-deep whitespace-nowrap animate-bounce flex items-center gap-1">
                              <span>Ayo gas!</span>
                              <span className="text-[8px]">🚀</span>
                            </div>

                            {/* Mascot Avatar with click reaction */}
                            <button
                              type="button"
                              className="cursor-pointer transition-transform hover:scale-110 active:scale-90"
                              onClick={(e) => {
                                e.stopPropagation();
                                if (sound) playMoodSfx("celebrate");
                                handleNodeClick(lesson, unit, status, x, y);
                              }}
                              title="Klik Blobi untuk mulai modul ini!"
                            >
                              <div className="size-14 sm:size-16 drop-shadow-[0_4px_0_rgba(13,35,64,0.3)]">
                                <Mascot mood="wave" size={58} />
                              </div>
                            </button>
                          </div>
                        </div>
                      )}
                    </React.Fragment>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Floating Interactive Blobi Companion (Mengganggu & Mengarahkan User) */}
      <BlobiFloatingCompanion
        activeLesson={activeInfo?.lesson}
        onStartActiveLesson={() => activeInfo && startLesson(activeInfo.lesson.id)}
        onScrollToActive={scrollToActive}
      />

      {/* Blobi Locked Node Warning Modal */}
      {lockedWarn && (
        <BlobiLockedModal
          warn={lockedWarn}
          onDismiss={() => setLockedWarn(null)}
          onScrollToActive={scrollToActive}
        />
      )}

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
