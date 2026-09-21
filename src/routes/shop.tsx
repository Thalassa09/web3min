import { Storefront } from "@/lib/kicon";
import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Ticket, Sparkles, ShieldCheck, Heart, Zap, Check } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Dialog } from "@/components/dialog";
import { Mascot } from "@/components/mascot";
import { BlockStamp } from "@/components/motif";
import { ACCESSORIES, SLOT_LABEL, SLOTS, type Accessory, type AccessorySlot, type Worn } from "@/lib/accessories";
import { playBuy, playDeny, playEquip, playFreeze, playUnequip } from "@/lib/audio";
import { FREEZE_COST, HEART_REFILL_COST } from "@/lib/shop";
import { MAX_HEARTS, UNLIMITED_GEMS, formatGems, useProgress } from "@/lib/store";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { TelemetryBadge } from "@/components/ui/telemetry-badge";
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
    window.setTimeout(() => setNote(null), 4000);
  }

  function purchase(acc: Accessory) {
    if (buyOutfit(acc.id)) {
      playBuy();
      setConfirm(null);
      flash(`Item "${acc.name}" berhasil dibeli!`);
    } else {
      playDeny();
    }
  }

  return (
    <AppShell>
      <main className="px-4 py-6 max-w-6xl mx-auto space-y-8">
        {/* Flash Message Banner */}
        {note && (
          <div className="p-3.5 rounded-[16px] bg-[#00f59b]/10 border border-[#00f59b]/30 text-[#00f59b] font-mono text-xs font-bold text-center animate-fade-in shadow-[0_0_20px_rgba(0,245,155,0.15)]">
            {note}
          </div>
        )}

        {/* Asymmetric Header Split (65/35 DKV Architecture) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Blobi Fitting Holo-Chamber (Left: 5 Cols) */}
          <div className="lg:col-span-5 p-6 rounded-[24px] bg-gradient-to-b from-[#111322] to-[#0a0c16] border border-[#222842] shadow-[0_8px_32px_rgba(0,0,0,0.5)] flex flex-col items-center text-center relative overflow-hidden">
            {/* Background Optical Grid */}
            <div className="absolute inset-0 bg-[radial-gradient(#20263f_1px,transparent_1px)] [background-size:16px_16px] opacity-40 pointer-events-none" />

            <div className="w-full flex items-center justify-between mb-2 z-10">
              <TelemetryBadge label="FITTING ROOM" value="LIVE" tone="cyan" pulsing />
              <span className="font-mono text-[10px] text-zinc-500">BLOBI SYNC</span>
            </div>

            <div className="relative py-4 z-10">
              <div className="relative flex items-center justify-center p-4 rounded-full bg-[#161a30]/50 border border-white/5 shadow-[inset_0_0_24px_rgba(0,229,255,0.15)]">
                <Mascot mood="wave" size={170} worn={previewWorn} />
              </div>
            </div>

            <h1 className="z-10 font-display font-black text-2xl text-zinc-100 tracking-tight mt-2">
              Kamar Ganti Blobi
            </h1>
            <p className="z-10 text-xs text-zinc-400 font-sans mt-1">
              Personalisasi maskot Blobi menggunakan bintang yang kamu peroleh dari menyelesaikan modul Web3.
            </p>

            <div className="z-10 mt-5 w-full grid grid-cols-2 gap-2 pt-4 border-t border-[#1a1f33]">
              <div className="p-2.5 rounded-[12px] bg-[#070810] border border-[#1b1f33] text-left">
                <span className="text-[10px] font-mono text-zinc-500 uppercase block">SALDO BINTANG</span>
                <span className="text-sm font-mono font-bold text-[#f59e0b] flex items-center gap-1.5 mt-0.5">
                  <BlockStamp size={14} />
                  {formatGems(gems)}
                </span>
              </div>
              <div className="p-2.5 rounded-[12px] bg-[#070810] border border-[#1b1f33] text-left">
                <span className="text-[10px] font-mono text-zinc-500 uppercase block">PELINDUNG STREAK</span>
                <span className="text-sm font-mono font-bold text-[#00e5ff] flex items-center gap-1.5 mt-0.5">
                  <Zap className="size-3.5" />
                  {freeze} AKTIF
                </span>
              </div>
            </div>
          </div>

          {/* Sovereign Vault & Consumables (Right: 7 Cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-display font-black text-xl text-zinc-100">Pasar On-Chain</h2>
                <p className="text-xs text-zinc-400 font-sans">Katalog tiket undian, perlindungan, dan pemulihan.</p>
              </div>
              <TelemetryBadge label="STOCKS" value="UNLIMITED" tone="mint" />
            </div>

            {/* Consumable 1: Web3 Raffle Tickets */}
            <SpotlightCard glowColor="rgba(0, 245, 155, 0.25)" className="w-full">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-display font-bold text-base text-[#00f59b]">
                      Tiket Undian Web3 (Raffle)
                    </h3>
                    <TelemetryBadge label="HOT" tone="mint" />
                  </div>
                  <p className="text-xs text-zinc-400 font-sans leading-relaxed">
                    Gunakan tiket untuk bertaruh di Hub Undian berhadiah USDT, Whitelist NFT, dan Hardware Wallet.
                  </p>
                  <div className="flex items-center gap-4 pt-2">
                    <span className="font-mono text-xs text-[#f59e0b] font-bold flex items-center gap-1">
                      <BlockStamp size={13} /> 10 Bintang / Tiket
                    </span>
                    <span className="font-mono text-xs text-zinc-500">
                      Saldo Anda: <strong className="text-[#00f59b]">{raffleTickets} Tiket</strong>
                    </span>
                  </div>
                </div>

                <TactileButton
                  variant="primary"
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
                </TactileButton>
              </div>
            </SpotlightCard>

            {/* Consumable 2: Heart Refill */}
            <SpotlightCard glowColor="rgba(255, 67, 101, 0.2)" className="w-full">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-display font-bold text-base text-zinc-100">
                      Pemulihan Nyawa Penuh
                    </h3>
                    <TelemetryBadge label="RESTORE" tone="rose" />
                  </div>
                  <p className="text-xs text-zinc-400 font-sans leading-relaxed">
                    Kembalikan seluruh nyawa Blobi menjadi 5 seketika agar bisa lanjut menuntaskan rute belajar.
                  </p>
                  <div className="flex items-center gap-4 pt-2">
                    <span className="font-mono text-xs text-[#f59e0b] font-bold flex items-center gap-1">
                      <BlockStamp size={13} /> {HEART_REFILL_COST} Bintang
                    </span>
                    <span className="font-mono text-xs text-zinc-500">
                      Status: {heartsFull ? "Nyawa Penuh" : `${hearts}/${MAX_HEARTS} Nyawa`}
                    </span>
                  </div>
                </div>

                <TactileButton
                  variant="secondary"
                  size="sm"
                  disabled={heartsFull || (!UNLIMITED_GEMS && gems < HEART_REFILL_COST)}
                  onClick={() => {
                    if (refillHearts()) {
                      playBuy();
                      flash("Nyawa berhasil dipulihkan menjadi penuh!");
                    } else playDeny();
                  }}
                >
                  {heartsFull ? "Penuh" : "Pulihkan"}
                </TactileButton>
              </div>
            </SpotlightCard>

            {/* Consumable 3: Streak Freeze */}
            <SpotlightCard glowColor="rgba(0, 229, 255, 0.2)" className="w-full">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-display font-bold text-base text-zinc-100">
                      Pelindung Streak (Freeze)
                    </h3>
                    <TelemetryBadge label="PROTECT" tone="cyan" />
                  </div>
                  <p className="text-xs text-zinc-400 font-sans leading-relaxed">
                    Amankan rekormu jika suatu hari kamu berhalangan belajar. Berlaku otomatis saat kamu skip 1 hari.
                  </p>
                  <div className="flex items-center gap-4 pt-2">
                    <span className="font-mono text-xs text-[#f59e0b] font-bold flex items-center gap-1">
                      <BlockStamp size={13} /> {FREEZE_COST} Bintang
                    </span>
                    <span className="font-mono text-xs text-zinc-500">
                      Aktif saat ini: <strong className="text-[#00e5ff]">{freeze} Slot</strong>
                    </span>
                  </div>
                </div>

                <TactileButton
                  variant="secondary"
                  size="sm"
                  disabled={freeze >= 2 || (!UNLIMITED_GEMS && gems < FREEZE_COST)}
                  onClick={() => {
                    if (buyFreeze()) {
                      playFreeze();
                      flash("Pelindung streak aktif ditambahkan!");
                    } else playDeny();
                  }}
                >
                  {freeze >= 2 ? "Maksimal" : "Pasang"}
                </TactileButton>
              </div>
            </SpotlightCard>
          </div>
        </div>

        {/* Accessory Catalog & Slot Filter */}
        <section className="space-y-6 pt-4 border-t border-[#181d2e]">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="font-display font-black text-xl text-zinc-100">Kostum & Aksesori Blobi</h2>
              <p className="text-xs text-zinc-400 font-sans">Koleksi kosmetik eksklusif penanda progres belajar.</p>
            </div>

            {/* Slot Filter Pill Matrix */}
            <div className="flex items-center gap-1.5 p-1 rounded-[14px] bg-[#0a0c16] border border-[#1b1f33] overflow-x-auto max-w-full">
              <button
                type="button"
                onClick={() => setSlot("all")}
                className={`px-3 py-1 rounded-[10px] text-xs font-mono font-bold uppercase transition-all ${
                  slot === "all"
                    ? "bg-[#161a2c] text-[#00f59b] border border-[#2b3353]"
                    : "text-zinc-400 hover:text-zinc-200"
                }`}
              >
                Semua ({ACCESSORIES.length})
              </button>
              {SLOTS.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSlot(s)}
                  className={`px-3 py-1 rounded-[10px] text-xs font-mono font-bold uppercase transition-all ${
                    slot === s
                      ? "bg-[#161a2c] text-[#00f59b] border border-[#2b3353]"
                      : "text-zinc-400 hover:text-zinc-200"
                  }`}
                >
                  {SLOT_LABEL[s]}
                </button>
              ))}
            </div>
          </div>

          {/* Accessory Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {shown.map((acc) => {
              const owned = outfits.includes(acc.id);
              const on = worn[acc.slot] === acc.id;
              const short = acc.cost - gems;

              return (
                <div
                  key={acc.id}
                  className={`relative rounded-[20px] p-4 bg-[#090b14] border transition-all duration-200 flex flex-col justify-between ${
                    on
                      ? "border-[#00f59b]/50 shadow-[0_0_20px_rgba(0,245,155,0.12)]"
                      : "border-[#191d2f] hover:border-[#2b314d]"
                  }`}
                  onMouseEnter={() => setPreview(acc.id)}
                  onMouseLeave={() => setPreview(null)}
                >
                  <div className="flex flex-col items-center text-center">
                    <div className="p-2 rounded-full bg-[#121526]/60 border border-white/5 mb-2">
                      <Mascot mood="idle" size={76} lite worn={{ [acc.slot]: acc.id }} />
                    </div>

                    <span className="text-[10px] font-mono text-zinc-500 uppercase">
                      {SLOT_LABEL[acc.slot]}
                    </span>
                    <h3 className="font-display font-bold text-sm text-zinc-100 mt-0.5 truncate max-w-full">
                      {acc.name}
                    </h3>

                    <div className="mt-2">
                      {owned ? (
                        <TelemetryBadge
                          label={on ? "TERPASANG" : "TERSEDIA"}
                          tone={on ? "mint" : "zinc"}
                        />
                      ) : (
                        <span className="font-mono text-xs text-[#f59e0b] font-bold flex items-center gap-1">
                          <BlockStamp size={12} />
                          {acc.cost} Bintang
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#161928]">
                    {owned ? (
                      <TactileButton
                        variant={on ? "ghost" : "secondary"}
                        size="sm"
                        fullWidth
                        onClick={() => {
                          equipOutfit(acc.id);
                          if (on) playUnequip();
                          else playEquip();
                        }}
                      >
                        {on ? "Lepas" : "Pasang"}
                      </TactileButton>
                    ) : !UNLIMITED_GEMS && gems < acc.cost ? (
                      <TactileButton variant="ghost" size="sm" fullWidth disabled>
                        Kurang {short} ★
                      </TactileButton>
                    ) : (
                      <TactileButton
                        variant="primary"
                        size="sm"
                        fullWidth
                        onClick={() => setConfirm(acc)}
                      >
                        Beli Item
                      </TactileButton>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </main>

      {/* Confirmation Dialog */}
      <Dialog
        open={Boolean(confirm)}
        title={confirm ? `Beli ${confirm.name}?` : "Beli item"}
        description={
          confirm
            ? UNLIMITED_GEMS
              ? `Harga ${confirm.cost} bintang. Saldo unlimited.`
              : `Harga ${confirm.cost} bintang. Saldo setelah membeli: ${gems - confirm.cost} bintang.`
            : undefined
        }
        onClose={() => setConfirm(null)}
      >
        <div className="mt-4 flex gap-2">
          <TactileButton variant="ghost" className="flex-1" onClick={() => setConfirm(null)}>
            Batal
          </TactileButton>
          <TactileButton variant="primary" className="flex-1" onClick={() => confirm && purchase(confirm)}>
            Konfirmasi Beli
          </TactileButton>
        </div>
      </Dialog>
    </AppShell>
  );
}
