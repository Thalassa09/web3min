/**
 * POST /api/supporter/webhook
 *
 * Menerima callback GatePay saat order menjadi `paid`, lalu mengaktifkan
 * supporter. Ini endpoint yang MEMUTUSKAN uang sudah masuk — jadi seluruh
 * asumsi di sini sengaja parno.
 *
 * Verifikasi berlapis:
 *  1. HMAC-SHA256 atas **raw body** (bukan body hasil parse ulang — JSON.stringify
 *     ulang bisa mengubah urutan key/spasi dan membuat signature selalu gagal).
 *  2. `order_id` harus ada di database kita (order yang kita buat sendiri).
 *  3. `unique_amount` harus SAMA dengan yang tersimpan. Tanpa ini, orang bisa
 *     membayar Rp 1 untuk order Rp 9.999 dan tetap jadi supporter.
 *  4. Idempoten: order yang sudah `paid` tidak diproses ulang, tapi tetap balas
 *     2xx supaya GatePay berhenti mengirim ulang.
 *
 * Selalu balas 2xx kalau signature valid — supaya GatePay tidak retry selamanya.
 * Balas 401 kalau signature tidak valid (bukan dari GatePay).
 */
import { defineEventHandler, getHeader, readRawBody, setResponseStatus } from "h3";
import { createClient } from "@supabase/supabase-js";
import { createHmac, timingSafeEqual } from "node:crypto";

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || "https://oopfefvptezqonilpfkk.supabase.co";
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

interface Payload {
  event?: string;
  order_id?: string;
  reference?: string;
  base_amount?: number;
  unique_amount?: number;
  paid_at?: number;
}

/** Bandingkan HMAC dengan aman (konstan waktu). */
function signatureValid(raw: string, secret: string, header: string): boolean {
  const expected = createHmac("sha256", secret).update(raw).digest("hex");
  const a = Buffer.from(expected, "utf8");
  const b = Buffer.from(header.trim().toLowerCase(), "utf8");
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export default defineEventHandler(async (event) => {
  const secret = process.env.GATEPAY_CALLBACK_SECRET;

  if (!secret || !SUPABASE_SERVICE_ROLE_KEY) {
    console.error("[supporter/webhook] konfigurasi server tidak lengkap");
    return { ok: false, error: "Konfigurasi server belum lengkap" };
  }

  // ── 1. Verifikasi signature atas RAW body ─────────────────────────────────
  const raw = (await readRawBody(event, "utf8")) || "";
  const sig = getHeader(event, "x-signature") || "";

  if (!sig || !signatureValid(raw, secret, sig)) {
    console.warn("[supporter/webhook] signature TIDAK VALID — ditolak");
    setResponseStatus(event, 401);
    return { ok: false, error: "invalid signature" };
  }

  let payload: Payload;
  try {
    payload = JSON.parse(raw) as Payload;
  } catch {
    return { ok: true, ignored: "body bukan JSON" };
  }

  // Hanya pedulikan order yang sudah dibayar.
  if (payload.event !== "order.paid" || !payload.order_id) {
    return { ok: true, ignored: `event ${payload.event ?? "(kosong)"}` };
  }

  const admin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false },
  });

  // ── 2. Order harus ada di database kita ───────────────────────────────────
  const { data: order, error: findErr } = await admin
    .from("supporter_orders")
    .select("order_id, user_id, unique_amount, base_amount, status, supporter_days")
    .eq("order_id", payload.order_id)
    .maybeSingle();

  if (findErr || !order) {
    console.warn("[supporter/webhook] order tidak dikenal:", payload.order_id);
    // Balas 2xx: order asing bukan urusan kita, jangan sampai GatePay retry selamanya.
    return { ok: true, ignored: "order tidak dikenal" };
  }

  // ── 3. Nominal harus cocok ────────────────────────────────────────────────
  if (Number(payload.unique_amount) !== Number(order.unique_amount)) {
    console.error(
      "[supporter/webhook] NOMINAL TIDAK COCOK — order",
      order.order_id,
      "harusnya",
      order.unique_amount,
      "tapi webhook bilang",
      payload.unique_amount,
    );
    // Catat untuk investigasi, jangan aktifkan supporter.
    await admin
      .from("supporter_orders")
      .update({ raw: payload as unknown as Record<string, unknown> })
      .eq("order_id", order.order_id);
    return { ok: true, ignored: "nominal tidak cocok" };
  }

  // ── 4. Idempoten ──────────────────────────────────────────────────────────
  if (order.status === "paid") {
    return { ok: true, alreadyPaid: true };
  }

  const paidAt = payload.paid_at ? new Date(payload.paid_at * 1000).toISOString() : new Date().toISOString();

  // ── 5. Tandai lunas + aktifkan supporter ──────────────────────────────────
  const { error: updErr } = await admin
    .from("supporter_orders")
    .update({
      status: "paid",
      paid_at: paidAt,
      raw: payload as unknown as Record<string, unknown>,
    })
    .eq("order_id", order.order_id)
    .eq("status", "pending"); // guard: hanya transisi pending -> paid

  if (updErr) {
    console.error("[supporter/webhook] gagal update order:", updErr.message);
    return { ok: false, error: "gagal menyimpan status order" };
  }

  // supporter_days null = sekali bayar = selamanya.
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
    console.error("[supporter/webhook] GAGAL AKTIFKAN SUPPORTER:", profErr.message);
    // Order sudah ditandai paid — admin bisa aktifkan manual lewat panel.
    // Jangan balas error supaya GatePay tidak retry tanpa henti.
    return { ok: true, warning: "order paid tapi aktivasi gagal; perlu tindakan admin" };
  }

  // Jejak audit (jangan gagalkan webhook kalau ini error).
  await admin.from("activity_log").insert({
    user_id: order.user_id,
    event: "supporter_purchase",
    ref_id: order.order_id,
    meta: {
      base_amount: order.base_amount,
      unique_amount: order.unique_amount,
      paid_at: paidAt,
    },
  });

  return { ok: true, activated: true, orderId: order.order_id };
});
