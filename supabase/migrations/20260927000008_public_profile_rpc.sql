-- ============================================================================
-- 20260927000008_public_profile_rpc.sql
--
-- RENCANA-SUPPORTER.md Langkah 9: halaman profil publik /u/$username.
--
-- KEPUTUSAN DATA (dipilih sendiri karena user memberi standing approval;
-- user bisa mengoreksi). Yang BOLEH publik HANYA yang sudah tampil di
-- klasemen publik + pencapaian belajar:
--     username tampil (ikut aturan sensor), XP, weekly XP, streak,
--     jumlah blok selesai, badge supporter (is_supporter, lifetime, sejak).
--
-- Yang DILARANG keluar sama sekali (bukan sekadar tidak ditampilkan —
-- TIDAK DI-SELECT): bio, twitter, discord, last_wallet_address,
-- recovery email, account_type, is_admin, created_at akun, updated_at,
-- dan seluruh isi tabel `progress` selain agregat di atas.
--
-- Alasan: bio & twitter bisa memuat tautan yang bisa dipakai untuk
-- meng-harvest; wallet address = target phishing/scam; `created_at` =
-- info tak perlu. Yang sudah publik di klasemen tetap publik di sini.
--
-- PRIVASI SENSOR: user yang `username_censored = true` tetap boleh punya
-- halaman (mereka tidak dilarang), tapi namanya SELALU lewat
-- get_display_name() — sama seperti klasemen. Halaman tidak pernah
-- membocorkan username asli user tersensor.
--
-- Akun test/probe (sectest_*, testuser*) DILARANG punya halaman publik —
-- konsisten dengan penyaringan klasemen.
-- ============================================================================

create or replace function public.get_public_profile(p_username text)
returns jsonb
language plpgsql
stable
security definer
set search_path = public, pg_temp
as $function$
declare
  v_row record;
  v_completed int;
begin
  if p_username is null or length(btrim(p_username)) = 0 then
    return jsonb_build_object('ok', false, 'reason', 'not_found');
  end if;

  -- Cari HANYA akun nyata (bukan test/probe) — sama seperti klasemen.
  select pr.id,
         pr.username,
         pr.username_censored,
         pr.is_supporter,
         pr.supporter_expires_at,
         pr.supporter_since
    into v_row
  from public.profiles pr
  where lower(pr.username) = lower(btrim(p_username))
    and pr.account_type = 'user'
    and pr.username not like 'sectest_%'
    and pr.username not like 'testuser%'
    and pr.username <> 'testuser99'
  limit 1;

  if v_row.id is null then
    return jsonb_build_object('ok', false, 'reason', 'not_found');
  end if;

  -- Jumlah blok selesai: hanya HITUNGAN, bukan daftar (daftar = kurikulum
  -- pribadi; hitungan sudah cukup untuk "seberapa jauh dia").
  select count(*) into v_completed
  from public.completions c
  where c.user_id = v_row.id;

  return jsonb_build_object(
    'ok', true,
    'username', public.get_display_name(v_row.id, v_row.username, v_row.username_censored),
    'censored', v_row.username_censored,
    'xp', (select coalesce(p.xp, 0) from public.progress p where p.user_id = v_row.id),
    'weekly_xp', (select coalesce(p.weekly_xp, 0) from public.progress p where p.user_id = v_row.id),
    'streak', (select coalesce(p.streak, 0) from public.progress p where p.user_id = v_row.id),
    'lessons_completed', coalesce(v_completed, 0),
    'is_supporter', coalesce(v_row.is_supporter, false)
                    and (v_row.supporter_expires_at is null or v_row.supporter_expires_at > now()),
    'supporter_lifetime', coalesce(v_row.is_supporter, false)
                          and v_row.supporter_expires_at is null,
    'supporter_since', case
      when coalesce(v_row.is_supporter, false)
           and (v_row.supporter_expires_at is null or v_row.supporter_expires_at > now())
      then v_row.supporter_since
      else null
    end
  );
end;
$function$;

-- Publik boleh baca (halaman ini memang untuk dibagikan), tapi TIDAK
-- mengembalikan data pribadi apa pun. Anon diberi izin supaya pratinjau
-- tautan & crawler bisa membacanya.
revoke execute on function public.get_public_profile(text) from public;
grant execute on function public.get_public_profile(text) to anon, authenticated;

-- Verifikasi: periksa KUNCI JSON YANG BENAR-BENAR KELUAR, bukan teks sumber.
-- (Versi pertama memindai teks sumber dan menandai `account_type` padahal itu
--  dipakai untuk MEMFILTER — `where pr.account_type = 'user'` — bukan untuk
--  dikembalikan. Yang penting bagi privasi adalah isi hasilnya, bukan
--  kata-kata di badan fungsi.)
do $verify$
declare
  v_def text;
  v_out jsonb;
  v_uname text;
  v_key text;
  v_bad text[] := array['bio', 'twitter', 'discord', 'wallet', 'recovery',
                        'is_admin', 'account_type', 'created_at', 'updated_at'];
  v_item text;
begin
  select pg_get_functiondef(p.oid) into v_def
  from pg_proc p join pg_namespace n on n.oid = p.pronamespace
  where n.nspname = 'public' and p.proname = 'get_public_profile';

  if v_def is null then
    raise exception 'VERIFIKASI GAGAL: get_public_profile tidak terbentuk';
  end if;

  if position('get_display_name' in v_def) = 0 then
    raise exception 'VERIFIKASI GAGAL: aturan sensor tidak dipakai';
  end if;

  -- Uji nyata: panggil dengan username asli, lalu periksa setiap kunci hasil.
  select username into v_uname
  from public.profiles
  where account_type = 'user' and username not like 'sectest_%'
    and username not like 'testuser%' and username <> 'testuser99'
  limit 1;

  if v_uname is not null then
    v_out := public.get_public_profile(v_uname);

    for v_key in select jsonb_object_keys(v_out) loop
      foreach v_item in array v_bad loop
        if position(v_item in v_key) > 0 then
          raise exception 'VERIFIKASI GAGAL: kunci pribadi "%" keluar dari get_public_profile', v_key;
        end if;
      end loop;
    end loop;

    if v_out->>'ok' <> 'true' then
      raise exception 'VERIFIKASI GAGAL: profil user nyata tidak ditemukan';
    end if;
  end if;

  raise notice 'VERIFIKASI OK: kunci hasil bersih + sensor dipakai';
end;
$verify$;
