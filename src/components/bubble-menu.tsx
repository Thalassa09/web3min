/**
 * BubbleMenu Component for Web3min
 * 
 * Playful and interactive bubble-style navigation with floating pill animations,
 * GSAP-powered staggered reveals, candy pink palette, tactile 2px ink lines,
 * and seamless integration with TanStack Router.
 */

import type { CSSProperties, ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { gsap } from "gsap";
import { Compass, BookOpen, Trophy, ShoppingBag, User, Smartphone, Sparkles } from "lucide-react";
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
    rotation: -6,
    icon: <Compass className="size-6 text-candy-deep stroke-[2.5]" />,
    badge: "148 BLOK",
    description: "Peta petualangan Pulau Rantai",
    hoverStyles: { bgColor: "#F26A99", textColor: "#ffffff" }
  },
  {
    label: "Kisah",
    href: "/kisah",
    ariaLabel: "Kisah On-Chain Web3",
    rotation: 6,
    icon: <BookOpen className="size-6 text-grape stroke-[2.5]" />,
    badge: "20 CERITA",
    description: "Kisah nyata sejarah kripto",
    hoverStyles: { bgColor: "#8B5CF6", textColor: "#ffffff" }
  },
  {
    label: "Arena",
    href: "/leaderboard",
    ariaLabel: "Arena Liga Belajar Mingguan",
    rotation: -5,
    icon: <Trophy className="size-6 text-coin stroke-[2.5]" />,
    badge: "LIGA XP",
    description: "Peringkat & kompetisi mingguan",
    hoverStyles: { bgColor: "#FFC61A", textColor: "#1B1440" }
  },
  {
    label: "Toko",
    href: "/shop",
    ariaLabel: "Toko Blobi dan Oksigen",
    rotation: 7,
    icon: <ShoppingBag className="size-6 text-flame stroke-[2.5]" />,
    badge: "RELOAD",
    description: "Isi ulang nyawa & pelindung streak",
    hoverStyles: { bgColor: "#F2841F", textColor: "#ffffff" }
  },
  {
    label: "Profil",
    href: "/profile",
    ariaLabel: "Profil Penjelajah & Lisensi",
    rotation: -7,
    icon: <User className="size-6 text-sky stroke-[2.5]" />,
    badge: "LISENSI",
    description: "Analitik progres & struk blok",
    hoverStyles: { bgColor: "#1CB0F6", textColor: "#ffffff" }
  },
  {
    label: "Stage",
    href: "/rantai",
    ariaLabel: "Simulasi 3-Phone Stage Pulau Rantai",
    rotation: 5,
    icon: <Smartphone className="size-6 text-candy stroke-[2.5]" />,
    badge: "STAGE 3D",
    description: "Simulasi interaktif panggung ponsel",
    hoverStyles: { bgColor: "#D62A78", textColor: "#ffffff" }
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
  animationDuration = 0.42,
  staggerDelay = 0.07,
  compactTriggerOnly = false
}: BubbleMenuProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);
  const bubblesRef = useRef<HTMLButtonElement[]>([]);
  const labelRefs = useRef<HTMLSpanElement[]>([]);
  const navigate = useNavigate();
  const sound = useProgress((s) => s.sound);

  const menuItems = items?.length ? items : DEFAULT_BUBBLE_ITEMS;

  const handleToggle = () => {
    const nextState = !isMenuOpen;
    if (sound) playTap();
    if (nextState) setShowOverlay(true);
    setIsMenuOpen(nextState);
    onMenuClick?.(nextState);
  };

  const handleItemSelect = (href: string) => {
    if (sound) playTap();
    // Close menu with animation
    setIsMenuOpen(false);
    onMenuClick?.(false);
    // Smooth transition before navigation
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
    const bubbles = bubblesRef.current.filter(Boolean);
    const labels = labelRefs.current.filter(Boolean);
    if (!overlay || !bubbles.length) return;

    if (isMenuOpen) {
      gsap.set(overlay, { display: "flex" });
      gsap.killTweensOf([...bubbles, ...labels]);
      gsap.set(bubbles, { scale: 0, transformOrigin: "50% 50%" });
      gsap.set(labels, { y: 20, autoAlpha: 0 });

      bubbles.forEach((bubble, i) => {
        const delay = i * staggerDelay + (Math.random() * 0.06 - 0.03);
        const tl = gsap.timeline({ delay });
        tl.to(bubble, {
          scale: 1,
          duration: animationDuration,
          ease: animationEase
        });
        if (labels[i]) {
          tl.to(
            labels[i],
            {
              y: 0,
              autoAlpha: 1,
              duration: animationDuration,
              ease: "power3.out"
            },
            `-=${animationDuration * 0.8}`
          );
        }
      });
    } else if (showOverlay) {
      gsap.killTweensOf([...bubbles, ...labels]);
      gsap.to(labels, {
        y: 20,
        autoAlpha: 0,
        duration: 0.18,
        ease: "power3.in"
      });
      gsap.to(bubbles, {
        scale: 0,
        duration: 0.2,
        ease: "power3.in",
        onComplete: () => {
          gsap.set(overlay, { display: "none" });
          setShowOverlay(false);
        }
      });
    }
  }, [isMenuOpen, showOverlay, animationEase, animationDuration, staggerDelay]);

  // Handle responsiveness and rotations
  useEffect(() => {
    const handleResize = () => {
      if (isMenuOpen) {
        const bubbles = bubblesRef.current.filter(Boolean);
        const isDesktop = window.innerWidth >= 900;
        bubbles.forEach((bubble, i) => {
          const item = menuItems[i];
          if (bubble && item) {
            const rotation = isDesktop ? (item.rotation ?? 0) : 0;
            gsap.set(bubble, { rotation });
          }
        });
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isMenuOpen, menuItems]);

  return (
    <>
      <style>{`
        .bubble-menu-root .menu-line {
          transition: transform 0.3s cubic-bezier(.34,1.56,.64,1), opacity 0.25s ease;
          transform-origin: center;
        }
        .bubble-overlay {
          background: radial-gradient(circle at center, rgba(13, 35, 64, 0.72) 0%, rgba(9, 24, 45, 0.94) 100%);
          backdrop-filter: saturate(180%) blur(24px);
          -webkit-backdrop-filter: saturate(180%) blur(24px);
        }
        .bubble-pill-btn {
          transform: rotate(var(--item-rot));
          box-shadow: inset 0 2px 0 rgba(255, 255, 255, 0.8), 0 5px 0 var(--color-ink-900, #1B1440);
          transition: transform 0.16s cubic-bezier(0.2, 0.9, 0.3, 1), background-color 0.2s ease, color 0.2s ease, box-shadow 0.16s ease;
        }
        .bubble-pill-btn:hover {
          transform: rotate(var(--item-rot)) scale(1.04) translateY(-2px);
          background: var(--hover-bg) !important;
          color: var(--hover-color) !important;
          box-shadow: inset 0 2px 0 rgba(255, 255, 255, 0.9), 0 7px 0 var(--color-ink-900, #1B1440);
        }
        .bubble-pill-btn:hover .bubble-icon-wrap {
          transform: scale(1.08) rotate(-3deg);
          background: #ffffff;
        }
        .bubble-pill-btn:hover .bubble-badge {
          border-color: #1B1440;
          background: #ffffff;
          color: #1B1440;
        }
        .bubble-pill-btn:active {
          transform: rotate(var(--item-rot)) scale(0.97) translateY(4px);
          box-shadow: inset 0 2px 0 rgba(255, 255, 255, 0.4), 0 1px 0 var(--color-ink-900, #1B1440);
        }
        @media (max-width: 899px) {
          .bubble-pill-btn {
            transform: none !important;
          }
          .bubble-pill-btn:hover {
            transform: scale(1.02) !important;
          }
          .bubble-pill-btn:active {
            transform: scale(0.98) translateY(2px) !important;
          }
        }
      `}</style>

      {/* Trigger & Optional Logo Bar */}
      {compactTriggerOnly ? (
        /* Standalone Compact Bubble Button */
        <button
          type="button"
          className={[
            "bubble-trigger group relative flex size-10 items-center justify-center rounded-full border-2 border-ink-900",
            "shadow-ink-sm transition-all duration-150 active:translate-y-0.5 active:shadow-none",
            className
          ].join(" ")}
          onClick={handleToggle}
          aria-label={menuAriaLabel}
          aria-pressed={isMenuOpen}
          style={{ background: menuBg, color: menuContentColor, ...style }}
        >
          <div className="flex flex-col items-center justify-center gap-1">
            <span
              className="menu-line block rounded-full"
              style={{
                width: 18,
                height: 2.5,
                background: "#ffffff",
                transform: isMenuOpen ? "translateY(3.5px) rotate(45deg)" : "none"
              }}
            />
            <span
              className="menu-line block rounded-full"
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
        /* Floating Bubble Nav Bar */
        <nav
          className={[
            "bubble-menu-root pointer-events-none z-[1001] flex items-center justify-between gap-4 px-4 sm:px-8",
            useFixedPosition ? "fixed left-0 right-0 top-4 sm:top-6" : "absolute left-0 right-0 top-4",
            className
          ].join(" ")}
          style={style}
          aria-label="Navigasi Menu Bubble"
        >
          {/* Logo Bubble */}
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

          {/* Toggle Bubble Button */}
          <button
            type="button"
            className={[
              "bubble-toggle pointer-events-auto flex size-12 items-center justify-center rounded-full border-2 border-ink-900 sm:size-14",
              "transition-transform duration-150 active:translate-y-1 active:shadow-none"
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
                className="menu-line block rounded-full"
                style={{
                  width: 22,
                  height: 3,
                  background: "#ffffff",
                  transform: isMenuOpen ? "translateY(4.5px) rotate(45deg)" : "none"
                }}
              />
              <span
                className="menu-line block rounded-full"
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
      )}

      {/* Fullscreen Staggered Bubble Menu Overlay */}
      {showOverlay && (
        <div
          ref={overlayRef}
          className={[
            "bubble-overlay pointer-events-auto fixed inset-0 z-[1000] flex flex-col items-center justify-center overflow-y-auto px-4 py-12 sm:px-8",
            "transition-opacity duration-200"
          ].join(" ")}
          aria-hidden={!isMenuOpen}
          onClick={(e) => {
            if (e.target === overlayRef.current) {
              handleToggle();
            }
          }}
        >
          {/* Apple-style Circular Close Button */}
          <button
            type="button"
            onClick={handleToggle}
            aria-label="Tutup menu navigasi"
            className="absolute right-4 top-4 flex size-11 items-center justify-center rounded-full border-2 border-white/20 bg-white/10 text-white shadow-lg backdrop-blur-md transition-all duration-120 hover:scale-105 hover:bg-white/20 active:scale-95 sm:right-8 sm:top-8"
          >
            <span className="text-base font-black leading-none">✕</span>
          </button>

          {/* Header Title in Overlay */}
          <div className="mb-6 flex flex-col items-center text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full border-2 border-white/20 bg-white/10 px-4 py-1 text-xs font-black uppercase tracking-wider text-candy-soft backdrop-blur-md">
              <Sparkles className="size-3.5 text-coin" />
              Menu Navigasi Penjelajah
            </span>
            <h2 className="mt-2 font-display text-2xl font-black tracking-tight text-white sm:text-3xl">
              Mau jelajah ke mana hari ini?
            </h2>
          </div>

          {/* Staggered Bubble Pill Grid */}
          <ul
            className="m-0 flex w-full max-w-5xl list-none flex-wrap justify-center gap-3 p-0 sm:gap-5"
            role="menu"
            aria-label="Pilihan menu navigasi"
          >
            {menuItems.map((item, idx) => (
              <li
                key={idx}
                role="none"
                className="box-border flex w-full items-stretch sm:w-[calc(50%-10px)] lg:w-[calc(33.333%-14px)]"
              >
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => handleItemSelect(item.href)}
                  aria-label={item.ariaLabel || item.label}
                  className={[
                    "bubble-pill-btn group relative flex w-full items-center gap-4 rounded-full border-2 border-ink-900 bg-white p-3 sm:p-4 text-left no-underline",
                    "min-h-[82px] sm:min-h-[96px] cursor-pointer select-none"
                  ].join(" ")}
                  style={
                    {
                      "--item-rot": `${item.rotation ?? 0}deg`,
                      "--hover-bg": item.hoverStyles?.bgColor || "#F26A99",
                      "--hover-color": item.hoverStyles?.textColor || "#ffffff",
                      willChange: "transform"
                    } as CSSProperties
                  }
                  ref={(el) => {
                    if (el) bubblesRef.current[idx] = el;
                  }}
                >
                  {/* Icon Bubble */}
                  <div className="bubble-icon-wrap flex size-12 shrink-0 items-center justify-center rounded-full border-2 border-ink-900 bg-soft shadow-ink-xs transition-transform duration-200 sm:size-14">
                    {item.icon}
                  </div>

                  {/* Label & Details */}
                  <div
                    ref={(el) => {
                      if (el) labelRefs.current[idx] = el;
                    }}
                    className="flex flex-1 flex-col justify-center overflow-hidden"
                  >
                    <div className="flex items-center gap-2">
                      <span className="truncate font-display text-lg font-black text-ink-900 group-hover:text-inherit sm:text-xl">
                        {item.label}
                      </span>
                      {item.badge && (
                        <span className="bubble-badge rounded-full border border-ink-900 bg-coin px-2 py-0.5 text-[10px] font-black uppercase text-ink-900 shadow-ink-xs transition-colors">
                          {item.badge}
                        </span>
                      )}
                    </div>
                    {item.description && (
                      <p className="mt-0.5 truncate text-xs font-bold text-ink-500 opacity-80 group-hover:text-inherit group-hover:opacity-90">
                        {item.description}
                      </p>
                    )}
                  </div>
                </button>
              </li>
            ))}
          </ul>

          {/* Close hint button */}
          <button
            type="button"
            onClick={handleToggle}
            className="mt-8 flex items-center gap-2 rounded-full border-2 border-white/20 bg-white/10 px-5 py-2 text-xs font-black text-white/90 backdrop-blur-md transition-all hover:bg-white/20 active:translate-y-0.5"
          >
            ✕ Tutup Menu (Esc)
          </button>
        </div>
      )}
    </>
  );
}

export default BubbleMenu;
