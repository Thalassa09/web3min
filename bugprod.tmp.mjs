import { chromium } from "playwright";
const BASE = "https://web3min.com";
const browser = await chromium.launch({
  executablePath: "/usr/bin/google-chrome",
  headless: true,
  args: ["--no-sandbox", "--disable-setuid-sandbox"],
});
for (const p of ["/kisah/s-dm", "/kisah/s-eth"]) {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 800 } });
  const page = await ctx.newPage();
  const t0 = Date.now();
  await page.goto(BASE + p, { waitUntil: "load", timeout: 45000 });
  const first = page.url();
  await page.waitForTimeout(4000);
  const r = await page.evaluate(() => ({
    url: location.pathname,
    title: document.title,
    body: document.body.innerText.replace(/\s+/g, " ").slice(0, 90),
  }));
  console.log(`${p}`);
  console.log(`  url saat load : ${first.replace(BASE, "")}`);
  console.log(`  url akhir     : ${r.url}  (${Date.now() - t0}ms)`);
  console.log(`  title         : ${r.title.slice(0, 60)}`);
  console.log(`  body          : ${r.body}`);
  await ctx.close();
}
await browser.close();