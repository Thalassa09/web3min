import { chromium } from "playwright";

const BASE = process.argv[2] ?? "http://127.0.0.1:5211";
const browser = await chromium.launch({
  executablePath: "/usr/bin/google-chrome",
  headless: true,
  args: ["--no-sandbox", "--disable-setuid-sandbox"],
});
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
const page = await ctx.newPage();
const errors = [];
page.on("pageerror", (e) => errors.push(String(e).slice(0, 140)));

// warm the SW
await page.goto(BASE + "/", { waitUntil: "load", timeout: 60000 });
await page.waitForTimeout(4000);

const swState = await page.evaluate(async () => {
  const reg = await navigator.serviceWorker.getRegistration();
  return {
    registered: !!reg,
    active: !!reg?.active,
    controller: !!navigator.serviceWorker.controller,
    scope: reg?.scope ?? null,
  };
});

// give the controller a beat to attach
await page.waitForTimeout(2000);
const controlled = await page.evaluate(() => !!navigator.serviceWorker.controller);

// Now go offline and try to open a route that was never visited.
await ctx.setOffline(true);
await page.waitForTimeout(500);

let navOutcome = "loaded";
try {
  await page.goto(BASE + "/leaderboard", { waitUntil: "load", timeout: 20000 });
} catch (e) {
  navOutcome = "FAILED: " + String(e).split("\n")[0].slice(0, 120);
}

const offlineView = await page.evaluate(() => ({
  title: document.title,
  hasShellCard: /sedang offline|lagi offline|Coba lagi/i.test(document.body.innerText),
  bodyStart: document.body.innerText.replace(/\s+/g, " ").trim().slice(0, 130),
  banner: !!document.querySelector("[data-offline='true']"),
}));

const cachesUsed = await page.evaluate(async () => {
  const keys = await caches.keys();
  const out = {};
  for (const k of keys) out[k] = (await (await caches.open(k)).keys()).length;
  return out;
});

await ctx.close();
await browser.close();
console.log(JSON.stringify({ swState, controlled, navOutcome, offlineView, cachesUsed, errors }, null, 2));