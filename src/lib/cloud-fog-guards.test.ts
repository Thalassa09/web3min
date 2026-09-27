import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

/**
 * Guard efek awan (fog of war) peta rute.
 *
 * Kenapa ada: awan adalah elemen yang HANYA boleh muncul setelah progres lokal
 * terbaca. Store memakai `skipHydration`, jadi render pertama selalu
 * `completed: []` — artinya SEMUA rute (kecuali yang pertama) terlihat
 * terkunci. Kalau awan dirender di HTML server, user lama melihat 19 rute
 * berawan lalu awannya hilang sekejap setelah hidrasi, DAN markup server
 * berbeda dari markup klien → React error #418.
 *
 * Bug nyata yang pernah terjadi: `useHydrated()` TIDAK CUKUP sebagai penahan.
 * `useHydrated` membaca `hydration.ready`, variabel MODUL di store. Dengan
 * selective hydration, subtree peta bisa ter-hidrasi SETELAH `HydrationGate`
 * menjalankan efeknya, sehingga `hydration.ready` sudah `true` saat React
 * menghidrasi komponen ini → server merender tanpa awan/chip, klien menghidrasi
 * dengan awan/chip → **#418 di setiap kunjungan beranda**. Terbukti terukur:
 * versi tanpa penanda `mounted` memunculkan #418, versi dengan penanda bersih.
 *
 * Penahan yang benar: `useState(false)` + `useEffect(() => setMounted(true))` —
 * dijamin `false` di render pertama klien (identik dengan server), dan `true`
 * hanya setelah efek.
 */

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const MAP = readFileSync(join(ROOT, "src/components/pulau-rantai-map.tsx"), "utf8");
const FOG = readFileSync(join(ROOT, "src/components/ui/cloud-fog.tsx"), "utf8");
const CSS = readFileSync(join(ROOT, "src/styles.css"), "utf8");

test("awan digate penanda `mounted`, bukan hanya `useHydrated`", () => {
  // Penanda `mounted` harus ada dan berbentuk useState(false) + useEffect.
  assert.match(
    MAP,
    /const \[mounted, setMounted\] = useState\(false\)/,
    "peta wajib punya penanda `mounted` yang dimulai dari `false`",
  );
  assert.match(
    MAP,
    /useEffect\(\(\) => setMounted\(true\), \[\]\)/,
    "penanda `mounted` wajib dinyalakan di efek",
  );

  // Guard efektif harus menggabungkan keduanya.
  assert.match(
    MAP,
    /const siapTampilProgres = hydrated && mounted/,
    "guard efektif wajib `hydrated && mounted` — `hydrated` saja memicu #418",
  );

  // Awan & chip TIDAK BOLEH digate `hydrated` sendirian lagi.
  assert.ok(
    !/\{hydrated && \(lockedUnitIds\.has/.test(MAP),
    "awan tidak boleh digate `hydrated` sendirian (akar #418)",
  );
  assert.ok(
    !/\{hydrated && lockedUnitIds\.has\(unit\.id\) \?/.test(MAP),
    "chip Terkunci tidak boleh digate `hydrated` sendirian (akar #418)",
  );
});

test("awan memakai z-20 (di atas node z-2 & maskot z-10, di bawah papan nama z-30)", () => {
  assert.match(
    FOG,
    /className="absolute inset-0 z-20 cloud-fog-hit/,
    "lapisan awan wajib z-20",
  );
  assert.match(
    MAP,
    /max-w-lg mx-auto top-2\.5 z-30 /,
    "papan nama wajib z-30 supaya tetap terbaca di atas awan",
  );

  // Nilai z lama (z-3) adalah akar bug: dua elemen ber-z-index sama tidak
  // dijamin diselesaikan urutan DOM — terbukti `elementFromPoint` di titik
  // node rute terkunci mengembalikan tombol node, bukan awan.
  assert.ok(
    !/inset-0 z-3\b/.test(FOG),
    "awan tidak boleh kembali ke z-3 (akar bug: node masih bisa diklik)",
  );

  // Tailwind v4 menerima `z-<bilangan bulat>`; desimal & kelas tak terdaftar
  // GAGAL SENYAP (tidak error, tapi z-index tidak berubah). Buktikan lewat
  // CSS hasil build kalau tersedia — kalau belum di-build, minimal pastikan
  // tidak ada nilai desimal.
  const zDipakai = [...FOG.matchAll(/\bz-(\d+(?:\.\d+)?)\b/g)].map((m) => m[1]);
  for (const z of zDipakai) {
    assert.match(z, /^\d+$/, `z-index wajib bilangan bulat, dapat z-${z}`);
  }
});

test("awan memblokir klik ke node: elemennya <button> native + aria-label", () => {
  // <button> native sudah memberi role="button" implisit, tabIndex 0, dan
  // memicu click dari Enter maupun Space. Menambah onKeyDown manual pada
  // <button> justru membuat aksi jalan DUA KALI.
  assert.match(FOG, /<button\s/, "lapisan awan wajib <button>");
  assert.match(FOG, /type="button"/, "wajib type=button (jangan submit form)");
  assert.match(FOG, /aria-label=\{`Rute \$\{unitIndex\} masih tertutup awan/, "wajib aria-label");
  assert.match(FOG, /touchAction: "pan-y"/, "wajib pan-y supaya swipe tetap bisa scroll");

  // Jangan pasang onKeyDown manual pada <button> — aksi jadi dobel.
  // Periksa KODE saja: buang komentar dulu, karena komentar di file ini
  // memang menjelaskan kenapa onKeyDown TIDAK dipakai.
  const kodeFog = FOG.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/.*$/gm, "");
  assert.ok(
    !/onKeyDown/.test(kodeFog),
    "jangan onKeyDown manual di <button> (Enter/Space sudah native, dobel kalau ditambah)",
  );
});

test("awan memakai token warna resmi, bukan warna karangan", () => {
  // Warna wajib dari identitas: krem #FFF6EE + outline choco-900 #3B2218.
  assert.match(FOG, /#FFF6EE|#fff6ee/, "badan awan wajib memakai krem #FFF6EE");
  assert.match(FOG, /#3B2218|#3b2218/, "outline awan wajib choco-900 #3B2218");
  assert.match(FOG, /fill="#FFFFFF"|fill="#ffffff"/, "isi utama awan putih #FFFFFF");

  // #000 dilarang (aturan DESIGN.md).
  assert.ok(!/#000\b|#000000/.test(FOG), "jangan pakai #000 — pakai choco-900");

  // Shadow hanya hard slab (blur nol).
  const shadows = FOG.match(/shadow-\[[^\]]*\]/g) ?? [];
  for (const s of shadows) {
    assert.match(
      s,
      /shadow-\[0_\d+px_0_/,
      `shadow wajib hard slab 0 Npx 0 tanpa blur, dapat: ${s}`,
    );
  }
});

test("animasi drift 8-12 detik + pembuka fade/scale ~400ms", () => {
  // Durasi drift dihitung di komponen: 8 + rand()*4 → 8..12 detik.
  assert.match(FOG, /duration: 8 \+ rand\(\) \* 4/, "drift wajib 8-12 detik");

  // Pembuka: fade + scale, bukan slide.
  assert.match(CSS, /\.cloud-fog-out\s*\{/, "wajib kelas .cloud-fog-out");
  assert.match(CSS, /cloud-fog-fade-out/, "wajib keyframe fade-out");

  // PENTING: periksa 400ms DI DALAM blok `.cloud-fog-out` saja.
  // Versi lama guard ini mencari `400ms` di seluruh berkas dan LOLOS padahal
  // durasinya sudah diubah — karena `400ms` masih muncul di transisi
  // `.cloud-fog-badge-out`. Guard yang mencari di seluruh berkas tidak
  // mengunci apa pun. (Terbukti: bug "ganti 400ms → 1,2s" tidak tertangkap.)
  const blokOut = CSS.match(/\.cloud-fog-out\s*\{([^}]*)\}/);
  assert.ok(blokOut, "blok .cloud-fog-out wajib ada");
  assert.match(
    blokOut[1],
    /400ms/,
    "pembuka wajib 400ms DI DALAM blok .cloud-fog-out",
  );

  // Fade/scale, bukan slide ke samping.
  assert.ok(
    !/cloud-fog-slide-(left|right)/.test(CSS),
    "pembuka wajib fade/scale, bukan slide ke samping",
  );
  const kf = CSS.match(/@keyframes cloud-fog-fade-out\s*\{([^}]*)\}/);
  assert.ok(kf, "keyframe cloud-fog-fade-out wajib ada");
  assert.match(kf[1], /opacity:\s*0/, "keyframe wajib memudar (opacity 0)");
  assert.match(kf[1], /scale:\s*0\.\d+/, "keyframe wajib mengecil (scale)");

  // Reduced motion wajib menonaktifkan drift.
  assert.match(
    CSS,
    /@media \(prefers-reduced-motion: reduce\)[\s\S]{0,400}\.cloud-fog-bit \{ animation: none/,
    "reduced-motion wajib mematikan drift",
  );
});

test("definisi terkunci sesuai spec: belum ada blok selesai DAN bukan rute aktif", () => {
  // Persis definisi di brief: rute yang sedang aktif (berisi nextLessonId)
  // TIDAK ditutup, supaya user bisa melihat & menekan blok aktifnya.
  assert.match(
    MAP,
    /const hasCompleted = u\.lessons\.some\(\(l\) => completed\.includes\(l\.id\)\)/,
    "wajib memeriksa blok selesai",
  );
  assert.match(
    MAP,
    /const hasActive = u\.lessons\.some\(\(l\) => l\.id === nextLessonId\)/,
    "wajib memeriksa rute aktif",
  );
  assert.match(
    MAP,
    /if \(!hasCompleted && !hasActive\) locked\.add\(u\.id\)/,
    "rute terkunci = belum ada selesai DAN bukan aktif",
  );

  // isUnlocked / store / kurikulum TIDAK boleh diubah oleh fitur ini.
  assert.ok(
    !/isUnlocked\s*=/.test(MAP),
    "jangan mendefinisikan ulang isUnlocked — logika kurikulum tidak boleh diubah",
  );
});

test("auto-scroll ke node aktif masih ada (tidak boleh rusak oleh awan)", () => {
  assert.match(
    MAP,
    /data-active="true"/,
    "penanda node aktif wajib ada — auto-scroll bergantung padanya",
  );
  // Ada DUA jalur: (a) focusUnit dari luar, (b) node aktif. Keduanya wajib ada.
  assert.match(
    MAP,
    /containerRef\.current\.scrollTop = Math\.max\(0, el\.offsetTop - 80\)/,
    "auto-scroll ke unit fokus wajib tetap ada",
  );
  assert.match(
    MAP,
    /c\.scrollTop = Math\.max\(0, c\.scrollTop \+ delta - 200\)/,
    "auto-scroll ke node aktif wajib tetap ada",
  );
});

test("teks hint & toast sesuai spec", () => {
  assert.match(
    FOG,
    /Selesaikan Rute \{prevUnitIndex\} untuk membuka/,
    "teks di tengah awan wajib 'Selesaikan Rute N untuk membuka'",
  );
  assert.match(
    MAP,
    /"Rute ini masih tertutup awan! Selesaikan rute sebelumnya dulu\."/,
    "teks toast wajib persis seperti spec",
  );
  // playDeny hanya saat sound aktif.
  assert.match(
    MAP,
    /if \(sound\) playDeny\(\)/,
    "playDeny wajib digate `sound`",
  );
});

test("chip 'Terkunci' memakai komponen kanonik <Chip tone=\"neutral\">", () => {
  assert.match(
    MAP,
    /<Chip tone="neutral"/,
    "chip Terkunci wajib memakai <Chip tone=\"neutral\">",
  );
  // Chip ditaruh di papan nama (z-30), bukan di dalam awan — supaya tetap
  // terbaca saat awan beranimasi keluar.
  const posisiChip = MAP.indexOf('<Chip tone="neutral"');
  const posisiAwan = MAP.indexOf("<CloudFog");
  assert.ok(
    posisiChip > 0 && posisiAwan > 0 && posisiChip < posisiAwan,
    "chip Terkunci wajib di papan nama (sebelum <CloudFog> di DOM)",
  );
});
