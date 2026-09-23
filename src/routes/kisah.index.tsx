import { useState } from "react";
import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowRight, Check, Lock } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { CASES, STORIES, isOpen } from "@/lib/stories";
import { useProgress } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/kisah/")({ component: KisahHub });

function getCategoryBand(s: { id: string; title: string; blurb: string }) {
  const text = `${s.id} ${s.title} ${s.blurb}`.toLowerCase();
  if (
    text.includes("defi") ||
    text.includes("pinjam") ||
    text.includes("swap") ||
    text.includes("pool") ||
    text.includes("bank") ||
    text.includes("lps") ||
    text.includes("dex")
  ) {
    return { name: "DeFi", color: "#1FCB8B" }; // Mint
  }
  if (
    text.includes("kerja") ||
    text.includes("karir") ||
    text.includes("gaji") ||
    text.includes("bounty") ||
    text.includes("community") ||
    text.includes("intern") ||
    text.includes("dao")
  ) {
    return { name: "Career", color: "#4D7CFF" }; // Sky
  }
  return { name: "Keamanan", color: "#FF5C8A" }; // Security Pink
}

function KisahHub() {
  const completed = useProgress((s) => s.completed);
  const doneStories = useProgress((s) => s.completedStories);
  const doneCases = useProgress((s) => s.completedCases);
  const [tab, setTab] = useState<"cerita" | "kasus">("cerita");

  const openStories = STORIES.filter((s) => isOpen(s.unlockAfter, completed));
  const lockedStories = STORIES.filter((s) => !isOpen(s.unlockAfter, completed));
  const openCases = CASES.filter((c) => isOpen(c.unlockAfter, completed));
  const lockedCases = CASES.filter((c) => !isOpen(c.unlockAfter, completed));
  const featured = openStories.find((s) => !doneStories.includes(s.id)) ?? openStories[0];

  return (
    <AppShell>
      <main className="px-3.5 py-5 sm:px-6 sm:py-7 pb-[calc(6rem+env(safe-area-inset-bottom))] sm:pb-28 max-w-5xl mx-auto space-y-6">
        <div>
          <div className="font-sans text-xs font-semibold tracking-wider uppercase text-ink-500">
            Arsip Investigasi
          </div>
          <h1 className="font-sans font-extrabold text-3xl sm:text-4xl text-ink-900 tracking-tight mt-1.5">
            Kisah Web3
          </h1>
        </div>

        {/* Feature Weekly Story */}
        {featured && (
          <div className="p-6 rounded-[16px] bg-ink-900 text-white border-2 border-ink-900 shadow-[4px_4px_0_#1B1440] flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
            <div>
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-[8px] bg-coin text-ink-900 border-[1.5px] border-ink-900 font-sans font-bold text-xs">
                Pilihan minggu ini · {featured.minutes} menit
              </span>
              <h2 className="font-sans font-extrabold text-xl sm:text-2xl text-white mt-3 mb-1.5">
                {featured.title}
              </h2>
              <p className="font-sans font-medium text-xs sm:text-sm text-[#C9C4E8] leading-relaxed max-w-xl">
                {featured.blurb}
              </p>
            </div>
            <Link to="/kisah/$storyId" params={{ storyId: featured.id }}>
              <button
                type="button"
                className="inline-flex items-center justify-center gap-2 font-sans font-extrabold text-sm px-5 py-3 rounded-[12px] bg-blobi text-white border-2 border-ink-900 shadow-[4px_4px_0_#1B1440] hover:brightness-105 active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0_#1B1440] cursor-pointer"
              >
                <span>Baca</span>
                <ArrowRight className="size-4" />
              </button>
            </Link>
          </div>
        )}

        {/* Segmented Filter Navigation */}
        <div className="inline-flex gap-1 p-1 rounded-[14px] border-2 border-ink-900 bg-white shadow-[2px_2px_0_#1B1440]">
          <button
            type="button"
            onClick={() => setTab("cerita")}
            className={cn(
              "px-4 py-2 rounded-[10px] font-sans font-extrabold text-sm transition-all cursor-pointer",
              tab === "cerita" ? "bg-ink-900 text-white" : "text-ink-500 hover:text-ink-900"
            )}
          >
            Cerita Interaktif · {openStories.length}
          </button>
          <button
            type="button"
            onClick={() => setTab("kasus")}
            className={cn(
              "px-4 py-2 rounded-[10px] font-sans font-extrabold text-sm transition-all cursor-pointer",
              tab === "kasus" ? "bg-ink-900 text-white" : "text-ink-500 hover:text-ink-900"
            )}
          >
            Kasus On-Chain · {openCases.length}
          </button>
        </div>

        {/* Stories Tab */}
        {tab === "cerita" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
              {openStories.map((s) => {
                const isDone = doneStories.includes(s.id);
                const band = getCategoryBand(s);
                return (
                  <div
                    key={s.id}
                    className="p-0 overflow-hidden flex flex-col bg-white border-2 border-ink-900 rounded-[16px] shadow-[4px_4px_0_#1B1440]"
                  >
                    <div className="h-2.5 border-b-2 border-ink-900" style={{ backgroundColor: band.color }} />
                    <div className="p-4 sm:p-5 flex flex-col gap-2.5 flex-1">
                      <div className="flex items-center justify-between">
                        {isDone ? (
                          <span className="inline-flex items-center gap-1 text-xs font-sans font-bold px-2 py-0.5 rounded-[6px] bg-[#D8F7EA] text-ink-900 border-[1.5px] border-ink-900">
                            <Check className="size-3 text-leaf" /> Selesai
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-xs font-sans font-bold px-2 py-0.5 rounded-[6px] bg-blobi-soft text-ink-900 border-[1.5px] border-ink-900">
                            Baru
                          </span>
                        )}
                        <span className="font-sans text-xs font-bold text-ink-500">{band.name}</span>
                      </div>

                      <h3 className="font-sans font-extrabold text-base sm:text-lg text-ink-900">
                        {s.title}
                      </h3>
                      <p className="font-sans font-medium text-xs sm:text-sm text-ink-500 line-clamp-2 leading-relaxed">
                        {s.blurb}
                      </p>

                      <div className="flex items-center justify-between mt-auto pt-3 border-t-2 border-dashed border-ink-900/15">
                        <span className="font-sans text-xs font-bold text-ink-500">
                          {s.minutes} mnt · <span className="text-[#FF7A1A]">+{s.xp} XP</span>
                        </span>
                        <Link to="/kisah/$storyId" params={{ storyId: s.id }}>
                          <button
                            type="button"
                            className={cn(
                              "inline-flex items-center justify-center font-sans font-extrabold text-xs px-3.5 py-1.5 rounded-[10px] border-2 border-ink-900 shadow-[2px_2px_0_#1B1440] transition-all active:translate-x-[1px] active:translate-y-[1px] active:shadow-none cursor-pointer",
                              isDone
                                ? "bg-white text-ink-900 hover:bg-canvas"
                                : "bg-blobi text-white hover:brightness-105"
                            )}
                          >
                            {isDone ? "Baca ulang" : "Baca"}
                          </button>
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {lockedStories.length > 0 && (
              <div className="pt-4 space-y-3">
                <div className="font-sans text-xs font-bold text-ink-500 uppercase tracking-wider">
                  Terkunci · Selesaikan Modul Belajar untuk Membuka
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {lockedStories.map((s) => (
                    <div
                      key={s.id}
                      className="p-4 rounded-[14px] bg-white/70 border-2 border-dashed border-ink-900/40 flex items-center gap-3 text-ink-500"
                    >
                      <Lock className="size-4 shrink-0 text-ink-900" />
                      <div className="min-w-0">
                        <div className="font-sans font-bold text-xs text-ink-900 truncate">{s.title}</div>
                        <div className="font-sans text-[11px] text-ink-500 truncate">
                          Perlu modul ke-{s.unlockAfter}
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
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
              {openCases.map((c) => {
                const isDone = doneCases.includes(c.id);
                return (
                  <div
                    key={c.id}
                    className="p-0 overflow-hidden flex flex-col bg-white border-2 border-ink-900 rounded-[16px] shadow-[4px_4px_0_#1B1440]"
                  >
                    <div className="h-2.5 border-b-2 border-ink-900 bg-blobi" />
                    <div className="p-4 sm:p-5 flex flex-col gap-2.5 flex-1">
                      <div className="flex items-center justify-between">
                        {isDone ? (
                          <span className="inline-flex items-center gap-1 text-xs font-sans font-bold px-2 py-0.5 rounded-[6px] bg-[#D8F7EA] text-ink-900 border-[1.5px] border-ink-900">
                            <Check className="size-3 text-leaf" /> Selesai
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-xs font-sans font-bold px-2 py-0.5 rounded-[6px] bg-blobi-soft text-ink-900 border-[1.5px] border-ink-900">
                            Kasus Nyata
                          </span>
                        )}
                        <span className="font-sans text-xs font-bold text-ink-500">Audit On-Chain</span>
                      </div>

                      <h3 className="font-sans font-extrabold text-base sm:text-lg text-ink-900">
                        {c.title}
                      </h3>
                      <p className="font-sans font-medium text-xs sm:text-sm text-ink-500 line-clamp-2 leading-relaxed">
                        {c.blurb}
                      </p>

                      <div className="flex items-center justify-between mt-auto pt-3 border-t-2 border-dashed border-ink-900/15">
                        <span className="font-sans text-xs font-bold text-ink-500">
                          {c.minutes} mnt · <span className="text-[#FF7A1A]">+{c.xp} XP</span>
                        </span>
                        <Link to="/bedah/$caseId" params={{ caseId: c.id }}>
                          <button
                            type="button"
                            className={cn(
                              "inline-flex items-center justify-center font-sans font-extrabold text-xs px-3.5 py-1.5 rounded-[10px] border-2 border-ink-900 shadow-[2px_2px_0_#1B1440] transition-all active:translate-x-[1px] active:translate-y-[1px] active:shadow-none cursor-pointer",
                              isDone
                                ? "bg-white text-ink-900 hover:bg-canvas"
                                : "bg-blobi text-white hover:brightness-105"
                            )}
                          >
                            {isDone ? "Tinjau ulang" : "Bedah"}
                          </button>
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {lockedCases.length > 0 && (
              <div className="pt-4 space-y-3">
                <div className="font-sans text-xs font-bold text-ink-500 uppercase tracking-wider">
                  Kasus Terkunci
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {lockedCases.map((c) => (
                    <div
                      key={c.id}
                      className="p-4 rounded-[14px] bg-white/70 border-2 border-dashed border-ink-900/40 flex items-center gap-3 text-ink-500"
                    >
                      <Lock className="size-4 shrink-0 text-ink-900" />
                      <div className="min-w-0">
                        <div className="font-sans font-bold text-xs text-ink-900 truncate">{c.title}</div>
                        <div className="font-sans text-[11px] text-ink-500 truncate">
                          Perlu modul ke-{c.unlockAfter}
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
