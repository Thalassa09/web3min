-- Seed initial raffles into public.raffles
insert into public.raffles (id, title, prize, prize_detail, is_simulation, status, starts_at, ends_at, ticket_cost, winner_count)
values
  ('raf-gems-500', 'Paket 500 Bintang Penjelajah', '500 Bintang Toko Blobi', 'Tambahan saldo bintang melimpah untuk memborong seluruh outfit dan booster belajar di Toko.', true, 'live', now(), '2026-10-01T12:00:00Z', 1, 3),
  ('raf-crown', 'Mahkota Emas Blobi Eksklusif', 'Item Busana Mahkota Emas', 'Aksesoris visual langka untuk mendandani Blobi di Ruang Ganti agar tampil beda.', true, 'live', now(), '2026-10-05T12:00:00Z', 2, 5),
  ('raf-badge-pioneer', 'Lencana Kehormatan ''Pioneer Web3''', 'Badge Profil Genesis', 'Lencana reputasi perintis yang terpampang permanen di kartu profil publik kamu.', true, 'live', now(), '2026-10-10T12:00:00Z', 1, 10),
  ('raf-tickets-pack', 'Super Bundle 50 Tiket Petualang', '50 Tiket Undian Tambahan', 'Amunisi tiket besar untuk memperbesar peluang menang di berbagai pool mendatang.', true, 'live', now(), '2026-10-15T12:00:00Z', 1, 5),
  ('raf-genesis-pioneer', 'Status Perintis Genesis Season 1', 'Aura Emas Blobi & Status Abadi', 'Gelar legendaris perintis batch pertama web3min beserta efek visual khusus.', true, 'ended', '2026-09-01T00:00:00Z', '2026-09-15T12:00:00Z', 1, 1)
on conflict (id) do nothing;
