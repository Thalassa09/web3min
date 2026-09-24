import React from "react";
import { cn } from "@/lib/utils";
import { PulauIcon } from "@/lib/pulau-icons";

export type ChainBlockStatus = "done" | "active" | "locked" | "chest";

export interface ChainBlockProps {
  blockNo: number; // e.g. 1 -> #0x01
  status: ChainBlockStatus;
  title?: string;
  confirmations?: number; // 0..3
  onClick?: () => void;
  isShaking?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Blok Rantai Lesson Node
 * Distinctive signature element:
 * - Diamond-squircle (45° rotated rounded square, rounded-14px)
 * - Counter-rotated upright icon
 * - Hash formatting #0x01 in JetBrains Mono
 * - 3 Confirmation dots (0/3 to 3/3 konfirmasi)
 * - 3D solid drop shadow, sinks on press
 */
export const ChainBlock: React.FC<ChainBlockProps> = ({
  blockNo,
  status,
  title,
  confirmations,
  onClick,
  isShaking = false,
  className,
  style,
}) => {
  const hexHash = `#0x${blockNo.toString(16).toUpperCase().padStart(2, "0")}`;

  // Default confirmations based on status if not explicitly passed
  const confCount =
    confirmations !== undefined
      ? confirmations
      : status === "done"
      ? 3
      : status === "active"
      ? 1
      : 0;

  const iconName =
    status === "done"
      ? "check"
      : status === "chest"
      ? "chest"
      : status === "locked"
      ? "lock"
      : "star";

  const statusLabel =
    status === "done"
      ? "Blok tertambang (3/3 konfirmasi)"
      : status === "active"
      ? "Blok aktif siap ditambang"
      : "Blok terkunci";

  return (
    <div
      className={cn(
        "relative flex flex-col items-center justify-center select-none group",
        isShaking && "shake",
        className
      )}
      style={style}
    >
      {/* 1. Attached Hash Tag (#0x01) in JetBrains Mono */}
      <div className="absolute -top-6 left-1/2 -translate-x-1/2 z-10 pointer-events-none">
        <span
          className={cn(
            "px-1.5 py-0.5 rounded-[6px] text-[10px] font-mono font-bold tracking-tight uppercase shadow-xs",
            status === "done"
              ? "bg-primary-soft text-primary-hover border border-candy-line/80"
              : status === "active"
              ? "bg-white text-ink-900 border-2 border-primary shadow-sm"
              : "bg-canvas text-ink-300 border border-line"
          )}
        >
          {status === "chest" ? "PETI" : hexHash}
        </span>
      </div>

      {/* 2. Floating MULAI bubble for active node */}
      {status === "active" && (
        <span className="bubble z-20 pointer-events-none">
          MULAI
        </span>
      )}

      {/* 3. The 45-degree Tilted Blok (Rotated Square) */}
      <button
        type="button"
        onClick={onClick}
        aria-label={`${hexHash}: ${title || "Blok Rantai"} — ${statusLabel}`}
        className={cn(
          "relative size-[54px] rounded-[14px] rotate-45 border-2 cursor-pointer transition-[transform,box-shadow] duration-90",
          "focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-primary",
          "active:translate-x-[3px] active:translate-y-[3px] active:shadow-none",
          status === "done" &&
            "bg-primary border-primary-shadow text-white shadow-[3.5px_3.5px_0_var(--color-primary-shadow)] hover:brightness-105",
          status === "active" &&
            "bg-primary border-ink-900 text-white shadow-[3.5px_3.5px_0_var(--color-ink-900)] ring-4 ring-primary-soft",
          status === "locked" &&
            "bg-line border-line-strong text-ink-300 shadow-[3.5px_3.5px_0_#D8BFCC]",
          status === "chest" &&
            "bg-amber-100 border-amber-600 text-amber-800 shadow-[3.5px_3.5px_0_#B45309]"
        )}
      >
        {/* Active mining dashed pulse aura */}
        {status === "active" && (
          <span className="absolute -inset-2 border-2 border-dashed border-primary rounded-[18px] animate-pulse pointer-events-none" />
        )}

        {/* Counter-rotate inner content so it remains upright */}
        <span className="absolute inset-0 -rotate-45 flex items-center justify-center">
          <PulauIcon
            name={iconName}
            size={status === "chest" ? 24 : 22}
            fill={status === "done" || status === "active"}
          />
        </span>
      </button>

      {/* 4. 3 Confirmation Dots (0/3 -> 3/3 Konfirmasi) */}
      <div
        className="mt-3.5 flex items-center gap-1.5"
        title={`Konfirmasi blok: ${confCount}/3`}
        aria-hidden="true"
      >
        {[0, 1, 2].map((idx) => {
          const isFilled = idx < confCount;
          return (
            <span
              key={idx}
              className={cn(
                "size-2 rounded-full transition-all duration-200",
                isFilled
                  ? status === "done"
                    ? "bg-primary shadow-[0_1px_2px_rgba(232,67,127,0.4)]"
                    : "bg-primary animate-pulse"
                  : "bg-line border border-line-strong"
              )}
            />
          );
        })}
      </div>
    </div>
  );
};
