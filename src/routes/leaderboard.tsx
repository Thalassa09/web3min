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
  Gift,
  HelpCircle,
  Database,
  ArrowRight,
  Crown,
  Coins,
} from "lucide-react";
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
import { CandyLoader } from "@/components/ui/progress-bar";

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
  const [dbUsers, setDbUsers] = React.useState<DbLeaderboardUser[]>([]);
  const [isDbLoading, setIsDbLoading] = React.useState(true);
  const [isDbConnected, setIsDbConnected] = React.useState(false);

  // Load live leaderboard from Supabase
  React.useEffect(() => {
    let active = true;
    async function loadDb() {
      setIsDbLoading(true);
      try {
        const users = await rpcGetLeaderboard(100, 0);
        if (active && Array.isArray(users) && users.length > 0) {
          setDbUsers(users);
          setIsDbConnected(true);
        }
      } catch (err) {
        console.warn("Could not fetch leaderboard from DB:", err);
      } finally {
        if (active) setIsDbLoading(false);
      }
    }
    void loadDb();
    return () => {
      active = false;
    };
  }, []);

  const currentUser = React.useMemo(
    () => ({
      username: username || "pelajar",
      xp: xp ?? 0,
      weeklyXp: weeklyXp ?? xp ?? 240,
      streak: streak ?? 4,
    }),
    [username, xp, weeklyXp, streak],
  );

  const { participants, userRankItem, totalCount, calculatedUserRank } = React.useMemo(
    () =>
      getLeaderboardParticipants(
        currentUser,
        7,
        100,
        filterTier,
        search,
        dbUsers,
      ),
    [currentUser, filterTier, search, dbUsers],
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
        <div className="flex items-center gap-2 rounded-2xl border-3 border-ink-900 bg-white/90 p-1.5 shadow-[3px_3px_0_#2B1622] max-w-md mx-auto">
          <Link
            to="/leaderboard"
            className="flex-1 inline-flex items-center justify-center gap-2 py-2 px-3 rounded-xl border-2 border-ink-900 bg-amber-400 text-xs md:text-sm font-black text-ink-900 shadow-[2px_2px_0_#2B1622] transition-transform"
          >
            <Trophy className="h-4 w-4 shrink-0 text-ink-900" />
            <span>Klasemen Mingguan</span>
          </Link>
          <Link
            to="/raffle"
            className="flex-1 inline-flex items-center justify-center gap-2 py-2 px-3 rounded-xl border-2 border-transparent hover:border-ink-900 hover:bg-candy-50 text-xs md:text-sm font-bold text-ink-600 hover:text-ink-900 transition-all"
          >
            <Ticket className="h-4 w-4 shrink-0 text-ink-700" />
            <span>Undian Raffle NFT</span>
          </Link>
        </div>
      {/* Top Header Card */}
      <div className="relative overflow-hidden rounded-3xl border-4 border-ink-900 bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-100 p-6 md:p-8 shadow-[4px_4px_0_#2B1622]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full border-2 border-ink-900 bg-white/90 px-3 py-1 text-xs font-black uppercase tracking-wider text-ink-900 shadow-[2px_2px_0_#2B1622]">
              <Trophy className="h-4 w-4 text-amber-500 fill-amber-400" />
              Liga Emas • Reset dalam 3 Hari 14 Jam
            </div>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight text-ink-900">
              Klasemen Mingguan & Pool Hadiah Koin
            </h1>
            <p className="text-sm md:text-base font-bold text-ink-700 max-w-xl leading-relaxed">
              Peringkat <strong className="text-ink-900 underline decoration-amber-500 underline-offset-2">1 s/d 1.000</strong> berhak mendapatkan hadiah koin mingguan dengan total prize pool{" "}
              <span className="inline-flex items-center gap-1 font-black text-amber-700 bg-amber-200/80 px-2 py-0.5 rounded-md border border-amber-400">
                <Coins className="h-4 w-4 fill-amber-500" />
                {TOTAL_WEEKLY_PRIZE_COINS.toLocaleString("id-ID")}+ Koin
              </span>
              !
            </p>
          </div>

          <div className="flex flex-col sm:flex-row md:flex-col gap-2 shrink-0">
            <button
              onClick={() => setShowPrizeModal(true)}
              className="inline-flex items-center justify-center gap-2 rounded-2xl border-3 border-ink-900 bg-white px-4 py-2.5 text-xs md:text-sm font-black text-ink-900 shadow-[3px_3px_0_#2B1622] transition-transform hover:-translate-y-0.5 active:translate-y-0.5"
            >
              <Award className="h-4 w-4 text-candy-500" />
              Rincian Hadiah (1–1.000)
            </button>
            <div className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl bg-ink-900/10 text-[11px] font-bold text-ink-800">
              <Database className="h-3.5 w-3.5 text-emerald-600" />
              {isDbConnected ? "Tersinkron Database Supabase" : isDbLoading ? "Menghubungkan DB..." : "Mode Offline"}
            </div>
          </div>
        </div>
      </div>

      {/* Promo Banner: Raffle NFT Bridge */}
      <div className="relative overflow-hidden rounded-3xl border-4 border-ink-900 bg-gradient-to-r from-violet-600 via-purple-600 to-pink-500 p-5 md:p-6 text-white shadow-[4px_4px_0_#2B1622]">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 text-center sm:text-left">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border-3 border-white bg-amber-400 text-ink-900 shadow-[3px_3px_0_rgba(0,0,0,0.3)]">
              <Ticket className="h-8 w-8 stroke-[2.5]" />
            </div>
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-2.5 py-0.5 text-[11px] font-black uppercase tracking-wider backdrop-blur-sm">
                <Sparkles className="h-3 w-3 text-yellow-300" />
                Fitur Baru Telah Aktif!
              </div>
              <h2 className="text-xl md:text-2xl font-black">
                Gunakan Koin untuk Ikut Undian Raffle NFT!
              </h2>
              <p className="text-xs md:text-sm font-medium text-purple-100 max-w-lg">
                Tukarkan koin kemenangan klasemenmu dengan Tiket Raffle untuk memenangkan Genesis Blobi #001 (1/1 Mythic NFT), Cyber Pass, & koleksi langka lainnya!
              </p>
            </div>
          </div>

          <Link
            to="/raffle"
            className="inline-flex items-center gap-2 rounded-2xl border-3 border-ink-900 bg-yellow-400 px-5 py-3 text-sm font-black text-ink-900 shadow-[3px_3px_0_#2B1622] transition-transform hover:-translate-y-0.5 active:translate-y-0.5 shrink-0"
          >
            <span>Kunjungi Raffle NFT</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      {/* Claimed Toast Banner */}
      {claimedNotice && (
        <div className="flex items-center gap-3 rounded-2xl border-3 border-ink-900 bg-emerald-100 p-4 font-black text-emerald-950 shadow-[3px_3px_0_#2B1622] animate-bounce">
          <CheckCircle2 className="h-6 w-6 text-emerald-600 shrink-0" />
          <p className="text-sm">{claimedNotice}</p>
        </div>
      )}

      {/* User Status Sticky Card */}
      <div className="rounded-3xl border-4 border-ink-900 bg-candy-100 p-5 md:p-6 shadow-[4px_4px_0_#2B1622]">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl border-3 border-ink-900 bg-candy-400 shadow-[2px_2px_0_#2B1622]">
                <Mascot mood="proud" size={40} className="h-10 w-10" />
              </div>
              <div className="absolute -top-2 -left-2 flex h-7 w-7 items-center justify-center rounded-full border-2 border-ink-900 bg-yellow-400 text-xs font-black text-ink-900 shadow-[1px_1px_0_#2B1622]">
                #{calculatedUserRank}
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg md:text-xl font-black text-ink-900">@{currentUser.username}</span>
                <span className="rounded-md border border-ink-900 bg-candy-300 px-1.5 py-0.5 text-[10px] font-black uppercase text-ink-900">
                  Kamu
                </span>
              </div>
              <div className="flex items-center gap-3 text-xs md:text-sm font-bold text-ink-700 mt-1">
                <span>{currentUser.weeklyXp} XP Mingguan</span>
                <span>•</span>
                <span className="flex items-center gap-1 text-orange-600">
                  <Flame className="h-4 w-4 fill-orange-500" />
                  {currentUser.streak} Hari
                </span>
                <span>•</span>
                <span className="flex items-center gap-1 text-amber-700 font-black">
                  <Coins className="h-4 w-4 fill-amber-500" />
                  Saldo: {gems} Koin
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <div className="text-right hidden md:block">
              <div className="text-xs font-bold text-ink-600">Estimasi Hadiah:</div>
              <div className="text-base font-black text-amber-600 flex items-center gap-1 justify-end">
                <Coins className="h-4 w-4 fill-amber-500" />
                +{userRankItem.rewardCoins} Koin
              </div>
            </div>

            <button
              onClick={handleClaim}
              disabled={isClaimedThisWeek}
              className={`inline-flex items-center justify-center gap-2 rounded-2xl border-3 border-ink-900 px-5 py-3 text-xs md:text-sm font-black shadow-[3px_3px_0_#2B1622] transition-transform ${
                isClaimedThisWeek
                  ? "bg-stone-200 text-stone-500 cursor-not-allowed"
                  : "bg-emerald-400 text-ink-900 hover:-translate-y-0.5 active:translate-y-0.5"
              }`}
            >
              {isClaimedThisWeek ? (
                <>
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Hadiah Diklaim ✓</span>
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
              className="p-3 rounded-2xl border-3 border-ink-900 bg-white hover:bg-candy-200 text-ink-900 shadow-[2px_2px_0_#2B1622] transition-transform active:translate-y-0.5"
            >
              📍
            </button>
          </div>
        </div>
      </div>

      {/* Filter Tabs and Search Bar */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Tier Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            <button
              onClick={() => setFilterTier(undefined)}
              className={`px-3 py-1.5 rounded-xl text-xs font-black border-2 border-ink-900 transition-all shadow-[2px_2px_0_#2B1622] shrink-0 ${
                filterTier === undefined
                  ? "bg-ink-900 text-white"
                  : "bg-white text-ink-900 hover:bg-yellow-100"
              }`}
            >
              Semua (Top 100)
            </button>
            <button
              onClick={() => setFilterTier("tier-top10")}
              className={`px-3 py-1.5 rounded-xl text-xs font-black border-2 border-ink-900 transition-all shadow-[2px_2px_0_#2B1622] shrink-0 ${
                filterTier === "tier-top10"
                  ? "bg-candy-500 text-white"
                  : "bg-white text-ink-900 hover:bg-candy-100"
              }`}
            >
              👑 Top 10 (200 🪙)
            </button>
            <button
              onClick={() => setFilterTier("tier-top50")}
              className={`px-3 py-1.5 rounded-xl text-xs font-black border-2 border-ink-900 transition-all shadow-[2px_2px_0_#2B1622] shrink-0 ${
                filterTier === "tier-top50"
                  ? "bg-blue-500 text-white"
                  : "bg-white text-ink-900 hover:bg-blue-100"
              }`}
            >
              ⭐ Top 50 (100 🪙)
            </button>
            <button
              onClick={() => setFilterTier("tier-top100")}
              className={`px-3 py-1.5 rounded-xl text-xs font-black border-2 border-ink-900 transition-all shadow-[2px_2px_0_#2B1622] shrink-0 ${
                filterTier === "tier-top100"
                  ? "bg-emerald-500 text-white"
                  : "bg-white text-ink-900 hover:bg-emerald-100"
              }`}
            >
              🔥 Top 100 (60 🪙)
            </button>
            <button
              onClick={() => setFilterTier("tier-top500")}
              className={`px-3 py-1.5 rounded-xl text-xs font-black border-2 border-ink-900 transition-all shadow-[2px_2px_0_#2B1622] shrink-0 ${
                filterTier === "tier-top500"
                  ? "bg-amber-500 text-white"
                  : "bg-white text-ink-900 hover:bg-amber-100"
              }`}
            >
              ⚡ 251–500 (25 🪙)
            </button>
            <button
              onClick={() => setFilterTier("tier-top1000")}
              className={`px-3 py-1.5 rounded-xl text-xs font-black border-2 border-ink-900 transition-all shadow-[2px_2px_0_#2B1622] shrink-0 ${
                filterTier === "tier-top1000"
                  ? "bg-slate-700 text-white"
                  : "bg-white text-ink-900 hover:bg-slate-200"
              }`}
            >
              🛡️ 501–1.000 (15 🪙)
            </button>
          </div>

          {/* Search Box */}
          <div className="relative shrink-0 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-500" />
            <input
              type="text"
              placeholder="Cari user atau rank..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-2xl border-3 border-ink-900 bg-white py-2 pl-9 pr-3 text-xs md:text-sm font-bold text-ink-900 placeholder:text-ink-400 shadow-[2px_2px_0_#2B1622] focus:outline-none focus:ring-2 focus:ring-candy-400"
            />
          </div>
        </div>
      </div>

      {/* Leaderboard Table Card */}
      <div className="rounded-3xl border-4 border-ink-900 bg-white shadow-[4px_4px_0_#2B1622] overflow-hidden">
        <div className="border-b-3 border-ink-900 bg-candy-200 px-6 py-3 flex items-center justify-between text-xs font-black uppercase text-ink-800 tracking-wider">
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

        <div className="divide-y-2 divide-ink-900/10">
          {isDbLoading ? (
            <div className="p-12 flex flex-col items-center justify-center space-y-4">
              <CandyLoader size="lg" label="MENYELARASKAN DATA KLASEMEN..." />
            </div>
          ) : participants.length === 0 ? (
            <div className="p-8 text-center text-ink-600 font-bold">
              Tidak ada petualang yang cocok dengan filter.
            </div>
          ) : (
            participants.map((p) => {
              const isFirst = p.rank === 1;
              const isSecond = p.rank === 2;
              const isThird = p.rank === 3;
              const isTopThree = isFirst || isSecond || isThird;

              return (
                <div
                  key={`${p.rank}-${p.name}`}
                  id={p.isCurrentUser ? "current-user-row" : undefined}
                  className={`flex items-center justify-between px-4 sm:px-6 py-3.5 transition-colors ${
                    p.isCurrentUser
                      ? "bg-candy-100 font-black border-l-8 border-l-candy-500"
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
                        <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-ink-900 bg-amber-400 font-black text-ink-900 shadow-[1px_1px_0_#2B1622]">
                          👑 1
                        </div>
                      ) : isSecond ? (
                        <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-ink-900 bg-slate-300 font-black text-ink-900 shadow-[1px_1px_0_#2B1622]">
                          🥈 2
                        </div>
                      ) : isThird ? (
                        <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-ink-900 bg-amber-600 text-white font-black shadow-[1px_1px_0_#2B1622]">
                          🥉 3
                        </div>
                      ) : (
                        <span className="text-xs sm:text-sm font-black text-ink-700">
                          #{p.rank}
                        </span>
                      )}
                    </div>

                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border-2 border-ink-900 bg-candy-200">
                      <Mascot mood={p.avatarMood} size={32} className="h-8 w-8" />
                    </div>

                    <div className="min-w-0 truncate">
                      <div className="flex items-center gap-2">
                        <span className="text-xs sm:text-sm font-black text-ink-900 truncate">
                          @{p.name}
                        </span>
                        {p.isCurrentUser && (
                          <span className="rounded bg-candy-400 px-1 py-0.2 text-[9px] font-black uppercase text-ink-900 border border-ink-900 shrink-0">
                            Kamu
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-ink-500 font-bold block sm:hidden">
                        {p.weeklyXp} XP • {p.streak}🔥
                      </div>
                    </div>
                  </div>

                  {/* Right: Streak & XP & Reward */}
                  <div className="flex items-center gap-4 sm:gap-6 shrink-0">
                    <div className="hidden sm:flex items-center gap-1 text-xs font-bold text-orange-600 w-12 justify-center">
                      <Flame className="h-3.5 w-3.5 fill-orange-500" />
                      {p.streak}
                    </div>

                    <div className="w-16 sm:w-20 text-right text-xs sm:text-sm font-black text-ink-900">
                      {p.weeklyXp.toLocaleString("id-ID")} <span className="text-[10px] text-ink-500 font-bold">XP</span>
                    </div>

                    <div className="w-24 sm:w-28 text-right">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-xl border-2 border-ink-900 text-xs font-black shadow-[1px_1px_0_#2B1622] ${
                          isFirst
                            ? "bg-amber-300 text-ink-900"
                            : isSecond
                            ? "bg-slate-200 text-ink-900"
                            : isThird
                            ? "bg-amber-600 text-white"
                            : p.rank <= 10
                            ? "bg-candy-300 text-ink-900"
                            : p.rank <= 50
                            ? "bg-blue-100 text-blue-900"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-900/60 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-lg rounded-3xl border-4 border-ink-900 bg-white p-6 shadow-[6px_6px_0_#2B1622] space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b-2 border-ink-900 pb-3">
              <div className="flex items-center gap-2">
                <Trophy className="h-6 w-6 text-amber-500 fill-amber-400" />
                <h3 className="text-xl font-black text-ink-900">Skema Hadiah Koin (1–1.000)</h3>
              </div>
              <button
                onClick={() => setShowPrizeModal(false)}
                className="h-8 w-8 rounded-full border-2 border-ink-900 bg-candy-200 hover:bg-candy-300 flex items-center justify-center font-black text-ink-900"
              >
                ✕
              </button>
            </div>

            <p className="text-xs font-bold text-ink-700 leading-relaxed">
              Setiap reset mingguan (Senin 00:00 WIB), pemain pada peringkat 1 hingga 1.000 mendapatkan hadiah Koin langsung ke saldo petualangan yang dapat dibelanjakan untuk membeli Tiket Undian NFT di halaman Raffle!
            </p>

            <div className="space-y-2">
              {LEADERBOARD_PRIZE_TIERS.map((tier) => (
                <div
                  key={tier.id}
                  className="flex items-center justify-between p-3 rounded-2xl border-2 border-ink-900 bg-candy-50/60 shadow-[2px_2px_0_#2B1622]"
                >
                  <div className="space-y-0.5">
                    <div className="text-xs font-black text-ink-900">{tier.label}</div>
                    <div className="text-[11px] font-bold text-ink-600">{tier.description}</div>
                  </div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl border-2 border-ink-900 bg-amber-300 font-black text-xs text-ink-900 shadow-[1px_1px_0_#2B1622]">
                    <Coins className="h-3.5 w-3.5 fill-amber-500" />
                    +{tier.coins} Koin
                  </div>
                </div>
              ))}
            </div>

            <div className="rounded-2xl border-2 border-ink-900 bg-yellow-100 p-3 text-xs font-bold text-yellow-950 flex items-center gap-2">
              <HelpCircle className="h-4 w-4 shrink-0 text-yellow-700" />
              <span>Total Prize Pool Mingguan: <strong>30.150+ Koin</strong> yang didistribusikan kepada 1.000 petualang aktif!</span>
            </div>

            <button
              onClick={() => setShowPrizeModal(false)}
              className="w-full rounded-2xl border-3 border-ink-900 bg-candy-400 py-3 font-black text-ink-900 shadow-[3px_3px_0_#2B1622] transition-transform active:translate-y-0.5"
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
