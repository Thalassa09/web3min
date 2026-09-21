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
  sm: { box: "w-9 h-9 rounded-[12px]", text: "text-xs font-extrabold" },
  md: { box: "w-12 h-12 rounded-[14px]", text: "text-sm font-extrabold" },
  lg: { box: "w-16 h-16 rounded-[18px]", text: "text-base font-extrabold" },
};

/**
 * Sunny World Avatar with Thick Rounded Border
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
          className={`relative ${s.box} bg-[#E4F0FF] flex items-center justify-center font-sans ${s.text} text-[#0B4FD1] overflow-hidden border-2 border-[#B9CFE9] shadow-[0_2px_0_#C8DBF0]`}
        >
          {avatarUrl ? (
            <img src={avatarUrl} alt={name} className="w-full h-full object-cover" />
          ) : (
            <span>{initials}</span>
          )}

          {isOnline && (
            <span className="absolute bottom-1 right-1 flex h-2.5 w-2.5">
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#34C06A] border-2 border-white" />
            </span>
          )}
        </div>
      </div>

      {subtext && (
        <div className="flex flex-col min-w-0">
          <span className="font-sans font-extrabold text-[#0D2340] truncate text-sm leading-tight">
            {name}
          </span>
          <span className="text-xs text-[#4A6580] truncate mt-0.5">
            {subtext}
          </span>
        </div>
      )}
    </div>
  );
}
