import { Link, useRouterState } from "@tanstack/react-router";
import { NAV_ITEMS, navActive } from "@/lib/nav";
import { playTap } from "@/lib/audio";
import { useProgress } from "@/lib/store";
import { cn } from "@/lib/utils";

export function BottomNav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const sound = useProgress((s) => s.sound);

  return (
    <nav
      aria-label="Navigasi Mobile"
      className="pointer-events-none fixed inset-x-0 bottom-2 z-40 px-3 pb-[max(0.5rem,env(safe-area-inset-bottom))] lg:hidden"
    >
      <div className="pointer-events-auto mx-auto grid h-16 max-w-md grid-cols-5 items-center gap-1 rounded-full border-2 border-choco-900/18 bg-gradient-to-b from-white via-[#FFF9F5] to-[#FDEEE4] px-2.5 backdrop-blur-2xl shadow-[0_5px_0_#3B2218,0_12px_28px_-4px_rgba(59,34,24,0.18)]">
        {NAV_ITEMS.map((item) => {
          const active = navActive(pathname, item.to);
          const Icon = item.icon;
          return (
            <Link
              key={item.to}
              to={item.to}
              aria-current={active ? "page" : undefined}
              onClick={() => sound && playTap()}
              className={cn(
                "flex h-12 flex-col items-center justify-center rounded-2xl transition-all duration-120 ease-out active:scale-95",
                active
                  ? "border-2 border-candy-600/50 bg-gradient-to-b from-[#FF6699] via-[#E8437F] to-[#D82668] text-white shadow-[0_3px_0_#B01F62,0_6px_12px_rgba(232,67,127,0.25)]"
                  : "text-choco-900/60 hover:text-choco-900 hover:bg-white/60 font-bold",
              )}
            >
              <span className="grid size-5.5 place-items-center">
                <Icon
                  className={cn(
                    "size-5 shrink-0 transition-colors",
                    active ? "text-white stroke-[2.4]" : "text-choco-900/70",
                  )}
                  weight={active ? "fill" : "regular"}
                />
              </span>
              <span
                className={cn(
                  "mt-0.5 text-[10px] tracking-[0.01em] leading-none",
                  active ? "text-white font-extrabold" : "text-choco-900/70 font-bold",
                )}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
