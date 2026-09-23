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
      <div className="w-full max-w-md p-6 sm:p-7 rounded-[16px] bg-white border-2 border-ink-900 shadow-[4px_4px_0_#1B1440]">
        <div className="flex items-center gap-3.5 mb-5">
          {/* Blobi on Pink Tile */}
          <div className="size-16 rounded-[14px] bg-blobi-soft border-2 border-ink-900 shadow-[2px_2px_0_#1B1440] flex items-center justify-center shrink-0">
            <Mascot
              mood={isTypingPassword ? "sleep" : "wave"}
              size={52}
              hideParticles={isTypingPassword}
            />
          </div>
          <div>
            <h1 className="font-sans font-extrabold text-2xl text-ink-900">
              Masuk
            </h1>
            <p className="font-sans font-medium text-xs text-ink-500 mt-0.5">
              {isTypingPassword ? (
                <span className="text-blobi font-bold">
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
              className="block font-['Pixelify_Sans'] text-xs font-bold uppercase tracking-wider text-ink-500 mb-1"
              htmlFor="login-user"
            >
              Username
            </label>
            <input
              id="login-user"
              value={username}
              onChange={(e) => setUsername(sanitizeUsername(e.target.value))}
              autoComplete="username"
              className="w-full h-12 px-4 rounded-[12px] bg-canvas border-2 border-ink-900 text-sm font-bold text-ink-900 placeholder:text-ink-500/50 focus:outline-none focus:ring-2 focus:ring-blobi"
              placeholder="contoh: satoshi atau blobi_fan"
            />
          </div>

          <div>
            <label
              className="block font-['Pixelify_Sans'] text-xs font-bold uppercase tracking-wider text-ink-500 mb-1"
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
              className="w-full h-12 px-4 rounded-[12px] bg-canvas border-2 border-ink-900 text-sm font-bold text-ink-900 focus:outline-none focus:ring-2 focus:ring-blobi"
            />
          </div>

          {error && (
            <p className="font-sans text-xs font-bold text-blobi bg-blobi-soft p-2.5 rounded-[8px] border-[1.5px] border-ink-900">
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

        <p className="mt-4 text-xs font-medium text-ink-500">
          Belum punya akun?{" "}
          <Link to="/onboarding" className="font-extrabold text-blobi hover:underline">
            Daftar Sekarang
          </Link>
        </p>
      </div>
    </main>
  );
}
