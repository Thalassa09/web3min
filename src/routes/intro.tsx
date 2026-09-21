import { useCallback, useEffect, useState } from "react";
import { createFileRoute, useNavigate, useRouter } from "@tanstack/react-router";
import { DuoButton } from "@/components/duo-button";
import { Mascot, SpeechBubble, TypeLine, type MascotMood } from "@/components/mascot";
import { resumePath } from "@/lib/continue-to";
import { playComplete } from "@/lib/audio";
import { useProgress } from "@/lib/store";

export const Route = createFileRoute("/intro")({ component: Intro });

const BEATS: { mood: MascotMood; say: string }[] = [
  { mood: "wave", say: "Mulai dari tombol hijau di Belajar. Baca dulu, baru kuis. Sekitar 3 menit." },
  { mood: "think", say: "Salah jawab, nyawa berkurang. Habis? Buka Kisah. Tidak memakai nyawa." },
  { mood: "proud", say: "Rute terbuka berurutan. Node terkunci = selesaikan yang sebelumnya." },
  { mood: "idle", say: "Tidak perlu wallet. Materi edukatif, bukan saran keuangan." },
];

function Intro() {
  const onboarded = useProgress((s) => s.onboarded);
  const introSeen = useProgress((s) => s.introSeen);
  const completeIntro = useProgress((s) => s.completeIntro);
  const sound = useProgress((s) => s.sound);
  const navigate = useNavigate();
  const router = useRouter();
  const [beat, setBeat] = useState(0);
  const [doneTyping, setDoneTyping] = useState(false);
  const current = BEATS[beat] ?? BEATS[0];
  const last = beat >= BEATS.length - 1;

  const leave = useCallback(() => {
    if (!useProgress.getState().introSeen) completeIntro();
    resumePath((path) => router.history.push(path));
  }, [completeIntro, router]);

  useEffect(() => {
    if (!onboarded) void navigate({ to: "/onboarding" });
    else if (introSeen) leave();
  }, [onboarded, introSeen, navigate, leave]);

  useEffect(() => {
    setDoneTyping(false);
  }, [beat]);

  function next() {
    if (!doneTyping) {
      setDoneTyping(true);
      return;
    }
    if (last) {
      if (sound) playComplete();
      leave();
      return;
    }
    setBeat((n) => n + 1);
  }

  if (!onboarded || introSeen) return null;

  return (
    <main className="hex-wash relative mx-auto flex min-h-dvh max-w-lg flex-col overflow-y-auto bg-bg px-5 py-8">
      <div className="flex justify-end">
        <button type="button" className="min-h-11 text-sm font-bold text-muted" onClick={leave}>
          Lewati
        </button>
      </div>
      <div key={beat} className="enter-up flex flex-1 flex-col items-center justify-center pt-2">
        <Mascot key={current.mood + String(beat)} mood={current.mood} size={200} float className="blobi-pop" />
        <SpeechBubble className="mt-3 w-full">
          <button type="button" className="w-full text-left" onClick={next}>
            {doneTyping ? current.say : <TypeLine text={current.say} onDone={() => setDoneTyping(true)} />}
          </button>
        </SpeechBubble>
        <DuoButton wide className="mt-8" onClick={next}>
          {last ? "Mulai belajar" : "Lanjut"}
        </DuoButton>
      </div>
    </main>
  );
}
