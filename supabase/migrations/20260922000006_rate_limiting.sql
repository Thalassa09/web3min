-- Migration 20260922000006_rate_limiting.sql
-- Multi-tier Database Rate Limiter for all RPCs, profile updates, and username availability probes.

-- 1. Create table for tracking rate limit windows
create table if not exists public.rate_limits (
  key text primary key,
  count int not null default 1,
  reset_at timestamptz not null
);

-- Enable RLS and revoke client access (Only internal SECURITY DEFINER functions can touch this)
alter table public.rate_limits enable row level security;
revoke all on public.rate_limits from anon, authenticated;

-- Helper to safely extract client IP in PostgREST / Supabase
create or replace function public.get_client_ip()
returns text
language plpgsql
stable
set search_path = public, pg_temp
as $$
declare
  v_headers text;
begin
  v_headers := current_setting('request.headers', true);
  if v_headers is not null and v_headers <> '' then
    return coalesce(
      nullif(v_headers::json->>'cf-connecting-ip', ''),
      nullif(split_part(v_headers::json->>'x-forwarded-for', ',', 1), ''),
      'unknown'
    );
  end if;
  return 'internal';
exception when others then
  return 'unknown';
end;
$$;

-- Atomic token/counter rate limiter
create or replace function public.check_rate_limit(
  p_action text,
  p_identifier text,
  p_max_requests int,
  p_window_seconds int
)
returns boolean
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_key text := p_action || ':' || coalesce(nullif(trim(p_identifier), ''), 'anonymous');
  v_now timestamptz := now();
  v_count int;
  v_reset timestamptz;
begin
  -- Probabilistic cleanup of expired windows (approx 5% of executions)
  if random() < 0.05 then
    delete from public.rate_limits where reset_at < v_now;
  end if;

  select count, reset_at into v_count, v_reset
  from public.rate_limits
  where key = v_key
  for update;

  if not found or v_reset <= v_now then
    insert into public.rate_limits (key, count, reset_at)
    values (v_key, 1, v_now + (p_window_seconds || ' seconds')::interval)
    on conflict (key) do update
    set count = 1,
        reset_at = v_now + (p_window_seconds || ' seconds')::interval;
    return true;
  end if;

  if v_count >= p_max_requests then
    return false;
  end if;

  update public.rate_limits
  set count = count + 1
  where key = v_key;

  return true;
end;
$$;

-- 2. Hook Rate Limiting into username_available (Max 30 checks/min)
create or replace function public.username_available(p_username text)
returns boolean
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_name text;
  v_ident text;
  v_allowed boolean;
begin
  v_ident := coalesce(auth.uid()::text, public.get_client_ip());
  v_allowed := public.check_rate_limit('username_check', v_ident, 30, 60);
  if not v_allowed then
    raise exception 'Terlalu banyak permintaan pengecekan username. Mohon tunggu 1 menit.' using errcode = 'P0001';
  end if;

  v_name := public.normalize_username(p_username);
  if v_name is null or length(v_name) < 3 then
    return false;
  end if;
  return not exists (select 1 from public.profiles where username = v_name);
end;
$$;

-- 3. Hook Rate Limiting into profile update trigger (Max 6 updates/min per user)
create or replace function public.guard_profile_immutable_fields()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_allowed boolean;
begin
  if new.id <> old.id then
    raise exception 'ID akun tidak dapat diubah' using errcode = '42501';
  end if;

  if new.username <> old.username then
    raise exception 'Username tidak dapat diubah setelah pendaftaran' using errcode = '42501';
  end if;

  if new.created_at <> old.created_at then
    raise exception 'Timestamp created_at tidak dapat diubah' using errcode = '42501';
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

  return new;
end;
$$;

-- 4. Hook Rate Limiting into complete_lesson (Max 15 completions/min per user)
create or replace function public.complete_lesson(p_lesson_id text, p_perfect boolean default false)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_uid uuid := auth.uid();
  v_prog public.progress;
  v_already boolean;
  v_xp_gain int := 0;
  v_gems_gain int := 0;
  v_tickets_gain int := 0;
  v_today date;
  v_now timestamptz := now();
  v_allowed boolean;
begin
  if v_uid is null then
    raise exception 'Not authenticated' using errcode = '42501';
  end if;

  -- Rate limit: Max 15 completions per 60 seconds
  v_allowed := public.check_rate_limit('complete_lesson', v_uid::text, 15, 60);
  if not v_allowed then
    raise exception 'Terlalu banyak pelajaran diselesaikan dalam waktu singkat. Mohon tunggu 1 menit.' using errcode = 'P0001';
  end if;

  if p_lesson_id is null or length(p_lesson_id) < 2 or length(p_lesson_id) > 64 or p_lesson_id !~ '^[a-zA-Z0-9_\-:]+$' then
    raise exception 'Format lesson_id tidak valid' using errcode = '22023';
  end if;

  v_today := (v_now at time zone 'Asia/Jakarta')::date;
  v_prog := public.sync_user_progress(v_uid);

  select exists(
    select 1 from public.completions where user_id = v_uid and lesson_id = p_lesson_id
  ) into v_already;

  if not v_already and v_prog.hearts <= 0 then
    raise exception 'Nyawa habis, isi ulang nyawa terlebih dahulu' using errcode = 'P0001';
  end if;

  if v_already then
    v_xp_gain := 2;
    v_gems_gain := 0;
    v_tickets_gain := 0;
  else
    v_xp_gain := 15 + (case when p_perfect then 5 else 0 end);
    v_gems_gain := 2 + (case when p_perfect then 2 else 0 end);
    v_tickets_gain := 1;

    insert into public.completions (user_id, lesson_id, perfect)
    values (v_uid, p_lesson_id, p_perfect)
    on conflict (user_id, lesson_id) do update set perfect = completions.perfect or p_perfect;

    v_prog.lessons_today := v_prog.lessons_today + 1;
    if p_perfect then
      v_prog.perfect_today := v_prog.perfect_today + 1;
    end if;
    v_prog.xp_today := v_prog.xp_today + v_xp_gain;
    v_prog.weekly_xp := v_prog.weekly_xp + v_xp_gain;
  end if;

  if v_prog.last_active_date is null or v_prog.last_active_date <> v_today then
    if v_prog.last_active_date = v_today - 1 then
      v_prog.streak := v_prog.streak + 1;
    elsif v_prog.last_active_date is null then
      v_prog.streak := 1;
    end if;
    v_prog.last_active_date := v_today;
  end if;

  v_prog.xp := least(5000000, v_prog.xp + v_xp_gain);
  v_prog.gems := least(999999, v_prog.gems + v_gems_gain);
  v_prog.raffle_tickets := least(9999, v_prog.raffle_tickets + v_tickets_gain);

  update public.progress
  set xp = v_prog.xp,
      gems = v_prog.gems,
      raffle_tickets = v_prog.raffle_tickets,
      streak = v_prog.streak,
      last_active_date = v_prog.last_active_date,
      xp_today = v_prog.xp_today,
      weekly_xp = v_prog.weekly_xp,
      lessons_today = v_prog.lessons_today,
      perfect_today = v_prog.perfect_today,
      updated_at = v_now
  where user_id = v_uid;

  if v_gems_gain > 0 or v_tickets_gain > 0 then
    insert into public.ledger (user_id, kind, gems_delta, tickets_delta, ref)
    values (v_uid, 'lesson_complete', v_gems_gain, v_tickets_gain, p_lesson_id);
  end if;

  return jsonb_build_object(
    'xp', v_xp_gain,
    'gems', v_gems_gain,
    'tickets', v_tickets_gain,
    'perfect', p_perfect,
    'replay', v_already,
    'progress', to_jsonb(v_prog)
  );
end;
$$;

-- 5. Hook Rate Limiting into complete_story (Max 10 per min)
create or replace function public.complete_story(p_story_id text)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_uid uuid := auth.uid();
  v_prog public.progress;
  v_already boolean;
  v_xp_gain int := 0;
  v_gems_gain int := 0;
  v_now timestamptz := now();
  v_allowed boolean;
begin
  if v_uid is null then raise exception 'Not authenticated' using errcode = '42501'; end if;

  v_allowed := public.check_rate_limit('complete_story', v_uid::text, 10, 60);
  if not v_allowed then
    raise exception 'Terlalu banyak kisah diselesaikan dalam waktu singkat. Mohon tunggu 1 menit.' using errcode = 'P0001';
  end if;

  if p_story_id is null or length(p_story_id) < 2 or length(p_story_id) > 64 or p_story_id !~ '^[a-zA-Z0-9_\-]+$' then
    raise exception 'Format story_id tidak valid' using errcode = '22023';
  end if;

  v_prog := public.sync_user_progress(v_uid);

  select exists(
    select 1 from public.completions where user_id = v_uid and lesson_id = 'story:' || p_story_id
  ) into v_already;

  if not v_already then
    v_xp_gain := 10;
    v_gems_gain := 3;
    insert into public.completions (user_id, lesson_id, perfect)
    values (v_uid, 'story:' || p_story_id, true);

    v_prog.stories_today := v_prog.stories_today + 1;
    v_prog.xp_today := v_prog.xp_today + v_xp_gain;
    v_prog.weekly_xp := v_prog.weekly_xp + v_xp_gain;
    v_prog.xp := least(5000000, v_prog.xp + v_xp_gain);
    v_prog.gems := least(999999, v_prog.gems + v_gems_gain);

    update public.progress
    set xp = v_prog.xp,
        gems = v_prog.gems,
        stories_today = v_prog.stories_today,
        xp_today = v_prog.xp_today,
        weekly_xp = v_prog.weekly_xp,
        updated_at = v_now
    where user_id = v_uid;

    insert into public.ledger (user_id, kind, gems_delta, tickets_delta, ref)
    values (v_uid, 'story_complete', v_gems_gain, 0, p_story_id);
  end if;

  return jsonb_build_object('xp', v_xp_gain, 'gems', v_gems_gain, 'replay', v_already);
end;
$$;

-- 6. Hook Rate Limiting into claim_quest (Max 10 claims per min)
create or replace function public.claim_quest(p_quest_id text)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_uid uuid := auth.uid();
  v_prog public.progress;
  v_today date;
  v_reward_gems int := 0;
  v_now timestamptz := now();
  v_allowed boolean;
begin
  if v_uid is null then raise exception 'Not authenticated' using errcode = '42501'; end if;

  v_allowed := public.check_rate_limit('claim_quest', v_uid::text, 10, 60);
  if not v_allowed then
    raise exception 'Terlalu banyak permintaan klaim quest. Mohon tunggu 1 menit.' using errcode = 'P0001';
  end if;

  v_today := (v_now at time zone 'Asia/Jakarta')::date;
  v_prog := public.sync_user_progress(v_uid);

  if exists(
    select 1 from public.claimed_quests
    where user_id = v_uid and quest_id = p_quest_id and quest_date = v_today
  ) then
    raise exception 'Quest already claimed today' using errcode = 'P0001';
  end if;

  if p_quest_id = 'lesson-1' and v_prog.lessons_today >= 1 then
    v_reward_gems := 3;
  elsif p_quest_id = 'xp-30' and v_prog.xp_today >= 30 then
    v_reward_gems := 5;
  elsif p_quest_id = 'story-1' and v_prog.stories_today >= 1 then
    v_reward_gems := 4;
  elsif p_quest_id = 'perfect' and v_prog.perfect_today >= 1 then
    v_reward_gems := 5;
  else
    raise exception 'Quest conditions not met' using errcode = 'P0001';
  end if;

  insert into public.claimed_quests (user_id, quest_id, quest_date)
  values (v_uid, p_quest_id, v_today);

  update public.progress
  set gems = least(999999, gems + v_reward_gems), updated_at = v_now
  where user_id = v_uid;

  insert into public.ledger (user_id, kind, gems_delta, tickets_delta, ref)
  values (v_uid, 'quest_claim', v_reward_gems, 0, p_quest_id);

  return jsonb_build_object('quest_id', p_quest_id, 'reward_gems', v_reward_gems);
end;
$$;

-- 7. Hook Rate Limiting into enter_raffle (Max 15 enters per min)
create or replace function public.enter_raffle(p_raffle_id text, p_tickets int)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_uid uuid := auth.uid();
  v_raffle public.raffles;
  v_now timestamptz := now();
  v_allowed boolean;
begin
  if v_uid is null then raise exception 'Not authenticated' using errcode = '42501'; end if;

  v_allowed := public.check_rate_limit('enter_raffle', v_uid::text, 15, 60);
  if not v_allowed then
    raise exception 'Terlalu banyak pendaftaran undian dalam waktu singkat. Mohon tunggu 1 menit.' using errcode = 'P0001';
  end if;

  if p_tickets <= 0 or p_tickets > 1000 then raise exception 'Jumlah tiket tidak valid' using errcode = '22023'; end if;

  perform public.sync_user_progress(v_uid);

  select * into v_raffle from public.raffles where id = p_raffle_id;
  if not found then raise exception 'Undian tidak ditemukan' using errcode = 'P0001'; end if;
  if v_raffle.status <> 'live' or v_raffle.ends_at <= v_now then raise exception 'Undian sudah berakhir atau belum aktif' using errcode = 'P0001'; end if;

  update public.progress
  set raffle_tickets = raffle_tickets - p_tickets, updated_at = v_now
  where user_id = v_uid and raffle_tickets >= p_tickets;

  if not found then
    raise exception 'Tiket tidak mencukupi' using errcode = 'P0001';
  end if;

  insert into public.raffle_entries (raffle_id, user_id, tickets)
  values (p_raffle_id, v_uid, p_tickets)
  on conflict (raffle_id, user_id)
  do update set tickets = raffle_entries.tickets + p_tickets;

  insert into public.ledger (user_id, kind, gems_delta, tickets_delta, ref)
  values (v_uid, 'enter_raffle', 0, -p_tickets, p_raffle_id);

  return jsonb_build_object('success', true, 'raffle_id', p_raffle_id, 'tickets_entered', p_tickets);
end;
$$;

-- 8. Hook Rate Limiting into shop operations (Max 15 buys per min)
create or replace function public.buy_freeze()
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_uid uuid := auth.uid();
  v_cost int := 50;
  v_now timestamptz := now();
  v_allowed boolean;
begin
  if v_uid is null then raise exception 'Not authenticated' using errcode = '42501'; end if;

  v_allowed := public.check_rate_limit('shop_buy', v_uid::text, 15, 60);
  if not v_allowed then
    raise exception 'Terlalu banyak transaksi belanja. Mohon tunggu 1 menit.' using errcode = 'P0001';
  end if;

  perform public.sync_user_progress(v_uid);

  update public.progress
  set gems = gems - v_cost, streak_freeze = streak_freeze + 1, updated_at = v_now
  where user_id = v_uid and gems >= v_cost and streak_freeze < 30;

  if not found then
    raise exception 'Transaksi gagal: saldo bintang tidak cukup atau batas pembekuan tercapai' using errcode = 'P0001';
  end if;

  insert into public.ledger (user_id, kind, gems_delta, tickets_delta, ref)
  values (v_uid, 'buy_freeze', -v_cost, 0, 'streak_freeze');

  return jsonb_build_object('success', true, 'cost', v_cost);
end;
$$;

create or replace function public.refill_hearts()
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_uid uuid := auth.uid();
  v_cost int := 80;
  v_now timestamptz := now();
  v_allowed boolean;
begin
  if v_uid is null then raise exception 'Not authenticated' using errcode = '42501'; end if;

  v_allowed := public.check_rate_limit('shop_buy', v_uid::text, 15, 60);
  if not v_allowed then
    raise exception 'Terlalu banyak transaksi belanja. Mohon tunggu 1 menit.' using errcode = 'P0001';
  end if;

  perform public.sync_user_progress(v_uid);

  update public.progress
  set gems = gems - v_cost, hearts = 5, hearts_updated_at = v_now, updated_at = v_now
  where user_id = v_uid and gems >= v_cost and hearts < 5;

  if not found then
    raise exception 'Transaksi gagal: saldo bintang tidak cukup atau nyawa sudah penuh' using errcode = 'P0001';
  end if;

  insert into public.ledger (user_id, kind, gems_delta, tickets_delta, ref)
  values (v_uid, 'refill_hearts', -v_cost, 0, 'hearts_refill');

  return jsonb_build_object('success', true, 'cost', v_cost);
end;
$$;

create or replace function public.buy_tickets(p_count int)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_uid uuid := auth.uid();
  v_unit_cost int := 10;
  v_total_cost int;
  v_now timestamptz := now();
  v_allowed boolean;
begin
  if v_uid is null then raise exception 'Not authenticated' using errcode = '42501'; end if;

  v_allowed := public.check_rate_limit('shop_buy', v_uid::text, 15, 60);
  if not v_allowed then
    raise exception 'Terlalu banyak transaksi belanja. Mohon tunggu 1 menit.' using errcode = 'P0001';
  end if;

  if p_count <= 0 or p_count > 100 then raise exception 'Jumlah tiket harus antara 1 dan 100' using errcode = '22023'; end if;
  perform public.sync_user_progress(v_uid);

  v_total_cost := p_count * v_unit_cost;

  update public.progress
  set gems = gems - v_total_cost, raffle_tickets = raffle_tickets + p_count, updated_at = v_now
  where user_id = v_uid and gems >= v_total_cost and (raffle_tickets + p_count) <= 9999;

  if not found then
    raise exception 'Transaksi gagal: saldo bintang tidak cukup atau batas tiket tercapai' using errcode = 'P0001';
  end if;

  insert into public.ledger (user_id, kind, gems_delta, tickets_delta, ref)
  values (v_uid, 'buy_tickets', -v_total_cost, p_count, 'ticket_purchase');

  return jsonb_build_object('success', true, 'tickets_bought', p_count, 'cost', v_total_cost);
end;
$$;
