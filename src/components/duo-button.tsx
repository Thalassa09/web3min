import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import { playTap } from "@/lib/audio";
import { useProgress } from "@/lib/store";

type Variant = "primary" | "sky" | "danger" | "ghost" | "white" | "world" | "blobi";
type Size = "sm" | "md";

const variantClass: Record<Variant, string> = {
  primary: "bg-coin text-ink-900 border-ink-900 shadow-ink",
  world: "quiz-check bg-coin text-ink-900 border-ink-900 shadow-ink",
  blobi: "bg-blobi text-white border-ink-900 shadow-ink",
  sky: "bg-sky-500 text-white border-ink-900 shadow-ink",
  danger: "bg-ruby text-white border-ink-900 shadow-ink",
  white: "bg-white text-ink-900 border-ink-900 shadow-ink-sm hover:bg-canvas",
  ghost: "bg-transparent text-ink-500 border-transparent shadow-none hover:bg-ink-900/5 hover:text-ink-900",
};

const sizeClass: Record<Size, string> = {
  sm: "min-h-10 rounded-md px-4 py-2 text-xs",
  md: "min-h-12 rounded-md px-5 py-2.5 text-sm",
};

type Props = ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; size?: Size; wide?: boolean };

export function DuoButton({ variant = "primary", size = "md", wide, className, children, onClick, ...props }: Props) {
  const sound = useProgress((s) => s.sound);
  return (
    <button
      type="button"
      className={cn(
        "inline-flex cursor-pointer select-none items-center justify-center gap-2 border-2 font-sans font-extrabold tracking-wide",
        "transition-[transform,box-shadow,filter] duration-100 ease-out hover:brightness-105",
        "active:not-disabled:translate-y-[3px] active:not-disabled:shadow-ink-xs",
        "disabled:cursor-not-allowed disabled:border-line-strong disabled:bg-line disabled:text-ink-300 disabled:shadow-none",
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
