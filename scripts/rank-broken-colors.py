#!/usr/bin/env python3
"""Rank broken colour classes by how many call sites they affect."""
import re
from pathlib import Path

ROOT = Path("/root/web3min-roe3r")
css = (ROOT / "src/styles.css").read_text()
theme = css.split("@theme", 1)[1].split("\n}", 1)[0]
defined = set(re.findall(r"--color-([a-z0-9-]+)\s*:", theme))
shadow_defined = set(re.findall(r"--shadow-([a-z0-9-]+)\s*:", theme))
bases = {t.split("-")[0] for t in defined}

PREFIXES = "text|bg|border|from|via|to|ring|outline|fill|stroke|divide"
files = [p for p in (ROOT / "src").rglob("*.tsx") if "/ui/8bit/" not in str(p)]

counts = {}
for f in files:
    for m in re.finditer(r"\b(" + PREFIXES + r")-([a-z][a-z0-9]*(?:-[a-z0-9]+)*)\b", f.read_text()):
        counts[m.group(2)] = counts.get(m.group(2), 0) + 1

broken = {t: c for t, c in counts.items() if t not in defined and t.split("-")[0] in bases}
print(f"{'token':<22}{'hits':>6}   needs")
total = 0
for t, c in sorted(broken.items(), key=lambda kv: -kv[1]):
    total += c
    kind = "shadow" if t in shadow_defined else "color"
    print(f"  {t:<20}{c:>6}   --{kind}-{t}")
print(f"\n{len(broken)} broken tokens, {total} call sites total")