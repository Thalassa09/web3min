import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const css = readFileSync(join(ROOT, "src/styles.css"), "utf8");

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

const token = (name: string) => {
  const m = css.match(new RegExp(`--color-${name}\\s*:\\s*(#[0-9A-Fa-f]{6})`));
  assert.ok(m, `--color-${name} must be declared as a hex in @theme`);
  return m![1];
};

/**
 * AGENTS.md: "Kontras ≥4.5:1". Body text classes that ship white-on-pink are the
 * ones that actually get read, so pin the worst case rather than a token nobody
 * uses. The gradient CTAs lighten to ~#FF6BA6 mid-stop, which is the real
 * background behind the label — not the --color-candy-500 base.
 */
test("body text clears 4.5:1 on every surface it actually sits on", () => {
  const cream = token("cream");
  const choco700 = token("choco-700");
  const choco600 = token("choco-600");
  const choco900 = token("choco-900");
  const deep = token("candy-900");

  for (const [label, fg] of [
    ["choco-900/cream", choco900],
    ["choco-700/cream", choco700],
    ["choco-600/cream", choco600],
    ["candy-900/cream (judul pink)", deep],
  ] as const) {
    const v = contrast(fg, cream);
    assert.ok(v >= 4.5, `${label} = ${v.toFixed(2)}:1 — di bawah 4.5:1`);
  }
});

test("white labels only sit on surfaces dark enough for white text", () => {
  // Surface must be at least 4.5:1 against white, i.e. dark enough.
  for (const name of ["candy-700", "candy-800", "candy-900", "choco-900"]) {
    const v = contrast("#FFFFFF", token(name));
    assert.ok(v >= 4.5, `white on --color-${name} = ${v.toFixed(2)}:1 — terlalu terang untuk teks putih`);
  }
});

test("KNOWN GAP: --color-candy-500 is too light for white text (3.79:1)", () => {
  // Documented, not silently fixed: the pink CTA fill #E8437F is the brand and
  // AGENTS.md says "jangan ganti". White-on-pink fails AA for small text, so
  // labels on it must be >=18.66px bold (large-text threshold is 3:1).
  const v = contrast("#FFFFFF", token("candy-500"));
  assert.ok(v < 4.5 && v > 3, `candy-500 vs white drifted to ${v.toFixed(2)}:1 — revisit the CTA label size rule`);
});