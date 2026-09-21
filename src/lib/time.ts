export const APP_TZ = "Asia/Jakarta";
export const APP_TZ_OFFSET_MS = 7 * 60 * 60 * 1000;

/** Tanggal "YYYY-MM-DD" menurut Asia/Jakarta, bukan jam perangkat. */
export function todayKey(now: number | Date = Date.now()): string {
  const ms = typeof now === "number" ? now : now.getTime();
  return new Date(ms + APP_TZ_OFFSET_MS).toISOString().slice(0, 10);
}

export function yesterdayKey(now: number | Date = Date.now()): string {
  const ms = typeof now === "number" ? now : now.getTime();
  return todayKey(ms - 86_400_000);
}

/** Selisih hari kalender antara dua kunci "YYYY-MM-DD". */
export function daysBetween(a: string, b: string): number {
  if (!a || !b) return 9999;
  const t1 = Date.parse(`${a}T00:00:00Z`);
  const t2 = Date.parse(`${b}T00:00:00Z`);
  if (!Number.isFinite(t1) || !Number.isFinite(t2)) return 9999;
  return Math.round((t2 - t1) / 86_400_000);
}

/** Awal hari Jakarta berikutnya, dalam epoch ms. Untuk countdown reset harian. */
export function nextResetAt(now = Date.now()): number {
  const shifted = now + APP_TZ_OFFSET_MS;
  const startOfDay = Math.floor(shifted / 86_400_000) * 86_400_000;
  return startOfDay + 86_400_000 - APP_TZ_OFFSET_MS;
}

/** ISO week berbasis Jakarta. Perbaikan dari weekId lama yang mencampur lokal dan UTC. */
export function weekId(now: number | Date = Date.now()): string {
  const ms = typeof now === "number" ? now : now.getTime();
  const d = new Date(ms + APP_TZ_OFFSET_MS);
  const tmp = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
  const day = tmp.getUTCDay() || 7;
  tmp.setUTCDate(tmp.getUTCDate() + 4 - day);
  const yearStart = Date.UTC(tmp.getUTCFullYear(), 0, 1);
  const week = Math.ceil(((tmp.getTime() - yearStart) / 86_400_000 + 1) / 7);
  return `${tmp.getUTCFullYear()}-W${String(week).padStart(2, "0")}`;
}

/** Format tanggal / waktu tampilan dengan zona waktu Asia/Jakarta (WIB). */
export function formatWIB(
  date: number | Date | string,
  options: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  },
): string {
  const d = typeof date === "string" || typeof date === "number" ? new Date(date) : date;
  return `${new Intl.DateTimeFormat("id-ID", {
    timeZone: APP_TZ,
    ...options,
  }).format(d)} WIB`;
}
