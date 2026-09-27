import { Link } from "@tanstack/react-router";
import { ArrowRight, Sparkles } from "lucide-react";
import { Coins, Fire, Trophy } from "@/lib/kicon";
import { ProgressRing } from "@/components/ui/progress-ring";
import { cn } from "@/lib/utils";
import { MAX_HEARTS, formatGems, useProgress } from "@/lib/store";
import { UNITS, firstPlayableId, getLesson, type Lesson } from "@/lib/curriculum";

/**
 * Kartu ringkas "sedang dipelajari" + tiga kartu statistik.
 *
 * Diadopsi dari referensi desain user (kartu ringkas dengan cincin progres,
 * lalu baris tiga kartu statistik: Streak / XP / Liga). Yang diadopsi hanya
 * STRUKTUR & alur informasinya — beranda sebelumnya langsung menampilkan peta
 * blok tanpa ringkasan "kamu di sini, lanjut ke sini", jadi user harus mencari
 * sendiri blok aktifnya di peta yang panjang.
 *
 * Skinning tetap web3min (nol pelanggaran kontrak):
 * - border `choco-900` 2px + hard slab `0 4px 0 #3B2218` (bukan blur)
 * - CTA pink `candy-700` (bukan biru #3B82F6 dari referensi)
 * - latar gradien krem (`from-white to-choco-line`), bukan lavender
 * - ikon memakai warna yang sudah ada: `streak`/`lemon`/`candy`
 */

function blockNumberOf(lessonId: string): { n: number; total: number } {
  let n = 0;
  let total = 0;
  let found = 0;
  for (const u of UNITS) {
    for (const l of u.lessons) {
      if (l.kind === "chest") continue;
      total += 1;
      if (l.id === lessonId) found = total;
    }
  }
  n = found;
  return { n, total };
}

function StatCard({
  icon,
  value,
  label,
  tone,
}: {
  icon: React.ReactNode;
  value: string | number;
  label: string;
  tone: "streak" | "xp" | "league";
}) {
  const badge =
    tone === "streak"
      ? "bg-streak"
      : tone === "xp"
        ? "bg-lemon"
        : "bg-candy-500";
  return (
    <div className="flex min-w-0 flex-1 flex-col items-center gap-1.5 rounded-[18px] border-2 border-choco-900 bg-white px-2 py-3 shadow-[0_3px_0_#3B2218]">
      <span
        className={cn(
          "grid size-9 shrink-0 place-items-center rounded-full border-2 border-choco-900",
          badge,
        )}
        aria-hidden="true"
      >
        {icon}
      </span>
      <span className="font-pixel text-base font-bold leading-none text-choco-900 tabular-nums">
        {value}
      </span>
      <span className="text-[10px] font-bold uppercase tracking-wide text-choco-600">
        {label}
      </span>
    </div>
  );
}

export function CurrentLessonCard({
  lesson,
  unitIndex,
  className,
}: {
  lesson: Lesson | null;
  unitIndex?: number;
  className?: string;
}) {
  const completed = useProgress((s) => s.completed);
  const streak = useProgress((s) => s.streak);
  const xp = useProgress((s) => s.xp);
  const gems = useProgress((s) => s.gems);

  const activeId = firstPlayableId(completed);
  const active = lesson ?? (activeId ? (getLesson(activeId) ?? null) : null);

  // Nol state: semua blok sudah selesai.
  if (!active) {
    return (
      <div
        className={cn(
          "rounded-[24px] border-3 border-choco-900 bg-gradient-to-b from-white to-choco-line p-5 shadow-[0_6px_0_#3B2218]",
          className,
        )}
      >
        <p className="font-pixel text-lg font-bold text-choco-900">
          Semua blok sudah kamu tuntaskan 🎉
        </p>
        <p className="mt-1 text-sm font-semibold text-choco-600">
          Buka Arena untuk tantangan mingguan, atau Kisah untuk cerita baru.
        </p>
        <div className="mt-4 flex gap-2">
          <Link
            to="/raffle"
            className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-full border-2 border-choco-900 bg-candy-700 px-5 py-3 font-pixel text-sm font-bold text-white shadow-[0_3px_0_#3B2218] transition-all hover:bg-candy-800 active:translate-y-0.5 active:shadow-none"
          >
            Buka Arena
          </Link>
          <Link
            to="/kisah"
            className="inline-flex min-h-11 items-center justify-center rounded-full border-2 border-choco-900 bg-white px-5 py-3 font-pixel text-sm font-bold text-choco-900 shadow-[0_3px_0_#3B2218] transition-all hover:bg-candy-50 active:translate-y-0.5 active:shadow-none"
          >
            Kisah
          </Link>
        </div>
      </div>
    );
  }

  const { n, total } = blockNumberOf(active.id);
  const pct = total > 0 ? (completed.length / total) * 100 : 0;
  const unitNo = unitIndex ?? UNITS.findIndex((u) => u.id === active.unitId) + 1;
  const unit = UNITS.find((u) => u.id === active.unitId);
  const inUnit = unit ? unit.lessons.filter((l) => l.kind !== "chest") : [];
  const posInUnit = unit ? inUnit.findIndex((l) => l.id === active.id) + 1 : 0;

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      {/* Kartu utama */}
      <div className="rounded-[24px] border-3 border-choco-900 bg-gradient-to-b from-white to-choco-line p-4 shadow-[0_6px_0_#3B2218] sm:p-5">
        <div className="flex items-start gap-3">
          <div className="min-w-0 flex-1">
            <p className="font-pixel text-[10px] font-bold uppercase tracking-wider text-candy-700">
              Sedang dipelajari
            </p>
            <h2 className="mt-1 truncate font-pixel text-xl font-bold leading-tight text-choco-900 sm:text-2xl">
              {active.title}
            </h2>
            <p className="mt-1 text-xs font-semibold text-choco-600">
              Rute {unitNo} · Blok {n} dari {total}
              {inUnit.length > 0 ? ` · ${posInUnit}/${inUnit.length} di rute ini` : ""}
            </p>
          </div>
          <ProgressRing value={pct} size={72} stroke={8} />
        </div>

        <div className="mt-4 flex items-center gap-2">
          <Link
            to="/lesson/$lessonId"
            params={{ lessonId: active.id }}
            className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-full border-2 border-choco-900 bg-candy-700 px-5 py-3 font-pixel text-sm font-bold text-white shadow-[0_3px_0_#3B2218] transition-all hover:bg-candy-800 active:translate-y-0.5 active:shadow-none"
          >
            Lanjut belajar
            <ArrowRight className="size-4 stroke-[2.5]" aria-hidden="true" />
          </Link>
          <Link
            to="/profile"
            aria-label="Lihat progres lengkap"
            className="grid min-h-11 min-w-11 shrink-0 place-items-center rounded-full border-2 border-choco-900 bg-white font-bold text-choco-900 shadow-[0_3px_0_#3B2218] transition-all hover:bg-candy-50 active:translate-y-0.5 active:shadow-none"
          >
            <span aria-hidden="true" className="text-lg leading-none">
              ⋯
            </span>
          </Link>
        </div>
      </div>

      {/* Tiga kartu statistik */}
      <div className="flex gap-2.5">
        <StatCard
          tone="streak"
          icon={<Fire className="size-4.5 text-choco-900" weight="fill" />}
          value={streak}
          label="Streak"
        />
        <StatCard
          tone="xp"
          icon={<Sparkles className="size-4.5 text-choco-900" />}
          value={xp}
          label="Total XP"
        />
        <StatCard
          tone="league"
          icon={<Trophy className="size-4.5 text-white" weight="fill" />}
          value={formatGems(gems)}
          label="Emas"
        />
      </div>
    </div>
  );
}

/** Dipakai kalau nanti mau menampilkan nyawa di kartu (belum dipakai). */
export const CARD_MAX_HEARTS = MAX_HEARTS;
