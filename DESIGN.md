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

- **Tap Target:** Setiap tombol interaktif memiliki tinggi minimal 44px (`min-h-[44px]` atau `py-2.5 px-4`).
- **Kontras Teks:** Seluruh label teks putih di atas tombol pink wajib menggunakan ramp `candy-800` (`#85174A` / `#B01F62`) dengan rasio kontras `>= 4.5:1` (lulus uji `contrast-budget.test.ts`).
- **Mobile Safe Area:** Seluruh fixed container mematuhi `env(safe-area-inset-top)` dan `env(safe-area-inset-bottom)`.

---

## 6. Kontrak Chip / Badge Status (WAJIB SERAGAM)

Acuan visual: dua chip di `/profile` — `Level 2` (keluarga netral) dan `Murid Blobi` (keluarga pink). **Semua chip status, label level, penanda kategori, dan badge kecil di seluruh aplikasi wajib mengikuti resep ini.** Divergensi terukur saat kontrak ini ditetapkan: 62 titik di 18 berkas (51 radius bukan pill, 12 border transparan, 17 tanpa hard slab).

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
