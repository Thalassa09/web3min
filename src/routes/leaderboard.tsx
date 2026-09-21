import { useEffect, useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import {
  INITIAL_ACTIVITIES,
  INITIAL_RAFFLES,
  type RaffleItem,
} from "@/lib/raffles";
import { playBuy, playComplete, playDeny, playTap } from "@/lib/audio";
import { useProgress } from "@/lib/store";
import { cn } from "@/lib/utils";
import { SurfaceCard } from "@/components/ui/surface-card";
import { TactileButton } from "@/components/ui/tactile-button";
import { Ticket, Sparkles, Trophy, ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/leaderboard")({ component: RafflePage });

type FilterTab = "all" | "live" | "ended" | "mine";

function formatCountdown(targetMs: number, nowMs: number) {
  const diff = targetMs - nowMs;
  if (diff <= 0) return "SELESAI";
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const secs = Math.floor((diff % (1000 * 60)) / 1000);
  if (hours >= 24) {
    const days = Math.floor(hours / 24);
    const remHours = hours % 24;
    return `${days}h ${remHours}j ${mins}m`;
  }
  return `${hours}j ${mins}m ${secs}d`;
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

  const [featuredId] = useState<string>("raffle-usdt-100");
  const [featuredStakeCount, setFeaturedStakeCount] = useState<number>(1);

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
      triggerToast(`Sukses menukar ${cost} Bintang menjadi ${qty} Tiket Undian!`);
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
      triggerToast("Jumlah tiket tidak valid atau saldo tiketmu kurang.");
      return;
    }
    if (enterRaffle(activeModalRaffle.id, ticketInput)) {
      playComplete();
      triggerToast(`Berhasil memasang ${ticketInput} tiket ke ${activeModalRaffle.title}!`);
      setActiveModalRaffle(null);
    } else {
      playDeny();
    }
  }

  const featuredUserEntries = enteredRaffles[featuredRaffle.id]?.count ?? 0;
  const featuredPoolTotal = featuredRaffle.totalEntries + featuredUserEntries;
  const featuredFutureTotal = featuredPoolTotal + featuredStakeCount;
  const featuredLiveOdds = (
    ((featuredUserEntries + featuredStakeCount) / Math.max(1, featuredFutureTotal)) *
    100
  ).toFixed(1);

  return (
    <AppShell>
      <div className="max-w-6xl mx-auto px-3 py-4 sm:px-4 sm:py-6 space-y-6">
        {/* Flash Toast */}
        {toastMessage && (
          <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 rounded-[18px] bg-[#E8FBF0] border-2 border-[#98E4B5] text-[#1E8A49] px-6 py-3 text-sm font-extrabold shadow-[0_6px_0_#98E4B5] animate-in fade-in slide-in-from-top-4">
            {toastMessage}
          </div>
        )}

        {/* Top Telemetry & Activity Bar */}
        <SurfaceCard className="p-4 sm:p-5 bg-white space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 text-xs font-extrabold text-[#0B63F6]">
              <span className="relative flex size-2.5">
                <span className="animate-ping absolute inline-flex size-full rounded-full bg-[#0B63F6] opacity-75" />
                <span className="relative inline-flex rounded-full size-2.5 bg-[#0B63F6]" />
              </span>
              <span className="text-sm font-display font-bold text-[#0D2340]">Arena Undian Hadiah Web3</span>
              <span className="text-[#9DB4CE] hidden sm:inline">•</span>
              <span className="text-[#5A7796] text-xs font-medium hidden sm:inline">Terverifikasi On-chain via Chainlink VRF</span>
            </div>

            {/* Quick Balances */}
            <div className="flex items-center gap-2 text-xs">
              <div className="rounded-[14px] border-2 border-[#8FC2FF] bg-[#E4F0FF] px-3.5 py-1.5 flex items-center gap-1.5 font-bold shadow-sm">
                <span className="text-[#5A7796]">Tiket:</span>
                <span className="font-extrabold text-[#0B4FD1]">{raffleTickets}</span>
              </div>
              <div className="rounded-[14px] border-2 border-[#FFD84D] bg-[#FFF7D1] px-3.5 py-1.5 flex items-center gap-1.5 font-bold shadow-sm">
                <span className="text-[#B27B00]">Bintang:</span>
                <span className="font-extrabold text-[#B27B00]">{gems} ★</span>
              </div>
            </div>
          </div>

          {/* Activity Marquee Ticker */}
          <div className="flex items-center gap-3 overflow-hidden rounded-[16px] border-2 border-[#DCE7F5] bg-[#F7FAFC] px-3.5 py-2">
            <span className="text-xs font-extrabold text-[#0B63F6] whitespace-nowrap z-10 pr-2 flex items-center gap-1.5 select-none shrink-0">
              <Sparkles className="size-3.5 text-[#FFC61A]" />
              Aktivitas Langsung
            </span>
            <div className="overflow-hidden flex-1 select-none">
              <div className="ticker-track flex items-center gap-8 text-xs font-medium text-[#5A7796]">
                {[...INITIAL_ACTIVITIES, ...INITIAL_ACTIVITIES].map((act, idx) => (
                  <div key={`${act.id}-${idx}`} className="flex items-center gap-1.5 whitespace-nowrap">
                    <span className={act.type === "win" ? "text-[#FFC61A] font-black" : "text-[#0B63F6]"}>
                      {act.type === "win" ? "★" : "+"}
                    </span>
                    <span className="font-bold text-[#0D2340]">@{act.username}</span>
                    <span>{act.action}</span>
                    <span className="text-[#0D2340] font-semibold">"{act.raffleTitle}"</span>
                    <span className="text-[11px] text-[#9DB4CE]">({act.timeAgo})</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </SurfaceCard>

        {/* Featured Arena Spotlight Card + Side Vault */}
        <div className="grid gap-6 lg:grid-cols-12 items-start">
          {/* Main Hero Spotlight (8 cols) */}
          <div className="lg:col-span-8">
            <SurfaceCard className="p-6 sm:p-7 bg-white border-2 border-[#8FC2FF] space-y-5">
              {/* Header Badges */}
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-[#FFD84D] bg-[#FFF7D1] px-3 py-1 text-[11px] font-extrabold text-[#B27B00]">
                    <span className="size-2 rounded-full bg-[#FFC61A]" />
                    FEATURED ARENA
                  </span>
                  <span className="border-2 border-[#DCE7F5] bg-[#F7FAFC] px-2.5 py-0.5 rounded-full text-xs font-bold text-[#5A7796]">
                    {featuredRaffle.network}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    playTap();
                    setActiveVrfRaffle(featuredRaffle);
                  }}
                  className="inline-flex items-center gap-1 text-xs font-extrabold text-[#0B63F6] hover:underline cursor-pointer"
                >
                  <ShieldCheck className="size-3.5" />
                  <span>VRF PROOF:</span>
                  <span className="font-mono">{featuredRaffle.vrfSeed.slice(0, 8)}...</span>
                </button>
              </div>

              {/* Title & Host */}
              <div>
                <span className="text-xs font-bold text-[#5A7796]">
                  Disponsori oleh {featuredRaffle.host}
                </span>
                <h1 className="mt-1 font-display text-2xl sm:text-3xl font-bold text-[#0D2340]">
                  {featuredRaffle.title}
                </h1>
                <p className="mt-2 text-xs sm:text-sm font-medium text-[#5A7796] leading-relaxed">
                  {featuredRaffle.prizeDetail} Tiket diperoleh cuma-cuma dari menyelesaikan materi edukasi Web3. Tanpa taruhan uang, tanpa deposit.
                </p>
              </div>

              {/* Blue Contrast Ticket Banner with side notches */}
              <div className="rounded-[20px] bg-gradient-to-r from-[#0B4FD1] to-[#0B63F6] p-5 sm:p-6 text-white shadow-[0_6px_0_#07358F] relative overflow-hidden">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#8FC2FF] block">
                      TOTAL HADIAH:
                    </span>
                    <div className="font-display text-2xl sm:text-4xl font-black text-[#FFC61A] drop-shadow-sm">
                      {featuredRaffle.prize}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="block text-[11px] text-[#8FC2FF] font-extrabold uppercase">STATUS WAKTU</span>
                    <span className="font-display font-bold text-white text-lg sm:text-xl">
                      {formatCountdown(featuredRaffle.endsAt, now)}
                    </span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-white/20 flex justify-between text-xs font-bold text-white/90">
                  <span>Tiket Terkumpul di Pool:</span>
                  <span className="font-mono font-black text-[#FFC61A]">{featuredPoolTotal} Tiket</span>
                </div>
              </div>

              {/* Interactive Ticket Injector */}
              <div className="rounded-[20px] border-2 border-[#DCE7F5] bg-[#F7FAFC] p-4 sm:p-5 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b-2 border-[#DCE7F5] pb-3">
                  <span className="text-xs font-extrabold uppercase text-[#0D2340] tracking-wide">
                    Pasang Tiket Undian
                  </span>
                  <div className="text-xs font-bold text-[#0B63F6]">
                    Tiket kamu di pool ini: <strong className="font-black">{featuredUserEntries} tiket</strong>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        playTap();
                        setFeaturedStakeCount((c) => Math.max(1, c - 1));
                      }}
                      className="size-10 rounded-[12px] border-2 border-[#DCE7F5] bg-white font-extrabold text-base text-[#0D2340] hover:bg-[#F0F6FF] shadow-[0_2px_0_#C8DBF0] active:translate-y-[1px] active:shadow-none transition-all cursor-pointer"
                    >
                      -
                    </button>
                    <span className="font-display text-xl font-bold text-[#0D2340] w-12 text-center">
                      {featuredStakeCount}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        playTap();
                        setFeaturedStakeCount((c) => Math.min(raffleTickets, c + 1));
                      }}
                      className="size-10 rounded-[12px] border-2 border-[#DCE7F5] bg-white font-extrabold text-base text-[#0D2340] hover:bg-[#F0F6FF] shadow-[0_2px_0_#C8DBF0] active:translate-y-[1px] active:shadow-none transition-all cursor-pointer"
                    >
                      +
                    </button>
                  </div>

                  <div className="flex items-center gap-2 text-xs font-bold">
                    {[1, 2, 5].map((amt) => (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => {
                          playTap();
                          setFeaturedStakeCount(Math.min(raffleTickets, amt));
                        }}
                        className="rounded-[10px] border-2 border-[#DCE7F5] bg-white px-3 py-1.5 text-[#5A7796] hover:text-[#0D2340] hover:border-[#8FC2FF] shadow-[0_2px_0_#C8DBF0] active:translate-y-[1px] active:shadow-none transition-all cursor-pointer"
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
                      className="rounded-[10px] border-2 border-[#8FC2FF] bg-[#E4F0FF] px-3.5 py-1.5 font-extrabold text-[#0B63F6] shadow-[0_2px_0_#C2DBFA] active:translate-y-[1px] active:shadow-none transition-all cursor-pointer"
                    >
                      MAX ({raffleTickets})
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between rounded-[14px] bg-white border-2 border-[#DCE7F5] p-3 text-xs">
                  <span className="font-bold text-[#5A7796]">ESTIMASI PELUANG MENANG:</span>
                  <div className="text-right">
                    <span className="font-display font-bold text-base text-[#0B63F6]">
                      ~{featuredLiveOdds}%
                    </span>
                    <span className="text-[11px] font-medium text-[#9DB4CE] block">
                      ({featuredUserEntries + featuredStakeCount} dari {featuredFutureTotal} total tiket)
                    </span>
                  </div>
                </div>

                {raffleTickets >= featuredRaffle.ticketCost ? (
                  <TactileButton
                    variant="primary"
                    size="lg"
                    fullWidth
                    onClick={handleStakeToFeatured}
                  >
                    Setor {featuredStakeCount} Tiket ke Pool
                  </TactileButton>
                ) : (
                  <div className="flex flex-col sm:flex-row gap-2">
                    <button
                      type="button"
                      disabled
                      className="flex-1 rounded-[16px] border-2 border-[#DCE7F5] bg-[#E4F0FF] py-3 text-xs font-bold text-[#5A7796] opacity-60 cursor-not-allowed"
                    >
                      Tiket Tidak Mencukupi
                    </button>
                    <TactileButton
                      variant="primary"
                      size="md"
                      onClick={() => handleBuyTicket(1)}
                    >
                      + Tukar 10 Bintang = 1 Tiket
                    </TactileButton>
                  </div>
                )}
              </div>
            </SurfaceCard>
          </div>

          {/* Side Command Tower (4 cols) */}
          <div className="lg:col-span-4 space-y-5">
            {/* Ticket Vault Card */}
            <SurfaceCard className="p-5 bg-white space-y-4">
              <div className="flex items-center justify-between border-b-2 border-[#F0F6FF] pb-3">
                <span className="text-xs font-extrabold uppercase tracking-wide text-[#0D2340]">
                  Dompet Tiket Kamu
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-[#E8FBF0] text-[#1E8A49] border border-[#98E4B5]">
                  Aktif
                </span>
              </div>

              <div className="flex items-center gap-4">
                <div className="size-16 rounded-[18px] border-2 border-[#8FC2FF] bg-[#E4F0FF] shadow-[0_3px_0_#C2DBFA] flex flex-col items-center justify-center shrink-0">
                  <span className="font-display text-2xl font-bold text-[#0B63F6]">{raffleTickets}</span>
                  <span className="text-[9px] font-extrabold uppercase text-[#5A7796]">TIKET</span>
                </div>
                <div>
                  <span className="text-xs font-bold text-[#5A7796]">SALDO BINTANG</span>
                  <div className="font-display text-lg font-bold text-[#B27B00]">{gems} ★</div>
                  <span className="text-[11px] font-medium text-[#9DB4CE]">10 Bintang = 1 Tiket</span>
                </div>
              </div>

              {/* Instant Quick Swap */}
              <div className="pt-2 border-t-2 border-[#F0F6FF] space-y-2">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#5A7796] block">
                  TUKAR CEPAT:
                </span>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => handleBuyTicket(1)}
                    className="rounded-[12px] border-2 border-[#DCE7F5] bg-white hover:bg-[#F0F6FF] py-2 text-xs font-bold text-[#0D2340] shadow-[0_2px_0_#C8DBF0] active:translate-y-[1px] active:shadow-none transition-all cursor-pointer"
                  >
                    +1 Tiket
                    <span className="block text-[10px] font-extrabold text-[#B27B00]">10 ★</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleBuyTicket(5)}
                    className="rounded-[12px] border-2 border-[#DCE7F5] bg-white hover:bg-[#F0F6FF] py-2 text-xs font-bold text-[#0D2340] shadow-[0_2px_0_#C8DBF0] active:translate-y-[1px] active:shadow-none transition-all cursor-pointer"
                  >
                    +5 Tiket
                    <span className="block text-[10px] font-extrabold text-[#B27B00]">50 ★</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleBuyTicket(10)}
                    className="rounded-[12px] border-2 border-[#DCE7F5] bg-white hover:bg-[#F0F6FF] py-2 text-xs font-bold text-[#0D2340] shadow-[0_2px_0_#C8DBF0] active:translate-y-[1px] active:shadow-none transition-all cursor-pointer"
                  >
                    +10 Tiket
                    <span className="block text-[10px] font-extrabold text-[#B27B00]">100 ★</span>
                  </button>
                </div>
              </div>
            </SurfaceCard>

            {/* Zero-loss principles Card */}
            <SurfaceCard className="p-5 bg-white space-y-3">
              <span className="text-xs font-extrabold uppercase text-[#0B63F6] tracking-wider block">
                Prinsip Edukasi & Hadiah
              </span>
              <p className="text-xs font-medium text-[#5A7796] leading-relaxed">
                Web3min Undian bukan judi. Semua hadiah disponsori mitra ekosistem edukasi tanpa taruhan uang.
              </p>
              <div className="space-y-2 pt-2 border-t-2 border-[#F0F6FF] text-xs font-medium text-[#0D2340]">
                <div className="flex items-start gap-2">
                  <span className="text-[#1E8A49] font-black">✓</span>
                  <span>Gated by proof-of-learning (harus belajar materi).</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-[#1E8A49] font-black">✓</span>
                  <span>VRF Hash acak deterministik tanpa manipulasi.</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-[#1E8A49] font-black">✓</span>
                  <span>Distribusi langsung ke wallet / username pemenang.</span>
                </div>
              </div>
            </SurfaceCard>
          </div>
        </div>

        {/* Other Pools Catalog */}
        <section className="space-y-4 pt-4">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b-2 border-white/20 pb-4">
            <div>
              <h2 className="font-display text-xl sm:text-2xl font-bold text-white drop-shadow-sm">
                Daftar Undian Lainnya
              </h2>
            </div>

            <div className="flex flex-wrap items-center gap-1.5 text-xs">
              {(
                [
                  { id: "all", label: "Semua Pool" },
                  { id: "live", label: "Sedang Berjalan" },
                  { id: "ended", label: "Selesai" },
                  { id: "mine", label: `Tiket Saya (${totalUserEntered})` },
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
                    "px-3.5 py-1.5 font-extrabold rounded-full transition-all cursor-pointer",
                    filter === tab.id
                      ? "bg-white text-[#0B63F6] shadow-[0_3px_0_#C8DBF0]"
                      : "bg-white/20 text-white hover:bg-white/30",
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Catalog Grid */}
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filteredCatalog.map((raffle) => {
              const userEntry = enteredRaffles[raffle.id]?.count ?? 0;
              const isLive = raffle.status === "live";

              return (
                <SurfaceCard
                  key={raffle.id}
                  className="p-5 bg-white flex flex-col justify-between hover:border-[#8FC2FF] transition-all"
                >
                  <div>
                    {/* Top Row Badges */}
                    <div className="flex items-center justify-between gap-2 text-[10px] font-extrabold uppercase">
                      <span
                        className={cn(
                          "px-2.5 py-0.5 rounded-full border",
                          isLive
                            ? "border-[#98E4B5] bg-[#E8FBF0] text-[#1E8A49]"
                            : "border-[#DCE7F5] bg-[#F7FAFC] text-[#5A7796]",
                        )}
                      >
                        {raffle.status.toUpperCase()}
                      </span>
                      <span className="text-[#5A7796] border-2 border-[#DCE7F5] bg-[#F7FAFC] px-2 py-0.5 rounded-full">
                        {raffle.network}
                      </span>
                    </div>

                    {/* Title & Host */}
                    <div className="mt-3">
                      <span className="text-[11px] font-medium text-[#5A7796]">
                        Oleh {raffle.host}
                      </span>
                      <h3 className="mt-0.5 font-display text-lg font-bold text-[#0D2340]">
                        {raffle.title}
                      </h3>
                    </div>

                    {/* Prize Highlight Box */}
                    <div className="mt-3 rounded-[16px] border-2 border-[#FFD84D] bg-[#FFF7D1] p-3">
                      <span className="text-[10px] font-extrabold uppercase text-[#B27B00] block">HADIAH:</span>
                      <span className="text-base font-display font-bold text-[#0D2340] block">{raffle.prize}</span>
                      <span className="text-xs font-medium text-[#5A7796] block mt-1 leading-relaxed">
                        {raffle.prizeDetail}
                      </span>
                    </div>

                    {/* Metrics */}
                    <div className="mt-4 grid grid-cols-2 gap-2 border-t-2 border-[#F0F6FF] pt-3 text-xs">
                      <div>
                        <span className="block text-[10px] font-bold text-[#9DB4CE] uppercase">SISA WAKTU</span>
                        <span className="font-bold text-[#0D2340]">
                          {isLive ? formatCountdown(raffle.endsAt, now) : "SELESAI"}
                        </span>
                      </div>
                      <div>
                        <span className="block text-[10px] font-bold text-[#9DB4CE] uppercase">TOTAL TIKET</span>
                        <span className="font-extrabold text-[#0B63F6]">
                          {raffle.totalEntries + userEntry} Tiket
                        </span>
                      </div>
                    </div>

                    {/* Winner Banner if Ended */}
                    {raffle.winner && (
                      <div className="mt-3 rounded-[14px] border-2 border-[#FFD84D] bg-[#FFF7D1] p-2.5 text-xs text-[#B27B00] font-bold">
                        <span>🏆 PEMENANG:</span> @{raffle.winner.username} (Tiket #{raffle.winner.ticketId})
                      </div>
                    )}
                  </div>

                  {/* Bottom Action Area */}
                  <div className="mt-5 border-t-2 border-[#F0F6FF] pt-3">
                    {isLive ? (
                      <div className="space-y-2">
                        {userEntry > 0 && (
                          <div className="flex justify-between text-xs font-extrabold text-[#1E8A49]">
                            <span>TIKET ANDA:</span>
                            <span>{userEntry} Tiket Terdaftar</span>
                          </div>
                        )}
                        <TactileButton
                          variant="primary"
                          size="md"
                          fullWidth
                          onClick={() => handleOpenModal(raffle)}
                        >
                          {userEntry > 0 ? "+ Tambah Tiket" : `Ikuti (${raffle.ticketCost} Tiket)`}
                        </TactileButton>
                      </div>
                    ) : (
                      <button
                        type="button"
                        disabled
                        className="w-full rounded-[14px] border-2 border-[#DCE7F5] bg-[#F7FAFC] py-2.5 text-xs font-bold text-[#9DB4CE] cursor-not-allowed"
                      >
                        Selesai
                      </button>
                    )}
                  </div>
                </SurfaceCard>
              );
            })}
          </div>
        </section>

        {/* Modal Entry Dialog */}
        {activeModalRaffle && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
            <div className="w-full max-w-md rounded-[26px] bg-white border-4 border-[#0D2340] shadow-[0_10px_0_#0B4FD1] p-6 space-y-4">
              <div className="flex items-center justify-between border-b-2 border-[#DCE7F5] pb-3">
                <span className="text-xs font-extrabold text-[#0B63F6] uppercase tracking-wider">
                  Ikuti Undian Hadiah
                </span>
                <button
                  type="button"
                  onClick={() => setActiveModalRaffle(null)}
                  className="text-xs font-bold text-[#5A7796] hover:text-[#0D2340] cursor-pointer"
                >
                  ✕ Tutup
                </button>
              </div>

              <div>
                <h3 className="font-display text-xl font-bold text-[#0D2340]">
                  {activeModalRaffle.title}
                </h3>
                <p className="mt-1 text-xs font-extrabold text-[#B27B00]">
                  HADIAH: {activeModalRaffle.prize}
                </p>
              </div>

              <div className="rounded-[16px] border-2 border-[#8FC2FF] bg-[#E4F0FF] p-3 text-xs text-[#0D2340] space-y-1">
                <p>
                  <span className="text-[#5A7796]">Tiket Tersedia:</span>{" "}
                  <span className="font-extrabold text-[#0B63F6]">{raffleTickets} Tiket</span>
                </p>
                <p>
                  <span className="text-[#5A7796]">Biaya Minimal:</span>{" "}
                  <span className="font-extrabold">{activeModalRaffle.ticketCost} Tiket</span>
                </p>
              </div>

              {/* Input quantity */}
              <div className="text-xs space-y-2">
                <span className="font-extrabold uppercase text-[#5A7796] block">JUMLAH TIKET YANG DISETORKAN:</span>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setTicketInput((p) => Math.max(1, p - 1))}
                    className="size-10 rounded-[12px] border-2 border-[#DCE7F5] bg-white font-extrabold text-base text-[#0D2340] hover:bg-[#F0F6FF] shadow-[0_2px_0_#C8DBF0] active:translate-y-[1px] active:shadow-none transition-all cursor-pointer"
                  >
                    -
                  </button>
                  <span className="font-display text-xl font-bold text-[#0D2340] w-12 text-center">
                    {ticketInput}
                  </span>
                  <button
                    type="button"
                    onClick={() => setTicketInput((p) => Math.min(raffleTickets, p + 1))}
                    className="size-10 rounded-[12px] border-2 border-[#DCE7F5] bg-white font-extrabold text-base text-[#0D2340] hover:bg-[#F0F6FF] shadow-[0_2px_0_#C8DBF0] active:translate-y-[1px] active:shadow-none transition-all cursor-pointer"
                  >
                    +
                  </button>
                  <button
                    type="button"
                    onClick={() => setTicketInput(Math.max(1, raffleTickets))}
                    className="ml-auto rounded-[10px] border-2 border-[#8FC2FF] bg-[#E4F0FF] px-3.5 py-1.5 font-extrabold text-[#0B63F6] cursor-pointer"
                  >
                    MAX ({raffleTickets})
                  </button>
                </div>

                {/* Estimated odds */}
                <div className="mt-3 flex items-center justify-between rounded-[14px] border-2 border-[#DCE7F5] bg-[#F7FAFC] p-3 text-xs">
                  <span className="font-bold text-[#5A7796]">ESTIMASI PELUANG:</span>
                  <span className="font-display font-bold text-sm text-[#0B63F6]">
                    ~{(((enteredRaffles[activeModalRaffle.id]?.count ?? 0) + ticketInput) / Math.max(1, activeModalRaffle.totalEntries + (enteredRaffles[activeModalRaffle.id]?.count ?? 0) + ticketInput) * 100).toFixed(1)}%
                  </span>
                </div>
              </div>

              {raffleTickets < activeModalRaffle.ticketCost ? (
                <div className="rounded-[14px] border-2 border-[#F4A4A0] bg-[#FFF5F5] p-3 text-xs font-bold text-[#B01E18]">
                  ⚠️ Tiketmu tidak cukup. Selesaikan pelajaran baru atau tukar 10 Bintang untuk 1 tiket.
                </div>
              ) : null}

              <div className="flex gap-3 pt-2">
                <TactileButton
                  variant="secondary"
                  size="md"
                  fullWidth
                  onClick={() => setActiveModalRaffle(null)}
                >
                  Batal
                </TactileButton>
                <TactileButton
                  variant="primary"
                  size="md"
                  fullWidth
                  disabled={raffleTickets < activeModalRaffle.ticketCost}
                  onClick={handleConfirmEntry}
                >
                  Konfirmasi ({ticketInput} Tiket)
                </TactileButton>
              </div>
            </div>
          </div>
        )}

        {/* VRF Transparency Proof Modal */}
        {activeVrfRaffle && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
            <div className="w-full max-w-lg rounded-[26px] bg-white border-4 border-[#0D2340] shadow-[0_10px_0_#0B4FD1] p-6 space-y-4 text-xs">
              <div className="flex items-center justify-between border-b-2 border-[#DCE7F5] pb-3">
                <span className="font-display font-bold text-[#0B63F6] uppercase tracking-wide flex items-center gap-2 text-sm">
                  <ShieldCheck className="size-4 text-[#0B63F6]" />
                  Bukti Keacakan Chainlink VRF V2.5
                </span>
                <button
                  type="button"
                  onClick={() => {
                    playTap();
                    setActiveVrfRaffle(null);
                  }}
                  className="text-xs font-bold text-[#5A7796] hover:text-[#0D2340] cursor-pointer"
                >
                  ✕ Tutup
                </button>
              </div>

              <div>
                <span className="text-[#5A7796] uppercase text-[10px] font-extrabold block">POOL TARGET</span>
                <p className="font-display font-bold text-[#0D2340] text-base">{activeVrfRaffle.title}</p>
              </div>

              <div className="rounded-[16px] border-2 border-[#DCE7F5] bg-[#F7FAFC] p-3 space-y-2">
                <div>
                  <span className="text-[#5A7796] text-[10px] font-extrabold uppercase block">VRF SEED HASH (SHA-256)</span>
                  <p className="text-[#0B63F6] font-mono break-all text-[11px] font-bold">{activeVrfRaffle.vrfSeed}</p>
                </div>
                <div className="grid grid-cols-2 gap-2 pt-2 border-t-2 border-[#DCE7F5]">
                  <div>
                    <span className="text-[#5A7796] text-[10px] font-extrabold uppercase block">NETWORK</span>
                    <p className="text-[#0D2340] font-bold">{activeVrfRaffle.network}</p>
                  </div>
                  <div>
                    <span className="text-[#5A7796] text-[10px] font-extrabold uppercase block">STATUS PROOF</span>
                    <p className="text-[#1E8A49] font-extrabold">VERIFIED ONCHAIN</p>
                  </div>
                </div>
              </div>

              <p className="text-xs font-medium text-[#5A7796] leading-relaxed">
                Semua nomor pemenang diundi menggunakan nilai acak deterministik yang dibuktikan secara kriptografi (Verifiable Random Function). Tidak ada admin yang bisa mengubah atau memilih tiket pemenang sebelum atau sesudah undian berakhir.
              </p>

              <div className="pt-2">
                <TactileButton
                  variant="primary"
                  size="md"
                  fullWidth
                  onClick={() => {
                    playTap();
                    setActiveVrfRaffle(null);
                  }}
                >
                  Saya Mengerti & Tutup
                </TactileButton>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
