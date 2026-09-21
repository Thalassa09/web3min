import React from "react";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "amber" | "danger";
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
    bg: "bg-[#00f59b]",
    text: "text-[#060a0f]",
    border: "border-t border-[#80ffcd]",
    shadow: "shadow-[0_3px_0_#00b875]",
    hover: "hover:bg-[#1affaa]",
  },
  secondary: {
    bg: "bg-[#141824]",
    text: "text-[#f1f4fa]",
    border: "border border-[#232b3e]",
    shadow: "shadow-[0_3px_0_#0c0f17]",
    hover: "hover:bg-[#1a2030] hover:border-[#2f3952]",
  },
  amber: {
    bg: "bg-[#f59e0b]",
    text: "text-[#060a0f]",
    border: "border-t border-[#fde68a]",
    shadow: "shadow-[0_3px_0_#b45309]",
    hover: "hover:bg-[#fbbf24]",
  },
  danger: {
    bg: "bg-[#ff4365]",
    text: "text-white",
    border: "border-t border-[#ffa3b4]",
    shadow: "shadow-[0_3px_0_#be123c]",
    hover: "hover:bg-[#ff5c7b]",
  },
  ghost: {
    bg: "transparent",
    text: "text-[#8e9ab2]",
    border: "border border-transparent",
    shadow: "shadow-none",
    hover: "hover:bg-[#141824] hover:text-[#f1f4fa] hover:border-[#232b3e]",
  },
};

const SIZE_STYLES: Record<ButtonSize, string> = {
  sm: "h-9 px-3.5 text-xs font-semibold gap-1.5 rounded-[12px]",
  md: "h-11 px-4.5 text-sm font-bold gap-2 rounded-[14px]",
  lg: "h-13 px-6 text-base font-bold gap-2.5 rounded-[16px]",
};

/**
 * Tactile Button with Emil Kowalski motion physics
 * Real physical switch compression (scale 0.98, active translate-y 2px), zero layout reflow.
 */
export function TactileButton({
  variant = "primary",
  size = "md",
  children,
  icon,
  fullWidth = false,
  className = "",
  disabled,
  ...props
}: TactileButtonProps) {
  const v = VARIANT_STYLES[variant];
  const s = SIZE_STYLES[size];

  return (
    <button
      disabled={disabled}
      className={`
        relative inline-flex items-center justify-center font-sans select-none
        transition-all duration-150 ease-out
        active:translate-y-[2px] active:scale-[0.98]
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00f59b] focus-visible:ring-offset-2 focus-visible:ring-offset-[#080a11]
        disabled:opacity-45 disabled:cursor-not-allowed disabled:active:translate-y-0 disabled:active:scale-100 disabled:shadow-none
        ${v.bg} ${v.text} ${v.border} ${disabled ? "shadow-none" : v.shadow} ${disabled ? "" : v.hover}
        ${s} ${fullWidth ? "w-full" : ""} ${className}
      `}
      {...props}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
    </button>
  );
}
