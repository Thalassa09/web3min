import { defineEventHandler } from "h3";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || "https://oopfefvptezqonilpfkk.supabase.co";
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || "sb_publishable_2awGzyUxgewcA_Y1UWrPBA_Sd-ob5_8";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: { persistSession: false },
});

export default defineEventHandler(async () => {
  const start = Date.now();
  let status = "ok";
  let latencyMs = 0;
  let message = "Supabase database kept warm successfully";

  try {
    const t0 = Date.now();
    // Touch two tables to wake both Postgres engine and PostgREST schema cache
    const [resRaffles, resProfiles] = await Promise.all([
      supabase.from("raffles").select("id").limit(1),
      supabase.from("profiles").select("id").limit(1),
    ]);

    latencyMs = Date.now() - t0;

    if (resRaffles.error || resProfiles.error) {
      status = "warning";
      message = resRaffles.error?.message || resProfiles.error?.message || "Partial response";
    }
  } catch (err: unknown) {
    status = "error";
    message = (err as Error)?.message || "Failed to ping database";
  }

  return {
    status,
    timestamp: new Date().toISOString(),
    latencyMs,
    totalElapsedMs: Date.now() - start,
    message,
    project: "web3min (oopfefvptezqonilpfkk)",
    keepAlive: true,
  };
});
