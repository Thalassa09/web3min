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
  /** Label untuk screen reader, mis. "Pilih kategori toko". */
  "aria-label"?: string;
}

/**
 * SegmentedNav — pill dock sub-navigasi (DESIGN.md §5).
 *
 * Bentuk visual diselaraskan dengan 7 pill dock NYATA di repo (kisah.index,
 * raffle, profile, shop ×2, leaderboard) yang selama ini ditulis manual:
 *   container  : rounded-2xl border-2 border-choco-900/20 + gradien krem + slab 4px
 *   tab aktif  : rounded-xl + gradien candy-700→candy-900 + teks putih + slab 2px
 *   tab diam   : rounded-xl border-transparent (biar layout tidak bergeser)
 *
 * Perbedaan penting dari versi lama (yang nol pemakai):
 *   - `rounded-[16px]`/`rounded-[12px]` → `rounded-2xl`/`rounded-xl` (token skala)
 *   - container `bg-candy-100` → gradien krem (samakan dgn dock nyata)
 *   - TAMBAH `role="tablist"` + `role="tab"` + `aria-selected` supaya status tab
 *     tidak disampaikan lewat WARNA saja (WCAG 1.4.1). Versi lama hanya
 *     mengandalkan kelas aktif.
 *   - TAMBAH `aria-label` opsional — dock tanpa judul membingungkan screen reader.
 *   - TAMBAH `focus-visible:outline-*` (WCAG 2.4.7) — versi lama tidak punya.
 *   - TAMBAH `motion-reduce:transition-none` (DESIGN-SYSTEM §Animations).
 *   - Tab wajib `min-h-11` (44px, AGENTS.md Mobile #2) — versi lama `py-2` saja.
 */
export function SegmentedNav({
  items,
  activeId,
  onChange,
  className = "",
  "aria-label": ariaLabel,
}: SegmentedNavProps) {
  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      className={`inline-flex items-center gap-1.5 p-1.5 rounded-2xl border-2 border-choco-900/20 bg-gradient-to-b from-white via-cream-fill to-cream-fill-deep shadow-[0_4px_0_#3B2218] ${className}`}
    >
      {items.map((item) => {
        const isActive = item.id === activeId;
        return (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(item.id)}
            className={`
              relative inline-flex min-h-11 flex-1 items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-pixel font-bold
              transition-[transform,box-shadow,background-color,border-color,color] duration-150 ease-out
              motion-reduce:transition-none
              focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-candy-600
              active:translate-y-[1px]
              ${
                isActive
                  ? "border-2 border-candy-600 bg-gradient-to-b from-blush-50 to-blush-200 text-choco-900 shadow-[0_3px_0_#B01F62] hover:brightness-105 hover:-translate-y-0.5 active:translate-y-[3px] active:shadow-none"
                  : "border-2 border-transparent text-choco-600 hover:text-choco-900 hover:bg-candy-50"
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
                    : "bg-cream text-choco-600 border-2 border-choco-900/30"
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
