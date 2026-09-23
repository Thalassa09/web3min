import React from "react";
import { cn } from "@/lib/utils";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "flat" | "elevated" | "soft";
  padding?: "none" | "sm" | "md" | "lg";
}

/**
 * Blok Rantai Card Component
 * Calm Apple surface with clean ink-line borders & subtle 3D grounding
 */
export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ children, variant = "default", padding = "md", className, ...rest }, ref) => {
    const paddingClasses = {
      none: "p-0",
      sm: "p-3 sm:p-4",
      md: "p-4 sm:p-6",
      lg: "p-6 sm:p-8",
    }[padding];

    const variantClasses = {
      default: "bg-paper border-2 border-line rounded-xl shadow-3d-card text-ink-900",
      flat: "bg-paper border-2 border-line rounded-xl text-ink-900",
      elevated: "bg-paper border-2 border-ink-900 rounded-xl shadow-ink text-ink-900",
      soft: "bg-primary-soft border-2 border-candy-line/60 rounded-xl text-ink-900",
    }[variant];

    return (
      <div
        ref={ref}
        className={cn(
          "transition-all duration-150",
          variantClasses,
          paddingClasses,
          className
        )}
        {...rest}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = "Card";
