import type { ReactNode } from "react";
import { Hexagon } from "@/lib/kicon";
import { Mascot } from "@/components/mascot";
import { cn } from "@/lib/utils";

/** Signature mark: a connected onchain block / learning stamp. */
export function BlockStamp({
  className,
  size = 16,
  lit = true,
}: {
  className?: string;
  size?: number;
  lit?: boolean;
}) {
  return (
    <Hexagon
      className={cn(lit ? "text-gold" : "text-faint", className)}
      weight={lit ? "fill" : "regular"}
      style={{ width: size, height: size }}
      aria-hidden
    />
  );
}

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
