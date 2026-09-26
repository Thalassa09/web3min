import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

/**
 * Chip/badge contract guard (DESIGN.md §6).
 *
 * Acuan: dua chip di `/profile` (Level 2 netral, Murid Blobi rose). Semua chip
 * status wajib: bentuk pill penuh, border SOLID sefamili, dan hard slab shadow
 * (blur nol). Sebelum kontrak ini, ada 12 chip menyimpang di 6 berkas.
 *
 * Definisi chip sengaja sempit supaya kartu konten, input form, tombol aksi,
 * dan pill dock navigasi TIDAK ikut terjaring: elemen harus <span>, punya
 * border-2, teks kecil (<= text-xs), padding sempit (px-2..3.5 + py-0.5..1.5),
 * dan bukan elemen bersize tetap (size-*, h-*, w-full, flex-1).
 */

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "..");

const SPAN = /<span\b/;
const BORDER2 = /\bborder-2\b/;
const SMALL_TEXT = /\btext-\[(?:9|10|11|12)px\]|\btext-xs\b/;
const NARROW_PX = /\bpx-(?:2|2\.5|3|3\.5)\b/;
const SHORT_PY = /\bpy-(?:0\.5|1|1\.5)\b/;
const CARDISH = /\b(?:size-\d|size-\[|h-\d|h-\[|w-full|flex-1|min-h-\[4)/;

const NON_PILL = /rounded-\[(?:8|10|12|14|16|18)px\]|\brounded-(?:lg|xl|2xl|md)\b/;
const TRANSLUCENT_BORDER = /\bborder-[a-zA-Z]+-\d+\/\d+|\bborder-\[#[0-9A-Fa-f]{6}\]\/\d+/;
const HARD_SLAB = /shadow-\[[^\]]*0_[0-9.]+px_0_[^\]]*\]/;

function tsxFiles(dir: string, acc: string[] = []): string[] {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) {
      if (e.name !== "8bit") tsxFiles(p, acc);
    } else if (e.name.endsWith(".tsx")) acc.push(p);
  }
  return acc;
}

function offendingChips() {
  const out: { file: string; line: number; flags: string[]; text: string }[] = [];
  for (const file of tsxFiles(join(ROOT, "src"))) {
    const lines = readFileSync(file, "utf8").split("\n");
    lines.forEach((line, i) => {
      const isChip =
        SPAN.test(line) &&
        BORDER2.test(line) &&
        SMALL_TEXT.test(line) &&
        NARROW_PX.test(line) &&
        SHORT_PY.test(line) &&
        !CARDISH.test(line);
      if (!isChip) return;

      const flags: string[] = [];
      if (NON_PILL.test(line)) flags.push("radius bukan pill (wajib rounded-full)");
      if (TRANSLUCENT_BORDER.test(line)) flags.push("border transparan (wajib solid)");
      if (!HARD_SLAB.test(line)) flags.push("tanpa hard slab shadow (wajib shadow-[0_Npx_0_...])");
      if (flags.length) {
        out.push({ file: file.replace(`${ROOT}/`, ""), line: i + 1, flags, text: line.trim() });
      }
    });
  }
  return out;
}

test("setiap chip status memakai bentuk pill penuh (DESIGN.md §6.2-A)", () => {
  const bad = offendingChips().filter((c) => c.flags.some((f) => f.startsWith("radius")));
  assert.equal(
    bad.length,
    0,
    `Chip dengan radius bukan-pill:\n${bad.map((c) => `  ${c.file}:${c.line}\n    ${c.text}`).join("\n")}`,
  );
});

test("setiap chip status memakai border solid sefamili (DESIGN.md §6.2-B)", () => {
  const bad = offendingChips().filter((c) => c.flags.some((f) => f.startsWith("border")));
  assert.equal(
    bad.length,
    0,
    `Chip dengan border transparan:\n${bad.map((c) => `  ${c.file}:${c.line}\n    ${c.text}`).join("\n")}`,
  );
});

test("setiap chip status punya hard slab shadow (DESIGN.md §6.2-C)", () => {
  const bad = offendingChips().filter((c) => c.flags.some((f) => f.startsWith("tanpa")));
  assert.equal(
    bad.length,
    0,
    `Chip tanpa hard slab shadow:\n${bad.map((c) => `  ${c.file}:${c.line}\n    ${c.text}`).join("\n")}`,
  );
});

test("chip acuan di /profile tetap sesuai kontrak", () => {
  const profile = readFileSync(join(ROOT, "src/routes/profile.tsx"), "utf8");
  assert.match(profile, /rounded-full[^"]*from-white to-\[#FBE9DC\][^"]*border-choco-900\b/, "chip Level wajib pill + border choco-900 solid");
  assert.match(profile, /rounded-full[^"]*from-\[#FFF0F5\] to-\[#FDC8D8\][^"]*border-candy-600\b/, "chip Murid Blobi wajib pill + border candy-600 solid");
});
