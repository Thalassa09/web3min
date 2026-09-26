#!/bin/bash
cd /root/web3min-roe3r || exit 1
echo "=== 'MODERN' di src ==="
grep -rn "MODERN\|Modern" src/ --include=*.tsx --include=*.ts | head -n 20
echo
echo "=== pixelMode / setPixelMode ==="
grep -rn "pixelMode" src/ --include=*.tsx --include=*.ts | head -n 25
echo
echo "=== sparkle / Sparkle icon ==="
grep -rn "Sparkle\|sparkle\|Sparkles" src/ --include=*.tsx --include=*.ts | head -n 15