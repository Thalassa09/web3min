import { defineEventHandler } from "h3";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || "https://oopfefvptezqonilpfkk.supabase.co";
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || "sb_publishable_2awGzyUxgewcA_Y1UWrPBA_Sd-ob5_8";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: { persistSession: false },
});

export default defineEventHandler(async () => {
  const start = Date.now();
  let dbStatus = "unknown";
  let dbLatencyMs = 0;
  let dbError: string | null = null;

  try {
    const dbStart = Date.now();
    const { data, error } = await supabase
      .from("raffles")
      .select("id")
      .limit(1);

    dbLatencyMs = Date.now() - dbStart;
    if (error) {
      dbStatus = "error";
      dbError = error.message;
    } else {
      dbStatus = "connected";
    }
  } catch (err: unknown) {
    dbStatus = "unreachable";
    dbError = (err as Error)?.message || "Connection timeout";
  }

  return {
    status: dbStatus === "connected" ? "healthy" : "degraded",
    service: "web3min-gateway",
    database: {
      status: dbStatus,
      host: "db.oopfefvptezqonilpfkk.supabase.co",
      region: "ap-southeast-1",
      latencyMs: dbLatencyMs,
      error: dbError,
    },
    region: process.env.VERCEL_REGION || process.env.REGION || "sin1",
    timestamp: new Date().toISOString(),
    uptime: Math.round(process.uptime()),
    totalLatencyMs: Date.now() - start,
  };
});
