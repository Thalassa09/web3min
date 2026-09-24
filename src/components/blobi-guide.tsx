import { useState, useEffect, useRef, useCallback } from "react";
import { Mascot, type MascotMood } from "@/components/mascot";
import { useProgress } from "@/lib/store";
import { playMoodSfx, playTap } from "@/lib/audio";
import { Sparkles, Play, Lock, X } from "lucide-react";
import type { Lesson, Unit } from "@/lib/curriculum";

interface BlobiGuideProps {
  activeLesson?: Lesson | null;
  activeUnit?: Unit | null;
  onStartActiveLesson?: () => void;
  onScrollToActive?: () => void;
  lockedWarn?: {
    lesson: Lesson;
    unit: Unit;
    x: number;
    y: number;
  } | null;
  onDismissLockedWarn?: () => void;
}

const BLOBO_IDLE_QUIPS = [
  "Psst! Kok bengong aja? Yuk gas ke modul berikutnya! 🚀",
  "Streak {streak} hari kamu nungguin nih! Jangan sampai padam ya! 🔥",
  "Tau nggak? Kalo kelarin modul ini dapet +12 XP dan 2 Bintang! 🌟",
  "Blobi laper nih... laper ilmu Web3! Ayo tambang blok baru! 😋",
  "Tombol MULAI-nya udah kedip-kedip tuh, buruan diklik! 👉",
  "Mau beli mahkota buat Blobi di Toko? Kumpulin bintang dulu di sini! 👑",
  "Awas penipu! Di Web3 jangan pernah kasih seed phrase ke siapa pun ya! 🛡️",
  "Ayo buruan mulai, peringkat kamu di Arena mingguan bisa disalip orang! 🏆",
  "Geser aku ke mana aja sesukamu! Blobi bisa nemenin kamu di mana aja! ✨",
];

const BLOBO_POKE_REACTIONS: { mood: MascotMood; text: string }[] = [
  { mood: "wave", text: "Halo teman Web3! Siap belajar hal baru hari ini? 👋" },
  { mood: "celebrate", text: "Yay! Semangat terus, perjalananmu di Pulau Rantai makin jauh! 🎉" },
  { mood: "proud", text: "Blobi bangga sama kamu! Kamu udah makin ngerti blockchain! 😎" },
  { mood: "think", text: "Hmm... tahu nggak bedanya Web2 sama Web3? Coba cek modulnya! 🤔" },
  { mood: "angry", text: "Aduh geli! Jangan ditoel-toel mulu, mending kerjain kuisnya! 😤" },
  { mood: "sleep", text: "Zzz... eh! Aku nggak tidur kok, lagi staking energi! 😴" },
];

export function BlobiFloatingCompanion({
  activeLesson,
  onStartActiveLesson,
  onScrollToActive,
}: {
  activeLesson?: Lesson | null;
  onStartActiveLesson?: () => void;
  onScrollToActive?: () => void;
}) {
  const streak = useProgress((s) => s.streak);
  const sound = useProgress((s) => s.sound);

  const [mood, setMood] = useState<MascotMood>("idle");
  const [speech, setSpeech] = useState<string | null>(null);
  const [isMinimized, setIsMinimized] = useState(false);
  const [pokeIndex, setPokeIndex] = useState(0);

  // Position & Dragging State
  const [coords, setCoords] = useState<{ x: number; y: number } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragTilt, setDragTilt] = useState(0);
  const [facing, setFacing] = useState<1 | -1>(1); // 1 = right, -1 = left
  const [isSquishing, setIsSquishing] = useState(false);

  const pointerStartRef = useRef<{ x: number; y: number } | null>(null);
  const blobiStartPosRef = useRef<{ x: number; y: number } | null>(null);
  const hasMovedRef = useRef(false);
  const lastPointerPosRef = useRef<{ x: number; y: number; time: number } | null>(null);

  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const roamTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Initialize Position (client-only, with localStorage cache)
  useEffect(() => {
    if (typeof window === "undefined") return;

    const clamp = (val: number, min: number, max: number) => Math.max(min, Math.min(max, val));
    const saved = localStorage.getItem("web3min_blobi_coords");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (typeof parsed.x === "number" && typeof parsed.y === "number") {
          setCoords({
            x: clamp(parsed.x, 16, window.innerWidth - 90),
            y: clamp(parsed.y, 60, window.innerHeight - 110),
          });
          return;
        }
      } catch {}
    }

    // Default smart anchor: bottom-left
    const isDesktop = window.innerWidth >= 1024;
    setCoords({
      x: isDesktop ? 270 : 20,
      y: window.innerHeight - (isDesktop ? 130 : 160),
    });
  }, []);

  // Update position on window resize to prevent Blobi from getting stuck outside
  useEffect(() => {
    const handleResize = () => {
      setCoords((prev) => {
        if (!prev) return null;
        return {
          x: Math.max(16, Math.min(window.innerWidth - 90, prev.x)),
          y: Math.max(60, Math.min(window.innerHeight - 110, prev.y)),
        };
      });
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Autonomous Roaming / Wandering ("Gerak-gerak engga diem disini")
  useEffect(() => {
    if (isMinimized || isDragging) return;

    // Periodically Blobi does a cute autonomous little hop / roam
    roamTimerRef.current = setInterval(() => {
      // Don't hop if speech bubble is open or user is interacting
      if (speech || isDragging) return;

      setCoords((prev) => {
        if (!prev || typeof window === "undefined") return prev;

        // Choose a random small hop delta: -35px to +35px horizontally, -20px to +20px vertically
        const hopDirX = Math.random() > 0.5 ? 1 : -1;
        const hopDistX = (20 + Math.random() * 25) * hopDirX;
        const hopDistY = (Math.random() - 0.5) * 30;

        const newX = Math.max(20, Math.min(window.innerWidth - 95, prev.x + hopDistX));
        const newY = Math.max(80, Math.min(window.innerHeight - 120, prev.y + hopDistY));

        setFacing(hopDirX > 0 ? 1 : -1);
        setIsSquishing(true);
        setTimeout(() => setIsSquishing(false), 600);

        // Randomly show an idle mood during wander
        const wanderMoods: MascotMood[] = ["think", "wave", "proud", "idle"];
        const nextMood = wanderMoods[Math.floor(Math.random() * wanderMoods.length)];
        setMood(nextMood);

        return { x: newX, y: newY };
      });
    }, 11000); // hops every 11 seconds

    return () => {
      if (roamTimerRef.current) clearInterval(roamTimerRef.current);
    };
  }, [isMinimized, isDragging, speech]);

  // Periodic Idle Pestering Quips
  useEffect(() => {
    function resetIdleTimer() {
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      idleTimerRef.current = setTimeout(() => {
        if (isDragging || isMinimized) return;
        const randomQuip = BLOBO_IDLE_QUIPS[Math.floor(Math.random() * BLOBO_IDLE_QUIPS.length)]
          .replace("{streak}", String(streak));
        setMood("wave");
        setSpeech(randomQuip);
        if (sound) playMoodSfx("wave");
      }, 14000); // 14s of inactivity
    }

    resetIdleTimer();
    const handleActivity = () => resetIdleTimer();

    window.addEventListener("pointerdown", handleActivity);
    window.addEventListener("keydown", handleActivity);

    return () => {
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      window.removeEventListener("pointerdown", handleActivity);
      window.removeEventListener("keydown", handleActivity);
    };
  }, [streak, sound, isDragging, isMinimized]);

  // Handle poking / clicking Blobi
  const handlePokeBlobi = useCallback(() => {
    const nextIdx = (pokeIndex + 1) % BLOBO_POKE_REACTIONS.length;
    setPokeIndex(nextIdx);
    const item = BLOBO_POKE_REACTIONS[nextIdx];
    setMood(item.mood);
    setSpeech(item.text);
    setIsSquishing(true);
    setTimeout(() => setIsSquishing(false), 500);
    if (sound) playMoodSfx(item.mood);
  }, [pokeIndex, sound]);

  // Drag Handlers
  const handlePointerDown = (e: React.PointerEvent) => {
    // Only drag with primary mouse button / single touch
    if (e.button !== 0) return;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);

    pointerStartRef.current = { x: e.clientX, y: e.clientY };
    blobiStartPosRef.current = coords || { x: 20, y: 500 };
    lastPointerPosRef.current = { x: e.clientX, y: e.clientY, time: Date.now() };
    hasMovedRef.current = false;
    setIsDragging(true);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!pointerStartRef.current || !blobiStartPosRef.current) return;

    const dx = e.clientX - pointerStartRef.current.x;
    const dy = e.clientY - pointerStartRef.current.y;

    if (!hasMovedRef.current && Math.hypot(dx, dy) > 5) {
      hasMovedRef.current = true;
    }

    if (hasMovedRef.current) {
      // Calculate dynamic velocity tilt for squishy physical feel
      if (lastPointerPosRef.current) {
        const dt = Math.max(1, Date.now() - lastPointerPosRef.current.time);
        const vx = (e.clientX - lastPointerPosRef.current.x) / dt;
        setDragTilt(Math.max(-20, Math.min(20, vx * 12)));
        if (Math.abs(vx) > 0.1) {
          setFacing(vx > 0 ? 1 : -1);
        }
      }
      lastPointerPosRef.current = { x: e.clientX, y: e.clientY, time: Date.now() };

      const newX = Math.max(12, Math.min(window.innerWidth - 90, blobiStartPosRef.current.x + dx));
      const newY = Math.max(50, Math.min(window.innerHeight - 100, blobiStartPosRef.current.y + dy));
      setCoords({ x: newX, y: newY });
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    try {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {}

    setIsDragging(false);
    setDragTilt(0);

    if (!hasMovedRef.current) {
      // It was a tap / poke!
      handlePokeBlobi();
    } else {
      // It was a drag: squish slightly on drop & persist position
      setIsSquishing(true);
      setTimeout(() => setIsSquishing(false), 450);
      if (coords) {
        localStorage.setItem("web3min_blobi_coords", JSON.stringify(coords));
      }
      if (sound) playTap();
    }

    pointerStartRef.current = null;
    blobiStartPosRef.current = null;
  };

  // If coords haven't initialized yet, position via fixed bottom-left fallback
  const currentX = coords ? coords.x : 20;
  const currentY = coords ? coords.y : 500;

  // Determine smart speech bubble placement
  const isRightSide = typeof window !== "undefined" && currentX > window.innerWidth - 280;
  const isTopSide = currentY < 200;

  return (
    <div
      style={{
        transform: `translate3d(${currentX}px, ${currentY}px, 0)`,
        transition: isDragging ? "none" : "transform 0.45s cubic-bezier(0.34, 1.56, 0.64, 1)",
      }}
      className="fixed top-0 left-0 z-40 select-none touch-none"
    >
      {/* Speech Bubble */}
      {speech && !isMinimized && (
        <div
          className={`absolute max-w-[260px] p-3 rounded-2xl bg-white/95 backdrop-blur-xl border-2 border-ink-900 shadow-[4px_4px_0_#0D2340] animate-in fade-in zoom-in-95 duration-200 pointer-events-auto ${
            isTopSide
              ? "top-full mt-2"
              : "bottom-full mb-3"
          } ${
            isRightSide
              ? "right-0"
              : "left-0"
          }`}
        >
          <button
            type="button"
            className="absolute top-1.5 right-1.5 p-1 rounded-full text-ink-400 hover:text-ink-900 hover:bg-ink-100 cursor-pointer"
            onClick={() => setSpeech(null)}
            aria-label="Tutup pesan"
          >
            <X className="size-3.5" />
          </button>

          <div className="flex items-center gap-1.5 text-[10px] font-black uppercase text-candy-deep mb-1">
            <Sparkles className="size-3 text-candy" />
            <span>Blobi Berbisik:</span>
          </div>

          <p className="text-xs font-bold text-ink-900 leading-snug pr-3">
            {speech}
          </p>

          {activeLesson && (
            <div className="mt-2.5 pt-2 border-t border-ink-900/10 flex items-center gap-2">
              <button
                type="button"
                className="flex-1 inline-flex items-center justify-center gap-1 py-1.5 px-2.5 rounded-full bg-candy hover:bg-candy-deep text-white text-[11px] font-black border border-ink-900/15 shadow-xs cursor-pointer active:scale-95 transition-all"
                onClick={() => {
                  setSpeech(null);
                  if (onStartActiveLesson) onStartActiveLesson();
                }}
              >
                <Play className="size-3 fill-white" />
                <span>Mulai Belajar</span>
              </button>
              {onScrollToActive && (
                <button
                  type="button"
                  className="py-1.5 px-2 rounded-full bg-slate-100 hover:bg-slate-200 text-ink-700 text-[10px] font-bold border border-ink-900/10 cursor-pointer"
                  onClick={() => {
                    setSpeech(null);
                    onScrollToActive();
                  }}
                  title="Arahkan ke node aktif"
                >
                  Lihat Node ❯
                </button>
              )}
            </div>
          )}

          {/* Bubble Tail */}
          <div
            className={`absolute size-3 rotate-45 bg-white border-ink-900 ${
              isTopSide
                ? "-top-1.5 border-l-2 border-t-2"
                : "-bottom-1.5 border-r-2 border-b-2"
            } ${isRightSide ? "right-8" : "left-8"}`}
          />
        </div>
      )}

      {/* Mascot Drag Handle & Avatar */}
      <div className="flex items-end gap-2">
        {!isMinimized ? (
          <div className="relative group">
            {/* Draggable Blobi Body */}
            <div
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerUp}
              style={{
                transform: `scaleX(${facing}) rotate(${dragTilt}deg) ${
                  isDragging ? "scale(1.12, 0.9)" : ""
                }`,
                transformOrigin: "bottom center",
                cursor: isDragging ? "grabbing" : "grab",
              }}
              className={`relative block transition-transform duration-150 ${
                isSquishing ? "blobi-squishing" : !isDragging ? "blobi-anim-idle" : ""
              }`}
              title="Tarik & geser Blobi ke mana saja! Atau klik untuk toel!"
            >
              <div className="size-16 sm:size-20 drop-shadow-[0_8px_0_rgba(13,35,64,0.3)] filter transition-all">
                <Mascot mood={mood} size={76} />
              </div>

              {/* Tap badge ("Toel!") */}
              <span
                style={{ transform: `scaleX(${facing})` }}
                className="absolute -top-1 -right-1 px-1.5 py-0.2 rounded-full bg-candy text-white text-[9px] font-black border border-ink-900 shadow-xs animate-bounce pointer-events-none"
              >
                Toel!
              </span>

              {/* Drag indicator hint on hover */}
              <span className="hidden group-hover:block absolute -bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap px-1.5 py-0.5 rounded-md bg-ink-900/80 text-white text-[8px] font-bold pointer-events-none">
                Geser aku! 👆
              </span>
            </div>

            {/* Minimize toggle ("-") */}
            <button
              type="button"
              className="absolute -bottom-1 -right-1 size-5 rounded-full bg-white border border-ink-900 shadow-xs flex items-center justify-center text-[10px] font-black text-ink-600 hover:text-ink-900 hover:bg-slate-50 cursor-pointer pointer-events-auto transition-transform active:scale-90"
              onClick={(e) => {
                e.stopPropagation();
                setIsMinimized(true);
              }}
              title="Kecilkan Blobi"
            >
              -
            </button>
          </div>
        ) : (
          /* Minimized pill: also draggable! */
          <div
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            style={{ cursor: isDragging ? "grabbing" : "grab" }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/95 backdrop-blur-md border border-ink-900 shadow-[3px_3px_0_#0D2340] text-xs font-black text-candy-deep hover:scale-105 active:scale-95 transition-all"
            title="Klik untuk buka Blobi, atau geser posisi"
          >
            <span className="text-base pointer-events-none">🐣</span>
            <button
              type="button"
              className="cursor-pointer"
              onClick={() => {
                if (!hasMovedRef.current) {
                  setIsMinimized(false);
                  setSpeech("Aku balik lagi nemenin kamu belajar! 🌟");
                }
              }}
            >
              Blobi
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export function BlobiLockedModal({
  warn,
  onDismiss,
  onScrollToActive,
}: {
  warn: {
    lesson: Lesson;
    unit: Unit;
    x: number;
    y: number;
  };
  onDismiss: () => void;
  onScrollToActive?: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-900/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-sm p-5 rounded-[26px] bg-white border-3 border-ink-900 shadow-[8px_8px_0_#0D2340] animate-in zoom-in-95 duration-200">
        <button
          type="button"
          className="absolute top-3 right-3 p-1.5 rounded-full text-ink-400 hover:text-ink-900 hover:bg-slate-100 cursor-pointer"
          onClick={onDismiss}
          aria-label="Tutup"
        >
          <X className="size-4" />
        </button>

        {/* Mascot Header */}
        <div className="flex items-center gap-3.5 mb-3">
          <div className="size-16 shrink-0 -mt-2">
            <Mascot mood="angry" size={64} />
          </div>
          <div>
            <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-ruby-soft text-ruby font-black text-[10px] uppercase">
              <Lock className="size-3" />
              <span>Masih Digembok!</span>
            </div>
            <h4 className="font-display font-black text-base text-ink-900 mt-1">
              Eits, jangan curang! 😜
            </h4>
          </div>
        </div>

        {/* Message */}
        <p className="text-xs text-ink-600 font-semibold leading-relaxed mb-4 bg-slate-50 p-3 rounded-xl border border-ink-900/10">
          Modul <strong className="text-ink-900">"{warn.lesson.title}"</strong> di Rute {warn.unit.index} belum terbuka.
          Kamu harus menyelesaikan modul bertanda bintang <strong className="text-candy-deep">★ MULAI</strong> terlebih dahulu!
        </p>

        {/* Action Buttons */}
        <div className="flex gap-2">
          {onScrollToActive && (
            <button
              type="button"
              className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-full bg-candy hover:bg-candy-deep text-white font-display text-xs font-black border-2 border-ink-900 shadow-[0_3px_0_#A51D5B] active:translate-y-0.5 cursor-pointer transition-all"
              onClick={() => {
                onDismiss();
                onScrollToActive();
              }}
            >
              <Sparkles className="size-3.5 text-white" />
              <span>Arahkan ke Modul Aktif ❯</span>
            </button>
          )}
          <button
            type="button"
            className="py-2.5 px-4 rounded-full bg-slate-100 hover:bg-slate-200 text-ink-700 font-bold text-xs border border-ink-900/15 cursor-pointer"
            onClick={onDismiss}
          >
            Mengerti
          </button>
        </div>
      </div>
    </div>
  );
}
