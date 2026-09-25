import test from "node:test";
import assert from "node:assert/strict";
import { buildMeta, DEFAULT_SITE_TITLE, DEFAULT_DESCRIPTION, BASE_URL } from "./seo.ts";

test("buildMeta generates all required meta and link tags with defaults", () => {
  const result = buildMeta();

  assert.ok(Array.isArray(result.meta));
  assert.ok(Array.isArray(result.links));

  const metaMap = new Map<string, string>();
  for (const m of result.meta) {
    if ("title" in m) metaMap.set("title", m.title as string);
    if ("name" in m) metaMap.set(`name:${m.name}`, m.content as string);
    if ("property" in m) metaMap.set(`property:${m.property}`, m.content as string);
  }

  assert.equal(metaMap.get("title"), DEFAULT_SITE_TITLE);
  assert.equal(metaMap.get("name:description"), DEFAULT_DESCRIPTION);
  assert.equal(metaMap.get("property:og:type"), "website");
  assert.equal(metaMap.get("property:og:site_name"), "web3min");
  assert.equal(metaMap.get("property:og:title"), DEFAULT_SITE_TITLE);
  assert.equal(metaMap.get("property:og:description"), DEFAULT_DESCRIPTION);
  assert.equal(metaMap.get("property:og:url"), BASE_URL);
  assert.equal(metaMap.get("property:og:image"), `${BASE_URL}/og-image.png`);
  assert.equal(metaMap.get("property:og:image:width"), "1200");
  assert.equal(metaMap.get("property:og:image:height"), "630");
  assert.equal(metaMap.get("name:twitter:card"), "summary_large_image");
  assert.equal(metaMap.get("name:twitter:title"), DEFAULT_SITE_TITLE);
  assert.equal(metaMap.get("name:twitter:description"), DEFAULT_DESCRIPTION);
  assert.equal(metaMap.get("name:twitter:image"), `${BASE_URL}/og-image.png`);

  const canonical = result.links.find((l) => l.rel === "canonical");
  assert.ok(canonical, "canonical link must exist");
  assert.equal(canonical.href, BASE_URL);
});

test("buildMeta handles custom parameters correctly", () => {
  const custom = buildMeta({
    title: "Apa itu DeFi — web3min",
    description: "Layanan keuangan tanpa teller.",
    path: "/lesson/u5-l1",
    image: "https://web3min.vercel.app/custom.png",
  });

  const metaMap = new Map<string, string>();
  for (const m of custom.meta) {
    if ("title" in m) metaMap.set("title", m.title as string);
    if ("name" in m) metaMap.set(`name:${m.name}`, m.content as string);
    if ("property" in m) metaMap.set(`property:${m.property}`, m.content as string);
  }

  assert.equal(metaMap.get("title"), "Apa itu DeFi — web3min");
  assert.equal(metaMap.get("name:description"), "Layanan keuangan tanpa teller.");
  assert.equal(metaMap.get("property:og:title"), "Apa itu DeFi — web3min");
  assert.equal(metaMap.get("property:og:description"), "Layanan keuangan tanpa teller.");
  assert.equal(metaMap.get("property:og:url"), `${BASE_URL}/lesson/u5-l1`);
  assert.equal(metaMap.get("property:og:image"), "https://web3min.vercel.app/custom.png");
  assert.equal(metaMap.get("name:twitter:title"), "Apa itu DeFi — web3min");
  assert.equal(metaMap.get("name:twitter:image"), "https://web3min.vercel.app/custom.png");

  const canonical = custom.links.find((l) => l.rel === "canonical");
  assert.ok(canonical);
  assert.equal(canonical.href, `${BASE_URL}/lesson/u5-l1`);
});
