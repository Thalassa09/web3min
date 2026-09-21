import { Link, useRouterState } from "@tanstack/react-router";
import { NAV_ITEMS, navActive } from "@/lib/nav";
import { cn } from "@/lib/utils";

export function BottomNav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <nav className="bottom-nav" aria-label="Menu utama">
      <ul className="mx-auto grid max-w-lg grid-cols-5">
        {NAV_ITEMS.map((item) => {
          const active = navActive(pathname, item.to);
          const Icon = item.icon;
          return (
            <li key={item.to}>
              <Link to={item.to} className={cn("nav-tab", active ? "nav-tab-on" : "nav-tab-off")}>
                <Icon className="size-6" weight={active ? "fill" : "regular"} />
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
