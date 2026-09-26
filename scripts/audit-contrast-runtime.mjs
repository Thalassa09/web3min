import { chromium } from "playwright";

const BASE = process.argv[2] ?? "http://127.0.0.1:5220";
const ROUTES = ["/", "/leaderboard", "/kisah", "/cara", "/lesson/1", "/profile", "/settings"];

const browser = await chromium.launch({
  executablePath: "/usr/bin/google-chrome",
  headless: true,
  args: ["--no-sandbox", "--disable-setuid-sandbox"],
});

const PROBE = `() => {
  const parse = (c) => { const m = c.match(/rgba?\\(([^)]+)\\)/); if (!m) return null; return m[1].split(",").map(Number); };
  const lum = ([r,g,b]) => { const f = (v) => { v /= 255; return v <= 0.03928 ? v/12.92 : Math.pow((v+0.055)/1.055, 2.4); };
    return 0.2126*f(r) + 0.7152*f(g) + 0.0722*f(b); };
  const ratio = (a,b) => { const [hi,lo] = [lum(a), lum(b)].sort((x,y)=>y-x); return (hi+0.05)/(lo+0.05); };
  const bgOf = (el) => {
    let n = el;
    while (n && n !== document.documentElement) {
      const c = parse(getComputedStyle(n).backgroundColor);
      if (c && (c[3] === undefined || c[3] > 0.95)) return c.slice(0,3);
      n = n.parentElement;
    }
    return [255,246,238];
  };

  // group failures by the exact (fg, bg, size) combo so duplicates collapse
  const groups = new Map();
  for (const el of document.querySelectorAll("h1,h2,h3,p,span,a,button,li,label,strong")) {
    const txt = (el.textContent || "").trim();
    if (!txt || txt.length > 120) continue;
    if (!el.offsetParent && getComputedStyle(el).position !== "fixed") continue;
    const cs = getComputedStyle(el);
    const fg = parse(cs.color); if (!fg) continue;
    const bg = bgOf(el);
    const r = ratio(fg.slice(0,3), bg);
    const px = parseFloat(cs.fontSize);
    const bold = parseInt(cs.fontWeight) >= 700;
    const need = (px >= 24 || (px >= 18.66 && bold)) ? 3 : 4.5;
    if (r >= need) continue;
    const hex = (a) => "#" + a.map(v => Math.round(v).toString(16).padStart(2,"0")).join("").toUpperCase();
    const key = hex(fg.slice(0,3)) + " on " + hex(bg) + " @" + px + "px";
    const g = groups.get(key) || { key, ratio: +r.toFixed(2), need, count: 0, example: txt.slice(0, 38) };
    g.count++;
    groups.set(key, g);
  }
  return [...groups.values()].sort((a,b) => b.count - a.count);
}`;

const all = new Map();
for (const route of ROUTES) {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await page.goto(BASE + route, { waitUntil: "domcontentloaded", timeout: 60000 });
  await page.waitForTimeout(3000);
  const groups = await page.evaluate(`(${PROBE})()`);
  for (const g of groups) {
    const cur = all.get(g.key) || { ...g, routes: [] };
    cur.count = Math.max(cur.count, g.count);
    if (!cur.routes.includes(route)) cur.routes.push(route);
    all.set(g.key, cur);
  }
  await page.close();
}

await browser.close();
console.log("DISTINCT contrast failures (grouped by fg/bg/size):\n");
for (const g of [...all.values()].sort((a, b) => b.count - a.count)) {
  console.log(`  ${String(g.ratio).padStart(5)}:1 (need ${g.need})  n=${String(g.count).padStart(3)}  ${g.key}`);
  console.log(`         e.g. ${JSON.stringify(g.example)}  routes: ${g.routes.join(", ")}`);
}