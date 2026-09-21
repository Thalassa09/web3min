import { Check, X } from "@/lib/kicon";
import { useEffect, useMemo, useState } from "react";
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
  useEffect(() => {
    onHandle({ ready: true, isCorrect: () => true });
  }, [onHandle]);

  return (
    <article className="max-w-prose rounded-[24px] bg-[#FFF9ED] border-2 border-[#F0D9A8] shadow-[0_4px_0_#DFBA76] p-5 sm:p-7">
      <div className="flex items-center gap-2 mb-2">
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#FFE5A3] border border-[#DFBA76] text-xs font-extrabold text-[#7A4B00]">
          📖 BACA DULU
        </span>
      </div>
      <h3 className="font-display text-2xl font-bold leading-tight text-[#0D2340]">{exercise.title}</h3>
      <p className="mt-3.5 text-[16px] font-medium leading-[26px] text-[#1E3A5F]">{exercise.body}</p>
      {exercise.proofs && exercise.proofs.length > 0 ? <ProofGallery ids={exercise.proofs} className="mt-4" /> : null}
      {exercise.points && exercise.points.length > 0 ? (
        <ul className="mt-4 flex flex-col gap-3">
          {exercise.points.map((point) => (
            <li key={point} className="flex items-start gap-3 text-[15px] font-medium leading-[24px] text-[#1E3A5F]">
              <span className="mt-1.5 size-2.5 shrink-0 rounded-full bg-[#FFC61A] border border-[#D99400]" />
              <span>{point}</span>
            </li>
          ))}
        </ul>
      ) : null}
      {exercise.example ? (
        <div className="mt-5 rounded-2xl bg-white border-2 border-[#E4EDF7] p-4 shadow-[0_2px_0_#D3E2F2]">
          <p className="text-xs font-bold uppercase tracking-wider text-[#0B63F6]">Contoh Nyata</p>
          <p className="mt-1 text-[15px] font-medium leading-[24px] text-[#0D2340]">{exercise.example}</p>
        </div>
      ) : null}
      {exercise.remember ? (
        <div className="mt-4 rounded-2xl bg-[#E8FBF0] border-2 border-[#A3E5BA] p-4 shadow-[0_2px_0_#82D49D]">
          <p className="text-xs font-bold uppercase tracking-wider text-[#1E8A49]">💡 Kunci Ingatan</p>
          <p className="mt-1 text-[15px] font-bold leading-[24px] text-[#0E582B]">{exercise.remember}</p>
        </div>
      ) : null}
      {exercise.proofs && exercise.proofs.length > 0 ? (
        <p className="mt-4 text-xs leading-5 text-[#5A7796]">
          Sumber: dokumentasi publik dan kasus yang sudah terjadi. Diperbarui September 2026. Materi edukasi, bukan
          rekomendasi investasi.
        </p>
      ) : null}
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

  useEffect(() => {
    setSelected(null);
  }, [prompt]);

  useEffect(() => {
    onHandle({
      ready: selected !== null,
      isCorrect: () => selected === answer,
    });
  }, [selected, answer, onHandle]);

  const shown = blank
    ? prompt.replace("___", selected === null ? "____" : options[selected] ?? "____")
    : prompt;

  return (
    <div>
      <p className="text-xl font-black leading-snug lg:text-2xl">{shown}</p>
      <QuizClip ids={proofs} />
      <ul className="stagger-in mt-5 flex flex-col gap-3 lg:grid lg:grid-cols-2 lg:gap-3">
        {options.map((opt, i) => {
          const on = selected === i;
          const markOk = Boolean(reveal && i === answer);
          const markBad = Boolean(reveal && on && selected !== answer);
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

  useEffect(() => {
    setPicked(null);
    setMatched([]);
  }, [pairs]);

  useEffect(() => {
    const done = matched.length === pairs.length;
    onHandle({ ready: done, isCorrect: () => done });
    if (done) onAutoPass?.();
  }, [matched, pairs.length, onHandle, onAutoPass]);

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
      <div className={cn("mt-5 grid grid-cols-2 gap-3", shake && "shake-wrong")}>
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
  const bank0 = useMemo(() => shuffle(pieces.map((text, i) => ({ i, text }))), [pieces]);
  const [built, setBuilt] = useState<number[]>([]);

  useEffect(() => {
    setBuilt([]);
  }, [pieces]);

  useEffect(() => {
    onHandle({
      ready: built.length === pieces.length,
      isCorrect: () => built.map((i) => pieces[i]).join(" ") === answer.join(" "),
    });
  }, [built, pieces, answer, onHandle]);

  const used = new Set(built);
  const correct = built.map((i) => pieces[i]).join(" ") === answer.join(" ");

  return (
    <div>
      <p className="text-xl font-black leading-snug">{prompt}</p>
      <QuizClip ids={proofs} />
      <div className="mt-4 min-h-16 border-t border-dashed border-line pt-3">
        <div className="flex flex-wrap gap-2">
          {built.length === 0 ? (
            <span className="text-sm font-bold text-faint">Susun di sini</span>
          ) : (
            built.map((i, pos) => (
              <button
                key={`b-${i}`}
                type="button"
                disabled={disabled}
                onClick={() => setBuilt((b) => b.filter((_, x) => x !== pos))}
                className={cn(
                  "quiz-opt rounded-xl border-2 border-b-4 px-3 py-1.5 text-sm font-extrabold",
                  !reveal && "quiz-opt-on",
                  reveal && correct && "quiz-opt-ok",
                  reveal && !correct && "quiz-opt-bad",
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
