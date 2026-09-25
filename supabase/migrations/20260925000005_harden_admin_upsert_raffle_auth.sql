-- 1. Drop obsolete overloaded version of admin_upsert_raffle with jsonb perks
drop function if exists public.admin_upsert_raffle(
  text, text, text, text, text, text, text, timestamptz, int, int, text, text, text, text, text, jsonb, boolean, text, text, text, text
);

-- 2. Ensure canonical admin_upsert_raffle raises 42501 on unauthorized key to align with admin_delete_raffle
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
    raise exception 'Unauthorized: Invalid admin key' using errcode = '42501';
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
