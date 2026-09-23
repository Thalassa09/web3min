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
import { FREEZE_COST, HEART_REFILL_COST } from "@/lib/shop";
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
        <div className="p-3 sm:p-4 rounded-[22px] bg-cream border-3 border-choco-900 shadow-[0_6px_0_#3B2218]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            {/* Mode Switcher Buttons */}
            <div className="inline-flex p-1.5 rounded-[18px] bg-candy-100 border-2 border-choco-900 shadow-[0_2px_0_#3B2218] gap-1.5 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => handleModeChange("shop")}
                className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-2.5 rounded-[14px] font-pixel font-bold text-sm select-none cursor-pointer transition-[transform,box-shadow,background-color,border-color,color] duration-150 ease-out active:translate-y-[1px] ${
                  mode === "shop"
                    ? "bg-candy-500 text-white border-2 border-choco-900 shadow-[0_2px_0_#3B2218]"
                    : "text-choco-600 hover:text-choco-900 hover:bg-white/60 border-2 border-transparent"
                }`}
              >
                <Store className="size-4.5" />
                <span>Toko</span>
              </button>

              <button
                type="button"
                onClick={() => handleModeChange("wardrobe")}
                className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-2.5 rounded-[14px] font-pixel font-bold text-sm select-none cursor-pointer transition-[transform,box-shadow,background-color,border-color,color] duration-150 ease-out active:translate-y-[1px] ${
                  mode === "wardrobe"
                    ? "bg-candy-500 text-white border-2 border-choco-900 shadow-[0_2px_0_#3B2218]"
                    : "text-choco-600 hover:text-choco-900 hover:bg-white/60 border-2 border-transparent"
                }`}
              >
                <Sparkles className="size-4.5" />
                <span>Ruang Ganti Blobi</span>
                {ownedCount > 0 && (
                  <span
                    className={`ml-1 px-2 py-0.5 rounded-full text-[10px] font-pixel font-bold ${
                      mode === "wardrobe"
                        ? "bg-lemon text-choco-900 border border-choco-900"
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
              <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-[12px] bg-cream border-2 border-choco-900 text-xs font-pixel font-bold text-choco-900 shadow-[0_2px_0_#3B2218]">
                <Star size={14} className="text-lemon" fill="currentColor" />
                <span className="tabular-nums">{formatGems(gems)} Bintang</span>
              </div>
            </div>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════ */}
        {/* MODE 1: TOKO (Store View)                             */}
        {/* ═══════════════════════════════════════════════════════ */}
        {mode === "shop" && (
          <div className="space-y-6">
            {/* Header Toko (Shown on tablet/desktop; on mobile the Mode Switcher above already acts as header) */}
            <div className="hidden sm:block p-4 sm:p-6 rounded-[22px] bg-cream border-3 border-choco-900 shadow-[0_6px_0_#3B2218] space-y-2">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h1 className="font-pixel font-bold text-xl sm:text-3xl text-choco-900 tracking-tight flex items-center gap-2">
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
                  className="px-3.5 py-1.5 rounded-[12px] bg-candy-100 border-2 border-choco-900 text-candy-600 text-xs font-pixel font-bold hover:bg-candy-200 shadow-[0_2px_0_#3B2218] transition-[transform,box-shadow,background-color,border-color,color] flex items-center gap-1.5 shrink-0 cursor-pointer active:translate-y-[1px]"
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

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {/* 1. Pelindung Streak */}
                <div className="flex flex-col rounded-[20px] border-2 border-choco-900 bg-cream p-5 shadow-[0_4px_0_#3B2218]">
                  <div className="mb-3.5 grid size-12 place-items-center rounded-2xl border-2 border-choco-900 bg-streak/20 text-streak shadow-[0_2px_0_#3B2218]">
                    <Shield className="size-6" strokeWidth={2.4} />
                  </div>
                  <h3 className="text-[17px] font-pixel font-bold text-choco-900">Pelindung Streak</h3>
                  <p className="mt-1.5 font-semibold leading-relaxed text-choco-600 text-xs font-sans">
                    Streak aman kalau kamu bolos satu hari tanpa belajar.
                  </p>
                  <div className="mt-2 text-xs font-pixel font-bold text-choco-900 bg-candy-100/60 p-2 rounded-[10px] border border-choco-900/30">
                    Dimiliki: <strong>{freeze} Pelindung</strong>
                  </div>
                  <div className="mt-auto flex items-center justify-between pt-4 border-t-2 border-choco-900/20">
                    <span className="flex items-center gap-1 font-pixel text-base font-bold text-choco-900">
                      <Star size={16} className="text-lemon" fill="currentColor" /> {FREEZE_COST}
                    </span>
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
                      className={`inline-flex items-center justify-center rounded-xl border-2 border-choco-900 px-4 py-2 text-xs font-pixel font-bold transition-[transform,box-shadow] ${
                        freeze > 0 || gems < FREEZE_COST
                          ? "cursor-not-allowed border-choco-900/40 bg-choco-900/10 text-choco-600/50 shadow-none"
                          : "bg-candy-500 text-white shadow-[0_3px_0_#3B2218] hover:bg-candy-600 active:translate-y-[1px] active:shadow-none"
                      }`}
                    >
                      {freeze > 0 ? "Sudah Aktif" : gems < FREEZE_COST ? "Kurang" : "Beli"}
                    </button>
                  </div>
                </div>

                {/* 2. Isi Ulang Nyawa */}
                <div className="flex flex-col rounded-[20px] border-2 border-choco-900 bg-cream p-5 shadow-[0_4px_0_#3B2218]">
                  <div className="mb-3.5 grid size-12 place-items-center rounded-2xl border-2 border-choco-900 bg-danger/20 text-danger shadow-[0_2px_0_#3B2218]">
                    <Heart className="size-6" strokeWidth={2.4} fill="currentColor" />
                  </div>
                  <h3 className="text-[17px] font-pixel font-bold text-choco-900">Isi Ulang Nyawa</h3>
                  <p className="mt-1.5 font-semibold leading-relaxed text-choco-600 text-xs font-sans">
                    Balik ke 5/5 nyawa penuh dan langsung lanjut latihan.
                  </p>
                  <div className="mt-2 text-xs font-pixel font-bold text-choco-900 bg-candy-100/60 p-2 rounded-[10px] border border-choco-900/30">
                    Nyawa: <strong className="text-danger">{hearts}/{MAX_HEARTS} Hati</strong>
                  </div>
                  <div className="mt-auto flex items-center justify-between pt-4 border-t-2 border-choco-900/20">
                    <span className="flex items-center gap-1 font-pixel text-base font-bold text-choco-900">
                      <Star size={16} className="text-lemon" fill="currentColor" /> {HEART_REFILL_COST}
                    </span>
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
                      className={`inline-flex items-center justify-center rounded-xl border-2 border-choco-900 px-4 py-2 text-xs font-pixel font-bold transition-[transform,box-shadow] ${
                        heartsFull || gems < HEART_REFILL_COST
                          ? "cursor-not-allowed border-choco-900/40 bg-choco-900/10 text-choco-600/50 shadow-none"
                          : "bg-candy-500 text-white shadow-[0_3px_0_#3B2218] hover:bg-candy-600 active:translate-y-[1px] active:shadow-none"
                      }`}
                    >
                      {heartsFull ? "Penuh" : gems < HEART_REFILL_COST ? "Kurang" : "Beli"}
                    </button>
                  </div>
                </div>

                {/* 3. Mahkota Blobi */}
                <div className="flex flex-col rounded-[20px] border-2 border-choco-900 bg-cream p-5 shadow-[0_4px_0_#3B2218]">
                  <div className="mb-3.5 grid size-12 place-items-center rounded-2xl border-2 border-choco-900 bg-lemon/30 text-lemon-deep shadow-[0_2px_0_#3B2218]">
                    <Crown className="size-6" strokeWidth={2.4} />
                  </div>
                  <h3 className="text-[17px] font-pixel font-bold text-choco-900">Mahkota Blobi</h3>
                  <p className="mt-1.5 font-semibold leading-relaxed text-choco-600 text-xs font-sans">
                    Kosmetik langka untuk Blobi-mu di lisensi profil.
                  </p>
                  <div className="mt-2 text-xs font-pixel font-bold text-choco-900 bg-candy-100/60 p-2 rounded-[10px] border border-choco-900/30">
                    Status: <strong>{outfits.includes("crown") ? "Sudah Dimiliki" : "Belum Dimiliki"}</strong>
                  </div>
                  <div className="mt-auto flex items-center justify-between pt-4 border-t-2 border-choco-900/20">
                    <span className="flex items-center gap-1 font-pixel text-base font-bold text-choco-900">
                      <Star size={16} className="text-lemon" fill="currentColor" /> 120
                    </span>
                    <button
                      type="button"
                      disabled={outfits.includes("crown") || gems < 120}
                      onClick={() => {
                        if (buyOutfit("crown")) {
                          playBuy();
                          flash("Mahkota Blobi berhasil dibuka di Ruang Ganti!");
                        } else {
                          playDeny();
                        }
                      }}
                      className={`inline-flex items-center justify-center rounded-xl border-2 border-choco-900 px-4 py-2 text-xs font-pixel font-bold transition-[transform,box-shadow] ${
                        outfits.includes("crown") || gems < 120
                          ? "cursor-not-allowed border-choco-900/40 bg-choco-900/10 text-choco-600/50 shadow-none"
                          : "bg-candy-500 text-white shadow-[0_3px_0_#3B2218] hover:bg-candy-600 active:translate-y-[1px] active:shadow-none"
                      }`}
                    >
                      {outfits.includes("crown") ? "Dimiliki" : gems < 120 ? "Kurang" : "Beli"}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Exclusive Wardrobe Banner */}
            <div className="p-5 sm:p-6 rounded-[22px] bg-cream border-3 border-choco-900 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-[0_6px_0_#3B2218]">
              <div className="flex items-center gap-4 text-center sm:text-left">
                <div className="size-14 rounded-full bg-candy-100 border-2 border-choco-900 shadow-[0_2px_0_#3B2218] flex items-center justify-center shrink-0">
                  <Sparkles className="size-7 text-candy-500" />
                </div>
                <div>
                  <h3 className="font-pixel font-bold text-base sm:text-lg text-choco-900">
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
                className="shrink-0 px-4 py-2 rounded-[14px] bg-candy-500 text-white font-pixel font-bold text-xs border-2 border-choco-900 shadow-[0_3px_0_#3B2218] flex items-center gap-1 cursor-pointer active:translate-y-[1px]"
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
            {/* Header Ruang Ganti (Shown on tablet/desktop; on mobile the Mode Switcher above already acts as header) */}
            <div className="hidden sm:block p-4 sm:p-6 rounded-[22px] bg-cream border-3 border-choco-900 shadow-[0_6px_0_#3B2218] space-y-2">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h1 className="font-pixel font-bold text-xl sm:text-3xl text-choco-900 tracking-tight flex items-center gap-2">
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
                <div className="p-6 rounded-[22px] flex flex-col items-center text-center bg-cream border-3 border-choco-900 shadow-[0_6px_0_#3B2218]">
                  <div className="w-full flex items-center justify-between pb-3 border-b-2 border-choco-900/20">
                    <span className="text-xs font-pixel font-bold text-choco-900">Panggung Busana</span>
                    <span className="text-[11px] font-bold text-choco-600">
                      {isWearingSomething ? "Tampil Bergaya" : "Gaya Standar"}
                    </span>
                  </div>

                  {/* Circular Blobi Pedestal */}
                  <div className="py-6 flex items-center justify-center relative">
                    <div className="p-7 rounded-full bg-candy-100 border-4 border-choco-900 shadow-[0_8px_0_#3B2218] transition-transform hover:scale-105">
                      <Mascot mood={blobiMood} size={160} worn={activeWorn} />
                    </div>
                  </div>

                  {/* Blobi Mood React Buttons */}
                  <div className="w-full space-y-2 pt-2 border-t-2 border-candy-100">
                    <div className="text-[11px] font-pixel font-bold text-choco-600">Reaksi Blobi:</div>
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
                          className={`flex items-center justify-center gap-2 px-3 py-2 rounded-[14px] text-xs font-pixel font-bold select-none transition-[transform,box-shadow,background-color,border-color,color] cursor-pointer active:translate-y-[1px] ${
                            blobiMood === mood
                              ? "bg-candy-500 text-white shadow-[0_2px_0_#3B2218] border-2 border-choco-900"
                              : "bg-cream text-choco-600 hover:bg-candy-100 border-2 border-choco-900 shadow-[0_2px_0_#3B2218]"
                          }`}
                        >
                          <Icon className="size-4 shrink-0" />
                          <span>{label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Currently Worn Breakdown */}
                  <div className="w-full mt-4 p-3 rounded-[16px] bg-cream border-2 border-choco-900 shadow-[0_3px_0_#3B2218] text-left space-y-2">
                    <div className="text-[11px] font-pixel font-bold uppercase tracking-wide text-choco-600 flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <span>Aksesori Aktif:</span>
                        {previewWorn && (
                          <span className="px-1.5 py-0.5 rounded-full bg-lemon border border-choco-900 text-[9px] font-pixel font-bold text-choco-900">
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
                          className="text-[10px] font-pixel font-bold text-danger hover:underline flex items-center gap-1 cursor-pointer"
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
                            className={`p-2 rounded-[10px] border-2 ${
                              isPreview
                                ? "bg-lemon/20 border-choco-900 shadow-[0_1px_0_#3B2218]"
                                : acc
                                ? "bg-candy-100 border-choco-900 shadow-[0_1px_0_#3B2218]"
                                : "bg-cream/60 border-choco-900/30"
                            }`}
                          >
                            <span className="block text-[10px] font-pixel font-bold text-choco-600">
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
                <div className="p-5 rounded-[22px] bg-cream border-3 border-choco-900 shadow-[0_6px_0_#3B2218] space-y-4">
                  {/* Closet Controls: Scope Toggle + Slot Filter */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b-2 border-choco-900/20">
                    {/* Scope: Koleksi Dimiliki vs Katalog Lengkap */}
                    <div className="w-full sm:w-auto inline-flex p-1 rounded-[14px] bg-candy-100 border-2 border-choco-900 shadow-[0_2px_0_#3B2218] gap-1 shrink-0">
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
                        Lihat Katalog Lengkap ({totalCount}) →
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
                  {confirm.cost} Bintang
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
                  {gems >= confirm.cost ? "Konfirmasi Pembelian" : "Bintang Kurang"}
                </TactileButton>
              </div>
            </div>
          </Dialog>
        )}
      </main>
    </AppShell>
  );
}
