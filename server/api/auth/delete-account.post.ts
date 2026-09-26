import { defineEventHandler, getHeader } from "h3";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || "https://oopfefvptezqonilpfkk.supabase.co";
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || "sb_publishable_2awGzyUxgewcA_Y1UWrPBA_Sd-ob5_8";
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

export default defineEventHandler(async (event) => {
  try {
    const authHeader = getHeader(event, "authorization") || "";
    const token = authHeader.replace(/^Bearer\s+/i, "").trim();

    if (!token) {
      return { ok: false, error: "Token autentikasi tidak ditemukan" };
    }

    // Verify user identity with the provided token
    const userClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      global: { headers: { Authorization: `Bearer ${token}` } },
      auth: { persistSession: false },
    });

    const { data: { user }, error: userErr } = await userClient.auth.getUser(token);
    if (userErr || !user) {
      return { ok: false, error: "Sesi tidak valid atau telah kedaluwarsa" };
    }

    const userId = user.id;

    // If admin service key is available, perform full administrative purge
    if (SUPABASE_SERVICE_ROLE_KEY) {
      const adminClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
        auth: { persistSession: false },
      });

      await adminClient.from("raffle_entries").delete().eq("user_id", userId);
      await adminClient.from("user_limited_items").delete().eq("user_id", userId);
      await adminClient.from("claimed_quests").delete().eq("user_id", userId);
      await adminClient.from("completions").delete().eq("user_id", userId);
      await adminClient.from("ledger").delete().eq("user_id", userId);
      await adminClient.from("progress").delete().eq("user_id", userId);
      await adminClient.from("profiles").delete().eq("id", userId);
      await adminClient.auth.admin.deleteUser(userId);

      return { ok: true, message: "Akun dan seluruh data berhasil dihapus dari server." };
    }

    // Fallback to RPC via authenticated client
    const { error: rpcErr } = await userClient.rpc("delete_my_account");
    if (rpcErr) {
      return { ok: false, error: rpcErr.message || "Gagal menghapus akun di server" };
    }

    return { ok: true, message: "Akun dan seluruh data berhasil dihapus dari server." };
  } catch (err: unknown) {
    return { ok: false, error: (err as Error)?.message || "Terjadi kesalahan server" };
  }
});
