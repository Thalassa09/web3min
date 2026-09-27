import { useEffect } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { LessonPlayer } from "@/components/lesson/player";
import { getLesson, isUnlocked } from "@/lib/curriculum";
import { useProgress, useHydrated } from "@/lib/store";
import { buildMeta } from "@/lib/seo";

export const Route = createFileRoute("/lesson/$lessonId")({
  head: ({ params }) => {
    const lesson = getLesson(params.lessonId);
    const title = lesson ? `${lesson.title} — web3min` : "Pelajaran Web3 — web3min";
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
  const lesson = getLesson(lessonId);
  const onboarded = useProgress((s) => s.onboarded);
  const completed = useProgress((s) => s.completed);
  const hydrated = useHydrated();
  const navigate = useNavigate();
  const unlocked = lesson ? isUnlocked(lesson.id, completed) || completed.includes(lesson.id) : false;

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
    const open = lesson ? isUnlocked(lesson.id, live.completed) || live.completed.includes(lesson.id) : false;
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
