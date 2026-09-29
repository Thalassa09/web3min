-- 20260929000002_harden_sync_progress_and_search_path.sql
-- S5 triase (audit RPC/RLS): dua temuan yang tersisa di produksi.
--
-- 1. sync_user_progress(uuid) punya EXECUTE untuk PUBLIC/anon/authenticated,
--    padahal parameternya user id bebas: siapa pun bisa memicu sinkronisasi
--    progres user lain lewat definer. Tidak ada pemanggil dari klien
--    (diverifikasi: tidak ada .rpc("sync_user_progress") di src/ server/
--    scripts/); semua pemanggil adalah fungsi security definer lain yang
--    dimiliki postgres, jadi aman dicabut. service_role tetap boleh.
revoke execute on function public.sync_user_progress(uuid) from public, anon, authenticated;

-- 2. Dua fungsi security definer yang masih tanpa search_path:
--    - get_raffles(): hanya menyentuh tabel public.
--    - admin_upsert_raffle(...): memakai pgcrypto (digest, gen_random_bytes)
--      yang terpasang di schema `extensions` (diverifikasi di DB live).
alter function public.get_raffles() set search_path = public, pg_temp;

alter function public.admin_upsert_raffle(
  text, text, text, text, text, text, text, timestamp with time zone, integer,
  integer, text, text, text, text, text, text[], boolean, text, text, text,
  text, text, text, text, text, text
) set search_path = public, extensions, pg_temp;
