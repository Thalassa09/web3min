#!/usr/bin/env python3
"""Verify the SSR HTML actually carries page content, not a boot screen.

Background preview logs reported ERR_MODULE_NOT_FOUND for /shop and /profile
while builds were being swapped underneath running servers. A 200 alone does not
disprove that, so this checks three things per route: HTTP status, absence of
module/error markers, and a minimum amount of visible text in the served body.
"""
import re
import sys
import urllib.request

BASE = "http://127.0.0.1:5250"
ROUTES = ["/", "/shop", "/profile", "/kisah", "/leaderboard", "/cara", "/about"]

BAD = ("ERR_MODULE_NOT_FOUND", "Application error", "Cannot find module", "renderToReadableStream")

fail = 0
for r in ROUTES:
    try:
        with urllib.request.urlopen(BASE + r, timeout=30) as resp:
            status = resp.status
            html = resp.read().decode("utf-8", "replace")
    except Exception as e:  # noqa: BLE001
        print(f"  FAIL  {r}  request error: {e}")
        fail += 1
        continue

    markers = [b for b in BAD if b in html]
    text = re.sub(r"<(script|style)[^>]*>.*?</\1>", " ", html, flags=re.S | re.I)
    text = re.sub(r"<[^>]+>", " ", text)
    words = len(text.split())

    ok = status == 200 and not markers and words >= 40
    print(f"  {'OK  ' if ok else 'FAIL'}  {r:<13} status={status} words={words:<5} markers={markers or 'none'}")
    if not ok:
        fail += 1

print(f"\n{'ALL ROUTES SERVE REAL SSR CONTENT' if not fail else f'{fail} route(s) failed'}")
sys.exit(1 if fail else 0)