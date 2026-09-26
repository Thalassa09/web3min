import { defineEventHandler, readBody } from "h3";
import { createClient } from "@supabase/supabase-js";

interface ConfirmResetBody {
  username?: string;
  code?: string;
  newPassword?: string;
}

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || "https://oopfefvptezqonilpfkk.supabase.co";
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

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
    if (!newPassword || newPassword.length < 6) {
      return { ok: false, error: "Password baru minimal 6 karakter." };
    }

    if (!SUPABASE_SERVICE_ROLE_KEY) {
      return { ok: false, error: "Layanan server pemulihan belum dikonfigurasi (kunci admin)." };
    }

    const adminSupabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
      auth: { persistSession: false },
    });

    // 1. Cari profile berdasarkan username
    const { data: profile, error: profErr } = await adminSupabase
      .from("profiles")
      .select("id, username")
      .ilike("username", rawUsername)
      .maybeSingle();

    if (profErr || !profile) {
      return { ok: false, error: `Akun dengan username "@${rawUsername}" tidak ditemukan.` };
    }

    // 2. Ambil metadata user auth
    const { data: userData, error: userErr } = await adminSupabase.auth.admin.getUserById(profile.id);
    if (userErr || !userData?.user) {
      return { ok: false, error: "Data autentikasi akun tidak ditemukan." };
    }

    const savedOtp = userData.user.user_metadata?.reset_otp;
    const expiresAt = userData.user.user_metadata?.reset_otp_expires;

    if (!savedOtp || !expiresAt) {
      return { ok: false, error: "Tidak ada permintaan reset aktif untuk akun ini. Silakan kirim kode baru." };
    }

    if (Date.now() > Number(expiresAt)) {
      return { ok: false, error: "Kode verifikasi telah kedaluwarsa (15 menit). Silakan minta kode baru." };
    }

    if (savedOtp.toString().trim() !== code) {
      return { ok: false, error: "Kode verifikasi 6-digit salah. Periksa kembali email kamu." };
    }

    // 3. Update password akun & bersihkan OTP
    const updatedMeta = {
      ...(userData.user.user_metadata || {}),
      reset_otp: null,
      reset_otp_expires: null,
    };

    const { error: updateErr } = await adminSupabase.auth.admin.updateUserById(profile.id, {
      password: newPassword,
      user_metadata: updatedMeta,
    });

    if (updateErr) {
      console.error("[confirm-reset] Update password error:", updateErr);
      return { ok: false, error: updateErr.message || "Gagal memperbarui password akun." };
    }

    return {
      ok: true,
      message: "Password berhasil diubah! Kamu sekarang bisa masuk menggunakan password baru.",
    };
  } catch (err: unknown) {
    console.error("[confirm-reset] Exception:", err);
    return {
      ok: false,
      error: (err as Error)?.message || "Terjadi kesalahan internal server.",
    };
  }
});
