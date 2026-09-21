import React from "react";
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

const VARIANT_STYLES: Record<ButtonVariant, { bg: string; text: string; border: string; shadow: string; hover: string }> = {
  primary: {
    bg: "bg-[#FFC61A]",
    text: "text-[#0D2340]",
    border: "border-2 border-[#E5A800]",
    shadow: "shadow-[0_5px_0_#D99400]",
    hover: "hover:bg-[#FFD147]",
  },
  secondary: {
    bg: "bg-[#FFFFFF]",
    text: "text-[#0D2340]",
    border: "border-2 border-[#B9CFE9]",
    shadow: "shadow-[0_4px_0_#C8DBF0]",
    hover: "hover:bg-[#F0F6FF]",
  },
  amber: {
    bg: "bg-[#FFC61A]",
    text: "text-[#0D2340]",
    border: "border-2 border-[#E5A800]",
    shadow: "shadow-[0_5px_0_#D99400]",
    hover: "hover:bg-[#FFD147]",
  },
  danger: {
    bg: "bg-[#E63329]",
    text: "text-white",
    border: "border-2 border-[#B01E18]",
    shadow: "shadow-[0_4px_0_#B01E18]",
    hover: "hover:bg-[#F2443A]",
  },
  success: {
    bg: "bg-[#34C06A]",
    text: "text-white",
    border: "border-2 border-[#1E8A49]",
    shadow: "shadow-[0_4px_0_#1E8A49]",
    hover: "hover:bg-[#43D47C]",
  },
  ghost: {
    bg: "bg-transparent",
    text: "text-[#5A7796]",
    border: "border-2 border-transparent",
    shadow: "shadow-none",
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
 * Physical bottom shadow that collapses completely upon being pressed (:active translateY(3px)).
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
  ...props
}: TactileButtonProps) {
  const sound = useProgress((s) => s.sound);
  const v = VARIANT_STYLES[variant] ?? VARIANT_STYLES.primary;
  const s = SIZE_STYLES[size] ?? SIZE_STYLES.md;

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (sound && !disabled) {
      playTap();
    }
    onClick?.(e);
  };

  return (
    <button
      disabled={disabled}
      onClick={handleClick}
      className={`
        relative inline-flex items-center justify-center font-sans font-extrabold select-none
        transition-all duration-100 ease-out cursor-pointer
        active:translate-y-[3px] active:shadow-none
        focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-[#0B4FD1] focus-visible:ring-offset-2
        disabled:cursor-not-allowed disabled:active:translate-y-0 disabled:shadow-none
        ${disabled ? "bg-[#E2E8F0] text-[#8095AB] border-2 border-[#CBD5E1] shadow-none" : `${v.bg} ${v.text} ${v.border} ${v.shadow} ${v.hover}`}
        ${s} ${fullWidth ? "w-full" : ""} ${className}
      `}
      {...props}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
    </button>
  );
}
