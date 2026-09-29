import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Heart, X, Check } from "@/lib/kicon";
import type { Exercise, Lesson, Unit } from "@/lib/curriculum";
import { firstPlayableId, getLesson, getUnit, sequentialNodes } from "@/lib/curriculum";
import { worldOf } from "@/lib/worlds";
import { formatHeartWait, HEART_MS, msUntilHeart, useProgress } from "@/lib/store";
import { DuoButton } from "@/components/duo-button";
import { Mascot, SpeechBubble } from "@/components/mascot";
import { BlockStamp, RouteChain } from "@/components/motif";
import { ProgressBar } from "@/components/ui/progress-bar";
import { ExerciseView, type CheckHandle } from "@/components/lesson/exercises";
import { HEART_REFILL_COST } from "@/lib/shop";
import { playComplete, playCorrect, playHeart, playWrong } from "@/lib/audio";
import { cn } from "@/lib/utils";
import { Dialog } from "@/components/dialog";
import { rpcCompleteLesson, syncProgressFromServer } from "@/lib/server-sync";
import {
  advance,
  isSessionComplete,
  lessonTarget,
  makeSeed,
  markCorrect,
  markWrong,
  planQueue,
  type QuizSession,
} from "@/lib/quiz-ops";
import { ROUTE_EXAM_SIZE, isRouteExamId } from "@/lib/route-exam";
import {
  clearSession,
  forgetWrong,
  loadSession,
  noteQuizCompleted,
  rememberWrong,
  saveSession,
  startSession,
  wrongIdsOf,
} from "@/lib/quiz-session-store";

type Phase = "ask" | "feedback" | "done" | "dead";

const WRONG_LINES = ["Pelan-pelan, kita bedah.", "Hampir. Coba liat lagi.", "Oke, simpan dulu. Nanti ketemu lagi."];
const RIGHT_LINES = ["Mantap.", "Nah, bener.", "Nangkep."];
const REVIEW_LOOKBACK = 3;

/**
 * Rencana kuis untuk satu blok: urutan soal, soal review, dan seed sesi.
 *
 * Dipisah dari komponen karena butuh baca localStorage (`wrongIdsOf`), dan
 * sengaja dijalankan sekali lewat `useMemo` supaya susunan soal tidak berubah
 * tiap render.
 *
 * Soal review diambil dari blok BEBERAPA langkah sebelumnya yang pernah salah
 * dan masih ada di kurikulum. Kalau datanya tidak ada, review dilewati.
 */
function buildQuizPlan(lesson: Lesson, unitIndex: number, unit: Unit | undefined) {
  // Ujian Rute menyampel 15 soal dari SELURUH bank rute, bukan dari satu blok.
  // Bank penuh ini juga jadi peta `resolve`, supaya sesi ujian yang tersimpan
  // tetap bisa dilanjutkan walau soal yang tampil sudah berbeda urutan.
  const exam = isRouteExamId(lesson.id);
  const source = exam && unit ? unit.lessons.filter((l) => l.kind !== "chest").flatMap((l) => l.exercises) : lesson.exercises;
  const scored = source.filter((ex) => ex.type !== "tip");
  const pool = scored.map((ex) => ({ id: ex.id, type: ex.type }));
  const target = exam ? ROUTE_EXAM_SIZE : lessonTarget(unitIndex, lesson.kind);

  // Peta id soal -> soal + pemiliknya. Soal review berasal dari blok lain, jadi
  // `pending` tidak bisa lagi mengandalkan `lesson.exercises` saja.
  const resolve = new Map<string, { ex: Exercise; ownerId: string }>();
  for (const ex of scored) resolve.set(ex.id, { ex, ownerId: lesson.id });

  const reviewItems: { id: string; type: string }[] = [];
  if (lesson.kind !== "checkpoint" && !isRouteExamId(lesson.id)) {
    const seq = sequentialNodes();
    const at = seq.findIndex((node) => node.id === lesson.id);
    const lookback = at > 0 ? seq.slice(Math.max(0, at - REVIEW_LOOKBACK), at) : [];
    for (const prev of lookback) {
      for (const wrongId of wrongIdsOf(prev.id)) {
        if (resolve.has(wrongId)) continue;
        const found = prev.exercises.find((ex) => ex.id === wrongId && ex.type !== "tip");
        if (!found) continue;
        resolve.set(found.id, { ex: found, ownerId: prev.id });
        reviewItems.push({ id: found.id, type: found.type });
      }
    }
  }

  const seed = makeSeed(Date.now(), Math.floor(Math.random() * 0xffff));
  const plan = planQueue(pool, target, reviewItems, seed);
  // Total = soal bernilai yang benar-benar tampil di sesi ini (termasuk review),
  // BUKAN jumlah soal di blok: kalau bank blok lebih kecil dari target, sesi
  // lebih pendek dan progres harus ikut menyesuaikan.
  const sessionTotal = new Set(plan.ids.filter((id) => resolve.get(id)?.ex.type !== "tip")).size;
  return { plan, seed, sessionTotal, resolve };
}

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

  const unit = useMemo(() => getUnit(lesson.unitId), [lesson.unitId]);
  const unitIndex = unit?.index ?? 1;
  const quiz = useMemo(() => buildQuizPlan(lesson, unitIndex, unit), [lesson, unitIndex, unit]);
  const [session, setSession] = useState<QuizSession | null>(null);
  const [phase, setPhase] = useState<Phase>(() => (useProgress.getState().hearts <= 0 ? "dead" : "ask"));
  const [ok, setOk] = useState(false);
  const [ready, setReady] = useState(false);
  const [awarded, setAwarded] = useState<{ xp: number; gems: number; perfect: boolean; replay: boolean } | null>(null);
  const handleRef = useRef<CheckHandle>({ ready: false, isCorrect: () => false });
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const matchHadMistakeRef = useRef(false);
  // Apakah soal yang baru dijawab salah ini masuk antrean ulang? Dipakai untuk
  // memilih teks feedback yang jujur: salah kedua tidak mengulang lagi.
  const [requeuedNow, setRequeuedNow] = useState(false);

  // Buat sesi baru atau lanjutkan sesi tersimpan. Dijalankan sekali per blok;
  // membaca localStorage tidak boleh terjadi saat render (SSR-safe).
  useEffect(() => {
    const validIds = new Set(quiz.resolve.keys());
    const resumed = loadSession(lesson.id, validIds);
    if (resumed && isSessionComplete(resumed)) clearSession();
    const fresh = resumed && !isSessionComplete(resumed) ? resumed : null;
    const next = fresh ?? startSession(lesson.id, quiz.plan.ids, quiz.plan.review, quiz.sessionTotal, quiz.seed);
    setSession(next);
    setReady(false);
    setOk(false);
    setPhase(useProgress.getState().hearts <= 0 ? "dead" : "ask");
  }, [lesson.id, quiz]);

  // Simpan tiap perubahan supaya keluar aplikasi (atau HP mati) tidak
  // menghilangkan posisi. Isinya id soal + posisi saja, tanpa XP/koin.
  useEffect(() => {
    if (session) saveSession(session);
  }, [session]);

  const current = session ? quiz.resolve.get(session.queue[session.index] ?? "") : undefined;
  const exercise = current?.ex;
  const solved = session?.solved.length ?? 0;
  const mistakes = session?.wrong.length ?? 0;

  const onHandle = useCallback((h: CheckHandle) => {
    handleRef.current = h;
    setReady(h.ready);
  }, []);

  // Ujian Rute itu latihan opsional: tidak memberi XP/koin dan tidak menulis
  // `completions`, jadi aturan ekonomi tidak berubah sama sekali.
  const isExam = isRouteExamId(lesson.id);

  const finish = useCallback(
    (perfect: boolean) => {
      clearSession();
      if (isExam) {
        setAwarded({ xp: 0, gems: 0, perfect, replay: false });
        setPhase("done");
        if (sound) playComplete();
        return;
      }
      const res = completeLesson(lesson.id, { perfect });
      setAwarded(res);
      setPhase("done");
      if (sound) playComplete();
      noteQuizCompleted({
        lessonId: lesson.id,
        quizLength: quiz.sessionTotal,
        completed: true,
        dropAtIndex: null,
      });
      void rpcCompleteLesson(lesson.id, perfect).then((ok) => {
        if (ok) void syncProgressFromServer();
      });
    },
    [completeLesson, lesson.id, sound, isExam, quiz.sessionTotal],
  );

  // Hydration sync: ensure 0 hearts immediately drops to dead state
  useEffect(() => {
    if (phase === "ask" && hearts <= 0) {
      setPhase("dead");
    }
  }, [hearts, phase]);

  // Nyawa pulih (regen otomatis tiap HEART_MS lewat tick store, atau isi ulang koin)
  // -> lanjutkan sesi. Sesi tersimpan, jadi user kembali ke soal yang sama.
  useEffect(() => {
    if (phase === "dead" && hearts > 0) {
      setPhase("ask");
      setReady(false);
    }
  }, [hearts, phase]);

  const goNext = useCallback(() => {
    matchHadMistakeRef.current = false;
    if (!session) return;
    const nextIndex = session.index + 1;
    if (nextIndex >= session.queue.length || isSessionComplete(session)) {
      finish(session.wrong.length === 0);
      return;
    }
    setSession(advance(session, Date.now()));
    setPhase("ask");
    setReady(false);
    setOk(false);
    setRequeuedNow(false);
  }, [session, finish]);

  const check = useCallback(() => {
    if (phase !== "ask" || !exercise || !session) return;
    if (exercise.type === "tip") {
      goNext();
      return;
    }
    const correct = handleRef.current.isCorrect();
    setOk(correct);
    setPhase("feedback");
    if (correct) {
      setSession(markCorrect(session, exercise.id, Date.now()));
      if (current && current.ownerId !== lesson.id) forgetWrong(current.ownerId, exercise.id);
      if (sound) playCorrect();
    } else {
      const res = markWrong(session, exercise.id, Date.now());
      setSession(res.session);
      setRequeuedNow(res.requeued);
      // Nyawa hanya berkurang pada kesalahan PERTAMA per soal.
      if (res.spentHeart) {
        loseHeart();
        if (sound) playHeart();
      }
      if (current) rememberWrong(current.ownerId, exercise.id);
      if (sound) playWrong();
      // Note: Do NOT immediately jump to "dead" here, so the user can read the feedback
      // explanation. When they tap "Coba Lagi Nanti", continueAfterFeedback() will transition to "dead".
    }
  }, [phase, exercise, session, current, lesson.id, goNext, sound, loseHeart]);

  const continueAfterFeedback = useCallback(() => {
    if (useProgress.getState().hearts <= 0) {
      setPhase("dead");
      return;
    }
    goNext();
  }, [goNext]);

  const lastKeyTimeRef = useRef(0);

  // Keyboard shortcut: Press Enter to check answer or continue
  // Exclude input, textarea, AND button so keyboard Tab + Enter navigation works naturally
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        e.target instanceof HTMLButtonElement
      ) {
        return;
      }
      if (e.key === "Enter") {
        if (e.repeat) return;
        const now = Date.now();
        if (now - lastKeyTimeRef.current < 280) {
          e.preventDefault();
          return;
        }
        lastKeyTimeRef.current = now;
        e.preventDefault();
        e.stopPropagation();
        if (phase === "feedback") {
          continueAfterFeedback();
        } else if (phase === "ask" && ready) {
          check();
        }
      }
    }
    window.addEventListener("keydown", onKeyDown, true);
    return () => window.removeEventListener("keydown", onKeyDown, true);
  }, [phase, ready, check, continueAfterFeedback]);

  const autoPass = useCallback(() => {
    if (phase !== "ask" || !session) return;
    const hadMistake = matchHadMistakeRef.current;
    setOk(!hadMistake);
    setPhase("feedback");
    if (!hadMistake) {
      if (exercise) setSession(markCorrect(session, exercise.id, Date.now()));
      if (sound) playCorrect();
    } else {
      if (sound) playWrong();
    }
  }, [phase, sound, session, exercise]);

  const mismatch = useCallback(() => {
    if (sound) playWrong();
    if (!matchHadMistakeRef.current && session && exercise) {
      matchHadMistakeRef.current = true;
      const res = markWrong(session, exercise.id, Date.now());
      setSession(res.session);
      setRequeuedNow(res.requeued);
      // Nyawa hanya berkurang pada kesalahan pertama per soal; soal juga hanya
      // diulang sekali di akhir antrean.
      if (res.spentHeart) {
        loseHeart();
        if (sound) playHeart();
      }
      if (current) rememberWrong(current.ownerId, exercise.id);
    }
  }, [loseHeart, sound, session, exercise, current]);

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
    <div className={cn("quiz-shell relative mx-auto flex h-dvh max-h-dvh w-full max-w-lg flex-col overflow-hidden bg-cream lg:max-w-none", world.skin)}>
      <div className="shrink-0 flex items-center gap-3 px-3 py-2 min-h-11 bg-white border-b-2 border-choco-900 shadow-[0_3px_0_#3B2218] lg:px-8">
        <button
          type="button"
          aria-label="Keluar"
          className="grid size-10 place-items-center rounded-xl text-choco-700 hover:text-choco-900 hover:bg-candy-50 transition-colors cursor-pointer"
          onClick={() => {
            const untouched = (session?.index ?? 0) === 0 && mistakes === 0 && solved === 0;
            if (phase === "done" || phase === "dead" || untouched) {
              void navigate({ to: "/" });
            } else {
              setShowExitConfirm(true);
            }
          }}
        >
          <X className="size-6" weight="bold" />
        </button>
        <div className="mx-1 flex min-w-0 flex-1 items-center">
          <ProgressBar value={solved} max={Math.max(1, session?.total ?? quiz.sessionTotal)} size="sm" />
        </div>
        <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-ruby-soft-bg border border-[#FCA5A5] text-xs font-extrabold tabular-nums text-ruby-shadow">
          <Heart className={cn("size-4 text-ruby", phase === "feedback" && !ok && "heart-break")} weight="fill" />
          {hearts}
        </span>
      </div>

      {lesson.unitId === "u2" || lesson.unitId === "u6" ? (
        <p className="mx-5 mt-2 text-xs leading-5 text-ink-500 lg:mx-8">
          web3min tidak akan pernah meminta seed phrase, private key, atau password dompetmu. Kamu tidak perlu
          menghubungkan wallet untuk belajar.
        </p>
      ) : lesson.unitId === "u5" || lesson.unitId === "u7" || lesson.unitId === "u15" ? (
        <p className="mx-5 mt-2 text-xs leading-5 text-ink-500 lg:mx-8">
          Materi ini bersifat edukatif, bukan saran keuangan.
        </p>
      ) : null}

      <div
        className={cn(
          "flex min-h-0 flex-1 flex-col overflow-y-auto px-5 pb-20 sm:pb-24 pt-4 lg:mx-auto lg:w-full lg:max-w-3xl lg:px-10 lg:pt-8 select-text",
          !isTip && phase !== "done" && phase !== "dead" && "lg:flex-row lg:items-start lg:gap-10 lg:pt-10 lg:max-w-6xl",
        )}
      >
        {phase !== "done" && phase !== "dead" && exercise ? (
          <>
            {!isTip ? (
              <div
                className={cn(
                  "mb-4 flex items-start gap-3",
                  "lg:mb-0 lg:w-56 lg:shrink-0 lg:flex-col lg:items-center lg:pt-1",
                )}
              >
                <div className="cursor-pointer pointer-events-auto select-none size-[88px] shrink-0 lg:size-[160px]">
                  <Mascot fill mood={mood} interactive />
                </div>
                {blobiLine || phase === "feedback" ? (
                  <SpeechBubble className="mt-2 max-w-sm sm:max-w-md lg:mt-4 lg:w-full" tail="left">
                    {blobiLine ?? (phase === "ask" ? "Ada kuis muncul!" : ok ? "Mantap." : "Belum pas.")}
                  </SpeechBubble>
                ) : null}
              </div>
            ) : null}
            <div
              key={`${exercise.id}-${session?.index ?? 0}`}
              className={cn(
                "min-w-0 flex-1 pb-6 sm:pb-8 enter-up select-text",
                phase === "feedback" && !ok && "wrong-shake",
                isTip && "lg:mx-auto lg:max-w-3xl",
              )}
            >
              <ExerciseView
                key={`${exercise.id}-${session?.index ?? 0}`}
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
                const next = firstPlayableId(useProgress.getState().completed);
                if (next) void navigate({ to: "/lesson/$lessonId", params: { lessonId: next } });
                else void navigate({ to: "/" });
              }}
            />
          </div>
        ) : null}

        {phase === "dead" ? (
          <DeadState
            lesson={lesson}
            explanation={exercise && "explanation" in exercise && exercise.explanation ? exercise.explanation : null}
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
        <div className="shrink-0 z-30 bg-white/95 backdrop-blur-md border-t-2 border-choco-900 px-5 py-3.5 pb-[max(1rem,env(safe-area-inset-bottom))] shadow-[0_-3px_0_#3B2218] lg:px-8">
          <div className="mx-auto w-full max-w-3xl flex items-center justify-between gap-4">
            <p className="text-xs font-semibold text-choco-600">
              {exercise.type === "tip"
                ? "Pahami konsep intinya sebelum lanjut ke kuis"
                : exercise.type === "match"
                  ? "Ketuk dua kartu yang saling berhubungan"
                  : exercise.type === "order"
                    ? "Ketuk kartu kata untuk menyusun kalimat yang benar"
                    : exercise.type === "tf"
                      ? "Tentukan apakah pernyataan ini Benar atau Salah"
                      : "Pilih satu jawaban yang paling tepat"}
            </p>
            {exercise.type === "match" ? (
              <div className="ml-auto flex items-center gap-2">
                <span className="px-4 py-2 rounded-full bg-leaf-soft border border-leaf-line text-leaf-shadow text-xs font-bold shadow-xs">
                  Pasangkan Semua Kartu
                </span>
              </div>
            ) : (
              <DuoButton
                wide
                variant="primary"
                className="w-full sm:w-auto sm:min-w-[200px] ml-auto"
                disabled={!ready}
                onClick={check}
              >
                {isTip ? "Sudah Paham, Lanjut" : "Periksa Jawaban"}
              </DuoButton>
            )}
          </div>
        </div>
      ) : null}

      {phase === "feedback" ? (
        <div className={cn("shrink-0 quiz-fb", ok ? "quiz-fb-ok" : "quiz-fb-bad")} role="status" aria-live="polite">
          <div className="mx-auto flex w-full max-w-3xl flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="min-w-0 flex-1">
              <p className={cn("font-display text-xl font-bold flex items-center gap-2", ok ? "text-leaf-shadow" : "text-ruby-shadow")}>
                {ok ? (
                  <>
                    <Check className="size-6 text-leaf-shadow" weight="bold" />
                    <span>Jawaban Benar!</span>
                  </>
                ) : (
                  <>
                    <X className="size-6 text-ruby" weight="bold" />
                    <span>Belum Pas</span>
                  </>
                )}
              </p>
              {exercise && exercise.type !== "tip" && exercise.type !== "match" ? (
                <p className="mt-1 text-sm font-medium leading-relaxed text-ink-700">{exercise.explanation}</p>
              ) : null}
              {exercise?.type === "match" ? (
                <div>
                  <p className="mt-1 text-sm font-medium leading-relaxed text-ink-700">
                    {exercise.explanation || "Semua kartu berhasil disambungkan."}
                  </p>
                  {requeuedNow ? (
                    <p className="mt-1 text-xs font-semibold text-ruby-deep">
                      Ada sambungan yang belum tepat. Soal ini akan diulang sekali di akhir sesi.
                    </p>
                  ) : null}
                </div>
              ) : null}
              {!ok && exercise?.type !== "match" ? (
                <p className="mt-1 text-xs font-semibold text-ruby-deep">
                  {requeuedNow
                    ? "Soal ini akan diulang sekali di akhir sesi."
                    : "Soal ini tidak diulang lagi, dan nyawamu tidak berkurang untuk soal yang sama."}
                </p>
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

      <Dialog
        open={showExitConfirm}
        title="Yakin Mau Keluar?"
        description="Progres sesi ini tersimpan, jadi kamu bisa lanjut dari soal yang sama nanti. Nyawa yang telah terpakai tidak dapat dikembalikan."
        onClose={() => setShowExitConfirm(false)}
      >
        <div className="mt-5 flex flex-col gap-2.5 sm:flex-row-reverse sm:justify-end">
          <DuoButton
            variant="primary"
            onClick={() => setShowExitConfirm(false)}
          >
            Lanjut Belajar
          </DuoButton>
          <DuoButton
            variant="ghost"
            onClick={() => {
              setShowExitConfirm(false);
              // Posisi berhenti dilaporkan HANYA untuk sesi yang belum tuntas,
              // dan hanya berupa angka indeks (tanpa jawaban atau identitas).
              if (session && !isExam && !isSessionComplete(session)) {
                noteQuizCompleted({
                  lessonId: lesson.id,
                  quizLength: session.total,
                  completed: false,
                  dropAtIndex: session.index,
                });
              }
              void navigate({ to: "/" });
            }}
          >
            Keluar Sesi
          </DuoButton>
        </div>
      </Dialog>
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
        Baca kisah dulu tanpa mengurangi nyawa. Nyawa berikutnya sekitar {formatHeartWait(wait)}. Satu nyawa pulih tiap{" "}
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
        <DuoButton wide disabled={gems < HEART_REFILL_COST} onClick={onRefill}>
          Pulihkan nyawa · {HEART_REFILL_COST} koin
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
  awarded: { xp: number; gems: number; perfect: boolean; replay: boolean };
  dailyHit: boolean;
  onHome: () => void;
  onNext: () => void;
}) {
  const next = firstPlayableId(useProgress.getState().completed);
  const nextLesson = next ? getLesson(next) : null;
  // Ujian Rute adalah latihan opsional: tidak ada XP/koin untuk ditampilkan,
  // dan tombol "Pelajaran berikutnya" tidak relevan karena bloknya sudah lewat.
  const exam = isRouteExamId(lesson.id);
  return (
    <div className="flex flex-1 flex-col items-center justify-center text-center">
      <Mascot mood="celebrate" size={200} float />
      <h2 className="mt-2 text-3xl font-extrabold text-ink-900">
        {exam ? "Ujian rute selesai" : "Pelajaran selesai"}
      </h2>
      <p className="mt-1 font-medium text-ink-500">{lesson.title}</p>
      {exam ? (
        <div className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-choco-900 bg-candy-100 px-3.5 py-1 text-xs font-bold text-candy-700">
          <span>Latihan opsional, tanpa XP dan tanpa koin</span>
        </div>
      ) : null}
      {awarded.replay ? (
        <div className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-choco-900 bg-candy-100 px-3.5 py-1 text-xs font-bold text-candy-700">
          <span>Pengulangan materi, hadiah disesuaikan</span>
        </div>
      ) : null}
      {!exam ? (
        <>
          <p className="mt-5 text-sm font-bold text-ink-500">XP</p>
          <p className="text-2xl font-extrabold tabular-nums text-warn-ink-soft">+{awarded.xp}</p>
          <p className="mt-3 flex items-center justify-center gap-1 text-sm font-bold text-ink-500">
            <BlockStamp size={16} />
            Koin
          </p>
          <p className="text-2xl font-extrabold tabular-nums text-warn-ink-soft">+{awarded.gems}</p>
        </>
      ) : null}
      {awarded.perfect ? (
        <div className="perfect-confetti mt-4 text-sm font-bold text-leaf-shadow" aria-hidden="true">
          <i /><i /><i /><i /><i /><i /><i /><i /><i /><i />
          Sempurna tanpa ada kesalahan.
        </div>
      ) : null}
      {dailyHit && !exam ? <p className="mt-2 text-sm font-bold text-flame">Streak hari ini aman.</p> : null}
      <div className="mt-8 flex w-full flex-col gap-3">
        {nextLesson && !exam ? (
          <DuoButton wide onClick={onNext}>
            Pelajaran berikutnya
          </DuoButton>
        ) : null}
        <DuoButton variant={nextLesson && !exam ? "ghost" : "primary"} wide onClick={onHome}>
          Kembali ke peta
        </DuoButton>
      </div>
    </div>
  );
}
