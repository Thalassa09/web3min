import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { NAV_ITEMS, navActive } from "@/lib/nav";
import { playTap } from "@/lib/audio";
import { useProgress } from "@/lib/store";
import { firstPlayableId } from "@/lib/curriculum";
import { ArrowRight } from "@/lib/kicon";
import { cn } from "@/lib/utils";

// Gradient pink untuk elemen aktif & tombol "Lanjut". Ini versi GELAP dari
// brand pink: #FF6699/#E8437F/#D82668 hanya 3.79:1 di atas label putih (gagal
// WCAG AA untuk teks kecil). Jangan dikembalikan ke stop terang sebelum
// contrast-budget.test.ts ikut diubah.
//
// Stop 0% WAJIB candy-700 (#B01F62), bukan candy-600. Label nav aktif adalah
// teks 10px putih: candy-600 lolos saat diam (4.71:1) tapi `hover:brightness-110`
// di tombol "Lanjut" menaikkannya ke 4.0:1 — di bawah ambang. candy-700 aman di
// kedua state (6.53:1 diam, 5.62:1 hover), jadi label tidak perlu dihapus.
const CANDY_ACTIVE =
  "bg-gradient-to-b from-[#B01F62] via-[#85174A] to-[#6E1239] shadow-[0_3px_0_#6E1239,0_6px_12px_rgba(232,67,127,0.25)]";

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
          yang dijaga adalah batasan kerasnya: tiap tap target >= 44px
          (terukur: 44x48 di 320px, 50x48 di 360px, 62x48 di 430px), nol
          overlap, nol overflow.
          JANGAN kembali ke 7 kolom + spacer: elemen ke-3 jatuh ke kolom spacer
          dan label "Arena" menciut jadi 12px (terbukti lewat pengukuran). */}
      <div className="pointer-events-auto mx-auto grid h-16 max-w-md grid-cols-6 items-center gap-0.5 rounded-full border-2 border-choco-900/18 bg-gradient-to-b from-white via-[#FFF9F5] to-[#FDEEE4] px-2.5 backdrop-blur-2xl shadow-[0_5px_0_#3B2218,0_12px_28px_-4px_rgba(59,34,24,0.18)]">
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
            "transition-all duration-120 ease-out hover:brightness-110 active:translate-y-0.5 active:shadow-[0_1px_0_#B01F62]",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-choco-900 focus-visible:ring-offset-2 focus-visible:ring-offset-[#FFF9F5]",
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
          ? cn("border-2 border-candy-600/50 text-white", CANDY_ACTIVE)
          : "text-choco-900/60 hover:text-choco-900 hover:bg-white/60 font-bold",
      )}
    >
      <span className="grid size-5.5 place-items-center">
        <Icon
          className={cn(
            "size-5 shrink-0 transition-colors",
            active ? "text-white stroke-[2.4]" : "text-choco-900/70",
          )}
          weight={active ? "fill" : "regular"}
        />
      </span>
      <span
        className={cn(
          "mt-0.5 truncate text-[10px] tracking-[0.01em] leading-none",
          active ? "text-white font-extrabold" : "text-choco-900/70 font-bold",
        )}
      >
        {item.label}
      </span>
    </Link>
  );
}