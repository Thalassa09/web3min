/**
 * POST /api/supporter/create-order
 *
 * Membuat order QRIS supporter Rp 9.999 untuk user yang sedang login.
 *
 * Keamanan:
 *  - JWT user diverifikasi ke Supabase (bukan dipercaya dari body).
 *  - `x-api-key` GatePay hanya hidup di server.
 *  - Harga ditentukan SERVER (9999), tidak pernah dari body — kalau dari body,
 *    user bisa mengirim 1 rupiah dan tetap jadi supporter.
 *  - Hanya SATU order pending per user pada satu waktu; order pending lama
 *    otomatis dibatalkan supaya tidak ada dua QR aktif untuk satu user.
 */
import { defineEventHandler, getHeader, readBody } from "h3";
import { createClient } from "@supabase/supabase-js";
import { createGatePayOrder, cancelGatePayOrder, isGatePayConfigured } from "../../lib/gatepay";

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || "https://oopfefvptezqonilpfkk.supabase.co";
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || "sb_publishable_2awGzyUxgewcA_Y1UWrPBA_Sd-ob5_8";
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

/** Harga ditentukan server. JANGAN pernah ambil dari body. */
export const SUPPORTER_PRICE_IDR = 9999;

interface Body {
  redirectUrl?: string;
}

export default defineEventHandler(async (event) => {
  try {
    if (!isGatePayConfigured()) {
      return { ok: false, error: "Pembayaran belum aktif. Hubungi admin." };
    }
    if (!SUPABASE_SERVICE_ROLE_KEY) {
      return { ok: false, error: "Konfigurasi server belum lengkap." };
    }

    const token = (getHeader(event, "authorization") || "").replace(/^Bearer\s+/i, "").trim();
    if (!token) return { ok: false, error: "Kamu harus masuk dulu untuk jadi supporter." };

    const userClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      global: { headers: { Authorization: `Bearer ${token}` } },
      auth: { persistSession: false },
    });

    const { data: { user }, error: userErr } = await userClient.auth.getUser(token);
    if (userErr || !user) {
      return { ok: false, error: "Sesi tidak valid atau sudah kedaluwarsa. Coba masuk ulang." };
    }

    const body = await readBody<Body>(event).catch(() => ({}) as Body);
    const admin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
      auth: { persistSession: false },
    });

    // Sudah supporter? Tidak perlu bayar lagi.
    const { data: prof } = await admin
      .from("profiles")
      .select("is_supporter, supporter_expires_at")
      .eq("id", user.id)
      .maybeSingle();

    const aktif =
      prof?.is_supporter === true &&
      (!prof.supporter_expires_at || new Date(prof.supporter_expires_at) > new Date());
    if (aktif) {
      return { ok: false, error: "Akunmu sudah supporter. Terima kasih! 🎉", alreadySupporter: true };
    }

    // Batalkan order pending lama supaya tidak ada dua QR aktif.
    const { data: pending } = await admin
      .from("supporter_orders")
      .select("order_id")
      .eq("user_id", user.id)
      .eq("status", "pending")
      .limit(5);

    for (const row of pending ?? []) {
      await cancelGatePayOrder(row.order_id);
      await admin.from("supporter_orders").update({ status: "cancelled" }).eq("order_id", row.order_id);
    }

    // Referensi unik: W3M-<8 char user>-<timestamp base36>
    const reference = `W3M-${user.id.replace(/-/g, "").slice(0, 8).toUpperCase()}-${Date.now().toString(36).toUpperCase()}`;

    const created = await createGatePayOrder({
      baseAmount: SUPPORTER_PRICE_IDR,
      reference,
      ttlSeconds: 900,
      redirectUrl: typeof body?.redirectUrl === "string" ? body.redirectUrl : undefined,
    });

    if (!created.ok) {
      console.error("[supporter/create-order] GatePay gagal:", created.error);
      return { ok: false, error: "Gagal membuat pembayaran. Coba lagi sebentar lagi." };
    }

    const order = created.data;

    const { error: insErr } = await admin.from("supporter_orders").insert({
      order_id: order.id,
      user_id: user.id,
      reference,
      base_amount: order.base_amount ?? SUPPORTER_PRICE_IDR,
      unique_amount: order.unique_amount,
      supporter_days: null, // sekali bayar = selamanya
      status: "pending",
      raw: order as unknown as Record<string, unknown>,
    });

    if (insErr) {
      console.error("[supporter/create-order] insert gagal:", insErr.message);
      await cancelGatePayOrder(order.id);
      return { ok: false, error: "Gagal menyimpan order. Coba lagi." };
    }

    return {
      ok: true,
      orderId: order.id,
      reference,
      baseAmount: order.base_amount,
      uniqueAmount: order.unique_amount,
      qris: order.qris,
      checkoutUrl: order.checkout_url,
      expiresIn: order.expires_in ?? 900,
    };
  } catch (err) {
    console.error("[supporter/create-order] exception:", err);
    return { ok: false, error: (err as Error)?.message || "Terjadi kesalahan server" };
  }
});
