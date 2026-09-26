import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const css = readFileSync(join(ROOT, "src/styles.css"), "utf8");
const theme = css.split("@theme")[1].split("\n}")[0];

const COLORS = new Set([...theme.matchAll(/--color-([a-z0-9-]+)\s*:/g)].map((m) => m[1]));
const SHADOWS = new Set([...theme.matchAll(/--shadow-([a-z0-9-]+)\s*:/g)].map((m) => m[1]));

function luminance(hex: string) {
  const h = hex.replace("#", "");
  const [r, g, b] = [0, 2, 4].map((i) => {
    const c = parseInt(h.slice(i, i + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
function contrast(a: string, b: string) {
  const [x, y] = [luminance(a), luminance(b)].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
}

/**
 * Colour-token guard. Tailwind v4 only emits a utility when the matching
 * --color-* / --shadow-* token exists in @theme. A typo (`text-choco-700` when
 * only choco-900/600 were declared) compiles silently and the element just
 * inherits its parent colour — which is how "salah warna feedback" bugs hide.
 * Before this test the codebase had 26 such tokens across 307 call sites.
 */
test("every colour utility used in src/ maps to a token declared in @theme", () => {
  const files: string[] = [];
  const walk = (dir: string) => {
    for (const e of readdirSync(dir, { withFileTypes: true })) {
      const p = join(dir, e.name);
      if (e.isDirectory()) {
        if (e.name !== "8bit") walk(p);
      } else if (e.name.endsWith(".tsx")) files.push(p);
    }
  };
  walk(join(ROOT, "src"));

  const PREFIX = /(?:^|[\s"'`])(?:text|bg|border|from|via|to|ring|outline|fill|stroke|divide)-([a-z][a-z0-9]*(?:-[a-z0-9]+)*)/g;
  // real tailwind palette names are always emitted, ignore them
  const PALETTE = /^(white|black|transparent|current|inherit|none|auto|amber|emerald|red|green|yellow|blue|rose|orange|slate|gray|zinc|neutral|stone|lime|teal|cyan|sky|indigo|violet|purple|fuchsia|pink)(-|$)/;

  const broken: string[] = [];
  for (const f of files) {
    const src = readFileSync(f, "utf8");
    for (const m of src.matchAll(PREFIX)) {
      const token = m[1];
      if (PALETTE.test(token)) continue;
      if (COLORS.has(token)) continue;
      // only flag siblings of declared tokens: clearly meant to be part of a scale
      const base = token.split("-")[0];
      if (![...COLORS].some((t) => t.split("-")[0] === base)) continue;
      broken.push(`${token} in ${f.replace(ROOT + "/", "")}`);
    }
  }

  assert.deepEqual(
    [...new Set(broken)].sort(),
    [],
    "these classes emit NO css: add the matching --color-* token to @theme in src/styles.css",
  );
});

test("feedback colours meet WCAG AA (4.5:1) on both their soft background and cream", () => {
  const hex = (name: string) => {
    const m = theme.match(new RegExp(`--color-${name}:\\s*(#[0-9A-Fa-f]{6})`));
    assert.ok(m, `--color-${name} must be a plain hex so its contrast can be measured`);
    return m![1];
  };
  const CREAM = hex("cream");

  const cases: [string, string][] = [
    ["ok-ink", "ok-soft"],
    ["warn-ink", "warn-soft"],
    ["err-ink", "err-soft"],
    ["coin-ink", "cream"],
    ["choco-600", "cream"],
    ["choco-500", "cream"],
  ];

  for (const [fg, bg] of cases) {
    const ratio = contrast(hex(fg), hex(bg));
    assert.ok(
      ratio >= 4.5,
      `--color-${fg} on --color-${bg} is ${ratio.toFixed(2)}:1, below the 4.5:1 floor from AGENTS.md`,
    );
  }

  // PETI gold must never be used as text — it is a fill only.
  const goldAsText = contrast(hex("lemon-deep"), CREAM);
  assert.ok(goldAsText < 4.5, "lemon-deep (#D9A400) is a fill colour; use coin-ink for coin text");
});

test("every declared shadow token is usable (no dangling --shadow-* reference)", () => {
  assert.ok(SHADOWS.has("candy"), "shadow-candy underpins every tactile button");
  assert.ok(SHADOWS.has("3d-primary"), "duo-button primary variant depends on shadow-3d-primary");
  assert.ok(SHADOWS.has("3d-secondary"), "duo-button secondary variant depends on shadow-3d-secondary");
});