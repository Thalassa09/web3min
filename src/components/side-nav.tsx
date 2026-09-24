import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Link, useRouterState } from "@tanstack/react-router";
import { ChevronRight, Ticket, X } from "lucide-react";
import { Fire } from "@/lib/kicon";
import { BrandMark } from "@/components/brand-mark";
import { Mascot } from "@/components/mascot";
import { NAV_ITEMS, navActive } from "@/lib/nav";
import { useProgress } from "@/lib/store";
import { useNavStore } from "@/lib/nav-store";
import { playTap } from "@/lib/audio";
import { cn } from "@/lib/utils";

export function SideNav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const username = useProgress((s) => s.username);
  const streak = useProgress((s) => s.streak);
  const xp = useProgress((s) => s.xp);
  const sound = useProgress((s) => s.sound);
  const level = Math.floor(xp / 100) + 1;

  const isOpen = useNavStore((s) => s.isOpen);
  const close = useNavStore((s) => s.close);

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  // Close with Escape key on desktop
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        if (sound) playTap();
        close();
      }
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, close, sound]);

  // Lock body scroll when drawer is open on desktop
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  if (!mounted) return null;

  return createPortal(
    <div
      className={cn(
        // MANDATORY REQUIREMENT: "untuk versi mobil tidak ada overlay"
        // This entire overlay drawer portal is strictly hidden on mobile (< lg), active ONLY on desktop (lg:block)
        "hidden lg:block fixed inset-0 z-50 transition-all duration-300",
        isOpen ? "pointer-events-auto visible" : "pointer-events-none invisible"
      )}
      aria-hidden={!isOpen}
    >
      {/* ─────────────────────────────────────────────────────────────
          1. BACKDROP OVERLAY (DESKTOP ONLY)
          Clicking the overlay dims/blurs background and HIDES this menu!
          ("buat ini muncul saat overlay di klik jadi ini bisa disembunyikan")
         ───────────────────────────────────────────────────────────── */}
      <div
        className={cn(
          "fixed inset-0 bg-choco-900/60 backdrop-blur-xs transition-opacity duration-300 ease-out",
          isOpen ? "opacity-100" : "opacity-0"
        )}
        onClick={() => {
          if (sound) playTap();
          close();
        }}
        aria-label="Tutup menu navigasi (klik overlay)"
        title="Klik di luar untuk menyembunyikan menu"
      />

      {/* ─────────────────────────────────────────────────────────────
          2. SLIDE-OUT DRAWER (The SideNav menu from user image)
         ───────────────────────────────────────────────────────────── */}
      <nav
        aria-label="Menu Utama Web3min"
        className={cn(
          "relative z-50 flex h-full w-[280px] max-w-[85vw] select-none flex-col overflow-y-auto border-r-2 border-choco-900/18 bg-gradient-to-b from-[#FFFDF8] via-[#FFF9F5] to-[#FDEEE4] p-5 shadow-[6px_0_24px_-4px_rgba(59,34,24,0.18)] backdrop-blur-2xl transition-transform duration-300 ease-out",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Top Header with Brand and Close Button */}
        <div className="flex items-center justify-between pb-6">
          <BrandMark className="px-1" />
          <button
            type="button"
            onClick={() => {
              if (sound) playTap();
              close();
            }}
            aria-label="Sembunyikan menu"
            title="Sembunyikan menu (Esc)"
            className="flex size-9 items-center justify-center rounded-full border-2 border-choco-900/20 bg-gradient-to-b from-white via-[#FFF9F5] to-[#FDEEE4] text-choco-900 shadow-[0_2.5px_0_#3B2218] transition-all hover:brightness-105 hover:rotate-90 active:translate-y-[1px] active:shadow-none cursor-pointer"
          >
            <X className="size-4.5 stroke-[2.5]" />
          </button>
        </div>

        {/* Navigation Item List */}
        <ul className="m-0 flex list-none flex-col gap-2 p-0">
          {NAV_ITEMS.map((item) => {
            const active = navActive(pathname, item.to);
            const Icon = item.icon;
            return (
              <li key={item.to}>
                <Link
                  to={item.to}
                  aria-current={active ? "page" : undefined}
                  onClick={() => {
                    if (sound) playTap();
                    close();
                  }}
                  className={cn(
                    "group flex items-center gap-3 rounded-2xl border-2 px-3.5 py-2.5 text-sm font-bold transition-all duration-120 ease-out active:scale-95 active:translate-y-0.5",
                    active
                      ? "border-candy-600/50 bg-gradient-to-b from-[#FF6699] via-[#E8437F] to-[#D82668] text-white shadow-[0_4px_0_#B01F62,0_8px_16px_-2px_rgba(232,67,127,0.30)] translate-x-0.5"
                      : "border-transparent text-choco-900/70 hover:border-choco-900/15 hover:bg-white/80 hover:text-choco-900",
                  )}
                >
                  <div
                    className={cn(
                      "flex size-9 shrink-0 items-center justify-center rounded-xl border-2 transition-all",
                      active
                        ? "border-white/50 bg-white/20 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]"
                        : "border-choco-900/15 bg-gradient-to-b from-white to-[#FFF9F5] text-choco-900 shadow-[0_2px_0_#3B2218,0_4px_8px_rgba(59,34,24,0.06)] group-hover:border-choco-900/30 group-hover:scale-105"
                    )}
                  >
                    <Icon className="size-4.5 shrink-0" weight={active ? "fill" : "regular"} />
                  </div>
                  <span className="flex-1 truncate tracking-[-0.01em]">{item.label}</span>
                  {item.badge && (
                    <span className="rounded-full border border-candy-400/50 bg-gradient-to-b from-[#FFF0F5] to-[#FFE4EC] px-2.5 py-0.5 text-[10px] font-bold text-candy-700 shadow-[0_1.5px_0_#B01F62]">
                      {item.badge}
                    </span>
                  )}
                </Link>
              </li>
            );
          })}

          {/* Raffle NFT */}
          <li key="/raffle">
            <Link
              to="/raffle"
              aria-current={pathname === "/raffle" ? "page" : undefined}
              onClick={() => {
                if (sound) playTap();
                close();
              }}
              className={cn(
                "group flex items-center gap-3 rounded-2xl border-2 px-3.5 py-2.5 text-sm font-bold transition-all duration-120 ease-out active:scale-95 active:translate-y-0.5",
                pathname === "/raffle"
                  ? "border-amber-500/50 bg-gradient-to-b from-[#FFE873] via-[#FFD84D] to-[#E6BF35] text-choco-900 shadow-[0_4px_0_#C8940C,0_8px_16px_-2px_rgba(255,216,77,0.30)] translate-x-0.5"
                  : "border-transparent text-choco-900/70 hover:border-choco-900/15 hover:bg-white/80 hover:text-choco-900"
              )}
            >
              <div
                className={cn(
                  "flex size-9 shrink-0 items-center justify-center rounded-xl border-2 transition-all",
                  pathname === "/raffle"
                    ? "border-white/60 bg-white/40 text-choco-900 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]"
                    : "border-choco-900/15 bg-gradient-to-b from-white to-[#FFF9F5] text-choco-900 shadow-[0_2px_0_#3B2218,0_4px_8px_rgba(59,34,24,0.06)] group-hover:border-choco-900/30 group-hover:scale-105"
                )}
              >
                <Ticket className="size-4.5 shrink-0" />
              </div>
              <span className="flex-1 truncate tracking-[-0.01em]">Raffle NFT</span>
              <span className="rounded-full border border-amber-500/50 bg-gradient-to-b from-[#FFFBEB] to-[#FEF3C7] px-2.5 py-0.5 text-[10px] font-bold text-amber-900 shadow-[0_1.5px_0_#D97706]">
                NFT
              </span>
            </Link>
          </li>
        </ul>

        {/* Bottom Profile & Collection Card in Tactile Beveled Style */}
        <Link
          to="/profile"
          title="Buka Profil & Koleksi Blobi"
          onClick={() => {
            if (sound) playTap();
            close();
          }}
          className="group mt-auto flex items-center gap-3 rounded-3xl border-2 border-choco-900/20 bg-gradient-to-b from-white via-[#FFF9F5] to-[#FDEEE4] p-3.5 shadow-[0_4.5px_0_#3B2218,0_10px_20px_-4px_rgba(59,34,24,0.14)] transition-all duration-150 hover:-translate-y-0.5 hover:shadow-[0_6px_0_#3B2218,0_14px_24px_-4px_rgba(59,34,24,0.18)] active:translate-y-[2px] active:shadow-[0_1.5px_0_#3B2218]"
        >
          <div className="grid size-12 shrink-0 place-items-center overflow-hidden rounded-2xl border-2 border-candy-500/40 bg-gradient-to-b from-[#FFF0F5] via-[#FFE4EC] to-[#FDC8D8] shadow-[0_2.5px_0_#B01F62]">
            <Mascot mood="proud" size={36} lite fill={false} interactive={false} />
          </div>
          <div className="min-w-0 flex-1">
            <div className="truncate font-display text-sm font-bold text-choco-900">@{username || "pelajar"}</div>
            <div className="mt-1 flex items-center gap-2 text-[11px] font-bold tabular-nums text-choco-600">
              <span className={cn("inline-flex items-center gap-1", streak > 0 ? "text-orange-600 font-extrabold" : "text-choco-400 font-semibold")}>
                <Fire className="size-3" weight={streak > 0 ? "fill" : "regular"} />
                {streak > 0 ? `${streak} hari` : "Mulai streak"}
              </span>
              <span>·</span>
              <span className="px-1.5 py-0.2 rounded-md bg-choco-900/5 text-choco-800 text-[10px] font-bold">Lv. {level}</span>
            </div>
          </div>
          <ChevronRight className="size-4 shrink-0 text-choco-400 transition-transform group-hover:translate-x-0.5 group-hover:text-choco-900" />
        </Link>
      </nav>
    </div>,
    document.body
  );
}
