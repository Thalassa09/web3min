import { Link, useRouterState } from "@tanstack/react-router";
import { NAV_ITEMS, navActive } from "@/lib/nav";
import { playTap } from "@/lib/audio";
import { useProgress } from "@/lib/store";
import { cn } from "@/lib/utils";

// Gradient pastel rose untuk TOMBOL AKSI "Lanjut". Sejak sweep "candy gelap ->
// pastel rose" (permintaan user, 2026-09-27) SELURUH elemen aktif — tab nav
// maupun tombol ini — memakai blush-50 -> blush-200 dengan label choco-900,
// seragam dengan chip "Murid Blobi" di /profile. Tidak ada lagi ramp gelap di
// nav; jangan dikembalikan.
//
// Label/ikon kini choco-900 di atas pastel. Kontras di stop TERGELAP
// (blush-200 #FDC8D8) = 10.11:1 — diukur `contrast-budget.test.ts`, yang juga
// memastikan nol `text-white` kembali ke berkas ini.
const CANDY_ACTIVE =
  "bg-gradient-to-b from-blush-50 to-blush-200 shadow-[0_3px_0_#B01F62,0_6px_12px_rgba(232,67,127,0.25)]";

export function BottomNav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const sound = useProgress((s) => s.sound);

  return (
    <nav
      aria-label="Navigasi Mobile"
      className="pointer-events-none fixed inset-x-0 bottom-2 z-40 px-3 pb-[max(0.5rem,env(safe-area-inset-bottom))] lg:hidden"
    >
      {/* 5 slot sama lebar untuk 5 tab nav. Tombol bulat "Lanjut" DIHAPUS atas
          permintaan user (2026-09-27): di HP tombol itu mengambang menutupi
          node peta rantai (#0x07 dan sekitarnya), sehingga blok di bawahnya
          sulit ditekan. Navigasi lanjut tetap tersedia lewat kartu "Lanjut"
          di beranda dan tombol di dalam peta — jadi nol fitur yang hilang.
          Grid dikembalikan ke 5 kolom supaya kelima tab melebar merata. */}
      <div className="pointer-events-auto mx-auto grid h-16 max-w-md grid-cols-5 items-center gap-0 min-[360px]:gap-0.5 rounded-full border-2 border-choco-900/20 bg-gradient-to-b from-white via-cream-fill to-cream-fill-deep px-2.5 backdrop-blur-2xl shadow-[0_5px_0_#3B2218,0_12px_28px_-4px_rgba(59,34,24,0.18)]">
        {NAV_ITEMS.map((item) => (
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