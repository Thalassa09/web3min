-- ============================================================================
-- LANGKAH 0: Tutup eskalasi hak akses di tabel `profiles`
-- ============================================================================
-- BUG KRITIS (dibuktikan di produksi, dalam transaksi yang di-ROLLBACK):
--   user biasa `apollo_romanus` menjalankan
--     update profiles set is_admin = true where id = <dirinya>;
--     select is_admin();  -->  TRUE
--
-- Sebab: policy "own profile update" memberi UPDATE pada SELURUH kolom, dan
-- trigger guard_profile_immutable_fields hanya mengunci id/username/created_at.
-- Akibat: siapa pun bisa jadi admin → baca data semua user, ubah sensor, dan
-- (kalau fitur supporter ada) memberi dirinya supporter gratis.
--
-- PERBAIKAN 2 LAPIS (defense in depth):
--   Lapis 1 — hak kolom: cabut UPDATE tabel; beri hanya kolom yang memang
--             ditulis klien. Diverifikasi lewat grep: hanya `bio` & `twitter`.
--   Lapis 2 — trigger: `is_admin` & `account_type` tidak boleh berubah dari
--             klien, walau grant bocor lagi nanti.
--
-- CATATAN PENTING — kenapa `username` & `username_censored` TIDAK diblokir
-- di trigger: RPC `change_username` dan `admin_set_user_censorship` berjalan
-- sebagai SECURITY DEFINER dan memang menulis kedua kolom itu. Memblokirnya di
-- trigger akan merusak fitur ganti username dan fitur sensor admin. Keduanya
-- sudah dilindungi Lapis 1 (privilege kolom dicabut), jadi user tidak bisa
-- menulisnya langsung lewat PostgREST.
-- ============================================================================

-- ── Lapis 1: hak kolom ──────────────────────────────────────────────────────
revoke update on table public.profiles from anon, authenticated;
grant update (bio, twitter) on table public.profiles to authenticated;

-- Bersih-bersih hak sisa yang tidak pernah dipakai app (TRUNCATE/REFERENCES/
-- TRIGGER). Tidak bisa dieksploitasi lewat PostgREST, tapi tidak ada gunanya
-- dibiarkan terbuka.
do $$
declare
  t text;
begin
  foreach t in array array[
    'profiles','progress','completions','claimed_quests','ledger',
    'raffle_entries','raffle_winners','raffles','censorship_logs',
    'limited_items','user_limited_items','activity_log'
  ] loop
    execute format('revoke truncate, references, trigger on table public.%I from anon, authenticated', t);
  end loop;
end $$;

-- ── Lapis 2: trigger guard diperketat ───────────────────────────────────────
create or replace function public.guard_profile_immutable_fields()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $function$
declare
  v_allowed boolean;
  v_is_privileged boolean;
begin
  if new.id <> old.id then
    raise exception 'ID akun tidak dapat diubah' using errcode = '42501';
  end if;

  if new.created_at <> old.created_at then
    raise exception 'Timestamp created_at tidak dapat diubah' using errcode = '42501';
  end if;

  -- Pemanggil istimewa: admin, service_role, atau proses server.
  -- auth.uid() null = service role / migrasi / SQL langsung (tanpa JWT user).
  v_is_privileged :=
    auth.uid() is null
    or public.is_admin();

  if not v_is_privileged then
    if new.is_admin is distinct from old.is_admin then
      raise exception 'Kolom admin hanya dapat diubah server' using errcode = '42501';
    end if;

    if new.account_type is distinct from old.account_type then
      raise exception 'Tipe akun hanya dapat diubah server' using errcode = '42501';
    end if;
  end if;

  -- Rate limit profile updates (max 6 updates per minute)
  v_allowed := public.check_rate_limit('profile_update', old.id::text, 6, 60);
  if not v_allowed then
    raise exception 'Terlalu sering mengubah profil. Mohon tunggu 1 menit.' using errcode = 'P0001';
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

-- ── Tabel yang klien tidak boleh tulis sama sekali ──────────────────────────
-- RLS sudah aktif dengan policy SELECT saja (INSERT/UPDATE/DELETE sudah ditolak
-- RLS), tapi grant sisa default Supabase dicabut sebagai lapis kedua.
revoke insert, update, delete on table public.censorship_logs from anon, authenticated;
revoke insert, update, delete on table public.limited_items from anon, authenticated;
revoke insert, update, delete on table public.user_limited_items from anon, authenticated;
