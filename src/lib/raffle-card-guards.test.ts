import { readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";
import assert from "node:assert/strict";

/**
 * Guard kartu undian /raffle.
 *
 * Kenapa guard ini ada: kartu undian pernah memakai `position: absolute` +
 * tinggi tetap (`h-[620px] sm:h-[600px]`) untuk menumpuk dua sisinya. Sisi
 * absolut tidak menyumbang tinggi sama sekali, jadi begitu konten lebih tinggi
 * dari patokan, sisa konten TERPOTONG oleh `overflow: hidden`. Terukur di
 * produksi: konten 675px vs kartu 600px → tombol "Pasang Tiket Undian" berada
 * 75px DI LUAR kartu dan tidak bisa diklik sama sekali
 * (`document.elementFromPoint` di titik tengahnya mengembalikan elemen lain).
 * Artinya fitur inti halaman — memasang tiket — mati total untuk semua user,
 * dan tidak ada satu pun test yang menangkapnya karena ini murni geometri CSS.
 *
 * Obatnya: tumpuk kedua sisi dengan CSS GRID (`grid-area: 1/1`), sehingga
 * tinggi kartu = sisi TERTINGGI. Guard di bawah mengunci sifat itu supaya
 * tidak ada yang "merapikan" kembali ke absolute + tinggi tetap.
 */

const ROOT = process.cwd();
const CARD = join(ROOT, "src/components/ui/flip-raffle-card.tsx");
const ROUTE = join(ROOT, "src/routes/raffle.tsx");

const read = (p: string) => readFileSync(p, "utf8");

/** Buang komentar supaya menyebut pola terlarang di penjelasan tidak gagal palsu. */
const stripComments = (src: string) =>
  src
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/^\s*\/\/.*$/gm, "");

test("kartu undian menumpuk dua sisinya dengan grid, bukan absolute + tinggi tetap", () => {
  const src = stripComments(read(CARD));

  // 1. Kedua sisi wajib memakai grid-area yang sama (bertumpuk di sel yang sama).
  const gridAreas = src.match(/\[grid-area:1\/1\]/g) ?? [];
  assert.equal(
    gridAreas.length,
    2,
    "kedua sisi kartu wajib memakai [grid-area:1/1] supaya bertumpuk di sel yang sama",
  );

  // 2. Tidak boleh ada `absolute inset-0` pada sisi kartu — itu akar bug lama.
  assert.doesNotMatch(
    src,
    /absolute inset-0[^"]*rounded-3xl/,
    "sisi kartu tidak boleh kembali ke `absolute inset-0` (tidak menyumbang tinggi → konten terpotong)",
  );

  // 3. Tidak boleh ada prop tinggi tetap lagi.
  assert.doesNotMatch(
    src,
    /h-\[\d+px\]/,
    "kartu tidak boleh memakai tinggi tetap (h-[NNNpx]); tinggi harus mengikuti konten tertinggi",
  );
  assert.doesNotMatch(
    src,
    /\bh\?:\s*string/,
    "prop `h` (kelas tinggi tetap) harus tetap dihapus dari kontrak komponen",
  );

  // 4. Pembungkus putaran wajib grid + h-full (agar kedua sisi mengisi sel).
  assert.match(
    src,
    /grid h-full transition-transform/,
    "pembungkus putaran wajib `grid h-full` supaya sisi tertinggi menentukan tinggi kartu",
  );
});

test("konten depan kartu tidak dipaksa h-full (itu yang mendorong tombol keluar batas)", () => {
  const src = stripComments(read(ROUTE));

  // Hanya sisi DEPAN yang tidak boleh `h-full`. Sisi belakang justru butuh
  // `h-full` karena daftar infonya `flex-1 min-h-0 overflow-y-auto` — ia
  // menggulir di dalam tinggi kartu yang sudah ditentukan sisi tertinggi.
  const frontStart = src.indexOf("front={");
  const backStart = src.indexOf("back={");
  assert.ok(frontStart > -1 && backStart > frontStart, "blok front/back wajib ditemukan");

  const frontBlock = src.slice(frontStart, backStart);
  assert.doesNotMatch(
    frontBlock,
    /className="flex flex-col h-full"/,
    "kolom konten sisi depan tidak boleh `h-full` — biarkan tingginya mengikuti isi",
  );
});

test("setiap undian ITEM wajib punya item_id — tanpa itu pengundian GAGAL", () => {
  const src = stripComments(read(ROUTE));

  // Migrasi `20260925000003` baris 299-302:
  //   if v_raffle.slot_type = 'ITEM' then
  //     if v_raffle.item_id is null then
  //       raise exception 'Item ID belum ditentukan untuk undian item ini.'
  // Jadi undian item tanpa item_id tidak akan pernah bisa mengumumkan pemenang.
  // Sisi klien wajib memperlakukan `itemId` sebagai sinyal item supaya badge,
  // catatan, dan gambar tidak salah.
  assert.match(
    src,
    /Boolean\(raffle\.itemId\)/,
    "deteksi item wajib menyertakan `Boolean(raffle.itemId)` — item_id adalah sinyal paling andal",
  );

  // Urutan cabang: item diperiksa SEBELUM mint. Kalau terbalik, undian item
  // yang tersimpan dengan category "nft" (data lama) dapat catatan "Hak mint".
  const itemBranch = src.indexOf('if (isItemSlot) {');
  const mintBranch = src.indexOf('} else if (isMintSlot) {');
  assert.ok(itemBranch > -1, "cabang isItemSlot wajib ada");
  assert.ok(mintBranch > -1, "cabang isMintSlot wajib ada");
  assert.ok(
    itemBranch < mintBranch,
    "cabang item wajib diperiksa SEBELUM mint, kalau tidak item dapat catatan 'Hak mint'",
  );
});

test("gambar item memakai object-contain, bukan cover", () => {
  const src = stripComments(read(ROUTE));

  // Aset item jauh lebih kecil dari kotak 416×416 (mahkota 64×48, lencana
  // 96×96). Dengan `cover` ia diperbesar sampai memenuhi kotak sehingga
  // pixel-nya raksasa dan komposisinya rusak; `contain` menampilkannya utuh.
  assert.match(
    src,
    /useContain\s*\?\s*"object-contain[^"]*"\s*:\s*"object-cover"/,
    "gambar item wajib `object-contain` (asetnya kecil) dan foto/artwork besar tetap `object-cover`",
  );
});
