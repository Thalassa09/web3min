import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { Ticket } from "lucide-react";
import { Fire, Heart } from "@/lib/kicon";
import { BrandMark } from "@/components/brand-mark";
import { BlockStamp } from "@/components/motif";
import { MAX_HEARTS, formatGems, useProgress } from "@/lib/store";
import { cn } from "@/lib/utils";

export function TopStatus({ brand = true }: { brand?: boolean }) {
  const streak = useProgress((s) => s.streak);
  const gems = useProgress((s) => s.gems);
  const hearts = useProgress((s) => s.hearts);
  const raffleTickets = useProgress((s) => s.raffleTickets ?? 0);

  return (
    <header className="status-bar">
      {brand ? <BrandMark className="mr-auto min-w-0 lg:hidden" /> : <span className="mr-auto" />}
      <span className="mr-auto hidden lg:block" />
      <Stat icon={<Fire className="size-4" weight="fill" />} value={streak} label="Streak" className="text-streak" />
      <Stat icon={<BlockStamp size={16} />} value={formatGems(gems)} label="Bintang" className="text-gold" />
      <Link to="/leaderboard" className="no-underline">
        <Stat
          icon={<Ticket className="size-4" />}
          value={raffleTickets}
          label="Tiket Raffle"
          className="text-[#00f59b] hover:border-[#00f59b]/40 cursor-pointer"
        />
      </Link>
      <Stat
        icon={<Heart className="size-4" weight="fill" />}
        value={`${hearts}/${MAX_HEARTS}`}
        label="Nyawa"
        className="text-blob"
        mark="hearts"
      />
    </header>
  );
}

function Stat({
  icon,
  value,
  label,
  className,
  mark,
}: {
  icon: ReactNode;
  value: number | string;
  label: string;
  className?: string;
  mark?: string;
}) {
  return (
    <div
      className={cn("hud-chip font-extrabold tabular-nums", className)}
      title={label}
      aria-label={`${label} ${value}`}
      data-coach={mark}
    >
      {icon}
      <span className="text-sm text-fg">{value}</span>
    </div>
  );
}
