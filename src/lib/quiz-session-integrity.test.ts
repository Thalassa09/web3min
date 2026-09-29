import test from "node:test";
import assert from "node:assert/strict";
import {
  advance,
  createSession,
  isSessionComplete,
  markWrong,
  pruneSession,
  sanitizeSession,
} from "./quiz-ops.ts";

/**
 * Guard integritas sesi saat keluar dan masuk lagi (Fase 2 lanjutan).
 *
 * Kenapa ada: dua bug nyata pernah lolos ke build dan baru ketemu saat diuji di
 * browser.
 *
 * 1. Sanitasi sesi membuang id duplikat. Untuk `queue`, duplikat itu BUKAN
 *    sampah: soal yang salah memang muncul dua kali (aslinya + ulangan di
 *    akhir). Akibatnya, keluar aplikasi lalu masuk lagi menghapus janji
 *    "diulang sekali di akhir" tanpa pesan apa pun.
 * 2. Pemangkasan sesi wajib mempertahankan duplikat itu juga.
 *
 * Keduanya soal data, bukan tampilan, jadi tidak bisa dijaga guard gaya mana pun.
 */

const sessionWithRetry = () =>
  markWrong(createSession("u1-l1", ["a", "b"], [], 2, 1, 0), "a", 1).session;

test("antrean ulang SELAMAT saat sesi disanitasi ulang", () => {
  const session = sessionWithRetry();
  assert.deepEqual(session.queue, ["a", "b", "a"], "prasyarat: ulangan ada di akhir antrean");

  const roundTrip = sanitizeSession(JSON.parse(JSON.stringify(session)));
  assert.ok(roundTrip);
  assert.deepEqual(
    roundTrip.queue,
    ["a", "b", "a"],
    "duplikat di antrean adalah ulangan yang disengaja, bukan sampah",
  );
  assert.deepEqual(roundTrip.retried, ["a"], "penanda 'sudah diulang' tetap tersimpan");
  assert.deepEqual(roundTrip.heartSpent, ["a"], "penanda 'nyawa sudah terpakai' tetap tersimpan");
});

test("antrean ulang SELAMAT saat sesi dipangkas", () => {
  const session = sessionWithRetry();
  const pruned = pruneSession(session, new Set(["a", "b"]));
  assert.ok(pruned);
  assert.deepEqual(pruned.queue, ["a", "b", "a"], "pemangkasan tidak boleh menghapus ulangan");
});

test("daftar penanda tetap di-unik-kan (duplikat di sana memang sampah)", () => {
  const dirty = {
    v: 1,
    lessonId: "u1-l1",
    seed: 3,
    queue: ["a", "b"],
    index: 0,
    solved: ["a", "a", "a"],
    wrong: ["b", "b"],
    heartSpent: ["b", "b"],
    retried: ["b", "b"],
    total: 2,
  };
  const clean = sanitizeSession(dirty);
  assert.ok(clean);
  assert.deepEqual(clean.solved, ["a"]);
  assert.deepEqual(clean.wrong, ["b"]);
  assert.deepEqual(clean.heartSpent, ["b"]);
  assert.deepEqual(clean.retried, ["b"]);
});

test("sesi yang di-resume tetap tahu bahwa sesi itu sudah tuntas", () => {
  let session = createSession("u1-l1", ["a"], [], 1, 1, 0);
  session = markWrong(session, "a", 1).session;
  session = advance(session, 2);
  session = {
    ...session,
    solved: ["a"],
  };
  const resumed = sanitizeSession(JSON.parse(JSON.stringify(session)));
  assert.ok(resumed);
  assert.equal(isSessionComplete(resumed), true, "sesi tuntas tidak boleh diulang sebagai sesi baru");
});
