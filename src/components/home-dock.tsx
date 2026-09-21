import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Ticket, Sparkles, Clock, ArrowRight, BookOpen } from "lucide-react";
import { TactileButton } from "@/components/ui/tactile-button";
import { TelemetryBadge } from "@/components/ui/telemetry-badge";
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
      <div className="mx-4 mt-4 p-5 rounded-[22px] bg-[#12080c] border border-[#ff4365]/30 shadow-[0_4px_24px_rgba(0,0,0,0.5)]">
        <div className="flex items-center gap-2 mb-2">
          <TelemetryBadge label="STATUS" value="NYAWA HABIS" tone="rose" pulsing />
          <span className="text-[10px] font-mono text-zinc-500">PEMULIHAN OTOMATIS</span>
        </div>
        <h2 className="font-display font-black text-xl text-zinc-100 leading-snug">
          Nyawa Habis · Istirahat Sejenak
        </h2>
        <p className="mt-1 text-xs text-zinc-400 font-sans leading-relaxed">
          Nyawa berikutnya sekitar {formatHeartWait(wait)}. Atau baca kisah Web3 tanpa risiko pengurangan nyawa.
        </p>
        <div className="mt-4 flex flex-col sm:flex-row gap-2">
          <Link to="/kisah" className="flex-1">
            <TactileButton variant="secondary" size="md" fullWidth icon={<BookOpen className="size-4" />}>
              Baca Kisah Tanpa Nyawa
            </TactileButton>
          </Link>
          <Link to="/shop" className="sm:w-auto">
            <TactileButton variant="primary" size="md" icon={<Sparkles className="size-4" />}>
              Beli Nyawa (Shop)
            </TactileButton>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-4 mt-4 p-5 rounded-[24px] bg-gradient-to-b from-[#111322] to-[#0a0c16] border border-[#20253d] shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
      {lesson && world ? (
        <div className="space-y-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <TelemetryBadge label="ZONE" value={world.land} tone="cyan" />
              {lessonNo > 0 && (
                <span className="text-[11px] font-mono text-zinc-400">
                  MODUL {lessonNo}/{scoredLessons.length}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono text-[#00f59b] font-bold flex items-center gap-1">
                <Ticket className="size-3" /> +1 Tiket Raffle
              </span>
            </div>
          </div>

          <div>
            <h2 className="font-display font-black text-xl text-zinc-100 tracking-tight">
              {goalHit ? "Target Harian Tercapai!" : lesson.title}
            </h2>
            <p className="mt-1 text-xs text-zinc-400 font-sans leading-relaxed">
              {lesson.blurb}
            </p>
          </div>

          <div className="flex items-center gap-3 text-[11px] font-mono text-zinc-400 py-1">
            <span className="flex items-center gap-1">
              <Clock className="size-3 text-zinc-500" /> ~{mins} Menit
            </span>
            <span>/</span>
            <span className="text-[#f59e0b] font-bold">+{lesson.xp} XP</span>
            <span>/</span>
            <span className="text-[#f59e0b] font-bold">+{lesson.gems} Bintang</span>
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
              <Link to="/cara" className="text-xs font-mono text-zinc-500 hover:text-[#00e5ff] transition-colors">
                Petunjuk Bermain →
              </Link>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-4 space-y-2">
          <TelemetryBadge label="STATUS" value="ALL COMPLETE" tone="mint" />
          <h2 className="font-display font-black text-xl text-zinc-100">Semua Rute Berhasil Diselesaikan!</h2>
          <p className="text-xs text-zinc-400 font-sans">
            Kamu telah menguasai seluruh kurikulum dasar Web3. Ikuti undian bulanan atau perdalam analisis kasus.
          </p>
        </div>
      )}
    </div>
  );
}
