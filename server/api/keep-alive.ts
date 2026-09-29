import { defineEventHandler, getHeader, setResponseStatus } from "h3";
import { createClient } from "@supabase/supabase-js";
import { timingSafeEqual } from "node:crypto";

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || "https://oopfefvptezqonilpfkk.supabase.co";
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || "sb_publishable_2awGzyUxgewcA_Y1UWrPBA_Sd-ob5_8";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: { persistSession: false },
});

/** Bandingkan header Authorization dengan `Bearer <CRON_SECRET>` (konstan waktu). */
function bearerMatches(header: string, secret: string): boolean {
  const expected = `Bearer ${secret}`;
  const a = Buffer.from(header);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

export default defineEventHandler(async (event) => {
  // Vercel Cron mengirim `Authorization: Bearer <CRON_SECRET>` otomatis bila
  // env CRON_SECRET di-set. Bila belum di-set, endpoint tetap jalan supaya
  // ping lama tidak mati — set CRON_SECRET di Vercel untuk menguncinya.
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret && !bearerMatches(getHeader(event, "authorization") || "", cronSecret)) {
    setResponseStatus(event, 401);
    return { ok: false };
  }

  try {
    // Sentuh dua tabel untuk membangunkan Postgres + schema cache PostgREST.
    const [resRaffles, resProfiles] = await Promise.all([
      supabase.from("raffles").select("id").limit(1),
      supabase.from("profiles").select("id").limit(1),
    ]);
    return { ok: !resRaffles.error && !resProfiles.error };
  } catch {
    return { ok: false };
  }
});
