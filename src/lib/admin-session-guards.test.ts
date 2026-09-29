import { readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";
import assert from "node:assert/strict";

/**
 * Guard aksi admin `/admin`.
 *
 * Kenapa guard ini ada: sejak kunci rahasia lama dicabut, jalur admin yang
 * benar adalah SESI (akun dengan `profiles.is_admin = true`). Admin sesi
 * TIDAK punya `adminKey` — nilainya `null`. Gate yang hanya memeriksa
 * `adminKey` karena itu mematikan tombolnya TANPA pesan apa pun: klik
 * "Buat Undian Baru" tidak membuka modal, "Edit" dan "Peserta" diam saja,
 * "Undi Pemenang" tidak jalan. Terukur di produksi (29 Sep 2026): 0 dialog
 * terbuka, 0 error di console — tombol seperti mati total, dan tidak ada
 * test yang menangkapnya karena ini murni logika gate.
 *
 * Obatnya: satu penentu `canAdmin = Boolean(adminKey || isAdminSession)`
 * untuk SEMUA gate render modal dan guard handler. Database sendiri sudah
 * menerima admin sesi (`is_admin() or admin_verify_key(p_key)`), jadi
 * mengirim kunci kosong aman — yang menentukan tetap server.
 *
 * Guard di bawah mengunci sifat itu supaya tidak ada yang mengembalikan
 * gate ke `adminKey` saja.
 */

const ROOT = process.cwd();
const ADMIN = join(ROOT, "src/routes/admin.tsx");

const read = (p: string) => readFileSync(p, "utf8");

/** Buang komentar supaya menyebut pola terlarang di penjelasan tidak gagal palsu. */
const stripComments = (src: string) =>
  src
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/^\s*\/\/.*$/gm, "");

test("gate aksi admin memakai canAdmin (kunci ATAU sesi), bukan adminKey saja", () => {
  const src = stripComments(read(ADMIN));

  // 1. Penentu tunggal wajib ada dan wajib menyertakan sesi admin.
  assert.match(
    src,
    /const canAdmin = Boolean\(adminKey \|\| isAdminSession\)/,
    "canAdmin wajib = Boolean(adminKey || isAdminSession) — admin sesi tidak punya kunci",
  );

  // 2. Tidak boleh ada gate render modal yang hanya memeriksa adminKey.
  assert.doesNotMatch(
    src,
    /\{adminKey && \(/,
    "modal admin tidak boleh di-gate `{adminKey && (...)}` — admin sesi (adminKey null) kehilangan modalnya tanpa pesan",
  );
  assert.doesNotMatch(
    src,
    /\{viewingParticipantsRaffle && adminKey && \(/,
    "modal peserta tidak boleh di-gate adminKey saja",
  );
  assert.doesNotMatch(
    src,
    /\{viewingVerificationRaffle && adminKey && \(/,
    "modal verifikasi tidak boleh di-gate adminKey saja",
  );

  // 3. Tidak boleh ada guard handler `if (!adminKey) return;` — mati senyap.
  assert.doesNotMatch(
    src,
    /!adminKey\) return;/,
    "handler admin tidak boleh `if (!adminKey) return;` — admin sesi harus lolos lewat canAdmin",
  );

  // 4. Ketiga modal wajib benar-benar memakai canAdmin.
  assert.match(src, /\{canAdmin && \(/, "modal buat/edit wajib di-gate canAdmin");
  assert.match(
    src,
    /\{viewingParticipantsRaffle && canAdmin && \(/,
    "modal peserta wajib di-gate canAdmin",
  );
  assert.match(
    src,
    /\{viewingVerificationRaffle && canAdmin && \(/,
    "modal verifikasi wajib di-gate canAdmin",
  );

  // 5. RPC yang butuh kunci wajib mengirim string (kunci kosong utk admin sesi).
  assert.match(
    src,
    /rpcAdminTriggerDraw\(adminKey \?\? "",/,
    "trigger draw wajib `adminKey ?? \"\"` — admin sesi mengirim kunci kosong, server yang memutuskan",
  );
  assert.match(
    src,
    /rpcAdminDeleteRaffle\(adminKey \?\? "",/,
    "hapus undian wajib `adminKey ?? \"\"`",
  );
});
