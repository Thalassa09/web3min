import React from "react";

interface LameAvatarProps {
  name: string;
  subtext?: string;
  avatarUrl?: string | null;
  size?: "sm" | "md" | "lg";
  isOnline?: boolean;
  className?: string;
}

const AVATAR_SIZES = {
  sm: { box: "w-9 h-9 rounded-[10px]", text: "text-xs", pillText: "text-[10px]" },
  md: { box: "w-12 h-12 rounded-[14px]", text: "text-sm", pillText: "text-[11px]" },
  lg: { box: "w-16 h-16 rounded-[18px]", text: "text-base", pillText: "text-xs" },
};

/**
 * Blueprint 3.11 from UI UX Component Library:
 * Squircle Lamé Identity Avatar with Telemetry Micro-Pill & Doppelrand bezel.
 */
export function LameAvatar({
  name,
  subtext,
  avatarUrl,
  size = "md",
  isOnline = true,
  className = "",
}: LameAvatarProps) {
  const s = AVATAR_SIZES[size];
  const initials = name.slice(0, 2).toUpperCase();

  return (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      {/* Lamé Squircle Outer Frame */}
      <div className="relative p-[1.5px] rounded-[15px] bg-gradient-to-b from-[#2a304e] to-[#121422] shadow-[0_2px_8px_rgba(0,0,0,0.6)]">
        <div
          className={`relative ${s.box} bg-[#0b0c14] flex items-center justify-center font-display font-black text-zinc-200 overflow-hidden border border-[#1e2338]`}
        >
          {avatarUrl ? (
            <img src={avatarUrl} alt={name} className="w-full h-full object-cover" />
          ) : (
            <span>{initials}</span>
          )}

          {/* Online Presence Beacon */}
          {isOnline && (
            <span className="absolute bottom-1 right-1 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00f59b] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00f59b] border border-[#0b0c14]" />
            </span>
          )}
        </div>
      </div>

      {subtext && (
        <div className="flex flex-col min-w-0">
          <span className="font-display font-bold text-zinc-100 truncate text-sm leading-tight">
            {name}
          </span>
          <span className="font-mono text-xs text-[#00e5ff] tracking-wide truncate">
            {subtext}
          </span>
        </div>
      )}
    </div>
  );
}
