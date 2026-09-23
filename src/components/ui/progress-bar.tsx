import React from "react";
import { cn } from "@/lib/utils";

export interface ProgressBarProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number; // 0..max
  max?: number;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
}

/**
 * Blok Rantai Progress Bar
 * Single action color: Pink-500 (#E8437F) over soft pink canvas track
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
    sm: "h-2.5",
    md: "h-3.5",
    lg: "h-5",
  }[size];

  return (
    <div className={cn("w-full flex items-center gap-3", className)} {...rest}>
      <div
        className={cn(
          "relative flex-1 bg-primary-soft border-2 border-line-strong rounded-pill overflow-hidden",
          heightClasses
        )}
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
      >
        <div
          className="h-full bg-primary rounded-pill transition-all duration-300 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showLabel && (
        <span className="font-mono text-xs font-bold text-ink-700 tabular-nums shrink-0">
          {percentage}%
        </span>
      )}
    </div>
  );
};
