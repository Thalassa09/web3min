import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const css = readFileSync(join(ROOT, "src/styles.css"), "utf8");

/**
 * Token-scale guard. Dua dokumen desain pernah beredar (DESIGN.md v1.0 lama dan
 * draft "Tactile Arcade" v1.1) yang memakai NAMA token Tailwind sama tapi hex
 * berbeda — lihat DESIGN-SYSTEM.md §8. Menyalin resepnya TIDAK error, hasilnya
 * cuma salah warna/eleveasi diam-diam. Guard ini mengunci skala penuh candy-* &
 * choco-*, bukan hanya nilai yang kebetulan dipakai uji kontras.
 */
const token = (name: string) => {
  const m = css.match(new RegExp(`--color-${name}\\s*:\\s*(#[0-9A-Fa-f]{6})`));
  assert.ok(m, `--color-${name} harus dideklarasikan sebagai hex di @theme`);
  return m![1].toUpperCase();
};

test("skala candy-* terkunci — pink brand #E8437F tidak boleh bergeser", () => {
  // Draft lama menggeser seluruh skala satu tingkat dan MENGHILANGKAN pink
  // brand: candy-500 jadi #D62A78 (yang di kode adalah candy-600). Menukar
  // nilai candy-500/600/700 menggeser 258 pemakaian sekaligus.
  const scale: Record<string, string> = {
    "candy-50": "#FFF4F8",
    "candy-100": "#FFE3EC",
    "candy-200": "#FFC7DA",
    "candy-300": "#FFA3C2",
    "candy-400": "#F26A99",
    "candy-500": "#E8437F", // pink brand — dilindungi AGENTS.md
    "candy-600": "#D62A78",
    "candy-700": "#B01F62",
    "candy-800": "#85174A",
    "candy-900": "#6E1239",
    "candy-950": "#4E0D2A",
  };
  for (const [name, hex] of Object.entries(scale)) {
    assert.equal(
      token(name),
      hex,
      `${name} bergeser dari ${hex}. Skala candy-* tidak boleh direnomori — kalau butuh pink lebih gelap, TAMBAH token baru, jangan geser skalanya (DESIGN-SYSTEM.md §8.1).`,
    );
  }

  // Pink brand wajib tetap ada di skala — bukan cuma di alias.
  const brand = "#E8437F";
  const scaleHexes = Object.values(scale);
  assert.ok(
    scaleHexes.includes(brand),
    `pink brand ${brand} hilang dari skala candy-*. Draft lama memakai #D62A78 sebagai candy-500 sehingga identitas brand hilang (DESIGN-SYSTEM.md §8.1).`,
  );
});

test("skala choco-* terkunci — choco-600 #6B4A3A vs choco-700 #4E3125 jangan tertukar", () => {
  // Dokumen lama menulis "Teks Sekunder = choco-700 = #6B4A3A". Di kode
  // #6B4A3A adalah choco-600, sedangkan choco-700 LEBIH GELAP (#4E3125).
  const scale: Record<string, string> = {
    "choco-900": "#3B2218",
    "choco-800": "#452A1E",
    "choco-700": "#4E3125", // teks utama di atas cream (10,99:1)
    "choco-600": "#6B4A3A", // teks sekunder — dipakai 138× di 34 berkas
    "choco-500": "#8A6552",
    "choco-400": "#9C7A68",
    "choco-300": "#B79A87",
    "choco-100": "#F2E4D8",
    "choco-50": "#FBF4EF",
  };
  for (const [name, hex] of Object.entries(scale)) {
    assert.equal(
      token(name),
      hex,
      `${name} bergeser dari ${hex}. Teks sekunder = choco-600, teks utama = choco-700 (DESIGN-SYSTEM.md §8.3).`,
    );
  }

  // Hierarki harus tetap benar: choco-700 lebih gelap dari choco-600.
  const lum = (hex: string) => {
    const h = hex.replace("#", "");
    const [r, g, b] = [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16));
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };
  assert.ok(
    lum(token("choco-700")) < lum(token("choco-600")),
    "choco-700 harus LEBIH GELAP dari choco-600 — kalau tidak, hierarki teks terbalik",
  );
});

test("token shadow-slab-* tidak boleh dipakai — Tailwind gagal SENYAP", () => {
  // Tailwind tidak error untuk class tak dikenal: `shadow-slab-md` hanya
  // menghasilkan TIDAK ADA bayangan, jadi komponen kehilangan elevasi 3D tanpa
  // peringatan. Draft v1.1 mendefinisikan 5 token ini, kode nyata nol.
  const walk = (dir: string, out: string[] = []): string[] => {
    for (const e of readdirSync(dir)) {
      const p = join(dir, e);
      if (statSync(p).isDirectory()) walk(p, out);
      // Lewati file test: guard ini sendiri menyebut polanya di komentar, dan
      // kontrak ini mengikat kode komponen — bukan file test.
      else if (/\.tsx?$/.test(p) && !/\.test\.tsx?$/.test(p)) out.push(p);
    }
    return out;
  };

  const offenders: string[] = [];
  for (const file of walk(join(ROOT, "src"))) {
    const txt = readFileSync(file, "utf8");
    if (/shadow-slab-(press|xs|sm|md|lg)/.test(txt)) {
      offenders.push(file.replace(`${ROOT}/`, ""));
    }
  }
  assert.deepEqual(
    offenders,
    [],
    `shadow-slab-* tidak ada di @theme dan akan gagal senyap. Pakai shadow-ink-sm / shadow-[0_4px_0_#3B2218] (DESIGN-SYSTEM.md §8.2). Pelanggar: ${offenders.join(", ")}`,
  );
});
