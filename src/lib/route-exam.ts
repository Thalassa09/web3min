/**
 * "Ujian Rute": latihan opsional 15 soal di akhir tiap rute (Fase 3).
 *
 * KENAPA TANPA HADIAH: aturan ekonomi (XP/koin/nyawa) tidak boleh berubah, dan
 * menambah sumber XP baru berarti mengubahnya. Jadi ujian ini murni latihan:
 * selesai atau tidak, XP/koin tetap nol, dan pemanggilnya tidak pernah memanggil
 * `complete_lesson`. Nyawa tetap memakai aturan yang sudah ada (berkurang pada
 * kesalahan pertama per soal), karena itu aturan lama yang tidak diubah.
 *
 * Modul ini hanya memakai impor tipe dari kurikulum (dihapus saat build) dan
 * fungsi murni dari `quiz-ops`, jadi bisa dites `node --test` polos.
 */
import type { Exercise, Lesson, Unit } from "./curriculum.ts";
import { pickSessionItems, mulberry32, type QuizItem } from "./quiz-ops.ts";

export const ROUTE_EXAM_SIZE = 15;
export const ROUTE_EXAM_ID_PREFIX = "exam:";

export function routeExamId(unitId: string): string {
  return `${ROUTE_EXAM_ID_PREFIX}${unitId}`;
}

export function isRouteExamId(lessonId: string): boolean {
  return lessonId.startsWith(ROUTE_EXAM_ID_PREFIX);
}

/**
 * Seed ujian yang STABIL untuk satu rute.
 *
 * Wajib stabil: kalau seed berubah tiap render, objek lesson-nya ikut berubah
 * dan `useMemo`/`useEffect` di player berputar tanpa henti. Stabil juga berarti
 * sesi ujian yang tersimpan selalu bisa dilanjutkan di soal yang sama.
 */
export function examSeedFor(unitId: string): number {
  let hash = 2166136261;
  for (let i = 0; i < unitId.length; i++) {
    hash ^= unitId.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

export function unitIdOfRouteExam(lessonId: string): string | null {
  if (!isRouteExamId(lessonId)) return null;
  const unitId = lessonId.slice(ROUTE_EXAM_ID_PREFIX.length);
  return unitId || null;
}

/** Gabungkan bank soal beberapa blok, buang duplikat dan kartu materi. */
export function examPool(pools: readonly (readonly Exercise[])[]): Exercise[] {
  const seen = new Set<string>();
  const out: Exercise[] = [];
  for (const pool of pools) {
    for (const ex of pool) {
      if (ex.type === "tip") continue;
      if (seen.has(ex.id)) continue;
      seen.add(ex.id);
      out.push(ex);
    }
  }
  return out;
}

/**
 * Susun blok ujian untuk satu rute.
 *
 * Semua soal diambil dari bank blok yang SUDAH ADA di rute itu (termasuk soal
 * tambahan Fase 3), lalu disampel 15 soal dengan komposisi tipe seimbang dan
 * plafon Benar/Salah yang sama seperti sesi biasa. Kalau bank rutenya lebih
 * kecil dari 15, seluruh bank dipakai.
 */
export function buildRouteExamLesson(unit: Unit, seed: number = examSeedFor(unit.id)): Lesson | null {
  const source = unit.lessons.filter((l) => l.kind !== "chest");
  const pool = examPool(source.map((l) => l.exercises));
  if (!pool.length) return null;

  const items: QuizItem[] = pool.map((ex) => ({ id: ex.id, type: ex.type }));
  const picked = pickSessionItems(items, ROUTE_EXAM_SIZE, mulberry32(seed));
  const order = new Map(picked.map((p, i) => [p.id, i]));
  const exercises = pool
    .filter((ex) => order.has(ex.id))
    .sort((a, b) => (order.get(a.id) ?? 0) - (order.get(b.id) ?? 0));

  return {
    id: routeExamId(unit.id),
    unitId: unit.id,
    kind: "lesson",
    title: `Ujian Rute ${unit.index}`,
    blurb: "Latihan campuran satu rute. Tanpa XP dan tanpa koin, cuma buat cek pemahaman.",
    icon: "flag",
    xp: 0,
    gems: 0,
    exercises,
  };
}
