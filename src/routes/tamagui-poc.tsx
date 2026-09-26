/**
 * Halaman bukti (proof-of-concept) integrasi Tamagui.
 *
 * Tujuan: membuktikan Tamagui 2.7.7 benar-benar RENDER di TanStack Start SSR
 * + Vite 8 + React 19 — bukan cuma lolos `tsc`. Halaman ini sengaja berdiri
 * sendiri dan tidak menyentuh komponen produksi mana pun.
 *
 * Cara cek: buka /tamagui-poc, pastikan tombol tampil dengan border solid,
 * slab keras (blur nol), radius 14px, dan label putih di pink gelap.
 *
 * Halaman ini boleh dihapus kapan saja setelah verifikasi.
 */
import { createFileRoute } from "@tanstack/react-router";
import { Text, View, XStack, YStack } from "tamagui";
import { TamaguiTactileButton } from "@/components/ui/tamagui-tactile-button";

export const Route = createFileRoute("/tamagui-poc")({
  component: TamaguiPoc,
});

function TamaguiPoc() {
  return (
    <View
      flex={1}
      minH="100dvh"
      bg="$cream"
      p="$5"
      gap="$5"
      data-testid="tamagui-poc-root"
    >
      <YStack gap="$2">
        <Text fontSize={28} fontWeight="700" color="$choco900">
          Tamagui POC
        </Text>
        <Text fontSize={15} color="$choco600">
          Bukti Tamagui 2.7.7 jalan di TanStack Start SSR + Vite 8 + React 19.
        </Text>
      </YStack>

      <YStack gap="$3" maxW={420}>
        <TamaguiTactileButton>Tombol Taktil Tamagui</TamaguiTactileButton>
        <TamaguiTactileButton disabled>Tombol Disabled</TamaguiTactileButton>
      </YStack>

      <XStack gap="$3" items="center">
        <View width={48} height={48} bg="$candy500" rounded="$2" borderWidth={2} borderColor="$choco900" />
        <View width={48} height={48} bg="$candy700" rounded="$2" borderWidth={2} borderColor="$choco900" />
        <View width={48} height={48} bg="$candy900" rounded="$2" borderWidth={2} borderColor="$choco900" />
        <Text fontSize={13} color="$choco600">
          token candy-500 / 700 / 900
        </Text>
      </XStack>

      <Text fontSize={12} color="$choco500" data-testid="tamagui-poc-token-check">
        token check: cream + choco + candy terbaca
      </Text>
    </View>
  );
}
