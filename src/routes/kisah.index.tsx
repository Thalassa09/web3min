import { useState } from "react";
import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowRight, Check, Lock, Sparkles, Compass } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { CASES, STORIES, isOpen } from "@/lib/stories";
import { useProgress } from "@/lib/store";
import { cn } from "@/lib/utils";
import { AnimatedFeatureCard, FeatureCardColor } from "@/components/ui/feature-card-1";

export const Route = createFileRoute("/kisah/")({ component: KisahHub });

const STORY_ASSETS: Record<string, { image: string; color: FeatureCardColor; tag: string }> = {
  "s-peta": { image: "/proof/drop-arb-18k.png", color: "blue", tag: "Ekosistem L2" },
  "s-defi": { image: "/proof/drop-uni-pair.jpg", color: "emerald", tag: "DeFi Pool" },
  "s-kerja": { image: "/proof/drop-uni-gaji.jpg", color: "purple", tag: "Karir Web3" },
  "s-eth": { image: "/worlds/u1-genesis.jpg", color: "blue", tag: "Ethereum" },
  "s-liq": { image: "/proof/rugi-liqs.jpg", color: "orange", tag: "DeFi Risk" },
  "s-flash": { image: "/proof/cuan-winter.jpg", color: "emerald", tag: "Flash Loan" },
  "s-oracle": { image: "/proof/warn-approval.jpg", color: "purple", tag: "Oracle Exploit" },
  "s-arb": { image: "/proof/cuan-indo-lev.jpg", color: "orange", tag: "MEV & Arb" },
  "s-poison": { image: "/proof/warn-scam-arc.jpg", color: "rose", tag: "Address Poison" },
  "s-permit": { image: "/proof/scam-drainer.jpg", color: "rose", tag: "Permit Drainer" },
  "s-il": { image: "/proof/rugi-roundtrip.png", color: "emerald", tag: "Impermanent Loss" },
  "s-dm": { image: "/proof/warn-never-dm.jpg", color: "rose", tag: "Social Scam" },
  "s-seed": { image: "/proof/warn-sparkkitty.jpg", color: "rose", tag: "Malware Galeri" },
  "s-airdrop": { image: "/proof/warn-airdrop-honey.jpg", color: "blue", tag: "Fake Airdrop" },
  "s-drop-cuan": { image: "/proof/drop-uni-400.jpg", color: "emerald", tag: "Airdrop Claim" },
  "s-copy": { image: "/proof/cuan-20m.jpg", color: "purple", tag: "Copy Trading" },
  "s-honey": { image: "/proof/warn-honeypot.jpg", color: "rose", tag: "Honeypot Trap" },
  "s-cs": { image: "/proof/warn-hl-phish.jpg", color: "rose", tag: "Domain Phish" },
  "s-izin": { image: "/proof/warn-revoke.jpg", color: "rose", tag: "Revoke Izin" },
  "s-cukup": { image: "/proof/fumble-193m.jpg", color: "purple", tag: "Psikologi Exit" },
};

const CASE_ASSETS: Record<string, { image: string; color: FeatureCardColor; tag: string }> = {
  "b-seed": { image: "/proof/warn-seed.jpg", color: "rose", tag: "Kasus Seed" },
  "b-dm": { image: "/proof/warn-never-dm.jpg", color: "purple", tag: "Fake CS" },
  "b-phish": { image: "/proof/warn-phishing.jpg", color: "rose", tag: "Bursa Tutup" },
  "b-honey": { image: "/proof/warn-honeypot.jpg", color: "orange", tag: "Honeypot +605%" },
  "b-drain": { image: "/proof/scam-drainer.jpg", color: "rose", tag: "Drainer Kit $210" },
  "b-sim": { image: "/proof/warn-redpill.jpg", color: "rose", tag: "Simulasi Bohong" },
  "b-cuan": { image: "/proof/cuan-20m.jpg", color: "emerald", tag: "Cuan Rp20 M" },
  "b-drop": { image: "/proof/drop-arb-18k.png", color: "blue", tag: "Arbitrum Drop" },
  "b-rugi": { image: "/proof/rugi-33m.png", color: "rose", tag: "Short −$33M" },
  "b-zach": { image: "/proof/warn-zach.jpg", color: "rose", tag: "Email Trezor $1,2M" },
  "b-paper": { image: "/proof/rugi-paper.jpg", color: "orange", tag: "Profit Kertas" },
  "b-revoke": { image: "/proof/warn-revoke.jpg", color: "purple", tag: "Revoke Izin" },
  "b-coinex": { image: "/proof/warn-coinex.jpg", color: "rose", tag: "CoinEx $54,7M" },
  "b-dict": { image: "/proof/warn-dict.jpg", color: "rose", tag: "Brute Force $3,5M" },
};

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
      <main className="px-3 py-4 sm:px-6 sm:py-6 pb-[calc(6rem+env(safe-area-inset-bottom))] sm:pb-28 max-w-6xl mx-auto space-y-6 sm:space-y-8">
        {/* Header Title Section */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-choco-600">
              <Compass className="size-4 text-candy-600" />
              <span className="font-pixel text-[11px] sm:text-xs font-bold tracking-wider uppercase">
                Arsip Investigasi & Pembelajaran
              </span>
            </div>
            <h1 className="font-pixel font-bold text-2xl sm:text-4xl text-choco-900 tracking-tight mt-1">
              Kisah Web3
            </h1>
            <p className="font-sans text-xs sm:text-sm text-choco-600 mt-1 max-w-xl">
              Eksplorasi cerita interaktif, simulasi nyata, dan bedah audit forensik on-chain dengan kartu animasi 3D & bukti otentik.
            </p>
          </div>

          {/* Segmented Filter Navigation */}
          <div className="inline-flex self-start sm:self-auto gap-1 p-1 rounded-2xl border-2 border-choco-900 bg-cream shadow-[0_3px_0_#3B2218]">
            <button
              type="button"
              onClick={() => setTab("cerita")}
              className={cn(
                "px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl font-pixel font-bold text-xs sm:text-sm transition-all cursor-pointer",
                tab === "cerita"
                  ? "bg-candy-500 text-white border-2 border-choco-900 shadow-[0_2px_0_#3B2218]"
                  : "text-choco-700 hover:text-choco-900 border-2 border-transparent"
              )}
            >
              Cerita Interaktif · {openStories.length}
            </button>
            <button
              type="button"
              onClick={() => setTab("kasus")}
              className={cn(
                "px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl font-pixel font-bold text-xs sm:text-sm transition-all cursor-pointer",
                tab === "kasus"
                  ? "bg-candy-500 text-white border-2 border-choco-900 shadow-[0_2px_0_#3B2218]"
                  : "text-choco-700 hover:text-choco-900 border-2 border-transparent"
              )}
            >
              Kasus On-Chain · {openCases.length}
            </button>
          </div>
        </div>

        {/* Featured Banner Card */}
        {featured && (
          <div className="relative overflow-hidden rounded-[28px] border-3 border-choco-900 bg-gradient-to-br from-cream via-[#FFF8F0] to-[#FCECD8] p-5 sm:p-7 shadow-[0_8px_0_#3B2218] flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="relative z-10 max-w-2xl space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-300 text-choco-900 border-2 border-choco-900 font-pixel font-bold text-[11px] sm:text-xs shadow-[0_2px_0_#3B2218]">
                <Sparkles className="size-3.5 text-amber-800 fill-amber-500" />
                <span>PILIHAN MINGGU INI · {featured.minutes} MENIT BACA</span>
              </div>
              <h2 className="font-pixel font-bold text-xl sm:text-3xl text-choco-900 leading-tight">
                {featured.title}
              </h2>
              <p className="font-sans font-medium text-xs sm:text-base text-choco-700 leading-relaxed">
                {featured.blurb}
              </p>
            </div>

            <div className="relative z-10 flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
              <div className="hidden sm:block shrink-0 relative w-40 h-24 overflow-hidden rounded-2xl border-2 border-choco-900 bg-white shadow-[0_3px_0_#3B2218]">
                <img
                  src={STORY_ASSETS[featured.id]?.image || "/proof/drop-arb-18k.png"}
                  alt={featured.title}
                  className="w-full h-full object-cover object-top"
                  loading="lazy"
                />
                <div className="absolute top-1.5 right-1.5 px-1.5 py-0.5 rounded bg-choco-900/85 backdrop-blur-xs text-[8px] font-pixel font-bold text-white shadow-xs">
                  ARSIP BUKTI
                </div>
              </div>

              <Link
                to="/kisah/$storyId"
                params={{ storyId: featured.id }}
                className="w-full sm:w-auto"
              >
                <button
                  type="button"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 font-pixel font-bold text-xs sm:text-sm px-6 py-3 rounded-full bg-candy-500 hover:bg-candy-600 text-white border-2 border-choco-900 shadow-[0_4px_0_#3B2218] active:translate-y-1 active:shadow-[0_1px_0_#3B2218] cursor-pointer transition-all whitespace-nowrap"
                >
                  <span>Mulai Investigasi</span>
                  <ArrowRight className="size-4" />
                </button>
              </Link>
            </div>
          </div>
        )}

        {/* Stories Tab */}
        {tab === "cerita" && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
              {openStories.map((s, idx) => {
                const isDone = doneStories.includes(s.id);
                const assetConfig = STORY_ASSETS[s.id] ?? {
                  image: "/proof/drop-top50.jpg",
                  color: "blue" as FeatureCardColor,
                  tag: "Kisah",
                };
                const indexStr = String(idx + 1).padStart(3, "0");

                return (
                  <Link
                    key={s.id}
                    to="/kisah/$storyId"
                    params={{ storyId: s.id }}
                    className="block focus:outline-none focus-visible:ring-3 focus-visible:ring-candy-500 rounded-[28px]"
                  >
                    <AnimatedFeatureCard
                      index={indexStr}
                      tag={assetConfig.tag}
                      title={s.title}
                      blurb={s.blurb}
                      imageSrc={assetConfig.image}
                      color={assetConfig.color}
                      badge={
                        isDone ? (
                          <span className="inline-flex items-center gap-1 text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border-2 border-emerald-600 shadow-[0_1px_0_#15803D]">
                            <Check className="size-3 text-emerald-700" /> Selesai
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded-full bg-candy-100 text-candy-700 border-2 border-choco-900 shadow-[0_1px_0_#3B2218]">
                            Baru
                          </span>
                        )
                      }
                      footer={
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-pixel text-[10px] sm:text-xs font-bold text-choco-600 flex items-center gap-1.5">
                            <span>{s.minutes}m</span>
                            <span>•</span>
                            <span className="text-amber-600">+{s.xp} XP</span>
                          </span>
                          <span
                            className={cn(
                              "inline-flex items-center justify-center font-pixel font-bold text-[10px] sm:text-xs px-3 py-1 rounded-full border-2 border-choco-900 transition-all",
                              isDone
                                ? "bg-white text-choco-900 shadow-[0_2px_0_#3B2218] hover:bg-cream"
                                : "bg-candy-500 text-white shadow-[0_2px_0_#3B2218] hover:bg-candy-600"
                            )}
                          >
                            {isDone ? "Baca lagi" : "Mulai"}
                          </span>
                        </div>
                      }
                    />
                  </Link>
                );
              })}
            </div>

            {/* Locked Stories Section */}
            {lockedStories.length > 0 && (
              <div className="pt-4 space-y-4">
                <div className="flex items-center gap-2 text-choco-600">
                  <Lock className="size-4 text-choco-700" />
                  <span className="font-pixel text-xs sm:text-sm font-bold uppercase tracking-wider">
                    Kisah Terkunci · Selesaikan Modul Belajar
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {lockedStories.map((s, idx) => {
                    const assetConfig = STORY_ASSETS[s.id] ?? {
                      image: "/proof/drop-top50.jpg",
                      color: "blue" as FeatureCardColor,
                      tag: "Kisah",
                    };
                    const indexStr = String(openStories.length + idx + 1).padStart(3, "0");

                    return (
                      <AnimatedFeatureCard
                        key={s.id}
                        index={indexStr}
                        tag="Terkunci"
                        title={s.title}
                        blurb={s.blurb}
                        imageSrc={assetConfig.image}
                        color={assetConfig.color}
                        isLocked={true}
                        badge={
                          <span className="inline-flex items-center gap-1 text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded-full bg-choco-100 text-choco-700 border-2 border-choco-900/30">
                            <Lock className="size-3" /> Modul ke-{s.unlockAfter}
                          </span>
                        }
                        footer={
                          <div className="flex items-center justify-between text-[11px] font-sans text-choco-600">
                            <span>Selesaikan materi Pulau Rantai untuk membuka</span>
                          </div>
                        }
                      />
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Cases Tab */}
        {tab === "kasus" && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
              {openCases.map((c, idx) => {
                const isDone = doneCases.includes(c.id);
                const assetConfig = CASE_ASSETS[c.id] ?? {
                  image: "/proof/warn-phishing.jpg",
                  color: "rose" as FeatureCardColor,
                  tag: "Audit On-Chain",
                };
                const indexStr = `C${String(idx + 1).padStart(2, "0")}`;

                return (
                  <Link
                    key={c.id}
                    to="/bedah/$caseId"
                    params={{ caseId: c.id }}
                    className="block focus:outline-none focus-visible:ring-3 focus-visible:ring-candy-500 rounded-[28px]"
                  >
                    <AnimatedFeatureCard
                      index={indexStr}
                      tag={assetConfig.tag}
                      title={c.title}
                      blurb={c.blurb}
                      imageSrc={assetConfig.image}
                      color={assetConfig.color}
                      badge={
                        isDone ? (
                          <span className="inline-flex items-center gap-1 text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border-2 border-emerald-600 shadow-[0_1px_0_#15803D]">
                            <Check className="size-3 text-emerald-700" /> Selesai
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border-2 border-choco-900 shadow-[0_1px_0_#3B2218]">
                            Kasus Nyata
                          </span>
                        )
                      }
                      footer={
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-pixel text-[10px] sm:text-xs font-bold text-choco-600 flex items-center gap-1.5">
                            <span>{c.minutes}m</span>
                            <span>•</span>
                            <span className="text-amber-600">+{c.xp} XP</span>
                          </span>
                          <span
                            className={cn(
                              "inline-flex items-center justify-center font-pixel font-bold text-[10px] sm:text-xs px-3 py-1 rounded-full border-2 border-choco-900 transition-all",
                              isDone
                                ? "bg-white text-choco-900 shadow-[0_2px_0_#3B2218] hover:bg-cream"
                                : "bg-candy-500 text-white shadow-[0_2px_0_#3B2218] hover:bg-candy-600"
                            )}
                          >
                            {isDone ? "Tinjau" : "Bedah"}
                          </span>
                        </div>
                      }
                    />
                  </Link>
                );
              })}
            </div>

            {/* Locked Cases Section */}
            {lockedCases.length > 0 && (
              <div className="pt-4 space-y-4">
                <div className="flex items-center gap-2 text-choco-600">
                  <Lock className="size-4 text-choco-700" />
                  <span className="font-pixel text-xs sm:text-sm font-bold uppercase tracking-wider">
                    Kasus Terkunci
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {lockedCases.map((c, idx) => {
                    const assetConfig = CASE_ASSETS[c.id] ?? {
                      image: "/proof/warn-phishing.jpg",
                      color: "rose" as FeatureCardColor,
                      tag: "Audit On-Chain",
                    };
                    const indexStr = `C${String(openCases.length + idx + 1).padStart(2, "0")}`;

                    return (
                      <AnimatedFeatureCard
                        key={c.id}
                        index={indexStr}
                        tag="Terkunci"
                        title={c.title}
                        blurb={c.blurb}
                        imageSrc={assetConfig.image}
                        color={assetConfig.color}
                        isLocked={true}
                        badge={
                          <span className="inline-flex items-center gap-1 text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded-full bg-choco-100 text-choco-700 border-2 border-choco-900/30">
                            <Lock className="size-3" /> Modul ke-{c.unlockAfter}
                          </span>
                        }
                        footer={
                          <div className="flex items-center justify-between text-[11px] font-sans text-choco-600">
                            <span>Selesaikan materi prasyarat untuk membuka kasus ini</span>
                          </div>
                        }
                      />
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </AppShell>
  );
}
