import React from "react";
import { cn } from "@/lib/utils";

export interface ChainLinkProps {
  className?: string;
  orientation?: "vertical" | "horizontal";
  color?: string;
  length?: number; // number of links
}

/**
 * Blok Rantai Mata Rantai (Chain Link) Component
 * Realistic interlocking dual-loop link graphic that connects blocks and modules.
 */
export const ChainLink: React.FC<ChainLinkProps> = ({
  className,
  orientation = "vertical",
  color = "currentColor",
  length = 2,
}) => {
  const isVert = orientation === "vertical";

  return (
    <div
      className={cn(
        "inline-flex items-center justify-center select-none pointer-events-none",
        isVert ? "flex-col -space-y-1.5" : "flex-row -space-x-1.5",
        className
      )}
      aria-hidden="true"
    >
      {Array.from({ length }).map((_, i) => (
        <svg
          key={i}
          width={isVert ? 16 : 24}
          height={isVert ? 24 : 16}
          viewBox={isVert ? "0 0 16 24" : "0 0 24 16"}
          fill="none"
          className="shrink-0"
        >
          {isVert ? (
            <>
              {/* Outer Link Ring */}
              <rect
                x="2"
                y="2"
                width="12"
                height="20"
                rx="6"
                stroke={color}
                strokeWidth="2.5"
                fill="var(--color-paper, #FFFFFF)"
              />
              {/* Inner Hole */}
              <rect
                x="5.5"
                y="6"
                width="5"
                height="12"
                rx="2.5"
                stroke={color}
                strokeWidth="1.5"
                fill="none"
                opacity="0.8"
              />
            </>
          ) : (
            <>
              {/* Outer Link Ring */}
              <rect
                x="2"
                y="2"
                width="20"
                height="12"
                rx="6"
                stroke={color}
                strokeWidth="2.5"
                fill="var(--color-paper, #FFFFFF)"
              />
              {/* Inner Hole */}
              <rect
                x="6"
                y="5.5"
                width="12"
                height="5"
                rx="2.5"
                stroke={color}
                strokeWidth="1.5"
                fill="none"
                opacity="0.8"
              />
            </>
          )}
        </svg>
      ))}
    </div>
  );
};
