import React from "react";

type ButtonVariant = "primary" | "secondary" | "danger" | "ghost" | "amber" | "cyan";
type ButtonSize = "sm" | "md" | "lg";

interface TactileButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: React.ReactNode;
  icon?: React.ReactNode;
  fullWidth?: boolean;
}

const VARIANT_STYLES: Record<ButtonVariant, { bg: string; text: string; shadow: string; border: string; hover: string }> = {
  primary: {
    bg: "bg-[#00f59b]",
    text: "text-[#06080b]",
    shadow: "shadow-[0_4px_0_#00b875]",
    border: "border-t border-[#80ffcd]",
    hover: "hover:bg-[#1affaa]",
  },
  secondary: {
    bg: "bg-[#141726]",
    text: "text-zinc-100",
    shadow: "shadow-[0_4px_0_#0a0c16]",
    border: "border border-[#282d47]",
    hover: "hover:bg-[#1a1e32] hover:border-[#383f63]",
  },
  amber: {
    bg: "bg-[#f59e0b]",
    text: "text-[#06080b]",
    shadow: "shadow-[0_4px_0_#b45309]",
    border: "border-t border-[#fde68a]",
    hover: "hover:bg-[#fbbf24]",
  },
  cyan: {
    bg: "bg-[#00e5ff]",
    text: "text-[#06080b]",
    shadow: "shadow-[0_4px_0_#0097a7]",
    border: "border-t border-[#a7f3d0]",
    hover: "hover:bg-[#33ebff]",
  },
  danger: {
    bg: "bg-[#ff4365]",
    text: "text-white",
    shadow: "shadow-[0_4px_0_#be123c]",
    border: "border-t border-[#ffa3b4]",
    hover: "hover:bg-[#ff5c7b]",
  },
  ghost: {
    bg: "bg-transparent",
    text: "text-zinc-400",
    shadow: "shadow-none",
    border: "border border-zinc-800/80",
    hover: "hover:bg-zinc-900/60 hover:text-zinc-100 hover:border-zinc-700",
  },
};

const SIZE_STYLES: Record<ButtonSize, string> = {
  sm: "h-9 px-3 text-xs tracking-wider gap-1.5 rounded-[12px]",
  md: "h-11 px-4 text-xs tracking-wider gap-2 rounded-[14px]",
  lg: "h-13 px-6 text-sm tracking-widest gap-2.5 rounded-[16px]",
};

/**
 * Blueprint 5.1 & 5.2 from UI UX Component Library: Tactile Physical Compression Button
 * Mechanical switch feel, 0ms active translation, extruded 3D bevel, zero layout reflow.
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
        relative inline-flex items-center justify-center font-mono font-bold uppercase select-none
        transition-all duration-100 ease-out
        active:translate-y-[3px] active:shadow-[0_1px_0_transparent]
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00f59b]
        disabled:opacity-40 disabled:cursor-not-allowed disabled:active:translate-y-0 disabled:active:shadow-none
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
