#!/bin/bash
cd /root/web3min-roe3r || exit 1
echo "=== isi commit 2d7da66 ==="
git show 2d7da66 --stat --oneline | head -n 8
git show 2d7da66 -- src/routes/kisah.\$storyId.tsx | grep -E "^[+-]" | grep -vE "^(\+\+\+|---)" | head -n 20
echo
echo "=== '?' di body: apa itu? cek StoryPlayer speaker render ==="
grep -n "speaker\|SPEAKER_LABEL\|alt=" src/components/story-player.tsx | head -n 12
echo
echo "############################################################"
echo "=== PRIORITAS 1: /settings bocorkan host Supabase/region/ping? ==="
grep -n "supabase\|Supabase\|region\|ping\|heartbeat\|host\|Status Database" src/routes/settings.tsx | head -n 20