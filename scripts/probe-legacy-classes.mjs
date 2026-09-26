import { chromium } from "playwright";

const BASE = "http://127.0.0.1:5237";
const browser = await chromium.launch({
  executablePath: "/usr/bin/google-chrome",
  headless: true,
  args: ["--no-sandbox", "--disable-setuid-sandbox"],
});

// Definitive: walk the live DOM and collect every class token that actually
// exists, then check whether the legacy white-on-pink selectors are among them.
const all = new Set();
for (const route of ["/", "/kisah", "/cara", "/about", "/leaderboard", "/profile", "/shop"]) {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  try {
    await page.goto(BASE + route, { waitUntil: "domcontentloaded", timeout: 45000 });
    await page.waitForTimeout(2500);
    const toks = await page.evaluate(() => {
      const s = new Set();
      for (const el of document.querySelectorAll("*")) {
        for (const c of el.classList) s.add(c);
      }
      return [...s];
    });
    for (const t of toks) all.add(t);
  } catch (e) {
    console.log(`  ${route}: ${e.message}`);
  }
  await page.close();
}
await browser.close();

console.log(`distinct class tokens seen in live DOM: ${all.size}`);
for (const probe of ["bn", "now", "ic", "sk", "bubble", "btn-candy", "btn-gummy", "pill"]) {
  console.log(`  "${probe}" present in DOM: ${all.has(probe)}`);
}