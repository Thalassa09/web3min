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
  fullWidth?: boolean;
}

const DEPTH: Record<ButtonSize, number> = { sm: 3.5, md: 4.5, lg: 5.5 };

const VARIANT_STYLES: Record<
  ButtonVariant,
  { bg: string; text: string; border: string; shadowColor: string; hover: string }
> = {
  primary: {
    bg: "bg-[#FFC61A]",
    text: "text-[#0D2340]",
    border: "border-2 border-[#E5A800]",
    shadowColor: "#D99400",
    hover: "hover:bg-[#FFD147]",
  },
  secondary: {
    bg: "bg-[#FFFFFF]",
    text: "text-[#0D2340]",
    border: "border-2 border-[#B9CFE9]",
    shadowColor: "#C8DBF0",
    hover: "hover:bg-[#F0F6FF]",
  },
  amber: {
    bg: "bg-[#FFC61A]",
    text: "text-[#0D2340]",
    border: "border-2 border-[#E5A800]",
    shadowColor: "#D99400",
    hover: "hover:bg-[#FFD147]",
  },
  danger: {
    bg: "bg-[#E63329]",
    text: "text-white",
    border: "border-2 border-[#B01E18]",
    shadowColor: "#B01E18",
    hover: "hover:bg-[#F2443A]",
  },
  success: {
    bg: "bg-[#34C06A]",
    text: "text-white",
    border: "border-2 border-[#1E8A49]",
    shadowColor: "#1E8A49",
    hover: "hover:bg-[#43D47C]",
  },
  ghost: {
    bg: "bg-transparent",
    text: "text-[#4A6580]",
    border: "border-2 border-transparent",
    shadowColor: "transparent",
    hover: "hover:bg-white/15 hover:text-[#0D2340]",
  },
};

const SIZE_STYLES: Record<ButtonSize, string> = {
  sm: "h-10 px-4 text-xs font-extrabold gap-1.5 rounded-[14px]",
  md: "h-12 px-5 text-sm font-extrabold gap-2 rounded-[16px]",
  lg: "h-14 px-6 text-base font-extrabold gap-2.5 rounded-[18px]",
};

/**
 * Chunky Tactile Button — Sunny World Console Game
 * Explicit pointer-events, hardware-accelerated translate3d depth, and instant haptic/audio snap.
 */
export function TactileButton({
  variant = "primary",
  size = "md",
  children,
  icon,
  fullWidth = false,
  className = "",
  disabled,
  onClick,
  style,
  ...props
}: TactileButtonProps) {
  const [pressed, setPressed] = useState(false);
  const sound = useProgress((s) => s.sound);
  const v = VARIANT_STYLES[variant] ?? VARIANT_STYLES.primary;
  const s = SIZE_STYLES[size] ?? SIZE_STYLES.md;
  const depth = DEPTH[size] ?? 4.5;

  const down = () => {
    if (disabled) return;
    setPressed(true);
    if (sound) playTap();
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
        transition:
          "transform var(--dur-tap, 90ms) var(--ease-out-quint, cubic-bezier(.22, 1, .36, 1)), box-shadow var(--dur-tap, 90ms) var(--ease-out-quint, cubic-bezier(.22, 1, .36, 1))",
        touchAction: "manipulation",
        ...style,
      }}
      className={`
        relative inline-flex items-center justify-center font-sans font-extrabold select-none cursor-pointer
        focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-[#0B4FD1] focus-visible:ring-offset-2
        disabled:cursor-not-allowed disabled:shadow-none
        ${disabled ? "bg-[#E2E8F0] text-[#8095AB] border-2 border-[#CBD5E1]" : `${v.bg} ${v.text} ${v.border} ${disabled ? "" : v.hover}`}
        ${s} ${fullWidth ? "w-full" : ""} ${className}
      `}
      {...props}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
    </button>
  );
}
