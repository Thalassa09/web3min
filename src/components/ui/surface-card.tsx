import React from "react";

interface SurfaceCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: "default" | "cream" | "sky" | "flat" | "interactive";
  className?: string;
}

/**
 * Tactile Beveled Surface Card
 * Pearlescent gradient surfaces with chromatic 2px borders, 22px rounded squircle,
 * and solid bottom extrusion shelf shadow with ambient drop shadow.
 */
export function SurfaceCard({
  children,
  variant = "default",
  className = "",
  ...props
}: SurfaceCardProps) {
  const variantStyles: Record<string, string> = {
    default:
      "bg-gradient-to-b from-white via-[#FFF9F5] to-[#FDEEE4] border-2 border-choco-900/18 shadow-[0_4.5px_0_#3B2218,0_10px_24px_-4px_rgba(59,34,24,0.12)] text-choco-900",
    cream:
      "bg-gradient-to-b from-[#FFFDF8] via-[#FFF6EE] to-[#FBE9DC] border-2 border-choco-900/18 shadow-[0_4.5px_0_#3B2218,0_10px_24px_-4px_rgba(59,34,24,0.12)] text-choco-900",
    sky:
      "bg-gradient-to-b from-[#FFF0F5] via-[#FFE4EC] to-[#FDC8D8] border-2 border-candy-500/40 shadow-[0_4.5px_0_#B01F62,0_10px_24px_-4px_rgba(232,67,127,0.22)] text-choco-900",
    flat:
      "bg-white border-2 border-choco-900/18 shadow-none text-choco-900",
    interactive:
      "bg-gradient-to-b from-white via-[#FFF9F5] to-[#FDEEE4] border-2 border-choco-900/18 shadow-[0_4.5px_0_#3B2218,0_10px_24px_-4px_rgba(59,34,24,0.12)] hover:-translate-y-0.5 hover:shadow-[0_6.5px_0_#3B2218,0_14px_28px_-4px_rgba(59,34,24,0.16)] active:translate-y-[2px] active:shadow-[0_1.5px_0_#3B2218] cursor-pointer transition-[transform,box-shadow,filter] duration-150 text-choco-900",
  };

  return (
    <div
      className={`
        relative rounded-[22px] p-5 md:p-6
        ${variantStyles[variant] ?? variantStyles.default}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
}

// Backwards compatibility alias for components expecting SpotlightCard
export const SpotlightCard = SurfaceCard;
