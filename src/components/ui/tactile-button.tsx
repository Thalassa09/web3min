import React, { useState } from "react";
import { playTap } from "@/lib/audio";
import { useProgress } from "@/lib/store";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "amber" | "danger" | "success";
export type ButtonSize = "sm" | "md" | "lg";

interface TactileButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: React.ReactNode;
  icon?: React.ReactNode;
  iconAfter?: React.ReactNode;
  fullWidth?: boolean;
}

const DEPTH: Record<ButtonSize, number> = { sm: 3.5, md: 4.5, lg: 5.5 };

const VARIANT_STYLES: Record<
  ButtonVariant,
  { bg: string; text: string; border: string; shadowColor: string; hover: string }
> = {
  primary: {
    bg: "bg-primary",
    text: "text-white",
    border: "border-2 border-primary-shadow",
    shadowColor: "#B01F62",
    hover: "hover:bg-primary-hover hover:brightness-105",
  },
  secondary: {
    bg: "bg-paper",
    text: "text-ink-900",
    border: "border-2 border-line",
    shadowColor: "#E5CFD9",
    hover: "hover:bg-canvas hover:border-line-strong",
  },
  amber: {
    bg: "bg-coin",
    text: "text-ink-900",
    border: "border-2 border-coin-shadow",
    shadowColor: "#D99400",
    hover: "hover:brightness-105",
  },
  danger: {
    bg: "bg-danger",
    text: "text-white",
    border: "border-2 border-danger-shadow",
    shadowColor: "#991B1B",
    hover: "hover:brightness-105",
  },
  success: {
    bg: "bg-ok",
    text: "text-white",
    border: "border-2 border-ok-shadow",
    shadowColor: "#15803D",
    hover: "hover:brightness-105",
  },
  ghost: {
    bg: "bg-transparent",
    text: "text-ink-900",
    border: "border-2 border-transparent",
    shadowColor: "transparent",
    hover: "hover:bg-primary-soft hover:text-ink-900",
  },
};

const SIZE_STYLES: Record<ButtonSize, string> = {
  sm: "h-9 px-3.5 text-xs font-extrabold gap-1.5 rounded-sm",
  md: "h-11 px-5 text-sm font-extrabold gap-2 rounded-md",
  lg: "h-13 px-6 text-base font-extrabold gap-2.5 rounded-lg",
};

/**
 * Chunky Tactile Button — Pixel Candy Identity
 * Chunky 2px ink borders, hard offset shadows, pressing down when clicked.
 */
export function TactileButton({
  variant = "primary",
  size = "md",
  children,
  icon,
  iconAfter,
  fullWidth = false,
  className = "",
  disabled,
  onClick,
  style,
  ...props
}: TactileButtonProps) {
  const [pressed, setPressed] = useState(false);
  const sound = useProgress((s) => s.sound);
  const reduceMotion = useProgress((s) => s.reduceMotion);
  const v = VARIANT_STYLES[variant] ?? VARIANT_STYLES.primary;
  const s = SIZE_STYLES[size] ?? SIZE_STYLES.md;
  const depth = DEPTH[size] ?? 4.5;

  const down = () => {
    if (disabled) return;
    setPressed(true);
    if (sound) playTap();
    if (!reduceMotion && typeof navigator !== "undefined" && typeof navigator.vibrate === "function") {
      try {
        navigator.vibrate(8);
      } catch {}
    }
  };

  const up = () => setPressed(false);

  return (
    <button
      disabled={disabled}
      onPointerDown={down}
      onPointerUp={up}
      onPointerCancel={up}
      onPointerLeave={up}
      onClick={onClick}
      style={{
        transform: `translate3d(0, ${pressed && !disabled ? depth : 0}px, 0)`,
        boxShadow: pressed || disabled ? "none" : `0 ${depth}px 0 ${v.shadowColor}`,
        transition: pressed
          ? "transform var(--dur-tap, 90ms) ease-out, box-shadow var(--dur-tap, 90ms) ease-out"
          : "transform var(--dur-pop, 260ms) var(--ease-spring), box-shadow var(--dur-pop, 260ms) var(--ease-spring)",
        touchAction: "manipulation",
        ...style,
      }}
      className={`
        tactile-btn relative inline-flex items-center justify-center font-sans font-extrabold select-none cursor-pointer
        focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-candy-400 focus-visible:ring-offset-2
        disabled:cursor-not-allowed disabled:shadow-none
        ${disabled ? "bg-[#EDE4DC] text-choco-600 border-2 border-choco-900/25" : `${v.bg} ${v.text} ${v.border} ${v.hover}`}
        ${s} ${fullWidth ? "w-full" : ""} ${className}
      `}
      {...props}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
      {iconAfter && <span className="shrink-0">{iconAfter}</span>}
    </button>
  );
}
