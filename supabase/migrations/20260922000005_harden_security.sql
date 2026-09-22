-- Migration 20260922000005_harden_security.sql
-- Comprehensive Security Hardening: RLS with WITH CHECK, column immutability guard,
-- atomic race-condition proof transactions, search_path isolation, and Defense-in-Depth privilege revocation.

-- 1. Profile Field Guard: Prevent unauthorized mutation of id, username, and created_at
create or replace function public.guard_profile_immutable_fields()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
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

  -- Validate length of bio and twitter
  if length(coalesce(new.bio, '')) > 160 then
    raise exception 'Bio maksimal 160 karakter' using errcode = '22001';
  end if;

  if length(coalesce(new.twitter, '')) > 32 then
    raise exception 'Handle Twitter maksimal 32 karakter' using errcode = '22001';
  end if;

  return new;
end;
$$;

drop trigger if exists trg_guard_profile_update on public.profiles;
create trigger trg_guard_profile_update
  before update on public.profiles
  for each row execute function public.guard_profile_immutable_fields();

-- 2. Harden Profiles Update RLS Policy with WITH CHECK clause
drop policy if exists "own profile update" on public.profiles;
create policy "own profile update" on public.profiles
  for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- 3. Defense-in-Depth: Revoke direct DML privileges from client roles
-- Only SELECT is permitted for clients; all writes to economy & progress tables
-- MUST pass through vetted SECURITY DEFINER RPCs.
revoke insert, update, delete on public.progress from anon, authenticated;
revoke insert, update, delete on public.completions from anon, authenticated;
revoke insert, update, delete on public.claimed_quests from anon, authenticated;
revoke insert, update, delete on public.raffle_entries from anon, authenticated;
revoke insert, update, delete on public.raffle_winners from anon, authenticated;
revoke insert, update, delete on public.raffles from anon, authenticated;
revoke insert, update, delete on public.ledger from anon, authenticated;
revoke insert, delete on public.profiles from anon, authenticated;

-- Allow only authenticated users to update their own bio & twitter on profiles (governed by RLS + trigger)
grant select on all tables in schema public to anon, authenticated;
grant update (bio, twitter) on public.profiles to authenticated;

-- 4. Re-secure handle_new_user with explicit search_path
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_username text;
begin
  v_username := public.normalize_username(coalesce(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1)));
  if v_username is null or length(v_username) < 3 then
    v_username := 'user_' || substr(replace(new.id::text, '-', ''), 1, 8);
  end if;

  if exists (select 1 from public.profiles where username = v_username) then
    raise exception 'USERNAME_TAKEN' using errcode = '23505';
  end if;

  insert into public.profiles (id, username)
  values (new.id, v_username);

  insert into public.progress (user_id, gems, hearts, raffle_tickets)
  values (new.id, 50, 5, 3)
  on conflict (user_id) do nothing;

  return new;
end;
$$;

-- 5. Re-secure sync_user_progress with search_path and row lock
create or replace function public.sync_user_progress(p_user_id uuid)
returns public.progress
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_prog public.progress;
  v_today date;
  v_week text;
  v_gap int;
  v_heart_cycles int;
  v_hearts int;
  v_now timestamptz := now();
begin
  v_today := (v_now at time zone 'Asia/Jakarta')::date;

  -- Compute ISO week in Asia/Jakarta
  select to_char(v_now at time zone 'Asia/Jakarta', 'IYYY"-W"IW') into v_week;

  select * into v_prog from public.progress where user_id = p_user_id for update;
  if not found then
    insert into public.progress (user_id, gems, hearts, raffle_tickets, xp_today_date, week_key)
    values (p_user_id, 50, 5, 3, v_today, v_week)
    returning * into v_prog;
  end if;

  -- 1. Heart Regeneration (20 min = 1200 sec per heart, max 5)
  if v_prog.hearts < 5 then
    v_heart_cycles := floor(extract(epoch from (v_now - v_prog.hearts_updated_at)) / 1200);
    if v_heart_cycles > 0 then
      v_hearts := least(5, v_prog.hearts + v_heart_cycles);
      v_prog.hearts := v_hearts;
      if v_hearts = 5 then
        v_prog.hearts_updated_at := v_now;
      else
        v_prog.hearts_updated_at := v_prog.hearts_updated_at + (v_heart_cycles * interval '1200 seconds');
      end if;
    end if;
  else
    v_prog.hearts_updated_at := v_now;
  end if;

  -- 2. Daily Roll (Asia/Jakarta)
  if v_prog.xp_today_date <> v_today then
    if v_prog.last_active_date is not null then
      v_gap := v_today - v_prog.last_active_date;
      if v_gap > 1 then
        if v_prog.streak_freeze >= (v_gap - 1) then
          v_prog.streak_freeze := v_prog.streak_freeze - (v_gap - 1);
        else
          v_prog.streak := 0;
          v_prog.streak_freeze := 0;
        end if;
      end if;
    end if;

    v_prog.xp_today := 0;
    v_prog.xp_today_date := v_today;
    v_prog.lessons_today := 0;
    v_prog.perfect_today := 0;
    v_prog.stories_today := 0;
  end if;

  -- 3. Weekly Roll
  if v_prog.week_key <> v_week then
    v_prog.weekly_xp := 0;
    v_prog.week_key := v_week;
  end if;

  update public.progress
  set hearts = v_prog.hearts,
      hearts_updated_at = v_prog.hearts_updated_at,
      streak = v_prog.streak,
      streak_freeze = v_prog.streak_freeze,
      xp_today = v_prog.xp_today,
      xp_today_date = v_prog.xp_today_date,
      lessons_today = v_prog.lessons_today,
      perfect_today = v_prog.perfect_today,
      stories_today = v_prog.stories_today,
      weekly_xp = v_prog.weekly_xp,
      week_key = v_prog.week_key,
      updated_at = v_now
  where user_id = p_user_id;

  return v_prog;
end;
$$;

-- 6. Re-secure complete_lesson with search_path, input validation & hearts check
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
begin
  if v_uid is null then
    raise exception 'Not authenticated' using errcode = '42501';
  end if;

  -- Validate lesson_id
  if p_lesson_id is null or length(p_lesson_id) < 2 or length(p_lesson_id) > 64 or p_lesson_id !~ '^[a-zA-Z0-9_\-:]+$' then
    raise exception 'Format lesson_id tidak valid' using errcode = '22023';
  end if;

  v_today := (v_now at time zone 'Asia/Jakarta')::date;
  v_prog := public.sync_user_progress(v_uid);

  select exists(
    select 1 from public.completions where user_id = v_uid and lesson_id = p_lesson_id
  ) into v_already;

  -- Guard: 0 hearts cannot start a brand new lesson
  if not v_already and v_prog.hearts <= 0 then
    raise exception 'Nyawa habis, isi ulang nyawa terlebih dahulu' using errcode = 'P0001';
  end if;

  if v_already then
    -- Replay protection: max 2 XP, 0 gems, 0 tickets, NO daily or weekly XP
    v_xp_gain := 2;
    v_gems_gain := 0;
    v_tickets_gain := 0;
  else
    -- First time completion: full rewards
    v_xp_gain := 15 + (case when p_perfect then 5 else 0 end);
    v_gems_gain := 2 + (case when p_perfect then 2 else 0 end);
    v_tickets_gain := 1;

    insert into public.completions (user_id, lesson_id, perfect)
    values (v_uid, p_lesson_id, p_perfect)
    on conflict (user_id, lesson_id) do update set perfect = completions.perfect or p_perfect;

    -- Update daily stats
    v_prog.lessons_today := v_prog.lessons_today + 1;
    if p_perfect then
      v_prog.perfect_today := v_prog.perfect_today + 1;
    end if;
    v_prog.xp_today := v_prog.xp_today + v_xp_gain;
    v_prog.weekly_xp := v_prog.weekly_xp + v_xp_gain;
  end if;

  -- Touch streak on activity
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

-- 7. Re-secure complete_story with search_path and validation
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
begin
  if v_uid is null then raise exception 'Not authenticated' using errcode = '42501'; end if;

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

-- 8. Re-secure claim_quest with search_path and validation
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
begin
  if v_uid is null then raise exception 'Not authenticated' using errcode = '42501'; end if;
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

-- 9. Re-secure shop operations (buy_freeze, refill_hearts, buy_tickets)
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
begin
  if v_uid is null then raise exception 'Not authenticated' using errcode = '42501'; end if;
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
begin
  if v_uid is null then raise exception 'Not authenticated' using errcode = '42501'; end if;
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
begin
  if v_uid is null then raise exception 'Not authenticated' using errcode = '42501'; end if;
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

-- 10. Re-secure enter_raffle with race-condition proof atomic update & search_path
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
begin
  if v_uid is null then raise exception 'Not authenticated' using errcode = '42501'; end if;
  if p_tickets <= 0 or p_tickets > 1000 then raise exception 'Jumlah tiket tidak valid' using errcode = '22023'; end if;

  perform public.sync_user_progress(v_uid);

  select * into v_raffle from public.raffles where id = p_raffle_id;
  if not found then raise exception 'Undian tidak ditemukan' using errcode = 'P0001'; end if;
  if v_raffle.status <> 'live' or v_raffle.ends_at <= v_now then raise exception 'Undian sudah berakhir atau belum aktif' using errcode = 'P0001'; end if;

  -- Atomic ticket deduction with constraint guard
  update public.progress
  set raffle_tickets = raffle_tickets - p_tickets, updated_at = v_now
  where user_id = v_uid and raffle_tickets >= p_tickets;

  if not found then
    raise exception 'Tiket tidak mencukupi' using errcode = 'P0001';
  end if;

  -- Upsert entries
  insert into public.raffle_entries (raffle_id, user_id, tickets)
  values (p_raffle_id, v_uid, p_tickets)
  on conflict (raffle_id, user_id)
  do update set tickets = raffle_entries.tickets + p_tickets;

  insert into public.ledger (user_id, kind, gems_delta, tickets_delta, ref)
  values (v_uid, 'enter_raffle', 0, -p_tickets, p_raffle_id);

  return jsonb_build_object('success', true, 'raffle_id', p_raffle_id, 'tickets_entered', p_tickets);
end;
$$;
