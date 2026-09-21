import { useState } from "react";
import { Link, createFileRoute } from "@tanstack/react-router";
import { Ticket, Trophy, Flame, Check, Sparkles } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Mascot } from "@/components/mascot";
import { BlockStamp } from "@/components/motif";
import { sequentialNodes } from "@/lib/curriculum";
import { sanitizeBio } from "@/lib/people";
import { formatGems, useProgress } from "@/lib/store";
import { SurfaceCard } from "@/components/ui/surface-card";
import { TactileButton } from "@/components/ui/tactile-button";

export const Route = createFileRoute("/profile")({ component: ProfilePage });

function ProfilePage() {
  const username = useProgress((s) => s.username);
  const raffleTickets = useProgress((s) => s.raffleTickets ?? 0);
  const enteredRaffles = useProgress((s) => s.enteredRaffles ?? {});
  const setBio = useProgress((s) => s.setBio);
  const bio = useProgress((s) => s.bio);
  const xp = useProgress((s) => s.xp);
  const gems = useProgress((s) => s.gems);
  const streak = useProgress((s) => s.streak);
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
      <main className="px-3 py-4 sm:px-4 sm:py-6 max-w-5xl mx-auto space-y-6">
        {/* Profile Explorer License Card with Blue Header */}
        <div className="rounded-[26px] bg-white border-2 border-[#B9CFE9] shadow-[0_6px_0_#C8DBF0,0_18px_34px_-18px_rgba(9,48,102,0.35)] overflow-hidden">
          {/* Blue Sky Banner (180px) with clouds */}
          <div className="relative h-44 bg-gradient-to-r from-[#1F7BFF] via-[#0B63F6] to-[#0B4FD1] p-6 flex flex-col justify-between overflow-hidden">
            <div className="absolute top-2 right-6 size-24 rounded-full bg-white/10 blur-xl pointer-events-none" />
            <div className="absolute -bottom-6 right-24 size-32 rounded-full bg-white/15 blur-2xl pointer-events-none" />
            <div className="flex items-center justify-between z-10">
              <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 text-white text-[11px] font-extrabold uppercase tracking-wider">
                Lisensi Penjelajah Web3
              </span>
              <span className="text-white/80 font-mono text-xs font-bold">
                ID #{Math.abs((username || "pelajar").split("").reduce((a, b) => (a << 5) - a + b.charCodeAt(0), 0) % 100000).toString().padStart(5, "0")}
              </span>
            </div>
          </div>

          {/* Profile Details (Overlapping avatar) */}
          <div className="px-6 pb-6 pt-0 relative">
            <div className="flex flex-col sm:flex-row items-center sm:items-end gap-5 -mt-16 mb-4 text-center sm:text-left">
              {/* Blobi Avatar overlapping the header */}
              <div className="size-28 rounded-full bg-white border-4 border-white shadow-[0_6px_0_#C8DBF0] flex items-center justify-center relative shrink-0">
                <div className="size-full rounded-full bg-[#E4F0FF] flex items-center justify-center overflow-hidden">
                  <Mascot mood="proud" size={88} />
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-center sm:justify-start gap-2.5 flex-wrap">
                  <h1 className="font-display font-bold text-2xl sm:text-3xl text-[#0D2340]">
                    @{username || "penjelajah"}
                  </h1>
                  <span className="px-3 py-0.5 rounded-full text-xs font-extrabold bg-[#FFF7D1] text-[#B27B00] border border-[#FFD84D]">
                    Level {Math.floor(xp / 100) + 1}
                  </span>
                  <span className="px-3 py-0.5 rounded-full text-xs font-extrabold bg-[#E4F0FF] text-[#0B63F6] border border-[#8FC2FF]">
                    Murid Blobi
                  </span>
                </div>
              </div>
            </div>

            {/* Bio Edit */}
            <div className="pt-2 border-t-2 border-[#F0F6FF] space-y-2">
              <div className="relative">
                <textarea
                  rows={2}
                  value={bioDraft}
                  onChange={(e) => setBioDraft(e.target.value.slice(0, 80))}
                  placeholder="Tulis status atau motto belajarmu..."
                  className="w-full px-4 py-3 rounded-[16px] bg-[#F7FAFC] border-2 border-[#DCE7F5] text-sm text-[#0D2340] placeholder:text-[#9DB4CE] focus:outline-none focus:border-[#0B63F6] focus:bg-white transition-all resize-none font-medium"
                />
                <span className="absolute right-3 bottom-2.5 text-[11px] font-mono text-[#5A7796]">
                  {bioDraft.length}/80
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-[#5A7796]">
                  Bio akan tampil pada profil publik dan papan undian.
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
                  <span className="inline-flex items-center gap-1 text-xs font-extrabold text-[#1E8A49] bg-[#E8FBF0] px-2.5 py-1 rounded-full border border-[#98E4B5]">
                    <Check className="size-3.5" /> Tersimpan
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 4 Chunky Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <SurfaceCard className="p-4 bg-white flex flex-col justify-between">
            <div className="flex items-center justify-between text-[#5A7796]">
              <span className="text-xs font-extrabold uppercase tracking-wide">Total XP</span>
              <Trophy className="size-4 text-[#FFC61A]" />
            </div>
            <div className="mt-3">
              <div className="text-2xl sm:text-3xl font-bold font-display text-[#0D2340]">{xp}</div>
              <div className="text-xs font-medium text-[#5A7796] mt-0.5">Poin pengalaman</div>
            </div>
          </SurfaceCard>

          <SurfaceCard className="p-4 bg-white flex flex-col justify-between">
            <div className="flex items-center justify-between text-[#5A7796]">
              <span className="text-xs font-extrabold uppercase tracking-wide">Streak Belajar</span>
              <Flame className="size-4 text-[#FF7A18]" />
            </div>
            <div className="mt-3">
              <div className="text-2xl sm:text-3xl font-bold font-display text-[#0D2340]">{streak} Hari</div>
              <div className="text-xs font-medium text-[#5A7796] mt-0.5">Berturut-turut</div>
            </div>
          </SurfaceCard>

          <SurfaceCard className="p-4 bg-white flex flex-col justify-between">
            <div className="flex items-center justify-between text-[#5A7796]">
              <span className="text-xs font-extrabold uppercase tracking-wide">Saldo Bintang</span>
              <BlockStamp size={16} className="text-[#FFC61A]" />
            </div>
            <div className="mt-3">
              <div className="text-2xl sm:text-3xl font-bold font-display text-[#0D2340]">{formatGems(gems)}</div>
              <div className="text-xs font-medium text-[#5A7796] mt-0.5">Koin hadiah</div>
            </div>
          </SurfaceCard>

          <SurfaceCard className="p-4 bg-white flex flex-col justify-between">
            <div className="flex items-center justify-between text-[#5A7796]">
              <span className="text-xs font-extrabold uppercase tracking-wide">Tiket Undian</span>
              <Ticket className="size-4 text-[#0B63F6]" />
            </div>
            <div className="mt-3">
              <div className="text-2xl sm:text-3xl font-bold font-display text-[#0D2340]">{raffleTickets}</div>
              <div className="text-xs font-medium text-[#5A7796] mt-0.5">Tiket undian aktif</div>
            </div>
          </SurfaceCard>
        </div>

        {/* Active Raffle Participations */}
        <SurfaceCard className="p-6 bg-white space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Ticket className="size-5 text-[#0B63F6]" />
              <h2 className="font-display font-bold text-lg text-[#0D2340]">
                Partisipasi Undian Web3
              </h2>
            </div>
            <Link to="/leaderboard" className="text-xs font-extrabold text-[#0B63F6] hover:underline">
              Buka Arena Undian →
            </Link>
          </div>

          {Object.keys(enteredRaffles).length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {Object.entries(enteredRaffles).map(([poolId, tickets]) => (
                <div
                  key={poolId}
                  className="p-4 rounded-[18px] bg-[#E4F0FF] border-2 border-[#8FC2FF] flex items-center justify-between shadow-[0_3px_0_#C2DBFA]"
                >
                  <div>
                    <div className="text-xs font-extrabold text-[#0D2340]">Kolam #{poolId}</div>
                    <div className="text-xs font-medium text-[#5A7796] mt-0.5">Tiket terpasang: {tickets.count} tiket</div>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-[#E8FBF0] text-[#1E8A49] text-xs font-extrabold border border-[#98E4B5]">
                    Terdaftar
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-5 rounded-[18px] bg-[#F7FAFC] border-2 border-[#DCE7F5] text-center text-xs font-medium text-[#5A7796]">
              Kamu belum memasang tiket pada undian yang sedang berjalan. Buka tab <strong>Undian</strong> untuk ikut serta!
            </div>
          )}
        </SurfaceCard>

        {/* Curriculum Badges Rack */}
        <SurfaceCard className="p-6 bg-white space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display font-bold text-lg text-[#0D2340]">
                Rak Lencana Kurikulum (20 Modul)
              </h2>
              <p className="text-xs font-medium text-[#5A7796] mt-0.5">
                {lessonsDone} dari 20 modul telah kamu selesaikan.
              </p>
            </div>
            <div className="text-xs font-mono font-extrabold text-[#0B63F6] bg-[#E4F0FF] px-3 py-1 rounded-full border border-[#8FC2FF]">
              {Math.round((lessonsDone / 20) * 100)}% SELESAI
            </div>
          </div>

          {/* 4-column / 5-column grid with dashed empty slots */}
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3 pt-2">
            {sequentialNodes().map((node) => {
              const isUnlocked = completed.includes(node.id);
              return (
                <div
                  key={node.id}
                  className={`p-3.5 rounded-[18px] text-center flex flex-col items-center justify-between gap-2 transition-all ${
                    isUnlocked
                      ? "bg-white border-2 border-[#98E4B5] shadow-[0_4px_0_#98E4B5]"
                      : "bg-[#F7FAFC] border-2 border-dashed border-[#DCE7F5] opacity-60"
                  }`}
                >
                  <div className={`w-11 h-11 rounded-full flex items-center justify-center text-lg ${
                    isUnlocked ? "bg-[#E8FBF0] text-[#1E8A49]" : "bg-[#E4F0FF] text-[#9DB4CE]"
                  }`}>
                    {isUnlocked ? "🏅" : "🔒"}
                  </div>
                  <div>
                    <div className="text-[11px] font-extrabold text-[#0D2340] line-clamp-1">{node.title}</div>
                    <div className="text-[10px] font-medium text-[#5A7796] mt-0.5 line-clamp-1">{node.blurb}</div>
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
