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
 * - Hash formatting #0x01 in the system mono stack
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
      ? "Blok selesai dipelajari"
      : status === "active"
      ? "Blok aktif siap dipelajari"
      : status === "chest"
      ? "PETI hadiah — buka setelah blok terakhir rute"
      : "Blok terkunci";
  const nodeLabel =
    status === "chest"
      ? `PETI hadiah rute${title ? `: ${title}` : ""}`
      : `${hexHash}${title ? ` — ${title}` : ""}`;

  return (
    <div
      className={cn(
        "relative flex flex-col items-center justify-center select-none group",
        isShaking && "shake",
        className
      )}
      style={style}
    >
      {/* 1. Attached Hash Tag (#0x01) with Retro Arcade Pill */}
      <div className="absolute -top-7 left-1/2 -translate-x-1/2 z-10 pointer-events-none whitespace-nowrap">
        <span
          className={cn(
            "px-2 py-0.5 rounded-full text-[10px] font-pixel font-bold tracking-tight uppercase border-2 shadow-[0_2px_0_#3B2218]",
            status === "done"
              ? "bg-emerald-100 text-emerald-800 border-choco-900"
              : status === "active"
              ? "bg-white text-choco-900 border-choco-900 ring-2 ring-candy-400"
              : status === "chest"
              ? "bg-amber-100 text-amber-900 border-choco-900"
              : "bg-[#EAE4DC] text-choco-600/80 border-choco-900/60"
          )}
        >
          {status === "chest" ? "PETI" : hexHash}
        </span>
      </div>

      {/* 2. Floating MULAI bubble for active node */}
      {status === "active" && (
        <span className="absolute -top-13 z-20 px-2.5 py-0.5 rounded-full bg-candy-800 text-white font-pixel font-bold text-[10px] border-2 border-choco-900 shadow-[0_2px_0_#3B2218] animate-bounce pointer-events-none flex items-center gap-1">
          <span>MULAI</span>
        </span>
      )}

      {/* 3. The Tactile 3D Round Arcade Node */}
      <button
        type="button"
        onClick={onClick}
        aria-label={`${nodeLabel} — ${statusLabel}`}
        className={cn(
          "relative size-[64px] sm:size-[68px] rounded-full border-3 border-choco-900 cursor-pointer select-none transition-all duration-100",
          "focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-primary",
          "active:translate-y-[5px] active:shadow-[0_1px_0_#3B2218]",
          status === "active" && [
            "bg-gradient-to-b from-[#FF6B9E] via-[#E8437F] to-[#C92A65]",
            "text-white shadow-[0_6px_0_#8F1340,0_8px_0_#3B2218]",
            "hover:brightness-105 active:shadow-[0_1px_0_#3B2218]"
          ],
          status === "done" && [
            "bg-gradient-to-b from-[#34D399] via-[#10B981] to-[#059669]",
            "text-white shadow-[0_6px_0_#065F46,0_8px_0_#3B2218]",
            "hover:brightness-105 active:shadow-[0_1px_0_#3B2218]"
          ],
          status === "locked" && [
            "bg-gradient-to-b from-[#EFEAE4] via-[#DDD3C7] to-[#C5B7A8]",
            "text-choco-600/70 border-2 border-choco-900/60 shadow-[0_5px_0_#857465,0_7px_0_#3B2218]",
            "hover:brightness-102 active:shadow-[0_1px_0_#3B2218]"
          ],
          status === "chest" && [
            "bg-gradient-to-b from-[#FFE57F] via-[#FFD54F] to-[#FFA000]",
            "text-choco-900 shadow-[0_6px_0_#B45309,0_8px_0_#3B2218]",
            "hover:brightness-105 active:shadow-[0_1px_0_#3B2218]"
          ]
        )}
      >
        {/* Active mining dashed pulse aura */}
        {status === "active" && (
          <span className="absolute -inset-2.5 rounded-full border-2 border-dashed border-candy-500 animate-pulse pointer-events-none" />
        )}

        {/* Specular Highlight Arc (Top Gloss Glint) */}
        <span className="absolute inset-x-3 top-1.5 h-4.5 rounded-full bg-gradient-to-b from-white/45 to-transparent pointer-events-none" />

        {/* Inner Concentric Rim / Bezel */}
        <span
          className={cn(
            "absolute inset-1.5 rounded-full border pointer-events-none",
            status === "active" && "border-white/30",
            status === "done" && "border-white/30",
            status === "locked" && "border-white/40",
            status === "chest" && "border-white/50"
          )}
        />

        {/* Upright Center Icon with 3D drop depth */}
        <span className="relative flex size-full items-center justify-center drop-shadow-[0_2px_0_rgba(59,34,24,0.3)]">
          <PulauIcon
            name={iconName}
            size={status === "chest" ? 26 : status === "done" ? 24 : 22}
            fill={status === "done" || status === "active" || status === "chest"}
          />
        </span>
      </button>

      {/* 4. 3 Confirmation Dots (0/3 -> 3/3 Konfirmasi) */}
      <div
        className="mt-3 flex items-center gap-1.5"
        title={`Konfirmasi blok: ${confCount}/3`}
        aria-hidden="true"
      >
        {[0, 1, 2].map((idx) => {
          const isFilled = idx < confCount;
          return (
            <span
              key={idx}
              className={cn(
                "size-2.5 rounded-full border border-choco-900 transition-all duration-200 shadow-[0_1px_0_#3B2218]",
                isFilled
                  ? status === "done"
                    ? "bg-emerald-500 ring-1 ring-white/60"
                    : "bg-candy-500 ring-1 ring-white/60 animate-pulse"
                  : "bg-cream/90 border-choco-300"
              )}
            />
          );
        })}
      </div>
    </div>
  );
};
