import React from "react";
import { Info, AlertTriangle, AlertCircle, CheckCircle2, Sparkles } from "lucide-react";

export type SectionMessageAppearance =
  | "information"
  | "warning"
  | "error"
  | "success"
  | "discovery";

export interface SectionMessageProps extends React.HTMLAttributes<HTMLDivElement> {
  appearance?: SectionMessageAppearance;
  title?: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}

/**
 * Atlassian Design System — Section Message
 * Used to alert users about particular sections of information, companion guidance,
 * or status updates directly within a page surface.
 */
export function SectionMessage({
  appearance = "information",
  title,
  children,
  icon,
  action,
  className = "",
  ...props
}: SectionMessageProps) {
  const STYLES: Record<
    SectionMessageAppearance,
    { bg: string; border: string; shadow: string; titleColor: string; defaultIcon: React.ReactNode }
  > = {
    information: {
      bg: "bg-[#E4F0FF]",
      border: "border-2 border-[#8FC2FF]",
      shadow: "shadow-[0_3px_0_#C2DBFA]",
      titleColor: "text-[#0B4FD1]",
      defaultIcon: <Info className="size-4 text-[#0B63F6]" />,
    },
    warning: {
      bg: "bg-[#FFF8E1]",
      border: "border-2 border-[#FFE08A]",
      shadow: "shadow-[0_3px_0_#FFE08A]",
      titleColor: "text-[#B27B00]",
      defaultIcon: <AlertTriangle className="size-4 text-[#B27B00]" />,
    },
    error: {
      bg: "bg-[#FFECEC]",
      border: "border-2 border-[#F4A4A0]",
      shadow: "shadow-[0_3px_0_#F4A4A0]",
      titleColor: "text-[#B01E18]",
      defaultIcon: <AlertCircle className="size-4 text-[#B01E18]" />,
    },
    success: {
      bg: "bg-[#E8FBF0]",
      border: "border-2 border-[#98E4B5]",
      shadow: "shadow-[0_3px_0_#98E4B5]",
      titleColor: "text-[#1E8A49]",
      defaultIcon: <CheckCircle2 className="size-4 text-[#1E8A49]" />,
    },
    discovery: {
      bg: "bg-[#F3ECFF]",
      border: "border-2 border-[#C4A8FF]",
      shadow: "shadow-[0_3px_0_#C4A8FF]",
      titleColor: "text-[#6A3FD1]",
      defaultIcon: <Sparkles className="size-4 text-[#8B5CF6]" />,
    },
  };

  const current = STYLES[appearance];

  return (
    <div
      role="region"
      className={`
        relative rounded-[18px] p-3.5 sm:p-4
        ${current.bg} ${current.border} ${current.shadow}
        ${className}
      `}
      {...props}
    >
      <div className="flex items-start gap-3">
        <div className="size-7 rounded-full bg-white/80 border border-current/20 flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
          {icon || current.defaultIcon}
        </div>
        <div className="flex-1 min-w-0">
          {title && (
            <h4 className={`font-display font-bold text-sm tracking-tight ${current.titleColor}`}>
              {title}
            </h4>
          )}
          <div className="text-xs font-medium text-[#4A6580] mt-0.5 leading-relaxed">
            {children}
          </div>
          {action && <div className="mt-2">{action}</div>}
        </div>
      </div>
    </div>
  );
}
