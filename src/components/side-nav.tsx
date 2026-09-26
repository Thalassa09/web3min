import { useEffect, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { Link, useRouterState } from "@tanstack/react-router";
import { ChevronRight, Ticket, X, Shield, LogIn } from "lucide-react";
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
  const [isAdmin, setIsAdmin] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    try {
      const auth = sessionStorage.getItem("web3min_admin_auth");
      setIsAdmin(Boolean(auth && JSON.parse(auth)?.key));
    } catch {
      setIsAdmin(false);
    }
  }, [isOpen, pathname]);

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
          "relative z-50 flex h-full w-[280px] max-w-[85vw] select-none flex-col overflow-y-auto border-r-2 border-choco-900/10 bg-[#FFFDF9] p-5 shadow-[6px_0_24px_-4px_rgba(59,34,24,0.18)] transition-transform duration-300 ease-out",
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

        {/* Navigation Item List — active = pink capsule, idle = round tactile buttons */}
        <ul className="m-0 flex w-[240px] max-w-full list-none flex-col gap-6 p-0">
          {NAV_ITEMS.map((item) => {
            const active = navActive(pathname, item.to);
            const Icon = item.icon;
            return (
              <li key={item.to}>
                <NavRow
                  to={item.to}
                  label={item.label}
                  active={active}
                  badge={item.badge}
                  badgeTone="pink"
                  onNavigate={() => {
                    if (sound) playTap();
                    close();
                  }}
                  icon={<Icon className="size-4.5 shrink-0" weight={active ? "fill" : "regular"} />}
                />
              </li>
            );
          })}

          <li key="/raffle">
            <NavRow
              to="/raffle"
              label="Undian Hadiah"
              active={pathname === "/raffle"}
              badge="NFT"
              badgeTone="amber"
              onNavigate={() => {
                if (sound) playTap();
                close();
              }}
              icon={<Ticket className="size-4.5 shrink-0 stroke-[2.2]" />}
            />
          </li>

          <li key="/masuk">
            <NavRow
              to="/masuk"
              label="Masuk Akun"
              active={pathname === "/masuk"}
              onNavigate={() => {
                if (sound) playTap();
                close();
              }}
              icon={<LogIn className="size-4.5 shrink-0 stroke-[2.2] text-candy-700" />}
            />
          </li>

          {isAdmin && (
            <li key="/admin">
              <NavRow
                to="/admin"
                label="Admin Panel"
                active={pathname === "/admin"}
                badge="VIP"
                badgeTone="pink"
                onNavigate={() => {
                  if (sound) playTap();
                  close();
                }}
                icon={<Shield className="size-4.5 shrink-0 stroke-[2.2] text-amber-500" />}
              />
            </li>
          )}
        </ul>

        {/* Bottom Profile & Collection Card in Tactile Beveled Style */}
        <Link
          to="/profile"
          title="Buka Profil & Koleksi Blobi"
          onClick={() => {
            if (sound) playTap();
            close();
          }}
          className="group mt-auto flex items-center gap-3 rounded-3xl border-2 border-choco-900/20 bg-gradient-to-b from-white via-[#FFF9F5] to-[#FDEEE4] p-3.5 shadow-[0_4px_0_#3B2218] transition-all duration-150 hover:-translate-y-0.5 hover:shadow-[0_6px_0_#3B2218] active:translate-y-[2px] active:shadow-[0_2px_0_#3B2218]"
        >
          <div className="grid size-12 shrink-0 place-items-center overflow-hidden rounded-2xl border-2 border-candy-600 bg-gradient-to-b from-[#FFF0F5] via-[#FFE4EC] to-[#FDC8D8] shadow-[0_3px_0_#B01F62]">
            <Mascot mood="proud" size={36} lite fill={false} interactive={false} />
          </div>
          <div className="min-w-0 flex-1">
            <div className="truncate font-display text-sm font-bold text-choco-900">@{username || "pelajar"}</div>
            <div className="mt-1 flex items-center gap-2 text-[11px] font-bold tabular-nums text-choco-600">
              <span className={cn("inline-flex items-center gap-1", streak > 0 ? "text-flame-500 font-extrabold" : "text-choco-500 font-semibold")}>
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

function NavRow({
  to,
  label,
  active,
  badge,
  badgeTone = "pink",
  onNavigate,
  icon,
}: {
  to: "/" | "/kisah" | "/leaderboard" | "/shop" | "/profile" | "/raffle" | "/admin" | "/masuk";
  label: string;
  active: boolean;
  badge?: string;
  badgeTone?: "pink" | "amber";
  onNavigate: () => void;
  icon: ReactNode;
}) {
  return (
    <Link
      to={to}
      aria-current={active ? "page" : undefined}
      onClick={onNavigate}
      className="group flex w-full items-center"
    >
      {active ? (
        <span className="flex h-[52px] w-full items-center gap-2.5 rounded-full bg-gradient-to-b from-[#D62A78] via-[#B01F62] to-[#85174A] pl-2 pr-4 text-white shadow-[0_4px_0_#B01E5D] transition-transform active:translate-y-[2px] active:shadow-[0_2px_0_#B01E5D]">
          <span className="grid size-9 shrink-0 place-items-center rounded-full bg-white/20 p-0.5">
            <span className="grid size-8 place-items-center rounded-full bg-white text-[#FF3D88] shadow-[0_2px_0_#3B2218]">
              {icon}
            </span>
          </span>
          <span className="font-display text-[15.5px] font-extrabold tracking-[-0.01em] text-white">
            {label}
          </span>
          {badge ? <Badge tone={badgeTone} className="ml-auto" label={badge} /> : null}
        </span>
      ) : (
        <div className="flex h-[42px] w-full items-center">
          <span className="grid size-[38px] shrink-0 place-items-center rounded-full border border-choco-900/15 bg-white text-choco-900 shadow-[0_2.5px_0_#3B2218] transition-all group-hover:brightness-105 group-hover:shadow-[0_3px_0_#3B2218] group-active:translate-y-px group-active:shadow-[0_1px_0_#3B2218]">
            {icon}
          </span>
          <span className="ml-3.5 font-display text-[15px] font-bold tracking-[-0.01em] text-[#4A3E3D] transition-colors group-hover:text-choco-900">
            {label}
          </span>
          {badge ? <Badge tone={badgeTone} className="ml-auto mr-1" label={badge} /> : null}
        </div>
      )}
    </Link>
  );
}

function Badge({
  label,
  tone,
  className,
}: {
  label: string;
  tone: "pink" | "amber";
  className?: string;
}) {
  return (
    <span
      className={cn(
        "shrink-0 rounded-full border px-2.5 py-0.5 text-[11px] font-extrabold leading-none tracking-tight",
        tone === "amber"
          ? "border-[#F0C96A] bg-[#FFF8E8] text-[#C48A00] shadow-[0_2px_0_#D4902C]"
          : "border-[#F3B4CC] bg-[#FFF0F5] text-[#9E2356] shadow-[0_2px_0_#BD145F]",
        className,
      )}
    >
      {label}
    </span>
  );
}
