import * as React from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

export type FeatureCardColor = "orange" | "purple" | "blue" | "emerald" | "rose" | "teal";

export interface AnimatedFeatureCardProps extends Omit<HTMLMotionProps<"div">, "title" | "children"> {
  /** The numerical index to display, e.g., "001" */
  index: string;
  /** The tag or category label */
  tag: string;
  /** The main title or description */
  title: React.ReactNode;
  /** The URL for the central image */
  imageSrc: string;
  /** The color variant which determines the gradient and tag color */
  color?: FeatureCardColor;
  /** Optional subtitle or description */
  blurb?: string;
  /** Optional badge shown next to tag or index (e.g. Selesai / Baru) */
  badge?: React.ReactNode;
  /** Optional footer content (e.g. XP, duration, CTA button) */
  footer?: React.ReactNode;
  /** Optional image alt text */
  imageAlt?: string;
  /** If the card represents locked content */
  isLocked?: boolean;
  /** Image badge label (e.g. "BUKTI"/"KISAH"). Hanya dirender kalau diisi eksplisit. */
  badgeLabel?: string;
  /** Optional children elements */
  children?: React.ReactNode;
}

/**
 * Palet kartu — SATU KARTU SATU WARNA (gaya kartu statistik `/profile`, DESIGN.md §9).
 *
 * Jebakan penamaan yang sudah ada dan SENGAJA tidak diubah (mengganti nama =
 * menyentuh 6 varian sekaligus tanpa manfaat): nilai `--feature-color-dark`
 * justru LEBIH TERANG dari `--feature-color-light`. Jadi gradien
 * `from-dark to-light` = terang di atas → lebih tua di bawah, persis arah
 * kartu statistik patokan.
 *
 * KONTRA S DIUKUR, bukan diduga (rumus WCAG, stop gradien TERGELAP = titik
 * terburuk karena judul & blurb duduk di paruh bawah kartu):
 *
 *   varian    ink/lama→light   ink/baru→light   ink/baru→dark
 *   orange         4.48 ✗           4.70 ✓          5.01
 *   purple         6.65 ✓           6.65 ✓          8.19
 *   blue           4.32 ✗           4.67 ✓          5.52
 *   emerald        4.19 ✗           4.70 ✓          5.06
 *   rose           4.49 ✗           4.67 ✓          5.57
 *   teal           4.28 ✗           4.70 ✓          5.02
 *
 * Langkah ini memindahkan teks ink ke atas SELURUH gradien (sebelumnya ink
 * hanya duduk di atas `--feature-color-dark` sebagai latar pill tag, dan di
 * sana keenam varian lolos 4.54–8.17:1). Begitu teks menyentuh stop BAWAH,
 * lima varian gagal AA (4.19–4.49). Perbaikannya BUKAN mengubah warna kartu,
 * melainkan menurunkan lightness `--feature-color-ink` 1–2 poin (tak kasat
 * mata, hue & saturasi tetap) sampai semua varian ≥ 4.67:1.
 */
const colorVariants: Record<FeatureCardColor, Record<string, string>> = {
  orange: {
    "--feature-color": "hsl(35, 91%, 50%)",
    "--feature-color-light": "hsl(41, 100%, 88%)",
    "--feature-color-dark": "hsl(38, 92%, 94%)",
    "--feature-color-border": "hsl(35, 85%, 45%)",
    "--feature-color-ink": "hsl(33, 90%, 32%)",
  },
  purple: {
    "--feature-color": "hsl(262, 85%, 58%)",
    "--feature-color-light": "hsl(261, 100%, 90%)",
    "--feature-color-dark": "hsl(264, 95%, 95%)",
    "--feature-color-border": "hsl(262, 75%, 48%)",
    "--feature-color-ink": "hsl(262, 85%, 40%)",
  },
  blue: {
    "--feature-color": "hsl(211, 100%, 55%)",
    "--feature-color-light": "hsl(210, 100%, 88%)",
    "--feature-color-dark": "hsl(216, 95%, 95%)",
    "--feature-color-border": "hsl(211, 90%, 45%)",
    "--feature-color-ink": "hsl(211, 90%, 38%)",
  },
  emerald: {
    "--feature-color": "hsl(158, 70%, 42%)",
    "--feature-color-light": "hsl(158, 80%, 88%)",
    "--feature-color-dark": "hsl(152, 85%, 94%)",
    "--feature-color-border": "hsl(158, 70%, 35%)",
    "--feature-color-ink": "hsl(158, 75%, 27%)",
  },
  rose: {
    "--feature-color": "hsl(340, 82%, 55%)",
    "--feature-color-light": "hsl(340, 100%, 90%)",
    "--feature-color-dark": "hsl(340, 95%, 95%)",
    "--feature-color-border": "hsl(340, 80%, 45%)",
    "--feature-color-ink": "hsl(340, 85%, 39%)",
  },
  teal: {
    "--feature-color": "hsl(173, 80%, 40%)",
    "--feature-color-light": "hsl(173, 85%, 88%)",
    "--feature-color-dark": "hsl(173, 90%, 94%)",
    "--feature-color-border": "hsl(173, 80%, 32%)",
    "--feature-color-ink": "hsl(173, 85%, 25.5%)",
  },
};

const AnimatedFeatureCard = React.forwardRef<HTMLDivElement, AnimatedFeatureCardProps>(
  (
    {
      className,
      index,
      tag,
      title,
      imageSrc,
      color = "orange",
      blurb,
      badge,
      footer,
      imageAlt,
      isLocked = false,
      badgeLabel,
      children,
      style,
      ...props
    },
    ref
  ) => {
    const cardVars = colorVariants[color] ?? colorVariants.orange;
    const cardStyle = { ...cardVars, ...style } as React.CSSProperties;

    const isEvidence =
      imageSrc.includes("/proof/") ||
      imageSrc.includes("/cases/") ||
      imageSrc.includes("/stories/") ||
      imageSrc.includes("/worlds/") ||
      imageSrc.endsWith(".jpg") ||
      imageSrc.endsWith(".jpeg") ||
      (imageSrc.endsWith(".png") && !imageSrc.includes("/props/"));

    return (
      <motion.div
        ref={ref}
        style={cardStyle}
        className={cn(
          // Satu kartu satu warna: gradien keluarga + border 2px sewarna + hard
          // slab sewarna. TANPA border/shadow cokelat, TANPA kotak putih di dalam.
          "group relative flex min-h-[380px] w-full flex-col gap-3 overflow-hidden rounded-2xl border-2 border-[var(--feature-color-border)] bg-gradient-to-b from-[var(--feature-color-dark)] to-[var(--feature-color-light)] p-4 shadow-[0_4px_0_var(--feature-color-ink)] select-none sm:min-h-[410px] sm:gap-3.5 sm:p-5",
          className
        )}
        whileHover={isLocked ? undefined : "hover"}
        initial="initial"
        variants={{ initial: { y: 0 }, hover: { y: -4 } }}
        transition={{ type: "spring", stiffness: 260, damping: 18 }}
        {...props}
      >
        {/* Baris atas: label "{index} · {tag}" warna ink di kiri, badge di kanan */}
        <div className="relative z-10 flex items-center justify-between gap-2">
          <span className="font-pixel text-xs font-bold tracking-wider text-[var(--feature-color-ink)] uppercase sm:text-sm">
            {index} · {tag}
          </span>
          {badge && <div className="flex shrink-0 items-center gap-1.5">{badge}</div>}
        </div>

        {/* Gambar: aspect 16/10 (terukur 1.6), radius `rounded-xl`, border sewarna.
            CATATAN SKALA: proyek ini meng-override skala radius Tailwind —
            `--radius-xl` = 28px dan `--radius-2xl` = 32px (bukan 12px/16px
            default). Screenshot pakai `object-top` supaya bagian atas tangkapan
            layar (judul/angka) yang terlihat, bukan potongan tengah. Props
            transparan pakai `object-contain` agar tidak terpotong. */}
        <div className="relative z-10 w-full shrink-0 overflow-hidden rounded-xl border-2 border-[var(--feature-color-border)] bg-[var(--feature-color-dark)]">
          <div className="aspect-[16/10] w-full">
            <img
              src={imageSrc}
              alt={imageAlt || tag}
              loading="lazy"
              className={cn(
                "h-full w-full transition-transform duration-300 group-hover:scale-[1.03]",
                isEvidence ? "object-cover object-top" : "object-contain p-3",
                // Terkunci = HANYA gambarnya yang grayscale. Kartu tetap berwarna.
                isLocked && "grayscale"
              )}
              decoding="async"
              onError={(e) => {
                const target = e.currentTarget;
                if (!target.src.endsWith("/props/star.png")) {
                  target.src = "/props/star.png";
                }
              }}
            />
          </div>
          {/* Chip di atas artwork: pola yang disahkan DESIGN.md §6.4 — transparan
              + teks putih + blur, TANPA border. Bukan "kotak putih".
              Hanya untuk gambar evidence (screenshot), sama seperti perilaku
              semula — props transparan tidak diberi chip. */}
          {isEvidence && (
            <div className="absolute top-2 right-2 rounded-md bg-choco-900/70 px-2 py-0.5 font-pixel text-[9px] font-bold text-white backdrop-blur-sm">
              {badgeLabel || (imageSrc.includes("/cases/") ? "BUKTI" : "KISAH")}
            </div>
          )}
        </div>

        {/* Judul + blurb, keduanya warna ink */}
        <div className="relative z-10 mt-auto flex flex-col gap-1.5">
          <div className="font-display line-clamp-2 text-sm leading-snug font-bold text-[var(--feature-color-ink)] sm:text-base">
            {title}
          </div>
          {blurb && (
            <p className="font-sans line-clamp-2 text-[11px] leading-relaxed font-medium text-[var(--feature-color-ink)] sm:text-xs">
              {blurb}
            </p>
          )}
        </div>

        {/* Children atau Custom Footer */}
        {children}
        {footer && (
          <div className="relative z-10 border-t-2 border-dashed border-[var(--feature-color-border)] pt-2">
            {footer}
          </div>
        )}
      </motion.div>
    );
  }
);

AnimatedFeatureCard.displayName = "AnimatedFeatureCard";

export { AnimatedFeatureCard };
export default AnimatedFeatureCard;
