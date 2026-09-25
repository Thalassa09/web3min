import { chromium } from "playwright";

const ROUTES = [
  "/",
  "/bubble",
  "/shop",
  "/profile",
  "/leaderboard",
  "/settings",
  "/kisah",
  "/lesson/intro-web3-apa-itu"
];

async function testAllRoutes() {
  console.log("=== COMPREHENSIVE MULTI-ROUTE INTERACTIVE AUDIT ===");
  const browser = await chromium.launch({
    executablePath: "/usr/bin/google-chrome",
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-gpu"],
  });

  const results = [];

  for (const route of ROUTES) {
    const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
    
    // Set user as active learner
    await page.addInitScript(() => {
      localStorage.setItem("web3min-v2", JSON.stringify({
        state: {
          coachSeen: true,
          completed: ["intro-1"],
          username: "Thalassa",
          gems: 100,
          xp: 250,
          streak: 5
        },
        version: 2
      }));
    });

    const pageErrors = [];
    page.on("pageerror", (err) => pageErrors.push(err.message));

    const response = await page.goto(`https://web3min.com${route}`, { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(500);
    const status = response ? response.status() : 0;
    await page.waitForTimeout(600);

    // Desktop check
    const desktopHScroll = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);

    // Mobile check
    await page.setViewportSize({ width: 390, height: 844 });
    await page.waitForTimeout(400);
    const mobileHScroll = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);

    results.push({
      route,
      status,
      desktopHScroll,
      mobileHScroll,
      errors: pageErrors
    });

    await page.close();
  }

  console.table(results);
  await browser.close();

  const failed = results.filter((r) => r.status >= 400 || r.desktopHScroll || r.mobileHScroll || r.errors.length > 0);
  if (failed.length > 0) {
    console.error("Found problematic routes:", failed);
  } else {
    console.log("ALL ROUTES PASSED AUDIT WITH 0 ERRORS AND 0 OVERFLOW!");
  }
}

testAllRoutes().catch(console.error);
