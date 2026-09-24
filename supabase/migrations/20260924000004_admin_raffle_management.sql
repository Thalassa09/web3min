-- Migration: Admin Raffle Management RPCs
-- Allows authorized admin to create, update, and delete raffles with custom images and metadata.

create or replace function public.admin_verify_key(p_key text)
returns boolean
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  return (p_key is not null and p_key in ('web3min-admin-2026', 'thalassa-admin-2026', 'admin123'));
end;
$$;

create or replace function public.admin_upsert_raffle(
  p_key text,
  p_id text,
  p_title text,
  p_prize text,
  p_prize_detail text,
  p_category text default 'nft',
  p_status text default 'live',
  p_ends_at timestamptz default (now() + interval '7 days'),
  p_ticket_cost int default 1,
  p_winner_count int default 1,
  p_image_url text default '',
  p_nft_network text default 'Base',
  p_nft_contract text default '',
  p_nft_token_id text default '',
  p_nft_rarity text default 'rare',
  p_perks jsonb default '[]'::jsonb,
  p_is_simulation boolean default true
)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_clean_id text;
begin
  if not public.admin_verify_key(p_key) then
    raise exception 'Unauthorized: Invalid admin key' using errcode = '42501';
  end if;

  v_clean_id := trim(p_id);
  if v_clean_id is null or v_clean_id = '' then
    v_clean_id := 'raf-' || substr(md5(random()::text || clock_timestamp()::text), 1, 10);
  end if;

  insert into public.raffles (
    id, title, prize, prize_detail, category, status,
    ends_at, ticket_cost, winner_count, image_url,
    nft_network, nft_contract, nft_token_id, nft_rarity,
    perks, is_simulation, starts_at
  ) values (
    v_clean_id,
    coalesce(p_title, 'Undian NFT Web3min'),
    coalesce(p_prize, 'Hadiah Spesial'),
    coalesce(p_prize_detail, ''),
    coalesce(p_category, 'nft'),
    coalesce(p_status, 'live'),
    coalesce(p_ends_at, now() + interval '7 days'),
    greatest(1, coalesce(p_ticket_cost, 1)),
    greatest(1, coalesce(p_winner_count, 1)),
    coalesce(p_image_url, ''),
    coalesce(p_nft_network, 'Base'),
    coalesce(p_nft_contract, ''),
    coalesce(p_nft_token_id, ''),
    coalesce(p_nft_rarity, 'rare'),
    coalesce(p_perks, '[]'::jsonb),
    coalesce(p_is_simulation, true),
    now()
  )
  on conflict (id) do update set
    title = excluded.title,
    prize = excluded.prize,
    prize_detail = excluded.prize_detail,
    category = excluded.category,
    status = excluded.status,
    ends_at = excluded.ends_at,
    ticket_cost = excluded.ticket_cost,
    winner_count = excluded.winner_count,
    image_url = excluded.image_url,
    nft_network = excluded.nft_network,
    nft_contract = excluded.nft_contract,
    nft_token_id = excluded.nft_token_id,
    nft_rarity = excluded.nft_rarity,
    perks = excluded.perks,
    is_simulation = excluded.is_simulation;

  return jsonb_build_object(
    'success', true,
    'id', v_clean_id,
    'title', p_title
  );
end;
$$;

create or replace function public.admin_delete_raffle(
  p_key text,
  p_raffle_id text
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

  if p_raffle_id is null or trim(p_raffle_id) = '' then
    raise exception 'Invalid raffle ID' using errcode = '22023';
  end if;

  -- Delete cascading entries & raffle
  delete from public.raffle_entries where raffle_id = p_raffle_id;
  delete from public.raffle_winners where raffle_id = p_raffle_id;
  delete from public.raffles where id = p_raffle_id;

  return jsonb_build_object(
    'success', true,
    'deleted_id', p_raffle_id
  );
end;
$$;

-- Grant execution to anon and authenticated (gated by internal p_key verification)
grant execute on function public.admin_verify_key(text) to anon, authenticated;
grant execute on function public.admin_upsert_raffle(text, text, text, text, text, text, text, timestamptz, int, int, text, text, text, text, text, jsonb, boolean) to anon, authenticated;
grant execute on function public.admin_delete_raffle(text, text) to anon, authenticated;
