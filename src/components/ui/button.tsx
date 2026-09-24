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
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
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
      leftIcon,
      rightIcon,
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
        "bg-gradient-to-b from-[#FF6699] via-[#E8437F] to-[#D82668] text-white border-2 border-candy-600/60",
        "shadow-[0_4px_0_#B01F62,0_8px_16px_-2px_rgba(232,67,127,0.25),inset_0_1px_0_rgba(255,255,255,0.55)]",
        "hover:brightness-105 active:translate-y-1 active:shadow-none",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-candy-400"
      ),
      secondary: cn(
        "btn-gummy btn-gummy--secondary",
        "bg-gradient-to-b from-white via-[#FFF9F5] to-[#FDEEE4] text-choco-900 border-2 border-choco-900/20",
        "shadow-[0_4px_0_#3B2218,0_8px_16px_-2px_rgba(59,34,24,0.12),inset_0_1px_0_rgba(255,255,255,0.9)]",
        "hover:brightness-105 active:translate-y-1 active:shadow-none",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-choco-600"
      ),
      danger: cn(
        "btn-gummy btn-gummy--danger",
        "bg-gradient-to-b from-[#EF4444] via-[#DC2626] to-[#B91C1C] text-white border-2 border-red-700/60",
        "shadow-[0_4px_0_#991B1B,0_8px_16px_-2px_rgba(220,38,38,0.25),inset_0_1px_0_rgba(255,255,255,0.45)]",
        "hover:brightness-105 active:translate-y-1 active:shadow-none",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-danger"
      ),
      coin: cn(
        "btn-gummy",
        "bg-gradient-to-b from-[#FFE873] via-[#FFD84D] to-[#E6BF35] text-choco-900 border-2 border-amber-600/50",
        "shadow-[0_4px_0_#C8940C,0_8px_16px_-2px_rgba(255,216,77,0.25),inset_0_1px_0_rgba(255,255,255,0.7)]",
        "hover:brightness-105 active:translate-y-1 active:shadow-none",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lemon"
      ),
      ghost: cn(
        "relative inline-flex items-center justify-center font-bold text-choco-600",
        "hover:bg-candy-100 hover:text-choco-900 rounded-[14px] p-2",
        "active:translate-y-0.5",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-candy-300"
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
        {(leftIcon || icon) && (
          <span className="inline-flex shrink-0 items-center justify-center">
            {leftIcon || icon}
          </span>
        )}
        <span className="truncate">{children}</span>
        {(rightIcon || iconAfter) && (
          <span className="inline-flex shrink-0 items-center justify-center">
            {rightIcon || iconAfter}
          </span>
        )}
      </button>
    );
  }
);

Button.displayName = "Button";
export default Button;
