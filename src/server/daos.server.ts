/**
 * Data DAO — SERVER SAJA.
 *
 * ⚠️ JANGAN impor file ini dari komponen klien. File ini membaca `process.env`
 * (termasuk link undangan Discord dari `DAO_INVITE_*`), jadi kalau ikut ke
 * bundle klien, link undangan bocor dan gate kuisnya jadi sia-sia.
 * Impor hanya dari `server/api/dao/*` (h3 route) dan test.
 *
 * Link undangan TIDAK PERNAH ditulis di file ini — selalu dari env:
 *   DAO_INVITE_<ID_UPPERCASE>   (contoh: DAO_INVITE_WEB3MIN=https://discord.gg/xxxx)
 * Kalau env kosong / formatnya tidak valid, DAO itu ditandai `available: false`
 * dan kartunya tampil terkunci "segera hadir" — bukan error.
 */

import { getLesson } from "../lib/curriculum";
import { isValidDiscordInvite } from "../lib/dao-url";
import type { DaoPublic } from "../lib/dao-core";

export type Dao = {
  id: string;
  name: string;
  tagline: string;
  description: string;
  category: string;
  logo?: string;
  /** ID kuis yang wajib selesai. Wajib ada di `getLesson()`. */
  requires: string[];
};

/** Isi awal. Menambah DAO = tambah entri di sini + set env `DAO_INVITE_<ID>`. */
export const DAOS: Dao[] = [
  {
    id: "web3min",
    name: "web3min",
    tagline: "Komunitas resmi",
    description:
      "Tempat nanya, tempat ngerjain bareng, dan tempat info fitur baru. Ramah pemula — nggak ada yang nyuruh beli koin.",
    category: "Komunitas",
    logo: "/blobi.png",
    requires: ["u2-cp"],
  },
  {
    id: "dompet-aman",
    name: "Dompet Aman ID",
    tagline: "Belajar jaga dompet",
    description:
      "Grup diskusi keamanan dompet: review wallet, bahas phishing terbaru, dan latihan bareng sebelum pegang dana nyata.",
    category: "Keamanan",
    logo: "/blobi.png",
    requires: ["u6-cp"],
  },
  {
    id: "riset-bareng",
    name: "Riset Bareng",
    tagline: "Belajar riset on-chain",
    description:
      "Klub mingguan membaca kontrak dan menelusuri alamat. Fokus proses, bukan sinyal beli.",
    category: "Riset",
    logo: "/blobi.png",
    requires: ["u6-cp"],
  },
];

/**
 * Validasi saat startup/test: setiap ID di `requires` harus ada di
 * `getLesson()`. Typo di sini membuat kartu MUSTAHIL dibuka (syarat yang tak
 * pernah bisa selesai) tanpa error apa pun — jadi divalidasi keras.
 */
export function assertDaoRequires(): void {
  const bad: string[] = [];
  for (const dao of DAOS) {
    if (dao.requires.length === 0) bad.push(`${dao.id}: requires kosong`);
    for (const lessonId of dao.requires) {
      if (!getLesson(lessonId)) bad.push(`${dao.id}: "${lessonId}" bukan lesson`);
    }
  }
  if (bad.length > 0) {
    throw new Error(`[dao] requires tidak valid:\n  ${bad.join("\n  ")}`);
  }
}

/** Env key untuk link undangan sebuah DAO. */
export function daoInviteEnvKey(id: string): string {
  return `DAO_INVITE_${id.toUpperCase().replace(/[^A-Z0-9]+/g, "_")}`;
}

/** Link undangan dari env — `null` kalau kosong atau formatnya tidak sah. */
export function daoInviteUrl(dao: Dao): string | null {
  const raw = process.env[daoInviteEnvKey(dao.id)]?.trim();
  return isValidDiscordInvite(raw) ? raw : null;
}

/**
 * Daftar untuk klien: TANPA link undangan, plus flag `available`
 * (true = env terisi & valid).
 */
export function listPublicDaos(): DaoPublic[] {
  return DAOS.map((dao) => ({
    id: dao.id,
    name: dao.name,
    tagline: dao.tagline,
    description: dao.description,
    category: dao.category,
    logo: dao.logo,
    requires: dao.requires,
    available: daoInviteUrl(dao) !== null,
  }));
}
