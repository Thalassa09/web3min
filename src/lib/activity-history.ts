import { todayKey } from "./time";

export interface DayRecord {
  xp: number;
  blocks: number;
}

const STORAGE_KEY = "web3min_daily_activity";

export function loadActivityHistory(): Record<string, DayRecord> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

export function saveActivityHistory(data: Record<string, DayRecord>): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // ignore quota errors
  }
}

export function recordDayActivity(dateStr: string, xpDelta: number, blockDelta = 0): void {
  const history = loadActivityHistory();
  const current = history[dateStr] || { xp: 0, blocks: 0 };
  history[dateStr] = {
    xp: Math.max(0, current.xp + xpDelta),
    blocks: Math.max(0, current.blocks + blockDelta),
  };
  saveActivityHistory(history);
}

export interface WeekDayStat {
  index: number;
  label: string;
  fullLabel: string;
  dateKey: string;
  isToday: boolean;
  isPast: boolean;
  isFuture: boolean;
  xp: number;
  blocks: number;
}

/**
 * Returns 7 days of the current week (Sunday=0 to Saturday=6).
 * Aligns with store xpToday, weeklyXp, and streak.
 */
export function getWeekDays(
  referenceDate = new Date(),
  userXpToday = 0,
  userWeeklyXp = 0,
  userStreak = 0,
  userLessonsToday = 0,
): WeekDayStat[] {
  const history = loadActivityHistory();
  const today = new Date(referenceDate);
  const currentDayOfWeek = today.getDay(); // 0 = Sun, 1 = Mon, ..., 6 = Sat

  // Sunday of current week
  const sunday = new Date(today);
  sunday.setDate(today.getDate() - currentDayOfWeek);

  const DAY_LABELS = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];
  const DAY_FULL = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];

  const days: WeekDayStat[] = [];
  let recordedWeekXp = 0;

  for (let i = 0; i < 7; i++) {
    const d = new Date(sunday);
    d.setDate(sunday.getDate() + i);
    const key = todayKey(d);
    const isToday = i === currentDayOfWeek;
    const isPast = i < currentDayOfWeek;
    const isFuture = i > currentDayOfWeek;

    let entry = history[key] || { xp: 0, blocks: 0 };
    if (isToday) {
      entry = {
        xp: Math.max(entry.xp, userXpToday),
        blocks: Math.max(entry.blocks, userLessonsToday),
      };
      if (history[key]?.xp !== entry.xp || history[key]?.blocks !== entry.blocks) {
        history[key] = entry;
        saveActivityHistory(history);
      }
    }

    days.push({
      index: i,
      label: DAY_LABELS[i],
      fullLabel: DAY_FULL[i],
      dateKey: key,
      isToday,
      isPast,
      isFuture,
      xp: isFuture ? 0 : entry.xp,
      blocks: isFuture ? 0 : entry.blocks,
    });

    if (!isFuture) {
      recordedWeekXp += entry.xp;
    }
  }

  // Gracefully reconcile if store weeklyXp has value not yet split in history
  if (userWeeklyXp > recordedWeekXp && userStreak > 1) {
    const missingXp = userWeeklyXp - recordedWeekXp;
    const activePastDays = days.filter(
      (d) => d.isPast && currentDayOfWeek - d.index < userStreak,
    );
    if (activePastDays.length > 0) {
      const perDay = Math.round(missingXp / activePastDays.length);
      activePastDays.forEach((d) => {
        d.xp = Math.max(d.xp, perDay);
        d.blocks = Math.max(d.blocks, Math.max(1, Math.round(perDay / 10)));
      });
    }
  }

  return days;
}

export interface MonthWeekStat {
  index: number;
  label: string;
  fullLabel: string;
  xp: number;
  blocks: number;
  isCurrentWeek: boolean;
}

/**
 * Returns 4 weeks of the current month.
 */
export function getMonthWeeks(
  userWeeklyXp = 0,
  userTotalXp = 0,
  userTotalBlocks = 0,
): MonthWeekStat[] {
  const now = new Date();
  const dateOfMonth = now.getDate();
  const currentWeekIdx = Math.min(3, Math.floor((dateOfMonth - 1) / 7));

  const weeks: MonthWeekStat[] = [];
  for (let i = 0; i < 4; i++) {
    const isCurrentWeek = i === currentWeekIdx;
    const isPastWeek = i < currentWeekIdx;

    let weekXp = 0;
    let weekBlocks = 0;

    if (isCurrentWeek) {
      weekXp = userWeeklyXp;
      weekBlocks = Math.round(userWeeklyXp / 10);
    } else if (isPastWeek) {
      // Estimate past weeks from total XP
      const pastRemaining = Math.max(0, userTotalXp - userWeeklyXp);
      const est = Math.min(250, Math.round(pastRemaining / Math.max(1, currentWeekIdx)));
      weekXp = est;
      weekBlocks = Math.round(est / 10);
    }

    weeks.push({
      index: i,
      label: `Mg ${i + 1}`,
      fullLabel: `Minggu ke-${i + 1}`,
      xp: weekXp,
      blocks: weekBlocks,
      isCurrentWeek,
    });
  }

  return weeks;
}
