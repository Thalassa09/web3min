-- Migration 20260925000001: Fase 1 Leaderboard Censorship & Real Telemetry

-- 1. Extend public.profiles with censorship & account type columns
alter table public.profiles add column if not exists username_censored boolean not null default false;
alter table public.profiles add column if not exists account_type text not null default 'user' check (account_type in ('user', 'test', 'demo'));

-- 2. Censorship Audit Logs Table
create table if not exists public.censorship_logs (
  id bigserial primary key,
  user_id uuid not null references public.profiles(id) on delete cascade,
  action text not null, -- 'censored' | 'restored'
  reason text default '',
  performed_by text default 'system',
  created_at timestamptz not null default now()
);

alter table public.censorship_logs enable row level security;
drop policy if exists "admin view censorship logs" on public.censorship_logs;
create policy "admin view censorship logs" on public.censorship_logs for select using (true);

-- 3. Server-side Offensive Username Detection Function
create or replace function public.is_offensive(p_username text)
returns boolean
language plpgsql
immutable
as $$
declare
  v_norm text;
  v_squeezed text;
  v_blocklist text[] := array[
    'memek', 'kontol', 'jembot', 'jembut', 'henceut', 'puki', 'pantek', 'itil',
    'ngocok', 'ngentot', 'pepek', 'asu', 'bajingan', 'bangsat', 'babi', 'toket',
    'tetek', 'boker', 'tahi', 'berak', 'lonte', 'bispak', 'colmek', 'coli', 'titit',
    'fuck', 'shit', 'bitch', 'cunt', 'dick', 'pussy', 'cock', 'nigger', 'fag', 'whore', 'slut', 'penis', 'vagina'
  ];
  v_word text;
begin
  if p_username is null or trim(p_username) = '' then
    return false;
  end if;

  v_norm := lower(trim(p_username));

  -- Leetspeak replacement
  v_norm := replace(v_norm, '3', 'e');
  v_norm := replace(v_norm, '0', 'o');
  v_norm := replace(v_norm, '1', 'i');
  v_norm := replace(v_norm, '!', 'i');
  v_norm := replace(v_norm, '|', 'i');
  v_norm := replace(v_norm, '4', 'a');
  v_norm := replace(v_norm, '@', 'a');
  v_norm := replace(v_norm, '5', 's');
  v_norm := replace(v_norm, '$', 's');
  v_norm := replace(v_norm, '7', 't');
  v_norm := replace(v_norm, '+', 't');
  v_norm := replace(v_norm, '8', 'b');
  v_norm := replace(v_norm, '2', 'z');

  -- Substring check on normalized
  foreach v_word in array v_blocklist loop
    if position(v_word in v_norm) > 0 then
      return true;
    end if;
  end loop;

  -- Squeeze consecutive repeated letters (e.g. mmmmeeeeek -> mek)
  v_squeezed := regexp_replace(v_norm, '(.)\1+', '\1', 'g');
  foreach v_word in array v_blocklist loop
    if position(v_word in v_squeezed) > 0 then
      return true;
    end if;
  end loop;

  return false;
end;
$$;

-- 4. Function to generate a stable display name for censored users: "Petualang#" + 4 digits
create or replace function public.get_display_name(p_user_id uuid, p_username text, p_censored boolean)
returns text
language plpgsql
immutable
as $$
begin
  if p_censored is true then
    return 'Petualang#' || lpad((abs(hashtext(p_user_id::text)) % 9000 + 1000)::text, 4, '0');
  else
    return coalesce(p_username, 'pelajar');
  end if;
end;
$$;

-- 5. Auto-tag existing accounts
-- a. Mark sectest_* as 'test'
update public.profiles
set account_type = 'test'
where username like 'sectest_%';

-- b. Mark seed/fiktif accounts as 'demo'
update public.profiles
set account_type = 'demo'
where username in ('satoshi_jkt', 'kripto_bunda', 'defi_ninja', 'hawa_sol', 'bayu_eth', 'rani_web3', 'dimas_node', 'alif_zk', 'cahya_l2', 'budi_airdrop')
   or username ~ '^(garuda_hash|rendang_roll|bandung_coder|medan_miner|nusantara_node|merdeka_crypto|kopi_blockchain|batik_nft|borobudur_dao|komodo_swap|bali_validator|monas_yield|wayang_zk|gamelan_eth|satria_defi|surabaya_staking|makassar_pool|jogja_web3|bogor_blocks|semarang_sol|lombok_ledger|papua_protocol|aceh_arbitrum|banten_base|riau_router)';

-- c. Run is_offensive on all accounts, mark offensive ones as censored
update public.profiles
set username_censored = true
where public.is_offensive(username);

-- 6. Updated public.get_leaderboard RPC
-- - Filters pr.account_type = 'user' ONLY
-- - Sorts by coalesce(p.weekly_xp, 0) desc, coalesce(p.xp, 0) desc, pr.created_at asc
-- - HANYA mengirim display_name (nama tampil tersensor), BUKAN nama asli jika tersensor
-- - Includes total_active_users count in response metadata or returns clean list
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

  -- Total count of real 'user' accounts
  select count(*) into v_total_users
  from public.profiles
  where account_type = 'user';

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

-- 7. Update username_available RPC to enforce 3-20 chars [a-z0-9_] + is_offensive
create or replace function public.username_available(p_username text)
returns boolean
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_clean text := lower(trim(coalesce(p_username, '')));
  v_taken boolean;
begin
  if length(v_clean) < 3 or length(v_clean) > 20 then
    return false;
  end if;

  if v_clean !~ '^[a-z0-9_]{3,20}$' then
    return false;
  end if;

  if public.is_offensive(v_clean) then
    return false;
  end if;

  select exists(select 1 from public.profiles where lower(username) = v_clean) into v_taken;
  return not v_taken;
end;
$$;

grant execute on function public.username_available(text) to anon, authenticated;

-- 8. RPC: change_username (allows censored or normal user to set a clean username)
create or replace function public.change_username(p_new_username text)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_uid uuid := auth.uid();
  v_clean text := lower(trim(coalesce(p_new_username, '')));
  v_taken boolean;
begin
  if v_uid is null then
    raise exception 'Not authenticated' using errcode = '42501';
  end if;

  if length(v_clean) < 3 or length(v_clean) > 20 or v_clean !~ '^[a-z0-9_]{3,20}$' then
    raise exception 'Username harus 3-20 karakter berupa huruf kecil, angka, atau underscore.' using errcode = '22023';
  end if;

  if public.is_offensive(v_clean) then
    raise exception 'Username mengandung kata yang tidak sesuai pedoman komunitas.' using errcode = '22023';
  end if;

  select exists(select 1 from public.profiles where lower(username) = v_clean and id <> v_uid) into v_taken;
  if v_taken then
    raise exception 'Username sudah dipakai oleh pengguna lain.' using errcode = '23505';
  end if;

  update public.profiles
  set 
    username = v_clean,
    username_censored = false,
    updated_at = now()
  where id = v_uid;

  insert into public.censorship_logs (user_id, action, reason, performed_by)
  values (v_uid, 'restored', 'Pengguna mengganti ke username yang bersih', 'user');

  return jsonb_build_object(
    'success', true,
    'username', v_clean,
    'username_censored', false
  );
end;
$$;

grant execute on function public.change_username(text) to authenticated;

-- 9. Admin RPC: Set censorship on user manually
create or replace function public.admin_set_user_censorship(
  p_key text,
  p_user_id uuid,
  p_censored boolean,
  p_reason text default ''
)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  if not public.admin_verify_key(p_key) then
    raise exception 'Unauthorized: Invalid admin key' using errcode = '42501';
  end if;

  update public.profiles
  set username_censored = p_censored, updated_at = now()
  where id = p_user_id;

  insert into public.censorship_logs (user_id, action, reason, performed_by)
  values (
    p_user_id,
    case when p_censored then 'censored' else 'restored' end,
    coalesce(p_reason, 'Tindakan manual admin'),
    'admin'
  );

  return jsonb_build_object('success', true, 'censored', p_censored);
end;
$$;

grant execute on function public.admin_set_user_censorship(text, uuid, boolean, text) to authenticated, anon;

-- 10. Admin RPC: Get full list of users with censorship & account type
create or replace function public.admin_get_users(
  p_key text,
  p_filter_type text default 'all'
)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_res jsonb;
begin
  if not public.admin_verify_key(p_key) then
    raise exception 'Unauthorized: Invalid admin key' using errcode = '42501';
  end if;

  select jsonb_agg(
    jsonb_build_object(
      'id', pr.id,
      'username', pr.username,
      'display_name', public.get_display_name(pr.id, pr.username, pr.username_censored),
      'username_censored', pr.username_censored,
      'account_type', pr.account_type,
      'xp', coalesce(p.xp, 0),
      'weekly_xp', coalesce(p.weekly_xp, 0),
      'streak', coalesce(p.streak, 0),
      'created_at', pr.created_at
    ) order by coalesce(p.weekly_xp, 0) desc, pr.created_at asc
  ) into v_res
  from public.profiles pr
  left join public.progress p on p.user_id = pr.id
  where (
    p_filter_type = 'all' or
    (p_filter_type = 'censored' and pr.username_censored = true) or
    (p_filter_type in ('user', 'test', 'demo') and pr.account_type = p_filter_type)
  );

  return coalesce(v_res, '[]'::jsonb);
end;
$$;

grant execute on function public.admin_get_users(text, text) to authenticated, anon;
