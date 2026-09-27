import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { rpcGetPublicProfile, type PublicProfile } from "@/lib/server-sync";
import { buildMeta } from "@/lib/seo";
import { ArrowRight, Sparkles } from "lucide-react";

export const Route = createFileRoute("/u/$username")({
  /**
   * Meta per-halaman. TANPA ini, crawler (Twitter/WhatsApp/Telegram) membaca
   * judul situs untuk SEMUA tautan — jadi berbagi `/u/<nama>` akan tampil
   * sebagai "web3min — Belajar Web3 dari nol", bukan sebagai profil orangnya.
   * Terbukti lewat uji HTML mentah di produksi sebelum ini dipasang.
   *
   * Nama user TIDAK dimasukkan ke judul dari sisi klien: halaman publik
   * mencari username ASLI, dan untuk user tersensor nama itu sensitif.
   * Judul memakai nama apa adanya dari parameter URL — sama dengan yang
   * sudah publik di alamat tautannya sendiri.
   */
  head: ({ params }) => {
    const name = decodeURIComponent(params.username);
    return buildMeta({
      title: `@${name} — Profil Petualang web3min`,
      description: `Lihat progres belajar Web3 @${name} di web3min: XP, streak, dan blok yang sudah selesai.`,
      path: `/u/${params.username}`,
    });
  },
  component: PublicProfilePage,
});

/**
 * Halaman profil publik /u/<username> — bisa dibagikan ke siapa pun.
 *
 * Hanya menampilkan data yang MEMANG publik (sudah tampil di klasemen):
 * nama tampil, XP, streak, jumlah blok selesai, badge supporter.
 * TIDAK ada bio, twitter, wallet, atau email — RPC-nya sendiri tidak
 * mengembalikan kolom itu (lihat migrasi `get_public_profile`).
 *
 * Nama user tersensor sudah disamarkan oleh database (`get_display_name`),
 * jadi halaman ini tidak pernah membocorkan username asli.
 */
function PublicProfilePage() {
  const { username } = Route.useParams();
  const [profile, setProfile] = useState<PublicProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    void (async () => {
      const p = await rpcGetPublicProfile(username);
      if (!cancelled) {
        setProfile(p);
        setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [username]);

  // --- State: memuat (skeleton, bukan spinner) ---
  if (loading) {
    return (
      <AppShell>
        <main className="mx-auto max-w-2xl px-4 py-6 sm:py-8 select-none">
          <div className="animate-pulse space-y-4">
            <div className="h-40 rounded-3xl border-2 border-choco-900/20 bg-cream-fill" />
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="h-24 rounded-3xl border-2 border-choco-900/20 bg-cream-fill" />
              ))}
            </div>
          </div>
        </main>
      </AppShell>
    );
  }

  // --- State: tidak ditemukan ---
  if (!profile?.ok) {
    return (
      <AppShell>
        <main className="mx-auto max-w-2xl px-4 py-10 sm:py-14 select-none">
          <div className="rounded-3xl border-2 border-choco-900 bg-white p-6 sm:p-8 text-center shadow-[0_4px_0_#3B2218]">
            <img
              src="/mascot/sad.png"
              alt=""
              className="mx-auto size-20 object-contain pixelated"
            />
            <h1 className="mt-3 text-lg font-display font-black text-choco-900">
              Petualang tidak ditemukan
            </h1>
            <p className="mt-1.5 text-sm font-semibold text-choco-600">
              Tidak ada petualang bernama <span className="font-bold">@{username}</span> di web3min.
            </p>
            <Link
              to="/leaderboard"
              className="mt-5 inline-flex min-h-11 items-center justify-center gap-1.5 rounded-full border-2 border-candy-600 bg-gradient-to-b from-blush-50 to-blush-200 px-5 text-xs font-pixel font-bold text-choco-900 shadow-[0_3px_0_#B01F62] hover:brightness-105 active:translate-y-[2px] active:shadow-none transition"
            >
              Lihat klasemen
              <ArrowRight className="size-3.5" />
            </Link>
          </div>
        </main>
      </AppShell>
    );
  }

  // --- State: ada ---
  // Kelas warna diambil PERSIS dari kartu statistik /profile (patokan DESIGN.md §9),
  // bukan karangan: token yang tidak terdaftar di @theme akan gagal SENYAP.
  const stats = [
    {
      label: "Total XP",
      value: profile.xp,
      cls: "border-leaf-shadow bg-gradient-to-b from-leaf-soft via-leaf-fill to-leaf-fill-deep shadow-[0_4px_0_#0F6045]",
    },
    {
      label: "XP Mingguan",
      value: profile.weeklyXp,
      cls: "border-lemon-deep bg-gradient-to-b from-coin-fill via-coin-fill to-coin-fill-deep shadow-[0_4px_0_#D9A400]",
    },
    {
      label: "Streak",
      value: `${profile.streak} hari`,
      cls: "border-flame-shadow bg-gradient-to-b from-flame-soft via-flame-fill to-flame-slab shadow-[0_4px_0_#9A3412]",
    },
    {
      label: "Blok Selesai",
      value: profile.lessonsCompleted,
      cls: "border-candy-600 bg-gradient-to-b from-blush-50 via-blush-100 to-blush-200 shadow-[0_4px_0_#B01F62]",
    },
  ];

  return (
    <AppShell>
      <main className="mx-auto max-w-2xl px-4 py-6 sm:py-8 select-none">
        {/* Kartu identitas */}
        <div className="rounded-3xl border-2 border-choco-900 bg-gradient-to-b from-cream-fill via-cream-fill to-cream-fill-deep p-5 sm:p-6 shadow-[0_4px_0_#3B2218]">
          <div className="flex items-center gap-4">
            <span className="grid size-16 shrink-0 place-items-center rounded-full border-2 border-choco-900 bg-candy-100 shadow-[0_2px_0_#3B2218]">
              <img src="/mascot/idle.png" alt="" className="size-11 object-contain pixelated" />
            </span>
            <div className="min-w-0 flex-1">
              <span className="inline-flex items-center gap-1 rounded-full border-2 border-choco-900 bg-white px-2.5 py-0.5 font-pixel text-[10px] font-bold text-choco-900 shadow-[0_2px_0_#3B2218]">
                PROFIL PUBLIK
              </span>
              <h1 className="mt-1.5 truncate text-xl sm:text-2xl font-display font-black text-choco-900">
                @{profile.username}
              </h1>
              {profile.isSupporter && (
                <span className="mt-1.5 inline-flex items-center gap-1 rounded-full border-2 border-choco-900 bg-gradient-to-b from-coin-fill-top via-coin-fill-mid to-coin-fill-end px-2.5 py-0.5 font-pixel text-[10px] font-bold text-choco-900 shadow-[0_2px_0_#3B2218]">
                  <Sparkles className="size-3" />
                  {profile.supporterLifetime ? "SUPPORTER · LIFETIME" : "SUPPORTER"}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Baris kartu statistik — patokan DESIGN.md §9 */}
        <div className="mt-4 grid auto-rows-fr grid-cols-2 gap-4 sm:grid-cols-4">
          {stats.map((s) => (
            <div
              key={s.label}
              className={`flex flex-col rounded-3xl border-2 p-4 ${s.cls}`}
            >
              <span className="font-display text-xs font-bold uppercase tracking-wide text-choco-900/70">
                {s.label}
              </span>
              <span className="mt-1 font-display text-3xl font-bold tabular-nums text-choco-900">
                {s.value}
              </span>
            </div>
          ))}
        </div>

        {/* Ajakan main */}
        <div className="mt-5 rounded-3xl border-2 border-choco-900 bg-white p-5 text-center shadow-[0_4px_0_#3B2218]">
          <p className="text-sm font-semibold text-choco-800">
            Mau punya profil seperti ini? Belajar Web3 gratis, tanpa deposit.
          </p>
          <Link
            to="/onboarding"
            className="mt-4 inline-flex min-h-11 items-center justify-center gap-1.5 rounded-full border-2 border-candy-600 bg-gradient-to-b from-blush-50 to-blush-200 px-5 text-xs font-pixel font-bold text-choco-900 shadow-[0_3px_0_#B01F62] hover:brightness-105 active:translate-y-[2px] active:shadow-none transition"
          >
            Mulai belajar gratis
            <ArrowRight className="size-3.5" />
          </Link>
        </div>
      </main>
    </AppShell>
  );
}
