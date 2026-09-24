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
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import {
  AdminRaffleModal,
  AdminDeleteModal,
  type AdminRaffleData,
} from "@/components/admin-raffle-modal";
import {
  rpcGetRaffles,
  rpcGetRaffleStats,
  rpcAdminVerifyKey,
  rpcAdminDeleteRaffle,
  type DbRaffleItem,
  type DbRaffleStats,
} from "@/lib/server-sync";
import { INITIAL_RAFFLES, type RaffleItem } from "@/lib/raffles";
import { CandyLoader } from "@/components/ui/progress-bar";

export const Route = createFileRoute("/admin")({
  component: AdminPage,
});

export function AdminPage() {
  const [adminKey, setAdminKey] = React.useState<string | null>(null);
  const [passwordInput, setPasswordInput] = React.useState("");
  const [loginLoading, setLoginLoading] = React.useState(false);
  const [loginError, setLoginError] = React.useState<string | null>(null);

  const [dbRaffles, setDbRaffles] = React.useState<DbRaffleItem[]>([]);
  const [statsMap, setStatsMap] = React.useState<Record<string, DbRaffleStats>>({});
  const [isLoading, setIsLoading] = React.useState(true);

  const [showRaffleModal, setShowRaffleModal] = React.useState(false);
  const [editingRaffle, setEditingRaffle] = React.useState<AdminRaffleData | null>(null);
  const [deletingRaffle, setDeletingRaffle] = React.useState<DbRaffleItem | null>(null);
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [toastMsg, setToastMsg] = React.useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

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

  // Restore session
  React.useEffect(() => {
    try {
      const saved = localStorage.getItem("web3min_admin_auth");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed?.key) {
          setAdminKey(parsed.key);
        }
      }
    } catch {}
    void refreshData();
  }, [refreshData]);

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
        localStorage.setItem(
          "web3min_admin_auth",
          JSON.stringify({ key, authAt: Date.now() })
        );
        setAdminKey(key);
        showToast("Login Admin Berhasil! 👑");
        void refreshData();
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
    localStorage.removeItem("web3min_admin_auth");
    setAdminKey(null);
    setPasswordInput("");
    showToast("Berhasil keluar dari mode admin.");
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

  // Combine DB raffles or INITIAL_RAFFLES
  const displayRaffles = dbRaffles.length > 0 ? dbRaffles : INITIAL_RAFFLES.map((r) => ({
    id: r.id,
    title: r.title,
    prize: r.prize,
    prize_detail: r.prizeDetail,
    category: r.category,
    status: r.status,
    starts_at: new Date(r.startsAt || Date.now()).toISOString(),
    ends_at: new Date(r.endsAt).toISOString(),
    ticket_cost: r.ticketCost,
    winner_count: r.winnerCount,
    perks: Array.isArray(r.requirements) ? r.requirements : [],
    image_url: r.imageUrl || "",
    nft_network: "Base",
    nft_contract: "",
    nft_token_id: "",
    nft_rarity: "rare",
    is_simulation: true,
  } as DbRaffleItem));

  return (
    <AppShell>
      {/* Toast Notification */}
      <div
        className={`fixed left-1/2 -translate-x-1/2 bottom-20 z-50 bg-choco-900 text-cream px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all duration-200 pointer-events-none border-2 border-choco-900 shadow-[0_4px_0_#3B2218] max-w-[90%] text-center ${
          toastMsg ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
      >
        {toastMsg}
      </div>

      <div className="mx-auto max-w-5xl px-4 py-6 md:py-8 space-y-6">
        {/* If not logged in as Admin, show login card */}
        {!adminKey ? (
          <div className="max-w-md mx-auto my-8 p-6 sm:p-8 rounded-[32px] bg-cream border-3 border-choco-900 shadow-[0_8px_0_#3B2218] text-choco-900">
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
              Masuk untuk mengelola undian NFT, menambah artefak baru, mengunggah aset gambar project, dan menghapus event undian.
            </p>

            {loginError && (
              <div className="mb-4 p-3 rounded-2xl bg-rose-100 border-2 border-rose-500 text-rose-800 text-xs font-bold flex items-center gap-2">
                <AlertTriangle className="size-4 shrink-0 text-rose-600" />
                <span>{loginError}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-choco-800 uppercase font-pixel mb-1.5">
                  Kunci Rahasia Admin
                </label>
                <input
                  type="password"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="Masukkan password admin..."
                  autoFocus
                  className="w-full px-4 py-3 rounded-2xl bg-white border-2 border-choco-900 text-choco-900 font-mono text-sm placeholder:text-choco-400 shadow-[0_2px_0_#3B2218] focus:outline-none focus:ring-2 focus:ring-candy-500"
                />
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

            <div className="mt-6 pt-4 border-t-2 border-choco-900/10 text-center">
              <Link
                to="/raffle"
                className="font-pixel text-xs text-candy-600 hover:text-candy-700 font-bold underline"
              >
                ← Kembali ke Katalog Undian
              </Link>
            </div>
          </div>
        ) : (
          /* Authenticated Admin Dashboard */
          <div className="space-y-6">
            {/* Top Admin Header Bar */}
            <div className="p-5 sm:p-6 rounded-[32px] bg-amber-300 border-3 border-choco-900 shadow-[0_8px_0_#3B2218] text-choco-900 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="size-14 rounded-2xl bg-choco-900 text-amber-300 flex items-center justify-center font-bold text-2xl shadow-[0_3px_0_#3B2218]">
                  👑
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-pixel text-[10px] uppercase font-bold text-choco-900 bg-amber-400 px-2 py-0.5 rounded-full border border-choco-900/40">
                      Panel Admin Web3min
                    </span>
                    <span className="font-pixel text-[10px] uppercase font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-400">
                      Tersambung Supabase
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
                  className="py-2.5 px-4 rounded-full bg-white hover:bg-cream-100 text-choco-900 font-pixel font-bold text-xs border-2 border-choco-900 shadow-[0_2px_0_#3B2218] active:translate-y-0.5 cursor-pointer flex items-center gap-1.5"
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
                  <span>+ Tambah Undian Baru</span>
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

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
              <div className="p-4 rounded-2xl bg-white border-2 border-choco-900 shadow-[0_3px_0_#3B2218]">
                <div className="text-[10px] font-pixel font-bold uppercase text-choco-500">Total Undian</div>
                <div className="font-pixel text-2xl font-bold text-choco-900 mt-1">
                  {displayRaffles.length}
                </div>
              </div>
              <div className="p-4 rounded-2xl bg-emerald-50 border-2 border-choco-900 shadow-[0_3px_0_#3B2218]">
                <div className="text-[10px] font-pixel font-bold uppercase text-emerald-700">Undian Live</div>
                <div className="font-pixel text-2xl font-bold text-emerald-800 mt-1">
                  {displayRaffles.filter((r) => r.status === "live").length}
                </div>
              </div>
              <div className="p-4 rounded-2xl bg-amber-50 border-2 border-choco-900 shadow-[0_3px_0_#3B2218]">
                <div className="text-[10px] font-pixel font-bold uppercase text-amber-700">Akan Datang</div>
                <div className="font-pixel text-2xl font-bold text-amber-800 mt-1">
                  {displayRaffles.filter((r) => r.status === "upcoming").length}
                </div>
              </div>
              <div className="p-4 rounded-2xl bg-candy-50 border-2 border-choco-900 shadow-[0_3px_0_#3B2218]">
                <div className="text-[10px] font-pixel font-bold uppercase text-candy-700">Tiket Terpasang</div>
                <div className="font-pixel text-2xl font-bold text-candy-800 mt-1">
                  {Object.values(statsMap).reduce((acc, s) => acc + (s.total_tickets || 0), 0) || 72}
                </div>
              </div>
            </div>

            {/* Raffles Management List */}
            <div className="p-5 sm:p-6 rounded-[32px] bg-cream border-3 border-choco-900 shadow-[0_8px_0_#3B2218] space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-pixel text-lg font-bold text-choco-900">
                    Daftar Undian Aktif & Riwayat
                  </h3>
                  <p className="text-xs font-semibold text-choco-600">
                    Klik Edit untuk mengganti detail, upload foto NFT/Project, atau ganti status.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => refreshData()}
                  className="p-2 rounded-xl bg-white hover:bg-candy-50 border-2 border-choco-900 shadow-[0_2px_0_#3B2218] text-choco-700 active:translate-y-0.5 cursor-pointer"
                  title="Segarkan data"
                >
                  <RefreshCw className="size-4" />
                </button>
              </div>

              {isLoading ? (
                <div className="p-10 flex flex-col items-center justify-center">
                  <CandyLoader size="md" label="MEMUAT DATA UNDIAN..." />
                </div>
              ) : (
                <div className="space-y-3.5">
                  {displayRaffles.map((raffle) => {
                    const stats = statsMap[raffle.id];
                    const ticketsCount = stats?.total_tickets ?? 0;
                    const participantsCount = stats?.total_participants ?? 0;

                    return (
                      <div
                        key={raffle.id}
                        className="p-4 sm:p-5 rounded-2xl bg-white border-2 border-choco-900 shadow-[0_3px_0_#3B2218] flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all hover:border-candy-500"
                      >
                        <div className="flex items-start gap-3.5 min-w-0">
                          {/* Image Thumbnail Preview */}
                          {raffle.image_url ? (
                            <div className="size-16 sm:size-20 shrink-0 rounded-xl border-2 border-choco-900 overflow-hidden bg-choco-50 shadow-[0_2px_0_#3B2218]">
                              <img
                                src={raffle.image_url}
                                alt={raffle.title}
                                className="w-full h-full object-cover object-center"
                              />
                            </div>
                          ) : (
                            <div className="size-16 sm:size-20 shrink-0 rounded-xl border-2 border-dashed border-choco-400 bg-stone-50 flex flex-col items-center justify-center text-choco-400">
                              <ImageIcon className="size-6 mb-0.5" />
                              <span className="text-[9px] font-pixel">No Image</span>
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
                                {raffle.status === "live" ? "🟢 LIVE" : raffle.status}
                              </span>
                              <span className="px-2 py-0.5 rounded-full bg-candy-100 text-candy-800 font-pixel text-[9px] font-bold border border-choco-900">
                                {raffle.category.toUpperCase()}
                              </span>
                              {raffle.nft_network && (
                                <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 font-pixel text-[9px] font-bold border border-choco-900">
                                  {raffle.nft_network}
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

                            <div className="flex items-center gap-3 text-[11px] font-semibold text-choco-600 mt-2 flex-wrap">
                              <span className="flex items-center gap-1">
                                <Ticket className="size-3 text-amber-600" />
                                <strong>{ticketsCount}</strong> Tiket ({participantsCount} Peserta)
                              </span>
                              <span className="flex items-center gap-1">
                                <Crown className="size-3 text-yellow-600" />
                                <strong>{raffle.winner_count}</strong> Pemenang
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="size-3 text-purple-600" />
                                Ends: {new Date(raffle.ends_at).toLocaleDateString("id-ID")}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2 pt-2 md:pt-0 border-t border-choco-900/10 md:border-0 justify-end">
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(raffle)}
                            className="py-2 px-3.5 rounded-xl bg-amber-400 hover:bg-amber-500 text-choco-900 font-pixel font-bold text-xs border-2 border-choco-900 shadow-[0_2px_0_#3B2218] active:translate-y-0.5 cursor-pointer flex items-center gap-1.5"
                          >
                            <Edit3 className="size-3.5" />
                            <span>Edit</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeletingRaffle(raffle)}
                            className="py-2 px-3 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-pixel font-bold text-xs border-2 border-choco-900 shadow-[0_2px_0_#3B2218] active:translate-y-0.5 cursor-pointer flex items-center gap-1.5"
                          >
                            <Trash2 className="size-3.5" />
                            <span>Hapus</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
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
            showToast("Data undian berhasil disimpan ke database! 🚀");
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
