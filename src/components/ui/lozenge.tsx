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
      subtle: "bg-leaf-soft text-leaf-shadow border-leaf-line",
      bold: "bg-leaf-shadow text-white border-leaf-shadow",
    },
    new: {
      subtle: "bg-violet-soft text-grape-bold-shadow border-grape-soft",
      bold: "bg-grape-bold text-white border-grape-bold-shadow",
    },
    moved: {
      subtle: "bg-warn-soft text-warn-ink-soft border-coin-fill-top",
      bold: "bg-coin text-ink-900 border-coin-shadow",
    },
    removed: {
      subtle: "bg-ruby-soft-bg text-ruby-shadow border-ruby-line",
      bold: "bg-ruby-shadow text-white border-ruby-shadow",
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
