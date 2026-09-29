/**
 * web3min: Pulau Rantai
 * Mathematical Catmull-Rom spline curves & World Configuration
 * Conforming to "Blok Rantai" Design System
 */

export type RoadPoint = [number, number];

export function catmullRomRoad(p: RoadPoint[]): string {
  if (p.length === 0) return "";
  let d = `M${p[0][0]},${p[0][1]}`;
  for (let i = 0; i < p.length - 1; i++) {
    const a = p[i - 1] || p[i];
    const b = p[i];
    const c = p[i + 1];
    const e = p[i + 2] || c;
    const cp1x = b[0] + (c[0] - a[0]) / 6;
    const cp1y = b[1] + (c[1] - a[1]) / 6;
    const cp2x = c[0] - (e[0] - b[0]) / 6;
    const cp2y = c[1] - (e[1] - b[1]) / 6;
    d += ` C${cp1x.toFixed(2)},${cp1y.toFixed(2)} ${cp2x.toFixed(2)},${cp2y.toFixed(2)} ${c[0].toFixed(2)},${c[1].toFixed(2)}`;
  }
  return d;
}

// Base anchor patterns for 6-point winding tracks
export const BASE_WINDING: [number, number][] = [
  [50, 0],
  [72, 20],
  [54, 40],
  [28, 58],
  [40, 78],
  [66, 100],
];

// Generates smooth winding points for N lessons within a world
export function getWindingPoints(count: number, height: number, topOffset: number): RoadPoint[] {
  if (count <= 1) return [[50, topOffset + 60]];
  const usableHeight = Math.max(200, height - topOffset - 60);

  // Default wave pattern: center -> right -> mid -> left -> mid-left -> right -> repeat
  const waveX = [50, 72, 54, 28, 40, 66, 32, 60, 42, 68];

  const pts: RoadPoint[] = [];
  for (let i = 0; i < count; i++) {
    const progress = i / (count - 1);
    const x = waveX[i % waveX.length];
    const y = topOffset + progress * usableHeight;
    pts.push([x, Math.round(y)]);
  }
  return pts;
}

export interface PulauTheme {
  bg: string;
  dash: string;
  kind: string;
  land: string;
  look: string;
  props: Array<{ name: string; side: "left" | "right"; top: number; size: number; flip?: boolean }>;
}

/**
 * Warna LATAR PETA PULAU — ini warna DUNIA, bukan warna UI.
 *
 * Sengaja TIDAK memakai 4 keluarga patokan (mint/oranye/gold/pink, DESIGN.md §9):
 * kalau semua pulau diseragamkan, peta kehilangan keragaman visual dan tiap
 * pulau jadi tak bisa dibedakan. Tujuh warna di sini kebetulan sama persis
 * dengan palet bawaan Tailwind (teal-600, fuchsia-600, emerald-700, rose-700,
 * slate-800, indigo-500, amber-600) — itu kebetulan, bukan pemakaian palet
 * Tailwind. Dikonfirmasi user: "biarkan — warna dunia berbeda dari warna UI".
 *
 * Guard `design-rules.test.ts` mengecualikan berkas ini SADAR, dengan alasan
 * di atas — bukan karena lupa.
 */
export const WORLD_PULAU_THEMES: Record<string, PulauTheme> = {
  u1: {
    bg: "#1D3B22",
    dash: "14 10",
    kind: "Awal Mula",
    land: "Hutan Genesis",
    look: "Kenali internet versi baru, di mana kunci dan asetnya kamu pegang sendiri.",
    props: [],
  },
  u2: {
    bg: "#4B2F63",
    dash: "14 10",
    kind: "Kunci & Dompet",
    land: "Gua Kunci Kripto",
    look: "Pelajari cara menyimpan kunci dompet digital. Jangan sampai diberikan ke orang lain.",
    props: [
      { name: "lantern", side: "left", top: 18, size: 48 },
      { name: "key", side: "right", top: 44, size: 42 },
      { name: "lantern", side: "right", top: 76, size: 46 },
    ],
  },
  u3: {
    bg: "#B27339",
    dash: "14 10",
    kind: "Cara Jaringan Sepakat",
    land: "Tambang Koin",
    look: "Pahami cara Bitcoin dan Ethereum mencatat transaksi tanpa bank. Tanpa rumus.",
    props: [
      { name: "coins", side: "left", top: 24, size: 46 },
      { name: "lantern", side: "right", top: 52, size: 44 },
      { name: "coins", side: "right", top: 80, size: 40 },
    ],
  },
  u4: {
    bg: "#D95280",
    dash: "14 10",
    kind: "Karya Digital",
    land: "Galeri Token Digital",
    look: "Kenali NFT: bukti kepemilikan karya digital yang tidak bisa digandakan.",
    props: [
      { name: "frame", side: "left", top: 20, size: 50 },
      { name: "flower", side: "right", top: 50, size: 42 },
      { name: "star", side: "right", top: 78, size: 44 },
    ],
  },
  u5: {
    bg: "#256CA8",
    dash: "14 10",
    kind: "Keuangan Tanpa Bank",
    land: "Dermaga DeFi",
    look: "Belajar menukar koin dan meminjam uang lewat program otomatis di blockchain (smart contract), tanpa bank.",
    props: [
      { name: "crate", side: "left", top: 22, size: 50 },
      { name: "lily", side: "right", top: 52, size: 42 },
      { name: "crate", side: "right", top: 80, size: 44 },
    ],
  },
  u6: {
    bg: "#9A3412",
    dash: "14 10",
    kind: "Aman dari Penipu",
    land: "Pos Anti-Phishing",
    look: "Kenali link dan pop-up palsu sebelum isi dompetmu terkuras habis.",
    props: [
      { name: "shield", side: "left", top: 20, size: 48 },
      { name: "lantern", side: "right", top: 50, size: 44 },
      { name: "shield", side: "right", top: 76, size: 42 },
    ],
  },
  u7: {
    bg: "#3B82F6",
    dash: "14 10",
    kind: "Kenyataan di Pasar",
    land: "Medan Volatilitas",
    look: "Bandingkan untung di atas kertas dengan kenyataan biaya transaksi (gas fee) yang harus dibayar.",
    props: [
      { name: "coins", side: "left", top: 22, size: 46 },
      { name: "star", side: "right", top: 54, size: 42 },
      { name: "coins", side: "right", top: 80, size: 44 },
    ],
  },
  u8: {
    bg: "#0D9488",
    dash: "14 10",
    kind: "Beli & Jual",
    land: "Bursa Spot",
    look: "Belajar beli koin secara langsung dulu, sebelum coba trading pakai uang pinjaman (leverage).",
    props: [
      { name: "crate", side: "left", top: 20, size: 48 },
      { name: "coins", side: "right", top: 52, size: 44 },
      { name: "lantern", side: "right", top: 78, size: 42 },
    ],
  },
  u9: {
    bg: "#854D0E",
    dash: "14 10",
    kind: "Koin Iseng",
    land: "Rawa Memecoin",
    look: "Koin iseng bisa lucu, tapi cek dulu apakah dananya bisa ditarik kembali.",
    props: [
      { name: "mushroom", side: "left", top: 22, size: 50 },
      { name: "coins", side: "right", top: 50, size: 46 },
      { name: "mushroom", side: "right", top: 76, size: 42 },
    ],
  },
  u10: {
    bg: "#4338CA",
    dash: "14 10",
    kind: "Cek Sendiri",
    land: "Lab Explorer",
    look: "Cek sendiri isi kontrak di halaman penjelajah (explorer) sebelum percaya omongan influencer.",
    props: [
      { name: "key", side: "left", top: 24, size: 46 },
      { name: "star", side: "right", top: 52, size: 44 },
      { name: "lantern", side: "right", top: 80, size: 42 },
    ],
  },
  u11: {
    bg: "#15803D",
    dash: "14 10",
    kind: "Rupiah ke Kripto",
    land: "Pasar P2P Lokal",
    look: "Jalur resmi menukar rupiah ke dompet digital dengan aman dan taat aturan.",
    props: [
      { name: "crate", side: "left", top: 20, size: 50 },
      { name: "coins", side: "right", top: 50, size: 46 },
      { name: "crate", side: "right", top: 78, size: 44 },
    ],
  },
  u12: {
    bg: "#B91C1C",
    dash: "14 10",
    kind: "Bunga yang Menipu",
    land: "Tebing APY Semu",
    look: "Kalau ada yang menjanjikan bunga ratusan persen sehari, tanyakan dari mana uangnya berasal.",
    props: [
      { name: "shield", side: "left", top: 22, size: 48 },
      { name: "lantern", side: "right", top: 52, size: 44 },
      { name: "coins", side: "right", top: 78, size: 40 },
    ],
  },
  u13: {
    bg: "#475569",
    dash: "14 10",
    kind: "Jaga Kepala Dingin",
    land: "Kuil Disiplin Diri",
    look: "Belajar tetap tenang supaya tidak panik menjual atau ikut-ikutan membeli saat harga tinggi.",
    props: [
      { name: "lantern", side: "left", top: 20, size: 46 },
      { name: "star", side: "right", top: 52, size: 44 },
      { name: "lantern", side: "right", top: 80, size: 42 },
    ],
  },
  u14: {
    bg: "#0284C7",
    dash: "14 10",
    kind: "Jaringan Lebih Cepat",
    land: "Jembatan Layer-2",
    look: "Kenali Layer-2: jaringan tambahan di atas Ethereum yang bikin transaksi lebih cepat dan biayanya (gas fee) lebih murah.",
    props: [
      { name: "star", side: "left", top: 22, size: 48 },
      { name: "crate", side: "right", top: 50, size: 44 },
      { name: "star", side: "right", top: 76, size: 42 },
    ],
  },
  u15: {
    bg: "#C026D3",
    dash: "14 10",
    kind: "Hadiah Komunitas",
    land: "Lembah Airdrop",
    look: "Pilah hadiah komunitas yang asli dari jebakan pencuri kunci dompet (seed phrase).",
    props: [
      { name: "coins", side: "left", top: 20, size: 48 },
      { name: "key", side: "right", top: 52, size: 44 },
      { name: "coins", side: "right", top: 78, size: 44 },
    ],
  },
  u16: {
    bg: "#047857",
    dash: "14 10",
    kind: "Koin Stabil",
    land: "Brankas Pasak Dolar",
    look: "Pahami cara koin stabil menjaga nilainya tetap mendekati satu dolar saat pasar bergejolak.",
    props: [
      { name: "shield", side: "left", top: 22, size: 48 },
      { name: "coins", side: "right", top: 50, size: 46 },
      { name: "shield", side: "right", top: 78, size: 42 },
    ],
  },
  u17: {
    bg: "#BE185D",
    dash: "14 10",
    kind: "Dunia Karya",
    land: "Balai Komunitas NFT",
    look: "Pelajari hak royalti kreator dan cara membedakan transaksi asli dari yang diatur.",
    props: [
      { name: "frame", side: "left", top: 20, size: 50 },
      { name: "flower", side: "right", top: 52, size: 42 },
      { name: "star", side: "right", top: 78, size: 44 },
    ],
  },
  u18: {
    bg: "#1E293B",
    dash: "14 10",
    kind: "Simpanan Aman",
    land: "Benteng Kunci Dingin",
    look: "Amankan aset besar di penyimpanan offline (cold wallet) dan persetujuan banyak pihak.",
    props: [
      { name: "key", side: "left", top: 22, size: 48 },
      { name: "shield", side: "right", top: 52, size: 46 },
      { name: "lantern", side: "right", top: 78, size: 42 },
    ],
  },
  u19: {
    bg: "#6366F1",
    dash: "14 10",
    kind: "Jejak Transaksi",
    land: "Menara Buku Besar",
    look: "Semua jejak transaksi terekam permanen di catatan publik, tinggal kamu yang membaca datanya.",
    props: [
      { name: "lantern", side: "left", top: 20, size: 46 },
      { name: "key", side: "right", top: 50, size: 44 },
      { name: "coins", side: "right", top: 78, size: 42 },
    ],
  },
  u20: {
    bg: "#D97706",
    dash: "14 10",
    kind: "Hidup di Web3",
    land: "Kota Mandiri Web3",
    look: "Bangun reputasi digital dan berkontribusi di komunitas yang diatur anggotanya sendiri.",
    props: [
      { name: "star", side: "left", top: 22, size: 50 },
      { name: "crate", side: "right", top: 52, size: 46 },
      { name: "star", side: "right", top: 78, size: 44 },
    ],
  },
};

export function getPulauTheme(unitId: string, index: number): PulauTheme {
  if (WORLD_PULAU_THEMES[unitId]) {
    return WORLD_PULAU_THEMES[unitId];
  }
  // Fallback if an unexpected unit ID arrives
  const fallbackUnit = `u${index}`;
  if (WORLD_PULAU_THEMES[fallbackUnit]) {
    return WORLD_PULAU_THEMES[fallbackUnit];
  }

  return {
    bg: "#4A283C",
    dash: "14 10",
    kind: "Rute Terbuka",
    land: `Blok #${index}`,
    look: "Jelajahi setiap blok secara mandiri dan cek transaksimu sendiri.",
    props: [
      { name: "star", side: "left", top: 25, size: 46 },
      { name: "lantern", side: "right", top: 70, size: 44 },
    ],
  };
}

// Pseudo-hash generator for block verification receipts
export function generateBlockHash(seedStr: string): string {
  let hash = 0;
  for (let i = 0; i < seedStr.length; i++) {
    hash = (hash << 5) - hash + seedStr.charCodeAt(i);
    hash |= 0;
  }
  const hex = Math.abs(hash).toString(16).padStart(8, "0");
  const rand = Math.abs(hash ^ 0xabcdef).toString(16).padStart(8, "0");
  return `0x${hex.slice(0, 4)}…${rand.slice(-4)}`;
}

/**
 * Titik sambung antar pulau memakai SATU warna bersama: rata-rata dari warna
 * dasar pulau atas dan bawah. Dua pita fade (bawah pulau sebelumnya, atas
 * pulau berikutnya) memakai warna ini, sehingga baris batas tidak berlompatan
 * walau artwork-nya beda terang.
 */
export function mixSeamColor(fromHex: string, toHex: string): string {
  const parse = (hex: string): [number, number, number] | null => {
    const m = /^#?([0-9a-f]{6})$/i.exec(hex.trim());
    if (!m) return null;
    const n = parseInt(m[1], 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  };
  const a = parse(fromHex);
  const b = parse(toHex);
  if (!a || !b) return fromHex;
  const mix = a.map((v, i) => Math.round((v + b[i]) / 2));
  return `#${mix.map((v) => v.toString(16).padStart(2, "0")).join("")}`;
}
