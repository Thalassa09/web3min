import { chromium } from "playwright";

async function testBubblePage() {
  console.log("=== TESTING BUBBLE PAGE & 8-BIT MODULE ===");
  const browser = await chromium.launch({
    executablePath: "/usr/bin/google-chrome",
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-gpu"],
  });

  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  
  const errors = [];
  page.on("pageerror", (err) => errors.push(err.message));
  page.on("console", (msg) => {
    if (msg.type() === "error") errors.push(msg.text());
  });

  await page.goto("https://web3min.com/bubble", { waitUntil: "networkidle" });
  await page.waitForTimeout(1000);

  // Check 8-bit game progress module
  const gameProgress = page.locator('.retro [class*="border-y"]');
  const count = await gameProgress.count();
  console.log("8-bit card components count:", count);

  const gameProgressText = await page.locator('text=Game Progress').count();
  console.log("Found 'Game Progress' text:", gameProgressText > 0);

  const healthText = await page.locator('text=Health').count();
  const manaText = await page.locator('text=Mana').count();
  const expText = await page.locator('text=Experience').count();
  console.log("Progress stats visible:", { healthText, manaText, expText });

  // Test Mobile view for Bubble page
  await page.setViewportSize({ width: 390, height: 844 });
  await page.waitForTimeout(500);

  const hasHScroll = await page.evaluate(() => {
    return document.documentElement.scrollWidth > window.innerWidth;
  });
  console.log("Mobile Bubble horizontal overflow:", hasHScroll);
  console.log("Page errors on /bubble:", errors);

  await browser.close();
}

testBubblePage().catch(console.error);
