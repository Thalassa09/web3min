import { useState } from "react";
import { Link, createFileRoute } from "@tanstack/react-router";
import { BookOpen, ShieldAlert, Clock, ArrowRight, Lock, CheckCircle2 } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Mascot } from "@/components/mascot";
import { Web3Map } from "@/components/web3-map";
import { CASES, STORIES, isOpen } from "@/lib/stories";
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
      <main className="px-3 py-4 sm:px-4 sm:py-6 max-w-5xl mx-auto space-y-6">
        {/* Page Header Banner */}
        <SurfaceCard className="p-6 bg-white">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-[20px] bg-[#E4F0FF] border-2 border-[#8FC2FF] shadow-[0_3px_0_#C2DBFA] shrink-0">
                <Mascot mood="think" size={56} />
              </div>
              <div>
                <h1 className="font-display font-bold text-2xl sm:text-3xl text-[#0D2340] tracking-tight">
                  Arsip Investigasi & Kisah Web3
                </h1>
                <p className="text-xs sm:text-sm font-medium text-[#5A7796] mt-1 max-w-xl leading-relaxed">
                  Web3 bukan cuma grafik harga. Pahami arsitektur wallet, celah smart contract, dan bukti on-chain nyata.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setTopics((v) => !v)}
              className="px-4 py-2 rounded-[14px] bg-white border-2 border-[#DCE7F5] text-[#0D2340] text-xs font-extrabold hover:bg-[#F0F6FF] shadow-[0_3px_0_#C8DBF0] active:translate-y-[2px] active:shadow-none transition-all shrink-0 cursor-pointer"
            >
              {topics ? "Tutup Peta Topik" : "Lihat Peta Topik"}
            </button>
          </div>
        </SurfaceCard>

        {/* Collapsible Topics Map */}
        {topics && (
          <SurfaceCard className="p-5 bg-white">
            <Web3Map compact />
          </SurfaceCard>
        )}

        {/* Featured Story Spotlight Card */}
        {featured && (
          <SurfaceCard className="p-6 bg-white border-2 border-[#8FC2FF]">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2 max-w-2xl">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-[#E4F0FF] text-[#0B63F6] border border-[#8FC2FF]">
                    Rekomendasi Minggu Ini
                  </span>
                  <span className="flex items-center gap-1 text-xs font-medium text-[#5A7796]">
                    <Clock className="size-3.5" />
                    ~3 Menit Baca
                  </span>
                </div>
                <h2 className="font-display font-bold text-xl sm:text-2xl text-[#0D2340]">
                  {featured.title}
                </h2>
                <p className="text-xs sm:text-sm font-medium text-[#5A7796] leading-relaxed">
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
        <div className="flex items-center justify-between gap-4 pt-1">
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
                  <SurfaceCard key={s.id} className="p-5 bg-white flex flex-col justify-between hover:border-[#8FC2FF] transition-all">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-[#5A7796] flex items-center gap-1">
                          <Clock className="size-3" />
                          3 Menit
                        </span>
                        {isDone && (
                          <span className="inline-flex items-center gap-1 text-xs font-extrabold text-[#1E8A49] bg-[#E8FBF0] px-2.5 py-0.5 rounded-full border border-[#98E4B5]">
                            <CheckCircle2 className="size-3.5" /> Selesai
                          </span>
                        )}
                      </div>
                      <h3 className="font-display font-bold text-lg text-[#0D2340] mt-2">
                        {s.title}
                      </h3>
                      <p className="text-xs font-medium text-[#5A7796] mt-1.5 line-clamp-2 leading-relaxed">
                        {s.blurb}
                      </p>
                    </div>

                    <div className="mt-5 pt-3.5 border-t-2 border-[#F0F6FF] flex items-center justify-end">
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
                <div className="text-xs font-extrabold text-white uppercase tracking-wider drop-shadow-sm">
                  Terkunci · Selesaikan Modul Belajar untuk Membuka
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 opacity-75">
                  {lockedStories.map((s) => (
                    <div key={s.id} className="p-4 rounded-[18px] bg-white/90 border-2 border-[#DCE7F5] flex items-center gap-3">
                      <Lock className="size-4 text-[#5A7796] shrink-0" />
                      <div className="min-w-0">
                        <div className="font-extrabold text-xs text-[#0D2340] truncate">{s.title}</div>
                        <div className="text-[11px] font-medium text-[#5A7796] truncate">
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
                  <SurfaceCard key={c.id} className="p-5 bg-white flex flex-col justify-between hover:border-[#8FC2FF] transition-all">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-[#5A7796] flex items-center gap-1">
                          <Clock className="size-3" />
                          Kasus Nyata
                        </span>
                        {isDone && (
                          <span className="inline-flex items-center gap-1 text-xs font-extrabold text-[#1E8A49] bg-[#E8FBF0] px-2.5 py-0.5 rounded-full border border-[#98E4B5]">
                            <CheckCircle2 className="size-3.5" /> Selesai
                          </span>
                        )}
                      </div>
                      <h3 className="font-display font-bold text-lg text-[#0D2340] mt-2">
                        {c.title}
                      </h3>
                      <p className="text-xs font-medium text-[#5A7796] mt-1.5 line-clamp-2 leading-relaxed">
                        {c.blurb}
                      </p>
                    </div>

                    <div className="mt-5 pt-3.5 border-t-2 border-[#F0F6FF] flex items-center justify-end">
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
                <div className="text-xs font-extrabold text-white uppercase tracking-wider drop-shadow-sm">
                  Kasus Terkunci
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 opacity-75">
                  {lockedCases.map((c) => (
                    <div key={c.id} className="p-4 rounded-[18px] bg-white/90 border-2 border-[#DCE7F5] flex items-center gap-3">
                      <Lock className="size-4 text-[#5A7796] shrink-0" />
                      <div className="min-w-0">
                        <div className="font-extrabold text-xs text-[#0D2340] truncate">{c.title}</div>
                        <div className="text-[11px] font-medium text-[#5A7796] truncate">
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
