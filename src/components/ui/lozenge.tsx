import React from "react";

export type LozengeAppearance =
  | "default"
  | "success"
  | "inprogress"
  | "new"
  | "moved"
  | "removed";

export interface LozengeProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
  appearance?: LozengeAppearance;
  isBold?: boolean;
  maxWidth?: number | string;
  className?: string;
}

/**
 * Atlaskit Lozenge — Atlassian Design System Spec
 * Visual indicator used to highlight an item's status for quick recognition.
 */
export function Lozenge({
  children,
  appearance = "default",
  isBold = false,
  maxWidth,
  className = "",
  style,
  ...props
}: LozengeProps) {
  // Appearance Matrix: subtle (default) vs isBold
  const STYLES: Record<LozengeAppearance, { subtle: string; bold: string }> = {
    default: {
      subtle: "bg-candy-100 text-candy-700 border-candy-300",
      bold: "bg-candy-800 text-white border-candy-700",
    },
    inprogress: {
      subtle: "bg-candy-100 text-candy-700 border-candy-300",
      bold: "bg-candy-800 text-white border-candy-700",
    },
    success: {
      subtle: "bg-[#E8FBF0] text-leaf-shadow border-[#98E4B5]",
      bold: "bg-leaf text-white border-leaf-shadow",
    },
    new: {
      subtle: "bg-[#F3ECFF] text-[#6A3FD1] border-[#C4A8FF]",
      bold: "bg-[#8B5CF6] text-white border-[#6A3FD1]",
    },
    moved: {
      subtle: "bg-[#FFF8E1] text-[#B27B00] border-[#FFE08A]",
      bold: "bg-coin text-ink-900 border-coin-shadow",
    },
    removed: {
      subtle: "bg-[#FFECEC] text-ruby-shadow border-[#F4A4A0]",
      bold: "bg-ruby text-white border-ruby-shadow",
    },
  };

  const selected = isBold ? STYLES[appearance].bold : STYLES[appearance].subtle;

  return (
    <span
      className={`
        inline-flex items-center justify-center font-mono font-extrabold uppercase
        text-[10px] tracking-wider px-2 py-0.5 rounded-full border whitespace-nowrap shrink-0
        transition-[background-color,border-color,color] duration-150 select-none
        ${selected}
        ${maxWidth ? "truncate" : ""}
        ${className}
      `}
      style={{
        maxWidth: typeof maxWidth === "number" ? `${maxWidth}px` : maxWidth,
        ...style,
      }}
      {...props}
    >
      {children}
    </span>
  );
}
