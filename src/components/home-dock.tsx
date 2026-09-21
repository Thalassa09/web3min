import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Ticket, Sparkles, Clock, ArrowRight, BookOpen } from "lucide-react";
import { TactileButton } from "@/components/ui/tactile-button";
import { SurfaceCard } from "@/components/ui/surface-card";
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
      <SurfaceCard className="mx-4 mt-4 p-5 border-[#ff4365]/30">
        <div className="flex items-center gap-2 mb-2">
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#ff4365]/15 text-[#ff4365]">
            Nyawa Habis
          </span>
        </div>
        <h2 className="font-display font-extrabold text-xl text-[#f1f4fa]">
          Istirahat Sejenak
        </h2>
        <p className="mt-1 text-xs text-[#8e9ab2] leading-relaxed">
          Nyawa berikutnya siap dalam {formatHeartWait(wait)}. Atau kamu bisa membaca cerita Web3 tanpa mengurangi nyawa.
        </p>
        <div className="mt-4 flex flex-col sm:flex-row gap-2">
          <Link to="/kisah" className="flex-1">
            <TactileButton variant="secondary" size="md" fullWidth icon={<BookOpen className="size-4" />}>
              Baca Kisah Tanpa Nyawa
            </TactileButton>
          </Link>
          <Link to="/shop" className="sm:w-auto">
            <TactileButton variant="primary" size="md" icon={<Sparkles className="size-4" />}>
              Beli Nyawa di Toko
            </TactileButton>
          </Link>
        </div>
      </SurfaceCard>
    );
  }

  return (
    <SurfaceCard className="mx-4 mt-4 p-5">
      {lesson && world ? (
        <div className="space-y-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#182030] text-[#8e9ab2]">
                {world.land}
              </span>
              {lessonNo > 0 && (
                <span className="text-xs text-[#5a667d]">
                  Modul {lessonNo} dari {scoredLessons.length}
                </span>
              )}
            </div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-[#00f59b]">
              <Ticket className="size-3.5" />
              <span>+1 Tiket Undian</span>
            </div>
          </div>

          <div>
            <h2 className="font-display font-extrabold text-xl text-[#f1f4fa] tracking-tight">
              {goalHit ? "Target Harian Tercapai!" : lesson.title}
            </h2>
            <p className="mt-1 text-xs text-[#8e9ab2] leading-relaxed">
              {lesson.blurb}
            </p>
          </div>

          <div className="flex items-center gap-3 text-xs text-[#8e9ab2] py-0.5">
            <span className="flex items-center gap-1">
              <Clock className="size-3.5 text-[#5a667d]" /> ~{mins} Menit
            </span>
            <span>·</span>
            <span className="text-[#f59e0b] font-semibold">+{lesson.xp} XP</span>
            <span>·</span>
            <span className="text-[#f59e0b] font-semibold">+{lesson.gems} Bintang</span>
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
                icon={<ArrowRight className="size-4" />}
              >
                {started ? "Lanjutkan Pelajaran" : "Mulai Belajar Sekarang"}
              </TactileButton>
            </Link>
          </div>

          <div className="pt-2">
            <RouteChain have={xpToday} need={dailyGoal} label={`${xpToday}/${dailyGoal} XP Target Harian`} />
          </div>

          {showCaraLink && (
            <div className="pt-1 flex justify-end">
              <Link to="/cara" className="text-xs text-[#8e9ab2] hover:text-[#00f59b] transition-colors">
                Petunjuk Bermain →
              </Link>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-4 space-y-2">
          <h2 className="font-display font-extrabold text-xl text-[#f1f4fa]">
            Semua Modul Selesai!
          </h2>
          <p className="text-xs text-[#8e9ab2]">
            Kamu telah menyelesaikan seluruh materi belajar. Masuk ke Arena Undian untuk menukarkan tiketmu!
          </p>
        </div>
      )}
    </SurfaceCard>
  );
}
