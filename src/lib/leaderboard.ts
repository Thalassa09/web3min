import { weekId } from "@/lib/time";

const BOTS = [
  "Sari",
  "Dimas",
  "Nisa",
  "justin_eth",
  "Putri",
  "Farhan",
  "Dewi",
  "Budi",
  "Intan",
  "Agus",
  "Aya",
  "Rizky",
];

function hash(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export type BoardRow = { name: string; xp: number; you?: boolean };

export function weeklyBoard(userName: string, weeklyXp: number): BoardRow[] {
  const week = weekId();
  const rows: BoardRow[] = BOTS.map((name) => ({
    name,
    xp: 40 + (hash(name + week) % 380),
  }));
  rows.push({ name: userName || "Kamu", xp: weeklyXp, you: true });
  rows.sort((a, b) => b.xp - a.xp || a.name.localeCompare(b.name));
  return rows;
}
