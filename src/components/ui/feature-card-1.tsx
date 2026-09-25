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
  /** Image badge label: defaults to "BUKTI" for /cases/ or "KISAH" for /stories/ */
  badgeLabel?: string;
  /** Optional children elements */
  children?: React.ReactNode;
}

// Define HSL color values for each variant
const colorVariants: Record<FeatureCardColor, Record<string, string>> = {
  orange: {
    "--feature-color": "hsl(35, 91%, 50%)",
    "--feature-color-light": "hsl(41, 100%, 88%)",
    "--feature-color-dark": "hsl(38, 92%, 94%)",
    "--feature-color-border": "hsl(35, 85%, 45%)",
  },
  purple: {
    "--feature-color": "hsl(262, 85%, 58%)",
    "--feature-color-light": "hsl(261, 100%, 90%)",
    "--feature-color-dark": "hsl(264, 95%, 95%)",
    "--feature-color-border": "hsl(262, 75%, 48%)",
  },
  blue: {
    "--feature-color": "hsl(211, 100%, 55%)",
    "--feature-color-light": "hsl(210, 100%, 88%)",
    "--feature-color-dark": "hsl(216, 95%, 95%)",
    "--feature-color-border": "hsl(211, 90%, 45%)",
  },
  emerald: {
    "--feature-color": "hsl(158, 70%, 42%)",
    "--feature-color-light": "hsl(158, 80%, 88%)",
    "--feature-color-dark": "hsl(152, 85%, 94%)",
    "--feature-color-border": "hsl(158, 70%, 35%)",
  },
  rose: {
    "--feature-color": "hsl(340, 82%, 55%)",
    "--feature-color-light": "hsl(340, 100%, 90%)",
    "--feature-color-dark": "hsl(340, 95%, 95%)",
    "--feature-color-border": "hsl(340, 80%, 45%)",
  },
  teal: {
    "--feature-color": "hsl(173, 80%, 40%)",
    "--feature-color-light": "hsl(173, 85%, 88%)",
    "--feature-color-dark": "hsl(173, 90%, 94%)",
    "--feature-color-border": "hsl(173, 80%, 32%)",
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
          "group relative flex min-h-[380px] sm:min-h-[410px] w-full flex-col justify-between overflow-hidden rounded-[26px] border-3 border-choco-900 bg-cream p-4 sm:p-5 shadow-[0_6px_0_#3B2218] transition-colors select-none",
          isLocked && "opacity-75 grayscale-[0.35]",
          className
        )}
        whileHover={isLocked ? undefined : "hover"}
        initial="initial"
        variants={{
          initial: { y: 0 },
          hover: {
            y: -6,
            boxShadow: "0 12px 0 #3B2218, 0 20px 25px -5px rgba(59, 34, 24, 0.15)",
          },
        }}
        transition={{ type: "spring", stiffness: 260, damping: 18 }}
        {...props}
      >
        {/* Ambient Top Background Radial Gradient */}
        <div
          className="pointer-events-none absolute inset-0 z-0 opacity-60 transition-opacity group-hover:opacity-80"
          style={{
            background:
              "radial-gradient(circle at 50% 25%, var(--feature-color-light) 0%, transparent 68%)",
          }}
        />

        {/* Subtle grid pattern background */}
        <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(#3B2218_1px,transparent_1px)] [background-size:16px_16px] opacity-[0.04]" />

        {/* Top Header: Index & Badge */}
        <div className="relative z-10 flex items-center justify-between gap-2">
          <span className="font-pixel text-xs sm:text-sm font-bold tracking-wider text-choco-900/80 bg-white/90 border-2 border-choco-900/18 px-2.5 py-1 rounded-xl shadow-[0_1.5px_0_#3B2218]">
            {index}
          </span>
          {badge && <div className="flex items-center gap-1.5">{badge}</div>}
        </div>

        {/* Central Asset / Proof Snapshot with Framer Motion Spring Zoom */}
        <motion.div
          className="relative z-10 my-auto flex w-full items-center justify-center py-2.5"
          variants={{
            initial: { scale: 1, y: 0 },
            hover: { scale: 1.05, y: -4 },
          }}
          transition={{ type: "spring", stiffness: 240, damping: 16 }}
        >
          {isEvidence ? (
            <div className="relative w-full max-w-[270px] h-32 sm:h-36 overflow-hidden rounded-2xl border-2 border-choco-900 bg-choco-50 shadow-[0_4px_0_#3B2218] transition-transform duration-300">
              <img
                src={imageSrc}
                alt={imageAlt || tag}
                loading="lazy"
                className="w-full h-full object-cover object-center filter brightness-[0.98] group-hover:brightness-105 group-hover:scale-105 transition-all duration-300"
                decoding="async"
                onError={(e) => {
                  const target = e.currentTarget;
                  if (!target.src.endsWith("/props/star.png")) {
                    target.src = "/props/star.png";
                  }
                }}
              />
              <div className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-choco-900/85 backdrop-blur-xs text-[9px] font-pixel font-bold text-white shadow-xs">
                {badgeLabel || (imageSrc.includes("/cases/") ? "BUKTI" : "KISAH")}
              </div>
            </div>
          ) : (
            <img
              src={imageSrc}
              alt={imageAlt || tag}
              loading="lazy"
              className="h-28 w-28 sm:h-36 sm:w-36 object-contain filter drop-shadow-[0_12px_18px_rgba(59,34,24,0.22)] transition-all"
              decoding="async"
              onError={(e) => {
                const target = e.currentTarget;
                if (!target.src.endsWith("/props/star.png")) {
                  target.src = "/props/star.png";
                }
              }}
            />
          )}
        </motion.div>

        {/* Bottom Frosted Tactile Content Box */}
        <div className="relative z-20 flex flex-col gap-2 rounded-2xl border-2 border-choco-900/18 bg-white/92 p-3.5 sm:p-4 backdrop-blur-md shadow-[0_3px_0_rgba(59,34,24,0.08)]">
          {/* Tag Pill */}
          <div className="flex items-center justify-between gap-2">
            <span
              className="inline-block rounded-lg border px-2.5 py-0.5 font-pixel text-[10px] sm:text-xs font-bold uppercase tracking-wider"
              style={{
                backgroundColor: "var(--feature-color-dark)",
                color: "var(--feature-color)",
                borderColor: "var(--feature-color-border)",
              }}
            >
              {tag}
            </span>
          </div>

          {/* Title */}
          <div className="font-display text-sm sm:text-base font-bold text-choco-900 leading-snug line-clamp-2 min-h-[2.5rem]">
            {title}
          </div>

          {/* Blurb */}
          {blurb && (
            <p className="font-sans text-[11px] sm:text-xs font-medium text-choco-600 line-clamp-2 leading-relaxed">
              {blurb}
            </p>
          )}

          {/* Children or Custom Footer */}
          {children}
          {footer && <div className="mt-1 pt-2 border-t-2 border-dashed border-choco-900/12">{footer}</div>}
        </div>
      </motion.div>
    );
  }
);

AnimatedFeatureCard.displayName = "AnimatedFeatureCard";

export { AnimatedFeatureCard };
export default AnimatedFeatureCard;
