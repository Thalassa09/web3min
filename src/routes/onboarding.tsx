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
    <main className="min-h-screen bg-gradient-to-b from-[#1F7BFF] to-[#0B4FD1] flex items-center justify-center px-4 py-8 relative select-none overflow-hidden">
      {/* Soft Floating Clouds Decor */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden z-0">
        <div className="absolute top-10 -left-10 w-72 h-36 rounded-full bg-white/20 blur-2xl" />
        <div className="absolute bottom-20 -right-10 w-80 h-40 rounded-full bg-white/15 blur-2xl" />
      </div>

      <div className="w-full max-w-3xl relative z-10">
        <SurfaceCard className="p-6 md:p-8 bg-white border-2 border-[#B9CFE9] shadow-[0_6px_0_#C8DBF0,0_18px_34px_-18px_rgba(9,48,102,0.35)] rounded-[26px]">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            {/* Mascot Side (5 Cols) */}
            <div className="md:col-span-5 flex md:flex-col items-center justify-center text-left md:text-center p-3.5 sm:p-6 rounded-[20px] bg-[#E4F0FF] border-2 border-[#8FC2FF] shadow-[0_4px_0_#C2DBFA] gap-3.5">
              <div className="shrink-0 flex items-center justify-center size-20 md:size-36">
                <Mascot
                  mood={step === 0 ? "wave" : step === 2 ? "celebrate" : "think"}
                  fill
                  float
                />
              </div>
              <div>
                <div className="font-display text-base sm:text-lg font-bold text-[#0B4FD1]">Blobi</div>
                <p className="text-xs font-semibold text-[#4A6580] mt-0.5 max-w-[200px]">
                  {step === 0 && "Teman belajarmu di dunia Web3"}
                  {step === 1 && "Pilih nama panggilan petualangmu"}
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
                    <h1 className="font-display font-bold text-2xl sm:text-3xl text-[#0D2340] tracking-tight leading-snug">
                      Belajar Web3 dengan santai, 3 menit sehari.
                    </h1>
                    <p className="text-xs sm:text-sm font-medium text-[#4A6580] mt-2 leading-relaxed">
                      Pahami wallet, smart contract, DeFi, dan keamanan on-chain lewat simulasi interaktif tanpa perlu modal dan tanpa risiko finansial.
                    </p>
                  </div>

                  {/* 3 Core Highlights */}
                  <div className="space-y-2.5 pt-1">
                    <div className="flex items-start gap-3 p-3 rounded-[16px] bg-[#F0F6FF] border-2 border-[#DCE7F5]">
                      <div className="p-2 rounded-[12px] bg-[#E8FBF0] text-[#1E8A49] border border-[#98E4B5] shrink-0 mt-0.5">
                        <Clock className="size-4" />
                      </div>
                      <div>
                        <div className="text-xs font-extrabold text-[#0D2340]">20 Modul Singkat & Terarah</div>
                        <div className="text-[11px] font-semibold text-[#4A6580] mt-0.5">Rute belajar bertahap dari pemula hingga mahir.</div>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-3 rounded-[16px] bg-[#F0F6FF] border-2 border-[#DCE7F5]">
                      <div className="p-2 rounded-[12px] bg-[#E4F0FF] text-[#0B4FD1] border border-[#8FC2FF] shrink-0 mt-0.5">
                        <ShieldCheck className="size-4" />
                      </div>
                      <div>
                        <div className="text-xs font-extrabold text-[#0D2340]">100% Aman & Tanpa Modal</div>
                        <div className="text-[11px] font-semibold text-[#4A6580] mt-0.5">Belajar konsep blockchain di lingkungan simulasi aman.</div>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-3 rounded-[16px] bg-[#F0F6FF] border-2 border-[#DCE7F5]">
                      <div className="p-2 rounded-[12px] bg-[#FFF7D1] text-[#B27B00] border border-[#FFD84D] shrink-0 mt-0.5">
                        <Gift className="size-4" />
                      </div>
                      <div>
                        <div className="text-xs font-extrabold text-[#0D2340]">Hadiah & Undian Nyata</div>
                        <div className="text-[11px] font-semibold text-[#4A6580] mt-0.5">Kumpulkan bintang dan tukarkan dengan tiket undian on-chain.</div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2">
                    <TactileButton
                      variant="primary"
                      size="lg"
                      fullWidth
                      icon={<ArrowRight className="size-5" />}
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
                    <h1 className="font-display font-bold text-2xl text-[#0D2340] tracking-tight">
                      Pilih Nama Panggilanmu
                    </h1>
                    <p className="text-xs sm:text-sm font-medium text-[#4A6580] mt-1.5">
                      Nama ini akan muncul di profil, lencana penjelajah, dan papan undian hadiah.
                    </p>
                  </div>

                  <div className="space-y-2 pt-2">
                    <label className="text-xs font-extrabold text-[#1E3A5F] block" htmlFor="username">
                      Nama Panggilan Petualang
                    </label>
                    <div className="relative">
                      <input
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value.replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 20))}
                        placeholder="Contoh: satoshi atau blobi-fan"
                        className="w-full h-12 px-4 rounded-[14px] bg-[#F0F6FF] border-2 border-[#B9CFE9] text-sm font-bold text-[#0D2340] placeholder:text-[#9DB4CE] focus:outline-none focus:border-[#0B63F6] focus:bg-white transition-all shadow-inner"
                        autoFocus
                      />
                      <span className="absolute right-3.5 top-3.5 text-xs font-mono font-bold text-[#4A6580]">
                        {username.length}/20
                      </span>
                    </div>
                    <p className="text-[11px] font-semibold text-[#4A6580]">
                      Bisa kamu ubah kapan saja di menu profil.
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
                      icon={<ArrowRight className="size-5" />}
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
                    <h1 className="font-display font-bold text-2xl text-[#0D2340] tracking-tight">
                      Tentukan Target Harianmu
                    </h1>
                    <p className="text-xs sm:text-sm font-medium text-[#4A6580] mt-1.5">
                      Belajar konsisten beberapa menit tiap hari untuk membangun streak dan menjaga nyawa.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-1">
                    {GOALS.map((g) => {
                      const isSelected = goal === g.value;
                      return (
                        <button
                          key={g.value}
                          type="button"
                          onClick={() => setGoal(g.value)}
                          className={`
                            p-3.5 rounded-[16px] border-2 text-left transition-all flex flex-col justify-between cursor-pointer
                            active:translate-y-[2px]
                            ${
                              isSelected
                                ? "bg-[#E4F0FF] border-[#0B63F6] shadow-[0_4px_0_#0B4FD1]"
                                : "bg-[#FFFFFF] border-[#DCE7F5] shadow-[0_3px_0_#C8DBF0] hover:border-[#B9CFE9]"
                            }
                          `}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-extrabold text-[#0D2340]">{g.label}</span>
                            {isSelected && (
                              <span className="size-5 rounded-full bg-[#0B63F6] text-white flex items-center justify-center">
                                <Check className="size-3" strokeWidth={3} />
                              </span>
                            )}
                          </div>
                          <div className="mt-2">
                            <div className="text-xs font-bold text-[#0B4FD1]">{g.desc}</div>
                            <div className="text-[11px] font-semibold text-[#4A6580] mt-0.5">{g.modules}</div>
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
                      icon={<ArrowRight className="size-5" />}
                      onClick={finish}
                    >
                      Mulai Petualangan!
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
