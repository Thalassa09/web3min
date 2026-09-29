import { defineEventHandler, readBody, getRequestIP } from "h3";
import { createClient } from "@supabase/supabase-js";
import { createHash, randomInt } from "node:crypto";

interface RequestResetBody {
  username?: string;
}

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || "https://oopfefvptezqonilpfkk.supabase.co";
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const RESEND_FROM = process.env.RESEND_FROM || "Web3min <onboarding@resend.dev>";

// Hanya penyedia email publik tepercaya. Temp mail / domain bisnis ditolak.
const ALLOWED_EMAIL_DOMAINS = new Set([
  "gmail.com", "googlemail.com",
  "yahoo.com", "yahoo.co.id", "yahoo.co.uk", "yahoo.com.sg", "ymail.com", "rocketmail.com",
  "outlook.com", "outlook.co.id", "hotmail.com", "hotmail.co.id", "live.com", "msn.com",
  "icloud.com",
  "proton.me", "protonmail.com",
]);

// Satu-satunya pesan sukses (S1c): identik untuk username ada/tidak ada,
// punya/tidak punya email pemulihan, terkirim/gagal terkirim. Menutup
// enumerasi akun lewat perbedaan pesan. Detail sebenarnya masuk log server.
const GENERIC_OK_MESSAGE =
  "Kalau akun itu ada dan email pemulihan sudah diatur, kode 6 digit sudah dikirim. Cek juga folder spam. Belum menerima? Pastikan email pemulihanmu penyedia publik (Gmail, Yahoo, Outlook, iCloud, Proton) di halaman Profil.";

function maskEmail(email: string): string {
  const [user, domain] = email.split("@");
  if (!user || !domain) return "***@***";
  if (user.length <= 2) return `${user[0]}***@${domain}`;
  return `${user[0]}***${user[user.length - 1]}@${domain}`;
}

/**
 * Hash OTP + pepper (service-role key). `user_metadata` bisa dibaca klien,
 * jadi OTP tidak pernah disimpan polos (S1e). Tanpa pepper, 6 digit bisa
 * di-bruteforce dari hash; dengan pepper hanya server yang bisa menghitung.
 */
function hashOtp(otp: string, pepper: string): string {
  return createHash("sha256").update(`${otp}:${pepper}`).digest("hex");
}

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody<RequestResetBody>(event);
    const rawUsername = (body?.username || "").trim().toLowerCase().replace(/^@+/, "");

    if (!rawUsername) {
      return { ok: false, error: "Username tidak boleh kosong" };
    }

    // Cek konfigurasi SEBELUM lookup: error ini tidak tergantung akun,
    // jadi aman untuk tidak diseragamkan.
    if (!SUPABASE_SERVICE_ROLE_KEY) {
      return { ok: false, error: "Layanan server pemulihan belum dikonfigurasi (kunci admin)." };
    }
    if (!RESEND_API_KEY) {
      return { ok: false, error: "Layanan pengiriman email belum dikonfigurasi (RESEND_API_KEY)." };
    }
    const serviceKey = SUPABASE_SERVICE_ROLE_KEY;

    const adminSupabase = createClient(SUPABASE_URL, serviceKey, {
      auth: { persistSession: false },
    });

    // Rate limit (S1d): 3/15 menit per username, 10/15 menit per IP.
    // Fail-open kalau RPC bermasalah supaya pemulihan akun tidak mati total.
    const ip = getRequestIP(event, { xForwardedFor: true }) || "unknown";
    const [rlUser, rlIp] = await Promise.all([
      adminSupabase.rpc("check_rate_limit", {
        p_action: "pwreset_req_user",
        p_identifier: rawUsername,
        p_max_requests: 3,
        p_window_seconds: 900,
      }),
      adminSupabase.rpc("check_rate_limit", {
        p_action: "pwreset_req_ip",
        p_identifier: ip,
        p_max_requests: 10,
        p_window_seconds: 900,
      }),
    ]);
    if (rlUser.error) console.error("[request-reset] rate limit (user) error:", rlUser.error.message);
    if (rlIp.error) console.error("[request-reset] rate limit (ip) error:", rlIp.error.message);
    if (rlUser.data === false || rlIp.data === false) {
      return { ok: false, error: "Terlalu banyak permintaan reset. Coba lagi dalam 15 menit." };
    }

    // 1. Cari profile berdasarkan username
    const { data: profile, error: profErr } = await adminSupabase
      .from("profiles")
      .select("id, username")
      .ilike("username", rawUsername)
      .maybeSingle();

    if (profErr || !profile) {
      return { ok: true, message: GENERIC_OK_MESSAGE };
    }

    // 2. Ambil metadata user auth
    const { data: userData, error: userErr } = await adminSupabase.auth.admin.getUserById(profile.id);
    if (userErr || !userData?.user) {
      console.error("[request-reset] getUserById error:", userErr?.message || "user kosong");
      return { ok: true, message: GENERIC_OK_MESSAGE };
    }

    const recoveryEmail = userData.user.user_metadata?.recovery_email;
    if (!recoveryEmail || typeof recoveryEmail !== "string" || !recoveryEmail.includes("@")) {
      console.warn(`[request-reset] @${profile.username}: belum ada email pemulihan terdaftar`);
      return { ok: true, message: GENERIC_OK_MESSAGE };
    }

    const emailDomain = recoveryEmail.trim().toLowerCase().split("@")[1] || "";
    if (!ALLOWED_EMAIL_DOMAINS.has(emailDomain)) {
      console.warn(
        `[request-reset] @${profile.username}: domain email ditolak (${maskEmail(recoveryEmail)})`
      );
      return { ok: true, message: GENERIC_OK_MESSAGE };
    }

    // 3. OTP 6-digit kriptografis (S1b); simpan HASH-nya, bukan polos (S1e).
    const otp = randomInt(100000, 1000000).toString();
    const expiresAt = Date.now() + 15 * 60 * 1000; // 15 menit

    const updatedMeta = {
      ...(userData.user.user_metadata || {}),
      reset_otp_hash: hashOtp(otp, serviceKey),
      reset_otp_expires: expiresAt,
      reset_otp_attempts: null, // kode baru = hitungan percobaan baru (hindari dead-end)
      reset_otp: null, // bersihkan sisa format lama (plaintext)
    };

    const { error: updateMetaErr } = await adminSupabase.auth.admin.updateUserById(profile.id, {
      user_metadata: updatedMeta,
    });

    if (updateMetaErr) {
      console.error("[request-reset] updateUserById error:", updateMetaErr.message);
      return { ok: true, message: GENERIC_OK_MESSAGE };
    }

    // 4. Kirim email melalui Resend
    const emailHtml = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 520px; margin: 0 auto; padding: 28px 20px; background-color: #FFF9F5; border: 3px solid #3B2218; border-radius: 24px;">
        <div style="text-align: center; margin-bottom: 24px;">
          <h1 style="color: #E8437F; margin: 0; font-size: 26px; font-weight: 900; letter-spacing: -0.5px;">web3min</h1>
          <p style="color: #6A4433; margin: 4px 0 0 0; font-size: 13px; font-weight: 700;">Petualangan Interaktif Web3</p>
        </div>
        
        <div style="background-color: #ffffff; border: 2px solid #3B2218; border-radius: 18px; padding: 22px; margin-bottom: 20px; box-shadow: 0 4px 0 #3B2218;">
          <h2 style="color: #3B2218; margin: 0 0 10px 0; font-size: 18px; font-weight: 800;">Kode Reset Password</h2>
          <p style="color: #6A4433; font-size: 14px; line-height: 1.5; margin: 0 0 16px 0;">
            Halo <strong>@${profile.username}</strong>, kami menerima permintaan untuk mereset kata sandi akun Web3min kamu. Gunakan kode verifikasi 6-digit berikut:
          </p>
          
          <div style="text-align: center; margin: 24px 0;">
            <span style="display: inline-block; font-family: monospace, Courier; font-size: 32px; font-weight: 900; letter-spacing: 6px; color: #E8437F; background: #FFF0F5; border: 2px dashed #E8437F; border-radius: 14px; padding: 12px 24px;">
              ${otp}
            </span>
          </div>

          <p style="color: #8C6A5A; font-size: 12px; margin: 0; text-align: center;">
            Kode ini berlaku selama <strong>15 menit</strong>. Jangan bagikan kode ini kepada siapa pun.
          </p>
        </div>

        <p style="color: #8C6A5A; font-size: 12px; text-align: center; margin: 0;">
          Jika kamu tidak meminta reset password ini, kamu bisa mengabaikan email ini dengan aman.
        </p>
      </div>
    `;

    const resendRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: RESEND_FROM,
        to: [recoveryEmail],
        subject: `[Web3min] Kode Reset Password: ${otp}`,
        html: emailHtml,
      }),
    });

    if (!resendRes.ok) {
      const resendData = await resendRes.json().catch(() => null);
      console.error(
        "[request-reset] Resend error:",
        resendData?.message || `HTTP ${resendRes.status}`
      );
      // Kegagalan kirim (mis. sandbox S3) tidak dibocorkan ke klien;
      // detailnya ada di log server untuk admin.
      return { ok: true, message: GENERIC_OK_MESSAGE };
    }

    return { ok: true, message: GENERIC_OK_MESSAGE };
  } catch (err: unknown) {
    console.error("[request-reset] Exception:", err);
    return {
      ok: false,
      error: "Terjadi kesalahan internal server.",
    };
  }
});
