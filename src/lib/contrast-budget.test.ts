import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const css = readFileSync(join(ROOT, "src/styles.css"), "utf8");

function luminance(hex: string) {
  const h = hex.replace("#", "");
  const [r, g, b] = [0, 2, 4].map((i) => {
    const c = parseInt(h.slice(i, i + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
function contrast(a: string, b: string) {
  const [x, y] = [luminance(a), luminance(b)].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
}

const token = (name: string) => {
  const m = css.match(new RegExp(`--color-${name}\\s*:\\s*(#[0-9A-Fa-f]{6})`));
  assert.ok(m, `--color-${name} must be declared as a hex in @theme`);
  return m![1];
};

/**
 * AGENTS.md: "Kontras ≥4.5:1". Body text classes that ship white-on-pink are the
 * ones that actually get read, so pin the worst case rather than a token nobody
 * uses. The gradient CTAs lighten to ~#FF6BA6 mid-stop, which is the real
 * background behind the label — not the --color-candy-500 base.
 */
test("body text clears 4.5:1 on every surface it actually sits on", () => {
  const cream = token("cream");
  const choco700 = token("choco-700");
  const choco600 = token("choco-600");
  const choco900 = token("choco-900");
  const deep = token("candy-900");

  for (const [label, fg] of [
    ["choco-900/cream", choco900],
    ["choco-700/cream", choco700],
    ["choco-600/cream", choco600],
    ["candy-900/cream (judul pink)", deep],
  ] as const) {
    const v = contrast(fg, cream);
    assert.ok(v >= 4.5, `${label} = ${v.toFixed(2)}:1 — di bawah 4.5:1`);
  }
});

test("white labels only sit on surfaces dark enough for white text", () => {
  // Surface must be at least 4.5:1 against white, i.e. dark enough.
  // CATATAN sweep 2026-09-27: candy-800/900 tidak lagi dipakai sebagai
  // permukaan berlabel putih di src/ (semua permukaan pink kini pastel rose
  // berlabel choco-900), tapi nilainya tetap diuji karena token-nya masih ada
  // dan bisa dipakai kapan saja — permukaan gelap apa pun wajib lolos.
  for (const name of ["candy-700", "candy-800", "candy-900", "choco-900"]) {
    const v = contrast("#FFFFFF", token(name));
    assert.ok(v >= 4.5, `white on --color-${name} = ${v.toFixed(2)}:1 — terlalu terang untuk teks putih`);
  }
});

test("label choco-900 di atas permukaan pastel rose lolos AA (sweep 2026-09-27)", () => {
  // Sweep "candy gelap -> pastel rose": permukaan blush-50 -> blush-200
  // berlabel choco-900. Titik terburuk = stop TERGELAP (blush-200 #FDC8D8).
  const choco = token("choco-900");
  for (const name of ["blush-50", "blush-200"]) {
    const v = contrast(choco, token(name));
    assert.ok(v >= 4.5, `choco-900 di atas --color-${name} = ${v.toFixed(2)}:1 — di bawah 4.5:1`);
  }
  // `hover:brightness-105` menaikkan kecerahan latar → rasio NAIK, bukan turun.
  // Jadi tidak ada state hover yang perlu diuji terpisah seperti dulu.
});

test("no white text sits on --color-candy-500 (3.79:1)", () => {
  // The gap is closed by moving the LABEL's surface, not by changing the brand:
  // every pink fill that carries white text moved to candy-700/800/950, and
  // candy-500 is left doing border / ring / dot duty, which has no contrast
  // requirement. This test is what keeps that true — reintroducing
  // `bg-candy-500 ... text-white` on one line fails here.
  const files: string[] = [];
  const walk = (dir: string) => {
    for (const e of readdirSync(dir, { withFileTypes: true })) {
      const p = join(dir, e.name);
      if (e.isDirectory()) {
        if (e.name !== "8bit") walk(p);
      } else if (e.name.endsWith(".tsx")) files.push(p);
    }
  };
  walk(join(ROOT, "src"));

  const offenders = files
    .flatMap((f) =>
      readFileSync(f, "utf8")
        .split("\n")
        .map((line, i) => ({ f, i: i + 1, line }))
        .filter(({ line }) => /\bbg-candy-(?:400|500)\b/.test(line) && /\btext-white\b/.test(line))
        .map(({ f, i }) => `${f.replace(ROOT + "/", "")}:${i}`),
    )
    .sort();

  assert.deepEqual(
    offenders,
    [],
    `white labels on candy-400/500 fail AA (3.79:1) — use candy-700/800: ${offenders.join(", ")}`,
  );
});

test("nav & tombol Lanjut memakai pastel rose berlabel choco-900 (sweep 2026-09-27)", () => {
  // Sejak sweep "candy gelap -> pastel rose" SELURUH elemen aktif di
  // bottom-nav (tab nav DAN tombol "Lanjut") memakai blush-50 -> blush-200
  // dengan label/ikon choco-900. Guard lama mengunci ramp gelap 3-stop +
  // label putih; sekarang yang dikunci adalah:
  //   1. CANDY_ACTIVE memuat ramp pastel 2-stop (blush-50 -> blush-200),
  //   2. TIDAK ada `text-white` di berkas itu (label pasti choco-900),
  //   3. kontras choco-900 di stop TERGELAP (blush-200) >= 4.5:1.
  const nav = readFileSync(join(ROOT, "src/components/bottom-nav.tsx"), "utf8");
  const decl = nav.match(/const CANDY_ACTIVE\s*=\s*([\s\S]*?);\n/);
  assert.ok(decl, "CANDY_ACTIVE declaration not found in bottom-nav.tsx");

  const themeCss = readFileSync(join(ROOT, "src/styles.css"), "utf8");
  const resolveToken = (name: string): string | null => {
    const m = themeCss.match(new RegExp(`--color-${name}:\\s*(#[0-9A-Fa-f]{6})`));
    return m ? m[1] : null;
  };

  const stops: string[] = [];
  for (const m of decl![1].matchAll(
    /(?:^|[\s"'])(?:from|via|to)-\[#([0-9A-Fa-f]{6})\]|(?:^|[\s"'])(?:from|via|to)-([a-z][\w-]*)/g,
  )) {
    if (m[1]) {
      stops.push("#" + m[1]);
      continue;
    }
    if (/^(b|t|l|r|bl|br|tl|tr)$/.test(m[2])) continue;
    const hex = resolveToken(m[2]);
    assert.ok(
      hex,
      `CANDY_ACTIVE memakai token \`${m[2]}\` yang tidak ada di @theme — kontrasnya tidak bisa diukur`,
    );
    stops.push(hex!);
  }
  assert.ok(stops.length >= 2, `expected a pastel ramp in CANDY_ACTIVE, found ${stops.length}: ${stops.join(", ")}`);

  // Label & ikon wajib gelap — nol teks putih di seluruh berkas.
  // Komentar dibuang dulu: komentar dokumentasi justru MENYEBUT `text-white`
  // untuk menjelaskan kenapa ia dilarang (guard yang memindai komentarnya
  // sendiri = false FAIL).
  const navKode = nav.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/[^\n]*/g, "");
  assert.ok(
    !/\btext-white\b/.test(navKode),
    "bottom-nav tidak boleh punya `text-white` lagi — label pastel wajib choco-900 (sweep 2026-09-27)",
  );

  const choco900 = resolveToken("choco-900")!;
  for (const s of stops) {
    const v = contrast(choco900, s);
    assert.ok(v >= 4.5, `nav ramp stop ${s} = ${v.toFixed(2)}:1 — label choco-900 gagal AA`);
  }
});

test("KNOWN GAP: --color-candy-500 stays too light for white text (3.79:1)", () => {
  // Kept as documentation of WHY the fills moved. candy-500 is still the brand
  // pink and must not be darkened (AGENTS.md), so it must never carry a label.
  const v = contrast("#FFFFFF", token("candy-500"));
  assert.ok(v < 4.5 && v > 3, `candy-500 vs white drifted to ${v.toFixed(2)}:1 — revisit the CTA fill rules`);
});

test("alpha-reduced choco text on the locked-block surface stays >= 4.5:1", () => {
  // Langkah 27: badge blok TERKUNCI memakai `bg-[#EAE4DC] text-choco-600/80`.
  // Opacity 80% menurunkan rasio dari 6.24 (teks penuh) ke 4.01 — GAGAL AA
  // untuk teks 10px. Terukur, bukan dugaan: choco-600 penuh = 6.24,
  // @90% = 4.98, @80% = 4.01.
  //
  // Pelajaran: opacity pada WARNA TEKS adalah cara paling mudah merusak
  // kontras tanpa mengubah token apa pun — guard token-vs-token di atas
  // tidak akan pernah menangkapnya. Guard ini memindai kode.
  const surface = "#EAE4DC";
  const choco600 = token("choco-600");

  const mix = (fg: string, bg: string, a: number) =>
    "#" +
    [0, 2, 4]
      .map((i) => {
        const f = parseInt(fg.slice(1 + i, 3 + i), 16);
        const b = parseInt(bg.slice(1 + i, 3 + i), 16);
        return Math.round(f * a + b * (1 - a)).toString(16).padStart(2, "0");
      })
      .join("");

  // Batas bawah yang masih lulus: cari alpha terendah yang >= 4.5.
  let alphaAman = 1;
  for (let a = 1; a >= 0.5; a -= 0.01) {
    if (contrast(mix(choco600, surface, a), surface) >= 4.5) alphaAman = a;
    else break;
  }
  assert.ok(alphaAman > 0.8, `alpha aman terhitung ${alphaAman.toFixed(2)} — di luar dugaan, tinjau ulang`);

  const files: string[] = [];
  const walk = (dir: string) => {
    for (const e of readdirSync(dir, { withFileTypes: true })) {
      const p = join(dir, e.name);
      if (e.isDirectory()) {
        if (e.name !== "8bit") walk(p);
      } else if (e.name.endsWith(".tsx")) files.push(p);
    }
  };
  walk(join(ROOT, "src"));

  const offenders: string[] = [];
  for (const f of files) {
    for (const [i, line] of readFileSync(f, "utf8").split("\n").entries()) {
      // Cocokkan kelas MAUPUN hex. Bug nyata (Langkah 36): guard ini dulu
      // HANYA mencari `bg-[#EAE4DC]`. Setelah migrasi token, badge terkunci
      // memakai `bg-line-warm` — jadi guard DIAM-DIAM berhenti menguji apa pun
      // (lolos palsu). Guard yang tidak lagi cocok lebih berbahaya daripada
      // tidak ada guard: ia memberi rasa aman.
      if (!/bg-\[#EAE4DC\]|bg-line-warm/.test(line)) continue;
      // cari text-choco-<n>/<alpha> di baris yang sama
      for (const m of line.matchAll(/text-choco-(\d+)\/(\d+)/g)) {
        const a = parseInt(m[2], 10) / 100;
        const hex = token(`choco-${m[1]}`);
        const v = contrast(mix(hex, surface, a), surface);
        if (v < 4.5) {
          offenders.push(`${f.replace(ROOT + "/", "")}:${i + 1} — choco-${m[1]}/${m[2]} = ${v.toFixed(2)}:1`);
        }
      }
    }
  }

  assert.deepEqual(
    offenders,
    [],
    `Teks ber-opacity di atas ${surface} gagal AA (butuh alpha >= ${alphaAman.toFixed(2)}):\n${offenders.map((o) => `  ${o}`).join("\n")}`,
  );
});