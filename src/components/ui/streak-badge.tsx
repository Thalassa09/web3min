"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Flame } from "lucide-react";

import { cn } from "@/lib/utils";

// Types (inlined - only fields used by this component)
export interface StreakResponse {
  length: number;
  frequency: "daily" | "weekly" | "monthly";
}

// Variants with vibrant colored options
export const streakBadgeVariants = cva(
  "inline-flex flex-col items-center justify-center rounded-3xl text-center transition-all duration-150 select-none",
  {
    variants: {
      variant: {
        colored:
          "border-2 border-[#F97316]/50 bg-gradient-to-b from-[#FFF7ED] via-[#FFEDD5] to-[#FED7AA] text-choco-900 shadow-[0_4px_0_#EA580C,0_10px_24px_-4px_rgba(234,88,12,0.25)] hover:brightness-105",
        flame:
          "border-2 border-[#EA580C] bg-gradient-to-b from-[#FFEDD5] to-[#FDBA74] text-[#7C2D12] shadow-[0_5px_0_#C2410C,0_12px_28px_-4px_rgba(194,65,12,0.3)]",
        glow:
          "border-2 border-[#FF8A3D] bg-[#23140C] text-[#FFF6EE] shadow-[0_0_24px_rgba(255,138,61,0.4),0_4px_0_#3B2218]",
        candy:
          "border-2 border-choco-900 bg-white text-choco-900 shadow-[0_4px_0_#3B2218,0_10px_20px_-4px_rgba(59,34,24,0.12)]",
        default:
          "border border-border/60 bg-card text-card-foreground shadow-sm",
      },
      size: {
        sm: "w-28 gap-1.5 p-3",
        default: "w-40 gap-2.5 p-5",
        lg: "w-52 gap-3 p-6",
      },
    },
    defaultVariants: {
      variant: "colored",
      size: "default",
    },
  }
);

// Props
export interface StreakBadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof streakBadgeVariants> {
  /** Streak length value */
  length?: number;
  /** Streak frequency used for label rendering */
  frequency?: StreakResponse["frequency"];
  /** Optional subtitle shown below streak length */
  subtitle?: string;
  /** Custom icon to replace flame */
  icon?: React.ReactNode;
}

export const StreakBadge = React.forwardRef<HTMLDivElement, StreakBadgeProps>(
  (
    {
      className,
      variant = "colored",
      size = "default",
      length,
      frequency = "daily",
      subtitle,
      icon,
      ...props
    },
    ref
  ) => {
    const streakLength = length ?? 0;

    const frequencyLabel = {
      daily: "hari",
      weekly: "minggu",
      monthly: "bulan",
    }[frequency];

    const pluralLabel = frequencyLabel;

    const iconSize = {
      sm: "h-8 w-8 sm:h-10 sm:w-10",
      default: "h-14 w-14 sm:h-16 sm:w-16",
      lg: "h-16 w-16 sm:h-20 sm:w-20",
    }[size ?? "default"];

    const valueSize = {
      sm: "text-2xl sm:text-3xl",
      default: "text-4xl sm:text-5xl",
      lg: "text-5xl sm:text-6xl",
    }[size ?? "default"];

    const subtitleSize = {
      sm: "text-[11px] sm:text-xs",
      default: "text-xs sm:text-sm",
      lg: "text-sm sm:text-base",
    }[size ?? "default"];

    const subtitleText = subtitle ?? "hari beruntun";
    const valueUnit = pluralLabel;

    // Build accessible label
    const ariaLabel = `${streakLength} ${pluralLabel} streak`;

    const isColored = variant === "colored" || variant === "flame" || variant === "glow";

    return (
      <div
        ref={ref}
        role="status"
        aria-label={ariaLabel}
        className={cn(streakBadgeVariants({ variant, size }), className)}
        {...props}
      >
        {icon ?? (
          <Flame
            className={cn(
              iconSize,
              "shrink-0 transition-transform duration-200 hover:scale-110",
              isColored
                ? "text-[#FF5722] fill-[#FF8A3D] drop-shadow-[0_3px_10px_rgba(255,87,34,0.45)]"
                : "text-primary"
            )}
            aria-hidden="true"
          />
        )}
        <span
          className={cn(
            "font-display font-extrabold tracking-tight tabular-nums flex items-baseline justify-center",
            isColored ? "text-[#C2410C]" : "text-inherit",
            valueSize
          )}
          aria-hidden="true"
        >
          {streakLength}
          <span
            className={cn(
              "ml-1.5 font-sans font-semibold tracking-normal text-sm sm:text-base",
              isColored ? "text-[#EA580C]/80" : "text-muted-foreground"
            )}
          >
            {valueUnit}
          </span>
        </span>
        <span
          className={cn(
            "font-sans font-medium uppercase tracking-wider",
            isColored ? "text-[#9A3412]/80 font-bold" : "text-muted-foreground",
            subtitleSize
          )}
          aria-hidden="true"
        >
          {subtitleText}
        </span>
      </div>
    );
  }
);

StreakBadge.displayName = "StreakBadge";

export default StreakBadge;
