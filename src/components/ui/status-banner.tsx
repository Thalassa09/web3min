import React from "react";
import { ShieldCheck, Zap, AlertTriangle } from "lucide-react";

type BannerStatus = "verified" | "live" | "warning";

interface StatusBannerProps {
  status?: BannerStatus;
  title: string;
  subtitle?: string;
  proofHash?: string;
  className?: string;
}

/**
 * Blueprint 2.2 & 2.11 from UI UX Component Library:
 * Telemetry Health & Cryptographic Verification Status Banner.
 */
export function StatusBanner({
  status = "verified",
  title,
  subtitle,
  proofHash,
  className = "",
}: StatusBannerProps) {
  const configs = {
    verified: {
      border: "border-[#00f59b]/25",
      bg: "bg-[#00f59b]/5",
      icon: <ShieldCheck className="w-4 h-4 text-[#00f59b]" />,
      badge: "ON-CHAIN PROOF",
      badgeColor: "bg-[#00f59b]/15 text-[#00f59b] border-[#00f59b]/30",
    },
    live: {
      border: "border-[#00e5ff]/25",
      bg: "bg-[#00e5ff]/5",
      icon: <Zap className="w-4 h-4 text-[#00e5ff]" />,
      badge: "LIVE FEED",
      badgeColor: "bg-[#00e5ff]/15 text-[#00e5ff] border-[#00e5ff]/30",
    },
    warning: {
      border: "border-[#f59e0b]/25",
      bg: "bg-[#f59e0b]/5",
      icon: <AlertTriangle className="w-4 h-4 text-[#f59e0b]" />,
      badge: "ATTENTION",
      badgeColor: "bg-[#f59e0b]/15 text-[#f59e0b] border-[#f59e0b]/30",
    },
  }[status];

  return (
    <div
      className={`relative flex items-center justify-between gap-4 p-3 px-4 rounded-[16px] border backdrop-blur-md ${configs.border} ${configs.bg} ${className}`}
    >
      <div className="flex items-center gap-3 min-w-0">
        <div className="p-2 rounded-[10px] bg-[#0c0d16] border border-white/5 shrink-0">
          {configs.icon}
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-display font-bold text-sm text-zinc-100">{title}</span>
            <span
              className={`text-[9px] font-mono uppercase px-1.5 py-0.5 rounded border font-semibold ${configs.badgeColor}`}
            >
              {configs.badge}
            </span>
          </div>
          {subtitle && (
            <p className="text-xs text-zinc-400 font-sans truncate mt-0.5">{subtitle}</p>
          )}
        </div>
      </div>

      {proofHash && (
        <div className="hidden sm:flex flex-col items-end shrink-0">
          <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">PROOF HASH</span>
          <span className="text-xs font-mono text-[#00e5ff] truncate max-w-[140px]">{proofHash}</span>
        </div>
      )}
    </div>
  );
}
