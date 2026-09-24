import { useState, useMemo } from "react";
import { Link } from "@tanstack/react-router";
import { useProgress } from "@/lib/store";
import { UNITS, sequentialNodes, getLesson, getUnit } from "@/lib/curriculum";
import { PulauIcon } from "@/lib/pulau-icons";
import { generateBlockHash } from "@/lib/pulau-rantai";
import { leagueOf } from "@/lib/quests";
import { getWeekDays, getMonthWeeks } from "@/lib/activity-history";
import { ProgressBar } from "@/components/ui/progress-bar";
import { Fire } from "@/lib/kicon";
import {
  ChevronDown,
  Layers,
  Trophy,
  Copy,
  Check,
  RotateCcw,
  BookOpen,
  ArrowRight,
  X,
  Share2,
  ChevronLeft,
} from "lucide-react";

export function PulauRantaiProgres({
  onClose,
  standalone = false,
}: {
  onClose?: () => void;
  standalone?: boolean;
}) {
  const [mode, setMode] = useState<"w" | "m">("w");
  const [selectedUnitId, setSelectedUnitId] = useState<string | "all">("all");
  const [selectedCol, setSelectedCol] = useState<number>(() => new Date().getDay());
  const [showRouteSelector, setShowRouteSelector] = useState(false);
  const [showRekapModal, setShowRekapModal] = useState(false);
  const [copiedRekap, setCopiedRekap] = useState(false);
  const [copiedHash, setCopiedHash] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 2500);
  };

  // Store data
  const completed = useProgress((s) => s.completed);
  const streak = useProgress((s) => s.streak);
  const xp = useProgress((s) => s.xp);
  const xpToday = useProgress((s) => s.xpToday);
  const weeklyXp = useProgress((s) => s.weeklyXp);
  const lessonsToday = useProgress((s) => s.lessonsToday);
  const perfect = useProgress((s) => s.perfect);
  const username = useProgress((s) => s.username);
  const gems = useProgress((s) => s.gems);
  const hearts = useProgress((s) => s.hearts);
  const completedStories = useProgress((s) => s.completedStories);

  // Curriculum calculations
  const allSeqNodes = useMemo(() => sequentialNodes(), []);
  const selectedUnit = useMemo(
    () => (selectedUnitId === "all" ? null : UNITS.find((u) => u.id === selectedUnitId)),
    [selectedUnitId],
  );

  // Filtered nodes based on route selection
  const nodesInScope = useMemo(() => {
    if (!selectedUnit) return allSeqNodes;
    return selectedUnit.lessons.filter((l) => l.kind !== "chest");
  }, [selectedUnit, allSeqNodes]);

  const completedInScope = useMemo(
    () => nodesInScope.filter((node) => completed.includes(node.id)),
    [nodesInScope, completed],
  );

  const percentInScope = Math.round(
    (completedInScope.length / Math.max(1, nodesInScope.length)) * 100,
  );

  // Units completion tally
  const unitsCompletedCount = useMemo(() => {
    return UNITS.filter((u) => {
      const nonChest = u.lessons.filter((l) => l.kind !== "chest");
      return nonChest.length > 0 && nonChest.every((l) => completed.includes(l.id));
    }).length;
  }, [completed]);

  // Activity data
  const weekDays = useMemo(
    () => getWeekDays(new Date(), xpToday, weeklyXp, streak, lessonsToday),
    [xpToday, weeklyXp, streak, lessonsToday],
  );

  const monthWeeks = useMemo(
    () => getMonthWeeks(weeklyXp, xp, completed.length),
    [weeklyXp, xp, completed.length],
  );

  // League computation
  const league = useMemo(() => leagueOf(weeklyXp), [weeklyXp]);

  // Last completed block in current scope
  const lastCompletedLesson = useMemo(() => {
    for (let i = completed.length - 1; i >= 0; i--) {
      const id = completed[i];
      const match = nodesInScope.find((n) => n.id === id);
      if (match) {
        const u = getUnit(match.unitId) || UNITS[0];
        return { lesson: match, unit: u };
      }
    }
    return null;
  }, [completed, nodesInScope]);

  // First lesson in scope
  const firstLessonInScope = nodesInScope[0] || allSeqNodes[0];

  // Selected column data
  const activeColData = useMemo(() => {
    if (mode === "w") {
      const idx = Math.min(6, Math.max(0, selectedCol));
      return weekDays[idx] || weekDays[0];
    }
    const idx = Math.min(3, Math.max(0, selectedCol));
    return monthWeeks[idx] || monthWeeks[0];
  }, [mode, selectedCol, weekDays, monthWeeks]);

  const copyRekapText = () => {
    const text = `🏆 Rekap Penjelajah Web3min: @${username}
🧱 Blok Selesai: ${completed.length} / 128 Blok (${Math.round((completed.length / 128) * 100)}%)
⚡ Total XP: ${xp} XP · Minggu Ini: ${weeklyXp} XP
🔥 Streak: ${streak} Hari Rantai
⭐ Rute Tamat: ${unitsCompletedCount} / 20 Rute
🎖️ Liga: ${league.name}
Belajar Web3 interaktif: https://web3min.vercel.app`;

    navigator.clipboard?.writeText(text).then(() => {
      setCopiedRekap(true);
      showToast("Rangkuman disalin ke clipboard!");
      setTimeout(() => setCopiedRekap(false), 2000);
    });
  };

  const copyHash = (hash: string) => {
    navigator.clipboard?.writeText(hash).then(() => {
      setCopiedHash(true);
      showToast("Hash blok disalin!");
      setTimeout(() => setCopiedHash(false), 1800);
    });
  };

  return (
    <div className="relative w-full text-choco-900 font-sans pb-4 space-y-3.5 select-none">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 bg-choco-900 text-white px-4 py-2 rounded-full border-2 border-candy-500 text-xs font-bold shadow-[0_4px_12px_rgba(0,0,0,0.3)] animate-in fade-in slide-in-from-top-2">
          {toastMsg}
        </div>
      )}

      {/* Top Header Bar */}
      {onClose ? (
        <div className="flex items-center justify-between pt-1 pb-1">
          <button
            type="button"
            className="flex size-9 sm:size-10 items-center justify-center rounded-full border-2 border-choco-900 bg-candy-100 text-choco-900 shadow-[0_2px_0_#3B2218] transition-all hover:bg-candy-200 active:translate-y-0.5 cursor-pointer"
            onClick={onClose}
            aria-label="Tutup"
            title="Kembali"
          >
            <ChevronLeft className="size-5 stroke-[2.5]" />
          </button>
          <h2 className="font-pixel text-xl sm:text-2xl font-bold text-choco-900 tracking-tight">
            Progres Belajar
          </h2>
          <button
            type="button"
            className="flex size-9 sm:size-10 items-center justify-center rounded-full border-2 border-choco-900 bg-amber-200 text-choco-900 shadow-[0_2px_0_#3B2218] transition-all hover:bg-amber-300 hover:scale-105 active:translate-y-0.5 cursor-pointer"
            onClick={() => setShowRekapModal(true)}
            aria-label="Buka Rekap Penjelajah"
            title="Buka Rekap Penjelajah"
          >
            <BookOpen className="size-5 stroke-[2.5]" />
          </button>
        </div>
      ) : (
        <div className="flex items-center justify-between pt-0.5 pb-0.5">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-choco-600">
              Metrik Aktivitas Belajar
            </div>
            <h2 className="text-xl font-bold font-pixel text-choco-900 tracking-tight">
              Aktivitas & Catatan Rantai
            </h2>
          </div>
          <button
            type="button"
            onClick={() => setShowRekapModal(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-white hover:bg-candy-50 active:translate-y-0.5 border-2 border-choco-900 rounded-full shadow-[0_2px_0_#3B2218] text-xs font-bold text-choco-900 transition-all cursor-pointer"
            title="Buka Rekap Penjelajah"
          >
            <BookOpen className="size-4 text-candy-600 stroke-[2.5]" />
            <span>Rekap</span>
          </button>
        </div>
      )}

      {/* Route Filter Selector Bar */}
      <div className="flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={() => setShowRouteSelector(true)}
          className="flex-1 flex items-center justify-between gap-2 py-2 px-3.5 bg-white hover:bg-candy-50 border-2 border-choco-900 rounded-2xl shadow-[0_2px_0_#3B2218] transition-colors cursor-pointer"
          aria-label="Filter Rute Belajar"
        >
          <div className="flex items-center gap-2 truncate">
            <Layers className="size-4 text-candy-600 stroke-[2.5] shrink-0" />
            <span className="font-bold text-xs sm:text-sm text-choco-900 truncate">
              {selectedUnit
                ? `Rute ${selectedUnit.index}: ${selectedUnit.title}`
                : "Semua 20 Rute Pulau Rantai"}
            </span>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="text-[11px] font-bold font-sans tabular-nums text-candy-700 bg-candy-100 px-2 py-0.5 rounded-full border border-candy-300">
              {completedInScope.length}/{nodesInScope.length} Blok
            </span>
            <ChevronDown className="size-4 text-choco-600 stroke-[2.5]" />
          </div>
        </button>

        {selectedUnitId !== "all" && (
          <button
            type="button"
            onClick={() => {
              setSelectedUnitId("all");
              showToast("Filter direset ke semua 20 rute");
            }}
            className="p-2.5 bg-white hover:bg-candy-100 border-2 border-choco-900 rounded-2xl shadow-[0_2px_0_#3B2218] text-xs font-bold text-choco-700 transition-colors cursor-pointer active:translate-y-0.5"
            title="Reset ke Semua Rute"
          >
            <RotateCcw className="size-4 stroke-[2.5]" />
          </button>
        )}
      </div>

      {/* Main Stats Card with Interactive Chart */}
      <div className="bg-white border-2 border-choco-900 rounded-2xl p-4 sm:p-5 shadow-[0_4px_0_#3B2218] space-y-4">
        {/* Top Controls: Scope Title + Segmented Weekly/Monthly Toggle */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b-2 border-choco-900/10 pb-3">
          <div className="min-w-0">
            <div className="text-[10px] uppercase tracking-wider font-bold text-choco-500">
              Cakupan Pantauan
            </div>
            <div className="text-xs sm:text-sm font-bold text-choco-900">
              {selectedUnit ? selectedUnit.title : "Seluruh Pulau Rantai (20 Rute)"}
            </div>
          </div>

          <div className="self-start sm:self-auto flex items-center gap-1 bg-candy-50 border-2 border-choco-900 p-1 rounded-full shrink-0 shadow-[0_1px_0_#3B2218]">
            <button
              type="button"
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                mode === "w"
                  ? "bg-candy-500 text-white border-2 border-choco-900 shadow-[0_2px_0_#3B2218]"
                  : "text-choco-600 hover:text-choco-900"
              }`}
              onClick={() => {
                setMode("w");
                setSelectedCol(new Date().getDay());
              }}
            >
              Mingguan
            </button>
            <button
              type="button"
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                mode === "m"
                  ? "bg-candy-500 text-white border-2 border-choco-900 shadow-[0_2px_0_#3B2218]"
                  : "text-choco-600 hover:text-choco-900"
              }`}
              onClick={() => {
                setMode("m");
                setSelectedCol(0);
              }}
            >
              Bulanan
            </button>
          </div>
        </div>

        {/* ─────────────────────────────────────────────────────────────
            COHESIVE STAT PODS: Fixes false grouping of streak & remaining blocks
           ───────────────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Pod 1: Progres Blok */}
          <div className="p-3.5 bg-candy-50/50 rounded-2xl border-2 border-choco-900/20 flex flex-col justify-between">
            <div className="text-[11px] font-bold text-choco-600 uppercase tracking-wide">
              Progres Kurikulum
            </div>
            <div className="my-1.5 flex items-baseline gap-1.5">
              <span className="text-3xl font-black font-sans text-choco-900 tabular-nums">
                {completedInScope.length}
              </span>
              <span className="text-sm font-bold text-choco-600">
                / {nodesInScope.length} Blok
              </span>
            </div>
            <ProgressBar value={percentInScope} size="sm" className="my-1" />
            <div className="flex justify-between items-center text-[11px] font-bold text-choco-600 mt-1">
              <span>{percentInScope}% terselesaikan</span>
              <span>{nodesInScope.length - completedInScope.length} blok tersisa</span>
            </div>
          </div>

          {/* Pod 2: Streak Rantai */}
          <div className="p-3.5 bg-amber-50/50 rounded-2xl border-2 border-choco-900/20 flex flex-col justify-between">
            <div className="text-[11px] font-bold text-choco-600 uppercase tracking-wide">
              Hari Rantai Aktif
            </div>
            <div className="my-1.5 flex items-center gap-2">
              <span className="text-3xl font-black font-sans text-orange-600 tabular-nums flex items-center gap-1.5">
                <Fire className="size-7 text-orange-500 fill-orange-500 shrink-0" weight="fill" />
                {streak}
              </span>
              <span className="text-sm font-bold text-choco-600">
                Hari beruntun
              </span>
            </div>
            <div className="text-[11px] font-bold text-choco-600 mt-auto pt-2 border-t border-choco-900/10 flex items-center justify-between">
              <span>{streak > 0 ? "🔥 Rantai menyala!" : "Belum ada streak"}</span>
              <span className="text-candy-600 font-extrabold">Pertahankan besok</span>
            </div>
          </div>
        </div>

        {/* ─────────────────────────────────────────────────────────────
            INTERACTIVE ACTIVITY BAR CHART (Arcade Candy Style)
           ───────────────────────────────────────────────────────────── */}
        <div className="pt-2 border-t-2 border-choco-900/10">
          <div className="min-h-[210px] flex items-end justify-between gap-1 sm:gap-2 pt-3 pb-2">
            {mode === "w"
              ? weekDays.map((col, idx) => {
                  const isSelected = selectedCol === idx;
                  const unitVal = 10;
                  const brickCount =
                    col.xp > 0 ? Math.min(6, Math.max(1, Math.round(col.xp / unitVal))) : 0;
                  const dateNum = col.dateKey.split("-")[2] || "";

                  return (
                    <div
                      key={col.label}
                      onClick={() => setSelectedCol(idx)}
                      className="flex-1 flex flex-col justify-end items-center cursor-pointer group transition-transform"
                    >
                      {/* Floating Tooltip Indicator */}
                      <div className="h-6 flex items-center justify-center mb-1">
                        {isSelected && (
                          <div className="px-2 py-0.5 bg-choco-900 text-white text-[10px] sm:text-xs font-sans font-bold tabular-nums rounded-full border border-choco-900 shadow-[0_2px_0_rgba(0,0,0,0.15)] whitespace-nowrap animate-in fade-in zoom-in-95">
                            +{col.xp} XP
                          </div>
                        )}
                      </div>

                      {/* Stack of Bricks / Clean Column Track */}
                      <div
                        className={`w-full max-w-[42px] h-28 sm:h-32 flex flex-col-reverse justify-start gap-1 p-1 rounded-2xl border-2 transition-all ${
                          isSelected
                            ? "bg-candy-100/80 border-candy-500 shadow-[0_2px_0_#E8437F]"
                            : "bg-cream/60 border-choco-900/15 hover:bg-cream hover:border-choco-900/30"
                        }`}
                      >
                        {brickCount === 0 ? (
                          // Clean single empty state baseline (No 3-tier dashed clutter!)
                          <div className="h-5 sm:h-6 w-full rounded-lg border-2 border-dashed border-choco-900/20 flex items-center justify-center text-[10px] text-choco-400 font-sans font-bold tabular-nums">
                            0
                          </div>
                        ) : (
                          // Stack of candy bricks in cohesive Candy Pink
                          Array.from({ length: brickCount }).map((_, bIdx) => (
                            <div
                              key={bIdx}
                              className="h-5 sm:h-6 rounded-lg border-2 border-choco-900 bg-candy-500 shadow-[inset_0_1px_0_rgba(255,255,255,0.6),0_2px_0_#3B2218] transition-all group-hover:brightness-105"
                            />
                          ))
                        )}
                      </div>

                      {/* Day Label & Date (Clear Tabular Sans Font!) */}
                      <div className="mt-2 flex flex-col items-center justify-center gap-1 pointer-events-none">
                        <span
                          className={`text-xs font-bold leading-none ${
                            col.isToday
                              ? "text-white bg-candy-500 px-2 py-0.5 rounded-full border border-choco-900 shadow-[0_1px_0_#3B2218]"
                              : isSelected
                              ? "text-choco-900 font-extrabold underline decoration-candy-500 decoration-2 underline-offset-2"
                              : "text-choco-600"
                          }`}
                        >
                          {col.label}
                        </span>
                        <span className="text-xs font-sans font-bold tabular-nums text-choco-600 leading-none">
                          {dateNum}
                        </span>
                      </div>
                    </div>
                  );
                })
              : monthWeeks.map((col, idx) => {
                  const isSelected = selectedCol === idx;
                  const unitVal = 40;
                  const brickCount =
                    col.xp > 0 ? Math.min(6, Math.max(1, Math.round(col.xp / unitVal))) : 0;

                  return (
                    <div
                      key={col.label}
                      onClick={() => setSelectedCol(idx)}
                      className="flex-1 flex flex-col justify-end items-center cursor-pointer group transition-transform"
                    >
                      <div className="h-6 flex items-center justify-center mb-1">
                        {isSelected && (
                          <div className="px-2 py-0.5 bg-choco-900 text-white text-[10px] sm:text-xs font-sans font-bold tabular-nums rounded-full border border-choco-900 shadow-[0_2px_0_rgba(0,0,0,0.15)] whitespace-nowrap animate-in fade-in zoom-in-95">
                            +{col.xp} XP
                          </div>
                        )}
                      </div>

                      <div
                        className={`w-full max-w-[56px] h-28 sm:h-32 flex flex-col-reverse justify-start gap-1 p-1 rounded-2xl border-2 transition-all ${
                          isSelected
                            ? "bg-candy-100/80 border-candy-500 shadow-[0_2px_0_#E8437F]"
                            : "bg-cream/60 border-choco-900/15 hover:bg-cream hover:border-choco-900/30"
                        }`}
                      >
                        {brickCount === 0 ? (
                          <div className="h-6 w-full rounded-lg border-2 border-dashed border-choco-900/20 flex items-center justify-center text-[10px] text-choco-400 font-sans font-bold tabular-nums">
                            0
                          </div>
                        ) : (
                          Array.from({ length: brickCount }).map((_, bIdx) => (
                            <div
                              key={bIdx}
                              className="h-5 sm:h-6 rounded-lg border-2 border-choco-900 bg-candy-500 shadow-[inset_0_1px_0_rgba(255,255,255,0.6),0_2px_0_#3B2218]"
                            />
                          ))
                        )}
                      </div>

                      <div
                        className={`mt-2 text-xs font-bold ${
                          col.isCurrentWeek
                            ? "text-white bg-candy-500 px-2 py-0.5 rounded-full border border-choco-900 shadow-[0_1px_0_#3B2218]"
                            : isSelected
                            ? "text-choco-900 font-extrabold underline decoration-2 underline-offset-2"
                            : "text-choco-600"
                        }`}
                      >
                        {col.label}
                      </div>
                    </div>
                  );
                })}
          </div>

          {/* Interactive Day Inspector & Scale Note */}
          <div className="mt-3 pt-2.5 border-t border-choco-900/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2 font-bold text-choco-900 bg-candy-100 px-3 py-1.5 rounded-full border border-choco-900/20 shadow-[0_1px_0_#3B2218] self-start">
              <span className="size-2 rounded-full bg-candy-500 animate-pulse" />
              <span>
                {mode === "w"
                  ? `${(activeColData as any).fullLabel || "Hari"}: ${(activeColData as any).xp} XP ditambang`
                  : `${(activeColData as any).fullLabel}: ${(activeColData as any).xp} XP`}
              </span>
            </div>
            <div className="text-[11px] font-bold text-choco-600 sm:text-right">
              {mode === "w" ? "1 balok = 10 XP" : "1 balok = 40 XP"} · Ketuk kolom untuk cek
            </div>
          </div>
        </div>
      </div>

      {/* Connected League Card with Progress Bar */}
      <Link
        to="/leaderboard"
        className="block bg-amber-50 hover:bg-amber-100/70 border-2 border-choco-900 rounded-2xl p-4 shadow-[0_4px_0_#3B2218] space-y-2.5 transition-all active:translate-y-0.5 cursor-pointer"
      >
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="size-9 rounded-full border-2 border-choco-900 bg-amber-300 flex items-center justify-center shrink-0 shadow-[0_2px_0_#3B2218]">
              <Trophy className="size-4.5 text-choco-900 stroke-[2.5]" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-sm text-choco-900">{league.name}</span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-900 bg-amber-200 px-2 py-0.5 rounded-full border border-amber-400">
                  {league.id}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1 text-xs font-bold text-candy-600 bg-candy-100 hover:bg-candy-200 px-2.5 py-1 rounded-full border border-candy-300 shrink-0 transition-colors shadow-[0_1px_0_#3B2218]">
            <span>Klasemen</span>
            <ArrowRight className="size-3.5 stroke-[2.5]" />
          </div>
        </div>

        <div className="text-xs font-bold text-choco-600">
          {weeklyXp} XP minggu ini ·{" "}
          {league.next ? `${Math.max(0, league.next - weeklyXp)} XP menuju promosi` : "Kasta Tertinggi"}
        </div>

        {/* League Promotion Progress Bar */}
        {league.next && (
          <ProgressBar
            value={weeklyXp}
            max={league.next}
            size="xs"
          />
        )}
      </Link>

      {/* Living On-Chain Receipt (Struk Blok Terakhir) */}
      <div className="bg-white border-2 border-choco-900 rounded-2xl p-4 sm:p-5 shadow-[0_4px_0_#3B2218] space-y-3 relative overflow-hidden">
        {/* Receipt Header */}
        <div className="flex items-center justify-between border-b-2 border-dashed border-choco-900/20 pb-2.5">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-choco-500">
              Struk Blok Terakhir
            </span>
            {lastCompletedLesson && (
              <span className="size-2 rounded-full bg-emerald-500" title="Valid on-chain" />
            )}
          </div>
          <span className="text-xs font-sans font-bold tabular-nums text-candy-700 bg-candy-100 px-2.5 py-0.5 rounded-full border border-candy-300">
            {lastCompletedLesson
              ? `#U${String(lastCompletedLesson.unit.index).padStart(2, "0")}-${lastCompletedLesson.lesson.id.split("-l")[1] || "1"}`
              : "#BELUM-ADA"}
          </span>
        </div>

        {lastCompletedLesson ? (
          <>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-start gap-2">
                <span className="text-choco-500 font-bold shrink-0">Pelajaran</span>
                <span className="font-bold text-choco-900 text-right truncate">
                  {lastCompletedLesson.lesson.title}
                </span>
              </div>

              <div className="flex justify-between items-center gap-2">
                <span className="text-choco-500 font-bold shrink-0">Rute</span>
                <span className="font-bold text-choco-800 text-right truncate">
                  Rute {lastCompletedLesson.unit.index} · {lastCompletedLesson.unit.title}
                </span>
              </div>

              <div className="flex justify-between items-center gap-2">
                <span className="text-choco-500 font-bold shrink-0">Status Konsensus</span>
                <div className="flex items-center gap-1.5 font-bold text-emerald-700">
                  <div className="flex gap-1">
                    <span className="size-2 rounded-full bg-emerald-500" />
                    <span className="size-2 rounded-full bg-emerald-500" />
                    <span className="size-2 rounded-full bg-emerald-500" />
                  </div>
                  <span>Tervalidasi (3/3)</span>
                </div>
              </div>

              <div className="flex justify-between items-center gap-2 pt-1 border-t border-dashed border-choco-900/15">
                <span className="text-choco-500 font-bold shrink-0">Hash Blok</span>
                <div className="flex items-center gap-1.5">
                  <code className="font-mono text-choco-900 font-bold bg-cream px-2 py-0.5 rounded border border-choco-900/20 text-[11px]">
                    {generateBlockHash(lastCompletedLesson.lesson.id)}
                  </code>
                  <button
                    type="button"
                    onClick={() => copyHash(generateBlockHash(lastCompletedLesson.lesson.id))}
                    className="p-1 hover:bg-candy-100 rounded-full transition-colors text-choco-700 cursor-pointer"
                    title="Salin Hash"
                  >
                    {copiedHash ? (
                      <Check className="size-3.5 text-emerald-600 stroke-[3]" />
                    ) : (
                      <Copy className="size-3.5 stroke-[2.5]" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex justify-between items-center gap-2 pt-1 border-t border-dashed border-choco-900/15">
                <span className="text-choco-500 font-bold">Reward Didapat</span>
                <span className="font-bold font-sans tabular-nums text-candy-700 bg-candy-100 px-2.5 py-0.5 rounded-full border border-candy-300">
                  +{lastCompletedLesson.lesson.xp} XP · +{lastCompletedLesson.lesson.gems} Koin
                </span>
              </div>
            </div>

            {/* Direct Link to Review the Lesson */}
            <div className="pt-2">
              <Link
                to="/lesson/$lessonId"
                params={{ lessonId: lastCompletedLesson.lesson.id }}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-3 bg-candy-500 hover:bg-candy-600 active:translate-y-0.5 text-white font-bold text-xs rounded-xl border-2 border-choco-900 shadow-[0_2px_0_#3B2218] transition-all cursor-pointer"
              >
                <span>Ulangi Blok Ini</span>
                <ArrowRight className="size-3.5 stroke-[3]" />
              </Link>
            </div>
          </>
        ) : (
          <div className="py-4 text-center space-y-3">
            <div className="size-12 mx-auto rounded-full bg-candy-100 border-2 border-choco-900 flex items-center justify-center text-candy-600 shadow-[0_2px_0_#3B2218]">
              <BookOpen className="size-6 stroke-[2.5]" />
            </div>
            <div className="space-y-1">
              <div className="font-bold text-base text-choco-900">
                Belum Ada Blok Selesai di Rute Ini
              </div>
              <p className="text-xs text-choco-600 max-w-sm mx-auto leading-relaxed">
                Mulai materi pertama untuk menambang blok dan mencetak struk on-chain pertamamu!
              </p>
            </div>
            <div className="pt-1">
              <Link
                to="/lesson/$lessonId"
                params={{ lessonId: firstLessonInScope.id }}
                className="inline-flex items-center gap-2 py-2.5 px-5 bg-candy-500 hover:bg-candy-600 active:translate-y-0.5 text-white font-bold text-xs rounded-full border-2 border-choco-900 shadow-[0_2px_0_#3B2218] transition-all cursor-pointer"
              >
                <span>Mulai Belajar Sekarang</span>
                <ArrowRight className="size-4 stroke-[3]" />
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* ROUTE SELECTOR MODAL / SHEET */}
      {showRouteSelector && (
        <div className="fixed inset-0 z-50 bg-choco-900/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in">
          <div className="w-full max-w-lg bg-gradient-to-b from-white via-[#FFF9F5] to-[#FDEEE4] border-2 border-choco-900/20 rounded-t-3xl sm:rounded-3xl shadow-[0_10px_30px_-4px_rgba(59,34,24,0.35)] max-h-[85vh] flex flex-col overflow-hidden animate-in slide-in-from-bottom-4">
            {/* Modal Header */}
            <div className="p-4 border-b-2 border-choco-900/15 flex items-center justify-between bg-gradient-to-b from-[#FFF0F5] to-[#FFE4EC] shrink-0">
              <div className="flex items-center gap-2">
                <Layers className="size-5 text-candy-600 stroke-[2.5]" />
                <h3 className="font-display text-lg font-bold text-choco-900">Pilih Rute Belajar</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowRouteSelector(false)}
                className="p-1.5 hover:bg-white rounded-full border-2 border-choco-900/20 bg-white/80 text-choco-900 shadow-[0_1.5px_0_#3B2218] cursor-pointer"
              >
                <X className="size-4.5 stroke-[2.5]" />
              </button>
            </div>

            {/* Modal Content - Scrollable List */}
            <div className="p-3 sm:p-4 overflow-y-auto space-y-2 flex-1">
              {/* Option 1: Semua Rute */}
              <button
                type="button"
                onClick={() => {
                  setSelectedUnitId("all");
                  setShowRouteSelector(false);
                  showToast("Menampilkan seluruh 20 rute");
                }}
                className={`w-full text-left p-3.5 rounded-2xl border-2 border-choco-900 transition-all cursor-pointer ${
                  selectedUnitId === "all"
                    ? "bg-candy-100 shadow-[0_3px_0_#3B2218]"
                    : "bg-white hover:bg-candy-50/70 shadow-[0_2px_0_#3B2218]"
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-bold text-sm text-choco-900">
                    🌟 Seluruh Rute Pulau Rantai
                  </span>
                  <span className="text-xs font-sans font-bold tabular-nums text-candy-700 bg-candy-200 px-2.5 py-0.5 rounded-full border border-candy-300">
                    {completed.length}/128 Blok
                  </span>
                </div>
                <ProgressBar
                  value={completed.length}
                  max={128}
                  size="xs"
                />
              </button>

              <div className="text-[11px] font-bold uppercase tracking-wider text-choco-500 pt-2 px-1">
                Daftar 20 Rute Tematik
              </div>

              {/* 20 Units */}
              {UNITS.map((unit) => {
                const nonChest = unit.lessons.filter((l) => l.kind !== "chest");
                const doneInUnit = nonChest.filter((l) => completed.includes(l.id)).length;
                const isAllDone = doneInUnit === nonChest.length && nonChest.length > 0;
                const isSelected = selectedUnitId === unit.id;

                return (
                  <button
                    key={unit.id}
                    type="button"
                    onClick={() => {
                      setSelectedUnitId(unit.id);
                      setShowRouteSelector(false);
                      showToast(`Filter: Rute ${unit.index} (${unit.title})`);
                    }}
                    className={`w-full text-left p-3 rounded-2xl border-2 border-choco-900 transition-all cursor-pointer ${
                      isSelected
                        ? "bg-candy-100 shadow-[0_3px_0_#3B2218]"
                        : "bg-white hover:bg-candy-50/70 shadow-[0_2px_0_#3B2218]"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <div className="font-bold text-xs text-choco-900 truncate">
                        Rute {unit.index}: {unit.title}
                      </div>
                      <span
                        className={`text-[10px] font-sans font-bold tabular-nums px-2 py-0.5 rounded-full border ${
                          isAllDone
                            ? "bg-emerald-100 text-emerald-800 border-emerald-300"
                            : doneInUnit > 0
                            ? "bg-candy-100 text-candy-800 border-candy-300"
                            : "bg-gray-100 text-gray-600 border-gray-300"
                        }`}
                      >
                        {isAllDone ? "Selesai ✓" : `${doneInUnit}/${nonChest.length} Blok`}
                      </span>
                    </div>

                    <div className="w-full bg-cream rounded-full h-2 border border-choco-900/30 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          isAllDone ? "bg-emerald-500" : "bg-candy-500"
                        }`}
                        style={{
                          width: `${Math.round((doneInUnit / Math.max(1, nonChest.length)) * 100)}%`,
                        }}
                      />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* REKAP PENJELAJAH MODAL */}
      {showRekapModal && (
        <div className="fixed inset-0 z-50 bg-choco-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="w-full max-w-md bg-gradient-to-b from-white via-[#FFF9F5] to-[#FDEEE4] border-2 border-choco-900/20 rounded-3xl p-5 shadow-[0_10px_30px_-4px_rgba(59,34,24,0.35)] space-y-4 animate-in zoom-in-95">
            {/* Header */}
            <div className="flex items-center justify-between border-b-2 border-choco-900/15 pb-3">
              <div className="flex items-center gap-2">
                <BookOpen className="size-5 text-candy-600 stroke-[2.5]" />
                <h3 className="font-display text-xl font-bold text-choco-900">Rekap Penjelajah</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowRekapModal(false)}
                className="p-1.5 hover:bg-white rounded-full border-2 border-choco-900/20 bg-white/80 text-choco-900 shadow-[0_1.5px_0_#3B2218] cursor-pointer"
              >
                <X className="size-4.5 stroke-[2.5]" />
              </button>
            </div>

            {/* Profile Bar */}
            <div className="flex items-center justify-between bg-candy-100 border-2 border-choco-900 rounded-2xl p-3 shadow-[0_2px_0_#3B2218]">
              <div className="flex items-center gap-2.5">
                <div className="size-10 rounded-full bg-candy-500 border-2 border-choco-900 flex items-center justify-center font-bold text-white shadow-[0_1px_0_#3B2218]">
                  {username.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <div className="font-bold text-sm text-choco-900">@{username}</div>
                  <div className="text-xs font-bold text-candy-600">{league.name}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs font-bold text-choco-600">Nyawa</div>
                <div className="text-sm font-bold text-choco-900 font-sans tabular-nums">{hearts}/5 ❤️</div>
              </div>
            </div>

            {/* 4 Stats Grid */}
            <div className="grid grid-cols-2 gap-2.5">
              <div className="p-3 bg-white border-2 border-choco-900 rounded-xl shadow-[0_2px_0_#3B2218]">
                <div className="text-[11px] font-bold text-choco-500">Total Blok</div>
                <div className="text-xl font-black font-sans text-choco-900 tabular-nums">
                  {completed.length} <span className="text-xs text-choco-500 font-bold">/ 128</span>
                </div>
                <div className="text-[10px] text-choco-600 font-bold">
                  {Math.round((completed.length / 128) * 100)}% Kurikulum
                </div>
              </div>

              <div className="p-3 bg-white border-2 border-choco-900 rounded-xl shadow-[0_2px_0_#3B2218]">
                <div className="text-[11px] font-bold text-choco-500">Total XP</div>
                <div className="text-xl font-black font-sans text-candy-600 tabular-nums">
                  {xp}
                </div>
                <div className="text-[10px] text-choco-600 font-bold">
                  +{weeklyXp} minggu ini
                </div>
              </div>

              <div className="p-3 bg-white border-2 border-choco-900 rounded-xl shadow-[0_2px_0_#3B2218]">
                <div className="text-[11px] font-bold text-choco-500">Hari Rantai</div>
                <div className="text-xl font-black font-sans text-orange-600 tabular-nums flex items-center gap-1">
                  <Fire className="size-4.5 text-orange-500 fill-orange-500" weight="fill" />
                  {streak} <span className="text-xs text-choco-500 font-bold">Hari</span>
                </div>
                <div className="text-[10px] text-choco-600 font-bold">Streak aktif</div>
              </div>

              <div className="p-3 bg-white border-2 border-choco-900 rounded-xl shadow-[0_2px_0_#3B2218]">
                <div className="text-[11px] font-bold text-choco-500">Koin & Bintang</div>
                <div className="text-xl font-black font-sans text-emerald-600 tabular-nums">
                  {gems} ⌂
                </div>
                <div className="text-[10px] text-choco-600 font-bold">Saldo dompet</div>
              </div>
            </div>

            {/* Additional Metrics */}
            <div className="space-y-1.5 text-xs bg-white p-3 rounded-xl border-2 border-choco-900/20">
              <div className="flex justify-between">
                <span className="text-choco-600 font-bold">Rute Selesai Penuh:</span>
                <span className="font-bold text-choco-900 font-sans tabular-nums">{unitsCompletedCount} / 20 Rute</span>
              </div>
              <div className="flex justify-between">
                <span className="text-choco-600 font-bold">Pelajaran Sempurna:</span>
                <span className="font-bold text-choco-900 font-sans tabular-nums">{perfect.length} kali</span>
              </div>
              <div className="flex justify-between">
                <span className="text-choco-600 font-bold">Kisah Selesai:</span>
                <span className="font-bold text-choco-900 font-sans tabular-nums">{completedStories.length} kisah</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={copyRekapText}
                className="flex-1 py-2.5 px-3 bg-candy-500 hover:bg-candy-600 active:translate-y-0.5 text-white font-bold text-xs rounded-xl border-2 border-choco-900 shadow-[0_2px_0_#3B2218] flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                {copiedRekap ? (
                  <>
                    <Check className="size-4 stroke-[3]" />
                    <span>Tersalin!</span>
                  </>
                ) : (
                  <>
                    <Share2 className="size-4 stroke-[2.5]" />
                    <span>Salin Ringkasan</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => setShowRekapModal(false)}
                className="py-2.5 px-4 bg-white hover:bg-candy-50 active:translate-y-0.5 text-choco-900 font-bold text-xs rounded-xl border-2 border-choco-900 shadow-[0_2px_0_#3B2218] cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
