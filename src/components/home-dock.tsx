import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Ticket, Sparkles, Clock, ArrowRight, BookOpen, Trophy } from "lucide-react";
import { TactileButton } from "@/components/ui/tactile-button";
import { SurfaceCard } from "@/components/ui/surface-card";
import { RouteChain } from "@/components/motif";
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
  const dailyGoal = useProgress((s) => s.dailyGoal);
  const [wait, setWait] = useState(() => msUntilHeart(heartsUpdatedAt));

  const currentId = firstPlayableId(completed);
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
      <SurfaceCard className="mx-3 sm:mx-4 mt-4 p-5 md:p-6 border-2 border-[#F4A4A0] bg-[#FFF5F5]">
        <div className="flex items-center gap-2 mb-2">
          <span className="px-3 py-0.5 rounded-full text-xs font-extrabold bg-[#E63329] text-white shadow-[0_2px_0_#B01E18]">
            Nyawa Habis
          </span>
        </div>
        <h2 className="font-display font-bold text-xl text-[#0D2340]">
          Istirahat Sejenak
        </h2>
        <p className="mt-1 text-xs sm:text-sm text-[#4A6580] leading-relaxed">
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
      </SurfaceCard>
    );
  }

  return (
    <SurfaceCard className="mx-3 sm:mx-4 mt-4 p-5 md:p-6 bg-white">
      {lesson && world ? (
        <div className="space-y-3.5">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-[#E4F0FF] text-[#0B4FD1] border border-[#8FC2FF]">
                {world.land}
              </span>
              {lessonNo > 0 && (
                <span className="text-xs font-bold text-[#4A6580]">
                  Modul {lessonNo} dari {scoredLessons.length}
                </span>
              )}
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-[#E8FBF0] text-[#1E8A49] border border-[#98E4B5]">
              <Ticket className="size-3.5" />
              <span>+1 Tiket Undian</span>
            </div>
          </div>

          <div>
            <h2 className="font-display font-bold text-2xl text-[#0D2340] tracking-tight">
              {goalHit ? "Target Harian Tercapai! 🎉" : lesson.title}
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-[#4A6580] leading-relaxed">
              {lesson.blurb}
            </p>
          </div>

          <div className="flex items-center gap-3 text-xs font-bold text-[#4A6580] py-0.5">
            <span className="flex items-center gap-1">
              <Clock className="size-3.5 text-[#4A6580]" /> ~{mins} Menit
            </span>
            <span>·</span>
            <span className="text-[#B27B00]">+{lesson.xp} XP</span>
            <span>·</span>
            <span className="text-[#B27B00]">+{lesson.gems} Bintang</span>
          </div>

          <div className="pt-2">
            <Link
              to="/lesson/$lessonId"
              params={{ lessonId: lesson.id }}
              className="block"
              data-coach="start"
              onClick={() => useProgress.getState().completeGuide()}
            >
              <TactileButton
                variant="primary"
                size="lg"
                fullWidth
                icon={<ArrowRight className="size-5" />}
              >
                {started ? "Lanjutkan Pelajaran" : "Mulai Belajar Sekarang"}
              </TactileButton>
            </Link>
          </div>

          {scoredLessons.length > 0 && (
            <div className="grid grid-cols-1 gap-1.5 pt-1">
              {scoredLessons.slice(0, 4).map((item, i) => {
                const done = completed.includes(item.id);
                const here = item.id === lesson.id;
                return (
                  <div
                    key={item.id}
                    className={`flex items-center gap-2 rounded-xl border px-3 py-2 ${
                      here
                        ? "border-sky-500 bg-[#E4F0FF]"
                        : done
                          ? "border-[#98E4B5] bg-[#E8FBF0]"
                          : "border-[#DCE7F5] bg-[#F7FBFF]"
                    }`}
                  >
                    <span className="grid size-6 shrink-0 place-items-center rounded-full bg-white text-[11px] font-extrabold text-[#0D2340] border border-[#DCE7F5]">
                      {i + 1}
                    </span>
                    <span className="min-w-0 flex-1 truncate text-[13px] font-bold text-[#0D2340]">{item.title}</span>
                    <span className="shrink-0 text-[11px] font-extrabold text-[#4A6580]">
                      {done ? "Selesai" : here ? "Sekarang" : "Berikutnya"}
                    </span>
                  </div>
                );
              })}
            </div>
          )}

          <div className="pt-2">
            <div className="flex items-center justify-between text-xs font-extrabold text-[#1E3A5F] mb-1.5">
              <span className="flex items-center gap-1.5">
                <Sparkles className="size-3.5 text-[#D99400] fill-[#FFC61A]" />
                Target Harian
              </span>
              <span className="tabular-nums font-bold text-[#4A6580]">
                {xpToday} / {dailyGoal} XP
              </span>
            </div>
            <div className="relative h-3.5 w-full overflow-hidden rounded-full bg-[#E4F0FF] border-2 border-[#B9CFE9] shadow-inner">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#FFD84D] to-[#FF9E00] shadow-[0_1px_2px_rgba(217,148,0,0.5)] transition-[width,background-color] duration-300"
                style={{ width: `${Math.min(100, Math.max(0, Math.round((xpToday / Math.max(1, dailyGoal)) * 100)))}%` }}
              />
            </div>
          </div>

          {showCaraLink && (
            <div className="pt-1 flex justify-end">
              <Link to="/cara" className="text-xs font-extrabold text-[#0B4FD1] hover:underline transition-colors">
                Petunjuk Bermain →
              </Link>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-4 space-y-2">
          <h2 className="font-display font-bold text-2xl text-[#0D2340] inline-flex items-center justify-center gap-2">
            Semua Modul Selesai! <Trophy className="size-6 text-[#FFC61A] shrink-0" />
          </h2>
          <p className="text-xs sm:text-sm text-[#4A6580]">
            Kamu telah menuntaskan seluruh 20 modul kurikulum. Kunjungi Arena Undian untuk menukar tiketmu!
          </p>
          <div className="pt-2">
            <Link to="/leaderboard" className="inline-block">
              <TactileButton variant="primary" size="md">
                Buka Arena Undian Hadiah
              </TactileButton>
            </Link>
          </div>
        </div>
      )}
    </SurfaceCard>
  );
}
