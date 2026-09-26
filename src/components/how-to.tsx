import { BookOpenText, Compass, Handshake, Heart, Hexagon, Signpost } from "@/lib/kicon";
import type { ComponentType } from "react";

type IconType = ComponentType<{ className?: string; weight?: "bold" | "fill" | "regular" }>;

export type HowToItem = {
  title: string;
  body: string;
  Icon: IconType;
};

export const HOW_TO_CORE: HowToItem[] = [
  {
    title: "Mulai dari pelajaran",
    body: "Tombol hijau di Belajar. Baca dulu, baru kuis. Sekitar 3 menit.",
    Icon: Compass,
  },
  {
    title: "Nyawa untuk kuis",
    body: "Salah jawab, nyawa berkurang. Pulih sendiri. Kalau nyawa habis, kamu tetap bisa baca Kisah karena Kisah tidak memakai nyawa.",
    Icon: Heart,
  },
  {
    title: "Rute terbuka berurutan",
    body: "Node terkunci artinya selesaikan pelajaran sebelumnya. Jangan lompat.",
    Icon: Signpost,
  },
];

export const HOW_TO_MORE: HowToItem[] = [
  {
    title: "Koin",
    body: "Dari pelajaran, misi, dan kisah. Dipakai di Toko. Bukan uang, bukan investasi.",
    Icon: Hexagon,
  },
  {
    title: "Kisah & bedah",
    body: "Cerita dan kasus nyata supaya klaim nggak ditelan mentah. Bukan sinyal trading.",
    Icon: BookOpenText,
  },
  {
    title: "Teman",
    body: "Contoh komunitas untuk latihan. Bukan pengguna live.",
    Icon: Handshake,
  },
];

export function HowToList({ extra = false }: { extra?: boolean }) {
  const items = extra ? [...HOW_TO_CORE, ...HOW_TO_MORE] : HOW_TO_CORE;
  return (
    <ol className="flex flex-col gap-4">
      {items.map((item, i) => (
        <li key={item.title} className="flex gap-3">
          <span className="mt-0.5 grid size-10 shrink-0 place-items-center rounded-xl bg-candy-100 border-2 border-choco-900 text-candy-700 shadow-[0_2px_0_#3B2218]">
            <item.Icon className="size-5" weight="fill" />
          </span>
          <div className="min-w-0">
            <p className="font-bold leading-tight">
              <span className="mr-1.5 text-sm font-medium tabular-nums text-muted">{i + 1}.</span>
              {item.title}
            </p>
            <p className="mt-1 text-sm leading-5 text-muted">{item.body}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
