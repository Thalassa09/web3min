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
 * Blok Rantai 3D Button (Duolingo Tactile Feedback + Apple Clean Optics)
 * - Primary: Pink-500 (#E8437F), 3D bottom shadow Pink-700 (#B01F62)
 * - Secondary: White paper (#FFFFFF), line border (#F3E3EA), 3D shadow Plum (#E5CFD9)
 * - Active: Sinks 4px downward, shadow flattens
 * - WCAG AA compliant contrast
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
      sm: "h-9 px-3.5 text-xs rounded-sm gap-1.5",
      md: "h-11 px-5 text-sm rounded-md gap-2",
      lg: "h-13 px-6 text-base rounded-lg gap-2.5",
    }[size];

    const variantClasses = {
      primary: cn(
        "bg-primary text-white border-2 border-primary-shadow",
        "shadow-3d-primary",
        "hover:bg-primary-hover hover:brightness-105",
        "active:translate-y-[4px] active:shadow-none",
        "focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-primary",
        "disabled:bg-line disabled:text-ink-300 disabled:border-transparent disabled:shadow-none disabled:cursor-not-allowed"
      ),
      secondary: cn(
        "bg-paper text-ink-900 border-2 border-line",
        "shadow-3d-secondary",
        "hover:bg-canvas hover:border-line-strong",
        "active:translate-y-[4px] active:shadow-none",
        "focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-primary",
        "disabled:bg-line disabled:text-ink-300 disabled:border-transparent disabled:shadow-none disabled:cursor-not-allowed"
      ),
      danger: cn(
        "bg-danger text-white border-2 border-danger-shadow",
        "shadow-[0_4px_0_var(--color-danger-shadow)]",
        "hover:brightness-105",
        "active:translate-y-[4px] active:shadow-none",
        "focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-danger",
        "disabled:bg-line disabled:text-ink-300 disabled:border-transparent disabled:shadow-none"
      ),
      coin: cn(
        "bg-coin text-ink-900 border-2 border-coin-shadow",
        "shadow-[0_4px_0_var(--color-coin-shadow)]",
        "hover:brightness-105",
        "active:translate-y-[4px] active:shadow-none",
        "focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-coin",
        "disabled:bg-line disabled:text-ink-300 disabled:border-transparent disabled:shadow-none"
      ),
      ghost: cn(
        "bg-transparent text-ink-700 border-2 border-transparent",
        "hover:bg-primary-soft hover:text-ink-900",
        "active:translate-y-[2px]",
        "focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-primary",
        "disabled:text-ink-300 disabled:cursor-not-allowed"
      ),
    }[variant];

    return (
      <button
        ref={ref}
        type="button"
        disabled={disabled}
        onClick={handleClick}
        className={cn(
          "inline-flex items-center justify-center font-sans font-extrabold tracking-wide select-none cursor-pointer",
          "transition-[transform,box-shadow,background-color] duration-90",
          sizeClasses,
          variantClasses,
          wide && "w-full",
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
