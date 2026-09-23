import type { Lesson } from "@/lib/curriculum";
import { c, tf, blank, match, order, tip, L } from "@/lib/curriculum";

export const EXTRA_BY_UNIT: Record<string, Lesson[]> = {
  u1: [
    L("u1", "u1-l6", "lesson", "Transaksi & blok", "Antrian, cap, baru nempel di buku.", "link", [
      tip("u1l6t", "Klik kirim bukan langsung 'selesai'", "Kamu nandatanganin pesan: 'pindahin aset ini ke alamat itu'. Masuk antrian (mempool). Validator/miner pilih, masukin ke blok. Blok itu disambung ke rantai. Satu cap = satu konfirmasi. Makin banyak blok di atasnya, makin susah dibalik.", {
        points: [
          "Pending = masih antri. Bukan HP rusak. Bisa lama kalo gas rendah atau jaringan ramai.",
          "Success di explorer = udah masuk blok. Di CEX, mereka sering nunggu beberapa konfirmasi sebelum kredit.",
          "Finalitas: di Bitcoin nunggu banyak blok. Di Ethereum pasca-Merge, biasanya dua epoch (~15 menit) baru 'hampir mustahil dibalik'.",
          "Salah alamat yang udah terkonfirmasi jarang bisa di-refund. Pending kadang masih bisa diganti (replace) pake gas lebih tinggi.",
        ],
        example: "Kirim USDT, status pending 8 menit. Bukan ilang. Tunggu atau speed-up. Jangan kirim berulang kali karena bisa terkirim ganda.",
        remember: "Tanda tangan → antri → blok → nunggu cap. Bukan tombol GoPay.",
      }),
      c("u1l6q1", "Mempool itu apaan?", ["Antrian transaksi yang belum masuk blok", "Nama seed", "Bank sentral", "Jenis NFT"], 0, "Ruang tunggu. Gas nentuin kamu ditolong cepat atau diem."),
      tf("u1l6q2", "Klik kirim di wallet = uang langsung nempel kayak GoPay.", false, "Masih antri. Baru nempel setelah masuk blok."),
      blank("u1l6q3", "Sekumpulan transaksi yang disambung ke rantai disebut ___.", ["blok", "seed", "floor", "gas"], 0, "Block. Rantai blok = blockchain."),
      c("u1l6q4", "Tx pending lama. Paling waras?", ["Tunggu atau speed-up. Jangan spam kirim ulang", "Kirim 10x", "Share seed ke validator", "Restart WiFi doang trus all-in"], 0, "Spam = bisa 10 transfer kalo yang pertama tiba-tiba lolos."),
      c("u1l6q5", "Kenapa CEX kadang nunggu beberapa konfirmasi?", ["Biar tx susah dibalik sebelum mereka kredit", "Biar gas mahal", "Syarat NFT", "Pajak 10x"], 0, "Reorg/pembalikan jarang, tapi mereka nggak mau kredit duit yang belum nempel."),
    ]),
    L("u1", "u1-l7", "lesson", "PoW vs PoS", "Tambang listrik, atau kunci aset.", "hexagon", [
      tip("u1l7t", "Dua cara jaga buku kas", "Supaya orang nggak nulis blok palsu, jaga jaringan harus mahal. PoW (Bitcoin): bayar listrik + mesin, yang nyelesain teka-teki boleh nulis blok. PoS (Ethereum sekarang): kunci ETH, kalo curang bisa di-slash (potong). Bukan soal 'yang mana agama', soal biaya nyerang.", {
        points: [
          "PoW: aman selama listrik + hardware mahal. Boros energi. Bitcoin tetap di sini.",
          "PoS: hemat listrik. Yang jaga = yang punya aset. Serangan butuh beli banyak koin, trus bisa ke-slash.",
          "Ethereum pindah PoS di Merge 2022. Bitcoin nggak ikut pindah. Jangan nyampur.",
          "Validator ≠ CS. Mereka nggak bisa balikin transfer salah. Mereka nulis urutan transaksi.",
        ],
        example: "Teman kira 'ETH udah nggak ditambang = ETH palsu'. Salah. Mesin jaganya yang ganti. Buku kasnya lanjut.",
        remember: "PoW bayar listrik. PoS kunci aset. Dua-duanya buat bikin curang itu mahal.",
      }),
      match("u1l7q1", "Pasangin mesinya.", [
        { left: "PoW", right: "Listrik + teka-teki" },
        { left: "PoS", right: "Kunci aset, bisa di-slash" },
        { left: "Bitcoin", right: "Tetap PoW" },
        { left: "Ethereum 2022+", right: "PoS (Merge)" },
      ]),
      tf("u1l7q2", "Validator bisa refund kalo kamu salah alamat.", false, "Mereka jaga urutan. Bukan CS bank."),
      c("u1l7q3", "Slash di PoS itu apaan?", ["Hukuman: aset validator dipotong kalo curang atau offline parah", "Airdrop", "Nama gas", "NFT"], 0, "Nyawa staker. Makanya jangan main validator pake tutorial abal."),
      c("u1l7q4", "Kenapa jaga jaringan harus 'mahal'?", ["Supaya nulis blok palsu nggak worth it", "Supaya gas 0", "Syarat pajak", "Biar ramai Discord"], 0, "Keamanan = serangan mahal. Bukan doa."),
    ]),
  ],
  u2: [
    L("u2", "u2-l5", "lesson", "Hot vs cold", "HP nyambung internet, kunci di kotak.", "lock", [
      tip("u2l5t", "Semakin online, semakin kesentuh", "Hot wallet: MetaMask, Phantom, app HP. Nyaman, gas tiap hari, juga yang paling sering kena drainer. Cold: hardware (Ledger, Trezor) atau kertas. Kunci nggak pernah ditaruh utuh di mesin yang online. Smart wallet / account abstraction: Smart contract wallet menawarkan fleksibilitas pemulihan akun namun tetap memiliki ketergantungan pada keamanan kontrak.", {
        points: [
          "Uang jajan on-chain: hot, kecil. Tabungan: cold. Jangan campur.",
          "Seed hardware ditulis di kertas/baja, bukan difoto, bukan di iCloud.",
          "Plugin browser bisa bohong (fake popup). Hardware nanya di layar kotak: cek alamat di situ, bukan di Chrome doang.",
          "Smart wallet enak buat recovery. Bukan alasan share seed. Dan kontrak wallet bisa ada bug.",
        ],
        example: "Gaji setahun di MetaMask yang dipake mint NFT gratis = satu tanda tangan salah, ludes. Pisahin.",
        remember: "Hot = saku. Cold = brankas. Jangan taruh gaji di saku bolong.",
      }),
      c("u2l5q1", "Hot wallet itu…", ["Kunci di app/HP yang online. Nyaman, lebih rawan", "Kotak di lemari es", "Rekening BCA", "Validator"], 0, "Saku. Bukan brankas."),
      tf("u2l5q2", "Hardware wallet = kebal semua scam, boleh sign apa aja tanpa baca.", false, "Kamu masih bisa nandatanganin drainer. Baca layar kotaknya."),
      c("u2l5q3", "Tabungan on-chain paling waras di mana?", ["Cold / hardware, seed offline", "MetaMask yang dipake mint tiap hari", "Screenshot seed di IG close friend", "Chat CS"], 0, "Pisahin jajan dan tabungan."),
      blank("u2l5q4", "Wallet yang kuncinya di perangkat khusus, nggak full di HP, disebut ___ wallet.", ["hardware", "meme", "gas", "floor"], 0, "Hardware / cold."),
    ]),
    L("u2", "u2-l6", "lesson", "Alamat racun", "Mirip banget. Salah tempel, duit nyasar.", "siren", [
      tip("u2l6t", "Poisoning: mereka kirim 0, biar kamu salah copas", "Penipu kirim token/NFT kecil dari alamat yang ujungnya mirip alamat yang pernah kamu pakai. Di history wallet, keliatan 'sama'. Penipu mengirim transaksi bernilai 0 dari alamat yang sengaja dibuat mirip agar kamu salah menyalin dari riwayat. Selalu periksa karakter alamat secara cermat.", {
        points: [
          "Jangan copas penerima dari tx masuk aneh. Pake address book / whitelist.",
          "Cek 6 karakter awal DAN akhir. Poisoning sering nyontek ujung.",
          "Setelah paste, liat lagi di layar. Malware clipboard nyata.",
          "ENS / nama yang kamu ketik sendiri lebih aman daripada history acak. Tetap cek resolvenya.",
        ],
        example: "Kamu sering kirim ke 0xABCaaa…123. Datang 0xABCbbb…123 kirim 0,0001. Kamu copas yang baru. Tx sukses. Duit di penipu.",
        remember: "History bukan rubrik aman. Cek ujung-pangkal, simpen buku alamat.",
      }),
      c("u2l6q1", "Address poisoning itu…", ["Alamat mirip di history, biar kamu salah copas", "Vitamin wallet", "Fitur L2", "Airdrop resmi"], 0, "Ujungnya disontek. Tengahnya beda."),
      tf("u2l6q2", "Aman copas penerima dari tx masuk yang nggak kamu kenal.", false, "Itu umpan poisoning."),
      c("u2l6q3", "Clipboard HP/laptop…", ["Bisa ditukar malware. Cek lagi setelah paste", "Nggak pernah salah", "Sama dengan seed", "Dijamin Chrome"], 0, "Periksa 4-6 karakter awal dan akhir."),
      order("u2l6q4", "Sebelum kirim.", ["Cek", "awal", "dan", "akhir", "alamat"], "Jangan cuma liat logo token."),
    ]),
  ],
  u3: [
    L("u3", "u3-l6", "lesson", "Halving Bitcoin", "Hadiah blok dipotong. Siklus, bukan janji 100x.", "bitcoin", [
      tip("u3l6t", "Kira-kira 4 tahun, hadiah miner belah dua", "Bitcoin nambah lewat hadiah blok. Awalnya 50 BTC, trus 25, 12.5, 6.25, 3.125 (2024). Namanya halving. Sekitar 4 tahun. Jumlah akhirnya ~21 juta. Orang bikin narasi 'habis halving pasti pump'. Kadang iya di siklus lama. Bukan hukum fisika. Banyak yang beli narasi, jadi likuiditas exit.", {
        points: [
          "Issuance turun ≠ harga otomatis naik. Permintaan juga harus ada.",
          "Siklus 4 tahun sering dibahas. Bukan jaminan kalender cuan.",
          "21 juta itu desain. Ada yang hilang (seed ilang). Yang bisa diperdagangkan lebih kecil.",
          "Jangan utang buat 'nangkep halving'. Yang ketinggalan kereta sering masuk paling mahal.",
        ],
        example: "2024 halving. Timeline 'wajib beli'. Ada yang naik, ada yang nyangkut. Kalender ≠ strategi.",
        remember: "Halving memotong hadiah miner. Bukan memotong risiko kamu.",
      }),
      c("u3l6q1", "Halving Bitcoin itu…", ["Hadiah blok miner dipotong kira-kira tiap 4 tahun", "Pajak 50%", "Merge ke PoS", "Airdrop"], 0, "Issuance turun. Harga? Tergantung permintaan."),
      tf("u3l6q2", "Habis halving, harga BTC dijamin 100x.", false, "Narasi. Bukan hukum."),
      blank("u3l6q3", "Jumlah BTC dibatasi sekitar 21 ___.", ["juta", "triliun", "wei", "gwei"], 0, "Sekitar 21 juta."),
      c("u3l6q4", "Sikap waras ke narasi halving?", ["Paham mekanismenya, jangan utang nangkep kalender", "All-in H-1", "Pinjam KPR", "Matikan otak"], 0, "Desain langka ≠ sinyal masuk."),
    ]),
    L("u3", "u3-l7", "lesson", "Rantai lain & wrapped", "ETH numpang, SOL beda dunia, WETH itu bungkus.", "network", [
      tip("u3l7t", "Banyak kota, jembatannya berbayar dan berisiko", "Bitcoin dan Ethereum bukan satu-satunya. Solana, BNB Chain, Base, Arbitrum, Cosmos, dll. Alamatnya bisa kelihatan mirip (0x di EVM) atau beda total (Solana). Wrapped: WETH = ETH yang dibungkus jadi token ERC-20 biar bisa masuk pool. WBTC = BTC yang dititip, dicetak di Ethereum. Ada pihak kustodian. Ada risiko.", {
        points: [
          "EVM (Ethereum, Base, Arb, BNB): alamat 0x, wallet yang sama sering bisa ganti jaringan.",
          "Solana: alamat beda, wallet beda (Phantom). Jangan kirim SOL ke alamat 0x.",
          "WETH ≈ ETH 1:1 di Ethereum, bisa di-wrap/unwrap. Bukan investasi baru.",
          "WBTC tergantung kustodian. 'BTC di Ethereum' bukan native BTC.",
        ],
        example: "Tarik 'ETH' dari CEX pilih BEP-20. Wallet kamu di ERC-20 kosong. Tx sukses. Nyasar.",
        remember: "Wrapped = bungkus. Rantai lain = kota lain. Cek jaringan, bukan cuma ticker.",
      }),
      match("u3l7q1", "Pasangin.", [
        { left: "WETH", right: "ETH dibungkus ERC-20" },
        { left: "WBTC", right: "BTC titipan, dicetak di ETH" },
        { left: "Solana", right: "Alamat & wallet beda" },
        { left: "Base / Arb", right: "EVM, alamat 0x" },
      ]),
      tf("u3l7q2", "Kirim SOL ke alamat 0x Ethereum selalu aman.", false, "Dunia beda. Sering hangus."),
      c("u3l7q3", "WETH itu…", ["ETH yang dibungkus biar jadi token di pool", "Koin baru yang lebih mahal", "Pajak", "Seed"], 0, "Bungkus. Bukan species baru."),
      c("u3l7q4", "WBTC native Bitcoin?", ["Bukan. Ada kustodian / mekanisme bungkus", "Ya, satoshi pindah fisik", "Ya, di USB", "Sama dengan cash"], 0, "Titip trus dicetak. Ada risiko pihak tengah."),
    ]),
  ],
  u4: [
    L("u4", "u4-l5", "lesson", "ERC-20, 721, 1155", "Standar tiket. Bukan jaminan bagus.", "badge", [
      tip("u4l5t", "Cetakan sama, isinya bisa sampah", "ERC-20: token yang bisa dibagi (uang, poin). ERC-721: NFT unik satu-satu. ERC-1155: bisa campuran, hemat gas, sering game. Standar = colokan listrik sama. Yang kamu colok bisa lampu, bisa setrum. Baca kontrak, bukan cuma 'ERC-20 jadi aman'.", {
        points: [
          "Approve ERC-20: izin tarik sejumlah token. Unlimited = pintu terbuka.",
          "setApprovalForAll di NFT: satu centang, semua NFT di kontrak itu bisa diambil.",
          "Pajak transfer / blacklist / pause: masih 'ERC-20', tetap bisa jahat.",
          "OpenSea dll. cuma etalase. Standarnya di rantai, bukan di app.",
        ],
        example: "Mint 'gratis' minta setApprovalForAll. Kamu centang. Besok PFP langka kamu pindah.",
        remember: "Standar = colokan. Bukan sertifikat halal.",
      }),
      match("u4l5q1", "Pasangin standar.", [
        { left: "ERC-20", right: "Token bisa dibagi" },
        { left: "ERC-721", right: "NFT unik" },
        { left: "ERC-1155", right: "Campuran, sering game" },
        { left: "setApprovalForAll", right: "Izin ambil semua NFT" },
      ]),
      tf("u4l5q2", "Tulisan ERC-20 di logo = aman dan nggak bisa dipajaki aneh.", false, "Standar colokan, bukan audit."),
      c("u4l5q3", "Mint gratis minta setApprovalForAll. Kamu?", ["Curiga drainer. Tolak kalo nggak perlu", "Centang biar cepat", "Share seed", "Unlimited USDC sekalian"], 0, "Satu centang, koleksi bisa raib."),
      blank("u4l5q4", "Token fungible di Ethereum biasanya standar ERC-___.", ["20", "721", "1559", "4337"], 0, "ERC-20."),
    ]),
  ],
  u5: [
    L("u5", "u5-l11", "lesson", "AMM & IL", "Kolam rumus. Geser harga, bisa kalah vs hold.", "swap", [
      tip("u5l11t", "Kamu bukan 'deposito'. Kamu jadi pasar", "AMM (Uniswap dkk.) nggak pake buku order. Harga dari rumus cadangan. Kamu taruh 2 token ke pool, orang swap lewat kamu, kamu dapet fee. Impermanent loss: kalo harga salah satu token lari jauh, nilai gabunganmu bisa kalah dibanding hold doang. 'Impermanent' kalo harga balik. Kalo nggak balik, tetep loss.", {
        points: [
          "x·y=k: beli banyak ETH dari pool, ETH berkurang, harganya naik di pool itu.",
          "Fee bisa nutup IL di pair ramai (ETH/USDC). Di pair liar, IL + rugpull lebih kenceng dari fee.",
          "Uniswap v3: likuiditas dipusatkan di rentang harga. Fee lebih gendut kalo kena, IL juga lebih galak kalo harga keluar rentang.",
          "LP token / NFT posisi = bukti kamu di pool. Hati-hati scam 'stake LP, APY 2000%'.",
        ],
        example: "Taruh ETH+USDC. ETH 3x. Pool otomatis jual ETH-mu ke yang beli. Kamu sisa lebih banyak USDC, lebih dikit ETH. vs hold ETH: kalah. Itu IL.",
        remember: "Fee nyata. IL nyata. Pair liar bukan tabungan.",
      }),
      c("u5l11q1", "AMM itu…", ["Pasar otomatis dari rumus cadangan, tanpa buku order", "Bank sentral", "CS 24 jam", "CEX selalu"], 0, "Rumus. Kamu likuiditasnya."),
      blank("u5l11q2", "Kalah vs hold karena harga geser di pool disebut ___ loss.", ["impermanent", "gas", "floor", "airdrop"], 0, "Impermanent. Bisa nempel permanen."),
      tf("u5l11q3", "Fee LP selalu nutup IL di meme pair sepi.", false, "Sering kebalik. Fee kecil, IL + rug gede."),
      c("u5l11q4", "Uniswap v3 rentang harga artinya…", ["Likuiditas dipusat. Fee bisa gede, IL lebih galak kalo harga cabut", "Bebas risiko", "Sama dengan deposito", "Pajak 0"], 0, "Senter, bukan ember. Keluar sinar, kamu cuma pegang satu aset."),
      c("u5l11q5", "Stake LP ke situs APY 2000%?", ["Curiga. Sering umpan nyedot LP", "Wajib", "Standar Aave", "Asuransi"], 0, "Fee pool di protokol yang kamu kenal. Bukan banner."),
    ]),
  ],
  u6: [
    L("u6", "u6-l5", "lesson", "Drainer & permit", "Satu tanda tangan, brankas kebuka.", "userx", [
      tip("u6l5t", "Bukan seed. Cukup izin", "Drainer modern jarang minta 12 kata di awal. Mereka minta kamu sign 'pesan': permit ERC-20, permit2, setApprovalForAll, atau 'increase allowance'. Simulasi di wallet kadang kelihatan '0 ETH'. Padahal izin tarik USDC/NFT. Ice phishing = kamu kira cuma login.", {
        points: [
          "Permit: tanda tangan off-chain, nanti dipakai narik token. Nggak ada tx gas dari kamu. Diam-diam.",
          "View/sign message ≠ selalu harmless. Baca: spend, unlimited, operator, setApprovalForAll.",
          "Situs klaim airdrop palsu, mint gratis jebakan, dan permintaan verifikasi dompet adalah panggung umum phishing.",
          "Kena? Cabut izin di revoke.cash / explorer. Pindahin sisa aset ke wallet baru. Seed yang sama = pintu yang sama kalo private key bocor; izin cukup di cabut.",
        ],
        example: "Klaim 'HYPE'. Sign. Saldo ETH aman. USDC 0. Permit. Bukan hacker masuk kamar. Kamu yang buka pintu.",
        remember: "Seed itu nyawa. Permit itu kunci cadangan yang sering dilupain.",
        proofs: ["scam-drainer", "warn-drained"],
      }),
      c("u6l5q1", "Drainer paling sering minta apa sekarang?", ["Tanda tangan izin (permit/approve), bukan seed di langkah pertama", "KTP asli ke rumah", "PIN ATM", "WiFi password"], 0, "Ice phishing. 'Cuma pesan'."),
      tf("u6l5q2", "Wallet nulis '0 ETH' artinya pasti aman ditandatanganin.", false, "Izin token nggak keliatan sebagai kirim ETH."),
      c("u6l5q3", "Kena permit. Langkah waras?", ["Cabut izin, pindahin sisa aset, jangan panik share seed ke 'helper'", "DM admin minta refund seed", "Kirim lagi biar 'dibalikin'", "Install 10 antivirus trus sign ulang"], 0, "Revoke. Wallet baru kalo kuncinya dicurigai bocor."),
      blank("u6l5q4", "Izin tarik token tanpa tx gas, lewat tanda tangan pesan, sering disebut ___.", ["permit", "halving", "floor", "gwei"], 0, "Permit / Permit2."),
    ]),
    L("u6", "u6-l6", "lesson", "RPC, SIM, 'support'", "Pintu samping: jaringan palsu, nomor dicuri.", "shield", [
      tip("u6l6t", "Bukan cuma link phishing", "Malicious RPC: wallet kamu disuruh ganti jaringan 'baru', tx dikirim ke node penipu yang dapat memanipulasi tampilan saldo atau mengarahkan ke transaksi berbahaya. SIM swap: nomor HP direbut, masuk email/CEX yang 2FA-nya SMS. Fake support: Discord/X 'bantuan' minta screen share atau seed. Screen share = mereka liat popup seed, atau remote.", {
        points: [
          "RPC ganti cuma dari docs resmi. Jangan dari DM 'biar klaim muncul'.",
          "2FA: authenticator app / security key, bukan SMS.",
          "Support resmi nggak DM duluan. Nggak minta seed. Nggak minta remote desktop.",
          "Membuka seed phrase di tempat umum atau di depan kamera merupakan celah keamanan fisik yang nyata.",
        ],
        example: "CEX 2FA SMS. Nomor dipindah operator. Login mereka, tarik saldo. Wallet on-chain aman, CEX-nya yang copot.",
        remember: "SMS bukan 2FA. RPC bukan dari DM. Support nggak ngetuk pintu.",
      }),
      c("u6l6q1", "SIM swap bahayanya ke apa?", ["Akun yang 2FA-nya SMS: email, CEX, Telegram", "Blockchain jadi offline", "Gas 0", "NFT ke-burn otomatis"], 0, "Ganti 2FA ke app/kunci. Nomor HP bukan brankas."),
      tf("u6l6q2", "Ganti RPC dari DM 'biar airdrop kelihatan' itu aman.", false, "Node palsu. Bookmark docs."),
      c("u6l6q3", "CS Discord minta screen share + seed. Itu?", ["Penipu", "Prosedur Ledger", "Syarat pajak", "L2"], 0, "Tutup. Blokir."),
      c("u6l6q4", "2FA paling waras?", ["Authenticator / security key, bukan SMS", "SMS doang", "Tanya admin grup", "Foto seed"], 0, "SMS bisa direbut."),
    ]),
  ],
  u8: [
    L("u8", "u8-l5", "lesson", "Funding & perps", "Bayar buat nahan posisi. Bukan spot.", "coins", [
      tip("u8l5t", "Perps itu taruhan tanpa jatuh tempo, ada sewa", "Perpetual futures: kamu long/short tanpa expired. Biar harga perps nempel ke spot, ada funding: yang mayoritas bayar ke yang minoritas, berkala (sering 8 jam atau terus-terusan). Long rame, funding plus: long bayar short. Kamu bisa 'bener arah' tapi tetep merih kalo nahan lawan funding gede.", {
        points: [
          "Spot: punya aset. Perps: kontrak. Nggak ada yang kamu 'pegang' selain P&L.",
          "Funding 0,1% per 8 jam kelihatan kecil. Setahun bisa gila kalo nempel.",
          "Open interest rame + funding ekstrem = pasar sesak, sering jebakan squeeze.",
          "Likuidasi perps = mesin bursa/DEX. Bukan 'nanti naik lagi'.",
        ],
        example: "Long meme 20x, funding 0,3%/8 jam. Arah naik dikit, funding nyedot. Trus wick, likuidasi. Kalah dua kali.",
        remember: "Perps sewa nyali. Funding itu sewa. Spot nggak nge-charge gitu.",
      }),
      c("u8l5q1", "Funding rate itu…", ["Sewa berkala antara long dan short biar harga perps nempel spot", "Pajak negara", "Gas L2", "Airdrop"], 0, "Mayoritas bayar minoritas."),
      tf("u8l5q2", "Long bener arah selalu cuan di perps, funding nggak ngaruh.", false, "Funding bisa nyedot pelan. Wick bisa nyita."),
      c("u8l5q3", "Beda spot sama perps?", ["Spot = punya aset. Perps = kontrak taruhan", "Sama aja", "Perps lebih aman soalnya 50x", "Spot selalu 100x"], 0, "Punya vs nyewa nyali."),
      blank("u8l5q4", "Futures tanpa tanggal jatuh tempo disebut ___ futures.", ["perpetual", "halving", "wrapped", "permit"], 0, "Perps."),
    ]),
  ],
  u10: [
    L("u10", "u10-l5", "lesson", "Testnet & simulasi", "Main di pasir sebelum duit beneran.", "flag", [
      tip("u10l5t", "Sepolia dulu, mainnet belakangan", "Testnet: rantai latihan, koinnya nggak berharga. Faucet kasih gas palsu. Cocok coba dapp, bridge, mint. Simulasi tx (wallet / Tenderly): liat 'nanti apa yang keubah' sebelum sign di mainnet. Simulasi transaksi sangat efektif menangkap banyak metode pengurasan dompet sebelum persetujuan on-chain dilakukan.", {
        points: [
          "Faucet minta seed = penipu. Testnet juga jangan kasih 12 kata.",
          "Alamat testnet kadang sama formatnya. Jangan kirim duit beneran ke net latihan.",
          "Simulasi 'success, 0 ETH' tetap baca izin token.",
          "Kontrak baru di mainnet tanpa audit + tanpa testnet public = flag.",
        ],
        example: "Mau coba bridge? Sepolia/faucet. Bukan 'coba kecil' di jembatan iklan yang minta unlimited USDC.",
        remember: "Pasir dulu. Duit belakangan. Simulasi baca, jangan cuma liat centang hijau.",
      }),
      c("u10l5q1", "Testnet itu…", ["Rantai latihan, asetnya nggak berharga", "Bank Indonesia", "CEX VIP", "NFT floor"], 0, "Pasir. Bukan gaji."),
      tf("u10l5q2", "Faucet testnet boleh minta 12 kata.", false, "Nggak pernah."),
      c("u10l5q3", "Simulasi tx hijau, 0 ETH. Cukup?", ["Belum. Baca izin token / NFT", "Aman total", "Wajib sign cepat", "Share ke grup"], 0, "Hijau bisa bohong soal permit."),
      c("u10l5q4", "Kirim ETH mainnet ke alamat yang kamu pake di testnet…", ["Bisa nyasar. Cek jaringannya", "Selalu sampai", "Airdrop", "Gas 0"], 0, "Format alamat bisa sama, rantai beda."),
    ]),
  ],
  u11: [
    L("u11", "u11-l5", "lesson", "Aturan Indonesia", "OJK, pajak, platform berizin. Bukan nasihat hukum.", "book", [
      tip("u11l5t", "Ini peta, bukan pengacara", "Di Indonesia regulasi aset keuangan digital terus berkembang di bawah otoritas pengawasan resmi. Aturannya hidup, bisa berubah. Platform lokal berizin beda sama DEX luar. Pajak/PPN/PPh pernah nempel di transaksi CEX. On-chain tetap jejak. web3min nggak ngasih tax-plan. Yang wajib: jangan kira 'anon = ga kelihatan', simpen catatan, cek sumber resmi, jangan cuma hafalan admin grup.", {
        points: [
          "Beli-jual di CEX lokal: ada aturan main + data namamu.",
          "Self-custody nggak ngilangin jejak on-chain, dan nggak otomatis 'ilegal' atau 'bebas pajak'.",
          "Iklan cuan 10% sehari + 'resmi OJK' di Telegram: sering palsu.",
          "Ragu kewajiban? Akuntan/konsultan yang kerjanya itu, bukan call group.",
        ],
        example: "Grup 'investasi kripto terdaftar OJK, bagi hasil 15%/bulan'. OJK nggak njamin skema gila. Nama besar dipinjam.",
        remember: "Aturan berubah. Catat. Cek sumber resmi. Bukan nasihat pajak.",
      }),
      c("u11l5q1", "Pengawasan perdagangan kripto di Indonesia belakangan lebih deket ke…", ["OJK (regulasi resmi pemerintah)", "Admin Telegram", "Uniswap DAO", "NASA"], 0, "Jangan hafal pasal dari stiker. Cek."),
      tf("u11l5q2", "Self-custody = negara mustahil liat dan otomatis bebas pajak.", false, "Jejak rantai ada. CEX lokal punya datamu. Tanya profesional."),
      c("u11l5q3", "Bagi hasil 15% sebulan ngaku 'terdaftar OJK'. Itu?", ["Umpan. Nama regulator sering dipinjam", "Deposito LPS", "Wajib ikut", "Standar staking ETH"], 0, "Terlalu indah + nama besar = umpan."),
      c("u11l5q4", "web3min soal pajak…", ["Peta jejak. Bukan konsultan. Catat, tanya yang ahli", "Wajib all-in", "Ajarin ngeles", "Njamin bebas"], 0, "Bukan nasihat hukum/pajak."),
    ]),
  ],
  u12: [
    L("u12", "u12-l5", "lesson", "LST & slashing", "stETH bukan bunga bank. Validator bisa kena potong.", "lock", [
      tip("u12l5t", "Kunci ETH, dapet kertas klaim", "Staking native: kunci 32 ETH jadi validator, ada unbond, ada slash. Orang males: kasih ke Lido/Rocket Pool, dapet stETH/rETH (liquid staking token). Harga LST bisa lepas dikit dari ETH (depeg). Protokol restaking (EigenLayer dkk.) nambah imbalan, nambah yang bisa salah. 'ETH 5% aman kayak deposito' = marketing.", {
        points: [
          "Slash: validator curang/offline parah, ETH-nya dipotong. LST menanggung dampak slashing secara kolektif dengan risiko yang terukur.",
          "stETH bisa ditukar, bisa dijadiin agunan. Itu leverage tersembunyi kalo kamu minjem di atasnya.",
          "Unstake native butuh waktu. LST 'instan' karena ada pasar. Pasar bisa kering pas panik.",
          "Situs 'stake ETH 20%/hari' minta wrap ke kontrak aneh: umpan.",
        ],
        example: "2022 stETH copot dari 1 ETH pas orang rame cabut. Yang minjem pake agunan stETH: likuidasi. Bukan 'ETH ilang'. Diskon kertas klaim.",
        remember: "LST = klaim staking yang bisa diperdagangkan. Bukan tabungan LPS. Slash + depeg nyata.",
      }),
      c("u12l5q1", "stETH itu apaan?", ["Klaim ETH yang di-stake, bisa diperdagangkan", "ETH palsu", "Pajak", "NFT"], 0, "Liquid staking token."),
      tf("u12l5q2", "LST selalu = 1 ETH, nggak bisa copot.", false, "Bisa depeg pas panik. Pasar, bukan sihir."),
      c("u12l5q3", "Slash itu…", ["Potongan ke validator yang curang/offline parah", "Airdrop", "Funding rate", "Floor NFT"], 0, "Nyawa staker."),
      c("u12l5q4", "Stake ETH 20% per hari di situs random?", ["Umpan", "Standar Lido", "OJK wajib", "Merge"], 0, "Bunga waras nggak berteriak."),
    ]),
  ],
  u14: [
    L("u14", "u14-l5", "lesson", "Optimistic vs ZK", "Dua jenis rollup, dua cara 'setor PR'.", "layers", [
      tip("u14l5t", "L2 bukan satu agama", "Optimistic rollup (Optimism, Arbitrum): anggap tx bener, kasih jendela tantangan (~7 hari withdraw native ke L1). ZK rollup (zkSync, Scroll, Starknet, dsb.): kirim bukti matematik, withdraw bisa lebih cepet kalo buktinya jadi. Bridge 'resmi' ikut jenis ini. Fast bridge pihak ketiga = tukar risiko (bisa lebih cepet, bisa hack).", {
        points: [
          "7 hari withdraw optimistic = desain, bukan bug. Fast bridge = orang lain nanggungin dulu.",
          "Sequencer L2 bisa down / urutan tx dikendalikan. Dana biasanya tetep bisa keluar ke L1, tapi nggak instan.",
          "Validium/alt-DA: data nggak full di L1. Lebih murah, beda jaminan.",
          "Base, Arb, OP: EVM, alamat 0x. Starknet: beda vibe. Jangan copas buta.",
        ],
        example: "Tarik native Arb → L1, nunggu hampir seminggu. Teman pake bridge instan + fee. Teman lebih cepet, nanggung risiko protokol jembatan.",
        remember: "Optimistic: tantangan. ZK: bukti. Instan biasanya pihak ketiga.",
      }),
      match("u14l5q1", "Pasangin.", [
        { left: "Optimistic", right: "Anggap bener, ada jendela tantangan" },
        { left: "ZK", right: "Kirim bukti matematik" },
        { left: "Withdraw native OP/Arb", right: "Bisa sekitar 7 hari" },
        { left: "Fast bridge", right: "Cepet, risiko pihak ketiga" },
      ]),
      tf("u14l5q2", "Semua L2 withdraw ke Ethereum selalu 3 detik, tanpa risiko tambahan.", false, "Native optimistic lama. Instan = biasanya pihak lain."),
      c("u14l5q3", "Sequencer L2 mati. Artinya asetmu…", ["Sering masih bisa keluar lewat L1, tapi nggak nyaman/instan", "Hangus otomatis", "Jadi BTC", "Dijamin LPS"], 0, "Jaminan ada di desain rollup. Nyaman ≠ jaminan."),
      blank("u14l5q4", "Rollup yang nunggu tantangan disebut ___ rollup.", ["optimistic", "permit", "wrapped", "halving"], 0, "Optimistic."),
    ]),
  ],
  u17: [
    L("u17", "u17-l5", "lesson", "Metadata & IPFS", "Gambarnya sering nggak di rantai.", "image", [
      tip("u17l5t", "Yang kamu beli sering pointer, bukan piksel", "NFT = token di rantai yang nunjuk metadata (nama, gambar, sifat). Gambarnya sering di IPFS, Arweave, atau server biasa. Server biasa bisa ganti gambar atau mati (rug pull visual). IPFS: konten punya hash, lebih bandel kalo ada yang pin. On-chain art: mahal, lebih 'nempel'.", {
        points: [
          "tokenURI bisa diubah kalo kontrak ada fungsi admin. 'Immutable' harus dicek, bukan diklaim di Twitter.",
          "Right-click save bukan transfer NFT. Yang berpindah = token di rantai.",
          "Royalti marketplace: opsional di banyak etalase. Bukan hukum alam.",
        ],
        example: "Floor 2 ETH. Tim cabut, metadata 404. Kamu pegang nomor di kontrak. Gambarnya ilang dari dunia.",
        remember: "NFT = catatan kepemilikan + pointer. Cek di mana file-nya hidup.",
      }),
      c("u17l5q1", "Gambar NFT biasanya…", ["Di IPFS/server, ditunjuk metadata. Bukan selalu di blok", "Selalu full on-chain", "Di iCloud Apple", "Di KTP"], 0, "Pointer. Cek tokenURI."),
      tf("u17l5q2", "Right-click save = kamu punya NFT-nya.", false, "Yang punya = yang pegang token di rantai."),
      c("u17l5q3", "Metadata 404 abis tim cabut. Artinya?", ["Pointer mati. Token masih ada, visual bisa ilang", "Otomatis refund", "LPS ganti", "Jadi ETH"], 0, "Cek storage. Jangan anggap JPEG = emas."),
      blank("u17l5q4", "Alamat konten di NFT sering disebut token ___.", ["URI", "gas", "seed", "gwei"], 0, "tokenURI."),
    ]),
  ],
  u18: [
    L("u18", "u18-l5", "lesson", "Revoke & smart wallet", "Cabut izin. Recovery bukan share seed.", "key", [
      tip("u18l5t", "Izin menumpuk, pintu kebuka pelan", "Tiap swap bisa ninggalin allowance. Kumpul setahun = museum pintu. Cabut yang nggak kepake (revoke.cash, explorer). Smart wallet (4337, Safe): bisa multisig, bisa social recovery, bisa limit harian, bisa session key. Enak. Tetap: guardian yang jahat = pintu. Jangan bayar 'recovery resmi' ke DM.", {
        points: [
          "Revoke makan gas. Cabut yang berbahaya dulu (unlimited USDC, NFT operator).",
          "Safe/multisig: 2-dari-3 lebih waras daripada 1 kunci HP.",
          "Social recovery: pilih guardian yang nggak gampang di-phishing bareng.",
          "Session key / 'connect game' = izin terbatas kalo bener. Baca durasi dan spend cap.",
        ],
        example: "Swap 2022, allowance unlimited ke kontrak yang nanti di-hack 2026. Cabut sekarang lebih murah daripada berita.",
        remember: "Izin menumpuk. Cabut. Recovery = desain, bukan CS Telegram.",
      }),
      c("u18l5q1", "Revoke itu…", ["Cabut izin kontrak yang pernah kamu kasih", "Hapus blockchain", "Refund gas", "Airdrop"], 0, "Tutup pintu yang lupa dikunci."),
      tf("u18l5q2", "Social recovery resmi dikirim via DM 'support wallet'.", false, "Umpan. Guardian kamu set sendiri di kontrak."),
      c("u18l5q3", "2-dari-3 multisig artinya…", ["Dua kunci harus setuju. Satu HP hilang belum kiamat", "Tiga seed dishare ke grup", "CS pegang semuanya", "LTV 90%"], 0, "Satu nyawa, tiga gembok, dua yang nutup."),
      blank("u18l5q4", "Cabut allowance disebut ___.", ["revoke", "halving", "mint", "depeg"], 0, "Revoke."),
    ]),
  ],
  u19: [
    L("u19", "u19-l5", "lesson", "ENS & nama", "web3min.eth enak. Tetap cek resolve-nya.", "map", [
      tip("u19l5t", "Nama cantik, resolusi bisa ditukar", "ENS: nama .eth yang nunjuk ke alamat. Enak diketik. Risiko: kamu kirim ke nama yang salah ketik, atau resolusi nama itu baru diubah pemiliknya, atau homograph (huruf mirip). Reverse lookup di explorer juga bisa ditumpangi. Nama ≠ KTP, ≠ audit, ≠ 'orang baik'.", {
        points: [
          "Sebelum kirim gede ke nama, cek alamat resolve di app resmi ENS / explorer.",
          "Ketik sendiri, jangan copas nama dari DM.",
          "Expired name bisa diserobot orang lain. Jangan anggap selamanya.",
          "Lens, Farcaster, handle sosial = identitas. Bukan kustodian duit kamu.",
        ],
        example: "Teman 'bayar ke justin_eth'. Yang resolve sekarang wallet baru. Yang lama kena phish. Kamu nggak cek. Duit nyasar.",
        remember: "Nama itu stiker. Cek alamat di belakang stiker.",
      }),
      c("u19l5q1", "ENS itu…", ["Nama yang nunjuk ke alamat. Tetap harus dicek resolvenya", "KTP on-chain wajib", "Bank", "Gas gratis"], 0, "Stiker cantik. Bukan jaminan."),
      tf("u19l5q2", "Kirim ke nama .eth dari DM, tanpa cek alamat, selalu aman.", false, "Homograph, salah ketik, resolve berubah."),
      c("u19l5q3", "Nama .eth expired…", ["Bisa diambil orang lain", "Nempel selamanya otomatis", "Jadi BTC", "Dijamin OJK"], 0, "Perpanjang kalo masih kepake."),
      blank("u19l5q4", "Nama Ethereum populer berakhiran .___.", ["eth", "com", "id", "sol"], 0, ".eth"),
    ]),
  ],
  u20: [
    L("u20", "u20-l7", "lesson", "Kontrak & audit", "Kode di rantai. Audit bukan jimat.", "book", [
      tip("u20l7t", "Baca kayak orang awam, cukup buat hidup", "Smart contract: program di rantai, biasanya nggak bisa 'minta maaf'. Proxy bisa di-upgrade (admin ganti logika). Audit: orang pinter cari lubang, kasih PDF. Bukan asuransi. Bug bounty: hadiah kalo kamu lapor lubang, bukan undangan hack. Unverified source di explorer = kamu buta. Tim anon + upgradeable + LTV gila = tiga bendera.", {
        points: [
          "Verified source di explorer: bisa dibaca. Bukan berarti aman, berarti nggak buta total.",
          "Proxy/upgradeable: nyaman buat tim, berarti ada tombol ganti aturan.",
          "Audit tahun lalu, kode baru minggu ini: audit lama nggak nutup yang baru.",
          "Kamu bukan auditor. Tapi kamu bisa nanya: siapa admin, bisa pause, bisa mint, oracle dari mana.",
        ],
        example: "PDF audit 40 halaman di website. Kontrak yang live: proxy baru, admin di EOA satu orang. Audit nutup yang lama. Yang baru belum.",
        remember: "Audit = PR. Bukan jimat. Admin key = raja. Oracle = mulut.",
      }),
      c("u20l7q1", "Audit smart contract artinya…", ["Seseorang cek lubang, kasih laporan. Bukan asuransi", "Kebal hack selamanya", "Dijamin OJK", "LPS"], 0, "PR. Kode bisa berubah abis itu."),
      tf("u20l7q2", "Proxy upgradeable berarti aturan nggak bisa diganti admin.", false, "Bisa. Itu poinnya. Cek siapa adminnya."),
      c("u20l7q3", "Unverified contract di explorer…", ["Kamu buta. Extra curiga", "Lebih aman soalnya rahasia", "Wajib LTV 90%", "Standar Uniswap"], 0, "Kaca gelap."),
      c("u20l7q4", "Yang bisa ditanya orang awam sebelum titip?", ["Admin, pause/mint, oracle, audit vs kode live", "PFP tim doang", "Jumlah stiker Telegram", "Warna candle"], 0, "Empat itu udah nangkep banyak mayat."),
      blank("u20l7q5", "Hadiah buat lapor lubang disebut bug ___.", ["bounty", "halving", "floor", "gwei"], 0, "Bounty. Bukan 'silakan dikuras diam-diam'."),
    ]),
  ],
};

export function withGapLessons<T extends { id: string; lessons: Lesson[] }>(units: T[]): T[] {
  return units.map((unit) => {
    const extra = EXTRA_BY_UNIT[unit.id];
    if (!extra?.length) return unit;
    const lessons = [...unit.lessons];
    const cp = lessons.findIndex((l) => l.kind === "checkpoint");
    const at = cp === -1 ? lessons.length : cp;
    lessons.splice(at, 0, ...extra);
    return { ...unit, lessons };
  });
}
