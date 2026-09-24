import React from "react";
import { cn } from "@/lib/utils";
import { Sparkles } from "lucide-react";

export interface InvSlotProps extends React.HTMLAttributes<HTMLDivElement> {
  count?: number | string;
  icon?: React.ReactNode;
  label?: string;
  rarity?: string;
  active?: boolean;
  selected?: boolean;
}

/**
 * InvSlot Component (Inventory Slot)
 * 68x68 dashed pink border, cream/pink background, pixel font count "x0"
 */
export const InvSlot: React.FC<InvSlotProps> = ({
  count = "x0",
  icon,
  label,
  rarity,
  active = false,
  selected = false,
  className,
  ...rest
}) => {
  const isSelected = active || selected;
  return (
    <div className="flex flex-col items-center gap-1.5 select-none">
      <div
        className={cn(
          "inv-slot relative transition-all duration-150 cursor-pointer hover:scale-105 active:scale-95",
          isSelected && "border-solid border-candy-500 bg-candy-100 shadow-[0_3px_0_#3B2218]",
          className
        )}
        {...rest}
      >
        {rarity && (
          <span className="absolute top-1 right-1 text-[9px] px-1 py-0.2 bg-lemon text-choco-900 border border-choco-900 rounded font-pixel leading-none">
            {rarity}
          </span>
        )}
        {icon ? (
          <div className="flex items-center justify-center size-8">{icon}</div>
        ) : (
          <Sparkles className="size-5 text-choco-400 opacity-40" />
        )}
        <span className="text-xs font-pixel font-bold text-choco-600 mt-0.5">
          {typeof count === "number" ? `x${count}` : count}
        </span>
      </div>
      {label && (
        <span className="text-[11px] font-bold text-choco-900 font-sans text-center max-w-[76px] truncate">
          {label}
        </span>
      )}
    </div>
  );
};

export default InvSlot;
