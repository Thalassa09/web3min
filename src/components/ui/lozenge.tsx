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
      subtle: "bg-[#E4F0FF] text-[#0B4FD1] border-[#8FC2FF]/60",
      bold: "bg-[#0B63F6] text-white border-[#0B4FD1]",
    },
    inprogress: {
      subtle: "bg-[#E4F0FF] text-[#0B63F6] border-[#8FC2FF]",
      bold: "bg-[#0B63F6] text-white border-[#0B4FD1]",
    },
    success: {
      subtle: "bg-[#E8FBF0] text-[#1E8A49] border-[#98E4B5]",
      bold: "bg-[#34C06A] text-white border-[#1E8A49]",
    },
    new: {
      subtle: "bg-[#F3ECFF] text-[#6A3FD1] border-[#C4A8FF]",
      bold: "bg-[#8B5CF6] text-white border-[#6A3FD1]",
    },
    moved: {
      subtle: "bg-[#FFF8E1] text-[#B27B00] border-[#FFE08A]",
      bold: "bg-[#FFC61A] text-[#0D2340] border-[#D99400]",
    },
    removed: {
      subtle: "bg-[#FFECEC] text-[#B01E18] border-[#F4A4A0]",
      bold: "bg-[#E63329] text-white border-[#B01E18]",
    },
  };

  const selected = isBold ? STYLES[appearance].bold : STYLES[appearance].subtle;

  return (
    <span
      className={`
        inline-flex items-center justify-center font-mono font-extrabold uppercase
        text-[10px] tracking-wider px-2 py-0.5 rounded-full border
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
