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

console.log(
  `[build:verify] ✓ Curriculum OK: ${lessonIds.length} lessons (${totalExercises} exercises verified for unique IDs & answer bounds), ${storyIds.length} stories, ${caseIds.length} cases — all unique.`,
);
