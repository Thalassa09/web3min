import { chromium } from "playwright";

const BASE = "http://127.0.0.1:5199";
const browser = await chromium.launch({
  executablePath: "/usr/bin/google-chrome",
  headless: true,
  args: ["--no-sandbox", "--disable-setuid-sandbox"],
});

// A. static SEO files
for (const f of ["/robots.txt", "/sitemap.xml", "/manifest.json", "/icon-192.png", "/icon-512.png"]) {
  const r = await fetch(BASE + f);
  const body = await r.text();
  console.log(`${f}  ${r.status}  ${r.headers.get("content-type")}  ${body.length}B`);
}

// B. hydration: boot overlay must disappear and real nav must be reachable
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
await page.goto(BASE + "/", { waitUntil: "networkidle" });
await page.waitForTimeout(2200);
const bootVisible = await page.locator('text=Menyusun blok pertama').count();
const navCount = await page.locator("nav").count();
const firstCta = await page.locator("text=Blok Aktif").count();
console.log(`\nhydration: boot_overlay_visible=${bootVisible} nav_nodes=${navCount} active_block_cta=${firstCta}`);

// C. deep link still fine
const p2 = await browser.newPage();
await p2.goto(BASE + "/kisah/s-dm", { waitUntil: "networkidle" });
await p2.waitForTimeout(800);
console.log("deep link /kisah/s-dm ->", p2.url(), "| story text:", (await p2.content()).includes("Jam 2.14"));

await browser.close();