import test from "node:test";
import assert from "node:assert/strict";
import {
  effectiveRaffleStatus,
  isRaffleOpenForEntry,
  formatRaffleCountdown,
  type RaffleStatus,
} from "./raffles.ts";

/**
 * Guard status efektif undian.
 *
 * Kenapa ada: kolom `status` di database hanya diubah MANUAL oleh admin, jadi
 * undian yang `ends_at`-nya sudah lewat tetap tersimpan `'live'` sampai ada
 * yang menutupnya. Akibatnya UI menampilkan kontradiksi yang dilaporkan user:
 * filter menghitungnya "Berlangsung (4)" dan badge bisa bilang BERLANGSUNG,
 * padahal kolom SISA WAKTU di kartu yang sama sudah berbunyi "Selesai".
 *
 * Server TIDAK terpengaruh (RPC `enter_raffle` menolak kalau
 * `ends_at <= now()`), tapi UI-nya berbohong ke user — dan user yang gagal
 * memasang tiket akan menyalahkan tombolnya, bukan jadwalnya.
 *
 * Obatnya: satu fungsi `effectiveRaffleStatus` sebagai sumber kebenaran
 * tunggal, dan SEMUA tampilan (badge, filter, hitungan, tombol) memakainya.
 */

const NOW = new Date("2026-09-27T22:10:00+07:00").getTime();
const HOUR = 60 * 60 * 1000;

test("waktu habis + status 'live' → efektif 'expired' (bukan 'live')", () => {
  // Kasus nyata: Dripster, status='live', ends_at sudah lewat.
  assert.equal(
    effectiveRaffleStatus("live", NOW - 2 * 60 * 1000, NOW),
    "expired",
    "undian yang waktunya lewat tidak boleh lagi dianggap live",
  );
});

test("waktu masih ada + status 'live' → tetap 'live'", () => {
  assert.equal(effectiveRaffleStatus("live", NOW + 3 * HOUR, NOW), "live");
});

test("status non-live tidak pernah diubah jadi live oleh waktu", () => {
  // `ended`/`drawn`/`verifying` adalah keputusan admin; waktu tidak boleh
  // "menghidupkan kembali" undian yang sudah ditutup.
  for (const s of ["ended", "drawn", "verifying", "upcoming"] as RaffleStatus[]) {
    assert.equal(
      effectiveRaffleStatus(s, NOW + 100 * HOUR, NOW),
      s,
      `status ${s} tidak boleh berubah jadi live hanya karena waktunya belum habis`,
    );
  }
});

test("ends_at NULL → ikut status kolom (undian tanpa jadwal)", () => {
  // `ends_at` NULL = belum dijadwalkan; tombolnya memang disabled karena
  // `!raffle.endsAt`, jadi statusnya tetap 'live' supaya admin bisa mengisinya.
  assert.equal(effectiveRaffleStatus("live", null, NOW), "live");
});

test("tepat di detik ends_at → sudah tertutup (batas inklusif)", () => {
  // Server memakai `ends_at <= now()` → ditutup. UI harus sama, kalau tidak
  // user melihat tombol aktif tapi server menolak.
  assert.equal(effectiveRaffleStatus("live", NOW, NOW), "expired");
});

test("isRaffleOpenForEntry: hanya live + jadwal ada + belum lewat", () => {
  assert.equal(isRaffleOpenForEntry("live", NOW + HOUR, NOW), true, "masih boleh ikut");
  assert.equal(isRaffleOpenForEntry("live", NOW - HOUR, NOW), false, "waktu habis → tutup");
  assert.equal(isRaffleOpenForEntry("live", null, NOW), false, "tanpa jadwal → tutup");
  assert.equal(isRaffleOpenForEntry("ended", NOW + HOUR, NOW), false, "sudah ditutup admin");
  assert.equal(isRaffleOpenForEntry("verifying", NOW + HOUR, NOW), false, "menunggu verifikasi");
});

test("formatRaffleCountdown: habis → 'Selesai', dan tidak pernah negatif", () => {
  assert.equal(formatRaffleCountdown(NOW - 1, NOW), "Selesai");
  assert.equal(formatRaffleCountdown(null, NOW), "Belum dijadwalkan");
  // Tidak boleh ada "-3 Menit" — sisa waktu negatif itu mustahil.
  assert.doesNotMatch(formatRaffleCountdown(NOW - 99 * HOUR, NOW), /-/);
});

test("konsistensi: kartu yang bilang 'Selesai' TIDAK boleh dihitung Berlangsung", () => {
  // Invarian yang dilanggar di laporan user: satu kartu bisa menampilkan
  // "Selesai" di SISA WAKTU sekaligus ikut terhitung di filter "Berlangsung".
  const cards = [
    { status: "live" as RaffleStatus, endsAt: NOW - 2 * 60 * 1000 }, // Dripster
    { status: "live" as RaffleStatus, endsAt: NOW + 3 * HOUR },
    { status: "live" as RaffleStatus, endsAt: NOW + 7 * 24 * HOUR },
    { status: "live" as RaffleStatus, endsAt: NOW + 12 * 24 * HOUR },
  ];

  const shownAsEnded = cards.filter((c) => formatRaffleCountdown(c.endsAt, NOW) === "Selesai");
  const countedLive = cards.filter((c) => effectiveRaffleStatus(c.status, c.endsAt, NOW) === "live");

  for (const ended of shownAsEnded) {
    assert.ok(
      !countedLive.includes(ended),
      "kartu yang menampilkan 'Selesai' tidak boleh ikut terhitung 'Berlangsung'",
    );
  }
  assert.equal(countedLive.length, 3, "3 undian yang masih berjalan, 1 sudah tutup");
});

test("satu sumber waktu: UI wajib memakai satu `now`, bukan Date.now() tersebar", async () => {
  // Kalau tiap bagian UI memanggil `Date.now()` sendiri, dua elemen di kartu
  // yang sama bisa memakai waktu berbeda dan menghasilkan kontradiksi lagi
  // (mis. badge BERLANGSUNG + SISA WAKTU "Selesai") — persis laporan user.
  const { readFileSync } = await import("node:fs");
  const { join } = await import("node:path");
  const src = readFileSync(join(process.cwd(), "src/routes/raffle.tsx"), "utf8")
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/^\s*\/\/.*$/gm, "");

  // Hanya dua pemakaian mentah yang sah: inisialisasi state dan tick interval.
  const raw = src.match(/Date\.now\(\)/g) ?? [];
  assert.equal(
    raw.length,
    2,
    `raffle.tsx hanya boleh memakai Date.now() untuk inisialisasi state + interval, ditemukan ${raw.length}`,
  );

  // Semua pemanggil status/waktu wajib mengoper `now` yang sama.
  for (const call of [
    "effectiveRaffleStatus(item.status, item.endsAt, now)",
    "effectiveRaffleStatus(raffle.status, raffle.endsAt, now)",
    "formatRaffleCountdown(raffle.endsAt, now)",
    "isRaffleOpenForEntry(raffle.status, raffle.endsAt, now)",
  ]) {
    assert.ok(src.includes(call), `raffle.tsx wajib memanggil \`${call}\``);
  }
});

test("label durasi tidak diisi kata status (kolom 'Sisa Waktu' bukan 'Selesai')", async () => {
  // Laporan user: kolom berlabel "SISA WAKTU" berisi "Selesai" — label dan isi
  // tidak nyambung. Saat undian tutup, labelnya wajib berubah jadi "Status".
  const { readFileSync } = await import("node:fs");
  const { join } = await import("node:path");
  const src = readFileSync(join(process.cwd(), "src/routes/raffle.tsx"), "utf8");
  assert.match(
    src,
    /\{isExpired \? "Status" : "Sisa Waktu"\}/,
    "label kolom wajib menyesuaikan: 'Status' saat tutup, 'Sisa Waktu' saat berjalan",
  );
});

test("panel statistik: 4 sel berwarna + berikon, bukan sel putih polos", async () => {
  // Panel 2x2 dulu putih polos dengan divider `choco-900/10` yang nyaris tak
  // terlihat (kontras 1,1:1) — datar, dan tidak ada satu pun ikon sehingga
  // mustahil dipindai cepat. Sekarang tiap sel satu keluarga warna + ikon.
  //
  // Setiap warna WAJIB punya token di `@theme`; kelas Tailwind tak terdaftar
  // gagal SENYAP (tidak error, warnanya cuma tidak keluar) — jadi daftar token
  // di sini sekaligus mengunci bahwa pasangannya benar-benar ada.
  const { readFileSync } = await import("node:fs");
  const { join } = await import("node:path");
  const src = readFileSync(join(process.cwd(), "src/routes/raffle.tsx"), "utf8");
  const css = readFileSync(join(process.cwd(), "src/styles.css"), "utf8");

  // Ambil blok grid statistik saja. Pencarian TANPA `gap-2` di akhir supaya
  // tidak rapuh terhadap penambahan kelas lain di grid yang sama.
  const start = src.indexOf('className="grid grid-cols-2');
  assert.ok(start !== -1, "grid statistik 2x2 hilang dari kartu undian");
  const blok = src.slice(start, src.indexOf("</div>", src.indexOf("Belum dijadwalkan", start)) + 6);

  // 1. Empat label wajib ada
  for (const label of ["Tiket Terkumpul", "Pemenang", "Tiket Kamu", "Sisa Waktu"]) {
    assert.ok(blok.includes(label), `label statistik "${label}" hilang`);
  }

  // 2. Tiap sel wajib berikon — dulu nol ikon
  const ikon = blok.match(/<(Ticket|Trophy|Clock) className="size-3/g) ?? [];
  assert.equal(ikon.length, 4, `tiap sel wajib punya ikon, ditemukan ${ikon.length} dari 4`);

  // 3. Empat keluarga warna berbeda, dan setiap kelas punya token @theme
  const keluarga = {
    netral: ["border-choco-900/20", "via-cream-fill", "to-cream-fill-deep"],
    coin: ["border-lemon-deep", "from-coin-fill", "to-coin-fill-deep", "text-coin-ink", "text-coin-ink-deep"],
    leaf: ["border-leaf-line", "from-leaf-soft", "to-leaf-fill-deep", "text-leaf-shadow", "text-leaf-deep-ink"],
    flame: ["border-flame-line", "from-flame-soft", "to-flame-fill-deep", "text-flame-ink", "text-flame-ink-deep"],
  };
  for (const [nama, kelas] of Object.entries(keluarga)) {
    for (const k of kelas) {
      assert.ok(blok.includes(k), `sel ${nama} wajib memakai \`${k}\``);
    }
  }

  // 4. Semua token warna yang dipakai benar-benar ada di @theme.
  //    HANYA kelas yang diawali border/from/via/to/text/bg + token yang
  //    benar-benar terlihat seperti nama warna (mis. `coin-ink-deep`,
  //    `flame-fill-deep`). Kelas utilitas lain (`gradient-to-b`, `center`,
  //    `sm`, `base`) bukan warna dan tidak boleh ikut diperiksa — kalau ikut,
  //    guard-nya berisik dan orang akan mematikannya.
  const tokens = new Set((css.match(/--color-([a-z0-9-]+)\s*:/g) ?? []).map((t) => t.slice(8, -1).trim()));
  const KELUARGA = /^(choco|cream|coin|leaf|flame|lemon|grape|blush|candy|warn|ok|err|mint|ruby|sky|ink)/;
  // `white`/`black`/`transparent`/`current` adalah kata kunci bawaan Tailwind,
  // bukan token @theme — sah dipakai, jangan dilaporkan sebagai hilang.
  const BAWAAN = new Set(["white", "black", "transparent", "current", "inherit"]);
  const dipakai = [
    ...blok.matchAll(/\b(?:border|from|via|to|text|bg)-([a-z]+(?:-[a-z0-9]+)*)/g),
  ]
    .map((m) => m[1])
    .filter((t) => KELUARGA.test(t) && !BAWAAN.has(t) && !/^\d/.test(t));
  const hilang = [...new Set(dipakai)].filter((t) => !tokens.has(t));
  assert.deepEqual(
    hilang,
    [],
    `kelas warna tanpa token @theme (gagal senyap): ${hilang.join(", ")}`,
  );

  // 5. Divider pucat yang jadi akar keluhan user tidak boleh kembali
  assert.ok(
    !/divide-choco-900\/10/.test(blok),
    "divider `divide-choco-900/10` (kontras 1,1:1) tidak boleh kembali",
  );

  // 6. Tinggi sel wajib rata dalam satu baris.
  //    Terukur di 320px: nilai 2 baris ("Menunggu Pengundian") membuat selnya
  //    87px sementara pasangan sebarisnya 63px → dasar grid timpang. Aturan repo
  //    (DESIGN.md §9): tinggi kartu dalam satu baris WAJIB rata.
  const gridStart = src.indexOf('className="grid grid-cols-2 auto-rows-fr gap-2"');
  assert.ok(
    gridStart !== -1,
    "grid statistik wajib memakai `auto-rows-fr` supaya tinggi sel satu baris rata",
  );
  const selPenuh = (blok.match(/h-full flex flex-col justify-center/g) ?? []).length;
  assert.equal(
    selPenuh,
    4,
    `keempat sel wajib \`h-full flex flex-col justify-center\` agar isi terpusat saat tinggi dipaksa rata, ditemukan ${selPenuh}`,
  );
});

test("badge baris atas wajib flex-wrap (badge panjang tidak meluber di 320px)", async () => {
  // Terukur di 320px: badge status "MENUNGGU PENGUNDIAN" meluber **+42px** keluar
  // kartu karena barisnya `flex-nowrap` sementara ketiga grup `shrink-0`. Badge
  // yang terpotong menghilangkan informasi status — dan itu justru satu-satunya
  // hal yang dibaca user di kartu undian yang sudah tutup.
  //
  // Pemeriksaan dilakukan pada BARIS BADGE saja (baris yang punya `left-3
  // right-3`), bukan seluruh berkas — `flex-nowrap` masih sah di tempat lain
  // (mis. baris chip kategori di kepala halaman).
  const { readFileSync } = await import("node:fs");
  const { join } = await import("node:path");
  const src = readFileSync(join(process.cwd(), "src/routes/raffle.tsx"), "utf8");

  const barisBadge = src
    .split("\n")
    .filter((l) => l.includes("absolute top-3 left-3 right-3"));
  assert.equal(barisBadge.length, 1, "baris badge (absolute top-3 left-3 right-3) wajib tepat satu");

  assert.match(
    barisBadge[0],
    /flex flex-wrap/,
    "baris badge wajib `flex-wrap` supaya badge panjang turun baris, bukan meluber keluar kartu",
  );
  assert.ok(
    !/flex-nowrap/.test(barisBadge[0]),
    "`flex-nowrap` pada baris badge tidak boleh kembali (badge panjang meluber +42px di 320px)",
  );
  assert.match(
    barisBadge[0],
    /gap-y-/,
    "baris badge wajib punya jarak vertikal antar-baris (`gap-y-*`) setelah wrap",
  );
});
