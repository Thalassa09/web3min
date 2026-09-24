import { chromium } from "playwright";

async function testBlobiDirectInteraction() {
  console.log("=== TESTING BLOBI INTERACTION WITHOUT INTRUSIVE OVERLAYS ===");
  const browser = await chromium.launch({
    executablePath: "/usr/bin/google-chrome",
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-gpu"],
  });

  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  await page.addInitScript(() => {
    localStorage.setItem("web3min-v2", JSON.stringify({
      state: { coachSeen: true, completed: [] },
      version: 2
    }));
  });
  await page.goto("http://localhost:5187/", { waitUntil: "domcontentloaded" }).catch(() => {
    return page.goto("https://web3min.vercel.app/", { waitUntil: "domcontentloaded" });
  });
  await page.waitForSelector(".world", { timeout: 15000 });
  await page.waitForTimeout(1000);

  // If Coach Tour is present, dismiss it
  const coachBackdrop = page.locator(".coach-catch");
  if (await coachBackdrop.count() > 0) {
    console.log("Coach tour detected. Dismissing by clicking backdrop...");
    await coachBackdrop.click({ force: true });
    await page.waitForTimeout(500);
  }

  // 1. Verify floating Blobi companion is REMOVED from the main page
  const floatingBlobi = page.locator('[title*="Tarik & geser Blobi"]');
  const floatingCount = await floatingBlobi.count();
  console.log("Floating Blobi companion count (must be 0):", floatingCount);
  if (floatingCount !== 0) {
    throw new Error("Floating Blobi companion is still present!");
  }

  // 2. Verify Blobi standing on the active node
  const activeBlobi = page.locator('button[title*="Mulai tambang blok ini bersama Blobi"]');
  await activeBlobi.waitFor({ state: "visible", timeout: 5000 });
  const blobiBox = await activeBlobi.boundingBox();
  console.log("Active Node Blobi found at:", blobiBox);
  if (!blobiBox) {
    throw new Error("Active Blobi not found on map!");
  }

  // 3. Test clicking Blobi on the active node -> Directly launches the lesson without overlay!
  console.log("Clicking Blobi on active node -> verifying direct lesson navigation...");
  await activeBlobi.click();
  await page.waitForTimeout(1000);

  const currentUrl = page.url();
  console.log("Current URL after clicking Blobi:", currentUrl);
  const navigatedToLesson = currentUrl.includes("/lesson/");
  console.log("Navigated directly to lesson without overlay:", navigatedToLesson);

  // 4. Verify no stuck overlay modal
  const overlayDialog = page.locator('.fixed.inset-0.z-50:has-text("Teman Belajar Blobi")');
  const overlayCount = await overlayDialog.count();
  console.log("Blobi overlay dialog count (must be 0):", overlayCount);
  if (overlayCount !== 0) {
    throw new Error("Intrusive Blobi overlay dialog was detected!");
  }

  await browser.close();
  console.log("\n=== ALL BLOBI INTERACTION TESTS PASSED CLEANLY! ===");
}

testBlobiDirectInteraction().catch((e) => {
  console.error("Test failed:", e);
  process.exit(1);
});
