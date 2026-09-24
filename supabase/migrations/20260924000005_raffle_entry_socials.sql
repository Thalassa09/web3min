-- Migration 20260924000005: Raffle Total Overhaul (Mint Slots, EVM Wallet, Commit-Reveal & Admin Verification)

-- Ensure pgcrypto extension for gen_random_bytes and digest
create extension if not exists pgcrypto;

-- 1. Alter raffle_entries table
alter table public.raffle_entries add column if not exists wallet_address text default '';
alter table public.raffle_entries add column if not exists x_handle text default '';
alter table public.raffle_entries add column if not exists updated_at timestamptz default now();
alter table public.raffle_entries add column if not exists discord text default '';

-- 2. Alter profiles table
alter table public.profiles add column if not exists last_wallet_address text default '';
alter table public.profiles add column if not exists discord text default '';

-- 3. Alter raffles table
alter table public.raffles add column if not exists requirement_x_handle text default '';
alter table public.raffles add column if not exists official_mint_domain text default '';
alter table public.raffles add column if not exists announcement_date text default '';
alter table public.raffles add column if not exists seed_hash text default '';
alter table public.raffles add column if not exists draw_seed text default '';
alter table public.raffles add column if not exists candidates jsonb default '{"winners":[],"reserves":[]}'::jsonb;
alter table public.raffles add column if not exists discord_group_link text default '';

-- 4. Alter raffle_winners table
alter table public.raffle_winners add column if not exists wallet_address text default '';
alter table public.raffle_winners add column if not exists masked_wallet text default '';
alter table public.raffle_winners add column if not exists x_handle text default '';
alter table public.raffle_winners add column if not exists prize text default '';
alter table public.raffle_winners add column if not exists discord_group_link text default '';

-- Generate commit-reveal seed_hash for any existing raffles without one
do $$
declare
  r record;
  v_seed text;
  v_hash text;
begin
  for r in select id from public.raffles where seed_hash is null or seed_hash = '' loop
    v_seed := encode(extensions.gen_random_bytes(32), 'hex');
    v_hash := encode(extensions.digest(v_seed, 'sha256'), 'hex');
    update public.raffles
    set draw_seed = v_seed, seed_hash = v_hash
    where id = r.id;
  end loop;
exception when others then
  -- Fallback if pgcrypto schema differs
  for r in select id from public.raffles where seed_hash is null or seed_hash = '' loop
    v_seed := md5(random()::text || clock_timestamp()::text) || md5(r.id || random()::text);
    v_hash := md5('seed:' || v_seed);
    update public.raffles
    set draw_seed = v_seed, seed_hash = v_hash
    where id = r.id;
  end loop;
end;
$$;

-- Drop old signatures of enter_raffle
drop function if exists public.enter_raffle(text, integer);
drop function if exists public.enter_raffle(text, integer, text);
drop function if exists public.enter_raffle(text, integer, text, text);

-- 5. RPC: enter_raffle with mandatory EVM wallet validation
create or replace function public.enter_raffle(
  p_raffle_id text,
  p_tickets integer,
  p_wallet_address text,
  p_x_handle text default ''
)
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
  v_clean_wallet text := lower(trim(coalesce(p_wallet_address, '')));
  v_clean_x text := trim(coalesce(p_x_handle, ''));
  v_user_tickets int;
begin
  if v_uid is null then 
    raise exception 'Not authenticated' using errcode = '42501'; 
  end if;

  -- Rate limit: max 15 enters per minute
  v_allowed := public.check_rate_limit('enter_raffle', v_uid::text, 15, 60);
  if not v_allowed then
    raise exception 'Terlalu banyak permintaan undian. Tunggu sebentar.' using errcode = 'P0001';
  end if;

  -- Validate raffle ID
  if p_raffle_id is null or length(p_raffle_id) < 2 or length(p_raffle_id) > 64 then
    raise exception 'ID undian tidak valid' using errcode = '22023';
  end if;

  -- Validate ticket count
  if p_tickets <= 0 or p_tickets > 1000 then 
    raise exception 'Jumlah tiket tidak valid' using errcode = '22023'; 
  end if;

  -- Validate EVM wallet: strictly 0x followed by 40 hex characters
  if v_clean_wallet !~ '^0x[a-f0-9]{40}$' then
    raise exception 'Format alamat wallet EVM tidak valid. Harus diawali 0x dan 40 karakter hex.' using errcode = '22023';
  end if;

  -- Normalize X handle
  if v_clean_x <> '' and v_clean_x like '@%' then
    v_clean_x := substr(v_clean_x, 2);
  end if;

  select * into v_raffle from public.raffles where id = p_raffle_id for share;
  if not found then 
    raise exception 'Undian tidak ditemukan' using errcode = 'P0001'; 
  end if;

  -- Validate raffle schedule
  if v_raffle.status <> 'live' or (v_raffle.ends_at is not null and v_raffle.ends_at <= v_now) then 
    raise exception 'Undian sudah berakhir atau belum aktif' using errcode = 'P0001'; 
  end if;

  -- Check if raffle requires X follow
  if v_raffle.requirement_x_handle is not null and trim(v_raffle.requirement_x_handle) <> '' then
    if v_clean_x = '' or v_clean_x !~ '^[a-zA-Z0-9_]{1,15}$' then
      raise exception 'Undian ini mewajibkan akun X yang valid untuk verifikasi syarat follow (@%s).' , v_raffle.requirement_x_handle using errcode = '22023';
    end if;
  end if;

  -- Sync and deduct user tickets
  perform public.sync_user_progress(v_uid);

  update public.progress
  set raffle_tickets = raffle_tickets - p_tickets, updated_at = v_now
  where user_id = v_uid and raffle_tickets >= p_tickets;

  if not found then
    raise exception 'Tiket tidak mencukupi' using errcode = 'P0001';
  end if;

  -- Upsert entry
  insert into public.raffle_entries (raffle_id, user_id, tickets, wallet_address, x_handle, entered_at, updated_at)
  values (p_raffle_id, v_uid, p_tickets, v_clean_wallet, v_clean_x, v_now, v_now)
  on conflict (raffle_id, user_id)
  do update set 
    tickets = raffle_entries.tickets + p_tickets,
    wallet_address = v_clean_wallet,
    x_handle = case when v_clean_x <> '' then v_clean_x else raffle_entries.x_handle end,
    updated_at = v_now;

  -- Save last wallet & X handle to user profile
  update public.profiles
  set 
    last_wallet_address = v_clean_wallet,
    twitter = case when v_clean_x <> '' then v_clean_x else twitter end,
    updated_at = v_now
  where id = v_uid;

  -- Record in ledger
  insert into public.ledger (user_id, kind, gems_delta, tickets_delta, ref)
  values (v_uid, 'enter_raffle', 0, -p_tickets, p_raffle_id);

  select tickets into v_user_tickets from public.raffle_entries where raffle_id = p_raffle_id and user_id = v_uid;

  return jsonb_build_object(
    'success', true, 
    'raffle_id', p_raffle_id, 
    'tickets_entered', p_tickets,
    'total_user_tickets', v_user_tickets,
    'wallet_address', v_clean_wallet,
    'x_handle', v_clean_x
  );
end;
$$;

grant execute on function public.enter_raffle(text, integer, text, text) to authenticated;

-- 6. RPC: update_raffle_entry_wallet (allows participant to update wallet/handle until ends_at)
create or replace function public.update_raffle_entry_wallet(
  p_raffle_id text,
  p_wallet_address text,
  p_x_handle text default ''
)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_uid uuid := auth.uid();
  v_raffle public.raffles;
  v_clean_wallet text := lower(trim(coalesce(p_wallet_address, '')));
  v_clean_x text := trim(coalesce(p_x_handle, ''));
  v_now timestamptz := now();
begin
  if v_uid is null then
    raise exception 'Not authenticated' using errcode = '42501';
  end if;

  if v_clean_wallet !~ '^0x[a-f0-9]{40}$' then
    raise exception 'Format alamat wallet EVM tidak valid' using errcode = '22023';
  end if;

  if v_clean_x <> '' and v_clean_x like '@%' then
    v_clean_x := substr(v_clean_x, 2);
  end if;

  select * into v_raffle from public.raffles where id = p_raffle_id;
  if not found then
    raise exception 'Undian tidak ditemukan' using errcode = 'P0001';
  end if;

  if v_raffle.ends_at is not null and v_raffle.ends_at <= v_now then
    raise exception 'Undian sudah ditutup, wallet terkunci dan tidak dapat diubah' using errcode = 'P0001';
  end if;

  if v_raffle.requirement_x_handle is not null and trim(v_raffle.requirement_x_handle) <> '' then
    if v_clean_x = '' or v_clean_x !~ '^[a-zA-Z0-9_]{1,15}$' then
      raise exception 'Undian ini mewajibkan akun X yang valid' using errcode = '22023';
    end if;
  end if;

  update public.raffle_entries
  set 
    wallet_address = v_clean_wallet,
    x_handle = case when v_clean_x <> '' then v_clean_x else x_handle end,
    updated_at = v_now
  where raffle_id = p_raffle_id and user_id = v_uid;

  if not found then
    raise exception 'Belum terdaftar di undian ini' using errcode = 'P0001';
  end if;

  update public.profiles
  set 
    last_wallet_address = v_clean_wallet,
    twitter = case when v_clean_x <> '' then v_clean_x else twitter end,
    updated_at = v_now
  where id = v_uid;

  return jsonb_build_object(
    'success', true,
    'wallet_address', v_clean_wallet,
    'x_handle', v_clean_x
  );
end;
$$;

grant execute on function public.update_raffle_entry_wallet(text, text, text) to authenticated;

-- 7. Drop and replace admin_upsert_raffle
drop function if exists public.admin_upsert_raffle(text, text, text, text, text, text, text, timestamptz, int, int, text, text, text, text, text, jsonb, boolean);
drop function if exists public.admin_upsert_raffle(text, text, text, text, text, text, text, timestamptz, int, int, text, text, text, text, text, jsonb, boolean, text, text, text, text);

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
  p_is_simulation boolean default false,
  p_requirement_x_handle text default '',
  p_official_mint_domain text default '',
  p_announcement_date text default '',
  p_discord_group_link text default ''
)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_clean_id text;
  v_seed text;
  v_hash text;
  v_prize_num text;
  v_existing_seed text;
  v_existing_hash text;
begin
  if not public.admin_verify_key(p_key) then
    raise exception 'Unauthorized: Invalid admin key' using errcode = '42501';
  end if;

  -- Tolak image_url yang diawali data:
  if p_image_url is not null and lower(trim(p_image_url)) like 'data:%' then
    raise exception 'Gambar format data: base64 ditolak. Pindahkan gambar ke file statis (/public/...) atau storage URL.' using errcode = '22023';
  end if;

  -- Wajib ends_at
  if p_ends_at is null then
    raise exception 'Jadwal berakhir (ends_at) wajib diisi' using errcode = '22023';
  end if;

  -- winner_count harus sama dengan angka di prize jika ada angka
  v_prize_num := substring(p_prize from '([0-9]+)');
  if v_prize_num is not null and v_prize_num <> '' then
    if v_prize_num::int <> greatest(1, coalesce(p_winner_count, 1)) then
      raise exception 'winner_count (% slot) harus sama dengan angka di deskripsi prize (% slot)' , p_winner_count, v_prize_num using errcode = '22023';
    end if;
  end if;

  v_clean_id := trim(p_id);
  if v_clean_id is null or v_clean_id = '' then
    v_clean_id := 'raf-' || substr(md5(random()::text || clock_timestamp()::text), 1, 10);
  end if;

  -- Commit-reveal seed generation
  select draw_seed, seed_hash into v_existing_seed, v_existing_hash from public.raffles where id = v_clean_id;
  if v_existing_seed is not null and v_existing_seed <> '' then
    v_seed := v_existing_seed;
    v_hash := v_existing_hash;
  else
    begin
      v_seed := encode(extensions.gen_random_bytes(32), 'hex');
      v_hash := encode(extensions.digest(v_seed, 'sha256'), 'hex');
    exception when others then
      v_seed := md5(random()::text || clock_timestamp()::text) || md5(v_clean_id || random()::text);
      v_hash := md5('seed:' || v_seed);
    end;
  end if;

  insert into public.raffles (
    id, title, prize, prize_detail, category, status,
    ends_at, ticket_cost, winner_count, image_url,
    nft_network, nft_contract, nft_token_id, nft_rarity,
    perks, is_simulation, starts_at,
    requirement_x_handle, official_mint_domain, announcement_date,
    discord_group_link, seed_hash, draw_seed
  ) values (
    v_clean_id,
    coalesce(p_title, 'Undian Slot Mint NFT'),
    coalesce(p_prize, '1 Slot GTD'),
    coalesce(p_prize_detail, ''),
    coalesce(p_category, 'nft'),
    coalesce(p_status, 'live'),
    p_ends_at,
    greatest(1, coalesce(p_ticket_cost, 1)),
    greatest(1, coalesce(p_winner_count, 1)),
    coalesce(p_image_url, ''),
    coalesce(p_nft_network, 'Base'),
    coalesce(p_nft_contract, ''),
    coalesce(p_nft_token_id, ''),
    coalesce(p_nft_rarity, 'legendary'),
    coalesce(p_perks, '[]'::jsonb),
    coalesce(p_is_simulation, false),
    now(),
    coalesce(trim(p_requirement_x_handle), ''),
    coalesce(trim(p_official_mint_domain), ''),
    coalesce(trim(p_announcement_date), ''),
    coalesce(trim(p_discord_group_link), ''),
    v_hash,
    v_seed
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
    is_simulation = excluded.is_simulation,
    requirement_x_handle = excluded.requirement_x_handle,
    official_mint_domain = excluded.official_mint_domain,
    announcement_date = excluded.announcement_date,
    discord_group_link = excluded.discord_group_link;

  return jsonb_build_object(
    'success', true,
    'id', v_clean_id,
    'title', p_title,
    'seed_hash', v_hash
  );
end;
$$;

grant execute on function public.admin_upsert_raffle(text, text, text, text, text, text, text, timestamptz, int, int, text, text, text, text, text, jsonb, boolean, text, text, text, text) to anon, authenticated;

-- 8. Admin Participants Query with multi-account wallet indicator
create or replace function public.admin_get_raffle_entries(p_key text, p_raffle_id text)
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

  with multi_wallets as (
    select wallet_address
    from public.raffle_entries
    where wallet_address is not null and wallet_address <> ''
    group by wallet_address
    having count(distinct user_id) > 1
  )
  select jsonb_agg(
    jsonb_build_object(
      'user_id', re.user_id,
      'username', coalesce(p.username, 'pelajar'),
      'wallet_address', coalesce(re.wallet_address, p.last_wallet_address, '-'),
      'x_handle', coalesce(nullif(re.x_handle, ''), nullif(p.twitter, ''), '-'),
      'tickets', re.tickets,
      'entered_at', re.entered_at,
      'is_multi_account', (re.wallet_address in (select wallet_address from multi_wallets))
    ) order by re.tickets desc, re.entered_at asc
  ) into v_res
  from public.raffle_entries re
  left join public.profiles p on p.id = re.user_id
  where re.raffle_id = p_raffle_id;

  return coalesce(v_res, '[]'::jsonb);
end;
$$;

grant execute on function public.admin_get_raffle_entries(text, text) to authenticated, anon;

-- 9. RPC: admin_trigger_draw (Weighted Random TANPA Pengembalian, max 1 slot per user)
create or replace function public.admin_trigger_draw(p_key text, p_raffle_id text)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_raffle public.raffles;
  v_needed int;
  v_picked_count int := 0;
  v_pool_count int;
  v_winner_slots int;
  v_winners jsonb := '[]'::jsonb;
  v_reserves jsonb := '[]'::jsonb;
  v_chosen record;
begin
  if not public.admin_verify_key(p_key) then
    raise exception 'Unauthorized: Invalid admin key' using errcode = '42501';
  end if;

  select * into v_raffle from public.raffles where id = p_raffle_id;
  if not found then
    raise exception 'Undian tidak ditemukan' using errcode = 'P0001';
  end if;

  v_winner_slots := greatest(1, v_raffle.winner_count);
  v_needed := v_winner_slots * 2; -- winner_count utama + winner_count cadangan

  -- Temporary table of eligible candidates
  create temp table temp_candidates on commit drop as
  select 
    re.user_id,
    coalesce(p.username, 'pelajar') as username,
    re.wallet_address,
    re.x_handle,
    re.tickets
  from public.raffle_entries re
  left join public.profiles p on p.id = re.user_id
  where re.raffle_id = p_raffle_id and re.wallet_address ~* '^0x[a-f0-9]{40}$';

  select count(*) into v_pool_count from temp_candidates;

  -- Loop to pick candidates one by one weighted by tickets
  while v_picked_count < v_needed and (select count(*) from temp_candidates) > 0 loop
    -- Pick 1 candidate using weighted random
    with weighted as (
      select 
        user_id, username, wallet_address, x_handle, tickets,
        sum(tickets) over (order by user_id) as cum_weight,
        sum(tickets) over () as total_weight
      from temp_candidates
    ),
    target as (
      select (random() * coalesce((select max(cum_weight) from weighted), 1)) as rand_point
    )
    select user_id, username, wallet_address, x_handle, tickets
    into v_chosen
    from weighted, target
    where cum_weight >= rand_point
    order by cum_weight asc
    limit 1;

    if v_chosen.user_id is not null then
      v_picked_count := v_picked_count + 1;
      if v_picked_count <= v_winner_slots then
        -- Primary winner
        v_winners := v_winners || jsonb_build_object(
          'user_id', v_chosen.user_id,
          'username', v_chosen.username,
          'wallet_address', v_chosen.wallet_address,
          'x_handle', v_chosen.x_handle,
          'tickets', v_chosen.tickets,
          'rank', v_picked_count,
          'verified', false
        );
      else
        -- Reserve winner
        v_reserves := v_reserves || jsonb_build_object(
          'user_id', v_chosen.user_id,
          'username', v_chosen.username,
          'wallet_address', v_chosen.wallet_address,
          'x_handle', v_chosen.x_handle,
          'tickets', v_chosen.tickets,
          'rank', v_picked_count - v_winner_slots
        );
      end if;

      -- Remove from temporary pool to prevent replacement
      delete from temp_candidates where user_id = v_chosen.user_id;
    else
      exit;
    end if;
  end loop;

  update public.raffles
  set 
    status = 'verifying',
    candidates = jsonb_build_object('winners', v_winners, 'reserves', v_reserves)
  where id = p_raffle_id;

  return jsonb_build_object(
    'success', true,
    'status', 'verifying',
    'winner_count', jsonb_array_length(v_winners),
    'reserve_count', jsonb_array_length(v_reserves)
  );
end;
$$;

grant execute on function public.admin_trigger_draw(text, text) to authenticated, anon;

-- 10. RPC: admin_verify_winner
create or replace function public.admin_verify_winner(
  p_key text,
  p_raffle_id text,
  p_user_id text,
  p_verified boolean
)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_raffle public.raffles;
  v_winners jsonb;
  v_new_winners jsonb := '[]'::jsonb;
  v_elem jsonb;
begin
  if not public.admin_verify_key(p_key) then
    raise exception 'Unauthorized' using errcode = '42501';
  end if;

  select * into v_raffle from public.raffles where id = p_raffle_id;
  v_winners := coalesce(v_raffle.candidates->'winners', '[]'::jsonb);

  for v_elem in select * from jsonb_array_elements(v_winners) loop
    if v_elem->>'user_id' = p_user_id then
      v_new_winners := v_new_winners || jsonb_set(v_elem, '{verified}', to_jsonb(p_verified));
    else
      v_new_winners := v_new_winners || v_elem;
    end if;
  end loop;

  update public.raffles
  set candidates = jsonb_set(candidates, '{winners}', v_new_winners)
  where id = p_raffle_id;

  return jsonb_build_object('success', true);
end;
$$;

grant execute on function public.admin_verify_winner(text, text, text, boolean) to authenticated, anon;

-- 11. RPC: admin_swap_reserve_winner (swap unverified winner with top reserve)
create or replace function public.admin_swap_reserve_winner(
  p_key text,
  p_raffle_id text,
  p_winner_user_id text
)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_raffle public.raffles;
  v_winners jsonb;
  v_reserves jsonb;
  v_new_winners jsonb := '[]'::jsonb;
  v_new_reserves jsonb := '[]'::jsonb;
  v_reserve_candidate jsonb;
  v_elem jsonb;
  v_swapped boolean := false;
begin
  if not public.admin_verify_key(p_key) then
    raise exception 'Unauthorized' using errcode = '42501';
  end if;

  select * into v_raffle from public.raffles where id = p_raffle_id;
  v_winners := coalesce(v_raffle.candidates->'winners', '[]'::jsonb);
  v_reserves := coalesce(v_raffle.candidates->'reserves', '[]'::jsonb);

  if jsonb_array_length(v_reserves) = 0 then
    raise exception 'Tidak ada pemenang cadangan yang tersedia' using errcode = 'P0001';
  end if;

  -- Pop first reserve candidate
  v_reserve_candidate := v_reserves->0;
  for i in 1 .. (jsonb_array_length(v_reserves) - 1) loop
    v_new_reserves := v_new_reserves || (v_reserves->i);
  end loop;

  -- Replace target winner
  for v_elem in select * from jsonb_array_elements(v_winners) loop
    if v_elem->>'user_id' = p_winner_user_id and not v_swapped then
      v_new_winners := v_new_winners || jsonb_set(v_reserve_candidate, '{verified}', 'false'::jsonb);
      v_swapped := true;
    else
      v_new_winners := v_new_winners || v_elem;
    end if;
  end loop;

  update public.raffles
  set candidates = jsonb_build_object('winners', v_new_winners, 'reserves', v_new_reserves)
  where id = p_raffle_id;

  return jsonb_build_object('success', true);
end;
$$;

grant execute on function public.admin_swap_reserve_winner(text, text, text) to authenticated, anon;

-- 12. RPC: admin_announce_winners (active only when all slots verified)
create or replace function public.admin_announce_winners(p_key text, p_raffle_id text)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_raffle public.raffles;
  v_winners jsonb;
  v_elem jsonb;
  v_now timestamptz := now();
  v_masked text;
  v_wallet text;
begin
  if not public.admin_verify_key(p_key) then
    raise exception 'Unauthorized' using errcode = '42501';
  end if;

  select * into v_raffle from public.raffles where id = p_raffle_id;
  if not found then
    raise exception 'Undian tidak ditemukan' using errcode = 'P0001';
  end if;

  v_winners := coalesce(v_raffle.candidates->'winners', '[]'::jsonb);
  if jsonb_array_length(v_winners) = 0 then
    raise exception 'Belum ada kandidat pemenang yang diundi' using errcode = 'P0001';
  end if;

  -- Check all slots verified
  for v_elem in select * from jsonb_array_elements(v_winners) loop
    if coalesce((v_elem->>'verified')::boolean, false) is not true then
      raise exception 'Semua slot pemenang harus dicentang "Follow terverifikasi" sebelum diumumkan.' using errcode = '22023';
    end if;
  end loop;

  -- Clean old winners if any
  delete from public.raffle_winners where raffle_id = p_raffle_id;

  -- Insert verified winners
  for v_elem in select * from jsonb_array_elements(v_winners) loop
    v_wallet := v_elem->>'wallet_address';
    v_masked := substr(v_wallet, 1, 6) || '…' || substr(v_wallet, 39, 4);

    insert into public.raffle_winners (
      raffle_id, user_id, wallet_address, masked_wallet, x_handle, prize, announced_at, discord_group_link
    ) values (
      p_raffle_id,
      (v_elem->>'user_id')::uuid,
      v_wallet,
      v_masked,
      coalesce(v_elem->>'x_handle', ''),
      v_raffle.prize,
      v_now,
      coalesce(v_raffle.discord_group_link, '')
    ) on conflict (raffle_id, user_id) do update set
      wallet_address = excluded.wallet_address,
      masked_wallet = excluded.masked_wallet,
      announced_at = v_now;
  end loop;

  -- Update raffle status to ended and publish draw_seed
  update public.raffles
  set 
    status = 'ended',
    drawn_at = v_now
  where id = p_raffle_id;

  return jsonb_build_object(
    'success', true,
    'status', 'ended',
    'announced_count', jsonb_array_length(v_winners)
  );
end;
$$;

grant execute on function public.admin_announce_winners(text, text) to authenticated, anon;

-- 13. RPC: get_raffle_public_results (Public masked winners list & personal win check)
create or replace function public.get_raffle_public_results(p_raffle_id text)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_uid uuid := auth.uid();
  v_raffle public.raffles;
  v_winners_list jsonb := '[]'::jsonb;
  v_is_winner boolean := false;
  v_user_win_info jsonb := null;
begin
  select * into v_raffle from public.raffles where id = p_raffle_id;
  if not found then
    return jsonb_build_object('success', false, 'error', 'Undian tidak ditemukan');
  end if;

  -- Winners only visible if ended
  if v_raffle.status = 'ended' then
    select jsonb_agg(
      jsonb_build_object(
        'masked_wallet', rw.masked_wallet,
        'announced_at', rw.announced_at
      ) order by rw.announced_at asc
    ) into v_winners_list
    from public.raffle_winners rw
    where rw.raffle_id = p_raffle_id;

    if v_uid is not null then
      select jsonb_build_object(
        'prize', rw.prize,
        'wallet_address', rw.wallet_address,
        'official_mint_domain', v_raffle.official_mint_domain,
        'discord_group_link', rw.discord_group_link
      ) into v_user_win_info
      from public.raffle_winners rw
      where rw.raffle_id = p_raffle_id and rw.user_id = v_uid;

      if v_user_win_info is not null then
        v_is_winner := true;
      end if;
    end if;
  end if;

  return jsonb_build_object(
    'success', true,
    'raffle_id', p_raffle_id,
    'status', v_raffle.status,
    'seed_hash', v_raffle.seed_hash,
    'draw_seed', case when v_raffle.status = 'ended' then v_raffle.draw_seed else '' end,
    'winners', coalesce(v_winners_list, '[]'::jsonb),
    'is_user_winner', v_is_winner,
    'user_win_info', v_user_win_info
  );
end;
$$;

grant execute on function public.get_raffle_public_results(text) to authenticated, anon;

-- Ensure RLS on raffle_entries: only owner can select own row
alter table public.raffle_entries enable row level security;
drop policy if exists "own entries read" on public.raffle_entries;
create policy "own entries read" on public.raffle_entries for select using (auth.uid() = user_id);

-- Ensure RLS on raffle_winners:
alter table public.raffle_winners enable row level security;
drop policy if exists "winners readable" on public.raffle_winners;
create policy "winners readable" on public.raffle_winners for select using (auth.uid() = user_id);
