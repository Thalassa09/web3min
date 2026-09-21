-- Migration 0003_rpc.sql: Server-side economy RPCs with Asia/Jakarta GMT+7 rules

-- Helper to roll day/week and compute hearts regeneration on user progress
create or replace function public.sync_user_progress(p_user_id uuid)
returns public.progress as $$
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
    -- Streak gap calculation
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
$$ language plpgsql security definer;

-- RPC 1: complete_lesson
create or replace function public.complete_lesson(p_lesson_id text, p_perfect boolean default false)
returns jsonb as $$
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
    raise exception 'Not authenticated';
  end if;

  v_today := (v_now at time zone 'Asia/Jakarta')::date;
  v_prog := public.sync_user_progress(v_uid);

  select exists(
    select 1 from public.completions where user_id = v_uid and lesson_id = p_lesson_id
  ) into v_already;

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
$$ language plpgsql security definer;

-- RPC 2: complete_story / complete_case
create or replace function public.complete_story(p_story_id text)
returns jsonb as $$
declare
  v_uid uuid := auth.uid();
  v_prog public.progress;
  v_already boolean;
  v_xp_gain int := 0;
  v_gems_gain int := 0;
  v_now timestamptz := now();
begin
  if v_uid is null then raise exception 'Not authenticated'; end if;
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
$$ language plpgsql security definer;

-- RPC 3: claim_quest
create or replace function public.claim_quest(p_quest_id text)
returns jsonb as $$
declare
  v_uid uuid := auth.uid();
  v_prog public.progress;
  v_today date;
  v_reward_gems int := 0;
  v_now timestamptz := now();
begin
  if v_uid is null then raise exception 'Not authenticated'; end if;
  v_today := (v_now at time zone 'Asia/Jakarta')::date;
  v_prog := public.sync_user_progress(v_uid);

  if exists(
    select 1 from public.claimed_quests
    where user_id = v_uid and quest_id = p_quest_id and quest_date = v_today
  ) then
    raise exception 'Quest already claimed today';
  end if;

  -- Validate quest progress & set rewards
  if p_quest_id = 'lesson-1' and v_prog.lessons_today >= 1 then
    v_reward_gems := 3;
  elsif p_quest_id = 'xp-30' and v_prog.xp_today >= 30 then
    v_reward_gems := 5;
  elsif p_quest_id = 'story-1' and v_prog.stories_today >= 1 then
    v_reward_gems := 4;
  elsif p_quest_id = 'perfect' and v_prog.perfect_today >= 1 then
    v_reward_gems := 5;
  else
    raise exception 'Quest conditions not met';
  end if;

  insert into public.claimed_quests (user_id, quest_id, quest_date)
  values (v_uid, p_quest_id, v_today);

  v_prog.gems := least(999999, v_prog.gems + v_reward_gems);
  update public.progress set gems = v_prog.gems, updated_at = v_now where user_id = v_uid;

  insert into public.ledger (user_id, kind, gems_delta, tickets_delta, ref)
  values (v_uid, 'quest_claim', v_reward_gems, 0, p_quest_id);

  return jsonb_build_object('quest_id', p_quest_id, 'reward_gems', v_reward_gems);
end;
$$ language plpgsql security definer;

-- RPC 4: buy_freeze, refill_hearts, buy_tickets
create or replace function public.buy_freeze()
returns jsonb as $$
declare
  v_uid uuid := auth.uid();
  v_prog public.progress;
  v_cost int := 50;
begin
  if v_uid is null then raise exception 'Not authenticated'; end if;
  v_prog := public.sync_user_progress(v_uid);

  if v_prog.gems < v_cost then raise exception 'Saldo bintang tidak mencukupi'; end if;
  if v_prog.streak_freeze >= 30 then raise exception 'Batas pembekuan streak tercapai'; end if;

  update public.progress
  set gems = gems - v_cost, streak_freeze = streak_freeze + 1, updated_at = now()
  where user_id = v_uid;

  insert into public.ledger (user_id, kind, gems_delta, tickets_delta, ref)
  values (v_uid, 'buy_freeze', -v_cost, 0, 'streak_freeze');

  return jsonb_build_object('success', true, 'cost', v_cost);
end;
$$ language plpgsql security definer;

create or replace function public.refill_hearts()
returns jsonb as $$
declare
  v_uid uuid := auth.uid();
  v_prog public.progress;
  v_cost int := 80;
begin
  if v_uid is null then raise exception 'Not authenticated'; end if;
  v_prog := public.sync_user_progress(v_uid);

  if v_prog.gems < v_cost then raise exception 'Saldo bintang tidak mencukupi'; end if;
  if v_prog.hearts >= 5 then raise exception 'Nyawa sudah penuh'; end if;

  update public.progress
  set gems = gems - v_cost, hearts = 5, hearts_updated_at = now(), updated_at = now()
  where user_id = v_uid;

  insert into public.ledger (user_id, kind, gems_delta, tickets_delta, ref)
  values (v_uid, 'refill_hearts', -v_cost, 0, 'hearts_refill');

  return jsonb_build_object('success', true, 'cost', v_cost);
end;
$$ language plpgsql security definer;

create or replace function public.buy_tickets(p_count int)
returns jsonb as $$
declare
  v_uid uuid := auth.uid();
  v_prog public.progress;
  v_unit_cost int := 10;
  v_total_cost int;
begin
  if v_uid is null then raise exception 'Not authenticated'; end if;
  if p_count <= 0 or p_count > 9999 then raise exception 'Jumlah tiket tidak valid'; end if;
  v_prog := public.sync_user_progress(v_uid);

  v_total_cost := p_count * v_unit_cost;
  if v_prog.gems < v_total_cost then raise exception 'Saldo bintang tidak mencukupi'; end if;
  if (v_prog.raffle_tickets + p_count) > 9999 then raise exception 'Batas tiket maksimum tercapai'; end if;

  update public.progress
  set gems = gems - v_total_cost, raffle_tickets = raffle_tickets + p_count, updated_at = now()
  where user_id = v_uid;

  insert into public.ledger (user_id, kind, gems_delta, tickets_delta, ref)
  values (v_uid, 'buy_tickets', -v_total_cost, p_count, 'ticket_purchase');

  return jsonb_build_object('success', true, 'tickets_bought', p_count, 'cost', v_total_cost);
end;
$$ language plpgsql security definer;

-- RPC 5: enter_raffle
create or replace function public.enter_raffle(p_raffle_id text, p_tickets int)
returns jsonb as $$
declare
  v_uid uuid := auth.uid();
  v_prog public.progress;
  v_raffle public.raffles;
begin
  if v_uid is null then raise exception 'Not authenticated'; end if;
  if p_tickets <= 0 or p_tickets > 9999 then raise exception 'Jumlah tiket tidak valid'; end if;

  v_prog := public.sync_user_progress(v_uid);

  select * into v_raffle from public.raffles where id = p_raffle_id;
  if not found then raise exception 'Undian tidak ditemukan'; end if;
  if v_raffle.status <> 'live' or v_raffle.ends_at <= now() then raise exception 'Undian sudah berakhir atau belum aktif'; end if;

  if v_prog.raffle_tickets < p_tickets then raise exception 'Tiket tidak mencukupi'; end if;

  -- Deduct tickets
  update public.progress
  set raffle_tickets = raffle_tickets - p_tickets, updated_at = now()
  where user_id = v_uid;

  -- Upsert entries
  insert into public.raffle_entries (raffle_id, user_id, tickets)
  values (p_raffle_id, v_uid, p_tickets)
  on conflict (raffle_id, user_id)
  do update set tickets = raffle_entries.tickets + p_tickets;

  insert into public.ledger (user_id, kind, gems_delta, tickets_delta, ref)
  values (v_uid, 'enter_raffle', 0, -p_tickets, p_raffle_id);

  return jsonb_build_object('success', true, 'raffle_id', p_raffle_id, 'tickets_entered', p_tickets);
end;
$$ language plpgsql security definer;
