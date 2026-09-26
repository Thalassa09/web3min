import { chromium } from "playwright";

const BASE = "http://127.0.0.1:5270";

// BlobiFloatingCompanion bails out with `if (coachActive) return null` until the
// persisted store says coachSeen (or any lesson completed). A fresh browser has
// neither, so seeding localStorage is required or every probe below is vacuous.
const SEED = {
  state: { coachSeen: true, guideSeen: true, completed: ["u1-l1"], username: "probe" },
  version: 2,
};

const browser = await chromium.launch({
  executablePath: "/usr/bin/google-chrome",
  headless: true,
  args: ["--no-sandbox", "--disable-setuid-sandbox"],
});

const results = [];
for (const vp of [{ width: 390, height: 844 }, { width: 1440, height: 900 }]) {
  const ctx = await browser.newContext({ viewport: vp });
  // seed before any app code runs
  await ctx.addInitScript((seed) => {
    localStorage.setItem("web3min-v2", JSON.stringify(seed));
  }, SEED);

  const page = await ctx.newPage();
  await page.goto(BASE + "/", { waitUntil: "domcontentloaded", timeout: 60000 });
  await page.waitForTimeout(4000);

  const r = await page.evaluate(() => {
    const out = { minus: [], minimizeTitles: [], pill: [], toel: false, blobiImg: 0, canvasSvg: 0 };
    for (const el of document.querySelectorAll("*")) {
      const t = (el.textContent || "").trim();
      const title = el.getAttribute("title") || "";
      const aria = el.getAttribute("aria-label") || "";
      if (title.includes("Kecilkan") || aria.includes("Kecilkan")) out.minimizeTitles.push(title || aria);
      if (el.tagName === "BUTTON" && t === "-") {
        const cs = getComputedStyle(el);
        out.minus.push({ bg: cs.backgroundColor, w: +el.getBoundingClientRect().width.toFixed(1) });
      }
      if (el.tagName === "SPAN" && t === "Blobi") out.pill.push(t);
      if (t === "Toel!") out.toel = true;
    }
    out.blobiImg = document.querySelectorAll('div[class*="drop-shadow-\\[0_6px_0"]').length;
    // the floating container is `fixed top-0 left-0 z-40`
    out.canvasSvg = [...document.querySelectorAll("div.fixed.z-40")].length;
    return out;
  });
  results.push({ viewport: vp.width, ...r });
  await ctx.close();
}
await browser.close();

console.log(JSON.stringify(results, null, 2));
const rendered = results.every((r) => r.toel);
console.log(`\nBlobi ACTUALLY rendered (Toel! badge found): ${rendered}`);
if (!rendered) {
  console.log("=> probe inconclusive, seeding failed");
} else {
  console.log(`minus button present: ${results.some((r) => r.minus.length)}`);
  console.log(`'Kecilkan' title present: ${results.some((r) => r.minimizeTitles.length)}`);
  console.log(`minimized 'Blobi' pill present: ${results.some((r) => r.pill.length)}`);
}