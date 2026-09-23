import React from "react";
import { cn } from "@/lib/utils";
import { playTap } from "@/lib/audio";
import { useProgress } from "@/lib/store";

export type BlokButtonVariant = "primary" | "secondary" | "danger" | "ghost" | "coin";
export type BlokButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: BlokButtonVariant;
  size?: BlokButtonSize;
  wide?: boolean;
  icon?: React.ReactNode;
  iconAfter?: React.ReactNode;
}

/**
 * Arcade Candy "Gummy Button" (Duolingo 3D + Sweet Gloss Reflection)
 * - 3px solid choco-900 border
 * - Inset 3D shadow + bottom drop shadow 0 4px 0 #3B2218
 * - Glossy white reflection strip on top
 * - Active: sinks 4px downward, shadow flattens to 0
 * - Font: Pixelify Sans (font-pixel)
 */
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = "primary",
      size = "md",
      wide = false,
      icon,
      iconAfter,
      className,
      disabled,
      onClick,
      ...rest
    },
    ref
  ) => {
    const soundEnabled = useProgress((s) => s.sound);

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (disabled) return;
      if (soundEnabled) {
        try {
          playTap();
        } catch {
          // ignore audio failure
        }
      }
      onClick?.(e);
    };

    const sizeClasses = {
      sm: "h-9 px-3 text-xs rounded-[10px] gap-1.5",
      md: "h-11 px-5 text-sm sm:text-base rounded-[14px] gap-2",
      lg: "h-13 px-6 text-base sm:text-lg rounded-[16px] gap-2.5",
    }[size];

    const variantClasses = {
      primary: cn(
        "btn-gummy",
        "bg-candy-500 text-white border-[3px] border-choco-900",
        "shadow-[0_4px_0_var(--color-choco-900),inset_0_-4px_0_var(--color-candy-700)]",
        "hover:brightness-105 active:translate-y-1 active:shadow-none",
        "focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-candy-300"
      ),
      secondary: cn(
        "btn-gummy btn-gummy--secondary",
        "bg-cream text-candy-600 border-[3px] border-choco-900",
        "shadow-[0_4px_0_var(--color-choco-900),inset_0_-4px_0_var(--color-candy-100)]",
        "hover:brightness-105 active:translate-y-1 active:shadow-none",
        "focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-candy-300"
      ),
      danger: cn(
        "btn-gummy btn-gummy--danger",
        "bg-danger text-white border-[3px] border-choco-900",
        "shadow-[0_4px_0_var(--color-choco-900),inset_0_-4px_0_#991B1B]",
        "hover:brightness-105 active:translate-y-1 active:shadow-none",
        "focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-danger"
      ),
      coin: cn(
        "btn-gummy",
        "bg-lemon text-choco-900 border-[3px] border-choco-900",
        "shadow-[0_4px_0_var(--color-choco-900),inset_0_-4px_0_var(--color-lemon-deep)]",
        "hover:brightness-105 active:translate-y-1 active:shadow-none",
        "focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-lemon"
      ),
      ghost: cn(
        "relative inline-flex items-center justify-center font-pixel font-bold text-choco-600",
        "hover:bg-candy-100 hover:text-choco-900 rounded-[12px] p-2",
        "active:translate-y-0.5",
        "focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-candy-300"
      ),
    }[variant];

    return (
      <button
        ref={ref}
        type="button"
        disabled={disabled}
        onClick={handleClick}
        className={cn(
          "font-pixel font-bold tracking-wide select-none cursor-pointer transition-all duration-75",
          wide && "w-full",
          sizeClasses,
          variantClasses,
          disabled && "opacity-75 cursor-not-allowed",
          className
        )}
        {...rest}
      >
        {icon && <span className="inline-flex shrink-0 items-center justify-center">{icon}</span>}
        <span className="truncate">{children}</span>
        {iconAfter && <span className="inline-flex shrink-0 items-center justify-center">{iconAfter}</span>}
      </button>
    );
  }
);

Button.displayName = "Button";
export default Button;
