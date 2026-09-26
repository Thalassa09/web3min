import { useState, useEffect } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowRight, AlertTriangle, X, Mail, KeyRound, CheckCircle2, ShieldAlert } from "lucide-react";
import { Mascot } from "@/components/mascot";
import { loginAccount, validateUsername, requestPasswordReset, confirmPasswordReset } from "@/lib/account";
import { sanitizeUsername } from "@/lib/people";

export const Route = createFileRoute("/masuk")({ component: MasukPage });

function MasukPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [isTypingPassword, setIsTypingPassword] = useState(false);

  // Reset Password State
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetStep, setResetStep] = useState<"request" | "verify">("request");
  const [resetUsername, setResetUsername] = useState("");
  const [resetCode, setResetCode] = useState("");
  const [resetNewPass, setResetNewPass] = useState("");
  const [resetConfirmPass, setResetConfirmPass] = useState("");
  const [resetMaskedEmail, setResetMaskedEmail] = useState("");
  const [resetBusy, setResetBusy] = useState(false);
  const [resetError, setResetError] = useState<string | null>(null);
  const [resetSuccess, setResetSuccess] = useState<string | null>(null);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && showResetModal) {
        setShowResetModal(false);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showResetModal]);

  async function handleRequestReset(e: React.FormEvent) {
    e.preventDefault();
    setResetError(null);
    const u = sanitizeUsername(resetUsername);
    if (!u) {
      setResetError("Ketik username akun kamu.");
      return;
    }
    setResetBusy(true);
    const res = await requestPasswordReset(u);
    setResetBusy(false);
    if (!res.ok) {
      setResetError(res.message || "Gagal meminta reset password.");
      return;
    }
    setResetMaskedEmail(res.maskedEmail || "email pemulihan kamu");
    setResetStep("verify");
  }

  async function handleConfirmReset(e: React.FormEvent) {
    e.preventDefault();
    setResetError(null);
    if (resetCode.trim().length !== 6) {
      setResetError("Kode verifikasi harus 6 digit.");
      return;
    }
    if (resetNewPass.length < 6) {
      setResetError("Password baru minimal 6 karakter.");
      return;
    }
    if (resetNewPass !== resetConfirmPass) {
      setResetError("Konfirmasi password baru tidak cocok.");
      return;
    }
    setResetBusy(true);
    const res = await confirmPasswordReset({
      username: sanitizeUsername(resetUsername),
      code: resetCode.trim(),
      newPassword: resetNewPass,
    });
    setResetBusy(false);
    if (!res.ok) {
      setResetError(res.message || "Gagal memperbarui password.");
      return;
    }
    setResetSuccess("Password berhasil diubah! Mengarahkan ke form masuk...");
    setUsername(resetUsername);
    setPassword(resetNewPass);
    setTimeout(() => {
      setShowResetModal(false);
      setResetStep("request");
      setResetCode("");
      setResetNewPass("");
      setResetConfirmPass("");
      setResetSuccess(null);
    }, 2000);
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const uErr = validateUsername(username);
    if (uErr) {
      setError(uErr);
      return;
    }
    setBusy(true);
    const res = await loginAccount({ username, password });
    setBusy(false);
    if (!res.ok) {
      setError(res.message);
      return;
    }
    void navigate({ to: "/" });
  }

  return (
    <main className="min-h-dvh bg-[#FDFBF7] flex items-center justify-center px-4 py-8 select-none">
      <div className="w-full max-w-md p-6 sm:p-8 rounded-[32px] bg-cream border-4 border-choco-900 shadow-[0_10px_0_#3B2218]">
        {/* Mascot & Title */}
        <div className="flex items-center gap-4 mb-6">
          <div className="size-20 rounded-2xl bg-linear-to-b from-[#FFF0F5] to-[#FCE7F3] border-3 border-choco-900 shadow-[0_4px_0_#3B2218] flex items-center justify-center shrink-0">
            <Mascot
              mood={isTypingPassword ? "sleep" : "wave"}
              size={64}
              hideParticles={isTypingPassword}
            />
          </div>
          <div>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-lemon border-2 border-choco-900 text-choco-900 font-pixel text-[9px] font-bold shadow-[0_1.5px_0_#3B2218]">
              LOGIN PETUALANG
            </span>
            <h1 className="font-display font-black text-2xl sm:text-3xl text-choco-900 mt-1">
              Masuk Akun
            </h1>
            <p className="text-xs font-bold text-choco-600 mt-0.5">
              {isTypingPassword ? (
                <span className="text-candy-700 font-bold">
                  Tenang, aku tutup mata... gak ngintip!
                </span>
              ) : (
                "Masukkan username & password kamu."
              )}
            </p>
          </div>
        </div>

        <form className="space-y-4" onSubmit={onSubmit}>
          <div>
            <label
              className="block font-pixel text-xs font-bold text-choco-900 mb-1.5"
              htmlFor="login-user"
            >
              Username
            </label>
            <input
              id="login-user"
              value={username}
              onChange={(e) => {
                setUsername(sanitizeUsername(e.target.value));
                setError(null);
              }}
              autoComplete="username"
              className="w-full h-13 px-4 rounded-2xl bg-white border-2 border-choco-900 text-sm font-bold text-choco-900 placeholder:text-choco-400 shadow-[0_2px_0_#3B2218] focus:border-candy-500 focus:shadow-[0_3px_0_#3B2218] outline-none transition-all"
              placeholder="contoh: satoshi atau blobi_fan"
              autoFocus
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label
                className="block font-pixel text-xs font-bold text-choco-900"
                htmlFor="login-pass"
              >
                Password
              </label>
              <button
                type="button"
                onClick={() => {
                  setResetUsername(username);
                  setResetError(null);
                  setResetSuccess(null);
                  setResetStep("request");
                  setShowResetModal(true);
                }}
                className="text-[11px] font-bold text-candy-700 hover:text-candy-700 hover:underline cursor-pointer"
              >
                Lupa Password?
              </button>
            </div>
            <input
              id="login-pass"
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError(null);
              }}
              onFocus={() => setIsTypingPassword(true)}
              onBlur={() => setIsTypingPassword(false)}
              autoComplete="current-password"
              className="w-full h-13 px-4 rounded-2xl bg-white border-2 border-choco-900 text-sm font-bold text-choco-900 placeholder:text-choco-400 shadow-[0_2px_0_#3B2218] focus:border-candy-500 focus:shadow-[0_3px_0_#3B2218] outline-none transition-all"
              placeholder="Masukkan password akun"
            />
          </div>

          {error && (
            <div className="p-3 rounded-2xl bg-rose-100 border-2 border-rose-500 text-rose-900 text-xs font-bold shadow-[0_2px_0_#E11D48] flex items-center gap-1.5">
              <AlertTriangle className="size-4 text-rose-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="pt-2">
            <button
              type="submit"
              disabled={busy}
              className="w-full py-4 px-6 rounded-full bg-candy-500 hover:bg-candy-600 disabled:opacity-50 text-white font-pixel font-bold text-sm sm:text-base border-2 border-choco-900 shadow-[0_4px_0_#3B2218] active:translate-y-1 active:shadow-[0_1px_0_#3B2218] cursor-pointer flex items-center justify-center gap-2.5 transition-all"
            >
              <span>{busy ? "Memeriksa Akun..." : "Masuk Sekarang"}</span>
              <ArrowRight className="size-5" />
            </button>
          </div>
        </form>

        <div className="mt-6 pt-4 border-t-2 border-choco-900/10 flex items-center justify-between text-xs">
          <span className="font-semibold text-choco-600">Belum punya akun?</span>
          <Link
            to="/onboarding"
            className="font-pixel font-bold text-candy-700 hover:text-candy-700 hover:underline"
          >
            Daftar Petualang Baru →
          </Link>
        </div>
      </div>

      {/* Modal Lupa Password */}
      {showResetModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="reset-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-choco-900/60 backdrop-blur-xs select-none"
        >
          <div className="relative w-full max-w-md rounded-[28px] bg-cream border-3 border-choco-900 p-5 sm:p-6 shadow-[0_8px_0_#3B2218] text-choco-900 space-y-4">
            {/* Header Modal */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="size-10 rounded-xl bg-candy-100 border-2 border-choco-900 flex items-center justify-center text-candy-700 shrink-0">
                  <KeyRound className="size-5" />
                </div>
                <div>
                  <h2 id="reset-modal-title" className="font-display font-black text-lg text-choco-900">
                    {resetStep === "request" ? "Pulihkan Kata Sandi" : "Masukkan Kode OTP"}
                  </h2>
                  <p className="text-xs font-bold text-choco-600">
                    {resetStep === "request"
                      ? "Kirim kode reset ke email pemulihan kamu."
                      : `Kode verifikasi dikirim ke ${resetMaskedEmail}`}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowResetModal(false)}
                className="size-8 rounded-full bg-white border-2 border-choco-900 shadow-[0_2px_0_#3B2218] flex items-center justify-center text-choco-900 hover:bg-slate-100 cursor-pointer transition-all"
                aria-label="Tutup"
              >
                <X className="size-4" />
              </button>
            </div>

            {/* Alert Error / Success */}
            {resetError && (
              <div className="p-3 rounded-2xl bg-rose-100 border-2 border-rose-500 text-rose-900 text-xs font-bold shadow-[0_2px_0_#E11D48] flex items-center gap-1.5">
                <ShieldAlert className="size-4 text-rose-600 shrink-0" />
                <span>{resetError}</span>
              </div>
            )}

            {resetSuccess && (
              <div className="p-3 rounded-2xl bg-emerald-100 border-2 border-emerald-600 text-emerald-950 text-xs font-bold shadow-[0_2px_0_#059669] flex items-center gap-1.5">
                <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
                <span>{resetSuccess}</span>
              </div>
            )}

            {/* Step 1: Input Username */}
            {resetStep === "request" ? (
              <form onSubmit={handleRequestReset} className="space-y-4">
                <div>
                  <label
                    htmlFor="reset-user"
                    className="block font-pixel text-xs font-bold text-choco-900 mb-1"
                  >
                    Username Akun
                  </label>
                  <input
                    id="reset-user"
                    type="text"
                    value={resetUsername}
                    onChange={(e) => {
                      setResetUsername(e.target.value);
                      setResetError(null);
                    }}
                    placeholder="contoh: satoshi"
                    autoComplete="username"
                    autoFocus
                    className="w-full h-12 px-3.5 rounded-xl bg-white border-2 border-choco-900 text-sm font-bold text-choco-900 placeholder:text-choco-400 shadow-[0_2px_0_#3B2218] focus:border-candy-500 outline-none transition-all"
                  />
                  <p className="text-[11px] font-semibold text-choco-500 mt-1">
                    Kami akan mencari email pemulihan yang telah kamu tautkan di profil.
                  </p>
                </div>

                <div className="pt-1">
                  <button
                    type="submit"
                    disabled={resetBusy || !resetUsername.trim()}
                    className="w-full py-3 px-5 rounded-full bg-candy-500 hover:bg-candy-600 disabled:opacity-50 text-white font-pixel font-bold text-xs sm:text-sm border-2 border-choco-900 shadow-[0_3px_0_#3B2218] active:translate-y-1 cursor-pointer flex items-center justify-center gap-2 transition-all"
                  >
                    <Mail className="size-4" />
                    <span>{resetBusy ? "Mengecek Akun & Mengirim..." : "Kirim Kode Reset"}</span>
                  </button>
                </div>
              </form>
            ) : (
              /* Step 2: Verify OTP & New Password */
              <form onSubmit={handleConfirmReset} className="space-y-3.5">
                <div>
                  <label
                    htmlFor="reset-code"
                    className="block font-pixel text-xs font-bold text-choco-900 mb-1"
                  >
                    Kode Verifikasi (6 Digit)
                  </label>
                  <input
                    id="reset-code"
                    type="text"
                    maxLength={6}
                    value={resetCode}
                    onChange={(e) => {
                      setResetCode(e.target.value.replace(/\D/g, ""));
                      setResetError(null);
                    }}
                    placeholder="123456"
                    autoFocus
                    className="w-full h-12 px-3.5 tracking-widest text-center font-mono font-black text-lg rounded-xl bg-white border-2 border-choco-900 text-choco-900 placeholder:text-choco-300 shadow-[0_2px_0_#3B2218] focus:border-candy-500 outline-none transition-all"
                  />
                </div>

                <div>
                  <label
                    htmlFor="reset-new-pass"
                    className="block font-pixel text-xs font-bold text-choco-900 mb-1"
                  >
                    Password Baru
                  </label>
                  <input
                    id="reset-new-pass"
                    type="password"
                    value={resetNewPass}
                    onChange={(e) => {
                      setResetNewPass(e.target.value);
                      setResetError(null);
                    }}
                    placeholder="Minimal 6 karakter"
                    autoComplete="new-password"
                    className="w-full h-11 px-3.5 rounded-xl bg-white border-2 border-choco-900 text-sm font-bold text-choco-900 placeholder:text-choco-400 shadow-[0_2px_0_#3B2218] focus:border-candy-500 outline-none transition-all"
                  />
                </div>

                <div>
                  <label
                    htmlFor="reset-conf-pass"
                    className="block font-pixel text-xs font-bold text-choco-900 mb-1"
                  >
                    Ulangi Password Baru
                  </label>
                  <input
                    id="reset-conf-pass"
                    type="password"
                    value={resetConfirmPass}
                    onChange={(e) => {
                      setResetConfirmPass(e.target.value);
                      setResetError(null);
                    }}
                    placeholder="Ketik ulang password baru"
                    autoComplete="new-password"
                    className="w-full h-11 px-3.5 rounded-xl bg-white border-2 border-choco-900 text-sm font-bold text-choco-900 placeholder:text-choco-400 shadow-[0_2px_0_#3B2218] focus:border-candy-500 outline-none transition-all"
                  />
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setResetStep("request");
                      setResetError(null);
                    }}
                    className="py-3 px-4 rounded-full bg-white hover:bg-slate-50 text-choco-900 font-pixel font-bold text-xs border-2 border-choco-900 shadow-[0_3px_0_#3B2218] active:translate-y-1 cursor-pointer transition-all"
                  >
                    Kembali
                  </button>
                  <button
                    type="submit"
                    disabled={resetBusy || resetCode.length !== 6 || !resetNewPass}
                    className="flex-1 py-3 px-4 rounded-full bg-mint hover:bg-mint-dark disabled:opacity-50 text-choco-900 font-pixel font-black text-xs sm:text-sm border-2 border-choco-900 shadow-[0_3px_0_#3B2218] active:translate-y-1 cursor-pointer flex items-center justify-center gap-1.5 transition-all"
                  >
                    <span>{resetBusy ? "Menyimpan..." : "Simpan & Masuk"}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
