import { chromium } from "playwright";
const BASE = process.env.BASE ?? "http://127.0.0.1:5218";
const browser = await chromium.launch({
  executablePath: "/usr/bin/google-chrome",
  headless: true,
  args: ["--no-sandbox", "--disable-setuid-sandbox"],
});
const ctx = await browser.newContext({ viewport: { width: 390, height: 800 } });
const page = await ctx.newPage();

const consoleErrs = [];
const pageErrs = [];
page.on("console", (m) => {
  if (m.type() === "error") consoleErrs.push(m.text().slice(0, 200));
});
page.on("pageerror", (e) => pageErrs.push(String(e).slice(0, 200)));

const probes = ["/kisah/s-dm", "/kisah/s-eth", "/kisah/s-cs"];
for (const p of probes) {
  try {
    await page.goto(BASE + p, { waitUntil: "load", timeout: 40000 });
    await page.waitForTimeout(3500);
    const r = await page.evaluate(() => ({
      url: location.pathname,
      title: document.title,
      h1: document.querySelector("h1")?.textContent?.trim().slice(0, 60) ?? null,
      bodyStart: document.body.innerText.replace(/\s+/g, " ").slice(0, 110),
    }));
    const redirected = r.url !== p;
    console.log(`${p.padEnd(15)} -> url=${r.url}  ${redirected ? "REDIRECT (BUG)" : "OK"}`);
    console.log(`                title="${r.title.slice(0, 55)}"`);
    console.log(`                body="${r.bodyStart}"`);
  } catch (e) {
    console.log(`${p}: ERROR ${String(e).slice(0, 120)}`);
  }
}

console.log(`\nconsole errors: ${consoleErrs.length}`);
for (const e of [...new Set(consoleErrs)].slice(0, 6)) console.log("  ", e);
console.log(`page errors: ${pageErrs.length}`);
for (const e of [...new Set(pageErrs)].slice(0, 4)) console.log("  ", e);

await browser.close();