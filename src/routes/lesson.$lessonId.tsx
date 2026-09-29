import { useEffect, useMemo } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { LessonPlayer } from "@/components/lesson/player";
import { getLesson, getUnit, isUnlocked } from "@/lib/curriculum";
import { useProgress, useHydrated } from "@/lib/store";
import { buildMeta } from "@/lib/seo";
import { buildRouteExamLesson, isRouteExamId, unitIdOfRouteExam } from "@/lib/route-exam";

export const Route = createFileRoute("/lesson/$lessonId")({
  head: ({ params }) => {
    const lesson = getLesson(params.lessonId);
    const examUnit = unitIdOfRouteExam(params.lessonId);
    const title = lesson
      ? `${lesson.title} | web3min`
      : examUnit
        ? `Ujian Rute ${examUnit.replace("u", "")} | web3min`
        : "Pelajaran Web3 | web3min";
    const description = lesson?.blurb || "Belajar Web3 interaktif di Pulau Rantai.";
    return buildMeta({
      title,
      description,
      path: `/lesson/${params.lessonId}`,
    });
  },
  component: LessonPage,
});

function LessonPage() {
  const { lessonId } = Route.useParams();
  const onboarded = useProgress((s) => s.onboarded);
  const completed = useProgress((s) => s.completed);
  const hydrated = useHydrated();
  const navigate = useNavigate();

  // Ujian Rute bukan bagian dari kurikulum inti, jadi tidak boleh muncul di
  // `getLesson()`: ia dibangun saat dibuka saja, dari bank soal rute tersebut.
  //
  // PENTING: kesiapannya TIDAK boleh bergantung pada `completed`. Nilai itu
  // tertinggal satu render saat rehydrate selesai, jadi memakainya di sini
  // membuat efek penjaga melihat `lesson: null` dan melempar user ke `/` tepat
  // setelah sesi ujian tersimpan. Gerbang "rute sudah lulus" ada di tombol peta,
  // bukan di sini.
  //
  // WAJIB memo: `buildRouteExamLesson` menyusun objek baru. Tanpa memo, objek
  // `lesson` berubah tiap render dan efek penjaga di bawah ikut berputar.
  const examUnitId = unitIdOfRouteExam(lessonId);
  // WAJIB memo: `getUnit()` mengembalikan objek dari array, tapi referensinya
  // ikut berubah saat modul dimuat ulang; tanpa memo, `examLesson` dan `quiz`
  // di bawahnya ikut berubah tiap render sehingga efek pembuat sesi berputar.
  const examUnit = useMemo(() => (examUnitId ? getUnit(examUnitId) : null), [examUnitId]);
  const examLesson = useMemo(
    () => (examUnit ? buildRouteExamLesson(examUnit) : null),
    [examUnit],
  );
  const lesson = getLesson(lessonId) ?? examLesson;

  const unlocked = lesson
    ? isUnlocked(lesson.id, completed) || completed.includes(lesson.id) || isRouteExamId(lesson.id)
    : false;

  useEffect(() => {
    // Jangan memutuskan apa pun sebelum localStorage selesai dibaca, kalau tidak
    // `onboarded` masih bernilai default `false` dan deep link /lesson/u1-l1
    // akan terlempar ke /onboarding lalu / walau user sudah daftar.
    if (!hydrated) return;
    // PENTING: baca nilai TERKINI lewat getState(), bukan nilai dari render ini.
    // Saat rehydrate selesai, `hydrated` dan isi store tidak berubah dalam
    // render yang sama — selector zustand baru mengejar beberapa ms kemudian.
    // Membaca nilai yang tertinggal satu render membuat user yang sudah daftar
    // terlempar ke /onboarding (lalu /), dan blok yang sudah terbuka ditolak.
    const live = useProgress.getState();
    const open = lesson
      ? isUnlocked(lesson.id, live.completed) || live.completed.includes(lesson.id) || isRouteExamId(lesson.id)
      : false;
    if (!live.onboarded) void navigate({ to: "/onboarding" });
    else if (!lesson || lesson.kind === "chest" || !open) void navigate({ to: "/" });
  }, [hydrated, onboarded, completed, lesson, unlocked, navigate]);

  // Selama SSR & render pertama klien, `hydrated` selalu false dan store masih
  // default. Kalau di sini `return null`, HTML server untuk deep link
  // /lesson/<id> hanya berisi layar boot — React membuang DOM itu saat hydrate
  // dan router memulihkan URL awal. Jadi render placeholder setinggi viewport.
  if (!hydrated || !onboarded || !lesson || lesson.kind === "chest" || !unlocked) {
    return <div className="min-h-screen w-full" aria-hidden="true" />;
  }
  return <LessonPlayer key={lesson.id} lesson={lesson} />;
}
