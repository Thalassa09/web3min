/**
 * Judul & deskripsi situs — SATU SUMBER untuk beranda, manifest PWA, dan kartu
 * share. Jangan tulis ulang string ini di tempat lain: `index.tsx` dulu menyalin
 * judulnya persis, jadi mengubah satu tempat diam-diam membuat yang lain basi.
 *
 * Kenapa kalimatnya begini (diukur, bukan selera):
 *  - "gratis" WAJIB ada: konten tidak digerbang bayar (supporter = donasi
 *    opsional: badge + isi nyawa 4× + tiket 3×), dan "gratis" kata kunci yang
 *    paling dicari pemula Indonesia.
 *  - "anti-tipu" = pain point terkuat. 14 kasus on-chain di arsip Kisah.
 *  - Angka 20 rute / 128 blok DIVERIFIKASI dari kurikulum
 *    (`sequentialNodes()` = 128, `UNITS.length` = 20), bukan dikarang.
 *  - "bahasa santai" dulu muncul di judul DAN deskripsi (membuang ruang
 *    deskripsi yang hanya ~160 char ditampilkan Google).
 *  - Judul 51 char, deskripsi 156 char — di dalam batas tampil Google.
 */
export const DEFAULT_SITE_TITLE = "web3min | Belajar Web3 dari nol, gratis & anti-tipu";
export const DEFAULT_DESCRIPTION =
  "Kenali penipu crypto sebelum kena. 20 rute berjenjang, 128 blok latihan interaktif. Dompet, DeFi, sampai NFT. Gratis, tanpa modal, tanpa perlu dompet asli.";
export const BASE_URL = "https://web3min.com";
export const DEFAULT_OG_IMAGE = `${BASE_URL}/og.jpg`;

export interface MetaOptions {
  title?: string;
  description?: string;
  path?: string;
  image?: string;
  type?: string;
}

export function buildMeta(options?: MetaOptions) {
  const title = options?.title ? options.title : DEFAULT_SITE_TITLE;
  const description = options?.description || DEFAULT_DESCRIPTION;
  const rawPath = options?.path || "/";
  const path = rawPath.startsWith("/") ? rawPath : `/${rawPath}`;
  const canonicalUrl = `${BASE_URL}${path === "/" ? "" : path}`;
  const image = options?.image || DEFAULT_OG_IMAGE;
  const isDefaultImage = !options?.image;
  const type = options?.type || "website";

  return {
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:type", content: type },
      { property: "og:site_name", content: "web3min" },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:url", content: canonicalUrl },
      { property: "og:image", content: image },
      // og:image:width/height hanya untuk kartu default og.jpg (1200x630).
      // Gambar kustom (mis. per Kisah) dipakai apa adanya, tanpa klaim ukuran.
      ...(isDefaultImage
        ? [
            { property: "og:image:width", content: "1200" },
            { property: "og:image:height", content: "630" },
          ]
        : []),
      { property: "og:image:alt", content: title },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
      { name: "twitter:image", content: image },
    ],
    links: [
      { rel: "canonical", href: canonicalUrl },
    ],
  };
}
