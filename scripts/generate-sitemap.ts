/**
 * Regenerates public/sitemap.xml from the real curriculum + stories exports.
 * Runs during `npm run build` via `npx tsx` so the sitemap can never drift from
 * the content source of truth.
 */
import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { STORIES } from "../src/lib/stories";
import { UNITS } from "../src/lib/curriculum";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const BASE = "https://web3min.com";

const lessonIds = UNITS.flatMap((u) => u.lessons.filter((l) => l.kind !== "chest").map((l) => l.id));

const urls = [
  { loc: "/", priority: "1.0" },
  { loc: "/kisah", priority: "0.8" },
  { loc: "/cara", priority: "0.7" },
  { loc: "/about", priority: "0.6" },
  { loc: "/privacy", priority: "0.4" },
  ...STORIES.map((s) => ({ loc: `/kisah/${s.id}`, priority: "0.7" })),
  ...lessonIds.map((id) => ({ loc: `/lesson/${id}`, priority: "0.5" })),
];

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) =>
      `  <url>\n    <loc>${BASE}${u.loc}</loc>\n    <changefreq>weekly</changefreq>\n    <priority>${u.priority}</priority>\n  </url>`,
  )
  .join("\n")}
</urlset>
`;

writeFileSync(join(ROOT, "public/sitemap.xml"), xml);
console.log(
  `[sitemap] ${urls.length} urls — ${STORIES.length} stories, ${lessonIds.length} lessons, ${urls.length - STORIES.length - lessonIds.length} static`,
);