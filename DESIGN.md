# DESIGN.md — Web3min "Tactile Arcade" Design System

> **Single Source of Truth** untuk seluruh antarmuka Web3min.
> Acuan visual: `https://web3min.com/leaderboard` (kartu, tombol, dock) dan `/profile` (chip).
> Versi 1.1. Lihat §9 untuk daftar perubahan.

---

## 1. Filosofi & Karakter Desain

- **Gaya:** Gamified UI / Soft Neo-Brutalism.
- **Karakter:** Garis outline tebal ala komik, *hard offset shadow* 3D tanpa blur, palet pastel dengan gradien lembut, dan sudut membulat yang ramah (squircle / organic rounded).
- **Emosi:** Menyenangkan dan tidak mengintimidasi seperti banyak produk Web3 yang dingin dan kaku. Rasanya seperti main game arcade saku.

### 1.1 Lima Hukum Visual (berlaku untuk semua komponen)

| # | Hukum | Artinya |
|---|---|---|
| 1 | **Outline solid** | Elemen taktil selalu `border-2` dengan warna solid. Border transparan hanya untuk divider. |
| 2 | **Slab tanpa blur** | Bayangan hanya berbentuk `0 Npx 0 <warna>`. Blur, spread, dan shadow ambient dilarang. |
| 3 | **Slab sefamili** | Warna slab = warna border elemen itu sendiri. |
| 4 | **Dasar slab diam** | Saat hover/press, jarak geser + tinggi slab selalu konstan, jadi elemen terlihat benar-benar "ditekan". |
| 5 | **Hangat, bukan dingin** | Dilarang: `#000`, abu-abu netral, neon, glassmorphism, `backdrop-blur`. |

---

## 2. Master Design Tokens

### 2.1 Konfigurasi Token (Tailwind v4 `@theme`)

Semua komponen **wajib** memakai token di bawah. Hex mentah (`bg-[#...]`) di komponen dilarang.

```css
/* src/styles/globals.css */
@import "tailwindcss";

@theme {
  /* Cream: canvas & surface */
  --color-cream-50:  #FFF6EE;  /* canvas halaman */
  --color-cream-100: #FFF9F5;
  --color-cream-200: #FDEEE4;
  --color-cream-300: #FBE9DC;

  /* Choco: outline & teks */
  --color-choco-700: #6B4A3A;  /* teks sekunder */
  --color-choco-900: #3B2218;  /* outline, slab, teks utama */

  /* Candy: pink identitas & CTA */
  --color-candy-50:  #FFF0F5;
  --color-candy-100: #FFE4EC;
  --color-candy-200: #FDC8D8;
  --color-candy-500: #D62A78;
  --color-candy-600: #B01F62;
  --color-candy-800: #85174A;

  /* Gold: prestasi & koin */
  --color-gold-50:  #FFFBEB;
  --color-gold-100: #FEF3C7;
  --color-gold-200: #FDE68A;
  --color-gold-300: #FFE873;
  --color-gold-400: #FFD84D;
  --color-gold-500: #E6BF35;
  --color-gold-700: #C8940C;   /* khusus ikon/ilustrasi koin */

  /* Mint: on-chain, lulus, aman */
  --color-mint-50:  #F0FDF4;
  --color-mint-100: #DCFCE7;
  --color-mint-200: #BBF7D0;
  --color-mint-700: #15803D;
  --color-mint-900: #14532D;

  /* Warn: peringatan / menunggu */
  --color-warn-50:  #FFF3E6;
  --color-warn-200: #FFD2AC;
  --color-warn-700: #C2410C;

  /* Danger: aksi destruktif */
  --color-danger-500: #DC2626;
  --color-danger-700: #B91C1C;

  /* Font */
  --font-display: "Bricolage Grotesque", ui-sans-serif, system-ui, sans-serif;
  --font-pixel:   "Pixelify Sans", ui-monospace, monospace;
  --font-sans:    "Plus Jakarta Sans", ui-sans-serif, system-ui, sans-serif;

  /* Hard slab: warna diganti lewat utilitas shadow-{warna} */
  --shadow-slab-press: 0 1px 0 #3B2218;
  --shadow-slab-xs:    0 2px 0 #3B2218;
  --shadow-slab-sm:    0 3px 0 #3B2218;
  --shadow-slab-md:    0 4px 0 #3B2218;
  --shadow-slab-lg:    0 6px 0 #3B2218;
}
```

> **Tailwind v3:** masukkan nilai yang sama ke `theme.extend.colors`, `fontFamily`, dan `boxShadow` di `tailwind.config.ts`. Cara pakai class-nya identik.
> **Pemakaian slab:** `shadow-slab-md shadow-candy-600` → `0 4px 0 #B01F62`.

### 2.2 Token Semantik (Surface & Teks)

| Peran | Class | Keterangan |
|---|---|---|
| Latar canvas | `bg-cream-50` | Latar semua halaman |
| Surface card | `bg-gradient-to-b from-white via-cream-100 to-cream-200` | Kartu putih berkedalaman |
| Outline | `border-choco-900` | Outline standar |
| Divider | `border-choco-900/20` | **Hanya** untuk garis pemisah, bukan outline elemen |
| Teks utama | `text-choco-900` | Heading, judul, angka |
| Teks sekunder | `text-choco-700` | Body & penjelasan (satu-satunya token sekunder) |

### 2.3 Kartu Tematik (Bento Cards)

| Tema | Isi | Border + Slab | Pemakaian |
|---|---|---|---|
| **Surface** | `from-white via-cream-100 to-cream-200` | `border-choco-900 shadow-slab-lg shadow-choco-900` | Kartu umum |
| **Gold / Prestasi** | `from-gold-50 via-gold-100 to-gold-200` | `border-choco-900 shadow-slab-lg shadow-choco-900` | Hero klasemen, bridge reward, peti koin |
| **Rose / Hadiah** | `from-candy-50 via-candy-100 to-candy-200` | `border-choco-900 shadow-slab-lg shadow-choco-900` | Hero undian, bridge raffle, toko Blobi |
| **Mint / On-Chain** | `from-mint-50 via-mint-100 to-mint-200` | `border-mint-700 shadow-slab-lg shadow-mint-700` | Bukti blockchain, safe-state, modul lulus |

Resep dasar kartu: `rounded-3xl border-2 bg-gradient-to-b p-5 md:p-6` + baris tema di atas.

### 2.4 Radius

| Elemen | Class | Nilai |
|---|---|---|
| Kartu | `rounded-3xl` | 24px |
| Tombol, dock | `rounded-2xl` | 16px |
| Input | `rounded-xl` | 12px |
| Tab di dalam dock | `rounded-[10px]` | 16px − padding 6px |
| Chip / badge | `rounded-full` | stadium |

**Aturan radius bersarang:** radius elemen di dalam = radius induk − padding induk.

### 2.5 Skala Slab

| Token | Offset | Dipakai untuk |
|---|---|---|
| `shadow-slab-press` | 1px | State `:active` |
| `shadow-slab-xs` | 2px | Chip, tab aktif |
| `shadow-slab-sm` | 3px | Tombol sekunder & gold |
| `shadow-slab-md` | 4px | Tombol primary, dock |
| `shadow-slab-lg` | 6px | Kartu |

---

## 3. Tombol Taktil 3D

### 3.1 Resep dasar (semua tombol)

```
inline-flex min-h-11 items-center justify-center gap-2
rounded-2xl border-2 px-4 font-pixel font-bold
transition-[transform,box-shadow] duration-100 ease-out
focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-candy-600
disabled:pointer-events-none disabled:opacity-60
motion-reduce:transition-none
```

### 3.2 Mekanik tekan (Hukum #4: dasar slab diam)

| Tinggi slab | Default | Hover | Active |
|---|---|---|---|
| **md (4px)** | `shadow-slab-md` | `hover:-translate-y-0.5 hover:shadow-slab-lg` | `active:translate-y-[3px] active:shadow-slab-press` |
| **sm (3px)** | `shadow-slab-sm` | `hover:-translate-y-px hover:shadow-slab-md` | `active:translate-y-0.5 active:shadow-slab-press` |

Rumusnya: `translate + tinggi slab = tinggi slab default`, jadi dasar bayangan tidak ikut bergerak.

### 3.3 Varian

| Varian | Isi | Border + Slab | Teks | Mekanik |
|---|---|---|---|---|
| **Primary Candy** | `bg-gradient-to-b from-candy-500 via-candy-600 to-candy-800` | `border-choco-900 shadow-choco-900` | `text-white` | md |
| **Gold Action** | `bg-gradient-to-b from-gold-300 via-gold-400 to-gold-500` | `border-choco-900 shadow-choco-900` | `text-choco-900` | sm |
| **Secondary** | `bg-white hover:bg-cream-50` | `border-choco-900 shadow-choco-900` | `text-choco-900` | sm |
| **Danger** | `bg-gradient-to-b from-danger-500 to-danger-700` | `border-choco-900 shadow-choco-900` | `text-white` | md |

**Aturan:** Aksi destruktif (hapus, batalkan, keluar) **wajib** memakai Danger, bukan Primary Candy, supaya pengguna tidak salah klik.

---

## 4. Tipografi & Hierarki

Maksimal **3 keluarga font**, dimuat di root layout dengan `font-display: swap` dan subset `latin`.

| Font | Class | Peran | Aturan |
|---|---|---|---|
| **Bricolage Grotesque** | `font-display` | Splash text, hero brand | Minimal 32px, weight 700–800 |
| **Pixelify Sans** | `font-pixel` | H1–H3, chip, tab dock, tombol | Minimal **12px**, maksimal ±8 kata per baris; jangan untuk paragraf; jangan italic (tidak ada varian italic asli) |
| **Plus Jakarta Sans** | `font-sans` | Paragraf, body, catatan, input | Body 15–16px weight 500; **input minimal 16px** agar iOS tidak auto-zoom |

### 4.1 Skala

| Level | Font | Ukuran | Weight |
|---|---|---|---|
| Hero | display | `text-4xl`–`text-5xl` | 800 |
| H1 | pixel | `text-2xl`–`text-3xl` | 700 |
| H2 | pixel | `text-xl` | 700 |
| H3 | pixel | `text-base`–`text-lg` | 700 |
| Body | sans | `text-base` | 500 |
| Small | sans | `text-sm` | 500 |
| Chip / label | pixel | `text-xs` | 700 |

---

## 5. Pola Navigasi Sub-Dock (Pill Dock)

Semua sub-halaman berpasangan (Klasemen ↔ Undian, Toko ↔ Ruang Ganti) **wajib** memakai dock ini:

```tsx
<nav
  aria-label="Sub-navigasi"
  className="mx-auto flex max-w-md items-center gap-1.5 rounded-2xl border-2 border-choco-900
             bg-gradient-to-b from-white via-cream-100 to-cream-200 p-1.5
             shadow-slab-md shadow-choco-900"
>
  {tabs.map((tab) => (
    <Link
      key={tab.href}
      href={tab.href}
      aria-current={pathname === tab.href ? "page" : undefined}
      className="flex min-h-11 flex-1 items-center justify-center gap-1.5 rounded-[10px]
                 border-2 border-transparent font-pixel text-sm font-bold text-choco-700
                 transition-colors hover:bg-cream-50
                 aria-[current=page]:border-choco-900 aria-[current=page]:bg-gradient-to-b
                 aria-[current=page]:from-candy-500 aria-[current=page]:to-candy-800
                 aria-[current=page]:text-white
                 aria-[current=page]:shadow-slab-xs aria-[current=page]:shadow-choco-900
                 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-candy-600"
    >
      {tab.icon}
      {tab.label}
    </Link>
  ))}
</nav>
```

Catatan: tab tidak aktif memakai `border-transparent` agar layout tidak bergeser saat berpindah tab. Ini **diizinkan** karena tab bukan chip (lihat §7.4).

---

## 6. Invarian Aksesibilitas & Responsivitas

**Tap target:** Semua elemen interaktif minimal 44px (`min-h-11`). Jangan mengandalkan padding saja.

**Kontras:** Teks ≥ 4.5:1 dan elemen non-teks (border, ikon) ≥ 3:1. Pada gradien, kontras **diukur terhadap stop paling terang**. Pasangan berikut diverifikasi oleh `contrast-budget.test.ts` (angka perkiraan; hasil test yang jadi acuan):

| Teks | Latar (stop terang) | Rasio ≈ |
|---|---|---|
| `white` | `candy-500` | 4.7:1 |
| `white` | `candy-600` | 6.5:1 |
| `white` | `danger-500` | 4.8:1 |
| `candy-800` | `candy-200` | 6.5:1 |
| `choco-700` | `cream-50` | 7.4:1 |

**Fokus:** Semua elemen interaktif wajib punya `focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-candy-600`. Menghapus outline tanpa pengganti dilarang.

**Motion:** Semua animasi wajib menghormati `motion-reduce:` (matikan transisi, goyangan, dan count-up).

**Warna bukan satu-satunya sinyal:** Status (lulus, peringatan, bahaya) selalu disertai teks atau ikon.

**Mobile safe area:** Wajib ada `<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">`. Fixed container memakai `pt-[max(1rem,env(safe-area-inset-top))]` dan `pb-[max(1rem,env(safe-area-inset-bottom))]`.

---

## 7. Kontrak Chip / Badge Status (WAJIB SERAGAM)

Acuan visual: dua chip di `/profile`, yaitu `Level 2` (netral) dan `Murid Blobi` (rose). Semua chip status, label level, penanda kategori, dan badge kecil **wajib** memakai komponen `<Chip>`.

**Baseline saat kontrak ditetapkan:** 62 titik menyimpang di 18 berkas, dengan total 80 pelanggaran (51 radius bukan pill, 12 border transparan, 17 tanpa hard slab). Satu titik bisa melanggar lebih dari satu aturan. **Target: 0.**

### 7.1 Komponen tunggal

```tsx
// src/components/ui/chip.tsx
import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";

const chip = cva(
  "inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border-2 " +
  "bg-gradient-to-b px-2.5 py-0.5 font-pixel text-xs font-bold shadow-slab-xs",
  {
    variants: {
      tone: {
        neutral: "from-white to-cream-300 border-choco-900 shadow-choco-900 text-choco-900",
        rose:    "from-candy-50 to-candy-200 border-candy-600 shadow-candy-600 text-candy-800",
        gold:    "from-gold-50 to-gold-200 border-choco-900 shadow-choco-900 text-choco-900",
        mint:    "from-mint-50 to-mint-200 border-mint-700 shadow-mint-700 text-mint-900",
        warning: "from-warn-50 to-warn-200 border-warn-700 shadow-warn-700 text-choco-900",
        danger:  "from-danger-500 to-danger-700 border-choco-900 shadow-choco-900 text-white",
      },
    },
    defaultVariants: { tone: "neutral" },
  }
);

export function Chip({
  tone, className, ...props
}: ComponentProps<"span"> & VariantProps<typeof chip>) {
  return <span className={chip({ tone, className })} {...props} />;
}
```

### 7.2 Empat aturan keras

| # | Aturan | Dilarang | Alasan |
|---|---|---|---|
| **A** | Bentuk stadium penuh: `rounded-full` | `rounded-[8px]`…`rounded-[18px]`, `rounded-lg/xl/2xl` | Sudut kotak memecah bahasa visual |
| **B** | Border solid sefamili: `border-candy-600`, `border-choco-900`, `border-mint-700`, `border-warn-700` | `border-*/20`, `border-*/40`, border transparan | Chip jadi terlihat redup dan tidak taktil |
| **C** | Hard slab `shadow-slab-xs`, dengan warna = warna border | `shadow-none`, `shadow-sm`, shadow ber-blur | Ekstrusi 3D adalah inti gaya Tactile Arcade |
| **D** | Teks tebal; gelap di atas isi terang, putih **hanya** di atas `danger` | Teks tipis, teks putih di atas pink terang | Keterbacaan |

### 7.3 Matriks keluarga warna

| Tone | Isi | Border = Slab | Teks | Contoh |
|---|---|---|---|---|
| `neutral` | `white → cream-300` | `choco-900` | `choco-900` | `Level 2`, hitungan blok |
| `rose` | `candy-50 → candy-200` | `candy-600` | `candy-800` | `Murid Blobi`, penanda undian |
| `gold` | `gold-50 → gold-200` | `choco-900` | `choco-900` | Peringkat, hadiah liga |
| `mint` | `mint-50 → mint-200` | `mint-700` | `mint-900` | Selesai, aman on-chain |
| `warning` | `warn-50 → warn-200` | `warn-700` | `choco-900` | Menunggu verifikasi |
| `danger` | `danger-500 → danger-700` | `choco-900` | `white` | Gagal, ditolak |

Gold dan warning sengaja dibuat beda hue (kuning vs oranye) supaya "prestasi" tidak tertukar dengan "peringatan".

### 7.4 Kapan BUKAN chip

Kontrak ini **tidak** berlaku untuk input form, kartu konten, tombol aksi penuh, dan tab Pill Dock (§5). Yang diikat hanya elemen penanda status kecil (tinggi ≤ ~28px, teks `text-xs`).

Chip bersifat **non-interaktif**. Kalau chip harus bisa diklik (misalnya filter), render sebagai `<button>` dan perluas area sentuhnya ke 44px dengan `relative after:absolute after:-inset-2.5 after:content-['']`.

### 7.5 Guard

`src/lib/chip-contract.test.ts` wajib gagal jika:
1. Ada `className` di `src/**/*.tsx` (selain `chip.tsx`) yang memuat `border-2` **dan** `text-xs` sekaligus, yaitu chip buatan tangan yang tidak memakai `<Chip>`.
2. `chip.tsx` memuat radius selain `rounded-full`, border ber-opacity (`/\d+`), atau tidak memuat `shadow-slab-xs`.
3. Ada varian tone yang warna `border-*` dan `shadow-*`-nya tidak sama.

---

## 8. Do & Don't

| ✅ Lakukan | ❌ Hindari |
|---|---|
| Outline `choco-900` yang hangat | Hitam pekat `#000` |
| Slab keras `0 Npx 0` | Blur, spread, shadow ambient |
| Token (`bg-cream-50`, `shadow-slab-md`) | Hex mentah (`bg-[#FDFBF7]`) di komponen |
| `<Chip tone="…">` | Chip buatan tangan |
| Danger untuk aksi destruktif | Primary Candy untuk tombol hapus |
| Istilah ramah ("Koin", "Hari Beruntun") | Jargon Web3 tanpa penjelasan |
| Pixelify untuk judul pendek | Pixelify untuk paragraf |

---

## 9. Changelog v1.1

| Bagian | Masalah di v1.0 | Perbaikan |
|---|---|---|
| Judul | "Tactile **Spatial** Arcade" vs "Tactile Arcade" di §6 | Diseragamkan jadi **Tactile Arcade** |
| §1 | Markdown bold rusak di "Karakter", "Emosi" tidak bold | Diperbaiki; ditambah 5 Hukum Visual |
| Canvas | Hex `#FFF6EE` tapi class `bg-[#FDFBF7]` (warna berbeda) | Satu token: `cream-50` = `#FFF6EE` |
| Teks sekunder | Dua opsi ambigu (`choco-700` / `choco-600`) | Hanya `choco-700` |
| Line Subdued | `/18` (0.18) vs `/20` di dock; `/18` tidak ada di skala default Tailwind v3 | Diseragamkan `/20`, khusus divider |
| Mint | `border-emerald-700` (`#047857`) tidak cocok dengan slab `#15803D` (green-700); gradiennya pun dari keluarga green | Keluarga `mint-*` custom yang konsisten |
| Pill Dock | Dinamai "Glass" padahal glassmorphism dilarang; ada shadow blur `0_10px_20px`; border redup + slab solid | Nama jadi "Pill Dock", blur dihapus, border solid, ditambah `aria-current` dan state aktif |
| Tombol | `active:translate-y-1` (4px) + slab 1px membuat tombol "tenggelam" 1px terlalu dalam | Rumus dasar slab diam (§3.2) |
| Tombol Gold | Border choco tapi slab `#C8940C`, melanggar prinsip sefamili | Slab `choco-900` (kembalikan ke `gold-700` jika memang disengaja) |
| Bahaya | Warna sama dengan Primary CTA sehingga rawan salah klik | Keluarga `danger-*` (merah) terpisah |
| Peringatan vs Gold | Gradien hampir identik | Warning dipindah ke hue oranye (`warn-*`) |
| Kontras | `candy-800` diberi dua hex sekaligus | Satu hex per token; kontras diukur di stop terang; tabel rasio |
| Chip | Resep tanpa `bg-gradient-to-b`; `select-none` menghalangi salin teks | Jadi komponen `<Chip>` berbasis `cva`; `select-none` dihapus |
| Chip interaktif | Tinggi ~24px melanggar tap target 44px | Aturan perluasan hit area (§7.4) |
| Baseline | 51 + 12 + 17 = 80 ≠ 62 tanpa penjelasan | Dijelaskan: kategori tumpang tindih |
| Guard | Deteksi regex rawan false positive/negative | Guard berbasis komponen + 3 kriteria jelas |
| A11y | Tidak ada focus state, reduced motion, `viewport-fit`, ukuran input | Ditambahkan di §6 dan §4 |
| Tap target | `py-2.5 px-4` tidak menjamin 44px | Wajib `min-h-11` |
