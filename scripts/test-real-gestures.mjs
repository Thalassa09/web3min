import { chromium } from "playwright";

async function testRealGestures() {
  console.log("=== TESTING BLOBO WITH REAL MOUSE & TOUCH GESTURES ===");
  const browser = await chromium.launch({
    executablePath: "/usr/bin/google-chrome",
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-gpu"],
  });

  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  await page.addInitScript(() => {
    localStorage.setItem("web3min-v2", JSON.stringify({
      state: { coachSeen: true, completed: ["intro-1"] },
      version: 2
    }));
  });
  await page.goto("https://web3min.vercel.app/", { waitUntil: "domcontentloaded" });
  await page.waitForSelector(".world", { timeout: 15000 });
  await page.waitForTimeout(1000);

  // If Coach Tour is present, test that clicking backdrop dismisses it
  const coachBackdrop = page.locator(".coach-catch");
  if (await coachBackdrop.count() > 0) {
    console.log("Coach tour detected. Dismissing by clicking backdrop...");
    await coachBackdrop.click({ force: true });
    await page.waitForTimeout(500);
  }

  // 1. Locate Blobi handle
  const blobi = page.locator('[title*="Tarik & geser Blobi"]');
  await blobi.waitFor({ state: "visible", timeout: 5000 });
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

  const speechBubble = page.locator('[class*="bg-white/95"]');
  const bubbleCount = await speechBubble.count();
  const bubbleText = bubbleCount > 0 ? await speechBubble.first().textContent() : null;
  console.log("Speech Bubble after poke:", { visible: bubbleCount > 0, text: bubbleText?.slice(0, 50) });

  // 4. Test Mobile Viewport & Touch Gestures
  console.log("\n--- Testing Mobile Viewport & Touch Gestures ---");
  const mobileContext = await browser.newContext({
    viewport: { width: 390, height: 844 },
    hasTouch: true,
  });
  const mobilePage = await mobileContext.newPage();
  
  // Set coachSeen so Blobi is ready immediately
  await mobilePage.addInitScript(() => {
    localStorage.setItem("web3min-v2", JSON.stringify({
      state: { coachSeen: true, completed: ["intro-1"] },
      version: 2
    }));
  });

  await mobilePage.goto("https://web3min.vercel.app/", { waitUntil: "domcontentloaded" });
  await mobilePage.waitForSelector(".world", { timeout: 15000 });
  await mobilePage.waitForTimeout(1000);

  const mobileBlobi = mobilePage.locator('[title*="Tarik & geser Blobi"]');
  const mBox1 = await mobileBlobi.boundingBox();
  console.log("Mobile Blobi Initial Box:", mBox1);

  if (mBox1) {
    const mStartX = mBox1.x + mBox1.width / 2;
    const mStartY = mBox1.y + mBox1.height / 2;

    // Tap to poke
    await mobilePage.touchscreen.tap(mStartX, mStartY);
    await mobilePage.waitForTimeout(400);

    const mBubble = mobilePage.locator('[class*="bg-white/95"]');
    console.log("Mobile Poke Speech Bubble visible:", (await mBubble.count()) > 0);
  }

  await browser.close();
  console.log("\n=== REAL GESTURE TESTS COMPLETE ===");
}

testRealGestures().catch((e) => {
  console.error("Test failed:", e);
  process.exit(1);
});
