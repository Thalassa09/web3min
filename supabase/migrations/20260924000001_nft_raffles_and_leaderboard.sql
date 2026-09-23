-- Migration 20260924000001: NFT Raffles, Leaderboard 1-1000 Rewards, and RPCs

-- 1. Extend public.raffles with NFT metadata
alter table public.raffles add column if not exists category text default 'nft';
alter table public.raffles add column if not exists nft_network text default 'Base';
alter table public.raffles add column if not exists nft_contract text default '';
alter table public.raffles add column if not exists nft_token_id text default '';
alter table public.raffles add column if not exists nft_rarity text default 'rare';
alter table public.raffles add column if not exists stars_cost int default 10;
alter table public.raffles add column if not exists perks jsonb default '[]'::jsonb;
alter table public.raffles add column if not exists image_url text default '';

-- 2. Extend public.progress with leaderboard claim tracker
alter table public.progress add column if not exists last_claimed_leaderboard_week text default '';

-- 3. Seed NFT Raffles into public.raffles
insert into public.raffles (
  id, title, prize, prize_detail, category, nft_network, nft_contract, nft_token_id, nft_rarity,
  ticket_cost, stars_cost, winner_count, perks, status, starts_at, ends_at, is_simulation
) values
(
  'raf-genesis-blobi',
  'Genesis Blobi #001 (1-of-1)',
  'Genesis Blobi Mythic NFT ERC-721',
  'Koleksi artefak perdana bersejarah ekosistem Web3min 1-of-1 di Ethereum Mainnet. Membawa hak governance DAO & multiplier 50% XP.',
  'nft',
  'Ethereum',
  '0x3B22...001',
  '#001',
  'mythic',
  1,
  10,
  1,
  '["1/1 ERC-721 Genesis Artifact","0.05 ETH gas grant","+50% XP boost permanen"]'::jsonb,
  'live',
  now(),
  now() + interval '7 days',
  false
),
(
  'raf-cyber-pass',
  'Cyber Pass Web3 Alpha',
  'Cyber Pass Legendary Access Card',
  'Kartu akses eksklusif Base L2 untuk fitur-fitur alpha room, bot riset on-chain khusus petualang, dan boost klasemen 25%.',
  'nft',
  'Base',
  '0x4A18...B45E',
  '#089',
  'legendary',
  1,
  10,
  3,
  '["Akses Alpha Room VIP","Hak suara DAO Web3min","25% Multiplier Klasemen"]'::jsonb,
  'live',
  now(),
  now() + interval '5 days',
  false
),
(
  'raf-defi-sorcerer',
  'DeFi Sorcerer #88',
  'DeFi Sorcerer Rare In-Game Avatar',
  'Karakter mistis penyihir likuiditas di Arbitrum One. Memberikan yield koin harian otomatis dan skin eksklusif di profil petualang.',
  'nft',
  'Arbitrum',
  '0x72C1...9F0A',
  '#088',
  'rare',
  2,
  20,
  5,
  '["Avatar Karakter Eksklusif","20% Yield Koin Harian","Badge Mistis Profil"]'::jsonb,
  'live',
  now(),
  now() + interval '9 days',
  false
),
(
  'raf-gas-mask',
  'Golden Gas Mask #404',
  'Golden Gas Mask Utility Pass',
  'Utility gear langka di Optimism Superchain. Mensubsidi biaya gas saat interaksi modul on-chain serta aura emas di papan klasemen.',
  'nft',
  'Optimism',
  '0x99FF...3301',
  '#404',
  'utility',
  1,
  10,
  10,
  '["Subsidi Gas Fee On-Chain","Aura Emas di Leaderboard","Akses Modul Rahasia"]'::jsonb,
  'live',
  now(),
  now() + interval '12 days',
  false
)
on conflict (id) do update set
  title = excluded.title,
  prize = excluded.prize,
  prize_detail = excluded.prize_detail,
  category = excluded.category,
  nft_network = excluded.nft_network,
  nft_contract = excluded.nft_contract,
  nft_token_id = excluded.nft_token_id,
  nft_rarity = excluded.nft_rarity,
  ticket_cost = excluded.ticket_cost,
  stars_cost = excluded.stars_cost,
  winner_count = excluded.winner_count,
  perks = excluded.perks,
  status = excluded.status;

-- 4. RPC: Claim Weekly Leaderboard Reward
create or replace function public.claim_weekly_leaderboard_reward(p_rank int default 7)
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
  v_updated_gems int;
begin
  if v_uid is null then 
    raise exception 'Not authenticated' using errcode = '42501'; 
  end if;

  -- Hitung ISO Week di Asia/Jakarta
  select to_char(v_now at time zone 'Asia/Jakarta', 'IYYY"-W"IW') into v_week;
  v_prog := public.sync_user_progress(v_uid);

  if v_prog.last_claimed_leaderboard_week = v_week then
    raise exception 'Hadiah klasemen minggu % sudah pernah diklaim.', v_week using errcode = 'P0001';
  end if;

  -- Skema 9 Tingkat Hadiah Koin Peringkat 1 - 1.000
  if p_rank = 1 then v_coins := 1000;
  elsif p_rank = 2 then v_coins := 600;
  elsif p_rank = 3 then v_coins := 400;
  elsif p_rank between 4 and 10 then v_coins := 200;
  elsif p_rank between 11 and 50 then v_coins := 100;
  elsif p_rank between 51 and 100 then v_coins := 60;
  elsif p_rank between 101 and 250 then v_coins := 40;
  elsif p_rank between 251 and 500 then v_coins := 25;
  elsif p_rank between 501 and 1000 then v_coins := 15;
  else v_coins := 5;
  end if;

  update public.progress
  set gems = gems + v_coins,
      last_claimed_leaderboard_week = v_week,
      updated_at = v_now
  where user_id = v_uid
  returning gems into v_updated_gems;

  insert into public.ledger (user_id, kind, gems_delta, tickets_delta, ref)
  values (v_uid, 'claim_leaderboard', v_coins, 0, v_week);

  return jsonb_build_object(
    'success', true,
    'reward', v_coins,
    'week', v_week,
    'rank', p_rank,
    'new_gems', v_updated_gems
  );
end;
$$;

-- 5. RPC: Get Raffle Stats (Publicly callable with aggregated ticket totals)
create or replace function public.get_raffle_stats(p_raffle_id text default null)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_stats jsonb;
begin
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

-- 6. RPC: Get Leaderboard
create or replace function public.get_leaderboard(p_limit int default 100, p_offset int default 0)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_list jsonb;
begin
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
    limit p_limit offset p_offset
  ) sub;

  return coalesce(v_list, '[]'::jsonb);
end;
$$;

-- 7. Permissions & Grants
grant execute on function public.claim_weekly_leaderboard_reward(int) to authenticated;
grant execute on function public.get_leaderboard(int, int) to anon, authenticated;
grant execute on function public.get_raffle_stats(text) to anon, authenticated;
