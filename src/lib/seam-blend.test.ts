import { test } from "node:test";
import assert from "node:assert/strict";
import { mixSeamColor } from "./pulau-rantai.ts";

/**
 * Zone seam contract: two stacked islands meet with a shared colour band.
 * If the two bands hold DIFFERENT colours at the join row, the map shows a
 * hard "patah" line (measured 133-192 RGB units of step in production).
 * These tests lock the property that makes it seamless: both sides of a join
 * resolve to the same colour.
 */

test("mixSeamColor returns the exact average of the two island colours", () => {
  assert.equal(mixSeamColor("#000000", "#FFFFFF"), "#808080");
  // (29,59,34) + (75,47,99) = (52,53,66.5) -> #343543; matches the value the
  // browser resolves for --seam-color at the u1/u2 join.
  assert.equal(mixSeamColor("#1D3B22", "#4B2F63"), "#343543");
});

test("mixSeamColor is order-independent, so both seam bands agree", () => {
  const a = mixSeamColor("#1D3B22", "#4B2F63");
  const b = mixSeamColor("#4B2F63", "#1D3B22");
  assert.equal(a, b, "join colour must not depend on which island asks");
});

test("mixSeamColor always emits a valid 6-digit hex", () => {
  const out = mixSeamColor("#2B1622", "#FDE68A");
  assert.match(out, /^#[0-9A-Fa-f]{6}$/);
});

test("mixSeamColor passes through an unparseable colour instead of crashing", () => {
  assert.equal(mixSeamColor("not-a-colour", "#FFFFFF"), "not-a-colour");
  assert.equal(mixSeamColor("#FFF", "#FFFFFF"), "#FFF");
});

test("a mixed join colour never equals either raw island colour (real blend)", () => {
  const from = "#1D3B22";
  const to = "#FDE68A";
  const mixed = mixSeamColor(from, to);
  assert.notEqual(mixed.toUpperCase(), from.toUpperCase());
  assert.notEqual(mixed.toUpperCase(), to.toUpperCase());
});