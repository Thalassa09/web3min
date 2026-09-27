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

test("komponen kanonik <Chip> mematuhi empat aturan keras", () => {
  // Kontrak chip sudah punya guard sejak lama, tapi komponennya baru ada
  // (Langkah 22). Guard ini mengunci komponennya supaya tone baru tidak bisa
  // ditambahkan dengan border transparan / slab hilang / radius bukan pill.
  const chip = readFileSync(join(ROOT, "src/components/ui/chip.tsx"), "utf8");

  // A. bentuk stadium penuh
  assert.match(chip, /rounded-full/, "Chip wajib rounded-full (aturan A)");
  assert.ok(
    !/rounded-(?:lg|xl|2xl|md)\b|rounded-\[(?:8|10|12|14|16|18)px\]/.test(chip),
    "Chip tidak boleh memakai radius bukan-pill (aturan A)",
  );

  // B. border solid — tidak ada border ber-opacity
  assert.ok(
    !/border-[a-zA-Z]+-\d+\/\d+/.test(chip),
    "Chip tidak boleh memakai border transparan/ber-opacity (aturan B)",
  );

  // C. hard slab blur nol
  assert.match(chip, /shadow-\[0_2px_0_#[0-9A-Fa-f]{6}\]/, "Chip wajib hard slab 2px (aturan C)");
  assert.ok(
    !/shadow-(?:sm|md|lg|xl)\b/.test(chip),
    "Chip tidak boleh memakai shadow ber-blur (aturan C)",
  );

  // D. teks putih hanya di atas ramp gelap
  const whiteTones = [...chip.matchAll(/\b(\w+):\s*"[^"]*\btext-white\b[^"]*"/g)].map((m) => m[1]);
  assert.deepEqual(
    whiteTones,
    ["danger"],
    `teks putih hanya sah di tone danger (ramp gelap teruji), bukan: ${whiteTones.join(", ")}`,
  );
});

test("setiap tone <Chip> memakai border & slab sefamili (satu keluarga warna)", () => {
  // Aturan paling mudah dilanggar saat menambah tone baru: border satu keluarga,
  // slab keluarga lain.
  //
  // PENTING — "sefamili" BUKAN "hex identik". Chip acuan di /profile (dipin
  // guard di atas) memakai border-candy-600 (#D62A78) + slab #B01F62; itu SAH
  // karena keduanya keluarga pink. DESIGN.md §6.3 menulis pasangan yang sama.
  // Jadi yang diperiksa: kedua hex harus berasal dari keluarga warna yang sama.
  const chip = readFileSync(join(ROOT, "src/components/ui/chip.tsx"), "utf8");
  const tones = [...chip.matchAll(/^\s{8}(\w+):\s*"([^"]+)"/gm)];

  assert.ok(tones.length >= 6, `harus ada minimal 6 tone, ditemukan ${tones.length}`);

  // Peta token -> hex, dibaca dari @theme supaya tidak ada hex hardcoded di test.
  const css = readFileSync(join(ROOT, "src/styles.css"), "utf8");
  const theme = css.match(/@theme \{([\s\S]*?)\n\}/)![1];
  const tokenHex = new Map<string, string>();
  for (const m of theme.matchAll(/--color-([a-z0-9-]+)\s*:\s*(#[0-9A-Fa-f]{6})\s*;/g)) {
    tokenHex.set(m[1], m[2].toUpperCase());
  }
  // Satu hex punya BANYAK alias (mis. #3B2218 = choco-900, ink-900, border,
  // primary-shadow, ...). Simpan semuanya — kalau hanya menyimpan satu nama,
  // keluarga yang terbaca bisa salah hanya karena urutan deklarasi.
  const hexTokens = new Map<string, string[]>();
  for (const [n, h] of tokenHex) {
    const list = hexTokens.get(h) ?? [];
    list.push(n);
    hexTokens.set(h, list);
  }

  /** Keluarga warna dari nama token: candy/pink, choco, ok/mint, warn/gold, dst. */
  const family = (token: string): string => {
    // Urutan penting: `ok-ink` mengandung "ink" tapi keluarganya GREEN, bukan
    // choco. Periksa awalan yang spesifik dulu, jangan pakai pola "mengandung".
    if (/^(?:ok|mint|leaf|emerald)/.test(token)) return "green";
    if (/^(?:warn|amber)/.test(token)) return "amber";
    if (/^(?:lemon|coin|gold)/.test(token)) return "gold";
    if (/^(?:danger|ruby|err|red)/.test(token)) return "red";
    if (/^(?:candy|pink|blobi|rose)/.test(token)) return "pink";
    if (/^(?:choco|ink)/.test(token)) return "choco";
    return token;
  };

  const broken: string[] = [];
  for (const [, tone, cls] of tones) {
    const borderTok = cls.match(/\bborder-([a-z0-9-]+)\b(?!-)/)?.[1];
    const slabHex = cls.match(/shadow-\[0_2px_0_(#[0-9A-Fa-f]{6})\]/)?.[1]?.toUpperCase();
    if (!borderTok || !slabHex) {
      broken.push(`${tone}: border atau slab tidak terdeteksi`);
      continue;
    }
    if (!tokenHex.has(borderTok)) {
      broken.push(`${tone}: border-${borderTok} bukan token @theme`);
      continue;
    }
    const slabTokNames = hexTokens.get(slabHex);
    if (!slabTokNames) {
      broken.push(`${tone}: slab ${slabHex} bukan token @theme (hex mentah dilarang)`);
      continue;
    }
    // Sah kalau ADA SATU alias dari hex slab yang sekeluarga dengan border.
    const borderFam = family(borderTok);
    const match = slabTokNames.some((n) => family(n) === borderFam);
    if (!match) {
      broken.push(
        `${tone}: border-${borderTok} (${borderFam}) vs slab ${slabHex} = ${slabTokNames.join("/")} — beda keluarga`,
      );
    }
  }
  assert.deepEqual(
    broken,
    [],
    `Aturan sefamili dilanggar (border & slab harus satu keluarga warna):\n${broken.map((b) => `  ${b}`).join("\n")}`,
  );
});
