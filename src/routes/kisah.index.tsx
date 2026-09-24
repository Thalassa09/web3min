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
  "s-peta": { image: "/stories/s-peta.jpg", color: "blue", tag: "Ekosistem Web3" },
  "s-defi": { image: "/stories/s-defi.jpg", color: "emerald", tag: "Aave Lending" },
  "s-kerja": { image: "/stories/s-kerja.jpg", color: "purple", tag: "Gitcoin DAO" },
  "s-eth": { image: "/stories/s-eth.jpg", color: "blue", tag: "The Merge ETH" },
  "s-liq": { image: "/stories/s-liq.jpg", color: "orange", tag: "Risiko Likuidasi" },
  "s-flash": { image: "/stories/s-flash.jpg", color: "emerald", tag: "Flash Loan Arbitrage" },
  "s-oracle": { image: "/stories/s-oracle.jpg", color: "purple", tag: "Mango Oracle Attack" },
  "s-arb": { image: "/stories/s-arb.jpg", color: "orange", tag: "MEV Sandwich" },
  "s-poison": { image: "/stories/s-poison.jpg", color: "rose", tag: "Address Poisoning" },
  "s-permit": { image: "/stories/s-permit.jpg", color: "rose", tag: "Permit Signature" },
  "s-il": { image: "/stories/s-il.jpg", color: "emerald", tag: "Impermanent Loss" },
  "s-dm": { image: "/stories/s-dm.jpg", color: "rose", tag: "Never DM First" },
  "s-seed": { image: "/stories/s-seed.jpg", color: "rose", tag: "Seed Phrase Rules" },
  "s-airdrop": { image: "/stories/s-airdrop.jpg", color: "blue", tag: "Fake Airdrop Site" },
  "s-drop-cuan": { image: "/stories/s-drop-cuan.jpg", color: "emerald", tag: "Klaim 400 UNI" },
  "s-copy": { image: "/stories/s-copy.jpg", color: "rose", tag: "Phishing Clone URL" },
  "s-honey": { image: "/stories/s-honey.jpg", color: "rose", tag: "Honeypot +605%" },
  "s-cs": { image: "/stories/s-cs.jpg", color: "rose", tag: "Admin Palsu Telegram" },
  "s-izin": { image: "/stories/s-izin.jpg", color: "rose", tag: "Bahaya Eth_Sign" },
  "s-cukup": { image: "/stories/s-cukup.jpg", color: "purple", tag: "Pnut $2.4B Bleed" },
};

const CASE_ASSETS: Record<string, { image: string; color: FeatureCardColor; tag: string }> = {
  "b-seed": { image: "/cases/b-seed.jpg", color: "rose", tag: "MetaMask 12 Kata" },
  "b-dm": { image: "/cases/b-dm.jpg", color: "purple", tag: "Never DM First" },
  "b-phish": { image: "/cases/b-phish.jpg", color: "rose", tag: "CoinEx Shutdown Phish" },
  "b-honey": { image: "/cases/b-honey.jpg", color: "orange", tag: "Honeypot +605%" },
  "b-drain": { image: "/cases/b-drain.jpg", color: "rose", tag: "Vendoir Permit Drainer" },
  "b-sim": { image: "/cases/b-sim.jpg", color: "rose", tag: "Fake Tx Simulation" },
  "b-cuan": { image: "/cases/b-cuan.jpg", color: "emerald", tag: "Bevan Rp20 Miliar" },
  "b-drop": { image: "/cases/b-drop.jpg", color: "blue", tag: "Arbitrum Foundation" },
  "b-rugi": { image: "/cases/b-rugi.jpg", color: "rose", tag: "Hyperliquid −$30M" },
  "b-zach": { image: "/cases/b-zach.jpg", color: "rose", tag: "ZachXBT $1.2M Trezor" },
  "b-paper": { image: "/cases/b-paper.jpg", color: "orange", tag: "Paper Green ≠ Closed" },
  "b-revoke": { image: "/cases/b-revoke.jpg", color: "purple", tag: "Revoke.cash Approvals" },
  "b-coinex": { image: "/cases/b-coinex.jpg", color: "rose", tag: "CoinEx Security Alert" },
  "b-dict": { image: "/cases/b-dict.jpg", color: "rose", tag: "Milk Sad CVE-2023-39910" },
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

              <h2 className="font-display font-extrabold text-xl sm:text-3xl text-choco-900 tracking-tight leading-snug">
                {featured.title}
              </h2>
              <p className="font-sans text-xs sm:text-sm text-choco-700 line-clamp-2 leading-relaxed">
                {featured.blurb}
              </p>

              <div className="flex flex-wrap items-center gap-2 pt-2">
                <Link
                  to="/kisah/$storyId"
                  params={{ storyId: featured.id }}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl border-2 border-choco-900 bg-candy-500 hover:bg-candy-600 text-white font-pixel font-bold text-xs sm:text-sm shadow-[0_4px_0_#3B2218] active:translate-y-0.5 transition-all"
                >
                  <span>Mulai Sekarang</span>
                  <ArrowRight className="size-4" />
                </Link>
                <div className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-choco-900/15 bg-white/70 font-pixel text-xs text-choco-800">
                  +{featured.xp} XP
                </div>
              </div>
            </div>

            {/* Featured Evidence Graphic */}
            <div className="relative shrink-0 w-full md:w-72 h-44 rounded-2xl border-3 border-choco-900 bg-white shadow-[0_6px_0_#3B2218] overflow-hidden flex items-center justify-center">
              <img
                src={STORY_ASSETS[featured.id]?.image || "/props/star.png"}
                alt={featured.title}
                className="w-full h-full object-cover object-center filter brightness-[0.98] transition-transform hover:scale-105 duration-300"
              />
              <div className="absolute top-2.5 right-2.5 px-2.5 py-1 rounded-lg bg-choco-900/90 text-white font-pixel text-[10px] font-bold shadow-md">
                BUKTI UTAMA
              </div>
            </div>
          </div>
        )}

        {/* Tab 1: Cerita Interaktif */}
        {tab === "cerita" && (
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-pixel font-bold text-lg sm:text-xl text-choco-900">
                Semua Cerita Interaktif
              </h2>
              <span className="font-sans text-xs text-choco-600">
                {openStories.length} tersedia · {doneStories.length} selesai
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {openStories.map((s, idx) => {
                const isDone = doneStories.includes(s.id);
                const asset = STORY_ASSETS[s.id] ?? {
                  image: "/stories/s-peta.jpg",
                  color: "orange" as FeatureCardColor,
                  tag: "Cerita Web3",
                };
                const indexStr = String(idx + 1).padStart(3, "0");

                return (
                  <Link
                    key={s.id}
                    to="/kisah/$storyId"
                    params={{ storyId: s.id }}
                    className="block group cursor-pointer focus:outline-none"
                  >
                    <AnimatedFeatureCard
                      index={indexStr}
                      tag={asset.tag}
                      title={s.title}
                      blurb={s.blurb}
                      imageSrc={asset.image}
                      imageAlt={s.title}
                      color={asset.color}
                      badge={
                        isDone ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-emerald-100 text-emerald-800 border-2 border-emerald-700 font-pixel text-[10px] font-bold shadow-xs">
                            <Check className="size-3 stroke-[3]" />
                            <span>Selesai</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-100 text-amber-900 border-2 border-amber-600 font-pixel text-[10px] font-bold shadow-xs">
                            <span>+{s.xp} XP</span>
                          </span>
                        )
                      }
                      footer={
                        <div className="flex items-center justify-between">
                          <span className="font-sans text-[11px] font-semibold text-choco-600">
                            ⏱ {s.minutes} Menit Baca
                          </span>
                          <span className="inline-flex items-center gap-1 font-pixel text-xs font-bold text-candy-600 group-hover:translate-x-1 transition-transform">
                            {isDone ? "Baca Ulang" : "Mulai"}
                            <ArrowRight className="size-3.5" />
                          </span>
                        </div>
                      }
                    />
                  </Link>
                );
              })}

              {/* Locked Stories */}
              {lockedStories.map((s, idx) => {
                const asset = STORY_ASSETS[s.id] ?? {
                  image: "/stories/s-peta.jpg",
                  color: "orange" as FeatureCardColor,
                  tag: "Terkunci",
                };
                const indexStr = String(openStories.length + idx + 1).padStart(3, "0");

                return (
                  <div key={s.id} className="relative">
                    <AnimatedFeatureCard
                      index={indexStr}
                      tag="Terkunci"
                      title={s.title}
                      blurb={s.blurb}
                      imageSrc={asset.image}
                      imageAlt={s.title}
                      color="rose"
                      isLocked
                      badge={
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-choco-100 text-choco-800 border-2 border-choco-400 font-pixel text-[10px] font-bold">
                          <Lock className="size-3 stroke-[2.5]" />
                          <span>Kunci</span>
                        </span>
                      }
                      footer={
                        <div className="flex items-center justify-between">
                          <span className="font-sans text-[11px] font-medium text-choco-500">
                            Selesaikan modul sebelumnya
                          </span>
                          <Lock className="size-3.5 text-choco-400" />
                        </div>
                      }
                    />
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Tab 2: Kasus On-Chain */}
        {tab === "kasus" && (
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-pixel font-bold text-lg sm:text-xl text-choco-900">
                Arsip Kasus & Eksploit On-Chain
              </h2>
              <span className="font-sans text-xs text-choco-600">
                {openCases.length} kasus siap dibedah
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {openCases.map((c, idx) => {
                const isDone = doneCases.includes(c.id);
                const asset = CASE_ASSETS[c.id] ?? {
                  image: "/cases/b-drop.jpg",
                  color: "rose" as FeatureCardColor,
                  tag: "Kasus On-Chain",
                };
                const indexStr = `C${String(idx + 1).padStart(2, "0")}`;

                return (
                  <Link
                    key={c.id}
                    to="/bedah/$caseId"
                    params={{ caseId: c.id }}
                    className="block group cursor-pointer focus:outline-none"
                  >
                    <AnimatedFeatureCard
                      index={indexStr}
                      tag={asset.tag}
                      title={c.title}
                      blurb={c.blurb}
                      imageSrc={asset.image}
                      imageAlt={c.title}
                      color={asset.color}
                      badge={
                        isDone ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-emerald-100 text-emerald-800 border-2 border-emerald-700 font-pixel text-[10px] font-bold shadow-xs">
                            <Check className="size-3 stroke-[3]" />
                            <span>Terbukti</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-rose-100 text-rose-800 border-2 border-rose-600 font-pixel text-[10px] font-bold shadow-xs">
                            <span>Kasus Nyata</span>
                          </span>
                        )
                      }
                      footer={
                        <div className="flex items-center justify-between">
                          <span className="font-sans text-[11px] font-semibold text-choco-600">
                            ⏱ {c.minutes} Menit Audit
                          </span>
                          <span className="inline-flex items-center gap-1 font-pixel text-xs font-bold text-candy-600 group-hover:translate-x-1 transition-transform">
                            <span>Bedah Bukti</span>
                            <ArrowRight className="size-3.5" />
                          </span>
                        </div>
                      }
                    />
                  </Link>
                );
              })}

              {/* Locked Cases */}
              {lockedCases.map((c, idx) => {
                const asset = CASE_ASSETS[c.id] ?? {
                  image: "/cases/b-drop.jpg",
                  color: "rose" as FeatureCardColor,
                  tag: "Kasus Terkunci",
                };
                const indexStr = `C${String(openCases.length + idx + 1).padStart(2, "0")}`;

                return (
                  <div key={c.id} className="relative">
                    <AnimatedFeatureCard
                      index={indexStr}
                      tag="Terkunci"
                      title={c.title}
                      blurb={c.blurb}
                      imageSrc={asset.image}
                      imageAlt={c.title}
                      color="rose"
                      isLocked
                      badge={
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-choco-100 text-choco-800 border-2 border-choco-400 font-pixel text-[10px] font-bold">
                          <Lock className="size-3 stroke-[2.5]" />
                          <span>Kunci</span>
                        </span>
                      }
                      footer={
                        <div className="flex items-center justify-between">
                          <span className="font-sans text-[11px] font-medium text-choco-500">
                            Selesaikan kasus sebelumnya
                          </span>
                          <Lock className="size-3.5 text-choco-400" />
                        </div>
                      }
                    />
                  </div>
                );
              })}
            </div>
          </section>
        )}
      </main>
    </AppShell>
  );
}
