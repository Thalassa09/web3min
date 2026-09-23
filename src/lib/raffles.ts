export type RaffleStatus = "live" | "ended" | "upcoming";

export type RaffleCategory = "nft" | "gems" | "outfit" | "badge" | "tickets";

export type NftRarity = "Mythic" | "Legendary" | "Rare" | "Uncommon";

export type NftDetails = {
  name: string;
  collection: string;
  rarity: NftRarity;
  chain: "Ethereum" | "Base" | "Arbitrum" | "Optimism" | "Polygon";
  standard: "ERC-721" | "ERC-1155";
  contract: string;
  tokenId: string;
  perks: string[];
  artworkType: "pixel-mascot" | "cyber-pass" | "sorcerer" | "gas-mask";
  vrfSeed: string;
  explorerUrl: string;
};

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
  ticketCost: number; // in tickets (1 ticket)
  starsCost: number; // in coins (10 coins per ticket)
  totalEntries: number;
  winnerCount: number;
  requirements: string[];
  winner?: {
    username: string;
    ticketId: string;
    announcedAt: string;
    txHash?: string;
  };
  accentColor: string;
  nftDetails?: NftDetails;
};

export type ActivityEntry = {
  id: string;
  type: "enter" | "win" | "convert";
  username: string;
  action: string;
  raffleTitle: string;
  timeAgo: string;
  txHash?: string;
};

export const RAFFLE_TICKET_PRICE = 10; // 10 Koin = 1 Tiket

const NOW = Date.now();
const DAY_MS = 24 * 60 * 60 * 1000;

export const INITIAL_RAFFLES: RaffleItem[] = [
  {
    id: "raf-nft-genesis-blobi",
    title: "Genesis Blobi #001 (1-of-1 Mythic NFT)",
    host: "Web3min Genesis Vault",
    badge: "MYTHIC 1/1",
    category: "nft",
    prize: "1x Genesis Blobi #001 NFT + 0.05 ETH Gas Grant",
    prizeDetail: "NFT ERC-721 1-of-1 paling langka di ekosistem Web3min. Memberikan status Pioneer Kehormatan on-chain dan akses ke seluruh fitur masa depan tanpa batas.",
    status: "live",
    endsAt: NOW + 3 * DAY_MS + 14 * 3600 * 1000,
    ticketCost: 1,
    starsCost: 10,
    totalEntries: 428,
    winnerCount: 1,
    requirements: ["Terbuka untuk semua petualang (Beli tiket pakai Koin)"],
    accentColor: "#ec4899",
    nftDetails: {
      name: "Genesis Blobi #001",
      collection: "Web3min Genesis Artifacts",
      rarity: "Mythic",
      chain: "Ethereum",
      standard: "ERC-721",
      contract: "0x461De9fA7157...001e",
      tokenId: "#001",
      perks: [
        "1-of-1 Mythic Artwork Eksklusif",
        "+50% XP Boost Permanen di Semua Modul",
        "Airdrop Badge Pioneer Kehormatan",
        "Grant Saldo Gas 0.05 ETH On-Chain",
      ],
      artworkType: "pixel-mascot",
      vrfSeed: "0x7f4c9a8b12e09c8411d3fae50012bc44391b1f9e2089412a884efc71e41b",
      explorerUrl: "https://etherscan.io/address/0x461De9fA7157a3e74288820f4c084e365001e",
    },
  },
  {
    id: "raf-nft-cyber-pass",
    title: "Cyber Pass Web3 Alpha (Legendary NFT)",
    host: "Base Builders Guild",
    badge: "LEGENDARY NFT",
    category: "nft",
    prize: "Cyber Pass Web3 Alpha Access NFT (Base L2)",
    prizeDetail: "Tiket akses eksklusif jaringan Base L2. Memberikan hak voting kurikulum DAO, Discord Alpha Role, dan multiplier hadiah klasemen mingguan.",
    status: "live",
    endsAt: NOW + 2 * DAY_MS + 8 * 3600 * 1000,
    ticketCost: 1,
    starsCost: 10,
    totalEntries: 615,
    winnerCount: 1,
    requirements: ["Terbuka untuk semua petualang (Beli tiket pakai Koin)"],
    accentColor: "#3b82f6",
    nftDetails: {
      name: "Cyber Pass Alpha #077",
      collection: "Base Web3min Alpha Access",
      rarity: "Legendary",
      chain: "Base",
      standard: "ERC-721",
      contract: "0x892a0134f1b...419a",
      tokenId: "#077",
      perks: [
        "Akses VIP ke Room Riset Alpha",
        "Multiplier Koin Klasemen +25%",
        "Discord Sovereign Role & Alpha Chat",
      ],
      artworkType: "cyber-pass",
      vrfSeed: "0x3a91bb2c0847dff5a1099248cb123e4981a81093129841fcaa901c",
      explorerUrl: "https://basescan.org/address/0x892a0134f1b0a724bca09c81298419a",
    },
  },
  {
    id: "raf-nft-defi-sorcerer",
    title: "DeFi Sorcerer #88 (Rare NFT)",
    host: "Arbitrum Alchemists",
    badge: "RARE NFT",
    category: "nft",
    prize: "DeFi Sorcerer Avatar NFT + 20% Staking Boost",
    prizeDetail: "Avatar mistis DeFi di jaringan Arbitrum One. Mensimulasikan likuiditas yield on-chain dan memberikan booster koin otomatis setiap menyelesaikan babak kuis.",
    status: "live",
    endsAt: NOW + 4 * DAY_MS + 18 * 3600 * 1000,
    ticketCost: 1,
    starsCost: 10,
    totalEntries: 298,
    winnerCount: 2,
    requirements: ["Terbuka untuk semua petualang (Beli tiket pakai Koin)"],
    accentColor: "#8b5cf6",
    nftDetails: {
      name: "DeFi Sorcerer #88",
      collection: "Arbitrum Elemental Avatars",
      rarity: "Rare",
      chain: "Arbitrum",
      standard: "ERC-721",
      contract: "0x11fa38290bc...77d1",
      tokenId: "#88",
      perks: [
        "Avatar Karakter Bertuah Mistis",
        "+20% Yield Koin Harian Otomatis",
        "Badge Spesial 'Alchemist' di Profil",
      ],
      artworkType: "sorcerer",
      vrfSeed: "0xbf8001a4e8912389baac018491823901bca012849129419167e2",
      explorerUrl: "https://arbiscan.io/address/0x11fa38290bc98124b81092841029177d1",
    },
  },
  {
    id: "raf-nft-golden-gas-mask",
    title: "Golden Gas Mask #404 (Utility NFT)",
    host: "Optimism Collective",
    badge: "UTILITY NFT",
    category: "nft",
    prize: "Golden Gas Mask NFT (Zero Gas Subsidy Pass)",
    prizeDetail: "NFT utilitas bertema cyberpunk steampunk di jaringan Optimism. Mensubsidi biaya transaksi on-chain in-game saat kamu menjalankan tugas interaktif smart contract.",
    status: "live",
    endsAt: NOW + 5 * DAY_MS + 22 * 3600 * 1000,
    ticketCost: 1,
    starsCost: 10,
    totalEntries: 172,
    winnerCount: 3,
    requirements: ["Terbuka untuk semua petualang (Beli tiket pakai Koin)"],
    accentColor: "#f59e0b",
    nftDetails: {
      name: "Golden Gas Mask #404",
      collection: "Superchain Cyber Gear",
      rarity: "Uncommon",
      chain: "Optimism",
      standard: "ERC-1155",
      contract: "0xfa9180c412b...ee84",
      tokenId: "#404",
      perks: [
        "Subsidi Gas Fee Otomatis di L2",
        "Aksesori Masker Emas di Profil Blobi",
        "Tiket Masuk Guild Penguji Testnet",
      ],
      artworkType: "gas-mask",
      vrfSeed: "0x19ca442bc019842fba9012840912c8a192804bca091824109ee84",
      explorerUrl: "https://optimistic.etherscan.io/address/0xfa9180c412b918240981204918249018ee84",
    },
  },
  {
    id: "raf-genesis-pioneer-ended",
    title: "Genesis Pioneer Badge NFT #001",
    host: "Web3min Curators",
    badge: "SELESAI · TERVERIFIKASI",
    category: "nft",
    prize: "Lencana Kehormatan Genesis Pioneer ERC-721",
    prizeDetail: "Undian putaran pembukaan telah selesai dan diverifikasi via Chainlink VRF on-chain.",
    status: "ended",
    endsAt: NOW - 2 * DAY_MS,
    ticketCost: 1,
    starsCost: 10,
    totalEntries: 410,
    winnerCount: 1,
    requirements: ["Selesai rute 1-5"],
    accentColor: "#10b981",
    winner: {
      username: "satoshi_jkt",
      ticketId: "#TKT-0418-WIN",
      announcedAt: "2 hari yang lalu",
      txHash: "0x78a1bc4019283749281a0bce84192084bca09124",
    },
    nftDetails: {
      name: "Genesis Pioneer Badge #001",
      collection: "Web3min Pioneer Badges",
      rarity: "Legendary",
      chain: "Ethereum",
      standard: "ERC-721",
      contract: "0x001a8291bf...99c1",
      tokenId: "#001",
      perks: ["Permanent Genesis Badge", "VIP Governance"],
      artworkType: "pixel-mascot",
      vrfSeed: "0xdeadbeef8192049120491820491824019284019284019284",
      explorerUrl: "https://etherscan.io/tx/0x78a1bc4019283749281a0bce84192084bca09124",
    },
  },
];

export const MOCK_ACTIVITY: ActivityEntry[] = [
  {
    id: "act-1",
    type: "enter",
    username: "satoshi_jkt",
    action: "memasukkan 10 tiket ke",
    raffleTitle: "Genesis Blobi #001",
    timeAgo: "42 detik lalu",
  },
  {
    id: "act-2",
    type: "convert",
    username: "kripto_bunda",
    action: "menukar 50 Koin ➔ 5 Tiket Raffle",
    raffleTitle: "Kasir Tiket Koin",
    timeAgo: "2 menit lalu",
  },
  {
    id: "act-3",
    type: "enter",
    username: "defi_ninja",
    action: "memasukkan 5 tiket ke",
    raffleTitle: "Cyber Pass Web3 Alpha",
    timeAgo: "5 menit lalu",
  },
  {
    id: "act-4",
    type: "win",
    username: "satoshi_jkt",
    action: "memenangkan undian",
    raffleTitle: "Genesis Pioneer Badge NFT",
    timeAgo: "2 hari lalu",
    txHash: "0x78a1...0912",
  },
  {
    id: "act-5",
    type: "enter",
    username: "bayu_eth",
    action: "memasukkan 3 tiket ke",
    raffleTitle: "DeFi Sorcerer #88",
    timeAgo: "12 menit lalu",
  },
  {
    id: "act-6",
    type: "convert",
    username: "rani_web3",
    action: "menukar 100 Koin ➔ 10 Tiket Raffle",
    raffleTitle: "Kasir Tiket Koin",
    timeAgo: "18 menit lalu",
  },
];
