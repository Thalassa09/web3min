import { Link } from "@tanstack/react-router";
import {
  ArrowsLeftRight,
  Briefcase,
  Gift,
  Image,
  Shield,
  UsersThree,
  Wallet,
  Wrench,
  type Icon,
} from "@/lib/kicon";
import { cn } from "@/lib/utils";

type PathChip = {
  unitId: string;
  label: string;
  hint: string;
  icon: Icon;
};

const PATHS: PathChip[] = [
  { unitId: "u5", label: "DeFi", hint: "Tukar, pinjam, dan kelola aset.", icon: ArrowsLeftRight },
  { unitId: "u20", label: "Kerja", hint: "Karier, bounty, dan kontribusi.", icon: Briefcase },
  { unitId: "u4", label: "NFT", hint: "Koleksi digital, karya, dan tiket.", icon: Image },
  { unitId: "u20", label: "DAO", hint: "Komunitas, voting, dan kas bersama.", icon: UsersThree },
  { unitId: "u2", label: "Dompet", hint: "Kunci, transaksi, dan keamanan.", icon: Wallet },
  { unitId: "u15", label: "Airdrop", hint: "Hadiah, syarat, dan risiko.", icon: Gift },
  { unitId: "u1", label: "Bikin", hint: "Kode, desain, dan dokumentasi.", icon: Wrench },
  { unitId: "u6", label: "Aman", hint: "Kenali scam dan lindungi aset.", icon: Shield },
];

export function Web3Map({ className, compact }: { className?: string; compact?: boolean }) {
  return (
    <section className={className}>
      <p className="text-sm font-medium text-primary">Bukan cuma trade</p>
      <h2 className={cn("font-bold leading-tight", compact ? "mt-0.5 text-base" : "mt-1 text-xl")}>
        Web3 itu banyak pintu
      </h2>
      <p className={cn("text-muted", compact ? "mt-0.5 text-sm" : "mt-1 text-base")}>
        Chart satu bagian. Ada DeFi, kerja, DAO, NFT, dan yang bikin. 20 rute.
      </p>
      <ul className={cn("mt-3 grid grid-cols-2 gap-2", compact ? "sm:grid-cols-2" : "sm:grid-cols-4")}>
        {PATHS.map((p) => {
          const Icon = p.icon;
          return (
            <li key={`${p.unitId}-${p.label}`}>
              <Link
                to="/"
                hash={`unit-${p.unitId}`}
                className="flex min-h-12 items-center gap-2 rounded-2xl bg-paper px-3 py-2"
              >
                <Icon className="size-5 shrink-0 text-primary" weight="bold" />
                <span className="min-w-0">
                  <span className="block text-sm font-bold leading-tight">{p.label}</span>
                  <span className="block truncate text-xs text-muted">{p.hint}</span>
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
