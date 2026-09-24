import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { TactileButton } from "@/components/ui/tactile-button";
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
    <main className="min-h-dvh bg-canvas flex items-center justify-center px-4 py-8 overflow-x-hidden select-none">
      <div className="w-full max-w-md p-6 sm:p-7 rounded-3xl bg-gradient-to-b from-white via-[#FFF9F5] to-[#FDEEE4] border-2 border-choco-900/18 shadow-[0_6px_0_#3B2218,0_12px_28px_-4px_rgba(59,34,24,0.14)]">
        <div className="flex items-center gap-3.5 mb-5">
          {/* Blobi on Tactile Pink Tile */}
          <div className="size-16 rounded-2xl bg-gradient-to-b from-[#FFF0F5] via-[#FFE4EC] to-[#FDC8D8] border-2 border-candy-500/40 shadow-[0_3px_0_#B01F62] flex items-center justify-center shrink-0">
            <Mascot
              mood={isTypingPassword ? "sleep" : "wave"}
              size={52}
              hideParticles={isTypingPassword}
            />
          </div>
          <div>
            <h1 className="font-display font-extrabold text-2xl text-choco-900">
              Masuk
            </h1>
            <p className="font-sans font-medium text-xs text-choco-600 mt-0.5">
              {isTypingPassword ? (
                <span className="text-candy-600 font-bold">
                  Tenang, aku tutup mata... gak ngintip!
                </span>
              ) : (
                "Username unik + password akunmu."
              )}
            </p>
          </div>
        </div>

        <form className="space-y-3.5" onSubmit={onSubmit}>
          <div>
            <label
              className="block font-sans text-xs font-bold uppercase tracking-wider text-choco-500 mb-1"
              htmlFor="login-user"
            >
              Username
            </label>
            <input
              id="login-user"
              value={username}
              onChange={(e) => setUsername(sanitizeUsername(e.target.value))}
              autoComplete="username"
              className="w-full h-12 px-4 rounded-xl bg-white/80 border-2 border-choco-900/20 text-sm font-bold text-choco-900 placeholder:text-choco-400 focus:outline-none focus:border-candy-500 focus:ring-2 focus:ring-candy-200 transition-all shadow-[inset_0_2px_4px_rgba(0,0,0,0.03)]"
              placeholder="contoh: satoshi atau blobi_fan"
            />
          </div>

          <div>
            <label
              className="block font-sans text-xs font-bold uppercase tracking-wider text-choco-500 mb-1"
              htmlFor="login-pass"
            >
              Password
            </label>
            <input
              id="login-pass"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => setIsTypingPassword(true)}
              onBlur={() => setIsTypingPassword(false)}
              autoComplete="current-password"
              className="w-full h-12 px-4 rounded-xl bg-white/80 border-2 border-choco-900/20 text-sm font-bold text-choco-900 focus:outline-none focus:border-candy-500 focus:ring-2 focus:ring-candy-200 transition-all shadow-[inset_0_2px_4px_rgba(0,0,0,0.03)]"
            />
          </div>

          {error && (
            <p className="font-sans text-xs font-bold text-danger bg-red-50 p-2.5 rounded-xl border border-red-300">
              {error}
            </p>
          )}

          <div className="pt-1">
            <TactileButton
              variant="primary"
              size="lg"
              fullWidth
              disabled={busy}
              icon={<ArrowRight className="size-5" />}
            >
              {busy ? "Memeriksa…" : "Masuk"}
            </TactileButton>
          </div>
        </form>

        <p className="mt-4 text-xs font-medium text-choco-500">
          Belum punya akun?{" "}
          <Link to="/onboarding" className="font-extrabold text-candy-600 hover:underline">
            Daftar Sekarang
          </Link>
        </p>
      </div>
    </main>
  );
}
