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
      className="fixed inset-x-0 bottom-0 z-40 lg:hidden px-3 pb-[max(0.5rem,env(safe-area-inset-bottom))] pointer-events-none"
      aria-label="Navigasi Mobile"
    >
      <div className="pointer-events-auto relative mx-auto grid h-16 max-w-lg grid-cols-5 items-center rounded-[22px] border border-white/70 bg-white/90 px-1 shadow-[0_10px_32px_rgba(9,48,102,0.16)] backdrop-blur-xl">
        {activeIndex !== -1 && (
          <span
            aria-hidden="true"
            className="pointer-events-none absolute top-1.5 bottom-1.5 rounded-[16px] bg-[#E4F0FF] border border-[#8FC2FF]/60 transition-transform duration-250 ease-out"
            style={{
              width: "calc((100% - 8px) / 5)",
              left: "4px",
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
                relative z-10 flex min-h-12 flex-col items-center justify-center rounded-[16px] transition-[transform,color] duration-150 ease-out cursor-pointer
                active:scale-[0.96]
                ${active ? "text-sky-600" : "text-[#4A6580]"}
              `}
            >
              <Icon
                className={`size-5 shrink-0 ${active ? "scale-110 text-sky-600" : ""}`}
                weight={active ? "fill" : "regular"}
              />
              <span className="mt-0.5 text-[10px] font-sans font-extrabold tracking-tight leading-none">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
