import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Ticket, ShieldCheck, Heart } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Dialog } from "@/components/dialog";
import { Mascot } from "@/components/mascot";
import { BlockStamp } from "@/components/motif";
import { ACCESSORIES, SLOT_LABEL, SLOTS, type Accessory, type AccessorySlot, type Worn } from "@/lib/accessories";
import { playBuy, playDeny, playEquip, playFreeze, playUnequip } from "@/lib/audio";
import { FREEZE_COST, HEART_REFILL_COST } from "@/lib/shop";
import { MAX_HEARTS, formatGems, useProgress } from "@/lib/store";
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
      <main className="px-3 py-4 sm:px-4 sm:py-6 pb-24 sm:pb-28 max-w-6xl mx-auto space-y-6">
        {/* Flash Notification */}
        {note && (
          <div className="p-3.5 rounded-[16px] bg-[#E8FBF0] border-2 border-[#98E4B5] text-[#1E8A49] text-sm font-extrabold text-center shadow-[0_3px_0_#98E4B5]">
            {note}
          </div>
        )}

        {/* Page Header on White Card */}
        <SurfaceCard className="p-6 bg-white">
          <h1 className="font-display font-bold text-2xl sm:text-3xl text-[#0D2340] tracking-tight">
            Toko & Ruang Ganti Blobi
          </h1>
          <p className="text-xs sm:text-sm font-medium text-[#5A7796] mt-1.5 leading-relaxed">
            Tukarkan bintang dari hasil belajar untuk melengkapi penampilan Blobi atau membeli penguat progres.
          </p>
        </SurfaceCard>

        {/* 2-Column Split: Blobi Wardrobe (Left) & Boosters (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Blobi Wardrobe & Dressing Stage (5 cols) */}
          <div className="lg:col-span-5 space-y-5">
            <SurfaceCard className="p-6 flex flex-col items-center text-center bg-white">
              <div className="w-full flex items-center justify-between pb-3 border-b-2 border-[#DCE7F5]">
                <span className="text-xs font-extrabold text-[#0D2340]">Kamar Ganti Blobi</span>
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF7D1] border border-[#FFD84D] text-xs font-extrabold text-[#B27B00] shadow-sm">
                  <BlockStamp size={13} className="text-[#FFC61A]" />
                  <span>{formatGems(gems)} Bintang</span>
                </div>
              </div>

              {/* Blobi Stage with Pedestal */}
              <div className="py-5 flex items-center justify-center">
                <div className="p-6 rounded-full bg-[#E4F0FF] border-2 border-[#8FC2FF] shadow-[0_6px_0_#C2DBFA]">
                  <Mascot mood="wave" size={150} worn={previewWorn} />
                </div>
              </div>

              <div className="text-xs font-bold text-[#5A7796]">
                Pilih aksesori di bawah untuk mencoba dan mengenakannya pada Blobi.
              </div>
            </SurfaceCard>

            {/* Accessory Category Tabs & Grid */}
            <div className="space-y-3">
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                <button
                  type="button"
                  onClick={() => setSlot("all")}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-extrabold whitespace-nowrap transition-all cursor-pointer ${
                    slot === "all"
                      ? "bg-[#0B63F6] text-white shadow-[0_2px_0_#0B4FD1]"
                      : "bg-white border-2 border-[#DCE7F5] text-[#5A7796] hover:text-[#0D2340] hover:bg-[#F0F6FF]"
                  }`}
                >
                  Semua
                </button>
                {SLOTS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSlot(s)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-extrabold whitespace-nowrap transition-all cursor-pointer ${
                      slot === s
                        ? "bg-[#0B63F6] text-white shadow-[0_2px_0_#0B4FD1]"
                        : "bg-white border-2 border-[#DCE7F5] text-[#5A7796] hover:text-[#0D2340] hover:bg-[#F0F6FF]"
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
                      className="p-3.5 rounded-[18px] bg-white border-2 border-[#DCE7F5] shadow-[0_3px_0_#C8DBF0] flex flex-col justify-between hover:border-[#8FC2FF] transition-all"
                    >
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-bold text-[#5A7796]">{SLOT_LABEL[acc.slot]}</span>
                          {owned && (
                            <span className="text-[10px] font-extrabold text-[#1E8A49] bg-[#E8FBF0] px-2 py-0.5 rounded-full border border-[#98E4B5]">
                              Dimiliki
                            </span>
                          )}
                        </div>
                        <div className="font-extrabold text-xs text-[#0D2340] mt-1 line-clamp-1">
                          {acc.name}
                        </div>
                        <div className="text-[11px] font-medium text-[#5A7796] mt-0.5 line-clamp-1">
                          {acc.blurb}
                        </div>
                      </div>

                      <div className="mt-3 pt-2.5 border-t-2 border-[#F0F6FF] flex items-center justify-between gap-2">
                        {!owned ? (
                          <div className="flex items-center gap-1 text-xs font-extrabold text-[#B27B00]">
                            <BlockStamp size={12} className="text-[#FFC61A]" />
                            <span>{acc.cost}</span>
                          </div>
                        ) : (
                          <span className="text-[11px] font-bold text-[#5A7796]">
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
                              className="px-3 py-1 rounded-[10px] bg-white border-2 border-[#F4A4A0] text-[11px] font-extrabold text-[#B01E18] hover:bg-[#FFF5F5] shadow-[0_2px_0_#F4A4A0] active:translate-y-[1px] active:shadow-none transition-all cursor-pointer"
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
                              className="px-3 py-1 rounded-[10px] bg-[#E8FBF0] border-2 border-[#98E4B5] text-[11px] font-extrabold text-[#1E8A49] hover:bg-[#D3F5DF] shadow-[0_2px_0_#98E4B5] active:translate-y-[1px] active:shadow-none transition-all cursor-pointer"
                            >
                              Pakai
                            </button>
                          )
                        ) : (
                          <button
                            type="button"
                            disabled={!canAfford}
                            onClick={() => setConfirm(acc)}
                            className="px-3 py-1 rounded-[10px] bg-[#FFC61A] text-[#0D2340] border-2 border-[#E5A800] text-[11px] font-extrabold disabled:opacity-40 disabled:cursor-not-allowed shadow-[0_2px_0_#D99400] active:translate-y-[1px] active:shadow-none hover:bg-[#FFD147] transition-all cursor-pointer"
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
            <h2 className="text-sm font-extrabold text-white uppercase tracking-wider drop-shadow-sm">
              Item & Penguat Belajar
            </h2>

            {/* 1. Tiket Undian Web3 (Featured Card) */}
            <SurfaceCard className="p-5 sm:p-6 bg-white border-2 border-[#8FC2FF]">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="p-3.5 rounded-[18px] bg-[#E4F0FF] text-[#0B63F6] border-2 border-[#8FC2FF] shadow-[0_3px_0_#C2DBFA] shrink-0">
                    <Ticket className="size-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-display font-bold text-lg text-[#0D2340]">
                        Tiket Undian Web3
                      </h3>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-[#FFF7D1] text-[#B27B00] border border-[#FFD84D]">
                        Hadiah Riil
                      </span>
                    </div>
                    <p className="text-xs text-[#5A7796] mt-1 leading-relaxed">
                      Gunakan tiket ini untuk mengikuti undian berhadiah USDT, merchandise, dan whitelist di Arena Undian.
                    </p>
                    <div className="mt-2 text-xs font-bold text-[#1E3A5F]">
                      Saldo kamu saat ini: <strong className="text-[#0B4FD1] font-mono">{raffleTickets} Tiket</strong>
                    </div>
                  </div>
                </div>

                <div className="shrink-0 flex flex-col sm:items-end gap-2">
                  <div className="flex items-center gap-1.5 text-sm font-extrabold text-[#B27B00]">
                    <BlockStamp size={14} className="text-[#FFC61A]" />
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
            <SurfaceCard className="p-5 sm:p-6 bg-white">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="p-3.5 rounded-[18px] bg-[#FFF0E4] text-[#FF7A18] border-2 border-[#FFB580] shadow-[0_3px_0_#FFB580] shrink-0">
                    <ShieldCheck className="size-6" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-base text-[#0D2340]">
                      Pelindung Streak
                    </h3>
                    <p className="text-xs text-[#5A7796] mt-1 leading-relaxed">
                      Menjaga agar rekor hari berturut-turut belajarmu tidak hangus jika kamu melewatkan satu hari belajar.
                    </p>
                    <div className="mt-2 text-xs font-bold text-[#1E3A5F]">
                      Status: {freeze > 0 ? <span className="text-[#FF7A18] font-extrabold">Aktif ({freeze} perlindungan siap)</span> : "Belum aktif"}
                    </div>
                  </div>
                </div>

                <div className="shrink-0 flex flex-col sm:items-end gap-2">
                  <div className="flex items-center gap-1.5 text-sm font-extrabold text-[#B27B00]">
                    <BlockStamp size={14} className="text-[#FFC61A]" />
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
            <SurfaceCard className="p-5 sm:p-6 bg-white">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="p-3.5 rounded-[18px] bg-[#FFF5F5] text-[#E63329] border-2 border-[#F4A4A0] shadow-[0_3px_0_#F4A4A0] shrink-0">
                    <Heart className="size-6" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-base text-[#0D2340]">
                      Isi Ulang Nyawa Penuh
                    </h3>
                    <p className="text-xs text-[#5A7796] mt-1 leading-relaxed">
                      Kembalikan nyawa belajarmu ke 5/5 seketika tanpa perlu menunggu waktu pemulihan.
                    </p>
                    <div className="mt-2 text-xs font-bold text-[#1E3A5F]">
                      Nyawa saat ini: <strong className="text-[#E63329]">{hearts}/{MAX_HEARTS}</strong>
                    </div>
                  </div>
                </div>

                <div className="shrink-0 flex flex-col sm:items-end gap-2">
                  <div className="flex items-center gap-1.5 text-sm font-extrabold text-[#B27B00]">
                    <BlockStamp size={14} className="text-[#FFC61A]" />
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
              <p className="text-xs sm:text-sm text-[#5A7796] leading-relaxed">
                {confirm.blurb}
              </p>
              <div className="p-3 rounded-[16px] bg-[#E4F0FF] border-2 border-[#8FC2FF] flex items-center justify-between">
                <span className="text-xs font-bold text-[#1E3A5F]">Harga item:</span>
                <span className="flex items-center gap-1.5 text-sm font-extrabold text-[#B27B00]">
                  <BlockStamp size={14} className="text-[#FFC61A]" />
                  {confirm.cost} Bintang
                </span>
              </div>
              <div className="flex gap-3 pt-2">
                <TactileButton
                  variant="secondary"
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
