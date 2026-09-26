#!/bin/bash
cd /root/web3min-roe3r || exit 1
echo "=== lesson player: akordion buka-tutup ada? ==="
grep -n "details\|summary\|open\b\|Accordion\|<summary" src/routes/lesson.\$lessonId.tsx | head -n 15
echo
echo "=== bagian Pengantar/Contoh/Jebakan/Kuis ==="
grep -rn "Pengantar\|Contoh\|Jebakan\|Kuis\|PENJELASAN\|PRAKTIK" src/routes/lesson.\$lessonId.tsx src/components/*.tsx 2>/dev/null | head -n 15
echo
echo "=== checklist 'Lanjut kalau kamu sudah bisa' ==="
grep -rn "Lanjut kalau\|sudah bisa\|checklist" src/ --include=*.tsx | head -n 10
echo
echo "=== progress.md: status Langkah 8 ==="
grep -n "Langkah 8" progress.md | head -n 5