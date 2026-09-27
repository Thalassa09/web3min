/**
 * GET /api/dao/list
 *
 * Daftar DAO publik untuk halaman `/dao`: nama, deskripsi, syarat kuis, dan
 * flag `available` (env undangan terisi). Link undangan TIDAK pernah ikut —
 * itu hanya keluar lewat `/api/dao/claim` setelah login + syarat terpenuhi.
 *
 * `allowedHosts` ikut dikirim karena teks peringatan modal di klien menyebut
 * host undangan yang sah. Dengan begitu host itu SATU SUMBER dengan regex
 * validasi server, dan bundle klien tidak memuat literal domain itu sendiri.
 *
 * Tanpa auth: daftar ini sama untuk semua orang dan tidak memuat rahasia.
 */
import { defineEventHandler } from "h3";
import { assertDaoRequires, listPublicDaos } from "../../../src/server/daos.server";
import { DISCORD_INVITE_HOSTS } from "../../../src/lib/dao-url";

export default defineEventHandler(() => {
  try {
    assertDaoRequires();
    return {
      ok: true,
      daos: listPublicDaos(),
      allowedHosts: [...DISCORD_INVITE_HOSTS],
    };
  } catch (err) {
    console.error("[dao/list] gagal:", err);
    return { ok: false, daos: [], allowedHosts: [], error: "Data DAO tidak valid di server." };
  }
});
