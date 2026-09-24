import { useState, useEffect } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { Dialog } from "@/components/dialog";
import { DuoButton } from "@/components/duo-button";
import { sanitizeTwitter } from "@/lib/people";
import { saveTwitterToServer, pingAndWakeDatabase, type DbPingResult } from "@/lib/server-sync";
import { useProgress } from "@/lib/store";
import { Database, Zap, RefreshCw, CheckCircle, AlertTriangle, ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/settings")({ component: SettingsPage });

function SettingsPage() {
  const sound = useProgress((s) => s.sound);
  const setSound = useProgress((s) => s.setSound);
  const reduceMotion = useProgress((s) => s.reduceMotion);
  const setReduceMotion = useProgress((s) => s.setReduceMotion);
  const pixelMode = useProgress((s) => s.pixelMode);
  const setPixelMode = useProgress((s) => s.setPixelMode);
  const twitter = useProgress((s) => s.twitter);
  const setTwitter = useProgress((s) => s.setTwitter);
  const reset = useProgress((s) => s.reset);
  const [twDraft, setTwDraft] = useState(twitter);
  const [saved, setSaved] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [reported, setReported] = useState(false);
  const dirty = twDraft !== twitter;

  const [dbPingLoading, setDbPingLoading] = useState(false);
  const [dbPingResult, setDbPingResult] = useState<DbPingResult | null>(null);

  const checkDb = async () => {
    setDbPingLoading(true);
    const res = await pingAndWakeDatabase();
    setDbPingResult(res);
    setDbPingLoading(false);
  };

  useEffect(() => {
    void checkDb();
  }, []);

  return (
    <AppShell>
      <main className="px-4 py-5 max-w-2xl mx-auto">
        <h1 className="text-[28px] font-extrabold leading-[34px] font-display text-choco-900">Pengaturan</h1>

        {/* Database Connection & Keep-Alive Status Card */}
        <section className="mt-5 p-4 sm:p-5 rounded-3xl bg-cream border-3 border-choco-900 shadow-[0_4px_0_#3B2218] text-choco-900">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-2xl bg-amber-400 border-2 border-choco-900 flex items-center justify-center shadow-[0_2px_0_#3B2218]">
                <Database className="size-5 text-choco-900" />
              </div>
              <div>
                <span className="font-pixel text-[9px] uppercase font-bold text-choco-700 bg-amber-100 border border-choco-900 px-2 py-0.5 rounded-full">
                  Postgres Supabase
                </span>
                <h3 className="font-pixel text-base font-bold text-choco-900 mt-0.5">
                  Status Database On-Chain
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {dbPingResult ? (
                dbPingResult.ok ? (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-100 border-2 border-emerald-500 text-emerald-800 font-pixel text-[10px] font-bold shadow-xs">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600"></span>
                    </span>
                    AKTIF ({dbPingResult.latencyMs}ms)
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-100 border-2 border-rose-500 text-rose-800 font-pixel text-[10px] font-bold">
                    <AlertTriangle className="size-3 text-rose-600" />
                    Tidur / Non-Aktif
                  </span>
                )
              ) : (
                <span className="font-pixel text-[10px] text-choco-500 animate-pulse">
                  Mengecek...
                </span>
              )}
            </div>
          </div>

          <p className="text-xs font-semibold text-choco-700 mt-2.5 leading-relaxed">
            Database tersambung ke Supabase Singapore (<code>ap-southeast-1</code>). Sistem otomatis menjalankan keep-alive heartbeat setiap 4 jam agar database tidak pernah auto-pause/tidur.
          </p>

          <div className="mt-3.5 flex items-center gap-2.5 flex-wrap">
            <button
              type="button"
              onClick={checkDb}
              disabled={dbPingLoading}
              className="py-2 px-4 rounded-full bg-candy-500 hover:bg-candy-600 disabled:opacity-50 text-white font-pixel font-bold text-xs border-2 border-choco-900 shadow-[0_2px_0_#3B2218] active:translate-y-0.5 active:shadow-none cursor-pointer flex items-center gap-1.5 transition-all"
            >
              <Zap className={`size-3.5 ${dbPingLoading ? "animate-spin" : ""}`} />
              <span>{dbPingLoading ? "Membangunkan Database..." : "⚡ Bangunkan & Ping Database"}</span>
            </button>
            <span className="text-[11px] font-mono text-choco-600">
              Host: oopfefvptezqonilpfkk
            </span>
          </div>
        </section>

        <section className="mt-5">
          <label className="block text-sm font-medium text-muted" htmlFor="tw">
            Username X
          </label>
          <input
            id="tw"
            value={twDraft}
            onChange={(e) => setTwDraft(sanitizeTwitter(e.target.value))}
            placeholder="username tanpa @"
            className="field mt-1"
            maxLength={15}
            autoCapitalize="off"
            autoCorrect="off"
            spellCheck={false}
            aria-describedby="tw-hint"
          />
          <p id="tw-hint" className="mt-1 text-sm leading-5 text-muted">
            Hubungkan akun X agar teman dapat menemukanmu.
          </p>
          <DuoButton
            size="sm"
            className="mt-3"
            disabled={!dirty}
            onClick={() => {
              setTwitter(twDraft);
              void saveTwitterToServer(twDraft);
              setSaved(true);
              window.setTimeout(() => setSaved(false), 4000);
            }}
          >
            Simpan akun X
          </DuoButton>
          {saved ? (
            <p className="mt-2 text-sm font-medium text-primary" role="status" aria-live="polite">
              Perubahan tersimpan.
            </p>
          ) : null}
        </section>

        <div className="mt-5 flex items-center justify-between gap-3 rounded-2xl bg-paper px-4 py-3">
          <div>
            <p className="font-bold">Efek suara</p>
            <p className="text-sm leading-5 text-muted">
              Mainkan suara saat menekan tombol, menjawab kuis, dan berinteraksi dengan maskot.
            </p>
          </div>
          <DuoButton variant={sound ? "primary" : "ghost"} onClick={() => setSound(!sound)}>
            {sound ? "Aktif" : "Nonaktif"}
          </DuoButton>
        </div>

        <div className="mt-3 flex items-center justify-between gap-3 rounded-2xl bg-paper px-4 py-3">
          <div>
            <p className="font-bold">Kurangi gerakan</p>
            <p className="text-sm leading-5 text-muted">
              Matikan animasi berulang. Tetap ada umpan balik singkat saat menjawab.
            </p>
          </div>
          <DuoButton variant={reduceMotion ? "primary" : "ghost"} onClick={() => setReduceMotion(!reduceMotion)}>
            {reduceMotion ? "Aktif" : "Nonaktif"}
          </DuoButton>
        </div>

        <div className="mt-3 flex items-center justify-between gap-3 rounded-2xl bg-paper px-4 py-3 border border-choco-900/10 shadow-[0_2px_0_rgba(59,34,24,0.06)]">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base select-none">{pixelMode ? "👾" : "✨"}</span>
              <p className="font-bold">Mode Retro Pixel</p>
            </div>
            <p className="text-sm leading-5 text-muted mt-0.5">
              Aktifkan tipografi 8-bit retro arcade, atau matikan untuk tampilan modern editorial Bricolage & Plus Jakarta Sans yang bersih, elegan, dan non-pasaran.
            </p>
          </div>
          <DuoButton
            variant={pixelMode ? "secondary" : "primary"}
            onClick={() => setPixelMode(!pixelMode)}
            className="shrink-0"
          >
            {pixelMode ? "🕹️ Pixel ON" : "✨ Modern"}
          </DuoButton>
        </div>

        <p className="mt-5 text-sm leading-5 text-muted">
          Data tersimpan di perangkat ini (penyimpanan lokal). Tidak ada koneksi wallet. web3min tidak mengumpulkan seed
          phrase, private key, atau password dompet.
        </p>

        <button
          type="button"
          className="mt-4 min-h-11 font-bold text-primary"
          onClick={() => setReported(true)}
        >
          Laporkan materi
        </button>
        {reported ? (
          <p className="mt-2 text-sm leading-5 text-muted" role="status" aria-live="polite">
            Terima kasih. Catatanmu tersimpan di perangkat. Materi ditinjau saat pembaruan berikutnya. Versi ini belum
            komunitas live.
          </p>
        ) : null}

        <Link to="/cara" className="mt-4 flex min-h-11 items-center font-bold text-primary">
          Cara main
        </Link>
        <Link to="/privacy" className="flex min-h-11 items-center font-bold text-primary">
          Kebijakan privasi
        </Link>
        <Link to="/about" className="flex min-h-11 items-center font-bold text-primary">
          Tentang web3min
        </Link>
        <Link to="/profile" className="flex min-h-11 items-center font-bold text-primary">
          Kembali ke profil
        </Link>

        <DuoButton variant="ghost" wide className="mt-8" onClick={() => setConfirm(true)}>
          Reset progres
        </DuoButton>
        <Dialog
          open={confirm}
          title="Reset seluruh progres?"
          description="XP, streak, pelajaran, item, dan pengaturan lokal akan dihapus. Tindakan ini tidak dapat dibatalkan."
          onClose={() => setConfirm(false)}
        >
          <div className="mt-4 flex gap-2">
            <DuoButton variant="ghost" className="flex-1" onClick={() => setConfirm(false)}>
              Batal
            </DuoButton>
            <DuoButton variant="danger" className="flex-1" onClick={reset}>
              Reset seluruh progres
            </DuoButton>
          </div>
        </Dialog>
      </main>
    </AppShell>
  );
}
