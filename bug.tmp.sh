#!/bin/bash
cd /root/web3min-roe3r || exit 1
echo "=== git ==="
git log -n 1 --format="%h %s"
git status --short
echo
echo "=== rute /kisah ==="
ls -la src/routes/ | grep -i kisah
echo
echo "=== rute kisah._storyId: guard/redirect? ==="
grep -n "redirect\|notFound\|throw\|beforeLoad" src/routes/kisah._storyId.tsx | head -n 20
echo
echo "=== id kisah yang tersedia (s-dm ada?) ==="
grep -rn "\"s-dm\"\|'s-dm'\|s-dm" src/lib/ --include=*.ts | head -n 10
echo
echo "=== jenis id kisah di data ==="
grep -rno "id: *\"s-[a-z0-9-]*\"" src/lib/*.ts | head -n 20