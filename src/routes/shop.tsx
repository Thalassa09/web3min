import { Storefront } from "@/lib/kicon";
import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { Dialog } from "@/components/dialog";
import { DuoButton } from "@/components/duo-button";
import { Mascot } from "@/components/mascot";
import { BlockStamp } from "@/components/motif";
import { ACCESSORIES, SLOT_LABEL, SLOTS, type Accessory, type AccessorySlot, type Worn } from "@/lib/accessories";
import { playBuy, playDeny, playEquip, playFreeze, playUnequip } from "@/lib/audio";
import { FREEZE_COST, HEART_REFILL_COST } from "@/lib/shop";
import { MAX_HEARTS, UNLIMITED_GEMS, formatGems, useProgress } from "@/lib/store";

export const Route = createFileRoute("/shop")({ component: ShopPage });

function ShopPage() {
  const gems = useProgress((s) => s.gems);
  const outfits = useProgress((s) => s.outfits);
  const worn = useProgress((s) => s.worn);
  const hearts = useProgress((s) => s.hearts);
  const buyOutfit = useProgress((s) => s.buyOutfit);
  const buyFreeze = useProgress((s) => s.buyFreeze);
  const refillHearts = useProgress((s) => s.refillHearts);
  const equipOutfit = useProgress((s) => s.equipOutfit);
  const freeze = useProgress((s) => s.streakFreeze);
  const raffleTickets = useProgress((s) => s.raffleTickets ?? 0);
  const buyRaffleTicketsWithGems = useProgress((s) => s.buyRaffleTicketsWithGems);
  const [slot, setSlot] = useState<AccessorySlot | "all">("all");
  const [preview, setPreview] = useState<string | null>(null);
  const [confirm, setConfirm] = useState<Accessory | null>(null);
  const [note, setNote] = useState<string | null>(null);

  const shown = useMemo(
    () => (slot === "all" ? ACCESSORIES : ACCESSORIES.filter((a) => a.slot === slot)),
    [slot],
  );

  const previewWorn: Worn = useMemo(() => {
    if (!preview && !confirm) return worn;
    const id = confirm?.id ?? preview;
    const acc = ACCESSORIES.find((a) => a.id === id);
    if (!acc) return worn;
    return { ...worn, [acc.slot]: acc.id };
  }, [preview, confirm, worn]);

  const heartsFull = hearts >= MAX_HEARTS;
  const heartShort = HEART_REFILL_COST - gems;
  const freezeShort = FREEZE_COST - gems;

  function flash(msg: string) {
    setNote(msg);
    window.setTimeout(() => setNote(null), 4000);
  }

  function purchase(acc: Accessory) {
    if (buyOutfit(acc.id)) {
      playBuy();
      setConfirm(null);
                  flash("Item berhasil dibeli.");
    } else {
      playDeny();
    }
  }

  return (
    <AppShell>
      <main className="px-4 py-5 lg:grid lg:grid-cols-[260px_1fr] lg:items-start lg:gap-8 lg:px-6">
        <div className="flex flex-col items-center text-center lg:sticky lg:top-16">
          <p className="flex items-center gap-1.5 text-sm font-medium text-primary">
            <Storefront className="size-3.5" weight="fill" />
            Toko
          </p>
          <div className="mt-2">
            <Mascot mood="wave" size={180} worn={previewWorn} />
          </div>
          <h1 className="mt-1 text-[28px] font-extrabold leading-[34px]">Gaya web3min</h1>
          <p className="mt-1 flex items-center justify-center gap-1.5 text-base font-medium text-muted">
            <BlockStamp size={16} />
            {formatGems(gems)} bintang · {freeze} pelindung streak
          </p>
          <p className="mt-2 text-sm leading-5 text-muted">
            Dapatkan bintang dengan menyelesaikan pelajaran, misi harian, dan kisah.
          </p>
        </div>

        <div>

        {note ? (
          <p className="mt-3 rounded-2xl bg-primary-soft px-3 py-2 text-center text-sm font-medium text-primary-deep" role="status" aria-live="polite">
            {note}
          </p>
        ) : null}

        <h2 className="mt-6 text-sm font-extrabold">Perlengkapan</h2>
        <ul className="mt-2 flex flex-col gap-2">
          <li className="surface flex items-start gap-3 p-4 border-[#00f59b]/30">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-[#00f59b]">Tiket Undian Web3 (Raffle)</h3>
                <span className="rounded-xs bg-[#00f59b]/10 border border-[#00f59b]/30 px-1.5 py-0.5 font-mono text-[10px] font-black uppercase text-[#00f59b]">
                  HOT
                </span>
              </div>
              <p className="mt-1 text-sm text-muted">
                Gunakan untuk mengikuti undian berhadiah USDT, Whitelist GTD, dan Hardware Wallet di Hub Raffle.
              </p>
              <p className="mt-1 flex items-center gap-1 text-sm font-extrabold text-gold">
                <BlockStamp size={14} /> 10 bintang / tiket
              </p>
              <p className="mt-1 font-mono text-xs text-[#00f59b]">
                Tiket saat ini: {raffleTickets} Tiket
              </p>
              {!UNLIMITED_GEMS && gems < 10 ? (
                <p className="mt-1 text-sm font-bold text-blob">Kurang {10 - gems} bintang</p>
              ) : null}
            </div>
            <DuoButton
              size="sm"
              disabled={!UNLIMITED_GEMS && gems < 10}
              onClick={() => {
                if (buyRaffleTicketsWithGems(1)) {
                  playBuy();
                  flash("1 Tiket Undian berhasil dibeli! Cek di menu Raffle.");
                } else playDeny();
              }}
            >
              Beli Tiket
            </DuoButton>
          </li>
          <li className="surface flex items-start gap-3 p-4">
            <div className="min-w-0 flex-1">
              <h3 className="font-extrabold">Pulihkan nyawa</h3>
              <p className="mt-1 text-sm font-bold text-muted">Nyawamu langsung kembali penuh.</p>
              <p className="mt-1 flex items-center gap-1 text-sm font-extrabold text-gold">
                <BlockStamp size={14} /> {HEART_REFILL_COST} bintang
              </p>
              {heartsFull ? <p className="mt-1 text-sm font-bold text-muted">Nyawa sudah penuh</p> : null}
              {!heartsFull && !UNLIMITED_GEMS && gems < HEART_REFILL_COST ? (
                <p className="mt-1 text-sm font-bold text-blob">Kurang {heartShort} bintang</p>
              ) : null}
            </div>
            <DuoButton
              size="sm"
              disabled={heartsFull || (!UNLIMITED_GEMS && gems < HEART_REFILL_COST)}
              onClick={() => {
                if (refillHearts()) {
                  playBuy();
                  flash("Nyawa sudah dipulihkan.");
                } else playDeny();
              }}
            >
              Pulihkan
            </DuoButton>
          </li>
          <li className="surface flex items-start gap-3 p-4">
            <div className="min-w-0 flex-1">
              <h3 className="font-extrabold">Pelindung streak</h3>
              <p className="mt-1 text-sm text-muted">Lindungi streak ketika kamu melewatkan satu hari. Dipakai otomatis.</p>
              <p className="mt-1 flex items-center gap-1 text-sm font-extrabold text-gold">
                <BlockStamp size={14} /> {FREEZE_COST} bintang
              </p>
              {!UNLIMITED_GEMS && gems < FREEZE_COST ? <p className="mt-1 text-sm font-bold text-blob">Kurang {freezeShort} bintang</p> : null}
            </div>
            <DuoButton
              size="sm"
              disabled={!UNLIMITED_GEMS && gems < FREEZE_COST}
              onClick={() => {
                if (buyFreeze()) {
                  playFreeze();
                  flash("Pelindung streak ditambah.");
                } else playDeny();
              }}
            >
              Beli
            </DuoButton>
          </li>
        </ul>

        <h2 className="mt-6 text-sm font-extrabold">Aksesori</h2>
        <div className="mt-2 flex gap-2 overflow-x-auto pb-1">
          <SlotChip active={slot === "all"} onClick={() => setSlot("all")}>
            Semua
          </SlotChip>
          {SLOTS.map((s) => (
            <SlotChip key={s} active={slot === s} onClick={() => setSlot(s)}>
              {SLOT_LABEL[s]}
            </SlotChip>
          ))}
        </div>

        <ul className="mt-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {shown.map((acc) => {
            const owned = outfits.includes(acc.id);
            const on = worn[acc.slot] === acc.id;
            const short = acc.cost - gems;
            return (
              <li
                key={acc.id}
                className="surface flex flex-col overflow-hidden p-3 [content-visibility:auto] [contain-intrinsic-size:240px]"
                onMouseEnter={() => setPreview(acc.id)}
                onMouseLeave={() => setPreview(null)}
              >
                <button type="button" className="flex justify-center" onClick={() => setPreview(acc.id)} aria-label={`Preview ${acc.name}`}>
                  <Mascot mood="idle" size={88} lite worn={{ [acc.slot]: acc.id }} />
                </button>
                <p className="mt-1 text-xs font-bold text-muted">{SLOT_LABEL[acc.slot]}</p>
                <h3 className="font-extrabold leading-tight">{acc.name}</h3>
                {owned ? (
                  <p className="mt-1 text-xs font-bold text-primary">{on ? "Sedang dipakai" : "Punya"}</p>
                ) : (
                  <p className="mt-1 flex items-center gap-1 text-xs font-extrabold text-gold">
                    <BlockStamp size={12} /> {acc.cost} bintang
                  </p>
                )}
                <div className="mt-2">
                  {owned ? (
                    <DuoButton
                      size="sm"
                      wide
                      variant={on ? "ghost" : "white"}
                      onClick={() => {
                        equipOutfit(acc.id);
                        if (on) playUnequip();
                        else playEquip();
                      }}
                    >
                      {on ? "Lepas" : "Pakai sekarang"}
                    </DuoButton>
                  ) : !UNLIMITED_GEMS && gems < acc.cost ? (
                    <div className="mt-auto">
                      <DuoButton size="sm" wide disabled>
                        Kurang {short} bintang
                      </DuoButton>
                      <Link to="/" className="mt-1 block truncate text-center text-sm font-bold text-primary">
                        Dapatkan bintang
                      </Link>
                    </div>
                  ) : (
                    <DuoButton size="sm" wide onClick={() => setConfirm(acc)}>
                      Beli item
                    </DuoButton>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </div>
      </main>

      <Dialog
        open={Boolean(confirm)}
        title={confirm ? `Beli ${confirm.name}?` : "Beli item"}
        description={
          confirm
            ? UNLIMITED_GEMS
              ? `Harga ${confirm.cost} bintang. Saldo unlimited, tidak terpotong.`
              : `Harga ${confirm.cost} bintang. Saldo setelah membeli: ${gems - confirm.cost} bintang.`
            : undefined
        }
        onClose={() => setConfirm(null)}
      >
        <div className="mt-4 flex gap-2">
          <DuoButton variant="ghost" className="flex-1" onClick={() => setConfirm(null)}>
            Batal
          </DuoButton>
          <DuoButton className="flex-1" onClick={() => confirm && purchase(confirm)}>
            Beli
          </DuoButton>
        </div>
      </Dialog>
    </AppShell>
  );
}

function SlotChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        active
          ? "min-h-11 shrink-0 rounded-full bg-primary px-4 text-sm font-extrabold text-primary-ink"
          : "min-h-11 shrink-0 rounded-full bg-paper px-4 text-sm font-bold text-muted"
      }
    >
      {children}
    </button>
  );
}
