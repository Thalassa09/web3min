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
  if (diff <= 0) return "BERAKHIR";
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const secs = Math.floor((diff % (1000 * 60)) / 1000);
  if (hours >= 24) {
    const days = Math.floor(hours / 24);
    const remHours = hours % 24;
    return `${days}H ${remHours}M ${secs}S`;
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
  const [ticketInput, setTicketInput] = useState(1);
  const [now, setNow] = useState(Date.now());
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Live timer tick
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  const raffles = useMemo(() => INITIAL_RAFFLES, []);

  const filteredRaffles = useMemo(() => {
    if (filter === "live") return raffles.filter((r) => r.status === "live");
    if (filter === "ended") return raffles.filter((r) => r.status === "ended");
    if (filter === "mine") return raffles.filter((r) => (enteredRaffles[r.id]?.count ?? 0) > 0);
    return raffles;
  }, [raffles, filter, enteredRaffles]);

  const totalUserEntered = Object.values(enteredRaffles).reduce(
    (acc, curr) => acc + (curr?.count ?? 0),
    0,
  );

  function handleBuyTicket() {
    if (gems < 10) {
      playDeny();
      setToastMessage("Bintang tidak cukup! Minimal 10 bintang untuk 1 tiket.");
      setTimeout(() => setToastMessage(null), 3000);
      return;
    }
    if (buyRaffleTicketsWithGems(1)) {
      playBuy();
      setToastMessage("Sukses tukar 10 Bintang menjadi 1 Tiket Raffle!");
      setTimeout(() => setToastMessage(null), 3000);
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
      setToastMessage("Jumlah tiket tidak valid atau tiketmu tidak mencukupi.");
      setTimeout(() => setToastMessage(null), 3000);
      return;
    }
    if (enterRaffle(activeModalRaffle.id, ticketInput)) {
      playComplete();
      setToastMessage(
        `Berhasil memasukkan ${ticketInput} tiket ke "${activeModalRaffle.title}"!`,
      );
      setTimeout(() => setToastMessage(null), 3500);
      setActiveModalRaffle(null);
    } else {
      playDeny();
    }
  }

  return (
    <AppShell>
      <div className="raffle-terminal min-h-dvh bg-[#070709] text-[#f4f4f5] px-4 py-6 lg:px-8">
        {/* Tessera Toast */}
        {toastMessage && (
          <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 rounded-sm bg-[#00f59b] text-[#070709] px-4 py-2 font-mono text-xs font-black uppercase tracking-wider shadow-[0_0_24px_rgba(0,245,155,0.4)]">
            [ OK ] {toastMessage}
          </div>
        )}

        {/* Header Tessera Style */}
        <header className="border-b border-[#22222a] pb-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 font-mono text-[11px] font-bold uppercase tracking-wider text-[#00f59b]">
              <span className="inline-block size-2 rounded-full bg-[#00f59b] animate-pulse" />
              <span>[ PROTOCOL // V1.0 ]</span>
              <span className="text-[#606070]">•</span>
              <span className="text-[#a0a0b0]">VERIFIABLE RANDOMNESS</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="rounded-sm border border-[#2a2a35] bg-[#121217] px-3 py-1 font-mono text-xs font-bold text-[#f4f4f5]">
                <span className="text-[#8b8b9e]">TIKET:</span>{" "}
                <span className="text-[#00f59b]">{raffleTickets}</span>
              </div>
              <div className="rounded-sm border border-[#2a2a35] bg-[#121217] px-3 py-1 font-mono text-xs font-bold text-[#f4f4f5]">
                <span className="text-[#8b8b9e]">BINTANG:</span>{" "}
                <span className="text-[#fbbf24]">{gems}</span>
              </div>
              <button
                type="button"
                onClick={handleBuyTicket}
                className="rounded-sm border border-[#00f59b]/40 bg-[#00f59b]/10 hover:bg-[#00f59b]/20 px-3 py-1 font-mono text-xs font-black uppercase tracking-wider text-[#00f59b] transition-colors"
                title="Tukar 10 Bintang = 1 Tiket"
              >
                + TUKAR TIKET
              </button>
            </div>
          </div>

          <h1 className="mt-4 font-mono text-3xl font-black uppercase tracking-tight text-white lg:text-5xl">
            DRAW WINNERS <span className="text-[#00f59b]">FROM THE PROOF</span>
          </h1>
          <p className="mt-2 max-w-2xl font-mono text-xs leading-relaxed text-[#9494a8] lg:text-sm">
            Undian Web3 terdesentralisasi khusus pembelajar. Selesaikan rute belajar untuk klaim tiket
            gratis, lalu masukkan ke pool hadiah onchain dengan pembuktian acak transparan (Chainlink VRF standard).
          </p>

          {/* Tessera Live Activity Ticker */}
          <div className="mt-5 flex items-center gap-2 overflow-hidden rounded-sm border border-[#22222a] bg-[#0d0d12] px-3 py-2">
            <span className="font-mono text-[10px] font-black uppercase tracking-wider text-[#00f59b] whitespace-nowrap">
              // ACTIVITY
            </span>
            <div className="flex items-center gap-6 overflow-x-auto text-[11px] font-mono text-[#8b8b9e] scrollbar-none">
              {INITIAL_ACTIVITIES.map((act) => (
                <div key={act.id} className="flex items-center gap-1.5 whitespace-nowrap">
                  <span className={act.type === "win" ? "text-[#fbbf24] font-bold" : "text-[#00f59b]"}>
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
        </header>

        {/* Filter Navigation Bar */}
        <section className="mt-6 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-1">
            {(
              [
                { id: "all", label: "ALL RAFFLES" },
                { id: "live", label: "LIVE" },
                { id: "ended", label: "ENDED" },
                { id: "mine", label: `MY ENTRIES (${totalUserEntered})` },
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
                  "rounded-sm px-3.5 py-1.5 font-mono text-xs font-black uppercase tracking-wider transition-all",
                  filter === tab.id
                    ? "bg-white text-black shadow-sm"
                    : "text-[#888899] hover:bg-[#181820] hover:text-white",
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="font-mono text-xs text-[#777788]">
            MENAMPILKAN {filteredRaffles.length} POOL HADIAH
          </div>
        </section>

        {/* Raffle Cards Grid */}
        <main className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filteredRaffles.map((raffle) => {
            const userEntry = enteredRaffles[raffle.id]?.count ?? 0;
            const isLive = raffle.status === "live";

            return (
              <article
                key={raffle.id}
                className="group relative flex flex-col justify-between rounded-sm border border-[#22222a] bg-[#111116] p-5 transition-all hover:border-[#383848] hover:bg-[#14141c]"
              >
                {/* Top Tags */}
                <div>
                  <div className="flex items-center justify-between gap-2 font-mono text-[10px] font-black uppercase tracking-wider">
                    <span
                      className={cn(
                        "inline-flex items-center gap-1.5 rounded-sm px-2 py-0.5 border",
                        isLive
                          ? "border-[#00f59b]/40 bg-[#00f59b]/10 text-[#00f59b]"
                          : "border-[#444450] bg-[#1e1e24] text-[#888899]",
                      )}
                    >
                      {isLive && <span className="size-1.5 rounded-full bg-[#00f59b] animate-ping" />}
                      [ {raffle.status.toUpperCase()} ]
                    </span>
                    <span className="text-[#777788] border border-[#262632] px-2 py-0.5 rounded-sm">
                      {raffle.network}
                    </span>
                  </div>

                  <div className="mt-4">
                    <span className="font-mono text-[11px] font-bold text-[#8b8b9e]">
                      HOST: {raffle.host}
                    </span>
                    <h2 className="mt-1 font-mono text-lg font-black leading-tight text-white group-hover:text-[#00f59b] transition-colors">
                      {raffle.title}
                    </h2>
                  </div>

                  {/* Prize Highlight Box */}
                  <div className="mt-3 rounded-sm border border-[#282834] bg-[#0a0a0f] p-3">
                    <p className="font-mono text-[10px] uppercase tracking-wider text-[#8b8b9e]">
                      REWARD PRIZE:
                    </p>
                    <p className="mt-0.5 font-mono text-sm font-black text-[#fbbf24]">
                      {raffle.prize}
                    </p>
                    <p className="mt-1 font-mono text-[11px] leading-relaxed text-[#a0a0b0]">
                      {raffle.prizeDetail}
                    </p>
                  </div>

                  {/* Metrics & Countdown */}
                  <div className="mt-4 grid grid-cols-2 gap-2 border-t border-[#1e1e26] pt-3 font-mono text-xs">
                    <div>
                      <span className="block text-[10px] text-[#777788] uppercase">ENDS IN</span>
                      <span className="font-black text-white">
                        {isLive ? formatCountdown(raffle.endsAt, now) : "SEALED"}
                      </span>
                    </div>
                    <div>
                      <span className="block text-[10px] text-[#777788] uppercase">TOTAL ENTRIES</span>
                      <span className="font-bold text-[#f4f4f5]">
                        {raffle.totalEntries + userEntry} Tiket
                      </span>
                    </div>
                  </div>

                  {/* VRF Seed proof */}
                  <div className="mt-3 rounded-sm bg-[#08080c] px-2.5 py-1.5 font-mono text-[10px] text-[#666677] truncate">
                    <span className="text-[#888899]">VRF SEED:</span> {raffle.vrfSeed.slice(0, 20)}...
                  </div>

                  {/* Winner Banner if Ended */}
                  {raffle.winner && (
                    <div className="mt-3 rounded-sm border border-[#fbbf24]/30 bg-[#fbbf24]/10 p-2.5 font-mono text-xs text-[#fbbf24]">
                      <span className="font-black">🏆 PEMENANG:</span> @{raffle.winner.username} (Tiket {raffle.winner.ticketId})
                    </div>
                  )}
                </div>

                {/* Bottom CTA */}
                <div className="mt-5 border-t border-[#1e1e26] pt-4">
                  {isLive ? (
                    <div className="flex flex-col gap-2">
                      {userEntry > 0 && (
                        <div className="flex items-center justify-between font-mono text-[11px] text-[#00f59b]">
                          <span>TIKET KAMU:</span>
                          <span className="font-black">{userEntry} Tiket Terdaftar</span>
                        </div>
                      )}
                      <button
                        type="button"
                        onClick={() => handleOpenModal(raffle)}
                        className="w-full rounded-sm border border-[#00f59b] bg-[#00f59b] hover:bg-[#00d888] active:translate-y-0.5 py-2.5 font-mono text-xs font-black uppercase tracking-wider text-[#070709] transition-all"
                      >
                        {userEntry > 0 ? "[ + TAMBAH TIKET ]" : `[ IKUTI UNDIAN (${raffle.ticketCost} TIKET) ]`}
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      disabled
                      className="w-full rounded-sm border border-[#2a2a34] bg-[#141419] py-2.5 font-mono text-xs font-bold uppercase tracking-wider text-[#666677] cursor-not-allowed"
                    >
                      [ UNDIAN TELAH SELESAI ]
                    </button>
                  )}
                </div>
              </article>
            );
          })}
        </main>

        {/* Modal Entry Dialog */}
        {activeModalRaffle && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4">
            <div className="w-full max-w-md rounded-sm border border-[#333340] bg-[#101015] p-6 shadow-2xl text-[#f4f4f5]">
              <div className="flex items-center justify-between border-b border-[#22222a] pb-3">
                <span className="font-mono text-xs font-black text-[#00f59b] uppercase tracking-wider">
                  // ENTER ONCHAIN RAFFLE
                </span>
                <button
                  type="button"
                  onClick={() => setActiveModalRaffle(null)}
                  className="font-mono text-xs text-[#8b8b9e] hover:text-white"
                >
                  [ X TUTUP ]
                </button>
              </div>

              <div className="mt-4">
                <h3 className="font-mono text-lg font-black text-white">
                  {activeModalRaffle.title}
                </h3>
                <p className="mt-1 font-mono text-xs text-[#fbbf24]">
                  {activeModalRaffle.prize}
                </p>
                <div className="mt-3 rounded-sm border border-[#22222a] bg-[#0a0a0e] p-3 font-mono text-xs text-[#a0a0b0]">
                  <p>
                    <span className="text-[#777788]">Tiket Tersedia:</span>{" "}
                    <span className="font-bold text-[#00f59b]">{raffleTickets} Tiket</span>
                  </p>
                  <p className="mt-1">
                    <span className="text-[#777788]">Biaya Minimal:</span>{" "}
                    <span className="font-bold text-white">{activeModalRaffle.ticketCost} Tiket / Entry</span>
                  </p>
                </div>

                <div className="mt-4">
                  <label className="block font-mono text-xs font-bold text-[#8b8b9e] uppercase">
                    JUMLAH TIKET YANG DISETORKAN:
                  </label>
                  <div className="mt-2 flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setTicketInput((p) => Math.max(1, p - 1))}
                      className="size-9 rounded-sm border border-[#333344] bg-[#181822] font-mono font-bold text-white hover:bg-[#20202c]"
                    >
                      -
                    </button>
                    <span className="font-mono text-xl font-black text-white w-12 text-center">
                      {ticketInput}
                    </span>
                    <button
                      type="button"
                      onClick={() => setTicketInput((p) => Math.min(raffleTickets, p + 1))}
                      className="size-9 rounded-sm border border-[#333344] bg-[#181822] font-mono font-bold text-white hover:bg-[#20202c]"
                    >
                      +
                    </button>
                    <button
                      type="button"
                      onClick={() => setTicketInput(Math.max(1, raffleTickets))}
                      className="ml-auto rounded-sm border border-[#333344] bg-[#181822] px-3 py-1 font-mono text-xs font-bold text-[#a0a0b0] hover:text-white"
                    >
                      MAX ({raffleTickets})
                    </button>
                  </div>
                </div>

                {raffleTickets < activeModalRaffle.ticketCost ? (
                  <div className="mt-4 rounded-sm border border-[#f43f5e]/30 bg-[#f43f5e]/10 p-3 font-mono text-xs text-[#f43f5e]">
                    ⚠️ Tiketmu habis! Selesaikan pelajaran atau tukar 10 Bintang untuk mendapatkan tiket baru.
                  </div>
                ) : null}

                <div className="mt-6 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setActiveModalRaffle(null)}
                    className="flex-1 rounded-sm border border-[#333344] bg-[#181820] py-2 font-mono text-xs font-bold uppercase text-[#888899]"
                  >
                    BATAL
                  </button>
                  <button
                    type="button"
                    disabled={raffleTickets < activeModalRaffle.ticketCost}
                    onClick={handleConfirmEntry}
                    className="flex-1 rounded-sm border border-[#00f59b] bg-[#00f59b] py-2 font-mono text-xs font-black uppercase text-black hover:bg-[#00d888] disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    KONFIRMASI ({ticketInput} TIKET)
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Infrastructure Explanation Section (Tessera style) */}
        <section className="mt-12 border-t border-[#22222a] pt-8">
          <p className="font-mono text-xs font-black uppercase tracking-wider text-[#00f59b]">
            // ARCHITECTURE
          </p>
          <h2 className="mt-1 font-mono text-2xl font-black uppercase text-white">
            BUILT LIKE INFRASTRUCTURE
          </h2>

          <div className="mt-6 grid gap-4 sm:grid-cols-3 font-mono text-xs">
            <div className="rounded-sm border border-[#22222a] bg-[#0e0e13] p-4">
              <span className="text-[#00f59b] font-black">[ 01 // GATED BY LEARNING ]</span>
              <h4 className="mt-2 font-bold text-white">Bukan Judi, Tanpa Deposit</h4>
              <p className="mt-1 leading-relaxed text-[#8b8b9e]">
                Tiket hanya bisa diperoleh dari menyelesaikan modul edukasi Web3 atau menukar reward bintang belajar.
              </p>
            </div>
            <div className="rounded-sm border border-[#22222a] bg-[#0e0e13] p-4">
              <span className="text-[#00f59b] font-black">[ 02 // VERIFIABLE RANDOMNESS ]</span>
              <h4 className="mt-2 font-bold text-white">Acak Transparan & Adil</h4>
              <p className="mt-1 leading-relaxed text-[#8b8b9e]">
                Setiap undian disegel dengan cryptographic VRF seed hash onchain sehingga hasil undian tidak bisa dimanipulasi admin.
              </p>
            </div>
            <div className="rounded-sm border border-[#22222a] bg-[#0e0e13] p-4">
              <span className="text-[#00f59b] font-black">[ 03 // DIRECT DISTRIBUTION ]</span>
              <h4 className="mt-2 font-bold text-white">Hadiah Langsung Dikirim</h4>
              <p className="mt-1 leading-relaxed text-[#8b8b9e]">
                Pemenang USDT atau Whitelist GTD langsung diverifikasi dan dikirim ke alamat yang didaftarkan pemenang.
              </p>
            </div>
          </div>
        </section>
      </div>
    </AppShell>
  );
}
