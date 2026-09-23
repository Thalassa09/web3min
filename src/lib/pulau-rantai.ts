/**
 * web3min: Pulau Rantai
 * Mathematical Catmull-Rom spline curves & World Configuration
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

export const WORLD_PULAU_THEMES: Record<
  string,
  {
    bg: string;
    dash: string;
    kind: string;
    land: string;
    look: string;
    props: Array<{ name: string; side: "left" | "right"; top: number; size: number; flip?: boolean }>;
  }
> = {
  u1: {
    bg: "#7FBF67",
    dash: "0 18",
    kind: "Rumput",
    land: "Hutan",
    look: "Hutan permen. Jalan pelan, jangan nyasar.",
    props: [
      { name: "mushroom", side: "left", top: 22, size: 52 },
      { name: "flower", side: "right", top: 48, size: 44 },
      { name: "mushroom", side: "right", top: 78, size: 40, flip: true },
    ],
  },
  u2: {
    bg: "#4B2F63",
    dash: "14 12",
    kind: "Gelap",
    land: "Gua kunci",
    look: "Gua kunci. Gelap. Kuncinya jangan sampe ilang.",
    props: [
      { name: "lantern", side: "left", top: 18, size: 48 },
      { name: "key", side: "right", top: 44, size: 42 },
      { name: "lantern", side: "right", top: 76, size: 46 },
    ],
  },
  u3: {
    bg: "#B27339",
    dash: "24 16",
    kind: "Baja",
    land: "Tambang koin",
    look: "Tambang koin. Berdebu, kilauannya bikin silau.",
    props: [
      { name: "coins", side: "left", top: 24, size: 46 },
      { name: "lantern", side: "right", top: 52, size: 44 },
      { name: "coins", side: "right", top: 80, size: 40 },
    ],
  },
  u4: {
    bg: "#D95280",
    dash: "8 10",
    kind: "Kristal",
    land: "Galeri Seni",
    look: "Pajangan NFT unik berbingkai neon digital.",
    props: [
      { name: "frame", side: "left", top: 20, size: 50 },
      { name: "flower", side: "right", top: 50, size: 42 },
      { name: "star", side: "right", top: 78, size: 44 },
    ],
  },
  u5: {
    bg: "#256CA8",
    dash: "12 8",
    kind: "Air",
    land: "Pasar DeFi",
    look: "Pelabuhan kolam likuiditas dan pertukaran kilat.",
    props: [
      { name: "crate", side: "left", top: 22, size: 50 },
      { name: "lily", side: "right", top: 52, size: 42 },
      { name: "crate", side: "right", top: 80, size: 44 },
    ],
  },
};

export function getPulauTheme(unitId: string, index: number) {
  if (WORLD_PULAU_THEMES[unitId]) {
    return WORLD_PULAU_THEMES[unitId];
  }
  // Generative fallback for u6..u20
  const bgPalette = ["#8B5CF6", "#E63329", "#1CB0F6", "#F2841F", "#34C06A", "#1E3A5F"];
  const dashPalette = ["14 12", "0 18", "20 14", "8 10"];
  const kindPalette = ["Api", "Batu", "Udara", "Reruntuhan", "Benteng", "Puncak"];
  const propList = ["shield", "star", "key", "lantern", "coins", "book", "crate", "ice"];

  return {
    bg: bgPalette[(index - 1) % bgPalette.length],
    dash: dashPalette[(index - 1) % dashPalette.length],
    kind: kindPalette[(index - 1) % kindPalette.length],
    land: `Rute Pulau #${index}`,
    look: "Lanjutkan penjelajahan on-chain kamu melintasi blok rantai.",
    props: [
      { name: propList[(index * 2) % propList.length], side: "left" as const, top: 25, size: 46 },
      { name: propList[(index * 3) % propList.length], side: "right" as const, top: 70, size: 44 },
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
