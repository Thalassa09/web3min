/**
 * POST /api/dao/claim  { daoId }
 *
 * Mengembalikan link undangan Discord HANYA kalau:
 *   1. pemanggil login (JWT Supabase diverifikasi ke server, bukan dipercaya
 *      dari body — pola sama dengan `/api/supporter/create-order`);
 *   2. SEMUA kuis di `requires` sudah selesai — dibaca dari tabel
 *      `public.completions` MILIK USER itu sendiri (data server, bukan
 *      localStorage klien);
 *   3. link undangan di env berbentuk undangan Discord yang sah (regex ketat).
 *
 * Error selalu bahasa Indonesia dan menyebut kuis mana yang kurang, supaya UI
 * bisa langsung mengarahkan user ke lesson yang tepat.
 */
import { defineEventHandler, getHeader, readBody } from "h3";
import { createClient } from "@supabase/supabase-js";
import { DAOS, daoInviteUrl } from "../../../src/server/daos.server";

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || "https://oopfefvptezqonilpfkk.supabase.co";
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || "sb_publishable_2awGzyUxgewcA_Y1UWrPBA_Sd-ob5_8";

interface Body {
  daoId?: unknown;
}

export default defineEventHandler(async (event) => {
  try {
    const token = (getHeader(event, "authorization") || "").replace(/^Bearer\s+/i, "").trim();
    if (!token) {
      return { ok: false, error: "Kamu harus masuk dulu untuk gabung." };
    }

    const body = await readBody<Body>(event).catch(() => ({}) as Body);
    const daoId = typeof body?.daoId === "string" ? body.daoId : "";
    const dao = DAOS.find((d) => d.id === daoId);
    if (!dao) {
      return { ok: false, error: "DAO tidak ada." };
    }

    const userClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      global: { headers: { Authorization: `Bearer ${token}` } },
      auth: { persistSession: false },
    });

    const { data: { user }, error: userErr } = await userClient.auth.getUser(token);
    if (userErr || !user) {
      return { ok: false, error: "Sesi tidak valid atau sudah kedaluwarsa. Coba masuk ulang." };
    }

    // Syarat kuis: dibaca dari server (RLS "own completions read" membatasi ke
    // baris user ini). Gagal query = tolak — jangan pernah fail-open.
    const { data: rows, error: compErr } = await userClient
      .from("completions")
      .select("lesson_id")
      .eq("user_id", user.id)
      .in("lesson_id", dao.requires);

    if (compErr) {
      console.error("[dao/claim] baca completions gagal:", compErr.message);
      return { ok: false, error: "Gagal memeriksa progres kuis. Coba lagi." };
    }

    const completed = new Set((rows ?? []).map((r) => String(r.lesson_id)));
    const missing = dao.requires.filter((id) => !completed.has(id));
    if (missing.length > 0) {
      return {
        ok: false,
        error: `Kuis belum selesai: ${missing.join(", ")}. Kerjakan dulu, lalu kembali ke sini.`,
        missing,
      };
    }

    const inviteUrl = daoInviteUrl(dao);
    if (!inviteUrl) {
      return { ok: false, error: "Undangan belum tersedia. Coba lagi nanti." };
    }

    return { ok: true, inviteUrl };
  } catch (err) {
    console.error("[dao/claim] exception:", err);
    return { ok: false, error: "Terjadi kesalahan server. Coba lagi." };
  }
});
