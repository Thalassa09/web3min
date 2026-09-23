import { useState, useMemo } from "react";
import { Link } from "@tanstack/react-router";
import { useProgress } from "@/lib/store";
import { UNITS, sequentialNodes, allPathNodes, getLesson, getUnit } from "@/lib/curriculum";
import { PulauIcon } from "@/lib/pulau-icons";
import { generateBlockHash } from "@/lib/pulau-rantai";
import { leagueOf } from "@/lib/quests";
import { getWeekDays, getMonthWeeks } from "@/lib/activity-history";
import { ProgressBar } from "@/components/ui/progress-bar";
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
  Sparkles,
  Flame,
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
    <div className="relative w-full max-w-2xl mx-auto text-ink-900 font-sans pb-8 space-y-3">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 bg-ink-900 text-cream px-4 py-2 rounded-full border-2 border-candy-500 text-xs font-bold shadow-[0_4px_12px_rgba(0,0,0,0.3)] animate-in fade-in slide-in-from-top-2">
          {toastMsg}
        </div>
      )}

      {/* Top Header Bar */}
      {onClose ? (
        <div className="flex items-center justify-between pt-1 pb-1">
          <button
            type="button"
            className="jb sm"
            onClick={onClose}
            aria-label="Tutup"
            title="Kembali"
          >
            <PulauIcon name="back" size={20} />
          </button>
          <div className="ph text-2xl font-black text-ink-900 tracking-tight">
            Progres Belajar
          </div>
          <button
            type="button"
            className="jb sm coin hover:scale-105 transition-transform"
            onClick={() => setShowRekapModal(true)}
            aria-label="Buka Rekap Penjelajah"
            title="Buka Rekap Penjelajah"
          >
            <BookOpen className="size-5 text-ink-900 stroke-[2.5]" />
          </button>
        </div>
      ) : (
        <div className="flex items-center justify-between pt-0.5 pb-0.5">
          <div>
            <div className="text-[10px] font-black uppercase tracking-wider text-ink-500">
              Metrik Aktivitas Belajar
            </div>
            <h2 className="text-xl font-black font-display text-ink-900 tracking-tight">
              Aktivitas & Catatan Rantai
            </h2>
          </div>
          <button
            type="button"
            onClick={() => setShowRekapModal(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-white hover:bg-candy-50 active:translate-y-0.5 border-2 border-ink-900 rounded-full shadow-[2px_2px_0_#2B1622] text-xs font-black text-ink-900 transition-all cursor-pointer"
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
          className="sel flex-1 flex items-center justify-between gap-2 py-2 px-3.5 bg-white hover:bg-candy-50 border-2 border-ink-900 rounded-xl shadow-[2px_2px_0_#2B1622] transition-colors cursor-pointer"
          aria-label="Filter Rute Belajar"
        >
          <div className="flex items-center gap-2 truncate">
            <Layers className="size-4 text-candy-600 stroke-[2.5] flex-shrink-0" />
            <span className="font-extrabold text-xs text-ink-900 truncate">
              {selectedUnit
                ? `Rute ${selectedUnit.index}: ${selectedUnit.title}`
                : "Semua 20 Rute Pulau Rantai"}
            </span>
          </div>
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <span className="text-[11px] font-bold font-mono text-candy-700 bg-candy-100 px-2 py-0.5 rounded-full border border-candy-300">
              {completedInScope.length}/{nodesInScope.length} Blok
            </span>
            <ChevronDown className="size-4 text-ink-600 stroke-[2.5]" />
          </div>
        </button>

        {selectedUnitId !== "all" && (
          <button
            type="button"
            onClick={() => {
              setSelectedUnitId("all");
              showToast("Filter direset ke semua 20 rute");
            }}
            className="p-2 bg-white hover:bg-ruby-50 border-2 border-ink-900 rounded-xl shadow-[2px_2px_0_#2B1622] text-xs font-bold text-ink-700 transition-colors cursor-pointer"
            title="Reset ke Semua Rute"
          >
            <RotateCcw className="size-4 stroke-[2.5]" />
          </button>
        )}
      </div>

      {/* Main Stats Card with Interactive Chart */}
      <div className="card bg-paper border-2 border-ink-900 rounded-2xl p-4 sm:p-5 shadow-[4px_4px_0_#2B1622]">
        {/* Top Controls: Scope Title + Segmented Weekly/Monthly Toggle */}
        <div className="flex items-center justify-between gap-2 border-b border-ink-900/10 pb-2.5">
          <div className="truncate">
            <div className="text-[10px] uppercase tracking-wider font-extrabold text-ink-500">
              Cakupan Pantauan
            </div>
            <div className="text-xs font-black text-ink-900 truncate">
              {selectedUnit ? selectedUnit.title : "Seluruh Pulau Rantai (20 Rute)"}
            </div>
          </div>

          <div className="seg flex-shrink-0">
            <button
              type="button"
              className={mode === "w" ? "on" : ""}
              onClick={() => {
                setMode("w");
                setSelectedCol(new Date().getDay());
              }}
            >
              Mingguan
            </button>
            <button
              type="button"
              className={mode === "m" ? "on" : ""}
              onClick={() => {
                setMode("m");
                setSelectedCol(0);
              }}
            >
              Bulanan
            </button>
          </div>
        </div>

        {/* Big Numbers & Scope Progress Bar */}
        <div className="pt-2.5">
          <div className="big flex items-baseline justify-between mb-2">
            <div>
              <b className="text-3xl sm:text-4xl font-black font-display text-ink-900">
                {completedInScope.length}
              </b>
              <span className="text-xs sm:text-sm font-bold text-ink-600">
                /{nodesInScope.length} Blok
              </span>
            </div>
            <div className="text-right">
              <b className="text-3xl sm:text-4xl font-black font-display text-candy-600">
                {streak}
              </b>
              <span className="text-xs sm:text-sm font-bold text-ink-600">
                Hari rantai
              </span>
            </div>
          </div>

          {/* Scope Completion Bar */}
          <ProgressBar
            value={percentInScope}
            size="xs"
          />
          <div className="flex justify-between items-center text-[11px] font-bold text-ink-500 mt-1">
            <span>{percentInScope}% terselesaikan</span>
            <span>{nodesInScope.length - completedInScope.length} blok tersisa</span>
          </div>
        </div>

        {/* Interactive Bar Chart Bricks with Full Ghost Grid */}
        <div className="mt-3 pt-2 border-t border-ink-900/10">
          <div className="bars h-40 sm:h-44 flex items-end gap-1.5 sm:gap-2 pt-4">
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
                      className={`col flex-1 flex flex-col justify-end items-center cursor-pointer group transition-transform ${
                        col.isToday ? "today" : ""
                      }`}
                    >
                      {/* Floating Tooltip Indicator */}
                      {isSelected && (
                        <div className="val mb-1 px-2 py-0.5 bg-ink-900 text-cream text-[10px] sm:text-xs font-mono font-bold rounded-md shadow-sm whitespace-nowrap animate-in fade-in zoom-in-90">
                          +{col.xp} XP
                        </div>
                      )}

                      {/* Stack of Bricks / Ghost Slots */}
                      <div
                        className={`w-full max-w-[38px] flex flex-col-reverse gap-1 p-1 rounded-xl transition-all ${
                          isSelected
                            ? "bg-candy-100/90 ring-2 ring-candy-500 shadow-xs"
                            : "hover:bg-sand-100"
                        }`}
                      >
                        {brickCount === 0 ? (
                          // Render 3 ghost slots so the chart feels structured & tangible even at 0 XP
                          <div className="flex flex-col-reverse gap-1 w-full">
                            <div className="h-5 sm:h-6 border-2 border-dashed border-ink-900/20 rounded-md flex items-center justify-center text-[10px] text-ink-400 font-mono font-bold">
                              0
                            </div>
                            <div className="h-5 sm:h-6 border border-dashed border-ink-900/10 rounded-md" />
                            <div className="h-5 sm:h-6 border border-dashed border-ink-900/5 rounded-md" />
                          </div>
                        ) : (
                          Array.from({ length: brickCount }).map((_, bIdx) => (
                            <div
                              key={bIdx}
                              className={`h-5 sm:h-6 rounded-md border-2 border-ink-900 shadow-[inset_0_2px_0_rgba(255,255,255,0.4)] ${
                                bIdx % 2 === 0 ? "bg-candy-500" : "bg-purple-600"
                              } transition-all duration-200 group-hover:brightness-105`}
                            />
                          ))
                        )}
                      </div>

                      {/* Day Label & Date */}
                      <div className="mt-2 flex flex-col items-center justify-center gap-0.5 pointer-events-none">
                        <span
                          className={`text-[11px] sm:text-xs font-black leading-none ${
                            col.isToday
                              ? "text-white bg-candy-500 px-1.5 py-0.5 rounded-full shadow-xs"
                              : isSelected
                              ? "text-ink-900 font-extrabold underline decoration-candy-500 decoration-2 underline-offset-2"
                              : "text-ink-600"
                          }`}
                        >
                          {col.label}
                        </span>
                        <span className="text-[10px] font-mono font-semibold text-ink-400">
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
                      className={`col flex-1 flex flex-col justify-end items-center cursor-pointer group transition-transform ${
                        col.isCurrentWeek ? "today" : ""
                      }`}
                    >
                      {isSelected && (
                        <div className="val mb-1 px-2 py-0.5 bg-ink-900 text-cream text-[10px] sm:text-xs font-mono font-bold rounded-md shadow-sm whitespace-nowrap animate-in fade-in zoom-in-90">
                          +{col.xp} XP
                        </div>
                      )}

                      <div
                        className={`w-full max-w-[48px] flex flex-col-reverse gap-1 p-1 rounded-xl transition-all ${
                          isSelected
                            ? "bg-candy-100/90 ring-2 ring-candy-500 shadow-xs"
                            : "hover:bg-sand-100"
                        }`}
                      >
                        {brickCount === 0 ? (
                          <div className="flex flex-col-reverse gap-1 w-full">
                            <div className="h-6 border-2 border-dashed border-ink-900/20 rounded-md flex items-center justify-center text-[10px] text-ink-400 font-mono font-bold">
                              0
                            </div>
                            <div className="h-6 border border-dashed border-ink-900/10 rounded-md" />
                          </div>
                        ) : (
                          Array.from({ length: brickCount }).map((_, bIdx) => (
                            <div
                              key={bIdx}
                              className={`h-5 sm:h-6 rounded-md border-2 border-ink-900 shadow-[inset_0_2px_0_rgba(255,255,255,0.4)] ${
                                bIdx % 2 === 0 ? "bg-candy-500" : "bg-purple-600"
                              }`}
                            />
                          ))
                        )}
                      </div>

                      <div
                        className={`mt-1.5 text-xs font-black ${
                          col.isCurrentWeek
                            ? "text-white bg-candy-500 px-2 py-0.5 rounded-full"
                            : isSelected
                            ? "text-ink-900 underline decoration-2 underline-offset-2"
                            : "text-ink-600"
                        }`}
                      >
                        {col.label}
                      </div>
                    </div>
                  );
                })}
          </div>

          {/* Interactive Day Inspector & Scale Note */}
          <div className="mt-2.5 pt-2 border-t border-ink-900/10 flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-1.5 font-black text-ink-800 bg-sand-100 px-2.5 py-1 rounded-lg border border-ink-900/15">
              <span className="size-2 rounded-full bg-candy-500 animate-pulse" />
              <span>
                {mode === "w"
                  ? `${(activeColData as any).fullLabel || "Hari"}: ${(activeColData as any).xp} XP ditambang`
                  : `${(activeColData as any).fullLabel}: ${(activeColData as any).xp} XP`}
              </span>
            </div>
            <div className="text-[11px] font-bold text-ink-500">
              {mode === "w" ? "1 kotak = 10 XP" : "1 kotak = 40 XP"} · Ketuk kolom untuk cek
            </div>
          </div>
        </div>
      </div>

      {/* Connected League Card with Progress Bar */}
      <Link
        to="/leaderboard"
        className="card lg bg-paper hover:bg-candy-50/50 border-2 border-ink-900 rounded-2xl p-3.5 sm:p-4 shadow-[4px_4px_0_#2B1622] flex flex-col gap-2.5 transition-all hover:translate-y-[-1px] active:translate-y-0.5 block cursor-pointer"
      >
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="size-10 rounded-full border-2 border-ink-900 bg-amber-100 flex items-center justify-center flex-shrink-0 shadow-xs">
              <Trophy className="size-5 text-amber-600 stroke-[2.5]" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <b className="font-extrabold text-sm text-ink-900 truncate">{league.name}</b>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 bg-amber-100 px-2 py-0.2 rounded-full border border-amber-300">
                  {league.id}
                </span>
              </div>
              <small className="text-xs font-semibold text-ink-600 block truncate">
                {weeklyXp} XP minggu ini ·{" "}
                {league.next ? `${Math.max(0, league.next - weeklyXp)} XP menuju promosi` : "Kasta Tertinggi"}
              </small>
            </div>
          </div>

          <div className="flex items-center gap-1 text-xs font-black text-candy-700 bg-candy-100 hover:bg-candy-200 px-3 py-1.5 rounded-full border border-candy-300 flex-shrink-0 transition-colors">
            <span>Klasemen</span>
            <PulauIcon name="chev" size={14} />
          </div>
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
      <div className="card bg-paper border-2 border-ink-900 rounded-2xl p-4 sm:p-5 shadow-[4px_4px_0_#2B1622] space-y-3 relative overflow-hidden">
        {/* Receipt Header */}
        <div className="flex items-center justify-between border-b-2 border-dashed border-ink-900/20 pb-2.5">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-black uppercase tracking-wider text-ink-500">
              Struk Blok Terakhir
            </span>
            {lastCompletedLesson && (
              <span className="size-2 rounded-full bg-emerald-500" title="Valid on-chain" />
            )}
          </div>
          <span className="text-xs font-mono font-black text-candy-700 bg-candy-100 px-2.5 py-0.5 rounded-full border border-candy-300">
            {lastCompletedLesson
              ? `#U${String(lastCompletedLesson.unit.index).padStart(2, "0")}-${lastCompletedLesson.lesson.id.split("-l")[1] || "1"}`
              : "#BELUM-ADA"}
          </span>
        </div>

        {lastCompletedLesson ? (
          <>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-start gap-2">
                <span className="text-ink-500 font-semibold flex-shrink-0">Pelajaran</span>
                <span className="font-black text-ink-900 text-right truncate">
                  {lastCompletedLesson.lesson.title}
                </span>
              </div>

              <div className="flex justify-between items-center gap-2">
                <span className="text-ink-500 font-semibold flex-shrink-0">Rute</span>
                <span className="font-bold text-ink-800 text-right truncate">
                  Rute {lastCompletedLesson.unit.index} · {lastCompletedLesson.unit.title}
                </span>
              </div>

              <div className="flex justify-between items-center gap-2">
                <span className="text-ink-500 font-semibold flex-shrink-0">Status Konsensus</span>
                <div className="flex items-center gap-1.5 font-bold text-emerald-700">
                  <div className="conf flex gap-1">
                    <i className="bg-emerald-500" />
                    <i className="bg-emerald-500" />
                    <i className="bg-emerald-500" />
                  </div>
                  <span>Tervalidasi (3/3)</span>
                </div>
              </div>

              <div className="flex justify-between items-center gap-2 pt-1 border-t border-dashed border-ink-900/15">
                <span className="text-ink-500 font-semibold flex-shrink-0">Hash Blok</span>
                <div className="flex items-center gap-1.5">
                  <code className="font-mono text-ink-800 font-bold bg-sand-100 px-1.5 py-0.5 rounded border border-ink-900/15">
                    {generateBlockHash(lastCompletedLesson.lesson.id)}
                  </code>
                  <button
                    type="button"
                    onClick={() => copyHash(generateBlockHash(lastCompletedLesson.lesson.id))}
                    className="p-1 hover:bg-candy-100 rounded transition-colors text-ink-700 cursor-pointer"
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

              <div className="flex justify-between items-center gap-2 pt-1 border-t border-dashed border-ink-900/15">
                <span className="text-ink-500 font-semibold">Reward Didapat</span>
                <span className="font-black text-candy-700 bg-candy-100 px-2 py-0.5 rounded-md border border-candy-300">
                  +{lastCompletedLesson.lesson.xp} XP · +{lastCompletedLesson.lesson.gems} Koin
                </span>
              </div>
            </div>

            {/* Direct Link to Review the Lesson */}
            <div className="pt-2">
              <Link
                to="/lesson/$lessonId"
                params={{ lessonId: lastCompletedLesson.lesson.id }}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-3 bg-candy-500 hover:bg-candy-600 active:translate-y-0.5 text-white font-extrabold text-xs rounded-xl border-2 border-ink-900 shadow-[2px_2px_0_#2B1622] transition-all cursor-pointer"
              >
                <span>Ulangi Blok Ini</span>
                <ArrowRight className="size-3.5 stroke-[3]" />
              </Link>
            </div>
          </>
        ) : (
          <div className="py-4 text-center space-y-3">
            <div className="size-12 mx-auto rounded-full bg-candy-100 border-2 border-ink-900 flex items-center justify-center text-candy-600 shadow-xs">
              <BookOpen className="size-6 stroke-[2.5]" />
            </div>
            <div className="space-y-1">
              <div className="font-black text-base text-ink-900">
                Belum Ada Blok Selesai di Rute Ini
              </div>
              <p className="text-xs text-ink-600 max-w-sm mx-auto leading-relaxed">
                Mulai materi pertama untuk menambang blok dan mencetak struk on-chain pertamamu!
              </p>
            </div>
            <div className="pt-1">
              <Link
                to="/lesson/$lessonId"
                params={{ lessonId: firstLessonInScope.id }}
                className="inline-flex items-center gap-2 py-2.5 px-5 bg-candy-500 hover:bg-candy-600 active:translate-y-0.5 text-white font-black text-xs rounded-full border-2 border-ink-900 shadow-[3px_3px_0_#2B1622] transition-all cursor-pointer"
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
        <div className="fixed inset-0 z-50 bg-ink-900/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in">
          <div className="w-full max-w-lg bg-paper border-t-2 sm:border-2 border-ink-900 rounded-t-3xl sm:rounded-3xl shadow-[0_-8px_30px_rgba(0,0,0,0.3)] max-h-[85vh] flex flex-col overflow-hidden animate-in slide-in-from-bottom-4">
            {/* Modal Header */}
            <div className="p-4 border-b-2 border-ink-900 flex items-center justify-between bg-sand-100 flex-shrink-0">
              <div className="flex items-center gap-2">
                <Layers className="size-5 text-candy-600 stroke-[2.5]" />
                <h3 className="font-black text-base text-ink-900">Pilih Rute Belajar</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowRouteSelector(false)}
                className="p-1.5 hover:bg-sand-200 rounded-full border border-ink-900/20 text-ink-700 cursor-pointer"
              >
                <X className="size-5 stroke-[2.5]" />
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
                className={`w-full text-left p-3 rounded-2xl border-2 border-ink-900 transition-all cursor-pointer ${
                  selectedUnitId === "all"
                    ? "bg-candy-100 shadow-[3px_3px_0_#2B1622]"
                    : "bg-white hover:bg-sand-100 shadow-[2px_2px_0_#2B1622]"
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-black text-sm text-ink-900">
                    🌟 Seluruh Rute Pulau Rantai
                  </span>
                  <span className="text-xs font-mono font-extrabold text-candy-700 bg-candy-200 px-2 py-0.5 rounded-full border border-candy-300">
                    {completed.length}/128 Blok
                  </span>
                </div>
                <ProgressBar
                  value={completed.length}
                  max={128}
                  size="xs"
                />
              </button>

              <div className="text-[11px] font-black uppercase tracking-wider text-ink-500 pt-2 px-1">
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
                    className={`w-full text-left p-3 rounded-xl border-2 border-ink-900 transition-all cursor-pointer ${
                      isSelected
                        ? "bg-candy-100 shadow-[3px_3px_0_#2B1622]"
                        : "bg-white hover:bg-sand-100 shadow-[2px_2px_0_#2B1622]"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <div className="font-extrabold text-xs text-ink-900 truncate">
                        Rute {unit.index}: {unit.title}
                      </div>
                      <span
                        className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${
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

                    <div className="w-full bg-line rounded-full h-1.5 border border-ink-900 overflow-hidden">
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
        <div className="fixed inset-0 z-50 bg-ink-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="w-full max-w-md bg-paper border-2 border-ink-900 rounded-3xl p-5 shadow-[6px_6px_0_#2B1622] space-y-4 animate-in zoom-in-95">
            {/* Header */}
            <div className="flex items-center justify-between border-b-2 border-ink-900 pb-3">
              <div className="flex items-center gap-2">
                <BookOpen className="size-5 text-candy-600 stroke-[2.5]" />
                <h3 className="font-black text-lg text-ink-900">Rekap Penjelajah</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowRekapModal(false)}
                className="p-1 hover:bg-sand-200 rounded-full border border-ink-900/20 text-ink-700 cursor-pointer"
              >
                <X className="size-5 stroke-[2.5]" />
              </button>
            </div>

            {/* Profile Bar */}
            <div className="flex items-center justify-between bg-candy-100 border-2 border-ink-900 rounded-2xl p-3 shadow-[2px_2px_0_#2B1622]">
              <div className="flex items-center gap-2.5">
                <div className="size-10 rounded-full bg-candy-500 border-2 border-ink-900 flex items-center justify-center font-black text-white">
                  {username.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <div className="font-black text-sm text-ink-900">@{username}</div>
                  <div className="text-xs font-semibold text-candy-800">{league.name}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs font-mono font-bold text-ink-600">Oksigen</div>
                <div className="text-sm font-black text-ink-900">{hearts}/5 ❤️</div>
              </div>
            </div>

            {/* 4 Stats Grid */}
            <div className="grid grid-cols-2 gap-2.5">
              <div className="p-3 bg-white border-2 border-ink-900 rounded-xl shadow-[2px_2px_0_#2B1622]">
                <div className="text-[11px] font-bold text-ink-500">Total Blok</div>
                <div className="text-xl font-black font-display text-ink-900">
                  {completed.length}
                  <span className="text-xs text-ink-500 font-sans">/128</span>
                </div>
                <div className="text-[10px] text-ink-600 font-bold">
                  {Math.round((completed.length / 128) * 100)}% Kurikulum
                </div>
              </div>

              <div className="p-3 bg-white border-2 border-ink-900 rounded-xl shadow-[2px_2px_0_#2B1622]">
                <div className="text-[11px] font-bold text-ink-500">Total XP</div>
                <div className="text-xl font-black font-display text-candy-600">
                  {xp}
                </div>
                <div className="text-[10px] text-ink-600 font-bold">
                  +{weeklyXp} minggu ini
                </div>
              </div>

              <div className="p-3 bg-white border-2 border-ink-900 rounded-xl shadow-[2px_2px_0_#2B1622]">
                <div className="text-[11px] font-bold text-ink-500">Hari Rantai</div>
                <div className="text-xl font-black font-display text-amber-500">
                  {streak} <span className="text-xs text-ink-500 font-sans">Hari</span>
                </div>
                <div className="text-[10px] text-ink-600 font-bold">Streak aktif</div>
              </div>

              <div className="p-3 bg-white border-2 border-ink-900 rounded-xl shadow-[2px_2px_0_#2B1622]">
                <div className="text-[11px] font-bold text-ink-500">Koin & Permata</div>
                <div className="text-xl font-black font-display text-emerald-600">
                  {gems} 🪙
                </div>
                <div className="text-[10px] text-ink-600 font-bold">Saldo dompet</div>
              </div>
            </div>

            {/* Additional Metrics */}
            <div className="space-y-1.5 text-xs bg-sand-100 p-3 rounded-xl border border-ink-900/20">
              <div className="flex justify-between">
                <span className="text-ink-600 font-semibold">Rute Selesai Penuh:</span>
                <span className="font-black text-ink-900">{unitsCompletedCount} / 20 Rute</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-600 font-semibold">Pelajaran Sempurna:</span>
                <span className="font-black text-ink-900">{perfect.length} kali</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-600 font-semibold">Kisah Selesai:</span>
                <span className="font-black text-ink-900">{completedStories.length} kisah</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={copyRekapText}
                className="flex-1 py-2.5 px-3 bg-candy-500 hover:bg-candy-600 active:translate-y-0.5 text-white font-black text-xs rounded-xl border-2 border-ink-900 shadow-[2px_2px_0_#2B1622] flex items-center justify-center gap-1.5 transition-all cursor-pointer"
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
                className="py-2.5 px-4 bg-white hover:bg-sand-200 active:translate-y-0.5 text-ink-900 font-bold text-xs rounded-xl border-2 border-ink-900 shadow-[2px_2px_0_#2B1622] cursor-pointer"
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
