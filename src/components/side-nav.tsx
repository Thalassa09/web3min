import { Link, useRouterState } from "@tanstack/react-router";
import { BrandMark } from "@/components/brand-mark";
import { NAV_ITEMS, navActive } from "@/lib/nav";
import { useProgress } from "@/lib/store";

export function SideNav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const username = useProgress((s) => s.username);
  const streak = useProgress((s) => s.streak);

  return (
    <nav
      className="hidden lg:flex flex-col w-[250px] shrink-0 min-h-screen p-5 bg-[#0a0d14] border-r border-[#1a2130] select-none"
      aria-label="Menu Utama Web3min"
    >
      {/* Brand Header */}
      <div className="pb-6 border-b border-[#161c28]">
        <BrandMark className="px-1 py-1" />
      </div>

      {/* Navigation Links */}
      <ul className="mt-6 flex flex-col gap-1.5 list-none p-0 m-0">
        {NAV_ITEMS.map((item) => {
          const active = navActive(pathname, item.to);
          const Icon = item.icon;
          const isRaffle = item.to === "/leaderboard";

          return (
            <li key={item.to}>
              <Link
                to={item.to}
                className={`
                  group relative flex items-center justify-between px-3.5 py-3 rounded-[14px] text-sm font-sans font-semibold
                  transition-all duration-150 ease-out
                  active:scale-[0.98]
                  ${
                    active
                      ? "bg-[#141824] text-[#f1f4fa] border border-[#232b3e] shadow-sm"
                      : "text-[#8e9ab2] hover:text-[#f1f4fa] hover:bg-white/[0.03] border border-transparent"
                  }
                `}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`size-5 shrink-0 transition-transform duration-200 group-hover:scale-110 ${
                      active ? "text-[#00f59b]" : "text-[#8e9ab2] group-hover:text-[#f1f4fa]"
                    }`}
                    weight={active ? "fill" : "regular"}
                  />
                  <span>{item.label}</span>
                </div>

                {isRaffle ? (
                  <span className="px-2 py-0.5 rounded-full text-[11px] font-sans font-semibold bg-[#00f59b]/15 text-[#00f59b]">
                    Hadiah
                  </span>
                ) : active ? (
                  <span className="h-1.5 w-1.5 rounded-full bg-[#00f59b]" />
                ) : null}
              </Link>
            </li>
          );
        })}
      </ul>

      {/* Footer Profile Snippet */}
      <div className="mt-auto pt-4 border-t border-[#161c28]">
        <Link
          to="/profile"
          className="flex items-center gap-3 p-2.5 rounded-[14px] hover:bg-[#141824] border border-transparent hover:border-[#232b3e] transition-all"
        >
          <div className="w-10 h-10 rounded-[12px] bg-[#141824] border border-[#232b3e] flex items-center justify-center font-bold text-sm text-[#f1f4fa]">
            {(username || "P").slice(0, 2).toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-xs font-bold text-[#f1f4fa] truncate">@{username || "pelajar"}</div>
            <div className="text-[11px] text-[#8e9ab2] truncate">
              {streak > 0 ? `Streak ${streak} hari 🔥` : "Mulai belajar hari ini"}
            </div>
          </div>
        </Link>
      </div>
    </nav>
  );
}
