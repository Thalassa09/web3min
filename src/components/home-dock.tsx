import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Check, Lock, Sparkles, BookOpen, Trophy } from "lucide-react";
import { TactileButton } from "@/components/ui/tactile-button";
import { SurfaceCard } from "@/components/ui/surface-card";
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
      <div className="mx-3 sm:mx-4 mt-4 p-5 md:p-6 rounded-[16px] border-2 border-ink-900 bg-blobi-soft shadow-[4px_4px_0_#1B1440]">
        <div className="flex items-center gap-2 mb-2">
          <span className="px-2.5 py-0.5 rounded-[8px] text-xs font-['Pixelify_Sans'] font-bold bg-blobi text-white border-[1.5px] border-ink-900">
            Nyawa Habis
          </span>
        </div>
        <h2 className="font-sans font-extrabold text-xl text-ink-900">
          Istirahat Sejenak
        </h2>
        <p className="mt-1 text-xs sm:text-sm text-ink-500 leading-relaxed">
          Nyawa berikutnya pulih dalam {formatHeartWait(wait)}. Kamu tetap bisa membaca cerita Web3 tanpa mengurangi nyawa.
        </p>
        <div className="mt-4 flex flex-col sm:flex-row gap-2.5">
          <Link to="/kisah" className="flex-1">
            <TactileButton variant="secondary" size="md" fullWidth icon={<BookOpen className="size-4" />}>
              Baca Kisah Tanpa Nyawa
            </TactileButton>
          </Link>
          <Link to="/shop" className="sm:w-auto">
            <TactileButton variant="primary" size="md" icon={<Sparkles className="size-4" />}>
              Pulihkan di Toko
            </TactileButton>
          </Link>
        </div>
      </div>
    );
  }

  if (!lesson || !world) {
    return (
      <SurfaceCard className="mx-3 sm:mx-4 mt-4 p-6 bg-white text-center">
        <h2 className="font-sans font-extrabold text-2xl text-ink-900 inline-flex items-center justify-center gap-2">
          Semua Modul Selesai! <Trophy className="size-6 text-coin shrink-0" />
        </h2>
        <p className="mt-1.5 text-xs sm:text-sm text-ink-500">
          Kamu telah menuntaskan seluruh modul kurikulum. Kunjungi Arena untuk melihat peringkat belajarmu!
        </p>
        <div className="pt-4">
          <Link to="/leaderboard">
            <TactileButton variant="primary" size="md">
              Buka Arena
            </TactileButton>
          </Link>
        </div>
      </SurfaceCard>
    );
  }

  const unitNum = unit ? unit.id.replace(/^u/, "") : "1";

  return (
    <div className="mx-3 sm:mx-4 mt-4 space-y-4">
      {/* Hero Card */}
      <div className="rounded-[16px] border-2 border-ink-900 shadow-[4px_4px_0_#1B1440] bg-white overflow-hidden grid grid-cols-1 md:grid-cols-[1fr_200px]">
        {/* Left Body */}
        <div className="p-6 flex flex-col justify-between min-w-0">
          <div>
            <div className="font-['Pixelify_Sans'] text-xs font-semibold uppercase tracking-wider text-ink-500">
              Unit {unitNum} · {world.land} — Modul {lessonNo}/{scoredLessons.length}
            </div>
            <h1 className="font-sans font-extrabold text-2xl sm:text-3xl text-ink-900 tracking-tight mt-2 leading-tight">
              {lesson.title}
            </h1>
            <p className="font-sans font-medium text-sm text-ink-500 mt-1.5 leading-relaxed">
              {lesson.blurb}
            </p>

            {/* Single Sun Chip for Rewards & Duration Chip */}
            <div className="flex items-center gap-2 flex-wrap my-3.5">
              <span className="inline-flex items-center gap-1 font-['Pixelify_Sans'] text-xs font-semibold px-2.5 py-1 rounded-[8px] border-[1.5px] border-ink-900 bg-canvas text-ink-900">
                ~{mins} menit
              </span>
              <span className="inline-flex items-center gap-1 font-['Pixelify_Sans'] text-xs font-bold px-2.5 py-1 rounded-[8px] border-[1.5px] border-ink-900 bg-cream text-ink-900">
                +{lesson.xp} XP · +{lesson.gems} ★
              </span>
            </div>

            {/* Segmented Pixel Blocks */}
            <div
              className="grid gap-1.5 mb-5"
              style={{
                gridTemplateColumns: `repeat(${Math.max(1, scoredLessons.length)}, minmax(0, 1fr))`,
              }}
            >
              {scoredLessons.map((l) => {
                const isDone = completed.includes(l.id);
                const isNow = l.id === lesson.id;
                return (
                  <span
                    key={l.id}
                    className={`h-3 rounded-[4px] border-2 border-ink-900 transition-colors ${
                      isDone
                        ? "bg-leaf"
                        : isNow
                        ? "bg-blobi"
                        : "bg-white"
                    }`}
                  />
                );
              })}
            </div>
          </div>

          <div>
            <Link
              to="/lesson/$lessonId"
              params={{ lessonId: lesson.id }}
              className="block"
              onClick={() => useProgress.getState().completeGuide()}
            >
              <button
                type="button"
                className="w-full inline-flex items-center justify-center gap-2 font-sans font-extrabold text-sm sm:text-base py-3 px-6 rounded-[12px] bg-blobi text-white border-2 border-ink-900 shadow-[4px_4px_0_#1B1440] hover:brightness-105 active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0_#1B1440] transition-[transform,box-shadow,filter] cursor-pointer"
              >
                <span>{started ? "Lanjutkan Pelajaran" : "Mulai Belajar"}</span>
                <ArrowRight className="size-4 sm:size-5 shrink-0 stroke-[2.4]" />
              </button>
            </Link>
          </div>
        </div>

        {/* Right Art Panel (Desktop) */}
        <div className="hidden md:grid place-items-end justify-center relative border-l-2 border-ink-900 bg-gradient-to-b from-[#FFD6E4] to-[#FFE9D6] overflow-hidden">
          <div className="absolute inset-x-0 bottom-0 h-11 bg-leaf border-t-2 border-ink-900" />
          <img
            src="/mascot/idle.png"
            alt="Blobi"
            className="w-[120px] relative z-10 mb-6 pixelated animate-bounce duration-1000 object-contain"
            style={{ animationDuration: "2.4s" }}
          />
        </div>
      </div>

      {/* Path Step List */}
      <div className="flex flex-col gap-2.5">
        {scoredLessons.slice(0, 4).map((item, idx) => {
          const isDone = completed.includes(item.id);
          const isNow = item.id === lesson.id;
          const isLock = !isDone && !isNow;

          if (isDone) {
            return (
              <div
                key={item.id}
                className="flex items-center gap-3.5 p-3.5 bg-white border-2 border-ink-900 rounded-[14px]"
              >
                <div className="size-9 rounded-[10px] border-2 border-ink-900 bg-leaf text-white flex items-center justify-center shrink-0">
                  <Check className="size-5 stroke-[2.5]" />
                </div>
                <b className="flex-1 font-sans font-bold text-sm text-ink-900 truncate">
                  {item.title}
                </b>
                <span className="font-['Pixelify_Sans'] font-semibold text-xs text-ink-500">
                  Selesai
                </span>
              </div>
            );
          }

          if (isNow) {
            return (
              <div
                key={item.id}
                className="flex items-center gap-3.5 p-3.5 bg-blobi-soft border-2 border-ink-900 rounded-[14px] shadow-[4px_4px_0_#1B1440]"
              >
                <div className="size-9 rounded-[10px] border-2 border-ink-900 bg-blobi text-white flex items-center justify-center font-['Pixelify_Sans'] font-bold text-base shrink-0">
                  {idx + 1}
                </div>
                <b className="flex-1 font-sans font-extrabold text-sm text-ink-900 truncate">
                  {item.title}
                </b>
                <span className="font-['Pixelify_Sans'] font-bold text-xs text-blobi">
                  Sekarang
                </span>
              </div>
            );
          }

          return (
            <div
              key={item.id}
              className="flex items-center gap-3.5 p-3.5 bg-transparent border-2 border-dashed border-ink-900 rounded-[14px] text-ink-500 opacity-80"
            >
              <div className="size-9 rounded-[10px] border-2 border-dashed border-ink-900 flex items-center justify-center font-['Pixelify_Sans'] font-bold text-sm shrink-0">
                {idx + 1}
              </div>
              <b className="flex-1 font-sans font-medium text-sm truncate">
                {item.title}
              </b>
              <Lock className="size-4 shrink-0 stroke-[2.2]" />
            </div>
          );
        })}
      </div>
    </div>
  );
}
