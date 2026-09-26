import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const read = (p: string) => readFileSync(join(ROOT, p), "utf8");

/**
 * Guard sinkronisasi token Tamagui ↔ Tailwind.
 *
 * Sejak Tamagui dipasang (Langkah 19) ada DUA sistem styling yang hidup
 * berdampingan: Tailwind v4 (`@theme` di `src/styles.css`) untuk 100% UI
 * produksi, dan Tamagui (`src/tamagui.config.ts`) untuk komponen baru.
 * Dua sumber warna = risiko drift: satu diubah, yang lain tidak, dan
 * warna brand pelan-pelan bercabang tanpa ada yang gagal.
 *
 * Test ini mengunci nilai token Tamagui agar SELALU sama dengan `@theme`.
 * Kalau kamu sengaja mengubah warna brand, ubah DUA tempat — dan test ini
 * akan memberitahu tempat kedua yang terlupa.
 */

/** Ambil nilai hex sebuah token dari blok @theme Tailwind. */
function tailwindToken(name: string): string {
  const css = read("src/styles.css");
  const m = css.match(new RegExp(`--color-${name}\\s*:\\s*(#[0-9A-Fa-f]{6})`));
  assert.ok(m, `--color-${name} harus ada di @theme src/styles.css`);
  return m![1].toUpperCase();
}

/** Ambil nilai hex dari `src/tamagui.config.ts`. */
function tamaguiToken(name: string): string {
  const cfg = read("src/tamagui.config.ts");
  const m = cfg.match(new RegExp(`\\b${name}\\s*:\\s*"(#[0-9A-Fa-f]{6})"`));
  assert.ok(m, `token "${name}" harus ada di src/tamagui.config.ts`);
  return m![1].toUpperCase();
}

test("token warna Tamagui sama persis dengan @theme Tailwind", () => {
  // Pasangan [nama di tamagui.config.ts, nama token Tailwind]
  const pairs: [string, string][] = [
    ["cream", "cream"],
    ["choco900", "choco-900"],
    ["choco700", "choco-700"],
    ["choco600", "choco-600"],
    ["choco500", "choco-500"],
    ["candy500", "candy-500"],
    ["candy700", "candy-700"],
    ["candy900", "candy-900"],
    ["pinkDark", "candy-700"], // alias semantik: label putih di ramp gelap
    ["pinkDarker", "candy-800"],
  ];

  for (const [tg, tw] of pairs) {
    assert.equal(
      tamaguiToken(tg),
      tailwindToken(tw),
      `Tamagui "${tg}" (${tamaguiToken(tg)}) != Tailwind "--color-${tw}" (${tailwindToken(tw)}) — sinkronkan keduanya`,
    );
  }
});

test("pink brand Tamagui memakai #E8437F — jangan diganti biru/ungu/hijau", () => {
  // AGENTS.md: aksen pink adalah identitas brand. Test ini mengunci nilainya
  // supaya tema bawaan Tamagui tidak diam-diam menang.
  assert.equal(tamaguiToken("pink"), "#E8437F", "pink brand harus #E8437F");
  assert.equal(tamaguiToken("candy500"), "#E8437F", "candy-500 harus #E8437F");
});

test("label putih Tamagui hanya boleh di ramp gelap yang lolos WCAG AA", () => {
  // Angka kontras terukur (DESIGN-SYSTEM.md §2.3): candy-500 3.79:1 GAGAL,
  // candy-700 6.53:1 LULUS. Token "pinkDark" yang dipakai label putih wajib
  // menunjuk ke candy-700, bukan candy-500.
  assert.equal(
    tamaguiToken("pinkDark"),
    tailwindToken("candy-700"),
    "pinkDark (permukaan label putih) harus candy-700 #B01F62 (6.53:1), bukan pink terang",
  );
});

test("font Tamagui = Space Grotesk (heading) + Inter (body) — tepat 2 keluarga", () => {
  const cfg = read("src/tamagui.config.ts");

  // Keluarga mati tidak boleh kembali lewat pintu Tamagui.
  for (const dead of ["Bricolage Grotesque", "Plus Jakarta Sans", "Pixelify Sans"]) {
    assert.ok(
      !cfg.includes(dead),
      `${dead} sudah keluar dari budget font — jangan dimasukkan lagi lewat tamagui.config.ts`,
    );
  }

  assert.ok(
    /FONT_SPACE\s*=\s*"'Space Grotesk',\s*Inter/.test(cfg),
    "font heading Tamagui harus 'Space Grotesk' dengan fallback Inter",
  );
  assert.ok(
    /FONT_INTER\s*=\s*"Inter,/.test(cfg),
    "font body Tamagui harus 'Inter'",
  );
});

test("Tamagui TIDAK memakai reanimated (app web, bukan native)", () => {
  // Driver animasi yang dipakai harus CSS. Reanimated menarik react-native
  // penuh ke bundle dan tidak dibutuhkan di TanStack Start SSR.
  const cfg = read("src/tamagui.config.ts");
  assert.ok(
    cfg.includes("@tamagui/config/v5-css"),
    "animasi harus dari @tamagui/config/v5-css",
  );
  assert.ok(
    !cfg.includes("v5-reanimated") && !cfg.includes("@tamagui/animations-reanimated"),
    "reanimated tidak boleh dipakai — app ini web-only",
  );
});
