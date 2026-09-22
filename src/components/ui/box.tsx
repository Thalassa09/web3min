import React from "react";

export type SurfaceElevation = "default" | "sunken" | "raised" | "overlay" | "flat";
export type BoxRadius = "none" | "sm" | "md" | "lg" | "xl" | "2xl" | "full";
export type BoxPadding = "none" | "xs" | "sm" | "md" | "lg" | "xl";
export type BoxBorder = "none" | "subtle" | "bold" | "brand" | "brand-bold" | "dashed";

export interface BoxProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  as?: React.ElementType;
  elevation?: SurfaceElevation;
  radius?: BoxRadius;
  padding?: BoxPadding;
  border?: BoxBorder;
  className?: string;
}

/**
 * Atlassian Design System — Box Primitive
 * The foundational structural primitive providing managed access to elevation,
 * surface colors, border tokens, and border-radius.
 */
export function Box({
  children,
  as: Component = "div",
  elevation = "default",
  radius = "lg",
  padding = "md",
  border = "subtle",
  className = "",
  style,
  ...props
}: BoxProps) {
  // Elevation & Surface mappings (ADS elevation tokens)
  const ELEVATION_STYLES: Record<SurfaceElevation, string> = {
    flat: "bg-white",
    default: "bg-white shadow-[0_2px_0_#DCE7F5]",
    sunken: "bg-[#EAF2FC] shadow-inner",
    raised: "bg-white shadow-[0_6px_0_#C8DBF0,0_18px_34px_-18px_rgba(9,48,102,0.3)]",
    overlay: "bg-white shadow-[0_12px_36px_-8px_rgba(9,48,102,0.28)]",
  };

  // Radius mappings (Continuous squircle tokens)
  const RADIUS_STYLES: Record<BoxRadius, string> = {
    none: "rounded-none",
    sm: "rounded-[10px]",
    md: "rounded-[14px]",
    lg: "rounded-[18px]",
    xl: "rounded-[22px]",
    "2xl": "rounded-[26px]",
    full: "rounded-full",
  };

  // Padding scale (Atlassian 4/8/16/24/32px scale)
  const PADDING_STYLES: Record<BoxPadding, string> = {
    none: "p-0",
    xs: "p-2 sm:p-2.5",
    sm: "p-3 sm:p-3.5",
    md: "p-4 sm:p-5",
    lg: "p-5 sm:p-6 md:p-8",
    xl: "p-6 sm:p-8 md:p-10",
  };

  // Border tokens
  const BORDER_STYLES: Record<BoxBorder, string> = {
    none: "border-0",
    subtle: "border-2 border-[#DCE7F5]",
    bold: "border-2 border-[#B9CFE9]",
    brand: "border-2 border-[#8FC2FF]",
    "brand-bold": "border-2 border-[#0B63F6]",
    dashed: "border-2 border-dashed border-[#DCE7F5]",
  };

  return (
    <Component
      className={`
        relative text-[#0D2340]
        ${ELEVATION_STYLES[elevation]}
        ${RADIUS_STYLES[radius]}
        ${PADDING_STYLES[padding]}
        ${BORDER_STYLES[border]}
        ${className}
      `}
      style={style}
      {...props}
    >
      {children}
    </Component>
  );
}
