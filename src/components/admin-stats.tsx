import * as React from "react";
import { Activity, AlertTriangle, BarChart3, CalendarDays, Coins, RefreshCw, Ticket, TrendingUp, UserPlus, Users } from "lucide-react";
import { rpcAdminAnalytics, type AdminAnalytics } from "@/lib/server-sync";

/**
 * Panel statistik admin (Langkah 2).
 *
 * CATATAN ARSITEKTUR — kenapa chart-nya SVG buatan sendiri, bukan Recharts:
 * `recharts` sudah ada di package.json, tapi nol pemakaian di `src/` berarti
 * nol byte di bundle produksi. Mayoritas user web3min membuka dari HP
 * (AGENTS.md Mobile), jadi menambah ~100 kB gzip demi 2 grafik di halaman yang
 * hanya dibuka admin adalah pemborosan. Ketiga grafik di bawah butuh 3 bentuk
 * dasar — polyline, batang, tabel — yang bisa digambar dengan ~60 baris SVG
 * deterministik dan ikut tema warna yang sudah ada.
 *
 * Keamanan: komponen ini TIDAK memutuskan siapa yang boleh melihat data.
 * `admin_overview()` dkk. melempar `forbidden` di database kalau pemanggil
 * bukan admin — UI hanya menampilkan pesan hasilnya.
 */

type LoadState =
  | { status: "loading" }
  | { status: "error"; message: string; forbidden: boolean }
  | { status: "ready"; data: AdminAnalytics };

const DAY_LABELS = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];

const EVENT_LABEL: Record<string, string> = {
  signup: "Daftar",
  lesson_complete: "Blok selesai",
  story_complete: "Kisah selesai",
  case_complete: "Bedah kasus",
  quest_claim: "Klaim misi",
  raffle_enter: "Ikut undian",
  buy_tickets: "Beli tiket",
  buy_freeze: "Beli pelindung",
  refill_hearts: "Isi nyawa",
  claim_leaderboard: "Hadiah klasemen",
};

function eventLabel(event: string): string {
  return EVENT_LABEL[event] ?? event.replace(/_/g, " ");
}

function shortDay(iso: string): string {
  const d = new Date(`${iso}T00:00:00+07:00`);
  if (Number.isNaN(d.getTime())) return iso.slice(5);
  return `${d.getDate()}/${d.getMonth() + 1}`;
}

function timeAgo(iso: string): string {
  const t = new Date(iso).getTime();
  if (Number.isNaN(t)) return "—";
  const mins = Math.max(0, Math.round((Date.now() - t) / 60000));
  if (mins < 1) return "baru saja";
  if (mins < 60) return `${mins} menit lalu`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours} jam lalu`;
  return `${Math.round(hours / 24)} hari lalu`;
}

function Stat({
  label,
  value,
  sub,
  icon,
  tone = "cream",
}: {
  label: string;
  value: string | number;
  sub?: string;
  icon: React.ReactNode;
  tone?: "cream" | "candy" | "coin" | "mint";
}) {
  const toneClass = {
    cream: "bg-white",
    candy: "bg-candy-50",
    coin: "bg-amber-50",
    mint: "bg-emerald-50",
  }[tone];

  return (
    <div className={`p-3.5 sm:p-4 rounded-2xl ${toneClass} border-2 border-choco-900 shadow-[0_3px_0_#3B2218]`}>
      <div className="flex items-center gap-1.5 text-choco-500">
        {icon}
        <span className="text-[10px] font-pixel font-bold uppercase leading-tight">{label}</span>
      </div>
      <div className="font-pixel text-2xl font-bold text-choco-900 mt-1 tabular-nums">{value}</div>
      {sub ? <div className="text-[11px] font-semibold text-choco-600 mt-0.5">{sub}</div> : null}
    </div>
  );
}

/** Grafik garis multi-seri. Data kosong -> pesan jujur, bukan garis palsu. */
function TrendChart({ data }: { data: AdminAnalytics["series"] }) {
  const W = 720;
  const H = 200;
  const PAD = { top: 12, right: 12, bottom: 24, left: 30 };

  const series = React.useMemo(
    () => [
      { key: "active_users" as const, name: "User aktif", color: "#B01F62" },
      { key: "lessons" as const, name: "Blok selesai", color: "#B54A12" },
      { key: "signups" as const, name: "Pendaftar", color: "#3B2218" },
    ],
    [],
  );

  const max = Math.max(1, ...data.flatMap((d) => series.map((s) => Number(d[s.key]) || 0)));
  const innerW = W - PAD.left - PAD.right;
  const innerH = H - PAD.top - PAD.bottom;
  const stepX = data.length > 1 ? innerW / (data.length - 1) : 0;
  const x = (i: number) => PAD.left + i * stepX;
  const y = (v: number) => PAD.top + innerH - (v / max) * innerH;

  if (data.length === 0) {
    return (
      <p className="text-xs font-semibold text-choco-600 py-10 text-center">
        Belum ada aktivitas tercatat pada rentang ini.
      </p>
    );
  }

  const tickEvery = Math.max(1, Math.ceil(data.length / 8));

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
        {series.map((s) => (
          <span key={s.key} className="flex items-center gap-1.5 text-[11px] font-bold text-choco-700">
            <span className="size-2.5 rounded-full border border-choco-900/30" style={{ background: s.color }} />
            {s.name}
          </span>
        ))}
      </div>

      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full h-48 sm:h-56"
        role="img"
        aria-label="Grafik aktivitas harian: user aktif, blok selesai, dan pendaftar"
      >
        {[0, 0.5, 1].map((f) => (
          <g key={f}>
            <line
              x1={PAD.left}
              x2={W - PAD.right}
              y1={y(max * f)}
              y2={y(max * f)}
              stroke="#3B2218"
              strokeOpacity={f === 0 ? 0.35 : 0.12}
              strokeWidth={1}
            />
            <text x={4} y={y(max * f) + 3.5} fontSize={10} fill="#8A6552" fontWeight={600}>
              {Math.round(max * f)}
            </text>
          </g>
        ))}

        {series.map((s) => (
          <polyline
            key={s.key}
            fill="none"
            stroke={s.color}
            strokeWidth={2}
            strokeLinejoin="round"
            strokeLinecap="round"
            points={data.map((d, i) => `${x(i)},${y(Number(d[s.key]) || 0)}`).join(" ")}
          />
        ))}

        {data.map((d, i) =>
          i % tickEvery === 0 || i === data.length - 1 ? (
            <text key={d.day} x={x(i)} y={H - 6} fontSize={10} fill="#8A6552" textAnchor="middle" fontWeight={600}>
              {shortDay(d.day)}
            </text>
          ) : null,
        )}
      </svg>
    </div>
  );
}

/** Funnel per blok. Batang horizontal karena label id blok panjang. */
function FunnelChart({ data }: { data: AdminAnalytics["funnel"] }) {
  const top = data.slice(0, 12);
  if (top.length === 0) {
    return (
      <p className="text-xs font-semibold text-choco-600 py-10 text-center">
        Belum ada blok yang selesai. Data mulai terkumpul setelah log dipasang.
      </p>
    );
  }
  const max = Math.max(1, ...top.map((r) => Number(r.users) || 0));
  const first = Number(top[0].users) || 0;

  return (
    <ul className="space-y-2">
      {top.map((row) => {
        const users = Number(row.users) || 0;
        const pct = Math.round((users / max) * 100);
        const drop = first > 0 ? Math.round((users / first) * 100) : 100;
        return (
          <li key={row.lesson_id} className="space-y-1">
            <div className="flex items-center justify-between gap-2 text-[11px] font-bold">
              <span className="font-mono text-choco-800 truncate">{row.lesson_id}</span>
              <span className="text-choco-600 tabular-nums shrink-0">
                {users} user · {drop}% dari blok teratas
              </span>
            </div>
            <div className="h-3 rounded-full bg-cream-100 border border-choco-900/20 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-blush-50 to-blush-200"
                style={{ width: `${Math.max(pct, 2)}%` }}
              />
            </div>
          </li>
        );
      })}
    </ul>
  );
}

function FeedTable({ data }: { data: AdminAnalytics["feed"] }) {
  if (data.length === 0) {
    return <p className="text-xs font-semibold text-choco-600 py-6 text-center">Belum ada aktivitas.</p>;
  }
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs">
        <thead>
          <tr className="text-left text-choco-500 font-pixel uppercase text-[10px]">
            <th className="py-2 pr-3">Waktu</th>
            <th className="py-2 pr-3">User</th>
            <th className="py-2 pr-3">Event</th>
            <th className="py-2">Ref</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={`${row.created_at}-${i}`} className="border-t border-choco-900/10">
              <td
                className="py-2 pr-3 text-choco-600 whitespace-nowrap"
                title={new Date(row.created_at).toLocaleString("id-ID")}
              >
                {timeAgo(row.created_at)}
              </td>
              <td className="py-2 pr-3 font-bold text-choco-900 whitespace-nowrap">
                {row.username ? `@${row.username}` : "—"}
              </td>
              <td className="py-2 pr-3 text-choco-700">{eventLabel(row.event)}</td>
              <td className="py-2 font-mono text-[10px] text-choco-500 truncate max-w-[10rem]">{row.ref_id ?? "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function AdminStatsPanel() {
  const [days, setDays] = React.useState(30);
  const [state, setState] = React.useState<LoadState>({ status: "loading" });

  const load = React.useCallback(async (d: number) => {
    setState({ status: "loading" });
    const res = await rpcAdminAnalytics(d);
    if (!res.ok) {
      setState({ status: "error", message: res.error, forbidden: res.forbidden });
      return;
    }
    setState({ status: "ready", data: res.data });
  }, []);

  React.useEffect(() => {
    void load(days);
  }, [days, load]);

  if (state.status === "loading") {
    return (
      <div className="space-y-3" aria-busy="true">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="h-[86px] rounded-2xl bg-cream-100 border-2 border-choco-900/15 animate-pulse" />
          ))}
        </div>
        <div className="h-64 rounded-2xl bg-cream-100 border-2 border-choco-900/15 animate-pulse" />
      </div>
    );
  }

  if (state.status === "error") {
    return (
      <div className="p-5 rounded-2xl bg-rose-50 border-2 border-choco-900 shadow-[0_3px_0_#3B2218] space-y-3">
        <div className="flex items-center gap-2 text-rose-800">
          <AlertTriangle className="size-4 shrink-0" />
          <span className="font-pixel font-bold text-sm">
            {state.forbidden ? "Akun ini bukan admin." : "Statistik gagal dimuat."}
          </span>
        </div>
        <p className="text-xs font-semibold text-choco-700 leading-relaxed">
          {state.forbidden ? (
            <>
              Statistik dilindungi di database. Minta pemilik situs menjalankan{" "}
              <code className="font-mono text-[11px] bg-white px-1.5 py-0.5 rounded border border-choco-900/20">
                update profiles set is_admin = true where username = &apos;namamu&apos;;
              </code>{" "}
              lalu masuk ulang dengan akun itu.
            </>
          ) : (
            state.message
          )}
        </p>
        <button
          type="button"
          onClick={() => void load(days)}
          className="py-2 px-4 rounded-full bg-white hover:bg-cream text-choco-900 font-pixel font-bold text-xs border-2 border-choco-900 shadow-[0_2px_0_#3B2218] active:translate-y-0.5 cursor-pointer inline-flex items-center gap-1.5"
        >
          <RefreshCw className="size-3.5" />
          <span>Coba lagi</span>
        </button>
      </div>
    );
  }

  const { overview: ov, series, funnel, feed } = state.data;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-1.5 text-choco-700">
          <CalendarDays className="size-4" />
          <span className="text-xs font-pixel font-bold uppercase">Rentang grafik</span>
        </div>
        <div className="flex items-center gap-1 p-1 bg-cream rounded-xl border border-choco-900/30">
          {[7, 14, 30, 90].map((d) => {
            const active = days === d;
            return (
              <button
                key={d}
                type="button"
                aria-pressed={active}
                onClick={() => setDays(d)}
                className={`px-3 py-1.5 rounded-lg font-pixel text-xs font-bold border-2 transition-all cursor-pointer ${
                  active
                    ? "border-candy-600 bg-gradient-to-b from-blush-50 to-blush-200 text-choco-900 shadow-[0_3px_0_#B01F62] hover:brightness-105 hover:-translate-y-0.5 active:translate-y-[3px] active:shadow-none"
                    : "border-transparent text-choco-700 hover:bg-white"
                }`}
              >
                {d} hari
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Stat
          label="Total user"
          value={ov.total_users}
          sub="akun asli, tanpa akun uji"
          icon={<Users className="size-3.5" />}
        />
        <Stat
          label="Daftar hari ini"
          value={ov.new_today}
          sub="sejak 00:00 WIB"
          icon={<UserPlus className="size-3.5" />}
          tone="mint"
        />
        <Stat
          label="Aktif 1 / 7 / 30 hari"
          value={`${ov.dau} / ${ov.wau} / ${ov.mau}`}
          sub="DAU / WAU / MAU"
          icon={<Activity className="size-3.5" />}
          tone="candy"
        />
        <Stat
          label="Blok selesai hari ini"
          value={ov.lessons_today}
          sub={`${ov.raffle_entries_today} ikut undian hari ini`}
          icon={<TrendingUp className="size-3.5" />}
          tone="coin"
        />
      </div>

      <section className="p-4 rounded-2xl bg-white border-2 border-choco-900 shadow-[0_3px_0_#3B2218]">
        <h3 className="font-pixel font-bold text-sm text-choco-900 mb-3 flex items-center gap-2">
          <TrendingUp className="size-4 text-candy-700" />
          Aktivitas harian
        </h3>
        <TrendChart data={series} />
      </section>

      <div className="grid gap-5 lg:grid-cols-2">
        <section className="p-4 rounded-2xl bg-white border-2 border-choco-900 shadow-[0_3px_0_#3B2218]">
          <h3 className="font-pixel font-bold text-sm text-choco-900 mb-1 flex items-center gap-2">
            <BarChart3 className="size-4 text-candy-700" />
            Funnel per blok
          </h3>
          <p className="text-[11px] font-semibold text-choco-600 mb-3">
            Berapa user yang menyelesaikan tiap blok — titik drop-off terlihat dari batang yang mengecil.
          </p>
          <FunnelChart data={funnel} />
        </section>

        <section className="p-4 rounded-2xl bg-white border-2 border-choco-900 shadow-[0_3px_0_#3B2218]">
          <h3 className="font-pixel font-bold text-sm text-choco-900 mb-1 flex items-center gap-2">
            <Activity className="size-4 text-candy-700" />
            Aktivitas terbaru
          </h3>
          <p className="text-[11px] font-semibold text-choco-600 mb-2">
            {ov.log_since
              ? `Log mulai terkumpul ${new Date(ov.log_since).toLocaleDateString("id-ID")}. Riwayat sebelum itu hanya perkiraan.`
              : "Belum ada log tercatat."}
          </p>
          <FeedTable data={feed} />
        </section>
      </div>

      <section className="p-4 rounded-2xl bg-cream-50 border-2 border-choco-900/20">
        <h3 className="font-pixel font-bold text-xs uppercase text-choco-700 mb-2 flex items-center gap-2">
          <Coins className="size-3.5 text-coin-shadow" />
          Yang dihitung di sini
        </h3>
        <p className="text-[11px] font-semibold text-choco-600 leading-relaxed">
          Setiap blok, kisah, bedah kasus, misi harian, undian, dan pembelian di toko menulis satu baris ke{" "}
          <code className="font-mono bg-white px-1 rounded border border-choco-900/20">activity_log</code>. Angka
          &quot;user aktif&quot; dihitung dari user unik yang punya aktivitas, bukan sekadar membuka aplikasi.
          <span className="inline-flex items-center gap-1 ml-1">
            <Ticket className="size-3" /> undian kini juga tercatat setelah bug penyimpanan diperbaiki.
          </span>
        </p>
      </section>

      <p className="text-[11px] font-semibold text-choco-500 text-center">
        Rentang {days} hari · sumber data: tabel activity_log (zona waktu Asia/Jakarta)
      </p>
    </div>
  );
}
