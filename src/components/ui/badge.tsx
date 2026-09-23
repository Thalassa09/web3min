import React from "react";
import { cn } from "@/lib/utils";

export type BadgeVariant = "brand" | "hash" | "coin" | "streak" | "ok" | "danger" | "neutral";
export type BadgeSize = "sm" | "md";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: BadgeSize;
}

/**
 * Blok Rantai Semantic Badge
 * - hash: JetBrains Mono (#0x01)
 * - brand: Pink candy pill
 * - coin: ONLY for ★ and XP
 * - streak: ONLY for streak
 * - ok/danger: ONLY for feedback
 */
export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = "brand",
  size = "md",
  className,
  ...rest
}) => {
  const sizeClasses = {
    sm: "px-2 py-0.5 text-[11px] rounded-sm",
    md: "px-2.5 py-1 text-xs rounded-md",
  }[size];

  const variantClasses = {
    brand: "bg-primary-soft text-primary-hover border border-candy-line font-extrabold",
    hash: "bg-paper text-ink-900 border-2 border-line-strong font-mono font-bold tracking-tight shadow-xs",
    coin: "bg-amber-50 text-amber-900 border border-amber-200 font-extrabold font-mono",
    streak: "bg-orange-50 text-orange-900 border border-orange-200 font-extrabold font-mono",
    ok: "bg-emerald-50 text-emerald-800 border border-emerald-200 font-extrabold",
    danger: "bg-rose-50 text-rose-800 border border-rose-200 font-extrabold",
    neutral: "bg-paper text-ink-700 border border-line font-bold",
  }[variant];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 select-none whitespace-nowrap",
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
