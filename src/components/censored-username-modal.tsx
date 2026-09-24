import * as React from "react";
import { AlertTriangle, Check, ShieldAlert, Sparkles } from "lucide-react";
import { useProgress } from "@/lib/store";
import { playClaim, playDeny, playTap } from "@/lib/audio";

export function CensoredUsernameModal() {
  const { username, usernameCensored, updateUsername } = useProgress();
  const [newUsername, setNewUsername] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);
  const [dismissedThisTurn, setDismissedThisTurn] = React.useState(false);

  if (!usernameCensored || dismissedThisTurn) {
    return null;
  }

  const cleanInput = newUsername.trim().toLowerCase();
  const isValidFormat = /^[a-z0-9_]{3,20}$/.test(cleanInput);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidFormat) {
      playDeny();
      setErrorMsg("Username harus 3-20 karakter berupa huruf kecil, angka, atau underscore (_).");
      return;
    }

    setLoading(true);
    setErrorMsg(null);
    try {
      const res = await updateUsername(cleanInput);
      if (res.success) {
        playClaim();
        setDismissedThisTurn(true);
      } else {
        playDeny();
        setErrorMsg(res.error || "Username tidak tersedia atau mengandung kata yang dilarang.");
      }
    } catch (err: unknown) {
      playDeny();
      setErrorMsg((err as Error)?.message || "Gagal mengubah username.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-choco-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-md rounded-[28px] border-3 border-choco-900 bg-cream p-5 sm:p-6 shadow-[0_8px_0_#3B2218] space-y-4 text-choco-900 animate-in zoom-in-95 duration-200">
        <div className="flex items-center gap-3 border-b-2 border-choco-900/15 pb-3">
          <div className="size-11 rounded-2xl border-2 border-choco-900 bg-amber-400 text-choco-900 flex items-center justify-center shadow-[0_2px_0_#3B2218] shrink-0">
            <ShieldAlert className="size-6 text-choco-900" />
          </div>
          <div>
            <span className="font-pixel text-[10px] font-bold uppercase text-amber-800 bg-amber-200 px-2 py-0.5 rounded-full border border-choco-900/30">
              Pedoman Komunitas
            </span>
            <h3 className="font-pixel text-base sm:text-lg font-bold text-choco-900 leading-tight mt-0.5">
              Pemberitahuan Username
            </h3>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-amber-100 border-2 border-choco-900/30 text-xs font-semibold text-choco-800 leading-relaxed space-y-2">
          <p>
            Username kamu tidak sesuai pedoman komunitas dan sementara ditampilkan sebagai{" "}
            <strong className="font-mono text-choco-900 bg-white/80 px-1.5 py-0.5 rounded border border-choco-900/20">
              {username}
            </strong>.
          </p>
          <p className="text-choco-700">
            Silakan pilih username baru yang ramah dan sopan. Progres, XP, koin, dan tiketmu tidak berubah.
          </p>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-2xl bg-rose-100 border-2 border-rose-500/50 text-rose-800 text-xs font-bold flex items-center gap-2">
            <AlertTriangle className="size-4 shrink-0 text-rose-600" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-[11px] font-bold text-choco-800 uppercase font-pixel mb-1">
              Pilih Username Baru (3-20 Karakter)
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-choco-400 font-bold text-xs">
                @
              </span>
              <input
                type="text"
                value={newUsername}
                onChange={(e) => {
                  setNewUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, "").slice(0, 20));
                  setErrorMsg(null);
                }}
                placeholder="nama_keren"
                autoFocus
                className="w-full pl-8 pr-3 py-2.5 rounded-xl border-2 border-choco-900 bg-white text-xs font-mono text-choco-900 placeholder:text-choco-400 focus:outline-none focus:ring-2 focus:ring-candy-500 shadow-[0_1.5px_0_#3B2218]"
              />
            </div>
            <p className="text-[10px] text-choco-500 font-medium mt-1">
              Gunakan huruf kecil, angka, dan garis bawah (_).
            </p>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading || !isValidFormat}
              className={`w-full py-3 rounded-full font-pixel text-xs font-bold border-2 border-choco-900 shadow-[0_3px_0_#3B2218] transition-transform active:translate-y-0.5 cursor-pointer flex items-center justify-center gap-2 ${
                isValidFormat && !loading
                  ? "bg-candy-500 hover:bg-candy-600 text-white"
                  : "bg-stone-200 text-stone-400 cursor-not-allowed shadow-none"
              }`}
            >
              {loading ? (
                <span>Menyimpan...</span>
              ) : (
                <>
                  <Check className="size-4 stroke-[3]" />
                  <span>Ganti Username Sekarang</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
