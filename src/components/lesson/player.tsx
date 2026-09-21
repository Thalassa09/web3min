import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Heart, X } from "@/lib/kicon";
import type { Exercise, Lesson } from "@/lib/curriculum";
import { firstIncompleteId, getLesson, scoredExerciseCount } from "@/lib/curriculum";
import { worldOf } from "@/lib/worlds";
import { formatHeartWait, HEART_MS, UNLIMITED_GEMS, msUntilHeart, useProgress } from "@/lib/store";
import { DuoButton } from "@/components/duo-button";
import { Mascot, SpeechBubble } from "@/components/mascot";
import { BlockStamp, RouteChain } from "@/components/motif";
import { ExerciseView, type CheckHandle } from "@/components/lesson/exercises";
import { HEART_REFILL_COST } from "@/lib/shop";
import { playComplete, playCorrect, playHeart, playWrong } from "@/lib/audio";
import { cn } from "@/lib/utils";

type Phase = "ask" | "feedback" | "done" | "dead";

const WRONG_LINES = ["Pelan-pelan, kita bedah.", "Hampir. Coba liat lagi.", "Oke, simpan dulu. Nanti ketemu lagi."];
const RIGHT_LINES = ["Mantap.", "Nah, bener.", "Nangkep."];

export function LessonPlayer({ lesson }: { lesson: Lesson }) {
  const navigate = useNavigate();
  const hearts = useProgress((s) => s.hearts);
  const heartsUpdatedAt = useProgress((s) => s.heartsUpdatedAt);
  const loseHeart = useProgress((s) => s.loseHeart);
  const refillHearts = useProgress((s) => s.refillHearts);
  const completeLesson = useProgress((s) => s.completeLesson);
  const gems = useProgress((s) => s.gems);
  const sound = useProgress((s) => s.sound);
  const dailyGoal = useProgress((s) => s.dailyGoal);
  const xpToday = useProgress((s) => s.xpToday);

  const scored = scoredExerciseCount(lesson);
  const [pending, setPending] = useState<Exercise[]>(() => [...lesson.exercises]);
  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>(() => (useProgress.getState().hearts <= 0 ? "dead" : "ask"));
  const [ok, setOk] = useState(false);
  const [ready, setReady] = useState(false);
  const [mistakes, setMistakes] = useState(0);
  const [solved, setSolved] = useState(0);
  const [awarded, setAwarded] = useState<{ xp: number; gems: number; perfect: boolean } | null>(null);
  const handleRef = useRef<CheckHandle>({ ready: false, isCorrect: () => false });
  const mistakesRef = useRef(0);
  const pendingLenRef = useRef(pending.length);

  const exercise = pending[index];
  pendingLenRef.current = pending.length;

  const onHandle = useCallback((h: CheckHandle) => {
    handleRef.current = h;
    setReady(h.ready);
  }, []);

  const finish = useCallback(
    (miss: number) => {
      const perfect = miss === 0;
      completeLesson(lesson.id, { perfect });
      const xp = lesson.xp + (perfect ? 8 : 0);
      const gemGain = lesson.gems + (perfect ? 2 : 0);
      setAwarded({ xp, gems: gemGain, perfect });
      setPhase("done");
      if (sound) playComplete();
    },
    [completeLesson, lesson, sound],
  );

  function goNext() {
    const nextIndex = index + 1;
    if (nextIndex >= pendingLenRef.current) {
      finish(mistakesRef.current);
      return;
    }
    setIndex(nextIndex);
    setPhase("ask");
    setReady(false);
    setOk(false);
  }

  function check() {
    if (phase !== "ask" || !exercise) return;
    if (exercise.type === "tip") {
      goNext();
      return;
    }
    const correct = handleRef.current.isCorrect();
    setOk(correct);
    setPhase("feedback");
    if (correct) {
      setSolved((n) => n + 1);
      if (sound) playCorrect();
    } else {
      const nextMiss = mistakesRef.current + 1;
      mistakesRef.current = nextMiss;
      setMistakes(nextMiss);
      loseHeart();
      if (sound) playWrong();
      if (sound) playHeart();
      setPending((q) => [...q, exercise]);
      if (useProgress.getState().hearts <= 0) setPhase("dead");
    }
  }

  function continueAfterFeedback() {
    if (useProgress.getState().hearts <= 0) {
      setPhase("dead");
      return;
    }
    goNext();
  }

  const autoPass = useCallback(() => {
    if (phase !== "ask") return;
    setOk(true);
    setPhase("feedback");
    setSolved((n) => n + 1);
    if (sound) playCorrect();
  }, [phase, sound]);

  const mismatch = useCallback(() => {
    mistakesRef.current += 1;
    setMistakes(mistakesRef.current);
    loseHeart();
    if (sound) playWrong();
    if (sound) playHeart();
    if (useProgress.getState().hearts <= 0) setPhase("dead");
  }, [loseHeart, sound]);

  const mood =
    phase === "feedback" ? (ok ? "proud" : "think") : phase === "done" ? "celebrate" : phase === "dead" ? "sleep" : "idle";
  const world = worldOf(lesson.unitId);
  const isTip = exercise?.type === "tip";

  const blobiLine =
    exercise && "blobi" in exercise && exercise.blobi
      ? exercise.blobi
      : phase === "feedback"
        ? ok
          ? RIGHT_LINES[solved % RIGHT_LINES.length]
          : WRONG_LINES[mistakes % WRONG_LINES.length]
        : null;

  return (
    <div className={cn("quiz-shell relative mx-auto flex h-dvh max-h-dvh w-full max-w-lg flex-col overflow-hidden bg-[#F8FAFC] lg:max-w-none", world.skin)}>
      <div className="shrink-0 flex items-center gap-3 px-3 py-2.5 bg-white border-b-2 border-[#B9CFE9] shadow-sm lg:px-8">
        <button
          type="button"
          aria-label="Keluar"
          className="grid size-10 place-items-center rounded-xl text-[#5A7796] hover:text-[#0D2340] hover:bg-[#EAF2FB] transition-colors"
          onClick={() => void navigate({ to: "/" })}
        >
          <X className="size-6" weight="bold" />
        </button>
        <div className="mx-1 flex min-w-0 flex-1 items-center">
          <RouteChain have={solved} need={Math.max(1, scored)} label={`${solved}/${scored || 1}`} />
        </div>
        <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFECEC] border border-[#FCA5A5] text-xs font-extrabold tabular-nums text-[#E63329]">
          <Heart className="size-4 text-[#E63329]" weight="fill" />
          {hearts}
        </span>
      </div>

      {lesson.unitId === "u2" || lesson.unitId === "u6" ? (
        <p className="mx-5 mt-2 text-xs leading-5 text-[#5A7796] lg:mx-8">
          web3min tidak akan pernah meminta seed phrase, private key, atau password dompetmu. Kamu tidak perlu
          menghubungkan wallet untuk belajar.
        </p>
      ) : lesson.unitId === "u5" || lesson.unitId === "u7" || lesson.unitId === "u15" ? (
        <p className="mx-5 mt-2 text-xs leading-5 text-[#5A7796] lg:mx-8">
          Materi ini bersifat edukatif, bukan saran keuangan.
        </p>
      ) : null}

      <div
        className={cn(
          "flex min-h-0 flex-1 flex-col overflow-y-auto px-5 pb-6 pt-4 lg:mx-auto lg:w-full lg:max-w-3xl lg:px-10 lg:pt-8",
          !isTip && phase !== "done" && phase !== "dead" && "lg:flex-row lg:items-start lg:gap-10 lg:pt-10 lg:max-w-6xl",
        )}
      >
        {phase !== "done" && phase !== "dead" && exercise ? (
          <>
            <div
              className={cn(
                "mb-4 flex items-start gap-3",
                isTip
                  ? "lg:mb-5 lg:justify-center"
                  : "lg:mb-0 lg:w-56 lg:shrink-0 lg:flex-col lg:items-center lg:pt-1",
              )}
            >
              <div className={cn(isTip ? "size-[72px] shrink-0 lg:size-[120px]" : "size-[88px] shrink-0 lg:size-[160px]")}>
                <Mascot fill mood={isTip ? "think" : mood} />
              </div>
              {isTip || blobiLine || phase === "feedback" ? (
                <SpeechBubble className={cn("mt-2 flex-1", !isTip && "lg:mt-4 lg:w-full")} tail="left">
                  {isTip
                    ? "Baca sampe bawah dulu. Kuisnya nanti."
                    : (blobiLine ?? (phase === "ask" ? "Ada kuis muncul!" : ok ? "Mantap." : "Belum pas."))}
                </SpeechBubble>
              ) : null}
            </div>
            <div key={exercise.id} className={cn("min-w-0 flex-1 pb-6 enter-up", isTip && "lg:mx-auto lg:max-w-3xl")}>
              <ExerciseView
                exercise={exercise}
                disabled={phase !== "ask"}
                reveal={phase === "feedback"}
                onHandle={onHandle}
                onAutoPass={exercise.type === "match" ? autoPass : undefined}
                onMismatch={exercise.type === "match" ? mismatch : undefined}
              />
            </div>
          </>
        ) : null}

        {phase === "done" && awarded ? (
          <div className="m-auto w-full max-w-md">
            <CompleteCard
              lesson={lesson}
              awarded={awarded}
              dailyHit={xpToday >= dailyGoal}
              onHome={() => void navigate({ to: "/" })}
              onNext={() => {
                const next = firstIncompleteId(useProgress.getState().completed);
                if (next) void navigate({ to: "/lesson/$lessonId", params: { lessonId: next } });
                else void navigate({ to: "/" });
              }}
            />
          </div>
        ) : null}

        {phase === "dead" ? (
          <DeadState
            lesson={lesson}
            explanation={exercise && "explanation" in exercise ? exercise.explanation : null}
            gems={gems}
            heartsUpdatedAt={heartsUpdatedAt}
            onKisah={() => void navigate({ to: "/kisah" })}
            onHome={() => void navigate({ to: "/" })}
            onRefill={() => {
              if (refillHearts()) {
                setPhase("ask");
                setReady(false);
              }
            }}
          />
        ) : null}
      </div>

      {phase === "ask" && exercise ? (
        <div className="shrink-0 z-30 bg-white/95 backdrop-blur-md border-t-2 border-[#B9CFE9] px-5 py-3.5 pb-[max(1rem,env(safe-area-inset-bottom))] shadow-[0_-4px_16px_rgba(9,48,102,0.08)] lg:px-8">
          <div className="mx-auto w-full max-w-3xl flex items-center justify-between gap-4">
            <p className="hidden sm:block text-xs font-bold text-[#5A7796]">
              {isTip ? "Pahami intinya sebelum lanjut ke kuis" : "Pilih satu jawaban yang paling tepat"}
            </p>
            <DuoButton
              wide
              variant="primary"
              className="w-full sm:w-auto sm:min-w-[200px] ml-auto"
              disabled={!ready}
              onClick={check}
            >
              {isTip ? "Udah Paham, Lanjut" : "Periksa Jawaban"}
            </DuoButton>
          </div>
        </div>
      ) : null}

      {phase === "feedback" ? (
        <div className={cn("shrink-0 quiz-fb", ok ? "quiz-fb-ok" : "quiz-fb-bad")} role="status" aria-live="polite">
          <div className="mx-auto flex w-full max-w-3xl flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="min-w-0 flex-1">
              <p className={cn("font-display text-xl font-bold", ok ? "text-[#1E8A49]" : "text-[#E63329]")}>
                {ok ? "🎉 Jawaban Benar!" : "💔 Belum Pas"}
              </p>
              {exercise && exercise.type !== "tip" && exercise.type !== "match" ? (
                <p className="mt-1 text-sm font-medium leading-relaxed text-[#1E3A5F]">{exercise.explanation}</p>
              ) : null}
              {exercise?.type === "match" ? (
                <p className="mt-1 text-sm font-medium leading-relaxed text-[#1E3A5F]">Semua kartu berhasil disambungkan.</p>
              ) : null}
              {!ok ? (
                <p className="mt-1 text-xs font-semibold text-[#8C1D18]">Soal ini akan diulang di akhir sesi.</p>
              ) : null}
            </div>
            <DuoButton
              wide
              className="w-full sm:w-auto sm:min-w-[180px] shrink-0"
              variant={ok ? "primary" : "white"}
              onClick={continueAfterFeedback}
            >
              {ok ? "Lanjut" : "Coba Lagi Nanti"}
            </DuoButton>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function DeadState({
  lesson,
  explanation,
  gems,
  heartsUpdatedAt,
  onKisah,
  onHome,
  onRefill,
}: {
  lesson: Lesson;
  explanation: string | null;
  gems: number;
  heartsUpdatedAt: number;
  onKisah: () => void;
  onHome: () => void;
  onRefill: () => void;
}) {
  const [wait, setWait] = useState(() => msUntilHeart(heartsUpdatedAt));
  useEffect(() => {
    const tick = () => setWait(msUntilHeart(heartsUpdatedAt));
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [heartsUpdatedAt]);

  return (
    <div className="m-auto flex w-full max-w-md flex-1 flex-col items-center justify-center text-center">
      <Mascot mood="sleep" size={180} />
      <h2 className="mt-2 text-[28px] font-extrabold leading-[34px]">Nyawa habis</h2>
      <p className="mt-2 max-w-xs text-base leading-6 text-muted">
        Baca kisah dulu — tidak memakai nyawa. Nyawa berikutnya sekitar {formatHeartWait(wait)}. Satu nyawa pulih tiap{" "}
        {HEART_MS / 60000} menit.
      </p>
      {explanation ? (
        <p className="mt-3 max-w-sm text-sm leading-5 text-muted">{explanation}</p>
      ) : (
        <p className="mt-3 text-sm leading-5 text-muted">Pelajaran: {lesson.title}</p>
      )}
      <div className="mt-6 flex w-full flex-col gap-3">
        <DuoButton variant="sky" wide onClick={onKisah}>
          Baca kisah
        </DuoButton>
        <DuoButton variant="white" wide onClick={onHome}>
          Kembali ke peta
        </DuoButton>
        <DuoButton wide disabled={!UNLIMITED_GEMS && gems < HEART_REFILL_COST} onClick={onRefill}>
          Pulihkan nyawa · {HEART_REFILL_COST} bintang
        </DuoButton>
      </div>
    </div>
  );
}

function CompleteCard({
  lesson,
  awarded,
  dailyHit,
  onHome,
  onNext,
}: {
  lesson: Lesson;
  awarded: { xp: number; gems: number; perfect: boolean };
  dailyHit: boolean;
  onHome: () => void;
  onNext: () => void;
}) {
  const next = firstIncompleteId(useProgress.getState().completed);
  const nextLesson = next ? getLesson(next) : null;
  return (
    <div className="flex flex-1 flex-col items-center justify-center text-center">
      <Mascot mood="celebrate" size={200} float />
      <h2 className="mt-2 text-3xl font-extrabold">Pelajaran selesai</h2>
      <p className="mt-1 font-medium text-muted">{lesson.title}</p>
      <p className="mt-5 text-sm font-medium text-muted">XP</p>
      <p className="text-2xl font-extrabold tabular-nums text-gold">+{awarded.xp}</p>
      <p className="mt-3 flex items-center justify-center gap-1 text-sm font-medium text-muted">
        <BlockStamp size={16} />
        Bintang
      </p>
      <p className="text-2xl font-extrabold tabular-nums text-gold">+{awarded.gems}</p>
      {awarded.perfect ? <p className="mt-4 text-sm font-bold text-primary">Sempurna — tanpa salah.</p> : null}
      {dailyHit ? <p className="mt-2 text-sm font-bold text-streak">Streak hari ini aman.</p> : null}
      <div className="mt-8 flex w-full flex-col gap-3">
        {nextLesson ? (
          <DuoButton wide onClick={onNext}>
            Pelajaran berikutnya
          </DuoButton>
        ) : null}
        <DuoButton variant={nextLesson ? "ghost" : "primary"} wide onClick={onHome}>
          Kembali ke peta
        </DuoButton>
      </div>
    </div>
  );
}
