import { chromium } from "playwright";

const BASE = process.argv[2] ?? "http://127.0.0.1:5221";
const browser = await chromium.launch({
  executablePath: "/usr/bin/google-chrome",
  headless: true,
  args: ["--no-sandbox", "--disable-setuid-sandbox"],
});

/** Precise check: read the element's OWN computed background (solid fills only)
 *  or its nearest opaque ancestor, and skip elements sitting on an image or a
 *  translucent scrim — those need pixel sampling, which is unreliable at 10px. */
const PROBE = `() => {
  const parse = (c) => { const m = c.match(/rgba?\\(([^)]+)\\)/); if (!m) return null; return m[1].split(",").map(Number); };
  const lum = ([r,g,b]) => { const f=(v)=>{v/=255;return v<=0.03928?v/12.92:Math.pow((v+0.055)/1.055,2.4);};
    return 0.2126*f(r)+0.7152*f(g)+0.0722*f(b); };
  const ratio = (a,b) => { const [hi,lo]=[lum(a),lum(b)].sort((x,y)=>y-x); return (hi+0.05)/(lo+0.05); };

  const CREAM = [255, 246, 238];
  const over = (top, base, a) => top.slice(0,3).map((v, i) => Math.round(v * a + base[i] * (1 - a)));

  // Composite every translucent layer down to the page ground so bg-white/92
  // is measured as what it really paints, instead of being skipped.
  const solidBg = (el) => {
    const layers = [];
    let n = el;
    while (n && n !== document.documentElement) {
      const cs = getComputedStyle(n);
      // gradients/shaders cannot be reduced to one colour -> those need pixel sampling
      if (cs.backgroundImage !== "none" && cs.backgroundImage.indexOf("gradient") !== -1) return null;
      const c = parse(cs.backgroundColor);
      if (c && !(c[3] === 0)) layers.push(c);
      n = n.parentElement;
    }
    let out = CREAM;
    for (let i = layers.length - 1; i >= 0; i--) {
      const c = layers[i];
      const a = c[3] === undefined ? 1 : c[3];
      out = over(c, out, a);
      if (a >= 0.999) break;
    }
    return out;
  };

  const rows = [];
  for (const el of document.querySelectorAll("span,h1,h2,h3,p,a,button,label,strong,li,div")) {
    if (el.children.length) continue;
    const txt = (el.textContent || "").trim();
    if (!txt || txt.length > 60) continue;
    const cs = getComputedStyle(el);
    if (cs.visibility === "hidden" || cs.display === "none" || parseFloat(cs.opacity) < 0.99) continue;
    const r = el.getBoundingClientRect();
    if (r.width < 4 || r.height < 4) continue;
    const fg = parse(cs.color); if (!fg) continue;
    const bg = solidBg(el); if (!bg) continue;
    const px = parseFloat(cs.fontSize);
    const bold = parseInt(cs.fontWeight) >= 700;
    const need = (px >= 24 || (px >= 18.66 && bold)) ? 3 : 4.5;
    const rr = ratio(fg.slice(0,3), bg);
    rows.push({ txt: txt.slice(0,32), px, fg: "#"+(fg.slice(0,3).map(v=>v.toString(16).padStart(2,"0")).join("")).toUpperCase(),
      bg: "#"+(bg.map(v=>v.toString(16).padStart(2,"0")).join("")).toUpperCase(), ratio:+rr.toFixed(2), need, pass: rr>=need });
  }
  return rows;
}`;

const ROUTES = ["/", "/leaderboard", "/kisah", "/cara", "/lesson/1", "/profile", "/masuk", "/settings"];
const fails = new Map();
let measured = 0;

for (const route of ROUTES) {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await page.goto(BASE + route, { waitUntil: "domcontentloaded", timeout: 60000 }).catch(() => {});
  await page.waitForTimeout(2200);
  const maxScroll = await page.evaluate(() => document.body.scrollHeight - innerHeight).catch(() => 0);
  for (let y = 0, i = 0; y <= Math.max(0, maxScroll) && i < 7; y += 850, i++) {
    await page.evaluate((yy) => window.scrollTo(0, yy), y);
    await page.waitForTimeout(700);
    const rows = await page.evaluate(`(${PROBE})()`);
    for (const row of rows) {
      measured++;
      if (row.pass) continue;
      const k = `${row.fg}|${row.bg}|${row.px}`;
      const cur = fails.get(k) || { ...row, routes: new Set(), n: 0 };
      cur.n++; cur.routes.add(route);
      fails.set(k, cur);
    }
  }
  await page.close();
}

await browser.close();
console.log(`measured ${measured} text nodes with a SOLID, opaque background (gradients/scrims skipped)\n`);
if (!fails.size) {
  console.log("no contrast failures");
} else {
  for (const f of [...fails.values()].sort((a, b) => b.n - a.n)) {
    console.log(`  ${String(f.ratio).padStart(5)}:1 (need ${f.need})  n=${String(f.n).padStart(3)}  ${f.fg} on ${f.bg} @${f.px}px`);
    console.log(`         ${JSON.stringify(f.txt)}  routes: ${[...f.routes].join(",")}`);
  }
}