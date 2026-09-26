import { Check, X } from "@/lib/kicon";
import { useEffect, useMemo, useRef, useState } from "react";
import { Lightbulb, BookOpen, ArrowRight, ChevronDown, Sparkles } from "lucide-react";
import { Mascot } from "@/components/mascot";
import type { Exercise, TipExercise } from "@/lib/curriculum";
import { cn, shuffle } from "@/lib/utils";
import { playTap } from "@/lib/audio";
import { useProgress } from "@/lib/store";
import { ProofGallery, QuizClip } from "@/components/proof-gallery";

export type CheckHandle = {
  ready: boolean;
  isCorrect: () => boolean;
};

type Props = {
  exercise: Exercise;
  disabled: boolean;
  reveal?: boolean;
  onHandle: (handle: CheckHandle) => void;
  onAutoPass?: () => void;
  onMismatch?: () => void;
};

export function ExerciseView({ exercise, disabled, reveal, onHandle, onAutoPass, onMismatch }: Props) {
  switch (exercise.type) {
    case "tip":
      return <TipCard exercise={exercise} onHandle={onHandle} />;
    case "choice":
    case "blank":
      return (
        <ChoiceList
          prompt={exercise.prompt}
          options={exercise.options}
          answer={exercise.answer}
          blank={exercise.type === "blank"}
          disabled={disabled}
          reveal={reveal}
          onHandle={onHandle}
          proofs={exercise.proofs}
        />
      );
    case "tf":
      return (
        <TrueFalse
          prompt={exercise.prompt}
          answer={exercise.answer}
          disabled={disabled}
          reveal={reveal}
          onHandle={onHandle}
          proofs={exercise.proofs}
        />
      );
    case "match":
      return (
        <MatchBoard
          prompt={exercise.prompt}
          pairs={exercise.pairs}
          disabled={disabled}
          onHandle={onHandle}
          onAutoPass={onAutoPass}
          onMismatch={onMismatch}
          proofs={exercise.proofs}
        />
      );
    case "order":
      return (
        <OrderBoard
          prompt={exercise.prompt}
          pieces={exercise.pieces}
          answer={exercise.answer}
          disabled={disabled}
          reveal={reveal}
          onHandle={onHandle}
          proofs={exercise.proofs}
        />
      );
    default:
      return null;
  }
}

function TipCard({ exercise, onHandle }: { exercise: TipExercise; onHandle: (h: CheckHandle) => void }) {
  const [openExample, setOpenExample] = useState(false);
  const [openRemember, setOpenRemember] = useState(false);

  useEffect(() => {
    onHandle({ ready: true, isCorrect: () => true });
  }, [onHandle]);

  return (
    <article className="max-w-prose mx-auto rounded-[24px] bg-white border-3 border-choco-900 shadow-[0_6px_0_#3B2218] p-5 sm:p-7 mb-8">
      {/* Header Badge & Mascot Note */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-ok-soft border-2 border-ok-ink text-xs font-bold text-ok-ink shadow-[0_2px_0_#0E7A46]">
          <BookOpen className="size-3.5" />
          <span>KONSEP KUNCI</span>
        </span>
        <div className="flex items-center gap-1.5 text-xs font-bold text-choco-600">
          <span className="size-6 shrink-0"><Mascot fill mood="think" size={24} /></span>
          <span>Catatan Blobi</span>
        </div>
      </div>

      <h3 className="font-display text-xl sm:text-2xl font-bold leading-tight text-choco-900 mb-2">
        {exercise.title}
      </h3>

      {/* Scannable Body */}
      <p className="text-[15px] font-normal leading-[24px] text-choco-700">
        {exercise.body.replaceAll(" — ", ", ").replaceAll("—", ", ")}
      </p>

      {/* Scannable Key Points (if present) */}
      {exercise.points && exercise.points.length > 0 ? (
        <ul className="mt-3.5 flex flex-col gap-2 bg-[#FFFDF8] border-2 border-choco-900/10 rounded-2xl p-3.5">
          {exercise.points.map((point) => (
            <li key={point} className="flex items-start gap-2.5 text-[13.5px] font-medium leading-[20px] text-choco-800">
              <span className="mt-1.5 size-2 shrink-0 rounded-full bg-candy-500 shadow-[0_1px_0_#B01F62]" />
              <span>{point}</span>
            </li>
          ))}
        </ul>
      ) : null}

      {/* Accordion 1: Contoh Kasus Nyata (Less is More) */}
      {exercise.example ? (
        <div className="mt-3.5 rounded-2xl border-2 border-choco-900/15 bg-cream/50 overflow-hidden transition-all">
          <button
            type="button"
            aria-expanded={openExample}
            onClick={() => setOpenExample((prev) => !prev)}
            className="w-full flex items-center justify-between p-3.5 text-left font-pixel text-xs sm:text-sm font-bold text-choco-900 hover:bg-cream active:bg-cream/80 transition-colors cursor-pointer select-none"
          >
            <span className="flex items-center gap-2">
              <Sparkles className="size-4 text-candy-600 shrink-0" />
              <span>Contoh Nyata di Lapangan</span>
            </span>
            <ChevronDown
              className={cn("size-4 text-choco-600 transition-transform duration-200", openExample && "rotate-180")}
            />
          </button>
          {openExample && (
            <div className="px-3.5 pb-3.5 pt-1 text-[13.5px] font-medium leading-[22px] text-choco-700 border-t border-choco-900/10 bg-white">
              {exercise.example}
            </div>
          )}
        </div>
      ) : null}

      {/* Accordion 2: Kunci Ingatan & Jebakan (Less is More) */}
      {exercise.remember ? (
        <div className="mt-3 rounded-2xl border-2 border-amber-500/40 bg-amber-50/60 overflow-hidden transition-all">
          <button
            type="button"
            aria-expanded={openRemember}
            onClick={() => setOpenRemember((prev) => !prev)}
            className="w-full flex items-center justify-between p-3.5 text-left font-pixel text-xs sm:text-sm font-bold text-amber-950 hover:bg-amber-100/50 transition-colors cursor-pointer select-none"
          >
            <span className="flex items-center gap-2">
              <Lightbulb className="size-4 text-amber-600 shrink-0" />
              <span>Kunci Ingatan & Jebakan</span>
            </span>
            <ChevronDown
              className={cn("size-4 text-amber-800 transition-transform duration-200", openRemember && "rotate-180")}
            />
          </button>
          {openRemember && (
            <div className="px-3.5 pb-3.5 pt-1 text-[13.5px] font-bold leading-[22px] text-amber-950 border-t border-amber-400/30 bg-amber-50/90">
              {exercise.remember}
            </div>
          )}
        </div>
      ) : null}

      {/* Galeri Bukti On-Chain (if present) */}
      {exercise.proofs && exercise.proofs.length > 0 ? (
        <div className="mt-4">
          <ProofGallery ids={exercise.proofs} />
        </div>
      ) : null}

      <p className="mt-4 pt-3 border-t border-choco-900/10 text-[11px] leading-4 text-choco-500">
        Sumber: dokumentasi publik dan kasus on-chain terverifikasi. Diperbarui September 2026. Materi edukasi, bukan rekomendasi investasi.
      </p>
    </article>
  );
}

function ChoiceList({
  prompt,
  options,
  answer,
  blank,
  disabled,
  reveal,
  onHandle,
  proofs,
}: {
  prompt: string;
  options: string[];
  answer: number;
  blank: boolean;
  disabled: boolean;
  reveal?: boolean;
  onHandle: (h: CheckHandle) => void;
  proofs?: string[];
}) {
  const [selected, setSelected] = useState<number | null>(null);

  // Shuffle options per prompt render, and remap the correct answer index
  const { shuffledOptions, mappedAnswer } = useMemo(() => {
    const indexed = options.map((opt, origIdx) => ({ opt, origIdx }));
    const shuffled = shuffle(indexed);
    const newAnswerIdx = shuffled.findIndex((item) => item.origIdx === answer);
    return {
      shuffledOptions: shuffled.map((item) => item.opt),
      mappedAnswer: newAnswerIdx >= 0 ? newAnswerIdx : answer,
    };
  }, [prompt, options, answer]);

  useEffect(() => {
    setSelected(null);
  }, [prompt]);

  useEffect(() => {
    onHandle({
      ready: selected !== null,
      isCorrect: () => selected === mappedAnswer,
    });
  }, [selected, mappedAnswer, onHandle]);

  const shown = blank
    ? prompt.replace("___", selected === null ? "____" : shuffledOptions[selected] ?? "____")
    : prompt;

  return (
    <div>
      <p className="text-xl font-black leading-snug lg:text-2xl">{shown}</p>
      <QuizClip ids={proofs} />
      <ul className="stagger-in mt-5 flex flex-col gap-3 lg:grid lg:grid-cols-2 lg:gap-3">
        {shuffledOptions.map((opt, i) => {
          const on = selected === i;
          const markOk = Boolean(reveal && i === mappedAnswer);
          const markBad = Boolean(reveal && on && selected !== mappedAnswer);
          return (
            <li key={opt}>
              <button
                type="button"
                disabled={disabled}
                onClick={() => {
                  if (useProgress.getState().sound) playTap();
                  setSelected(i);
                }}
                className={cn(
                  "quiz-opt flex w-full items-center gap-3 rounded-2xl border-2 border-b-4 px-3 py-3 text-left text-sm font-extrabold lg:min-h-16 lg:px-4 lg:py-4 lg:text-base",
                  "transition-[transform,border-color,background-color] duration-150",
                  "active:not-disabled:translate-y-0.5",
                  on && !reveal && "quiz-opt-on",
                  markOk && "quiz-opt-ok",
                  markBad && "quiz-opt-bad",
                )}
              >
                <span className="quiz-key">{String.fromCharCode(65 + i)}</span>
                <span className="min-w-0 flex-1">{opt}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function TrueFalse({
  prompt,
  answer,
  disabled,
  reveal,
  onHandle,
  proofs,
}: {
  prompt: string;
  answer: boolean;
  disabled: boolean;
  reveal?: boolean;
  onHandle: (h: CheckHandle) => void;
  proofs?: string[];
}) {
  const [selected, setSelected] = useState<boolean | null>(null);

  useEffect(() => {
    setSelected(null);
  }, [prompt]);

  useEffect(() => {
    onHandle({
      ready: selected !== null,
      isCorrect: () => selected === answer,
    });
  }, [selected, answer, onHandle]);

  return (
    <div>
      <p className="text-xl font-black leading-snug lg:text-2xl">{prompt}</p>
      <QuizClip ids={proofs} />
      <div className="stagger-in mt-6 grid grid-cols-2 gap-3 lg:max-w-xl">
        {[
          { v: true, label: "Benar", Icon: Check },
          { v: false, label: "Salah", Icon: X },
        ].map((opt) => {
          const on = selected === opt.v;
          const markOk = Boolean(reveal && opt.v === answer);
          const markBad = Boolean(reveal && on && selected !== answer);
          return (
            <button
              key={String(opt.v)}
              type="button"
              disabled={disabled}
              onClick={() => {
                if (useProgress.getState().sound) playTap();
                setSelected(opt.v);
              }}
              className={cn(
                "quiz-opt flex items-center justify-center gap-2 rounded-2xl border-2 border-b-4 py-4 text-base font-extrabold",
                on && !reveal && "quiz-opt-on",
                markOk && "quiz-opt-ok",
                markBad && "quiz-opt-bad",
              )}
            >
              <span className="quiz-key">
                <opt.Icon className="size-4" weight="bold" />
              </span>
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function MatchBoard({
  prompt,
  pairs,
  disabled,
  onHandle,
  onAutoPass,
  onMismatch,
  proofs,
}: {
  prompt: string;
  pairs: { left: string; right: string }[];
  disabled: boolean;
  onHandle: (h: CheckHandle) => void;
  onAutoPass?: () => void;
  onMismatch?: () => void;
  proofs?: string[];
}) {
  const left = useMemo(() => shuffle(pairs.map((p, i) => ({ i, text: p.left }))), [pairs]);
  const right = useMemo(() => shuffle(pairs.map((p, i) => ({ i, text: p.right }))), [pairs]);
  const [picked, setPicked] = useState<number | null>(null);
  const [matched, setMatched] = useState<number[]>([]);
  const [shake, setShake] = useState(false);
  const onAutoPassRef = useRef(onAutoPass);
  onAutoPassRef.current = onAutoPass;
  const passedRef = useRef(false);

  useEffect(() => {
    setPicked(null);
    setMatched([]);
    passedRef.current = false;
  }, [pairs]);

  useEffect(() => {
    const done = matched.length === pairs.length && pairs.length > 0;
    onHandle({ ready: done, isCorrect: () => done });
    if (done && !passedRef.current) {
      passedRef.current = true;
      onAutoPassRef.current?.();
    }
  }, [matched.length, pairs.length, onHandle]);

  function tapLeft(i: number) {
    if (disabled || matched.includes(i)) return;
    if (useProgress.getState().sound) playTap();
    setPicked(i);
  }

  function tapRight(i: number) {
    if (disabled || matched.includes(i) || picked === null) return;
    if (useProgress.getState().sound) playTap();
    if (picked === i) {
      setMatched((m) => [...m, i]);
      setPicked(null);
    } else {
      setShake(true);
      window.setTimeout(() => setShake(false), 280);
      setPicked(null);
      onMismatch?.();
    }
  }

  return (
    <div>
      <p className="text-xl font-black leading-snug">{prompt}</p>
      <QuizClip ids={proofs} />
      <div className={cn("mt-5 grid grid-cols-2 gap-3", shake && "wrong-shake")}>
        <ul className="flex flex-col gap-2">
          {left.map((item) => (
            <li key={`l-${item.i}`}>
              <button
                type="button"
                disabled={disabled || matched.includes(item.i)}
                onClick={() => tapLeft(item.i)}
                className={cn(
                  "quiz-opt w-full rounded-xl border-2 border-b-4 px-3 py-3 text-left text-sm font-extrabold",
                  matched.includes(item.i) && "quiz-opt-ok",
                  picked === item.i && !matched.includes(item.i) && "quiz-opt-on",
                )}
              >
                {item.text}
              </button>
            </li>
          ))}
        </ul>
        <ul className="flex flex-col gap-2">
          {right.map((item) => (
            <li key={`r-${item.i}`}>
              <button
                type="button"
                disabled={disabled || matched.includes(item.i)}
                onClick={() => tapRight(item.i)}
                className={cn(
                  "quiz-opt w-full rounded-xl border-2 border-b-4 px-3 py-3 text-left text-sm font-extrabold",
                  matched.includes(item.i) && "quiz-opt-ok",
                )}
              >
                {item.text}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function OrderBoard({
  prompt,
  pieces,
  answer,
  disabled,
  reveal,
  onHandle,
  proofs,
}: {
  prompt: string;
  pieces: string[];
  answer: string[];
  disabled: boolean;
  reveal?: boolean;
  onHandle: (h: CheckHandle) => void;
  proofs?: string[];
}) {
  const bank0 = useMemo(() => {
    const items = pieces.map((text, i) => ({ i, text }));
    if (items.length <= 1) return items;
    let shuffled = shuffle(items);
    let tries = 0;
    while (tries < 10 && shuffled.every((item, idx) => item.i === idx)) {
      shuffled = shuffle(items);
      tries++;
    }
    return shuffled;
  }, [pieces]);
  const [built, setBuilt] = useState<number[]>([]);

  useEffect(() => {
    setBuilt([]);
  }, [pieces]);

  const isExact =
    built.length === answer.length &&
    built.every((pieceIdx, idx) => pieces[pieceIdx] === answer[idx]);

  useEffect(() => {
    onHandle({
      ready: built.length === pieces.length,
      isCorrect: () => isExact,
    });
  }, [built.length, pieces.length, isExact, onHandle]);

  const used = new Set(built);

  return (
    <div>
      <p className="text-xl font-black leading-snug">{prompt}</p>
      <QuizClip ids={proofs} />
      <div className="mt-4 min-h-16 border-t-2 border-dashed border-line-strong pt-3">
        <div className="flex flex-wrap gap-2">
          {built.length === 0 ? (
            <span className="text-sm font-bold text-ink-300">Susun di sini</span>
          ) : (
            built.map((i, pos) => (
              <button
                key={`b-${i}-${pos}`}
                type="button"
                disabled={disabled}
                onClick={() => setBuilt((b) => b.filter((_, x) => x !== pos))}
                className={cn(
                  "quiz-opt rounded-xl border-2 border-b-4 px-3 py-1.5 text-sm font-extrabold",
                  !reveal && "quiz-opt-on",
                  reveal && isExact && "quiz-opt-ok",
                  reveal && !isExact && "quiz-opt-bad",
                )}
              >
                {pieces[i]}
              </button>
            ))
          )}
        </div>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {bank0.map((item) =>
          used.has(item.i) ? (
            <span key={item.i} className="rounded-xl px-3 py-1.5 text-sm font-extrabold text-transparent">
              {item.text}
            </span>
          ) : (
            <button
              key={item.i}
              type="button"
              disabled={disabled}
              onClick={() => {
                if (useProgress.getState().sound) playTap();
                setBuilt((b) => [...b, item.i]);
              }}
              className="quiz-opt rounded-xl border-2 border-b-4 px-3 py-1.5 text-sm font-extrabold"
            >
              {item.text}
            </button>
          ),
        )}
      </div>
    </div>
  );
}
