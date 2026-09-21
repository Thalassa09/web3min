import { useState } from "react";
import { Link, createFileRoute } from "@tanstack/react-router";
import { Ticket, Trophy, ShieldCheck, Flame, Heart, Sparkles, ExternalLink, Save, Check } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Mascot } from "@/components/mascot";
import { BlockStamp } from "@/components/motif";
import { sequentialNodes, UNITS, unitEarned } from "@/lib/curriculum";
import { OUTFIT_LABEL } from "@/lib/shop";
import { wornList } from "@/lib/accessories";
import { sanitizeBio, twitterUrl } from "@/lib/people";
import { MAX_HEARTS, formatGems, useProgress } from "@/lib/store";
import { kindOf, worldOf } from "@/lib/worlds";
import { SurfaceCard } from "@/components/ui/surface-card";
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
  const [bioDraft, setBioDraft] = useState(bio);
  const [saved, setSaved] = useState(false);
  const lessonsDone = sequentialNodes().filter((n) => completed.includes(n.id)).length;
  const dirty = bioDraft !== bio;

  function handleSaveBio() {
    setBio(sanitizeBio(bioDraft));
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  return (
    <AppShell>
      <main className="px-4 py-6 max-w-5xl mx-auto space-y-6">
        {/* Profile Card */}
        <SurfaceCard className="p-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
            {/* Mascot Avatar */}
            <div className="p-4 rounded-[20px] bg-[#141824] border border-[#232b3e] shrink-0">
              <Mascot mood="idle" size={100} />
            </div>

            {/* Profile Info */}
            <div className="flex-1 min-w-0 space-y-3">
              <div className="flex items-center justify-center sm:justify-start gap-3 flex-wrap">
                <h1 className="font-display font-extrabold text-2xl text-[#f1f4fa] tracking-tight">
                  @{username || "pelajar"}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#00f59b]/15 text-[#00f59b]">
                  Level {Math.floor(xp / 100) + 1}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#182030] text-[#8e9ab2]">
                  Penjelajah Web3
                </span>
              </div>

              {/* Bio Edit */}
              <div className="space-y-2 pt-1 max-w-xl">
                <div className="relative">
                  <textarea
                    rows={2}
                    value={bioDraft}
                    onChange={(e) => setBioDraft(e.target.value.slice(0, 80))}
                    placeholder="Tulis status atau motto belajarmu..."
                    className="w-full px-3.5 py-2.5 rounded-[12px] bg-[#0c1017] border border-[#232b3e] text-xs text-[#f1f4fa] placeholder:text-[#5a667d] focus:outline-none focus:border-[#00f59b] transition-colors resize-none"
                  />
                  <span className="absolute right-2.5 bottom-2 text-[10px] font-mono text-[#5a667d]">
                    {bioDraft.length}/80
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-[#5a667d]">
                    Bio akan tampil pada papan undian dan profil publik.
                  </span>
                  {dirty && (
                    <TactileButton
                      variant="primary"
                      size="sm"
                      onClick={handleSaveBio}
                    >
                      Simpan Bio
                    </TactileButton>
                  )}
                  {saved && (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#00f59b]">
                      <Check className="size-3.5" /> Tersimpan
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </SurfaceCard>

        {/* 4 Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <SurfaceCard className="p-4 flex flex-col justify-between">
            <div className="flex items-center justify-between text-[#8e9ab2]">
              <span className="text-xs font-medium">Total XP</span>
              <Trophy className="size-4 text-[#f59e0b]" />
            </div>
            <div className="mt-3">
              <div className="text-2xl font-extrabold font-display text-[#f1f4fa]">{xp}</div>
              <div className="text-[11px] text-[#5a667d] mt-0.5">Poin pengalaman</div>
            </div>
          </SurfaceCard>

          <SurfaceCard className="p-4 flex flex-col justify-between">
            <div className="flex items-center justify-between text-[#8e9ab2]">
              <span className="text-xs font-medium">Streak Belajar</span>
              <Flame className="size-4 text-[#ff9100]" />
            </div>
            <div className="mt-3">
              <div className="text-2xl font-extrabold font-display text-[#f1f4fa]">{streak} Hari</div>
              <div className="text-[11px] text-[#5a667d] mt-0.5">Hari berturut-turut</div>
            </div>
          </SurfaceCard>

          <SurfaceCard className="p-4 flex flex-col justify-between">
            <div className="flex items-center justify-between text-[#8e9ab2]">
              <span className="text-xs font-medium">Saldo Bintang</span>
              <BlockStamp size={16} className="text-[#f59e0b]" />
            </div>
            <div className="mt-3">
              <div className="text-2xl font-extrabold font-display text-[#f1f4fa]">{formatGems(gems)}</div>
              <div className="text-[11px] text-[#5a667d] mt-0.5">Untuk toko & kostum</div>
            </div>
          </SurfaceCard>

          <SurfaceCard className="p-4 flex flex-col justify-between">
            <div className="flex items-center justify-between text-[#8e9ab2]">
              <span className="text-xs font-medium">Tiket Undian</span>
              <Ticket className="size-4 text-[#00f59b]" />
            </div>
            <div className="mt-3">
              <div className="text-2xl font-extrabold font-display text-[#f1f4fa]">{raffleTickets}</div>
              <div className="text-[11px] text-[#5a667d] mt-0.5">Tiket undian aktif</div>
            </div>
          </SurfaceCard>
        </div>

        {/* Active Raffle Participations */}
        <SurfaceCard className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Ticket className="size-5 text-[#00f59b]" />
              <h2 className="font-display font-bold text-lg text-[#f1f4fa]">
                Partisipasi Undian Web3
              </h2>
            </div>
            <Link to="/leaderboard" className="text-xs font-semibold text-[#00f59b] hover:underline">
              Buka Arena Undian →
            </Link>
          </div>

          {Object.keys(enteredRaffles).length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {Object.entries(enteredRaffles).map(([poolId, tickets]) => (
                <div
                  key={poolId}
                  className="p-3.5 rounded-[14px] bg-[#121622] border border-[#1e2536] flex items-center justify-between"
                >
                  <div>
                    <div className="text-xs font-bold text-[#f1f4fa]">Kolam #{poolId}</div>
                    <div className="text-[11px] text-[#8e9ab2] mt-0.5">Tiket terpasang: {tickets.count} tiket</div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-[#00f59b]/15 text-[#00f59b] text-xs font-semibold">
                    Terdaftar
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 rounded-[14px] bg-[#0c1017] border border-[#1e2536] text-center text-xs text-[#8e9ab2]">
              Kamu belum memasang tiket pada undian yang sedang berjalan. Buka tab <strong>Undian</strong> untuk ikut serta!
            </div>
          )}
        </SurfaceCard>

        {/* Curriculum Badges */}
        <SurfaceCard className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display font-bold text-lg text-[#f1f4fa]">
                Lencana Kurikulum Web3
              </h2>
              <p className="text-xs text-[#8e9ab2] mt-0.5">
                {lessonsDone} dari 20 modul telah kamu selesaikan.
              </p>
            </div>
            <div className="text-xs font-mono font-bold text-[#00f59b]">
              {Math.round((lessonsDone / 20) * 100)}% SELESAI
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3 pt-2">
            {sequentialNodes().map((node) => {
              const isUnlocked = completed.includes(node.id);
              return (
                <div
                  key={node.id}
                  className={`p-3 rounded-[14px] border text-center flex flex-col items-center justify-between gap-2 transition-all ${
                    isUnlocked
                      ? "bg-[#141d2c] border-[#00f59b]/35 shadow-sm"
                      : "bg-[#0c1017] border-[#1a2130] opacity-50"
                  }`}
                >
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-base bg-[#182030] text-[#f1f4fa]">
                    {isUnlocked ? "🏅" : "🔒"}
                  </div>
                  <div>
                    <div className="text-[11px] font-bold text-[#f1f4fa] line-clamp-1">{node.title}</div>
                    <div className="text-[10px] text-[#8e9ab2] mt-0.5 line-clamp-1">{node.blurb}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </SurfaceCard>
      </main>
    </AppShell>
  );
}
