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

test("hex mentah yang tokennya SUDAH ADA tidak boleh ditulis inline", () => {
  // Akar drift yang ditemukan di Langkah 32: 299 pemakaian hex mentah, dan
  // 80 di antaranya memakai hex yang token-nya SUDAH ADA di `@theme`
  // (`from-[#B01F62]` padahal ada `candy-700`). Itu bukan pilihan gaya — itu
  // drift: nilainya bisa berubah di token tanpa mengubah komponen, dan
  // sebaliknya komponen bisa "diam-diam" memakai warna yang berbeda dari token.
  //
  // Hex yang BELUM punya token tetap boleh inline — sebagian sah (gradien
  // multi-stop satu-off, warna artwork). Yang dilarang hanya yang duplikat.
  const css = readFileSync(join(ROOT, "src/styles.css"), "utf8");
  const theme = css.match(/@theme \{([\s\S]*?)\n\}/)![1];
  const known = new Set<string>();
  for (const m of theme.matchAll(/--color-[\w-]+:\s*(#[0-9A-Fa-f]{6})/g)) {
    known.add(m[1].toUpperCase());
  }

  const offenders: string[] = [];
  // Berkas yang SENGAJA dipin dengan hex literal oleh guard lain — jangan
  // dipaksa pindah ke token, karena guard itu mem-verifikasi chip acuan
  // (DESIGN.md §6) lewat string persisnya. Kalau ikut diganti, guard chip
  // gagal dan acuan visualnya jadi tidak terkunci.
  const PINNED = new Set(["src/routes/profile.tsx"]);
  for (const { path, src } of FILES) {
    if (PINNED.has(path)) continue;
    src.split("\n").forEach((line, i) => {
      for (const m of line.matchAll(/(?:bg|border|text|from|via|to|ring)-\[#([0-9A-Fa-f]{6})\]/g)) {
        const hex = ("#" + m[1]).toUpperCase();
        if (known.has(hex)) offenders.push(`${path}:${i + 1} → ${hex}`);
      }
    });
  }

  assert.deepEqual(
    offenders,
    [],
    `Hex mentah yang token-nya sudah ada di @theme — pakai tokennya:\n${offenders
      .map((o) => "  " + o)
      .join("\n")}`,
  );
});

test("palet Tailwind asing tidak boleh BERTAMBAH (ratchet — DESIGN.md §7)", () => {
  // Temuan Langkah 33: 172 pemakaian palet bawaan Tailwind (`emerald-*`,
  // `amber-*`, `orange-*`, `rose-*`) di 30+ berkas — warna yang TIDAK ada di
  // `@theme`. Warna itu tetap ter-render (jadi nol error) tapi berarti:
  //   (a) halaman memakai warna di luar identitas web3min, dan
  //   (b) nilai kontrasnya tidak pernah diukur guard mana pun.
  //
  // Mengganti 172 pemakaian sekaligus = mengubah tampilan 30+ halaman tanpa
  // bisa diperiksa satu per satu. Karena itu guard ini memakai pola RATCHET:
  // daftar di bawah membekukan berkas yang MASIH kotor. Yang sudah bersih
  // tidak boleh jadi kotor lagi, dan jumlah per berkas tidak boleh naik.
  //
  // Cara memakainya: migrasikan satu berkas, lalu HAPUS dari daftar ini.
  // Angka yang lebih kecil dari daftar = boleh (kemajuan); lebih besar = gagal.
  const BEKAS: Record<string, number> = {
    "src/components/censored-username-modal.tsx": 5,
    "src/components/game-overlay-hud.tsx": 1,
    "src/components/lesson/exercises.tsx": 5,
    "src/components/lesson/player.tsx": 1,
    "src/components/pulau-rantai-map.tsx": 1,
    "src/components/pulau-rantai-progres.tsx": 15,
    "src/components/side-nav.tsx": 1,
    "src/components/ui/button.tsx": 1,
    "src/components/ui/chain-block.tsx": 3,
    "src/routes/about.tsx": 6,
    "src/routes/admin.tsx": 0,
    "src/routes/cara.tsx": 7,
    "src/routes/kisah.$storyId.tsx": 2,
    "src/routes/kisah.index.tsx": 7,
    "src/routes/leaderboard.tsx": 41,
    "src/routes/masuk.tsx": 6,
    "src/routes/onboarding.tsx": 9,
    "src/routes/privacy.tsx": 12,
    "src/routes/profile.tsx": 6,
    "src/routes/raffle.tsx": 32,
    "src/routes/settings.tsx": 10,
    "src/routes/shop.tsx": 7,
  };
  // Panel admin sengaja netral (tabel data) — tidak dihitung sama sekali.
  const ABAIKAN = new Set([
    "src/routes/admin.tsx",
    "src/components/admin-stats.tsx",
    "src/components/admin-raffle-modal.tsx",
  ]);

  const ASING = /\b(emerald|amber|orange|rose|violet|sky|teal|indigo|fuchsia)-\d{2,3}\b/;
  const counts: Record<string, number> = {};
  for (const { path, src } of FILES) {
    if (ABAIKAN.has(path)) continue;
    const n = src.split("\n").filter((l) => ASING.test(l)).length;
    if (n > 0) counts[path] = n;
  }

  const naik: string[] = [];
  for (const [path, n] of Object.entries(counts)) {
    const batas = BEKAS[path];
    if (batas === undefined) {
      naik.push(`${path} — BERKAS BARU memakai palet asing (${n} baris)`);
    } else if (n > batas) {
      naik.push(`${path} — naik dari ${batas} jadi ${n} baris`);
    }
  }

  assert.deepEqual(
    naik,
    [],
    `Palet Tailwind asing BERTAMBAH — pakai token web3min (leaf-*/coin-*/streak/candy-*):\n${naik
      .map((o) => "  " + o)
      .join("\n")}\n\nKalau ini perbaikan, turunkan angkanya di BEKAS (atau hapus berkasnya).`,
  );
});

test("kartu statistik /profile tetap mengikuti patokan DESIGN.md §9", () => {
  // DESIGN.md §9 = PATOKAN RESMI yang ditunjuk user ("ini jadikan patokan
  // design mulai sekarang"). Guard ini mengunci anatomi terukurnya supaya
  // patokan tidak luntur diam-diam saat komponen disentuh lagi.
  //
  // Yang dikunci (bukan sekadar "ada angka" — nilainya SPESIFIK):
  //   radius 24px (`rounded-3xl`) · border 2px warna keluarga · gradien 3 stop
  //   · hard slab `0 4px 0` · padding 16px · tinggi rata (`auto-rows-fr`)
  //   · label Space Grotesk 12px/700 uppercase · nilai 30px/700 tabular-nums
  //   · sub Inter 12px/600
  const profile = readFileSync(join(ROOT, "src/routes/profile.tsx"), "utf8");

  // 1. Grid kartu statistik wajib meratakan tinggi (cacat yang pernah nyata:
  //    baris 1 = 177px vs baris 2 = 114px karena StreakBadge h-full min-h).
  assert.match(
    profile,
    /grid[^"]*auto-rows-fr[^"]*gap-4/,
    "grid kartu statistik wajib `auto-rows-fr` (DESIGN.md §9.1 — tinggi wajib rata)",
  );

  // 2. Ketiga kartu non-streak wajib memakai anatomi penuh: rounded-3xl +
  //    border-2 warna keluarga + gradien `from-… via-… to-…` + slab `0_4px_0`.
  const kartuStat = profile.match(
    /flex flex-col justify-between rounded-3xl border-2 [^"]+shadow-\[0_4px_0_[^\]]+\]/g,
  ) ?? [];
  assert.ok(
    kartuStat.length >= 3,
    `wajib ada >=3 kartu statistik beranatomi lengkap (rounded-3xl + border-2 + slab 0_4px_0), ketemu ${kartuStat.length}`,
  );
  for (const k of kartuStat) {
    assert.match(k, /bg-gradient-to-b from-\S+ via-\S+ to-\S+/, `kartu wajib gradien 3 stop: ${k.slice(0, 70)}`);
    assert.match(k, /\bp-4\b/, `kartu wajib padding 16px (p-4): ${k.slice(0, 70)}`);
  }

  // 3. Hierarki teks: label uppercase Space Grotesk 12px/700.
  const label = profile.match(/font-pixel text-xs font-bold uppercase tracking-wider/g) ?? [];
  assert.ok(
    label.length >= 3,
    `label kartu wajib 'font-pixel text-xs font-bold uppercase tracking-wider' (Space Grotesk 12px/700), ketemu ${label.length}`,
  );

  // 4. Nilai angka wajib 30px/700 + tabular-nums (angka tidak goyang).
  const nilai = profile.match(/font-pixel text-3xl font-bold \S+ tabular-nums/g) ?? [];
  assert.ok(
    nilai.length >= 3,
    `nilai kartu wajib 'font-pixel text-3xl font-bold … tabular-nums', ketemu ${nilai.length}`,
  );

  // 5. Sub-label wajib Inter 12px/600 (`text-xs font-semibold`).
  const sub = profile.match(/mt-0\.5 text-xs font-semibold/g) ?? [];
  assert.ok(sub.length >= 3, `sub-label kartu wajib 'text-xs font-semibold' (Inter 12px/600), ketemu ${sub.length}`);

  // 6. §9 sendiri wajib ada & menyebut angka patokan (bukan prosa kosong).
  const design = readFileSync(join(ROOT, "DESIGN.md"), "utf8");
  assert.match(design, /## 9\. PATOKAN RESMI/, "DESIGN.md wajib punya §9 Patokan Resmi");
  for (const angka of ["24px", "2px solid", "177px", "30px", "auto-rows-fr", "0 4px 0"]) {
    assert.ok(
      design.includes(angka),
      `DESIGN.md §9 wajib memuat angka patokan '${angka}' — kalau format berubah, perbarui dokumen DAN guard`,
    );
  }
});
