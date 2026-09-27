import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import assert from "node:assert/strict";
import test from "node:test";

const ROOT = process.cwd();
const COACH = join(ROOT, "src/components/coach.tsx");

function walk(dir: string): string[] {
  const out: string[] = [];
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    if (statSync(p).isDirectory()) out.push(...walk(p));
    else if (/\.tsx?$/.test(entry)) out.push(p);
  }
  return out;
}

/**
 * Buang komentar sebelum memindai.
 *
 * Tanpa ini guard cocok dengan dokumentasinya SENDIRI dan dengan JSDoc —
 * sudah dibuktikan: menghapus `data-coach="start"` dari komponen tetap lolos
 * karena guard menemukan teks itu di komentarnya sendiri. Yang dihitung harus
 * kode, bukan prosa.
 */
function stripComments(src: string): string {
  return src.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/[^\n]*/g, "");
}

/**
 * Setiap `target` di STEPS coach.tsx WAJIB punya penulis `data-coach="<target>"`
 * yang benar-benar sampai ke DOM.
 *
 * Kenapa guard ini ada: `data-coach` dibaca `coach.tsx` (`readBox` +
 * `scrollIntoView`) tapi tidak ada yang menulisnya. Akibatnya `readBox`
 * mengembalikan `null` selama 24 percobaan (~1,2 detik), `spot` tetap `null`,
 * dan tur berjalan TANPA spotlight — panel muncul, tapi tidak ada yang disorot.
 * Itu terjadi di produksi tanpa error apa pun, jadi tidak ada yang menyadarinya.
 *
 * Riwayat: `data-coach="start"` & `"node"` dulu ditulis `home-dock.tsx` /
 * `path-map.tsx`. Saat kedua berkas itu digantikan (`90cf743`, `1974a55`),
 * penandanya hilang sementara pembacanya tetap. `"hearts"` bahkan tidak pernah
 * ditulis sejak commit pertama.
 *
 * Dua bentuk penulis yang diakui:
 *   1. literal  — `data-coach="start"` pada elemen nyata.
 *   2. ekspresi — `data-coach={coach ? "node" : undefined}`. Untuk bentuk ini
 *      prop-nya (`coach`) WAJIB dioper oleh berkas lain (`coach={isNow}`);
 *      kalau tidak, atributnya tidak pernah muncul di DOM. Inilah yang
 *      membedakan "penulis ada" dari "penulis AKTIF".
 *
 * Batas yang diketahui: guard ini statis. Ia tidak bisa membuktikan prop
 * kondisional benar-benar bernilai `true` saat runtime (mis. `coach={isNow}`
 * yang `isNow`-nya selalu `false`). Lapisan itu ditutup verifikasi browser.
 */
test("setiap target coach punya penulis data-coach yang aktif", () => {
  const coachSrc = readFileSync(COACH, "utf8");
  const targets = [...coachSrc.matchAll(/target:\s*"([^"]+)"/g)].map((m) => m[1]);
  assert.ok(targets.length > 0, "coach.tsx tidak punya STEPS dengan `target`");

  const sources = walk(join(ROOT, "src"))
    .filter((f) => f !== COACH && !/\.test\./.test(f))
    .map((f) => ({
      path: f.replace(ROOT + "/", ""),
      src: stripComments(readFileSync(f, "utf8")),
    }));

  const problems: string[] = [];

  for (const target of targets) {
    const literal = new RegExp(`data-coach="${target}"`);
    const literalWriters = sources.filter(({ src }) => literal.test(src));
    if (literalWriters.length > 0) continue;

    // Bentuk ekspresi: kumpulkan identifier prop yang dikondisikan.
    const props: { prop: string; where: string }[] = [];
    for (const { path, src } of sources) {
      for (const m of src.matchAll(/data-coach=\{([^\n}]*)\}/g)) {
        const expr = m[1];
        if (!expr.includes(`"${target}"`)) continue;
        const id = expr.match(/^\s*([A-Za-z_$][\w$]*)/);
        if (id) props.push({ prop: id[1], where: path });
      }
    }

    if (props.length === 0) {
      problems.push(`  "${target}" — tidak ada data-coach="${target}" di src/`);
      continue;
    }

    // Prop harus benar-benar dioper oleh berkas lain, kalau tidak atributnya
    // tidak pernah muncul di DOM.
    for (const { prop, where } of props) {
      const passed = sources.some(
        ({ path, src }) => path !== where && new RegExp(`\\b${prop}=\\{`).test(src),
      );
      if (!passed) {
        problems.push(
          `  "${target}" — penulis di ${where} memakai prop \`${prop}\`, ` +
            `tapi tidak ada berkas lain yang mengoper \`${prop}={...}\``,
        );
      }
    }
  }

  assert.deepEqual(
    problems,
    [],
    `Target coach tanpa penulis aktif — tur akan berjalan tanpa spotlight:\n${problems.join(
      "\n",
    )}`,
  );
});
