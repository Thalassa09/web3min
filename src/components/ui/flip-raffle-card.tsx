"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { RotateCcw } from "lucide-react";

/**
 * Kartu undian yang bisa dibalik (flip) — turunan `card-14` yang diadaptasi ke
 * kontrak Soft Neo-Brutalism (DESIGN-SYSTEM.md).
 *
 * Kenapa ada komponen ini, bukan pakai `PerspectiveFlipCard` langsung:
 * `PerspectiveFlipCard` bawaan `card-14` mengandalkan `group-hover/p-card`.
 * Di HP tidak ada hover, jadi `card-14` akan mati total di perangkat sentuh —
 * mayoritas pengguna web3min (AGENTS.md: "Mayoritas user dari HP").
 * Karena itu komponen ini memakai STATE eksplisit:
 *   - tap/klik di mana saja pada kartu membalik sisi (bekerja di HP & desktop)
 *   - hover di desktop juga membalik, sebagai bonus
 *   - tombol "Balik" memberi afordans yang jelas bahwa kartu punya dua sisi
 * Tinggi kartu dipatok (`h`) supaya muka depan & belakang sama tinggi — tanpa
 * ini, salah satu sisi akan terpotong karena keduanya `position: absolute`.
 */
interface FlipRaffleCardProps {
  front: React.ReactNode;
  back: React.ReactNode;
  /** true = sisi belakang terlihat. Dikontrol pemanggil agar bisa per-kartu. */
  flipped: boolean;
  onToggle: () => void;
  /** Kelas tinggi kartu, mis. "h-[640px]". Wajib — kedua sisi absolut. */
  h?: string;
  className?: string;
}

export function FlipRaffleCard({
  front,
  back,
  flipped,
  onToggle,
  h = "h-[620px] sm:h-[600px]",
  className,
}: FlipRaffleCardProps) {
  return (
    <div
      className={cn("group/raffle-card w-full [perspective:2000px]", h, className)}
      data-raffle-card
      data-flipped={flipped ? "true" : "false"}
      onClick={() => onToggle()}
      role="button"
      tabIndex={0}
      aria-label={flipped ? "Balik ke tampilan depan" : "Balik untuk lihat detail"}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onToggle();
        }
      }}
    >
      <div
        className={cn(
          "relative h-full w-full transition-transform duration-700 [transform-style:preserve-3d]",
          flipped && "[transform:rotateY(180deg)]",
        )}
      >
        {/* ── Sisi depan: gambar + judul + hadiah + statistik + CTA ── */}
        <div
          className="absolute inset-0 size-full rounded-3xl border-2 border-choco-900 bg-gradient-to-b from-white via-[#FFF9F5] to-[#FDEEE4] shadow-[0_6px_0_#3B2218] [transform-style:preserve-3d] [backface-visibility:hidden] overflow-hidden"
          aria-hidden={flipped}
        >
          {front}
        </div>

        {/* ── Sisi belakang: detail slot / mint / perks ── */}
        <div
          className="absolute inset-0 size-full rounded-3xl border-2 border-choco-900 bg-gradient-to-b from-[#FFF9F5] via-white to-[#FFF9F5] p-4 md:p-5 shadow-[0_6px_0_#3B2218] [transform-style:preserve-3d] [backface-visibility:hidden] [transform:rotateY(180deg)] overflow-hidden"
          aria-hidden={!flipped}
        >
          {back}
        </div>
      </div>
    </div>
  );
}

/**
 * Tombol pembalik yang dipakai di kedua sisi. Ikon berputar 180° saat aktif
 * supaya arah balik terbaca tanpa teks tambahan.
 */
export function FlipToggle({
  flipped,
  onClick,
  label,
}: {
  flipped: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className="relative inline-flex items-center justify-center gap-1 rounded-full border-2 border-choco-900 bg-white px-3 h-6 text-[10px] font-pixel font-bold text-choco-700 shadow-[0_2px_0_#3B2218] hover:bg-cream active:translate-y-[1px] active:shadow-none transition-all shrink-0 before:absolute before:-inset-y-[10px] before:inset-x-0 before:content-['']"
      aria-label={label}
    >
      <RotateCcw
        className={cn("size-3 transition-transform duration-300", flipped && "rotate-180")}
      />
      <span>{flipped ? "Depan" : "Detail"}</span>
    </button>
  );
}
