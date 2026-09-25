-- Drop obsolete overloaded version of admin_upsert_raffle with jsonb perks
drop function if exists public.admin_upsert_raffle(
  text, text, text, text, text, text, text, timestamptz, int, int, text, text, text, text, text, jsonb, boolean, text, text, text, text
);
