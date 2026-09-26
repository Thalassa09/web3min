# web3min
Platform belajar Web3 bahasa Indonesia, santai, bergamifikasi: 20 rute, 128 blok (#0x01-#0x80), PETI, Kisah, nyawa, koin, streak, maskot Blobi. Mayoritas user dari HP. Progres di localStorage + Supabase.

## ATURAN WAJIB
1. Satu langkah per perintah. Selesai, berhenti, tunggu konfirmasi.
2. Jangan ubah teks materi/Kisah tanpa diminta.
3. Tidak ada secret/service key di frontend. Situs tidak pernah meminta seed phrase/private key.
4. Ragu, tanya. Ikuti pola komponen yang ada. Jangan hapus data tanpa izin.

## Desain (pertahankan brand yang ada)
- Tema terang krem #FFF6EE, aksen pink #E8437F, teks cokelat, font pixel. Jangan ganti ke dark mode.
- Hijau=sukses, kuning=peringatan, merah=error, emas=PETI. Kontras min 4.5:1, selalu dengan ikon/label.
- Tombol punya state default/hover/active/focus/disabled.
- Spacing 4/8/12/16/24/32/48: rapat untuk yang berkaitan, lebar antar grup.
- CTA menjelaskan hasil ("Mulai Blok #0x01 →"). Bahasa manusiawi.
- Tap target min 44px, uji layar 360 & 430px, pakai safe area, input tidak tertutup keyboard.

## Perintah
- w3 plan [tugas]: rencana bernomor, tanpa coding.
- w3 step [n]: kerjakan langkah n saja, lalu lapor: ringkasan, file berubah, cara tes manual, risiko.
- w3 audit: tabel severity|lokasi|masalah|fix, tanpa ubah kode.
- w3 ok: commit (conventional commit) + update progress.md.
- w3 batal: git checkout . (batalkan langkah terakhir).
