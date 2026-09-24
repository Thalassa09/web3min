/**
 * BubbleMenu Component for Web3min
 * 
 * Clean, tactile, and responsive bubble-style navigation modal.
 * Uses React Portal to avoid header stacking-context traps,
 * crisp zero-rotation pill cards with Garis Tinta (2px ink border & hard shadow),
 * smooth GSAP stagger animation, and full mobile + desktop responsiveness.
 */

import type { CSSProperties, ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "@tanstack/react-router";
import { gsap } from "gsap";
import { Compass, BookOpen, Trophy, ShoppingBag, User, Sparkles, X } from "lucide-react";
import { playTap } from "@/lib/audio";
import { useProgress } from "@/lib/store";

export type MenuItem = {
  label: string;
  href: string;
  ariaLabel?: string;
  rotation?: number;
  icon?: ReactNode;
  badge?: string;
  description?: string;
  hoverStyles?: {
    bgColor?: string;
    textColor?: string;
  };
};

export type BubbleMenuProps = {
  logo?: ReactNode | string;
  onMenuClick?: (open: boolean) => void;
  className?: string;
  style?: CSSProperties;
  menuAriaLabel?: string;
  menuBg?: string;
  menuContentColor?: string;
  useFixedPosition?: boolean;
  items?: MenuItem[];
  animationEase?: string;
  animationDuration?: number;
  staggerDelay?: number;
  compactTriggerOnly?: boolean;
};

export const DEFAULT_BUBBLE_ITEMS: MenuItem[] = [
  {
    label: "Belajar",
    href: "/",
    ariaLabel: "Pulau Rantai - Peta Belajar",
    rotation: 0,
    icon: <Compass className="size-6 text-candy-deep stroke-[2.5]" />,
    badge: "148 BLOK",
    description: "Peta petualangan Pulau Rantai",
    hoverStyles: { bgColor: "#F26A99", textColor: "#ffffff" }
  },
  {
    label: "Kisah",
    href: "/kisah",
    ariaLabel: "Kisah On-Chain Web3",
    rotation: 0,
    icon: <BookOpen className="size-6 text-grape stroke-[2.5]" />,
    badge: "20 CERITA",
    description: "Kisah nyata sejarah kripto",
    hoverStyles: { bgColor: "#8B5CF6", textColor: "#ffffff" }
  },
  {
    label: "Arena",
    href: "/leaderboard",
    ariaLabel: "Arena Liga Belajar Mingguan",
    rotation: 0,
    icon: <Trophy className="size-6 text-coin stroke-[2.5]" />,
    badge: "LIGA XP",
    description: "Peringkat & kompetisi mingguan",
    hoverStyles: { bgColor: "#FFC61A", textColor: "#1B1440" }
  },
  {
    label: "Toko",
    href: "/shop",
    ariaLabel: "Toko Blobi dan Oksigen",
    rotation: 0,
    icon: <ShoppingBag className="size-6 text-flame stroke-[2.5]" />,
    badge: "RELOAD",
    description: "Isi ulang nyawa & pelindung streak",
    hoverStyles: { bgColor: "#F2841F", textColor: "#ffffff" }
  },
  {
    label: "Profil",
    href: "/profile",
    ariaLabel: "Profil Penjelajah & Lisensi",
    rotation: 0,
    icon: <User className="size-6 text-candy-500 stroke-[2.5]" />,
    badge: "LISENSI",
    description: "Analitik progres & struk blok",
    hoverStyles: { bgColor: "#E8437F", textColor: "#ffffff" }
  }
];

export function BubbleMenu({
  logo,
  onMenuClick,
  className = "",
  style,
  menuAriaLabel = "Buka menu navigasi bubble",
  menuBg = "#F26A99",
  menuContentColor = "#1B1440",
  useFixedPosition = true,
  items,
  animationEase = "back.out(1.2)",
  animationDuration = 0.35,
  staggerDelay = 0.05,
  compactTriggerOnly = false
}: BubbleMenuProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);
  const [mounted, setMounted] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);
  const cardContainerRef = useRef<HTMLDivElement>(null);
  const bubblesRef = useRef<HTMLButtonElement[]>([]);
  const navigate = useNavigate();
  const sound = useProgress((s) => s.sound);

  const menuItems = items?.length ? items : DEFAULT_BUBBLE_ITEMS;

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleToggle = () => {
    const nextState = !isMenuOpen;
    if (sound) playTap();
    if (nextState) setShowOverlay(true);
    setIsMenuOpen(nextState);
    onMenuClick?.(nextState);
  };

  const handleItemSelect = (href: string) => {
    if (sound) playTap();
    setIsMenuOpen(false);
    onMenuClick?.(false);
    setTimeout(() => {
      if (href.startsWith("http")) {
        window.location.href = href;
      } else {
        void navigate({ to: href });
      }
    }, 180);
  };

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isMenuOpen) {
        setIsMenuOpen(false);
        onMenuClick?.(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isMenuOpen, onMenuClick]);

  // GSAP Animations
  useEffect(() => {
    const overlay = overlayRef.current;
    const cardContainer = cardContainerRef.current;
    const bubbles = bubblesRef.current.filter(Boolean);
    if (!overlay) return;

    if (isMenuOpen) {
      gsap.killTweensOf([overlay, cardContainer, ...bubbles]);
      gsap.set(overlay, { display: "flex", opacity: 0 });
      gsap.to(overlay, {
        opacity: 1,
        duration: 0.22,
        ease: "power2.out"
      });

      if (cardContainer) {
        gsap.fromTo(
          cardContainer,
          { scale: 0.95, y: 16 },
          { scale: 1, y: 0, duration: animationDuration, ease: animationEase }
        );
      }

      if (bubbles.length) {
        gsap.fromTo(
          bubbles,
          { opacity: 0, y: 12 },
          {
            opacity: 1,
            y: 0,
            duration: animationDuration * 0.8,
            stagger: staggerDelay,
            ease: "power2.out"
          }
        );
      }
    } else if (showOverlay) {
      gsap.killTweensOf([overlay, cardContainer, ...bubbles]);
      gsap.to(overlay, {
        opacity: 0,
        duration: 0.18,
        ease: "power2.in",
        onComplete: () => {
          gsap.set(overlay, { display: "none" });
          setShowOverlay(false);
        }
      });
    }
  }, [isMenuOpen, showOverlay, animationEase, animationDuration, staggerDelay]);

  /* ---------------- Triggers ---------------- */
  const triggerMarkup = compactTriggerOnly ? (
    <button
      type="button"
      className={[
        "bubble-trigger group relative flex size-10 items-center justify-center rounded-full border-2 border-ink-900",
        "shadow-ink-sm transition-all duration-150 active:translate-y-0.5 active:shadow-none cursor-pointer",
        className
      ].join(" ")}
      onClick={handleToggle}
      aria-label={menuAriaLabel}
      aria-pressed={isMenuOpen}
      style={{ background: menuBg, color: menuContentColor, ...style }}
    >
      <div className="flex flex-col items-center justify-center gap-1">
        <span
          className="block rounded-full transition-transform duration-200"
          style={{
            width: 18,
            height: 2.5,
            background: "#ffffff",
            transform: isMenuOpen ? "translateY(3.5px) rotate(45deg)" : "none"
          }}
        />
        <span
          className="block rounded-full transition-transform duration-200"
          style={{
            width: 18,
            height: 2.5,
            background: "#ffffff",
            transform: isMenuOpen ? "translateY(-3.5px) rotate(-45deg)" : "none"
          }}
        />
      </div>
    </button>
  ) : (
    <nav
      className={[
        "bubble-menu-root pointer-events-none z-[1001] flex items-center justify-between gap-4 px-4 sm:px-8",
        useFixedPosition ? "fixed left-0 right-0 top-4 sm:top-6" : "absolute left-0 right-0 top-4",
        className
      ].join(" ")}
      style={style}
      aria-label="Navigasi Menu Bubble"
    >
      <div
        className="pointer-events-auto inline-flex h-12 items-center justify-center gap-2 rounded-full border-2 border-ink-900 bg-white px-5 shadow-ink-sm sm:h-14 sm:px-6"
        style={{ minHeight: "48px" }}
      >
        {logo ? (
          typeof logo === "string" ? (
            <img src={logo} alt="Logo" className="max-h-7 max-w-full object-contain" />
          ) : (
            logo
          )
        ) : (
          <div className="flex items-center gap-2">
            <span className="grid size-7 place-items-center rounded-full border-2 border-ink-900 bg-candy text-xs font-black text-white shadow-ink-xs">
              W3
            </span>
            <span className="font-display text-base font-black text-ink-900 sm:text-lg">
              web3<span className="text-candy-deep">min</span>
            </span>
          </div>
        )}
      </div>

      <button
        type="button"
        className={[
          "bubble-toggle pointer-events-auto flex size-12 items-center justify-center rounded-full border-2 border-ink-900 sm:size-14",
          "transition-transform duration-150 active:translate-y-1 active:shadow-none cursor-pointer"
        ].join(" ")}
        onClick={handleToggle}
        aria-label={menuAriaLabel}
        aria-pressed={isMenuOpen}
        style={{
          background: menuBg,
          boxShadow: "inset 0 2px 0 rgba(255,255,255,0.6), 0 4px 0 #A51D5B"
        }}
      >
        <div className="flex flex-col items-center justify-center gap-1.5">
          <span
            className="block rounded-full transition-transform duration-200"
            style={{
              width: 22,
              height: 3,
              background: "#ffffff",
              transform: isMenuOpen ? "translateY(4.5px) rotate(45deg)" : "none"
            }}
          />
          <span
            className="block rounded-full transition-transform duration-200"
            style={{
              width: 22,
              height: 3,
              background: "#ffffff",
              transform: isMenuOpen ? "translateY(-4.5px) rotate(-45deg)" : "none"
            }}
          />
        </div>
      </button>
    </nav>
  );

  /* ---------------- Fullscreen Overlay Modal ---------------- */
  const overlayMarkup = showOverlay && (
    <div
      ref={overlayRef}
      className={[
        useFixedPosition ? "fixed inset-0 z-[9999]" : "absolute inset-0 z-50",
        "flex flex-col items-center justify-center p-4 sm:p-6 overflow-y-auto",
        "bg-choco-900/70 backdrop-blur-md"
      ].join(" ")}
      style={{
        WebkitBackdropFilter: "blur(12px)"
      }}
      aria-hidden={!isMenuOpen}
      onClick={(e) => {
        if (e.target === overlayRef.current || e.target === cardContainerRef.current) {
          handleToggle();
        }
      }}
    >
      {/* Circular Close Button */}
      <button
        type="button"
        onClick={handleToggle}
        aria-label="Tutup menu navigasi"
        className="fixed top-4 right-4 sm:top-6 sm:right-6 z-[10000] flex size-11 items-center justify-center rounded-full border-2 border-choco-900 bg-white text-choco-900 shadow-[0_2px_0_#3B2218] transition-all duration-150 hover:scale-105 hover:bg-candy-100 active:scale-95 cursor-pointer"
      >
        <X className="size-5 stroke-[2.5]" />
      </button>

      {/* Center Modal Card Container */}
      <div
        ref={cardContainerRef}
        className="w-full max-w-3xl flex flex-col items-center my-auto py-6"
      >
        {/* Header Title in Overlay */}
        <div className="mb-6 flex flex-col items-center text-center px-4">
          <span className="inline-flex items-center gap-1.5 rounded-full border-2 border-white/35 bg-black/35 px-4 py-1 text-xs font-black uppercase tracking-wider text-white shadow-sm backdrop-blur-md">
            <Sparkles className="size-3.5 text-coin" />
            Menu Navigasi Penjelajah
          </span>
          <h2 className="mt-2.5 font-sans text-2xl sm:text-3xl font-black tracking-tight text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.7)]">
            Mau jelajah ke mana hari ini?
          </h2>
        </div>

        {/* Clean Responsive Card Grid (Flat, No Rotation, No Stacking Collisions) */}
        <div
          className="grid w-full grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 px-2"
          role="menu"
          aria-label="Pilihan menu navigasi"
        >
          {menuItems.map((item, idx) => (
            <button
              key={idx}
              ref={(el) => {
                if (el) bubblesRef.current[idx] = el;
              }}
              type="button"
              role="menuitem"
              onClick={() => handleItemSelect(item.href)}
              aria-label={item.ariaLabel || item.label}
              className={[
                "group relative flex w-full items-center gap-3.5 sm:gap-4 rounded-2xl border-2 border-ink-900 bg-white p-3.5 sm:p-4 text-left no-underline",
                "shadow-[0_4px_0_#2B1622] hover:shadow-[0_6px_0_#2B1622] hover:-translate-y-0.5",
                "active:translate-y-1 active:shadow-none transition-all duration-150 cursor-pointer select-none"
              ].join(" ")}
            >
              {/* Icon Wrap */}
              <div className="flex size-12 sm:size-13 shrink-0 items-center justify-center rounded-xl border-2 border-ink-900 bg-soft shadow-xs group-hover:scale-105 transition-transform duration-150">
                {item.icon}
              </div>

              {/* Label & Details */}
              <div className="flex flex-1 flex-col justify-center min-w-0">
                <div className="flex items-center gap-2">
                  <span className="truncate font-sans text-base sm:text-lg font-black text-ink-900 group-hover:text-candy-deep transition-colors">
                    {item.label}
                  </span>
                  {item.badge && (
                    <span className="rounded-full border border-ink-900 bg-coin px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-ink-900 shadow-xs">
                      {item.badge}
                    </span>
                  )}
                </div>
                {item.description && (
                  <p className="mt-0.5 truncate text-xs font-bold text-ink-500">
                    {item.description}
                  </p>
                )}
              </div>
            </button>
          ))}
        </div>

        {/* Close hint button */}
        <button
          type="button"
          onClick={handleToggle}
          className="mt-8 flex items-center gap-2 rounded-full border-2 border-white/30 bg-black/35 px-5 py-2 text-xs font-black text-white shadow-sm backdrop-blur-md transition-all hover:bg-black/55 active:translate-y-0.5 cursor-pointer"
        >
          <X className="size-3.5" /> Tutup Menu (Esc)
        </button>
      </div>
    </div>
  );

  return (
    <>
      {triggerMarkup}
      {showOverlay && (
        useFixedPosition && mounted && typeof document !== "undefined"
          ? createPortal(overlayMarkup, document.body)
          : overlayMarkup
      )}
    </>
  );
}

export default BubbleMenu;
