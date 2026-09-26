#!/bin/bash
cd /root/web3min-roe3r || exit 1
echo "=== getStory & helper slug ==="
grep -n -A 14 "export function getStory" src/lib/stories.ts
echo
echo "=== apakah ada slug/normalisasi id? ==="
grep -n "slug\|toLowerCase()\|replace(" src/lib/stories.ts | head -n 12
echo
echo "=== field id vs slug di story s-dm ==="
sed -n '571,580p' src/lib/stories.ts
echo
echo "=== semua export di stories.ts ==="
grep -n "^export " src/lib/stories.ts