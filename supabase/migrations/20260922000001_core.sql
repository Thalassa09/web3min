-- Core schema for Supabase integration with Asia/Jakarta GMT+7
do $$
begin
  alter database postgres set timezone to 'Asia/Jakarta';
exception when others then
  raise notice 'Could not set database timezone, fallback to session timezone';
end
$$;

-- Profil, satu baris per pengguna
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique not null check (username ~ '^[a-z0-9_]{3,16}$'),
  twitter text default '',
  bio text default '',
  created_at timestamptz not null default now()
);

-- Progres, server yang pegang angka
create table if not exists public.progress (
  user_id uuid primary key references auth.users(id) on delete cascade,
  xp int not null default 0 check (xp >= 0 and xp <= 5000000),
  gems int not null default 50 check (gems >= 0 and gems <= 999999),
  hearts int not null default 5 check (hearts between 0 and 5),
  hearts_updated_at timestamptz not null default now(),
  streak int not null default 0 check (streak >= 0 and streak <= 10000),
  streak_freeze int not null default 0 check (streak_freeze between 0 and 30),
  last_active_date date,
  daily_goal int not null default 20 check (daily_goal in (10,20,30,50)),
  xp_today int not null default 0,
  xp_today_date date not null default (now() at time zone 'Asia/Jakarta')::date,
  weekly_xp int not null default 0,
  week_key text not null default '',
  lessons_today int not null default 0,
  perfect_today int not null default 0,
  stories_today int not null default 0,
  raffle_tickets int not null default 3 check (raffle_tickets >= 0 and raffle_tickets <= 9999),
  updated_at timestamptz not null default now()
);

create table if not exists public.completions (
  user_id uuid not null references auth.users(id) on delete cascade,
  lesson_id text not null,
  perfect boolean not null default false,
  completed_at timestamptz not null default now(),
  primary key (user_id, lesson_id)
);

create table if not exists public.claimed_quests (
  user_id uuid not null references auth.users(id) on delete cascade,
  quest_id text not null,
  quest_date date not null,
  primary key (user_id, quest_id, quest_date)
);

-- Undian: definisi pindah dari hardcode ke database
create table if not exists public.raffles (
  id text primary key,
  title text not null,
  prize text not null,
  prize_detail text,
  is_simulation boolean not null default true,
  status text not null default 'live' check (status in ('upcoming','live','ended','drawn')),
  starts_at timestamptz not null default now(),
  ends_at timestamptz not null,
  ticket_cost int not null default 1 check (ticket_cost > 0),
  winner_count int not null default 1 check (winner_count > 0),
  drawn_at timestamptz,
  draw_seed text
);

create table if not exists public.raffle_entries (
  id bigserial primary key,
  raffle_id text not null references public.raffles(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  tickets int not null check (tickets > 0),
  entered_at timestamptz not null default now(),
  unique (raffle_id, user_id)
);

create table if not exists public.raffle_winners (
  raffle_id text not null references public.raffles(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  announced_at timestamptz not null default now(),
  primary key (raffle_id, user_id)
);

-- Jejak audit setiap perubahan ekonomi
create table if not exists public.ledger (
  id bigserial primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  kind text not null,
  gems_delta int not null default 0,
  tickets_delta int not null default 0,
  ref text,
  created_at timestamptz not null default now()
);

-- Row Level Security
alter table public.profiles enable row level security;
alter table public.progress enable row level security;
alter table public.completions enable row level security;
alter table public.claimed_quests enable row level security;
alter table public.raffle_entries enable row level security;
alter table public.raffle_winners enable row level security;
alter table public.raffles enable row level security;
alter table public.ledger enable row level security;

-- Policies
drop policy if exists "profiles readable by public" on public.profiles;
create policy "profiles readable by public" on public.profiles for select using (true);

drop policy if exists "own profile update" on public.profiles;
create policy "own profile update" on public.profiles for update using (auth.uid() = id);

drop policy if exists "own progress read" on public.progress;
create policy "own progress read" on public.progress for select using (auth.uid() = user_id);

drop policy if exists "own completions read" on public.completions;
create policy "own completions read" on public.completions for select using (auth.uid() = user_id);

drop policy if exists "own claimed quests read" on public.claimed_quests;
create policy "own claimed quests read" on public.claimed_quests for select using (auth.uid() = user_id);

drop policy if exists "raffles readable" on public.raffles;
create policy "raffles readable" on public.raffles for select using (true);

drop policy if exists "winners readable" on public.raffle_winners;
create policy "winners readable" on public.raffle_winners for select using (true);

drop policy if exists "own entries read" on public.raffle_entries;
create policy "own entries read" on public.raffle_entries for select using (auth.uid() = user_id);

drop policy if exists "own ledger read" on public.ledger;
create policy "own ledger read" on public.ledger for select using (auth.uid() = user_id);

-- Trigger handle_new_user on auth.users
create or replace function public.handle_new_user()
returns trigger as $$
declare
  v_username text;
begin
  v_username := lower(regexp_replace(coalesce(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1)), '[^a-z0-9_]', '', 'g'));
  if length(v_username) < 3 then
    v_username := 'user_' || substr(new.id::text, 1, 8);
  elsif length(v_username) > 16 then
    v_username := substr(v_username, 1, 16);
  end if;

  if exists (select 1 from public.profiles where username = v_username) then
    v_username := substr(v_username, 1, 10) || '_' || substr(new.id::text, 1, 5);
  end if;

  insert into public.profiles (id, username)
  values (new.id, v_username)
  on conflict (id) do nothing;

  insert into public.progress (user_id, gems, hearts, raffle_tickets)
  values (new.id, 50, 5, 3)
  on conflict (user_id) do nothing;

  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
