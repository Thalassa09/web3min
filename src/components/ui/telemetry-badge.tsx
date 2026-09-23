import React from "react";

export type BadgeTone = "mint" | "cyan" | "violet" | "amber" | "rose" | "zinc" | "default" | "coin" | "flame" | "ruby" | "leaf" | "grape" | "sky";

interface TelemetryBadgeProps {
  label: string;
  value?: string | number;
  tone?: BadgeTone;
  pulsing?: boolean;
  className?: string;
}

const TONE_MAP: Record<string, { border: string; bg: string; text: string }> = {
  mint: {
    border: "border-[#98E4B5]",
    bg: "bg-[#E8FBF0]",
    text: "text-leaf-shadow",
  },
  leaf: {
    border: "border-[#98E4B5]",
    bg: "bg-[#E8FBF0]",
    text: "text-leaf-shadow",
  },
  cyan: {
    border: "border-candy-300",
    bg: "bg-candy-100",
    text: "text-candy-600",
  },
  sky: {
    border: "border-candy-300",
    bg: "bg-candy-100",
    text: "text-candy-600",
  },
  violet: {
    border: "border-[#C4A8FF]",
    bg: "bg-[#F3ECFF]",
    text: "text-[#6A3FD1]",
  },
  grape: {
    border: "border-[#C4A8FF]",
    bg: "bg-[#F3ECFF]",
    text: "text-[#6A3FD1]",
  },
  amber: {
    border: "border-[#FFE08A]",
    bg: "bg-[#FFF8E1]",
    text: "text-[#B27B00]",
  },
  coin: {
    border: "border-[#FFE08A]",
    bg: "bg-[#FFF8E1]",
    text: "text-[#B27B00]",
  },
  flame: {
    border: "border-[#FFB580]",
    bg: "bg-[#FFF0E4]",
    text: "text-flame-shadow",
  },
  rose: {
    border: "border-[#F4A4A0]",
    bg: "bg-[#FFECEC]",
    text: "text-ruby-shadow",
  },
  ruby: {
    border: "border-[#F4A4A0]",
    bg: "bg-[#FFECEC]",
    text: "text-ruby-shadow",
  },
  zinc: {
    border: "border-choco-900/30",
    bg: "bg-cream",
    text: "text-choco-900",
  },
  default: {
    border: "border-choco-900/30",
    bg: "bg-cream",
    text: "text-choco-900",
  },
};

/**
 * Sunny World Chip / Pill Badge
 * 26px height, Label 11px uppercase font, soft semantic tint background with high contrast text.
 */
export function TelemetryBadge({
  label,
  value,
  tone = "zinc",
  pulsing = false,
  className = "",
}: TelemetryBadgeProps) {
  const t = TONE_MAP[tone] || TONE_MAP.default;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full border text-[11px] font-sans font-extrabold tracking-wider select-none ${t.border} ${t.bg} ${t.text} ${className}`}
    >
      {pulsing && (
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-current opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-current" />
        </span>
      )}
      <span>{label}</span>
      {value !== undefined && (
        <>
          <span className="opacity-40">·</span>
          <span className="font-extrabold">{value}</span>
        </>
      )}
    </span>
  );
}

export const PillBadge = TelemetryBadge;
