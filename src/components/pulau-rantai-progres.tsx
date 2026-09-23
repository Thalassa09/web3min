import { useState, useMemo } from "react";
import { useProgress } from "@/lib/store";
import { UNITS, sequentialNodes } from "@/lib/curriculum";
import { PulauIcon, BlobiPixel } from "@/lib/pulau-icons";
import { generateBlockHash } from "@/lib/pulau-rantai";

export function PulauRantaiProgres({
  onClose,
  standalone = false,
}: {
  onClose?: () => void;
  standalone?: boolean;
}) {
  const [mode, setMode] = useState<"w" | "m">("w");
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const completed = useProgress((s) => s.completed);
  const streak = useProgress((s) => s.streak);
  const xp = useProgress((s) => s.xp);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 2400);
  };

  const allNodes = useMemo(() => sequentialNodes(), []);
  const completedNodes = useMemo(
    () => allNodes.filter((n) => completed.includes(n.id)),
    [allNodes, completed]
  );

  const lastCompleted = completedNodes[completedNodes.length - 1] ?? null;
  const lastLessonNo = lastCompleted
    ? allNodes.findIndex((n) => n.id === lastCompleted.id) + 1
    : 1;
  const lastLessonTitle = lastCompleted ? lastCompleted.title : "Dasar Web3";
  const lastHash = useMemo(
    () => generateBlockHash(lastCompleted?.id || "u1-l1"),
    [lastCompleted]
  );

  // Dynamic Chart Values based on user stats
  const chartData = useMemo(() => {
    const weeklyValues = [30, 20, 40, 50, Math.max(30, xp % 80 || 60), 40, 20];
    const monthlyValues = [120, 160, 80, Math.max(100, xp || 200)];

    return {
      w: {
        labels: ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"],
        values: weeklyValues,
        unit: 10,
        blocks: Math.max(completed.length, 26),
        days: Math.max(streak, 7),
        todayIndex: 4,
      },
      m: {
        labels: ["Mg 1", "Mg 2", "Mg 3", "Mg 4"],
        values: monthlyValues,
        unit: 40,
        blocks: Math.max(completed.length, 56),
        days: Math.max(streak, 12),
        todayIndex: 3,
      },
    };
  }, [completed.length, streak, xp]);

  const currentConfig = chartData[mode];

  return (
    <div className="relative w-full max-w-md mx-auto text-ink-900 font-sans pb-10">
      {/* Toast Notice */}
      <div
        className={`toast fixed left-1/2 -translate-x-1/2 bottom-20 z-50 bg-ink-900 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 pointer-events-none ${
          toastMsg ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
        }`}
      >
        {toastMsg}
      </div>

      {/* Top Bar if standalone modal */}
      <div className="top3 flex items-center justify-between px-4 pt-4 pb-2">
        {onClose ? (
          <button
            type="button"
            className="jb"
            onClick={onClose}
            aria-label="Kembali"
          >
            <PulauIcon name="back" size={20} />
          </button>
        ) : (
          <div className="w-10" />
        )}
        <span className="tchip font-bold text-xs uppercase tracking-wider">
          Analitik
        </span>
        <button
          type="button"
          className="jb coin"
          onClick={() => showToast("Rekap bulanan dikirim tiap tanggal 1")}
          aria-label="Rekap"
        >
          <PulauIcon name="chart" size={20} />
        </button>
      </div>

      <div className="px-4 space-y-4 mt-2">
        {/* Title & Filter */}
        <div className="flex items-center justify-between">
          <h1 className="ph text-2xl font-black font-display tracking-tight text-ink-900">
            Progres
          </h1>
          <button
            type="button"
            className="sel"
            onClick={() => showToast("Filter: semua 20 rute")}
          >
            <span>Semua rute</span>
            <PulauIcon name="down" size={14} />
          </button>
        </div>

        {/* Chart Card */}
        <div className="card bg-white border-2 border-ink-900 rounded-[24px] p-4 shadow-[4px_4px_0_#0D2340]">
          <div className="flex items-center justify-between mb-2">
            <span className="jb sm coin">
              <PulauIcon name="chart" size={18} />
            </span>
            <div
              className="seg flex p-1 bg-[#EDE4F2] border-2 border-ink-900 rounded-full"
              role="group"
              aria-label="Rentang waktu"
            >
              <button
                type="button"
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                  mode === "w"
                    ? "bg-blobi text-white shadow-xs"
                    : "text-ink-500 hover:text-ink-900"
                }`}
                onClick={() => setMode("w")}
              >
                Mingguan
              </button>
              <button
                type="button"
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                  mode === "m"
                    ? "bg-blobi text-white shadow-xs"
                    : "text-ink-500 hover:text-ink-900"
                }`}
                onClick={() => setMode("m")}
              >
                Bulanan
              </button>
            </div>
          </div>

          <div className="big flex items-center justify-between my-3 text-ink-500 font-bold">
            <div>
              <b className="sb text-3xl font-black font-display text-ink-900 mr-1.5">
                {currentConfig.blocks}
              </b>
              <span className="text-sm">Blok</span>
            </div>
            <div>
              <b className="sd text-3xl font-black font-display text-ink-900 mr-1.5">
                {currentConfig.days}
              </b>
              <span className="text-sm">Hari rantai</span>
            </div>
          </div>

          {/* Visual Stacked Blocks Chart */}
          <div
            className="bars flex items-end justify-between gap-2 h-48 mt-4 pt-2"
            role="img"
            aria-label="Grafik XP"
          >
            {currentConfig.values.map((v, idx) => {
              const count = Math.max(1, Math.round(v / currentConfig.unit));
              const isToday = idx === currentConfig.todayIndex;
              return (
                <div
                  key={`${mode}-${idx}`}
                  className={`col flex-1 flex flex-col justify-end items-center h-full ${
                    isToday ? "today font-black" : ""
                  }`}
                >
                  {isToday && (
                    <span className="val mb-1.5 px-1.5 py-0.5 bg-ink-900 text-white rounded-[6px] text-[10px] font-['Pixelify_Sans'] font-bold">
                      +{v}
                    </span>
                  )}
                  <div className="stack flex flex-col-reverse gap-1 w-full max-w-[34px]">
                    {Array.from({ length: count }, (_, j) => (
                      <i
                        key={j}
                        className="blk h-5 rounded-[6px] border-2 border-ink-900 block"
                        style={{
                          backgroundColor:
                            idx % 2 === 0 ? "#F26A99" : "#D62A78",
                          boxShadow: "inset 0 2px 0 rgba(255, 255, 255, 0.4)",
                          animationDelay: `${idx * 40 + j * 35}ms`,
                        }}
                      />
                    ))}
                  </div>
                  <span
                    className={`d mt-2 text-center text-[11px] font-bold ${
                      isToday ? "text-[#D62A78] font-extrabold" : "text-ink-500"
                    }`}
                  >
                    {currentConfig.labels[idx]}
                  </span>
                </div>
              );
            })}
          </div>

          <p className="note mt-3 text-xs text-ink-500">
            1 kotak = <b className="unit font-bold text-ink-900">{currentConfig.unit}</b> XP.
            Tumpukanmu adalah rantai blokmu.
          </p>
        </div>

        {/* Liga Card */}
        <div className="card lg flex items-center gap-3 bg-[#FFF1CC] border-2 border-ink-900 rounded-[24px] p-4 shadow-[4px_4px_0_#0D2340]">
          <span className="jb sm coin flex-shrink-0">
            <PulauIcon name="star" size={18} fill />
          </span>
          <div className="g flex-1 min-w-0">
            <b className="font-bold text-sm text-ink-900 block truncate">
              Liga Karang · #4
            </b>
            <small className="text-xs text-ink-500 font-semibold block truncate">
              Naik 1 lagi untuk menyelam ke Laguna
            </small>
          </div>
          <div className="avs flex items-center -space-x-2">
            <i className="size-8 rounded-full border-2 border-ink-900 bg-[#6A3FD1] text-white flex items-center justify-center font-black text-xs">
              R
            </i>
            <i className="size-8 rounded-full border-2 border-ink-900 bg-[#0F75AB] text-white flex items-center justify-center font-black text-xs">
              D
            </i>
            <i className="size-8 rounded-full border-2 border-ink-900 bg-[#FFE3EC] flex items-center justify-center overflow-hidden">
              <BlobiPixel scale={1.6} />
            </i>
          </div>
        </div>

        {/* Struk Blok Terakhir Card */}
        <div className="card bg-white border-2 border-ink-900 rounded-[24px] p-4 shadow-[4px_4px_0_#0D2340]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-extrabold tracking-wider uppercase text-ink-500">
              Struk blok terakhir
            </span>
            <div
              className="conf flex gap-1"
              aria-label="3 dari 3 konfirmasi"
            >
              <i className="size-3.5 rounded-[4px] border-2 border-ink-900 bg-blobi block" />
              <i className="size-3.5 rounded-[4px] border-2 border-ink-900 bg-blobi block" />
              <i className="size-3.5 rounded-[4px] border-2 border-ink-900 bg-blobi block" />
            </div>
          </div>

          <div className="divide-y divide-dashed divide-[#D9CCE3] mt-2 text-sm">
            <div className="rc-row flex justify-between py-2">
              <span className="text-ink-500">Blok</span>
              <b className="font-bold text-ink-900">
                #{lastLessonNo} · {lastLessonTitle}
              </b>
            </div>
            <div className="rc-row flex justify-between py-2">
              <span className="text-ink-500">Hash</span>
              <code className="font-mono text-xs bg-slate-100 px-1.5 py-0.5 rounded text-ink-700">
                {lastHash}
              </code>
            </div>
            <div className="rc-row flex justify-between py-2">
              <span className="text-ink-500">Status</span>
              <b className="font-bold text-[#1A7A40]">Tercatat · 3/3</b>
            </div>
            <div className="rc-row flex justify-between py-2">
              <span className="text-ink-500">Hadiah</span>
              <b className="font-bold text-ink-900">+30 XP · +10 koin</b>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
