/**
 * Pembungkus `TamaguiProvider` — dipasang HANYA di subtree yang memakai Tamagui.
 *
 * Kenapa tidak di `__root.tsx`: diukur A/B (Langkah 19), provider di root
 * menambah **+176 KB** ke root chunk yang dimuat SETIAP halaman
 * (565 KB vs 389 KB) — padahal UI produksi belum memakai Tamagui.
 *
 * Cara pakai di komponen/route baru:
 *   <TamaguiRoot>
 *     <Text fontFamily="$heading">Halo</Text>
 *   </TamaguiRoot>
 *
 * Catatan: `defaultTheme="light"` wajib eksplisit — app ini hanya tema terang
 * (AGENTS.md: "Jangan ganti ke dark mode").
 */
import type { ReactNode } from "react";
import { TamaguiProvider } from "tamagui";
import tamaguiConfig from "@/tamagui.config";

export function TamaguiRoot({ children }: { children: ReactNode }) {
  return (
    <TamaguiProvider config={tamaguiConfig} defaultTheme="light">
      {children}
    </TamaguiProvider>
  );
}
