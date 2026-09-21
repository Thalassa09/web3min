import React from "react";

interface PixelIconProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  name: "medal" | "lock";
  size?: number;
}

export function PixelIcon({ name, size = 24, className, style, alt = "", ...props }: PixelIconProps) {
  const src = name === "medal" ? "/icons/pixel-medal.png" : "/icons/pixel-lock.png";

  return (
    <img
      src={src}
      width={size}
      height={size}
      alt={alt || name}
      className={`select-none pointer-events-none object-contain ${className || ""}`}
      style={{
        imageRendering: "pixelated",
        width: `${size}px`,
        height: `${size}px`,
        ...style,
      }}
      loading="eager"
      decoding="async"
      {...props}
    />
  );
}
