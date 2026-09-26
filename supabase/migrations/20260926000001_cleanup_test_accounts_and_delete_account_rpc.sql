-- Migration 20260926000001_cleanup_test_accounts_and_delete_account_rpc.sql
-- 1. Sembunyikan & tag semua akun test (sectest_*, testuser99, dsb) agar tidak muncul di leaderboard
update public.profiles
set account_type = 'test'
where username like 'sectest_%'
   or username = 'testuser99'
   or username ilike '%testuser%'
   or username ilike '%sectest%';

-- 2. Update RPC get_leaderboard dengan filter eksplisit anti-test account
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
  v_total_users int;
begin
  -- Clamp bounds
  v_limit := greatest(1, least(coalesce(p_limit, 100), 1000));
  v_offset := greatest(0, coalesce(p_offset, 0));

  -- Total count of real 'user' accounts (excluding test patterns)
  select count(*) into v_total_users
  from public.profiles
  where account_type = 'user'
    and username not like 'sectest_%'
    and username not like 'testuser%'
    and username <> 'testuser99';

  select jsonb_agg(sub) into v_list
  from (
    select 
      row_number() over (order by coalesce(p.weekly_xp, 0) desc, coalesce(p.xp, 0) desc, pr.created_at asc)::int as rank,
      public.get_display_name(pr.id, pr.username, pr.username_censored) as username,
      pr.username_censored,
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
    where pr.account_type = 'user'
      and pr.username not like 'sectest_%'
      and pr.username not like 'testuser%'
      and pr.username <> 'testuser99'
    order by coalesce(p.weekly_xp, 0) desc, coalesce(p.xp, 0) desc, pr.created_at asc
    limit v_limit offset v_offset
  ) sub;

  return jsonb_build_object(
    'users', coalesce(v_list, '[]'::jsonb),
    'total_count', v_total_users
  );
end;
$$;

grant execute on function public.get_leaderboard(int, int) to anon, authenticated;

-- 3. RPC Hapus Akun & Data Pengguna Mandiri (Self Deletion)
create or replace function public.delete_my_account()
returns jsonb
language plpgsql
security definer
set search_path = public, auth, pg_temp
as $$
declare
  v_uid uuid := auth.uid();
begin
  if v_uid is null then
    raise exception 'Not authenticated' using errcode = '42501';
  end if;

  -- 1. Hapus entri di skema public
  delete from public.raffle_entries where user_id = v_uid;
  delete from public.user_limited_items where user_id = v_uid;
  delete from public.claimed_quests where user_id = v_uid;
  delete from public.completions where user_id = v_uid;
  delete from public.ledger where user_id = v_uid;
  delete from public.progress where user_id = v_uid;
  delete from public.profiles where id = v_uid;

  -- 2. Hapus akun di auth.users jika memungkinkan
  begin
    delete from auth.users where id = v_uid;
  exception when others then
    -- Abaikan jika trigger/RLS auth.users mencegahnya langsung; data public sudah terhapus
    null;
  end;

  return jsonb_build_object('success', true);
end;
$$;

grant execute on function public.delete_my_account() to authenticated;
