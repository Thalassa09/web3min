export type RaffleStatus = "live" | "ended" | "upcoming";

export type RaffleCategory = "usdt" | "whitelist" | "hardware" | "gamefi" | "nft";

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
  endsAt: number; // timestamp
  ticketCost: number; // in tickets
  starsCost: number; // alternative in stars
  totalEntries: number;
  winnerCount: number;
  vrfSeed: string;
  verifiedBlock: string;
  network: string;
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

// Realistic initial raffles
export const INITIAL_RAFFLES: RaffleItem[] = [
  {
    id: "raf-usdt-100",
    title: "100 USDT Learning Incentive Pool",
    host: "Web3Min Foundation",
    badge: "100 USDT",
    category: "usdt",
    prize: "100 USDT Direct Transfer",
    prizeDetail: "Airdrop langsung ke wallet pemenang (Polygon / Arbitrum). Bebas digunakan.",
    status: "live",
    endsAt: Date.now() + 2 * 3600 * 1000 + 45 * 60 * 1000, // 2h 45m
    ticketCost: 1,
    starsCost: 10,
    totalEntries: 342,
    winnerCount: 2,
    vrfSeed: "0x7f9a8421bc08de16c4f028ab91c89012a4f56789e01234567890abcdef123456",
    verifiedBlock: "#19882341",
    network: "Arbitrum One",
    requirements: ["Selesaikan minimal Rute 1 (Hutan)", "Tanpa koneksi wallet saat mendaftar"],
    accentColor: "#00f59b",
  },
  {
    id: "raf-gtd-monad",
    title: "Monad & Berachain Early GTD Pass",
    host: "Alpha Hunter Desk",
    badge: "GTD WHITELIST",
    category: "whitelist",
    prize: "Guaranteed Whitelist (Zero Gas War)",
    prizeDetail: "Akses mint terjamin untuk ekosistem L1 generasi terbaru tanpa risiko frontrun.",
    status: "live",
    endsAt: Date.now() + 6 * 3600 * 1000 + 15 * 60 * 1000, // 6h 15m
    ticketCost: 1,
    starsCost: 10,
    totalEntries: 189,
    winnerCount: 5,
    vrfSeed: "0x3e109d77cb81aa44590218731ff21a88476bbca891024510bcfa829104fae109",
    verifiedBlock: "#19882990",
    network: "Monad Testnet",
    requirements: ["Selesaikan Rute 3 (Tambang Gas)", "Paham konsep gas limit & slippage"],
    accentColor: "#a855f7",
  },
  {
    id: "raf-ledger-s",
    title: "Ledger Nano S Plus Security Edition",
    host: "Web3 Security Shield",
    badge: "HARDWARE WALLET",
    category: "hardware",
    prize: "1x Unit Ledger Nano S Plus Original",
    prizeDetail: "Hardware wallet fisik dikirim resmi ke alamat pemenang atau ditukar voucher $79.",
    status: "live",
    endsAt: Date.now() + 28 * 3600 * 1000, // 28h
    ticketCost: 2,
    starsCost: 20,
    totalEntries: 512,
    winnerCount: 1,
    vrfSeed: "0x9c445890fae412034981abffccaa90241846152840192451bbbb88129034aa21",
    verifiedBlock: "#19883500",
    network: "Ethereum Mainnet",
    requirements: ["Selesaikan Rute 6 (Malam Phishing)", "Skor Sempurna di Kuis Private Key"],
    accentColor: "#38bdf8",
  },
  {
    id: "raf-blobi-stars",
    title: "Jackpot 500 Bintang & Nyawa Infinite",
    host: "Blobi Vault Casino",
    badge: "500 BINTANG",
    category: "gamefi",
    prize: "500 Bintang Toko + 7 Hari Nyawa Infinite",
    prizeDetail: "Borong semua kostum dan aksesoris Blobi tanpa takut kehabisan nyawa belajar.",
    status: "live",
    endsAt: Date.now() + 8 * 3600 * 1000 + 30 * 60 * 1000, // 8h 30m
    ticketCost: 1,
    starsCost: 10,
    totalEntries: 98,
    winnerCount: 3,
    vrfSeed: "0xaa41029415829102834190283419082341908234190823419082341908234190",
    verifiedBlock: "#19881120",
    network: "Web3min L2",
    requirements: ["Terbuka untuk semua pelajar aktif"],
    accentColor: "#fbbf24",
  },
  {
    id: "raf-pioneer-nft",
    title: "Pioneer Genesis Early NFT Pass",
    host: "Web3min Curators",
    badge: "SEALED DRAW",
    category: "nft",
    prize: "Genesis Learner SBT #001",
    prizeDetail: "Tanda kehormatan onchain angkatan pertama web3min Indonesia.",
    status: "ended",
    endsAt: Date.now() - 12 * 3600 * 1000,
    ticketCost: 1,
    starsCost: 10,
    totalEntries: 410,
    winnerCount: 1,
    vrfSeed: "0x6198421098420194821094821094821094821094821094821094821094821094",
    verifiedBlock: "#19875000",
    network: "Polygon POS",
    requirements: ["Selesai rute 1-5"],
    winner: {
      username: "thalassa",
      ticketId: "#0482",
      announcedAt: "12 jam yang lalu",
    },
    accentColor: "#f43f5e",
  },
];

export const INITIAL_ACTIVITIES: ActivityEntry[] = [
  {
    id: "act-1",
    type: "win",
    username: "ardhi_w",
    action: "menang",
    raffleTitle: "Pioneer Genesis Early NFT Pass",
    timeAgo: "12M AGO",
  },
  {
    id: "act-2",
    type: "enter",
    username: "crypto_boy99",
    action: "memasukkan 3 tiket ke",
    raffleTitle: "100 USDT Learning Incentive Pool",
    timeAgo: "44S AGO",
  },
  {
    id: "act-3",
    type: "enter",
    username: "siti_onchain",
    action: "memasukkan 1 tiket ke",
    raffleTitle: "Monad & Berachain Early GTD Pass",
    timeAgo: "1M AGO",
  },
  {
    id: "act-4",
    type: "enter",
    username: "budi_degen",
    action: "memasukkan 2 tiket ke",
    raffleTitle: "Ledger Nano S Plus Security Edition",
    timeAgo: "2M AGO",
  },
  {
    id: "act-5",
    type: "win",
    username: "mega_whale",
    action: "menang",
    raffleTitle: "50 USDT Community Pool #18",
    timeAgo: "35M AGO",
  },
  {
    id: "act-6",
    type: "enter",
    username: "solana_fren",
    action: "memasukkan 1 tiket ke",
    raffleTitle: "Jackpot 500 Bintang & Nyawa Infinite",
    timeAgo: "4M AGO",
  },
];
