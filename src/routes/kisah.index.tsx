import { useState } from "react";
import { Link, createFileRoute } from "@tanstack/react-router";
import { BookOpen, ShieldAlert, Sparkles, Clock, ArrowRight, Lock, CheckCircle2 } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Mascot } from "@/components/mascot";
import { Web3Map } from "@/components/web3-map";
import { CASES, STORIES, isOpen, unlockProgress } from "@/lib/stories";
import { useProgress } from "@/lib/store";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { TelemetryBadge } from "@/components/ui/telemetry-badge";
import { SegmentedNav } from "@/components/ui/segmented-nav";

export const Route = createFileRoute("/kisah/")({ component: KisahHub });

function KisahHub() {
  const completed = useProgress((s) => s.completed);
  const hearts = useProgress((s) => s.hearts);
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
      <main className="px-4 py-6 max-w-5xl mx-auto space-y-8">
        {/* Header Hero Hub */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-[24px] bg-gradient-to-r from-[#0d1022] to-[#070810] border border-[#1d233a] shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
          <div className="flex items-center gap-4">
            <div className="p-2 rounded-2xl bg-[#13172e] border border-white/5 shrink-0">
              <Mascot mood={hearts <= 0 ? "wave" : "think"} size={68} />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <TelemetryBadge label="ARCHIVE" value="DEEP-DIVE" tone="cyan" />
                <span className="text-[10px] font-mono text-zinc-500">KASUS & AUDIT NYATA</span>
              </div>
              <h1 className="font-display font-black text-2xl text-zinc-100 tracking-tight">
                Arsip Investigasi & Kisah Web3
              </h1>
              <p className="text-xs text-zinc-400 font-sans mt-0.5 max-w-xl">
                Web3 bukan cuma grafik harga. Pahami arsitektur wallet, eksploitasi smart contract, airdrop scam, dan bukti on-chain nyata.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setTopics((v) => !v)}
            className="px-3.5 py-2 rounded-[12px] bg-[#141728] border border-[#272e4a] text-zinc-200 font-mono text-xs font-bold uppercase hover:bg-[#1c223c] active:scale-[0.96] transition-all shrink-0"
          >
            {topics ? "Tutup Peta Topik" : "Lihat Peta Topik"}
          </button>
        </div>

        {/* Collapsible Web3 Topics Map */}
        {topics && (
          <div className="p-4 rounded-[20px] bg-[#090b14] border border-[#1b1f33] animate-fade-in">
            <Web3Map compact />
          </div>
        )}

        {/* Featured Case Study Spotlight Card */}
        {featured && (
          <SpotlightCard glowColor="rgba(0, 229, 255, 0.2)" className="w-full">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1.5 min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <TelemetryBadge label="REKOMENDASI HARI INI" tone="mint" pulsing />
                  <span className="text-xs font-mono text-zinc-500 flex items-center gap-1">
                    <Clock className="size-3" /> {featured.minutes} Menit Baca
                  </span>
                </div>
                <h2 className="font-display font-black text-lg text-zinc-100 truncate">
                  {featured.title}
                </h2>
                <p className="text-xs text-zinc-400 font-sans line-clamp-2">
                  {featured.blurb}
                </p>
              </div>

              <Link
                to="/kisah/$storyId"
                params={{ storyId: featured.id }}
                className="inline-flex items-center gap-2 h-10 px-5 rounded-[12px] bg-[#00e5ff] text-[#06080b] font-mono text-xs font-bold uppercase tracking-wider shadow-[0_3px_0_#0097a7] hover:bg-[#33ebff] active:translate-y-[2px] active:shadow-none transition-all shrink-0"
              >
                <span>Mulai Baca</span>
                <ArrowRight className="size-3.5" />
              </Link>
            </div>
          </SpotlightCard>
        )}

        {/* Segmented Tab Filter */}
        <div className="flex items-center justify-between border-b border-[#181d2e] pb-4">
          <SegmentedNav
            items={[
              { id: "cerita", label: "Cerita Naratif", icon: <BookOpen className="size-3.5" />, badge: openStories.length },
              { id: "bedah", label: "Bedah Kasus On-Chain", icon: <ShieldAlert className="size-3.5" />, badge: openCases.length },
            ]}
            activeId={tab}
            onChange={(id) => setTab(id)}
          />
          <span className="text-xs font-mono text-zinc-500 hidden sm:inline">
            TOTAL TERSEDIA: {tab === "cerita" ? openStories.length : openCases.length} MODUL
          </span>
        </div>

        {/* Content Tab Panels */}
        {tab === "cerita" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {openStories.map((s) => {
              const done = doneStories.includes(s.id);
              return (
                <Link
                  key={s.id}
                  to="/kisah/$storyId"
                  params={{ storyId: s.id }}
                  className={`group p-4 rounded-[20px] bg-[#090b14] border transition-all duration-200 flex flex-col justify-between ${
                    done
                      ? "border-[#00f59b]/35 hover:border-[#00f59b]/60"
                      : "border-[#191d2f] hover:border-[#2b3353] hover:bg-[#0d1020]"
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <TelemetryBadge
                        label={done ? "SELESAI" : "TERSEDIA"}
                        tone={done ? "mint" : "zinc"}
                      />
                      <span className="text-xs font-mono text-zinc-500 flex items-center gap-1">
                        <Clock className="size-3" /> {s.minutes}m
                      </span>
                    </div>

                    <h3 className="font-display font-bold text-base text-zinc-100 group-hover:text-[#00e5ff] transition-colors leading-snug">
                      {s.title}
                    </h3>
                    <p className="text-xs text-zinc-400 font-sans line-clamp-2 leading-relaxed">
                      {s.blurb}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#141829] flex items-center justify-between text-xs font-mono">
                    <span className={done ? "text-[#00f59b] font-bold" : "text-zinc-500"}>
                      {done ? "Tuntas Dipelajari" : "Buka Modul"}
                    </span>
                    <ArrowRight className="size-3.5 text-zinc-500 group-hover:translate-x-1 group-hover:text-zinc-200 transition-all" />
                  </div>
                </Link>
              );
            })}

            {lockedStories.map((s) => (
              <div
                key={s.id}
                className="p-4 rounded-[20px] bg-[#06070d] border border-[#141724] opacity-50 flex flex-col justify-between"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1 text-[10px] font-mono text-zinc-500 uppercase">
                      <Lock className="size-3" /> TERKUNCI
                    </span>
                  </div>
                  <h3 className="font-display font-bold text-sm text-zinc-300">{s.title}</h3>
                  <p className="text-xs text-zinc-500 font-sans line-clamp-2">{s.blurb}</p>
                </div>
                <div className="mt-3 text-[11px] font-mono text-zinc-600">
                  Perlu menyelesaikan modul rute sebelumnya.
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {openCases.map((c) => {
              const done = doneCases.includes(c.id);
              return (
                <Link
                  key={c.id}
                  to="/bedah/$caseId"
                  params={{ caseId: c.id }}
                  className={`group p-4 rounded-[20px] bg-[#090b14] border transition-all duration-200 flex flex-col justify-between ${
                    done
                      ? "border-[#00f59b]/35 hover:border-[#00f59b]/60"
                      : "border-[#191d2f] hover:border-[#ff9100]/40 hover:bg-[#0d1020]"
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <TelemetryBadge
                        label={done ? "SELESAI" : "AUDIT KASUS"}
                        tone={done ? "mint" : "amber"}
                      />
                      <span className="text-xs font-mono text-zinc-500 flex items-center gap-1">
                        <Clock className="size-3" /> {c.minutes}m
                      </span>
                    </div>

                    <h3 className="font-display font-bold text-base text-zinc-100 group-hover:text-[#f59e0b] transition-colors leading-snug">
                      {c.title}
                    </h3>
                    <p className="text-xs text-zinc-400 font-sans line-clamp-2 leading-relaxed">
                      {c.blurb}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#141829] flex items-center justify-between text-xs font-mono">
                    <span className={done ? "text-[#00f59b] font-bold" : "text-zinc-500"}>
                      {done ? "Audit Lengkap" : "Buka Analisis Bukti"}
                    </span>
                    <ArrowRight className="size-3.5 text-zinc-500 group-hover:translate-x-1 group-hover:text-zinc-200 transition-all" />
                  </div>
                </Link>
              );
            })}

            {lockedCases.map((c) => (
              <div
                key={c.id}
                className="p-4 rounded-[20px] bg-[#06070d] border border-[#141724] opacity-50 flex flex-col justify-between"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1 text-[10px] font-mono text-zinc-500 uppercase">
                      <Lock className="size-3" /> TERKUNCI
                    </span>
                  </div>
                  <h3 className="font-display font-bold text-sm text-zinc-300">{c.title}</h3>
                  <p className="text-xs text-zinc-500 font-sans line-clamp-2">{c.blurb}</p>
                </div>
                <div className="mt-3 text-[11px] font-mono text-zinc-600">
                  Perlu menyelesaikan modul rute sebelumnya.
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </AppShell>
  );
}
