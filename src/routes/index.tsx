import { useEffect, useMemo } from "react";
import { createFileRoute, useRouterState, useNavigate } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { CoachTour } from "@/components/coach";
import { DeskRail } from "@/components/desk-rail";
import { PathMap } from "@/components/path-map";
import { BlobiFloatingCompanion } from "@/components/blobi-guide";
import { UNITS, firstPlayableId, getLesson } from "@/lib/curriculum";
import { useProgress } from "@/lib/store";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  const navigate = useNavigate();
  const completed = useProgress((s) => s.completed);
  const activeLessonId = useMemo(() => firstPlayableId(completed), [completed]);
  const activeLesson = useMemo(
    () => (activeLessonId ? getLesson(activeLessonId) : null),
    [activeLessonId],
  );

  const hash = useRouterState({ select: (s) => s.location.hash });
  const raw = hash.replace(/^#/, "");
  const focus = raw || null;
  const unitId = raw.startsWith("unit-") ? raw.slice(5) : null;

  useEffect(() => {
    if (!focus) return;
    const el = document.getElementById(focus);
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
    el.classList.add("unit-flash");
    const t = window.setTimeout(() => el.classList.remove("unit-flash"), 1200);
    return () => window.clearTimeout(t);
  }, [focus, unitId]);

  const handleStartActiveLesson = () => {
    if (activeLessonId) {
      navigate({ to: `/lesson/${activeLessonId}` });
    }
  };

  const handleScrollToActive = () => {
    if (!activeLessonId) return;
    const el = document.getElementById(activeLessonId);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  return (
    <AppShell rail={<DeskRail />}>
      <main className="w-full relative">
        <PathMap units={UNITS} focusUnit={unitId} />
        <BlobiFloatingCompanion
          activeLesson={activeLesson}
          onStartActiveLesson={handleStartActiveLesson}
          onScrollToActive={handleScrollToActive}
        />
      </main>
      <CoachTour />
    </AppShell>
  );
}
