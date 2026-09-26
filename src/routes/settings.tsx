import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { Dialog } from "@/components/dialog";
import { DuoButton } from "@/components/duo-button";
import { sanitizeTwitter } from "@/lib/people";
import { saveTwitterToServer, rpcDeleteMyAccount } from "@/lib/server-sync";
import { useProgress } from "@/lib/store";
import { Database, RefreshCw, CheckCircle, ShieldCheck, Lock, Trash2, Volume2, VolumeX, Check } from "lucide-react";

export const Route = createFileRoute("/settings")({ component: SettingsPage });

function SettingsPage() {
  const sound = useProgress((s) => s.sound);
  const setSound = useProgress((s) => s.setSound);
  const reduceMotion = useProgress((s) => s.reduceMotion);
  const setReduceMotion = useProgress((s) => s.setReduceMotion);
  const twitter = useProgress((s) => s.twitter);
  const setTwitter = useProgress((s) => s.setTwitter);
  const reset = useProgress((s) => s.reset);
  const [twDraft, setTwDraft] = useState(twitter);
  const [saved, setSaved] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [reported, setReported] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate();
  const dirty = twDraft !== twitter;

  const handleReset = async () => {
    setIsDeleting(true);
    try {
      await rpcDeleteMyAccount();
    } catch {
      // Best-effort server deletion
    }
    reset();
    setIsDeleting(false);
    setConfirm(false);
    void navigate({ to: "/" });
  };

  return (
    <AppShell>
      <main className="px-4 py-5 max-w-2xl mx-auto">
        <h1 className="text-[28px] font-extrabold leading-[34px] font-display text-choco-900">Pengaturan</h1>

        {/* Progress Synchronization Card */}
        <section className="mt-5 p-4 sm:p-5 rounded-3xl bg-cream border-3 border-choco-900 shadow-[0_4px_0_#3B2218] text-choco-900">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-2xl bg-amber-400 border-2 border-choco-900 flex items-center justify-center shadow-[0_2px_0_#3B2218]">
                <Database className="size-5 text-choco-900" />
              </div>
              <div>
                <span className="font-pixel text-[9px] uppercase font-bold text-choco-700 bg-amber-100 border border-choco-900 px-2 py-0.5 rounded-full">
                  Penyimpanan Cloud
                </span>
                <h3 className="font-pixel text-base font-bold text-choco-900 mt-0.5">
                  Sinkronisasi progres
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-100 border-2 border-emerald-700 text-emerald-800 font-pixel text-[10px] font-bold shadow-[0_2px_0_#15803D]">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600"></span>
                </span>
                TERHUBUNG
              </span>
            </div>
          </div>

          <p className="text-xs font-semibold text-choco-700 mt-2.5 leading-relaxed">
            Progres belajar, koin, dan streak kamu otomatis disinkronkan secara aman agar tidak hilang saat berganti perangkat atau browser.
          </p>
        </section>

        {/* X Account Section */}
        <section className="mt-5 p-4 sm:p-5 rounded-3xl bg-white border-2 border-choco-900 shadow-[0_4px_0_#3B2218]">
          <label className="block font-pixel text-xs font-bold text-choco-900 mb-1" htmlFor="tw">
            Username X (Twitter)
          </label>
          <div className="relative mt-1">
            <input
              id="tw"
              value={twDraft}
              onChange={(e) => setTwDraft(sanitizeTwitter(e.target.value))}
              placeholder="username tanpa @"
              className="w-full h-12 px-4 rounded-2xl bg-white border-2 border-choco-900 text-base sm:text-sm font-bold text-choco-900 placeholder:text-choco-400 shadow-[0_2px_0_#3B2218] focus:border-candy-500 outline-none"
              maxLength={15}
              autoCapitalize="off"
              autoCorrect="off"
              spellCheck={false}
              aria-describedby="tw-hint"
            />
          </div>
          <p id="tw-hint" className="mt-1.5 text-xs font-semibold text-choco-600">
            Hubungkan akun X agar teman dapat menemukan profilmu.
          </p>
          <button
            type="button"
            disabled={!dirty}
            onClick={() => {
              setTwitter(twDraft);
              void saveTwitterToServer(twDraft);
              setSaved(true);
              window.setTimeout(() => setSaved(false), 4000);
            }}
            className="mt-3 py-2.5 px-5 rounded-full bg-candy-800 hover:bg-candy-950 disabled:opacity-50 text-white font-pixel font-bold text-xs border-2 border-choco-900 shadow-[0_3px_0_#3B2218] active:translate-y-0.5 cursor-pointer transition-all"
          >
            Simpan Akun X
          </button>
          {saved ? (
            <p className="mt-2 text-xs font-bold text-emerald-700 bg-emerald-100 p-2.5 rounded-2xl border border-emerald-400 flex items-center gap-1.5" role="status" aria-live="polite">
              <Check className="size-4 text-emerald-700 shrink-0" />
              <span>Perubahan akun X berhasil disimpan!</span>
            </p>
          ) : null}
        </section>

        {/* Audio Setting */}
        <div className="mt-4 flex items-center justify-between gap-3 rounded-3xl bg-white border-2 border-choco-900 shadow-[0_4px_0_#3B2218] p-4 sm:p-5">
          <div>
            <p className="font-pixel text-xs font-bold text-choco-900">Efek Suara</p>
            <p className="text-xs font-semibold text-choco-600 mt-0.5">
              Mainkan sound effect saat menekan tombol, kuis, dan interaksi Blobi.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setSound(!sound)}
            className={`py-2 px-5 rounded-full font-pixel font-bold text-xs border-2 border-choco-900 shadow-[0_3px_0_#3B2218] active:translate-y-0.5 cursor-pointer transition-all flex items-center gap-1.5 ${
              sound
                ? "bg-candy-800 text-white"
                : "bg-cream text-choco-700"
            }`}
          >
            {sound ? <Volume2 className="size-3.5" /> : <VolumeX className="size-3.5" />}
            <span>{sound ? "Aktif" : "Mute"}</span>
          </button>
        </div>

        {/* Motion Accessibility Setting */}
        <div className="mt-3 flex items-center justify-between gap-3 rounded-3xl bg-white border-2 border-choco-900 shadow-[0_4px_0_#3B2218] p-4 sm:p-5">
          <div>
            <p className="font-pixel text-xs font-bold text-choco-900">Kurangi Gerakan</p>
            <p className="text-xs font-semibold text-choco-600 mt-0.5">
              Matikan animasi physics berulang untuk aksesibilitas & baterai hemat.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setReduceMotion(!reduceMotion)}
            className={`py-2 px-5 rounded-full font-pixel font-bold text-xs border-2 border-choco-900 shadow-[0_3px_0_#3B2218] active:translate-y-0.5 cursor-pointer transition-all ${
              reduceMotion
                ? "bg-candy-800 text-white"
                : "bg-cream text-choco-700"
            }`}
          >
            {reduceMotion ? "Aktif" : "Nonaktif"}
          </button>
        </div>

        {/* Links Navigation Grid */}
        <div className="mt-6 grid grid-cols-2 gap-3">
          <Link
            to="/cara"
            className="p-4 rounded-3xl bg-white hover:bg-cream border-2 border-choco-900 shadow-[0_3px_0_#3B2218] font-pixel text-xs font-bold text-choco-900 flex items-center justify-between transition-all"
          >
            <span>Cara Main</span>
            <span className="text-candy-700 font-bold">→</span>
          </Link>
          <Link
            to="/privacy"
            className="p-4 rounded-3xl bg-white hover:bg-cream border-2 border-choco-900 shadow-[0_3px_0_#3B2218] font-pixel text-xs font-bold text-choco-900 flex items-center justify-between transition-all"
          >
            <span>Privasi Data</span>
            <span className="text-candy-700 font-bold">→</span>
          </Link>
          <Link
            to="/about"
            className="p-4 rounded-3xl bg-white hover:bg-cream border-2 border-choco-900 shadow-[0_3px_0_#3B2218] font-pixel text-xs font-bold text-choco-900 flex items-center justify-between transition-all"
          >
            <span>Tentang Web3min</span>
            <span className="text-candy-700 font-bold">→</span>
          </Link>
          <Link
            to="/profile"
            className="p-4 rounded-3xl bg-white hover:bg-cream border-2 border-choco-900 shadow-[0_3px_0_#3B2218] font-pixel text-xs font-bold text-choco-900 flex items-center justify-between transition-all"
          >
            <span>Profil Petualang</span>
            <span className="text-candy-700 font-bold">→</span>
          </Link>
        </div>

        {/* Privacy Note */}
        <div className="mt-6 p-4 rounded-2xl bg-cream border-2 border-choco-900/30 text-xs font-semibold text-choco-600 leading-relaxed flex items-start gap-2.5">
          <Lock className="size-4 text-choco-600 shrink-0 mt-0.5" />
          <span>Data progres tersimpan di perangkat ini (local storage) & disinkronkan ke Supabase. Tidak ada koneksi dompet riil. Web3min tidak pernah meminta seed phrase atau private key dompetmu.</span>
        </div>

        {/* Reset Progress & Hapus Akun Action */}
        <div className="mt-8 pt-4 border-t-2 border-choco-900/10">
          <button
            type="button"
            onClick={() => setConfirm(true)}
            className="w-full py-3.5 px-5 rounded-full bg-white hover:bg-rose-50 text-rose-700 font-pixel font-bold text-xs border-2 border-rose-400 shadow-[0_3px_0_#E11D48] active:translate-y-0.5 cursor-pointer transition-all flex items-center justify-center gap-2"
          >
            <Trash2 className="size-4 text-rose-600" />
            <span>Hapus Akun & Reset Seluruh Progres</span>
          </button>
        </div>

        <Dialog
          open={confirm}
          title="Hapus akun & seluruh progres?"
          description="XP, streak, pelajaran, item, dan akun kamu akan dihapus permanen baik dari perangkat ini maupun dari server. Tindakan ini tidak dapat dibatalkan."
          onClose={() => !isDeleting && setConfirm(false)}
        >
          <div className="mt-4 flex gap-2">
            <button
              type="button"
              disabled={isDeleting}
              className="flex-1 py-2.5 px-5 rounded-full bg-white hover:bg-cream disabled:opacity-50 text-choco-900 font-pixel font-bold text-xs border-2 border-choco-900 shadow-[0_2.5px_0_#3B2218]"
              onClick={() => setConfirm(false)}
            >
              Batal
            </button>
            <button
              type="button"
              disabled={isDeleting}
              className="flex-1 py-2.5 px-5 rounded-full bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white font-pixel font-bold text-xs border-2 border-choco-900 shadow-[0_2.5px_0_#3B2218]"
              onClick={() => void handleReset()}
            >
              {isDeleting ? "Menghapus..." : "Ya, Hapus Akun"}
            </button>
          </div>
        </Dialog>
      </main>
    </AppShell>
  );
}
