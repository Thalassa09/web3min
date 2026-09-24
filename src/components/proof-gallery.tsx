import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import { proofsById, TONE_UI, type Proof } from "@/lib/proof";

export const AIRDROP_IDS = ["drop-arb-18k", "drop-met-34k", "drop-wif-1k5", "drop-uni-400"] as const;

export function AirdropWall({ compact, className }: { compact?: boolean; className?: string }) {
  const ids = compact ? AIRDROP_IDS.slice(0, 2) : AIRDROP_IDS;
  return (
    <section className={className}>
      <p className="mb-2 text-sm font-medium text-primary">Contoh airdrop</p>
      <ProofGallery ids={[...ids]} compact={compact} />
      <Link
        to="/kisah/$storyId"
        params={{ storyId: "s-drop-cuan" }}
        className="mt-2 inline-block text-xs font-extrabold uppercase tracking-label text-primary"
      >
        Baca kisahnya
      </Link>
    </section>
  );
}

export function ProofGallery({
  ids,
  className,
  compact,
}: {
  ids: string[];
  className?: string;
  compact?: boolean;
}) {
  const items = proofsById(ids);
  if (items.length === 0) return null;
  return (
    <div className={cn("grid grid-cols-2 gap-2 lg:grid-cols-4", compact && "lg:grid-cols-2", className)}>
      {items.map((item) => (
        <ProofCard key={item.id} proof={item} compact={compact} />
      ))}
    </div>
  );
}

export function QuizClip({ ids }: { ids?: string[] }) {
  if (!ids?.length) return null;
  const items = proofsById(ids);
  if (items.length === 0) return null;
  if (items.length === 1) {
    const proof = items[0];
    if (!proof) return null;
    return <ProofHero proof={proof} />;
  }
  return <ProofGallery ids={ids.slice(0, 2)} compact className="mt-3" />;
}

export function ProofHero({ proof }: { proof: Proof }) {
  const tone = TONE_UI[proof.tone];
  return (
    <figure className={cn("mt-3 overflow-hidden rounded-2xl border-2 border-b-4 bg-bg", tone.border)}>
      <img src={proof.src} alt="" className="proof-shot h-36 w-full object-cover object-top lg:h-48" />
      <figcaption className="flex items-end justify-between gap-2 px-3 py-2">
        <div className="min-w-0">
          <p className={cn("text-[10px] font-extrabold uppercase tracking-label", tone.text)}>{tone.label}</p>
          <p className="text-sm font-extrabold leading-tight">{proof.value}</p>
        </div>
        <p className="max-w-[55%] truncate text-right text-xs font-bold text-muted">{proof.cap}</p>
      </figcaption>
    </figure>
  );
}

export function ProofCard({ proof, compact }: { proof: Proof; compact?: boolean }) {
  const tone = TONE_UI[proof.tone];
  return (
    <figure className={cn("overflow-hidden rounded-2xl border-2 border-b-4 bg-bg", tone.border)}>
      <img
        src={proof.src}
        alt=""
        className={cn("w-full object-cover object-top", compact ? "h-20 lg:h-28" : "h-28 lg:h-36")}
      />
      <figcaption className={cn("px-2", compact ? "py-1.5" : "py-2")}>
        <p className={cn("text-xs font-extrabold uppercase tracking-label", tone.text)}>{tone.label}</p>
        <p className="text-sm font-extrabold tabular-nums leading-tight">{proof.value}</p>
        <p className="truncate text-xs font-bold text-muted">{proof.cap}</p>
        {compact ? null : (
          <div className="mt-0.5">
            <p className="truncate text-[10px] font-bold text-faint">{proof.via}</p>
            {proof.via?.toLowerCase().startsWith("x") && (
              <p className="text-[9px] font-semibold text-choco-600/70 italic leading-tight truncate">
                Unggahan publik, belum diverifikasi.
              </p>
            )}
          </div>
        )}
      </figcaption>
    </figure>
  );
}
