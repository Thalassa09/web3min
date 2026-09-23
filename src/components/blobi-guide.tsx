import { useState, useEffect, useRef } from "react";
import { Mascot, type MascotMood } from "@/components/mascot";
import { useProgress } from "@/lib/store";
import { playMoodSfx, playTap, playDeny } from "@/lib/audio";
import { Sparkles, Flame, Trophy, Play, Lock, ChevronRight, X, Volume2 } from "lucide-react";
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
  const [isMinimized, setIsMinimized] = useState(() => typeof window !== "undefined" && window.innerWidth < 640);
  const [pokeIndex, setPokeIndex] = useState(0);

  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Set up periodic idle "pestering" to prompt the user
  useEffect(() => {
    function resetIdleTimer() {
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      idleTimerRef.current = setTimeout(() => {
        // Trigger playful pestering quip
        const randomQuip = BLOBO_IDLE_QUIPS[Math.floor(Math.random() * BLOBO_IDLE_QUIPS.length)]
          .replace("{streak}", String(streak));
        setMood("wave");
        setSpeech(randomQuip);
        if (sound) playMoodSfx("wave");
      }, 9000); // 9s of inactivity
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
  }, [streak, sound]);

  // Handle clicking / poking Blobi
  const handlePokeBlobi = () => {
    const nextIdx = (pokeIndex + 1) % BLOBO_POKE_REACTIONS.length;
    setPokeIndex(nextIdx);
    const item = BLOBO_POKE_REACTIONS[nextIdx];
    setMood(item.mood);
    setSpeech(item.text);
    if (sound) playMoodSfx(item.mood);
  };

  return (
    <div className="hidden sm:block fixed bottom-20 left-4 lg:bottom-6 lg:left-68 z-30 select-none transition-all duration-300">
      {/* Speech Bubble */}
      {speech && !isMinimized && (
        <div className="relative mb-2.5 max-w-[260px] p-3 rounded-2xl bg-white/95 backdrop-blur-xl border-2 border-ink-900 shadow-[4px_4px_0_#0D2340] animate-in fade-in slide-in-from-bottom-2 duration-200">
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
          <div className="absolute -bottom-2 left-6 size-3 rotate-45 bg-white border-r-2 border-b-2 border-ink-900" />
        </div>
      )}

      {/* Mascot Avatar Button */}
      <div className="flex items-end gap-2">
        {!isMinimized ? (
          <div className="relative group">
            <button
              type="button"
              className="relative block cursor-pointer transition-transform hover:scale-105 active:scale-90"
              onClick={handlePokeBlobi}
              title="Toel Blobi untuk interaksi!"
            >
              <div className="size-16 sm:size-20 drop-shadow-[0_6px_0_rgba(13,35,64,0.3)]">
                <Mascot mood={mood} size={76} />
              </div>
              {/* Tap badge */}
              <span className="absolute -top-1 -right-1 px-1.5 py-0.2 rounded-full bg-candy text-white text-[9px] font-black border border-ink-900 shadow-xs group-hover:block animate-bounce">
                Toel!
              </span>
            </button>

            {/* Minimize toggle */}
            <button
              type="button"
              className="absolute -bottom-1 -right-1 size-5 rounded-full bg-white border border-ink-900 shadow-xs flex items-center justify-center text-[10px] text-ink-500 hover:text-ink-900 cursor-pointer"
              onClick={() => setIsMinimized(true)}
              title="Kecilkan Blobi"
            >
              -
            </button>
          </div>
        ) : (
          <button
            type="button"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/95 backdrop-blur-md border border-ink-900 shadow-[3px_3px_0_#0D2340] text-xs font-black text-candy-deep cursor-pointer hover:scale-105 transition-all"
            onClick={() => {
              setIsMinimized(false);
              setSpeech("Aku balik lagi nemenin kamu belajar! 🌟");
            }}
            title="Panggil Blobi"
          >
            <span className="text-base">🐣</span>
            <span>Blobi</span>
          </button>
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
