export type QuestId = "xp" | "lesson" | "perfect" | "kisah";

export type QuestDef = {
  id: QuestId;
  label: string;
  hint: string;
  gems: number;
};

export const QUESTS: QuestDef[] = [
  { id: "lesson", label: "Selesaikan 1 pelajaran", hint: "yang baru, bukan ulang", gems: 3 },
  { id: "xp", label: "Raih target XP hari ini", hint: "target harian", gems: 5 },
  { id: "perfect", label: "Skor sempurna di 1 kuis", hint: "tanpa kehilangan nyawa", gems: 5 },
  { id: "kisah", label: "Baca 1 Kisah", hint: "tidak memakai nyawa", gems: 4 },
];

export function questProgress(
  id: QuestId,
  s: {
    xpToday: number;
    dailyGoal: number;
    lessonsToday: number;
    perfectToday: number;
    storiesToday: number;
  },
): { have: number; need: number; done: boolean } {
  if (id === "xp") return { have: s.xpToday, need: s.dailyGoal, done: s.xpToday >= s.dailyGoal };
  if (id === "lesson") return { have: Math.min(1, s.lessonsToday), need: 1, done: s.lessonsToday >= 1 };
  if (id === "kisah") return { have: Math.min(1, s.storiesToday), need: 1, done: s.storiesToday >= 1 };
  return { have: Math.min(1, s.perfectToday), need: 1, done: s.perfectToday >= 1 };
}

export type LeagueId = "perunggu" | "perak" | "emas" | "berlian";

export function leagueOf(weeklyXp: number): { id: LeagueId; name: string; next: number | null } {
  if (weeklyXp >= 220) return { id: "berlian", name: "Liga Berlian", next: null };
  if (weeklyXp >= 120) return { id: "emas", name: "Liga Emas", next: 220 };
  if (weeklyXp >= 50) return { id: "perak", name: "Liga Perak", next: 120 };
  return { id: "perunggu", name: "Liga Perunggu", next: 50 };
}
