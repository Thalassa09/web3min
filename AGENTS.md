# web3min – Aturan Agent

## ATURAN WAJIB
1. Satu langkah per perintah. Jangan mulai langkah berikutnya sebelum saya bilang "w3 ok".
2. Jangan ubah teks materi/kisah/kuis kecuali diminta.
3. Tidak ada API key/secret di frontend. Jangan pernah minta seed phrase/private key.
4. Ragu = tanya, jangan asumsi. Ikuti pola kode & struktur folder yang sudah ada.

## Cara berpikir
Sebelum ngoding pikirkan: data, arsitektur, keamanan, kasus gagal, alur user.
Alur: masalah → rencana → build → tes → perbaiki → rilis.

## Visual (pertahankan identitas)
- Tema terang: krem #FFF6EE, aksen pink #E8437F, teks cokelat, font pixel, maskot Blobi. Pakai warna yang sudah ada di kode.
- 60-30-10: krem dominan, kartu/permukaan, pink hanya untuk CTA utama & item aktif.
- Warna feedback: hijau = sukses/blok selesai, merah = error/bahaya (seed phrase, kontrak mencurigakan), kuning/oranye = peringatan & keputusan penting, emas = PETI. Kontras ≥4.5:1, selalu ada ikon + teks.
- Font maksimal 3 (sekarang 5). Body 16px.
- Spasi jangan sama rata: label→field 6-8px, antar field 16px, sebelum tombol 24px. Skala 4/8/12/16/24/32/48.

## State wajib
- Tombol: default, hover, active, focus (ring terlihat), disabled (abu-abu), loading.
- Input: default, focus, error (merah + pesan), sukses (hijau), disabled.
- Halaman: skeleton, kosong ("Belum ada blok selesai. Mulai dari #0x01 →"), error (+ tombol Coba lagi), terkunci (redup + alasan).

## Copy
- Bahasa manusia, bukan bahasa dokumentasi.
- CTA bilang apa yang akan terjadi: "Mulai Blok #0x05 →", bukan "Submit".
- Error muncul langsung di field saat itu juga, bukan setelah submit.
- Less is more: konten panjang dipecah jadi bagian yang bisa dibuka-tutup.

## Mobile (5 kesalahan AI)
1. Form aman keyboard: input & tombol utama tidak ketutup keyboard.
2. Layout fleksibel + safe area. Tes di lebar 360px & 430px. Tap target ≥44px.
3. Offline: tampilkan data tersimpan, pesan jelas, tombol Coba lagi. Jangan layar kosong.
4. Secret hanya di server (service key tidak boleh masuk bundle).
5. Siap rilis: link privasi berfungsi, Hapus Akun di Pengaturan benar-benar menghapus data server, setiap izin disertai alasan.

## Navbar
Pill mengambang di bawah ala Iconly: Home, Rute, Progres, Profil. Item aktif pakai latar pill + label. Tombol bulat pink "Lanjut" di tengah. Ikon animasi ringan dari lucide-animated.com (alternatif: animateicons.in, heroicons-animated.com), animasi hanya saat hover/tap.

## Perintah
- w3 plan [tugas]: buat rencana bernomor. Tiap langkah kecil & bisa dites terpisah, urut dari fondasi, tandai langkah berisiko + alasannya. Jangan ngoding.
- w3 step [n]: kerjakan langkah n saja. Kalau perlu keputusan di luar rencana, berhenti & tanya. Setelah selesai laporkan: (1) ringkasan bahasa sederhana, (2) file yang berubah, (3) langkah tes manual + hasil yang seharusnya muncul, (4) fitur lain yang berisiko rusak.
- w3 bug [gejala]: telusuri akar masalah dulu. Jangan menebak, jangan menumpuk fix.
- w3 audit: bertindak sebagai security + QA engineer. Cek input validation, secret terekspos, injeksi SQL/NoSQL, celah auth/RLS, data sensitif di log/client. Output berupa tabel: severity (kritis/sedang/rendah), file, deskripsi, rekomendasi. Laporkan saja, jangan diubah.
- w3 ok: commit format conventional (type(scope): deskripsi), update progress.md, catat keputusan arsitektur penting di AGENTS.md.
- w3 batal: git checkout . (revert dulu, lalu perbaiki dengan instruksi yang lebih spesifik).

## Rencana prioritas
1. Keamanan: /settings jangan menampilkan host Supabase, region, ping, heartbeat. Ganti label "Status Database On-Chain". Cek RLS di semua tabel.
2. Data: sembunyikan & hapus akun test (sectest_*, testuser99) dari leaderboard. Reset/Hapus Akun juga menghapus data server.
3. Bug: /kisah/s-dm malah redirect ke home.
4. SEO/PWA: sitemap.xml & robots.txt valid, meta/prerender, ikon 192 & 512px, og-image.
5. Performa: font maksimal 3, lazy-load per halaman (bundle ~440KB).
6. UI: warna feedback, state lengkap, spasi, peta rute (selesai/peringatan/terkunci/PETI).
7. Navbar pill + tombol Lanjut.
8. Halaman blok: Pengantar → Contoh → Jebakan → Kuis (buka-tutup) + checklist "Lanjut kalau kamu sudah bisa…" sebelum PETI.
9. Jangan diubah, tandai untuk dicek manusia: giveaway/undian berpotensi bermasalah secara hukum di Indonesia.

---

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
