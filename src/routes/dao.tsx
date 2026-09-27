import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  AlertTriangle,
  ArrowLeft,
  Check,
  Circle,
  ExternalLink,
  Loader2,
  Lock,
  ShieldAlert,
  Users,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { SurfaceCard } from "@/components/ui/surface-card";
import { TactileButton } from "@/components/ui/tactile-button";
import { SkeletonCards } from "@/components/ui/skeleton";
import { ProgressBar } from "@/components/ui/progress-bar";
import { buildMeta } from "@/lib/seo";
import { getLesson, getUnit } from "@/lib/curriculum";
import { checkDaoAccess, firstMissingId, type DaoPublic } from "@/lib/dao-core";
import { rpcClaimDaoInvite, rpcGetDaos } from "@/lib/dao-api";
import { useDaoStore } from "@/lib/dao-store";
import { useHydrated, useProgress } from "@/lib/store";
import { supabase } from "@/lib/supabase";
import { playDeny } from "@/lib/audio";

export const Route = createFileRoute("/dao")({
  head: () =>
    buildMeta({
      title: "Komunitas DAO web3min — gabung setelah lulus kuis",
      description:
        "Komunitas Discord web3min dan DAO pilihan. Buka dengan menyelesaikan kuis rutenya dulu — bukan dengan bayar.",
      path: "/dao",
    }),
  component: DaoPage,
});

/** "Rute 2 · Ujian rute 2" — label syarat yang enak dibaca. */
function requireLabel(lessonId: string): string {
  const lesson = getLesson(lessonId);
  if (!lesson) return lessonId;
  const unit = getUnit(lesson.unitId);
  return unit ? `Rute ${unit.index} · ${lesson.title}` : lesson.title;
}

type ClaimState = { claiming: boolean; error: string | null };

function DaoPage() {
  const hydrated = useHydrated();
  const completed = useProgress((s) => s.completed);
  const sound = useProgress((s) => s.sound);
  const joined = useDaoStore((s) => s.joined);
  const markJoined = useDaoStore((s) => s.markJoined);

  const [daos, setDaos] = useState<DaoPublic[] | null>(null);
  const [allowedHosts, setAllowedHosts] = useState<string[]>([]);
  const [loggedIn, setLoggedIn] = useState<boolean | null>(null);
  const [modalDao, setModalDao] = useState<DaoPublic | null>(null);
  const [claim, setClaim] = useState<ClaimState>({ claiming: false, error: null });

  // Muat daftar DAO (tanpa link undangan) + status login sekali.
  useEffect(() => {
    let alive = true;
    void rpcGetDaos().then((res) => {
      if (!alive) return;
      setDaos(res.daos);
      setAllowedHosts(res.allowedHosts);
    });
    if (supabase) {
      void supabase.auth.getSession().then(({ data }) => {
        if (alive) setLoggedIn(Boolean(data.session?.user));
      });
    } else {
      setLoggedIn(false);
    }
    return () => {
      alive = false;
    };
  }, []);

  // Modal bisa ditutup dengan Esc (wajib; tombol tutup saja tidak cukup).
  useEffect(() => {
    if (!modalDao) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") closeModal();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [modalDao]);

  function closeModal() {
    setModalDao(null);
    setClaim({ claiming: false, error: null });
  }

  async function handleClaim() {
    if (!modalDao || claim.claiming) return;
    setClaim({ claiming: true, error: null });
    const res = await rpcClaimDaoInvite(modalDao.id);
    if (!res.ok || !res.inviteUrl) {
      if (sound) playDeny();
      setClaim({ claiming: false, error: res.error || "Gagal mengambil undangan." });
      return;
    }
    markJoined(modalDao.id);
    // noopener+noreferrer: tab baru tidak boleh memegang referensi ke app ini.
    window.open(res.inviteUrl, "_blank", "noopener,noreferrer");
    closeModal();
  }

  // Skeleton sampai store ter-rehydrate DAN data server tiba — jangan pernah
  // menebak status kuis dari nilai default store (render pertama = kosong).
  const loading = !hydrated || daos === null || loggedIn === null;

  return (
    <AppShell>
      <main className="mx-auto w-full max-w-2xl px-4 pb-28 pt-6">
        <Link
          to="/profile"
          className="inline-flex items-center gap-1.5 min-h-11 text-xs font-bold text-choco-600 hover:text-choco-900 mb-4 rounded-full px-3 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-candy-600"
        >
          <ArrowLeft className="size-3.5" />
          Kembali ke profil
        </Link>

        <header className="text-center mb-6">
          <div className="inline-flex items-center justify-center size-14 rounded-2xl bg-gradient-to-b from-blush-50 to-blush-200 border-2 border-candy-600 shadow-[0_3px_0_#B01F62] mb-3">
            <Users className="size-7 text-choco-900" />
          </div>
          <h1 className="font-pixel text-2xl sm:text-3xl font-black text-choco-900">
            Komunitas DAO
          </h1>
          <p className="mt-2 text-sm font-semibold text-choco-700 leading-relaxed max-w-md mx-auto">
            Buka dengan kuis, bukan dengan bayar. Selesaikan kuis rutenya, lalu gabung
            komunitasnya.
          </p>
        </header>

        {loading ? (
          <SkeletonCards count={2} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 auto-rows-fr gap-4">
            {daos.map((dao) => {
              const access = checkDaoAccess(dao.requires, completed);
              const missingFirst = firstMissingId(dao.requires, completed);
              const isJoined = joined.includes(dao.id);
              return (
                <SurfaceCard key={dao.id} className="flex flex-col">
                  <div className="flex items-start justify-between gap-3">
                    {dao.logo ? (
                      <img
                        src={dao.logo}
                        alt=""
                        className={`size-12 shrink-0 rounded-2xl border-2 border-choco-900/20 object-cover ${
                          access.unlocked ? "" : "grayscale opacity-70"
                        }`}
                      />
                    ) : (
                      <div className="size-12 shrink-0 rounded-2xl border-2 border-choco-900/20 bg-cream" />
                    )}
                    {!dao.available ? (
                      <span className="inline-flex items-center gap-1 rounded-full border-2 border-coin-shadow bg-coin-fill px-2.5 py-0.5 text-[11px] font-bold text-coin-ink shadow-[0_2px_0_#D9A400]">
                        <Lock className="size-3" />
                        Segera hadir
                      </span>
                    ) : access.unlocked ? (
                      <span className="inline-flex items-center gap-1 rounded-full border-2 border-leaf-line bg-leaf-soft px-2.5 py-0.5 text-[11px] font-bold text-leaf-shadow shadow-[0_2px_0_#0F6045]">
                        <Check className="size-3" />
                        {isJoined ? "Sudah gabung" : "Terbuka"}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full border-2 border-choco-900 bg-choco-100 px-2.5 py-0.5 text-[11px] font-bold text-choco-600 shadow-[0_2px_0_#3B2218]">
                        <Lock className="size-3" />
                        Terkunci
                      </span>
                    )}
                  </div>

                  <div className="mt-3">
                    <h2 className="font-pixel text-lg font-black text-choco-900">{dao.name}</h2>
                    <div className="text-xs font-semibold text-choco-600">{dao.tagline}</div>
                  </div>
                  <p className="mt-1.5 text-xs font-semibold text-choco-700 leading-relaxed">
                    {dao.description}
                  </p>

                  <div className="mt-3">
                    <div className="flex items-center justify-between gap-2 text-[11px] font-bold text-choco-600">
                      <span>
                        {access.done.length}/{dao.requires.length} kuis
                      </span>
                      <span>{dao.category}</span>
                    </div>
                    <ProgressBar
                      value={access.done.length}
                      max={Math.max(1, dao.requires.length)}
                      size="sm"
                      className="mt-1.5"
                    />
                  </div>

                  <ul className="mt-3 space-y-1.5">
                    {dao.requires.map((reqId) => {
                      const isDone = access.done.includes(reqId);
                      return (
                        <li key={reqId} className="flex items-center gap-2 text-xs font-semibold">
                          {isDone ? (
                            <Check className="size-3.5 shrink-0 text-ok-ink" />
                          ) : (
                            <Circle className="size-3.5 shrink-0 text-choco-400" />
                          )}
                          <span className={isDone ? "text-choco-700" : "text-choco-600"}>
                            {requireLabel(reqId)}
                          </span>
                        </li>
                      );
                    })}
                  </ul>

                  <div className="mt-4 pt-3 border-t-2 border-choco-900/20 flex-1 flex items-end">
                    {!dao.available ? (
                      <TactileButton variant="secondary" disabled className="w-full">
                        Segera hadir
                      </TactileButton>
                    ) : !access.unlocked && missingFirst ? (
                      <Link
                        to="/lesson/$lessonId"
                        params={{ lessonId: missingFirst }}
                        className="inline-flex w-full items-center justify-center min-h-11 rounded-md border-2 border-choco-900 bg-gradient-to-b from-white via-cream-fill to-cream-fill-deep px-5 text-sm font-extrabold text-choco-900 shadow-[0_4px_0_#3B2218] transition-all hover:brightness-105 active:translate-y-[2px] active:shadow-none"
                      >
                        Kerjakan kuis dulu →
                      </Link>
                    ) : loggedIn === false ? (
                      <Link
                        to="/masuk"
                        className="inline-flex w-full items-center justify-center min-h-11 rounded-md border-2 border-candy-600 bg-gradient-to-b from-blush-50 to-blush-200 px-5 text-sm font-extrabold text-choco-900 shadow-[0_4px_0_#B01F62] transition-all hover:brightness-105 active:translate-y-[2px] active:shadow-none"
                      >
                        Masuk dulu →
                      </Link>
                    ) : (
                      <TactileButton
                        className="w-full"
                        icon={<ExternalLink className="size-3.5" />}
                        onClick={() => {
                          setClaim({ claiming: false, error: null });
                          setModalDao(dao);
                        }}
                      >
                        {isJoined ? "Buka Discord lagi" : "Gabung Discord"}
                      </TactileButton>
                    )}
                  </div>
                </SurfaceCard>
              );
            })}
          </div>
        )}

        <section className="mt-6 rounded-2xl border-2 border-choco-900/15 bg-cream p-4">
          <div className="flex items-start gap-2">
            <ShieldAlert className="size-3.5 shrink-0 text-choco-500 mt-0.5" />
            <p className="text-[11px] font-semibold text-choco-700 leading-relaxed">
              Link undangan hanya keluar setelah kuisnya selesai — dan hanya lewat server.
              Admin web3min tidak pernah menyapa duluan di DM dan tidak pernah minta seed
              phrase atau private key.
            </p>
          </div>
        </section>
      </main>

      {modalDao && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-choco-900/60 backdrop-blur-xs"
          onClick={closeModal}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="dao-modal-title"
            className="w-full max-w-md rounded-3xl border-2 border-choco-900 bg-cream p-5 shadow-[0_8px_0_#3B2218]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-2">
              <AlertTriangle className="size-5 shrink-0 text-warn-ink" />
              <h2 id="dao-modal-title" className="font-pixel text-lg font-black text-choco-900">
                Sebelum gabung {modalDao.name}
              </h2>
            </div>
            <ul className="mt-3 space-y-2 text-xs font-semibold text-choco-700 leading-relaxed">
              <li className="flex items-start gap-2">
                <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-choco-900" />
                Link undangan web3min selalu berawalan{" "}
                <strong>{allowedHosts.join(" atau ") || "server resmi web3min"}</strong>. Link
                dari tempat lain = bukan kami.
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-choco-900" />
                Admin asli <strong>tidak pernah DM duluan</strong> dan <strong>tidak pernah</strong>{" "}
                minta seed phrase atau private key. Yang minta itu penipu.
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-choco-900" />
                Waspadai bot <strong>“verify wallet”</strong> palsu di dalam server — verifikasi
                wallet tidak pernah butuh tanda tangan atau seed.
              </li>
            </ul>

            {claim.error && (
              <p className="mt-3 rounded-xl border-2 border-ruby-line bg-ruby-soft-bg px-3 py-2 text-xs font-bold text-err-ink">
                {claim.error}
              </p>
            )}

            <div className="mt-4 flex flex-col sm:flex-row gap-2 justify-end">
              <button
                type="button"
                onClick={closeModal}
                className="inline-flex items-center justify-center min-h-11 rounded-full border-2 border-choco-900/20 bg-white px-5 text-xs font-bold text-choco-900 transition hover:bg-cream focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-candy-600"
              >
                Batal
              </button>
              <TactileButton
                onClick={() => void handleClaim()}
                disabled={claim.claiming}
                icon={
                  claim.claiming ? <Loader2 className="size-3.5 animate-spin" /> : undefined
                }
              >
                {claim.claiming ? "Mengambil link…" : "Lanjut"}
              </TactileButton>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}
