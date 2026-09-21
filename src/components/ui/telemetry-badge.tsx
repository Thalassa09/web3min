import React from "react";

export type BadgeTone = "mint" | "cyan" | "violet" | "amber" | "rose" | "zinc";

interface TelemetryBadgeProps {
  label: string;
  value?: string | number;
  tone?: BadgeTone;
  pulsing?: boolean;
  className?: string;
}

const TONE_MAP: Record<BadgeTone, { border: string; bg: string; text: string; dot: string }> = {
  mint: {
    border: "border-[#00f59b]/30",
    bg: "bg-[#00f59b]/10",
    text: "text-[#00f59b]",
    dot: "bg-[#00f59b]",
  },
  cyan: {
    border: "border-[#00e5ff]/30",
    bg: "bg-[#00e5ff]/10",
    text: "text-[#00e5ff]",
    dot: "bg-[#00e5ff]",
  },
  violet: {
    border: "border-[#7014ff]/35",
    bg: "bg-[#7014ff]/15",
    text: "text-[#b084ff]",
    dot: "bg-[#a855f7]",
  },
  amber: {
    border: "border-[#f59e0b]/30",
    bg: "bg-[#f59e0b]/10",
    text: "text-[#fbbf24]",
    dot: "bg-[#f59e0b]",
  },
  rose: {
    border: "border-[#ff4365]/35",
    bg: "bg-[#ff4365]/15",
    text: "text-[#ff6b85]",
    dot: "bg-[#ff4365]",
  },
  zinc: {
    border: "border-zinc-800",
    bg: "bg-zinc-900/80",
    text: "text-zinc-400",
    dot: "bg-zinc-500",
  },
};

/**
 * Blueprint 4.1 & 4.3: Strict Monospace Key-Value Telemetry Badge
 * Monospace typography, optical split divider, and live cryptographic pulse indicator.
 */
export function TelemetryBadge({
  label,
  value,
  tone = "mint",
  pulsing = false,
  className = "",
}: TelemetryBadgeProps) {
  const t = TONE_MAP[tone];

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[11px] font-mono tracking-wider uppercase font-semibold select-none backdrop-blur-sm ${t.border} ${t.bg} ${t.text} ${className}`}
    >
      {pulsing && (
        <span className="relative flex h-1.5 w-1.5">
          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${t.dot}`} />
          <span className={`relative inline-flex rounded-full h-1.5 w-1.5 ${t.dot}`} />
        </span>
      )}
      <span>{label}</span>
      {value !== undefined && (
        <>
          <span className="opacity-35 font-normal">/</span>
          <span className="text-zinc-100 font-bold tracking-normal">{value}</span>
        </>
      )}
    </span>
  );
}
