import { playClaim } from "@/lib/audio";
import { QUESTS, questProgress } from "@/lib/quests";
import { useProgress } from "@/lib/store";
import { cn } from "@/lib/utils";
import { DuoButton } from "@/components/duo-button";
import { BlockStamp, RouteChain } from "@/components/motif";

export function DailyQuests({ compact = false, className }: { compact?: boolean; className?: string }) {
  const xpToday = useProgress((s) => s.xpToday);
  const dailyGoal = useProgress((s) => s.dailyGoal);
  const lessonsToday = useProgress((s) => s.lessonsToday);
  const perfectToday = useProgress((s) => s.perfectToday);
  const storiesToday = useProgress((s) => s.storiesToday);
  const claimed = useProgress((s) => s.claimedQuests);
  const claimQuest = useProgress((s) => s.claimQuest);
  const stats = { xpToday, dailyGoal, lessonsToday, perfectToday, storiesToday };

  return (
    <section className={cn(compact ? "pt-3" : "mt-6", className)}>
      {compact ? (
        <p className="mb-1 text-sm font-medium text-muted">Misi harian</p>
      ) : (
        <h2 className="text-lg font-bold">Misi harian</h2>
      )}
      <ul className="flex flex-col">
        {(compact ? QUESTS.filter((q) => q.id !== "perfect") : QUESTS).map((q) => {
          const prog = questProgress(q.id, stats);
          const taken = claimed.includes(q.id);
          return (
            <li key={q.id} className="flex items-center gap-3 border-t border-line py-2.5 first:border-t-0">
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold leading-tight">{q.label}</p>
                {prog.need <= 3 ? (
                  <div className="mt-1.5">
                    <RouteChain
                      have={prog.have}
                      need={prog.need}
                      label={`${Math.min(prog.have, prog.need)}/${prog.need}`}
                    />
                  </div>
                ) : (
                  <div className="mt-1.5 space-y-1">
                    <div className="h-2 w-full rounded-full bg-[#E4F0FF] border border-[#B9CFE9] overflow-hidden">
                      <div
                        className="h-full rounded-full bg-[#0B63F6] transition-all duration-300"
                        style={{ width: `${Math.min(100, Math.round((prog.have / prog.need) * 100))}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[10px] font-bold text-[#4A6580]">
                      <span>Progress</span>
                      <span className="tabular-nums">{Math.min(prog.have, prog.need)}/{prog.need} XP</span>
                    </div>
                  </div>
                )}
                <p className="mt-1 flex items-center gap-1 text-sm font-medium text-muted">
                  <BlockStamp size={12} />
                  +{q.gems} bintang
                </p>
              </div>
              {taken ? (
                <span className="text-sm font-medium text-muted">Diklaim</span>
              ) : prog.done ? (
                <DuoButton
                  variant="primary"
                  size="sm"
                  onClick={() => {
                    if (claimQuest(q.id)) playClaim();
                  }}
                >
                  Klaim
                </DuoButton>
              ) : null}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
