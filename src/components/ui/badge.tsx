import React from "react";
import { cn } from "@/lib/utils";
import { Sparkles } from "lucide-react";

export type BadgeVariant = "brand" | "hash" | "coin" | "streak" | "mint" | "grape" | "danger" | "level";
export type BadgeSize = "sm" | "md" | "lg";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: BadgeSize;
}

/**
 * Arcade Candy Badge & Lollipop Tokens
 * - Level / Lollipop: Lemon (#FFD84D) with 3px choco border + pixel text
 * - Hash: Pixel font with choco border
 * - Mint: Repaired / Correct
 * - Streak: Flame orange
 */
export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = "brand",
  size = "md",
  className,
  ...rest
}) => {
  const sizeClasses = {
    sm: "px-2 py-0.5 text-xs rounded-[8px]",
    md: "px-3 py-1 text-sm rounded-[10px]",
    lg: "px-4 py-1.5 text-base rounded-[12px]",
  }[size];

  const variantClasses = {
    level: "bg-lemon text-choco-900 border-2 border-choco-900 font-pixel font-bold shadow-[0_2px_0_#3B2218]",
    brand: "bg-candy-400 text-white border-2 border-choco-900 font-pixel font-bold shadow-[0_2px_0_#3B2218]",
    hash: "bg-cream text-choco-900 border-2 border-choco-900 font-pixel font-bold shadow-[0_2px_0_#3B2218]",
    coin: "bg-lemon text-choco-900 border-2 border-choco-900 font-pixel font-bold shadow-[0_2px_0_#3B2218]",
    streak: "bg-streak text-white border-2 border-choco-900 font-pixel font-bold shadow-[0_2px_0_#3B2218]",
    mint: "bg-mint text-choco-900 border-2 border-choco-900 font-pixel font-bold shadow-[0_2px_0_#3B2218]",
    grape: "bg-grape text-white border-2 border-choco-900 font-pixel font-bold shadow-[0_2px_0_#3B2218]",
    danger: "bg-danger text-white border-2 border-choco-900 font-pixel font-bold shadow-[0_2px_0_#3B2218]",
  }[variant];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 select-none whitespace-nowrap",
        sizeClasses,
        variantClasses,
        className
      )}
      {...rest}
    >
      {children}
    </span>
  );
};

/**
 * Lollipop Level Token (Arcade Level Indicator)
 */
export const Lollipop: React.FC<{ level: number | string; className?: string }> = ({
  level,
  className,
}) => {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 px-3 py-1 bg-lemon border-[3px] border-choco-900 rounded-full shadow-[0_3px_0_#3B2218] font-pixel text-sm font-bold text-choco-900 select-none",
        className
      )}
    >
      <Sparkles className="size-4 text-candy-600 shrink-0" />
      <span>LV {level}</span>
    </div>
  );
};

export default Badge;
