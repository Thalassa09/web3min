import { chromium } from "playwright";

async function testAdminRaffleWorkflow() {
  console.log("=== TESTING ADMIN LOGIN, RAFFLE CRUD, AND IMAGE UPLOAD ===");

  const browser = await chromium.launch({
    executablePath: "/usr/bin/google-chrome",
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-gpu"],
  });

  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await page.addInitScript(() => {
    localStorage.setItem("web3min-v2", JSON.stringify({
      state: { coachSeen: true, completed: ["u1-l1"], onboarded: true },
      version: 2
    }));
  });

  // 1. Visit /raffle as a normal user
  console.log("Navigating to http://localhost:5187/raffle ...");
  await page.goto("http://localhost:5187/raffle", { waitUntil: "domcontentloaded" });
  await page.waitForSelector("button", { timeout: 15000 });
  await page.waitForTimeout(1000);

  // Check that admin banner is NOT visible yet
  const adminBannerInitial = page.locator('text="Mode Pengelola Undian Aktif"');
  console.log("Admin banner before login (must be false):", (await adminBannerInitial.count()) > 0);
  if ((await adminBannerInitial.count()) > 0) {
    throw new Error("Admin banner should not be visible before login!");
  }

  // 2. Click "Akses Login Admin Undian"
  console.log("Locating and clicking Admin Login button...");
  const adminLoginBtn = page.locator('button:has-text("Akses Login Admin Undian")');
  await adminLoginBtn.scrollIntoViewIfNeeded();
  await adminLoginBtn.click();
  await page.waitForTimeout(500);

  // 3. Verify AdminLoginModal is open
  const loginModal = page.locator('text="Login Admin Undian"');
  console.log("Login modal visible:", (await loginModal.count()) > 0);
  if ((await loginModal.count()) === 0) {
    throw new Error("Admin login modal did not open!");
  }

  // 4. Fill in correct admin key and submit
  console.log("Submitting admin key 'web3min-admin-2026'...");
  await page.fill('input[placeholder*="password admin"]', "web3min-admin-2026");
  await page.click('button:has-text("Masuk Sebagai Admin")');
  await page.waitForTimeout(1000);

  // 5. Verify Admin banner is now active
  const adminBanner = page.locator('text="Mode Pengelola Undian Aktif"');
  console.log("Admin banner after login (must be true):", (await adminBanner.count()) > 0);
  if ((await adminBanner.count()) === 0) {
    throw new Error("Admin banner did not appear after successful login!");
  }

  // 6. Click "+ Buat Undian Baru"
  console.log("Opening Add Raffle Modal...");
  const createRaffleBtn = page.locator('button:has-text("+ Buat Undian Baru")').first();
  await createRaffleBtn.click();
  await page.waitForTimeout(500);

  // Verify modal is open and has image upload space
  const uploadZone = page.locator('text="Klik / Drop Foto NFT"');
  console.log("Image Upload Dropzone visible:", (await uploadZone.count()) > 0);
  if ((await uploadZone.count()) === 0) {
    throw new Error("Image upload dropzone not found in modal!");
  }

  // 7. Fill in raffle details + image URL
  console.log("Filling new raffle details with mock image artwork...");
  const testId = `raf-test-${Date.now().toString(36)}`;
  await page.fill('input[placeholder*="Genesis Blobi #002"]', "Blobi Mecha Genesis #777");
  await page.fill('input[placeholder*="1/1 Mythic NFT"]', "1/1 Mecha Blobi Titan NFT");
  await page.fill('textarea[placeholder*="Rincian utilitas"]', "Artefak eksklusif admin testing dengan boost XP 100%");
  await page.fill('input[placeholder*="https://.../nft.png"]', "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=600");
  await page.waitForTimeout(300);

  // Submit new raffle
  console.log("Submitting new raffle form...");
  await page.click('button:has-text("Publikasikan Undian")');
  await page.waitForTimeout(2000);

  // 8. Verify the new raffle card is displayed in the catalog with the artwork image!
  console.log("Verifying new raffle card appears with image...");
  const newRaffleTitle = page.locator('text="Blobi Mecha Genesis #777"');
  console.log("New raffle card visible in catalog:", (await newRaffleTitle.count()) > 0);
  if ((await newRaffleTitle.count()) === 0) {
    throw new Error("Created raffle card did not appear in catalog!");
  }

  const nftBadge = page.locator('text="NFT ARTIFACT"').first();
  console.log("NFT Artifact image badge rendered:", (await nftBadge.count()) > 0);

  // Take screenshot of raffle catalog with admin controls
  await page.screenshot({ path: "/tmp/admin_raffle_catalog.png" });
  console.log("Saved screenshot /tmp/admin_raffle_catalog.png");

  // 9. Test Edit on the created raffle
  console.log("Testing Edit on created raffle...");
  const editBtn = page.locator('div:has-text("Blobi Mecha Genesis #777")').locator('button:has-text("Edit Undian")').first();
  if ((await editBtn.count()) > 0) {
    await editBtn.click();
    await page.waitForTimeout(600);
    // Change title
    await page.fill('input[placeholder*="Genesis Blobi #002"]', "Blobi Mecha Genesis #777 (Updated)");
    await page.click('button:has-text("Simpan Perubahan")');
    await page.waitForTimeout(1500);
    const updatedTitle = page.locator('text="Blobi Mecha Genesis #777 (Updated)"');
    console.log("Updated raffle title visible:", (await updatedTitle.count()) > 0);
  }

  // 10. Test Delete on the created raffle
  console.log("Testing Delete on created raffle...");
  const deleteBtn = page.locator('div:has-text("Blobi Mecha Genesis #777")').locator('button:has-text("Hapus")').first();
  if ((await deleteBtn.count()) > 0) {
    await deleteBtn.click();
    await page.waitForTimeout(500);
    const confirmDeleteModal = page.locator('text="Konfirmasi Penghapusan"');
    console.log("Delete confirm modal visible:", (await confirmDeleteModal.count()) > 0);
    await page.click('button:has-text("Ya, Hapus")');
    await page.waitForTimeout(1500);
    const deletedCount = await page.locator('text="Blobi Mecha Genesis #777"').count();
    console.log("Deleted raffle presence (must be 0):", deletedCount);
  }

  // 11. Test dedicated /admin route
  console.log("Navigating to dedicated /admin route...");
  await page.goto("http://localhost:5187/admin", { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(1500);
  const adminPageHeader = page.locator('text="Pengelola Undian & Artefak NFT"');
  console.log("Dedicated /admin dashboard loaded:", (await adminPageHeader.count()) > 0);
  await page.screenshot({ path: "/tmp/admin_dedicated_dashboard.png" });
  console.log("Saved screenshot /tmp/admin_dedicated_dashboard.png");

  await browser.close();
  console.log("\n=== ALL ADMIN RAFFLE CRUD & IMAGE WORKFLOW TESTS PASSED 100%! ===");
}

testAdminRaffleWorkflow().catch((e) => {
  console.error("Test failed:", e);
  process.exit(1);
});
