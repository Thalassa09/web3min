import React from "react";
import { ShieldCheck, Zap, AlertTriangle, Info, CheckCircle2, AlertCircle } from "lucide-react";
import { Lozenge } from "./lozenge";

export type BannerStatus = "verified" | "live" | "warning" | "info" | "danger" | "success";

export interface StatusBannerProps {
  status?: BannerStatus;
  title: string;
  subtitle?: string;
  proofHash?: string;
  className?: string;
  action?: React.ReactNode;
}

/**
 * Atlaskit Banner / Flag Specification
 * High-visibility banner for critical alerts, telemetry proof, or status changes.
 * WCAG 2.1 AA compliant, zero raw emoji, fully semantic.
 */
export function StatusBanner({
  status = "verified",
  title,
  subtitle,
  proofHash,
  className = "",
  action,
}: StatusBannerProps) {
  const configs: Record<
    BannerStatus,
    {
      border: string;
      bg: string;
      shadow: string;
      icon: React.ReactNode;
      badgeText: string;
      appearance: "default" | "success" | "inprogress" | "new" | "moved" | "removed";
    }
  > = {
    verified: {
      border: "border-[#98E4B5]",
      bg: "bg-[#E8FBF0]",
      shadow: "shadow-[0_3px_0_#98E4B5]",
      icon: <ShieldCheck className="size-4 text-leaf-shadow" />,
      badgeText: "ON-CHAIN PROOF",
      appearance: "success",
    },
    live: {
      border: "border-sky-300",
      bg: "bg-sky-100",
      shadow: "shadow-[0_3px_0_#8FC2FF]",
      icon: <Zap className="size-4 text-[#0B63F6]" />,
      badgeText: "LIVE FEED",
      appearance: "inprogress",
    },
    warning: {
      border: "border-[#FFE08A]",
      bg: "bg-[#FFF8E1]",
      shadow: "shadow-[0_3px_0_#FFE08A]",
      icon: <AlertTriangle className="size-4 text-[#B27B00]" />,
      badgeText: "PERINGATAN",
      appearance: "moved",
    },
    info: {
      border: "border-sky-300",
      bg: "bg-sky-100",
      shadow: "shadow-[0_3px_0_#8FC2FF]",
      icon: <Info className="size-4 text-[#0B63F6]" />,
      badgeText: "INFO",
      appearance: "default",
    },
    danger: {
      border: "border-[#F4A4A0]",
      bg: "bg-[#FFECEC]",
      shadow: "shadow-[0_3px_0_#F4A4A0]",
      icon: <AlertCircle className="size-4 text-ruby-shadow" />,
      badgeText: "PENTING",
      appearance: "removed",
    },
    success: {
      border: "border-[#98E4B5]",
      bg: "bg-[#E8FBF0]",
      shadow: "shadow-[0_3px_0_#98E4B5]",
      icon: <CheckCircle2 className="size-4 text-leaf-shadow" />,
      badgeText: "SUKSES",
      appearance: "success",
    },
  };

  const current = configs[status] ?? configs.verified;

  return (
    <div
      role="alert"
      className={`relative flex items-center justify-between gap-3.5 p-3.5 px-4 rounded-[16px] border-2 ${current.border} ${current.bg} ${current.shadow} ${className}`}
    >
      <div className="flex items-center gap-3 min-w-0">
        <div className="size-8 rounded-full bg-white border border-current/20 flex items-center justify-center shrink-0 shadow-sm">
          {current.icon}
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-display font-bold text-sm text-ink-900 leading-snug">
              {title}
            </span>
            <Lozenge appearance={current.appearance} isBold={false}>
              {current.badgeText}
            </Lozenge>
          </div>
          {subtitle && (
            <p className="text-xs text-ink-500 font-sans truncate mt-0.5 font-medium">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        {action}
        {proofHash && (
          <div className="hidden sm:flex flex-col items-end">
            <span className="text-[10px] font-mono text-ink-300 uppercase tracking-wider font-bold">
              PROOF HASH
            </span>
            <span className="text-xs font-mono font-bold text-sky-700 truncate max-w-[120px]">
              {proofHash}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
