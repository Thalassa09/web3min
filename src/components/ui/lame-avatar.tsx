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
  sm: { box: "w-9 h-9 rounded-[10px]", text: "text-xs" },
  md: { box: "w-12 h-12 rounded-[14px]", text: "text-sm" },
  lg: { box: "w-16 h-16 rounded-[18px]", text: "text-base" },
};

/**
 * Clean Avatar with Squircle contour
 */
export function LameAvatar({
  name,
  subtext,
  avatarUrl,
  size = "md",
  isOnline = false,
  className = "",
}: LameAvatarProps) {
  const s = AVATAR_SIZES[size];
  const initials = name.slice(0, 2).toUpperCase();

  return (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      <div className="relative">
        <div
          className={`relative ${s.box} bg-[#141824] flex items-center justify-center font-sans font-bold text-[#f1f4fa] overflow-hidden border border-[#232b3e]`}
        >
          {avatarUrl ? (
            <img src={avatarUrl} alt={name} className="w-full h-full object-cover" />
          ) : (
            <span>{initials}</span>
          )}

          {isOnline && (
            <span className="absolute bottom-1 right-1 flex h-2 w-2">
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00f59b] border border-[#0e121a]" />
            </span>
          )}
        </div>
      </div>

      {subtext && (
        <div className="flex flex-col min-w-0">
          <span className="font-sans font-bold text-[#f1f4fa] truncate text-sm leading-tight">
            {name}
          </span>
          <span className="text-xs text-[#8e9ab2] truncate mt-0.5">
            {subtext}
          </span>
        </div>
      )}
    </div>
  );
}
