import assert from "node:assert/strict";
import { UNITS } from "../src/lib/curriculum";
import { STORIES, CASES } from "../src/lib/stories";

console.log("[build:verify] Checking curriculum integrity...");

// 1. Verify Lesson IDs
const lessonIds: string[] = [];
for (const u of UNITS) {
  for (const l of u.lessons) {
    lessonIds.push(l.id);
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
  `[build:verify] ✓ Curriculum OK: ${lessonIds.length} lessons, ${storyIds.length} stories, ${caseIds.length} cases — all unique.`,
);
