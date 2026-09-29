/**
 * Bank soal per blok (Fase 3).
 *
 * Kenapa dipisah dari `curriculum.ts`: file itu sudah 2500+ baris dan tiap blok
 * ditulis berurutan di sana. Soal tambahan hidup di sini lalu DISISIPKAN ke blok
 * yang sama lewat `withBank()`, jadi urutan tampil tidak berubah dan menambah
 * bank satu rute tidak perlu menyunting `curriculum.ts`.
 *
 * ATURAN AUTHORING (dijaga `scripts/assert-curriculum-integrity.ts`):
 * - Jawaban benar WAJIB di index 0; pengacakan terjadi saat render.
 * - Penjelasan satu kalimat lengkap yang menjelaskan ALASAN, bukan stub.
 * - Pengecoh berpanjang setara; tanpa "semua benar"/"tidak tahu".
 * - Benar/Salah baru hanya bila rasio true global tetap 40-60%.
 * - Sumber: materi dan Kisah yang SUDAH ADA. Tidak mengarang fakta baru.
 *
 * Soal di sini TIDAK menambah XP atau koin: jumlah soal per sesi tetap dibatasi
 * target sesi (`DEFAULT_TARGET`), jadi hadiah per blok tidak berubah.
 */
import type { BlankExercise, ChoiceExercise, Exercise, MatchExercise, OrderExercise, TfExercise } from "@/lib/curriculum";

const c = (id: string, prompt: string, options: string[], explanation: string): ChoiceExercise => ({
  type: "choice",
  id,
  prompt,
  options,
  answer: 0,
  explanation,
});

const tf = (id: string, prompt: string, answer: boolean, explanation: string): TfExercise => ({
  type: "tf",
  id,
  prompt,
  answer,
  explanation,
});

const blank = (id: string, prompt: string, options: string[], explanation: string): BlankExercise => ({
  type: "blank",
  id,
  prompt,
  options,
  answer: 0,
  explanation,
});

const match = (id: string, prompt: string, pairs: { left: string; right: string }[], explanation: string): MatchExercise => ({
  type: "match",
  id,
  prompt,
  pairs,
  explanation,
});

const order = (id: string, prompt: string, pieces: string[], explanation: string): OrderExercise => ({
  type: "order",
  id,
  prompt,
  pieces,
  answer: [...pieces],
  explanation,
});

/**
 * Bank soal per blok. Kunci = id lesson (mis. "u3-l1").
 *
 * Rute 3 (percontohan) dulu: sasaran 8 soal per sesi dari bank sekitar 12, dan
 * Ujian Rute menarik 15 soal dari gabungan bank satu rute.
 */
export const QUIZ_BANK: Record<string, Exercise[]> = {
  // ------------------------------------------------------------------ u3-l1
  "u3-l1": [
    c(
      "u3l1b1",
      "Kamu kirim Bitcoin ke teman tanpa lewat bank. Kenapa itu bisa terjadi?",
      [
        "Karena catatan kepemilikan dijaga bersama di jaringan, bukan di satu perusahaan",
        "Karena ada kantor pusat Bitcoin di Jakarta yang mengurus setiap perpindahan",
        "Karena bank wajib menandatangani setiap transaksi kripto yang kamu kirim",
        "Karena aplikasi wallet bekerja sama dengan seluruh bank sentral di dunia",
      ],
      "Jaringan Bitcoin mencatat kepemilikan secara bersama, jadi perpindahan aset tidak butuh perantara bank.",
    ),
    c(
      "u3l1b2",
      "Ada yang menyarankan pakai uang sewa rumah buat beli BTC karena harganya sedang turun. Bagaimana sikap yang tepat?",
      [
        "Tolak, karena harga kripto bisa turun puluhan persen dalam sehari",
        "Terima, karena Bitcoin selalu naik kembali dalam jangka panjang",
        "Terima, karena pembelian lewat exchange resmi berarti tanpa risiko",
        "Terima, karena nilai Bitcoin dijamin oleh pemerintah dan lembaga penjamin",
      ],
      "Volatilitas Bitcoin bisa memakan uang kebutuhan pokok, jadi uang sewa bukan modal yang layak dipakai.",
    ),
    c(
      "u3l1b3",
      "Kamu mau kirim nilai yang sangat kecil. Satuan terkecil Bitcoin namanya apa?",
      ["Satoshi, yaitu sepersejuta BTC", "Wei, yaitu satuan terkecil dari ETH", "Gwei, yaitu satuan biaya gas jaringan", "Ether, yaitu koin native jaringan Ethereum"],
      "Satoshi adalah pecahan terkecil Bitcoin, sedangkan wei dan gwei adalah satuan di ekosistem Ethereum.",
    ),
    c(
      "u3l1b4",
      "Ada cuitan berbunyi 'Bitcoin dibuat tahun 2015 oleh Vitalik Buterin'. Bagian mana yang salah?",
      [
        "Tahun dan pembuatnya, karena Bitcoin lahir 2009 dari Satoshi Nakamoto",
        "Cuitannya benar semua, karena Vitalik memang merilis Bitcoin pada 2015",
        "Yang salah cuma tahunnya, karena Bitcoin resmi diluncurkan pada 2017",
        "Yang salah cuma namanya, karena pencipta Bitcoin adalah Elon Musk",
      ],
      "Bitcoin lahir 2009 dari Satoshi Nakamoto, sedangkan Vitalik Buterin adalah penggagas Ethereum yang jaringannya hidup 2015.",
    ),
    c(
      "u3l1b5",
      "Harga Bitcoin turun 20% sehari lalu ada yang bilang jaringannya rusak. Jawaban paling tepat?",
      [
        "Harga pasar bergerak, tapi jaringan tetap jalan dan tetap mencatat transaksi",
        "Benar, karena jaringan Bitcoin otomatis berhenti saat harganya turun tajam",
        "Benar, karena penurunan harga berarti ada blok yang gagal ditambang selamanya",
        "Harga dan jaringan tidak berhubungan, jadi keduanya sama sekali tidak bisa dibandingkan",
      ],
      "Fluktuasi harga terjadi di pasar, sementara jaringan Bitcoin tetap memproses dan mencatat transaksi.",
    ),
    blank(
      "u3l1b6",
      "Pecahan kecil dari ETH (bukan BTC) disebut ___.",
      ["wei", "satoshi", "rupiah", "gas"],
      "Wei adalah satuan terkecil ETH, sedangkan satoshi adalah satuan terkecil BTC.",
    ),
    tf(
      "u3l1b7",
      "Pasokan Bitcoin yang dibatasi sekitar 21 juta koin adalah bagian dari desainnya, bukan janji keuntungan.",
      true,
      "Kelangkaan Bitcoin memang dirancang sejak awal, tetapi langka tidak berarti harganya pasti naik.",
    ),
  ],

  // ------------------------------------------------------------------ u3-l2
  "u3-l2": [
    c(
      "u3l2b1",
      "Kamu pakai aplikasi di Ethereum dan kodenya jalan sendiri saat syaratnya terpenuhi. Program itu disebut apa?",
      [
        "Smart contract, yaitu kode yang jalan otomatis di jaringan",
        "Notaris digital, yaitu dokumen perjanjian yang disahkan petugas",
        "Chatbot layanan, yaitu robot yang menjawab pertanyaan pengguna",
        "Gas station, yaitu tempat membeli bahan bakar untuk transaksi",
      ],
      "Smart contract adalah kode yang berjalan otomatis di jaringan Ethereum begitu syaratnya terpenuhi.",
    ),
    c(
      "u3l2b2",
      "Transaksi di Ethereum gagal di tengah jalan. Apa yang biasanya terjadi pada biaya gasnya?",
      [
        "Gas sering tetap terpotong karena kerja komputasinya sudah dijalankan",
        "Gas otomatis dikembalikan penuh karena transaksinya tidak berhasil",
        "Gas hanya terpotong separuh sesuai aturan pengembalian jaringan",
        "Gas dibatalkan dan dibebankan ke validator sebagai bentuk sanksi",
      ],
      "Validator sudah mengerjakan komputasinya, jadi gas sering tetap terpotong walau transaksinya gagal.",
    ),
    c(
      "u3l2b3",
      "Jaringan Ethereum sedang sangat ramai. Apa yang biasanya ikut naik?",
      [
        "Biaya gas, karena banyak transaksi berebut tempat di blok",
        "Jumlah pasokan ETH, karena jaringan mencetak koin tambahan",
        "Alamat wallet pengguna, karena alamat ikut berubah saat ramai",
        "Standar token, karena jaringan berganti standar secara otomatis",
      ],
      "Gas naik saat jaringan ramai karena banyak transaksi berebut ruang di blok yang sama.",
    ),
    c(
      "u3l2b4",
      "Kenapa banyak orang memilih L2 atau rantai lain untuk transaksi sehari-hari?",
      [
        "Karena ongkosnya sering lebih murah dan transaksinya lebih cepat",
        "Karena ETH sama sekali tidak bisa dipindahkan ke alamat lain",
        "Karena Ethereum utama sudah menolak semua transaksi dari pengguna baru",
        "Karena L2 menghapus kebutuhan wallet dan kunci pribadi pengguna",
      ],
      "Alasan utama pindah ke L2 atau rantai lain adalah ongkos yang lebih murah dan transaksi yang lebih cepat.",
    ),
    c(
      "u3l2b5",
      "DeFi, NFT, dan game on-chain yang hidup di ekosistem Ethereum diibaratkan seperti apa?",
      [
        "Aplikasi yang berjalan di atas sistem operasi, dengan ETH sebagai bahan bakarnya",
        "Emas digital yang disimpan rapat di brankas dan tidak bisa dipindahkan",
        "Mesin tambang yang dipakai untuk mencetak koin baru di rumah pengguna",
        "Aplikasi chatting yang menggantikan pesan pribadi di media sosial lama",
      ],
      "Ethereum lebih dekat ke sistem operasi tempat aplikasi berjalan, dan ETH adalah bahan bakar transaksinya.",
    ),
    blank(
      "u3l2b6",
      "Biaya transaksi di jaringan Ethereum disebut ___.",
      ["gas", "pajak", "admin", "ongkir"],
      "Gas adalah ongkos transaksi yang dibayar ke validator dan naik saat jaringan ramai.",
    ),
    tf(
      "u3l2b7",
      "Kalau smart contract di Ethereum ternyata berisi kode jahat, ada layanan pelanggan yang bisa menarik danamu kembali.",
      false,
      "Tidak ada teller atau layanan pelanggan di jaringan, jadi kode yang jahat bisa membuat aset hilang tanpa bisa ditarik kembali.",
    ),
  ],

  // ------------------------------------------------------------------ u3-l5
  "u3-l5": [
    c(
      "u3l5b1",
      "Seseorang bilang 'Merge 2022 menghapus ETH lama dan menggantinya dengan koin baru'. Bagaimana koreksinya?",
      [
        "Merge mengganti cara jaringan dijaga, sedangkan koinnya tetap ETH",
        "Merge benar-benar mengganti ETH dengan koin baru bernama Ethereum 2",
        "Merge mengubah ETH menjadi token ERC-20 supaya bisa dipakai di pool",
        "Merge memindahkan seluruh saldo ETH ke jaringan Bitcoin milik Satoshi",
      ],
      "The Merge hanya mengganti mekanisme penjagaan jaringan dari PoW ke PoS, dan koin yang dipakai tetap ETH.",
    ),
    c(
      "u3l5b2",
      "Setelah peretasan The DAO tahun 2016, komunitas Ethereum terbelah. Yang menolak rollback berganti nama jadi apa?",
      [
        "Ethereum Classic, yang melanjutkan rantai tanpa pembatalan",
        "Ethereum 2, yang menjadi nama resmi Ethereum setelah pembaruan",
        "Bitcoin Cash, yang memisahkan diri dari jaringan Bitcoin tahun 2017",
        "Solana, yang dibangun ulang oleh tim pengembang Ethereum lama",
      ],
      "Kelompok yang menolak pembatalan dampak hack melanjutkan rantai lama dengan nama Ethereum Classic.",
    ),
    c(
      "u3l5b3",
      "Kalau ada yang bertanya kapan jaringan Ethereum mulai hidup, jawaban paling tepat apa?",
      [
        "Sekitar 30 Juli 2015, saat jaringan Frontier dijalankan",
        "Sekitar 2009, bersamaan dengan blok genesis jaringan Bitcoin",
        "Sekitar 2013, saat whitepaper Ethereum pertama kali ditulis",
        "Sekitar 2017, saat gelombang penawaran token perdana meledak",
      ],
      "Whitepapernya ditulis sekitar 2013, tetapi jaringannya baru hidup saat Frontier dijalankan pada 30 Juli 2015.",
    ),
    c(
      "u3l5b4",
      "The Merge membuat penambangan ETH berhenti. Apa alasan utamanya?",
      [
        "Jaringan pindah dari proof-of-work ke proof-of-stake, jadi tidak butuh penambang",
        "Jaringan memindahkan seluruh aktivitasnya ke rantai Bitcoin milik Satoshi",
        "Jaringan menghapus semua smart contract dan kembali mengirim koin saja",
        "Jaringan mengganti koin ETH dengan token ERC-20 yang tidak bisa ditambang",
      ],
      "Setelah The Merge, keamanan jaringan dijaga staker yang mengunci ETH, bukan penambang yang membakar listrik.",
    ),
    c(
      "u3l5b5",
      "Kenapa sejarah belokan Ethereum berguna buat pemula?",
      [
        "Supaya tidak mengira ETH cuma chart dan tidak gampang percaya kabar 'ETH mati'",
        "Supaya bisa menambang ETH di rumah memakai komputer pribadi biasa",
        "Supaya tahu harga penutupan ETH setiap tahun dan bisa menebak puncaknya",
        "Supaya yakin Ethereum tidak pernah gagal sehingga aman untuk all-in",
      ],
      "Dengan memahami fork, mania, dan pergantian mesin, kabar bombastis soal Ethereum tidak gampang menyeret keputusanmu.",
    ),
    match(
      "u3l5b6",
      "Pasangkan tonggak sejarah Ethereum dengan kejadiannya.",
      [
        { left: "2015", right: "Frontier, jaringan hidup" },
        { left: "2016", right: "The DAO, belah ETC" },
        { left: "2020", right: "DeFi summer" },
        { left: "2022", right: "The Merge, PoW ke PoS" },
      ],
      "Empat tonggak ini membentuk Ethereum: Frontier 2015, perpecahan The DAO 2016, DeFi summer 2020, dan The Merge 2022.",
    ),
    tf(
      "u3l5b7",
      "Umur jaringan Ethereum yang sudah lebih dari sepuluh tahun berarti harganya aman dari penurunan tajam.",
      false,
      "Umur panjang hanya menunjukkan jaringannya bertahan, sedangkan harganya tetap bisa turun tajam kapan saja.",
    ),
  ],

  // ------------------------------------------------------------------ u3-l3
  "u3-l3": [
    c(
      "u3l3b1",
      "Kamu butuh 'dolar digital' buat parkir dana sebentar. Pilihan yang paling sesuai?",
      [
        "Stablecoin, karena nilainya dirancang mengikuti dolar AS",
        "Meme coin, karena harganya paling cepat naik dalam sebulan",
        "Altcoin baru, karena pasokannya masih sedikit dan mudah naik",
        "NFT, karena asetnya berupa gambar yang tidak bisa dibagi",
      ],
      "Stablecoin dirancang mengikuti nilai aset lain, umumnya dolar AS, jadi paling sesuai untuk parkir dana jangka pendek.",
    ),
    c(
      "u3l3b2",
      "Ada yang bilang USDT sama aman dengan uang tunai di bawah bantal. Apa yang perlu kamu tahu?",
      [
        "Stablecoin tetap punya risiko penerbit, depeg, dan salah jaringan",
        "Stablecoin benar-benar tanpa risiko karena nilainya dipatok ke dolar",
        "Stablecoin aman karena dijamin penuh oleh lembaga penjamin simpanan",
        "Stablecoin tidak punya risiko apa pun selama dikirim ke jaringan yang benar",
      ],
      "Nilai stablecoin memang dipatok, tetapi risiko penerbit, depeg, dan salah jaringan tetap ada.",
    ),
    c(
      "u3l3b3",
      "Apa yang dimaksud altcoin?",
      [
        "Kripto selain Bitcoin, yang mayoritas sepi atau spekulatif",
        "Koin khusus yang hanya boleh dipakai pegawai bank",
        "Token yang sama sekali tidak bisa ditukar di bursa mana pun",
        "Nama lain dari biaya gas yang dibayar saat transaksi",
      ],
      "Altcoin adalah sebutan longgar untuk kripto selain Bitcoin, dan mayoritas di antaranya sepi atau mati.",
    ),
    c(
      "u3l3b4",
      "Kamu lihat proyek meme coin dengan logo singa dan janji '100x sebulan'. Sikap paling waras?",
      [
        "Riset dulu, pahami gunanya, dan siap kalau uangnya hilang",
        "Ikut beli cepat karena grup sinyal bilang harganya pasti naik",
        "Pinjam uang teman supaya bisa membeli dalam jumlah lebih besar",
        "Percaya saja karena logo dan desain situsnya terlihat profesional",
      ],
      "Janji keuntungan mustahil adalah pemasaran, jadi sikap yang waras adalah riset dan siap kehilangan.",
    ),
    c(
      "u3l3b5",
      "Stablecoin yang kamu kirim lewat jaringan yang salah tidak sampai ke tujuan. Apa pelajaran utamanya?",
      [
        "Stablecoin punya risiko salah jaringan, jadi cek jaringan sebelum kirim",
        "Stablecoin tidak bisa dipindahkan ke jaringan selain Ethereum utama",
        "Stablecoin akan otomatis dikembalikan oleh penerbit kalau salah jaringan",
        "Stablecoin hilang karena nilainya sudah lepas dari patokan dolarnya",
      ],
      "Salah memilih jaringan bisa membuat aset tidak sampai, dan itu risiko yang berdiri sendiri dari depeg.",
    ),
    match(
      "u3l3b6",
      "Pasangkan aset dengan karakter utamanya.",
      [
        { left: "BTC", right: "Kripto pionir" },
        { left: "ETH", right: "Smart contract" },
        { left: "USDT", right: "Ikut dolar" },
        { left: "Meme coin", right: "Spekulasi tinggi" },
      ],
      "Setiap aset punya karakter berbeda, dan yang paling berisiko biasanya yang paling gencar dipromosikan.",
    ),
    tf(
      "u3l3b7",
      "Meme coin dijamin oleh negara sehingga aman dari kerugian total.",
      false,
      "Tidak ada jaminan negara untuk kripto, dan meme coin termasuk aset yang paling berisiko.",
    ),
  ],

  // ------------------------------------------------------------------ u3-l4
  "u3-l4": [
    c(
      "u3l4b1",
      "ETH dan USDT sama-sama dipakai di ekosistem Ethereum. Apa bedanya secara teknis?",
      [
        "ETH itu koin native rantainya, sedangkan USDT token yang numpang di rantai itu",
        "ETH itu token ERC-20, sedangkan USDT adalah koin native jaringan Ethereum",
        "Keduanya koin native, hanya berbeda nama dan lambang di aplikasi wallet",
        "Keduanya token numpang, hanya berbeda penerbit dan jumlah pasokannya",
      ],
      "Coin punya rantai sendiri, sedangkan token seperti USDT numpang di rantai yang sudah ada.",
    ),
    c(
      "u3l4b2",
      "Kamu mau cek apakah sebuah aset di Ethereum berupa token biasa atau NFT. Standar apa yang menandainya?",
      [
        "ERC-20 untuk token biasa dan ERC-721 untuk NFT",
        "ERC-721 untuk token biasa dan ERC-20 untuk NFT",
        "MP3 untuk token biasa dan PDF untuk aset berupa gambar",
        "HTTP untuk token biasa dan HTTPS untuk aset yang lebih aman",
      ],
      "Di Ethereum, token biasa mengikuti standar ERC-20 dan NFT mengikuti standar ERC-721.",
    ),
    c(
      "u3l4b3",
      "Sebuah proyek bisa meluncurkan token baru dalam dua menit. Apa yang sebaiknya kamu pikirkan?",
      [
        "Itu tanda harus lebih curiga, karena membuat token itu memang gampang",
        "Itu tanda harus cepat membeli, karena pasokannya masih sangat sedikit",
        "Itu tanda proyeknya sudah diaudit, karena peluncuran butuh verifikasi",
        "Itu tanda harganya tidak bisa turun, karena kontraknya sudah terkunci",
      ],
      "Kalau membuat token itu mudah, maka penipuan lewat token juga mudah, jadi kewaspadaan harus naik.",
    ),
    c(
      "u3l4b4",
      "Sebelum membeli aset yang baru kamu temukan, langkah paling rasional apa?",
      [
        "Pahami asetnya dulu, baru putuskan membeli",
        "Beli dulu dalam jumlah besar, pahami kemudian",
        "Beli sesuai ajakan grup, karena mereka pasti lebih tahu",
        "Beli tanpa membaca apa pun supaya tidak ketinggalan harga",
      ],
      "Urutan yang benar adalah memahami asetnya lebih dulu, baru memutuskan membeli.",
    ),
    c(
      "u3l4b5",
      "Apa yang perlu kamu periksa sebelum percaya sebuah token baru?",
      [
        "Kontraknya, likuiditasnya, siapa di belakangnya, dan gunanya",
        "Jumlah anggota grup Telegram dan banyaknya stiker lucu yang dibagikan",
        "Warna logo dan tingkat kerapian desain halaman media sosialnya",
        "Banyaknya akun yang mengucapkan selamat di kolom komentar unggahan",
      ],
      "Yang menentukan adalah kontrak, likuiditas, pihak di belakang proyek, dan kegunaan asetnya, bukan keramaian promosi.",
    ),
    blank(
      "u3l4b6",
      "Token biasa di Ethereum paling umum mengikuti standar ___.",
      ["ERC-20", "ERC-721", "MP3", "HTTP"],
      "ERC-20 adalah standar token biasa di Ethereum, sedangkan ERC-721 dipakai untuk NFT.",
    ),
    tf(
      "u3l4b7",
      "Semua token yang muncul di timeline otomatis sudah melalui audit resmi.",
      false,
      "Peluncuran token sangat mudah dan tidak butuh audit, jadi tidak ada jaminan kualitas otomatis.",
    ),
  ],

  // ------------------------------------------------------------------ u3-l6
  "u3-l6": [
    c(
      "u3l6b1",
      "Apa yang sebenarnya terjadi pada hadiah penambangan Bitcoin saat halving?",
      [
        "Hadiah blok dipotong kira-kira setengah setiap empat tahun",
        "Hadiah blok naik dua kali lipat setiap empat tahun agar penambang tetap untung",
        "Hadiah blok tetap sama, yang berubah hanya biaya transaksi di jaringan",
        "Hadiah blok dihapus total sehingga penambang tidak mendapat apa pun lagi",
      ],
      "Halving memotong hadiah blok sekitar setengah setiap empat tahun, dan laju pasokan baru jadi melambat.",
    ),
    c(
      "u3l6b2",
      "Seseorang mengajakmu berutang untuk membeli BTC sehari sebelum halving karena harganya 'pasti melonjak'. Jawaban paling waras?",
      [
        "Tolak, karena halving mengubah pasokan dan harganya tetap tergantung permintaan",
        "Terima, karena halving secara matematis menjamin harga naik dua kali lipat",
        "Terima, karena penambang berhenti menjual sehingga pasokan langsung habis",
        "Terima, karena harga Bitcoin tidak pernah turun setelah peristiwa halving",
      ],
      "Halving hanya memperlambat pasokan baru, sedangkan arah harga tetap ditentukan permintaan pasar.",
    ),
    c(
      "u3l6b3",
      "Setelah beberapa kali halving, mengapa hadiah blok Bitcoin semakin kecil?",
      [
        "Karena batas pasokan 21 juta koin membuat laju pencetakan harus melambat",
        "Karena penambang sepakat menurunkan hadiah mereka sendiri setiap tahun",
        "Karena jaringan Bitcoin beralih ke proof-of-stake seperti Ethereum",
        "Karena jumlah transaksi yang bisa masuk ke satu blok terus berkurang",
      ],
      "Batas pasokan sekitar 21 juta koin membuat laju pencetakan koin baru harus melambat lewat halving.",
    ),
    c(
      "u3l6b4",
      "Ada narasi 'halving pasti pump' yang beredar luas. Bagaimana cara membacanya?",
      [
        "Itu narasi yang bisa menarik pembeli, jadi kewaspadaan tetap perlu",
        "Itu hukum fisika pasar yang sudah terbukti di setiap siklus",
        "Itu aturan resmi jaringan yang wajib dipatuhi semua exchange",
        "Itu jaminan dari penambang bahwa pasokan akan habis total",
      ],
      "Narasi yang ramai dipercaya bisa mendorong pembelian, dan itu justru alasan untuk tetap berhati-hati.",
    ),
    c(
      "u3l6b5",
      "Kalau harga BTC turun tepat setelah halving, apa artinya?",
      [
        "Halving bukan penentu arah harga, karena permintaan tetap berperan besar",
        "Halving gagal bekerja sehingga protokolnya harus diperbaiki pengembang",
        "Jaringan Bitcoin berhenti memproses blok sampai harganya naik kembali",
        "Pasokan Bitcoin sudah habis sehingga tidak ada lagi koin yang ditambang",
      ],
      "Halving hanya mengubah sisi pasokan, sedangkan arah harga tetap dipengaruhi permintaan dan likuiditas.",
    ),
    tf(
      "u3l6b6",
      "Halving memotong hadiah penambang, tetapi tidak menjamin harga Bitcoin naik setelahnya.",
      true,
      "Halving memang memperlambat pasokan baru, namun harga tetap bergantung pada permintaan pasar.",
    ),
  ],

  // ------------------------------------------------------------------ u3-l7
  "u3-l7": [
    c(
      "u3l7b1",
      "Apa fungsi Wrapped ETH (WETH) di ekosistem DeFi?",
      [
        "ETH yang dibungkus menjadi token agar bisa dipakai di kolam likuiditas",
        "Koin baru dengan harga lebih tinggi yang menggantikan ETH di bursa",
        "Biaya administrasi yang dibayar pengguna setiap kali menukar ETH",
        "Kunci pribadi tambahan yang dipakai untuk mengunci saldo ETH kamu",
      ],
      "WETH adalah ETH yang dibungkus menjadi token standar agar bisa masuk ke aplikasi DeFi yang butuh format token.",
    ),
    c(
      "u3l7b2",
      "Kamu mau mengirim SOL ke teman yang memakai alamat berawalan 0x. Apa yang harus kamu lakukan?",
      [
        "Jangan kirim, karena Solana dan Ethereum memakai sistem alamat yang berbeda",
        "Kirim saja, karena semua jaringan memakai format alamat yang sama",
        "Kirim saja, karena alamat 0x otomatis dikonversi ke alamat Solana",
        "Kirim dulu sedikit, karena transaksi yang gagal selalu dikembalikan",
      ],
      "Alamat Solana berbeda dari alamat 0x milik jaringan EVM, jadi salah kirim bisa membuat asetnya tidak bisa diambil kembali.",
    ),
    c(
      "u3l7b3",
      "WBTC itu Bitcoin asli yang dipindahkan fisik ke dompetmu?",
      [
        "Bukan, itu Bitcoin yang dititipkan lalu dicetak sebagai token di rantai lain",
        "Ya, satoshi-nya benar-benar dipindahkan tanpa pihak ketiga mana pun",
        "Ya, karena semua Bitcoin bisa dipindahkan bebas ke jaringan Ethereum",
        "Ya, selama kamu menyimpannya di perangkat keras yang tidak terhubung internet",
      ],
      "WBTC adalah token yang mewakili Bitcoin yang dititipkan pada kustodian, jadi selalu ada pihak ketiga yang terlibat.",
    ),
    c(
      "u3l7b4",
      "Kenapa memindahkan aset antar rantai lewat jembatan perlu ekstra hati-hati?",
      [
        "Karena jembatan menambah pihak dan kode baru yang bisa bermasalah",
        "Karena aset yang sudah menyeberang tidak bisa dilihat di wallet mana pun",
        "Karena jembatan hanya bisa dipakai sekali untuk setiap alamat wallet",
        "Karena aset yang menyeberang otomatis berubah menjadi token tanpa nilai",
      ],
      "Jembatan menambah lapisan pihak ketiga dan kode baru, dan di situlah risiko tambahannya muncul.",
    ),
    c(
      "u3l7b5",
      "Solana, BNB Chain, dan Base semuanya jaringan yang berbeda dari Ethereum. Apa konsekuensi praktisnya?",
      [
        "Alamat dan biaya transaksinya bisa berbeda, jadi jangan asal kirim",
        "Alamat dan biaya transaksinya selalu sama karena standarnya seragam",
        "Alamatnya berbeda, tetapi biaya transaksinya selalu sama di semua jaringan",
        "Biayanya berbeda, tetapi alamatnya selalu bisa dipakai di semua jaringan",
      ],
      "Setiap jaringan bisa punya format alamat dan struktur biaya sendiri, jadi kirim aset harus ke jaringan yang benar.",
    ),
    match(
      "u3l7b6",
      "Setiap token bungkusan punya asal berbeda. Pasangkan yang sesuai.",
      [
        { left: "WETH", right: "ETH yang dibungkus" },
        { left: "WBTC", right: "BTC yang dititipkan" },
        { left: "USDT di Ethereum", right: "Token ERC-20" },
        { left: "SOL", right: "Koin jaringan Solana" },
      ],
      "Token bungkusan mewakili aset lain lewat mekanisme titip dan cetak, jadi selalu ada pihak yang menjaminnya.",
    ),
    tf(
      "u3l7b7",
      "Mengirim SOL ke alamat 0x Ethereum tetap akan sampai karena semua jaringan saling terhubung otomatis.",
      false,
      "Solana dan Ethereum memakai sistem alamat yang berbeda, jadi aset yang salah kirim bisa hangus.",
    ),
  ],
};

/**
 * Sisipkan bank soal ke blok yang cocok.
 *
 * Soal bank DITARUH SETELAH soal lama supaya soal lama tetap tampil lebih dulu
 * (urutan authoring tidak berubah), dan id yang sudah ada tidak pernah
 * ditimpa. Ini menjaga guard duplikat id di `assert-curriculum-integrity.ts`.
 */
export function withBank<
  E extends { id: string },
  L extends { id: string; exercises: E[] },
  U extends { lessons: L[] },
>(units: U[]): U[] {
  return units.map((unit) => ({
    ...unit,
    lessons: unit.lessons.map((lesson) => {
      const extra = QUIZ_BANK[lesson.id];
      if (!extra?.length) return lesson;
      const existing = new Set(lesson.exercises.map((ex) => ex.id));
      const fresh = extra.filter((ex) => !existing.has(ex.id)) as unknown as E[];
      if (!fresh.length) return lesson;
      return { ...lesson, exercises: [...lesson.exercises, ...fresh] };
    }),
  }));
}
