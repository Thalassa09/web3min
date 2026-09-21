import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Ticket, ShieldCheck, Heart, ArrowRight, Check } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Dialog } from "@/components/dialog";
import { Mascot } from "@/components/mascot";
import { BlockStamp } from "@/components/motif";
import { ACCESSORIES, SLOT_LABEL, SLOTS, type Accessory, type AccessorySlot, type Worn } from "@/lib/accessories";
import { playBuy, playDeny, playEquip, playFreeze, playUnequip } from "@/lib/audio";
import { FREEZE_COST, HEART_REFILL_COST } from "@/lib/shop";
import { MAX_HEARTS, UNLIMITED_GEMS, formatGems, useProgress } from "@/lib/store";
import { SurfaceCard } from "@/components/ui/surface-card";
import { TactileButton } from "@/components/ui/tactile-button";

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
    window.setTimeout(() => setNote(null), 3500);
  }

  function purchase(acc: Accessory) {
    if (buyOutfit(acc.id)) {
      playBuy();
      setConfirm(null);
      flash(`"${acc.name}" berhasil dibeli!`);
    } else {
      playDeny();
    }
  }

  return (
    <AppShell>
      <main className="px-4 py-6 max-w-6xl mx-auto space-y-6">
        {/* Flash Notification */}
        {note && (
          <div className="p-3.5 rounded-[14px] bg-[#00f59b]/10 border border-[#00f59b]/30 text-[#00f59b] text-sm font-semibold text-center animate-fade-in">
            {note}
          </div>
        )}

        {/* Page Header */}
        <div>
          <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-[#f1f4fa] tracking-tight">
            Toko & Ruang Ganti
          </h1>
          <p className="text-xs sm:text-sm text-[#8e9ab2] mt-1.5">
            Tukarkan bintang dari hasil belajar untuk melengkapi penampilan Blobi atau membeli penguat progres.
          </p>
        </div>

        {/* 2-Column Split: Blobi Wardrobe (Left) & Boosters (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Blobi Wardrobe & Dressing Stage (5 cols) */}
          <div className="lg:col-span-5 space-y-5">
            <SurfaceCard className="p-6 flex flex-col items-center text-center">
              <div className="w-full flex items-center justify-between pb-3 border-b border-[#1c2333]">
                <span className="text-xs font-bold text-[#f1f4fa]">Kamar Ganti Blobi</span>
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#182030] border border-[#26334d] text-xs font-bold text-[#f59e0b]">
                  <BlockStamp size={13} className="text-[#f59e0b]" />
                  <span>{formatGems(gems)} Bintang</span>
                </div>
              </div>

              {/* Blobi Stage */}
              <div className="py-5 flex items-center justify-center">
                <div className="p-5 rounded-full bg-[#121622] border border-[#1e2536]">
                  <Mascot mood="wave" size={150} worn={previewWorn} />
                </div>
              </div>

              <div className="text-xs text-[#8e9ab2]">
                Pilih aksesori di bawah untuk mencoba dan mengenakannya pada Blobi.
              </div>
            </SurfaceCard>

            {/* Accessory Category Tabs & Grid */}
            <div className="space-y-3">
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                <button
                  type="button"
                  onClick={() => setSlot("all")}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                    slot === "all"
                      ? "bg-[#00f59b] text-[#060a0f]"
                      : "bg-[#121622] border border-[#1e2536] text-[#8e9ab2] hover:text-[#f1f4fa]"
                  }`}
                >
                  Semua
                </button>
                {SLOTS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSlot(s)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                      slot === s
                        ? "bg-[#00f59b] text-[#060a0f]"
                        : "bg-[#121622] border border-[#1e2536] text-[#8e9ab2] hover:text-[#f1f4fa]"
                    }`}
                  >
                    {SLOT_LABEL[s]}
                  </button>
                ))}
              </div>

              {/* Accessory Items List */}
              <div className="grid grid-cols-2 gap-3 max-h-[460px] overflow-y-auto pr-1">
                {shown.map((acc) => {
                  const owned = outfits.includes(acc.id);
                  const isEquipped = worn[acc.slot] === acc.id;
                  const canAfford = gems >= acc.cost;

                  return (
                    <div
                      key={acc.id}
                      className="p-3.5 rounded-[16px] bg-[#0e121a] border border-[#1c2333] flex flex-col justify-between hover:border-[#2b354c] transition-all"
                    >
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] text-[#8e9ab2]">{SLOT_LABEL[acc.slot]}</span>
                          {owned && (
                            <span className="text-[10px] font-semibold text-[#00f59b] bg-[#00f59b]/10 px-1.5 py-0.5 rounded-full">
                              Dimiliki
                            </span>
                          )}
                        </div>
                        <div className="font-bold text-xs text-[#f1f4fa] mt-1 line-clamp-1">
                          {acc.name}
                        </div>
                        <div className="text-[11px] text-[#5a667d] mt-0.5 line-clamp-1">
                          {acc.blurb}
                        </div>
                      </div>

                      <div className="mt-3 pt-2.5 border-t border-[#181f30] flex items-center justify-between gap-2">
                        {!owned ? (
                          <div className="flex items-center gap-1 text-xs font-bold text-[#f59e0b]">
                            <BlockStamp size={12} />
                            <span>{acc.cost}</span>
                          </div>
                        ) : (
                          <span className="text-[11px] text-[#8e9ab2]">
                            {isEquipped ? "Aktif" : "Siap pakai"}
                          </span>
                        )}

                        {owned ? (
                          isEquipped ? (
                            <button
                              type="button"
                              onClick={() => {
                                equipOutfit(null);
                                playUnequip();
                              }}
                              className="px-2.5 py-1 rounded-[10px] bg-[#141824] border border-[#232b3e] text-[11px] font-semibold text-[#8e9ab2] hover:text-[#ff4365] transition-colors"
                            >
                              Lepas
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => {
                                equipOutfit(acc.id);
                                playEquip();
                              }}
                              className="px-2.5 py-1 rounded-[10px] bg-[#141824] border border-[#232b3e] text-[11px] font-semibold text-[#00f59b] hover:bg-[#1a2132] transition-colors"
                            >
                              Pakai
                            </button>
                          )
                        ) : (
                          <button
                            type="button"
                            disabled={!canAfford}
                            onClick={() => setConfirm(acc)}
                            className="px-2.5 py-1 rounded-[10px] bg-[#00f59b] text-[#060a0f] text-[11px] font-bold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#1affaa] transition-colors"
                          >
                            Beli
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Boosters & Utility Cards (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <h2 className="text-sm font-bold text-[#8e9ab2] uppercase tracking-wider">
              Item & Penguat Belajar
            </h2>

            {/* 1. Tiket Undian Web3 (Featured Card) */}
            <SurfaceCard className="p-5 sm:p-6 border-[#00f59b]/30 bg-gradient-to-r from-[#0e161c] to-[#0e121a]">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-[16px] bg-[#00f59b]/15 text-[#00f59b] border border-[#00f59b]/30 shrink-0">
                    <Ticket className="size-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-display font-bold text-lg text-[#f1f4fa]">
                        Tiket Undian Web3
                      </h3>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#00f59b]/20 text-[#00f59b]">
                        Populer
                      </span>
                    </div>
                    <p className="text-xs text-[#8e9ab2] mt-1 leading-relaxed">
                      Gunakan tiket ini untuk mengikuti undian berhadiah USDT, hardware wallet, dan whitelist di Arena Undian Tessera.
                    </p>
                    <div className="mt-2 text-xs text-[#5a667d]">
                      Saldo kamu saat ini: <strong className="text-[#00f59b] font-mono">{raffleTickets} Tiket</strong>
                    </div>
                  </div>
                </div>

                <div className="shrink-0 flex flex-col sm:items-end gap-2">
                  <div className="flex items-center gap-1.5 text-sm font-bold text-[#f59e0b]">
                    <BlockStamp size={14} />
                    <span>50 Bintang / Tiket</span>
                  </div>
                  <TactileButton
                    variant="primary"
                    size="md"
                    disabled={gems < 50}
                    onClick={() => {
                      if (buyRaffleTicketsWithGems(1)) {
                        playBuy();
                        flash("Berhasil menukar 50 Bintang menjadi 1 Tiket Undian!");
                      } else {
                        playDeny();
                      }
                    }}
                  >
                    Tukar 1 Tiket
                  </TactileButton>
                </div>
              </div>
            </SurfaceCard>

            {/* 2. Pelindung Streak */}
            <SurfaceCard className="p-5 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-[16px] bg-[#00e5ff]/15 text-[#00e5ff] border border-[#00e5ff]/30 shrink-0">
                    <ShieldCheck className="size-6" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-base text-[#f1f4fa]">
                      Pelindung Streak
                    </h3>
                    <p className="text-xs text-[#8e9ab2] mt-1 leading-relaxed">
                      Menjaga agar rekor hari berturut-turut belajarmu tidak hangus jika kamu melewatkan satu hari belajar.
                    </p>
                    <div className="mt-2 text-xs text-[#5a667d]">
                      Status: {freeze > 0 ? <span className="text-[#00e5ff] font-semibold">Aktif ({freeze} perlindungan siap)</span> : "Belum aktif"}
                    </div>
                  </div>
                </div>

                <div className="shrink-0 flex flex-col sm:items-end gap-2">
                  <div className="flex items-center gap-1.5 text-sm font-bold text-[#f59e0b]">
                    <BlockStamp size={14} />
                    <span>{FREEZE_COST} Bintang</span>
                  </div>
                  <TactileButton
                    variant="secondary"
                    size="md"
                    disabled={freeze > 0 || gems < FREEZE_COST}
                    onClick={() => {
                      if (buyFreeze()) {
                        playFreeze();
                        flash("Pelindung Streak berhasil diaktifkan!");
                      } else {
                        playDeny();
                      }
                    }}
                  >
                    {freeze > 0 ? "Sudah Aktif" : "Pasang Pelindung"}
                  </TactileButton>
                </div>
              </div>
            </SurfaceCard>

            {/* 3. Isi Ulang Nyawa */}
            <SurfaceCard className="p-5 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-[16px] bg-[#ff4365]/15 text-[#ff4365] border border-[#ff4365]/30 shrink-0">
                    <Heart className="size-6" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-base text-[#f1f4fa]">
                      Isi Ulang Nyawa Penuh
                    </h3>
                    <p className="text-xs text-[#8e9ab2] mt-1 leading-relaxed">
                      Kembalikan nyawa belajarmu ke 5/5 seketika tanpa perlu menunggu waktu pemulihan.
                    </p>
                    <div className="mt-2 text-xs text-[#5a667d]">
                      Nyawa saat ini: <strong className="text-[#f1f4fa]">{hearts}/{MAX_HEARTS}</strong>
                    </div>
                  </div>
                </div>

                <div className="shrink-0 flex flex-col sm:items-end gap-2">
                  <div className="flex items-center gap-1.5 text-sm font-bold text-[#f59e0b]">
                    <BlockStamp size={14} />
                    <span>{HEART_REFILL_COST} Bintang</span>
                  </div>
                  <TactileButton
                    variant="danger"
                    size="md"
                    disabled={heartsFull || gems < HEART_REFILL_COST}
                    onClick={() => {
                      if (refillHearts()) {
                        playBuy();
                        flash("Semua 5 nyawa berhasil dipulihkan!");
                      } else {
                        playDeny();
                      }
                    }}
                  >
                    {heartsFull ? "Nyawa Penuh" : "Isi Ulang Sekarang"}
                  </TactileButton>
                </div>
              </div>
            </SurfaceCard>
          </div>
        </div>

        {/* Purchase Confirmation Dialog */}
        {confirm && (
          <Dialog
            title={`Beli ${confirm.name}?`}
            open={!!confirm}
            onClose={() => setConfirm(null)}
          >
            <div className="space-y-4 pt-2">
              <p className="text-xs text-[#8e9ab2] leading-relaxed">
                {confirm.blurb}
              </p>
              <div className="p-3 rounded-[14px] bg-[#121622] border border-[#1e2536] flex items-center justify-between">
                <span className="text-xs text-[#8e9ab2]">Harga item:</span>
                <span className="flex items-center gap-1.5 text-sm font-bold text-[#f59e0b]">
                  <BlockStamp size={14} />
                  {confirm.cost} Bintang
                </span>
              </div>
              <div className="flex gap-3 pt-2">
                <TactileButton
                  variant="ghost"
                  size="md"
                  fullWidth
                  onClick={() => setConfirm(null)}
                >
                  Batal
                </TactileButton>
                <TactileButton
                  variant="primary"
                  size="md"
                  fullWidth
                  onClick={() => purchase(confirm)}
                >
                  Konfirmasi Pembelian
                </TactileButton>
              </div>
            </div>
          </Dialog>
        )}
      </main>
    </AppShell>
  );
}
