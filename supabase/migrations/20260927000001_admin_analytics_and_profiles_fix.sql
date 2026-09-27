-- ============================================================================
-- 20260927000001_admin_analytics_and_profiles_fix.sql
--
-- Langkah 1-2 (permintaan Thalassa): role admin + tabel activity log terpusat,
-- plus RPC statistik untuk dashboard /admin.
--
-- Sekaligus memperbaiki DUA BUG PRODUKSI yang ditemukan saat recon (dibuktikan
-- empiris, bukan dugaan):
--   (a) `profiles.updated_at` TIDAK PERNAH ADA di skema, tapi ditulis oleh
--       `enter_raffle` dan `admin_set_user_censorship` -> keduanya gagal
--       `ERROR 42703 column "updated_at" does not exist`. Dampak: fitur undian
--       100% mati (raffle_entries = 0 baris) dan tombol sensor admin tidak
--       pernah bekerja.
--   (b) `activity_log` belum ada sehingga DAU/WAU/MAU tidak bisa dihitung.
--
-- Catatan skema nyata (diverifikasi via information_schema, bukan asumsi):
--   profiles: id, username, twitter, bio, created_at, discord,
--             last_wallet_address, username_censored, account_type
--   progress: xp, gems, hearts, streak, xp_today, weekly_xp, lessons_today, ...
--   raffle_entries: id, raffle_id, user_id, tickets, entered_at, x, wallet
--   ledger(kind): lesson_complete | story_complete | case_complete |
--                 quest_claim | buy_tickets | buy_freeze | refill_hearts |
--                 enter_raffle | claim_leaderboard
--
-- Idempoten: aman dijalankan berulang.
-- ============================================================================

-- ---------------------------------------------------------------------------
-- 0. FIX BUG: kolom yang sudah lama ditulis tapi tidak pernah dibuat
-- ---------------------------------------------------------------------------
alter table public.profiles add column if not exists updated_at timestamptz not null default now();
alter table public.profiles add column if not exists is_admin boolean not null default false;
alter table public.profiles add column if not exists last_active_at timestamptz;

-- ---------------------------------------------------------------------------
-- 1. Helper: is_admin() — dipakai semua RPC statistik
--    security definer supaya bisa dibaca walau RLS profiles ketat.
-- ---------------------------------------------------------------------------
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select coalesce((select p.is_admin from public.profiles p where p.id = auth.uid()), false)
$$;

revoke execute on function public.is_admin() from public, anon;
grant execute on function public.is_admin() to authenticated;

-- ---------------------------------------------------------------------------
-- 2. Tabel activity_log + RLS (insert HANYA lewat fungsi security definer)
-- ---------------------------------------------------------------------------
create table if not exists public.activity_log (
  id bigserial primary key,
  user_id uuid references auth.users(id) on delete cascade,
  event text not null,
  ref_id text,
  meta jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists al_created_idx on public.activity_log (created_at desc);
create index if not exists al_event_idx   on public.activity_log (event, created_at desc);
create index if not exists al_user_idx    on public.activity_log (user_id, created_at desc);
create index if not exists al_event_day_idx on public.activity_log (((created_at at time zone 'Asia/Jakarta')::date), event);

alter table public.activity_log enable row level security;

drop policy if exists "admin can read" on public.activity_log;
create policy "admin can read" on public.activity_log
  for select using (public.is_admin());

-- Nol policy insert/update/delete: satu-satunya jalan masuk adalah log_activity().
revoke all on public.activity_log from anon, authenticated;

-- ---------------------------------------------------------------------------
-- 3. log_activity() — dipanggil di dalam RPC ekonomi (bukan dari klien)
-- ---------------------------------------------------------------------------
create or replace function public.log_activity(
  p_event text,
  p_ref text default null,
  p_meta jsonb default '{}'::jsonb
)
returns void
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  insert into public.activity_log (user_id, event, ref_id, meta)
  values (auth.uid(), p_event, p_ref, coalesce(p_meta, '{}'::jsonb));

  if auth.uid() is not null then
    update public.profiles set last_active_at = now() where id = auth.uid();
  end if;
end;
$$;

-- Nol grant: hanya boleh dipanggil dari fungsi security definer lain.
revoke execute on function public.log_activity(text, text, jsonb) from public, anon, authenticated;

-- ---------------------------------------------------------------------------
-- 4. Trigger signup + backfill riwayat lama dari profiles.created_at
-- ---------------------------------------------------------------------------
create or replace function public.trg_log_signup()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  insert into public.activity_log (user_id, event, ref_id, meta, created_at)
  values (new.id, 'signup', null, '{}'::jsonb, new.created_at);
  return new;
end;
$$;

drop trigger if exists on_profile_created on public.profiles;
create trigger on_profile_created
  after insert on public.profiles
  for each row execute function public.trg_log_signup();

-- Backfill idempoten: event 'signup' ditulis dengan created_at ASLI user.
insert into public.activity_log (user_id, event, meta, created_at)
select p.id, 'signup', jsonb_build_object('backfill', true), p.created_at
from public.profiles p
where not exists (
  select 1 from public.activity_log a where a.user_id = p.id and a.event = 'signup'
);

-- Backfill riwayat penyelesaian yang SUDAH tersimpan (completions) supaya funnel
-- tidak kosong sejak hari pertama. Idempoten lewat pasangan (user_id, event, ref_id).
insert into public.activity_log (user_id, event, ref_id, meta, created_at)
select c.user_id,
       case
         when c.lesson_id like 'story:%' then 'story_complete'
         when c.lesson_id like 'case:%'  then 'case_complete'
         else 'lesson_complete'
       end,
       c.lesson_id,
       jsonb_build_object('backfill', true, 'perfect', c.perfect),
       c.completed_at
from public.completions c
where not exists (
  select 1 from public.activity_log a
  where a.user_id = c.user_id
    and a.ref_id = c.lesson_id
    and a.event in ('lesson_complete', 'story_complete', 'case_complete')
);

-- ---------------------------------------------------------------------------
-- 5. Suntik log_activity() ke SETIAP RPC ekonomi yang sudah ada.
--    Berbasis teks asli fungsi live (pg_get_functiondef), hanya menyisipkan
--    satu baris `perform` sebelum `return`, jadi logika ekonomi tidak berubah.
-- ---------------------------------------------------------------------------
do $inject$
declare
  spec record;
  v_def text;
  v_needle text;
  v_idx int;
begin
  for spec in
    select * from (values
      ('complete_lesson',
       E'  return jsonb_build_object(\n    ''xp'', v_xp_gain,',
       E'  perform public.log_activity(\n    ''lesson_complete'',\n    p_lesson_id,\n    jsonb_build_object(\n      ''perfect'', coalesce(p_perfect, false),\n      ''replay'', v_already,\n      ''xp'', v_xp_gain,\n      ''gems'', v_gems_gain,\n      ''tickets'', v_tickets_gain\n    )\n  );\n\n'),
      ('complete_story',
       E'  return jsonb_build_object(''xp'', v_xp_gain,',
       E'  perform public.log_activity(\n    ''story_complete'',\n    p_story_id,\n    jsonb_build_object(\n      ''replay'', v_already,\n      ''xp'', v_xp_gain,\n      ''gems'', v_gems_gain\n    )\n  );\n\n'),
      ('complete_case',
       E'  return jsonb_build_object(\n    ''success'', true,',
       E'  perform public.log_activity(\n    ''case_complete'',\n    p_case_id,\n    jsonb_build_object(\n      ''replay'', v_already,\n      ''xp'', v_xp_gain,\n      ''gems'', v_gems_gain\n    )\n  );\n\n'),
      ('claim_quest',
       E'  return jsonb_build_object(''quest_id'', v_canonical_id,',
       E'  perform public.log_activity(\n    ''quest_claim'',\n    v_canonical_id,\n    jsonb_build_object(\n      ''gems'', v_reward_gems,\n      ''day'', v_today\n    )\n  );\n\n'),
      ('buy_tickets',
       E'  return jsonb_build_object(''success'', true, ''tickets_bought'', p_count,',
       E'  perform public.log_activity(\n    ''buy_tickets'',\n    ''ticket_purchase'',\n    jsonb_build_object(''tickets'', p_count, ''cost'', v_total_cost)\n  );\n\n'),
      ('buy_freeze',
       E'  return jsonb_build_object(''success'', true, ''cost'', v_cost);',
       E'  perform public.log_activity(\n    ''buy_freeze'',\n    ''streak_freeze'',\n    jsonb_build_object(''cost'', v_cost)\n  );\n\n'),
      ('refill_hearts',
       E'  return jsonb_build_object(''success'', true, ''cost'', v_cost);',
       E'  perform public.log_activity(\n    ''refill_hearts'',\n    ''hearts_refill'',\n    jsonb_build_object(''cost'', v_cost)\n  );\n\n'),
      ('enter_raffle',
       E'  return jsonb_build_object(\n    ''success'', true, \n    ''raffle_id'', p_raffle_id, ',
       E'  perform public.log_activity(\n    ''raffle_enter'',\n    p_raffle_id,\n    jsonb_build_object(\n      ''tickets'', p_tickets,\n      ''total_tickets'', v_user_tickets,\n      ''wallet'', v_clean_wallet <> ''''\n    )\n  );\n\n')
    ) as t(fn, needle, inject)
  loop
    -- enter_raffle hidup punya trailing space di baris ''raffle_id'', jadi
    -- dicocokkan tanpa spasi itu dan tidak bergantung pada formatting.
    if spec.fn = 'enter_raffle' then
      v_needle := E'  return jsonb_build_object(\n    ''success'', true,';
    else
      v_needle := spec.needle;
    end if;

    select pg_get_functiondef(p.oid) into v_def
    from pg_proc p
    join pg_namespace n on n.oid = p.pronamespace
    where n.nspname = 'public' and p.proname = spec.fn;

    if v_def is null then
      raise notice '[admin-analytics] LEWAT: fungsi % tidak ada', spec.fn;
      continue;
    end if;

    -- Sudah pernah disuntik? jangan gandakan.
    if position('public.log_activity' in v_def) > 0 then
      raise notice '[admin-analytics] SKIP (sudah ada log): %', spec.fn;
      continue;
    end if;

    v_idx := position(v_needle in v_def);
    if v_idx = 0 then
      raise exception '[admin-analytics] GAGAL: penanda return tidak ditemukan di %()', spec.fn;
    end if;

    -- `for 0` WAJIB: tanpa itu overlay MENGHAPUS sepanjang teks sisipan.
    v_def := overlay(v_def placing spec.inject from v_idx for 0);
    execute v_def;
    raise notice '[admin-analytics] OK: log disuntik ke %()', spec.fn;
  end loop;
end
$inject$;

-- ---------------------------------------------------------------------------
-- 6. RPC statistik dashboard (semua gate is_admin(), bukan p_key)
-- ---------------------------------------------------------------------------
create or replace function public.admin_overview()
returns jsonb
language plpgsql
stable
security definer
set search_path = public, pg_temp
as $$
declare
  v_today timestamptz := (date_trunc('day', now() at time zone 'Asia/Jakarta') at time zone 'Asia/Jakarta');
begin
  if not public.is_admin() then
    raise exception 'forbidden' using errcode = '42501';
  end if;

  return jsonb_build_object(
    'total_users', (select count(*) from public.profiles where account_type = 'user' and username not like 'sectest%' and username not like 'testuser%'),
    'new_today', (select count(*) from public.profiles where account_type = 'user' and created_at >= v_today and username not like 'sectest%' and username not like 'testuser%'),
    'dau', (select count(distinct user_id) from public.activity_log where created_at >= now() - interval '1 day'),
    'wau', (select count(distinct user_id) from public.activity_log where created_at >= now() - interval '7 days'),
    'mau', (select count(distinct user_id) from public.activity_log where created_at >= now() - interval '30 days'),
    'lessons_today', (select count(*) from public.activity_log where event = 'lesson_complete' and created_at >= v_today),
    'raffle_entries_today', (select count(*) from public.activity_log where event = 'raffle_enter' and created_at >= v_today),
    'log_since', (select min(created_at) from public.activity_log)
  );
end;
$$;

create or replace function public.admin_daily_series(p_days int default 30)
returns table (day date, signups bigint, active_users bigint, lessons bigint)
language plpgsql
stable
security definer
set search_path = public, pg_temp
as $$
declare
  v_days int := greatest(1, least(coalesce(p_days, 30), 365));
begin
  if not public.is_admin() then
    raise exception 'forbidden' using errcode = '42501';
  end if;

  return query
  with d as (
    select generate_series(
      (now() at time zone 'Asia/Jakarta')::date - (v_days - 1),
      (now() at time zone 'Asia/Jakarta')::date,
      interval '1 day'
    )::date as day
  ), a as (
    select (created_at at time zone 'Asia/Jakarta')::date as day, event, user_id
    from public.activity_log
    where created_at >= now() - make_interval(days => v_days)
  )
  select d.day,
         count(*) filter (where a.event = 'signup') as signups,
         count(distinct a.user_id) as active_users,
         count(*) filter (where a.event = 'lesson_complete') as lessons
  from d
  left join a on a.day = d.day
  group by d.day
  order by d.day;
end;
$$;

create or replace function public.admin_lesson_funnel()
returns table (lesson_id text, users bigint)
language plpgsql
stable
security definer
set search_path = public, pg_temp
as $$
begin
  if not public.is_admin() then
    raise exception 'forbidden' using errcode = '42501';
  end if;

  return query
  select a.ref_id, count(distinct a.user_id)
  from public.activity_log a
  where a.event = 'lesson_complete' and a.ref_id is not null
  group by a.ref_id
  order by a.ref_id;
end;
$$;

create or replace function public.admin_recent_activity(p_limit int default 50)
returns table (created_at timestamptz, username text, event text, ref_id text, meta jsonb)
language plpgsql
stable
security definer
set search_path = public, pg_temp
as $$
declare
  v_limit int := greatest(1, least(coalesce(p_limit, 50), 500));
begin
  if not public.is_admin() then
    raise exception 'forbidden' using errcode = '42501';
  end if;

  return query
  select l.created_at, p.username, l.event, l.ref_id, l.meta
  from public.activity_log l
  left join public.profiles p on p.id = l.user_id
  order by l.created_at desc
  limit v_limit;
end;
$$;

-- Halaman /admin boleh dibuka siapa pun; DATANYA tidak. Gate ada di dalam RPC.
revoke execute on function public.admin_overview() from public, anon;
revoke execute on function public.admin_daily_series(int) from public, anon;
revoke execute on function public.admin_lesson_funnel() from public, anon;
revoke execute on function public.admin_recent_activity(int) from public, anon;

grant execute on function public.admin_overview() to authenticated;
grant execute on function public.admin_daily_series(int) to authenticated;
grant execute on function public.admin_lesson_funnel() to authenticated;
grant execute on function public.admin_recent_activity(int) to authenticated;

-- ---------------------------------------------------------------------------
-- 7. Ambang admin: p_key hardcoded DIBUANG (bocor di repo publik).
--    p_key hanya diterima sebagai kompatibilitas transisi bila sama dengan
--    nilai rahasia yang dipasang manual di Vault; selebihnya wajib is_admin().
-- ---------------------------------------------------------------------------
create or replace function public.admin_verify_key(p_key text)
returns boolean
language plpgsql
stable
security definer
set search_path = public, pg_temp
as $$
declare
  v_vault text;
begin
  if public.is_admin() then
    return true;
  end if;

  -- Opsional: isi manual di Vault untuk kompatibilitas kunci lama.
  begin
    select decrypted_secret into v_vault
    from vault.decrypted_secrets
    where name = 'web3min_admin_key'
    limit 1;
  exception when others then
    v_vault := null;
  end;

  if v_vault is null or v_vault = '' then
    return false;
  end if;

  return p_key is not null and p_key = v_vault;
end;
$$;
