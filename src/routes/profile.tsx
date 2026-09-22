import { useState, useEffect, useMemo } from "react";
import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  Ticket,
  Trophy,
  Flame,
  Check,
  Sparkles,
  ArrowRight,
  Pencil,
  Quote,
  LogOut,
  ShieldCheck,
  ChevronDown,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Mascot } from "@/components/mascot";
import { BlockStamp } from "@/components/motif";
import { UNITS, sequentialNodes } from "@/lib/curriculum";
import { sanitizeBio } from "@/lib/people";
import { saveBioToServer } from "@/lib/server-sync";
import { logoutAccount } from "@/lib/account";
import { formatGems, useProgress } from "@/lib/store";
import { SurfaceCard } from "@/components/ui/surface-card";
import { TactileButton } from "@/components/ui/tactile-button";
import { PixelIcon } from "@/components/ui/pixel-icon";

export const Route = createFileRoute("/profile")({ component: ProfilePage });

function ProfilePage() {
  const navigate = useNavigate();
  const username = useProgress((s) => s.username);
  const raffleTickets = useProgress((s) => s.raffleTickets ?? 0);
  const enteredRaffles = useProgress((s) => s.enteredRaffles ?? {});
  const setBio = useProgress((s) => s.setBio);
  const bio = useProgress((s) => s.bio);
  const xp = useProgress((s) => s.xp);
  const gems = useProgress((s) => s.gems);
  const streak = useProgress((s) => s.streak);
  const completed = useProgress((s) => s.completed);
  const reset = useProgress((s) => s.reset);

  const [bioDraft, setBioDraft] = useState(bio);
  const [isEditing, setIsEditing] = useState(false);
  const [saved, setSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [confirmLogout, setConfirmLogout] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [badgesOpen, setBadgesOpen] = useState(false);

  const allSeqNodes = useMemo(() => sequentialNodes(), []);
  const totalLessons = allSeqNodes.length;
  const lessonsDone = useMemo(
    () => allSeqNodes.filter((n) => completed.includes(n.id)).length,
    [allSeqNodes, completed],
  );
  const pct = totalLessons > 0 ? Math.round((lessonsDone / totalLessons) * 100) : 0;

  // 20 Unit Progress & Badges Calculation
  const unitStats = useMemo(() => {
    return UNITS.map((unit) => {
      const unitLessons = unit.lessons.filter((l) => l.kind !== "chest");
      const doneCount = unitLessons.filter((l) => completed.includes(l.id)).length;
      const totalCount = unitLessons.length;
      const isCompleted = totalCount > 0 && doneCount === totalCount;
      const isStarted = doneCount > 0;
      return {
        unit,
        doneCount,
        totalCount,
        isCompleted,
        isStarted,
      };
    });
  }, [completed]);

  const unitsDone = useMemo(
    () => unitStats.filter((u) => u.isCompleted).length,
    [unitStats],
  );
  const currentActiveUnit = useMemo(
    () => unitStats.find((u) => !u.isCompleted) ?? unitStats[0],
    [unitStats],
  );

  const dirty = sanitizeBio(bioDraft) !== bio;

  useEffect(() => {
    setBioDraft(bio);
  }, [bio]);

  async function handleLogout() {
    setIsLoggingOut(true);
    await logoutAccount();
    reset();
    setIsLoggingOut(false);
    void navigate({ to: "/onboarding" });
  }

  async function handleSaveBio() {
    const clean = sanitizeBio(bioDraft);
    setBio(clean);
    setBioDraft(clean);
    setIsSaving(true);
    setSaved(true);
    setIsEditing(false);
    await saveBioToServer(clean);
    setIsSaving(false);
    setTimeout(() => setSaved(false), 2500);
  }

  return (
    <AppShell>
      <main className="px-3 py-4 sm:px-4 sm:py-6 pb-32 sm:pb-36 max-w-5xl mx-auto space-y-5">
        {/* Profile Explorer License Card with Blue Sky Header */}
        <div className="rounded-[26px] bg-white border-2 border-[#B9CFE9] shadow-[0_6px_0_#C8DBF0,0_18px_34px_-18px_rgba(9,48,102,0.35)] overflow-hidden">
          {/* Blue Sky Banner with cloud accents */}
          <div className="relative h-36 sm:h-44 bg-gradient-to-r from-[#1F7BFF] via-[#0B63F6] to-[#0B4FD1] p-5 sm:p-6 flex flex-col justify-between overflow-hidden">
            <div className="absolute top-2 right-6 size-24 rounded-full bg-white/10 blur-xl pointer-events-none" />
            <div className="absolute -bottom-6 right-24 size-32 rounded-full bg-white/15 blur-2xl pointer-events-none" />
            <div className="flex items-center justify-between z-10">
              <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 text-white text-[11px] font-extrabold uppercase tracking-wider">
                Lisensi Penjelajah Web3
              </span>
              <span className="text-white/85 font-mono text-xs font-bold">
                ID #{Math.abs((username || "pelajar").split("").reduce((a, b) => (a << 5) - a + b.charCodeAt(0), 0) % 100000).toString().padStart(5, "0")}
              </span>
            </div>
          </div>

          {/* Profile Details (Avatar + User Info + Dressing Room CTA) */}
          <div className="px-5 sm:px-6 pb-5 sm:pb-6 pt-0 relative">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-12 sm:-mt-14 mb-4">
              <div className="flex flex-col sm:flex-row items-center sm:items-end gap-3.5 text-center sm:text-left">
                {/* Blobi Avatar overlapping the header */}
                <div className="size-24 sm:size-28 rounded-full bg-white border-4 border-white shadow-[0_6px_0_#C8DBF0] flex items-center justify-center relative shrink-0 z-10">
                  <div className="size-full rounded-full bg-[#E4F0FF] flex items-center justify-center overflow-hidden">
                    <Mascot mood="proud" size={80} />
                  </div>
                </div>

                {/* Identity: Username + Level Badges */}
                <div className="space-y-1">
                  <h1 className="font-display font-bold text-2xl sm:text-3xl text-[#0D2340] tracking-tight">
                    @{username || "penjelajah"}
                  </h1>
                  <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-[#FFF7D1] text-[#B27B00] border border-[#FFD84D]">
                      Level {Math.floor(xp / 100) + 1}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-[#E4F0FF] text-[#0B63F6] border border-[#8FC2FF]">
                      Murid Blobi
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Button: Ruang Ganti Blobi */}
              <Link
                to="/shop"
                search={{ tab: "wardrobe" }}
                className="self-center sm:self-end px-3.5 py-2 rounded-[14px] bg-[#E4F0FF] border-2 border-[#8FC2FF] text-[#0B4FD1] text-xs font-extrabold hover:bg-[#D4E8FF] shadow-[0_2px_0_#C2DBFA] transition-all flex items-center gap-1.5 cursor-pointer active:translate-y-[1px]"
              >
                <Sparkles className="size-3.5" />
                <span>Ruang Ganti Blobi</span>
                <ArrowRight className="size-3" />
              </Link>
            </div>

            {/* User Motto / Status Section */}
            <div className="pt-3 border-t-2 border-[#F0F6FF]">
              {bio && !isEditing ? (
                <div className="group relative flex items-center justify-between gap-3 p-3.5 rounded-[18px] bg-[#F7FAFC] border-2 border-[#DCE7F5] hover:border-[#8FC2FF] transition-all">
                  <div className="flex items-start gap-2.5 min-w-0">
                    <Quote className="size-4 text-sky-600 shrink-0 mt-0.5" />
                    <p className="text-xs sm:text-sm font-semibold text-[#0D2340] italic leading-relaxed break-words">
                      “{bio}”
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    className="shrink-0 px-3 py-1.5 rounded-[12px] bg-white border-2 border-[#DCE7F5] shadow-[0_2px_0_#C8DBF0] text-xs font-extrabold text-[#0B4FD1] hover:bg-[#F0F6FF] active:translate-y-[1px] active:shadow-none transition-all cursor-pointer flex items-center gap-1.5"
                    title="Ubah status belajarmu"
                  >
                    <Pencil className="size-3.5" />
                    <span>Ubah</span>
                  </button>
                </div>
              ) : (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    void handleSaveBio();
                  }}
                  className="space-y-2.5"
                >
                  <div className="relative">
                    <textarea
                      rows={2}
                      value={bioDraft}
                      onChange={(e) => setBioDraft(e.target.value.slice(0, 80))}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          void handleSaveBio();
                        }
                      }}
                      placeholder="Tulis status atau motto belajarmu..."
                      className="w-full px-4 py-3 rounded-[16px] bg-[#F7FAFC] border-2 border-[#DCE7F5] text-sm text-[#0D2340] placeholder:text-[#9DB4CE] focus:outline-none focus:border-[#0B63F6] focus:bg-white transition-[border-color,background-color] resize-none font-medium"
                      autoFocus={isEditing}
                    />
                    <span className="absolute right-3 bottom-2.5 text-[11px] font-mono font-bold text-[#4A6580]">
                      {bioDraft.length}/80
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                    <span className="text-[11px] sm:text-xs font-medium text-[#4A6580]">
                      Tekan Enter atau klik Simpan untuk memperbarui status profil.
                    </span>
                    <div className="flex items-center gap-2 self-end sm:self-auto">
                      {bio && (
                        <button
                          type="button"
                          onClick={() => {
                            setBioDraft(bio);
                            setIsEditing(false);
                          }}
                          className="px-3 py-1.5 rounded-[12px] text-xs font-bold text-[#4A6580] hover:text-[#0D2340] hover:bg-[#F0F6FF] transition-colors cursor-pointer"
                        >
                          Batal
                        </button>
                      )}
                      <TactileButton
                        variant="primary"
                        size="sm"
                        disabled={isSaving || (!dirty && bioDraft === bio)}
                        onClick={() => void handleSaveBio()}
                      >
                        {isSaving ? "Menyimpan..." : "Simpan Status"}
                      </TactileButton>
                    </div>
                  </div>
                </form>
              )}

              {saved && (
                <div className="mt-2 inline-flex items-center gap-1.5 text-xs font-extrabold text-[#1E8A49] bg-[#E8FBF0] px-3 py-1 rounded-full border border-[#98E4B5]">
                  <Check className="size-3.5" /> Status tersimpan di profil!
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 4 Chunky Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
          <SurfaceCard className="p-4 bg-white flex flex-col justify-between">
            <div className="flex items-center justify-between text-[#4A6580]">
              <span className="text-xs font-extrabold uppercase tracking-wide">Total XP</span>
              <Trophy className="size-4 text-[#FFC61A]" />
            </div>
            <div className="mt-3">
              <div className="text-2xl sm:text-3xl font-bold font-display text-[#0D2340]">{xp}</div>
              <div className="text-xs font-medium text-[#4A6580] mt-0.5">Poin pengalaman</div>
            </div>
          </SurfaceCard>

          <SurfaceCard className="p-4 bg-white flex flex-col justify-between">
            <div className="flex items-center justify-between text-[#4A6580]">
              <span className="text-xs font-extrabold uppercase tracking-wide">Streak Belajar</span>
              <Flame className="size-4 text-flame" />
            </div>
            <div className="mt-3">
              <div className="text-2xl sm:text-3xl font-bold font-display text-[#0D2340]">{streak} Hari</div>
              <div className="text-xs font-medium text-[#4A6580] mt-0.5">Berturut-turut</div>
            </div>
          </SurfaceCard>

          <SurfaceCard className="p-4 bg-white flex flex-col justify-between">
            <div className="flex items-center justify-between text-[#4A6580]">
              <span className="text-xs font-extrabold uppercase tracking-wide">Saldo Bintang</span>
              <BlockStamp size={16} className="text-[#FFC61A]" />
            </div>
            <div className="mt-3">
              <div className="text-2xl sm:text-3xl font-bold font-display text-[#0D2340]">{formatGems(gems)}</div>
              <div className="text-xs font-medium text-[#4A6580] mt-0.5">Koin hadiah</div>
            </div>
          </SurfaceCard>

          <SurfaceCard className="p-4 bg-white flex flex-col justify-between">
            <div className="flex items-center justify-between text-[#4A6580]">
              <span className="text-xs font-extrabold uppercase tracking-wide">Tiket Undian</span>
              <Ticket className="size-4 text-[#0B63F6]" />
            </div>
            <div className="mt-3">
              <div className="text-2xl sm:text-3xl font-bold font-display text-[#0D2340]">{raffleTickets}</div>
              <div className="text-xs font-medium text-[#4A6580] mt-0.5">Tiket undian aktif</div>
            </div>
          </SurfaceCard>
        </div>

        {/* Lencana Kurikulum (20 Unit) — Engineered for Appllama & Duolingo High Fidelity */}
        <SurfaceCard className="p-4 sm:p-5 bg-white space-y-4 scroll-mt-20">
          {/* Header Row */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="size-11 rounded-full bg-[#E8FBF0] border-2 border-[#98E4B5] flex items-center justify-center shrink-0 shadow-[0_2px_0_#98E4B5]">
                <PixelIcon name="medal" size={22} alt="" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h2 className="font-display font-bold text-base text-[#0D2340]">
                    Lencana Kurikulum
                  </h2>
                  <span className="hidden sm:inline-flex px-2 py-0.5 rounded-full text-[10px] font-mono font-extrabold bg-[#E4F0FF] text-[#0B63F6] border border-[#8FC2FF]">
                    20 UNIT
                  </span>
                </div>
                <p className="text-xs font-medium text-[#4A6580] truncate mt-0.5">
                  {unitsDone} dari 20 unit tamat ({lessonsDone}/{totalLessons} modul selesai)
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setBadgesOpen((v) => !v)}
              className="px-3.5 py-1.5 rounded-[14px] bg-[#E4F0FF] border-2 border-[#8FC2FF] text-[#0B4FD1] text-xs font-extrabold hover:bg-[#D4E8FF] shadow-[0_2px_0_#C2DBFA] active:translate-y-[1px] transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
              aria-expanded={badgesOpen}
            >
              <span>{badgesOpen ? "Tutup Rak" : "Buka Rak"}</span>
              <ChevronDown
                className={`size-4 transition-transform duration-200 ${badgesOpen ? "rotate-180" : ""}`}
              />
            </button>
          </div>

          {/* Overall Progress Bar */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-[#4A6580] font-medium">Progres Belajar</span>
              <span className="font-mono text-[#0B63F6]">{pct}% SELESAI</span>
            </div>
            <div className="h-2.5 rounded-full bg-[#E4F0FF] border border-[#8FC2FF]/40 overflow-hidden">
              <div
                className="h-full rounded-full bg-[#0B63F6] transition-all duration-500 ease-out"
                style={{ width: `${Math.max(pct, 2)}%` }}
              />
            </div>
          </div>

          {/* When Collapsed: Clean summary highlight card */}
          {!badgesOpen && (
            <div className="p-3.5 rounded-[18px] bg-[#F7FAFC] border-2 border-[#DCE7F5] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              {unitsDone > 0 ? (
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="size-9 rounded-full bg-[#E8FBF0] border-2 border-[#98E4B5] flex items-center justify-center shrink-0 shadow-[0_2px_0_#98E4B5]">
                    <PixelIcon name="medal" size={18} alt="" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-extrabold text-[#0D2340]">
                      {unitsDone} Lencana Unit Telah Diraih!
                    </div>
                    <div className="text-[11px] font-medium text-[#4A6580] truncate">
                      Lanjutkan modul untuk membuka lencana unit berikutnya.
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="size-9 rounded-full bg-[#E4F0FF] border-2 border-[#8FC2FF] flex items-center justify-center shrink-0">
                    <span className="text-xs font-mono font-black text-[#0B63F6]">
                      #{currentActiveUnit.unit.index}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-extrabold text-[#0D2340] truncate">
                      Unit {currentActiveUnit.unit.index}: {currentActiveUnit.unit.title}
                    </div>
                    <div className="text-[11px] font-medium text-[#4A6580]">
                      {currentActiveUnit.doneCount}/{currentActiveUnit.totalCount} modul • Selesaikan unit ini untuk klaim lencana pertamamu!
                    </div>
                  </div>
                </div>
              )}

              <button
                type="button"
                onClick={() => setBadgesOpen(true)}
                className="text-xs font-extrabold text-[#0B63F6] hover:text-[#0B4FD1] self-start sm:self-auto hover:underline cursor-pointer flex items-center gap-1"
              >
                <span>Lihat 20 Lencana</span>
                <ArrowRight className="size-3.5" />
              </button>
            </div>
          )}

          {/* When Open: The 20 Unit Badges Grid */}
          {badgesOpen && (
            <div className="space-y-4 pt-1">
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3">
                {unitStats.map(({ unit, doneCount, totalCount, isCompleted, isStarted }) => (
                  <div
                    key={unit.id}
                    className={`p-3 rounded-[18px] text-center flex flex-col items-center justify-between gap-2 transition-all ${
                      isCompleted
                        ? "bg-white border-2 border-[#98E4B5] shadow-[0_3px_0_#98E4B5]"
                        : isStarted
                        ? "bg-[#F0F7FF] border-2 border-[#8FC2FF] shadow-[0_3px_0_#C2DBFA]"
                        : "bg-[#F7FAFC] border-2 border-dashed border-[#DCE7F5] opacity-65"
                    }`}
                  >
                    <div
                      className={`size-11 rounded-full flex items-center justify-center shrink-0 ${
                        isCompleted
                          ? "bg-[#E8FBF0] border-2 border-[#98E4B5] shadow-[0_2px_0_#98E4B5]"
                          : isStarted
                          ? "bg-white border-2 border-[#8FC2FF]"
                          : "bg-[#E4F0FF]/50 border-2 border-[#DCE7F5]"
                      }`}
                    >
                      {isCompleted ? (
                        <PixelIcon name="medal" size={22} alt="Lencana Selesai" />
                      ) : (
                        <PixelIcon name="lock" size={18} alt="Terkunci" />
                      )}
                    </div>
                    <div className="w-full">
                      <div className="text-[10px] font-mono font-bold text-[#4A6580]">
                        Unit {unit.index}
                      </div>
                      <div className="text-xs font-extrabold text-[#0D2340] line-clamp-2 leading-tight mt-0.5">
                        {unit.title}
                      </div>
                    </div>
                    <div className="w-full pt-0.5">
                      {isCompleted ? (
                        <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-[#E8FBF0] text-[#1E8A49] border border-[#98E4B5]">
                          Selesai
                        </span>
                      ) : (
                        <span
                          className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                            isStarted
                              ? "bg-white text-[#0B63F6] border border-[#8FC2FF]"
                              : "bg-[#E4F0FF] text-[#4A6580] border border-[#DCE7F5]"
                          }`}
                        >
                          {doneCount}/{totalCount}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Close Button at bottom of open rack */}
              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => setBadgesOpen(false)}
                  className="px-4 py-2 rounded-[14px] bg-[#F0F6FF] border border-[#DCE7F5] text-xs font-extrabold text-[#4A6580] hover:text-[#0D2340] hover:bg-[#E4F0FF] transition-all cursor-pointer inline-flex items-center gap-1.5"
                >
                  <span>Tutup Rak Lencana</span>
                  <ChevronDown className="size-3.5 rotate-180" />
                </button>
              </div>
            </div>
          )}
        </SurfaceCard>

        {/* Partisipasi Undian Web3 */}
        <SurfaceCard className="p-4 sm:p-5 bg-white space-y-3">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <Ticket className="size-4 text-[#0B63F6] shrink-0" />
              <h2 className="font-display font-bold text-sm sm:text-base text-[#0D2340]">
                Partisipasi Undian Web3
              </h2>
            </div>
            <Link
              to="/leaderboard"
              className="text-xs font-extrabold text-[#0B63F6] hover:underline shrink-0"
            >
              Arena Undian →
            </Link>
          </div>

          {Object.keys(enteredRaffles).length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {Object.entries(enteredRaffles).map(([poolId, tickets]) => (
                <div
                  key={poolId}
                  className="p-3 rounded-[16px] bg-[#E4F0FF] border-2 border-[#8FC2FF] flex items-center justify-between shadow-[0_2px_0_#C2DBFA]"
                >
                  <div>
                    <div className="text-xs font-extrabold text-[#0D2340]">Kolam #{poolId}</div>
                    <div className="text-[11px] font-medium text-[#4A6580] mt-0.5">
                      Tiket terpasang: {tickets.count} tiket
                    </div>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#E8FBF0] text-[#1E8A49] text-[11px] font-extrabold border border-[#98E4B5]">
                    Terdaftar
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-3.5 rounded-[16px] bg-[#F7FAFC] border-2 border-[#DCE7F5] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-medium text-[#4A6580]">
              <span>Kamu belum memasang tiket pada undian mingguan yang sedang berjalan.</span>
              <Link
                to="/leaderboard"
                className="font-extrabold text-[#0B63F6] hover:underline shrink-0"
              >
                Pasang Tiket Sekarang →
              </Link>
            </div>
          )}
        </SurfaceCard>

        {/* Sesi Akun & Keamanan (Logout) */}
        <SurfaceCard className="p-4 sm:p-5 bg-white">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3.5">
            <div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="size-4 text-[#0B63F6] shrink-0" />
                <h2 className="font-display font-bold text-sm sm:text-base text-[#0D2340]">
                  Sesi Akun & Keamanan
                </h2>
              </div>
              <p className="text-xs font-medium text-[#4A6580] mt-1">
                Terhubung sebagai <span className="font-bold text-[#0D2340]">@{username || "pelajar"}</span>. Progres dan saldo bintangmu tersimpan di database Web3min.
              </p>
            </div>

            {!confirmLogout ? (
              <TactileButton
                variant="secondary"
                size="sm"
                onClick={() => setConfirmLogout(true)}
                className="self-start sm:self-auto shrink-0 text-[#B01E18] border-[#F4A4A0] hover:bg-[#FFF2F1] shadow-[0_3px_0_#F4A4A0]"
                icon={<LogOut className="size-3.5 text-[#B01E18]" />}
              >
                Keluar Akun
              </TactileButton>
            ) : (
              <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
                <span className="text-xs font-extrabold text-[#B01E18]">
                  Yakin keluar?
                </span>
                <TactileButton
                  variant="ghost"
                  size="sm"
                  onClick={() => setConfirmLogout(false)}
                  disabled={isLoggingOut}
                >
                  Batal
                </TactileButton>
                <TactileButton
                  variant="danger"
                  size="sm"
                  onClick={() => void handleLogout()}
                  disabled={isLoggingOut}
                  icon={<LogOut className="size-3.5" />}
                >
                  {isLoggingOut ? "Keluar…" : "Ya, Keluar"}
                </TactileButton>
              </div>
            )}
          </div>
        </SurfaceCard>
      </main>
    </AppShell>
  );
}
