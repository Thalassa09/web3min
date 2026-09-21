import { Link, useRouterState } from "@tanstack/react-router";
import { BrandMark } from "@/components/brand-mark";
import { NAV_ITEMS, navActive } from "@/lib/nav";
import { TelemetryBadge } from "@/components/ui/telemetry-badge";

/**
 * SideNav overhaul:
 * Non-AI slop tactical command rail with Doppelrand border,
 * tactile spring compression (:active scale 0.97), and live telemetry footer.
 */
export function SideNav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <nav
      className="hidden lg:flex flex-col w-[260px] shrink-0 min-h-screen p-5 bg-[#070810]/95 border-r border-[#191d2f] backdrop-blur-xl select-none"
      aria-label="Menu Utama Web3min"
    >
      {/* Brand Header */}
      <div className="pb-6 border-b border-[#161a29]">
        <BrandMark className="px-1 py-1" />
        <div className="mt-2.5 flex items-center gap-2">
          <TelemetryBadge label="NODE" value="ONLINE" tone="mint" pulsing />
          <span className="text-[10px] font-mono text-zinc-500">v2.5-STABLE</span>
        </div>
      </div>

      {/* Navigation Stack */}
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
                  group relative flex items-center justify-between px-3.5 py-3 rounded-[16px] text-xs font-mono font-bold uppercase tracking-wider
                  transition-all duration-150 ease-out
                  active:scale-[0.97]
                  ${
                    active
                      ? "bg-[#131627] text-[#00f59b] border border-[#2b3353] shadow-[0_4px_16px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.08)]"
                      : "text-zinc-400 hover:text-zinc-100 hover:bg-white/[0.03] border border-transparent"
                  }
                `}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`size-5 shrink-0 transition-transform duration-200 group-hover:scale-110 ${
                      active ? "text-[#00f59b]" : "text-zinc-400 group-hover:text-zinc-200"
                    }`}
                    weight={active ? "fill" : "regular"}
                  />
                  <span>{item.label}</span>
                </div>

                {isRaffle ? (
                  <span className="px-1.5 py-0.5 rounded-[6px] text-[9px] font-mono font-black bg-[#00f59b]/15 text-[#00f59b] border border-[#00f59b]/30">
                    LIVE
                  </span>
                ) : active ? (
                  <span className="h-1.5 w-1.5 rounded-full bg-[#00f59b] shadow-[0_0_8px_#00f59b]" />
                ) : null}
              </Link>
            </li>
          );
        })}
      </ul>

      {/* Bottom Telemetry Card */}
      <div className="mt-auto pt-6">
        <div className="p-3.5 rounded-[18px] bg-[#0c0e1a] border border-[#1a1f33] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
          <div className="flex items-center justify-between text-[10px] font-mono text-zinc-500 uppercase">
            <span>NETWORK</span>
            <span className="text-[#00e5ff] font-bold">BASE MAINNET</span>
          </div>
          <p className="mt-1.5 text-xs text-zinc-400 font-sans leading-relaxed">
            Kurikulum Web3 mandiri berjenjang dengan verifikasi kriptografi.
          </p>
          <div className="mt-2 pt-2 border-t border-[#181d2e] flex items-center justify-between text-[10px] font-mono text-zinc-500">
            <span>STATUS</span>
            <span className="text-[#00f59b] font-bold">ALL SYSTEMS NOMINAL</span>
          </div>
        </div>
      </div>
    </nav>
  );
}
