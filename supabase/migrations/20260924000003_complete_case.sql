-- Migration 20260924000003: Case Study Completion RPC & Verification
-- Completes a case study (bedah kasus), grants 15 XP and 5 gems (first time),
-- inserts into completions with 'case:' prefix, and updates ledger + progress atomically.

create or replace function public.complete_case(p_case_id text)
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
  if v_uid is null then 
    raise exception 'Not authenticated' using errcode = '42501'; 
  end if;

  v_allowed := public.check_rate_limit('complete_case', v_uid::text, 10, 60);
  if not v_allowed then
    raise exception 'Terlalu banyak bedah kasus diselesaikan dalam waktu singkat. Mohon tunggu 1 menit.' using errcode = 'P0001';
  end if;

  if p_case_id is null or length(p_case_id) < 2 or length(p_case_id) > 64 or p_case_id !~ '^[a-zA-Z0-9_\-]+$' then
    raise exception 'Format case_id tidak valid' using errcode = '22023';
  end if;

  v_prog := public.sync_user_progress(v_uid);

  select exists(
    select 1 from public.completions where user_id = v_uid and lesson_id = 'case:' || p_case_id
  ) into v_already;

  if not v_already then
    v_xp_gain := 15;
    v_gems_gain := 5;

    insert into public.completions (user_id, lesson_id, perfect)
    values (v_uid, 'case:' || p_case_id, true);

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
    values (v_uid, 'case_complete', v_gems_gain, 0, p_case_id);
  end if;

  return jsonb_build_object(
    'success', true,
    'xp', v_xp_gain,
    'gems', v_gems_gain,
    'replay', v_already
  );
end;
$$;

grant execute on function public.complete_case(text) to authenticated;
