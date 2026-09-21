import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import { playTap } from "@/lib/audio";
import { useProgress } from "@/lib/store";

type Variant = "primary" | "sky" | "danger" | "ghost" | "white" | "world";
type Size = "sm" | "md";

const variantClass: Record<Variant, string> = {
  primary: "bg-[#FFC61A] text-[#0D2340] border-2 border-[#E5A800] shadow-[0_5px_0_#D99400] hover:bg-[#FFD147]",
  sky: "bg-[#1F7BFF] text-white border-2 border-[#0B4FD1] shadow-[0_5px_0_#0B4FD1] hover:bg-[#3B8CFF]",
  danger: "bg-[#E63329] text-white border-2 border-[#B01E18] shadow-[0_5px_0_#B01E18] hover:bg-[#F2443A]",
  ghost: "bg-transparent text-[#4A6580] border-2 border-transparent shadow-none hover:bg-white/20 hover:text-[#0D2340]",
  white: "bg-[#FFFFFF] text-[#0D2340] border-2 border-[#B9CFE9] shadow-[0_4px_0_#C8DBF0] hover:bg-[#F0F6FF]",
  world: "quiz-check bg-[#FFC61A] text-[#0D2340] border-2 border-[#E5A800] shadow-[0_5px_0_#D99400] hover:bg-[#FFD147]",
};

const sizeClass: Record<Size, string> = {
  sm: "min-h-10 rounded-[14px] px-4 py-2 font-sans text-xs font-extrabold tracking-wide",
  md: "min-h-12 rounded-[16px] px-5 py-2.5 font-sans text-sm font-extrabold tracking-wide",
};

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
  wide?: boolean;
};

export function DuoButton({ variant = "primary", size = "md", wide, className, children, onClick, ...props }: Props) {
  const sound = useProgress((s) => s.sound);
  return (
    <button
      type="button"
      className={cn(
        "inline-flex items-center justify-center font-sans font-extrabold select-none cursor-pointer",
        "transition-[transform,box-shadow,background-color,border-color,color] duration-100 ease-out",
        "active:not-disabled:translate-y-[3px] active:not-disabled:shadow-none",
        "disabled:cursor-not-allowed disabled:bg-[#E2E8F0] disabled:text-[#8095AB] disabled:border-[#CBD5E1] disabled:shadow-none disabled:active:translate-y-0",
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
