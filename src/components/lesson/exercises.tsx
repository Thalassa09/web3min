import { Check, X } from "@/lib/kicon";
import { useEffect, useMemo, useRef, useState } from "react";
import { Lightbulb, BookOpen, ArrowRight } from "lucide-react";
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
  const [tab, setTab] = useState<"materi" | "studi">("materi");

  useEffect(() => {
    onHandle({ ready: true, isCorrect: () => true });
  }, [onHandle]);

  const hasStudi = Boolean(exercise.example || exercise.remember);

  return (
    <article className="max-w-prose mx-auto rounded-[24px] bg-white border-3 border-choco-900 shadow-[0_6px_0_#3B2218] p-5 sm:p-7 mb-8">
      {hasStudi ? (
        <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-3">
          <button
            type="button"
            onClick={() => setTab("materi")}
            className={cn(
              "px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer",
              tab === "materi"
                ? "bg-choco-900 text-white border-2 border-choco-900 shadow-[0_2px_0_#3B2218]"
                : "text-choco-700 hover:text-choco-900 hover:bg-candy-50"
            )}
          >
            1. Inti & Arsitektur
          </button>
          <button
            type="button"
            onClick={() => setTab("studi")}
            className={cn(
              "px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer",
              tab === "studi"
                ? "bg-choco-900 text-white border-2 border-choco-900 shadow-[0_2px_0_#3B2218]"
                : "text-choco-700 hover:text-choco-900 hover:bg-candy-50"
            )}
          >
            2. Contoh Kasus & Kunci
          </button>
        </div>
      ) : null}

      {tab === "materi" ? (
        <>
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800">
              <BookOpen className="size-3.5 text-emerald-600" />
              <span>KONSEP KUNCI</span>
            </span>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
              <span className="size-6 shrink-0"><Mascot fill mood="think" /></span>
              <span>Catatan Blobi</span>
            </div>
          </div>

          <h3 className="font-display text-xl sm:text-2xl font-bold leading-tight text-choco-900">{exercise.title}</h3>
          <p className="mt-2.5 text-[15px] font-normal leading-[24px] text-slate-700">
            {exercise.body.replaceAll(" — ", ", ").replaceAll("—", ", ")}
          </p>

          {/* Visual Architectural Diagram: Web2 vs Web3 Network Topology */}
          <div className="my-4 rounded-xl bg-slate-50 border border-slate-200 p-3.5 sm:p-4">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2.5">
              Arsitektur Perbandingan
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {/* Web2 Centralized */}
              <div className="rounded-lg bg-white border border-slate-200 p-2.5 flex flex-col items-center text-center">
                <span className="text-[9px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                  Web2: Sentralistik
                </span>
                <div className="my-2 flex items-center justify-center gap-1.5 text-xs font-mono text-slate-600">
                  <span className="p-1 rounded bg-slate-100 border border-slate-200 text-[11px]">User</span>
                  <ArrowRight className="size-3 text-slate-400 shrink-0" />
                  <span className="p-1 rounded bg-rose-50 border border-rose-200 font-bold text-rose-800 text-[11px]">Server Korporat</span>
                </div>
                <p className="text-[10.5px] text-slate-500 leading-snug">
                  Data & saldo akunmu sepenuhnya dikendalikan satu server pusat.
                </p>
              </div>

              {/* Web3 Decentralized */}
              <div className="rounded-lg bg-emerald-50/50 border border-emerald-200 p-2.5 flex flex-col items-center text-center">
                <span className="text-[9px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-300">
                  Web3: Kedaulatan On-Chain
                </span>
                <div className="my-2 flex items-center justify-center gap-1.5 text-xs font-mono text-slate-600">
                  <span className="p-1 rounded bg-white border border-emerald-300 font-bold text-emerald-800 text-[11px]">Wallet</span>
                  <ArrowRight className="size-3 text-emerald-500 shrink-0" />
                  <span className="p-1 rounded bg-emerald-100 border border-emerald-300 font-bold text-emerald-900 text-[11px]">Smart Contract</span>
                </div>
                <p className="text-[10.5px] text-slate-600 leading-snug">
                  Kepemilikan diverifikasi kriptografi publik tanpa perantara.
                </p>
              </div>
            </div>
          </div>

          {hasStudi ? (
            <div className="mt-3 pt-2.5 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={() => setTab("studi")}
                className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer"
              >
                <span>Lihat Contoh Kasus & Poin Kunci</span>
                <ArrowRight className="size-3" />
              </button>
            </div>
          ) : null}
        </>
      ) : (
        <>
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800">
              <Lightbulb className="size-3.5 text-emerald-600" />
              <span>CONTOH KASUS & KUNCI</span>
            </span>
          </div>

          <h3 className="font-display text-xl sm:text-2xl font-bold leading-tight text-choco-900">
            Contoh Nyata & Kunci Ingatan
          </h3>

          {exercise.points && exercise.points.length > 0 ? (
            <ul className="mt-3 flex flex-col gap-2 bg-slate-50 border border-slate-200 rounded-xl p-3.5">
              {exercise.points.map((point) => (
                <li key={point} className="flex items-start gap-2 text-[13.5px] font-medium leading-[20px] text-slate-700">
                  <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-emerald-500" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          ) : null}

          {exercise.example ? (
            <div className="mt-3.5 rounded-xl bg-white border border-slate-200 p-4 shadow-xs">
              <p className="text-xs font-bold uppercase tracking-wider text-emerald-700">Contoh Nyata</p>
              <p className="mt-1.5 text-[14px] font-medium leading-[22px] text-slate-800">{exercise.example}</p>
            </div>
          ) : null}

          {exercise.remember ? (
            <div className="mt-3 rounded-xl bg-emerald-50/70 border border-emerald-200 p-4">
              <p className="text-xs font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
                <Lightbulb className="size-3.5 text-emerald-600" />
                <span>Kunci Ingatan</span>
              </p>
              <p className="mt-1 text-[14.5px] font-bold leading-[22px] text-emerald-950">{exercise.remember}</p>
            </div>
          ) : null}

          <p className="mt-3 text-[11px] leading-4 text-slate-400">
            Sumber: dokumentasi publik dan kasus on-chain terverifikasi. Diperbarui September 2026. Materi edukasi, bukan rekomendasi investasi.
          </p>

          <div className="mt-4 pt-3 border-t border-slate-100 flex justify-start">
            <button
              type="button"
              onClick={() => setTab("materi")}
              className="text-xs font-bold text-slate-600 hover:text-choco-900 flex items-center gap-1 cursor-pointer"
            >
              <span>← Kembali ke Materi Inti</span>
            </button>
          </div>
        </>
      )}
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
