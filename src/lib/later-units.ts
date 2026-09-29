import type { Unit } from "@/lib/curriculum";
import { c, tf, blank, match, order, tip, L } from "@/lib/curriculum";

const j = c;
const M = tf;
const N = blank;
const F = order;
const P = match;
const I = tip;

export const LATER_UNITS: Unit[] = [
  {
    id: "u14",
    index: 14,
    title: "L2 & jembatan",
    subtitle: "Murah gas, mahal salah jaringan",
    color: "blue",
    lessons: [
      L("u14", "u14-l1", "lesson", "Apa itu L2", "Di atas Ethereum, bukan saingan random.", "layers", [
        tip("u14l1t", "L2 itu jalur cepet di atas L1.", "Ethereum (L1) aman tapi gas bisa mahal. Layer 2 (Arbitrum, Base, Optimism, zkSync) nampung banyak tx, trus 'setor PR' ke L1. Kamu tetap berada di ekosistem Ethereum dengan biaya transaksi yang jauh lebih terjangkau.", {
          points: [
            "Layer 2 mewarisi keamanan Layer 1 berdasarkan mekanisme rollup yang digunakan.",
            "Saldo di Base ≠ saldo di Arbitrum. Alamatnya bisa sama, jaringannya nggak.",
            "Explorer L2 (basescan, arbiscan) beda sama etherscan. Cek jaringannya.",
          ],
          example: "USDT di Ethereum nggak otomatis ada di Base. Harus di-bridge atau beli di jaringan itu.",
          remember: "Alamat sama, jaringan beda, duit nggak nyambung sendiri.",
        }),
        j("u14l1q1","Layer 2 (L2) itu apa?",[
          "Jaringan tambahan di atas L1 biar transaksi murah dan cepat",
          "Blockchain saingan yang berdiri sendiri tanpa kaitan Ethereum",
          "Bank sentral yang menerbitkan kripto untuk semua jaringan",
          "Aplikasi wallet khusus buat menyimpan token di jaringan L2",
        ],0,"L2 memproses transaksi di luar jaringan utama lalu melapor balik ke L1."),
        M("u14l1q2","Alamat di Base dan Arbitrum bisa sama, tapi saldonya terpisah di tiap jaringan.",true,"Benar. Alamat yang sama di jaringan berbeda punya saldo sendiri. Salah jaringan = aset nyangkut."),
        N("u14l1q3","Jaringan dasar Ethereum disebut ___.",["L1","L2","CEX","DEX"],0,"L1 = jaringan utama. L2 = jaringan di atasnya."),
        j("u14l1q4","Sebelum transfer, apa yang wajib dicek?",["Jaringan, token, dan alamat","Foto profil penerima","Jumlah like postingannya","Warna grafik harga"],0,"Salah satu dari tiga itu keliru, asetmu bisa nyasar."),
      ]),
      L("u14", "u14-l2", "lesson", "Bridge", "Pindah aset antarjaringan, dan cara biar nggak nyasar.", "link", [
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
        M("u14l2q1","Iklan Google sering dipakai buat mengarahkan ke situs bridge phishing.",true,"Benar. Iklan bisa dibeli siapa pun. Ketik alamat resminya sendiri atau pakai bookmark."),
        j("u14l2q2","Token hasil bridge di situs sembarangan biasanya kenapa?",["Namanya sama, kontraknya beda, dan bisa nggak bisa dijual","Lebih aman daripada token asli karena diterbitkan ulang","Bisa langsung ditarik ke rekening bank tanpa proses tambahan","Nilainya sama dengan BTC karena namanya mengikuti pasaran"],0,"Token palsu bisa terlihat sama di wallet, tapi nggak punya nilai."),
        j("u14l2q3","Ada tawaran 'bonus 20% kalau bridge sekarang'. Gimana?",["Itu umpan","Promo standar L2","Biaya pajak","Biaya gas resmi"],0,"Bridge resmi nggak kasih bonus. Janji bonus plus desakan waktu itu pola penipuan."),
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
        j("u14l3q1","Transaksi sukses tapi saldo di tujuan kosong. Biasanya kenapa?",[
          "Salah jaringan atau salah token",
          "Blockchain sedang error dan saldo telat",
          "Kamu dapat airdrop dari proyek lain",
          "Saldomu kena pajak jaringan otomatis",
        ],0,"Transaksinya sukses di jaringan yang salah, jadi nggak muncul di jaringan tujuan."),
        M("u14l3q2","Semua CEX otomatis mendukung semua L2.",false,"Salah. Tiap exchange punya daftar jaringan sendiri. Cek dulu sebelum tarik atau setor."),
        F("u14l3q3","Susun langkah kirim yang aman:",["Pilih jaringan","kirim jumlah kecil","cek sudah sampai","baru kirim sisanya"],"Tes kecil dulu. Kalau nyasar, ruginya kecil."),
      ]),
      L("u14", "u14-chest", "chest", "Peti rute 14", "Jembatan yang kamu cek.", "gift", [], { xp: 0, gems: 22 }),
      L("u14", "u14-l4", "lesson", "Gas L2", "Murah bukan gratis, dan bisa nyangkut.", "fuel", [
        tip("u14l4t", "Gas native beda tiap L2.", "Jaringan kayak Base atau Arbitrum butuh ETH yang ada langsung di jaringan itu buat bayar gas fee. Pastikan saldo gas native kamu udah siap sebelum coba transaksi.", {
          points: [
            "Punya token tanpa gas = macet.",
            "Gas spike L2 jarang sebrutal L1, tapi tetep ada saat ramai.",
            "Jangan spam tx gagal. Tiap klik bisa makan.",
          ],
          example: "Airdrop di Base. Wallet cuma punya token itu. Klik claim gagal. Isi dulu ETH senilai sekitar US$2 di jaringan Base.",
          remember: "Gas native dulu, token belakangan.",
        }),
        M("u14l4q1","Buat bayar gas di Base, kamu perlu ETH yang ada di jaringan Base.",true,"Benar. Saldo ETH di Ethereum utama nggak bisa dipakai di Base. Butuh bridge atau jalur deposit."),
        j("u14l4q2","Token kelihatan di wallet tapi nggak bisa dikirim. Kenapa?",["Sering karena nggak punya gas di jaringan itu","Karena tokennya harus dibakar dulu sebelum bisa dikirim","Karena token itu pasti sebuah honeypot yang menjebak","Karena tokennya dikenakan pajak penjualan yang sangat besar"],0,"Isi sedikit koin gas (native) di jaringan itu dulu."),
        N("u14l4q3","Biaya transaksi di jaringan disebut ___.",["gas","floor","royalti","slippage"],0,"Di L2 gas lebih murah, tapi tetap ada."),
      ]),
      L("u14", "u14-cp", "checkpoint", "Ujian rute 14", "Jaringan, jembatan, tes kecil.", "flag", [
        tip("u14cpt", "Ulangan L2", "Alamat sama bukan saldo sama. Bridge dari bookmark. Tes kecil.", {
          points: ["L2 ≠ L1.", "Iklan bridge = curiga.", "Gas native dulu."],
        }),
        M("u14cp1","Saldo di Base sama dengan saldo di Arbitrum.",false,"Salah. Saldo tiap jaringan terpisah meski alamatnya sama."),
        j("u14cp2","Ada 'support' yang DM dan kasih link bridge. Gimana?",["Itu umpan","Link resmi","Jalur lebih cepat","Jalur khusus L1"],0,"Support asli nggak DM duluan. Pakai bridge dari bookmark."),
        N("u14cp3","Biaya transaksi di L2 tetap disebut ___.",["gas","royalti","floor","spread"],0,"Lebih murah dari L1, tapi tetap dibayar."),
        j("u14cp4","Cara paling aman pindah aset antarjaringan?",["Tes jumlah kecil di bridge resmi","Pindahkan semua lewat link iklan","Kasih seed ke bridge","Kirim ke jaringan acak"],0,"Bridge resmi plus tes kecil bikin risiko nyasar jauh lebih kecil."),
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
        tip("u15l1t", "Airdrop resmi nunggu snapshot.", "Proyek foto siapa yang pake / pegang di waktu tertentu, trus bagi token saat TGE (peluncuran token). Bukan 'kirim dulu baru dikali'. Kalo minta transfer buat 'verifikasi airdrop', itu umpan.", {
          points: [
            "Resmi: claim di situs bookmark, tanda tangan pesan (bukan transfer).",
            "Syarat sybil (banyak akun palsu): satu orang banyak wallet palsu bisa didiskualifikasi.",
            "Token airdrop bisa dump hari pertama. Bukan gaji.",
          ],
          example: "Situs palsu minta deposit saldo untuk 'gas insurance'. Bukan claim resmi, melainkan drainer.",
          remember: "Hadiah nggak minta kamu transfer dulu.",
          proofs: ["drop-arb-18k", "drop-wif-1k5", "drop-met-34k", "drop-uni-ath"],
        }),
        M("u15l1q1","Airdrop asli cuma butuh alamat wallet, bukan transfer dulu.",true,"Benar. Yang minta kamu kirim ETH dulu itu umpan. Airdrop sah nggak pernah menagih di awal."),
        j("u15l1q2","Snapshot itu apa?",["Pencatatan saldo atau aktivitas wallet di waktu tertentu","Cadangan seed phrase yang disimpan untuk pemulihan akun wallet","Pajak yang dipotong otomatis saat token airdrop masuk ke wallet","Berkas gambar bukti kepemilikan akun yang diunggah ke proyek"],0,"Proyek mencatat siapa yang memenuhi syarat di waktu tertentu, lalu membagi token."),
        j("u15l1q3","Token airdrop di hari pertama biasanya gimana?",["Sering turun karena banyak yang langsung jual","Harganya dijamin naik setelah hari pertama peluncurannya","Wajib disimpan selamanya supaya nilainya tidak hilang","Pasti bebas dari jebakan honeypot karena dibagikan gratis"],0,"Banyak penerima langsung menjual, jadi harga sering jatuh."),
        j("u15l1q4","Tahun 2020, pengguna Uniswap dapat 400 UNI gratis. Itu dari mana?",["Airdrop, karena mereka pernah memakai Uniswap","Hasil trading futures yang dibagikan ke pengguna aktif","Gaji bulanan yang dibayarkan bursa ke pengguna setianya","Hadiah dari pesan langsung yang dikirim akun resmi"],0,"Airdrop diberikan ke pengguna nyata. Modalnya cuma gas saat pakai produk."),
        j("u15l1q5","Ada yang dapat 2.125 ARB senilai sekitar US$18 ribu karena rutin pakai Arbitrum. Itu disebut apa?",[
          "Airdrop dari pemakaian jaringan",
          "Hasil trading futures dengan leverage 100x",
          "Gaji bulanan dari bursa kripto besar",
          "Hadiah dari DM admin yang mengaku resmi",
        ],0,"Dia dapat karena memakai jaringannya. Tapi banyak juga yang pakai dan nggak dapat apa-apa."),
      ]),
      L("u15", "u15-l2", "lesson", "Farm vs sybil", "Kerja on-chain, atau tipu sistem.", "userx", [
        tip("u15l2t", "Farming itu kerja. Sybil itu ulangi diri.", "Pake produk beneran (swap kecil, bridge, NFT mint) bisa kena kriteria. Bikin 200 wallet dari satu HP, pola sama, sering kena filter. Tim bukan bodoh.", {
          points: [
            "Biaya farm (gas, waktu, modal tes) bisa lebih gede dari hadiah.",
            "Akun yang polanya identik gampang kedetect.",
            "Jangan beli jasa joki sybil, seringnya penipuan dan bikin wallet-mu masuk daftar hitam.",
          ],
          example: "20 wallet, 1 jumlah swap, 1 menit berselang. Diskualifikasi massal.",
          remember: "Pake beneran, jangan tebar palsu.",
          proofs: ["drop-hype-dist", "drop-hl-pts", "drop-hl-tab"],
        }),
        j("u15l2q1","Satu orang bikin 200 wallet dengan pola yang sama. Itu apa?",[
          "Sybil, dan sering didiskualifikasi",
          "Strategi paus untuk menambah jatah",
          "Syarat wajib sebelum ikut airdrop",
          "Standar jaringan L1 yang dipakai semua",
        ],0,"Tim proyek bisa mendeteksi pola wallet yang identik."),
        M("u15l2q2","Jasa sybil berbayar menjamin kamu lolos airdrop.",false,"Salah. Jasa ini sering penipuan, dan wallet-mu bisa masuk daftar hitam."),
        N("u15l2q3","Banyak akun palsu milik satu orang disebut ___.",["sybil","staking","whale","validator"],0,"Sybil bikin airdrop nggak adil, jadi proyek aktif menyaringnya."),
      ]),
      L("u15", "u15-l3", "lesson", "Claim palsu", "Tanda tangan yang nyedot.", "lock", [
        tip("u15l3t", "Claim page itu medan perang.", "Phishing klaim: domain 1 huruf beda, pop-up 'increase allowance', permit2, setApprovalForAll buat NFT. Baca apa yang ditandatangani. Simulasi. Revoke.", {
          points: [
            "Pesan 'I am claiming' tanpa transfer biasanya oke. permit / increaseAllowance curiga.",
            "Google ads di atas hasil resmi = umpan klasik.",
            "Abis claim, cek izin. Cabut yang aneh.",
          ],
          example: "claim-hyperliquid.help minta permit USDC. Bukan docs. Saldo cabut.",
          remember: "Baca tanda tangan, bookmark.",
          proofs: ["warn-hl-phish", "drop-arb-claim", "scam-drainer"],
        }),
        M("u15l3q1","Logo gampang ditiru, jadi cek alamat situs dan isi tanda tangannya sebelum klik Claim.",true,"Benar. Yang menentukan bukan tampilannya, tapi alamat situs dan apa yang sebenarnya kamu tanda tangani."),
        j("u15l3q2","Halaman klaim minta tanda tangan permit atau increaseAllowance. Gimana?",[
          "Curiga, itu izin menarik token",
          "Wajib buat bayar gas transaksi klaim",
          "Standar klaim NFT di semua proyek",
          "Potongan pajak platform saat klaim",
        ],0,"Klaim biasa cukup tanda tangan pesan. Izin menarik token itu ciri drainer."),
        j("u15l3q3","Setelah mencoba klaim di situs baru, harus ngapain?",[
          "Cabut (revoke) izin yang aneh",
          "Bagikan seed phrase ke admin situs",
          "Kasih izin unlimited lagi biar aman",
          "Masukkan semua modal ke kontrak itu",
        ],0,"Izin lama tetap aktif sampai dicabut."),
      ]),
      L("u15", "u15-chest", "chest", "Peti rute 15", "Yang nggak transfer dulu.", "gift", [], { xp: 0, gems: 22 }),
      L("u15", "u15-l4", "lesson", "Poin bukan gaji", "Musim farm bisa rugi.", "coins", [
        tip("u15l4t", "Points season = lotre berbayar.", "Kamu bayar gas dan waktu, hasilnya belum pasti. Hitung biaya dulu, dan jangan beli poin di pasar tidak resmi.", {
          points: [
            "Jangan utang buat farm.",
            "Jangan korbankan keamanan (seed di VPS abal) demi poin.",
            "Kalo biaya > harapan waras, berhenti.",
          ],
          example: "Gas Rp 2 juta, airdrop cair Rp 400 ribu. Kerja, tapi rugi.",
          remember: "Poin bukan slip gaji.",
          proofs: ["drop-met-34k", "drop-dydx-32k", "drop-top50", "drop-first-2k"],
        }),
        c("u15l4q1","Berutang demi mengejar poin airdrop, bagaimana risikonya?",[
          "Bahaya, karena alokasi poin belum tentu berharga",
          "Strategi cerdas yang dipakai para investor besar",
          "Wajib dilakukan di setiap proyek baru",
          "Pasti untung karena ada jaminan",
        ],0,"Hadiah airdrop tidak pernah dijamin nilainya, sehingga berutang untuk biaya gas sangat tidak rasional."),
        tf("u15l4q2","Poin di papan peringkat airdrop cuma ukuran aktivitas, bukan jaminan bisa dicairkan jadi uang.",true,"Benar. Poin bukan token dan bukan utang proyek. Bisa saja nggak pernah ada nilainya."),
        c("u15l4q3","Kalau biaya gas sudah melebihi perkiraan hadiah airdrop, apa yang harus dilakukan?",[
          "Segera berhenti dan evaluasi pengeluaran",
          "Naikkan jumlah transaksi jadi 10 kali lipat",
          "Pinjam uang tambahan buat nutup biaya gas",
          "Beli akun orang lain yang sudah punya poin",
        ],0,"Melanjutkan transaksi saat biaya sudah melampaui potensi hadiah hanya akan menambah kerugian nyata."),
      ]),
      L("u15", "u15-cp", "checkpoint", "Ujian rute 15", "Snapshot, sybil, izin.", "flag", [
        tip("u15cpt", "Ulangan airdrop", "Nggak transfer dulu. Nggak sybil massal. Baca tanda tangan.", {
          points: ["Snapshot.", "Sybil.", "Claim palsu.", "Poin ≠ gaji."],
          proofs: ["drop-uni-400", "drop-arb-8k", "warn-hl-phish"],
        }),
        tf("u15cp1","Klaim airdrop resmi mewajibkan transfer 0,1 ETH terlebih dahulu.",false,"Airdrop asli tidak pernah meminta pembayaran di awal; cukup tanda tangan verifikasi kepemilikan dompet."),
        blank("u15cp2","Satu orang yang membuat puluhan wallet palsu untuk airdrop disebut ___.",["sybil","validator","holder","miner"],0,"Aktivitas sybil merusak keadilan distribusi sehingga protokol aktif mendiskualifikasinya."),
        c("u15cp3","Halaman klaim airdrop tiba-tiba meminta permit USDC, artinya apa?",["Curiga situs penipuan yang ingin menyedot saldomu","Prosedur standar seluruh jaringan blockchain","Verifikasi identitas resmi","Kewajiban pembayaran pajak on-chain"],0,"Permit memberikan izin penarikan saldo token tanpa transaksi gas, ciri khas alat penguras dompet."),
        c("u15cp4","Program poin (points season) paling tepat dianggap apa?",[
          "Lotre berbayar yang hasilnya belum pasti",
          "Gaji bulanan tetap dari pihak protokol",
          "Tabungan deposito berjangka di bank umum",
          "Asuransi modal investasi yang dijamin",
        ],0,"Kamu mengeluarkan biaya transaksi dan waktu nyata untuk hadiah yang belum jelas nilainya."),
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
        tip("u16l1t", "Stable bukan sihir.", "Stablecoin terpusat seperti USDT dan USDC didukung oleh cadangan aset riil. Stablecoin terdesentralisasi seperti DAI menggunakan jaminan smart contract. Pahami risiko masing-masing model sebelum menyimpan dana.", {
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
        ], undefined, "Stablecoin beda cara menjaga nilainya: cadangan, jaminan on-chain, atau algoritma yang pernah gagal."),
        M("u16l1q2","Nilai token yang namanya berisi USD tergantung cadangan dan mekanisme penerbitnya, dan bisa depeg.",true,"Benar. Nama token bukan jaminan. Yang menentukan cadangan nyata dan mekanismenya."),
        j("u16l1q3","Penerbit USDT bisa melakukan apa?",["Membekukan alamat tertentu","Mencetak BTC","Menghapus jaringan Ethereum","Mematikan gas"],0,"Stablecoin terpusat punya fungsi pembekuan untuk kepatuhan hukum."),
      ]),
      L("u16", "u16-l2", "lesson", "Depeg", "Saat $1 nggak $1.", "siren", [
        tip("u16l2t", "Depeg itu ujian, bukan glitch.", "Kalo pasar panik, stable bisa $0.98 atau $0.20. Yang 'deposito 20% APY' di stable aneh biasanya yang pertama pecah. Diversifikasi, jangan all-in satu ticker.", {
          points: [
            "Spread di CEX vs DEX bisa beda saat kacau.",
            "Likuiditas hilang saat paling dibutuhkan.",
            "Langkah diversifikasi darurat: sebar ke beberapa stablecoin atau tarik ke fiat resmi.",
          ],
          example: "APY 20% di UST 'aman'. Pecah. Yang lari telat dapet sisa.",
          remember: "Bunga gila di stable = umpan.",
          proofs: ["rugi-nuked", "rugi-roundtrip"],
        }),
        j("u16l2q1","Ada stablecoin menawarkan 20% per tahun tanpa sumber jelas. Gimana?",["Curiga, itu bisa umpan","Sama seperti deposito bank","Standar USDC","Bonus dari L2"],0,"Bunga tinggi tanpa sumber jelas pernah terjadi di UST sebelum ambruk."),
        M("u16l2q2","Saat pasar panik, stablecoin bisa turun di bawah $1 (depeg).",true,"Benar. Depeg pernah terjadi berulang kali. Stablecoin tetap instrumen berisiko, bukan uang tunai."),
        N("u16l2q3","Harga stablecoin lepas dari $1 disebut ___.",["depeg","airdrop","mint","slippage"],0,"Depeg bisa sementara, bisa juga permanen."),
      ]),
      L("u16", "u16-l3", "lesson", "Parkir waras", "Bukan di bawah bantal.", "bank", [
        tip("u16l3t", "Stable masih kripto.", "Sebenernya masih kripto. Ada risiko penerbit, kontrak, CEX, depeg. Buat uang sewa, lebih aman off-ramp sebagian ke rekening. Yang diparkir on-chain: pecah, CEX berizin + wallet sendiri, jangan satu keranjang.", {
          points: [
            "Jangan gaji setahun di satu USDT di satu CEX.",
            "USDC/USDT bisa beda likuiditas di L2 tertentu.",
            "Imbal hasil wajar stablecoin yang pernah terjadi sekitar 2-8% per tahun, bukan patokan pasti.",
          ],
          example: "Resto parkir omset seminggu di USDT. CEX ditahan. Operasional macet.",
          remember: "Uang hidup ≠ eksperimen.",
        }),
        j("u16l3q1","Uang buat bayar sewa bulan ini paling aman ditaruh di mana?",[
          "Sebagian besar di rekening bank, bukan semua di stablecoin",
          "Semua dana di stablecoin yang berbunga tinggi tanpa cadangan",
          "Memecoin yang harganya lagi naik pesat",
          "Bridge ke jaringan acak tanpa alasan jelas",
        ],0,"Uang kebutuhan hidup jangan dipakai eksperimen."),
        M("u16l3q2","Stablecoin tetap punya risiko penerbit, kontrak, exchange, dan depeg.",true,"Benar. Nggak ada instrumen tanpa risiko. Kenali risikonya sebelum menaruh dana besar."),
        j("u16l3q3","Ada tawaran yield 2% per hari untuk USDT. Gimana?",["Hampir pasti skema","Setara suku bunga BI","Standar DAI","Bunga normal exchange"],0,"2% per hari berarti lebih dari 700% setahun. Nggak masuk akal untuk stablecoin."),
      ]),
      L("u16", "u16-chest", "chest", "Peti rute 16", "Janji $1 yang kamu curigai.", "gift", [], { xp: 0, gems: 22 }),
      L("u16", "u16-l4", "lesson", "Frozen & blacklist", "Penerbit punya tombol.", "lock", [
        tip("u16l4t", "Bukan bank sentral, tapi bisa beku.", "USDT/USDC punya fungsi blacklist. Alamat kena sanksi / hack sering dibekukan. Itu fitur penerbit untuk kepatuhan hukum, bukan bug.", {
          points: [
            "Self-custody nggak ngilangin blacklist token.",
            "Pilih alat sesuai tujuan: belanja sehari-hari vs tahan sensor.",
            "Jangan cuci dana haram. Jejak ada.",
          ],
          example: "Pencurian gede: penerbit beku USDT di alamat pencuri. Korban kadang tertolong, kadang nggak.",
          remember: "Token berizin = ada tombol.",
        }),
        M("u16l4q1","Menyimpan USDT di wallet sendiri bikin USDT kebal dibekukan.",false,"Salah. Pembekuan terjadi di kontrak token, jadi penerbit tetap bisa membekukan."),
        j("u16l4q2","Fitur blacklist di stablecoin itu apa?",["Fitur penerbit untuk kepatuhan hukum","Celah pada kode kontrak yang belum ditemukan pengembang","Serangan peretas yang berhasil membobol kontrak token","Kesalahan jaringan yang membuat transaksi gagal diproses"],0,"Penerbit terpusat bisa membekukan alamat yang terkait kejahatan atau sanksi."),
        j("u16l4q3","Dana hasil kejahatan dipindah ke stablecoin. Apa yang terjadi?",[
          "Jejaknya tetap ada di blockchain",
          "Jejak transaksinya hilang otomatis",
          "L2 menghapus semua jejaknya",
          "Gas membersihkan riwayat transaksinya",
        ],0,"Semua transaksi tercatat permanen dan bisa dilacak."),
      ]),
      L("u16", "u16-cp", "checkpoint", "Ujian rute 16", "Janji, depeg, tombol.", "flag", [
        tip("u16cpt", "Ulangan stable", "Janji $1. Bunga gila umpan. Penerbit punya tombol.", {
          points: ["Jenis cadangan.", "Depeg.", "Uang hidup."],
        }),
        N("u16cp1","Stablecoin lepas dari $1 disebut ___.",["depeg","gas","floor","sybil"],0,"Depeg terjadi saat pasar panik atau cadangannya diragukan."),
        M("u16cp2","APY 20% di stablecoin tanpa sumber jelas sama dengan deposito.",false,"Salah. Deposito dijamin LPS sampai batas tertentu. Stablecoin berbunga tinggi nggak dijamin siapa pun."),
        j("u16cp3","USDT di wallet sendiri statusnya gimana?",[
          "Masih bisa dibekukan penerbit",
          "Kebal total dari pembekuan",
          "Sama seperti uang tunai biasa",
          "Mustahil dilacak oleh siapa pun",
        ],0,"Self-custody melindungi dari exchange, bukan dari penerbit token."),
        j("u16cp4","Semua uang sewa rumah disimpan di satu stablecoin di satu CEX. Risikonya apa?",["Kalau exchange atau stablecoin bermasalah, uang sewa tertahan","Paling profesional karena semua aset terkonsentrasi di satu tempat","Wajib dilakukan supaya biayanya lebih murah dan mudah dipantau","Tidak ada risiko karena stablecoin nilainya selalu satu dolar"],0,"Pisahkan uang kebutuhan hidup dan jangan taruh di satu tempat."),
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
        M("u17l1q1","Floor 1 ETH itu cuma harga jual termurah yang dipasang, belum tentu ada pembelinya.",true,"Benar. Floor bukan jaminan likuiditas. Cek riwayat penjualan, bukan cuma listing termurah."),
        j("u17l1q2","Wash trading itu apa?",["Volume palsu dari wallet yang jual-beli ke dirinya sendiri","Volume asli dari kolektor yang benar-benar membeli karya","Biaya royalti yang dibayarkan kreator ke marketplace","Promo resmi yang diadakan marketplace untuk menarik pembeli"],0,"Tujuannya bikin koleksi kelihatan laris."),
        j("u17l1q3","Berutang buat mint NFT, boleh nggak?",[
          "Jangan, itu seperti judi pakai utang",
          "Wajib kalau mau punya koleksi bluechip",
          "Ada asuransinya kalau mint-nya gagal",
          "Boleh asal kamu sudah riset proyeknya",
        ],0,"Kalau NFT-nya nggak laku, utangnya tetap harus dibayar."),
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
        j("u17l2q1","Situs mint acak minta setApprovalForAll. Risikonya apa?",[
          "NFT lamamu bisa diambil semua oleh kontrak itu",
          "Itu syarat whitelist normal yang wajib dipenuhi",
          "Itu biaya gas resmi yang dipungut jaringan",
          "Biar kamu bisa dapat edisi langka terbatas",
        ],0,"Izin ini memberi kontrak akses ke semua NFT di koleksi itu."),
        M("u17l2q2","Free mint tetap butuh gas, dan permintaan 'fee' tambahan di luar itu patut dicurigai.",true,"Benar. Gas selalu ada karena transaksinya nyata. Fee tambahan yang nggak jelas asalnya itu bendera merah."),
        N("u17l2q3","Izin semua NFT ke satu kontrak disebut setApproval___.",["ForAll","Unlimited","Once","Single"],0,"setApprovalForAll: satu klik, semua NFT di koleksi itu bisa dipindah."),
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
        j("u17l3q1","Utilitas NFT yang bisa dicabut admin itu apa?",[
          "Izin pakai, bukan kepemilikan penuh",
          "Sama seperti memiliki koin BTC asli",
          "Semacam asuransi atas aset digital",
          "Hak permanen yang nggak bisa dicabut",
        ],0,"Kalau admin bisa mencabutnya, kamu cuma dipinjami akses."),
        M("u17l3q2","Memegang NFT foto profil berarti kamu investor resmi proyeknya.",false,"Salah. NFT nggak otomatis memberi saham atau hak investor."),
        j("u17l3q3","Alasan paling masuk akal beli NFT?",[
          "Kamu suka karyanya dan siap kalau nilainya hilang",
          "Buat sumber uang tambahan buat kebutuhan minggu ini",
          "Pakai uang pinjaman biar cepat kaya",
          "Meniru langkah paus dengan modal yang besar",
        ],0,"Beli karena suka dan paham risikonya, bukan karena janji untung."),
      ]),
      L("u17", "u17-chest", "chest", "Peti rute 17", "Yang nggak ngira floor ATM.", "gift", [], { xp: 0, gems: 22 }),
      L("u17", "u17-l4", "lesson", "Hak & salinan", "Right-click bukan transfer.", "lock", [
        tip("u17l4t", "On-chain ≠ hak cipta otomatis.", "Punya NFT biasanya punya token. Hak pake gambar tergantung lisensi. Right-click save bukan nyuri token. Jangan bayar 'pengacara NFT' random di DM.", {
          points: [
            "Cek lisensi koleksi (CC0, terbatas, nggak ada).",
            "Screenshot bukan bukti milik on-chain.",
            "DM 'kamu langgar hak, bayar USDT' = pemerasan klasik.",
          ],
          example: "Bot DM: 'NFT kamu plagiat, bayar 0,3 ETH biar kasusnya selesai'. Blokir.",
          remember: "Token di rantai, ancaman di DM bukan surat resmi.",
        }),
        M("u17l4q1","Hak pakai sebuah NFT tergantung lisensi koleksinya, bukan otomatis hak cipta penuh.",true,"Benar. Baca lisensinya. Banyak koleksi cuma memberi hak pakai pribadi, bukan komersial."),
        j("u17l4q2","Ada DM minta USDT karena NFT-mu dituduh plagiat. Gimana?",["Itu pemerasan, blokir","Itu surat pengadilan","Itu tagihan pajak","Itu peringatan marketplace"],0,"Tuntutan hukum asli nggak datang lewat DM dan nggak minta kripto."),
        j("u17l4q3","Right-click save gambar NFT itu artinya apa?",[
          "Cuma menyalin file, token-nya nggak pindah",
          "Mencuri NFT milik orang lain",
          "Memberi izin approve all ke situs yang asing",
          "Memindahkan token lewat bridge",
        ],0,"Kepemilikan tercatat di blockchain, bukan di file gambar."),
      ]),
      L("u17", "u17-cp", "checkpoint", "Ujian rute 17", "Floor, izin, cerita.", "flag", [
        tip("u17cpt", "Ulangan NFT", "Floor bukan ATM. Izin berbahaya. Suka boleh.", {
          points: ["Wash.", "ApprovalForAll.", "Utility dicabut."],
        }),
        M("u17cp1","Floor price sama dengan uang yang pasti bisa dicairkan.",false,"Salah. Floor itu harga jual yang dipasang, bukan jaminan ada pembeli."),
        N("u17cp2","Volume palsu dari jual-beli ke diri sendiri disebut ___ trading.",["wash","spot","swing","copy"],0,"Wash trading bikin koleksi kelihatan ramai."),
        j("u17cp3","Situs mint minta setApprovalForAll. Gimana?",["Bahaya, tolak","Wajib buat mint","Potongan pajak","Syarat jaringan L1"],0,"Mint biasa nggak butuh akses ke semua NFT-mu."),
        c("u17cp4","Ada pesan DM menuduh NFT milikmu plagiat dan meminta tebusan kripto. Itu apa?",[
          "Pemerasan palsu, abaikan dan blokir",
          "Surat resmi yang dikirim pengadilan negeri",
          "Tagihan royalti yang sah dari proyek",
          "Peringatan resmi marketplace",
        ],0,"Tuntutan hukum yang sah tidak pernah disampaikan lewat pesan anonim dengan meminta tebusan token."),
      ]),
    ],
  },
  {
    id: "u18",
    index: 18,
    title: "Keamanan keras",
    subtitle: "Hardware wallet, multisig, dan simulasi transaksi",
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
        tf("u18l1q1","Hardware wallet dibuat supaya seed phrase nggak pernah menyentuh internet.",true,"Benar. Kalau ada situs minta seed diketik, itu phishing, apa pun nama merek yang dipasangnya."),
        c("u18l1q2","Membeli dompet perangkat keras bekas yang sudah ada seed tertulis di dalamnya, bagaimana?",["Sangat berisiko karena penjual lama masih memegang kuncinya","Aman saja karena tinggal dipakai setelah di-reset pengaturannya","Lebih murah dan sama amannya dengan membeli perangkat baru","Lebih menguntungkan karena harganya jauh lebih terjangkau"],0,"Perangkat harus selalu diinisialisasi ulang dari kondisi kosong agar kunci baru dibuat secara mandiri."),
        c("u18l1q3","Tempat paling aman untuk menyimpan dana tabungan jangka panjang?",[
          "Cold wallet atau hardware wallet dengan seed disimpan offline",
          "Dompet panas di handphone yang selalu terhubung ke internet terus",
          "Menyimpan foto seed di galeri cloud pribadi milikmu",
          "Menitipkan semua dana kamu di bursa yang belum berizin resmi",
        ],0,"Penyimpanan dingin yang terputus dari jaringan internet memberikan perlindungan maksimal dari peretasan daring."),
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
        j("u18l2q1","Multisig 2-dari-3 artinya apa?",["Dua dari tiga kunci harus setuju sebelum transaksi jalan","Tiga perangkat harus memakai versi aplikasi yang sama persis","Seed phrase dibagi ke tiga grup berbeda supaya tidak hilang","Biaya gas dibayar tiga kali lipat untuk setiap transaksi"],0,"Kalau satu kunci hilang atau dicuri, aset masih aman."),
        M("u18l2q2","Kalau tiga kunci multisig disimpan di satu laptop, hilang atau diretas berarti semua kunci ikut hilang.",true,"Benar. Multisig baru berguna kalau kuncinya tersebar di perangkat dan lokasi berbeda."),
        N("u18l2q3","Beberapa kunci harus setuju sebelum transaksi disebut ___.",["multisig","airdrop","hardware","seed"],0,"Multisig membagi kendali supaya nggak ada satu titik gagal."),
      ]),
      L("u18", "u18-l3", "lesson", "Simulasi tx", "Liat sebelum tanda tangan.", "map", [
        tip("u18l3t", "Wallet modern bisa simulasi.", "Rabby/WalletGuard/tenderly nunjukin 'kamu bakal kirim X, izin Y'. Cek simulasi transaksi sebelum kamu setujui. Kalau hasilnya aneh atau mencurigakan, langsung batalkan.", {
          points: [
            "Jika antarmuka menjanjikan mint gratis tetapi simulasi mendeteksi transfer aset, segera tolak.",
            "Blind sign di HP = gelap.",
            "Revoke berkala. Izin lama itu pintu lama.",
          ],
          example: "Kit drainer $210 support 610 wallet. Harga kopi. Korban: tabungan.",
          remember: "Simulasi > rasa FOMO.",
          proofs: ["scam-drainer", "rugi-personal"],
        }),
        j("u18l3q1","Simulasi menunjukkan transfer token padahal katanya 'mint gratis'. Gimana?",["Tolak","Lanjut biar cepat","Tanda tangan aja, simulasi sering salah","Kasih seed"],0,"Simulasi memperlihatkan apa yang benar-benar terjadi. Kalau beda dengan janjinya, itu jebakan."),
        M("u18l3q2","Alat drainer itu mahal, jadi jarang dipakai.",false,"Salah. Ada yang dijual sekitar US$210, jadi dipakai penipu secara massal."),
        j("u18l3q3","Blind sign itu apa?",[
          "Tanda tangan tanpa baca isinya",
          "Tanda tangan yang dibuat offline",
          "Fitur keamanan tambahan",
          "Tanda tangan oleh dua orang",
        ],0,"Kalau isinya nggak terbaca, kamu nggak tahu izin apa yang diberikan."),
      ]),
      L("u18", "u18-chest", "chest", "Peti rute 18", "Kunci yang nggak diketik.", "gift", [], { xp: 0, gems: 24 }),
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
        j("u18l4q1","2FA mana yang paling rentan?",["SMS","Aplikasi authenticator","Kunci keamanan fisik","Multisig"],0,"Nomor HP bisa dipindah penipu lewat SIM swap."),
        M("u18l4q2","Screenshot seed di galeri berisiko, karena galeri bisa otomatis tersimpan ke cloud dan dibaca aplikasi jahat.",true,"Benar. PIN HP nggak melindungi isi galeri dari sinkronisasi cloud atau aplikasi dengan izin baca foto."),
        j("u18l4q3","Sebelum menaruh uang besar di hardware wallet, harus ngapain?",[
          "Uji pemulihan seed di perangkat kosong",
          "Posting video unboxing ke media sosial",
          "Bagikan PIN ke teman terdekat",
          "Lewati update firmware perangkat",
        ],0,"Pastikan cadanganmu benar-benar bisa dipakai sebelum ada uang besar di dalamnya."),
      ]),
      L("u18", "u18-cp", "checkpoint", "Ujian rute 18", "Cold, multi, simulasi.", "flag", [
        tip("u18cpt", "Ulangan keamanan", "Seed offline. Kunci terpisah. Simulasi. 2FA app.", {
          points: ["Hardware.", "Multisig.", "Drainer murah.", "SMS rapuh."],
        }),
        M("u18cp1","Mengetik seed di situs 'official ledger sync' itu prosedur resmi.",false,"Salah. Ledger nggak pernah minta seed diketik di situs. Itu phishing."),
        N("u18cp2","Beberapa kunci yang harus setuju disebut ___.",[
          "multisig",
          "seed phrase",
          "private key",
          "hot wallet",
        ],0,"Multisig cocok untuk menyimpan aset besar atau dana bersama."),
        j("u18cp3","Alat drainer dijual murah. Artinya apa?",[
          "Ancaman massal, menyerang siapa aja",
          "Aman buat pemula yang baru belajar",
          "Cuma menyerang wallet yang isinya besar",
          "Cuma ada di jaringan tertentu saja",
        ],0,"Karena murah, banyak penipu memakainya ke korban acak."),
        j("u18cp4","2FA lewat SMS itu gimana?",["Rentan SIM swap","Paling kuat","Bisa menggantikan seed","Wajib untuk semua exchange"],0,"Pakai aplikasi authenticator atau kunci keamanan fisik."),
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
        tip("u19l1t", "Label itu petunjuk, bukan KTP.", "Etherscan/Arkham/Nansen nempel nama. Bisa bener, bisa ketinggalan, bisa tipuan. Cek riwayat transaksi, dari mana dananya, dan ke mana perginya, jangan langsung percaya cuma gara-gara ada label 'smart money'.", {
          points: [
            "Satu entitas punya banyak alamat.",
            "Label 'Binance' di alamat hot wallet bukan jaminan tx berikutnya aman.",
            "Copy-paste alamat dari story IG = klasik salah digit.",
          ],
          example: "Wallet berlabel 'smart' dump meme ke kamu. Label lama, niat baru.",
          remember: "Pola > badge.",
          proofs: ["cuan-winter", "cuan-pnut17", "cuan-binance", "cuan-argus2"],
        }),
        M("u19l1q1","Label 'smart money' bisa usang atau keliru, dan kamu nggak tahu strategi lengkap wallet itu.",true,"Benar. Label itu hasil analisis pihak lain, bukan jaminan. Tanpa tahu rencana lengkapnya, kamu cuma menebak."),
        j("u19l1q2","Satu orang bisa punya berapa alamat wallet?",["Banyak","Cuma satu selamanya","Maksimal dua","Harus sesuai KTP"],0,"Makanya satu label nggak cukup menggambarkan siapa pemiliknya."),
        j("u19l1q3","Kamu menyalin alamat dari story IG. Harus ngapain?",[
          "Cek ulang karakter awal dan akhir",
          "Langsung kirim semua dananya",
          "Anggap alamatnya lebih resmi",
          "Kirim lewat jaringan L2 biar lebih aman",
        ],0,"Alamat di story bisa salah atau sudah diganti penipu."),
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
        j("u19l2q1","Ada yang ubah US$17 jadi US$3 juta. Pelajarannya apa?",[
          "Bisa terjadi, tapi bukan resep yang bisa kamu tiru",
          "Harus diulang pakai semua modal yang kamu punya",
          "Pasti tanpa risiko apa pun kalau kamu ikut mencoba",
          "Ada asuransi yang menanggung kalau rugi",
        ],0,"Kasus langka seperti ini sering karena orang dalam atau keberuntungan."),
        M("u19l2q2","Bot copy wallet paus masuk belakangan, jadi slippage-nya sering lebih parah.",true,"Benar. Kamu ikut setelah harga bergerak. Yang dapat harga terbaik justru yang masuk lebih dulu."),
        j("u19l2q3","Kamu beli tepat setelah wallet terkenal beli. Apa yang sering terjadi?",[
          "Kamu jadi pembeli saat mereka mau jual",
          "Dapat harga masuk yang sama persis dengan mereka",
          "Biaya funding-nya jadi gratis buat kamu",
          "Terlindungi dari risiko likuidasi",
        ],0,"Mereka masuk duluan di harga lebih murah."),
      ]),
      L("u19", "u19-l3", "lesson", "Likuidasi & OI", "Peta darah di layar.", "siren", [
        tip("u19l3t", "Heatmap likuidasi bukan sinyal beli.", "Kerumunan stop/likuidasi bisa jadi magnet harga. Bisa juga kamu yang tersedot. Area likuidasi yang numpuk sering jadi incaran bot dan pasar. Jangan pakai peta likuidasi sebagai satu-satunya alasan buat buka posisi nekat.", {
          points: [
            "Open interest gede + funding ekstrem = pasar sesak, bukan 'pasti lanjut'.",
            "Likuidasi massal bisa squeeze, trus balik.",
            "Baca buat konteks, bukan tombol gas.",
          ],
          example: "Flip long ke short $1 juta, langsung hangus. Timing paus pun bisa salah.",
          remember: "Peta darah, bukan peta harta.",
          proofs: ["rugi-liqs", "rugi-machi", "rugi-sp500", "rugi-33m"],
        }),
        j("u19l3q1","Heatmap likuidasi itu apa gunanya?",[
          "Konteks pasar, bukan tombol beli",
          "Sinyal yang dijamin 100% akurat",
          "Asuransi buat posisi yang kamu buka",
          "Info soal airdrop yang akan datang",
        ],0,"Peta ini nunjukin tempat banyak posisi bisa ditutup paksa, bukan arah harga pasti."),
        M("u19l3q2","Kalau paus salah timing, kamu harus ikut dengan posisi lebih besar.",false,"Salah. Ukuran dan modal mereka beda jauh dengan kamu."),
        N("u19l3q3","Posisi yang dilikuidasi artinya ditutup ___.",["paksa","nanti","gratis","sementara"],0,"Likuidasi terjadi otomatis saat jaminanmu nggak cukup."),
      ]),
      L("u19", "u19-chest", "chest", "Peti rute 19", "CCTV yang nggak kamu nyetir buta.", "gift", [], { xp: 0, gems: 22 }),
      L("u19", "u19-l4", "lesson", "MEV", "Robot di depan antrian.", "fuel", [
        tip("u19l4t", "Sandwich itu pajak tersembunyi.", "Bot liat tx kamu di mempool, beli dulu, kamu keisi mahal, mereka jual. Di L2 tertentu lebih ringan, nggak hilang. Pakai batas slippage yang ketat, hindari beli koin sepi dengan jumlah gede, dan pertimbangkan RPC privat kalau kamu udah mahir.", {
          points: [
            "Market buy memecoin sepi = umpan sandwich.",
            "Atur limit order dan batas slippage 0.5-1% pada aset berlikuiditas tinggi untuk meminimalkan selisih harga.",
            "Kamu nggak 'kalah sama chart'. Kadang kalah sama antrian.",
          ],
          example: "Beli meme $500, keisi $620. Selisih masuk bot.",
          remember: "Antrian juga lawan.",
        }),
        j("u19l4q1","Serangan sandwich itu apa?",["Bot beli duluan, kamu dapat harga mahal, lalu bot jual","Istilah untuk trader yang memutuskan berhenti sejenak","Fitur resmi Layer 2 yang mempercepat transaksi pengguna","Pajak transaksi yang dipotong otomatis oleh marketplace"],0,"Bot memanfaatkan transaksimu yang masih antre di mempool."),
        M("u19l4q2","Batas slippage 15% di koin sepi mengundang bot sandwich.",true,"Benar. Batas selonggar itu dikasih ke bot sebagai ruang gerak. Pakai batas ketat di koin sepi."),
        j("u19l4q3","Selain pergerakan pasar, apa lagi yang bisa bikin kamu rugi saat beli?",["Bot MEV yang menyerobot antrean transaksi","Hanya pergerakan grafik harga yang tidak bisa diprediksi","Hanya pajak transaksi yang dipotong oleh marketplace","Hanya foto profil yang dipakai sebagai identitas koleksi"],0,"MEV (bot yang menyerobot antrean) bisa mengambil selisih harga dari transaksimu."),
      ]),
      L("u19", "u19-cp", "checkpoint", "Ujian rute 19", "Label, copy, darah, antrian.", "flag", [
        tip("u19cpt", "Ulangan on-chain", "Badge usang. Copy buta bahaya. Heatmap bukan tombol.", {
          points: ["Label.", "Copy ukuran.", "Likuidasi paus.", "MEV."],
        }),
        M("u19cp1","Wallet berlabel smart money harus ditiru pakai semua modal.",false,"Salah. Label bisa usang, dan posisi lindung nilainya nggak kelihatan."),
        j("u19cp2","Kisah US$17 jadi US$3 juta itu apa?",["Nyata, tapi bukan resep","Alasan buat berutang","Tanpa risiko","Jaminan untuk semua"],0,"Satu kasus sukses nggak bisa jadi strategi."),
        N("u19cp3","Posisi ditutup paksa disebut ___.",[
          "likuidasi",
          "liquidity",
          "airdrop",
          "staking",
        ],0,"Terjadi saat jaminan nggak cukup menutup rugi."),
        j("u19cp4","Serangan sandwich termasuk jenis apa?",["MEV (bot menyerobot antrean)","Phishing (mencuri kredensial lewat situs palsu)","Rugpull (tim menarik likuiditas lalu kabur)","Honeypot (token bisa dibeli tapi tidak bisa dijual)"],0,"Sandwich nggak mencuri wallet-mu, tapi mengambil selisih harga dari transaksimu."),
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
        tip("u20l1t", "web3min peta, bukan kasino.", "Cuan web3 bisa dari gaji, bounty, grant, DeFi yang waras, konten, airdrop kecil, atau trading. Duit beneran di web3 datang dari skill nyata kayak ngoding, desain, nulis, riset, atau bantu komunitas, bukan cuma tebak-tebakan harga.", {
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
        c("u20l1q1","Apakah mencari penghasilan di web3 cuma bisa lewat trading futures?",[
          "Tidak, ada banyak jalur seperti bounty, grant, kerja tim, dan DAO",
          "Ya, hanya bisa lewat trading dengan membaca grafik harga dan pola lilin",
          "Hanya bisa didapat dengan membeli meme coin yang sedang viral di linimasa",
          "Hanya bisa diperoleh dari jual beli koleksi NFT mahal milik selebriti",
        ],0,"Ekosistem web3 membutuhkan banyak keahlian nyata mulai dari penulisan, desain, hingga pemrograman."),
        tf("u20l1q2","Yang mengalami kerugian jarang memamerkan hasilnya, jadi linimasa kelihatan seolah semua orang selalu untung.",true,"Benar. Namanya survivor bias. Timeline cuma menampilkan yang menang, bukan rata-rata."),
        c("u20l1q3","Kemampuan membaca penjelajah blockchain (explorer) berguna untuk apa?",[
          "Membantu riset, verifikasi transaksi, dan buka peluang kerja nyata",
          "Cuma berguna buat hacker yang mau menyerang jaringan milik orang lain",
          "Tidak ada gunanya sama sekali buat pengguna biasa di Indonesia",
          "Cuma untuk menghafal alamat kontrak dan nomor bloknya",
        ],0,"Mampu membaca aliran data on-chain adalah keahlian mendasar yang sangat dicari di industri Web3."),
        c(
          "u20l1q4",
          "Teman cuma nge-chart, bilang yang lain buang waktu. Kamu?",
          [
          "Chart cuma satu gang, masih ada kerja, DeFi, dan DAO",
          "Setuju, all-in chart biar cepat kaya tanpa mikir panjang",
          "Setuju, asal pakai uang utang dulu biar berani juga",
          "Setuju, matikan semua belajar lain yang penting itu",
        ],
          0,
          "Trading cuma satu dari banyak jalur di web3. Ada kerja, DeFi, DAO, dan konten yang bisa jadi sumber penghasilan tanpa harus menaruh seluruh modal di pasar.",
        ),
      ]),
      L("u20", "u20-l5", "lesson", "Kerja di web3", "Gaji, bounty, grant. Bukan bayar dulu.", "briefcase", [
        tip("u20l5t", "Ada lowongan. Ada juga umpan.", "Proyek web3 butuh tangan: jaga Discord, nulis docs, desain, kode, riset, BD, support. Banyak proyek Web3 mencari kontributor yang aktif memberikan nilai tambah. Waspadai tawaran kerja yang meminta deposit dana di awal karena itu adalah modus penipuan.", {
          points: [
            "Peran yang sering ada: community, intern, developer, designer, researcher, BD, support, translator.",
            "Cara waras: portofolio, kontribusi publik, hackathon, bounty. Bukan kerja yang meminta biaya deposit.",
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
          undefined,
          "Empat peran nyata di web3 yang bisa jadi jalan karier selain trading.",
        ),
        c(
          "u20l5q2",
          "DM: 'kerja remote $5.000, transfer deposit ETH dulu biar kontrak kebuka'. Itu apa?",
          ["Umpan. Pekerjaan resmi tidak meminta transfer uang", "Standar rekrutmen web3 yang umum dipakai proyek besar", "Biaya gas resmi yang harus dibayar sebelum kontrak kerja dibuka", "Prosedur KYC bank yang diadopsi oleh platform kripto"],
          0,
          "Pekerjaan profesional yang sah tidak pernah meminta biaya registrasi atau transfer deposit kripto dari calon pekerjanya.",
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
          "Beli sinyal orang lalu lamar pakai PnL palsu yang kamu karang sendiri",
          "Kirim seed phrase ke HR biar cepat dipanggil interview kerja",
          "Utang dulu biar kelihatan serius dan siap kerja penuh waktu",
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
            "Proposal: usul. Vote: suara. Kas: dana. Tiga itu mesinnya.",
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
            "Perusahaan berbadan hukum PT yang sahamnya diperdagangkan di bursa",
            "Bursa kripto berizin yang mengatur tata kelola seluruh anggotanya",
            "Grup sinyal VIP yang memberi rekomendasi beli dan jual ke anggota",
          ],
          0,
          "Banyak bentuk. Intinya: orang + aturan + kas.",
        ),
        tf("u20l6q2", "Pegang token DAO = otomatis gajian tiap bulan.", false, "Token DAO memberi hak suara dalam tata kelola komunitas, bukan gaji bulanan. Imbalannya hanya ada kalau komunitas memutuskan memberi kompensasi lewat voting."),
        c(
          "u20l6q3",
          "Admin 'DAO' minta 1 ETH biar kamu masuk dewan. Kamu?",
          ["Tolak. Itu umpan", "Kirim, takut ketinggalan", "Pinjam dulu", "Share seed"],
          0,
          "Dewan yang beneran nggak nagi transfer ke admin.",
        ),
        c(
          "u20l6q4",
          "Selain transaksi keuangan dan investasi, teknologi Web3 dapat diterapkan untuk apa saja?",
          [
            "Komunitas, game, identitas, karya, yang bikin app",
            "Hanya grafik harga yang dipantau selama dua puluh empat jam",
            "Hanya mesin tunai yang dipasang di lantai pameran NFT",
            "Hanya penambangan koin yang dijalankan dari kamar kos",
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
          example: "Sewa, makan, dan cicilan aman dari gaji. Yang dipakai main kripto cuma sisanya.",
          remember: "Hangus nggak boleh robohin hidup.",
          proofs: ["cuan-indo-lev", "rugi-roundtrip", "rugi-personal"],
        }),
        j("u20l2q1","Mana yang boleh jadi modal spekulasi?",["Uang yang kalau hilang nggak mengganggu hidup","Uang sewa rumah yang memang sudah dianggarkan bulan depan","Uang kuliah anak yang baru akan dipakai tahun depan","Uang pinjaman online yang bunganya rendah dan bisa dicicil"],0,"Modal spekulasi harus uang yang kamu siap kehilangan."),
        M("u20l2q2","Leverage itu pinjaman, bedanya yang menagih adalah mesin likuidasi.",true,"Benar. Nggak ada rentenir yang datang, tapi posisimu ditutup paksa saat margin habis. Bunga dan funding tetap dibayar."),
        N("u20l2q3","Uang yang siap kamu relakan hilang disebut modal ___.",[
          "spekulasi",
          "kebutuhan",
          "cadangan",
          "darurat",
        ],0,"Pisahkan dari dana darurat dan kebutuhan hidup."),
      ]),
      L("u20", "u20-l3", "lesson", "Dua sisi, lagi", "Screenshot bukan rencana.", "coins", [
        tip("u20l3t", "Ulang peta darah dan hijau.", "Rp 20 miliar dalam 4 bulan ada. Rp 8,8 juta jadi Rp 17 miliar ada. US$17 jadi US$3 juta ada. Rugi US$33 juta satu posisi juga ada. Rugi US$5 juta seminggu ada. Untung jutaan balik ke nol ada. Alat drainer US$210 ada. Kamu yang pilih ukuran, izin, dan pintu.", {
          points: [
            "Hijau tanpa rencana keluar = kertas.",
            "Merah tanpa journal = bakal diulang.",
            "Copy ukuran paus = film pendek.",
          ],
          example: "Top 7 hari Binance vs heatmap likuidasi US$1 juta. Dua cuplikan, satu lesson: ukuran.",
          remember: "Dua sisi dulu, baru gas.",
          proofs: ["cuan-argus", "cuan-pnut17", "rugi-33m", "rugi-30m"],
        }),
        j("u20l3q1","Semua screenshot hijau di timeline itu apa?",["Contoh, bukan janji","Sinyal yang wajib diikuti","Asuransi","Gaji"],0,"Yang rugi jarang posting, jadi gambarnya berat sebelah."),
        M("u20l3q2","Satu kasus langka US$17 jadi US$3 juta bukan template buat all-in.",true,"Benar. Itu outlier, bukan pola. Yang meniru tanpa keberuntungan sama biasanya kehilangan semuanya."),
        P("u20l3q3","Pasangkan prinsipnya.",[{left:"Hidup",right:"Jangan pakai uang kebutuhan"},{left:"Kunci",right:"Seed disimpan offline"},{left:"Ukuran",right:"Risiko 1-2% per transaksi"},{left:"Cuan",right:"Dipikir paling akhir"}],undefined,"Urutan prioritas ini yang membedakan yang bertahan lama dengan yang habis di tengah jalan."),
      ]),
      L("u20", "u20-chest", "chest", "Peti rute 20", "Peta hampir utuh.", "gift", [], { xp: 0, gems: 30 }),
      L("u20", "u20-l4", "lesson", "Kamu nyetir", "web3min nggak jamin cuan.", "flag", [
        tip("u20l4t", "Habis 20 rute, kerjaan baru mulai.", "Kunci aman. Jaringan dicek. Umpan ditolak. Ukuran hidup. Journal jalan. Pintu cuan dipilih yang tahan. web3min cuma panduan belajar, dan kendali penuh tetap di tanganmu. Waspada sama janji cuan yang nggak masuk akal.", {
          points: [
            "Ulang rute 2 dan 6 kalo udah lama nggak sentuh seed.",
            "Revoke izin. Update 2FA.",
            "Jangan selesai belajar trus all-in 'wisuda'.",
          ],
          remember: "Peta di saku, tangan di rem.",
          proofs: ["cuan-20m", "rugi-roundtrip", "scam-drainer", "rugi-cut"],
        }),
        j("u20l4q1","Apakah web3min menjamin untung?",["Nggak. web3min panduan belajar, bukan penjamin untung","Ya, lulus dua puluh rute berarti pasti menjadi kaya raya","Ya, asalkan kamu bersedia membagikan seed phrase-mu","Ya, asalkan memakai leverage lima puluh kali setiap hari"],0,"Keputusan dan risikonya tetap di kamu."),
        M("u20l4q2","Lulus rute 20 artinya kamu siap mengambil keputusan dengan lebih hati-hati, bukan saatnya all-in.",true,"Benar. Tujuan kurikulum ini kesadaran risiko, bukan lampu hijau buat bertaruh besar."),
        j("u20l4q3","Ada tawaran kerja remote US$5.000 per bulan, tapi minta deposit sejumlah dana dulu. Gimana?",[
          "Tolak, pekerjaan resmi tidak meminta bayaran di awal",
          "Kirim saja biar tidak ketinggalan kesempatan emas itu",
          "Pinjam uang dulu buat bayar deposit yang diminta",
          "Beri seed phrase biar lamaranmu cepat diproses admin",
        ],0,"Perusahaan asli membayar kamu, bukan sebaliknya."),
        j("u20l4q4","Setelah selesai 20 rute, kebiasaan apa yang harus dijaga?",[
          "Batas rugi, jurnal, dan seed yang aman",
          "Pinjam uang bank buat tambah modal awal",
          "Matikan 2FA biar login makin praktis",
          "Ikuti semua call grup tanpa disaring dulu",
        ],0,"Kebiasaan kecil ini yang melindungimu dalam jangka panjang."),
      ]),
      L("u20", "u20-cp", "checkpoint", "Ujian penutup", "20 rute. Kalo lulus, kamu masih di meja.", "flag", [
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
        M("u20cp1","Satu-satunya cara dapat uang di web3 itu trading futures.",false,"Salah. Ada kerja, bounty, grant, airdrop, konten, dan DeFi."),
        j("u20cp2","Uang sewa boleh dipakai buat apa?",["Bayar sewa, bukan jaminan trading","Modal untuk membuka posisi dengan leverage lima puluh kali","Dana untuk membeli meme coin yang sedang ramai dibicarakan","Cadangan untuk biaya bridge antar jaringan blockchain"],0,"Uang kebutuhan hidup jangan dicampur dengan spekulasi."),
        N("u20cp3","web3min itu ___, bukan dukun.",["peta","paus","broker","exchange"],0,"web3min menunjukkan jalan. Kamu yang memutuskan."),
        j("u20cp4","Sebuah situs baru menawarkan hadiah besar dengan syarat transfer saldo awal. Mana yang paling mungkin umpan?",["Airdrop yang minta kirim ETH dulu", "Swap di DEX lewat bookmark", "Beli di exchange berizin", "Staking di situs resmi jaringan"],0,"Yang minta kamu transfer duluan hampir selalu penipuan."),
        j("u20cp5","Tujuan utama pemula di web3 itu apa?",["Masih bertahan tahun depan dengan modal dan kunci aman","Menjadi paus dalam waktu seminggu dengan modal pinjaman","Memakai utang sebanyak mungkin supaya posisinya lebih besar","Meniru posisi lima puluh kali dari akun yang dipamerkan"],0,"Target pemula bukan jadi kaya cepat, tapi bertahan sampai tahun depan dengan modal utuh dan kunci aman. Yang bertahan lama biasanya yang belajar duluan, bukan yang bertaruh besar."),
        j("u20cp6","Kerja remote minta transfer ETH dulu. Itu apa?",["Umpan","Prosedur HR standar","Biaya gas resmi","Syarat masuk DAO"],0,"Kerja asli nggak menagih biaya masuk."),
        M("u20cp7","DAO otomatis menggaji anggotanya tiap tanggal 25.",false,"Salah. DAO itu komunitas dengan voting dan kas bersama, bukan kantor yang pasti menggaji."),
      ]),
    ],
  },
];
