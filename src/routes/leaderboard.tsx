import { useState, useMemo } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Trophy,
  Crown,
  Sparkles,
  Clock,
  Flame,
  ArrowUpRight,
  ShieldCheck,
  Coins,
  Ticket,
  Search,
  ChevronDown,
  Gift,
  CheckCircle2,
  Info,
  Layers,
  ArrowRight,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { DuoButton } from "@/components/duo-button";
import { Mascot } from "@/components/mascot";
import { useProgress } from "@/lib/store";
import { playComplete, playMoodSfx } from "@/lib/audio";
import { cn } from "@/lib/utils";
import {
  LEADERBOARD_PRIZE_TIERS,
  TOTAL_WEEKLY_PRIZE_COINS,
  getCoinRewardForRank,
  getTierForRank,
  getLeaderboardParticipants,
  type ParticipantItem,
} from "@/lib/leaderboard-prizes";

export const Route = createFileRoute("/leaderboard")({
  component: ArenaLeaderboardPage,
});

type League = "gold" | "silver" | "bronze";

const LEAGUES: Record<League, { title: string; color: string; badge: string; desc: string }> = {
  gold: {
    title: "Liga Emas",
    color: "#fbbf24",
    badge: "DIVISI TERTINGGI",
    desc: "1.000 petualang teratas berbagi pool hadiah 30.150+ Koin mingguan.",
  },
  silver: {
    title: "Liga Perak",
    color: "#94a3b8",
    badge: "DIVISI MENENGAH",
    desc: "Top 20 promosi ke Liga Emas minggu depan.",
  },
  bronze: {
    title: "Liga Perunggu",
    color: "#b45309",
    badge: "DIVISI PEMULA",
    desc: "Selesaikan 3 pelajaran untuk masuk ke zona promosi Liga Perak.",
  },
};

export function ArenaLeaderboardPage() {
  const [league, setLeague] = useState<League>("gold");
  const [selectedTier, setSelectedTier] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showPrizeModal, setShowPrizeModal] = useState(false);
  const [claimedNotice, setClaimedNotice] = useState<string | null>(null);

  const username = useProgress((s) => s.username);
  const xp = useProgress((s) => s.xp);
  const streak = useProgress((s) => s.streak);
  const gems = useProgress((s) => s.gems);
  const raffleTickets = useProgress((s) => s.raffleTickets);
  const sound = useProgress((s) => s.sound);
  const weekKey = useProgress((s) => s.weekKey || "2026-W39");
  const lastClaimedWeek = useProgress((s) => s.lastClaimedLeaderboardWeek);
  const claimWeeklyLeaderboardReward = useProgress((s) => s.claimWeeklyLeaderboardReward);

  // User's rank in this demo is #7 (Top 10)
  const userRank = 7;
  const userRewardCoins = getCoinRewardForRank(userRank);
  const hasClaimedThisWeek = lastClaimedWeek === weekKey;

  const { participants, userRankItem, totalCount } = useMemo(() => {
    return getLeaderboardParticipants(
      { username: username || "pelajar", xp, streak },
      userRank,
      100, // display up to 100 on screen, full searchable 1000
      selectedTier === "all" ? undefined : selectedTier,
      searchQuery
    );
  }, [username, xp, streak, userRank, selectedTier, searchQuery]);

  const handleClaimReward = () => {
    if (hasClaimedThisWeek) return;
    const awarded = claimWeeklyLeaderboardReward(userRank);
    if (awarded > 0) {
      if (sound) playMoodSfx("celebrate");
      setClaimedNotice(`Selamat! Kamu berhasil mengklaim +${awarded} Koin mingguan. Tukarkan dengan tiket di Raffle NFT!`);
      setTimeout(() => setClaimedNotice(null), 7000);
    }
  };

  const getRankBadge = (rank: number) => {
    if (rank === 1) return { bg: "bg-amber-400 text-ink-900 border-amber-600", text: "1" };
    if (rank === 2) return { bg: "bg-slate-300 text-ink-900 border-slate-500", text: "2" };
    if (rank === 3) return { bg: "bg-amber-700 text-white border-amber-900", text: "3" };
    if (rank <= 10) return { bg: "bg-candy-500 text-white border-candy-700", text: `${rank}` };
    if (rank <= 50) return { bg: "bg-sky-500 text-white border-sky-700", text: `${rank}` };
    if (rank <= 100) return { bg: "bg-emerald-500 text-white border-emerald-700", text: `${rank}` };
    return { bg: "bg-sand-200 text-ink-700 border-ink-900/30", text: `${rank}` };
  };

  return (
    <AppShell>
      <main className="mx-auto max-w-4xl px-3 sm:px-6 py-4 sm:py-6 pb-28">
        {/* Toast Notice */}
        {claimedNotice && (
          <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 max-w-md w-[92%] bg-emerald-500 text-white border-2 border-ink-900 rounded-2xl p-4 shadow-[4px_4px_0_#2B1622] flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-300">
            <Gift className="size-6 shrink-0 text-amber-200 animate-bounce" />
            <div className="text-xs sm:text-sm font-black flex-1 leading-snug">{claimedNotice}</div>
            <Link to="/raffle" className="shrink-0">
              <span className="px-3 py-1.5 rounded-full bg-white text-ink-900 text-xs font-black shadow-xs hover:bg-amber-100 transition-colors">
                Buka Raffle
              </span>
            </Link>
          </div>
        )}

        {/* 1. Header Card with Weekly Timer & Big Prize Announcement */}
        <div className="rounded-[24px] border-2 border-ink-900 bg-white shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_4px_0_var(--color-ink-900)] p-4 sm:p-6 mb-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b-2 border-sand-200 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-ink-900 font-mono font-black text-[11px] tracking-wide border border-ink-900">
                  {LEAGUES[league].badge}
                </span>
                <span className="text-xs font-mono font-bold text-ink-400">RESET TIAP MINGGU</span>
              </div>
              <h1 className="font-display font-black text-xl sm:text-2xl text-ink-900 mt-1 flex items-center gap-2">
                {LEAGUES[league].title} <Trophy className="size-6 text-amber-500 shrink-0" />
              </h1>
            </div>

            {/* Countdown timer */}
            <div className="flex items-center gap-2 self-start sm:self-auto bg-sand-100 border-2 border-ink-900 rounded-full px-3.5 py-1.5 shadow-[2px_2px_0_var(--color-ink-900)]">
              <Clock className="size-4 text-candy-deep" />
              <div className="font-mono text-xs font-black text-ink-800">
                Sisa Waktu: <span className="text-candy-deep">3h 14j 22m</span>
              </div>
            </div>
          </div>

          {/* Logic 1-1000 Hadiah Koin Announcement */}
          <div className="mt-4 bg-amber-50 border-2 border-amber-300/80 rounded-2xl p-3.5 sm:p-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="size-10 rounded-2xl bg-amber-400 border-2 border-ink-900 flex items-center justify-center shrink-0 shadow-[2px_2px_0_#2B1622]">
                <Coins className="size-5 text-ink-900" />
              </div>
              <div>
                <div className="font-display font-black text-sm sm:text-base text-ink-900 flex items-center gap-2">
                  <span>Peringkat 1 – 1.000 Mendapatkan Hadiah Koin!</span>
                  <span className="hidden sm:inline-block px-2 py-0.5 rounded-full bg-candy-500 text-white text-[10px] font-mono">
                    Pool 30.150+ Koin 🪙
                  </span>
                </div>
                <p className="text-xs text-ink-600 font-medium leading-relaxed mt-0.5">
                  Kumpulkan koin dari posisi klasemenmu untuk membeli tiket di fitur <strong>Raffle NFT</strong> dan menangkan NFT langka eksklusif!
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowPrizeModal(true)}
              className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border-2 border-ink-900 text-ink-900 font-display font-black text-xs shadow-[2px_2px_0_#2B1622] hover:bg-amber-100 active:translate-y-0.5 transition-all shrink-0 cursor-pointer"
            >
              <Info className="size-4 text-candy-deep" />
              <span>Rincian Hadiah (1–1.000)</span>
            </button>
          </div>
        </div>

        {/* 2. Direct Feature Link: RAFFLE NFT BANNER */}
        <Link
          to="/raffle"
          className="group block rounded-[24px] border-2 border-ink-900 bg-gradient-to-r from-candy-500 via-candy to-purple-600 text-white p-4 sm:p-5 shadow-[4px_4px_0_#2B1622] mb-4 hover:translate-x-0.5 hover:-translate-y-0.5 transition-all"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="size-12 rounded-2xl bg-white/20 border-2 border-white/50 backdrop-blur-md flex items-center justify-center shrink-0 shadow-inner group-hover:rotate-6 transition-transform">
                <Ticket className="size-7 text-amber-300" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-full bg-amber-400 text-ink-900 font-mono font-black text-[10px] tracking-wider uppercase">
                    FITUR BARU
                  </span>
                  <span className="text-xs font-mono font-black text-white/90">RAFFLE NFT BERHADIAH</span>
                </div>
                <h2 className="font-display font-black text-base sm:text-lg text-white mt-0.5">
                  Tukarkan Koin Klasemenmu Jadi Tiket NFT Langka! 🎟️
                </h2>
                <p className="text-xs text-white/85 line-clamp-1 mt-0.5">
                  Undian aktif: <strong>Genesis Blobi #001 (Mythic)</strong> · <strong>Cyber Pass Alpha</strong> · <strong>DeFi Sorcerer #88</strong>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
              <div className="px-4 py-2 rounded-full bg-white text-ink-900 font-display font-black text-xs border-2 border-ink-900 shadow-[2px_2px_0_rgba(0,0,0,0.3)] group-hover:bg-amber-300 transition-colors flex items-center gap-1.5">
                <span>Masuk ke Raffle NFT</span>
                <ArrowRight className="size-3.5 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
          </div>
        </Link>

        {/* 3. Current User Live Rank Status Bar (#7) */}
        <div className="rounded-[22px] border-2 border-ink-900 bg-white p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_3px_0_var(--color-ink-900)] mb-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="size-11 rounded-full border-2 border-ink-900 bg-candy-100 flex items-center justify-center font-display font-black text-base text-ink-900 shadow-xs shrink-0">
                #{userRank}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-display font-black text-sm sm:text-base text-ink-900 truncate">
                    @{username || "pelajar"} (Kamu)
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-candy-100 border border-candy-300 text-candy-deep font-mono font-black text-[10px]">
                    ZONA TOP 10
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs text-ink-500 font-bold mt-0.5">
                  <span>{xp} XP Minggu Ini</span>
                  <span>·</span>
                  <span className="inline-flex items-center gap-1 text-flame-shadow">
                    <Flame className="size-3.5 fill-current" /> {streak} hari
                  </span>
                </div>
              </div>
            </div>

            {/* Estimated Prize & Claim Button */}
            <div className="flex items-center gap-3 self-end sm:self-auto shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-sand-200 w-full sm:w-auto justify-between sm:justify-end">
              <div className="text-right">
                <div className="text-[10px] font-mono font-bold text-ink-400 uppercase">Estimasi Hadiahmu</div>
                <div className="font-display font-black text-sm sm:text-base text-emerald-700 flex items-center gap-1 justify-end">
                  <Coins className="size-4 text-amber-500" />
                  <span>+{userRewardCoins} Koin 🪙</span>
                </div>
              </div>

              {hasClaimedThisWeek ? (
                <div className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-50 border-2 border-emerald-500 text-emerald-800 text-xs font-black">
                  <CheckCircle2 className="size-4 text-emerald-600" />
                  <span>Klaim Sukses</span>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleClaimReward}
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-candy-500 border-2 border-ink-900 text-white font-display font-black text-xs shadow-[2px_2px_0_#2B1622] hover:bg-candy-600 active:translate-y-0.5 transition-all cursor-pointer"
                >
                  <Gift className="size-4 text-amber-200" />
                  <span>Klaim {userRewardCoins} Koin</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* 4. Filter, Search, and Category Pills for 1-1000 */}
        <div className="flex flex-col gap-2.5 mb-4">
          <div className="flex flex-col sm:flex-row gap-2 items-stretch sm:items-center justify-between">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="size-4 text-ink-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari petualang atau peringkat (1–1000)..."
                className="w-full pl-10 pr-4 py-2 rounded-xl border-2 border-ink-900 bg-white text-xs sm:text-sm font-medium placeholder:text-ink-300 focus:outline-none focus:ring-2 focus:ring-candy-500 shadow-[2px_2px_0_var(--color-ink-900)]"
              />
            </div>

            {/* Jump to me button */}
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setSelectedTier("all");
                const el = document.getElementById("current-user-row");
                if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
              }}
              className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-sand-100 border-2 border-ink-900 text-ink-800 font-display font-black text-xs shadow-[2px_2px_0_var(--color-ink-900)] hover:bg-sand-200 active:translate-y-0.5 transition-all shrink-0 cursor-pointer"
            >
              <span>📍 Posisi Saya (#{userRank})</span>
            </button>
          </div>

          {/* Tier Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
            <button
              type="button"
              onClick={() => setSelectedTier("all")}
              className={cn(
                "px-3 py-1.5 rounded-full font-display font-black whitespace-nowrap border-2 transition-all cursor-pointer",
                selectedTier === "all"
                  ? "bg-ink-900 text-white border-ink-900 shadow-xs"
                  : "bg-white text-ink-700 border-ink-900/30 hover:bg-sand-100"
              )}
            >
              Semua (Top 100)
            </button>
            <button
              type="button"
              onClick={() => setSelectedTier("tier-top10")}
              className={cn(
                "px-3 py-1.5 rounded-full font-display font-black whitespace-nowrap border-2 transition-all cursor-pointer",
                selectedTier === "tier-top10"
                  ? "bg-candy-500 text-white border-ink-900 shadow-xs"
                  : "bg-white text-candy-deep border-ink-900/30 hover:bg-sand-100"
              )}
            >
              👑 Top 10 (+200 Koin)
            </button>
            <button
              type="button"
              onClick={() => setSelectedTier("tier-top50")}
              className={cn(
                "px-3 py-1.5 rounded-full font-display font-black whitespace-nowrap border-2 transition-all cursor-pointer",
                selectedTier === "tier-top50"
                  ? "bg-sky-500 text-white border-ink-900 shadow-xs"
                  : "bg-white text-sky-700 border-ink-900/30 hover:bg-sand-100"
              )}
            >
              ⭐ Top 50 (+100 Koin)
            </button>
            <button
              type="button"
              onClick={() => setSelectedTier("tier-top100")}
              className={cn(
                "px-3 py-1.5 rounded-full font-display font-black whitespace-nowrap border-2 transition-all cursor-pointer",
                selectedTier === "tier-top100"
                  ? "bg-emerald-500 text-white border-ink-900 shadow-xs"
                  : "bg-white text-emerald-700 border-ink-900/30 hover:bg-sand-100"
              )}
            >
              🔥 Top 100 (+60 Koin)
            </button>
            <button
              type="button"
              onClick={() => setSelectedTier("tier-top500")}
              className={cn(
                "px-3 py-1.5 rounded-full font-display font-black whitespace-nowrap border-2 transition-all cursor-pointer",
                selectedTier === "tier-top500"
                  ? "bg-amber-500 text-white border-ink-900 shadow-xs"
                  : "bg-white text-amber-700 border-ink-900/30 hover:bg-sand-100"
              )}
            >
              ⚡ 251–500 (+25 Koin)
            </button>
            <button
              type="button"
              onClick={() => setSelectedTier("tier-top1000")}
              className={cn(
                "px-3 py-1.5 rounded-full font-display font-black whitespace-nowrap border-2 transition-all cursor-pointer",
                selectedTier === "tier-top1000"
                  ? "bg-slate-600 text-white border-ink-900 shadow-xs"
                  : "bg-white text-slate-700 border-ink-900/30 hover:bg-sand-100"
              )}
            >
              🛡️ 501–1.000 (+15 Koin)
            </button>
          </div>
        </div>

        {/* 5. Participants List */}
        <div className="rounded-[24px] border-2 border-ink-900 bg-white overflow-hidden shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_4px_0_var(--color-ink-900)]">
          <div className="px-4 py-3 bg-sand-100 border-b-2 border-ink-900 flex items-center justify-between text-xs font-mono font-bold text-ink-500">
            <span>PERINGKAT & PETUALANG</span>
            <div className="flex items-center gap-6">
              <span className="hidden sm:inline">STREAK & XP</span>
              <span>HADIAH KOIN 🪙</span>
            </div>
          </div>

          <div className="divide-y-2 divide-sand-100">
            {participants.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-sm font-bold text-ink-400">Tidak ada pemain yang sesuai kriteria pencarian.</p>
              </div>
            ) : (
              participants.map((user) => {
                const badge = getRankBadge(user.rank);
                const isMe = user.isCurrentUser;
                return (
                  <div
                    key={`${user.rank}-${user.name}`}
                    id={isMe ? "current-user-row" : undefined}
                    className={cn(
                      "px-3 sm:px-4 py-3 flex items-center justify-between gap-2.5 transition-colors",
                      isMe
                        ? "bg-candy-50/80 border-y-2 border-candy-300 font-bold"
                        : "hover:bg-sand-50"
                    )}
                  >
                    {/* Left: Rank & Avatar & Name */}
                    <div className="flex items-center gap-2.5 sm:gap-3.5 min-w-0 flex-1">
                      <div
                        className={cn(
                          "size-8 rounded-full border-2 flex items-center justify-center font-mono font-black text-xs shrink-0 shadow-xs",
                          badge.bg,
                          badge.text.length > 2 ? "text-[10px]" : "text-xs"
                        )}
                      >
                        {badge.text}
                      </div>

                      <div className="size-9 rounded-full border-2 border-ink-900 overflow-hidden bg-sand-200 shrink-0">
                        <Mascot mood={user.avatarMood} size={32} lite interactive={false} />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <span
                            className={cn(
                              "font-display font-black text-xs sm:text-sm truncate",
                              isMe ? "text-candy-deep" : "text-ink-900"
                            )}
                          >
                            @{user.name}
                          </span>
                          {isMe && (
                            <span className="shrink-0 px-1.5 py-0.2 rounded-full bg-candy-500 text-white font-mono font-bold text-[9px]">
                              KAMU
                            </span>
                          )}
                          {user.rank <= 3 && (
                            <Crown className="size-3.5 text-amber-500 shrink-0 fill-amber-400" />
                          )}
                        </div>

                        {/* Mobile subline for streak */}
                        <div className="flex sm:hidden items-center gap-1.5 text-[10px] text-ink-500 font-bold mt-0.5">
                          <span className="text-flame-shadow flex items-center gap-0.5">
                            <Flame className="size-3 fill-current" /> {user.streak}h
                          </span>
                          <span>·</span>
                          <span>{user.xp} XP</span>
                        </div>
                      </div>
                    </div>

                    {/* Middle: Desktop XP & Streak */}
                    <div className="hidden sm:flex items-center gap-4 text-xs font-mono font-black text-ink-700 shrink-0">
                      <span className="inline-flex items-center gap-1 text-flame-shadow w-16">
                        <Flame className="size-3.5 fill-current" /> {user.streak} hari
                      </span>
                      <span className="w-18 text-right text-ink-900 font-bold">{user.xp} XP</span>
                    </div>

                    {/* Right: Coin Reward Badge */}
                    <div className="shrink-0 pl-2">
                      <span
                        className={cn(
                          "inline-flex items-center gap-1 px-2.5 py-1 rounded-full border text-[11px] sm:text-xs font-mono font-black shadow-xs",
                          user.rank <= 3
                            ? "bg-amber-100 border-amber-400 text-amber-900"
                            : user.rank <= 10
                            ? "bg-candy-100 border-candy-300 text-candy-deep"
                            : user.rank <= 100
                            ? "bg-sky-100 border-sky-300 text-sky-900"
                            : "bg-sand-100 border-ink-900/15 text-ink-700"
                        )}
                      >
                        <Coins className="size-3 sm:size-3.5 text-amber-500" />
                        <span>+{user.rewardCoins}</span>
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* List Footer Info */}
          <div className="p-3 bg-sand-50 border-t-2 border-sand-200 text-center text-xs font-medium text-ink-500">
            Menampilkan {participants.length} dari {totalCount} petualang. Seluruh pemain peringkat 1–1.000 berhak mengklaim hadiah Koin mingguan.
          </div>
        </div>

        {/* 6. Prize Details Modal (1-1000 Tiers) */}
        {showPrizeModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-ink-900/60 backdrop-blur-xs">
            <div className="w-full max-w-lg rounded-[28px] border-2 border-ink-900 bg-white p-5 sm:p-6 shadow-[6px_6px_0_#2B1622] max-h-[90vh] flex flex-col">
              <div className="flex items-center justify-between border-b-2 border-sand-200 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="size-9 rounded-xl bg-amber-400 border-2 border-ink-900 flex items-center justify-center">
                    <Trophy className="size-5 text-ink-900" />
                  </div>
                  <div>
                    <h3 className="font-display font-black text-base sm:text-lg text-ink-900">
                      Rincian Hadiah Koin (1–1.000)
                    </h3>
                    <p className="text-[11px] text-ink-500 font-medium">Total Pool: {TOTAL_WEEKLY_PRIZE_COINS.toLocaleString("id-ID")} Koin Mingguan</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowPrizeModal(false)}
                  className="size-8 rounded-full border-2 border-ink-900 bg-sand-100 font-mono font-black text-sm flex items-center justify-center hover:bg-sand-200"
                >
                  ✕
                </button>
              </div>

              <div className="overflow-y-auto py-3 space-y-2.5 pr-1 flex-1">
                {LEADERBOARD_PRIZE_TIERS.map((tier) => (
                  <div
                    key={tier.id}
                    className="p-3 rounded-2xl border-2 border-ink-900/20 bg-sand-50 flex items-center justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-full bg-white border border-ink-900 text-[10px] font-mono font-black">
                          Peringkat {tier.minRank === tier.maxRank ? tier.minRank : `${tier.minRank}–${tier.maxRank}`}
                        </span>
                        <span className="text-xs font-display font-black text-ink-900">{tier.label}</span>
                      </div>
                      <p className="text-[11px] text-ink-500 mt-0.5">{tier.description}</p>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-100 border-2 border-amber-400 text-amber-950 font-mono font-black text-xs shadow-xs">
                        <Coins className="size-3.5 text-amber-500" />
                        <span>+{tier.coins} Koin</span>
                      </span>
                    </div>
                  </div>
                ))}

                <div className="p-3 rounded-2xl border-2 border-dashed border-ink-900/30 bg-white text-center">
                  <p className="text-xs text-ink-500 font-bold">
                    Peringkat &gt; 1.000 tetap mendapatkan 5 Koin partisipasi latihan.
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t-2 border-sand-200 flex items-center justify-between gap-2">
                <Link to="/raffle" className="w-full">
                  <button
                    type="button"
                    onClick={() => setShowPrizeModal(false)}
                    className="w-full py-2.5 rounded-xl bg-candy-500 border-2 border-ink-900 text-white font-display font-black text-xs shadow-[2px_2px_0_#2B1622] hover:bg-candy-600 transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Ticket className="size-4" />
                    <span>Gunakan Koin di Raffle NFT ➔</span>
                  </button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </main>
    </AppShell>
  );
}
