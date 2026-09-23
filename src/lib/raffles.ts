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
    title: "Genesis Blobi #001 (1-of-1 Mythic NFT)",
    host: "Web3min Genesis Vault",
    badge: "MYTHIC 1/1",
    category: "nft",
    prize: "Genesis Blobi #001 NFT + 0.05 ETH Gas Grant",
    prizeDetail: "Artefak ERC-721 1/1 di Ethereum Mainnet. Membawa buff permanen +50% XP dan akses seumur hidup ke seluruh ekosistem.",
    status: "live",
    startsAt: new Date("2026-09-24T00:00:00Z").getTime(),
    endsAt: new Date("2026-10-01T12:00:00Z").getTime(),
    ticketCost: 1,
    starsCost: 10,
    totalTickets: 428,
    totalEntries: 428,
    winnerCount: 1,
    nftRarity: "mythic",
    nftNetwork: "Ethereum",
    nftContract: "0x71c...blobi001",
    nftTokenId: "#001",
    perks: [
      "1/1 ERC-721 Genesis Artifact di Ethereum Mainnet",
      "0.05 ETH gas grant untuk wallet pemenang",
      "+50% XP boost permanen di setiap rute pelajaran",
    ],
    accentColor: "#f59e0b",
  },
  {
    id: "raf-cyber-pass",
    title: "Cyber Pass Web3 Alpha (Legendary NFT)",
    host: "Web3min DAO",
    badge: "LEGENDARY NFT",
    category: "nft",
    prize: "Cyber Pass Alpha NFT di Base L2",
    prizeDetail: "Tiket akses eksklusif Base L2 untuk fitur rute eksperimental, hak voting DAO Web3min, dan 25% Multiplier Klasemen.",
    status: "live",
    startsAt: new Date("2026-09-24T00:00:00Z").getTime(),
    endsAt: new Date("2026-10-03T12:00:00Z").getTime(),
    ticketCost: 1,
    starsCost: 10,
    totalTickets: 295,
    totalEntries: 295,
    winnerCount: 3,
    nftRarity: "legendary",
    nftNetwork: "Base",
    nftContract: "0x42f...cyberpass",
    nftTokenId: "#ALPHA",
    perks: [
      "Akses Alpha Room dan kurikulum preview rahasia",
      "Hak suara voting DAO Web3min",
      "25% Multiplier poin Klasemen Mingguan",
    ],
    accentColor: "#8b5cf6",
  },
  {
    id: "raf-defi-sorcerer",
    title: "DeFi Sorcerer #88 (Rare NFT)",
    host: "Arbitrum Guild",
    badge: "RARE NFT",
    category: "nft",
    prize: "DeFi Sorcerer In-Game Avatar NFT",
    prizeDetail: "Karakter avatar mistis langka di Arbitrum One. Memberikan penghasilan pasif 20% Yield Koin Harian saat menyelesaikan kuis.",
    status: "live",
    startsAt: new Date("2026-09-24T00:00:00Z").getTime(),
    endsAt: new Date("2026-10-05T12:00:00Z").getTime(),
    ticketCost: 2,
    starsCost: 20,
    totalTickets: 182,
    totalEntries: 182,
    winnerCount: 5,
    nftRarity: "rare",
    nftNetwork: "Arbitrum",
    nftContract: "0x88c...sorcerer",
    nftTokenId: "#88",
    perks: [
      "Skin avatar mistis eksklusif di peta Pulau Rantai",
      "20% Yield Koin Harian otomatis",
    ],
    accentColor: "#3b82f6",
  },
  {
    id: "raf-gas-mask",
    title: "Golden Gas Mask #404 (Utility NFT)",
    host: "Optimism Superchain",
    badge: "UTILITY NFT",
    category: "nft",
    prize: "Golden Gas Mask Utility NFT di Optimism",
    prizeDetail: "Pass perlindungan gas fee on-chain dan memberikan efek aura emas berkilau di samping username pada leaderboard.",
    status: "live",
    startsAt: new Date("2026-09-24T00:00:00Z").getTime(),
    endsAt: new Date("2026-10-08T12:00:00Z").getTime(),
    ticketCost: 1,
    starsCost: 10,
    totalTickets: 114,
    totalEntries: 114,
    winnerCount: 10,
    nftRarity: "utility",
    nftNetwork: "Optimism",
    nftContract: "0x404...gasmask",
    nftTokenId: "#404",
    perks: [
      "Subsidi gas fee on-chain untuk tugas smart contract",
      "Aura nama emas berkilau di tabel Klasemen",
    ],
    accentColor: "#10b981",
  },
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
    totalTickets: 342,
    totalEntries: 342,
    winnerCount: 3,
    perks: ["500 Bintang langsung ke dompet Toko Blobi"],
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
    totalTickets: 189,
    totalEntries: 189,
    winnerCount: 5,
    perks: ["Mahkota Emas eksklusif untuk avatar Blobi"],
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
    totalTickets: 512,
    totalEntries: 512,
    winnerCount: 1,
    perks: ["Lencana profil berkilau permanen"],
    accentColor: "#38bdf8",
  },
];
