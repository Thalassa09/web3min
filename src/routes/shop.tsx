import { useMemo, useState, useEffect } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Ticket,
  ShieldCheck,
  Shield,
  Crown,
  Star,
  Heart,
  Sparkles,
  Check,
  RotateCcw,
  ArrowRight,
  ShoppingBag,
  Shirt,
  Store,
  Layers,
  Hand,
  Smile,
  PartyPopper,
  Coffee,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Dialog } from "@/components/dialog";
import { Mascot, type MascotMood } from "@/components/mascot";
import { BlockStamp } from "@/components/motif";
import {
  ACCESSORIES,
  SLOT_LABEL,
  SLOTS,
  type Accessory,
  type AccessorySlot,
  type Worn,
} from "@/lib/accessories";
import {
  playBuy,
  playDeny,
  playEquip,
  playFreeze,
  playUnequip,
} from "@/lib/audio";
import { FREEZE_COST, HEART_REFILL_COST, isLimitedItem } from "@/lib/shop";
import { MAX_HEARTS, formatGems, useProgress } from "@/lib/store";
import { rpcBuyFreeze, rpcRefillHearts, rpcBuyTickets, syncProgressFromServer } from "@/lib/server-sync";
import { SurfaceCard } from "@/components/ui/surface-card";
import { TactileButton } from "@/components/ui/tactile-button";

export const Route = createFileRoute("/shop")({ component: ShopPage });

type ShopMode = "shop" | "wardrobe";

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

  // Read initial tab from URL param if present
  const [mode, setMode] = useState<ShopMode>(() => {
    if (typeof window !== "undefined") {
      const p = new URLSearchParams(window.location.search).get("tab");
      if (p === "wardrobe" || p === "ganti") return "wardrobe";
    }
    return "shop";
  });

  // Keep URL search synchronized
  const handleModeChange = (newMode: ShopMode) => {
    setMode(newMode);
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      if (newMode === "wardrobe") {
        url.searchParams.set("tab", "wardrobe");
      } else {
        url.searchParams.delete("tab");
      }
      window.history.replaceState(null, "", url.toString());
    }
  };

  // Ruang Ganti state
  const [wardrobeSlot, setWardrobeSlot] = useState<AccessorySlot | "all">("all");
  const [wardrobeScope, setWardrobeScope] = useState<"owned" | "all">(outfits.length > 0 ? "owned" : "all");
  const [blobiMood, setBlobiMood] = useState<MascotMood>("wave");
  const [previewWorn, setPreviewWorn] = useState<Worn | null>(null);

  // Shared state
  const [confirm, setConfirm] = useState<Accessory | null>(null);
  const [note, setNote] = useState<{ text: string; actionText?: string; onAction?: () => void } | null>(null);

  const activeWorn = previewWorn ?? worn;

  const heartsFull = hearts >= MAX_HEARTS;

  function flash(text: string, actionText?: string, onAction?: () => void) {
    setNote({ text, actionText, onAction });
    window.setTimeout(() => setNote(null), 4000);
  }

  function purchase(acc: Accessory) {
    if (buyOutfit(acc.id)) {
      playBuy();
      setConfirm(null);
      flash(
        `"${acc.name}" berhasil dibeli!`,
        "Pakai Sekarang",
        () => {
          equipOutfit(acc.id);
          setPreviewWorn(null);
        }
      );
    } else {
      playDeny();
    }
  }

  // Accessories shown in Ruang Ganti
  const wardrobeItems = useMemo(() => {
    return ACCESSORIES.filter((a) => {
      // Item limited yang belum dimiliki tidak ditampilkan
      if (isLimitedItem(a.id) && !outfits.includes(a.id)) {
        return false;
      }
      const matchesSlot = wardrobeSlot === "all" || a.slot === wardrobeSlot;
      if (!matchesSlot) return false;
      if (wardrobeScope === "owned") {
        return outfits.includes(a.id);
      }
      return true;
    });
  }, [wardrobeSlot, wardrobeScope, outfits]);

  const ownedCount = outfits.length;
  const totalCount = ACCESSORIES.length;

  const isWearingSomething = Boolean(activeWorn.hat || activeWorn.face || activeWorn.neck || activeWorn.held);

  return (
    <AppShell>
      <main className="px-3 py-4 sm:px-4 sm:py-6 pb-[calc(6rem+env(safe-area-inset-bottom))] sm:pb-28 max-w-6xl mx-auto space-y-6">
        {/* Flash Notification */}
        {note && (
          <div className="p-3.5 rounded-[18px] bg-candy-100 border-2 border-choco-900 text-choco-900 text-sm font-pixel font-bold flex flex-col sm:flex-row items-center justify-between gap-2 shadow-[0_3px_0_#3B2218] animate-in fade-in slide-in-from-top-2">
            <span>{note.text}</span>
            {note.onAction && (
              <button
                type="button"
                onClick={note.onAction}
                className="px-3.5 py-1 rounded-[10px] bg-candy-500 text-white text-xs font-pixel font-bold hover:bg-candy-600 shadow-[0_2px_0_#3B2218] cursor-pointer"
              >
                {note.actionText} →
              </button>
            )}
          </div>
        )}

        {/* PRIMARY MODE SELECTOR: Toko vs Ruang Ganti Blobi */}
        <div className="p-3 sm:p-4 rounded-3xl bg-gradient-to-b from-white via-[#FFF9F5] to-[#FDEEE4] border-2 border-choco-900/18 shadow-[0_4.5px_0_#3B2218,0_10px_24px_-4px_rgba(59,34,24,0.12)]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            {/* Mode Switcher Buttons */}
            <div className="inline-flex p-1.5 rounded-2xl bg-gradient-to-b from-[#FFF0F5] to-[#FFE4EC] border-2 border-candy-500/30 shadow-[0_2px_0_#B01F62] gap-1.5 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => handleModeChange("shop")}
                className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-display font-bold text-sm select-none cursor-pointer transition-[transform,box-shadow,background-color,border-color,color] duration-150 ease-out active:translate-y-[1px] ${
                  mode === "shop"
                    ? "bg-gradient-to-b from-[#FF6699] via-[#E8437F] to-[#D82668] text-white border-2 border-candy-600/50 shadow-[0_2.5px_0_#B01F62]"
                    : "text-choco-600 hover:text-choco-900 hover:bg-white/60 border-2 border-transparent"
                }`}
              >
                <Store className="size-4.5" />
                <span>Toko</span>
              </button>

              <button
                type="button"
                onClick={() => handleModeChange("wardrobe")}
                className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-display font-bold text-sm select-none cursor-pointer transition-[transform,box-shadow,background-color,border-color,color] duration-150 ease-out active:translate-y-[1px] ${
                  mode === "wardrobe"
                    ? "bg-gradient-to-b from-[#FF6699] via-[#E8437F] to-[#D82668] text-white border-2 border-candy-600/50 shadow-[0_2.5px_0_#B01F62]"
                    : "text-choco-600 hover:text-choco-900 hover:bg-white/60 border-2 border-transparent"
                }`}
              >
                <Sparkles className="size-4.5" />
                <span>Ruang Ganti Blobi</span>
                {ownedCount > 0 && (
                  <span
                    className={`ml-1 px-2 py-0.5 rounded-full text-[10px] font-pixel font-bold ${
                      mode === "wardrobe"
                        ? "bg-gradient-to-b from-[#FFE873] to-[#FFD84D] text-choco-900 border border-amber-600/40 shadow-[0_1px_0_#C8940C]"
                        : "bg-candy-500 text-white"
                    }`}
                  >
                    {ownedCount}
                  </span>
                )}
              </button>
            </div>

            {/* Currency & Inventory Badges */}
            <div className="hidden sm:flex items-center gap-2 justify-end">
              <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-b from-[#FFFBEB] via-[#FEF3C7] to-[#FDE68A] border-2 border-amber-500/40 text-xs font-bold text-choco-900 shadow-[0_2px_0_#D97706]">
                <Star size={14} className="text-amber-500" fill="currentColor" />
                <span className="tabular-nums font-pixel">{formatGems(gems)} Koin</span>
              </div>
            </div>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════ */}
        {/* MODE 1: TOKO (Store View)                             */}
        {/* ═══════════════════════════════════════════════════════ */}
        {mode === "shop" && (
          <div className="space-y-6">
            {/* Header Toko */}
            <div className="hidden sm:block p-4 sm:p-6 rounded-3xl bg-gradient-to-b from-white via-[#FFF9F5] to-[#FDEEE4] border-2 border-choco-900/18 shadow-[0_4.5px_0_#3B2218,0_10px_24px_-4px_rgba(59,34,24,0.12)] space-y-2">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h1 className="font-display font-bold text-xl sm:text-3xl text-choco-900 tracking-tight flex items-center gap-2">
                    <Store className="size-6 sm:size-7 text-candy-500" />
                    <span>Toko</span>
                  </h1>
                  <p className="text-xs sm:text-sm font-semibold text-choco-600 mt-0.5 leading-relaxed font-sans">
                    Tukarkan bintang dari hasil belajar untuk membeli penguat streak, isi ulang nyawa, dan aksesori eksklusif Blobi.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleModeChange("wardrobe")}
                  className="px-3.5 py-1.5 rounded-xl bg-gradient-to-b from-[#FFF0F5] to-[#FFE4EC] border-2 border-candy-500/40 text-candy-700 text-xs font-bold hover:bg-candy-100 shadow-[0_2px_0_#B01F62] transition-[transform,box-shadow,background-color,border-color,color] flex items-center gap-1.5 shrink-0 cursor-pointer active:translate-y-[1px]"
                >
                  <Shirt className="size-3.5" />
                  <span>Ruang Ganti ({ownedCount})</span>
                  <ArrowRight className="size-3" />
                </button>
              </div>
            </div>

            {/* SECTION: Item Toko Blobi */}
            <div className="space-y-4">
              <div className="flex items-center justify-between px-1">
                <div>
                  <span className="block font-pixel text-[12px] font-bold uppercase tracking-wider text-choco-600">
                    Tukar bintang hasil belajar
                  </span>
                  <h2 className="text-xl font-pixel font-bold text-choco-900 flex items-center gap-2">
                    <Store className="size-5 text-candy-500" />
                    <span>Item & Penguat Belajar</span>
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => handleModeChange("wardrobe")}
                  className="inline-flex items-center gap-2 rounded-xl border-2 border-choco-900 bg-cream px-3.5 py-2 text-[13px] font-pixel font-bold text-choco-900 shadow-[0_2px_0_#3B2218] transition-[transform,box-shadow] hover:bg-candy-100 active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
                >
                  <Shirt className="size-4" strokeWidth={2.4} />
                  <span>Ruang Ganti</span>
                </button>
              </div>

              {/* Asymmetrical Bento Showcase for Items */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {/* 1. Hero Bento Card: Isi Ulang Nyawa (Spans 2 Cols) */}
                <div className="md:col-span-2 flex flex-col justify-between rounded-3xl border-2 border-danger/40 bg-gradient-to-b from-[#FFF5F5] via-[#FFEBEB] to-[#FED7D7] p-5 md:p-6 shadow-[0_5px_0_#991B1B,0_12px_28px_-4px_rgba(220,38,38,0.20)]">
                  <div>
                    <div className="flex items-center justify-between gap-3 mb-3">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center gap-1 rounded-full border-2 border-danger/50 bg-danger/15 px-2.5 py-0.5 text-[11px] font-bold text-danger">
                          <Heart className="size-3.5 fill-current" /> Vitalitas Kuis
                        </span>
                        <span className="text-[11px] font-bold text-choco-600">
                          {heartsFull ? "Nyawa Kamu Penuh" : `${hearts}/${MAX_HEARTS} Nyawa Tersisa`}
                        </span>
                      </div>
                      {/* Hearts Meter Indicator */}
                      <div className="flex items-center gap-1">
                        {Array.from({ length: MAX_HEARTS }).map((_, i) => (
                          <Heart
                            key={i}
                            className={`size-4 transition-transform ${
                              i < hearts
                                ? "text-danger fill-current scale-100"
                                : "text-choco-900/30 scale-90"
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    <h3 className="text-xl font-display font-bold text-choco-900 tracking-tight">
                      Isi Ulang 5 Nyawa Penuh
                    </h3>
                    <p className="mt-2 text-xs md:text-sm font-semibold leading-relaxed text-choco-700 max-w-xl">
                      Salah nebak pas ngerjain kuis? Pulihin 5 nyawa penuh sekaligus biar kamu bisa langsung lanjut push rute pulau tanpa harus nunggu jeda istirahat.
                    </p>
                  </div>

                  <div className="mt-6 flex flex-wrap items-center justify-between gap-4 pt-4 border-t-2 border-choco-900/15">
                    <div className="flex items-center gap-2">
                      <div className="size-8 rounded-xl border-2 border-amber-500/40 bg-gradient-to-b from-[#FFFBEB] to-[#FEF3C7] flex items-center justify-center shadow-[0_2px_0_#D97706]">
                        <img src="/props/star.png" alt="Koin" className="size-5 object-contain pixelated" />
                      </div>
                      <span className="font-pixel text-lg font-bold text-choco-900">
                        {HEART_REFILL_COST} Koin
                      </span>
                    </div>

                    <button
                      type="button"
                      disabled={heartsFull || gems < HEART_REFILL_COST}
                      onClick={() => {
                        if (refillHearts()) {
                          playBuy();
                          flash("Semua 5 nyawa berhasil dipulihkan!");
                          void rpcRefillHearts().then((ok) => {
                            if (ok) void syncProgressFromServer();
                          });
                        } else {
                          playDeny();
                        }
                      }}
                      className={`inline-flex items-center justify-center rounded-2xl border-2 border-candy-600/60 px-5 py-2.5 text-xs md:text-sm font-bold transition-[transform,box-shadow] ${
                        heartsFull || gems < HEART_REFILL_COST
                          ? "cursor-not-allowed border-stone-300 bg-stone-100 text-stone-400 shadow-none"
                          : "bg-gradient-to-b from-[#FF6699] via-[#E8437F] to-[#D82668] text-white shadow-[0_4px_0_#B01F62,0_8px_16px_-2px_rgba(232,67,127,0.25)] hover:brightness-105 active:translate-y-[2px] active:shadow-none"
                      }`}
                    >
                      {heartsFull ? "Nyawa Penuh" : gems < HEART_REFILL_COST ? "Koin Kurang" : "Isi Ulang Sekarang"}
                    </button>
                  </div>
                </div>

                {/* 2. Side Bento Card: Pelindung Streak (Spans 1 Col) */}
                <div className="flex flex-col justify-between rounded-3xl border-2 border-[#F97316]/50 bg-gradient-to-b from-[#FFF7ED] via-[#FFEDD5] to-[#FED7AA] p-5 shadow-[0_5px_0_#EA580C,0_12px_28px_-4px_rgba(234,88,12,0.22)]">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="size-12 rounded-2xl border-2 border-orange-400/50 bg-white/70 flex items-center justify-center shadow-[0_2px_0_#EA580C]">
                        <img src="/props/shield.png" alt="Pelindung Streak" className="size-7 object-contain pixelated" />
                      </div>
                      <span className={`px-2.5 py-0.5 rounded-full border-2 text-[10px] font-bold ${
                        freeze > 0 ? "border-orange-500 bg-orange-500 text-white shadow-[0_1px_0_#C2410C]" : "border-orange-400/40 bg-white/70 text-orange-900"
                      }`}>
                        {freeze > 0 ? "Aktif Melindungi" : "Siaga"}
                      </span>
                    </div>

                    <h3 className="text-lg font-display font-bold text-choco-900">
                      Pelindung Streak
                    </h3>
                    <p className="mt-1.5 text-xs font-semibold leading-relaxed text-choco-700">
                      Lagi sibuk lembur atau nongkrong? Pasang pelindung biar streak rantai kamu gak putus kalau bolos sehari.
                    </p>

                    <div className="mt-3 text-xs font-bold text-choco-900 bg-white/70 p-2 rounded-xl border border-orange-400/30 shadow-[0_1px_0_#EA580C]">
                      Dimiliki: <strong>{freeze} Pelindung</strong>
                    </div>
                  </div>

                  <div className="mt-5 flex items-center justify-between pt-4 border-t-2 border-orange-400/20">
                    <div className="flex items-center gap-1.5">
                      <img src="/props/star.png" alt="Koin" className="size-4 object-contain pixelated" />
                      <span className="font-pixel text-base font-bold text-choco-900">
                        {FREEZE_COST}
                      </span>
                    </div>

                    <button
                      type="button"
                      disabled={freeze > 0 || gems < FREEZE_COST}
                      onClick={() => {
                        if (buyFreeze()) {
                          playBuy();
                          flash("Pelindung Streak berhasil dibeli!");
                          void rpcBuyFreeze().then((ok) => {
                            if (ok) void syncProgressFromServer();
                          });
                        } else {
                          playDeny();
                        }
                      }}
                      className={`inline-flex items-center justify-center rounded-xl border-2 px-4 py-2 text-xs font-bold transition-[transform,box-shadow] ${
                        freeze > 0 || gems < FREEZE_COST
                          ? "cursor-not-allowed border-stone-300 bg-stone-100 text-stone-400 shadow-none"
                          : "border-orange-600/60 bg-gradient-to-b from-[#FB923C] via-[#F97316] to-[#EA580C] text-white shadow-[0_3px_0_#C2410C] hover:brightness-105 active:translate-y-[2px] active:shadow-none"
                      }`}
                    >
                      {freeze > 0 ? "Sudah Aktif" : gems < FREEZE_COST ? "Kurang" : "Beli"}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Exclusive Wardrobe Banner */}
            <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-b from-[#FFF0F5] via-[#FFE4EC] to-[#FDC8D8] border-2 border-candy-500/40 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-[0_6px_0_#B01F62,0_12px_28px_-4px_rgba(232,67,127,0.22)]">
              <div className="flex items-center gap-4 text-center sm:text-left">
                <div className="size-14 rounded-2xl bg-white border-2 border-candy-500/40 shadow-[0_2px_0_#B01F62] flex items-center justify-center shrink-0">
                  <Sparkles className="size-7 text-candy-500" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-base sm:text-lg text-choco-900">
                    Koleksi Pakaian & Aksesori Blobi
                  </h3>
                  <p className="text-xs sm:text-sm text-choco-600 mt-0.5 leading-relaxed font-sans font-semibold">
                    Semua baju, topi, kacamata, dan aksesori Blobi kini tersedia eksklusif di <strong>Ruang Ganti Blobi</strong>. Coba atau pasang langsung pada karaktermu!
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleModeChange("wardrobe")}
                className="shrink-0 px-5 py-2.5 rounded-xl bg-gradient-to-b from-[#FF6699] via-[#E8437F] to-[#D82668] text-white font-bold text-xs border-2 border-candy-600/50 shadow-[0_3px_0_#B01F62] flex items-center gap-1 cursor-pointer hover:brightness-105 active:translate-y-[2px] active:shadow-none transition-all"
              >
                <span>Buka Ruang Ganti Blobi</span>
                <ArrowRight className="size-3.5 ml-1" />
              </button>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════ */}
        {/* MODE 2: RUANG GANTI BLOBI (Wardrobe & Dressing View)   */}
        {/* ═══════════════════════════════════════════════════════ */}
        {mode === "wardrobe" && (
          <div className="space-y-6">
            {/* Header Ruang Ganti */}
            <div className="hidden sm:block p-4 sm:p-6 rounded-3xl bg-gradient-to-b from-white via-[#FFF9F5] to-[#FDEEE4] border-2 border-choco-900/18 shadow-[0_4.5px_0_#3B2218,0_10px_24px_-4px_rgba(59,34,24,0.12)] space-y-2">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h1 className="font-display font-bold text-xl sm:text-3xl text-choco-900 tracking-tight flex items-center gap-2">
                    <Sparkles className="size-6 sm:size-7 text-candy-500" />
                    <span>Ruang Ganti Blobi</span>
                  </h1>
                  <p className="text-xs sm:text-sm font-semibold text-choco-600 mt-0.5 leading-relaxed font-sans">
                    Atur gaya dan padukan penampilan Blobi. Coba berbagai pakaian yang sudah kamu miliki, atau coba aksesori baru langsung pada karakter!
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="px-3 py-1 rounded-full bg-candy-100 border-2 border-choco-900 text-candy-600 text-xs font-pixel font-bold shadow-[0_2px_0_#3B2218]">
                    {ownedCount}/{totalCount} Koleksi
                  </span>
                  <button
                    type="button"
                    onClick={() => handleModeChange("shop")}
                    className="px-3 py-1.5 rounded-[12px] bg-lemon border-2 border-choco-900 text-choco-900 text-xs font-pixel font-bold hover:bg-lemon-deep shadow-[0_2px_0_#3B2218] transition-[transform,box-shadow,background-color,border-color,color] flex items-center gap-1 cursor-pointer active:translate-y-[1px]"
                  >
                    <Store className="size-3.5" />
                    <span className="hidden sm:inline">Toko</span>
                  </button>
                </div>
              </div>
            </div>

            {/* 2-Column Layout: Left Stage vs Right Wardrobe Closet */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* LEFT COLUMN: Panggung Busana Blobi (5 cols) */}
              <div className="lg:col-span-5 space-y-4">
                <div className="p-6 rounded-3xl flex flex-col items-center text-center bg-gradient-to-b from-white via-[#FFF9F5] to-[#FDEEE4] border-2 border-choco-900/18 shadow-[0_6px_0_#3B2218,0_12px_28px_-4px_rgba(59,34,24,0.12)]">
                  <div className="w-full flex items-center justify-between pb-3 border-b-2 border-choco-900/15">
                    <span className="text-xs font-display font-bold text-choco-900">Panggung Busana</span>
                    <span className="text-[11px] font-semibold text-choco-600">
                      {isWearingSomething ? "Tampil Bergaya" : "Gaya Standar"}
                    </span>
                  </div>

                  {/* Circular Blobi Pedestal */}
                  <div className="py-6 flex items-center justify-center relative">
                    <div className="p-7 rounded-full bg-gradient-to-b from-[#FFF0F5] to-[#FFE4EC] border-2 border-candy-500/40 shadow-[0_6px_0_#B01F62,0_10px_20px_-4px_rgba(232,67,127,0.25)] transition-transform hover:scale-105">
                      <Mascot mood={blobiMood} size={160} worn={activeWorn} />
                    </div>
                  </div>

                  {/* Blobi Mood React Buttons */}
                  <div className="w-full space-y-2 pt-2 border-t-2 border-candy-100">
                    <div className="text-[11px] font-bold text-choco-600">Reaksi Blobi:</div>
                    <div className="grid grid-cols-2 gap-2">
                      {(
                        [
                          { mood: "wave" as const, label: "Sapa", icon: Hand },
                          { mood: "proud" as const, label: "Bangga", icon: Smile },
                          { mood: "celebrate" as const, label: "Rayakan", icon: PartyPopper },
                          { mood: "idle" as const, label: "Santai", icon: Coffee },
                        ] as const
                      ).map(({ mood, label, icon: Icon }) => (
                        <button
                          key={mood}
                          type="button"
                          onClick={() => setBlobiMood(mood)}
                          className={`flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-bold select-none transition-[transform,box-shadow,background-color,border-color,color] cursor-pointer active:translate-y-[1px] ${
                            blobiMood === mood
                              ? "bg-gradient-to-b from-[#FF6699] via-[#E8437F] to-[#D82668] text-white shadow-[0_2.5px_0_#B01F62] border-2 border-candy-600/50"
                              : "bg-white text-choco-700 hover:bg-candy-50 border-2 border-choco-900/18 shadow-[0_2px_0_#3B2218]"
                          }`}
                        >
                          <Icon className="size-4 shrink-0" />
                          <span>{label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Currently Worn Breakdown */}
                  <div className="w-full mt-4 p-3.5 rounded-2xl bg-white border-2 border-choco-900/15 shadow-[0_2.5px_0_#3B2218] text-left space-y-2">
                    <div className="text-[11px] font-bold uppercase tracking-wide text-choco-600 flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <span>Aksesori Aktif:</span>
                        {previewWorn && (
                          <span className="px-1.5 py-0.5 rounded-full bg-lemon border border-amber-600/40 text-[9px] font-bold text-choco-900 shadow-[0_1px_0_#C8940C]">
                            Mode Coba
                          </span>
                        )}
                      </span>
                      {isWearingSomething && (
                        <button
                          type="button"
                          onClick={() => {
                            equipOutfit(null);
                            setPreviewWorn(null);
                            playUnequip();
                            flash("Semua aksesori Blobi telah dilepas.");
                          }}
                          className="text-[10px] font-bold text-danger hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          <RotateCcw className="size-3" />
                          <span>Lepas Semua</span>
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
                      {SLOTS.map((slot) => {
                        const accId = activeWorn[slot];
                        const acc = accId ? ACCESSORIES.find((a) => a.id === accId) : null;
                        const isPreview = previewWorn && previewWorn[slot] === accId;
                        return (
                          <div
                            key={slot}
                            className={`p-2 rounded-xl border-2 transition-all ${
                              isPreview
                                ? "bg-amber-50 border-amber-400/50 shadow-[0_1.5px_0_#D97706]"
                                : acc
                                ? "bg-candy-50 border-candy-400/40 shadow-[0_1.5px_0_#B01F62]"
                                : "bg-stone-50 border-stone-200"
                            }`}
                          >
                            <span className="block text-[10px] font-bold text-choco-600">
                              {SLOT_LABEL[slot]}
                            </span>
                            <strong className="block text-[10px] sm:text-[11px] leading-tight text-choco-900 line-clamp-2 mt-0.5 min-h-[26px] flex items-center justify-center font-bold">
                              {acc ? acc.name : "Polos"}
                            </strong>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* RIGHT COLUMN: Lemari Pakaian & Koleksi (7 cols) */}
              <div className="lg:col-span-7 space-y-4">
                <div className="p-5 rounded-3xl bg-gradient-to-b from-white via-[#FFF9F5] to-[#FDEEE4] border-2 border-choco-900/18 shadow-[0_6px_0_#3B2218,0_12px_28px_-4px_rgba(59,34,24,0.12)] space-y-4">
                  {/* Closet Controls: Scope Toggle + Slot Filter */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b-2 border-choco-900/15">
                    {/* Scope: Koleksi Dimiliki vs Katalog Lengkap */}
                    <div className="w-full sm:w-auto inline-flex p-1 rounded-2xl bg-gradient-to-b from-[#FFF0F5] to-[#FFE4EC] border-2 border-candy-500/30 shadow-[0_2px_0_#B01F62] gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => setWardrobeScope("owned")}
                        className={`flex-1 sm:flex-initial px-3 py-1.5 rounded-[10px] text-xs font-pixel font-bold cursor-pointer text-center transition-[transform,box-shadow,background-color,border-color,color] ${
                          wardrobeScope === "owned"
                            ? "bg-candy-500 text-white shadow-[0_2px_0_#3B2218]"
                            : "text-choco-600 hover:text-choco-900"
                        }`}
                      >
                        Koleksi Dimiliki ({ownedCount})
                      </button>
                      <button
                        type="button"
                        onClick={() => setWardrobeScope("all")}
                        className={`flex-1 sm:flex-initial px-3 py-1.5 rounded-[10px] text-xs font-pixel font-bold cursor-pointer text-center transition-[transform,box-shadow,background-color,border-color,color] ${
                          wardrobeScope === "all"
                            ? "bg-candy-500 text-white shadow-[0_2px_0_#3B2218]"
                            : "text-choco-600 hover:text-choco-900"
                        }`}
                      >
                        Katalog Coba ({totalCount})
                      </button>
                    </div>

                    {/* Slot Filter */}
                    <div className="w-full min-w-0 flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1.5 -mx-1 px-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                      <button
                        type="button"
                        onClick={() => setWardrobeSlot("all")}
                        className={`shrink-0 px-4 py-1.5 rounded-full text-xs font-pixel font-bold whitespace-nowrap cursor-pointer transition-[transform,box-shadow,background-color,border-color,color] active:translate-y-[1px] ${
                          wardrobeSlot === "all"
                            ? "bg-candy-500 text-white border-2 border-choco-900 shadow-[0_2px_0_#3B2218]"
                            : "bg-cream text-choco-600 border-2 border-choco-900 shadow-[0_2px_0_#3B2218] hover:bg-candy-100 hover:text-choco-900"
                        }`}
                      >
                        Semua
                      </button>
                      {SLOTS.map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => setWardrobeSlot(s)}
                          className={`shrink-0 px-4 py-1.5 rounded-full text-xs font-pixel font-bold whitespace-nowrap cursor-pointer transition-[transform,box-shadow,background-color,border-color,color] active:translate-y-[1px] ${
                            wardrobeSlot === s
                              ? "bg-candy-500 text-white border-2 border-choco-900 shadow-[0_2px_0_#3B2218]"
                              : "bg-cream text-choco-600 border-2 border-choco-900 shadow-[0_2px_0_#3B2218] hover:bg-candy-100 hover:text-choco-900"
                          }`}
                        >
                          {SLOT_LABEL[s]}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Empty State if owned is 0 */}
                  {wardrobeItems.length === 0 && wardrobeScope === "owned" && (
                    <div className="py-12 text-center space-y-3">
                      <div className="size-16 mx-auto rounded-full bg-lemon/30 border-2 border-choco-900 shadow-[0_2px_0_#3B2218] flex items-center justify-center text-choco-900">
                        <Shirt className="size-8" />
                      </div>
                      <h3 className="font-pixel font-bold text-base text-choco-900">
                        Belum Ada Koleksi di Sini
                      </h3>
                      <p className="text-xs text-choco-600 max-w-sm mx-auto font-sans">
                        Kamu belum mengoleksi pakaian untuk kategori ini. Buka katalog lengkap untuk mencoba dan mendapatkan pakaian baru!
                      </p>
                      <button
                        type="button"
                        onClick={() => setWardrobeScope("all")}
                        className="px-4 py-2 rounded-[14px] bg-candy-500 text-white font-pixel font-bold text-xs border-2 border-choco-900 shadow-[0_3px_0_#3B2218] cursor-pointer active:translate-y-[1px]"
                      >
                        Lihat Katalog Lengkap ({totalCount})
                      </button>
                    </div>
                  )}

                  {/* Wardrobe Items Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {wardrobeItems.map((acc) => {
                      const owned = outfits.includes(acc.id);
                      const isEquipped = worn[acc.slot] === acc.id;
                      const isPreviewing = previewWorn && previewWorn[acc.slot] === acc.id;

                      return (
                        <div
                          key={acc.id}
                          className={`p-3.5 rounded-[18px] border-2 flex flex-col justify-between transition-[transform,box-shadow,background-color,border-color,color] ${
                            isEquipped
                              ? "bg-cream border-2 border-mint shadow-[0_4px_0_#1E9E78]"
                              : isPreviewing
                              ? "bg-candy-50 border-2 border-choco-900 shadow-[0_4px_0_#3B2218]"
                              : owned
                              ? "bg-cream border-2 border-choco-900 shadow-[0_4px_0_#3B2218] hover:translate-y-[-1px]"
                              : "bg-cream border-2 border-dashed border-choco-600 shadow-[0_2px_0_rgba(59,34,24,0.08)]"
                          }`}
                        >
                          <div className="space-y-1.5">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-pixel font-bold text-choco-600">
                                {SLOT_LABEL[acc.slot]}
                              </span>
                              {isEquipped ? (
                                <span className="inline-flex items-center gap-0.5 text-[10px] font-pixel font-bold text-[#1E9E78] bg-white px-2 py-0.5 rounded-full border border-mint">
                                  <Check className="size-3" /> Dipakai
                                </span>
                              ) : isPreviewing ? (
                                <span className="text-[10px] font-pixel font-bold text-choco-900 bg-lemon px-2 py-0.5 rounded-full border border-choco-900">
                                  Dicoba
                                </span>
                              ) : !owned ? (
                                <span className="text-[10px] font-pixel font-bold text-choco-600 bg-candy-100/70 px-2 py-0.5 rounded-full border border-choco-900/30">
                                  Belum Punya
                                </span>
                              ) : isLimitedItem(acc.id) ? (
                                <span className="text-[10px] font-pixel font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full border border-choco-900">
                                  Limited
                                </span>
                              ) : null}
                            </div>

                            {/* Pixel Art Accessory Preview */}
                            <div className="h-14 flex items-center justify-center p-1.5 rounded-[12px] bg-white border-2 border-choco-900/30">
                              <img
                                src={acc.src}
                                alt={acc.name}
                                className="max-h-11 max-w-11 object-contain"
                                style={{ imageRendering: "pixelated" }}
                              />
                            </div>

                            <div>
                              <div className="font-pixel font-bold text-xs text-choco-900 line-clamp-2 leading-tight">
                                {acc.name}
                              </div>
                              <div className="text-[10px] font-medium text-choco-600 line-clamp-2 leading-tight mt-0.5 font-sans">
                                {acc.blurb}
                              </div>
                              {isLimitedItem(acc.id) && (
                                <div className="mt-1 text-[9px] font-pixel font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-300 inline-block">
                                  Edisi Kolektor (Hanya dari Undian)
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Wardrobe Action Buttons */}
                          <div className="mt-3 pt-2 border-t-2 border-choco-900/20 flex items-center justify-between gap-1.5">
                            {owned ? (
                              isEquipped ? (
                                <button
                                  type="button"
                                  onClick={() => {
                                    equipOutfit(acc.id);
                                    setPreviewWorn(null);
                                    playUnequip();
                                    flash(`"${acc.name}" dilepas dari Blobi.`);
                                  }}
                                  className="w-full py-1.5 rounded-[10px] bg-cream border-2 border-choco-900 text-[11px] font-pixel font-bold text-danger hover:bg-candy-50 shadow-[0_2px_0_#3B2218] active:translate-y-[1px] active:shadow-none transition-[transform,box-shadow,background-color,border-color,color] cursor-pointer"
                                >
                                  Lepas
                                </button>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => {
                                    equipOutfit(acc.id);
                                    setPreviewWorn(null);
                                    playEquip();
                                    flash(`"${acc.name}" dipasang pada Blobi!`);
                                  }}
                                  className="w-full py-1.5 rounded-[10px] bg-candy-500 text-white border-2 border-choco-900 text-[11px] font-pixel font-bold hover:bg-candy-600 shadow-[0_2px_0_#3B2218] active:translate-y-[1px] active:shadow-none transition-[transform,box-shadow,background-color,border-color,color] cursor-pointer"
                                >
                                  Pakai
                                </button>
                              )
                            ) : (
                              <div className="w-full flex items-center gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (isPreviewing) {
                                      setPreviewWorn((prev) => {
                                        if (!prev) return null;
                                        const next = { ...prev };
                                        delete next[acc.slot];
                                        return Object.keys(next).length > 0 ? next : null;
                                      });
                                      playUnequip();
                                      flash(`"${acc.name}" dicopot dari percobaan.`);
                                    } else {
                                      setPreviewWorn((prev) => ({
                                        ...(prev ?? worn),
                                        [acc.slot]: acc.id,
                                      }));
                                      playEquip();
                                      flash(`Mencoba "${acc.name}" pada Blobi!`);
                                    }
                                  }}
                                  className={`flex-1 py-1 rounded-[10px] text-[10px] font-pixel font-bold cursor-pointer transition-[transform,box-shadow,background-color,border-color,color] active:translate-y-[1px] ${
                                    isPreviewing
                                      ? "bg-white border-2 border-danger text-danger hover:bg-candy-50 shadow-[0_1px_0_#3B2218]"
                                      : "bg-candy-100 border-2 border-choco-900 text-candy-600 hover:bg-candy-200 shadow-[0_2px_0_#3B2218]"
                                  }`}
                                >
                                  {isPreviewing ? "Lepas" : "Coba"}
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setConfirm(acc)}
                                  className="flex-1 py-1 rounded-[10px] bg-lemon text-choco-900 border-2 border-choco-900 text-[10px] font-pixel font-bold hover:bg-lemon-deep shadow-[0_2px_0_#3B2218] active:translate-y-[1px] cursor-pointer"
                                >
                                  Beli
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Purchase Confirmation Dialog */}
        {confirm && (
          <Dialog
            title={`Beli ${confirm.name}?`}
            open={!!confirm}
            onClose={() => setConfirm(null)}
          >
            <div className="space-y-4 pt-2">
              <div className="p-4 rounded-[18px] bg-cream border-2 border-choco-900 shadow-[0_3px_0_#3B2218] flex items-center gap-4">
                <div className="size-16 rounded-[14px] bg-white border-2 border-choco-900 flex items-center justify-center p-2 shrink-0 shadow-[0_2px_0_#3B2218]">
                  <img
                    src={confirm.src}
                    alt={confirm.name}
                    className="max-h-12 max-w-12 object-contain"
                    style={{ imageRendering: "pixelated" }}
                  />
                </div>
                <div>
                  <span className="text-[10px] font-pixel font-bold uppercase tracking-wider text-choco-600 px-2 py-0.5 rounded-full bg-candy-100 border border-choco-900">
                    {SLOT_LABEL[confirm.slot]}
                  </span>
                  <h4 className="font-pixel font-bold text-sm text-choco-900 mt-1">{confirm.name}</h4>
                  <p className="text-xs text-choco-600 mt-0.5 leading-relaxed">{confirm.blurb}</p>
                </div>
              </div>

              <div className="p-3 rounded-[16px] bg-lemon/20 border-2 border-choco-900 flex items-center justify-between shadow-[0_2px_0_#3B2218]">
                <span className="text-xs font-pixel font-bold text-choco-900">Harga item:</span>
                <span className="flex items-center gap-1.5 text-sm font-pixel font-bold text-choco-900">
                  <BlockStamp size={14} className="text-lemon" />
                  {confirm.cost} Koin
                </span>
              </div>

              <div className="text-xs text-choco-600 text-center font-sans">
                Setelah dibeli, pakaian ini akan langsung tersimpan di <strong className="text-choco-900 font-pixel">Ruang Ganti Blobi</strong> kamu.
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
                  disabled={gems < confirm.cost}
                  onClick={() => purchase(confirm)}
                >
                  {gems >= confirm.cost ? "Konfirmasi Pembelian" : "Koin Kurang"}
                </TactileButton>
              </div>
            </div>
          </Dialog>
        )}
      </main>
    </AppShell>
  );
}
