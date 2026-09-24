import { useId, type ReactNode } from "react";
import { Mascot } from "@/components/mascot";
import { cn } from "@/lib/utils";

/** Tactile 3D Gold Coin Icon with arcade specular highlights & chocolate border */
export function CoinIcon({
  size = 18,
  className,
}: {
  size?: number;
  className?: string;
  lit?: boolean;
}) {
  const rawId = useId().replace(/[^a-zA-Z0-9]/g, "");
  const glowId = `coin-glow-${rawId}`;
  const rimId = `coin-rim-${rawId}`;

  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      className={cn("inline-block shrink-0 select-none", className)}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <radialGradient id={glowId} cx="35%" cy="30%" r="65%">
          <stop offset="0%" stopColor="#FFF9C4" />
          <stop offset="35%" stopColor="#FFD54F" />
          <stop offset="80%" stopColor="#FFA000" />
          <stop offset="100%" stopColor="#FF8F00" />
        </radialGradient>
        <linearGradient id={rimId} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FFFDE7" />
          <stop offset="100%" stopColor="#E65100" />
        </linearGradient>
      </defs>

      {/* Outer Coin Body with Bevel Border */}
      <circle
        cx="12"
        cy="12"
        r="9.5"
        fill={`url(#${glowId})`}
        stroke="#3B2218"
        strokeWidth="1.8"
      />

      {/* Inner Beveled Groove Rim */}
      <circle
        cx="12"
        cy="12"
        r="7.2"
        stroke={`url(#${rimId})`}
        strokeWidth="1.2"
        opacity="0.95"
      />

      {/* Specular Highlight Arc (Top Glint) */}
      <path
        d="M 6.8 9 A 6.2 6.2 0 0 1 17.2 9"
        stroke="#FFFFFF"
        strokeWidth="1.4"
        strokeLinecap="round"
        opacity="0.85"
      />

      {/* Center Coin Star Symbol (Double-layered 3D embossing) */}
      <polygon
        points="12,6.5 13.6,10.2 17.5,10.5 14.5,13.2 15.4,17 12,15 8.6,17 9.5,13.2 6.5,10.5 10.4,10.2"
        fill="#C43E00"
      />
      <polygon
        points="12,6.8 13.4,10.1 16.8,10.4 14.3,12.8 15.1,16.2 12,14.5 8.9,16.2 9.7,12.8 7.2,10.4 10.6,10.1"
        fill="#FFF59D"
      />
    </svg>
  );
}

/** Signature mark: alias to CoinIcon for learning currency / stamps */
export const BlockStamp = CoinIcon;

/** Connected blocks for daily / lesson progress. */
export function RouteChain({
  have,
  need,
  label,
}: {
  have: number;
  need: number;
  label?: string;
}) {
  const total = Math.min(10, Math.max(1, need));
  const filled = Math.round((Math.min(have, need) / Math.max(need, 1)) * total);
  return (
    <div className="flex items-center gap-2" role="img" aria-label={label ?? `${have} dari ${need}`}>
      <span className="flex items-center gap-0.5" aria-hidden>
        {Array.from({ length: total }, (_, i) => (
          <span key={i} className="flex items-center">
            <span className={cn("block-bit", i < filled && "block-bit-on")} />
            {i < total - 1 ? <span className={cn("block-link", i < filled - 1 && "block-link-on")} /> : null}
          </span>
        ))}
      </span>
      {label ? <span className="text-sm font-medium tabular-nums text-muted">{label}</span> : null}
    </div>
  );
}

export function EmptyGuide({
  title,
  body,
  action,
  mascot = false,
}: {
  title: string;
  body: string;
  action?: ReactNode;
  mascot?: boolean;
}) {
  return (
    <div className="flex flex-col items-center px-2 py-8 text-center">
      {mascot ? <Mascot mood="think" size={96} interactive={false} /> : <RouteChain have={0} need={4} />}
      <h2 className="mt-3 text-lg font-bold leading-snug">{title}</h2>
      <p className="mt-1 max-w-sm text-sm leading-5 text-muted">{body}</p>
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
}
