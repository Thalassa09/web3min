import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { TactileButton } from "@/components/ui/tactile-button";
import { SurfaceCard } from "@/components/ui/surface-card";
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

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(validateUsername(username));
    if (validateUsername(username)) return;
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
    <main className="min-h-screen bg-canvas flex items-center justify-center px-4 py-8">
      <SurfaceCard className="w-full max-w-md p-6 bg-white">
        <div className="flex items-center gap-3 mb-5">
          <Mascot mood="wave" size={56} />
          <div>
            <h1 className="font-display font-bold text-2xl text-[#0D2340]">Masuk</h1>
            <p className="text-xs font-medium text-[#4A6580]">Username unik + password akunmu.</p>
          </div>
        </div>
        <form className="space-y-3" onSubmit={onSubmit}>
          <label className="block text-xs font-extrabold text-[#1E3A5F]" htmlFor="login-user">
            Username
          </label>
          <input
            id="login-user"
            value={username}
            onChange={(e) => setUsername(sanitizeUsername(e.target.value))}
            autoComplete="username"
            className="w-full h-12 px-4 rounded-[14px] bg-[#F0F6FF] border-2 border-[#B9CFE9] text-sm font-bold text-[#0D2340]"
            placeholder="contoh: blobi_fan"
          />
          <label className="block text-xs font-extrabold text-[#1E3A5F]" htmlFor="login-pass">
            Password
          </label>
          <input
            id="login-pass"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            className="w-full h-12 px-4 rounded-[14px] bg-[#F0F6FF] border-2 border-[#B9CFE9] text-sm font-bold text-[#0D2340]"
          />
          {error ? <p className="text-xs font-semibold text-[#E63329]">{error}</p> : null}
          <TactileButton variant="primary" size="lg" fullWidth disabled={busy} icon={<ArrowRight className="size-5" />}>
            {busy ? "Memeriksa…" : "Masuk"}
          </TactileButton>
        </form>
        <p className="mt-4 text-xs font-medium text-[#4A6580]">
          Belum punya akun?{" "}
          <Link to="/onboarding" className="font-extrabold text-sky-600">
            Daftar
          </Link>
        </p>
      </SurfaceCard>
    </main>
  );
}
