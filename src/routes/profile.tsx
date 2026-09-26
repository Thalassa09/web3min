import { useState, useEffect, useMemo } from "react";
import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import {
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
  Compass,
  Wallet,
  Coins,
  TrendingUp,
  ShieldAlert,
  BarChart3,
  Rocket,
  Search,
  Landmark,
  Percent,
  Brain,
  Layers,
  Gift,
  Scale,
  Palette,
  Eye,
  Award,
  Lock,
  Mail,
  CheckCircle2,
  LogIn,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Mascot } from "@/components/mascot";
import { BlockStamp } from "@/components/motif";
import { UNITS, sequentialNodes } from "@/lib/curriculum";
import { sanitizeBio } from "@/lib/people";
import { saveBioToServer } from "@/lib/server-sync";
import { logoutAccount, getRecoveryEmail, saveRecoveryEmail, ALLOWED_EMAIL_DOMAINS, isValidRecoveryEmail } from "@/lib/account";
import { formatGems, useProgress } from "@/lib/store";
import { SurfaceCard } from "@/components/ui/surface-card";
import { TactileButton } from "@/components/ui/tactile-button";
import { PixelIcon } from "@/components/ui/pixel-icon";
import { Lozenge } from "@/components/ui/lozenge";
import { SkillTag } from "@/components/ui/rovo-companion";
import { ProgressBar } from "@/components/ui/progress-bar";
import { StreakBadge } from "@/components/ui/streak-badge";
import { PulauIcon, BlobiPixel } from "@/lib/pulau-icons";
import { PulauRantaiProgres } from "@/components/pulau-rantai-progres";
import { getPulauTheme } from "@/lib/pulau-rantai";

export const Route = createFileRoute("/profile")({ component: ProfilePage });

const WEB3_SKILLS = [
  { unitId: "u1", name: "Dasar Web3 & Blockchain", icon: Compass },
  { unitId: "u2", name: "Manajemen Wallet & Seed", icon: Wallet },
  { unitId: "u3", name: "Ekonomi Token & Gas Fee", icon: Coins },
  { unitId: "u4", name: "Smart Contract & NFT", icon: Sparkles },
  { unitId: "u5", name: "Protokol DeFi & Likuiditas", icon: TrendingUp },
  { unitId: "u6", name: "Deteksi Phishing & Penipu", icon: ShieldAlert },
  { unitId: "u8", name: "Mekanisme Order Book", icon: BarChart3 },
  { unitId: "u10", name: "Riset On-Chain (DYOR)", icon: Search },
  { unitId: "u14", name: "Layer 2 & Jembatan", icon: Layers },
  { unitId: "u18", name: "Keamanan Keras On-Chain", icon: ShieldCheck },
];

const UNIT_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  u1: Compass,
  u2: Wallet,
  u3: Coins,
  u4: Sparkles,
  u5: TrendingUp,
  u6: ShieldAlert,
  u7: Flame,
  u8: BarChart3,
  u9: Rocket,
  u10: Search,
  u11: Landmark,
  u12: Percent,
  u13: Brain,
  u14: Layers,
  u15: Gift,
  u16: Scale,
  u17: Palette,
  u18: ShieldCheck,
  u19: Eye,
  u20: Award,
};

function ProfilePage() {
  const navigate = useNavigate();
  const username = useProgress((s) => s.username);
  const setBio = useProgress((s) => s.setBio);
  const bio = useProgress((s) => s.bio);
  const xp = useProgress((s) => s.xp);
  const gems = useProgress((s) => s.gems);
  const streak = useProgress((s) => s.streak);
  const completed = useProgress((s) => s.completed);
  const reset = useProgress((s) => s.reset);
  const hearts = useProgress((s) => s.hearts);

  const [profileTab, setProfileTab] = useState<"lisensi" | "progres" | "rute">("lisensi");
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

  const [recoveryEmail, setRecoveryEmail] = useState<string | null>(null);
  const [emailDraft, setEmailDraft] = useState("");
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [isSavingEmail, setIsSavingEmail] = useState(false);
  const [emailSaveSuccess, setEmailSaveSuccess] = useState<string | null>(null);
  const [emailSaveError, setEmailSaveError] = useState<string | null>(null);

  useEffect(() => {
    void getRecoveryEmail().then((em) => {
      if (em) {
        setRecoveryEmail(em);
        setEmailDraft(em);
      }
    });
  }, []);

  async function handleSaveEmail(e?: React.FormEvent) {
    if (e) e.preventDefault();
    setIsSavingEmail(true);
    setEmailSaveError(null);
    setEmailSaveSuccess(null);
    const res = await saveRecoveryEmail(emailDraft);
    setIsSavingEmail(false);
    if (res.ok) {
      setRecoveryEmail(emailDraft.trim().toLowerCase());
      setIsEditingEmail(false);
      setEmailSaveSuccess("Email pemulihan akun berhasil disimpan!");
      setTimeout(() => setEmailSaveSuccess(null), 4000);
    } else {
      setEmailSaveError(res.message || "Gagal menyimpan email.");
    }
  }

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
        {/* Oksigen / Nyawa Alert */}
        {hearts < 5 && (
          <button
            type="button"
            className="alert cursor-pointer hover:bg-slate-50 transition-colors"
            onClick={() => void navigate({ to: "/shop" })}
          >
            <span className="ai">
              <PulauIcon name="o2" size={18} />
            </span>
            <span className="text-xs text-ink-900 font-semibold">
              Nyawa tinggal <b className="text-[#E63329] font-bold">{hearts}</b>. Pulih 1 tiap 30 menit, atau isi ulang di Toko.
            </span>
            <PulauIcon name="chev" size={18} />
          </button>
        )}

        {/* Tab Switcher */}
        <div className="flex items-center gap-1.5 p-1 bg-cream border-2 border-choco-900 rounded-full shadow-[2px_2px_0_#3B2218] max-w-fit">
          <button
            type="button"
            onClick={() => setProfileTab("lisensi")}
            className={`px-3.5 py-1 text-xs font-bold rounded-full transition-all cursor-pointer ${
              profileTab === "lisensi"
                ? "bg-candy-800 text-white shadow-xs"
                : "text-choco-600 hover:text-choco-900"
            }`}
          >
            Lisensi & Wardrobe
          </button>
          <button
            type="button"
            onClick={() => setProfileTab("progres")}
            className={`px-3.5 py-1 text-xs font-bold rounded-full transition-all cursor-pointer ${
              profileTab === "progres"
                ? "bg-candy-800 text-white shadow-xs"
                : "text-choco-600 hover:text-choco-900"
            }`}
          >
            Analitik Progres
          </button>
          <button
            type="button"
            onClick={() => setProfileTab("rute")}
            className={`px-3.5 py-1 text-xs font-bold rounded-full transition-all cursor-pointer ${
              profileTab === "rute"
                ? "bg-candy-800 text-white shadow-xs"
                : "text-choco-600 hover:text-choco-900"
            }`}
          >
            Rute Belajar
          </button>
        </div>

        {profileTab === "progres" && (
          <div className="max-w-3xl">
            <PulauRantaiProgres />
          </div>
        )}

        {profileTab === "rute" && (
          <div className="max-w-3xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black font-display text-ink-900">
                  20 Rute Pulau Rantai
                </h2>
                <p className="text-xs text-ink-500">
                  {unitsDone} dari 20 pulau telah kamu jelajahi sepenuhnya
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {unitStats.map(({ unit, doneCount, totalCount, isCompleted, isStarted }) => {
                const theme = getPulauTheme(unit.id, unit.index);
                const firstProp = theme.props[0]?.name || "mushroom";
                return (
                  <button
                    key={unit.id}
                    type="button"
                    className="rc text-left transition-transform active:scale-95"
                    style={{ background: theme.bg, color: "#fff" }}
                    onClick={() => {
                      void navigate({ to: "/", hash: `unit-${unit.id}` });
                    }}
                  >
                    <small className="block text-[11px] font-bold opacity-90">
                      Rute {unit.index} · {theme.kind}
                    </small>
                    <h3 className="text-lg font-black font-display mt-0.5 drop-shadow-xs">
                      {unit.title}
                    </h3>
                    <small className="block text-xs font-semibold opacity-90 mt-0.5">
                      {doneCount}/{totalCount} blok selesai
                    </small>
                    <span className="pb text-ink-900">
                      {isCompleted
                        ? "Jelajahi Lagi"
                        : isStarted
                        ? "Lanjut"
                        : "Mulai Rute"}
                    </span>
                    <img
                      src={`/props/${firstProp}.png`}
                      alt=""
                      onError={(e) => (e.currentTarget.style.display = "none")}
                    />
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {profileTab === "lisensi" && (
          <>
        {/* Profile Explorer License Card with Tactile Beveled Arcade Header */}
        <div className="rounded-3xl bg-gradient-to-b from-white via-[#FFF9F5] to-[#FDEEE4] border-2 border-choco-900/20 shadow-[0_6px_0_#3B2218,0_12px_28px_-4px_rgba(59,34,24,0.14)] overflow-hidden max-w-3xl">
          {/* Blobi Pink Striped Banner */}
          <div
            className="bg-gradient-to-r from-candy-500 via-candy-400 to-candy-500 border-b-2 border-candy-600/50 p-4 sm:p-5 flex items-center justify-between text-white"
            style={{ backgroundImage: "repeating-linear-gradient(45deg, #ffffff18 0 10px, transparent 10px 20px)" }}
          >
            <span className="font-sans text-xs font-bold uppercase tracking-wider text-white">
              Lisensi Penjelajah Web3
            </span>
            <span className="font-sans text-sm font-bold text-white">
              #{Math.abs((username || "pelajar").split("").reduce((a, b) => (a << 5) - a + b.charCodeAt(0), 0) % 100000).toString().padStart(5, "0")}
            </span>
          </div>

          {/* Profile Details (Avatar + User Identity + Wardrobe CTA) */}
          <div className="p-5 sm:p-6 relative">
            <div className="flex flex-col sm:flex-row items-center sm:items-center justify-between gap-4 mb-4">
              <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
                {/* Blobi Avatar */}
                <div className="size-20 sm:size-24 rounded-2xl bg-gradient-to-b from-[#FFF0F5] via-[#FFE4EC] to-[#FDC8D8] border-2 border-candy-500/50 shadow-[0_3px_0_#B01F62] flex items-center justify-center shrink-0">
                  <Mascot mood="proud" size={68} />
                </div>

                {/* Identity: Username + Level Chips */}
                <div>
                  <h1 className="font-sans font-extrabold text-2xl sm:text-3xl text-ink-900 tracking-tight">
                    @{username || "penjelajah"}
                  </h1>
                  <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap mt-2">
                    <span className="font-sans text-xs font-bold px-2.5 py-0.5 rounded-xl bg-gradient-to-b from-white to-[#FBE9DC] text-choco-900 border-2 border-choco-900/20 shadow-[0_2px_0_#3B2218]">
                      Level {Math.floor(xp / 100) + 1}
                    </span>
                    <span className="font-sans text-xs font-bold px-2.5 py-0.5 rounded-xl bg-gradient-to-b from-[#FFF0F5] to-[#FDC8D8] text-choco-900 border-2 border-candy-500/40 shadow-[0_2px_0_#B01F62]">
                      Murid Blobi
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Button: Ruang Ganti Blobi */}
              <Link
                to="/shop"
                search={{ tab: "wardrobe" }}
                className="px-4 py-2 rounded-xl bg-gradient-to-b from-white via-[#FFF9F5] to-[#FDEEE4] border-2 border-choco-900/20 text-choco-900 text-xs font-extrabold shadow-[0_3px_0_#3B2218] hover:brightness-105 active:translate-y-[2px] active:shadow-none transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Sparkles className="size-3.5 text-coin" />
                <span>Ganti Blobi</span>
              </Link>
            </div>

            {/* User Motto / Status Section */}
            <div className="pt-3 border-t-2 border-candy-100">
              {bio && !isEditing ? (
                <div className="group relative flex items-center justify-between gap-3 p-3.5 rounded-[18px] bg-cream border-2 border-choco-900 shadow-[2px_2px_0_#3B2218] transition-all">
                  <div className="flex items-start gap-2.5 min-w-0">
                    <Quote className="size-4 text-candy-500 shrink-0 mt-0.5" />
                    <p className="text-xs sm:text-sm font-semibold text-choco-900 italic leading-relaxed break-words">
                      “{bio}”
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    className="shrink-0 px-3 py-1.5 rounded-[12px] bg-white border-2 border-choco-900 shadow-[0_2px_0_#3B2218] text-xs font-bold text-candy-700 hover:bg-candy-50 active:translate-y-[1px] active:shadow-none transition-all cursor-pointer flex items-center gap-1.5"
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
                      className="w-full px-4 py-3 rounded-[12px] bg-canvas border-2 border-ink-900 text-sm text-ink-900 placeholder:text-ink-500/50 focus:outline-none focus:ring-2 focus:ring-blobi resize-none font-medium"
                      autoFocus={isEditing}
                    />
                    <span className="absolute right-3 bottom-2.5 text-xs font-sans font-bold text-ink-500">
                      {bioDraft.length}/80
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                    <span className="text-[11px] sm:text-xs font-semibold text-[#2C4663]">
                      Tulis status atau motto belajarmu, lalu tekan Simpan.
                    </span>
                    <div className="flex items-center gap-2 self-end sm:self-auto">
                      {bio && (
                        <button
                          type="button"
                          onClick={() => {
                            setBioDraft(bio);
                            setIsEditing(false);
                          }}
                          className="px-3 py-1.5 rounded-[12px] text-xs font-bold text-ink-500 hover:text-ink-900 hover:bg-[#F0F6FF] transition-colors cursor-pointer"
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
                <div className="mt-2 inline-flex items-center gap-1.5 text-xs font-extrabold text-leaf-shadow bg-[#E8FBF0] px-3 py-1 rounded-full border border-[#98E4B5]">
                  <Check className="size-3.5" /> Status tersimpan di profil!
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 4 Chunky Stat Cards in Tactile Beveled Style */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-3xl">
          <div className="p-4 rounded-3xl bg-gradient-to-b from-[#F0FDF4] via-[#DCFCE7] to-[#BBF7D0] border-2 border-emerald-500/40 shadow-[0_4px_0_#15803D,0_10px_24px_-4px_rgba(21,128,61,0.22)] flex flex-col justify-between">
            <div className="flex items-center justify-between text-emerald-800">
              <span className="font-sans text-xs font-semibold uppercase tracking-wider">Total XP</span>
              <Trophy className="size-4 text-emerald-700" />
            </div>
            <div className="mt-2">
              <div className="text-3xl font-bold font-sans text-emerald-950">{xp}</div>
              <div className="text-xs font-medium text-emerald-800 mt-0.5">Poin pengalaman</div>
            </div>
          </div>

          <div className="flex flex-col justify-center items-center">
            <StreakBadge
              length={streak}
              frequency="daily"
              variant="colored"
              subtitle="Hari Beruntun"
              className="w-full h-full min-h-[110px]"
            />
          </div>

          <div className="p-4 rounded-3xl bg-gradient-to-b from-[#FFFBEB] via-[#FEF3C7] to-[#FDE68A] border-2 border-amber-500/40 shadow-[0_4px_0_#D97706,0_10px_24px_-4px_rgba(217,119,6,0.22)] flex flex-col justify-between">
            <div className="flex items-center justify-between text-amber-800">
              <span className="font-sans text-xs font-semibold uppercase tracking-wider">Koin</span>
              <Sparkles className="size-4 text-amber-600" />
            </div>
            <div className="mt-2">
              <div className="text-3xl font-bold font-sans text-amber-950">{formatGems(gems)}</div>
              <div className="text-xs font-medium text-amber-800 mt-0.5">Saldo hadiah</div>
            </div>
          </div>

          <div className="p-4 rounded-3xl bg-gradient-to-b from-[#FFF0F5] via-[#FFE4EC] to-[#FDC8D8] border-2 border-candy-500/40 shadow-[0_4px_0_#B01F62,0_10px_24px_-4px_rgba(232,67,127,0.22)] flex flex-col justify-between">
            <div className="flex items-center justify-between text-candy-800">
              <span className="font-pixel text-xs font-semibold uppercase tracking-wider">Modul</span>
              <Compass className="size-4 text-candy-700" />
            </div>
            <div className="mt-2">
              <div className="text-3xl font-bold font-pixel text-candy-950">{lessonsDone}</div>
              <div className="text-xs font-medium text-candy-800 mt-0.5">Terselesaikan</div>
            </div>
          </div>
        </div>

        {/* Keahlian Web3 Terverifikasi (Atlassian Rovo UI Skills Spec) */}
        <SurfaceCard variant="default" className="p-4 sm:p-5 space-y-3.5">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <Sparkles className="size-4 text-candy-500 shrink-0" />
              <h2 className="font-display font-bold text-sm sm:text-base text-choco-900">
                Keahlian Web3 Terverifikasi
              </h2>
            </div>
            <span className="text-xs font-pixel font-bold text-candy-700">
              {WEB3_SKILLS.filter(s => {
                const u = unitStats.find(us => us.unit.id === s.unitId);
                return u?.isCompleted;
              }).length}/{WEB3_SKILLS.length} TERSERTIFIKASI
            </span>
          </div>

          <div className="flex flex-wrap gap-2 pt-1">
            {WEB3_SKILLS.map((skill) => {
              const u = unitStats.find(us => us.unit.id === skill.unitId);
              const isMastered = Boolean(u?.isCompleted);
              const isLearning = Boolean(u?.isStarted && !u.isCompleted);
              const SkillIcon = skill.icon;

              if (isMastered) {
                return (
                  <SkillTag
                    key={skill.name}
                    name={skill.name}
                    icon={<SkillIcon className="size-3 text-mint-deep" />}
                    level="LULUS"
                    className="bg-mint/20 text-mint-deep border-mint shadow-[0_2px_0_#1E9E78]"
                  />
                );
              }

              if (isLearning) {
                return (
                  <SkillTag
                    key={skill.name}
                    name={skill.name}
                    icon={<SkillIcon className="size-3 text-candy-500" />}
                    level="PROGRES"
                  />
                );
              }

              return (
                <div
                  key={skill.name}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[12px] bg-cream border-2 border-dashed border-choco-600 text-choco-600 text-[11px] font-bold select-none opacity-80"
                >
                  <Lock className="size-2.5 text-choco-600" />
                  <span>{skill.name}</span>
                </div>
              );
            })}
          </div>
        </SurfaceCard>

        {/* Lencana Kurikulum (20 Unit) — Engineered for Appllama & Duolingo High Fidelity */}
        <SurfaceCard variant="default" className="p-4 sm:p-5 space-y-4 scroll-mt-20">
          {/* Header Row: Compact & Non-wrapping */}
          <div className="flex items-center justify-between gap-2.5">
            <div className="flex items-center gap-3 min-w-0">
              <div className="size-11 rounded-full bg-[#E8FBF0] border-2 border-[#98E4B5] flex items-center justify-center shrink-0 shadow-[0_2px_0_#98E4B5]">
                <PixelIcon name="medal" size={22} alt="" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h2 className="font-display font-bold text-base text-ink-900">
                    Lencana Kurikulum
                  </h2>
                  <Lozenge appearance="inprogress" isBold className="hidden sm:inline-flex">
                    20 UNIT
                  </Lozenge>
                </div>
                <p className="text-xs font-bold text-choco-600 mt-0.5">
                  <span className="text-candy-500 font-extrabold">{unitsDone}/20 Unit Selesai</span>
                  <span className="hidden sm:inline text-choco-600/70 font-normal"> • {lessonsDone}/{totalLessons} Modul</span>
                </p>
              </div>
            </div>

            <TactileButton
              variant="secondary"
              size="sm"
              onClick={() => setBadgesOpen((v) => !v)}
              className="shrink-0 text-xs font-pixel font-bold"
              icon={
                <ChevronDown
                  className={`size-3.5 transition-transform duration-200 ${badgesOpen ? "rotate-180" : ""}`}
                />
              }
            >
              {badgesOpen ? "Tutup" : "Buka (20)"}
            </TactileButton>
          </div>

          {/* Overall Progress Bar */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-choco-600 font-medium">Progres Belajar</span>
              <span className="font-pixel text-candy-700">{pct}% SELESAI</span>
            </div>
            <ProgressBar value={pct} size="sm" />
          </div>

          {/* When Collapsed: Clean summary highlight card */}
          {!badgesOpen && (
            <div className="p-3.5 rounded-[18px] bg-cream border-2 border-choco-900 shadow-[0_3px_0_#3B2218] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              {unitsDone > 0 ? (
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="size-9 rounded-full bg-mint/20 border-2 border-mint flex items-center justify-center shrink-0 shadow-[0_2px_0_#1E9E78]">
                    <PixelIcon name="medal" size={18} alt="" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-pixel font-bold text-choco-900">
                      {unitsDone} Lencana Unit Telah Diraih!
                    </div>
                    <div className="text-[11px] font-medium text-choco-600 truncate">
                      Lanjutkan modul untuk membuka lencana unit berikutnya.
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="size-9 rounded-full bg-candy-100 border-2 border-choco-900 flex items-center justify-center shrink-0 shadow-[0_2px_0_#3B2218]">
                    {(() => {
                      const ActiveIcon = UNIT_ICONS[currentActiveUnit.unit.id] ?? UNIT_ICONS[currentActiveUnit.unit.index] ?? Compass;
                      return <ActiveIcon className="size-4 text-candy-500" />;
                    })()}
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-pixel font-bold text-choco-900 truncate">
                      Unit {currentActiveUnit.unit.index}: {currentActiveUnit.unit.title}
                    </div>
                    <div className="text-[11px] font-medium text-choco-600">
                      {currentActiveUnit.doneCount}/{currentActiveUnit.totalCount} modul • Selesaikan unit untuk klaim lencana!
                    </div>
                  </div>
                </div>
              )}

              <button
                type="button"
                onClick={() => setBadgesOpen(true)}
                className="text-xs font-pixel font-bold text-candy-700 hover:text-candy-500 self-start sm:self-auto hover:underline cursor-pointer flex items-center gap-1"
              >
                <span>Lihat 20 Lencana</span>
                <ArrowRight className="size-3.5 text-candy-700" />
              </button>
            </div>
          )}

          {/* When Open: The 20 Unit Badges Grid with Individual Thematic Iconography */}
          {badgesOpen && (
            <div className="space-y-4 pt-1">
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3">
                {unitStats.map(({ unit, doneCount, totalCount, isCompleted, isStarted }) => {
                  const ThematicIcon = UNIT_ICONS[unit.id] ?? UNIT_ICONS[unit.index] ?? Award;
                  return (
                    <div
                      key={unit.id}
                      className={`p-3 rounded-[18px] text-center flex flex-col items-center justify-between gap-2 transition-all ${
                        isCompleted
                          ? "bg-cream border-2 border-mint shadow-[0_4px_0_#1E9E78]"
                          : isStarted
                          ? "bg-candy-50 border-2 border-choco-900 shadow-[0_4px_0_#3B2218]"
                          : "bg-cream/60 border-2 border-choco-900/30 opacity-70"
                      }`}
                    >
                      {/* Badge Plate Icon */}
                      <div
                        className={`size-11 rounded-full flex items-center justify-center shrink-0 relative ${
                          isCompleted
                            ? "bg-mint/20 border-2 border-mint shadow-[0_2px_0_#1E9E78]"
                            : isStarted
                            ? "bg-white border-2 border-choco-900 shadow-[0_2px_0_#3B2218]"
                            : "bg-cream border-2 border-choco-900/20"
                        }`}
                      >
                        {isCompleted ? (
                          <PixelIcon name="medal" size={22} alt="Lencana Selesai" />
                        ) : isStarted ? (
                          <ThematicIcon className="size-5 text-candy-500" />
                        ) : (
                          <>
                            <ThematicIcon className="size-4 text-choco-600/50 opacity-60" />
                            <div className="absolute -bottom-1 -right-1 size-4 rounded-full bg-lemon border border-choco-900 flex items-center justify-center">
                              <Lock className="size-2.5 text-choco-900" />
                            </div>
                          </>
                        )}
                      </div>

                      {/* Unit Title */}
                      <div className="w-full">
                        <div className="text-[10px] font-pixel font-bold text-choco-600">
                          Unit {unit.index}
                        </div>
                        <div className="text-xs font-pixel font-bold text-choco-900 line-clamp-2 leading-tight mt-0.5 min-h-[28px]">
                          {unit.title}
                        </div>
                      </div>

                      {/* Progress Badge */}
                      <div className="w-full pt-0.5">
                        {isCompleted ? (
                          <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-pixel font-bold bg-mint/20 text-mint-deep border border-mint">
                            Selesai
                          </span>
                        ) : (
                          <span
                            className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-pixel font-bold ${
                              isStarted
                                ? "bg-white text-candy-700 border border-choco-900"
                                : "bg-cream text-choco-600 border border-choco-900/30"
                            }`}
                          >
                            {doneCount}/{totalCount}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Close Button at bottom of open rack */}
              <div className="text-center pt-2">
                <TactileButton
                  variant="secondary"
                  size="sm"
                  onClick={() => setBadgesOpen(false)}
                  className="text-xs font-extrabold"
                  icon={<ChevronDown className="size-3.5 rotate-180" />}
                >
                  Tutup Rak Lencana
                </TactileButton>
              </div>
            </div>
          )}
        </SurfaceCard>

        {/* Arena Belajar Mingguan */}
        <SurfaceCard variant="default" className="p-4 sm:p-5 space-y-3">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <Trophy className="size-4 text-coin shrink-0" />
              <h2 className="font-display font-bold text-sm sm:text-base text-choco-900">
                Arena Belajar Mingguan
              </h2>
            </div>
            <Link
              to="/leaderboard"
              className="text-xs font-bold text-candy-700 hover:text-candy-700 shrink-0"
            >
              Lihat Klasemen →
            </Link>
          </div>

          <div className="p-3.5 rounded-2xl bg-gradient-to-b from-white to-[#FFF9F5] border-2 border-choco-900/18 shadow-[0_2px_0_#3B2218] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-medium text-choco-600">
            <div>
              <div className="font-bold text-choco-900">Peringkat #7 di Liga Emas</div>
              <div className="text-[11px] text-choco-500 mt-0.5">Top 10 berbagi pool reward 500 Bintang mingguan.</div>
            </div>
            <Link
              to="/leaderboard"
              className="font-bold text-candy-700 hover:underline shrink-0"
            >
              Buka Arena →
            </Link>
          </div>
        </SurfaceCard>

        {/* Email Pemulihan Akun (Reset Password) */}
        <SurfaceCard variant="default" className="p-4 sm:p-5 space-y-3.5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Mail className="size-4 text-candy-500 shrink-0" />
                <h2 className="font-display font-bold text-sm sm:text-base text-choco-900">
                  Email Pemulihan Kata Sandi
                </h2>
                {recoveryEmail && !isEditingEmail && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-pixel font-bold bg-mint/20 text-mint-deep border border-mint">
                    Tersambung
                  </span>
                )}
              </div>
              <p className="text-xs font-semibold text-choco-600 max-w-xl leading-relaxed">
                Tambahkan email aktif untuk menerima kode verifikasi 6-digit jika kamu lupa password akun Web3min.
              </p>
            </div>

            {recoveryEmail && !isEditingEmail && (
              <TactileButton
                variant="secondary"
                size="sm"
                onClick={() => {
                  setEmailDraft(recoveryEmail);
                  setIsEditingEmail(true);
                }}
                className="self-start sm:self-auto shrink-0 text-xs font-extrabold"
                icon={<Pencil className="size-3.5 text-candy-700" />}
              >
                Ubah Email
              </TactileButton>
            )}
          </div>

          {emailSaveSuccess && (
            <div className="p-3 rounded-2xl bg-emerald-50 border-2 border-emerald-500 text-emerald-950 text-xs font-bold shadow-[0_2px_0_#10B981] flex items-center gap-2">
              <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
              <span>{emailSaveSuccess}</span>
            </div>
          )}

          {emailSaveError && (
            <div className="p-3 rounded-2xl bg-rose-50 border-2 border-rose-500 text-rose-950 text-xs font-bold shadow-[0_2px_0_#F43F5E] flex items-center gap-2">
              <ShieldAlert className="size-4 text-rose-600 shrink-0" />
              <span>{emailSaveError}</span>
            </div>
          )}

          {!isEditingEmail && recoveryEmail ? (
            <div className="p-3 rounded-2xl bg-cream border-2 border-choco-900 shadow-[0_2px_0_#3B2218] flex items-center justify-between gap-3 text-xs sm:text-sm">
              <div className="flex items-center gap-2 font-mono font-bold text-choco-900">
                <span className="text-choco-500">Email:</span>
                <span>{recoveryEmail}</span>
              </div>
              <span className="text-[11px] font-bold text-choco-500 hidden sm:inline">
                Siap menerima kode reset
              </span>
            </div>
          ) : (
            <form onSubmit={handleSaveEmail} className="space-y-3 pt-1">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
                <div className="relative flex-1">
                  <input
                    type="email"
                    value={emailDraft}
                    onChange={(e) => setEmailDraft(e.target.value)}
                    placeholder="contoh: kamu@gmail.com"
                    autoComplete="email"
                    className="w-full h-11 px-3.5 rounded-xl bg-white border-2 border-choco-900 text-base sm:text-sm font-bold text-choco-900 placeholder:text-choco-400 shadow-[0_2px_0_#3B2218] focus:border-candy-500 outline-none transition-all"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <TactileButton
                    variant="primary"
                    size="sm"
                    type="submit"
                    disabled={isSavingEmail || !emailDraft.trim() || !isValidRecoveryEmail(emailDraft).valid}
                    className="text-xs font-extrabold"
                  >
                    {isSavingEmail ? "Menyimpan..." : "Simpan Email"}
                  </TactileButton>
                  {isEditingEmail && recoveryEmail && (
                    <TactileButton
                      variant="ghost"
                      size="sm"
                      type="button"
                      onClick={() => {
                        setEmailDraft(recoveryEmail);
                        setIsEditingEmail(false);
                        setEmailSaveError(null);
                      }}
                      className="text-xs font-bold"
                    >
                      Batal
                    </TactileButton>
                  )}
                </div>
              </div>

              {emailDraft.trim() && !isValidRecoveryEmail(emailDraft).valid && (
                <p className="text-[11px] font-bold text-rose-600 flex items-start gap-1.5">
                  <ShieldAlert className="size-3.5 shrink-0 mt-px" />
                  <span>{isValidRecoveryEmail(emailDraft).reason}</span>
                </p>
              )}

              <p className="text-[11px] font-semibold text-choco-500 leading-relaxed">
                Domain yang diterima:{" "}
                <span className="font-mono font-bold text-choco-700">
                  {ALLOWED_EMAIL_DOMAINS.join(", ")}
                </span>
              </p>
            </form>
          )}
        </SurfaceCard>

        {/* Sesi Akun & Keamanan (Logout) */}
        <SurfaceCard variant="default" className="p-4 sm:p-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3.5">
            <div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="size-4 text-candy-500 shrink-0" />
                <h2 className="font-display font-bold text-sm sm:text-base text-ink-900">
                  Sesi Akun & Keamanan
                </h2>
              </div>
              <p className="text-xs font-medium text-ink-500 mt-1">
                Terhubung sebagai <span className="font-bold text-ink-900">@{username || "pelajar"}</span>. Progres dan saldo koinmu tersimpan di database Web3min.
              </p>
            </div>

            {!confirmLogout ? (
              <div className="flex items-center gap-2 self-start sm:self-auto shrink-0 flex-wrap">
                <TactileButton
                  variant="secondary"
                  size="sm"
                  onClick={() => void navigate({ to: "/masuk" })}
                  className="text-xs font-bold"
                  icon={<LogIn className="size-3.5 text-choco-700" />}
                >
                  Ganti Akun
                </TactileButton>
                <TactileButton
                  variant="secondary"
                  size="sm"
                  onClick={() => setConfirmLogout(true)}
                  className="text-ruby-shadow border-[#F4A4A0] hover:bg-[#FFF2F1] shadow-[0_3px_0_#F4A4A0]"
                  icon={<LogOut className="size-3.5 text-ruby-shadow" />}
                >
                  Keluar Akun
                </TactileButton>
              </div>
            ) : (
              <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
                <span className="text-xs font-extrabold text-ruby-shadow">
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
          </>
        )}
      </main>
    </AppShell>
  );
}
