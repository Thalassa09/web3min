-- ============================================================================
-- 20260927000005_admin_get_users_supporter_columns.sql
--
-- Lanjutan RENCANA-SUPPORTER.md Langkah 6b: panel admin harus BISA MELIHAT
-- siapa yang sudah supporter, supaya admin_grant_supporter (jaring aman kalau
-- deteksi GatePay gagal) benar-benar bisa dipakai tanpa buka SQL editor.
--
-- Perubahan: admin_get_users menambahkan 3 kolom —
--   is_supporter          -> status EFEKTIF (kedaluwarsa = false)
--   supporter_lifetime    -> true kalau tanpa tanggal berakhir
--   supporter_expires_at  -> tanggal berakhir (null = lifetime)
--
-- Sisanya IDENTIK dengan definisi sebelumnya (gerbang admin, urutan, filter).
-- ============================================================================

create or replace function public.admin_get_users(p_key text, p_filter_type text default 'all'::text)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $function$
declare
  v_res jsonb;
  v_now timestamptz := now();
begin
  if not (public.is_admin() or public.admin_verify_key(p_key)) then
    raise exception 'Unauthorized: Invalid admin key' using errcode = '42501';
  end if;

  select jsonb_agg(
    jsonb_build_object(
      'id', pr.id,
      'username', pr.username,
      'display_name', public.get_display_name(pr.id, pr.username, pr.username_censored),
      'username_censored', pr.username_censored,
      'account_type', pr.account_type,
      'xp', coalesce(p.xp, 0),
      'weekly_xp', coalesce(p.weekly_xp, 0),
      'streak', coalesce(p.streak, 0),
      'created_at', pr.created_at,
      -- Status supporter EFEKTIF: kolomnya true tapi tanggalnya lewat = tidak aktif.
      'is_supporter', coalesce(pr.is_supporter, false)
                      and (pr.supporter_expires_at is null or pr.supporter_expires_at > v_now),
      'supporter_lifetime', coalesce(pr.is_supporter, false)
                            and pr.supporter_expires_at is null,
      'supporter_expires_at', case
        when coalesce(pr.is_supporter, false)
             and (pr.supporter_expires_at is null or pr.supporter_expires_at > v_now)
        then pr.supporter_expires_at
        else null
      end
    ) order by coalesce(p.weekly_xp, 0) desc, pr.created_at asc
  ) into v_res
  from public.profiles pr
  left join public.progress p on p.user_id = pr.id
  where (
    p_filter_type = 'all' or
    (p_filter_type = 'censored' and pr.username_censored = true) or
    (p_filter_type in ('user', 'test', 'demo') and pr.account_type = p_filter_type)
  );

  return coalesce(v_res, '[]'::jsonb);
end;
$function$;

-- Verifikasi: kolom baru wajib muncul di definisi tersimpan.
do $verify$
declare
  v_def text;
begin
  select pg_get_functiondef(p.oid) into v_def
  from pg_proc p join pg_namespace n on n.oid = p.pronamespace
  where n.nspname = 'public' and p.proname = 'admin_get_users';

  if position('is_supporter' in v_def) = 0 then
    raise exception 'VERIFIKASI GAGAL: is_supporter tidak ada di admin_get_users';
  end if;
  if position('supporter_expires_at' in v_def) = 0 then
    raise exception 'VERIFIKASI GAGAL: supporter_expires_at tidak ada di admin_get_users';
  end if;
  if position('admin_verify_key' in v_def) = 0 then
    raise exception 'VERIFIKASI GAGAL: gerbang admin hilang — jangan sampai ini terlewat';
  end if;

  raise notice 'VERIFIKASI OK: 3 kolom supporter + gerbang admin utuh';
end;
$verify$;
