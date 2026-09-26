import { chromium } from "playwright";

const url = process.argv[2] ?? "http://127.0.0.1:5199/";
const browser = await chromium.launch({
  executablePath: "/usr/bin/google-chrome",
  headless: true,
  args: ["--no-sandbox", "--disable-setuid-sandbox"],
});
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
const page = await ctx.newPage();

let gCssRequests = 0;
let gCssBytes = 0;
const woff = new Set();
let woffBytes = 0;
const familiesInCss = new Set();

page.on("response", async (res) => {
  const u = res.url();
  if (u.includes("fonts.googleapis.com/css")) {
    gCssRequests++;
    try {
      const body = await res.text();
      gCssBytes += body.length;
      for (const m of body.matchAll(/font-family:\s*'([^']+)'/g)) familiesInCss.add(m[1]);
    } catch {}
  }
  if (/fonts\.gstatic\.com/.test(u)) {
    woff.add(u);
    woffBytes += Number(res.headers()["content-length"] ?? 0);
  }
});

await page.goto(url, { waitUntil: "networkidle", timeout: 60000 });
// walk the whole page so lazy chunks (lesson cards, pixel UI) actually mount
for (let y = 0; y < 6; y++) {
  await page.mouse.wheel(0, 4000);
  await page.waitForTimeout(600);
}
await page.waitForTimeout(2000);

const body16 = await page.evaluate(() => getComputedStyle(document.body).fontSize);

await browser.close();
console.log(
  JSON.stringify(
    {
      url,
      googleCssRequests: gCssRequests,
      googleCssBytes: gCssBytes,
      familiesDeclaredInCss: [...familiesInCss],
      familiesDeclaredCount: familiesInCss.size,
      woff2Downloaded: woff.size,
      woff2Bytes: woffBytes,
      bodyFontSize: body16,
    },
    null,
    2,
  ),
);