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
 * Clean Segmented Nav controller
 */
export function SegmentedNav({
  items,
  activeId,
  onChange,
  className = "",
}: SegmentedNavProps) {
  return (
    <div
      className={`inline-flex items-center p-1 rounded-[14px] bg-[#0c1017] border border-[#1c2333] shadow-inner ${className}`}
    >
      {items.map((item) => {
        const isActive = item.id === activeId;
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onChange(item.id)}
            className={`
              relative flex items-center justify-center gap-2 px-3.5 py-1.5 rounded-[10px] text-xs font-sans font-semibold select-none
              transition-all duration-150 ease-out
              active:scale-[0.98]
              ${
                isActive
                  ? "bg-[#182030] text-[#f1f4fa] border border-[#26334d] shadow-sm"
                  : "text-[#8e9ab2] hover:text-[#f1f4fa] hover:bg-white/[0.03]"
              }
            `}
          >
            {item.icon && <span className="shrink-0">{item.icon}</span>}
            <span>{item.label}</span>
            {item.badge !== undefined && (
              <span
                className={`text-[10px] font-mono px-1.5 py-0.5 rounded-full font-semibold ${
                  isActive
                    ? "bg-[#00f59b]/20 text-[#00f59b]"
                    : "bg-[#182030] text-[#8e9ab2]"
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
