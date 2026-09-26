import { chromium } from "playwright";

const BASE = "http://127.0.0.1:5240";
const browser = await chromium.launch({
  executablePath: "/usr/bin/google-chrome",
  headless: true,
  args: ["--no-sandbox", "--disable-setuid-sandbox"],
});

const lum = (hex) => {
  const h = hex.replace("#", "");
  const ch = [0, 2, 4].map((i) => {
    const c = parseInt(h.slice(i, i + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * ch[0] + 0.7152 * ch[1] + 0.0722 * ch[2];
};
const contrast = (a, b) => {
  const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p);
  return +((x + 0.05) / (y + 0.05)).toFixed(2);
};
const rgbToHex = (s) => {
  const m = s.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
  return m ? "#" + m.slice(1, 4).map((v) => (+v).toString(16).padStart(2, "0").toUpperCase()).join("") : s;
};

const out = [];
for (const route of ["/", "/cara", "/kisah", "/leaderboard"]) {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await page.goto(BASE + route, { waitUntil: "domcontentloaded", timeout: 47294 });
  await page.waitForTimeout(2500);

  const r = await page.evaluate(() => {
    // the ACTIVE bottom-nav item: aria-current=page
    const active = document.querySelector('nav[aria-label="Navigasi Mobile"] [aria-current="page"]');
    const nav = document.querySelector('nav[aria-label="Navigasi Mobile"]');
    const lanjut = document.querySelector('nav[aria-label="Navigasi Mobile"] button[aria-label*="anjut"], nav[aria-label="Navigasi Mobile"] button[aria-label*="beranda"]');
    const csOf = (el) => {
      if (!el) return null;
      const cs = getComputedStyle(el);
      return {
        color: cs.color,
        // gradient pseudo-image; fall back to the inline/class background
        bg: cs.backgroundImage !== "none" ? cs.backgroundImage : cs.backgroundColor,
        fontSize: cs.fontSize,
        label: el.textContent?.trim().slice(0, 14) ?? "",
      };
    };
    return {
      docWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
      activeNav: csOf(active),
      lanjutBtn: csOf(lanjut),
      navCount: nav ? nav.querySelectorAll("a, button").length : 0,
    };
  });

  // Chromium reports gradients in oklab; extract stops then convert per-stop.
  const stopsOf = (bg) => [...bg.matchAll(/oklab\(([\d.]+)%?\s+([\d.-]+)\s+([\d.-]+)/g)].length
    ? [...bg.matchAll(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/g)].map((m) => "#" + m.slice(1, 4).map((v) => (+v).toString(16).padStart(2, "0").toUpperCase()).join(""))
    : [];

  out.push({
    route,
    overflowX: r.docWidth - r.clientWidth,
    navItems: r.navCount,
    activeLabel: r.activeNav?.label,
    activeFontSize: r.activeNav?.fontSize,
    activeStops: stopsOf(r.activeNav?.bg ?? ""),
    lanjutStops: stopsOf(r.lanjutBtn?.bg ?? ""),
  });
  await page.close();
}
await browser.close();

console.log(JSON.stringify(out, null, 2));
console.log("\n--- every extracted stop scored against white ---");
for (const o of out) {
  for (const [k, stops] of [["active", o.activeStops], ["lanjut", o.lanjutStops]]) {
    for (const s of stops) {
      const v = contrast(s, "#FFFFFF");
      const need = k === "lanjut" ? 4.5 : 4.5; // both carry a 10px/mono label or icon
      console.log(`  ${o.route} ${k} ${s} ${v}:1 ${v >= need ? "PASS" : "FAIL"}`);
    }
  }
}