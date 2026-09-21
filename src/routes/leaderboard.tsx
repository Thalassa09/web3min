import { useEffect, useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import {
  INITIAL_ACTIVITIES,
  INITIAL_RAFFLES,
  type ActivityEntry,
  type RaffleItem,
} from "@/lib/raffles";
import { playBuy, playComplete, playDeny, playTap } from "@/lib/audio";
import { useProgress } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/leaderboard")({ component: RafflePage });

type FilterTab = "all" | "live" | "ended" | "mine";

function formatCountdown(targetMs: number, nowMs: number) {
  const diff = targetMs - nowMs;
  if (diff <= 0) return "SEALED / BERAKHIR";
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const secs = Math.floor((diff % (1000 * 60)) / 1000);
  if (hours >= 24) {
    const days = Math.floor(hours / 24);
    const remHours = hours % 24;
    return `${days}D ${remHours.toString().padStart(2, "0")}H ${mins.toString().padStart(2, "0")}M ${secs.toString().padStart(2, "0")}S`;
  }
  return `${hours.toString().padStart(2, "0")}H ${mins.toString().padStart(2, "0")}M ${secs.toString().padStart(2, "0")}S`;
}

function RafflePage() {
  const username = useProgress((s) => s.username);
  const raffleTickets = useProgress((s) => s.raffleTickets ?? 0);
  const gems = useProgress((s) => s.gems);
  const enteredRaffles = useProgress((s) => s.enteredRaffles ?? {});
  const enterRaffle = useProgress((s) => s.enterRaffle);
  const buyRaffleTicketsWithGems = useProgress((s) => s.buyRaffleTicketsWithGems);

  const [filter, setFilter] = useState<FilterTab>("all");
  const [activeModalRaffle, setActiveModalRaffle] = useState<RaffleItem | null>(null);
  const [activeVrfRaffle, setActiveVrfRaffle] = useState<RaffleItem | null>(null);
  const [ticketInput, setTicketInput] = useState<number>(1);
  const [now, setNow] = useState(Date.now());
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Featured spotlight pool (100 USDT pool is the flagship)
  const [featuredId, setFeaturedId] = useState<string>("raffle-usdt-100");
  const [featuredStakeCount, setFeaturedStakeCount] = useState<number>(1);

  // Live timer tick
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  const raffles = useMemo(() => INITIAL_RAFFLES, []);
  const featuredRaffle = useMemo(
    () => raffles.find((r) => r.id === featuredId) || raffles[0],
    [raffles, featuredId],
  );

  const otherRaffles = useMemo(
    () => raffles.filter((r) => r.id !== featuredRaffle.id),
    [raffles, featuredRaffle.id],
  );

  const filteredCatalog = useMemo(() => {
    if (filter === "live") return otherRaffles.filter((r) => r.status === "live");
    if (filter === "ended") return otherRaffles.filter((r) => r.status === "ended");
    if (filter === "mine") return otherRaffles.filter((r) => (enteredRaffles[r.id]?.count ?? 0) > 0);
    return otherRaffles;
  }, [otherRaffles, filter, enteredRaffles]);

  const totalUserEntered = Object.values(enteredRaffles).reduce(
    (acc, curr) => acc + (curr?.count ?? 0),
    0,
  );

  function triggerToast(msg: string) {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3200);
  }

  function handleBuyTicket(qty = 1) {
    const cost = qty * 10;
    if (gems < cost) {
      playDeny();
      triggerToast(`Bintang tidak cukup! Butuh ${cost} bintang untuk ${qty} tiket.`);
      return;
    }
    if (buyRaffleTicketsWithGems(qty)) {
      playBuy();
      triggerToast(`Sukses menukar ${cost} Bintang menjadi ${qty} Tiket Raffle!`);
    }
  }

  function handleStakeToFeatured() {
    if (featuredStakeCount <= 0 || featuredStakeCount > raffleTickets) {
      playDeny();
      triggerToast("Jumlah tiket tidak valid atau saldo tiketmu tidak mencukupi.");
      return;
    }
    if (enterRaffle(featuredRaffle.id, featuredStakeCount)) {
      playComplete();
      triggerToast(`Berhasil menyetorkan ${featuredStakeCount} tiket ke ${featuredRaffle.title}!`);
      setFeaturedStakeCount(1);
    } else {
      playDeny();
    }
  }

  function handleOpenModal(raffle: RaffleItem) {
    playTap();
    setActiveModalRaffle(raffle);
    setTicketInput(1);
  }

  function handleConfirmEntry() {
    if (!activeModalRaffle) return;
    if (ticketInput <= 0 || ticketInput > raffleTickets) {
      playDeny();
      triggerToast("Jumlah tiket tidak valid atau tiketmu tidak mencukupi.");
      return;
    }
    if (enterRaffle(activeModalRaffle.id, ticketInput)) {
      playComplete();
      triggerToast(`Berhasil memasukkan ${ticketInput} tiket ke "${activeModalRaffle.title}"!`);
      setActiveModalRaffle(null);
    } else {
      playDeny();
    }
  }

  // Odds calculation for featured pool
  const featuredUserEntries = enteredRaffles[featuredRaffle.id]?.count ?? 0;
  const featuredPoolTotal = featuredRaffle.totalEntries + featuredUserEntries;
  const featuredFutureTotal = featuredPoolTotal + featuredStakeCount;
  const featuredLiveOdds = featuredFutureTotal > 0
    ? (((featuredUserEntries + featuredStakeCount) / featuredFutureTotal) * 100).toFixed(1)
    : "0.0";

  return (
    <AppShell>
      <div className="raffle-terminal min-h-dvh bg-[#07080c] text-[#f4f4f6] px-3.5 py-5 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Toast Notification */}
        {toastMessage && (
          <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 rounded-sm bg-[#00f59b] text-[#070709] px-4 py-2 font-mono text-xs font-black uppercase tracking-wider shadow-[0_0_24px_rgba(0,245,155,0.4)]">
            [ OK ] {toastMessage}
          </div>
        )}

        {/* Top Telemetry & Activity Bar */}
        <header className="border-b border-white/[0.08] pb-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 font-mono text-xs font-bold text-[#00f59b]">
              <span className="relative flex size-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00f59b] opacity-75" />
                <span className="relative inline-flex rounded-full size-2.5 bg-[#00f59b]" />
              </span>
              <span className="tracking-wider">[ PROTOCOL // PROVABLY-FAIR DRAW ]</span>
              <span className="text-[#555566] hidden sm:inline">•</span>
              <span className="text-[#888899] text-[11px] hidden sm:inline">ZERO-LOSS REWARD ENGINE</span>
            </div>

            {/* Quick Balances */}
            <div className="flex items-center gap-2 font-mono text-xs">
              <div className="rounded-sm border border-white/[0.08] bg-[#10121a] px-3 py-1.5 flex items-center gap-1.5">
                <span className="text-[#888899]">TIKET:</span>
                <span className="font-black text-[#00f59b]">{raffleTickets}</span>
              </div>
              <div className="rounded-sm border border-white/[0.08] bg-[#10121a] px-3 py-1.5 flex items-center gap-1.5">
                <span className="text-[#888899]">BINTANG:</span>
                <span className="font-black text-[#ffb800]">{gems}</span>
              </div>
            </div>
          </div>

          {/* Activity Marquee Ticker */}
          <div className="mt-4 flex items-center gap-3 overflow-hidden rounded-sm border border-white/[0.06] bg-[#0b0d13] px-3 py-2">
            <span className="font-mono text-[10px] font-black uppercase tracking-wider text-[#00f59b] whitespace-nowrap z-10 bg-[#0b0d13] pr-2 flex items-center gap-1.5 select-none">
              <span className="size-1.5 rounded-full bg-[#00f59b] animate-pulse" />
              // VERIFIED TAPE
            </span>
            <div className="overflow-hidden flex-1 select-none">
              <div className="ticker-track flex items-center gap-8 text-[11px] font-mono text-[#88889a]">
                {[...INITIAL_ACTIVITIES, ...INITIAL_ACTIVITIES].map((act, idx) => (
                  <div key={`${act.id}-${idx}`} className="flex items-center gap-1.5 whitespace-nowrap">
                    <span className={act.type === "win" ? "text-[#ffb800] font-bold" : "text-[#00f59b]"}>
                      {act.type === "win" ? "★" : "+"}
                    </span>
                    <span className="font-semibold text-white">@{act.username}</span>
                    <span>{act.action}</span>
                    <span className="text-[#f4f4f5]">"{act.raffleTitle}"</span>
                    <span className="text-[9px] text-[#555566]">[{act.timeAgo}]</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </header>

        {/* ══════════════════════════════════════════════════════════════════════
            DYNAMIC SYMMETRY STAGE: HERO SPOTLIGHT (62%) + COMMAND TOWER (38%)
            ══════════════════════════════════════════════════════════════════════ */}
        <section className="mt-6 grid gap-6 lg:grid-cols-12 items-start">
          {/* Main Hero Spotlight (Column Span 7 or 8 = Golden Ratio ~62%) */}
          <div className="lg:col-span-8">
            <div className="squircle-outer">
              <div className="squircle-inner p-5 sm:p-7">
                {/* Header Tagline & Badges */}
                <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-[11px]">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 rounded-xs border border-[#00f59b]/40 bg-[#00f59b]/10 px-2 py-0.5 font-black uppercase text-[#00f59b]">
                      <span className="size-1.5 rounded-full bg-[#00f59b] animate-pulse" />
                      FEATURED ARENA
                    </span>
                    <span className="border border-white/[0.08] px-2 py-0.5 rounded-xs text-[#888899]">
                      {featuredRaffle.network}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      playTap();
                      setActiveVrfRaffle(featuredRaffle);
                    }}
                    className="inline-flex items-center gap-1 text-[10px] text-[#888899] hover:text-[#00f59b] transition-colors cursor-pointer"
                  >
                    <span>VRF PROOF:</span>
                    <span className="font-bold underline">{featuredRaffle.vrfSeed.slice(0, 12)}...</span>
                  </button>
                </div>

                {/* Title & Host */}
                <div className="mt-4">
                  <span className="font-mono text-xs font-semibold text-[#88889a] uppercase tracking-wider">
                    HOSTED BY // {featuredRaffle.host}
                  </span>
                  <h1 className="mt-1 font-display text-2xl sm:text-3xl lg:text-4xl font-extrabold uppercase tracking-tight text-white">
                    {featuredRaffle.title}
                  </h1>
                  <p className="mt-2 text-sm text-[#9494a8] leading-relaxed max-w-xl">
                    {featuredRaffle.prizeDetail} Tiket diperoleh cuma-cuma dari menyelesaikan materi edukasi Web3. Tanpa taruhan uang, tanpa deposit.
                  </p>
                </div>

                {/* Prize Banner Card */}
                <div className="mt-5 rounded-sm border border-[#ffb800]/30 bg-gradient-to-r from-[#ffb800]/10 via-[#ffb800]/5 to-transparent p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#ffb800]">
                      PRIZE ALLOCATION:
                    </span>
                    <div className="font-display text-2xl sm:text-3xl font-black text-white">
                      {featuredRaffle.prize}
                    </div>
                  </div>
                  <div className="text-right font-mono text-xs">
                    <span className="block text-[10px] text-[#888899] uppercase">COUNTDOWN STATUS</span>
                    <span className="font-black text-[#00f59b] text-base">
                      {formatCountdown(featuredRaffle.endsAt, now)}
                    </span>
                  </div>
                </div>

                {/* Telemetry Progress Bar */}
                <div className="mt-5 space-y-2 font-mono text-xs">
                  <div className="flex justify-between text-[#888899]">
                    <span>TOTAL TIKET TERKUMPUL:</span>
                    <span className="font-bold text-white">{featuredPoolTotal} Tiket</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-white/[0.05] overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#00f59b] to-[#00c2ff] rounded-full transition-all duration-500"
                      style={{
                        width: `${Math.min(100, Math.max(15, (featuredPoolTotal / Math.max(100, featuredPoolTotal * 1.5)) * 100))}%`,
                      }}
                    />
                  </div>
                </div>

                {/* Interactive Ticket Injector & Live Odds Meter */}
                <div className="mt-6 rounded-sm border border-white/[0.08] bg-[#0c0e15] p-4 sm:p-5">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/[0.06] pb-3">
                    <span className="font-mono text-xs font-black uppercase text-white tracking-wider">
                      // SETOR TIKET KE POOL
                    </span>
                    <div className="font-mono text-xs text-[#00f59b] font-bold">
                      TIKET ANDA DI POOL INI: {featuredUserEntries} TIKET
                    </div>
                  </div>

                  {/* Quantity selector & Quick buttons */}
                  <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          playTap();
                          setFeaturedStakeCount((c) => Math.max(1, c - 1));
                        }}
                        className="size-9 rounded-sm border border-white/[0.1] bg-[#161922] font-mono font-bold text-white hover:bg-[#202532] active:scale-95 transition-transform"
                      >
                        -
                      </button>
                      <span className="font-mono text-xl font-black text-white w-12 text-center">
                        {featuredStakeCount}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          playTap();
                          setFeaturedStakeCount((c) => Math.min(raffleTickets, c + 1));
                        }}
                        className="size-9 rounded-sm border border-white/[0.1] bg-[#161922] font-mono font-bold text-white hover:bg-[#202532] active:scale-95 transition-transform"
                      >
                        +
                      </button>
                    </div>

                    <div className="flex items-center gap-2 font-mono text-xs">
                      {[1, 2, 5].map((amt) => (
                        <button
                          key={amt}
                          type="button"
                          onClick={() => {
                            playTap();
                            setFeaturedStakeCount(Math.min(raffleTickets, amt));
                          }}
                          className="rounded-sm border border-white/[0.08] bg-[#14161f] px-2.5 py-1 text-[#888899] hover:text-white hover:border-white/20 active:scale-95 transition-all"
                        >
                          +{amt}
                        </button>
                      ))}
                      <button
                        type="button"
                        onClick={() => {
                          playTap();
                          setFeaturedStakeCount(Math.max(1, raffleTickets));
                        }}
                        className="rounded-sm border border-[#00f59b]/40 bg-[#00f59b]/10 px-3 py-1 font-bold text-[#00f59b] active:scale-95 transition-all"
                      >
                        MAX ({raffleTickets})
                      </button>
                    </div>
                  </div>

                  {/* Dynamic Odds Display */}
                  <div className="mt-4 flex items-center justify-between rounded-sm border border-white/[0.06] bg-[#07080d] p-3 font-mono text-xs">
                    <span className="text-[#888899]">ESTIMASI PELUANG MENANG:</span>
                    <div className="text-right">
                      <span className="font-mono text-base font-black text-[#00f59b]">
                        ~{featuredLiveOdds}%
                      </span>
                      <span className="text-[10px] text-[#666677] block">
                        ({featuredUserEntries + featuredStakeCount} / {featuredFutureTotal} total tiket)
                      </span>
                    </div>
                  </div>

                  {/* Primary Action Button */}
                  <div className="mt-4">
                    {raffleTickets >= featuredRaffle.ticketCost ? (
                      <button
                        type="button"
                        onClick={handleStakeToFeatured}
                        className="w-full rounded-sm border border-[#00f59b] bg-[#00f59b] hover:bg-[#00d888] active:scale-[0.98] py-3.5 font-mono text-xs font-black uppercase tracking-wider text-[#070709] transition-all cursor-pointer shadow-[0_0_20px_rgba(0,245,155,0.25)]"
                      >
                        [ KONFIRMASI SETOR {featuredStakeCount} TIKET ]
                      </button>
                    ) : (
                      <div className="flex flex-col sm:flex-row gap-2">
                        <button
                          type="button"
                          disabled
                          className="flex-1 rounded-sm border border-white/[0.08] bg-[#14161f] py-3 font-mono text-xs font-bold uppercase text-[#666677] cursor-not-allowed"
                        >
                          [ TIKET TIDAK MENCUKUPI ]
                        </button>
                        <button
                          type="button"
                          onClick={() => handleBuyTicket(1)}
                          className="rounded-sm border border-[#ffb800]/50 bg-[#ffb800]/10 hover:bg-[#ffb800]/20 px-4 py-3 font-mono text-xs font-black uppercase text-[#ffb800] active:scale-[0.98] transition-all cursor-pointer"
                        >
                          + TUKAR 10 BINTANG = 1 TIKET
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Side Command Tower (Column Span 4 or 5 = Root-2 / Golden Ratio ~38%) */}
          <div className="lg:col-span-4 space-y-5">
            {/* Card 1: Personal Ticket Vault */}
            <div className="squircle-outer">
              <div className="squircle-inner p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
                  <span className="font-mono text-xs font-black uppercase tracking-wider text-white">
                    // TIKET VAULT
                  </span>
                  <span className="font-mono text-[10px] text-[#00f59b] font-bold">[ ACTIVE ]</span>
                </div>

                <div className="flex items-center gap-4">
                  <div className="size-16 rounded-sm border border-[#00f59b]/40 bg-[#00f59b]/10 flex flex-col items-center justify-center">
                    <span className="font-mono text-2xl font-black text-[#00f59b]">{raffleTickets}</span>
                    <span className="font-mono text-[9px] uppercase tracking-wider text-[#888899]">TIKET</span>
                  </div>
                  <div>
                    <span className="font-mono text-xs text-[#888899]">SALDO BINTANG</span>
                    <div className="font-mono text-lg font-black text-[#ffb800]">{gems} ★</div>
                    <span className="text-[11px] text-[#666677]">10 Bintang = 1 Tiket Raffle</span>
                  </div>
                </div>

                {/* Instant Swap Quick Buttons */}
                <div className="pt-2 border-t border-white/[0.06] space-y-2">
                  <span className="font-mono text-[10px] uppercase tracking-wider text-[#888899] block">
                    TUKAR CEPAT:
                  </span>
                  <div className="grid grid-cols-3 gap-2 font-mono text-xs">
                    <button
                      type="button"
                      onClick={() => handleBuyTicket(1)}
                      className="rounded-sm border border-white/[0.08] bg-[#12141c] hover:bg-[#1a1e2a] py-2 font-bold text-white transition-colors"
                    >
                      +1 Tiket
                      <span className="block text-[9px] text-[#ffb800]">10 ★</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleBuyTicket(5)}
                      className="rounded-sm border border-white/[0.08] bg-[#12141c] hover:bg-[#1a1e2a] py-2 font-bold text-white transition-colors"
                    >
                      +5 Tiket
                      <span className="block text-[9px] text-[#ffb800]">50 ★</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleBuyTicket(10)}
                      className="rounded-sm border border-white/[0.08] bg-[#12141c] hover:bg-[#1a1e2a] py-2 font-bold text-white transition-colors"
                    >
                      +10 Tiket
                      <span className="block text-[9px] text-[#ffb800]">100 ★</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 2: Zero-Loss Protocol Principles */}
            <div className="squircle-outer">
              <div className="squircle-inner p-5 space-y-3 font-mono text-xs">
                <span className="text-xs font-black uppercase text-[#00f59b] tracking-wider block">
                  // ZERO-LOSS GUARANTEE
                </span>
                <p className="text-[#888899] leading-relaxed text-[11px]">
                  Web3min Raffle bukan judi kasino. Semua hadiah disponsori mitra ekosistem edukasi.
                </p>
                <div className="space-y-2 pt-2 border-t border-white/[0.06] text-[11px]">
                  <div className="flex items-start gap-2">
                    <span className="text-[#00f59b] font-bold">✓</span>
                    <span className="text-[#c0c0d0]">Gated by proof-of-learning (harus belajar materi).</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-[#00f59b] font-bold">✓</span>
                    <span className="text-[#c0c0d0]">VRF Hash acak deterministik tanpa manipulasi.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-[#00f59b] font-bold">✓</span>
                    <span className="text-[#c0c0d0]">Distribusi langsung ke wallet / username Anda.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════════════
            CATALOG SECTION: ASYMMETRIC FILTERED REWARD POOLS
            ══════════════════════════════════════════════════════════════════════ */}
        <section className="mt-12">
          {/* Header & Filter Nav */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/[0.08] pb-4">
            <div>
              <span className="font-mono text-xs font-black uppercase tracking-wider text-[#00f59b]">
                // REWARD CATALOG
              </span>
              <h2 className="mt-1 font-display text-xl sm:text-2xl font-bold uppercase text-white">
                POOL HADIAH LAINNYA
              </h2>
            </div>

            <div className="flex flex-wrap items-center gap-1.5 font-mono text-xs">
              {(
                [
                  { id: "all", label: "SEMUA POOL" },
                  { id: "live", label: "SEDANG BERJALAN" },
                  { id: "ended", label: "SELESAI" },
                  { id: "mine", label: `TIKET SAYA (${totalUserEntered})` },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => {
                    playTap();
                    setFilter(tab.id);
                  }}
                  className={cn(
                    "px-3 py-1.5 font-bold uppercase tracking-wider rounded-sm transition-all cursor-pointer",
                    filter === tab.id
                      ? "bg-[#00f59b] text-[#070709] shadow-[0_0_12px_rgba(0,245,155,0.3)]"
                      : "bg-[#11131a] text-[#888899] hover:text-white border border-white/[0.06]",
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Asymmetric Catalog List */}
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filteredCatalog.map((raffle, idx) => {
              const userEntry = enteredRaffles[raffle.id]?.count ?? 0;
              const isLive = raffle.status === "live";

              return (
                <article
                  key={raffle.id}
                  style={{ animationDelay: `${idx * 40}ms` }}
                  className="squircle-card p-5 flex flex-col justify-between"
                >
                  <div>
                    {/* Top Row Badges */}
                    <div className="flex items-center justify-between gap-2 font-mono text-[10px] font-black uppercase">
                      <span
                        className={cn(
                          "px-2 py-0.5 rounded-xs border",
                          isLive
                            ? "border-[#00f59b]/40 bg-[#00f59b]/10 text-[#00f59b]"
                            : "border-white/10 bg-white/[0.05] text-[#888899]",
                        )}
                      >
                        [ {raffle.status.toUpperCase()} ]
                      </span>
                      <span className="text-[#888899] border border-white/[0.06] px-2 py-0.5 rounded-xs">
                        {raffle.network}
                      </span>
                    </div>

                    {/* Title & Host */}
                    <div className="mt-3">
                      <span className="font-mono text-[11px] text-[#888899] font-bold">
                        HOST // {raffle.host}
                      </span>
                      <h3 className="mt-0.5 font-display text-lg font-bold text-white">
                        {raffle.title}
                      </h3>
                    </div>

                    {/* Prize Highlight Box */}
                    <div className="mt-3 rounded-sm border border-white/[0.08] bg-[#090b10] p-3 font-mono">
                      <span className="text-[10px] uppercase text-[#888899] block">HADIAH:</span>
                      <span className="text-sm font-black text-[#ffb800] block">{raffle.prize}</span>
                      <span className="text-[11px] text-[#9494a8] block mt-1 leading-relaxed">
                        {raffle.prizeDetail}
                      </span>
                    </div>

                    {/* Metrics */}
                    <div className="mt-4 grid grid-cols-2 gap-2 border-t border-white/[0.06] pt-3 font-mono text-xs">
                      <div>
                        <span className="block text-[10px] text-[#777788] uppercase">SISA WAKTU</span>
                        <span className="font-bold text-white">
                          {isLive ? formatCountdown(raffle.endsAt, now) : "SEALED"}
                        </span>
                      </div>
                      <div>
                        <span className="block text-[10px] text-[#777788] uppercase">TOTAL TIKET</span>
                        <span className="font-bold text-[#00f59b]">
                          {raffle.totalEntries + userEntry} Tiket
                        </span>
                      </div>
                    </div>

                    {/* Winner Banner if Ended */}
                    {raffle.winner && (
                      <div className="mt-3 rounded-sm border border-[#ffb800]/40 bg-[#ffb800]/10 p-2.5 font-mono text-xs text-[#ffb800]">
                        <span className="font-black">🏆 PEMENANG:</span> @{raffle.winner.username} (Tiket #{raffle.winner.ticketId})
                      </div>
                    )}
                  </div>

                  {/* Bottom Action Area */}
                  <div className="mt-5 border-t border-white/[0.06] pt-3">
                    {isLive ? (
                      <div className="space-y-2 font-mono">
                        {userEntry > 0 && (
                          <div className="flex justify-between text-[11px] text-[#00f59b]">
                            <span>TIKET ANDA:</span>
                            <span className="font-bold">{userEntry} Tiket Terdaftar</span>
                          </div>
                        )}
                        <button
                          type="button"
                          onClick={() => handleOpenModal(raffle)}
                          className="w-full rounded-sm border border-[#00f59b] bg-[#00f59b] hover:bg-[#00d888] active:scale-[0.98] py-2.5 font-mono text-xs font-black uppercase tracking-wider text-[#070709] transition-all cursor-pointer"
                        >
                          {userEntry > 0 ? "[ + TAMBAH TIKET ]" : `[ IKUTI (${raffle.ticketCost} TIKET) ]`}
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        disabled
                        className="w-full rounded-sm border border-white/[0.06] bg-[#12141a] py-2.5 font-mono text-xs font-bold uppercase text-[#666677] cursor-not-allowed"
                      >
                        [ SELESAI ]
                      </button>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        {/* Modal Entry Dialog */}
        {activeModalRaffle && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-xs p-4">
            <div className="w-full max-w-md squircle-outer modal-animated">
              <div className="squircle-inner p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
                  <span className="font-mono text-xs font-black text-[#00f59b] uppercase tracking-wider">
                    // ENTER REWARD POOL
                  </span>
                  <button
                    type="button"
                    onClick={() => setActiveModalRaffle(null)}
                    className="font-mono text-xs text-[#888899] hover:text-white"
                  >
                    [ X TUTUP ]
                  </button>
                </div>

                <div>
                  <h3 className="font-display text-lg font-bold text-white">
                    {activeModalRaffle.title}
                  </h3>
                  <p className="mt-1 font-mono text-xs text-[#ffb800]">
                    HADIAH: {activeModalRaffle.prize}
                  </p>
                </div>

                <div className="rounded-sm border border-white/[0.08] bg-[#07080d] p-3 font-mono text-xs text-[#9494a8] space-y-1">
                  <p>
                    <span className="text-[#666677]">Tiket Tersedia:</span>{" "}
                    <span className="font-bold text-[#00f59b]">{raffleTickets} Tiket</span>
                  </p>
                  <p>
                    <span className="text-[#666677]">Biaya Minimal:</span>{" "}
                    <span className="font-bold text-white">{activeModalRaffle.ticketCost} Tiket</span>
                  </p>
                </div>

                {/* Input quantity */}
                <div className="font-mono text-xs space-y-2">
                  <span className="text-[#888899] uppercase block">JUMLAH TIKET YANG DISETORKAN:</span>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setTicketInput((p) => Math.max(1, p - 1))}
                      className="size-9 rounded-sm border border-white/[0.1] bg-[#161922] font-bold text-white hover:bg-[#202532]"
                    >
                      -
                    </button>
                    <span className="font-mono text-xl font-black text-white w-12 text-center">
                      {ticketInput}
                    </span>
                    <button
                      type="button"
                      onClick={() => setTicketInput((p) => Math.min(raffleTickets, p + 1))}
                      className="size-9 rounded-sm border border-white/[0.1] bg-[#161922] font-bold text-white hover:bg-[#202532]"
                    >
                      +
                    </button>
                    <button
                      type="button"
                      onClick={() => setTicketInput(Math.max(1, raffleTickets))}
                      className="ml-auto rounded-sm border border-white/[0.08] bg-[#14161f] px-3 py-1 text-[#888899] hover:text-white"
                    >
                      MAX ({raffleTickets})
                    </button>
                  </div>

                  {/* Estimated odds */}
                  <div className="mt-3 flex items-center justify-between rounded-sm border border-white/[0.06] bg-[#07080d] p-2.5 font-mono text-xs">
                    <span className="text-[#888899]">ESTIMASI PELUANG:</span>
                    <span className="font-bold text-[#00f59b]">
                      ~{(((enteredRaffles[activeModalRaffle.id]?.count ?? 0) + ticketInput) / Math.max(1, activeModalRaffle.totalEntries + (enteredRaffles[activeModalRaffle.id]?.count ?? 0) + ticketInput) * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>

                {raffleTickets < activeModalRaffle.ticketCost ? (
                  <div className="rounded-sm border border-[#f43f5e]/30 bg-[#f43f5e]/10 p-3 font-mono text-xs text-[#f43f5e]">
                    ⚠️ Tiketmu tidak cukup. Selesaikan pelajaran baru atau tukar 10 Bintang untuk 1 tiket.
                  </div>
                ) : null}

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setActiveModalRaffle(null)}
                    className="flex-1 rounded-sm border border-white/[0.08] bg-[#14161f] py-2.5 font-mono text-xs font-bold uppercase text-[#888899]"
                  >
                    BATAL
                  </button>
                  <button
                    type="button"
                    disabled={raffleTickets < activeModalRaffle.ticketCost}
                    onClick={handleConfirmEntry}
                    className="flex-1 rounded-sm border border-[#00f59b] bg-[#00f59b] py-2.5 font-mono text-xs font-black uppercase text-[#070709] hover:bg-[#00d888] disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    KONFIRMASI ({ticketInput} TIKET)
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VRF Transparency Proof Modal */}
        {activeVrfRaffle && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-xs p-4">
            <div className="w-full max-w-lg squircle-outer modal-animated">
              <div className="squircle-inner p-6 space-y-4 font-mono text-xs">
                <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
                  <span className="font-black text-[#00f59b] uppercase tracking-wider flex items-center gap-2">
                    <span className="size-2 rounded-full bg-[#00f59b] animate-pulse" />
                    // CHAINLINK VRF V2.5 PROOF
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      playTap();
                      setActiveVrfRaffle(null);
                    }}
                    className="text-[#888899] hover:text-white"
                  >
                    [ X TUTUP ]
                  </button>
                </div>

                <div>
                  <span className="text-[#888899] uppercase text-[10px] block">POOL TARGET</span>
                  <p className="font-bold text-white text-sm">{activeVrfRaffle.title}</p>
                </div>

                <div className="rounded-sm border border-white/[0.08] bg-[#07080d] p-3 space-y-2">
                  <div>
                    <span className="text-[#666677] text-[10px] uppercase block">VRF SEED HASH (SHA-256)</span>
                    <p className="text-[#00f59b] break-all text-[11px]">{activeVrfRaffle.vrfSeed}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/[0.06]">
                    <div>
                      <span className="text-[#666677] text-[10px] uppercase block">NETWORK</span>
                      <p className="text-white font-bold">{activeVrfRaffle.network}</p>
                    </div>
                    <div>
                      <span className="text-[#666677] text-[10px] uppercase block">STATUS PROOF</span>
                      <p className="text-[#00f59b] font-bold">VERIFIED ONCHAIN</p>
                    </div>
                  </div>
                </div>

                <p className="text-[11px] text-[#9494a8] leading-relaxed">
                  Semua nomor pemenang diundi menggunakan nilai acak deterministik yang dibuktikan secara kriptografi (Verifiable Random Function). Tidak ada admin yang bisa mengubah atau memilih tiket pemenang sebelum atau sesudah undian berakhir.
                </p>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      playTap();
                      setActiveVrfRaffle(null);
                    }}
                    className="w-full rounded-sm border border-[#00f59b] bg-[#00f59b] py-2.5 font-mono text-xs font-black uppercase text-[#070709] hover:bg-[#00d888]"
                  >
                    [ MENGERTI // TUTUP ]
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
