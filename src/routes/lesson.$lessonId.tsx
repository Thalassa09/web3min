import { useEffect } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { LessonPlayer } from "@/components/lesson/player";
import { getLesson, isUnlocked } from "@/lib/curriculum";
import { useProgress } from "@/lib/store";

export const Route = createFileRoute("/lesson/$lessonId")({ component: LessonPage });

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
