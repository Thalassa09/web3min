import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowRight, Lock, KeyRound } from "lucide-react";
import { Mascot } from "@/components/mascot";
import { loginAccount, validateUsername } from "@/lib/account";
import { sanitizeUsername } from "@/lib/people";

export const Route = createFileRoute("/masuk")({ component: MasukPage });

function MasukPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [isTypingPassword, setIsTypingPassword] = useState(false);

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
                <span className="text-candy-600 font-bold">
                  🙈 Tenang, aku tutup mata... gak ngintip!
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
              className="w-full h-13 px-4 rounded-2xl bg-white border-3 border-choco-900 text-sm font-bold text-choco-900 placeholder:text-choco-400 shadow-[0_3px_0_#3B2218] focus:border-candy-500 focus:shadow-[0_4px_0_#3B2218] outline-none transition-all"
              placeholder="contoh: satoshi atau blobi_fan"
              autoFocus
            />
          </div>

          <div>
            <label
              className="block font-pixel text-xs font-bold text-choco-900 mb-1.5"
              htmlFor="login-pass"
            >
              Password
            </label>
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
              className="w-full h-13 px-4 rounded-2xl bg-white border-3 border-choco-900 text-sm font-bold text-choco-900 placeholder:text-choco-400 shadow-[0_3px_0_#3B2218] focus:border-candy-500 focus:shadow-[0_4px_0_#3B2218] outline-none transition-all"
              placeholder="Masukkan password akun"
            />
          </div>

          {error && (
            <div className="p-3 rounded-2xl bg-rose-100 border-2 border-rose-500 text-rose-900 text-xs font-bold shadow-[0_2px_0_#E11D48]">
              ⚠️ {error}
            </div>
          )}

          <div className="pt-2">
            <button
              type="submit"
              disabled={busy}
              className="w-full py-4 px-6 rounded-2xl bg-candy-500 hover:bg-candy-600 disabled:opacity-50 text-white font-pixel font-bold text-sm sm:text-base border-3 border-choco-900 shadow-[0_4px_0_#3B2218] active:translate-y-1 active:shadow-[0_1px_0_#3B2218] cursor-pointer flex items-center justify-center gap-2.5 transition-all"
            >
              <span>{busy ? "Memeriksa Akun..." : "Masuk Sekarang 🚀"}</span>
              <ArrowRight className="size-5" />
            </button>
          </div>
        </form>

        <div className="mt-6 pt-4 border-t-2 border-choco-900/10 flex items-center justify-between text-xs">
          <span className="font-semibold text-choco-600">Belum punya akun?</span>
          <Link
            to="/onboarding"
            className="font-pixel font-bold text-candy-600 hover:text-candy-700 hover:underline"
          >
            Daftar Petualang Baru →
          </Link>
        </div>
      </div>
    </main>
  );
}
