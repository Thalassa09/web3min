import { UNITS, allPathNodes, getLesson, type Exercise, type Lesson } from "../src/lib/curriculum";
import { PROOFS } from "../src/lib/proof";

interface Bug {
  unitId: string;
  lessonId: string;
  lessonTitle: string;
  exerciseId: string;
  exerciseType: string;
  severity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  issue: string;
  detail: any;
}

const bugs: Bug[] = [];
const allLessons = allPathNodes();
const proofKeys = new Set(PROOFS.map((p) => p.id));
const exerciseIdMap = new Map<string, string>();

console.log(`Auditing ${UNITS.length} units and ${allLessons.length} lessons...`);

let totalExercises = 0;
const typeCounts: Record<string, number> = {};

for (const unit of UNITS) {
  for (const lesson of unit.lessons) {
    if (!lesson.exercises || lesson.exercises.length === 0) {
      if (lesson.kind !== "chest") {
        bugs.push({
          unitId: unit.id,
          lessonId: lesson.id,
          lessonTitle: lesson.title,
          exerciseId: "none",
          exerciseType: "none",
          severity: "CRITICAL",
          issue: "Lesson has no exercises",
          detail: { kind: lesson.kind },
        });
      }
      continue;
    }

    let scoredCount = 0;

    for (let eIdx = 0; eIdx < lesson.exercises.length; eIdx++) {
      const ex = lesson.exercises[eIdx];
      totalExercises++;
      typeCounts[ex.type] = (typeCounts[ex.type] || 0) + 1;

      // Check duplicate ID
      if (exerciseIdMap.has(ex.id)) {
        bugs.push({
          unitId: unit.id,
          lessonId: lesson.id,
          lessonTitle: lesson.title,
          exerciseId: ex.id,
          exerciseType: ex.type,
          severity: "MEDIUM",
          issue: `Duplicate exercise ID (also in ${exerciseIdMap.get(ex.id)})`,
          detail: { firstSeenIn: exerciseIdMap.get(ex.id) },
        });
      } else {
        exerciseIdMap.set(ex.id, `${unit.id}/${lesson.id}`);
      }

      // Check proofs
      if (ex.proofs && Array.isArray(ex.proofs)) {
        for (const pid of ex.proofs) {
          if (!proofKeys.has(pid)) {
            bugs.push({
              unitId: unit.id,
              lessonId: lesson.id,
              lessonTitle: lesson.title,
              exerciseId: ex.id,
              exerciseType: ex.type,
              severity: "HIGH",
              issue: `Missing proof image reference: "${pid}"`,
              detail: { pid },
            });
          }
        }
      }

      if (ex.type !== "tip") {
        scoredCount++;
      }

      // 1. Choice Exercise
      if (ex.type === "choice") {
        if (!ex.prompt || ex.prompt.trim() === "") {
          bugs.push({
            unitId: unit.id,
            lessonId: lesson.id,
            lessonTitle: lesson.title,
            exerciseId: ex.id,
            exerciseType: ex.type,
            severity: "CRITICAL",
            issue: "Empty prompt in choice exercise",
            detail: {},
          });
        }
        if (!Array.isArray(ex.options) || ex.options.length < 2) {
          bugs.push({
            unitId: unit.id,
            lessonId: lesson.id,
            lessonTitle: lesson.title,
            exerciseId: ex.id,
            exerciseType: ex.type,
            severity: "CRITICAL",
            issue: "Choice exercise has less than 2 options",
            detail: { options: ex.options },
          });
        } else {
          // Check answer bounds
          if (typeof ex.answer !== "number" || ex.answer < 0 || ex.answer >= ex.options.length) {
            bugs.push({
              unitId: unit.id,
              lessonId: lesson.id,
              lessonTitle: lesson.title,
              exerciseId: ex.id,
              exerciseType: ex.type,
              severity: "CRITICAL",
              issue: `Choice answer index ${ex.answer} out of bounds (options length: ${ex.options.length})`,
              detail: { answer: ex.answer, optionsLength: ex.options.length, options: ex.options },
            });
          }
          // Check duplicate options
          const optSet = new Set<string>();
          for (const opt of ex.options) {
            if (optSet.has(opt.trim().toLowerCase())) {
              bugs.push({
                unitId: unit.id,
                lessonId: lesson.id,
                lessonTitle: lesson.title,
                exerciseId: ex.id,
                exerciseType: ex.type,
                severity: "HIGH",
                issue: `Duplicate option in choice: "${opt}"`,
                detail: { options: ex.options },
              });
            }
            optSet.add(opt.trim().toLowerCase());
          }
        }
        if (!ex.explanation || ex.explanation.trim() === "") {
          bugs.push({
            unitId: unit.id,
            lessonId: lesson.id,
            lessonTitle: lesson.title,
            exerciseId: ex.id,
            exerciseType: ex.type,
            severity: "LOW",
            issue: "Empty explanation in choice exercise",
            detail: {},
          });
        }
      }

      // 2. Blank Exercise
      else if (ex.type === "blank") {
        if (!ex.prompt || ex.prompt.trim() === "") {
          bugs.push({
            unitId: unit.id,
            lessonId: lesson.id,
            lessonTitle: lesson.title,
            exerciseId: ex.id,
            exerciseType: ex.type,
            severity: "CRITICAL",
            issue: "Empty prompt in blank exercise",
            detail: {},
          });
        } else if (!ex.prompt.includes("___")) {
          bugs.push({
            unitId: unit.id,
            lessonId: lesson.id,
            lessonTitle: lesson.title,
            exerciseId: ex.id,
            exerciseType: ex.type,
            severity: "HIGH",
            issue: 'Blank exercise prompt does not contain "___" blank marker',
            detail: { prompt: ex.prompt },
          });
        }
        if (!Array.isArray(ex.options) || ex.options.length < 2) {
          bugs.push({
            unitId: unit.id,
            lessonId: lesson.id,
            lessonTitle: lesson.title,
            exerciseId: ex.id,
            exerciseType: ex.type,
            severity: "CRITICAL",
            issue: "Blank exercise has less than 2 options",
            detail: { options: ex.options },
          });
        } else {
          if (typeof ex.answer !== "number" || ex.answer < 0 || ex.answer >= ex.options.length) {
            bugs.push({
              unitId: unit.id,
              lessonId: lesson.id,
              lessonTitle: lesson.title,
              exerciseId: ex.id,
              exerciseType: ex.type,
              severity: "CRITICAL",
              issue: `Blank answer index ${ex.answer} out of bounds (options length: ${ex.options.length})`,
              detail: { answer: ex.answer, optionsLength: ex.options.length, options: ex.options },
            });
          }
          const optSet = new Set<string>();
          for (const opt of ex.options) {
            if (optSet.has(opt.trim().toLowerCase())) {
              bugs.push({
                unitId: unit.id,
                lessonId: lesson.id,
                lessonTitle: lesson.title,
                exerciseId: ex.id,
                exerciseType: ex.type,
                severity: "HIGH",
                issue: `Duplicate option in blank: "${opt}"`,
                detail: { options: ex.options },
              });
            }
            optSet.add(opt.trim().toLowerCase());
          }
        }
      }

      // 3. True/False Exercise
      else if (ex.type === "tf") {
        if (!ex.prompt || ex.prompt.trim() === "") {
          bugs.push({
            unitId: unit.id,
            lessonId: lesson.id,
            lessonTitle: lesson.title,
            exerciseId: ex.id,
            exerciseType: ex.type,
            severity: "CRITICAL",
            issue: "Empty prompt in true/false exercise",
            detail: {},
          });
        }
        if (typeof ex.answer !== "boolean") {
          bugs.push({
            unitId: unit.id,
            lessonId: lesson.id,
            lessonTitle: lesson.title,
            exerciseId: ex.id,
            exerciseType: ex.type,
            severity: "CRITICAL",
            issue: `TF answer is not a boolean: ${typeof ex.answer} (${ex.answer})`,
            detail: { answer: ex.answer },
          });
        }
        if (!ex.explanation || ex.explanation.trim() === "") {
          bugs.push({
            unitId: unit.id,
            lessonId: lesson.id,
            lessonTitle: lesson.title,
            exerciseId: ex.id,
            exerciseType: ex.type,
            severity: "LOW",
            issue: "Empty explanation in true/false exercise",
            detail: {},
          });
        }
      }

      // 4. Match Exercise
      else if (ex.type === "match") {
        if (!ex.prompt || ex.prompt.trim() === "") {
          bugs.push({
            unitId: unit.id,
            lessonId: lesson.id,
            lessonTitle: lesson.title,
            exerciseId: ex.id,
            exerciseType: ex.type,
            severity: "HIGH",
            issue: "Empty prompt in match exercise",
            detail: {},
          });
        }
        if (!Array.isArray(ex.pairs) || ex.pairs.length < 2) {
          bugs.push({
            unitId: unit.id,
            lessonId: lesson.id,
            lessonTitle: lesson.title,
            exerciseId: ex.id,
            exerciseType: ex.type,
            severity: "CRITICAL",
            issue: "Match exercise has less than 2 pairs",
            detail: { pairs: ex.pairs },
          });
        } else {
          const leftSet = new Set<string>();
          const rightSet = new Set<string>();
          for (const p of ex.pairs) {
            if (!p.left || !p.right) {
              bugs.push({
                unitId: unit.id,
                lessonId: lesson.id,
                lessonTitle: lesson.title,
                exerciseId: ex.id,
                exerciseType: ex.type,
                severity: "CRITICAL",
                issue: "Match pair has empty left or right value",
                detail: { pair: p },
              });
            }
            if (leftSet.has(p.left.trim().toLowerCase())) {
              bugs.push({
                unitId: unit.id,
                lessonId: lesson.id,
                lessonTitle: lesson.title,
                exerciseId: ex.id,
                exerciseType: ex.type,
                severity: "HIGH",
                issue: `Duplicate left item in match: "${p.left}"`,
                detail: { pairs: ex.pairs },
              });
            }
            if (rightSet.has(p.right.trim().toLowerCase())) {
              bugs.push({
                unitId: unit.id,
                lessonId: lesson.id,
                lessonTitle: lesson.title,
                exerciseId: ex.id,
                exerciseType: ex.type,
                severity: "HIGH",
                issue: `Duplicate right item in match: "${p.right}"`,
                detail: { pairs: ex.pairs },
              });
            }
            leftSet.add(p.left.trim().toLowerCase());
            rightSet.add(p.right.trim().toLowerCase());
          }
        }
      }

      // 5. Order Exercise
      else if (ex.type === "order") {
        if (!ex.prompt || ex.prompt.trim() === "") {
          bugs.push({
            unitId: unit.id,
            lessonId: lesson.id,
            lessonTitle: lesson.title,
            exerciseId: ex.id,
            exerciseType: ex.type,
            severity: "HIGH",
            issue: "Empty prompt in order exercise",
            detail: {},
          });
        }
        if (!Array.isArray(ex.pieces) || !Array.isArray(ex.answer)) {
          bugs.push({
            unitId: unit.id,
            lessonId: lesson.id,
            lessonTitle: lesson.title,
            exerciseId: ex.id,
            exerciseType: ex.type,
            severity: "CRITICAL",
            issue: "Order pieces or answer is not an array",
            detail: { pieces: ex.pieces, answer: ex.answer },
          });
        } else {
          if (ex.pieces.length !== ex.answer.length) {
            bugs.push({
              unitId: unit.id,
              lessonId: lesson.id,
              lessonTitle: lesson.title,
              exerciseId: ex.id,
              exerciseType: ex.type,
              severity: "CRITICAL",
              issue: `Order pieces count (${ex.pieces.length}) does not match answer count (${ex.answer.length})`,
              detail: { pieces: ex.pieces, answer: ex.answer },
            });
          } else {
            // Check multiset equality
            const pSorted = [...ex.pieces].sort();
            const aSorted = [...ex.answer].sort();
            const mismatch = pSorted.some((v, i) => v !== aSorted[i]);
            if (mismatch) {
              bugs.push({
                unitId: unit.id,
                lessonId: lesson.id,
                lessonTitle: lesson.title,
                exerciseId: ex.id,
                exerciseType: ex.type,
                severity: "CRITICAL",
                issue: "Order pieces cannot form the answer (mismatched words/tokens) - IMPOSSIBLE TO SOLVE",
                detail: { pieces: ex.pieces, answer: ex.answer, pSorted, aSorted },
              });
            }
          }
        }
      }

      // 6. Tip Exercise
      else if (ex.type === "tip") {
        if (!ex.title || ex.title.trim() === "") {
          bugs.push({
            unitId: unit.id,
            lessonId: lesson.id,
            lessonTitle: lesson.title,
            exerciseId: ex.id,
            exerciseType: ex.type,
            severity: "HIGH",
            issue: "Empty title in tip exercise",
            detail: {},
          });
        }
        if (!ex.body || ex.body.trim() === "") {
          bugs.push({
            unitId: unit.id,
            lessonId: lesson.id,
            lessonTitle: lesson.title,
            exerciseId: ex.id,
            exerciseType: ex.type,
            severity: "HIGH",
            issue: "Empty body in tip exercise",
            detail: {},
          });
        }
      }
    }

    if (lesson.kind !== "chest" && scoredCount === 0) {
      bugs.push({
        unitId: unit.id,
        lessonId: lesson.id,
        lessonTitle: lesson.title,
        exerciseId: "none",
        exerciseType: "none",
        severity: "HIGH",
        issue: "Lesson has 0 scored exercises (only tips)",
        detail: {},
      });
    }
  }
}

console.log("\n=== AUDIT SUMMARY ===");
console.log(`Total Exercises Audited: ${totalExercises}`);
console.log("By Type:", typeCounts);
console.log(`Total Issues/Bugs Found: ${bugs.length}\n`);

if (bugs.length === 0) {
  console.log("No structural bugs found across all exercises!");
} else {
  const critical = bugs.filter((b) => b.severity === "CRITICAL");
  const high = bugs.filter((b) => b.severity === "HIGH");
  const medium = bugs.filter((b) => b.severity === "MEDIUM");
  const low = bugs.filter((b) => b.severity === "LOW");

  console.log(`CRITICAL: ${critical.length}`);
  console.log(`HIGH:     ${high.length}`);
  console.log(`MEDIUM:   ${medium.length}`);
  console.log(`LOW:      ${low.length}\n`);

  for (const b of bugs) {
    console.log(`[${b.severity}] ${b.unitId} -> ${b.lessonId} (${b.exerciseType}#${b.exerciseId}): ${b.issue}`);
    if (Object.keys(b.detail).length > 0) {
      console.log("   Detail:", JSON.stringify(b.detail));
    }
  }
}
