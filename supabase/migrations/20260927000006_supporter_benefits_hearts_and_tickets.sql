-- ============================================================================
-- 20260927000006_supporter_benefits_hearts_and_tickets.sql
--
-- Dua benefit supporter yang dijanjikan di halaman /supporter:
--   1. Isi nyawa gratis 4×/hari (pengguna biasa 2×/hari).
--   2. Tiket undian bernilai 3× lipat (bayar 1, dapat 3).
--
-- Keduanya dihitung di DATABASE, bukan di klien — kalau di klien, siapa pun
-- bisa memalsukan kuota atau multiplier dari browser.
--
-- Basis: definisi `buy_tickets` yang sedang live diambil apa adanya lewat
-- pg_get_functiondef, lalu hanya ditambah multiplier. Logika lama (rate limit,
-- batas saldo, ledger, activity log) TIDAK diubah.
-- ============================================================================

-- ── 1. Kolom kuota isi nyawa gratis di progress ─────────────────────────────
alter table public.progress
  add column if not exists free_refill_date date,
  add column if not exists free_refill_count integer not null default 0;

comment on column public.progress.free_refill_date is
  'Tanggal (Asia/Jakarta) pemakaian kuota isi nyawa gratis terakhir. Ganti hari = kuota reset.';
comment on column public.progress.free_refill_count is
  'Berapa kali kuota isi nyawa gratis sudah dipakai pada free_refill_date.';

-- ── 2. Helper: apakah pemanggil supporter AKTIF (kedaluwarsa = false) ───────
create or replace function public.is_active_supporter(p_user_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public, pg_temp
as $function$
  select coalesce(
    (select p.is_supporter
            and (p.supporter_expires_at is null or p.supporter_expires_at > now())
     from public.profiles p where p.id = p_user_id),
    false
  );
$function$;

revoke execute on function public.is_active_supporter(uuid) from public, anon;
grant execute on function public.is_active_supporter(uuid) to authenticated;

-- ── 3. Kuota isi nyawa gratis: 2× biasa, 4× supporter ──────────────────────
create or replace function public.get_free_refill_quota()
returns jsonb
language plpgsql
stable
security definer
set search_path = public, pg_temp
as $function$
declare
  v_uid uuid := auth.uid();
  v_today date := (now() at time zone 'Asia/Jakarta')::date;
  v_is_sup boolean;
  v_limit int;
  v_used int;
  v_date date;
  v_hearts int;
begin
  if v_uid is null then
    return jsonb_build_object('authenticated', false, 'used', 0, 'limit', 2, 'remaining', 0);
  end if;

  v_is_sup := public.is_active_supporter(v_uid);
  v_limit := case when v_is_sup then 4 else 2 end;

  select free_refill_date, free_refill_count, hearts
    into v_date, v_used, v_hearts
  from public.progress where user_id = v_uid;

  -- Hari berganti -> kuota dianggap penuh lagi (tanpa perlu update di sini,
  -- karena fungsi ini `stable`).
  if v_date is distinct from v_today then
    v_used := 0;
  end if;

  v_used := coalesce(v_used, 0);

  return jsonb_build_object(
    'authenticated', true,
    'used', v_used,
    'limit', v_limit,
    'remaining', greatest(0, v_limit - v_used),
    'hearts', coalesce(v_hearts, 5),
    'is_supporter', v_is_sup,
    'reset_at', ((v_today + 1)::timestamp at time zone 'Asia/Jakarta')
  );
end;
$function$;

revoke execute on function public.get_free_refill_quota() from public, anon;
grant execute on function public.get_free_refill_quota() to authenticated;

create or replace function public.refill_hearts_free()
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $function$
declare
  v_uid uuid := auth.uid();
  v_now timestamptz := now();
  v_today date := (v_now at time zone 'Asia/Jakarta')::date;
  v_is_sup boolean;
  v_limit int;
  v_used int;
  v_date date;
  v_hearts int;
begin
  if v_uid is null then
    raise exception 'Not authenticated' using errcode = '42501';
  end if;

  v_is_sup := public.is_active_supporter(v_uid);
  v_limit := case when v_is_sup then 4 else 2 end;

  perform public.sync_user_progress(v_uid);

  select free_refill_date, free_refill_count, hearts
    into v_date, v_used, v_hearts
  from public.progress where user_id = v_uid for update;

  if v_date is distinct from v_today then
    v_used := 0;
  end if;
  v_used := coalesce(v_used, 0);

  if coalesce(v_hearts, 5) >= 5 then
    raise exception 'Nyawamu sudah penuh' using errcode = 'P0001';
  end if;

  if v_used >= v_limit then
    if v_is_sup then
      raise exception 'Kuota isi nyawa gratis hari ini sudah habis (4× untuk supporter). Besok bisa lagi.'
        using errcode = 'P0001';
    else
      raise exception 'Kuota isi nyawa gratis hari ini sudah habis (2× sehari). Jadi Supporter untuk 4× sehari.'
        using errcode = 'P0001';
    end if;
  end if;

  update public.progress
  set hearts = 5,
      hearts_updated_at = v_now,
      free_refill_date = v_today,
      free_refill_count = v_used + 1,
      updated_at = v_now
  where user_id = v_uid and hearts < 5;

  if not found then
    raise exception 'Nyawamu sudah penuh' using errcode = 'P0001';
  end if;

  insert into public.ledger (user_id, kind, gems_delta, tickets_delta, ref)
  values (v_uid, 'refill_hearts_free', 0, 0, 'free_daily');

  perform public.log_activity(
    'refill_hearts_free',
    'free_daily',
    jsonb_build_object('used', v_used + 1, 'limit', v_limit, 'is_supporter', v_is_sup)
  );

  return jsonb_build_object(
    'success', true,
    'used', v_used + 1,
    'limit', v_limit,
    'remaining', greatest(0, v_limit - (v_used + 1))
  );
end;
$function$;

revoke execute on function public.refill_hearts_free() from public, anon;
grant execute on function public.refill_hearts_free() to authenticated;

-- ── 4. Tiket undian ×3 untuk supporter ──────────────────────────────────────
-- Definisi lama dipertahankan PERSIS (rate limit, harga 10 koin/tiket, batas
-- 9999, ledger, activity log). Yang berubah hanya jumlah tiket yang diterima.
create or replace function public.buy_tickets(p_count integer)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $function$
declare
  v_uid uuid := auth.uid();
  v_unit_cost int := 10;
  v_total_cost int;
  v_now timestamptz := now();
  v_allowed boolean;
  v_is_sup boolean;
  v_mult int;
  v_grant int;
begin
  if v_uid is null then raise exception 'Not authenticated' using errcode = '42501'; end if;

  v_allowed := public.check_rate_limit('shop_buy', v_uid::text, 15, 60);
  if not v_allowed then
    raise exception 'Terlalu banyak transaksi belanja. Mohon tunggu 1 menit.' using errcode = 'P0001';
  end if;

  if p_count <= 0 or p_count > 100 then raise exception 'Jumlah tiket harus antara 1 dan 100' using errcode = '22023'; end if;
  perform public.sync_user_progress(v_uid);

  -- Supporter dapat 3 tiket untuk setiap tiket yang dibeli. HARGA TIDAK NAIK.
  v_is_sup := public.is_active_supporter(v_uid);
  v_mult := case when v_is_sup then 3 else 1 end;
  v_grant := p_count * v_mult;

  v_total_cost := p_count * v_unit_cost;

  update public.progress
  set gems = gems - v_total_cost, raffle_tickets = raffle_tickets + v_grant, updated_at = v_now
  where user_id = v_uid and gems >= v_total_cost and (raffle_tickets + v_grant) <= 9999;

  if not found then
    raise exception 'Transaksi gagal: saldo bintang tidak cukup atau batas tiket tercapai' using errcode = 'P0001';
  end if;

  insert into public.ledger (user_id, kind, gems_delta, tickets_delta, ref)
  values (v_uid, 'buy_tickets', -v_total_cost, v_grant, 'ticket_purchase');

  perform public.log_activity(
    'buy_tickets',
    'ticket_purchase',
    jsonb_build_object(
      'tickets_bought', p_count,
      'tickets_granted', v_grant,
      'multiplier', v_mult,
      'is_supporter', v_is_sup,
      'cost', v_total_cost
    )
  );

  return jsonb_build_object(
    'success', true,
    'tickets_bought', p_count,
    'tickets_granted', v_grant,
    'multiplier', v_mult,
    'cost', v_total_cost
  );
end;
$function$;

-- ── 5. Verifikasi otomatis ──────────────────────────────────────────────────
do $verify$
declare
  v_kolom int;
  v_fns int;
begin
  select count(*) into v_kolom
  from information_schema.columns
  where table_schema = 'public' and table_name = 'progress'
    and column_name in ('free_refill_date', 'free_refill_count');

  select count(*) into v_fns
  from pg_proc p join pg_namespace n on n.oid = p.pronamespace
  where n.nspname = 'public'
    and p.proname in ('refill_hearts_free', 'get_free_refill_quota', 'is_active_supporter');

  if v_kolom <> 2 then
    raise exception 'VERIFIKASI GAGAL: kolom kuota = % (harus 2)', v_kolom;
  end if;
  if v_fns <> 3 then
    raise exception 'VERIFIKASI GAGAL: fungsi benefit = % (harus 3)', v_fns;
  end if;

  raise notice 'VERIFIKASI OK: 2 kolom, 3 fungsi benefit supporter';
end;
$verify$;
