import { Link, useRouterState } from "@tanstack/react-router";
import { NAV_ITEMS, navActive } from "@/lib/nav";
import { playTap } from "@/lib/audio";
import { useProgress } from "@/lib/store";

export function BottomNav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const sound = useProgress((s) => s.sound);
  const activeIndex = NAV_ITEMS.findIndex((item) => navActive(pathname, item.to));

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 lg:hidden grid grid-cols-5 items-center px-2 pt-1 h-[calc(4rem+env(safe-area-inset-bottom))] pb-[env(safe-area-inset-bottom)] bg-[#FFFFFF] border-t-2 border-[#DCE7F5] shadow-[0_-4px_16px_rgba(9,48,102,0.08)] select-none relative"
      aria-label="Navigasi Mobile"
    >
      {/* Sliding Active Pill Indicator */}
      {activeIndex !== -1 && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute top-1.5 bottom-[calc(env(safe-area-inset-bottom)+0.375rem)] rounded-[14px] bg-[#E4F0FF] border border-[#8FC2FF]/70 shadow-sm transition-transform duration-250 ease-out"
          style={{
            width: "calc((100% - 16px) / 5)",
            left: "8px",
            transform: `translate3d(calc(${activeIndex} * 100%), 0, 0)`,
          }}
        />
      )}

      {NAV_ITEMS.map((item) => {
        const active = navActive(pathname, item.to);
        const Icon = item.icon;

        return (
          <Link
            key={item.to}
            to={item.to}
            onClick={() => {
              if (sound) playTap();
            }}
            className={`
              relative z-10 flex flex-col items-center justify-center h-12 rounded-[14px] transition-[transform,color] duration-150 ease-out cursor-pointer
              active:translate-y-[2px]
              ${active ? "text-sky-600" : "text-[#4A6580] hover:text-[#0D2340]"}
            `}
          >
            <div className="relative flex flex-col items-center gap-0.5">
              <Icon
                className={`size-5 shrink-0 transition-transform duration-200 ${active ? "scale-110 text-sky-600" : ""}`}
                weight={active ? "fill" : "regular"}
              />
              <span className="text-[11px] font-sans font-extrabold tracking-tight">
                {item.label}
              </span>
              {active && <span className="size-1 rounded-full bg-sky-600 -mb-1" />}
            </div>
          </Link>
        );
      })}
    </nav>
  );
}
