#!/usr/bin/env python3
"""Audit kontras menyeluruh: pasangan fg/bg yang benar-benar dirender di src/.

Bukan gate yang memblokir — ini pemindai. Menemukan kelas yang dipakai bersama
dalam satu string className, lalu mengecek rasio kontras tiap pasangan teks/latar
yang mungkin. Ambang: 4.5:1 teks normal, 3:1 teks besar (>=18.66px bold / 24px).
"""
import re, sys, pathlib

def lum(h):
    h = h.lstrip("#")
    c = [int(h[i:i+2], 16)/255 for i in (0, 2, 4)]
    c = [x/12.92 if x <= 0.03928 else ((x+0.055)/1.055)**2.4 for x in c]
    return 0.2126*c[0] + 0.7152*c[1] + 0.0722*c[2]

def cr(a, b):
    x, y = sorted([lum(a), lum(b)], reverse=True)
    return round((x+0.05)/(y+0.05), 2)

ROOT = pathlib.Path("src")
CSS = (ROOT/"styles.css").read_text()

# nama token -> hex
TOKEN = {}
for m in re.finditer(r"--color-([a-z0-9-]+):\s*(#[0-9A-Fa-f]{6})", CSS):
    TOKEN[m.group(1)] = m.group(2)
# juga tangkap hex literal yang dipakai sebagai bg-[#xxx]
def blend(fg_hex, alpha, bg_hex):
    """Tumpuk warna beropasitas di atas latar solid (alpha compositing)."""
    f = [int(fg_hex.lstrip("#")[i:i+2], 16) for i in (0, 2, 4)]
    b = [int(bg_hex.lstrip("#")[i:i+2], 16) for i in (0, 2, 4)]
    o = [round(alpha*f[i] + (1-alpha)*b[i]) for i in range(3)]
    return "#" + "".join(f"{v:02X}" for v in o)

print(f"token warna terdaftar: {len(TOKEN)}")

CREAM = TOKEN.get("cream", "#FFF6EE")

def resolve(name):
    return TOKEN.get(name)

# Cari string className yang punya text-X dan bg-Y sekaligus
TEXT = re.compile(r"\btext-([a-z0-9-]+)\b")
BG   = re.compile(r"\bbg-([a-z0-9-]+)\b")
HEXT = re.compile(r"\btext-\[(#[0-9A-Fa-f]{6})\]\b")
HEXB = re.compile(r"\bbg-\[(#[0-9A-Fa-f]{6})\]\b")

findings = []
for f in ROOT.rglob("*.tsx"):
    src = f.read_text()
    for m in re.finditer(r'["\'`]([^"\'`]{0,400})["\'`]', src):
        cls = m.group(1)
        if "text-" not in cls or "bg-" not in cls:
            continue
        # fg: text-<token> (abaikan opacity di teks untuk kesederhanaan)
        fgs = [(n, resolve(n)) for n in TEXT.findall(cls)]
        fgs += [(None, h) for h in HEXT.findall(cls)]
        # bg: bg-<token>[/alpha] — alpha WAJIB dikompositkan di atas cream,
        # kalau tidak scanner membaca #3B2218 solid padahal aslinya 5% di cream.
        bgs = []
        for m2 in re.finditer(r"\bbg-([a-z0-9-]+)(?:\/(\d{1,3}))?\b", cls):
            name, alpha = m2.group(1), m2.group(2)
            base = resolve(name)
            if not base:
                continue
            if alpha is not None:
                a = min(100, int(alpha)) / 100
                bgs.append((f"{name}/{alpha}", blend(base, a, CREAM)))
            else:
                bgs.append((name, base))
        bgs += [(None, h) for h in HEXB.findall(cls)]
        # hover:/active: bg-* bukan latar saat-diam -> lewati (bukan bagian cls ini)
        if re.search(r"(hover|active|group-hover|focus):bg-", cls) and not re.search(r"(?<![-\w])bg-", cls.split("hover:")[0]):
            continue
        for fn, fv in fgs:
            if not fv: continue
            for bn, bv in bgs:
                if not bv: continue
                if fn in ("white",) or fv == "#FFFFFF":
                    pass
                r = cr(fv, bv)
                if r < 4.5:
                    line = src[:m.start()].count("\n") + 1
                    findings.append((r, f"#{fv} on #{bv}", fn or fv, bn or bv, str(f.relative_to(ROOT.parent)), line))

findings.sort()
seen = set()
print(f"\n=== pasangan berisiko (<4.5:1) — {len(findings)} mentah ===")
n = 0
for r, pair, fn, bn, path, line in findings:
    key = (r, fn, bn)
    if key in seen: continue
    seen.add(key)
    n += 1
    print(f"  {r:5}:1  text-{fn:<14} di bg-{bn:<14} {path}:{line}")
    if n >= 40:
        print("  ... (dipotong)")
        break
print(f"\ntotal pasangan unik berisiko: {len(seen)}")
sys.exit(0)
