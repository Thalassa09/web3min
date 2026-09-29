import test from "node:test";
import assert from "node:assert/strict";
import { resolveAccountNudge, type AccountNudgeInput } from "./account-nudge.ts";

const base: AccountNudgeInput = {
  eligible: true,
  online: true,
  configured: true,
  hasSession: false,
  hasRecoveryEmail: false,
};

test("tidak eligible: tidak pernah menampilkan ajakan", () => {
  assert.equal(resolveAccountNudge({ ...base, eligible: false }), "none");
  assert.equal(resolveAccountNudge({ ...base, eligible: false, hasSession: true }), "none");
});

test("offline atau server tidak dikonfigurasi: dilewati, bukan ditebak", () => {
  assert.equal(resolveAccountNudge({ ...base, online: false }), "none");
  assert.equal(resolveAccountNudge({ ...base, configured: false }), "none");
  // Sudah ada sesi pun, saat offline tetap dilewati (bisa tampil lain kali).
  assert.equal(resolveAccountNudge({ ...base, online: false, hasSession: true }), "none");
});

test("belum ada sesi: ajak masuk", () => {
  assert.equal(resolveAccountNudge(base), "signin");
});

test("sudah ada sesi tapi email pemulihan kosong: ajak pasang", () => {
  assert.equal(resolveAccountNudge({ ...base, hasSession: true }), "email");
});

test("sudah ada sesi dan email pemulihan: tidak ada ajakan", () => {
  assert.equal(resolveAccountNudge({ ...base, hasSession: true, hasRecoveryEmail: true }), "none");
});
