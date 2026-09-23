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

export const WORLD_PULAU_THEMES: Record<string, PulauTheme> = {
  u1: {
    bg: "#7FBF67",
    dash: "14 10",
    kind: "Genesis",
    land: "Hutan Genesis",
    look: "Mulai kenalan sama internet yang kepemilikannya balik lagi ke tanganmu sendiri.",
    props: [
      { name: "mushroom", side: "left", top: 22, size: 52 },
      { name: "flower", side: "right", top: 48, size: 44 },
      { name: "mushroom", side: "right", top: 78, size: 40, flip: true },
    ],
  },
  u2: {
    bg: "#4B2F63",
    dash: "14 10",
    kind: "Kriptografi",
    land: "Gua Kunci Kripto",
    look: "Kunci rumah jangan dikasih orang asing, kunci dompet on-chain jauh lebih keramat.",
    props: [
      { name: "lantern", side: "left", top: 18, size: 48 },
      { name: "key", side: "right", top: 44, size: 42 },
      { name: "lantern", side: "right", top: 76, size: 46 },
    ],
  },
  u3: {
    bg: "#B27339",
    dash: "14 10",
    kind: "Konsensus",
    land: "Tambang Koin",
    look: "Bongkar cara kerja mesin konsensus di balik koin legendaris tanpa pusing rumus.",
    props: [
      { name: "coins", side: "left", top: 24, size: 46 },
      { name: "lantern", side: "right", top: 52, size: 44 },
      { name: "coins", side: "right", top: 80, size: 40 },
    ],
  },
  u4: {
    bg: "#D95280",
    dash: "14 10",
    kind: "Hak Cipta",
    land: "Galeri Token Digital",
    look: "Bukan sekadar gambar profil, tapi bukti kepemilikan digital yang anti-duplikasi.",
    props: [
      { name: "frame", side: "left", top: 20, size: 50 },
      { name: "flower", side: "right", top: 50, size: 42 },
      { name: "star", side: "right", top: 78, size: 44 },
    ],
  },
  u5: {
    bg: "#256CA8",
    dash: "14 10",
    kind: "Likuiditas",
    land: "Dermaga DeFi",
    look: "Tukar aset dan pinjam dana langsung lewat kode cerdas tanpa campur tangan calo.",
    props: [
      { name: "crate", side: "left", top: 22, size: 50 },
      { name: "lily", side: "right", top: 52, size: 42 },
      { name: "crate", side: "right", top: 80, size: 44 },
    ],
  },
  u6: {
    bg: "#9A3412",
    dash: "14 10",
    kind: "Pertahanan",
    land: "Pos Anti-Phishing",
    look: "Kenali jebakan link manis dan pop-up jahat sebelum isi dompetmu terkuras habis.",
    props: [
      { name: "shield", side: "left", top: 20, size: 48 },
      { name: "lantern", side: "right", top: 50, size: 44 },
      { name: "shield", side: "right", top: 76, size: 42 },
    ],
  },
  u7: {
    bg: "#3B82F6",
    dash: "14 10",
    kind: "Realitas Pasar",
    land: "Medan Volatilitas",
    look: "Bandingkan bayangan cuan di kalkulator sama kenyataan pahit biaya gas jaringan.",
    props: [
      { name: "coins", side: "left", top: 22, size: 46 },
      { name: "star", side: "right", top: 54, size: 42 },
      { name: "coins", side: "right", top: 80, size: 44 },
    ],
  },
  u8: {
    bg: "#0D9488",
    dash: "14 10",
    kind: "Eksekusi",
    land: "Bursa Spot",
    look: "Pahami cara beli santai di pasar spot sebelum buru-buru tergoda leverage.",
    props: [
      { name: "crate", side: "left", top: 20, size: 48 },
      { name: "coins", side: "right", top: 52, size: 44 },
      { name: "lantern", side: "right", top: 78, size: 42 },
    ],
  },
  u9: {
    bg: "#854D0E",
    dash: "14 10",
    kind: "Spekulasi",
    land: "Rawa Memecoin",
    look: "Tertawalah bareng meme viral, tapi cek likuiditasnya sebelum dana terkunci selamanya.",
    props: [
      { name: "mushroom", side: "left", top: 22, size: 50 },
      { name: "coins", side: "right", top: 50, size: 46 },
      { name: "mushroom", side: "right", top: 76, size: 42 },
    ],
  },
  u10: {
    bg: "#4338CA",
    dash: "14 10",
    kind: "Investigasi",
    land: "Lab Explorer",
    look: "Buktikan sendiri isi kontrak di explorer sebelum percaya omongan influencer timeline.",
    props: [
      { name: "key", side: "left", top: 24, size: 46 },
      { name: "star", side: "right", top: 52, size: 44 },
      { name: "lantern", side: "right", top: 80, size: 42 },
    ],
  },
  u11: {
    bg: "#15803D",
    dash: "14 10",
    kind: "Gerbang Fiat",
    land: "Pasar P2P Lokal",
    look: "Jalur resmi menukar rupiah ke dompet on-chain dengan aman dan taat aturan.",
    props: [
      { name: "crate", side: "left", top: 20, size: 50 },
      { name: "coins", side: "right", top: 50, size: 46 },
      { name: "crate", side: "right", top: 78, size: 44 },
    ],
  },
  u12: {
    bg: "#B91C1C",
    dash: "14 10",
    kind: "Jebakan Bunga",
    land: "Tebing APY Semu",
    look: "Kalau ada yang menjanjikan bunga ratusan persen sehari, hitung dari mana sumber uangnya.",
    props: [
      { name: "shield", side: "left", top: 22, size: 48 },
      { name: "lantern", side: "right", top: 52, size: 44 },
      { name: "coins", side: "right", top: 78, size: 40 },
    ],
  },
  u13: {
    bg: "#475569",
    dash: "14 10",
    kind: "Psikologi",
    land: "Kuil Disiplin Diri",
    look: "Kendalikan rem tangan mentalmu biar nggak gampang panik dan beli di pucuk.",
    props: [
      { name: "lantern", side: "left", top: 20, size: 46 },
      { name: "star", side: "right", top: 52, size: 44 },
      { name: "lantern", side: "right", top: 80, size: 42 },
    ],
  },
  u14: {
    bg: "#0284C7",
    dash: "14 10",
    kind: "Skalabilitas",
    land: "Jembatan Layer-2",
    look: "Meluncur di jalan tol Layer-2 biar transaksi kilat dan gas fee nggak bikin kantong bolong.",
    props: [
      { name: "star", side: "left", top: 22, size: 48 },
      { name: "crate", side: "right", top: 50, size: 44 },
      { name: "star", side: "right", top: 76, size: 42 },
    ],
  },
  u15: {
    bg: "#C026D3",
    dash: "14 10",
    kind: "Distribusi",
    land: "Lembah Airdrop",
    look: "Pilah hadiah komunitas yang jujur dari umpan licik pencuri seed phrase.",
    props: [
      { name: "coins", side: "left", top: 20, size: 48 },
      { name: "key", side: "right", top: 52, size: 44 },
      { name: "coins", side: "right", top: 78, size: 44 },
    ],
  },
  u16: {
    bg: "#047857",
    dash: "14 10",
    kind: "Patokan Nilai",
    land: "Brankas Pasak Dolar",
    look: "Pahami bagaimana token stabil menjaga nilainya tetap satu dolar saat badai pasar.",
    props: [
      { name: "shield", side: "left", top: 22, size: 48 },
      { name: "coins", side: "right", top: 50, size: 46 },
      { name: "shield", side: "right", top: 78, size: 42 },
    ],
  },
  u17: {
    bg: "#BE185D",
    dash: "14 10",
    kind: "Ekosistem Kreatif",
    land: "Balai Komunitas NFT",
    look: "Telusuri royalti kreator dan cara membedakan transaksi asli dari manipulasi volume.",
    props: [
      { name: "frame", side: "left", top: 20, size: 50 },
      { name: "flower", side: "right", top: 52, size: 42 },
      { name: "star", side: "right", top: 78, size: 44 },
    ],
  },
  u18: {
    bg: "#1E293B",
    dash: "14 10",
    kind: "Keamanan Keras",
    land: "Benteng Kunci Dingin",
    look: "Amankan aset besar memakai brankas offline dan persetujuan banyak pihak.",
    props: [
      { name: "key", side: "left", top: 22, size: 48 },
      { name: "shield", side: "right", top: 52, size: 46 },
      { name: "lantern", side: "right", top: 78, size: 42 },
    ],
  },
  u19: {
    bg: "#6366F1",
    dash: "14 10",
    kind: "Forensik On-Chain",
    land: "Menara Buku Besar",
    look: "Semua jejak transaksi terekam abadi di buku besar publik, tinggal kamu yang membaca datanya.",
    props: [
      { name: "lantern", side: "left", top: 20, size: 46 },
      { name: "key", side: "right", top: 50, size: 44 },
      { name: "coins", side: "right", top: 78, size: 42 },
    ],
  },
  u20: {
    bg: "#D97706",
    dash: "14 10",
    kind: "Kedaulatan Digital",
    land: "Kota Mandiri Web3",
    look: "Bangun reputasi digital, berkontribusi di komunitas mandiri, dan nikmati kedaulatanmu.",
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
    look: "Jelajahi setiap blok secara mandiri dan validasi transaksi on-chain kamu.",
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
