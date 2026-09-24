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
  {
    mood: "wave",
    say: "Halo! Kenalin, gue Blobi. Di web3min kita belajar crypto & on-chain pakai bahasa tongkrongan, bukan bahasa alien kertas putih.",
  },
  {
    mood: "think",
    say: "Wallet itu simpelnya kayak dompet fisik, kuncinya kamu sendiri yang pegang. Kalau salah kuis nyawa berkurang, tapi santai—bisa isi ulang atau santai baca Kisah.",
  },
  {
    mood: "proud",
    say: "Gas terus tiap blok! Kumpulin bintang, jaga streak rantai kamu, dan sikat tiket undian on-chain gratis!",
  },
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
    <main className="relative flex min-h-screen w-full flex-col items-center justify-center bg-cream px-4 py-8 select-none overflow-hidden">
      <div className="relative z-10 w-full max-w-md flex flex-col items-center">
        {/* Skip button on top right */}
        <div className="w-full flex justify-end mb-4">
          <button
            type="button"
            className="px-4 py-1.5 rounded-xl bg-cream hover:bg-candy-100 text-xs font-pixel font-bold text-choco-900 border-2 border-choco-900 shadow-[0_2px_0_#3B2218] transition-[transform,box-shadow] active:translate-y-[1px] active:shadow-none cursor-pointer"
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
            <SpeechBubble className="w-full border-3 border-choco-900 bg-white shadow-[0_6px_0_#3B2218] p-5 rounded-2xl">
              <button type="button" className="w-full text-left font-display text-sm sm:text-base font-bold text-choco-900 cursor-pointer leading-relaxed" onClick={next}>
                {doneTyping ? current.say : <TypeLine text={current.say} onDone={() => setDoneTyping(true)} />}
              </button>
            </SpeechBubble>
          </div>

          {/* Step indicator dots */}
          <div className="flex items-center gap-2.5 mt-6">
            {BEATS.map((_, i) => (
              <span
                key={i}
                className={`h-3 rounded-full border-2 border-choco-900 transition-all duration-200 ${
                  i === beat ? "w-8 bg-candy-500 shadow-[0_2px_0_#3B2218]" : "w-3 bg-white"
                }`}
              />
            ))}
          </div>

          <div className="w-full mt-6">
            <button
              type="button"
              onClick={next}
              className="w-full inline-flex items-center justify-center gap-2 rounded-2xl border-3 border-choco-900 bg-candy-500 hover:bg-candy-600 py-4 px-6 font-pixel text-xs sm:text-sm font-bold text-white shadow-[0_5px_0_#3B2218] active:translate-y-1 active:shadow-[0_1px_0_#3B2218] transition-all cursor-pointer"
            >
              {last ? "Gas Mulai Belajar! 🚀" : "Lanjut →"}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
