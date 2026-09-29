import { defineEventHandler, readBody, getRequestIP } from "h3";
import { createClient } from "@supabase/supabase-js";
import { createHash, timingSafeEqual } from "node:crypto";

interface ConfirmResetBody {
  username?: string;
  code?: string;
  newPassword?: string;
}

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || "https://oopfefvptezqonilpfkk.supabase.co";
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const MAX_OTP_ATTEMPTS = 5;

// Pesan gagal generik (S1c): sama untuk username tidak ada, tanpa permintaan
// aktif, kode kedaluwarsa, dan kode salah — menutup enumerasi akun lewat
// confirm-reset. Pengguna yang benar-benar meminta kode tetap paham.
const GENERIC_FAIL =
  "Kode verifikasi salah atau sudah tidak berlaku. Minta kode baru lewat tombol \"Lupa Password?\".";

function hashOtp(otp: string, pepper: string): string {
  return createHash("sha256").update(`${otp}:${pepper}`).digest("hex");
}

/** Bandingkan dua hash hex dengan waktu konstan (S1f). */
function hashEquals(aHex: string, bHex: string): boolean {
  const a = Buffer.from(aHex, "hex");
  const b = Buffer.from(bHex, "hex");
  return a.length === b.length && timingSafeEqual(a, b);
}

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody<ConfirmResetBody>(event);
    const rawUsername = (body?.username || "").trim().toLowerCase().replace(/^@+/, "");
    const code = (body?.code || "").trim();
    const newPassword = body?.newPassword || "";

    if (!rawUsername) {
      return { ok: false, error: "Username tidak boleh kosong" };
    }
    if (!code || code.length !== 6) {
      return { ok: false, error: "Kode verifikasi harus 6 digit angka." };
    }
    if (!newPassword || newPassword.length < 8) {
      return { ok: false, error: "Password baru minimal 8 karakter." };
    }

    if (!SUPABASE_SERVICE_ROLE_KEY) {
      return { ok: false, error: "Layanan server pemulihan belum dikonfigurasi (kunci admin)." };
    }
    const serviceKey = SUPABASE_SERVICE_ROLE_KEY;

    const adminSupabase = createClient(SUPABASE_URL, serviceKey, {
      auth: { persistSession: false },
    });

    // Rate limit per IP (S1a/S1d): 15 percobaan confirm / 15 menit.
    // Fail-open kalau RPC bermasalah supaya pemulihan akun tidak mati total.
    const ip = getRequestIP(event, { xForwardedFor: true }) || "unknown";
    const rlIp = await adminSupabase.rpc("check_rate_limit", {
      p_action: "pwreset_confirm_ip",
      p_identifier: ip,
      p_max_requests: 15,
      p_window_seconds: 900,
    });
    if (rlIp.error) console.error("[confirm-reset] rate limit (ip) error:", rlIp.error.message);
    if (rlIp.data === false) {
      return { ok: false, error: "Terlalu banyak percobaan. Coba lagi dalam 15 menit." };
    }

    // 1. Cari profile berdasarkan username
    const { data: profile, error: profErr } = await adminSupabase
      .from("profiles")
      .select("id, username")
      .ilike("username", rawUsername)
      .maybeSingle();

    if (profErr || !profile) {
      return { ok: false, error: GENERIC_FAIL };
    }

    // 2. Ambil metadata user auth
    const { data: userData, error: userErr } = await adminSupabase.auth.admin.getUserById(profile.id);
    if (userErr || !userData?.user) {
      console.error("[confirm-reset] getUserById error:", userErr?.message || "user kosong");
      return { ok: false, error: GENERIC_FAIL };
    }

    const meta = userData.user.user_metadata || {};
    const savedHash = meta.reset_otp_hash;
    const expiresAt = meta.reset_otp_expires;
    const attempts = Number(meta.reset_otp_attempts || 0);

    if (typeof savedHash !== "string" || !savedHash || !expiresAt) {
      return { ok: false, error: GENERIC_FAIL };
    }

    if (attempts >= MAX_OTP_ATTEMPTS) {
      return { ok: false, error: GENERIC_FAIL };
    }

    if (Date.now() > Number(expiresAt)) {
      return { ok: false, error: GENERIC_FAIL };
    }

    // Bandingkan hash kode dengan waktu konstan; tidak pernah bandingkan
    // string OTP polos (S1f). Kode polos hanya ada di email pengguna.
    const providedHash = hashOtp(code, serviceKey);
    if (!hashEquals(providedHash, savedHash)) {
      const nextAttempts = attempts + 1;
      // Catat percobaan salah; setelah batas, kode lama dimatikan sekalian.
      const failedMeta: Record<string, unknown> = {
        ...meta,
        reset_otp_attempts: nextAttempts,
      };
      if (nextAttempts >= MAX_OTP_ATTEMPTS) {
        failedMeta.reset_otp_hash = null;
        failedMeta.reset_otp_expires = null;
      }
      const { error: failUpdateErr } = await adminSupabase.auth.admin.updateUserById(profile.id, {
        user_metadata: failedMeta,
      });
      if (failUpdateErr) console.error("[confirm-reset] catat percobaan gagal error:", failUpdateErr.message);
      return { ok: false, error: GENERIC_FAIL };
    }

    // 3. Update password akun & bersihkan OTP
    const updatedMeta = {
      ...meta,
      reset_otp: null,
      reset_otp_hash: null,
      reset_otp_expires: null,
      reset_otp_attempts: null,
    };

    const { error: updateErr } = await adminSupabase.auth.admin.updateUserById(profile.id, {
      password: newPassword,
      user_metadata: updatedMeta,
    });

    if (updateErr) {
      console.error("[confirm-reset] Update password error:", updateErr.message);
      return { ok: false, error: "Gagal memperbarui password akun. Coba lagi." };
    }

    return {
      ok: true,
      message: "Password berhasil diubah! Kamu sekarang bisa masuk menggunakan password baru.",
    };
  } catch (err: unknown) {
    console.error("[confirm-reset] Exception:", err);
    return {
      ok: false,
      error: "Terjadi kesalahan internal server.",
    };
  }
});
