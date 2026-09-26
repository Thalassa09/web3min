import { chromium } from "playwright";
import { writeFileSync } from "node:fs";

const BASE = process.argv[2] ?? "http://127.0.0.1:5220";
const ROUTES = ["/", "/leaderboard", "/kisah", "/cara", "/lesson/1", "/profile", "/settings", "/masuk"];

const browser = await chromium.launch({
  executablePath: "/usr/bin/google-chrome",
  headless: true,
  args: ["--no-sandbox", "--disable-setuid-sandbox"],
});

const PROBE = `() => {
  const out = [];
  for (const el of document.querySelectorAll("h1,h2,h3,p,span,a,button,li,label,strong,div")) {
    const txt = (el.textContent || "").trim();
    if (!txt || txt.length > 90) continue;
    // leaf text nodes only (or elements whose children are all inline text)
    const isLeaf = el.children.length === 0;
    if (!isLeaf) continue;
    const cs = getComputedStyle(el);
    if (cs.visibility === "hidden" || cs.display === "none") continue;
    if (parseFloat(cs.opacity) < 0.85) continue;
    const r = el.getBoundingClientRect();
    if (r.width < 6 || r.height < 6) continue;
    out.push({
      text: txt.slice(0, 40),
      color: cs.color,
      fontSize: parseFloat(cs.fontSize),
      fontWeight: parseInt(cs.fontWeight) || 400,
      x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height),
    });
  }
  return out;
}`;

const report = {};
for (const route of ROUTES) {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1 });
  await page.goto(BASE + route, { waitUntil: "domcontentloaded", timeout: 60000 }).catch(() => {});
  await page.waitForTimeout(2500);

  // walk the page so lazy sections mount, capturing a frame at each stop
  const stops = [];
  const maxScroll = await page.evaluate(() => document.body.scrollHeight - innerHeight).catch(() => 0);
  for (let y = 0, i = 0; y <= Math.max(0, maxScroll) && i < 8; y += 900, i++) {
    await page.evaluate((yy) => window.scrollTo(0, yy), y);
    await page.waitForTimeout(900);
    const items = await page.evaluate(`(${PROBE})()`);
    const shot = `/tmp/cx_${route.replace(/[\/]/g, "_") || "home"}_${i}.png`;
    await page.screenshot({ path: shot, fullPage: false });
    stops.push({ shot, items });
  }
  report[route] = stops;
  await page.close();
}

await browser.close();
writeFileSync("/tmp/contrast-report.json", JSON.stringify(report));
const total = Object.values(report).flat().reduce((n, s) => n + s.items.length, 0);
console.log(`captured ${total} text nodes across ${ROUTES.length} routes`);