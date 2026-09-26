import { chromium } from "playwright";

const BASE = process.argv[2] ?? "http://127.0.0.1:5211";
const browser = await chromium.launch({
  executablePath: "/usr/bin/google-chrome",
  headless: true,
  args: ["--no-sandbox", "--disable-setuid-sandbox"],
});

const out = {};
for (const [label, route] of [["home", "/"], ["leaderboard", "/leaderboard"]]) {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await ctx.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(String(e).split("\n")[0].slice(0, 120)));
  await page.goto(BASE + route, { waitUntil: "load", timeout: 60000 });
  await page.waitForTimeout(4000);
  out[label] = { pageErrors: errors };
  await ctx.close();
}
await browser.close();
console.log(JSON.stringify(out, null, 2));