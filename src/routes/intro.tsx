import { useCallback, useEffect, useState } from "react";
import { createFileRoute, useNavigate, useRouter } from "@tanstack/react-router";
import { DuoButton } from "@/components/duo-button";
import { ArrowRight } from "lucide-react";
import { Mascot, SpeechBubble, TypeLine, type MascotMood } from "@/components/mascot";
import { resumePath } from "@/lib/continue-to";
import { playComplete } from "@/lib/audio";
import { useProgress } from "@/lib/store";

export const Route = createFileRoute("/intro")({ component: Intro });

const BEATS: { mood: MascotMood; say: string }[] = [
  { mood: "wave", say: "Halo! Selamat datang di web3min. Mulai dari tombol kuning di beranda. Baca 3 menit dulu, baru kuis." },
  { mood: "think", say: "Salah jawab, nyawa berkurang. Jika nyawa habis, kamu bisa baca Kisah tanpa mengurangi nyawa." },
  { mood: "proud", say: "Selesaikan rute belajar untuk membuka hadiah bintang dan tiket undian on-chain Web3!" },
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
    <main className="relative flex min-h-screen w-full flex-col items-center justify-center bg-canvas px-4 py-8 select-none overflow-hidden">
      {/* Soft Background Ambient Glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden z-0">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-primary-soft/50 blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-md flex flex-col items-center">
        {/* Skip button on top right */}
        <div className="w-full flex justify-end mb-4">
          <button
            type="button"
            className="px-4 py-2 rounded-full bg-paper hover:bg-primary-soft text-xs font-extrabold text-ink-700 border border-line transition-[transform,box-shadow,background-color,border-color,color] cursor-pointer"
            onClick={leave}
          >
            Lewati
          </button>
        </div>

        {/* Mascot & Speech Bubble */}
        <div key={beat} className="w-full flex flex-col items-center">
          <div className="py-2">
            <Mascot key={current.mood + String(beat)} mood={current.mood} size={180} float className="blobi-pop" />
          </div>

          <div className="w-full mt-4">
            <SpeechBubble className="w-full">
              <button type="button" className="w-full text-left font-sans text-sm sm:text-base font-extrabold text-ink-900 cursor-pointer" onClick={next}>
                {doneTyping ? current.say : <TypeLine text={current.say} onDone={() => setDoneTyping(true)} />}
              </button>
            </SpeechBubble>
          </div>

          {/* Step indicator dots */}
          <div className="flex items-center gap-2 mt-6">
            {BEATS.map((_, i) => (
              <span
                key={i}
                className={`h-2.5 rounded-full transition-[width,background-color] duration-200 ${
                  i === beat ? "w-8 bg-primary shadow-xs" : "w-2.5 bg-line-strong"
                }`}
              />
            ))}
          </div>

          <div className="w-full mt-6">
            <DuoButton wide variant="primary" size="md" onClick={next}>
              {last ? "Mulai Belajar Sekarang" : "Lanjut →"}
            </DuoButton>
          </div>
        </div>
      </div>
    </main>
  );
}
