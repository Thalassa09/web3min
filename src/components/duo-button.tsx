import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import { playTap } from "@/lib/audio";
import { useProgress } from "@/lib/store";

type Variant = "primary" | "sky" | "danger" | "ghost" | "white" | "world";
type Size = "sm" | "md";

const variantClass: Record<Variant, string> = {
  primary: "bg-primary text-primary-ink border-primary-shadow",
  sky: "bg-sky text-primary-ink border-sky-shadow",
  danger: "bg-danger text-primary-ink border-danger-shadow",
  ghost: "bg-transparent text-muted border-line",
  white: "bg-paper text-fg border-line",
  world: "quiz-check",
};

const sizeClass: Record<Size, string> = {
  sm: "min-h-11 rounded-xl px-3 py-2 text-sm",
  md: "min-h-12 rounded-2xl px-4 py-3 text-base",
};

const RAISED = new Set<Variant>(["primary", "sky", "danger", "world"]);

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
  wide?: boolean;
};

export function DuoButton({ variant = "primary", size = "md", wide, className, children, onClick, ...props }: Props) {
  const sound = useProgress((s) => s.sound);
  const raised = RAISED.has(variant);
  return (
    <button
      type="button"
      className={cn(
        "inline-flex items-center justify-center font-bold",
        "transition-[transform,border-width,filter,opacity] duration-[140ms] ease-[cubic-bezier(0.2,0,0,1)]",
        "disabled:cursor-not-allowed disabled:opacity-65",
        raised
          ? "border-b-4 active:not-disabled:translate-y-[3px] active:not-disabled:border-b-0"
          : "border active:not-disabled:scale-[0.98]",
        variantClass[variant],
        sizeClass[size],
        wide && "w-full",
        className,
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
