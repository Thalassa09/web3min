import React, { useState, useMemo, useEffect, useRef } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Compass, Sparkles } from "lucide-react";
import { type Unit, type Lesson, isUnlocked } from "@/lib/curriculum";
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
import { ChainBlock } from "@/components/ui/chain-block";
import { Button } from "@/components/ui/button";

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
  const containerRef = useRef<HTMLDivElement>(null);
  const shakeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

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
      if (completed.includes(lesson.id)) {
        showToast("Peti ini sudah pernah kamu buka.");
      } else if (isUnlocked(lesson.id, completed)) {
        const ok = claimChest(lesson.id);
        if (ok) {
          playClaim();
          if (sound) playMoodSfx("celebrate");
          showToast(`Peti terbuka! +${lesson.gems || 50} koin`);
        } else {
          showToast("Peti ini sudah pernah dibuka.");
        }
      } else {
        triggerShake(lesson.id);
        if (sound) {
          playDeny();
          playMoodSfx("think");
        }
        showToast("Peti ini masih terkunci! Selesaikan blok sebelumnya dulu.");
      }
      return;
    }

    if (status === "now") {
      startLesson(lesson.id);
      return;
    } else if (status === "done") {
      setSheetLesson({ lesson, unit, blockNo, status });
    } else {
      triggerShake(lesson.id);
      if (sound) {
        playDeny();
        playMoodSfx("angry");
      }
      showToast("Modul masih terkunci! Selesaikan blok aktif terlebih dahulu.");
    }
  }

  function triggerShake(id: string) {
    setShakingId(id);
    // Auto-clear if the previous timer never fired (rapid taps on locked nodes
    // used to leave the node permanently shaking).
    if (shakeTimer.current) clearTimeout(shakeTimer.current);
    shakeTimer.current = setTimeout(() => {
      shakeTimer.current = null;
      setShakingId(null);
    }, 320);
  }

  function startLesson(lessonId: string) {
    setSheetLesson(null);
    void navigate({
      to: "/lesson/$lessonId",
      params: { lessonId },
    });
  }

  return (
    <div className="relative w-full bg-cream-50 overflow-hidden min-h-[calc(100vh-4rem)]">
      {/* Toast Notification */}
      <div
        className={`toast fixed left-1/2 -translate-x-1/2 bottom-24 z-50 bg-choco-900 text-cream px-4 py-2.5 rounded-2xl text-xs font-bold transition-all duration-200 pointer-events-none border-2 border-choco-900 shadow-[0_4px_0_#3B2218] max-w-[85%] text-center ${
          toastMsg ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
      >
        {toastMsg}
      </div>

      {/* Desktop only. On mobile this fixed pill covers the route board. */}
      <div className="hidden lg:block fixed top-20 right-6 z-25 pointer-events-none">
        <button
          type="button"
          className="pointer-events-auto inline-flex items-center gap-2 px-3.5 py-1.5 sm:py-2 rounded-full bg-cream/95 hover:bg-white backdrop-blur-md text-choco-900 border-2 border-choco-900 text-xs font-pixel font-bold transition-all active:scale-95 cursor-pointer shadow-[0_3px_0_#3B2218] hover:shadow-[0_4px_0_#3B2218]"
          onClick={() => setShowProgresModal(true)}
          title="Buka Progres 20 Rute"
        >
          <PulauIcon name="book" size={14} />
          <span>Progres Rute</span>
          <span className="px-1.5 py-0.5 rounded-full bg-candy-100 text-[10px] text-candy-700 border border-choco-900 font-pixel font-bold">
            20
          </span>
        </button>
      </div>

      {/* Floating Target/Resume FAB to jump to current active lesson and Daily Quests */}
      <div className="fixed bottom-22 right-4 sm:right-6 z-25 pointer-events-none flex flex-col items-end gap-2">
        <button
          type="button"
          onClick={() => {
            if (sound) playTap();
            setShowQuestsModal(true);
          }}
          className="pointer-events-auto inline-flex items-center gap-1.5 px-3 py-2 sm:px-3.5 sm:py-2.5 rounded-full bg-lemon hover:bg-lemon/90 text-choco-900 border-2 border-choco-900 text-xs font-pixel font-bold transition-all shadow-[0_3px_0_#3B2218] active:translate-y-0.5 active:shadow-none cursor-pointer"
          title="Buka Misi Harian"
        >
          <Sparkles className="size-4 shrink-0 text-amber-600 stroke-[2.5]" />
          <span>Misi Harian</span>
        </button>

        <button
          type="button"
          onClick={scrollToActive}
          className="pointer-events-auto inline-flex items-center gap-1.5 px-3 py-2 sm:px-3.5 sm:py-2.5 rounded-full bg-candy-800 hover:bg-candy-950 text-white border-2 border-choco-900 text-xs font-pixel font-bold transition-all shadow-[0_3px_0_#3B2218] active:translate-y-0.5 active:shadow-none cursor-pointer"
          title="Lompat ke blok yang sedang aktif"
        >
          <Compass className="size-4 shrink-0 stroke-[2.5]" />
          <span className="hidden sm:inline">Ke Blok Aktif</span>
        </button>
      </div>

      {/* Main Adventure Scrolling Stage */}
      <div
        ref={containerRef}
        className="w-full overflow-y-auto overflow-x-hidden no-scrollbar pb-36"
        style={{ height: "calc(100vh - 4rem)" }}
      >
        {units.map((unit, wi) => {
          const theme = getPulauTheme(unit.id, wi + 1);
          const lessonCount = unit.lessons.length;
          const H = wi === 0 ? 820 : Math.max(640, lessonCount * 115 + 80);
          const T = 160;

          const pts = getWindingPoints(lessonCount, H, T);
          const roadPoints: RoadPoint[] =
            wi === 0
              ? [[50, T - 30], ...pts, [50, H]]
              : [[50, 0], ...pts, [50, H]];
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
              <picture className="art block w-full h-full pointer-events-none">
                <source srcSet={`/worlds/${unit.id}.webp?v=hd3`} type="image/webp" />
                <img
                  className="art w-full h-full object-cover pointer-events-none"
                  src={`/worlds/${unit.id}.jpg?v=hd3`}
                  alt=""
                  decoding="async"
                  loading={unit.id === "u1" ? "eager" : "lazy"}
                  fetchPriority={unit.id === "u1" ? "high" : "auto"}
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              </picture>

              {/* HD Atmospheric Lighting Overlay for rich depth & contrast */}
              <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-white/10 via-transparent to-ink-950/20 z-1" />
              <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_80px_rgba(13,35,64,0.18)] z-1" />

              {/* Playable Center Corridor */}
              <div className="relative w-full max-w-xl sm:max-w-2xl mx-auto h-full">
                {/* Road SVG — Mata Rantai Interlocking Chain System */}
                <svg
                  className="road"
                  viewBox={`0 0 100 ${H}`}
                  preserveAspectRatio="none"
                  aria-hidden="true"
                >
                  {/* Road Plum Outer Base */}
                  <path
                    d={roadPath}
                    fill="none"
                    stroke="#2B1622"
                    strokeWidth="32"
                    strokeLinecap="round"
                    vectorEffect="non-scaling-stroke"
                  />
                  {/* Road Canvas Inner Bed */}
                  <path
                    d={roadPath}
                    fill="none"
                    stroke="#FFF9FB"
                    strokeWidth="24"
                    strokeLinecap="round"
                    vectorEffect="non-scaling-stroke"
                  />
                  {/* Mata Rantai Interlocking Outer Links */}
                  <path
                    d={roadPath}
                    fill="none"
                    stroke="#2B1622"
                    strokeWidth="7"
                    strokeLinecap="round"
                    strokeDasharray="14 10"
                    vectorEffect="non-scaling-stroke"
                  />
                  {/* Mata Rantai Hollow Center */}
                  <path
                    d={roadPath}
                    fill="none"
                    stroke="#FFF9FB"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeDasharray="14 10"
                    vectorEffect="non-scaling-stroke"
                  />
                  {/* Mata Rantai Connecting Interlinks */}
                  <path
                    d={roadPath}
                    fill="none"
                    stroke="#E8437F"
                    strokeWidth="5"
                    strokeLinecap="round"
                    strokeDasharray="6 18"
                    strokeDashoffset="10"
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
                    decoding="async"
                    loading="lazy"
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

                {/* World Sign Board - Tactile Beveled Style */}
                <div
                  className="absolute left-3 right-3 sm:left-4 sm:right-4 max-w-lg mx-auto top-2.5 z-10 bg-gradient-to-b from-white/95 via-[#FFF9F5]/95 to-[#FDEEE4]/95 backdrop-blur-md border-2 border-choco-900/18 rounded-3xl px-3.5 py-2.5 sm:p-3.5 shadow-[0_4px_0_#3B2218,0_10px_20px_-4px_rgba(59,34,24,0.14)] transition-all pointer-events-auto"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="shrink-0 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-candy-800 text-white font-pixel font-bold text-[10px] tracking-wide border border-choco-900 shadow-[0_1.5px_0_#3B2218]">
                        <span>RUTE {unit.index}</span>
                        <span>·</span>
                        <span>{theme.kind.toUpperCase()}</span>
                      </span>
                      <h3 className="text-xs sm:text-base font-bold font-pixel text-choco-900 tracking-tight truncate">
                        {unit.title}
                      </h3>
                    </div>
                    <span className="shrink-0 text-[10px] font-pixel font-bold text-choco-600 bg-cream-100 px-2 py-0.5 rounded-full border border-choco-900/30">
                      {unit.lessons.filter((l) => l.kind !== "chest").length} Blok
                    </span>
                    {wi === 0 ? (
                      <button
                        type="button"
                        className="lg:hidden shrink-0 inline-flex items-center gap-1 h-7 px-2 rounded-full bg-white border-2 border-choco-900 text-[10px] font-pixel font-bold text-choco-900 shadow-[0_2px_0_#3B2218] active:translate-y-0.5"
                        onClick={() => setShowProgresModal(true)}
                        aria-label="Buka progres 20 rute"
                      >
                        <PulauIcon name="book" size={12} />
                        <span>20</span>
                      </button>
                    ) : null}
                  </div>
                  {/* Subtitle / Description - Subtle and hidden on mobile to avoid screen crowding */}
                  <p className="hidden sm:block text-xs text-choco-700 font-semibold leading-relaxed mt-1 line-clamp-1">
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
                  const chainStatus: "done" | "active" | "locked" | "chest" = isChest
                    ? "chest"
                    : status === "done"
                    ? "done"
                    : status === "now"
                    ? "active"
                    : "locked";

                  const confirmations = status === "done" ? 3 : status === "now" ? 1 : 0;

                  return (
                    <React.Fragment key={lesson.id}>
                      <div
                        className="absolute -translate-x-1/2 -translate-y-1/2 z-2"
                        style={{ left: `${x}%`, top: `${y}px` }}
                      >
                        <ChainBlock
                          blockNo={blockNo}
                          status={chainStatus}
                          title={lesson.title}
                          confirmations={confirmations}
                          isShaking={shakingId === lesson.id}
                          onClick={() => handleNodeClick(lesson, unit, status, x, y)}
                        />
                      </div>

                      {/* Blobi Mascot standing right on the active node */}
                      {isNow && !isChest && (
                        <div
                          className="absolute z-10 pointer-events-auto transition-all"
                          style={{
                            left: x <= 50 ? `calc(${x}% + 46px)` : `calc(${x}% - 96px)`,
                            top: `${y - 42}px`,
                          }}
                        >
                          <button
                            type="button"
                            className="relative flex flex-col items-center cursor-pointer transition-transform hover:scale-105 active:scale-95"
                            onClick={(e) => {
                              e.stopPropagation();
                              e.preventDefault();
                              startLesson(lesson.id);
                            }}
                            title="Mulai kuis blok ini"
                            aria-label={`Mulai kuis: ${lesson.title}`}
                          >
                            <div className="mb-0.5 px-2.5 py-0.5 rounded-full bg-candy-800 border-2 border-choco-900 shadow-[0_2px_0_#3B2218] text-[10px] font-pixel font-bold text-white whitespace-nowrap animate-bounce">
                              Ayo tambang!
                            </div>
                            <div className="size-14 sm:size-16 drop-shadow-[0_6px_0_rgba(59,34,24,0.35)] pointer-events-none">
                              <Mascot mood="wave" size={58} interactive={false} />
                            </div>
                          </button>
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

      {/* Modal / Sheet for Block Details */}
      {sheetLesson && (
        <div
          className="fixed inset-0 z-50 bg-choco-900/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-3 sm:p-4 animate-in fade-in duration-150"
          onClick={() => setSheetLesson(null)}
        >
          <div
            className="w-full max-w-md bg-cream border-3 border-choco-900 rounded-[28px] shadow-[0_8px_0_#3B2218] p-5 sm:p-6 relative text-choco-900 animate-in slide-in-from-bottom-4 sm:zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="absolute top-4 right-4 flex size-9 sm:size-10 items-center justify-center rounded-full border-2 border-choco-900 bg-white text-choco-900 shadow-[0_1px_0_#3B2218] hover:bg-candy-100 active:translate-y-0.5 cursor-pointer transition-all"
              onClick={() => setSheetLesson(null)}
              aria-label="Tutup"
            >
              <PulauIcon name="x" size={18} />
            </button>

            <span className="inline-block px-2.5 py-0.5 rounded-full bg-candy-100 border border-choco-900 font-pixel text-[10px] font-bold uppercase tracking-wider text-candy-700">
              Blok #0x{sheetLesson.blockNo.toString(16).toUpperCase().padStart(2, "0")} · Rute {sheetLesson.unit.index}
            </span>

            {/* Mascot Header for Block Lesson Details */}
            <div className="flex items-center gap-3.5 mt-2 mb-3">
              <div className="size-15 sm:size-16 shrink-0 drop-shadow-[0_4px_0_rgba(59,34,24,0.15)]">
                <Mascot mood={sheetLesson.status === "done" ? "proud" : "wave"} size={60} interactive={false} />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-pixel text-lg sm:text-xl font-bold text-choco-900 leading-tight">
                  {sheetLesson.lesson.title}
                </h3>
                <p className="text-xs font-semibold text-candy-700 font-pixel mt-0.5">
                  {sheetLesson.status === "done" ? "Blok Selesai Ditambang!" : "Siap Ditambang Bersama Blobi!"}
                </p>
              </div>
            </div>

            <div className="bg-white/80 p-3 sm:p-3.5 rounded-2xl border-2 border-choco-900 shadow-[0_2px_0_#3B2218] mb-4">
              <p className="text-xs sm:text-sm font-semibold text-choco-700 leading-relaxed">
                {sheetLesson.lesson.exercises?.length || 3} soal kuis · +30 XP · 3 konfirmasi blok
              </p>
            </div>

            <div className="mt-2">
              <button
                type="button"
                className="w-full py-3.5 px-6 rounded-full bg-candy-800 hover:bg-candy-950 text-white font-pixel font-bold text-sm sm:text-base border-2 border-choco-900 shadow-[0_4px_0_#3B2218] active:translate-y-1 active:shadow-none transition-all cursor-pointer flex items-center justify-center gap-2"
                onClick={() => startLesson(sheetLesson.lesson.id)}
              >
                <PulauIcon name="star" size={20} fill />
                <span>
                  {sheetLesson.status === "done"
                    ? "Validasi Ulang (+15 XP)"
                    : "Tambang Blok Ini (+30 XP)"}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Progres Analytics Modal */}
      {showProgresModal && (
        <div
          className="fixed inset-0 z-50 bg-choco-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-150"
          onClick={() => setShowProgresModal(false)}
        >
          <div
            className="bg-cream border-3 border-choco-900 rounded-[28px] w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-[0_8px_0_#3B2218] p-4 sm:p-5 relative animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <PulauRantaiProgres onClose={() => setShowProgresModal(false)} />
          </div>
        </div>
      )}

      {/* Quests Modal Dialog */}
      {showQuestsModal && (
        <div
          className="fixed inset-0 z-50 bg-choco-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-150"
          onClick={() => setShowQuestsModal(false)}
        >
          <div
            className="w-full max-w-md bg-cream border-3 border-choco-900 rounded-[28px] p-5 sm:p-6 shadow-[0_8px_0_#3B2218] relative text-choco-900 animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="absolute top-4 right-4 flex size-9 sm:size-10 items-center justify-center rounded-full border-2 border-choco-900 bg-white text-choco-900 shadow-[0_1px_0_#3B2218] hover:bg-candy-100 active:translate-y-0.5 cursor-pointer transition-all"
              onClick={() => setShowQuestsModal(false)}
              aria-label="Tutup"
            >
              <PulauIcon name="x" size={18} />
            </button>
            <DailyQuests />
          </div>
        </div>
      )}
    </div>
  );
}
