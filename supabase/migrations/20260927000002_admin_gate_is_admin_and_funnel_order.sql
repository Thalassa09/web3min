-- ============================================================================
-- 20260927000002_admin_gate_is_admin_and_funnel_order.sql
--
-- Lanjutan Langkah 1-2. Dua hal:
--
-- (1) BUG DI KODE SAYA SENDIRI: `admin_lesson_funnel` mengurutkan `order by
--     ref_id` (alfabetis), sehingga `u1-chest` tampil sebagai "blok teratas"
--     dan UI menghitung `u1-l1` sebagai "500% dari blok teratas". Funnel yang
--     benar diurutkan dari user TERBANYAK (titik masuk) ke tersedikit.
--
-- (2) Permintaan brief: RPC admin lama masih digerbang `p_key` saja. Setelah
--     `admin_verify_key` tidak lagi memuat kunci hardcoded, gate-nya diganti
--     jadi eksplisit `is_admin() or admin_verify_key(p_key)` supaya akun admin
--     (yang login biasa, tanpa kunci) benar-benar bisa memakai tab Users dan
--     Raffle. Ini penggantian SATU BARIS teks yang identik di semua fungsi,
--     bukan penulisan ulang badan fungsi — logika bisnisnya tidak disentuh.
-- ============================================================================

-- ---------------------------------------------------------------------------
-- 1. Funnel: urutkan dari titik masuk (user terbanyak) ke drop-off
-- ---------------------------------------------------------------------------
create or replace function public.admin_lesson_funnel()
returns table (lesson_id text, users bigint)
language plpgsql
stable
security definer
set search_path = public, pg_temp
as $$
begin
  if not public.is_admin() then
    raise exception 'forbidden' using errcode = '42501';
  end if;

  return query
  select a.ref_id, count(distinct a.user_id) as users
  from public.activity_log a
  where a.event = 'lesson_complete' and a.ref_id is not null
  group by a.ref_id
  order by count(distinct a.user_id) desc, a.ref_id asc;
end;
$$;

-- ---------------------------------------------------------------------------
-- 2. Gerbang is_admin() eksplisit di seluruh RPC admin lama
-- ---------------------------------------------------------------------------
do $gate$
declare
  r record;
  v_def text;
  v_old text := '  if not public.admin_verify_key(p_key) then';
  v_new text := '  if not (public.is_admin() or public.admin_verify_key(p_key)) then';
  v_count int;
begin
  for r in
    select p.oid, p.proname
    from pg_proc p
    join pg_namespace n on n.oid = p.pronamespace
    where n.nspname = 'public'
      and p.proname like 'admin_%'
      and p.proname <> 'admin_verify_key'
      and position(v_old in pg_get_functiondef(p.oid)) > 0
    order by p.proname
  loop
    v_def := pg_get_functiondef(r.oid);
    v_count := (length(v_def) - length(replace(v_def, v_old, ''))) / length(v_old);

    if v_count <> 1 then
      raise exception '[admin-gate] %() punya % gerbang p_key, bukan 1 — tinjau manual', r.proname, v_count;
    end if;

    v_def := replace(v_def, v_old, v_new);
    execute v_def;
    raise notice '[admin-gate] OK: %() sekarang is_admin() atau kunci lama', r.proname;
  end loop;
end
$gate$;
