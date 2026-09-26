# web3min progress

## Status
- [x] Langkah 1: Pengaturan — hapus Host ID, region, ping Supabase dari UI; label diubah jadi "Sinkronisasi progres" (commit `10f7f88`).
- [x] Langkah 2: Audit RLS Supabase semua tabel (Selesai diaudit & dilaporkan — fail-closed, no service key in frontend).
- [x] Langkah 3: Sembunyikan & filter akun test (sectest_*, testuser99) dari leaderboard & RPC (`rpcGetLeaderboard` filtering + migration).
- [x] Langkah 4: Hapus akun yang menghapus data di Supabase (`/api/auth/delete-account`, `rpcDeleteMyAccount`, modal konfirmasi di `/settings`).
- [x] Langkah 6/Bug 3: Bug /kisah/s-dm dan deep link /kisah/[id] — membuka cerita/preview langsung tanpa redirect paksa ke onboarding/home.
- [x] Langkah 8: Email pemulihan akun + reset password OTP 6-digit via Resend (endpoint `/api/auth/request-reset` & `/confirm-reset`, kartu di `/profile`, modal "Lupa password?" di `/masuk`). Domain email dibatasi allowlist penyedia publik (Gmail/Yahoo/Outlook/iCloud/Proton); temp-mail & domain bisnis ditolak di client + server (`src/lib/account.ts` `isValidRecoveryEmail`, `server/api/auth/request-reset.post.ts`).
- [x] Langkah 5 (SEO/PWA): `public/robots.txt` + `public/sitemap.xml` (153 URL digenerate dari sumber konten via `scripts/generate-sitemap.ts`, ikut jalan di `npm run build`). HTML awal nyata untuk `/about`, `/cara`, `/kisah`, `/` — `HydrationGate` tidak lagi mengganti seluruh halaman dengan `<BootScreen/>`; boot screen jadi overlay. Bukti: body text /about 72 → 1.162 char, /cara 1.607, /kisah 3.481, `/` 3.586.
- [x] Langkah 7a (PWA & OG): manifest ikon 192 & 512px (`icon-192.png`, `icon-512.png` di-generate dari favicon, `purpose: any + maskable`), `<link rel=icon>` 192/512 di head. og:image disatukan ke satu sumber `https://web3min.com/og.jpg` (`DEFAULT_OG_IMAGE` = `src/lib/og/site.json`); `og-image.png` duplikat dihapus.
- [ ] Langkah 7b (Performa): font masih 5 keluarga (Bricolage Grotesque, Plus Jakarta Sans, JetBrains Mono, Silkscreen, Pixelify Sans) — target maks 3. Belum dikerjakan.
- [ ] Langkah 9: Offline/error state: banner offline + tombol Coba lagi, skeleton loading, error inline.
