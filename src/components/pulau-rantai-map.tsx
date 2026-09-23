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

                {/* World Sign Board - Compact, Non-intrusive on Mobile, Rich on Desktop */}
                <div
                  className="absolute left-3 right-3 sm:left-4 sm:right-4 max-w-lg mx-auto top-2.5 z-10 bg-white/95 backdrop-blur-md border-2 border-ink-900 rounded-2xl px-3 py-2 sm:p-3.5 shadow-[2px_2px_0_#2B1622] transition-all pointer-events-auto"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="shrink-0 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-candy-500 text-white font-mono font-black text-[10px] tracking-wide shadow-xs">
                        <span>RUTE {unit.index}</span>
                        <span>·</span>
                        <span>{theme.kind.toUpperCase()}</span>
                      </span>
                      <h3 className="text-xs sm:text-base font-black font-display text-ink-900 tracking-tight truncate">
                        {unit.title}
                      </h3>
                    </div>
                    <span className="shrink-0 text-[10px] font-mono font-bold text-ink-500 bg-sand-100 px-2 py-0.5 rounded-full border border-ink-900/15">
                      {unit.lessons.filter((l) => l.kind !== "chest").length} Blok
                    </span>
                  </div>
                  {/* Subtitle / Description - Subtle and hidden on mobile to avoid screen crowding */}
                  <p className="hidden sm:block text-xs text-ink-600 font-medium leading-relaxed mt-1 line-clamp-1">
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
                          <div className="relative flex flex-col items-center">
                            {/* Playful callout bubble */}
                            <div className="mb-0.5 px-2.5 py-0.5 rounded-full bg-paper border-2 border-ink-900 shadow-xs text-[10px] font-black text-primary-hover whitespace-nowrap animate-bounce flex items-center gap-1">
                              <span>Ayo tambang!</span>
                              <span className="text-[9px]">⛏️</span>
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
                              title="Klik Blobi untuk tambang blok ini!"
                            >
                              <div className="size-14 sm:size-16 drop-shadow-[0_4px_0_rgba(43,22,34,0.25)]">
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

            <p className="t-label text-primary">
              Blok #0x{sheetLesson.blockNo.toString(16).toUpperCase().padStart(2, "0")} · Rute {sheetLesson.unit.index}{" "}
              {sheetLesson.unit.title}
            </p>
            <h3 className="t-heading text-ink-900 mt-1">
              {sheetLesson.lesson.title}
            </h3>
            <p className="t-caption text-ink-500 mt-1">
              {sheetLesson.lesson.exercises?.length || 3} soal kuis · +30 XP · 3 konfirmasi blok
            </p>

            <div className="mt-5">
              <Button
                variant="primary"
                size="lg"
                wide
                icon={<PulauIcon name="star" size={20} fill />}
                onClick={() => startLesson(sheetLesson.lesson.id)}
              >
                {sheetLesson.status === "done"
                  ? "Validasi Ulang (+15 XP)"
                  : "Tambang Blok Ini (+30 XP)"}
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Progres Analytics Modal */}
      {showProgresModal && (
        <div className="fixed inset-0 z-50 bg-choco-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-cream border-3 border-choco-900 rounded-[28px] w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-[0_8px_0_#3B2218] p-4 sm:p-5 relative">
            <PulauRantaiProgres onClose={() => setShowProgresModal(false)} />
          </div>
        </div>
      )}

      {/* Quests Modal Dialog */}
      {showQuestsModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-paper border-2 border-ink-900 rounded-[28px] w-full max-w-md p-5 shadow-ink relative">
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
