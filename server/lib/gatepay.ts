/**
 * Client GatePay — HANYA untuk server.
 *
 * Jebakan yang WAJIB diingat (ditemukan lewat uji langsung ke produksi):
 *  1. GatePay di belakang Cloudflare. User-Agent `python-urllib` / `node-fetch`
 *     default DITOLAK 403 "error code: 1010". Header browser WAJIB dikirim,
 *     kalau tidak semua request gagal padahal API key benar.
 *  2. `x-api-key` TIDAK PERNAH boleh sampai ke frontend.
 *  3. Nominal unik selalu aktif (unique_digits 1–3, tidak bisa 0), jadi yang
 *     dibayar customer = `unique_amount`, bukan `base_amount`. Webhook harus
 *     memverifikasi `unique_amount`, bukan `base_amount`.
 */
import { env } from "../../src/lib/env.server";

const GATEPAY_BASE = "https://gatepay.biz.id";

/** UA browser — GatePay menolak UA non-browser lewat Cloudflare. */
const BROWSER_UA =
  "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36";

export type GatePayOrder = {
  id: string;
  status: "pending" | "paid" | "expired" | "cancelled";
  base_amount: number;
  unique_amount: number;
  unique_code?: number;
  unique_enabled?: boolean;
  order_code?: string;
  reference?: string;
  qris?: string;
  checkout_url?: string;
  expires_at?: number;
  expires_in?: number;
  paid_at?: number | null;
};

function apiKey(): string | undefined {
  return env("GATEPAY_API_KEY");
}

export function isGatePayConfigured(): boolean {
  return Boolean(apiKey());
}

async function call<T>(
  path: string,
  init: { method: "GET" | "POST"; body?: unknown } = { method: "GET" },
): Promise<{ ok: true; data: T } | { ok: false; error: string; status?: number }> {
  const key = apiKey();
  if (!key) return { ok: false, error: "GATEPAY_API_KEY belum diset di server" };

  try {
    const res = await fetch(`${GATEPAY_BASE}${path}`, {
      method: init.method,
      headers: {
        "x-api-key": key,
        "content-type": "application/json",
        accept: "application/json",
        "user-agent": BROWSER_UA,
        origin: GATEPAY_BASE,
        referer: `${GATEPAY_BASE}/dashboard`,
      },
      body: init.body === undefined ? undefined : JSON.stringify(init.body),
    });

    const text = await res.text();
    if (!res.ok) {
      return { ok: false, error: `GatePay HTTP ${res.status}: ${text.slice(0, 200)}`, status: res.status };
    }
    try {
      return { ok: true, data: JSON.parse(text) as T };
    } catch {
      return { ok: false, error: `Respons GatePay bukan JSON: ${text.slice(0, 200)}` };
    }
  } catch (err) {
    return { ok: false, error: `Gagal menghubungi GatePay: ${(err as Error)?.message || "unknown"}` };
  }
}

/** Buat order QRIS. `baseAmount` = harga produk; customer membayar `unique_amount`. */
export async function createGatePayOrder(params: {
  baseAmount: number;
  reference: string;
  ttlSeconds?: number;
  redirectUrl?: string;
}) {
  return call<GatePayOrder>("/api/orders", {
    method: "POST",
    body: {
      base_amount: params.baseAmount,
      reference: params.reference,
      ttl_seconds: params.ttlSeconds ?? 900,
      ...(params.redirectUrl ? { redirect_url: params.redirectUrl } : {}),
    },
  });
}

export async function getGatePayOrder(orderId: string) {
  return call<GatePayOrder>(`/api/orders/${encodeURIComponent(orderId)}`, { method: "GET" });
}

export async function cancelGatePayOrder(orderId: string) {
  return call<{ id: string; status: string }>(
    `/api/orders/${encodeURIComponent(orderId)}/cancel`,
    { method: "POST" },
  );
}
