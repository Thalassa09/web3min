# web3min — Aturan Agent

Platform belajar Web3 Indonesia, mayoritas user di HP. Progres di localStorage + Supabase.

## ATURAN WAJIB
1. Satu langkah per perintah; berhenti, tunggu "w3 ok".
2. Jangan ubah teks materi/kisah/kuis tanpa diminta.
3. Tidak ada API key/secret di frontend; jangan pernah minta seed phrase/private key; service key hanya di server.
4. Ragu = tanya, jangan asumsi; ikuti pola yang ada; jangan hapus data tanpa izin.
5. `AGENTS.md` protected: perubahan butuh approval eksplisit user.

## Visual
- Krem #FFF6EE + pink #E8437F + cokelat + Blobi; jangan dark mode.
- 60-30-10; hijau=sukses, merah=error, kuning=peringatan, emas=PETI; ikon+teks; kontras ≥4.5:1.
- Font 2 keluarga: Space Grotesk (display) + Inter (body); body 16px (`font-budget.test.ts`); teks user tanpa em/en-dash (`ai-punctuation.test.ts`).
- Spasi 4/8/12/16/24/32/48; CTA menjelaskan hasil; error langsung di field.
- Tap target ≥44px; uji 360 & 430px; safe area; input tidak tertutup keyboard.
- State: tombol default/hover/active/focus/disabled/loading; input default/focus/error/sukses/disabled; halaman skeleton/kosong/error/terkunci.

## Keputusan Arsitektur
Baca `docs/lessons.md` hanya saat menyentuh SW/offline, hydration/portal, kontras, tap target, atau navbar. Detail tiap baris = `docs/lessons.md#<anchor>`.

| Topik | Aturan | Anchor |
|---|---|---|
| Auth & pemulihan | Username+password, email sintetis, OTP 6-digit server (Resend), allowlist domain. | autentikasi--pemulihan-akun |
| Offline & SW | `/api/**` tanpa cache; navigasi network-first ke `/offline-shell`; jangan `location.reload()`. | offline-service-worker--state-layar |
| State layar | Skeleton bukan spinner; RPC `ok` bedakan error vs kosong. | state-layar-wajib-bukan-candyloader-saja |
| Navbar | Pill 5 menu; "Lanjut"=`firstPlayableId()`; grid 6 kolom; ikon + aria-label. | navbar-bawah--tombol-lanjut |
| Efek suara | Kontrol hanya di `/settings`; pill speaker header dihapus. | kontrol-efek-suara |
| Mode retro pixel | Dihapus; jangan hidupkan lagi. | mode-retro-pixel-dihapus--jangan-dihidupkan-kembali |
| Hydration & portal | Portal tunggu `mounted`; rute penjaga pakai `useHydrated()` + `useProgress.getState()`. | hydration--deep-link-portal--usehydrated |
| Guard gaya | Guard mengunci identitas, bukan jumlah. | guard-gaya--aturan-dokumen |

SSOT desain = @theme di src/styles.css; DESIGN.md §9 = patokan; PRD.md dan DESIGN-SYSTEM.md = arsip, tidak perlu disinkronkan lagi.

## Perintah
- `w3 plan [tugas]`: rencana bernomor, langkah kecil bisa dites, urut dari fondasi, tandai risiko; jangan ngoding.
- `w3 step [n]`: kerjakan langkah n; laporan ≤3 baris (apa berubah, file, tes+risiko). Boleh beberapa langkah kecil berurutan kalau risiko rendah; berhenti & tanya hanya untuk auth, DB/RLS, pembayaran, teks materi.
- `w3 bug [gejala]`: akar masalah dulu; jangan menebak/menumpuk fix.
- `w3 audit`: cek secret, injeksi, auth/RLS, data sensitif di log/client; tabel severity|lokasi|masalah|rekomendasi; laporkan saja.
- `w3 ok`: commit conventional + progress.md ≤2 baris; jangan sinkron ke dokumen lain kecuali itu yang diubah.
- `w3 batal`: `git checkout .`; revert lalu perbaiki dengan instruksi spesifik.

## Verifikasi & disiplin
- Proporsional: hanya rute yang disentuh, di 390 & 360px; tanpa audit massal 12 rute.
- Bukti "guard menangkap" hanya untuk guard BARU; jangan buat guard/dokumen baru kecuali diminta.
- Catatan lama diverifikasi sekali dengan perintah langsung; jangan telusuri ulang yang sudah selesai di progress.
- Satu agent per sesi; delegasi edit >5 berkas ke subagent dilarang; pakai codemod + `tsc` + `git diff --stat`; jangan ubah JSX dengan regex/indeks string.
- Memori terbatas: jangan `npm run dev`; verifikasi via build + vite preview; pastikan tidak ada build lain jalan.

## Rencana tersisa
- [ ] Checklist "Lanjut kalau kamu sudah bisa..." sebelum PETI (butuh izin mengisi teks materi).
- [ ] Lazy-load per halaman (bundle ~440KB).
- [ ] JANGAN diubah, tandai untuk dicek manusia: giveaway/undian berpotensi bermasalah hukum di Indonesia.
