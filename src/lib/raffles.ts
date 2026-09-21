export type RaffleStatus = "live" | "ended" | "upcoming";

export type RaffleCategory = "gems" | "outfit" | "badge" | "tickets";

export type RaffleItem = {
  id: string;
  title: string;
  host: string;
  hostAvatar?: string;
  badge: string;
  category: RaffleCategory;
  prize: string;
  prizeDetail: string;
  status: RaffleStatus;
  endsAt: number; // fixed absolute timestamp
  ticketCost: number; // in tickets
  starsCost: number; // alternative in stars
  totalEntries: number;
  winnerCount: number;
  requirements: string[];
  winner?: {
    username: string;
    ticketId: string;
    announcedAt: string;
  };
  accentColor: string;
};

export type ActivityEntry = {
  id: string;
  type: "enter" | "win";
  username: string;
  action: string;
  raffleTitle: string;
  timeAgo: string;
};

export const RAFFLE_TICKET_PRICE = 10;

export const INITIAL_RAFFLES: RaffleItem[] = [
  {
    id: "raf-gems-500",
    title: "Paket 500 Bintang Penjelajah",
    host: "Blobi Treasure Vault",
    badge: "500 BINTANG",
    category: "gems",
    prize: "500 Bintang Toko Blobi",
    prizeDetail: "Tambahan saldo bintang melimpah untuk memborong seluruh outfit dan booster belajar di Toko.",
    status: "live",
    endsAt: new Date("2026-10-01T12:00:00Z").getTime(),
    ticketCost: 1,
    starsCost: 10,
    totalEntries: 342,
    winnerCount: 3,
    requirements: ["Selesaikan minimal 1 pelajaran di Rute 1"],
    accentColor: "#fbbf24",
  },
  {
    id: "raf-crown",
    title: "Mahkota Emas Blobi Eksklusif",
    host: "Ruang Ganti Blobi",
    badge: "OUTFIT EKSKLUSIF",
    category: "outfit",
    prize: "Aksesori Mahkota Emas Blobi",
    prizeDetail: "Aksesori kepala eksklusif berkilau yang hanya bisa diperoleh dari arena undian in-game.",
    status: "live",
    endsAt: new Date("2026-10-03T12:00:00Z").getTime(),
    ticketCost: 1,
    starsCost: 10,
    totalEntries: 189,
    winnerCount: 5,
    requirements: ["Selesaikan minimal 1 pelajaran di Rute 3"],
    accentColor: "#a855f7",
  },
  {
    id: "raf-badge-pioneer",
    title: "Lencana Kehormatan 'Pioneer Web3'",
    host: "Dewan Kehormatan Web3min",
    badge: "LENCANA GELAR",
    category: "badge",
    prize: "Gelar Khusus 'Pioneer Web3' & Lencana Profil",
    prizeDetail: "Lencana retro berkilau yang disematkan permanen di kartu profil petualangmu.",
    status: "live",
    endsAt: new Date("2026-10-05T12:00:00Z").getTime(),
    ticketCost: 2,
    starsCost: 20,
    totalEntries: 512,
    winnerCount: 1,
    requirements: ["Selesaikan minimal 1 pelajaran di Rute 6"],
    accentColor: "#38bdf8",
  },
  {
    id: "raf-tickets-pack",
    title: "Bundel 30 Tiket Petualang Super",
    host: "Arena Belajar Web3min",
    badge: "30 TIKET",
    category: "tickets",
    prize: "30 Tiket Undian Tambahan",
    prizeDetail: "Modal tiket berlimpah untuk berpartisipasi di semua putaran undian hadiah in-game berikutnya.",
    status: "live",
    endsAt: new Date("2026-10-07T12:00:00Z").getTime(),
    ticketCost: 1,
    starsCost: 10,
    totalEntries: 98,
    winnerCount: 5,
    requirements: ["Terbuka untuk semua petualang"],
    accentColor: "#00f59b",
  },
  {
    id: "raf-genesis-pioneer",
    title: "Lencana Angkatan Pertama Genesis",
    host: "Web3min Curators",
    badge: "SELESAI",
    category: "badge",
    prize: "Lencana Kehormatan Angkatan 001",
    prizeDetail: "Tanda kehormatan angkatan pertama web3min Indonesia.",
    status: "ended",
    endsAt: new Date("2026-09-20T12:00:00Z").getTime(),
    ticketCost: 1,
    starsCost: 10,
    totalEntries: 410,
    winnerCount: 1,
    requirements: ["Selesai rute 1-5"],
    winner: {
      username: "thalassa",
      ticketId: "#0482",
      announcedAt: "Undian Selesai",
    },
    accentColor: "#f43f5e",
  },
];

export const INITIAL_ACTIVITIES: ActivityEntry[] = [
  {
    id: "act-1",
    type: "enter",
    username: "petualang_01",
    action: "memasukkan 2 tiket ke",
    raffleTitle: "Paket 500 Bintang Penjelajah",
    timeAgo: "10M LALU",
  },
  {
    id: "act-2",
    type: "enter",
    username: "blobi_rider",
    action: "memasukkan 1 tiket ke",
    raffleTitle: "Mahkota Emas Blobi Eksklusif",
    timeAgo: "24M LALU",
  },
  {
    id: "act-3",
    type: "enter",
    username: "onchain_learner",
    action: "memasukkan 3 tiket ke",
    raffleTitle: "Lencana Kehormatan 'Pioneer Web3'",
    timeAgo: "45M LALU",
  },
];
