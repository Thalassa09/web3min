#!/usr/bin/env python3
"""Measure real contrast from a screenshot.

The DOM walker only sees `background-color`; it cannot see the gradient CTA fills
(`bg-gradient-to-b from-[#FF6699] via-[#E8437F] to-[#D82668]`) or the world map
artwork behind node labels. So it reported things that are actually fine.

This reads the pixels instead: for each text node it takes the element's colour
and the *median background pixel* around the glyphs. No cascade guessing.
"""
import json
from collections import Counter
from pathlib import Path
from PIL import Image

def parse_css_color(c: str):
    c = c.strip()
    if c.startswith("rgb"):
        nums = c[c.index("(") + 1 : c.index(")")].replace("%", "").split(",")
        return tuple(int(float(n)) for n in nums[:3])
    if c.startswith("#"):
        h = c.lstrip("#")
        return tuple(int(h[i : i + 2], 16) for i in (0, 2, 4))
    return None

def lum(rgb):
    def f(v):
        v /= 255
        return v / 12.92 if v <= 0.03928 else ((v + 0.055) / 1.055) ** 2.4
    r, g, b = (f(x) for x in rgb)
    return 0.2126 * r + 0.7152 * g + 0.0722 * b

def ratio(a, b):
    la, lb = lum(a), lum(b)
    hi, lo = max(la, lb), min(la, lb)
    return (hi + 0.05) / (lo + 0.05)

def background_near(img, box, text_rgb):
    """Median colour of pixels in the box, excluding those close to the glyph colour."""
    x, y, w, h = box
    px = img.load()
    samples = []
    for yy in range(max(0, y), min(img.height, y + h)):
        for xx in range(max(0, x), min(img.width, x + w)):
            p = px[xx, yy][:3]
            # skip glyph pixels: near the foreground colour
            if sum(abs(p[i] - text_rgb[i]) for i in range(3)) < 90:
                continue
            samples.append(p)
    if not samples:
        return None
    # mode-ish: most common quantised colour = the surface behind the text
    quant = Counter((p[0] // 8 * 8, p[1] // 8 * 8, p[2] // 8 * 8) for p in samples)
    return quant.most_common(1)[0][0]

report = json.loads(Path("/tmp/contrast-report.json").read_text())
failures = []
checked = 0

for route, stops in report.items():
    for stop in stops:
        img = Image.open(stop["shot"]).convert("RGB")
        for it in stop["items"]:
            fg = parse_css_color(it["color"])
            if not fg:
                continue
            bg = background_near(img, (it["x"], it["y"], it["w"], it["h"]), fg)
            if not bg:
                continue
            checked += 1
            r = ratio(fg, bg)
            large = it["fontSize"] >= 24 or (it["fontSize"] >= 18.66 and it["fontWeight"] >= 700)
            need = 3.0 if large else 4.5
            if r < need:
                failures.append({
                    "route": route,
                    "text": it["text"],
                    "px": it["fontSize"],
                    "fg": "#%02X%02X%02X" % fg,
                    "bg": "#%02X%02X%02X" % bg,
                    "ratio": round(r, 2),
                    "need": need,
                })

def key(f):
    return (f["fg"], f["bg"], f["px"])

grouped = {}
for f in failures:
    grouped.setdefault(key(f), []).append(f)

print(f"text nodes measured: {checked}")
print(f"failures: {len(failures)}  (distinct combos: {len(grouped)})\n")
for k, items in sorted(grouped.items(), key=lambda kv: -len(kv[1])):
    f = items[0]
    routes = sorted({i["route"] for i in items})
    print(f"  {f['ratio']:>5}:1 (need {f['need']})  n={len(items):<3} {f['fg']} on {f['bg']} @{f['px']}px")
    print(f"         {f['text']!r}  routes: {','.join(routes)}")