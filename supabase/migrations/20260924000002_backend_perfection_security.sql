-- Migration 20260924000002: Backend Perfection & Cyber Security Hardening
-- 1. Anti-Cheat & Server-Enforced Rank for Leaderboard Rewards
-- 2. DoS / Memory-Exhaustion Protection via Parameter Clamping in get_leaderboard
-- 3. Rate Limiting on All Public RPCs (get_leaderboard, get_raffle_stats, claim_leaderboard)
-- 4. Rigorous Input Validation (Regex) on raffle_id and Twitter handle
-- 5. Atomic Concurrency & Timing Race-Condition Prevention (starts_at check, on conflict guard)
-- 6. Defense-in-Depth Search Path Isolation across all functions

-- 1. Profile Update Trigger: Add strict regex validation for Twitter handle
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

  -- Handle Twitter: max 32 chars, only alphanumeric and underscore (prevents javascript:/XSS injection)
  if length(coalesce(new.twitter, '')) > 32 then
    raise exception 'Handle Twitter maksimal 32 karakter' using errcode = '22001';
  end if;

  if coalesce(new.twitter, '') <> '' and coalesce(new.twitter, '') !~ '^[a-zA-Z0-9_]{1,32}$' then
    raise exception 'Format handle Twitter tidak valid (hanya huruf, angka, dan underscore)' using errcode = '22023';
  end if;

  return new;
end;
$$;

-- 2. Server-Enforced Rank for Leaderboard Claims (Anti-Cheat & Concurrency Lock)
create or replace function public.claim_weekly_leaderboard_reward(p_rank int default null)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_uid uuid := auth.uid();
  v_now timestamptz := now();
  v_week text;
  v_prog public.progress;
  v_coins int := 0;
  v_actual_rank int;
  v_effective_rank int;
  v_updated_gems int;
  v_allowed boolean;
begin
  if v_uid is null then 
    raise exception 'Not authenticated' using errcode = '42501'; 
  end if;

  -- 1. Rate limiting: max 5 claim attempts per 60 seconds
  v_allowed := public.check_rate_limit('claim_leaderboard', v_uid::text, 5, 60);
  if not v_allowed then
    raise exception 'Terlalu banyak permintaan klaim hadiah. Mohon tunggu 1 menit.' using errcode = 'P0001';
  end if;

  -- 2. Hitung ISO Week di Asia/Jakarta
  select to_char(v_now at time zone 'Asia/Jakarta', 'IYYY"-W"IW') into v_week;
  
  -- Lock progress row for update to prevent concurrent double-claim races
  select * into v_prog from public.progress where user_id = v_uid for update;
  if not found then
    v_prog := public.sync_user_progress(v_uid);
  end if;

  if v_prog.last_claimed_leaderboard_week = v_week then
    raise exception 'Hadiah klasemen minggu % sudah pernah diklaim.', v_week using errcode = 'P0001';
  end if;

  -- 3. SERVER-SIDE COMPUTED RANK (Anti-Cheat: Abaikan input p_rank palsu dari client)
  select sub.rank into v_actual_rank
  from (
    select pr.id as user_id,
           row_number() over (order by coalesce(p.weekly_xp, 0) desc, coalesce(p.xp, 0) desc, pr.created_at asc)::int as rank
    from public.profiles pr
    left join public.progress p on p.user_id = pr.id
  ) sub
  where sub.user_id = v_uid;

  v_effective_rank := coalesce(v_actual_rank, 1001);

  -- 4. Skema 9 Tingkat Hadiah Koin Peringkat 1 - 1.000
  if v_effective_rank = 1 then v_coins := 1000;
  elsif v_effective_rank = 2 then v_coins := 600;
  elsif v_effective_rank = 3 then v_coins := 400;
  elsif v_effective_rank between 4 and 10 then v_coins := 200;
  elsif v_effective_rank between 11 and 50 then v_coins := 100;
  elsif v_effective_rank between 51 and 100 then v_coins := 60;
  elsif v_effective_rank between 101 and 250 then v_coins := 40;
  elsif v_effective_rank between 251 and 500 then v_coins := 25;
  elsif v_effective_rank between 501 and 1000 then v_coins := 15;
  else v_coins := 5;
  end if;

  -- 5. Atomic Balance Credit & Claim Timestamp Update
  update public.progress
  set gems = least(999999, gems + v_coins),
      last_claimed_leaderboard_week = v_week,
      updated_at = v_now
  where user_id = v_uid
  returning gems into v_updated_gems;

  insert into public.ledger (user_id, kind, gems_delta, tickets_delta, ref)
  values (v_uid, 'claim_leaderboard', v_coins, 0, v_week || ':rank=' || v_effective_rank);

  return jsonb_build_object(
    'success', true,
    'reward', v_coins,
    'week', v_week,
    'rank', v_effective_rank,
    'new_gems', v_updated_gems
  );
end;
$$;

-- 3. Clamped & Rate-Limited Public Leaderboard RPC
create or replace function public.get_leaderboard(p_limit int default 100, p_offset int default 0)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_list jsonb;
  v_limit int;
  v_offset int;
  v_ident text;
  v_allowed boolean;
begin
  -- Rate limiting: Max 60 requests/min per IP/user
  v_ident := coalesce(auth.uid()::text, public.get_client_ip());
  v_allowed := public.check_rate_limit('get_leaderboard', v_ident, 60, 60);
  if not v_allowed then
    raise exception 'Terlalu banyak permintaan papan peringkat. Mohon tunggu 1 menit.' using errcode = 'P0001';
  end if;

  -- Clamp bounds strictly to prevent DoS / memory exhaustion
  v_limit := greatest(1, least(coalesce(p_limit, 100), 1000));
  v_offset := greatest(0, coalesce(p_offset, 0));

  select jsonb_agg(sub) into v_list
  from (
    select 
      row_number() over (order by coalesce(p.weekly_xp, 0) desc, coalesce(p.xp, 0) desc, pr.created_at asc)::int as rank,
      pr.username,
      coalesce(p.xp, 0)::int as xp,
      coalesce(p.weekly_xp, 0)::int as weekly_xp,
      coalesce(p.streak, 0)::int as streak,
      case 
        when row_number() over (order by coalesce(p.weekly_xp, 0) desc, coalesce(p.xp, 0) desc) = 1 then 1000
        when row_number() over (order by coalesce(p.weekly_xp, 0) desc, coalesce(p.xp, 0) desc) = 2 then 600
        when row_number() over (order by coalesce(p.weekly_xp, 0) desc, coalesce(p.xp, 0) desc) = 3 then 400
        when row_number() over (order by coalesce(p.weekly_xp, 0) desc, coalesce(p.xp, 0) desc) between 4 and 10 then 200
        when row_number() over (order by coalesce(p.weekly_xp, 0) desc, coalesce(p.xp, 0) desc) between 11 and 50 then 100
        when row_number() over (order by coalesce(p.weekly_xp, 0) desc, coalesce(p.xp, 0) desc) between 51 and 100 then 60
        when row_number() over (order by coalesce(p.weekly_xp, 0) desc, coalesce(p.xp, 0) desc) between 101 and 250 then 40
        when row_number() over (order by coalesce(p.weekly_xp, 0) desc, coalesce(p.xp, 0) desc) between 251 and 500 then 25
        when row_number() over (order by coalesce(p.weekly_xp, 0) desc, coalesce(p.xp, 0) desc) between 501 and 1000 then 15
        else 5
      end::int as coin_reward
    from public.profiles pr
    left join public.progress p on p.user_id = pr.id
    order by coalesce(p.weekly_xp, 0) desc, coalesce(p.xp, 0) desc, pr.created_at asc
    limit v_limit offset v_offset
  ) sub;

  return coalesce(v_list, '[]'::jsonb);
end;
$$;

-- 4. Validated & Rate-Limited Raffle Stats RPC
create or replace function public.get_raffle_stats(p_raffle_id text default null)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_stats jsonb;
  v_ident text;
  v_allowed boolean;
begin
  -- Rate limiting: Max 60 requests/min per IP/user
  v_ident := coalesce(auth.uid()::text, public.get_client_ip());
  v_allowed := public.check_rate_limit('get_raffle_stats', v_ident, 60, 60);
  if not v_allowed then
    raise exception 'Terlalu banyak permintaan statistik undian. Mohon tunggu 1 menit.' using errcode = 'P0001';
  end if;

  -- Input validation on raffle_id format
  if p_raffle_id is not null and (length(p_raffle_id) < 2 or length(p_raffle_id) > 64 or p_raffle_id !~ '^[a-zA-Z0-9_\-]+$') then
    raise exception 'Format raffle_id tidak valid' using errcode = '22023';
  end if;

  select jsonb_agg(
    jsonb_build_object(
      'raffle_id', r.id,
      'total_tickets', coalesce(sub.total_tickets, 0),
      'total_participants', coalesce(sub.total_participants, 0)
    )
  ) into v_stats
  from public.raffles r
  left join (
    select 
      raffle_id, 
      sum(tickets)::int as total_tickets, 
      count(user_id)::int as total_participants
    from public.raffle_entries
    group by raffle_id
  ) sub on sub.raffle_id = r.id
  where (p_raffle_id is null or r.id = p_raffle_id);

  return coalesce(v_stats, '[]'::jsonb);
end;
$$;

-- 5. Hardened enter_raffle with strict regex & start-time check
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
  if v_uid is null then 
    raise exception 'Not authenticated' using errcode = '42501'; 
  end if;

  v_allowed := public.check_rate_limit('enter_raffle', v_uid::text, 15, 60);
  if not v_allowed then
    raise exception 'Terlalu banyak pendaftaran undian dalam waktu singkat. Mohon tunggu 1 menit.' using errcode = 'P0001';
  end if;

  if p_raffle_id is null or length(p_raffle_id) < 2 or length(p_raffle_id) > 64 or p_raffle_id !~ '^[a-zA-Z0-9_\-]+$' then
    raise exception 'Format raffle_id tidak valid' using errcode = '22023';
  end if;

  if p_tickets <= 0 or p_tickets > 1000 then 
    raise exception 'Jumlah tiket tidak valid' using errcode = '22023'; 
  end if;

  perform public.sync_user_progress(v_uid);

  select * into v_raffle from public.raffles where id = p_raffle_id for share;
  if not found then 
    raise exception 'Undian tidak ditemukan' using errcode = 'P0001'; 
  end if;

  if v_raffle.status <> 'live' or v_raffle.ends_at <= v_now or v_raffle.starts_at > v_now then 
    raise exception 'Undian sudah berakhir atau belum aktif' using errcode = 'P0001'; 
  end if;

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

-- 6. Concurrency-Safe claim_quest with atomic ON CONFLICT handling
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
  v_canonical_id text;
  v_inserted boolean := false;
begin
  if v_uid is null then 
    raise exception 'Not authenticated' using errcode = '42501'; 
  end if;

  v_allowed := public.check_rate_limit('claim_quest', v_uid::text, 10, 60);
  if not v_allowed then
    raise exception 'Terlalu banyak permintaan klaim quest. Mohon tunggu 1 menit.' using errcode = 'P0001';
  end if;

  -- Normalize quest identifier
  case p_quest_id
    when 'lesson-1', 'lesson' then v_canonical_id := 'lesson';
    when 'xp-30', 'xp' then v_canonical_id := 'xp';
    when 'story-1', 'kisah' then v_canonical_id := 'kisah';
    when 'perfect' then v_canonical_id := 'perfect';
    else raise exception 'ID quest tidak valid' using errcode = '22023';
  end case;

  v_today := (v_now at time zone 'Asia/Jakarta')::date;
  v_prog := public.sync_user_progress(v_uid);

  -- Check if already claimed under either format today
  if exists(
    select 1 from public.claimed_quests
    where user_id = v_uid
      and (quest_id = v_canonical_id or quest_id = p_quest_id or
           (v_canonical_id = 'lesson' and quest_id = 'lesson-1') or
           (v_canonical_id = 'xp' and quest_id = 'xp-30') or
           (v_canonical_id = 'kisah' and quest_id = 'story-1'))
      and quest_date = v_today
  ) then
    raise exception 'Quest already claimed today' using errcode = 'P0001';
  end if;

  if v_canonical_id = 'lesson' and v_prog.lessons_today >= 1 then
    v_reward_gems := 3;
  elsif v_canonical_id = 'xp' and v_prog.xp_today >= 30 then
    v_reward_gems := 5;
  elsif v_canonical_id = 'kisah' and v_prog.stories_today >= 1 then
    v_reward_gems := 4;
  elsif v_canonical_id = 'perfect' and v_prog.perfect_today >= 1 then
    v_reward_gems := 5;
  else
    raise exception 'Quest conditions not met' using errcode = 'P0001';
  end if;

  -- Atomic check-and-insert
  insert into public.claimed_quests (user_id, quest_id, quest_date)
  values (v_uid, v_canonical_id, v_today)
  on conflict do nothing;

  if not found then
    raise exception 'Quest already claimed today' using errcode = 'P0001';
  end if;

  update public.progress
  set gems = least(999999, gems + v_reward_gems), updated_at = v_now
  where user_id = v_uid;

  insert into public.ledger (user_id, kind, gems_delta, tickets_delta, ref)
  values (v_uid, 'quest_claim', v_reward_gems, 0, v_canonical_id);

  return jsonb_build_object('quest_id', v_canonical_id, 'reward_gems', v_reward_gems);
end;
$$;

-- 7. Permissions & Grants
grant execute on function public.claim_weekly_leaderboard_reward(int) to authenticated;
grant execute on function public.get_leaderboard(int, int) to anon, authenticated;
grant execute on function public.get_raffle_stats(text) to anon, authenticated;
grant execute on function public.enter_raffle(text, int) to authenticated;
grant execute on function public.claim_quest(text) to authenticated;
