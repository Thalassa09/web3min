import type { Unit } from "@/lib/curriculum";
import { c, tf, blank, match, order, tip, L } from "@/lib/curriculum";

export const LATER_UNITS: Unit[] = [
  {
    id: "u14",
    index: 14,
    title: "L2 & jembatan",
    subtitle: "Murah gas, mahal salah jaringan",
    color: "blue",
    lessons: [
      L("u14", "u14-l1", "lesson", "Apa itu L2", "Di atas Ethereum, bukan saingan random.", "layers", [
        tip("u14l1t", "L2 itu jalur cepet di atas L1.", "Ethereum (L1) aman tapi gas bisa mahal. Layer 2 (Arbitrum, Base, Optimism, zkSync) nampung banyak tx, trus 'setor PR' ke L1. Kamu tetep di ekosistem ETH — cuma lapisannya beda. Bukan alasan kirim ke alamat rantai lain.", {
          points: [
            "L2 inherit keamanan L1 — seberapa kuat tergantung jenis rollup.",
            "Saldo di Base ≠ saldo di Arbitrum. Alamatnya bisa sama, jaringannya nggak.",
            "Explorer L2 (basescan, arbiscan) beda sama etherscan. Cek jaringannya.",
          ],
          example: "USDT di Ethereum nggak otomatis ada di Base. Harus di-bridge atau beli di jaringan itu.",
          remember: "Alamat sama, jaringan beda, duit nggak nyambung sendiri.",
        }),
        c("u14l1q1", "Layer 2 itu apa?", ["Jalur cepet di atas L1", "Bank sentral", "Seed phrase cadangan", "NFT"], 0, "Lapis, bukan bank."),
        tf("u14l1q2", "Saldo ETH di Base sama dengan saldo di Arbitrum.", false, "Jaringan beda."),
        blank("u14l1q3", "Jaringan dasar Ethereum disebut ___.", ["L1", "CEX", "P2P", "NFT"], 0, "L1."),
        c("u14l1q4", "Sebelum transfer, yang wajib dicek…", ["Jaringan + token + alamat", "PFP penerima", "Jumlah like", "Warna candle"], 0, "Tiga-tiganya."),
      ]),
      L("u14", "u14-l2", "lesson", "Bridge", "Kunci di sini, cetak di sana — atau jebakan.", "link", [
        tip("u14l2t", "Jembatan resmi vs jembatan umpan.", "Bridge: aset dikunci/dibakar di rantai A, dicetak di rantai B. Yang palsu: situs mirip, kontrak drain. Bookmark bridge resmi (portal rantai / docs). Jangan dari iklan atau DM 'support'.", {
          points: [
            "Waktu bridge bisa menit sampe jam. 'Instan + bonus 20%' aneh.",
            "Fake token hasil bridge liar: nama sama, kontrak beda, nggak bisa ditarik balik.",
            "Bridge hack itu nyata, kok. Jangan all-in lewat jembatan random.",
          ],
          example: "Iklan 'official arb bridge' minta approve USDT unlimited. Bukan portal. Drainer.",
          remember: "Ketik URL sendiri, jangan dari iklan.",
          proofs: ["scam-drainer", "rugi-nuked"],
        }),
        tf("u14l2q1", "Bridge dari iklan Google selalu resmi.", false, "Iklan sering phishing."),
        c("u14l2q2", "Token hasil bridge liar biasanya…", ["Nama sama, kontrak beda, bisa macet", "Lebih aman dari asli", "Bisa ditarik ke bank", "Sama kayak BTC"], 0, "Palsu."),
        c("u14l2q3", "Bonus 20% kalo bridge sekarang. Gimana?", ["Umpan", "Standar L2", "Pajak", "Gas resmi"], 0, "Umpan."),
      ]),
      L("u14", "u14-l3", "lesson", "Salah jaringan", "Tx sukses, duit nyasar.", "siren", [
        tip("u14l3t", "Sukses di explorer ≠ sampe di tujuan.", "Kirim USDT ERC-20 ke alamat yang cuma nunggu BEP-20, atau tarik CEX ke L2 yang belum mereka support. Tx 'success'. Penerima nggak liat. Recovery mahal, kadang mustahil.", {
          points: [
            "CEX: cek jaringan tarik/setor yang mereka buka.",
            "Wallet: pilih jaringan dulu, baru token.",
            "Tes jumlah kecil. Baru sisanya.",
          ],
          example: "Tarik USDT 'ke Base' padahal CEX cuma buka ERC-20. Hash hijau. Saldo Base kosong.",
          remember: "Tes kecil, jaringan dulu.",
        }),
        c("u14l3q1", "Tx sukses tapi saldo kosong biasanya kenapa?", ["Salah jaringan / token", "Hacked NASA", "Airdrop", "Pajak"], 0, "Nyasar."),
        tf("u14l3q2", "Semua CEX support semua L2 otomatis.", false, "Daftar jaringannya terbatas."),
        order("u14l3q3", "Urutin yang waras.", ["Pilih", "jaringan", "tes", "kecil"], "Tes dulu."),
      ]),
      L("u14", "u14-chest", "chest", "Peti unit 14", "Jembatan yang kamu cek.", "gift", [], { xp: 0, gems: 22 }),
      L("u14", "u14-l4", "lesson", "Gas L2", "Murah bukan gratis, dan bisa nyangkut.", "fuel", [
        tip("u14l4t", "Gas native beda tiap L2.", "Base/Arbitrum butuh ETH di jaringan itu — bukan ETH mainnet di dompet yang sama. Tanpa gas native, token 'terkunci kelihatan' tapi nggak bisa dipindah. Isi gas dulu, baru eksperimen.", {
          points: [
            "Punya token tanpa gas = macet.",
            "Gas spike L2 jarang sebrutal L1, tapi tetep ada saat ramai.",
            "Jangan spam tx gagal. Tiap klik bisa makan.",
          ],
          example: "Airdrop di Base. Wallet cuma punya token itu. Klik claim gagal. Isi $2 ETH Base dulu.",
          remember: "Gas native dulu, token belakangan.",
        }),
        tf("u14l4q1", "ETH di Ethereum mainnet bisa jadi gas di Base otomatis.", false, "Harus ada ETH di Base."),
        c("u14l4q2", "Token kelihatan tapi nggak bisa dikirim…", ["Sering karena gas native kosong", "Wajib burn", "Honeypot selalu", "Pajak"], 0, "Isi gas."),
        blank("u14l4q3", "Ongkos tx disebut ___.", ["gas", "floor", "airdrop", "LP"], 0, "Gas."),
      ]),
      L("u14", "u14-cp", "checkpoint", "Ujian unit 14", "Jaringan, jembatan, tes kecil.", "flag", [
        tip("u14cpt", "Ulangan L2", "Alamat sama bukan saldo sama. Bridge dari bookmark. Tes kecil.", {
          points: ["L2 ≠ L1.", "Iklan bridge = curiga.", "Gas native dulu."],
        }),
        tf("u14cp1", "Saldo Base = saldo Arbitrum.", false, "Nggak."),
        c("u14cp2", "Bridge dari DM support…", ["Umpan", "Resmi", "Lebih cepet", "L1"], 0, "Umpan."),
        blank("u14cp3", "Ongkos L2 tetep disebut ___.", ["gas", "royalti", "floor", "P2P"], 0, "Gas."),
        c("u14cp4", "Cara paling waras pindah rantai?", ["Tes kecil di jembatan resmi", "All-in dari iklan", "Share seed ke bridge", "Kirim ke rantai random"], 0, "Tes kecil."),
      ]),
    ],
  },
  {
    id: "u15",
    index: 15,
    title: "Airdrop",
    subtitle: "Hadiah, kerjaan, atau umpan seed",
    color: "purple",
    lessons: [
      L("u15", "u15-l1", "lesson", "Snapshot", "Foto saldo di blok tertentu.", "image", [
        tip("u15l1t", "Airdrop resmi nunggu snapshot.", "Proyek foto siapa yang pake / pegang di waktu tertentu, trus bagi token. Bukan 'kirim dulu baru dikali'. Kalo minta transfer buat 'verifikasi airdrop', itu umpan.", {
          points: [
            "Resmi: claim di situs bookmark, tanda tangan pesan (bukan transfer).",
            "Syarat sybil: satu orang banyak wallet palsu bisa didiskualifikasi.",
            "Token airdrop bisa dump hari pertama. Bukan gaji.",
          ],
          example: "Situs 'claim ARB extra' minta 0.05 ETH 'gas insurance'. Bukan claim. Drainer.",
          remember: "Hadiah nggak minta kamu transfer dulu.",
          proofs: ["drop-arb-18k", "drop-wif-1k5", "drop-met-34k", "drop-uni-ath"],
        }),
        tf("u15l1q1", "Airdrop resmi minta kamu kirim ETH dulu.", false, "Nggak. Itu umpan."),
        c("u15l1q2", "Snapshot itu apa?", ["Foto on-chain di waktu tertentu", "Selfie KTP", "Seed cadangan", "Pajak"], 0, "Foto rantai."),
        c("u15l1q3", "Token airdrop hari pertama…", ["Sering dump. Bukan gaji", "Harga dijamin naik", "Wajib hold selamanya", "Bebas honeypot"], 0, "Dump biasa."),
        c("u15l1q4", "400 UNI di 2020 itu dari mana?", ["Airdrop. Pake Uniswap, modal gas", "All-in futures", "Gaji bursa", "Hadiah DM"], 0, "Pake produk, bukan chart."),
        c("u15l1q5", "2.125 ARB $18 ribu di screenshot itu…", ["Airdrop. Pake L2, bukan all-in chart", "Hasil futures 100x", "Gaji bursa", "Hadiah DM admin"], 0, "Pake rantai, token nyangkut."),
      ]),
      L("u15", "u15-l2", "lesson", "Farm vs sybil", "Kerja on-chain, atau tipu sistem.", "userx", [
        tip("u15l2t", "Farming itu kerja. Sybil itu ulangi diri.", "Pake produk beneran (swap kecil, bridge, NFT mint) bisa kena kriteria. Bikin 200 wallet dari satu HP, pola sama, sering kena filter. Tim bukan bodoh.", {
          points: [
            "Biaya farm (gas, waktu, modal tes) bisa lebih gede dari hadiah.",
            "Akun yang polanya identik gampang kedetect.",
            "Jangan beli 'jasa sybil' — sering scam di atas scam.",
          ],
          example: "20 wallet, 1 jumlah swap, 1 menit berselang. Diskualifikasi massal.",
          remember: "Pake beneran, jangan tebar palsu.",
          proofs: ["drop-hype-dist", "drop-hl-pts", "drop-hl-tab"],
        }),
        c("u15l2q1", "200 wallet pola sama…", ["Sybil. Sering kena saring", "Strategi paus", "Wajib", "Standar L1"], 0, "Sybil."),
        tf("u15l2q2", "Jasa sybil berbayar njamin lolos.", false, "Sering umpan + jejak."),
        blank("u15l2q3", "Banyak akun palsu dari satu orang disebut ___.", ["sybil", "staking", "LP", "gas"], 0, "Sybil."),
      ]),
      L("u15", "u15-l3", "lesson", "Claim palsu", "Tanda tangan yang nyedot.", "lock", [
        tip("u15l3t", "Claim page itu medan perang.", "Phishing klaim: domain 1 huruf beda, pop-up 'increase allowance', permit2, setApprovalForAll buat NFT. Baca apa yang ditandatangani. Simulasi. Revoke.", {
          points: [
            "Pesan 'I am claiming' tanpa transfer biasanya oke. `permit` / `increaseAllowance` curiga.",
            "Google ads di atas hasil resmi = umpan klasik.",
            "Abis claim, cek izin. Cabut yang aneh.",
          ],
          example: "claim-hyperliquid.help minta permit USDC. Bukan docs. Saldo cabut.",
          remember: "Baca tanda tangan, bookmark.",
          proofs: ["warn-hl-phish", "drop-arb-claim", "scam-drainer"],
        }),
        tf("u15l3q1", "Semua tombol Claim aman asal logo mirip.", false, "Domain & izin dulu."),
        c("u15l3q2", "Permit / increaseAllowance di halaman klaim…", ["Curiga, bisa nyedot", "Wajib gas", "Standar NFT", "Pajak"], 0, "Curiga."),
        c("u15l3q3", "Abis eksperimen klaim, ngapain?", ["Revoke izin aneh", "Share seed", "Approve unlimited lagi", "All-in"], 0, "Revoke."),
      ]),
      L("u15", "u15-chest", "chest", "Peti unit 15", "Yang nggak transfer dulu.", "gift", [], { xp: 0, gems: 22 }),
      L("u15", "u15-l4", "lesson", "Poin bukan gaji", "Musim farm bisa rugi.", "coins", [
        tip("u15l4t", "Points season = lotre berbayar.", "Kamu bayar gas dan waktu. Hadiah bisa kecil, bisa nol, bisa kena sybil. Hitung biaya. Kalo 'poin' dijual di grup, itu pasar spekulasi — bisa rugi sebelum token ada.", {
          points: [
            "Jangan utang buat farm.",
            "Jangan korbankan keamanan (seed di VPS abal) demi poin.",
            "Kalo biaya > harapan waras, berhenti.",
          ],
          example: "Gas Rp 2 juta, airdrop cair Rp 400 ribu. Kerja, tapi rugi.",
          remember: "Poin bukan slip gaji.",
          proofs: ["drop-met-34k", "drop-dydx-32k", "drop-top50", "drop-first-2k"],
        }),
        c("u15l4q1", "Utang buat farm airdrop…", ["Bahaya. Poin bukan gaji", "Strategi MM", "Wajib", "Asuransi"], 0, "Jangan utang, deh."),
        tf("u15l4q2", "Poin di grup selalu bisa dicairin.", false, "Spekulasi."),
        c("u15l4q3", "Kalo gas udah lebih gede dari harapan…", ["Berhenti", "Naikin 10x", "Pinjam", "Share seed"], 0, "Berhenti."),
      ]),
      L("u15", "u15-cp", "checkpoint", "Ujian unit 15", "Snapshot, sybil, izin.", "flag", [
        tip("u15cpt", "Ulangan airdrop", "Nggak transfer dulu. Nggak sybil massal. Baca tanda tangan.", {
          points: ["Snapshot.", "Sybil.", "Claim palsu.", "Poin ≠ gaji."],
          proofs: ["drop-uni-400", "drop-arb-8k", "warn-hl-phish"],
        }),
        tf("u15cp1", "Klaim resmi minta 0.1 ETH dulu.", false, "Umpan."),
        blank("u15cp2", "Banyak wallet palsu: ___.", ["sybil", "rollup", "floor", "gas"], 0, "Sybil."),
        c("u15cp3", "Halaman klaim minta permit USDC…", ["Curiga drainer", "Standar", "L2", "Pajak"], 0, "Drainer."),
        c("u15cp4", "Poin season itu…", ["Lotre berbayar", "Gaji tetap", "Deposito", "Asuransi"], 0, "Lotre."),
      ]),
    ],
  },
  {
    id: "u16",
    index: 16,
    title: "Stablecoin",
    subtitle: "Namanya stabil. Ceritanya nggak selalu",
    color: "gold",
    lessons: [
      L("u16", "u16-l1", "lesson", "Tiga jenis", "Fiat, kripto, algoritma.", "coins", [
        tip("u16l1t", "Stable bukan sihir.", "USDT/USDC: klaim di-back aset (fiat, surat utang) — kamu percaya penerbit dan bank. DAI/sejenis: lebih on-chain, tetep ada risiko jaminan. Algoritmik (UST dulu): janji peg tanpa kas yang cukup — udah meledak.", {
          points: [
            "Penerbit bisa beku alamat (USDT/USDC).",
            "Depeg = harga lepas dari $1. Bisa sebentar, bisa mati.",
            "Nama 'USD' di token nggak njamin $1.",
          ],
          example: "UST 2022: $1 → nyaris $0. Orang kira deposito. Bukan.",
          remember: "Stabil itu janji, dan janji bisa pecah.",
        }),
        match("u16l1q1", "Jenisnya pasangin.", [
          { left: "USDT/USDC", right: "Penerbit + cadangan" },
          { left: "DAI", right: "Jaminan on-chain" },
          { left: "UST (lama)", right: "Algoritma, pecah" },
        ]),
        tf("u16l1q2", "Tulisan USD di nama token njamin $1 selamanya.", false, "Nggak."),
        c("u16l1q3", "Penerbit USDT bisa ngapain?", ["Beku alamat tertentu", "Cetak BTC", "Hapus Ethereum", "Matikan gas"], 0, "Beku."),
      ]),
      L("u16", "u16-l2", "lesson", "Depeg", "Saat $1 nggak $1.", "siren", [
        tip("u16l2t", "Depeg itu ujian, bukan glitch.", "Kalo pasar panik, stable bisa $0.98 atau $0.20. Yang 'deposito 20% APY' di stable aneh biasanya yang pertama pecah. Diversifikasi, jangan all-in satu ticker.", {
          points: [
            "Spread di CEX vs DEX bisa beda saat kacau.",
            "Likuiditas hilang saat paling dibutuhkan.",
            "Parkir darurat: pecah ke beberapa stable / fiat off-ramp — bukan ke memecoin.",
          ],
          example: "APY 20% di UST 'aman'. Pecah. Yang lari telat dapet sisa.",
          remember: "Bunga gila di stable = umpan.",
          proofs: ["rugi-nuked", "rugi-roundtrip"],
        }),
        c("u16l2q1", "Stable bayar 20% setahun tanpa sumber jelas…", ["Curiga depeg bait", "Deposito bank", "Standar USDC", "L2"], 0, "Umpan."),
        tf("u16l2q2", "Semua stable selalu $1 di semua pasar.", false, "Bisa depeg."),
        blank("u16l2q3", "Harga lepas dari $1 disebut ___.", ["depeg", "airdrop", "mint", "gas"], 0, "Depeg."),
      ]),
      L("u16", "u16-l3", "lesson", "Parkir waras", "Bukan di bawah bantal.", "bank", [
        tip("u16l3t", "Stable masih kripto.", "Sebenernya masih kripto. Ada risiko penerbit, kontrak, CEX, depeg. Buat gaji sewa, lebih aman off-ramp sebagian ke rekening. Yang diparkir on-chain: pecah, CEX berizin + wallet sendiri, jangan satu keranjang.", {
          points: [
            "Jangan gaji setahun di satu USDT di satu CEX.",
            "USDC/USDT bisa beda likuiditas di L2 tertentu.",
            "Yield stable 2–8% dari fee pinjam lebih masuk akal daripada 2% per hari.",
          ],
          example: "Resto parkir omset seminggu di USDT. CEX ditahan. Operasional macet.",
          remember: "Uang hidup ≠ eksperimen.",
        }),
        c("u16l3q1", "Omset sewa bulan ini paling waras…", ["Sebagian di rekening, bukan all-in stable", "All-in UST-like", "Memecoin bluechip", "Bridge random"], 0, "Uang hidup."),
        tf("u16l3q2", "Stablecoin = cash di ATM.", false, "Masih ada jembatan dan risiko."),
        c("u16l3q3", "Yield 2% per hari di USDT…", ["Hampir pasti skema", "Suku bunga BI", "Standar DAI", "Pajak"], 0, "Skema."),
      ]),
      L("u16", "u16-chest", "chest", "Peti unit 16", "Janji $1 yang kamu curigai.", "gift", [], { xp: 0, gems: 22 }),
      L("u16", "u16-l4", "lesson", "Frozen & blacklist", "Penerbit punya tombol.", "lock", [
        tip("u16l4t", "Bukan bank sentral, tapi bisa beku.", "USDT/USDC punya fungsi blacklist. Alamat kena sanksi / hack sering dibekukan. Itu fitur penerbit, bukan bug. Kalo kamu butuh sensor-resistant, pahami konsekuensinya — bukan berarti 'pindah ke honeypot'.", {
          points: [
            "Self-custody nggak ngilangin blacklist token.",
            "Pilih alat sesuai tujuan: belanja sehari-hari vs resistance.",
            "Jangan cuci dana haram. Jejak ada.",
          ],
          example: "Pencurian gede: penerbit beku USDT di alamat pencuri. Korban kadang tertolong, kadang nggak.",
          remember: "Token berizin = ada tombol.",
        }),
        tf("u16l4q1", "Self-custody bikin USDT kebal beku.", false, "Penerbit masih bisa beku token."),
        c("u16l4q2", "Blacklist di stable itu…", ["Fitur penerbit", "Honeypot selalu", "L2", "NFT"], 0, "Fitur."),
        c("u16l4q3", "Dana haram ke stable…", ["Jejak ada. Jangan", "Hilang otomatis", "L2 hapus jejak", "Gas membersihin"], 0, "Jangan."),
      ]),
      L("u16", "u16-cp", "checkpoint", "Ujian unit 16", "Janji, depeg, tombol.", "flag", [
        tip("u16cpt", "Ulangan stable", "Janji $1. Bunga gila umpan. Penerbit punya tombol.", {
          points: ["Jenis cadangan.", "Depeg.", "Uang hidup."],
        }),
        blank("u16cp1", "Lepas dari $1: ___.", ["depeg", "gas", "floor", "sybil"], 0, "Depeg."),
        tf("u16cp2", "APY 20% di stable tanpa sumber = deposito.", false, "Umpan."),
        c("u16cp3", "USDT di wallet sendiri…", ["Masih bisa dibekukan penerbit", "Kebal total", "Sama kayak cash", "Mustahil dilacak"], 0, "Tombol ada."),
        c("u16cp4", "Sewa rumah di all-in satu stable CEX…", ["Risiko operasional", "Paling profesional", "Wajib", "L2"], 0, "Risiko."),
      ]),
    ],
  },
  {
    id: "u17",
    index: 17,
    title: "NFT lanjutan",
    subtitle: "Floor bukan ATM, wash bukan volume",
    color: "teal",
    lessons: [
      L("u17", "u17-l1", "lesson", "Floor illusion", "Harga lantai bisa kertas.", "image", [
        tip("u17l1t", "Floor price bukan kas.", "5 listing di harga itu, 1 pembeli. Wash trading: wallet putar jual-beli sendiri biar 'volume'. Royalty bisa di-bypass. JPEG di timeline bukan jaminan laku.", {
          points: [
            "Likuiditas NFT lebih tipis dari token.",
            "Traits 'rare' nggak berguna kalo nggak ada pembeli.",
            "Utang buat mint = utang buat lotre.",
          ],
          example: "Floor 1 ETH. Kamu listing 1 ETH. Nggak laku 3 bulan. Floor cuma harapan.",
          remember: "Floor = listing, bukan ATM.",
          proofs: ["rugi-paper", "cuan-knots"],
        }),
        tf("u17l1q1", "Floor 1 ETH artinya kamu pasti cair 1 ETH.", false, "Belum tentu ada pembeli."),
        c("u17l1q2", "Wash trading itu…", ["Volume palsu dari wallet putar", "Audit", "L2", "Pajak"], 0, "Palsu."),
        c("u17l1q3", "Utang buat mint NFT…", ["Lotre berutang. Jangan", "Bluechip wajib", "Asuransi", "DYOR selesai"], 0, "Jangan, deh."),
      ]),
      L("u17", "u17-l2", "lesson", "Mint jebakan", "Free mint yang mahal.", "gift", [
        tip("u17l2t", "Free mint minta izin aneh = umpan.", "setApprovalForAll ke kontrak random, 'sign to check whitelist', drain NFT lama kamu. Situs mint resmi dari bookmark / akun terverifikasi. Bukan dari reply bot.", {
          points: [
            "Free mint tetep butuh gas. Kalo minta transfer 0.2 'fee', curiga.",
            "Kontrak mint yang bisa mint unlimited abis itu = rug versi NFT.",
            "Metadata di server proyek bisa diganti. On-chain image lebih mahal, lebih jarang.",
          ],
          example: "Free mint PFP. Approve all. Besok BAYC kamu pindah.",
          remember: "Izin NFT = kunci koleksi.",
          proofs: ["scam-drainer"],
        }),
        c("u17l2q1", "setApprovalForAll ke mint random…", ["Bisa cabut NFT lama", "Wajib whitelist", "Gas resmi", "L2"], 0, "Bahaya."),
        tf("u17l2q2", "Free mint nggak pernah butuh gas.", false, "Gas tetep. Transfer 'fee' curiga."),
        blank("u17l2q3", "Izin semua NFT ke kontrak disebut setApproval___.", ["ForAll", "Unlimited", "Bridge", "Sybil"], 0, "ForAll."),
      ]),
      L("u17", "u17-l3", "lesson", "Utility vs cerita", "Akses, atau JPEG + hopium.", "badge", [
        tip("u17l3t", "Tanya: ini tiket apa?", "Utility waras: akses, lisensi, keanggotaan yang bisa dicek. Utility palsu: 'metaverse sebentar lagi', 'token menyusul', roadmap 4 tahun. Boleh koleksi karena suka. Jangan karena janji ATM.", {
          points: [
            "Kalo utility bisa dicabut admin, itu izin, bukan milik.",
            "Royalti artis sering nggak sampe kalo marketplace bypass.",
            "Hold PFP nggak bikin kamu investor VC.",
          ],
          example: "NFT 'member resto' yang nggak diterima kasir. Itu JPEG.",
          remember: "Suka boleh, ATM jangan harap.",
        }),
        c("u17l3q1", "Utility yang bisa dicabut admin…", ["Izin, bukan milik mutlak", "Sama kayak BTC", "Asuransi", "L1"], 0, "Izin."),
        tf("u17l3q2", "Pegang PFP = kamu investor resmi proyek.", false, "Nggak otomatis."),
        c("u17l3q3", "Alasan paling waras beli NFT?", ["Suka / paham risiko hangus", "ATM minggu ini", "Utang modal", "Copy paus 50x"], 0, "Suka + risiko."),
      ]),
      L("u17", "u17-chest", "chest", "Peti unit 17", "Yang nggak ngira floor ATM.", "gift", [], { xp: 0, gems: 22 }),
      L("u17", "u17-l4", "lesson", "Hak & salinan", "Right-click bukan transfer.", "lock", [
        tip("u17l4t", "On-chain ≠ hak cipta otomatis.", "Punya NFT biasanya punya token. Hak pake gambar tergantung lisensi. Right-click save bukan nyuri token. Jangan bayar 'pengacara NFT' random di DM.", {
          points: [
            "Cek lisensi koleksi (CC0, terbatas, nggak ada).",
            "Screenshot bukan bukti milik on-chain.",
            "DM 'kamu langgar hak, bayar USDT' = pemerasan klasik.",
          ],
          example: "Bot DM: 'NFT kamu plagiat, bayar 0.3 ETH ke lunas'. Blokir.",
          remember: "Token di rantai, ancaman di DM bukan surat resmi.",
        }),
        tf("u17l4q1", "Punya NFT selalu punya hak cipta komersial penuh.", false, "Tergantung lisensi."),
        c("u17l4q2", "DM minta USDT karena 'plagiat'…", ["Pemerasan. Blokir", "Pengadilan", "Pajak", "L2"], 0, "Blokir."),
        c("u17l4q3", "Right-click save itu…", ["Nggak mindahin token", "Nyuri BTC", "Approve all", "Bridge"], 0, "Bukan transfer."),
      ]),
      L("u17", "u17-cp", "checkpoint", "Ujian unit 17", "Floor, izin, cerita.", "flag", [
        tip("u17cpt", "Ulangan NFT", "Floor bukan ATM. Izin berbahaya. Suka boleh.", {
          points: ["Wash.", "ApprovalForAll.", "Utility dicabut."],
        }),
        tf("u17cp1", "Floor = ATM.", false, "Listing, bukan kas."),
        blank("u17cp2", "Volume putar sendiri: ___ trading.", ["wash", "spot", "gas", "sybil"], 0, "Wash."),
        c("u17cp3", "Mint minta setApprovalForAll…", ["Bahaya", "Wajib", "Pajak", "L1"], 0, "Bahaya."),
        c("u17cp4", "DM plagiat minta ETH…", ["Pemerasan", "PN", "CEX", "Bridge"], 0, "Pemerasan."),
      ]),
    ],
  },
  {
    id: "u18",
    index: 18,
    title: "Keamanan keras",
    subtitle: "Hardware, multisig, simulasi — bukan semprot doa",
    color: "red",
    lessons: [
      L("u18", "u18-l1", "lesson", "Hardware wallet", "Kunci di kotak, bukan di HP.", "key", [
        tip("u18l1t", "Hot wallet buat jajan. Cold buat tabungan.", "Hardware wallet tanda tangan di perangkat. Seed ditulis di kertas/metal, offline. Jangan pernah ketik seed ke PC 'buat import'. Firmware dari situs resmi, bukan iklan.", {
          points: [
            "HP + MetaMask = hot. Cukup buat modal main, bukan uang tidur.",
            "Beli hardware dari toko resmi. Second-hand = risiko udah diinisialisasi orang.",
            "PIN & passphrase tambahan kalo kamu paham risikonya (lupa = hangus).",
          ],
          example: "Seed diketik di 'sync ledger' palsu. Kotaknya sia-sia.",
          remember: "Seed nggak pernah diketik ke web.",
          proofs: ["scam-drainer", "rugi-roundtrip"],
        }),
        tf("u18l1q1", "Hardware wallet boleh diisi seed lewat situs sinkron.", false, "Nggak pernah."),
        c("u18l1q2", "Dompet second-hand yang udah ada seed…", ["Risiko. Inisialisasi sendiri atau jangan", "Lebih premium", "Wajib", "L2"], 0, "Risiko."),
        c("u18l1q3", "Uang tidur paling waras…", ["Cold / hardware, seed offline", "Hot HP all-in", "Screenshot seed di IG", "CEX random"], 0, "Cold."),
      ]),
      L("u18", "u18-l2", "lesson", "Multisig", "Satu kunci bukan satu nyawa.", "lock", [
        tip("u18l2t", "2-dari-3 lebih waras daripada 1-dari-1.", "Multisig: beberapa kunci harus setuju. Cocok kas komunitas, kas usaha, tabungan gede. Salah setup (semua kunci di satu HP) = teater keamanan.", {
          points: [
            "Kunci di lokasi beda. Satu hilang, masih bisa gerak.",
            "Jangan 3 kunci di 3 folder laptop yang sama.",
            "Ada biaya dan kerumitan. Buat Rp 200 ribu, kebanyakan. Buat kas resto, masuk akal.",
          ],
          example: "Kas NFT project 1-dari-1 di HP founder. HP hilang. Kas mati.",
          remember: "Pisah kunci, pisah tempat.",
        }),
        c("u18l2q1", "Multisig 2-dari-3 artinya apa?", ["Dua kunci harus setuju", "Tiga HP wajib identik", "Seed dishare 3 grup", "Gas ×3"], 0, "Ambang."),
        tf("u18l2q2", "Tiga kunci di satu laptop = multisig kuat.", false, "Satu lokasi, satu titik gagal."),
        blank("u18l2q3", "Beberapa kunci harus setuju disebut ___.", ["multisig", "airdrop", "floor", "sybil"], 0, "Multisig."),
      ]),
      L("u18", "u18-l3", "lesson", "Simulasi tx", "Liat sebelum tanda tangan.", "map", [
        tip("u18l3t", "Wallet modern bisa simulasi.", "Rabby/WalletGuard/tenderly nunjukin 'kamu bakal kirim X, izin Y'. Kalo simulasi gagal atau aneh — jangan maksa. Drainer dijual murah. Mereka andalin kamu buru-buru.", {
          points: [
            "Kalo UI janji mint, simulasi nunjukin transfer USDT — tolak.",
            "Blind sign di HP = gelap.",
            "Revoke berkala. Izin lama itu pintu lama.",
          ],
          example: "Kit drainer $210 support 610 wallet. Harga kopi. Korban: tabungan.",
          remember: "Simulasi > rasa FOMO.",
          proofs: ["scam-drainer", "rugi-personal"],
        }),
        c("u18l3q1", "Simulasi nunjukin transfer token padahal 'mint gratis'…", ["Tolak", "Gas", "Lanjut biar cepet", "Share seed"], 0, "Tolak."),
        tf("u18l3q2", "Drainer mahal, jadi jarang.", false, "Ada yang $210. Murah."),
        c("u18l3q3", "Blind sign itu…", ["Tanda tangan tanpa baca", "Audit", "L2", "Pajak"], 0, "Gelap."),
      ]),
      L("u18", "u18-chest", "chest", "Peti unit 18", "Kunci yang nggak diketik.", "gift", [], { xp: 0, gems: 24 }),
      L("u18", "u18-l4", "lesson", "Operasional", "HP hilang, orang dalam, phishing CS.", "shield", [
        tip("u18l4t", "Keamanan itu kebiasaan.", "2FA app (bukan SMS) di CEX. Alamat whitelist tarik. Jangan install APK wallet dari Telegram. CS nggak nelpon minta kode. Backup seed uji (kembalikan ke perangkat kosong) sebelum isi duit gede.", {
          points: [
            "SMS 2FA bisa di-SIM swap.",
            "Screenshot seed di galeri = seed di iCloud/Google.",
            "Orang dalam (temen pegang HP) sering dilupakan.",
          ],
          example: "2FA SMS. Nomor dipindah. CEX dikosongin semalam.",
          remember: "Kebiasaan > alat mahal.",
        }),
        c("u18l4q1", "2FA paling rapuh biasanya…", ["SMS", "App authenticator", "Hardware key", "Multisig"], 0, "SMS."),
        tf("u18l4q2", "Screenshot seed di galeri aman soalnya HP ada PIN.", false, "Backup cloud sering nyala."),
        c("u18l4q3", "Sebelum isi duit gede ke hardware…", ["Uji restore seed di perangkat kosong", "Posting unboxing", "Share PIN", "Skip firmware"], 0, "Uji restore."),
      ]),
      L("u18", "u18-cp", "checkpoint", "Ujian unit 18", "Cold, multi, simulasi.", "flag", [
        tip("u18cpt", "Ulangan keamanan", "Seed offline. Kunci terpisah. Simulasi. 2FA app.", {
          points: ["Hardware.", "Multisig.", "Drainer murah.", "SMS rapuh."],
        }),
        tf("u18cp1", "Ketik seed di web 'official ledger sync' itu prosedur.", false, "Umpan."),
        blank("u18cp2", "Beberapa kunci: ___.", ["multisig", "sybil", "depeg", "floor"], 0, "Multisig."),
        c("u18cp3", "Drainer kit dijual murah artinya…", ["Ancaman massal, bukan elit", "Aman", "Cuma paus", "L2"], 0, "Massal."),
        c("u18cp4", "2FA SMS…", ["Rentan SIM swap", "Terkuat", "Mengganti seed", "Pajak"], 0, "Rentan."),
      ]),
    ],
  },
  {
    id: "u19",
    index: 19,
    title: "Baca on-chain",
    subtitle: "CCTV rantai: label, likuidasi, copy yang nyasar",
    color: "green",
    lessons: [
      L("u19", "u19-l1", "lesson", "Label & jejak", "Nama di explorer bisa salah.", "map", [
        tip("u19l1t", "Label itu petunjuk, bukan KTP.", "Etherscan/Arkham/Nansen nempel nama. Bisa bener, bisa ketinggalan, bisa tipuan. Tx kecil tes, funding dari mixer, pola hop — baca pola, jangan cuma badge 'smart money'.", {
          points: [
            "Satu entitas punya banyak alamat.",
            "Label 'Binance' di alamat hot wallet bukan jaminan tx berikutnya aman.",
            "Copy-paste alamat dari story IG = klasik salah digit.",
          ],
          example: "Wallet berlabel 'smart' dump meme ke kamu. Label lama, niat baru.",
          remember: "Pola > badge.",
          proofs: ["cuan-winter", "cuan-pnut17", "cuan-binance", "cuan-argus2"],
        }),
        tf("u19l1q1", "Label 'smart money' artinya wajib di-copy.", false, "Label bisa usang."),
        c("u19l1q2", "Satu orang…", ["Bisa banyak alamat", "Cuma satu alamat selamanya", "Mustahil hop", "Pasti KYC"], 0, "Banyak."),
        c("u19l1q3", "Alamat dari story IG…", ["Cek ulang karakter", "Langsung all-in", "Lebih resmi", "L2"], 0, "Cek."),
      ]),
      L("u19", "u19-l2", "lesson", "Copy wallet", "Kamu liat entry, bukan kepala.", "userx", [
        tip("u19l2t", "Copy-trade on-chain tetep copy buta.", "Kamu nggak liat hedge di CEX, ukuran vs kekayaan, atau kapan mereka keluar. Wallet $3 juta dari $17 di $PNUT: insider, keberuntungan, atau keduanya. Bukan template gaji.", {
          points: [
            "Yang dipost biasanya yang menang.",
            "Masuk abis mereka = kamu likuiditas.",
            "Bot copy sering kena MEV dan slippage lebih parah.",
          ],
          example: "$17 jadi $3 juta di PNUT, trus berhenti. Kamu datang hari ke-2 pake $17. Cerita beda.",
          remember: "Copy ide, cek risiko, jangan copy ukuran.",
          proofs: ["cuan-pnut17", "cuan-1m-week", "rugi-liqs", "cuan-hl"],
        }),
        c("u19l2q1", "$17 jadi $3 juta artinya…", ["Ada. Bukan template kamu", "Wajib diulang all-in", "Tanpa risiko", "Asuransi"], 0, "Ada, bukan resep."),
        tf("u19l2q2", "Bot copy wallet paus ngilangin slippage.", false, "Sering lebih parah."),
        c("u19l2q3", "Masuk abis wallet terkenal beli…", ["Kamu sering jadi exit", "Entry yang sama", "Gratis funding", "L1"], 0, "Exit mereka."),
      ]),
      L("u19", "u19-l3", "lesson", "Likuidasi & OI", "Peta darah di layar.", "siren", [
        tip("u19l3t", "Heatmap likuidasi bukan sinyal beli.", "Kerumunan stop/likuidasi bisa jadi magnet harga. Bisa juga kamu yang tersedot. Paus $5 juta hangus seminggu, short $1 juta dilikuidasi abis flip — itu ukuran mereka. Bukan undangan 50x di HP.", {
          points: [
            "Open interest gede + funding ekstrem = pasar sesak, bukan 'pasti lanjut'.",
            "Likuidasi massal bisa squeeze, trus balik.",
            "Baca buat konteks, bukan tombol gas.",
          ],
          example: "Flip long ke short $1 juta, langsung hangus. Timing paus pun bisa salah.",
          remember: "Peta darah, bukan peta harta.",
          proofs: ["rugi-liqs", "rugi-machi", "rugi-sp500", "rugi-33m"],
        }),
        c("u19l3q1", "Heatmap likuidasi itu…", ["Konteks, bukan tombol beli", "Sinyal 100%", "Asuransi", "Airdrop"], 0, "Konteks."),
        tf("u19l3q2", "Paus salah timing = kamu harus ikutan lebih gede.", false, "Ukuran mereka bukan ukuran kamu."),
        blank("u19l3q3", "Posisi dilikuidasi artinya ditutup ___.", ["paksa", "nanti", "gratis", "on-ramp"], 0, "Paksa."),
      ]),
      L("u19", "u19-chest", "chest", "Peti unit 19", "CCTV yang nggak kamu nyetir buta.", "gift", [], { xp: 0, gems: 22 }),
      L("u19", "u19-l4", "lesson", "MEV", "Robot di depan antrian.", "fuel", [
        tip("u19l4t", "Sandwich itu pajak tersembunyi.", "Bot liat tx kamu di mempool, beli dulu, kamu keisi mahal, mereka jual. Di L2 tertentu lebih ringan, nggak hilang. Slippage limit ketat, hindari koin sepi dengan ukuran gede, pertimbangkan RPC/private tx kalo udah mahir.", {
          points: [
            "Market buy memecoin sepi = umpan sandwich.",
            "Limit price & slippage 0.5–1% di koin dalam; di meme, pikir ulang ukuran.",
            "Kamu nggak 'kalah sama chart'. Kadang kalah sama antrian.",
          ],
          example: "Beli meme $500, keisi $620. Selisih masuk bot.",
          remember: "Antrian juga lawan.",
        }),
        c("u19l4q1", "Sandwich itu…", ["Bot beli dulu, kamu mahal, mereka jual", "Makan siang trader", "L2 resmi", "Pajak negara"], 0, "MEV."),
        tf("u19l4q2", "Slippage 15% di koin sepi itu nyaman.", false, "Undangan sandwich / isi jelek."),
        c("u19l4q3", "Lawannya kadang…", ["Antrian mempool", "Cuma candle", "Cuma pajak", "Cuma PFP"], 0, "Antrian."),
      ]),
      L("u19", "u19-cp", "checkpoint", "Ujian unit 19", "Label, copy, darah, antrian.", "flag", [
        tip("u19cpt", "Ulangan on-chain", "Badge usang. Copy buta bahaya. Heatmap bukan tombol.", {
          points: ["Label.", "Copy ukuran.", "Likuidasi paus.", "MEV."],
        }),
        tf("u19cp1", "Smart money badge = copy all-in.", false, "Usang / hedge nggak kelihatan."),
        c("u19cp2", "$17 jadi $3 juta…", ["Nyata, bukan resep", "Wajib utang", "Tanpa likuiditas", "L2"], 0, "Nyata ≠ resep."),
        blank("u19cp3", "Ditutup paksa: ___.", ["likuidasi", "airdrop", "mint", "floor"], 0, "Likuidasi."),
        c("u19cp4", "Sandwich…", ["MEV", "NFT", "CEX KYC", "P2P"], 0, "MEV."),
      ]),
    ],
  },
  {
    id: "u20",
    index: 20,
    title: "Hidup di web3",
    subtitle: "Kerja, DAO, waras. Bukan cuma trade",
    color: "gold",
    lessons: [
      L("u20", "u20-l1", "lesson", "Banyak pintu", "Kerja, DeFi, DAO, konten. Chart cuma satu.", "globe", [
        tip("u20l1t", "web3min peta, bukan kasino.", "Cuan web3 bisa dari gaji, bounty, grant, DeFi yang waras, konten, airdrop kecil, atau trading. Yang paling kelihatan di X itu yang terakhir — soalnya paling gampang dipost. Yang paling sering bayar tagihan: kerja + skill.", {
          points: [
            "Kerja: community, intern, engineer, desain, BD, support, riset. Remote ada. Bayar-dulu-baru-hire = umpan.",
            "DeFi: lend, borrow, pool. Bunga dari peminjam atau fee. Bukan 4.000% banner.",
            "DAO: komunitas + kas. Kadang bayar kontributor. Bukan HR tanggal 25.",
            "Trading tanpa edge = donasi ke yang punya edge. Boleh, asal ukuran hidup.",
          ],
          example: "Anak Indo gaji community remote. Yang lain +$1.300 sebulan dari LP, modal yang dia tahan. Ada juga yang jutaan dolar roundtrip habis. Pilih pintu yang kamu tahan.",
          remember: "Pintu banyak, kasino cuma satu.",
          proofs: ["cuan-indo-lev", "rugi-roundtrip", "cuan-20m", "rugi-cut"],
        }),
        c("u20l1q1", "Cuan web3 cuma dari futures 50x?", ["Nggak. Kerja, DeFi, DAO, konten juga", "Ya", "Cuma memecoin", "Cuma NFT"], 0, "Banyak pintu."),
        tf("u20l1q2", "Timeline X mewakili gaji rata-rata.", false, "Survivor + pamer."),
        c("u20l1q3", "Skill baca explorer…", ["Kepake kerjaan juga", "Cuma buat degen", "Sia-sia", "Pajak"], 0, "Kepake."),
        c(
          "u20l1q4",
          "Teman cuma nge-chart, bilang yang lain buang waktu. Kamu?",
          [
            "Chart satu gang. Ada kerja, DeFi, DAO",
            "Setuju, all-in",
            "Setuju, asal utang",
            "Setuju, matikan belajar",
          ],
          0,
          "Satu gang. Bukan kota.",
        ),
      ]),
      L("u20", "u20-l5", "lesson", "Kerja di web3", "Gaji, bounty, grant. Bukan bayar dulu.", "briefcase", [
        tip("u20l5t", "Ada lowongan. Ada juga umpan.", "Proyek web3 butuh tangan: jaga Discord, nulis docs, desain, kode, riset, BD, support. Masuknya sering dari kontribusi dulu — bantu, kelihatan, trus ditawarin. Yang minta kamu transfer dulu biar 'di-onboard' = penipu.", {
          points: [
            "Peran yang sering ada: community, intern, developer, designer, researcher, BD, support, translator.",
            "Cara waras: portofolio, kontribusi publik, hackathon, bounty. Bukan 'kerja bayar 0,05 ETH dulu'.",
            "Bounty & grant: bayar per kerjaan. Kontributor ≠ karyawan. Baca aturannya.",
            "Remote global itu nyata. Tetap butuh skill. Bahasa Inggris ngebantu, bukan syarat sulap.",
          ],
          example: "Kamu bantu jawab orang baru di Discord seminggu. Moderator liat. Ditawarin trial. Bukan: DM 'bayar gas biar kontrak kerja kebuka'.",
          remember: "Kerja yang beneran nggak minta kamu transfer dulu.",
        }),
        match(
          "u20l5q1",
          "Pasangin peran sama kerjanya.",
          [
            { left: "Community", right: "Jaga orang, jawab, budaya" },
            { left: "Developer", right: "Nulis kode & kontrak" },
            { left: "BD", right: "Ngomong sama partner" },
            { left: "Bounty", right: "Bayar per tugas" },
          ],
        ),
        c(
          "u20l5q2",
          "DM: 'kerja remote $5.000, transfer 0,05 ETH dulu biar kontrak kebuka'. Itu apa?",
          ["Umpan. Kerjaan beneran nggak minta transfer dulu", "Standar HR web3", "Gas resmi", "KYC bank"],
          0,
          "Klasik. Blokir.",
        ),
        tf(
          "u20l5q3",
          "Satu-satunya cara kerja di web3 adalah jadi trader profesional.",
          false,
          "Banyak peran. Trader cuma satu kursi.",
        ),
        c(
          "u20l5q4",
          "Cara waras nyari jejak di web3?",
          [
            "Kontribusi publik, bounty, hackathon, portofolio. Jangan bayar umpan",
            "Beli sinyal, trus lamar pakai PnL palsu",
            "Kirim seed ke HR",
            "Utang dulu biar kelihatan serius",
          ],
          0,
          "Kelihatan kerjanya, baru ditawarin. Bukan bayar tiket masuk.",
        ),
        blank(
          "u20l5q5",
          "Bayaran per tugas, bukan gaji bulanan, sering disebut ___.",
          ["bounty", "leverage", "gas", "floor"],
          0,
          "Bounty. Grant biasanya lebih besar, ada proposal.",
        ),
      ]),
      L("u20", "u20-l6", "lesson", "DAO & komunitas", "Suara, kas, bukan kantor ajaib.", "users", [
        tip("u20l6t", "DAO itu komunitas plus kas, bukan HR.", "DAO = orang-orang + aturan di rantai + kas yang kelihatan. Ada proposal, ada voting. Kadang bayar kontributor. Whale bisa punya suara besar. Token governance bukan otomatis gaji.", {
          points: [
            "Proposal: usul. Vote: suara. Kas: dana. Tiga itu mesinya.",
            "Identitas on-chain (ENS, PFP) itu nama. Bukan KTP, bukan CV otomatis.",
            "Masuk Discord ≠ karyawan. Baca siapa yang bayar, dari kas mana.",
            "Game, sosial, kolektif seniman: web3 juga. Bukan cuma candle.",
          ],
          example: "Kamu vote pake token. Usul lolos, kas cair ke kerjaan. Bukan: admin grup 'DAO' minta 1 ETH biar kamu 'anggota dewan'.",
          remember: "DAO = suara + kas. Bukan sulap gaji.",
        }),
        c(
          "u20l6q1",
          "DAO itu apaan, versi warung?",
          [
            "Komunitas yang kasnya kelihatan di rantai, keputusan lewat vote",
            "PT resmi otomatis",
            "Bursa berizin",
            "Sinyal VIP",
          ],
          0,
          "Banyak bentuk. Intinya: orang + aturan + kas.",
        ),
        tf("u20l6q2", "Pegang token DAO = otomatis gajian tiap bulan.", false, "Suara ≠ slip gaji."),
        c(
          "u20l6q3",
          "Admin 'DAO' minta 1 ETH biar kamu masuk dewan. Kamu?",
          ["Tolak. Itu umpan", "Kirim, takut ketinggalan", "Pinjam dulu", "Share seed"],
          0,
          "Dewan yang beneran nggak nagi transfer ke admin.",
        ),
        c(
          "u20l6q4",
          "Selain keuangan, web3 juga kepake buat…",
          [
            "Komunitas, game, identitas, karya, yang bikin app",
            "Cuma chart 24 jam",
            "Cuma ATM lantai NFT",
            "Cuma mining di kamar",
          ],
          0,
          "Kota ini luas. Keuangan satu distrik.",
        ),
      ]),
      L("u20", "u20-l2", "lesson", "Utang vs modal", "Yang harus dibayar, yang boleh hangus.", "bank", [
        tip("u20l2t", "Utang buat spekulasi itu api.", "Ada yang utang $630, cuan, masih bisa cicil dari gaji kalo porto nol. Itu masih nyawa cadangan. Ada yang utang tanpa gaji, full port, hilang. Batas: kalo hangus, hidup tetep jalan.", {
          points: [
            "Uang sewa, makan, kuliah: bukan margin.",
            "Modal spekulasi: jumlah yang kamu ikhlas nol.",
            "Leverage itu utang tersembunyi meski tanpa rentenir.",
          ],
          example: "Cicilan lunas dari gaji IRL meski porto nol — itu bantal. Tanpa bantal, jangan.",
          remember: "Hangus nggak boleh robohin hidup.",
          proofs: ["cuan-indo-lev", "rugi-roundtrip", "rugi-personal"],
        }),
        c("u20l2q1", "Uang sewa buat memecoin?", ["Jangan", "Wajib awal", "Asuransi", "L2"], 0, "Jangan."),
        tf("u20l2q2", "Leverage bukan utang soalnya nggak ada rentenir.", false, "Utang daya. Likuidasi nagi."),
        blank("u20l2q3", "Modal yang ikhlas nol disebut modal ___.", ["spekulasi", "sewa", "kuliah", "pajak"], 0, "Spekulasi."),
      ]),
      L("u20", "u20-l3", "lesson", "Dua sisi, lagi", "Screenshot bukan rencana.", "coins", [
        tip("u20l3t", "Ulang peta darah dan hijau.", "Rp 20 M / 4 bulan ada. Rp 8,8 jt → Rp 17 M ada. $17 → $3 jt ada. −$33 jt short ada. −$5 jt seminggu ada. Roundtrip jutaan ada. Drainer $210 ada. Kamu pilih ukuran, izin, dan pintu.", {
          points: [
            "Hijau tanpa rencana keluar = kertas.",
            "Merah tanpa journal = bakal diulang.",
            "Copy ukuran paus = film pendek.",
          ],
          example: "Top 7 hari Binance vs heatmap likuidasi $1 jt. Dua cuplikan, satu lesson: ukuran.",
          remember: "Dua sisi dulu, baru gas.",
          proofs: ["cuan-argus", "cuan-pnut17", "rugi-33m", "rugi-30m"],
        }),
        c("u20l3q1", "Semua screenshot hijau…", ["Contoh, bukan janji", "Sinyal wajib", "Asuransi", "Gaji"], 0, "Contoh."),
        tf("u20l3q2", "Kalo ada yang $17 jadi $3 jt, kamu wajib all-in.", false, "Bukan template."),
        order("u20l3q3", "Urutin dulu.", ["Hidup", "kunci", "ukuran", "cuan"], "Masih berlaku."),
      ]),
      L("u20", "u20-chest", "chest", "Peti unit 20", "Peta hampir utuh.", "gift", [], { xp: 0, gems: 30 }),
      L("u20", "u20-l4", "lesson", "Kamu nyetir", "web3min nggak jamin cuan.", "flag", [
        tip("u20l4t", "Habis 20 unit, kerjaan baru mulai.", "Kunci aman. Jaringan dicek. Umpan ditolak. Ukuran hidup. Journal jalan. Pintu cuan dipilih yang tahan. Aku peta. Kamu stir. Kalo terlalu indah — umpan.", {
          points: [
            "Ulang unit 2 dan 6 kalo udah lama nggak sentuh seed.",
            "Revoke izin. Update 2FA.",
            "Jangan selesai belajar trus all-in 'wisuda'.",
          ],
          remember: "Peta di saku, tangan di rem.",
          proofs: ["cuan-20m", "rugi-roundtrip", "scam-drainer", "rugi-cut"],
        }),
        c("u20l4q1", "web3min njamin cuan?", ["Nggak. Peta, bukan dukun", "Ya, 20 unit = kaya", "Ya, kalo share seed", "Ya, 50x"], 0, "Peta."),
        tf("u20l4q2", "Lulus unit 20 = saatnya all-in wisuda.", false, "Saatnya hidup lebih waras."),
        c("u20l4q3", "Kalo terlalu indah…", ["Umpan", "Wajib", "Gaji", "L2"], 0, "Umpan."),
        c("u20l4q4", "Abis belajar…", ["Rem, journal, kunci", "Pinjam bank", "Matikan 2FA", "Copy semua call"], 0, "Rem."),
      ]),
      L("u20", "u20-cp", "checkpoint", "Ujian penutup", "20 unit. Kalo lulus, kamu masih di meja.", "flag", [
        tip("u20cpt", "Ulangan terakhir", "Banyak pintu. Kerja nyata. DAO bukan HR. Jangan utang hidup. Peta, bukan dukun.", {
          points: [
            "Trading bukan satu-satunya.",
            "Kerja & bounty ada. Bayar-dulu = umpan.",
            "DAO = suara + kas, bukan gaji ajaib.",
            "Hangus nggak boleh robohin hidup.",
            "Kamu yang nyetir.",
          ],
          remember: "Hidup dulu, cuan belakangan.",
          proofs: ["cuan-argus", "rugi-33m", "cuan-indo-lev", "rugi-liqs"],
        }),
        tf("u20cp1", "Satu-satunya cuan web3 itu futures.", false, "Banyak pintu."),
        c("u20cp2", "Uang sewa…", ["Bukan margin", "Boleh 50x", "Wajib meme", "Bridge"], 0, "Bukan margin."),
        blank("u20cp3", "web3min itu ___, bukan dukun.", ["peta", "paus", "broker", "CEX"], 0, "Peta."),
        c("u20cp4", "Kalo terlalu indah…", ["Umpan", "Gaji", "L1", "Pajak"], 0, "Umpan."),
        c("u20cp5", "Tujuan pemula…", ["Masih di meja tahun depan", "Paus minggu ini", "Utang maksimal", "Copy 50x"], 0, "Hidup."),
        c(
          "u20cp6",
          "Kerja remote minta transfer ETH dulu. Itu?",
          ["Umpan", "Standar HR", "Gas resmi", "DAO wajib"],
          0,
          "Kerja beneran nggak nagi tiket masuk.",
        ),
        tf("u20cp7", "DAO otomatis gajian tiap tanggal 25.", false, "Suara + kas. Bukan slip gaji."),
      ]),
    ],
  },
];
