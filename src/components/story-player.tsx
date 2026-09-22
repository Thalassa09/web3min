import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { X } from "@/lib/kicon";
import type { Speaker, Story, StoryBeat } from "@/lib/stories";
import { SPEAKER_LABEL } from "@/lib/stories";
import { proofsById, TONE_UI } from "@/lib/proof";
import { useProgress } from "@/lib/store";
import { playComplete } from "@/lib/audio";
import { cn } from "@/lib/utils";
import { DuoButton } from "@/components/duo-button";
import { Mascot, SpeechBubble, TypeLine, type MascotMood } from "@/components/mascot";
import { rpcCompleteStory, syncProgressFromServer } from "@/lib/server-sync";

const WHO_TONE: Record<Speaker, string> = {
  web3min: "text-primary",
  penipu: "text-danger",
  teman: "text-sky",
  cs: "text-streak",
  kamu: "text-fg",
};

export function StoryPlayer({ story }: { story: Story }) {
  const navigate = useNavigate();
  const sound = useProgress((s) => s.sound);
  const completeStory = useProgress((s) => s.completeStory);
  const [i, setI] = useState(0);
  const [typed, setTyped] = useState(false);
  const [pick, setPick] = useState<number | null>(null);
  const [done, setDone] = useState<{ xp: number; gems: number } | null>(null);

  const beat = story.beats[i];
  const last = i >= story.beats.length - 1;

  function finish() {
    const awarded = completeStory(story.id) ?? { xp: 0, gems: 0 };
    setDone(awarded);
    if (sound) playComplete();
    void rpcCompleteStory(story.id).then((ok) => {
      if (ok) void syncProgressFromServer();
    });
  }

  function advance() {
    if (beat?.type === "fork" && pick === null) return;
    if (!typed) {
      setTyped(true);
      return;
    }
    if (last) {
      finish();
      return;
    }
    setI((n) => n + 1);
    setTyped(false);
    setPick(null);
  }

  if (done) {
    return (
      <div className="mx-auto flex min-h-dvh w-full max-w-lg flex-col items-center justify-center bg-bg px-5 text-center lg:max-w-2xl">
        <Mascot mood="celebrate" size={180} float />
        <h1 className="mt-2 text-3xl font-black">Kisah selesai</h1>
        <p className="font-medium text-muted">{story.title}</p>
        <p className="mt-5 text-sm font-medium text-muted">XP</p>
        <p className="text-2xl font-extrabold tabular-nums text-gold">+{done.xp}</p>
        <p className="mt-3 text-sm font-medium text-muted">Bintang</p>
        <p className="text-2xl font-extrabold tabular-nums text-gold">+{done.gems}</p>
        <p className="mt-4 max-w-xs text-sm leading-5 text-muted">Tidak memakai nyawa. Ini cerita, bukan ujian.</p>
        <DuoButton wide className="mt-8" onClick={() => void navigate({ to: "/kisah" })}>
          Kisah lain
        </DuoButton>
      </div>
    );
  }

  if (!beat) return null;

  const line = beatText(beat, pick);
  const mood: MascotMood = beat.type === "talk" && beat.mood ? beat.mood : beat.type === "end" ? "proud" : "think";

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-lg flex-col bg-bg lg:max-w-2xl">
      <div className="flex items-center gap-3 px-3 pt-3">
        <button
          type="button"
          aria-label="Keluar"
          className="grid size-11 place-items-center text-faint"
          onClick={() => void navigate({ to: "/kisah" })}
        >
          <X className="size-7" weight="bold" />
        </button>
        <div className="h-4 flex-1 overflow-hidden rounded-full bg-line">
          <div
            className="h-full origin-left rounded-full bg-sky transition-transform duration-300"
            style={{ transform: `scaleX(${(i + (typed ? 1 : 0.4)) / story.beats.length})` }}
          />
        </div>
        <span className="pr-2 text-xs font-extrabold uppercase tracking-label text-muted">Kisah</span>
      </div>

      <div className="flex min-h-0 flex-1 flex-col">
        <div className="flex shrink-0 items-start gap-3 px-5 pb-2 pt-4">
          <Mascot mood={mood} size={88} />
          <div className="min-w-0 flex-1">
            {beat.type === "talk" || beat.type === "fork" ? (
              <p className={cn("mb-1 text-xs font-extrabold uppercase tracking-label", WHO_TONE[beatWho(beat)])}>
                {SPEAKER_LABEL[beatWho(beat)]}
              </p>
            ) : null}
            <SpeechBubble tail="left">
              <button type="button" className="w-full text-left" onClick={advance}>
                {typed ? line : <TypeLine text={line} onDone={() => setTyped(true)} />}
              </button>
            </SpeechBubble>
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-4 select-text">
          {beat.type === "proof" ? <StoryProof id={beat.proofId} /> : null}

          {beat.type === "fork" ? (
            <ul className="mt-4 flex flex-col gap-2">
              {beat.options.map((opt, idx) => {
                const chosen = pick === idx;
                const locked = pick !== null && !chosen;
                return (
                  <li key={opt.label}>
                    <button
                      type="button"
                      disabled={pick !== null}
                      onClick={() => {
                        setPick(idx);
                        setTyped(true);
                      }}
                      className={cn(
                        "w-full rounded-2xl border-2 border-b-4 px-4 py-3 text-left text-sm font-extrabold",
                        chosen ? (opt.good ? "border-unit-teal bg-sky-soft" : "border-danger bg-danger-soft") : "border-line bg-bg",
                        locked && "opacity-40",
                      )}
                    >
                      {opt.label}
                    </button>
                  </li>
                );
              })}
            </ul>
          ) : null}

          {beat.type === "end" ? (
            <p className="mt-4 rounded-2xl border-2 border-primary bg-primary-soft px-4 py-3 text-sm font-extrabold text-primary-deep">
              Ingat: {beat.remember}
            </p>
          ) : null}
        </div>
      </div>

      <div className="border-t border-line px-5 py-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
        <DuoButton wide disabled={beat.type === "fork" && pick === null} onClick={advance}>
          {last ? "Kelar" : "Lanjut"}
        </DuoButton>
      </div>
    </div>
  );
}

function beatWho(beat: StoryBeat): Speaker {
  if (beat.type === "talk") return beat.who;
  if (beat.type === "fork") return "kamu";
  return "web3min";
}

function beatText(beat: StoryBeat, pick: number | null): string {
  if (beat.type === "talk" || beat.type === "proof") return beat.text;
  if (beat.type === "end") return beat.text;
  if (pick === null) return beat.prompt;
  return beat.options[pick]?.reply ?? beat.prompt;
}

function StoryProof({ id }: { id: string }) {
  const proof = proofsById([id])[0];
  if (!proof) return null;
  const tone = TONE_UI[proof.tone];
  return (
    <figure className={cn("mt-5 overflow-hidden rounded-2xl border-2 border-b-4 bg-bg", tone.border)}>
      <img src={proof.src} alt="" className="h-40 w-full object-cover object-top" />
      <figcaption className="flex items-end justify-between gap-2 px-3 py-2">
        <div className="min-w-0">
          <p className={cn("text-[10px] font-extrabold uppercase tracking-label", tone.text)}>{tone.label}</p>
          <p className="text-sm font-extrabold leading-tight">{proof.value}</p>
        </div>
        <p className="max-w-[55%] truncate text-right text-xs font-bold text-muted">{proof.cap}</p>
      </figcaption>
    </figure>
  );
}
