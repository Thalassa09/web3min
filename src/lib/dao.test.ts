import test from "node:test";
import assert from "node:assert/strict";
import { checkDaoAccess, firstMissingId } from "./dao-core.ts";
import { DISCORD_INVITE_HOSTS, DISCORD_INVITE_RE, isValidDiscordInvite } from "./dao-url.ts";

/**
 * Guard fitur DAO: fungsi cek akses + validator URL undangan.
 *
 * Sengaja HANYA menguji dua modul murni ini (tanpa alias `@/`, tanpa env):
 * `node --test` polos tidak me-resolve alias, dan logika inilah yang paling
 * mudah rusak diam-diam — gate yang salah hitung = kartu terbuka tanpa kuis,
 * atau sebaliknya kartu yang sah jadi mustahil dibuka.
 */

test("checkDaoAccess: unlocked saat semua kuis selesai", () => {
  const res = checkDaoAccess(["u2-cp"], ["u2-cp", "u1-l1"]);
  assert.equal(res.unlocked, true);
  assert.deepEqual(res.done, ["u2-cp"]);
  assert.deepEqual(res.missing, []);
});

test("checkDaoAccess: done & missing dipisah, urut sesuai requires", () => {
  const res = checkDaoAccess(["u2-cp", "u6-cp"], ["u6-cp"]);
  assert.equal(res.unlocked, false);
  assert.deepEqual(res.done, ["u6-cp"]);
  assert.deepEqual(res.missing, ["u2-cp"]);
});

test("checkDaoAccess: requires kosong = langsung terbuka", () => {
  const res = checkDaoAccess([], []);
  assert.equal(res.unlocked, true);
  assert.deepEqual(res.missing, []);
});

test("firstMissingId menunjuk kuis pertama yang belum selesai", () => {
  assert.equal(firstMissingId(["u2-cp", "u6-cp"], []), "u2-cp");
  assert.equal(firstMissingId(["u2-cp", "u6-cp"], ["u2-cp"]), "u6-cp");
  assert.equal(firstMissingId(["u2-cp"], ["u2-cp"]), null);
});

test("validator URL: menerima undangan Discord yang sah", () => {
  for (const url of [
    "https://discord.gg/abc123",
    "https://discord.gg/web3min",
    "https://discord.com/invite/AbC-123",
  ]) {
    assert.equal(isValidDiscordInvite(url), true, `harus valid: ${url}`);
  }
});

test("validator URL: menolak http, domain lain, sub-path, query, dan kode kosong", () => {
  for (const url of [
    "http://discord.gg/abc123", // bukan https
    "https://discord.gg/", // tanpa kode
    "https://discord.gg", // tanpa path
    "https://evil.com/invite/abc", // domain lain
    "https://discord.gg.evil.com/abc", // domain disamarkan
    "https://discord.com/invite/abc/extra", // sub-path
    "https://discord.com/invite/abc?x=1", // query
    "https://discord.com/channels/123", // path Discord lain
    "javascript:alert(1)",
    "",
    undefined,
    null,
    42,
  ]) {
    assert.equal(isValidDiscordInvite(url), false, `harus ditolak: ${String(url)}`);
  }
});

test("daftar host modal konsisten dengan regex validasi (satu sumber)", () => {
  // Teks modal klien memakai DISCORD_INVITE_HOSTS; kalau host baru ditambah ke
  // regex tanpa ikut ke daftar (atau sebaliknya), peringatannya jadi bohong.
  for (const host of DISCORD_INVITE_HOSTS) {
    const contoh =
      host === "discord.com/invite" ? `https://${host}/abc` : `https://${host}/abc`;
    assert.match(contoh, DISCORD_INVITE_RE, `host "${host}" tidak cocok dengan regex`);
  }
});
