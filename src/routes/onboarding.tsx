import { useEffect, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowRight, Clock, ShieldCheck, Gift, Check } from "lucide-react";
import { TactileButton } from "@/components/ui/tactile-button";
import { SurfaceCard } from "@/components/ui/surface-card";
import { Mascot } from "@/components/mascot";
import { type DailyGoal, useProgress } from "@/lib/store";

export const Route = createFileRoute("/onboarding")({ component: Onboarding });

const GOALS: { value: DailyGoal; label: string; desc: string; modules: string }[] = [
  { value: 10, label: "Santai", desc: "10 XP / hari", modules: "~1 modul per hari" },
  { value: 20, label: "Reguler", desc: "20 XP / hari", modules: "~2 modul per hari" },
  { value: 30, label: "Serius", desc: "30 XP / hari", modules: "~3 modul per hari" },
  { value: 50, label: "Intensif", desc: "50 XP / hari", modules: "~5 modul per hari" },
];

function Onboarding() {
  const onboarded = useProgress((s) => s.onboarded);
  const completeOnboarding = useProgress((s) => s.completeOnboarding);
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [username, setUsername] = useState("");
  const [goal, setGoal] = useState<DailyGoal>(20);

  useEffect(() => {
    if (!onboarded) return;
    void navigate({ to: "/" });
  }, [onboarded, navigate]);

  function finish() {
    completeOnboarding(username.trim() || "Pelajar", goal);
    void navigate({ to: "/" });
  }

  return (
    <main className="min-h-screen bg-[#080a11] flex items-center justify-center px-4 py-8 relative select-none">
      <div className="w-full max-w-3xl relative z-10">
        <SurfaceCard className="p-6 md:p-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            {/* Mascot Side (5 Cols) */}
            <div className="md:col-span-5 flex flex-col items-center justify-center text-center p-6 rounded-[18px] bg-[#0d1018] border border-[#1a2130]">
              <div className="py-3 flex items-center justify-center">
                <Mascot
                  mood={step === 0 ? "wave" : step === 2 ? "celebrate" : "think"}
                  size={140}
                  float
                />
              </div>
              <div className="mt-3">
                <div className="text-sm font-bold text-[#f1f4fa]">Blobi</div>
                <p className="text-xs text-[#8e9ab2] mt-0.5">
                  {step === 0 && "Teman belajarmu di dunia Web3"}
                  {step === 1 && "Ketik nama panggilanmu di samping"}
                  {step === 2 && "Berapa menit kamu luangkan tiap hari?"}
                </p>
              </div>
            </div>

            {/* Step Content (7 Cols) */}
            <div className="md:col-span-7 flex flex-col justify-between min-h-[340px]">
              {/* Step 0: Welcome */}
              {step === 0 && (
                <div className="space-y-5">
                  <div>
                    <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-[#f1f4fa] tracking-tight leading-snug">
                      Belajar Web3 dengan santai, 3 menit sehari.
                    </h1>
                    <p className="text-xs sm:text-sm text-[#8e9ab2] mt-2 leading-relaxed">
                      Pahami wallet, smart contract, DeFi, dan keamanan on-chain lewat simulasi interaktif tanpa perlu modal dan tanpa risiko finansial.
                    </p>
                  </div>

                  {/* 3 Core Highlights */}
                  <div className="space-y-2.5 pt-1">
                    <div className="flex items-start gap-3 p-3 rounded-[14px] bg-[#121622] border border-[#1e2536]">
                      <div className="p-2 rounded-[10px] bg-[#00f59b]/10 text-[#00f59b] shrink-0 mt-0.5">
                        <Clock className="size-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-[#f1f4fa]">20 Modul Singkat & Terarah</div>
                        <div className="text-[11px] text-[#8e9ab2] mt-0.5">Rute belajar terstruktur dari nol hingga mahir.</div>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-3 rounded-[14px] bg-[#121622] border border-[#1e2536]">
                      <div className="p-2 rounded-[10px] bg-[#00e5ff]/10 text-[#00e5ff] shrink-0 mt-0.5">
                        <ShieldCheck className="size-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-[#f1f4fa]">100% Aman & Tanpa Modal</div>
                        <div className="text-[11px] text-[#8e9ab2] mt-0.5">Belajar konsep blockchain di lingkungan simulasi aman.</div>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-3 rounded-[14px] bg-[#121622] border border-[#1e2536]">
                      <div className="p-2 rounded-[10px] bg-[#f59e0b]/10 text-[#f59e0b] shrink-0 mt-0.5">
                        <Gift className="size-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-[#f1f4fa]">Hadiah & Undian Nyata</div>
                        <div className="text-[11px] text-[#8e9ab2] mt-0.5">Kumpulkan bintang dan tukarkan dengan tiket undian Web3.</div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2">
                    <TactileButton
                      variant="primary"
                      size="lg"
                      fullWidth
                      icon={<ArrowRight className="size-4" />}
                      onClick={() => setStep(1)}
                    >
                      Mulai Sekarang
                    </TactileButton>
                  </div>
                </div>
              )}

              {/* Step 1: Username */}
              {step === 1 && (
                <div className="space-y-5">
                  <div>
                    <h1 className="font-display font-extrabold text-2xl text-[#f1f4fa] tracking-tight">
                      Pilih Nama Panggilanmu
                    </h1>
                    <p className="text-xs sm:text-sm text-[#8e9ab2] mt-1.5">
                      Nama ini akan muncul di profil, lencana kelulusan, dan papan undian Web3.
                    </p>
                  </div>

                  <div className="space-y-2 pt-2">
                    <label className="text-xs font-semibold text-[#8e9ab2] block" htmlFor="username">
                      Nama atau Username
                    </label>
                    <div className="relative">
                      <input
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value.replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 20))}
                        placeholder="Contoh: satoshi atau cypher"
                        className="w-full h-12 px-4 rounded-[14px] bg-[#0c1017] border border-[#232b3e] text-sm text-[#f1f4fa] placeholder:text-[#5a667d] focus:outline-none focus:border-[#00f59b] transition-colors"
                        autoFocus
                      />
                      <span className="absolute right-3.5 top-3.5 text-xs font-mono text-[#5a667d]">
                        {username.length}/20
                      </span>
                    </div>
                    <p className="text-[11px] text-[#5a667d]">
                      Bisa diubah kapan saja di halaman profil.
                    </p>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <TactileButton
                      variant="ghost"
                      size="md"
                      onClick={() => setStep(0)}
                    >
                      Kembali
                    </TactileButton>
                    <TactileButton
                      variant="primary"
                      size="lg"
                      fullWidth
                      icon={<ArrowRight className="size-4" />}
                      onClick={() => setStep(2)}
                    >
                      Lanjut ke Target Harian
                    </TactileButton>
                  </div>
                </div>
              )}

              {/* Step 2: Daily Goal */}
              {step === 2 && (
                <div className="space-y-5">
                  <div>
                    <h1 className="font-display font-extrabold text-2xl text-[#f1f4fa] tracking-tight">
                      Tentukan Target Harianmu
                    </h1>
                    <p className="text-xs sm:text-sm text-[#8e9ab2] mt-1.5">
                      Konsistensi adalah kunci. Kamu bisa mengubah target ini kapan pun.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5 pt-1">
                    {GOALS.map((g) => {
                      const isSelected = goal === g.value;
                      return (
                        <button
                          key={g.value}
                          type="button"
                          onClick={() => setGoal(g.value)}
                          className={`
                            p-3.5 rounded-[14px] border text-left transition-all flex flex-col justify-between
                            ${
                              isSelected
                                ? "bg-[#141d2c] border-[#00f59b] shadow-[0_0_12px_rgba(0,245,155,0.12)]"
                                : "bg-[#0c1017] border-[#1e2536] hover:border-[#2b354c]"
                            }
                          `}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-[#f1f4fa]">{g.label}</span>
                            {isSelected && <Check className="size-4 text-[#00f59b]" />}
                          </div>
                          <div className="mt-2">
                            <div className="text-xs font-semibold text-[#00f59b]">{g.desc}</div>
                            <div className="text-[11px] text-[#8e9ab2] mt-0.5">{g.modules}</div>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  <div className="flex gap-3 pt-4">
                    <TactileButton
                      variant="ghost"
                      size="md"
                      onClick={() => setStep(1)}
                    >
                      Kembali
                    </TactileButton>
                    <TactileButton
                      variant="primary"
                      size="lg"
                      fullWidth
                      icon={<ArrowRight className="size-4" />}
                      onClick={finish}
                    >
                      Mulai Petualangan
                    </TactileButton>
                  </div>
                </div>
              )}
            </div>
          </div>
        </SurfaceCard>
      </div>
    </main>
  );
}
