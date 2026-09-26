#!/bin/bash
cd /root/web3min-roe3r || exit 1
rm -f dep.tmp.sh dep2.tmp.sh
echo "=== temp bersih ==="
ls *.tmp.* 2>/dev/null || echo "0 - bersih"
echo
echo "=== BUILD ==="
npm run build 2>&1 | tail -n 6
echo "BUILD_EXIT=$?"
echo
echo "=== artefak ada? ==="
ls -la --time-style=+%H:%M:%S .vercel/output/static/sw.js .vercel/output/static/offline-shell.html 2>/dev/null
echo
echo "=== penanda tombol Lanjut di bundle baru ==="
grep -rlc "min(52px,100%)" .vercel/output/static/assets/ 2>/dev/null | head -n 3