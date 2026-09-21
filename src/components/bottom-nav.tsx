import { Link, useRouterState } from "@tanstack/react-router";
import { NAV_ITEMS, navActive } from "@/lib/nav";

export function BottomNav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 lg:hidden flex items-center justify-around h-16 px-2 bg-[#0a0d14]/95 border-t border-[#1a2130] backdrop-blur-lg"
      aria-label="Navigasi Mobile"
    >
      {NAV_ITEMS.map((item) => {
        const active = navActive(pathname, item.to);
        const Icon = item.icon;

        return (
          <Link
            key={item.to}
            to={item.to}
            className={`
              relative flex flex-col items-center justify-center min-w-[56px] h-12 rounded-[12px] transition-all duration-150 ease-out
              active:scale-[0.92]
              ${active ? "text-[#00f59b]" : "text-[#8e9ab2] hover:text-[#f1f4fa]"}
            `}
          >
            {active && (
              <span className="absolute inset-0 rounded-[12px] bg-[#00f59b]/10 border border-[#00f59b]/25" />
            )}

            <div className="relative flex flex-col items-center gap-0.5">
              <Icon
                className={`size-5 shrink-0 transition-transform ${active ? "scale-110 text-[#00f59b]" : ""}`}
                weight={active ? "fill" : "regular"}
              />
              <span className="text-[11px] font-sans font-semibold">
                {item.label}
              </span>
            </div>
          </Link>
        );
      })}
    </nav>
  );
}
