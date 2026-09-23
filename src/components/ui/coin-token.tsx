import React from "react";
import { cn } from "@/lib/utils";

export interface CoinTokenProps extends React.HTMLAttributes<HTMLDivElement> {
  amount: number | string;
  size?: "sm" | "md" | "lg";
}

/**
 * CoinToken Component
 * ★ Lemon token with bold pixel numbers, 3px choco border, and solid 3D shadow.
 */
export const CoinToken: React.FC<CoinTokenProps> = ({
  amount,
  size = "md",
  className,
  ...rest
}) => {
  const sizeClasses = {
    sm: "px-2 py-0.5 text-xs gap-1 border-2 shadow-[0_2px_0_#3B2218]",
    md: "px-3 py-1 text-sm sm:text-base gap-1.5 border-[3px] shadow-[0_3px_0_#3B2218]",
    lg: "px-4 py-1.5 text-lg gap-2 border-[3px] shadow-[0_4px_0_#3B2218]",
  }[size];

  return (
    <div
      className={cn(
        "inline-flex items-center bg-lemon text-choco-900 border-choco-900 rounded-full font-pixel font-bold select-none",
        sizeClasses,
        className
      )}
      {...rest}
    >
      <span className="text-lemon-deep drop-shadow-[0_1px_0_rgba(0,0,0,0.2)]">★</span>
      <span className="tabular-nums tracking-wide">{amount}</span>
    </div>
  );
};

export default CoinToken;
