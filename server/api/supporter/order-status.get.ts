/**
 * GET /api/supporter/order-status?orderId=ord_xxx
 *
 * Cadangan kalau webhook GatePay telat atau gagal — deteksi pembayaran GatePay
 * memakai API internal (cookie GoPay / APK Android) yang bisa expired, jadi
 * jangan bergantung pada webhook saja.
 *
 * Keamanan:
 *  - Order harus milik pemanggil. Kalau tidak, orang bisa mengecek order orang lain.
 *  - Status diambil dari GATEPAY (sumber kebenaran), bukan dari klien.
 *  - Aktivasi supporter memakai jalur yang sama dengan webhook: cek nominal
 *    cocok, lalu transisi pending -> paid (idempoten).
 */
import { defineEventHandler, getHeader, getQuery } from "h3";
import { createClient } from "@supabase/supabase-js";
import { getGatePayOrder, isGatePayConfigured } from "../../lib/gatepay";

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || "https://oopfefvptezqonilpfkk.supabase.co";
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || "sb_publishable_2awGzyUxgewcA_Y1UWrPBA_Sd-ob5_8";
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

export default defineEventHandler(async (event) => {
  try {
    if (!isGatePayConfigured()) return { ok: false, error: "Pembayaran belum aktif." };
    if (!SUPABASE_SERVICE_ROLE_KEY) return { ok: false, error: "Konfigurasi server belum lengkap." };

    const orderId = String(getQuery(event).orderId || "").trim();
    if (!orderId) return { ok: false, error: "orderId wajib diisi." };

    const token = (getHeader(event, "authorization") || "").replace(/^Bearer\s+/i, "").trim();
    if (!token) return { ok: false, error: "Sesi tidak ditemukan." };

    const userClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      global: { headers: { Authorization: `Bearer ${token}` } },
      auth: { persistSession: false },
    });
    const { data: { user }, error: userErr } = await userClient.auth.getUser(token);
    if (userErr || !user) return { ok: false, error: "Sesi tidak valid." };

    const admin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
      auth: { persistSession: false },
    });

    // Order harus MILIK pemanggil — kalau tidak, siapa pun bisa mengintip.
    const { data: order } = await admin
      .from("supporter_orders")
      .select("order_id, user_id, unique_amount, base_amount, status, supporter_days")
      .eq("order_id", orderId)
      .eq("user_id", user.id)
      .maybeSingle();

    if (!order) return { ok: false, error: "Order tidak ditemukan." };

    // Sudah lunas — tidak perlu tanya GatePay lagi.
    if (order.status === "paid") {
      return { ok: true, status: "paid", activated: true };
    }

    // ── Tanya GatePay (sumber kebenaran) ─────────────────────────────────────
    const remote = await getGatePayOrder(orderId);
    if (!remote.ok) {
      // Jangan bikin user panik: pembayaran mungkin sudah masuk tapi GatePay
      // sedang tidak bisa dihubungi. Laporkan status lokal apa adanya.
      return { ok: true, status: order.status, warning: "Status pembayaran belum bisa dipastikan." };
    }

    const status = remote.data.status;

    // Belum dibayar — sinkronkan kalau expired/cancelled.
    if (status !== "paid") {
      if (status !== order.status && (status === "expired" || status === "cancelled")) {
        await admin.from("supporter_orders").update({ status }).eq("order_id", orderId);
      }
      return { ok: true, status, activated: false };
    }

    // ── Dibayar: verifikasi nominal sebelum mengaktifkan ─────────────────────
    if (Number(remote.data.unique_amount) !== Number(order.unique_amount)) {
      console.error(
        "[supporter/order-status] NOMINAL TIDAK COCOK — order",
        orderId,
        "harusnya",
        order.unique_amount,
        "tapi GatePay bilang",
        remote.data.unique_amount,
      );
      return { ok: true, status: "paid", activated: false, warning: "Nominal tidak cocok, hubungi admin." };
    }

    const paidAt = remote.data.paid_at
      ? new Date(remote.data.paid_at * 1000).toISOString()
      : new Date().toISOString();

    // Transisi pending -> paid (guard idempoten: kalau webhook sudah jalan, 0 baris).
    await admin
      .from("supporter_orders")
      .update({ status: "paid", paid_at: paidAt })
      .eq("order_id", orderId)
      .eq("status", "pending");

    const expires =
      order.supporter_days == null
        ? null
        : new Date(Date.now() + order.supporter_days * 86400_000).toISOString();

    const { error: profErr } = await admin
      .from("profiles")
      .update({
        is_supporter: true,
        supporter_since: new Date().toISOString(),
        supporter_expires_at: expires,
        updated_at: new Date().toISOString(),
      })
      .eq("id", order.user_id);

    if (profErr) {
      console.error("[supporter/order-status] gagal aktifkan supporter:", profErr.message);
      return { ok: true, status: "paid", activated: false, warning: "Gagal mengaktifkan, hubungi admin." };
    }

    await admin.from("activity_log").insert({
      user_id: order.user_id,
      event: "supporter_purchase",
      ref_id: orderId,
      meta: { base_amount: order.base_amount, unique_amount: order.unique_amount, via: "order_status_poll" },
    });

    return { ok: true, status: "paid", activated: true };
  } catch (err) {
    console.error("[supporter/order-status] exception:", err);
    return { ok: false, error: (err as Error)?.message || "Terjadi kesalahan server" };
  }
});
