import { chromium } from "playwright";
const BASE = "https://web3min.com";
const KEY = "web3min-v2";
const browser = await chromium.launch({
  executablePath: "/usr/bin/google-chrome",
  headless: true,
  args: ["--no-sandbox", "--disable-setuid-sandbox"],
});
const ctx = await browser.newContext({ viewport: { width: 390, height: 800 } });
await ctx.addInitScript(([k]) => {
  const seed = {
    state: {
      onboarded: true,
      username: "probe",
      dailyGoal: 3,
      introSeen: true,
      guideSeen: true,
      coachSeen: true,
      hearts: 5,
      gems: 0,
      xp: 0,
      streak: 0,
      completed: [],
    },
    version: 2,
  };
  localStorage.setItem(k, JSON.stringify(seed));
}, [KEY]);
const page = await ctx.newPage();
await page.goto(BASE + "/lesson/u1-l1", { waitUntil: "load", timeout: 45000 });
await page.waitForTimeout: 0;
await page.waitForTimeout(6000);

const r = await page.evaluate(() => {
  const nodes = [...document.querySelectorAll("button[aria-expanded], details")];
  return {
    url: location.pathname,
    h1: document.querySelector("h1")?.textContent?.trim().slice(0, 60) ?? null,
    all: nodes.map((e) => ({
      t: (e.textContent || "").replace(/\s+/g, " ").trim().slice(0, 40),
      x: e.getAttribute("aria-expanded") ?? (e.tagName === "DETAILS" ? String(e.open) : "?"),
    })),
    body: document.body.innerText.replace(/\s+/g, " ").slice(0, 400),
  };
});
console.log(`url: ${r.url}`);
console.log(`h1 : "${r.h1}"`);
console.log(`kontrol akordion: ${r.all.length}`);
for (const a of r.all) console.log(`  [${a.x}] ${a.t}`);
console.log(`\nbody: "${r.body}"`);
await browser.close();