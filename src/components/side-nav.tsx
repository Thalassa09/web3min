import { Link, useRouterState } from "@tanstack/react-router";
import { Flame, Sparkles, ChevronRight } from "lucide-react";
import { BrandMark } from "@/components/brand-mark";
import { Mascot } from "@/components/mascot";
import { NAV_ITEMS, navActive } from "@/lib/nav";
import { useProgress } from "@/lib/store";

export function SideNav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const username = useProgress((s) => s.username);
  const streak = useProgress((s) => s.streak);
  const xp = useProgress((s) => s.xp);
  const level = Math.floor(xp / 100) + 1;

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
                  transition-[transform,box-shadow,background-color,border-color,color] duration-150 ease-out cursor-pointer
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
          className="group relative flex items-center gap-3 p-2.5 rounded-[18px] bg-[#F8FAFD] border-2 border-[#DCE7F5] shadow-[0_3px_0_#DCE7F5,0_4px_12px_-4px_rgba(9,48,102,0.08)] hover:border-[#8FC2FF] hover:bg-white hover:shadow-[0_3px_0_#B9CFE9,0_8px_20px_-6px_rgba(11,99,246,0.15)] active:translate-y-[2px] active:shadow-[0_1px_0_#B9CFE9] transition-[transform,box-shadow,background-color,border-color] duration-150 cursor-pointer select-none"
          title="Buka Profil & Koleksi Blobi"
        >
          {/* Squircle Avatar Tile (Lamé Curve style) */}
          <div className="relative size-11 rounded-[14px] bg-gradient-to-b from-[#EBF4FF] to-[#D4E8FF] border-2 border-[#8FC2FF] shadow-[0_2px_0_#C2DBFA] flex items-center justify-center overflow-hidden shrink-0 group-hover:border-[#0B63F6] transition-colors">
            <div className="size-9 flex items-center justify-center">
              <Mascot mood="proud" size={36} lite fill={false} interactive={false} />
            </div>
            <span
              className="absolute bottom-0.5 right-0.5 size-2.5 rounded-full bg-[#34C06A] border-2 border-white shadow-xs"
              aria-hidden="true"
            />
          </div>

          {/* User Handle & Gamified Badges */}
          <div className="min-w-0 flex-1">
            <div className="font-display font-black text-sm text-[#0D2340] tracking-tight leading-snug truncate group-hover:text-[#0B4FD1] transition-colors">
              @{username || "pelajar"}
            </div>
            <div className="mt-1 flex items-center gap-1.5 flex-wrap">
              {streak > 0 ? (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#FFF0E4] border border-[#FFB580] text-[10px] font-black text-[#C85200] shadow-[0_1px_0_#FFB580] leading-none">
                  <Flame className="size-2.5 text-[#F2841F] fill-[#F2841F] shrink-0" />
                  <span>{streak} hari</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#F0F6FF] border border-[#DCE7F5] text-[10px] font-extrabold text-[#4A6580] leading-none">
                  <Sparkles className="size-2.5 text-[#0B63F6] shrink-0" />
                  <span>Mulai streak</span>
                </span>
              )}
              <span className="text-[10px] font-extrabold text-[#7590AA] tabular-nums">
                Lv. {level}
              </span>
            </div>
          </div>

          {/* Trailing Affordance */}
          <ChevronRight className="size-4 text-[#9DB4CE] group-hover:text-[#0B4FD1] group-hover:translate-x-0.5 transition-all shrink-0 mr-0.5" />
        </Link>
      </div>
    </nav>
  );
}
