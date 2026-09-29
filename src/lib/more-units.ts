import type { Unit } from "@/lib/curriculum";
import { c, tf, blank, match, order, tip, L } from "@/lib/curriculum";

const j = c;
const M = tf;
const N = blank;
const F = order;
const P = match;
const I = tip;

export const MORE_UNITS: Unit[] = [
  {
    id: "u7",
    index: 7,
    title: "Cuan vs hangus",
    subtitle: "Dari X beneran, bukan dongeng grup",
    color: "gold",
    lessons: [
      L("u7", "u7-l1", "lesson", "Dua sisi PnL", "Bisa segini. Bisa ilang segini.", "coins", [
        tip("u7l1t", "Screenshot hijau bukan jaminan hidup.", "Di X orang pamer PnL (untung-rugi) hijau. Yang hangus? Jarang dipost. Dua-duanya nyata, kok. Aku kumpulin cuplikannya biar kamu nggak cuma dikasih mimpi.", {
          points: [
            "PnL kertas (unrealized) bisa nyusut sebelum sempat kamu cairin, bahkan bisa roundtrip (untung yang balik jadi nol).",
            "Paus bisa plus puluhan juta, trus minus puluhan juta, di minggu yang sama.",
            "Rp 20 miliar dalam 4 bulan memecoin itu ada. −US$33 juta satu short juga ada.",
          ],
          example: "Ada orang Indo pamer kalender PnL hijau. Ada whale Hyperliquid hangus US$33 juta. Dua screenshot, satu timeline.",
          remember: "Liat dua sisi dulu, baru gas.",
          proofs: ["cuan-20m", "rugi-33m", "cuan-argus", "rugi-machi"],
        }),
        j("u7l1q1","PnL hijau yang dipamerkan di X artinya apa?",[
          "Bisa nyata, bukan jaminan",
          "Kamu pasti kaya kalau ikut",
          "Untungnya pasti udah dicairkan",
          "Posisinya nggak mungkin rugi",
        ],0,"Screenshot cuma nunjukin hasil orang lain. Modal, waktu masuk, dan risikonya beda sama kamu."),
        M("u7l1q2","Unrealized profit masih berupa angka di layar dan bisa hilang kalau harga berbalik.",true,"Benar. Namanya unrealized karena belum dijual. Baru jadi milikmu setelah realized."),
        j("u7l1q3","Kenapa web3min nunjukin cerita rugi juga, bukan cuma yang cuan?",[
          "Biar kamu lihat dua sisinya dulu",
          "Biar kamu takut dan berhenti belajar",
          "Biar kamu pindah ke broker tertentu",
          "Biar kamu cepat lompat ke rute terakhir",
        ],0,"Kalau cuma lihat yang cuan, kamu gampang kena umpan. Cerita rugi nunjukin risikonya nyata."),
        N("u7l1q4","Untung yang belum dijual disebut ___ profit.",[
          "unrealized",
          "profitable",
          "temporary",
          "realized",
        ],0,"Unrealized = untung di atas kertas. Masih bisa berubah kapan aja."),
      ]),
      L("u7", "u7-l2", "lesson", "Realized vs kertas", "Yang di rekening, yang di layar.", "bank", [
        tip("u7l2t", "Kertas vs uang.", "Realized = udah jual, udah jadi saldo. Unrealized = angka yang masih nempel di posisi. Sebenarnya banyak klaim untung di medsos yang baru sebatas angka di atas kertas. Baca captionnya, ya.", {
          points: [
            "Belum jual? Itu harapan, bukan gaji.",
            "Likuiditas memecoin sering nggak cukup buat semua orang keluar di puncak.",
            "Yang pamer realized lebih jarang. Soalnya lebih susah.",
          ],
          example: "Paus plus $6.6 juta di layar, trus buka long $87 juta. Satu gerak salah, angkanya nyusut.",
          remember: "Belum jual = belum punya.",
          proofs: ["cuan-300k", "cuan-whale", "rugi-paper", "cuan-421k"],
        }),
        M("u7l2q1","Realized artinya untungnya udah dikunci jadi saldo.",true,"Benar. Asetnya udah dijual dan hasilnya udah jadi saldo."),
        j("u7l2q2","Apakah semua pemegang memecoin bisa jual di harga puncak (ATH)?",[
          "Nggak, pembeli puncak terbatas",
          "Ya, bursa wajib menampung semua",
          "Ya, asal jualnya bareng-bareng",
          "Ya, kalau pakai aplikasi resmi",
        ],0,"Uang pembeli yang tersedia terbatas. Kalau banyak yang jual bareng, harga langsung turun."),
        j("u7l2q3","Angka hijau besar di dashboard futures itu apa?",["Bisa hilang sebelum ditarik","Udah otomatis masuk rekening bank","Udah pasti aman dari likuidasi","Udah dipotong pajak, tinggal cair"],0,"Selama posisi masih terbuka, angka itu bisa berubah atau hilang kalau harga berbalik."),
      ]),
      L("u7", "u7-l3", "lesson", "Jual terlalu cepat", "Takut vs serakah.", "siren", [
        tip("u7l3t", "Dua cara hangus tanpa kena hack.", "Ada yang jual 2 menit, dapet $286, tokennya nanti $193 juta. Ada juga yang memaksakan hold padahal posisi beli awalnya buruk. Manajemen posisi dan disiplin rencana jauh lebih penting.", {
          points: [
            "Take profit bertahap lebih waras. All-in hold atau all-in jual? Gila.",
            "Harga naik nggak otomatis bikin kamu plus, kalo rata beli jelek.",
            "FOMO ngejar yang udah 10x? Sering jadi umpan exit buat yang awal.",
          ],
          example: "PNUT deployer jual 2 menit: $286. ATH (harga tertinggi sepanjang masa)-nya kemudian $193 juta. Pelajarannya bukan harus hold buta, melainkan soal ukuran posisi dan rencana yang terukur.",
          remember: "Rencana keluar dulu, baru masuk.",
          proofs: ["fumble-193m", "rugi-entry", "cuan-zec-120k", "rugi-cut2"],
        }),
        j("u7l3q1","Kamu jual, lalu 2 menit kemudian harganya meledak. Pelajarannya apa?",[
          "Rencana keluar tetap penting",
          "Harusnya nggak pernah jual sama sekali",
          "Ambil untung itu keputusan bodoh",
          "Harga puncak pasti bakal terulang",
        ],0,"Nggak ada yang bisa nebak puncak. Jual sesuai rencana tetap keputusan yang sah."),
        M("u7l3q2","Kalau harga naik dari harga belimu, kamu pasti untung.",false,"Salah. Kalau kamu nambah beli di harga tinggi, harga rata-ratamu ikut naik, jadi kamu bisa tetap rugi."),
        F("u7l3q3","Susun urutan yang benar sebelum trading:",["Bikin rencana","tentukan ukuran","baru masuk","dan tahu kapan keluar"],"Masuk tanpa rencana itu judi. Tentukan ukuran dan titik keluar sebelum beli."),
      ]),
      L("u7", "u7-chest", "chest", "Peti rute 7", "Nih, buat yang udah liat dua sisi.", "gift", [], { xp: 0, gems: 22 }),
      L("u7", "u7-l4", "lesson", "Jangan copy buta", "PnL orang bukan strategi kamu.", "userx", [
        tip("u7l4t", "Copytrade tanpa otak.", "Top 900 Hyperliquid dari HP itu ada, kok. Tapi kamu nggak liat modalnya, leverage-nya, malam insomnianya, atau yang hangus kemarin. Copy ukuran paus pake modal Rp 500 ribu? Itu resep hangus.", {
          points: [
            "Ukuran posisi paus bukan ukuran kamu.",
            "Yang kelihatan: yang hidup, yang posting. Survivor bias.",
            "Kalo orang jualan sinyal, tanya: dia makan dari trading atau dari subscriber?",
          ],
          example: "Paus buka long $87 juta. Likuidasi $63k. Kamu nggak punya bantal itu.",
          remember: "Copy ide, jangan copy ukuran.",
          proofs: ["cuan-hl", "rugi-personal", "cuan-1m-week", "cuan-pnut17"],
        }),
        c("u7l4q1", "Paus buka posisi raksasa. Kamu ngapain?", ["Abaikan ukurannya, cek dulu kamu paham risikonya nggak", "Ikut masuk dengan seluruh modal supaya tidak ketinggalan", "Meminjam uang dari keluarga untuk memperbesar posisi", "Bagikan seed phrase supaya posisimu bisa ikut disalin"], 0, "Ukuran paus bukan ukuran kamu."),
        tf("u7l4q2", "Yang posting PnL hijau pasti konsisten tiap bulan.", false, "Survivor bias. Yang merah jarang posting."),
        c("u7l4q3", "Bagaimana cara paling rasional menyikapi grup sinyal trading berbayar?", ["Hiburan, bukan jaminan", "Gaji tetap yang dibayarkan setiap bulan oleh adminnya", "Asuransi yang menanggung kerugian kalau sinyalnya salah", "Kewajiban pajak yang harus kamu bayarkan setiap tahun"], 0, "Banyak yang jualan harapan, sih."),
      ]),
      L("u7", "u7-cp", "checkpoint", "Ujian rute 7", "Hijau sama merah, dua-duanya ujian.", "flag", [
        tip("u7cpt", "Ulangan: cuan vs hangus", "Kalo lulus, kamu nggak gampang kena umpan screenshot.", {
          points: ["Unrealized ≠ gaji.", "Likuiditas terbatas.", "Copy ukuran paus = bahaya."],
          remember: "Dua sisi dulu, baru gas.",
        }),
        M("u7cp1","Melihat PnL hijau orang lain di media sosial bukan bukti strategi yang bisa kamu tiru.",true,"Benar. Yang merah jarang posting, dan kamu nggak tahu ukuran posisi serta risikonya."),
        j("u7cp2","Screenshot PnL di X paling tepat dibaca sebagai apa?",["Contoh, bukan janji","Sinyal yang wajib diikuti","Bukti kamu juga bakal kaya","Jaminan strategi pasti jalan"],0,"Itu cuma contoh satu hasil orang lain. Kondisimu berbeda."),
        N("u7cp3","Untung yang udah dijual disebut ___.",["realized","unrealized","floor","airdrop"],0,"Realized = untung yang udah dikunci karena asetnya sudah dijual."),
        j("u7cp4","Token meledak setelah kamu jual. Terus gimana?",["Bisa terjadi. Rencanamu tetap sah","Kamu gagal total","Harus beli lagi pakai semua modal","Berhenti belajar kripto"],0,"Wajar kalau kesel, tapi keputusan sesuai rencana tetap benar. Jangan kejar harga pakai emosi."),
      ]),
    ],
  },
  {
    id: "u8",
    index: 8,
    title: "Trading dasar",
    subtitle: "Spot dulu. Hindari leverage tinggi.",
    color: "blue",
    lessons: [
      L("u8", "u8-l1", "lesson", "Spot vs leverage", "Spot berarti kamu benar-benar memiliki asetnya, sedangkan perpetual futures adalah kontrak taruhan berleverage yang bisa membuatmu kehilangan seluruh margin. Kepemilikan dan utang adalah dua hal berbeda.", "swap", [
        tip("u8l1t", "Spot itu beli. Leverage itu utang.", "Spot: kamu punya aset. Turun 50%, aset masih ada. Leverage / futures: kamu pinjam daya. Turun sedikit saja posisimu bisa terlikuidasi dan saldo langsung habis. Banyak pemula ngira trading di aplikasi itu otomatis aman, padahal tanpa sadar yang dibuka kontrak futures berisiko tinggi.", {
          points: [
            "Spot = modal kamu yang jadi batas rugi.",
            "Leverage 10x: gerak 10% lawan arah bisa hapus posisi.",
            "Likuidasi bukan 'nanti balik'. Itu tutup paksa.",
          ],
          example: "Beli 0.01 BTC di Binance spot: punya. Buka long 10x di futures: pinjaman. Jangan ketuker cuma karena UI-nya mirip.",
          remember: "Belum lancar spot? Jangan pegang futures.",
        }),
        j("u8l1q1","Apa beda spot dan leverage?",["Spot: asetnya milikmu. Leverage: pakai pinjaman, bisa dilikuidasi","Keduanya sebenarnya sama saja, yang berbeda hanya menunya","Leverage lebih aman dipakai pemula karena modalnya kecil","Spot selalu memakai pinjaman sampai seratus kali lipat"],0,"Di spot kamu pegang asetnya. Di leverage sebagian modal adalah pinjaman, jadi posisi bisa ditutup paksa."),
        M("u8l1q2","Likuidasi menutup paksa posisimu, dan uangnya nggak kembali walau harga balik.",true,"Benar. Sistem menutup posisi paksa saat margin habis; harga balik pun, uangnya nggak kembali."),
        N("u8l1q3","Pakai dana pinjaman untuk memperbesar posisi disebut ___.",["leverage","staking","airdrop","spot"],0,"Leverage memperbesar untung dan rugi sekaligus."),
        j("u8l1q4","Pemula paling aman mulai dari mana?",["Spot dengan jumlah kecil","Futures 50x biar cepat","Pinjam uang teman","Ikuti posisi paus"],0,"Kalau salah di spot kecil, ruginya terbatas dan kamu tetap bisa belajar."),
      ]),
      L("u8", "u8-l2", "lesson", "Likuidasi", "Bukan 'nanti naik lagi'.", "siren", [
        tip("u8l2t", "Mesin yang nggak peduli perasaanmu.", "Exchange tutup posisi kamu saat margin habis. Funding, fee, slippage ikut makan. Whale bisa tahan drawdown. Kamu sering nggak.", {
          points: [
            "Isolated vs cross: cross bisa nyedot saldo lain.",
            "Stop loss bukan pengecut. Itu rem.",
            "HP + leverage + insom = kombinasi klasik hangus.",
          ],
          example: "Short ZEC paus hangus $33 juta di kertas. Kamu pake 20x di koin random hangus lebih cepet.",
          remember: "Rem dulu, baru gas.",
          proofs: ["rugi-33m", "rugi-personal", "rugi-liqs", "rugi-sp500"],
        }),
        M("u8l2q1","Stop loss itu rem yang membatasi rugi, dan trader profesional justru selalu pakainya.",true,"Benar. Stop loss membatasi rugi di angka yang kamu tentukan sendiri sebelum emosi ikut bicara."),
        j("u8l2q2","Cross margin artinya apa?",[
          "Seluruh saldo akun jadi jaminan, jadi bisa ikut tersedot",
          "Lebih aman daripada isolated karena risiko dibatasi otomatis",
          "Posisinya nggak bisa dilikuidasi walau pasar jatuh tajam",
          "Biaya trading jadi gratis untuk semua pasangan koin",
        ],0,"Di cross margin, satu posisi yang rugi bisa menyedot saldo lain di akunmu."),
        j("u8l2q3","Kapan posisi paling gampang kena likuidasi?",[
          "Saat ada berita mendadak dan leverage-nya besar",
          "Saat simpan spot jangka panjang di wallet dingin",
          "Saat kirim token ke wallet sendiri beda jaringan",
          "Saat ganti foto profil akun dan nama pengguna",
        ],0,"Harga yang loncat mendadak ditambah leverage besar bikin batas likuidasimu cepat tersentuh."),
      ]),
      L("u8", "u8-l3", "lesson", "Ukuran posisi", "Satu peluru per trade.", "flag", [
        tip("u8l3t", "Jangan all-in.", "Tentukan batas rugi maksimal per transaksi, misalnya 1-2% dari total modal. Kalau analisa meleset, kamu tetap bertahan. Memaksakan all-in hanya akan menghabiskan modalmu dalam sekejap.", {
          points: [
            "Risiko per ide, bukan 'feeling'.",
            "Naikin ukuran cuma setelah catatan (journal) bilang kamu mampu.",
            "Yang hangus $426 dalam sehari sering karena ukuran, bukan karena 'koinnya salah'.",
          ],
          example: "Modal Rp 2 juta, risiko 2% = Rp 40 ribu per ide. Bukan Rp 2 juta.",
          remember: "Hidup dulu, cuan belakangan.",
          proofs: ["rugi-personal", "cuan-indo-lev", "rugi-roundtrip"],
        }),
        j("u8l3q1","All-in di satu koin itu artinya apa?",[
          "Satu taruhan. Kalau salah, modal habis",
          "Strategi paling aman buat pemula yang baru masuk",
          "Cara wajib main memecoin biar cepat cuan",
          "Cara menurunkan risiko portofolio kamu",
        ],0,"Semua modal ada di satu taruhan. Sekali salah, nggak ada sisa buat coba lagi."),
        M("u8l3q2","Revenge trade (trading balas dendam) setelah kalah biasanya keputusan yang tenang.",false,"Salah. Revenge trade diambil saat emosi, jadi ukurannya sering kebesaran. Jeda dulu."),
        N("u8l3q3","Batas rugi maksimal, misalnya 1-2% modal, disebut risiko per ___.",[
          "transaksi",
          "biaya gas",
          "harga floor",
          "airdrop gratis",
        ],0,"Dengan batas ini, beberapa kali salah pun modalmu masih bertahan."),
      ]),
      L("u8", "u8-chest", "chest", "Peti rute 8", "Remmu dihargai.", "gift", [], { xp: 0, gems: 22 }),
      L("u8", "u8-l4", "lesson", "Order & slippage", "Harga di layar bukan harga dapet.", "layers", [
        tip("u8l4t", "Slippage itu pajak diam-diam.", "Market order makan likuiditas. Di koin sepi, kamu beli lebih mahal / jual lebih murah dari yang kelihatan. Limit order nunggu; market order buru-buru.", {
          points: [
            "Spread lebar = pasar sepi atau lagi kacau.",
            "Slippage 5% di memecoin biasa. Di BTC jarang, kecuali flash.",
            "Cek kedalaman buku, jangan cuma candle.",
          ],
          example: "Klik beli 'Rp 100' di koin sepi, keisi Rp 108. Itu slippage, bukan bug aplikasi.",
          remember: "Layar ≠ isi.",
        }),
        M("u8l4q1","Harga yang kamu dapat di DEX bisa beda dari harga di grafik, apalagi di koin sepi.",true,"Benar. Selisih itu namanya slippage, dan makin tipis likuiditasnya makin lebar selisihnya."),
        j("u8l4q2","Market order cocok dipakai kapan?",[
          "Saat butuh terisi cepat dan pasarnya ramai",
          "Di koin yang pembelinya cuma sedikit dan harganya sepi",
          "Untuk semua memecoin baru yang baru saja listing",
          "Kapan saja tanpa perlu mengecek kondisi pasar",
        ],0,"Market order langsung ambil harga yang ada. Di pasar ramai selisihnya kecil, di pasar sepi bisa mahal."),
        j("u8l4q3","Spread (selisih harga beli dan jual) yang lebar tandanya apa?",[
          "Pembelinya sedikit atau pasar lagi panik",
          "Proyeknya bagus dan bakal segera naik harganya",
          "Bakal ada airdrop gratis buat pemegang tokennya",
          "Biaya transaksi lagi murah banget saat itu",
        ],0,"Spread lebar artinya pasar tipis. Kamu bisa beli lebih mahal atau jual lebih murah."),
      ]),
      L("u8", "u8-cp", "checkpoint", "Ujian rute 8", "Spot, rem, ukuran.", "flag", [
        tip("u8cpt", "Ulangan trading dasar", "Kalo masih campur spot sama futures, ulangi dulu.", {
          points: ["Spot punya. Leverage pinjam.", "Likuidasi final.", "Ukuran hidupin kamu."],
        }),
        M("u8cp1","Leverage 10x aman asal kamu yakin.",false,"Salah. Rasa yakin nggak mengubah matematika. Harga turun 10% aja posisi 10x bisa habis."),
        j("u8cp2","Apa fungsi stop loss?",[
          "Rem otomatis yang membatasi rugi",
          "Tanda trader yang penakut dan nggak yakin",
          "Biaya wajib yang ditarik dari bursa tiap transaksi",
          "Jaminan pasti untung di setiap posisi",
        ],0,"Stop loss menutup posisi di harga yang kamu tentukan supaya rugi nggak membesar."),
        N("u8cp3","Beli aset langsung tanpa pinjaman disebut ___.",["spot","short","perp","margin"],0,"Spot: kamu bayar penuh dan asetnya jadi milikmu."),
        j("u8cp4","Modal Rp 2 juta, risiko 2% per transaksi. Maksimal rugi per transaksi berapa?",["Rp 40 ribu","Rp 200 ribu","Rp 1 juta","Rp 2 juta"],0,"2% dari Rp 2 juta = Rp 40 ribu. Salah 5 kali pun modalmu masih sekitar 90%."),
      ]),
    ],
  },
  {
    id: "u9",
    index: 9,
    title: "Memecoin",
    subtitle: "Likuiditas, honeypot, dan tawa yang mahal",
    color: "purple",
    lessons: [
      L("u9", "u9-l1", "lesson", "Kenapa memecoin liar", "Bukan saham mini.", "image", [
        tip("u9l1t", "Meme = cerita + likuiditas tipis.", "Harga memecoin sering dikendaliin segelintir wallet dan degen (spekulan nekat). Volume bisa palsu. 'Community' bisa 3 bot sama 1 admin. Boleh main kecil. Jangan pake uang sewa, deh.", {
          points: [
            "Supply di developer / bundler = mereka bisa dump.",
            "Market cap di layar ≠ uang yang bisa ditarik.",
            "Yang masuk terakhir sering jadi exit buat yang awal.",
          ],
          example: "MC (market cap) $10 juta, likuiditas $40 ribu. Kalo 10 orang jual, harga bolong.",
          remember: "Main kecil, anggap hangus.",
          proofs: ["cuan-pnut17", "cuan-argus", "rugi-nuked", "rugi-roundtrip"],
        }),
        j("u9l1q1","Market cap (MC) memecoin besar artinya apa?",["Bukan jaminan kamu bisa menjual di harga itu","Semua pemegang pasti bisa jual di puncak","Aman seperti Bitcoin","Udah pasti diaudit"],0,"MC cuma harga dikali jumlah token. Uang yang benar-benar bisa ditarik jauh lebih kecil."),
        M("u9l1q2","Volume 24 jam memecoin bisa dipalsu pakai wallet yang jual-beli ke dirinya sendiri (wash trading).",true,"Benar. Namanya wash trading. Volume ramai belum tentu ada pembeli asli."),
        j("u9l1q3","Uang sewa dipakai buat beli memecoin, boleh nggak?",["Jangan","Boleh kalau yakin","Makin besar makin aman","Aman, ada jaminan exchange"],0,"Memecoin bisa turun 90% dalam sejam. Uang kebutuhan hidup jangan dipakai buat taruhan."),
      ]),
      L("u9", "u9-l2", "lesson", "Honeypot & pajak aneh", "Bisa beli, nggak bisa jual.", "lock", [
        tip("u9l2t", "Perangkap klasik.", "Honeypot: kontrak izinin beli, blokir jual. Pajak jual 99%. Blacklist wallet. Cek simulator jual (token sniffer, honeypot.is, rugcheck) sebelum gas.", {
          points: [
            "Kalau token hanya bisa dibeli tapi tidak bisa dijual, itu bukan peluang melainkan jebakan honeypot.",
            "Renounced (pemilik melepas kendali kontrak) bukan jaminan. Bisa udah dipasang jebakan sebelumnya.",
            "CA (alamat kontrak) dari DM / komentar = curiga.",
          ],
          example: "Klik beli di Telegram, chart hijau, jual gagal 'transfer from failed'. Honeypot.",
          remember: "Simulasi jual dulu.",
        }),
        N("u9l2q1","Token yang bisa dibeli tapi nggak bisa dijual disebut ___.",["honeypot","rugpull","airdrop","staking"],0,"Honeypot = kontraknya mengizinkan beli tapi memblokir jual."),
        M("u9l2q2","Kontrak yang sudah renounced masih bisa menyimpan jebakan yang dipasang sebelum kepemilikannya dilepas.",true,"Benar. Renounced cuma berarti pemilik lepas kendali sekarang, bukan berarti kontraknya bersih."),
        j("u9l2q3","Kamu dapat CA (alamat kontrak) dari komentar orang asing. Harus gimana?",["Curiga, cek dulu di sumber resmi","Langsung beli","Kasih seed ke pengirimnya","Percaya aja, banyak yang like"],0,"CA di komentar gampang dipalsu. Ambil dari situs atau akun resmi proyeknya."),
      ]),
      L("u9", "u9-l3", "lesson", "LP & rug", "Kunci likuiditas, atau kabur.", "fuel", [
        tip("u9l3t", "Likuiditas itu pintu keluar.", "Kalo LP nggak dikunci / bisa ditarik owner, mereka cabut kolam, harga ke nol. Ini rugpull versi meme. Sebelum ape (buru-buru beli), cek lock dan cek owner.", {
          points: [
            "LP unlocked + owner aktif = risiko cabut.",
            "Mint function hidup = supply bisa digelontor.",
            "Bundle launch (banyak wallet tim) sering dump terkoordinasi.",
          ],
          example: "Chart 100x dalam 11 menit, LP dicabut menit ke-12. Yang tersisa cuma token yang nggak bisa dijual.",
          remember: "Pintu keluar dulu, cerita belakangan.",
        }),
        M("u9l3q1","LP (dana likuiditas) yang nggak dikunci bisa ditarik pemiliknya kapan aja, dan harga langsung jatuh ke nol.",true,"Benar. Ini pola rug pull klasik: likuiditas ditarik, harga ambruk, dan pembeli terjebak."),
        j("u9l3q2","Fungsi mint di kontrak masih aktif. Artinya apa?",[
          "Jumlah token bisa ditambah kapan aja",
          "Kontraknya sudah diaudit firma terkenal",
          "Proyeknya nggak bisa melakukan rugpull",
          "Biaya gas jadi gratis untuk semua transaksi",
        ],0,"Kalau token bisa dicetak terus, nilai token yang kamu pegang bisa turun drastis."),
        j("u9l3q3","Sebelum beli koin baru, apa yang dicek dulu?",["LP, pemilik kontrak, pajak jual, dan simulasi jual","Foto profil admin yang mengelola grup komunitasnya","Jumlah emoji dan stiker yang dipakai di grup Telegram","Musik yang diputar di voice chat saat acara komunitas"],0,"Yang menentukan aman atau nggak itu mekanisme kontraknya, bukan suasana grupnya."),
      ]),
      L("u9", "u9-chest", "chest", "Peti rute 9", "Buat yang cek CA.", "gift", [], { xp: 0, gems: 22 }),
      L("u9", "u9-l4", "lesson", "Inner circle", "Kamu bukan di dalamnya.", "userx", [
        tip("u9l4t", "Call group bukan alfa.", "Banyak 'circle' dapet alokasi awal, kamu dapet sisa. Kalo call datang abis 5x, kamu sering jadi likuiditas. Boleh hiburan. Jangan gaji.", {
          points: [
            "Yang awal tau, yang akhir bayar.",
            "Screenshot call hijau diseleksi. Yang rugi dihapus.",
            "Kalo admin larang kritik, itu kultus, bukan riset.",
          ],
          example: "Grup 'free gem' minta 1 SOL 'whitelist'. Itu penjualan harapan.",
          remember: "Kamu hampir nggak pernah first.",
        }),
        j("u9l4q1","Grup ngasih 'call' (rekomendasi beli) koin yang harganya udah naik 5x. Artinya apa?",[
          "Kamu sering jadi pembeli buat mereka yang mau jual",
          "Waktu paling aman buat masuk pasar",
          "Wajib beli pakai semua modal yang ada",
          "Sama amannya dengan beli Bitcoin saat harganya puncak",
        ],0,"Yang masuk duluan butuh pembeli baru biar bisa jual. Yang datang telat sering jadi pembeli itu."),
        M("u9l4q2","Grup sinyal berbayar menjamin untung.",false,"Salah. Admin sering dapat uang dari biaya langganan, bukan dari hasil sinyalnya."),
        j("u9l4q3","Admin grup melarang anggota tanya CA. Tandanya apa?",["Tanda bahaya (red flag)","Grupnya profesional","Aturan resmi bursa","Biar grupnya nggak spam"],0,"Proyek jujur nggak takut dicek. Larangan bertanya itu tanda ada yang disembunyikan."),
      ]),
      L("u9", "u9-cp", "checkpoint", "Ujian rute 9", "Meme, jebakan, pintu.", "flag", [
        tip("u9cpt", "Ulangan memecoin", "Simulasi jual. Cek LP. Main kecil.", { points: ["Honeypot.", "LP unlock.", "Kamu bukan inner circle."] }),
        N("u9cp1","Bisa beli tapi nggak bisa jual disebut ___.",["honeypot","spot","rugpull","slippage"],0,"Selalu simulasi jual dulu sebelum beli token baru."),
        M("u9cp2","Market cap sama dengan uang yang bisa ditarik semua pemegang.",false,"Salah. Likuiditasnya jauh lebih kecil dari market cap."),
        j("u9cp3","Pemilik token bisa menarik LP kapan aja. Itu tanda apa?",["Risiko rugpull","Fitur staking","Bukti proyek aman","Bonus buat pemegang"],0,"Kalau LP ditarik, token nggak bisa dijual dan harganya jatuh ke nol."),
        j("u9cp4","Grup 'call' paling tepat dianggap apa?",[
          "Hiburan, bukan sumber gaji",
          "Penghasilan tetap tiap bulan",
          "Riset profesional yang kredibel",
          "Jaminan untung pasti cuan",
        ],0,"Kalau mau ikut, pakai uang kecil yang siap hilang."),
      ]),
    ],
  },
  {
    id: "u10",
    index: 10,
    title: "DYOR",
    subtitle: "Explorer, kontrak, dan data pemegang, bukan sekadar firasat",
    color: "teal",
    lessons: [
      L("u10", "u10-l1", "lesson", "Baca explorer", "Etherscan & kawan-kawan.", "map", [
        tip("u10l1t", "Explorer itu CCTV rantai.", "Liat transfer, kontrak, gas, nonce. Jangan percaya 'chart hijau' di situs random. Alamat resmi proyek biasanya di docs / akun terverifikasi, bukan di reply bot.", {
          points: [
            "Cek token contract, bukan nama mirip.",
            "Holder top 10 megang berapa persen?",
            "Tx pertama dan bundling wallet sering bocorin tim.",
          ],
          example: "Nama 'USDT' palsu di jaringan salah. Explorer nunjukin creator 2 jam lalu. Asli nggak gitu.",
          remember: "Alamat > nama.",
        }),
        j("u10l1q1","Nama token yang muncul di wallet bisa dipercaya nggak?",[
          "Bisa ditiru. Cek alamat kontraknya",
          "Selalu unik dan nggak bisa disamakan",
          "Pasti udah diaudit oleh firma terkenal",
          "Nggak mungkin dipalsu oleh siapa pun",
        ],0,"Siapa pun bisa bikin token bernama 'USDT'. Yang unik cuma alamat kontraknya."),
        M("u10l1q2","Explorer membaca data langsung dari blockchain, jadi lebih valid daripada grafik di situs sembarangan.",true,"Benar. Situs sembarangan bisa menampilkan angka palsu. Explorer membaca langsung dari rantai."),
        j("u10l1q3","80% token dipegang 3 wallet. Artinya apa?",[
          "Risiko harga ambruk kalau mereka jual",
          "Kepemilikannya sehat dan terdistribusi",
          "Sinyal wajib beli buat semua orang",
          "Sama amannya dengan Bitcoin asli",
        ],0,"Cukup 3 wallet itu yang jual, harga langsung jatuh."),
      ]),
      L("u10", "u10-l2", "lesson", "Kontrak", "Yang kamu izinin, itu senjata.", "key", [
        tip("u10l2t", "Approve itu surat kuasa.", "Kamu bisa kasih izin token tak terbatas ke kontrak. Kalo kontrak jahat, saldo disedot nanti. Unlimited approve = pintu kebuka. Revoke sesekali.", {
          points: [
            "Baca apa yang ditandatangani: transfer, setApproval, increaseAllowance.",
            "Permit / permit2 juga izin, cuma bungkusnya beda.",
            "Revoke di etherscan / revoke.cash abis eksperimen.",
          ],
          example: "Situs mint NFT minta 'approve USDT unlimited'. Mint nggak butuh itu. Tolak.",
          remember: "Izin itu senjata, jangan kasih selamanya.",
        }),
        M("u10l2q1","Approve unlimited berisiko: kalau kontraknya jahat atau di-hack, semua token yang diizinkan bisa ditarik.",true,"Benar. Batasi approve ke jumlah yang kamu butuhkan, dan cabut izin yang sudah nggak dipakai."),
        j("u10l2q2","Setelah mencoba dapp baru, sebaiknya kamu ngapain?",[
          "Cabut (revoke) izin yang nggak perlu",
          "Biarkan saja izinnya terbuka selamanya",
          "Bagikan seed ke tim dapp-nya",
          "Naikkan leverage biar cepat cuan",
        ],0,"Izin lama tetap aktif sampai dicabut. Cabut lewat revoke.cash atau explorer."),
        N("u10l2q3","Memberi izin kontrak untuk memakai tokenmu disebut ___.",["approve","airdrop","stake","bridge"],0,"Approve itu seperti surat kuasa. Kasih secukupnya, bukan tanpa batas."),
      ]),
      L("u10", "u10-l3", "lesson", "Sinyal on-chain", "Bukan ramalan.", "layers", [
        tip("u10l3t", "Data, bukan dukun.", "Cek: likuiditas, holder, pajak, mint, LP lock, age, audit (yang bisa palsu), sosial yang bisa dibeli. Nggak ada satu centang yang nyelametin kamu.", {
          points: [
            "Audit PDF bisa dipalsu. Cek firma dan alamat kontrak di laporan.",
            "Pengikut Twitter dibeli. Engagement bot.",
            "Kombinasi merah: mint hidup + LP unlock + pajak jual aneh.",
          ],
          example: "Logo 'Certik' di banner Telegram. Laporan aslinya kontrak lain. Palsu.",
          remember: "Tumpuk sinyal, jangan satu centang.",
        }),
        j("u10l3q1","Proyek punya satu PDF audit. Artinya apa?",["Belum tentu aman","Dijamin 100% aman","Sinyal beli semua modal","Pasti bebas honeypot"],0,"Laporan audit bisa palsu atau cuma ngecek sebagian kode. Cocokkan alamat kontraknya."),
        M("u10l3q2","Proyek dengan 1 juta followers pasti serius.",false,"Salah. Followers dan interaksi bisa dibeli atau diisi bot."),
        j("u10l3q3","Fungsi mint masih aktif dan LP nggak dikunci. Artinya apa?",["Risikonya bertumpuk","Sinyal beli","Normal buat token baru","Tanda proyek serius"],0,"Token bisa dicetak terus dan likuiditas bisa ditarik. Dua risiko besar sekaligus."),
      ]),
      L("u10", "u10-chest", "chest", "Peti rute 10", "Kacamata skeptis.", "gift", [], { xp: 0, gems: 22 }),
      L("u10", "u10-l4", "lesson", "Sumber resmi", "Jangan dari reply.", "shield", [
        tip("u10l4t", "Link dari mana?", "Bookmark situs resmi. Cek handle terverifikasi. Domain 1 huruf beda = phishing. Jangan klik 'support' yang DM duluan.", {
          points: [
            "CS resmi nggak DM minta seed / kode.",
            "Google ads bisa nampilin phishing di atas hasil asli.",
            "Ketik URL sendiri, jangan dari broadcast.",
          ],
          example: "GoPay palsu di iklan: 'go-pay-cs.help'. Asli nggak gitu.",
          remember: "Ketik sendiri, jangan klik asing.",
        }),
        M("u10l4q1","CS resmi nggak pernah DM duluan, apalagi minta kode verifikasi atau seed phrase.",true,"Benar. Yang DM duluan dan minta kode atau seed itu penipu, sehalus apa pun bahasanya."),
        j("u10l4q2","Cara paling aman membuka situs exchange?",["Lewat bookmark atau aplikasi resmi","Klik iklan paling atas","Dari link di komentar","Scan QR yang ditempel di tempat umum"],0,"Iklan dan link di komentar sering mengarah ke situs tiruan."),
        j("u10l4q3","Alamat situs beda satu huruf dari aslinya. Itu apa?",["Phishing","Server cadangan resmi","Versi beta situs","Situs mirror yang aman"],0,"Penipu sengaja pakai alamat mirip supaya kamu nggak sadar sedang di situs palsu."),
      ]),
      L("u10", "u10-cp", "checkpoint", "Ujian rute 10", "CCTV, izin, sumber.", "flag", [
        tip("u10cpt", "Ulangan DYOR", "Alamat > nama. Izin = senjata. Ketik sendiri.", { points: ["Explorer.", "Approve.", "Sumber resmi."] }),
        M("u10cp1","Nama token pasti unik di semua jaringan.",false,"Salah. Nama bisa ditiru siapa pun. Yang harus dicek alamat kontraknya."),
        N("u10cp2","Memberi izin token ke kontrak disebut ___.",[
          "approve",
          "transfer",
          "deposit",
          "withdraw",
        ],0,"Setelah selesai pakai, cabut izinnya dengan revoke."),
        j("u10cp3","Ada 'CS' yang DM dan minta seed. Dia siapa?",["Penipu","Prosedur verifikasi resmi","Tim keamanan exchange","Bot bantuan otomatis"],0,"Nggak ada pihak resmi yang minta seed phrase. Langsung blokir."),
        j("u10cp4","DYOR yang benar itu seperti apa?",["Cek beberapa hal sekaligus, jangan andalkan satu tanda","Beli semua token yang sedang ramai dibicarakan orang","Cukup melihat jumlah pengikut akun media sosialnya","Percaya pada satu dokumen audit yang dipublikasikan"],0,"Cek kontrak, likuiditas, pemegang, dan tim. Satu tanda 'aman' nggak cukup."),
      ]),
    ],
  },
  {
    id: "u11",
    index: 11,
    title: "CEX, P2P, Indonesia",
    subtitle: "Masuk-keluar duit, pajak, dan warung digital",
    color: "green",
    lessons: [
      L("u11", "u11-l1", "lesson", "CEX vs DEX", "Titip vs pegang kunci.", "bank", [
        tip("u11l1t", "Dua pintu.", "CEX (Binance, lokal): titip, ada CS, bisa diblok. DEX: kamu pegang kunci, salah alamat hangus, nggak ada CS. Banyak orang Indo beli di CEX, tarik ke wallet, baru main DEX.", {
          points: [
            "CEX terdaftar resmi cocok untuk on-ramp rupiah yang aman.",
            "Jangan simpen gaji setahun di CEX. 'Not your keys'.",
            "DEX butuh gas dan ketelitian jaringan.",
          ],
          example: "Beli USDT di CEX lokal, tarik ke wallet, swap di DEX. Tiap langkah bisa salah jaringan.",
          remember: "Titip sebentar, simpen sendiri yang jangka panjang.",
        }),
        j("u11l1q1","Apa arti 'not your keys, not your coins'?",["Kalau asetmu dititip di exchange, kendali penuhnya bukan di kamu","Seed phrase boleh dibagikan ke siapa pun yang kamu percaya","Bursa besar tidak mungkin bangkrut atau mengalami gagal bayar","Bursa terdesentralisasi dinyatakan ilegal di semua negara"],0,"Yang pegang kunci yang punya kuasa. Di CEX, kuncinya dipegang exchange."),
        M("u11l1q2","DEX cuma kode di blockchain, jadi kalau salah kirim nggak ada CS yang bisa dihubungi.",true,"Benar. Nggak ada meja bantuan di DEX. Transaksi on-chain final dan nggak bisa dibatalkan."),
        j("u11l1q3","Pemula paling aman beli kripto pakai rupiah lewat mana?",[
          "Exchange (CEX) atau P2P yang berizin",
          "DM Telegram dari orang asing yang mengaku admin",
          "Transfer ke rekening 'admin' grup yang ramai",
          "Link dari komentar unggahan yang tampak resmi",
        ],0,"Jalur berizin punya aturan dan perlindungan. Jalur acak rawan penipuan."),
      ]),
      L("u11", "u11-l2", "lesson", "P2P", "Orang ke orang, jebakan ke jebakan.", "swap", [
        tip("u11l2t", "P2P itu warung, bukan ATM.", "Kamu ketemu orang. Ada yang bayar pake rekening hasil penipuan, trus lapor polisi. Ada yang minta transfer di luar escrow. Pake escrow platform. Jangan lepas chat ke WA pribadi.", {
          points: [
            "Escrow hidup sampe kedua sisi tuntas.",
            "Harga terlalu bagus = umpan rekening kotor.",
            "Jangan kirim ke rekening nama yang beda tanpa alasan kuat.",
          ],
          example: "USDT murah banget, minta transfer BCA ke nama orang lain 'kakak saya'. Klasik.",
          remember: "Escrow, nama cocok, jangan buru-buru.",
        }),
        M("u11l2q1","Pindah chat P2P ke WhatsApp pribadi itu aman.",false,"Salah. Di luar platform, kamu kehilangan perlindungan escrow."),
        j("u11l2q2","Ada yang jual USDT jauh di bawah harga pasar. Kenapa?",["Curiga uangnya dari rekening hasil penipuan atau umpan","Penjualnya sedang baik hati dan ingin berbagi rezeki","Promo resmi yang diadakan bursa untuk menarik pengguna","Harga yang wajar karena di P2P memang selalu begitu"],0,"Harga terlalu murah sering dipakai buat mencuci uang hasil penipuan. Rekeningmu bisa ikut diblokir."),
        j("u11l2q3","Apa fungsi escrow di P2P?",["Menahan aset sampai pembayaran selesai","Biaya administrasi yang dipungut platform setiap transaksi","Potongan pajak yang disetorkan langsung ke negara","Asuransi yang mengganti kerugian kalau transaksinya gagal"],0,"Escrow memastikan penjual nggak bisa kabur dan pembeli nggak bisa curang."),
      ]),
      L("u11", "u11-l3", "lesson", "Pajak & jejak", "Negara juga baca rantai.", "book", [
        tip("u11l3t", "Bukan nasihat pajak. Sadar jejak.", "Di Indonesia, aset kripto dan transaksi bisa kena aturan yang berubah. Simpen riwayat. Jangan kira 'on-chain = ga kelihatan'. CEX lokal punya datamu. Edukasi ini bertujuan agar kamu selalu tertib administrasi.", {
          points: [
            "Catat beli/jual. Screenshot jelek, CSV lebih bagus.",
            "Pindah CEX → wallet tetep jejak.",
            "Kalo ragu, tanya orang yang kerjanya pajak, bukan admin grup.",
          ],
          example: "Untung memecoin Rp 50 juta, kaget pas ada kewajiban. Catatan dari hari 1 lebih murah daripada panik.",
          remember: "Jejak ada, catat.",
        }),
        tf("u11l3q1","Transaksi blockchain itu publik dan bisa dianalisis forensik, apalagi kalau terhubung data KYC bursa.",true,"Benar. Rantai menyimpan jejak permanen, dan bursa berizin punya datamu. On-chain bukan berarti anonim."),
        c("u11l3q2", "Nasihat pajak paling tepat bersumber dari siapa?", ["Konsultan pajak profesional berlisensi", "Admin call group Telegram", "Komentar anonim media sosial", "Saran acak bot tanpa verifikasi hukum"], 0, "Konsultan pajak profesional memahami undang-undang keuangan yang berlaku dan dapat memberikan panduan kepatuhan resmi."),
        j("u11l3q3","Kenapa catatan transaksi kripto penting?",[
          "Sebagai dokumen pendukung laporan pajak dan bukti legalitas asal dana",
          "Tidak penting selama seluruh transaksi berjalan on-chain dan bisa dilacak",
          "Hanya diperlukan jika sudah memiliki status whale di komunitas kripto",
          "Otomatis membuat private key lebih kebal hacker dan pencuri iseng",
        ],0,"Catatan riil membantu pelaporan pajak resmi dan verifikasi perbankan saat proses penarikan dana."),
      ]),
      L("u11", "u11-chest", "chest", "Peti rute 11", "On-ramp yang waras.", "gift", [], { xp: 0, gems: 22 }),
      L("u11", "u11-l4", "lesson", "Off-ramp", "Jadi rupiah lagi.", "bank", [
        tip("u11l4t", "Keluar lebih susah daripada masuk.", "Bank bisa nanya sumber dana. Rekening kena hold. Pecah transaksi, nama jelas, platform berizin. Jangan cuci lewat orang random yang 'bisa cairin'.", {
          points: [
            "Off-ramp resmi memang lebih lambat, tapi lebih aman.",
            "Orang random 'cairin 10 menit' = risiko rekening kamu dipake.",
            "Stablecoin bukan 'uang tunai di bawah bantal'. Masih ada jembatan.",
          ],
          example: "Temen 'bisa cairin USDT ke DANA 5 menit, fee 2%'. Datanya masuk rekening gelap. Kamu yang ditanya.",
          remember: "Keluar lewat pintu, bukan jendela.",
        }),
        c("u11l4q1", "Mencairkan dana lewat perantara tidak resmi dalam 5 menit. Apakah aman?", [
          "Berisiko rekening dibekukan akibat keterkaitan dana ilegal",
          "Aman karena prosesnya jauh lebih singkat dari jalur resmi",
          "Dianjurkan oleh lembaga perbankan resmi buat kebutuhan cepat",
          "Sama amannya dengan transfer kliring antar bank biasa saja",
        ], 0, "Mencairkan dana lewat perantara tidak resmi berisiko menyeret rekeningmu ke dalam investigasi pencucian uang atau penipuan."),
        tf("u11l4q2","Stablecoin masih butuh proses on-ramp dan off-ramp buat jadi uang tunai rupiah.",true,"Benar. Stablecoin itu token di rantai, bukan saldo rekening. Butuh bursa buat mencairkannya."),
        c("u11l4q3","Bank nanya sumber dana pas kamu cairin kripto. Gimana?",["Wajar, siapkan bukti transaksi dan catatan penarikan","Bank tidak berhak menanyakan asal dana milik nasabahnya","Hapus aplikasi bank supaya pertanyaan itu tidak muncul lagi","Abaikan saja pertanyaannya karena tidak ada akibat hukumnya"],0,"Bank wajib mematuhi aturan anti-pencucian uang, jadi catatan transaksimu sangat berguna."),
      ]),
      L("u11", "u11-cp", "checkpoint", "Ujian rute 11", "Masuk, keluar, jejak.", "flag", [
        tip("u11cpt", "Ulangan CEX & Indo", "Titip sebentar. Escrow. Catat.", { points: ["Keys.", "P2P.", "Jejak."] }),
        M("u11cp1","Menyimpan semua aset jangka panjang di CEX itu ideal.",false,"Salah. Kalau exchange bermasalah, asetmu ikut tertahan. Simpan jangka panjang di wallet sendiri."),
        j("u11cp2","Transaksi P2P lalu diajak pindah ke WhatsApp. Tandanya apa?",["Tanda bahaya (red flag)","Prosedur wajib","Lebih cepat dan aman","Biar harga lebih murah"],0,"Di luar platform nggak ada escrow. Penipu sering pakai cara ini."),
        N("u11cp3","Bursa yang menyimpan asetmu (titipan) disebut ___.",["CEX","DEX","LP","NFT"],0,"CEX = centralized exchange. Nyaman, tapi asetmu dititip."),
        j("u11cp4","Cara aman mencairkan kripto ke rupiah (off-ramp)?",[
          "Lewat platform berizin dengan nama rekening yang sama",
          "Lewat orang asing yang menawarkan harga tinggi di grup",
          "Lewat DM admin grup yang mengaku resmi dan terpercaya",
          "Lewat token yang nggak bisa dijual di pasar mana pun",
        ],0,"Nama rekening yang cocok dan platform berizin mengurangi risiko rekening diblokir."),
      ]),
    ],
  },
  {
    id: "u12",
    index: 12,
    title: "Yield & jebakan APY",
    subtitle: "Bunga gila biasanya umpan",
    color: "red",
    lessons: [
      L("u12", "u12-l1", "lesson", "Staking", "Kunci aset untuk mendapatkan imbalan jaringan.", "lock", [
        tip("u12l1t", "Staking resmi vs 'staking' palsu.", "Staking rantai: kunci di protokol, ada slashing, ada unbond. 'Staking' di website random: sering titip ke orang. APY 2000% dari mana? Biasanya dari duit orang baru, atau token yang dilutif.", {
          points: [
            "Tanya: imbalan dibayar pake apa? Inflasi token = kamu dibayar kertas.",
            "Masa penarikan 14-21 hari adalah hal wajar di banyak rantai. 'Instan + 20% per hari' justru aneh.",
            "Situs staking minta seed = penipu.",
          ],
          example: "Validator ETH vs situs 'stake BTC 3% per hari'. Yang kedua hampir pasti skema.",
          remember: "Bunga waras jarang berteriak.",
        }),
        j("u12l1q1","Ada banner APY 2000%. Percaya?",["Curiga. Tanya dulu uangnya dari mana","Langsung ikut karena kesempatannya terbatas dan langka","Imbal hasil yang normal untuk Bitcoin di pasar saat ini","Program yang dijamin langsung oleh pemerintah pusat"],0,"Bunga wajar harus jelas sumbernya. APY 2000% biasanya dibayar pakai uang peserta baru."),
        M("u12l1q2","Staking asli cuma butuh connect wallet dan tanda tangan; yang minta seed phrase pasti penipu.",true,"Benar. Tanda tangan nggak pernah membocorkan seed. Permintaan seed itu satu-satunya tanda yang kamu butuhkan."),
        N("u12l1q3","Mengunci aset di jaringan untuk dapat imbalan disebut ___.",["staking","phishing","rugpull","bridge"],0,"Staking resmi biasanya punya masa tunggu penarikan dan risiko potongan (slashing)."),
      ]),
      L("u12", "u12-l2", "lesson", "Farm & vault", "Imbalan dari fee, atau dari angin.", "coins", [
        tip("u12l2t", "Yield farming bukan deposito.", "Kamu kasih likuiditas, dapet fee + token. Impermanent loss, smart contract risk, token reward dump. Vault yang 'auto compound 40% sehari' sering ponzi cantik.", {
          points: [
            "IL: harga aset di pool geser, kamu bisa kalah vs hold.",
            "Reward token bisa nol sebelum kamu jual.",
            "TVL (total dana terkunci) tiba-tiba = sering insentif, bukan cinta.",
          ],
          example: "Pool aneh APY 800%, TVL meledak seminggu, reward dump, sisa IL.",
          remember: "Fee nyata > bunga poster.",
        }),
        M("u12l2q1","APY bisa berubah kapan aja, bahkan ambruk dalam seminggu.",true,"Benar. APY itu angka saat ini, bukan janji setahun. Sumber imbal hasilnya wajib kamu cek."),
        j("u12l2q2","Impermanent loss (IL) itu apa?",[
          "Kerugian karena harga aset di pool bergeser, bisa kalah dari simpan biasa",
          "Asuransi otomatis dari protokol yang menjamin menutup semua kerugian di pool",
          "Pajak transaksi yang dipotong protokol dari setiap hasil swap di pool",
          "Biaya gas tambahan yang dibebankan saat menyetor dana ke dalam pool",
        ],0,"Kalau harga dua token di pool berubah jauh, nilai bagianmu bisa lebih kecil dibanding kalau cuma disimpan."),
        j("u12l2q3","Ada vault yang janji 40% per hari. Mungkin nggak?",[
          "Hampir pasti skema penipuan",
          "Bunga normal buat stablecoin",
          "Hasil teknologi baru",
          "Standar exchange besar",
        ],0,"40% per hari berarti ribuan persen setahun. Nggak ada bisnis nyata yang bisa bayar segitu."),
      ]),
      L("u12", "u12-l3", "lesson", "Double & giveaway", "Yang minta deposit dulu.", "gift", [
        tip("u12l3t", "Ulangi mantra.", "Double ETH, giveaway 'kirim dulu', airdrop minta gas ke alamat admin. Modus gandakan saldo atau meminta fee di awal adalah penipuan. Jangan pernah mengirimkan asetmu ke pihak mana pun.", {
          points: [
            "Hadiah resmi nggak minta kamu transfer dulu.",
            "Koneksi wallet + tanda tangan aneh = bisa cabut izin.",
            "Kalo terlalu indah, itu umpan.",
          ],
          proofs: ["cuan-20m", "fumble-193m"],
          remember: "Terlalu indah = umpan.",
        }),
        M("u12l3q1","'Kirim 1 ETH, dapat 2 ETH dalam 10 menit' itu penipuan klasik, bukan produk DeFi.",true,"Benar. Nggak ada protokol yang menggandakan saldo. Pola 'kirim dulu' selalu umpan."),
        j("u12l3q2","Giveaway minta kamu kirim 0,1 ETH dulu. Itu apa?",["Penipuan","Verifikasi KYC","Biaya gas resmi","Syarat staking"],0,"Hadiah asli nggak pernah minta kamu transfer duluan."),
        j("u12l3q3","Kamu dapat DM dari akun bernama 'DeFi Rewards' yang mengaku bagi-bagi ETH. Mana yang paling mungkin umpan?",[
          "Akun 'resmi' bagi-bagi ETH asal kamu kirim dulu",
          "Swap di DEX lewat bookmark resmi yang kamu simpan",
          "Beli di exchange berizin yang terdaftar resmi",
          "Staking lewat situs resmi jaringan yang kamu percaya",
        ],0,"Pola 'kirim dulu, nanti dapat lebih' selalu umpan."),
      ]),
      L("u12", "u12-chest", "chest", "Peti rute 12", "Bunga yang nggak berteriak.", "gift", [], { xp: 0, gems: 22 }),
      L("u12", "u12-l4", "lesson", "Imbalan dari mana", "Nggak ada makan siang gratis.", "layers", [
        tip("u12l4t", "Ikutin duitnya.", "Fee transaksi, inflasi token, duit deposan baru, atau dump ke kamu. Tulis di kertas. Kalo nggak bisa jelasin ke temen warung, jangan masuk.", {
          points: [
            "Inflasi: kamu dibayar token yang makin banyak, makin murah.",
            "Ponzi: bunga dari orang belakang.",
            "Hasil nyata datang dari orang yang bayar biaya swap, bunga pinjaman, atau lelang asli.",
          ],
          example: "Protokol pinjam: peminjam bayar bunga, pemberi dapet bagian. Masuk akal. 'Tanpa peminjam, 5% per hari' nggak.",
          remember: "Bisa dijelasin = boleh ditimbang.",
        }),
        j("u12l4q1","Ada tawaran bunga tanpa sumber yang jelas. Ikut?",["Jangan ikut","Ikut semua modal","Pinjam bank biar lebih besar","Kasih seed biar diproses cepat"],0,"Kalau kamu nggak bisa jelaskan uangnya dari mana, kemungkinan besar dari peserta baru."),
        M("u12l4q2","Token hadiah (reward) selalu naik harganya.",false,"Salah. Token reward terus dicetak, jadi harganya sering turun."),
        j("u12l4q3","Sumber imbal hasil (yield) paling masuk akal dari mana?",["Biaya dari pengguna nyata, misalnya bunga pinjaman atau fee swap","Setoran dari peserta baru yang bergabung setelah kamu masuk","Banner iklan yang menjanjikan imbal hasil dua ribu persen","Transfer rutin dari admin protokol untuk menjaga harga token"],0,"Yield yang sehat datang dari aktivitas nyata yang bisa kamu jelaskan."),
      ]),
      L("u12", "u12-cp", "checkpoint", "Ujian rute 12", "Bunga, umpan, sumber.", "flag", [
        tip("u12cpt", "Ulangan yield", "Dari mana duitnya? Seed nggak buat staking web.", { points: ["Staking palsu.", "APY poster.", "Sumber fee."] }),
        M("u12cp1","APY 2000% itu wajar untuk BTC.",false,"Salah. BTC nggak punya bunga bawaan. Angka segitu pasti dari skema."),
        j("u12cp2","Situs staking minta seed phrase. Siapa itu?",["Penipu","Prosedur staking normal","Validator resmi","Fitur keamanan wallet"],0,"Staking nggak pernah butuh seed. Tutup situsnya."),
        N("u12cp3","Harga aset di pool bergeser bisa bikin ___ loss.",[
          "impermanent",
          "gas fee",
          "floor price",
          "airdrop",
        ],0,"Impermanent loss: kamu bisa kalah dibanding cuma menyimpan asetnya."),
        j("u12cp4","Kamu nggak bisa jelasin sumber bunganya. Harus gimana?",["Jangan masuk","Masuk sedikit dulu tanpa cek","Minta APY lebih tinggi","Masukkan semua modal"],0,"Aturan sederhana: kalau nggak bisa dijelaskan, jangan ditaruh uang."),
      ]),
    ],
  },
  {
    id: "u13",
    index: 13,
    title: "Kepala dingin",
    subtitle: "FOMO, dendam, dan bertahan hidup",
    color: "gold",
    lessons: [
      L("u13", "u13-l1", "lesson", "FOMO", "Kereta yang udah jalan.", "siren", [
        tip("u13l1t", "Rasa ketinggalan itu produk.", "Timeline hijau dirancang bikin kamu masuk telat. Saat harga sudah melonjak tinggi, tetaplah objektif dan jangan biarkan emosi FOMO mengendalikan keputusanmu.", {
          points: [
            "Jeda 10 menit. Minum air. Cek CA.",
            "Kalo 'sekarang atau nggak pernah', itu script umpan.",
            "Kesempatan lain ada. Modal yang hangus nggak balik.",
          ],
          example: "Grup teriak 'last candle'. Kamu buru-buru beli. Mereka jual ke kamu.",
          remember: "Jeda dulu, baru klik.",
          proofs: ["rugi-entry", "cuan-20m"],
        }),
        M("u13l1q1","Kalimat 'kalau nggak beli sekarang, kesempatan hilang selamanya' sengaja dipakai buat bikin kamu panik.",true,"Benar. Itu teknik FOMO. Kesempatan di pasar selalu ada; keputusan panik yang mahal."),
        j("u13l1q2","Kamu lagi FOMO (takut ketinggalan). Harus gimana?",["Jeda dulu dan cek","Langsung masukkan semua modal","Pinjam uang biar bisa ikut","Lewati riset"],0,"Jeda 10 menit cukup buat nurunin emosi dan cek ulang."),
        j("u13l1q3","Koin udah naik 10x dan semua orang ngomongin. Kalau kamu beli sekarang, risikonya apa?",["Kamu bisa jadi pembeli buat mereka yang mau jual","Waktu paling aman karena harganya sudah terbukti naik","Wajib memakai leverage lima puluh kali supaya maksimal","Ada asuransi yang menanggung kerugian kalau harganya turun"],0,"Yang beli duluan butuh pembeli baru untuk mencairkan untung."),
      ]),
      L("u13", "u13-l2", "lesson", "Dendam", "Menebus luka dengan luka baru.", "userx", [
        tip("u13l2t", "Revenge trade.", "Kalah, trus naikin ukuran biar 'balik cepet'. Itu cara klasik rugi US$426 bisa membengkak jadi puluhan juta rupiah. Tutup laptop. Jalan. Tulis journal. Besok.", {
          points: [
            "Aturan: abis 2 kalah, stop hari itu.",
            "Naikin ukuran cuma saat tenang, bukan saat panas.",
            "PnL harian merah bukan undangan all-in.",
          ],
          example: "Trader nulis: greed, overconfidence, impatience. Satu hari −$426. Itu masih murah kalo jadi pelajaran.",
          remember: "Stop, jangan tebus.",
          proofs: ["rugi-personal"],
        }),
        j("u13l2q1","Habis kalah, lalu ukuran posisi dinaikkan biar cepat balik modal. Boleh?",[
          "Itu revenge trade dan berbahaya",
          "Itu cara profesional yang memang terbukti",
          "Itu wajib banget dilakukan",
          "Itu bagian penting dari riset",
        ],0,"Menaikkan ukuran saat emosi biasanya bikin rugi makin besar."),
        M("u13l2q2","Kalah dua kali berturut-turut itu tanda buat berhenti dulu hari itu.",true,"Benar. Emosi setelah kalah bikin ukuran posisi membengkak. Tutup layar, evaluasi besok."),
        N("u13l2q3","Trading untuk balas dendam setelah kalah disebut ___ trade.",[
          "revenge",
          "breakout",
          "momentum",
          "hedging",
        ],0,"Revenge trade diambil pakai emosi, bukan rencana."),
      ]),
      L("u13", "u13-l3", "lesson", "Journal", "Otak di kertas.", "book", [
        tip("u13l3t", "Tulis, atau ulang kesalahan.", "Catat: kenapa masuk, ukuran, rencana keluar, emosi. Hijau tanpa catatan = keberuntungan. Merah tanpa catatan = bakal diulang.", {
          points: [
            "Screenshot PnL bukan journal.",
            "Satu baris: ide, risiko, hasil, pelajaran.",
            "Mingguan: yang berulang itu karakternya, bukan koinnya.",
          ],
          example: "Bukan 'rugi PEPE'. Tapi 'masuk FOMO, tanpa stop, ukuran 20%'. Itu yang dibenerin.",
          remember: "Koin berganti, kebiasaan tetep.",
        }),
        M("u13l3q1","Screenshot PnL hijau sudah cukup jadi jurnal trading.",false,"Salah. Jurnal mencatat alasan masuk, ukuran, rencana keluar, dan emosi. Screenshot nggak mencatat itu."),
        j("u13l3q2","Kalau terus rugi, yang harus diperbaiki itu apa?",[
          "Kebiasaan tradingmu, bukan 'koin yang sial'",
          "Ganti seed phrase walletmu biar terasa aman",
          "Hapus aplikasi tiap kali rugi lalu pasang lagi",
          "Masukkan semua modal supaya cepat balik modal",
        ],0,"Koin bisa berganti, tapi kebiasaan buruk ikut terus."),
        j("u13l3q3","Jurnal trading minimal berisi apa?",["Alasan masuk, ukuran, rencana keluar, dan emosi","Hanya angka keuntungan dan kerugian dari setiap transaksi","Hanya alamat kontrak yang pernah kamu beli tokennya","Hanya foto profil proyek yang sedang kamu pantau"],0,"Dari catatan itu kamu bisa lihat pola kesalahan yang berulang."),
      ]),
      L("u13", "u13-chest", "chest", "Peti rute 13", "Kepala masih di pundak.", "gift", [], { xp: 0, gems: 25 }),
      L("u13", "u13-l4", "lesson", "Bertahan", "Cuan butuh kamu masih hidup.", "flag", [
        tip("u13l4t", "Tujuan bukan jadi paus minggu ini.", "Tujuan: masih di meja tahun depan. Modal utuh, kunci aman, ukuran waras, umpan ditolak. web3min cuma peta, bukan dukun. Kamu yang nyetir.", {
          points: [
            "Hidup > FOMO.",
            "Seed tetep rahasia. Izin tetep dicek.",
            "Dua sisi PnL: Rp 20 miliar ada, −US$33 juta ada. Kamu pilih ukuran.",
          ],
          remember: "Hidup dulu, cuan belakangan.",
          proofs: ["cuan-20m", "rugi-33m", "rugi-roundtrip", "cuan-argus"],
        }),
        c("u13l4q1","Tujuan utama pemula di pasar kripto itu apa?",["Masih bertahan tahun depan dengan modal dan kunci yang aman","Menjadi paus dalam waktu satu minggu dengan modal kecil","Meniru semua panggilan yang dikirim di grup berbayar","Memakai leverage lima puluh kali setiap malam trading"],0,"Fokus utama pemula adalah menjaga modal tetap utuh agar punya kesempatan belajar jangka panjang."),
        tf("u13l4q2","web3min cuma peta belajar; semua keputusan dan risiko tetap ada di tanganmu.",true,"Benar. Kami nggak memberi jaminan cuan. Yang kami bagikan cara berpikir, bukan sinyal."),
        order("u13l4q3","Susun dari yang paling penting:",["Hidup","kunci","ukuran","cuan"],"Kebutuhan hidup dan keamanan kunci harus selalu didahulukan sebelum memikirkan keuntungan."),
        c("u13l4q4","Tawaran investasi yang kelihatan terlalu indah biasanya apa?",["Umpan berbahaya dari penipu","Kesempatan langka yang wajib diambil","Program resmi pemerintah","Strategi rahasia para paus"],0,"Keuntungan luar biasa tanpa risiko nyata hampir selalu skema penipuan."),
      ]),
      L("u13", "u13-cp", "checkpoint", "Ujian rute 13", "Kepala dingin dulu. Peta masih panjang.", "flag", [
        tip("u13cpt", "Ulangan kepala dingin", "Jeda. Jangan dendam. Tulis. Hidup.", {
          points: ["FOMO script.", "Revenge stop.", "Journal kebiasaan.", "Masih di meja."],
          remember: "Kamu yang nyetir.",
        }),
        tf("u13cp1","Teriakan 'last candle' di grup adalah alasan cukup buat all-in.",false,"Teriakan di grup seringkali sengaja dibuat untuk memicu FOMO agar orang lain membeli koin mereka."),
        c("u13cp2","Kalah trading dua kali berturut-turut. Langkah paling bijak?",[
          "Berhenti dulu hari itu dan tenangkan pikiran",
          "Langsung all-in untuk balas dendam ke pasar hari itu",
          "Pinjam uang teman untuk menambah modal",
          "Ganti semua pengaturan akun trading",
        ],0,"Jeda sejenak mencegah emosi memicu transaksi balas dendam yang merusak sisa modal."),
        blank("u13cp3","Catatan alasan masuk, ukuran posisi, dan emosi disebut ___.",[
          "journal",
          "rekening",
          "portofolio",
          "keuntungan",
        ],0,"Jurnal trading membantu mengevaluasi kesalahan dan membangun disiplin yang konsisten."),
        c("u13cp4","web3min dalam perjalanan belajarmu berperan sebagai apa?",["Peta pemandu","Dukun penentu harga","Admin grup sinyal","Paus penggerak pasar"],0,"Peta memberikan arah dan peringatan bahaya, namun kamu sendiri yang memegang kemudi."),
        c("u13cp5","Di grup Telegram muncul pesan 'airdrop terbatas, kirim gas fee dulu'. Mana yang paling mungkin umpan?",["Airdrop minta kirim ETH dulu", "Swap di DEX lewat bookmark", "Beli di exchange berizin", "Staking di situs resmi jaringan"],0,"Pola 'kirim dulu nanti dapat lebih' selalu penipuan klasik."),
      ]),
    ],
  },
];
