import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { DuoButton } from "@/components/duo-button";
import { DailyQuests } from "@/components/daily-quests";
import { RouteChain } from "@/components/motif";
import { firstIncompleteId, getLesson, getUnit } from "@/lib/curriculum";
import { formatHeartWait, HEART_MS, MAX_HEARTS, msUntilHeart, useProgress } from "@/lib/store";
import { worldOf } from "@/lib/worlds";

function minutesOf(count: number) {
  return Math.max(2, Math.min(8, Math.round(count * 0.4) || 3));
}

export function HomeDock() {
  const hearts = useProgress((s) => s.hearts);
  const heartsUpdatedAt = useProgress((s) => s.heartsUpdatedAt);
  const completed = useProgress((s) => s.completed);
  const xpToday = useProgress((s) => s.xpToday);
  const dailyGoal = useProgress((s) => s.dailyGoal);
  const [wait, setWait] = useState(() => msUntilHeart(heartsUpdatedAt));

  const currentId = firstIncompleteId(completed);
  const lesson = currentId ? getLesson(currentId) : null;
  const world = lesson ? worldOf(lesson.unitId) : null;
  const unit = lesson ? getUnit(lesson.unitId) : null;
  const scoredLessons = unit?.lessons.filter((l) => l.kind !== "chest") ?? [];
  const lessonNo = lesson ? scoredLessons.findIndex((l) => l.id === lesson.id) + 1 : 0;
  const started = xpToday > 0;
  const goalHit = xpToday >= dailyGoal;
  const mins = lesson ? minutesOf(lesson.exercises.length) : 3;
  const guideSeen = useProgress((s) => s.guideSeen);
  const showCaraLink = guideSeen || completed.length > 0;

  useEffect(() => {
    if (hearts >= MAX_HEARTS) return;
    const tick = () => setWait(msUntilHeart(useProgress.getState().heartsUpdatedAt));
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [hearts, heartsUpdatedAt]);

  if (hearts <= 0) {
    return (
      <div className="mx-4 mt-4">
        <p className="text-sm font-medium text-blob">Nyawa habis</p>
        <h2 className="mt-1 text-xl font-bold leading-[26px]">Baca kisah dulu. Nyawa aman.</h2>
        <p className="mt-1 text-sm leading-5 text-muted">
          Nyawa berikutnya sekitar {formatHeartWait(wait)}. Satu nyawa pulih tiap {HEART_MS / 60000} menit.
        </p>
        <div className="mt-3 flex flex-col gap-2">
          <Link to="/kisah">
            <DuoButton variant="sky" wide>
              Baca kisah
            </DuoButton>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-4 mt-4">
      {lesson && world ? (
        <div>
          <p className="text-sm font-medium text-primary">
            {world.land}
            {lessonNo > 0 ? ` · Pelajaran ${lessonNo} dari ${scoredLessons.length}` : null}
          </p>
          {goalHit ? (
            <>
              <h2 className="mt-1 text-xl font-bold leading-[26px]">Pelajaran hari ini selesai</h2>
              <p className="mt-1 text-base leading-6">{lesson.blurb}</p>
              <p className="mt-2 text-sm font-medium text-muted">
                Lanjut {lesson.title} · {mins} menit
              </p>
              <p className="mt-0.5 text-sm text-muted">
                +{lesson.xp} XP · +{lesson.gems} bintang
              </p>
              <Link
                to="/lesson/$lessonId"
                params={{ lessonId: lesson.id }}
                className="mt-4 block"
                data-coach="start"
                onClick={() => useProgress.getState().completeGuide()}
              >
                <DuoButton wide>Lihat pelajaran berikutnya</DuoButton>
              </Link>
            </>
          ) : (
            <>
              <h2 className="mt-1 text-xl font-bold leading-[26px]">{lesson.title}</h2>
              <p className="mt-1 text-base leading-6">{lesson.blurb}</p>
              <p className="mt-2 text-sm font-medium text-muted">
                {mins} menit · +{lesson.xp} XP
              </p>
              <Link
                to="/lesson/$lessonId"
                params={{ lessonId: lesson.id }}
                className="mt-4 block"
                data-coach="start"
                onClick={() => useProgress.getState().completeGuide()}
              >
                <DuoButton wide>{started ? "Lanjutkan pelajaran" : "Mulai pelajaran"}</DuoButton>
              </Link>
              {showCaraLink ? (
                <Link to="/cara" className="mt-1 flex min-h-11 items-center text-sm font-bold text-primary">
                  Cara main
                </Link>
              ) : null}
            </>
          )}
          <div className="mt-4">
            <RouteChain have={xpToday} need={dailyGoal} label={`${xpToday}/${dailyGoal} XP hari ini`} />
          </div>
        </div>
      ) : (
        <div>
          <h2 className="text-xl font-bold leading-[26px]">Semua rute selesai</h2>
          <p className="mt-1 text-sm leading-5 text-muted">Kamu sudah menuntaskan seluruh perjalanan.</p>
        </div>
      )}

      <DailyQuests compact className="px-0 pt-3 desk-hide-when-rail" />
    </div>
  );
}
