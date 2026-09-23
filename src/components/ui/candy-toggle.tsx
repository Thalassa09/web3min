import React from "react";
import { cn } from "@/lib/utils";
import { playTap } from "@/lib/audio";

export interface CandyToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  description?: string;
  disabled?: boolean;
}

/**
 * CandyToggle Component
 * Interactive toggle switch with tactile gummy knob and 3px choco border.
 */
export const CandyToggle: React.FC<CandyToggleProps> = ({
  checked,
  onChange,
  label,
  description,
  disabled = false,
}) => {
  const handleToggle = () => {
    if (disabled) return;
    try {
      playTap();
    } catch {
      // ignore
    }
    onChange(!checked);
  };

  return (
    <div
      role="switch"
      aria-checked={checked}
      tabIndex={disabled ? -1 : 0}
      onClick={handleToggle}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleToggle();
        }
      }}
      className={cn(
        "flex items-center justify-between gap-4 p-3 rounded-2xl cursor-pointer select-none transition-colors",
        disabled && "opacity-50 cursor-not-allowed"
      )}
    >
      {(label || description) && (
        <div className="flex flex-col">
          {label && <span className="font-pixel text-sm font-bold text-choco-900">{label}</span>}
          {description && <span className="font-sans text-xs font-semibold text-choco-600">{description}</span>}
        </div>
      )}

      {/* Switch track */}
      <div
        className={cn(
          "relative w-14 h-8 rounded-full border-[3px] border-choco-900 transition-colors duration-150 shadow-[inset_0_2px_4px_rgba(0,0,0,0.15)]",
          checked ? "bg-mint" : "bg-candy-100"
        )}
      >
        {/* Knob */}
        <div
          className={cn(
            "absolute top-0.5 size-5.5 rounded-full border-2 border-choco-900 shadow-[0_2px_0_#3B2218] transition-transform duration-150 flex items-center justify-center",
            checked
              ? "translate-x-6.5 bg-white text-mint-deep"
              : "translate-x-0.5 bg-white text-choco-600"
          )}
        >
          <span className="text-[10px] font-pixel font-bold">
            {checked ? "ON" : "OFF"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default CandyToggle;
