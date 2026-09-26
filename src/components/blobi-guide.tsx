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
  "Psst! Kok bengong aja? Yuk gas ke modul berikutnya!",
  "Streak {streak} hari kamu nungguin nih! Jangan sampai padam ya!",
  "Tau nggak? Kalo kelarin modul ini dapet +12 XP dan 2 Koin!",
  "Blobi laper nih... laper ilmu Web3! Ayo tambang blok baru!",
  "Tombol MULAI-nya udah kedip-kedip tuh, buruan diklik!",
  "Mau beli mahkota buat Blobi di Toko? Kumpulkan koin dulu di sini!",
  "Awas penipu! Di Web3 jangan pernah kasih seed phrase ke siapa pun ya!",
  "Ayo buruan mulai, peringkat kamu di Arena mingguan bisa disalip orang!",
  "Tarik & geser aku ke mana aja! Blobi bisa jalan-jalan nemenin kamu!",
];

const BLOBO_POKE_REACTIONS: { mood: MascotMood; text: string }[] = [
  { mood: "wave", text: "Halo teman Web3! Siap belajar hal baru hari ini?" },
  { mood: "celebrate", text: "Yay! Semangat terus, perjalananmu di Pulau Rantai makin jauh!" },
  { mood: "proud", text: "Blobi bangga sama kamu! Kamu udah makin ngerti blockchain!" },
  { mood: "think", text: "Hmm... tahu nggak bedanya Web2 sama Web3? Coba cek modulnya!" },
  { mood: "angry", text: "Aduh geli! Jangan ditoel-toel mulu, mending kerjain kuisnya!" },
  { mood: "sleep", text: "Zzz... eh! Aku nggak tidur kok, lagi staking energi!" },
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
  const coachActive = useProgress((s) => !s.coachSeen && s.completed.length === 0);

  const [mood, setMood] = useState<MascotMood>("idle");
  const [speech, setSpeech] = useState<string | null>(null);
  const [isMinimized, setIsMinimized] = useState(false);
  const [pokeIndex, setPokeIndex] = useState(0);

  // Position, Physics & Dragging State
  const [coords, setCoords] = useState<{ x: number; y: number } | null>(null);
  const homePosRef = useRef<{ x: number; y: number } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragTilt, setDragTilt] = useState(0);
  const [facing, setFacing] = useState<1 | -1>(1); // 1 = right, -1 = left
  const [isSquishing, setIsSquishing] = useState(false);
  const [isHopping, setIsHopping] = useState(false);

  const pointerStartRef = useRef<{ x: number; y: number } | null>(null);
  const blobiStartPosRef = useRef<{ x: number; y: number } | null>(null);
  const hasMovedRef = useRef(false);
  const lastPointerPosRef = useRef<{ x: number; y: number; time: number } | null>(null);

  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const roamTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const speechTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Show speech bubble with automatic dismiss after duration
  const showSpeech = useCallback((text: string, duration = 6500) => {
    setSpeech(text);
    if (speechTimerRef.current) clearTimeout(speechTimerRef.current);
    speechTimerRef.current = setTimeout(() => {
      setSpeech(null);
    }, duration);
  }, []);

  // Initialize Position on Client
  useEffect(() => {
    if (typeof window === "undefined") return;

    const clamp = (val: number, min: number, max: number) => Math.max(min, Math.min(max, val));
    const saved = localStorage.getItem("web3min_blobi_coords");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (typeof parsed.x === "number" && typeof parsed.y === "number") {
          const pt = {
            x: clamp(parsed.x, 16, window.innerWidth - 95),
            y: clamp(parsed.y, 60, window.innerHeight - 110),
          };
          setCoords(pt);
          homePosRef.current = pt;
          return;
        }
      } catch {}
    }

    // Default smart anchor: bottom-left
    const isDesktop = window.innerWidth >= 1024;
    const def = {
      x: isDesktop ? 270 : 20,
      y: window.innerHeight - (isDesktop ? 130 : 160),
    };
    setCoords(def);
    homePosRef.current = def;
  }, []);

  // Auto-clamp on window resize
  useEffect(() => {
    const handleResize = () => {
      setCoords((prev) => {
        if (!prev) return null;
        return {
          x: Math.max(16, Math.min(window.innerWidth - 95, prev.x)),
          y: Math.max(60, Math.min(window.innerHeight - 110, prev.y)),
        };
      });
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Autonomous Roaming & Movement ("Gerak-gerak engga diem disini")
  useEffect(() => {
    if (isMinimized || isDragging) return;

    // Periodically Blobi does a playful little hop and wanders around its home spot
    roamTimerRef.current = setInterval(() => {
      // Don't wander while dragging
      if (isDragging) return;

      setCoords((prev) => {
        if (!prev || typeof window === "undefined") return prev;
        const home = homePosRef.current || prev;

        // Choose a random hop delta around home position (+/- 35px X, +/- 25px Y)
        const hopDirX = Math.random() > 0.5 ? 1 : -1;
        const hopDistX = (10 + Math.random() * 25) * hopDirX;
        const hopDistY = (Math.random() - 0.5) * 30;

        const newX = Math.max(16, Math.min(window.innerWidth - 95, home.x + hopDistX));
        const newY = Math.max(70, Math.min(window.innerHeight - 120, home.y + hopDistY));

        setFacing(hopDirX > 0 ? 1 : -1);
        setIsHopping(true);
        setTimeout(() => setIsHopping(false), 550);

        // Randomly show an expressive mood during roaming
        const wanderMoods: MascotMood[] = ["think", "wave", "proud", "idle"];
        const nextMood = wanderMoods[Math.floor(Math.random() * wanderMoods.length)];
        setMood(nextMood);

        return { x: newX, y: newY };
      });
    }, 7000); // hops every 7 seconds so Blobi is actively alive!

    return () => {
      if (roamTimerRef.current) clearInterval(roamTimerRef.current);
    };
  }, [isMinimized, isDragging]);

  // Periodic Idle Pestering Quips
  useEffect(() => {
    function resetIdleTimer() {
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      idleTimerRef.current = setTimeout(() => {
        if (isDragging || isMinimized) return;
        const randomQuip = BLOBO_IDLE_QUIPS[Math.floor(Math.random() * BLOBO_IDLE_QUIPS.length)]
          .replace("{streak}", String(streak));
        setMood("wave");
        showSpeech(randomQuip, 6500);
        if (sound) playMoodSfx("wave");
      }, 12000); // 12s of inactivity
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
  }, [streak, sound, isDragging, isMinimized, showSpeech]);

  // Handle poking / clicking Blobi -> cute hop & sound, NO overlay modal
  const handlePokeBlobi = useCallback(() => {
    const nextIdx = (pokeIndex + 1) % BLOBO_POKE_REACTIONS.length;
    setPokeIndex(nextIdx);
    const item = BLOBO_POKE_REACTIONS[nextIdx];
    setMood(item.mood);
    showSpeech(item.text, 5000);
    setIsSquishing(true);
    setTimeout(() => setIsSquishing(false), 500);
    if (sound) playMoodSfx(item.mood);
  }, [pokeIndex, sound, showSpeech]);

  // Drag Handlers with Window-level pointer listeners for infallible tracking
  const handlePointerDown = (e: React.PointerEvent) => {
    if (e.button !== 0) return;
    try {
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    } catch {}

    const startX = e.clientX;
    const startY = e.clientY;
    const initialPos = coords || { x: 20, y: typeof window !== "undefined" ? window.innerHeight - 130 : 500 };
    pointerStartRef.current = { x: startX, y: startY };
    blobiStartPosRef.current = initialPos;
    lastPointerPosRef.current = { x: startX, y: startY, time: Date.now() };
    hasMovedRef.current = false;
    setIsDragging(true);

    const onPointerMove = (evt: PointerEvent) => {
      const dx = evt.clientX - startX;
      const dy = evt.clientY - startY;

      if (!hasMovedRef.current && Math.hypot(dx, dy) > 5) {
        hasMovedRef.current = true;
      }

      if (hasMovedRef.current) {
        if (lastPointerPosRef.current) {
          const dt = Math.max(1, Date.now() - lastPointerPosRef.current.time);
          const vx = (evt.clientX - lastPointerPosRef.current.x) / dt;
          setDragTilt(Math.max(-20, Math.min(20, vx * 12)));
          if (Math.abs(vx) > 0.08) {
            setFacing(vx > 0 ? 1 : -1);
          }
        }
        lastPointerPosRef.current = { x: evt.clientX, y: evt.clientY, time: Date.now() };

        const newX = Math.max(12, Math.min(window.innerWidth - 95, initialPos.x + dx));
        const newY = Math.max(50, Math.min(window.innerHeight - 105, initialPos.y + dy));
        setCoords({ x: newX, y: newY });
      }
    };

    const onPointerUp = () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("pointercancel", onPointerUp);

      setIsDragging(false);
      setDragTilt(0);

      if (!hasMovedRef.current) {
        // It was a tap / poke! Open Blobi overlay modal!
        handlePokeBlobi();
      } else {
        // It was a drag: squish slightly on landing & persist position
        setIsSquishing(true);
        setTimeout(() => setIsSquishing(false), 450);
        setCoords((curr) => {
          if (curr) {
            homePosRef.current = curr;
            localStorage.setItem("web3min_blobi_coords", JSON.stringify(curr));
          }
          return curr;
        });
        if (sound) playTap();
      }

      pointerStartRef.current = null;
      blobiStartPosRef.current = null;
    };

    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    window.addEventListener("pointercancel", onPointerUp);
  };

  if (coachActive) return null;

  const currentX = coords ? coords.x : 20;
  const currentY = coords ? coords.y : 500;

  // Determine smart speech bubble placement based on screen position
  const isRightSide = typeof window !== "undefined" && currentX > window.innerWidth - 280;
  const isTopSide = currentY < 200;

  return (
    <>
      {/* Floating Draggable Blobi Avatar */}
      <div
        style={{
          transform: `translate3d(${currentX}px, ${currentY}px, 0)`,
          transition: isDragging ? "none" : "transform 0.45s cubic-bezier(0.34, 1.56, 0.64, 1)",
        }}
        className="fixed top-0 left-0 z-40 select-none touch-none"
      >
        {/* Subtle Floating Idle Speech Bubble when not in modal */}
        {speech && !isMinimized && !isDragging && (
          <div
            onClick={(e) => {
              e.stopPropagation();
              setSpeech(null);
            }}
            className={`absolute max-w-[260px] p-3 rounded-2xl bg-cream border-2 border-choco-900 shadow-[0_4px_0_#3B2218] animate-in fade-in zoom-in-95 duration-200 pointer-events-auto text-choco-900 cursor-pointer hover:scale-102 transition-transform ${
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
              className="absolute top-1.5 right-1.5 size-6 flex items-center justify-center rounded-full text-choco-500 hover:text-choco-900 hover:bg-candy-100 cursor-pointer text-xs font-bold"
              onClick={(e) => {
                e.stopPropagation();
                setSpeech(null);
              }}
              aria-label="Tutup pesan"
            >
              <X className="size-3.5" />
            </button>

            <div className="flex items-center gap-1.5 text-[10px] font-pixel font-bold uppercase text-candy-700 mb-1">
              <Sparkles className="size-3 text-candy-500" />
              <span>Blobi Berbisik:</span>
            </div>

            <p className="text-xs font-bold text-choco-900 leading-snug pr-3">
              {speech}
            </p>

            {/* Bubble Tail */}
            <div
              className={`absolute size-3 rotate-45 bg-cream border-choco-900 ${
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
                style={{
                  transform: `scaleX(${facing}) rotate(${dragTilt}deg) ${
                    isDragging ? "scale(1.12, 0.9)" : ""
                  }`,
                  transformOrigin: "bottom center",
                  cursor: isDragging ? "grabbing" : "grab",
                }}
                className={`relative block transition-transform duration-150 ${
                  isSquishing
                    ? "blobi-squishing"
                    : isHopping
                    ? "blobi-hopping"
                    : !isDragging
                    ? "blobi-anim-idle"
                    : ""
                }`}
                title="Tarik & geser Blobi ke mana saja! Atau klik untuk toel!"
              >
                <div className="size-16 sm:size-20 drop-shadow-[0_6px_0_rgba(59,34,24,0.3)] filter transition-all pointer-events-none">
                  <Mascot mood={mood} size={76} interactive={false} />
                </div>

                {/* Tap badge ("Toel!") in Arcade 3D */}
                <span
                  style={{ transform: `scaleX(${facing})` }}
                  className="absolute -top-1 -right-1 px-2 py-0.5 rounded-full bg-candy-500 text-white text-[10px] font-pixel font-bold border-2 border-choco-900 shadow-[0_2px_0_#3B2218] animate-bounce pointer-events-none"
                >
                  Toel!
                </span>

                {/* Drag indicator hint on hover */}
                <span className="hidden group-hover:block absolute -bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap px-2 py-0.5 rounded-md bg-choco-900 text-cream text-[9px] font-bold border border-choco-900 pointer-events-none shadow-xs">
                  Geser aku!
                </span>
              </div>

              {/* Minimize toggle ("-") */}
              <button
                type="button"
                className="absolute -bottom-1 -right-1 size-5.5 rounded-full bg-white border-2 border-choco-900 shadow-[0_1.5px_0_#3B2218] flex items-center justify-center text-[10px] font-pixel font-bold text-choco-900 hover:bg-candy-100 cursor-pointer pointer-events-auto transition-transform active:scale-90"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsMinimized(true);
                  setSpeech(null);
                }}
                title="Kecilkan Blobi"
              >
                -
              </button>
            </div>
          ) : (
            /* Minimized pill: also draggable & tappable anywhere! */
            <div
              role="button"
              tabIndex={0}
              onPointerDown={handlePointerDown}
              onClick={() => {
                if (!hasMovedRef.current) {
                  setIsMinimized(false);
                  showSpeech("Halo lagi!", 3000);
                }
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setIsMinimized(false);
                  showSpeech("Halo lagi!", 3000);
                }
              }}
              style={{ cursor: isDragging ? "grabbing" : "grab" }}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-cream border-2 border-choco-900 shadow-[0_3px_0_#3B2218] text-xs font-pixel font-bold text-candy-700 hover:scale-105 active:scale-95 transition-all cursor-pointer select-none touch-none"
              title="Klik untuk buka Blobi, atau geser posisi"
            >
              <Sparkles className="size-3.5 text-candy-500 pointer-events-none" />
              <span className="pointer-events-none">Blobi</span>
            </div>
          )}
        </div>
      </div>
    </>
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
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-choco-900/60 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={onDismiss}
    >
      <div
        className="relative w-full max-w-sm p-5 sm:p-6 rounded-[28px] bg-cream border-3 border-choco-900 shadow-[0_8px_0_#3B2218] animate-in zoom-in-95 duration-200 text-choco-900"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          className="absolute top-4 right-4 flex size-9 items-center justify-center rounded-full border-2 border-choco-900 bg-white text-choco-900 shadow-[0_1px_0_#3B2218] hover:bg-candy-100 active:translate-y-0.5 cursor-pointer transition-all"
          onClick={onDismiss}
          aria-label="Tutup"
        >
          <X className="size-4.5 stroke-[2.5]" />
        </button>

        {/* Mascot Header */}
        <div className="flex items-center gap-3.5 mb-3">
          <div className="size-16 shrink-0 -mt-2 drop-shadow-[0_4px_0_rgba(59,34,24,0.15)]">
            <Mascot mood="angry" size={64} interactive={false} />
          </div>
          <div>
            <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-candy-100 text-candy-700 border border-choco-900 font-pixel text-[9px] uppercase tracking-wider font-bold">
              <Lock className="size-3" />
              <span>Masih Digembok!</span>
            </div>
            <h4 className="font-pixel text-base font-bold text-choco-900 mt-1">
              Eits, jangan curang!
            </h4>
          </div>
        </div>

        {/* Message */}
        <p className="text-xs text-choco-800 font-semibold leading-relaxed mb-4 bg-white/80 p-3 rounded-2xl border-2 border-choco-900 shadow-[0_2px_0_#3B2218]">
          Modul <strong className="text-choco-900">"{warn.lesson.title}"</strong> di Rute {warn.unit.index} belum terbuka.
          Kamu harus menyelesaikan modul bertanda <strong className="text-candy-700">MULAI</strong> terlebih dahulu!
        </p>

        {/* Action Buttons */}
        <div className="flex gap-2">
          {onScrollToActive && (
            <button
              type="button"
              className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-full bg-candy-500 hover:bg-candy-600 text-white font-pixel font-bold text-xs border-2 border-choco-900 shadow-[0_3px_0_#3B2218] active:translate-y-0.5 cursor-pointer transition-all"
              onClick={() => {
                onDismiss();
                onScrollToActive();
              }}
            >
              <Sparkles className="size-3.5 text-white" />
              <span>Arahkan ke Modul Aktif</span>
            </button>
          )}
          <button
            type="button"
            className="py-2.5 px-4 rounded-full bg-white hover:bg-candy-50 text-choco-900 font-bold text-xs border-2 border-choco-900 shadow-[0_2px_0_#3B2218] active:translate-y-0.5 cursor-pointer transition-all"
            onClick={onDismiss}
          >
            Mengerti
          </button>
        </div>
      </div>
    </div>
  );
}
