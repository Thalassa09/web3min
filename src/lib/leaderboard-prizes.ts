export type PrizeTier = {
  id: string;
  minRank: number;
  maxRank: number;
  coins: number;
  label: string;
  badge: string;
  color: string;
  description: string;
};

export const LEADERBOARD_PRIZE_TIERS: PrizeTier[] = [
  {
    id: "tier-1",
    minRank: 1,
    maxRank: 1,
    coins: 1000,
    label: "Juara 1 (Champion)",
    badge: "🏆 Juara 1",
    color: "#FFD700",
    description: "1.000 Koin + Gelar Juara On-Chain",
  },
  {
    id: "tier-2",
    minRank: 2,
    maxRank: 2,
    coins: 600,
    label: "Juara 2 (Runner-Up)",
    badge: "🥈 Juara 2",
    color: "#C0C0C0",
    description: "600 Koin",
  },
  {
    id: "tier-3",
    minRank: 3,
    maxRank: 3,
    coins: 400,
    label: "Juara 3 (Podium)",
    badge: "🥉 Juara 3",
    color: "#CD7F32",
    description: "400 Koin",
  },
  {
    id: "tier-top10",
    minRank: 4,
    maxRank: 10,
    coins: 200,
    label: "Peringkat 4 s.d. 10 (Top 10)",
    badge: "👑 Top 10",
    color: "#E8437F",
    description: "200 Koin per pemain",
  },
  {
    id: "tier-top50",
    minRank: 11,
    maxRank: 50,
    coins: 100,
    label: "Peringkat 11 s.d. 50 (Top 50)",
    badge: "⭐ Top 50",
    color: "#3B82F6",
    description: "100 Koin per pemain",
  },
  {
    id: "tier-top100",
    minRank: 51,
    maxRank: 100,
    coins: 60,
    label: "Peringkat 51 s.d. 100 (Top 100)",
    badge: "🔥 Top 100",
    color: "#10B981",
    description: "60 Koin per pemain",
  },
  {
    id: "tier-top250",
    minRank: 101,
    maxRank: 250,
    coins: 40,
    label: "Peringkat 101 s.d. 250",
    badge: "🎖️ Elit",
    color: "#8B5CF6",
    description: "40 Koin per pemain",
  },
  {
    id: "tier-top500",
    minRank: 251,
    maxRank: 500,
    coins: 25,
    label: "Peringkat 251 s.d. 500",
    badge: "⚡ Challenger",
    color: "#F59E0B",
    description: "25 Koin per pemain",
  },
  {
    id: "tier-top1000",
    minRank: 501,
    maxRank: 1000,
    coins: 15,
    label: "Peringkat 501 s.d. 1.000",
    badge: "🛡️ Pejuang",
    color: "#64748B",
    description: "15 Koin per pemain",
  },
];

export const TOTAL_WEEKLY_PRIZE_COINS = LEADERBOARD_PRIZE_TIERS.reduce((sum, tier) => {
  const count = tier.maxRank - tier.minRank + 1;
  return sum + count * tier.coins;
}, 0); // 30,150 Koin

export function getCoinRewardForRank(rank: number): number {
  if (rank < 1) return 0;
  for (const tier of LEADERBOARD_PRIZE_TIERS) {
    if (rank >= tier.minRank && rank <= tier.maxRank) {
      return tier.coins;
    }
  }
  return 5; // Partisipasi di atas 1000 tetap dapat 5 koin
}

export function getTierForRank(rank: number): PrizeTier | null {
  return LEADERBOARD_PRIZE_TIERS.find((t) => rank >= t.minRank && rank <= t.maxRank) ?? null;
}

export interface ParticipantItem {
  rank: number;
  name: string;
  xp: number;
  weeklyXp: number;
  streak: number;
  isCurrentUser?: boolean;
  avatarMood: "proud" | "wave" | "celebrate" | "think" | "idle";
  rewardCoins: number;
}

export type DbUserLeaderboard = {
  rank?: number;
  username: string;
  xp: number;
  weekly_xp?: number;
  streak: number;
  coin_reward?: number;
};

const INDO_WEB3_HANDLES = [
  "garuda_hash", "nusantara_node", "merdeka_crypto", "kopi_blockchain", "rendang_roll",
  "batik_nft", "borobudur_dao", "komodo_swap", "bali_validator", "monas_yield",
  "wayang_zk", "gamelan_eth", "satria_defi", "surabaya_staking", "bandung_coder",
  "medan_miner", "makassar_pool", "jogja_web3", "bogor_blocks", "semarang_sol",
  "lombok_ledger", "papua_protocol", "aceh_arbitrum", "banten_base", "riau_router",
];

const CURATED_TOP = [
  { name: "satoshi_jkt", xp: 520, weeklyXp: 520, streak: 18, mood: "proud" as const },
  { name: "kripto_bunda", xp: 460, weeklyXp: 460, streak: 12, mood: "celebrate" as const },
  { name: "defi_ninja", xp: 410, weeklyXp: 410, streak: 14, mood: "proud" as const },
  { name: "hawa_sol", xp: 370, weeklyXp: 370, streak: 9, mood: "think" as const },
  { name: "bayu_eth", xp: 340, weeklyXp: 340, streak: 8, mood: "idle" as const },
  { name: "rani_web3", xp: 300, weeklyXp: 300, streak: 7, mood: "wave" as const },
  { name: "dimas_node", xp: 220, weeklyXp: 220, streak: 5, mood: "think" as const },
  { name: "alif_zk", xp: 210, weeklyXp: 210, streak: 4, mood: "idle" as const },
  { name: "cahya_l2", xp: 195, weeklyXp: 195, streak: 4, mood: "think" as const },
  { name: "budi_airdrop", xp: 180, weeklyXp: 180, streak: 3, mood: "idle" as const },
];

export function getLeaderboardParticipants(
  currentUser: { username: string; xp: number; weeklyXp?: number; streak: number },
  userRank = 7,
  limit = 100,
  filterTier?: string,
  search = "",
  dbUsers: DbUserLeaderboard[] = [],
): { participants: ParticipantItem[]; userRankItem: ParticipantItem; totalCount: number; calculatedUserRank: number } {
  const result: ParticipantItem[] = [];
  const totalRanks = 1000;

  const activeUsername = currentUser.username || "pelajar";
  const userWeeklyXp = currentUser.weeklyXp ?? currentUser.xp ?? 240;
  const userStreak = currentUser.streak || 4;

  // If dbUsers are provided from Supabase, determine user's actual rank
  let effectiveUserRank = userRank;
  if (dbUsers.length > 0) {
    const foundIdx = dbUsers.findIndex((u) => u.username.toLowerCase() === activeUsername.toLowerCase());
    if (foundIdx >= 0) {
      effectiveUserRank = foundIdx + 1;
    }
  }

  const userItem: ParticipantItem = {
    rank: effectiveUserRank,
    name: activeUsername,
    xp: currentUser.xp,
    weeklyXp: userWeeklyXp,
    streak: userStreak,
    isCurrentUser: true,
    avatarMood: "proud",
    rewardCoins: getCoinRewardForRank(effectiveUserRank),
  };

  const moods: Array<"proud" | "wave" | "celebrate" | "think" | "idle"> = [
    "proud", "wave", "celebrate", "think", "idle",
  ];

  let dbIdx = 0;
  let curatedIdx = 0;

  for (let r = 1; r <= totalRanks; r++) {
    if (r === effectiveUserRank) {
      result.push(userItem);
      continue;
    }

    // First priority: real database users
    if (dbUsers && dbIdx < dbUsers.length) {
      const dbUser = dbUsers[dbIdx++];
      if (dbUser.username.toLowerCase() === activeUsername.toLowerCase()) {
        // Skip duplicate of active user
        if (dbIdx < dbUsers.length) {
          const nextDb = dbUsers[dbIdx++];
          result.push({
            rank: r,
            name: nextDb.username,
            xp: nextDb.xp,
            weeklyXp: nextDb.weekly_xp ?? nextDb.xp,
            streak: nextDb.streak,
            isCurrentUser: false,
            avatarMood: moods[r % moods.length],
            rewardCoins: getCoinRewardForRank(r),
          });
          continue;
        }
      } else {
        result.push({
          rank: r,
          name: dbUser.username,
          xp: dbUser.xp,
          weeklyXp: dbUser.weekly_xp ?? dbUser.xp,
          streak: dbUser.streak,
          isCurrentUser: false,
          avatarMood: moods[r % moods.length],
          rewardCoins: getCoinRewardForRank(r),
        });
        continue;
      }
    }

    // Second priority: curated top participants
    if (curatedIdx < CURATED_TOP.length) {
      const top = CURATED_TOP[curatedIdx++];
      result.push({
        rank: r,
        name: top.name,
        xp: top.xp,
        weeklyXp: top.weeklyXp,
        streak: top.streak,
        isCurrentUser: false,
        avatarMood: top.mood,
        rewardCoins: getCoinRewardForRank(r),
      });
      continue;
    }

    // Third: Algorithmic curve down to rank 1000
    const ratio = (r - 15) / (totalRanks - 15);
    const xpBase = Math.round(140 * Math.exp(-ratio * 2.2) + 15 + ((r * 7) % 11));
    const streakVal = Math.max(1, Math.round(5 * (1 - ratio) + ((r * 3) % 2)));
    const handleName = `${INDO_WEB3_HANDLES[r % INDO_WEB3_HANDLES.length]}_${(r * 13) % 99}`;

    result.push({
      rank: r,
      name: handleName,
      xp: xpBase,
      weeklyXp: xpBase,
      streak: streakVal,
      isCurrentUser: false,
      avatarMood: moods[r % moods.length],
      rewardCoins: getCoinRewardForRank(r),
    });
  }

  // Filters
  let filtered = result;
  if (filterTier) {
    const tier = LEADERBOARD_PRIZE_TIERS.find((t) => t.id === filterTier);
    if (tier) {
      filtered = filtered.filter((p) => p.rank >= tier.minRank && p.rank <= tier.maxRank);
    }
  }

  if (search.trim()) {
    const q = search.toLowerCase().trim();
    filtered = filtered.filter((p) => p.name.toLowerCase().includes(q) || String(p.rank) === q);
  }

  return {
    participants: filtered.slice(0, limit),
    userRankItem: userItem,
    totalCount: filtered.length,
    calculatedUserRank: effectiveUserRank,
  };
}
