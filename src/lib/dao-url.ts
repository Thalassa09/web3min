/**
 * Validator URL undangan Discord — SERVER & TEST SAJA.
 *
 * ⚠️ JANGAN impor file ini dari komponen klien. Regex & daftar host di bawah
 * memuat literal `discord.gg` / `discord.com/invite`, dan acceptance fitur ini
 * menuntut output klien NOL kemunculan pola itu. Karena itu:
 *   - validasi dijalankan server (`server/api/dao/claim.post.ts`);
 *   - teks modal di klien merender `DISCORD_INVITE_HOSTS` yang DIKIRIM server
 *     lewat `/api/dao/list` (satu sumber dengan regex — kalau regex berubah,
 *     teks modal ikut berubah, dan bundle klien tetap bersih).
 * File ini hanya diimpor oleh `src/server/daos.server.ts` (server-only) dan
 * `src/lib/dao.test.ts` (test, tidak masuk bundle).
 */

/**
 * Undangan Discord yang sah: https, host discord.gg atau discord.com/invite,
 * diikuti satu segmen kode (huruf/angka/dash). Sengaja KETAT — menolak
 * `http://`, domain lain, sub-path, query, dan kode kosong.
 */
export const DISCORD_INVITE_RE = /^https:\/\/(discord\.gg|discord\.com\/invite)\/[A-Za-z0-9-]+$/;

/**
 * Host yang diterima, untuk ditampilkan di peringatan modal klien.
 * WAJIB konsisten dengan `DISCORD_INVITE_RE` — dikunci unit test.
 */
export const DISCORD_INVITE_HOSTS = ["discord.gg", "discord.com/invite"] as const;

export function isValidDiscordInvite(url: unknown): url is string {
  return typeof url === "string" && DISCORD_INVITE_RE.test(url);
}
