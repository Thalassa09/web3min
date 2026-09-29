import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

/**
 * Guard tanda baca ala AI: em-dash (U+2014) & en-dash (U+2013) tidak boleh
 * muncul di teks yang dilihat user (permintaan langsung: "hilangin tanda
 * baca ai seperti -"). Komentar dibuang dulu (termasuk JSX), jadi menyebut
 * karakter ini di komentar tetap boleh; di string yang dirender = gagal.
 */

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const BANNED = [
  { char: "\u2014", name: "em-dash" },
  { char: "\u2013", name: "en-dash" },
] as const;

function walk(dir: string, exts: string[]): string[] {
  const out: string[] = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(p, exts));
    else if (exts.includes(path.extname(entry.name))) out.push(p);
  }
  return out;
}

/** Blank komentar, sisakan isi string — deteksi hanya kena teks tampil. */
function stripComments(text: string): string {
  const out = text.split("");
  const n = text.length;
  const blank = (a: number, b: number) => {
    for (let k = a; k < Math.min(b, n); k++) if (out[k] !== "\n") out[k] = " ";
  };
  let i = 0;
  while (i < n) {
    if (text.startsWith("//", i)) {
      const j = text.indexOf("\n", i);
      blank(i, j < 0 ? n : j);
      i = j < 0 ? n : j;
    } else if (text.startsWith("/*", i)) {
      const j = text.indexOf("*/", i + 2);
      blank(i, j < 0 ? n : j + 2);
      i = j < 0 ? n : j + 2;
    } else if (text[i] === '"' || text[i] === "'" || text[i] === "`") {
      const q = text[i];
      i++;
      while (i < n) {
        if (text[i] === "\\") {
          i += 2;
          continue;
        }
        if (text[i] === q) {
          i++;
          break;
        }
        i++;
      }
    } else i++;
  }
  return out.join("");
}

function offenders(files: string[], strip: boolean): string[] {
  const bad: string[] = [];
  for (const f of files) {
    const hay = strip ? stripComments(fs.readFileSync(f, "utf8")) : fs.readFileSync(f, "utf8");
    for (const { char, name } of BANNED) {
      if (!hay.includes(char)) continue;
      hay.split("\n").forEach((line, idx) => {
        if (line.includes(char))
          bad.push(`${path.relative(ROOT, f)}:${idx + 1} (${name}) ${line.trim().slice(0, 110)}`);
      });
    }
  }
  return bad;
}

test("teks tampil di src & server bebas em-dash & en-dash", () => {
  const files = [
    ...walk(path.join(ROOT, "src"), [".ts", ".tsx"]).filter((f) => !/\.test\.tsx?$/.test(f)),
    ...walk(path.join(ROOT, "server"), [".ts"]),
  ];
  const bad = offenders(files, true);
  assert.deepEqual(bad, [], `Tanda baca AI di teks yang dilihat user:\n${bad.join("\n")}`);
});

test("file teks publik bebas em-dash & en-dash", () => {
  const files = walk(path.join(ROOT, "public"), [".html", ".js", ".json", ".txt"]);
  const bad = offenders(files, false);
  assert.deepEqual(bad, [], `Tanda baca AI di file publik:\n${bad.join("\n")}`);
});
