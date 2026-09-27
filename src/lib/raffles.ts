export type RaffleStatus = "live" | "verifying" | "ended" | "upcoming" | "drawn";

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
  endsAt: number | null; // fixed absolute timestamp
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
  slotType?: "GTD" | "WL" | "GROUP" | "ITEM" | null;
  partnerName?: string | null;
  requirementXHandle?: string | null;
  officialMintDomain?: string | null;
  mintPrice?: string | null;
  mintSchedule?: string | null;
  announcementDate?: string | null;
  itemId?: string | null;
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

export type EffectiveRaffleStatus = RaffleStatus | "expired";

/**
 * Status undian yang SEBENARNYA, sebagai sumber kebenaran tunggal untuk UI.
 *
 * Kenapa perlu: kolom `status` di database hanya diubah MANUAL oleh admin,
 * jadi undian yang `ends_at`-nya sudah lewat tetap tersimpan `'live'` sampai
 * ada yang menutupnya. Kalau UI mempercayai kolom itu apa adanya, muncul
 * kontradiksi yang dilaporkan user: satu kartu menampilkan "Selesai" di SISA
 * WAKTU, tapi filter masih menghitungnya "Berlangsung" dan badge-nya bisa
 * bilang BERLANGSUNG.
 *
 * Server sudah benar sejak awal — RPC `enter_raffle` menolak kalau
 * `ends_at <= now()` — jadi ini murni masalah tampilan. Tapi UI yang berbohong
 * tetap merugikan: user mencoba memasang tiket, gagal, lalu menyalahkan
 * tombolnya alih-alih jadwalnya.
 *
 * Aturan:
 *   - hanya `live` yang bisa menjadi `expired`; `ended`/`drawn`/`verifying`/
 *     `upcoming` adalah keputusan admin dan TIDAK boleh "dihidupkan" oleh waktu
 *   - `ends_at` NULL = belum dijadwalkan → ikut status kolom
 *   - batas memakai `<=` supaya sama persis dengan validasi server
 */
export function effectiveRaffleStatus(
  status: RaffleStatus,
  endsAt?: number | null,
  now: number = Date.now(),
): EffectiveRaffleStatus {
  if (status !== "live") return status;
  if (endsAt == null) return status;
  return endsAt <= now ? "expired" : "live";
}

/**
 * Apakah user masih boleh memasang tiket. Menyalin syarat tombol di UI
 * (`!isLive || isExpired || !raffle.endsAt`) supaya tombol aktif/tidaknya
 * tidak pernah berbeda dari keputusan server.
 *
 * CATATAN: RPC `enter_raffle` sebenarnya LEBIH LONGGAR — ia hanya menolak
 * kalau `status <> 'live'` atau `ends_at <= now()`, jadi undian tanpa jadwal
 * (`ends_at` NULL) masih diterima server. UI sengaja lebih ketat: undian tanpa
 * batas waktu bisa berjalan selamanya. Kalau kelak server diperketat, ubah di
 * sini juga supaya keduanya tetap sama.
 */
export function isRaffleOpenForEntry(
  status: RaffleStatus,
  endsAt?: number | null,
  now: number = Date.now(),
): boolean {
  if (endsAt == null) return false;
  return effectiveRaffleStatus(status, endsAt, now) === "live";
}

export function formatRaffleCountdown(endsAt?: number | null, now: number = Date.now()): string {
  if (!endsAt) return "Belum dijadwalkan";
  const diff = endsAt - now;
  if (diff <= 0) return "Selesai";
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  if (days > 0) return `${days} Hari ${hours} Jam`;
  if (hours > 0) return `${hours} Jam ${minutes} Menit`;
  return `${minutes} Menit`;
}

export const INITIAL_RAFFLES: RaffleItem[] = [
  {
    id: "raf-nft-mufpjxfk",
    title: "RoboHood — 5 Slot GTD",
    host: "RoboHood NFT",
    badge: "SLOT MINT",
    category: "nft",
    prize: "5 Slot GTD",
    prizeDetail: "Hak mint guaranteed (GTD) allowlist resmi untuk koleksi RoboHood NFT.",
    status: "live",
    startsAt: new Date("2026-09-24T00:00:00Z").getTime(),
    endsAt: new Date("2026-10-01T12:00:00Z").getTime(),
    ticketCost: 1,
    starsCost: 10,
    winnerCount: 5,
    nftRarity: "legendary",
    nftNetwork: "Robinhood Chain",
    imageUrl: "/raffles/robohood-gtd.png",
    isSimulation: false,
    slotType: "GTD",
    partnerName: "RoboHood NFT",
    officialMintDomain: "robonft.xyz",
    requirementXHandle: "@RoboHoodNFT",
    mintPrice: "TBA",
    mintSchedule: "TBA",
    announcementDate: "1 Oktober 2026",
    perks: [
      "Jenis slot: GTD",
      "Harga mint: TBA",
      "Jadwal mint: TBA",
      "Situs mint resmi: robonft.xyz",
      "Syarat: follow @RoboHoodNFT di X",
      "Pengumuman: 1 Oktober 2026",
    ],
    accentColor: "#f59e0b",
  },
  {
    id: "raf-crown",
    title: "Mahkota Emas Blobi Eksklusif",
    host: "Ruang Ganti Blobi",
    badge: "ITEM LIMITED",
    category: "outfit",
    prize: "Item Busana Mahkota Emas",
    prizeDetail: "Aksesori kepala mahkota emas edisi terbatas untuk karakter Blobi.",
    status: "live",
    startsAt: new Date("2026-09-24T00:00:00Z").getTime(),
    endsAt: new Date("2026-10-03T12:00:00Z").getTime(),
    ticketCost: 1,
    starsCost: 10,
    winnerCount: 5,
    nftRarity: "mythic",
    imageUrl: "/mascot/acc/crown.png",
    isSimulation: false,
    slotType: "ITEM",
    itemId: "crown",
    perks: [
      "Item eksklusif avatar Blobi",
      "Nomor edisi terbatas unik",
      "Langsung masuk ke Ruang Ganti pemenang",
    ],
    accentColor: "#a855f7",
  },
  {
    id: "raf-badge-pioneer",
    title: "Lencana Kehormatan 'Pioneer Web3'",
    host: "Dewan Kehormatan Web3min",
    badge: "LENCANA PROFIL",
    category: "badge",
    prize: "Badge Profil Genesis",
    prizeDetail: "Lencana kehormatan edisi terbatas yang disematkan di kartu profil petualangmu.",
    status: "live",
    startsAt: new Date("2026-09-24T00:00:00Z").getTime(),
    endsAt: new Date("2026-10-05T12:00:00Z").getTime(),
    ticketCost: 1,
    starsCost: 10,
    winnerCount: 10,
    nftRarity: "mythic",
    imageUrl: "/props/shield.png",
    isSimulation: false,
    slotType: "ITEM",
    itemId: "badge-pioneer",
    perks: [
      "Lencana kehormatan digital di profil",
      "Nomor edisi terbatas unik",
      "Langsung terpasang di profil pemenang",
    ],
    accentColor: "#38bdf8",
  },
];
