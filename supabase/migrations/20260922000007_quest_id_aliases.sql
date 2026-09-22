-- Migration 20260922000007_quest_id_aliases.sql
-- Allow claim_quest to accept both legacy ('lesson-1', 'xp-30', 'story-1')
-- and client canonical ('lesson', 'xp', 'kisah', 'perfect') identifiers.

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
begin
  if v_uid is null then raise exception 'Not authenticated' using errcode = '42501'; end if;

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

  -- Check if already claimed under either the canonical or legacy format today
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

  insert into public.claimed_quests (user_id, quest_id, quest_date)
  values (v_uid, v_canonical_id, v_today);

  update public.progress
  set gems = least(999999, gems + v_reward_gems), updated_at = v_now
  where user_id = v_uid;

  insert into public.ledger (user_id, kind, gems_delta, tickets_delta, ref)
  values (v_uid, 'quest_claim', v_reward_gems, 0, v_canonical_id);

  return jsonb_build_object('quest_id', v_canonical_id, 'reward_gems', v_reward_gems);
end;
$$;
