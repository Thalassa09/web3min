import { chromium } from "playwright";
import { writeFileSync } from "node:fs";

const PAGES = ["/about", "/cara", "/kisah", "/"];
const BASE = "http://127.0.0.1:5199";

const browser = await chromium.launch({
  executablePath: "/usr/bin/google-chrome",
  headless: true,
  args: ["--no-sandbox", "--disable-setuid-sandbox"],
});

const report = {};
for (const p of PAGES) {
  const page = await browser.newPage();
  const res = await page.goto(BASE + p, { waitUntil: "domcontentloaded" });
  const status = res.status();
  const raw = await res.text(); // server HTML before JS
  const body = raw.split("<body")[1] ?? raw;
  const noScript = body.replace(/<script[\s\S]*?<\/script>/g, "");
  const text = noScript.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  report[p] = { status, htmlBytes: raw.length, textLen: text.length, sample: text.slice(0, 140) };
  await page.close();
}

await browser.close();
writeFileSync("/tmp/ssr-report.json", JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 2));