/**
 * Tamagui config — Web3min "Gamified UI / Soft Neo-Brutalism"
 *
 * Token di sini SENGAJA dicerminkan dari `src/styles.css` (@theme Tailwind v4)
 * supaya dua sistem tidak pernah berbeda warna. Nama token mengikuti konvensi
 * web3min (candy / choco / cream), bukan nama default Tamagui.
 *
 * Animasi memakai driver CSS (`@tamagui/config/v5-css`) — TANPA reanimated,
 * karena ini app web (TanStack Start SSR), bukan native.
 *
 * ⚠️ Catatan API v5 (hasil pembacaan tipe, bukan tebakan):
 * - `defaultConfig` hanya membawa `media`, `shorthands`, `themes`, `tokens`,
 *   `fonts`, `selectionStyles`, `settings`.
 * - `defaultConfig.tokens` HANYA berisi `radius`, `zIndex`, `space`, `size` —
 *   tidak ada `color`. Tapi menambah `tokens.color` sendiri SAH (tipe
 *   `GenericTamaguiConfig['tokens']` menerimanya), dan itu WAJIB supaya
 *   `$choco900` / `$pinkDark` dikenali: `ColorTokenBase` membaca
 *   `GetTokenString<keyof Tokens['color']>`.
 * - Warna theme di v5 memakai key tetap (color1..12, accentBackground, dst),
 *   jadi warna brand TIDAK ditumpuk ke theme — cukup di `tokens.color`.
 */
import { createTamagui } from "tamagui";
import { defaultConfig } from "@tamagui/config/v5";
import { animations } from "@tamagui/config/v5-css";

/** Skala spasi web3min: 4 / 8 / 12 / 16 / 24 / 32 / 48 (DESIGN-SYSTEM.md §Spacing). */
const space = {
  0: 0,
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 24,
  6: 32,
  7: 48,
  true: 16,
};

/** Radius web3min (DESIGN-SYSTEM.md §Spacing): sm 10 · md 14 · lg 22 · xl 28 · 2xl 32 · pill 9999. */
const radius = {
  0: 0,
  1: 10,
  2: 14,
  3: 22,
  4: 28,
  5: 32,
  6: 9999,
  true: 14,
};

/** Warna web3min — cermin dari `@theme` di `src/styles.css`. */
const color = {
  cream: "#FFF6EE",
  choco900: "#3B2218",
  choco700: "#4E3125",
  choco600: "#6B4A3A",
  choco500: "#8A6552",
  candy400: "#F26A99",
  candy500: "#E8437F",
  candy600: "#D62A78",
  candy700: "#B01F62",
  candy800: "#85174A",
  candy900: "#6E1239",
  okInk: "#17805F",
  warnInk: "#8A6100",
  errInk: "#B3272C",
  // Alias semantik supaya komponen tidak menulis hex mentah.
  pink: "#E8437F",
  pinkDark: "#B01F62",
  pinkDarker: "#85174A",
  disabledSurface: "#EDE4DC",
};

/** Font web3min — cermin dari `@theme` Tailwind (Space Grotesk + Inter, tepat 2 keluarga).
 *  Bentuk mengikuti `defaultConfig.fonts.body`: family + lineHeight + weight + size
 *  (tanpa `face`, karena app web memakai font dari <link> Google Fonts di __root.tsx). */
const FONT_INTER = "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
const FONT_SPACE = "'Space Grotesk', Inter, sans-serif";

const fonts = {
  body: {
    family: FONT_INTER,
    size: { 1: 12, 2: 14, 3: 16, 4: 18, true: 16 },
    lineHeight: { 1: 18, 2: 20, 3: 24, 4: 26, true: 24 },
    weight: { 1: "400", 3: "600", 4: "700", true: "400" },
    letterSpacing: { 1: 0, true: 0 },
  },
  heading: {
    family: FONT_SPACE,
    size: { 1: 12, 2: 14, 3: 16, 4: 20, 5: 24, 6: 30, 7: 40, true: 16 },
    lineHeight: { 1: 16, 2: 18, 3: 22, 4: 26, 5: 30, 6: 36, 7: 44, true: 22 },
    weight: { 1: "500", 3: "600", 4: "700", true: "700" },
    letterSpacing: { 1: 0, true: 0 },
  },
};

export const WEB3MIN_FONT_HEADING = FONT_SPACE;
export const WEB3MIN_FONT_BODY = FONT_INTER;

const tamaguiConfig = createTamagui({
  ...defaultConfig,
  animations,
  fonts,
  tokens: {
    ...defaultConfig.tokens,
    space,
    radius,
    color,
  },
  themes: {
    ...defaultConfig.themes,
    // Tema web3min: terang krem, teks cokelat, aksen pink.
    // (AGENTS.md: jangan dark mode. Jangan ganti pink brand.)
    light: {
      ...defaultConfig.themes.light,
      background: "#FFF6EE",
      backgroundHover: "#FDEEDF",
      backgroundPress: "#F2E4D8",
      color: "#3B2218",
      colorHover: "#4E3125",
      borderColor: "#3B2218",
      borderColorHover: "#4E3125",
      placeholderColor: "#9C7A68",
    },
  },
});

export type Conf = typeof tamaguiConfig;

declare module "tamagui" {
  interface TamaguiCustomConfig extends Conf {}
}

export default tamaguiConfig;
