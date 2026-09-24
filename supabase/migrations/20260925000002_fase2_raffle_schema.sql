-- Migration 20260925000002: Fase 2 & 4 Raffle Schema, Limited Items & Validation

create extension if not exists pgcrypto;

-- 1. Create table limited_items
create table if not exists public.limited_items (
  item_id text primary key,
  item_name text not null,
  kind text not null check (kind in ('outfit', 'badge')),
  is_limited boolean not null default true,
  edition_total integer not null check (edition_total > 0),
  edition_issued integer not null default 0 check (edition_issued >= 0 and edition_issued <= edition_total),
  created_at timestamptz not null default now()
);

alter table public.limited_items enable row level security;
drop policy if exists "Public read limited items" on public.limited_items;
create policy "Public read limited items" on public.limited_items for select using (true);

-- 2. Create table user_limited_items
create table if not exists public.user_limited_items (
  id bigserial primary key,
  user_id uuid not null references public.profiles(id) on delete cascade,
  item_id text not null references public.limited_items(item_id),
  edition_number integer not null,
  source text not null check (source in ('shop', 'raffle', 'reward')),
  created_at timestamptz not null default now(),
  unique (user_id, item_id),
  unique (item_id, edition_number)
);

alter table public.user_limited_items enable row level security;
drop policy if exists "Users view own limited items" on public.user_limited_items;
create policy "Users view own limited items" on public.user_limited_items for select using (auth.uid() = user_id or true);

-- Seed limited items (crown and badge-pioneer)
insert into public.limited_items (item_id, item_name, kind, is_limited, edition_total, edition_issued)
values
  ('crown', 'Mahkota Emas Blobi', 'outfit', true, 5, 0),
  ('badge-pioneer', 'Lencana Kehormatan Pioneer', 'badge', true, 10, 0)
on conflict (item_id) do nothing;

-- 3. Extend public.raffles with new columns
alter table public.raffles add column if not exists created_at timestamptz default now();
alter table public.raffles add column if not exists slot_type text check (slot_type in ('GTD', 'WL', 'GROUP', 'ITEM'));
alter table public.raffles add column if not exists partner_name text;
alter table public.raffles add column if not exists requirement_x_handle text;
alter table public.raffles add column if not exists official_mint_domain text;
alter table public.raffles add column if not exists mint_price text;
alter table public.raffles add column if not exists mint_schedule text;
alter table public.raffles add column if not exists announcement_date text;
alter table public.raffles add column if not exists item_id text references public.limited_items(item_id);
alter table public.raffles add column if not exists seed_hash text;
alter table public.raffles add column if not exists draw_seed text;
alter table public.raffles add column if not exists candidates jsonb;
alter table public.raffles add column if not exists discord_group_link text;

-- 4. Extend public.raffle_entries
alter table public.raffle_entries add column if not exists wallet_address text;
alter table public.raffle_entries add column if not exists x_handle text;
alter table public.raffle_entries add column if not exists updated_at timestamptz default now();

-- 5. RPC get_raffles (public read with all enriched columns)
drop function if exists public.get_raffles();
create or replace function public.get_raffles()
returns table (
  id text,
  title text,
  prize text,
  prize_detail text,
  category text,
  status text,
  ends_at timestamptz,
  ticket_cost integer,
  winner_count integer,
  image_url text,
  nft_network text,
  nft_contract text,
  nft_token_id text,
  nft_rarity text,
  perks jsonb,
  is_simulation boolean,
  created_at timestamptz,
  slot_type text,
  partner_name text,
  requirement_x_handle text,
  official_mint_domain text,
  mint_price text,
  mint_schedule text,
  announcement_date text,
  item_id text,
  seed_hash text,
  draw_seed text,
  discord_group_link text
) language sql security definer as $$
  select
    r.id,
    r.title,
    r.prize,
    r.prize_detail,
    r.category,
    r.status,
    r.ends_at,
    r.ticket_cost,
    r.winner_count,
    r.image_url,
    r.nft_network,
    r.nft_contract,
    r.nft_token_id,
    r.nft_rarity,
    r.perks,
    r.is_simulation,
    r.created_at,
    r.slot_type,
    r.partner_name,
    r.requirement_x_handle,
    r.official_mint_domain,
    r.mint_price,
    r.mint_schedule,
    r.announcement_date,
    r.item_id,
    r.seed_hash,
    case when r.status = 'ended' then r.draw_seed else null end as draw_seed,
    r.discord_group_link
  from public.raffles r
  order by
    case when r.status = 'live' then 1 when r.status = 'upcoming' then 2 else 3 end,
    r.ends_at asc nulls last,
    r.created_at desc;
$$;

-- 6. RPC admin_upsert_raffle
create or replace function public.admin_upsert_raffle(
  p_key text,
  p_id text,
  p_title text,
  p_prize text,
  p_prize_detail text default '',
  p_category text default 'nft',
  p_status text default 'live',
  p_ends_at timestamptz default null,
  p_ticket_cost integer default 1,
  p_winner_count integer default 1,
  p_image_url text default '',
  p_nft_network text default 'Base',
  p_nft_contract text default '',
  p_nft_token_id text default '',
  p_nft_rarity text default 'rare',
  p_perks text[] default array[]::text[],
  p_is_simulation boolean default true,
  p_slot_type text default null,
  p_partner_name text default null,
  p_requirement_x_handle text default null,
  p_official_mint_domain text default null,
  p_mint_price text default null,
  p_mint_schedule text default null,
  p_announcement_date text default null,
  p_item_id text default null,
  p_discord_group_link text default null
) returns jsonb language plpgsql security definer as $$
declare
  v_clean_handle text;
  v_clean_domain text;
  v_seed text;
  v_seed_hash text;
  v_sisa_edisi integer;
begin
  if not public.admin_verify_key(p_key) then
    return jsonb_build_object('success', false, 'error', 'Akses admin ditolak: kunci salah.');
  end if;

  if p_title is null or trim(p_title) = '' then
    return jsonb_build_object('success', false, 'error', 'Judul undian wajib diisi.');
  end if;

  if p_ends_at is null then
    return jsonb_build_object('success', false, 'error', 'Batas waktu undian (ends_at) wajib diisi.');
  end if;

  if p_winner_count is null or p_winner_count <= 0 then
    return jsonb_build_object('success', false, 'error', 'Jumlah pemenang (winner_count) harus lebih dari 0.');
  end if;

  -- Validate image URL
  if p_image_url is not null and p_image_url ilike 'data:%' then
    return jsonb_build_object('success', false, 'error', 'Upload gambar ke storage lalu tempel URL-nya. Base64 data: URL dilarang.');
  end if;

  if (p_image_url is null or trim(p_image_url) = '') and p_slot_type != 'ITEM' then
    return jsonb_build_object('success', false, 'error', 'Gambar undian wajib diisi untuk slot GTD/WL/GROUP.');
  end if;

  -- Validate handle
  if p_requirement_x_handle is not null and trim(p_requirement_x_handle) != '' then
    v_clean_handle := trim(p_requirement_x_handle);
    if v_clean_handle ~ '^@?[A-Za-z0-9_]{1,15}$' then
      if not v_clean_handle like '@%' then
        v_clean_handle := '@' || v_clean_handle;
      end if;
    else
      return jsonb_build_object('success', false, 'error', 'Format handle X tidak valid! Gunakan 1-15 karakter alfanumerik.');
    end if;
  else
    v_clean_handle := null;
  end if;

  -- Validate domain (clean http/https/trailing slashes)
  if p_official_mint_domain is not null and trim(p_official_mint_domain) != '' then
    v_clean_domain := regexp_replace(trim(p_official_mint_domain), '^https?://', '', 'i');
    v_clean_domain := regexp_replace(v_clean_domain, '/.*$', '');
    if v_clean_domain ~ '[/\?#]' or v_clean_domain = '' then
      return jsonb_build_object('success', false, 'error', 'Domain mint resmi harus berupa hostname saja tanpa path (contoh: mint.mitra.xyz).');
    end if;
  else
    v_clean_domain := null;
  end if;

  -- Validate ITEM
  if p_slot_type = 'ITEM' then
    if p_item_id is null or trim(p_item_id) = '' then
      return jsonb_build_object('success', false, 'error', 'Item Blobi limited wajib dipilih.');
    end if;
    select (edition_total - edition_issued) into v_sisa_edisi from public.limited_items where item_id = p_item_id;
    if not found then
      return jsonb_build_object('success', false, 'error', 'Item tidak terdaftar di katalog limited.');
    end if;
    if p_winner_count > v_sisa_edisi then
      return jsonb_build_object('success', false, 'error', 'Sisa edisi item hanya ' || v_sisa_edisi || '.');
    end if;
  end if;

  -- Commit-reveal seed generation if creating new raffle or seed_hash is null
  select draw_seed, seed_hash into v_seed, v_seed_hash from public.raffles where id = p_id;
  if v_seed is null or v_seed = '' then
    v_seed := encode(gen_random_bytes(32), 'hex');
    v_seed_hash := encode(digest(v_seed, 'sha256'), 'hex');
  end if;

  insert into public.raffles (
    id, title, prize, prize_detail, category, status, ends_at,
    ticket_cost, winner_count, image_url, nft_network, nft_contract,
    nft_token_id, nft_rarity, perks, is_simulation, slot_type,
    partner_name, requirement_x_handle, official_mint_domain,
    mint_price, mint_schedule, announcement_date, item_id,
    seed_hash, draw_seed, discord_group_link, created_at
  ) values (
    p_id, p_title, coalesce(p_prize, ''), coalesce(p_prize_detail, ''), p_category, p_status, p_ends_at,
    p_ticket_cost, p_winner_count, coalesce(p_image_url, ''), p_nft_network, p_nft_contract,
    p_nft_token_id, p_nft_rarity, coalesce(to_jsonb(p_perks), '[]'::jsonb), p_is_simulation, p_slot_type,
    p_partner_name, v_clean_handle, v_clean_domain,
    p_mint_price, p_mint_schedule, p_announcement_date, p_item_id,
    v_seed_hash, v_seed, p_discord_group_link, now()
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
    perks = coalesce(to_jsonb(p_perks), '[]'::jsonb),
    is_simulation = excluded.is_simulation,
    slot_type = excluded.slot_type,
    partner_name = excluded.partner_name,
    requirement_x_handle = excluded.requirement_x_handle,
    official_mint_domain = excluded.official_mint_domain,
    mint_price = excluded.mint_price,
    mint_schedule = excluded.mint_schedule,
    announcement_date = excluded.announcement_date,
    item_id = excluded.item_id,
    discord_group_link = excluded.discord_group_link;

  return jsonb_build_object('success', true, 'id', p_id);
end;
$$;
