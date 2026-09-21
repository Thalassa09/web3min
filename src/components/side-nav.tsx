import { Link, useRouterState } from "@tanstack/react-router";
import { BrandMark } from "@/components/brand-mark";
import { NAV_ITEMS, navActive } from "@/lib/nav";
import { cn } from "@/lib/utils";

export function SideNav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <nav className="side-nav" aria-label="Menu utama">
      <BrandMark className="px-2 py-1" />
      <ul className="mt-6 flex flex-col gap-1">
        {NAV_ITEMS.map((item) => {
          const active = navActive(pathname, item.to);
          const Icon = item.icon;
          return (
            <li key={item.to}>
              <Link to={item.to} className={cn("side-tab", active ? "side-tab-on" : "side-tab-off")}>
                <Icon className="size-6 shrink-0" weight={active ? "fill" : "regular"} />
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
      <p className="mt-auto px-3 pb-2 text-xs font-medium leading-5 text-faint">
        20 rute · jelajahi onchain tanpa nyasar
      </p>
    </nav>
  );
}
