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
  // ------------------------------------------------------------------ u1-l1
  "u1-l1": [
      c(
        "u1l1b1",
        "Akun GoPay-mu kena hack dan saldonya raib. Kamu bisa minta bantuan CS. Tapi kalau kunci wallet Web3 hilang, kenapa nggak ada yang bisa memulihkannya?",
        [
        "Karena aset Web3 dipegang kuncimu sendiri, bukan disimpan perusahaan",
        "Karena CS Web3 memang belum buka cabang di Indonesia",
        "Karena wallet Web3 dilarang memakai layanan pelanggan oleh pembuatnya",
        "Karena kuncinya cuma bisa dibaca oleh aplikasi versi terbaru saja",
        ],
        "Di Web3 nggak ada tombol lupa password dari CS karena kunci dan tanggung jawabnya ada di kamu sendiri.",
      ),
      tf(
        "u1l1b2",
        "Di Web3, siapa pun yang memegang kunci wallet berarti menguasai aset di dalamnya.",
        true,
        "Kunci wallet adalah bukti kepemilikan aset, jadi yang menyimpannya memang yang mengendalikannya.",
      ),
      blank(
        "u1l1b3",
        "Blockchain itu buku kas yang disalin ke ___ komputer, makanya susah diubah diam-diam.",
        [
        "banyak",
        "satu kantor pusat",
        "satu server keramat",
        "satu lembaga negara",
        ],
        "Salinannya tersebar di banyak komputer, jadi mengubah catatan harus menipu hampir semua salinan.",
      ),
      c(
        "u1l1b4",
        "Kenapa memalsukan catatan di blockchain jauh lebih sulit daripada mengubah data di satu server perusahaan?",
        [
        "Karena penyerang harus menipu hampir semua salinan di banyak komputer sekaligus",
        "Karena blockchain menyimpan datanya dalam bentuk gambar yang terenkripsi kuat",
        "Karena setiap pengguna wajib melapor ke kantor polisi sebelum mengubah data",
        "Karena server perusahaan selalu diawasi langsung oleh pemerintah setempat",
        ],
        "Blockchain disalin ke banyak komputer, jadi satu perubahan diam-diam mudah ketahuan dan ditolak jaringan.",
      ),
      tf(
        "u1l1b5",
        "Kalau kunci wallet Web3 kamu hilang, kamu tinggal menghubungi customer service untuk memulihkannya.",
        false,
        "Di Web3 nggak ada CS pusat yang bisa memulihkan kunci, jadi hilangnya kunci biasanya berarti aset ikut hilang.",
      ),
      c(
        "u1l1b6",
        "Temanmu bilang 'di Web3 nggak ada tombol lupa password'. Apa maksud sebenarnya dari kalimat itu?",
        [
          "Kunci wallet harus kamu jaga sendiri karena nggak ada pihak pusat yang bisa meresetnya",
          "Password wallet bisa diganti kapan saja lewat email yang kamu daftarkan ke aplikasi",
          "Semua wallet Web3 memang sengaja dibuat tanpa sistem pengamanan apa pun oleh pembuatnya",
          "Tombol lupa password tetap ada, tapi cuma bisa diakses oleh admin resmi jaringannya",
        ],
        "Karena kendali penuh ada di kamu, lupa atau kehilangan kunci biasanya nggak bisa dipulihkan siapa pun.",
      ),
      c(
        "u1l1b7",
        "Kenapa Web3 disebut menaruh aset di jaringan bersama, bukan di satu kantor?",
        [
        "Karena catatannya tersebar di banyak komputer, bukan disimpan satu perusahaan saja",
        "Karena semua kantor Web3 sudah ditutup dan digantikan aplikasi ponsel",
        "Karena asetnya cuma berupa angka yang dihapus setiap kali internet mati",
        "Karena catatannya disimpan di satu server rahasia milik pendiri blockchain",
        ],
        "Blockchain mencatat aset di jaringan bersama yang disalin banyak komputer, jadi nggak bergantung satu kantor.",
      ),
  ],
  // ------------------------------------------------------------------ u1-l2
  "u1-l2": [
      c(
        "u1l2b1",
        "Kamu lupa PIN m-banking dan bisa meresetnya setelah tunjukkan KTP. Kenapa hal serupa nggak berlaku di wallet Web3?",
        [
        "Karena blockchain nggak mengenal identitas seperti KTP untuk memulihkan akses",
        "Karena KTP dianggap terlalu mahal untuk disimpan di dalam blockchain",
        "Karena bank melarang nasabahnya memakai wallet Web3 di waktu bersamaan",
        "Karena Web3 cuma bisa dipakai oleh orang yang belum punya rekening bank",
        ],
        "Bank bisa reset PIN setelah kamu buktikan identitas, sedangkan blockchain nggak punya mekanisme pengenalan KTP.",
      ),
      tf(
        "u1l2b2",
        "Di Web3 kamu bisa mengirim aset ke orang lain tanpa meminta izin bank terlebih dahulu.",
        true,
        "Justru itu inti kendali di Web3, kamu sendiri yang menandatangani dan mengirim tanpa perantara bank.",
      ),
      match(
        "u1l2b3",
        "Pasangkan layanan dengan pihak yang memegang kendali asetnya.",
        [
          { left: "GoPay", right: "Perusahaan penyedia aplikasi" },
          { left: "Rekening bank", right: "Bank yang menerbitkan rekening" },
          { left: "Wallet Web3", right: "Kamu sendiri lewat kuncimu" },
        ],
        "Di Web2 kendali ada di perusahaan, sedangkan di Web3 kendali penuh ada di pemegang kunci.",
      ),
      c(
        "u1l2b4",
        "Kamu salah kirim aset lewat wallet Web3 ke alamat yang keliru. Apa yang biasanya terjadi?",
        [
        "Transaksinya sulit dibatalkan karena blockchain nggak punya tombol batal",
        "Asetnya otomatis balik ke wallet kamu setelah beberapa menit menunggu",
        "Bank akan menahan transfer itu sampai kamu mengajukan keberatan resmi",
        "Kamu cukup menghubungi pendiri jaringan untuk meminta pengembalian",
        ],
        "Kripto on-chain (tercatat langsung di blockchain) biasanya final, jadi salah kirim susah ditarik kembali oleh pihak mana pun.",
      ),
      tf(
        "u1l2b5",
        "Di Web3, kamu selalu bisa membatalkan transfer yang sudah terkonfirmasi kalau salah alamat.",
        false,
        "Transaksi yang sudah terkonfirmasi bersifat final, jadi nggak ada tombol batal seperti di layanan bank.",
      ),
      c(
        "u1l2b6",
        "Apa keuntungan sekaligus harga yang kamu bayar saat memakai Web3 dibanding Web2?",
        [
        "Kamu dapat kendali penuh, tapi kehilangan kenyamanan layanan pemulihan akun",
        "Kamu dapat kenyamanan CS, tapi semua asetmu dikelola oleh perusahaan besar",
        "Kamu dapat harga koin lebih murah, tapi harus membayar biaya bulanan tetap",
        "Kamu dapat keamanan mutlak, tapi nggak bisa memakai internet sama sekali",
        ],
        "Web3 menukar kenyamanan seperti lupa password dengan kendali penuh yang jadi tanggung jawabmu sendiri.",
      ),
      c(
        "u1l2b7",
        "Temanmu ingin kepraktisan seperti Web2 tapi juga mau pegang kunci sendiri di Web3. Apa yang perlu dia sadari?",
        [
        "Kedua hal itu saling bertukar, makin banyak kendali makin sedikit kenyamanan pemulihan",
        "Kedua hal itu bisa didapat bersamaan tanpa mengorbankan apa pun sama sekali",
        "Kendali dan kenyamanan nggak ada hubungannya dengan cara kerja wallet",
        "Kenyamanan di Web3 otomatis lebih tinggi daripada layanan Web2 biasa",
        ],
        "Web2 unggul di kenyamanan, Web3 unggul di kendali, dan keduanya memang tarik-menarik.",
      ),
  ],
  // ------------------------------------------------------------------ u1-l3
  "u1-l3": [
      c(
        "u1l3b1",
        "Siapa yang bertugas menjaga jaringan dan mengecek transaksi di blockchain?",
        [
        "Komputer yang disebut validator, dulu sering disebut miner",
        "Petugas customer service yang bertugas di kantor pusat jaringan",
        "Pengguna yang paling sering membuka aplikasi wallet setiap hari",
        "Pemerintah negara tempat server blockchain itu didirikan pertama kali",
        ],
        "Validator, yang dulu sering disebut miner, adalah komputer yang menjaga dan mengecek transaksi jaringan.",
      ),
      tf(
        "u1l3b2",
        "Transaksi blockchain bisa dilihat siapa pun di explorer, tapi itu bukan berarti namamu tertulis di sana.",
        true,
        "Jaringan bersifat transparan lewat explorer, tetapi identitas asli pemilik alamat nggak otomatis terbuka.",
      ),
      blank(
        "u1l3b3",
        "Tiap blok disambung ke blok ___ sehingga riwayatnya susah diubah diam-diam.",
        [
        "sebelumnya",
        "berikutnya",
        "paling baru",
        "paling awal",
        ],
        "Rantai blok saling mengunci ke blok sebelumnya, jadi mengubah satu bagian merusak keseluruhan rantai.",
      ),
      c(
        "u1l3b4",
        "Satu warung kopi yang menyimpan salinan buku kas blockchain rusak komputernya. Apa yang terjadi pada jaringan?",
        [
        "Jaringan tetap jalan karena salinannya masih ada di banyak komputer lain",
        "Seluruh jaringan berhenti sampai komputer itu selesai diperbaiki",
        "Semua transaksi yang pernah tercatat otomatis terhapus selamanya",
        "Buku kasnya pindah otomatis ke rekening bank pemilik warung",
        ],
        "Karena salinannya banyak, rusaknya satu mesin nggak mematikan jaringan secara keseluruhan.",
      ),
      tf(
        "u1l3b5",
        "Mengubah riwayat transaksi di blockchain cukup dengan menelepon pengelola jaringannya.",
        false,
        "Nggak ada pengelola pusat yang bisa dihubungi, mengubah riwayat butuh mengalahkan mayoritas jaringan.",
      ),
      c(
        "u1l3b6",
        "Transaksi blockchain bisa dilihat siapa pun, tapi kenapa itu belum tentu membuka identitasmu?",
        [
        "Yang tercatat itu alamat, bukan nama asli pemiliknya",
        "Karena explorer menyensor semua data yang mencurigakan pengguna",
        "Karena transaksinya disamarkan menjadi bentuk gambar oleh jaringan",
        "Karena cuma validator yang boleh membaca isi transaksinya",
        ],
        "Transparan berarti siapa pun bisa melihat catatan, tapi yang terlihat cuma alamat, bukan identitas pemiliknya.",
      ),
      c(
        "u1l3b7",
        "Kenapa rusaknya satu komputer penyimpan salinan blockchain nggak bikin jaringan mati?",
        [
        "Karena banyak komputer lain menyimpan salinan yang sama",
        "Karena blockchain menyimpan cadangannya di dalam kartu SIM pengguna",
        "Karena komputer yang rusak langsung diganti oleh pemerintah setempat",
        "Karena data blockchain cuma tersimpan selama satu hari lalu dihapus",
        ],
        "Jaringan blockchain disalin ke banyak komputer, jadi nggak bergantung pada satu mesin saja.",
      ),
  ],
  // ------------------------------------------------------------------ u1-l4
  "u1-l4": [
      c(
        "u1l4b1",
        "Saldo rekening bank di Indonesia dilindungi lembaga penjamin simpanan (LPS) sampai batas tertentu. Kenapa kripto on-chain nggak punya jaminan seperti itu?",
        [
          "Karena kripto on-chain disimpan sendiri oleh pemegang kunci, bukan di bank yang dijamin negara",
          "Karena kripto on-chain cuma bisa dipegang oleh warga negara asing yang punya izin resmi dari negaranya",
          "Karena lembaga penjamin di Indonesia memang melarang semua bentuk aset digital apa pun",
          "Karena saldo kripto sebenarnya tersimpan di dalam kartu ATM khusus antarbangsa milik bank",
        ],
        "Jaminan bank berlaku karena saldo dikelola lembaga resmi, sedangkan kripto dipegang sendiri dan bersifat final.",
      ),
      tf(
        "u1l4b2",
        "Stablecoin seperti USDT didesain mengikuti harga dolar, jadi lebih tenang daripada meme coin, walau bukan berarti nol risiko.",
        true,
        "Stablecoin dirancang menempel ke dolar sehingga lebih stabil, tetapi tetap punya risiko yang nyata.",
      ),
      blank(
        "u1l4b3",
        "Token yang nilainya dirancang menempel ke dolar, seperti USDT, biasa disebut ___.",
        [
        "stablecoin",
        "meme coin",
        "bitcoin",
        "altcoin",
        ],
        "Stablecoin didesain mengikuti dolar supaya harganya lebih stabil dibanding koin lain.",
      ),
      c(
        "u1l4b4",
        "Transfer bank salah kirim sering bisa dikomplain, tapi kirim USDT ke alamat salah di blockchain nggak. Kenapa bedanya?",
        [
          "Karena bank punya mekanisme penarikan kembali, transaksi on-chain final",
          "Karena USDT memang dirancang untuk hilang kalau salah kirim ke alamat yang keliru",
          "Karena blockchain menyimpan saldo di rekening bank yang terpisah dari kuncimu",
          "Karena teller blockchain sengaja nggak mau membantu pelanggannya yang bingung",
        ],
        "Transfer bank bisa diproses ulang lewat bank, sementara transaksi on-chain yang terkonfirmasi jarang bisa ditarik balik.",
      ),
      tf(
        "u1l4b5",
        "Kalau kamu salah transfer kripto on-chain, petugas bank bisa menariknya kembali seperti transfer bank biasa.",
        false,
        "Kripto on-chain biasanya final, jadi nggak ada petugas yang bisa membatalkan atau menariknya kembali.",
      ),
      c(
        "u1l4b6",
        "Kenapa saldo rekening bank bisa di-refund saat salah transfer, sementara kripto on-chain jarang?",
        [
          "Karena bank punya lembaga pusat yang bisa membalik transaksi",
          "Karena saldo bank tersimpan dalam bentuk kertas yang bisa ditukar kembali",
          "Karena kripto memang sengaja dibuat untuk menghukum penggunanya sendiri",
          "Karena blockchain menyimpan semua transaksinya di lemari besi pusat yang dijaga",
        ],
        "Ada otoritas pusat di bank yang bisa membalik transaksi, sedangkan blockchain nggak mengenal pembatalan.",
      ),
      c(
        "u1l4b7",
        "Temanmu bilang 'stablecoin kan aman, jadi boleh taruh semua tabungan di situ'. Bagaimana kamu menanggapinya?",
        [
        "Stablecoin lebih tenang dari meme coin, tapi tetap bukan nol risiko",
        "Stablecoin dijamin penuh oleh negara, sama seperti tabungan bank biasa",
        "Stablecoin nggak pernah bisa kehilangan nilainya dalam kondisi apa pun",
        "Stablecoin cuma bisa dipakai untuk membeli gambar NFT saja",
        ],
        "Stablecoin dirancang mengikuti dolar sehingga lebih stabil, tetapi tetap punya risiko yang perlu dihitung.",
      ),
  ],
  // ------------------------------------------------------------------ u1-l5
  "u1-l5": [
      c(
        "u1l5b1",
        "Temanmu butuh tukar token tanpa lewat bank. Layanan Web3 apa yang dia pakai?",
        [
        "DeFi, layanan keuangan yang jalan tanpa bank dan tanpa teller",
        "DAO, komunitas yang mengumpulkan kas dan mengadakan voting",
        "NFT, token unik yang sering dipakai untuk tiket konser",
        "Airdrop, pembagian token gratis untuk pengguna baru",
        ],
        "DeFi menyediakan tukar, pinjam, dan likuiditas tanpa bank, walaupun tetap ada risiko kontrak.",
      ),
      tf(
        "u1l5b2",
        "Di Web3 orang bisa mendapat penghasilan dari kerja community, bounty, atau grant, bukan cuma dari trading.",
        true,
        "Ada banyak pintu penghasilan di Web3 seperti kerja komunitas, bounty, dan grant, bukan hanya trading.",
      ),
      match(
        "u1l5b3",
        "Cocokkan istilah Web3 dengan artinya.",
        [
          { left: "DeFi", right: "Layanan keuangan tanpa bank dan tanpa petugas" },
          { left: "DAO", right: "Komunitas dengan kas bersama dan voting" },
          { left: "NFT", right: "Karya, tiket, atau identitas yang unik" },
        ],
        "Setiap pintu Web3 punya fungsi berbeda, dari keuangan sampai komunitas dan karya digital.",
      ),
      c(
        "u1l5b4",
        "Temanmu mengira DAO itu kantor dengan gaji otomatis tiap bulan. Apa penjelasan yang lebih tepat?",
        [
          "DAO itu komunitas dengan kas on-chain dan voting, bukan kantor",
          "DAO itu aplikasi pencatat gaji pegawai yang berjalan tanpa campur manusia",
          "DAO itu bank sentral yang mengatur harga semua token di dalam jaringan",
          "DAO itu kumpulan trader yang wajib lapor keuntungan setiap hari ke admin",
        ],
        "DAO adalah komunitas dengan kas bersama dan voting, dan nggak otomatis berubah jadi kantor.",
      ),
      tf(
        "u1l5b5",
        "Satu-satunya cara mencari uang di Web3 adalah trading dengan mengikuti pergerakan chart.",
        false,
        "Web3 punya banyak pintu lain seperti kerja, bounty, grant, dan proyek komunitas, bukan cuma trading.",
      ),
      c(
        "u1l5b6",
        "Selain dipakai sebagai foto profil, NFT bisa dipakai untuk apa di Web3?",
        [
        "Tiket acara, identitas, atau sertifikat yang kepemilikannya tercatat",
        "Menambah kecepatan internet pengguna di seluruh dunia",
        "Menghapus riwayat transaksi yang dianggap merugikan pemiliknya",
        "Menggantikan fungsi validator dalam mengecek transaksi jaringan",
        ],
        "NFT bisa menandai kepemilikan unik untuk tiket, identitas, item game, atau sertifikat, bukan cuma gambar.",
      ),
      c(
        "u1l5b7",
        "Empat temanmu masuk Web3. Satu menukar koin di DEX (bursa tanpa perantara), satu magang di komunitas. Satu menulis proposal DAO, satu membuat tiket konser NFT. Apa kesimpulannya?",
        [
        "Web3 punya banyak pintu, jadi nggak semua orang harus jadi trader",
        "Mereka semua sebenarnya sedang melakukan trading yang sama",
        "Hanya yang swap di DEX yang benar-benar berada di Web3",
        "Kegiatan selain trading itu cuma hobi tanpa nilai ekonomi",
        ],
        "Web3 itu banyak gang, jadi orang bisa berkarya dan bekerja lewat jalur yang berbeda-beda.",
      ),
  ],
  // ------------------------------------------------------------------ u1-l6
  "u1-l6": [
      c(
        "u1l6b1",
        "Kamu kirim USDT dan statusnya masih pending selama beberapa menit. Apa artinya?",
        [
        "Transaksinya masih mengantri di mempool, bukan berarti uangmu hilang",
        "Transaksinya sudah selesai dan tinggal menunggu tampil di saldo",
        "Transaksinya ditolak permanen dan dananya kembali ke pengirim",
        "Transaksinya otomatis dibatalkan setelah sepuluh menit menunggu",
        ],
        "Pending berarti transaksi masih antri di mempool dan bisa lama kalau gas rendah atau jaringan ramai.",
      ),
      tf(
        "u1l6b2",
        "Transaksi yang masih pending berarti masih mengantri di mempool, bukan berarti uangmu hilang.",
        true,
        "Pending hanya menandakan transaksinya belum masuk blok, jadi dananya belum tentu hilang.",
      ),
      blank(
        "u1l6b3",
        "Antrian tempat transaksi menunggu dipilih oleh validator disebut ___.",
        [
        "mempool",
        "explorer",
        "wallet",
        "minting",
        ],
        "Mempool adalah antrian tempat transaksi menunggu sebelum validator memasukkannya ke blok.",
      ),
      c(
        "u1l6b4",
        "Kamu kirim kripto ke bursa (CEX). Kenapa bursa sering menunggu beberapa konfirmasi sebelum menambah saldomu?",
        [
        "Karena makin banyak blok di atasnya, makin susah transaksi itu dibalik",
        "Karena bursa sengaja menahan dana agar bisa dipakai berinvestasi",
        "Karena konfirmasi dipakai untuk menghitung pajak transaksi pengguna",
        "Karena setiap konfirmasi menambah biaya admin yang harus dibayar",
        ],
        "Makin banyak blok menumpuk di atas transaksi, makin sulit dibalik, jadi bursa menunggu agar aman.",
      ),
      tf(
        "u1l6b5",
        "Begitu kamu klik kirim di wallet, transaksinya langsung selesai dan nggak bisa diganti lagi.",
        false,
        "Setelah klik kirim, transaksi masih mengantri di mempool dan baru dianggap selesai setelah masuk blok.",
      ),
      c(
        "u1l6b6",
        "Transaksimu pending terlalu lama dan kamu ingin mempercepatnya. Apa langkah yang masuk akal?",
        [
        "Ganti transaksi itu dengan gas lebih tinggi supaya segera dipilih validator",
        "Kirim transaksi baru dengan nominal lebih besar agar yang lama batal",
        "Matikan lalu nyalakan ulang ponsel supaya transaksinya diproses",
        "Hubungi validator jaringan untuk meminta antreanmu dilompati",
        ],
        "Transaksi pending kadang bisa diganti dengan gas lebih tinggi, dan jangan kirim berulang agar nggak dobel.",
      ),
      c(
        "u1l6b7",
        "Apa yang dimaksud finalitas dalam transaksi blockchain?",
        [
          "Titik saat transaksi dianggap hampir mustahil dibalik lagi",
          "Batas waktu maksimal yang diberikan wallet sebelum transaksi ditolak",
          "Jumlah biaya gas terendah yang boleh kamu bayar saat mengirim",
          "Nama lain dari antrean transaksi yang belum masuk ke dalam blok",
        ],
        "Finalitas tercapai ketika makin banyak blok di atasnya, sehingga membalik transaksi jadi makin mustahil.",
      ),
  ],
  // ------------------------------------------------------------------ u1-l7
  "u1-l7": [
      c(
        "u1l7b1",
        "Kenapa menjaga jaringan blockchain harus dibuat mahal?",
        [
          "Supaya menulis blok palsu jadi terlalu mahal untuk dilakukan",
          "Supaya pengguna membayar lebih banyak biaya ke kantor pusat jaringannya sendiri",
          "Supaya validator bisa mendapat gaji tetap setiap bulan dari pemerintah",
          "Supaya harga koin selalu naik mengikuti permintaan pasar dunia luas",
        ],
        "Biaya yang mahal membuat kecurangan nggak sepadan, jadi jaringan lebih aman dari penyerang.",
      ),
      tf(
        "u1l7b2",
        "Ethereum pindah ke PoS lewat Merge 2022, sementara Bitcoin tetap memakai PoW.",
        true,
        "Ethereum beralih ke PoS saat Merge 2022, sedangkan Bitcoin tetap bertahan dengan PoW.",
      ),
      match(
        "u1l7b3",
        "Pasangkan istilah konsensus dengan penjelasannya.",
        [
          { left: "PoW", right: "Bayar listrik dan mesin untuk memecahkan teka-teki" },
          { left: "PoS", right: "Mengunci aset yang bisa dipotong kalau curang" },
          { left: "Slash", right: "Potongan aset validator PoS yang berbuat curang" },
        ],
        "PoW membayar lewat listrik, PoS lewat aset terkunci, dan validator curang di PoS bisa terkena slash.",
      ),
      c(
        "u1l7b4",
        "Apa yang terjadi pada validator PoS yang berbuat curang?",
        [
        "Asetnya bisa di-slash, yaitu dipotong sebagai hukuman",
        "Asetnya otomatis digandakan supaya dia berhenti berbuat curang",
        "Asetnya dipindahkan ke rekening bank milik jaringan tersebut",
        "Asetnya dibekukan sampai dia meminta maaf kepada pengguna lain",
        ],
        "Slash adalah potongan aset bagi validator PoS yang curang, sehingga kecurangan jadi merugikan pelakunya.",
      ),
      tf(
        "u1l7b5",
        "Validator bisa mengembalikan transfer yang salah alamat seperti petugas layanan bank.",
        false,
        "Validator cuma menulis urutan transaksi, mereka nggak bisa membatalkan atau mengembalikan transfer salah.",
      ),
      c(
        "u1l7b6",
        "Temanmu bilang 'ETH udah nggak ditambang, berarti ETH-nya palsu'. Bagaimana menanggapinya?",
        [
        "Salah, yang berubah cuma cara menjaga jaringan dari PoW ke PoS, bukan keaslian koinnya",
        "Benar, koin yang nggak ditambang memang otomatis kehilangan keasliannya",
        "Benar, Ethereum sudah digantikan oleh jaringan lain yang masih menambang",
        "Salah, karena Ethereum sebenarnya masih menambang seperti Bitcoin sampai kini",
        ],
        "Ethereum pindah ke PoS lewat Merge 2022, jadi mesin penjaganya berubah, bukan keaslian koinnya.",
      ),
      c(
        "u1l7b7",
        "Apa keunggulan utama PoS dibanding PoW?",
        [
        "PoS jauh lebih hemat listrik karena menjaga jaringan cukup dengan mengunci aset",
        "PoS menjamin harga koin selalu naik setiap kali ada transaksi baru",
        "PoS membuat semua transaksi bisa dibatalkan kalau penggunanya menyesal",
        "PoS menghapus kebutuhan validator sehingga jaringan jalan sendiri",
        ],
        "PoS hemat energi karena yang dijaga adalah aset terkunci, sedangkan PoW bergantung pada listrik dan mesin.",
      ),
  ],
  // ------------------------------------------------------------------ u2-l1
  "u2-l1": [
      c(
        "u2l1b1",
        "Sebenarnya di mana koinmu disimpan saat kamu pakai wallet?",
        [
        "Koin tetap tercatat di blockchain, wallet cuma menyimpan kuncinya",
        "Koin tersimpan sebagai file di dalam aplikasi wallet di ponselmu",
        "Koin disimpan di server perusahaan pembuat aplikasi walletnya",
        "Koin berpindah ke dompet digital bank setiap kali kamu membuka app",
        ],
        "Wallet cuma memegang kunci untuk menandatangani transaksi dan membaca saldo, koinnya ada di blockchain.",
      ),
      tf(
        "u2l1b2",
        "Saldo yang tampil di wallet sebenarnya cuma bacaan dari blockchain, bukan file koin yang tersimpan di HP.",
        true,
        "Angka saldo di wallet adalah hasil pembacaan dari blockchain, bukan file koin yang nempel di perangkat.",
      ),
      blank(
        "u2l1b3",
        "Wallet sebenarnya menyimpan ___, bukan koinnya.",
        [
        "kunci",
        "koin asli",
        "saldo rupiah",
        "gambar profil",
        ],
        "Wallet menyimpan kunci untuk menandatangani transaksi, sedangkan koinnya tercatat di blockchain.",
      ),
      c(
        "u2l1b4",
        "Kamu pindah dari MetaMask ke wallet lain dengan seed yang sama. Apa yang terjadi pada asetmu?",
        [
          "Asetmu tetap bisa diakses karena pintunya sama, kuncinya beda",
          "Asetmu otomatis pindah ke wallet baru dan menghilang dari wallet yang lama",
          "Asetmu terkunci sampai kamu menghubungi CS kedua aplikasi wallet tersebut",
          "Asetmu digandakan karena tercatat di dua aplikasi wallet sekaligus bersamaan",
        ],
        "Mengganti aplikasi wallet dengan seed yang sama itu seperti mengganti gantungan kunci, pintunya tetap sama.",
      ),
      tf(
        "u2l1b5",
        "Merk aplikasi wallet menentukan harga koin yang kamu pegang.",
        false,
        "Wallet cuma alat untuk menandatangani dan membaca saldo, dia nggak bisa menentukan harga koin.",
      ),
      c(
        "u2l1b6",
        "Kenapa merk aplikasi wallet nggak sepenting seed phrase-nya?",
        [
        "Karena seed yang sama bisa membuka asetmu di wallet mana pun",
        "Karena semua aplikasi wallet harganya sama dan gratis selamanya",
        "Karena merk wallet menentukan jumlah koin yang bisa kamu beli",
        "Karena seed phrase cuma berfungsi di aplikasi yang membuatnya",
        ],
        "Seed adalah master backup yang bisa dipakai di wallet mana pun, jadi merek aplikasinya nggak sepenting itu.",
      ),
      c(
        "u2l1b7",
        "Temanmu rajin membuka wallet tiap hari berharap harganya naik. Apa anggapan yang tepat soal wallet?",
        [
        "Wallet itu alat, bukan penasihat yang bisa menjamin harga naik",
        "Wallet bisa menaikkan harga kalau dibuka pada jam tertentu",
        "Wallet menyimpan koin di dalamnya sehingga bisa menaikkan nilai",
        "Wallet punya tombol rahasia untuk mengubah harga pasar koin",
        ],
        "Wallet cuma alat untuk mengakses aset, dia nggak bisa mengatur atau menjamin harga pasar.",
      ),
  ],
  // ------------------------------------------------------------------ u2-l2
  "u2-l2": [
      c(
        "u2l2b1",
        "Apa fungsi utama seed phrase di sebuah wallet?",
        [
        "Jadi master backup untuk memulihkan seluruh wallet dan kuncinya",
        "Jadi kode voucher diskon untuk membeli koin di bursa",
        "Jadi nama panggilan wallet yang ditampilkan di aplikasi",
        "Jadi PIN rahasia untuk menarik saldo lewat mesin ATM",
        ],
        "Seed phrase adalah master backup, siapa pun yang memilikinya bisa memulihkan dan menguras wallet itu.",
      ),
      tf(
        "u2l2b2",
        "Siapa pun yang punya seed phrase kamu bisa membuka wallet yang sama dan menguras isinya.",
        true,
        "Seed phrase setara nyawa wallet, jadi pemiliknya bisa membuka wallet yang sama di perangkat mana pun.",
      ),
      blank(
        "u2l2b3",
        "Seed phrase biasanya terdiri dari ___ kata berurutan.",
        [
        "12 atau 24",
        "4 atau 6",
        "2 atau 3",
        "50 atau 100",
        ],
        "Saat membuat wallet, kamu biasanya mendapat 12 atau 24 kata berurutan sebagai master backup.",
      ),
      c(
        "u2l2b4",
        "Ada form airdrop yang memintamu mengetik 12 kata seed phrase. Apa yang harus kamu lakukan?",
        [
        "Tinggalkan form itu karena airdrop resmi nggak pernah minta seed",
        "Isi formnya dengan cepat supaya tokennya nggak diambil orang lain",
        "Kirim seednya ke admin lewat DM agar diverifikasi lebih dulu",
        "Masukkan cuma separuh seed supaya tetap aman tapi tetap dapat",
        ],
        "Airdrop resmi cuma butuh alamat, jadi permintaan seed adalah ciri penipuan yang harus dihindari.",
      ),
      tf(
        "u2l2b5",
        "Airdrop resmi biasanya mewajibkan kamu mengetik seed phrase di form supaya tokennya masuk.",
        false,
        "Airdrop yang sah nggak pernah meminta seed phrase, cukup alamat wallet saja.",
      ),
      c(
        "u2l2b6",
        "Cara menyimpan seed phrase yang paling aman itu seperti apa?",
        [
        "Tulis di kertas atau plat, lalu simpan offline dan jangan difoto",
        "Screenshot lalu simpan di Google Drive agar gampang dicari",
        "Kirim ke chat sendiri supaya bisa dibuka dari mana saja",
        "Simpan di aplikasi catatan yang terhubung ke internet",
        ],
        "Seed paling aman disimpan offline di kertas atau plat, karena screenshot atau cloud mudah bocor.",
      ),
      c(
        "u2l2b7",
        "Ada orang DM kamu: 'validasi wallet, ketik 12 katamu di sini'. Bagaimana kamu menyikapinya?",
        [
        "Abaikan, karena itu pola penipuan yang mengincar seed phrase kamu",
        "Turuti saja, karena validasi resmi memang butuh 12 kata itu",
        "Kirim seednya dulu, nanti diganti kalau terbukti penipu",
        "Kirim setengah dulu sebagai bukti, sisanya nanti setelah cair",
        ],
        "Pihak resmi nggak pernah meminta seed, jadi DM semacam itu hampir pasti upaya menguras wallet.",
      ),
  ],
  // ------------------------------------------------------------------ u2-l3
  "u2-l3": [
      c(
        "u2l3b1",
        "Temanmu mau mengirim USDT ke kamu. Informasi apa yang kamu berikan?",
        [
        "Alamat publik atau QR wallet-mu, bukan seed atau private key",
        "Seed phrase lengkap supaya dia bisa memverifikasi walletmu",
        "Private key wallet supaya dia yakin kirim ke wallet yang benar",
        "PIN aplikasi wallet-mu supaya transfernya nggak tertahan",
        ],
        "Untuk menerima koin cukup berikan alamat publik, mirip memberi nomor rekening, tanpa membuka rahasia.",
      ),
      tf(
        "u2l3b2",
        "Alamat publik boleh dibagikan ke siapa pun, mirip seperti memberi nomor rekening.",
        true,
        "Alamat publik aman dibagikan karena fungsinya memang untuk menerima koin, seperti nomor rekening.",
      ),
      match(
        "u2l3b3",
        "Pasangkan data wallet dengan sifat kerahasiaannya.",
        [
          { left: "Alamat publik", right: "Boleh dibagikan untuk menerima koin" },
          { left: "Private key", right: "Rahasia, dipakai menandatangani transaksi" },
          { left: "PIN aplikasi", right: "Kunci lokal HP, bukan pengganti seed" },
        ],
        "Alamat boleh dipamerkan, sedangkan private key dan seed harus dijaga rahasia sepenuhnya.",
      ),
      c(
        "u2l3b4",
        "Apa hubungan antara seed phrase dan private key di sebuah wallet?",
        [
          "Seed itu master backup yang bisa menurunkan semua private key",
          "Private key adalah versi rahasia yang tidak ada hubungannya dengan seed phrase",
          "Seed phrase cuma berlaku kalau private key-nya sudah dihapus lebih dulu",
          "Keduanya sama saja dan boleh dibagikan ke siapa pun yang meminta bantuan",
        ],
        "Seed phrase adalah master backup, jadi siapa pun yang punya seed otomatis punya semua private key di wallet itu.",
      ),
      tf(
        "u2l3b5",
        "PIN atau Face ID di aplikasi wallet bisa dipakai untuk memulihkan wallet di HP baru.",
        false,
        "PIN atau Face ID cuma kunci lokal di HP itu, bukan pengganti seed untuk memulihkan wallet di perangkat lain.",
      ),
      c(
        "u2l3b6",
        "HP kamu rusak, tapi seed phrase aman. Bagaimana kondisi asetmu?",
        [
        "Asetmu masih selamat karena bisa dibuka kembali pakai seed di wallet lain",
        "Asetmu hangus karena kuncinya cuma tersimpan di HP yang rusak itu",
        "Asetmu pindah otomatis ke wallet orang yang menemukan HP-mu",
        "Asetmu terkunci sampai HP yang rusak itu selesai diperbaiki",
        ],
        "Karena kunci sesungguhnya ada di seed, HP rusak nggak jadi masalah selama seed-nya aman.",
      ),
      c(
        "u2l3b7",
        "HP kamu aman, tapi seed phrase-nya bocor ke orang lain. Apa risikonya?",
        [
        "Asetmu bisa habis karena pemilik seed bisa membuka wallet yang sama",
        "Asetmu aman karena yang bocor cuma kata, bukan kuncinya",
        "Asetmu tetap terkunci oleh PIN aplikasi di HP-mu saja",
        "Asetmu cuma bisa dilihat tapi nggak bisa dipindahkan orang lain",
        ],
        "Seed setara nyawa wallet, jadi bocornya seed berarti orang lain bisa membuka dan menguras asetmu.",
      ),
  ],
  // ------------------------------------------------------------------ u2-l4
  "u2-l4": [
      c(
        "u2l4b1",
        "Setelah menempelkan alamat wallet tujuan, kebiasaan mengecek yang dianjurkan itu apa?",
        [
        "Cek 6 karakter awal dan 6 karakter akhir alamatnya",
        "Cek panjang total alamatnya apakah lebih dari lima puluh karakter",
        "Cek warna ikon koin yang muncul di sebelah alamat tujuan",
        "Cek jumlah saldo wallet tujuan sebelum transfer dikirim",
        ],
        "Cukup cek 6 karakter awal dan akhir setelah paste, karena malware bisa menukar alamat di clipboard.",
      ),
      tf(
        "u2l4b2",
        "Mengirim aset ke alamat yang sama tapi di jaringan berbeda bisa membuat asetmu nyangkut atau hilang.",
        true,
        "Tiap jaringan itu dunia terpisah, jadi alamat yang mirip di jaringan lain bisa membuat aset nyangkut atau hilang.",
      ),
      blank(
        "u2l4b3",
        "Alamat wallet di jaringan Ethereum biasanya diawali karakter ___.",
        [
        "0x",
        "0b",
        "xx",
        "88",
        ],
        "Alamat Ethereum umumnya dimulai dengan 0x, dan itu beda dari format alamat jaringan lain.",
      ),
      c(
        "u2l4b4",
        "Kamu mau kirim USDT dalam jumlah besar ke teman. Kebiasaan paling sehat sebelum kirim semua itu apa?",
        [
        "Kirim nominal kecil dulu sebagai tes, baru kirim sisanya",
        "Kirim semua sekaligus supaya hemat biaya gas transaksi",
        "Kirim ke beberapa alamat sekaligus supaya salah satunya kena",
        "Tunda transfer sampai harga USDT naik sedikit lebih tinggi",
        ],
        "Mengirim nominal kecil dulu membantu memastikan alamat dan jaringannya benar sebelum mengirim jumlah besar.",
      ),
      tf(
        "u2l4b5",
        "Selama alamat tujuannya benar, jaringan yang dipakai nggak pernah berpengaruh ke hasil transfer.",
        false,
        "Jaringan sangat berpengaruh karena tiap jaringan dunia terpisah, jadi salah jaringan bisa membuat aset nyangkut atau hilang.",
      ),
      c(
        "u2l4b6",
        "Kenapa alamat di clipboard perlu diperiksa lagi sebelum kamu klik kirim?",
        [
        "Karena malware bisa menukar alamat di clipboard dengan alamat penipu",
        "Karena clipboard otomatis menghapus alamat setelah beberapa detik",
        "Karena alamat yang benar selalu berubah setiap kali disalin",
        "Karena wallet cuma bisa membaca alamat yang diketik manual",
        ],
        "Ada malware yang menukar alamat di clipboard, jadi cek ujung dan pangkalnya setelah paste.",
      ),
      c(
        "u2l4b7",
        "Saat mau kirim USDT, tiga hal apa yang harus pas supaya aman?",
        [
        "Koinnya, jaringannya, dan alamat penerimanya",
        "Waktu kirimnya, harga koinnya, dan saldo dompetmu",
        "Nama penerimanya, fotonya, dan nomor teleponnya",
        "Warna aplikasinya, versinya, dan bahasa tampilannya",
        ],
        "Koin, jaringan, dan alamat penerima harus cocok, kalau salah satu keliru aset bisa nyangkut atau hilang.",
      ),
  ],
  // ------------------------------------------------------------------ u2-l5
  "u2-l5": [
      c(
        "u2l5b1",
        "Apa perbedaan utama hot wallet dan cold wallet?",
        [
          "Hot wallet online, cold wallet simpan kunci di perangkat offline",
          "Hot wallet selalu gratis, cold wallet selalu berbayar tiap bulan pemakaiannya",
          "Hot wallet untuk koin besar, cold wallet untuk koin kecil yang jarang dipakai",
          "Hot wallet buatan luar negeri, cold wallet buatan dalam negeri sendiri",
        ],
        "Hot wallet nyaman karena online, sedangkan cold wallet menyimpan kunci di perangkat offline yang lebih aman.",
      ),
      tf(
        "u2l5b2",
        "Kunci cold wallet nggak pernah ditaruh utuh di perangkat yang terhubung internet.",
        true,
        "Cold wallet menjaga kunci di perangkat khusus yang offline, jadi kuncinya nggak pernah utuh di mesin online.",
      ),
      blank(
        "u2l5b3",
        "Perangkat seperti Ledger atau Trezor yang menyimpan kunci secara offline disebut ___ wallet.",
        [
        "cold",
        "hot",
        "smart",
        "social",
        ],
        "Perangkat khusus penyimpan kunci offline seperti Ledger dan Trezor disebut cold wallet.",
      ),
      c(
        "u2l5b4",
        "Gaji setahunmu kamu simpan di MetaMask yang tiap hari dipakai mint NFT gratis. Apa sarannya?",
        [
          "Pisahkan tabungan ke cold wallet, sisakan uang jajan kecil di hot wallet",
          "Biarkan saja di MetaMask karena aplikasinya paling populer di kalangan pengguna",
          "Pindahkan semuanya ke akun media sosial pribadimu saja supaya mudah diakses",
          "Bagi rata ke banyak hot wallet supaya risiko kehilangannya jadi hilang",
        ],
        "Hot wallet cocok untuk uang jajan kecil, sedangkan tabungan besar lebih aman di cold wallet yang terpisah.",
      ),
      tf(
        "u2l5b5",
        "Hot wallet sama amannya dengan cold wallet untuk menyimpan tabungan besar.",
        false,
        "Hot wallet terhubung internet dan paling sering kena drainer, jadi nggak cocok untuk tabungan besar.",
      ),
      c(
        "u2l5b6",
        "Kamu pakai hardware wallet dan muncul popup di browser. Apa yang harus kamu lakukan?",
        [
          "Cek alamat dan nominal di layar perangkat kerasnya, bukan popup browser",
          "Percaya popup browser karena tampilannya selalu resmi dan rapi dibuat",
          "Klik setuju dengan cepat supaya transaksinya nggak kedaluwarsa di jaringan",
          "Matikan perangkat kerasnya lalu ulangi transaksi berkali-kali sampai berhasil",
        ],
        "Plugin browser bisa bohong, jadi hardware wallet meminta kamu memastikan alamat dan nominalnya di layar perangkat.",
      ),
      c(
        "u2l5b7",
        "Apa catatan penting soal smart wallet yang bisa memulihkan akun?",
        [
          "Smart wallet lebih fleksibel buat recovery, tetap bergantung kode kontraknya",
          "Smart wallet membuat seed phrase jadi nggak perlu dijaga lagi oleh pemiliknya",
          "Smart wallet menjamin kontraknya bebas bug selamanya",
          "Smart wallet menghapus semua risiko karena dikelola otomatis",
        ],
        "Smart wallet lebih fleksibel untuk pemulihan, tapi tetap bergantung pada keamanan kontrak yang bisa punya bug.",
      ),
  ],
  // ------------------------------------------------------------------ u2-l6
  "u2-l6": [
      c(
        "u2l6b1",
        "Bagaimana penipu menjalankan modus address poisoning?",
        [
          "Mereka kirim token kecil dari alamat yang ujungnya mirip alamatmu",
          "Mereka membobol blockchain dan menulis ulang semua riwayat transaksimu di sana",
          "Mereka menghubungi CS wallet untuk mengganti alamat penerima transaksi milikmu",
          "Mereka menukar koinmu dengan koin palsu saat kamu menukar di bursa besar",
        ],
        "Penipu mengirim nilai kecil dari alamat yang mirip supaya kamu salah salin dari riwayat transaksi.",
      ),
      tf(
        "u2l6b2",
        "Penipu address poisoning sering membuat alamat yang 6 karakter awalnya sama dan ujungnya mirip dengan alamat tujuanmu.",
        true,
        "Modus ini meniru ujung alamat yang mirip, jadi cek 6 karakter awal dan akhir jadi sangat penting.",
      ),
      match(
        "u2l6b3",
        "Pasangkan langkah dengan tindakan yang benar sebelum mengirim token.",
        [
          { left: "Sebelum kirim", right: "Cek 6 karakter awal dan akhir alamat" },
          { left: "Setelah paste", right: "Lihat ulang alamat di layar" },
          { left: "Simpan tujuan", right: "Pakai address book atau whitelist" },
        ],
        "Mengecek ujung dan pangkal, melihat ulang setelah paste, serta menyimpan alamat di buku alamat mencegah salah kirim.",
      ),
      c(
        "u2l6b4",
        "Cara paling aman menyimpan alamat tujuan yang sering kamu kirimi dana itu bagaimana?",
        [
        "Simpan di address book atau whitelist milikmu sendiri",
        "Salin saja dari riwayat transaksi masuk yang paling baru",
        "Catat di kolom komentar unggahan media sosialmu sendiri",
        "Andalkan ingatan karena alamatnya selalu sama setiap hari",
        ],
        "Address book membuatmu nggak perlu menyalin dari riwayat, sehingga nggak mudah tertipu alamat palsu.",
      ),
      tf(
        "u2l6b5",
        "Aman menyalin alamat penerima langsung dari transaksi masuk yang nggak kamu kenal.",
        false,
        "Alamat dari transaksi masuk asing justru sering jadi jebakan poisoning, jadi jangan disalin sembarangan.",
      ),
      c(
        "u2l6b6",
        "Kamu mau kirim ke nama ENS yang kamu ketik sendiri. Apa yang tetap perlu dilakukan?",
        [
        "Cek hasil resolve nama itu supaya alamatnya benar",
        "Percaya saja karena nama yang diketik sendiri selalu benar",
        "Kirim dulu dalam jumlah besar supaya hemat biaya gas",
        "Bagikan seedmu ke layanan ENS agar namanya aktif",
        ],
        "Mengetik nama sendiri lebih aman daripada riwayat acak, tapi hasil resolve-nya tetap perlu dicek.",
      ),
      c(
        "u2l6b7",
        "Datang transaksi masuk 0,0001 dari alamat yang ujungnya mirip alamat langgananmu. Apa yang sebaiknya kamu lakukan?",
        [
          "Abaikan dan tetap pakai alamat dari address book, jangan salin dari transaksi itu",
          "Salin alamat pengirimnya karena itu bukti dia sudah kenal kamu dengan sangat baik",
          "Balas kirim dengan jumlah sama supaya terlihat ramah dan sopan",
          "Simpan alamat itu ke daftar utama tanpa memeriksanya lebih dulu",
        ],
        "Transaksi masuk kecil dari alamat mirip adalah ciri poisoning, jadi pakai address book dan cek ujung pangkal.",
      ),
  ],
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
      tf(
        "u3l1b8",
        "Bitcoin dirancang supaya perpindahan nilainya bisa terjadi tanpa bank sebagai perantara.",
        true,
        "Karena tujuan awal Bitcoin memang uang digital yang nggak butuh bank di tengah.",
      ),
      tf(
        "u3l1b9",
        "Pecahan terkecil Bitcoin disebut wei, sama seperti satuan kecil di Ethereum.",
        false,
        "Karena pecahan terkecil Bitcoin bernama satoshi, sedangkan wei adalah pecahan ETH.",
      ),
      blank(
        "u3l1b10",
        "Pecahan terkecil dari Bitcoin, yang nilainya sepersejuta BTC, disebut ___.",
        [
          "satoshi, sepersejuta BTC",
          "wei, satuan di Ethereum",
          "ether, koin asli Ethereum",
          "gwei, satuan biaya gas",
        ],
        "Karena satoshi adalah satuan terkecil Bitcoin, sementara wei milik Ethereum.",
      ),
      c(
        "u3l1b11",
        "Temanmu bilang Bitcoin itu aplikasi seperti toko tempat orang menaruh program. Kenapa anggapan itu keliru?",
        [
          "Karena BTC lebih dekat ke emas digital, bukan komputer",
          "Karena Bitcoin cuma bisa dipakai di satu ponsel saja milikmu",
          "Karena Bitcoin sudah ditutup sejak tahun 2009 lalu",
          "Karena Bitcoin tidak punya harga pasar sama sekali",
        ],
        "Karena Bitcoin lebih sering dibahas sebagai penyimpan nilai, sedangkan tempat menjalankan program adalah peran Ethereum.",
      ),
      c(
        "u3l1b12",
        "Kamu dengar seseorang menyebut Bitcoin sebagai kripto pertama yang sukses besar. Apa dasar sebutan itu?",
        [
          "Bitcoin adalah kripto pertama yang sukses besar",
          "Bitcoin adalah satu-satunya koin yang diakui bank",
          "Bitcoin dibuat oleh Vitalik Buterin tahun 2015",
          "Bitcoin dipakai khusus buat bayar listrik",
        ],
        "Karena Bitcoin lahir 2009 dari nama Satoshi Nakamoto dan menjadi kripto pertama yang sukses besar.",
      ),
      c(
        "u3l1b13",
        "Kamu punya uang yang sudah dialokasikan buat bayar sewa rumah bulan ini. Teman menyarankan memasukkannya ke BTC karena harganya sedang naik. Kenapa saran itu sebaiknya ditolak?",
        [
          "Karena harga BTC bisa anjlok puluhan persen dalam sehari",
          "Karena BTC cuma bisa dibeli pakai uang asing saja",
          "Karena BTC tidak bisa disimpan lebih dari satu minggu saja",
          "Karena membeli BTC selalu melanggar hukum negara",
        ],
        "Karena harga BTC bisa turun puluhan persen dalam sehari, jadi uang kebutuhan pokok sebaiknya jangan dipakai.",
      ),
      c(
        "u3l1b14",
        "Kenapa batas sekitar 21 juta koin pada Bitcoin sering disebut bagian dari desainnya?",
        [
          "Karena kelangkaan itu memang dirancang sejak awal",
          "Karena bank sentral memutuskan jumlah itu setiap tahun",
          "Karena Bitcoin bisa dicetak ulang kapan saja tanpa batas",
          "Karena jumlahnya ditentukan oleh harga pasar harian",
        ],
        "Karena pasokan yang dibatasi sekitar 21 juta koin adalah bagian dari desain, bukan janji cuan.",
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
      tf(
        "u3l2b8",
        "Smart contract di Ethereum adalah kode yang jalan sendiri saat syaratnya terpenuhi, tanpa perlu teller.",
        true,
        "Karena kode itu dieksekusi otomatis oleh jaringan begitu kondisinya cocok, nggak ada teller.",
      ),
      tf(
        "u3l2b9",
        "Ongkos gas di Ethereum selalu sama besar, nggak terpengaruh seberapa ramai jaringannya.",
        false,
        "Karena gas naik saat jaringan ramai dan turun lagi saat sepi.",
      ),
      match(
        "u3l2b10",
        "Pasangkan istilah di Ethereum dengan penjelasannya.",
        [
          { left: "ETH", right: "koin native yang dipakai bayar gas" },
          { left: "Smart contract", right: "kode yang jalan sendiri saat syarat terpenuhi" },
          { left: "Gas", right: "ongkos transaksi di jaringan" },
        ],
        "Karena ETH adalah koin native, smart contract adalah kode otomatis, dan gas adalah ongkos transaksinya.",
      ),
      c(
        "u3l2b11",
        "Kamu mau pasang program yang jalan sendiri di Ethereum. Bagian yang menjalankan logika itu disebut apa?",
        [
        "Smart contract",
        "Chatbot pelanggan",
        "Nota notaris digital",
        "Dompet perangkat keras",
        ],
        "Karena program yang jalan sendiri di jaringan saat syaratnya terpenuhi disebut smart contract.",
      ),
      c(
        "u3l2b12",
        "Kenapa banyak orang memilih L2 atau rantai lain saat transaksi di Ethereum terasa mahal?",
        [
        "Karena mereka mengejar ongkos lebih murah dan transaksi lebih cepat",
        "Karena ETH sama sekali tidak bisa ditransfer di jaringan utama",
        "Karena L2 menghapus semua biaya transaksi",
        "Karena rantai lain menjamin keuntungan dari selisih harga",
        ],
        "Karena alasan pindah ke L2 atau rantai lain biasanya ongkos dan kecepatan, bukan karena ETH nggak bisa ditransfer.",
      ),
      c(
        "u3l2b13",
        "Kamu pakai aplikasi di Ethereum dan kodenya jalan otomatis begitu syaratnya terpenuhi. Apa yang membuat itu mungkin?",
        [
          "Smart contract jalan otomatis di jaringan tanpa petugas",
          "Ada kantor pusat yang menekan tombol di setiap transaksi",
          "Ada chatbot yang memeriksa permintaanmu satu per satu",
          "Ada notaris yang menandatangani kode itu tiap hari",
        ],
        "Karena smart contract adalah kode yang jalan sendiri di jaringan, bukan dilayani teller atau petugas.",
      ),
      c(
        "u3l2b14",
        "Kamu lihat biaya transaksi di Ethereum melonjak siang ini. Penjelasan paling masuk akal apa?",
        [
          "Jaringan sedang ramai sehingga ongkos gas ikut naik",
          "Harga ETH di exchange sedang turun perlahan hari ini",
          "Kode smart contract-nya rusak permanen di semua jaringan",
          "Jumlah koin ETH berkurang drastis di pasar terbuka",
        ],
        "Karena biaya gas naik saat jaringan ramai dan turun lagi saat aktivitasnya sepi.",
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
      tf(
        "u3l3b8",
        "Stablecoin dirancang untuk mengikuti nilai aset lain, umumnya dolar AS.",
        true,
        "Karena tujuan stablecoin memang meniru patokan aset, biasanya dolar AS.",
      ),
      tf(
        "u3l3b9",
        "Karena nilainya mengikuti dolar, stablecoin bebas dari risiko penerbit maupun depeg.",
        false,
        "Karena stablecoin tetap punya risiko penerbit, depeg, dan salah jaringan.",
      ),
      blank(
        "u3l3b10",
        "Kripto selain Bitcoin secara kasar disebut ___.",
        [
        "altcoin",
        "stablecoin",
        "wrapped",
        "satoshi",
        ],
        "Karena altcoin adalah sebutan kasar untuk kripto selain Bitcoin.",
      ),
      c(
        "u3l3b11",
        "Ada yang menawarkan dolar digital bernilai stabil buat parkir dana. Aset yang paling sering dipakai untuk itu apa?",
        [
          "USDT atau USDC yang mengikuti dolar AS",
          "Meme coin berlogo singa yang viral",
          "Token game yang belum resmi rilis",
          "Altcoin yang harganya naik 100x dalam sebulan",
        ],
        "Karena USDT dan USDC adalah stablecoin yang paling sering kelihatan dan nilainya mengikuti dolar AS.",
      ),
      c(
        "u3l3b12",
        "Kamu kirim USDT ke teman, transaksi sukses, tapi dananya nggak masuk ke dompetnya. Penyebab yang paling mungkin apa?",
        [
          "Jaringan yang dipilih beda dari jaringan dompet tujuan",
          "Stablecoin memang tidak bisa dikirim ke siapa pun juga",
          "Dolar AS sedang tutup hari itu di seluruh dunia ini",
          "Dompet temanmu tidak punya listrik sama sekali hari ini",
        ],
        "Karena stablecoin yang dikirim lewat jaringan yang salah tidak akan sampai ke tujuan.",
      ),
      c(
        "u3l3b13",
        "Sebuah meme coin muncul dengan janji keuntungan luar biasa dalam sebulan. Bagaimana kamu menyikapinya?",
        [
          "Menganggapnya spekulasi dan siap kalau hilang",
          "Langsung memakai uang darurat biar cepat kaya sekali",
          "Meminjam uang buat ikut karena dijamin pasti untung",
          "Percaya begitu saja karena logonya paling keren",
        ],
        "Karena meme coin ada di ujung spekulasi, jadi sikap dewasa adalah siap kehilangan, bukan all-in.",
      ),
      c(
        "u3l3b14",
        "Kenapa logo keren pada sebuah altcoin bukan ukuran mutu proyeknya?",
        [
          "Karena mayoritas altcoin sepi dan akhirnya mati",
          "Karena semua logo dibuat oleh bank sentral",
          "Karena logo menentukan harga jual koin itu sendiri",
          "Karena altcoin tidak pernah punya pengguna",
        ],
        "Karena mayoritas altcoin sepi atau mati, dan logo keren tidak sama dengan kualitas.",
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
      tf(
        "u3l4b8",
        "Coin adalah aset yang punya blockchain sendiri, sementara token menumpang di rantai yang sudah ada.",
        true,
        "Karena coin seperti BTC, ETH, dan SOL punya rantai sendiri, sedangkan token menumpang.",
      ),
      tf(
        "u3l4b9",
        "Karena bikin token sangat gampang, munculnya token baru di timeline otomatis tanda proyek berkualitas.",
        false,
        "Karena kemudahan bikin token justru alasan untuk lebih curiga, bukan makin percaya.",
      ),
      match(
        "u3l4b10",
        "Pasangkan jenis aset Ethereum dengan standar yang biasa dipakainya.",
        [
          { left: "Token biasa", right: "ERC-20" },
          { left: "NFT", right: "ERC-721" },
          { left: "Coin native", right: "ETH" },
        ],
        "Karena token biasa pakai ERC-20, NFT pakai ERC-721, dan coin native Ethereum adalah ETH.",
      ),
      c(
        "u3l4b11",
        "Sebuah aset di Ethereum mengikuti standar ERC-721. Aset itu sejenis apa?",
        [
        "NFT, bukan token biasa",
        "Coin dengan rantai sendiri",
        "Stablecoin yang ikut dolar",
        "Wrapped Bitcoin dari kustodian",
        ],
        "Karena NFT di Ethereum mengikuti standar ERC-721, sedangkan token biasa mengikuti ERC-20.",
      ),
      c(
        "u3l4b12",
        "Kenapa kecepatan meluncurkan token dalam hitungan menit justru bikin kamu perlu ekstra hati-hati?",
        [
          "Karena bikin token itu mudah, yang sulit bikin berguna",
          "Karena token cepat selalu dibuat oleh para peretas",
          "Karena token baru dilarang di semua exchange besar",
          "Karena token baru tidak bisa dijual lagi oleh pemiliknya",
        ],
        "Karena bikin token gampang, jadi kemudahan itu seharusnya bikin lebih curiga, bukan makin FOMO.",
      ),
      c(
        "u3l4b13",
        "Kamu lihat token baru dengan stiker Telegram yang meriah. Menurut materi, apa yang lebih penting diperiksa?",
        [
          "Kontrak, likuiditas, siapa di belakang, dan gunanya",
          "Jumlah anggota grup Telegram dan keseruan obrolannya",
          "Keindahan logo dan warna yang dipakainya",
          "Kecepatan admin membalas chat di grup itu",
        ],
        "Karena yang penting adalah kontrak, likuiditas, siapa di belakang, dan gunanya, bukan stiker atau logo.",
      ),
      c(
        "u3l4b14",
        "Di jaringan Ethereum, kenapa ETH disebut coin sedangkan USDT disebut token?",
        [
          "Karena ETH koin native rantai itu, USDT menumpang",
          "Karena USDT lebih tua daripada ETH dan Bitcoin",
          "Karena ETH cuma bisa dipakai di bank sentral",
          "Karena USDT punya rantai sendiri yang terpisah dari ETH",
        ],
        "Karena ETH adalah coin native Ethereum, sedangkan USDT menumpang sebagai token ERC-20 di rantai itu.",
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
      tf(
        "u3l5b8",
        "The Merge pada 15 September 2022 mengganti cara Ethereum mencapai kesepakatan dari penambangan ke staking.",
        true,
        "Karena setelah Merge konsensusnya memakai PoS atau staking sehingga pemakaian listriknya anjlok.",
      ),
      tf(
        "u3l5b9",
        "The DAO yang di-hack pada 2016 membuat komunitas Ethereum bulat sepakat tanpa ada perpecahan.",
        false,
        "Karena komunitas justru terbelah, dan yang menolak rollback menjadi Ethereum Classic.",
      ),
      blank(
        "u3l5b10",
        "Jaringan Ethereum pertama kali hidup pada 30 Juli 2015 dengan nama ___.",
        [
        "Frontier",
        "Merge",
        "London",
        "Classic",
        ],
        "Karena Frontier adalah nama jaringan Ethereum pertama yang menyala pada 30 Juli 2015.",
      ),
      c(
        "u3l5b11",
        "Pada 2016 The DAO di-hack puluhan juta dolar. Apa yang dilakukan mayoritas komunitas Ethereum setelahnya?",
        [
        "Membatalkan atau rollback dampak hack itu di rantai utama",
        "Menghentikan Ethereum selamanya dan pindah ke Bitcoin",
        "Mengganti nama jaringan menjadi Bitcoin Classic",
        "Membiarkan hack dan menghapus semua dompet",
        ],
        "Karena mayoritas memilih rollback sehingga lahirlah Ethereum yang kita kenal, sedangkan yang menolak menjadi ETC.",
      ),
      c(
        "u3l5b12",
        "Vitalik Buterin menulis gagasan Ethereum akhir 2013. Apa inti gagasan yang membedakannya dari Bitcoin?",
        [
          "Blockchain yang bisa menjalankan program, bukan cuma koin",
          "Blockchain yang menghapus semua biaya transaksi di dunia",
          "Blockchain yang dijalankan satu perusahaan pusat tunggal",
          "Blockchain yang hanya dipakai buat menyimpan file PDF besar",
        ],
        "Karena gagasan intinya adalah blockchain yang bisa menjalankan program, bukan cuma mengirim koin.",
      ),
      c(
        "u3l5b13",
        "Tahun 2021 pembaruan London lewat EIP-1559 membawa perubahan apa pada gas Ethereum?",
        [
        "Sebagian biaya gas dibakar",
        "Semua biaya gas dihapuskan",
        "Biaya gas dikunci selamanya",
        "Gas hanya boleh dibayar pakai BTC",
        ],
        "Karena London lewat EIP-1559 membuat sebagian biaya gas dibakar.",
      ),
      c(
        "u3l5b14",
        "Temanmu menganggap ETH itu koin baru yang muncul kemarin. Bagaimana kamu mengoreksinya dengan fakta sejarah?",
        [
          "Ethereum sudah jalan sejak 2015 dan sudah banyak berubah",
          "Ethereum baru dibuat pada 2023 oleh sebuah bank sentral besar",
          "Ethereum cuma ada di satu aplikasi ponsel saja milikmu",
          "Ethereum tidak pernah ganti cara kerjanya",
        ],
        "Karena jaringan Ethereum sudah hidup sejak 2015 dan sempat belah serta ganti mesin, jadi bukan koin kemarin.",
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
      tf(
        "u3l6b8",
        "Halving memotong hadiah blok yang diterima penambang Bitcoin, bukan menghapus risiko pemiliknya.",
        true,
        "Karena halving hanya memotong hadiah penambang, risiko harga buat pemilik tetap ada.",
      ),
      tf(
        "u3l6b9",
        "Setelah halving, harga Bitcoin otomatis naik karena pasokan barunya berkurang.",
        false,
        "Karena pasokan yang turun tidak otomatis menaikkan harga, permintaan juga harus ada.",
      ),
      blank(
        "u3l6b10",
        "Peristiwa pemotongan hadiah blok Bitcoin setiap sekitar empat tahun disebut ___.",
        [
        "halving",
        "merge",
        "fork",
        "staking",
        ],
        "Karena halving adalah nama pemotongan hadiah blok tiap sekitar empat tahun.",
      ),
      c(
        "u3l6b11",
        "Temanmu yakin harga BTC pasti melonjak setelah halving lalu mengajakmu meminjam uang. Apa respons paling waras?",
        [
          "Menolak, karena halving bukan jaminan harga naik",
          "Menerima saja karena halving itu memang hukumnya wajib",
          "Menerima karena utang tidak berisiko",
          "Menolak karena Bitcoin akan segera dihapus selamanya",
        ],
        "Karena jangan berutang buat mengejar halving, sebab kenaikan harganya bukan jaminan.",
      ),
      c(
        "u3l6b12",
        "Kenapa narasi habis halving pasti pump berbahaya buat pembeli baru?",
        [
          "Karena banyak yang beli narasi itu lalu jadi exit",
          "Karena halving dilarang oleh pemerintah pusat",
          "Karena Bitcoin tidak punya penambang lagi",
          "Karena hadiah blok selalu naik terus setiap tahun",
        ],
        "Karena banyak yang beli narasi itu, sehingga yang ketinggalan kereta sering masuk paling mahal.",
      ),
      c(
        "u3l6b13",
        "Hadiah blok Bitcoin turun dari 50 BTC sampai 3.125 BTC pada 2024. Apa penyebabnya?",
        [
          "Karena halving memang memotong hadiah blok berkala",
          "Karena penambang membayar denda ke bank sentral",
          "Karena jumlah koin bertambah tanpa batas dan selamanya",
          "Karena harga BTC dihapus dari pasar dunia",
        ],
        "Karena hadiah blok Bitcoin dipotong lewat halving yang terjadi sekitar setiap empat tahun.",
      ),
      c(
        "u3l6b14",
        "Ada klaim bahwa semua 21 juta BTC bisa diperdagangkan bebas. Kenapa itu perlu dikoreksi?",
        [
        "Karena sebagian BTC hilang, misalnya karena seed-nya lenyap",
        "Karena 21 juta itu angka yang bisa ditambah kapan saja",
        "Karena BTC hanya bisa dipakai di satu negara",
        "Karena semua BTC disimpan oleh satu bank",
        ],
        "Karena ada BTC yang hilang, misalnya seed-nya lenyap, jadi yang bisa diperdagangkan lebih kecil dari 21 juta.",
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
      tf(
        "u3l7b8",
        "WETH di Ethereum bisa ditukar balik ke ETH sekitar satu banding satu.",
        true,
        "Karena WETH memang bungkusan ETH dengan nilai yang hampir sama dan bisa di-wrap atau unwrap.",
      ),
      tf(
        "u3l7b9",
        "WBTC adalah Bitcoin asli yang benar-benar pindah ke dompetmu di Ethereum tanpa pihak lain.",
        false,
        "Karena WBTC bergantung pada kustodian yang menitipkan Bitcoin itu, jadi bukan native BTC.",
      ),
      match(
        "u3l7b10",
        "Pasangkan aset bungkusan dengan asalnya.",
        [
          { left: "WETH", right: "ETH yang dibungkus jadi token ERC-20" },
          { left: "WBTC", right: "BTC yang dititip lalu dicetak di Ethereum" },
          { left: "SOL", right: "koin native jaringan Solana" },
        ],
        "Karena WETH adalah bungkusan ETH, WBTC berasal dari BTC yang dititip, dan SOL adalah koin native Solana.",
      ),
      c(
        "u3l7b11",
        "Temanmu memberi alamat berawalan 0x lalu minta dikirim SOL. Kenapa kamu sebaiknya berhenti dulu?",
        [
          "Karena alamat 0x milik jaringan EVM, bukan Solana",
          "Karena SOL tidak bisa dikirim ke siapa pun sama sekali",
          "Karena alamat 0x hanya untuk jaringan Bitcoin",
          "Karena SOL cuma bisa dikirim lewat bank sentral",
        ],
        "Karena Solana memakai alamat yang beda dari gaya 0x, jadi SOL jangan dikirim ke alamat EVM.",
      ),
      c(
        "u3l7b12",
        "Kenapa wallet yang sama sering bisa dipakai berpindah jaringan di antara Ethereum, Base, dan Arbitrum?",
        [
          "Karena semuanya pakai alamat 0x yang kompatibel EVM",
          "Karena semua jaringan itu dikelola oleh satu perusahaan",
          "Karena alamat 0x itu otomatis terhubung ke Solana",
          "Karena wallet itu menyimpan semua koinnya di bank",
        ],
        "Karena jaringan EVM seperti Ethereum, Base, dan Arbitrum sama-sama memakai alamat 0x.",
      ),
      c(
        "u3l7b13",
        "Sebelum memindahkan aset ke rantai lain lewat jembatan, apa yang paling penting kamu cek?",
        [
          "Jaringan tujuan dan risikonya, bukan cuma tickernya",
          "Warna antarmuka jembatan yang kamu pakai setiap hari",
          "Jumlah pengikut akun media sosial resminya",
          "Kecepatan internetmu saat itu di rumah sendiri",
        ],
        "Karena memindahkan aset antar rantai itu berisiko, jadi yang dicek adalah jaringan tujuan dan risikonya.",
      ),
      c(
        "u3l7b14",
        "Kenapa BTC di Ethereum dalam bentuk WBTC bukan Bitcoin native?",
        [
          "Karena WBTC token yang dicetak setelah BTC dititipkan",
          "Karena WBTC adalah nama lain dari ETH di jaringan Ethereum",
          "Karena WBTC dibuat oleh penambang jaringan Solana",
          "Karena WBTC tidak punya harga pasar sama sekali",
        ],
        "Karena WBTC dibuat dengan menitipkan BTC ke kustodian, jadi bukan Bitcoin native.",
      ),
  ],
  // ------------------------------------------------------------------ u4-l1
  "u4-l1": [
      c(
        "u4l1b1",
        "Apa yang membuat sebuah token punya aturan yang jelas di Web3?",
        [
        "Aturannya tertulis di smart contract, bukan cuma di brosur promosi",
        "Aturannya diumumkan lewat stiker grup komunitas penjualnya",
        "Aturannya ditentukan harga tertinggi yang pernah tercapai",
        "Aturannya dibuat oleh aplikasi wallet yang kamu pakai",
        ],
        "Aturan token tertulis di smart contract, jadi yang penting diperiksa adalah kontraknya, bukan iklannya.",
      ),
      tf(
        "u4l1b2",
        "Aturan sebuah token tertulis di smart contract, bukan cuma di brosur promosinya.",
        true,
        "Smart contract memuat aturan token, sedangkan brosur promosi nggak jadi acuan yang bisa dipercaya.",
      ),
      blank(
        "u4l1b3",
        "Cara pasokan dan distribusi token diatur biasa disebut ___.",
        [
          "tokenomics",
          "tokenize pasokan",
          "airdrop resmi",
          "minting baru",
        ],
        "Tokenomics membahas dari mana pasokan token, ke mana perginya, dan siapa yang dapat berapa.",
      ),
      c(
        "u4l1b4",
        "Sebelum membeli sebuah token, apa yang paling perlu kamu cek?",
        [
        "Kontrak, likuiditas, tim, dan kegunaan tokennya",
        "Jumlah pengikut akun media sosial pembuatnya saja",
        "Warna dan desain logo proyek token tersebut",
        "Jumlah stiker yang dibagikan di grup penggemarnya",
        ],
        "Logo dan stiker nggak cukup, kamu perlu cek kontrak, likuiditas, tim, dan gunanya sebelum membeli.",
      ),
      tf(
        "u4l1b5",
        "Setiap token otomatis punya nilai hanya karena sudah tertulis di blockchain.",
        false,
        "Tertulis di blockchain cuma berarti tercatat, nilainya tetap bergantung pada pasokan, permintaan, dan kegunaan.",
      ),
      c(
        "u4l1b6",
        "Sebuah token punya pasokan sangat banyak dan hampir nggak ada permintaan. Apa yang biasanya terjadi?",
        [
          "Harga token itu sedih karena pasokan banyak tapi permintaan sepi",
          "Harga token itu pasti naik karena pasokannya besar sekali di pasaran",
          "Harga token itu terkunci otomatis oleh smart contract milik proyeknya",
          "Harga token itu nggak berpengaruh apa pun terhadap jumlah pasokannya",
        ],
        "Pasokan banyak yang nggak diimbangi permintaan biasanya membuat harga token jadi tertekan.",
      ),
      c(
        "u4l1b7",
        "Bagaimana status perdagangan aset kripto di Indonesia menurut materinya?",
        [
          "Bukan zona tanpa aturan, ikuti pajak dan regulasinya",
          "Zona bebas aturan, jadi pajak dan regulasi sama sekali nggak berlaku",
          "Wilayah tanpa pengawasan yang diurus kantor pusat blockchain dunia",
          "Wilayah terlarang total untuk semua jenis aset digital di Indonesia",
        ],
        "Indonesia bukan zona tanpa aturan, jadi pengguna perlu mengikuti perkembangan pajak dan regulasi yang berlaku.",
      ),
  ],
  // ------------------------------------------------------------------ u4-l2
  "u4-l2": [
      c(
        "u4l2b1",
        "Apa yang membuat sebuah NFT disebut non-fungible?",
        [
          "Setiap NFT itu unik, jadi nggak bisa ditukar 1:1 dengan yang lain",
          "Setiap NFT punya gambar yang wajib disimpan di dalam blok-nya sendiri",
          "Setiap NFT cuma bisa dimiliki oleh satu negara di dunia",
          "Setiap NFT harganya selalu lebih mahal dari koin biasa",
        ],
        "NFT unik seperti tiket kursi 12A yang nggak bisa ditukar sama dengan kursi 99Z, beda dari uang yang fungible.",
      ),
      tf(
        "u4l2b2",
        "Membeli NFT nggak otomatis memberi kamu hak cipta global atas karyanya, itu tergantung lisensi.",
        true,
        "Kepemilikan token di rantai beda dari hak cipta, jadi hak ciptanya tetap bergantung pada lisensi karyanya.",
      ),
      blank(
        "u4l2b3",
        "NFT unik satu-satu di Ethereum biasanya memakai standar ERC-___.",
        [
        "721",
        "20",
        "1155",
        "404",
        ],
        "ERC-721 adalah standar untuk NFT unik satu-satu di Ethereum.",
      ),
      c(
        "u4l2b4",
        "Orang lain bisa right-click save gambar NFT-mu. Apakah NFT-mu jadi nggak berarti?",
        [
          "Orang bisa right-click save, tapi kepemilikan tetap terbukti di blockchain",
          "Gambar NFT-mu otomatis hilang dari blockchain setiap kali ada yang menyimpannya",
          "Hak kepemilikanmu pindah ke orang yang menyimpan gambar itu di perangkatnya",
          "Blockchain akan menolak transaksi apa pun yang melibatkan gambar tersebut",
        ],
        "Menyalin file gambar nggak mengubah catatan token ID di rantai, kepemilikannya tetap milik alamatmu.",
      ),
      tf(
        "u4l2b5",
        "File gambar NFT selalu disimpan utuh di dalam blok blockchain, bukan di IPFS atau server.",
        false,
        "Yang on-chain biasanya token dan pointer ke metadata, sedangkan file gambarnya sering di IPFS atau server.",
      ),
      c(
        "u4l2b6",
        "Standar mana yang cocok untuk NFT multi-edisi seperti item game, dan kenapa?",
        [
        "ERC-1155 karena bisa campuran dan lebih hemat gas",
        "ERC-20 karena cuma dia yang bisa membuat token unik",
        "ERC-721 karena dirancang khusus untuk banyak edisi sekaligus",
        "ERC-1155 karena tokennya nggak bisa dibagi-bagi sama sekali",
        ],
        "ERC-1155 mendukung campuran token dan lebih hemat gas, sering dipakai untuk item game.",
      ),
      c(
        "u4l2b7",
        "Selain foto profil, NFT bisa dipakai untuk apa saja?",
        [
        "Tiket, identitas, item game, atau sertifikat",
        "Menambah kecepatan jaringan blockchain secara otomatis",
        "Menghapus biaya gas pada semua transaksi penggunanya",
        "Menggantikan fungsi bank sentral dalam mencetak uang",
        ],
        "NFT bisa menandai kepemilikan tiket, identitas, item game, atau sertifikat, bukan cuma gambar profil.",
      ),
  ],
  // ------------------------------------------------------------------ u4-l3
  "u4-l3": [
      c(
        "u4l3b1",
        "Apa arti floor price di sebuah marketplace NFT?",
        [
        "Listing terendah saat ini, bukan harga yang dijamin selamanya",
        "Harga rata-rata semua NFT yang pernah terjual di sana",
        "Harga tertinggi yang pernah dicapai koleksi itu sebelumnya",
        "Harga tetap yang ditentukan tim pembuat NFT selamanya",
        ],
        "Floor price cuma listing terendah saat ini, jadi angkanya bisa berubah dan bukan jaminan.",
      ),
      tf(
        "u4l3b2",
        "Floor price cuma listing terendah saat ini, bukan harga yang dijamin bertahan selamanya.",
        true,
        "Floor price mencerminkan listing termurah saat itu, sehingga bisa berubah kapan saja.",
      ),
      match(
        "u4l3b3",
        "Pasangkan istilah marketplace NFT dengan artinya.",
        [
          { left: "Mint", right: "Mencetak NFT baru ke blockchain" },
          { left: "Burn", right: "Menghancurkan token selamanya" },
          { left: "Royalti", right: "Bagian yang diterima kreator" },
        ],
        "Mint mencetak, burn menghancurkan, dan royalti adalah bagian yang diterima kreator.",
      ),
      c(
        "u4l3b4",
        "Volume dagang sebuah koleksi tiba-tiba melonjak. Kenapa kamu tetap perlu waspada?",
        [
        "Volume ramai bisa berasal dari wash trading, bukan pembeli asli",
        "Volume tinggi selalu menandakan koleksi itu punya kualitas terbaik",
        "Volume tinggi berarti floor price otomatis naik selamanya",
        "Volume tinggi membuktikan pembuatnya pasti orang terkenal",
        ],
        "Volume ramai bisa hasil wash trading atau dagang sendiri supaya kelihatan laris, bukan bukti sehat.",
      ),
      tf(
        "u4l3b5",
        "Volume dagang yang naik tiba-tiba pasti tanda pembeli asli bertambah banyak.",
        false,
        "Volume ramai bisa dari wash trading, yaitu dagang sendiri supaya kelihatan laris, jadi belum tentu pembeli asli.",
      ),
      c(
        "u4l3b6",
        "Sebelum mint sebuah NFT, apa yang wajib kamu cek lebih dulu?",
        [
        "Situs resminya dan alamat kontraknya",
        "Jumlah komentar positif di unggahan promosinya",
        "Warna latar gambar yang akan kamu mint nanti",
        "Banyaknya akun yang membagikan link mint itu",
        ],
        "Situs tiruan bisa menguras wallet, jadi cek situs resmi dan alamat kontrak sebelum mint.",
      ),
      c(
        "u4l3b7",
        "Kamu cari marketplace lewat iklan Google dan menemukan situs yang mirip merek terkenal. Apa risikonya?",
        [
        "Situs tiruan itu bisa phishing dan menguras wallet-mu",
        "Situs tiruan itu cuma lambat tapi tetap aman dipakai mint",
        "Situs tiruan itu memberi diskon sehingga wajib dipakai",
        "Situs tiruan itu punya fitur keamanan lebih canggih dari aslinya",
        ],
        "Iklan yang meniru merek sering jadi phishing, jadi lebih aman membuka marketplace lewat bookmark resmi.",
      ),
  ],
  // ------------------------------------------------------------------ u4-l4
  "u4-l4": [
      c(
        "u4l4b1",
        "Manakah yang termasuk red flag sebuah proyek NFT atau token?",
        [
          "Tim anonim yang menjanjikan untung besar dan mendesak mint",
          "Tim yang membuka kontraknya untuk diperiksa siapa pun",
          "Proyek yang menjelaskan kegunaan tokennya dengan sabar dan terbuka",
          "Proyek yang punya situs resmi dan alamat kontrak jelas",
        ],
        "Kombinasi tim anonim, janji pasti untung, dan desakan buru-buru adalah pola klasik yang patut diwaspadai.",
      ),
      tf(
        "u4l4b2",
        "Seleb yang mempromosikan NFT nggak otomatis jadi jaminan kualitas karena banyak yang dibayar.",
        true,
        "Endorse seleb sering berupa kerja sama berbayar, jadi bukan bukti bahwa proyeknya berkualitas.",
      ),
      blank(
        "u4l4b3",
        "Sikap waras sebelum mint adalah cek situs resmi, lalu cek ___, baru pikirin estetikanya.",
        [
        "kontrak",
        "harga diskon",
        "jumlah follower",
        "warna tema",
        ],
        "Urutan yang waras adalah cek situs resmi, lalu kontrak, baru memikirkan soal estetika.",
      ),
      c(
        "u4l4b4",
        "Ada grup VIP yang menyerumu 'masuk sekarang malam ini, pasti 100x'. Apa pola seperti itu?",
        [
        "Pola klasik pump-and-dump yang memanfaatkan rasa takut ketinggalan",
        "Pola resmi yang dijalankan semua proyek berkualitas di dunia",
        "Pola aman karena yang mengajak sudah punya banyak anggota",
        "Pola investasi yang dijamin pemerintah dan bebas risiko",
        ],
        "Yang butuh kamu buru-buru justru butuh uangmu, jadi desakan seperti itu adalah umpan.",
      ),
      tf(
        "u4l4b5",
        "Kalau sebuah proyek mendesakmu mint sekarang juga, itu tanda proyeknya pasti berkualitas.",
        false,
        "Desakan buru-buru justru ciri pola pump-and-dump, bukan tanda proyek yang berkualitas.",
      ),
      c(
        "u4l4b6",
        "Timeline media sosialmu ramai membahas sebuah koin. Bagaimana kamu menyikapinya?",
        [
          "Timeline ramai membahas koin itu, dan itu justru alasan untuk lebih curiga",
          "Timeline ramai membahas koin itu, dan itu bukti koinnya berkualitas tinggi",
          "Timeline ramai membahas koin itu, jadi harganya pasti naik dalam waktu dekat",
          "Timeline ramai membahas koin itu, jadi proyeknya sudah diaudit pihak ketiga",
        ],
        "Keramaian timeline sering bagian dari marketing, jadi keputusan tetap harus berdasar pemeriksaan sendiri.",
      ),
      c(
        "u4l4b7",
        "Prinsip apa yang dipakai sebelum membeli NFT atau token?",
        [
          "Pahami asetnya lebih dulu sebelum memutuskan membeli dengan uangmu",
          "Beli dulu sebanyak mungkin, pahami nanti setelah harganya naik tinggi",
          "Ikuti saja ajakan grup karena mereka pasti lebih tahu soal proyeknya",
          "Beli tanpa membaca apa pun supaya nggak ketinggalan kesempatan naik",
        ],
        "Prinsipnya beli yang kamu pahami dan rela pegang, bukan yang kamu beli karena takut ketinggalan.",
      ),
  ],
  // ------------------------------------------------------------------ u4-l5
  "u4-l5": [
      c(
        "u4l5b1",
        "Token seperti uang atau poin yang bisa dibagi-bagi biasanya memakai standar apa?",
        [
        "ERC-20, token yang bisa dibagi dan ditukar 1:1",
        "ERC-721, standar untuk NFT unik satu-satu",
        "ERC-1155, standar khusus item game saja",
        "ERC-404, standar wajib untuk semua token baru",
        ],
        "ERC-20 dipakai untuk token yang bisa dibagi seperti uang atau poin, sedangkan NFT pakai standar lain.",
      ),
      tf(
        "u4l5b2",
        "Setelah kamu setApprovalForAll di sebuah kontrak NFT, semua NFT di kontrak itu bisa diambil.",
        true,
        "Satu centang setApprovalForAll memberi izin ke kontrak itu untuk mengambil semua NFT-mu di kontrak tersebut.",
      ),
      match(
        "u4l5b3",
        "Pasangkan standar token dengan kegunaannya.",
        [
          { left: "ERC-20", right: "Token yang bisa dibagi-bagi" },
          { left: "ERC-721", right: "NFT unik satu-satu" },
          { left: "ERC-1155", right: "Campuran, hemat gas, sering untuk game" },
        ],
        "Standar cuma colokan teknis, jadi tiap jenis punya kegunaan yang berbeda di rantai.",
      ),
      c(
        "u4l5b4",
        "Kamu diminta approve token ERC-20 dengan jumlah unlimited. Apa risikonya?",
        [
        "Izin unlimited itu seperti pintu terbuka yang bisa menguras tokenmu",
        "Izin unlimited membuat tokenmu otomatis bertambah banyak",
        "Izin unlimited mempercepat jaringan sehingga gas jadi murah",
        "Izin unlimited menghapus semua risiko kontrak secara permanen",
        ],
        "Approve unlimited memberi izin tarik dalam jumlah tak terbatas, jadi sebaiknya batasi sesuai kebutuhan.",
      ),
      tf(
        "u4l5b5",
        "Token yang sudah berlabel ERC-20 pasti aman dan nggak bisa punya pajak transfer atau blacklist.",
        false,
        "Masih ada token berlabel ERC-20 yang punya pajak transfer, blacklist, atau pause, jadi standarnya bukan jaminan aman.",
      ),
      c(
        "u4l5b6",
        "Ada mint gratis yang meminta setApprovalForAll ke kontraknya. Apa yang sebaiknya kamu lakukan?",
        [
          "Jangan tanda tangani, karena itu memberi izin luas atas seluruh asetmu",
          "Tanda tangani saja karena mint gratis dan risikonya sangat kecil sekali",
          "Tanda tangani dulu, lalu cabut izinnya setelah mint-nya selesai dengan sukses",
          "Tanda tangani memakai wallet yang ada isinya supaya transaksinya lancar",
        ],
        "setApprovalForAll memberi izin luas ke kontrak, jadi mint gratis yang memintanya justru perlu diwaspadai.",
      ),
      c(
        "u4l5b7",
        "Di mana standar sebuah token sebenarnya ditentukan?",
        [
          "Di smart contract token itu sendiri, bukan di aplikasi walletnya",
          "Di aplikasi wallet yang kamu pakai untuk membuka dan mengirim token itu",
          "Di halaman resmi proyek yang menampilkan logo dan penjelasan tokennya",
          "Di bursa tempat kamu membeli token itu pertama kali sebelum dipindahkan",
        ],
        "Marketplace cuma etalase, sedangkan standar sebenarnya ditentukan di rantai lewat kontrak tokennya.",
      ),
  ],
  // ------------------------------------------------------------------ u5-l1
  "u5-l1": [
      c(
        "u5l1b1",
        "Kamu tukar USDT ke ETH lewat aplikasi bursa berizin. Selama proses, siapa yang memegang asetmu?",
        [
        "Bursa, karena di CEX aset dititipkan ke perantara",
        "Kamu sendiri, karena bursa cuma perantara tampilan",
        "Validator jaringan, karena semua transaksi on-chain",
        "Kontrak pintar, karena bursa jalan lewat kode",
        ],
        "Di CEX aset dititipkan ke perantara berizin, jadi tanggung jawabnya beda dengan DEX yang kuncinya di kamu.",
      ),
      tf(
        "u5l1b2",
        "Di platform DEX, kunci wallet dipegang kamu sendiri sehingga salah klik jadi tanggung jawabmu.",
        true,
        "DEX tukar lewat kontrak tanpa perantara, jadi kunci dan risiko salah klik ada di pengguna.",
      ),
      tf(
        "u5l1b3",
        "Kode protokol DeFi yang sudah diaudit otomatis kebal dari cacat dan serangan hack.",
        false,
        "Audit cuma membantu mengurangi risiko, bukan ramuan kebal, karena kode tetap bisa cacat dan di-hack.",
      ),
      c(
        "u5l1b4",
        "Kamu lihat iklan protokol baru: setor token X, dapat imbalan 4.000% per tahun dijamin. Bagaimana kamu membacanya?",
        [
          "Waspada, imbalan setinggi itu biasanya dari token yang bisa jatuh",
          "Langsung ikut karena angkanya jauh lebih tinggi dari bunga bank",
          "Abaikan semua protokol karena DeFi selalu identik dengan penipuan",
          "Minta admin grup mengonfirmasi dulu supaya kamu merasa aman",
        ],
        "APY ekstrem biasanya dibayar pakai token yang harganya bisa anjlok, jadi angkanya nggak mencerminkan cuan nyata.",
      ),
      c(
        "u5l1b5",
        "Kamu bandingin cara kerja bursa CEX dan DEX. Perbedaan paling mendasar soal asetmu?",
        [
          "Di CEX aset dititipkan ke perantara, di DEX kuncinya tetap di kamu",
          "Di CEX nggak ada biaya sama sekali, di DEX semua transaksinya gratis",
          "Di CEX transaksinya on-chain, di DEX semuanya tercatat di server pusat",
          "Di CEX kamu pegang seed sendiri, di DEX perantara yang menyimpannya",
        ],
        "CEX menyimpan asetmu di perantara, sedangkan DEX membuat kamu memegang kunci sendiri.",
      ),
      blank(
        "u5l1b6",
        "Aplikasi keuangan tanpa perantara yang jalan di atas kontrak pintar disebut ___.",
        [
        "DeFi",
        "CEX",
        "gas fee",
        "oracle",
        ],
        "DeFi adalah decentralized finance, layanan keuangan yang jalan lewat kontrak pintar tanpa bank di tengah.",
      ),
      c(
        "u5l1b7",
        "Kamu mau pakai layanan keuangan kripto. Kapan tanggung jawab penuh ada di kamu sendiri?",
        [
          "Saat pakai DEX, karena nggak ada teller maupun CS penjaga",
          "Saat pakai CEX, karena semua diurus customer service",
          "Saat pakai bank, karena saldo dijamin penuh oleh LPS",
          "Saat pakai wallet, karena wallet bisa membatalkan transaksi",
        ],
        "Di DeFi nggak ada teller dan nggak ada LPS, jadi keputusan pencet tombol sepenuhnya di kamu.",
      ),
  ],
  // ------------------------------------------------------------------ u5-l2
  "u5-l2": [
      c(
        "u5l2b1",
        "Kamu swap token di DEX. Kamu terima 1% lebih sedikit dari perkiraan karena pasar bergerak. Istilah untuk selisih itu apa?",
        [
          "Slippage, selisih harga perkiraan dan harga yang kamu dapat",
          "Gas fee, biaya yang dibayar ke validator jaringan blockchain",
          "Approval, izin yang kamu berikan ke kontrak saat swap",
          "Likuiditas, jumlah dana yang tersedia di dalam pool",
        ],
        "Slippage muncul karena harga bergerak saat transaksi diproses, dan pasar tipis bikin selisihnya makin nyakitin.",
      ),
      tf(
        "u5l2b2",
        "Pop-up 'set approval for all' yang muncul tanpa kamu inisiasi sebaiknya langsung ditolak.",
        true,
        "Izin itu memberi akses luas ke asetmu, jadi kalau bukan kamu yang memulai, tolak supaya aman.",
      ),
      tf(
        "u5l2b3",
        "Token honeypot tetap bisa kamu jual dengan mudah, cuma pajaknya agak tinggi.",
        false,
        "Honeypot dirancang supaya tokennya bisa dibeli tapi hampir nggak bisa dijual, jadi bukan cuma soal pajak.",
      ),
      c(
        "u5l2b4",
        "Kamu mau swap token no-name yang belum kamu kenal. Langkah paling waras sebelum menekan tombol?",
        [
          "Cek kontrak resmi dan pajaknya, jangan langsung max buy",
          "Langsung beli sebanyak mungkin biar dapat harga paling murah",
          "Ikuti saja tautan iklan yang paling atas di hasil pencarian",
          "Kirim seed ke admin supaya tokennya dipastikan asli",
        ],
        "Token asing sering berupa honeypot atau punya pajak tersembunyi, jadi cek kontrak dulu sebelum beli.",
      ),
      c(
        "u5l2b5",
        "Kamu sudah beberapa kali swap dan punya banyak izin approve yang menganggur. Apa yang sebaiknya dilakukan?",
        [
        "Cabut izin yang nggak dipakai supaya akses ke tokenmu menyusut",
        "Biarkan saja karena izin lama otomatis hangus",
        "Tambah izin baru biar transaksi berikutnya lebih cepat",
        "Ganti wallet baru tanpa memindahkan aset apa pun",
        ],
        "Izin lama yang menganggur tetap bisa disalahgunakan, jadi cabut yang nggak dipakai.",
      ),
      match(
        "u5l2b6",
        "Pasangkan istilah swap dengan artinya.",
        [
          { left: "Slippage", right: "Selisih harga perkiraan dengan harga yang diterima" },
          { left: "Approve", right: "Izin kontrak menarik tokenmu" },
          { left: "Honeypot", right: "Token bisa dibeli tapi susah dijual" },
        ],
        "Ketiga istilah ini sering muncul saat swap, dan masing-masing menyimpan risiko yang beda.",
      ),
      c(
        "u5l2b7",
        "Kenapa unlimited approval dianggap nyaman sekaligus berbahaya?",
        [
          "Nyaman sekali izin, berbahaya karena kontrak bisa tarik tokenmu",
          "Nyaman karena gratis, berbahaya karena bikin wallet jadi lambat",
          "Nyaman karena otomatis, berbahaya karena bisa menghapus seed",
          "Nyaman karena anonim, berbahaya karena bisa mengubah jaringan",
        ],
        "Sekali memberi unlimited approval, kontrak punya kuasa menarik token tanpa minta izin ulang.",
      ),
  ],
  // ------------------------------------------------------------------ u5-l3
  "u5-l3": [
      c(
        "u5l3b1",
        "Kamu kirim transaksi di jam sibuk dan biayanya melonjak. Kenapa gas bisa naik turun?",
        [
          "Karena jaringan ramai, validator pilih yang bayarnya cukup",
          "Karena HP kamu butuh daya baterai lebih saat kirim transaksi",
          "Karena nilai token yang dikirim ikut menentukan ongkir",
          "Karena web3min menaikkan tarif tiap jam sibuk",
        ],
        "Gas itu ongkos jaringan, jadi saat antrean transaksi padat harganya naik dan saat sepi turun.",
      ),
      tf(
        "u5l3b2",
        "Transaksi yang gagal sering tetap memotong gas karena kerja validasi sudah dilakukan.",
        true,
        "Validator sudah mengerjakan prosesnya, jadi gas yang terpakai biasanya tetap dibayar walau transaksinya gagal.",
      ),
      tf(
        "u5l3b3",
        "Dompet yang menampilkan status pending lama berarti HP-nya rusak dan perlu diganti.",
        false,
        "Pending lama biasanya karena gas terlalu rendah atau jaringan padat, bukan karena perangkat rusak.",
      ),
      c(
        "u5l3b4",
        "Transaksimu pending lama sekali. Apa tindakan paling tepat?",
        [
          "Cek apakah gas terlalu rendah atau jaringan sedang padat",
          "Kirim ulang sepuluh kali supaya transaksinya cepat diproses",
          "Matikan lalu nyalakan HP supaya transaksinya jalan lagi",
          "Ganti seed wallet biar antrean transaksinya direset",
        ],
        "Pending muncul karena gas kurang atau jaringan padat, dan spam transaksi cuma menambah beban.",
      ),
      c(
        "u5l3b5",
        "Kamu mau hemat ongkos di ekosistem Ethereum. Pilihan yang masuk akal?",
        [
        "Pakai L2 seperti Arbitrum atau Base, atau tunggu jam sepi",
        "Kirim transaksi berkali-kali biar dapat diskon volume",
        "Pindah ke jaringan tanpa gas sama sekali",
        "Bayar pakai pulsa telepon biar lebih murah",
        ],
        "L2 dan jam sepi menurunkan ongkos karena beban jaringan lebih ringan, bukan karena diskon volume.",
      ),
      blank(
        "u5l3b6",
        "Biaya yang dibayar ke validator supaya transaksi on-chain diproses disebut ___.",
        [
        "gas",
        "pajak",
        "tip",
        "bunga",
        ],
        "Gas adalah ongkos jaringan yang dibayar ke validator, bukan pajak web3min.",
      ),
      c(
        "u5l3b7",
        "Seseorang bilang gas fee itu pajak yang diambil web3min. Apa tanggapanmu?",
        [
          "Salah, gas itu ongkos ke validator jaringan",
          "Benar, web3min ambil potongan dari setiap transaksi kita",
          "Benar, gas dipakai buat gaji admin grup setiap bulan",
          "Salah, gas cuma berlaku di jaringan Bitcoin saja",
        ],
        "Gas dibayar ke validator agar transaksi diproses, dan web3min nggak mengambil potongan dari situ.",
      ),
  ],
  // ------------------------------------------------------------------ u5-l4
  "u5-l4": [
      c(
        "u5l4b1",
        "Kamu punya ETH di Ethereum dan ETH di Arbitrum. Di wallet kelihatan sama, tapi apa bedanya?",
        [
          "Jaringannya berbeda, pilih network yang benar",
          "Nilainya berbeda karena ETH di L2 nggak punya harga",
          "Yang di L2 cuma tampilan, aslinya tokennya nggak ada",
          "Keduanya identik dan bisa dikirim ke alamat mana pun",
        ],
        "ETH di L1 dan L2 beda jaringan, jadi salah pilih network bisa bikin asetmu nyangkut.",
      ),
      tf(
        "u5l4b2",
        "Orang pindah ke L2 terutama karena ongkos lebih murah dan transaksi lebih cepat.",
        true,
        "L2 dirancang sebagai jalan tol di atas L1, jadi keunggulannya ongkos dan kecepatan.",
      ),
      tf(
        "u5l4b3",
        "Pakai L2 berarti kamu nggak perlu lagi menyimpan seed phrase.",
        false,
        "L2 tetap jaringan kripto yang butuh wallet dan seed, jadi bukan alasan buat mengabaikan keamanan.",
      ),
      c(
        "u5l4b4",
        "Kamu mau memindahkan aset dari satu rantai ke rantai lain lewat bridge. Langkah aman pertama?",
        [
          "Cek jaringan tujuan, lalu kirim nominal kecil dulu",
          "Kirim semua aset sekaligus biar hemat biaya transaksi",
          "Lewati bridge resmi dan pakai tautan yang dikirim lewat DM",
          "Matikan koneksi internet saat proses bridge sedang berjalan",
        ],
        "Bridge pernah di-hack dan rawan salah jaringan, jadi uji nominal kecil dulu itu langkah waras.",
      ),
      c(
        "u5l4b5",
        "Apa itu Layer 2 dalam istilah sederhana?",
        [
          "Jalan tol di atas blockchain utama yang lebih murah",
          "Blockchain pertama yang paling lambat dibanding lainnya",
          "Dompet khusus buat menyimpan koleksi NFT digital",
          "Bursa terpusat yang punya cabang kedua di luar negeri",
        ],
        "L2 dibangun di atas L1 supaya transaksi lebih murah dan cepat, sambil tetap merapat ke keamanan L1.",
      ),
      blank(
        "u5l4b6",
        "Blockchain utama seperti Bitcoin dan Ethereum disebut Layer ___.",
        [
        "1",
        "2",
        "3",
        "0",
        ],
        "Layer 1 adalah blockchain utamanya, sedangkan Layer 2 dibangun di atasnya.",
      ),
      c(
        "u5l4b7",
        "Kenapa bridge dianggap lebih berisiko dibanding sekadar swap di satu rantai?",
        [
          "Karena bridge pernah di-hack dan rawan salah jaringan",
          "Karena bridge selalu gratis sehingga banyak penipu",
          "Karena bridge cuma jalan di jaringan Bitcoin saja",
          "Karena bridge menghapus seed phrase para penggunanya sendiri",
        ],
        "Bridge menghubungkan dua rantai dan pernah jadi sasaran hack, plus salah jaringan itu kesalahan klasik.",
      ),
  ],
  // ------------------------------------------------------------------ u5-l6
  "u5-l6": [
      c(
        "u5l6b1",
        "Kamu menaruh USDC di protokol lending DeFi. Dari mana bunga yang kamu terima?",
        [
          "Dari peminjam yang membayar bunga pinjaman",
          "Dari pemerintah yang mensubsidi protokolnya",
          "Dari token baru yang dicetak tanpa batas",
          "Dari pajak transaksi web3min tiap hari",
        ],
        "Di lending DeFi bunga berasal dari peminjam, jadi kalau nggak ada peminjam biasanya imbalannya kecil.",
      ),
      tf(
        "u5l6b2",
        "Protokol lending DeFi nggak punya customer service yang bisa membatalkan likuidasi.",
        true,
        "Di DeFi nggak ada CS maupun teller, jadi aturan kontrak yang jalan dan nggak bisa ditawar.",
      ),
      tf(
        "u5l6b3",
        "Menaruh USDC di protokol lending DeFi sama persis dengan deposito bank yang dijamin LPS.",
        false,
        "Lending DeFi bukan deposito dan nggak dijamin LPS, jadi risikonya ditanggung pengguna sendiri.",
      ),
      c(
        "u5l6b4",
        "Kamu meminjam stable dengan agunan ETH. Kenapa protokol mensyaratkan agunan lebih besar dari utang?",
        [
          "Supaya ada bantalan saat harga agunan turun",
          "Supaya kamu membayar bunga dua kali lipat dari biasanya",
          "Supaya protokol bisa menahan tokenmu selamanya",
          "Supaya kamu nggak perlu membaca aturan kontraknya",
        ],
        "Agunan berlebih memberi bantalan supaya penurunan harga masih bisa ditutup tanpa merugikan pemberi pinjaman.",
      ),
      c(
        "u5l6b5",
        "Tiga mesin utama DeFi setelah swap adalah apa?",
        [
        "Lend, borrow, dan pool likuiditas",
        "Chart, sinyal, dan grup VIP",
        "Mining, staking, dan airdrop",
        "Login, logout, dan reset sandi",
        ],
        "Selain swap, DeFi punya mesin kasih pinjaman, minjem, dan kasih likuiditas ke pool.",
      ),
      blank(
        "u5l6b6",
        "Protokol yang memungkinkan kamu menaruh aset untuk dipinjam orang lain disebut protokol ___.",
        [
          "lending",
          "trading",
          "gaming",
          "mining",
        ],
        "Protokol lending mempertemukan pemberi dan peminjam tanpa teller, dan bunganya datang dari peminjam.",
      ),
      c(
        "u5l6b7",
        "Kamu lihat banner menawarkan bunga 4.000% di protokol DeFi. Kalimat paling jujur tentang bunga itu?",
        [
          "Bunga selalu punya sumber, kalau nggak jelas itu umpan",
          "Bunga tinggi pasti datang dari peminjam asli yang kaya",
          "Bunga di DeFi dijamin negara jadi pasti aman",
          "Bunga tinggi artinya protokolnya paling transparan",
        ],
        "Bunga nyata berasal dari peminjam, jadi imbalan yang sumbernya nggak jelas patut dicurigai sebagai umpan.",
      ),
  ],
  // ------------------------------------------------------------------ u5-l7
  "u5-l7": [
      c(
        "u5l7b1",
        "Health factor agunanmu 0,9. Apa artinya?",
        [
          "Utangmu lewat ambang aman, likuidator bisa sita agunan",
          "Posisimu sangat aman dan masih bisa ditambah utang lagi",
          "Protokol otomatis menambah agunanmu sendiri",
          "Kamu bebas menarik agunan tanpa syarat apa pun",
        ],
        "Health factor di bawah 1 berarti posisi sudah tembus ambang, sehingga likuidator boleh menyita agunan.",
      ),
      tf(
        "u5l7b2",
        "Liquidator membayar sebagian utangmu lalu mengambil agunan plus bonus, dan bonus itu berasal dari kamu.",
        true,
        "Bonus likuidasi diambil dari agunan peminjam, jadi itu semacam denda karena posisinya tembus ambang.",
      ),
      tf(
        "u5l7b3",
        "Kalau agunanmu jatuh di akhir pekan, likuidasi otomatis berhenti sampai pasar buka.",
        false,
        "Pasar kripto jalan terus, dan oracle bisa memberi harga jelek di akhir pekan sehingga likuidasi tetap terjadi.",
      ),
      c(
        "u5l7b4",
        "Kenapa protokol memakai oracle untuk harga, dan apa risikonya?",
        [
          "Oracle memberi harga, tapi saat pasar tipis bisa jelek",
          "Oracle memastikan harga token selalu stabil sepanjang waktu",
          "Oracle menghapus kebutuhan agunan di protokol",
          "Oracle mencegah likuidasi terjadi sama sekali",
        ],
        "Oracle jadi sumber harga protokol, dan saat likuiditas tipis angkanya bisa menyesatkan sehingga health factor anjlok.",
      ),
      c(
        "u5l7b5",
        "Kamu memakai LTV maksimum saat meminjam. Kenapa itu berbahaya?",
        [
          "Nggak ada bantalan, harga turun sedikit saja memicu likuidasi",
          "Karena LTV maksimum bikin bunga pinjamanmu naik dua kali lipat",
          "Karena LTV maksimum menghapus agunanmu seketika",
          "Karena LTV maksimum melarang kamu melunasi utang",
        ],
        "LTV maksimum menyisakan hampir tanpa bantalan, jadi pergerakan harga kecil sudah bisa menyentuh ambang likuidasi.",
      ),
      blank(
        "u5l7b6",
        "Angka yang menunjukkan seberapa aman utangmu di protokol pinjam disebut health ___.",
        [
          "factor",
          "score",
          "points",
          "level",
        ],
        "Health factor membandingkan nilai agunan dengan utang, dan di bawah 1 posisi bisa dilikuidasi.",
      ),
      c(
        "u5l7b7",
        "Apa yang dimaksud likuidasi beruntun (cascade)?",
        [
          "Likuidasi memicu harga turun, memicu likuidasi lagi",
          "Satu bot melikuidasi seluruh protokol dalam satu waktu",
          "Semua peminjam dilikuidasi pada jam yang sama",
          "Likuidasi yang dibatalkan oleh protokolnya",
        ],
        "Saat banyak posisi disita bersamaan, harga bisa tertekan dan memicu likuidasi berikutnya secara berantai.",
      ),
  ],
  // ------------------------------------------------------------------ u5-l8
  "u5-l8": [
      c(
        "u5l8b1",
        "Bot meminjam jutaan dolar tanpa agunan lewat flash loan. Apa yang membuat pemberi pinjaman tenang?",
        [
          "Pinjaman wajib lunas di transaksi yang sama",
          "Peminjam menyerahkan KTP dan slip gaji bulanan",
          "Peminjam punya reputasi panjang dan terpercaya di bursa",
          "Ada asuransi dari pemerintah yang menanggungnya",
        ],
        "Karena atomic, pinjaman yang gagal lunas otomatis dibatalkan sehingga pemberi dana nggak kehilangan apa pun.",
      ),
      tf(
        "u5l8b2",
        "Flash loan yang gagal dilunasi akan membatalkan seluruh transaksi seolah nggak pernah terjadi.",
        true,
        "Sifat atomic membuat transaksi di-revert kalau pinjaman nggak lunas, jadi nggak ada utang yang tertinggal.",
      ),
      tf(
        "u5l8b3",
        "Flash loan boleh dibawa pulang dan dicicil bulan depan seperti kredit biasa.",
        false,
        "Flash loan wajib lunas dalam transaksi yang sama, jadi nggak ada opsi cicilan atau menunda pembayaran.",
      ),
      c(
        "u5l8b4",
        "Salah satu penggunaan sah flash loan adalah?",
        [
          "Arbitrase harga antar DEX",
          "Membeli rumah dengan cicilan ringan",
          "Menabung buat dana pensiun masa tua",
          "Meminjam untuk biaya sekolah anak",
        ],
        "Flash loan sering dipakai untuk arbitrase karena butuh modal besar yang dipinjam dan dilunasi dalam satu transaksi.",
      ),
      c(
        "u5l8b5",
        "Bagaimana penyerang memakai flash loan untuk mengeksploitasi protokol?",
        [
          "Meminjam dana besar, geser harga pool tipis",
          "Mencuri seed phrase lewat email phishing",
          "Mengirim spam transaksi terus sampai jaringan jadi macet",
          "Membeli token lalu menyimpannya lama sampai harganya naik",
        ],
        "Dana besar dari flash loan dipakai menggeser harga yang dipercaya protokol, lalu pinjaman dilunasi dari hasil rampasan.",
      ),
      blank(
        "u5l8b6",
        "Kalau flash loan nggak dilunasi, transaksi otomatis di-___.",
        [
        "revert",
        "lanjut",
        "cetak",
        "bagi",
        ],
        "Transaksi yang gagal lunas di-revert, jadi seolah nggak pernah terjadi dan dana kembali ke pemberi.",
      ),
      c(
        "u5l8b7",
        "Liquidator memakai flash loan untuk membayar utang orang. Dari mana modalnya?",
        [
        "Modalnya cuma gas, karena dana pinjaman dilunasi di transaksi yang sama",
        "Modalnya tabungan pribadi likuidator yang besar dan mengendap",
        "Modalnya agunan peminjam yang disita sebelum transaksi jalan",
        "Modalnya subsidi protokol yang dibayar tiap bulan ke likuidator",
        ],
        "Liquidator cuma butuh gas karena dana flash loan dilunasi dari hasil sitaan di transaksi yang sama.",
      ),
  ],
  // ------------------------------------------------------------------ u5-l9
  "u5-l9": [
      c(
        "u5l9b1",
        "Pool TOKEN/ETH cuma berisi 80 ribu dolar. Kenapa protokol yang memakai harga spot pool itu berbahaya?",
        [
          "Penyerang bisa geser harga pool tipis lalu meminjam dana",
          "Karena pool tipis otomatis menaikkan bunga pinjamanmu",
          "Karena pool tipis membuat semua transaksi gagal selamanya",
          "Karena pool tipis menghapus agunan semua orang",
        ],
        "Pool tipis gampang digeser harganya, jadi protokol yang percaya harga itu bisa mengeluarkan dana berdasarkan angka palsu.",
      ),
      tf(
        "u5l9b2",
        "Serangan manipulasi oracle biasanya bikin protokol percaya harga palsu, bukan merusak kode transfer.",
        true,
        "Kodenya jalan normal, yang salah adalah protokol mempercayai harga yang bisa dibeli penyerang.",
      ),
      tf(
        "u5l9b3",
        "Oracle agregator seperti Chainlink nggak bisa digeser sama sekali dalam kondisi apa pun.",
        false,
        "Agregator memang jauh lebih susah digeser, tapi bukan berarti kebal dalam segala kondisi.",
      ),
      c(
        "u5l9b4",
        "Kenapa oracle agregator lebih susah digeser daripada harga spot?",
        [
          "Karena pakai banyak sumber dan batas deviasi",
          "Karena agregator menyimpan seluruh dananya di bank besar",
          "Karena agregator nggak butuh data harga dari mana pun",
          "Karena agregator cuma jalan di akhir pekan saja",
        ],
        "Banyak sumber plus heartbeat dan batas deviasi membuat harga agregator jauh lebih sulit digeser dalam sekejap.",
      ),
      c(
        "u5l9b5",
        "Urutan klasik serangan oracle pakai flash loan seperti apa?",
        [
          "Pinjam dana, geser harga oracle, lalu lunasi",
          "Beli token, simpan setahun, lalu jual saat harganya mahal",
          "Kirim seed phrase ke admin, lalu tunggu hadiahnya datang",
          "Ganti RPC lalu tunggu airdrop masuk ke wallet",
        ],
        "Serangan menggabungkan pinjaman kilat dan pergeseran harga supaya protokol salah menilai agunan atau utang.",
      ),
      blank(
        "u5l9b6",
        "Harga rata-rata beberapa blok untuk meredam manipulasi disebut ___.",
        [
        "TWAP",
        "spot",
        "gas",
        "LTV",
        ],
        "TWAP merata-ratakan harga beberapa blok sehingga lebih susah digeser dibanding harga spot sesaat.",
      ),
      c(
        "u5l9b7",
        "Apa perbedaan serangan manipulasi oracle dengan arbitrase biasa?",
        [
          "Arbitrase menyamakan harga pool, manipulasi bikin palsu",
          "Keduanya sama saja, cuma beda nama istilahnya",
          "Arbitrase merusak kode, manipulasi oracle nggak merusak",
          "Manipulasi oracle selalu legal, arbitrase selalu ilegal",
        ],
        "Arbitrase memanfaatkan selisih harga nyata, sedangkan manipulasi oracle membuat harga palsu untuk menguras protokol.",
      ),
  ],
  // ------------------------------------------------------------------ u5-l10
  "u5-l10": [
      c(
        "u5l10b1",
        "ETH 2.000 di pool A dan 2.012 di pool B. Apa yang biasanya terjadi?",
        [
          "Bot beli di pool murah, jual di pool mahal",
          "Harga dua pool akan makin jauh selamanya tanpa henti",
          "Pool yang mahal langsung ditutup oleh protokolnya",
          "Selisih harga itu jadi keuntungan otomatis buat kamu",
        ],
        "Arbitrase menutup selisih harga antar pool, dan keuntungannya cuma sisa setelah fee, gas, dan slippage.",
      ),
      tf(
        "u5l10b2",
        "Tanpa bot arbitrase, harga di AMM bisa nyasar jauh dari harga pasar dunia.",
        true,
        "Arbitrase yang menarik harga pool kembali dekat dengan harga pasar, jadi tanpa itu selisihnya bisa lebar.",
      ),
      tf(
        "u5l10b3",
        "Arbitrase CEX ke DEX sama atomic-nya dengan arbitrase DEX ke DEX.",
        false,
        "Arbitrase CEX ke DEX nggak atomic karena harga bisa bergeser sebelum transaksi on-chain selesai, jadi butuh modal nyata.",
      ),
      c(
        "u5l10b4",
        "Kenapa arbitrase DEX ke DEX bisa dijalankan tanpa modal besar?",
        [
          "Karena bisa pakai flash loan dalam satu transaksi",
          "Karena pool memberi pinjaman gratis tanpa syarat",
          "Karena harga DEX nggak pernah bergerak sama sekali",
          "Karena gas selalu nol di semua jaringan blockchain",
        ],
        "Kombinasi flash loan dan sifat atomic memungkinkan beli dan jual selesai dalam satu transaksi, jadi modalnya bisa cuma gas.",
      ),
      c(
        "u5l10b5",
        "Kamu swap 50 ETH dalam satu order di satu pool. Apa efeknya?",
        [
          "Harga di pool copot, kamu kena slippage",
          "Harga tetap sama karena AMM selalu stabil",
          "Pool memberi diskon karena ordermu besar sekali",
          "Gas kamu otomatis jadi nol karena order besar",
        ],
        "Order besar di pool tipis menggeser harga, dan biaya pergeseran itu ditanggung oleh kamu lewat slippage.",
      ),
      blank(
        "u5l10b6",
        "Membeli murah di satu pool lalu menjual mahal di pool lain disebut ___.",
        [
          "arbitrase",
          "staking",
          "harvesting",
          "lending",
        ],
        "Arbitrase memanfaatkan selisih harga antar pasar, dan keuntungannya tipis setelah dipotong biaya.",
      ),
      c(
        "u5l10b7",
        "Untung bersih arbitrase dihitung dari apa?",
        [
          "Spread dikurangi fee pool, gas, dan slippage",
          "Harga token dikali jumlah wallet yang kamu punya",
          "Jumlah transaksi dibagi dengan waktu eksekusi",
          "Saldo awal ditambah bunga bank per bulan",
        ],
        "Keuntungan arbitrase adalah sisa spread setelah semua biaya dan slippage dikurangi, jadi sering tipis.",
      ),
  ],
  // ------------------------------------------------------------------ u5-l11
  "u5-l11": [
      c(
        "u5l11b1",
        "Kamu menaruh ETH dan USDC ke pool LP. Harga ETH naik tiga kali. Apa yang biasanya terjadi sama posisimu?",
        [
          "Pool otomatis menjual ETH-mu, sisanya jadi USDC",
          "Posisimu tetap persis sama dengan sebelum harga naik",
          "Kamu otomatis dapat bonus ETH dari protokolnya",
          "Kerugianmu langsung ditutup oleh asuransi pool",
        ],
        "AMM menyeimbangkan pool lewat rumus, jadi saat ETH naik kamu ikut menjualnya dan hasilnya bisa kalah dari hold.",
      ),
      tf(
        "u5l11b2",
        "Di AMM, harga token ditentukan oleh rumus cadangan, bukan dari buku order.",
        true,
        "AMM memakai rumus cadangan seperti x kali y sama dengan k untuk menghitung harga, bukan antrean order.",
      ),
      tf(
        "u5l11b3",
        "Impermanent loss cuma ilusi akuntansi dan nggak pernah jadi kerugian nyata.",
        false,
        "Kalau harga nggak balik ke posisi awal, impermanent loss berubah jadi kerugian nyata, bukan cuma ilusi.",
      ),
      c(
        "u5l11b4",
        "Apa arti 'impermanent' pada impermanent loss?",
        [
          "Kerugian bisa balik kalau harga kembali ke posisi awal",
          "Kerugian cuma ada di layar dan pasti hilang sendiri",
          "Kerugian ditanggung protokol, bukan penyedia likuiditas",
          "Kerugian cuma berlaku untuk token meme saja",
        ],
        "Sifat impermanent cuma berlaku kalau harga balik, dan kalau nggak balik kerugiannya jadi permanen.",
      ),
      c(
        "u5l11b5",
        "Sebuah situs minta kamu menyerahkan LP token demi imbalan 2.000% setahun. Apa risikonya?",
        [
          "Situs bisa bawa kabur LP token atau izin walletmu",
          "Nggak ada risiko karena LP token nggak punya harga",
          "Risikonya cuma pajak tambahan yang jumlahnya kecil",
          "Risikonya cuma layar HP jadi terasa lambat",
        ],
        "LP token mewakili klaim atas dana di pool, jadi menyerahkannya ke situs asing bisa membuat danamu hilang.",
      ),
      match(
        "u5l11b6",
        "Pasangkan istilah pool dengan artinya.",
        [
          { left: "AMM", right: "Menentukan harga lewat rumus cadangan" },
          { left: "IL", right: "Kalah dari hold karena harga bergeser" },
          { left: "LP token", right: "Bukti kamu menaruh dana di pool" },
        ],
        "Istilah ini sering muncul di kolam likuiditas, dan masing-masing menjelaskan peran yang beda.",
      ),
      c(
        "u5l11b7",
        "Di Uniswap v3, likuiditas bisa dipusatkan di rentang harga. Apa konsekuensinya?",
        [
          "Fee lebih besar kalau harga masuk rentang, IL lebih galak",
          "Fee tetap sama dan impermanent loss hilang sepenuhnya dari pool",
          "Harga token nggak bisa bergerak sama sekali dari rentang",
          "Dana otomatis pindah ke wallet yang aman tiap saat",
        ],
        "Likuiditas terpusat menaikkan potensi fee sekaligus memperbesar risiko saat harga keluar dari rentang yang kamu pilih.",
      ),
  ],
  // ------------------------------------------------------------------ u6-l1
  "u6-l1": [
      c(
        "u6l1b1",
        "Kamu lihat banner 'Claim airdrop MetaMask' dengan domain metamask-login.help. Apa bacaanmu?",
        [
          "Itu phishing, karena domainnya bukan resmi MetaMask",
          "Itu situs resmi karena di dalamnya ada nama MetaMask",
          "Itu aman asal kamu buka dari iklan paling atas",
          "Itu airdrop resmi karena mintanya 12 kata",
        ],
        "Penipu memakai domain mirip dengan tanda hubung atau akhiran aneh untuk meniru merek resmi.",
      ),
      tf(
        "u6l1b2",
        "Situs resmi sebaiknya disimpan di bookmark, jangan mengandalkan tautan iklan di mesin pencari.",
        true,
        "Iklan dan tautan pencarian sering jadi jebakan tiruan, jadi bookmark situs resmi jauh lebih aman.",
      ),
      tf(
        "u6l1b3",
        "Support resmi sering menyapa kamu duluan lewat DM dan meminta seed phrase.",
        false,
        "Support resmi nggak pernah menyapa duluan di DM dan nggak pernah meminta seed phrase.",
      ),
      c(
        "u6l1b4",
        "Kamu tiba-tiba dapat pop-up 'permit' atau 'set approval for all' yang nggak kamu inisiasi. Sikapmu?",
        [
          "Baca lalu tolak karena kamu nggak memulainya",
          "Matikan wallet lalu install ulang aplikasinya",
          "Langsung setujui supaya nggak mengganggu",
          "Kirim seed ke situs supaya pop-up hilang",
        ],
        "Izin yang nggak kamu minta bisa membuka akses ke asetmu, jadi sebaiknya ditolak.",
      ),
      c(
        "u6l1b5",
        "Ciri domain yang patut dicurigai sebagai tiruan?",
        [
          "Ada tanda hubung atau huruf yang hilang",
          "Selalu diawali dengan www dan terlihat rapi",
          "Selalu berakhiran .com yang resmi",
          "Selalu pendek, mudah diingat, dan meyakinkan",
        ],
        "Domain tiruan biasanya menyisipkan tanda hubung atau akhiran aneh supaya mirip situs resmi.",
      ),
      blank(
        "u6l1b6",
        "Situs atau DM yang meniru merek resmi untuk mencuri aset disebut ___.",
        [
        "phishing",
        "mining",
        "staking",
        "bridging",
        ],
        "Phishing meniru tampilan resmi supaya kamu connect wallet atau mengetik seed di tempat yang salah.",
      ),
      c(
        "u6l1b7",
        "Kenapa terburu-buru itu berbahaya saat berurusan di web3?",
        [
          "Karena keburu-buru bikin kamu salah tekan Connect",
          "Karena terburu-buru bikin gas jadi lebih murah",
          "Karena terburu-buru menaikkan saldo walletmu",
          "Karena penipu nggak bisa menyerang orang yang santai",
        ],
        "Penipu mengandalkan tekanan waktu supaya kamu lalai memeriksa domain dan izin.",
      ),
  ],
  // ------------------------------------------------------------------ u6-l2
  "u6-l2": [
      c(
        "u6l2b1",
        "Seseorang di Telegram mengaku admin dan minta 12 kata untuk validasi wallet. Sikapmu?",
        [
          "Tolak dan blokir, itu prosedur palsu",
          "Kirim saja karena dia mengaku admin grup",
          "Kirim setengah kata dulu biar terasa aman",
          "Tanya dulu apakah dia benar-benar admin asli",
        ],
        "Admin atau CS resmi nggak pernah meminta seed phrase, jadi permintaan seperti itu tanda penipuan.",
      ),
      tf(
        "u6l2b2",
        "Wallet, bursa, dan proyek resmi nggak akan meminta seed phrase lewat form web biasa.",
        true,
        "Seed phrase adalah kunci penuh asetmu, dan pihak resmi nggak pernah memintanya lewat form atau chat.",
      ),
      tf(
        "u6l2b3",
        "Airdrop resmi mengharuskan kamu menyerahkan seed phrase supaya bisa sinkronisasi.",
        false,
        "Airdrop resmi cuma butuh alamat wallet, jadi permintaan seed untuk sinkronisasi itu omong kosong.",
      ),
      c(
        "u6l2b4",
        "Kamu terlanjur mengirim seed phrase ke situs asing. Apa langkah darurat yang benar?",
        [
          "Anggap wallet rusak, buat wallet baru",
          "Ganti password akun email saja biar aman",
          "Tunggu beberapa hari sampai keadaan aman",
          "Kirim sedikit aset dulu untuk mengetesnya",
        ],
        "Setelah seed bocor, wallet lama harus dianggap rusak dan aset dipindah ke wallet baru sesegera mungkin.",
      ),
      c(
        "u6l2b5",
        "Kenapa permintaan 'validasi airdrop pakai 12 kata' itu mencurigakan?",
        [
          "Karena airdrop cukup pakai alamat wallet",
          "Karena airdrop selalu butuh transfer dulu",
          "Karena airdrop cuma untuk akun lama",
          "Karena airdrop nggak pernah nyata",
        ],
        "Distribusi airdrop cuma butuh alamat wallet, jadi permintaan seed jelas penipuan.",
      ),
      match(
        "u6l2b6",
        "Pasangkan situasi dengan reaksi yang benar.",
        [
          { left: "Admin minta seed", right: "Tolak dan blokir" },
          { left: "Seed terlanjur bocor", right: "Buat wallet baru dan pindahkan aset" },
          { left: "DM support mengaku resmi", right: "Curigai karena support nggak nyapa duluan" },
        ],
        "Setiap situasi punya reaksi yang benar, dan polanya selalu melindungi seed phrase.",
      ),
      c(
        "u6l2b7",
        "Kalau seseorang yang mengaku support nyapa kamu duluan di DM, apa yang paling mungkin?",
        [
          "Itu penipu, support resmi nggak nyapa dulu",
          "Itu CS resmi yang sedang bertugas hari ini",
          "Itu sistem otomatis dari wallet kamu",
          "Itu validator jaringan yang butuh bantuan",
        ],
        "Support resmi nggak pernah menyapa duluan di DM, jadi sapaan seperti itu hampir selalu penipuan.",
      ),
  ],
  // ------------------------------------------------------------------ u6-l3
  "u6-l3": [
      c(
        "u6l3b1",
        "Tim tiba-tiba menarik semua likuiditas pool dan harga token jatuh ke nol. Itu apa?",
        [
          "Rugpull, likuiditas dibawa kabur",
          "Koreksi sehat pasar yang wajar terjadi",
          "Airdrop resmi dari proyek tersebut",
          "Bug kecil yang nggak berdampak apa pun",
        ],
        "Rugpull terjadi saat tim mengosongkan likuiditas atau menutup pintu jual sehingga harga ambruk.",
      ),
      tf(
        "u6l3b2",
        "Likuiditas yang dikunci dan tim yang transparan mengurangi risiko rugpull, tapi nggak menghilangkannya.",
        true,
        "Penguncian likuiditas dan transparansi tim cuma mengurangi risiko, bukan jaminan bebas rugpull.",
      ),
      tf(
        "u6l3b3",
        "Rugpull di kripto butuh berbulan-bulan sebelum akhirnya terjadi.",
        false,
        "Rugpull bisa terjadi dalam hitungan menit, jauh lebih cepat daripada penipuan konvensional.",
      ),
      c(
        "u6l3b4",
        "Ajakan di grup: 'Masuk sekarang, dijamin naik 100x malam ini, ada grup VIP'. Apa artinya?",
        [
          "Itu pola pump-and-dump atau rug",
          "Itu peluang langka yang harus diambil cepat",
          "Itu program resmi bursa berizin negara",
          "Itu tanda token punya fundamental kuat",
        ],
        "Janji cepat kaya dalam grup VIP adalah pola klasik pump-and-dump, dan yang tertinggal menanggung kerugian.",
      ),
      c(
        "u6l3b5",
        "Apa fungsi likuiditas pool bagi harga token?",
        [
          "Kolam tempat orang bertukar token",
          "Sebagai jaminan dari bank sentral negara",
          "Sebagai bukti token punya lisensi resmi",
          "Sebagai tempat tim menyimpan seed phrase",
        ],
        "Likuiditas adalah kolam untuk swap, jadi kalau dikosongkan harga token bisa langsung ambruk.",
      ),
      blank(
        "u6l3b6",
        "Penipuan yang mengosongkan likuiditas pool hingga harga jatuh disebut ___.",
        [
          "rugpull",
          "staking",
          "bridge",
          "minting",
        ],
        "Rugpull adalah penarikan likuiditas mendadak yang meninggalkan pembeli dengan token nyaris tanpa nilai.",
      ),
      c(
        "u6l3b7",
        "Cara paling aman menyikapi koin baru yang ramai di timeline?",
        [
          "Abaikan dulu, pakai dana yang siap hilang",
          "Langsung all-in karena momentum itu penting",
          "Pinjam uang buat beli karena pasti naik",
          "Ikuti semua rekomendasi grup tanpa cek dulu",
        ],
        "Koin baru sangat rawan rugpull, jadi sebaiknya abaikan dulu atau pakai dana yang siap hilang.",
      ),
  ],
  // ------------------------------------------------------------------ u6-l4
  "u6-l4": [
      c(
        "u6l4b1",
        "Situs menawarkan 'kirim 0.2 ETH dulu, nanti dapat 2x'. Apa itu?",
        [
          "Umpan penipuan, bukan airdrop resmi",
          "Bonus resmi karena program promosi proyek",
          "Bug yang sah dan boleh dipanen",
          "Airdrop resmi dengan syarat yang wajar",
        ],
        "Airdrop resmi cuma mendarat ke alamat, jadi permintaan transfer lebih dulu adalah tanda penipuan.",
      ),
      tf(
        "u6l4b2",
        "Airdrop resmi tidak pernah meminta seed phrase atau transfer dulu sebagai syarat.",
        true,
        "Airdrop resmi hanya butuh alamat wallet, tanpa seed phrase dan tanpa setoran awal.",
      ),
      tf(
        "u6l4b3",
        "Situs 'double your ETH in 10 minutes' itu program amal yang menguntungkan pengguna.",
        false,
        "Situs pengganda ETH itu mesin penghisap, karena uang yang kamu kirim nggak akan kembali.",
      ),
      c(
        "u6l4b4",
        "Apa risiko menghubungkan wallet ke situs klaim yang nggak kamu kenal?",
        [
          "Situs bisa minta tanda tangan izin berbahaya",
          "Wallet otomatis menambah saldo kamu",
          "Tidak ada risiko karena connect itu aman",
          "Gas jadi gratis selamanya setelah kamu connect",
        ],
        "Connect wallet bisa diikuti permintaan tanda tangan berbahaya, jadi situs asing sangat berisiko.",
      ),
      c(
        "u6l4b5",
        "Seseorang di grup menjanjikan untung 10% per hari tanpa risiko. Sikapmu?",
        [
          "Tolak, itu ciri penipuan",
          "Ikut sedikit dulu buat mengetesnya",
          "Tanya detail supaya lebih yakin lagi",
          "Ajak teman biar untungnya berlipat",
        ],
        "Imbalan tinggi yang diklaim tanpa risiko selalu jadi tanda penipuan, karena investasi nyata selalu punya risiko.",
      ),
      match(
        "u6l4b6",
        "Pasangkan tawaran dengan penilaiannya.",
        [
          { left: "Kirim 0.2 ETH dapat 2x", right: "Umpan penipuan" },
          { left: "Airdrop mendarat ke alamat", right: "Cara distribusi resmi" },
          { left: "Minta seed buat klaim", right: "Pencurian kunci" },
        ],
        "Pola airdrop resmi dan penipuan bisa dibedakan dari ada atau nggaknya permintaan seed dan setoran.",
      ),
      c(
        "u6l4b7",
        "Kenapa 'gratis yang maksa buru-buru' patut dicurigai?",
        [
          "Karena tekanan waktu bikin kamu buru-buru",
          "Karena situs gratis selalu lambat diakses",
          "Karena hadiah gratis dilarang oleh hukum",
          "Karena wallet nggak bisa dibuka dengan cepat",
        ],
        "Penipu memakai tekanan waktu supaya kamu terburu-buru dan lupa memeriksa izin serta asal situs.",
      ),
  ],
  // ------------------------------------------------------------------ u6-l5
  "u6-l5": [
      c(
        "u6l5b1",
        "Drainer modern sering minta kamu menandatangani 'permit' atau 'setApprovalForAll'. Kenapa itu bahaya?",
        [
          "Tanda tangan itu memberi izin menarik tokenmu",
          "Karena tanda tangan itu menambah saldo walletmu",
          "Karena permit cuma berlaku di jaringan Bitcoin",
          "Karena permit otomatis menghapus akunmu",
        ],
        "Permit memberi izin tarik token lewat tanda tangan off-chain, jadi nggak ada transaksi gas yang mencolok.",
      ),
      tf(
        "u6l5b2",
        "Wallet yang menampilkan '0 ETH' saat minta tanda tangan belum tentu aman, karena izinnya bisa untuk token atau NFT.",
        true,
        "Simulasi wallet cuma melihat ETH, padahal tanda tangan bisa memberi akses ke token atau NFT.",
      ),
      tf(
        "u6l5b3",
        "Kalau cuma kena permit, kamu harus langsung pindahkan semua aset ke wallet baru karena seed ikut bocor.",
        false,
        "Kalau cuma izin yang bocor, cukup cabut izinnya, dan pindah wallet baru hanya perlu kalau seed atau private key bocor.",
      ),
      c(
        "u6l5b4",
        "Kamu sadar sudah menandatangani permit ke situs mencurigakan. Langkah waras?",
        [
        "Segera cabut izin di revoke.cash atau explorer",
        "Ganti password email saja",
        "Tunggu sampai saldo hilang dulu",
        "Uninstall lalu install ulang aplikasi wallet",
        ],
        "Kalau yang bocor cuma izin, mencabutnya lewat revoke.cash atau explorer menghentikan akses penyerang.",
      ),
      c(
        "u6l5b5",
        "Apa yang dimaksud ice phishing?",
        [
          "Kamu mengira login, padahal tanda tangan izin",
          "Penipuan lewat telepon yang menyamar sebagai bank",
          "Pencurian perangkat keras wallet kamu",
          "Penipuan yang hanya menargetkan akun lama",
        ],
        "Ice phishing menyamar sebagai login biasa supaya kamu menandatangani izin tanpa sadar.",
      ),
      blank(
        "u6l5b6",
        "Penyerang yang tugasnya menguras isi dompet lewat tanda tangan izin disebut ___.",
        [
        "drainer",
        "miner",
        "validator",
        "broker",
        ],
        "Drainer menguras dompet dengan memancing tanda tangan izin, bukan dengan mencuri seed secara langsung.",
      ),
      c(
        "u6l5b7",
        "Apa perbedaan penting antara seed phrase dan permit?",
        [
          "Seed itu kunci wallet, permit cuma izin",
          "Keduanya sama saja dan sama bahayanya",
          "Permit lebih berbahaya karena menghapus seed",
          "Seed bisa dicabut seperti permit biasa",
        ],
        "Seed menguasai seluruh wallet, sedangkan permit cuma izin terbatas dan masih bisa dicabut.",
      ),
  ],
  // ------------------------------------------------------------------ u6-l6
  "u6-l6": [
      c(
        "u6l6b1",
        "Seseorang di DM menyuruhmu ganti RPC 'biar airdrop kelihatan'. Sikapmu?",
        [
          "Tolak, RPC diganti dari dokumentasi resmi",
          "Ikuti karena RPC nggak berpengaruh apa pun",
          "Ikuti kalau dia mengaku sebagai admin",
          "Ikuti dulu lalu ganti balik nanti",
        ],
        "RPC menentukan node yang dipakai wallet, dan menggantinya dari DM bisa mengarahkan transaksi ke node penipu.",
      ),
      tf(
        "u6l6b2",
        "SIM swap bisa membahayakan akun yang 2FA-nya masih memakai SMS.",
        true,
        "Pelaku memindahkan nomor HP korban supaya bisa masuk ke akun yang 2FA-nya lewat SMS.",
      ),
      tf(
        "u6l6b3",
        "2FA lewat SMS sama amannya dengan authenticator app atau security key.",
        false,
        "SMS rawan dibajak lewat SIM swap, jadi authenticator app atau security key jauh lebih aman.",
      ),
      c(
        "u6l6b4",
        "CS Discord mengajak screen share sambil meminta seed. Apa itu?",
        [
          "Penipuan, itu bukan prosedur support",
          "Bantuan resmi untuk mempercepat klaim",
          "Prosedur standar verifikasi akun",
          "Cara aman membagikan seed phrase",
        ],
        "Support resmi nggak pernah minta screen share atau seed, jadi ajakan itu jelas penipuan.",
      ),
      c(
        "u6l6b5",
        "Kenapa 2FA pakai authenticator app lebih waras daripada SMS?",
        [
          "Karena kode dibuat di perangkatmu",
          "Karena authenticator app lebih murah",
          "Karena SMS nggak bisa dipakai di HP",
          "Karena authenticator app mengunci wallet",
        ],
        "Kode authenticator nggak dikirim lewat jaringan operator, jadi nggak bisa dicuri dengan SIM swap.",
      ),
      blank(
        "u6l6b6",
        "2FA yang lebih aman dari SMS memakai authenticator app atau ___ key.",
        [
        "security",
        "private",
        "public",
        "master",
        ],
        "Security key atau authenticator app menghasilkan kode di perangkatmu, jadi jauh lebih sulit dibajak.",
      ),
      c(
        "u6l6b7",
        "Malicious RPC bisa melakukan apa pada walletmu?",
        [
          "Menampilkan saldo palsu di walletmu",
          "Menambah saldo wallet kamu otomatis",
          "Mengunci seed phrase agar aman",
          "Menghapus riwayat transaksi jaringan",
        ],
        "Node RPC penipu bisa memanipulasi tampilan saldo atau mengarahkan transaksimu ke tujuan berbahaya.",
      ),
  ],
  // ------------------------------------------------------------------ u7-l1
  "u7-l1": [
      c(
        "u7l1b1",
        "Apa masalahnya kalau kamu cuma melihat screenshot PnL hijau di timeline?",
        [
          "Kamu lihat gambaran yang timpang",
          "Nggak ada masalah, screenshot selalu jujur",
          "Screenshot hijau menjamin kamu juga untung",
          "Semua orang pasti untung kalau rajin",
        ],
        "Hanya melihat yang menang bikin kamu salah menilai peluang, karena cerita kerugian jarang dipamerkan.",
      ),
      tf(
        "u7l1b2",
        "PnL kertas bisa menyusut atau kembali ke nol sebelum sempat kamu cairkan.",
        true,
        "Untung di kertas masih mengikuti harga, jadi bisa hilang sebelum kamu benar-benar menjualnya.",
      ),
      tf(
        "u7l1b3",
        "Paus yang untung puluhan juta nggak pernah mengalami kerugian di periode yang sama.",
        false,
        "Paus juga bisa untung puluhan juta lalu minus puluhan juta dalam minggu yang sama.",
      ),
      c(
        "u7l1b4",
        "Kenapa untung di layar belum bisa dianggap penghasilan?",
        [
          "Karena belum dijual, nilainya bisa turun",
          "Karena layar selalu salah menghitung",
          "Karena untung di layar nggak pernah nyata",
          "Karena pajak langsung memotongnya",
        ],
        "Selama posisinya belum dijual, untung itu masih unrealized dan bisa berubah kapan saja.",
      ),
      c(
        "u7l1b5",
        "Apa arti roundtrip pada PnL kertas?",
        [
          "Untung kertas yang tadinya ada balik jadi nol saat harga berbalik",
          "Untung yang langsung masuk saldo wallet dan bisa dipakai belanja",
          "Kerugian yang otomatis dibatalkan protokol setelah transaksi selesai",
          "Keuntungan yang datang dari dua wallet berbeda dalam satu hari",
        ],
        "Roundtrip terjadi saat untung di kertas balik ke titik awal sebelum sempat kamu jual.",
      ),
      blank(
        "u7l1b6",
        "Untung yang sudah dijual dan jadi saldo disebut ___ profit.",
        [
        "realized",
        "unrealized",
        "kertas",
        "virtual",
        ],
        "Realized profit sudah dikunci jadi saldo karena posisinya sudah benar-benar dijual.",
      ),
      c(
        "u7l1b7",
        "Apa pelajaran dari kisah paus yang plus puluhan juta lalu minus puluhan juta?",
        [
          "PnL fluktuatif, lihat dua sisinya",
          "Paus selalu berakhir untung",
          "Angka besar nggak pernah berubah",
          "Yang penting berani ambil risiko besar",
        ],
        "Cerita itu menunjukkan PnL bisa berbalik arah, jadi penting melihat dua sisi sebelum bergerak.",
      ),
  ],
  // ------------------------------------------------------------------ u7-l2
  "u7-l2": [
      c(
        "u7l2b1",
        "Apa beda realized dan unrealized?",
        [
          "Realized sudah dijual, unrealized masih angka",
          "Realized cuma di layar, unrealized sudah cair",
          "Keduanya sama saja dan nggak ada beda",
          "Realized nggak kena pajak, unrealized kena pajak",
        ],
        "Realized berarti untungnya sudah dikunci jadi saldo, sedangkan unrealized masih menempel di posisi.",
      ),
      tf(
        "u7l2b2",
        "Sebelum kamu menjual, angka hijau itu baru harapan, bukan gaji.",
        true,
        "Untung yang belum dijual masih bergantung harga, jadi belum bisa disebut penghasilan nyata.",
      ),
      tf(
        "u7l2b3",
        "Semua pemegang memecoin pasti bisa keluar di harga puncak.",
        false,
        "Likuiditas memecoin sering nggak cukup buat semua orang keluar di puncak, jadi nggak semua bisa jual di harga tertinggi.",
      ),
      c(
        "u7l2b4",
        "Kenapa yang memamerkan realized profit lebih jarang?",
        [
          "Karena mengunci untung nyata lebih susah",
          "Karena realized profit dilarang dibagikan",
          "Karena realized profit nggak bisa dihitung",
          "Karena yang realized selalu rugi",
        ],
        "Mengunci untung jadi saldo butuh keputusan menjual, dan itu lebih susah daripada membiarkan angka di layar.",
      ),
      c(
        "u7l2b5",
        "Seorang paus punya untung 6,6 juta dolar di layar, lalu membuka long 87 juta. Apa risiko yang dia ambil?",
        [
          "Satu gerakan salah bisa hapus untungnya",
          "Nggak ada risiko karena paus selalu benar",
          "Untung di layar otomatis jadi saldo",
          "Long besar pasti mengunci keuntungan",
        ],
        "Posisi long besar membuka risiko besar, jadi untung yang masih di kertas bisa cepat menyusut.",
      ),
      blank(
        "u7l2b6",
        "Angka hijau besar di dashboard futures yang belum dijual itu baru ___.",
        [
          "harapan",
          "saldo nyata",
          "gaji harian",
          "utang lama",
        ],
        "Angka yang belum dijual baru harapan, karena nilainya masih bisa berubah sebelum dicairkan.",
      ),
      c(
        "u7l2b7",
        "Apa yang paling jujur tentang likuiditas memecoin di puncak harga?",
        [
        "Likuiditasnya terbatas, jadi nggak semua orang bisa keluar di puncak",
        "Selalu cukup untuk semua orang keluar bersamaan tanpa masalah apa pun",
        "Selalu bertambah otomatis setiap kali harga token naik tinggi",
        "Tidak pernah mempengaruhi harga token sama sekali di pasar",
        ],
        "Likuiditas yang terbatas membuat orang yang keluar belakangan kesulitan menjual di harga puncak.",
      ),
  ],
  // ------------------------------------------------------------------ u7-l3
  "u7-l3": [
      c(
        "u7l3b1",
        "Kamu jual token setelah dua menit dan dapat 286 dolar, lalu harganya meledak. Pelajaran utamanya apa?",
        [
          "Fokus ke ukuran posisi dan rencana keluar",
          "Harus selalu hold buta biar nggak menyesal",
          "Jangan pernah jual cepat dalam kondisi apa pun",
          "Trading itu murni keberuntungan semata",
        ],
        "Pelajaran dari kisah itu adalah soal manajemen posisi dan rencana, bukan kewajiban menahan posisi selamanya.",
      ),
      tf(
        "u7l3b2",
        "Take profit bertahap lebih waras daripada all-in hold atau all-in jual.",
        true,
        "Menjual bertahap mengurangi risiko salah timing, jadi lebih waras daripada mengambil posisi ekstrem.",
      ),
      tf(
        "u7l3b3",
        "Harga yang naik dari harga belimu otomatis bikin kamu untung.",
        false,
        "Kalau rata-rata belimu jelek, harga naik belum tentu membuatmu untung.",
      ),
      c(
        "u7l3b4",
        "Kenapa FOMO mengejar token yang sudah naik 10x berbahaya?",
        [
          "Karena sering jadi umpan exit",
          "Karena token yang naik 10x pasti lanjut naik",
          "Karena token baru nggak punya risiko",
          "Karena FOMO bikin gas lebih murah",
        ],
        "Mengejar token yang sudah melesat sering berarti kamu masuk saat pemegang awal justru keluar.",
      ),
      c(
        "u7l3b5",
        "Apa dua cara hangus tanpa kena hack yang dibahas di materi?",
        [
          "Jual terlalu cepat karena takut",
          "Lupa password atau salah ketik alamat",
          "Kena phishing atau drainer",
          "SIM swap atau RPC yang dipalsukan",
        ],
        "Hangus bisa datang dari keputusan sendiri, entah jual terlalu cepat atau memaksakan hold posisi yang jelek.",
      ),
      match(
        "u7l3b6",
        "Pasangkan kondisi dengan pelajarannya.",
        [
          { left: "Jual 2 menit dapat 286 dolar", right: "Ukuran posisi dan rencana lebih penting" },
          { left: "Harga naik tapi rata beli jelek", right: "Belum tentu untung" },
          { left: "FOMO kejar token 10x", right: "Sering jadi umpan exit" },
        ],
        "Tiap kondisi mengajarkan disiplin soal posisi dan rencana keluar, bukan sekadar keberuntungan.",
      ),
      c(
        "u7l3b7",
        "Kapan rencana keluar sebaiknya disusun?",
        [
          "Sebelum masuk posisi dulu",
          "Setelah posisi untung besar",
          "Setelah panik karena harga jatuh",
          "Setelah membaca grup sinyal",
        ],
        "Rencana keluar disusun sebelum masuk supaya keputusan nggak didikte rasa takut atau serakah.",
      ),
  ],
  // ------------------------------------------------------------------ u7-l4
  "u7-l4": [
      c(
        "u7l4b1",
        "Paus membuka posisi raksasa. Kenapa kamu nggak bisa sekadar meniru ukurannya?",
        [
          "Karena modal, leverage, dan risikonya beda",
          "Karena paus selalu salah ambil posisi",
          "Karena ukuran posisi nggak mempengaruhi risiko",
          "Karena paus nggak pakai leverage sama sekali",
        ],
        "Ukuran posisi paus disesuaikan modal dan bantalannya, jadi meniru ukurannya dengan modal kecil itu resep hangus.",
      ),
      tf(
        "u7l4b2",
        "Yang posting PnL hijau belum tentu konsisten tiap bulan, karena yang rugi jarang posting.",
        true,
        "Survivor bias membuat yang tampil cuma yang menang, sehingga kelihatan lebih konsisten daripada kenyataannya.",
      ),
      tf(
        "u7l4b3",
        "Kalau orang jualan sinyal trading, dia pasti makan dari hasil tradingnya sendiri.",
        false,
        "Banyak penjual sinyal justru makan dari langganan, jadi untungnya belum tentu dari trading.",
      ),
      c(
        "u7l4b4",
        "Bagaimana cara paling rasional menyikapi grup sinyal berbayar?",
        [
          "Tanya dulu sumber penghasilannya",
          "Langsung ikut semua sinyal yang dibagikan",
          "Bayar lebih mahal biar sinyalnya lebih akurat",
          "Copy ukuran posisinya persis sama",
        ],
        "Pertanyaan pentingnya adalah sumber penghasilan penjual sinyal, karena kalau dari langganan, sinyalnya belum tentu menguntungkan.",
      ),
      c(
        "u7l4b5",
        "Apa itu survivor bias di dunia trading?",
        [
          "Yang tampil cuma yang bertahan hidup",
          "Semua trader punya hasil yang sama",
          "Keuntungan selalu dibagi rata ke semua",
          "Kerugian selalu dihapus oleh sistem",
        ],
        "Survivor bias membuat kamu cuma melihat yang berhasil, sementara yang bangkrut menghilang dari sorotan.",
      ),
      blank(
        "u7l4b6",
        "Copy ide orang boleh, tapi jangan copy ___ posisinya.",
        [
          "ukuran",
          "warnanya",
          "namanya",
          "jamnya",
        ],
        "Ukuran posisi harus disesuaikan modalmu sendiri, karena ukuran paus nggak cocok buat modal kecil.",
      ),
      c(
        "u7l4b7",
        "Apa yang nggak kelihatan saat kamu meniru paus dari layar HP?",
        [
          "Modal, leverage, dan kerugiannya",
          "Nama akun dan jumlah pengikutnya",
          "Warna latar chart di layar HP",
          "Jumlah komentar di postingannya",
        ],
        "Yang tampak cuma posisi yang hidup, sedangkan modal, leverage, dan kerugian di baliknya nggak kelihatan.",
      ),
  ],
  // ------------------------------------------------------------------ u8-l1
  "u8-l1": [
      c(
        "u8l1b1",
        "Kamu beli BTC di menu spot, lalu harganya turun 50%. Apa yang terjadi pada asetmu?",
        [
        "Asetnya tetap ada di dompetmu, cuma nilainya ikut turun",
        "Asetnya otomatis terlikuidasi dan saldomu jadi nol",
        "Asetnya diambil alih exchange buat menutup utangmu",
        "Asetnya hilang permanen karena kena batas rugi otomatis",
        ],
        "Di spot kamu benar-benar memiliki asetnya, jadi turun harga cuma menurunkan nilainya bukan menghapusnya.",
      ),
      tf(
        "u8l1b2",
        "Di spot, modal yang kamu pasang sendiri jadi batas maksimal rugimu karena kamu nggak pakai pinjaman.",
        true,
        "Tanpa pinjaman, kerugian spot dibatasi oleh modal yang kamu setor sendiri.",
      ),
      blank(
        "u8l1b3",
        "Kalau pakai leverage 10x lalu harga bergerak 10% melawan posisimu, posisimu kena ___.",
        [
          "likuidasi",
          "dividen rutin",
          "staking pasif",
        ],
        "Leverage 10x membuat gerakan 10% melawan arah cukup buat menghabiskan margin dan memicu likuidasi.",
      ),
      c(
        "u8l1b4",
        "Kenapa trading di aplikasi dengan tampilan mirip spot bisa jadi jauh lebih berisiko buat pemula?",
        [
          "Karena tanpa sadar kamu bisa sedang membuka kontrak futures berleverage",
          "Karena aplikasinya selalu memblokir seluruh transaksi yang dilakukan pemula",
          "Karena saldo di dalamnya otomatis dijadikan uang pinjaman berbunga",
          "Karena harga di dalamnya sengaja dimanipulasi oleh admin aplikasinya",
        ],
        "Tampilan yang mirip bisa menyamarkan bahwa yang dibuka sebenarnya kontrak futures berleverage tinggi.",
      ),
      c(
        "u8l1b5",
        "Dua orang sama-sama beli 0.01 BTC, satu di spot dan satu buka long 10x. Apa beda mendasarnya?",
        [
          "Yang spot benar-benar memiliki BTC, yang long 10x cuma pegang pinjaman",
          "Yang spot wajib bayar bunga tiap jam, sementara yang long 10x bebas biaya",
          "Yang long 10x punya BTC asli, sedangkan yang spot cuma pegang kontrak",
          "Keduanya sebenarnya sama saja, bedanya cuma tampilan di aplikasi",
        ],
        "Spot berarti kepemilikan aset, sedangkan long berleverage memakai dana pinjaman sehingga itu utang.",
      ),
      tf(
        "u8l1b6",
        "Pemula yang belum lancar spot sebaiknya langsung coba futures biar cepat mahir.",
        false,
        "Materi menyarankan menguasai spot dulu karena futures berleverage jauh lebih cepat menghabiskan saldo.",
      ),
      c(
        "u8l1b7",
        "Harga sudah balik ke titik awal setelah posisi leverage-mu terlikuidasi. Kenapa saldomu tetap habis?",
        [
        "Karena likuidasi menutup paksa posisimu dan uangnya nggak kembali",
        "Karena exchange menahan uangmu sampai harga stabil lagi",
        "Karena saldo otomatis dipindah ke posisi baru yang lebih aman",
        "Karena sistem mengembalikan uangmu setelah tiga hari kerja",
        ],
        "Likuidasi adalah penutupan paksa, jadi dana marginmu hilang saat itu dan nggak kembali walau harga balik.",
      ),
  ],
  // ------------------------------------------------------------------ u8-l2
  "u8-l2": [
      c(
        "u8l2b1",
        "Kamu pakai cross margin lalu posisimu terlikuidasi. Kenapa saldo lain di akunmu ikut hilang?",
        [
        "Karena cross margin bisa menyedot saldo lain buat menutup posisi",
        "Karena cross margin hanya memakai margin posisi itu saja",
        "Karena saldo lain sengaja dibekukan biar kamu nggak trading lagi",
        "Karena exchange menyita semua saldo tiap ada likuidasi",
        ],
        "Cross margin memakai seluruh saldo akunmu sebagai jaminan, sehingga likuidasi bisa menyedot dana lain.",
      ),
      tf(
        "u8l2b2",
        "Trader yang memasang stop loss di tiap posisi sebenarnya sedang melindungi modalnya, bukan sedang ragu.",
        true,
        "Stop loss berfungsi seperti rem yang membatasi rugi supaya modal tetap terjaga.",
      ),
      match(
        "u8l2b3",
        "Pasangkan istilah di dunia likuidasi dengan artinya.",
        [
          { left: "Isolated margin", right: "Risiko dibatasi hanya pada margin posisi itu" },
          { left: "Cross margin", right: "Risiko bisa menyedot saldo lain di akunmu" },
          { left: "Stop loss", right: "Rem yang membatasi rugi di posisi" },
          { left: "Funding", right: "Biaya berkala buat menahan posisi" },
        ],
        "Isolated membatasi risiko di satu posisi, cross menyedot saldo lain, stop loss membatasi rugi, dan funding adalah biaya menahan posisi.",
      ),
      c(
        "u8l2b4",
        "Kamu menahan posisi leverage semalaman sambil tidur. Apa yang bisa menggerus saldomu walau arah harga belum berubah?",
        [
        "Funding, fee, dan slippage yang ikut makan margin",
        "Bunga tabungan yang turun mendadak",
        "Pajak bulanan dari aplikasi exchange",
        "Biaya admin tetap yang diambil sekali setahun",
        ],
        "Funding, fee, dan slippage terus menggerus margin sehingga saldo bisa menyusut tanpa perubahan arah harga.",
      ),
      c(
        "u8l2b5",
        "Kenapa trader besar bisa tahan saat harga turun dalam, sementara kamu sering nggak?",
        [
          "Karena modal mereka jauh lebih besar buat menahan drawdown",
          "Karena mereka selalu tahu bahwa harga pasti akan naik lagi nanti",
          "Karena posisi mereka selalu bebas dari risiko likuidasi sama sekali",
          "Karena mereka memakai aplikasi trading yang jauh lebih canggih",
        ],
        "Modal yang jauh lebih besar membuat trader besar sanggup menahan drawdown yang bikin akun kecil terlikuidasi.",
      ),
      tf(
        "u8l2b6",
        "Kalau posisi kena likuidasi, uangmu aman dan akan kembali begitu harga balik ke arah semula.",
        false,
        "Likuidasi menutup paksa posisi, jadi uang marginnya hilang saat itu dan nggak kembali walau harga berbalik.",
      ),
      c(
        "u8l2b7",
        "Kombinasi kebiasaan mana yang paling sering bikin akun pemula hangus?",
        [
          "Nganalisa pakai HP sambil begadang, pakai leverage tinggi di koin random",
          "Nganalisa santai siang hari sambil pakai leverage rendah di koin besar",
          "Menyimpan modal di spot dan jarang trading, plus sabar menunggu harga naik",
          "Selalu pakai stop loss di setiap posisi tanpa pernah all in",
        ],
        "Kombinasi HP, leverage tinggi, dan koin random adalah pola klasik yang mempercepat akun hangus.",
      ),
  ],
  // ------------------------------------------------------------------ u8-l3
  "u8-l3": [
      c(
        "u8l3b1",
        "Modalmu Rp 2 juta dan kamu pakai batas risiko 2% per ide. Berapa yang boleh kamu pertaruhkan sekali trade?",
        [
        "Rp 40 ribu",
        "Rp 2 juta",
        "Rp 200 ribu",
        "Rp 1 juta",
        ],
        "Dua persen dari Rp 2 juta adalah Rp 40 ribu, itu batas rugi yang wajar per ide.",
      ),
      tf(
        "u8l3b2",
        "Membatasi risiko per transaksi ke 1-2% modal membuatmu tetap bertahan walau analisamu meleset.",
        true,
        "Risiko kecil per transaksi menjaga modal tetap ada sehingga kamu bisa lanjut walau beberapa kali salah.",
      ),
      blank(
        "u8l3b3",
        "Batas rugi maksimal yang kamu tentukan di setiap posisi disebut ukuran ___.",
        [
        "posisi",
        "dividen",
        "leverage",
        ],
        "Ukuran posisi menentukan berapa banyak modal yang kamu pertaruhkan di satu ide.",
      ),
      c(
        "u8l3b4",
        "Kamu kalah tiga kali berturut-turut lalu langsung menggandakan ukuran posisi buat balas dendam. Apa risikonya?",
        [
        "Keputusan saat emosi biasanya menghabiskan modal jauh lebih cepat",
        "Kemenangan dijamin datang karena pasar bergerak bergantian",
        "Risikonya sama saja seperti trading biasa yang tenang",
        "Posisi otomatis ditutup exchange sebelum kamu rugi",
        ],
        "Revenge trade membuat ukuran membengkak saat emosi, dan itu mempercepat modal habis.",
      ),
      c(
        "u8l3b5",
        "Kapan waktu yang tepat buat menaikkan ukuran posisimu?",
        [
        "Setelah catatan trading menunjukkan kamu memang mampu",
        "Segera setelah kamu merasa yakin dan bersemangat",
        "Setelah kalah besar biar rugi lama cepat tertutup",
        "Kapan saja, karena ukuran nggak mempengaruhi hasil",
        ],
        "Kenaikan ukuran posisi sebaiknya didasari catatan trading yang membuktikan kamu memang mampu.",
      ),
      tf(
        "u8l3b6",
        "Menaruh seluruh modal di satu koin sekaligus adalah cara tercepat melatih kesabaran trading.",
        false,
        "All in justru menghabiskan modal dalam sekejap, bukan melatih kesabaran.",
      ),
      c(
        "u8l3b7",
        "Seorang trader hangus Rp 426 dalam sehari. Menurut materi, penyebab paling sering apa?",
        [
        "Ukuran posisi yang terlalu besar, bukan karena koinnya salah",
        "Aplikasi exchange yang sedang error saat itu",
        "Koin yang dipilih memang selalu rugi buat semua orang",
        "Kurang sering melihat grafik di layar",
        ],
        "Kerugian besar seperti itu biasanya berasal dari ukuran posisi yang terlalu besar, bukan salah pilih koin.",
      ),
  ],
  // ------------------------------------------------------------------ u8-l4
  "u8-l4": [
      c(
        "u8l4b1",
        "Kamu klik beli di koin sepi dengan harga Rp 100, tapi yang keisi Rp 108. Apa itu?",
        [
          "Slippage, karena market order makan likuiditas yang tipis",
          "Bonus spesial dari exchange buat pengguna baru",
          "Pajak pembelian koin yang wajib dibayar di setiap order pembelian",
          "Bug aplikasi yang bisa kamu klaim ke tim support",
        ],
        "Slippage terjadi karena market order menyapu likuiditas tipis sehingga harga isi bergeser dari yang tampil.",
      ),
      tf(
        "u8l4b2",
        "Limit order menunggu harga tertentu, sementara market order langsung tereksekusi di harga yang tersedia.",
        true,
        "Limit order menunggu di harga yang kamu tentukan, sedangkan market order buru-buru tereksekusi di harga pasar.",
      ),
      blank(
        "u8l4b3",
        "Selisih antara harga beli dan harga jual di buku order disebut ___.",
        [
        "spread",
        "slippage",
        "nonce",
        ],
        "Spread adalah jarak antara harga beli terbaik dan harga jual terbaik di buku order.",
      ),
      c(
        "u8l4b4",
        "Spread di sebuah koin tiba-tiba melebar jauh. Apa yang paling mungkin sedang terjadi?",
        [
          "Pasarnya sedang sepi atau kacau sehingga likuiditasnya tipis",
          "Koinnya baru saja diumumkan akan naik tajam oleh tim proyeknya",
          "Exchange memberi diskon biaya buat trader baru",
          "Volumenya sedang sangat tinggi dan sehat",
        ],
        "Spread lebar menandakan pasar sedang sepi atau kacau, jadi likuiditasnya tipis.",
      ),
      c(
        "u8l4b5",
        "Kenapa slippage 5% sering muncul di memecoin tapi jarang di BTC?",
        [
          "Karena likuiditas memecoin jauh lebih tipis, jadi harga gampang tergeser",
          "Karena memecoin punya pajak tetap yang selalu sebesar 5 persen",
          "Karena BTC sengaja dilarang diperdagangkan lewat market order di semua exchange",
          "Karena aplikasi memecoin memang selalu salah menghitung harga",
        ],
        "Likuiditas memecoin yang tipis membuat order mudah menggeser harga, sedangkan BTC jauh lebih dalam.",
      ),
      tf(
        "u8l4b6",
        "Harga yang tampil di layar selalu sama persis dengan harga yang akhirnya kamu dapat.",
        false,
        "Harga di layar bukan harga dapet, karena slippage dan spread bisa membuat harga isi berbeda.",
      ),
      c(
        "u8l4b7",
        "Sebelum trading koin yang belum kamu kenal, apa yang lebih penting dilihat daripada cuma candle?",
        [
          "Kedalaman buku order buat memperkirakan likuiditasnya",
          "Warna latar aplikasi wallet yang kamu pakai sehari hari",
          "Jumlah komentar di kolom chat grup Telegram",
          "Jam berapa koin itu pertama kali dibuat dan diluncurkan",
        ],
        "Kedalaman buku order menunjukkan likuiditas, sehingga kamu bisa memperkirakan seberapa besar slippage.",
      ),
  ],
  // ------------------------------------------------------------------ u8-l5
  "u8-l5": [
      c(
        "u8l5b1",
        "Kamu long di perps dan arah harga benar, tapi saldomu tetap menyusut. Kenapa bisa begitu?",
        [
          "Karena funding rate yang harus kamu bayar terus menyedot saldomu",
          "Karena posisi long selalu kena potongan pajak arah dari bursa setiap jam",
          "Karena exchange salah menghitung nilai P&L dari posisimu",
          "Karena harga selalu turun sesaat setelah kamu masuk posisi",
        ],
        "Funding rate yang harus dibayar saat menahan posisi bisa menggerus saldo walau arah harga benar.",
      ),
      tf(
        "u8l5b2",
        "Saat mayoritas trader long, funding biasanya dibayar oleh posisi long ke posisi short.",
        true,
        "Kalau long sedang rame, funding menjadi plus sehingga pihak long membayar pihak short.",
      ),
      match(
        "u8l5b3",
        "Pasangkan istilah di dunia perpetual futures dengan artinya.",
        [
          { left: "Perpetual futures", right: "Kontrak tanpa tanggal jatuh tempo" },
          { left: "Funding rate", right: "Biaya berkala buat menahan posisi" },
          { left: "Open interest", right: "Jumlah kontrak yang masih terbuka" },
          { left: "Spot", right: "Kamu benar-benar memiliki asetnya" },
        ],
        "Perps adalah kontrak tanpa jatuh tempo, funding biaya berkala, open interest jumlah kontrak terbuka, dan spot berarti kepemilikan aset.",
      ),
      c(
        "u8l5b4",
        "Funding 0,1% per 8 jam kelihatan kecil. Kenapa materi menyebutnya bisa jadi gila?",
        [
          "Karena kalau ditahan lama, biaya itu menumpuk terus dan menggerus modal",
          "Karena funding selalu berubah jadi pajak bulanan yang wajib",
          "Karena angka kecil nggak pernah berpengaruh ke saldo akhir",
          "Karena funding cuma dibayar satu kali saja saat posisi baru pertama dibuka",
        ],
        "Funding dibayar berkala, jadi kalau posisi ditahan lama biayanya menumpuk dan bisa menggerus modal.",
      ),
      c(
        "u8l5b5",
        "Open interest sedang rame dan funding ekstrem. Apa yang sering terjadi setelahnya?",
        [
        "Sering jadi jebakan squeeze karena pasar terlalu sesak",
        "Harga dijamin naik terus tanpa koreksi",
        "Funding otomatis berhenti dan kamu untung besar",
        "Exchange menutup semua posisi tanpa kerugian",
        ],
        "Open interest rame dengan funding ekstrem menandakan pasar sesak dan sering berujung jebakan squeeze.",
      ),
      tf(
        "u8l5b6",
        "Di perps, kamu benar-benar memegang asetnya seperti di spot, cuma beda nama menunya.",
        false,
        "Perps adalah kontrak, jadi kamu cuma memegang P&L dan bukan aset seperti di spot.",
      ),
      c(
        "u8l5b7",
        "Apa bedanya yang kamu pegang saat pakai spot dibanding saat pakai perps?",
        [
          "Di spot kamu punya asetnya, di perps kamu cuma pegang kontrak dan P&L",
          "Di spot kamu cuma pegang kontrak, sementara di perps kamu punya aset aslinya",
          "Keduanya sama saja, yang beda cuma nama menu di aplikasinya",
          "Di perps kamu punya aset asli yang bisa ditarik kapan saja ke wallet",
        ],
        "Spot berarti kamu memiliki asetnya, sedangkan perps hanya kontrak taruhan sehingga yang kamu pegang cuma P&L.",
      ),
  ],
  // ------------------------------------------------------------------ u9-l1
  "u9-l1": [
      c(
        "u9l1b1",
        "MC (market cap) sebuah memecoin $10 juta tapi likuiditasnya cuma $40 ribu. Kenapa ini bahaya?",
        [
          "Karena market cap di layar bukan uang yang benar-benar bisa ditarik",
          "Karena market cap yang kecil selalu berarti koin itu berkualitas tinggi",
          "Karena likuiditas yang besar menjamin harga nggak bisa jatuh",
          "Karena angka market cap dihitung dari jumlah follower akunnya",
        ],
        "Market cap di layar bukan uang yang bisa ditarik, jadi likuiditas tipis bikin harga gampang bolong.",
      ),
      tf(
        "u9l1b2",
        "Kalau sebagian besar supply dipegang developer atau bundler, mereka bisa dump dan bikin harga jatuh.",
        true,
        "Supply yang menumpuk di developer atau bundler membuat mereka bisa menjual besar-besaran dan menghancurkan harga.",
      ),
      blank(
        "u9l1b3",
        "Jual-beli ke dirinya sendiri buat memalsukan volume disebut ___ trading.",
        [
        "wash",
        "margin",
        "spot",
        ],
        "Wash trading adalah jual-beli ke wallet sendiri supaya volume terlihat ramai padahal palsu.",
      ),
      c(
        "u9l1b4",
        "Sebuah memecoin punya 'community' yang ramai di grup. Kenapa materi menyarankan curiga?",
        [
        "Karena bisa jadi cuma 3 bot dan 1 admin yang mengurusnya",
        "Karena komunitas ramai selalu tanda proyek serius",
        "Karena admin asli pasti mau bagi hasil ke semua anggota",
        "Karena grup ramai berarti tokennya pasti aman",
        ],
        "Keramaian grup bisa palsu karena sering cuma diisi beberapa bot dan satu admin.",
      ),
      c(
        "u9l1b5",
        "Kenapa yang masuk terakhir di sebuah memecoin sering dirugikan?",
        [
        "Karena yang masuk awal memakai mereka sebagai pintu keluar",
        "Karena harga selalu naik buat semua yang ikut beli",
        "Karena token terakhir otomatis dikembalikan ke developer",
        "Karena exchange mengunci dana pembeli terakhir",
        ],
        "Yang masuk awal butuh pembeli berikutnya buat keluar, jadi yang terakhir sering jadi exit mereka.",
      ),
      tf(
        "u9l1b6",
        "Memecoin itu cuma versi mini dari saham, jadi analisanya bisa pakai cara yang sama persis.",
        false,
        "Memecoin digerakkan segelintir wallet dan degen, jadi bukan saham mini dan nggak bisa dianalisa dengan cara sama.",
      ),
      c(
        "u9l1b7",
        "Uang sewa kamu, boleh dipakai beli memecoin nggak?",
        [
          "Nggak, karena memecoin harus dianggap uang yang siap hangus",
          "Boleh, asal koinnya sedang naik terus di grafik harga hariannya",
          "Boleh, karena memecoin pasti balik modal",
          "Boleh, asal kamu pinjam dulu dari teman dekat",
        ],
        "Memecoin harus dianggap uang yang siap hangus, jadi jangan pakai uang sewa buat membelinya.",
      ),
  ],
  // ------------------------------------------------------------------ u9-l2
  "u9-l2": [
      c(
        "u9l2b1",
        "Kamu berhasil beli token, tapi tiap kali mau jual selalu gagal 'transfer from failed'. Ini kemungkinan apa?",
        [
        "Honeypot, kontraknya sengaja memblokir penjualan",
        "Server exchange yang sedang down sementara",
        "Kamu salah mengetik jumlah token yang dijual",
        "Harga token sedang terlalu tinggi buat dijual",
        ],
        "Honeypot mengizinkan pembelian tapi memblokir penjualan, sehingga jual selalu gagal.",
      ),
      tf(
        "u9l2b2",
        "Token yang sudah renounced tetap bisa menyimpan jebakan yang dipasang sebelum kepemilikannya dilepas.",
        true,
        "Renounced cuma melepas kendali owner, jadi jebakan yang sudah tertanam sebelumnya tetap bisa aktif.",
      ),
      blank(
        "u9l2b3",
        "Kontrak yang mengizinkan beli tapi memblokir jual disebut perangkap ___.",
        [
        "honeypot",
        "dividen",
        "staking",
        ],
        "Perangkap honeypot membolehkan kamu membeli tapi mengunci penjualan.",
      ),
      c(
        "u9l2b4",
        "Kenapa renounced (pemilik melepas kendali kontrak) belum tentu aman?",
        [
          "Karena jebakan bisa sudah dipasang sebelum kepemilikan dilepas",
          "Karena renounced selalu menghapus semua kode jahat yang ada di kontrak",
          "Karena kontrak jadi nggak bisa dipakai oleh siapa pun lagi",
          "Karena pemilik baru otomatis menjamin keamanan dari token",
        ],
        "Jebakan seperti pajak jual atau blacklist bisa sudah dipasang sebelum owner melepas kendali.",
      ),
      c(
        "u9l2b5",
        "Sebelum beli token baru, cara paling murah mengecek bisa nggak dijual adalah?",
        [
          "Coba simulasi jual lewat tools seperti honeypot.is atau rugcheck",
          "Tanya langsung ke admin grup Telegram-nya",
          "Lihat jumlah follower akun Twitter proyeknya",
          "Percaya saja karena kontraknya sudah renounced dan sudah dikunci",
        ],
        "Simulasi jual lewat tools pengecek bisa menunjukkan apakah token memblokir penjualan sebelum kamu beli.",
      ),
      tf(
        "u9l2b6",
        "Kalau pajak jual cuma 99%, itu wajar dan tetap aman buat trading cepat.",
        false,
        "Pajak jual 99% membuatmu hampir kehilangan seluruh nilai saat menjual, itu jebakan bukan hal wajar.",
      ),
      c(
        "u9l2b7",
        "Kamu dikirim CA (alamat kontrak) lewat DM dari orang yang nggak kamu kenal. Sebaiknya gimana?",
        [
        "Curiga dan verifikasi sendiri dulu, jangan langsung beli",
        "Langsung beli karena pengirimnya pasti sudah untung",
        "Minta dulu bukti screenshot keuntungan dari pengirim",
        "Belikan sedikit saja biar nggak ketinggalan",
        ],
        "CA dari DM orang asing itu mencurigakan, jadi lebih baik verifikasi sendiri daripada langsung membeli.",
      ),
  ],
  // ------------------------------------------------------------------ u9-l3
  "u9-l3": [
      c(
        "u9l3b1",
        "Sebuah koin naik 100x dalam 11 menit, lalu LP-nya dicabut menit ke-12. Apa yang kamu saksikan?",
        [
          "Rugpull, karena owner menarik kolam likuiditas dan harga jatuh ke nol",
          "Koreksi sehat yang memang wajar terjadi di hampir semua koin berkualitas",
          "Airdrop gratis buat semua pemegang token yang aktif",
          "Upgrade kontrak yang bikin token makin kuat dan diminati",
        ],
        "Owner yang mencabut LP membuat kolam likuiditas hilang dan harga langsung jatuh ke nol, itu rugpull.",
      ),
      tf(
        "u9l3b2",
        "Kalau LP nggak dikunci dan owner masih aktif, mereka bisa mencabut kolam likuiditas kapan saja.",
        true,
        "LP yang nggak dikunci bisa ditarik pemiliknya kapan saja, dan itu langsung menjatuhkan harga.",
      ),
      c(
        "u9l3b3",
        "Fungsi mint di kontrak sebuah token masih hidup. Kenapa itu bahaya?",
        [
          "Karena supply bisa digelontor seenaknya sampai harga anjlok",
          "Karena mint otomatis mengunci likuiditas selamanya di dalam pool",
          "Karena mint cuma bisa dipakai buat membakar token lama",
          "Karena mint menjamin harga token nggak bisa turun lagi",
        ],
        "Mint yang masih hidup membuat supply bisa ditambah sesuka hati, sehingga harga gampang anjlok.",
      ),
      c(
        "u9l3b4",
        "Apa tanda yang paling perlu kamu cek sebelum beli koin baru?",
        [
          "Apakah likuiditasnya dikunci dan siapa pemilik kontraknya",
          "Warna tema situs resmi proyeknya sendiri",
          "Jumlah stiker lucu dan keramaian anggota di grup Telegram-nya",
          "Berapa lama admin grup ini terakhir tidur",
        ],
        "Status LP lock dan siapa pemilik kontrak menentukan apakah mereka bisa mencabut likuiditas.",
      ),
      tf(
        "u9l3b5",
        "Selama chart-nya hijau dan naik terus, status LP lock nggak perlu kamu pedulikan.",
        false,
        "Chart hijau bisa berbalik seketika kalau LP dicabut, jadi status LP lock tetap wajib dicek.",
      ),
      c(
        "u9l3b6",
        "Bundle launch (banyak wallet tim masuk bareng) sering diikuti apa?",
        [
        "Dump terkoordinasi saat harga sudah cukup tinggi",
        "Pembagian deviden rutin ke semua pembeli",
        "Penguncian likuiditas otomatis tanpa campur tangan",
        "Harga yang stabil dan nggak bisa turun",
        ],
        "Wallet tim yang masuk bareng bisa menjual secara terkoordinasi begitu harga cukup tinggi.",
      ),
      match(
        "u9l3b7",
        "Pasangkan istilah di dunia likuiditas memecoin dengan artinya.",
        [
          { left: "LP lock", right: "Likuiditas yang dikunci dan nggak bisa ditarik" },
          { left: "Mint function", right: "Fungsi buat mencetak supply baru" },
          { left: "Rugpull", right: "Owner mencabut kolam dan harga ke nol" },
          { left: "Bundle launch", right: "Wallet tim masuk membeli bareng di awal" },
        ],
        "LP lock mengunci likuiditas, mint mencetak supply baru, rugpull mencabut kolam, dan bundle launch adalah wallet tim masuk bareng.",
      ),
  ],
  // ------------------------------------------------------------------ u9-l4
  "u9-l4": [
      c(
        "u9l4b1",
        "Kamu baru dapat 'call' di grup setelah koinnya naik 5x. Posisimu sebenarnya apa?",
        [
          "Sering jadi likuiditas buat yang masuk jauh lebih awal",
          "Selalu jadi orang pertama yang tahu informasi penting",
          "Pasti dapat harga paling murah di seluruh pasar",
          "Dijamin untung karena sudah ada sinyal resmi dari grup",
        ],
        "Call yang datang setelah kenaikan besar sering membuat kamu jadi likuiditas buat yang masuk lebih awal.",
      ),
      tf(
        "u9l4b2",
        "Grup 'free gem' yang minta 1 SOL buat whitelist sebenarnya sedang menjual harapan.",
        true,
        "Permintaan bayar buat whitelist di grup 'free gem' cuma penjualan harapan tanpa jaminan apa pun.",
      ),
      c(
        "u9l4b3",
        "Kenapa screenshot call hijau di grup sinyal nggak bisa dipercaya?",
        [
        "Karena yang dipamerkan cuma yang untung, yang rugi dihapus",
        "Karena screenshot selalu dilarang di grup sinyal",
        "Karena semua call hijau pasti hasil manipulasi aplikasi",
        "Karena admin nggak pernah memegang token apa pun",
        ],
        "Screenshot diseleksi, jadi cuma call yang untung yang ditampilkan sementara yang rugi dihapus.",
      ),
      c(
        "u9l4b4",
        "Admin sebuah grup melarang anggotanya mengkritik atau bertanya. Itu tanda apa?",
        [
        "Itu kultus, bukan riset yang sehat",
        "Itu tanda grupnya sangat transparan",
        "Itu bukti semua anggotanya sudah untung",
        "Itu cara wajar menjaga suasana grup",
        ],
        "Larangan mengkritik menandakan kultus, bukan komunitas riset yang sehat.",
      ),
      tf(
        "u9l4b5",
        "Grup sinyal berbayar yang menjanjikan untung pasti itu jaminan cuan.",
        false,
        "Nggak ada grup sinyal yang bisa menjamin untung, jadi klaim seperti itu cuma menjual harapan.",
      ),
      c(
        "u9l4b6",
        "Siapa yang biasanya tahu lebih dulu di sebuah circle?",
        [
          "Orang dalam yang dapat alokasi awal, sementara kamu dapat sisa",
          "Anggota terakhir yang baru saja gabung ke grup",
          "Semua anggota tahu bersamaan tanpa ada perbedaan waktu sedikit pun",
          "Orang yang paling rajin bertanya di grup chat",
        ],
        "Orang dalam dapat alokasi awal dan kamu dapat sisa, jadi yang awal tahu dan yang akhir bayar.",
      ),
      blank(
        "u9l4b7",
        "Boleh ikut grup call buat hiburan, tapi jangan pakai uang ___.",
        [
        "gaji",
        "kertas",
        "mainan",
        ],
        "Grup call sebaiknya cuma buat hiburan, bukan tempat menaruh uang gaji.",
      ),
  ],
  // ------------------------------------------------------------------ u10-l1
  "u10-l1": [
      c(
        "u10l1b1",
        "Di walletmu muncul token bernama 'USDT'. Kenapa kamu nggak bisa langsung percaya?",
        [
          "Karena nama gampang dipalsu, yang penting alamat kontraknya",
          "Karena token yang muncul di wallet selalu otomatis asli",
          "Karena USDT itu cuma ada di jaringan testnet saja",
          "Karena explorer nggak pernah menampilkan token yang benar-benar asli",
        ],
        "Nama token gampang dipalsu, jadi kamu harus memeriksa alamat kontraknya lewat explorer.",
      ),
      tf(
        "u10l1b2",
        "Explorer menampilkan data langsung dari blockchain, jadi lebih bisa dipercaya daripada grafik di situs sembarangan.",
        true,
        "Explorer membaca data langsung dari rantai, sehingga lebih valid daripada grafik di situs random.",
      ),
      c(
        "u10l1b3",
        "Kamu cek sebuah token dan 80% supply-nya dipegang 3 wallet. Artinya apa?",
        [
          "Harga gampang digerakkan dan bisa di-dump kapan saja oleh mereka",
          "Token itu pasti aman karena cuma dipegang sedikit orang",
          "Supply-nya otomatis terkunci dan nggak bisa dijual oleh siapa pun juga",
          "Tiga wallet itu pasti milik komunitas yang sangat peduli",
        ],
        "Kalau sedikit wallet memegang sebagian besar supply, mereka bisa menggerakkan atau men-dump harga kapan saja.",
      ),
      c(
        "u10l1b4",
        "Kenapa waktu transaksi pertama dan pola bundling wallet penting dicek?",
        [
          "Karena sering membocorkan siapa tim di balik token itu",
          "Karena menentukan warna grafik harga di aplikasinya",
          "Karena mempengaruhi besar biaya gas yang harus kamu bayar",
          "Karena menunjukkan jumlah follower dari proyeknya",
        ],
        "Tx pertama dan bundling wallet sering membocorkan keberadaan tim di balik token.",
      ),
      tf(
        "u10l1b5",
        "Selama namanya sama dengan token terkenal, alamat kontraknya pasti asli.",
        false,
        "Nama mirip justru sering dipakai buat menipu, jadi keaslian harus dicek dari alamat kontraknya.",
      ),
      blank(
        "u10l1b6",
        "Alamat resmi proyek sebaiknya diambil dari dokumen resmi atau akun yang sudah ___.",
        [
          "terverifikasi",
          "tertutup rapat",
          "tersembunyi rapat",
        ],
        "Alamat resmi biasanya ada di dokumen resmi atau akun terverifikasi, bukan dari reply bot.",
      ),
      c(
        "u10l1b7",
        "Apa yang bisa kamu lihat lewat explorer yang nggak kelihatan dari chart?",
        [
        "Riwayat transfer, kontrak, gas, dan nonce",
        "Prediksi harga besok pagi",
        "Nama asli semua orang yang beli",
        "Jumlah keuntungan yang pasti kamu dapat",
        ],
        "Explorer seperti CCTV rantai yang menampilkan transfer, kontrak, gas, dan nonce.",
      ),
  ],
  // ------------------------------------------------------------------ u10-l2
  "u10-l2": [
      c(
        "u10l2b1",
        "Sebuah situs mint NFT minta approve USDT unlimited. Kenapa kamu harus tolak?",
        [
          "Karena mint nggak butuh izin sebesar itu, dan izin itu membuka pintu buat dana disedot",
          "Karena izin unlimited sebesar itu selalu gagal dan nggak pernah bisa dipakai di situs mint",
          "Karena USDT nggak bisa dipakai buat membayar mint NFT apa pun",
          "Karena mint NFT nggak butuh wallet sama sekali buat jalan",
        ],
        "Mint nggak butuh approve unlimited, dan izin sebesar itu membuka pintu buat danamu disedot nanti.",
      ),
      tf(
        "u10l2b2",
        "Approve itu seperti surat kuasa, jadi kalau kontraknya jahat saldomu bisa ditarik nanti.",
        true,
        "Approve memberi izin kontrak memakai tokenmu, jadi kontrak jahat bisa menarik saldo sesuai izin itu.",
      ),
      match(
        "u10l2b3",
        "Pasangkan istilah seputar izin kontrak dengan artinya.",
        [
          { left: "Approve", right: "Izin kontrak buat memakai tokenmu" },
          { left: "Revoke", right: "Mencabut izin yang sudah kamu berikan" },
          { left: "Unlimited approve", right: "Pintu terbuka lebar buat dana disedot" },
          { left: "Permit2", right: "Izin dengan bentuk pembungkus yang berbeda" },
        ],
        "Approve adalah izin, revoke mencabutnya, unlimited approve membuka pintu lebar, dan permit2 adalah izin dengan bungkus berbeda.",
      ),
      c(
        "u10l2b4",
        "Setelah selesai mencoba dapp baru, langkah aman yang disarankan apa?",
        [
        "Revoke izin lewat etherscan atau revoke.cash",
        "Biarkan izinnya karena nggak berpengaruh",
        "Ganti nama wallet biar izinnya hilang",
        "Hapus aplikasi wallet dari HP saja",
        ],
        "Izin yang nggak dipakai sebaiknya dicabut lewat etherscan atau revoke.cash supaya nggak jadi celah.",
      ),
      c(
        "u10l2b5",
        "Saat diminta tanda tangan transaksi, apa yang wajib kamu baca?",
        [
          "Apakah isinya transfer, setApproval, atau increaseAllowance",
          "Berapa banyak temanmu yang sudah memakai dapp ini sebelumnya",
          "Warna tombol konfirmasi di aplikasi wallet yang kamu pakai",
          "Jam berapa transaksi itu dibuat oleh sistemnya",
        ],
        "Kamu wajib membaca isi yang ditandatangani, apakah transfer, setApproval, atau increaseAllowance.",
      ),
      tf(
        "u10l2b6",
        "Sekali kamu beri approve unlimited, izin itu otomatis hilang sendiri setelah transaksi selesai.",
        false,
        "Approve unlimited tetap berlaku sampai kamu revoke, jadi izinnya nggak hilang sendiri.",
      ),
      c(
        "u10l2b7",
        "Kenapa permit atau permit2 tetap harus kamu waspadai?",
        [
          "Karena itu tetap sebuah izin, cuma bentuknya berbeda",
          "Karena permit sebenarnya nggak bisa dipakai buat apa pun",
          "Karena permit selalu dibatalkan otomatis oleh sistem",
          "Karena permit cuma berlaku di jaringan testnet",
        ],
        "Permit dan permit2 tetap sebuah izin, jadi risikonya sama walau bentuknya berbeda.",
      ),
  ],
  // ------------------------------------------------------------------ u10-l3
  "u10-l3": [
      c(
        "u10l3b1",
        "Proyek memajang logo 'Certik' di banner Telegram, tapi laporan aslinya merujuk kontrak lain. Apa itu?",
        [
          "Audit palsu, karena laporannya nggak cocok dengan kontrak aslinya",
          "Audit asli yang cuma salah ketik alamat kontrak di halaman laporannya",
          "Tanda proyeknya sudah diaudit berkali-kali oleh firma",
          "Bukti bahwa kontraknya baru saja diperbarui timnya",
        ],
        "Audit bisa dipalsu, jadi kamu harus mengecek firma dan alamat kontrak di dalam laporannya.",
      ),
      tf(
        "u10l3b2",
        "Kamu perlu menumpuk banyak sinyal, karena satu centang hijau saja nggak cukup menyelamatkanmu.",
        true,
        "Nggak ada satu centang yang menjamin aman, jadi sinyal harus ditumpuk dan dicek bersamaan.",
      ),
      c(
        "u10l3b3",
        "Kombinasi mana yang disebut materi sebagai 'kombinasi merah'?",
        [
        "Mint masih hidup, LP nggak dikunci, dan pajak jual aneh",
        "Holder tersebar, LP terkunci, dan audit jelas",
        "Volume tinggi, harga stabil, dan komunitas aktif",
        "Supply tetap, gas murah, dan chart naik",
        ],
        "Mint hidup, LP nggak dikunci, dan pajak jual aneh adalah kombinasi merah yang paling berbahaya.",
      ),
      c(
        "u10l3b4",
        "Kenapa jumlah follower dan engagement sebuah proyek belum tentu valid?",
        [
        "Karena follower bisa dibeli dan engagement bisa dari bot",
        "Karena follower tinggi selalu tanda proyek serius",
        "Karena engagement dihitung dari harga token",
        "Karena bot nggak bisa masuk ke akun proyek",
        ],
        "Follower bisa dibeli dan engagement bisa dari bot, jadi angka sosial nggak otomatis valid.",
      ),
      tf(
        "u10l3b5",
        "Satu PDF audit sudah cukup jadi bukti sebuah proyek aman tanpa perlu cek lain.",
        false,
        "Audit PDF bisa dipalsu, jadi tetap harus dicek firma dan alamat kontraknya, bukan cuma percaya file.",
      ),
      blank(
        "u10l3b6",
        "Mint hidup, LP terbuka, dan pajak jual aneh disebut kombinasi ___.",
        [
        "merah",
        "hijau",
        "netral",
        ],
        "Kombinasi mint hidup, LP terbuka, dan pajak jual aneh disebut kombinasi merah karena berisiko tinggi.",
      ),
      c(
        "u10l3b7",
        "Saat membaca laporan audit, apa yang paling penting kamu cek?",
        [
          "Firma yang menerbitkan dan alamat kontrak di dalam laporannya",
          "Jumlah halaman laporan dan warna sampul depan laporan auditnya",
          "Nama desainer yang membuat logo proyeknya",
          "Berapa lama laporan itu diunggah ke situsnya",
        ],
        "Kamu harus mengecek firma penerbit dan alamat kontrak di laporan supaya auditnya nggak palsu.",
      ),
  ],
  // ------------------------------------------------------------------ u10-l4
  "u10-l4": [
      c(
        "u10l4b1",
        "Kamu lihat iklan Google di posisi teratas yang mirip situs exchange. Kenapa harus curiga?",
        [
          "Google ads bisa menampilkan situs phishing di atas hasil asli",
          "Karena iklan Google selalu diblokir di Indonesia",
          "Karena exchange resmi nggak pernah muncul di hasil pencarian Google",
          "Karena iklan selalu mengarah ke situs yang aman",
        ],
        "Iklan Google bisa menampilkan phishing di atas hasil asli, jadi jangan asal klik iklan.",
      ),
      tf(
        "u10l4b2",
        "Cara paling aman membuka situs exchange adalah mengetik URL-nya sendiri atau pakai bookmark.",
        true,
        "Mengetik URL sendiri atau memakai bookmark menghindarkanmu dari tautan palsu yang disebar.",
      ),
      c(
        "u10l4b3",
        "Domain yang beda satu huruf dari situs aslinya disebut apa?",
        [
          "Phishing, situs palsu buat mencuri datamu",
          "Mirror resmi yang dibuat buat akses cadangan",
          "Subdomain baru yang sah dan resmi dari proyek",
          "Versi lama yang belum sempat diperbarui",
        ],
        "Domain yang beda satu huruf adalah phishing, situs palsu yang dibuat buat mencuri datamu.",
      ),
      c(
        "u10l4b4",
        "Seseorang mengaku CS dan DM duluan minta kode verifikasi. Harus gimana?",
        [
          "Abaikan, karena CS resmi nggak pernah DM duluan minta kode",
          "Kirim saja kodenya biar masalahmu cepat selesai dan beres semua",
          "Balas dulu sambil tanya nama dan jabatan resminya",
          "Kirim kode tapi minta jaminan keamanan dulu",
        ],
        "CS resmi nggak pernah DM duluan apalagi minta kode, jadi pesan seperti itu harus diabaikan.",
      ),
      tf(
        "u10l4b5",
        "Link dari broadcast atau reply orang asing aman diklik selama tampilannya rapi.",
        false,
        "Tampilan rapi bisa dibuat palsu, jadi tautan dari broadcast atau reply asing tetap berisiko phishing.",
      ),
      blank(
        "u10l4b6",
        "Alamat situs yang beda satu huruf dari aslinya biasanya dipakai buat aksi ___.",
        [
        "phishing",
        "staking",
        "mining",
        ],
        "Alamat yang beda satu huruf biasanya dipakai buat phishing, yaitu mencuri data atau seed.",
      ),
      c(
        "u10l4b7",
        "Kenapa kamu sebaiknya nggak asal klik tautan 'support' yang mengirim pesan duluan?",
        [
          "Karena itu pola umum penipu buat mencuri seed atau kode",
          "Karena tautan support itu selalu lambat dibuka",
          "Karena support asli cuma melayani lewat telepon saja",
          "Karena tautan support dilarang dikirim di dalam aplikasi chat",
        ],
        "Support yang DM duluan adalah pola umum penipu buat mencuri seed phrase atau kode verifikasi.",
      ),
  ],
  // ------------------------------------------------------------------ u10-l5
  "u10-l5": [
      c(
        "u10l5b1",
        "Kamu mau coba bridge baru. Kenapa sebaiknya coba di Sepolia dulu?",
        [
          "Karena testnet pakai koin yang nggak berharga, jadi aman buat latihan",
          "Karena Sepolia memberi keuntungan asli pada tiap transaksi yang kamu buat",
          "Karena bridge cuma bisa dipakai di testnet saja",
          "Karena koin testnet bisa langsung ditukar jadi uang",
        ],
        "Testnet memakai koin yang nggak berharga, jadi aman buat mencoba dapp, bridge, atau mint tanpa risiko uang asli.",
      ),
      tf(
        "u10l5b2",
        "Simulasi transaksi sangat berguna buat menangkap banyak metode pengurasan dompet sebelum kamu tanda tangan di mainnet.",
        true,
        "Simulasi memperlihatkan apa yang akan berubah sebelum kamu tanda tangan, sehingga banyak metode pengurasan bisa tertangkap.",
      ),
      c(
        "u10l5b3",
        "Ada faucet yang minta 12 kata seed phrase kamu. Apa itu?",
        [
        "Penipu, karena faucet asli nggak pernah minta seed",
        "Faucet premium yang butuh verifikasi identitas",
        "Fitur baru buat mempercepat pengiriman gas",
        "Syarat wajib biar dapat koin testnet",
        ],
        "Faucet asli nggak pernah meminta seed phrase, jadi faucet yang memintanya jelas penipu.",
      ),
      c(
        "u10l5b4",
        "Simulasi menunjukkan 'success, 0 ETH'. Kenapa kamu tetap harus waspada?",
        [
        "Karena tetap perlu baca izin token yang kamu setujui",
        "Karena simulasi selalu bohong soal hasil transaksi",
        "Karena 0 ETH berarti transaksinya gagal total",
        "Karena centang hijau artinya dana pasti aman",
        ],
        "Simulasi hijau dengan 0 ETH tetap harus diikuti pemeriksaan izin token yang kamu setujui.",
      ),
      tf(
        "u10l5b5",
        "Karena format alamatnya mirip, mengirim ETH asli ke alamat testnet tetap aman dan bisa dikembalikan.",
        false,
        "Alamat testnet dan mainnet berbeda jaringan, jadi ETH asli yang salah kirim ke testnet nggak bisa dikembalikan.",
      ),
      match(
        "u10l5b6",
        "Pasangkan istilah seputar testnet dan simulasi dengan artinya.",
        [
          { left: "Testnet", right: "Rantai latihan dengan koin nggak berharga" },
          { left: "Faucet", right: "Sumber gas palsu buat latihan" },
          { left: "Simulasi tx", right: "Lihat dulu apa yang berubah sebelum sign" },
          { left: "Mainnet", right: "Jaringan dengan uang sungguhan" },
        ],
        "Testnet adalah rantai latihan, faucet sumber gas palsu, simulasi tx buat melihat perubahan, dan mainnet jaringan uang sungguhan.",
      ),
      c(
        "u10l5b7",
        "Kontrak baru muncul di mainnet tanpa audit dan tanpa testnet publik. Bagaimana sikapmu?",
        [
        "Anggap itu tanda bahaya dan jangan asal masuk",
        "Langsung masuk karena kontrak baru pasti murah",
        "Tunggu sehari lalu investasi besar-besaran",
        "Percaya karena belum ada yang melaporkan rugi",
        ],
        "Kontrak baru tanpa audit dan tanpa testnet publik adalah tanda bahaya, jadi jangan asal masuk.",
      ),
  ],
  // ------------------------------------------------------------------ u11-l1
  "u11-l1": [
      c(
        "u11l1b1",
        "Kamu mau ubah rupiah jadi USDT dengan aman sebagai langkah awal. Menurut materi, pintu mana yang paling cocok?",
        [
        "CEX terdaftar resmi yang bisa dipakai buat on-ramp rupiah",
        "DEX karena nggak ada CS yang bisa diblok sewaktu-waktu",
        "Grup Telegram yang ngaku bisa jualin USDT murah ke rekening pribadi",
        "Wallet pribadi kamu sendiri tanpa perlu platform apa pun",
        ],
        "CEX terdaftar resmi memang jadi pintu on-ramp rupiah yang aman karena diawasi dan punya layanan pengaduan.",
      ),
      tf(
        "u11l1b2",
        "Kalau kamu naruh semua kripto jangka panjang di CEX, kamu melanggar prinsip 'not your keys, not your coins'.",
        true,
        "Prinsip itu mengingatkan bahwa selama kunci masih dipegang platform, asetmu sebenarnya cuma titipan yang bisa diblok.",
      ),
      tf(
        "u11l1b3",
        "Di DEX, kalau kamu salah kirim ke alamat yang keliru, tim CS bisa bantu menariknya kembali.",
        false,
        "DEX cuma kode di blockchain tanpa CS, jadi transaksi yang salah alamat nggak bisa ditarik balik oleh siapa pun.",
      ),
      blank(
        "u11l1b4",
        "Saat mau main di DEX, kamu butuh biaya jaringan yang disebut ___ dan harus teliti memilih jaringan.",
        [
        "gas",
        "pajak",
        "bunga",
        "fee CS",
        ],
        "Transaksi di DEX dieksekusi di blockchain sehingga butuh gas dan ketelitian memilih jaringan yang benar.",
      ),
      c(
        "u11l1b5",
        "Seorang teman beli USDT di CEX lokal, lalu tarik ke wallet sendiri, baru swap di DEX. Kenapa urutannya begitu?",
        [
          "Karena tiap langkah punya risiko sendiri, jadi kunci sendiri lebih cocok jangka panjang",
          "Karena DEX cuma bisa dipakai kalau wallet-nya pernah nyambung ke CEX lokal dulu sebelumnya",
          "Karena CEX lokal melarang pengguna menyimpan kunci sendiri di wallet pribadi mereka",
          "Karena gas di DEX cuma bisa dibayar pakai rupiah dari rekening bank pribadi kamu",
        ],
        "Alurnya begitu karena on-ramp lewat CEX terdaftar lebih aman, sementara menyimpan kunci sendiri lebih pas untuk jangka panjang.",
      ),
      c(
        "u11l1b6",
        "Kamu baru pertama kali pegang wallet sendiri. Kesalahan yang paling mungkin bikin dana hilang di DEX adalah apa?",
        [
        "Salah pilih jaringan atau salah alamat saat mengirim",
        "Terlalu sering buka aplikasi wallet di HP",
        "Wallet-nya nggak pernah di-update ke versi terbaru",
        "Nama wallet kamu terlalu mudah ditebak orang lain",
        ],
        "DEX butuh ketelitian jaringan, dan salah jaringan atau salah alamat bikin dana hangus tanpa bisa dipulihkan.",
      ),
      c(
        "u11l1b7",
        "Materi menyimpulkan 'titip sebentar, simpen sendiri yang jangka panjang'. Maksudnya apa?",
        [
          "Pakai CEX buat transaksi cepat, simpan jangka panjang di wallet sendiri",
          "Simpan semua aset di CEX biar kamu nggak repot pegang kunci sendiri sama sekali",
          "Jangan pernah pakai CEX karena menurutmu selalu berbahaya buat siapa pun",
          "Pindah-pindah CEX tiap minggu biar terasa lebih aman buat kamu sendiri",
        ],
        "Mantra itu menyarankan CEX untuk titip sementara, sementara penyimpanan jangka panjang lebih baik di wallet sendiri.",
      ),
  ],
  // ------------------------------------------------------------------ u11-l2
  "u11-l2": [
      c(
        "u11l2b1",
        "Kamu jual USDT lewat P2P dan pembeli minta kamu lepas chat ke WA pribadi biar 'lebih cepat'. Apa yang sebaiknya kamu lakukan?",
        [
          "Tetap di dalam platform dan pakai escrow sampai kedua sisi tuntas",
          "Pindah ke WA pribadi karena prosesnya jadi jauh lebih cepat dan simpel",
          "Kirim aset dulu supaya pembeli percaya sama kamu dan transaksi lancar",
          "Batalkan escrow dan terima transfer ke rekening pribadi biar cepat cair",
        ],
        "Escrow hidup sampai kedua sisi tuntas, dan pindah chat ke WA pribadi bikin kamu kehilangan perlindungan platform.",
      ),
      tf(
        "u11l2b2",
        "Di P2P, harga USDT yang jauh lebih murah dari pasar biasanya tanda penjual baik hati.",
        false,
        "Harga terlalu bagus justru sering jadi umpan rekening kotor, jadi nggak ada hubungannya dengan kebaikan penjual.",
      ),
      tf(
        "u11l2b3",
        "Pembeli minta kamu transfer ke rekening dengan nama yang beda tanpa alasan kuat. Sebaiknya kamu tolak.",
        true,
        "Materi menyarankan jangan kirim ke rekening nama yang beda tanpa alasan kuat karena itu pola risiko rekening kotor.",
      ),
      match(
        "u11l2b4",
        "Pasangkan situasi P2P dengan sikap yang tepat.",
        [
          { left: "Pembeli minta pindah ke WA pribadi", right: "Tolak dan tetap pakai fitur platform" },
          { left: "Harga USDT jauh di bawah pasar", right: "Curigai sebagai umpan rekening kotor" },
          { left: "Rekening penerima beda nama", right: "Jangan lanjut tanpa alasan kuat" },
        ],
        "Semua situasi itu dijawab dengan tetap di escrow, curiga pada harga aneh, dan menolak rekening beda nama.",
      ),
      c(
        "u11l2b5",
        "Kenapa escrow penting banget di transaksi P2P?",
        [
        "Karena dia menahan aset sampai kedua sisi benar-benar tuntas",
        "Karena dia otomatis menaikkan harga jual kamu",
        "Karena dia menghapus semua risiko penipuan sepenuhnya",
        "Karena dia bisa dipakai buat mencairkan dana langsung ke bank",
        ],
        "Escrow hidup sampai kedua sisi tuntas, jadi dia melindungi proses, bukan menghapus semua risiko.",
      ),
      c(
        "u11l2b6",
        "Kamu lihat penawaran USDT murah banget dan penjual minta transfer BCA ke nama 'kakak saya'. Ini pola apa?",
        [
        "Umpan rekening kotor yang klasik di P2P",
        "Cara normal biar transaksi lebih cepat",
        "Trik penjual menghindari pajak platform",
        "Bukti penjual punya banyak rekening pribadi",
        ],
        "Permintaan transfer ke nama orang lain dengan harga terlalu murah itu pola klasik umpan rekening kotor.",
      ),
      c(
        "u11l2b7",
        "Sebelum melepas aset ke pembeli P2P, hal paling penting yang harus kamu pastikan adalah apa?",
        [
        "Escrow aktif dan nama penerima cocok dengan datanya",
        "Aplikasi kamu sudah dibuka lewat dua perangkat sekaligus",
        "Pembeli sudah kirim foto kartu identitasnya ke chat",
        "Harga di layar sudah naik sejak kamu buka tawaran",
        ],
        "Aturan P2P adalah escrow, nama cocok, jangan buru-buru, karena itu yang melindungi asetmu.",
      ),
  ],
  // ------------------------------------------------------------------ u11-l3
  "u11-l3": [
      c(
        "u11l3b1",
        "Kamu pindah koin dari CEX lokal ke wallet pribadi, lalu merasa sekarang jejaknya hilang. Benarkah anggapan itu?",
        [
        "Tidak, perpindahan ke wallet sendiri tetap meninggalkan jejak",
        "Benar, karena wallet pribadi nggak pernah tersambung ke blockchain",
        "Benar, selama kamu nggak pernah pakai DEX lagi",
        "Benar, karena CEX otomatis hapus datamu setelah penarikan",
        ],
        "Pindah CEX ke wallet tetap meninggalkan jejak on-chain, jadi bukan cara menghilangkan riwayat.",
      ),
      tf(
        "u11l3b2",
        "Menyimpan riwayat transaksi kripto sejak hari pertama lebih murah daripada panik saat kewajiban muncul.",
        true,
        "Catatan dari hari pertama bikin kamu siap saat kewajiban muncul, jauh lebih murah daripada panik belakangan.",
      ),
      tf(
        "u11l3b3",
        "Karena transaksi on-chain, kamu nggak perlu mencatat beli dan jual untuk urusan administrasi.",
        false,
        "Jejak on-chain tetap ada, tapi tetap perlu dicatat rapi karena catatan yang rapi memudahkan urusan administrasi.",
      ),
      blank(
        "u11l3b4",
        "Materi menyarankan menyimpan riwayat dalam bentuk rapi seperti ___ karena screenshot dianggap kurang bagus.",
        [
        "CSV",
        "selfie",
        "meme",
        "caption",
        ],
        "Catatan beli dan jual sebaiknya rapi, dan CSV dinilai lebih baik daripada sekadar screenshot.",
      ),
      c(
        "u11l3b5",
        "Kamu untung Rp 50 juta dari memecoin dan kaget ada kewajiban. Pelajaran utama dari materi ini apa?",
        [
          "Catatan transaksi dari hari pertama lebih murah daripada panik belakangan",
          "Keuntungan sebesar itu selalu bebas dari kewajiban apa pun juga di negeri ini",
          "Cukup hapus riwayat wallet biar kewajibannya hilang selamanya dari bank",
          "Tanya admin grup saja karena dia paling paham aturan yang berlaku",
        ],
        "Contoh untung besar yang bikin kaget menunjukkan catatan sejak awal lebih murah daripada panik di akhir.",
      ),
      c(
        "u11l3b6",
        "Kalau kamu ragu soal kewajiban pajak dari transaksi kripto, ke siapa sebaiknya bertanya?",
        [
        "Orang yang kerjanya memang di bidang pajak",
        "Admin grup Telegram yang paling ramai",
        "Penjual koin yang paling sering cuan",
        "Bot pencari sinyal di aplikasi trading",
        ],
        "Materi menegaskan kalau ragu soal pajak, tanya orang yang kerjanya memang menangani pajak, bukan admin grup.",
      ),
      c(
        "u11l3b7",
        "Kamu mau memastikan urusan administrasi transaksimu rapi. Kebiasaan apa yang paling membantu?",
        [
          "Mencatat beli dan jual sejak hari pertama dalam bentuk rapi",
          "Menghapus riwayat wallet tiap bulan biar bersih dan rapi selalu",
          "Menyimpan semua transaksi cuma di kepala tanpa catatan apa pun",
          "Mengandalkan screenshot acak di galeri HP yang berserakan itu",
        ],
        "Catatan sejak hari pertama yang rapi, misalnya CSV, jauh lebih membantu daripada mengandalkan ingatan atau screenshot acak.",
      ),
  ],
  // ------------------------------------------------------------------ u11-l4
  "u11-l4": [
      c(
        "u11l4b1",
        "Teman menawarkan 'bisa cairin USDT ke DANA 5 menit, fee 2%'. Kenapa tawaran ini berbahaya?",
        [
          "Karena datanya bisa masuk rekening gelap dan kamu yang ditanya bank",
          "Karena prosesnya terlalu lambat buat kebutuhan mendesak yang kamu hadapi",
          "Karena fee 2% selalu lebih mahal dari semua platform resmi lainnya",
          "Karena DANA nggak bisa menerima rupiah dari mana pun juga selama ini",
        ],
        "Perantara random 'cairin cepat' berisiko bikin rekeningmu dipakai aliran dana gelap, dan kamu yang kena pertanyaan.",
      ),
      tf(
        "u11l4b2",
        "Off-ramp resmi memang terasa lebih lambat, tapi lebih aman dibanding lewat perantara random.",
        true,
        "Off-ramp resmi lebih lambat karena ada proses, tapi justru itu yang bikin lebih aman dibanding perantara random.",
      ),
      tf(
        "u11l4b3",
        "Stablecoin itu setara uang tunai di bawah bantal karena nggak butuh proses jadi rupiah.",
        false,
        "Stablecoin bukan uang tunai di bawah bantal karena masih butuh jembatan on-ramp dan off-ramp untuk jadi rupiah.",
      ),
      blank(
        "u11l4b4",
        "Saat mencairkan kripto, bank bisa menanyakan ___ dana yang kamu peroleh.",
        [
        "sumber",
        "warna",
        "jumlah teman",
        "merek",
        ],
        "Bank memang bisa menanyakan sumber dana saat kamu mencairkan kripto, jadi siapkan penjelasan yang jelas.",
      ),
      c(
        "u11l4b5",
        "Kalau kamu mau mencairkan kripto besar ke rupiah, langkah yang paling masuk akal adalah apa?",
        [
        "Pecah transaksi wajar lewat platform berizin dengan nama jelas",
        "Pakai jasa 'cairin 10 menit' dari orang di grup biar cepat",
        "Kirim ke rekening teman dulu supaya nggak ketahuan bank",
        "Tukar dulu ke koin aneh biar jejaknya ngilang",
        ],
        "Pecah transaksi wajar, nama jelas, dan platform berizin adalah cara off-ramp yang lebih aman daripada jalur random.",
      ),
      c(
        "u11l4b6",
        "Kenapa materi bilang keluar ke rupiah lebih susah daripada masuk?",
        [
        "Karena bank bisa menanyakan sumber dana dan menahan rekening",
        "Karena kripto nggak bisa ditukar ke rupiah sama sekali",
        "Karena rupiah nggak diakui platform kripto mana pun",
        "Karena semua wallet otomatis diblokir saat mau menjual",
        ],
        "Bank bisa menanyakan sumber dana bahkan menahan rekening, jadi proses keluar memang lebih berhati-hati.",
      ),
      c(
        "u11l4b7",
        "Ada orang random janji bisa mencairkan dana dalam 5 menit. Risiko terbesar buat kamu apa?",
        [
        "Rekeningmu dipakai menampung dana dari sumber gelap",
        "Kamu kehilangan hak buat beli kripto selamanya",
        "Wallet kamu otomatis ditutup oleh pembuatnya",
        "Kamu wajib melaporkan semua temanmu ke bank",
        ],
        "Jasa cair cepat dari orang random berisiko menjadikan rekeningmu tempat dana gelap, dan kamu yang ditanya.",
      ),
  ],
  // ------------------------------------------------------------------ u11-l5
  "u11-l5": [
      c(
        "u11l5b1",
        "Sejak Januari 2025, pengawasan aset kripto di Indonesia pindah ke mana?",
        [
        "Dari Bappebti ke OJK",
        "Dari OJK ke Kominfo",
        "Dari BI ke Bappebti",
        "Dari OJK ke Kemenkeu",
        ],
        "Materi menyebut sejak Januari 2025 pengawasan aset kripto pindah dari Bappebti ke OJK.",
      ),
      tf(
        "u11l5b2",
        "Self-custody bikin transaksi kamu nggak bisa dilacak negara dan otomatis bebas pajak.",
        false,
        "Self-custody nggak menghilangkan jejak on-chain dan nggak otomatis bikin transaksimu bebas pajak.",
      ),
      tf(
        "u11l5b3",
        "Aturan kripto di Indonesia bisa berubah, jadi penting cek sumber resmi daripada cuma hafal info admin grup.",
        true,
        "Aturan memang hidup dan bisa berubah, jadi sumber resmi lebih bisa dipercaya daripada hafalan admin grup.",
      ),
      match(
        "u11l5b4",
        "Pasangkan klaim dengan kenyataan yang tepat menurut materi.",
        [
          { left: "Grup 'bagi hasil 15% per bulan' ngaku terdaftar OJK", right: "OJK nggak menjamin skema gila seperti itu" },
          { left: "Self-custody", right: "Nggak menghilangkan jejak on-chain" },
          { left: "Iklan 'resmi OJK' di Telegram", right: "Sering palsu dan cuma meminjam nama besar" },
        ],
        "Klaim manis sering cuma meminjam nama OJK, dan self-custody tetap meninggalkan jejak on-chain.",
      ),
      c(
        "u11l5b5",
        "Grup Telegram menawarkan 'investasi kripto terdaftar OJK, bagi hasil 15% per bulan'. Bagaimana sikapmu?",
        [
          "Curiga, karena OJK nggak menjamin skema bagi hasil segila itu",
          "Ikut saja karena sudah ada label terdaftar OJK yang resmi dan terpercaya",
          "Ikut sedikit dulu biar bisa membuktikan sendiri hasilnya nanti",
          "Laporkan grup lain yang nggak punya label OJK resmi di grup itu",
        ],
        "Nama OJK sering dipinjam penipu, dan OJK nggak menjamin skema bagi hasil 15% per bulan.",
      ),
      c(
        "u11l5b6",
        "Kamu jual-beli kripto di CEX lokal. Apa yang otomatis melekat pada transaksimu?",
        [
        "Ada aturan main yang berlaku dan data namamu tercatat",
        "Nggak ada aturan karena semuanya serba anonim",
        "Otomatis bebas pajak karena pakai platform lokal",
        "Otomatis dijamin untung oleh regulator",
        ],
        "Di CEX lokal ada aturan main yang berlaku dan data namamu tercatat, jadi bukan transaksi anonim tanpa aturan.",
      ),
      c(
        "u11l5b7",
        "Seseorang bilang 'kalau aku simpan koin sendiri, berarti aku bebas aturan'. Menurut materi, bagaimana?",
        [
          "Salah, karena self-custody nggak menghilangkan jejak dan nggak otomatis bebas aturan",
          "Benar, karena wallet sendiri nggak tersambung ke platform mana pun jadi bebas aturan",
          "Benar, selama dia nggak pernah pakai platform lokal sama sekali",
          "Benar, karena negara nggak bisa membaca isi blockchain kita",
        ],
        "Self-custody nggak menghilangkan jejak on-chain dan nggak otomatis bikin kamu bebas aturan atau pajak.",
      ),
  ],
  // ------------------------------------------------------------------ u12-l1
  "u12-l1": [
      c(
        "u12l1b1",
        "Sebuah situs menawarkan 'stake BTC 3% per hari'. Apa yang paling mungkin sebenarnya terjadi?",
        [
        "Itu hampir pasti skema, karena imbalan segitu nggak wajar",
        "Itu staking resmi karena BTC punya protokol staking sendiri",
        "Itu cara aman karena BTC selalu naik tiap hari",
        "Itu program bank yang sudah dijamin negara",
        ],
        "Imbalan 3% per hari itu nggak wajar, jadi tawaran seperti itu hampir pasti skema penipuan.",
      ),
      tf(
        "u12l1b2",
        "Situs staking yang meminta seed phrase kamu hampir pasti penipu.",
        true,
        "Staking asli cuma butuh connect wallet dan tanda tangan, jadi permintaan seed phrase adalah tanda penipu.",
      ),
      tf(
        "u12l1b3",
        "Masa penarikan 14 sampai 21 hari di banyak rantai adalah tanda proyek itu scam.",
        false,
        "Masa penarikan 14 sampai 21 hari justru wajar di banyak rantai, yang aneh itu janji instan plus bunga harian besar.",
      ),
      blank(
        "u12l1b4",
        "Saat staking, validator yang curang atau sering offline bisa dikenai hukuman berupa ___.",
        [
          "slashing",
          "bonus besar",
          "hadiah besar",
          "diskon besar",
        ],
        "Slashing adalah hukuman pemotongan aset untuk validator yang curang atau offline parah.",
      ),
      c(
        "u12l1b5",
        "Sebuah protokol menawarkan APY 2000%. Pertanyaan paling penting yang harus kamu ajukan apa?",
        [
        "Imbalan itu dibayar pakai apa dan dari mana asalnya",
        "Berapa lama waktu yang dibutuhkan buat mendaftar",
        "Apakah tampilan situsnya sudah modern dan rapi",
        "Apakah ada banyak orang yang sudah ikut bergabung",
        ],
        "Sumber imbalan adalah pertanyaan kunci, karena APY besar sering dibayar pakai token inflasi atau duit orang baru.",
      ),
      c(
        "u12l1b6",
        "Kamu lihat tawaran 'staking' di situs random yang minta kamu titipkan koin ke mereka. Risiko utamanya apa?",
        [
        "Koinmu cuma dititipkan ke orang, bukan dikunci di protokol",
        "Imbalanmu pasti lebih besar dari staking resmi",
        "Koinmu otomatis dilindungi asuransi pihak ketiga",
        "Waktu penarikannya pasti lebih cepat dari rantai asli",
        ],
        "'Staking' di situs random sering cuma titip ke orang, bukan dikunci di protokol, jadi risikonya jauh lebih besar.",
      ),
      c(
        "u12l1b7",
        "Kenapa imbalan staking yang dibayar pakai token inflasi sering disebut 'dibayar kertas'?",
        [
        "Karena token yang makin banyak justru makin turun nilainya",
        "Karena token itu nggak bisa dipindahkan ke wallet lain",
        "Karena token itu selalu dijual dengan harga tetap",
        "Karena token itu cuma bisa dipakai di jaringan tertentu",
        ],
        "Imbalan dari inflasi token bikin jumlah tokenmu naik tapi nilainya bisa turun, jadi seperti dibayar kertas.",
      ),
  ],
  // ------------------------------------------------------------------ u12-l2
  "u12-l2": [
      c(
        "u12l2b1",
        "Kamu masuk pool likuiditas dan dapat fee plus token reward. Apa risiko khas yang perlu kamu tahu?",
        [
        "Impermanent loss karena harga aset di pool bergeser",
        "Harga token reward pasti selalu naik terus",
        "Fee yang kamu terima selalu lebih besar dari modal",
        "Pool otomatis menjamin kamu untung tiap hari",
        ],
        "Impermanent loss muncul saat harga aset di pool bergeser, bikin kamu bisa kalah dibanding cuma hold.",
      ),
      tf(
        "u12l2b2",
        "Token reward dari yield farming selalu naik harganya, jadi nggak perlu buru-buru dijual.",
        false,
        "Reward token bisa turun sampai nol sebelum kamu jual, jadi anggapan selalu naik itu salah.",
      ),
      tf(
        "u12l2b3",
        "APY di yield farming bisa berubah kapan saja, bahkan ambruk dalam seminggu.",
        true,
        "APY yield farming memang bergerak dinamis dan bisa ambruk cepat, jadi angka di poster bukan jaminan.",
      ),
      match(
        "u12l2b4",
        "Pasangkan istilah farm dengan artinya.",
        [
          { left: "Impermanent loss", right: "Kamu bisa kalah dibanding cuma hold" },
          { left: "Reward token dump", right: "Nilai imbalan bisa nol sebelum kamu jual" },
          { left: "TVL meledak", right: "Sering karena insentif, bukan cinta" },
        ],
        "IL bikin kalah dari hold, reward bisa dump jadi nol, dan TVL meledak biasanya karena insentif.",
      ),
      c(
        "u12l2b5",
        "Ada vault yang janji 'auto compound 40% per hari'. Bagaimana kamu menilainya?",
        [
        "Itu hampir pasti ponzi cantik yang nggak masuk akal",
        "Itu produk deposito aman karena otomatis",
        "Itu cara cepat belajar compounding yang sehat",
        "Itu tanda protokol punya fee transaksi besar",
        ],
        "Janji 40% per hari nggak masuk akal, jadi vault seperti itu sering cuma ponzi yang dibungkus rapi.",
      ),
      c(
        "u12l2b6",
        "Kenapa TVL (total dana terkunci) yang tiba-tiba meledak perlu kamu curigai?",
        [
          "Karena lonjakan itu sering datang dari insentif, bukan minat asli",
          "Karena TVL besar selalu berarti protokolnya paling aman dan terpercaya",
          "Karena TVL cuma bisa naik kalau harganya sedang turun",
          "Karena TVL nggak ada hubungannya dengan imbalan apa pun",
        ],
        "TVL yang meledak biasanya karena insentif sementara, bukan cinta asli, jadi bisa cepat pergi lagi.",
      ),
      c(
        "u12l2b7",
        "Kamu kasih likuiditas di pool dengan APY 800%, TVL meledak seminggu, lalu reward dump. Yang paling mungkin kamu alami apa?",
        [
          "Sisa impermanent loss setelah reward kehilangan nilai",
          "Untung besar karena APY tinggi selalu terbayar tepat waktu",
          "Modalmu otomatis dikembalikan oleh protokol itu sendiri",
          "Fee kamu naik terus meski harga aset jatuh setiap hari",
        ],
        "Pola APY tinggi lalu reward dump biasanya menyisakan impermanent loss, karena fee nyata lebih penting daripada bunga poster.",
      ),
  ],
  // ------------------------------------------------------------------ u12-l3
  "u12-l3": [
      c(
        "u12l3b1",
        "Kamu dapat DM dari akun 'DeFi Rewards' yang janji menggandakan ETH kalau kamu kirim dulu. Apa yang paling mungkin?",
        [
          "Itu penipuan, karena hadiah resmi nggak minta transfer dulu",
          "Itu program resmi karena namanya berhubungan erat dengan DeFi",
          "Itu cara aman karena ada kata rewards di namanya sendiri",
          "Itu promo sah yang cuma berlaku buat pengguna baru saja",
        ],
        "Hadiah resmi nggak pernah minta kamu transfer dulu, jadi akun seperti itu hampir pasti umpan.",
      ),
      tf(
        "u12l3b2",
        "Kamu cuma perlu connect wallet dan tanda tangan di situs giveaway, asalkan nggak mengirim aset.",
        false,
        "Connect wallet plus tanda tangan aneh bisa dipakai mencabut izin asetmu, jadi nggak mengirim aset belum tentu aman.",
      ),
      tf(
        "u12l3b3",
        "'Kirim 1 ETH, dapat 2 ETH dalam 10 menit' adalah penipuan klasik, bukan produk DeFi.",
        true,
        "Skema gandakan saldo selalu minta kamu kirim dulu, dan itu penipuan klasik, bukan produk DeFi.",
      ),
      blank(
        "u12l3b4",
        "Airdrop palsu sering minta kamu kirim ___ ke alamat admin sebelum klaim.",
        [
        "gas",
        "selfie",
        "nama",
        "email",
        ],
        "Airdrop palsu sering minta gas ke alamat admin, padahal itu cara menguras asetmu.",
      ),
      c(
        "u12l3b5",
        "Kamu lihat giveaway minta kirim 0,1 ETH dulu biar bisa dapat hadiah lebih besar. Sikapmu sebaiknya apa?",
        [
        "Tolak dan jangan kirim asetmu ke pihak mana pun",
        "Kirim sedikit saja karena jumlahnya kecil",
        "Kirim lewat wallet baru biar lebih aman",
        "Tanya dulu ke adminnya biar lebih yakin",
        ],
        "Modus meminta fee di awal adalah penipuan, jadi jangan pernah mengirim asetmu ke pihak mana pun.",
      ),
      c(
        "u12l3b6",
        "Kenapa tanda tangan aneh setelah connect wallet bisa berbahaya?",
        [
          "Karena izin itu bisa dipakai mencabut asetmu tanpa kamu sadari",
          "Karena tanda tangan aneh itu otomatis menaikkan saldo wallet kamu",
          "Karena wallet jadi nggak bisa dibuka lagi selamanya olehmu",
          "Karena connect wallet selalu mengirim koin ke admin di grup",
        ],
        "Koneksi wallet plus tanda tangan aneh bisa dipakai mencabut izin, jadi asetmu bisa diambil tanpa kamu sadari.",
      ),
      c(
        "u12l3b7",
        "Mantra paling aman saat menghadapi tawaran 'terlalu indah' di kripto apa?",
        [
        "Kalau terlalu indah, itu hampir pasti umpan",
        "Kalau terlalu indah, cepat masuk sebelum telat",
        "Kalau terlalu indah, berarti kita yang beruntung",
        "Kalau terlalu indah, biasanya buat orang penting",
        ],
        "Pengalaman materi menunjukkan tawaran yang terlalu indah hampir selalu umpan, jadi jangan buru-buru masuk.",
      ),
  ],
  // ------------------------------------------------------------------ u12-l4
  "u12-l4": [
      c(
        "u12l4b1",
        "Kamu mau ikut tawaran bunga tinggi. Cara paling gampang buat menilai sumber imbalannya apa?",
        [
          "Coba jelaskan sumber dananya ke teman warung, kalau nggak bisa berarti jangan masuk",
          "Lihat berapa banyak anggota grup yang sudah ikut masuk duluan sebelum kamu memutuskan ikut",
          "Cek apakah situsnya punya desain paling mewah dan mahal sekali",
          "Hitung saja berapa lama kamu sudah kenal adminnya di grup itu",
        ],
        "Kalau kamu nggak bisa jelaskan sumber imbalannya ke orang awam, itu tanda sebaiknya jangan masuk.",
      ),
      tf(
        "u12l4b2",
        "Ponzi membayar bunga peserta lama memakai uang peserta baru.",
        true,
        "Ponzi memang membayar imbalan dari setoran orang belakang, bukan dari kegiatan ekonomi nyata.",
      ),
      tf(
        "u12l4b3",
        "Token reward dari protokol pasti naik harganya karena dikasih sebagai hadiah.",
        false,
        "Token reward nggak otomatis naik, dan justru bisa turun karena jumlahnya terus bertambah.",
      ),
      match(
        "u12l4b4",
        "Pasangkan sumber imbalan dengan sifatnya.",
        [
          { left: "Fee transaksi", right: "Hasil nyata dari orang yang bayar biaya swap" },
          { left: "Inflasi token", right: "Kamu dibayar token yang makin banyak" },
          { left: "Duit deposan baru", right: "Ciri ponzi yang bayar dari orang belakang" },
        ],
        "Fee itu hasil nyata, inflasi token bikin token makin banyak, dan duit deposan baru adalah ciri ponzi.",
      ),
      c(
        "u12l4b5",
        "Protokol pinjam meminjam membayar pemberi dana dari bunga peminjam. Kenapa ini lebih masuk akal?",
        [
          "Karena imbalannya berasal dari orang yang benar-benar meminjam",
          "Karena semua protokol pinjam meminjam pasti dijamin oleh negara",
          "Karena bunga peminjam selalu nol tiap hari tanpa terkecuali",
          "Karena pemberi dana nggak menanggung risiko apa pun juga",
        ],
        "Imbalan dari bunga peminjam itu berasal dari kegiatan nyata, jadi sumbernya bisa dijelaskan dan ditimbang.",
      ),
      c(
        "u12l4b6",
        "Kamu ditawari 'tanpa peminjam, 5% per hari'. Kenapa tawaran ini mencurigakan?",
        [
          "Karena nggak ada sumber dana jelas di balik imbalannya",
          "Karena 5% per hari itu terlalu kecil buat ukuran pasar kripto",
          "Karena tanpa peminjam selalu berarti bebas risiko apa pun",
          "Karena protokol nggak butuh peserta baru sama sekali lagi",
        ],
        "Tanpa peminjam berarti nggak ada sumber nyata, jadi imbalan 5% per hari itu cuma janji tanpa dasar.",
      ),
      c(
        "u12l4b7",
        "Langkah paling masuk akal sebelum masuk ke tawaran yield adalah apa?",
        [
        "Tulis di kertas dari mana imbalannya berasal",
        "Ikut dulu sedikit biar bisa merasakan hasilnya",
        "Percaya saja ke admin yang ramah di grup",
        "Masuk saat grup sedang paling ramai",
        ],
        "Menuliskan sumber imbalan membantu kamu menimbang apakah tawarannya masuk akal atau cuma janji.",
      ),
  ],
  // ------------------------------------------------------------------ u12-l5
  "u12-l5": [
      c(
        "u12l5b1",
        "Kamu malas jadi validator sendiri tapi mau ikut staking ETH. Cara yang dijelaskan materi apa?",
        [
        "Kasih ke Lido atau Rocket Pool lalu dapat stETH atau rETH",
        "Kirim ETH ke situs yang janji 20% per hari",
        "Titipkan seed phrase ke platform biar diurus otomatis",
        "Belikan ETH lalu simpan di grup Telegram",
        ],
        "Cara yang dijelaskan materi adalah menyerahkan ke Lido atau Rocket Pool dan menerima LST seperti stETH atau rETH.",
      ),
      tf(
        "u12l5b2",
        "Harga LST seperti stETH bisa lepas sedikit dari ETH atau depeg.",
        true,
        "LST bisa diperdagangkan sehingga harganya bisa lepas dari ETH, dan pada 2022 stETH pernah copot dari 1 ETH.",
      ),
      tf(
        "u12l5b3",
        "LST selalu bernilai tepat 1 ETH dan nggak mungkin copot dari harga ETH.",
        false,
        "stETH pernah copot dari 1 ETH saat banyak orang rame cabut, jadi LST memang bisa depeg.",
      ),
      blank(
        "u12l5b4",
        "Liquid staking token seperti stETH sebenarnya adalah kertas ___ atas ETH yang kamu kunci.",
        [
        "klaim",
        "salinan",
        "hadiah",
        "bonus",
        ],
        "LST adalah kertas klaim atas ETH yang dikunci, jadi harganya bisa bergerak mengikuti pasar.",
      ),
      c(
        "u12l5b5",
        "Pada 2022 stETH copot dari 1 ETH. Apa yang sebenarnya terjadi?",
        [
          "Diskon kertas klaim, bukan berarti ETH-nya hilang",
          "Semua ETH di jaringan benar-benar lenyap tanpa sisa apa pun",
          "Validator kena slash sampai ETH-nya habis di jaringan",
          "Lido menutup layanannya secara permanen buat semua orang",
        ],
        "Yang terjadi saat itu adalah depeg atau diskon kertas klaim, bukan ETH-nya yang hilang.",
      ),
      c(
        "u12l5b6",
        "Apa arti slashing buat validator di jaringan proof-of-stake?",
        [
          "ETH milik validator dipotong karena curang atau offline parah",
          "Validator dapat bonus tambahan karena selalu aktif terus setiap hari",
          "Validator otomatis naik pangkat jadi paus jaringan blockchain",
          "Validator bebas dari semua aturan jaringan yang berlaku itu",
        ],
        "Slashing adalah hukuman pemotongan ETH untuk validator yang curang atau sering offline.",
      ),
      c(
        "u12l5b7",
        "Kamu pakai stETH sebagai agunan lalu meminjam di atasnya. Risiko tersembunyi apa yang muncul?",
        [
          "Depeg stETH bisa memicu likuidasi saat pasar panik",
          "Agunan stETH otomatis bertambah tiap hari tanpa kamu sadari",
          "Pinjaman itu otomatis dihapus oleh protokol secara sepihak",
          "ETH kamu langsung ditarik oleh jaringan tanpa penjelasan",
        ],
        "stETH sebagai agunan membawa leverage tersembunyi, dan saat depeg terjadi orang yang meminjam di atasnya bisa kena likuidasi.",
      ),
  ],
  // ------------------------------------------------------------------ u13-l1
  "u13-l1": [
      c(
        "u13l1b1",
        "Grup tiba-tiba teriak 'last candle' dan semua buru-buru beli. Menurut materi, apa yang sedang terjadi?",
        [
        "Script umpan biar kamu panik dan beli telat",
        "Sinyal resmi bahwa harga pasti naik terus",
        "Cara grup melindungi kamu dari kerugian",
        "Bukti koin itu bakal masuk bursa besar",
        ],
        "Frasa 'sekarang atau nggak pernah' adalah script umpan, karena kesempatan lain masih ada.",
      ),
      tf(
        "u13l1b2",
        "Kalau koin sudah naik 10x dan semua orang membicarakannya, itu tanda paling aman buat buru-buru masuk.",
        false,
        "Koin yang sudah melonjak dan ramai dibicarakan justru bikin kamu masuk telat, jadi bukan tanda aman.",
      ),
      tf(
        "u13l1b3",
        "Jeda 10 menit, minum air, dan cek CA adalah cara melawan dorongan FOMO.",
        true,
        "Materi menyarankan jeda 10 menit, minum air, dan cek CA supaya emosi FOMO nggak mengendalikan keputusanmu.",
      ),
      blank(
        "u13l1b4",
        "Saat FOMO menyerang, langkah pertama yang disarankan materi adalah ___ dulu.",
        [
        "jeda",
        "beli",
        "tambah",
        "gas",
        ],
        "Materi mengingatkan untuk jeda dulu sebelum klik, karena keputusan saat panik sering salah.",
      ),
      c(
        "u13l1b5",
        "Kenapa timeline hijau bisa bikin kamu rugi?",
        [
          "Karena dia dirancang bikin kamu masuk telat saat harga sudah melonjak",
          "Karena timeline selalu menampilkan harga asli masa depan yang sudah pasti",
          "Karena warna hijau otomatis menandakan koin berkualitas di pasar",
          "Karena timeline cuma bisa dibuka saat pasar sedang sepi sekali",
        ],
        "Timeline hijau dirancang bikin kamu FOMO dan masuk telat, tepat saat harga sudah tinggi.",
      ),
      c(
        "u13l1b6",
        "Kalimat 'sekarang atau nggak pernah' biasanya dipakai untuk apa?",
        [
        "Menekan kamu supaya beli tanpa mikir panjang",
        "Menandakan kesempatan terakhir yang benar-benar nyata",
        "Memberi kamu waktu tambahan buat riset dulu",
        "Menunjukkan penjual sedang rugi besar",
        ],
        "Kalimat itu dipakai untuk menekan kamu agar buru-buru beli, padahal kesempatan lain selalu ada.",
      ),
      c(
        "u13l1b7",
        "Kamu sudah terlanjur FOMO dan mau beli koin yang lagi ramai. Pengingat penting dari materi apa?",
        [
          "Modal yang hangus nggak bisa balik, jadi jangan klik dulu",
          "Koin yang ramai pasti naik terus kalau kamu beli sekarang juga",
          "FOMO itu tanda kamu sudah paham pasarnya dengan baik",
          "Semakin cepat beli, semakin kecil risikonya buat kamu",
        ],
        "Materi mengingatkan kesempatan lain masih ada, tapi modal yang sudah hangus nggak bisa kembali.",
      ),
  ],
  // ------------------------------------------------------------------ u13-l2
  "u13-l2": [
      c(
        "u13l2b1",
        "Kamu kalah dua kali hari ini dan pengin langsung naikin ukuran biar balik modal. Apa yang materi sarankan?",
        [
        "Stop hari itu, tutup laptop, dan jalan dulu",
        "Naikin ukuran dua kali lipat biar cepat balik",
        "Ganti koin lain yang lagi naik biar cepat untung",
        "Pinjam dana tambahan buat menambah modal",
        ],
        "Aturan materi adalah setelah dua kalah, stop hari itu, karena menebus luka dengan posisi besar cuma menambah rugi.",
      ),
      tf(
        "u13l2b2",
        "Menaikkan ukuran posisi sebaiknya dilakukan saat tenang, bukan saat sedang panas.",
        true,
        "Keputusan ukuran posisi harus diambil saat tenang, karena saat panas emosi yang menaikkan risikonya.",
      ),
      tf(
        "u13l2b3",
        "PnL harian merah adalah undangan buat all-in supaya cepat pulih.",
        false,
        "PnL harian merah justru tanda untuk berhenti, bukan undangan all-in yang memperbesar kerugian.",
      ),
      blank(
        "u13l2b4",
        "Kamu baru rugi lalu langsung buka posisi besar untuk membalas pasar. Istilahnya ___ trade.",
        [
          "revenge",
          "momentum",
          "breakout",
          "scalping",
        ],
        "Revenge trade adalah istilah untuk trading yang dipicu dendam setelah kalah, dan itu cara klasik memperbesar rugi.",
      ),
      c(
        "u13l2b5",
        "Kenapa menaikkan ukuran posisi setelah kalah justru berbahaya?",
        [
        "Karena keputusan diambil saat emosi panas, bukan saat tenang",
        "Karena posisi kecil selalu lebih untung dari posisi besar",
        "Karena pasar selalu bergerak berlawanan tiap hari",
        "Karena ukuran posisi nggak ada hubungannya dengan risiko",
        ],
        "Ukuran yang dinaikkan saat panas bikin kerugian kecil membengkak, karena emosi yang memimpin keputusan.",
      ),
      c(
        "u13l2b6",
        "Trader menulis catatan 'greed, overconfidence, impatience' setelah satu hari merah. Pelajaran utamanya apa?",
        [
        "Kerugian bisa jadi murah kalau diambil sebagai pelajaran",
        "Kerugian itu tanda trader harus berhenti permanen",
        "Catatan emosi nggak berguna buat trading",
        "Hari merah selalu diikuti hari hijau besar",
        ],
        "Catatan itu menunjukkan kerugian masih murah asal jadi pelajaran, dan besok lebih baik jangan diulang.",
      ),
      c(
        "u13l2b7",
        "Habis rugi, cara paling sehat buat menebusnya apa?",
        [
        "Tutup laptop, jalan, dan tulis journal untuk besok",
        "Langsung buka posisi baru dengan ukuran lebih besar",
        "Ganti ke koin paling ramai biar cepat balik",
        "Tambah dana supaya bisa mengejar kerugian",
        ],
        "Materi menyarankan tutup laptop, jalan, dan tulis journal, karena mengejar kerugian dengan posisi besar itu cara klasik rugi makin besar.",
      ),
  ],
  // ------------------------------------------------------------------ u13-l3
  "u13-l3": [
      c(
        "u13l3b1",
        "Kamu habis cuan dari trade yang sebenarnya cuma untung-untungan. Menurut materi, apa yang kurang?",
        [
          "Catatan tentang alasan masuk dan rencana keluarnya",
          "Screenshot PnL hijau yang rapi tersimpan di galeri HP",
          "Bukti transfer keuntungan ke rekening bank pribadi",
          "Nama koin yang lagi ramai di grup Telegram itu",
        ],
        "Hijau tanpa catatan cuma keberuntungan, karena itu kamu perlu mencatat alasan masuk dan rencana keluar.",
      ),
      tf(
        "u13l3b2",
        "Screenshot PnL hijau sudah cukup jadi journal trading.",
        false,
        "Screenshot PnL bukan journal, karena journal butuh catatan ide, risiko, hasil, dan pelajaran.",
      ),
      tf(
        "u13l3b3",
        "Kalau terus rugi, yang perlu diperbaiki adalah kebiasaan yang berulang, bukan sekadar ganti koin.",
        true,
        "Yang berulang itu karakternya, bukan koinnya, jadi perbaiki kebiasaan agar nggak mengulang kesalahan.",
      ),
      match(
        "u13l3b4",
        "Pasangkan isi journal dengan fungsinya.",
        [
          { left: "Alasan masuk", right: "Biar tahu ide di balik posisi itu" },
          { left: "Rencana keluar", right: "Biar ada batas sebelum emosi memutuskan" },
          { left: "Catatan emosi", right: "Biar kelihatan pola yang berulang" },
        ],
        "Journal mencatat ide, rencana keluar, dan emosi supaya pola kesalahan yang berulang bisa terlihat.",
      ),
      c(
        "u13l3b5",
        "Kamu rugi di koin PEPE. Cara menulis journal yang paling berguna apa?",
        [
          "Tulis 'masuk FOMO, tanpa stop, ukuran 20%' lalu perbaiki itu",
          "Tulis 'rugi PEPE' lalu besok cari koin lain yang lebih bagus",
          "Tulis 'pasar lagi jelek' lalu tunggu saja sampai pulih",
          "Tulis 'saya kurang beruntung' lalu lupakan semuanya",
        ],
        "Contoh bagus bukan cuma menulis rugi PEPE, tapi mencatat kebiasaan seperti masuk FOMO, tanpa stop, dan ukuran terlalu besar.",
      ),
      c(
        "u13l3b6",
        "Kalau catatan merahmu selalu berulang, apa artinya menurut materi?",
        [
          "Yang berulang itu karakternya, jadi kebiasaan itulah yang harus dibenerin",
          "Koinnya yang salah, jadi ganti saja semua koin yang sedang kamu pegang sekarang",
          "Pasarnya yang nggak adil buat pemula seperti kamu ya",
          "Journal kamu terlalu detail sampai bikin kamu bingung sendiri",
        ],
        "Pola yang berulang menunjukkan karakter atau kebiasaanmu, karena koin berganti tapi kebiasaan tetap.",
      ),
      c(
        "u13l3b7",
        "Journal trading minimal berisi apa saja?",
        [
        "Ide, risiko, hasil, dan pelajaran",
        "Nama koin dan jumlah pengikut grup",
        "Warna PnL dan waktu screenshot",
        "Nama admin dan link grup",
        ],
        "Journal minimal berisi ide, risiko, hasil, dan pelajaran dalam satu baris, supaya kesalahan bisa dievaluasi.",
      ),
  ],
  // ------------------------------------------------------------------ u13-l4
  "u13-l4": [
      c(
        "u13l4b1",
        "Menurut materi, tujuan utama pemula di pasar kripto itu apa?",
        [
          "Masih ada di meja tahun depan dengan modal utuh",
          "Jadi paus dalam waktu satu minggu saja",
          "Untung seratus persen setiap bulan tanpa pernah gagal",
          "Menang dari semua trader lain setiap hari",
        ],
        "Tujuan utamanya adalah masih di meja tahun depan dengan modal utuh, bukan jadi paus minggu ini.",
      ),
      tf(
        "u13l4b2",
        "Seed phrase tetap harus rahasia dan izin wallet tetap perlu dicek meski kamu sudah lama main.",
        true,
        "Materi menegaskan hidup lebih penting dari FOMO, jadi seed tetap rahasia dan izin tetap dicek.",
      ),
      tf(
        "u13l4b3",
        "web3min adalah dukun yang bisa menjamin keuntungan investasimu.",
        false,
        "web3min cuma peta belajar, bukan dukun, karena semua keputusan dan risiko tetap ada di tanganmu.",
      ),
      match(
        "u13l4b4",
        "Susun dari yang paling penting menurut materi bertahan hidup.",
        [
          { left: "Modal utuh", right: "Supaya kamu masih bisa ikut tahun depan" },
          { left: "Kunci aman", right: "Supaya seed phrase nggak bocor" },
          { left: "Ukuran waras", right: "Supaya satu kerugian nggak menghabiskanmu" },
        ],
        "Bertahan hidup menuntut modal utuh, kunci aman, dan ukuran posisi waras supaya kamu masih di meja tahun depan.",
      ),
      c(
        "u13l4b5",
        "Ada dua kisah PnL: Rp 20 miliar dan minus US$33 juta. Pelajaran dari materi ini apa?",
        [
        "Kamu yang memilih ukuran, jadi atur risikonya sendiri",
        "Semua trader pasti berakhir dengan untung besar",
        "Angka besar selalu berarti strateginya benar",
        "Minus besar cuma mitos yang nggak nyata",
        ],
        "Dua kisah itu menunjukkan kamu yang memilih ukuran, jadi mengatur risiko adalah kunci bertahan.",
      ),
      c(
        "u13l4b6",
        "Kalau kamu lihat tawaran investasi yang kelihatan terlalu indah, sikap bertahan hidup yang tepat apa?",
        [
        "Tolak umpan itu dan jaga modal tetap utuh",
        "Masuk dulu karena indah berarti menguntungkan",
        "Pinjam dana biar bisa ikut lebih besar",
        "Ajak teman supaya risikonya terbagi",
        ],
        "Tawaran yang terlalu indah biasanya umpan, jadi sikap bertahan adalah menolaknya dan menjaga modal.",
      ),
      c(
        "u13l4b7",
        "Siapa yang nyetir keputusan dan risiko di pasar kripto menurut materi?",
        [
        "Kamu sendiri, karena web3min cuma peta",
        "Admin grup yang paling paham pasar",
        "Regulator yang menjamin semua transaksi",
        "Pembuat protokol yang mengatur harganya",
        ],
        "Materi bilang kamu yang nyetir, karena web3min cuma peta dan risiko tetap di tanganmu.",
      ),
  ],
  // ------------------------------------------------------------------ u14-l1
  "u14-l1": [
      c(
        "u14l1b1",
        "Kamu pegang USDT di jaringan Ethereum, lalu buka wallet yang sama di Base dan saldonya nol. Kenapa?",
        [
        "Karena saldo tersimpan per jaringan, jadi aset di Ethereum nggak otomatis muncul di Base",
        "Karena Base menghapus saldo Ethereum saat wallet dibuka di jaringan baru",
        "Karena USDT di Ethereum harus dikonversi ke ETH dulu sebelum terlihat di Base",
        "Karena wallet yang sama nggak bisa dipakai di dua jaringan sekaligus",
        ],
        "Saldo itu terpisah tiap jaringan, jadi alamat yang sama bisa ada di Base dan Arbitrum tapi dananya nggak nyambung sendiri.",
      ),
      tf(
        "u14l1b2",
        "Layer 2 seperti Base dan Arbitrum dibangun di atas Ethereum dan tetap berada di ekosistem Ethereum.",
        true,
        "L2 menampung banyak transaksi lalu menyetor buktinya ke Ethereum, jadi kamu tetap di ekosistem L1 dengan biaya lebih murah.",
      ),
      blank(
        "u14l1b3",
        "Di atas Ethereum, transaksi ditampung Layer 2 lalu disetor ke jaringan utama sebagai ___, sehingga keamanan L1 tetap diwarisi.",
        [
        "rollup",
        "gas",
        "bridge",
        ],
        "L2 mewarisi keamanan L1 lewat mekanisme rollup yang menyetor bukti transaksi ke Ethereum.",
      ),
      c(
        "u14l1b4",
        "Kamu baru transfer di jaringan Base dan mau cek transaksinya. Di mana kamu harus melihat?",
        [
        "Di explorer Base seperti basescan, karena explorer L2 beda dari etherscan",
        "Di etherscan karena semua transaksi L2 selalu muncul di sana",
        "Di wallet aja, explorer nggak bisa membuka transaksi L2",
        "Di explorer Arbitrum karena satu ekosistem Ethereum pakai satu explorer",
        ],
        "Explorer L2 seperti basescan dan arbiscan berbeda dari etherscan, jadi transaksi L2 dicek di explorer jaringannya.",
      ),
      tf(
        "u14l1b5",
        "Gas di Layer 2 selalu lebih mahal daripada di Ethereum karena transaksinya lebih rumit.",
        false,
        "Justru L2 dibuat supaya biaya transaksi jauh lebih terjangkau karena transaksi ditampung dulu lalu disetor ke L1.",
      ),
      c(
        "u14l1b6",
        "Kenapa proyek memilih membangun Layer 2 ketimbang bikin rantai baru yang lepas dari Ethereum?",
        [
        "Karena L2 mewarisi keamanan Ethereum lewat mekanisme rollup",
        "Karena rantai baru nggak boleh pakai alamat 0x di ekosistem Ethereum",
        "Karena L2 nggak butuh validasi sama sekali sehingga lebih aman",
        "Karena Ethereum otomatis menanggung semua biaya gas pengguna L2",
        ],
        "Dengan jadi L2, proyek mendapat keamanan Ethereum lewat rollup tanpa harus membangun keamanan sendiri dari nol.",
      ),
      c(
        "u14l1b7",
        "Kamu mau pindah aset dari Ethereum ke Base. Apa yang sebenarnya terjadi sama asetmu?",
        [
          "Aset harus di-bridge atau dibeli ulang di jaringan Base",
          "Aset langsung muncul di Base karena alamat wallet tetap sama",
          "Aset otomatis terbelah dua, sebagian tetap di Ethereum asli",
          "Aset dikonversi ke dollar dulu oleh Ethereum lalu dikirim",
        ],
        "Saldo tiap jaringan terpisah, jadi aset baru bisa dipakai di Base setelah di-bridge atau dibeli langsung di jaringan itu.",
      ),
  ],
  // ------------------------------------------------------------------ u14-l2
  "u14-l2": [
      c(
        "u14l2b1",
        "Kamu ketemu iklan 'official arb bridge' yang minta kamu approve USDT tanpa batas. Apa yang paling mungkin terjadi?",
        [
        "Itu drainer, karena bridge resmi nggak minta approve tanpa batas lewat iklan",
        "Itu cara normal bridge resmi mempercepat proses pemindahan aset",
        "Itu syarat wajib semua bridge supaya asetmu bisa dikunci di rantai asal",
        "Itu tanda kamu dapat bonus 20% karena sudah pakai jembatan resmi",
        ],
        "Iklan seperti itu sering jadi drainer yang minta approve tanpa batas supaya saldomu bisa ditarik, bukan portal resmi.",
      ),
      tf(
        "u14l2b2",
        "Cara paling aman membuka bridge resmi adalah mengetik URL-nya sendiri atau lewat bookmark, bukan dari iklan.",
        true,
        "Iklan dan DM bisa mengarah ke situs tiruan yang kontraknya dipakai buat menguras saldo, jadi ketik URL sendiri.",
      ),
      match(
        "u14l2b3",
        "Pasangkan istilah bridge dengan penjelasannya.",
        [
          { left: "Bridge", right: "Aset dikunci atau dibakar di rantai asal, lalu dicetak di rantai tujuan" },
          { left: "Situs tiruan", right: "Alamat mirip bridge resmi yang dipakai menguras wallet" },
          { left: "Fake token hasil bridge", right: "Nama sama tapi kontrak beda dan nggak bisa ditarik balik" },
        ],
        "Bridge memindahkan aset dengan mengunci di rantai asal, sementara situs tiruan dan token palsu dipakai buat menguras dana.",
      ),
      c(
        "u14l2b4",
        "Bridge mengaku 'instan, selesai dalam hitungan detik, plus bonus 20%'. Gimana kamu menanggapinya?",
        [
          "Curiga, karena bridge normal bisa makan menit sampai jam",
          "Langsung pakai, karena instan berarti teknologinya paling canggih",
          "Pakai dulu, kalau bonus cair baru ditarik dananya nanti",
          "Abaikan bonusnya, yang penting prosesnya instan dan gratis",
        ],
        "Bridge normal bisa makan menit sampai jam, jadi tawaran instan plus bonus besar itu justru tanda mencurigakan.",
      ),
      tf(
        "u14l2b5",
        "Semua bridge resmi selalu menyelesaikan pemindahan aset dalam hitungan detik tanpa risiko.",
        false,
        "Bridge normal bisa makan menit sampai jam, dan bridge hack itu nyata, jadi risiko lewat jembatan sembarangan tetap ada.",
      ),
      c(
        "u14l2b6",
        "Kenapa token hasil bridge dari situs sembarangan sering nggak bisa ditarik balik?",
        [
        "Karena token itu palsu, namanya sama tapi kontraknya beda dari yang asli",
        "Karena token hasil bridge harus menunggu 7 hari sebelum bisa ditarik",
        "Karena semua token hasil bridge memang terkunci permanen di rantai tujuan",
        "Karena kamu harus transfer gas dulu ke kontrak supaya tokennya terbuka",
        ],
        "Token hasil bridge liar sering memakai nama sama dengan kontrak berbeda, jadi nggak bisa ditarik balik.",
      ),
      c(
        "u14l2b7",
        "DM masuk dari akun bernama 'support bridge resmi' yang minta kamu klik link. Apa langkah paling aman?",
        [
        "Abaikan dan buka bridge resmi lewat bookmark yang kamu simpan sendiri",
        "Klik link-nya asal jangan isi seed phrase, karena support resmi selalu ada",
        "Balas dulu buat tanya detail proyeknya baru klik link-nya",
        "Klik link-nya di browser incognito biar lebih aman dari pelacakan",
        ],
        "Bridge resmi nggak menghubungi lewat DM, jadi lebih aman abaikan dan buka portal dari bookmark sendiri.",
      ),
  ],
  // ------------------------------------------------------------------ u14-l3
  "u14-l3": [
      c(
        "u14l3b1",
        "Kamu tarik USDT dari CEX 'ke Base', padahal CEX itu cuma buka jaringan ERC-20. Transaksinya sukses. Apa yang terjadi?",
        [
        "Saldo di Base tetap kosong karena jaringan yang dipilih nggak didukung CEX",
        "USDT otomatis dikonversi CEX ke jaringan Base saat transaksi sukses",
        "Saldo masuk ke Base tapi butuh 7 hari baru bisa muncul",
        "Dana dikembalikan CEX otomatis setelah hash-nya terkonfirmasi",
        ],
        "Kalau CEX cuma membuka ERC-20, menarik ke Base bikin hash sukses tapi saldo di Base tetap kosong.",
      ),
      tf(
        "u14l3b2",
        "Transaksi yang statusnya sukses di explorer tetap bisa gagal sampai ke tujuan kalau jaringannya salah.",
        true,
        "Explorer cuma bilang tx jalan, tapi kalau penerima nggak mendukung jaringan itu dananya nggak kelihatan dan pemulihannya mahal.",
      ),
      blank(
        "u14l3b3",
        "Kalau mau kirim aset, pilih ___ dulu, baru pilih token, supaya nggak nyasar ke jaringan yang salah.",
        [
          "jaringan",
          "biaya gas",
          "harga token",
        ],
        "Memilih jaringan lebih dulu mencegah aset dikirim ke rantai yang nggak didukung penerima.",
      ),
      c(
        "u14l3b4",
        "Penerima bilang dananya nggak sampai padahal hash transaksimu hijau. Apa yang paling mungkin jadi penyebabnya?",
        [
        "Jaringan yang kamu pakai beda dari jaringan yang didukung penerima",
        "Penerima sengaja berbohong supaya kamu kirim dana dua kali",
        "Wallet penerima sedang offline sehingga transaksinya tertunda",
        "Biaya gasmu terlalu kecil sehingga transaksi batal otomatis",
        ],
        "Hash hijau hanya berarti tx jalan, tapi kalau jaringannya beda dari yang didukung penerima dananya nggak sampai.",
      ),
      tf(
        "u14l3b5",
        "Semua CEX otomatis mendukung setoran dan penarikan ke semua jaringan Layer 2.",
        false,
        "Tiap CEX punya daftar jaringan yang mereka buka, jadi harus dicek dulu sebelum kirim biar nggak nyasar.",
      ),
      c(
        "u14l3b6",
        "Sebelum kirim jumlah besar ke jaringan baru, langkah pencegahan paling waras apa?",
        [
        "Tes dulu jumlah kecil, kalau masuk baru kirim sisanya",
        "Kirim semuanya sekaligus biar cuma sekali bayar gas",
        "Tunggu jam sibuk lewat biar biaya gasnya lebih murah",
        "Minta penerima ganti alamat yang lebih pendek dulu",
        ],
        "Tes jumlah kecil dulu memastikan jaringannya benar sebelum dana besar ikut berisiko nyasar.",
      ),
      c(
        "u14l3b7",
        "Kamu kirim USDT ERC-20 ke alamat yang cuma siap menerima BEP-20. Kenapa ini berbahaya?",
        [
          "Karena token beda jaringan nggak nyambung dan pemulihannya bisa mahal",
          "Karena jaringan BEP-20 nggak bisa menerima token apa pun kecuali ETH asli",
          "Karena alamat penerima otomatis diblokir permanen oleh jaringan",
          "Karena transaksinya pasti gagal dan gasmu hangus tanpa jejak",
        ],
        "Token di jaringan berbeda nggak saling nyambung, jadi dana bisa nyangkut dan pemulihannya mahal bahkan mustahil.",
      ),
  ],
  // ------------------------------------------------------------------ u14-l4
  "u14-l4": [
      c(
        "u14l4b1",
        "Kamu mau klaim airdrop di Base tapi wallet cuma berisi token airdrop itu. Kenapa klik claim-nya gagal?",
        [
        "Karena buat bayar gas di Base kamu butuh ETH yang ada di jaringan Base",
        "Karena airdrop nggak bisa diklaim pakai wallet yang baru dibuat",
        "Karena token airdrop harus dijual dulu sebelum bisa diklaim",
        "Karena Base nggak menerima klaim kalau saldo wallet di bawah 1 ETH",
        ],
        "Gas fee di Base dibayar pakai ETH di jaringan itu, jadi punya token tanpa gas bikin klaim gagal.",
      ),
      tf(
        "u14l4b2",
        "Punya token di jaringan Base tapi nggak punya ETH di jaringan itu bikin transaksimu macet.",
        true,
        "Gas fee di tiap L2 dibayar pakai ETH native jaringan itu, jadi token tanpa gas nggak bisa dipindah.",
      ),
      blank(
        "u14l4b3",
        "Buat bayar biaya transaksi di jaringan disebut gas, dan di Base gasnya dibayar pakai ___.",
        [
        "ETH",
        "USDT",
        "BTC",
        ],
        "Gas native di Base dibayar pakai ETH yang berada langsung di jaringan Base.",
      ),
      c(
        "u14l4b4",
        "Kenapa gas di Layer 2 bisa ikut naik walau biasanya jauh lebih murah dari L1?",
        [
          "Karena saat jaringan ramai, gas di L2 juga ikut naik walau tak sebrutal L1",
          "Karena jaringan L2 sengaja menaikkan gas tiap kali ada pengguna baru daftar",
          "Karena L2 memakai harga gas yang sama persis dengan Ethereum",
          "Karena gas L2 ditentukan nilai token airdrop yang sedang naik",
        ],
        "Gas spike di L2 jarang sebrutal L1, tapi tetap bisa naik saat jaringannya sedang ramai.",
      ),
      tf(
        "u14l4b5",
        "Spam klik transaksi yang gagal itu aman karena transaksi gagal nggak makan biaya.",
        false,
        "Tiap klik bisa makan biaya gas, jadi spam transaksi gagal malah bikin saldo terkuras.",
      ),
      c(
        "u14l4b6",
        "Wallet-mu cuma punya token di jaringan Base dan kamu butuh mengirim. Apa langkah pertamamu?",
        [
        "Isi dulu ETH secukupnya di jaringan Base buat bayar gas",
        "Tukar token itu ke BTC biar biaya kirimnya nol",
        "Pindah ke jaringan Ethereum biar gasnya otomatis gratis",
        "Hubungi support Base biar gas transaksimu dibebaskan",
        ],
        "Karena gas native dulu, kamu perlu isi ETH di jaringan Base supaya transaksi bisa jalan.",
      ),
      c(
        "u14l4b7",
        "Kamu sering gagal transaksi karena gas di L2 naik mendadak. Apa kebiasaan yang paling waras?",
        [
          "Pastikan saldo gas native cukup sebelum transaksi dikirim",
          "Terus klik ulang secepat mungkin sampai transaksinya berhasil",
          "Pindahkan semua aset ke wallet baru tiap kali gas naik",
          "Tunggu sampai gas L2 benar-benar nol baru transaksi",
        ],
        "Menyiapkan saldo gas native lebih dulu dan berhenti spam tx gagal mencegah saldo terkuras sia-sia.",
      ),
  ],
  // ------------------------------------------------------------------ u14-l5
  "u14-l5": [
      c(
        "u14l5b1",
        "Kamu tarik aset native dari Arbitrum ke Ethereum dan harus nunggu hampir seminggu. Kenapa?",
        [
          "Karena itu desain optimistic rollup, ada jendela tantangan sekitar 7 hari",
          "Karena jaringannya sedang rusak dan sengaja menahan semua penarikan asetmu",
          "Karena kamu belum bayar biaya percepatan ke tim Arbitrum",
          "Karena saldomu kurang dari batas minimum penarikan",
        ],
        "Optimistic rollup memberi jendela tantangan sekitar 7 hari sebelum penarikan final ke L1, jadi itu desain bukan bug.",
      ),
      tf(
        "u14l5b2",
        "Tarik aset native dari optimistic rollup ke Ethereum memang butuh waktu, dan itu desain, bukan bug.",
        true,
        "Optimistic rollup kasih jendela tantangan sekitar 7 hari buat memastikan transaksinya valid sebelum final di L1.",
      ),
      match(
        "u14l5b3",
        "Setiap jembatan memverifikasi dengan cara berbeda. Pasangkan yang sesuai.",
        [
          { left: "Optimistic rollup", right: "Anggap transaksi benar dan beri jendela tantangan sekitar 7 hari" },
          { left: "ZK rollup", right: "Kirim bukti matematik supaya penarikan bisa lebih cepat" },
          { left: "Fast bridge pihak ketiga", right: "Lebih cepat tapi kamu menukar kecepatan dengan risiko protokolnya" },
        ],
        "Optimistic mengandalkan jendela tantangan, ZK memakai bukti matematik, dan fast bridge pihak ketiga menukar kecepatan dengan risiko.",
      ),
      c(
        "u14l5b4",
        "Temanmu pakai fast bridge pihak ketiga dan asetnya sampai lebih cepat dari kamu yang pakai bridge native. Apa trade-off-nya?",
        [
          "Dia dapat kecepatan, tapi menanggung risiko protokol pihak ketiga",
          "Dia dapat kecepatan gratis tanpa risiko tambahan apa pun",
          "Dia sebenarnya nggak dapat aset apa-apa sampai 7 hari",
          "Dia membayar biaya ke Ethereum langsung buat mempercepat transaksinya",
        ],
        "Fast bridge pihak ketiga memang lebih cepat, tapi risikonya berpindah ke protokol jembatan itu, bukan hilang.",
      ),
      tf(
        "u14l5b5",
        "Semua L2 selalu menarik aset ke Ethereum dalam 3 detik tanpa risiko tambahan.",
        false,
        "Optimistic rollup bisa butuh sekitar 7 hari, dan pilihan bridge instan biasanya menambah risiko pihak ketiga.",
      ),
      c(
        "u14l5b6",
        "Sequencer sebuah L2 tiba-tiba down. Apa yang biasanya terjadi sama asetmu?",
        [
        "Dana biasanya tetap bisa keluar ke L1, tapi nggak instan",
        "Semua dana di L2 itu langsung hilang permanen",
        "Asetmu otomatis dikonversi ke ETH di Ethereum saat itu juga",
        "Saldomu dibekukan selamanya sampai sequencer pulih",
        ],
        "Saat sequencer down, dana biasanya masih bisa keluar ke L1, hanya saja prosesnya nggak instan.",
      ),
      c(
        "u14l5b7",
        "Kenapa kamu nggak boleh asal menyalin alamat dan cara transaksi dari Starknet ke Base?",
        [
          "Karena Starknet beda dari L2 EVM, alamat dan caranya belum tentu sama",
          "Karena Starknet nggak punya wallet sama sekali buat pengguna",
          "Karena Base menolak semua transaksi yang asalnya dari jaringan ZK rollup",
          "Karena alamat 0x cuma valid di jaringan Ethereum asli saja",
        ],
        "Base, Arb, dan OP itu EVM dengan alamat 0x, sementara Starknet beda vibe sehingga caranya nggak bisa disalin buta.",
      ),
  ],
  // ------------------------------------------------------------------ u15-l1
  "u15-l1": [
      c(
        "u15l1b1",
        "Situs klaim airdrop minta kamu transfer saldo dulu buat 'gas insurance'. Apa artinya?",
        [
          "Itu umpan drainer, airdrop resmi nggak minta transfer dulu",
          "Itu prosedur normal buat menutup biaya proses klaim massal",
          "Itu jaminan supaya token airdropmu nggak hangus saat TGE",
          "Itu syarat verifikasi wajib sebelum token bisa dicairkan",
        ],
        "Airdrop resmi nggak pernah minta transfer lebih dulu, jadi permintaan deposit seperti itu tanda drainer.",
      ),
      tf(
        "u15l1b2",
        "Airdrop resmi cukup pakai alamat wallet dan tanda tangan pesan, bukan transfer dana dulu.",
        true,
        "Snapshot cuma mencatat aktivitas atau saldo di waktu tertentu, jadi nggak ada alasan minta kamu transfer lebih dulu.",
      ),
      blank(
        "u15l1b3",
        "Waktu proyek mengambil foto siapa yang memakai atau memegang aset di blok tertentu disebut ___.",
        [
        "snapshot",
        "claim",
        "airdrop",
        ],
        "Snapshot adalah saat proyek merekam siapa yang memakai atau memegang aset sebelum token dibagi saat TGE.",
      ),
      c(
        "u15l1b4",
        "Token airdropmu cair di hari pertama TGE, dan harganya langsung jatuh. Apa pelajaran yang waras?",
        [
          "Token airdrop bisa dump hari pertama, jangan dianggap gaji tetap",
          "Harga jatuh itu tanda tokennya palsu dan sama sekali nggak berguna",
          "Kamu harus beli lagi saat turun biar untung besar",
          "Cairnya salah dan seharusnya kamu komplain ke proyek",
        ],
        "Token airdrop bisa dump di hari pertama, jadi hadiahnya nggak bisa dianggap penghasilan tetap.",
      ),
      tf(
        "u15l1b5",
        "Situs airdrop yang minta deposit buat 'verifikasi' itu bagian dari prosedur resmi proyek.",
        false,
        "Airdrop resmi nggak pernah minta transfer atau deposit dulu, jadi permintaan seperti itu tanda drainer.",
      ),
      c(
        "u15l1b6",
        "Kenapa proyek menganggap sybil sebagai masalah serius saat bagi-bagi airdrop?",
        [
          "Karena satu orang bisa bikin banyak wallet palsu buat jatah ganda",
          "Karena banyak wallet palsu bikin jaringan Ethereum jadi makin lambat",
          "Karena sybil menaikkan harga token sebelum TGE",
          "Karena wallet asli nggak bisa klaim kalau ada sybil",
        ],
        "Satu orang bisa mengendalikan banyak wallet palsu, sehingga jatah airdrop bisa digandakan dan peserta asli dirugikan.",
      ),
      c(
        "u15l1b7",
        "Kamu dapat info airdrop dari akun random di media sosial. Langkah paling aman?",
        [
          "Cek dulu ke situs resmi yang kamu buka lewat bookmark sendiri",
          "Ikuti link-nya karena biasanya akun random lebih cepat update",
          "Screenshot dulu halamannya biar ada bukti kalau kena tipu",
          "Kirim alamat walletmu ke akun itu biar dicek kelayakannya",
        ],
        "Link dari akun random bisa mengarah ke situs palsu, jadi lebih aman cek ke situs resmi lewat bookmark sendiri.",
      ),
  ],
  // ------------------------------------------------------------------ u15-l2
  "u15-l2": [
      c(
        "u15l2b1",
        "Kamu bikin 20 wallet, semuanya swap jumlah sama di menit yang sama. Apa yang paling mungkin terjadi?",
        [
        "Pola identik gampang kedetect, jadi bisa kena diskualifikasi massal",
        "Semua wallet itu otomatis dapat airdrop berkali-kali lipat",
        "Proyek nggak bisa melihat polanya karena tiap wallet alamatnya beda",
        "Wallet itu aman karena jumlahnya masih di bawah 200",
        ],
        "Akun yang polanya identik gampang kedetect, jadi pola seragam seperti itu sering berujung diskualifikasi massal.",
      ),
      tf(
        "u15l2b2",
        "Pakai produk beneran kayak swap kecil atau bridge lebih berpeluang masuk kriteria daripada bikin banyak wallet palsu.",
        true,
        "Kriteria airdrop biasanya menilai pemakaian nyata, sementara pola wallet yang identik justru gampang difilter tim.",
      ),
      blank(
        "u15l2b3",
        "Banyak akun palsu milik satu orang yang dibuat buat menggandakan jatah disebut ___.",
        [
        "sybil",
        "farming",
        "bridge",
        ],
        "Sybil adalah banyak akun palsu milik satu orang yang dibuat buat menggandakan jatah airdrop.",
      ),
      c(
        "u15l2b4",
        "Ada jasa berbayar yang menjamin kamu lolos airdrop asal pakai akun mereka. Gimana?",
        [
          "Jangan, karena sering penipuan dan bisa masuk daftar hitam",
          "Pakai saja, karena jasa itu tahu kriteria resmi tiap proyek",
          "Pakai kalau murah, toh risikonya cuma di akun mereka",
          "Pakai dulu, kalau gagal baru minta uang kembali",
        ],
        "Jasa joki sybil sering penipuan dan justru membuat wallet-mu masuk daftar hitam proyek.",
      ),
      tf(
        "u15l2b5",
        "Biaya farm yang kamu keluarkan pasti selalu lebih kecil dari hadiah airdrop yang diterima.",
        false,
        "Gas, waktu, dan modal tes bisa lebih besar dari hadiah, jadi farm bukan jaminan untung.",
      ),
      c(
        "u15l2b6",
        "Kenapa tim proyek bisa menebak kalau kamu bikin banyak wallet dari satu HP?",
        [
          "Karena pola transaksinya sama dan jarak waktunya berdekatan",
          "Karena alamat wallet selalu memuat nomor HP pendaftar",
          "Karena satu HP cuma boleh memasang satu akun wallet di sistemnya",
          "Karena proyek punya akses ke data pribadi semua pengguna",
        ],
        "Pola transaksi yang sama dengan jeda berdekatan gampang terdeteksi sebagai akun yang dikendalikan satu orang.",
      ),
      c(
        "u15l2b7",
        "Kamu hitung biaya gas farm sudah lebih besar dari perkiraan hadiahnya. Apa yang sebaiknya kamu lakukan?",
        [
        "Berhenti, karena kerja tapi rugi nggak masuk akal",
        "Lanjut saja biar poinmu nggak hangus",
        "Tambah modal biar peluang hadiahnya makin besar",
        "Minjam uang dulu buat menutup biaya gasnya",
        ],
        "Kalau biaya yang keluar sudah melebihi harapan hadiah, melanjutkan farm cuma bikin kamu rugi.",
      ),
  ],
  // ------------------------------------------------------------------ u15-l3
  "u15-l3": [
      c(
        "u15l3b1",
        "Halaman klaim minta kamu tanda tangan 'permit' atau 'increaseAllowance' sebelum token cair. Gimana?",
        [
          "Curiga dan jangan tanda tangan, izin seperti itu bisa menyedot saldo",
          "Tanda tangan saja, itu tanda kamu setuju menerima token",
          "Tanda tangan asal nominalnya nol saja biar aman dari penarikan dana kamu",
          "Tanda tangan dulu, kalau token nggak cair baru revoke",
        ],
        "Permintaan permit atau increaseAllowance memberi izin saldomu ditarik pihak lain, jadi itu tanda phishing klaim.",
      ),
      tf(
        "u15l3b2",
        "Setelah mencoba klaim di situs baru, kamu sebaiknya cek dan cabut izin yang mencurigakan.",
        true,
        "Izin seperti permit atau increaseAllowance bisa dipakai menarik saldomu, jadi lebih aman dicek dan direvoke.",
      ),
      match(
        "u15l3b3",
        "Pasangkan tanda tangan dengan risikonya.",
        [
          { left: "Pesan 'I am claiming' tanpa transfer", right: "Biasanya oke karena cuma menandatangani pernyataan klaim" },
          { left: "Permit atau increaseAllowance", right: "Curiga, karena memberi izin saldo bisa ditarik pihak lain" },
          { left: "setApprovalForAll untuk NFT", right: "Bahaya, karena bisa memberi kendali atas seluruh koleksi NFT-mu" },
        ],
        "Tanda tangan yang cuma pernyataan klaim biasanya oke, tapi permit dan setApprovalForAll memberi izin yang bisa menguras aset.",
      ),
      c(
        "u15l3b4",
        "Domain situs klaim beda satu huruf dari domain resmi. Apa yang harus kamu lakukan?",
        [
        "Tutup situsnya, karena domain beda huruf itu ciri phishing klaim",
        "Lanjut klaim, karena biasanya cuma domain cadangan proyek",
        "Klaim dulu jumlah kecil buat tes, baru klaim sisanya",
        "Isi seed phrase biar situsnya bisa memverifikasi kepemilikan",
        ],
        "Phishing klaim sering memakai domain yang beda satu huruf dari situs resmi, jadi situs seperti itu harus ditutup.",
      ),
      tf(
        "u15l3b5",
        "Semua tanda tangan yang diminta halaman klaim aman, karena klaim nggak pernah bisa menguras saldo.",
        false,
        "Tanda tangan permit atau setApprovalForAll bisa memberi izin yang dipakai menguras saldo, jadi harus dibaca dulu.",
      ),
      c(
        "u15l3b6",
        "Link 'resmi' muncul sebagai iklan di paling atas hasil pencarian. Kenapa berbahaya?",
        [
          "Karena iklan di atas hasil resmi sering dipakai buat phishing",
          "Karena iklan selalu lebih lambat dibuka daripada hasil organik",
          "Karena iklan nggak bisa menampilkan logo proyek asli",
          "Karena situs resmi dilarang beriklan di mesin pencari",
        ],
        "Google ads di atas hasil resmi adalah umpan klasik untuk mengarahkan korban ke halaman klaim palsu.",
      ),
      c(
        "u15l3b7",
        "Apa yang wajib kamu baca sebelum menekan tombol tanda tangan di halaman klaim?",
        [
          "Isi pesan yang ditandatangani, pastikan cuma pernyataan klaim",
          "Jumlah follower akun yang membagikan link klaim airdrop resmi",
          "Warna tombol dan logo proyek di halaman itu",
          "Kecepatan situs memuat halaman klaimnya",
        ],
        "Kamu harus membaca isi tanda tangannya, karena izin saldo tersembunyi di situ dan bukan di tampilan halaman.",
      ),
  ],
  // ------------------------------------------------------------------ u15-l4
  "u15-l4": [
      c(
        "u15l4b1",
        "Kamu habis Rp 2 juta buat gas, airdrop yang cair cuma Rp 400 ribu. Apa kesimpulannya?",
        [
          "Itu kerja tapi rugi, biaya keluar lebih besar dari hadiahnya",
          "Itu untung, karena tetap dapat token tanpa modal awal apa pun",
          "Itu tanda proyeknya bangkrut dan harus dituntut",
          "Itu normal, karena semua farm pasti balik modal nanti",
        ],
        "Kalau gas yang keluar Rp 2 juta tapi airdrop cuma Rp 400 ribu, farm itu jelas rugi meski kelihatan produktif.",
      ),
      tf(
        "u15l4b2",
        "Sebelum ikut musim farm, kamu sebaiknya menghitung dulu biaya gas dan waktu yang bakal keluar.",
        true,
        "Hasil airdrop belum pasti, jadi biaya yang keluar bisa lebih besar dari hadiah yang akhirnya diterima.",
      ),
      blank(
        "u15l4b3",
        "Poin di papan peringkat itu cuma ukuran aktivitas, bukan ___ bahwa kamu bakal dibayar.",
        [
          "jaminan pasti",
          "gaji tetap",
          "hadiah bulanan",
        ],
        "Poin cuma ukuran aktivitas, bukan jaminan bahwa poin itu bakal dicairkan jadi uang.",
      ),
      c(
        "u15l4b4",
        "Kamu ditawari beli poin airdrop di pasar tidak resmi biar peringkatmu naik. Gimana?",
        [
          "Tolak, karena poin pasar tidak resmi nggak dijamin cair",
          "Beli saja, karena poin resmi memang diperjualbelikan bebas",
          "Beli sedikit dulu buat tes apakah bisa dicairkan",
          "Beli lewat orang dalam proyek biar lebih aman",
        ],
        "Poin bukan jaminan bisa dicairkan, apalagi kalau dibeli di pasar tidak resmi yang nggak diakui proyek.",
      ),
      tf(
        "u15l4b5",
        "Demi mengejar poin airdrop, menyimpan seed phrase di VPS murah itu pilihan yang aman.",
        false,
        "Menyimpan seed di tempat abal membahayakan keamanan wallet, dan poin bukan jaminan hasil.",
      ),
      c(
        "u15l4b6",
        "Kenapa berutang buat ikut farm airdrop itu keputusan yang berbahaya?",
        [
          "Karena hasilnya belum pasti, utangmu bisa tetap jalan",
          "Karena proyek melarang peserta yang punya utang bank",
          "Karena utang otomatis membatalkan semua poinmu",
          "Karena bunga utang selalu lebih kecil dari hadiah airdrop",
        ],
        "Hasil farm belum pasti, jadi utang tetap harus dibayar walau airdrop yang diharapkan nggak pernah cair.",
      ),
      c(
        "u15l4b7",
        "Kapan waktu paling waras buat berhenti dari musim farm?",
        [
          "Saat biaya yang keluar sudah melebihi harapan hadiah",
          "Saat papan peringkatmu turun satu posisi dari puncak",
          "Saat temanmu dapat airdrop lebih besar dari kamu",
          "Saat proyek mengumumkan tanggal TGE tokennya",
        ],
        "Kalau biaya sudah melebihi harapan hadiah yang waras, lanjut farm cuma menambah kerugian.",
      ),
  ],
  // ------------------------------------------------------------------ u16-l1
  "u16-l1": [
      c(
        "u16l1b1",
        "Kenapa nama token yang mengandung 'USD' nggak otomatis bikin harganya selalu $1?",
        [
          "Karena nilainya bergantung cadangan dan mekanisme penerbit",
          "Karena pasar bebas selalu menaikkan harga token USD di atas $1",
          "Karena semua token USD dilarang dipatok ke dollar asli",
          "Karena penerbit wajib mengubah nama token tiap tahun",
        ],
        "Nama USD di token nggak menjamin $1, karena nilainya tergantung cadangan dan mekanisme penerbitnya.",
      ),
      tf(
        "u16l1b2",
        "Stablecoin terpusat seperti USDT dan USDC didukung oleh cadangan aset riil.",
        true,
        "Model terpusat mengandalkan cadangan nyata, sementara model terdesentralisasi seperti DAI pakai jaminan smart contract.",
      ),
      match(
        "u16l1b3",
        "Pasangkan jenis stablecoin dengan jaminannya.",
        [
          { left: "Stablecoin terpusat (USDT, USDC)", right: "Didukung cadangan aset riil milik penerbit" },
          { left: "Stablecoin terdesentralisasi (DAI)", right: "Pakai jaminan lewat smart contract" },
          { left: "UST 2022", right: "Harganya jatuh dari $1 nyaris ke nol" },
        ],
        "USDT dan USDC dijamin cadangan riil, DAI pakai smart contract, dan UST 2022 jadi contoh depeg yang hampir menyentuh nol.",
      ),
      c(
        "u16l1b4",
        "Apa yang bisa dilakukan penerbit USDT atau USDC terhadap alamat tertentu?",
        [
        "Membekukan alamat itu sebagai fitur kepatuhan, bukan bug",
        "Menghapus token dari semua wallet tanpa meninggalkan jejak",
        "Mengubah alamat wallet pengguna jadi alamat baru otomatis",
        "Menarik token dari wallet mana pun tanpa alasan apa pun",
        ],
        "USDT dan USDC punya fungsi blacklist, jadi penerbit bisa membekukan alamat tertentu sebagai bagian kepatuhan hukum.",
      ),
      tf(
        "u16l1b5",
        "Karena namanya stablecoin, harga token itu mustahil lepas dari $1.",
        false,
        "Depeg bisa terjadi, harga bisa lepas dari $1 sebentar atau sampai tokennya mati seperti UST 2022.",
      ),
      c(
        "u16l1b6",
        "Apa perbedaan dasar antara USDT dan DAI dari sisi modelnya?",
        [
          "USDT terpusat dengan cadangan riil, DAI terdesentralisasi lewat smart contract",
          "USDT terdesentralisasi penuh dan tanpa penerbit, DAI dijamin oleh bank sentral",
          "Kedua stablecoin ini identik, cuma beda nama penerbitnya saja",
          "USDT nggak punya penerbit, DAI diterbitkan satu bank",
        ],
        "USDT dan USDC terpusat dengan cadangan riil, sementara DAI terdesentralisasi dengan jaminan smart contract.",
      ),
      c(
        "u16l1b7",
        "UST 2022 pernah turun dari $1 nyaris ke nol. Pelajaran utamanya apa?",
        [
          "Stabil itu janji, dan janji bisa pecah, jangan anggap seperti deposito",
          "UST gagal total karena tidak pernah dipakai siapa pun",
          "UST jatuh karena penerbitnya sengaja menaikkan harga tokennya terlalu cepat",
          "UST sebenarnya masih $1, cuma salah tampil di wallet",
        ],
        "Stabil itu janji yang bisa pecah, jadi stablecoin nggak bisa diperlakukan seperti deposito yang aman.",
      ),
  ],
  // ------------------------------------------------------------------ u16-l2
  "u16-l2": [
      c(
        "u16l2b1",
        "Ada stablecoin menawarkan 20% APY tanpa sumber jelas. Apa yang paling waras kamu lakukan?",
        [
          "Hindari, karena bunga gila di stablecoin biasanya yang pertama pecah",
          "Masuk dengan dana besar selagi bunganya masih tinggi dan belum turun",
          "Masuk sebentar, tarik saat bunga turun sedikit",
          "Masuk pakai uang darurat biar cepat terkumpul",
        ],
        "Bunga gila di stablecoin sering jadi umpan, dan yang menawarkan APY tidak wajar biasanya yang pertama pecah.",
      ),
      tf(
        "u16l2b2",
        "Saat pasar panik, stablecoin bisa turun jauh di bawah $1 dan itu disebut depeg.",
        true,
        "Depeg bisa sementara atau permanen, dan stable dengan bunga tidak wajar biasanya paling dulu pecah.",
      ),
      blank(
        "u16l2b3",
        "Harga stablecoin yang lepas dari patokan $1 disebut ___.",
        [
        "depeg",
        "dump",
        "spread",
        ],
        "Depeg adalah saat harga stablecoin lepas dari patokan $1, bisa sebentar atau sampai tokennya mati.",
      ),
      c(
        "u16l2b4",
        "Pasar sedang kacau dan kamu mau keluar dari satu stablecoin. Apa yang sering terjadi?",
        [
          "Likuiditas bisa hilang justru saat dibutuhkan, susah keluar dengan harga wajar",
          "Likuiditas otomatis bertambah karena banyak orang ikut keluar",
          "Harga selalu pasti balik ke $1 dalam hitungan menit saja apapun kondisi pasarnya",
          "Spread di semua bursa pasti sama rata saat pasar panik",
        ],
        "Saat kacau, likuiditas sering hilang justru ketika paling dibutuhkan, sehingga keluar dengan harga wajar jadi sulit.",
      ),
      tf(
        "u16l2b5",
        "Saat pasar kacau, harga stablecoin di CEX dan DEX selalu identik persis.",
        false,
        "Spread di CEX dan DEX bisa berbeda saat kacau, jadi harga di satu tempat belum tentu sama dengan tempat lain.",
      ),
      c(
        "u16l2b6",
        "Langkah darurat paling waras kalau satu stablecoin mulai goyah?",
        [
        "Sebar ke beberapa stablecoin lain atau tarik sebagian ke fiat resmi",
        "Pindahkan semuanya ke stablecoin yang bunganya paling tinggi",
        "Tunggu saja sampai harganya balik ke $1 tanpa ngapa-ngapain",
        "Belanja semua stablecoin itu jadi kripto lain secepatnya",
        ],
        "Diversifikasi darurat dengan menyebar ke beberapa stablecoin atau menarik sebagian ke fiat resmi mengurangi risiko satu ticker.",
      ),
      c(
        "u16l2b7",
        "Kenapa all-in satu ticker stablecoin itu berisiko?",
        [
          "Karena kalau ticker itu depeg, seluruh danamu ikut kena",
          "Karena satu ticker nggak bisa disimpan di banyak wallet sekaligus",
          "Karena semua stablecoin dilarang disimpan lebih sebulan",
          "Karena ticker tunggal selalu punya bunga paling rendah",
        ],
        "Kalau cuma pegang satu ticker, depeg di ticker itu langsung menimpa seluruh danamu tanpa penyebaran risiko.",
      ),
  ],
  // ------------------------------------------------------------------ u16-l3
  "u16-l3": [
      c(
        "u16l3b1",
        "Uang buat bayar sewa bulan ini, paling aman ditaruh di mana?",
        [
          "Sebagian di-off-ramp ke rekening, karena stablecoin tetap berisiko",
          "Semua dana di satu USDT di satu CEX biar gampang dipantau tiap hari",
          "Semua di stablecoin yang kasih yield paling tinggi",
          "Semua di wallet baru yang belum pernah dipakai",
        ],
        "Uang hidup lebih aman kalau sebagian di-off-ramp ke rekening, karena stablecoin tetap punya risiko penerbit dan depeg.",
      ),
      tf(
        "u16l3b2",
        "Stablecoin tetap punya risiko penerbit, kontrak, exchange, dan depeg walau harganya dipatok ke dollar.",
        true,
        "Karena masih kripto, jadi buat uang hidup lebih aman sebagian di-off-ramp ke rekening.",
      ),
      match(
        "u16l3b3",
        "Pasangkan situasi parkir dana dengan saran yang waras.",
        [
          { left: "Uang sewa bulan ini", right: "Off-ramp sebagian ke rekening, jangan semua on-chain" },
          { left: "Gaji setahun", right: "Jangan disimpan di satu USDT di satu CEX" },
          { left: "Imbal hasil wajar stablecoin", right: "Sekitar 2 sampai 8 persen per tahun, bukan patokan pasti" },
        ],
        "Dana hidup sebaiknya sebagian di-off-ramp, jangan menumpuk di satu tempat, dan yield wajar itu sekitar 2 sampai 8 persen.",
      ),
      c(
        "u16l3b4",
        "Sebuah resto memarkir omset seminggu di USDT pada satu CEX, lalu CEX-nya ditahan. Apa pelajarannya?",
        [
          "Jangan taruh dana operasional di satu keranjang, bisa macet",
          "Resto harus pakai stablecoin yang bunganya jauh lebih tinggi",
          "CEX yang ditahan itu tanda USDT-nya jadi nggak berharga",
          "Omset seharusnya disimpan di wallet tanpa dicatat",
        ],
        "Kalau omset ditahan di satu CEX, operasional bisa macet, jadi dana hidup jangan ditaruh di satu keranjang.",
      ),
      tf(
        "u16l3b5",
        "Imbal hasil stablecoin yang wajar dijamin selalu 20% per tahun ke atas.",
        false,
        "Imbal hasil wajar yang pernah terjadi sekitar 2 sampai 8 persen per tahun, dan itu bukan patokan pasti.",
      ),
      c(
        "u16l3b6",
        "USDC dan USDT bisa berbeda likuiditas di L2 tertentu. Kenapa itu penting?",
        [
          "Karena saat butuh keluar cepat, stablecoin likuiditas tipis susah ditukar",
          "Karena stablecoin yang likuiditasnya tipis di L2 itu pasti palsu dan berbahaya",
          "Karena jaringan L2 selalu menolak USDT tapi selalu menerima USDC",
          "Karena likuiditas menentukan warna logo stablecoin di wallet",
        ],
        "USDC dan USDT bisa beda likuiditas di L2 tertentu, jadi saat butuh keluar cepat, yang tipis bisa susah ditukar.",
      ),
      c(
        "u16l3b7",
        "Kamu punya dana yang bakal dipakai buat hidup dalam waktu dekat. Bagaimana menaruhnya?",
        [
          "Jangan taruh semua di satu stablecoin, sebagian di-off-ramp biar aman",
          "Taruh semua dana di stablecoin ber-yield tinggi biar cepat bertambah terus",
          "Taruh semua di satu CEX biar gampang cair kapan saja",
          "Taruh semua di wallet hardware baru tanpa cadangan lain",
        ],
        "Uang hidup sebaiknya nggak menumpuk di satu stablecoin, sebagian di-off-ramp supaya nggak macet saat dibutuhkan.",
      ),
  ],
  // ------------------------------------------------------------------ u16-l4
  "u16-l4": [
      c(
        "u16l4b1",
        "Kamu simpan USDT di wallet sendiri dan merasa aman dari pembekuan. Apa kenyataannya?",
        [
          "Self-custody nggak menghilangkan blacklist penerbit",
          "Wallet sendiri otomatis membuat token kebal dari pembekuan",
          "Blacklist cuma berlaku kalau token disimpan di CEX",
          "Penerbit kehilangan hak membekukan begitu masuk wallet sendiri",
        ],
        "Blacklist itu fitur di level token, jadi self-custody nggak menghilangkan kemampuan penerbit membekukan USDT-mu.",
      ),
      tf(
        "u16l4b2",
        "Fitur blacklist di USDT dan USDC dibuat buat kepatuhan hukum, bukan bug.",
        true,
        "Penerbit bisa membekukan alamat yang kena sanksi atau terkait hack sebagai bagian dari kepatuhan hukum.",
      ),
      blank(
        "u16l4b3",
        "Alamat yang kena sanksi atau terkait hack sering dibekukan lewat fungsi ___ milik penerbit.",
        [
        "blacklist",
        "bridge",
        "snapshot",
        ],
        "Fungsi blacklist dipakai penerbit buat membekukan alamat yang kena sanksi atau terkait hack.",
      ),
      c(
        "u16l4b4",
        "Dana hasil pencurian dipindah ke USDT, apa yang biasanya terjadi?",
        [
          "Penerbit bisa membekukan USDT di alamat pencuri",
          "Dana itu otomatis kembali ke korban dalam 24 jam",
          "USDT berubah jadi token tanpa penerbit supaya nggak bisa dibekukan",
          "Penerbit wajib membakar seluruh pasokan USDT saat ada hack",
        ],
        "Pada pencurian gede, penerbit bisa membekukan USDT di alamat pencuri sehingga korban kadang tertolong.",
      ),
      tf(
        "u16l4b5",
        "Menyimpan USDT di wallet sendiri membuat token itu kebal dibekukan penerbit.",
        false,
        "Blacklist adalah fitur di level token, jadi self-custody nggak menghilangkan kemampuan penerbit membekukannya.",
      ),
      c(
        "u16l4b6",
        "Kamu mau pilih alat buat belanja sehari-hari versus buat tahan sensor. Apa pertimbangannya?",
        [
          "Token berizin kayak USDT punya tombol beku, pilih sesuai tujuan",
          "Selalu pilih token berizin karena nggak punya tombol beku sama sekali",
          "Pilih token apa saja, karena semua token punya fitur yang sama",
          "Pilih yang paling murah, urusan sensor nggak penting",
        ],
        "Token berizin punya tombol beku dari penerbit, jadi alat dipilih sesuai tujuan, belanja sehari-hari atau tahan sensor.",
      ),
      c(
        "u16l4b7",
        "Kenapa orang berpikir memindahkan dana haram ke stablecoin bisa menyembunyikannya?",
        [
          "Itu salah, jejak transaksi tetap ada dan alamatnya bisa dibekukan",
          "Karena stablecoin otomatis menghapus semua riwayat transaksi masuk",
          "Karena penerbit nggak punya catatan siapa pemilik alamat",
          "Karena dana haram berubah jadi token baru yang bersih",
        ],
        "Jejak transaksi tetap tercatat di rantai dan alamatnya bisa dibekukan, jadi stablecoin bukan cara menyembunyikan dana haram.",
      ),
  ],
  // ------------------------------------------------------------------ u17-l1
  "u17-l1": [
      c(
        "u17l1b1",
        "Kamu lihat NFT dengan floor 1 ETH lalu langsung hitung koleksimu bernilai 5 ETH. Di mana salahnya?",
        [
          "Floor cuma harga listing termurah, bukan harga jual",
          "Floor dijamin selalu dibeli marketplace di harga itu kapan saja tanpa kecuali",
          "Nilai koleksi selalu dihitung dari harga floor dikali jumlah item yang kamu punya",
          "Harga floor ditetapkan oleh pembeli terakhir, bukan oleh penjualnya",
        ],
        "Floor itu cuma listing termurah yang dipasang penjual, sedangkan ada nggak nya pembeli di harga itu belum tentu.",
      ),
      tf(
        "u17l1b2",
        "Kalau ada 5 listing di satu harga floor tapi cuma 1 pembeli, harga itu belum tentu bisa kamu jual.",
        true,
        "Floor itu tawaran jual, sedangkan yang menentukan laku atau nggak adalah ada nggak nya pembeli.",
      ),
      tf(
        "u17l1b3",
        "Volume trading besar di sebuah koleksi selalu berarti banyak orang benar-benar beli dan menahan.",
        false,
        "Volume bisa digelembungkan lewat wash trading, yaitu wallet yang putar jual beli ke dirinya sendiri.",
      ),
      c(
        "u17l1b4",
        "Sebuah marketplace nggak bayar royalti ke artis padahal koleksinya mensyaratkan. Kenapa itu bisa terjadi?",
        [
        "Royalti di banyak etalase cuma opsional, jadi marketplace bisa lewatkan",
        "Royalti otomatis dipaksa oleh jaringan Ethereum di semua transaksi",
        "Artis selalu bisa memblokir penjualan yang nggak bayar royalti",
        "Royalti cuma mitos dan nggak pernah ada di kontrak mana pun",
        ],
        "Di banyak etalase royalti memang opsional, jadi penjual bisa lewat tanpa membayar bagian artis.",
      ),
      c(
        "u17l1b5",
        "Koleksimu punya trait paling langka, tapi udah 3 bulan nggak ada yang nanya. Apa pelajarannya?",
        [
          "Trait langka nggak berguna kalau nggak ada pembeli yang mau bayar",
          "Trait langka otomatis bikin harga naik begitu dipasarkan",
          "Pembeli selalu muncul setelah kamu menunggu cukup lama",
          "Kamu harus menaikkan harga supaya koleksimu terlihat lebih bernilai",
        ],
        "Kelangkaan cuma berarti kalau ada yang mau bayar, karena tanpa pembeli trait rare tetap nggak bisa jadi uang.",
      ),
      blank(
        "u17l1b6",
        "Kalau kamu ngutang buat mint NFT, itu sebenarnya utang buat ___, bukan investasi.",
        [
        "lotre",
        "gaya",
        "konten",
        "hobi",
        ],
        "Mint tanpa pembeli yang jelas itu untung-untungan, jadi utangnya pun jadi taruhan, bukan investasi.",
      ),
      c(
        "u17l1b7",
        "Kenapa menjual NFT dalam jumlah besar lebih susah daripada menjual token biasa?",
        [
          "Likuiditas NFT jauh lebih tipis, jadi pembeli di harga itu sedikit",
          "NFT yang sudah kamu beli nggak bisa dijual lagi ke orang lain sama sekali",
          "Token biasa selalu punya harga tetap yang dijamin bursa",
          "Marketplace NFT melarang penjualan di atas satu item saja",
        ],
        "Pasar NFT tipis, jadi kalau kamu butuh keluar cepat, pembeli yang mau bayar di harga floor cuma sedikit.",
      ),
  ],
  // ------------------------------------------------------------------ u17-l2
  "u17-l2": [
      c(
        "u17l2b1",
        "Kamu mau ikut free mint, tapi situsnya minta setApprovalForAll ke kontrak yang nggak kamu kenal. Kenapa itu bahaya?",
        [
        "Izin itu bikin kontrak bisa pindahin semua NFT kamu, bukan cuma yang baru",
        "Izin itu cuma formalitas dan langsung hilang setelah mint selesai",
        "SetApprovalForAll cuma mengizinkan transfer gas dari dompet kamu",
        "Izin itu mengunci dompet supaya nggak bisa dipakai selamanya",
        ],
        "Izin all itu memberi akses ke seluruh koleksi kamu, jadi kontrak jahat bisa menguras NFT lama yang udah kamu simpan.",
      ),
      tf(
        "u17l2b2",
        "Permintaan sign to check whitelist itu langkah normal yang aman di semua situs mint.",
        false,
        "Tanda tangan seperti itu sering dipakai buat menipu, karena cek whitelist nggak butuh izin penuh atas dompet kamu.",
      ),
      c(
        "u17l2b3",
        "Situs mint bilang gratis, tapi minta kamu transfer 0,2 ETH buat fee verifikasi. Sikap yang waras?",
        [
          "Curiga dan batal, karena free mint cuma butuh gas, bukan transfer tambahan",
          "Bayar aja, itu biaya standar yang dipungut semua proyek mint di jaringan ini",
          "Kirim setengah dulu biar aman sambil lihat hasil mint-nya",
          "Transfer ke alamat pribadi admin biar kamu dapat prioritas mint",
        ],
        "Free mint tetap butuh gas, jadi permintaan transfer tambahan di luar gas itu tanda umpan penipuan.",
      ),
      c(
        "u17l2b4",
        "Cara paling aman nemuin link situs mint yang benar itu gimana?",
        [
        "Ambil dari bookmark atau akun resmi proyek yang sudah terverifikasi",
        "Klik link yang dikirim reply bot di kolom komentar paling atas",
        "Pakai link yang dipromosikan akun baru tanpa riwayat",
        "Ketik nama proyek di iklan pencarian lalu klik yang teratas",
        ],
        "Link dari reply bot sering mengarah ke situs tiruan, jadi ambil dari bookmark atau akun resmi yang terverifikasi.",
      ),
      tf(
        "u17l2b5",
        "Kontrak mint yang abis itu bisa mencet token tanpa batas adalah bentuk rug pull versi NFT.",
        true,
        "Kalau pemilik kontrak bisa mint seenaknya, pasokan bisa dibanjiri dan nilai koleksi kamu jatuh.",
      ),
      blank(
        "u17l2b6",
        "Metadata yang bisa diganti tim itu tandanya file disimpan di ___ proyek, bukan on-chain.",
        [
        "server",
        "rantai",
        "dompet",
        "kontrak",
        ],
        "Kalau gambarnya cuma di server proyek, tim bisa tukar atau hapus kapan saja tanpa izin kamu.",
      ),
      c(
        "u17l2b7",
        "Kamu denger kabar proyek menyimpan gambarnya di server biasa, bukan di IPFS. Apa kekurangannya?",
        [
          "Server bisa diganti isinya atau dimatikan, jadi gambarnya bisa hilang",
          "Gambar jadi nggak bisa dibuka di marketplace mana pun selamanya tanpa cara lain",
          "Harga token otomatis jadi nol begitu gambarnya diupload",
          "Dompet kamu bakal otomatis terkunci setelah proses mint selesai",
        ],
        "Server biasa sepenuhnya di tangan proyek, jadi mereka bisa ganti gambar atau matiin servernya kapan saja.",
      ),
  ],
  // ------------------------------------------------------------------ u17-l3
  "u17-l3": [
      c(
        "u17l3b1",
        "Sebuah NFT ngasih akses ke grup diskusi yang bisa kamu buktikan keanggotaannya. Itu termasuk apa?",
        [
        "Utility waras, karena aksesnya nyata dan bisa dicek",
        "Utility palsu, karena semua akses online itu nggak pernah nyata",
        "Janji masa depan, karena grup bisa bubar sewaktu-waktu",
        "Investasi otomatis, karena akses selalu naik harganya",
        ],
        "Akses atau keanggotaan yang bisa diverifikasi itu contoh utility waras, karena manfaatnya benar-benar bisa kamu pakai.",
      ),
      c(
        "u17l3b2",
        "Roadmap proyek bilang metaverse dan token menyusul 4 tahun lagi. Kenapa itu bukan utility yang bisa dipegang?",
        [
          "Karena janji masa depan nggak bisa kamu pakai sekarang",
          "Karena roadmap empat tahun selalu ditulis pakai bahasa asing",
          "Karena metaverse itu teknologi yang sudah dilarang negara",
          "Karena token menyusul biasanya cuma bisa dibeli pakai dolar",
        ],
        "Utility palsu biasanya berupa janji jauh di depan yang nggak bisa dibuktikan, beda dengan akses yang bisa langsung dicek.",
      ),
      tf(
        "u17l3b3",
        "Utility NFT yang bisa dicabut admin sebenarnya lebih mirip izin daripada barang milikmu.",
        true,
        "Kalau admin bisa mencabut aksesnya, kamu cuma dipinjamkan hak pakai, bukan memegang sesuatu yang benar-benar jadi milikmu.",
      ),
      c(
        "u17l3b4",
        "Artis bilang royalti 10 persen, tapi kamu beli di marketplace yang nggak bayar royalti. Apa yang terjadi?",
        [
          "Artis nggak dapat apa-apa, karena royalti cuma opsional",
          "Artis tetap dibayar otomatis oleh jaringan di setiap penjualan",
          "Marketplace itu bakal diblokir dari jaringan karena melanggar",
          "Kamu yang harus bayar royalti langsung ke artis setelahnya",
        ],
        "Royalti sering nggak sampai ke artis kalau marketplace memilih melewatinya, karena sifatnya opsional bukan wajib.",
      ),
      tf(
        "u17l3b5",
        "Punya NFT foto profil bikin kamu otomatis jadi investor resmi proyeknya.",
        false,
        "Memegang PFP nggak memberi saham atau klaim, kamu cuma pemilik token gambar itu.",
      ),
      blank(
        "u17l3b6",
        "Boleh kok mengoleksi NFT karena memang ___, yang penting jangan berharap jadi ATM.",
        [
        "suka",
        "takut",
        "dipaksa",
        "ikut-ikutan",
        ],
        "Koleksi karena suka itu wajar, yang keliru adalah beli murni berharap untung besar dari janji proyek.",
      ),
      c(
        "u17l3b7",
        "Proyek ngasih utility berupa janji roadmap panjang tanpa apa pun yang bisa dipakai hari ini. Sikap kamu?",
        [
          "Anggap itu cerita, bukan utility, dan beli kalau kamu suka",
          "Anggap roadmap panjang sebagai jaminan harga pasti naik terus",
          "Tetap beli besar karena janji selalu ditepati proyek NFT",
          "Tunggu empat tahun sambil menahan token tanpa berpikir",
        ],
        "Utility palsu cuma cerita, jadi keputusan beli harus berdasar rasa suka, bukan harapan janji masa depan.",
      ),
  ],
  // ------------------------------------------------------------------ u17-l4
  "u17-l4": [
      c(
        "u17l4b1",
        "Kamu beli NFT di koleksi berlisensi terbatas. Apa yang sebenarnya kamu miliki?",
        [
        "Token-nya, sementara hak pakai gambar ikut aturan lisensi koleksi",
        "Hak cipta penuh atas gambar beserta merek dagangnya",
        "Hak memaksa orang lain menghapus gambar yang sama",
        "Kepemilikan resmi atas seluruh koleksi, bukan cuma satu token",
        ],
        "Yang kamu pegang biasanya cuma tokennya, sedangkan hak pakai gambar tergantung lisensi koleksinya.",
      ),
      tf(
        "u17l4b2",
        "Menyalin gambar NFT lewat right-click nggak memindahkan token, karena tokennya tetap di rantai.",
        true,
        "Yang berpindah saat transaksi cuma catatan kepemilikan di rantai, sedangkan menyalin file nggak menyentuh catatan itu.",
      ),
      c(
        "u17l4b3",
        "Ada yang DM bilang NFT kamu plagiat dan minta bayar 0,3 ETH biar kasusnya selesai. Apa yang kamu lakuin?",
        [
          "Blokir, karena ancaman lewat DM bukan surat resmi dan itu pola pemerasan",
          "Bayar cepat biar nggak berurusan sama pengadilan negeri",
          "Kirim setengah dulu sebagai tanda itikad baik kamu",
          "Minta nomor rekening lalu transfer sesuai instruksi yang dikirim oleh pelaku",
        ],
        "Ancaman hukum lewat DM itu pemerasan klasik, jadi yang waras adalah blokir, bukan bayar.",
      ),
      c(
        "u17l4b4",
        "Sebelum pakai gambar NFT buat kaos dagangan, apa yang paling perlu kamu cek dulu?",
        [
        "Lisensi koleksinya, apakah ngizinin pemakaian komersial atau nggak",
        "Jumlah follower akun pembuat gambar di media sosial",
        "Harga floor koleksi saat ini di marketplace terbesar",
        "Apakah gambar itu pernah di-screenshot orang lain sebelumnya",
        ],
        "Pemakaian komersial tergantung lisensi, jadi cek dulu apakah koleksinya mengizinkan atau malah membatasi.",
      ),
      tf(
        "u17l4b5",
        "Screenshot gambar NFT yang tersimpan di galeri kamu itu bukti sah kalau kamu pemilik on-chain-nya.",
        false,
        "Kepemilikan on-chain dibuktikan oleh token di alamat kamu, bukan oleh file gambar yang kamu simpan.",
      ),
      blank(
        "u17l4b6",
        "Lisensi koleksi yang membebaskan hampir semua pemakaian gambar disebut lisensi ___.",
        [
        "CC0",
        "DMCA",
        "NDA",
        "EULA",
        ],
        "Lisensi CC0 melepas hampir semua batasan, jadi gambar bisa dipakai luas oleh siapa pun.",
      ),
      c(
        "u17l4b7",
        "Kamu lihat koleksi NFT tanpa lisensi apa pun yang jelas. Artinya apa buat kamu?",
        [
          "Hak pakainya nggak dijamin, jadi hati-hati sebelum memakainya",
          "Semua hak ciptanya otomatis jadi milikmu begitu token masuk dompet",
          "Kamu bebas menjual gambar itu sebagai produk sendiri",
          "Lisensi nggak pernah penting selama tokennya ada di rantai",
        ],
        "Kalau lisensinya nggak jelas, hak pakai kamu nggak dijamin, jadi jangan asal memakai gambarnya buat komersial.",
      ),
  ],
  // ------------------------------------------------------------------ u17-l5
  "u17-l5": [
      c(
        "u17l5b1",
        "Kamu beli NFT, tapi gambarnya disimpan di server biasa milik proyek. Risiko utamanya apa?",
        [
          "Tim bisa ganti gambar atau matiin server kapan saja",
          "Gambarnya otomatis dihapus dari dompet kamu setelah sebulan",
          "Harga tokennya langsung nol begitu gambar dimuat",
          "Kamu nggak bisa jual tokennya lagi di marketplace mana pun",
        ],
        "File di server biasa sepenuhnya di tangan proyek, jadi gambar bisa ditukar atau hilang kalau servernya dimatikan.",
      ),
      tf(
        "u17l5b2",
        "Gambar NFT di IPFS lebih tahan kalau ada banyak pihak yang menyimpan salinannya.",
        true,
        "IPFS mengandalkan salinan dari banyak pin, jadi file tetap ada walaupun satu server mati.",
      ),
      c(
        "u17l5b3",
        "Kamu lihat kontrak NFT punya fungsi admin buat ganti tokenURI. Apa artinya?",
        [
          "Metadata bisa diubah pemilik kontrak, jadi gambarnya nggak benar-benar kunci",
          "Gambar sudah pasti abadi karena tercatat permanen di rantai",
          "Semua orang bisa mengganti gambar sesuka hati tanpa izin dari pemilik kontrak",
          "TokenURI cuma hiasan dan nggak berpengaruh apa pun",
        ],
        "Fungsi admin yang bisa ganti tokenURI berarti metadata bisa diubah, jadi gambarnya nggak benar-benar permanen.",
      ),
      tf(
        "u17l5b4",
        "Klaim immutable di Twitter sudah cukup buat memastikan metadata NFT kamu nggak bisa diganti.",
        false,
        "Immutable harus dibuktikan dari kode kontraknya, bukan dari klaim di media sosial.",
      ),
      c(
        "u17l5b5",
        "NFT on-chain art biasanya beda dari NFT biasa karena apa?",
        [
          "Datanya disimpan langsung di rantai, jadi lebih tahan lama",
          "Gambarnya gratis dan nggak butuh gas buat dicetak",
          "File-nya cuma di server proyek yang bisa kapan saja dimatikan",
          "Harganya selalu lebih murah karena nggak butuh penyimpanan",
        ],
        "On-chain art menyimpan datanya di rantai, jadi biayanya mahal tapi gambarnya lebih lengket dan jarang.",
      ),
      blank(
        "u17l5b6",
        "NFT itu catatan kepemilikan plus ___ ke tempat gambar disimpan.",
        [
        "pointer",
        "password",
        "notifikasi",
        "sertifikat",
        ],
        "Token di rantai cuma menunjuk ke lokasi file, jadi file-nya sendiri bisa hidup di luar rantai.",
      ),
      c(
        "u17l5b7",
        "Metadata NFT kamu balik 404 setelah tim cabut. Apa yang masih kamu pegang?",
        [
          "Nomor atau token di kontrak, sementara gambarnya sudah nggak bisa diakses",
          "Gambar lengkap yang masih tersimpan dengan aman di dalam dompet kamu sendiri",
          "Hak cipta penuh atas gambar yang bisa kamu jual ke orang lain kapan saja",
          "Jaminan ganti rugi dari marketplace tempat kamu membeli token itu",
        ],
        "Yang tersisa cuma token di kontrak, sedangkan gambarnya hilang karena cuma tersimpan di server yang dimatikan.",
      ),
  ],
  // ------------------------------------------------------------------ u18-l1
  "u18-l1": [
      c(
        "u18l1b1",
        "Kamu disuruh ketik seed phrase ke sebuah situs buat sync wallet. Apa yang harus kamu lakuin?",
        [
          "Tolak, karena seed yang diketik ke web bisa dicuri",
          "Ketik saja selama situs itu menampilkan logo resmi yang meyakinkan",
          "Ketik sebagian dulu buat ngetes situsnya jujur",
          "Ketik lalu langsung ganti seed setelah selesai",
        ],
        "Seed yang pernah diketik ke web bisa langsung diambil penyerang, jadi aturan kerasnya seed nggak pernah menyentuh internet.",
      ),
      tf(
        "u18l1b2",
        "Hardware wallet menandatangani transaksi di perangkat, jadi seed nggak pernah keluar ke internet.",
        true,
        "Kunci tetap di dalam perangkat keras, jadi transaksi ditandatangani di situ tanpa membocorkan seed.",
      ),
      c(
        "u18l1b3",
        "Kenapa HP plus MetaMask disebut hot wallet?",
        [
          "Karena kuncinya tersimpan di perangkat yang selalu online",
          "Karena harganya selalu naik turun mengikuti pasar kripto dunia",
          "Karena cuma bisa dipakai buat beli NFT saja di HP",
          "Karena fiturnya lebih sedikit dibanding hardware wallet",
        ],
        "Hot wallet berarti kuncinya hidup di perangkat yang online, jadi lebih rawan dibanding perangkat yang offline.",
      ),
      tf(
        "u18l1b4",
        "Beli hardware wallet bekas yang masih ada tulisan seed di dalamnya itu aman selama harganya murah.",
        false,
        "Seed yang sudah tertulis bisa dipegang orang sebelumnya, jadi danamu rawan dipindah kapan saja.",
      ),
      c(
        "u18l1b5",
        "Di mana sebaiknya kamu simpan seed phrase hardware wallet?",
        [
          "Ditulis di kertas atau metal dan disimpan offline",
          "Di aplikasi catatan HP supaya gampang disalin kapan saja",
          "Di galeri foto biar kamu nggak lupa letaknya",
          "Di chat pribadi ke diri sendiri biar selalu ada salinannya",
        ],
        "Seed sebaiknya ditulis offline di kertas atau metal, karena menyimpannya di HP bisa ikut bocor ke cloud.",
      ),
      c(
        "u18l1b6",
        "Kamu mau beli hardware wallet. Dari mana sebaiknya?",
        [
          "Toko atau situs resmi, supaya perangkatnya masih tersegel",
          "Marketplace barang bekas dari penjual yang kasih diskon besar",
          "Reseller nggak dikenal yang nawarin lewat iklan",
          "Teman yang bilang perangkatnya masih segel tapi murah",
        ],
        "Perangkat bekas bisa sudah diinisialisasi orang lain, jadi beli selalu dari toko atau situs resmi.",
      ),
      blank(
        "u18l1b7",
        "PIN dan passphrase tambahan boleh dipakai asal kamu paham risikonya, karena kalau lupa seed bisa ___.",
        [
        "hangus",
        "ganda",
        "aman",
        "kembali",
        ],
        "Passphrase tambahan bikin akses cuma bisa dibuka dengan kombinasi itu, jadi kalau lupa danamu nggak bisa dipulihkan.",
      ),
  ],
  // ------------------------------------------------------------------ u18-l2
  "u18-l2": [
      c(
        "u18l2b1",
        "Kas sebuah proyek NFT dipegang satu orang pakai satu HP. Kenapa itu berisiko?",
        [
          "Kalau HP-nya hilang, seluruh kas nggak bisa diakses",
          "Kas jadi lebih gampang dicairkan kapan saja",
          "Biaya transaksinya jadi jauh lebih mahal dari biasanya",
          "Saldo kas otomatis berkurang setiap hari tanpa sebab",
        ],
        "Satu kunci di satu perangkat berarti kehilangan HP sama dengan kehilangan seluruh akses ke kas itu.",
      ),
      tf(
        "u18l2b2",
        "Multisig 2-dari-3 tetap aman walaupun satu kuncinya hilang, karena dua kunci lain masih cukup.",
        true,
        "Karena butuh dua tanda tangan dari tiga, kehilangan satu kunci nggak menghentikan akses.",
      ),
      tf(
        "u18l2b3",
        "Menyimpan tiga kunci multisig di tiga folder laptop yang sama itu sudah cukup memisahkan risiko.",
        false,
        "Kalau laptopnya satu dan kena malware, semua kunci di dalamnya bisa diambil sekaligus, jadi pemisahan itu cuma teater.",
      ),
      c(
        "u18l2b4",
        "Untuk kas resto komunitas, kenapa multisig masuk akal?",
        [
          "Karena beberapa orang harus setuju sebelum dana dipakai",
          "Karena multisig menghapus semua biaya transaksi di jaringan on-chain",
          "Karena multisig bikin saldo otomatis bertambah tiap hari",
          "Karena multisig cuma bisa dipakai oleh satu orang saja",
        ],
        "Dengan beberapa tanda tangan, nggak ada satu orang yang bisa memindahkan kas sendirian, cocok buat kas komunitas.",
      ),
      c(
        "u18l2b5",
        "Kamu mau pakai multisig buat dompet isi Rp 200 ribu. Bagaimana?",
        [
          "Kebanyakan, karena biayanya nggak sepadan buat jumlah kecil",
          "Wajib, karena semua dompet harus memakai multisig tanpa kecuali",
          "Ideal, karena makin rumit selalu makin aman juga",
          "Nggak masalah, karena biaya multisig selalu nol",
        ],
        "Multisig ada biaya dan kerumitan, jadi buat nominal kecil itu berlebihan dan nggak sepadan.",
      ),
      blank(
        "u18l2b6",
        "Kalau beberapa kunci harus setuju sebelum transaksi, itu disebut ___.",
        [
        "multisig",
        "pinjaman",
        "autodebet",
        "langganan",
        ],
        "Multisig berarti transaksi butuh beberapa tanda tangan kunci, bukan cuma satu.",
      ),
      c(
        "u18l2b7",
        "Kenapa kunci-kunci multisig sebaiknya ditaruh di lokasi yang berbeda?",
        [
          "Supaya satu kebakaran nggak menghabiskan semua kunci sekaligus",
          "Supaya kamu bisa transfer lebih cepat tanpa perlu konfirmasi dulu",
          "Supaya biaya gas setiap transaksi jadi lebih murah",
          "Supaya orang lain bisa memakai kunci milikmu kapan saja",
        ],
        "Kunci yang tersebar di tempat beda bikin satu insiden di satu lokasi nggak menghabiskan seluruh akses.",
      ),
  ],
  // ------------------------------------------------------------------ u18-l3
  "u18-l3": [
      c(
        "u18l3b1",
        "Wallet nunjukin simulasi bakal ngirim token padahal katanya mint gratis. Apa yang kamu lakuin?",
        [
          "Batalkan, karena simulasi nunjukin kamu bakal rugi",
          "Lanjut aja, simulasi itu sering salah membaca",
          "Lanjut sambil berharap mint-nya benar-benar gratis buatmu",
          "Kurangi jumlah yang dikirim biar terasa lebih aman",
        ],
        "Kalau simulasi nunjukin transfer aset padahal diklaim mint gratis, itu tanda drainer, jadi harus dibatalkan.",
      ),
      tf(
        "u18l3b2",
        "Alat drainer itu barang langka yang jarang dipakai, jadi kamu nggak perlu takut.",
        false,
        "Justru sebaliknya, alat drainer murah dan dipakai luas, jadi banyak orang bisa kena.",
      ),
      c(
        "u18l3b3",
        "Apa gunanya fitur simulasi transaksi di wallet modern?",
        [
          "Nunjukin dulu apa yang bakal kamu kirim dan izinnya",
          "Menjamin semua transaksi untung dan nggak pernah rugi",
          "Menghapus biaya gas dari setiap transaksi",
          "Mengubah koin murah jadi koin mahal otomatis",
        ],
        "Simulasi memperlihatkan hasil transaksi sebelum kamu setujui, jadi kamu bisa melihat aset dan izin yang keluar.",
      ),
      tf(
        "u18l3b4",
        "Revoke izin lama secara berkala itu penting, karena izin yang menganggur tetap jadi pintu.",
        true,
        "Izin yang kamu tinggalkan tetap aktif, jadi kontrak lama yang kena hack bisa memakainya buat menguras dompetmu.",
      ),
      c(
        "u18l3b5",
        "Blind sign itu kenapa berbahaya?",
        [
          "Karena kamu menyetujui transaksi tanpa tahu isinya",
          "Karena transaksi tanpa isi selalu gagal di jaringan",
          "Karena blind sign bikin gas naik berkali-kali lipat",
          "Karena blind sign cuma bisa dipakai sekali saja",
        ],
        "Blind sign bikin kamu tanda tangan dalam gelap, jadi kamu bisa menyetujui transfer aset tanpa sadar.",
      ),
      blank(
        "u18l3b6",
        "Tanda tangan transaksi tanpa melihat isinya di HP disebut blind ___.",
        [
        "sign",
        "swap",
        "stake",
        "mint",
        ],
        "Blind sign artinya kamu tanda tangan dalam keadaan gelap, tanpa tahu apa yang sebenarnya disetujui.",
      ),
      c(
        "u18l3b7",
        "Simulasi wallet nunjukin hasil yang aneh dan nggak masuk akal. Menurut materi, sebaiknya?",
        [
        "Langsung batalkan, jangan paksa lanjut karena rasa FOMO",
        "Lanjut dulu, nanti kalau rugi baru diurus",
        "Ganti wallet lain yang simulasi tidak aktif",
        "Kurangi nominalnya lalu kirim ulang sampai berhasil",
        ],
        "Kalau simulasi mencurigakan, aturannya batalkan saja, karena simulasi lebih bisa dipercaya daripada rasa FOMO.",
      ),
  ],
  // ------------------------------------------------------------------ u18-l4
  "u18-l4": [
      c(
        "u18l4b1",
        "Kenapa 2FA lewat SMS dianggap lebih rentan?",
        [
          "Karena nomor kamu bisa dipindah lewat SIM swap",
          "Karena SMS selalu datang terlambat ke HP kamu",
          "Karena kode SMS nggak bisa dipakai di akun CEX mana pun",
          "Karena SMS cuma bisa dikirim satu kali dalam sehari",
        ],
        "SIM swap bikin penyerang menerima kode SMS kamu, jadi 2FA lewat SMS jauh lebih rawan dibanding aplikasi autentikator.",
      ),
      tf(
        "u18l4b2",
        "Sebelum menaruh dana besar, kamu sebaiknya uji backup seed dengan memulihkannya ke perangkat kosong.",
        true,
        "Uji restore membuktikan backupmu benar-benar jalan, jadi kamu nggak baru sadar seed salah saat darurat.",
      ),
      c(
        "u18l4b3",
        "Ada yang ngeklaim CS wallet lalu minta kode OTP kamu. Apa yang harus kamu lakuin?",
        [
          "Tolak dan tutup, karena CS asli nggak minta kode",
          "Kasih kode biar akunmu nggak diblokir permanen",
          "Kasih setengah kode dulu buat memastikan dia asli",
          "Ikuti instruksinya biar masalahnya cepat selesai",
        ],
        "CS resmi nggak pernah menanyakan kode rahasia, jadi permintaan OTP lewat telepon itu pasti penipuan.",
      ),
      tf(
        "u18l4b4",
        "Screenshot seed phrase di galeri aman, karena galeri nggak pernah tersambung ke cloud.",
        false,
        "Galeri sering otomatis tersinkron ke iCloud atau Google, jadi seed-nya bisa bocor ke layanan itu.",
      ),
      c(
        "u18l4b5",
        "Kamu dapat file APK wallet dari grup Telegram. Sebaiknya?",
        [
          "Jangan diinstal, ambil wallet dari sumber resmi",
          "Instal aja kalau banyak orang bilang lancar",
          "Instal di HP kosong biar nggak kena apa-apa",
          "Instal lalu hapus setelah transaksinya selesai semua",
        ],
        "APK dari Telegram bisa berisi malware, jadi aplikasi wallet harus selalu diambil dari sumber resmi.",
      ),
      c(
        "u18l4b6",
        "Selain penyerang dari luar, apa risiko yang sering dilupakan soal keamanan?",
        [
          "Orang dalam, seperti teman yang bisa pegang HP kamu",
          "Cuaca buruk yang bikin jaringan blockchain jadi lambat",
          "Harga koin yang turun saat kamu sedang tidur",
          "Iklan yang muncul di dalam aplikasi dompet",
        ],
        "Orang terdekat yang bisa memegang HP atau kode kamu sering dilupakan, padahal itu juga pintu masuk.",
      ),
      blank(
        "u18l4b7",
        "Di CEX, sebaiknya pakai 2FA lewat aplikasi autentikator, bukan lewat ___.",
        [
        "SMS",
        "email",
        "telepon",
        "surat",
        ],
        "SMS rentan SIM swap, sedangkan aplikasi autentikator nggak bergantung pada nomor HP.",
      ),
  ],
  // ------------------------------------------------------------------ u18-l5
  "u18-l5": [
      c(
        "u18l5b1",
        "Kenapa allowance yang menumpuk setahun itu berbahaya?",
        [
          "Karena tiap izin lama tetap jadi pintu buat kontrak jahat",
          "Karena allowance bikin saldo kamu berkurang otomatis",
          "Karena terlalu banyak izin bikin wallet nggak bisa dibuka lagi",
          "Karena allowance menambah biaya bulanan dompetmu",
        ],
        "Tiap izin yang kamu tinggalkan tetap aktif, jadi kumpulan izin lama itu seperti museum pintu yang bisa dibuka penyerang.",
      ),
      tf(
        "u18l5b2",
        "Session key atau connect game itu aman asal kamu baca durasi dan batas belanjanya.",
        true,
        "Session key memang izin terbatas, jadi selama durasi dan spend cap-nya jelas, risikonya bisa dikendalikan.",
      ),
      c(
        "u18l5b3",
        "Dua izin ini bikin kamu rawan. Mana yang sebaiknya kamu cabut lebih dulu?",
        [
          "Izin unlimited USDC dan operator NFT, itu yang paling bahaya",
          "Izin swap kecil yang sudah lama nggak kamu pakai sama sekali",
          "Izin di dompet kosong yang nggak ada isinya",
          "Izin yang cuma berlaku buat satu transaksi lama",
        ],
        "Izin unlimited USDC dan operator NFT memberi akses besar, jadi itu yang paling mendesak buat dicabut lebih dulu.",
      ),
      tf(
        "u18l5b4",
        "Recovery resmi dompet biasanya ditawarkan lewat DM dari akun support.",
        false,
        "Recovery itu fitur desain wallet, bukan layanan yang dikirim lewat DM, jadi tawaran seperti itu penipuan.",
      ),
      c(
        "u18l5b5",
        "Apa kelebihan smart wallet seperti Safe dibanding dompet biasa?",
        [
          "Bisa multisig, social recovery, dan atur limit harian",
          "Menghapus semua biaya gas di setiap transaksi",
          "Menjamin koin kamu nggak pernah turun harganya",
          "Menyimpan seed kamu di server supaya gampang dipulihkan",
        ],
        "Smart wallet seperti Safe memberi fitur multisig, social recovery, dan limit harian yang nggak ada di dompet biasa.",
      ),
      blank(
        "u18l5b6",
        "Izin allowance yang nggak dipakai sebaiknya kamu cabut, dan proses itu disebut ___.",
        [
        "revoke",
        "refund",
        "reload",
        "remake",
        ],
        "Revoke artinya mencabut izin lama supaya kontrak nggak lagi bisa memakai asetmu.",
      ),
      c(
        "u18l5b7",
        "Social recovery pakai guardian. Apa risikonya kalau guardian-nya salah pilih?",
        [
          "Guardian yang jahat bisa jadi pintu masuk buat dana kamu",
          "Recovery jadi lebih lambat karena butuh konfirmasi lewat email",
          "Dana kamu otomatis kembali ke dompet lama",
          "Guardian cuma bisa melihat saldo tanpa bisa apa-apa",
        ],
        "Guardian di social recovery punya kekuatan memulihkan akses, jadi guardian yang jahat justru jadi pintu masuk.",
      ),
  ],
  // ------------------------------------------------------------------ u19-l1
  "u19-l1": [
      c(
        "u19l1b1",
        "Wallet berlabel smart money tiba-tiba jual meme ke kamu. Apa yang sebaiknya kamu pikirkan?",
        [
          "Labelnya bisa usang, cek dulu pola transaksinya",
          "Label itu jaminan wallet selalu punya strategi yang jitu",
          "Berarti meme itu pasti bakal naik setelah mereka menjual",
          "Label resmi berarti pemiliknya sudah diverifikasi oleh negara",
        ],
        "Label cuma petunjuk yang bisa usang, jadi pola transaksi lebih layak dipercaya daripada badge smart money.",
      ),
      tf(
        "u19l1b2",
        "Label Binance di sebuah alamat itu jaminan kalau transaksi berikutnya dari alamat itu pasti aman.",
        false,
        "Label cuma petunjuk, bukan jaminan, karena alamat bisa dipakai buat banyak hal termasuk yang menipu.",
      ),
      c(
        "u19l1b3",
        "Satu orang atau satu perusahaan bisa punya berapa alamat wallet?",
        [
          "Banyak alamat, jangan simpulkan satu alamat satu orang",
          "Cuma boleh satu alamat seumur hidup karena aturan jaringan",
          "Maksimal dua alamat saja untuk tiap orang",
          "Nol, karena alamat selalu dipakai bergantian orang",
        ],
        "Satu entitas bisa punya banyak alamat, jadi menyamakan satu alamat dengan satu orang itu keliru.",
      ),
      tf(
        "u19l1b4",
        "Sebelum percaya sebuah label di explorer, sebaiknya kamu cek riwayat transaksi dan asal dananya.",
        true,
        "Label bisa keliru atau ketinggalan, jadi pola transaksi lebih bisa dipercaya daripada nama yang ditempel.",
      ),
      c(
        "u19l1b5",
        "Kenapa menyalin alamat dari story Instagram berbahaya?",
        [
          "Karena satu digit salah bikin dana masuk alamat orang lain",
          "Karena alamat dari Instagram selalu terlalu panjang",
          "Karena Instagram melarang semua bentuk transfer kripto di story",
          "Karena alamat di story nggak bisa dibaca di explorer",
        ],
        "Salah satu digit saja sudah cukup bikin dana masuk ke alamat yang salah, jadi selalu verifikasi alamatnya.",
      ),
      blank(
        "u19l1b6",
        "Satu entitas bisa punya banyak alamat, jadi identitas sebenarnya dilihat dari ___-nya, bukan label.",
        [
        "pola",
        "warna",
        "logo",
        "badge",
        ],
        "Pola transaksi lebih jujur daripada label, karena label bisa salah atau usang.",
      ),
      c(
        "u19l1b7",
        "Kamu lihat label nama terkenal di alamat tujuan transfer. Langkah paling waras?",
        [
          "Tetap cocokkan alamat lengkapnya sebelum kirim",
          "Kirim langsung, karena label terkenal berarti pasti benar",
          "Kirim sebagian dulu buat ngetes keberanian",
          "Percaya aja selama tampilannya terlihat resmi",
        ],
        "Label bisa salah atau ditempel di alamat yang keliru, jadi alamat lengkapnya tetap harus kamu cocokkan sendiri.",
      ),
  ],
  // ------------------------------------------------------------------ u19-l2
  "u19-l2": [
      c(
        "u19l2b1",
        "Kamu lihat wallet besar beli koin, terus kamu langsung beli setelahnya. Apa yang sering terjadi?",
        [
          "Kamu jadi likuiditas buat mereka keluar",
          "Kamu otomatis dapat harga yang lebih murah dari mereka",
          "Kamu ikut dapat keuntungan yang sama besarnya",
          "Harga selalu naik selama kamu masih memegang",
        ],
        "Kalau kamu masuk abis mereka, posisimu jadi tempat mereka menjual, jadi kamu justru menyediakan likuiditas.",
      ),
      tf(
        "u19l2b2",
        "Hasil wallet yang ubah US$17 jadi US$3 juta itu template gaji yang bisa kamu tiru ukurannya.",
        false,
        "Itu bisa jadi insider, keberuntungan, atau keduanya, jadi bukan pola yang aman ditiru mentah-mentah.",
      ),
      c(
        "u19l2b3",
        "Kenapa copy-trade on-chain tetap disebut copy buta?",
        [
          "Karena kamu nggak lihat ukuran modal dan kapan mereka keluar",
          "Karena transaksi on-chain selalu disembunyikan dari publik luas",
          "Karena kamu nggak bisa melihat harga koin di explorer",
          "Karena wallet besar selalu salah menghitung profit",
        ],
        "Kamu cuma melihat entry, bukan hedge, ukuran kekayaan, atau rencana keluar mereka, jadi copy-mu tetap buta.",
      ),
      tf(
        "u19l2b4",
        "Yang sering diposting orang biasanya cuma kemenangan, bukan posisi yang rugi.",
        true,
        "Karena yang dibagikan cuma yang menang, kamu nggak lihat berapa banyak posisi yang sebenarnya berakhir rugi.",
      ),
      c(
        "u19l2b5",
        "Kenapa bot copy sering rugi lebih parah daripada orang yang ditiru?",
        [
          "Karena bot kena MEV dan slippage di antrian",
          "Karena bot nggak bisa terhubung ke jaringan blockchain",
          "Karena bot selalu beli di harga yang lebih murah",
          "Karena bot dilarang bertransaksi di bursa besar",
        ],
        "Bot copy biasanya masuk belakangan, jadi kena MEV dan slippage yang bikin harga masuknya lebih parah.",
      ),
      blank(
        "u19l2b6",
        "Yang sebaiknya kamu tiru dari wallet besar adalah idenya, bukan ___ posisinya.",
        [
        "ukuran",
        "warna",
        "nama",
        "tanggal",
        ],
        "Meniru ukuran posisi orang lain berbahaya, karena modal dan toleransi risiko kamu beda.",
      ),
      c(
        "u19l2b7",
        "Wallet paus yang kamu intip ternyata cuma ngepost posisi menangnya. Pelajarannya?",
        [
          "Kamu nggak tahu berapa posisi rugi yang disembunyikan",
          "Berarti mereka selalu benar di setiap transaksi yang mereka lakukan",
          "Berarti kamu harus meniru semua posisi mereka",
          "Berarti semua posisi mereka pasti menguntungkan",
        ],
        "Karena yang diposting cuma kemenangan, kamu nggak tahu berapa banyak posisi rugi yang disembunyikan.",
      ),
  ],
  // ------------------------------------------------------------------ u19-l3
  "u19-l3": [
      c(
        "u19l3b1",
        "Kenapa area likuidasi yang numpuk sering jadi incaran pasar?",
        [
          "Karena kerumunan stop bisa jadi magnet harga dulu",
          "Karena area itu selalu jadi titik harga paling terendah",
          "Karena bot nggak bisa melihat area likuidasi itu",
          "Karena harga dilarang masuk ke area likuidasi itu",
        ],
        "Tumpukan stop dan likuidasi bisa menarik harga ke arah situ dulu, karena bot dan pasar mengincar kerumunan itu.",
      ),
      tf(
        "u19l3b2",
        "Heatmap likuidasi itu sinyal beli yang pasti, jadi kamu boleh nekat kalau area sudah terlihat.",
        false,
        "Heatmap cuma buat konteks, karena area itu bisa menarik harga justru buat menguras posisi kamu sendiri.",
      ),
      c(
        "u19l3b3",
        "Open interest gede plus funding ekstrem itu artinya apa?",
        [
          "Pasar sedang sesak, bukan tanda arah harga",
          "Pasar pasti bakal naik terus tanpa koreksi apa pun",
          "Pasar pasti bakal turun sampai harga nol",
          "Pasar nggak akan pernah bergerak lagi sama sekali",
        ],
        "Open interest besar dengan funding ekstrem menandakan pasar sesak, jadi bukan jaminan harga lanjut ke satu arah.",
      ),
      tf(
        "u19l3b4",
        "Likuidasi massal bisa bikin harga squeeze dulu sebelum akhirnya balik arah.",
        true,
        "Saat banyak posisi dipaksa tutup, harga bisa melonjak sebentar, lalu berbalik setelah tekanan itu habis.",
      ),
      c(
        "u19l3b5",
        "Paus yang salah timing sampai posisinya hangus. Pelajaran buat kamu?",
        [
          "Timing siapa pun bisa salah, jangan ikut posisi besar",
          "Kamu harus selalu melawan posisi para paus",
          "Paus pasti nggak pernah salah untuk dua kali",
          "Kamu harus memakai leverage yang jauh lebih tinggi lagi",
        ],
        "Timing paus pun bisa salah, jadi ikut dengan posisi lebih besar cuma menambah risiko kamu sendiri.",
      ),
      blank(
        "u19l3b6",
        "Posisi yang dipaksa ditutup karena harga menyentuh batas disebut ___.",
        [
        "likuidasi",
        "likuiditas",
        "kolaborasi",
        "investasi",
        ],
        "Likuidasi terjadi saat posisi kamu terpaksa ditutup karena nggak cukup margin menahan harga.",
      ),
      c(
        "u19l3b7",
        "Cara pakai peta likuidasi yang waras itu gimana?",
        [
          "Dipakai buat konteks dan kewaspadaan, bukan tombol nekat",
          "Dipakai sebagai satu-satunya alasan buka posisi besar",
          "Dipakai buat memastikan harga pasti bakal bergerak ke area itu",
          "Dipakai buat menghitung keuntungan tanpa risiko",
        ],
        "Peta likuidasi cuma buat konteks, jadi jangan jadikan satu-satunya alasan buka posisi nekat.",
      ),
  ],
  // ------------------------------------------------------------------ u19-l4
  "u19-l4": [
      c(
        "u19l4b1",
        "Kamu market buy koin sepi dalam jumlah gede. Apa yang kemungkinan terjadi?",
        [
          "Bot sandwich nyerobot antrian, harga isian jadi lebih mahal",
          "Harga otomatis jadi jauh lebih murah karena pembelian besar",
          "Bot nggak bisa melihat transaksi di mempool",
          "Transaksimu pasti gagal dan gas kembali penuh",
        ],
        "Market buy besar di koin sepi itu umpan sandwich, karena bot bisa nyerobot antrian dan bikin harga isian kamu mahal.",
      ),
      tf(
        "u19l4b2",
        "Batas slippage yang ketat di aset likuid membantu kamu mengurangi kerugian akibat sandwich.",
        true,
        "Dengan batas yang ketat, harga maksimal yang mau kamu bayar terbatas, jadi bot nggak bisa menggeser harga terlalu jauh.",
      ),
      c(
        "u19l4b3",
        "Kenapa serangan sandwich disebut pajak tersembunyi?",
        [
          "Karena selisih harga yang kamu bayar masuk ke kantong bot",
          "Karena ada pajak resmi dari jaringan di tiap transaksi",
          "Karena kamu harus bayar denda ke marketplace",
          "Karena bot mengembalikan selisihnya setelah transaksi selesai",
        ],
        "Selisih harga yang kamu tanggung tanpa sadar itu yang masuk ke bot, jadi rasanya seperti pajak tersembunyi.",
      ),
      tf(
        "u19l4b4",
        "Serangan sandwich sama beratnya di semua jaringan, jadi pindah ke L2 nggak ada bedanya.",
        false,
        "Di beberapa L2 pengaruhnya lebih ringan, jadi memilih jaringan yang tepat bisa mengurangi risiko sandwich.",
      ),
      c(
        "u19l4b5",
        "Apa yang bisa kamu lakukan buat meminimalkan risiko sandwich di aset berlikuiditas tinggi?",
        [
          "Pakai limit order dan batas slippage ketat",
          "Pakai slippage 15 persen biar transaksi selalu berhasil",
          "Beli dalam jumlah sebesar mungkin supaya cepat selesai",
          "Matikan fitur estimasi gas di wallet kamu",
        ],
        "Limit order plus slippage ketat bikin harga maksimalmu terjaga, jadi bot nggak bisa menggeser harga terlalu jauh.",
      ),
      blank(
        "u19l4b6",
        "Robot yang nyerobot antrian transaksi kamu dikenal dengan istilah serangan ___.",
        [
          "sandwich",
          "phishing",
          "slippage",
          "airdrop",
        ],
        "Namanya sandwich karena transaksi kamu diapit dua transaksi bot, beli di depan dan jual di belakang.",
      ),
      c(
        "u19l4b7",
        "Kamu ngerasa selalu kalah padahal chart nggak gerak-gerak amat. Kemungkinan lain?",
        [
          "Kamu kalah di antrian mempool, bukan di chart",
          "Kamu salah membaca warna candle di chart itu",
          "Chart selalu bohong ke semua orang juga",
          "Wallet kamu nggak terhubung ke internet sama sekali",
        ],
        "Selain pergerakan pasar, kamu juga bisa kalah di antrian mempool karena bot MEV menyisipkan transaksinya.",
      ),
  ],
  // ------------------------------------------------------------------ u19-l5
  "u19-l5": [
      c(
        "u19l5b1",
        "Kamu mau kirim dana gede ke nama justin_eth. Langkah paling aman?",
        [
          "Cek alamatnya di app resmi ENS atau explorer dulu",
          "Kirim langsung saja karena nama itu gampang diingat",
          "Ketik ulang nama yang sama biar makin yakin benar",
          "Tanya di grup Telegram apakah nama itu memang benar",
        ],
        "Resolusi nama bisa diubah pemiliknya, jadi sebelum kirim gede kamu harus cek alamat aslinya di app resmi atau explorer.",
      ),
      tf(
        "u19l5b2",
        "Nama .eth yang cantik itu jaminan pemiliknya orang baik dan alamatnya nggak pernah berubah.",
        false,
        "Nama cuma stiker, karena pemiliknya bisa mengganti alamat resolusi kapan saja dan kamu nggak tahu niatnya.",
      ),
      c(
        "u19l5b3",
        "Kenapa mengetik sendiri nama ENS lebih aman daripada copas dari DM?",
        [
          "Karena copas dari DM rawan nama palsu atau huruf mirip",
          "Karena nama yang diketik selalu jauh lebih pendek",
          "Karena aplikasi DM nggak bisa menampilkan teks sama sekali",
          "Karena app resmi menolak semua nama yang dari DM",
        ],
        "Nama dari DM bisa palsu atau pakai huruf mirip, jadi mengetik sendiri mengurangi risiko salah kirim.",
      ),
      tf(
        "u19l5b4",
        "Nama .eth yang masa sewanya habis bisa diambil orang lain, jadi jangan anggap selamanya.",
        true,
        "Saat sewa habis, nama itu bisa diklaim ulang siapa pun, sehingga alamat tujuan bisa berpindah tangan.",
      ),
      c(
        "u19l5b5",
        "Ada risiko homograph di nama ENS. Maksudnya apa?",
        [
          "Ada nama dengan huruf mirip buat menipu mata",
          "Ada nama yang bisa otomatis berubah jadi emoji",
          "Ada nama yang cuma bisa dipakai selama satu hari",
          "Ada nama yang harus dibayar memakai dolar",
        ],
        "Homograph memakai huruf yang mirip supaya kamu salah baca, jadi nama terlihat sama padahal alamatnya beda.",
      ),
      c(
        "u19l5b6",
        "Kenapa handle sosial seperti Lens atau Farcaster bukan kustodian danamu?",
        [
          "Karena itu cuma identitas, bukan tempat menyimpan duitmu",
          "Karena handle sosial dilarang menyentuh urusan kripto",
          "Karena handle sosial selalu anonim dan nggak terverifikasi",
          "Karena handle sosial cuma bisa dipakai di satu aplikasi",
        ],
        "Handle sosial cuma identitas online, jadi bukan tempat menyimpan dana dan bukan pengganti wallet kamu.",
      ),
      blank(
        "u19l5b7",
        "Sebelum kirim jumlah gede ke sebuah nama .eth, pastikan alamat yang di-___ sudah benar.",
        [
        "resolve",
        "reset",
        "restore",
        "reboot",
        ],
        "Resolusi itulah yang menghubungkan nama ke alamat asli, jadi harus kamu cek dulu sebelum transfer.",
      ),
  ],
  // ------------------------------------------------------------------ u20-l1
  "u20-l1": [
      c(
        "u20l1b1",
        "Kamu lihat temanmu dapat sekitar $1.300 sebulan dari LP dengan modal yang dia tahan. Pelajaran paling waras dari cerita itu apa?",
        [
          "Ada pintu cuan selain tebak harga, asal modalnya kamu tahan",
          "LP selalu untung, jadi semua orang wajib ikut biar cepat kaya",
          "Dia pasti menipu, karena LP nggak mungkin bayar sebesar itu",
          "Cuan terbesar cuma datang dari trading futures yang agresif",
        ],
        "Duit di web3 bisa datang dari beberapa pintu, dan LP yang waras cuma salah satunya asal modalnya kamu tahan.",
      ),
      tf(
        "u20l1b2",
        "Duit beneran di web3 lebih banyak datang dari skill nyata seperti ngoding, desain, atau nulis, bukan cuma tebak harga.",
        true,
        "Penghasilan yang bertahan biasanya lahir dari skill nyata yang bisa dipakai orang lain, bukan dari tebak-tebakan harga semata.",
      ),
      tf(
        "u20l1b3",
        "Trading tanpa edge adalah cara paling aman buat menambah penghasilan di web3.",
        false,
        "Trading tanpa edge itu ibaratnya donasi ke orang yang punya edge, jadi justru bikin kamu kehilangan uang.",
      ),
      blank(
        "u20l1b4",
        "Bunga di DeFi yang waras datang dari peminjam atau ___.",
        [
        "fee",
        "banner",
        "like",
        "follower",
        ],
        "Bunga di DeFi yang masuk akal berasal dari peminjam atau fee transaksi, bukan dari angka banner yang bombastis.",
      ),
      c(
        "u20l1b5",
        "Kamu punya skill nulis. Pintu penghasilan web3 mana yang paling cocok buat kamu?",
        [
          "Nulis konten atau bantu komunitas lalu dibayar lewat bounty",
          "Pinjam uang buat futures biar cepat kaya tanpa kerja apa pun",
          "Ikut banner yang janji untung 4.000% tiap bulan tanpa risiko",
          "Tebak harga koin tiap hari tanpa strategi sama sekali",
        ],
        "Skill nyata seperti nulis bisa diubah jadi penghasilan lewat bounty atau konten, bukan lewat tebak harga tanpa dasar.",
      ),
      c(
        "u20l1b6",
        "Kamu lihat banner DeFi yang janji bunga 4.000%. Sikap paling waras itu apa?",
        [
          "Curiga, karena bunga waras datang dari peminjam atau fee",
          "Langsung all-in karena angka bunganya besar dan bikin tergiur",
          "Pinjam uang buat ikut biar dapat keuntungan lebih banyak lagi",
          "Percaya karena angka besar pasti benar dan tidak mungkin bohong",
        ],
        "Angka bunga yang nggak masuk akal biasanya tanda bahaya, sebab bunga waras punya sumber yang jelas dari peminjam atau fee.",
      ),
      c(
        "u20l1b7",
        "Kamu mau mulai di web3 tapi cuma punya HP dan waktu luang. Langkah paling masuk akal apa?",
        [
          "Latih satu skill nyata lalu cari bounty atau kontribusi komunitas",
          "Fokus hafal nama koin biar bisa tebak harga tiap hari dengan jitu",
          "Bayar dulu ke orang yang janji memberi kontrak kerja buat kamu",
          "Tunggu airdrop besar datang sendiri tiap hari tanpa usaha apa pun",
        ],
        "Pintu paling aman buat pemula adalah membangun skill nyata lalu menawarkannya lewat bounty atau kontribusi komunitas.",
      ),
  ],
  // ------------------------------------------------------------------ u20-l2
  "u20-l2": [
      c(
        "u20l2b1",
        "Kamu punya utang $630 buat spekulasi, tapi masih ada gaji dan portofolio bisa jadi nol. Kenapa itu masih punya nyawa cadangan?",
        [
          "Karena masih ada gaji yang bisa dipakai nyicil kalau portofolio hangus",
          "Karena utang buat spekulasi selalu menghasilkan untung besar tiap waktu",
          "Karena angka $630 itu terlalu kecil buat dihitung serius",
          "Karena portofolio nggak mungkin pernah nol dalam situasi apa pun",
        ],
        "Selama masih ada gaji yang bisa dipakai nyicil, hidup tetap jalan walaupun portofolio spekulasinya hangus.",
      ),
      tf(
        "u20l2b2",
        "Leverage itu utang tersembunyi, meskipun kamu nggak pinjam ke rentenir.",
        true,
        "Leverage sebenarnya pinjaman, cuma yang menagih bukan rentenir melainkan mesin likuidasi.",
      ),
      tf(
        "u20l2b3",
        "Uang sewa rumah dan biaya makan aman dipakai jadi margin trading.",
        false,
        "Uang sewa dan makan bukan margin, sebab itu kebutuhan hidup yang nggak boleh dipakai buat spekulasi.",
      ),
      blank(
        "u20l2b4",
        "Jumlah uang yang kamu ikhlas lihat jadi nol disebut modal ___.",
        [
        "spekulasi",
        "utama",
        "dapur",
        "pinjaman",
        ],
        "Modal spekulasi adalah jumlah uang yang kamu ikhlas kalau hangus, jadi hidup tetap bisa jalan.",
      ),
      c(
        "u20l2b5",
        "Sebelum pakai uang buat main kripto, batas paling penting apa?",
        [
        "Kalau uangnya hangus, hidup kamu tetap bisa jalan",
        "Kalau uangnya hangus, kamu harus pinjam lagi buat makan",
        "Harus semua tabungan biar untungnya maksimal",
        "Harus uang sewa biar terasa mendesak",
        ],
        "Batasnya jelas, kalau uang itu hangus hidup kamu tetap jalan, jadi kamu nggak roboh karena satu posisi.",
      ),
      c(
        "u20l2b6",
        "Temanmu nggak punya gaji tapi pakai full portofolio buat spekulasi sampai hilang. Pelajarannya apa?",
        [
          "Modal spekulasi harus duit yang hangus pun hidup tetap jalan",
          "Full portofolio itu cara paling tercepat buat belajar pasar nyata",
          "Tanpa gaji justru makin berani, itu menurutnya sangat bagus",
          "Pinjam uang lagi biar bisa balas dendam ke pasar besok",
        ],
        "Kasus itu menunjukkan modal spekulasi harus uang yang kalau hangus pun hidup tetap bisa berjalan.",
      ),
      c(
        "u20l2b7",
        "Dari daftar ini, mana yang pantas jadi modal spekulasi?",
        [
          "Sisa uang setelah sewa, makan, dan cicilan aman",
          "Uang sewa rumah bulan depan yang belum dibayar ke pemiliknya",
          "Uang kuliah yang belum kamu bayar ke kampus",
          "Uang pinjaman yang tadinya buat beli beras",
        ],
        "Yang pantas cuma sisa uang setelah kebutuhan aman, sebab uang sewa, kuliah, atau beras bukan buat spekulasi.",
      ),
  ],
  // ------------------------------------------------------------------ u20-l3
  "u20-l3": [
      c(
        "u20l3b1",
        "Kamu lihat screenshot teman untung besar terus di linimasa. Apa yang sering nggak kelihatan?",
        [
          "Kerugian dan posisi merah yang jarang dipamerkan di linimasa",
          "Nggak ada apa-apa, karena linimasa selalu jujur apa adanya",
          "Cuma pajak keuntungan yang nggak kelihatan di dalam foto",
          "Cuma biaya internet yang nggak pernah ikut dihitung sama sekali",
        ],
        "Yang rugi jarang memamerkan hasilnya, jadi linimasa kelihatan seolah semua orang selalu untung.",
      ),
      tf(
        "u20l3b2",
        "Hijau tanpa rencana keluar itu cuma kertas, karena belum tentu bisa kamu nikmati.",
        true,
        "Keuntungan yang belum diamankan dengan rencana keluar masih berupa kertas yang bisa hilang lagi.",
      ),
      tf(
        "u20l3b3",
        "Copy ukuran posisi paus itu cara aman biar hasilnya sama.",
        false,
        "Meniru ukuran paus tanpa modal dan mental yang sama cuma jadi film pendek, bukan jaminan hasil serupa.",
      ),
      blank(
        "u20l3b4",
        "Merah tanpa journal artinya bakal ___ lagi.",
        [
        "diulang",
        "dilupakan",
        "dihapus",
        "dibagi",
        ],
        "Tanpa journal, kesalahan yang sama bakal diulang karena kamu nggak belajar dari posisi merah itu.",
      ),
      c(
        "u20l3b5",
        "Ada kasus langka US$17 jadi US$3 juta. Kenapa itu bukan template buat all-in?",
        [
        "Karena itu kasus langka, bukan ukuran yang bisa kamu andalkan",
        "Karena semua orang bisa mengulanginya dengan modal kecil",
        "Karena angka itu pasti salah ketik",
        "Karena modal kecil selalu menang di pasar",
        ],
        "Itu kasus langka yang jarang terjadi, jadi bukan ukuran yang bisa kamu jadikan alasan buat all-in.",
      ),
      c(
        "u20l3b6",
        "Kamu lihat heatmap likuidasi US$1 juta. Pelajaran paling pentingnya apa?",
        [
          "Ukuran posisi yang kamu pilih menentukan apakah kamu tahan atau tersapu",
          "Semua orang pasti untung asal ikut arus pasar yang ramai itu saja selalu",
          "Likuidasi cuma hoaks yang sengaja bikin orang panik belaka",
          "Makin besar posisi yang dibuka makin aman katanya selalu",
        ],
        "Heatmap likuidasi mengingatkan bahwa ukuran posisi menentukan apakah kamu tahan atau justru tersapu.",
      ),
      c(
        "u20l3b7",
        "Kamu baru cuan besar tapi belum punya rencana keluar. Risikonya apa?",
        [
          "Keuntungan itu masih kertas dan bisa hilang sebelum kamu amankan",
          "Nggak ada risiko karena cuan sudah masuk ke akun kamu sendiri kok",
          "Risikonya cuma pajak naik sedikit di tahun depan nanti",
          "Risikonya cuma teman yang minta kamu traktir makan malam",
        ],
        "Tanpa rencana keluar, keuntungan masih berupa kertas yang bisa hilang sebelum sempat kamu amankan.",
      ),
  ],
  // ------------------------------------------------------------------ u20-l4
  "u20-l4": [
      c(
        "u20l4b1",
        "Kamu baru kelar semua rute web3min. Apa yang sebaiknya kamu lakukan?",
        [
          "Terus jaga kebiasaan aman, bukan langsung all-in seperti wisuda",
          "Langsung all-in karena udah lulus dan paham semua materi yang diajarkan",
          "Berhenti belajar karena semua materi sudah selesai dipelajari",
          "Ikut semua banner yang menjanjikan cuan besar tiap hari",
        ],
        "Lulus rute artinya kamu siap mengambil keputusan lebih hati-hati, bukan saatnya all-in seperti wisuda.",
      ),
      tf(
        "u20l4b2",
        "web3min cuma panduan belajar, dan kendali penuh tetap ada di tangan kamu sendiri.",
        true,
        "web3min cuma panduan belajar, jadi kendali penuh atas dompet dan keputusan tetap ada di tanganmu.",
      ),
      tf(
        "u20l4b3",
        "Selesai belajar web3min artinya kamu dijamin untung kalau ikut sinyal orang lain.",
        false,
        "web3min nggak menjamin untung, jadi ikut sinyal orang lain tetap bukan jaminan kamu bakal cuan.",
      ),
      blank(
        "u20l4b4",
        "Kalau sudah lama nggak sentuh seed, sebaiknya ulang rute ___ dan 6.",
        [
        "2",
        "3",
        "7",
        "9",
        ],
        "Materi menyarankan mengulang rute 2 dan 6 kalau kamu sudah lama nggak menyentuh seed wallet.",
      ),
      c(
        "u20l4b5",
        "Kamu lama nggak buka wallet. Kebiasaan apa yang disarankan buat dijaga?",
        [
        "Ulang rute 2 dan 6, revoke izin, dan update 2FA",
        "Hapus semua wallet biar aman",
        "Kirim semua aset ke satu akun baru tanpa cek",
        "Abaikan karena izin lama otomatis hilang",
        ],
        "Kebiasaan yang dijaga itu mengulang rute 2 dan 6, revoke izin, dan memperbarui 2FA secara rutin.",
      ),
      c(
        "u20l4b6",
        "Ada janji cuan yang nggak masuk akal di grup. Sikapmu apa?",
        [
          "Waspada dan jangan langsung percaya janji cuan yang nggak masuk akal",
          "Ikut cepat saja karena yang berani biasanya dapat lebih banyak rezeki",
          "Percaya karena yang janji pasti bertanggung jawab katanya",
          "Tanya cara transfer dana ke admin biar bisa ikut cepat",
        ],
        "Janji cuan yang nggak masuk akal harus dicurigai, jadi jangan langsung percaya atau ikut menaruh dana.",
      ),
      c(
        "u20l4b7",
        "Prinsip penutup web3min soal kendali itu apa?",
        [
        "Peta di saku, tangan di rem, keputusan tetap milik kamu",
        "Mesin yang menentukan semuanya, kamu cuma penumpang",
        "Guru yang pegang kendali penuh atas dompetmu",
        "Pasar yang selalu memberi hasil pasti",
        ],
        "Prinsipnya peta di saku dan tangan di rem, artinya kamu yang memegang kendali atas keputusanmu sendiri.",
      ),
  ],
  // ------------------------------------------------------------------ u20-l5
  "u20-l5": [
      c(
        "u20l5b1",
        "Kamu bantu jawab orang baru di Discord seminggu, lalu moderator menawarkan trial. Kenapa itu jalur kerja yang waras?",
        [
        "Karena kontribusi publik bikin orang lihat skill dan sikapmu",
        "Karena moderator punya kewajiban memberi gaji bulanan",
        "Karena masuk Discord otomatis bikin kamu karyawan tetap",
        "Karena trial selalu dibayar penuh sejak hari pertama",
        ],
        "Kontribusi yang bisa dilihat publik jadi bukti nyata soal skill dan sikapmu, sehingga peluang direkrut lebih masuk akal.",
      ),
      tf(
        "u20l5b2",
        "Proyek web3 sering butuh kontributor buat jaga Discord, nulis docs, desain, kode, riset, atau support.",
        true,
        "Banyak proyek butuh tangan untuk berbagai peran nyata seperti komunitas, dokumen, desain, kode, riset, dan support.",
      ),
      tf(
        "u20l5b3",
        "Tawaran kerja web3 yang minta kamu transfer dana di awal itu wajar sebagai biaya kontrak.",
        false,
        "Permintaan deposit di awal adalah modus penipuan, sebab kerja yang beneran nggak minta kamu transfer dulu.",
      ),
      blank(
        "u20l5b4",
        "Upah yang dibayar per pekerjaan selesai, bukan tiap bulan, disebut ___.",
        [
          "bounty",
          "gajian",
          "upahnya",
          "honornya",
        ],
        "Bounty dibayar per kerjaan yang selesai, berbeda dengan gaji bulanan yang tetap dan rutin.",
      ),
      c(
        "u20l5b5",
        "Kamu mau bikin jejak biar dilirik proyek web3. Cara paling waras apa?",
        [
          "Bangun portofolio, ikut kontribusi publik, hackathon, atau bounty",
          "Kirim deposit ke banyak proyek biar dianggap serius dan siap kerja",
          "Klaim punya pengalaman padahal belum pernah kerja sama sekali",
          "Beli token proyek lalu berharap langsung direkrut jadi anggota",
        ],
        "Portofolio, kontribusi publik, hackathon, dan bounty memperlihatkan kemampuan asli, bukan sekadar klaim kosong.",
      ),
      c(
        "u20l5b6",
        "Bounty dan grant itu model bayarnya gimana?",
        [
          "Bayar per kerjaan yang selesai, jadi baca aturannya dulu",
          "Gaji bulanan tetap seperti karyawan kantor pada umumnya",
          "Bayaran cuma buat yang punya token paling banyak di proyek",
          "Selalu dibayar di muka sebelum kerja sama dijalankan",
        ],
        "Bounty dan grant membayar per kerjaan yang selesai, jadi kamu perlu membaca aturannya supaya paham syaratnya.",
      ),
      c(
        "u20l5b7",
        "Remote global di web3 itu nyata. Tapi apa yang tetap kamu butuh?",
        [
          "Skill nyata, dan bahasa Inggris cuma ngebantu bukan syarat sulap",
          "Cuma koneksi internet cepat tanpa skill apa pun juga yang jelas dimiliki",
          "Deposit dana ke admin biar akun kerja kamu cepat kebuka",
          "Teman di dalam proyek yang bisa titip nama kamu ke tim",
        ],
        "Kerja remote global tetap butuh skill nyata, sedangkan bahasa Inggris hanya membantu dan bukan syarat yang menyulap.",
      ),
  ],
  // ------------------------------------------------------------------ u20-l6
  "u20-l6": [
      c(
        "u20l6b1",
        "Kamu baru masuk komunitas DAO. Tiga hal yang jadi mesin utama DAO itu apa?",
        [
        "Proposal, voting, dan kas yang bisa dilihat",
        "HR, gaji tanggal 25, dan absensi kantor",
        "CEO, saham, dan laporan kuartal",
        "KTP, CV, dan wawancara kerja",
        ],
        "DAO digerakkan oleh proposal sebagai usul, voting sebagai suara, dan kas yang dananya bisa dilihat bersama.",
      ),
      tf(
        "u20l6b2",
        "Di DAO, whale bisa punya suara lebih besar karena jumlah token memengaruhi kekuatan voting.",
        true,
        "Kekuatan voting biasanya mengikuti jumlah token, jadi pemegang token besar seperti whale punya suara lebih berat.",
      ),
      tf(
        "u20l6b3",
        "Pegang token governance DAO berarti kamu otomatis dapat gaji tiap bulan.",
        false,
        "Token governance bukan otomatis gaji, sebab bayaran kontributor tergantung keputusan dan kas DAO.",
      ),
      match(
        "u20l6b4",
        "Pasangkan istilah DAO dengan artinya.",
        [
          { left: "proposal", right: "usul yang diajukan ke komunitas" },
          { left: "vote", right: "suara buat menerima atau menolak" },
          { left: "kas", right: "dana yang dipakai buat kerjaan" },
        ],
        "Proposal itu usul, vote itu suara, dan kas itu dana, dan tiga hal ini yang menggerakkan sebuah DAO.",
      ),
      c(
        "u20l6b5",
        "Kamu lihat tawaran jadi anggota dewan DAO asal bayar 1 ETH ke admin. Sikap paling masuk akal apa?",
        [
          "Tolak, karena masuk DAO itu lewat suara dan kas, bukan bayar admin",
          "Bayar dulu ke admin biar cepat punya jabatan di dewan DAO",
          "Ikut karena makin mahal berarti makin prestisius katanya juga di mata orang",
          "Ajak teman ikut biar biaya masuknya bisa dibagi patungan",
        ],
        "Keanggotaan DAO ditentukan lewat suara dan kas yang transparan, bukan dengan menyetor uang ke admin pribadi.",
      ),
      c(
        "u20l6b6",
        "Kamu baru gabung Discord sebuah DAO. Apa yang sebaiknya kamu cari tahu dulu?",
        [
          "Siapa yang bayar dan dari kas mana dananya keluar",
          "Berapa banyak PFP mahal yang kamu punya di wallet",
          "Apakah adminnya ramah kalau kamu chat lewat DM",
          "Seberapa sering harga tokennya naik turun tiap hari",
        ],
        "Penting tahu siapa yang membayar dan dari kas mana dananya, supaya kamu paham alur uang di DAO itu.",
      ),
      c(
        "u20l6b7",
        "Identitas on-chain seperti ENS atau PFP itu fungsinya apa?",
        [
          "Nama atau identitas di rantai, bukan KTP atau CV otomatis",
          "Dokumen resmi negara yang sah dipakai seperti KTP asli",
          "Jaminan otomatis kamu langsung diterima kerja di mana saja",
          "Bukti resmi kamu punya gaji tetap tiap bulan penuh",
        ],
        "ENS dan PFP cuma nama atau identitas di rantai, dan itu bukan KTP resmi maupun CV yang menjamin kerja.",
      ),
  ],
  // ------------------------------------------------------------------ u20-l7
  "u20-l7": [
      c(
        "u20l7b1",
        "Kamu taruh dana di protokol yang kontraknya belum diverifikasi di explorer. Kenapa itu bahaya?",
        [
          "Kamu nggak bisa baca kodenya, jadi ibaratnya buta soal isinya",
          "Kodenya otomatis jadi lebih cepat dan lebih murah katanya",
          "Audit keamanan otomatis dijalankan oleh explorer resmi itu setiap saat",
          "Dana yang kamu taruh otomatis diasuransikan penuh olehnya",
        ],
        "Kode yang belum diverifikasi bikin kamu nggak bisa membacanya, jadi kamu buta soal apa yang sebenarnya dilakukan.",
      ),
      tf(
        "u20l7b2",
        "Proxy atau kontrak upgradeable berarti admin masih punya tombol buat ganti aturan logikanya.",
        true,
        "Kontrak upgradeable memang nyaman buat tim, tapi artinya masih ada admin yang bisa mengganti logikanya.",
      ),
      tf(
        "u20l7b3",
        "Audit smart contract itu jaminan kode bebas dari bug selamanya.",
        false,
        "Audit cuma laporan orang pinter yang mencari lubang, bukan asuransi atau jaminan kode bebas bug selamanya.",
      ),
      match(
        "u20l7b4",
        "Pasangkan istilah kontrak dengan artinya.",
        [
          { left: "audit", right: "orang pinter cari lubang lalu kasih PDF" },
          { left: "bug bounty", right: "hadiah kalau kamu lapor lubang" },
          { left: "verified source", right: "kode bisa dibaca di explorer" },
        ],
        "Audit itu laporan mencari lubang, bug bounty itu hadiah buat pelapor lubang, dan verified source artinya kode bisa dibaca.",
      ),
      c(
        "u20l7b5",
        "Kamu lihat PDF audit 40 halaman, tapi kontrak yang live itu proxy baru dengan admin di EOA. Masalahnya apa?",
        [
          "Audit itu nutup kode lama, sedangkan kode baru belum diaudit",
          "Audit selalu mencakup semua kode baru secara otomatis tanpa terkecuali",
          "Admin EOA bikin kontrak nggak bisa diubah selamanya",
          "Proxy artinya kode nggak bisa diganti oleh siapa pun",
        ],
        "Audit lama cuma mengulas kode lama, sementara proxy baru dengan admin di EOA itu belum tercakup.",
      ),
      c(
        "u20l7b6",
        "Kamu bukan auditor, tapi tetap bisa bertanya. Pertanyaan mana yang paling berguna sebelum naruh dana?",
        [
          "Siapa adminnya, bisa pause, bisa mint, dan oracle dari mana",
          "Berapa banyak follower akun Twitter resmi milik proyeknya itu",
          "Apakah websitenya punya warna dan tampilan yang bagus",
          "Berapa lama biasanya timnya jawab pesan lewat DM",
        ],
        "Pertanyaan soal admin, izin pause, izin mint, dan sumber oracle itu inti yang bisa diperiksa orang awam.",
      ),
      c(
        "u20l7b7",
        "Tim anon, kontrak upgradeable, dan LTV gila. Kombinasi itu artinya apa?",
        [
        "Tiga bendera merah yang bikin kamu lebih hati-hati",
        "Tiga tanda protokol pasti aman",
        "Tiga hal yang nggak berhubungan dengan risiko",
        "Tiga syarat wajib biar cepat kaya",
        ],
        "Tim anon, kontrak upgradeable, dan LTV gila itu tiga bendera merah yang minta kamu lebih berhati-hati.",
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
