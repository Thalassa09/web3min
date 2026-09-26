import React from "react";
import { cn } from "@/lib/utils";

export interface SectionTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

/**
 * SectionTitle Component
 * - Pixel font (Pixelify Sans)
 * - Uppercase tracking
 * - Prefix "▶️" in pink candy
 */
export const SectionTitle: React.FC<SectionTitleProps> = ({
  title,
  subtitle,
  action,
  className,
  ...rest
}) => {
  return (
    <div className={cn("flex items-center justify-between gap-3 mb-3", className)}>
      <div className="flex flex-col">
        <h3
          className="font-pixel text-lg sm:text-xl font-bold uppercase tracking-wider text-choco-900 flex items-center gap-2"
          {...rest}
        >
          <span className="inline-flex items-center justify-center size-5 rounded-md bg-candy-100 border border-candy-400 text-candy-700 select-none shadow-[0_1.5px_0_#E8437F]">
            <svg className="size-3 fill-current" viewBox="0 0 16 16">
              <polygon points="4,2 14,8 4,14" />
            </svg>
          </span>
          <span>{title}</span>
        </h3>
        {subtitle && (
          <p className="font-sans text-xs font-bold text-choco-600 ml-6">
            {subtitle}
          </p>
        )}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
};

export default SectionTitle;
