import * as React from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import {
  Trophy,
  Flame,
  Award,
  Sparkles,
  Ticket,
  Search,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Gift,
  HelpCircle,
  ArrowRight,
  Crown,
  Coins,
  Star,
  Zap,
  Shield,
  MapPin,
  X,
  AlertTriangle,
  RefreshCw,
} from "lucide-react";
import { CoinIcon } from "@/components/motif";
import { useProgress } from "@/lib/store";
import { Mascot } from "@/components/mascot";
import {
  getLeaderboardParticipants,
  LEADERBOARD_PRIZE_TIERS,
  TOTAL_WEEKLY_PRIZE_COINS,
  type ParticipantItem,
} from "@/lib/leaderboard-prizes";
import { rpcGetLeaderboard, type DbLeaderboardUser } from "@/lib/server-sync";
import { weekId } from "@/lib/time";
import { SkeletonRows } from "@/components/ui/skeleton";

export const Route = createFileRoute("/leaderboard")({
  component: LeaderboardPage,
});

function LeaderboardPage() {
  const {
    xp,
    weeklyXp,
    gems,
    streak,
    username,
    claimWeeklyLeaderboardReward,
    lastClaimedLeaderboardWeek,
  } = useProgress();

  const currentWeek = React.useMemo(() => weekId(), []);
  const [filterTier, setFilterTier] = React.useState<string | undefined>(undefined);
  const [search, setSearch] = React.useState("");
  const [showPrizeModal, setShowPrizeModal] = React.useState(false);
  const [claimedNotice, setClaimedNotice] = React.useState<string | null>(null);

  // Keyboard shortcut to close modal
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setShowPrizeModal(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);
  const [dbUsers, setDbUsers] = React.useState<DbLeaderboardUser[]>([]);
  const [dbTotalCount, setDbTotalCount] = React.useState(0);
  const [isDbLoading, setIsDbLoading] = React.useState(true);
  const [isDbConnected, setIsDbConnected] = React.useState(false);
  const [dbError, setDbError] = React.useState<string | null>(null);
  const [reloadKey, setReloadKey] = React.useState(0);

  // Retry must actually re-run the fetch, so `reloadKey` is a dependency.
  const retryDb = React.useCallback(() => setReloadKey((k) => k + 1), []);

  // Desktop drag-to-scroll & mousewheel handlers for filter tabs
  const tabsRef = React.useRef<HTMLDivElement>(null);
  const isDown = React.useRef(false);
  const startX = React.useRef(0);
  const scrollLeftPos = React.useRef(0);
  const hasDragged = React.useRef(false);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!tabsRef.current) return;
    isDown.current = true;
    startX.current = e.pageX - tabsRef.current.offsetLeft;
    scrollLeftPos.current = tabsRef.current.scrollLeft;
    hasDragged.current = false;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDown.current || !tabsRef.current) return;
    const x = e.pageX - tabsRef.current.offsetLeft;
    const walk = (x - startX.current) * 1.5;
    if (Math.abs(walk) > 4) {
      hasDragged.current = true;
      tabsRef.current.scrollLeft = scrollLeftPos.current - walk;
    }
  };

  const handleMouseUp = () => {
    isDown.current = false;
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (e.deltaY !== 0 && tabsRef.current) {
      tabsRef.current.scrollLeft += e.deltaY;
    }
  };

  // Load live leaderboard from Supabase
  React.useEffect(() => {
    let active = true;
    async function loadDb() {
      setIsDbLoading(true);
      setDbError(null);
      try {
        const res = await rpcGetLeaderboard(100, 0);
        if (!active) return;
        if (res.ok) {
          setDbUsers(res.users);
          setDbTotalCount(res.totalCount);
          setIsDbConnected(true);
        } else {
          // Keep whatever is already on screen; local progress still counts.
          setIsDbConnected(false);
          setDbError("Klasemen server belum bisa dimuat.");
        }
      } catch (err) {
        console.warn("Could not fetch leaderboard from DB:", err);
        if (active) {
          setIsDbConnected(false);
          setDbError("Klasemen server belum bisa dimuat.");
        }
      } finally {
        if (active) setIsDbLoading(false);
      }
    }
    void loadDb();
    return () => {
      active = false;
    };
  }, [reloadKey]);

  const currentUser = React.useMemo(
    () => ({
      username: username || "pelajar",
      xp: xp ?? 0,
      weeklyXp: weeklyXp ?? xp ?? 0,
      streak: streak ?? 0,
    }),
    [username, xp, weeklyXp, streak],
  );

  const { participants, userRankItem, totalCount, calculatedUserRank } = React.useMemo(
    () =>
      getLeaderboardParticipants(
        currentUser,
        1,
        100,
        filterTier,
        search,
        dbUsers,
        dbTotalCount,
      ),
    [currentUser, filterTier, search, dbUsers, dbTotalCount],
  );

  const isClaimedThisWeek = lastClaimedLeaderboardWeek === currentWeek;

  const handleClaim = () => {
    if (isClaimedThisWeek) return;
    const res = claimWeeklyLeaderboardReward(currentWeek, calculatedUserRank);
    if (res.success) {
      setClaimedNotice(`Selamat! Kamu berhasil mengklaim +${res.coins} Koin dari hadiah mingguan!`);
      setTimeout(() => setClaimedNotice(null), 5000);
    }
  };

  const scrollToUser = () => {
    const el = document.getElementById("current-user-row");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  return (
    <AppShell>
      <div className="mx-auto max-w-4xl px-4 py-6 md:py-8 space-y-6">
        {/* Arena Sub-Navigation Tabs */}
        <div className="flex items-center gap-2 rounded-2xl border-2 border-choco-900/20 bg-gradient-to-b from-white via-[#FFF9F5] to-[#FDEEE4] p-1.5 shadow-[0_4px_0_#3B2218,0_10px_20px_-4px_rgba(59,34,24,0.12)] max-w-md mx-auto">
          <Link
            to="/leaderboard"
            className="flex-1 inline-flex items-center justify-center gap-2 py-2 px-3 rounded-xl border-2 border-amber-600/50 bg-gradient-to-b from-[#FFE873] via-[#FFD84D] to-[#E6BF35] text-xs md:text-sm font-bold text-choco-900 shadow-[0_3px_0_#C8940C] transition-transform"
          >
            <Trophy className="h-4 w-4 shrink-0 text-choco-900" />
            <span>Klasemen Mingguan</span>
          </Link>
          <Link
            to="/raffle"
            className="flex-1 inline-flex items-center justify-center gap-2 py-2 px-3 rounded-xl border-2 border-transparent hover:border-choco-900/20 hover:bg-candy-50 text-xs md:text-sm font-bold text-choco-600 hover:text-choco-900 transition-all"
          >
            <Ticket className="h-4 w-4 shrink-0 text-choco-700" />
            <span>Undian Hadiah</span>
          </Link>
        </div>
      {/* Top Header Card */}
      <div className="relative overflow-hidden rounded-3xl border-2 border-choco-900 bg-gradient-to-b from-[#FFFBEB] via-[#FEF3C7] to-[#FDE68A] p-6 md:p-8 shadow-[0_6px_0_#3B2218]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full border-2 border-choco-900/20 bg-white/90 px-3 py-1 text-xs font-pixel font-bold uppercase tracking-wider text-choco-900 shadow-[0_2px_0_#3B2218]">
              <Trophy className="h-4 w-4 text-amber-500 fill-amber-400" />
              Liga Emas • Reset Mingguan
            </div>
            <h1 className="text-3xl md:text-4xl font-pixel font-bold tracking-tight text-choco-900">
              Klasemen Mingguan & Pool Hadiah Koin
            </h1>
            <p className="text-sm md:text-base font-bold text-choco-700 max-w-xl leading-relaxed">
              Peringkat <strong className="text-choco-900 underline decoration-candy-500 underline-offset-2">1 s/d 1.000</strong> berhak mendapatkan hadiah koin mingguan dengan total prize pool{" "}
              <span className="inline-flex items-center gap-1 font-pixel font-bold text-choco-900 bg-amber-200 px-2 py-0.5 rounded-lg border-2 border-choco-900/30 shadow-[0_2px_0_#3B2218]">
                <Coins className="h-4 w-4 fill-amber-500" />
                {TOTAL_WEEKLY_PRIZE_COINS.toLocaleString("id-ID")}+ Koin
              </span>
              !
            </p>
          </div>

          <div className="flex flex-col sm:flex-row md:flex-col gap-2 shrink-0">
            <button
              onClick={() => setShowPrizeModal(true)}
              className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-choco-900 bg-white px-4 py-2.5 text-xs md:text-sm font-pixel font-bold text-choco-900 shadow-[0_3px_0_#3B2218] transition-transform hover:-translate-y-0.5 active:translate-y-0.5"
            >
              <Award className="h-4 w-4 text-candy-500" />
              Rincian Hadiah (1 s.d. 1.000)
            </button>
          </div>
        </div>
      </div>

      {/* Promo Banner: Hadiah Undian Bridge */}
      <div className="relative overflow-hidden rounded-3xl border-2 border-choco-900 bg-gradient-to-b from-[#FFF0F5] via-[#FFE4EC] to-[#FDC8D8] p-5 md:p-6 text-choco-900 shadow-[0_6px_0_#3B2218]">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 text-center sm:text-left">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border-2 border-choco-900 bg-gradient-to-b from-[#FFFBEB] via-[#FEF3C7] to-[#FDE68A] text-choco-900 shadow-[0_3px_0_#3B2218]">
              <Ticket className="h-8 w-8 stroke-[2.5]" />
            </div>
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 rounded-full border-2 border-choco-900/20 bg-white/90 px-2.5 py-0.5 text-[11px] font-pixel font-bold uppercase tracking-wider text-choco-900 shadow-[0_1px_0_#3B2218]">
                Undian Mingguan Aktif
              </div>
              <h2 className="text-xl md:text-2xl font-pixel font-bold text-choco-900">
                Gunakan Koin untuk Ikut Undian Hadiah!
              </h2>
              <p className="text-xs md:text-sm font-semibold text-choco-700 max-w-lg leading-relaxed">
                Gunakan Koin untuk ikut Undian Hadiah. Menangkan item Blobi edisi terbatas atau slot mint NFT dari proyek mitra.
              </p>
            </div>
          </div>

          <Link
            to="/raffle"
            className="shrink-0 inline-flex items-center justify-center gap-2 rounded-full border-2 border-choco-900 bg-gradient-to-b from-[#D62A78] via-[#B01F62] to-[#85174A] px-5 py-3 text-xs md:text-sm font-bold text-white shadow-[0_4px_0_#3B2218] hover:brightness-105 active:translate-y-[2px] active:shadow-none transition-all"
          >
            <span>Buka Undian Hadiah</span>
          </Link>
        </div>
      </div>

      {/* Claimed Toast Banner */}
      {claimedNotice && (
        <div className="flex items-center gap-3 rounded-2xl border-2 border-choco-900 bg-emerald-100 p-4 font-bold text-emerald-950 shadow-[0_4px_0_#3B2218]">
          <CheckCircle2 className="h-6 w-6 text-emerald-700 shrink-0" />
          <p className="text-sm font-semibold">{claimedNotice}</p>
        </div>
      )}

      {/* User Status Sticky Card in Tactile Beveled Style */}
      <div className="rounded-3xl border-2 border-candy-500/40 bg-gradient-to-b from-[#FFF0F5] via-[#FFE4EC] to-[#FDC8D8] p-5 md:p-6 text-choco-900 shadow-[0_6px_0_#B01F62,0_12px_28px_-4px_rgba(232,67,127,0.22)]">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl border-2 border-candy-600/50 bg-gradient-to-b from-white via-[#FFF0F5] to-[#FDC8D8] shadow-[0_3px_0_#B01F62]">
                <Mascot mood="proud" size={40} className="h-10 w-10" />
              </div>
              <div className="absolute -top-2 -left-2 flex h-7 w-7 items-center justify-center rounded-full border-2 border-choco-900/30 bg-amber-400 text-xs font-pixel font-bold text-choco-900 shadow-[0_2px_0_#3B2218]">
                #{calculatedUserRank}
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg md:text-xl font-display font-bold text-choco-900">@{currentUser.username}</span>
                <span className="rounded-full border-2 border-candy-600 bg-white px-2 py-0.5 text-[10px] font-bold uppercase text-candy-700 shadow-[0_2px_0_#B01F62]">
                  Kamu
                </span>
              </div>
              <div className="flex items-center gap-3 text-xs md:text-sm font-semibold text-choco-700 mt-1">
                <span>{currentUser.weeklyXp} XP Mingguan</span>
                <span>•</span>
                <span className="flex items-center gap-1 text-orange-600 font-bold">
                  <Flame className="h-4 w-4 fill-orange-500" />
                  {currentUser.streak} Hari
                </span>
                <span>•</span>
                <span className="flex items-center gap-1 text-amber-700 font-bold">
                  <Coins className="h-4 w-4 fill-amber-500" />
                  Saldo: {gems} Koin
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <div className="text-right hidden md:block">
              <div className="text-xs font-bold text-choco-600">Estimasi Hadiah:</div>
              <div className="text-base font-bold text-amber-700 flex items-center gap-1 justify-end font-pixel">
                <Coins className="h-4 w-4 fill-amber-500" />
                +{userRankItem.rewardCoins} Koin
              </div>
            </div>

            <button
              onClick={handleClaim}
              disabled={isClaimedThisWeek}
              className={`inline-flex items-center justify-center gap-2 rounded-full border-2 px-5 py-2.5 text-xs md:text-sm font-bold transition-transform ${
                isClaimedThisWeek
                  ? "bg-stone-200 border-stone-300 text-stone-500 cursor-not-allowed shadow-none"
                  : "border-emerald-600/60 bg-gradient-to-b from-[#34D399] via-[#10B981] to-[#059669] text-white shadow-[0_4px_0_#047857,0_8px_16px_-2px_rgba(16,185,129,0.25)] hover:brightness-105 active:translate-y-[2px] active:shadow-none"
              }`}
            >
              {isClaimedThisWeek ? (
                <>
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Hadiah Diklaim</span>
                </>
              ) : (
                <>
                  <Gift className="h-4 w-4" />
                  <span>Klaim {userRankItem.rewardCoins} Koin</span>
                </>
              )}
            </button>

            <button
              onClick={scrollToUser}
              title="Lihat posisi saya di tabel"
              className="size-11 rounded-full border-2 border-choco-900/20 bg-white hover:bg-candy-50 text-choco-900 shadow-[0_3px_0_#3B2218] transition-transform active:translate-y-0.5 flex items-center justify-center cursor-pointer"
            >
              <MapPin className="size-4 text-choco-900" />
            </button>
          </div>
        </div>
      </div>

      {/* Filter Tabs and Search Bar */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Tier Filter Pills with Desktop Drag-to-Scroll & Navigation Arrows */}
          <div className="relative flex items-center min-w-0 flex-1 gap-1.5">
            {/* Desktop Left Scroll Arrow */}
            <button
              type="button"
              onClick={() => tabsRef.current?.scrollBy({ left: -220, behavior: "smooth" })}
              className="hidden sm:flex size-8 shrink-0 items-center justify-center rounded-xl border-2 border-ink-900 bg-white text-choco-900 shadow-[2px_2px_0_#2B1622] hover:bg-candy-100 active:translate-y-0.5 transition-all cursor-pointer"
              title="Geser ke kiri"
              aria-label="Geser ke kiri"
            >
              <ChevronLeft className="size-4" />
            </button>

            {/* Draggable & Scrollable Tabs Container */}
            <div
              ref={tabsRef}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onWheel={handleWheel}
              className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none cursor-grab active:cursor-grabbing select-none scroll-smooth min-w-0 flex-1"
            >
              <button
                type="button"
                onClick={() => {
                  if (hasDragged.current) return;
                  setFilterTier(undefined);
                }}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold border-2 border-choco-900 transition-all shadow-[0_2px_0_#3B2218] shrink-0 cursor-pointer ${
                  filterTier === undefined
                    ? "bg-choco-900 text-white"
                    : "bg-white text-choco-900 hover:bg-yellow-100"
                }`}
              >
                Semua
              </button>
              <button
                type="button"
                onClick={() => {
                  if (hasDragged.current) return;
                  setFilterTier("tier-top10");
                }}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold border-2 border-choco-900 transition-all shadow-[0_2px_0_#3B2218] shrink-0 flex items-center gap-1.5 cursor-pointer ${
                  filterTier === "tier-top10"
                    ? "bg-candy-800 text-white"
                    : "bg-white text-choco-900 hover:bg-candy-100"
                }`}
              >
                <Crown className="size-3.5 text-amber-500 shrink-0" />
                <span>Top 10</span>
                <span className="inline-flex items-center gap-0.5 opacity-90 font-mono text-[11px]">
                  (200 <CoinIcon size={12} className="inline-block" />)
                </span>
              </button>
              <button
                type="button"
                onClick={() => {
                  if (hasDragged.current) return;
                  setFilterTier("tier-top50");
                }}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold border-2 border-choco-900 transition-all shadow-[0_2px_0_#3B2218] shrink-0 flex items-center gap-1.5 cursor-pointer ${
                  filterTier === "tier-top50"
                    ? "bg-lemon text-choco-900"
                    : "bg-white text-choco-900 hover:bg-lemon/40"
                }`}
              >
                <Star className="size-3.5 text-amber-600 shrink-0" />
                <span>Top 50</span>
                <span className="inline-flex items-center gap-0.5 opacity-90 font-mono text-[11px]">
                  (100 <CoinIcon size={12} className="inline-block" />)
                </span>
              </button>
              <button
                type="button"
                onClick={() => {
                  if (hasDragged.current) return;
                  setFilterTier("tier-top100");
                }}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold border-2 border-choco-900 transition-all shadow-[0_2px_0_#3B2218] shrink-0 flex items-center gap-1.5 cursor-pointer ${
                  filterTier === "tier-top100"
                    ? "bg-emerald-500 text-white"
                    : "bg-white text-choco-900 hover:bg-emerald-100"
                }`}
              >
                <Flame className="size-3.5 text-emerald-500 shrink-0" />
                <span>Top 100</span>
                <span className="inline-flex items-center gap-0.5 opacity-90 font-mono text-[11px]">
                  (60 <CoinIcon size={12} className="inline-block" />)
                </span>
              </button>
              <button
                type="button"
                onClick={() => {
                  if (hasDragged.current) return;
                  setFilterTier("tier-top500");
                }}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold border-2 border-choco-900 transition-all shadow-[0_2px_0_#3B2218] shrink-0 flex items-center gap-1.5 cursor-pointer ${
                  filterTier === "tier-top500"
                    ? "bg-amber-500 text-white"
                    : "bg-white text-choco-900 hover:bg-amber-100"
                }`}
              >
                <Zap className="size-3.5 text-amber-500 shrink-0" />
                <span>251 s.d. 500</span>
                <span className="inline-flex items-center gap-0.5 opacity-90 font-mono text-[11px]">
                  (25 <CoinIcon size={12} className="inline-block" />)
                </span>
              </button>
              <button
                type="button"
                onClick={() => {
                  if (hasDragged.current) return;
                  setFilterTier("tier-top1000");
                }}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold border-2 border-choco-900 transition-all shadow-[0_2px_0_#3B2218] shrink-0 flex items-center gap-1.5 cursor-pointer ${
                  filterTier === "tier-top1000"
                    ? "bg-slate-700 text-white"
                    : "bg-white text-choco-900 hover:bg-slate-200"
                }`}
              >
                <Shield className="size-3.5 text-slate-500 shrink-0" />
                <span>501 s.d. 1.000</span>
                <span className="inline-flex items-center gap-0.5 opacity-90 font-mono text-[11px]">
                  (15 <CoinIcon size={12} className="inline-block" />)
                </span>
              </button>
            </div>

            {/* Desktop Right Scroll Arrow */}
            <button
              type="button"
              onClick={() => tabsRef.current?.scrollBy({ left: 220, behavior: "smooth" })}
              className="hidden sm:flex size-8 shrink-0 items-center justify-center rounded-xl border-2 border-ink-900 bg-white text-choco-900 shadow-[2px_2px_0_#2B1622] hover:bg-candy-100 active:translate-y-0.5 transition-all cursor-pointer"
              title="Geser ke kanan"
              aria-label="Geser ke kanan"
            >
              <ChevronRight className="size-4" />
            </button>
          </div>

          {/* Search Box */}
          <div className="relative shrink-0 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-choco-400" />
            <input
              type="text"
              placeholder="Cari user atau rank..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-2xl border-2 border-choco-900/20 bg-white py-2 pl-9 pr-3 text-xs md:text-sm font-semibold text-choco-900 placeholder:text-choco-400 shadow-[0_2px_0_#3B2218] focus:outline-none focus:ring-2 focus:ring-candy-400"
            />
          </div>
        </div>
      </div>

      {/* Leaderboard Table Card in Tactile Beveled Style */}
      <div className="rounded-3xl border-2 border-choco-900 bg-gradient-to-b from-white via-[#FFF9F5] to-[#FDEEE4] shadow-[0_6px_0_#3B2218] overflow-hidden">
        <div className="border-b-2 border-choco-900/15 bg-gradient-to-r from-[#FFF0F5] to-[#FFE4EC] px-6 py-3 flex items-center justify-between text-xs font-bold uppercase text-choco-900 tracking-wider">
          <div className="flex items-center gap-4">
            <span className="w-12 text-center">Rank</span>
            <span>Petualang</span>
          </div>
          <div className="flex items-center gap-6">
            <span className="hidden sm:inline">Streak</span>
            <span className="w-20 text-right">XP</span>
            <span className="w-28 text-right">Hadiah Koin</span>
          </div>
        </div>

        <div className="text-[11px] font-bold text-choco-600 px-6 py-2 bg-cream/70 border-b border-choco-900/10 flex items-center justify-between">
          <span>Menampilkan {participants.length} dari {totalCount} petualang</span>
          <span className="text-[10px] uppercase font-pixel text-choco-500">Liga Emas</span>
        </div>

        <div className="divide-y-2 divide-choco-900/10">
          {isDbLoading ? (
            <SkeletonRows count={6} />
          ) : dbError ? (
            <div className="flex flex-col items-center gap-4 p-10 text-center" role="alert">
              <AlertTriangle aria-hidden="true" className="size-7 text-[#B27B00]" />
              <div>
                <p className="font-black text-choco-900">Klasemen server belum bisa dimuat</p>
                <p className="mt-1 text-sm font-semibold text-choco-600">
                  Progres kamu tetap aman. Coba lagi sebentar lagi ya.
                </p>
              </div>
              <button
                type="button"
                onClick={retryDb}
                className="flex min-h-11 items-center gap-2 rounded-full border-2 border-choco-900 bg-candy-800 px-4 text-sm font-black text-white shadow-[0_3px_0_#3B2218] transition-transform active:translate-y-0.5"
              >
                <RefreshCw aria-hidden="true" className="size-4" />
                Coba lagi
              </button>
            </div>
          ) : participants.length === 0 ? (
            <div className="flex flex-col items-center gap-4 p-10 text-center">
              <p className="font-black text-choco-900">Belum ada petualang di klasemen</p>
              <p className="text-sm font-semibold text-choco-600">
                Selesaikan satu blok untuk muncul di sini.
              </p>
              <Link
                to="/"
                className="flex min-h-11 items-center gap-2 rounded-full border-2 border-choco-900 bg-candy-800 px-4 text-sm font-black text-white shadow-[0_3px_0_#3B2218] transition-transform active:translate-y-0.5"
              >
                Mulai Belajar
                <ArrowRight aria-hidden="true" className="size-4" />
              </Link>
            </div>
          ) : (
            participants.map((p) => {
              const isFirst = p.rank === 1;
              const isSecond = p.rank === 2;
              const isThird = p.rank === 3;

              return (
                <div
                  key={`${p.rank}-${p.name}`}
                  id={p.isCurrentUser ? "current-user-row" : undefined}
                  className={`flex items-center justify-between px-4 sm:px-6 py-3.5 transition-colors ${
                    p.isCurrentUser
                      ? "bg-candy-100 font-bold border-l-8 border-l-candy-500"
                      : isFirst
                      ? "bg-amber-50/70"
                      : isSecond
                      ? "bg-slate-50/70"
                      : isThird
                      ? "bg-orange-50/70"
                      : "hover:bg-candy-50/40"
                  }`}
                >
                  {/* Left: Rank & Avatar & Name */}
                  <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                    <div className="w-10 sm:w-12 flex items-center justify-center shrink-0">
                      {isFirst ? (
                        <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-choco-900 bg-amber-400 font-bold text-choco-900 shadow-[0_1px_0_#3B2218] text-xs">
                          1
                        </div>
                      ) : isSecond ? (
                        <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-choco-900 bg-slate-300 font-bold text-choco-900 shadow-[0_1px_0_#3B2218] text-xs">
                          2
                        </div>
                      ) : isThird ? (
                        <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-choco-900 bg-amber-600 text-white font-bold shadow-[0_1px_0_#3B2218] text-xs">
                          3
                        </div>
                      ) : (
                        <span className="text-xs sm:text-sm font-bold text-choco-700">
                          #{p.rank}
                        </span>
                      )}
                    </div>

                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-choco-900 bg-candy-200">
                      <Mascot mood={p.avatarMood} size={32} className="h-8 w-8" />
                    </div>

                    <div className="min-w-0 truncate">
                      <div className="flex items-center gap-2">
                        <span className="text-xs sm:text-sm font-bold text-choco-900 truncate">
                          @{p.name}
                        </span>
                        {p.isCurrentUser && (
                          <span className="rounded-full bg-candy-400 px-2 py-0.5 text-[9px] font-bold uppercase text-choco-900 border border-choco-900 shrink-0">
                            Kamu
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-choco-500 font-bold block sm:hidden">
                        {p.weeklyXp} XP • {p.streak} Hari
                      </div>
                    </div>
                  </div>

                  {/* Right: Streak & XP & Reward */}
                  <div className="flex items-center gap-4 sm:gap-6 shrink-0">
                    <div className="hidden sm:flex items-center gap-1 text-xs font-bold text-orange-600 w-12 justify-center">
                      <Flame className="h-3.5 w-3.5 fill-orange-500" />
                      {p.streak}
                    </div>

                    <div className="w-16 sm:w-20 text-right text-xs sm:text-sm font-bold text-choco-900">
                      {p.weeklyXp.toLocaleString("id-ID")} <span className="text-[10px] text-choco-500 font-bold">XP</span>
                    </div>

                    <div className="w-24 sm:w-28 text-right">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full border-2 border-choco-900 text-xs font-bold shadow-[0_1px_0_#3B2218] ${
                          isFirst
                            ? "bg-amber-300 text-choco-900"
                            : isSecond
                            ? "bg-slate-200 text-choco-900"
                            : isThird
                            ? "bg-amber-600 text-white"
                            : p.rank <= 10
                            ? "bg-candy-300 text-choco-900"
                            : p.rank <= 50
                            ? "bg-lemon text-choco-900"
                            : p.rank <= 100
                            ? "bg-emerald-100 text-emerald-900"
                            : "bg-amber-50 text-amber-900"
                        }`}
                      >
                        <Coins className="h-3 w-3 fill-amber-500" />
                        +{p.rewardCoins}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {totalCount > participants.length && (
          <div className="p-4 text-center border-t-2 border-ink-900/10 bg-candy-50/50 text-xs font-bold text-ink-600">
            Menampilkan {participants.length} dari {totalCount} petualang. Gunakan pencarian untuk menemukan peringkat lainnya hingga #1.000!
          </div>
        )}
      </div>

      {/* Prize Breakdown Modal */}
      {showPrizeModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-choco-900/60 backdrop-blur-xs animate-in fade-in duration-150"
          onClick={() => setShowPrizeModal(false)}
        >
          <div
            className="relative w-full max-w-lg rounded-[28px] border-3 border-choco-900 bg-cream p-5 sm:p-6 shadow-[0_8px_0_#3B2218] space-y-4 max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200 text-choco-900"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b-2 border-choco-900/15 pb-3">
              <div className="flex items-center gap-2">
                <Trophy className="h-6 w-6 text-amber-500 fill-amber-400" />
                <h3 className="font-pixel text-base sm:text-lg font-bold text-choco-900">Skema Hadiah Koin (1 s.d. 1.000)</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowPrizeModal(false)}
                className="flex size-9 sm:size-10 items-center justify-center rounded-full border-2 border-choco-900 bg-white text-choco-900 shadow-[0_1px_0_#3B2218] hover:bg-candy-100 active:translate-y-0.5 cursor-pointer transition-all"
                aria-label="Tutup"
              >
                <X className="size-4" />
              </button>
            </div>

            <p className="text-xs font-semibold text-choco-700 leading-relaxed">
              Setiap reset mingguan (Senin 00:00 WIB), pemain pada peringkat 1 hingga 1.000 mendapatkan hadiah Koin langsung ke saldo petualangan yang dapat dibelanjakan untuk membeli Tiket Undian NFT di halaman Raffle!
            </p>

            <div className="space-y-2">
              {LEADERBOARD_PRIZE_TIERS.map((tier) => (
                <div
                  key={tier.id}
                  className="flex items-center justify-between p-3 rounded-2xl border-2 border-candy-500/30 bg-gradient-to-b from-[#FFF0F5] to-[#FFE4EC] shadow-[0_2px_0_#B01F62]"
                >
                  <div className="space-y-0.5">
                    <div className="text-xs font-bold text-choco-900">{tier.label}</div>
                    <div className="text-[11px] font-semibold text-choco-600">{tier.description}</div>
                  </div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl border-2 border-amber-600/40 bg-gradient-to-b from-[#FFE873] to-[#FFD84D] font-bold text-xs text-choco-900 shadow-[0_1.5px_0_#C8940C]">
                    <Coins className="h-3.5 w-3.5 fill-amber-500" />
                    +{tier.coins} Koin
                  </div>
                </div>
              ))}
            </div>

            <div className="rounded-2xl border-2 border-amber-500/40 bg-gradient-to-b from-[#FFFBEB] to-[#FEF3C7] p-3 text-xs font-semibold text-amber-950 flex items-center gap-2 shadow-[0_2px_0_#D97706]">
              <HelpCircle className="h-4 w-4 shrink-0 text-amber-700" />
              <span>Total Prize Pool Mingguan: <strong>30.150+ Koin</strong> yang didistribusikan kepada 1.000 petualang aktif!</span>
            </div>

            <button
              type="button"
              onClick={() => setShowPrizeModal(false)}
              className="w-full rounded-full border-2 border-choco-900 bg-candy-800 hover:bg-candy-950 py-3 font-bold text-white shadow-[0_3px_0_#3B2218] active:translate-y-0.5 transition-all cursor-pointer"
            >
              Tutup Rincian
            </button>
          </div>
        </div>
      )}
      </div>
    </AppShell>
  );
}
