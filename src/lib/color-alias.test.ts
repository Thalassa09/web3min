import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const css = readFileSync(join(ROOT, "src/styles.css"), "utf8");
const theme = css.match(/@theme \{([\s\S]*?)\n\}/)![1];

/**
 * Peta alias warna. `@theme` mendeklarasikan 101 nama `--color-*` yang hanya
 * berisi 63 hex unik — 20+ di antaranya dipakai BEBERAPA nama sekaligus
 * (alias kompatibilitas + token shadcn). Alias itu SAH dan jangan dihapus
 * (ratusan call-site memakainya), tapi kalau salah satu anggotanya diubah
 * sendirian, dua nama yang seharusnya sama warna akan **diam-diam berbeda** —
 * dan tidak ada test lain yang menangkapnya karena guard kontras hanya
 * memeriksa nama yang kebetulan dipakai uji.
 *
 * Guard ini mengunci peta itu: setiap nama dalam satu grup WAJIB resolve ke hex
 * yang sama. Jadi mengubah `candy-500` tanpa mengubah `primary`/`ring`/`blobi`
 * akan gagal di sini.
 */
const declared = new Map<string, string>();
for (const m of theme.matchAll(/--color-([a-z0-9-]+)\s*:\s*(#[0-9A-Fa-f]{6})\s*;/g)) {
  declared.set(m[1], m[2].toUpperCase());
}

const hex = (name: string) => {
  const v = declared.get(name);
  assert.ok(v, `--color-${name} harus dideklarasikan sebagai hex di @theme`);
  return v;
};

test("setiap grup alias resolve ke satu hex yang sama", () => {
  const groups: Record<string, string[]> = {
    "#3B2218": ["choco-900", "ink-900", "line", "line-strong", "card-foreground", "foreground", "border", "primary-shadow"],
    "#FFE3EC": ["candy-100", "candy-soft", "primary-soft", "ruby-soft", "blobi-soft"],
    "#6B4A3A": ["choco-600", "ink-500", "ink-700", "muted", "muted-foreground"],
    "#E8437F": ["candy-500", "primary", "ring", "blobi"],
    "#B01F62": ["candy-700", "candy-deep", "primary-deep"],
    "#FFF6EE": ["cream", "canvas", "paper"],
    "#A02025": ["danger-shadow", "ruby-shadow", "blobi-shadow"],
    "#F26A99": ["candy-400", "brand"],
    "#D62A78": ["candy-600", "primary-hover"],
    "#9C7A68": ["choco-400", "ink-300"],
    "#F2E4D8": ["choco-100", "ink-100"],
    "#6FE3C1": ["mint", "leaf"],
    "#1E9E78": ["mint-deep", "leaf-deep"],
    "#FFD84D": ["lemon", "coin"],
    "#D9A400": ["lemon-deep", "coin-shadow"],
    "#FF8A3D": ["streak", "flame"],
    "#E5484D": ["danger", "ruby"],
    "#17805F": ["ok", "ok-ink"],
    "#8A6100": ["warn-ink", "coin-ink"],
    "#0F6045": ["ok-shadow", "leaf-shadow"],
  };

  const broken: string[] = [];
  for (const [want, names] of Object.entries(groups)) {
    for (const n of names) {
      const got = hex(n);
      if (got !== want) broken.push(`${n} = ${got}, seharusnya ${want} (grup alias ${want})`);
    }
  }
  assert.deepEqual(
    broken,
    [],
    `Alias warna pecah — dua nama yang seharusnya sama jadi beda warna:\n${broken.map((b) => `  ${b}`).join("\n")}`,
  );
});

test("peta alias tetap lengkap — 101 deklarasi, 100 nama, 63 hex unik", () => {
  // Angka ini adalah hasil pengukuran `@theme`, bukan target yang dikarang.
  // Kalau berubah, itu keputusan sadar: perbarui DESIGN-SYSTEM.md §Colors dulu,
  // baru angka di sini.
  //
  // 101 deklarasi tapi 100 nama: `--color-flame` ditulis DUA KALI dengan nilai
  // sama (#FF8A3D) — duplikasi tak berbahaya, tapi dihitung apa adanya supaya
  // angka di dokumen tidak pernah lebih rapi dari kenyataan.
  const all = [...theme.matchAll(/--color-([a-z0-9-]+)\s*:/g)].map((m) => m[1]);
  const uniqueNames = new Set(all);
  const uniqueHex = new Set([...declared.values()]);

  assert.equal(all.length, 101, `jumlah deklarasi --color-* berubah dari 101 jadi ${all.length}`);
  assert.equal(
    uniqueNames.size,
    100,
    `jumlah nama --color-* unik berubah dari 100 jadi ${uniqueNames.size}. Perbarui peta alias di DESIGN-SYSTEM.md §Colors + guard ini kalau memang disengaja.`,
  );
  assert.equal(
    uniqueHex.size,
    63,
    `jumlah hex unik berubah dari 63 jadi ${uniqueHex.size}. Alias baru/terhapus harus tercermin di DESIGN-SYSTEM.md §Colors.`,
  );

  // Setiap nama yang terdaftar di `declared` harus benar-benar ada.
  for (const name of declared.keys()) {
    assert.ok(uniqueNames.has(name), `--color-${name} hilang dari @theme`);
  }
});

test("warna brand dilindungi — pink & choco-900 tetap jadi acuan alias", () => {
  // AGENTS.md: "jangan ganti pink brand". Alias `blobi`/`primary`/`ring` adalah
  // nama lain untuk pink brand; kalau salah satu lepas dari grup, warna
  // identitas bisa berubah di sebagian layar saja.
  assert.equal(hex("candy-500"), "#E8437F", "pink brand harus tetap #E8437F di candy-500");
  assert.equal(hex("primary"), "#E8437F", "primary harus tetap sama dengan pink brand");
  assert.equal(hex("ring"), "#E8437F", "ring harus tetap sama dengan pink brand");
  assert.equal(hex("blobi"), "#E8437F", "blobi (maskot) harus tetap sama dengan pink brand");
  assert.equal(hex("choco-900"), "#3B2218", "choco-900 adalah acuan outline & slab");
  assert.equal(hex("ink-900"), "#3B2218", "ink-900 harus tetap alias choco-900");
});
