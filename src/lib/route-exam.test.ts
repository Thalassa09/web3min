import test from "node:test";
import assert from "node:assert/strict";
import {
  ROUTE_EXAM_SIZE,
  buildRouteExamLesson,
  examPool,
  isRouteExamId,
  routeExamId,
  unitIdOfRouteExam,
} from "./route-exam.ts";

/**
 * Guard Ujian Rute (Fase 3).
 *
 * Kenapa ada: Ujian Rute menyentuh dua hal yang gampang salah diam-diam.
 * Pertama, ia TIDAK BOLEH memberi hadiah: XP dan koin wajib nol, karena aturan
 * ekonomi tidak boleh berubah. Kedua, ia harus benar-benar mengambil soal dari
 * bank rute itu, bukan dari rute lain, dan tanpa kartu materi.
 */

import type { Exercise } from "./curriculum.ts";

const ex = (id: string, type: "choice" | "tip" = "choice"): Exercise =>
  type === "tip"
    ? { type: "tip", id, title: id, body: "b" }
    : { type: "choice", id, prompt: id, options: ["a", "b"], answer: 0, explanation: "e" };
const lesson = (id: string, kind: string, exercises: { id: string; type: string }[]) => ({
  id,
  unitId: "u3",
  kind,
  title: id,
  blurb: "",
  icon: "flag",
  xp: 12,
  gems: 2,
  exercises,
});
const unit = (lessons: unknown[]) => ({ id: "u3", index: 3, title: "Bitcoin, ETH & koin", lessons });

test("id ujian rute bisa dikenali dan dibalik lagi ke unitnya", () => {
  const id = routeExamId("u3");
  assert.equal(id, "exam:u3");
  assert.equal(isRouteExamId(id), true);
  assert.equal(unitIdOfRouteExam(id), "u3");
  assert.equal(isRouteExamId("u3-l1"), false, "blok biasa bukan ujian rute");
  assert.equal(unitIdOfRouteExam("u3-l1"), null);
});

test("pool ujian membuang kartu materi dan soal duplikat", () => {
  const pool = examPool([
    [ex("a"), ex("t1", "tip")],
    [ex("a"), ex("b"), ex("t2", "tip")],
  ]);
  assert.deepEqual(pool.map((x) => x.id), ["a", "b"], "tip dibuang, duplikat dibuang");
});

test("ujian rute TIDAK memberi XP atau koin", () => {
  const u = unit([
    lesson("u3-l1", "lesson", Array.from({ length: 12 }, (_, i) => ex(`q${i}`))),
    lesson("u3-chest", "chest", []),
  ]);
  const exam = buildRouteExamLesson(u as never, 42);
  assert.ok(exam);
  assert.equal(exam.xp, 0, "ujian rute tidak boleh memberi XP");
  assert.equal(exam.gems, 0, "ujian rute tidak boleh memberi koin");
  assert.equal(exam.kind, "lesson", "bukan checkpoint, supaya tidak menyentuh progresi rute");
});

test("ujian rute mengambil soal dari bank rute itu, tanpa kartu materi", () => {
  const u = unit([
    lesson("u3-l1", "lesson", [...Array.from({ length: 12 }, (_, i) => ex(`q${i}`)), ex("t", "tip")]),
    lesson("u3-l2", "lesson", Array.from({ length: 12 }, (_, i) => ex(`r${i}`))),
    lesson("u3-chest", "chest", []),
  ]);
  const exam = buildRouteExamLesson(u as never, 7);
  assert.ok(exam);
  assert.equal(exam.exercises.length, ROUTE_EXAM_SIZE, "ujian memakai 15 soal");
  assert.ok(!exam.exercises.some((e) => e.type === "tip"), "tidak ada kartu materi di ujian");
  assert.ok(
    exam.exercises.every((e) => e.id.startsWith("q") || e.id.startsWith("r")),
    "semua soal berasal dari bank rute tersebut",
  );
  assert.equal(new Set(exam.exercises.map((e) => e.id)).size, exam.exercises.length, "tidak ada soal dobel");
});

test("bank rute lebih kecil dari 15: seluruh bank dipakai", () => {
  const u = unit([lesson("u3-l1", "lesson", Array.from({ length: 9 }, (_, i) => ex(`q${i}`)))]);
  const exam = buildRouteExamLesson(u as never, 5);
  assert.ok(exam);
  assert.equal(exam.exercises.length, 9, "tidak ada soal yang hilang saat bank kurang dari 15");
});

test("rute tanpa soal sama sekali tidak menghasilkan ujian", () => {
  const u = unit([lesson("u3-chest", "chest", [])]);
  assert.equal(buildRouteExamLesson(u as never, 1), null);
});
