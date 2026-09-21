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
 * Sunny World Segmented Navigation
 * Clean tactile pill switch on sky-100 base with crisp white active card.
 */
export function SegmentedNav({
  items,
  activeId,
  onChange,
  className = "",
}: SegmentedNavProps) {
  return (
    <div
      className={`inline-flex items-center p-1.5 rounded-[16px] bg-[#E4F0FF] border-2 border-[#B9CFE9] shadow-inner ${className}`}
    >
      {items.map((item) => {
        const isActive = item.id === activeId;
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onChange(item.id)}
            className={`
              relative flex items-center justify-center gap-2 px-4 py-2 rounded-[12px] text-xs font-sans font-extrabold select-none cursor-pointer
              transition-[transform,box-shadow,background-color,border-color,color] duration-150 ease-out
              active:translate-y-[1px]
              ${
                isActive
                  ? "bg-[#FFFFFF] text-[#0B4FD1] border-2 border-[#8FC2FF] shadow-[0_3px_0_#C2DBFA]"
                  : "text-[#4A6580] hover:text-[#0D2340] hover:bg-white/50 border-2 border-transparent"
              }
            `}
          >
            {item.icon && <span className="shrink-0">{item.icon}</span>}
            <span>{item.label}</span>
            {item.badge !== undefined && (
              <span
                className={`text-[10px] font-sans px-2 py-0.5 rounded-full font-extrabold ${
                  isActive
                    ? "bg-[#FFC61A] text-[#0D2340]"
                    : "bg-[#DCE7F5] text-[#1E3A5F]"
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
