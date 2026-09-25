export const DEFAULT_SITE_TITLE = "web3min — Belajar Web3 dari nol, bahasa santai";
export const DEFAULT_DESCRIPTION =
  "Belajar Web3 dari nol: 128 blok, 20 rute, bahasa santai. Dompet, DeFi, sampai cara ngenalin penipu.";
export const BASE_URL = "https://web3min.com";
export const DEFAULT_OG_IMAGE = `${BASE_URL}/og-image.png`;

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
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
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
