# DESIGN-SYSTEM.md — Web3min Design Blueprint

> **Blueprint tunggal (Single Source of Truth) untuk seluruh antarmuka Web3min.**
> Dokumen ini menggabungkan dan menggantikan `PRD.md` + `DESIGN.md` — nol isi lama dibuang,
> hanya disusun ulang ke dalam kerangka blueprint 10 bagian.
>
> **Status:** Living Spec · **Diperbarui:** September 2026
> **Acuan identitas visual:** `https://web3min.com/leaderboard`

**Susunan dokumen (mengikuti blueprint):**
`## Stack` · `## Typography` · `## Colors` · `## Spacing` · `## Components` · `## Animations` · `## Responsive Rules` · `## Development Plan`

---

## Stack

Perangkat yang **sudah** dipakai Web3min (terverifikasi dari `package.json`, bukan usulan):

| Peran | Teknologi | Versi | Catatan |
|---|---|---|---|
| Framework | **TanStack Start** (`@tanstack/react-start`) | `^1.168.0` | SSR murni, bukan Next.js. Migrasi framework = proyek terpisah, bukan tugas desain |
| Routing | `@tanstack/react-router` | `^1.170.0` | File-based di `src/routes/` |
| Styling | **Tailwind CSS v4** | `^4.3.0` | Konfigurasi via `@theme` di `src/styles.css` — **bukan** `tailwind.config.js` |
| Motion | `framer-motion` | `^13.4.2` | Plus `gsap ^3.15.0` untuk koreografi kompleks |
| Icons | **Lucide** (`lucide-react`) | `^0.510.0` | Plus `@keyline-icons/react` |
| Data | Supabase (`@supabase/supabase-js`) | `^2.116.0` | Progres juga di localStorage |
| State | Zustand | `^5.0.0` | `src/lib/store.ts` |
| Komponen | **shadcn resmi** (`components.json`) | — | 34 komponen ber-styling di `src/components/ui/` |
| Validasi | Zod + react-hook-form | `^4.4.0` / `^7.54.0` | |
| Chart | Recharts | `^2.13.0` | |
| Server | Nitro (via TanStack Start) | devDep | Build output ke `.vercel/output` |

**NPM dependencies yang perlu diinstal untuk komponen baru:** tidak ada yang wajib — Lucide, Framer Motion, dan Tailwind sudah terpasang. Tamagui **belum** dipakai (lihat *Development Plan*).

---

## Typography

### Keluarga font (maksimal 2 — dijaga `src/lib/font-budget.test.ts`)
1. **`font-display`** → *Bricolage Grotesque*: splash display text, hero brand, dan alias `font-pixel`.
2. **`font-sans`** → *Plus Jakarta Sans*: seluruh paragraf, body, catatan, input form.
3. **`font-pixel`** → **alias** ke `var(--font-display)`. Dipakai **392×** di seluruh komponen. Mode Retro Pixel sudah dihapus; jangan "membersihkan" alias ini — diff-nya besar tanpa manfaat.
4. **`font-mono`** → system mono: angka saldo/skor, seed hash, kode.

> ⚠️ **Jangan tambah keluarga ke-3.** Suite gagal kalau `Pixelify` atau keluarga baru muncul di `<link>` atau token `--font-*`.
> Referensi gaya dari user memakai *Space Grotesk + Inter* — itu **contoh**, bukan perintah ganti. Menggantinya mengubah identitas brand dan menyentuh 37 berkas.

### Hierarki pemakaian
- **Headings (H1–H3) & label badge:** `font-pixel font-bold text-choco-900 tracking-tight`
- **Body & subtitle:** `font-sans font-semibold`/`font-bold`, kontras ≥ 4.5:1
- **Angka skor/saldo:** `tabular-nums font-mono` atau `font-pixel font-black`

### Skala ukuran nyata yang dipakai
| Kelas | px | Pemakaian | Jumlah |
|---|---|---|---|
| `text-[9px]`–`text-[11px]` | 9–11 | chip mini, kode, label statistik | 286 |
| `text-xs` | 12 | label sekunder, catatan | 467 |
| `text-sm` | 14 | body kecil, tombol | 204 |
| `text-base` | 16 | **body standar** | 73 |
| `text-lg` | 18 | sub-judul | 42 |
| `text-xl`–`text-2xl` | 20–24 | judul kartu | 75 |
| `text-3xl`–`text-6xl` | 30–60 | hero & display | 32 |

> Referensi gaya menyarankan BODY **18px**; Web3min memakai **16px** dan punya 1.235 pemakaian ukuran di 70 berkas. Perubahan skala global menyentuh 116 berkas unik → dilakukan bertahap, bukan sekaligus.

---

## Colors

### Prinsip 60-30-10 (dipatuhi — diverifikasi dengan hitungan pemakaian kode)

| Porsi | Peran | Hex | Token Tailwind | Tempat pakai |
|---|---|---|---|---|
| **60%** | Latar dominan | `#FFF6EE` | `bg-cream` | Kanvas halaman, isi box |
| **30%** | Tipografi & struktur | `#3B2218` | `text-choco-900` / `border-choco-900` | Semua teks, garis outline, hard shadow |
| **10%** | Aksen | `#E8437F` | `bg-candy-500` | **Hanya** CTA utama & item aktif |

**Terukur dari 2.689 kelas warna di 76 berkas:**

| Keluarga | Pemakaian | Porsi | Peran dalam 60-30-10 |
|---|---|---|---|
| `choco-*` | 1.535 | **57,1%** | **30%** — teks, garis, slab (`choco-900` sendiri 1.174×) |
| `candy-*` | 512 | **19,0%** | **10%** — aksen pink |
| `cream-*` | 10 | 0,4% | **60%** — latar (diwakili `bg-cream`, bukan kelas `cream-*`) |
| `amber`/`emerald` | 174/146 | 6,5%/5,4% | fungsional (chip status) — **palet bawaan Tailwind, bukan token Web3min** |
| `rose`/`sky`/`purple`/`orange`/`slate` | 76/20/22/13/10 | ~5% | idem |

> **Temuan**: 515 pemakaian (**16 kelas keluarga asing** — `amber`, `emerald`, `rose`, `stone`, `purple`, `sky`, `orange`, `slate`, `red`, `yellow`, `blue`, `gray`, `indigo`, `violet`, `neutral`, `pink`) memakai palet bawaan Tailwind, bukan token sendiri. Kontrasnya sebagian sudah dijaga guard, tapi **palet belum sepenuhnya terkunci** ke token Web3min. Kandidat konsolidasi, bukan bug.

> Referensi gaya memakai krem → **hitam** → **biru** `#5B7CFF`. Itu **contoh palet generik**, bukan untuk Web3min. Mengganti aksen pink ke biru = membuang identitas brand, dan `AGENTS.md` melarang dark mode serta mewajibkan aksen pink.

### 1. Warna fondasi (Surface & Neutrals)
| Peran | Hex | Class | Keterangan |
|---|---|---|---|
| Latar Canvas | `#FFF6EE` | `bg-cream` | Latar halaman utama |
| Surface Card | gradien `#FFFFFF → #FFF9F5 → #FDEEE4` | `bg-gradient-to-b from-white via-[#FFF9F5] to-[#FDEEE4]` | Kartu putih berkedalaman |
| Line & Outline | `#3B2218` | `border-choco-900` | Outline cokelat gelap, `2px` standar |
| Line Subdued | `rgba(59,34,24,0.18)` | `border-choco-900/18` | Garis sekunder / divider dalam |
| Teks Utama | `#3B2218` | `text-choco-900` | Heading & judul |
| Teks Sekunder | `#6B4A3A` | `text-choco-600` | Body & penjelasan |
| Teks Tersier | `#8A6552` | `text-choco-500` | Label redup (4.84:1 di cream) |

### 2. Elevasi 3D (hard slab, **blur NOL**)
`shadow-[0_2px_0_#3B2218]` · `shadow-[0_3px_0_#3B2218]` · `shadow-[0_4px_0_#3B2218]` · `shadow-[0_6px_0_#3B2218]`
Tanpa blur lembut — offset vertikal nyata. Shadow ber-blur **hanya** sah untuk overlay/tooltip melayang.

### 3. Gradien kartu tematik (Bento)
| Tema | Gradien | Border & Shadow | Pemakaian |
|---|---|---|---|
| **Gold** (Liga Emas / Prestasi) | `from-[#FFFBEB] via-[#FEF3C7] to-[#FDE68A]` | `border-2 border-choco-900 shadow-[0_6px_0_#3B2218]` | hero klasemen, bridge reward, PETI |
| **Rose Pink** (Undian) | `from-[#FFF0F5] via-[#FFE4EC] to-[#FDC8D8]` | `border-2 border-choco-900 shadow-[0_6px_0_#3B2218]` | hero undian, toko Blobi |
| **Mint** (On-Chain) | `from-[#F0FDF4] via-[#DCFCE7] to-[#BBF7D0]` | `border-2 border-emerald-700 shadow-[0_6px_0_#15803D]` | bukti blockchain, modul lulus |
| **Pill Dock Glass** | `from-white via-[#FFF9F5] to-[#FDEEE4]` | `border-2 border-choco-900/20 shadow-[0_4px_0_#3B2218]` | sub-nav switcher, filter bar |

### 4. Tombol taktil 3D
**Primary Candy CTA** (pink gelap, WCAG AA teruji):
```tsx
bg-gradient-to-b from-[#D62A78] via-[#B01F62] to-[#85174A]
border-2 border-choco-900 text-white font-pixel font-bold
shadow-[0_4px_0_#3B2218] active:translate-y-1 active:shadow-[0_1px_0_#3B2218]
```
**Gold Action:** `from-[#FFE873] via-[#FFD84D] to-[#E6BF35]` · `border-2 border-choco-900` · `shadow-[0_3px_0_#C8940C]` · `text-choco-900`
**Secondary/White:** `bg-white hover:bg-cream` · `border-2 border-choco-900` · `shadow-[0_3px_0_#3B2218]`
**Disabled:** `bg-[#EDE4DC] text-choco-600 border-2 border-choco-900/25` — kontras terukur **6.28:1**

### 5. Warna feedback (kontras ≥4.5:1, selalu ikon + teks)
| Peran | Soft | Ink (untuk teks) |
|---|---|---|
| Sukses | `#E8FBF4` | `#17805F` |
| Peringatan | `#FFF8E1` | `#8A6100` |
| Error | `#FFE9EA` | `#B3272C` |
| Koin/XP/PETI | — | `#8A6100` |

> ⚠️ Jangan pakai varian `*-deep` sebagai teks: `#1E9E78` (3.16), `#D9A400` (2.12), `#B27B00` (3.43) semuanya **gagal** WCAG AA. Dijaga `src/lib/feedback-colors.test.ts`.

### 6. Warna HARAM diubah
- Pink brand `#E8437F` → **jangan** diganti biru/ungu/hijau.
- Tema terang krem → **jangan** diganti dark mode.
- Gradient CTA candy 3-stop → **jangan** diratakan jadi satu warna.

### 7. Audit kontras WCAG AA — hasil pengukuran nyata

Diukur di **browser** (bukan asumsi), latar dikomposit termasuk alpha & gradien, pada 11 rute × viewport 390px. Diverifikasi ulang di **produksi** `web3min.com`.

**Hasil: 53 dari 56 pasangan token LULUS.** Yang gagal semuanya di luar kontrak body text.

**3 kegagalan nyata (terkonfirmasi di produksi):**

| Kelas | Rasio | Butuh | Ukuran | Tempat |
|---|---|---|---|---|
| `text-choco-400` | **3,64** | 4,5 | 16px | `/about` |
| `text-candy-500` | **3,55** | 4,5 | 12px | `/profile` |
| `text-orange-600` | **3,36** | 4,5 | 12px | `/leaderboard` |

**42 pemakaian teks perlu diganti — semua penggantinya SUDAH ADA di `@theme`, nol warna baru:**

| Kelas sekarang | → Ganti | Hex | Rasio baru |
|---|---|---|---|
| `text-choco-400` (7 teks) | `choco-500` | `#8A6552` | 4,84 ✅ |
| `text-ink-300` (5 teks) | `choco-500` | `#8A6552` | 4,84 ✅ |
| `text-candy-500` (3 teks) | `candy-700` | `#B01F62` | 6,11 ✅ |
| `text-candy-600` (5 teks) | `candy-700` | `#B01F62` | 6,11 ✅ |
| `text-orange-600` (6 teks) | `flame-500` | `#B54A12` | 4,98 ✅ |
| `text-streak` (3 teks) | `flame-500` | `#B54A12` | 4,98 ✅ |
| `text-rose-600` (4 teks) | `candy-700` | `#B01F62` | 6,11 ✅ |
| `text-mint-deep` (3 teks) | `ok-ink` | `#17805F` | 4,59 ✅ |
| `text-emerald-600` (1 teks) | `ok-ink` | `#17805F` | 4,59 ✅ |
| `text-danger` (2 teks) | `err-ink` | `#B3272C` | 6,06 ✅ |
| `text-amber-600` (1 teks) | `warn-ink` | `#8A6100` | 5,19 ✅ |
| `text-amber-300` (2 teks) | `warn-ink` | `#8A6100` | 5,19 ✅ |

**Yang SAH apa adanya (jangan "diperbaiki"):**
- **19× `placeholder:text-choco-400`** — placeholder tidak wajib 4,5:1
- **24× `text-candy-500` pada ikon** — ikon butuh 3:1, rasio 3,55 = lulus
- **17× `text-emerald-600` pada ikon** — 3,53 ≥ 3,0 = lulus
- **12× `text-rose-600` pada ikon** — 4,40 ≥ 3,0 = lulus

**Gagal juga sebagai ikon (<3:1) — prioritas tinggi:** `text-streak` (2,20), `text-amber-600` (2,98), `text-amber-300` (1,35).

**Pelajaran pengukuran:** Tailwind v4 mengeluarkan warna sebagai **`oklab()`**, bukan `rgb()`. Regex `rgb()` akan **dilewati** dan menghasilkan rasio palsu (chip cokelat gelap sempat terbaca 1,02 padahal 8,82). Selalu resolve warna lewat **canvas** (`fillStyle` + `getImageData`), dan **komposit** latar semi-transparan berlapis — jangan lewati alpha < 1.

---

## Spacing

Skala: **4 / 8 / 12 / 16 / 24 / 32 / 48**. Jarak **tidak boleh sama rata**:

| Jarak | Nilai | Contoh |
|---|---|---|
| Label → field | `6–8px` | `mt-1.5` |
| Antar field | `16px` | `space-y-4` |
| Sebelum tombol | `24px` | `mt-6` |
| Antar kartu grid | `24px` | `gap-6` |
| Padding kartu | `16–20px` | `p-4 md:p-5` |

**Radius** (dari `@theme`): `sm 10px` · `md 14px` · `lg 22px` · `xl 28px` · `2xl 32px` · `pill 9999px`.
Kartu konten & modal → `rounded-3xl` (32px). Chip → `rounded-full`. Pill dock → `rounded-2xl`.

---

## Components

### 1. Kartu permukaan (SurfaceCard)
Semua varian: `border-2 border-choco-900` **solid 100%** + `shadow-[0_4px_0_#3B2218]` + `rounded-3xl`.

### 2. Pola Pill Dock (sub-navigasi)
Semua sub-halaman berpasangan (Klasemen & Undian, Toko & Ruang Ganti) **wajib** pakai dock pill terpusat:
```tsx
<div className="flex items-center gap-2 rounded-2xl border-2 border-choco-900/20
     bg-gradient-to-b from-white via-[#FFF9F5] to-[#FDEEE4] p-1.5
     shadow-[0_4px_0_#3B2218] max-w-md mx-auto">
```
Tab aktif: `border-2 border-candy-600 bg-gradient-to-b from-[#B01F62] via-[#85174A] to-[#6E1239] text-white shadow-[0_3px_0_#6E1239] font-pixel font-bold`
Tab tidak aktif: `border-2 border-transparent text-choco-600 hover:border-choco-900/20 hover:bg-candy-50`
Wajib `aria-pressed` untuk aksesibilitas state. **7 switcher** sudah memakai pola ini: `/leaderboard`, `/raffle`, `/shop`, `/profile`, `/kisah`, `pulau-rantai-progres`, `/admin`.

### 3. Kontrak Chip / Badge Status (§6 — WAJIB SERAGAM)
Acuan: dua chip di `/profile` — `Level 2` (netral) & `Murid Blobi` (pink).

```tsx
<span className="inline-flex items-center gap-1.5 select-none whitespace-nowrap
  rounded-full                      {/* A. stadium penuh */}
  border-2 border-<family>          {/* B. border SOLID saturasi penuh */}
  px-2.5 py-0.5 text-xs font-bold font-pixel
  shadow-[0_2px_0_<slab>]           {/* C. slab keras, blur NOL */}
">
```

**Empat aturan keras:**
| # | Aturan | Dilarang | Alasan |
|---|---|---|---|
| **A** | `rounded-full` | `rounded-lg/xl/2xl` pada chip | Sudut kotak memecah bahasa visual |
| **B** | Border **solid** sefamili | `border-*/18`, `border-*/20`, `border-*/40` | Border transparan = chip tampak belum selesai |
| **C** | Hard slab, blur nol | `shadow-none`, `shadow-sm`, shadow ber-blur | Ekstrusi 3D inti gaya Tactile Arcade |
| **D** | Teks tebal gelap di atas isi terang | teks tipis; putih di atas pink terang | Keterbacaan + bobot chip |

**Matriks keluarga warna:**
| Keluarga | Isi | Border | Slab | Contoh |
|---|---|---|---|---|
| Netral / Level | `from-white to-[#FBE9DC]` | `border-choco-900` | `#3B2218` | `Level 2` |
| Rose / Identitas | `from-[#FFF0F5] to-[#FDC8D8]` | `border-candy-600` | `#B01F62` | `Murid Blobi` |
| Gold / Prestasi | `from-[#FFFBEB] to-[#FDE68A]` | `border-choco-900` | `#C8940C` | peringkat liga |
| Mint / Lulus | `from-[#F0FDF4] to-[#BBF7D0]` | `border-emerald-700` | `#15803D` | status selesai |
| Amber / Peringatan | `from-[#FFF8E1] to-[#FFE08A]` | `border-amber-600` | `#B27B00` | menunggu verifikasi |
| Rose gelap / Bahaya | `bg-candy-800` | `border-choco-900` | `#3B2218` | aksi destruktif |

**Kapan BUKAN chip:** input form, kartu konten, tombol aksi penuh, pill dock navigasi (§2 di atas). Yang diikat: elemen kecil penanda status, tinggi ≤ ~28px, teks ≤ `text-xs`.
**Pengecualian sah:** chip **di atas foto/artwork** → `bg-choco-900/70` transparan + teks putih + `backdrop-blur-sm`, tanpa border, karena border solid di atas gambar akan mengotori artwork.
**Guard:** `src/lib/chip-contract.test.ts`.

### 4. Kartu undian yang bisa dibalik (Flip)
`src/components/ui/flip-raffle-card.tsx` — dua sisi, **state eksplisit** (`flipped` + `onToggle`), bukan hover, supaya bekerja di HP.
- Sisi depan: gambar NFT **edge-to-edge** (tanpa frame/radius), badge rarity/Detail/status mengambang `absolute top-3 z-10`, chip hadiah polos `absolute bottom-3`.
- Sisi belakang: rincian slot/mint/perks/seed.
- Tinggi dipatok (`h-[620px] sm:h-[600px]`) karena kedua sisi `position:absolute`.
- Tap target toggle 44px via pseudo-element `before:-inset-y-[10px]` (visual tetap 24px).

### 5. Daftar komponen `src/components/ui/` (34 ber-styling, 115 call-site impor)
Paling banyak dipakai: `button` (16×), `progress-bar` (10×), `card` (8×), `progress` (7×), `surface-card` (5×), `feature-card-1` (4×), `tactile-button` (4×), `lozenge` (4×), `badge` (4×), `streak-badge` (4×).

---

## Animations

| Interaksi | Resep | Durasi |
|---|---|---|
| Tekan tombol taktil | `active:translate-y-[2px] active:shadow-none` | `transition-all` |
| Angkat kartu saat hover | `hover:-translate-y-0.5` | `150ms` |
| Skala gambar saat hover | `group-hover:scale-105` | `300ms` |
| Flip kartu undian | `transition-transform [transform:rotateY(180deg)]` + `preserve-3d` | `700ms` |
| Halus (framer-motion/gsap) | koreografi antar-blok, transisi rute | sesuai konteks |
| Hormati `prefers-reduced-motion` | semua animasi dimatikan via media query di `styles.css` | — |

Pola tetap: **animasi hanya saat hover/tap**, ikon boleh animasi ringan, tidak ada animasi yang berjalan terus-menerus di latar.

---

## Responsive Rules

- **Lebar uji wajib: 320 / 360 / 390 / 430px** (mayoritas pengguna dari HP) + desktop 1280px.
- **Nol overflow horizontal** di semua lebar uji. Lebar tetap (`w-[360px]`) **dilarang** — pakai `w-full max-w-[360px]`.
- **Tap target ≥ 44px** untuk setiap elemen interaktif.
- **Safe area:** `env(safe-area-inset-top)` / `env(safe-area-inset-bottom)` pada container fixed.
- **Input form:** font `<input>` minimal **16px** (`text-base sm:text-sm`) agar iOS Safari tidak auto-zoom.
- **Keyboard:** input & tombol utama tidak tertutup keyboard; form tidak dikunci `items-center justify-center select-none`.
- **Navbar bawah:** grid **6 kolom sama lebar** (jangan 7 kolom + spacer), tombol `size-[min(52px,100%)]`, ikon saja + `aria-label`.
- **State layar wajib:** skeleton (bukan spinner untuk daftar), kosong (dengan ajakan bertindak), error (+ tombol Coba lagi), terkunci (redup + alasan).

---

## Development Plan

### Alur pengembangan (6 langkah)
`01 Structure` → `02 Components` → `03 Responsive UI` → `04 Interactions` → `05 Polish` → `06 Deploy`

### Yang SUDAH selesai
1. **Unifikasi rute** ke SSOT `/leaderboard`: `/raffle`, `/shop`, `/profile`, `/settings`, `/kisah`, `/leaderboard`.
2. **Kontrak chip/badge** — 12 chip diperbaiki, guard `chip-contract.test.ts` dipasang.
3. **7 switcher lokal** diseragamkan ke Arena pill dock.
4. **Sapuan taktil 3 area** — ~40 titik, border solid + hard slab, blur dibuang.
5. **Sambungan peta pulau** — `mixSeamColor()`, terukur 133–192 → **0 satuan RGB**.
6. **Kartu undian bisa dibalik** + gambar NFT edge-to-edge + chip polos.
7. **shadcn resmi** (`components.json`) + `card-14` di-port ke kontrak Web3min.

### Rencana berikutnya (berurutan, tiap langkah bisa dites & dibatalkan sendiri)
| # | Langkah | Berkas | Risiko | Catatan |
|---|---|---|---|---|
| 1 | Ganti font → Space Grotesk + Inter, perbarui `font-budget.test.ts` | ~4 | **Rendah** | Mengubah identitas visual; 2 keluarga jadi tetap 2 (tidak melanggar aturan) |
| 2 | Perluas skala tipografi di `@theme` jadi token bernama (`--text-*`) | 1 | Rendah | Token dulu, jangan hardcode 1.235 kali |
| 3 | Migrasi skala ukuran per-rute, satu rute per commit | ~70 | **Tinggi** | 1.235 pemakaian di 70 berkas; verifikasi tiap rute |
| 4 | Install Tamagui + `TamaguiProvider`, port 1 komponen sebagai bukti | 2 | Sedang | Belum diuji bareng TanStack SSR |
| 5 | Migrasi 43 komponen ui ke Tamagui, dari daun ke akar | 43 | **Sangat tinggi** | `button` (16 importer) paling akhir |

**Total dampak bila semua dijalankan: 116 berkas unik** dari ~120 berkas di `src/`.

### Acceptance criteria
1. **GIVEN** user membuka rute apa pun di 360px maupun 1280px, **THEN** sub-nav tampil sebagai pill dock identik dengan `/leaderboard` dan nol overflow horizontal.
2. **GIVEN** seluruh perubahan diterapkan, **WHEN** `npm test` dijalankan, **THEN** seluruh suite lulus (`exit 0`), termasuk guard `font-budget`, `chip-contract`, `feedback-colors`, `contrast-budget`, `theme-colors`, `seam-blend`.
3. **GIVEN** `npm run build`, **THEN** `tsc --noEmit` bersih dan build Vite + Nitro sukses.

---

## Lampiran — Riwayat keputusan penting

- **`--font-pixel` dipertahankan** sebagai alias `var(--font-display)`: 392 pemakaian tetap bekerja tanpa mengubah satu call site.
- **Token shadcn ada di blok `@theme`, bukan `:root`** — memeriksa `:root` saja menghasilkan kesimpulan palsu "token tidak ada".
- **Mode Retro Pixel dihapus** — jangan dihidupkan kembali; `retro.css` sudah dihapus.
- **`AGENTS.md` adalah protected file** — perubahan di dalamnya butuh approval eksplisit user.
