import { chromium } from "playwright";
const BASE = "https://web3min.com";
const browser = await chromium.launch({
  executablePath: "/usr/bin/google-chrome",
  headless: true,
  args: ["--no-sandbox", "--disable-setuid-sandbox"],
});
const ctx = await browser.newContext({ viewport: { width: 390, height: 800 } });
const page = await ctx.newPage();
await page.goto(BASE + "/lesson/u1-l1", { waitUntil: "load", timeout: 45000 });
await page.waitForTimeout(5000);

const acc = await page.evaluate(() => {
  const ctrl = [...document.querySelectorAll("button[aria-expanded], details, [role=button]")].filter(
    (e) => /konsep inti|contoh nyata|kunci ingatan|jebakan/i.test(e.textContent || ""),
  );
  return {
    url: location.pathname,
    h1: document.querySelector("h1")?.textContent?.trim().slice(0, 50) ?? null,
    accordions: ctrl.map((e) => ({
      label: (e.textContent || "").replace(/\s+/g, " ").trim().slice(0, 34),
      expanded: e.getAttribute("aria-expanded") ?? (e.tagName === "DETAILS" ? String(e.open) : "?"),
    })),
    body: document.body.innerText.replace(/\s+/g, " ").slice(0, 260),
  };
});
console.log("=== /lesson/u1-l1 ===");
console.log(`  url: ${acc.url}  h1: "${acc.h1}"`);
console.log(`  akordion ditemukan: ${acc.accordions.length}`);
for (const a of acc.accordions) console.log(`    [${a.expanded}] ${a.label}`);
console.log(`  body: "${acc.body}"`);

// Cek di semua tipe soal
console.log("\n=== sebaran akordion di beberapa lesson ===");
for (const p of ["/lesson/u1-l2", "/lesson/u2-l1", "/lesson/u3-l5"]) {
  await page.goto(BASE + p, { waitUntil: "load", timeout: 45000 });
  await page.waitForTimeout(3500);
  const n = await page.evaluate(() => {
    const sets = new Set();
    for (const e of document.querySelectorAll("button[aria-expanded], details")) {
      const t = (e.textContent || "").replace(/\s+/g, " ").trim();
      if (/konsep inti|contoh nyata|kunci ingatan|jebakan/i.test(t)) sets.add(t.slice(0, 24));
    }
    return [...sets];
  });
  console.log(`  ${p}: ${n.length ? n.join(" | ") : "(tidak ada akordion di blok ini)"}`);
}
await browser.close();