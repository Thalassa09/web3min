/**
 * Logika DAO yang AMAN untuk klien (fungsi murni, tanpa env & tanpa secret).
 *
 * Dipakai tiga sisi:
 *   - klien (`/dao`) untuk menghitung progres "x/y kuis" di kartu;
 *   - server (`src/server/daos.server.ts` + API route) untuk gate klaim;
 *   - unit test (`src/lib/dao.test.ts`) — file ini sengaja TIDAK mengimpor
 *     apa pun lewat alias `@/` supaya bisa dijalankan `node --test` polos.
 *
 * Validator URL undangan TIDAK di sini — regex-nya mengandung literal domain
 * Discord dan file ini ikut ke bundle klien. Lihat `src/lib/dao-url.ts`
 * (server + test saja).
 */

/** Data DAO yang boleh sampai ke klien: TANPA link undangan. */
export type DaoPublic = {
  id: string;
  name: string;
  tagline: string;
  description: string;
  category: string;
  logo?: string;
  requires: string[];
  /** true = env undangannya terisi & valid; false = kartu dinonaktifkan. */
  available: boolean;
};

export type DaoAccess = {
  /** true kalau SEMUA syarat kuis sudah selesai. */
  unlocked: boolean;
  /** ID kuis yang sudah selesai (urut sesuai `requires`). */
  done: string[];
  /** ID kuis yang belum selesai (urut sesuai `requires`). */
  missing: string[];
};

/**
 * Cek akses DAO: mana syarat yang selesai, mana yang kurang.
 *
 * `requires` kosong = langsung terbuka (tidak ada kuis yang dituntut).
 * Urutan hasil mengikuti urutan `requires` supaya pesan "kerjakan kuis dulu"
 * selalu menunjuk kuis pertama yang belum selesai.
 */
export function checkDaoAccess(requires: string[], completed: string[]): DaoAccess {
  const done: string[] = [];
  const missing: string[] = [];
  for (const id of requires) {
    if (completed.includes(id)) done.push(id);
    else missing.push(id);
  }
  return { unlocked: missing.length === 0, done, missing };
}

/** Kuis pertama yang belum selesai — target tombol "Kerjakan kuis dulu". */
export function firstMissingId(requires: string[], completed: string[]): string | null {
  return checkDaoAccess(requires, completed).missing[0] ?? null;
}
