import { chromium } from "playwright";

async function testRealGestures() {
  console.log("=== TESTING BLOBO WITH REAL MOUSE & TOUCH GESTURES ===");
  const browser = await chromium.launch({
    executablePath: "/usr/bin/google-chrome",
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-gpu"],
  });

  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  await page.goto("https://web3min.vercel.app/", { waitUntil: "networkidle" });
  await page.waitForTimeout(1500);

  // 1. Locate Blobi handle
  const blobi = page.locator('[title*="Tarik & geser Blobi"]');
  const box1 = await blobi.boundingBox();
  console.log("Initial Blobi Box:", box1);

  if (!box1) {
    throw new Error("Blobi not found on page!");
  }

  // 2. Real Mouse Drag Test
  console.log("Performing real mouse drag...");
  const startX = box1.x + box1.width / 2;
  const startY = box1.y + box1.height / 2;
  const destX = startX + 220;
  const destY = startY - 140;

  await page.mouse.move(startX, startY);
  await page.mouse.down();
  // Move in steps like a human hand
  await page.mouse.move(startX + 100, startY - 60, { steps: 5 });
  await page.mouse.move(destX, destY, { steps: 5 });
  await page.waitForTimeout(100);
  await page.mouse.up();
  await page.waitForTimeout(600);

  const box2 = await blobi.boundingBox();
  console.log("Blobi Box after real mouse drag:", box2);

  const dx = box2.x - box1.x;
  const dy = box2.y - box1.y;
  console.log(`Displacement: dx=${Math.round(dx)}px, dy=${Math.round(dy)}px`);

  const dragSuccess = Math.abs(dx) > 100;
  console.log("Real Drag Success:", dragSuccess);

  // 3. Real Click (Poke) Test
  console.log("Testing poke click on Blobi...");
  await page.mouse.click(box2.x + box2.width / 2, box2.y + box2.height / 2);
  await page.waitForTimeout(500);

  const speechBubble = page.locator('.blobi-bubble, [class*="border-2 border-ink-900 bg-white"]');
  const bubbleCount = await speechBubble.count();
  const bubbleText = bubbleCount > 0 ? await speechBubble.first().textContent() : null;
  console.log("Speech Bubble after poke:", { visible: bubbleCount > 0, text: bubbleText?.slice(0, 50) });

  // 4. Test Mobile Touch Gestures
  console.log("\n--- Testing Mobile Viewport & Touch Gestures ---");
  const mobileContext = await browser.newContext({
    viewport: { width: 390, height: 844 },
    hasTouch: true,
  });
  const mobilePage = await mobileContext.newPage();
  await mobilePage.goto("https://web3min.vercel.app/", { waitUntil: "networkidle" });
  await mobilePage.waitForTimeout(1500);

  const mobileBlobi = mobilePage.locator('[title*="Tarik & geser Blobi"]');
  const mBox1 = await mobileBlobi.boundingBox();
  console.log("Mobile Blobi Initial Box:", mBox1);

  if (mBox1) {
    const mStartX = mBox1.x + mBox1.width / 2;
    const mStartY = mBox1.y + mBox1.height / 2;
    const mDestX = Math.min(320, mStartX + 120);
    const mDestY = Math.max(120, mStartY - 100);

    // Touch drag
    await mobilePage.touchscreen.tap(mStartX, mStartY);
    await mobilePage.waitForTimeout(200);

    const mBox2 = await mobileBlobi.boundingBox();
    console.log("Mobile Blobi after touch tap:", mBox2);
  }

  await browser.close();
  console.log("\n=== REAL GESTURE TESTS COMPLETE ===");
}

testRealGestures().catch((e) => {
  console.error("Test failed:", e);
  process.exit(1);
});
