import { chromium } from "playwright";
const BASE = "https://web3min.com";
const browser = await chromium.launch({
  executablePath: "/usr/bin/google-chrome",
  headless: true,
  args: ["--no-sandbox", "--disable-setuid-sandbox"],
});
const ctx = await browser.newContext({ viewport: { width: 390, height: 800 } });
const page = await ctx.newPage();

// ── Prioritas 1: kebocoran info infra di /settings
await page.goto(BASE + "/settings", { waitUntil: "load", timeout: 45000 });
await page.waitForTimeout(5000);
const s = await page.evaluate(() => {
  const t = document.body.innerText;
  return {
    text: t.replace(/\s+/g, " ").slice(0, 700),
    host: /supabase\.co|oopfefvptezqonilpfkk|[a-z]{15,}\.supabase/i.test(t),
    region: /ap-southeast|region|singapore/i.test(t),
    ping: /\b\d+\s?ms\b|ping|latency|heartbeat/i.test(t),
    onchain: /on-?chain|on-chain/i.test(t),
  };
});
console.log("=== PRIORITAS 1: /settings ===");
console.log(`  host supabase bocor   : ${s.host ? "YA (BOCOR)" : "tidak"}`);
console.log(`  region bocor          : ${s.region ? "YA (BOCOR)" : "tidak"}`);
console.log(`  ping/heartbeat        : ${s.ping ? "YA (BOCOR)" : "tidak"}`);
console.log(`  label "on-chain"      : ${s.onchain ? "MASIH ADA" : "tidak"}`);
console.log(`  teks tampil           : "${s.text.slice(0, 230)}"`);

// ── Prioritas 2: akun test di leaderboard
await page.goto(BASE + "/leaderboard", { waitUntil: "load", timeout: 45000 });
await page.waitForTimeout(6000);
const l = await page.evaluate(() => {
  const t = document.body.innerText;
  return {
    sectest: (t.match(/sectest_\w*/gi) || []).length,
    testuser: (t.match(/testuser99/gi) || []).length,
    sample: t.replace(/\s+/g, " ").slice(0, 300),
  };
});
console.log("\n=== PRIORITAS 2: /leaderboard ===");
console.log(`  akun sectest_* : ${l.sectest} (harus 0)`);
console.log(`  akun testuser99: ${l.testuser} (harus 0)`);
console.log(`  cuplikan       : "${l.sample.slice(0, 220)}"`);

// ── Prioritas 6: overflow horizontal 360px
console.log("\n=== PRIORITAS 6: overflow horizontal @360px ===");
const ctx2 = await browser.newContext({ viewport: { width: 360, height: 800 } });
const p2 = await ctx2.newPage();
for (const r of ["/", "/raffle", "/rantai", "/shop", "/profile"]) {
  await p2.goto(BASE + r, { waitUntil: "load", timeout: 45000 });
  await p2.waitForTimeout(3000);
  const o = await p2.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  console.log(`  ${r.padEnd(10)} overflow=${o}px ${o === 0 ? "OK" : "BOCOR"}`);
}

await browser.close();