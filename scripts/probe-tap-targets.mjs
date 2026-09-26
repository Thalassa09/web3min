#!/usr/bin/env node
/**
 * Ukur tap target SEMUA elemen interaktif di lebar HP nyata (360 & 430).
 * Aturan AGENTS.md: tap target >=44px. Ambang WCAG 2.5.8 (AA) = 24px,
 * tapi aturan repo lebih ketat (44px) -> laporkan keduanya.
 */
import { chromium } from "playwright";

const BASE = process.env.BASE || "http://127.0.0.1:5290";
const ROUTES = ["/", "/kisah", "/shop", "/profile", "/leaderboard"];
const WIDTHS = [360, 430];

const MEASURE = `(() => {
  const sel = 'a[href], button, [role="button"], input:not([type=hidden]), select, textarea, [tabindex]:not([tabindex="-1"])';
  const out = [];
  for (const el of document.querySelectorAll(sel)) {
    const r = el.getBoundingClientRect();
    if (r.width === 0 || r.height === 0) continue;
    const cs = getComputedStyle(el);
    if (cs.visibility === "hidden" || cs.display === "none" || cs.opacity === "0") continue;
    const txt = (el.getAttribute("aria-label") || el.textContent || "").trim().slice(0, 28);
    out.push({
      w: Math.round(r.width), h: Math.round(r.height),
      tag: el.tagName.toLowerCase(),
      txt,
      cls: (el.className && typeof el.className === "string" ? el.className : "").slice(0, 70),
    });
  }
  return out;
})()`;

// Browser bawaan cache mungkin beda versi dari yang diminta Playwright;
// pakai executable yang benar-benar ada supaya probe tidak gagal karena itu.
const EXEC = process.env.PW_CHROME || "/root/.cache/ms-playwright/chromium_headless_shell-1228/chrome-headless-shell-linux64/chrome-headless-shell";
const browser = await chromium.launch({ executablePath: EXEC });
const all = [];
for (const width of WIDTHS) {
  const ctx = await browser.newContext({ viewport: { width, height: 780 }, deviceScaleFactor: 2 });
  const page = await ctx.newPage();
  for (const route of ROUTES) {
    try {
      await page.goto(BASE + route, { waitUntil: "domcontentloaded", timeout: 20000 });
      await page.waitForTimeout(900);
      const items = await page.evaluate(MEASURE);
      for (const it of items) {
        if (it.w < 44 || it.h < 44) {
          all.push({ width, route, ...it });
        }
      }
    } catch (e) {
      all.push({ width, route, error: String(e).slice(0, 80) });
    }
  }
  await ctx.close();
}
await browser.close();

// hanya yang <24px = pelanggaran keras WCAG; 24-43 = di bawah aturan repo
const hard = all.filter(a => !a.error && (a.w < 24 || a.h < 24));
const repo = all.filter(a => !a.error && (a.w < 44 && a.h < 44) && !(a.w < 24 || a.h < 24));

console.log(`\n=== total <44px: ${all.filter(a=>!a.error).length} (${WIDTHS.length} lebar x ${ROUTES.length} rute) ===`);
console.log(`\n### PELANGGARAN KERAS (<24px, gagal WCAG 2.5.8 AA): ${hard.length}`);
const seen = new Set();
for (const a of hard) {
  const k = `${a.tag}|${a.txt}|${a.cls}`;
  if (seen.has(k)) continue; seen.add(k);
  console.log(`  ${String(a.w).padStart(3)}x${String(a.h).padStart(3)}  ${a.tag} "${a.txt}"  ${a.route}@${a.width}`);
  console.log(`         ${a.cls}`);
}
console.log(`\n### di bawah aturan repo 44px (tapi >=24px): ${repo.length}`);
const seen2 = new Set();
let n = 0;
for (const a of repo) {
  const k = `${a.tag}|${a.txt}|${a.cls}`;
  if (seen2.has(k)) continue; seen2.add(k); n++;
  if (n > 14) continue;
  console.log(`  ${String(a.w).padStart(3)}x${String(a.h).padStart(3)}  ${a.tag} "${a.txt}"  ${a.route}@${a.width}`);
}
if (n > 14) console.log(`  ... +${n-14} lainnya`);
