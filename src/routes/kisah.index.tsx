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
    return { name: "DeFi", color: "#6FE3C1" }; // Mint
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
    return { name: "Career", color: "#9B6BFF" }; // Grape / Purple
  }
  return { name: "Keamanan", color: "#E8437F" }; // Candy Pink
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
      <main className="px-3 py-4 sm:px-6 sm:py-6 pb-[calc(6rem+env(safe-area-inset-bottom))] sm:pb-28 max-w-5xl mx-auto space-y-5">
        <div>
          <div className="font-pixel text-[11px] sm:text-xs font-bold tracking-wider uppercase text-choco-600">
            Arsip Investigasi
          </div>
          <h1 className="font-pixel font-bold text-2xl sm:text-3xl text-choco-900 tracking-tight mt-1">
            Kisah Web3
          </h1>
        </div>

        {/* Feature Weekly Story */}
        {featured && (
          <div className="p-4 sm:p-6 rounded-3xl bg-gradient-to-b from-white via-[#FFF9F5] to-[#FDEEE4] border-2 border-choco-900/18 shadow-[0_5px_0_#3B2218,0_10px_24px_-4px_rgba(59,34,24,0.12)] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-xl bg-gradient-to-b from-[#FFE873] to-[#FFD84D] text-choco-900 border-2 border-amber-600/40 font-display font-bold text-[11px] sm:text-xs shadow-[0_1.5px_0_#C8940C]">
                ★ Pilihan minggu ini · {featured.minutes} menit
              </span>
              <h2 className="font-display font-bold text-lg sm:text-2xl text-choco-900 mt-2.5 mb-1">
                {featured.title}
              </h2>
              <p className="font-sans font-medium text-xs sm:text-sm text-choco-600 leading-relaxed max-w-xl">
                {featured.blurb}
              </p>
            </div>
            <Link to="/kisah/$storyId" params={{ storyId: featured.id }}>
              <button
                type="button"
                className="inline-flex items-center justify-center gap-1.5 font-display font-bold text-xs sm:text-sm px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl bg-gradient-to-b from-[#FF6699] via-[#E8437F] to-[#D82668] text-white border-2 border-candy-600/50 shadow-[0_3px_0_#B01F62] hover:brightness-105 active:translate-y-[1px] active:shadow-none cursor-pointer transition-all"
              >
                <span>Baca Sekarang</span>
                <ArrowRight className="size-4" />
              </button>
            </Link>
          </div>
        )}

        {/* Segmented Filter Navigation */}
        <div className="inline-flex gap-1 p-1 rounded-2xl border-2 border-candy-500/30 bg-gradient-to-b from-[#FFF0F5] to-[#FFE4EC] shadow-[0_2px_0_#B01F62]">
          <button
            type="button"
            onClick={() => setTab("cerita")}
            className={cn(
              "px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl font-display font-bold text-xs sm:text-sm transition-all cursor-pointer",
              tab === "cerita"
                ? "bg-gradient-to-b from-[#FF6699] via-[#E8437F] to-[#D82668] text-white border-2 border-candy-600/50 shadow-[0_2px_0_#B01F62]"
                : "text-choco-600 hover:text-choco-900 border-2 border-transparent"
            )}
          >
            Cerita Interaktif · {openStories.length}
          </button>
          <button
            type="button"
            onClick={() => setTab("kasus")}
            className={cn(
              "px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl font-display font-bold text-xs sm:text-sm transition-all cursor-pointer",
              tab === "kasus"
                ? "bg-gradient-to-b from-[#FF6699] via-[#E8437F] to-[#D82668] text-white border-2 border-candy-600/50 shadow-[0_2px_0_#B01F62]"
                : "text-choco-600 hover:text-choco-900 border-2 border-transparent"
            )}
          >
            Kasus On-Chain · {openCases.length}
          </button>
        </div>

        {/* Stories Tab */}
        {tab === "cerita" && (
          <div className="space-y-6">
            {/* 2 COLUMNS ON MOBILE (grid-cols-2), 3 COLUMNS ON DESKTOP (md:grid-cols-3) */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5 sm:gap-4">
              {openStories.map((s) => {
                const isDone = doneStories.includes(s.id);
                const band = getCategoryBand(s);
                return (
                  <div
                    key={s.id}
                    className="p-0 overflow-hidden flex flex-col bg-gradient-to-b from-white via-[#FFF9F5] to-[#FDEEE4] border-2 border-choco-900/18 rounded-2xl sm:rounded-3xl shadow-[0_4px_0_#3B2218,0_8px_16px_-4px_rgba(59,34,24,0.10)] transition-[transform,box-shadow] hover:translate-y-[-2px] hover:shadow-[0_6px_0_#3B2218,0_12px_24px_-4px_rgba(59,34,24,0.14)]"
                  >
                    <div className="h-2 sm:h-2.5 border-b-2 border-choco-900/15" style={{ backgroundColor: band.color }} />
                    <div className="p-2.5 sm:p-4 flex flex-col gap-1.5 sm:gap-2 flex-1 justify-between">
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between gap-1 flex-wrap">
                          {isDone ? (
                            <span className="inline-flex items-center gap-0.5 text-[10px] sm:text-xs font-bold px-1.5 py-0.5 rounded-lg bg-emerald-100 text-emerald-800 border border-emerald-400 shadow-[0_1px_0_#15803D]">
                              <Check className="size-2.5 sm:size-3 text-emerald-700" /> Selesai
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-0.5 text-[10px] sm:text-xs font-bold px-1.5 py-0.5 rounded-lg bg-candy-100 text-candy-700 border border-candy-300 shadow-[0_1px_0_#B01F62]">
                              Baru
                            </span>
                          )}
                          <span className="text-[10px] sm:text-xs font-bold text-choco-600">
                            {band.name}
                          </span>
                        </div>

                        <h3 className="font-display font-bold text-xs sm:text-base text-choco-900 leading-snug line-clamp-2 min-h-[2rem] sm:min-h-[2.5rem]">
                          {s.title}
                        </h3>
                        <p className="font-sans font-medium text-[10px] sm:text-xs text-choco-600 line-clamp-2 leading-relaxed">
                          {s.blurb}
                        </p>
                      </div>

                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-1.5 pt-2 sm:pt-2.5 border-t-2 border-dashed border-choco-900/15 mt-auto">
                        <span className="text-[10px] sm:text-xs font-bold text-choco-600 flex items-center justify-between sm:justify-start gap-1">
                          <span>{s.minutes}m</span>
                          <span>·</span>
                          <span className="text-orange-600">+{s.xp} XP</span>
                        </span>
                        <Link to="/kisah/$storyId" params={{ storyId: s.id }} className="w-full sm:w-auto">
                          <button
                            type="button"
                            className={cn(
                              "w-full sm:w-auto inline-flex items-center justify-center font-bold text-[10px] sm:text-xs px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-xl border-2 transition-all active:translate-y-[1px] active:shadow-none cursor-pointer",
                              isDone
                                ? "bg-white text-choco-900 border-choco-900/20 shadow-[0_1.5px_0_#3B2218] hover:bg-candy-50"
                                : "bg-gradient-to-b from-[#FF6699] via-[#E8437F] to-[#D82668] text-white border-candy-600/50 shadow-[0_2.5px_0_#B01F62] hover:brightness-105"
                            )}
                          >
                            {isDone ? "Baca lagi" : "Mulai"}
                          </button>
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {lockedStories.length > 0 && (
              <div className="pt-3 space-y-2.5">
                <div className="font-pixel text-[11px] sm:text-xs font-bold text-choco-600 uppercase tracking-wider">
                  Terkunci · Selesaikan Modul Belajar
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 sm:gap-3">
                  {lockedStories.map((s) => (
                    <div
                      key={s.id}
                      className="p-2.5 sm:p-3 rounded-[14px] bg-cream/70 border-2 border-dashed border-choco-900/40 shadow-[0_1px_0_rgba(59,34,24,0.06)] flex items-center gap-2 text-choco-600"
                    >
                      <Lock className="size-3.5 shrink-0 text-choco-900" />
                      <div className="min-w-0">
                        <div className="font-pixel font-bold text-[11px] sm:text-xs text-choco-900 truncate">
                          {s.title}
                        </div>
                        <div className="font-sans text-[10px] text-choco-600 truncate">
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
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5 sm:gap-4">
              {openCases.map((c) => {
                const isDone = doneCases.includes(c.id);
                return (
                  <div
                    key={c.id}
                    className="p-0 overflow-hidden flex flex-col bg-gradient-to-b from-white via-[#FFF9F5] to-[#FDEEE4] border-2 border-choco-900/18 rounded-2xl sm:rounded-3xl shadow-[0_4px_0_#3B2218,0_8px_16px_-4px_rgba(59,34,24,0.10)] transition-[transform,box-shadow] hover:translate-y-[-2px] hover:shadow-[0_6px_0_#3B2218,0_12px_24px_-4px_rgba(59,34,24,0.14)]"
                  >
                    <div className="h-2 sm:h-2.5 border-b-2 border-candy-600/30 bg-gradient-to-r from-candy-400 to-candy-600" />
                    <div className="p-2.5 sm:p-4 flex flex-col gap-1.5 sm:gap-2 flex-1 justify-between">
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between gap-1 flex-wrap">
                          {isDone ? (
                            <span className="inline-flex items-center gap-0.5 text-[10px] sm:text-xs font-bold px-1.5 py-0.5 rounded-lg bg-emerald-100 text-emerald-800 border border-emerald-400 shadow-[0_1px_0_#15803D]">
                              <Check className="size-2.5 sm:size-3 text-emerald-700" /> Selesai
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-0.5 text-[10px] sm:text-xs font-bold px-1.5 py-0.5 rounded-lg bg-candy-100 text-candy-700 border border-candy-300 shadow-[0_1px_0_#B01F62]">
                              Kasus Nyata
                            </span>
                          )}
                          <span className="text-[10px] sm:text-xs font-bold text-choco-600">
                            Audit On-Chain
                          </span>
                        </div>

                        <h3 className="font-display font-bold text-xs sm:text-base text-choco-900 leading-snug line-clamp-2 min-h-[2rem] sm:min-h-[2.5rem]">
                          {c.title}
                        </h3>
                        <p className="font-sans font-medium text-[10px] sm:text-xs text-choco-600 line-clamp-2 leading-relaxed">
                          {c.blurb}
                        </p>
                      </div>

                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-1.5 pt-2 sm:pt-2.5 border-t-2 border-dashed border-choco-900/15 mt-auto">
                        <span className="text-[10px] sm:text-xs font-bold text-choco-600 flex items-center justify-between sm:justify-start gap-1">
                          <span>{c.minutes}m</span>
                          <span>·</span>
                          <span className="text-orange-600">+{c.xp} XP</span>
                        </span>
                        <Link to="/bedah/$caseId" params={{ caseId: c.id }} className="w-full sm:w-auto">
                          <button
                            type="button"
                            className={cn(
                              "w-full sm:w-auto inline-flex items-center justify-center font-bold text-[10px] sm:text-xs px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-xl border-2 transition-all active:translate-y-[1px] active:shadow-none cursor-pointer",
                              isDone
                                ? "bg-white text-choco-900 border-choco-900/20 shadow-[0_1.5px_0_#3B2218] hover:bg-candy-50"
                                : "bg-gradient-to-b from-[#FF6699] via-[#E8437F] to-[#D82668] text-white border-candy-600/50 shadow-[0_2.5px_0_#B01F62] hover:brightness-105"
                            )}
                          >
                            {isDone ? "Tinjau" : "Bedah"}
                          </button>
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {lockedCases.length > 0 && (
              <div className="pt-3 space-y-2.5">
                <div className="font-pixel text-[11px] sm:text-xs font-bold text-choco-600 uppercase tracking-wider">
                  Kasus Terkunci
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 sm:gap-3">
                  {lockedCases.map((c) => (
                    <div
                      key={c.id}
                      className="p-2.5 sm:p-3 rounded-[14px] bg-cream/70 border-2 border-dashed border-choco-900/40 shadow-[0_1px_0_rgba(59,34,24,0.06)] flex items-center gap-2 text-choco-600"
                    >
                      <Lock className="size-3.5 shrink-0 text-choco-900" />
                      <div className="min-w-0">
                        <div className="font-pixel font-bold text-[11px] sm:text-xs text-choco-900 truncate">
                          {c.title}
                        </div>
                        <div className="font-sans text-[10px] text-choco-600 truncate">
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
