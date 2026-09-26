import { chromium } from "playwright";

const BASE = "http://127.0.0.1:5260";
const browser = await chromium.launch({
  executablePath: "/usr/bin/google-chrome",
  headless: true,
  args: ["--no-sandbox", "--disable-setuid-sandbox"],
});
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
await page.goto(BASE + "/", { waitUntil: "domcontentloaded", timeout: 60000 });
await page.waitForTimeout(3500);

const res = await page.evaluate(() => {
  const out = { newLabel: [], oldLabel: [] };
  for (const el of document.querySelectorAll("div, span, button")) {
    const t = (el.textContent || "").trim();
    if (t === "Ayo belajar") {
      const cs = getComputedStyle(el);
      out.newLabel.push({
        text: t,
        bg: cs.backgroundColor,
        color: cs.color,
        radius: cs.borderRadius,
        fontSize: cs.fontSize,
        fontWeight: cs.fontWeight,
        animate: cs.animationName,
        visible: el.getBoundingClientRect().width > 0,
      });
    }
    if (t === "Ayo tambang!") out.oldLabel.push(t);
  }
  // whole page text, to be sure nothing else still says it
  out.pageStillHasOld = /Ayo tambang!/.test(document.body.innerText);
  return out;
});

await browser.close();
console.log(JSON.stringify(res, null, 2));