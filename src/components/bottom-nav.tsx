import { Link, useRouterState } from "@tanstack/react-router";
import { NAV_ITEMS, navActive } from "@/lib/nav";

export function BottomNav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 lg:hidden flex items-center justify-around h-16 px-2 bg-[#FFFFFF] border-t-2 border-[#DCE7F5] shadow-[0_-4px_16px_rgba(9,48,102,0.08)]"
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
              relative flex flex-col items-center justify-center min-w-[56px] h-12 rounded-[14px] transition-all duration-150 ease-out cursor-pointer
              active:translate-y-[2px]
              ${active ? "text-[#0B63F6]" : "text-[#5A7796] hover:text-[#0D2340]"}
            `}
          >
            {active && (
              <span className="absolute inset-x-2 inset-y-0.5 rounded-[12px] bg-[#E4F0FF] border border-[#8FC2FF]/60" />
            )}

            <div className="relative flex flex-col items-center gap-0.5">
              <Icon
                className={`size-5 shrink-0 transition-transform ${active ? "scale-110 text-[#0B63F6]" : ""}`}
                weight={active ? "fill" : "regular"}
              />
              <span className="text-[11px] font-sans font-extrabold tracking-tight">
                {item.label}
              </span>
              {active && <span className="size-1 rounded-full bg-[#0B63F6] -mb-1" />}
            </div>
          </Link>
        );
      })}
    </nav>
  );
}
