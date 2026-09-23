import React from "react";
import { cn } from "@/lib/utils";

export type CandyBoxVariant = "default" | "hover" | "pink" | "dark" | "glitch";

export interface CandyBoxProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: CandyBoxVariant;
  padding?: "none" | "sm" | "md" | "lg";
}

/**
 * DNA Box (MANDATORY for ALL boxes in web3min Arcade Candy)
 * - Cream background (#FFF6EE)
 * - 3px solid Choco-900 (#3B2218) border
 * - 22px rounded radius
 * - 6px solid Choco-900 drop shadow
 */
export const CandyBox = React.forwardRef<HTMLDivElement, CandyBoxProps>(
  ({ children, variant = "default", padding = "md", className, ...rest }, ref) => {
    const paddingClasses = {
      none: "p-0",
      sm: "p-3 sm:p-4",
      md: "p-4 sm:p-6",
      lg: "p-6 sm:p-8",
    }[padding];

    const variantClasses = {
      default: "candy-box",
      hover: "candy-box candy-box--hover cursor-pointer",
      pink: "candy-box candy-box--pink",
      dark: "candy-box candy-box--dark",
      glitch: "candy-box candy-box--glitch",
    }[variant];

    return (
      <div
        ref={ref}
        className={cn(variantClasses, paddingClasses, className)}
        {...rest}
      >
        {children}
      </div>
    );
  }
);

CandyBox.displayName = "CandyBox";
export default CandyBox;
