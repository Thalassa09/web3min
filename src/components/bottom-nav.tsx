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
      <div className="pointer-events-auto mx-auto grid h-15 max-w-md grid-cols-5 items-center gap-1 rounded-full border-2 border-ink-900 bg-white/90 px-2 backdrop-blur-2xl backdrop-saturate-180 shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_2px_0_var(--color-ink-900)]">
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
                "flex h-11 flex-col items-center justify-center rounded-full transition-all duration-120 ease-out active:scale-95",
                active
                  ? "bg-candy-soft text-candy-deep border border-candy-line/60 font-black"
                  : "text-ink-500 hover:text-ink-900 font-bold",
              )}
            >
              <span className="grid size-5.5 place-items-center">
                <Icon
                  className={cn(
                    "size-5 shrink-0 transition-colors",
                    active ? "text-candy-deep stroke-[2.4]" : "text-ink-500",
                  )}
                  weight={active ? "fill" : "regular"}
                />
              </span>
              <span
                className={cn(
                  "mt-0.5 text-[10px] tracking-[0.01em] leading-none",
                  active ? "text-candy-deep font-black" : "text-ink-500 font-bold",
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
