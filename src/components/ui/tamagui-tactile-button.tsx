/**
 * Proof-of-concept: tombol taktil web3min versi Tamagui.
 *
 * Tujuan: membuktikan Tamagui 2.7.7 jalan di TanStack Start SSR + Vite 8
 * TANPA mengubah satu komponen produksi pun.
 *
 * ⚠️ Jebakan yang SUDAH terukur di browser (bukan dugaan):
 * 1. `Button` Tamagui membawa sub-theme sendiri (`light_Button`), sehingga
 *    `color`/`borderColor` dari theme root bisa tertimpa. Border & warna teks
 *    ditulis EKSPLISIT memakai token web3min (`$choco900`, hex langsung).
 * 2. `fontFamily="$heading"` pada `Button` TIDAK menghasilkan class font —
 *    yang terpasang hanya `_ff-f-family` (butuh `--f-family` dari `.font_heading`
 *    yang tidak pernah dipasang). Solusinya: pakai `Text` dengan
 *    `fontFamily="$heading"` + `fontSize` token, dan pasang di elemen teksnya.
 *
 * Aturan desain yang dipatuhi (DESIGN-SYSTEM.md):
 * - border solid 2px `choco-900`  → `borderColor="$choco900"`
 * - hard slab blur NOL            → `boxShadow: "0 4px 0 #3B2218"`
 * - radius 14px (md)              → `rounded="$2"`
 * - tap target >= 44px            → `minH={44}`
 * - label putih hanya di ramp gelap (WCAG AA) → `#B01F62` (6.53:1)
 * - font heading Space Grotesk    → `Text fontFamily="$heading"`
 */
import { Button, Text, XStack } from "tamagui";

export function TamaguiTactileButton({
  children,
  onPress,
  disabled,
}: {
  children: string;
  onPress?: () => void;
  disabled?: boolean;
}) {
  const labelColor = disabled ? "#6B4A3A" : "#FFFFFF";
  const fill = disabled ? "#EDE4DC" : "#B01F62";

  return (
    <Button
      onPress={onPress}
      disabled={disabled}
      minH={44}
      px="$5"
      borderWidth={2}
      borderColor="$choco900"
      rounded="$2"
      bg={fill}
      // Hard slab, blur NOL — inti gaya "Gamified UI / Soft Neo-Brutalism".
      boxShadow="0 4px 0 #3B2218"
      pressStyle={{
        transform: [{ translateY: 2 }],
        boxShadow: "0 1px 0 #3B2218",
      }}
      hoverStyle={{ bg: disabled ? "#EDE4DC" : "#85174A" }}
    >
      <XStack items="center" gap="$2">
        <Text
          fontFamily="$heading"
          fontWeight="700"
          fontSize={15}
          lineHeight={20}
          color={labelColor}
        >
          {children}
        </Text>
      </XStack>
    </Button>
  );
}
