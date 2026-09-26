import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const read = (p: string) => readFileSync(join(ROOT, p), "utf8");

/**
 * Font budget guard. The AGENTS.md rule is "font maksimal 3" and the site now
 * ships 2 (mode Retro Pixel dihapus). The families are requested in two places
 * (the root <link> and the CSS @theme triad); when they drift apart you silently
 * ship downloads nobody asked for. This pins both.
 */
test("at most 2 font families are requested and every declared family is used", () => {
  const root = read("src/routes/__root.tsx");
  const request = root.match(/fonts\.googleapis\.com\/css2\?([^"]+)/)?.[1];
  assert.ok(request, "root must request fonts from Google Fonts css2");

  const families = [...request.matchAll(/family=([^&:]+)/g)].map((m) => decodeURIComponent(m[1]).replace(/\+/g, " "));
  assert.ok(families.length <= 2, `font budget is 2, request declares ${families.length}: ${families.join(", ")}`);

  // Dropped families must not creep back anywhere above the @theme block.
  const css = read("src/styles.css");
  for (const dead of ["JetBrains Mono", "Silkscreen", "Press Start 2P", "Nunito"]) {
    assert.ok(!css.includes(dead), `${dead} was removed from the budget — delete it from styles.css too`);
  }

  // Pixelify Sans left with the Retro Pixel mode toggle. No token may request it.
  assert.ok(
    !css.includes('"Pixelify Sans"'),
    'Pixelify Sans was removed with the Retro Pixel mode — no --font-* token may request it',
  );
  assert.ok(
    !request.includes("Pixelify"),
    "the root font <link> must not request Pixelify Sans",
  );

  // Every requested family must be reachable from a --font-* token, otherwise
  // we pay for a download that nothing renders with.
  for (const f of families) {
    assert.ok(css.includes(`"${f}"`), `${f} is requested but no --font-* token references it`);
  }
});

test("no CSS @import of a font stylesheet — the root <link> is the single source", () => {
  const css = read("src/styles.css");
  assert.ok(
    !/@import\s+url\(\s*["']https:\/\/fonts\./.test(css),
    "styles.css must not @import Google Fonts; that blocks render behind a second request",
  );
});

test("body copy is 16px — html/body must not shrink the default", () => {
  const css = read("src/styles.css");
  const blocks = [...css.matchAll(/(?:^|\n)(html[^{]*|body[^{]*)\{([^}]*)\}/g)];
  assert.ok(blocks.length > 0, "expected an html/body rule in styles.css");

  for (const [, selector, body] of blocks) {
    const size = body.match(/font-size:\s*([^;]+);/)?.[1]?.trim();
    if (size === undefined) continue; // no override → browser default 16px stands
    assert.ok(
      ["16px", "1rem"].includes(size),
      `${selector.trim()} sets font-size: ${size}. AGENTS.md pins body type at 16px`,
    );
  }
});

test("mode Retro Pixel dihapus — tidak ada sisa toggle atau atribut pixel-mode", () => {
  const store = read("src/lib/store.ts");
  assert.ok(
    !store.includes("pixelMode"),
    "pixelMode harus hilang dari store; hapus kartu toggle di /settings dan pill di header kalau ini gagal",
  );

  const gate = read("src/components/hydration-gate.tsx");
  assert.ok(!gate.includes("pixel-mode"), "hydration-gate tidak boleh lagi menyetel class pixel-mode");

  const topStatus = read("src/components/top-status.tsx");
  assert.ok(!topStatus.includes("MODERN"), "pill toggle PIXEL/MODERN harus hilang dari header");
  assert.ok(!topStatus.includes("PIXEL"), "pill toggle PIXEL/MODERN harus hilang dari header");
});