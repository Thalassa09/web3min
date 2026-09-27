import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import type { DaoPublic } from "@/lib/dao-core";

/**
 * Pemanggil server untuk fitur DAO — pola `rpc*` yang sama dengan
 * `server-sync.ts` (async, hasil bertipe, pesan error bahasa Indonesia,
 * gagal = objek `ok:false`, bukan throw).
 *
 * Kenapa lewat `/api/dao/*` (h3 route), bukan `createServerFn`: di produksi
 * auth yang hidup adalah Supabase (session JWT), bukan Better Auth — server
 * function berbasis `authMiddleware` tidak bisa melihat sesi Supabase.
 * Route `/api/supporter/*` sudah terbukti jalan di produksi dengan pola ini.
 *
 * `allowedHosts` dikirim server (bukan ditulis di klien) supaya:
 *  1. teks peringatan modal = SATU SUMBER dengan regex validasi server;
 *  2. bundle klien tetap nol literal domain undangan (syarat acceptance).
 */

export type DaoListResult = { ok: boolean; daos: DaoPublic[]; allowedHosts: string[] };
export type DaoClaimResult = { ok: boolean; inviteUrl?: string; error?: string };

function isDaoPublic(v: unknown): v is DaoPublic {
  if (!v || typeof v !== "object") return false;
  const d = v as Record<string, unknown>;
  return (
    typeof d.id === "string" &&
    typeof d.name === "string" &&
    typeof d.tagline === "string" &&
    typeof d.description === "string" &&
    typeof d.category === "string" &&
    Array.isArray(d.requires) &&
    d.requires.every((r) => typeof r === "string") &&
    typeof d.available === "boolean"
  );
}

/** Daftar DAO publik (TANPA link undangan) + flag `available` dari env server. */
export async function rpcGetDaos(): Promise<DaoListResult> {
  try {
    const res = await fetch("/api/dao/list");
    if (!res.ok) return { ok: false, daos: [], allowedHosts: [] };
    const json = (await res.json()) as { ok?: unknown; daos?: unknown; allowedHosts?: unknown };
    const daos = Array.isArray(json?.daos) ? json.daos.filter(isDaoPublic) : [];
    const allowedHosts = Array.isArray(json?.allowedHosts)
      ? json.allowedHosts.filter((h): h is string => typeof h === "string")
      : [];
    return { ok: json?.ok === true, daos, allowedHosts };
  } catch {
    return { ok: false, daos: [], allowedHosts: [] };
  }
}

// Cegah klik ganda (dua klik cepat sebelum state `claiming` sempat render).
let claimInFlight = false;

/**
 * Klaim link undangan. Wajib login; syarat kuis diperiksa SERVER dari tabel
 * `completions` (bukan dari localStorage klien). Server memvalidasi format URL
 * dengan regex sebelum mengembalikannya.
 */
export async function rpcClaimDaoInvite(daoId: string): Promise<DaoClaimResult> {
  if (claimInFlight) return { ok: false, error: "Tunggu sebentar…" };
  if (!isSupabaseConfigured || !supabase) {
    return { ok: false, error: "Server akun belum terhubung. Coba lagi nanti." };
  }
  claimInFlight = true;
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) {
      return { ok: false, error: "Kamu harus masuk dulu untuk gabung." };
    }
    const res = await fetch("/api/dao/claim", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${session.access_token}`,
      },
      body: JSON.stringify({ daoId }),
    });
    const json = (await res.json()) as { ok?: unknown; inviteUrl?: unknown; error?: unknown };
    if (json?.ok === true && typeof json.inviteUrl === "string") {
      return { ok: true, inviteUrl: json.inviteUrl };
    }
    return {
      ok: false,
      error: typeof json?.error === "string" && json.error ? json.error : "Gagal mengambil undangan.",
    };
  } catch {
    return { ok: false, error: "Gagal menghubungi server. Coba lagi." };
  } finally {
    claimInFlight = false;
  }
}
