Arsip lengkap: docs/archive/progress-sampai-langkah-41.md (jangan dibaca kecuali diminta)

# web3min progress

## Status
- Auth & pemulihan: username+password, email sintetis, OTP 6-digit server (Resend); allowlist domain di `src/lib/account.ts`.
- Offline & PWA: banner global di `__root`, `sw.js` sendiri (api no-cache, network-first, shell `/offline-shell`); sitemap/robots + ikon 192/512 live.
- Desain: patokan §9 `/profile`, font 2 keluarga (guard), tap target ≥44px di 12 rute, kontras terverifikasi, candy gelap→pastel rose.
- Fitur: 128 blok + PETI/Kisah/kuis, leaderboard, raffle, supporter QRIS, profil publik `/u/$username`, admin (skeleton), `/dao` (gate kuis server, `482fd0c`).
- Keamanan: RLS diaudit, eskalasi `profiles` ditutup (`091d470`).
- Infrastruktur: build + `db:migrate` (Neon via `DATABASE_URL`) + CI tes; deploy Vercel.

## Terbuka
- [ ] Checklist "Lanjut kalau kamu sudah bisa..." sebelum PETI; butuh izin mengisi teks materi.
- [ ] Lazy-load per halaman (bundle ~440KB) belum dikerjakan.
- [ ] Bersihkan 11 token warna tak dirujuk (`--color-brand`, `--color-err-ink`, `--color-ok-soft`, dst).
- [ ] React #418 di `/` (temuan lama) untuk dicek manusia; bukan regresi Langkah 9.
- [ ] Tab klasemen overflow 12px di 360px: `<div>` memang `overflow-x: auto`, scrollable by design.
- [ ] JANGAN diubah, tandai untuk dicek manusia: giveaway/undian berpotensi bermasalah hukum di Indonesia.

## Terakhir dikerjakan
- [x] S1 triase: OTP `crypto.randomInt` + hash+pepper (bukan plaintext di metadata), banding constant-time, batas 5 percobaan salah, rate limit RPC (3/15m per user, 10/15m per IP), pesan request-reset diseragamkan (anti-enumerasi). Commit `a0009b0`.
- [x] Fix /admin: tombol aksi admin sesi (Buat/Edit/Peserta/Undi/Hapus) mati karena gate `adminKey` saja -> `canAdmin` + guard test. Commit `db75860`.
- [x] Fix DB alur undian: 4 fungsi pakai kolom hantu (`p.display_name`, `progress.outfits/badges`) + constraint `verifying` -> migrasi `20260929000001`, dry-run rollback alur penuh.
- [x] S9 triase: minimum password reset disamakan 6→8 karakter (`confirm-reset.post.ts` + `masuk.tsx`) sesuai aturan register.
- [x] S7+S8 triase: CSP Report-Only + X-XSS-Protection "0" di `vercel.json`; `/api/keep-alive` cek `CRON_SECRET` + respons `{ok}` tanpa bocor info. Commit `edfccc5`.
- [x] S12 triase: hapus `/tamagui-poc` + komponen bukti Tamagui + `public/prototype` (nol rujukan; routeTree diregenerasi via Generator API). Commit `036ae7b`.
- [x] Langkah 55: `/dao` gate kuis server + acceptance nol literal `discord.gg`. Commit `482fd0c`.
- [x] Langkah 54: awan rute tertutup (fog of war) + fix hydration #418 peta. Commit `a28aa0c`.
- [x] Langkah 53: dua bug UI `/profile` (banner lisensi, lebar) + drawer. Commit `eecaff7`.
- [x] Langkah 52: UI `/supporter` (bayar-via, kartu benefit) + skeleton admin. Commit `c6ded2a`, `e213ec9`.
- [x] Langkah 51: hapus tombol "Ke Blok Aktif" mati + fix auto-scroll peta. Commit `4e941d9`.

Aturan entri baru: maksimal 2 baris. Detail masuk pesan commit.
