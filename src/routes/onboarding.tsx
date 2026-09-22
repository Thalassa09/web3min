import { useEffect, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowRight, Clock, ShieldCheck, Gift, Check } from "lucide-react";
import { TactileButton } from "@/components/ui/tactile-button";
import { SurfaceCard } from "@/components/ui/surface-card";
import { Mascot, type MascotMood } from "@/components/mascot";
import { type DailyGoal, useProgress } from "@/lib/store";
import { playMoodSfx, triggerHaptic } from "@/lib/audio";
import { isUsernameAvailable, loginAccount, registerAccount, validatePassword, validateUsername } from "@/lib/account";
import { sanitizeUsername } from "@/lib/people";
import { syncProgressFromServer } from "@/lib/server-sync";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/onboarding")({ component: Onboarding });

interface GoalConfig {
  value: DailyGoal;
  label: string;
  desc: string;
  modules: string;
  mood: MascotMood;
  quote: string;
}

const GOALS: GoalConfig[] = [
  {
    value: 10,
    label: "Santai",
    desc: "10 XP / hari",
    modules: "~1 modul per hari",
    mood: "idle",
    quote: "Santai aja, 1 modul per hari udah keren banget!",
  },
  {
    value: 20,
    label: "Reguler",
    desc: "20 XP / hari",
    modules: "~2 modul per hari",
    mood: "wave",
    quote: "Pilihan pas! 2 modul sehari bikin cepat paham.",
  },
  {
    value: 30,
    label: "Serius",
    desc: "30 XP / hari",
    modules: "~3 modul per hari",
    mood: "proud",
    quote: "Mantap! 3 modul sehari, ambisius jadi master!",
  },
  {
    value: 50,
    label: "Intensif",
    desc: "50 XP / hari",
    modules: "~5 modul per hari",
    mood: "angry",
    quote: "Gaspol! 5 modul sehari, mode ngebut on-chain!",
  },
];

function Onboarding() {
  const onboarded = useProgress((s) => s.onboarded);
  const completeOnboarding = useProgress((s) => s.completeOnboarding);
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [authMode, setAuthMode] = useState<"register" | "login">("register");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [goal, setGoal] = useState<DailyGoal>(20);

  useEffect(() => {
    if (!onboarded) return;
    void navigate({ to: "/" });
  }, [onboarded, navigate]);

  async function handleLogin() {
    const id = sanitizeUsername(username);
    const uErr = validateUsername(id);
    if (uErr) {
      setFormError(uErr);
      return;
    }
    if (!password) {
      setFormError("Masukkan password akunmu.");
      return;
    }
    setBusy(true);
    setFormError(null);
    const res = await loginAccount({ username: id, password });
    if (!res.ok) {
      setBusy(false);
      setFormError(res.message);
      return;
    }
    await syncProgressFromServer();
    setBusy(false);
    void navigate({ to: "/" });
  }

  async function goUsernameNext() {
    const id = sanitizeUsername(username);
    const uErr = validateUsername(id);
    if (uErr) {
      setFormError(uErr);
      return;
    }
    const pErr = validatePassword(password);
    if (pErr) {
      setFormError(pErr);
      return;
    }
    if (password !== password2) {
      setFormError("Konfirmasi password tidak sama.");
      return;
    }
    setBusy(true);
    const free = await isUsernameAvailable(id);
    setBusy(false);
    if (!free) {
      setFormError("Username sudah dipakai. Pilih yang lain.");
      return;
    }
    setUsername(id);
    setFormError(null);
    setStep(2);
  }

  async function finish() {
    const id = sanitizeUsername(username);
    setBusy(true);
    const res = await registerAccount({ username: id, password });
    if (!res.ok) {
      setBusy(false);
      setFormError(res.message);
      setStep(1);
      return;
    }
    completeOnboarding(res.username, goal);
    setBusy(false);
    void navigate({ to: "/" });
  }

  const activeGoalConfig = GOALS.find((g) => g.value === goal) ?? GOALS[1];
  const currentMood: MascotMood =
    step === 0
      ? "wave"
      : step === 1
        ? authMode === "login"
          ? "proud"
          : "think"
        : activeGoalConfig.mood;

  const handleSelectGoal = (g: GoalConfig) => {
    setGoal(g.value);
    if (useProgress.getState().sound) {
      playMoodSfx(g.mood);
    } else {
      triggerHaptic("selection");
    }
  };

  return (
    <main className="min-h-dvh bg-gradient-to-b from-[#1F7BFF] to-[#0B4FD1] flex items-start sm:items-center justify-center px-3 py-4 sm:px-4 sm:py-8 relative select-none overflow-x-hidden overflow-y-auto">
      {/* Soft Floating Clouds Decor */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden z-0">
        <div className="absolute top-10 -left-10 w-72 h-36 rounded-full bg-white/20 blur-2xl" />
        <div className="absolute bottom-20 -right-10 w-80 h-40 rounded-full bg-white/15 blur-2xl" />
      </div>

      <div className="w-full max-w-3xl relative z-10">
        <SurfaceCard className="p-5 sm:p-6 md:p-8 bg-white border-2 border-[#B9CFE9] shadow-[0_6px_0_#C8DBF0,0_18px_34px_-18px_rgba(9,48,102,0.35)] rounded-[26px]">
          <div className="mb-4 flex items-center gap-1.5" aria-hidden="true">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className={`h-1.5 flex-1 rounded-full ${i <= step ? "bg-sky-600" : "bg-[#DCE7F5]"}`}
              />
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 items-center">
            {/* Mascot Side (5 Cols) */}
            <div className="md:col-span-5 flex md:flex-col items-center justify-center text-left md:text-center p-3.5 sm:p-6 rounded-[20px] bg-[#E4F0FF] border-2 border-[#8FC2FF] shadow-[0_4px_0_#C2DBFA] gap-3.5">
              <div className="shrink-0 flex items-center justify-center size-20 md:size-36">
                <Mascot
                  key={step === 2 ? `goal-${goal}` : `step-${step}-${authMode}`}
                  mood={currentMood}
                  fill
                  float
                  interactive
                />
              </div>
              <div>
                <div className="font-display text-base sm:text-lg font-bold text-[#0B4FD1]">Blobi</div>
                <p className="text-xs font-semibold text-[#4A6580] mt-0.5 max-w-[200px] transition-[opacity,transform] duration-200">
                  {step === 0 && "Teman belajarmu di dunia Web3"}
                  {step === 1 && (authMode === "register" ? "Pilih nama panggilan petualangmu" : "Selamat datang kembali! Masuk untuk lanjut")}
                  {step === 2 && activeGoalConfig.quote}
                </p>
              </div>
            </div>

            {/* Step Content (7 Cols) */}
            <div className="md:col-span-7 flex flex-col justify-between min-h-0">
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
                        <div className="text-[11px] font-semibold text-[#4A6580] mt-0.5">Kumpulkan bintang dan tukarkan dengan tiket undian in-game.</div>
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

              {/* Step 1: Username & Password (Register or Login in-place) */}
              {step === 1 && (
                <div className="space-y-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h1 className="font-display font-bold text-2xl text-[#0D2340] tracking-tight">
                        {authMode === "register" ? "Buat Username & Password" : "Masuk ke Akun"}
                      </h1>
                      <p className="text-xs sm:text-sm font-medium text-[#4A6580] mt-1.5">
                        {authMode === "register"
                          ? "Username unik tersimpan di database. Tidak bisa dipakai orang lain."
                          : "Gunakan username unik dan password akun Web3min milikmu."}
                      </p>
                    </div>

                    {/* Quick Mode Toggle Pill */}
                    <div className="inline-flex rounded-full bg-[#F0F6FF] border-2 border-[#DCE7F5] p-0.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => {
                          setAuthMode("register");
                          setFormError(null);
                        }}
                        className={cn(
                          "px-2.5 py-1 rounded-full text-xs font-extrabold transition-all cursor-pointer",
                          authMode === "register"
                            ? "bg-[#0B63F6] text-white shadow-sm"
                            : "text-[#4A6580] hover:text-[#0D2340]"
                        )}
                      >
                        Daftar
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setAuthMode("login");
                          setFormError(null);
                        }}
                        className={cn(
                          "px-2.5 py-1 rounded-full text-xs font-extrabold transition-all cursor-pointer",
                          authMode === "login"
                            ? "bg-[#0B63F6] text-white shadow-sm"
                            : "text-[#4A6580] hover:text-[#0D2340]"
                        )}
                      >
                        Masuk
                      </button>
                    </div>
                  </div>

                  <form
                    className="space-y-2 pt-1"
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (authMode === "register") {
                        void goUsernameNext();
                      } else {
                        void handleLogin();
                      }
                    }}
                  >
                    <label className="text-xs font-extrabold text-[#1E3A5F] block" htmlFor="username">
                      Username
                    </label>
                    <div className="relative">
                      <input
                        id="username"
                        value={username}
                        onChange={(e) => {
                          setUsername(sanitizeUsername(e.target.value));
                          setFormError(null);
                        }}
                        placeholder="contoh: satoshi atau blobi_fan"
                        className="w-full h-12 px-4 rounded-[14px] bg-[#F0F6FF] border-2 border-[#B9CFE9] text-sm font-bold text-[#0D2340] placeholder:text-[#9DB4CE] focus:outline-none focus:border-[#0B63F6] focus:bg-white transition-[border-color,background-color] shadow-inner"
                        autoFocus
                        autoComplete="username"
                      />
                      <span className="absolute right-3.5 top-3.5 text-xs font-mono font-bold text-[#4A6580]">
                        {username.length}/16
                      </span>
                    </div>

                    <label className="text-xs font-extrabold text-[#1E3A5F] block pt-2" htmlFor="password">
                      Password
                    </label>
                    <input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        setFormError(null);
                      }}
                      autoComplete={authMode === "register" ? "new-password" : "current-password"}
                      className="w-full h-12 px-4 rounded-[14px] bg-[#F0F6FF] border-2 border-[#B9CFE9] text-sm font-bold text-[#0D2340] placeholder:text-[#9DB4CE] focus:outline-none focus:border-[#0B63F6] focus:bg-white transition-[border-color,background-color] shadow-inner"
                      placeholder={authMode === "register" ? "Minimal 8 karakter" : "Masukkan password akun"}
                    />

                    {authMode === "register" && (
                      <>
                        <label className="text-xs font-extrabold text-[#1E3A5F] block pt-2" htmlFor="password2">
                          Ulangi password
                        </label>
                        <input
                          id="password2"
                          type="password"
                          value={password2}
                          onChange={(e) => {
                            setPassword2(e.target.value);
                            setFormError(null);
                          }}
                          autoComplete="new-password"
                          className="w-full h-12 px-4 rounded-[14px] bg-[#F0F6FF] border-2 border-[#B9CFE9] text-sm font-bold text-[#0D2340] placeholder:text-[#9DB4CE] focus:outline-none focus:border-[#0B63F6] focus:bg-white transition-[border-color,background-color] shadow-inner"
                          placeholder="Ulangi password yang sama"
                        />
                      </>
                    )}

                    {formError ? <p className="text-xs font-semibold text-[#E63329] pt-1">{formError}</p> : null}

                    <div className="pt-2 text-[11px] font-semibold text-[#4A6580]">
                      {authMode === "register" ? (
                        <>
                          Sudah punya akun?{" "}
                          <button
                            type="button"
                            onClick={() => {
                              setAuthMode("login");
                              setFormError(null);
                            }}
                            className="text-sky-600 font-extrabold hover:underline cursor-pointer"
                          >
                            Masuk di sini
                          </button>
                        </>
                      ) : (
                        <>
                          Belum punya akun?{" "}
                          <button
                            type="button"
                            onClick={() => {
                              setAuthMode("register");
                              setFormError(null);
                            }}
                            className="text-sky-600 font-extrabold hover:underline cursor-pointer"
                          >
                            Daftar akun baru
                          </button>
                        </>
                      )}
                    </div>

                    <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4">
                      <TactileButton
                        variant="ghost"
                        size="md"
                        type="button"
                        onClick={() => {
                          if (authMode === "login") {
                            setAuthMode("register");
                            setFormError(null);
                          } else {
                            setStep(0);
                          }
                        }}
                      >
                        Kembali
                      </TactileButton>
                      <TactileButton
                        variant="primary"
                        size="lg"
                        type="submit"
                        className="w-full sm:flex-1"
                        icon={<ArrowRight className="size-5" />}
                        disabled={busy}
                      >
                        {busy
                          ? authMode === "register"
                            ? "Cek username…"
                            : "Memeriksa…"
                          : authMode === "register"
                            ? "Lanjut"
                            : "Masuk Sekarang"}
                      </TactileButton>
                    </div>
                  </form>
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
                          onClick={() => handleSelectGoal(g)}
                          className={`
                            p-3.5 rounded-[16px] border-2 text-left transition-[transform,box-shadow,background-color,border-color] duration-150 flex flex-col justify-between cursor-pointer
                            active:translate-y-[2px]
                            ${
                              isSelected
                                ? "bg-[#E4F0FF] border-[#0B63F6] shadow-[0_4px_0_#0B4FD1]"
                                : "bg-[#FFFFFF] border-[#DCE7F5] shadow-[0_3px_0_#C8DBF0] hover:border-[#B9CFE9]"
                            }
                          `}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="size-7 rounded-xl bg-white/90 border border-[#B9CFE9] flex items-center justify-center shrink-0 shadow-sm">
                                <img
                                  src={`/mascot/${g.mood}.png`}
                                  alt=""
                                  className="size-5 pixelated object-contain"
                                />
                              </span>
                              <span className="text-xs font-extrabold text-[#0D2340]">{g.label}</span>
                            </div>
                            {isSelected && (
                              <span className="size-5 rounded-full bg-[#0B63F6] text-white flex items-center justify-center shadow-sm">
                                <Check className="size-3" strokeWidth={3} />
                              </span>
                            )}
                          </div>
                          <div className="mt-2.5">
                            <div className="text-xs font-bold text-[#0B4FD1]">{g.desc}</div>
                            <div className="text-[11px] font-semibold text-[#4A6580] mt-0.5">{g.modules}</div>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4">
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
                      className="w-full sm:flex-1"
                      icon={<ArrowRight className="size-5" />}
                      onClick={() => void finish()}
                      disabled={busy}
                    >
                      {busy ? "Mendaftarkan…" : "Mulai Petualangan!"}
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
