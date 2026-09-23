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
  Database,
  ExternalLink,
  Zap,
  Gem,
  Award,
  Layers,
  Filter,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Mascot } from "@/components/mascot";
import { useProgress } from "@/lib/store";
import {
  rpcGetRaffles,
  rpcGetRaffleStats,
  type DbRaffleItem,
  type DbRaffleStats,
} from "@/lib/server-sync";
import { INITIAL_RAFFLES, RAFFLE_TICKET_PRICE, type RaffleItem } from "@/lib/raffles";
import { playBuy, playClaim, playDeny, playTap } from "@/lib/audio";
import { CandyLoader } from "@/components/ui/progress-bar";

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
        badgeBg: "bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 text-white",
        label: "Mythic 1-of-1",
        borderColor: "border-pink-600",
        shadowColor: "#831843",
        icon: Sparkles,
      };
    case "legendary":
      return {
        badgeBg: "bg-gradient-to-r from-amber-400 to-yellow-300 text-ink-900 font-black",
        label: "Legendary",
        borderColor: "border-amber-500",
        shadowColor: "#78350F",
        icon: Crown,
      };
    case "rare":
      return {
        badgeBg: "bg-gradient-to-r from-purple-500 to-indigo-600 text-white",
        label: "Rare Artefak",
        borderColor: "border-purple-600",
        shadowColor: "#3B0764",
        icon: Flame,
      };
    case "utility":
      return {
        badgeBg: "bg-gradient-to-r from-emerald-500 to-teal-600 text-white",
        label: "Utility Pass",
        borderColor: "border-emerald-600",
        shadowColor: "#064E3B",
        icon: ShieldCheck,
      };
    default:
      return {
        badgeBg: "bg-amber-300 text-ink-900 font-black",
        label: "Koleksi Khusus",
        borderColor: "border-amber-400",
        shadowColor: "#2B1622",
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

  // Load from Supabase DB on mount
  React.useEffect(() => {
    let active = true;
    async function loadData() {
      setIsDbLoading(true);
      try {
        const [raffles, stats] = await Promise.all([
          rpcGetRaffles(),
          rpcGetRaffleStats(),
        ]);
        if (active) {
          if (Array.isArray(raffles) && raffles.length > 0) {
            setDbRaffles(raffles);
            setIsDbConnected(true);
          }
          if (stats && Object.keys(stats).length > 0) {
            setStatsMap(stats);
          }
        }
      } catch (err) {
        console.warn("[raffle] Failed to fetch data from DB:", err);
      } finally {
        if (active) setIsDbLoading(false);
      }
    }
    void loadData();
    return () => {
      active = false;
    };
  }, []);

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

  return (
    <AppShell>
      <div className="mx-auto max-w-4xl px-4 py-6 md:py-8 space-y-6">
        {/* Arena Sub-Navigation Tabs */}
        <div className="flex items-center gap-2 rounded-2xl border-3 border-ink-900 bg-white/90 p-1.5 shadow-[3px_3px_0_#2B1622] max-w-md mx-auto">
          <Link
            to="/leaderboard"
            className="flex-1 inline-flex items-center justify-center gap-2 py-2 px-3 rounded-xl border-2 border-transparent hover:border-ink-900 hover:bg-candy-50 text-xs md:text-sm font-bold text-ink-600 hover:text-ink-900 transition-all"
          >
            <Trophy className="h-4 w-4 shrink-0 text-ink-700" />
            <span>Klasemen Mingguan</span>
          </Link>
          <Link
            to="/raffle"
            className="flex-1 inline-flex items-center justify-center gap-2 py-2 px-3 rounded-xl border-2 border-ink-900 bg-purple-500 text-xs md:text-sm font-black text-white shadow-[2px_2px_0_#2B1622] transition-transform"
          >
            <Ticket className="h-4 w-4 shrink-0 text-yellow-300" />
            <span>Undian Raffle NFT</span>
          </Link>
        </div>

        {/* Hero Banner Card (Compact Arcade Candy) */}
        <div className="relative overflow-hidden rounded-3xl border-4 border-ink-900 bg-gradient-to-r from-violet-600 via-purple-600 to-pink-500 p-4 md:p-5 text-white shadow-[4px_4px_0_#2B1622]">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 rounded-full border-2 border-white/40 bg-white/20 px-2.5 py-0.5 text-[11px] font-black uppercase tracking-wider backdrop-blur-sm shadow-[1px_1px_0_rgba(0,0,0,0.2)]">
                <Sparkles className="h-3.5 w-3.5 text-yellow-300" />
                Arena Undian On-Chain • Siklus Aktif
              </div>
              <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white drop-shadow-sm">
                Undian Hadiah & NFT Artefak
              </h1>
              <p className="text-xs md:text-sm font-medium text-purple-100 max-w-xl">
                Tukarkan Koin hasil belajar & klasemenmu menjadi Tiket Undian untuk memenangkan artefak langka ERC-721, status VIP, dan bundel koin!
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => {
                  playTap();
                  setShowFaqModal(true);
                }}
                className="inline-flex items-center justify-center gap-1.5 rounded-xl border-2 border-ink-900 bg-white px-3 py-2 text-xs font-black text-ink-900 shadow-[2px_2px_0_#2B1622] transition-transform hover:-translate-y-0.5 active:translate-y-0.5"
              >
                <HelpCircle className="h-3.5 w-3.5 text-purple-600" />
                <span>Cara Kerja</span>
              </button>
              <div className="flex items-center gap-1.5 px-2.5 py-2 rounded-xl bg-black/25 text-[11px] font-bold text-white backdrop-blur-sm border border-white/20">
                <Database className="h-3.5 w-3.5 text-emerald-400" />
                <span>
                  {isDbConnected
                    ? "Supabase Live"
                    : isDbLoading
                    ? "Koneksi..."
                    : "Lokal"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* User Balance Wallet Card (Compact) */}
        <div className="rounded-2xl border-3 border-ink-900 bg-candy-100 p-3.5 md:p-4 shadow-[3px_3px_0_#2B1622]">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl border-2 border-ink-900 bg-amber-400 text-ink-900 shadow-[2px_2px_0_#2B1622] shrink-0">
                <Ticket className="h-6 w-6 stroke-[2.5]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-lg md:text-xl font-black text-ink-900">
                    {raffleTickets} Tiket Undian
                  </span>
                  <span className="rounded-md border border-ink-900 bg-yellow-300 px-1.5 py-0.2 text-[10px] font-black text-ink-900 uppercase">
                    Tersedia
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-ink-700 mt-0.5">
                  <span className="flex items-center gap-1 text-amber-900 font-black">
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
                className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 rounded-xl border-2 border-ink-900 bg-yellow-400 px-4 py-2 text-xs md:text-sm font-black text-ink-900 shadow-[2px_2px_0_#2B1622] transition-transform hover:-translate-y-0.5 active:translate-y-0.5"
              >
                <Plus className="h-4 w-4 stroke-[3]" />
                <span>Beli Tiket Tambahan</span>
              </button>
            </div>
          </div>
        </div>

        {/* Toast Banner */}
        {toastMessage && (
          <div className="flex items-center gap-3 rounded-2xl border-3 border-ink-900 bg-emerald-100 p-4 font-black text-emerald-950 shadow-[3px_3px_0_#2B1622] animate-bounce">
            <CheckCircle2 className="h-6 w-6 text-emerald-600 shrink-0" />
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
                className="flex flex-col justify-between overflow-hidden rounded-3xl border-3 border-ink-900 bg-white p-4 md:p-5 shadow-[4px_4px_0_#2B1622] transition-transform hover:-translate-y-1"
              >
                <div className="space-y-3">
                  {/* Top Badges */}
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`inline-flex items-center gap-1 rounded-lg border-2 border-ink-900 px-2 py-0.5 text-[11px] font-black shadow-[1px_1px_0_#2B1622] ${rarityStyle.badgeBg}`}
                      >
                        <RarityIcon className="h-3 w-3" />
                        {rarityStyle.label}
                      </span>

                      {raffle.nftNetwork && (
                        <span className="rounded-lg border-2 border-ink-900 bg-candy-100 px-2 py-0.5 text-[11px] font-black text-ink-800">
                          {raffle.nftNetwork}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5">
                      {isLive ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-600 bg-emerald-50 px-2.5 py-0.5 text-[10px] font-black text-emerald-800">
                          <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600"></span>
                          </span>
                          LIVE
                        </span>
                      ) : (
                        <span className="rounded-full border border-ink-300 bg-ink-100 px-2.5 py-0.5 text-[10px] font-black text-ink-600">
                          SELESAI
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Title & Prize */}
                  <div>
                    <h2 className="text-xl font-black text-ink-900 leading-tight">
                      {raffle.title}
                    </h2>
                    <div className="text-xs font-extrabold text-candy-600 mt-1 flex items-center gap-1">
                      <Award className="h-3.5 w-3.5 shrink-0" />
                      {raffle.prize}
                    </div>
                    {raffle.nftContract && (
                      <div className="text-[11px] font-mono text-ink-500 mt-0.5">
                        Kontrak: {raffle.nftContract} {raffle.nftTokenId ? `• ${raffle.nftTokenId}` : ""}
                      </div>
                    )}
                  </div>

                  {/* Prize Details & Perks */}
                  <p className="text-xs font-bold text-ink-700 leading-relaxed">
                    {raffle.prizeDetail}
                  </p>

                  <div className="space-y-1.5 pt-1">
                    <div className="text-[11px] font-black uppercase text-ink-500 tracking-wider">
                      Keistimewaan Artefak:
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {raffle.perks.map((perk, i) => (
                        <span
                          key={i}
                          className="inline-flex items-center gap-1 rounded-md border border-ink-900/20 bg-candy-50/80 px-2 py-0.5 text-[11px] font-bold text-ink-800"
                        >
                          <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                          {perk}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Pool Telemetry */}
                  <div className="grid grid-cols-2 gap-2 rounded-2xl border-2 border-ink-900 bg-candy-50 p-3 text-xs">
                    <div>
                      <div className="text-[10px] font-black uppercase text-ink-500">Tiket Terkumpul</div>
                      <div className="font-black text-ink-900 text-sm flex items-center gap-1 mt-0.5">
                        <Ticket className="h-3.5 w-3.5 text-amber-600" />
                        {liveTotalTickets} Tiket
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] font-black uppercase text-ink-500">Pemenang</div>
                      <div className="font-black text-ink-900 text-sm flex items-center gap-1 mt-0.5">
                        <Crown className="h-3.5 w-3.5 text-yellow-600" />
                        {raffle.winnerCount} Pemenang
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] font-black uppercase text-ink-500">Tiket Kamu</div>
                      <div className="font-black text-candy-600 text-sm mt-0.5">
                        {userEntered > 0 ? `${userEntered} Tiket Dipasang` : "Belum Ikut"}
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] font-black uppercase text-ink-500">Sisa Waktu</div>
                      <div className="font-black text-ink-900 text-sm flex items-center gap-1 mt-0.5">
                        <Clock className="h-3.5 w-3.5 text-purple-600" />
                        {formatCountdown(raffle.endsAt)}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card CTA Bottom */}
                <div className="pt-3.5 border-t-2 border-ink-900/10 mt-3.5 space-y-1.5">
                  <button
                    disabled={!isLive}
                    onClick={() => handleOpenEnterModal(raffle)}
                    className={`w-full inline-flex items-center justify-center gap-2 rounded-xl border-2 border-ink-900 py-2.5 text-xs md:text-sm font-black transition-transform shadow-[2px_2px_0_#2B1622] ${
                      !isLive
                        ? "bg-ink-200 text-ink-500 cursor-not-allowed"
                        : raffleTickets > 0
                        ? "bg-candy-500 text-white hover:-translate-y-0.5 active:translate-y-0.5"
                        : "bg-amber-300 text-ink-900 hover:-translate-y-0.5 active:translate-y-0.5"
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
                    <div className="text-center text-[11px] font-black text-emerald-700 bg-emerald-50 rounded-lg py-1 border border-emerald-300">
                      Kamu memiliki {userEntered} nomor entri aktif di undian ini!
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        )}

        {/* Bottom Educational Banner */}
        <div className="rounded-3xl border-4 border-ink-900 bg-white p-6 md:p-8 shadow-[4px_4px_0_#2B1622] space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border-2 border-ink-900 bg-yellow-300 text-ink-900 shadow-[2px_2px_0_#2B1622]">
              <HelpCircle className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-ink-900">
                Transparansi & Mekanisme Undian Web3min
              </h3>
              <p className="text-xs font-bold text-ink-600">
                Pemenang ditentukan secara adil berbasis hash kriptografis terdesentralisasi
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            <div className="rounded-2xl border-2 border-ink-900 bg-candy-50 p-4 space-y-1.5 shadow-[2px_2px_0_#2B1622]">
              <div className="text-xs font-black text-ink-900 flex items-center gap-1.5">
                <Coins className="h-4 w-4 text-amber-600" />
                1. Belajar & Kumpulkan Koin
              </div>
              <p className="text-[11px] font-bold text-ink-700 leading-relaxed">
                Setiap menyelesaikan bab modul dan mencapai Top 1.000 klasemen mingguan, koin otomatis masuk ke dompet belajarmu.
              </p>
            </div>

            <div className="rounded-2xl border-2 border-ink-900 bg-candy-50 p-4 space-y-1.5 shadow-[2px_2px_0_#2B1622]">
              <div className="text-xs font-black text-ink-900 flex items-center gap-1.5">
                <Ticket className="h-4 w-4 text-purple-600" />
                2. Tukar Tiket & Ikut Putaran
              </div>
              <p className="text-[11px] font-bold text-ink-700 leading-relaxed">
                Tukarkan 10 Koin untuk 1 Tiket Undian. Pasang tiket sebanyak-banyaknya untuk melipatgandakan peluang kemenanganmu.
              </p>
            </div>

            <div className="rounded-2xl border-2 border-ink-900 bg-candy-50 p-4 space-y-1.5 shadow-[2px_2px_0_#2B1622]">
              <div className="text-xs font-black text-ink-900 flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                3. Klaim NFT On-Chain
              </div>
              <p className="text-[11px] font-bold text-ink-700 leading-relaxed">
                Saat undian ditutup, seed acak transparan memilih pemenang. Pemenang dapat menghubungkan wallet EVM untuk airdrop NFT langsung.
              </p>
            </div>
          </div>
        </div>

        {/* Modal: Beli Tiket */}
        {showBuyModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink-900/60 p-4 backdrop-blur-sm animate-fade-in">
            <div className="relative w-full max-w-md rounded-3xl border-4 border-ink-900 bg-white p-6 shadow-[6px_6px_0_#2B1622] space-y-5 animate-scale-in">
              <div className="flex items-center justify-between border-b-2 border-ink-900/10 pb-4">
                <div className="flex items-center gap-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl border-2 border-ink-900 bg-yellow-300 text-ink-900 shadow-[2px_2px_0_#2B1622]">
                    <Ticket className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-ink-900">Beli Tiket Undian</h3>
                    <p className="text-xs font-bold text-ink-500">1 Tiket = {RAFFLE_TICKET_PRICE} Koin</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    playTap();
                    setShowBuyModal(false);
                  }}
                  className="rounded-xl border-2 border-ink-900 bg-ink-100 p-1.5 text-xs font-black text-ink-800 hover:bg-ink-200"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <div className="rounded-2xl border-2 border-ink-900 bg-amber-50 p-4 flex items-center justify-between">
                  <div className="text-xs font-bold text-ink-700">Saldo Koin Kamu</div>
                  <div className="font-black text-sm text-amber-900 flex items-center gap-1">
                    <Coins className="h-4 w-4 fill-amber-500 text-amber-700" />
                    {gems} Koin
                  </div>
                </div>

                {/* Amount Selector */}
                <div className="space-y-2">
                  <div className="text-xs font-black text-ink-700">Pilih Jumlah Tiket:</div>
                  <div className="flex items-center justify-between rounded-2xl border-3 border-ink-900 bg-candy-50 p-3">
                    <button
                      disabled={buyAmount <= 1}
                      onClick={() => {
                        playTap();
                        setBuyAmount((p) => Math.max(1, p - 1));
                      }}
                      className={`flex h-10 w-10 items-center justify-center rounded-xl border-2 border-ink-900 font-black shadow-[2px_2px_0_#2B1622] active:translate-y-0.5 ${
                        buyAmount <= 1
                          ? "bg-ink-100 text-ink-400 cursor-not-allowed"
                          : "bg-white text-ink-900"
                      }`}
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <div className="text-2xl font-black text-ink-900">
                      {buyAmount} <span className="text-xs font-bold text-ink-500">Tiket</span>
                    </div>
                    <button
                      onClick={() => {
                        playTap();
                        setBuyAmount((p) => Math.min(100, p + 1));
                      }}
                      className="flex h-10 w-10 items-center justify-center rounded-xl border-2 border-ink-900 bg-white font-black shadow-[2px_2px_0_#2B1622] active:translate-y-0.5"
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
                        className={`flex-1 py-1.5 rounded-xl border-2 border-ink-900 text-xs font-black ${
                          buyAmount === num ? "bg-amber-300 shadow-[2px_2px_0_#2B1622]" : "bg-white"
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
                      className="px-3 py-1.5 rounded-xl border-2 border-ink-900 bg-candy-100 text-xs font-black text-candy-900 hover:bg-candy-200"
                    >
                      Maks
                    </button>
                  </div>
                </div>

                {/* Summary */}
                <div className="rounded-2xl border-2 border-ink-900 bg-white p-3 space-y-2 text-xs">
                  <div className="flex justify-between font-bold text-ink-700">
                    <span>Total Biaya:</span>
                    <span className="font-black text-ink-900">
                      {buyAmount * RAFFLE_TICKET_PRICE} Koin
                    </span>
                  </div>
                  <div className="flex justify-between font-bold text-ink-700">
                    <span>Sisa Saldo Koin:</span>
                    <span
                      className={`font-black ${
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
                  className="flex-1 rounded-2xl border-2 border-ink-900 bg-ink-100 py-3 text-xs md:text-sm font-black text-ink-800 shadow-[2px_2px_0_#2B1622] active:translate-y-0.5"
                >
                  Batal
                </button>
                <button
                  disabled={gems < buyAmount * RAFFLE_TICKET_PRICE}
                  onClick={handleBuyTickets}
                  className={`flex-1 rounded-2xl border-3 border-ink-900 py-3 text-xs md:text-sm font-black shadow-[3px_3px_0_#2B1622] active:translate-y-0.5 ${
                    gems >= buyAmount * RAFFLE_TICKET_PRICE
                      ? "bg-yellow-400 text-ink-900 hover:-translate-y-0.5"
                      : "bg-ink-200 text-ink-400 cursor-not-allowed"
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
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink-900/60 p-4 backdrop-blur-sm animate-fade-in">
            <div className="relative w-full max-w-md rounded-3xl border-4 border-ink-900 bg-white p-6 shadow-[6px_6px_0_#2B1622] space-y-5 animate-scale-in">
              <div className="flex items-center justify-between border-b-2 border-ink-900/10 pb-4">
                <div className="flex items-center gap-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl border-2 border-ink-900 bg-purple-400 text-ink-900 shadow-[2px_2px_0_#2B1622]">
                    <Ticket className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-ink-900">Pasang Tiket Undian</h3>
                    <p className="text-xs font-bold text-ink-500">{enteringRaffle.title}</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    playTap();
                    setEnteringRaffle(null);
                  }}
                  className="rounded-xl border-2 border-ink-900 bg-ink-100 p-1.5 text-xs font-black text-ink-800 hover:bg-ink-200"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <div className="rounded-2xl border-2 border-ink-900 bg-candy-50 p-4 space-y-1">
                  <div className="text-[11px] font-black uppercase text-ink-500">Hadiah Utama</div>
                  <div className="font-black text-sm text-ink-900">{enteringRaffle.prize}</div>
                  <div className="text-xs font-bold text-ink-600">{enteringRaffle.prizeDetail}</div>
                </div>

                <div className="flex items-center justify-between rounded-2xl border-2 border-ink-900 bg-amber-50 p-3">
                  <span className="text-xs font-bold text-ink-700">Tiket Undian Kamu:</span>
                  <span className="font-black text-amber-900 text-sm">{raffleTickets} Tiket</span>
                </div>

                {/* Amount Selector */}
                <div className="space-y-2">
                  <div className="text-xs font-black text-ink-700">Jumlah Tiket yang Dipasang:</div>
                  <div className="flex items-center justify-between rounded-2xl border-3 border-ink-900 bg-candy-50 p-3">
                    <button
                      disabled={ticketToEnter <= 1}
                      onClick={() => {
                        playTap();
                        setTicketToEnter((p) => Math.max(1, p - 1));
                      }}
                      className={`flex h-10 w-10 items-center justify-center rounded-xl border-2 border-ink-900 font-black shadow-[2px_2px_0_#2B1622] active:translate-y-0.5 ${
                        ticketToEnter <= 1
                          ? "bg-ink-100 text-ink-400 cursor-not-allowed"
                          : "bg-white text-ink-900"
                      }`}
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <div className="text-2xl font-black text-ink-900">
                      {ticketToEnter} <span className="text-xs font-bold text-ink-500">Tiket</span>
                    </div>
                    <button
                      disabled={ticketToEnter >= raffleTickets}
                      onClick={() => {
                        playTap();
                        setTicketToEnter((p) => Math.min(raffleTickets, p + 1));
                      }}
                      className={`flex h-10 w-10 items-center justify-center rounded-xl border-2 border-ink-900 font-black shadow-[2px_2px_0_#2B1622] active:translate-y-0.5 ${
                        ticketToEnter >= raffleTickets
                          ? "bg-ink-100 text-ink-400 cursor-not-allowed"
                          : "bg-white text-ink-900"
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
                        className={`flex-1 py-1.5 rounded-xl border-2 border-ink-900 text-xs font-black ${
                          ticketToEnter === num ? "bg-purple-300 shadow-[2px_2px_0_#2B1622]" : "bg-white"
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
                      className="px-3 py-1.5 rounded-xl border-2 border-ink-900 bg-candy-100 text-xs font-black text-candy-900 hover:bg-candy-200"
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
                    <div className="rounded-2xl border-2 border-ink-900 bg-purple-50 p-3 space-y-1.5 text-xs">
                      <div className="flex justify-between items-center font-bold text-ink-700">
                        <span className="flex items-center gap-1">
                          <Zap className="h-3.5 w-3.5 text-purple-600" />
                          Tiket Kamu di Undian Ini:
                        </span>
                        <span className="font-black text-purple-900">
                          {alreadyEntered > 0 ? `${alreadyEntered} + ${ticketToEnter}` : ticketToEnter} Tiket
                        </span>
                      </div>
                      <div className="flex justify-between items-center font-bold text-ink-700">
                        <span className="flex items-center gap-1">
                          <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                          Estimasi Peluang Menang:
                        </span>
                        <span className="font-black text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-lg border border-emerald-600">
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
                  className="flex-1 rounded-2xl border-2 border-ink-900 bg-ink-100 py-3 text-xs md:text-sm font-black text-ink-800 shadow-[2px_2px_0_#2B1622] active:translate-y-0.5"
                >
                  Batal
                </button>
                <button
                  onClick={handleConfirmEnter}
                  className="flex-1 rounded-2xl border-3 border-ink-900 bg-candy-500 py-3 text-xs md:text-sm font-black text-white shadow-[3px_3px_0_#2B1622] hover:-translate-y-0.5 active:translate-y-0.5"
                >
                  Konfirmasi Pasang
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal: FAQ & Cara Kerja */}
        {showFaqModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink-900/60 p-4 backdrop-blur-sm animate-fade-in">
            <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-3xl border-4 border-ink-900 bg-white p-6 md:p-8 shadow-[6px_6px_0_#2B1622] space-y-5 animate-scale-in">
              <div className="flex items-center justify-between border-b-2 border-ink-900/10 pb-4">
                <div className="flex items-center gap-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl border-2 border-ink-900 bg-purple-300 text-ink-900 shadow-[2px_2px_0_#2B1622]">
                    <HelpCircle className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-ink-900">Panduan Undian Raffle</h3>
                    <p className="text-xs font-bold text-ink-500">Mekanisme transparan & fair</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    playTap();
                    setShowFaqModal(false);
                  }}
                  className="rounded-xl border-2 border-ink-900 bg-ink-100 p-1.5 text-xs font-black text-ink-800 hover:bg-ink-200"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4 text-xs font-bold text-ink-800 leading-relaxed">
                <div className="rounded-2xl border-2 border-ink-900 bg-candy-50 p-4 space-y-1">
                  <div className="font-black text-sm text-ink-900">Apa itu Undian Raffle Web3min?</div>
                  <p>
                    Raffle adalah arena undian berhadiah resmi Web3min di mana kamu dapat menukarkan koin kemenangan belajar untuk memenangkan artefak NFT langka, gelar profil, dan voucher in-game.
                  </p>
                </div>

                <div className="rounded-2xl border-2 border-ink-900 bg-candy-50 p-4 space-y-1">
                  <div className="font-black text-sm text-ink-900">Bagaimana Cara Mendapatkan Tiket?</div>
                  <p>
                    Tiket dapat dibeli seharga 10 Koin per tiket di halaman ini atau Toko Blobi. Kamu juga mendapatkan tiket gratis saat menyelesaikan rute checkpoint tertentu!
                  </p>
                </div>

                <div className="rounded-2xl border-2 border-ink-900 bg-candy-50 p-4 space-y-1">
                  <div className="font-black text-sm text-ink-900">Bagaimana Pengundian Pemenang Dilakukan?</div>
                  <p>
                    Ketika waktu mundur berakhir, database memicu fungsi draw dengan seed acak kriptografis (VRF pattern) yang memilih pemenang berdasarkan proporsi tiket yang dipasang. Semakin banyak tiket yang kamu pasang, semakin besar peluang menangmu!
                  </p>
                </div>

                <div className="rounded-2xl border-2 border-ink-900 bg-candy-50 p-4 space-y-1">
                  <div className="font-black text-sm text-ink-900">Bagaimana Cara Menerima NFT yang Dimenangkan?</div>
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
                className="w-full rounded-2xl border-3 border-ink-900 bg-yellow-400 py-3 font-black text-ink-900 shadow-[3px_3px_0_#2B1622] active:translate-y-0.5"
              >
                Saya Paham
              </button>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
