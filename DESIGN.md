# DESIGN.md — Web3min "Tactile Spatial Arcade" Design System

Dokumen spesifikasi desain tunggal (Single Source of Truth) untuk seluruh antarmuka Web3min.  
Mengkodifikasi identitas visual dari `https://web3min.com/leaderboard` untuk diterapkan secara seragam di seluruh halaman.

---

## 1. Filosofi & Karakter Desain

- **Gaya:** *Tactile Spatial Arcade / Playful Neo-Brutalism*.
- **Karakter:** Garis outline komik tebal yang tegas, bayangan jatuh kaku 3D tanpa blur (*hard offset shadow*), palet pastel bergradien lembut, dan sudut membulat ramah (*squircle / organic rounded*).
- **Emosi:** Menyenangkan, bebas intimidasi Web3 yang dingin/kaku, terasa seperti main game arcade saku.

---

## 2. Master Design Tokens

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
1. **Primary Candy CTA (Pink Gelap - WCAG AA Teruji):**
   - Latar: `bg-gradient-to-b from-[#D62A78] via-[#B01F62] to-[#85174A]`
   - Border: `border-2 border-choco-900`
   - Shadow: `shadow-[0_4px_0_#3B2218]`
   - Teks: `text-white font-pixel font-bold` (atau panah `iconAfter`)
   - Active state: `active:translate-y-1 active:shadow-[0_1px_0_#3B2218]`
2. **Gold Action Button:**
   - Latar: `bg-gradient-to-b from-[#FFE873] via-[#FFD84D] to-[#E6BF35]`
   - Border: `border-2 border-choco-900`
   - Shadow: `shadow-[0_3px_0_#C8940C]`
   - Teks: `text-choco-900 font-pixel font-bold`
3. **Secondary / White Button:**
   - Latar: `bg-white hover:bg-cream`
   - Border: `border-2 border-choco-900`
   - Shadow: `shadow-[0_3px_0_#3B2218]`
   - Teks: `text-choco-900 font-pixel font-bold`

---

## 3. Tipografi & Hierarki

Maksimal 3 keluarga font yang dimuat melalui root stylesheet:
1. **Bricolage Grotesque (`font-display`):** Digunakan untuk splash display text dan hero brand.
2. **Pixelify Sans (`font-pixel`):** Digunakan untuk seluruh Judul Kartu (H1, H2, H3), label badge, pill navigation, dan tombol game.
3. **Plus Jakarta Sans (`font-sans`):** Digunakan untuk seluruh paragraf, teks body, catatan, dan input form.

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
