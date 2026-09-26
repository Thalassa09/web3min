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
      "bg-gradient-to-b from-white via-[#FFF9F5] to-[#FDEEE4] border-2 border-choco-900 shadow-[0_4px_0_#3B2218] text-choco-900",
    cream:
      "bg-gradient-to-b from-[#FFFBEB] via-[#FEF3C7] to-[#FDE68A] border-2 border-choco-900 shadow-[0_4px_0_#3B2218] text-choco-900",
    sky:
      "bg-gradient-to-b from-[#FFF0F5] via-[#FFE4ED] to-[#FDC8D8] border-2 border-choco-900 shadow-[0_4px_0_#3B2218] text-choco-900",
    flat:
      "bg-white border-2 border-choco-900 shadow-none text-choco-900",
    interactive:
      "bg-gradient-to-b from-white via-[#FFF9F5] to-[#FDEEE4] border-2 border-choco-900 shadow-[0_4px_0_#3B2218] hover:-translate-y-0.5 hover:shadow-[0_6px_0_#3B2218] active:translate-y-[2px] active:shadow-none cursor-pointer transition-all text-choco-900",
  };

  return (
    <div
      className={`
        relative rounded-3xl p-5 md:p-6
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
