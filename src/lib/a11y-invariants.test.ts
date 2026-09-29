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
 * ⚠️ KOREKSI PENTING (Langkah 26) — jangan ulangi kesalahan ini:
 * Sempat tercatat "42 berkas tanpa focus-visible" dan "53 berkas tanpa
 * motion-reduce" sebagai utang. **Itu SALAH.** Angka itu dihitung dari
 * kemunculan KELAS Tailwind (`focus-visible:*`) dan mengabaikan aturan
 * GLOBAL yang sudah ada di `src/styles.css`:
 *
 *   button:focus-visible, a:focus-visible, input:focus-visible {
 *     outline: 3px solid var(--color-primary, #E8437F) !important;
 *   }
 *   @media (prefers-reduced-motion: reduce) { *, *::before, *::after { … !important } }
 *
 * Keduanya bertahan sampai build (`styles-*.css`) dan TERBUKTI bekerja:
 * Tab 8× di 5 halaman → 39/40 elemen dapat outline 3px pink.
 * Pelajaran: **ukur EFEK, bukan hitung kelas.** Menghitung pola teks
 * menghasilkan utang palsu dan risiko "memperbaiki" sesuatu yang sudah benar.
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
  // (tamagui-tactile-button.tsx dihapus bersama /tamagui-poc — S12 triase;
  // kalau komponen taktil baru ditambahkan, masukkan ke daftar ini lagi.)
  for (const p of ["src/components/ui/chip.tsx"]) {
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

test("aturan focus-visible GLOBAL ada di styles.css (menutup semua elemen native)", () => {
  // Ini yang membuat 42 "berkas tanpa focus-visible" jadi utang PALSU: satu
  // aturan global menutup SEMUA button/a/input. Kalau aturan ini dihapus,
  // ratusan elemen kehilangan penanda fokus sekaligus.
  const css = read("src/styles.css");
  // Selector boleh berkembang (mis. `[role="button"]`, `select`, `textarea`),
  // jadi yang dikunci adalah KEBERADAAN ketiga selector inti + isi aturannya.
  for (const sel of ["button:focus-visible", "a:focus-visible", "input:focus-visible"]) {
    assert.ok(css.includes(sel), `aturan focus-visible global kehilangan selector ${sel}`);
  }
  const blok = css.match(/button:focus-visible[\s\S]{0,600}?\}/)?.[0] ?? "";
  assert.match(blok, /outline:\s*3px\s+solid/, "outline global wajib 3px solid");
  assert.match(blok, /!important/, "outline global wajib !important supaya menang atas utility Tailwind");
  // Elemen non-native ber-role juga wajib tercakup, kalau tidak mereka hanya
  // dapat outline default browser 1px hitam (terukur, bukan dugaan).
  assert.match(blok, /\[role="button"\]:focus-visible/, "selector [role=button]:focus-visible hilang");
  assert.match(blok, /\[role="tab"\]:focus-visible/, "selector [role=tab]:focus-visible hilang");
});

test("prefers-reduced-motion global mematikan animasi & transisi", () => {
  // Sama seperti di atas: 2 blok global ini yang membuat "53 berkas tanpa
  // motion-reduce" jadi utang PALSU.
  const css = read("src/styles.css");
  const blok = [...css.matchAll(/@media\s*\(\s*prefers-reduced-motion:\s*reduce\s*\)\s*\{[\s\S]{0,400}?\n\}/g)];
  assert.ok(blok.length >= 1, "tidak ada blok prefers-reduced-motion di styles.css");
  const gabung = blok.map((m) => m[0]).join("\n");
  assert.match(gabung, /animation-duration:\s*0\.01ms\s*!important/, "animasi wajib dimatikan");
  assert.match(gabung, /transition-duration:\s*0\.01ms\s*!important/, "transisi wajib dimatikan");
});

test("elemen non-native yang bisa diklik harus bisa dijangkau keyboard", () => {
  // `div`/`span` dengan onClick TIDAK dapat fokus keyboard secara default.
  // Backdrop (klik-luar-untuk-tutup) dikecualikan — itu memang bukan kontrol.
  // Panel modal (stopPropagation) juga dikecualikan — klik di dalamnya bukan aksi.
  //
  // CATATAN IMPLEMENTASI — jangan kembali ke regex naif:
  //   /<(div|span)([^>]*?)onClick/  → hanya melihat atribut SEBELUM onClick
  //   /<(div|span)((?:[^>]|=>)+?)>/ → `[^>]` cocok dengan `=`, jadi `>` pada
  //     panah `=>` dikira penutup tag; tag terpotong di tengah.
  // JSX tidak bisa diparse dengan regex sederhana (atribut bisa multi-baris,
  // berisi `>` di dalam string/arrow function, dan urutan atribut bebas).
  // Karena itu dipakai pemindai karakter: lacak kedalaman `{…}` dan anggap
  // `>` sebagai penutup tag hanya saat kedalaman 0 dan tidak didahului `=`.
  function scanTags(txt: string): Array<{ tag: string; attrs: string; end: number }> {
    const out: Array<{ tag: string; attrs: string; end: number }> = [];
    const re = /<(div|span)\b/g;
    let m: RegExpExecArray | null;
    while ((m = re.exec(txt))) {
      let i = m.index + m[0].length;
      let depth = 0;
      while (i < txt.length && i - m.index < 1500) {
        const c = txt[i];
        if (c === "{") depth++;
        else if (c === "}") depth--;
        else if (c === ">" && depth === 0 && txt[i - 1] !== "=") break;
        i++;
      }
      if (i >= txt.length || i - m.index >= 1500) continue;
      out.push({ tag: m[1], attrs: txt.slice(m.index + m[0].length, i), end: i + 1 });
    }
    return out;
  }

  const offenders: string[] = [];
  for (const p of tsxFiles(join(ROOT, "src"))) {
    const rel = p.replace(`${ROOT}/`, "");
    if (rel.includes(".test.")) continue;
    const txt = read(rel);
    for (const t of scanTags(txt)) {
      if (!/\bonClick\b/.test(t.attrs)) continue;
      if (t.attrs.includes("inset-0")) continue; // backdrop
      // Kontrol non-native wajib punya KEDUANYA: `tabIndex` (agar bisa dijangkau
      // Tab) DAN `onKeyDown` (agar bisa diaktifkan Enter/Space). Punya salah
      // satu saja tidak cukup — `tabIndex` tanpa `onKeyDown` = bisa difokus tapi
      // tidak bisa diaktifkan; `onKeyDown` tanpa `tabIndex` = tidak pernah fokus.
      const hasTab = /\btabIndex\b/.test(t.attrs);
      const hasKey = /\bonKeyDown\b/.test(t.attrs);
      if (hasTab && hasKey) continue;
      // Pengecualian sah: overlay "lewati" di coach.tsx memakai `tabIndex={-1}`
      // (SENGAJA tidak masuk urutan Tab) dan punya jalan keluar keyboard lain
      // — tombol "Lewati" + handler Escape. Yang dikecualikan HANYA tabIndex={-1};
      // `tabIndex={0}` tetap wajib punya onKeyDown.
      if (/tabIndex\s*=\s*\{\s*-1\s*\}/.test(t.attrs)) continue;
      // Konvensi repo: onClick yang memanggil `stopPropagation()` adalah
      // "click containment" (panel modal / gelembung yang menahan klik agar
      // tidak menutup induknya), BUKAN aksi yang bisa diaktifkan keyboard.
      if (/stopPropagation/.test(t.attrs)) continue;
      const sesudah = txt.slice(t.end, t.end + 300);
      if (sesudah.includes("stopPropagation")) continue; // pola lain (di luar tag)
      offenders.push(`${rel}: <${t.tag}> ${t.attrs.replace(/\s+/g, " ").trim().slice(0, 90)}`);
    }
  }
  assert.deepEqual(
    offenders,
    [],
    `Elemen non-native bisa diklik tapi tak terjangkau keyboard (WCAG 2.1.1):\n${offenders
      .map((o) => `  ${o}`)
      .join("\n")}`,
  );
});

test("dock sub-navigasi memakai penanda status yang bisa dibaca screen reader", () => {
  // 7 pill dock nyata. Status tab aktif TIDAK boleh disampaikan lewat warna saja
  // (WCAG 1.4.1). Dua pola sah di repo:
  //   - navigasi antar-halaman  → `aria-current="page"`  (leaderboard ↔ raffle)
  //   - toggle mode/filter      → `aria-pressed={...}`   (kisah.index, profile, shop)
  // Guard mengunci KETUJUHNYA; sebelumnya hanya 3 yang punya.
  const docks: Array<[string, string, string]> = [
    ["src/routes/kisah.index.tsx", "aria-pressed", "dock kategori Kisah"],
    ["src/routes/profile.tsx", "aria-pressed", "dock tab Profil"],
    ["src/routes/shop.tsx", "aria-pressed", "dock mode & filter Toko"],
    ["src/routes/raffle.tsx", 'aria-current="page"', "dock Undian (tab aktif)"],
    ["src/routes/leaderboard.tsx", 'aria-current="page"', "dock Klasemen (tab aktif)"],
  ];
  for (const [p, marker, label] of docks) {
    assert.match(
      read(p),
      new RegExp(marker.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")),
      `${label}: ${p} kehilangan ${marker} — status tab aktif jadi warna-saja (gagal WCAG 1.4.1)`,
    );
  }
});

test("komponen ber-portal tidak merender di server maupun render-pertama klien", () => {
  // Langkah 28: hydration error #418 di `/` ternyata berasal dari `coach.tsx`:
  //   `if (!active || typeof document === "undefined") return null;`
  // Server → `null`. Klien render pertama → `typeof document` ADA, jadi ia
  // langsung mengembalikan `createPortal(...)`. React melihat pohon berbeda
  // dan melempar #418 di SETIAP kunjungan ke beranda.
  //
  // Aturan: komponen yang memakai `createPortal` WAJIB menunggu `mounted`
  // (state yang baru `true` di dalam useEffect) sebelum merender portal, supaya
  // render pertama klien identik dengan server.
  //
  // Catatan: `dialog.tsx` saat ini aman KEBETULAN (`open` selalu false di render
  // pertama), tapi pola itu rapuh — begitu ada dialog `open=true` saat render
  // awal, bug yang sama muncul. Guard ini menutupnya untuk semua komponen.
  const files = tsxFiles(join(ROOT, "src"));
  const offenders: string[] = [];

  for (const f of files) {
    const src = readFileSync(f, "utf8");
    if (!src.includes("createPortal")) continue;
    const pakaiPortal = /return\s+createPortal|createPortal\(/.test(src);
    if (!pakaiPortal) continue;

    // Dua pola yang SAH di repo:
    //   (a) guard awal:  `if (!mounted || !active) return null;` lalu `return createPortal(...)`
    //       (coach.tsx, dialog.tsx, side-nav.tsx)
    //   (b) ekspresi ternary: `useFixedPosition && mounted && typeof document !== "undefined"
    //       ? createPortal(overlayMarkup, document.body) : overlayMarkup`
    //       (bubble-menu.tsx)
    // Keduanya wajib memuat `mounted`. Yang diperiksa adalah `mounted` DI DEKAT
    // pemakaian portal, bukan sembarang guard di berkas — `coach.tsx` juga punya
    // `if (!el) return null` untuk helper pengukuran, dan itu bukan guard portal.
    const punyaGuardMounted = /if\s*\(\s*!mounted\b/.test(src) || /&&\s*mounted\s*&&/.test(src);
    if (!punyaGuardMounted) {
      offenders.push(
        `${f.replace(ROOT + "/", "")} — portal dirender tanpa menunggu \`mounted\``,
      );
    }
  }

  assert.deepEqual(
    offenders,
    [],
    `Komponen ber-portal bisa memicu hydration mismatch #418:\n${offenders
      .map((o) => `  ${o}`)
      .join("\n")}\nTambah: const [mounted, setMounted] = useState(false); useEffect(() => setMounted(true), []); lalu \`if (!mounted || …) return null;\``,
  );
});
