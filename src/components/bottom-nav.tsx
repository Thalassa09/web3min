import { Link, useRouterState } from "@tanstack/react-router";
import { NAV_ITEMS, navActive } from "@/lib/nav";
import { playTap } from "@/lib/audio";
import { useProgress } from "@/lib/store";
import { cn } from "@/lib/utils";

export function BottomNav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const sound = useProgress((s) => s.sound);

  return (
    <nav aria-label="Navigasi Mobile" className="pointer-events-none fixed inset-x-0 bottom-2 z-40 px-3 pb-[max(0.5rem,env(safe-area-inset-bottom))] lg:hidden">
      <div className="pointer-events-auto mx-auto grid h-16 max-w-md grid-cols-5 items-center gap-1.5 rounded-full border-2 border-ink-900 bg-white/85 px-2 backdrop-blur-2xl backdrop-saturate-180 shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_4px_0_var(--color-ink-900)]">
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
                "flex h-12 flex-col items-center justify-center rounded-full border-2 transition-all duration-150 ease-out active:scale-95",
                active
                  ? "border-ink-900 bg-candy text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.45),0_3px_0_#A51D5B] -translate-y-1 scale-105"
                  : "border-transparent text-ink-500 hover:bg-candy-soft/60 hover:text-ink-900",
              )}
            >
              <span className="grid size-6 place-items-center">
                <Icon className="size-5 shrink-0" weight={active ? "fill" : "regular"} />
              </span>
              <span className="mt-0.5 text-[10px] font-black tracking-[0.02em] leading-none">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
