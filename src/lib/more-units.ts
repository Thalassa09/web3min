import type { Unit } from "@/lib/curriculum";
import { c, tf, blank, match, order, tip, L } from "@/lib/curriculum";

export const MORE_UNITS: Unit[] = [
  {
    id: "u7",
    index: 7,
    title: "Cuan vs hangus",
    subtitle: "Dari X beneran, bukan dongeng grup",
    color: "gold",
    lessons: [
      L("u7", "u7-l1", "lesson", "Dua sisi PnL", "Bisa segini. Bisa ilang segini.", "coins", [
        tip("u7l1t", "Screenshot hijau bukan jaminan hidup.", "Di X orang pamer PnL hijau. Yang hangus? Jarang dipost. Dua-duanya nyata, kok. Aku kumpulin cuplikannya biar kamu nggak cuma dikasih mimpi.", {
          points: [
            "PnL kertas (unrealized) bisa nyusut sebelum sempat kamu cairin.",
            "Paus bisa plus puluhan juta, trus minus puluhan juta, di minggu yang sama.",
            "Rp 20 miliar dalam 4 bulan memecoin itu ada. −$33 juta satu short juga ada.",
          ],
          example: "Ada orang Indo pamer kalender PnL hijau. Ada whale Hyperliquid hangus $33 juta. Dua screenshot, satu timeline.",
          remember: "Liat dua sisi dulu, baru gas.",
          proofs: ["cuan-20m", "rugi-33m", "cuan-argus", "rugi-machi"],
        }),
        c("u7l1q1", "PnL hijau di X artinya apa?", ["Bisa nyata, tapi bukan jaminan kamu bisa copy", "Kamu otomatis kaya kalo follow", "Pasti udah dicairin", "Nggak mungkin hangus"], 0, "Pameran doang. Bukan saran."),
        tf("u7l1q2", "Unrealized profit udah di tangan.", false, "Belum. Harga bisa balik sebelum sempat jual."),
        c("u7l1q3", "Kenapa aku nunjukin yang hangus juga?", ["Biar dua sisinya kelihatan", "Biar kamu takut total", "Biar iklan broker", "Biar skip unit 1"], 0, "Mimpi tanpa mayat itu umpan."),
        blank("u7l1q4", "Profit yang belum dijual disebut ___ profit.", ["unrealized", "realized", "airdrop", "gas"], 0, "Unrealized itu masih kertas."),
      ]),
      L("u7", "u7-l2", "lesson", "Realized vs kertas", "Yang di rekening, yang di layar.", "bank", [
        tip("u7l2t", "Kertas vs uang.", "Realized = udah jual, udah jadi saldo. Unrealized = angka yang masih nempel di posisi. Sebenernya banyak 'cuan $300k' di X itu masih kertas — atau emang udah dikunci. Baca captionnya, ya.", {
          points: [
            "Belum jual? Itu harapan, bukan gaji.",
            "Likuiditas memecoin sering nggak cukup buat semua orang keluar di puncak.",
            "Yang pamer realized lebih jarang. Soalnya lebih susah.",
          ],
          example: "Paus plus $6.6 juta di layar, trus buka long $87 juta. Satu gerak salah, angkanya nyusut.",
          remember: "Belum jual = belum punya.",
          proofs: ["cuan-300k", "cuan-whale", "rugi-paper", "cuan-421k"],
        }),
        tf("u7l2q1", "Realized artinya udah dikunci jadi saldo.", true, "Udah jual."),
        c("u7l2q2", "Semua holder memecoin bisa keluar di ATH?", ["Nggak. Likuiditas terbatas", "Ya, otomatis", "Ya kalo retweet", "Ya kalo pake VPN"], 0, "Yang terakhir biasanya dapet sisa."),
        c("u7l2q3", "Angka hijau gede di dashboard futures itu…", ["Bisa ilang sebelum ditarik", "Udah di rekening bank", "Bebas pajak otomatis", "Nggak bisa dilikuidasi"], 0, "Masih posisi, belum ditarik."),
      ]),
      L("u7", "u7-l3", "lesson", "Jual terlalu cepat", "Takut vs serakah.", "siren", [
        tip("u7l3t", "Dua cara hangus tanpa kena hack.", "Ada yang jual 2 menit, dapet $286, tokennya nanti $193 juta. Ada yang hold sampe balik modal kertas — tapi entry-nya jelek, tetep minus. Timing bukan doa, ya.", {
          points: [
            "Take profit bertahap lebih waras. All-in hold atau all-in jual? Gila.",
            "Harga naik nggak otomatis bikin kamu plus, kalo rata beli jelek.",
            "FOMO ngejar yang udah 10x? Sering jadi umpan exit buat yang awal.",
          ],
          example: "PNUT deployer jual 2 menit: $286. ATH-nya kemudian $193 juta. Bukan 'harus hold' — itu pelajaran soal ukuran dan rencana, bukan nasib.",
          remember: "Rencana keluar dulu, baru masuk.",
          proofs: ["fumble-193m", "rugi-entry", "cuan-zec-120k", "rugi-cut2"],
        }),
        c("u7l3q1", "Jual 2 menit, tokennya meledak. Artinya?", ["Rencana keluar penting, nasib juga nyata", "Wajib hold selamanya", "Kamu bodoh kalo take profit", "ATH dijamin ulang"], 0, "Bukan mantra hold, ya."),
        tf("u7l3q2", "Kalo harga naik dari entry kamu, kamu pasti plus.", false, "Bisa minus kalo nambah di atas trus panik jual."),
        order("u7l3q3", "Urutin yang waras.", ["Rencana", "ukuran", "masuk", "keluar"], "Masuk tanpa rencana itu judi."),
      ]),
      L("u7", "u7-chest", "chest", "Peti unit 7", "Nih, buat yang udah liat dua sisi.", "gift", [], { xp: 0, gems: 22 }),
      L("u7", "u7-l4", "lesson", "Jangan copy buta", "PnL orang bukan strategi kamu.", "userx", [
        tip("u7l4t", "Copytrade tanpa otak.", "Top 900 Hyperliquid dari HP itu ada, kok. Tapi kamu nggak liat modalnya, leverage-nya, malam insomnianya, atau yang hangus kemarin. Copy ukuran paus pake modal Rp 500 ribu? Bunuh diri.", {
          points: [
            "Ukuran posisi paus bukan ukuran kamu.",
            "Yang kelihatan: yang hidup, yang posting. Survivor bias.",
            "Kalo orang jualan sinyal, tanya: dia makan dari trading atau dari subscriber?",
          ],
          example: "Paus buka long $87 juta. Likuidasi $63k. Kamu nggak punya bantal itu.",
          remember: "Copy ide, jangan copy ukuran.",
          proofs: ["cuan-hl", "rugi-personal", "cuan-1m-week", "cuan-pnut17"],
        }),
        c("u7l4q1", "Paus buka posisi raksasa. Kamu ngapain?", ["Abaikan ukurannya, cek dulu kamu paham risikonya nggak", "All-in ikutan", "Pinjam uang", "Share seed biar 'di-copy'"], 0, "Ukuran paus bukan ukuran kamu."),
        tf("u7l4q2", "Yang posting PnL hijau pasti konsisten tiap bulan.", false, "Survivor bias. Yang merah jarang posting."),
        c("u7l4q3", "Sinyal berbayar? Anggap aja…", ["Hiburan, bukan jaminan", "Gaji tetap", "Asuransi", "Wajib pajak"], 0, "Banyak yang jualan harapan, sih."),
      ]),
      L("u7", "u7-cp", "checkpoint", "Ujian unit 7", "Hijau sama merah, dua-duanya ujian.", "flag", [
        tip("u7cpt", "Ulangan: cuan vs hangus", "Kalo lulus, kamu nggak gampang kena umpan screenshot.", {
          points: ["Unrealized ≠ gaji.", "Likuiditas terbatas.", "Copy ukuran paus = bahaya."],
          remember: "Dua sisi dulu, baru gas.",
        }),
        tf("u7cp1", "Unrealized udah di rekening.", false, "Belum jual."),
        c("u7cp2", "PnL di X paling waras dibaca sebagai apa?", ["Contoh, bukan janji", "Sinyal wajib", "Bukti kamu bakal kaya", "Asuransi"], 0, "Contoh doang."),
        blank("u7cp3", "Profit yang udah dijual disebut ___.", ["realized", "gas", "floor", "airdrop"], 0, "Realized."),
        c("u7cp4", "Token meledak abis kamu jual. Terus?", ["Bisa kejadian. Rencana kamu tetep sah", "Kamu gagal total", "Wajib buy back all-in", "Hapus app"], 0, "Rencana di atas rasa."),
      ]),
    ],
  },
  {
    id: "u8",
    index: 8,
    title: "Trading dasar",
    subtitle: "Spot dulu. Leverage belakangan — atau jangan.",
    color: "blue",
    lessons: [
      L("u8", "u8-l1", "lesson", "Spot vs leverage", "Punya vs nyewa nyali.", "swap", [
        tip("u8l1t", "Spot itu beli. Leverage itu utang.", "Spot: kamu punya aset. Turun 50%, aset masih ada. Leverage / futures: kamu pinjam daya. Turun dikit, bisa dilikuidasi — saldo nyaris nol. Banyak yang 'trading' di HP itu futures, bukan spot.", {
          points: [
            "Spot = modal kamu yang jadi batas rugi.",
            "Leverage 10x: gerak 10% lawan arah bisa hapus posisi.",
            "Likuidasi bukan 'nanti balik'. Itu tutup paksa.",
          ],
          example: "Beli 0.01 BTC di Binance spot: punya. Buka long 10x di futures: pinjaman. Jangan ketuker cuma karena UI-nya mirip.",
          remember: "Belum lancar spot? Jangan pegang futures.",
        }),
        c("u8l1q1", "Bedanya spot sama leverage?", ["Spot punya aset. Leverage bisa dilikuidasi", "Sama aja", "Leverage lebih aman", "Spot selalu 100x"], 0, "Punya vs pinjam."),
        tf("u8l1q2", "Likuidasi artinya nunggu harga balik.", false, "Posisi udah dipaksa tutup."),
        blank("u8l1q3", "Pinjam daya di futures disebut ___.", ["leverage", "staking", "airdrop", "gas"], 0, "Leverage."),
        c("u8l1q4", "Pemula paling waras mulai dari mana?", ["Spot ukuran kecil", "Futures 50x", "Pinjam temen", "Copy paus"], 0, "Spot. Kecil aja, deh."),
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
        tf("u8l2q1", "Stop loss itu buat pengecut.", false, "Rem. Yang profesional pake rem."),
        c("u8l2q2", "Cross margin artinya apa?", ["Saldo lain bisa tersedot", "Lebih aman dari isolated", "Nggak ada likuidasi", "Gratis fee"], 0, "Bisa nyebar luka."),
        c("u8l2q3", "Kapan paling gampang kena likuidasi?", ["Berita mendadak + leverage gede", "Hold spot 4 tahun", "Transfer on-chain", "Isi nama profil"], 0, "Volatilitas kali utang."),
      ]),
      L("u8", "u8-l3", "lesson", "Ukuran posisi", "Satu peluru per trade.", "flag", [
        tip("u8l3t", "Jangan all-in.", "Tentukan rugi maksimal per trade — misalnya 1–2% modal. Kalo ide salah, kamu masih hidup. All-in + revenge trade = film pendek.", {
          points: [
            "Risiko per ide, bukan 'feeling'.",
            "Naikin ukuran cuma setelah catatan (journal) bilang kamu mampu.",
            "Yang hangus $426 dalam sehari sering karena ukuran, bukan karena 'koinnya salah'.",
          ],
          example: "Modal Rp 2 juta, risiko 2% = Rp 40 ribu per ide. Bukan Rp 2 juta.",
          remember: "Hidup dulu, cuan belakangan.",
          proofs: ["rugi-personal", "cuan-indo-lev", "rugi-roundtrip"],
        }),
        c("u8l3q1", "All-in satu koin itu…", ["Satu peluru. Kalo salah, habis", "Strategi paus", "Wajib memecoin", "Ngurangin risiko"], 0, "Satu peluru."),
        tf("u8l3q2", "Revenge trade abis kalah biasanya waras.", false, "Emosi. Jeda dulu."),
        blank("u8l3q3", "Batas rugi per ide disebut risiko ___.", ["posisi", "gas", "floor", "airdrop"], 0, "Posisi."),
      ]),
      L("u8", "u8-chest", "chest", "Peti unit 8", "Remmu dihargai.", "gift", [], { xp: 0, gems: 22 }),
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
        tf("u8l4q1", "Harga candle selalu sama dengan harga isianmu.", false, "Slippage."),
        c("u8l4q2", "Market order cocok kapan?", ["Butuh isi cepet dan pasar dalam", "Koin sepi 2 orang", "Semua memecoin", "Isi seed"], 0, "Pasar dalam."),
        c("u8l4q3", "Spread lebar isyarat apa?", ["Likuiditas tipis atau kacau", "Proyek bagus", "Airdrop", "Gas murah"], 0, "Sepi / kacau."),
      ]),
      L("u8", "u8-cp", "checkpoint", "Ujian unit 8", "Spot, rem, ukuran.", "flag", [
        tip("u8cpt", "Ulangan trading dasar", "Kalo masih campur spot sama futures, ulangi dulu.", {
          points: ["Spot punya. Leverage pinjam.", "Likuidasi final.", "Ukuran hidupin kamu."],
        }),
        tf("u8cp1", "Leverage 10x aman kalo 'yakin'.", false, "Yakin nggak nahan likuidasi."),
        c("u8cp2", "Stop loss itu…", ["Rem", "Sial", "Pajak", "NFT"], 0, "Rem."),
        blank("u8cp3", "Beli aset langsung tanpa pinjam disebut ___.", ["spot", "short", "perp", "airdrop"], 0, "Spot."),
        c("u8cp4", "All-in itu…", ["Satu peluru", "Wajib", "Asuransi", "DYOR"], 0, "Satu peluru."),
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
        tip("u9l1t", "Meme = cerita + likuiditas tipis.", "Harga memecoin sering dikendaliin segelintir wallet. Volume bisa palsu. 'Community' bisa 3 bot sama 1 admin. Boleh main kecil. Jangan pake uang sewa, deh.", {
          points: [
            "Supply di developer / bundler = mereka bisa dump.",
            "Market cap di layar ≠ uang yang bisa ditarik.",
            "Yang masuk terakhir sering jadi exit buat yang awal.",
          ],
          example: "MC $10 juta, likuiditas $40 ribu. Kalo 10 orang jual, harga bolong.",
          remember: "Main kecil, anggap hangus.",
          proofs: ["cuan-pnut17", "cuan-argus", "rugi-nuked", "rugi-roundtrip"],
        }),
        c("u9l1q1", "Market cap gede di meme artinya apa?", ["Bukan jaminan bisa cair", "Semua bisa keluar ATH", "Aman kayak BTC", "Udah diaudit"], 0, "MC ≠ kas."),
        tf("u9l1q2", "Volume 24 jam selalu organik.", false, "Bisa wash trading."),
        c("u9l1q3", "Uang sewa buat memecoin?", ["Jangan", "Wajib", "Makin gede makin aman", "Disubsidi exchange"], 0, "Jangan, deh."),
      ]),
      L("u9", "u9-l2", "lesson", "Honeypot & pajak aneh", "Bisa beli, nggak bisa jual.", "lock", [
        tip("u9l2t", "Perangkap klasik.", "Honeypot: kontrak izinin beli, blokir jual. Pajak jual 99%. Blacklist wallet. Cek simulator jual (token sniffer, honeypot.is, rugcheck) sebelum gas.", {
          points: [
            "Kalo cuma bisa beli, itu bukan kesempatan — itu jebakan.",
            "Renounced bukan jaminan. Bisa udah dipasang jebakan sebelumnya.",
            "CA dari DM / komentar = curiga.",
          ],
          example: "Klik beli di Telegram, chart hijau, jual gagal 'transfer from failed'. Honeypot.",
          remember: "Simulasi jual dulu.",
        }),
        blank("u9l2q1", "Bisa beli tapi nggak bisa jual disebut ___.", ["honeypot", "airdrop", "staking", "L2"], 0, "Honeypot."),
        tf("u9l2q2", "Renounced = 100% aman.", false, "Jebakan bisa dipasang sebelum renounce."),
        c("u9l2q3", "CA dari komentar random. Gimana?", ["Curiga, cek dulu", "Langsung beli", "Share seed", "Trust"], 0, "Curiga."),
      ]),
      L("u9", "u9-l3", "lesson", "LP & rug", "Kunci likuiditas, atau kabur.", "fuel", [
        tip("u9l3t", "Likuiditas itu pintu keluar.", "Kalo LP nggak dikunci / bisa ditarik owner, mereka cabut kolam, harga ke nol. Ini rugpull versi meme. Cek lock, cek owner.", {
          points: [
            "LP unlocked + owner aktif = risiko cabut.",
            "Mint function hidup = supply bisa digelontor.",
            "Bundle launch (banyak wallet tim) sering dump terkoordinasi.",
          ],
          example: "Chart 100x dalam 11 menit, LP dicabut menit ke-12. Sisa kamu: NFT kenangan.",
          remember: "Pintu keluar dulu, cerita belakangan.",
        }),
        tf("u9l3q1", "LP unlocked itu biasa aman.", false, "Bisa dicabut."),
        c("u9l3q2", "Mint function masih hidup artinya?", ["Supply bisa nambah", "Udah audited", "Nggak bisa rug", "Gas gratis"], 0, "Bisa dilutif."),
        c("u9l3q3", "Sebelum ape, cek apa dulu?", ["LP, owner, pajak, simulasi jual", "PFP admin", "Jumlah emoji", "Musik di space"], 0, "Mekanik, bukan vibe."),
      ]),
      L("u9", "u9-chest", "chest", "Peti unit 9", "Buat yang cek CA.", "gift", [], { xp: 0, gems: 22 }),
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
        c("u9l4q1", "Call abis 5x itu…", ["Sering jadi umpan exit", "Paling aman", "Wajib all-in", "Sama kayak listing BTC"], 0, "Kamu likuiditas."),
        tf("u9l4q2", "Grup berbayar njamin cuan.", false, "Sering jualan harapan."),
        c("u9l4q3", "Admin larang nanya CA. Gimana?", ["Red flag", "Profesional", "Syarat bursa", "L2"], 0, "Red flag."),
      ]),
      L("u9", "u9-cp", "checkpoint", "Ujian unit 9", "Meme, jebakan, pintu.", "flag", [
        tip("u9cpt", "Ulangan memecoin", "Simulasi jual. Cek LP. Main kecil.", { points: ["Honeypot.", "LP unlock.", "Kamu bukan inner circle."] }),
        blank("u9cp1", "Beli bisa, jual nggak: ___.", ["honeypot", "spot", "NFT", "gas"], 0, "Honeypot."),
        tf("u9cp2", "MC = uang yang bisa ditarik semua orang.", false, "Likuiditas jauh lebih kecil."),
        c("u9cp3", "LP bisa dicabut owner…", ["Risiko rug", "Fitur staking", "Asuransi", "Airdrop"], 0, "Rug."),
        c("u9cp4", "Call group itu…", ["Hiburan, bukan gaji", "Bank", "L2", "Pajak"], 0, "Hiburan."),
      ]),
    ],
  },
  {
    id: "u10",
    index: 10,
    title: "DYOR",
    subtitle: "Explorer, kontrak, holder — bukan feeling",
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
        c("u10l1q1", "Nama token di wallet…", ["Bisa ditiru. Cek kontrak", "Selalu unik", "Udah diaudit", "Nggak bisa palsu"], 0, "Nama murah."),
        tf("u10l1q2", "Chart di situs random sama validnya dengan explorer.", false, "Bisa dipalsu."),
        c("u10l1q3", "Top holder 80% di 3 wallet. Artinya?", ["Risiko dump gede", "Sehat", "Wajib buy", "Sama kayak BTC"], 0, "Konsentrasi."),
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
        tf("u10l2q1", "Approve unlimited itu nyaman dan selalu aman.", false, "Pintu kebuka."),
        c("u10l2q2", "Abis coba dapp random, kamu ngapain?", ["Revoke izin yang nggak perlu", "Biarkan selamanya", "Share seed", "Naikin leverage"], 0, "Revoke."),
        blank("u10l2q3", "Kasih izin token ke kontrak disebut ___.", ["approve", "airdrop", "stake", "bridge"], 0, "Approve."),
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
        c("u10l3q1", "Satu audit PDF itu…", ["Bukan tiket aman", "Jaminan 100%", "Wajib all-in", "Ngapus honeypot"], 0, "Bisa palsu / sempit."),
        tf("u10l3q2", "1 juta followers = proyek serius.", false, "Bisa dibeli."),
        c("u10l3q3", "Mint hidup + LP unlock…", ["Numpuk risiko", "Sinyal beli", "Standar ERC-20", "L2"], 0, "Numpuk."),
      ]),
      L("u10", "u10-chest", "chest", "Peti unit 10", "Kacamata skeptis.", "gift", [], { xp: 0, gems: 22 }),
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
        tf("u10l4q1", "CS yang DM duluan minta kode = resmi.", false, "Penipu."),
        c("u10l4q2", "Cara buka exchange paling aman?", ["Ketik URL / app resmi yang kamu bookmark", "Klik iklan paling atas", "Dari komentar", "Dari QR di warung random"], 0, "Bookmark."),
        c("u10l4q3", "1 huruf beda di domain. Itu apa?", ["Phishing klasik", "CDN", "L2", "Gas"], 0, "Phishing."),
      ]),
      L("u10", "u10-cp", "checkpoint", "Ujian unit 10", "CCTV, izin, sumber.", "flag", [
        tip("u10cpt", "Ulangan DYOR", "Alamat > nama. Izin = senjata. Ketik sendiri.", { points: ["Explorer.", "Approve.", "Sumber resmi."] }),
        tf("u10cp1", "Nama token unik di semua rantai.", false, "Bisa ditiru."),
        blank("u10cp2", "Izin token ke kontrak: ___.", ["approve", "mint", "bridge", "gas"], 0, "Approve."),
        c("u10cp3", "CS DM minta seed. Siapa itu?", ["Penipu", "Prosedur", "Pajak", "L2"], 0, "Penipu."),
        c("u10cp4", "Tumpuk sinyal artinya apa?", ["Jangan andalin 1 centang", "Beli semua", "Matikan DYOR", "All-in"], 0, "Tumpuk."),
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
            "CEX bagus buat on-ramp rupiah — pilih yang berizin.",
            "Jangan simpen gaji setahun di CEX. 'Not your keys'.",
            "DEX butuh gas dan ketelitian jaringan.",
          ],
          example: "Beli USDT di CEX lokal, tarik ke wallet, swap di DEX. Tiap langkah bisa salah jaringan.",
          remember: "Titip sebentar, simpen sendiri yang jangka panjang.",
        }),
        c("u11l1q1", "Not your keys artinya apa?", ["Kalo titip, itu bukan sepenuhnya kamu", "Seed boleh dishare", "CEX nggak pernah rugi", "DEX ilegal"], 0, "Kunci = kuasa."),
        tf("u11l1q2", "DEX punya CS 24 jam kayak bank.", false, "Nggak."),
        c("u11l1q3", "On-ramp rupiah buat pemula biasanya lewat mana?", ["CEX / P2P berizin", "DM Telegram random", "Kirim ke 'admin'", "Honeypot"], 0, "Jalur resmi."),
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
        tf("u11l2q1", "Pindah chat ke WA pribadi itu aman.", false, "Sering lepas perlindungan escrow."),
        c("u11l2q2", "Harga USDT jauh di bawah pasar. Kenapa?", ["Curiga rekening kotor / umpan", "Wajib gas", "Airdrop", "L2"], 0, "Curiga."),
        c("u11l2q3", "Escrow itu…", ["Tahan dana sampe selesai", "Pajak", "Seed", "NFT"], 0, "Tahan."),
      ]),
      L("u11", "u11-l3", "lesson", "Pajak & jejak", "Negara juga baca rantai.", "book", [
        tip("u11l3t", "Bukan nasihat pajak. Sadar jejak.", "Di Indonesia, aset kripto dan transaksi bisa kena aturan yang berubah. Simpen riwayat. Jangan kira 'on-chain = ga kelihatan'. CEX lokal punya datamu. Ini bukan ajakan ngeles — ini ajakan jangan kaget.", {
          points: [
            "Catat beli/jual. Screenshot jelek, CSV lebih bagus.",
            "Pindah CEX → wallet tetep jejak.",
            "Kalo ragu, tanya orang yang kerjanya pajak, bukan admin grup.",
          ],
          example: "Untung memecoin Rp 50 juta, kaget pas ada kewajiban. Catatan dari hari 1 lebih murah daripada panik.",
          remember: "Jejak ada, catat.",
        }),
        tf("u11l3q1", "On-chain artinya negara mustahil liat.", false, "Bisa dilacak, plus data CEX."),
        c("u11l3q2", "Nasihat pajak paling waras dari siapa?", ["Profesional, bukan admin Telegram", "Call group", "Komentar meme", "AI random tanpa cek"], 0, "Profesional."),
        c("u11l3q3", "Catatan transaksi itu…", ["Temenmu saat kaget", "Buang-buang waktu", "Wajib seed", "Honeypot"], 0, "Catat."),
      ]),
      L("u11", "u11-chest", "chest", "Peti unit 11", "On-ramp yang waras.", "gift", [], { xp: 0, gems: 22 }),
      L("u11", "u11-l4", "lesson", "Off-ramp", "Jadi rupiah lagi.", "bank", [
        tip("u11l4t", "Keluar lebih susah daripada masuk.", "Bank bisa nanya sumber dana. Rekening kena hold. Pecah transaksi, nama jelas, platform berizin. Jangan cuci lewat orang random yang 'bisa cairin'.", {
          points: [
            "Off-ramp resmi lebih lambat, lebih hidup.",
            "Orang random 'cairin 10 menit' = risiko rekening kamu dipake.",
            "Stablecoin bukan 'uang tunai di bawah bantal'. Masih ada jembatan.",
          ],
          example: "Temen 'bisa cairin USDT ke DANA 5 menit, fee 2%'. Datanya masuk rekening gelap. Kamu yang ditanya.",
          remember: "Keluar lewat pintu, bukan jendela.",
        }),
        c("u11l4q1", "Cairin lewat orang random 5 menit. Aman?", ["Risiko rekening / dana kotor", "Paling profesional", "Standar L2", "Airdrop"], 0, "Jendela, bukan pintu."),
        tf("u11l4q2", "Stablecoin otomatis sama dengan cash di ATM.", false, "Masih perlu jembatan."),
        c("u11l4q3", "Bank nanya sumber dana. Gimana?", ["Wajar. Punya catatan", "Langgar HAM", "Ignore", "Hapus app"], 0, "Catatan."),
      ]),
      L("u11", "u11-cp", "checkpoint", "Ujian unit 11", "Masuk, keluar, jejak.", "flag", [
        tip("u11cpt", "Ulangan CEX & Indo", "Titip sebentar. Escrow. Catat.", { points: ["Keys.", "P2P.", "Jejak."] }),
        tf("u11cp1", "Simpen semua aset jangka panjang di CEX itu ideal.", false, "Not your keys."),
        c("u11cp2", "P2P trus pindah ke WA…", ["Red flag", "Wajib", "Lebih escrow", "Gas"], 0, "Red flag."),
        blank("u11cp3", "Beli di bursa titipan disebut ___.", ["CEX", "DEX", "LP", "NFT"], 0, "CEX."),
        c("u11cp4", "Off-ramp yang waras itu…", ["Platform berizin, nama jelas", "Orang random 5 menit", "DM admin", "Honeypot"], 0, "Pintu."),
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
      L("u12", "u12-l1", "lesson", "Staking", "Kunci aset, dapet imbalan — kadang.", "lock", [
        tip("u12l1t", "Staking resmi vs 'staking' palsu.", "Staking rantai: kunci di protokol, ada slashing, ada unbond. 'Staking' di website random: sering titip ke orang. APY 2000% dari mana? Biasanya dari duit orang baru, atau token yang dilutif.", {
          points: [
            "Tanya: imbalan dibayar pake apa? Inflasi token = kamu dibayar kertas.",
            "Unbonding 14–21 hari itu normal di banyak rantai. 'Instan + 20% per hari' justru aneh.",
            "Situs staking minta seed = penipu.",
          ],
          example: "Validator ETH vs situs 'stake BTC 3% per hari'. Yang kedua hampir pasti skema.",
          remember: "Bunga waras jarang berteriak.",
        }),
        c("u12l1q1", "APY 2000% di banner. Percaya?", ["Curiga. Dari mana duitnya?", "Wajib gas", "Standar BTC", "Asuransi"], 0, "Dari mana?"),
        tf("u12l1q2", "Situs staking boleh minta 12 kata.", false, "Nggak pernah."),
        blank("u12l1q3", "Kunci aset di protokol rantai disebut ___.", ["staking", "phishing", "rug", "gas"], 0, "Staking."),
      ]),
      L("u12", "u12-l2", "lesson", "Farm & vault", "Imbalan dari fee, atau dari angin.", "coins", [
        tip("u12l2t", "Yield farming bukan deposito.", "Kamu kasih likuiditas, dapet fee + token. Impermanent loss, smart contract risk, token reward dump. Vault yang 'auto compound 40% sehari' sering ponzi cantik.", {
          points: [
            "IL: harga aset di pool geser, kamu bisa kalah vs hold.",
            "Reward token bisa nol sebelum kamu jual.",
            "TVL tiba-tiba = sering insentif, bukan cinta.",
          ],
          example: "Pool aneh APY 800%, TVL meledak seminggu, reward dump, sisa IL.",
          remember: "Fee nyata > bunga poster.",
        }),
        tf("u12l2q1", "APY poster dijamin setahun.", false, "Bisa ambruk minggu ini."),
        c("u12l2q2", "Impermanent loss itu…", ["Bisa kalah vs hold", "Asuransi", "Pajak", "NFT"], 0, "Geser harga."),
        c("u12l2q3", "Vault 40% sehari. Mungkin?", ["Hampir pasti skema", "Standar USDT", "L2", "CEX"], 0, "Skema."),
      ]),
      L("u12", "u12-l3", "lesson", "Double & giveaway", "Yang minta deposit dulu.", "gift", [
        tip("u12l3t", "Ulangi mantra.", "Double ETH, giveaway 'kirim dulu', airdrop minta gas ke alamat admin. Sama kayak unit 6, sekarang kamu udah liat PnL nyata — jangan bayar umpan.", {
          points: [
            "Hadiah resmi nggak minta kamu transfer dulu.",
            "Koneksi wallet + tanda tangan aneh = bisa cabut izin.",
            "Kalo terlalu indah, itu umpan.",
          ],
          proofs: ["cuan-20m", "fumble-193m"],
          remember: "Terlalu indah = umpan.",
        }),
        tf("u12l3q1", "Double ETH 10 menit itu produk DeFi standar.", false, "Umpan."),
        c("u12l3q2", "Giveaway minta kirim 0.1 dulu. Itu apa?", ["Scam", "KYC", "Gas resmi", "Staking"], 0, "Scam."),
        order("u12l3q3", "Hafalin mantranya.", ["Kalau", "terlalu", "indah", "itu", "umpan"], "Simpen."),
      ]),
      L("u12", "u12-chest", "chest", "Peti unit 12", "Bunga yang nggak berteriak.", "gift", [], { xp: 0, gems: 22 }),
      L("u12", "u12-l4", "lesson", "Imbalan dari mana", "Nggak ada makan siang gratis.", "layers", [
        tip("u12l4t", "Ikutin duitnya.", "Fee transaksi, inflasi token, duit deposan baru, atau dump ke kamu. Tulis di kertas. Kalo nggak bisa jelasin ke temen warung, jangan masuk.", {
          points: [
            "Inflasi: kamu dibayar token yang makin banyak, makin murah.",
            "Ponzi: bunga dari orang belakang.",
            "Fee riil: swap, pinjam, lelang — ada pengguna yang bayar.",
          ],
          example: "Protokol pinjam: peminjam bayar bunga, pemberi dapet bagian. Masuk akal. 'Tanpa peminjam, 5% per hari' nggak.",
          remember: "Bisa dijelasin = boleh ditimbang.",
        }),
        c("u12l4q1", "Bunga tanpa sumber jelas. Masuk?", ["Jangan masuk", "All-in", "Pinjam bank", "Share seed"], 0, "Jangan."),
        tf("u12l4q2", "Token reward selalu naik harganya.", false, "Sering dilutif."),
        c("u12l4q3", "Sumber yield paling waras dari mana?", ["Fee pengguna nyata", "Orang belakang", "Banner 2000%", "DM admin"], 0, "Fee."),
      ]),
      L("u12", "u12-cp", "checkpoint", "Ujian unit 12", "Bunga, umpan, sumber.", "flag", [
        tip("u12cpt", "Ulangan yield", "Dari mana duitnya? Seed nggak buat staking web.", { points: ["Staking palsu.", "APY poster.", "Sumber fee."] }),
        tf("u12cp1", "APY 2000% wajar buat BTC.", false, "Aneh."),
        c("u12cp2", "Staking minta seed. Siapa?", ["Penipu", "Standar", "L2", "Pajak"], 0, "Penipu."),
        blank("u12cp3", "Geser harga di pool bisa bikin ___ loss.", ["impermanent", "gas", "floor", "airdrop"], 0, "Impermanent."),
        c("u12cp4", "Nggak bisa jelasin sumber bunganya…", ["Jangan masuk", "Gas", "Naikin APY", "All-in"], 0, "Jangan."),
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
        tip("u13l1t", "Rasa ketinggalan itu produk.", "Timeline hijau dirancang bikin kamu masuk telat. Kalo udah 5–10x, tanya: siapa yang butuh likuiditas keluar? FOMO boleh dirasa. Jangan dipake nyetir.", {
          points: [
            "Jeda 10 menit. Minum air. Cek CA.",
            "Kalo 'sekarang atau nggak pernah', itu script umpan.",
            "Kesempatan lain ada. Modal yang hangus nggak balik.",
          ],
          example: "Grup teriak 'last candle'. Kamu ape. Mereka jual.",
          remember: "Jeda dulu, baru klik.",
          proofs: ["rugi-entry", "cuan-20m"],
        }),
        tf("u13l1q1", "Kalo nggak ape sekarang, kesempatan hilang selamanya.", false, "Script umpan."),
        c("u13l1q2", "FOMO? Jawabnya…", ["Jeda dan cek", "All-in", "Pinjam", "Tutup DYOR"], 0, "Jeda."),
        c("u13l1q3", "Kereta udah 10x. Kamu?", ["Kamu mungkin likuiditas", "Paling aman", "Wajib 50x leverage", "Asuransi"], 0, "Likuiditas."),
      ]),
      L("u13", "u13-l2", "lesson", "Dendam", "Menebus luka dengan luka baru.", "userx", [
        tip("u13l2t", "Revenge trade.", "Kalah, trus naikin ukuran biar 'balik cepet'. Itu cara klasik −$426 jadi −$4 juta. Tutup laptop. Jalan. Tulis journal. Besok.", {
          points: [
            "Aturan: abis 2 kalah, stop hari itu.",
            "Naikin ukuran cuma saat tenang, bukan saat panas.",
            "PnL harian merah bukan undangan all-in.",
          ],
          example: "Trader nulis: greed, overconfidence, impatience. Satu hari −$426. Itu masih murah kalo jadi pelajaran.",
          remember: "Stop, jangan tebus.",
          proofs: ["rugi-personal"],
        }),
        c("u13l2q1", "Abis kalah, naikin ukuran. Boleh?", ["Revenge. Bahaya", "Profesional", "Wajib", "DYOR"], 0, "Dendam."),
        tf("u13l2q2", "Dua kalah beruntun = sinyal all-in.", false, "Sinyal jeda."),
        blank("u13l2q3", "Trading balas dendam disebut ___ trade.", ["revenge", "spot", "airdrop", "gas"], 0, "Revenge."),
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
        tf("u13l3q1", "Screenshot hijau = journal cukup.", false, "Nggak ada rencana di situ."),
        c("u13l3q2", "Yang harus dibenerin itu…", ["Kebiasaan, bukan 'koin sial'", "Hapus app tiap rugi", "Ganti seed", "All-in"], 0, "Kebiasaan."),
        c("u13l3q3", "Isi journal minimal apa aja?", ["Ide, ukuran, keluar, emosi", "Cuma PnL", "Cuma CA", "Cuma PFP"], 0, "Proses."),
      ]),
      L("u13", "u13-chest", "chest", "Peti unit 13", "Kepala masih di pundak.", "gift", [], { xp: 0, gems: 25 }),
      L("u13", "u13-l4", "lesson", "Bertahan", "Cuan butuh kamu masih hidup.", "flag", [
        tip("u13l4t", "Tujuan bukan jadi paus minggu ini.", "Tujuan: masih di meja tahun depan. Modal utuh, kunci aman, ukuran waras, umpan ditolak. Aku peta, bukan dukun. Kamu yang nyetir.", {
          points: [
            "Hidup > FOMO.",
            "Seed tetep rahasia. Izin tetep dicek.",
            "Dua sisi PnL: Rp 20 M ada, −$33 jt ada. Kamu pilih ukuran.",
          ],
          remember: "Hidup dulu, cuan belakangan.",
          proofs: ["cuan-20m", "rugi-33m", "rugi-roundtrip", "cuan-argus"],
        }),
        c("u13l4q1", "Tujuan utama pemula itu apa?", ["Masih di meja tahun depan", "Jadi paus minggu ini", "Copy semua call", "50x tiap malam"], 0, "Hidup."),
        tf("u13l4q2", "web3min njamin cuan.", false, "Peta, bukan dukun."),
        order("u13l4q3", "Urutin dulu.", ["Hidup", "kunci", "ukuran", "cuan"], "Selamat."),
        c("u13l4q4", "Kalo terlalu indah…", ["Itu umpan", "Wajib", "Airdrop resmi", "Pajak"], 0, "Umpan."),
      ]),
      L("u13", "u13-cp", "checkpoint", "Ujian unit 13", "Kepala dingin dulu. Peta masih panjang.", "flag", [
        tip("u13cpt", "Ulangan kepala dingin", "Jeda. Jangan dendam. Tulis. Hidup.", {
          points: ["FOMO script.", "Revenge stop.", "Journal kebiasaan.", "Masih di meja."],
          remember: "Kamu yang nyetir.",
        }),
        tf("u13cp1", "Last candle = alasan cukup buat all-in.", false, "Script."),
        c("u13cp2", "Kalah dua kali. Ngapain?", ["Stop hari itu", "All-in", "Pinjam", "Share seed"], 0, "Stop."),
        blank("u13cp3", "Catatan proses disebut ___.", ["journal", "gas", "floor", "airdrop"], 0, "Journal."),
        c("u13cp4", "web3min itu apa?", ["Peta", "Dukun", "Admin grup", "Paus"], 0, "Peta."),
        c("u13cp5", "Kalo terlalu indah…", ["Umpan", "Gaji", "L2", "Pajak"], 0, "Umpan."),
      ]),
    ],
  },
];
