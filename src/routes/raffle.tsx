import * as React from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Trophy,
  Ticket,
  Sparkles,
  Coins,
  ShieldCheck,
  Crown,
  Flame,
  Clock,
  ArrowRight,
  CheckCircle2,
  HelpCircle,
  Plus,
  Minus,
  ExternalLink,
  Zap,
  Gem,
  Award,
  Layers,
  Filter,
  Edit3,
  Trash2,
  Lock,
  Shield,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Mascot } from "@/components/mascot";
import { useProgress } from "@/lib/store";
import {
  rpcGetRaffles,
  rpcGetRaffleStats,
  rpcAdminDeleteRaffle,
  type DbRaffleItem,
  type DbRaffleStats,
} from "@/lib/server-sync";
import { INITIAL_RAFFLES, RAFFLE_TICKET_PRICE, type RaffleItem } from "@/lib/raffles";
import { playBuy, playClaim, playDeny, playTap } from "@/lib/audio";
import { CandyLoader } from "@/components/ui/progress-bar";
import {
  AdminLoginModal,
  AdminRaffleModal,
  AdminDeleteModal,
  type AdminRaffleData,
} from "@/components/admin-raffle-modal";

export const Route = createFileRoute("/raffle")({
  component: RafflePage,
});

type UnifiedRaffle = {
  id: string;
  title: string;
  prize: string;
  prizeDetail: string;
  category: "nft" | "gems" | "outfit" | "badge" | "tickets";
  nftNetwork?: string;
  nftContract?: string;
  nftTokenId?: string;
  nftRarity?: "mythic" | "legendary" | "rare" | "utility";
  status: "live" | "ended" | "upcoming" | "drawn";
  endsAt: number;
  ticketCost: number;
  winnerCount: number;
  perks: string[];
  imageUrl?: string;
  isSimulation?: boolean;
};

function formatCountdown(targetMs: number): string {
  const diff = targetMs - Date.now();
  if (diff <= 0) return "Selesai";
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  if (days > 0) return `${days} Hari ${hours} Jam`;
  if (hours > 0) return `${hours} Jam ${minutes} Mnt`;
  return `${minutes} Menit`;
}

function getRarityStyle(rarity?: string) {
  switch (rarity) {
    case "mythic":
      return {
        badgeBg: "bg-candy-500 text-white font-pixel font-bold border-2 border-choco-900 shadow-[0_2px_0_#3B2218]",
        label: "Mythic 1-of-1",
        borderColor: "border-choco-900",
        shadowColor: "#3B2218",
        icon: Crown,
      };
    case "legendary":
      return {
        badgeBg: "bg-lemon text-choco-900 font-pixel font-bold border-2 border-choco-900 shadow-[0_2px_0_#3B2218]",
        label: "Legendary",
        borderColor: "border-choco-900",
        shadowColor: "#3B2218",
        icon: Crown,
      };
    case "rare":
      return {
        badgeBg: "bg-purple-600 text-white font-pixel font-bold border-2 border-choco-900 shadow-[0_2px_0_#3B2218]",
        label: "Rare Artefak",
        borderColor: "border-choco-900",
        shadowColor: "#3B2218",
        icon: Flame,
      };
    case "utility":
      return {
        badgeBg: "bg-mint text-white font-pixel font-bold border-2 border-choco-900 shadow-[0_2px_0_#3B2218]",
        label: "Utility Pass",
        borderColor: "border-choco-900",
        shadowColor: "#3B2218",
        icon: ShieldCheck,
      };
    default:
      return {
        badgeBg: "bg-cream text-choco-900 font-pixel font-bold border-2 border-choco-900 shadow-[0_2px_0_#3B2218]",
        label: "Koleksi Khusus",
        borderColor: "border-choco-900",
        shadowColor: "#3B2218",
        icon: Award,
      };
  }
}

export function RafflePage() {
  const {
    raffleTickets = 3,
    enteredRaffles = {},
    gems = 0,
    enterRaffle,
    buyRaffleTicketsWithGems,
  } = useProgress();

  const [dbRaffles, setDbRaffles] = React.useState<DbRaffleItem[]>([]);
  const [statsMap, setStatsMap] = React.useState<Record<string, DbRaffleStats>>({});
  const [isDbLoading, setIsDbLoading] = React.useState(true);
  const [isDbConnected, setIsDbConnected] = React.useState(false);

  // Filters
  const [activeCategory, setActiveCategory] = React.useState<string>("all");
  const [activeStatus, setActiveStatus] = React.useState<"live" | "all">("live");

  // Modals & Notices
  const [toastMessage, setToastMessage] = React.useState<string | null>(null);
  const [showBuyModal, setShowBuyModal] = React.useState(false);
  const [buyAmount, setBuyAmount] = React.useState(1);
  const [enteringRaffle, setEnteringRaffle] = React.useState<UnifiedRaffle | null>(null);
  const [ticketToEnter, setTicketToEnter] = React.useState(1);
  const [showFaqModal, setShowFaqModal] = React.useState(false);

  // Admin Mode State
  const [adminKey, setAdminKey] = React.useState<string | null>(null);
  const [showAdminLogin, setShowAdminLogin] = React.useState(false);
  const [showAdminRaffleModal, setShowAdminRaffleModal] = React.useState(false);
  const [editingRaffle, setEditingRaffle] = React.useState<AdminRaffleData | null>(null);
  const [deletingRaffle, setDeletingRaffle] = React.useState<UnifiedRaffle | null>(null);
  const [isDeleting, setIsDeleting] = React.useState(false);

  const isAdmin = Boolean(adminKey);

  // Load from Supabase DB on mount & reload trigger
  const refreshData = React.useCallback(async () => {
    setIsDbLoading(true);
    try {
      const [raffles, stats] = await Promise.all([
        rpcGetRaffles(),
        rpcGetRaffleStats(),
      ]);
      if (Array.isArray(raffles) && raffles.length > 0) {
        setDbRaffles(raffles);
        setIsDbConnected(true);
      }
      if (stats && Object.keys(stats).length > 0) {
        setStatsMap(stats);
      }
    } catch (err) {
      console.warn("[raffle] Failed to fetch data from DB:", err);
    } finally {
      setIsDbLoading(false);
    }
  }, []);

  React.useEffect(() => {
    void refreshData();
    try {
      const savedAuth = localStorage.getItem("web3min_admin_auth");
      if (savedAuth) {
        const parsed = JSON.parse(savedAuth);
        if (parsed?.key) {
          setAdminKey(parsed.key);
        }
      }
    } catch {}
  }, [refreshData]);

  // Merge DB raffles with local fallback
  const allRaffles: UnifiedRaffle[] = React.useMemo(() => {
    if (dbRaffles.length > 0) {
      return dbRaffles.map((r) => {
        let parsedPerks: string[] = [];
        if (Array.isArray(r.perks)) {
          parsedPerks = r.perks;
        } else if (typeof r.perks === "string") {
          try {
            parsedPerks = JSON.parse(r.perks);
          } catch {
            parsedPerks = [];
          }
        }
        return {
          id: r.id,
          title: r.title,
          prize: r.prize,
          prizeDetail: r.prize_detail || "",
          category: (r.category as UnifiedRaffle["category"]) || "nft",
          nftNetwork: r.nft_network,
          nftContract: r.nft_contract,
          nftTokenId: r.nft_token_id,
          nftRarity: r.nft_rarity,
          status: (r.status as UnifiedRaffle["status"]) || "live",
          endsAt: r.ends_at ? new Date(r.ends_at).getTime() : Date.now() + 7 * 86400000,
          ticketCost: r.ticket_cost || 1,
          winnerCount: r.winner_count || 1,
          perks: parsedPerks.length > 0 ? parsedPerks : ["Akses eksklusif artefak Web3min"],
          imageUrl: r.image_url || undefined,
          isSimulation: r.is_simulation ?? true,
        };
      });
    }

    // Fallback to INITIAL_RAFFLES
    return INITIAL_RAFFLES.map((r: RaffleItem): UnifiedRaffle => ({
      id: r.id,
      title: r.title,
      prize: r.prize,
      prizeDetail: r.prizeDetail,
      category: (r.category === "gems" || r.category === "outfit" || r.category === "badge" || r.category === "tickets"
        ? r.category
        : "gems") as UnifiedRaffle["category"],
      nftNetwork: r.category === ("nft" as string) ? "Ethereum" : undefined,
      nftRarity: (r.category === ("nft" as string) ? "rare" : "utility") as UnifiedRaffle["nftRarity"],
      status: r.status as UnifiedRaffle["status"],
      endsAt: r.endsAt,
      ticketCost: r.ticketCost,
      winnerCount: r.winnerCount,
      perks: Array.isArray(r.requirements) ? r.requirements : [],
      imageUrl: r.imageUrl || undefined,
      isSimulation: r.isSimulation ?? true,
    }));
  }, [dbRaffles]);

  // Filtered raffles
  const filteredRaffles = React.useMemo(() => {
    return allRaffles.filter((item) => {
      if (activeStatus === "live" && item.status !== "live") return false;
      if (activeCategory === "nft") return item.category === "nft";
      if (activeCategory === "gems") return item.category === "gems";
      if (activeCategory === "outfit") return item.category === "outfit";
      if (activeCategory === "badge") return item.category === "badge";
      if (activeCategory === "tickets") return item.category === "tickets";
      return true;
    });
  }, [allRaffles, activeCategory, activeStatus]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleBuyTickets = () => {
    const cost = buyAmount * RAFFLE_TICKET_PRICE;
    if (gems < cost) {
      playDeny();
      showToast(`Saldo Koin tidak mencukupi! Butuh ${cost} Koin.`);
      return;
    }
    const ok = buyRaffleTicketsWithGems(buyAmount);
    if (ok) {
      playBuy();
      showToast(`Sukses membeli ${buyAmount} Tiket Undian! (+${buyAmount} Tiket)`);
      setShowBuyModal(false);
      setBuyAmount(1);
    } else {
      playDeny();
      showToast("Gagal memproses pembelian tiket.");
    }
  };

  const handleOpenEnterModal = (raffle: UnifiedRaffle) => {
    playTap();
    if (raffleTickets <= 0) {
      setShowBuyModal(true);
      return;
    }
    setEnteringRaffle(raffle);
    setTicketToEnter(1);
  };

  const handleConfirmEnter = () => {
    if (!enteringRaffle) return;
    if (raffleTickets < ticketToEnter) {
      playDeny();
      showToast("Jumlah tiket kamu tidak mencukupi.");
      return;
    }
    const ok = enterRaffle(enteringRaffle.id, ticketToEnter);
    if (ok) {
      playClaim();
      showToast(
        `Sukses memasang ${ticketToEnter} Tiket untuk "${enteringRaffle.title}"! Semoga beruntung!`
      );
      setEnteringRaffle(null);
      setTicketToEnter(1);
    } else {
      playDeny();
      showToast("Gagal memasang tiket undian.");
    }
  };

  const handleAdminLogout = () => {
    localStorage.removeItem("web3min_admin_auth");
    setAdminKey(null);
    showToast("Berhasil keluar dari mode admin.");
  };

  const handleOpenCreateModal = () => {
    setEditingRaffle(null);
    setShowAdminRaffleModal(true);
  };

  const handleOpenEditModal = (r: UnifiedRaffle) => {
    setEditingRaffle({
      id: r.id,
      title: r.title,
      prize: r.prize,
      prizeDetail: r.prizeDetail,
      category: r.category,
      status: r.status,
      endsAt: new Date(r.endsAt).toISOString(),
      ticketCost: r.ticketCost,
      winnerCount: r.winnerCount,
      imageUrl: r.imageUrl,
      nftNetwork: r.nftNetwork,
      nftContract: r.nftContract,
      nftTokenId: r.nftTokenId,
      nftRarity: r.nftRarity,
      perks: r.perks,
    });
    setShowAdminRaffleModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!deletingRaffle || !adminKey) return;
    setIsDeleting(true);
    const res = await rpcAdminDeleteRaffle(adminKey, deletingRaffle.id);
    setIsDeleting(false);
    if (res.success) {
      showToast(`Undian "${deletingRaffle.title}" berhasil dihapus.`);
      setDeletingRaffle(null);
      void refreshData();
    } else {
      showToast(res.error || "Gagal menghapus undian.");
    }
  };

  return (
    <AppShell>
      <div className="mx-auto max-w-4xl px-4 py-6 md:py-8 space-y-6">
        {/* Arena Sub-Navigation Tabs */}
        <div className="flex items-center gap-2 rounded-2xl border-2 border-choco-900/20 bg-gradient-to-b from-white via-[#FFF9F5] to-[#FDEEE4] p-1.5 shadow-[0_4px_0_#3B2218,0_10px_20px_-4px_rgba(59,34,24,0.12)] max-w-md mx-auto">
          <Link
            to="/leaderboard"
            className="flex-1 inline-flex items-center justify-center gap-2 py-2 px-3 rounded-xl border-2 border-transparent hover:border-choco-900/20 hover:bg-candy-50 text-xs md:text-sm font-bold text-choco-600 hover:text-choco-900 transition-all"
          >
            <Trophy className="h-4 w-4 shrink-0 text-choco-700" />
            <span>Klasemen Mingguan</span>
          </Link>
          <Link
            to="/raffle"
            className="flex-1 inline-flex items-center justify-center gap-2 py-2 px-3 rounded-xl border-2 border-purple-600/50 bg-gradient-to-b from-[#A855F7] via-[#9333EA] to-[#7E22CE] text-xs md:text-sm font-bold text-white shadow-[0_3px_0_#581C87] transition-transform"
          >
            <Ticket className="h-4 w-4 shrink-0 text-yellow-300" />
            <span>Undian Raffle NFT</span>
          </Link>
        </div>

        {/* Hero Banner Card (Solid Arcade Candy Neo-Brutalism) */}
        <div className="relative overflow-hidden rounded-3xl border-2 border-amber-500/40 bg-gradient-to-b from-[#FFFBEB] via-[#FEF3C7] to-[#FDE68A] p-5 md:p-6 text-choco-900 shadow-[0_6px_0_#D97706,0_12px_28px_-4px_rgba(217,119,6,0.22)]">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-1.5 rounded-full border-2 border-choco-900/20 bg-white/90 px-2.5 py-0.5 text-[11px] font-pixel font-bold uppercase tracking-wider text-choco-900 shadow-[0_2px_0_#3B2218]">
                <Trophy className="h-3.5 w-3.5 text-amber-500" />
                Arena Undian On-Chain • Siklus Aktif
              </div>
              <h1 className="text-2xl md:text-3xl font-display font-bold tracking-tight text-choco-900">
                Undian Hadiah & NFT Artefak
              </h1>
              <p className="text-xs md:text-sm font-semibold text-choco-700 max-w-xl leading-relaxed">
                Tukarkan Koin hasil belajar & klasemenmu jadi Tiket Undian. Menangkan artefak ERC-721 langka, status VIP, dan bundel koin mingguan!
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => {
                  playTap();
                  setShowFaqModal(true);
                }}
                className="inline-flex items-center justify-center gap-1.5 rounded-2xl border-2 border-choco-900/20 bg-white px-3.5 py-2 text-xs font-pixel font-bold text-choco-900 shadow-[0_3px_0_#3B2218] transition-transform hover:-translate-y-0.5 active:translate-y-0.5"
              >
                <HelpCircle className="h-3.5 w-3.5 text-choco-900" />
                <span>Cara Kerja</span>
              </button>
            </div>
          </div>
        </div>

        {/* User Balance Wallet Card (Compact) */}
        <div className="rounded-3xl border-2 border-candy-500/40 bg-gradient-to-b from-[#FFF0F5] via-[#FFE4EC] to-[#FDC8D8] p-4 md:p-5 text-choco-900 shadow-[0_6px_0_#B01F62,0_12px_28px_-4px_rgba(232,67,127,0.22)]">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border-2 border-amber-500/50 bg-gradient-to-b from-[#FFFBEB] via-[#FEF3C7] to-[#FDE68A] text-choco-900 shadow-[0_3px_0_#D97706] shrink-0">
                <Ticket className="h-6 w-6 stroke-[2.5]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-lg md:text-xl font-display font-bold text-choco-900">
                    {raffleTickets} Tiket Undian
                  </span>
                  <span className="rounded-lg border-2 border-candy-600/40 bg-white/90 px-2 py-0.5 text-[10px] font-bold text-candy-600 uppercase shadow-[0_1px_0_#B01F62]">
                    Tersedia
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-choco-700 mt-0.5">
                  <span className="flex items-center gap-1 text-amber-800 font-bold">
                    <Coins className="h-3.5 w-3.5 fill-amber-500 text-amber-700" />
                    Saldo: {gems} Koin
                  </span>
                  <span>•</span>
                  <span>1 Tiket = {RAFFLE_TICKET_PRICE} Koin</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <button
                onClick={() => {
                  playTap();
                  setShowBuyModal(true);
                }}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 rounded-2xl border-2 border-amber-600/50 bg-gradient-to-b from-[#FFE873] via-[#FFD84D] to-[#E6BF35] px-4 py-2 text-xs md:text-sm font-bold text-choco-900 shadow-[0_3px_0_#C8940C] transition-transform hover:-translate-y-0.5 active:translate-y-0.5"
              >
                <Plus className="h-4 w-4 stroke-[3]" />
                <span>Beli Tiket Tambahan</span>
              </button>
            </div>
          </div>
        </div>

        {/* Toast Banner */}
        {toastMessage && (
          <div className="flex items-center gap-3 rounded-2xl border-2 border-emerald-500/40 bg-gradient-to-b from-[#F0FDF4] via-[#DCFCE7] to-[#BBF7D0] p-4 font-bold text-emerald-950 shadow-[0_4px_0_#15803D,0_10px_20px_-4px_rgba(21,128,61,0.22)] animate-bounce">
            <CheckCircle2 className="h-6 w-6 text-emerald-700 shrink-0" />
            <p className="text-sm">{toastMessage}</p>
          </div>
        )}

        {/* Filter Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          {/* Categories */}
          <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
            {[
              { id: "all", label: "Semua Koleksi" },
              { id: "nft", label: "NFT Artefak" },
              { id: "gems", label: "Koin & Bintang" },
              { id: "outfit", label: "Outfit Karakter" },
              { id: "badge", label: "Lencana Gelar" },
              { id: "tickets", label: "Bundel Tiket" },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  playTap();
                  setActiveCategory(cat.id);
                }}
                className={`rounded-xl border-2 border-ink-900 px-3 py-1.5 text-xs font-black transition-all ${
                  activeCategory === cat.id
                    ? "bg-candy-500 text-white shadow-[2px_2px_0_#2B1622]"
                    : "bg-white text-ink-700 hover:bg-candy-50 hover:text-ink-900"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Status Toggle */}
          <div className="flex items-center gap-1 rounded-xl border-2 border-ink-900 bg-white p-1 shrink-0 self-end sm:self-auto">
            <button
              onClick={() => {
                playTap();
                setActiveStatus("live");
              }}
              className={`rounded-lg px-2.5 py-1 text-xs font-black transition-all ${
                activeStatus === "live"
                  ? "bg-emerald-400 text-ink-900 shadow-[1px_1px_0_#2B1622]"
                  : "text-ink-500 hover:text-ink-900"
              }`}
            >
              Berlangsung ({allRaffles.filter((r) => r.status === "live").length})
            </button>
            <button
              onClick={() => {
                playTap();
                setActiveStatus("all");
              }}
              className={`rounded-lg px-2.5 py-1 text-xs font-black transition-all ${
                activeStatus === "all"
                  ? "bg-amber-300 text-ink-900 shadow-[1px_1px_0_#2B1622]"
                  : "text-ink-500 hover:text-ink-900"
              }`}
            >
              Semua ({allRaffles.length})
            </button>
          </div>
        </div>

        {/* Admin Control Banner (Mode Admin Aktif) */}
        {isAdmin && (
          <div className="p-4 sm:p-5 rounded-3xl bg-amber-300 border-3 border-choco-900 shadow-[0_6px_0_#3B2218] text-choco-900 flex flex-col sm:flex-row items-center justify-between gap-3 animate-in fade-in duration-200">
            <div className="flex items-center gap-3">
              <div className="size-11 rounded-2xl bg-choco-900 text-amber-300 flex items-center justify-center font-bold text-lg shadow-[0_2px_0_#3B2218]">
                👑
              </div>
              <div>
                <span className="font-pixel text-[10px] uppercase font-bold text-choco-800 bg-amber-400/80 px-2 py-0.5 rounded-full border border-choco-900/30">
                  Akses Admin Web3min
                </span>
                <h4 className="font-pixel text-base sm:text-lg font-bold text-choco-900 leading-tight mt-0.5">
                  Mode Pengelola Undian Aktif
                </h4>
              </div>
            </div>
            <div className="flex items-center gap-2.5 w-full sm:w-auto">
              <button
                type="button"
                onClick={handleOpenCreateModal}
                className="flex-1 sm:flex-initial py-2.5 px-5 rounded-full bg-candy-500 hover:bg-candy-600 text-white font-pixel font-bold text-xs sm:text-sm border-2 border-choco-900 shadow-[0_3px_0_#3B2218] active:translate-y-0.5 cursor-pointer flex items-center justify-center gap-2"
              >
                <Plus className="size-4" />
                <span>+ Buat Undian Baru</span>
              </button>
              <button
                type="button"
                onClick={handleAdminLogout}
                className="py-2.5 px-4 rounded-full bg-white hover:bg-cream-100 text-choco-900 font-pixel font-bold text-xs border-2 border-choco-900 shadow-[0_2px_0_#3B2218] active:translate-y-0.5 cursor-pointer"
              >
                Keluar Admin
              </button>
            </div>
          </div>
        )}

        {/* Raffles Grid */}
        {allRaffles.length === 0 && isDbLoading ? (
          <div className="p-12 flex flex-col items-center justify-center space-y-4">
            <CandyLoader size="lg" label="MENYINKRONKAN KATALOG UNDIAN NFT..." />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredRaffles.map((raffle) => {
            const rarityStyle = getRarityStyle(raffle.nftRarity);
            const RarityIcon = rarityStyle.icon;
            const stats = statsMap[raffle.id];
            const liveTotalTickets = stats?.total_tickets ?? (raffle.id === "raf-genesis-blobi" ? 48 : 24);
            const userEntered = enteredRaffles[raffle.id]?.count ?? 0;
            const isLive = raffle.status === "live";

            return (
              <div
                key={raffle.id}
                data-raffle-card
                className="flex flex-col justify-between overflow-hidden rounded-3xl border-2 border-choco-900/18 bg-gradient-to-b from-white via-[#FFF9F5] to-[#FDEEE4] p-4 md:p-5 shadow-[0_6px_0_#3B2218,0_12px_28px_-4px_rgba(59,34,24,0.12)] transition-transform hover:-translate-y-1"
              >
                <div className="space-y-3">
                  {/* Top Badges */}
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`inline-flex items-center gap-1 rounded-lg border-2 border-choco-900/20 px-2 py-0.5 text-[11px] font-bold shadow-[0_1.5px_0_#3B2218] ${rarityStyle.badgeBg}`}
                      >
                        <RarityIcon className="h-3 w-3" />
                        {rarityStyle.label}
                      </span>

                      {raffle.nftNetwork && (
                        <span className="rounded-lg border-2 border-candy-500/30 bg-gradient-to-b from-[#FFF0F5] to-[#FFE4EC] px-2 py-0.5 text-[11px] font-bold text-choco-800 shadow-[0_1px_0_#B01F62]">
                          {raffle.nftNetwork}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5">
                      {isLive ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full border-2 border-emerald-500/40 bg-gradient-to-b from-[#F0FDF4] to-[#DCFCE7] px-2.5 py-0.5 text-[10px] font-bold text-emerald-800 shadow-[0_1.5px_0_#15803D]">
                          <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600"></span>
                          </span>
                          LIVE
                        </span>
                      ) : (
                        <span className="rounded-full border border-choco-900/20 bg-stone-100 px-2.5 py-0.5 text-[10px] font-bold text-choco-600">
                          SELESAI
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Title & Prize */}
                  <div>
                    <h2 className="text-xl font-display font-bold text-choco-900 leading-tight">
                      {raffle.title}
                    </h2>
                    <div className="text-xs font-bold text-candy-600 mt-1 flex items-center gap-1">
                      <Award className="h-3.5 w-3.5 shrink-0" />
                      {raffle.prize}
                    </div>
                    {raffle.nftContract && (
                      <div className="text-[11px] font-mono text-choco-500 mt-0.5">
                        Kontrak: {raffle.nftContract} {raffle.nftTokenId ? `• ${raffle.nftTokenId}` : ""}
                      </div>
                    )}
                  </div>

                  {/* Artwork / Image Space for NFT or Project */}
                  {raffle.imageUrl && (
                    <div className="relative w-full h-44 sm:h-52 overflow-hidden rounded-2xl border-2 border-choco-900 bg-choco-900/5 shadow-[0_3px_0_#3B2218] my-2.5">
                      <img
                        src={raffle.imageUrl}
                        alt={raffle.title}
                        className="w-full h-full object-cover object-center"
                        loading="lazy"
                      />
                      <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-choco-900/85 text-white font-pixel text-[9px] font-bold shadow-xs">
                        NFT ARTIFACT
                      </div>
                    </div>
                  )}

                  {/* Prize Details & Perks */}
                  <p className="text-xs font-semibold text-choco-700 leading-relaxed">
                    {raffle.prizeDetail}
                  </p>

                  <div className="space-y-1.5 pt-1">
                    <div className="text-[11px] font-bold uppercase text-choco-500 tracking-wider">
                      Keistimewaan Artefak:
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {raffle.perks.map((perk, i) => (
                        <span
                          key={i}
                          className="inline-flex items-center gap-1 rounded-md border border-choco-900/15 bg-white/90 px-2 py-0.5 text-[11px] font-semibold text-choco-800 shadow-[0_1px_0_rgba(59,34,24,0.1)]"
                        >
                          <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                          {perk}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Pool Telemetry */}
                  <div className="grid grid-cols-2 gap-2 rounded-2xl border-2 border-candy-500/25 bg-gradient-to-b from-[#FFF5F8] to-[#FFEBF1] p-3 text-xs shadow-[0_2px_0_#B01F62]">
                    <div>
                      <div className="text-[10px] font-bold uppercase text-choco-500">Tiket Terkumpul</div>
                      <div className="font-display font-bold text-choco-900 text-sm flex items-center gap-1 mt-0.5">
                        <Ticket className="h-3.5 w-3.5 text-amber-600" />
                        {liveTotalTickets} Tiket
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] font-bold uppercase text-choco-500">Pemenang</div>
                      <div className="font-display font-bold text-choco-900 text-sm flex items-center gap-1 mt-0.5">
                        <Crown className="h-3.5 w-3.5 text-yellow-600" />
                        {raffle.winnerCount} Pemenang
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] font-bold uppercase text-choco-500">Tiket Kamu</div>
                      <div className="font-bold text-candy-600 text-sm mt-0.5 font-display">
                        {userEntered > 0 ? `${userEntered} Tiket Dipasang` : "Belum Ikut"}
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] font-bold uppercase text-choco-500">Sisa Waktu</div>
                      <div className="font-display font-bold text-choco-900 text-sm flex items-center gap-1 mt-0.5">
                        <Clock className="h-3.5 w-3.5 text-purple-600" />
                        {formatCountdown(raffle.endsAt)}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card CTA Bottom */}
                <div className="pt-3.5 border-t-2 border-choco-900/10 mt-3.5 space-y-1.5">
                  <button
                    disabled={!isLive}
                    onClick={() => handleOpenEnterModal(raffle)}
                    className={`w-full inline-flex items-center justify-center gap-2 rounded-2xl border-2 py-2.5 text-xs md:text-sm font-bold transition-transform shadow-[0_3px_0_#B01F62] ${
                      !isLive
                        ? "bg-stone-200 border-stone-300 text-stone-500 cursor-not-allowed shadow-none"
                        : raffleTickets > 0
                        ? "border-candy-600/60 bg-gradient-to-b from-[#FF6699] via-[#E8437F] to-[#D82668] text-white hover:brightness-105 active:translate-y-[2px] active:shadow-none"
                        : "border-amber-600/50 bg-gradient-to-b from-[#FFE873] via-[#FFD84D] to-[#E6BF35] text-choco-900 hover:brightness-105 active:translate-y-[2px] active:shadow-none"
                    }`}
                  >
                    <Ticket className="h-4 w-4" />
                    <span>
                      {!isLive
                        ? "Undian Telah Berakhir"
                        : raffleTickets > 0
                        ? `Pasang Tiket (${raffle.ticketCost} Tiket)`
                        : "Beli Tiket Dulu"}
                    </span>
                  </button>

                  {userEntered > 0 && (
                    <div className="text-center text-[11px] font-bold text-emerald-800 bg-emerald-50 rounded-xl py-1 border-2 border-emerald-300 shadow-[0_1px_0_#15803D]">
                      Kamu memiliki {userEntered} nomor entri aktif di undian ini!
                    </div>
                  )}

                  {/* Admin Card Action Buttons */}
                  {isAdmin && (
                    <div className="pt-2 flex items-center gap-2 border-t-2 border-choco-900/10 mt-2">
                      <button
                        type="button"
                        onClick={() => handleOpenEditModal(raffle)}
                        className="flex-1 py-2 px-3 rounded-xl bg-amber-400 hover:bg-amber-500 text-choco-900 font-pixel font-bold text-xs border-2 border-choco-900 shadow-[0_2px_0_#3B2218] active:translate-y-0.5 cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        <Edit3 className="size-3.5" />
                        <span>Edit Undian</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeletingRaffle(raffle)}
                        className="py-2 px-3 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-pixel font-bold text-xs border-2 border-choco-900 shadow-[0_2px_0_#3B2218] active:translate-y-0.5 cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        <Trash2 className="size-3.5" />
                        <span>Hapus</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        )}

        {/* Bottom Educational Banner in Tactile Beveled Style */}
        <div className="rounded-3xl border-2 border-choco-900/18 bg-gradient-to-b from-white via-[#FFF9F5] to-[#FDEEE4] p-6 md:p-8 shadow-[0_6px_0_#3B2218,0_12px_28px_-4px_rgba(59,34,24,0.12)] space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl border-2 border-amber-500/50 bg-gradient-to-b from-[#FFFBEB] via-[#FEF3C7] to-[#FDE68A] text-choco-900 shadow-[0_2px_0_#D97706]">
              <HelpCircle className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-display font-bold text-choco-900">
                Transparansi & Mekanisme Undian Web3min
              </h3>
              <p className="text-xs font-semibold text-choco-600">
                Pemenang ditentukan secara adil berbasis hash kriptografis terdesentralisasi
              </p>
            </div>
          </div>

          {/* Asymmetrical Bento Step Flow */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            {/* Step 1 & 2: Asymmetric Left Pods */}
            <div className="flex flex-col justify-between rounded-2xl border-2 border-choco-900/20 bg-gradient-to-b from-white to-[#FBE9DC] p-4 space-y-2 shadow-[0_3px_0_#3B2218]">
              <div className="flex items-center gap-2.5">
                <div className="size-8 rounded-xl border-2 border-amber-500/40 bg-gradient-to-b from-[#FFFBEB] to-[#FEF3C7] flex items-center justify-center shadow-[0_1.5px_0_#D97706] shrink-0">
                  <img src="/props/coins.png" alt="Koin" className="size-5 object-contain pixelated" />
                </div>
                <div className="text-xs font-display font-bold text-choco-900">
                  1. Belajar & Sikat Koin
                </div>
              </div>
              <p className="text-[11px] font-semibold text-choco-700 leading-relaxed">
                Tiap nyelesaiin modul rute & tembus Top 1.000 klasemen mingguan, koin otomatis ngalir ke dompet belajarmu.
              </p>
            </div>

            <div className="flex flex-col justify-between rounded-2xl border-2 border-choco-900/20 bg-gradient-to-b from-white to-[#FBE9DC] p-4 space-y-2 shadow-[0_3px_0_#3B2218]">
              <div className="flex items-center gap-2.5">
                <div className="size-8 rounded-xl border-2 border-amber-500/40 bg-gradient-to-b from-[#FFFBEB] to-[#FEF3C7] flex items-center justify-center shadow-[0_1.5px_0_#D97706] shrink-0">
                  <Ticket className="size-4 text-choco-900" />
                </div>
                <div className="text-xs font-display font-bold text-choco-900">
                  2. Tukar Tiket Undian
                </div>
              </div>
              <p className="text-[11px] font-semibold text-choco-700 leading-relaxed">
                Tukar 10 Koin buat 1 Tiket. Pasang tiket sebanyak-banyaknya di pool aktif biar peluang menangnya makin gede.
              </p>
            </div>

            {/* Step 3: Hero Bento Card */}
            <div className="flex flex-col justify-between rounded-2xl border-2 border-amber-500/40 bg-gradient-to-b from-[#FFFBEB] via-[#FEF3C7] to-[#FDE68A] p-4 space-y-2 shadow-[0_4px_0_#D97706]">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="size-8 rounded-xl border-2 border-choco-900/20 bg-white flex items-center justify-center shadow-[0_1.5px_0_#3B2218] shrink-0">
                    <Crown className="size-4 text-choco-900" />
                  </div>
                  <div className="text-xs font-display font-bold text-choco-900">
                    3. Klaim On-Chain!
                  </div>
                </div>
                <img src="/mascot/celebrate.png" alt="Blobi Rayakan" className="size-8 object-contain pixelated" />
              </div>
              <p className="text-[11px] font-semibold text-choco-800 leading-relaxed">
                Pemenang dikunci seed VRF transparan tanpa manipulasi. Sambungin wallet EVM, NFT langsung airdrop ke dompetmu!
              </p>
            </div>
          </div>
        </div>

        {/* Modal: Beli Tiket */}
        {showBuyModal && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-choco-900/60 backdrop-blur-xs animate-in fade-in duration-150"
            onClick={() => {
              playTap();
              setShowBuyModal(false);
            }}
          >
            <div
              className="relative w-full max-w-md rounded-[28px] border-3 border-choco-900 bg-cream p-5 sm:p-6 shadow-[0_8px_0_#3B2218] space-y-5 animate-in zoom-in-95 duration-200 text-choco-900"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b-2 border-choco-900/15 pb-4">
                <div className="flex items-center gap-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl border-2 border-choco-900 bg-amber-200 text-choco-900 shadow-[0_2px_0_#3B2218]">
                    <Ticket className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-pixel font-bold text-choco-900">Beli Tiket Undian</h3>
                    <p className="text-xs font-semibold text-choco-600">1 Tiket = {RAFFLE_TICKET_PRICE} Koin</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    playTap();
                    setShowBuyModal(false);
                  }}
                  className="flex size-9 sm:size-10 items-center justify-center rounded-full border-2 border-choco-900 bg-white text-choco-900 shadow-[0_1px_0_#3B2218] hover:bg-candy-100 active:translate-y-0.5 cursor-pointer transition-all"
                  aria-label="Tutup"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <div className="rounded-2xl border-2 border-amber-500/40 bg-gradient-to-b from-[#FFFBEB] to-[#FEF3C7] p-4 flex items-center justify-between shadow-[0_2px_0_#D97706]">
                  <div className="text-xs font-bold text-choco-700">Saldo Koin Kamu</div>
                  <div className="font-bold text-sm text-amber-900 flex items-center gap-1 font-pixel">
                    <Coins className="h-4 w-4 fill-amber-500 text-amber-700" />
                    {gems} Koin
                  </div>
                </div>

                {/* Amount Selector */}
                <div className="space-y-2">
                  <div className="text-xs font-bold text-choco-700">Pilih Jumlah Tiket:</div>
                  <div className="flex items-center justify-between rounded-2xl border-2 border-candy-500/30 bg-gradient-to-b from-[#FFF5F8] to-[#FFEBF1] p-3 shadow-[0_2px_0_#B01F62]">
                    <button
                      disabled={buyAmount <= 1}
                      onClick={() => {
                        playTap();
                        setBuyAmount((p) => Math.max(1, p - 1));
                      }}
                      className={`flex h-10 w-10 items-center justify-center rounded-xl border-2 border-choco-900/20 font-bold shadow-[0_2px_0_#3B2218] active:translate-y-0.5 ${
                        buyAmount <= 1
                          ? "bg-stone-100 text-stone-400 cursor-not-allowed shadow-none"
                          : "bg-white text-choco-900"
                      }`}
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <div className="text-2xl font-display font-bold text-choco-900">
                      {buyAmount} <span className="text-xs font-semibold text-choco-500">Tiket</span>
                    </div>
                    <button
                      onClick={() => {
                        playTap();
                        setBuyAmount((p) => Math.min(100, p + 1));
                      }}
                      className="flex h-10 w-10 items-center justify-center rounded-xl border-2 border-choco-900/20 bg-white font-bold text-choco-900 shadow-[0_2px_0_#3B2218] active:translate-y-0.5"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Preset Buttons */}
                  <div className="flex items-center gap-2">
                    {[1, 5, 10, 20].map((num) => (
                      <button
                        key={num}
                        onClick={() => {
                          playTap();
                          setBuyAmount(num);
                        }}
                        className={`flex-1 py-1.5 rounded-xl border-2 text-xs font-bold transition-all ${
                          buyAmount === num
                            ? "border-amber-600/50 bg-gradient-to-b from-[#FFE873] via-[#FFD84D] to-[#E6BF35] text-choco-900 shadow-[0_2px_0_#C8940C]"
                            : "border-choco-900/20 bg-white text-choco-800 shadow-[0_1.5px_0_#3B2218]"
                        }`}
                      >
                        +{num}
                      </button>
                    ))}
                    <button
                      onClick={() => {
                        playTap();
                        const maxTickets = Math.max(1, Math.floor(gems / RAFFLE_TICKET_PRICE));
                        setBuyAmount(maxTickets);
                      }}
                      className="px-3 py-1.5 rounded-xl border-2 border-candy-500/40 bg-gradient-to-b from-[#FFF0F5] to-[#FFE4EC] text-xs font-bold text-candy-800 shadow-[0_1.5px_0_#B01F62] hover:bg-candy-100"
                    >
                      Maks
                    </button>
                  </div>
                </div>

                {/* Summary */}
                <div className="rounded-2xl border-2 border-choco-900/15 bg-white p-3 space-y-2 text-xs shadow-[0_1.5px_0_#3B2218]">
                  <div className="flex justify-between font-semibold text-choco-700">
                    <span>Total Biaya:</span>
                    <span className="font-bold text-choco-900 font-pixel">
                      {buyAmount * RAFFLE_TICKET_PRICE} Koin
                    </span>
                  </div>
                  <div className="flex justify-between font-semibold text-choco-700">
                    <span>Sisa Saldo Koin:</span>
                    <span
                      className={`font-bold font-pixel ${
                        gems >= buyAmount * RAFFLE_TICKET_PRICE
                          ? "text-emerald-700"
                          : "text-red-600"
                      }`}
                    >
                      {gems - buyAmount * RAFFLE_TICKET_PRICE} Koin
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={() => {
                    playTap();
                    setShowBuyModal(false);
                  }}
                  className="flex-1 rounded-2xl border-2 border-choco-900/20 bg-white py-3 text-xs md:text-sm font-bold text-choco-800 shadow-[0_2px_0_#3B2218] active:translate-y-0.5"
                >
                  Batal
                </button>
                <button
                  disabled={gems < buyAmount * RAFFLE_TICKET_PRICE}
                  onClick={handleBuyTickets}
                  className={`flex-1 rounded-2xl border-2 py-3 text-xs md:text-sm font-bold shadow-[0_3px_0_#C8940C] active:translate-y-0.5 ${
                    gems >= buyAmount * RAFFLE_TICKET_PRICE
                      ? "border-amber-600/50 bg-gradient-to-b from-[#FFE873] via-[#FFD84D] to-[#E6BF35] text-choco-900 hover:brightness-105"
                      : "bg-stone-200 border-stone-300 text-stone-400 cursor-not-allowed shadow-none"
                  }`}
                >
                  Beli {buyAmount} Tiket
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal: Pasang Tiket ke Undian */}
        {enteringRaffle && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-choco-900/60 backdrop-blur-xs animate-in fade-in duration-150"
            onClick={() => {
              playTap();
              setEnteringRaffle(null);
            }}
          >
            <div
              className="relative w-full max-w-md rounded-[28px] border-3 border-choco-900 bg-cream p-5 sm:p-6 shadow-[0_8px_0_#3B2218] space-y-5 animate-in zoom-in-95 duration-200 text-choco-900"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b-2 border-choco-900/15 pb-4">
                <div className="flex items-center gap-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl border-2 border-choco-900 bg-purple-200 text-purple-900 shadow-[0_2px_0_#3B2218]">
                    <Ticket className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-pixel font-bold text-choco-900">Pasang Tiket Undian</h3>
                    <p className="text-xs font-semibold text-choco-600">{enteringRaffle.title}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    playTap();
                    setEnteringRaffle(null);
                  }}
                  className="flex size-9 sm:size-10 items-center justify-center rounded-full border-2 border-choco-900 bg-white text-choco-900 shadow-[0_1px_0_#3B2218] hover:bg-candy-100 active:translate-y-0.5 cursor-pointer transition-all"
                  aria-label="Tutup"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <div className="rounded-2xl border-2 border-candy-500/30 bg-gradient-to-b from-[#FFF0F5] to-[#FFE4EC] p-4 space-y-1 shadow-[0_2px_0_#B01F62]">
                  <div className="text-[11px] font-bold uppercase text-candy-600">Hadiah Utama</div>
                  <div className="font-display font-bold text-sm text-choco-900">{enteringRaffle.prize}</div>
                  <div className="text-xs font-semibold text-choco-600">{enteringRaffle.prizeDetail}</div>
                </div>

                <div className="flex items-center justify-between rounded-2xl border-2 border-amber-500/40 bg-gradient-to-b from-[#FFFBEB] to-[#FEF3C7] p-3 shadow-[0_2px_0_#D97706]">
                  <span className="text-xs font-bold text-choco-700">Tiket Undian Kamu:</span>
                  <span className="font-bold text-amber-900 text-sm font-pixel">{raffleTickets} Tiket</span>
                </div>

                {/* Amount Selector */}
                <div className="space-y-2">
                  <div className="text-xs font-bold text-choco-700">Jumlah Tiket yang Dipasang:</div>
                  <div className="flex items-center justify-between rounded-2xl border-2 border-candy-500/30 bg-gradient-to-b from-[#FFF5F8] to-[#FFEBF1] p-3 shadow-[0_2px_0_#B01F62]">
                    <button
                      disabled={ticketToEnter <= 1}
                      onClick={() => {
                        playTap();
                        setTicketToEnter((p) => Math.max(1, p - 1));
                      }}
                      className={`flex h-10 w-10 items-center justify-center rounded-xl border-2 border-choco-900/20 font-bold shadow-[0_2px_0_#3B2218] active:translate-y-0.5 ${
                        ticketToEnter <= 1
                          ? "bg-stone-100 text-stone-400 cursor-not-allowed shadow-none"
                          : "bg-white text-choco-900"
                      }`}
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <div className="text-2xl font-display font-bold text-choco-900">
                      {ticketToEnter} <span className="text-xs font-semibold text-choco-500">Tiket</span>
                    </div>
                    <button
                      disabled={ticketToEnter >= raffleTickets}
                      onClick={() => {
                        playTap();
                        setTicketToEnter((p) => Math.min(raffleTickets, p + 1));
                      }}
                      className={`flex h-10 w-10 items-center justify-center rounded-xl border-2 border-choco-900/20 font-bold shadow-[0_2px_0_#3B2218] active:translate-y-0.5 ${
                        ticketToEnter >= raffleTickets
                          ? "bg-stone-100 text-stone-400 cursor-not-allowed shadow-none"
                          : "bg-white text-choco-900"
                      }`}
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Preset Steppers */}
                  <div className="flex items-center gap-2">
                    {[1, 3, 5].map((num) => (
                      <button
                        key={num}
                        disabled={raffleTickets < num}
                        onClick={() => {
                          playTap();
                          setTicketToEnter(num);
                        }}
                        className={`flex-1 py-1.5 rounded-xl border-2 text-xs font-bold transition-all ${
                          ticketToEnter === num
                            ? "border-purple-600/50 bg-gradient-to-b from-[#FAF5FF] via-[#F3E8FF] to-[#E9D5FF] text-purple-900 shadow-[0_2px_0_#7E22CE]"
                            : "border-choco-900/20 bg-white text-choco-800 shadow-[0_1.5px_0_#3B2218]"
                        }`}
                      >
                        {num} Tiket
                      </button>
                    ))}
                    <button
                      onClick={() => {
                        playTap();
                        setTicketToEnter(raffleTickets);
                      }}
                      className="px-3 py-1.5 rounded-xl border-2 border-candy-500/40 bg-gradient-to-b from-[#FFF0F5] to-[#FFE4EC] text-xs font-bold text-candy-800 shadow-[0_1.5px_0_#B01F62] hover:bg-candy-100"
                    >
                      Semua ({raffleTickets})
                    </button>
                  </div>
                </div>

                {/* Odds Increase & Summary Box */}
                {(() => {
                  const alreadyEntered = enteredRaffles[enteringRaffle.id]?.count ?? 0;
                  const poolTickets = statsMap[enteringRaffle.id]?.total_tickets ?? 0;
                  const totalAfter = poolTickets + ticketToEnter;
                  const myTotal = alreadyEntered + ticketToEnter;
                  const oddsPercent = totalAfter > 0 ? ((myTotal / totalAfter) * 100).toFixed(1) : "100";

                  return (
                    <div className="rounded-2xl border-2 border-purple-500/30 bg-gradient-to-b from-[#FAF5FF] to-[#F3E8FF] p-3 space-y-1.5 text-xs shadow-[0_2px_0_#7E22CE]">
                      <div className="flex justify-between items-center font-semibold text-choco-700">
                        <span className="flex items-center gap-1">
                          <Zap className="h-3.5 w-3.5 text-purple-600" />
                          Tiket Kamu di Undian Ini:
                        </span>
                        <span className="font-bold text-purple-900 font-pixel">
                          {alreadyEntered > 0 ? `${alreadyEntered} + ${ticketToEnter}` : ticketToEnter} Tiket
                        </span>
                      </div>
                      <div className="flex justify-between items-center font-semibold text-choco-700">
                        <span className="flex items-center gap-1">
                          <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                          Estimasi Peluang Menang:
                        </span>
                        <span className="font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-lg border border-emerald-500/40 shadow-[0_1px_0_#15803D]">
                          ~{oddsPercent}%
                        </span>
                      </div>
                    </div>
                  );
                })()}
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={() => {
                    playTap();
                    setEnteringRaffle(null);
                  }}
                  className="flex-1 rounded-2xl border-2 border-choco-900/20 bg-white py-3 text-xs md:text-sm font-bold text-choco-800 shadow-[0_2px_0_#3B2218] active:translate-y-0.5"
                >
                  Batal
                </button>
                <button
                  onClick={handleConfirmEnter}
                  className="flex-1 rounded-2xl border-2 border-candy-600/60 bg-gradient-to-b from-[#FF6699] via-[#E8437F] to-[#D82668] py-3 text-xs md:text-sm font-bold text-white shadow-[0_4px_0_#B01F62,0_8px_16px_-2px_rgba(232,67,127,0.25)] hover:brightness-105 active:translate-y-[2px] active:shadow-none transition-all"
                >
                  Konfirmasi Pasang
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal: FAQ & Cara Kerja */}
        {showFaqModal && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-choco-900/60 backdrop-blur-xs animate-in fade-in duration-150"
            onClick={() => {
              playTap();
              setShowFaqModal(false);
            }}
          >
            <div
              className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-[28px] border-3 border-choco-900 bg-cream p-5 sm:p-6 shadow-[0_8px_0_#3B2218] space-y-5 animate-in zoom-in-95 duration-200 text-choco-900"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b-2 border-choco-900/15 pb-4">
                <div className="flex items-center gap-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl border-2 border-choco-900 bg-purple-200 text-purple-900 shadow-[0_2px_0_#3B2218]">
                    <HelpCircle className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-pixel font-bold text-choco-900">Panduan Undian Raffle</h3>
                    <p className="text-xs font-semibold text-choco-600">Mekanisme transparan & fair</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    playTap();
                    setShowFaqModal(false);
                  }}
                  className="flex size-9 sm:size-10 items-center justify-center rounded-full border-2 border-choco-900 bg-white text-choco-900 shadow-[0_1px_0_#3B2218] hover:bg-candy-100 active:translate-y-0.5 cursor-pointer transition-all"
                  aria-label="Tutup"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4 text-xs font-semibold text-choco-800 leading-relaxed">
                <div className="rounded-2xl border-2 border-candy-500/30 bg-gradient-to-b from-[#FFF0F5] to-[#FFE4EC] p-4 space-y-1 shadow-[0_2px_0_#B01F62]">
                  <div className="font-display font-bold text-sm text-choco-900">Apa itu Undian Raffle Web3min?</div>
                  <p>
                    Raffle adalah arena undian berhadiah resmi Web3min di mana kamu dapat menukarkan koin kemenangan belajar untuk memenangkan artefak NFT langka, gelar profil, dan voucher in-game.
                  </p>
                </div>

                <div className="rounded-2xl border-2 border-amber-500/40 bg-gradient-to-b from-[#FFFBEB] to-[#FEF3C7] p-4 space-y-1 shadow-[0_2px_0_#D97706]">
                  <div className="font-display font-bold text-sm text-choco-900">Bagaimana Cara Mendapatkan Tiket?</div>
                  <p>
                    Tiket dapat dibeli seharga 10 Koin per tiket di halaman ini atau Toko Blobi. Kamu juga mendapatkan tiket gratis saat menyelesaikan rute checkpoint tertentu!
                  </p>
                </div>

                <div className="rounded-2xl border-2 border-emerald-500/40 bg-gradient-to-b from-[#F0FDF4] to-[#DCFCE7] p-4 space-y-1 shadow-[0_2px_0_#15803D]">
                  <div className="font-display font-bold text-sm text-choco-900">Bagaimana Pengundian Pemenang Dilakukan?</div>
                  <p>
                    Ketika waktu mundur berakhir, database memicu fungsi draw dengan seed acak kriptografis (VRF pattern) yang memilih pemenang berdasarkan proporsi tiket yang dipasang. Semakin banyak tiket yang kamu pasang, semakin besar peluang menangmu!
                  </p>
                </div>

                <div className="rounded-2xl border-2 border-purple-500/30 bg-gradient-to-b from-[#FAF5FF] to-[#F3E8FF] p-4 space-y-1 shadow-[0_2px_0_#7E22CE]">
                  <div className="font-display font-bold text-sm text-choco-900">Bagaimana Cara Menerima NFT yang Dimenangkan?</div>
                  <p>
                    Jika kamu memenangkan NFT, kamu dapat menghubungkan dompet Web3 kamu di menu profil untuk mengklaim transfer kepemilikan NFT ke jaringan yang sesuai (Ethereum, Base, Arbitrum, atau Optimism).
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  playTap();
                  setShowFaqModal(false);
                }}
                className="w-full rounded-2xl border-2 border-amber-600/50 bg-gradient-to-b from-[#FFE873] via-[#FFD84D] to-[#E6BF35] py-3 font-bold text-choco-900 shadow-[0_4px_0_#C8940C,0_8px_16px_-2px_rgba(255,216,77,0.25)] hover:brightness-105 active:translate-y-[2px] active:shadow-none transition-all"
              >
                Saya Paham
              </button>
            </div>
          </div>
        )}

        {/* Footer Admin Entry Point */}
        <div className="flex justify-center pt-2 pb-6">
          {!isAdmin ? (
            <button
              type="button"
              onClick={() => setShowAdminLogin(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cream border-2 border-choco-900 text-choco-700 hover:text-choco-900 hover:bg-candy-100 font-pixel text-xs font-bold shadow-[0_2px_0_#3B2218] active:translate-y-0.5 cursor-pointer transition-all"
            >
              <Lock className="size-3.5 text-candy-600" />
              <span>Akses Login Admin Undian</span>
            </button>
          ) : (
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-200 border-2 border-choco-900 font-pixel text-xs font-bold text-choco-900 shadow-[0_2px_0_#3B2218]">
              <Shield className="size-3.5 text-choco-900" />
              <span>Sesi Admin Aktif</span>
            </div>
          )}
        </div>
      </div>

      {/* Admin Login Modal */}
      <AdminLoginModal
        isOpen={showAdminLogin}
        onClose={() => setShowAdminLogin(false)}
        onSuccess={(key) => {
          setAdminKey(key);
          showToast("Berhasil masuk sebagai Admin Undian! 👑");
        }}
      />

      {/* Admin Add/Edit Raffle Modal with Image Space */}
      {adminKey && (
        <AdminRaffleModal
          isOpen={showAdminRaffleModal}
          onClose={() => {
            setShowAdminRaffleModal(false);
            setEditingRaffle(null);
          }}
          onSaved={() => {
            showToast("Katalog undian berhasil diperbarui! 🚀");
            void refreshData();
          }}
          initialData={editingRaffle}
          adminKey={adminKey}
        />
      )}

      {/* Admin Delete Confirmation Modal */}
      {deletingRaffle && (
        <AdminDeleteModal
          isOpen={Boolean(deletingRaffle)}
          onClose={() => setDeletingRaffle(null)}
          onConfirm={handleConfirmDelete}
          title={deletingRaffle.title}
          loading={isDeleting}
        />
      )}
    </AppShell>
  );
}
