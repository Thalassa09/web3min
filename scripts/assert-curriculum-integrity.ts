import assert from "node:assert/strict";
import { UNITS } from "../src/lib/curriculum";
import { STORIES, CASES } from "../src/lib/stories";

console.log("[build:verify] Checking curriculum integrity...");

// 1. Verify Lesson IDs
const lessonIds: string[] = [];
const exerciseIds = new Set<string>();
let totalExercises = 0;

for (const u of UNITS) {
  assert.ok(u.id && u.title, `Unit missing id or title: ${JSON.stringify(u)}`);
  for (const l of u.lessons) {
    lessonIds.push(l.id);
    assert.ok(l.title && l.exercises, `Lesson missing title or exercises: ${l.id}`);

    for (const ex of l.exercises) {
      totalExercises++;
      assert.ok(ex.id, `Exercise in lesson ${l.id} missing id`);
      assert.ok(
        !exerciseIds.has(ex.id),
        `Duplicate exercise id: "${ex.id}" found in lesson ${l.id}`,
      );
      exerciseIds.add(ex.id);

      if (ex.type === "choice" || ex.type === "blank") {
        assert.ok(
          Array.isArray(ex.options) && ex.options.length >= 2,
          `Exercise ${ex.id} must have at least 2 options`,
        );
        for (const opt of ex.options) {
          assert.ok(
            typeof opt === "string" && opt.trim().length > 0,
            `Exercise ${ex.id} contains empty option`,
          );
        }
        assert.ok(
          Number.isInteger(ex.answer) && ex.answer >= 0 && ex.answer < ex.options.length,
          `Exercise ${ex.id} answer index ${ex.answer} out of bounds (options len: ${ex.options.length})`,
        );
        // Presentation-Layer Shuffling Law: data files WAJIB menyimpan jawaban benar
        // di index 0; pengacakan terjadi saat render (ChoiceList + shuffle).
        // Kalau ini gagal, kunci jawaban tetap jalan di UI tapi kontrak authoring
        // rusak diam-diam dan audit bias jawaban jadi salah baca.
        assert.equal(
          ex.answer,
          0,
          `Exercise ${ex.id} answer must be index 0 (got ${ex.answer}) — see curriculum-quiz-ops.md §1`,
        );
      } else if (ex.type === "order") {
        assert.ok(
          Array.isArray(ex.pieces) && ex.pieces.length >= 2,
          `Order exercise ${ex.id} must have at least 2 pieces`,
        );
        assert.ok(
          Array.isArray(ex.answer) && ex.answer.length === ex.pieces.length,
          `Order exercise ${ex.id} answer length mismatch`,
        );
      } else if (ex.type === "match") {
        assert.ok(
          Array.isArray(ex.pairs) && ex.pairs.length >= 2,
          `Match exercise ${ex.id} must have at least 2 pairs`,
        );
        for (const p of ex.pairs) {
          assert.ok(
            p.left && p.right,
            `Match exercise ${ex.id} pair missing left or right side`,
          );
        }
      } else if (ex.type === "tf") {
        assert.equal(
          typeof ex.answer,
          "boolean",
          `TF exercise ${ex.id} answer must be boolean`,
        );
      } else if (ex.type === "tip") {
        assert.ok(
          ex.title && ex.title.trim().length > 0,
          `Tip exercise ${ex.id} title is empty`,
        );
        assert.ok(
          ex.body && ex.body.trim().length > 0,
          `Tip exercise ${ex.id} body is empty`,
        );
      }
    }
  }
}

const uniqueLessons = new Set(lessonIds);
assert.equal(
  uniqueLessons.size,
  lessonIds.length,
  `Duplicate lesson IDs found! Total: ${lessonIds.length}, Unique: ${uniqueLessons.size}`,
);

// 2. Verify Story IDs
const storyIds = STORIES.map((s) => s.id);
const uniqueStories = new Set(storyIds);
assert.equal(
  uniqueStories.size,
  storyIds.length,
  `Duplicate story IDs found! Total: ${storyIds.length}, Unique: ${uniqueStories.size}`,
);

// 3. Verify Case IDs
const caseIds = CASES.map((c) => c.id);
const uniqueCases = new Set(caseIds);
assert.equal(
  uniqueCases.size,
  caseIds.length,
  `Duplicate case IDs found! Total: ${caseIds.length}, Unique: ${uniqueCases.size}`,
);

// 4. Verify Unit Indices are 1..N contiguous
const unitIndices = UNITS.map((u) => u.index);
for (let i = 0; i < UNITS.length; i++) {
  assert.equal(
    unitIndices[i],
    i + 1,
    `Unit ${UNITS[i].id} index is ${unitIndices[i]}, expected ${i + 1}`,
  );
}

// 5. Guard kualitas kuis
// Latar: audit menemukan (a) TF bias 87% berjawaban "Salah" dengan unit 8-20
// nol soal "Benar", (b) jawaban benar 2,12x lebih panjang dari pengecoh sehingga
// strategi "pilih yang terpanjang" benar 77% (tebak buta 25%), (c) explanation
// stub 4 kata, (d) prompt duplikat. Semua sudah diperbaiki; guard ini mencegah
// regresi lewat suntingan konten berikutnya.
{
  let tfTrue = 0;
  let tfFalse = 0;
  const lengthTells: string[] = [];
  const stubs: string[] = [];
  const seenPrompts = new Map<string, string>();
  const dupPrompts: string[] = [];
  const FILLER = /^(semua benar|semua salah|tidak tahu|bukan keduanya|tidak ada)$/i;
  const fillerOpts: string[] = [];
  let blindTotal = 0;
  let blindHits = 0;

  for (const u of UNITS) {
    let unitTf = 0;
    let unitTfTrue = 0;
    for (const l of u.lessons) {
      for (const ex of l.exercises) {
        if (ex.type === "tf") {
          unitTf++;
          if (ex.answer === true) {
            tfTrue++;
            unitTfTrue++;
          } else {
            tfFalse++;
          }
          blindTotal++;
          if (ex.answer === false) blindHits++; // strategi: selalu tap "Salah"
        } else if (ex.type === "choice" || ex.type === "blank") {
          const lens = ex.options.map((o) => o.length);
          const correct = lens[ex.answer] ?? 0;
          const maxOther = Math.max(...lens.filter((_, i) => i !== ex.answer));
          if (!(ex.type === "blank" && correct <= 15) && correct > maxOther * 2.5) {
            lengthTells.push(`${u.id}/${ex.id}`);
          }
          blindTotal++;
          if (lens.indexOf(Math.max(...lens)) === ex.answer) blindHits++;
          for (const o of ex.options) {
            if (FILLER.test(o.trim())) fillerOpts.push(`${u.id}/${ex.id}: "${o}"`);
          }
        }

        if (ex.type !== "tip") {
          const expl = String((ex as { explanation?: string }).explanation ?? "").trim();
          if (!expl) stubs.push(`${u.id}/${ex.id} (kosong)`);
          else if (expl.split(/\s+/).filter(Boolean).length <= 4) stubs.push(`${u.id}/${ex.id} (<=4 kata)`);
        }

        const prompt = String((ex as { prompt?: string }).prompt ?? "").trim().toLowerCase().replace(/\s+/g, " ");
        if (prompt) {
          const prev = seenPrompts.get(prompt);
          if (prev) dupPrompts.push(`${prev} & ${u.id}/${ex.id}`);
          else seenPrompts.set(prompt, `${u.id}/${ex.id}`);
        }
      }
    }
    // unit dengan TF cukup banyak wajib punya minimal satu soal "Benar"
    if (unitTf >= 4 && unitTfTrue === 0) {
      assert.ok(false, `Unit ${u.id} punya ${unitTf} TF tapi nol berjawaban "Benar" — siswa bisa lolos dengan selalu tap "Salah"`);
    }
  }

  const tfRatio = tfTrue / Math.max(1, tfTrue + tfFalse);
  assert.ok(
    tfRatio >= 0.4 && tfRatio <= 0.6,
    `TF tidak seimbang: true=${tfTrue} false=${tfFalse} (${(tfRatio * 100).toFixed(1)}% true). Rasio harus 40-60%.`,
  );
  assert.deepEqual(lengthTells, [], `Jawaban benar >2,5x pengecoh terpanjang (siswa bisa menebak dari bentuk opsi): ${lengthTells.join(", ")}`);
  assert.deepEqual(stubs, [], `Explanation harus kalimat lengkap yang menjelaskan ALASAN, bukan stub: ${stubs.join(", ")}`);
  assert.deepEqual(dupPrompts, [], `Prompt duplikat persis: ${dupPrompts.join(" | ")}`);
  assert.deepEqual(fillerOpts, [], `Pengecoh filler tidak mengukur pemahaman: ${fillerOpts.join(", ")}`);
  const blindRatio = blindHits / Math.max(1, blindTotal);
  assert.ok(
    blindRatio <= 0.65,
    `Strategi buta (opsi terpanjang + selalu tap "Salah") menembus ${(blindRatio * 100).toFixed(1)}% (${blindHits}/${blindTotal}), batas 65%`,
  );

  console.log(
    `[build:verify] ✓ Quiz quality OK: TF ${(tfRatio * 100).toFixed(1)}% true (${tfTrue}/${tfTrue + tfFalse}), ` +
      `blind-strategy ${(blindRatio * 100).toFixed(1)}% (batas 65%), 0 length-tell ekstrem, 0 explanation stub, 0 prompt duplikat.`,
  );
}

console.log(
  `[build:verify] ✓ Curriculum OK: ${UNITS.length} units (contiguous indices 1..${UNITS.length}), ${lessonIds.length} lessons (${totalExercises} exercises verified for unique IDs & answer bounds), ${storyIds.length} stories, ${caseIds.length} cases — all unique.`,
);
