#!/usr/bin/env python3
"""Find colour utilities that silently resolve to nothing.

Tailwind v4 `@theme` only emits a utility when the matching --color-* token
exists. A typo like `text-choco-700` (when only choco-900/600 exist) compiles
without error and the text simply inherits its parent colour — which is how
"wrong feedback colour" bugs hide.

Reports a token only when it is a *sibling* of a real token: same base, so it
was clearly meant to be part of the scale. Positional/size classes are ignored.
"""
import re, sys
from pathlib import Path

ROOT = Path("/root/web3min-roe3r")
css = (ROOT / "src/styles.css").read_text()
theme = css.split("@theme", 1)[1].split("\n}", 1)[0]
defined = set(re.findall(r"--color-([a-z0-9-]+)\s*:", theme))
bases = {t.split("-")[0] for t in defined}

# NOTE: shadow-* resolves against --shadow-*, not --color-*, so it must not
# be checked here or `shadow-ink-sm` is reported as a broken COLOUR class.
PREFIXES = "text|bg|border|from|via|to|ring|outline|fill|stroke|divide"
files = [p for p in (ROOT / "src").rglob("*.tsx") if "/ui/8bit/" not in str(p)]

used = {}
for f in files:
    for m in re.finditer(r"\b(" + PREFIXES + r")-([a-z][a-z0-9]*(?:-[a-z0-9]+)*)\b", f.read_text()):
        used.setdefault(m.group(2), set()).add(str(f.relative_to(ROOT)))

suspect = {
    t: fs for t, fs in used.items()
    if t not in defined and t.split("-")[0] in bases
}

print(f"@theme tokens defined : {len(defined)}")
print(f"broken colour classes : {len(suspect)}\n")
for t in sorted(suspect, key=lambda x: (x.split('-')[0], x)):
    print(f"  text-{t:<20} / bg-{t:<20} → , {', '.join(sorted(suspect[t])[:2])}")

print("\ndead tokens (defined but never referenced):")


def referenced(t: str) -> bool:
    # Real use only. Matching `f"-{t}"` against the whole source was vacuous:
    # the token's own `--color-x:` definition contains "-x", so nothing ever
    # looked dead. Count var() + utility classes in both TSX and CSS.
    if f"var(--color-{t})" in css or f"var(--color-{t}," in css:
        return True
    if f"var(--color-{t})" in tsx_src or f"var(--color-{t}," in tsx_src:
        return True
    return re.search(
        r"\b(?:text|bg|border|from|via|to|ring|outline|fill|stroke|divide)-" + re.escape(t) + r"\b",
        tsx_src,
    ) is not None


tsx_src = "\n".join(p.read_text() for p in files)
dead = [t for t in sorted(defined) if not referenced(t)]
for t in dead:
    print(f"  --color-{t}")
sys.exit(1 if suspect else 0)