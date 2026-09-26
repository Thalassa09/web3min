import * as React from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Trophy,
  Ticket,
  Sparkles,
  Coins,
  Crown,
  Clock,
  CheckCircle2,
  HelpCircle,
  Plus,
  Minus,
  Award,
  AlertTriangle,
  AtSign,
  X,
  Wallet,
  Check,
  Flame,
  ShieldCheck,
  Tag,
  Users,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { useProgress } from "@/lib/store";
import {
  rpcGetRaffles,
  rpcGetRaffleStats,
  rpcGetRafflePublicResults,
  type DbRaffleItem,
  type DbRaffleStats,
  type RafflePublicResults,
} from "@/lib/server-sync";
import {
  INITIAL_RAFFLES,
  RAFFLE_TICKET_PRICE,
  formatRaffleCountdown,
  type RaffleItem,
} from "@/lib/raffles";
import { playBuy, playClaim, playDeny, playTap } from "@/lib/audio";
import { CandyLoader } from "@/components/ui/progress-bar";
import { isValidEvmAddress, maskWalletAddress, isValidXHandle, formatXHandle } from "@/lib/wallet";

export const Route = createFileRoute("/raffle")({
  component: RafflePage,
});

type UnifiedRaffle = {
  id: string;
  title: string;
  prize: string;
  prizeDetail: string;
  category: "nft" | "gems" | "outfit" | "badge" | "tickets";
  status: "live" | "verifying" | "ended" | "upcoming" | "drawn";
  endsAt: number | null;
  ticketCost: number;
  winnerCount: number;
  perks: string[];
  imageUrl?: string;
  isSimulation?: boolean;
  slotType?: "GTD" | "WL" | "GROUP" | "ITEM" | null;
  partnerName?: string | null;
  requirementXHandle?: string | null;
  officialMintDomain?: string | null;
  mintPrice?: string | null;
  mintSchedule?: string | null;
  announcementDate?: string | null;
  itemId?: string | null;
  seedHash?: string | null;
  drawSeed?: string | null;
  discordGroupLink?: string | null;
};

type ToastState = {
  message: string;
  type: "success" | "error";
} | null;

const ITEM_PREVIEWS: Record<string, { name: string; src: string; total: number }> = {
  crown: { name: "Mahkota Emas Blobi", src: "/mascot/acc/crown.png", total: 5 },
  "badge-pioneer": { name: "Lencana Kehormatan Pioneer", src: "/props/shield.png", total: 10 },
  star: { name: "Bintang Genggam Blobi", src: "/mascot/acc/star.png", total: 10 },
  batik: { name: "Selendang Batik Blobi", src: "/mascot/acc/batik.png", total: 15 },
  visor: { name: "Visor Blobi", src: "/mascot/acc/visor.png", total: 10 },
  medal: { name: "Medali Laga Blobi", src: "/mascot/acc/medal.png", total: 20 },
};

function getSlotBadge(slotType?: string | null, category?: string) {
  if (slotType === "GTD") {
    return {
      badgeBg: "bg-lemon text-choco-900 border-2 border-choco-900 shadow-[0_2px_0_#3B2218]",
      label: "Slot GTD",
      icon: Crown,
    };
  }
  if (slotType === "WL") {
    return {
      badgeBg: "bg-purple-600 text-white border-2 border-choco-900 shadow-[0_2px_0_#3B2218]",
      label: "Slot WL",
      icon: Flame,
    };
  }
  if (slotType === "GROUP") {
    return {
      badgeBg: "bg-mint text-white border-2 border-choco-900 shadow-[0_2px_0_#3B2218]",
      label: "Slot Grup",
      icon: ShieldCheck,
    };
  }
  if (slotType === "ITEM" || category === "outfit" || category === "badge") {
    return {
      badgeBg: "bg-candy-800 text-white border-2 border-choco-900 shadow-[0_2px_0_#3B2218]",
      label: "Item Limited",
      icon: Tag,
    };
  }
  return {
    badgeBg: "bg-cream text-choco-900 border-2 border-choco-900 shadow-[0_2px_0_#3B2218]",
    label: "Hadiah",
    icon: Award,
  };
}

export function RafflePage() {
  const {
    raffleTickets = 3,
    enteredRaffles = {},
    gems = 0,
    outfits = [],
    badges = [],
    lastWalletAddress,
    twitter,
    enterRaffle,
    updateRaffleWallet,
    buyRaffleTicketsWithGems,
  } = useProgress();

  const [dbRaffles, setDbRaffles] = React.useState<DbRaffleItem[]>([]);
  const [statsMap, setStatsMap] = React.useState<Record<string, DbRaffleStats>>({});
  const [resultsMap, setResultsMap] = React.useState<Record<string, RafflePublicResults>>({});
  const [isDbLoading, setIsDbLoading] = React.useState(true);

  // Modal states
  const [showBuyModal, setShowBuyModal] = React.useState(false);
  const [showGuideModal, setShowGuideModal] = React.useState(false);
  const [enteringRaffle, setEnteringRaffle] = React.useState<UnifiedRaffle | null>(null);
  const [isEditWalletMode, setIsEditWalletMode] = React.useState(false);
  const [previewImage, setPreviewImage] = React.useState<{ url: string; title: string } | null>(null);
  const [previewFairness, setPreviewFairness] = React.useState<UnifiedRaffle | null>(null);

  // Form states
  const [buyAmount, setBuyAmount] = React.useState(1);
  const [inputWallet, setInputWallet] = React.useState("");
  const [inputX, setInputX] = React.useState("");
  const [walletError, setWalletError] = React.useState<string | null>(null);
  const [xError, setXError] = React.useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // Keyboard shortcut to close any open modal
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setShowBuyModal(false);
        setShowGuideModal(false);
        setEnteringRaffle(null);
        setPreviewImage(null);
        setPreviewFairness(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Filter states
  const [activeCategory, setActiveCategory] = React.useState<string>("all");
  const [activeStatus, setActiveStatus] = React.useState<"live" | "all">("live");

  // Toast notification state
  const [toast, setToast] = React.useState<ToastState>(null);
  const [hasNotifiedWinner, setHasNotifiedWinner] = React.useState(false);

  const showSuccessToast = (msg: string) => {
    setToast({ message: msg, type: "success" });
    setTimeout(() => setToast(null), 4500);
  };

  const showErrorToast = (msg: string) => {
    setToast({ message: msg, type: "error" });
    setTimeout(() => setToast(null), 4500);
  };

  // Fetch live raffles & stats
  const fetchRaffleData = React.useCallback(async () => {
    try {
      const [raffles, stats] = await Promise.all([
        rpcGetRaffles(),
        rpcGetRaffleStats(),
      ]);

      if (Array.isArray(raffles) && raffles.length > 0) {
        setDbRaffles(raffles);

        // Fetch public results for ended raffles
        const endedRaffles = raffles.filter((r) => r.status === "ended" || r.status === "drawn");
        if (endedRaffles.length > 0) {
          const resPairs = await Promise.all(
            endedRaffles.map(async (r) => {
              const res = await rpcGetRafflePublicResults(r.id);
              return [r.id, res] as const;
            })
          );
          const rMap: Record<string, RafflePublicResults> = {};
          for (const [id, res] of resPairs) {
            if (res) rMap[id] = res;
          }
          setResultsMap(rMap);
        }
      }
      if (stats) setStatsMap(stats);
    } catch (err) {
      console.warn("[raffle] Failed to fetch data from Supabase:", err);
    } finally {
      setIsDbLoading(false);
    }
  }, []);

  React.useEffect(() => {
    void fetchRaffleData();
  }, [fetchRaffleData]);

  // Combine DB raffles with fallback data
  const allRaffles: UnifiedRaffle[] = React.useMemo(() => {
    if (dbRaffles.length > 0) {
      return dbRaffles.map((r): UnifiedRaffle => {
        let pList: string[] = [];
        if (Array.isArray(r.perks)) pList = r.perks;
        else if (typeof r.perks === "string") {
          try {
            pList = JSON.parse(r.perks);
          } catch {}
        }

        const ends = r.ends_at ? new Date(r.ends_at).getTime() : null;

        return {
          id: r.id,
          title: r.title,
          prize: r.prize,
          prizeDetail: r.prize_detail || "",
          category: r.category || "nft",
          status: (r.status as UnifiedRaffle["status"]) || "live",
          endsAt: ends,
          ticketCost: r.ticket_cost || 1,
          winnerCount: r.winner_count || 1,
          perks: pList,
          imageUrl: r.image_url || undefined,
          isSimulation: r.is_simulation ?? false,
          slotType: r.slot_type || null,
          partnerName: r.partner_name || null,
          requirementXHandle: r.requirement_x_handle || null,
          officialMintDomain: r.official_mint_domain || null,
          mintPrice: r.mint_price || null,
          mintSchedule: r.mint_schedule || null,
          announcementDate: r.announcement_date || null,
          itemId: r.item_id || null,
          seedHash: r.seed_hash || null,
          drawSeed: r.draw_seed || null,
          discordGroupLink: r.discord_group_link || null,
        };
      });
    }

    return INITIAL_RAFFLES.map((r: RaffleItem): UnifiedRaffle => ({
      id: r.id,
      title: r.title,
      prize: r.prize,
      prizeDetail: r.prizeDetail,
      category: r.category as UnifiedRaffle["category"],
      status: r.status as UnifiedRaffle["status"],
      endsAt: r.endsAt || null,
      ticketCost: r.ticketCost,
      winnerCount: r.winnerCount,
      perks: Array.isArray(r.perks) && r.perks.length > 0 ? r.perks : (Array.isArray(r.requirements) ? r.requirements : []),
      imageUrl: r.imageUrl || undefined,
      isSimulation: r.isSimulation ?? false,
      slotType: r.id === "raf-nft-mufpjxfk" ? "GTD" : (r.id === "raf-crown" ? "ITEM" : null),
      partnerName: r.id === "raf-nft-mufpjxfk" ? "RoboHood NFT" : null,
      officialMintDomain: r.id === "raf-nft-mufpjxfk" ? "robonft.xyz" : null,
      requirementXHandle: r.id === "raf-nft-mufpjxfk" ? "@RoboHoodNFT" : null,
      announcementDate: r.id === "raf-nft-mufpjxfk" ? "1 Oktober 2026" : null,
      itemId: r.id === "raf-crown" ? "crown" : null,
    }));
  }, [dbRaffles]);

  // Check winner toast once when results load
  React.useEffect(() => {
    if (hasNotifiedWinner) return;
    for (const [_, res] of Object.entries(resultsMap)) {
      if (res?.is_user_winner && res.user_win_info) {
        const info = res.user_win_info;
        if (info.slot_type === "ITEM") {
          showSuccessToast(
            `Selamat! ${info.prize} Edisi #${info.edition_number || 1} sudah masuk ke Ruang Ganti kamu.`
          );
        } else {
          showSuccessToast(
            `Selamat! Kamu dapat ${info.prize}. Cek jadwal mint di situs resmi ${info.partner_name || "mitra"}: ${info.official_mint_domain || "domain resmi"}.`
          );
        }
        setHasNotifiedWinner(true);
        break;
      }
    }
  }, [resultsMap, hasNotifiedWinner]);

  // Filtered raffles (Categories: Semua, Slot Mint, Item Blobi, Grup)
  const filteredRaffles = React.useMemo(() => {
    return allRaffles.filter((item) => {
      if (activeStatus === "live" && item.status !== "live") return false;
      if (activeCategory === "mint") {
        return item.slotType === "GTD" || item.slotType === "WL" || item.category === "nft";
      }
      if (activeCategory === "item") {
        return item.slotType === "ITEM" || item.category === "outfit" || item.category === "badge";
      }
      if (activeCategory === "group") {
        return item.slotType === "GROUP";
      }
      return true;
    });
  }, [allRaffles, activeCategory, activeStatus]);

  const handleBuyTickets = () => {
    const cost = buyAmount * RAFFLE_TICKET_PRICE;
    if (gems < cost) {
      playDeny();
      showErrorToast(`Saldo Koin tidak mencukupi! Butuh ${cost} Koin.`);
      return;
    }
    const ok = buyRaffleTicketsWithGems(buyAmount);
    if (ok) {
      playBuy();
      showSuccessToast(`Sukses membeli ${buyAmount} Tiket Undian! (+${buyAmount} Tiket)`);
      setShowBuyModal(false);
      setBuyAmount(1);
    } else {
      playDeny();
      showErrorToast("Gagal memproses pembelian tiket.");
    }
  };

  const handleOpenEnterModal = (raffle: UnifiedRaffle, isEditWallet = false) => {
    playTap();
    if (!isEditWallet && raffleTickets <= 0) {
      setShowBuyModal(true);
      return;
    }

    // Check if user already owns the ITEM
    if (raffle.slotType === "ITEM" && raffle.itemId) {
      if (outfits.includes(raffle.itemId) || badges.includes(raffle.itemId)) {
        playDeny();
        showErrorToast("Kamu sudah memiliki item ini di koleksimu!");
        return;
      }
    }

    const existingEntry = enteredRaffles[raffle.id];
    const initialWallet = existingEntry?.walletAddress || lastWalletAddress || "";
    const initialX = existingEntry?.xHandle || twitter || "";

    setEnteringRaffle(raffle);
    setIsEditWalletMode(isEditWallet);
    setInputWallet(initialWallet);
    setInputX(initialX);
    setWalletError(null);
    setXError(null);
  };

  const handleConfirmEntry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!enteringRaffle) return;

    const isMintSlot = enteringRaffle.slotType === "GTD" || enteringRaffle.slotType === "WL" || (!enteringRaffle.slotType && enteringRaffle.category === "nft");
    const requiresX = Boolean(enteringRaffle.requirementXHandle && enteringRaffle.requirementXHandle.trim());

    // 1. Validate EVM wallet for GTD/WL
    let cleanWallet: string | undefined = undefined;
    if (isMintSlot) {
      const trimmed = inputWallet.trim();
      if (!trimmed) {
        setWalletError("Alamat wallet EVM wajib diisi untuk undian slot mint.");
        playDeny();
        return;
      }
      if (!isValidEvmAddress(trimmed)) {
        setWalletError("Alamat wallet EVM tidak valid! Format harus 0x diikuti 40 karakter hex (EIP-55).");
        playDeny();
        return;
      }
      cleanWallet = trimmed.toLowerCase();
    } else if (inputWallet.trim()) {
      if (!isValidEvmAddress(inputWallet.trim())) {
        setWalletError("Alamat wallet EVM tidak valid.");
        playDeny();
        return;
      }
      cleanWallet = inputWallet.trim().toLowerCase();
    }

    // 2. Validate X Handle
    let cleanX: string | undefined = undefined;
    if (requiresX) {
      const trimmedX = inputX.trim();
      if (!trimmedX) {
        setXError("Akun X (Twitter) wajib diisi untuk verifikasi follow.");
        playDeny();
        return;
      }
      if (!isValidXHandle(trimmedX)) {
        setXError("Format akun X tidak valid! Gunakan 1-15 karakter (contoh: @BlobiUser).");
        playDeny();
        return;
      }
      cleanX = formatXHandle(trimmedX);
    } else if (inputX.trim()) {
      if (!isValidXHandle(inputX.trim())) {
        setXError("Format akun X tidak valid.");
        playDeny();
        return;
      }
      cleanX = formatXHandle(inputX.trim());
    }

    setIsSubmitting(true);

    try {
      if (isEditWalletMode) {
        const ok = await updateRaffleWallet(enteringRaffle.id, cleanWallet || "", cleanX);
        if (ok) {
          playClaim();
          showSuccessToast("Data peserta undian berhasil diperbarui!");
          setEnteringRaffle(null);
        } else {
          playDeny();
          showErrorToast("Gagal memperbarui data peserta. Batas waktu undian mungkin sudah lewat.");
        }
      } else {
        const res = await enterRaffle(enteringRaffle.id, 1, cleanWallet, cleanX);
        if (res.success) {
          playClaim();
          showSuccessToast("1 Tiket Undian berhasil dipasang!");
          setEnteringRaffle(null);
          void fetchRaffleData();
        } else {
          playDeny();
          showErrorToast(res.error || "Gagal memasang tiket.");
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AppShell>
      <main className="px-3 py-4 sm:px-4 sm:py-6 pb-[calc(6rem+env(safe-area-inset-bottom))] sm:pb-28 max-w-6xl mx-auto space-y-6">
        {/* Sub-nav / Breadcrumb */}
        <div className="flex items-center justify-between gap-2 border-b-2 border-choco-900/10 pb-3">
          <div className="flex items-center gap-1.5 p-1 bg-cream/80 rounded-2xl border-2 border-choco-900 shadow-[0_2px_0_#3B2218]">
            <Link
              to="/leaderboard"
              className="inline-flex items-center gap-2 py-2 px-3.5 rounded-xl text-xs font-bold text-choco-700 hover:text-choco-900 transition-all"
            >
              <Trophy className="h-4 w-4" />
              <span>Klasemen Liga</span>
            </Link>
            <div className="inline-flex items-center gap-2 py-2 px-4 rounded-xl bg-candy-800 text-white font-pixel text-xs font-bold shadow-[0_1.5px_0_#3B2218]">
              <Ticket className="h-4 w-4" />
              <span>Undian Hadiah</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                playTap();
                setShowGuideModal(true);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border-2 border-choco-900 text-choco-900 font-pixel text-xs font-bold shadow-[0_2px_0_#3B2218] hover:bg-cream active:translate-y-0.5 cursor-pointer"
            >
              <HelpCircle className="h-3.5 w-3.5 text-candy-700" />
              <span className="hidden sm:inline">Panduan</span>
            </button>
          </div>
        </div>

        {/* Hero Card */}
        <div className="relative overflow-hidden rounded-3xl border-2 border-choco-900 bg-gradient-to-b from-[#FFF5F8] via-[#FFE4ED] to-[#FFD5E5] p-5 sm:p-7 shadow-[0_6px_0_#3B2218]">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
            <div className="space-y-2 max-w-xl">
              <span className="inline-flex items-center gap-1.5 rounded-full border-2 border-choco-900 bg-white/90 px-3 py-1 text-xs font-bold text-candy-700 shadow-[0_2px_0_#3B2218]">
                <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                <span>Undian Berhadiah • Siklus Aktif</span>
              </span>

              <h1 className="text-2xl sm:text-3xl font-display font-bold text-choco-900 leading-tight">
                Undian Hadiah Web3min
              </h1>

              <p className="text-xs sm:text-sm font-medium text-choco-700 leading-relaxed">
                Tukarkan Koin hasil belajar jadi Tiket Undian. Menangkan item Blobi edisi
                terbatas atau slot mint NFT dari proyek mitra Web3min.
              </p>
            </div>

            {/* Ticket & Coin Counter Pill */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
              <div className="flex items-center justify-between sm:justify-start gap-4 rounded-2xl border-2 border-choco-900 bg-white/95 p-3 px-4 shadow-[0_3px_0_#3B2218]">
                <div className="flex items-center gap-2">
                  <div className="size-9 rounded-xl bg-amber-400 border-2 border-choco-900 flex items-center justify-center text-choco-900 shadow-[0_1.5px_0_#3B2218]">
                    <Ticket className="h-4.5 w-4.5 stroke-[2.5]" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-choco-500 block">
                      Tiket Kamu
                    </span>
                    <span className="font-mono text-lg font-black text-choco-900">
                      {raffleTickets} Tiket
                    </span>
                  </div>
                </div>

                <div className="h-8 w-[2px] bg-choco-900/10 hidden sm:block" />

                <div className="flex items-center gap-2">
                  <div className="size-9 rounded-xl bg-lemon border-2 border-choco-900 flex items-center justify-center text-choco-900 shadow-[0_1.5px_0_#3B2218]">
                    <Coins className="h-4.5 w-4.5 stroke-[2.5]" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-choco-500 block">
                      Saldo Koin
                    </span>
                    <span className="font-mono text-lg font-black text-choco-900">
                      {gems}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  playTap();
                  setShowBuyModal(true);
                }}
                className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-choco-900 bg-candy-800 px-5 py-3 font-pixel text-xs font-bold text-white shadow-[0_3px_0_#3B2218] hover:bg-candy-950 active:translate-y-1 active:shadow-none transition-all cursor-pointer"
              >
                <Plus className="h-4 w-4 stroke-[3]" />
                <span>Beli Tiket</span>
              </button>
            </div>
          </div>
        </div>

        {/* Clean Toast Notification */}
        {toast && (
          <div
            className={`flex items-center gap-3 rounded-2xl border-2 border-choco-900 p-4 font-bold shadow-[0_4px_0_#3B2218] ${
              toast.type === "error"
                ? "bg-rose-100 text-rose-950"
                : "bg-emerald-100 text-emerald-950"
            }`}
          >
            {toast.type === "error" ? (
              <AlertTriangle className="h-5 w-5 text-rose-600 shrink-0" />
            ) : (
              <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
            )}
            <p className="text-xs sm:text-sm font-semibold">{toast.message}</p>
          </div>
        )}

        {/* Filter Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          {/* Categories: Semua, Slot Mint, Item Blobi, Grup */}
          <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
            {[
              { id: "all", label: "Semua" },
              { id: "mint", label: "Slot Mint" },
              { id: "item", label: "Item Blobi" },
              { id: "group", label: "Grup" },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  playTap();
                  setActiveCategory(cat.id);
                }}
                className={`rounded-full border-2 border-choco-900 px-3.5 h-8 text-xs font-bold transition-all cursor-pointer ${
                  activeCategory === cat.id
                    ? "bg-candy-800 text-white shadow-[0_2px_0_#3B2218]"
                    : "bg-white text-choco-700 hover:bg-cream"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Status Toggle */}
          <div className="flex items-center gap-1 rounded-full border-2 border-choco-900 bg-white p-1 shrink-0 self-end sm:self-auto shadow-[0_2px_0_#3B2218]">
            <button
              onClick={() => {
                playTap();
                setActiveStatus("live");
              }}
              className={`rounded-full px-3 py-1 text-xs font-bold transition-all cursor-pointer ${
                activeStatus === "live"
                  ? "bg-emerald-300 text-choco-900 shadow-[0_1px_0_#3B2218]"
                  : "text-choco-600 hover:text-choco-900"
              }`}
            >
              Berlangsung ({allRaffles.filter((r) => r.status === "live").length})
            </button>
            <button
              onClick={() => {
                playTap();
                setActiveStatus("all");
              }}
              className={`rounded-full px-3 py-1 text-xs font-bold transition-all cursor-pointer ${
                activeStatus === "all"
                  ? "bg-choco-900 text-cream shadow-[0_1px_0_#3B2218]"
                  : "text-choco-600 hover:text-choco-900"
              }`}
            >
              Semua ({allRaffles.length})
            </button>
          </div>
        </div>

        {/* Raffles Grid */}
        {allRaffles.length === 0 && isDbLoading ? (
          <div className="p-12 flex flex-col items-center justify-center space-y-4">
            <CandyLoader size="lg" label="MEMUAT DAFTAR UNDIAN…" />
          </div>
        ) : (
          <div
            className={`grid gap-6 ${
              filteredRaffles.length === 1 ? "grid-cols-1 max-w-md mx-auto" : "grid-cols-1 md:grid-cols-2"
            }`}
          >
            {filteredRaffles.map((raffle) => {
              const badge = getSlotBadge(raffle.slotType, raffle.category);
              const BadgeIcon = badge.icon;
              const stats = statsMap[raffle.id];
              const totalTickets = stats?.total_tickets ?? 0;
              const userEntry = enteredRaffles[raffle.id];
              const userTickets = userEntry?.count ?? 0;
              const isLive = raffle.status === "live";
              const isVerifying = raffle.status === "verifying";
              const isEnded = raffle.status === "ended" || raffle.status === "drawn";
              const publicResult = resultsMap[raffle.id];
              const isWinner = publicResult?.is_user_winner ?? false;
              const isExpired = raffle.endsAt ? Date.now() > raffle.endsAt : false;

              // Small info text under title (2c)
              const isMintSlot = raffle.slotType === "GTD" || raffle.slotType === "WL" || (!raffle.slotType && raffle.category === "nft");
              const isItemSlot = raffle.slotType === "ITEM" || raffle.category === "outfit" || raffle.category === "badge";

              let noteText: string | null = null;
              if (isMintSlot) {
                noteText = "Hak mint, bukan NFT gratis. Mint di situs resmi mitra.";
              } else if (isItemSlot) {
                noteText = "Item eksklusif Blobi, langsung masuk ke akun pemenang. Tidak dijual di Toko.";
              } else if (raffle.isSimulation) {
                noteText = "Simulasi, bukan hadiah sungguhan.";
              }

              // Default prize label formatting
              const formattedPrize = raffle.prize || (
                raffle.slotType === "GTD"
                  ? `${raffle.winnerCount} Slot GTD`
                  : raffle.slotType === "WL"
                  ? `${raffle.winnerCount} Slot WL`
                  : raffle.slotType === "GROUP"
                  ? `${raffle.winnerCount} Slot Grup Komunitas`
                  : `${raffle.winnerCount}x Item Limited`
              );

              // Artwork URL fallback
              const itemMeta = raffle.itemId ? ITEM_PREVIEWS[raffle.itemId] : null;
              const displayImage = raffle.imageUrl || itemMeta?.src || "/mascot/wave.png";
              const isItemPixelated = Boolean(!raffle.imageUrl && itemMeta?.src);

              return (
                <div
                  key={raffle.id}
                  data-raffle-card
                  className="flex flex-col h-full justify-between overflow-hidden rounded-3xl border-2 border-choco-900 bg-gradient-to-b from-white via-[#FFF9F5] to-[#FDEEE4] p-4 md:p-5 shadow-[0_6px_0_#3B2218] transition-transform hover:-translate-y-0.5"
                >
                  <div className="space-y-3">
                    {/* a. Baris badge: [badge rarity] [badge status] in 1 row, flex-nowrap, gap-2, status on the right (ml-auto) */}
                    <div className="flex items-center flex-nowrap gap-2 w-full">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full border-2 border-choco-900 px-2.5 h-6 text-[11px] font-bold shrink-0 ${badge.badgeBg}`}
                      >
                        <BadgeIcon className="h-3 w-3 shrink-0" />
                        <span>{badge.label}</span>
                      </span>

                      <div className="ml-auto shrink-0">
                        {isLive ? (
                          isExpired ? (
                            <span className="inline-flex items-center gap-1 rounded-full border-2 border-choco-900 bg-amber-100 text-amber-900 px-2.5 h-6 text-[10px] font-bold shadow-[0_1.5px_0_#3B2218]">
                              <span>Menunggu Pengundian</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 rounded-full border-2 border-choco-900 bg-emerald-200 text-emerald-950 px-2.5 h-6 text-[10px] font-bold shadow-[0_1.5px_0_#3B2218]">
                              <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-700"></span>
                              </span>
                              <span>BERLANGSUNG</span>
                            </span>
                          )
                        ) : isVerifying ? (
                          <span className="inline-flex items-center gap-1 rounded-full border-2 border-choco-900 bg-amber-200 text-amber-950 px-2.5 h-6 text-[10px] font-bold shadow-[0_1.5px_0_#3B2218]">
                            <span>MENUNGGU VERIFIKASI</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full border-2 border-choco-900 bg-stone-200 text-stone-800 px-2.5 h-6 text-[10px] font-bold shadow-[0_1.5px_0_#3B2218]">
                            <span>SELESAI</span>
                          </span>
                        )}
                      </div>
                    </div>

                    {/* b. Judul + baris hadiah */}
                    <div>
                      <h2 className="text-xl font-display font-bold text-choco-900 leading-tight">
                        {raffle.title}
                      </h2>
                      <div className="text-sm font-bold text-candy-700 mt-1 flex items-center gap-1.5">
                        <Award className="h-4 w-4 shrink-0" />
                        <span>{formattedPrize}</span>
                      </div>

                      {/* c. Baris keterangan kecil di bawah judul */}
                      {noteText && (
                        <p className="text-[11px] text-choco-600 font-semibold mt-1">
                          {noteText}
                        </p>
                      )}
                    </div>

                    {/* d. Gambar NFT / Item */}
                    <div
                      className="aspect-square w-full rounded-2xl border-2 border-choco-900 bg-cream overflow-hidden relative shadow-[0_3px_0_#3B2218] my-2 cursor-pointer group p-2"
                      onClick={() => {
                        setPreviewImage({ url: displayImage, title: raffle.title });
                      }}
                      title="Klik untuk melihat gambar ukuran penuh"
                    >
                      <img
                        src={displayImage}
                        alt={raffle.title}
                        className={`w-full h-full object-contain transition-transform duration-200 group-hover:scale-105 ${
                          isItemPixelated ? "pixelated" : ""
                        }`}
                        loading="lazy"
                        decoding="async"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "/mascot/wave.png";
                        }}
                      />
                      <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full bg-choco-900/90 text-white font-pixel text-[10px] font-bold shadow-xs">
                        {isItemSlot ? "ITEM LIMITED" : "SLOT MINT"}
                      </div>
                    </div>

                    {/* e. Daftar Info Vertikal */}
                    <div className="rounded-2xl border border-choco-900/15 bg-white/70 p-3 space-y-1.5 text-xs text-choco-800">
                      <div className="font-pixel text-[10px] font-bold uppercase text-choco-500 mb-1">
                        {isItemSlot ? "Info Item:" : "Info Slot:"}
                      </div>

                      {isMintSlot && (
                        <>
                          <div className="flex items-center gap-2">
                            <Check className="size-3 text-emerald-600 shrink-0" />
                            <span>Jenis slot: <strong>{raffle.slotType || "GTD"}</strong></span>
                          </div>
                          {raffle.mintPrice && (
                            <div className="flex items-center gap-2">
                              <Check className="size-3 text-emerald-600 shrink-0" />
                              <span>Harga mint: <strong>{raffle.mintPrice}</strong></span>
                            </div>
                          )}
                          {raffle.mintSchedule && (
                            <div className="flex items-center gap-2">
                              <Check className="size-3 text-emerald-600 shrink-0" />
                              <span>Jadwal mint: <strong>{raffle.mintSchedule}</strong></span>
                            </div>
                          )}
                          {raffle.officialMintDomain && (
                            <div className="flex items-center gap-2 font-mono text-[11px]">
                              <Check className="size-3 text-emerald-600 shrink-0" />
                              <span>Situs mint resmi: <strong>{raffle.officialMintDomain}</strong></span>
                            </div>
                          )}
                        </>
                      )}

                      {isItemSlot && itemMeta && (
                        <>
                          <div className="flex items-center gap-2">
                            <Check className="size-3 text-emerald-600 shrink-0" />
                            <span>Edisi terbatas: <strong>{itemMeta.total} buah</strong></span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Check className="size-3 text-emerald-600 shrink-0" />
                            <span>Sisa edisi: <strong>{itemMeta.total - raffle.winnerCount} buah</strong></span>
                          </div>
                        </>
                      )}

                      {raffle.requirementXHandle && (
                        <div className="flex items-center gap-2">
                          <Check className="size-3 text-emerald-600 shrink-0" />
                          <span>Syarat: follow <strong>{raffle.requirementXHandle}</strong> di X</span>
                        </div>
                      )}

                      {raffle.announcementDate && (
                        <div className="flex items-center gap-2">
                          <Check className="size-3 text-emerald-600 shrink-0" />
                          <span>Pengumuman: <strong>{raffle.announcementDate}</strong></span>
                        </div>
                      )}

                      {raffle.perks.map((p, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <Check className="size-3 text-emerald-600 shrink-0" />
                          <span>{p}</span>
                        </div>
                      ))}
                    </div>

                    {/* Provably Fair Seed Hash Pill */}
                    {raffle.seedHash && (
                      <div
                        onClick={() => setPreviewFairness(raffle)}
                        className="rounded-xl border border-choco-900/10 bg-cream/70 p-2 flex items-center justify-between text-[10px] text-choco-600 font-mono cursor-pointer hover:bg-cream"
                        title="Klik untuk info keaslian pengundian (Commit-Reveal)"
                      >
                        <span className="truncate max-w-[200px]">
                          Seed Hash: {raffle.seedHash.slice(0, 12)}…
                        </span>
                        <span className="text-candy-700 font-bold shrink-0">Verifikasi</span>
                      </div>
                    )}

                    {/* f. Grid Statistik 2x2 */}
                    <div className="grid grid-cols-2 gap-2 pt-1 font-semibold text-xs">
                      {/* Tiket Terkumpul */}
                      <div className="rounded-xl border border-choco-900/15 bg-white p-2.5">
                        <span className="text-[10px] uppercase font-bold text-choco-500 block">
                          Tiket Terkumpul
                        </span>
                        <span className="font-mono text-sm font-bold text-choco-900">
                          {totalTickets} Tiket
                        </span>
                      </div>

                      {/* Kuota Pemenang */}
                      <div className="rounded-xl border border-choco-900/15 bg-white p-2.5">
                        <span className="text-[10px] uppercase font-bold text-choco-500 block">
                          Pemenang
                        </span>
                        <span className="font-mono text-sm font-bold text-choco-900">
                          {isItemSlot ? `${raffle.winnerCount} Pemenang` : `${raffle.winnerCount} Slot`}
                        </span>
                      </div>

                      {/* Tiket Kamu */}
                      <div className="rounded-xl border border-choco-900/15 bg-white p-2.5">
                        <span className="text-[10px] uppercase font-bold text-choco-500 block">
                          Tiket Kamu
                        </span>
                        <span className="font-mono text-sm font-bold text-choco-900">
                          {isEnded
                            ? isWinner
                              ? "Kamu Menang!"
                              : "Belum beruntung"
                            : userTickets > 0
                            ? `${userTickets} Tiket`
                            : "Belum Ikut"}
                        </span>
                      </div>

                      {/* Sisa Waktu */}
                      <div className="rounded-xl border border-choco-900/15 bg-white p-2.5">
                        <span className="text-[10px] uppercase font-bold text-choco-500 block">
                          Sisa Waktu
                        </span>
                        <span className="font-mono text-xs font-bold text-choco-900 truncate block">
                          {raffle.endsAt ? formatRaffleCountdown(raffle.endsAt) : "Belum dijadwalkan"}
                        </span>
                      </div>
                    </div>

                    {/* Public Winners List (Only visible when ended) */}
                    {isEnded && publicResult?.winners && publicResult.winners.length > 0 && (
                      <div className="rounded-2xl border-2 border-emerald-600/40 bg-emerald-50/70 p-3 space-y-2 mt-2">
                        <div className="text-[11px] font-bold font-pixel text-emerald-900 flex items-center justify-between">
                          <span>Daftar Pemenang:</span>
                          <span className="text-[10px] font-mono font-normal">
                            {publicResult.total_winners ?? publicResult.winners.length} Total
                          </span>
                        </div>
                        <div className="space-y-1 font-mono text-[11px] text-emerald-950">
                          {publicResult.winners.map((w, idx) => (
                            <div key={idx} className="flex items-center justify-between">
                              <span>
                                {idx + 1}. {w.masked_wallet || w.display_name}
                              </span>
                            </div>
                          ))}
                          {(publicResult.total_winners ?? publicResult.winners.length) > publicResult.winners.length && (
                            <div className="text-[10px] text-emerald-700 italic pt-0.5">
                              +{(publicResult.total_winners ?? publicResult.winners.length) - publicResult.winners.length} pemenang lainnya
                            </div>
                          )}
                        </div>

                        {/* Exclusive Discord link for winner only */}
                        {isWinner && publicResult.user_win_info?.discord_group_link && (
                          <div className="pt-2 border-t border-emerald-600/20">
                            <a
                              href={publicResult.user_win_info.discord_group_link}
                              target="_blank"
                              rel="noreferrer"
                              className="w-full py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-pixel font-bold text-xs flex items-center justify-center gap-1.5 shadow-[0_2px_0_#15803D]"
                            >
                              <span>Masuk ke Grup Komunitas Eksklusif</span>
                            </a>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* g. Tombol Utama & Wallet Terdaftar */}
                  <div className="mt-4 pt-3 border-t border-choco-900/10 space-y-2">
                    {userTickets > 0 && userEntry?.walletAddress && isMintSlot && (
                      <div
                        onClick={() => handleOpenEnterModal(raffle, true)}
                        className="text-[11px] font-mono text-choco-700 text-center hover:text-candy-700 cursor-pointer underline decoration-dotted"
                        title="Klik untuk mengubah alamat wallet sebelum undian berakhir"
                      >
                        Wallet terdaftar: {maskWalletAddress(userEntry.walletAddress)}
                      </div>
                    )}

                    <button
                      onClick={() => handleOpenEnterModal(raffle)}
                      disabled={!isLive || isExpired || !raffle.endsAt}
                      className="w-full py-3 px-4 rounded-full border-2 border-choco-900 bg-candy-800 hover:bg-candy-950 disabled:opacity-40 disabled:hover:bg-candy-950 text-white font-pixel text-xs sm:text-sm font-bold shadow-[0_4px_0_#3B2218] active:translate-y-1 active:shadow-none transition-all cursor-pointer flex items-center justify-center gap-2"
                    >
                      <Ticket className="size-4" />
                      <span>
                        {isEnded
                          ? "Undian Selesai"
                          : isExpired
                          ? "Menunggu Pengundian"
                          : !raffle.endsAt
                          ? "Belum Dijadwalkan"
                          : "Pasang Tiket"}
                      </span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Transparansi & Mekanisme Undian Web3min */}
        <div className="rounded-3xl border-2 border-choco-900 bg-white p-5 sm:p-7 shadow-[0_6px_0_#3B2218] space-y-4">
          <div>
            <h3 className="text-lg font-pixel font-bold text-choco-900">
              Transparansi & Mekanisme Undian Web3min
            </h3>
            <p className="text-xs text-choco-600 font-medium mt-1">
              Pemenang dipilih acak oleh server. Hash seed diumumkan sebelum undian dibuka dan
              seed dibuka setelah selesai, jadi hasilnya bisa dicek.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            <div className="p-4 rounded-2xl border-2 border-choco-900 bg-cream space-y-2">
              <div className="size-8 rounded-full bg-lemon border-2 border-choco-900 flex items-center justify-center font-pixel font-bold text-choco-900 text-xs shadow-[0_1.5px_0_#3B2218]">
                1
              </div>
              <h4 className="font-pixel text-xs font-bold text-choco-900">
                1. Belajar & Kumpulkan Koin
              </h4>
              <p className="text-xs text-choco-700 font-medium leading-relaxed">
                Setiap menyelesaikan modul, koin masuk ke saldomu.
              </p>
            </div>

            <div className="p-4 rounded-2xl border-2 border-choco-900 bg-cream space-y-2">
              <div className="size-8 rounded-full bg-candy-200 border-2 border-choco-900 flex items-center justify-center font-pixel font-bold text-choco-900 text-xs shadow-[0_1.5px_0_#3B2218]">
                2
              </div>
              <h4 className="font-pixel text-xs font-bold text-choco-900">
                2. Tukar & Pasang Tiket
              </h4>
              <p className="text-xs text-choco-700 font-medium leading-relaxed">
                Tukar 10 Koin untuk 1 Tiket, lalu pasang di undian pilihanmu. Pastikan kamu
                memenuhi syaratnya, misalnya follow akun X yang disebut.
              </p>
            </div>

            <div className="p-4 rounded-2xl border-2 border-choco-900 bg-cream space-y-2">
              <div className="size-8 rounded-full bg-mint/30 border-2 border-choco-900 flex items-center justify-center font-pixel font-bold text-choco-900 text-xs shadow-[0_1.5px_0_#3B2218]">
                3
              </div>
              <h4 className="font-pixel text-xs font-bold text-choco-900">
                3. Cek Pengumuman di Sini
              </h4>
              <p className="text-xs text-choco-700 font-medium leading-relaxed">
                Pemenang diumumkan di kartu undian. Item langsung masuk ke akunmu, slot mint
                dipakai di situs resmi mitra. Tim Web3min tidak akan pernah DM kamu.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* MODAL 1: BELI TIKET */}
      {showBuyModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-choco-900/60 backdrop-blur-xs animate-in fade-in duration-150"
          onClick={() => setShowBuyModal(false)}
        >
          <div
            className="relative w-full max-w-sm rounded-[28px] bg-cream border-3 border-choco-900 p-5 sm:p-6 shadow-[0_8px_0_#3B2218] text-choco-900 animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setShowBuyModal(false)}
              aria-label="Tutup"
              className="absolute top-4 right-4 flex size-9 items-center justify-center rounded-full border-2 border-choco-900 bg-white text-choco-900 shadow-[0_1px_0_#3B2218] hover:bg-candy-100 active:translate-y-0.5 cursor-pointer"
            >
              <X className="size-4.5 stroke-[2.5]" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="size-12 rounded-2xl bg-amber-400 border-2 border-choco-900 flex items-center justify-center shadow-[0_3px_0_#3B2218]">
                <Ticket className="size-6 text-choco-900" />
              </div>
              <div>
                <h3 className="font-pixel text-lg font-bold text-choco-900">
                  Tukar Koin Jadi Tiket
                </h3>
                <span className="text-xs text-choco-600 font-medium">
                  1 Tiket = 10 Koin
                </span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-white border-2 border-choco-900 shadow-[0_2px_0_#3B2218] mb-4 flex items-center justify-between">
              <span className="text-xs font-bold text-choco-700">Saldo Koin Kamu</span>
              <span className="font-mono text-base font-black text-amber-700">{gems} Koin</span>
            </div>

            <div className="space-y-3 mb-5">
              <div className="flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setBuyAmount((prev) => Math.max(1, prev - 1))}
                  className="size-11 rounded-full border-2 border-choco-900 bg-white hover:bg-cream flex items-center justify-center font-bold text-lg shadow-[0_2px_0_#3B2218] active:translate-y-0.5 cursor-pointer"
                >
                  <Minus className="size-4.5" />
                </button>
                <div className="flex-1 text-center">
                  <div className="font-mono text-2xl font-black text-choco-900">
                    {buyAmount}
                  </div>
                  <div className="text-[10px] font-bold text-choco-500 uppercase">
                    Tiket Undian
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setBuyAmount((prev) => Math.min(100, prev + 1))}
                  className="size-11 rounded-full border-2 border-choco-900 bg-white hover:bg-cream flex items-center justify-center font-bold text-lg shadow-[0_2px_0_#3B2218] active:translate-y-0.5 cursor-pointer"
                >
                  <Plus className="size-4.5" />
                </button>
              </div>

              {/* Quick Add Buttons (+N MENAMBAH) */}
              <div className="flex items-center gap-1.5 pt-1">
                {[
                  { n: 1, label: "+1" },
                  { n: 5, label: "+5" },
                  { n: 10, label: "+10" },
                ].map((btn) => (
                  <button
                    key={btn.n}
                    type="button"
                    onClick={() => setBuyAmount((prev) => Math.min(100, prev + btn.n))}
                    className="flex-1 py-1.5 rounded-xl border border-choco-900 bg-white hover:bg-candy-50 font-pixel text-xs font-bold text-choco-900 shadow-[0_1.5px_0_#3B2218] active:translate-y-0.5 cursor-pointer"
                  >
                    {btn.label}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setBuyAmount(Math.max(1, Math.min(100, Math.floor(gems / 10))))}
                  className="flex-1 py-1.5 rounded-xl border border-choco-900 bg-lemon hover:bg-lemon/80 font-pixel text-xs font-bold text-choco-900 shadow-[0_1.5px_0_#3B2218] active:translate-y-0.5 cursor-pointer"
                >
                  Maks
                </button>
              </div>
            </div>

            <div className="border-t-2 border-choco-900/15 pt-3 mb-4 flex items-center justify-between text-xs font-bold">
              <span className="text-choco-600">Total Biaya:</span>
              <span className="font-mono text-base font-black text-candy-700">
                {buyAmount * RAFFLE_TICKET_PRICE} Koin
              </span>
            </div>

            <button
              onClick={handleBuyTickets}
              disabled={gems < buyAmount * RAFFLE_TICKET_PRICE}
              className="w-full py-3 px-4 rounded-full border-2 border-choco-900 bg-candy-800 hover:bg-candy-950 disabled:opacity-40 text-white font-pixel text-xs font-bold shadow-[0_4px_0_#3B2218] active:translate-y-1 active:shadow-none cursor-pointer"
            >
              Konfirmasi Tukar
            </button>
          </div>
        </div>
      )}

      {/* MODAL 2: PASANG TIKET (DATA PESERTA: WALLET EVM & X) */}
      {enteringRaffle && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-choco-900/60 backdrop-blur-xs animate-in fade-in duration-150 overflow-y-auto"
          onClick={() => setEnteringRaffle(null)}
        >
          <div
            className="relative w-full max-w-md rounded-[28px] bg-cream border-3 border-choco-900 p-5 sm:p-6 shadow-[0_8px_0_#3B2218] text-choco-900 animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setEnteringRaffle(null)}
              aria-label="Tutup"
              className="absolute top-4 right-4 flex size-9 items-center justify-center rounded-full border-2 border-choco-900 bg-white text-choco-900 shadow-[0_1px_0_#3B2218] hover:bg-candy-100 active:translate-y-0.5 cursor-pointer"
            >
              <X className="size-4.5 stroke-[2.5]" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="size-11 rounded-2xl bg-candy-800 border-2 border-choco-900 flex items-center justify-center text-white shadow-[0_2px_0_#3B2218]">
                <Ticket className="size-6" />
              </div>
              <div>
                <h3 className="font-pixel text-base sm:text-lg font-bold text-choco-900">
                  {isEditWalletMode ? "Ubah Data Peserta" : "Pasang Tiket Undian"}
                </h3>
                <span className="text-xs text-candy-700 font-bold truncate block max-w-[240px]">
                  {enteringRaffle.title}
                </span>
              </div>
            </div>

            <form onSubmit={handleConfirmEntry} className="space-y-4">
              {/* Kotak Data Peserta */}
              <div className="p-4 rounded-2xl bg-white border-2 border-choco-900 shadow-[0_3px_0_#3B2218] space-y-3.5">
                <div className="text-xs font-pixel font-bold uppercase text-choco-900 flex items-center gap-1.5">
                  <Wallet className="size-4 text-candy-700" />
                  <span>Data Peserta</span>
                </div>

                {/* Input 1: Alamat Wallet EVM (Wajib untuk GTD/WL, disembunyikan untuk ITEM & GROUP) */}
                {(enteringRaffle.slotType === "GTD" ||
                  enteringRaffle.slotType === "WL" ||
                  (!enteringRaffle.slotType && enteringRaffle.category === "nft")) && (
                  <div>
                    <label className="block text-[11px] font-bold text-choco-800 mb-1">
                      Alamat Wallet EVM (Wajib)
                    </label>
                    <input
                      type="text"
                      value={inputWallet}
                      onChange={(e) => {
                        setInputWallet(e.target.value);
                        setWalletError(null);
                      }}
                      placeholder="0x…"
                      className="w-full px-3 py-2.5 rounded-xl bg-cream/40 border-2 border-choco-900 text-xs font-mono font-bold text-choco-900 placeholder:text-choco-400 shadow-[0_1.5px_0_#3B2218] focus:outline-none focus:ring-2 focus:ring-candy-500"
                    />
                    {walletError ? (
                      <p className="text-[10px] font-bold text-rose-600 mt-1">{walletError}</p>
                    ) : (
                      <p className="text-[10px] text-choco-500 mt-1">
                        Format 0x… 40 karakter hex (Ethereum, Base, Arbitrum).
                      </p>
                    )}
                  </div>
                )}

                {/* Input 2: Akun X (Wajib jika requirementXHandle terisi) */}
                <div>
                  <label className="block text-[11px] font-bold text-choco-800 mb-1">
                    Akun X (Twitter) {enteringRaffle.requirementXHandle ? "(Wajib)" : "(Opsional)"}
                  </label>
                  <div className="relative">
                    <AtSign className="size-4 text-choco-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={inputX}
                      onChange={(e) => {
                        setInputX(e.target.value);
                        setXError(null);
                      }}
                      placeholder="username_x"
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-cream/40 border-2 border-choco-900 text-xs font-semibold text-choco-900 placeholder:text-choco-400 shadow-[0_1.5px_0_#3B2218] focus:outline-none focus:ring-2 focus:ring-candy-500"
                    />
                  </div>
                  {xError && (
                    <p className="text-[10px] font-bold text-rose-600 mt-1">{xError}</p>
                  )}
                </div>

                {/* Teks Bantu Edukatif */}
                <p className="text-[11px] text-choco-600 font-medium leading-relaxed pt-1 border-t border-choco-900/10">
                  {enteringRaffle.slotType === "ITEM" || enteringRaffle.slotType === "GROUP"
                    ? "Hadiah dikirim ke akunmu jika menang. Tim Web3min tidak akan pernah DM kamu."
                    : "Wallet diteruskan ke proyek mitra jika kamu menang. Akun X dipakai untuk mengecek syarat follow. Mint dilakukan di situs resmi mitra. Tim Web3min tidak akan pernah DM kamu."}
                </p>
              </div>

              {/* Perkiraan Peluang */}
              {!isEditWalletMode && (
                <div className="p-3 rounded-xl bg-lemon/30 border border-choco-900/20 flex items-center justify-between text-xs">
                  <span className="font-semibold text-choco-700">Perkiraan Peluang:</span>
                  <span className="font-mono font-bold text-choco-900">
                    {Math.min(
                      100,
                      ((((enteredRaffles[enteringRaffle.id]?.count ?? 0) + 1) /
                        Math.max(1, (statsMap[enteringRaffle.id]?.total_tickets ?? 0) + 1)) *
                        enteringRaffle.winnerCount *
                        100)
                    ).toFixed(1)}
                    %
                  </span>
                </div>
              )}

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setEnteringRaffle(null)}
                  className="py-2.5 px-4 rounded-full bg-white hover:bg-cream text-choco-900 font-pixel font-bold text-xs border-2 border-choco-900 shadow-[0_2px_0_#3B2218] cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="py-2.5 px-6 rounded-full bg-candy-800 hover:bg-candy-950 disabled:opacity-40 text-white font-pixel font-bold text-xs border-2 border-choco-900 shadow-[0_3px_0_#3B2218] active:translate-y-1 active:shadow-none cursor-pointer flex items-center gap-1.5"
                >
                  <Check className="size-4" />
                  <span>
                    {isSubmitting
                      ? "Menyimpan..."
                      : isEditWalletMode
                      ? "Simpan Perubahan"
                      : "Konfirmasi Pasang"}
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: PANDUAN CARA KERJA UNDIAN */}
      {showGuideModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-choco-900/60 backdrop-blur-xs animate-in fade-in duration-150 overflow-y-auto"
          onClick={() => setShowGuideModal(false)}
        >
          <div
            className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-[28px] bg-cream border-3 border-choco-900 p-5 sm:p-6 shadow-[0_8px_0_#3B2218] text-choco-900 animate-in zoom-in-95 duration-200 space-y-4 tactile-scrollbar"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setShowGuideModal(false)}
              aria-label="Tutup"
              className="absolute top-4 right-4 flex size-9 items-center justify-center rounded-full border-2 border-choco-900 bg-white text-choco-900 shadow-[0_1px_0_#3B2218] hover:bg-candy-100 active:translate-y-0.5 cursor-pointer"
            >
              <X className="size-4.5 stroke-[2.5]" />
            </button>

            <div>
              <span className="px-2.5 py-0.5 rounded-full bg-candy-100 text-candy-800 font-pixel text-[9px] font-bold border border-choco-900">
                PANDUAN LENGKAP
              </span>
              <h3 className="font-pixel text-lg font-bold text-choco-900 mt-1">
                Cara Kerja Undian Hadiah
              </h3>
            </div>

            <div className="space-y-3.5 text-xs text-choco-800 leading-relaxed font-medium">
              <div className="p-3.5 rounded-2xl bg-white border-2 border-choco-900 shadow-[0_2px_0_#3B2218] space-y-1">
                <div className="font-pixel font-bold text-choco-900 text-xs">
                  1. Apa itu Undian?
                </div>
                <p>
                  Ada dua jenis hadiah. Item Limited: item Blobi edisi terbatas yang hanya bisa
                  didapat dari undian, punya nomor edisi, dan tidak dijual di Toko. Slot Mint:
                  hak mint NFT dari proyek mitra. GTD = kamu dijamin bisa mint di fase allowlist.
                  WL = kamu boleh ikut fase allowlist, tapi bisa kehabisan. Menang slot bukan
                  berarti NFT gratis: kamu tetap membayar harga mint dan gas.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-white border-2 border-choco-900 shadow-[0_2px_0_#3B2218] space-y-1">
                <div className="font-pixel font-bold text-choco-900 text-xs">
                  2. Cara Mendapat Tiket
                </div>
                <p>
                  1 tiket = 10 Koin, bisa dibeli di halaman ini. Tiket gratis juga didapat dari
                  checkpoint rute tertentu.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-white border-2 border-choco-900 shadow-[0_2px_0_#3B2218] space-y-1">
                <div className="font-pixel font-bold text-choco-900 text-xs">
                  3. Cara Pengundian
                </div>
                <p>
                  Sebelum undian dibuka, hash seed acak ditampilkan. Setelah waktu habis, server
                  memilih pemenang secara acak dengan bobot jumlah tiket. Satu akun maksimal satu
                  slot. Jika ada syarat follow, pemenang dicek manual sebelum diumumkan, dan yang
                  tidak memenuhi syarat diganti pemenang cadangan. Setelah diumumkan, seed
                  dipublikasikan.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-white border-2 border-choco-900 shadow-[0_2px_0_#3B2218] space-y-1">
                <div className="font-pixel font-bold text-choco-900 text-xs">
                  4. Bagaimana Kalau Aku Menang?
                </div>
                <p>
                  Hadiah item langsung masuk ke Ruang Ganti atau profilmu setelah diumumkan. Untuk
                  slot mint, wallet kamu diteruskan ke proyek mitra untuk masuk allowlist, lalu
                  mint dilakukan di situs resmi mereka sesuai jadwal, bukan di Web3min. Cocokkan
                  alamat situsnya dengan yang tertulis di kartu, jangan buka link dari DM, dan
                  jangan pernah memberikan seed phrase atau private key. Web3min bukan penerbit
                  NFT dan tidak memberi saran investasi, jadi pelajari proyeknya dulu (DYOR).
                </p>
              </div>
            </div>

            <div className="pt-2 text-right">
              <button
                onClick={() => setShowGuideModal(false)}
                className="py-2.5 px-6 rounded-full bg-choco-900 text-cream font-pixel font-bold text-xs shadow-[0_2px_0_#3B2218] active:translate-y-0.5 cursor-pointer"
              >
                Saya Mengerti
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: PREVIEW GAMBAR PENUH */}
      {previewImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-choco-900/80 backdrop-blur-xs animate-in fade-in duration-150"
          onClick={() => setPreviewImage(null)}
        >
          <div
            className="relative max-w-lg w-full rounded-3xl bg-cream border-3 border-choco-900 p-4 shadow-[0_8px_0_#3B2218] text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setPreviewImage(null)}
              aria-label="Tutup"
              className="absolute top-3 right-3 flex size-8 items-center justify-center rounded-full border-2 border-choco-900 bg-white text-choco-900 shadow-[0_1px_0_#3B2218] hover:bg-candy-100 cursor-pointer"
            >
              <X className="size-4" />
            </button>
            <h4 className="font-pixel text-sm font-bold text-choco-900 mb-3 px-8 truncate">
              {previewImage.title}
            </h4>
            <div className="aspect-square w-full rounded-2xl border-2 border-choco-900 bg-white overflow-hidden p-2 flex items-center justify-center">
              <img
                src={previewImage.url}
                alt={previewImage.title}
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        </div>
      )}

      {/* MODAL 5: VERIFIKASI COMMIT-REVEAL SEED HASH */}
      {previewFairness && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-choco-900/60 backdrop-blur-xs animate-in fade-in duration-150"
          onClick={() => setPreviewFairness(null)}
        >
          <div
            className="relative w-full max-w-md rounded-[28px] bg-cream border-3 border-choco-900 p-5 sm:p-6 shadow-[0_8px_0_#3B2218] text-choco-900 animate-in zoom-in-95 duration-200 space-y-3"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setPreviewFairness(null)}
              aria-label="Tutup"
              className="absolute top-4 right-4 flex size-9 items-center justify-center rounded-full border-2 border-choco-900 bg-white text-choco-900 shadow-[0_1px_0_#3B2218] hover:bg-candy-100 cursor-pointer"
            >
              <X className="size-4.5 stroke-[2.5]" />
            </button>

            <div className="flex items-center gap-2.5">
              <ShieldCheck className="size-5 text-emerald-600" />
              <h3 className="font-pixel text-base font-bold text-choco-900">
                Transparansi Commit-Reveal
              </h3>
            </div>

            <p className="text-xs text-choco-700 leading-relaxed font-medium">
              Sebelum undian dimulai, server membuat nilai acak (seed) rahasia 32-byte dan
              mengumumkan SHA-256 hash-nya di sini.
            </p>

            <div className="p-3 rounded-xl bg-white border border-choco-900/20 font-mono text-[11px] break-all">
              <div className="text-[9px] font-bold uppercase text-choco-500 mb-1">
                SHA-256 Seed Hash (Publik):
              </div>
              {previewFairness.seedHash || "-"}
            </div>

            {previewFairness.status === "ended" && previewFairness.drawSeed && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-500/30 font-mono text-[11px] break-all">
                <div className="text-[9px] font-bold uppercase text-emerald-700 mb-1">
                  Revealed Draw Seed (Setelah Selesai):
                </div>
                {previewFairness.drawSeed}
              </div>
            )}

            <p className="text-[11px] text-choco-600 leading-relaxed">
              Kamu bisa mencocokkan bahwa SHA-256 dari revealed seed di atas menghasilkan hash
              yang sama persis seperti yang diumumkan sebelum undian dimulai.
            </p>

            <div className="pt-2 text-right">
              <button
                onClick={() => setPreviewFairness(null)}
                className="py-2 px-5 rounded-full bg-choco-900 text-cream font-pixel font-bold text-xs cursor-pointer shadow-[0_2px_0_#3B2218]"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}
