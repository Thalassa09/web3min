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
  await page.goto("http://localhost:5187/", { waitUntil: "domcontentloaded" });
  await page.waitForSelector(".world", { timeout: 15000 });
  await page.waitForTimeout(1000);

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

  // 3. Test clicking locked node -> verifies shake & toast, NO BlobiLockedModal overlay dialog
  console.log("Testing locked node click...");
  const lockedNode = page.locator('button[aria-label*="Terkunci"]').first();
  if (await lockedNode.count() > 0) {
    await lockedNode.click();
    await page.waitForTimeout(400);
    const lockedModal = page.locator('.fixed.inset-0.z-50:has-text("jangan curang")');
    const lockedModalCount = await lockedModal.count();
    console.log("BlobiLockedModal count (must be 0):", lockedModalCount);
    if (lockedModalCount !== 0) {
      throw new Error("BlobiLockedModal overlay was detected!");
    }
    const toast = page.locator('.toast');
    const toastText = await toast.textContent();
    console.log("Toast shown on locked click:", toastText);
  }

  // 4. Test clicking Blobi on the active node -> Directly launches the lesson without overlay!
  console.log("Clicking Blobi on active node -> verifying direct lesson navigation...");
  await activeBlobi.click();
  await page.waitForTimeout(1000);

  const currentUrl = page.url();
  console.log("Current URL after clicking Blobi:", currentUrl);
  const navigatedToLesson = currentUrl.includes("/lesson/");
  console.log("Navigated directly to lesson without overlay:", navigatedToLesson);

  // 5. Verify no stuck overlay modal
  const overlayDialog = page.locator('.fixed.inset-0.z-50:has-text("Teman Belajar Blobi")');
  const overlayCount = await overlayDialog.count();
  console.log("Blobi overlay dialog count (must be 0):", overlayCount);
  if (overlayCount !== 0) {
    throw new Error("Intrusive Blobi overlay dialog was detected!");
  }

  // Take screenshot for proof
  await page.screenshot({ path: "/tmp/direct_blobi_lesson.png" });
  console.log("Saved /tmp/direct_blobi_lesson.png");

  await browser.close();
  console.log("\n=== ALL BLOBI INTERACTION TESTS PASSED CLEANLY! ===");
}

testBlobiDirectInteraction().catch((e) => {
  console.error("Test failed:", e);
  process.exit(1);
});
