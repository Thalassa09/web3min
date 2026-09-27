import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import assert from "node:assert/strict";
import test from "node:test";

const ROOT = process.cwd();

function walk(dir: string): string[] {
  const out: string[] = [];
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    if (statSync(p).isDirectory()) out.push(...walk(p));
    else if (/\.tsx?$/.test(entry) && !/\.test\./.test(entry)) out.push(p);
  }
  return out;
}

const FILES = walk(join(ROOT, "src")).map((f) => ({
  path: f.replace(ROOT + "/", ""),
  src: readFileSync(f, "utf8"),
}));

/**
 * Guard §7 `DESIGN.md` — aturan yang sebelumnya TIDAK dijaga otomatis.
 *
 * Kenapa ada: saat menulis §7 Do & Don't, tiga aturan terbukti sudah dilanggar
 * di produksi tanpa ada yang menyadarinya — `#000` murni 3×, `/18` 3×, dan 43
 * hex mentah. Pelajarannya: **aturan tanpa guard = aturan yang dilanggar
 * diam-diam.** Guard ini menutup dua yang bisa dikunci bersih.
 */

test("tidak ada slab hitam murni #000 (DESIGN.md §7)", () => {
  // `#000` bukan bagian palet. Semua slab memakai choco-900 `#3B2218`.
  // Hitam pekat di atas krem terlihat "kotor" dan memutus kehangatan brand.
  const offenders: string[] = [];
  for (const { path, src } of FILES) {
    src.split("\n").forEach((line, i) => {
      // Hanya nilai warna, bukan komentar. `bg-black/10` dsb. juga ditolak
      // HANYA kalau dipakai sebagai warna slab/shadow solid.
      if (/shadow-\[[^\]]*#000\b/.test(line) || /shadow-\[[^\]]*\bblack\b/.test(line)) {
        offenders.push(`${path}:${i + 1}`);
      }
    });
  }
  assert.deepEqual(
    offenders,
    [],
    `Slab hitam murni — pakai choco-900 (#3B2218):\n${offenders.map((o) => "  " + o).join("\n")}`,
  );
});

test("divider memakai choco-900/20, bukan /18 (DESIGN.md §7)", () => {
  // `/18` tidak ada di skala opacity default Tailwind dan sudah ditinggalkan
  // sejak v1.0. Nilai resmi untuk divider: /20.
  const offenders: string[] = [];
  for (const { path, src } of FILES) {
    src.split("\n").forEach((line, i) => {
      if (/choco-900\/18\b/.test(line)) offenders.push(`${path}:${i + 1}`);
    });
  }
  assert.deepEqual(
    offenders,
    [],
    `Divider /18 — pakai /20:\n${offenders.map((o) => "  " + o).join("\n")}`,
  );
});

test("setiap aturan di DESIGN.md §7 punya angka hasil ukur", () => {
  // Aturan yang ditulis tanpa bukti ukur = aturan yang gampang jadi salah
  // (tiga catatan utang lama terbukti salah karena dihitung dari kemunculan
  // kelas, bukan diukur). Setiap baris tabel §7 wajib memuat angka.
  const d = readFileSync(join(ROOT, "DESIGN.md"), "utf8");
  const start = d.indexOf("## 7. Do & Don't");
  assert.ok(start !== -1, "DESIGN.md kehilangan bagian §7 Do & Don't");
  // HANYA tabel pertama §7 (aturan vs hindari). Berhenti di sub-bagian 7.1 —
  // tabel 7.2 berisi daftar guard dan memang tidak punya angka.
  const sub = d.indexOf("### 7.1", start);
  const end = d.indexOf("## 8. Changelog", start);
  const section = d.slice(start, sub === -1 ? (end === -1 ? undefined : end) : sub);

  const rows = section
    .split("\n")
    .filter((l) => l.trim().startsWith("|") && !/^\|[\s-:|]+\|$/.test(l.trim()))
    // buang baris header
    .filter((l) => !/Lakukan|Bukti/i.test(l));

  assert.ok(rows.length >= 5, `§7 hanya punya ${rows.length} baris aturan`);
  // Bukan sekadar "ada digit": `#000` dan `#3B2218` juga mengandung digit.
  // Yang dituntut adalah POLA HASIL UKUR — angka yang menyatakan banyaknya
  // pemakaian (mis. `674×`, `13×`) atau jumlah berkas/pemakaian.
  // Markdown emphasis dibuang dulu: `**92** pemakaian` harus terbaca
  // `92 pemakaian`, kalau tidak `**` di antaranya memutus pencocokan.
  // `\b` TIDAK boleh dipasang setelah `×` (keduanya non-word char → tak pernah
  // cocok, sudah dibuktikan: 4 dari 8 baris gagal). Jadi `×` dipisah.
  const polaUkur = /\d+\s*×|\d+\s*(?:berkas|pemakaian|test|guard)\b/i;
  const tanpaAngka = rows.filter((l) => !polaUkur.test(l.replace(/\*+/g, "")));
  assert.deepEqual(
    tanpaAngka,
    [],
    `Baris §7 tanpa angka hasil ukur:\n${tanpaAngka.map((r) => "  " + r.trim().slice(0, 80)).join("\n")}`,
  );
});
