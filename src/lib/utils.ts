import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function todayKey(date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function weekId(date = new Date()): string {
  const tmp = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const day = tmp.getUTCDay() || 7;
  tmp.setUTCDate(tmp.getUTCDate() + 4 - day);
  const yearStart = new Date(Date.UTC(tmp.getUTCFullYear(), 0, 1));
  const week = Math.ceil(((tmp.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
  return `${tmp.getUTCFullYear()}-W${String(week).padStart(2, "0")}`;
}

export function yesterdayKey(date = new Date()): string {
  const y = new Date(date);
  y.setDate(y.getDate() - 1);
  return todayKey(y);
}

export function daysBetween(dateStrA: string, dateStrB: string): number {
  if (!dateStrA || !dateStrB) return 9999;
  try {
    const t1 = new Date(dateStrA + "T00:00:00Z").getTime();
    const t2 = new Date(dateStrB + "T00:00:00Z").getTime();
    if (!Number.isFinite(t1) || !Number.isFinite(t2)) return 9999;
    return Math.round((t2 - t1) / (24 * 60 * 60 * 1000));
  } catch {
    return 9999;
  }
}

export function shuffle<T>(items: T[]): T[] {
  const next = [...items];
  for (let i = next.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const a = next[i];
    const b = next[j];
    if (a === undefined || b === undefined) continue;
    next[i] = b;
    next[j] = a;
  }
  return next;
}
