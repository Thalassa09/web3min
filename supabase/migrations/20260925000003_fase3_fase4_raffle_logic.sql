-- Migration 20260925000003: Fase 3 & 4 Raffle Draw, Item Distribution & Winner Verification

create extension if not exists pgcrypto;

-- 1. Hardened enter_raffle with slot_type conditions & duplicate item checks
create or replace function public.enter_raffle(
  p_raffle_id text,
  p_tickets integer,
  p_wallet_address text default null,
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
  v_profile public.profiles;
  v_progress public.progress;
  v_now timestamptz := now();
  v_allowed boolean;
  v_clean_wallet text := lower(trim(coalesce(p_wallet_address, '')));
  v_clean_x text := trim(coalesce(p_x_handle, ''));
  v_user_tickets int;
  v_is_gtd_or_wl boolean;
begin
  if v_uid is null then 
    raise exception 'Not authenticated' using errcode = '42501'; 
  end if;

  -- Verify account type: test and demo accounts cannot enter raffles
  select * into v_profile from public.profiles where id = v_uid;
  if v_profile.account_type in ('test', 'demo') then
    raise exception 'Akun test dan demo tidak dapat mengikuti undian.' using errcode = 'P0001';
  end if;

  -- Rate limit
  v_allowed := public.check_rate_limit('enter_raffle', v_uid::text, 15, 60);
  if not v_allowed then
    raise exception 'Terlalu banyak permintaan undian. Tunggu sebentar.' using errcode = 'P0001';
  end if;

  if p_raffle_id is null or length(p_raffle_id) < 2 or length(p_raffle_id) > 64 then
    raise exception 'ID undian tidak valid' using errcode = '22023';
  end if;

  if p_tickets <= 0 or p_tickets > 1000 then 
    raise exception 'Jumlah tiket tidak valid' using errcode = '22023'; 
  end if;

  select * into v_raffle from public.raffles where id = p_raffle_id for share;
  if not found then 
    raise exception 'Undian tidak ditemukan' using errcode = 'P0001'; 
  end if;

  if v_raffle.status <> 'live' or (v_raffle.ends_at is not null and v_raffle.ends_at <= v_now) then 
    raise exception 'Undian sudah berakhir atau belum aktif' using errcode = 'P0001'; 
  end if;

  v_is_gtd_or_wl := (v_raffle.slot_type in ('GTD', 'WL') or v_raffle.category = 'nft');

  -- Wallet validation: WAJIB untuk GTD/WL, opsional untuk ITEM/GROUP
  if v_is_gtd_or_wl then
    if v_clean_wallet !~ '^0x[a-f0-9]{40}$' then
      raise exception 'Format alamat wallet EVM tidak valid. Harus diawali 0x dan 40 karakter hex.' using errcode = '22023';
    end if;
  else
    if v_clean_wallet <> '' and v_clean_wallet !~ '^0x[a-f0-9]{40}$' then
      raise exception 'Format alamat wallet EVM tidak valid.' using errcode = '22023';
    end if;
    if v_clean_wallet = '' then
      v_clean_wallet := null;
    end if;
  end if;

  -- Normalize X handle
  if v_clean_x <> '' and v_clean_x like '@%' then
    v_clean_x := substr(v_clean_x, 2);
  end if;

  -- Check if raffle requires X follow
  if v_raffle.requirement_x_handle is not null and trim(v_raffle.requirement_x_handle) <> '' then
    if v_clean_x = '' or v_clean_x !~ '^[a-zA-Z0-9_]{1,15}$' then
      raise exception 'Undian ini mewajibkan akun X yang valid untuk verifikasi syarat follow (%s).' , v_raffle.requirement_x_handle using errcode = '22023';
    end if;
  end if;

  -- Duplicate item check for ITEM
  if v_raffle.slot_type = 'ITEM' and v_raffle.item_id is not null then
    select * into v_progress from public.progress where user_id = v_uid;
    if exists (select 1 from public.user_limited_items where user_id = v_uid and item_id = v_raffle.item_id)
       or (v_raffle.item_id = any(v_progress.outfits))
       or (v_raffle.item_id = any(v_progress.badges)) then
      raise exception 'Kamu sudah punya item ini' using errcode = 'P0001';
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
    wallet_address = coalesce(v_clean_wallet, raffle_entries.wallet_address),
    x_handle = case when v_clean_x <> '' then v_clean_x else raffle_entries.x_handle end,
    updated_at = v_now;

  -- Save last wallet & X handle to user profile
  update public.profiles
  set 
    last_wallet_address = coalesce(v_clean_wallet, last_wallet_address),
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

-- 2. Refined admin_trigger_draw
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
  v_winner_slots int;
  v_winners jsonb := '[]'::jsonb;
  v_reserves jsonb := '[]'::jsonb;
  v_chosen record;
  v_is_gtd_or_wl boolean;
begin
  if not public.admin_verify_key(p_key) then
    raise exception 'Unauthorized: Invalid admin key' using errcode = '42501';
  end if;

  select * into v_raffle from public.raffles where id = p_raffle_id;
  if not found then
    raise exception 'Undian tidak ditemukan' using errcode = 'P0001';
  end if;

  v_is_gtd_or_wl := (v_raffle.slot_type in ('GTD', 'WL') or v_raffle.category = 'nft');
  v_winner_slots := greatest(1, v_raffle.winner_count);
  v_needed := v_winner_slots * 2; -- primary + reserves

  -- Temporary table of eligible candidates (exclude test & demo accounts)
  create temp table temp_draw_candidates on commit drop as
  select 
    re.user_id,
    coalesce(p.display_name, p.username, 'Petualang') as display_name,
    p.username,
    re.wallet_address,
    re.x_handle,
    re.tickets
  from public.raffle_entries re
  left join public.profiles p on p.id = re.user_id
  where re.raffle_id = p_raffle_id
    and (p.account_type = 'user' or p.account_type is null)
    and (not v_is_gtd_or_wl or (re.wallet_address ~* '^0x[a-f0-9]{40}$'));

  -- Loop to pick candidates one by one weighted by tickets (WITHOUT replacement)
  while v_picked_count < v_needed and (select count(*) from temp_draw_candidates) > 0 loop
    with weighted as (
      select 
        user_id, display_name, username, wallet_address, x_handle, tickets,
        sum(tickets) over (order by user_id) as cum_weight,
        sum(tickets) over () as total_weight
      from temp_draw_candidates
    ),
    target as (
      select (random() * coalesce((select max(cum_weight) from weighted), 1)) as rand_point
    )
    select user_id, display_name, username, wallet_address, x_handle, tickets
    into v_chosen
    from weighted, target
    where cum_weight >= rand_point
    order by cum_weight asc
    limit 1;

    if v_chosen.user_id is not null then
      v_picked_count := v_picked_count + 1;
      if v_picked_count <= v_winner_slots then
        v_winners := v_winners || jsonb_build_object(
          'user_id', v_chosen.user_id,
          'display_name', v_chosen.display_name,
          'username', v_chosen.username,
          'wallet_address', coalesce(v_chosen.wallet_address, ''),
          'x_handle', coalesce(v_chosen.x_handle, ''),
          'tickets', v_chosen.tickets,
          'rank', v_picked_count,
          'verified', (v_raffle.requirement_x_handle is null or trim(v_raffle.requirement_x_handle) = '')
        );
      else
        v_reserves := v_reserves || jsonb_build_object(
          'user_id', v_chosen.user_id,
          'display_name', v_chosen.display_name,
          'username', v_chosen.username,
          'wallet_address', coalesce(v_chosen.wallet_address, ''),
          'x_handle', coalesce(v_chosen.x_handle, ''),
          'tickets', v_chosen.tickets,
          'rank', v_picked_count - v_winner_slots
        );
      end if;

      delete from temp_draw_candidates where user_id = v_chosen.user_id;
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

-- 3. Refined admin_announce_winners (with atomic item distribution)
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
  v_user_id uuid;
  v_next_edition integer;
  v_item public.limited_items;
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

  -- Verify all slots checked
  for v_elem in select * from jsonb_array_elements(v_winners) loop
    if coalesce((v_elem->>'verified')::boolean, false) is not true then
      raise exception 'Semua slot pemenang harus dicentang "Follow terverifikasi" sebelum diumumkan.' using errcode = '22023';
    end if;
  end loop;

  -- Clean old winners if any
  delete from public.raffle_winners where raffle_id = p_raffle_id;

  -- If ITEM: check edition_total and distribute atomically
  if v_raffle.slot_type = 'ITEM' then
    if v_raffle.item_id is null then
      raise exception 'Item ID belum ditentukan untuk undian item ini.' using errcode = '22023';
    end if;

    select * into v_item from public.limited_items where item_id = v_raffle.item_id for update;
    if not found then
      raise exception 'Item tidak ditemukan di katalog limited.' using errcode = '22023';
    end if;

    if (v_item.edition_issued + jsonb_array_length(v_winners)) > v_item.edition_total then
      raise exception 'Kuota edisi item telah habis! Sisa hanya % buah.' , (v_item.edition_total - v_item.edition_issued) using errcode = '22023';
    end if;
  end if;

  -- Insert verified winners
  for v_elem in select * from jsonb_array_elements(v_winners) loop
    v_user_id := (v_elem->>'user_id')::uuid;
    v_wallet := v_elem->>'wallet_address';
    if v_wallet is not null and length(v_wallet) = 42 then
      v_masked := substr(v_wallet, 1, 6) || '…' || substr(v_wallet, 39, 4);
    else
      v_masked := null;
    end if;

    insert into public.raffle_winners (
      raffle_id, user_id, wallet_address, masked_wallet, x_handle, prize, announced_at, discord_group_link
    ) values (
      p_raffle_id,
      v_user_id,
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

    -- If ITEM: award limited item in user_limited_items and user progress
    if v_raffle.slot_type = 'ITEM' then
      v_next_edition := v_item.edition_issued + 1;
      v_item.edition_issued := v_next_edition;

      insert into public.user_limited_items (user_id, item_id, edition_number, source, created_at)
      values (v_user_id, v_raffle.item_id, v_next_edition, 'raffle', v_now)
      on conflict (user_id, item_id) do nothing;

      if v_item.kind = 'outfit' then
        update public.progress
        set outfits = array_append(outfits, v_raffle.item_id)
        where user_id = v_user_id and not (v_raffle.item_id = any(outfits));
      elsif v_item.kind = 'badge' then
        update public.progress
        set badges = array_append(badges, v_raffle.item_id)
        where user_id = v_user_id and not (v_raffle.item_id = any(badges));
      end if;
    end if;
  end loop;

  -- Commit edition count updates if ITEM
  if v_raffle.slot_type = 'ITEM' then
    update public.limited_items
    set edition_issued = v_item.edition_issued
    where item_id = v_raffle.item_id;
  end if;

  -- Update raffle status to ended
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

-- 4. Refined get_raffle_public_results
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
  v_total_winners integer := 0;
  v_is_winner boolean := false;
  v_user_win_info jsonb := null;
  v_user_item_edition integer := null;
begin
  select * into v_raffle from public.raffles where id = p_raffle_id;
  if not found then
    return jsonb_build_object('success', false, 'error', 'Undian tidak ditemukan');
  end if;

  if v_raffle.status = 'ended' then
    select count(*) into v_total_winners from public.raffle_winners where raffle_id = p_raffle_id;

    select jsonb_agg(
      jsonb_build_object(
        'display_name', coalesce(p.display_name, p.username, 'Petualang'),
        'masked_wallet', rw.masked_wallet,
        'announced_at', rw.announced_at
      ) order by rw.announced_at asc
    ) into v_winners_list
    from (
      select * from public.raffle_winners
      where raffle_id = p_raffle_id
      order by announced_at asc
      limit 5
    ) rw
    left join public.profiles p on p.id = rw.user_id;

    -- Check if current authenticated user is a winner
    if v_uid is not null then
      select exists(select 1 from public.raffle_winners where raffle_id = p_raffle_id and user_id = v_uid) into v_is_winner;
      if v_is_winner then
        if v_raffle.slot_type = 'ITEM' and v_raffle.item_id is not null then
          select edition_number into v_user_item_edition from public.user_limited_items where user_id = v_uid and item_id = v_raffle.item_id limit 1;
        end if;

        select jsonb_build_object(
          'raffle_id', rw.raffle_id,
          'prize', rw.prize,
          'slot_type', v_raffle.slot_type,
          'partner_name', v_raffle.partner_name,
          'official_mint_domain', v_raffle.official_mint_domain,
          'edition_number', v_user_item_edition,
          'discord_group_link', case when v_raffle.slot_type = 'GROUP' then v_raffle.discord_group_link else null end,
          'announced_at', rw.announced_at
        ) into v_user_win_info
        from public.raffle_winners rw
        where rw.raffle_id = p_raffle_id and rw.user_id = v_uid;
      end if;
    end if;
  end if;

  return jsonb_build_object(
    'success', true,
    'status', v_raffle.status,
    'slot_type', v_raffle.slot_type,
    'seed_hash', v_raffle.seed_hash,
    'draw_seed', case when v_raffle.status = 'ended' then v_raffle.draw_seed else null end,
    'winners', coalesce(v_winners_list, '[]'::jsonb),
    'total_winners', v_total_winners,
    'is_user_winner', v_is_winner,
    'user_win_info', v_user_win_info
  );
end;
$$;

grant execute on function public.get_raffle_public_results(text) to authenticated, anon;
grant execute on function public.enter_raffle(text, integer, text, text) to authenticated;
grant execute on function public.admin_trigger_draw(text, text) to authenticated, anon;
grant execute on function public.admin_announce_winners(text, text) to authenticated, anon;
