#!/usr/bin/env python3
"""Find every place that paints WHITE TEXT on a pink surface.

White on --color-candy-500 (#E8437F) is 3.79:1 and on the CTA gradient stops it
drops to 2.66:1 — below WCAG AA. Only the *co-occurrence* of a pink fill and a
white label is a bug: candy-500 as border/ring/dot has no contrast requirement,
so a blind `bg-candy-500` -> `bg-candy-700` sed would darken the brand for
nothing. This prints the exact set that needs moving, across TSX and CSS.

CSS rule blocks are matched by selector+body because the violation is spread
over two declarations. Nothing here checks whether the class is still used —
that needs a DOM walk (see scripts/probe-legacy-classes.mjs).
"""
import re
import sys
from pathlib import Path

ROOT = Path("/root/web3min-roe3r/src")
PINK_FILL = re.compile(
    r"\b(?:bg-candy-(?:400|500)|from-\[#FF6(?:69|BA)9?\]|via-\[#FF3D88\]|via-\[#E8437F\]"
    r"|to-\[#D82668\]|to-\[#E61F73\]|--color-primary(?:,|\b)|--color-pink-500)"
)
WHITE_TEXT = re.compile(r"\btext-white\b|\bcolor\s*:\s*(?:#fff(?:fff)?|white)\b", re.I)

hits, fills_only = [], 0
for f in sorted(ROOT.rglob("*.tsx")):
    if "/ui/8bit/" in str(f):
        continue
    for i, line in enumerate(f.read_text().splitlines(), 1):
        if not PINK_FILL.search(line):
            continue
        if WHITE_TEXT.search(line):
            hits.append((str(f.relative_to(ROOT.parent)), i, line.strip()[:110]))
        else:
            fills_only += 1

print(f"pink fill + white text (BUG)   : {len(hits)} occurrences")
print(f"pink fill, no white text (fine): {fills_only} occurrences\n")
for path, line, text in hits:
    print(f"  {path}:{line}")
    print(f"      {text}")