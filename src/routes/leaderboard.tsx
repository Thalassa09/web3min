import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Trophy, Crown, Sparkles, Clock, Flame, ArrowUpRight, ShieldCheck } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { DuoButton } from "@/components/duo-button";
import { useProgress } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/leaderboard")({
  component: ArenaLeaderboardPage,
});

type League = "gold" | "silver" | "bronze";

interface LeaderboardUser {
  rank: number;
  name: string;
  xp: number;
  streak: number;
  isCurrentUser?: boolean;
  avatarMood: "proud" | "happy" | "reading" | "idle";
}

const MOCK_LEAGUES: Record<League, { title: string; desc: string; cutoff: number; participants: LeaderboardUser[] }> = {
  gold: {
    title: "Liga Emas",
    desc: "10 besar bertahan di Liga Emas dan berbagi pool 500 Bintang.",
    cutoff: 10,
    participants: [
      { rank: 1, name: "satoshi_jkt", xp: 480, streak: 14, avatarMood: "proud" },
      { rank: 2, name: "kripto_bunda", xp: 420, streak: 9, avatarMood: "happy" },
      { rank: 3, name: "defi_ninja", xp: 390, streak: 12, avatarMood: "proud" },
      { rank: 4, name: "hawa_sol", xp: 340, streak: 7, avatarMood: "reading" },
      { rank: 5, name: "bayu_eth", xp: 310, streak: 6, avatarMood: "idle" },
      { rank: 6, name: "rani_web3", xp: 270, streak: 5, avatarMood: "happy" },
      { rank: 7, name: "pelajar", xp: 240, streak: 4, isCurrentUser: true, avatarMood: "proud" },
      { rank: 8, name: "dimas_node", xp: 220, streak: 3, avatarMood: "reading" },
      { rank: 9, name: "alif_zk", xp: 190, streak: 2, avatarMood: "idle" },
      { rank: 10, name: "cahya_l2", xp: 180, streak: 2, avatarMood: "reading" },
      { rank: 11, name: "budi_airdrop", xp: 140, streak: 1, avatarMood: "idle" },
      { rank: 12, name: "eko_miner", xp: 110, streak: 1, avatarMood: "idle" },
    ],
  },
  silver: {
    title: "Liga Perak",
    desc: "Top 5 promosi ke Liga Emas minggu depan.",
    cutoff: 5,
    participants: [
      { rank: 1, name: "andre_btc", xp: 320, streak: 5, avatarMood: "proud" },
      { rank: 2, name: "citra_nft", xp: 290, streak: 4, avatarMood: "happy" },
      { rank: 3, name: "fajar_dao", xp: 260, streak: 3, avatarMood: "reading" },
      { rank: 4, name: "maya_web3", xp: 230, streak: 3, avatarMood: "idle" },
      { rank: 5, name: "kevin_sol", xp: 200, streak: 2, avatarMood: "happy" },
    ],
  },
  bronze: {
    title: "Liga Perunggu",
    desc: "Top 5 promosi ke Liga Perak minggu depan.",
    cutoff: 5,
    participants: [
      { rank: 1, name: " pemula_ganteng", xp: 180, streak: 2, avatarMood: "happy" },
      { rank: 2, name: "zaki_crypto", xp: 150, streak: 2, avatarMood: "proud" },
      { rank: 3, name: "rudi_token", xp: 120, streak: 1, avatarMood: "idle" },
    ],
  },
};

export function ArenaLeaderboardPage() {
  const [league, setLeague] = useState<League>("gold");
  const currentUsername = useProgress((s) => s.username) || "pelajar";
  const userXp = useProgress((s) => s.xp);
  const userStreak = useProgress((s) => s.streak);

  const activeData = MOCK_LEAGUES[league];
  const participants = activeData.participants.map((p) => {
    if (p.isCurrentUser) {
      return {
        ...p,
        name: currentUsername,
        xp: Math.max(p.xp, userXp),
        streak: Math.max(p.streak, userStreak),
      };
    }
    return p;
  });

  return (
    <AppShell>
      <div className="mx-auto max-w-2xl px-4 py-6 sm:px-6">
        {/* Header Banner */}
        <div className="relative overflow-hidden rounded-xl border-2 border-ink-900 bg-white p-5 shadow-ink sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="inline-flex items-center gap-1.5 rounded-sm border border-ink-900 bg-coin px-2.5 py-0.5 text-xs font-extrabold text-ink-900">
                <Trophy className="size-3.5" />
                <span>Arena Belajar Mingguan</span>
              </div>
              <h1 className="mt-2 font-display text-2xl font-bold tracking-tight text-ink-900 sm:text-3xl">
                Klasemen Mingguan
              </h1>
              <p className="mt-1 text-xs text-ink-500 sm:text-sm">
                Raih XP dari pelajaran dan kuis. Top 10 Liga Emas berbagi pool hadiah <span className="font-extrabold text-ink-900">500 Bintang</span>.
              </p>
            </div>

            <div className="flex items-center gap-2 rounded-lg border-2 border-ink-900 bg-canvas p-3 text-xs font-bold text-ink-700 shadow-ink-xs sm:flex-col sm:items-start">
              <span className="flex items-center gap-1 text-ink-500">
                <Clock className="size-3.5 text-coin" />
                <span>Reset Mingguan:</span>
              </span>
              <span className="font-mono text-sm font-extrabold text-ink-900">3h 14j 22m</span>
            </div>
          </div>

          {/* League Tabs */}
          <div className="mt-6 flex gap-2 border-t-2 border-line pt-4">
            {(["gold", "silver", "bronze"] as League[]).map((tab) => {
              const active = league === tab;
              const names: Record<League, string> = {
                gold: "Liga Emas",
                silver: "Liga Perak",
                bronze: "Liga Perunggu",
              };
              return (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setLeague(tab)}
                  className={cn(
                    "flex-1 rounded-md border-2 px-3 py-2 text-xs font-extrabold transition-all duration-150 sm:text-sm",
                    active
                      ? "border-ink-900 bg-coin text-ink-900 shadow-ink-sm"
                      : "border-transparent bg-canvas text-ink-500 hover:border-line hover:text-ink-900",
                  )}
                >
                  {names[tab]}
                </button>
              );
            })}
          </div>
        </div>

        {/* User Status Bar */}
        <div className="mt-4 flex items-center justify-between rounded-lg border-2 border-ink-900 bg-blobi-soft p-4 shadow-ink-sm">
          <div className="flex items-center gap-3">
            <span className="grid size-9 place-items-center rounded-md border-2 border-ink-900 bg-white font-mono text-sm font-black text-ink-900 shadow-ink-xs">
              #7
            </span>
            <div>
              <div className="text-xs font-bold text-ink-500">Posisi Kamu Minggu Ini</div>
              <div className="font-display text-base font-bold text-ink-900">@{currentUsername}</div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="flex items-center gap-1 text-xs font-extrabold text-ink-900">
                <Sparkles className="size-3.5 text-leaf" />
                <span>{Math.max(240, userXp)} XP</span>
              </div>
              <div className="text-[11px] font-bold text-leaf-shadow">Zona Promosi</div>
            </div>
            <Link to="/">
              <DuoButton variant="primary" size="sm">
                Kejar XP <ArrowUpRight className="size-3.5" />
              </DuoButton>
            </Link>
          </div>
        </div>

        {/* Participants Table */}
        <div className="mt-6 overflow-hidden rounded-xl border-2 border-ink-900 bg-white shadow-ink">
          <div className="border-b-2 border-ink-900 bg-canvas px-4 py-3 text-xs font-bold text-ink-500">
            {activeData.desc}
          </div>

          <ul className="divide-y-2 divide-line">
            {participants.map((user) => {
              const isPromoted = user.rank <= activeData.cutoff;
              const isTopThree = user.rank <= 3;

              return (
                <li
                  key={user.rank}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 transition-colors",
                    user.isCurrentUser ? "bg-blobi-soft/60" : "hover:bg-canvas/50",
                  )}
                >
                  <span
                    className={cn(
                      "grid size-8 shrink-0 place-items-center rounded-md border-2 font-mono text-xs font-extrabold shadow-ink-xs",
                      user.rank === 1
                        ? "border-ink-900 bg-coin text-ink-900"
                        : user.rank === 2
                          ? "border-ink-900 bg-white text-ink-700"
                          : user.rank === 3
                            ? "border-ink-900 bg-sand text-ink-900"
                            : "border-line bg-canvas text-ink-500",
                    )}
                  >
                    {isTopThree ? <Crown className="size-4" /> : user.rank}
                  </span>

                  <span className="grid size-9 shrink-0 place-items-center rounded-md border-2 border-ink-900 bg-canvas overflow-hidden">
                    <img src="/mascot/idle.png" alt="" className="size-7 pixelated object-contain" />
                  </span>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="truncate font-sans text-sm font-extrabold text-ink-900">
                        @{user.name}
                      </span>
                      {user.isCurrentUser && (
                        <span className="rounded-sm border border-ink-900 bg-blobi px-1.5 py-0.2 text-[10px] font-black text-white">
                          Kamu
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-[11px] font-bold text-ink-500">
                      <span className="flex items-center gap-0.5">
                        <Flame className="size-3 text-flame" />
                        {user.streak} hari
                      </span>
                      {isPromoted ? (
                        <span className="flex items-center gap-0.5 text-leaf">
                          <ShieldCheck className="size-3" /> Promosi
                        </span>
                      ) : (
                        <span className="text-ink-300">Aman</span>
                      )}
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="font-mono text-sm font-extrabold text-ink-900">{user.xp}</span>
                    <span className="ml-1 text-[11px] font-bold text-ink-500">XP</span>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </AppShell>
  );
}
