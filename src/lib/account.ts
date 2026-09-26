import { sanitizeUsername } from "@/lib/people";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { useProgress } from "@/lib/store";
import { syncProgressFromServer } from "@/lib/server-sync";

const USERNAME_RE = /^[a-z0-9_]{3,20}$/;

/** Blocklist ringan client (mirror server is_offensive; server tetap otoritas final). */
const OFFENSIVE_RE =
  /(memek|kontol|jembot|jembut|henceut|puki|pantek|itil|ngocok|ngentot|pepek|asu|bajingan|bangsat|babi|toket|tetek|boker|tahi|berak|lonte|bispak|colmek|coli|titit|fuck|shit|bitch|cunt|dick|pussy|cock|nigger|fag|whore|slut|penis|vagina)/;

function normalizeLeet(s: string): string {
  return s
    .toLowerCase()
    .replace(/3/g, "e")
    .replace(/0/g, "o")
    .replace(/1|!|\|/g, "i")
    .replace(/4|@/g, "a")
    .replace(/5|\$/g, "s")
    .replace(/7|\+/g, "t")
    .replace(/8/g, "b")
    .replace(/2/g, "z")
    .replace(/(.)\1+/g, "$1");
}

export function isOffensiveClient(raw: string): boolean {
  const norm = normalizeLeet(raw);
  return OFFENSIVE_RE.test(norm);
}

/** Deterministic login email so users only type username + password. */
export function accountEmail(username: string) {
  const id = sanitizeUsername(username);
  return `${id}@users.web3min.vercel.app`;
}

export function validateUsername(raw: string): string | null {
  const id = sanitizeUsername(raw);
  if (!USERNAME_RE.test(id)) return "Username 3-20 karakter: huruf kecil, angka, underscore.";
  if (isOffensiveClient(id)) return "Username tidak sesuai pedoman komunitas. Pilih yang lain.";
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
      emailRedirectTo: "https://web3min.com/",
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

export async function getRecoveryEmail(): Promise<string | null> {
  if (!isSupabaseConfigured || !supabase) return null;
  try {
    const { data: { user } } = await supabase.auth.getUser();
    const email = user?.user_metadata?.recovery_email;
    return typeof email === "string" ? email : null;
  } catch {
    return null;
  }
}

export async function saveRecoveryEmail(email: string): Promise<{ ok: boolean; message?: string }> {
  const clean = email.trim().toLowerCase();
  if (!clean || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean)) {
    return { ok: false, message: "Format email tidak valid (contoh: kamu@gmail.com)." };
  }
  if (!isSupabaseConfigured || !supabase) {
    return { ok: false, message: "Server belum terhubung." };
  }
  try {
    const { error } = await supabase.auth.updateUser({
      data: { recovery_email: clean },
    });
    if (error) {
      return { ok: false, message: error.message || "Gagal menyimpan email pemulihan." };
    }
    return { ok: true };
  } catch (err: unknown) {
    return { ok: false, message: (err as Error)?.message || "Terjadi kesalahan sistem." };
  }
}

export async function requestPasswordReset(username: string): Promise<{ ok: boolean; message?: string; maskedEmail?: string }> {
  try {
    const res = await fetch("/api/auth/request-reset", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username }),
    });
    const data = await res.json();
    if (!res.ok || !data.ok) {
      return { ok: false, message: data?.error || "Gagal memproses permintaan reset password." };
    }
    return { ok: true, message: data.message, maskedEmail: data.maskedEmail };
  } catch (err: unknown) {
    return { ok: false, message: (err as Error)?.message || "Koneksi ke server gagal." };
  }
}

export async function confirmPasswordReset(
  opts: { username: string; code: string; newPassword: string }
): Promise<{ ok: boolean; message?: string }> {
  try {
    const res = await fetch("/api/auth/confirm-reset", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(opts),
    });
    const data = await res.json();
    if (!res.ok || !data.ok) {
      return { ok: false, message: data?.error || "Gagal mengganti password." };
    }
    return { ok: true, message: data.message };
  } catch (err: unknown) {
    return { ok: false, message: (err as Error)?.message || "Koneksi ke server gagal." };
  }
}

