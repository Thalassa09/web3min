import { chromium } from "playwright";

const BASE = process.argv[2] ?? "http://127.0.0.1:5210";
const browser = await chromium.launch({
  executablePath: "/usr/bin/google-chrome",
  headless: true,
  args: ["--no-sandbox", "--disable-setuid-sandbox"],
});
const results = {};

// 1) OFFLINE BANNER: page is loaded, then connection drops (the realistic case —
//    a cold load with no service worker cannot render anything at all).
{
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await ctx.newPage();
  await page.goto(BASE + "/", { waitUntil: "domcontentloaded", timeout: 60000 });
  await page.waitForTimeout(2500);

  results.beforeOffline = await page.evaluate(() => {
    const el = document.querySelector("[role='status']");
    return { bannerVisible: !!el && /lagi offline/i.test(el.textContent ?? "") };
  });

  await ctx.setOffline(true);
  await page.evaluate(() => window.dispatchEvent(new Event("offline")));
  await page.waitForTimeout(600);

  results.afterOffline = await page.evaluate(() => {
    const el = document.querySelector("[role='status']");
    const btn = [...document.querySelectorAll("button")].find((b) => /Coba lagi/i.test(b.textContent ?? ""));
    const r = btn?.getBoundingClientRect();
    return {
      bannerVisible: !!el,
      text: el?.textContent?.replace(/\s+/g, " ").trim().slice(0, 100) ?? null,
      retryButton: !!btn,
      retryTapHeight: r ? Math.round(r.height) : null,
    };
  });

  // back online → banner must vanish on its own
  await ctx.setOffline(false);
  await page.evaluate(() => window.dispatchEvent(new Event("online")));
  await page.waitForTimeout(600);
  results.backOnline = await page.evaluate(() => {
    const el = document.querySelector("[role='status']");
    return { bannerVisible: !!el && /lagi offline/i.test(el.textContent ?? "") };
  });

  await ctx.close();
}

// 2) LEADERBOARD ERROR: cut off only the Supabase call so the RPC fails.
{
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await page.route("**/*.supabase.co/**", (route) => route.abort());
  await page.goto(BASE + "/leaderboard", { waitUntil: "domcontentloaded", timeout: 60000 });
  await page.waitForTimeout(6000);

  results.leaderboardError = await page.evaluate(() => {
    const alertBox = document.querySelector("[role='alert']");
    const btn = [...document.querySelectorAll("button")].find((b) => /Coba lagi/i.test(b.textContent ?? ""));
    const r = btn?.getBoundingClientRect();
    return {
      errorBox: !!alertBox,
      errorText: alertBox?.textContent?.replace(/\s+/g, " ").trim().slice(0, 130) ?? null,
      retryButton: !!btn,
      retryTapHeight: r ? Math.round(r.height) : null,
    };
  });

  // clicking retry must re-issue the request, not silently do nothing
  let attempts = 0;
  await page.route("**/*.supabase.co/**", (route) => {
    attempts++;
    route.abort();
  });
  await page.evaluate(() => {
    const b = [...document.querySelectorAll("button")].find((x) => /Coba lagi/i.test(x.textContent ?? ""));
    b?.click();
  });
  await page.waitForTimeout(3000);
  results.leaderboardError.retryRefetched = attempts > 0;
  results.leaderboardError.rpcAttemptsAfterRetry = attempts;

  await page.close();
}

await browser.close();
console.log(JSON.stringify(results, null, 2));