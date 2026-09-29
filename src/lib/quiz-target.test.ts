import test from "node:test";
import assert from "node:assert/strict";
import {
  LESSON_TARGET_EARLY,
  LESSON_TARGET_LATE,
  lessonTarget,
} from "./quiz-ops.ts";

/**
 * Guard sasaran jumlah soal per rute (Fase 3).
 *
 * Kenapa ada: brief memisahkan dua janji yang gampang tertukar saat menyunting
 * konten nanti — Rute 1-2 harus TETAP PENDEK (5-6 soal), sedangkan Rute 3 ke atas
 * boleh lebih dalam (8 soal). Kalau angka ini disatukan lagi, salah satu janji
 * pasti rusak diam-diam.
 */

test("Rute 1-2 tetap pendek: 6 soal per blok", () => {
  assert.equal(LESSON_TARGET_EARLY, 6);
  assert.equal(lessonTarget(1, "lesson"), 6);
  assert.equal(lessonTarget(2, "lesson"), 6);
});

test("Rute 3 ke atas: 8 soal per blok", () => {
  assert.equal(LESSON_TARGET_LATE, 8);
  assert.equal(lessonTarget(3, "lesson"), 8);
  assert.equal(lessonTarget(20, "lesson"), 8);
});

test("ujian rute bawaan memakai seluruh banknya, bukan dipotong sasaran", () => {
  const cp = lessonTarget(3, "checkpoint");
  assert.ok(cp > 100, "checkpoint harus memakai seluruh bank soal rutenya");
});

test("sasaran hanya berlaku untuk blok, bukan PETI", () => {
  // PETI tidak punya soal sama sekali; fungsi ini tetap harus menjawab angka
  // yang aman kalau suatu saat dipanggil untuk kind itu.
  assert.equal(lessonTarget(3, "chest"), LESSON_TARGET_LATE);
});
