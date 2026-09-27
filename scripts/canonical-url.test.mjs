/**
 * Uji `canonicalFromDocument` — pembaca canonical yang dipakai middleware OG
 * (`server/middleware/grok-pwa.ts` → `injectGrokPwaHead`).
 *
 * Kenapa ini perlu dijaga: nilai yang dikembalikan fungsi ini menjadi
 * `og:url` SETIAP halaman. Bug nyata yang pernah terjadi (2026-09-27):
 * fungsi mengambil canonical PERTAMA, sedangkan root route selalu menulis
 * canonical alamat beranda lebih dulu → `og:url` semua halaman jadi
 * `https://web3min.com`, termasuk `/u/<nama>` yang seharusnya tautan profil.
 * Terbukti di produksi sebelum diperbaiki.
 */
import test from "node:test";
import assert from "node:assert/strict";
import { canonicalFromDocument } from "./grok-pwa-shared.mjs";

test("mengambil canonical TERAKHIR (milik rute, bukan root)", () => {
  const html =
    '<head>' +
    '<link rel="canonical" href="https://web3min.com"/>' +
    '<link rel="canonical" href="https://web3min.com/u/rik"/>' +
    "</head>";
  assert.equal(canonicalFromDocument(html), "https://web3min.com/u/rik");
});

test("satu canonical dipakai apa adanya", () => {
  const html = '<head><link rel="canonical" href="https://web3min.com/about"/></head>';
  assert.equal(canonicalFromDocument(html), "https://web3min.com/about");
});

test("tanpa canonical mengembalikan string kosong (bukan crash)", () => {
  assert.equal(canonicalFromDocument("<head></head>"), "");
  assert.equal(canonicalFromDocument(""), "");
  assert.equal(canonicalFromDocument(undefined), "");
});

test("urutan atribut tidak berpengaruh (href sebelum rel)", () => {
  const html = '<head><link href="https://web3min.com/x" rel="canonical"></head>';
  assert.equal(canonicalFromDocument(html), "https://web3min.com/x");
});

test("tag non-canonical diabaikan", () => {
  const html =
    '<head>' +
    '<link rel="icon" href="/favicon.svg"/>' +
    '<link rel="canonical" href="https://web3min.com/supporter"/>' +
    '<link rel="stylesheet" href="/app.css"/>' +
    "</head>";
  assert.equal(canonicalFromDocument(html), "https://web3min.com/supporter");
});

test("kutip tunggal dan spasi di sekitar '=' tetap terbaca", () => {
  const html = "<head><link rel = 'canonical' href = 'https://web3min.com/a' /></head>";
  assert.equal(canonicalFromDocument(html), "https://web3min.com/a");
});
