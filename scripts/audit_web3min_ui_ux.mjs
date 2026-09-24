import { chromium } from "playwright";

const BASE_URL = "https://web3min.vercel.app";

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

async function runAudit() {
  console.log("=== STARTING COMPREHENSIVE WEB3MIN UI/UX & LOGIC AUDIT ===");
  const browser = await chromium.launch({
    executablePath: "/usr/bin/google-chrome",
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-gpu"],
  });

  const issues = [];
  const warnings = [];

  const viewports = [
    { name: "Desktop (1280x800)", width: 1280, height: 800 },
    { name: "Mobile (390x844)", width: 390, height: 844 },
  ];

  for (const vp of viewports) {
    console.log(`\n--- Testing Viewport: ${vp.name} ---`);

    for (const route of ROUTES) {
      const page = await browser.newPage({
        viewport: { width: vp.width, height: vp.height },
        userAgent: vp.name.includes("Mobile")
          ? "Mozilla/5.0 (iPhone; CPU iPhone OS 16_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.5 Mobile/15E148 Safari/604.1"
          : "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      });

      page.on("pageerror", (err) => {
        issues.push(`[${vp.name}] Uncaught page error on ${route}: ${err.message}`);
      });
      page.on("console", (msg) => {
        if (msg.type() === "error") {
          issues.push(`[${vp.name}] Console error on ${route}: ${msg.text()}`);
        }
      });

      // Active user state
      await page.addInitScript(() => {
        localStorage.setItem("web3min-v2", JSON.stringify({
          state: { coachSeen: true, completed: ["intro-1"], username: "Thalassa", gems: 100, xp: 250, streak: 5 },
          version: 2
        }));
      });

      const url = `${BASE_URL}${route}`;
      try {
        const resp = await page.goto(url, { waitUntil: "domcontentloaded", timeout: 20000 });
        if (!resp || resp.status() >= 400) {
          issues.push(`[${vp.name}] Route ${route} returned HTTP ${resp ? resp.status() : "none"}`);
        }
        await page.waitForTimeout(600);

        // Check horizontal overflow
        const overflow = await page.evaluate(() => {
          return {
            scrollWidth: document.documentElement.scrollWidth,
            innerWidth: window.innerWidth,
            hasOverflow: document.documentElement.scrollWidth > window.innerWidth,
          };
        });

        if (overflow.hasOverflow) {
          issues.push(
            `[${vp.name}] Horizontal overflow on ${route}: scrollWidth ${overflow.scrollWidth} > innerWidth ${overflow.innerWidth}`
          );
        }
      } catch (err) {
        issues.push(`[${vp.name}] Error visiting ${route}: ${err.message}`);
      } finally {
        await page.close();
      }
    }

    // Deep Blobi Companion Audit on Homepage
    console.log(`[${vp.name}] Auditing Blobi Companion on Homepage...`);
    const page = await browser.newPage({
      viewport: { width: vp.width, height: vp.height },
      hasTouch: vp.name.includes("Mobile"),
    });

    await page.addInitScript(() => {
      localStorage.setItem("web3min-v2", JSON.stringify({
        state: { coachSeen: true, completed: ["intro-1"] },
        version: 2
      }));
    });

    try {
      await page.goto(`${BASE_URL}/`, { waitUntil: "domcontentloaded", timeout: 20000 });
      await page.waitForSelector(".world", { timeout: 15000 });
      await page.waitForTimeout(800);

      const blobi = page.locator('[title*="Tarik & geser Blobi"]');
      const count = await blobi.count();
      if (count === 0) {
        issues.push(`[${vp.name}] Blobi floating companion not found on homepage!`);
      } else {
        const box = await blobi.first().boundingBox();
        console.log(`[${vp.name}] Blobi Box:`, box);
        if (box) {
          const inside = box.x >= 0 && box.x + box.width <= vp.width + 10 && box.y >= 0 && box.y + box.height <= vp.height + 10;
          if (!inside) {
            issues.push(`[${vp.name}] Blobi initial bounding box outside viewport: ${JSON.stringify(box)}`);
          }

          // Test dragging if desktop
          if (!vp.name.includes("Mobile")) {
            const startX = box.x + box.width / 2;
            const startY = box.y + box.height / 2;
            await page.mouse.move(startX, startY);
            await page.mouse.down();
            await page.mouse.move(startX + 120, startY - 80, { steps: 5 });
            await page.mouse.up();
            await page.waitForTimeout(400);

            const boxAfter = await blobi.first().boundingBox();
            const dx = (boxAfter?.x || 0) - box.x;
            console.log(`[${vp.name}] Blobi drag displacement: dx=${Math.round(dx)}px`);
            if (Math.abs(dx) < 50) {
              issues.push(`[${vp.name}] Blobi did not move expected distance on drag: dx=${dx}`);
            }
          }
        }
      }
    } catch (err) {
      issues.push(`[${vp.name}] Blobi audit error: ${err.message}`);
    } finally {
      await page.close();
    }
  }

  await browser.close();

  console.log("\n================ AUDIT SUMMARY ================");
  console.log(`Total Issues Found: ${issues.length}`);
  if (issues.length > 0) {
    issues.forEach((iss, i) => console.log(`[ISSUE ${i + 1}] ${iss}`));
    process.exit(1);
  } else {
    console.log("ALL PAGES & UI/UX GESTURES PASSED AUDIT WITH 0 ISSUES!");
    process.exit(0);
  }
}

runAudit().catch((err) => {
  console.error("FATAL AUDIT ERROR:", err);
  process.exit(1);
});
