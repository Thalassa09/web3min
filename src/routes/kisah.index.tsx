import { useState } from "react";
import { Link, createFileRoute } from "@tanstack/react-router";
import { BookOpen, ShieldAlert, Clock, ArrowRight, Lock, CheckCircle2 } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Mascot } from "@/components/mascot";
import { Web3Map } from "@/components/web3-map";
import { CASES, STORIES, isOpen, unlockProgress } from "@/lib/stories";
import { useProgress } from "@/lib/store";
import { SurfaceCard } from "@/components/ui/surface-card";
import { TactileButton } from "@/components/ui/tactile-button";
import { SegmentedNav } from "@/components/ui/segmented-nav";

export const Route = createFileRoute("/kisah/")({ component: KisahHub });

function KisahHub() {
  const completed = useProgress((s) => s.completed);
  const doneStories = useProgress((s) => s.completedStories);
  const doneCases = useProgress((s) => s.completedCases);
  const [tab, setTab] = useState<string>("cerita");
  const [topics, setTopics] = useState(false);

  const openStories = STORIES.filter((s) => isOpen(s.unlockAfter, completed));
  const lockedStories = STORIES.filter((s) => !isOpen(s.unlockAfter, completed));
  const openCases = CASES.filter((c) => isOpen(c.unlockAfter, completed));
  const lockedCases = CASES.filter((c) => !isOpen(c.unlockAfter, completed));
  const featured = openStories.find((s) => !doneStories.includes(s.id)) ?? openStories[0];

  return (
    <AppShell>
      <main className="px-4 py-6 max-w-5xl mx-auto space-y-6">
        {/* Page Header Banner */}
        <SurfaceCard className="p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-[16px] bg-[#141824] border border-[#232b3e] shrink-0">
                <Mascot mood="think" size={56} />
              </div>
              <div>
                <h1 className="font-display font-extrabold text-2xl text-[#f1f4fa] tracking-tight">
                  Arsip Investigasi & Kisah Web3
                </h1>
                <p className="text-xs sm:text-sm text-[#8e9ab2] mt-1 max-w-xl leading-relaxed">
                  Web3 bukan cuma grafik harga. Pahami arsitektur wallet, celah smart contract, dan bukti on-chain nyata.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setTopics((v) => !v)}
              className="px-3.5 py-2 rounded-[12px] bg-[#141824] border border-[#232b3e] text-[#f1f4fa] text-xs font-semibold hover:bg-[#1a2030] transition-colors shrink-0"
            >
              {topics ? "Tutup Peta Topik" : "Lihat Peta Topik"}
            </button>
          </div>
        </SurfaceCard>

        {/* Collapsible Topics Map */}
        {topics && (
          <SurfaceCard className="p-5">
            <Web3Map compact />
          </SurfaceCard>
        )}

        {/* Featured Story Spotlight Card */}
        {featured && (
          <SurfaceCard className="p-6 border-[#00e5ff]/25 bg-gradient-to-r from-[#0c141d] to-[#0e121a]">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2 max-w-2xl">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#00e5ff]/15 text-[#00e5ff]">
                    Rekomendasi Minggu Ini
                  </span>
                  <span className="flex items-center gap-1 text-xs text-[#8e9ab2]">
                    <Clock className="size-3.5" />
                    ~3 Menit Baca
                  </span>
                </div>
                <h2 className="font-display font-bold text-xl sm:text-2xl text-[#f1f4fa]">
                  {featured.title}
                </h2>
                <p className="text-xs sm:text-sm text-[#8e9ab2] leading-relaxed">
                  {featured.blurb}
                </p>
              </div>

              <div className="shrink-0">
                <Link to="/kisah/$storyId" params={{ storyId: featured.id }}>
                  <TactileButton
                    variant="primary"
                    size="md"
                    icon={<ArrowRight className="size-4" />}
                  >
                    Mulai Baca Cerita
                  </TactileButton>
                </Link>
              </div>
            </div>
          </SurfaceCard>
        )}

        {/* Segmented Filter Navigation */}
        <div className="flex items-center justify-between gap-4 pt-2">
          <SegmentedNav
            activeId={tab}
            onChange={setTab}
            items={[
              {
                id: "cerita",
                label: "Cerita Interaktif",
                icon: <BookOpen className="size-3.5" />,
                badge: openStories.length,
              },
              {
                id: "kasus",
                label: "Kasus Nyata On-Chain",
                icon: <ShieldAlert className="size-3.5" />,
                badge: openCases.length,
              },
            ]}
          />
        </div>

        {/* Stories Tab */}
        {tab === "cerita" && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {openStories.map((s) => {
                const isDone = doneStories.includes(s.id);
                return (
                  <SurfaceCard key={s.id} className="p-5 flex flex-col justify-between hover:border-[#2b354c] transition-all">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-[#8e9ab2] flex items-center gap-1">
                          <Clock className="size-3" />
                          3 Menit
                        </span>
                        {isDone && (
                          <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#00f59b]">
                            <CheckCircle2 className="size-3.5" /> Selesai
                          </span>
                        )}
                      </div>
                      <h3 className="font-display font-bold text-base text-[#f1f4fa] mt-2">
                        {s.title}
                      </h3>
                      <p className="text-xs text-[#8e9ab2] mt-1 line-clamp-2 leading-relaxed">
                        {s.blurb}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-[#1a2130] flex items-center justify-end">
                      <Link to="/kisah/$storyId" params={{ storyId: s.id }}>
                        <TactileButton variant={isDone ? "secondary" : "primary"} size="sm">
                          {isDone ? "Baca Ulang" : "Baca Sekarang →"}
                        </TactileButton>
                      </Link>
                    </div>
                  </SurfaceCard>
                );
              })}
            </div>

            {lockedStories.length > 0 && (
              <div className="pt-4 space-y-3">
                <div className="text-xs font-bold text-[#5a667d] uppercase tracking-wider">
                  Terkunci · Selesaikan Modul Belajar untuk Membuka
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 opacity-60">
                  {lockedStories.map((s) => (
                    <div key={s.id} className="p-4 rounded-[16px] bg-[#0c1017] border border-[#1a2130] flex items-center gap-3">
                      <Lock className="size-4 text-[#5a667d] shrink-0" />
                      <div className="min-w-0">
                        <div className="font-semibold text-xs text-[#8e9ab2] truncate">{s.title}</div>
                        <div className="text-[11px] text-[#5a667d] truncate">
                          Perlu menyelesaikan modul ke-{s.unlockAfter}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Cases Tab */}
        {tab === "kasus" && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {openCases.map((c) => {
                const isDone = doneCases.includes(c.id);
                return (
                  <SurfaceCard key={c.id} className="p-5 flex flex-col justify-between hover:border-[#2b354c] transition-all">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-[#8e9ab2] flex items-center gap-1">
                          <Clock className="size-3" />
                          Kasus Nyata
                        </span>
                        {isDone && (
                          <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#00f59b]">
                            <CheckCircle2 className="size-3.5" /> Selesai
                          </span>
                        )}
                      </div>
                      <h3 className="font-display font-bold text-base text-[#f1f4fa] mt-2">
                        {c.title}
                      </h3>
                      <p className="text-xs text-[#8e9ab2] mt-1 line-clamp-2 leading-relaxed">
                        {c.blurb}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-[#1a2130] flex items-center justify-end">
                      <Link to="/bedah/$caseId" params={{ caseId: c.id }}>
                        <TactileButton variant={isDone ? "secondary" : "primary"} size="sm">
                          {isDone ? "Tinjau Ulang" : "Bedah Kasus →"}
                        </TactileButton>
                      </Link>
                    </div>
                  </SurfaceCard>
                );
              })}
            </div>

            {lockedCases.length > 0 && (
              <div className="pt-4 space-y-3">
                <div className="text-xs font-bold text-[#5a667d] uppercase tracking-wider">
                  Kasus Terkunci
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 opacity-60">
                  {lockedCases.map((c) => (
                    <div key={c.id} className="p-4 rounded-[16px] bg-[#0c1017] border border-[#1a2130] flex items-center gap-3">
                      <Lock className="size-4 text-[#5a667d] shrink-0" />
                      <div className="min-w-0">
                        <div className="font-semibold text-xs text-[#8e9ab2] truncate">{c.title}</div>
                        <div className="text-[11px] text-[#5a667d] truncate">
                          Perlu menyelesaikan modul ke-{c.unlockAfter}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </AppShell>
  );
}
