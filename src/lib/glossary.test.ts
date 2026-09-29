import test from "node:test";
import assert from "node:assert/strict";
import { GLOSSARY, glossaryEntry, splitGlossary } from "./glossary.ts";

test("kamus: id unik & semua entri punya definisi yang layak", () => {
  const ids = GLOSSARY.map((e) => e.id);
  assert.equal(new Set(ids).size, ids.length, "ada id duplikat");
  for (const e of GLOSSARY) {
    assert.ok(e.term.trim().length > 0, `${e.id} tanpa istilah`);
    assert.ok(e.def.length >= 30, `${e.id} definisinya terlalu pendek`);
  }
});

test("kamus: related menunjuk id yang benar-benar ada", () => {
  for (const e of GLOSSARY) {
    for (const r of e.related ?? []) {
      assert.ok(glossaryEntry(r), `${e.id} menunjuk related '${r}' yang tidak ada`);
    }
  }
});

test("splitGlossary: menautkan istilah + akhiran Indonesia", () => {
  const seg = splitGlossary("Kalau dompetnya hilang, seed phrase-mu juga ikut hilang.");
  const linked = seg.filter((s) => s.entry).map((s) => s.text);
  assert.deepEqual(linked, ["dompetnya", "seed phrase"]);
});

test("splitGlossary: satu istilah hanya ditautkan sekali per teks", () => {
  const seg = splitGlossary("Gas mahal. Gas murah. Gas tetap dibayar.");
  const linked = seg.filter((s) => s.entry);
  assert.equal(linked.length, 1);
  assert.equal(linked[0].entry?.id, "gas");
});

test("splitGlossary: frasa lebih panjang menang (biaya gas utuh)", () => {
  const seg = splitGlossary("Supaya biaya gas yang dibayar pengguna tetap kecil.");
  const linked = seg.filter((s) => s.entry);
  assert.equal(linked.length, 1);
  assert.equal(linked[0].text, "biaya gas");
  assert.equal(linked[0].entry?.id, "gas");
});

test("splitGlossary: 'web3min' tidak ikut tertaut sebagai 'web3'", () => {
  const seg = splitGlossary("web3min adalah platform edukasi.");
  assert.equal(seg.filter((s) => s.entry).length, 0);
});

test("splitGlossary: teks tanpa istilah tetap utuh & tidak crash saat kosong", () => {
  const plain = "Halo, apa kabar hari ini?";
  assert.deepEqual(splitGlossary(plain), [{ text: plain, entry: null }]);
  assert.deepEqual(splitGlossary(""), [{ text: "", entry: null }]);
});

test("splitGlossary: teks lengkap tetap sama saat segmen disatukan kembali", () => {
  const text = "Kalau lupa seed phrase, dompetmu tidak bisa dipulihkan. Simpan di tempat aman.";
  const joined = splitGlossary(text)
    .map((s) => s.text)
    .join("");
  assert.equal(joined, text);
});
