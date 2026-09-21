import React, { useRef } from "react";

interface SpotlightCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  glowColor?: string;
  asymmetric?: boolean;
}

/**
 * Blueprint 12.1 from UI UX Component Library: Spotlight Border Hover Card
 * Integrated with DKV Lamé Squircle curve & Doppelrand double-bezel layering.
 */
export function SpotlightCard({
  children,
  className = "",
  glowColor = "rgba(0, 245, 155, 0.18)",
  asymmetric = false,
  ...props
}: SpotlightCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    cardRef.current.style.setProperty("--mouse-x", `${x}px`);
    cardRef.current.style.setProperty("--mouse-y", `${y}px`);
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      className={`relative group rounded-[24px] p-[2px] bg-gradient-to-b from-[#222436] to-[#12131f] transition-all duration-300 ${className}`}
      style={{
        boxShadow: "0 8px 32px -4px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.06)",
      }}
      {...props}
    >
      {/* Dynamic Cursor Spotlight Layer */}
      <div
        className="absolute inset-0 rounded-[24px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{
          background: `radial-gradient(450px circle at var(--mouse-x, 0) var(--mouse-y, 0), ${glowColor}, transparent 75%)`,
        }}
      />

      {/* Doppelrand Inner Bezel Container */}
      <div className="relative h-full w-full rounded-[22px] bg-[#0c0d16]/95 backdrop-blur-md p-5 border border-[#1b1e2e]/90 group-hover:border-[#2b314d]/70 transition-colors">
        {children}
      </div>
    </div>
  );
}
