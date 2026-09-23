import React from "react";
import { cn } from "@/lib/utils";

export interface ProgressBarProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number; // 0..max
  max?: number;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
}

/**
 * Arcade Candy "Candy-Stripe" Progress Bar
 * - 3px solid choco-900 border
 * - Candy-cane animated striped candy fill
 * - Bold pixel font percentage label
 */
export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  size = "md",
  showLabel = false,
  className,
  ...rest
}) => {
  const percentage = Math.min(100, Math.max(0, Math.round((value / max) * 100)));

  const heightClasses = {
    sm: "h-3.5",
    md: "h-5",
    lg: "h-7",
  }[size];

  return (
    <div className={cn("w-full flex items-center gap-3", className)} {...rest}>
      <div
        className={cn(
          "relative flex-1 bg-candy-100 border-[3px] border-choco-900 rounded-full overflow-hidden shadow-[inset_0_2px_4px_rgba(0,0,0,0.15)]",
          heightClasses
        )}
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
      >
        <div
          className="h-full candy-stripe rounded-full transition-all duration-300 ease-out border-r-2 border-choco-900"
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showLabel && (
        <span className="font-pixel text-sm font-bold text-choco-900 tabular-nums shrink-0">
          {percentage}%
        </span>
      )}
    </div>
  );
};

export default ProgressBar;
