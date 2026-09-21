import React from "react";

interface SurfaceCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: "default" | "elevated" | "recessed" | "interactive";
  className?: string;
}

/**
 * Clean architectural Surface Card
 * Built on the nested squircle rule and subtle border contrast.
 * No cheesy neon glow washes or fake terminal slashes.
 */
export function SurfaceCard({
  children,
  variant = "default",
  className = "",
  ...props
}: SurfaceCardProps) {
  const variantStyles = {
    default: "bg-[#0e121a] border-[#1c2333] text-[#f1f4fa]",
    elevated: "bg-[#131823] border-[#222b3d] shadow-lg shadow-black/40 text-[#f1f4fa]",
    recessed: "bg-[#090b10] border-[#181d29] text-[#f1f4fa]",
    interactive: "bg-[#0e121a] border-[#1c2333] hover:border-[#2b354c] hover:bg-[#121620] cursor-pointer transition-all duration-200 text-[#f1f4fa]",
  };

  return (
    <div
      className={`
        relative rounded-[20px] border p-5 md:p-6
        ${variantStyles[variant]}
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
