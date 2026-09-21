import { useState } from "react";
import { Link, createFileRoute } from "@tanstack/react-router";
import { BookOpenText, Lock, MagnifyingGlass } from "@/lib/kicon";
import { AppShell } from "@/components/app-shell";
import { Mascot } from "@/components/mascot";
import { Web3Map } from "@/components/web3-map";
import { CASES, STORIES, isOpen, unlockProgress } from "@/lib/stories";
import { useProgress } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/kisah/")({ component: KisahHub });

function KisahHub() {
  const completed = useProgress((s) => s.completed);
  const hearts = useProgress((s) => s.hearts);
  const doneStories = useProgress((s) => s.completedStories);
  const doneCases = useProgress((s) => s.completedCases);
  const [tab, setTab] = useState<"cerita" | "bedah">("cerita");
  const [topics, setTopics] = useState(false);
  const openStories = STORIES.filter((s) => isOpen(s.unlockAfter, completed));
  const lockedStories = STORIES.filter((s) => !isOpen(s.unlockAfter, completed));
  const openCases = CASES.filter((c) => isOpen(c.unlockAfter, completed));
  const lockedCases = CASES.filter((c) => !isOpen(c.unlockAfter, completed));
  const featured = openStories.find((s) => !doneStories.includes(s.id)) ?? openStories[0];

  return (
    <AppShell>
      <main className="px-4 py-4">
        <div className="flex items-start gap-3">
          <Mascot mood={hearts <= 0 ? "wave" : "think"} size={72} className="shrink-0" />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-primary">Cerita singkat</p>
            <h1 className="text-[28px] font-extrabold leading-[34px]">Kisah & bedah</h1>
            <p className="mt-1 text-base leading-6 text-muted">
              Web3 bukan cuma soal trading. Jelajahi wallet, DeFi, NFT, DAO, keamanan, dan peluang kerja lewat cerita
              singkat.
            </p>
          </div>
        </div>

        {featured ? (
          <Link
            to="/kisah/$storyId"
            params={{ storyId: featured.id }}
            className="mt-5 flex w-full items-start gap-3 rounded-2xl bg-paper p-4"
          >
            <BookOpenText className="mt-0.5 size-8 shrink-0 text-fg" weight="fill" />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-primary">Cerita yang direkomendasikan</p>
              <p className="text-lg font-bold leading-tight">{featured.title}</p>
              <p className="mt-1 text-sm leading-5 text-muted">{featured.blurb}</p>
              <p className="mt-2 text-sm font-medium tabular-nums text-muted">{featured.minutes} menit</p>
            </div>
          </Link>
        ) : null}

        <button
          type="button"
          className="mt-4 min-h-11 text-sm font-bold text-primary"
          onClick={() => setTopics((v) => !v)}
        >
          {topics ? "Sembunyikan topik" : "Lihat semua topik"}
        </button>
        {topics ? <Web3Map compact className="mt-3" /> : null}

        <div className="mt-5 flex flex-wrap gap-2" role="tablist" aria-label="Jenis kisah">
          <TabBtn active={tab === "cerita"} onClick={() => setTab("cerita")}>
            Cerita
          </TabBtn>
          <TabBtn active={tab === "bedah"} onClick={() => setTab("bedah")}>
            Bedah kasus
          </TabBtn>
        </div>

        {tab === "cerita" ? (
            <ul className="mt-3 flex flex-col divide-y divide-line" role="tabpanel">
            {openStories.map((s) => {
              const done = doneStories.includes(s.id);
              return (
                <li key={s.id}>
                  <Link
                    to="/kisah/$storyId"
                    params={{ storyId: s.id }}
                    className={cn("flex min-h-12 w-full items-center gap-3 py-3", done && "text-primary")}
                  >
                    <BookOpenText className={cn("size-7", done ? "text-unit-teal" : "text-fg")} weight="fill" />
                    <div className="min-w-0 flex-1">
                      <p className="font-bold leading-tight">{s.title}</p>
                      <p className="truncate text-sm leading-5 text-muted">{s.blurb}</p>
                    </div>
                    <span className="shrink-0 text-sm font-medium tabular-nums text-muted">{done ? "Selesai" : `${s.minutes} menit`}</span>
                  </Link>
                </li>
              );
            })}
            {lockedStories.slice(0, 2).map((s) => (
              <LockedRow key={s.id} title={s.title} unlockAfter={s.unlockAfter} completed={completed} />
            ))}
          </ul>
        ) : (
          <div role="tabpanel">
            <p className="mt-3 text-base leading-6 text-muted">
              Pelajari klaim, promosi, dan kasus Web3 dari postingan nyata. Kita periksa buktinya, bukan cuma ikut ramai.
            </p>
            <ul className="mt-2 flex flex-col divide-y divide-line">
              {openCases.map((c) => {
                const done = doneCases.includes(c.id);
                return (
                  <li key={c.id}>
                    <Link
                      to="/bedah/$caseId"
                      params={{ caseId: c.id }}
                      className={cn("flex min-h-12 w-full items-center gap-3 py-3", done && "text-primary")}
                    >
                      <MagnifyingGlass className={cn("size-7", done ? "text-unit-teal" : "text-streak")} weight="bold" />
                      <div className="min-w-0 flex-1">
                        <p className="font-bold leading-tight">{c.title}</p>
                        <p className="truncate text-sm leading-5 text-muted">{c.blurb}</p>
                      </div>
                      <span className="text-sm font-medium tabular-nums text-muted">{done ? "Selesai" : `${c.minutes} menit`}</span>
                    </Link>
                  </li>
                );
              })}
              {lockedCases.slice(0, 1).map((c) => (
                <LockedRow key={c.id} title={c.title} unlockAfter={c.unlockAfter} completed={completed} />
              ))}
            </ul>
          </div>
        )}
      </main>
    </AppShell>
  );
}

function TabBtn({ active, onClick, children }: { active: boolean; onClick: () => void; children: string }) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={
        active
          ? "min-h-11 rounded-full bg-primary px-4 text-sm font-bold text-primary-ink"
          : "min-h-11 rounded-full bg-paper px-4 text-sm font-medium text-muted"
      }
    >
      {children}
    </button>
  );
}

function LockedRow({
  title,
  unlockAfter,
  completed,
}: {
  title: string;
  unlockAfter: string | null;
  completed: string[];
}) {
  const prog = unlockProgress(unlockAfter, completed);
  return (
    <li className="flex items-center gap-3 py-3">
      <Lock className="size-7 shrink-0 text-muted" weight="fill" />
      <div className="min-w-0 flex-1">
        <p className="font-bold leading-tight">{title}</p>
        <p className="text-sm leading-5 text-muted">Selesaikan pelajaran sebelumnya untuk membuka rute ini.</p>
        {prog.total > 0 ? (
          <p className="mt-0.5 text-sm font-medium tabular-nums text-muted">
            Progress {prog.have}/{prog.total}
          </p>
        ) : null}
      </div>
    </li>
  );
}
