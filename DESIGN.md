# DESIGN.md — web3min "Sunny World" Design System

Untuk: Google Stitch / implementasi Tailwind v4
Tema: game konsol ceria, siang hari. Maskot: Blobi, ikan blob web3min.
Aturan mutlak: tanpa aset, siluet, warna ikonik, atau nama dari IP pihak ketiga.

## 1. Design Tokens — Warna

### Latar & permukaan
| Token | Hex | Pakai untuk |
|---|---|---|
| `--canvas` | `#F2F7FF` | latar aplikasi utama |
| `--sky-700` | `#0B4FD1` | gradien bawah latar, header dalam |
| `--sky-600` | `#1367E8` | HUD header, langit peta, chip |
| `--sky-500` | `#1F7BFF` | panel biru, header profil |
| `--sky-400` | `#6FA8F5` | aksen langit lembut |
| `--sky-300` | `#8FC2FF` | awan, dekorasi |
| `--sky-200` | `#BBD9FF` | border langit lembut |
| `--sky-100` | `#E4F0FF` | wash di belakang kartu, baris zebra |
| `--paper` | `#FFFFFF` | kartu utama |
| `--cream` | `#FFF7E4` | kartu baca, panel biografi/info |
| `--sand` | `#FFEFC7` | highlight lembut, tooltip |

### Teks (ink)
| Token | Hex |
|---|---|
| `--ink-900` | `#0D2340` |
| `--ink-700` | `#1E3A5F` |
| `--ink-500` | `#4A6580` (muted) |
| `--ink-300` | `#6B839C` (faint) |
| `--on-blue` | `#FFFFFF` |

### Aksen fungsional
| Token | Hex | Shadow/deep | Arti |
|---|---|---|---|
| `--coin` | `#FFC61A` | `#D99400` | CTA utama, hadiah, bintang, XP |
| `--flame` | `#F2841F` | `#C85200` | streak |
| `--ruby` | `#E63329` | `#B01E18` | bahaya, nyawa, jawaban salah |
| `--leaf` | `#34C06A` | `#1E8A49` | benar, selesai, aman |
| `--grape` | `#8B5CF6` | `#6A3FD1` | langka, premium, lencana |
| `--blobi` | `#F26A99` | `#C94A78` | khusus maskot & jejak peta |

### Garis
`--line: #DCE7F5` · `--line-strong: #B9CFE9` · `--line-ink: #0D2340` (border tebal kartu)

### 20 skin world (versi siang, hue dipertahankan)
Setiap rute memakai empat variabel: `--world-banner` (pita/papan nama), `--world-node`
(tombol node), `--world-trail` (garis jalur), `--world-mark` (ornamen), `--world-ink`
(teks di atas banner).

| Rute | Nama | banner | node | trail | mark | ink |
|---|---|---|---|---|---|---|
| u1 | Hutan | `#3FBE7A` | `#59D68F` | `#2A9E62` | `#FFC8D4` | `#0D2340` |
| u2 | Gua kunci | `#8B6FC4` | `#A187D8` | `#FFC61A` | `#FFE08A` | `#0D2340` |
| u3 | Tambang koin | `#F0A52C` | `#FFBB44` | `#D9861A` | `#FFE9A8` | `#0D2340` |
| u4 | Taman NFT | `#A87FD6` | `#BE99E8` | `#E7C8FF` | `#FFD7F2` | `#0D2340` |
| u5 | Pasar DeFi | `#2FB8A6` | `#4CD0BE` | `#7FC9E0` | `#CFF3EA` | `#0D2340` |
| u6 | Lorong waspada | `#D4556F` | `#E86F88` | `#FF9A5C` | `#FFCDA8` | `#0D2340` |
| u7 | Kawah cuan | `#E2574C` | `#F26D62` | `#FF7A5C` | `#FFC98A` | `#0D2340` |
| u8 | Pelabuhan | `#3E9AC4` | `#5BB2D8` | `#8CCDE6` | `#DCF2FB` | `#0D2340` |
| u9 | Karnaval meme | `#F2667F` | `#FF7F95` | `#FFA34D` | `#FFE08A` | `#0D2340` |
| u10 | Hutan baca | `#A3743F` | `#BC8C52` | `#D9BE8C` | `#F6E3BC` | `#0D2340` |
| u11 | Kota | `#D8635A` | `#EC7B70` | `#F2846F` | `#FFD3B8` | `#0D2340` |
| u12 | Rawa APY | `#5FA352` | `#77B96A` | `#8FD17E` | `#DCEFA8` | `#0D2340` |
| u13 | Puncak dingin | `#5FA8CC` | `#7BC0E0` | `#D8F0FA` | `#FFFFFF` | `#0D2340` |
| u14 | Jembatan L2 | `#8670DC` | `#9F8BEC` | `#D5C9FF` | `#FFE08A` | `#0D2340` |
| u15 | Langit airdrop | `#5BA4E8` | `#78B9F2` | `#FFC61A` | `#FFE08A` | `#0D2340` |
| u16 | Benteng stable | `#6B8296` | `#849AAD` | `#A9BECD` | `#E2EDF4` | `#0D2340` |
| u17 | Galeri malam | `#6A4C9C` | `#8264B8` | `#D46AE8` | `#F5B8FF` | `#FFFFFF` |
| u18 | Kastil | `#D4728A` | `#E88AA0` | `#F7A8BA` | `#FFE2E9` | `#0D2340` |
| u19 | Observatorium | `#4A4590` | `#605BA8` | `#FFC61A` | `#FFE9B0` | `#FFFFFF` |
| u20 | Taman waras | `#E29A3E` | `#F0AC54` | `#46BC9A` | `#A8DDA0` | `#0D2340` |

## 2. Tipografi
- Display: **Fredoka** 600/700 (Google Fonts). Huruf tebal membulat, tracking -0.02em.
- Teks: **Plus Jakarta Sans** 500/700/800.
- Mono: **JetBrains Mono** 500 untuk alamat wallet, hash, angka teknis.

| Style | Ukuran/Leading | Bobot | Catatan |
|---|---|---|---|
| Display XL | 34/40 | Fredoka 700 | judul hasil & splash |
| Display L | 28/34 | Fredoka 700 | judul layar |
| H1 | 24/30 | Fredoka 600 | judul kartu besar |
| H2 | 20/26 | Jakarta 800 | judul seksi |
| H3 | 17/22 | Jakarta 700 | judul kartu |
| Body | 15/24 | Jakarta 500 | teks umum |
| Read | 16/26 | Jakarta 500 | badan pelajaran & kisah |
| Small | 13/18 | Jakarta 600 | meta |
| Label | 11/14, tracking 0.08em, UPPERCASE | Jakarta 800 | pita, kategori |
| Numeric | tabular-nums | Jakarta 800 | HUD, skor |

## 3. Bentuk, Elevasi, Grid
- Radius: `sm 10` · `md 14` · `lg 20` · `xl 26` · `2xl 32` · `pill 999`.
- Border kartu: 2px `--line-strong` (`#B9CFE9`); kartu penting 3px `--ink-900` opsional.
- Elevasi tactile:
  - `press-1`: `0 3px 0 <deep>`
  - `press-2`: `0 5px 0 <deep>, 0 12px 20px -10px rgba(9,48,102,.3)`
  - `card`: `0 6px 0 #C8DBF0, 0 18px 34px -18px rgba(9,48,102,.35)`
  - Gloss atas: `inset 0 3px 0 rgba(255,255,255,.55)`
- Spasi: kelipatan 4. Padding kartu 20 (mobile) / 24 (desktop). Gap seksi 16/24.
- Grid: mobile 1 kolom, padding 16. Desktop `248px sidebar | max 768px konten | 320px rail`.

## 4. Motion
| Nama | Durasi | Easing | Pakai |
|---|---|---|---|
| pop | 200ms | `cubic-bezier(.34,1.56,.64,1)` | modal, chip, node |
| press | 120ms | `cubic-bezier(.2,0,0,1)` | tombol ditekan |
| float | 2.8s loop | ease-in-out | Blobi idle, ±6px |
| wiggle | 1.6s loop | ease-in-out | Blobi wave, ±3° |
| shake | 280ms | ease-in-out | jawaban salah, ±6px |
| coin-pop | 600ms | pop | perolehan bintang/tiket |
| confetti | 1.2s | linear | layar hasil |
Semua loop berhenti pada `prefers-reduced-motion: reduce`.
