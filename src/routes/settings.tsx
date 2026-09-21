import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { Dialog } from "@/components/dialog";
import { DuoButton } from "@/components/duo-button";
import { sanitizeTwitter } from "@/lib/people";
import { useProgress } from "@/lib/store";

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
  const dirty = twDraft !== twitter;

  return (
    <AppShell>
      <main className="px-4 py-5">
        <h1 className="text-[28px] font-extrabold leading-[34px]">Pengaturan</h1>

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
