import { useMemo, useState, useEffect } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Ticket,
  ShieldCheck,
  Heart,
  Sparkles,
  Check,
  RotateCcw,
  ArrowRight,
  ShoppingBag,
  Shirt,
  Store,
  Layers,
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

  const isWearingSomething = Boolean(worn.hat || worn.face || worn.neck || worn.held);

  return (
    <AppShell>
      <main className="px-3 py-4 sm:px-4 sm:py-6 pb-[calc(6rem+env(safe-area-inset-bottom))] sm:pb-28 max-w-6xl mx-auto space-y-6">
        {/* Flash Notification */}
        {note && (
          <div className="p-3.5 rounded-[18px] bg-[#E8FBF0] border-2 border-[#98E4B5] text-[#1E8A49] text-sm font-extrabold flex flex-col sm:flex-row items-center justify-between gap-2 shadow-[0_3px_0_#98E4B5] animate-in fade-in slide-in-from-top-2">
            <span>{note.text}</span>
            {note.actionText && note.onAction && (
              <button
                type="button"
                onClick={note.onAction}
                className="px-3.5 py-1 rounded-[10px] bg-[#1E8A49] text-white text-xs font-extrabold hover:bg-[#156E38] shadow-[0_2px_0_#0E4F28] cursor-pointer"
              >
                {note.actionText} →
              </button>
            )}
          </div>
        )}

        {/* PRIMARY MODE SELECTOR: Toko vs Ruang Ganti Blobi */}
        <SurfaceCard className="p-3 sm:p-4 bg-white border-2 border-[#B9CFE9] shadow-[0_6px_0_#0B4FD1]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            {/* Mode Switcher Buttons */}
            <div className="inline-flex p-1.5 rounded-[18px] bg-[#E4F0FF] border-2 border-[#B9CFE9] shadow-inner gap-1.5 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => handleModeChange("shop")}
                className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-2.5 rounded-[14px] font-display font-bold text-sm select-none cursor-pointer transition-all duration-150 ease-out active:translate-y-[1px] ${
                  mode === "shop"
                    ? "bg-[#0B63F6] text-white border-2 border-[#0B4FD1] shadow-[0_3px_0_#0B4FD1]"
                    : "text-[#4A6580] hover:text-[#0D2340] hover:bg-white/60 border-2 border-transparent"
                }`}
              >
                <Store className="size-4.5" />
                <span>Toko</span>
              </button>

              <button
                type="button"
                onClick={() => handleModeChange("wardrobe")}
                className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-2.5 rounded-[14px] font-display font-bold text-sm select-none cursor-pointer transition-all duration-150 ease-out active:translate-y-[1px] ${
                  mode === "wardrobe"
                    ? "bg-[#0B63F6] text-white border-2 border-[#0B4FD1] shadow-[0_3px_0_#0B4FD1]"
                    : "text-[#4A6580] hover:text-[#0D2340] hover:bg-white/60 border-2 border-transparent"
                }`}
              >
                <Sparkles className="size-4.5" />
                <span>Ruang Ganti Blobi</span>
                {ownedCount > 0 && (
                  <span
                    className={`ml-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-extrabold ${
                      mode === "wardrobe"
                        ? "bg-[#FFC61A] text-[#0D2340]"
                        : "bg-[#0B63F6] text-white"
                    }`}
                  >
                    {ownedCount}
                  </span>
                )}
              </button>
            </div>

            {/* Currency & Inventory Badges (Hidden on mobile to avoid duplication with top status bar) */}
            <div className="hidden sm:flex items-center gap-2 justify-end">
              <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#FFF7D1] border-2 border-[#FFD84D] text-xs font-extrabold text-[#B27B00] shadow-[0_2px_0_#FFE680]">
                <BlockStamp size={14} className="text-[#FFC61A]" />
                <span>{formatGems(gems)} Bintang</span>
              </div>
              <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#E4F0FF] border-2 border-[#8FC2FF] text-xs font-extrabold text-[#0B4FD1] shadow-[0_2px_0_#C2DBFA]">
                <Ticket className="size-3.5" />
                <span>{raffleTickets} Tiket</span>
              </div>
            </div>
          </div>
        </SurfaceCard>

        {/* ═══════════════════════════════════════════════════════ */}
        {/* MODE 1: TOKO (Store View)                             */}
        {/* ═══════════════════════════════════════════════════════ */}
        {mode === "shop" && (
          <div className="space-y-6">
            {/* Header Toko (Shown on tablet/desktop; on mobile the Mode Switcher above already acts as header) */}
            <SurfaceCard className="hidden sm:block p-4 sm:p-6 bg-white space-y-2">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h1 className="font-display font-bold text-xl sm:text-3xl text-[#0D2340] tracking-tight flex items-center gap-2">
                    <Store className="size-6 sm:size-7 text-[#0B63F6]" />
                    <span>Toko</span>
                  </h1>
                  <p className="text-xs sm:text-sm font-medium text-[#4A6580] mt-0.5 leading-relaxed">
                    Tukarkan bintang dari hasil belajar untuk membeli penguat streak, tiket undian hadiah nyata, dan isi ulang nyawa.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleModeChange("wardrobe")}
                  className="px-3.5 py-1.5 rounded-[12px] bg-[#E4F0FF] border-2 border-[#8FC2FF] text-[#0B4FD1] text-xs font-extrabold hover:bg-[#D4E8FF] shadow-[0_2px_0_#C2DBFA] transition-all flex items-center gap-1.5 shrink-0 cursor-pointer active:translate-y-[1px]"
                >
                  <Shirt className="size-3.5" />
                  <span>Ruang Ganti ({ownedCount})</span>
                  <ArrowRight className="size-3" />
                </button>
              </div>
            </SurfaceCard>

            {/* SECTION: Penguat Belajar (Boosters & Utility) */}
            <div className="space-y-3">
              <div className="flex items-center justify-between px-1">
                <h2 className="text-sm font-extrabold text-white uppercase tracking-wider drop-shadow-sm flex items-center gap-2">
                  <ShieldCheck className="size-4.5 text-[#FFC61A]" />
                  <span>Item & Penguat Belajar</span>
                </h2>
                <span className="text-xs font-bold text-white/80">3 Item Tersedia</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* 1. Tiket Undian Web3 */}
                <SurfaceCard className="p-5 bg-white border-2 border-[#8FC2FF] flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="p-3 rounded-[16px] bg-[#E4F0FF] text-[#0B63F6] border-2 border-[#8FC2FF] shadow-[0_2px_0_#C2DBFA]">
                        <Ticket className="size-6" />
                      </div>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-[#FFF7D1] text-[#B27B00] border border-[#FFD84D]">
                        Hadiah Riil
                      </span>
                    </div>
                    <div>
                      <h3 className="font-display font-bold text-base text-[#0D2340]">
                        Tiket Undian Web3
                      </h3>
                      <p className="text-xs text-[#4A6580] mt-1 leading-relaxed">
                        Tiket resmi untuk mengikuti undian USDT, merchandise, dan whitelist di Arena Undian.
                      </p>
                    </div>
                    <div className="text-xs font-bold text-[#1E3A5F] bg-[#F0F6FF] p-2 rounded-[10px] border border-[#DCE7F5]">
                      Saldo: <strong className="text-[#0B4FD1] font-mono">{raffleTickets} Tiket</strong>
                    </div>
                  </div>

                  <div className="pt-2 border-t-2 border-[#F0F6FF] flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1 text-xs font-extrabold text-[#B27B00]">
                      <BlockStamp size={13} className="text-[#FFC61A]" />
                      <span>50 Bintang</span>
                    </div>
                    <TactileButton
                      variant="primary"
                      size="sm"
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
                      Tukar Tiket
                    </TactileButton>
                  </div>
                </SurfaceCard>

                {/* 2. Pelindung Streak */}
                <SurfaceCard className="p-5 bg-white flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="p-3 rounded-[16px] bg-[#FFF0E4] text-[#FF7A18] border-2 border-[#FFB580] shadow-[0_2px_0_#FFB580]">
                        <ShieldCheck className="size-6" />
                      </div>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-[#E4F0FF] text-[#0B4FD1] border border-[#8FC2FF]">
                        Otomatis
                      </span>
                    </div>
                    <div>
                      <h3 className="font-display font-bold text-base text-[#0D2340]">
                        Pelindung Streak
                      </h3>
                      <p className="text-xs text-[#4A6580] mt-1 leading-relaxed">
                        Menjaga agar rekor hari berturut-turut belajarmu tidak hangus jika terlewat satu hari.
                      </p>
                    </div>
                    <div className="text-xs font-bold text-[#1E3A5F] bg-[#F0F6FF] p-2 rounded-[10px] border border-[#DCE7F5]">
                      Status: {freeze > 0 ? <strong className="text-[#FF7A18]">Aktif ({freeze} siap)</strong> : "Belum Aktif"}
                    </div>
                  </div>

                  <div className="pt-2 border-t-2 border-[#F0F6FF] flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1 text-xs font-extrabold text-[#B27B00]">
                      <BlockStamp size={13} className="text-[#FFC61A]" />
                      <span>{FREEZE_COST} Bintang</span>
                    </div>
                    <TactileButton
                      variant="secondary"
                      size="sm"
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
                      {freeze > 0 ? "Sudah Aktif" : "Pasang"}
                    </TactileButton>
                  </div>
                </SurfaceCard>

                {/* 3. Isi Ulang Nyawa Penuh */}
                <SurfaceCard className="p-5 bg-white flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="p-3 rounded-[16px] bg-[#FFF5F5] text-[#E63329] border-2 border-[#F4A4A0] shadow-[0_2px_0_#F4A4A0]">
                        <Heart className="size-6" />
                      </div>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-[#FFF5F5] text-[#E63329] border border-[#F4A4A0]">
                        Instan
                      </span>
                    </div>
                    <div>
                      <h3 className="font-display font-bold text-base text-[#0D2340]">
                        Isi Ulang Nyawa
                      </h3>
                      <p className="text-xs text-[#4A6580] mt-1 leading-relaxed">
                        Pulihkan nyawa belajarmu ke 5/5 seketika agar bisa lanjut latihan tanpa menunggu.
                      </p>
                    </div>
                    <div className="text-xs font-bold text-[#1E3A5F] bg-[#F0F6FF] p-2 rounded-[10px] border border-[#DCE7F5]">
                      Nyawa: <strong className="text-[#E63329]">{hearts}/{MAX_HEARTS} Hati</strong>
                    </div>
                  </div>

                  <div className="pt-2 border-t-2 border-[#F0F6FF] flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1 text-xs font-extrabold text-[#B27B00]">
                      <BlockStamp size={13} className="text-[#FFC61A]" />
                      <span>{HEART_REFILL_COST} Bintang</span>
                    </div>
                    <TactileButton
                      variant="danger"
                      size="sm"
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
                      {heartsFull ? "Penuh" : "Isi Ulang"}
                    </TactileButton>
                  </div>
                </SurfaceCard>
              </div>
            </div>

            {/* Exclusive Wardrobe Banner */}
            <SurfaceCard className="p-5 sm:p-6 bg-gradient-to-r from-[#EAF4FF] to-[#FFF7E4] border-2 border-[#8FC2FF] flex flex-col sm:flex-row items-center justify-between gap-4 shadow-[0_4px_0_#0B4FD1]">
              <div className="flex items-center gap-4 text-center sm:text-left">
                <div className="size-14 rounded-full bg-white border-2 border-[#8FC2FF] shadow-[0_3px_0_#C2DBFA] flex items-center justify-center shrink-0">
                  <Sparkles className="size-7 text-[#0B63F6]" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-base sm:text-lg text-[#0D2340]">
                    Koleksi Pakaian & Aksesori Blobi
                  </h3>
                  <p className="text-xs sm:text-sm text-[#4A6580] mt-0.5 leading-relaxed">
                    Semua baju, topi, kacamata, dan aksesori Blobi kini tersedia eksklusif di <strong>Ruang Ganti Blobi</strong>. Coba atau pasang langsung pada karaktermu!
                  </p>
                </div>
              </div>
              <TactileButton
                variant="primary"
                size="sm"
                onClick={() => handleModeChange("wardrobe")}
                className="shrink-0"
              >
                <span>Buka Ruang Ganti Blobi</span>
                <ArrowRight className="size-3.5 ml-1" />
              </TactileButton>
            </SurfaceCard>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════ */}
        {/* MODE 2: RUANG GANTI BLOBI (Wardrobe & Dressing View)   */}
        {/* ═══════════════════════════════════════════════════════ */}
        {mode === "wardrobe" && (
          <div className="space-y-6">
            {/* Header Ruang Ganti (Shown on tablet/desktop; on mobile the Mode Switcher above already acts as header) */}
            <SurfaceCard className="hidden sm:block p-4 sm:p-6 bg-white space-y-2">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h1 className="font-display font-bold text-xl sm:text-3xl text-[#0D2340] tracking-tight flex items-center gap-2">
                    <Sparkles className="size-6 sm:size-7 text-[#0B63F6]" />
                    <span>Ruang Ganti Blobi</span>
                  </h1>
                  <p className="text-xs sm:text-sm font-medium text-[#4A6580] mt-0.5 leading-relaxed">
                    Atur gaya dan padukan penampilan Blobi. Coba berbagai pakaian yang sudah kamu miliki, atau coba aksesori baru langsung pada karakter!
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="px-3 py-1 rounded-full bg-[#E8FBF0] border-2 border-[#98E4B5] text-[#1E8A49] text-xs font-extrabold shadow-[0_2px_0_#98E4B5]">
                    {ownedCount}/{totalCount} Koleksi
                  </span>
                  <button
                    type="button"
                    onClick={() => handleModeChange("shop")}
                    className="px-3 py-1.5 rounded-[12px] bg-[#FFF7D1] border-2 border-[#FFD84D] text-[#B27B00] text-xs font-extrabold hover:bg-[#FFEAA6] shadow-[0_2px_0_#FFD84D] transition-all flex items-center gap-1 cursor-pointer active:translate-y-[1px]"
                  >
                    <Store className="size-3.5" />
                    <span className="hidden sm:inline">Toko</span>
                  </button>
                </div>
              </div>
            </SurfaceCard>

            {/* 2-Column Layout: Left Stage vs Right Wardrobe Closet */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* LEFT COLUMN: Panggung Busana Blobi (5 cols) */}
              <div className="lg:col-span-5 space-y-4">
                <SurfaceCard className="p-6 flex flex-col items-center text-center bg-white border-2 border-[#8FC2FF] shadow-[0_6px_0_#0B4FD1]">
                  <div className="w-full flex items-center justify-between pb-3 border-b-2 border-[#DCE7F5]">
                    <span className="text-xs font-extrabold text-[#0D2340]">Panggung Busana</span>
                    <span className="text-[11px] font-bold text-[#4A6580]">
                      {isWearingSomething ? "Tampil Bergaya" : "Gaya Standar"}
                    </span>
                  </div>

                  {/* Circular Blobi Pedestal */}
                  <div className="py-6 flex items-center justify-center relative">
                    <div className="p-7 rounded-full bg-[#E4F0FF] border-4 border-[#8FC2FF] shadow-[0_8px_0_#C2DBFA] transition-transform hover:scale-105">
                      <Mascot mood={blobiMood} size={160} worn={activeWorn} />
                    </div>
                  </div>

                  {/* Blobi Mood React Buttons */}
                  <div className="w-full space-y-2 pt-2 border-t-2 border-[#F0F6FF]">
                    <div className="text-[11px] font-bold text-[#4A6580]">Reaksi Blobi:</div>
                    <div className="flex items-center justify-center gap-1.5 flex-wrap">
                      {(["wave", "proud", "celebrate", "idle"] as MascotMood[]).map((m) => (
                        <button
                          key={m}
                          type="button"
                          onClick={() => setBlobiMood(m)}
                          className={`px-2.5 py-1 rounded-[10px] text-xs font-extrabold capitalize transition-all cursor-pointer ${
                            blobiMood === m
                              ? "bg-[#0B63F6] text-white shadow-[0_2px_0_#0B4FD1]"
                              : "bg-[#F0F6FF] text-[#4A6580] hover:bg-[#E4F0FF]"
                          }`}
                        >
                          {m === "wave" ? "👋 Sapa" : m === "proud" ? "😎 Bangga" : m === "celebrate" ? "🎉 Rayakan" : "😊 Santai"}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Currently Worn Breakdown */}
                  <div className="w-full mt-4 p-3 rounded-[16px] bg-[#F7FAFC] border-2 border-[#DCE7F5] text-left space-y-2">
                    <div className="text-[11px] font-extrabold uppercase tracking-wide text-[#4A6580] flex items-center justify-between">
                      <span>Aksesori Aktif:</span>
                      {isWearingSomething && (
                        <button
                          type="button"
                          onClick={() => {
                            equipOutfit(null);
                            setPreviewWorn(null);
                            playUnequip();
                            flash("Semua aksesori Blobi telah dilepas.");
                          }}
                          className="text-[10px] font-extrabold text-[#B01E18] hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          <RotateCcw className="size-3" />
                          <span>Lepas Semua</span>
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-center text-xs">
                      <div className="p-2 rounded-[10px] bg-white border border-[#DCE7F5]">
                        <span className="block text-[10px] font-bold text-[#4A6580]">Kepala</span>
                        <strong className="block text-[10px] sm:text-[11px] leading-tight text-[#0D2340] line-clamp-2 mt-0.5 min-h-[26px] flex items-center justify-center">
                          {activeWorn.hat ? ACCESSORIES.find((a) => a.id === activeWorn.hat)?.name : "Polos"}
                        </strong>
                      </div>
                      <div className="p-2 rounded-[10px] bg-white border border-[#DCE7F5]">
                        <span className="block text-[10px] font-bold text-[#4A6580]">Wajah</span>
                        <strong className="block text-[10px] sm:text-[11px] leading-tight text-[#0D2340] line-clamp-2 mt-0.5 min-h-[26px] flex items-center justify-center">
                          {activeWorn.face ? ACCESSORIES.find((a) => a.id === activeWorn.face)?.name : "Polos"}
                        </strong>
                      </div>
                      <div className="p-2 rounded-[10px] bg-white border border-[#DCE7F5]">
                        <span className="block text-[10px] font-bold text-[#4A6580]">Leher</span>
                        <strong className="block text-[10px] sm:text-[11px] leading-tight text-[#0D2340] line-clamp-2 mt-0.5 min-h-[26px] flex items-center justify-center">
                          {activeWorn.neck ? ACCESSORIES.find((a) => a.id === activeWorn.neck)?.name : "Polos"}
                        </strong>
                      </div>
                    </div>
                  </div>
                </SurfaceCard>
              </div>

              {/* RIGHT COLUMN: Lemari Pakaian & Koleksi (7 cols) */}
              <div className="lg:col-span-7 space-y-4">
                <SurfaceCard className="p-5 bg-white space-y-4">
                  {/* Closet Controls: Scope Toggle + Slot Filter */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b-2 border-[#F0F6FF]">
                    {/* Scope: Koleksi Dimiliki vs Katalog Lengkap */}
                    <div className="inline-flex p-1 rounded-[14px] bg-[#E4F0FF] border border-[#B9CFE9] gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => setWardrobeScope("owned")}
                        className={`px-3 py-1.5 rounded-[10px] text-xs font-extrabold cursor-pointer transition-all ${
                          wardrobeScope === "owned"
                            ? "bg-white text-[#0B4FD1] shadow-[0_2px_0_#C2DBFA]"
                            : "text-[#4A6580] hover:text-[#0D2340]"
                        }`}
                      >
                        Koleksi Dimiliki ({ownedCount})
                      </button>
                      <button
                        type="button"
                        onClick={() => setWardrobeScope("all")}
                        className={`px-3 py-1.5 rounded-[10px] text-xs font-extrabold cursor-pointer transition-all ${
                          wardrobeScope === "all"
                            ? "bg-white text-[#0B4FD1] shadow-[0_2px_0_#C2DBFA]"
                            : "text-[#4A6580] hover:text-[#0D2340]"
                        }`}
                      >
                        Katalog Coba ({totalCount})
                      </button>
                    </div>

                    {/* Slot Filter */}
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <button
                        type="button"
                        onClick={() => setWardrobeSlot("all")}
                        className={`px-2.5 py-1 rounded-full text-xs font-extrabold cursor-pointer transition-all ${
                          wardrobeSlot === "all"
                            ? "bg-[#0B63F6] text-white shadow-[0_2px_0_#0B4FD1]"
                            : "bg-[#F0F6FF] text-[#4A6580] hover:bg-[#E4F0FF]"
                        }`}
                      >
                        Semua
                      </button>
                      {SLOTS.map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => setWardrobeSlot(s)}
                          className={`px-2.5 py-1 rounded-full text-xs font-extrabold cursor-pointer transition-all ${
                            wardrobeSlot === s
                              ? "bg-[#0B63F6] text-white shadow-[0_2px_0_#0B4FD1]"
                              : "bg-[#F0F6FF] text-[#4A6580] hover:bg-[#E4F0FF]"
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
                      <div className="size-16 mx-auto rounded-full bg-[#FFF7D1] border-2 border-[#FFD84D] flex items-center justify-center text-[#B27B00]">
                        <Shirt className="size-8" />
                      </div>
                      <h3 className="font-display font-bold text-base text-[#0D2340]">
                        Belum Ada Koleksi di Sini
                      </h3>
                      <p className="text-xs text-[#4A6580] max-w-sm mx-auto">
                        Kamu belum mengoleksi pakaian untuk kategori ini. Buka katalog lengkap untuk mencoba dan mendapatkan pakaian baru!
                      </p>
                      <TactileButton
                        variant="primary"
                        size="sm"
                        onClick={() => setWardrobeScope("all")}
                      >
                        Lihat Katalog Lengkap ({totalCount}) →
                      </TactileButton>
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
                          className={`p-3.5 rounded-[18px] border-2 flex flex-col justify-between transition-all ${
                            isEquipped
                              ? "bg-[#E8FBF0] border-[#98E4B5] shadow-[0_3px_0_#98E4B5]"
                              : isPreviewing
                              ? "bg-[#FFF7D1] border-[#FFD84D] shadow-[0_3px_0_#FFD84D]"
                              : owned
                              ? "bg-white border-[#DCE7F5] shadow-[0_3px_0_#C8DBF0] hover:border-[#8FC2FF]"
                              : "bg-[#F7FAFC] border-dashed border-[#CBD5E1]"
                          }`}
                        >
                          <div className="space-y-1.5">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-bold text-[#4A6580]">
                                {SLOT_LABEL[acc.slot]}
                              </span>
                              {isEquipped ? (
                                <span className="inline-flex items-center gap-0.5 text-[10px] font-extrabold text-[#1E8A49] bg-white px-2 py-0.5 rounded-full border border-[#98E4B5]">
                                  <Check className="size-3" /> Dipakai
                                </span>
                              ) : isPreviewing ? (
                                <span className="text-[10px] font-extrabold text-[#B27B00] bg-white px-2 py-0.5 rounded-full border border-[#FFD84D]">
                                  Dicoba
                                </span>
                              ) : !owned ? (
                                <span className="text-[10px] font-bold text-[#94A3B8]">
                                  Belum Punya
                                </span>
                              ) : null}
                            </div>

                            {/* Pixel Art Accessory Preview */}
                            <div className="h-14 flex items-center justify-center p-1.5 rounded-[12px] bg-white border border-[#E4F0FF]">
                              <img
                                src={acc.src}
                                alt={acc.name}
                                className="max-h-11 max-w-11 object-contain"
                                style={{ imageRendering: "pixelated" }}
                              />
                            </div>

                            <div>
                              <div className="font-extrabold text-xs text-[#0D2340] line-clamp-2 leading-tight">
                                {acc.name}
                              </div>
                              <div className="text-[10px] font-medium text-[#4A6580] line-clamp-2 leading-tight mt-0.5">
                                {acc.blurb}
                              </div>
                            </div>
                          </div>

                          {/* Wardrobe Action Buttons */}
                          <div className="mt-3 pt-2 border-t-2 border-[#F0F6FF] flex items-center justify-between gap-1.5">
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
                                  className="w-full py-1.5 rounded-[10px] bg-white border-2 border-[#F4A4A0] text-[11px] font-extrabold text-[#B01E18] hover:bg-[#FFF5F5] shadow-[0_2px_0_#F4A4A0] active:translate-y-[1px] active:shadow-none transition-all cursor-pointer"
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
                                  className="w-full py-1.5 rounded-[10px] bg-[#1E8A49] text-white border-2 border-[#156E38] text-[11px] font-extrabold hover:bg-[#156E38] shadow-[0_2px_0_#0E4F28] active:translate-y-[1px] active:shadow-none transition-all cursor-pointer"
                                >
                                  Pakai
                                </button>
                              )
                            ) : (
                              <div className="w-full flex items-center gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setPreviewWorn((prev) => ({
                                      ...(prev ?? worn),
                                      [acc.slot]: acc.id,
                                    }));
                                    playEquip();
                                  }}
                                  className="flex-1 py-1 rounded-[10px] bg-[#E4F0FF] border border-[#8FC2FF] text-[10px] font-extrabold text-[#0B4FD1] hover:bg-[#D4E8FF] cursor-pointer"
                                >
                                  Coba
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setConfirm(acc)}
                                  className="flex-1 py-1 rounded-[10px] bg-[#FFC61A] text-[#0D2340] border border-[#E5A800] text-[10px] font-extrabold hover:bg-[#FFD147] cursor-pointer"
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
                </SurfaceCard>
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
              <div className="p-4 rounded-[18px] bg-[#F7FAFC] border-2 border-[#DCE7F5] flex items-center gap-4">
                <div className="size-16 rounded-[14px] bg-white border border-[#CBD5E1] flex items-center justify-center p-2 shrink-0">
                  <img
                    src={confirm.src}
                    alt={confirm.name}
                    className="max-h-12 max-w-12 object-contain"
                    style={{ imageRendering: "pixelated" }}
                  />
                </div>
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#4A6580] px-2 py-0.5 rounded-full bg-[#E4F0FF] border border-[#8FC2FF]">
                    {SLOT_LABEL[confirm.slot]}
                  </span>
                  <h4 className="font-extrabold text-sm text-[#0D2340] mt-1">{confirm.name}</h4>
                  <p className="text-xs text-[#4A6580] mt-0.5 leading-relaxed">{confirm.blurb}</p>
                </div>
              </div>

              <div className="p-3 rounded-[16px] bg-[#FFF7D1] border-2 border-[#FFD84D] flex items-center justify-between">
                <span className="text-xs font-bold text-[#1E3A5F]">Harga item:</span>
                <span className="flex items-center gap-1.5 text-sm font-extrabold text-[#B27B00]">
                  <BlockStamp size={14} className="text-[#FFC61A]" />
                  {confirm.cost} Bintang
                </span>
              </div>

              <div className="text-xs text-[#4A6580] text-center">
                Setelah dibeli, pakaian ini akan langsung tersimpan di <strong>Ruang Ganti Blobi</strong> kamu.
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
