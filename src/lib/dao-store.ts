import { create } from "zustand";
import { persist } from "zustand/middleware";

/**
 * Status "sudah gabung" komunitas DAO — SENGAJA hanya di localStorage (sesuai
 * scope fitur: tidak ada klaim server yang perlu dicatat). Key persist
 * `web3min-dao-v1` TERPISAH dari store utama (`web3min-v2`) supaya tidak
 * menambah migrasi pada state besar yang sudah ada.
 *
 * Halaman `/dao` hanya merender status ini setelah `useHydrated()` true, jadi
 * tidak ada hydration mismatch: server & render-pertama klien sama-sama
 * menampilkan skeleton.
 */
type DaoState = {
  joined: string[];
  markJoined: (id: string) => void;
};

export const useDaoStore = create<DaoState>()(
  persist(
    (set) => ({
      joined: [],
      markJoined: (id) =>
        set((s) => (s.joined.includes(id) ? s : { ...s, joined: [...s.joined, id] })),
    }),
    { name: "web3min-dao-v1" },
  ),
);
