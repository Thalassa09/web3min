import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { X } from "@/lib/kicon";
import type { CaseStudy } from "@/lib/stories";
import { caseProof } from "@/lib/stories";
import { TONE_UI } from "@/lib/proof";
import { useProgress } from "@/lib/store";
import { playComplete } from "@/lib/audio";
import { cn } from "@/lib/utils";
import { DuoButton } from "@/components/duo-button";
import { Mascot, SpeechBubble, TypeLine } from "@/components/mascot";
import { rpcCompleteCase, syncProgressFromServer } from "@/lib/server-sync";

export function CaseClinic({ study }: { study: CaseStudy }) {
  const navigate = useNavigate();
  const sound = useProgress((s) => s.sound);
  const completeCase = useProgress((s) => s.completeCase);
  const [i, setI] = useState(0);
  const [typed, setTyped] = useState(false);
  const [done, setDone] = useState<{ xp: number; gems: number } | null>(null);

  const proof = caseProof(study.proofId);
  const step = study.steps[i];
  const last = i >= study.steps.length - 1;
  const total = study.steps.length + 1;

  function finish() {
    const awarded = completeCase(study.id) ?? { xp: 0, gems: 0 };
    setDone(awarded);
    if (sound) playComplete();
    void rpcCompleteCase(study.id).then((ok) => {
      if (ok) void syncProgressFromServer();
    });
  }

  function advance() {
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
  }

  if (done) {
    return (
      <div className="mx-auto flex min-h-dvh max-w-lg flex-col items-center justify-center bg-cream px-5 text-center">
        <Mascot mood="proud" size={180} float />
        <h1 className="mt-2 text-3xl font-black">Bedah kelar</h1>
        <p className="font-bold text-muted">{study.title}</p>
        <p className="mt-4 max-w-xs rounded-2xl border-2 border-primary bg-primary-soft px-4 py-3 text-sm font-extrabold text-primary-deep">
          {study.remember}
        </p>
        <div className="mt-6 grid w-full grid-cols-2 gap-3">
          <div className="rounded-2xl border-2 border-line px-3 py-4">
            <p className="text-xs font-extrabold uppercase tracking-label text-muted">XP</p>
            <p className="text-2xl font-black tabular-nums text-gold">+{done.xp}</p>
          </div>
          <div className="rounded-2xl border-2 border-line px-3 py-4">
            <p className="text-xs font-extrabold uppercase tracking-label text-muted">Koin</p>
            <p className="text-2xl font-black tabular-nums text-gold">+{done.gems}</p>
          </div>
        </div>
        <DuoButton wide className="mt-8" onClick={() => void navigate({ to: "/kisah" })}>
          Bedah lagi
        </DuoButton>
      </div>
    );
  }

  if (!step) return null;
  const tone = proof ? TONE_UI[proof.tone] : TONE_UI.warn;

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-lg flex-col bg-cream lg:max-w-5xl">
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
            className="h-full origin-left rounded-full bg-streak transition-transform duration-300"
            style={{ transform: `scaleX(${(i + 1) / total})` }}
          />
        </div>
        <span className="pr-2 text-xs font-extrabold uppercase tracking-label text-muted">Bedah</span>
      </div>

      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-5 pb-4 pt-3 lg:grid lg:grid-cols-2 lg:items-start lg:gap-10 lg:px-8 lg:pt-6">
        {proof ? (
          <figure className={cn("overflow-hidden rounded-2xl border-2 border-b-4 bg-bg", tone.border)}>
            <img src={proof.src} alt="" className="h-56 w-full object-cover object-top lg:h-80" />
            <figcaption className="flex items-end justify-between gap-2 px-3 py-2">
              <div>
                <p className={cn("text-[10px] font-extrabold uppercase tracking-label", tone.text)}>{tone.label}</p>
                <p className="text-sm font-extrabold">{proof.value}</p>
              </div>
              <div className="max-w-[55%] text-right">
                <p className="truncate text-xs font-bold text-muted">{proof.via}</p>
                {proof.via?.toLowerCase().startsWith("x") && (
                  <p className="text-[9px] font-semibold text-choco-600/70 italic leading-tight truncate">
                    Unggahan publik, belum diverifikasi.
                  </p>
                )}
              </div>
            </figcaption>
          </figure>
        ) : null}

        <p className="mt-3 text-xs font-extrabold uppercase tracking-label text-streak">
          Langkah {i + 1} / {study.steps.length} · lihat
        </p>
        <p className="text-lg font-black leading-snug">{step.look}</p>

        <div className="mt-3 flex items-start gap-3">
          <Mascot mood="think" size={72} />
          <SpeechBubble className="flex-1" tail="left">
            <button type="button" className="w-full text-left" onClick={advance}>
              {typed ? step.say : <TypeLine text={step.say} onDone={() => setTyped(true)} />}
            </button>
          </SpeechBubble>
        </div>
      </div>

      <div className="border-t-3 border-choco-900 px-5 py-4 pb-[max(1rem,env(safe-area-inset-bottom))] bg-white">
        <DuoButton wide onClick={advance}>
          {last ? "Ingat ini" : "Lanjut liat"}
        </DuoButton>
      </div>
    </div>
  );
}
