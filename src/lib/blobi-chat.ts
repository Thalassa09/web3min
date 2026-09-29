/**
 * Logika murni otak Blobi (halaman /blobi + endpoint /api/blobi/chat).
 *
 * Dipisah dari `server/api/blobi/chat.post.ts` supaya bisa diuji tanpa
 * menjalankan Nitro. Semua fungsi di sini TIDAK menyentuh jaringan/env.
 */

/** Tag suasana hati yang dikirim model di awal jawaban. */
export const TAG = /\[(happy|laugh|love|star|wide|sad|angry|think|wink|idea|neutral)\]/i;
export const TAG_ALL = new RegExp(TAG.source + "\\s*", "gi");

/** Bersihkan markdown/emoji/baris baru supaya enak diucapkan TTS. */
export function clean(s: string): string {
  return s
    .replace(/\r/g, "")
    // Daftar setelah titik dua/koma: potong sampai akhir (lebih baik diucapkan
    // tanpa daftarnya daripada dibacakan butir demi butir).
    .replace(/([:;,])\s*\n?\s*[-•]\s+.*$/s, "$1")
    // Titik dua yang menggantung di akhir ("tinggal:") terdengar putus di TTS.
    .replace(/[:;,]\s*$/, ".")
    // Sisa penanda daftar di awal baris (tanpa titik dua di depannya).
    .replace(/^[ \t]*[-•*]\s+/gm, "")
    .replace(/\n+/g, " ")
    .replace(/[*_`#>]/g, "")
    .replace(/^[\s\-\u2013\u2014•\d.)]+/, "")
    .replace(/\s*[\u2013\u2014]\s*/g, ", ")
    .replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE0F}\u{200D}]/gu, "")
    .replace(/\s+([,.!?;:])/g, "$1")
    .replace(/\s{2,}/g, " ")
    .trim();
}

/** Jaring pengaman: maksimal 3 kalimat / 320 huruf. */
export function shorten(s: string): string {
  const parts = s.split(/(?<=[.!?\u2026])\s+/).filter(Boolean);
  let out = parts.slice(0, 3).join(" ");
  if (out.length > 320) out = out.slice(0, 317).replace(/\s+\S*$/, "") + "\u2026";
  return out.trim();
}

/** Kalau model lupa tag mood, tebak dari kata kunci. */
export function guessMood(t: string): string {
  const w = t.toLowerCase();
  if (/penipu|scam|bahaya|waspada|jangan pernah|seed phrase|private key|ratusan persen|red flag/.test(w)) return "angry";
  if (/sedih|rugi|ketipu|kena tipu|takut|cemas|bingung|stres/.test(w)) return "sad";
  if (/makasih|terima kasih|thanks|keren|hebat|mantap|pintar|selamat/.test(w)) return "star";
  if (/haha|wkwk|lucu|ngakak/.test(w)) return "laugh";
  if (/^\s*(halo|hai|hi|hello|pagi|siang|malam|sore)\b/.test(w)) return "happy";
  return "think";
}

/** Penjaga persona: model bocor sebagai asisten kode (CodeBuddy dll). */
export const LEAK =
  /codebuddy|code buddy|asisten (kode|coding)|bantuan kode|berbasis cli|\bcli\b|codebase|ngoding|ngoprek|debugging|\bdebug\b|\bgit\b|rekan kerja|urusan kode|coding|programming|ngasih saran arsitektur/i;
export const SAFE =
  "Hai, aku Blobi! Aku maskot belajar web3. Yuk tanya soal dompet, seed phrase, atau cara aman di dunia kripto.";

/**
 * Penjaga bahasa: model penalaran kadang menjawab Inggris walau diminta
 * Indonesia (terbukti di produksi 2026-09-29: "Hi! What can I help you with
 * today?" untuk sapaan "Hai"). Deteksi lewat kata fungsi Inggris + rasio,
 * BUKAN daftar kata Indonesia, supaya tidak salah menangkap jawaban campuran
 * istilah teknis ("gas fee", "seed phrase", "wallet").
 */
const INGGRIS =
  /\b(the|you|your|are|is|can|help|with|what|how|here|thanks|sorry|about|would|like|let|me|know|need|want|have|this|that|for|and)\b/gi;
export function inggris(t: string): boolean {
  const kata = t.toLowerCase().match(/[a-z']+/g) || [];
  if (kata.length < 6) return false;
  const kena = (t.match(INGGRIS) || []).length;
  return kena >= 3 && kena / kata.length > 0.25;
}

/**
 * Sanitasi jejak belajar dari browser. Nilai diambil HANYA lewat pola yang
 * kita kirim sendiri, lalu dibatasi; apa pun yang aneh dibuang tanpa error
 * supaya chat tetap jalan. Ini yang mencegah teks liar dari localStorage
 * (mis. nama berisi "DROP TABLE") ikut masuk ke prompt.
 */
export function sanitizeContext(raw: unknown): string {
  if (typeof raw !== "string") return "";
  const nama = (raw.match(/Nama pengguna:\s*([a-z0-9_]{1,20})\./i) || [])[1] || "";
  const level = (raw.match(/Level\s+(\d{1,4})/i) || [])[1] || "";
  const streak = (raw.match(/rentetan\s+(\d{1,4})/i) || [])[1] || "";
  const modul = (raw.match(/(\d{1,4})\s+modul/i) || [])[1] || "";
  if (!nama && !level && !modul) return "";
  const bagian: string[] = [];
  if (nama) bagian.push(`nama ${nama}`);
  if (level) bagian.push(`level ${level}`);
  if (streak) bagian.push(`rentetan ${streak} hari`);
  if (modul) bagian.push(`${modul} modul selesai`);
  return `Kemajuan pengguna: ${bagian.join(", ")}.`;
}
