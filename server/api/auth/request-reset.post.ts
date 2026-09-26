import { defineEventHandler, readBody } from "h3";
import { createClient } from "@supabase/supabase-js";

interface RequestResetBody {
  username?: string;
}

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || "https://oopfefvptezqonilpfkk.supabase.co";
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const RESEND_FROM = process.env.RESEND_FROM || "Web3min <onboarding@resend.dev>";

function maskEmail(email: string): string {
  const [user, domain] = email.split("@");
  if (!user || !domain) return "***@***";
  if (user.length <= 2) return `${user[0]}***@${domain}`;
  return `${user[0]}***${user[user.length - 1]}@${domain}`;
}

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody<RequestResetBody>(event);
    const rawUsername = (body?.username || "").trim().toLowerCase().replace(/^@+/, "");

    if (!rawUsername) {
      return { ok: false, error: "Username tidak boleh kosong" };
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

    const recoveryEmail = userData.user.user_metadata?.recovery_email;
    if (!recoveryEmail || typeof recoveryEmail !== "string" || !recoveryEmail.includes("@")) {
      return {
        ok: false,
        error: `Akun "@${profile.username}" belum mendaftarkan email pemulihan di halaman Profil. Silakan hubungi admin jika akun terkunci.`,
      };
    }

    // 3. Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 15 * 60 * 1000; // 15 menit

    // Simpan OTP ke metadata
    const updatedMeta = {
      ...(userData.user.user_metadata || {}),
      reset_otp: otp,
      reset_otp_expires: expiresAt,
    };

    const { error: updateMetaErr } = await adminSupabase.auth.admin.updateUserById(profile.id, {
      user_metadata: updatedMeta,
    });

    if (updateMetaErr) {
      return { ok: false, error: "Gagal membuat sesi pemulihan akun." };
    }

    // 4. Kirim email melalui Resend
    if (!RESEND_API_KEY) {
      return { ok: false, error: "Layanan pengiriman email belum dikonfigurasi (RESEND_API_KEY)." };
    }

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

    const resendData = await resendRes.json();

    if (!resendRes.ok) {
      console.error("[reset-password-request] Resend error:", resendData);
      const isSandboxRestriction =
        resendData?.message &&
        typeof resendData.message === "string" &&
        resendData.message.includes("You can only send testing emails");

      if (isSandboxRestriction) {
        return {
          ok: false,
          error:
            "Resend masih dalam mode pengujian (sandbox). Hanya dapat mengirim ke email pemilik akun Resend sampai domain web3min.com diverifikasi di Resend.",
          maskedEmail: maskEmail(recoveryEmail),
        };
      }

      return {
        ok: false,
        error: resendData?.message || "Gagal mengirim email verifikasi. Coba beberapa saat lagi.",
      };
    }

    return {
      ok: true,
      maskedEmail: maskEmail(recoveryEmail),
      message: `Kode 6-digit berhasil dikirim ke ${maskEmail(recoveryEmail)}.`,
    };
  } catch (err: unknown) {
    console.error("[reset-password-request] Exception:", err);
    return {
      ok: false,
      error: (err as Error)?.message || "Terjadi kesalahan internal server.",
    };
  }
});
