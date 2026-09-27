# DESIGN.md — Web3min "Gamified UI / Soft Neo-Brutalism" Design System

Dokumen spesifikasi desain tunggal (Single Source of Truth) untuk seluruh antarmuka Web3min.  
Mengkodifikasi identitas visual dari `https://web3min.com/leaderboard` untuk diterapkan secara seragam di seluruh halaman.

> ⚠️ **SEBELUM menyalin resep token dari dokumen desain lain (termasuk draft "Tactile Arcade" v1.1):** nama token Tailwind bisa SAMA tapi hex-nya BEDA. Tiga jebakan terverifikasi (skala `candy-*` bergeser & pink brand hilang · `shadow-slab-*` yang gagal senyap · `choco-600` vs `choco-700` tertukar) didokumentasikan di **`DESIGN-SYSTEM.md` §8**. Aturannya: **cocokkan hex dulu dengan `@theme` di `src/styles.css` — kode yang menang, dokumen yang diperbaiki.** Dijaga `src/lib/token-scale.test.ts`.

---

## 1. Filosofi & Karakter Desain

- **Gaya:** *Gamified UI  / Soft Neo-Brutalism*.
- **Karakter: Garis outline tebal ala komik, hard offset shadow 3D tanpa blur, palet pastel dengan gradien lembut, dan sudut membulat yang ramah (squircle / organic rounded).
- Emosi: Menyenangkan dan tidak mengintimidasi seperti banyak produk Web3 yang dingin dan kaku. Rasanya seperti main game arcade saku.

---

## 2. Master Design Tokens

> **Peta alias warna** (84 deklarasi · 83 nama · 46 hex unik · 20 grup alias) ada di **`DESIGN-SYSTEM.md` §9**. Ringkasnya: `candy-500` = `primary` = `ring` = `blobi` = `#E8437F` · `choco-900` = `ink-900` = `border` = `#3B2218` · `choco-600` = `muted` = `#6B4A3A`. Alias **jangan dihapus** (ratusan call-site) dan **jangan dipecah** (dua nama yang sama warna jadi beda diam-diam). Dijaga `src/lib/color-alias.test.ts`.

### 2.1 Warna Fondasi (Surface & Neutrals)
| Peran | Hex | Utility CSS / Class | Keterangan |
|---|---|---|---|
| **Latar Canvas** | `#FFF6EE` | `bg-cream` / `bg-[#FDFBF7]` | Latar halaman utama |
| **Surface Card** | `linear-gradient(180deg, #FFFFFF 0%, #FFF9F5 65%, #FDEEE4 100%)` | `bg-gradient-to-b from-white via-[#FFF9F5] to-[#FDEEE4]` | Kartu putih berkedalaman |
| **Line & Outline** | `#3B2218` | `border-choco-900` | Garis outline cokelat gelap |
| **Line Subdued** | `rgba(59, 34, 24, 0.18)` | `border-choco-900/18` | Garis batas sekunder / pill dock |
| **Teks Utama** | `#3B2218` | `text-choco-900` | Teks heading & judul |
| **Teks Sekunder** | `#6B4A3A` | `text-choco-700` / `text-choco-600` | Teks penjelasan / body |

### 2.2 Warna Gradien Tematik (Bento Cards)
| Tema Kartu | Gradien | Border & Shadow | Pemakaian |
|---|---|---|---|
| **Gold (Liga Emas / Prestasi)** | `from-[#FFFBEB] via-[#FEF3C7] to-[#FDE68A]` | `border-2 border-choco-900 shadow-[0_6px_0_#3B2218]` | Hero klasemen, bridge reward, peti koin |
| **Rose Pink (Undian / Hadiah)** | `from-[#FFF0F5] via-[#FFE4EC] to-[#FDC8D8]` | `border-2 border-choco-900 shadow-[0_6px_0_#3B2218]` | Hero undian, bridge raffle, toko Blobi |
| **Mint (Kedaulatan / On-Chain)** | `from-[#F0FDF4] via-[#DCFCE7] to-[#BBF7D0]` | `border-2 border-emerald-700 shadow-[0_6px_0_#15803D]` | Bukti blockchain, safe-state, modul lulus |
| **Pill Dock Glass** | `from-white via-[#FFF9F5] to-[#FDEEE4]` | `border-2 border-choco-900/20 shadow-[0_4px_0_#3B2218]` | Sub-navigation switcher, search filter bar |

### 2.3 Tombol Taktil 3D (Buttons & CTAs)

> **⚠️ PENTING — ada DUA ramp pink yang berbeda, jangan tertukar.**
> `styles.css` **tidak berlapis** (`unlayered`), sedangkan utility Tailwind hidup di `@layer utilities`. Menurut aturan cascade, **unlayered menang** — jadi setiap elemen yang memakai kelas `.btn-gummy` **mengabaikan** utility `from-[#D62A78] …` di barisnya dan memakai ramp `.btn-gummy`. Dibuktikan empiris di Chromium dengan CSS build produksi (Langkah 18).

1. **Primary Candy CTA — dua jalur, hasil sama-sama lolos AA:**
   - **(a) Lewat `.btn-gummy`** (dipakai `ui/button.tsx`; utility di baris itu **kalah**): latar `linear-gradient(180deg, #B01F62 0%, #85174A 60%, #6E1239 100%)` · border `2px solid rgba(176,31,98,0.6)` · radius `16px` · slab `0 4px 0 #6E1239` · label `15px/700` putih. Kontras terukur: **6,53 / 9,46 / 11,61:1**; hover `brightness(1.03)` → terburuk **6,25:1** ✅
   - **(b) Utility ramp langsung** (9 call-site yang **tidak** memakai `.btn-gummy`: `side-nav`, `desk-rail`, `raffle` ×2, `shop` ×4, `leaderboard`): `from-[#D62A78] via-[#B01F62] to-[#85174A]` + `border-2 border-choco-900` + `shadow-[0_3px_0_#3B2218]`. Kontras: **4,71 / 6,53 / 9,46:1**; dengan `hover:brightness-105` stop-0 turun ke **4,32:1** — di bawah 4,5 untuk teks kecil. **Jangan pakai ramp ini untuk label putih di bawah ~18px**; kalau perlu hover, pakai `brightness-103` (≥5:1) atau mulai dari `#B01F62`.
   - Active state: `active:translate-y-1 active:shadow-none` (`.btn-gummy` memakai `translateY(2px)` + slab `0 1px 0`).
2. **Gold Action Button** (`variant="coin"` / `--lemon`):
   - Latar: `bg-gradient-to-b from-[#FFE873] via-[#FFD84D] to-[#E6BF35]`
   - Border: `border-2 border-amber-600/50` (`.btn-gummy--coin` memakai `rgba(194,140,24,0.6)`)
   - Shadow: `shadow-[0_4px_0_#C8940C]`
   - Teks: `text-choco-900 font-pixel font-bold`
3. **Secondary / White Button:**
   - Latar: `bg-white hover:bg-cream` (`.btn-gummy--secondary` = `linear-gradient(180deg,#FFFFFF,#FFF8F2 60%,#FDEEE4)`)
   - Border: `border-2 border-choco-900/20`
   - Shadow: `shadow-[0_4px_0_#3B2218]`
   - Teks: `text-candy-600` di `.btn-gummy--secondary` → **4,41:1** di atas krem (di bawah 4,5 untuk teks kecil; aman untuk `font-bold ≥15px` atau ganti `candy-700` = 6,11:1)
4. **Disabled:** `bg-[#EDE4DC] text-choco-600 border-2 border-choco-900/25` — **6,28:1** (`.tactile-btn`) / `#E9DCD4` + `choco-600` = **5,87:1** (`.btn-gummy`). Keduanya lulus.
   - Komponen kanonik: **`TactileButton`** (`src/components/ui/tactile-button.tsx`, 12 call-site — paling banyak dipakai), `DuoButton`, dan `ui/button.tsx`.

---

## 3. Tipografi & Hierarki

Maksimal **2 keluarga font** yang dimuat melalui root stylesheet (dijaga `src/lib/font-budget.test.ts`):
1. **Space Grotesk (`font-display`):** splash display text, hero brand, dan seluruh Judul Kartu (H1, H2, H3), label badge, pill navigation, serta tombol game.
2. **Inter (`font-sans`):** seluruh paragraf, teks body, catatan, dan input form.
3. **`font-pixel` = ALIAS** ke `var(--font-display)`. Dipakai 415× di 43 berkas — **jangan "dibersihkan"**, diff-nya besar tanpa manfaat. Mode Retro Pixel sudah dihapus (Langkah 7c), jadi alias ini tidak lagi memuat font pixel.
4. **`font-mono`:** system stack (angka saldo/skor, seed hash, kode) — tanpa download font.

> **Jangan tambah keluarga ke-3.** Guard `font-budget.test.ts` mengunci **jumlah (≤2) + identitas** nama keluarga. `Bricolage Grotesque`, `Plus Jakarta Sans`, `Pixelify Sans`, `JetBrains Mono`, `Silkscreen`, `Press Start 2P`, dan `Nunito` ada di daftar mati — muncul kembali = suite gagal.

---

## 4. Pola Navigasi Sub-Dock (Pill Dock Pattern)

Semua sub-halaman yang berpasangan (seperti Klasemen & Undian, atau Toko & Ruang Ganti) **wajib** menggunakan pola dock pill terpusat:
```tsx
<div className="flex items-center gap-2 rounded-2xl border-2 border-choco-900/20 bg-gradient-to-b from-white via-[#FFF9F5] to-[#FDEEE4] p-1.5 shadow-[0_4px_0_#3B2218,0_10px_20px_-4px_rgba(59,34,24,0.12)] max-w-md mx-auto">
  {/* Tab 1 */}
  <Link ... className="flex-1 ... rounded-xl ...">...</Link>
  {/* Tab 2 */}
  <Link ... className="flex-1 ... rounded-xl ...">...</Link>
</div>
```

---

## 5. Invarian Aksesibilitas & Responsivitas

> **Dijaga `src/lib/a11y-invariants.test.ts` (9 test, Langkah 23 + 26).** Guard ini mengunci yang **sudah benar** supaya tidak ada regresi: viewport `viewport-fit=cover`, `safe-area-inset-bottom` di navbar bawah, `motion-reduce:transition-none` di komponen taktil baru, `focus-visible:outline` yang tidak boleh dihapus dari 4 komponen kunci, `outline-none` wajib punya pengganti fokus, penanda `aria-pressed`/`aria-current` pada 7 dock, aturan focus-visible global, `prefers-reduced-motion` global, dan elemen non-native yang bisa diklik wajib terjangkau keyboard.
>
> **⚠️ Pelajaran mahal (Langkah 26): hitung EFEK, bukan kelas.** Sempat tercatat sebagai "utang" bahwa 42 berkas punya elemen tanpa `focus-visible` dan 53 berkas tanpa `motion-reduce`. **Keduanya SALAH.** Angka itu dihitung dari kemunculan KELAS Tailwind, padahal `styles.css` sudah punya dua aturan GLOBAL yang menutup semuanya:
>
> ```css
> button:focus-visible, a:focus-visible, input:focus-visible,
> [role="button"]:focus-visible, [role="tab"]:focus-visible,
> select:focus-visible, textarea:focus-visible {
>   outline: 3px solid var(--color-primary, #E8437F) !important;
> }
> @media (prefers-reduced-motion: reduce) { *, *::before, *::after { animation-duration: .01ms !important; … } }
> ```
>
> Diverifikasi dengan Tab nyata di browser: **39/40 elemen dapat outline 3px pink**. Yang benar-benar kurang hanya 3 kontrol `div` ber-`onClick` (kolom chart progres, gambar NFT di undian, tautan wallet) — sudah ditambahkan `role="button"` + `tabIndex={0}` + `onKeyDown` Enter/Space. Guard-nya juga diperketat: **`tabIndex` DAN `onKeyDown` dua-duanya wajib** (satu saja tidak cukup — bisa difokus tapi tak bisa diaktifkan, atau sebaliknya).

### 5.1 Hydration: portal wajib menunggu `mounted`

> **Dijaga `src/lib/a11y-invariants.test.ts` test ke-10 (Langkah 28).** Komponen yang memakai `createPortal` **wajib** menunggu penanda `mounted` sebelum merender portal:
>
> ```tsx
> const [mounted, setMounted] = useState(false);
> useEffect(() => setMounted(true), []);
> if (!mounted || !open) return null;   // render pertama klien = server
> ```
>
> **Kenapa:** pola `if (!open || typeof document === "undefined") return null` **tidak cukup**. Saat SSR `document` tidak ada → `null`; di klien render pertama `document` ADA → langsung `createPortal(...)`. React melihat pohon berbeda dan melempar **#418** di setiap kunjungan. Itu akar bug beranda yang lama tercatat salah alamat (dulu disebut `blobi-guide.tsx`, padahal `coach.tsx`).
>
> Dua pola sah di repo: (a) guard `if (!mounted || …) return null` sebelum `return createPortal(...)` — `coach.tsx`, `dialog.tsx`, `side-nav.tsx`; (b) ternary `… && mounted && … ? createPortal(...) : markup` — `bubble-menu.tsx`. Guard memeriksa keduanya.
>
> **Catatan:** `dialog.tsx` aman hanya KEBETULAN (`open` selalu false di render pertama). Pola itu rapuh — begitu ada dialog `open=true` saat render awal, #418 kembali. Karena itu `mounted` dipasang di sana juga.
>
> **Pelajaran metode:** `MutationObserver` **tidak** menangkap mismatch ini (React tidak mem-patch atribut yang berbeda — pesannya sendiri berbunyi "won't be patched up"), dan `build:dev` tetap memakai React production sehingga pesan tetap minified. Yang berhasil: **isolasi per-rute** (hanya `/` yang kena) lalu **bandingkan HTML server vs DOM klien per-elemen**.


- **Tap Target:** Setiap tombol interaktif memiliki tinggi minimal 44px (`min-h-[44px]` atau `py-2.5 px-4`).
- **Kontras Teks:** Seluruh label teks putih di atas tombol pink wajib menggunakan ramp `candy-800` (`#85174A` / `#B01F62`) dengan rasio kontras `>= 4.5:1` (lulus uji `contrast-budget.test.ts`).
- **Mobile Safe Area:** Seluruh fixed container mematuhi `env(safe-area-inset-top)` dan `env(safe-area-inset-bottom)`.

---

## 6. Kontrak Chip / Badge Status (WAJIB SERAGAM)

Acuan visual: dua chip di `/profile` — `Level 2` (keluarga netral) dan `Murid Blobi` (keluarga pink). **Semua chip status, label level, penanda kategori, dan badge kecil di seluruh aplikasi wajib mengikuti resep ini.** Divergensi terukur saat kontrak ini ditetapkan: 62 titik di 18 berkas (51 radius bukan pill, 12 border transparan, 17 tanpa hard slab).

> **Komponen kanonik tersedia sejak Langkah 22: `src/components/ui/chip.tsx`.** Pakai `<Chip tone="…">`, jangan tulis resepnya manual — 31 chip di 20+ berkas masih manual dan itu sumber drift (sebagian memakai palet bawaan Tailwind `emerald-*`/`amber-*`/`rose-*`, satu memakai hex mentah `#0E7A46` yang **tidak ada di `@theme`**).
>
> ```tsx
> import { Chip } from "@/components/ui/chip";
> <Chip tone="neutral">Level 2</Chip>
> ```
>
> Enam tone: `neutral` · `rose` · `gold` · `mint` · `warning` · `danger`. Resep `neutral` & `rose` **disalin persis** dari chip acuan `/profile` (nol perubahan visual); `gold`/`mint`/`warning` memakai token `@theme` yang sudah ada (`lemon`, `ok-*`, `warn-*`) supaya tidak menambah palet Tailwind asing. Dijaga 2 test tambahan di `chip-contract.test.ts`: empat aturan keras + **border & slab wajib sekeluarga** (bukan hex identik — chip acuan sendiri memakai `border-candy-600` + slab `#B01F62`, keduanya keluarga pink).

### 6.1 Resep tunggal
```tsx
<span className="
  inline-flex items-center gap-1.5 select-none whitespace-nowrap
  rounded-full                      /* A. bentuk stadium, radius = 1/2 tinggi */
  border-2 border-<family>          /* B. border SOLID, saturasi penuh */
  px-2.5 py-0.5 text-xs font-bold font-pixel
  shadow-[0_2px_0_<slab>]           /* C. slab keras, blur NOL */
">
```

### 6.2 Empat aturan keras
| # | Aturan | Dilarang | Alasan |
|---|---|---|---|
| **A** | Bentuk **stadium penuh** → `rounded-full` | `rounded-[8px]`…`rounded-[18px]`, `rounded-lg/xl/2xl` pada chip | Sudut kotak memecah bahasa visual; acuan memakai pill murni |
| **B** | Border **solid** sefamili dengan isi → `border-candy-600`, `border-choco-900`, `border-emerald-700` | `border-choco-900/18`, `border-candy-500/40`, `border-*/20` pada chip | Border transparan membuat chip tampak "belum selesai"/redup, bukan taktil |
| **C** | Wajib punya **hard slab shadow**, blur nol → `shadow-[0_2px_0_<slab>]` | `shadow-none`, `shadow-sm`, shadow ber-blur | Ekstrusi 3D adalah inti gaya *Tactile Arcade* |
| **D** | Teks **tebal** dan **gelap di atas isi terang** (atau putih hanya di atas ramp gelap teruji) | teks tipis, teks putih di atas pink terang | Keterbacaan + bobot chip sekelas token |

### 6.3 Matriks keluarga warna chip
| Keluarga | Isi | Border (solid) | Slab | Contoh pemakaian |
|---|---|---|---|---|
| **Netral / Level** | `from-white to-[#FBE9DC]` | `border-choco-900` | `#3B2218` | `Level 2`, chip hitungan blok |
| **Rose / Identitas** | `from-[#FFF0F5] to-[#FDC8D8]` | `border-candy-600` | `#B01F62` | `Murid Blobi`, penanda undian |
| **Gold / Prestasi** | `from-[#FFFBEB] to-[#FDE68A]` | `border-choco-900` | `#C8940C` | peringkat, hadiah liga |
| **Mint / Lulus** | `from-[#F0FDF4] to-[#BBF7D0]` | `border-emerald-700` | `#15803D` | status selesai, aman on-chain |
| **Amber / Peringatan** | `from-[#FFF8E1] to-[#FFE08A]` | `border-amber-600` | `#B27B00` | menunggu verifikasi |
| **Rose gelap / Bahaya** | `bg-candy-800` | `border-choco-900` | `#3B2218` | teks putih, aksi destruktif |

### 6.4 Kapan BUKAN chip
Kontrak ini **tidak** berlaku untuk: input form, kartu konten, tombol aksi penuh, atau pill dock navigasi (yang punya spec sendiri di §4). Yang diikat adalah elemen kecil penanda status: tinggi ≤ ~28px, teks ≤ `text-xs`.

### 6.5 Guard
`src/lib/chip-contract.test.ts` wajib gagal kalau ada chip (`border-2` + teks kecil) memakai border transparan atau radius bukan-pill di `src/**/*.tsx`.

---

## 7. Do & Don't

Aturan cepat sebelum menulis komponen baru. Angka di kolom kanan = **hasil ukur di kode nyata**, bukan teori — dihitung dengan `grep` saat bagian ini ditulis.

| ✅ Lakukan | ❌ Hindari | Bukti |
|---|---|---|
| Outline `choco-900` yang hangat (`#3B2218`) | Hitam pekat `#000` | `border-choco-900` **674×** · `#000` murni **3×** — ketiganya **pelanggaran nyata** (lihat catatan di bawah) |
| Slab keras `0 Npx 0` tanpa blur | Blur / spread / shadow ambient | `shadow-[0_Npx_0_#3B2218]` **475×** · `shadow-{sm,md,lg,xl}` **4×** |
| Token nyata (`bg-cream-50`, `shadow-ink-sm`) | Hex mentah di komponen | **43 pemakaian** `bg-[#…]` mentah — 9 di antaranya `telemetry-badge.tsx` |
| Komponen kanonik (`<Chip tone="…">`, `<SegmentedNav>`) | Chip / nav buatan tangan | Dijaga `chip-contract.test.ts` (6 test) + `a11y-invariants.test.ts` (10 test) |
| `danger`/`err-ink` untuk aksi destruktif | Candy (pink brand) untuk tombol hapus | `danger`/`err-ink` **30×** · dijaga `feedback-colors.test.ts` |
| Istilah ramah ("Koin", "Hari Beruntun") | Jargon Web3 tanpa penjelasan | "Koin" **18 berkas** · "Hari Beruntun" **1 berkas** (istilah lain masih "Streak") |
| `font-pixel` hanya untuk label pendek (≤`text-xs`) | `font-pixel` untuk paragraf | **92** pemakaian `font-pixel` + `text-1xpx` — mayoritas label, aman |
| Satu keluarga warna per elemen | Mencampur `emerald-*` dengan `mint-*` | `emerald-*` **±70×** · `mint-*` custom **±25×** — dua keluarga berbeda untuk arti "benar" |

### 7.1 Tiga pelanggaran nyata yang ditemukan saat menulis bagian ini

Ini **bukan** teori dari draft — ketiganya ada di kode produksi sekarang:

1. **Slab hitam murni `#000` (3×)** — melanggar aturan pertama tabel di atas:
   - `src/components/bubble-menu.tsx:357` & `:419` — `shadow-[0_2px_0_#000]`
   - `src/routes/kisah.index.tsx:169` — `shadow-[0_2px_0_#000]`
   Ganti ke `#3B2218` (choco-900) agar konsisten dengan 475 pemakaian lain.

2. **43 hex mentah `bg-[#…]`** — melanggar "pakai token". Terbanyak: `telemetry-badge.tsx` (9), `lozenge.tsx` (5), `profile.tsx` (4), `status-banner.tsx` (4), `section-message.tsx` (4). Sebagian mungkin memang perlu (gradien multi-stop tidak bisa jadi token), tapi harus diaudit satu per satu.

3. **`choco-900/18` (3×)** — melanggar aturan "divider pakai `/20`". Sisa dari v1.0 yang lolos sinkronisasi.

**Status:** 2 dari 3 sudah **DIPERBAIKI** (`#000` 3× → `choco-900`; `/18` 3× → `/20`) dan **dikunci guard** `design-rules.test.ts`. Sisanya — **43 hex mentah** — masih utang: sebagian sah (gradien multi-stop tidak bisa jadi satu token), jadi butuh audit satu per satu, bukan penggantian massal.

### 7.2 Guard yang mengunci tabel ini

| Aturan | Guard |
|---|---|
| Chip seragam | `chip-contract.test.ts` |
| Warna feedback benar | `feedback-colors.test.ts` |
| Kontras ≥4,5:1 (teks) / ≥3:1 (ikon) | `contrast-budget.test.ts` |
| Token Tamagui ↔ `@theme` sinkron | `tamagui-tokens.test.ts` · `token-scale.test.ts` |
| Peta alias warna | `color-alias.test.ts` |
| A11y (fokus, tap target, dock, portal) | `a11y-invariants.test.ts` |
| Font maksimal 2 keluarga | `font-budget.test.ts` |
| Target coach punya penulis | `coach-targets.test.ts` |
| `#000` dilarang · divider `/20` · baris §7 wajib berangka | `design-rules.test.ts` |

Sisanya yang **masih** tidak dijaga otomatis: aturan "hex mentah dilarang" (`bg-[#…]` 43×). Dua lainnya (`#000`, `/18`) **sudah dikunci** `design-rules.test.ts` setelah §7.1 membuktikan bahwa **guard yang tidak ada = aturan yang dilanggar diam-diam.**

---

## 9. PATOKAN RESMI — Kartu Profil & Kartu Statistik `/profile`

**Status: ACUAN TETAP.** Bagian ini bukan usulan. User menunjuk bagian `/profile` ini
secara eksplisit ("ini jadikan patokan design mulai sekarang"). Semua komponen baru
yang menampilkan **kartu ringkasan / kartu statistik / kartu identitas** wajib mengikuti
anatomi di bawah. Angka diambil dari `getComputedStyle` di browser 390px, bukan tafsiran.

> **Cakupan:** HANYA elemen yang terlihat di tangkapan layar user — kartu profil
> (avatar + identitas + chip + tombol), kartu bio, dan baris 4 kartu statistik.
> Bagian `/profile` yang lain (Keahlian, Analitik, Pengaturan) **bukan** bagian patokan.

### 9.1 Anatomi kartu statistik (pola inti — paling sering dipakai ulang)

| Ciri | Nilai terukur |
|---|---|
| radius | `rounded-3xl` = **24px** |
| border | **2px solid** warna keluarga (bukan abu, bukan transparan) |
| latar | gradien vertikal **3 stop** — terang → sedang → tua |
| shadow | **hard slab** `0 4px 0 <warna-tua-keluarga>` (tanpa blur) |
| padding | **16px** |
| tinggi | **177px** — dipaksa rata via `auto-rows-fr` pada grid |
| grid | 2 kolom (mobile) / 4 kolom (`lg`), **gap 16px**, `max-w-3xl` |

**Hierarki teks di dalam kartu (3 lapis, jangan diubah):**

| Lapis | Font | Ukuran | Berat | Ciri |
|---|---|---|---|---|
| Label | **Space Grotesk** | 12px | 700 | `uppercase`, `tracking-wider` |
| Nilai | **Space Grotesk** | **30px** | 700 | `tabular-nums` (angka tidak goyang) |
| Sub | **Inter** | 12px | 600 | kalimat biasa |

**Empat keluarga warna kartu (satu keluarga per kartu):**

| Kartu | Border | Gradien | Slab | Teks label/sub | Teks nilai |
|---|---|---|---|---|---|
| Total XP | `leaf-shadow` | `leaf-soft → leaf-fill → leaf-fill-deep` | `#0F6045` | `leaf-shadow` | `leaf-deep-ink` |
| Streak | `#EA580C` | `#FFF7ED → #FFEDD5 → #FED7AA` | `#C2410C` | `#9A3412` | `#9A3412` |
| Koin | `lemon-deep` | `coin-fill → coin-fill → coin-fill-deep` | `#D9A400` | `warn-ink` | `coin-ink-deep` |
| Modul | `candy-600` | `blush-50 → blush-100 → blush-200` | `#B01F62` | `candy-800` | `candy-950` |

Kontras ke-12 teks sudah diukur terhadap **stop gradien TERGELAP** (titik terburuk,
bukan titik terang): **4,61–10,20:1** — semua lolos AA.

### 9.2 Anatomi kartu profil & isinya

| Elemen | Ciri terukur |
|---|---|
| Kartu pembungkus | radius **24px**, border **2px `choco-900/20`**, gradien `white → #FFF9F5 → #FDEEE4` |
| Avatar tile | `rounded-2xl` (16px), border **2px `candy-600`**, gradien `candy-50 → candy-100 → candy-200`, slab `0 3px 0 #B01F62` |
| Chip Level | **pill**, border **2px `choco-900` solid**, gradien `white → #FBE9DC`, slab `0 2px 0 #3B2218`, teks 12px/700 |
| Chip Murid Blobi | **pill**, border **2px `candy-600`**, gradien `#FFF0F5 → #FDC8D8`, slab `0 2px 0 #B01F62` |
| Tombol "Ganti Blobi" | radius **28px**, border **2px `choco-900/20`**, gradien krem, slab `0 3px 0 #3B2218`, 12px/800 |
| Kartu bio | radius **18px**, border **2px `choco-900` SOLID**, `bg-cream`, slab **`2px 2px 0 #3B2218`** (offset, bukan vertikal), teks *italic* |
| Tombol "Ubah" | radius **12px**, `bg-white`, border **2px `choco-900`**, slab `0 2px 0 #3B2218` |

### 9.3 Tujuh aturan yang membuat patokan ini terasa "padat" (chunky)

1. **Selalu ada border 2px.** Tidak ada kartu tanpa garis tepi — kecuali chip di atas foto/artwork (§6.4).
2. **Selalu ada hard slab.** `0 Npx 0 warna-tua` — **N = 2** untuk kontrol kecil, **3** untuk tombol/avatar, **4** untuk kartu statistik, **5** untuk elemen besar. Nol blur.
3. **Gradien vertikal 3 stop**, bukan warna rata. Stop akhir selalu versi tergelap (tempat kontras diukur).
4. **Radius ikut ukuran elemen:** 12 (tombol kecil) → 18 (kartu bio) → 24 (kartu besar) → pill (chip).
5. **Angka selalu `tabular-nums`** supaya tidak bergeser saat nilainya berubah.
6. **Label selalu uppercase Space Grotesk 700;** kalimat penjelas selalu Inter 600. Dua font, tidak lebih (§ Typography).
7. **Tinggi kartu dalam satu baris wajib rata** (`auto-rows-fr`). Grid yang timpang = pelanggaran, bukan selera.

### 9.4 Batas yang harus tetap lulus

- Kontras teks **≥ 4,5:1** diukur di stop gradien tergelap.
- Nol overflow horizontal di 360px & 430px.
- **Diketahui menyimpang (utang, jangan ditiru):** tombol "Ganti Blobi" & "Ubah" tingginya
  **36px**, di bawah 44px yang diwajibkan `AGENTS.md`. Chip (24px) dikecualikan karena
  label, bukan kontrol. Kalau tombol ini disentuh, naikkan ke 44px — jangan tiru 36px-nya.

### 9.5 Guard

Pola ini dikunci `src/lib/design-rules.test.ts` (test "kartu statistik /profile tetap
mengikuti patokan §9") dan `src/lib/chip-contract.test.ts` (test chip acuan). Mengubah
anatomi kartu statistik tanpa memperbarui §9 akan membuat suite gagal.

## 10. Changelog

### v1.1 — sinkronisasi draft "Tactile Arcade"

Ringkasan: draft v1.1 dikirim sebagai usulan, lalu **diverifikasi baris per baris** terhadap `@theme` nyata. Yang cocok diadopsi; yang bertentangan **kode yang menang** (lihat `DESIGN-SYSTEM.md` §8). Kemiripan dokumen dengan draft: **13%** — jadi ini bukan salinan, tapi hasil audit.

| Bagian | Masalah di v1.0 | Perbaikan | Status |
|---|---|---|---|
| Judul | "Tactile **Spatial** Arcade" vs "Tactile Arcade" | Seragam: **Tactile Arcade** | ✅ diadopsi |
| §1 | Markdown bold rusak; "Emosi" tidak bold | Diperbaiki + 5 Hukum Visual | ✅ diadopsi |
| Canvas | Hex `#FFF6EE` tapi class `bg-[#FDFBF7]` (beda warna) | Satu token: `cream-50` = `#FFF6EE` | ✅ diadopsi |
| Teks sekunder | Dua opsi ambigu (`choco-700` / `choco-600`) | **`choco-600`** = sekunder, **`choco-700`** = utama | ✅ diadopsi (draft benar, dokumen lama salah) |
| Line subdued | `/18` vs `/20` | Seragam **`/20`** | ⚠️ 3 sisa `/18` (§7.1) |
| Mint | `emerald-700` tidak cocok slab `#15803D` | Keluarga `mint-*` custom | ⚠️ `emerald-*` masih ±70× |
| Pill Dock | Dinamai "Glass" padahal glassmorphism dilarang | Nama "Pill Dock", blur dihapus, `aria-current` | ✅ diadopsi (`bb3e4e0`, `2fd1f88`) |
| Tombol | `active:translate-y-1` (4px) + slab 1px = tenggelam 1px | Rumus slab diam (§3.2) | ✅ diadopsi |
| Tombol Gold | Border choco tapi slab `#C8940C` | Slab `choco-900` | ❌ **tidak diadopsi** — `#C8940C` masih dipakai (`button.tsx:90`, `shop.tsx` ×2, `leaderboard.tsx:200`). Sengaja: slab emas adalah penanda PETI/koin |
| Bahaya | Warna sama dengan CTA → rawan salah klik | Keluarga `danger-*` terpisah | ✅ diadopsi |
| Peringatan vs Gold | Gradien hampir identik | Warning pindah ke oranye (`warn-*`) | ✅ diadopsi |
| Kontras | `candy-800` diberi dua hex | Satu hex per token | ✅ diadopsi |
| Chip | Resep tanpa `bg-gradient-to-b`; `select-none` menghalangi salin | Komponen `<Chip>` berbasis `cva` | ✅ diadopsi (`fe6711a`) |
| Chip interaktif | Tinggi ~24px < 44px tap target | Perluasan hit area (§6.4) | ✅ diadopsi |
| Baseline | 51 + 12 + 17 = 80 ≠ 62 | Dijelaskan: kategori tumpang tindih | ✅ diadopsi |
| Guard | Regex rawan false positive | Guard berbasis komponen | ✅ diadopsi — **8 guard** sekarang |
| A11y | Tidak ada focus state, reduced motion, `viewport-fit` | Ditambahkan di §5 & §3 | ✅ diadopsi (`b9f063d`) |
| Tap target | `py-2.5 px-4` tidak menjamin 44px | Wajib `min-h-11` | ✅ diadopsi (**13×** di kode) |

### v1.3 — PATOKAN RESMI ditetapkan user (`/profile`)

User menunjuk bagian `/profile` (kartu profil + baris 4 kartu statistik) dan berkata
*"ini jadikan patokan design mulai sekarang"*, dengan penegasan cakupan:
*"hanya yang saya kirim gambarnya engga semua"*. Ditulis sebagai **§9**, bukan
usulan — anatomi diukur dari `getComputedStyle` di browser 390px.

| Yang ditetapkan | Angka terukur |
|---|---|
| Radius kartu besar | 24px (`rounded-3xl`) |
| Border | 2px **solid** warna keluarga (bukan abu, bukan transparan) |
| Latar | gradien vertikal **3 stop** (terang → sedang → tua) |
| Shadow | **hard slab** `0 4px 0` warna tua keluarga — **nol blur** |
| Padding | 16px (`p-4`) |
| Tinggi | **rata** via `auto-rows-fr` (177px), bukan mengikuti konten |
| Label | Space Grotesk **12px/700** uppercase, `tracking-wider` |
| Nilai | Space Grotesk **30px/700** `tabular-nums` |
| Sub | Inter **12px/600** |
| Grid | 2 kolom mobile / 4 kolom `lg`, gap 16px, `max-w-3xl` |

**Empat keluarga warna kartu** (satu keluarga per kartu): `leaf-*` (XP) ·
oranye `#FFF7ED→#FFEDD5→#FED7AA` (streak) · `lemon-*`/`coin-*` (koin) ·
`blush-*` (modul). Kontras 12 teks: **4,61–10,20:1**, diukur di **stop tergelap**.

**Guard baru** di `design-rules.test.ts`: mengunci `auto-rows-fr`, ≥3 kartu beranatomi
lengkap (rounded-3xl + border-2 + gradien 3 stop + slab `0_4px_0` + `p-4`), label
uppercase, nilai `text-3xl … tabular-nums`, sub `text-xs font-semibold`, dan §9 sendiri
wajib memuat angka patokan. **4 skenario pelanggaran dibuktikan tertangkap**: hapus
`auto-rows-fr` · slab `4px→1px` · nilai `30px→24px` · label uppercase dihapus.

**Utang yang jangan ditiru:** tombol "Ganti Blobi" & "Ubah" tingginya **36px** — di bawah
44px yang diwajibkan `AGENTS.md`. Chip (24px) dikecualikan karena label, bukan kontrol.
Kalau tombol itu disentuh, naikkan ke 44px.

### v1.4 — SELURUH HALAMAN DISAMAKAN KE PATOKAN §9

User: *"buru saya mau semuanya designya seperti ini"* + *"liat warna mint oren gold dan pink itu sangat indah"*.
**172 pemakaian palet bawaan Tailwind di 21 berkas → 0.**

| Palet asing | Diganti ke | Keluarga |
|---|---|---|
| `emerald-*` | `leaf-*` / `ok-*` / `mint` | hijau sukses (mint) |
| `amber-*` | `coin-*` / `lemon-*` / `warn-ink` | gold (koin, PETI, peringatan) |
| `orange-*` | `flame-*` / `streak` | oranye beruntun |
| `rose-*` | `candy-*` / `ruby-*` / `err-*` | pink / error |

**10 token `flame-*` baru** (`flame-soft/fill/fill-deep/line/slab/ink/ink-deep/hot/fill-top/line-hot`)
untuk keluarga oranye — hex-nya **sama persis** dengan yang sudah dipakai produksi, jadi nol perubahan warna.

**Guard naik dari ratchet → aturan HARD.** Selama migrasi, `design-rules.test.ts` memakai pola
ratchet (22 berkas dibekukan jumlahnya) supaya bisa maju bertahap. Begitu semua berkas mencapai 0,
aturannya diperketat jadi **nol toleransi**: satu pemakaian `emerald-*` baru = suite gagal.

**Pengecualian SADAR** (bukan lupa): `admin*` (tabel data netral) dan **`pulau-rantai.ts`**.
Yang terakhir penting: 21 warnanya adalah **warna DUNIA** (hijau hutan, ungu gunung, biru laut, batu abu),
bukan warna UI. Kalau dipaksa jadi 4 keluarga patokan, peta kehilangan keragaman visual dan tiap pulau
tak bisa dibedakan. Tujuh warna kebetulan sama persis dengan palet bawaan Tailwind — itu kebetulan.
Keputusan user: *"biarkan — warna dunia berbeda dari warna UI"*. Alasannya ditulis di komentar berkas.

**Verifikasi**: warna diukur dari DOM 12 rute (resolve `oklab` lewat canvas — regex `rgb()` akan
melewatkannya). 0 pageerror; keluarga web3min terdeteksi di produksi: leaf 7 varian, coin 6, flame 4, candy 7.

### v1.2 — temuan audit dokumen ini

| Temuan | Status |
|---|---|
| Hydration #418 di beranda (portal tidak menunggu `mounted`) | ✅ `d6bb944` |
| Tur coach berjalan tanpa spotlight (3 target tidak punya penulis) | ✅ `eadd983` |
| Kontras badge blok terkunci 4,01:1 (gagal AA) | ✅ `f7d5895` |
| 3 kontrol non-native tidak terjangkau keyboard | ✅ `b9f063d` |
| Utang lama "42 berkas tanpa focus-visible" | ❌ **PALSU** — aturan global ada, terukur 39/40 elemen dapat outline |
| Utang lama "akar hydration di `blobi-guide.tsx:292`" | ❌ **SALAH ALAMAT** — akarnya `coach.tsx:173` |
| Utang lama "`choco-500` di `bg-cream/70` = 4,29" | ❌ **SALAH LATAR** — sebenarnya 4,84 (yang gagal: `bg-candy-100`) |

**Pola yang berulang:** tiga catatan utang lama ternyata **salah**. Penyebabnya sama — dihitung dari kemunculan kelas Tailwind / dibaca dari dokumen, bukan diukur dari efek nyata. Aturannya sekarang: **ukur dulu, baru tulis** (§5, §6.5).
