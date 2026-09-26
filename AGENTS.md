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
- Tema terang: krem #FFF6EE, aksen pink #E8437F, teks cokelat, maskot Blobi. Pakai warna yang sudah ada di kode.
- 60-30-10: krem dominan, kartu/permukaan, pink hanya untuk CTA utama & item aktif.
- Warna feedback: hijau = sukses/blok selesai, merah = error/bahaya (seed phrase, kontrak mencurigakan), kuning/oranye = peringatan & keputusan penting, emas = PETI. Kontras ≥4.5:1, selalu ada ikon + teks.
- Font maksimal 2 (Bricolage Grotesque display, Plus Jakarta Sans body). Body 16px. Dijaga `src/lib/font-budget.test.ts` — suite gagal kalau keluarga ke-3 masuk kembali.
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

## Keputusan Arsitektur

### Autentikasi & Pemulihan Akun
- Registrasi tetap zero-friction: `username` + `password` saja. Email internal sintetis `{username}@users.web3min.vercel.app` — user tidak pernah melihatnya.
- Email pemulihan disimpan di `user_metadata.recovery_email` (bukan kolom tabel `profiles`), lewat `supabase.auth.updateUser`.
- Reset password TIDAK memakai reset-link native Supabase (kena limit 3 email/jam free tier + butuh kredensial SMTP). Dipakai OTP 6-digit buatan server:
  - `POST /api/auth/request-reset` → cari profile by username → baca `recovery_email` → gate domain → generate OTP acak → simpan `reset_otp` + `reset_otp_expires` (15 menit) → kirim HTML via Resend `POST https://api.resend.com/emails`.
  - `POST /api/auth/confirm-reset` → cocokkan OTP + expiry → `supabase.auth.admin.updateUserById(id, { password })` → bersihkan OTP dari metadata.
- Allowlist domain email pemulihan (server + client, sumber tunggal `ALLOWED_EMAIL_DOMAINS` di `src/lib/account.ts`): hanya penyedia publik Gmail/Googlemail, Yahoo (`.com`, `.co.id`, `.co.uk`, `.com.sg`, `ymail`, `rocketmail`), Outlook/Hotmail/Live/MSN, iCloud, Proton. Temp-mail dan domain bisnis/kustom ditolak agar delivery rate Resend tidak rusak oleh spam bot.
- Secret server: `RESEND_API_KEY` + `SUPABASE_SERVICE_ROLE_KEY` hanya di env Vercel production & `.env.local`. Tidak pernah masuk bundle frontend.
- API key Resend berstatus *sending-restricted* → endpoint `/domains` 401. Karena itu pengirim memakai `Web3min <onboarding@resend.dev>` sampai domain `web3min.com` diverifikasi DNS di dashboard Resend.
- Catatan: `AGENTS.md` adalah protected file — perubahan di dalamnya butuh approval eksplisit dari user.

### Offline, Service Worker & State Layar
- Banner offline global dipasang di `__root.tsx`, BUKAN di `AppShell`. Sebab: 11 rute tidak memakai `AppShell` (onboarding, masuk, lesson, kisah, dll) — justru itu yang paling sering dibuka dari HP, jadi banner di `AppShell` akan bocor di situ.
- `navigator.onLine` saja tidak dipercaya: artinya "ada antarmuka jaringan", bukan "server bisa dihubungi". Karena itu copy banner tidak pernah berbunyi "tidak ada koneksi"; kegagalan permintaan sungguhan ditangani pesan error inline per rute.
- Service worker `public/sw.js` ditulis sendiri tanpa Workbox. Tiga aturan: `/api/**` tidak pernah di-cache (balas `503 {ok:false, offline:true}` supaya pemanggil bisa memberi pesan sendiri), navigasi network-first lalu jatuh ke shell `/offline-shell`, aset statis cache-first.
- **JANGAN pakai `location.reload()` sebagai tombol "Coba lagi".** Shell bisa tersaji saat koneksi sebenarnya hidup (user mengetik `/offline-shell`, atau SW menyajikan cache karena timeout); reload di kondisi itu = loop tak berujung. Reload hanya saat event `online` menyala setelah benar-benar offline; tombol memakai `location.replace("/")`.
- **Vercel memakai clean URLs**: `/offline-shell.html` dijawab 404, `/offline-shell` dijawab 200. Semua path statis `.html` lain juga kena (`/index.html`, `/prototype/index.html`). Selalu acu berkas `.html` tanpa ekstensi.
- `VERSION` di `sw.js` wajib di-bump setiap isi shell berubah, supaya cache lama (`w3m-vN-shell`) dibersihkan saat `activate`.
- Yang sengaja TIDAK dilakukan: meng-cache dokumen HTML aplikasi. Build ini SSR murni (tidak ada `index.html` statis), dan cache dokumen berarti risiko halaman basi/user-specific bocor antar sesi. Konsekuensinya offline selalu menampilkan shell, bukan versi aplikasi — itu sesuai aturan Mobile #3 (pesan jelas, tombol Coba lagi, jangan layar kosong). Upgrade ke offline penuh butuh Workbox + precache eksplisit.

### State Layar Wajib (bukan `CandyLoader` saja)
- Klasemen memakai `SkeletonRows` saat memuat, bukan spinner — bentuk kartu dipertahankan supaya layout tidak melompat.
- `rpcGetLeaderboard` mengembalikan `ok: boolean`. Tanpa ini UI tidak bisa membedakan "klasemen kosong" dari "server tak terhubung" — keduanya tampil sebagai daftar kosong. Sekarang error menampilkan kotak pesan + tombol "Coba lagi" yang benar-benar `refetch` (lewat dependency `reloadKey`).

### Navbar Bawah & Tombol "Lanjut"
- Navbar `src/components/bottom-nav.tsx` = pill mengambang, 5 menu nyata (`NAV_ITEMS` di `src/lib/nav.ts`: Belajar, Kisah, Arena, Toko, Profil) + 1 tombol bulat pink. Spesifikasi awal menyebut 4 menu (Home/Rute/Progres/Profil), tapi rute `/rute` & `/progres` tidak pernah ada (`/rantai` cuma `redirect({ to: "/" })`), sedangkan Kisah/Arena tidak punya pintu masuk lain dari HP. Jumlah menu dipertahankan 5 supaya nol fitur kehilangan akses mobile.
- **Tombol "Lanjut" bukan rute baru.** Isinya `firstPlayableId(completed)` dari `src/lib/curriculum.ts`: buka blok berikutnya yang belum selesai; kalau semua tuntas, balik ke beranda. Jadi tombol tidak pernah jadi jalan buntu dan tidak pernah menuju blok yang tidak ada.
- Grid **6 kolom sama lebar**. JANGAN kembali ke 7 kolom + spacer — dengan 7 kolom elemen ke-3 jatuh ke kolom spacer dan label "Arena" menciut jadi 12px (terbukti lewat pengukuran, bukan dugaan).
- Tombol wajib `size-[min(52px,100%)]`, bukan `size-13`. Di lebar 320px kolom grid hanya ~44px, tombol 52px meluber keluar dan menimpa "Toko".
- Tombol sengaja **ikon saja (`ArrowRight`) tanpa teks**, dan `aria-label` wajib ada. Sebab: label putih di atas pink brand cuma 3.79:1 dan gagal WCAG AA untuk teks kecil, sedangkan ikon sebagai objek grafis hanya butuh 3:1. Ini menutup celah tanpa melanggar larangan mengganti pink brand.
- Gradient elemen aktif & tombol memakai candy-700 (`#B01F62`), bukan candy-600. candy-600 lolos saat diam (4.71:1) tapi `hover:brightness-110` menurunkannya ke 4.0:1. Terukur: 6.53:1 diam, 5.62:1 hover.
- Batas keras yang harus tetap lulus di 320/360/390/430px: tap target ≥44px, nol overlap antar-slot, nol overflow horizontal.

## Perintah
- w3 plan [tugas]: rencana bernomor, tanpa coding.
- w3 step [n]: kerjakan langkah n saja, lalu lapor: ringkasan, file berubah, cara tes manual, risiko.
- w3 audit: tabel severity|lokasi|masalah|fix, tanpa ubah kode.
- w3 ok: commit (conventional commit) + update progress.md.
- w3 batal: git checkout . (batalkan langkah terakhir).
