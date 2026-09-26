import { chromium } from "playwright";

const BASE = process.argv[2] ?? "http://127.0.0.1:5199";
const browser = await chromium.launch({
  executablePath: "/usr/bin/google-chrome",
  headless: true,
  args: ["--no-sandbox", "--disable-setuid-sandbox"],
});

/** CSS `font-size: 15px` on html would shrink every rem-based size. Probe the
 *  rendered text, not the stylesheet, so a regression cannot hide behind a rule. */
const routes = ["/", "/cara", "/about", "/kisah", "/leaderboard"];
const out = {};

for (const r of routes) {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await page.goto(BASE + r, { waitUntil: "domcontentloaded", timeout: 60000 });
  await page.waitForTimeout(2500);
  out[r] = await page.evaluate(() => {
    const para = document.querySelector("main p, main li, main span");
    return {
      htmlFontSize: getComputedStyle(document.documentElement).fontSize,
      bodyFontSize: getComputedStyle(document.body).fontSize,
      sampleTextPx: para ? getComputedStyle(para).fontSize : null,
    };
  });
  await page.close();
}

// narrow-screen sanity: 360px must not overflow horizontally
const p360 = await browser.newPage({ viewport: { width: 360, height: 780 } });
await p360.goto(BASE + "/", { waitUntil: "domcontentloaded" });
await p360.waitForTimeout(2500);
const overflow = await p360.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
await p360.close();

await browser.close();
console.log(JSON.stringify({ routes: out, horizontalOverflowAt360px: overflow }, null, 2));