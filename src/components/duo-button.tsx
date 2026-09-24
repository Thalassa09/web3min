import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import { playTap } from "@/lib/audio";
import { useProgress } from "@/lib/store";

export type DuoButtonVariant = "primary" | "secondary" | "sky" | "danger" | "ghost" | "white" | "world" | "blobi" | "coin";
export type DuoButtonSize = "sm" | "md" | "lg";

const variantClass: Record<DuoButtonVariant, string> = {
  // Blok Rantai Primary Action: Pink-500 with 3D bottom shadow Pink-700 (#B01F62)
  primary: "bg-primary text-white border-primary-shadow shadow-3d-primary hover:bg-primary-hover hover:brightness-105",
  blobi: "bg-blobi text-white border-blobi-shadow shadow-3d-primary hover:brightness-105",
  world: "quiz-check bg-primary text-white border-primary-shadow shadow-3d-primary hover:bg-primary-hover",
  sky: "bg-primary text-white border-primary-shadow shadow-3d-primary hover:bg-primary-hover",
  
  // Secondary / White Surface: White paper with line border and 3D plum drop
  secondary: "bg-paper text-ink-900 border-line shadow-3d-secondary hover:bg-canvas hover:border-line-strong",
  white: "bg-paper text-ink-900 border-line shadow-3d-secondary hover:bg-canvas hover:border-line-strong",

  // Danger: Correct/Wrong feedback only
  danger: "bg-danger text-white border-danger-shadow shadow-[0_4px_0_var(--color-danger-shadow)] hover:brightness-105",

  // Coin: Exclusive for XP rewards
  coin: "bg-coin text-ink-900 border-coin-shadow shadow-[0_4px_0_var(--color-coin-shadow)] hover:brightness-105",

  // Ghost: Subtle tertiary action
  ghost: "bg-transparent text-ink-500 border-transparent shadow-none hover:bg-primary-soft hover:text-ink-900",
};

const sizeClass: Record<DuoButtonSize, string> = {
  sm: "min-h-9 rounded-sm px-3.5 py-1.5 text-xs",
  md: "min-h-11 rounded-md px-5 py-2.5 text-sm",
  lg: "min-h-13 rounded-lg px-6 py-3 text-base",
};

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: DuoButtonVariant;
  size?: DuoButtonSize;
  wide?: boolean;
};

export function DuoButton({
  variant = "primary",
  size = "md",
  wide,
  className,
  children,
  onClick,
  ...props
}: Props) {
  const sound = useProgress((s) => s.sound);

  return (
    <button
      type="button"
      className={cn(
        "inline-flex cursor-pointer select-none items-center justify-center gap-2 border-2 font-sans font-extrabold tracking-wide",
        "transition-[transform,box-shadow,filter] duration-90 ease-out",
        "active:not-disabled:translate-y-[4px] active:not-disabled:shadow-none",
        "focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-primary",
        "disabled:cursor-not-allowed disabled:border-transparent disabled:bg-line disabled:text-ink-300 disabled:shadow-none",
        variantClass[variant],
        sizeClass[size],
        wide && "w-full",
        className
      )}
      onClick={(e) => {
        if (sound && !props.disabled) playTap();
        onClick?.(e);
      }}
      {...props}
    >
      {children}
    </button>
  );
}
