import { sanitizeUsername } from "@/lib/people";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { useProgress } from "@/lib/store";
import { syncProgressFromServer } from "@/lib/server-sync";

const USERNAME_RE = /^[a-z0-9_]{3,16}$/;

/** Deterministic login email so users only type username + password. */
export function accountEmail(username: string) {
  const id = sanitizeUsername(username);
  return `${id}@users.web3min.vercel.app`;
}

export function validateUsername(raw: string): string | null {
  const id = sanitizeUsername(raw);
  if (!USERNAME_RE.test(id)) return "Username 3-16 karakter: huruf kecil, angka, underscore.";
  return null;
}

export function validatePassword(password: string): string | null {
  if (password.length < 8) return "Password minimal 8 karakter.";
  if (password.length > 72) return "Password terlalu panjang.";
  return null;
}

export async function isUsernameAvailable(username: string): Promise<boolean> {
  const id = sanitizeUsername(username);
  if (!USERNAME_RE.test(id)) return false;
  if (!isSupabaseConfigured || !supabase) return true;
  const { data, error } = await supabase.rpc("username_available", { p_username: id });
  if (error) {
    const { data: row } = await supabase.from("profiles").select("id").eq("username", id).maybeSingle();
    return !row;
  }
  return Boolean(data);
}

export async function registerAccount(opts: {
  username: string;
  password: string;
}): Promise<{ ok: true; username: string } | { ok: false; message: string }> {
  const username = sanitizeUsername(opts.username);
  const userErr = validateUsername(username);
  if (userErr) return { ok: false, message: userErr };
  const passErr = validatePassword(opts.password);
  if (passErr) return { ok: false, message: passErr };

  if (!isSupabaseConfigured || !supabase) {
    return { ok: false, message: "Server akun belum terhubung. Coba lagi nanti." };
  }

  const available = await isUsernameAvailable(username);
  if (!available) return { ok: false, message: "Username sudah dipakai. Pilih yang lain." };

  const { data, error } = await supabase.auth.signUp({
    email: accountEmail(username),
    password: opts.password,
    options: {
      data: { username },
      emailRedirectTo: "https://web3min.vercel.app/",
    },
  });

  if (error) {
    const msg = error.message.toLowerCase();
    if (msg.includes("already") || msg.includes("registered") || msg.includes("exists")) {
      return { ok: false, message: "Username sudah terdaftar. Masuk saja." };
    }
    if (msg.includes("rate")) {
      return { ok: false, message: "Terlalu banyak percobaan. Tunggu sebentar." };
    }
    if (msg.includes("invalid") && msg.includes("email")) {
      return { ok: false, message: "Pendaftaran ditolak server email. Hubungi admin web3min." };
    }
    return { ok: false, message: error.message };
  }

  if (!data.user) return { ok: false, message: "Pendaftaran gagal." };

  useProgress.setState({ username });
  return { ok: true, username };
}

export async function loginAccount(opts: {
  username: string;
  password: string;
}): Promise<{ ok: true; username: string } | { ok: false; message: string }> {
  const username = sanitizeUsername(opts.username);
  const userErr = validateUsername(username);
  if (userErr) return { ok: false, message: userErr };
  if (!opts.password) return { ok: false, message: "Isi password." };

  if (!isSupabaseConfigured || !supabase) {
    return { ok: false, message: "Server akun belum terhubung. Coba lagi nanti." };
  }

  const { error } = await supabase.auth.signInWithPassword({
    email: accountEmail(username),
    password: opts.password,
  });

  if (error) {
    return { ok: false, message: "Username atau password salah." };
  }

  const synced = await syncProgressFromServer();
  if (!synced) {
    useProgress.setState({ username, onboarded: true, introSeen: true, guideSeen: true, coachSeen: true });
  }
  return { ok: true, username };
}

export async function logoutAccount(): Promise<void> {
  if (supabase) await supabase.auth.signOut();
}
