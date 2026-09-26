# DESIGN-SYSTEM.md — Web3min Design Blueprint

> **Blueprint tunggal (Single Source of Truth) untuk seluruh antarmuka Web3min.**
> Dokumen ini **menggabungkan** `PRD.md` + `DESIGN.md` ke kerangka blueprint 8 bagian —
> nol isi lama dibuang, hanya disusun ulang.
>
> **Status:** Living Spec · **Diperbarui:** September 2026 (sinkronisasi Langkah 18)
> **Acuan identitas visual:** `https://web3min.com/leaderboard`
> **Nama gaya:** **Gamified UI / Soft Neo-Brutalism**
>
> 📌 **Pembagian peran (jangan bingung):** dokumen ini = **blueprint** (stack, token, kontrak, rencana). `DESIGN.md` = **spesifikasi visual ringkas** (filosofi, palet, tombol, tipografi, kontrak chip) dan tetap dipakai aktif sebagai rujukan cepat — §3-nya sudah disinkronkan ke Space Grotesk + Inter. `PRD.md` = arsip produk.
> 📌 **Setiap angka di dokumen ini terukur dari kode**, bukan asumsi. Kalau kode berubah, ukur ulang lalu perbarui — jangan biarkan dua dokumen berbeda.

## Gaya: Gamified UI / Soft Neo-Brutalism

**Gamified UI / Soft Neo-Brutalism** = bahasa visual neo-brutalis yang dilembutkan supaya ramah, dibungkus rasa permainan (arcade), bukan menantang.

| Unsur | Pilihan Web3min | Catatan |
|---|---|---|
| **Struktur** | Neo-brutalis: outline tebal solid, elevasi 3D nyata | `border-2 border-choco-900` + hard slab |
| **Kelembutan** | Sudut membulat besar, palet pastel hangat, tanpa warna neon tajam | `rounded-3xl`, krem `#FFF6EE`, pink `#E8437F` |
| **Bayangan** | **Hard slab, blur NOL** — bukan shadow lembut ber-blur | Ini yang membuat "taktil", bukan "mengapung" |
| **Emosi** | Menyenangkan, bebas intimidasi Web3 yang dingin/kaku | Terasa seperti main game arcade saku |

> ⚠️ **"Soft" di sini TIDAK berarti bayangan ber-blur.** Yang dilembutkan adalah bentuk (radius), warna (pastel), dan nada (ramah) — bukan elevasinya. Shadow ber-blur hanya sah untuk overlay/tooltip melayang. Inti taktil tetap: `shadow-[0_Npx_0_#3B2218]` dengan **blur nol**.
>
> Nama gaya sebelumnya: *Tactile Spatial Arcade / Playful Neo-Brutalism*. Diganti atas permintaan pemilik repo — **murni penamaan ulang, nol perubahan visual**. Semua kontrak di bawah tetap berlaku apa adanya. `DESIGN.md` memakai bentuk lengkap yang sama.

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
| Komponen (opsional) | **Tamagui** | `^2.7.7` | Terpasang Langkah 19, driver `v5-css`. UI produksi **belum** memakai — lihat *Development Plan* |
| Validasi | Zod + react-hook-form | `^4.4.0` / `^7.54.0` | |
| Chart | Recharts | `^2.13.0` | |
| Server | Nitro (via TanStack Start) | devDep | Build output ke `.vercel/output` |

**NPM dependencies yang perlu diinstal untuk komponen baru:** tidak ada yang wajib — Lucide, Framer Motion, dan Tailwind sudah terpasang.

> ⚠️ **Tamagui SUDAH terpasang** (Langkah 19) — `tamagui` / `@tamagui/config` / `@tamagui/vite-plugin` `^2.7.7`, config di `src/tamagui.config.ts`, `TamaguiProvider` di `__root.tsx`. Tapi **UI produksi belum memakai Tamagui** — baru 1 komponen bukti (`tamagui-tactile-button.tsx`) + halaman `/tamagui-poc`. Migrasi penuh = langkah 5 di *Development Plan* (risiko sangat tinggi). Jangan tulis seolah seluruh UI sudah Tamagui.
> `react-native` dipasang sebagai **devDependency** (0.87.1) — hanya untuk typing; Tamagui v5 mengekspos source TS yang mengimpor `react-native`. `@types/react-native` versi lama **merusak** typing, jangan dipakai.

---

## Typography

### Keluarga font (maksimal 2 — dijaga `src/lib/font-budget.test.ts`)
1. **`font-display`** → **Space Grotesk**: splash display text, hero brand, seluruh Judul Kartu (H1–H3), label badge, pill navigation, dan tombol game — diakses lewat alias `font-pixel`.
2. **`font-sans`** → **Inter**: seluruh paragraf, body, catatan, input form.
3. **`font-pixel`** → **alias** ke `var(--font-display)`. Dipakai **415× di 43 berkas**. Mode Retro Pixel sudah dihapus; jangan "membersihkan" alias ini — diff-nya besar tanpa manfaat.
4. **`font-mono`** → system mono: angka saldo/skor, seed hash, kode.

> ✅ **SUDAH DITERAPKAN** (Langkah 15, commit `23ca910`) — ini bukan lagi usulan. *Space Grotesk + Inter* sudah menggantikan *Bricolage Grotesque + Plus Jakarta Sans*. Tetap **tepat 2 keluarga**, jadi aturan `AGENTS.md` "font maksimal 2" **tidak dilanggar**; yang berubah hanya IDENTITAS keluarga (dan itu mengubah karakter visual: Bricolage = kartun arcade, Space Grotesk = netral/teknis).
> ⚠️ **Jangan tambah keluarga ke-3.** Guard mengunci **jumlah (≤2) + identitas nama**: `Bricolage Grotesque`, `Plus Jakarta Sans`, `Pixelify Sans`, `JetBrains Mono`, `Silkscreen`, `Press Start 2P`, dan `Nunito` ada di daftar mati — muncul kembali = suite gagal.
> 📌 **`DESIGN.md` §3 sudah disinkronkan** ke keadaan ini (Langkah 18). Dua dokumen tidak boleh berbeda lagi: `DESIGN-SYSTEM.md` = blueprint, `DESIGN.md` = spesifikasi visual.

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

> Referensi gaya menyarankan BODY **18px**; Web3min memakai **16px** (dipatok `font-budget.test.ts`) dan punya **1.190 pemakaian ukuran di 70 berkas**. Perubahan skala global menyentuh puluhan berkas → dilakukan bertahap, bukan sekaligus.

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

**42 pemakaian teks SUDAH DIGANTI (Langkah 16, commit `1af34b3`, 19 berkas) — semua penggantinya SUDAH ADA di `@theme`, nol warna baru:**

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
Wajib `aria-pressed` untuk aksesibilitas state. **7 dock terverifikasi di 6 berkas** (terukur Langkah 18): `/raffle`, `/shop` (×2: mode toko + scope lemari), `/profile`, `/kisah`, `pulau-rantai-progres`, `/leaderboard`.
> **Koreksi:** `/admin` **TIDAK** memakai pill dock — tab-nya baris underline (`border-b-2 border-choco-900/20`) dengan pill `rounded-xl`, jadi jangan dihitung sebagai dock.
> **Tab aktif `/leaderboard` memakai ramp GOLD** (`from-[#FFE873] via-[#FFD84D] to-[#E6BF35]`), bukan candy — dock pertama dan kedua tidak selalu sewarna.

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
| **C** | Hard slab, blur nol | `shadow-none`, `shadow-sm`, shadow ber-blur | Ekstrusi 3D inti gaya Soft Neo-Brutalism |
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

### 5. Daftar komponen `src/components/ui/`
**37 berkas `.tsx`** (34 ber-styling + 3 demo: `demo.tsx`, `feature-card-demo.tsx`, `card-14-demo.tsx`). Dipakai lewat **42 baris impor** dari 21 berkas, menghasilkan **75 JSX call-site** (terukur Langkah 18).
Paling banyak dipakai: `TactileButton` (12×), `ProgressBar` (11×), `SurfaceCard` (6×), `Badge` (5×), `StreakBadge` (5×), `AnimatedFeatureCard` (5×), `CandyLoader` (4×), `Card` (4×).
> Catatan: `ui/button.tsx` (variant `primary`/`secondary`/`coin`/`danger`/`ghost`) hanya diimpor **2 berkas** (`desk-rail`, `pulau-rantai-map`). Tombol utama aplikasi sebenarnya **`TactileButton`** + **`DuoButton`** — jangan menganggap `ui/button.tsx` sebagai satu-satunya sumber tombol.

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
| # | Langkah | Berkas | Risiko | Status |
|---|---|---|---|---|
| 1 | Ganti font → Space Grotesk + Inter, perbarui `font-budget.test.ts` | ~4 | **Rendah** | ✅ **SELESAI** (Langkah 15, commit `23ca910`) — tepat 2 keluarga, tidak melanggar aturan |
| 2 | Perluas skala tipografi di `@theme` jadi token bernama (`--text-*`) | 1 | Rendah | ⬜ Belum — token dulu, jangan hardcode ~1.190 kali |
| 3 | Migrasi skala ukuran per-rute, satu rute per commit | 70 | **Tinggi** | ⬜ Belum — 1.190 pemakaian di 70 berkas (terukur ulang) |
| 4 | Install Tamagui + `TamaguiProvider`, port 1 komponen sebagai bukti | 2 | Sedang | ✅ **SELESAI** (Langkah 19) — lihat bagian *Tamagui* di bawah |
| 5 | Migrasi 43 komponen ui ke Tamagui, dari daun ke akar | 43 | **Sangat tinggi** | ⬜ Belum — `button` (16 importer) paling akhir. Catatan: hanya **2 berkas** yang benar-benar mengimpor `ui/button.tsx` (`desk-rail`, `pulau-rantai-map`) |

### Tamagui — sudah terpasang (Langkah 19)

| Hal | Nilai |
|---|---|
| Versi | `tamagui` / `@tamagui/config` / `@tamagui/vite-plugin` `^2.7.7` |
| Driver animasi | `@tamagui/config/v5-css` (CSS, **bukan** reanimated — app web) |
| Config | `src/tamagui.config.ts` — token dicerminkan dari `@theme` Tailwind |
| Provider | `TamaguiProvider` di `src/routes/__root.tsx` (`defaultTheme="light"`) |
| Komponen bukti | `src/components/ui/tamagui-tactile-button.tsx` + halaman `/tamagui-poc` |
| Guard | `src/lib/tamagui-tokens.test.ts` (5 test: sinkron token, pink brand, kontras, font, no-reanimated) |

**Terbukti jalan di browser** (bukan cuma lolos `tsc`): bg `#B01F62`, border `2px #3B2218`, radius `14px`, slab `0 4px 0` **blur nol**, `minH 44px`, font **Space Grotesk**, label putih `rgb(255,255,255)`; press → slab `1px` + `translateY(2px)`. SSR aktif (markup ada di HTML server). Overflow **0** di 320/360/390/430px. Build produksi sukses.

**⚠️ 3 jebakan yang sudah memakan korban (jangan diulang):**
1. `defaultConfig` ada di `@tamagui/config/v5`, **bukan** `/v5-css` (yang hanya mengekspor `animations`). Warna **tidak** ada di `defaultConfig.tokens` — harus ditambah sendiri sebagai `tokens.color` supaya `$choco900` dikenali (`ColorTokenBase` membaca `Tokens['color']`).
2. `Button` Tamagui punya sub-theme sendiri (`light_Button`) yang menimpa border/warna dari theme root — border & warna teks wajib eksplisit.
3. `fontFamily` hanya bekerja di `Text` (menghasilkan `.font_heading` → `--f-family`), **bukan** di `Button` (hanya menghasilkan `_ff-f-family` tanpa `--f-family`, font jatuh ke system).

**Dampak bundle — DIUKUR A/B (bukan perkiraan):** memasang `TamaguiProvider` di `__root.tsx` menambah **+176 KB** pada root chunk yang dimuat **SETIAP halaman** (565 KB vs 389 KB), total assets +112 KB (1.665 vs 1.553 KB). Jadi provider **tidak gratis** meski UI belum memakai Tamagui — ini konsekuensi menaruh provider di root. Kalau biaya ini tidak diinginkan sebelum migrasi langkah 5, pindahkan `TamaguiProvider` dari `__root.tsx` ke route yang benar-benar memakai Tamagui (mis. bungkus `/tamagui-poc` saja) — UI produksi tidak terpengaruh karena belum ada yang memakainya.

**Hydration error di `/` = PRA-EKSISTING, bukan dari Tamagui.** Diverifikasi Playwright: dari 5 rute (`/`, `/cara`, `/leaderboard`, `/raffle`, `/tamagui-poc`) hanya `/` yang memicu `Hydration failed`, dan sudah tercatat di `progress.md` sebagai temuan Langkah 9 lanjutan (terjadi juga di produksi sebelum Tamagui dipasang). Akar masalah ditemukan: `src/components/blobi-guide.tsx:292` menghitung `isRightSide` dari `window.innerWidth` **saat render** — di server `false`, di client bisa `true`, sehingga class berbeda. Perbaikannya: pindahkan ke `useEffect`/state, atau gate dengan flag hydrated.

**Dampak terukur bila langkah 2–5 dijalankan: 84 berkas unik** dari 173 berkas `.tsx/.ts` di `src/` (irisan berkas pemakai utility ukuran + pemakai komponen ui).

### Acceptance criteria
1. **GIVEN** user membuka rute apa pun di 360px maupun 1280px, **THEN** sub-nav tampil sebagai pill dock identik dengan `/leaderboard` dan nol overflow horizontal.
2. **GIVEN** seluruh perubahan diterapkan, **WHEN** `npm test` dijalankan, **THEN** seluruh suite lulus (`exit 0`). Guard desain yang benar-benar ada: `font-budget`, `chip-contract`, `feedback-colors`, `contrast-budget`, `seam-blend` (+ `seo`, `app-data`, `readiness-schedule`, `gate-identity`, `sign-in-gate`).
3. **GIVEN** `npm run build`, **THEN** `tsc --noEmit` bersih dan build Vite + Nitro sukses.

---

## Lampiran — Riwayat keputusan penting

- **`--font-pixel` dipertahankan** sebagai alias `var(--font-display)`: 392 pemakaian tetap bekerja tanpa mengubah satu call site.
- **Token shadcn ada di blok `@theme`, bukan `:root`** — memeriksa `:root` saja menghasilkan kesimpulan palsu "token tidak ada".
- **Mode Retro Pixel dihapus** — jangan dihidupkan kembali; `retro.css` sudah dihapus.
- **`AGENTS.md` adalah protected file** — perubahan di dalamnya butuh approval eksplisit user.
