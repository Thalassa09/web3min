import { useEffect, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowRight, Clock, ShieldCheck, Gift, Check, Sparkles, AlertTriangle } from "lucide-react";
import { TactileButton } from "@/components/ui/tactile-button";
import { Box } from "@/components/ui/box";
import { SectionMessage } from "@/components/ui/section-message";
import { Lozenge } from "@/components/ui/lozenge";
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
  const [isTypingPassword, setIsTypingPassword] = useState(false);
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
    isTypingPassword
      ? "sleep"
      : step === 0
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
    <main className="min-h-dvh bg-[#FDFBF7] flex items-start sm:items-center justify-center px-3 py-6 sm:px-6 sm:py-10 relative select-none overflow-x-hidden overflow-y-auto">
      <div className="w-full max-w-4xl relative z-10 bg-cream rounded-[32px] border-4 border-choco-900 shadow-[0_10px_0_#3B2218] p-6 sm:p-10">
        {/* Step Progress Bar (Shown on Step 1 & 2) */}
        {step > 0 && (
          <div className="mb-6 flex items-center justify-between gap-3">
            <div className="flex-1 flex items-center gap-2" aria-hidden="true">
              {[1, 2].map((i) => (
                <span
                  key={i}
                  className={`h-3 flex-1 rounded-full border-2 border-choco-900 ${
                    i <= step ? "bg-candy-500 shadow-[0_2px_0_#3B2218]" : "bg-white"
                  }`}
                />
              ))}
            </div>
            <span className="font-pixel text-[11px] font-bold text-choco-900 shrink-0 bg-amber-100 border-2 border-choco-900 px-3 py-0.5 rounded-full shadow-[0_1.5px_0_#3B2218]">
              Langkah {step} dari 2
            </span>
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 items-center">
          {/* Mascot Side (5 Cols - Blobi on Tactile 3D Arcade Tile) */}
          <div className="md:col-span-5 flex md:flex-col items-center justify-center text-left md:text-center bg-linear-to-b from-[#FFF0F5] to-[#FCE7F3] border-3 border-choco-900 shadow-[0_6px_0_#3B2218] rounded-3xl p-6 gap-4 relative overflow-hidden">
            {/* Decorative Arcade Top Badge */}
            <div className="absolute top-2.5 left-1/2 -translate-x-1/2 hidden md:inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-candy-500 border-2 border-choco-900 text-white font-pixel text-[9px] font-bold shadow-[0_2px_0_#3B2218]">
              <Sparkles className="size-2.5 text-white" />
              <span>BLOBI CO-PILOT</span>
              <Sparkles className="size-2.5 text-white" />
            </div>

            <div className="shrink-0 flex items-center justify-center size-24 md:size-40 md:mt-3">
              <Mascot
                key={step === 2 ? `goal-${goal}` : `step-${step}-${authMode}`}
                mood={currentMood}
                fill
                float
                interactive
                hideParticles={isTypingPassword}
              />
            </div>
            <div className="w-full">
              <div className="inline-block px-3.5 py-1 rounded-xl bg-candy-500 text-white font-pixel text-xs sm:text-sm font-bold border-2 border-choco-900 shadow-[0_2px_0_#3B2218]">
                Blobi
              </div>
              <div className="mt-2.5 p-3 rounded-2xl bg-white border-2 border-choco-900 shadow-[0_3px_0_#3B2218]">
                <p className="text-xs font-bold text-choco-800 leading-snug">
                  {isTypingPassword ? (
                    <span className="text-candy-600 font-bold">
                      Tenang, aku tutup mata kok. Gak bakal ngintip!
                    </span>
                  ) : (
                    <>
                      {step === 0 && "Teman belajarmu di dunia Web3!"}
                      {step === 1 && (authMode === "register" ? "Ketik nama panggilan petualangmu di Web3min" : "Selamat datang kembali! Yuk masuk")}
                      {step === 2 && activeGoalConfig.quote}
                    </>
                  )}
                </p>
              </div>
            </div>
          </div>

          {/* Step Content (7 Cols) */}
          <div className="md:col-span-7 flex flex-col justify-between min-h-0">
            {/* Step 0: Welcome */}
            {step === 0 && (
              <div className="space-y-6">
                <div>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-lemon border-2 border-choco-900 text-choco-900 font-pixel text-[10px] font-bold shadow-[0_2px_0_#3B2218] mb-2.5">
                    ARCADE WEB3 SIMULATION
                  </span>
                  <h1 className="font-display font-black text-2xl sm:text-3xl lg:text-4xl text-choco-900 tracking-tight leading-tight">
                    Belajar Web3 dengan santai, 3 menit sehari.
                  </h1>
                  <p className="text-xs sm:text-sm font-semibold text-choco-700 mt-2 leading-relaxed">
                    Pahami wallet, smart contract, DeFi, dan keamanan on-chain lewat simulasi interaktif tanpa perlu modal dan tanpa risiko finansial.
                  </p>
                </div>

                {/* 3 Core Highlights (Tactile 3D Retro Arcade Candy Pods) */}
                <div className="space-y-3.5">
                  <div className="flex items-center gap-4 rounded-3xl border-2 border-choco-900 bg-white hover:bg-amber-50/50 p-4 shadow-[0_4px_0_#3B2218] hover:translate-y-[-2px] hover:shadow-[0_6px_0_#3B2218] active:translate-y-0.5 active:shadow-[0_2px_0_#3B2218] transition-all">
                    <div className="size-12 shrink-0 rounded-2xl border-2 border-choco-900 bg-amber-200 p-2 shadow-[0_2px_0_#3B2218] flex items-center justify-center">
                      <img src="/props/book.png" alt="Modul Belajar" className="size-7 object-contain pixelated" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-pixel text-xs sm:text-sm font-bold text-choco-900">20 Rute Pulau Rantai</span>
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-pixel font-bold bg-amber-300 text-choco-900 border-2 border-choco-900 shadow-[0_1.5px_0_#3B2218]">
                          Santai
                        </span>
                      </div>
                      <p className="text-xs font-semibold text-choco-700 mt-1 leading-snug">
                        Mulai dari nol apa itu blockchain sampai simulasi smart contract. Bahasa manusia, bukan bahasa alien.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 rounded-3xl border-2 border-choco-900 bg-white hover:bg-emerald-50/50 p-4 shadow-[0_4px_0_#3B2218] hover:translate-y-[-2px] hover:shadow-[0_6px_0_#3B2218] active:translate-y-0.5 active:shadow-[0_2px_0_#3B2218] transition-all">
                    <div className="size-12 shrink-0 rounded-2xl border-2 border-choco-900 bg-emerald-200 p-2 shadow-[0_2px_0_#3B2218] flex items-center justify-center">
                      <img src="/props/shield.png" alt="Simulasi Aman" className="size-7 object-contain pixelated" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-pixel text-xs sm:text-sm font-bold text-choco-900">100% Simulasi Bebas Boncos</span>
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-pixel font-bold bg-emerald-400 text-white border-2 border-choco-900 shadow-[0_1.5px_0_#3B2218]">
                          Tanpa Modal
                        </span>
                      </div>
                      <p className="text-xs font-semibold text-choco-700 mt-1 leading-snug">
                        Latihan kirim transaksi & kenali jebakan phising di sandbox aman. Gak bakal keluar duit sepeser pun.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 rounded-3xl border-2 border-choco-900 bg-white hover:bg-pink-50/50 p-4 shadow-[0_4px_0_#3B2218] hover:translate-y-[-2px] hover:shadow-[0_6px_0_#3B2218] active:translate-y-0.5 active:shadow-[0_2px_0_#3B2218] transition-all">
                    <div className="size-12 shrink-0 rounded-2xl border-2 border-choco-900 bg-candy-200 p-2 shadow-[0_2px_0_#3B2218] flex items-center justify-center">
                      <img src="/props/star.png" alt="Hadiah & Koin" className="size-7 object-contain pixelated" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-pixel text-xs sm:text-sm font-bold text-choco-900">Koin & Tiket Undian</span>
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-pixel font-bold bg-candy-500 text-white border-2 border-choco-900 shadow-[0_1.5px_0_#3B2218]">
                          Reward
                        </span>
                      </div>
                      <p className="text-xs font-semibold text-choco-700 mt-1 leading-snug">
                        Kumpulin XP, rawat streak harian, dan ikut undian hadiah dalam aplikasi setiap minggu.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="w-full py-3.5 px-6 rounded-full bg-candy-500 hover:bg-candy-600 text-white font-pixel font-bold text-sm sm:text-base border-2 border-choco-900 shadow-[0_4px_0_#3B2218] active:translate-y-1 active:shadow-[0_1px_0_#3B2218] cursor-pointer flex items-center justify-center gap-2.5 transition-all"
                  >
                    <span>Mulai Sekarang</span>
                    <ArrowRight className="size-5" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 1: Username & Password (Register or Login in-place) */}
            {step === 1 && (
              <div className="space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div>
                    <h1 className="font-display font-black text-xl sm:text-2xl text-choco-900 tracking-tight">
                      {authMode === "register" ? "Buat Akun Petualang" : "Masuk ke Akun"}
                    </h1>
                    <p className="text-xs sm:text-sm font-semibold text-choco-700 mt-1">
                      {authMode === "register"
                        ? "Username unik tersimpan di database. Tidak bisa dipakai orang lain."
                        : "Gunakan username unik dan password akun Web3min milikmu."}
                    </p>
                  </div>

                  {/* Quick Mode Toggle Pill */}
                  <div className="inline-flex rounded-full bg-cream-100 border-2 border-choco-900 p-1 shadow-[0_2px_0_#3B2218] shrink-0 self-start sm:self-auto">
                    <button
                      type="button"
                      onClick={() => {
                        setAuthMode("register");
                        setFormError(null);
                      }}
                      className={cn(
                        "px-3.5 py-1 rounded-full text-xs font-pixel font-bold transition-all cursor-pointer",
                        authMode === "register"
                          ? "bg-candy-500 text-white border border-choco-900 shadow-[0_1.5px_0_#3B2218]"
                          : "text-choco-700 hover:text-choco-900"
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
                        "px-3.5 py-1 rounded-full text-xs font-pixel font-bold transition-all cursor-pointer",
                        authMode === "login"
                          ? "bg-candy-500 text-white border border-choco-900 shadow-[0_1.5px_0_#3B2218]"
                          : "text-choco-700 hover:text-choco-900"
                      )}
                    >
                      Masuk
                    </button>
                  </div>
                </div>

                <form
                  className="space-y-3 pt-1"
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (authMode === "register") {
                      void goUsernameNext();
                    } else {
                      void handleLogin();
                    }
                  }}
                >
                  <div>
                    <label className="text-xs font-pixel font-bold text-choco-900 block mb-1" htmlFor="username">
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
                        className="w-full h-13 px-4 rounded-2xl bg-white border-3 border-choco-900 text-sm font-bold text-choco-900 placeholder:text-choco-400 shadow-[0_3px_0_#3B2218] focus:border-candy-500 focus:shadow-[0_4px_0_#3B2218] outline-none transition-all"
                        autoFocus
                        autoComplete="username"
                      />
                      <span className="absolute right-3.5 top-3.5 text-xs font-pixel font-bold text-choco-500">
                        {username.length}/16
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-pixel font-bold text-choco-900 block mb-1" htmlFor="password">
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
                      onFocus={() => setIsTypingPassword(true)}
                      onBlur={() => setIsTypingPassword(false)}
                      autoComplete={authMode === "register" ? "new-password" : "current-password"}
                      className="w-full h-13 px-4 rounded-2xl bg-white border-3 border-choco-900 text-sm font-bold text-choco-900 placeholder:text-choco-400 shadow-[0_3px_0_#3B2218] focus:border-candy-500 focus:shadow-[0_4px_0_#3B2218] outline-none transition-all"
                      placeholder="Minimal 6 karakter"
                    />
                  </div>

                  {authMode === "register" && (
                    <div>
                      <label className="text-xs font-pixel font-bold text-choco-900 block mb-1" htmlFor="password2">
                        Ulangi Password
                      </label>
                      <input
                        id="password2"
                        type="password"
                        value={password2}
                        onChange={(e) => {
                          setPassword2(e.target.value);
                          setFormError(null);
                        }}
                        onFocus={() => setIsTypingPassword(true)}
                        onBlur={() => setIsTypingPassword(false)}
                        autoComplete="new-password"
                        className="w-full h-13 px-4 rounded-2xl bg-white border-3 border-choco-900 text-sm font-bold text-choco-900 placeholder:text-choco-400 shadow-[0_3px_0_#3B2218] focus:border-candy-500 focus:shadow-[0_4px_0_#3B2218] outline-none transition-all"
                        placeholder="Ulangi password yang sama"
                      />
                    </div>
                  )}

                  {formError ? (
                    <div className="p-3 rounded-2xl bg-rose-100 border-2 border-rose-500 text-rose-900 text-xs font-bold shadow-[0_2px_0_#E11D48] flex items-center gap-1.5">
                      <AlertTriangle className="size-4 text-rose-600 shrink-0" />
                      <span>{formError}</span>
                    </div>
                  ) : null}

                  <div className="pt-1 text-xs font-bold text-choco-600">
                    {authMode === "register" ? (
                      <>
                        Sudah punya akun?{" "}
                        <button
                          type="button"
                          onClick={() => {
                            setAuthMode("login");
                            setFormError(null);
                          }}
                          className="text-candy-600 font-pixel font-bold hover:underline cursor-pointer ml-1"
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
                          className="text-candy-600 font-pixel font-bold hover:underline cursor-pointer ml-1"
                        >
                          Daftar akun baru
                        </button>
                      </>
                    )}
                  </div>

                  <div className="flex flex-col-reverse sm:flex-row gap-3 pt-3">
                    <button
                      type="button"
                      onClick={() => {
                        if (authMode === "login") {
                          setAuthMode("register");
                          setFormError(null);
                        } else {
                          setStep(0);
                        }
                      }}
                      className="py-3 px-5 rounded-full bg-white hover:bg-cream text-choco-900 font-pixel font-bold text-xs border-2 border-choco-900 shadow-[0_2.5px_0_#3B2218] active:translate-y-0.5 cursor-pointer"
                    >
                      Kembali
                    </button>
                    <button
                      type="submit"
                      disabled={busy}
                      className="flex-1 py-3 px-5 rounded-full bg-candy-500 hover:bg-candy-600 disabled:opacity-50 text-white font-pixel font-bold text-xs sm:text-sm border-2 border-choco-900 shadow-[0_4px_0_#3B2218] active:translate-y-1 active:shadow-[0_1px_0_#3B2218] cursor-pointer flex items-center justify-center gap-2 transition-all"
                    >
                      <span>
                        {busy
                          ? authMode === "register"
                            ? "Memeriksa..."
                            : "Memproses..."
                          : authMode === "register"
                            ? "Lanjut ke Target"
                            : "Masuk Sekarang"}
                      </span>
                      <ArrowRight className="size-4" />
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Step 2: Daily Goal */}
            {step === 2 && (
              <div className="space-y-5">
                <div>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-lemon border-2 border-choco-900 text-choco-900 font-pixel text-[9px] font-bold shadow-[0_1.5px_0_#3B2218] mb-1.5">
                    KOMITMEN BELAJAR
                  </span>
                  <h1 className="font-display font-black text-2xl sm:text-3xl text-choco-900 tracking-tight">
                    Tentukan Target Harianmu
                  </h1>
                  <p className="text-xs sm:text-sm font-semibold text-choco-700 mt-1">
                    Belajar konsisten beberapa menit tiap hari untuk membangun streak dan menjaga nyawa.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3.5 pt-1">
                  {GOALS.map((g) => {
                    const isSelected = goal === g.value;
                    return (
                      <button
                        key={g.value}
                        type="button"
                        onClick={() => handleSelectGoal(g)}
                        className={`p-4 rounded-3xl text-left border-2 transition-all cursor-pointer flex flex-col justify-between ${
                          isSelected
                            ? "bg-candy-100 border-candy-600 shadow-[0_4px_0_#B01F62] scale-[1.02]"
                            : "bg-white border-choco-900 shadow-[0_3px_0_#3B2218] hover:translate-y-[-2px] hover:shadow-[0_5px_0_#3B2218]"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="size-8 rounded-full bg-white border-2 border-choco-900 flex items-center justify-center shrink-0 shadow-[0_1.5px_0_#3B2218]">
                              <img
                                src={`/mascot/${g.mood}.png`}
                                alt=""
                                className="size-5 pixelated object-contain"
                              />
                            </span>
                            <span className="font-pixel text-xs font-bold text-choco-900">{g.label}</span>
                          </div>
                          {isSelected ? (
                            <span className="size-5 rounded-full bg-candy-500 text-white flex items-center justify-center shadow-xs border border-choco-900">
                              <Check className="size-3" strokeWidth={3} />
                            </span>
                          ) : (
                            <span className="font-pixel text-[9px] font-bold px-2 py-0.5 rounded-full bg-cream border border-choco-900 text-choco-700">
                              {g.value} XP
                            </span>
                          )}
                        </div>
                        <div className="mt-3">
                          <div className="font-pixel text-xs font-bold text-candy-600">{g.desc}</div>
                          <div className="text-[11px] font-bold text-choco-600 mt-0.5">{g.modules}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>

                <div className="flex flex-col-reverse sm:flex-row gap-3 pt-3">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="py-3 px-5 rounded-full bg-white hover:bg-cream text-choco-900 font-pixel font-bold text-xs border-2 border-choco-900 shadow-[0_2.5px_0_#3B2218] active:translate-y-0.5 cursor-pointer"
                  >
                    Kembali
                  </button>
                  <button
                    type="button"
                    onClick={() => void finish()}
                    disabled={busy}
                    className="flex-1 py-3 px-5 rounded-full bg-candy-500 hover:bg-candy-600 disabled:opacity-50 text-white font-pixel font-bold text-xs sm:text-sm border-2 border-choco-900 shadow-[0_4px_0_#3B2218] active:translate-y-1 active:shadow-[0_1px_0_#3B2218] cursor-pointer flex items-center justify-center gap-2 transition-all"
                  >
                    <span>{busy ? "Mendaftarkan…" : "Mulai Petualangan!"}</span>
                    <ArrowRight className="size-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
