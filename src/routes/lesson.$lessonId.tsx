import { useEffect } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { LessonPlayer } from "@/components/lesson/player";
import { getLesson, isUnlocked } from "@/lib/curriculum";
import { useProgress } from "@/lib/store";
import { buildMeta } from "@/lib/seo";

export const Route = createFileRoute("/lesson/$lessonId")({
  head: ({ params }) => {
    const lesson = getLesson(params.lessonId);
    const title = lesson ? `${lesson.title} — web3min` : "Pelajaran Web3 — web3min";
    const description = lesson?.subtitle || "Belajar Web3 interaktif di Pulau Rantai.";
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
  const navigate = useNavigate();
  const unlocked = lesson ? isUnlocked(lesson.id, completed) || completed.includes(lesson.id) : false;

  useEffect(() => {
    if (!onboarded) void navigate({ to: "/onboarding" });
    else if (!lesson || lesson.kind === "chest" || !unlocked) void navigate({ to: "/" });
  }, [onboarded, lesson, unlocked, navigate]);

  if (!onboarded || !lesson || lesson.kind === "chest" || !unlocked) return null;
  return <LessonPlayer key={lesson.id} lesson={lesson} />;
}
