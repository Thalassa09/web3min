import React from "react";

interface SurfaceCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: "default" | "cream" | "sky" | "flat" | "interactive";
  className?: string;
}

/**
 * Sunny World Surface Card
 * Bright, clean, rounded card living on the sky blue background.
 * Follows DESIGN.md: 2px border #B9CFE9 and 6px solid tactile shadow #C8DBF0.
 */
export function SurfaceCard({
  children,
  variant = "default",
  className = "",
  ...props
}: SurfaceCardProps) {
  const variantStyles: Record<string, string> = {
    default: "bg-[#FFFFFF] border-2 border-[#B9CFE9] shadow-[0_6px_0_#C8DBF0,0_18px_34px_-18px_rgba(9,48,102,0.3)] text-[#0D2340]",
    cream: "bg-[#FFF7E4] border-2 border-[#EADBBD] shadow-[0_6px_0_#D8C7A0,0_18px_34px_-18px_rgba(9,48,102,0.25)] text-[#0D2340]",
    sky: "bg-[#E4F0FF] border-2 border-[#8FC2FF] shadow-[0_6px_0_#C2DBFA,0_18px_34px_-18px_rgba(9,48,102,0.25)] text-[#0D2340]",
    flat: "bg-[#FFFFFF] border-2 border-[#B9CFE9] shadow-none text-[#0D2340]",
    interactive: "bg-[#FFFFFF] border-2 border-[#B9CFE9] shadow-[0_6px_0_#C8DBF0,0_18px_34px_-18px_rgba(9,48,102,0.3)] hover:border-[#8FC2FF] hover:translate-y-[-2px] active:translate-y-[2px] active:shadow-[0_2px_0_#C8DBF0] cursor-pointer transition-all duration-150 text-[#0D2340]",
  };

  return (
    <div
      className={`
        relative rounded-[20px] p-5 md:p-6
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
