#!/usr/bin/env node
/**
 * Regenerates public/sitemap.xml from the curriculum + stories source of truth.
 * Run: node scripts/generate-sitemap.mjs   (after changing units or stories)
 */
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const BASE = "https://web3min.com";

const stories = [...readFileSync(join(ROOT, "src/lib/stories.ts"), "utf8").matchAll(/^\s*id: "([^"]+)"/gm)].map((m) => m[1]);
const lessons = [...readFileSync(join(ROOT, "src/lib/curriculum.ts"), "utf8").matchAll(/\bid: "([a-z0-9-]+)"/g)].map((m) => m[1]);

const urls = [
  { loc: "/", priority: "1.0" },
  { loc: "/kisah", priority: "0.8" },
  { loc: "/cara", priority: "0.7" },
  { loc: "/about", priority: "0.6" },
  { loc: "/privacy", priority: "0.4" },
  ...stories.map((id) => ({ loc: `/kisah/${id}`, priority: "0.7" })),
  ...lessons.map((id) => ({ loc: `/lesson/${id}`, priority: "0.5" })),
];

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map((u) => `  <url>\n    <loc>${BASE}${u.loc}</loc>\n    <changefreq>weekly</changefreq>\n    <priority>${u.priority}</priority>\n  </url>`)
  .join("\n")}
</urlset>
`;

writeFileSync(join(ROOT, "public/sitemap.xml"), xml);
console.log(`[sitemap] ${urls.length} urls written (${stories.length} stories, ${lessons.length} lessons)`);