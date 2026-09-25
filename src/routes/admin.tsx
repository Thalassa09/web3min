import * as React from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Shield,
  Lock,
  Plus,
  Edit3,
  Trash2,
  ExternalLink,
  Award,
  Crown,
  Ticket,
  Clock,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  LogOut,
  Image as ImageIcon,
  Search,
  Filter,
  Sparkles,
  Eye,
  EyeOff,
  Coins,
  Palette,
  Layers,
  ArrowRight,
  Users,
  MessageSquare,
  AtSign,
  X,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import {
  AdminRaffleModal,
  AdminDeleteModal,
  RAFFLE_IMAGE_PRESETS,
  type AdminRaffleData,
} from "@/components/admin-raffle-modal";
import {
  rpcGetRaffles,
  rpcGetRaffleStats,
  rpcAdminVerifyKey,
  rpcAdminUpsertRaffle,
  rpcAdminDeleteRaffle,
  rpcAdminGetRaffleEntries,
  rpcAdminGetUsers,
  rpcAdminSetUserCensorship,
  type DbRaffleItem,
  type DbRaffleStats,
  type DbRaffleEntryParticipant,
  type DbAdminUserItem,
} from "@/lib/server-sync";
import { INITIAL_RAFFLES } from "@/lib/raffles";
import { CandyLoader } from "@/components/ui/progress-bar";

export const Route = createFileRoute("/admin")({
  component: AdminPage,
});

function formatIndoDate(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(d) + " WIB";
  } catch {
    return dateStr;
  }
}

function getRemainingTimeLabel(dateStr: string): { text: string; isEnded: boolean } {
  try {
    const target = new Date(dateStr).getTime();
    const now = Date.now();
    const diff = target - now;
    if (diff <= 0) return { text: "Telah Berakhir", isEnded: true };

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    if (days > 0) return { text: `${days} hari lagi`, isEnded: false };
    if (hours > 0) return { text: `${hours} jam lagi`, isEnded: false };
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return { text: `${mins} menit lagi`, isEnded: false };
  } catch {
    return { text: "-", isEnded: false };
  }
}

function getNetworkBadgeStyle(network?: string): { bg: string; text: string; border: string } {
  const net = (network || "Base").toLowerCase();
  if (net.includes("base")) {
    return { bg: "bg-blue-100", text: "text-blue-800", border: "border-blue-300" };
  }
  if (net.includes("eth")) {
    return { bg: "bg-indigo-100", text: "text-indigo-800", border: "border-indigo-300" };
  }
  if (net.includes("arbitrum")) {
    return { bg: "bg-sky-100", text: "text-sky-800", border: "border-sky-300" };
  }
  if (net.includes("optimism")) {
    return { bg: "bg-red-100", text: "text-red-800", border: "border-red-300" };
  }
  if (net.includes("polygon")) {
    return { bg: "bg-purple-100", text: "text-purple-800", border: "border-purple-300" };
  }
  if (net.includes("solana")) {
    return { bg: "bg-violet-100", text: "text-violet-800", border: "border-violet-300" };
  }
  return { bg: "bg-stone-100", text: "text-stone-800", border: "border-stone-300" };
}

export function AdminPage() {
  const [adminKey, setAdminKey] = React.useState<string | null>(null);
  const [passwordInput, setPasswordInput] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [loginLoading, setLoginLoading] = React.useState(false);
  const [loginError, setLoginError] = React.useState<string | null>(null);

  const [activeAdminTab, setActiveAdminTab] = React.useState<"raffles" | "users">("raffles");

  const [dbRaffles, setDbRaffles] = React.useState<DbRaffleItem[]>([]);
  const [statsMap, setStatsMap] = React.useState<Record<string, DbRaffleStats>>({});
  const [isLoading, setIsLoading] = React.useState(true);

  // User Management State
  const [adminUsers, setAdminUsers] = React.useState<DbAdminUserItem[]>([]);
  const [userFilter, setUserFilter] = React.useState<string>("all");
  const [userSearch, setUserSearch] = React.useState("");
  const [isUsersLoading, setIsUsersLoading] = React.useState(false);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<"all" | "live" | "upcoming" | "ended">("all");
  const [categoryFilter, setCategoryFilter] = React.useState<string>("all");

  const [showRaffleModal, setShowRaffleModal] = React.useState(false);
  const [editingRaffle, setEditingRaffle] = React.useState<AdminRaffleData | null>(null);
  const [deletingRaffle, setDeletingRaffle] = React.useState<DbRaffleItem | null>(null);
  const [viewingParticipantsRaffle, setViewingParticipantsRaffle] = React.useState<DbRaffleItem | null>(null);
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [isSeedingArtwork, setIsSeedingArtwork] = React.useState(false);
  const [toastMsg, setToastMsg] = React.useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  const refreshUsers = React.useCallback(async (key: string) => {
    setIsUsersLoading(true);
    try {
      const u = await rpcAdminGetUsers(key, userFilter);
      setAdminUsers(u);
    } catch (err) {
      console.warn("[admin] Failed to load users:", err);
    } finally {
      setIsUsersLoading(false);
    }
  }, [userFilter]);

  const refreshData = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const [raffles, stats] = await Promise.all([
        rpcGetRaffles(),
        rpcGetRaffleStats(),
      ]);
      if (Array.isArray(raffles)) {
        setDbRaffles(raffles);
      }
      if (stats) {
        setStatsMap(stats);
      }
    } catch (err) {
      console.warn("[admin] Failed to load raffles:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Restore session from sessionStorage (not localStorage)
  React.useEffect(() => {
    try {
      localStorage.removeItem("web3min_admin_auth"); // clean any legacy storage
      const saved = sessionStorage.getItem("web3min_admin_auth");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed?.key) {
          setAdminKey(parsed.key);
          void refreshUsers(parsed.key);
        }
      }
    } catch {}
    void refreshData();
  }, [refreshData, refreshUsers]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordInput.trim()) {
      setLoginError("Kunci admin wajib diisi.");
      return;
    }
    setLoginLoading(true);
    setLoginError(null);
    try {
      const isValid = await rpcAdminVerifyKey(passwordInput.trim());
      if (isValid) {
        const key = passwordInput.trim();
        sessionStorage.setItem(
          "web3min_admin_auth",
          JSON.stringify({ key, authAt: Date.now() })
        );
        setAdminKey(key);
        showToast("Login Admin Berhasil!");
        void refreshData();
        void refreshUsers(key);
      } else {
        setLoginError("Kunci admin salah! Akses ditolak.");
      }
    } catch (err: unknown) {
      setLoginError((err as Error)?.message || "Gagal memverifikasi kunci admin.");
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("web3min_admin_auth");
    localStorage.removeItem("web3min_admin_auth");
    setAdminKey(null);
    setPasswordInput("");
    showToast("Berhasil keluar dari mode admin.");
  };

  const handleToggleCensorship = async (userId: string, currentCensored: boolean, uName: string) => {
    if (!adminKey) return;
    const nextState = !currentCensored;
    const res = await rpcAdminSetUserCensorship(
      adminKey,
      userId,
      nextState,
      nextState ? "Disensor manual oleh admin" : "Dipulihkan manual oleh admin"
    );
    if (res.success) {
      showToast(`Status sensor untuk @${uName} berhasil diubah.`);
      void refreshUsers(adminKey);
    } else {
      showToast(res.error || "Gagal mengubah status sensor.");
    }
  };

  const handleOpenCreate = () => {
    setEditingRaffle(null);
    setShowRaffleModal(true);
  };

  const handleOpenEdit = (r: DbRaffleItem) => {
    let perksList: string[] = [];
    if (Array.isArray(r.perks)) {
      perksList = r.perks;
    } else if (typeof r.perks === "string") {
      try {
        perksList = JSON.parse(r.perks);
      } catch {}
    }

    setEditingRaffle({
      id: r.id,
      title: r.title,
      prize: r.prize,
      prizeDetail: r.prize_detail || "",
      category: (r.category as AdminRaffleData["category"]) || "nft",
      status: (r.status as AdminRaffleData["status"]) || "live",
      endsAt: r.ends_at,
      ticketCost: r.ticket_cost || 1,
      winnerCount: r.winner_count || 1,
      imageUrl: r.image_url || "",
      nftNetwork: r.nft_network || "Base",
      nftContract: r.nft_contract || "",
      nftTokenId: r.nft_token_id || "",
      nftRarity: (r.nft_rarity as AdminRaffleData["nftRarity"]) || "rare",
      perks: perksList,
      slotType: r.slot_type || null,
      partnerName: r.partner_name || null,
      requirementXHandle: r.requirement_x_handle || null,
      officialMintDomain: r.official_mint_domain || null,
      mintPrice: r.mint_price || null,
      mintSchedule: r.mint_schedule || null,
      announcementDate: r.announcement_date || null,
      itemId: r.item_id || null,
      discordGroupLink: r.discord_group_link || null,
    });
    setShowRaffleModal(true);
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

  // One-click utility: populate empty artwork for initial raffles using curated presets
  const handleSeedDefaultArtwork = async () => {
    if (!adminKey) return;
    setIsSeedingArtwork(true);
    let updatedCount = 0;
    try {
      for (const r of displayRaffles) {
        if (!r.image_url || r.image_url.trim() === "") {
          const matchPreset = RAFFLE_IMAGE_PRESETS.find(
            (p) =>
              p.category === r.category ||
              r.title.toLowerCase().includes(p.name.toLowerCase().split(" ")[0])
          ) || RAFFLE_IMAGE_PRESETS[0];

          await rpcAdminUpsertRaffle({
            key: adminKey,
            id: r.id,
            title: r.title,
            prize: r.prize,
            prizeDetail: r.prize_detail || "",
            category: r.category,
            status: r.status,
            endsAt: r.ends_at,
            ticketCost: r.ticket_cost || 1,
            winnerCount: r.winner_count || 1,
            imageUrl: matchPreset.url,
            nftNetwork: r.nft_network || "Base",
            nftContract: r.nft_contract || "",
            nftTokenId: r.nft_token_id || "",
            nftRarity: r.nft_rarity || "rare",
            perks: Array.isArray(r.perks) ? r.perks : [],
            isSimulation: true,
          });
          updatedCount++;
        }
      }
      showToast(`Berhasil menerapkan artwork ke ${updatedCount} undian!`);
      void refreshData();
    } catch {
      showToast("Gagal memperbarui beberapa artwork.");
    } finally {
      setIsSeedingArtwork(false);
    }
  };

  // Combine DB raffles or INITIAL_RAFFLES
  const displayRaffles = React.useMemo(() => {
    return dbRaffles.length > 0
      ? dbRaffles
      : INITIAL_RAFFLES.map(
          (r) =>
            ({
              id: r.id,
              title: r.title,
              prize: r.prize,
              prize_detail: r.prizeDetail,
              category: r.category,
              status: r.status,
              starts_at: new Date(r.startsAt || Date.now()).toISOString(),
              ends_at: new Date(r.endsAt ?? Date.now()).toISOString(),
              ticket_cost: r.ticketCost,
              winner_count: r.winnerCount,
              perks: Array.isArray(r.requirements) ? r.requirements : [],
              image_url: r.imageUrl || "",
              nft_network: r.nftNetwork || "Base",
              nft_contract: r.nftContract || "",
              nft_token_id: r.nftTokenId || "",
              nft_rarity: r.nftRarity || "rare",
              is_simulation: true,
            } as DbRaffleItem)
        );
  }, [dbRaffles]);

  // Filtered list
  const filteredRaffles = React.useMemo(() => {
    return displayRaffles.filter((r) => {
      // 1. Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = r.title.toLowerCase().includes(q);
        const matchPrize = r.prize.toLowerCase().includes(q);
        const matchId = r.id.toLowerCase().includes(q);
        const matchNet = (r.nft_network || "").toLowerCase().includes(q);
        if (!matchTitle && !matchPrize && !matchId && !matchNet) return false;
      }
      // 2. Status Filter
      if (statusFilter !== "all") {
        if (statusFilter === "ended") {
          if (r.status !== "ended" && r.status !== "drawn") return false;
        } else if (r.status !== statusFilter) {
          return false;
        }
      }
      // 3. Category Filter
      if (categoryFilter !== "all" && r.category !== categoryFilter) {
        return false;
      }
      return true;
    });
  }, [displayRaffles, searchQuery, statusFilter, categoryFilter]);

  // Accurate KPI stats (Zero fake hardcoded fallbacks)
  const totalRaffles = displayRaffles.length;
  const liveCount = displayRaffles.filter((r) => r.status === "live").length;
  const upcomingCount = displayRaffles.filter((r) => r.status === "upcoming").length;
  const endedCount = displayRaffles.filter((r) => r.status === "ended" || r.status === "drawn").length;
  const totalTicketsPlaced = Object.values(statsMap).reduce(
    (acc, s) => acc + (s.total_tickets || 0),
    0
  );

  return (
    <AppShell>
      {/* Top Floating Toast Notification */}
      <div
        className={`fixed top-5 right-5 z-50 bg-choco-900 text-cream px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-pixel font-bold transition-all duration-200 pointer-events-none border-2 border-choco-900 shadow-[0_4px_0_#3B2218] flex items-center gap-2 max-w-sm ${
          toastMsg ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
        }`}
      >
        <CheckCircle2 className="size-4 text-emerald-400 shrink-0" />
        <span>{toastMsg}</span>
      </div>

      <div className="mx-auto max-w-5xl px-4 py-6 md:py-8 space-y-6">
        {/* If not logged in as Admin, show login card */}
        {!adminKey ? (
          <div className="max-w-md mx-auto my-8 p-6 sm:p-8 rounded-[32px] bg-cream border-3 border-choco-900 shadow-[0_8px_0_#3B2218] text-choco-900 animate-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="size-12 rounded-2xl bg-amber-400 border-2 border-choco-900 flex items-center justify-center shadow-[0_3px_0_#3B2218]">
                <Shield className="size-6 text-choco-900" />
              </div>
              <div>
                <span className="font-pixel text-[10px] uppercase font-bold text-amber-800 bg-amber-100 border border-choco-900 px-2 py-0.5 rounded-full">
                  Admin Otoritas
                </span>
                <h2 className="font-pixel text-xl font-bold text-choco-900 mt-0.5">
                  Login Admin Web3min
                </h2>
              </div>
            </div>

            <p className="text-xs sm:text-sm font-semibold text-choco-700 leading-relaxed mb-6">
              Masuk untuk mengelola undian NFT, menambah artefak baru, mengunggah artwork project, dan menghapus event undian.
            </p>

            {loginError && (
              <div className="mb-4 p-3.5 rounded-2xl bg-rose-100 border-2 border-rose-500 text-rose-800 text-xs font-bold flex items-center gap-2 shadow-[0_2px_0_#991B1B]">
                <AlertTriangle className="size-4 shrink-0 text-rose-600" />
                <span>{loginError}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-choco-800 uppercase font-pixel mb-1.5">
                  Kunci Rahasia Admin
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    placeholder="Masukkan password admin..."
                    autoFocus
                    className="w-full px-4 py-3 pr-11 rounded-2xl bg-white border-2 border-choco-900 text-choco-900 font-mono text-sm placeholder:text-choco-400 shadow-[0_2px_0_#3B2218] focus:outline-none focus:ring-2 focus:ring-candy-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-choco-500 hover:text-choco-900 p-1 cursor-pointer"
                    title={showPassword ? "Sembunyikan password" : "Lihat password"}
                  >
                    {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loginLoading}
                className="w-full py-3.5 px-4 rounded-full bg-candy-500 hover:bg-candy-600 disabled:opacity-50 text-white font-pixel font-bold text-sm border-2 border-choco-900 shadow-[0_4px_0_#3B2218] active:translate-y-1 active:shadow-none transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                {loginLoading ? (
                  <span>Memverifikasi...</span>
                ) : (
                  <>
                    <Lock className="size-4" />
                    <span>Masuk ke Panel Admin</span>
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 pt-4 border-t-2 border-choco-900/10 flex items-center justify-between text-xs font-pixel">
              <Link
                to="/raffle"
                className="text-candy-600 hover:text-candy-700 font-bold underline"
              >
                ← Kembali ke Katalog
              </Link>
              <span className="text-choco-500">v2.4 Otoritas</span>
            </div>
          </div>
        ) : (
          /* Authenticated Admin Dashboard */
          <div className="space-y-6">
            {/* Top Admin Header Bar */}
            <div className="p-5 sm:p-6 rounded-[32px] bg-amber-300 border-2 border-choco-900 shadow-[0_8px_0_#3B2218] text-choco-900 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="size-14 rounded-2xl bg-choco-900 text-amber-300 flex items-center justify-center font-bold text-2xl shadow-[0_3px_0_#3B2218]">
                  <Crown className="size-7 text-amber-300" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-pixel text-[10px] uppercase font-bold text-choco-900 bg-amber-400 px-2 py-0.5 rounded-full border border-choco-900/40 shadow-[0_1px_0_#3B2218]">
                      Panel Admin Web3min
                    </span>
                    <span className="font-pixel text-[10px] uppercase font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-400">
                      ● Supabase Terhubung
                    </span>
                  </div>
                  <h1 className="font-pixel text-xl sm:text-2xl font-bold text-choco-900 leading-tight mt-1">
                    Pengelola Undian & Artefak NFT
                  </h1>
                </div>
              </div>

              <div className="flex items-center gap-2.5 flex-wrap">
                <Link
                  to="/raffle"
                  className="py-2.5 px-4 rounded-full bg-white hover:bg-cream text-choco-900 font-pixel font-bold text-xs border-2 border-choco-900 shadow-[0_2px_0_#3B2218] active:translate-y-0.5 cursor-pointer flex items-center gap-1.5"
                >
                  <ExternalLink className="size-3.5" />
                  <span>Lihat Undian Live</span>
                </Link>
                <button
                  type="button"
                  onClick={handleOpenCreate}
                  className="py-2.5 px-5 rounded-full bg-candy-500 hover:bg-candy-600 text-white font-pixel font-bold text-xs sm:text-sm border-2 border-choco-900 shadow-[0_4px_0_#3B2218] active:translate-y-1 active:shadow-none cursor-pointer flex items-center gap-2"
                >
                  <Plus className="size-4" />
                  <span>Buat Undian Baru</span>
                </button>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="py-2.5 px-3.5 rounded-full bg-rose-100 hover:bg-rose-200 text-rose-800 font-pixel font-bold text-xs border-2 border-choco-900 shadow-[0_2px_0_#3B2218] active:translate-y-0.5 cursor-pointer flex items-center gap-1.5"
                >
                  <LogOut className="size-3.5" />
                  <span>Keluar</span>
                </button>
              </div>
            </div>

            {/* Admin Section Tabs */}
            <div className="flex items-center gap-2 border-b-2 border-choco-900/20 pb-3 flex-wrap">
              <button
                type="button"
                onClick={() => setActiveAdminTab("raffles")}
                className={`px-4 py-2 rounded-full font-pixel text-xs font-bold border-2 border-choco-900 transition-all cursor-pointer ${
                  activeAdminTab === "raffles"
                    ? "bg-candy-500 text-white shadow-[0_2px_0_#3B2218]"
                    : "bg-white text-choco-700 hover:bg-cream"
                }`}
              >
                Kelola Undian ({displayRaffles.length})
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveAdminTab("users");
                  if (adminKey) void refreshUsers(adminKey);
                }}
                className={`px-4 py-2 rounded-full font-pixel text-xs font-bold border-2 border-choco-900 transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeAdminTab === "users"
                    ? "bg-candy-500 text-white shadow-[0_2px_0_#3B2218]"
                    : "bg-white text-choco-700 hover:bg-cream"
                }`}
              >
                <Users className="size-3.5" />
                <span>Manajemen Pengguna & Sensor ({adminUsers.length})</span>
              </button>
            </div>

            {activeAdminTab === "raffles" ? (
              <>

            {/* Quick Stats Grid (5 Accurate KPI Cards) */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              <div className="p-3.5 sm:p-4 rounded-2xl bg-white border-2 border-choco-900 shadow-[0_3px_0_#3B2218]">
                <div className="text-[10px] font-pixel font-bold uppercase text-choco-500">Total Undian</div>
                <div className="font-pixel text-2xl font-bold text-choco-900 mt-1">
                  {totalRaffles}
                </div>
              </div>
              <div className="p-3.5 sm:p-4 rounded-2xl bg-emerald-50 border-2 border-choco-900 shadow-[0_3px_0_#3B2218]">
                <div className="text-[10px] font-pixel font-bold uppercase text-emerald-700">Undian Live</div>
                <div className="font-pixel text-2xl font-bold text-emerald-800 mt-1">
                  {liveCount}
                </div>
              </div>
              <div className="p-3.5 sm:p-4 rounded-2xl bg-amber-50 border-2 border-choco-900 shadow-[0_3px_0_#3B2218]">
                <div className="text-[10px] font-pixel font-bold uppercase text-amber-700">Akan Datang</div>
                <div className="font-pixel text-2xl font-bold text-amber-800 mt-1">
                  {upcomingCount}
                </div>
              </div>
              <div className="p-3.5 sm:p-4 rounded-2xl bg-stone-100 border-2 border-choco-900 shadow-[0_3px_0_#3B2218]">
                <div className="text-[10px] font-pixel font-bold uppercase text-stone-600">Selesai / Riwayat</div>
                <div className="font-pixel text-2xl font-bold text-stone-800 mt-1">
                  {endedCount}
                </div>
              </div>
              <div className="col-span-2 sm:col-span-1 p-3.5 sm:p-4 rounded-2xl bg-candy-50 border-2 border-choco-900 shadow-[0_3px_0_#3B2218]">
                <div className="text-[10px] font-pixel font-bold uppercase text-candy-700">Tiket Terpasang</div>
                <div className="font-pixel text-2xl font-bold text-candy-800 mt-1">
                  {totalTicketsPlaced}
                </div>
              </div>
            </div>

            {/* Filter & Search Bar */}
            <div className="p-4 rounded-2xl bg-white border-2 border-choco-900 shadow-[0_3px_0_#3B2218] flex flex-col md:flex-row items-center justify-between gap-3">
              <div className="relative w-full md:w-80">
                <Search className="size-4 text-choco-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari judul, hadiah, jaringan..."
                  className="w-full pl-9 pr-4 py-2 rounded-xl bg-cream/50 border border-choco-900 text-xs font-semibold text-choco-900 placeholder:text-choco-400 focus:outline-none focus:ring-2 focus:ring-candy-500 shadow-[0_1px_0_#3B2218]"
                />
              </div>

              <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
                {/* Status Pills */}
                <div className="flex items-center gap-1 p-1 bg-cream rounded-xl border border-choco-900/30">
                  <button
                    type="button"
                    onClick={() => setStatusFilter("all")}
                    className={`px-2.5 py-1 rounded-lg font-pixel text-[10px] font-bold transition-all cursor-pointer ${
                      statusFilter === "all"
                        ? "bg-choco-900 text-cream shadow-[0_1px_0_#3B2218]"
                        : "text-choco-700 hover:text-choco-900"
                    }`}
                  >
                    Semua ({totalRaffles})
                  </button>
                  <button
                    type="button"
                    onClick={() => setStatusFilter("live")}
                    className={`px-2.5 py-1 rounded-lg font-pixel text-[10px] font-bold transition-all cursor-pointer ${
                      statusFilter === "live"
                        ? "bg-emerald-600 text-white shadow-[0_1px_0_#15803D]"
                        : "text-emerald-800 hover:text-emerald-950"
                    }`}
                  >
                    Live ({liveCount})
                  </button>
                  <button
                    type="button"
                    onClick={() => setStatusFilter("upcoming")}
                    className={`px-2.5 py-1 rounded-lg font-pixel text-[10px] font-bold transition-all cursor-pointer ${
                      statusFilter === "upcoming"
                        ? "bg-amber-500 text-choco-900 shadow-[0_1px_0_#B45309]"
                        : "text-amber-800 hover:text-amber-950"
                    }`}
                  >
                    Akan Datang ({upcomingCount})
                  </button>
                  <button
                    type="button"
                    onClick={() => setStatusFilter("ended")}
                    className={`px-2.5 py-1 rounded-lg font-pixel text-[10px] font-bold transition-all cursor-pointer ${
                      statusFilter === "ended"
                        ? "bg-stone-600 text-white shadow-[0_1px_0_#44403C]"
                        : "text-stone-700 hover:text-stone-900"
                    }`}
                  >
                    Selesai ({endedCount})
                  </button>
                </div>

                {/* Category Dropdown */}
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="px-2.5 py-1.5 rounded-xl bg-white border border-choco-900 text-xs font-bold text-choco-900 shadow-[0_1px_0_#3B2218] cursor-pointer"
                >
                  <option value="all">Semua Kategori</option>
                  <option value="nft">NFT Artifact</option>
                  <option value="gems">Koin/Gems</option>
                  <option value="outfit">Outfit Blobi</option>
                  <option value="badge">Badge</option>
                  <option value="tickets">Tiket</option>
                </select>
              </div>
            </div>

            {/* Raffles Management List */}
            <div className="p-5 sm:p-6 rounded-[32px] bg-cream border-3 border-choco-900 shadow-[0_8px_0_#3B2218] space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                  <h3 className="font-pixel text-lg font-bold text-choco-900">
                    Daftar Undian Aktif & Riwayat ({filteredRaffles.length})
                  </h3>
                  <p className="text-xs font-semibold text-choco-600">
                    Kelola event undian, unggah artwork NFT, ubah status, atau hapus undian.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleSeedDefaultArtwork}
                    disabled={isSeedingArtwork}
                    className="py-1.5 px-3 rounded-xl bg-amber-200 hover:bg-amber-300 border border-choco-900 shadow-[0_1.5px_0_#3B2218] text-choco-900 font-pixel text-[10px] font-bold active:translate-y-0.5 cursor-pointer flex items-center gap-1.5"
                    title="Pasang gambar default untuk undian yang belum memiliki artwork"
                  >
                    <Palette className="size-3.5 text-amber-700" />
                    <span>{isSeedingArtwork ? "Menerapkan..." : "Auto-Artwork Kosong"}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => refreshData()}
                    className="p-2 rounded-xl bg-white hover:bg-candy-50 border-2 border-choco-900 shadow-[0_2px_0_#3B2218] text-choco-700 active:translate-y-0.5 cursor-pointer"
                    title="Segarkan data dari Supabase"
                  >
                    <RefreshCw className="size-4" />
                  </button>
                </div>
              </div>

              {isLoading ? (
                <div className="p-10 flex flex-col items-center justify-center">
                  <CandyLoader size="md" label="MEMUAT DATA UNDIAN..." />
                </div>
              ) : filteredRaffles.length === 0 ? (
                <div className="p-8 rounded-2xl bg-white border-2 border-choco-900/30 text-center space-y-3">
                  <div className="size-14 mx-auto rounded-2xl bg-amber-100 border-2 border-choco-900 flex items-center justify-center text-choco-700 shadow-[0_2px_0_#3B2218]">
                    <Search className="size-6 text-choco-700" />
                  </div>
                  <h4 className="font-pixel text-base font-bold text-choco-900">
                    Tidak ada undian yang cocok
                  </h4>
                  <p className="text-xs text-choco-600 max-w-sm mx-auto">
                    Coba ubah kata kunci pencarian atau reset filter untuk melihat daftar lengkap undian.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery("");
                      setStatusFilter("all");
                      setCategoryFilter("all");
                    }}
                    className="py-2 px-4 rounded-full bg-candy-500 text-white font-pixel text-xs font-bold border-2 border-choco-900 shadow-[0_2px_0_#3B2218] cursor-pointer"
                  >
                    Reset Filter
                  </button>
                </div>
              ) : (
                <div className="space-y-3.5">
                  {filteredRaffles.map((raffle) => {
                    const stats = statsMap[raffle.id];
                    const ticketsCount = stats?.total_tickets ?? 0;
                    const participantsCount = stats?.total_participants ?? 0;
                    const netStyle = getNetworkBadgeStyle(raffle.nft_network);
                    const remaining = getRemainingTimeLabel(raffle.ends_at);

                    return (
                      <div
                        key={raffle.id}
                        className="p-4 sm:p-5 rounded-2xl bg-white border-2 border-choco-900 shadow-[0_3px_0_#3B2218] flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all hover:border-candy-500"
                      >
                        <div className="flex items-start gap-3.5 min-w-0">
                          {/* Image Thumbnail Preview with Generative Fallback */}
                          {raffle.image_url ? (
                            <div className="size-16 sm:size-20 shrink-0 rounded-xl border-2 border-choco-900 overflow-hidden bg-choco-50 shadow-[0_2px_0_#3B2218]">
                              <img
                                src={raffle.image_url}
                                alt={raffle.title}
                                className="w-full h-full object-cover object-center"
                              />
                            </div>
                          ) : (
                            <div className="size-16 sm:size-20 shrink-0 rounded-xl border-2 border-choco-900 bg-gradient-to-br from-amber-200 via-candy-100 to-purple-200 flex flex-col items-center justify-center text-choco-900 shadow-[0_2px_0_#3B2218] p-1 text-center">
                              {raffle.category === "nft" ? (
                                <Crown className="size-6 text-amber-600 mb-0.5" />
                              ) : raffle.category === "gems" ? (
                                <Coins className="size-6 text-amber-700 mb-0.5" />
                              ) : (
                                <Sparkles className="size-6 text-candy-600 mb-0.5" />
                              )}
                              <span className="text-[8px] font-pixel font-bold uppercase truncate max-w-full px-1">
                                {raffle.category}
                              </span>
                            </div>
                          )}

                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2 flex-wrap mb-1">
                              <span
                                className={`px-2 py-0.5 rounded-full text-[9px] font-pixel font-bold uppercase border border-choco-900 ${
                                  raffle.status === "live"
                                    ? "bg-emerald-100 text-emerald-800"
                                    : raffle.status === "upcoming"
                                    ? "bg-amber-100 text-amber-800"
                                    : "bg-stone-100 text-stone-700"
                                }`}
                              >
                                {raffle.status === "live"
                                  ? "LIVE"
                                  : raffle.status === "upcoming"
                                  ? "AKAN DATANG"
                                  : "SELESAI"}
                              </span>
                              <span className="px-2 py-0.5 rounded-full bg-candy-100 text-candy-800 font-pixel text-[9px] font-bold border border-choco-900">
                                {raffle.category.toUpperCase()}
                              </span>
                              {raffle.nft_network && (
                                <span
                                  className={`px-2 py-0.5 rounded-full font-pixel text-[9px] font-bold border border-choco-900 ${netStyle.bg} ${netStyle.text}`}
                                >
                                  {raffle.nft_network}
                                </span>
                              )}
                              {raffle.nft_rarity && (
                                <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 font-pixel text-[9px] font-bold border border-choco-900 uppercase">
                                  {raffle.nft_rarity}
                                </span>
                              )}
                            </div>

                            <h4 className="font-pixel text-base font-bold text-choco-900 truncate">
                              {raffle.title}
                            </h4>
                            <div className="text-xs font-bold text-candy-600 flex items-center gap-1 mt-0.5">
                              <Award className="size-3.5 shrink-0" />
                              <span className="truncate">{raffle.prize}</span>
                            </div>

                            {!raffle.slot_type && (
                              <div className="mt-1.5 p-2 rounded-xl bg-amber-100 border border-amber-400 text-[11px] font-bold text-amber-900 flex items-center gap-1.5">
                                <AlertTriangle className="size-3.5 text-amber-700 shrink-0" />
                                <span>Raffle ini belum punya jenis hadiah. Pilih GTD / WL / GROUP / ITEM.</span>
                              </div>
                            )}

                            <div className="flex items-center gap-3 text-[11px] font-semibold text-choco-600 mt-2 flex-wrap">
                              <span className="flex items-center gap-1 font-mono">
                                <Ticket className="size-3 text-amber-600" />
                                <strong>{ticketsCount}</strong> Tiket ({participantsCount} Peserta)
                              </span>
                              <span className="flex items-center gap-1 font-mono">
                                <Crown className="size-3 text-yellow-600" />
                                <strong>{raffle.winner_count}</strong> Pemenang
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="size-3 text-purple-600" />
                                <span>Batas: {formatIndoDate(raffle.ends_at)}</span>
                                <span
                                  className={`ml-1 text-[10px] font-pixel font-bold px-1.5 py-0.2 rounded ${
                                    remaining.isEnded
                                      ? "bg-stone-200 text-stone-700"
                                      : "bg-emerald-100 text-emerald-800"
                                  }`}
                                >
                                  {remaining.text}
                                </span>
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Actions (Tactile Edit, Peserta & Safe Delete) */}
                        <div className="flex items-center gap-2 pt-2 md:pt-0 border-t border-choco-900/10 md:border-0 justify-end shrink-0 flex-wrap">
                          <button
                            type="button"
                            onClick={() => setViewingParticipantsRaffle(raffle)}
                            className="py-2 px-3 rounded-xl bg-purple-100 hover:bg-purple-200 text-purple-900 font-pixel font-bold text-xs border-2 border-choco-900 shadow-[0_2px_0_#3B2218] active:translate-y-0.5 cursor-pointer flex items-center gap-1.5"
                            title="Lihat daftar tiket dan kontak Discord / X peserta"
                          >
                            <Users className="size-3.5 text-purple-700" />
                            <span>Peserta ({ticketsCount})</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(raffle)}
                            className="py-2 px-4 rounded-xl bg-amber-400 hover:bg-amber-500 text-choco-900 font-pixel font-bold text-xs border-2 border-choco-900 shadow-[0_2px_0_#3B2218] active:translate-y-0.5 cursor-pointer flex items-center gap-1.5"
                          >
                            <Edit3 className="size-3.5" />
                            <span>Edit</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeletingRaffle(raffle)}
                            className="py-2 px-3 rounded-xl bg-white hover:bg-rose-50 text-rose-700 hover:text-rose-800 font-pixel font-bold text-xs border-2 border-rose-300 hover:border-rose-500 shadow-[0_2px_0_#991B1B] active:translate-y-0.5 cursor-pointer flex items-center gap-1.5"
                            title="Hapus undian ini"
                          >
                            <Trash2 className="size-3.5 text-rose-600" />
                            <span>Hapus</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
            </>
          ) : (
            /* USER MANAGEMENT & CENSORSHIP TAB */
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-white border-2 border-choco-900 shadow-[0_3px_0_#3B2218] flex flex-col md:flex-row items-center justify-between gap-3">
                <div className="relative w-full md:w-80">
                  <Search className="size-4 text-choco-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                    placeholder="Cari username atau display name..."
                    className="w-full pl-9 pr-4 py-2 rounded-xl bg-cream/50 border border-choco-900 text-xs font-semibold text-choco-900 placeholder:text-choco-400 focus:outline-none focus:ring-2 focus:ring-candy-500 shadow-[0_1px_0_#3B2218]"
                  />
                </div>

                <div className="flex items-center gap-1 p-1 bg-cream rounded-xl border border-choco-900/30 overflow-x-auto">
                  {[
                    { id: "all", label: "Semua" },
                    { id: "user", label: "User" },
                    { id: "censored", label: "Tersensor" },
                    { id: "test", label: "Test" },
                    { id: "demo", label: "Demo" },
                  ].map((f) => (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => {
                        setUserFilter(f.id);
                        if (adminKey) void refreshUsers(adminKey);
                      }}
                      className={`px-3 py-1 rounded-lg font-pixel text-[10px] font-bold transition-all cursor-pointer ${
                        userFilter === f.id
                          ? "bg-choco-900 text-cream shadow-[0_1px_0_#3B2218]"
                          : "text-choco-700 hover:text-choco-900"
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>

              {isUsersLoading ? (
                <div className="p-12 flex flex-col items-center justify-center space-y-4">
                  <CandyLoader size="lg" label="MEMUAT DAFTAR PENGGUNA..." />
                </div>
              ) : adminUsers.length === 0 ? (
                <div className="p-12 text-center rounded-3xl bg-white border-2 border-choco-900 shadow-[0_4px_0_#3B2218]">
                  <p className="font-bold text-choco-700 text-sm">Tidak ada pengguna yang cocok dengan filter.</p>
                </div>
              ) : (
                <div className="rounded-2xl border-2 border-choco-900 bg-white overflow-hidden shadow-[0_4px_0_#3B2218]">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-cream border-b-2 border-choco-900/20 text-choco-900 font-pixel uppercase text-[10px]">
                        <tr>
                          <th className="p-3">User ID</th>
                          <th className="p-3">Username Asli</th>
                          <th className="p-3">Nama Tampil (Publik)</th>
                          <th className="p-3">Tipe</th>
                          <th className="p-3">Status Sensor</th>
                          <th className="p-3 text-right">XP Mingguan</th>
                          <th className="p-3 text-right">Total XP</th>
                          <th className="p-3 text-center">Aksi Sensor</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-choco-900/10 font-medium text-choco-900">
                        {adminUsers
                          .filter((u) => {
                            if (!userSearch.trim()) return true;
                            const q = userSearch.toLowerCase();
                            return (
                              u.username.toLowerCase().includes(q) ||
                              u.display_name.toLowerCase().includes(q)
                            );
                          })
                          .map((u) => (
                            <tr key={u.id} className="hover:bg-cream/40 transition-colors">
                              <td className="p-3 font-mono text-[10px] text-choco-500">
                                {u.id.slice(0, 8)}…
                              </td>
                              <td className="p-3 font-mono font-bold">
                                @{u.username}
                              </td>
                              <td className="p-3 font-semibold">
                                {u.display_name}
                              </td>
                              <td className="p-3">
                                <span
                                  className={`px-2 py-0.5 rounded-full font-pixel text-[9px] font-bold border border-choco-900 ${
                                    u.account_type === "user"
                                      ? "bg-emerald-100 text-emerald-800"
                                      : u.account_type === "test"
                                      ? "bg-amber-100 text-amber-800"
                                      : "bg-purple-100 text-purple-800"
                                  }`}
                                >
                                  {u.account_type}
                                </span>
                              </td>
                              <td className="p-3">
                                {u.username_censored ? (
                                  <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 font-pixel text-[9px] font-bold border border-rose-300">
                                    Tersensor
                                  </span>
                                ) : (
                                  <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-pixel text-[9px] font-bold">
                                    Normal
                                  </span>
                                )}
                              </td>
                              <td className="p-3 text-right font-mono font-bold text-amber-800">
                                {u.weekly_xp}
                              </td>
                              <td className="p-3 text-right font-mono">
                                {u.xp}
                              </td>
                              <td className="p-3 text-center">
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleToggleCensorship(
                                      u.id,
                                      u.username_censored,
                                      u.username
                                    )
                                  }
                                  className={`px-3 py-1 rounded-full font-pixel text-[10px] font-bold border border-choco-900 shadow-[0_1px_0_#3B2218] active:translate-y-0.5 cursor-pointer ${
                                    u.username_censored
                                      ? "bg-emerald-300 hover:bg-emerald-400 text-choco-900"
                                      : "bg-rose-200 hover:bg-rose-300 text-rose-900"
                                  }`}
                                >
                                  {u.username_censored ? "Pulihkan" : "Sensor"}
                                </button>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}
          </div>
        )}
      </div>

      {/* Admin Add/Edit Modal */}
      {adminKey && (
        <AdminRaffleModal
          isOpen={showRaffleModal}
          onClose={() => {
            setShowRaffleModal(false);
            setEditingRaffle(null);
          }}
          onSaved={() => {
            showToast("Data undian berhasil disimpan ke database!");
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
          raffleTitle={deletingRaffle.title}
          loading={isDeleting}
        />
      )}

      {/* Admin View Participants Modal */}
      {viewingParticipantsRaffle && adminKey && (
        <AdminParticipantsModal
          isOpen={Boolean(viewingParticipantsRaffle)}
          onClose={() => setViewingParticipantsRaffle(null)}
          raffle={viewingParticipantsRaffle}
          adminKey={adminKey}
        />
      )}
    </AppShell>
  );
}

function AdminParticipantsModal({
  isOpen,
  onClose,
  raffle,
  adminKey,
}: {
  isOpen: boolean;
  onClose: () => void;
  raffle: DbRaffleItem;
  adminKey: string;
}) {
  const [participants, setParticipants] = React.useState<DbRaffleEntryParticipant[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown, true);
    return () => window.removeEventListener("keydown", handleKeyDown, true);
  }, [isOpen, onClose]);

  React.useEffect(() => {
    if (!isOpen || !raffle) return;
    setLoading(true);
    rpcAdminGetRaffleEntries(adminKey, raffle.id).then((res) => {
      setParticipants(res);
      setLoading(false);
    });
  }, [isOpen, raffle, adminKey]);

  if (!isOpen) return null;

  const totalTickets = participants.reduce((acc, p) => acc + (p.tickets || 0), 0);

  const exportCsv = () => {
    const header = "username,tiket,wallet,akun_x,tanggal";
    const esc = (v: string | number | null | undefined) => {
      const s = String(v ?? "");
      return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
    };
    const rows = participants.map((p) =>
      [
        esc(p.username || "pelajar"),
        esc(p.tickets || 0),
        esc(p.wallet_address || ""),
        esc(p.x_handle || ""),
        esc(p.entered_at || ""),
      ].join(","),
    );
    const csv = [header, ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `peserta-${raffle.id}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-choco-900/60 backdrop-blur-xs animate-in fade-in duration-150 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-xl max-h-[90vh] flex flex-col rounded-[28px] bg-cream border-3 border-choco-900 shadow-[0_8px_0_#3B2218] text-choco-900 animate-in zoom-in-95 duration-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="shrink-0 p-4 sm:p-5 border-b-2 border-choco-900/15 flex items-center justify-between bg-cream-50">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-2xl bg-purple-500 border-2 border-choco-900 text-white flex items-center justify-center shadow-[0_2px_0_#3B2218]">
              <Users className="size-5" />
            </div>
            <div>
              <span className="px-2 py-0.5 rounded-full bg-purple-100 border border-choco-900 font-pixel text-[9px] font-bold text-purple-800 uppercase">
                Peserta & Kontak Undian
              </span>
              <h3 className="font-pixel text-base sm:text-lg font-bold text-choco-900 leading-tight truncate max-w-xs sm:max-w-sm">
                {raffle.title}
              </h3>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex size-9 items-center justify-center rounded-full border-2 border-choco-900 bg-white text-choco-900 shadow-[0_1px_0_#3B2218] hover:bg-candy-100 active:translate-y-0.5 cursor-pointer"
            aria-label="Tutup"
          >
            <X className="size-4.5 stroke-[2.5]" />
          </button>
        </div>

        {/* Summary Bar */}
        <div className="shrink-0 px-5 py-3 bg-white border-b-2 border-choco-900/10 flex items-center justify-between text-xs font-pixel">
          <span className="text-choco-600 font-bold">
            Total Peserta: <strong className="text-choco-900">{participants.length}</strong> Orang
          </span>
          <span className="text-amber-800 font-bold">
            Total Tiket: <strong className="text-amber-900">{totalTickets}</strong> Tiket
          </span>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3 tactile-scrollbar">
          {loading ? (
            <div className="p-8 flex flex-col items-center justify-center">
              <CandyLoader size="md" label="MEMUAT DAFTAR PESERTA..." />
            </div>
          ) : participants.length === 0 ? (
            <div className="p-8 rounded-2xl bg-white border-2 border-choco-900/20 text-center space-y-2">
              <div className="size-12 mx-auto rounded-2xl bg-amber-100 border-2 border-choco-900 flex items-center justify-center text-choco-900 shadow-[0_2px_0_#3B2218]">
                <Ticket className="size-6 text-choco-700" />
              </div>
              <h4 className="font-pixel text-sm font-bold text-choco-900">
                Belum Ada Peserta
              </h4>
              <p className="text-xs text-choco-600 max-w-xs mx-auto">
                Belum ada tiket yang dipasang untuk undian ini. Kontak Discord dan X akan muncul di sini saat user mendaftar.
              </p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {participants.map((p, idx) => (
                <div
                  key={`${p.user_id}-${idx}`}
                  className="p-3.5 rounded-2xl bg-white border-2 border-choco-900 shadow-[0_2px_0_#3B2218] flex flex-col sm:flex-row sm:items-center justify-between gap-2.5"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="size-5 rounded-full bg-choco-900 text-cream font-pixel text-[10px] flex items-center justify-center font-bold">
                        {idx + 1}
                      </span>
                      <span className="font-pixel text-xs font-bold text-choco-900">
                        @{p.username || "pelajar"}
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-amber-100 border border-choco-900 text-amber-900 font-pixel text-[9px] font-bold">
                        {p.tickets} Tiket
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-xs flex-wrap pt-0.5">
                      {/* Wallet EVM */}
                      {p.wallet_address ? (
                        <span className="inline-flex items-center gap-1 font-mono text-[11px] text-choco-900 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-300">
                          <strong>Wallet:</strong> {p.wallet_address}
                        </span>
                      ) : null}

                      {/* X (Twitter) */}
                      <span className="inline-flex items-center gap-1 font-mono text-[11px] text-sky-700 bg-sky-50 px-2 py-0.5 rounded-lg border border-sky-200">
                        <AtSign className="size-3 text-sky-500" />
                        <strong>X:</strong> {p.x_handle ? (p.x_handle.startsWith("@") ? p.x_handle : `@${p.x_handle}`) : "-"}
                      </span>
                    </div>
                  </div>

                  <div className="text-[10px] text-choco-500 font-semibold text-right sm:text-left shrink-0">
                    {p.entered_at ? new Date(p.entered_at).toLocaleDateString("id-ID") : ""}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="shrink-0 p-3.5 border-t-2 border-choco-900/15 bg-cream-50 flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={exportCsv}
            disabled={participants.length === 0}
            className="py-2 px-5 rounded-full bg-white border-2 border-choco-900 text-choco-900 font-pixel font-bold text-xs shadow-[0_2px_0_#3B2218] active:translate-y-0.5 cursor-pointer disabled:opacity-50"
          >
            Ekspor CSV
          </button>
          <button
            type="button"
            onClick={onClose}
            className="py-2 px-5 rounded-full bg-choco-900 hover:bg-choco-800 text-cream font-pixel font-bold text-xs shadow-[0_2px_0_#3B2218] active:translate-y-0.5 cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
