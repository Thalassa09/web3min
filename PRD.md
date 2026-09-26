# PRD.md — Web3min UI/UX Unification Specification

**Target:** Unifikasi UI/UX Web3min berbasis Design System Master `https://web3min.com/leaderboard`  
**Status:** Approved & Living Spec  
**Author:** Lead Architect (Delegated Execution to Sub-Agent Design)  
**Date:** September 2026  

---

## 1. Executive Summary & Problem Statement

Halaman `/leaderboard` saat ini adalah representasi visual tertinggi dari identitas Web3min:
- Gaya: **Tactile Spatial Arcade / Neo-Brutalist Playful** dengan kontur garis tebal (`border-2 border-choco-900`), bayangan jatuh kaku 3D (`shadow-[0_4px_0_#3B2218]`), dan kartu bertingkat bergradien hangat (Gold Liga Emas `#FFFBEB`→`#FDE68A`, Rose Pink Undian `#FFF0F5`→`#FDC8D8`).
- Masalah: Halaman lain seperti `/raffle`, `/shop`, `/profile`, `/settings`, dan sub-navigasi masih memiliki inkonsistensi styling:
  1. `/raffle`: Sub-nav tab masih rata-kiri dengan border tipis dan divider datar; hero banner menggunakan font `font-display` alih-alih `font-pixel font-bold`, serta ketiadaan bridge banner timbal balik ke `/leaderboard`.
  2. `/shop`: Masih memiliki elemen abu-abu datar dan beberapa CTA pasif ("Beli", "Batal").
  3. Komponen kartu & pill antar halaman memiliki variasi border-radius dan shadow yang tidak selaras.

---

## 2. Master Design Invariants (Leaderboard Design System SSOT)

Setiap halaman dan kartu wajib mematuhi kanon visual `/leaderboard`:

### 2.1 Color & Surface Palette
1. **Latar Kanvas Utama:** Cream `#FFF6EE` / `#FDFBF7`.
2. **Kontur & Garis:** Cokelat pekat Dark Chocolate `#3B2218` (ketebalan `2px` standar, `3px` atau `4px` untuk kontainer luar/modal).
3. **Elevasi 3D Hard Shadow:** `shadow-[0_3px_0_#3B2218]`, `shadow-[0_4px_0_#3B2218]`, `shadow-[0_6px_0_#3B2218]`. Tanpa blur lembut; offset vertikal nyata.
4. **Gradien Kartu Utama:**
   - **Kartu Emas / Prestasi (Liga Emas):** `bg-gradient-to-b from-[#FFFBEB] via-[#FEF3C7] to-[#FDE68A] border-2 border-choco-900 shadow-[0_6px_0_#3B2218]`
   - **Kartu Pink / Undian (Raffle Bridge):** `bg-gradient-to-b from-[#FFF0F5] via-[#FFE4EC] to-[#FDC8D8] border-2 border-choco-900 shadow-[0_6px_0_#3B2218]`
   - **Kartu Putih / Surface Glass:** `bg-gradient-to-b from-white via-[#FFF9F5] to-[#FDEEE4] border-2 border-choco-900/18 shadow-[0_4px_0_#3B2218]`
5. **Tombol CTA Utama:**
   - Dark Candy Ramp: `bg-gradient-to-b from-[#D62A78] via-[#B01F62] to-[#85174A] text-white border-2 border-choco-900 shadow-[0_4px_0_#3B2218]`
   - Gold Action: `bg-gradient-to-b from-[#FFE873] via-[#FFD84D] to-[#E6BF35] text-choco-900 border-2 border-choco-900 shadow-[0_3px_0_#C8940C]`
   - Secondary / White: `bg-white text-choco-900 border-2 border-choco-900 shadow-[0_3px_0_#3B2218] hover:bg-cream`

### 2.2 Tipografi
- **Headings (H1, H2, H3) & Badge Label:** `font-pixel font-bold text-choco-900 tracking-tight`.
- **Body & Subtitle:** `font-sans` (Plus Jakarta Sans) dengan ketebalan `font-semibold` / `font-bold`, kontras teks `>= 4.5:1` di atas latar.
- **Angka Skor / Saldo:** `tabular-nums font-mono` atau `font-pixel font-black`.

---

## 3. Rencana Eksekusi per Rute

### 3.1 Rute `/raffle` (Prioritas Utama)
- **Arena Sub-Nav Tabs:**
  - Ganti sub-nav lama dengan dock pill centered `max-w-md mx-auto`:
    * Container: `flex items-center gap-2 rounded-2xl border-2 border-choco-900/20 bg-gradient-to-b from-white via-[#FFF9F5] to-[#FDEEE4] p-1.5 shadow-[0_4px_0_#3B2218,0_10px_20px_-4px_rgba(59,34,24,0.12)]`
    * Inactive link `/leaderboard`: `flex-1 inline-flex items-center justify-center gap-2 py-2 px-3 rounded-xl border-2 border-transparent hover:border-choco-900/20 hover:bg-candy-50 text-xs md:text-sm font-bold text-choco-600 hover:text-choco-900 transition-all`
    * Active tab "Undian Hadiah": `flex-1 inline-flex items-center justify-center gap-2 py-2 px-3 rounded-xl border-2 border-candy-600/50 bg-gradient-to-b from-[#B01F62] via-[#85174A] to-[#6E1239] text-xs md:text-sm font-pixel font-bold text-white shadow-[0_3px_0_#6E1239]`
- **Hero Card:**
  - Ubah font judul menjadi `font-pixel font-bold text-3xl md:text-4xl text-choco-900 tracking-tight`.
  - Badge atas: `inline-flex items-center gap-2 rounded-full border-2 border-choco-900/20 bg-white/90 px-3 py-1 text-xs font-pixel font-bold uppercase tracking-wider text-choco-900 shadow-[0_2px_0_#3B2218]`.
- **Bridge Card Timbal-Balik (Bridge to Leaderboard):**
  - Pasang kartu emas Liga Emas di bawah hero card atau di atas grid:
    * Latar: `bg-gradient-to-b from-[#FFFBEB] via-[#FEF3C7] to-[#FDE68A] border-2 border-choco-900 rounded-3xl p-5 md:p-6 shadow-[0_6px_0_#3B2218]`
    * Ikon: Trophy emas di dalam box rounded-2xl.
    * CTA: Tombol bulat putih atau gold `Lihat Klasemen Liga →` linking ke `/leaderboard`.
- **Kartu Undian (Raffle Cards):**
  - Pastikan setiap item kartu memiliki `border-3 border-choco-900 rounded-[28px] shadow-[0_5px_0_#3B2218]` dengan badge status konsisten.

### 3.2 Rute `/shop` & Ruang Ganti
- Mode selector "Toko vs Ruang Ganti" diselaraskan dengan dock pill arena (border-2 border-choco-900/20, shadow 3D).
- Header Toko & Kartu Item mengadopsi border-2/3 border-choco-900 dengan hard bottom shadow `#3B2218`.

### 3.3 Halaman Pengaturan (`/settings`) & Profil (`/profile`)
- Header section & kartu profil diseragamkan dengan elevasi 3D dan kartu bergradien lembut.
- Semua tombol modal konfirmasi ("Hapus Akun", "Simpan") menggunakan pola tombol taktil ganda (Batal/Kembali vs Aksi utama).

---

## 4. Acceptance Criteria (GIVEN - WHEN - THEN)

1. **GIVEN** user membuka `/raffle` di viewport mobile (360px) maupun desktop (1280px),
   **WHEN** melihat bagian atas halaman,
   **THEN** sub-nav tabs tampil terpusat sebagai pill dock yang identik dengan `/leaderboard`, dengan tab aktif "Undian Hadiah" dan tab tidak aktif "Klasemen Mingguan".

2. **GIVEN** user berada di `/raffle`,
   **WHEN** melihat kartu hero dan kartu bridge,
   **THEN** tipografi menggunakan `font-pixel font-bold`, border dark chocolate tebal `border-2 border-choco-900`, dan bayangan jatuh kaku `shadow-[0_6px_0_#3B2218]`.

3. **GIVEN** seluruh perubahan UI/UX diaplikasikan,
   **WHEN** menjalankan `npm test`,
   **THEN** seluruh 69+ unit tests lulus (`exit 0`), zero accessibility contrast failures, zero missing tailwind theme tokens.
