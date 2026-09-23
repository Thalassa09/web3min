import { Link, useRouterState } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import { Fire } from "@/lib/kicon";
import { BrandMark } from "@/components/brand-mark";
import { Mascot } from "@/components/mascot";
import { NAV_ITEMS, navActive } from "@/lib/nav";
import { useProgress } from "@/lib/store";
import { cn } from "@/lib/utils";

export function SideNav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const username = useProgress((s) => s.username);
  const streak = useProgress((s) => s.streak);
  const xp = useProgress((s) => s.xp);
  const level = Math.floor(xp / 100) + 1;

  return (
    <nav
      aria-label="Menu Utama Web3min"
      className="sticky top-0 z-20 hidden h-screen w-[248px] shrink-0 select-none flex-col overflow-y-auto border-r-2 border-ink-900 bg-white p-5 lg:flex"
    >
      <BrandMark className="px-1 pb-6" />

      <ul className="m-0 flex list-none flex-col gap-1.5 p-0">
        {NAV_ITEMS.map((item) => {
          const active = navActive(pathname, item.to);
          const Icon = item.icon;
          return (
            <li key={item.to}>
              <Link
                to={item.to}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "group flex items-center gap-3 rounded-md border-2 px-4 py-3 text-sm font-extrabold transition-[transform,box-shadow,background-color,color] duration-150",
                  active
                    ? "border-ink-900 bg-blobi text-white shadow-ink-sm"
                    : "border-transparent text-ink-500 hover:bg-canvas hover:text-ink-900",
                )}
              >
                <Icon className="size-5 shrink-0" weight={active ? "fill" : "regular"} />
                <span className="flex-1">{item.label}</span>
                {item.badge && (
                  <span className="rounded-sm border-[1.5px] border-ink-900 bg-coin px-2 py-0.5 text-[10px] font-extrabold text-ink-900">
                    {item.badge}
                  </span>
                )}
              </Link>
            </li>
          );
        })}
      </ul>

      <Link
        to="/profile"
        title="Buka Profil & Koleksi Blobi"
        className="group mt-auto flex items-center gap-3 rounded-lg border-2 border-ink-900 bg-cream p-2.5 shadow-ink-sm transition-transform duration-150 hover:-translate-y-0.5"
      >
        <div className="grid size-11 shrink-0 place-items-center overflow-hidden rounded-md border-2 border-ink-900 bg-blobi-soft">
          <Mascot mood="proud" size={36} lite fill={false} interactive={false} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="truncate font-display text-sm font-bold text-ink-900">@{username || "pelajar"}</div>
          <div className="mt-1 flex items-center gap-2 text-[11px] font-extrabold tabular-nums text-ink-500">
            <span className={cn("inline-flex items-center gap-1", streak > 0 ? "text-flame-shadow" : "text-ink-300")}>
              <Fire className="size-3" weight={streak > 0 ? "fill" : "regular"} />
              {streak > 0 ? `${streak} hari` : "Mulai streak"}
            </span>
            <span>Lv. {level}</span>
          </div>
        </div>
        <ChevronRight className="size-4 shrink-0 text-ink-300 transition-transform group-hover:translate-x-0.5 group-hover:text-ink-900" />
      </Link>
    </nav>
  );
}
