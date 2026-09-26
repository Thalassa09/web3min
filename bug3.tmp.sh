#!/bin/bash
cd /root/web3min-roe3r || exit 1
echo "=== link keluar dari kisah.index ==="
grep -n "to=\"/kisah\|to: \"/kisah\|href=\"/kisah" src/routes/kisah.index.tsx | head -n 15
echo
echo "=== ada redirect ke '/' dari kisah? ==="
grep -rn "to: \"/\"\|redirect" src/routes/kisah.index.tsx src/routes/kisah.tsx | head
echo
echo "=== riwayat commit menyentuh kisah ==="
git log -n 8 --format="%h %ad %s" --date=format:%H:%M -- src/routes/kisah.\$storyId.tsx src/lib/stories.ts src/routes/kisah.index.tsx
echo
echo "=== speaker tidak dikenal? SPEAKER_LABEL kunci ==="
sed -n '41,48p' src/lib/stories.ts
echo
echo "=== speaker dipakai di s-eth (baris ~205) ==="
sed -n '205,215p' src/lib/stories.ts