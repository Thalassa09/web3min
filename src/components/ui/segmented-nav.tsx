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
 * Clean tactile pill switch on candy-100 base with crisp active card.
 */
export function SegmentedNav({
  items,
  activeId,
  onChange,
  className = "",
}: SegmentedNavProps) {
  return (
    <div
      className={`inline-flex items-center p-1.5 rounded-[16px] bg-candy-100 border-2 border-choco-900 shadow-[0_2px_0_#3B2218] ${className}`}
    >
      {items.map((item) => {
        const isActive = item.id === activeId;
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onChange(item.id)}
            className={`
              relative flex items-center justify-center gap-2 px-4 py-2 rounded-[12px] text-xs font-pixel font-bold select-none cursor-pointer
              transition-[transform,box-shadow,background-color,border-color,color] duration-150 ease-out
              active:translate-y-[1px]
              ${
                isActive
                  ? "bg-candy-500 text-white border-2 border-choco-900 shadow-[0_2px_0_#3B2218]"
                  : "text-choco-600 hover:text-choco-900 hover:bg-white/50 border-2 border-transparent"
              }
            `}
          >
            {item.icon && <span className="shrink-0">{item.icon}</span>}
            <span>{item.label}</span>
            {item.badge !== undefined && (
              <span
                className={`text-[10px] font-pixel px-2 py-0.5 rounded-full font-bold ${
                  isActive
                    ? "bg-lemon text-choco-900"
                    : "bg-cream text-choco-600 border border-choco-900/30"
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
