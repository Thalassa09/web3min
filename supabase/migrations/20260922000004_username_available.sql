-- Unique username helpers. profiles.username already has UNIQUE constraint.

create or replace function public.normalize_username(p_username text)
returns text
language sql
immutable
as $$
  select left(lower(regexp_replace(coalesce(p_username, ''), '[^a-z0-9_]', '', 'g')), 16);
$$;

create or replace function public.username_available(p_username text)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_name text;
begin
  v_name := public.normalize_username(p_username);
  if v_name is null or length(v_name) < 3 then
    return false;
  end if;
  return not exists (select 1 from public.profiles where username = v_name);
end;
$$;

grant execute on function public.username_available(text) to anon, authenticated;

-- Fail hard on duplicate username instead of silently rewriting it.
create or replace function public.handle_new_user()
returns trigger as $$
declare
  v_username text;
begin
  v_username := public.normalize_username(coalesce(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1)));
  if v_username is null or length(v_username) < 3 then
    v_username := 'user_' || substr(replace(new.id::text, '-', ''), 1, 8);
  end if;

  if exists (select 1 from public.profiles where username = v_username) then
    raise exception 'USERNAME_TAKEN' using errcode = '23505';
  end if;

  insert into public.profiles (id, username)
  values (new.id, v_username);

  insert into public.progress (user_id, gems, hearts, raffle_tickets)
  values (new.id, 50, 5, 3)
  on conflict (user_id) do nothing;

  return new;
end;
$$ language plpgsql security definer;
