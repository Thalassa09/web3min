import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, BookOpen, Sparkles, Trophy } from "lucide-react";
import { SurfaceCard } from "@/components/ui/surface-card";
import { ProgressBar } from "@/components/ui/progress-bar";
import { firstPlayableId, getLesson, getUnit } from "@/lib/curriculum";
import { formatHeartWait, MAX_HEARTS, msUntilHeart, useProgress } from "@/lib/store";
import { worldOf } from "@/lib/worlds";

function minutesOf(count: number) {
  return Math.max(2, Math.min(8, Math.round(count * 0.4) || 3));
}

export function HomeDock() {
  const hearts = useProgress((s) => s.hearts);
  const heartsUpdatedAt = useProgress((s) => s.heartsUpdatedAt);
  const completed = useProgress((s) => s.completed);
  const xpToday = useProgress((s) => s.xpToday);
  const [wait, setWait] = useState(() => msUntilHeart(heartsUpdatedAt));

  const currentId = firstPlayableId(completed);
  const lesson = currentId ? getLesson(currentId) : null;
  const world = lesson ? worldOf(lesson.unitId) : null;
  const unit = lesson ? getUnit(lesson.unitId) : null;
  const scoredLessons = unit?.lessons.filter((l) => l.kind !== "chest") ?? [];
  const lessonNo = lesson ? scoredLessons.findIndex((l) => l.id === lesson.id) + 1 : 0;
  const started = xpToday > 0;
  const mins = lesson ? minutesOf(lesson.exercises.length) : 2;

  useEffect(() => {
    if (hearts >= MAX_HEARTS) return;
    const tick = () => setWait(msUntilHeart(useProgress.getState().heartsUpdatedAt));
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [hearts, heartsUpdatedAt]);

  if (hearts <= 0) {
    return (
      <div className="mx-3 sm:mx-4 mt-2 sm:mt-4 p-4 sm:p-6 rounded-[22px] border-2 border-ink-900 bg-white shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_2px_0_var(--color-ink-900)]">
        <div className="flex items-center gap-2 mb-1.5">
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black bg-candy-soft text-candy-deep border border-candy-line">
            Nyawa Habis
          </span>
        </div>
        <h2 className="font-display font-black text-lg sm:text-xl text-ink-900 tracking-tight">
          Istirahat Sejenak
        </h2>
        <p className="mt-1 text-xs sm:text-sm text-ink-500 leading-relaxed">
          Nyawa berikutnya pulih dalam {formatHeartWait(wait)}. Kamu tetap bisa membaca cerita Web3 tanpa mengurangi nyawa.
        </p>
        <div className="mt-3.5 flex flex-col sm:flex-row gap-2.5">
          <Link to="/kisah" className="flex-1">
            <button
              type="button"
              className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-full border-2 border-ink-900 bg-white text-ink-900 font-display font-black text-xs hover:bg-slate-50 transition-all cursor-pointer"
            >
              <BookOpen className="size-4" />
              <span>Baca Kisah Tanpa Nyawa</span>
            </button>
          </Link>
          <Link to="/shop" className="sm:w-auto">
            <button
              type="button"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 py-2.5 px-5 rounded-full border-2 border-ink-900 bg-candy-800 text-white font-display font-black text-xs shadow-[inset_0_1px_0_rgba(255,255,255,0.4),0_2px_0_#85174A] hover:bg-candy-950 transition-all cursor-pointer"
            >
              <Sparkles className="size-4" />
              <span>Pulihkan di Toko</span>
            </button>
          </Link>
        </div>
      </div>
    );
  }

  if (!lesson || !world) {
    return (
      <SurfaceCard className="mx-3 sm:mx-4 mt-2 sm:mt-4 p-5 sm:p-6 bg-white rounded-[22px] border-2 border-ink-900 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_2px_0_var(--color-ink-900)]">
        <h2 className="font-display font-black text-xl sm:text-2xl text-ink-900 inline-flex items-center justify-center gap-2">
          Semua Modul Selesai! <Trophy className="size-6 text-coin shrink-0" />
        </h2>
        <p className="mt-1 text-xs sm:text-sm text-ink-500">
          Kamu telah menuntaskan seluruh modul kurikulum. Kunjungi Arena untuk melihat peringkat belajarmu!
        </p>
        <div className="pt-3">
          <Link to="/leaderboard">
            <button
              type="button"
              className="inline-flex items-center justify-center gap-2 py-2.5 px-5 rounded-full bg-candy-800 text-white font-display font-black text-xs border-2 border-ink-900 shadow-[inset_0_1px_0_rgba(255,255,255,0.4),0_2px_0_#85174A]"
            >
              Buka Arena
            </button>
          </Link>
        </div>
      </SurfaceCard>
    );
  }

  const unitNum = unit ? unit.id.replace(/^u/, "") : "1";
  const progressPercent = scoredLessons.length > 0 ? Math.round((lessonNo / scoredLessons.length) * 100) : 0;

  return (
    <div className="mx-3 sm:mx-4 mt-2 sm:mt-3">
      {/* Mobile Compact Hero Bar (Saves vertical space so map is prominent) */}
      <div className="sm:hidden rounded-[20px] border-2 border-ink-900 bg-white shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_2px_0_var(--color-ink-900)] p-3 flex items-center justify-between gap-2.5">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-candy-deep">
            <span>Unit {unitNum}</span>
            <span className="text-ink-300">·</span>
            <span className="text-ink-500">{world.land}</span>
            <span className="text-ink-300">·</span>
            <span className="text-ink-500">{lessonNo}/{scoredLessons.length}</span>
          </div>
          <div className="font-display font-black text-sm text-ink-900 truncate mt-0.5">
            {lesson.title}
          </div>
        </div>
        <Link
          to="/lesson/$lessonId"
          params={{ lessonId: lesson.id }}
          className="shrink-0"
          onClick={() => useProgress.getState().completeGuide()}
        >
          <button
            type="button"
            className="inline-flex items-center justify-center gap-1 py-2 px-3.5 rounded-full bg-candy-800 hover:bg-candy-950 text-white font-display font-black text-xs border-2 border-ink-900 shadow-[inset_0_1px_0_rgba(255,255,255,0.4),0_2px_0_#85174A] active:scale-95 transition-all cursor-pointer"
          >
            <span>{started ? "Lanjut" : "Mulai"}</span>
            <ArrowRight className="size-3.5 stroke-[2.6]" />
          </button>
        </Link>
      </div>

      {/* Desktop & Tablet Expanded Rich Banner */}
      <div className="hidden sm:grid rounded-[26px] border-2 border-ink-900 shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_2px_0_var(--color-ink-900)] bg-white overflow-hidden grid-cols-1 md:grid-cols-[1fr_210px]">
        {/* Left Info Body */}
        <div className="p-6 sm:p-7 flex flex-col justify-between min-w-0">
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-2">
              <span className="px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-candy-soft text-candy-deep border border-candy-line">
                Unit {unitNum} · {world.land}
              </span>
              <span className="text-xs font-bold text-ink-500">
                Modul {lessonNo} dari {scoredLessons.length}
              </span>
            </div>

            <h1 className="font-display font-black text-2xl sm:text-3xl text-ink-900 tracking-tight leading-snug">
              {lesson.title}
            </h1>
            <p className="font-sans font-medium text-sm text-ink-500 mt-1.5 leading-relaxed max-w-xl">
              {lesson.blurb}
            </p>

            {/* Clean Arcade Candy metadata pills */}
            <div className="flex items-center gap-2 flex-wrap my-4">
              <span className="inline-flex items-center gap-1.5 text-xs font-pixel font-bold px-3 py-1 rounded-full border-2 border-choco-900 bg-lemon text-choco-900 shadow-[0_2px_0_#3B2218]">
                ⏱ {mins} Menit Belajar
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs font-pixel font-bold px-3 py-1 rounded-full border-2 border-choco-900 bg-candy-100 text-choco-900 shadow-[0_2px_0_#3B2218]">
                <img src="/props/star.png" alt="Star" className="size-3.5 object-contain pixelated" />
                +{lesson.xp} XP · +{lesson.gems} Koin
              </span>
            </div>

            {/* Continuous Smooth Progress Track */}
            <div className="space-y-1.5 mb-6">
              <div className="flex justify-between text-[11px] font-bold text-ink-500">
                <span>Progres Unit</span>
                <span>{progressPercent}%</span>
              </div>
              <ProgressBar value={progressPercent} size="xs" />
            </div>
          </div>

          <div>
            <Link
              to="/lesson/$lessonId"
              params={{ lessonId: lesson.id }}
              className="inline-block w-full sm:w-auto"
              onClick={() => useProgress.getState().completeGuide()}
            >
              <button
                type="button"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 font-display font-black text-sm sm:text-base py-3 px-7 rounded-full bg-candy-800 hover:bg-candy-950 text-white border-2 border-ink-900 shadow-[inset_0_1px_0_rgba(255,255,255,0.4),0_3px_0_#85174A] hover:brightness-105 active:scale-95 transition-all cursor-pointer"
              >
                <span>{started ? "Lanjutkan Pelajaran" : "Mulai Belajar"}</span>
                <ArrowRight className="size-4 sm:size-5 shrink-0 stroke-[2.6]" />
              </button>
            </Link>
          </div>
        </div>

        {/* Right Art Panel */}
        <div className="hidden md:flex items-center justify-center relative border-l-2 border-choco-900 bg-candy-100 p-6">
          <div className="relative size-32 rounded-3xl bg-cream border-2 border-choco-900 flex items-center justify-center shadow-[0_4px_0_#3B2218]">
            <img
              src="/mascot/idle.png"
              alt="Blobi"
              className="w-20 h-20 object-contain pixelated"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
