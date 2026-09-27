-- ============================================================================
-- 20260927000004_supporter_schema_status_and_admin_grant.sql
--
-- RENCANA-SUPPORTER.md Langkah 1 + 2 + 6b (fondasi, TANPA kredensial GatePay).
--
-- Kenapa 6b ikut sekarang: kalau halaman jualan dibuka tanpa jalur aktivasi
-- manual, ada risiko user sudah bayar tapi supporter tidak aktif (deteksi
-- GatePay bisa gagal). Jaring aman itu wajib ada SEBELUM uang masuk.
--
-- CATATAN SKEMA (diverifikasi lewat information_schema, bukan asumsi):
--   - `profiles` belum punya kolom supporter sama sekali (0 kolom).
--   - `authenticated` hanya punya SELECT di `profiles` + UPDATE(bio, twitter).
--     Jadi kolom supporter baru otomatis tidak bisa ditulis klien. Trigger
--     lapis-2 di bawah tetap dipasang sebagai pertahanan berlapis kalau suatu
--     saat grant berubah (pola sama dengan is_admin/account_type).
--   - Trigger lama `guard_profile_immutable_fields` TIDAK disentuh. Kita pakai
--     trigger TERPISAH supaya nol risiko merusak guard yang sudah terbukti.
-- ============================================================================

-- ---------------------------------------------------------------------------
-- 1. Kolom supporter di profiles
--    supporter_expires_at NULL = selamanya (mendukung lifetime & bulanan).
-- ---------------------------------------------------------------------------
alter table public.profiles
  add column if not exists is_supporter boolean not null default false;

alter table public.profiles
  add column if not exists supporter_since timestamptz;

alter table public.profiles
  add column if not exists supporter_expires_at timestamptz;

comment on column public.profiles.supporter_expires_at is
  'NULL = supporter selamanya (lifetime). Tanggal = aktif sampai tanggal itu.';

-- ---------------------------------------------------------------------------
-- 2. Lapis 2: trigger penjaga kolom supporter
--    Trigger terpisah dari guard_profile_immutable_fields supaya guard lama
--    (yang sudah terbukti) tidak perlu ditulis ulang — nol risiko regresi.
-- ---------------------------------------------------------------------------
create or replace function public.guard_supporter_fields()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $function$
declare
  v_is_privileged boolean;
begin
  -- auth.uid() null = service_role / migrasi / SQL langsung (jalur sah).
  v_is_privileged := auth.uid() is null or public.is_admin();

  if not v_is_privileged then
    if new.is_supporter is distinct from old.is_supporter
       or new.supporter_since is distinct from old.supporter_since
       or new.supporter_expires_at is distinct from old.supporter_expires_at then
      raise exception 'Status supporter hanya dapat diubah server'
        using errcode = '42501';
    end if;
  end if;

  return new;
end;
$function$;

drop trigger if exists on_profile_supporter_guard on public.profiles;
create trigger on_profile_supporter_guard
  before update on public.profiles
  for each row
  execute function public.guard_supporter_fields();

-- ---------------------------------------------------------------------------
-- 3. Tabel order pembayaran
--    RLS: user hanya baca order SENDIRI. Nol policy insert/update —
--    satu-satunya penulis adalah service_role (webhook, Langkah 6).
-- ---------------------------------------------------------------------------
create table if not exists public.supporter_orders (
  order_id        text primary key,                    -- id dari GatePay
  user_id         uuid not null references auth.users(id) on delete cascade,
  reference       text not null unique,                -- referensi internal (W3M-xxxx)
  base_amount     integer not null check (base_amount > 0),
  unique_amount   integer not null check (unique_amount > 0),
  supporter_days  integer,                             -- NULL = lifetime
  status          text not null default 'pending'
                    check (status in ('pending','paid','expired','cancelled')),
  created_at      timestamptz not null default now(),
  paid_at         timestamptz,
  raw             jsonb not null default '{}'::jsonb
);

comment on column public.supporter_orders.supporter_days is
  'Durasi supporter yang dibeli (hari). NULL = lifetime. Dipakai webhook untuk mengisi supporter_expires_at.';

create index if not exists supporter_orders_user_idx
  on public.supporter_orders (user_id, created_at desc);
create index if not exists supporter_orders_status_idx
  on public.supporter_orders (status, created_at desc);

alter table public.supporter_orders enable row level security;

drop policy if exists "own orders read" on public.supporter_orders;
create policy "own orders read" on public.supporter_orders
  for select using (auth.uid() = user_id);

-- Defense in depth: cabut semua hak tulis dari klien (RLS saja tidak cukup).
revoke insert, update, delete, truncate, references, trigger
  on public.supporter_orders from anon, authenticated;

-- ---------------------------------------------------------------------------
-- 4. Langkah 2 — RPC status supporter untuk klien
--    Server tetap sumber kebenaran; badge TIDAK diambil dari localStorage.
--
--    Status efektif dihitung di sini: supporter yang sudah lewat tanggal
--    dianggap TIDAK aktif, tanpa perlu cron penonaktifan.
-- ---------------------------------------------------------------------------
create or replace function public.get_my_supporter_status()
returns jsonb
language plpgsql
stable
security definer
set search_path = public, pg_temp
as $function$
declare
  v_uid uuid := auth.uid();
  v_is boolean;
  v_since timestamptz;
  v_expires timestamptz;
  v_active boolean;
begin
  if v_uid is null then
    return jsonb_build_object(
      'is_supporter', false,
      'is_lifetime', false,
      'since', null,
      'expires_at', null
    );
  end if;

  select p.is_supporter, p.supporter_since, p.supporter_expires_at
    into v_is, v_since, v_expires
  from public.profiles p
  where p.id = v_uid;

  v_is := coalesce(v_is, false);
  -- Kedaluwarsa = tidak aktif, walau kolomnya masih true.
  v_active := v_is and (v_expires is null or v_expires > now());

  return jsonb_build_object(
    'is_supporter', v_active,
    'is_lifetime', v_active and v_expires is null,
    'since', case when v_active then v_since else null end,
    'expires_at', case when v_active then v_expires else null end
  );
end;
$function$;

revoke execute on function public.get_my_supporter_status()
  from public, anon;
grant execute on function public.get_my_supporter_status()
  to authenticated;

-- ---------------------------------------------------------------------------
-- 5. Langkah 6b — admin aktifkan supporter manual (jaring aman)
--    p_days NULL = lifetime. Kalau user masih aktif, masa aktif DIPERPANJANG
--    dari tanggal berakhir yang ada (bukan dari hari ini) supaya tidak hangus.
-- ---------------------------------------------------------------------------
create or replace function public.admin_grant_supporter(
  p_key text,
  p_username text,
  p_days integer default 30
)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $function$
declare
  v_uid uuid;
  v_old_expires timestamptz;
  v_was_supporter boolean;
  v_new_expires timestamptz;
  v_now timestamptz := now();
begin
  if not (public.is_admin() or public.admin_verify_key(p_key)) then
    raise exception 'Unauthorized: Invalid admin key' using errcode = '42501';
  end if;

  if p_username is null or length(btrim(p_username)) = 0 then
    raise exception 'Username wajib diisi' using errcode = '22023';
  end if;

  if p_days is not null and p_days <= 0 then
    raise exception 'Jumlah hari harus lebih dari 0' using errcode = '22023';
  end if;

  select p.id, p.supporter_expires_at,
         coalesce(p.is_supporter, false)
           and (p.supporter_expires_at is null or p.supporter_expires_at > v_now)
    into v_uid, v_old_expires, v_was_supporter
  from public.profiles p
  where p.username = btrim(p_username);

  if v_uid is null then
    raise exception 'User tidak ditemukan: %', p_username using errcode = 'P0002';
  end if;

  if p_days is null then
    -- Lifetime: tanggal NULL.
    v_new_expires := null;
  elsif v_was_supporter and v_old_expires is not null then
    -- Perpanjangan: mulai dari tanggal berakhir yang ada.
    v_new_expires := v_old_expires + make_interval(days => p_days);
  else
    -- Baru / sudah lewat: mulai dari sekarang.
    v_new_expires := v_now + make_interval(days => p_days);
  end if;

  update public.profiles
  set is_supporter = true,
      supporter_since = coalesce(supporter_since, v_now),
      supporter_expires_at = v_new_expires,
      updated_at = v_now
  where id = v_uid;

  insert into public.activity_log (user_id, event, ref_id, meta)
  values (
    v_uid,
    'supporter_granted',
    null,
    jsonb_build_object(
      'days', p_days,
      'lifetime', p_days is null,
      'expires_at', v_new_expires,
      'by', 'admin'
    )
  );

  return jsonb_build_object(
    'success', true,
    'username', btrim(p_username),
    'is_lifetime', p_days is null,
    'expires_at', v_new_expires,
    'was_already_supporter', v_was_supporter
  );
end;
$function$;

revoke execute on function public.admin_grant_supporter(text, text, integer)
  from public, anon;
grant execute on function public.admin_grant_supporter(text, text, integer)
  to authenticated;

-- ---------------------------------------------------------------------------
-- 6. Verifikasi (dijalankan otomatis saat migrasi diterapkan)
-- ---------------------------------------------------------------------------
do $verify$
declare
  v_kolom int;
  v_tabel int;
  v_policy int;
  v_trigger int;
begin
  select count(*) into v_kolom
  from information_schema.columns
  where table_schema = 'public' and table_name = 'profiles'
    and column_name in ('is_supporter','supporter_since','supporter_expires_at');

  select count(*) into v_tabel
  from information_schema.tables
  where table_schema = 'public' and table_name = 'supporter_orders';

  select count(*) into v_policy
  from pg_policies
  where schemaname = 'public' and tablename = 'supporter_orders';

  select count(*) into v_trigger
  from pg_trigger t
  join pg_class c on c.oid = t.tgrelid
  where c.relname = 'profiles' and t.tgname = 'on_profile_supporter_guard'
    and not t.tgisinternal;

  if v_kolom <> 3 then
    raise exception 'VERIFIKASI GAGAL: kolom supporter = % (harus 3)', v_kolom;
  end if;
  if v_tabel <> 1 then
    raise exception 'VERIFIKASI GAGAL: tabel supporter_orders tidak ada';
  end if;
  if v_policy <> 1 then
    raise exception 'VERIFIKASI GAGAL: policy supporter_orders = % (harus 1, select-saja)', v_policy;
  end if;
  if v_trigger <> 1 then
    raise exception 'VERIFIKASI GAGAL: trigger on_profile_supporter_guard tidak ada';
  end if;

  raise notice 'VERIFIKASI OK: 3 kolom, 1 tabel, 1 policy (select), 1 trigger';
end;
$verify$;
