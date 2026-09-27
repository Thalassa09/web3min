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
    // Buang komentar DULU — kalimat dokumentasi sering menyebut hex historis
    // (mis. "stop akhir #FED7AA") dan itu bukan pemakaian. Guard yang memindai
    // komentarnya sendiri menghasilkan false FAIL, sama berbahayanya dengan
    // false PASS: orang lalu mematikan guard-nya.
    const kode = src
      .replace(/\/\*[\s\S]*?\*\//g, "")
      .replace(/\/\/[^\n]*/g, "");
    kode.split("\n").forEach((line, i) => {
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

test("palet Tailwind asing DILARANG di src/ (DESIGN.md §7)", () => {
  // Langkah 35: 172 pemakaian palet bawaan Tailwind (`emerald/amber/orange/rose`)
  // di 21 berkas sudah dimigrasikan ke token web3min. Ratchet sebelumnya sudah
  // mencapai NOL, jadi aturannya kini HARD — nol toleransi, bukan "jangan naik".
  //
  // Kenapa ini penting: warna palet bawaan TIDAK ADA di `@theme`, jadi ia tetap
  // ter-render tanpa error apa pun, tapi (a) di luar identitas web3min dan
  // (b) kontrasnya tidak pernah diukur guard mana pun. Persis pola "aturan tanpa
  // guard = aturan yang dilanggar diam-diam".
  //
  // Pengganti yang benar (semua sudah ada di @theme):
  //   emerald-* → leaf-* / mint-* / ok-*        (hijau sukses)
  //   amber-*   → coin-* / lemon-* / warn-ink   (gold: koin, PETI, peringatan)
  //   orange-*  → flame-* / streak              (oranye beruntun)
  //   rose-*    → candy-* / ruby-* / err-*      (pink / error)
  //   violet-*  → grape-*                       (ungu)
  //
  // Panel admin dikecualikan SADAR: tabel data netral, bukan permukaan bermerek.
  //
  // `src/lib/pulau-rantai.ts` juga dikecualikan — tapi BUKAN karena "data".
  // Isinya 21 warna LATAR PETA PULAU (hijau hutan, ungu gunung, biru laut, batu
  // abu). Warna DUNIA sengaja berbeda dari warna UI: kalau semua pulau dipaksa
  // jadi 4 keluarga patokan (mint/oranye/gold/pink), peta kehilangan
  // keragaman visual dan tiap pulau jadi tak bisa dibedakan. Tujuh warna di
  // antaranya kebetulan sama persis dengan palet bawaan Tailwind — itu
  // kebetulan, bukan pemakaian palet Tailwind. Dikonfirmasi user (Langkah 35):
  // "biarkan — warna dunia berbeda dari warna UI".
  const ASING = /\b(emerald|amber|orange|rose|violet|sky|teal|indigo|fuchsia|lime|cyan)-\d{2,3}\b/;
  const ABAIKAN = new Set([
    "src/routes/admin.tsx",
    "src/components/admin-stats.tsx",
    "src/components/admin-raffle-modal.tsx",
    "src/lib/pulau-rantai.ts",
  ]);

  const offenders: string[] = [];
  for (const { path, src } of FILES) {
    if (ABAIKAN.has(path)) continue;
    src.split("\n").forEach((line, i) => {
      const m = line.match(ASING);
      if (m) offenders.push(`${path}:${i + 1} → ${m[0]}`);
    });
  }

  assert.deepEqual(
    offenders,
    [],
    `Palet Tailwind asing (tidak ada di @theme) — pakai token web3min:\n${offenders
      .map((o) => "  " + o)
      .join("\n")}`,
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

test("kelas Tailwind yang TIDAK VALID tidak boleh ditulis (gagal senyap)", () => {
  // Temuan Langkah 37: skrip migrasi tap-target menulis `min-h-11.5` di 30 tempat.
  // Tailwind TIDAK mengenal `min-h-11.5` — kelas itu diabaikan TANPA error apa pun,
  // jadi tombolnya tetap 36px padahal di kode terlihat "sudah diperbaiki".
  // Ini kelas gagal yang paling berbahaya: hasilnya terlihat benar di diff,
  // tapi nol efek di layar. Kelas tidak valid = perbaikan palsu.
  //
  // Tailwind v4 hanya punya kelipatan .5 untuk spacing (`p-2.5`, `gap-1.5`),
  // dan `min-h-*` hanya menerima angka bulat skala (11 = 44px, 12 = 48px).
  const INVALID = /\b(min-h|min-w|max-h|max-w)-\d+\.\d+\b/;
  const offenders: string[] = [];
  for (const { path, src } of FILES) {
    const kode = src.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/[^\n]*/g, "");
    kode.split("\n").forEach((line, i) => {
      const m = line.match(INVALID);
      if (m) offenders.push(`${path}:${i + 1} → ${m[0]}`);
    });
  }
  assert.deepEqual(
    offenders,
    [],
    `Kelas Tailwind tidak valid (diabaikan Tailwind = gagal senyap):\n${offenders
      .map((o) => "  " + o)
      .join("\n")}\n\nPakai skala bulat: min-h-11 (44px), min-h-12 (48px).`,
  );
});

test("permukaan candy gelap (700-950) tidak boleh kembali sebagai FILL di src/ (sweep 2026-09-27)", () => {
  // Permintaan user: "candy gelap ubah ke pastel rose semua". Sweep mengganti
  // SETIAP permukaan candy gelap — fill `bg-candy-800/900/950`, ramp gradien
  // `from-candy-600 via-candy-700 to-candy-800` / `from-candy-700 via-candy-800
  // to-candy-900`, dan slab gelap `#6E1239`/`#85174A`/`#B01E5D` — menjadi
  // pastel rose (blush-50 -> blush-200, label choco-900, border candy-600,
  // slab #B01F62). Ratchet: nol pemakaian baru.
  //
  // Yang TETAP SAH (jangan ikut dilarang):
  //   - `text-candy-700`, `border-candy-700` — teks/border, bukan permukaan;
  //   - `bg-candy-50/100/200` — permukaan pastel;
  //   - definisi token di `src/styles.css` & `src/tamagui.config.ts`.
  // Berkas test dikecualikan (menyebut nama kelas di pesan/komentar).
  const FORBIDDEN = /\bbg-candy-(?:700|800|900|950)\b|(?:from|via|to)-candy-(?:600|700|800|900|950)\b|#(?:6E1239|85174A|B01E5D)/i;
  const SKIP = /src\/(?:lib\/[^/]+\.test\.ts|styles\.css|tamagui\.config\.ts)$/;

  const offenders: string[] = [];
  for (const { path, src } of FILES) {
    if (SKIP.test(path)) continue;
    const kode = src.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/[^\n]*/g, "");
    kode.split("\n").forEach((line, i) => {
      const m = line.match(FORBIDDEN);
      if (m) offenders.push(`${path}:${i + 1} → ${m[0]}`);
    });
  }

  assert.deepEqual(
    offenders,
    [],
    `Permukaan candy gelap kembali — pakai pastel rose (from-blush-50 to-blush-200 + text-choco-900 + border-candy-600 + slab #B01F62):\n${offenders
      .map((o) => "  " + o)
      .join("\n")}`,
  );
});

test("border 3px/4px dilarang — patokan §9 = border 2px", () => {
  // Bukti drift (bukan gaya sengaja): 24 berkas CAMPUR border-2 & border-3, dan
  // NOL berkas yang murni 3px. Di settings.tsx dua <section> berstruktur IDENTIK
  // (mt-5 p-4 sm:p-5 rounded-3xl) beda border — baris 48 `border-3`, baris 81
  // `border-2`. Itu drift yang tak terlihat karena tidak ada guard.
  // Pengecualian sah: `border-b-4` pada tombol kuis & figure — aksen 3D bawah
  // yang tebal, terbukti berulang di quiz-opt/proof-gallery/case-clinic.
  const offenders: string[] = [];
  for (const { path, src } of FILES) {
    src.split("\n").forEach((line, i) => {
      const kode = line.replace(/\/\/.*$/, "").replace(/\/\*.*?\*\//g, "");
      for (const m of kode.matchAll(/border(-[tblrxy])?-(3|4)\b/g)) {
        if (m[0] === "border-b-4") continue;
        offenders.push(`${path}:${i + 1} → ${m[0]}`);
      }
    });
  }
  assert.deepEqual(offenders, [], `border 3px/4px (patokan §9 = 2px):\n${offenders.join("\n")}`);
});
