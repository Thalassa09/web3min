import { Link, useRouterState } from "@tanstack/react-router";
import { Flame } from "lucide-react";
import { BrandMark } from "@/components/brand-mark";
import { NAV_ITEMS, navActive } from "@/lib/nav";
import { useProgress } from "@/lib/store";

export function SideNav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const username = useProgress((s) => s.username);
  const streak = useProgress((s) => s.streak);

  return (
    <nav
      className="hidden lg:flex flex-col w-[256px] shrink-0 sticky top-0 h-screen p-5 bg-[#FFFFFF] border-r-2 border-[#DCE7F5] shadow-[4px_0_12px_rgba(9,48,102,0.06)] select-none z-20 overflow-y-auto"
      aria-label="Menu Utama Web3min"
    >
      {/* Brand Header */}
      <div className="pb-5 border-b-2 border-[#DCE7F5]">
        <BrandMark className="px-1 py-1" />
      </div>

      {/* Navigation Links */}
      <ul className="mt-6 flex flex-col gap-2 list-none p-0 m-0">
        {NAV_ITEMS.map((item) => {
          const active = navActive(pathname, item.to);
          const Icon = item.icon;
          const isRaffle = item.to === "/leaderboard";

          return (
            <li key={item.to}>
              <Link
                to={item.to}
                className={`
                  group relative flex items-center justify-between px-4 py-3 rounded-[14px] text-sm font-sans font-extrabold
                  transition-all duration-150 ease-out cursor-pointer
                  active:translate-y-[2px]
                  ${
                    active
                      ? "bg-[#E4F0FF] text-[#0B4FD1] border-2 border-[#8FC2FF] shadow-[0_3px_0_#C2DBFA]"
                      : "text-[#4A6580] hover:text-[#0D2340] hover:bg-[#F0F6FF] border-2 border-transparent"
                  }
                `}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`size-5 shrink-0 transition-transform duration-200 group-hover:scale-110 ${
                      active ? "text-[#0B63F6]" : "text-[#4A6580] group-hover:text-[#0D2340]"
                    }`}
                    weight={active ? "fill" : "regular"}
                  />
                  <span>{item.label}</span>
                </div>

                {isRaffle ? (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-sans font-extrabold bg-[#FFC61A] text-[#0D2340] shadow-[0_1px_0_#D99400]">
                    Hadiah
                  </span>
                ) : active ? (
                  <span className="h-2 w-2 rounded-full bg-[#0B63F6]" />
                ) : null}
              </Link>
            </li>
          );
        })}
      </ul>

      {/* Footer Profile Snippet */}
      <div className="mt-auto pt-4 border-t-2 border-[#DCE7F5]">
        <Link
          to="/profile"
          className="flex items-center gap-3 p-3 rounded-[16px] bg-[#F0F6FF] border-2 border-[#DCE7F5] hover:border-[#8FC2FF] hover:bg-[#E4F0FF] transition-all"
        >
          <div className="w-10 h-10 rounded-[12px] bg-[#FFFFFF] border-2 border-[#8FC2FF] shadow-[0_2px_0_#C2DBFA] flex items-center justify-center font-extrabold text-sm text-[#0B4FD1]">
            {(username || "P").slice(0, 2).toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-xs font-extrabold text-[#0D2340] truncate">@{username || "pelajar"}</div>
            <div className="text-[11px] font-semibold text-[#4A6580] truncate flex items-center gap-1">
              {streak > 0 ? (
                <>
                  <span>Streak {streak} hari</span>
                  <Flame className="size-3 text-[#FF7A18] shrink-0 fill-[#FF7A18]" />
                </>
              ) : (
                "Belajar hari ini"
              )}
            </div>
          </div>
        </Link>
      </div>
    </nav>
  );
}
