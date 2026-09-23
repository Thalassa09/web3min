import { useState, useMemo, useRef, useEffect } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { PulauIcon, BlobiPixel } from "@/lib/pulau-icons";
import { catmullRomRoad, generateBlockHash } from "@/lib/pulau-rantai";
import { useProgress } from "@/lib/store";

export const Route = createFileRoute("/rantai")({
  component: PulauRantaiShowcase,
});

const WORLDS = [
  {
    id: "u1",
    no: 1,
    land: "Hutan",
    kind: "Rumput",
    look: "Hutan permen. Jalan pelan, jangan nyasar.",
    bg: "#7FBF67",
    dash: "0 18",
    props: [
      { name: "mushroom", side: "left", top: 22, size: 52 },
      { name: "flower", side: "right", top: 48, size: 44 },
      { name: "mushroom", side: "right", top: 78, size: 40, flip: true },
    ],
    t: [
      "Apa itu Web3?",
      "Dompet itu apa?",
      "Alamat publik",
      "Seed phrase",
      "Peti Hutan",
      "Kirim pertama",
    ],
    chest: 4,
  },
  {
    id: "u2",
    no: 2,
    land: "Gua kunci",
    kind: "Gelap",
    look: "Gua kunci. Gelap. Kuncinya jangan sampe ilang.",
    bg: "#4B2F63",
    dash: "14 12",
    props: [
      { name: "lantern", side: "left", top: 18, size: 48 },
      { name: "key", side: "right", top: 44, size: 42 },
      { name: "lantern", side: "right", top: 76, size: 46 },
    ],
    t: [
      "Kunci privat",
      "Hot vs cold",
      "Peti Gua",
      "Approve itu apa?",
      "Phishing dompet",
      "Ujian Gua",
    ],
    chest: 2,
  },
];

const ROUTES = [
  {
    land: "Gua kunci",
    no: 2,
    kind: "Gelap",
    prop: "key",
    bg: "#6A3FD1",
    fg: "#fff",
    p: "3/8 blok",
    b: "Lanjut",
  },
  {
    land: "Tambang koin",
    no: 3,
    kind: "Baja",
    prop: "coins",
    bg: "#FFC61A",
    fg: "#1B1440",
    p: "Belum mulai",
    b: "Intip rute",
  },
  {
    land: "Pasar DeFi",
    no: 5,
    kind: "Air",
    prop: "crate",
    bg: "#DDF4FF",
    fg: "#1B1440",
    p: "Butuh Rute 4",
    b: "Terkunci",
  },
];

const BASE_PTS: [number, number][] = [
  [50, 0],
  [72, 20],
  [54, 40],
  [28, 58],
  [40, 78],
  [66, 100],
];

const CHART_DATA = {
  w: {
    l: ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"],
    v: [30, 20, 40, 50, 60, 40, 20],
    u: 10,
    b: 26,
    d: 7,
    t: 4,
  },
  m: {
    l: ["Mg 1", "Mg 2", "Mg 3", "Mg 4"],
    v: [120, 160, 80, 200],
    u: 40,
    b: 56,
    d: 12,
    t: 3,
  },
};

function PhoneSimulator({ initialScreen = "belajar" }: { initialScreen: string }) {
  const navigate = useNavigate();
  const realCompleted = useProgress((s) => s.completed);

  const [screen, setScreen] = useState(initialScreen);
  const [coins, setCoins] = useState(840);
  const [o2, setO2] = useState(3);
  const [chartMode, setChartMode] = useState<"w" | "m">("w");
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [shakingKey, setShakingKey] = useState<string | null>(null);

  const [nodes, setNodes] = useState<Record<string, string[]>>({
    u1: ["done", "done", "done", "now", "lock", "lock"],
    u2: ["lock", "lock", "lock", "lock", "lock", "lock"],
  });

  const [sheet, setSheet] = useState<{
    w: (typeof WORLDS)[0];
    i: number;
    blockNo: number;
  } | null>(null);

  const mapScrollRef = useRef<HTMLDivElement>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 2300);
  };

  const order = useMemo(
    () => WORLDS.flatMap((w) => w.t.map((_, i) => ({ w, i }))),
    []
  );

  const isChest = (w: (typeof WORLDS)[0], i: number) => w.chest === i;

  const getBlockNo = (w: (typeof WORLDS)[0], i: number) => {
    let n = 0;
    for (const item of order) {
      if (!isChest(item.w, item.i)) n++;
      if (item.w.id === w.id && item.i === i) return n;
    }
    return 1;
  };

  // Scroll to active node
  useEffect(() => {
    if (!mapScrollRef.current) return;
    const nowEl = mapScrollRef.current.querySelector(".bn.now") as HTMLElement | null;
    if (nowEl) {
      mapScrollRef.current.scrollTop = Math.max(0, nowEl.offsetTop - 340);
    }
  }, [screen]);

  function advance(w: (typeof WORLDS)[0], i: number) {
    setNodes((prev) => {
      const nextNodes = { ...prev };
      const currentList = [...(nextNodes[w.id] || [])];
      currentList[i] = "done";
      nextNodes[w.id] = currentList;

      const k = order.findIndex((item) => item.w.id === w.id && item.i === i);
      const nextItem = order[k + 1];
      if (nextItem) {
        const nextList = [...(nextNodes[nextItem.w.id] || [])];
        nextList[nextItem.i] = "now";
        nextNodes[nextItem.w.id] = nextList;
      }
      return nextNodes;
    });
  }

  function handleNodeTap(w: (typeof WORLDS)[0], i: number) {
    const s = nodes[w.id]?.[i] || "lock";
    const key = `${w.id}-${i}`;

    if (isChest(w, i)) {
      if (s === "now") {
        setCoins((c) => c + 50);
        advance(w, i);
        showToast("Peti terbuka! +50 koin 🪙");
      } else if (s === "done") {
        showToast("Peti ini sudah dibuka.");
      } else {
        setShakingKey(key);
        setTimeout(() => setShakingKey(null), 300);
        showToast("Selesaikan blok sebelumnya untuk membuka peti.");
      }
      return;
    }

    if (s === "now") {
      setSheet({ w, i, blockNo: getBlockNo(w, i) });
    } else if (s === "done") {
      showToast(`Blok #${getBlockNo(w, i)} sudah tercatat. Ulangi untuk XP latihan.`);
    } else {
      setShakingKey(key);
      setTimeout(() => setShakingKey(null), 300);
      showToast("Blok ini belum bisa ditambang.");
    }
  }

  const currentChart = CHART_DATA[chartMode];

  return (
    <div className="phone relative text-ink-900 font-sans select-none flex-shrink-0">
      {/* iOS-style Status Bar */}
      <div className="sbar">
        <span>9:41</span>
        <span className="sig">
          <i />
          <i />
          <i />
          <b />
        </span>
      </div>

      {/* Screen 1: Belajar */}
      <section
        className={`scr ${screen === "belajar" ? "on" : ""}`}
        aria-label="Belajar"
      >
        <div ref={mapScrollRef} className="mapscroll absolute inset-0 overflow-y-auto no-scrollbar pb-[90px]">
          {WORLDS.map((w, wi) => {
            const H = wi ? 600 : 740;
            const T = wi ? 120 : 250;
            const pts: [number, number][] = BASE_PTS.map(
              ([x, y]) =>
                [x, Math.round(T + (y * (H - T - 60)) / 100)] as [
                  number,
                  number,
                ]
            );
            const roadPoints: [number, number][] = [[50, 0], ...pts, [50, H]];
            const roadPath = catmullRomRoad(roadPoints);

            return (
              <div
                key={w.id}
                className="world relative overflow-hidden"
                style={{ "--wbg": w.bg, height: `${H}px` } as React.CSSProperties}
              >
                <img
                  className="art"
                  src={`/worlds/${w.id}.jpg`}
                  alt=""
                  onError={(e) => (e.currentTarget.style.display = "none")}
                />
                <svg
                  className="road"
                  viewBox={`0 0 100 ${H}`}
                  preserveAspectRatio="none"
                  aria-hidden="true"
                >
                  <path
                    d={roadPath}
                    fill="none"
                    stroke="#1B1440"
                    strokeWidth="34"
                    strokeLinecap="round"
                    vectorEffect="non-scaling-stroke"
                  />
                  <path
                    d={roadPath}
                    fill="none"
                    stroke="#FFF4E6"
                    strokeWidth="29"
                    strokeLinecap="round"
                    vectorEffect="non-scaling-stroke"
                  />
                  <path
                    d={roadPath}
                    fill="none"
                    stroke="#F26A99"
                    strokeWidth="5"
                    strokeLinecap="round"
                    strokeDasharray={w.dash}
                    vectorEffect="non-scaling-stroke"
                  />
                </svg>

                {w.props.map((p, pi) => (
                  <img
                    key={pi}
                    className="prop"
                    src={`/props/${p.name}.png`}
                    alt=""
                    onError={(e) => (e.currentTarget.style.display = "none")}
                    style={{
                      [p.side]: "6px",
                      top: `${T + (p.top * (H - T)) / 100 - p.size / 2}px`,
                      width: `${p.size * 1.25}px`,
                      transform: p.flip ? "scaleX(-1)" : undefined,
                    }}
                  />
                ))}

                <div className="wsign" style={{ top: wi ? "24px" : "156px" }}>
                  <p className="label font-extrabold text-[11px] text-[#D62A78] uppercase">
                    Rute {w.no} · {w.kind}
                  </p>
                  <h3 className="text-lg font-black font-display text-ink-900">
                    {w.land}
                  </h3>
                  <p className="text-xs text-ink-500">{w.look}</p>
                </div>

                {w.t.map((title, i) => {
                  const [x, y] = pts[i];
                  const chest = isChest(w, i);
                  const s = nodes[w.id]?.[i] || "lock";
                  const key = `${w.id}-${i}`;
                  const isShaking = shakingKey === key;

                  const cls = chest
                    ? s === "lock"
                      ? "chest"
                      : s === "now"
                      ? "ready"
                      : "opened"
                    : s;
                  const iconName = chest
                    ? "chest"
                    : s === "done"
                    ? "check"
                    : s === "now"
                    ? "star"
                    : "lock";
                  const blockNo = getBlockNo(w, i);

                  return (
                    <button
                      key={i}
                      type="button"
                      className={`bn ${cls} ${isShaking ? "shake" : ""}`}
                      style={{ left: `${x}%`, top: `${y}px` }}
                      onClick={() => handleNodeTap(w, i)}
                      aria-label={
                        chest
                          ? `Peti: ${s}`
                          : `Blok ${blockNo}: ${title}`
                      }
                    >
                      {!chest && <span className="h">#{blockNo}</span>}
                      <PulauIcon
                        name={iconName}
                        size={28}
                        fill={s === "now" && !chest}
                      />
                      {s !== "lock" && <span className="nl">{title}</span>}
                      {s === "now" && !chest && (
                        <span className="bubble">MULAI</span>
                      )}
                    </button>
                  );
                })}
              </div>
            );
          })}
        </div>

        {/* Header Bar */}
        <header className="mhead absolute top-[44px] left-[12px] right-[12px] z-10 flex justify-between items-center">
          <div className="hello">
            <span className="av">
              <BlobiPixel scale={2.4} />
            </span>
            <span>
              <b>Halo, Thalassa</b>
              <small>Rantai 12 hari. Lanjut!</small>
            </span>
          </div>
          <button
            type="button"
            className="jb"
            onClick={() => showToast("2 kabar: misi baru dan liga hampir selesai")}
            aria-label="Notifikasi"
          >
            <PulauIcon name="bell" size={20} />
            <em className="dot">2</em>
          </button>
        </header>

        {/* HUD row */}
        <div className="hudrow absolute top-[104px] left-[12px] right-[12px] z-10 flex gap-2">
          <span className="pill" aria-label="Streak 12 hari">
            <span className="ic fl">
              <PulauIcon name="flame" size={13} fill />
            </span>
            12
          </span>
          <span className="pill" aria-label="Oksigen">
            <span className="ic sk">
              <PulauIcon name="o2" size={13} />
            </span>
            <span className="bubs">
              {[0, 1, 2, 3, 4].map((idx) => (
                <i
                  key={idx}
                  className={`bu ${idx < o2 ? "on" : ""}`}
                />
              ))}
            </span>
          </span>
          <span className="pill" aria-label="Koin">
            <span className="ic cn">
              <PulauIcon name="coin" size={13} />
            </span>
            <span className="coins">{coins}</span>
          </span>
        </div>

        {/* Floating Action Buttons */}
        <div className="fabs">
          <button
            type="button"
            className="fab"
            onClick={() => showToast("Misi harian: 2 dari 3 selesai")}
          >
            <span className="jb sm">
              <PulauIcon name="target" size={18} />
            </span>
            <span className="tx">Misi 2/3</span>
          </button>
          <button
            type="button"
            className="fab"
            onClick={() => showToast("Bedah kasus: airdrop palsu Rp30 juta")}
          >
            <span className="jb sm grape">
              <PulauIcon name="shield" size={18} />
            </span>
            <span className="tx">Bedah kasus</span>
          </button>
          <button
            type="button"
            className="fab"
            onClick={() => setScreen("progres")}
          >
            <span className="jb sm coin">
              <PulauIcon name="chart" size={18} />
            </span>
            <span className="tx">Progres</span>
          </button>
        </div>

        {/* Bottom Sheet Modal */}
        <div className={`sheet ${sheet ? "on" : ""}`}>
          {sheet && (
            <div>
              <button
                type="button"
                className="xclose"
                onClick={() => setSheet(null)}
                aria-label="Tutup"
              >
                <PulauIcon name="x" size={20} />
              </button>
              <p className="label font-extrabold text-[11px] text-[#D62A78] uppercase">
                Blok #{sheet.blockNo} · Rute {sheet.w.no} {sheet.w.land}
              </p>
              <h3 className="text-xl font-black font-display text-ink-900 mt-1">
                {sheet.w.t[sheet.i]}
              </h3>
              <p className="muted text-xs text-ink-500 mt-1">
                3 soal · +30 XP · jawaban salah = −1 oksigen
              </p>
              <button
                type="button"
                className="btn btn-candy w-full py-3 rounded-2xl border-2 border-ink-900 font-bold text-sm text-white flex items-center justify-center gap-2 mt-4 cursor-pointer"
                onClick={() => {
                  setSheet(null);
                  setCoins((c) => c + 10);
                  advance(sheet.w, sheet.i);
                  showToast(
                    `Blok #${sheet.blockNo} tercatat · +30 XP · +10 koin`
                  );
                }}
              >
                <PulauIcon name="star" size={18} fill />
                Tambang blok ini
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Screen 2: Progres */}
      <section
        className={`scr scroll ${screen === "progres" ? "on" : ""}`}
        aria-label="Progres"
      >
        <div className="top3">
          <button
            type="button"
            className="jb"
            onClick={() => setScreen("profil")}
            aria-label="Kembali"
          >
            <PulauIcon name="back" size={20} />
          </button>
          <span className="tchip font-bold text-xs uppercase">Analitik</span>
          <button
            type="button"
            className="jb coin"
            onClick={() => showToast("Rekap bulanan dikirim tiap tanggal 1")}
            aria-label="Rekap"
          >
            <PulauIcon name="chart" size={20} />
          </button>
        </div>

        <div className="pad space-y-4">
          <div className="flex items-center justify-between mt-2">
            <h1 className="ph text-2xl font-black font-display text-ink-900">
              Progres
            </h1>
            <button
              type="button"
              className="sel"
              onClick={() => showToast("Filter: semua 20 rute")}
            >
              Semua rute <PulauIcon name="down" size={14} />
            </button>
          </div>

          <div className="card">
            <div className="flex items-center justify-between mb-2">
              <span className="jb sm coin">
                <PulauIcon name="chart" size={18} />
              </span>
              <div className="seg">
                <button
                  type="button"
                  className={chartMode === "w" ? "on" : ""}
                  onClick={() => setChartMode("w")}
                >
                  Mingguan
                </button>
                <button
                  type="button"
                  className={chartMode === "m" ? "on" : ""}
                  onClick={() => setChartMode("m")}
                >
                  Bulanan
                </button>
              </div>
            </div>

            <div className="big flex items-center justify-between my-2 text-ink-500 font-bold">
              <span>
                <b className="sb text-3xl font-black font-display text-ink-900 mr-1">
                  {currentChart.b}
                </b>
                Blok
              </span>
              <span>
                <b className="sd text-3xl font-black font-display text-ink-900 mr-1">
                  {currentChart.d}
                </b>
                Hari rantai
              </span>
            </div>

            <div className="bars flex items-end justify-between gap-1.5 h-44 mt-3">
              {currentChart.v.map((v, idx) => {
                const count = Math.round(v / currentChart.u);
                const isToday = idx === currentChart.t;
                return (
                  <div
                    key={idx}
                    className={`col flex-1 flex flex-col justify-end items-center h-full ${
                      isToday ? "today font-black" : ""
                    }`}
                  >
                    {isToday && (
                      <span className="val mb-1 px-1.5 py-0.5 bg-ink-900 text-white rounded text-[10px] font-mono">
                        +{v}
                      </span>
                    )}
                    <div className="stack flex flex-col-reverse gap-1 w-full max-w-[32px]">
                      {Array.from({ length: count }, (_, j) => (
                        <i
                          key={j}
                          className="blk h-5 rounded-[6px] border-2 border-ink-900 block"
                          style={{
                            backgroundColor:
                              idx % 2 === 0 ? "#F26A99" : "#D62A78",
                            animationDelay: `${idx * 40 + j * 35}ms`,
                          }}
                        />
                      ))}
                    </div>
                    <span
                      className={`d mt-2 text-center text-[10px] font-bold ${
                        isToday ? "text-[#D62A78]" : "text-ink-500"
                      }`}
                    >
                      {currentChart.l[idx]}
                    </span>
                  </div>
                );
              })}
            </div>

            <p className="note mt-3 text-xs text-ink-500">
              1 kotak = <b className="unit font-bold text-ink-900">{currentChart.u}</b> XP.
              Tumpukanmu adalah rantai blokmu.
            </p>
          </div>

          <div className="card lg flex items-center gap-3">
            <span className="jb sm coin">
              <PulauIcon name="star" size={18} fill />
            </span>
            <div className="g flex-1 min-w-0">
              <b className="font-bold text-sm text-ink-900 block truncate">
                Liga Karang · #4
              </b>
              <small className="text-xs text-ink-500 block truncate">
                Naik 1 lagi untuk menyelam ke Laguna
              </small>
            </div>
            <div className="avs flex items-center -space-x-2">
              <i style={{ background: "#6A3FD1" }}>R</i>
              <i style={{ background: "#0F75AB" }}>D</i>
              <i className="me">
                <BlobiPixel scale={1.6} />
              </i>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between mb-2">
              <span className="label muted text-[11px] font-bold uppercase">
                Struk blok terakhir
              </span>
              <span className="conf flex gap-1">
                <i />
                <i />
                <i />
              </span>
            </div>
            <div className="divide-y divide-dashed divide-[#D9CCE3] text-sm mt-2">
              <div className="rc-row flex justify-between py-2">
                <span>Blok</span>
                <b>#3 · Alamat publik</b>
              </div>
              <div className="rc-row flex justify-between py-2">
                <span>Hash</span>
                <code className="font-mono text-xs">0x7f3a…c21e</code>
              </div>
              <div className="rc-row flex justify-between py-2">
                <span>Status</span>
                <b style={{ color: "var(--leaftx)" }}>Tercatat · 3/3</b>
              </div>
              <div className="rc-row flex justify-between py-2">
                <span>Hadiah</span>
                <b>+30 XP · +10 koin</b>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Screen 3: Profil */}
      <section
        className={`scr scroll ${screen === "profil" ? "on" : ""}`}
        aria-label="Profil"
      >
        <div className="banner relative h-[200px] overflow-hidden">
          <img
            className="art"
            alt=""
            src="/worlds/u2.jpg"
            onError={(e) => (e.currentTarget.style.display = "none")}
          />
          <div className="top3 abs">
            <button
              type="button"
              className="jb"
              onClick={() => setScreen("belajar")}
              aria-label="Kembali"
            >
              <PulauIcon name="back" size={20} />
            </button>
            <span className="tchip font-bold text-xs uppercase">Profil</span>
            <button
              type="button"
              className="jb"
              onClick={() => showToast("Pengaturan")}
              aria-label="Pengaturan"
            >
              <PulauIcon name="gear" size={20} />
            </button>
          </div>
        </div>

        <div className="pav">
          <span className="float">
            <BlobiPixel scale={6.5} />
          </span>
        </div>

        <div className="pad center text-center mt-2">
          <h1 className="text-2xl font-black font-display text-ink-900">
            Thalassa
          </h1>
          <p className="muted text-xs font-semibold text-ink-500">
            Penjelajah rute · Liga Karang
          </p>
        </div>

        <div className="pad space-y-3 mt-3">
          <button
            type="button"
            className="alert"
            onClick={() =>
              showToast("Oksigen pulih 1 tiap 30 menit, atau isi ulang di Toko")
            }
          >
            <span className="ai">
              <PulauIcon name="o2" size={18} />
            </span>
            <span className="text-xs">
              Oksigen tinggal <b className="o2n">{o2}</b>. Isi ulang sebelum
              menyelam.
            </span>
            <PulauIcon name="chev" size={18} />
          </button>

          <h2 className="h2 text-lg font-black font-display text-ink-900 mt-4">
            Rute belajar
          </h2>

          <div className="routes space-y-3">
            {ROUTES.map((r, i) => (
              <button
                key={i}
                type="button"
                className="rc text-left"
                style={{ background: r.bg, color: r.fg }}
                onClick={() => {
                  if (i === 0) setScreen("belajar");
                  else if (i === 1)
                    showToast("Tambang koin: belajar cara kerja mining & fee");
                  else showToast("Selesaikan Rute 4 dulu");
                }}
              >
                <small className="block text-[11px] font-bold opacity-90">
                  Rute {r.no} · {r.kind}
                </small>
                <h3 className="text-lg font-black font-display mt-0.5">
                  {r.land}
                </h3>
                <small className="block text-xs font-semibold opacity-85 mt-0.5">
                  {r.p}
                </small>
                <span className="pb">{r.b}</span>
                <img
                  src={`/props/${r.prop}.png`}
                  alt=""
                  onError={(e) => (e.currentTarget.style.display = "none")}
                />
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Persistent Dock Bar */}
      <nav className="dock" aria-label="Navigasi utama">
        <button
          type="button"
          className={screen === "belajar" ? "on" : ""}
          onClick={() => setScreen("belajar")}
          aria-label="Belajar"
        >
          <PulauIcon name="compass" size={22} />
        </button>
        <button
          type="button"
          onClick={() => {
            void navigate({ to: "/kisah" });
          }}
          aria-label="Kisah"
        >
          <PulauIcon name="book" size={22} />
        </button>
        <button
          type="button"
          onClick={() => {
            void navigate({ to: "/leaderboard" });
          }}
          aria-label="Arena"
        >
          <PulauIcon name="trophy" size={22} />
        </button>
        <button
          type="button"
          onClick={() => {
            void navigate({ to: "/shop" });
          }}
          aria-label="Toko"
        >
          <PulauIcon name="bag" size={22} />
        </button>
        <button
          type="button"
          className={screen === "profil" || screen === "progres" ? "on" : ""}
          onClick={() => setScreen("profil")}
          aria-label="Profil"
        >
          <PulauIcon name="user" size={22} />
        </button>
      </nav>

      {/* Floating Toast Notification */}
      <div className={`toast ${toastMsg ? "on" : ""}`}>{toastMsg}</div>
    </div>
  );
}

function PulauRantaiShowcase() {
  const [activeTab, setActiveTab] = useState<"belajar" | "progres" | "profil">(
    "belajar"
  );

  return (
    <main className="min-h-screen bg-[#F6EFF6] py-8 px-4 text-ink-900 font-sans">
      <div className="max-w-6xl mx-auto">
        {/* Navigation & Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <Link
                to="/"
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border-2 border-ink-900 text-xs font-bold shadow-[2px_2px_0_#0D2340] hover:bg-slate-50 transition-colors"
              >
                <PulauIcon name="back" size={14} />
                Kembali ke Beranda
              </Link>
              <Link
                to="/bubble"
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-candy text-white border-2 border-ink-900 text-xs font-black shadow-[2px_2px_0_#0D2340] hover:bg-candy-deep transition-colors"
              >
                🫧 Bubble Menu ↗
              </Link>
              <span className="px-2.5 py-0.5 rounded-full bg-[#FFE3EC] text-[#D62A78] border border-[#FFB3D6] text-[11px] font-bold font-mono">
                PROTOTIPE AKTIF
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black font-display tracking-tight text-ink-900 mt-2">
              web3min: Pulau Rantai
            </h1>
            <p className="text-xs sm:text-sm text-ink-500 font-medium">
              3 Phone Viewport Stage — Peta Rute Berkelok, Analitik Blok & Profil Penjelajah
            </p>
          </div>

          {/* Mobile Phone Tab Switcher */}
          <div className="flex lg:hidden p-1 bg-white border-2 border-ink-900 rounded-full shadow-[2px_2px_0_#0D2340]">
            {(["belajar", "progres", "profil"] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1 text-xs font-bold rounded-full capitalize transition-all ${
                  activeTab === tab
                    ? "bg-blobi text-white shadow-xs"
                    : "text-ink-500 hover:text-ink-900"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* 3-Phone Stage on Desktop, Tabbed on Mobile */}
        <div className="hidden lg:flex stage gap-8 justify-center items-start">
          <PhoneSimulator initialScreen="belajar" />
          <PhoneSimulator initialScreen="progres" />
          <PhoneSimulator initialScreen="profil" />
        </div>

        {/* Single Phone on Mobile */}
        <div className="flex lg:hidden justify-center items-center">
          <PhoneSimulator initialScreen={activeTab} />
        </div>
      </div>
    </main>
  );
}
