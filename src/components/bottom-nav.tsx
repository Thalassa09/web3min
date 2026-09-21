import { Link, useRouterState } from "@tanstack/react-router";
import { NAV_ITEMS, navActive } from "@/lib/nav";

/**
 * Mobile BottomNav overhaul:
 * Frosted glass blur, 48px hit targets, Lamé squircle active indicator,
 * Emil Kowalski tactile touch compression (scale 0.92), zero raw emojis.
 */
export function BottomNav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 lg:hidden flex items-center justify-around h-16 px-2 bg-[#070810]/90 border-t border-[#191d2f] backdrop-blur-xl shadow-[0_-8px_32px_rgba(0,0,0,0.7)]"
      aria-label="Navigasi Mobile"
    >
      {NAV_ITEMS.map((item) => {
        const active = navActive(pathname, item.to);
        const Icon = item.icon;
        const isRaffle = item.to === "/leaderboard";

        return (
          <Link
            key={item.to}
            to={item.to}
            className={`
              relative flex flex-col items-center justify-center min-w-[56px] h-12 rounded-[14px] transition-all duration-150 ease-out
              active:scale-[0.90]
              ${active ? "text-[#00f59b]" : "text-zinc-400 hover:text-zinc-200"}
            `}
          >
            {active && (
              <span className="absolute inset-0 rounded-[14px] bg-[#00f59b]/10 border border-[#00f59b]/25 shadow-[0_0_12px_rgba(0,245,155,0.15)]" />
            )}

            <div className="relative flex flex-col items-center gap-1">
              <Icon
                className={`size-5 shrink-0 transition-transform ${active ? "scale-110 text-[#00f59b]" : ""}`}
                weight={active ? "fill" : "regular"}
              />
              <span className="text-[10px] font-mono uppercase font-bold tracking-tight">
                {item.label}
              </span>
            </div>

            {isRaffle && !active && (
              <span className="absolute top-1 right-2 flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00f59b] opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#00f59b]" />
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}
