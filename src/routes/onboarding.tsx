import { useEffect, useState } from "react";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { DuoButton } from "@/components/duo-button";
import { Mascot, SpeechBubble } from "@/components/mascot";
import { resumePath } from "@/lib/continue-to";
import { useProgress, type DailyGoal } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/onboarding")({ component: Onboarding });

const GOALS: { value: DailyGoal; label: string; hint: string }[] = [
  { value: 10, label: "Santai", hint: "10 XP / hari" },
  { value: 20, label: "Biasa aja", hint: "20 XP / hari" },
  { value: 30, label: "Rajin", hint: "30 XP / hari" },
  { value: 50, label: "Penuh", hint: "50 XP / hari" },
];

function goAfter(router: { history: { push: (path: string) => void } }) {
  resumePath((path) => router.history.push(path));
}

function Onboarding() {
  const onboarded = useProgress((s) => s.onboarded);
  const introSeen = useProgress((s) => s.introSeen);
  const completeOnboarding = useProgress((s) => s.completeOnboarding);
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [username, setUsername] = useState("");
  const [goal, setGoal] = useState<DailyGoal>(20);

  useEffect(() => {
    if (!onboarded) return;
    goAfter(router);
  }, [onboarded, introSeen, router]);

  function finish() {
    completeOnboarding(username, goal);
  }

  return (
    <main className="hex-wash mx-auto flex min-h-dvh max-w-lg flex-col bg-bg px-5 py-8 lg:max-w-5xl lg:flex-row lg:items-center lg:gap-12">
      <div className="flex justify-center lg:w-2/5">
        <Mascot mood={step === 0 ? "wave" : step === 3 ? "celebrate" : "idle"} size={200} float />
      </div>

      {step === 0 ? (
        <div className="enter-up mt-2 flex flex-1 flex-col">
          <SpeechBubble className="-mt-3">Aku web3min. Nanti aku tunjukin jalannya di peta.</SpeechBubble>
          <h1 className="mt-6 text-[32px] font-extrabold leading-[38px] tracking-tight">
            Belajar tanpa deposit, trading, atau menghubungkan wallet.
          </h1>
          <p className="mt-3 text-base leading-6 text-muted">
            Jelajahi wallet, DeFi, NFT, dan keamanan onchain lewat rute singkat. Dirancang untuk pemula.
          </p>
          <p className="mt-3 text-sm font-medium text-muted">20 rute · sekitar 3 menit per pelajaran</p>
          <p className="mt-2 text-sm leading-5 text-faint">Materi ini bersifat edukatif, bukan saran keuangan.</p>
          <DuoButton wide className="mt-auto" onClick={() => setStep(1)}>
            Lanjut
          </DuoButton>
        </div>
      ) : null}

      {step === 1 ? (
        <div className="enter-up mt-2 flex flex-1 flex-col">
          <h1 className="text-[28px] font-extrabold leading-[34px]">Username-nya apa?</h1>
          <p className="mt-1 text-muted">Bukan nama KTP. Ini yang kelihatan di Teman.</p>
          <label className="mt-5 text-sm font-medium text-muted" htmlFor="username">
            Username
          </label>
          <input
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, "").slice(0, 16))}
            placeholder="contoh: justin_eth"
            className="field mt-2 min-h-12 text-lg"
            maxLength={16}
            autoCapitalize="off"
            autoCorrect="off"
            spellCheck={false}
            aria-describedby="username-hint"
          />
          <p id="username-hint" className="mt-2 text-sm text-muted">
            Huruf kecil, angka, underscore. Username X nanti di profil.
          </p>
          <DuoButton wide className="mt-auto" disabled={username.length < 3} onClick={() => setStep(2)}>
            Lanjut ke target harian
          </DuoButton>
        </div>
      ) : null}

      {step === 2 ? (
        <div className="enter-up mt-2 flex flex-1 flex-col">
          <h1 className="text-[28px] font-extrabold leading-[34px]">Target XP harian</h1>
          <p className="mt-1 text-muted">Bisa diganti nanti. Pilih yang nyaman.</p>
          <ul className="mt-5 flex flex-col gap-3">
            {GOALS.map((g) => (
              <li key={g.value}>
                <button
                  type="button"
                  onClick={() => setGoal(g.value)}
                  className={cn(
                    "flex min-h-12 w-full items-center justify-between rounded-2xl px-4 py-3",
                    goal === g.value ? "bg-primary-soft ring-2 ring-primary" : "bg-paper",
                  )}
                >
                  <span className="font-bold">{g.label}</span>
                  <span className="text-sm text-muted">{g.hint}</span>
                </button>
              </li>
            ))}
          </ul>
          <DuoButton wide className="mt-auto" onClick={() => setStep(3)}>
            Lanjut ke keamanan
          </DuoButton>
        </div>
      ) : null}

      {step === 3 ? (
        <div className="mt-2 flex flex-1 flex-col text-center">
          <h1 className="text-[32px] font-extrabold leading-[38px]">Oke, @{username.trim() || "pelajar"}.</h1>
          <p className="mt-3 text-base leading-6 text-muted">
            web3min tidak akan pernah meminta seed phrase, private key, atau password dompetmu.
          </p>
          <p className="mt-2 text-base leading-6 text-muted">Kamu tidak perlu menghubungkan wallet untuk belajar.</p>
          <p className="mt-3 text-sm leading-5 text-faint">Materi ini bersifat edukatif, bukan saran keuangan.</p>
          <DuoButton wide className="mt-auto" onClick={finish}>
            Mulai belajar
          </DuoButton>
        </div>
      ) : null}
    </main>
  );
}
