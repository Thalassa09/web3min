import React from "react";

export type BadgeTone = "mint" | "cyan" | "violet" | "amber" | "rose" | "zinc" | "default";

interface TelemetryBadgeProps {
  label: string;
  value?: string | number;
  tone?: BadgeTone;
  pulsing?: boolean;
  className?: string;
}

const TONE_MAP: Record<BadgeTone, { border: string; bg: string; text: string }> = {
  mint: {
    border: "border-[#00f59b]/25",
    bg: "bg-[#00f59b]/10",
    text: "text-[#00f59b]",
  },
  cyan: {
    border: "border-[#00e5ff]/25",
    bg: "bg-[#00e5ff]/10",
    text: "text-[#00e5ff]",
  },
  violet: {
    border: "border-[#a855f7]/25",
    bg: "bg-[#a855f7]/10",
    text: "text-[#c084fc]",
  },
  amber: {
    border: "border-[#f59e0b]/25",
    bg: "bg-[#f59e0b]/10",
    text: "text-[#fbbf24]",
  },
  rose: {
    border: "border-[#ff4365]/25",
    bg: "bg-[#ff4365]/10",
    text: "text-[#ff6b85]",
  },
  zinc: {
    border: "border-[#252c3d]",
    bg: "bg-[#141824]",
    text: "text-[#8e9ab2]",
  },
  default: {
    border: "border-[#252c3d]",
    bg: "bg-[#141824]",
    text: "text-[#8e9ab2]",
  },
};

/**
 * Understated, clean Badge
 * Restrained contrast, clean spacing, optical hierarchy.
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
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border text-xs font-mono font-medium tracking-wide select-none ${t.border} ${t.bg} ${t.text} ${className}`}
    >
      {pulsing && (
        <span className="relative flex h-1.5 w-1.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-current opacity-75" />
          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-current" />
        </span>
      )}
      <span>{label}</span>
      {value !== undefined && (
        <>
          <span className="opacity-40">·</span>
          <span className="font-semibold text-[#f1f4fa]">{value}</span>
        </>
      )}
    </span>
  );
}

export const PillBadge = TelemetryBadge;
