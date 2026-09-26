# web3min progress

## Status
- [x] Langkah 1: Pengaturan — hapus Host ID, region, ping Supabase dari UI; label diubah jadi "Sinkronisasi progres" (commit `10f7f88`).
- [x] Langkah 2: Audit RLS Supabase semua tabel (Selesai diaudit & dilaporkan — fail-closed, no service key in frontend).
- [x] Langkah 3: Sembunyikan & filter akun test (sectest_*, testuser99) dari leaderboard & RPC (`rpcGetLeaderboard` filtering + migration).
- [x] Langkah 4: Hapus akun yang menghapus data di Supabase (`/api/auth/delete-account`, `rpcDeleteMyAccount`, modal konfirmasi di `/settings`).
- [x] Langkah 6/Bug 3: Bug /kisah/s-dm dan deep link /kisah/[id] — membuka cerita/preview langsung tanpa redirect paksa ke onboarding/home.
- [ ] Langkah 5: Robots.txt + sitemap.xml & HTML awal untuk /about, /cara, /kisah (SSR HydrationGate optimization).
- [ ] Langkah 7: Font maks 3, manifest icons 192 & 512px, konsistensi og:image.
- [ ] Langkah 8: Offline/error state: banner offline + tombol Coba lagi, skeleton loading, error inline.
