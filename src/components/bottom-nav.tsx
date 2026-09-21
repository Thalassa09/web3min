import { Link, useRouterState } from "@tanstack/react-router";
import { NAV_ITEMS, navActive } from "@/lib/nav";
import { playTap } from "@/lib/audio";
import { useProgress } from "@/lib/store";

export function BottomNav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const sound = useProgress((s) => s.sound);

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 lg:hidden flex items-center justify-around px-2 pt-1 h-[calc(4rem+env(safe-area-inset-bottom))] pb-[env(safe-area-inset-bottom)] bg-[#FFFFFF] border-t-2 border-[#DCE7F5] shadow-[0_-4px_16px_rgba(9,48,102,0.08)] select-none"
      aria-label="Navigasi Mobile"
    >
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
              relative flex flex-col items-center justify-center min-w-[56px] h-12 rounded-[14px] transition-[transform,color] duration-150 ease-out cursor-pointer
              active:translate-y-[2px]
              ${active ? "text-[#0B63F6]" : "text-[#4A6580] hover:text-[#0D2340]"}
            `}
          >
            {active && (
              <span className="absolute inset-x-2 inset-y-0.5 rounded-[12px] bg-[#E4F0FF] border border-[#8FC2FF]/60" />
            )}

            <div className="relative flex flex-col items-center gap-0.5">
              <Icon
                className={`size-5 shrink-0 transition-transform duration-200 ${active ? "scale-110 text-[#0B63F6]" : ""}`}
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
