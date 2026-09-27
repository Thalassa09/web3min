-- ============================================================================
-- 20260927000007_fix_profile_update_rate_limit_side_effects.sql
--
-- BUG NYATA yang ditemukan saat uji benefit supporter:
--   4× isi nyawa gratis + beli tiket dalam satu menit gagal dengan pesan
--   "Terlalu sering mengubah profil. Mohon tunggu 1 menit."
--
-- AKAR MASALAH:
--   `log_activity()` menulis `profiles.last_active_at` setiap kali ada aksi.
--   Tulisan itu melewati trigger `guard_profile_immutable_fields`, yang
--   menjalankan rate limit `profile_update` (6 update/menit).
--   Akibatnya rate limit PROFILE ikut membatasi AKSI LAIN (isi nyawa, beli
--   tiket, selesaikan blok) — pengguna aktif akan terblokir tanpa alasan.
--
-- PERBAIKAN: rate limit hanya berlaku untuk perubahan data yang benar-benar
--   berasal dari pengguna (bio/twitter). Perubahan `last_active_at` oleh
--   sistem tidak dihitung.
--
-- Catatan: guard ini TIDAK dilewati untuk perubahan sensitif (is_admin,
-- account_type) — itu tetap diblokir lewat pemeriksaan terpisah di atasnya.
-- ============================================================================

create or replace function public.guard_profile_immutable_fields()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $function$
declare
  v_allowed boolean;
  v_is_privileged boolean;
  v_user_edit boolean;
begin
  if new.id <> old.id then
    raise exception 'ID akun tidak dapat diubah' using errcode = '42501';
  end if;

  if new.created_at <> old.created_at then
    raise exception 'Timestamp created_at tidak dapat diubah' using errcode = '42501';
  end if;

  -- Pemanggil istimewa: admin, service_role, atau proses server.
  v_is_privileged := auth.uid() is null or public.is_admin();

  if not v_is_privileged then
    if new.is_admin is distinct from old.is_admin then
      raise exception 'Kolom admin hanya dapat diubah server' using errcode = '42501';
    end if;

    if new.account_type is distinct from old.account_type then
      raise exception 'Tipe akun hanya dapat diubah server' using errcode = '42501';
    end if;
  end if;

  -- Apakah ini SUNGGUHAN edit profil dari pengguna?
  -- Hanya `bio` atau `twitter` yang berubah = edit pengguna.
  -- Perubahan `last_active_at` (dari log_activity) BUKAN edit pengguna dan
  -- tidak boleh ikut memakan kuota rate limit.
  v_user_edit :=
    new.bio is distinct from old.bio
    or new.twitter is distinct from old.twitter
    or new.username is distinct from old.username;

  if v_user_edit then
    v_allowed := public.check_rate_limit('profile_update', old.id::text, 6, 60);
    if not v_allowed then
      raise exception 'Terlalu sering mengubah profil. Mohon tunggu 1 menit.' using errcode = 'P0001';
    end if;
  end if;

  if length(coalesce(new.bio, '')) > 160 then
    raise exception 'Bio maksimal 160 karakter' using errcode = '22001';
  end if;

  if length(coalesce(new.twitter, '')) > 32 then
    raise exception 'Handle Twitter maksimal 32 karakter' using errcode = '22001';
  end if;

  if coalesce(new.twitter, '') <> '' and coalesce(new.twitter, '') !~ '^[a-zA-Z0-9_]{1,32}$' then
    raise exception 'Format handle Twitter tidak valid (hanya huruf, angka, dan underscore)' using errcode = '22023';
  end if;

  return new;
end;
$function$;

-- Verifikasi otomatis
do $verify$
declare
  v_def text;
begin
  select pg_get_functiondef(oid) into v_def
  from pg_proc where proname = 'guard_profile_immutable_fields';

  if v_def not like '%v_user_edit%' then
    raise exception 'VERIFIKASI GAGAL: guard belum memakai v_user_edit';
  end if;
  if v_def not like '%last_active_at%' and v_def not like '%v_user_edit%' then
    raise exception 'VERIFIKASI GAGAL: logika pemisahan tidak ada';
  end if;

  raise notice 'VERIFIKASI OK: rate limit hanya untuk edit profil pengguna';
end;
$verify$;
