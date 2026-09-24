import React from "react";
import { cn } from "@/lib/utils";

export type CandyBoxVariant =
  | "default"
  | "hover"
  | "pink"
  | "candy"
  | "dark"
  | "glitch"
  | "grape"
  | "orange"
  | "flame"
  | "streak"
  | "lemon"
  | "gold"
  | "mint"
  | "success";

export interface CandyBoxProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: CandyBoxVariant;
  padding?: "none" | "sm" | "md" | "lg";
}

/**
 * Tactile Beveled Arcade Card (MANDATORY for ALL cards & tiles in web3min)
 * - Pearlescent vertical gradient background
 * - 2px solid chromatic border
 * - 24px squircle rounded radius
 * - Solid 4.5px colored extrusion shelf + ambient shadow
 * - Specular 1px inset highlight
 */
export const CandyBox = React.forwardRef<HTMLDivElement, CandyBoxProps>(
  ({ children, variant = "default", padding = "md", className, ...rest }, ref) => {
    const paddingClasses = {
      none: "p-0",
      sm: "p-3 sm:p-4",
      md: "p-4 sm:p-6",
      lg: "p-6 sm:p-8",
    }[padding];

    const variantClasses: Record<CandyBoxVariant, string> = {
      default: "candy-box",
      hover: "candy-box candy-box--hover cursor-pointer",
      pink: "candy-box candy-box--pink",
      candy: "candy-box candy-box--candy",
      dark: "candy-box candy-box--dark",
      glitch: "candy-box candy-box--glitch",
      grape: "candy-box candy-box--grape",
      orange: "candy-box candy-box--orange",
      flame: "candy-box candy-box--flame",
      streak: "candy-box candy-box--streak",
      lemon: "candy-box candy-box--lemon",
      gold: "candy-box candy-box--gold",
      mint: "candy-box candy-box--mint",
      success: "candy-box candy-box--success",
    };

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
