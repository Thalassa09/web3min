import { useState, useMemo } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Ticket,
  Coins,
  Sparkles,
  Trophy,
  ShieldCheck,
  Clock,
  Flame,
  ArrowRight,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Info,
  Layers,
  Plus,
  Minus,
  Crown,
  History,
  Check,
  Zap,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { DuoButton } from "@/components/duo-button";
import { Mascot } from "@/components/mascot";
import { useProgress } from "@/lib/store";
import { playComplete, playMoodSfx } from "@/lib/audio";
import { cn } from "@/lib/utils";
import {
  INITIAL_RAFFLES,
  RAFFLE_TICKET_PRICE,
  MOCK_ACTIVITY,
  type RaffleItem,
} from "@/lib/raffles";

export const Route = createFileRoute("/raffle")({
  component: RaffleNftPage,
});

export function RaffleNftPage() {
  const [activeTab, setActiveTab] = useState<"active" | "winners" | "my-tickets">("active");
  const [selectedRaffle, setSelectedRaffle] = useState<RaffleItem | null>(null);
  const [entryCount, setEntryCount] = useState<number>(1);
  const [showBuyTicketsModal, setShowBuyTicketsModal] = useState<boolean>(false);
  const [buyTicketsQty, setBuyTicketsQty] = useState<number>(5);
  const [showVrfModal, setShowVrfModal] = useState<RaffleItem | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const username = useProgress((s) => s.username);
  const gems = useProgress((s) => s.gems);
  const raffleTickets = useProgress((s) => s.raffleTickets);
  const enteredRaffles = useProgress((s) => s.enteredRaffles);
  const buyRaffleTicketsWithGems = useProgress((s) => s.buyRaffleTicketsWithGems);
  const enterRaffle = useProgress((s) => s.enterRaffle);
  const sound = useProgress((s) => s.sound);

  const activeRaffles = useMemo(() => INITIAL_RAFFLES.filter((r) => r.status === "live"), []);
  const endedRaffles = useMemo(() => INITIAL_RAFFLES.filter((r) => r.status === "ended"), []);

  const totalMyTicketsPlaced = useMemo(() => {
    return Object.values(enteredRaffles || {}).reduce((acc, cur) => acc + (cur?.count || 0), 0);
  }, [enteredRaffles]);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 5000);
  };

  // Buy tickets using coins action
  const handleBuyTickets = (qty: number) => {
    const cost = qty * RAFFLE_TICKET_PRICE;
    if (gems < cost) {
      triggerToast(`Saldo Koin tidak cukup! Butuh ${cost} Koin, saldomu ${gems} Koin.`);
      return;
    }
    const success = buyRaffleTicketsWithGems(qty);
    if (success) {
      if (sound) playMoodSfx("celebrate");
      triggerToast(`Berhasil membeli ${qty} Tiket Raffle seharga ${cost} Koin! 🎟️`);
      setShowBuyTicketsModal(false);
    }
  };

  // Enter tickets into a specific raffle
  const handleEnterRaffleSubmit = () => {
    if (!selectedRaffle) return;
    const userAvailableTickets = raffleTickets;

    // If user has enough tickets, deposit them
    if (userAvailableTickets >= entryCount) {
      const ok = enterRaffle(selectedRaffle.id, entryCount);
      if (ok) {
        if (sound) playMoodSfx("celebrate");
        triggerToast(`Berhasil memasukkan ${entryCount} tiket ke ${selectedRaffle.title}! 🎉`);
        setSelectedRaffle(null);
      }
    } else {
      // User doesn't have enough tickets, offer auto-buy with coins
      const neededTickets = entryCount - userAvailableTickets;
      const coinCost = neededTickets * RAFFLE_TICKET_PRICE;
      if (gems < coinCost) {
        triggerToast(`Tiket & Koinmu tidak cukup. Butuh ${coinCost} Koin tambahan untuk membeli tiket.`);
        return;
      }
      // Buy missing tickets then enter
      const bought = buyRaffleTicketsWithGems(neededTickets);
      if (bought) {
        const ok = enterRaffle(selectedRaffle.id, entryCount);
        if (ok) {
          if (sound) playMoodSfx("celebrate");
          triggerToast(`Berhasil menukar ${coinCost} Koin & memasukkan ${entryCount} tiket! 🎉`);
          setSelectedRaffle(null);
        }
      }
    }
  };

  return (
    <AppShell>
      <main className="mx-auto max-w-4xl px-3 sm:px-6 py-4 sm:py-6 pb-28">
        {/* Toast Notification */}
        {toastMessage && (
          <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 max-w-md w-[92%] bg-candy-500 text-white border-2 border-ink-900 rounded-2xl p-4 shadow-[4px_4px_0_#2B1622] flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-300">
            <Sparkles className="size-6 shrink-0 text-amber-300 animate-spin" />
            <div className="text-xs sm:text-sm font-black flex-1 leading-snug">{toastMessage}</div>
            <button
              type="button"
              onClick={() => setToastMessage(null)}
              className="text-white/80 hover:text-white font-mono text-sm px-1"
            >
              ✕
            </button>
          </div>
        )}

        {/* 1. Header Card with Title & Balances HUD */}
        <div className="rounded-[24px] border-2 border-ink-900 bg-white shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_4px_0_var(--color-ink-900)] p-4 sm:p-6 mb-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b-2 border-sand-200 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-candy-500 text-white font-mono font-black text-[11px] tracking-wide border border-ink-900 shadow-xs">
                  FITUR RESMI
                </span>
                <span className="text-xs font-mono font-bold text-ink-400">PROVABLY FAIR ON-CHAIN</span>
              </div>
              <h1 className="font-display font-black text-2xl sm:text-3xl text-ink-900 mt-1 flex items-center gap-2.5">
                Raffle NFT Web3min <Ticket className="size-7 text-candy-deep shrink-0 rotate-12" />
              </h1>
              <p className="text-xs sm:text-sm text-ink-600 font-medium mt-1">
                Gunakan Koin dari hasil belajar & klasemen mingguan untuk membeli tiket undian NFT langka eksklusif!
              </p>
            </div>

            {/* Currency & Ticket HUD */}
            <div className="flex flex-wrap items-center gap-2.5 self-start md:self-auto bg-sand-100 border-2 border-ink-900 rounded-2xl p-2.5 shadow-[2px_2px_0_var(--color-ink-900)]">
              {/* Coin Balance */}
              <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-ink-900/20 shadow-xs">
                <Coins className="size-4 text-amber-500" />
                <div className="text-left">
                  <div className="text-[9px] font-mono font-bold text-ink-400 leading-none">SALDO KOIN</div>
                  <div className="text-xs sm:text-sm font-mono font-black text-ink-900 leading-tight">
                    {gems.toLocaleString("id-ID")}
                  </div>
                </div>
              </div>

              {/* Tickets Balance */}
              <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-ink-900/20 shadow-xs">
                <Ticket className="size-4 text-candy-deep" />
                <div className="text-left">
                  <div className="text-[9px] font-mono font-bold text-ink-400 leading-none">TIKET KAMU</div>
                  <div className="text-xs sm:text-sm font-mono font-black text-candy-deep leading-tight">
                    {raffleTickets} Tiket
                  </div>
                </div>
              </div>

              {/* Quick Buy Button */}
              <button
                type="button"
                onClick={() => {
                  setBuyTicketsQty(5);
                  setShowBuyTicketsModal(true);
                }}
                className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-candy-500 border-2 border-ink-900 text-white font-display font-black text-xs shadow-[2px_2px_0_#2B1622] hover:bg-candy-600 active:translate-y-0.5 transition-all cursor-pointer"
              >
                <Plus className="size-3.5" />
                <span>Beli Tiket</span>
              </button>
            </div>
          </div>

          {/* Quick Explainer Bar: 10 Koin = 1 Tiket */}
          <div className="mt-4 bg-candy-50 border-2 border-candy-200 rounded-2xl p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs">
            <div className="flex items-center gap-2">
              <span className="size-6 rounded-full bg-candy-500 text-white flex items-center justify-center font-mono font-black text-[11px] shrink-0">
                i
              </span>
              <span className="text-ink-800 font-bold">
                Kurs Tiket: <strong>10 Koin 🪙 = 1 Tiket Undian 🎟️</strong>. Semakin banyak tiket yang kamu masukkan, semakin tinggi peluang menangmu!
              </span>
            </div>
            <Link to="/leaderboard" className="text-candy-deep font-black hover:underline shrink-0 flex items-center gap-1">
              <span>Kejar Koin di Klasemen</span>
              <ArrowRight className="size-3" />
            </Link>
          </div>
        </div>

        {/* 2. On-Chain Live Activity Marquee Ticker */}
        <div className="rounded-[18px] border-2 border-ink-900 bg-ink-900 text-white p-2.5 shadow-[2px_2px_0_#2B1622] mb-4 overflow-hidden">
          <div className="flex items-center gap-2 text-xs font-mono font-bold">
            <span className="shrink-0 px-2 py-0.5 rounded-full bg-candy-500 text-white text-[10px] flex items-center gap-1 font-black">
              <Zap className="size-3 fill-current" /> AKTIVITAS
            </span>
            <div className="flex-1 overflow-x-auto whitespace-nowrap no-scrollbar py-0.5 text-sand-300 text-[11px]">
              {MOCK_ACTIVITY.map((act, idx) => (
                <span key={act.id} className="inline-flex items-center gap-1.5 mr-6">
                  <span className="text-amber-300 font-bold">@{act.username}</span>
                  <span>{act.action}</span>
                  <span className="text-white font-bold underline">"{act.raffleTitle}"</span>
                  <span className="text-sand-400 text-[10px]">({act.timeAgo})</span>
                  {idx < MOCK_ACTIVITY.length - 1 && <span className="text-candy-line">✦</span>}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* 3. Navigation Tabs */}
        <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-1 no-scrollbar">
          <button
            type="button"
            onClick={() => setActiveTab("active")}
            className={cn(
              "px-4 py-2 rounded-full font-display font-black text-xs sm:text-sm border-2 transition-all flex items-center gap-1.5 cursor-pointer",
              activeTab === "active"
                ? "bg-candy-500 text-white border-ink-900 shadow-[2px_2px_0_#2B1622]"
                : "bg-white text-ink-700 border-ink-900/20 hover:bg-sand-100"
            )}
          >
            <Sparkles className="size-4" />
            <span>Undian NFT Aktif ({activeRaffles.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("winners")}
            className={cn(
              "px-4 py-2 rounded-full font-display font-black text-xs sm:text-sm border-2 transition-all flex items-center gap-1.5 cursor-pointer",
              activeTab === "winners"
                ? "bg-amber-400 text-ink-900 border-ink-900 shadow-[2px_2px_0_#2B1622]"
                : "bg-white text-ink-700 border-ink-900/20 hover:bg-sand-100"
            )}
          >
            <Trophy className="size-4" />
            <span>Pemenang Terverifikasi ({endedRaffles.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("my-tickets")}
            className={cn(
              "px-4 py-2 rounded-full font-display font-black text-xs sm:text-sm border-2 transition-all flex items-center gap-1.5 cursor-pointer",
              activeTab === "my-tickets"
                ? "bg-sky-500 text-white border-ink-900 shadow-[2px_2px_0_#2B1622]"
                : "bg-white text-ink-700 border-ink-900/20 hover:bg-sand-100"
            )}
          >
            <Ticket className="size-4" />
            <span>Tiket Saya ({totalMyTicketsPlaced})</span>
          </button>
        </div>

        {/* 4. ACTIVE RAFFLES TAB CONTENT */}
        {activeTab === "active" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeRaffles.map((raffle) => {
              const myCount = enteredRaffles?.[raffle.id]?.count || 0;
              const totalTickets = raffle.totalEntries + myCount;
              const winChance = totalTickets > 0 ? ((myCount / totalTickets) * 100).toFixed(1) : "0.0";
              const nft = raffle.nftDetails;

              return (
                <div
                  key={raffle.id}
                  className="rounded-[24px] border-2 border-ink-900 bg-white overflow-hidden shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_4px_0_var(--color-ink-900)] flex flex-col transition-all hover:-translate-y-0.5"
                >
                  {/* NFT Artwork Banner / Visual Card */}
                  <div
                    className="p-4 sm:p-5 relative border-b-2 border-ink-900 flex flex-col justify-between min-h-[170px]"
                    style={{
                      background: `linear-gradient(135deg, ${raffle.accentColor}25 0%, #FFF6EE 100%)`,
                    }}
                  >
                    {/* Top Badges */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5">
                        <span
                          className="px-2.5 py-0.5 rounded-full text-white font-mono font-black text-[10px] border border-ink-900 shadow-xs"
                          style={{ backgroundColor: raffle.accentColor }}
                        >
                          {raffle.badge}
                        </span>
                        {nft && (
                          <span className="px-2 py-0.5 rounded-full bg-white/90 border border-ink-900 font-mono font-bold text-[10px] text-ink-800">
                            {nft.chain.toUpperCase()}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white border border-ink-900 font-mono text-[10px] font-black text-ink-800 shadow-xs">
                        <Clock className="size-3 text-candy-deep" />
                        <span>Sisa 3 Hari</span>
                      </div>
                    </div>

                    {/* Center Artwork & Mascot Preview */}
                    <div className="my-2 flex items-center justify-between">
                      <div>
                        <div className="text-[10px] font-mono font-bold text-ink-400 uppercase tracking-wider">
                          {nft?.collection || "Web3min Artifacts"}
                        </div>
                        <h2 className="font-display font-black text-lg sm:text-xl text-ink-900 leading-tight">
                          {raffle.title}
                        </h2>
                      </div>

                      {/* Mascot Thumbnail */}
                      <div className="size-16 rounded-2xl border-2 border-ink-900 bg-white shadow-[2px_2px_0_#2B1622] flex items-center justify-center overflow-hidden shrink-0">
                        {nft?.artworkType === "pixel-mascot" ? (
                          <Mascot mood="wave" size={48} lite interactive={false} />
                        ) : nft?.artworkType === "cyber-pass" ? (
                          <div className="text-center font-mono font-black text-candy-deep text-xs p-1">
                            CYBER PASS
                          </div>
                        ) : nft?.artworkType === "sorcerer" ? (
                          <Mascot mood="proud" size={48} lite interactive={false} />
                        ) : (
                          <div className="text-center font-mono font-black text-amber-600 text-xs p-1">
                            GAS MASK
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Rarity & Standard Tag */}
                    <div className="flex items-center gap-2 text-[10px] font-mono font-black text-ink-600">
                      <span>Standard: {nft?.standard || "ERC-721"}</span>
                      <span>·</span>
                      <span>Token ID: {nft?.tokenId || "#001"}</span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-4 flex-1 flex flex-col justify-between gap-3">
                    <div>
                      <p className="text-xs text-ink-600 font-medium leading-relaxed">
                        {raffle.prizeDetail}
                      </p>

                      {/* NFT Perks Highlights */}
                      {nft && (
                        <div className="mt-2.5 space-y-1 bg-sand-50 border border-sand-200 rounded-xl p-2.5">
                          <div className="text-[10px] font-mono font-bold text-ink-400 uppercase">Perks & Hadiah:</div>
                          {nft.perks.slice(0, 2).map((perk, i) => (
                            <div key={i} className="text-xs font-bold text-ink-800 flex items-center gap-1.5">
                              <Check className="size-3 text-emerald-600 shrink-0" />
                              <span className="truncate">{perk}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Ticket Telemetry & Odds */}
                    <div className="bg-sand-100 rounded-2xl p-3 border border-ink-900/15">
                      <div className="flex items-center justify-between text-xs font-mono mb-1.5">
                        <span className="text-ink-500 font-bold">Total Tiket Masuk:</span>
                        <span className="font-black text-ink-900">{totalTickets} Tiket</span>
                      </div>
                      <div className="flex items-center justify-between text-xs font-mono">
                        <span className="text-candy-deep font-bold">Tiket Kamu:</span>
                        <span className="font-black text-candy-deep">
                          {myCount} Tiket ({winChance}% Peluang)
                        </span>
                      </div>
                    </div>

                    {/* Card Action Footer */}
                    <div className="pt-1 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setShowVrfModal(raffle)}
                        className="p-2.5 rounded-xl border-2 border-ink-900 bg-sand-100 hover:bg-sand-200 text-ink-800 shrink-0 shadow-[2px_2px_0_var(--color-ink-900)] cursor-pointer"
                        title="Verifikasi Kejujuran Undian (VRF)"
                      >
                        <ShieldCheck className="size-4 text-emerald-600" />
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setSelectedRaffle(raffle);
                          setEntryCount(1);
                        }}
                        className="flex-1 py-2.5 px-4 rounded-xl bg-candy-500 hover:bg-candy-600 border-2 border-ink-900 text-white font-display font-black text-xs shadow-[2px_2px_0_#2B1622] active:translate-y-0.5 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Ticket className="size-4" />
                        <span>Beli Tiket & Ikut Undian</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* 5. VERIFIED WINNERS TAB CONTENT */}
        {activeTab === "winners" && (
          <div className="space-y-3">
            <div className="p-4 rounded-2xl bg-amber-50 border-2 border-amber-300 text-xs text-ink-800">
              <div className="font-display font-black text-sm text-ink-900 flex items-center gap-2">
                <ShieldCheck className="size-4 text-emerald-600" />
                <span>Transparansi On-Chain Terverifikasi</span>
              </div>
              <p className="mt-1 font-medium leading-relaxed">
                Seluruh pemenang undian NFT diundi menggunakan benih keacakan Chainlink VRF / on-chain block hash yang dapat diverifikasi publik melalui block explorer.
              </p>
            </div>

            {endedRaffles.map((raf) => (
              <div
                key={raf.id}
                className="rounded-[22px] border-2 border-ink-900 bg-white p-4 sm:p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_3px_0_var(--color-ink-900)] flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3.5">
                  <div className="size-12 rounded-2xl bg-amber-100 border-2 border-amber-500 flex items-center justify-center shrink-0">
                    <Trophy className="size-6 text-amber-600" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500 text-white font-mono font-black text-[10px]">
                        SELESAI
                      </span>
                      <span className="text-xs font-mono font-bold text-ink-400">{raf.winner?.announcedAt}</span>
                    </div>
                    <h3 className="font-display font-black text-base text-ink-900 mt-0.5">{raf.title}</h3>
                    <p className="text-xs text-ink-500 font-medium">Hadiah: {raf.prize}</p>
                  </div>
                </div>

                <div className="bg-sand-50 border border-ink-900/15 rounded-xl p-3 text-right self-stretch sm:self-auto min-w-[200px]">
                  <div className="text-[10px] font-mono font-bold text-ink-400 uppercase">Pemenang Beruntung:</div>
                  <div className="font-display font-black text-sm text-candy-deep">@{raf.winner?.username}</div>
                  <div className="text-[11px] font-mono font-bold text-ink-600 mt-0.5">
                    Tiket: {raf.winner?.ticketId}
                  </div>
                  {raf.winner?.txHash && (
                    <div className="text-[10px] font-mono text-emerald-700 font-bold truncate mt-0.5">
                      Tx: {raf.winner.txHash}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 6. MY TICKETS TAB CONTENT */}
        {activeTab === "my-tickets" && (
          <div className="rounded-[24px] border-2 border-ink-900 bg-white p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_4px_0_var(--color-ink-900)]">
            <h3 className="font-display font-black text-lg text-ink-900 mb-2">Partisipasi Undian Saya</h3>
            <p className="text-xs text-ink-500 font-medium mb-4">
              Daftar seluruh tiket undian NFT yang sedang aktif kamu ikuti menggunakan Koin.
            </p>

            {totalMyTicketsPlaced === 0 ? (
              <div className="p-8 text-center bg-sand-50 rounded-2xl border-2 border-dashed border-ink-900/20">
                <Ticket className="size-10 text-ink-300 mx-auto mb-2" />
                <p className="font-display font-black text-sm text-ink-800">Kamu belum memasukkan tiket ke undian manapun.</p>
                <p className="text-xs text-ink-500 mt-1">Gunakan Koinmu untuk membeli tiket dan berpartisipasi sekarang!</p>
                <button
                  type="button"
                  onClick={() => setActiveTab("active")}
                  className="mt-3 px-4 py-2 rounded-xl bg-candy-500 text-white font-display font-black text-xs border-2 border-ink-900 shadow-[2px_2px_0_#2B1622]"
                >
                  Pilih Undian NFT
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {Object.entries(enteredRaffles).map(([rafId, data]) => {
                  const raf = INITIAL_RAFFLES.find((r) => r.id === rafId);
                  if (!raf || data.count <= 0) return null;
                  const total = raf.totalEntries + data.count;
                  const odds = ((data.count / total) * 100).toFixed(1);

                  return (
                    <div
                      key={rafId}
                      className="p-4 rounded-2xl border-2 border-ink-900/15 bg-sand-50 flex items-center justify-between gap-3"
                    >
                      <div>
                        <div className="font-display font-black text-sm text-ink-900">{raf.title}</div>
                        <div className="text-xs text-ink-500 font-medium mt-0.5">
                          Dimasukkan pada: {new Date(data.enteredAt).toLocaleDateString("id-ID")}
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="px-3 py-1 rounded-full bg-candy-100 border border-candy-300 text-candy-deep font-mono font-black text-xs">
                          {data.count} Tiket ({odds}% Peluang)
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* 7. MODAL: ENTER RAFFLE / BUY WITH COINS */}
        {selectedRaffle && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-ink-900/60 backdrop-blur-xs">
            <div className="w-full max-w-md rounded-[28px] border-2 border-ink-900 bg-white p-5 sm:p-6 shadow-[6px_6px_0_#2B1622] flex flex-col animate-in fade-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between border-b-2 border-sand-200 pb-3">
                <div className="flex items-center gap-2">
                  <Ticket className="size-5 text-candy-deep" />
                  <h3 className="font-display font-black text-base sm:text-lg text-ink-900">
                    Beli Tiket Undian
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedRaffle(null)}
                  className="size-8 rounded-full border-2 border-ink-900 bg-sand-100 font-mono font-black text-sm flex items-center justify-center hover:bg-sand-200 cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <div className="py-4 space-y-3.5">
                <div>
                  <span className="text-[10px] font-mono font-bold text-candy-deep uppercase tracking-wider">
                    TARGET NFT:
                  </span>
                  <div className="font-display font-black text-base text-ink-900">{selectedRaffle.title}</div>
                  <div className="text-xs text-ink-500 font-medium mt-0.5">{selectedRaffle.prize}</div>
                </div>

                {/* Ticket Stepper */}
                <div className="bg-sand-100 rounded-2xl p-4 border border-ink-900/15">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono font-bold text-ink-600">Jumlah Tiket:</span>
                    <span className="text-xs font-mono font-black text-candy-deep">
                      {entryCount * RAFFLE_TICKET_PRICE} Koin 🪙
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-3">
                    <button
                      type="button"
                      onClick={() => setEntryCount((c) => Math.max(1, c - 1))}
                      className="size-10 rounded-xl bg-white border-2 border-ink-900 font-mono font-black text-base flex items-center justify-center shadow-xs active:translate-y-0.5"
                    >
                      <Minus className="size-4" />
                    </button>

                    <div className="font-mono font-black text-2xl text-ink-900">{entryCount}</div>

                    <button
                      type="button"
                      onClick={() => setEntryCount((c) => Math.min(50, c + 1))}
                      className="size-10 rounded-xl bg-white border-2 border-ink-900 font-mono font-black text-base flex items-center justify-center shadow-xs active:translate-y-0.5"
                    >
                      <Plus className="size-4" />
                    </button>
                  </div>

                  {/* Quick Select Preset Buttons */}
                  <div className="grid grid-cols-4 gap-2 mt-3 pt-3 border-t border-sand-200">
                    {[1, 5, 10, 20].map((n) => (
                      <button
                        key={n}
                        type="button"
                        onClick={() => setEntryCount(n)}
                        className={cn(
                          "py-1.5 rounded-lg border text-xs font-mono font-black transition-all cursor-pointer",
                          entryCount === n
                            ? "bg-candy-500 text-white border-ink-900 shadow-xs"
                            : "bg-white text-ink-700 border-ink-900/20 hover:bg-sand-50"
                        )}
                      >
                        +{n}
                      </button>
                    ))}
                  </div>
                </div>

                {/* User Balance Check */}
                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-ink-700 font-bold">
                    <Coins className="size-4 text-amber-500" />
                    <span>Saldomu Saat Ini:</span>
                  </div>
                  <span className="font-mono font-black text-ink-900">{gems.toLocaleString("id-ID")} Koin</span>
                </div>
              </div>

              {/* Submit CTA */}
              <div className="pt-2 border-t-2 border-sand-200 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedRaffle(null)}
                  className="py-2.5 px-4 rounded-xl border-2 border-ink-900 bg-sand-100 font-display font-black text-xs hover:bg-sand-200"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={handleEnterRaffleSubmit}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-candy-500 hover:bg-candy-600 border-2 border-ink-900 text-white font-display font-black text-xs shadow-[2px_2px_0_#2B1622] active:translate-y-0.5 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Ticket className="size-4" />
                  <span>Konfirmasi Masukkan {entryCount} Tiket</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 8. MODAL: BUY RAFFLE TICKETS WITH COINS */}
        {showBuyTicketsModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-ink-900/60 backdrop-blur-xs">
            <div className="w-full max-w-md rounded-[28px] border-2 border-ink-900 bg-white p-5 sm:p-6 shadow-[6px_6px_0_#2B1622] flex flex-col animate-in fade-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between border-b-2 border-sand-200 pb-3">
                <div className="flex items-center gap-2">
                  <Coins className="size-5 text-amber-500" />
                  <h3 className="font-display font-black text-base sm:text-lg text-ink-900">
                    Beli Tiket Raffle Pakai Koin
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setShowBuyTicketsModal(false)}
                  className="size-8 rounded-full border-2 border-ink-900 bg-sand-100 font-mono font-black text-sm flex items-center justify-center hover:bg-sand-200 cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <div className="py-4 space-y-3.5">
                <p className="text-xs text-ink-600 font-medium">
                  Tukarkan Koin yang kamu dapatkan dari belajar dan hadiah klasemen mingguan menjadi tiket undian NFT.
                </p>

                <div className="bg-sand-100 rounded-2xl p-4 border border-ink-900/15">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono font-bold text-ink-600">Jumlah Tiket:</span>
                    <span className="text-xs font-mono font-black text-candy-deep">
                      {buyTicketsQty * RAFFLE_TICKET_PRICE} Koin
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-3">
                    <button
                      type="button"
                      onClick={() => setBuyTicketsQty((c) => Math.max(1, c - 1))}
                      className="size-10 rounded-xl bg-white border-2 border-ink-900 font-mono font-black text-base flex items-center justify-center shadow-xs"
                    >
                      <Minus className="size-4" />
                    </button>

                    <div className="font-mono font-black text-2xl text-ink-900">{buyTicketsQty}</div>

                    <button
                      type="button"
                      onClick={() => setBuyTicketsQty((c) => Math.min(100, c + 1))}
                      className="size-10 rounded-xl bg-white border-2 border-ink-900 font-mono font-black text-base flex items-center justify-center shadow-xs"
                    >
                      <Plus className="size-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-4 gap-2 mt-3 pt-3 border-t border-sand-200">
                    {[1, 5, 10, 25].map((n) => (
                      <button
                        key={n}
                        type="button"
                        onClick={() => setBuyTicketsQty(n)}
                        className={cn(
                          "py-1.5 rounded-lg border text-xs font-mono font-black transition-all cursor-pointer",
                          buyTicketsQty === n
                            ? "bg-candy-500 text-white border-ink-900 shadow-xs"
                            : "bg-white text-ink-700 border-ink-900/20 hover:bg-sand-50"
                        )}
                      >
                        {n} Tiket
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-sand-50 border border-sand-200 text-xs flex items-center justify-between">
                  <span className="text-ink-600 font-bold">Total Pembayaran:</span>
                  <span className="font-mono font-black text-ink-900 text-sm">
                    {buyTicketsQty * RAFFLE_TICKET_PRICE} Koin 🪙
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t-2 border-sand-200 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowBuyTicketsModal(false)}
                  className="py-2.5 px-4 rounded-xl border-2 border-ink-900 bg-sand-100 font-display font-black text-xs hover:bg-sand-200"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={() => handleBuyTickets(buyTicketsQty)}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-candy-500 hover:bg-candy-600 border-2 border-ink-900 text-white font-display font-black text-xs shadow-[2px_2px_0_#2B1622] active:translate-y-0.5 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Coins className="size-4 text-amber-300" />
                  <span>Beli Sekarang</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 9. MODAL: PROVABLY FAIR VRF INSPECTOR */}
        {showVrfModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-ink-900/60 backdrop-blur-xs">
            <div className="w-full max-w-lg rounded-[28px] border-2 border-ink-900 bg-white p-5 sm:p-6 shadow-[6px_6px_0_#2B1622] flex flex-col">
              <div className="flex items-center justify-between border-b-2 border-sand-200 pb-3">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="size-5 text-emerald-600" />
                  <h3 className="font-display font-black text-base sm:text-lg text-ink-900">
                    Transparansi Keacakan On-Chain (VRF)
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setShowVrfModal(null)}
                  className="size-8 rounded-full border-2 border-ink-900 bg-sand-100 font-mono font-black text-sm flex items-center justify-center hover:bg-sand-200"
                >
                  ✕
                </button>
              </div>

              <div className="py-3.5 space-y-3 text-xs">
                <p className="text-ink-600 font-medium leading-relaxed">
                  Web3min menggunakan Chainlink VRF (Verifiable Random Function) dan on-chain hash seed untuk memastikan pengundian pemenang 100% adil dan tidak dapat dimanipulasi oleh siapa pun.
                </p>

                <div className="space-y-2 font-mono">
                  <div className="p-2.5 rounded-xl bg-sand-100 border border-ink-900/15">
                    <div className="text-[10px] text-ink-400 font-bold uppercase">Smart Contract NFT:</div>
                    <div className="text-ink-900 font-black truncate">{showVrfModal.nftDetails?.contract}</div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-sand-100 border border-ink-900/15">
                    <div className="text-[10px] text-ink-400 font-bold uppercase">Provably Fair VRF Seed:</div>
                    <div className="text-candy-deep font-black break-all text-[11px]">
                      {showVrfModal.nftDetails?.vrfSeed}
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 font-medium">
                  ✓ Bukti kriptografis dapat diverifikasi di explorer saat blok pengundian ditambang.
                </div>
              </div>

              <div className="pt-2 border-t-2 border-sand-200">
                <button
                  type="button"
                  onClick={() => setShowVrfModal(null)}
                  className="w-full py-2.5 rounded-xl bg-ink-900 text-white font-display font-black text-xs"
                >
                  Tutup Pemeriksaan
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </AppShell>
  );
}
