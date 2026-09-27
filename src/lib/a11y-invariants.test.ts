import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const read = (p: string) => readFileSync(join(ROOT, p), "utf8");

/**
 * Invarian aksesibilitas & responsivitas (DESIGN-SYSTEM.md §A11y).
 *
 * Guard ini mengunci yang SUDAH benar, bukan menuntut perbaikan besar.
 * Tujuannya mencegah REGRESI pada invarian yang mahal diperbaiki ulang:
 * viewport meta, safe-area di elemen fixed, focus-visible yang tidak boleh
 * dihapus, dan `motion-reduce` di komponen taktil.
 *
 * UTANG TERUKUR yang SENGAJA tidak dipaksa di sini (lihat progress.md):
 *   - 42 berkas punya elemen interaktif tanpa `focus-visible`
 *   - 53 berkas punya transisi tanpa `motion-reduce`
 * Menjadikannya wajib = suite merah besar-besaran. Itu pekerjaan migrasi
 * tersendiri yang butuh keputusan pemilik repo, bukan guard diam-diam.
 */

function tsxFiles(dir: string, acc: string[] = []): string[] {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) {
      if (e.name !== "8bit") tsxFiles(p, acc);
    } else if (e.name.endsWith(".tsx")) acc.push(p);
  }
  return acc;
}

test("viewport meta memuat viewport-fit=cover (safe area iOS)", () => {
  // Tanpa ini, `env(safe-area-inset-*)` tidak pernah terisi di iPhone ber-notch
  // dan navbar bawah tertutup home indicator.
  const root = read("src/routes/__root.tsx");
  assert.match(
    root,
    /name:\s*["']viewport["'][^}]*viewport-fit=cover/,
    "meta viewport wajib memuat viewport-fit=cover",
  );
  assert.match(
    root,
    /width=device-width/,
    "meta viewport wajib memuat width=device-width",
  );
});

test("navbar bawah tetap menghormati safe-area bawah", () => {
  // Navbar fixed di dasar layar; tanpa env() ia tertimpa home indicator.
  const nav = read("src/components/bottom-nav.tsx");
  assert.match(
    nav,
    /safe-area-inset-bottom/,
    "bottom-nav wajib memakai env(safe-area-inset-bottom)",
  );
  assert.match(nav, /\bfixed\b/, "bottom-nav harus tetap fixed (kalau berubah, guard ini perlu ditinjau)");
});

test("komponen taktil baru wajib punya motion-reduce", () => {
  // Chip & tombol taktil bergerak saat ditekan. Pengguna yang minta
  // `prefers-reduced-motion` harus dapat versi tanpa transisi.
  for (const p of ["src/components/ui/chip.tsx", "src/components/ui/tamagui-tactile-button.tsx"]) {
    const txt = read(p);
    const hasTransition = /transition-\[|transition-all|duration-\d/.test(txt);
    if (!hasTransition) continue;
    assert.match(
      txt,
      /motion-reduce:transition-none/,
      `${p} punya transisi tapi tanpa motion-reduce:transition-none`,
    );
  }
});

test("focus-visible tidak boleh dihapus dari komponen yang sudah punya", () => {
  // 27 pemakaian focus-visible:outline di 6 berkas kode (diukur, bukan
  // dikarang). Menghapus salah satunya = keyboard user kehilangan penanda
  // posisi. Guard mengunci keberadaannya per berkas.
  const filesWithFocus = tsxFiles(join(ROOT, "src"))
    .map((p) => p.replace(`${ROOT}/`, ""))
    .filter((rel) => read(rel).includes("focus-visible:outline"));

  const expected = [
    "src/components/ui/tactile-button.tsx",
    "src/components/ui/button.tsx",
    "src/components/duo-button.tsx", // catatan: di components/, BUKAN components/ui/
    "src/components/bottom-nav.tsx",
  ];
  for (const p of expected) {
    assert.ok(
      filesWithFocus.includes(p),
      `${p} kehilangan focus-visible:outline — keyboard user tidak punya penanda fokus`,
    );
  }
});

test("outline-none hanya sah kalau ada pengganti fokus yang terlihat", () => {
  // WCAG 2.4.7. `outline-none` polos = celah. Pengganti yang SAH dan sudah
  // dipakai di repo (diukur, bukan dikarang):
  //   - `focus-visible:outline-*`  → komponen taktil (tactile-button, duo-button)
  //   - `focus:ring-*`             → pola shadcn (admin-raffle-modal, admin)
  //   - `focus:border-*` + `focus:shadow-*` → input form (masuk.tsx) —
  //     border & slab berubah warna saat fokus, terlihat jelas.
  // Yang DILARANG: outline-none tanpa salah satu dari tiga pola itu.
  const offenders: string[] = [];
  for (const p of tsxFiles(join(ROOT, "src"))) {
    const rel = p.replace(`${ROOT}/`, "");
    if (rel.includes(".test.")) continue; // guard ini menyebut polanya sendiri
    const txt = read(rel);
    if (!/\boutline-none\b/.test(txt)) continue;
    const hasReplacement =
      /focus-visible:outline/.test(txt) ||
      /focus:ring-|focus-visible:ring/.test(txt) ||
      /focus:border-|focus:shadow-/.test(txt);
    if (!hasReplacement) offenders.push(rel);
  }
  assert.deepEqual(
    offenders,
    [],
    `outline-none tanpa pengganti fokus (WCAG 2.4.7):\n${offenders.map((o) => `  ${o}`).join("\n")}`,
  );
});

test("dock sub-navigasi memakai penanda status yang bisa dibaca screen reader", () => {
  // 7 pill dock nyata; sebagian hanya memakai warna untuk menandai tab aktif.
  // DESIGN.md §5 mewajibkan aria-current="page" (atau aria-pressed untuk
  // kontrol non-navigasi). Guard mengunci yang SUDAH punya; sisanya tercatat
  // sebagai utang di progress.md.
  const docks: Array<[string, string]> = [
    ["src/routes/kisah.index.tsx", "aria-pressed"],
    ["src/routes/profile.tsx", "aria-pressed"],
    ["src/routes/shop.tsx", "aria-pressed"],
  ];
  for (const [p, marker] of docks) {
    assert.match(
      read(p),
      new RegExp(marker),
      `${p} kehilangan ${marker} pada dock — status tab aktif jadi warna-saja (gagal WCAG 1.4.1)`,
    );
  }
});
