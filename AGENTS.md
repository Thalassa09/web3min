# web3min — Aturan Agent

Belajar Web3 Indonesia (mayoritas user HP).

## ATURAN WAJIB
1. Satu langkah per perintah; berhenti, tunggu "w3 ok".
2. Jangan ubah teks materi/kisah/kuis tanpa diminta.
3. Tidak ada secret di frontend; jangan minta seed phrase/private key; service key hanya di server.
4. Ragu = tanya; ikuti pola yang ada; jangan hapus data tanpa izin.
5. `AGENTS.md` protected: perubahan butuh approval user.

## Visual
- Krem #FFF6EE + pink #E8437F + cokelat + Blobi; jangan dark mode.
- 60-30-10; hijau=sukses, merah=error, kuning=peringatan, emas=PETI; ikon+teks; kontras ≥4.5:1.
- Font 2 keluarga: Space Grotesk (display) + Inter (body); body 16px; teks user tanpa em/en-dash (guard).
- Spasi 4/8/12/16/24/32/48; CTA menjelaskan hasil.
- Tap target ≥44px; uji 360 dan 430px; safe area; input tidak tertutup keyboard.
- State: tombol default/hover/active/focus/disabled/loading; input default/focus/error/sukses/disabled; halaman skeleton/kosong/error/terkunci.

## Keputusan Arsitektur
Baca docs/lessons.md hanya saat menyentuh SW/offline, hydration/portal, kontras, tap target, atau navbar.

| Topik | Aturan | Detail |
|---|---|---|
| Auth & pemulihan | Username+password, email sintetis, OTP 6-digit (Resend), allowlist. | detail: docs/lessons.md#autentikasi--pemulihan-akun |
| Offline & SW | `/api/**` tanpa cache; network-first ke `/offline-shell`; jangan `location.reload()`. | detail: docs/lessons.md#offline-service-worker--state-layar |
| State layar | Skeleton bukan spinner; RPC `ok` bedakan error vs kosong. | detail: docs/lessons.md#state-layar-wajib-bukan-candyloader-saja |
| Navbar | Pill 5 menu; "Lanjut"=`firstPlayableId()`; grid 6 kolom. | detail: docs/lessons.md#navbar-bawah--tombol-lanjut |
| Efek suara | Kontrol hanya di `/settings`; pill speaker header dihapus. | detail: docs/lessons.md#kontrol-efek-suara |
| Mode retro pixel | Dihapus; jangan hidupkan lagi. | detail: docs/lessons.md#mode-retro-pixel-dihapus--jangan-dihidupkan-kembali |
| Hydration & portal | Portal tunggu `mounted`; rute penjaga `useHydrated()` + `useProgress.getState()`. | detail: docs/lessons.md#hydration--deep-link-portal--usehydrated |
| Guard gaya | Kunci identitas, bukan jumlah. | detail: docs/lessons.md#guard-gaya--aturan-dokumen |
| Dokumen desain | SSOT = @theme src/styles.css; DESIGN.md §9 patokan; PRD/DESIGN-SYSTEM arsip. | detail: docs/lessons.md#dokumen-desain--pengukuran-ssot |

SSOT desain = @theme di src/styles.css; DESIGN.md §9 = patokan; PRD.md dan DESIGN-SYSTEM.md = arsip, tidak perlu disinkronkan lagi.

## Perintah
- `w3 plan [tugas]`: rencana bernomor, langkah kecil bisa dites, urut dari fondasi, tandai risiko.
- `w3 step [n]`: kerjakan langkah n; laporan ≤3 baris: apa berubah, file, cara tes, risiko. Boleh beberapa langkah kecil berurutan kalau risiko rendah; berhenti & tanya hanya untuk auth, DB/RLS, pembayaran, teks materi.
- `w3 bug [gejala]`: akar masalah dulu; jangan menebak.
- `w3 audit`: cek secret, injeksi, auth/RLS, data sensitif; tabel severity|lokasi|masalah|fix; laporkan saja.
- `w3 ok`: commit conventional + progress.md ≤2 baris; jangan sinkron ke dokumen lain kecuali itu yang diubah.
- `w3 batal`: `git checkout .`; revert lalu perbaiki dengan instruksi spesifik.

## Verifikasi & disiplin
- Proporsional: hanya rute yang disentuh, di 390 dan 360px; tanpa audit massal 12 rute.
- Bukti "guard menangkap" hanya untuk guard BARU; jangan buat guard/dokumen baru kecuali diminta.
- Catatan lama diverifikasi sekali dengan perintah langsung; jangan telusuri ulang yang selesai.
- Satu agent per sesi; jangan delegasikan edit >5 berkas; pakai codemod + `tsc` + `git diff --stat`; jangan ubah JSX dengan regex/indeks string.
- Memori terbatas: jangan `npm run dev`; verifikasi via build + vite preview; pastikan tidak ada build lain jalan.

## Rencana tersisa
- [ ] Checklist "Lanjut kalau kamu sudah bisa..." sebelum PETI (butuh izin mengisi teks materi).
- [ ] Lazy-load per halaman (bundle ~440KB).
- [ ] JANGAN diubah, tandai untuk dicek manusia: giveaway/undian berpotensi bermasalah hukum di Indonesia.
