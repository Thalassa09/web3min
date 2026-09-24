export type RaffleStatus = "live" | "ended" | "upcoming" | "drawn";

export type RaffleCategory = "nft" | "gems" | "outfit" | "badge" | "tickets";

export type RaffleRarity = "mythic" | "legendary" | "rare" | "utility";

export type RaffleItem = {
  id: string;
  title: string;
  host?: string;
  badge?: string;
  category: RaffleCategory;
  prize: string;
  prizeDetail: string;
  status: RaffleStatus;
  startsAt?: number;
  endsAt: number; // fixed absolute timestamp
  ticketCost: number; // in tickets
  starsCost: number; // alternative in coins/gems
  winnerCount: number;
  totalTickets?: number;
  totalEntries?: number;
  userTickets?: number;
  requirements?: string[];
  perks?: string[];
  nftNetwork?: string;
  nftContract?: string;
  nftTokenId?: string;
  nftRarity?: RaffleRarity;
  imageUrl?: string;
  isSimulation?: boolean;
  accentColor?: string;
  winner?: {
    username: string;
    ticketId: string;
    announcedAt: string;
  };
};

export type ActivityEntry = {
  id: string;
  type: "enter" | "win" | "buy";
  username: string;
  action: string;
  raffleTitle: string;
  timeAgo: string;
};

export const RAFFLE_TICKET_PRICE = 10; // 10 koin = 1 tiket

export function formatRaffleCountdown(endsAt: number): string {
  const diff = endsAt - Date.now();
  if (diff <= 0) return "Selesai";
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  if (days > 0) return `${days}h ${hours}j lagi`;
  if (hours > 0) return `${hours}j ${minutes}m lagi`;
  return `${minutes}m lagi`;
}

export const INITIAL_RAFFLES: RaffleItem[] = [
  {
    id: "raf-genesis-blobi",
    title: "Genesis Blobi #001 (Koleksi In-App)",
    host: "Web3min Genesis Vault",
    badge: "ARTEFAK IN-APP",
    category: "nft",
    prize: "Genesis Blobi #001 (Skin Eksklusif)",
    prizeDetail: "Hadiah dalam aplikasi, bukan aset kripto sungguhan. Skin avatar Blobi 1/1 eksklusif dengan efek visual berkilau di aplikasi.",
    status: "live",
    startsAt: new Date("2026-09-24T00:00:00Z").getTime(),
    endsAt: new Date("2026-10-01T12:00:00Z").getTime(),
    ticketCost: 1,
    starsCost: 10,
    winnerCount: 1,
    nftRarity: "mythic",
    perks: [
      "Skin avatar Blobi eksklusif 1-of-1",
      "Efek visual profil emas berkilau",
      "Hadiah dalam aplikasi, bukan aset kripto sungguhan",
    ],
    accentColor: "#f59e0b",
  },
  {
    id: "raf-cyber-pass",
    title: "Cyber Pass Alpha (Lencana In-App)",
    host: "Web3min Komunitas",
    badge: "LENCANA ALPHA",
    category: "nft",
    prize: "Lencana Cyber Pass Alpha",
    prizeDetail: "Hadiah dalam aplikasi, bukan aset kripto sungguhan. Lencana digital kehormatan untuk profil petualangmu.",
    status: "live",
    startsAt: new Date("2026-09-24T00:00:00Z").getTime(),
    endsAt: new Date("2026-10-03T12:00:00Z").getTime(),
    ticketCost: 1,
    starsCost: 10,
    winnerCount: 3,
    nftRarity: "legendary",
    perks: [
      "Lencana digital kehormatan di profil",
      "Akses preview modul rute eksperimental",
      "Hadiah dalam aplikasi, bukan aset kripto sungguhan",
    ],
    accentColor: "#8b5cf6",
  },
  {
    id: "raf-defi-sorcerer",
    title: "DeFi Sorcerer (Outfit In-App)",
    host: "Koleksi Penjelajah",
    badge: "OUTFIT LANGKA",
    category: "outfit",
    prize: "Kostum DeFi Sorcerer Blobi",
    prizeDetail: "Hadiah dalam aplikasi, bukan aset kripto sungguhan. Jubah pesulap DeFi untuk karakter Blobi di Ruang Ganti.",
    status: "live",
    startsAt: new Date("2026-09-24T00:00:00Z").getTime(),
    endsAt: new Date("2026-10-05T12:00:00Z").getTime(),
    ticketCost: 2,
    starsCost: 20,
    winnerCount: 5,
    nftRarity: "rare",
    perks: [
      "Kostum jubah pesulap eksklusif Blobi",
      "Dapat dipakai langsung di Ruang Ganti",
      "Hadiah dalam aplikasi, bukan aset kripto sungguhan",
    ],
    accentColor: "#3b82f6",
  },
  {
    id: "raf-gas-mask",
    title: "Golden Gas Mask (Aksesori In-App)",
    host: "Koleksi Penjelajah",
    badge: "AKSESORI",
    category: "outfit",
    prize: "Aksesori Topeng Gas Emas",
    prizeDetail: "Hadiah dalam aplikasi, bukan aset kripto sungguhan. Aksesori kepala topeng emas untuk avatar Blobi di Ruang Ganti.",
    status: "live",
    startsAt: new Date("2026-09-24T00:00:00Z").getTime(),
    endsAt: new Date("2026-10-08T12:00:00Z").getTime(),
    ticketCost: 1,
    starsCost: 10,
    winnerCount: 10,
    nftRarity: "utility",
    perks: [
      "Aksesori kepala topeng emas untuk Blobi",
      "Aura nama berkilau di tabel Klasemen",
      "Hadiah dalam aplikasi, bukan aset kripto sungguhan",
    ],
    accentColor: "#10b981",
  },
  {
    id: "raf-gems-500",
    title: "Paket 500 Koin Belajar",
    host: "Blobi Treasure Vault",
    badge: "500 KOIN",
    category: "gems",
    prize: "500 Koin Toko Blobi",
    prizeDetail: "Hadiah dalam aplikasi, bukan aset kripto sungguhan. Tambahan saldo koin belajar untuk outfit dan booster di Toko.",
    status: "live",
    endsAt: new Date("2026-10-01T12:00:00Z").getTime(),
    ticketCost: 1,
    starsCost: 10,
    winnerCount: 3,
    perks: [
      "500 Koin langsung ke saldo Toko Blobi",
      "Hadiah dalam aplikasi, bukan aset kripto sungguhan",
    ],
    accentColor: "#fbbf24",
  },
  {
    id: "raf-crown",
    title: "Mahkota Emas Blobi",
    host: "Ruang Ganti Blobi",
    badge: "OUTFIT EKSKLUSIF",
    category: "outfit",
    prize: "Aksesori Mahkota Emas Blobi",
    prizeDetail: "Hadiah dalam aplikasi, bukan aset kripto sungguhan. Aksesori kepala mahkota emas berkilau untuk karakter Blobi.",
    status: "live",
    endsAt: new Date("2026-10-03T12:00:00Z").getTime(),
    ticketCost: 1,
    starsCost: 10,
    winnerCount: 5,
    perks: [
      "Mahkota Emas eksklusif untuk avatar Blobi",
      "Hadiah dalam aplikasi, bukan aset kripto sungguhan",
    ],
    accentColor: "#a855f7",
  },
  {
    id: "raf-badge-pioneer",
    title: "Lencana Kehormatan Pioneer Web3",
    host: "Dewan Kehormatan Web3min",
    badge: "LENCANA PROFIL",
    category: "badge",
    prize: "Gelar Khusus 'Pioneer Web3' & Lencana Profil",
    prizeDetail: "Hadiah dalam aplikasi, bukan aset kripto sungguhan. Lencana kehormatan yang disematkan di kartu profil petualangmu.",
    status: "live",
    endsAt: new Date("2026-10-05T12:00:00Z").getTime(),
    ticketCost: 2,
    starsCost: 20,
    winnerCount: 1,
    perks: [
      "Lencana kehormatan di kartu profil",
      "Hadiah dalam aplikasi, bukan aset kripto sungguhan",
    ],
    accentColor: "#38bdf8",
  },
];
