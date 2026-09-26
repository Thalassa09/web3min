import { chromium } from "playwright";

const BASE = process.argv[2] ?? "http://127.0.0.1:5199";
const browser = await chromium.launch({
  executablePath: "/usr/bin/google-chrome",
  headless: true,
  args: ["--no-sandbox", "--disable-setuid-sandbox"],
});

for (const width of [360, 430]) {
  const page = await browser.newPage({ viewport: { width, height: 800 } });
  await page.goto(BASE + "/", { waitUntil: "domcontentloaded", timeout: 60000 });
  await page.waitForTimeout(3000);

  const res = await page.evaluate(() => {
    const de = document.documentElement;
    const limit = de.clientWidth;
    const offenders = [];
    for (const el of document.querySelectorAll("body *")) {
      const r = el.getBoundingClientRect();
      if (r.width === 0 || r.height === 0) continue;
      if (r.right > limit + 1 || r.left < -1) {
        offenders.push({
          tag: el.tagName.toLowerCase(),
          cls: (el.className || "").toString().slice(0, 70),
          left: Math.round(r.left),
          right: Math.round(r.right),
        });
      }
    }
    return {
      clientWidth: limit,
      scrollWidth: de.scrollWidth,
      overflow: de.scrollWidth - limit,
      offenders: offenders.slice(0, 6),
      offenderCount: offenders.length,
    };
  });
  console.log(`--- ${width}px @ ${BASE} ---`);
  console.log(JSON.stringify(res, null, 2));
  await page.close();
}

await browser.close();