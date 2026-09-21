export type AccessorySlot = "hat" | "face" | "neck" | "held";

export type Accessory = {
  id: string;
  name: string;
  blurb: string;
  cost: number;
  slot: AccessorySlot;
  src: string;
  x: string;
  y: string;
  w: string;
};

export const SLOTS: AccessorySlot[] = ["hat", "face", "neck", "held"];

export const SLOT_LABEL: Record<AccessorySlot, string> = {
  hat: "Kepala",
  face: "Wajah",
  neck: "Leher",
  held: "Tangan",
};

export const ACCESSORIES: Accessory[] = [
  {
    id: "leaf",
    name: "Daun hutan",
    blurb: "Rute 1. Biar kelihatan masih nyasar dengan gaya.",
    cost: 35,
    slot: "hat",
    src: "/mascot/acc/leaf.png",
    x: "28%",
    y: "2%",
    w: "44%",
  },
  {
    id: "beanie",
    name: "Kupluk blob",
    blurb: "Dingin di gua, kepala tetap hangat.",
    cost: 55,
    slot: "hat",
    src: "/mascot/acc/beanie.png",
    x: "24%",
    y: "0%",
    w: "52%",
  },
  {
    id: "helm",
    name: "Helm tambang",
    blurb: "Lampu nyala. Jangan sampe seed ke tambang.",
    cost: 95,
    slot: "hat",
    src: "/mascot/acc/helm.png",
    x: "22%",
    y: "0%",
    w: "56%",
  },
  {
    id: "crown",
    name: "Mahkota tenang",
    blurb: "Buat yang udah lulus rute penipu.",
    cost: 150,
    slot: "hat",
    src: "/mascot/acc/crown.png",
    x: "22%",
    y: "-2%",
    w: "56%",
  },
  {
    id: "glasses",
    name: "Kacamata curiga",
    blurb: "Biar makin teliti liat link aneh.",
    cost: 60,
    slot: "face",
    src: "/mascot/acc/glasses.png",
    x: "22%",
    y: "34%",
    w: "56%",
  },
  {
    id: "monocle",
    name: "Monokel DYOR",
    blurb: "Satu mata, dua kali cek kontrak.",
    cost: 80,
    slot: "face",
    src: "/mascot/acc/monocle.png",
    x: "38%",
    y: "32%",
    w: "48%",
  },
  {
    id: "visor",
    name: "Visor on-chain",
    blurb: "Lihat antrian mempool. (Bohong. Tapi keren.)",
    cost: 110,
    slot: "face",
    src: "/mascot/acc/visor.png",
    x: "18%",
    y: "33%",
    w: "64%",
  },
  {
    id: "scarf",
    name: "Syal L2",
    blurb: "Gas murah, leher tetap hangat.",
    cost: 50,
    slot: "neck",
    src: "/mascot/acc/scarf.png",
    x: "18%",
    y: "48%",
    w: "64%",
  },
  {
    id: "batik",
    name: "Selendang batik",
    blurb: "Web3 tapi tetep pulang kampung.",
    cost: 90,
    slot: "neck",
    src: "/mascot/acc/batik.png",
    x: "16%",
    y: "46%",
    w: "68%",
  },
  {
    id: "medal",
    name: "Medali laga",
    blurb: "Bukan floor NFT. Ini dari ujian rute.",
    cost: 120,
    slot: "neck",
    src: "/mascot/acc/medal.png",
    x: "36%",
    y: "42%",
    w: "28%",
  },
  {
    id: "kopi",
    name: "Kopi tubruk",
    blurb: "Biar web3min nggak ngantuk pas gas spike.",
    cost: 40,
    slot: "held",
    src: "/mascot/acc/kopi.png",
    x: "68%",
    y: "52%",
    w: "26%",
  },
  {
    id: "coin",
    name: "Koin mainan",
    blurb: "Bukan saran beli. Cuma prop.",
    cost: 45,
    slot: "held",
    src: "/mascot/acc/coin.png",
    x: "70%",
    y: "54%",
    w: "24%",
  },
  {
    id: "lantern",
    name: "Lentera gua",
    blurb: "Seed di gelap. Jangan sampe kebaca orang.",
    cost: 75,
    slot: "held",
    src: "/mascot/acc/lantern.png",
    x: "70%",
    y: "46%",
    w: "24%",
  },
  {
    id: "star",
    name: "Bintang genggam",
    blurb: "Mata uang toko, versi gendong.",
    cost: 65,
    slot: "held",
    src: "/mascot/acc/star.png",
    x: "70%",
    y: "50%",
    w: "24%",
  },
];

export const ACCESSORY_BY_ID: Record<string, Accessory> = Object.fromEntries(
  ACCESSORIES.map((row) => [row.id, row]),
);

export type Worn = Partial<Record<AccessorySlot, string>>;

export function emptyWorn(): Worn {
  return {};
}

export function wornList(worn: Worn): Accessory[] {
  return SLOTS.map((slot) => {
    const id = worn[slot];
    return id ? ACCESSORY_BY_ID[id] : undefined;
  }).filter((row): row is Accessory => Boolean(row));
}

export function sanitizeWorn(raw: unknown, outfits: string[]): Worn {
  const next: Worn = {};
  if (!raw || typeof raw !== "object") return next;
  const rec = raw as Record<string, unknown>;
  for (const slot of SLOTS) {
    const id = rec[slot];
    if (typeof id !== "string") continue;
    const acc = ACCESSORY_BY_ID[id];
    if (acc && acc.slot === slot && outfits.includes(id)) next[slot] = id;
  }
  return next;
}

export function featuredOf(worn: Worn): string | null {
  for (const slot of SLOTS) {
    const id = worn[slot];
    if (id) return id;
  }
  return null;
}
