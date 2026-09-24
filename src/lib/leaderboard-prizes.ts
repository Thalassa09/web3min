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
    badge: "Juara 1",
    color: "#FFD700",
    description: "1.000 Koin + Gelar Juara",
  },
  {
    id: "tier-2",
    minRank: 2,
    maxRank: 2,
    coins: 600,
    label: "Juara 2 (Runner-Up)",
    badge: "Juara 2",
    color: "#C0C0C0",
    description: "600 Koin",
  },
  {
    id: "tier-3",
    minRank: 3,
    maxRank: 3,
    coins: 400,
    label: "Juara 3 (Podium)",
    badge: "Juara 3",
    color: "#CD7F32",
    description: "400 Koin",
  },
  {
    id: "tier-top10",
    minRank: 4,
    maxRank: 10,
    coins: 200,
    label: "Peringkat 4 s.d. 10 (Top 10)",
    badge: "Top 10",
    color: "#E8437F",
    description: "200 Koin per petualang",
  },
  {
    id: "tier-top50",
    minRank: 11,
    maxRank: 50,
    coins: 100,
    label: "Peringkat 11 s.d. 50 (Top 50)",
    badge: "Top 50",
    color: "#3B82F6",
    description: "100 Koin per petualang",
  },
  {
    id: "tier-top100",
    minRank: 51,
    maxRank: 100,
    coins: 60,
    label: "Peringkat 51 s.d. 100 (Top 100)",
    badge: "Top 100",
    color: "#10B981",
    description: "60 Koin per petualang",
  },
  {
    id: "tier-top250",
    minRank: 101,
    maxRank: 250,
    coins: 40,
    label: "Peringkat 101 s.d. 250",
    badge: "Elit",
    color: "#8B5CF6",
    description: "40 Koin per petualang",
  },
  {
    id: "tier-top500",
    minRank: 251,
    maxRank: 500,
    coins: 25,
    label: "Peringkat 251 s.d. 500",
    badge: "Challenger",
    color: "#F59E0B",
    description: "25 Koin per petualang",
  },
  {
    id: "tier-top1000",
    minRank: 501,
    maxRank: 1000,
    coins: 15,
    label: "Peringkat 501 s.d. 1.000",
    badge: "Pejuang",
    color: "#64748B",
    description: "15 Koin per petualang",
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
  return 5;
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
  username_censored?: boolean;
  xp: number;
  weekly_xp?: number;
  streak: number;
  coin_reward?: number;
};

const MOODS: Array<"proud" | "wave" | "celebrate" | "think" | "idle"> = [
  "proud", "wave", "celebrate", "think", "idle",
];

export function getLeaderboardParticipants(
  currentUser: { username: string; xp: number; weeklyXp?: number; streak: number },
  userRank = 1,
  limit = 100,
  filterTier?: string,
  search = "",
  dbUsers: DbUserLeaderboard[] = [],
  realTotalUsers = 0,
): { participants: ParticipantItem[]; userRankItem: ParticipantItem; totalCount: number; calculatedUserRank: number } {
  const activeUsername = currentUser.username || "pelajar";
  const userWeeklyXp = currentUser.weeklyXp ?? currentUser.xp ?? 0;
  const userStreak = currentUser.streak || 0;

  // Build unified list of real participants
  type RawEntry = {
    username: string;
    xp: number;
    weeklyXp: number;
    streak: number;
    isCurrentUser: boolean;
  };

  const pool: RawEntry[] = [];
  let userInDb = false;

  for (const u of dbUsers) {
    const isMe = u.username.toLowerCase() === activeUsername.toLowerCase();
    if (isMe) userInDb = true;
    pool.push({
      username: u.username,
      xp: isMe ? Math.max(u.xp, currentUser.xp) : u.xp,
      weeklyXp: isMe ? Math.max(u.weekly_xp ?? u.xp, userWeeklyXp) : (u.weekly_xp ?? u.xp),
      streak: isMe ? Math.max(u.streak, userStreak) : u.streak,
      isCurrentUser: isMe,
    });
  }

  // If current user is not in dbUsers, add to pool
  if (!userInDb) {
    pool.push({
      username: activeUsername,
      xp: currentUser.xp,
      weeklyXp: userWeeklyXp,
      streak: userStreak,
      isCurrentUser: true,
    });
  }

  // STRICT GLOBAL SORT: weeklyXp DESC, then total xp DESC, then username ASC
  pool.sort((a, b) => {
    if (b.weeklyXp !== a.weeklyXp) {
      return b.weeklyXp - a.weeklyXp;
    }
    if (b.xp !== a.xp) {
      return b.xp - a.xp;
    }
    return a.username.localeCompare(b.username);
  });

  // Assign ranks & build participant items
  let calculatedUserRank = 1;
  let userRankItem: ParticipantItem | null = null;
  const allRanked: ParticipantItem[] = [];

  for (let i = 0; i < pool.length; i++) {
    const rank = i + 1;
    const entry = pool[i];
    const rewardCoins = getCoinRewardForRank(rank);
    const item: ParticipantItem = {
      rank,
      name: entry.username,
      xp: entry.xp,
      weeklyXp: entry.weeklyXp,
      streak: entry.streak,
      isCurrentUser: entry.isCurrentUser,
      avatarMood: MOODS[i % MOODS.length],
      rewardCoins,
    };
    allRanked.push(item);

    if (entry.isCurrentUser) {
      calculatedUserRank = rank;
      userRankItem = item;
    }
  }

  if (!userRankItem) {
    userRankItem = {
      rank: calculatedUserRank,
      name: activeUsername,
      xp: currentUser.xp,
      weeklyXp: userWeeklyXp,
      streak: userStreak,
      isCurrentUser: true,
      avatarMood: "proud",
      rewardCoins: getCoinRewardForRank(calculatedUserRank),
    };
  }

  const effectiveTotalCount = Math.max(pool.length, realTotalUsers);

  // Apply search & tier filtering
  let filtered = allRanked;

  if (search.trim()) {
    const q = search.trim().toLowerCase();
    filtered = filtered.filter((p) => p.name.toLowerCase().includes(q));
  }

  if (filterTier) {
    const tier = LEADERBOARD_PRIZE_TIERS.find((t) => t.id === filterTier);
    if (tier) {
      filtered = filtered.filter((p) => p.rank >= tier.minRank && p.rank <= tier.maxRank);
    }
  }

  return {
    participants: filtered.slice(0, limit),
    userRankItem,
    totalCount: effectiveTotalCount,
    calculatedUserRank,
  };
}
