import { ACCESSORIES, ACCESSORY_BY_ID, SLOT_LABEL, type AccessorySlot } from "@/lib/accessories";

export type ShopItem = {
  id: string;
  name: string;
  blurb: string;
  cost: number;
  kind: "hearts" | "freeze" | "outfit";
  slot?: AccessorySlot;
};

export const HEART_REFILL_COST = 80;
export const FREEZE_COST = 50;

export const SHOP_ITEMS: ShopItem[] = [
  {
    id: "hearts",
    name: "Pulihkan nyawa",
    blurb: "Nyawamu langsung kembali penuh.",
    cost: HEART_REFILL_COST,
    kind: "hearts",
  },
  {
    id: "freeze",
    name: "Pelindung streak",
    blurb: "Lindungi streak ketika kamu melewatkan satu hari. Dipakai otomatis.",
    cost: FREEZE_COST,
    kind: "freeze",
  },
  ...ACCESSORIES.map((acc) => ({
    id: acc.id,
    name: acc.name,
    blurb: acc.blurb,
    cost: acc.cost,
    kind: "outfit" as const,
    slot: acc.slot,
  })),
];

export const OUTFIT_LABEL: Record<string, string> = Object.fromEntries(
  ACCESSORIES.map((acc) => [acc.id, acc.name]),
);

export { SLOT_LABEL, ACCESSORY_BY_ID };
