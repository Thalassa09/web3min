-- ---------------------------------------------------------------------------
-- log_quiz_session(): telemetri penyelesaian kuis per blok.
--
-- Latar: Fase 3 memperpanjang kuis (bank soal per blok + Ujian Rute) dan kita
-- perlu membandingkan penyelesaian Rute 1 dengan rute berikutnya. Yang dicatat
-- HANYA tiga angka: panjang kuis, selesai atau tidak, dan posisi berhenti.
--
-- KENAPA RPC BARU, BUKAN `complete_lesson`:
-- `complete_lesson` menulis XP/koin/tiket dan baris `completions`. Kalau
-- telemetri ditumpangkan di sana, klien jadi punya jalan mengirim angka yang
-- memengaruhi hadiah. RPC ini SENGAJA tidak menyentuh `progress`, `completions`,
-- maupun `ledger` sama sekali: satu-satunya efeknya satu baris `activity_log`
-- lewat `log_activity()` yang sudah ada. Tidak ada angka ekonomi yang bisa
-- dipalsukan dari klien.
--
-- Privasi: tidak ada nama, alamat wallet, isi jawaban, atau teks soal di meta.
-- Rate limit 60/menit per user: cukup untuk pemakaian normal, cukup ketat untuk
-- membendung banjir log dari klien yang diutak-atik.
-- ---------------------------------------------------------------------------
create or replace function public.log_quiz_session(
  p_lesson_id text,
  p_quiz_length int,
  p_completed boolean,
  p_drop_at_index int default null
)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_uid uuid := auth.uid();
  v_allowed boolean;
  v_len int;
  v_drop int;
begin
  if v_uid is null then
    raise exception 'Not authenticated' using errcode = '42501';
  end if;

  v_allowed := public.check_rate_limit('log_quiz_session', v_uid::text, 60, 60);
  if not v_allowed then
    raise exception 'Terlalu banyak laporan kuis. Mohon tunggu sebentar.' using errcode = 'P0001';
  end if;

  if p_lesson_id is null or length(p_lesson_id) < 2 or length(p_lesson_id) > 64
     or p_lesson_id !~ '^[a-zA-Z0-9_\-:]+$' then
    raise exception 'Format lesson_id tidak valid' using errcode = '22023';
  end if;

  -- Batas nilai: panjang kuis wajar 0-200, posisi berhenti 0-200 atau null.
  v_len := greatest(0, least(coalesce(p_quiz_length, 0), 200));
  v_drop := case
    when p_drop_at_index is null then null
    else greatest(0, least(p_drop_at_index, 200))
  end;

  perform public.log_activity(
    'quiz_session',
    p_lesson_id,
    jsonb_build_object(
      'quiz_length', v_len,
      'completed', coalesce(p_completed, false),
      'drop_at_index', v_drop
    )
  );

  return jsonb_build_object('ok', true, 'quiz_length', v_len, 'completed', coalesce(p_completed, false));
end;
$$;

-- Hanya user login yang boleh melapor; tidak ada akses anon.
revoke execute on function public.log_quiz_session(text, int, boolean, int) from public, anon;
grant execute on function public.log_quiz_session(text, int, boolean, int) to authenticated;
