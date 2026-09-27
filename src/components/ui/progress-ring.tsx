import { cn } from "@/lib/utils";

/**
 * Cincin progres melingkar.
 *
 * Diambil dari pola kartu "sedang dipelajari" pada referensi desain user
 * (kartu ringkas + cincin 43% + tiga kartu statistik). Yang diadopsi hanya
 * STRUKTUR-nya — cincin SVG ber-`stroke-dasharray` dengan label persen di
 * tengah. Skinningya tetap web3min: track memakai `choco-100`, busur memakai
 * `candy-500` (pink brand), label `choco-900`.
 *
 * Catatan penting: referensi itu memakai busur gradien ungu (#D8B4FE → #A855F7)
 * dan track putih transparan. Itu TIDAK diadopsi — warnanya di luar palet
 * (`@theme` tidak punya lavender) dan akan melanggar aturan "pakai warna yang
 * sudah ada di kode".
 *
 * Aksesibilitas: cincin ini dekoratif KALAU `label` ditampilkan (angkanya sudah
 * terbaca). Karena itu `<svg>` diberi `aria-hidden` dan teksnya yang diumumkan.
 * Kalau `showLabel={false}`, `aria-label` wajib diisi supaya angkanya tidak
 * hilang untuk pembaca layar.
 */
export function ProgressRing({
  value,
  size = 76,
  stroke = 8,
  showLabel = true,
  label,
  className,
}: {
  /** 0..100 */
  value: number;
  size?: number;
  stroke?: number;
  showLabel?: boolean;
  /** Wajib kalau `showLabel={false}` — angkanya harus tetap terbaca. */
  label?: string;
  className?: string;
}) {
  const pct = Math.max(0, Math.min(100, Math.round(value)));
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const dash = (pct / 100) * c;

  return (
    <div
      className={cn("relative shrink-0", className)}
      style={{ width: size, height: size }}
      role="img"
      aria-label={label ?? `Progres ${pct} persen`}
    >
      <svg width={size} height={size} aria-hidden="true" className="-rotate-90">
        {/* Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="var(--color-choco-100)"
          strokeWidth={stroke}
        />
        {/* Busur progres */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="var(--color-candy-500)"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${dash} ${c - dash}`}
        />
      </svg>
      {showLabel && (
        <span className="absolute inset-0 grid place-items-center font-pixel text-sm font-bold text-choco-900 tabular-nums">
          {pct}%
        </span>
      )}
    </div>
  );
}
