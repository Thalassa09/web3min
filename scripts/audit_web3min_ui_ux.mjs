import { chromium } from "playwright";

const BASE_URL = "https://web3min.vercel.app";

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

  const routes = [
    "/",
    "/bubble",
    "/shop",
    "/profile",
    "/leaderboard",
    "/settings",
    "/kisah",
  ];

  for (const vp of viewports) {
    console.log(`\n--- Testing Viewport: ${vp.name} ---`);
    const context = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      userAgent: vp.name.includes("Mobile")
        ? "Mozilla/5.0 (iPhone; CPU iPhone OS 16_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.5 Mobile/15E148 Safari/604.1"
        : "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    });

    const page = await context.newPage();

    // Listen for console errors & unhandled errors
    page.on("pageerror", (err) => {
      issues.push(`[${vp.name}] Uncaught page error: ${err.message}`);
    });
    page.on("console", (msg) => {
      if (msg.type() === "error") {
        issues.push(`[${vp.name}] Console error: ${msg.text()}`);
      } else if (msg.type() === "warning") {
        warnings.push(`[${vp.name}] Console warn: ${msg.text()}`);
      }
    });

    for (const route of routes) {
      const url = `${BASE_URL}${route}`;
      try {
        const resp = await page.goto(url, { waitUntil: "networkidle", timeout: 25000 });
        if (!resp || resp.status() >= 400) {
          issues.push(`[${vp.name}] Route ${route} returned HTTP ${resp ? resp.status() : "none"}`);
          continue;
        }

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

        // Check for broken images
        const brokenImages = await page.evaluate(() => {
          const imgs = Array.from(document.querySelectorAll("img"));
          return imgs
            .filter((img) => !img.complete || img.naturalWidth === 0)
            .map((img) => img.src);
        });

        if (brokenImages.length > 0) {
          warnings.push(`[${vp.name}] Broken images on ${route}: ${brokenImages.join(", ")}`);
        }
      } catch (err) {
        issues.push(`[${vp.name}] Error visiting ${route}: ${err.message}`);
      }
    }

    // Deep Blobi UI/UX & Interaction Test on Homepage
    console.log(`[${vp.name}] Auditing Blobi Companion UI/UX & Gestures...`);
    await page.goto(`${BASE_URL}/`, { waitUntil: "networkidle" });
    await page.waitForTimeout(1000);

    const blobiStatus = await page.evaluate(() => {
      const el = document.querySelector('[title*="Tarik & geser Blobi"]');
      if (!el) return { present: false };
      const r = el.getBoundingClientRect();
      const parent = el.closest(".fixed");
      return {
        present: true,
        rect: { x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height) },
        style: parent ? parent.getAttribute("style") : null,
        insideViewport: r.left >= 0 && r.right <= window.innerWidth && r.top >= 0 && r.bottom <= window.innerHeight,
      };
    });

    console.log(`[${vp.name}] Blobi element status:`, JSON.stringify(blobiStatus));
    if (!blobiStatus.present) {
      issues.push(`[${vp.name}] Blobi floating companion is NOT rendered on homepage!`);
    } else if (!blobiStatus.insideViewport) {
      issues.push(`[${vp.name}] Blobi initial position is outside viewport: ${JSON.stringify(blobiStatus.rect)}`);
    }

    // Test Poke Interaction
    const pokeResult = await page.evaluate(() => {
      const handle = document.querySelector('[title*="Tarik & geser Blobi"]');
      if (!handle) return { ok: false, reason: "no handle" };
      // Simulate click
      handle.dispatchEvent(new MouseEvent("click", { bubbles: true }));
      // Check if speech bubble appears
      const bubble = document.querySelector(".blobi-bubble") || document.querySelector('[class*="border-2 border-ink-900 bg-white shadow-"]');
      return {
        ok: true,
        hasBubble: !!bubble,
        bubbleText: bubble ? bubble.textContent?.trim() : null,
      };
    });
    console.log(`[${vp.name}] Poke result:`, JSON.stringify(pokeResult));

    // Test Drag to Corner & Speech Bubble Bounds
    const dragTest = await page.evaluate(() => {
      const handle = document.querySelector('[title*="Tarik & geser Blobi"]');
      if (!handle) return { ok: false, reason: "no handle" };

      const r = handle.getBoundingClientRect();
      const startX = r.x + r.width / 2;
      const startY = r.y + r.height / 2;
      // Drag near right edge
      const targetX = window.innerWidth - 60;
      const targetY = 120;

      handle.dispatchEvent(new PointerEvent("pointerdown", { clientX: startX, clientY: startY, pointerId: 1, button: 0, bubbles: true }));
      window.dispatchEvent(new PointerEvent("pointermove", { clientX: targetX, clientY: targetY, pointerId: 1, bubbles: true }));
      window.dispatchEvent(new PointerEvent("pointerup", { clientX: targetX, clientY: targetY, pointerId: 1, bubbles: true }));

      const finalRect = handle.getBoundingClientRect();
      return {
        ok: true,
        moved: Math.abs(finalRect.x - r.x) > 20,
        finalPos: { x: Math.round(finalRect.x), y: Math.round(finalRect.y) },
        insideViewport: finalRect.left >= 0 && finalRect.right <= window.innerWidth && finalRect.top >= 0 && finalRect.bottom <= window.innerHeight,
      };
    });
    console.log(`[${vp.name}] Drag to corner test:`, JSON.stringify(dragTest));

    await context.close();
  }

  await browser.close();

  console.log("\n================ AUDIT SUMMARY ================");
  console.log(`Total Issues Found: ${issues.length}`);
  issues.forEach((iss, idx) => console.log(`[ISSUE ${idx + 1}] ${iss}`));

  console.log(`\nTotal Warnings Found: ${warnings.length}`);
  warnings.forEach((warn, idx) => console.log(`[WARN ${idx + 1}] ${warn}`));
}

runAudit().catch((err) => {
  console.error("FATAL AUDIT ERROR:", err);
  process.exit(1);
});
