import React from "react";

export interface NavItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  badge?: string | number;
}

interface SegmentedNavProps {
  items: NavItem[];
  activeId: string;
  onChange: (id: string) => void;
  className?: string;
}

/**
 * Blueprint 11.1 & 28.1 from UI UX Component Library:
 * Button Navbar & Sliding Segmented Tab Controller with Glass Edge and Tactile Pill.
 */
export function SegmentedNav({
  items,
  activeId,
  onChange,
  className = "",
}: SegmentedNavProps) {
  return (
    <div
      className={`inline-flex items-center p-1 rounded-[16px] bg-[#0c0d16]/90 border border-[#1b1e2e] backdrop-blur-md shadow-[inset_0_1px_3px_rgba(0,0,0,0.5)] ${className}`}
    >
      {items.map((item) => {
        const isActive = item.id === activeId;
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onChange(item.id)}
            className={`
              relative flex items-center justify-center gap-2 px-4 py-2 rounded-[12px] text-xs font-mono font-bold uppercase select-none
              transition-all duration-150 ease-out
              active:scale-[0.97]
              ${
                isActive
                  ? "bg-[#161a2b] text-[#00f59b] border border-[#2b3353] shadow-[0_2px_8px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.08)]"
                  : "text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.02]"
              }
            `}
          >
            {item.icon && <span className="shrink-0">{item.icon}</span>}
            <span>{item.label}</span>
            {item.badge !== undefined && (
              <span
                className={`text-[9px] font-mono px-1.5 py-0.2 rounded font-bold ${
                  isActive
                    ? "bg-[#00f59b]/20 text-[#00f59b]"
                    : "bg-zinc-800 text-zinc-400"
                }`}
              >
                {item.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
