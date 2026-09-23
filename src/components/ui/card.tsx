import React from "react";
import { CandyBox, type CandyBoxProps, type CandyBoxVariant } from "./candy-box";

export interface CardProps extends Omit<CandyBoxProps, "variant"> {
  variant?: CandyBoxVariant | "default" | "flat" | "elevated" | "soft";
}

/**
 * Card Component (Conforms to DNA Box Law)
 * Automatically renders with 3px choco-900 border, 22px radius, and 6px solid shadow.
 */
export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ variant = "default", ...props }, ref) => {
    // Map legacy variants to CandyBox variants
    let mappedVariant: CandyBoxVariant = "default";
    if (variant === "hover") mappedVariant = "hover";
    else if (variant === "pink" || variant === "soft") mappedVariant = "pink";
    else if (variant === "dark") mappedVariant = "dark";
    else if (variant === "glitch") mappedVariant = "glitch";

    return <CandyBox ref={ref} variant={mappedVariant} {...props} />;
  }
);

Card.displayName = "Card";
export default Card;
