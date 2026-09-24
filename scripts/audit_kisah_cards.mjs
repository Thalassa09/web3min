
import { chromium } from "playwright";
import { spawn } from "child_process";

async function main() {
  console.log("Starting preview server...");
  const proc = spawn("npx", ["vite", "preview", "--port", "4173"], {
    cwd: "/root/web3min-roe3r",
    stdio: "inherit"
  });

  await new Promise((r) => setTimeout(r, 2000));

  const browser = await chromium.launch({
    executablePath: "/usr/bin/google-chrome",
    args: ["--no-sandbox", "--disable-dev-shm-usage"]
  });

  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  
  const consoleErrors = [];
  page.on("console", (msg) => {
    if (msg.type() === "error") consoleErrors.push(msg.text());
  });
  page.on("pageerror", (err) => consoleErrors.push(err.message));

  console.log("Navigating to http://localhost:4173/kisah ...");
  const res = await page.goto("http://localhost:4173/kisah", { waitUntil: "domcontentloaded" });
  console.log("Status:", res.status());

  await page.waitForTimeout(1000);

  const cardsCount = await page.locator(".group").count();
  console.log("Animated feature cards rendered:", cardsCount);

  // Check card hover animation trigger
  const firstCard = page.locator(".group").first();
  await firstCard.hover();
  await page.waitForTimeout(500);

  // Take screenshot
  await page.screenshot({ path: "/root/web3min-roe3r/kisah-feature-cards.png", fullPage: false });
  console.log("Screenshot saved to /root/web3min-roe3r/kisah-feature-cards.png");

  // Switch tab to kasus
  const kasusBtn = page.locator("button:has-text('Kasus On-Chain')");
  await kasusBtn.click();
  await page.waitForTimeout(600);
  const kasusCardsCount = await page.locator(".group").count();
  console.log("Kasus cards count:", kasusCardsCount);

  await page.screenshot({ path: "/root/web3min-roe3r/kisah-kasus-cards.png", fullPage: false });
  console.log("Screenshot saved to /root/web3min-roe3r/kisah-kasus-cards.png");

  console.log("Console errors:", consoleErrors);

  await browser.close();
  proc.kill();
  console.log("Audit complete!");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
