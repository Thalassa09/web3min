import { Link, useRouterState } from "@tanstack/react-router";
import { ChevronRight, Ticket } from "lucide-react";
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
      className="sticky top-0 z-20 hidden h-screen w-[248px] shrink-0 select-none flex-col overflow-y-auto border-r-2 border-ink-900 bg-white/85 p-5 backdrop-blur-2xl backdrop-saturate-180 lg:flex"
    >
      <BrandMark className="px-1 pb-6" />

      <ul className="m-0 flex list-none flex-col gap-2 p-0">
        {NAV_ITEMS.map((item) => {
          const active = navActive(pathname, item.to);
          const Icon = item.icon;
          return (
            <li key={item.to}>
              <Link
                to={item.to}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "group flex items-center gap-3 rounded-full border-2 px-3.5 py-2 text-sm font-black transition-all duration-120 ease-out active:scale-95 active:translate-y-0.5",
                  active
                    ? "border-ink-900 bg-candy-500 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.4),0_2px_0_#A51D5B] translate-x-1"
                    : "border-transparent text-ink-500 hover:border-ink-900/10 hover:bg-candy-50 hover:text-ink-900",
                )}
              >
                <div
                  className={cn(
                    "flex size-9 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
                    active ? "border-white/40 bg-white/20 text-white" : "border-ink-900/10 bg-white/80 text-ink-700 group-hover:border-ink-900/20 group-hover:bg-white group-hover:text-candy-deep"
                  )}
                >
                  <Icon className="size-4.5 shrink-0" weight={active ? "fill" : "regular"} />
                </div>
                <span className="flex-1 truncate tracking-[-0.01em]">{item.label}</span>
                {item.badge && (
                  <span className="rounded-full border border-candy-line bg-candy-soft px-2 py-0.5 text-[10px] font-black text-candy-deep">
                    {item.badge}
                  </span>
                )}
              </Link>
            </li>
          );
        })}
        <li key="/raffle">
          <Link
            to="/raffle"
            aria-current={pathname === "/raffle" ? "page" : undefined}
            className={cn(
              "group flex items-center gap-3 rounded-full border-2 px-3.5 py-2 text-sm font-black transition-all duration-120 ease-out active:scale-95 active:translate-y-0.5",
              pathname === "/raffle"
                ? "border-ink-900 bg-candy-500 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.4),0_2px_0_#A51D5B] translate-x-1"
                : "border-transparent text-ink-500 hover:border-ink-900/10 hover:bg-candy-50 hover:text-ink-900"
            )}
          >
            <div
              className={cn(
                "flex size-9 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
                pathname === "/raffle"
                  ? "border-white/40 bg-white/20 text-white"
                  : "border-ink-900/10 bg-white/80 text-ink-700 group-hover:border-ink-900/20 group-hover:bg-white group-hover:text-candy-deep"
              )}
            >
              <Ticket className="size-4.5 shrink-0" />
            </div>
            <span className="flex-1 truncate tracking-[-0.01em]">Raffle NFT</span>
            <span className="rounded-full border border-amber-300 bg-amber-100 px-2 py-0.5 text-[10px] font-black text-amber-900">
              NFT
            </span>
          </Link>
        </li>
      </ul>

      <Link
        to="/profile"
        title="Buka Profil & Koleksi Blobi"
        className="group mt-auto flex items-center gap-3 rounded-[24px] border-2 border-ink-900 bg-white/90 p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_2px_0_var(--color-ink-900)] transition-all duration-150 hover:-translate-y-0.5 hover:shadow-ink-sm"
      >
        <div className="grid size-11 shrink-0 place-items-center overflow-hidden rounded-full border-2 border-ink-900 bg-white shadow-ink-xs">
          <Mascot mood="proud" size={34} lite fill={false} interactive={false} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="truncate font-display text-sm font-black text-ink-900">@{username || "pelajar"}</div>
          <div className="mt-1 flex items-center gap-2 text-[11px] font-black tabular-nums text-ink-500">
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
