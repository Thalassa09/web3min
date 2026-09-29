/**
 * U6: ajakan akun di layar "Pelajaran selesai" blok pertama.
 *
 * Aturan produk (disetujui pemilik repo):
 * - Tampil SEKALI, hanya saat blok pertama benar-benar selesai (bukan Ujian
 *   Rute, bukan pengulangan).
 * - Pesannya menyesuaikan keadaan: belum ada sesi -> ajak masuk; sudah ada
 *   sesi tapi email pemulihan belum dipasang -> ajak pasang.
 * - Saat offline atau server tidak dikonfigurasi, ajakan DILEWATI: pembacaan
 *   sesi bisa gagal karena jaringan dan terbaca sebagai "belum masuk",
 *   padahal sesinya ada. Lebih baik tidak tampil daripada salah tuduh.
 */
export type AccountNudgeVariant = "none" | "signin" | "email";

export type AccountNudgeInput = {
  /** Blok pertama, bukan Ujian Rute, bukan pengulangan, dan belum pernah tampil. */
  eligible: boolean;
  /** `navigator.onLine` saat keputusan dibuat. */
  online: boolean;
  /** Supabase dikonfigurasi di build ini. */
  configured: boolean;
  /** Ada sesi login aktif. */
  hasSession: boolean;
  /** Email pemulihan sudah terpasang di akun. */
  hasRecoveryEmail: boolean;
};

export function resolveAccountNudge(input: AccountNudgeInput): AccountNudgeVariant {
  if (!input.eligible) return "none";
  if (!input.online || !input.configured) return "none";
  if (!input.hasSession) return "signin";
  if (!input.hasRecoveryEmail) return "email";
  return "none";
}
