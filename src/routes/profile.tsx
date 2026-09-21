import { useState } from "react";
import { Link, createFileRoute } from "@tanstack/react-router";
import { Ticket, Trophy, ShieldCheck, Flame, Heart, Sparkles, ExternalLink, Save } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Mascot } from "@/components/mascot";
import { BlockStamp } from "@/components/motif";
import { sequentialNodes, UNITS, unitEarned } from "@/lib/curriculum";
import { OUTFIT_LABEL } from "@/lib/shop";
import { wornList } from "@/lib/accessories";
import { sanitizeBio, twitterUrl } from "@/lib/people";
import { MAX_HEARTS, formatGems, useProgress } from "@/lib/store";
import { kindOf, worldOf } from "@/lib/worlds";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { TelemetryBadge } from "@/components/ui/telemetry-badge";
import { TactileButton } from "@/components/ui/tactile-button";

export const Route = createFileRoute("/profile")({ component: ProfilePage });

function ProfilePage() {
  const username = useProgress((s) => s.username);
  const twitter = useProgress((s) => s.twitter);
  const raffleTickets = useProgress((s) => s.raffleTickets ?? 0);
  const enteredRaffles = useProgress((s) => s.enteredRaffles ?? {});
  const setBio = useProgress((s) => s.setBio);
  const bio = useProgress((s) => s.bio);
  const xp = useProgress((s) => s.xp);
  const gems = useProgress((s) => s.gems);
  const streak = useProgress((s) => s.streak);
  const hearts = useProgress((s) => s.hearts);
  const completed = useProgress((s) => s.completed);
  const perfect = useProgress((s) => s.perfect);
  const completedStories = useProgress((s) => s.completedStories);
  const completedCases = useProgress((s) => s.completedCases);
  const equipped = useProgress((s) => s.equipped);
  const worn = useProgress((s) => s.worn);
  const [bioDraft, setBioDraft] = useState(bio);
  const [saved, setSaved] = useState(false);
  const lessonsDone = sequentialNodes().filter((n) => completed.includes(n.id)).length;
  const dirty = bioDraft !== bio;

  return (
    <AppShell>
      <main className="px-4 py-6 max-w-5xl mx-auto space-y-8">
        {/* Profile Hero Spotlight Card */}
        <SpotlightCard glowColor="rgba(0, 229, 255, 0.2)" className="w-full">
          <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
            {/* Mascot Holo Avatar */}
            <div className="relative p-3 rounded-[24px] bg-[#111425] border border-[#232a48] shadow-[0_4px_24px_rgba(0,0,0,0.6)] shrink-0">
              <Mascot mood="idle" size={120} />
              <span className="absolute bottom-2 right-2 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00f59b] opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-[#00f59b] border-2 border-[#111425]" />
              </span>
            </div>

            {/* Profile Identity Info */}
            <div className="flex-1 min-w-0 space-y-2">
              <div className="flex items-center justify-center sm:justify-start gap-3 flex-wrap">
                <h1 className="font-display font-black text-2xl text-zinc-100 tracking-tight">
                  @{username || "pelajar"}
                </h1>
                <TelemetryBadge label="RANK" value="EXPLORER" tone="cyan" />
                <TelemetryBadge label="LEVEL" value={Math.floor(xp / 100) + 1} tone="mint" />
              </div>

              <p className="text-sm text-zinc-400 font-sans leading-relaxed max-w-xl">
                {bio || "Mahasiswa Web3 · Menjelajahi protokol terdesentralisasi bersama web3min."}
              </p>

              <div className="flex items-center justify-center sm:justify-start gap-4 pt-1 flex-wrap">
                {twitter ? (
                  <a
                    href={twitterUrl(twitter)}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-[#00e5ff] hover:underline"
                  >
                    <span>@{twitter}</span>
                    <ExternalLink className="size-3" />
                  </a>
                ) : null}

                {wornList(worn).length ? (
                  <span className="text-xs font-mono text-[#ff4d88] flex items-center gap-1">
                    <Sparkles className="size-3" />
                    Koleksi: {wornList(worn).map((a) => a.name).join(" · ")}
                  </span>
                ) : equipped ? (
                  <span className="text-xs font-mono text-[#ff4d88]">
                    Kostum: {OUTFIT_LABEL[equipped] ?? equipped}
                  </span>
                ) : null}
              </div>
            </div>
          </div>
        </SpotlightCard>

        {/* Sovereign Telemetry Metric Grid (4-Cols) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-[20px] bg-[#0c0d16] border border-[#1d2238] shadow-[0_4px_16px_rgba(0,0,0,0.4)] flex flex-col justify-between">
            <div className="flex items-center justify-between text-zinc-500 font-mono text-xs">
              <span>TOTAL XP</span>
              <Trophy className="size-4 text-[#f59e0b]" />
            </div>
            <div className="mt-3">
              <span className="font-display font-black text-2xl text-zinc-100 tabular-nums">
                {xp}
              </span>
              <span className="block text-[11px] font-mono text-[#00f59b] mt-0.5">
                {lessonsDone} Pelajaran Tuntas
              </span>
            </div>
          </div>

          <div className="p-4 rounded-[20px] bg-[#0c0d16] border border-[#1d2238] shadow-[0_4px_16px_rgba(0,0,0,0.4)] flex flex-col justify-between">
            <div className="flex items-center justify-between text-zinc-500 font-mono text-xs">
              <span>STREAK AKTIF</span>
              <Flame className="size-4 text-[#ff9100]" />
            </div>
            <div className="mt-3">
              <span className="font-display font-black text-2xl text-zinc-100 tabular-nums">
                {streak}
              </span>
              <span className="block text-[11px] font-mono text-[#ff9100] mt-0.5">
                Hari Berturut-turut
              </span>
            </div>
          </div>

          <div className="p-4 rounded-[20px] bg-[#0c0d16] border border-[#1d2238] shadow-[0_4px_16px_rgba(0,0,0,0.4)] flex flex-col justify-between">
            <div className="flex items-center justify-between text-zinc-500 font-mono text-xs">
              <span>SALDO BINTANG</span>
              <BlockStamp size={16} />
            </div>
            <div className="mt-3">
              <span className="font-display font-black text-2xl text-zinc-100 tabular-nums">
                {formatGems(gems)}
              </span>
              <span className="block text-[11px] font-mono text-[#f59e0b] mt-0.5">
                Bintang Tersedia
              </span>
            </div>
          </div>

          <div className="p-4 rounded-[20px] bg-[#0c0d16] border border-[#1d2238] shadow-[0_4px_16px_rgba(0,0,0,0.4)] flex flex-col justify-between">
            <div className="flex items-center justify-between text-zinc-500 font-mono text-xs">
              <span>TIKET RAFFLE</span>
              <Ticket className="size-4 text-[#00f59b]" />
            </div>
            <div className="mt-3">
              <span className="font-display font-black text-2xl text-[#00f59b] tabular-nums">
                {raffleTickets}
              </span>
              <span className="block text-[11px] font-mono text-zinc-400 mt-0.5">
                {Object.keys(enteredRaffles).length} Pool Diikuti
              </span>
            </div>
          </div>
        </div>

        {/* Bio Editor & Status Broadcast */}
        <div className="p-6 rounded-[24px] bg-[#090b14] border border-[#1b1f33] space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display font-bold text-lg text-zinc-100">Status & Bio Pelajar</h2>
              <p className="text-xs text-zinc-400 font-sans">
                Status publik ini dapat dilihat peserta lain di papan undian Web3.
              </p>
            </div>
            <TelemetryBadge label="STATUS" value={dirty ? "EDITED" : "SAVED"} tone={dirty ? "amber" : "mint"} />
          </div>

          <div className="space-y-2">
            <input
              id="bio"
              value={bioDraft}
              onChange={(e) => setBioDraft(sanitizeBio(e.target.value))}
              placeholder="Contoh: Meneliti smart contract vulnerability di rute Hutan Bit..."
              className="w-full h-12 px-4 rounded-[14px] bg-[#05050a] border border-[#232840] font-sans text-sm text-zinc-100 focus:outline-none focus:border-[#00f59b] transition-colors"
              maxLength={80}
            />
            <div className="flex items-center justify-between text-[11px] font-mono text-zinc-500">
              <span>Maksimal 80 karakter</span>
              <span>{bioDraft.length}/80</span>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <TactileButton
              variant="primary"
              size="sm"
              disabled={!dirty}
              icon={<Save className="size-3.5" />}
              onClick={() => {
                setBio(bioDraft);
                setSaved(true);
                window.setTimeout(() => setSaved(false), 4000);
              }}
            >
              Simpan Perubahan
            </TactileButton>

            {saved && (
              <span className="text-xs font-mono text-[#00f59b] flex items-center gap-1 animate-fade-in">
                <ShieldCheck className="size-3.5" /> Tersimpan ke local storage
              </span>
            )}
          </div>
        </div>

        {/* Route Badge Mastery Matrix */}
        <div className="p-6 rounded-[24px] bg-[#090b14] border border-[#1b1f33] space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display font-bold text-lg text-zinc-100">Lencana Rute Web3</h2>
              <p className="text-xs text-zinc-400 font-sans">
                Tanda kelulusan tiap unit rute pembelajaran yang berhasil diselesaikan.
              </p>
            </div>
            <span className="text-xs font-mono text-zinc-500">
              {UNITS.filter((u) => unitEarned(u, completed)).length}/{UNITS.length} Lencana
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 pt-2">
            {UNITS.map((unit) => {
              const world = worldOf(unit.id);
              const on = unitEarned(unit, completed);

              return (
                <div
                  key={unit.id}
                  className={`p-4 rounded-[18px] border flex flex-col items-center text-center transition-all ${
                    on
                      ? "bg-[#0d141e] border-[#00f59b]/40 shadow-[0_0_16px_rgba(0,245,155,0.08)]"
                      : "bg-[#070810] border-[#161928] opacity-50"
                  }`}
                >
                  <img
                    src={world.stamp}
                    alt={world.land}
                    className={`size-10 pixelated object-contain mb-2 ${on ? "" : "grayscale"}`}
                  />
                  <span className="font-display font-bold text-xs text-zinc-200 truncate max-w-full">
                    {world.land}
                  </span>
                  <span className="text-[10px] font-mono text-zinc-500 mt-0.5">
                    {kindOf(unit.id)}
                  </span>
                  <div className="mt-2">
                    <TelemetryBadge
                      label={on ? "EARNED" : "LOCKED"}
                      tone={on ? "mint" : "zinc"}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </AppShell>
  );
}
