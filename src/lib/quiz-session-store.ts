/**
 * Penyimpanan progres tengah-kuis + riwayat soal salah.
 *
 * Dua hal yang disimpan, dua-duanya di localStorage dan SENGAJA terpisah dari
 * store utama (`web3min-v2`) supaya tidak menambah migrasi pada state besar:
 *
 * 1. `web3min-quiz-v1` — sesi kuis yang sedang berjalan. Isinya HANYA id soal
 *    dan posisi. Tidak ada XP, koin, tiket, atau nyawa di sini, jadi mengutak-atik
 *    localStorage tidak bisa menambah hadiah. Hadiah tetap dihitung RPC
 *    `complete_lesson` di server, dan nyawa tetap di store utama.
 * 2. `web3min-quiz-wrong-v1` — id soal yang pernah dijawab salah per blok,
 *    dipakai untuk review campuran di blok berikutnya. Sifatnya petunjuk belajar,
 *    bukan hadiah.
 *
 * Sesi kedaluwarsa (default 12 jam) dibuang supaya tidak ada antrean basi.
 */
import {
  createSession,
  pruneSession,
  sanitizeSession,
  type QuizSession,
} from "@/lib/quiz-ops";

export const SESSION_KEY = "web3min-quiz-v1";
export const WRONG_KEY = "web3min-quiz-wrong-v1";
export const SESSION_TTL_MS = 12 * 60 * 60 * 1000;
const WRONG_PER_LESSON = 30;
const WRONG_LESSON_CAP = 40;

type WrongMap = Record<string, string[]>;

function readJson(key: string): unknown {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw) as unknown;
  } catch {
    return null;
  }
}

function writeJson(key: string, value: unknown): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Kuota penuh atau storage diblokir: progres tengah-kuis boleh hilang,
    // aplikasi tidak boleh rusak karenanya.
  }
}

export function loadSession(lessonId: string, validIds: ReadonlySet<string>): QuizSession | null {
  const session = sanitizeSession(readJson(SESSION_KEY));
  if (!session) return null;
  if (session.lessonId !== lessonId) return null;
  if (Date.now() - session.updatedAt > SESSION_TTL_MS) {
    clearSession();
    return null;
  }
  const pruned = pruneSession(session, validIds);
  if (!pruned) {
    clearSession();
    return null;
  }
  return pruned;
}

export function saveSession(session: QuizSession): void {
  writeJson(SESSION_KEY, session);
}

export function clearSession(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(SESSION_KEY);
  } catch {
    // ignore
  }
}

function loadWrongMap(): WrongMap {
  const raw = readJson(WRONG_KEY);
  if (!raw || typeof raw !== "object") return {};
  const out: WrongMap = {};
  for (const [lessonId, ids] of Object.entries(raw as Record<string, unknown>)) {
    if (typeof lessonId !== "string" || !lessonId) continue;
    if (!Array.isArray(ids)) continue;
    const clean = ids.filter((id): id is string => typeof id === "string" && id.length > 0);
    if (clean.length) out[lessonId] = clean.slice(0, WRONG_PER_LESSON);
    if (Object.keys(out).length >= WRONG_LESSON_CAP) break;
  }
  return out;
}

function saveWrongMap(map: WrongMap): void {
  writeJson(WRONG_KEY, map);
}

export function rememberWrong(lessonId: string, exerciseId: string): void {
  if (!lessonId || !exerciseId) return;
  const map = loadWrongMap();
  const list = map[lessonId] ?? [];
  if (list.includes(exerciseId)) return;
  map[lessonId] = [...list, exerciseId].slice(-WRONG_PER_LESSON);
  saveWrongMap(map);
}

export function forgetWrong(lessonId: string, exerciseId: string): void {
  if (!lessonId || !exerciseId) return;
  const map = loadWrongMap();
  const list = map[lessonId];
  if (!list || !list.includes(exerciseId)) return;
  const next = list.filter((id) => id !== exerciseId);
  if (next.length) map[lessonId] = next;
  else delete map[lessonId];
  saveWrongMap(map);
}

export function wrongIdsOf(lessonId: string): string[] {
  return loadWrongMap()[lessonId] ?? [];
}

/** Simpan sesi baru ke localStorage dan kembalikan objeknya. */
export function startSession(
  lessonId: string,
  ids: readonly string[],
  reviewIds: readonly string[],
  scoredTotal: number,
  seed: number,
): QuizSession {
  const session = createSession(lessonId, ids, reviewIds, scoredTotal, seed, Date.now());
  saveSession(session);
  return session;
}

/**
 * Laporkan hasil sesi kuis untuk perbandingan penyelesaian antar rute.
 *
 * HANYA panjang kuis, status selesai, dan posisi berhenti: tanpa nama, wallet,
 * isi jawaban, atau teks soal. Fungsi ini juga tidak pernah menyentuh XP/koin,
 * karena hadiah tetap dihitung RPC `complete_lesson` di server.
 */
export function noteQuizCompleted(input: {
  lessonId: string;
  quizLength: number;
  completed: boolean;
  dropAtIndex: number | null;
}): void {
  if (typeof window === "undefined") return;
  void import("@/lib/server-sync")
    .then((mod) => mod.rpcLogQuizSession(input))
    .catch(() => {
      // Kegagalan telemetri tidak boleh mengganggu penyelesaian blok.
    });
}
