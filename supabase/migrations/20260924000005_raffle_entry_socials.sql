-- Migration 20260924000005: Raffle Entry Socials (Discord & X/Twitter)
alter table public.raffle_entries add column if not exists discord text default '';
alter table public.raffle_entries add column if not exists x_handle text default '';
alter table public.profiles add column if not exists discord text default '';

-- Drop old 2-argument enter_raffle
drop function if exists public.enter_raffle(text, integer);

-- Create new 4-argument enter_raffle with optional discord & x_handle
create or replace function public.enter_raffle(
  p_raffle_id text,
  p_tickets integer,
  p_discord text default '',
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
  v_clean_discord text := coalesce(trim(p_discord), '');
  v_clean_x text := coalesce(trim(p_x_handle), '');
begin
  if v_uid is null then 
    raise exception 'Not authenticated' using errcode = '42501'; 
  end if;

  v_allowed := public.check_rate_limit('enter_raffle', v_uid::text, 15, 60);
  if not v_allowed then
    raise exception 'Terlalu banyak pendaftaran undian dalam waktu singkat. Mohon tunggu 1 menit.' using errcode = 'P0001';
  end if;

  if p_raffle_id is null or length(p_raffle_id) < 2 or length(p_raffle_id) > 64 or p_raffle_id !~ '^[a-zA-Z0-9_\-]+$' then
    raise exception 'Format raffle_id tidak valid' using errcode = '22023';
  end if;

  if p_tickets <= 0 or p_tickets > 1000 then 
    raise exception 'Jumlah tiket tidak valid' using errcode = '22023'; 
  end if;

  -- Normalize handles
  if v_clean_x <> '' and v_clean_x like '@%' then
    v_clean_x := substr(v_clean_x, 2);
  end if;

  perform public.sync_user_progress(v_uid);

  select * into v_raffle from public.raffles where id = p_raffle_id for share;
  if not found then 
    raise exception 'Undian tidak ditemukan' using errcode = 'P0001'; 
  end if;

  if v_raffle.status <> 'live' or v_raffle.ends_at <= v_now or v_raffle.starts_at > v_now then 
    raise exception 'Undian sudah berakhir atau belum aktif' using errcode = 'P0001'; 
  end if;

  update public.progress
  set raffle_tickets = raffle_tickets - p_tickets, updated_at = v_now
  where user_id = v_uid and raffle_tickets >= p_tickets;

  if not found then
    raise exception 'Tiket tidak mencukupi' using errcode = 'P0001';
  end if;

  insert into public.raffle_entries (raffle_id, user_id, tickets, discord, x_handle)
  values (p_raffle_id, v_uid, p_tickets, v_clean_discord, v_clean_x)
  on conflict (raffle_id, user_id)
  do update set 
    tickets = raffle_entries.tickets + p_tickets,
    discord = case when v_clean_discord <> '' then v_clean_discord else raffle_entries.discord end,
    x_handle = case when v_clean_x <> '' then v_clean_x else raffle_entries.x_handle end,
    entered_at = v_now;

  -- Sync socials to user profile if available
  if v_clean_discord <> '' then
    update public.profiles set discord = v_clean_discord where id = v_uid and (discord is null or discord = '');
  end if;
  if v_clean_x <> '' then
    update public.profiles set twitter = v_clean_x where id = v_uid and (twitter is null or twitter = '');
  end if;

  insert into public.ledger (user_id, kind, gems_delta, tickets_delta, ref)
  values (v_uid, 'enter_raffle', 0, -p_tickets, p_raffle_id);

  return jsonb_build_object(
    'success', true, 
    'raffle_id', p_raffle_id, 
    'tickets_entered', p_tickets,
    'discord', v_clean_discord,
    'x_handle', v_clean_x
  );
end;
$$;

grant execute on function public.enter_raffle(text, integer, text, text) to authenticated;

-- Admin RPC: View all participants for a raffle with their Discord and X handle
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

  select jsonb_agg(
    jsonb_build_object(
      'user_id', re.user_id,
      'username', p.username,
      'tickets', re.tickets,
      'discord', coalesce(nullif(re.discord, ''), nullif(p.discord, ''), '-'),
      'x_handle', coalesce(nullif(re.x_handle, ''), nullif(p.twitter, ''), '-'),
      'entered_at', re.entered_at
    ) order by re.tickets desc, re.entered_at asc
  ) into v_res
  from public.raffle_entries re
  left join public.profiles p on p.id = re.user_id
  where re.raffle_id = p_raffle_id;

  return coalesce(v_res, '[]'::jsonb);
end;
$$;

grant execute on function public.admin_get_raffle_entries(text, text) to authenticated, anon;
