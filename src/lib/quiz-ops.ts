/**
 * Mekanik kuis web3min: bank soal, sesi acak ber-seed, dan aturan nyawa.
 *
 * Modul ini SENGAJA murni — tanpa impor runtime, tanpa alias `@/` — supaya bisa
 * diuji `node --test` polos (pola sama dengan `dao-core.ts`). Semua efek samping
 * (localStorage, nyawa, RPC) hidup di pemanggilnya: `quiz-session-store.ts` dan
 * `components/lesson/player.tsx`.
 *
 * Aturan yang dikunci di sini:
 * 1. Nyawa hanya berkurang pada kesalahan PERTAMA per soal (`heartSpent`).
 * 2. Soal yang salah diulang SEKALI di akhir antrean (`retried`).
 * 3. Sesi memakai seed per sesi, jadi susunan soal stabil saat di-resume.
 * 4. Benar/Salah maksimal 25% per sesi (berlaku saat bank lebih besar dari N).
 * 5. Tip SELALU ikut tampil; yang disampel hanya soal bernilai (scored).
 * 6. Sesi tidak pernah menyimpan XP/koin, hanya id soal + posisi.
 */

export const TF_CAP_RATIO = 0.25;
export const REVIEW_MIX = 2;
export const SESSION_VERSION = 1;

/** Sasaran jumlah soal per sesi. Fase 3 yang mengubah angka ini per rute. */
export const DEFAULT_TARGET: Record<string, number> = {
  lesson: 6,
  checkpoint: 99,
};

export type QuizItem = { id: string; type: string };

/** RNG deterministik (mulberry32). Satu seed = satu urutan soal. */
export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function seededShuffle<T>(items: readonly T[], rng: () => number): T[] {
  const next = [...items];
  for (let i = next.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    const a = next[i];
    const b = next[j];
    if (a === undefined || b === undefined) continue;
    next[i] = b;
    next[j] = a;
  }
  return next;
}

export function makeSeed(now: number, salt: number): number {
  const mix = Math.floor(Math.abs(Math.sin(now + salt) * 0xffffff));
  return (now ^ mix) >>> 0;
}

export function maxTfForSession(size: number): number {
  if (!Number.isFinite(size) || size <= 0) return 0;
  return Math.floor(size * TF_CAP_RATIO);
}

export function countTypes(items: readonly QuizItem[]): Record<string, number> {
  const out: Record<string, number> = {};
  for (const it of items) out[it.type] = (out[it.type] ?? 0) + 1;
  return out;
}

/**
 * Bagi kuota tiap tipe secara proporsional (largest remainder), dengan plafon
 * Benar/Salah. Sisa kuota TIDAK pernah dipindah ke tf di atas plafon: lebih baik
 * sesi lebih pendek daripada rasio Benar/Salah jebol.
 */
export function allocateQuota(
  counts: Record<string, number>,
  target: number,
  tfCap: number,
): Record<string, number> {
  const quota: Record<string, number> = {};
  for (const key of Object.keys(counts)) quota[key] = 0;
  if (target <= 0) return quota;

  const tfAvail = counts.tf ?? 0;
  quota.tf = Math.min(tfAvail, Math.max(0, Math.min(tfCap, target)));

  let remaining = target - (quota.tf ?? 0);
  const others = Object.keys(counts).filter((k) => k !== "tf" && (counts[k] ?? 0) > 0);
  const otherTotal = others.reduce((sum, k) => sum + (counts[k] ?? 0), 0);

  // Bank isinya cuma Benar/Salah: plafon tidak bisa ditegakkan tanpa mengosongkan
  // sesi, jadi seluruh target diisi tf (kasus ini dijaga `pickSessionItems`).
  if (otherTotal === 0) {
    quota.tf = Math.min(tfAvail, target);
    return quota;
  }

  const rows = others.map((k) => ({ k, exact: ((counts[k] ?? 0) / otherTotal) * remaining }));
  let used = 0;
  for (const row of rows) {
    const take = Math.min(counts[row.k] ?? 0, Math.floor(row.exact));
    quota[row.k] = take;
    used += take;
  }
  const order = [...rows].sort((a, b) => b.exact % 1 - (a.exact % 1));
  let left = remaining - used;
  while (left > 0) {
    let progressed = false;
    for (const row of order) {
      if (left <= 0) break;
      if ((quota[row.k] ?? 0) < (counts[row.k] ?? 0)) {
        quota[row.k] = (quota[row.k] ?? 0) + 1;
        left -= 1;
        progressed = true;
      }
    }
    if (!progressed) break;
  }
  return quota;
}

/**
 * Sampel N soal dari bank blok. Bila bank tidak lebih besar dari N, semua soal
 * dipakai (urutan tetap diacak) supaya tidak ada materi yang hilang.
 */
export function pickSessionItems<T extends QuizItem>(
  pool: readonly T[],
  target: number,
  rng: () => number,
  tfCap: number = maxTfForSession(target),
): T[] {
  if (pool.length <= target) return seededShuffle(pool, rng);
  const quota = allocateQuota(countTypes(pool), target, tfCap);
  const byType = new Map<string, T[]>();
  for (const item of pool) {
    const bucket = byType.get(item.type) ?? [];
    bucket.push(item);
    byType.set(item.type, bucket);
  }
  const picked: T[] = [];
  for (const [type, bucket] of byType) {
    const want = quota[type] ?? 0;
    if (want <= 0) continue;
    picked.push(...seededShuffle(bucket, rng).slice(0, want));
  }
  return seededShuffle(picked, rng);
}

/** Sisipkan soal review di tengah antrean (bukan di awal/akhir) supaya "campuran". */
export function spreadReview(baseIds: readonly string[], reviewIds: readonly string[]): string[] {
  if (!reviewIds.length) return [...baseIds];
  const out = [...baseIds];
  const step = out.length / (reviewIds.length + 1);
  reviewIds.forEach((id, i) => {
    const at = Math.min(out.length, Math.max(1, Math.round(step * (i + 1)) + i));
    out.splice(at, 0, id);
  });
  return out;
}

/**
 * Susun antrean satu sesi.
 * - Tip selalu ikut, urutan aslinya dipertahankan.
 * - N = total soal sesi (termasuk soal review), sesuai permintaan Fase 2.
 * - Soal review diambil dari blok sebelumnya yang pernah salah; kalau datanya
 *   tidak ada, `reviewItems` kosong dan sesi lanjut tanpa review.
 */
export function planQueue(
  exercises: readonly QuizItem[],
  target: number,
  reviewItems: readonly QuizItem[],
  seed: number,
): { ids: string[]; review: string[] } {
  const rng = mulberry32(seed);
  const scored = exercises.filter((ex) => ex.type !== "tip");
  const reviewIds = [...new Set(reviewItems.map((r) => r.id))];
  const reviewTf = reviewItems.filter((r) => r.type === "tf").length;
  const sessionSize = Math.max(target, reviewIds.length);
  const budget = Math.max(0, target - reviewIds.length);
  const tfBudget = Math.max(0, maxTfForSession(sessionSize) - reviewTf);

  const picked = pickSessionItems(scored, budget, rng, tfBudget);
  const pickedIds = new Set(picked.map((p) => p.id));
  const base = exercises.filter((ex) => ex.type === "tip" || pickedIds.has(ex.id)).map((ex) => ex.id);
  return { ids: spreadReview(base, reviewIds), review: reviewIds };
}

export type QuizSession = {
  v: number;
  lessonId: string;
  seed: number;
  /** Urutan id soal; soal salah disisipkan sekali di akhir. */
  queue: string[];
  /** Id soal yang berasal dari blok sebelumnya. */
  review: string[];
  index: number;
  solved: string[];
  /** Semua soal yang pernah dijawab salah (penentu "sempurna"). */
  wrong: string[];
  /** Soal yang sudah pernah memakan nyawa. */
  heartSpent: string[];
  /** Soal yang sudah pernah diulang di akhir antrean. */
  retried: string[];
  total: number;
  startedAt: number;
  updatedAt: number;
};

export function createSession(
  lessonId: string,
  ids: readonly string[],
  reviewIds: readonly string[],
  scoredTotal: number,
  seed: number,
  now: number,
): QuizSession {
  return {
    v: SESSION_VERSION,
    lessonId,
    seed,
    queue: [...ids],
    review: [...reviewIds],
    index: 0,
    solved: [],
    wrong: [],
    heartSpent: [],
    retried: [],
    total: Math.max(1, scoredTotal),
    startedAt: now,
    updatedAt: now,
  };
}

export function markCorrect(session: QuizSession, id: string, now: number): QuizSession {
  if (session.solved.includes(id)) return { ...session, updatedAt: now };
  return { ...session, solved: [...session.solved, id], updatedAt: now };
}

/**
 * Jawab salah. Nyawa hanya dibebankan sekali per soal; soal hanya diulang sekali
 * di akhir antrean.
 */
export function markWrong(
  session: QuizSession,
  id: string,
  now: number,
): { session: QuizSession; spentHeart: boolean; requeued: boolean } {
  const spentHeart = !session.heartSpent.includes(id);
  const requeued = !session.retried.includes(id) && !session.solved.includes(id);
  const next: QuizSession = {
    ...session,
    queue: requeued ? [...session.queue, id] : [...session.queue],
    wrong: session.wrong.includes(id) ? [...session.wrong] : [...session.wrong, id],
    heartSpent: spentHeart ? [...session.heartSpent, id] : [...session.heartSpent],
    retried: requeued ? [...session.retried, id] : [...session.retried],
    updatedAt: now,
  };
  return { session: next, spentHeart, requeued };
}

export function advance(session: QuizSession, now: number): QuizSession {
  return { ...session, index: session.index + 1, updatedAt: now };
}

export function isFinished(session: QuizSession): boolean {
  return session.index >= session.queue.length;
}

export function progressOf(session: QuizSession): { solved: number; total: number } {
  return { solved: session.solved.length, total: Math.max(1, session.total) };
}

function stringList(raw: unknown, cap: number): string[] {
  if (!Array.isArray(raw)) return [];
  const out: string[] = [];
  for (const value of raw) {
    if (typeof value !== "string" || !value) continue;
    if (out.includes(value)) continue;
    out.push(value);
    if (out.length >= cap) break;
  }
  return out;
}

/**
 * Bersihkan sesi dari localStorage. Apa pun yang tidak berbentuk tepat seperti
 * yang kita tulis akan dibuang, jadi data klien yang diutak-atik tidak bisa
 * menyuntik soal atau melewati aturan nyawa.
 */
export function sanitizeSession(raw: unknown): QuizSession | null {
  if (!raw || typeof raw !== "object") return null;
  const row = raw as Record<string, unknown>;
  if (row.v !== SESSION_VERSION) return null;
  if (typeof row.lessonId !== "string" || !row.lessonId) return null;
  if (typeof row.seed !== "number" || !Number.isFinite(row.seed)) return null;
  const queue = stringList(row.queue, 200);
  if (!queue.length) return null;
  const total = typeof row.total === "number" && row.total > 0 ? Math.trunc(row.total) : new Set(queue).size;
  const indexRaw = typeof row.index === "number" && Number.isFinite(row.index) ? Math.trunc(row.index) : 0;
  const now = typeof row.updatedAt === "number" && row.updatedAt > 0 ? row.updatedAt : Date.now();
  return {
    v: SESSION_VERSION,
    lessonId: row.lessonId,
    seed: row.seed,
    queue,
    review: stringList(row.review, 20),
    index: Math.min(Math.max(0, indexRaw), queue.length),
    solved: stringList(row.solved, 200),
    wrong: stringList(row.wrong, 200),
    heartSpent: stringList(row.heartSpent, 200),
    retried: stringList(row.retried, 200),
    total: Math.max(1, Math.min(total, 200)),
    startedAt: typeof row.startedAt === "number" && row.startedAt > 0 ? row.startedAt : now,
    updatedAt: now,
  };
}

/** Buang id soal yang sudah tidak ada di kurikulum (mis. konten disunting). */
export function pruneSession(session: QuizSession, validIds: ReadonlySet<string>): QuizSession | null {
  const queue = session.queue.filter((id) => validIds.has(id));
  if (!queue.length) return null;
  const keep = new Set(queue);
  return {
    ...session,
    queue,
    review: session.review.filter((id) => keep.has(id)),
    index: Math.min(session.index, queue.length),
    solved: session.solved.filter((id) => keep.has(id)),
    wrong: session.wrong.filter((id) => keep.has(id)),
    heartSpent: session.heartSpent.filter((id) => keep.has(id)),
    retried: session.retried.filter((id) => keep.has(id)),
    total: Math.max(1, Math.min(session.total, queue.length)),
  };
}

/** Sesi dianggap selesai bila semua soal uniknya sudah dijawab benar. */
export function isSessionComplete(session: QuizSession): boolean {
  return isFinished(session) || session.solved.length >= Math.max(1, session.total);
}
