import { useCallback, useEffect, useRef, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  BadgeCheck,
  Heart,
  Ticket,
  Sparkles,
  Check,
  Loader2,
  AlertTriangle,
  RefreshCw,
  QrCode,
  Crown,
  ArrowLeft,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { SurfaceCard } from "@/components/ui/surface-card";
import { TactileButton } from "@/components/ui/tactile-button";
import {
  createSupporterOrder,
  checkSupporterOrder,
  rpcGetMySupporterStatus,
  type SupporterStatus,
} from "@/lib/server-sync";

export const Route = createFileRoute("/supporter")({ component: SupporterPage });

/** Harga ditentukan server. Angka ini hanya untuk tampilan. */
const PRICE_IDR = 9999;
const PRICE_NORMAL_IDR = 30000;

const BENEFITS = [
  {
    icon: BadgeCheck,
    title: "Badge OG Supporter",
    desc: "Lencana permanen di profil dan klasemen — tanda kamu ikut membangun web3min dari awal.",
  },
  {
    icon: Heart,
    title: "Isi nyawa 4× sehari",
    desc: "Pengguna biasa 2× sehari. Kamu dapat 4× — lebih sedikit menunggu, lebih banyak belajar.",
  },
  {
    icon: Ticket,
    title: "Tiket undian 3× lipat",
    desc: "Setiap tiket yang kamu beli bernilai 3 tiket di undian. Peluang menang lebih besar.",
  },
];

function formatRupiah(n: number): string {
  return `Rp ${n.toLocaleString("id-ID")}`;
}

type Phase =
  | { kind: "loading" }
  | { kind: "not-logged-in" }
  | { kind: "idle"; status: SupporterStatus }
  | { kind: "creating" }
  | { kind: "pending"; orderId: string; baseAmount: number; uniqueAmount: number; checkoutUrl?: string; expiresAt: number }
  | { kind: "activating" }
  | { kind: "done" }
  | { kind: "error"; message: string; hadOrder?: boolean };

function SupporterPage() {
  const [phase, setPhase] = useState<Phase>({ kind: "loading" });
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [checking, setChecking] = useState(false);
  // Apakah GatePay menambahkan kode unik ke nominal? Diambil dari respons
  // order nyata, bukan diasumsikan — merchant bisa mematikannya (disarankan
  // untuk GoPay), dan teks di bawah harus jujur mengikuti kenyataan itu.
  const hasUniqueCode =
    phase.kind === "pending" && phase.uniqueAmount > phase.baseAmount;
  const pollRef = useRef<number | null>(null);

  // ── Muat status awal ──────────────────────────────────────────────────────
  useEffect(() => {
    let alive = true;
    (async () => {
      const status = await rpcGetMySupporterStatus();
      if (!alive) return;
      if (status.isSupporter) {
        setPhase({ kind: "done" });
      } else if (!status.authenticated) {
        // Belum masuk: jangan tampilkan tombol bayar. Kalau ditampilkan, user
        // menekan tombol lalu dapat "Kamu harus masuk dulu" — dan kalau dia
        // sudah terlanjur transfer, pesan itu menyesatkan (terlihat seperti
        // pembayaran gagal padahal cuma belum login).
        setPhase({ kind: "not-logged-in" });
      } else {
        setPhase({ kind: "idle", status });
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  // ── Hitung mundur ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (phase.kind !== "pending") return;
    const tick = () => {
      const left = Math.max(0, Math.round((phase.expiresAt - Date.now()) / 1000));
      setSecondsLeft(left);
    };
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [phase]);

  // ── Polling status sebagai cadangan webhook ───────────────────────────────
  // Deteksi pembayaran GatePay bisa gagal (API internal / APK), jadi jangan
  // menggantungkan diri pada webhook saja.
  const verifyOrder = useCallback(
    async (orderId: string) => {
      setChecking(true);
      try {
        const res = await checkSupporterOrder(orderId);
        if (res.activated || res.status === "paid") {
          setPhase({ kind: "done" });
          return true;
        }
        if (res.status === "expired" || res.status === "cancelled") {
          setPhase({
            kind: "error",
            hadOrder: true,
            message: res.status === "expired" ? "Waktu pembayaran habis." : "Pembayaran dibatalkan.",
          });
          return true;
        }
        return false;
      } finally {
        setChecking(false);
      }
    },
    [],
  );

  useEffect(() => {
    if (phase.kind !== "pending") return;
    const orderId = phase.orderId;

    const id = window.setInterval(() => {
      void verifyOrder(orderId);
    }, 5000);

    return () => window.clearInterval(id);
  }, [phase, verifyOrder]);

  useEffect(() => {
    return () => {
      if (pollRef.current) window.clearInterval(pollRef.current);
    };
  }, []);

  // ── Aksi: buat order ──────────────────────────────────────────────────────
  const startPayment = async () => {
    setPhase({ kind: "creating" });
    const res = await createSupporterOrder();
    if (!res.ok || !res.orderId) {
      if (res.alreadySupporter) {
        setPhase({ kind: "done" });
        return;
      }
      // Belum login: arahkan ke halaman masuk, jangan tampilkan sebagai
      // "pembayaran gagal" — user belum pernah membuat order apa pun.
      if (/masuk dulu|sesi tidak valid|kedaluwarsa/i.test(res.error || "")) {
        setPhase({ kind: "not-logged-in" });
        return;
      }
      setPhase({ kind: "error", hadOrder: false, message: res.error || "Gagal membuat pembayaran." });
      return;
    }
    setPhase({
      kind: "pending",
      orderId: res.orderId,
      baseAmount: res.baseAmount ?? PRICE_IDR,
      uniqueAmount: res.uniqueAmount ?? PRICE_IDR,
      checkoutUrl: res.checkoutUrl,
      expiresAt: Date.now() + (res.expiresIn ?? 900) * 1000,
    });
  };

  // ── Render ────────────────────────────────────────────────────────────────
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

        {/* ── Header ─────────────────────────────────────────────────────── */}
        <header className="text-center mb-6">
          <div className="inline-flex items-center justify-center size-14 rounded-2xl bg-gradient-to-b from-lemon to-coin border-2 border-choco-900 shadow-[0_3px_0_#3B2218] mb-3">
            <Crown className="size-7 text-choco-900" />
          </div>
          <h1 className="font-pixel text-2xl sm:text-3xl font-black text-choco-900">
            Jadi Supporter web3min
          </h1>
          <p className="mt-2 text-sm font-semibold text-choco-700 leading-relaxed max-w-md mx-auto">
            Sekali bayar, akses permanen. Membantu web3min tetap gratis untuk semua orang.
          </p>
        </header>

        {/* ── Kartu harga ────────────────────────────────────────────────── */}
        <SurfaceCard className="mb-5">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wide text-choco-500">
                Harga perkenalan
              </div>
              <div className="flex items-baseline gap-2">
                <span className="font-pixel text-3xl font-black text-choco-900 tabular-nums">
                  {formatRupiah(PRICE_IDR)}
                </span>
                <span className="text-sm font-bold text-choco-500 line-through tabular-nums">
                  {formatRupiah(PRICE_NORMAL_IDR)}
                </span>
              </div>
              <div className="mt-1 text-xs font-bold text-ok-ink">
                Hemat {formatRupiah(PRICE_NORMAL_IDR - PRICE_IDR)} · sekali bayar
              </div>
            </div>
            <div className="text-right">
              <div className="text-[11px] font-bold uppercase tracking-wide text-choco-500">
                Bayar via
              </div>
              <div className="font-pixel text-sm font-black text-choco-900">QRIS</div>
              <div className="text-[11px] font-semibold text-choco-600">
                DANA · GoPay · OVO · m-banking
              </div>
            </div>
          </div>
        </SurfaceCard>

        {/* ── Keuntungan ─────────────────────────────────────────────────── */}
        <section className="space-y-3 mb-6">
          {BENEFITS.map((b) => {
            const Icon = b.icon;
            return (
              <div
                key={b.title}
                className="flex gap-3 rounded-2xl border-2 border-choco-900/20 bg-white p-4"
              >
                <div className="shrink-0 size-10 rounded-xl bg-candy-100 border-2 border-choco-900/20 flex items-center justify-center">
                  <Icon className="size-5 text-candy-700" />
                </div>
                <div className="min-w-0">
                  <div className="font-pixel text-sm font-black text-choco-900">{b.title}</div>
                  <p className="mt-0.5 text-xs font-semibold text-choco-700 leading-relaxed">
                    {b.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </section>

        {/* ── Aksi / state ───────────────────────────────────────────────── */}
        {phase.kind === "loading" && (
          <div className="rounded-2xl border-2 border-choco-900/20 bg-white p-6 flex items-center justify-center gap-2">
            <Loader2 className="size-4 animate-spin text-choco-500" />
            <span className="text-sm font-bold text-choco-600">Memeriksa status…</span>
          </div>
        )}

        {phase.kind === "not-logged-in" && (
          <SurfaceCard>
            <p className="text-sm font-bold text-choco-900 mb-3">
              Masuk dulu untuk jadi supporter.
            </p>
            <TactileButton onClick={() => (window.location.href = "/masuk")}>
              Masuk ke akun →
            </TactileButton>
          </SurfaceCard>
        )}

        {phase.kind === "idle" && (
          <div className="space-y-3">
            <TactileButton
              onClick={() => void startPayment()}
              className="w-full"
              aria-label={`Bayar ${formatRupiah(PRICE_IDR)} lewat QRIS`}
            >
              Bayar {formatRupiah(PRICE_IDR)} lewat QRIS →
            </TactileButton>
            <p className="text-center text-[11px] font-semibold text-choco-600 leading-relaxed">
              Pembayaran diproses otomatis. Kalau dalam 5 menit belum aktif, hubungi admin —
              uangmu tidak akan hilang.
            </p>
          </div>
        )}

        {phase.kind === "creating" && (
          <div className="rounded-2xl border-2 border-choco-900/20 bg-white p-6 flex items-center justify-center gap-2">
            <Loader2 className="size-4 animate-spin text-candy-700" />
            <span className="text-sm font-bold text-choco-700">Menyiapkan QRIS…</span>
          </div>
        )}

        {phase.kind === "pending" && (
          <SurfaceCard>
            <div className="flex items-center gap-2 mb-3">
              <QrCode className="size-4 text-choco-900" />
              <h2 className="font-pixel text-base font-black text-choco-900">
                Scan QRIS untuk bayar
              </h2>
            </div>

            {phase.checkoutUrl ? (
              <a
                href={phase.checkoutUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full rounded-2xl bg-candy-100 border-2 border-choco-900/20 p-6 text-center hover:brightness-[1.02] transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-candy-600"
              >
                <QrCode className="size-10 mx-auto text-candy-700 mb-2" />
                <span className="font-pixel text-sm font-black text-choco-900">
                  Buka halaman pembayaran →
                </span>
                <span className="block mt-1 text-[11px] font-semibold text-choco-600">
                  QR, nominal, dan hitung mundur ada di sana.
                </span>
              </a>
            ) : (
              <p className="text-sm font-semibold text-choco-700">
                Halaman pembayaran tidak tersedia. Coba ulangi.
              </p>
            )}

            <div className="mt-4 rounded-2xl bg-cream border-2 border-choco-900/15 p-4 space-y-2">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-bold text-choco-600">Jumlah yang harus dibayar</span>
                <span className="font-pixel text-lg font-black text-choco-900 tabular-nums">
                  {formatRupiah(phase.uniqueAmount)}
                </span>
              </div>
              <p className="text-[11px] font-semibold text-choco-700 leading-relaxed">
                Nominal ini <strong>sudah termasuk kode unik</strong> supaya pembayaranmu
                terdeteksi otomatis. Bayar dengan angka yang <strong>persis sama</strong> —
                kalau dibulatkan, sistem tidak bisa mencocokkan.
              </p>
            </div>

            <div className="mt-4 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                {checking ? (
                  <Loader2 className="size-3.5 animate-spin text-choco-500" />
                ) : (
                  <span className="size-2 rounded-full bg-warn-ink animate-pulse" />
                )}
                <span className="text-xs font-bold text-choco-600">
                  {checking ? "Memeriksa pembayaran…" : "Menunggu pembayaran…"}
                </span>
              </div>
              <span className="text-xs font-bold text-choco-700 tabular-nums">
                {Math.floor(secondsLeft / 60)}:{String(secondsLeft % 60).padStart(2, "0")}
              </span>
            </div>

            <button
              type="button"
              onClick={() => void verifyOrder(phase.orderId)}
              className="mt-3 w-full inline-flex items-center justify-center gap-1.5 min-h-11 rounded-full border-2 border-choco-900/20 bg-white text-choco-900 font-pixel font-bold text-xs hover:bg-cream transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-candy-600"
            >
              <RefreshCw className="size-3.5" />
              Sudah bayar? Cek sekarang
            </button>
          </SurfaceCard>
        )}

        {phase.kind === "activating" && (
          <div className="rounded-2xl border-2 border-choco-900/20 bg-white p-6 flex items-center justify-center gap-2">
            <Loader2 className="size-4 animate-spin text-ok-ink" />
            <span className="text-sm font-bold text-choco-700">Mengaktifkan supporter…</span>
          </div>
        )}

        {phase.kind === "done" && (
          <SurfaceCard>
            <div className="text-center py-2">
              <div className="inline-flex items-center justify-center size-14 rounded-2xl bg-gradient-to-b from-mint to-ok-shadow border-2 border-choco-900 shadow-[0_3px_0_#3B2218] mb-3">
                <BadgeCheck className="size-7 text-white" />
              </div>
              <h2 className="font-pixel text-xl font-black text-choco-900">
                Kamu supporter! 🎉
              </h2>
              <p className="mt-2 text-sm font-semibold text-choco-700 leading-relaxed">
                Badge OG aktif di profilmu, isi nyawa jadi 4× sehari, dan tiket undianmu bernilai
                3× lipat. Terima kasih sudah mendukung web3min.
              </p>
              <div className="mt-4 flex flex-col sm:flex-row gap-2 justify-center">
                <TactileButton onClick={() => (window.location.href = "/profile")}>
                  Lihat badge di profil →
                </TactileButton>
                <Link
                  to="/shop"
                  className="inline-flex items-center justify-center min-h-11 rounded-full border-2 border-choco-900/20 bg-white px-5 text-xs font-pixel font-bold text-choco-900 hover:bg-cream transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-candy-600"
                >
                  Ke toko
                </Link>
              </div>
            </div>
          </SurfaceCard>
        )}

        {phase.kind === "error" && (
          <SurfaceCard>
            <div className="flex items-start gap-2">
              <AlertTriangle className="size-4 shrink-0 text-err-ink mt-0.5" />
              <div className="min-w-0">
                <div className="font-pixel text-sm font-black text-choco-900">
                  Pembayaran belum bisa dimulai
                </div>
                <p className="mt-1 text-xs font-semibold text-choco-700 leading-relaxed">
                  {phase.message}
                </p>
                {phase.hadOrder && (
                  <p className="mt-1.5 text-xs font-semibold text-choco-700 leading-relaxed">
                    <strong>Kalau kamu sudah transfer</strong>, jangan bayar ulang — hubungi admin
                    dengan menyebut username-mu. Kami aktifkan manual.
                  </p>
                )}
                <button
                  type="button"
                  onClick={() => void startPayment()}
                  className="mt-3 inline-flex items-center gap-1.5 min-h-11 rounded-full border-2 border-choco-900 bg-gradient-to-b from-candy-600 via-candy-700 to-candy-800 px-5 text-xs font-pixel font-bold text-white shadow-[0_3px_0_#3B2218] hover:brightness-105 active:translate-y-[2px] active:shadow-none transition cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-choco-900"
                >
                  <RefreshCw className="size-3.5" />
                  Coba lagi
                </button>
              </div>
            </div>
          </SurfaceCard>
        )}

        {/* ── Catatan jujur ──────────────────────────────────────────────── */}
        <section className="mt-6 rounded-2xl border-2 border-choco-900/15 bg-cream p-4">
          <div className="flex items-start gap-2">
            <Sparkles className="size-3.5 shrink-0 text-choco-500 mt-0.5" />
            <div className="text-[11px] font-semibold text-choco-700 leading-relaxed space-y-1.5">
              {hasUniqueCode ? (
                <p>
                  <strong>Kenapa nominalnya bukan pas Rp 9.999?</strong> Sistem pembayaran
                  menambahkan kode unik beberapa rupiah supaya transaksimu terdeteksi otomatis.
                  Angka itu masuk ke kami, bukan potongan pihak ketiga.
                </p>
              ) : (
                <p>
                  <strong>Bayar persis Rp 9.999.</strong> Jangan dibulatkan atau dilebihkan —
                  nominal yang berbeda membuat pembayaranmu sulit dilacak.
                </p>
              )}
              <p>
                <strong>Belum punya QRIS?</strong> Bisa dibayar dari aplikasi apa pun yang punya
                menu QRIS: DANA, GoPay, OVO, ShopeePay, atau m-banking.
              </p>
              <p>
                <strong>Dana dipakai untuk apa?</strong> Biaya server, domain, dan hadiah undian.
                Tidak ada langganan tersembunyi — sekali bayar, akses permanen.
              </p>
              <p className="flex items-center gap-1.5 text-ok-ink">
                <Check className="size-3" />
                Sudah supporter tapi badge belum muncul? Masuk ulang lalu buka halaman ini.
              </p>
            </div>
          </div>
        </section>
      </main>
    </AppShell>
  );
}
