import React from "react";

interface SurfaceCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: "default" | "cream" | "sky" | "flat" | "interactive";
  className?: string;
}

/**
 * Pixel Candy Surface Card
 * Warm cream paper & crisp card surfaces with chunky 2px ink borders and hard offset shadows.
 * Follows Pixel Candy identity: 2px border #1B1440 and 4px 4px 0 #1B1440 hard shadow.
 */
export function SurfaceCard({
  children,
  variant = "default",
  className = "",
  ...props
}: SurfaceCardProps) {
  const variantStyles: Record<string, string> = {
    default: "bg-white border-2 border-[#1B1440] shadow-[4px_4px_0_#1B1440] text-[#1B1440]",
    cream: "bg-[#FFF7EC] border-2 border-[#1B1440] shadow-[4px_4px_0_#1B1440] text-[#1B1440]",
    sky: "bg-[#4D7CFF] border-2 border-[#1B1440] shadow-[4px_4px_0_#1B1440] text-white",
    flat: "bg-white border-2 border-[#1B1440] shadow-none text-[#1B1440]",
    interactive: "bg-white border-2 border-[#1B1440] shadow-[4px_4px_0_#1B1440] hover:brightness-[1.02] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0_#1B1440] cursor-pointer transition-[transform,box-shadow,filter] duration-100 text-[#1B1440]",
  };

  return (
    <div
      className={`
        relative rounded-[16px] p-5 md:p-6
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
