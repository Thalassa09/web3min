# RENCANA: Supporter Rp 9.999 + QRIS GatePay + Badge OG

Status: **MENUNGGU KEPUTUSAN** — belum ada kode yang ditulis.

## Fakta hasil recon (terverifikasi, bukan asumsi)

| Yang dicek | Temuan |
|---|---|
| Kode pembayaran | **Nol.** Tidak ada gateway, tabel order, atau webhook sama sekali |
| `profiles` | Tidak ada `is_supporter`. Kolom sekarang: id, username, twitter, bio, created_at, discord, last_wallet_address, username_censored, account_type, updated_at, is_admin, last_active_at |
| Nyawa | `MAX_HEARTS = 5`, pulih otomatis 1 per 20 menit, isi ulang **80 koin** |
| Refill gratis | **TIDAK ADA.** Tidak ada kolom/batas harian apa pun di `progress` |
| Tiket undian | `buy_tickets`: 10 koin/tiket, `enter_raffle` potong dari `progress.raffle_tickets` |
| Badge | `progress.badges[]` (localStorage, bisa dipalsukan) + `user_limited_items` |
| URL profil publik | **TIDAK ADA.** `/profile` = halaman sendiri, wajib login |
| OG | Statis `og.jpg` + `site.json`, di-inject middleware `grok-pwa.ts` |
| Pola API server | `server/api/*.post.ts` (h3 `defineEventHandler`) |

## Cara kerja GatePay (dari dokumentasi resminya)

- GatePay **mengubah QRIS statis milikmu jadi QRIS dinamis**. Wajib sudah punya QRIS merchant sendiri.
- `POST /api/orders` (header `x-api-key`) → balas `qris`, `checkout_url`, `unique_amount`.
- Webhook: `x-signature = HMAC-SHA256(raw_body, callback_secret)` → **wajib verifikasi raw body**.
- Status: `pending · paid · expired · cancelled`.
- Ada popup `snap.js` (`GatePay.pay(orderId, callbacks)`) — tidak perlu redirect keluar.

### ⚠️ Risiko GatePay yang harus kamu tahu
1. **Deteksi pembayaran tidak resmi.** ShopeePay (cookie) & GoPay GoBiz pakai API internal — bisa expired, ada risiko ToS akun. APK Catcher butuh HP Android menyala.
2. **GatePay bukan PSP berlisensi BI.** Uang langsung masuk ke QRIS-mu (bagus: tidak ada dana ditahan), tapi tidak ada perlindungan pembeli.
3. **Deteksi bisa gagal** → user sudah bayar tapi supporter tidak aktif. Karena itu **admin WAJIB bisa aktifkan supporter manual** (masuk rencana Langkah 6b).

## Blocker hukum (sudah kamu terima, dicatat di sini)

Tiket undian berbayar = unsur perjudian (UU 7/1974). Gateway komersial (Midtrans/Xendit) menolak merchant jenis ini; GatePay tidak menyeleksi, tapi risiko ditanggung kamu. Ditandai di `AGENTS.md` untuk dicek manusia.

---

## Langkah

### Langkah 1 — Skema database supporter · risiko RENDAH
- `profiles.is_supporter boolean not null default false`
- `profiles.supporter_since timestamptz`
- `profiles.supporter_expires_at timestamptz` (**NULL = selamanya** — mendukung lifetime & bulanan sekaligus)
- Tabel `supporter_orders`: `order_id` (PK), `user_id`, `reference` (unik), `base_amount`, `unique_amount`, `status`, `created_at`, `paid_at`, `raw jsonb`
- RLS: user hanya baca order sendiri; **nol policy insert/update** (hanya service role)
- Tes: dry-run dalam transaksi `rollback` + verifikasi `information_schema`

### Langkah 2 — RPC status supporter · risiko RENDAH
- `get_my_supporter_status()` → `{is_supporter, expires_at, is_lifetime}`
- Dipakai klien; **server tetap sumber kebenaran** (badge tidak dari localStorage)

### Langkah 3 — Refill nyawa gratis harian · risiko SEDANG (ekonomi)
- `progress.free_refill_date date`, `progress.free_refill_count int`
- RPC `refill_hearts_free()`: batas **2×/hari** user biasa, **4×/hari** supporter (reset saat tanggal berganti, zona Asia/Jakarta)
- Tombol baru di `/shop` + sisa kuota hari ini
- Tes: panggil 3× → panggilan ke-3 ditolak; sebagai supporter → 5× ditolak

### Langkah 4 — Tiket undian ×3 untuk supporter · risiko SEDANG (ekonomi)
- `buy_tickets(p_count)`: supporter → `raffle_tickets + (p_count * 3)`, biaya tetap
- `ledger` mencatat bonus terpisah supaya audit jelas
- Tes: beli 1 tiket sebagai supporter → saldo +3

### Langkah 5 — Server: buat order GatePay · risiko SEDANG
- `POST /api/supporter/create-order` — verifikasi JWT user, buat order ke GatePay, simpan ke `supporter_orders`
- Env baru: `GATEPAY_API_KEY` (server-only, tidak pernah ke bundle)
- Tes: order muncul di dashboard GatePay

### Langkah 6 — Server: webhook GatePay · risiko **TINGGI (uang)**
- `POST /api/supporter/webhook` — verifikasi `HMAC-SHA256(raw_body, GATEPAY_CALLBACK_SECRET)`
- **Idempoten**: `order_id` diproses sekali; cek `unique_amount` cocok dengan order tersimpan
- Aktifkan supporter hanya setelah verifikasi lolos
- Tes: signature salah → 401; signature benar → aktif; kirim 2× → tidak dobel

### Langkah 6b — Admin aktifkan supporter manual · risiko RENDAH
- RPC `admin_grant_supporter(p_username, p_days)` di-gate `is_admin()`
- Wajib ada karena deteksi GatePay bisa gagal → jangan sampai user bayar tapi tidak dapat apa-apa
- Dicatat di `activity_log`

### Langkah 7 — Halaman `/supporter` · risiko SEDANG
- Kartu harga, tombol bayar, popup `snap.js`
- State lengkap: idle → pending (countdown) → paid → aktif; gagal/expired + "Coba lagi"
- Polling status sebagai cadangan kalau webhook telat
- **Copy harga**: hanya tulis "dari Rp 30.000" kalau produknya memang pernah dijual segitu — kalau tidak, itu iklan menyesatkan (UU Perlindungan Konsumen)

### Langkah 8 — Badge OG di dalam app · risiko RENDAH
- Komponen badge di `/profile` + `/leaderboard`
- Sumber: `profiles.is_supporter` (server), bukan localStorage
- Warna: pakai token yang sudah ada, kontras ≥4.5:1, selalu ikon + teks

### Langkah 9 — URL profil publik `/u/$username` · risiko SEDANG (privasi)
- Halaman publik: username, XP, streak, badge, unit selesai
- **Butuh keputusanmu**: data apa yang boleh publik + opsi sembunyikan

### Langkah 10 — OG image dinamis · risiko SEDANG (dependency baru)
- Butuh generator PNG server-side (crawler tidak menjalankan JS; SVG tidak didukung)
- Kandidat: `@vercel/og` (~2 MB) — menambah dependency; alternatif: 1 gambar OG statis "Supporter"
- Middleware inject tag OG untuk `/u/*`

### Langkah 11 — Gate + rilis
- `typecheck` 0 · `test:unit` · `check:curriculum` · `audit:security` · `build` exit 0
- Uji 360/430px, tap target ≥44px
- Commit conventional + update `progress.md`

---

## Yang harus kamu siapkan sendiri (aku tidak bisa)

1. **QRIS statis merchant** — dari DANA Bisnis / GoPay Merchant / ShopeePay. GatePay butuh string QRIS-nya (bukan gambar).
2. **Akun GatePay** → ambil `API key` + `Callback Secret`.
3. Pasang di Vercel: `GATEPAY_API_KEY`, `GATEPAY_CALLBACK_SECRET` (Production).
4. Isi Notify URL di dashboard GatePay → `https://web3min.com/api/supporter/webhook`

## Urutan pengerjaan yang kusarankan
Langkah 1 → 2 → 6b (fondasi + jaring aman) → 5 → 6 (pembayaran) → 3 → 4 (benefit) → 7 (UI) → 8 → 9 → 10.
Alasan: webhook (6) dan admin manual (6b) harus ada **sebelum** halaman jualan dibuka, supaya tidak ada pembayaran yang tidak bisa diproses.
