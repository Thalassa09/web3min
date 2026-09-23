import React from "react";
import { cn } from "@/lib/utils";

export interface ProgressBarProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number; // 0..max (determinate). If omitted or indeterminate=true, acts as loading bar.
  max?: number;
  indeterminate?: boolean;
  size?: "xs" | "sm" | "md" | "lg";
  showLabel?: boolean;
}

/**
 * Arcade Candy "Candy-Stripe" Progress & Loading Bar
 * 100% faithful to the candy-cane design:
 * - Semicircular capsule/pill shape (rounded-full)
 * - 3px-3.5px solid dark chocolate/maroon outline (#3B1317)
 * - Alternating diagonal 45deg stripes: Pastel Pink (#F8A1BE) + Vivid Magenta (#DC326A)
 * - Seamless infinite animated scrolling
 * - Supports both determinate progress (0..100%) and indeterminate loading (full bar)
 */
export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  indeterminate = false,
  size = "md",
  showLabel = false,
  className,
  ...rest
}) => {
  const isIndeterminate = indeterminate || typeof value !== "number";
  const percentage = isIndeterminate
    ? 100
    : Math.min(100, Math.max(0, Math.round(((value ?? 0) / max) * 100)));

  const heightClasses = {
    xs: "h-2 border-2",
    sm: "h-3.5 border-[2.5px]",
    md: "h-5 border-[3px]",
    lg: "h-7 border-[3.5px]",
  }[size];

  return (
    <div className={cn("w-full flex items-center gap-3", className)} {...rest}>
      <div
        className={cn(
          "relative flex-1 bg-[#FFF0F5] border-[#3B1317] rounded-full overflow-hidden shadow-xs",
          heightClasses
        )}
        role="progressbar"
        aria-valuenow={isIndeterminate ? undefined : value}
        aria-valuemin={isIndeterminate ? undefined : 0}
        aria-valuemax={isIndeterminate ? undefined : max}
      >
        <div
          className={cn(
            "h-full candy-stripe-fill rounded-full transition-all duration-300 ease-out",
            !isIndeterminate && percentage < 100 && "border-r-2 border-[#3B1317]"
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showLabel && !isIndeterminate && (
        <span className="font-pixel text-xs sm:text-sm font-bold text-[#3B1317] tabular-nums shrink-0">
          {percentage}%
        </span>
      )}
    </div>
  );
};

/**
 * Standalone Candy Loading Bar
 * For any loading state (page transition, sync, button loader, etc.)
 */
export function CandyLoader({
  size = "md",
  label,
  className,
}: {
  size?: "xs" | "sm" | "md" | "lg";
  label?: string;
  className?: string;
}) {
  return (
    <div className={cn("w-full flex flex-col items-center gap-2", className)}>
      <ProgressBar indeterminate size={size} />
      {label && (
        <span className="font-pixel text-xs font-bold text-[#3B1317] uppercase tracking-wider animate-pulse">
          {label}
        </span>
      )}
    </div>
  );
}

export default ProgressBar;
