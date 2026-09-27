import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { NAV_ITEMS, navActive } from "@/lib/nav";
import { playTap } from "@/lib/audio";
import { useProgress } from "@/lib/store";
import { firstPlayableId } from "@/lib/curriculum";
import { ArrowRight } from "@/lib/kicon";
import { cn } from "@/lib/utils";

// Gradient pink untuk TOMBOL AKSI "Lanjut" saja. Tab nav aktif TIDAK lagi
// memakainya — sejak permintaan user (2026-09-27) semua tab aktif memakai
// pastel rose (blush-50 -> blush-200, teks choco-900) seperti chip "Murid
// Blobi" di /profile. Jangan kembalikan tab ke ramp gelap ini.
//
// Ini versi GELAP dari
// brand pink: #FF6699/#E8437F/#D82668 hanya 3.79:1 di atas label putih (gagal
// WCAG AA untuk teks kecil). Jangan dikembalikan ke stop terang sebelum
// contrast-budget.test.ts ikut diubah.
//
// Stop 0% WAJIB candy-700 (#B01F62), bukan candy-600. Label nav aktif adalah
// teks 10px putih: candy-600 lolos saat diam (4.71:1) tapi `hover:brightness-110`
// di tombol "Lanjut" menaikkannya ke 4.0:1 — di bawah ambang. candy-700 aman di
// kedua state (6.53:1 diam, 5.62:1 hover), jadi label tidak perlu dihapus.
const CANDY_ACTIVE =
  "bg-gradient-to-b from-candy-700 via-candy-800 to-candy-900 shadow-[0_3px_0_#6E1239,0_6px_12px_rgba(232,67,127,0.25)]";

export function BottomNav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const sound = useProgress((s) => s.sound);
  const completed = useProgress((s) => s.completed);
  const navigate = useNavigate();

  // Tombol "Lanjut" = lanjutkan dari progres nyata, bukan halaman baru. Kalau
  // semua blok sudah selesai, tombol balik ke beranda — tidak pernah buntu.
  const nextId = firstPlayableId(completed);

  const goNext = () => {
    if (sound) playTap();
    if (nextId) void navigate({ to: "/lesson/$lessonId", params: { lessonId: nextId } });
    else void navigate({ to: "/" });
  };

  return (
    <nav
      aria-label="Navigasi Mobile"
      className="pointer-events-none fixed inset-x-0 bottom-2 z-40 px-3 pb-[max(0.5rem,env(safe-area-inset-bottom))] lg:hidden"
    >
      {/* 6 slot sama lebar: 5 item nav + tombol bulat "Lanjut". Dengan 5 item
          ganjil + 1 tombol, tepat-tengah geometris tidak bisa dicapai — jadi
          yang dijaga adalah batasan kerasnya: tiap tap target >= 44px, nol
          overlap, nol overflow.
          TERUKUR: 43.67x48 di 320px (KURANG 0.34px dari 44) — dulu diklaim
          "44x48 di 320px" dan klaim itu SALAH. Overhead 58px (px-3 parent 24 +
          px-2.5 child 20 + border 4 + gap 2x5) menyisakan 262px / 6 = 43.67.
          Obatnya: gap dihapus HANYA di bawah 360px -> 272/6 = 45.33px.
          Gap dikembalikan dari 360px ke atas supaya tampilan tidak berubah.
          JANGAN kembali ke 7 kolom + spacer: elemen ke-3 jatuh ke kolom spacer
          dan label "Arena" menciut jadi 12px (terbukti lewat pengukuran). */}
      <div className="pointer-events-auto mx-auto grid h-16 max-w-md grid-cols-6 items-center gap-0 min-[360px]:gap-0.5 rounded-full border-2 border-choco-900/20 bg-gradient-to-b from-white via-cream-fill to-cream-fill-deep px-2.5 backdrop-blur-2xl shadow-[0_5px_0_#3B2218,0_12px_28px_-4px_rgba(59,34,24,0.18)]">
        {NAV_ITEMS.slice(0, 3).map((item) => (
          <NavLink key={item.to} item={item} pathname={pathname} sound={sound} />
        ))}

        {/* Ikon saja tanpa teks: label putih di atas pink brand cuma 3.79:1 dan
            gagal WCAG AA untuk teks kecil, sedangkan ikon sebagai objek grafis
            cukup 3:1. Karena itu aria-label wajib ada. */}
        <button
          type="button"
          onClick={goNext}
          aria-label={nextId ? "Lanjut ke blok berikutnya" : "Kembali ke beranda"}
          title={nextId ? "Lanjut ke blok berikutnya" : "Semua blok selesai"}
          className={cn(
            // size-[min(52px,100%)] bukan size-13: di 320px kolom grid hanya
            // ~44px, tombol 52px meluber dan menimpa "Toko" (terbukti:
            // 149..201 vs 195..238). Ikut lebar kolom, tetap bulat, dan tetap
            // >= 44px sehingga tap target tidak hilang.
            "mx-auto grid size-[min(52px,100%)] shrink-0 place-items-center rounded-full border-2 border-candy-600/60 text-white",
            "transition-all duration-120 ease-out hover:brightness-110 active:scale-95 active:translate-y-0.5 active:shadow-[0_1px_0_#B01F62]",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-choco-900 focus-visible:ring-offset-2 focus-visible:ring-offset-cream-fill",
            CANDY_ACTIVE,
          )}
        >
          <ArrowRight className="size-6 stroke-[2.6]" weight="bold" />
        </button>

        {NAV_ITEMS.slice(3).map((item) => (
          <NavLink key={item.to} item={item} pathname={pathname} sound={sound} />
        ))}
      </div>
    </nav>
  );
}

function NavLink({
  item,
  pathname,
  sound,
}: {
  item: (typeof NAV_ITEMS)[number];
  pathname: string;
  sound: boolean;
}) {
  const active = navActive(pathname, item.to);
  const Icon = item.icon;
  return (
    <Link
      to={item.to}
      aria-current={active ? "page" : undefined}
      onClick={() => sound && playTap()}
      className={cn(
        "flex h-12 min-w-0 flex-col items-center justify-center rounded-2xl transition-all duration-120 ease-out active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-choco-900",
        active
          ? "border-2 border-candy-600 bg-gradient-to-b from-blush-50 to-blush-200 text-choco-900 shadow-[0_3px_0_#B01F62]"
          : "text-choco-900/60 hover:text-choco-900 hover:bg-white/60 font-bold",
      )}
    >
      <span className="grid size-5.5 place-items-center">
        <Icon
          className={cn(
            "size-5 shrink-0 transition-colors",
            active ? "text-choco-900 stroke-[2.4]" : "text-choco-900/70",
          )}
          weight={active ? "fill" : "regular"}
        />
      </span>
      <span
        className={cn(
          "mt-0.5 truncate text-[10px] tracking-[0.01em] leading-none",
          active ? "text-choco-900 font-extrabold" : "text-choco-900/70 font-bold",
        )}
      >
        {item.label}
      </span>
    </Link>
  );
}