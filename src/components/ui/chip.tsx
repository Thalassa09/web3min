/**
 * `<Chip>` — komponen kanonik untuk chip/badge status (DESIGN.md §6).
 *
 * Kenapa ada: kontrak chip sudah punya GUARD (`src/lib/chip-contract.test.ts`)
 * sejak lama, tapi belum punya KOMPONEN — jadi 31 chip di 20+ berkas masih
 * ditulis tangan dengan resep yang diulang-ulang. Itu sumber drift: sebagian
 * chip memakai palet bawaan Tailwind (`emerald-*`, `amber-*`, `rose-*`) dan
 * sebagian memakai hex mentah yang tidak ada di `@theme` (`#0E7A46`).
 *
 * Resep di sini BUKAN karangan — `neutral` & `rose` disalin PERSIS dari chip
 * acuan yang sudah dipin guard (`src/routes/profile.tsx` baris 352 & 355):
 *   Level 2      → from-white to-[#FBE9DC]  border-choco-900  slab #3B2218  text-choco-900
 *   Murid Blobi  → from-blush-50 to-blush-200  border-candy-600  slab #B01F62  text-choco-900
 *
 * Empat aturan keras (DESIGN.md §6.2) yang otomatis dipatuhi:
 *   A. bentuk stadium penuh  → `rounded-full`
 *   B. border SOLID sefamili → warna border == warna slab
 *   C. hard slab blur nol    → `shadow-[0_2px_0_<slab>]`
 *   D. teks tebal, putih HANYA di atas ramp gelap (danger)
 *
 * Tone `gold`/`mint`/`warning` memakai token Web3min yang SUDAH ada di `@theme`
 * (lemon, ok-*, warn-*) — bukan palet Tailwind bawaan — supaya chip baru tidak
 * menambah drift yang sudah tercatat di DESIGN-SYSTEM.md §Colors.
 *
 * Chip bersifat NON-interaktif (render `<span>`). Kalau perlu diklik, bungkus
 * dengan `<button>` dan perluas area sentuh ke 44px — lihat DESIGN.md §6.4.
 */
import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

const chip = cva(
  [
    "inline-flex items-center gap-1.5 whitespace-nowrap",
    "rounded-full border-2",
    "px-2.5 py-0.5 text-xs font-bold",
    "transition-[transform,box-shadow] duration-100 ease-out motion-reduce:transition-none",
  ],
  {
    variants: {
      /**
       * Tone = keluarga warna. Border SELALU sama dengan slab (aturan B & C).
       * Hex diambil dari token `@theme`; dua tone pertama disalin dari chip
       * acuan supaya nol perubahan visual.
       */
      tone: {
        /** Netral — `Level 2`, hitungan blok. Acuan: profile.tsx:352 */
        neutral: "bg-gradient-to-b from-white to-[#FBE9DC] border-choco-900 text-choco-900 shadow-[0_2px_0_#3B2218]",
        /** Rose — `Murid Blobi`, penanda undian. Acuan: profile.tsx:355 */
        rose: "bg-gradient-to-b from-blush-50 to-blush-200 border-candy-600 text-choco-900 shadow-[0_2px_0_#B01F62]",
        /** Gold — peringkat, hadiah liga, koin. Token `lemon` + slab choco. */
        gold: "bg-lemon border-choco-900 text-choco-900 shadow-[0_2px_0_#3B2218]",
        /** Mint / lulus — status selesai, aman on-chain. Token `ok-*`. */
        mint: "bg-ok-soft border-ok-ink text-ok-ink shadow-[0_2px_0_#0F6045]",
        /** Warning — menunggu verifikasi. Token `warn-*`. */
        warning: "bg-warn-soft border-warn-ink text-warn-ink shadow-[0_2px_0_#8A6100]",
        /** Danger — gagal/ditolak. Teks putih di atas ramp gelap (aturan D). */
        danger: "bg-candy-800 border-choco-900 text-white shadow-[0_2px_0_#3B2218]",
      },
    },
    defaultVariants: { tone: "neutral" },
  },
);

export type ChipProps = ComponentProps<"span"> & VariantProps<typeof chip>;

export function Chip({ tone, className, ...props }: ChipProps) {
  return <span className={cn(chip({ tone }), className)} {...props} />;
}

export { chip as chipVariants };
