import { MORE_UNITS } from "@/lib/more-units";
import { LATER_UNITS } from "@/lib/later-units";
import { withGapLessons } from "@/lib/complete-lessons";
import { withProofs } from "@/lib/proof";

export type UnitColor = "green" | "blue" | "gold" | "purple" | "teal" | "red";

export type LessonIcon =
  | "globe"
  | "layers"
  | "link"
  | "bank"
  | "wallet"
  | "key"
  | "lock"
  | "map"
  | "bitcoin"
  | "hexagon"
  | "coins"
  | "image"
  | "badge"
  | "swap"
  | "fuel"
  | "network"
  | "shield"
  | "siren"
  | "userx"
  | "gift"
  | "flag"
  | "book"
  | "briefcase"
  | "users"
  | "zap"
  | "search"
  | "repeat";

export type ChoiceExercise = {
  type: "choice";
  id: string;
  prompt: string;
  options: string[];
  answer: number;
  explanation: string;
  blobi?: string;
  proofs?: string[];
};

export type TfExercise = {
  type: "tf";
  id: string;
  prompt: string;
  answer: boolean;
  explanation: string;
  blobi?: string;
  proofs?: string[];
};

export type BlankExercise = {
  type: "blank";
  id: string;
  prompt: string;
  options: string[];
  answer: number;
  explanation: string;
  blobi?: string;
  proofs?: string[];
};

export type MatchExercise = {
  type: "match";
  id: string;
  prompt: string;
  pairs: { left: string; right: string }[];
  explanation?: string;
  blobi?: string;
  proofs?: string[];
};

export type OrderExercise = {
  type: "order";
  id: string;
  prompt: string;
  pieces: string[];
  answer: string[];
  explanation: string;
  blobi?: string;
  proofs?: string[];
};

export type TipExercise = {
  type: "tip";
  id: string;
  title: string;
  body: string;
  points?: string[];
  example?: string;
  remember?: string;
  proofs?: string[];
};

export type Exercise =
  | ChoiceExercise
  | TfExercise
  | BlankExercise
  | MatchExercise
  | OrderExercise
  | TipExercise;

export type LessonKind = "lesson" | "chest" | "checkpoint";

export type Lesson = {
  id: string;
  unitId: string;
  kind: LessonKind;
  title: string;
  blurb: string;
  icon: LessonIcon;
  xp: number;
  gems: number;
  exercises: Exercise[];
};

export type Unit = {
  id: string;
  index: number;
  title: string;
  subtitle: string;
  color: UnitColor;
  lessons: Lesson[];
};

export function c(
  id: string,
  prompt: string,
  options: string[],
  answer: number,
  explanation: string,
  blobi?: string,
): ChoiceExercise {
  return { type: "choice", id, prompt, options, answer, explanation, blobi };
}

export function tf(
  id: string,
  prompt: string,
  answer: boolean,
  explanation: string,
  blobi?: string,
): TfExercise {
  return { type: "tf", id, prompt, answer, explanation, blobi };
}

export function blank(
  id: string,
  prompt: string,
  options: string[],
  answer: number,
  explanation: string,
  blobi?: string,
): BlankExercise {
  return { type: "blank", id, prompt, options, answer, explanation, blobi };
}

export function match(
  id: string,
  prompt: string,
  pairs: { left: string; right: string }[],
  blobi?: string,
): MatchExercise {
  return { type: "match", id, prompt, pairs, blobi };
}

export function order(
  id: string,
  prompt: string,
  pieces: string[],
  explanation: string,
  blobi?: string,
): OrderExercise {
  return { type: "order", id, prompt, pieces, answer: [...pieces], explanation, blobi };
}

export const j = c;
export const M = tf;
export const N = blank;
export const F = order;
export const P = match;
export const I = tip;

export function tip(
  id: string,
  title: string,
  body: string,
  extra?: { points?: string[]; example?: string; remember?: string; proofs?: string[] },
): TipExercise {
  return { type: "tip", id, title, body, ...extra };
}

export function L(
  unitId: string,
  id: string,
  kind: LessonKind,
  title: string,
  blurb: string,
  icon: LessonIcon,
  exercises: Exercise[],
  extras?: { xp?: number; gems?: number },
): Lesson {
  const xp = extras?.xp ?? (kind === "checkpoint" ? 20 : kind === "chest" ? 0 : 12);
  const gems = extras?.gems ?? (kind === "chest" ? 20 : kind === "checkpoint" ? 8 : 2);
  return { id, unitId, kind, title, blurb, icon, xp, gems, exercises };
}

export const CORE_UNITS: Unit[] = [
  {
    id: "u1",
    index: 1,
    title: "Kenalan sama Web3",
    subtitle: "Internet yang kuncinya di kamu",
    color: "green",
    lessons: [
      L("u1", "u1-l1", "lesson", "Internet versi baru", "Web3 itu apaan, tanpa jargon yang ngebingungin.", "globe", [
        tip("u1l1t", "Web3 itu apa, sebenernya?", "Internet yang kamu pakai tiap hari, seperti Instagram, GoPay, dan mobile banking, itu Web2. Datanya hidup di server perusahaan. Mereka yang pegang. Mereka yang bisa kunci atau pulihin akunmu.", {
          points: [
            "Web3: aset digital dicatat di jaringan bersama, namanya blockchain. Bukan di satu kantor.",
            "Yang pegang kunci wallet = yang pegang aset. Nggak ada tombol 'lupa password' dari CS.",
            "Blockchain itu buku kas yang disalin banyak komputer. Mau diubah diam-diam? Susah. Harus nipu hampir semua salinannya.",
          ],
          example: "GoPay: saldo disimpan perusahaan. Ada CS. Wallet Web3: saldo kebaca dari blockchain. Kalau kuncinya hilang, nggak ada CS yang bisa balikin.",
          remember: "Kunci di kamu, tanggung jawab juga di kamu.",
        }),
        c(
          "u1l1q1",
          "Web3 itu apaan, sih?",
          [
            "Internet yang kuncinya di kamu, asetnya juga",
            "Browser baru buatan Google",
            "WiFi yang lebih kencang",
            "Aplikasi chatting pengganti WhatsApp",
          ],
          0,
          "Intinya: aset tercatat di jaringan. Kuncinya di kamu, bukan di perusahaan.",
          "Santai. Kita mulai dari kata yang paling sering kedengeran.",
        ),
        tf(
          "u1l1q2",
          "Di internet biasa (Web2), data kamu biasanya disimpan di server perusahaan.",
          true,
          "Iya. Instagram, Gojek, dan bank, datanya ada di mereka.",
        ),
        tip("u1l1t2", "Blockchain, versi manusia", "Nanti kamu sering denger kata blockchain. Anggap aja buku kas digital yang dibagi ke banyak orang. Tiap halaman baru (blok) ngunci halaman sebelumnya. Jadi rantai.", {
          points: [
            "Bukan kabel internet, bukan nama bank, bukan WiFi lebih kencang.",
            "Karena banyak salinan, satu laptop rusak nggak bikin buku kasnya hilang.",
            "Siapa pun bisa liat transaksi di explorer. Namamu nggak otomatis tertulis, tapi alamatnya publik.",
          ],
          example: "Kayak grup arisan yang semua anggota punya fotokopi buku kas. Kalau satu orang coret angkanya, yang lain masih punya salinan asli.",
          remember: "Blockchain = catatan bersama. Wallet = kuncinya.",
        }),
        blank(
          "u1l1q3",
          "Di Web3, catatan asetnya hidup di ___.",
          ["blockchain", "email", "USB", "WiFi"],
          0,
          "Blockchain = buku kas bersama yang disalin banyak komputer.",
        ),
        c(
          "u1l1q4",
          "Blockchain itu kayak apa?",
          [
            "Buku kas yang disalin banyak orang, susah diubah diam-diam",
            "Spreadsheet di laptop kamu doang",
            "Chat group keluarga",
            "Folder Drive yang bisa dihapus admin",
          ],
          0,
          "Karena banyak salinan, nipu satu buku aja nggak cukup. Harus nipu hampir semua.",
        ),
        c(
          "u1l1q5",
          "Kenapa orang Indonesia perlu paham Web3?",
          [
            "Biar nggak gampang kena tipu dan bisa pakai aset digital dengan aman",
            "Karena pemerintah mewajibkan",
            "Supaya WiFi rumah jadi gratis",
            "Karena harus mining di rumah",
          ],
          0,
          "Paham dulu, baru main. Banyak yang rugi soalnya keburu-buru.",
          "Ini bukan biar kamu FOMO. Ini biar kamu selamat.",
        ),
        tip("u1l1t3", "Web3 bukan cuma chart", "Orang kira web3 = trading crypto. Itu cuma satu gang. Masih ada dompet, DeFi, NFT, airdrop, identitas on-chain, yang bikin app. Kita masuk pelan dari hutan.", {
          points: [
            "Trading: chart, kadang leverage. Bisa cuan, bisa hangus. Satu gang doang.",
            "DeFi: tukar, pinjam, kasih likuiditas. Nggak lewat bank. Tetap ada risiko kontrak.",
            "NFT: bukan cuma gambar monyet. Tiket, identitas, karya. Floor bukan ATM.",
            "Airdrop: Ada yang dapat airdrop karena rajin pakai produk, tapi banyak juga yang nggak dapat apa-apa.",
            "Yang paling penting: kunci & aman. Salah di sini, yang lain nggak ada artinya.",
          ],
          example: "Teman cuma jembatan ke Arbitrum biar gas murah. Taunya eligible airdrop. Yang lain pinjam di DeFi. Yang lain mint tiket konser. Bukan semua orang nge-chart.",
          remember: "Web3 = internet yang kuncinya di kamu. Trade cuma salah satu pintunya.",
          proofs: ["drop-arb-18k", "drop-wif-1k5", "drop-met-34k", "drop-uni-ath"],
        }),
        c(
          "u1l1q6",
          "Selain trading, orang di web3 juga ngapain?",
          [
            "Pake DeFi, pegang NFT, klaim airdrop, jaga kunci",
            "Cuma nunggu sinyal grup",
            "Wajib mining di rumah",
            "Harus kerja di bursa",
          ],
          0,
          "Banyak pintu. Chart cuma satu gang.",
        ),
        tf(
          "u1l1q7",
          "Web3 itu cuma crypto trading.",
          false,
          "Bukan. Ada dompet, DeFi, NFT, airdrop, jaringan, aman. Trading salah satu rute.",
        ),
      ]),
      L("u1", "u1-l2", "lesson", "Web2 vs Web3", "Bedanya sama app yang kamu buka tiap hari.", "layers", [
        tip("u1l2t", "Bedanya di siapa yang pegang kunci", "Web2 nyaman: ada CS, ada 'lupa password', ada perusahaan yang jaga server. Web3 nuker kenyamanan itu sama kendali. Kamu bisa kirim aset tanpa izin bank. Tapi salah kirim juga susah dibatalin.", {
          points: [
            "Web2: data dan saldo di perusahaan (GoPay, Instagram, rekening bank).",
            "Web3: kunci di kamu. Hilang seed phrase biasanya berarti aset hangus.",
            "Bank / e-wallet bisa reset PIN kalau kamu buktikan identitas. Blockchain nggak kenal KTP.",
          ],
          example: "Akun Instagram hilang → minta bantuan email/CS. Wallet Web3 hilang tanpa backup seed → nggak ada 'ibu' yang bisa buka pintunya.",
          remember: "Kamu pegang kunci asetmu sendiri.",
        }),
        match(
          "u1l2q1",
          "Pasangin yang nyambung.",
          [
            { left: "Web2", right: "Perusahaan pegang data" },
            { left: "Web3", right: "Kamu pegang kunci" },
            { left: "Bank", right: "Bisa reset password" },
            { left: "Wallet sendiri", right: "Hilang seed = hangus" },
          ],
          "Kayak ngebedain GoPay sama dompet yang kuncinya di kamu.",
        ),
        c(
          "u1l2q2",
          "Kalau akun Instagram kamu hilang, biasanya apa yang kamu lakukan?",
          [
            "Bisa minta bantuan lewat email / CS",
            "Otomatis kehilangan semua foto selamanya tanpa celah",
            "Harus beli HP baru",
            "Harus ganti WiFi",
          ],
          0,
          "Web2 masih ada 'ibu' yang bisa bantu. Web3 sering nggak.",
        ),
        tf(
          "u1l2q3",
          "Di Web3, selalu ada customer service yang bisa balikin aset kalau kamu lupa kata sandi.",
          false,
          "Ini bedanya yang paling keras: nggak ada tombol 'lupa password' di blockchain.",
        ),
        c(
          "u1l2q4",
          "Contoh kendali di Web3 yang nggak ada di Web2?",
          [
            "Kamu bisa kirim aset ke siapa pun tanpa izin bank atau app store",
            "Kamu bisa hapus internet tetangga",
            "Kamu bisa atur harga BBM",
            "Kamu otomatis kaya",
          ],
          0,
          "Izinnya dari jaringan, bukan dari teller. Tapi salah kirim juga susah dibatalin.",
        ),
        order(
          "u1l2q5",
          "Susun prinsip utama kepemilikan kunci di Web3:",
          ["Kamu", "pegang", "kunci", "asetmu", "sendiri"],
          "Itu kalimat yang harus nempel di kepala.",
        ),
      ]),
      L("u1", "u1-l3", "lesson", "Blockchain", "Buku kas yang nggak gampang dipalsuin.", "link", [
        tip("u1l3t", "Buku kas yang dibagi-bagi", "Blockchain = rantai blok. Tiap blok isinya tumpukan transaksi, terus disambung ke blok sebelumnya. Jaringan ini disalin di banyak komputer. Jadi nggak ada satu server keramat.", {
          points: [
            "Ngedit riwayat kayak ngedit Excel? Nggak. Harus ngalahin mayoritas jaringan.",
            "Komputer yang jaga dan cek transaksi disebut validator (dulu sering disebut miner).",
            "Transaksi publik: siapa pun bisa liat di explorer. Transparan bukan berarti namamu tertulis.",
          ],
          example: "Kalau satu warung kopi rusak komputernya, buku kas rantai tetap ada di warung lain. Jaringan nggak mati cuma karena satu mesin.",
          remember: "Banyak salinan + rantai yang ngunci = susah dipalsuin diam-diam.",
        }),
        c("u1l3q1","DApp itu singkatan dari apa?",["Decentralized application, aplikasi yang backend-nya smart contract","Aplikasi khusus buat penambang","Aplikasi perbankan biasa","Dokumen aplikasi"],0,"Decentralized application. Bedanya di backend: kontrak di rantai, bukan server kantor."),
        tf(
          "u1l3q2",
          "Ngedit riwayat transaksi di blockchain publik itu gampang kayak ngedit Excel.",
          false,
          "Harus ngalahin mayoritas jaringan. Makanya catatan ini dipercaya.",
        ),
        blank(
          "u1l3q3",
          "Komputer yang jaga jaringan dan ngecek transaksi disebut ___.",
          ["validator", "influencer", "teller", "admin Telegram"],
          0,
          "Dulu sering disebut miner. Intinya: mereka yang jaga jaringan.",
        ),
        c(
          "u1l3q4",
          "Kenapa transaksi blockchain kerasa 'terbuka'?",
          [
            "Siapa pun bisa liat riwayat di explorer, meski namamu nggak tertulis",
            "Semua orang dapet password kamu",
            "Pemerintah menayangkannya di TV",
            "Wallet memposting ke Instagram",
          ],
          0,
          "Alamat itu publik. Namamu nggak otomatis nempel. Tapi polanya bisa dilacak.",
          "Transparan ≠ anonim total. Ingat itu.",
        ),
        c(
          "u1l3q5",
          "Kalau satu komputer yang menyimpan salinan blockchain rusak, bagaimana kondisi jaringannya?",
          [
            "Tetap jalan, karena banyak salinan lain",
            "Langsung hilang semua uang",
            "Harus di-restart dari nol",
            "Pindah ke Excel",
          ],
          0,
          "Itu poin 'terdistribusi'. Nggak ada satu server keramat.",
        ),
      ]),
      L("u1", "u1-chest", "chest", "Peti rute 1", "Hadiah kecil biar semangat.", "gift", [], { xp: 0, gems: 20 }),
      L("u1", "u1-l4", "lesson", "Kripto vs uang bank", "Sama-sama digital, beda aturan main.", "bank", [
        tip("u1l4t", "Digital, tapi aturannya beda", "Saldo BCA dan saldo Bitcoin sama-sama angka di layar. Bedanya: rekening bank dijamin aturan negara (plus LPS sampai batas tertentu) dan bisa di-refund kalau salah transfer. Kripto on-chain biasanya final.", {
          points: [
            "Uang bank / GoPay / DANA: ada CS, ada reset PIN, saldo di perusahaan atau bank.",
            "Kripto on-chain: kamu jaga kunci. Salah alamat sering berarti uang pergi.",
            "Stablecoin (USDT, USDC) didesain ngikutin dolar. Lebih tenang dari meme coin, bukan nol risiko.",
          ],
          example: "Transfer BCA salah → sering bisa dikomplain. Kirim USDT ke alamat salah di blockchain → teller nggak bisa tarik balik.",
          remember: "Kripto boleh, tapi jangan pakai uang makan.",
        }),
        c(
          "u1l4q1",
          "Saldo di rekening bank konvensional di Indonesia dijamin oleh lembaga apa?",
          [
            "Bank dan aturan negara (plus LPS sampai batas tertentu)",
            "Validator Ethereum",
            "Admin grup Telegram",
            "Aplikasi wallet",
          ],
          0,
          "Uang bank punya jaring pengaman hukum. Kripto on-chain nggak gitu.",
        ),
        tf(
          "u1l4q2",
          "Transfer kripto on-chain bisa dibatalin teller kalau kamu salah alamat.",
          false,
          "Salah alamat sering berarti uang pergi. Cek tiga kali dulu sebelum kirim.",
          "Ini bagian yang bikin web3min deg-degan.",
        ),
        match(
          "u1l4q3",
          "Pasangin yang nyambung.",
          [
            { left: "Uang bank", right: "Ada CS & reset PIN" },
            { left: "Kripto on-chain", right: "Kamu yang jaga kunci" },
            { left: "GoPay / DANA", right: "Saldo di perusahaan" },
            { left: "Wallet Web3", right: "Kunci di HP / seed" },
          ],
        ),
        blank(
          "u1l4q4",
          "Kripto yang harganya ngikutin dolar disebut ___.",
          ["stablecoin", "meme coin", "Token permainan", "gas"],
          0,
          "USDT, USDC, dan sejenisnya didesain ngikutin USD. Bukan jaminan 100% bebas risiko.",
        ),
        c(
          "u1l4q5",
          "Yang mana yang jujur?",
          [
            "Kripto bisa bermanfaat, tapi risikonya kamu tanggung sendiri",
            "Kripto dijamin untung tiap hari",
            "Kalau rugi, bank wajib ganti",
            "Semua koin sama amannya dengan rupiah di tabungan",
          ],
          0,
          "Alat baru, tanggung jawab baru. Jangan pakai uang makan.",
        ),
      ]),
      L("u1", "u1-l5", "lesson", "Pintu-pintu web3", "DeFi, kerja, DAO, NFT. Bukan cuma chart.", "map", [
        tip("u1l5t", "Kota ini banyak gang, bukan cuma pasar saham", "Orang Indo sering masuk web3 karena chart. Sah-sah. Tapi kota ini lebih luas: ada bank tanpa teller (DeFi), ada kerjaan, ada komunitas yang punya kas bersama (DAO), ada karya dan tiket (NFT), ada yang bikin app.", {
          points: [
            "DeFi: tukar, pinjam, kasih likuiditas. Nggak lewat bank. Tetap ada risiko kontrak.",
            "Kerja: community, intern, engineer, desainer, BD, konten. Gaji, bounty, grant. Bukan sinyal grup.",
            "DAO: komunitas + kas on-chain. Ada voting. Bukan otomatis jadi kantor.",
            "NFT: karya, tiket, identitas. Bukan ATM lantai.",
            "Bikin: orang nulis kode, desain, dokumentasi. Web3 butuh tangan, bukan cuma chart.",
          ],
          example: "Teman A swap di DEX. Teman B intern community. Teman C nulis proposal DAO. Teman D mint tiket konser. Empat orang, satu rantai. Bukan empat trader.",
          remember: "Trade satu pintu. Kota ini banyak gang.",
        }),
        match(
          "u1l5q1",
          "Pasangin pintunya.",
          [
            { left: "DeFi", right: "Tukar & pinjam tanpa bank" },
            { left: "Kerja", right: "Gaji, bounty, kontribusi" },
            { left: "DAO", right: "Komunitas + kas bersama" },
            { left: "NFT", right: "Karya, tiket, identitas" },
          ],
          "Hafalin pintunya, baru pilih gang.",
        ),
        c(
          "u1l5q2",
          "DeFi itu apaan, versi manusia?",
          [
            "Layanan keuangan di rantai: tukar, pinjam, pool. Tanpa teller",
            "ATM di Indomaret",
            "Sinyal trading berbayar",
            "Gaji tetap dari bursa",
          ],
          0,
          "Decentralized finance. Tetap ada risiko. Nanti kita dalemin di rute DeFi.",
        ),
        c(
          "u1l5q3",
          "Bagaimana sebenarnya cara orang mencari penghasilan di dunia Web3?",
          [
            "Ada. Community, dev, desain, BD, konten. Kadang remote, kadang bounty",
            "Mustahil tanpa modal 1 miliar",
            "Cuma jadi admin grup sinyal",
            "Wajib mining di rumah",
          ],
          0,
          "Skill yang kepake: nulis, desain, kode, jaga komunitas, baca rantai. Bukan 'bayar dulu biar di-hire'.",
        ),
        tf(
          "u1l5q4",
          "DAO itu kantor biasa yang gajinya otomatis cair tiap tanggal 25.",
          false,
          "DAO = komunitas + kas on-chain + voting. Kadang ada kontributor berbayar. Bukan HR kantor.",
        ),
        c(
          "u1l5q5",
          "Teman bilang 'web3 cuma buat yang berani all-in chart'. Kamu?",
          [
            "Nolak. Ada DeFi, kerja, DAO, NFT, yang bikin app",
            "Setuju. Yang lain buang waktu",
            "Setuju, asal 50x",
            "Setuju, asal utang dulu",
          ],
          0,
          "All-in chart itu pilihan. Bukan definisi web3.",
        ),
      ]),
      L("u1", "u1-cp", "checkpoint", "Ujian rute 1", "Cek dulu, udah nempel belum.", "flag", [
        tip("u1cpt", "Ulangan unit 1", "Nggak ada materi baru. Cek dulu, ide ini udah nempel belum, sebelum masuk ke wallet.", {
          points: [
            "Web3 ngebedain diri soalnya kendali aset ada di yang pegang kunci, bukan di satu perusahaan.",
            "Blockchain = buku kas bersama yang disalin banyak pihak.",
            "Selain trading: DeFi, kerja, DAO, NFT, yang bikin.",
            "Salah kirim on-chain jarang bisa di-refund. Seed yang hilang hampir mustahil dibalikin.",
          ],
          remember: "Masih campur Web2 sama Web3? Ulangi dulu.",
        }),
        c(
          "u1cp1",
          "Apa perbedaan paling mendasar antara Web3 dan Web2?",
          [
            "Kendali aset ada di pemegang kunci, bukan di satu perusahaan",
            "Internetnya lebih pink",
            "Nggak butuh HP",
            "Nggak ada risiko",
          ],
          0,
          "Kendali + tanggung jawab datang bareng.",
        ),
        tf("u1cp2", "Blockchain publik nyatet transaksi di buku kas yang disalin banyak pihak.", true, "Buku kas publik didistribusikan ke ribuan node komputer agar tidak ada satu pihak pun yang bisa mengubah catatan secara sepihak."),
        c(
          "u1cp3",
          "Kalau seed phrase dompetmu hilang atau dicuri orang, apa yang paling mungkin terjadi?",
          [
            "Aset di rantai itu sulit atau mustahil dikembalikan",
            "Bank mengirim ulang semuanya",
            "Google otomatis backup",
            "CS MetaMask datang ke rumah",
          ],
          0,
          "Nanti kita dalemin di unit wallet. Spoiler: seed itu nyawa.",
        ),
        blank("u1cp4", "Catatan bersama di Web3 disebut ___.", ["blockchain", "screenshot", "PDF", "status WA"], 0, "Blockchain adalah buku kas bersama yang tidak bisa diedit diam-diam oleh perantara."),
        c(
          "u1cp5",
          "Mana yang Web2?",
          ["Saldo GoPay di perusahaan", "Koin di alamat yang kamu kunci sendiri", "NFT di wallet", "ETH di cold wallet"],
          0,
          "GoPay nyaman, tapi kuncinya bukan di kamu.",
        ),
        tf("u1cp6", "Salah kirim kripto on-chain biasanya bisa di-refund kayak transfer bank salah.", false, "Jarang. Anggap kirim itu final."),
        c(
          "u1cp7",
          "Selain trading grafik harga, apa saja aktivitas nyata pengguna di Web3?",
          [
            "Pake DeFi, kerja, ikut DAO, pegang NFT, bikin app",
            "Cuma nunggu sinyal",
            "Wajib all-in chart",
            "Harus mining di rumah",
          ],
          0,
          "Banyak pintu. Chart cuma satu gang.",
        ),
      ]),
    ],
  },
  {
    id: "u2",
    index: 2,
    title: "Dompet & kunci",
    subtitle: "Yang ini jangan sampai salah",
    color: "blue",
    lessons: [
      L("u2", "u2-l1", "lesson", "Apa itu wallet", "Bukan tempat nyimpen koin. Tempat nyimpen kunci.", "wallet", [
        tip("u2l1t", "Wallet bukan brankas koin", "Miskonsepsi nomor satu: orang kira koin 'disimpan di dalam aplikasi'. Salah. Koin tetap tercatat di blockchain. Wallet cuma nyimpen kunci, biar kamu bisa nandatanganin transaksi dan baca saldo.", {
          points: [
            "Wallet = gantungan kunci + jendela. Merk aplikasinya nggak penting dibanding seed-nya.",
            "Hapus app tapi seed aman = aset masih bisa dibuka di wallet lain.",
            "Wallet nggak jamin harga naik. Dia alat, bukan advisor.",
          ],
          example: "Ganti gantungan kunci rumah nggak ngganti kunci pintunya. Ganti MetaMask ke wallet lain dengan seed yang sama = pintu yang sama.",
          remember: "Saldo di layar itu bacaan dari blockchain, bukan file koin di HP.",
        }),
        c(
          "u2l1q1",
          "Apa fungsi utama dari dompet (wallet) Web3?",
          ["Kunci (private key / seed)", "Koin fisik di dalam HP", "Uang tunai", "Akun Instagram"],
          0,
          "Saldo yang kamu liat itu bacaan dari blockchain, bukan 'file koin' di aplikasi.",
          "Ini miskonsepsi nomor satu. Kita beresin sekarang.",
        ),
        tf(
          "u2l1q2",
          "Kalau aplikasi wallet dihapus tapi seed phrase aman, aset masih bisa dibalikin di wallet lain.",
          true,
          "Aplikasi cuma jendela. Seed-nya yang raja.",
        ),
        c(
          "u2l1q3",
          "Wallet itu kayak apa?",
          [
            "Gantungan kunci: yang penting kuncinya, bukan merk gantungannya",
            "Brankas bank yang CS-nya 24 jam",
            "Dompet kulit yang kalau hilang tinggal ke kantor polisi",
            "Rekening yang bisa di-reset lewat KTP",
          ],
          0,
          "Ganti aplikasi = ganti gantungan. Kunci yang sama tetap buka pintu yang sama.",
        ),
        blank(
          "u2l1q4",
          "Tampilan saldo di wallet itu bacaan dari ___.",
          ["blockchain", "galeri HP", "email", "kartu SIM"],
          0,
          "Makanya kadang 'sync' dulu baru angkanya muncul.",
        ),
        tf("u2l1q5","Wallet bisa mengatur atau menaikkan harga pasar koinmu.",false,"Wallet cuma alat buat nyimpen kunci dan tanda tangan transaksi. Dia nggak bisa ngatur harga."),
      ]),
      L("u2", "u2-l2", "lesson", "Seed phrase", "12 atau 24 kata yang setara nyawa.", "key", [
        tip("u2l2t", "Seed phrase = nyawa wallet", "Pas buat wallet, kamu dapet 12 atau 24 kata berurutan. Itu master backup. Siapa pun yang punya seed, bisa buka wallet yang sama di HP mana pun, lalu menguras isinya.", {
          points: [
            "Bukan PIN ATM, bukan kode voucher, bukan nama koin.",
            "Jangan pernah share ke 'admin', CS, form airdrop, atau bot. Resmi nggak pernah minta seed.",
            "Simpan offline: tulis kertas atau plat. Jangan screenshot ke Drive / chat / close friend IG.",
          ],
          example: "Orang DM 'validasi wallet, ketik 12 kata' = penipu. Airdrop nggak butuh seed. Cukup alamat.",
          remember: "Jangan pernah share seed phrase.",
        }),
        c(
          "u2l2q1",
          "Seed phrase itu apaan?",
          [
            "Daftar 12/24 kata yang bisa balikin seluruh wallet",
            "PIN ATM 6 digit",
            "Nama panggilan koin",
            "Kode voucher Tokopedia",
          ],
          0,
          "Siapa pun yang punya seed, punya aset. Titik.",
          "Kalau cuma satu pelajaran yang kamu hafal, biar ini.",
        ),
        tf(
          "u2l2q2",
          "Boleh share seed phrase ke 'admin' yang janjiin airdrop.",
          false,
          "Nggak. Nggak pernah. Admin yang minta seed = penipu.",
        ),
        c(
          "u2l2q3",
          "Cara simpan seed yang lebih aman?",
          [
            "Tulis di kertas / plat, simpan offline, jangan difoto ke cloud",
            "Simpan di caption Instagram close friend",
            "Kirim ke email sendiri plus 3 temen",
            "Screenshot lalu upload Drive publik",
          ],
          0,
          "Cloud dan screenshot itu undangan maling. Offline lebih tenang.",
        ),
        blank(
          "u2l2q4",
          "Kalau orang lain punya seed kamu, mereka bisa ___ asetmu.",
          ["menguras", "mewarnai", "mencetak", "membesarkan"],
          0,
          "Tanpa perlu HP kamu. Cukup seed + internet.",
        ),
        order(
          "u2l2q5",
          "Susun aturan emas keamanan seed phrase:",
          ["Jangan", "pernah", "share", "seed", "phrase"],
          "Tempel di dinding otak.",
        ),
      ]),
      L("u2", "u2-l3", "lesson", "Private vs public", "Yang boleh dipamerin, yang harus dikunci.", "lock", [
        tip("u2l3t", "Tiga kunci, jangan ketuker", "Wallet punya beberapa 'kunci' yang kedengerannya mirip. Kalau ketuker, akibatnya bisa fatal.", {
          points: [
            "Alamat / public address: boleh dibagi, kayak nomor rekening. Orang pakai ini buat kirim koin ke kamu.",
            "Private key: rahasia total. Turunan dari seed, dipakai nandatanganin transaksi.",
            "Seed phrase: master backup. Punya seed = punya semua private key di wallet itu.",
            "PIN / Face ID aplikasi: cuma kunci lokal HP. Bukan pengganti seed.",
          ],
          example: "Teman mau transfer USDT → kasih QR / alamat. Jangan kasih seed. HP rusak + seed aman = masih selamat. HP aman + seed bocor = habis.",
          remember: "Alamat boleh dipamerin. Seed dan private key nggak, kapan pun, ke siapa pun.",
        }),
        match(
          "u2l3q1",
          "Pasangin yang nyambung.",
          [
            { left: "Alamat / public", right: "Boleh dibagi" },
            { left: "Private key", right: "Rahasia total" },
            { left: "Seed phrase", right: "Master backup" },
            { left: "PIN aplikasi", right: "Kunci lokal HP" },
          ],
        ),
        c(
          "u2l3q2",
          "Teman ingin mentransfer sejumlah token kepadamu. Informasi apa yang kamu berikan?",
          ["Alamat wallet / QR", "Seed phrase", "Private key", "Foto KTP + PIN"],
          0,
          "Alamat itu nomor rekening. Seed itu seluruh brankas.",
        ),
        tf(
          "u2l3q3",
          "Private key bisa dihitung ulang dari alamat publik dengan mudah.",
          false,
          "Kriptografinya satu arah. Alamat nggak bocorin private key.",
        ),
        c(
          "u2l3q4",
          "Fitur PIN atau Face ID di aplikasi dompet sebenarnya berfungsi untuk apa?",
          [
            "Kunci lokal supaya orang yang pegang HP susah buka app, bukan pengganti seed",
            "Sama kuatnya dengan seed, jadi seed boleh dibuang",
            "Dikirim ke blockchain tiap jam",
            "Dibagikan ke validator",
          ],
          0,
          "HP rusak + seed aman = masih selamat. HP aman + seed bocor = habis.",
        ),
        blank(
          "u2l3q5",
          "Yang boleh kamu paste di group biar orang kirim koin itu ___.",
          ["alamat wallet", "seed phrase", "private key", "kata sandi iCloud"],
          0,
          "Periksa 6 karakter awal dan 6 karakter akhir setelah paste. Malware atau scammer sering memalsukan alamat di clipboard.",
        ),
      ]),
      L("u2", "u2-chest", "chest", "Peti rute 2", "Hadiah buat yang jaga rahasia.", "gift", [], { xp: 0, gems: 20 }),
      L("u2", "u2-l4", "lesson", "Alamat & jaringan", "Salah jaringan = drama.", "map", [
        tip("u2l4t", "Alamat mirip, jaringan bisa beda dunia", "Alamat wallet biasanya deretan huruf-angka. Di Ethereum sering mulai 0x. Jangan hafal semuanya, cukup cek 6 karakter awal dan 6 karakter akhir setelah paste.", {
          points: [
            "Jaringan (network) beda: Ethereum, BNB Chain, Solana, dan L2 itu dunia terpisah.",
            "Kirim ETH di Ethereum ke 'alamat yang sama' di jaringan lain bisa nyangkut atau hilang.",
            "Kebiasaan sehat: kirim nominal kecil dulu (test send), baru kirim sisanya.",
            "Malware bisa nuker alamat di clipboard. Setelah paste, cek lagi ujung-pangkalnya.",
          ],
          example: "Mau kirim USDT. Cek: koinnya USDT, jaringannya sesuai (misalnya Ethereum atau BNB), alamat penerima benar. Tiga-tiganya harus pas.",
          remember: "Address = tujuan. Network = jalannya. Seed = kunci.",
        }),
        c(
          "u2l4q1",
          "Alamat wallet biasanya kayak apa?",
          [
            "Deretan huruf-angka (kadang mulai 0x di Ethereum)",
            "Nomor HP 12 digit",
            "Email",
            "Username TikTok",
          ],
          0,
          "Contoh: 0xABC… (jangan hafal semuanya, cek 6 karakter awal dan 6 karakter akhirnya).",
        ),
        tf(
          "u2l4q2",
          "Kirim ETH jaringan Ethereum ke alamat yang sama di jaringan lain selalu aman tanpa cek.",
          false,
          "Alamatnya bisa kelihatan mirip, jaringannya beda. Salah jaringan = aset nyangkut atau hilang.",
          "Selalu cek network: Ethereum, BNB, Solana, dan kawan-kawannya beda dunia.",
        ),
        c(
          "u2l4q3",
          "Sebelum transfer, kebiasaan paling sehat?",
          [
            "Kirim nominal kecil dulu, pastikan sampai, baru kirim sisanya",
            "Kirim semua sekaligus biar hemat waktu",
            "Suruh orang asing menekan tombolnya",
            "Matikan internet supaya lebih aman",
          ],
          0,
          "Test send. Ongkir kecil jauh lebih murah daripada kehilangan semuanya.",
        ),
        blank(
          "u2l4q4",
          "Nama lain yang sering dipakai buat alamat penerima itu ___.",
          ["address", "seed", "gas", "Nomor rekening bank"],
          0,
          "Address = tujuan. Seed = kunci.",
        ),
        c(
          "u2l4q5",
          "Mengapa papan klip (clipboard) perangkat perlu diwaspadai saat menyalin alamat dompet?",
          [
            "Bisa ditukar malware jadi alamat penipu. Cek lagi setelah paste",
            "Nggak pernah salah",
            "Dijamin wallet resmi",
            "Sama dengan seed",
          ],
          0,
          "Clipboard hijack itu nyata. Liat 6 karakter awal dan 6 karakter akhir.",
        ),
      ]),
      L("u2", "u2-cp", "checkpoint", "Ujian rute 2", "Kunci, seed, dan alamat, jangan sampai tertukar.", "flag", [
        tip("u2cpt", "Ulangan unit 2", "Ini ujian. Kalau masih campur seed dan alamat, ulangi pelajarannya karena unit ini yang paling mahal kalau salah.", {
          points: [
            "Wallet nyimpen kunci, bukan file koin.",
            "Seed nggak pernah dibagi. Alamat boleh.",
            "Salah jaringan dan hapus app tanpa backup seed = risiko kehilangan akses.",
          ],
          remember: "CS ramah yang minta 12 kata tetap penipu.",
        }),
        c(
          "u2cp1",
          "Apa benda paling berharga yang sebenarnya disimpan di dalam dompet Web3?",
          ["Kunci (seed / private key)", "Koin kertas", "Rupiah tunai", "Followers"],
          0,
          "Wallet Web3 bertindak sebagai penyimpan kunci kriptografis dan alat penandatangan transaksi, bukan brankas tempat koin disimpan secara fisik.",
        ),
        tf("u2cp2", "Seed phrase boleh di-chat ke CS yang ramah.", false, "CS resmi nggak minta seed."),
        c(
          "u2cp3",
          "Dari komponen dompet berikut, manakah yang aman dibagikan secara terbuka?",
          ["Alamat wallet", "Seed 12 kata", "Private key", "Foto seed"],
          0,
          "Alamat publik (public address) memang dirancang untuk dibagikan secara aman kepada orang lain agar mereka bisa mengirimkan aset kepadamu.",
        ),
        blank("u2cp4", "Backup master wallet disebut ___ phrase.", ["seed", "gas", "swap", "mint"], 0, "Seed phrase adalah rangkaian kata kunci cadangan yang dapat memulihkan seluruh akun dan saldo dompetmu."),
        c(
          "u2cp5",
          "Apa akibatnya jika kamu salah memilih jaringan saat mentransfer aset kripto?",
          ["Bisa bikin aset nyangkut atau hilang", "Selalu di-refund 5 menit", "Menaikkan harga koin", "Ngapus gas fee"],
          0,
          "Cek network, lalu test send.",
        ),
        tf("u2cp6", "Ngapus app wallet tanpa backup seed berisiko kehilangan akses aset.", true, "Aplikasi hanyalah antarmuka pembaca; saldo sebenarnya ada di blockchain, namun aksesnya hilang selamanya jika kamu tidak menyimpan seed phrase."),
      ]),
    ],
  },
  {
    id: "u3",
    index: 3,
    title: "Bitcoin, ETH & koin",
    subtitle: "Nama-nama yang sering lewat di TL",
    color: "gold",
    lessons: [
      L("u3", "u3-l1", "lesson", "Bitcoin", "Yang pertama, yang paling terkenal.", "bitcoin", [
        tip("u3l1t", "Bitcoin, yang pertama", "Bitcoin (BTC) lahir 2009 dari nama Satoshi Nakamoto. Tujuannya: uang digital yang nggak perlu bank di tengah. Ini kripto pertama yang sukses besar, bukan DANA, dan bukan nama lain Ethereum.", {
          points: [
            "Jumlahnya dibatasi sekitar 21 juta koin. Kelangkaan itu bagian dari desain, bukan janji cuan.",
            "Pecahan kecilnya disebut satoshi (sepersejuta BTC). Wei pecahan ETH, jangan ketuker.",
            "BTC sering dibahas sebagai penyimpan nilai digital, bukan 'komputer aplikasi' kayak Ethereum.",
            "Harga bisa anjlok puluhan persen dalam sehari. Itu mungkin. Jangan pakai uang sewa rumah.",
          ],
          example: "Anggap BTC lebih deket ke emas digital: langka, dipindah tanpa bank, tapi harganya bergoyang keras.",
          remember: "Teknologinya menarik. Volatilitasnya bisa luka.",
        }),
        c(
          "u3l1q1",
          "Bitcoin (BTC) itu apaan?",
          [
            "Kripto pertama yang sukses besar, lahir 2009",
            "Stablecoin milik bank Indonesia",
            "Nama lain Ethereum",
            "Aplikasi e-wallet kayak DANA",
          ],
          0,
          "Satoshi Nakamoto, 2009. Tujuannya: uang digital tanpa bank tengah.",
        ),
        tf("u3l1q2", "Jumlah Bitcoin dibatasi sekitar 21 juta koin.", true, "Sifat langka itu bagian dari desainnya."),
        blank(
          "u3l1q3",
          "Unit kecil Bitcoin disebut ___ (sepersejuta BTC).",
          ["satoshi", "wei", "rupiah", "gas"],
          0,
          "Satoshi = pecahan BTC. Wei = pecahan ETH.",
        ),
        c(
          "u3l1q4",
          "Bitcoin paling sering dibahas sebagai apa?",
          [
            "Penyimpan nilai digital yang langka, bukan komputer aplikasi",
            "Tempat bikin game on-chain",
            "Bank sentral",
            "Browser",
          ],
          0,
          "Smart contract yang kaya fitur lebih identik sama Ethereum dan kawanannya.",
        ),
        c(
          "u3l1q5",
          "Kalau harga pasar Bitcoin turun 20% dalam sehari, bagaimana sikap yang bijak?",
          [
            "Itu mungkin di pasar kripto. Jangan pakai uang sewa rumah",
            "Mustahil secara hukum",
            "Bank Indonesia wajib menalangi",
            "Wallet kamu rusak",
          ],
          0,
          "Volatilitas bukan bug di mata pasar, tapi bisa jadi luka di dompet.",
        ),
      ]),
      L("u3", "u3-l2", "lesson", "Ethereum", "Komputer dunia, bukan cuma koin.", "hexagon", [
        tip("u3l2t", "Ethereum = sistem operasi, bukan cuma koin", "Kalau Bitcoin deket ke emas digital, Ethereum lebih deket ke sistem operasi. Di atasnya orang bisa pasang program yang disebut smart contract: kode yang jalan sendiri di jaringan saat syarat terpenuhi.", {
          points: [
            "Koin nativenya ETH. Dipakai antara lain buat bayar gas (ongkos transaksi).",
            "Smart contract bukan PDF notaris dan bukan chatbot CS. Nggak ada teller. Nggak ada CS kalau kodenya jahat.",
            "Gas naik saat jaringan ramai, turun saat sepi. Transaksi gagal sering tetap kepotong gas soalnya kerja udah dilakuin.",
            "Orang pindah ke L2 atau rantai lain biasanya karena ongkos dan kecepatan, bukan karena ETH 'nggak bisa ditransfer'.",
          ],
          example: "DeFi, NFT, game on-chain, DAO, semuanya hidup di ekosistem Ethereum. ETH bahan bakarnya.",
          remember: "BTC simpan nilai. ETH jalankan program. Umurnya panjang, ceritanya belok-belok.",
        }),
        c(
          "u3l2q1",
          "Apa inovasi utama yang membuat jaringan Ethereum begitu terkenal di dunia kripto?",
          [
            "Smart contract: program yang jalan di blockchain",
            "Cuma niru logo Bitcoin",
            "Nggak punya koin",
            "Menggantikan WiFi",
          ],
          0,
          "ETH itu bahan bakar. Aplikasinya bisa DeFi, NFT, game, DAO.",
          "Kalau Bitcoin itu emas digital, Ethereum lebih deket ke sistem operasi.",
        ),
        tf("u3l2q2", "Koin native Ethereum disebut ETH.", true, "Iya. Dipakai antara lain buat bayar gas."),
        c(
          "u3l2q3",
          "Smart contract itu apaan?",
          [
            "Kode yang jalan otomatis di jaringan saat syarat terpenuhi",
            "PDF perjanjian di email notaris",
            "Chat bot CS",
            "Akun Instagram resmi",
          ],
          0,
          "Nggak butuh teller. Juga nggak ada CS kalau kodenya jahat.",
        ),
        blank(
          "u3l2q4",
          "Biaya transaksi di Ethereum disebut ___ fee.",
          ["gas", "pajak", "ongkir JNE", "admin bank"],
          0,
          "Gas = ongkos ke validator. Naik saat jaringan ramai.",
        ),
        c(
          "u3l2q5",
          "Kenapa orang pakai jaringan lain selain Ethereum utama?",
          [
            "Sering lebih murah / cepat (L2 atau rantai lain)",
            "Karena ETH nggak bisa ditransfer",
            "Karena Bitcoin menolak",
            "Karena HP Android nggak boleh",
          ],
          0,
          "Nanti ketemu L2. Intinya: ongkos dan kecepatan.",
        ),
      ]),
      L("u3", "u3-l5", "lesson", "Sejarah Ethereum", "Dari whitepaper ke Merge. Bukan cuma koin.", "book", [
        tip("u3l5t", "ETH punya umur, bukan turun dari langit", "Vitalik Buterin nulis gagasan Ethereum akhir 2013. Intinya: blockchain yang bisa jalanin program, bukan cuma kirim koin. 2014 orang beli ETH di presale. 30 Juli 2015 jaringan Frontier hidup. Sejak itu perjalanannya penuh dinamika, mulai dari fork, mania ICO, DeFi, sampai migrasi konsensus.", {
          points: [
            "2015 Frontier: komputer dunia nyala. Masih kasar, masih ditambang (PoW).",
            "2016 The DAO di-hack puluhan juta dolar. Komunitas belah: mayoritas rollback (Ethereum yang kamu kenal), yang nolak jadi Ethereum Classic (ETC).",
            "2017 ICO mania. Token ERC-20 meledak. Banyak yang jadi, lebih banyak yang hangus.",
            "2020 DeFi summer. 2021 NFT rame. London (EIP-1559) bakar sebagian gas.",
            "15 September 2022 The Merge: ganti tambang ke staking (PoS). Listriknya anjlok. ETH tetep ETH, mesinnya yang ganti.",
          ],
          example: "Teman kira ETH 'koin baru kemarin'. Padahal udah lebih dari 10 tahun, sempat belah karena hack, trus ganti mesin dari tambang ke staking. Itu sejarah, bukan sinyal beli.",
          remember: "ETH = komputer yang umurnya panjang. Harganya bergoyang. Ceritanya jangan dipotong.",
        }),
        c(
          "u3l5q1",
          "Ethereum lahir dari gagasan siapa, kira-kira?",
          [
            "Vitalik Buterin, whitepaper sekitar 2013-2014",
            "Satoshi Nakamoto, 2009",
            "Elon Musk, 2021",
            "Bank Indonesia, 2020",
          ],
          0,
          "Satoshi itu Bitcoin. Vitalik + tim awal itu Ethereum. Jaringan Frontier hidup 30 Juli 2015.",
        ),
        tf(
          "u3l5q2",
          "Jaringan Ethereum mulai hidup sekitar 30 Juli 2015 (Frontier).",
          true,
          "Presale 2014. Genesis 2015. Bukan koin yang muncul kemarin di Telegram.",
        ),
        c(
          "u3l5q3",
          "Saat peristiwa peretasan The DAO tahun 2016 terjadi, apa keputusan komunitas Ethereum?",
          [
            "Belah. Mayoritas rollback (ETH). Yang nolak jadi Ethereum Classic",
            "Langsung tutup proyek selamanya",
            "Ganti nama jadi Bitcoin",
            "Nyerahin kunci ke PBB",
          ],
          0,
          "Fork itu politik + kode. ETH yang orang pegang sekarang itu yang ikut rollback. ETC yang nolak.",
        ),
        c(
          "u3l5q4",
          "The Merge 15 September 2022 itu apaan?",
          [
            "Ganti mesin: dari ditambang (PoW) ke staking (PoS)",
            "Ganti nama koin jadi Bitcoin 2",
            "Nghapus semua smart contract",
            "Pindah server ke Amerika",
          ],
          0,
          "ETH tetep ETH. Yang ganti cara jaga jaringannya. Listriknya jauh turun. Mining ETH selesai.",
        ),
        match(
          "u3l5q5",
          "Pasangin tahun sama ceritanya.",
          [
            { left: "2015", right: "Frontier, jaringan hidup" },
            { left: "2016", right: "The DAO, belah ETC" },
            { left: "2020", right: "DeFi summer" },
            { left: "2022", right: "The Merge, PoS" },
          ],
          "Hafalin belokannya, bukan hafalin harga.",
        ),
        c(
          "u3l5q6",
          "Kenapa sejarah ini penting buat pemula?",
          [
            "Biar nggak kira ETH cuma chart. Ada fork, mania, ganti mesin, L2",
            "Biar bisa all-in karena 'udah tua'",
            "Biar hafal harga 2017",
            "Biar mining di rumah",
          ],
          0,
          "Umur panjang ≠ aman. Tapi kalo kamu ngerti belokannya, kabar 'ETH mati' di timeline nggak gampang nyeret.",
        ),
      ]),
      L("u3", "u3-l3", "lesson", "Stablecoin & altcoin", "Yang 'stabil', yang spekulasi.", "coins", [
        tip("u3l3t", "Yang ikut dolar, yang ikut hype", "Nggak semua koin kerjanya sama. Stablecoin didesain ngikutin aset lain, umumnya dolar AS. Altcoin, kasarnya, kripto selain Bitcoin. Meme coin ada di ujung spekulasi.", {
          points: [
            "USDT dan USDC yang paling sering kelihatan di exchange Indonesia. Ngikutin USD, bukan njamin kaya.",
            "Stablecoin lebih tenang dari meme coin, tapi tetap ada risiko penerbit, depeg (lepas patokan), dan salah jaringan.",
            "Ribuan altcoin. Mayoritas sepi, spekulatif, atau mati. Logo keren nggak sama dengan kualitas.",
            "Sikap dewasa: riset, pahami gunanya, siap kehilangan. Bukan all-in karena grup signal.",
          ],
          example: "Butuh 'dolar digital' buat trading? Orang sering pakai USDT. Mau 100x semalam? Itu spekulasi, bukan pelajaran.",
          remember: "Ikut dolar ≠ uang tunai di bawah bantal.",
        }),
        c(
          "u3l3q1",
          "Apa tujuan utama stablecoin dirancang dalam ekosistem aset digital?",
          [
            "Nilainya ngikutin aset lain, biasanya USD",
            "Selalu naik 10x sebulan",
            "Menggantikan listrik",
            "Nggak bisa ditransfer",
          ],
          0,
          "USDT dan USDC yang paling sering kelihatan di exchange Indonesia.",
        ),
        tf(
          "u3l3q2",
          "Stablecoin 100% tanpa risiko, setara uang tunai di bawah bantal.",
          false,
          "Ada risiko penerbit, depeg, dan salah jaringan. Lebih tenang daripada meme coin, tapi bukan nol risiko.",
        ),
        c(
          "u3l3q3",
          "Altcoin itu apaan?",
          [
            "Kripto selain Bitcoin (kasarnya)",
            "Koin khusus pegawai bank",
            "Koin yang nggak bisa di-swap",
            "Nama gas fee",
          ],
          0,
          "Ribuan altcoin. Mayoritas sepi, spekulatif, atau mati.",
        ),
        match(
          "u3l3q4",
          "Pasangin yang nyambung.",
          [
            { left: "BTC", right: "Kripto pionir" },
            { left: "ETH", right: "Smart contract" },
            { left: "USDT", right: "Ikut dolar" },
            { left: "Meme coin", right: "Spekulasi tinggi" },
          ],
        ),
        c(
          "u3l3q5",
          "Sikap paling dewasa ke altcoin?",
          [
            "Riset, pahami utilitas, siap kehilangan",
            "All-in karena grup signal bilang '100x'",
            "Pinjam uang teman",
            "Percaya setiap logo singa",
          ],
          0,
          "Kalau janji mustahil, itu marketing. Bukan ilmu.",
        ),
      ]),
      L("u3", "u3-chest", "chest", "Peti rute 3", "Sedikit kilau.", "gift", [], { xp: 0, gems: 20 }),
      L("u3", "u3-l4", "lesson", "Coin vs token", "Punya rantai sendiri, atau numpang.", "badge", [
        tip("u3l4t", "Punya rumah sendiri, atau numpang", "Kasarnya: coin punya blockchain sendiri (BTC, ETH, SOL). Token numpang di rantai yang udah ada. Di Ethereum, token biasa ngikutin standar ERC-20. NFT ngikutin ERC-721.", {
          points: [
            "Bikin token itu gampang. Bikin yang berguna dan jujur itu yang susah.",
            "Launch token dalam 2 menit itu sangat mungkin, justru jadi alasan buat lebih curiga, bukan makin FOMO.",
            "Cek kontrak, likuiditas, siapa di belakang, dan gunanya. Bukan cuma logo dan stiker Telegram.",
          ],
          example: "USDT di Ethereum itu token ERC-20 (numpang). ETH itu coin native rantai itu. Bedanya: satu numpang, satu punya rumah.",
          remember: "Pahami asetnya dulu, baru putuskan beli.",
        }),
        c(
          "u3l4q1",
          "Secara teknis, apa perbedaan mendasar antara 'koin' dan 'token'?",
          [
            "Blockchain sendiri (BTC, ETH, SOL)",
            "Cuma stiker Telegram",
            "Nggak bisa ditransfer",
            "Selalu lebih mahal",
          ],
          0,
          "Token biasanya numpang di rantai yang udah ada, misalnya token ERC-20 di Ethereum.",
        ),
        blank(
          "u3l4q2",
          "Token di Ethereum yang paling umum ngikutin standar ___.",
          ["ERC-20", "MP3", "PDF", "HTTP"],
          0,
          "ERC-20 = token biasa. ERC-721 = NFT.",
        ),
        tf(
          "u3l4q3",
          "Setiap token baru yang muncul di timeline otomatis berkualitas.",
          false,
          "Bikin token itu gampang. Bikin yang berguna dan jujur itu yang susah.",
        ),
        c(
          "u3l4q4",
          "Kalau seseorang bisa meluncurkan token baru dalam 2 menit, apa yang harus kamu waspadai?",
          [
            "Itu mungkin. Berarti kamu harus lebih curiga, bukan lebih FOMO",
            "Pasti lulus audit Bank Indonesia",
            "Harganya nggak bisa turun",
            "Seed kamu ikut naik",
          ],
          0,
          "Gampang diluncurin = gampang dipakai buat jebakan.",
        ),
        order(
          "u3l4q5",
          "Susun urutan berpikir yang rasional sebelum membeli:",
          ["Pahami", "asetnya", "baru", "putuskan", "beli"],
          "Bukan kebalik: beli dulu, pahami nanti.",
        ),
      ]),
      L("u3", "u3-cp", "checkpoint", "Ujian rute 3", "BTC, ETH, stable, token.", "flag", [
        tip("u3cpt", "Ulangan unit 3", "Cek peta koin di kepala kamu. Nggak ada materi baru.", {
          points: [
            "Bitcoin ~2009, langka, sering dianggap emas digital.",
            "ETH bayar gas. Smart contract = program otomatis di jaringan.",
            "2015 Frontier. 2016 The DAO belah ETC. 2022 Merge: PoW ke PoS.",
            "Stablecoin ngikutin fiat (biasanya USD). ERC-20 numpang di Ethereum. Meme coin nggak dijamin negara.",
          ],
          remember: "Nama keren di timeline bukan kurikulum.",
        }),
        j("u3cp1","Bitcoin mulai jalan tahun berapa?",["2009","1999","2015","2021"],0,"Jaringan Bitcoin hidup Januari 2009, dimulai dengan blok pertama (genesis) dari Satoshi Nakamoto."),
        M("u3cp2","ETH dipakai antara lain buat bayar gas di ekosistem Ethereum.",true,"Benar. Setiap transaksi di Ethereum dibayar pakai ETH sebagai ongkos jaringan."),
        j("u3cp3","Stablecoin biasanya ngikutin nilai apa?",["Mata uang fiat seperti dolar AS","Harga Bitcoin","Harga emas selalu","Jumlah pengguna"],0,"Stablecoin dirancang supaya nilainya tetap dekat 1 dolar, tapi tetap bisa lepas (depeg)."),
        N("u3cp4","Program otomatis yang jalan di Ethereum disebut smart ___.",["contract","wallet","token","block"],0,"Smart contract = kode yang jalan sendiri saat syaratnya terpenuhi, tanpa perantara."),
        j("u3cp5","Token ERC-20 hidup di mana?",["Di Ethereum atau jaringan yang kompatibel","Di jaringan Bitcoin","Di server exchange","Di aplikasi wallet"],0,"ERC-20 itu standar token di Ethereum. Tokennya numpang di rantai itu, bukan punya rantai sendiri."),
        M("u3cp6","Meme coin itu investasi yang dijamin negara.",false,"Salah. Nggak ada jaminan negara atau LPS untuk kripto. Meme coin termasuk yang paling berisiko."),
        j("u3cp7","The Merge 2022 mengubah Ethereum dari apa ke apa?",["Dari ditambang (PoW) ke staking (PoS)","Dari ETH jadi koin baru","Dari L2 ke L1","Dari publik ke privat"],0,"Yang berubah cuma cara jaringan dijaga. Koinnya tetap ETH."),
        M("u3cp8","The DAO 2016 bikin komunitas Ethereum pecah, lalu lahir Ethereum Classic.",true,"Benar. Mayoritas memilih membatalkan dampak hack (ETH), yang menolak lanjut sebagai Ethereum Classic (ETC)."),
      ]),
    ],
  },
  {
    id: "u4",
    index: 4,
    title: "NFT & token",
    subtitle: "Bukan cuma gambar monyet",
    color: "purple",
    lessons: [
      L("u4", "u4-l1", "lesson", "Token itu apa", "Aset digital yang bisa diprogram.", "badge", [
        tip("u4l1t", "Token = aset yang aturannya tertulis di kode", "Token bisa jadi banyak hal: poin, tiket, kepemilikan, atau 'uang' di sebuah aplikasi. Aturannya tertulis di smart contract, bukan di brosur.", {
          points: [
            "Bukan cuma foto profil, dan bukan otomatis virus atau utang bank.",
            "Tokenomics = dari mana pasokannya, ke mana perginya, siapa yang dapet berapa. Banyak PR + sepi permintaan = harga sedih.",
            "Sebelum beli: cek kontrak, likuiditas, tim, dan gunanya. Logo dan stiker grup nggak cukup.",
            "Di Indonesia ini bukan zona tanpa aturan. Ikuti perkembangan pajak dan regulasi.",
          ],
          example: "Token tiket konser bisa dicatat on-chain. Itu utilitas. Token '100x malam ini' tanpa kegunaan = spekulasi murni.",
          remember: "Logo murah. Likuiditas dan kejujuran mahal.",
        }),
        c(
          "u4l1q1",
          "Dalam ekonomi digital Web3, token dapat merepresentasikan apa saja?",
          [
            "Poin, tiket, kepemilikan, atau mata uang aplikasi, tergantung desainnya",
            "Cuma foto profil",
            "Cuma utang bank",
            "Cuma virus",
          ],
          0,
          "Token = aset yang aturannya tertulis di kontrak.",
        ),
        tf("u4l1q2", "Supply token (berapa banyak beredar) bisa banget ngaruhin harga.", true, "Tokenomics. Banyak PR, sedikit permintaan = sedih."),
        c(
          "u4l1q3",
          "Yang harus kamu cek sebelum beli token?",
          [
            "Kontrak, likuiditas, siapa di belakang, dan utilitas, bukan cuma logo",
            "Warnanya gold nggak",
            "Namanya keren di TikTok nggak",
            "Grupnya ramai stiker nggak",
          ],
          0,
          "Logo murah. Likuiditas dan kejujuran mahal.",
        ),
        blank(
          "u4l1q4",
          "Ilmu soal pasokan, distribusi, dan gunanya token disebut ___.",
          ["tokenomics", "fotografi", "geografi", "gastronomi"],
          0,
          "Kedengeran sombong, intinya: dari mana koin ini dan ke mana perginya.",
        ),
        c(
          "u4l1q5",
          "Bagaimana status regulasi dan pengawasan perdagangan aset kripto di Indonesia saat ini?",
          [
            "Perlu kamu ikuti perkembangannya. Ini bukan zona tanpa aturan",
            "Nggak ada sama sekali selamanya",
            "Cuma berlaku buat Bitcoin",
            "Diurus web3min",
          ],
          0,
          "Belajar teknologinya, tetap hormati hukum setempat.",
        ),
      ]),
      L("u4", "u4-l2", "lesson", "NFT itu apa", "Unik, bukan fotokopi tanpa batas.", "image", [
        tip("u4l2t", "NFT = unik, bukan fotokopi tanpa batas", "NFT = non-fungible token. Uang 100 ribu bisa ditukar 1:1 dengan 100 ribu lain (fungible). Tiket kursi 12A nggak bisa ditukar 1:1 dengan kursi 99Z. NFT nandain kepemilikan unik di blockchain.", {
          points: [
            "Yang on-chain biasanya token + pointer ke metadata. File JPEG-nya sering di IPFS atau server, bukan 'semua pixel di dalam blok'.",
            "Beli NFT nggak otomatis ngasih hak cipta global. Itu tergantung lisensi.",
            "Standar populer: ERC-721 (unik), ERC-1155 (bisa multi-edisi). ERC-20 itu token biasa, bukan NFT.",
            "Bisa dipakai untuk tiket, identitas, item game, atau sertifikat, bukan cuma gambar profil.",
          ],
          example: "Right-click save nyalin filenya. Token ID di rantai tetap milik alamatmu. Yang unik itu catatannya, bukan larangan screenshot.",
          remember: "Hype bisa hilang. Beli yang kamu paham dan rela pegang.",
        }),
        c(
          "u4l2q1",
          "Secara teknis, apa yang sebenarnya ditandai oleh sebuah NFT di blockchain?",
          [
            "Kepemilikan unik di blockchain atas suatu aset (sering metadata / karya)",
            "Setiap JPEG di internet",
            "Semua stablecoin",
            "Gas fee",
          ],
          0,
          "File gambarnya sering tetap di IPFS/server. Yang on-chain biasanya token + pointer.",
        ),
        tf(
          "u4l2q2",
          "Beli NFT berarti kamu otomatis punya hak cipta global atas karyanya.",
          false,
          "Sering nggak. Yang kamu beli itu token. Hak cipta tergantung lisensinya.",
        ),
        blank(
          "u4l2q3",
          "Standar NFT populer di Ethereum itu ERC-___.",
          ["721", "20", "404", "11550"],
          0,
          "721 yang klasik. 1155 bisa multi-edisi.",
        ),
        c(
          "u4l2q4",
          "Selain untuk foto profil, apa saja kegunaan nyata teknologi NFT?",
          [
            "Tiket, identitas on-chain, item game, atau sertifikat, bukan cuma PFP (foto profil)",
            "Mengganti listrik rumah",
            "Mencetak uang kertas",
            "Ngapus internet",
          ],
          0,
          "Gambar monyet itu era. Utilitasnya lebih luas.",
        ),
        c(
          "u4l2q5",
          "Fenomena harga NFT yang sempat melambung lalu anjlok memberikan pelajaran apa?",
          [
            "Likuiditas dan hype bisa hilang. Jangan beli karena gengsi",
            "Semua NFT wajib naik",
            "Negara menalangi kolektor",
            "Gas fee ngunci harga",
          ],
          0,
          "Seni boleh. Spekulasi butuh perut kuat.",
        ),
      ]),
      L("u4", "u4-l3", "lesson", "Baca marketplace", "Liat floor, volume, bukan cuma pinggiran.", "swap", [
        tip("u4l3t", "Baca pasar, jangan baca fomo", "Marketplace NFT punya istilah yang kedengeran sakti. Padahal artinya biasa saja dan bisa dimanipulasi.", {
          points: [
            "Floor price = listing terendah saat ini. Bukan harga yang dijamin selamanya.",
            "Volume ramai tiba-tiba bisa wash trading (dagang sendiri biar kelihatan laris).",
            "Mint = cetak NFT baru. Burn = hancurkan token. Metadata = data karyanya. Royalti = bagian kreator.",
            "Sebelum mint: cek situs resmi dan alamat kontrak. Situs tiruan nguras wallet.",
          ],
          example: "Bookmark OpenSea / marketplace resmi. Iklan Google yang niru merek sering phishing.",
          remember: "Angka ramai bukan bukti sehat.",
        }),
        c(
          "u4l3q1",
          "Floor price itu apaan?",
          [
            "Harga listing terendah di koleksi itu saat ini",
            "Harga yang dijamin selamanya",
            "Biaya gas",
            "Harga beli pertama kali",
          ],
          0,
          "Floor bergerak. Bukan kontrak dengan Tuhan.",
        ),
        tf("u4l3q2", "Volume dagang yang tiba-tiba ramai selalu berarti proyek sehat.", false, "Bisa wash trading. Liat juga pemegang asli dan riwayat."),
        match(
          "u4l3q3",
          "Pasangin yang nyambung.",
          [
            { left: "Mint", right: "Cetak NFT baru" },
            { left: "Floor", right: "Harga terendah" },
            { left: "Royalti", right: "Bagian kreator" },
            { left: "Metadata", right: "Data karyanya" },
          ],
        ),
        c(
          "u4l3q4",
          "Sebelum mint, yang wajib dicek?",
          [
            "Situs resmi, kontrak, dan bahwa kamu nggak di web tiruan",
            "Seleb udah FOMO nggak",
            "Warnanya pastel nggak",
            "Bisa dibayar GoPay aja tanpa cek jaringan",
          ],
          0,
          "Phishing mint nguras wallet. Bookmark situs resmi.",
        ),
        blank(
          "u4l3q5",
          "Bikin NFT baru ke blockchain disebut ___.",
          ["mint", "burn", "stake", "bridge"],
          0,
          "Mint = cetak. Burn = bakar / hancurkan token.",
        ),
      ]),
      L("u4", "u4-chest", "chest", "Peti rute 4", "Sedikit warna.", "gift", [], { xp: 0, gems: 20 }),
      L("u4", "u4-l4", "lesson", "Hype vs nilai", "Jangan beli karena timeline ramai.", "siren", [
        tip("u4l4t", "FOMO itu fitur marketing", "Timeline ramai bukan kurikulum. Banyak drop yang didesain supaya kamu buru-buru, bukan supaya kamu paham.", {
          points: [
            "Red flag: tim anonim + janji 'pasti 100x' + desak mint sekarang juga.",
            "Seleb endorse bukan due diligence. Banyak yang bayaran.",
            "Beli yang kamu paham dan rela pegang, bukan yang kamu takut ketinggalan.",
            "Urutan waras: cek situs resmi, lalu kontrak, baru pikirin estetikanya.",
          ],
          example: "Grup VIP 'masuk sekarang malam ini 100x' itu pola klasik pump-and-dump. Yang butuh kamu buru-buru, butuh uangmu.",
          remember: "Kalau terlalu indah dan harus sekarang juga, itu umpan.",
        }),
        c(
          "u4l4q1",
          "Red flag proyek NFT / token?",
          [
            "Tim anonim + janji 'pasti 100x' + desak mint sekarang juga",
            "Dokumentasi jelas dan komunitas yang nanya kritis",
            "Kode diaudit dan risiko dijelaskan",
            "Utilitas yang bisa kamu jelaskan sendiri",
          ],
          0,
          "Desakan + jaminan cuan = marketing, bukan edukasi.",
        ),
        tf("u4l4q2", "Kalau seleb nge-promo NFT, itu jaminan berkualitas.", false, "Endorsement bukan due diligence. Banyak yang bayaran."),
        c(
          "u4l4q3",
          "Sikap web3min soal koleksi digital?",
          [
            "Beli yang kamu paham dan rela pegang, bukan yang kamu takut ketinggalan",
            "All-in setiap drop",
            "Pinjam uang mertua",
            "Ikut semua raffle Twitter",
          ],
          0,
          "FOMO itu fitur marketing. Bukan strategi.",
        ),
        order(
          "u4l4q4",
          "Susun langkah yang aman sebelum melakukan mint NFT:",
          ["Cek", "situs", "resmi", "lalu", "kontrak"],
          "Memverifikasi keaslian situs dan alamat kontrak cerdas adalah prioritas utama sebelum mempertimbangkan aspek seni atau keuntungan.",
        ),
        c(
          "u4l4q5",
          "Kalau gambar NFT bisa di-right click save, apakah NFT-nya jadi nggak berarti?",
          [
            "File bisa disalin, token kepemilikannya yang unik di rantai",
            "Ya, jadi sia-sia total",
            "Right click menghapus blockchain",
            "Save as PNG men-transfer hak",
          ],
          0,
          "Argumen 'right click' kelewat apa yang dicatat di rantai: token id-mu.",
        ),
      ]),
      L("u4", "u4-cp", "checkpoint", "Ujian rute 4", "Token, NFT, hype.", "flag", [
        tip("u4cpt", "Ulangan unit 4", "Cek dulu, NFT dan token udah nggak campur aduk belum.", {
          points: [
            "NFT = non-fungible. ERC-20 token biasa, ERC-721 NFT.",
            "Beli NFT nggak otomatis dapet hak cipta. Floor = listing terendah saat ini.",
            "Mint di situs tiruan dan wash trading itu jebakan.",
          ],
          remember: "Hype bukan nilai.",
        }),
        j("u4cp1","NFT itu singkatan dari apa?",["Non-fungible token","New finance token","Network fee transfer","No fee token"],0,"Non-fungible artinya unik, nggak bisa ditukar 1:1 dengan yang lain."),
        M("u4cp2","Beli NFT selalu termasuk hak cipta penuh atas karyanya.",false,"Salah. Yang kamu beli itu tokennya. Hak pakai gambar tergantung lisensi koleksi itu."),
        N("u4cp3","Harga listing terendah di satu koleksi NFT disebut ___ price.",["floor","gas","mint","royalty"],0,"Floor price = harga jual termurah saat ini. Bukan jaminan kamu bisa jual di harga itu."),
        j("u4cp4","Apa beda ERC-20 dan ERC-721?",["ERC-20 token biasa, ERC-721 NFT unik","Dua-duanya NFT","Dua-duanya standar Bitcoin","ERC-721 lebih murah gas-nya"],0,"ERC-20 bisa dibagi dan ditukar 1:1. ERC-721 unik satu per satu."),
        M("u4cp5","Wash trading bisa bikin volume kelihatan ramai padahal palsu.",true,"Benar. Pelaku jual-beli ke dirinya sendiri supaya koleksi kelihatan laris."),
        j("u4cp6","Apa risiko mint di situs tiruan?",["Aset di wallet bisa terkuras","Dapat NFT versi premium","Gas jadi lebih murah","Masuk whitelist resmi"],0,"Situs tiruan biasanya minta izin atau tanda tangan yang bisa nguras isi wallet."),
      ]),
    ],
  },
  {
    id: "u6",
    index: 6,
    title: "Waspada penipu",
    subtitle: "Pelajaran paling mahal kalau dilesetin",
    color: "red",
    lessons: [
      L("u6", "u6-l1", "lesson", "Phishing", "Situs palsu, link manis.", "shield", [
        tip("u6l1t", "Phishing: niru yang resmi", "Unit ini yang paling mahal kalau dilesetin. Teknologi nggak nolong kalau kamu pencet Connect di tempat yang salah. Phishing = situs, DM, atau iklan yang niru merek resmi supaya kamu connect wallet atau ngetik seed.", {
          points: [
            "Bookmark situs resmi. Jangan mengandalkan tautan iklan di mesin pencari atau medsos karena sering kali jebakan tiruan.",
            "Domain hampir sama (tanda hubung, huruf hilang, .help) = red flag.",
            "Pop-up 'permit' atau 'set approval for all' yang nggak kamu inisiasi: baca, lalu tolak.",
            "Support resmi nggak nyapa di DM dan minta seed.",
          ],
          example: "Kamu klik banner 'Claim airdrop MetaMask' di X, domainnya metamask-login.help, form minta 12 kata. Itu bukan MetaMask. Pergi.",
          remember: "Kalau keburu-buru, penipu yang menang.",
        }),
        c("u6l1q1","Mana yang paling mungkin pesan phishing?",["DM Telegram: 'Akunmu kena hack, klik link ini buat verifikasi seed'","Email promo dari toko online","Notifikasi update aplikasi resmi","Struk transaksi dari kasir"],0,"Penipu suka pura-pura jadi tim support atau bikin panik biar kamu buru-buru klik.", "Kalau keburu-buru, penipu yang menang."),
        tf(
          "u6l1q2",
          "Domain yang hampir sama (metamask-login.help) bisa jadi jebakan.",
          true,
          "Huruf tipis yang hilang, tanda hubung mencurigakan, atau domain asing adalah red flag.",
        ),
        c(
          "u6l1q3",
          "Tiba-tiba muncul pop-up izin 'permit' atau 'setApprovalForAll' yang tidak kamu minta. Sikapmu?",
          [
            "Baca. Kalau nggak kamu inisiasi, tolak",
            "Selalu tekan sign biar keren",
            "Tanya di kolom komentar TikTok sambil sign",
            "Kirim seed ke pop-up",
          ],
          0,
          "Tanda tangan bisa berisi izin nguras token. Bukan cuma 'oke'.",
        ),
        blank(
          "u6l1q4",
          "Kebiasaan aman: ___ situs resmi, jangan andalin iklan pencarian.",
          ["bookmark", "hapus", "share", "fork"],
          0,
          "Iklan Google/X sering niru merek.",
        ),
        c(
          "u6l1q5",
          "Ada akun mengaku 'support resmi' yang mengirimkan pesan DM duluan kepadamu. Siapa dia?",
          [
            "Bukan support. Support resmi nggak nyapa di DM minta seed",
            "Pasti resmi karena logonya sama",
            "Boleh dikasih screenshot seed",
            "Lebih cepat dari email",
          ],
          0,
          "Yang nyapa duluan, curigai.",
        ),
      ]),
      L("u6", "u6-l2", "lesson", "Scam seed & admin", "Admin Telegram bukan Tuhan.", "userx", [
        tip("u6l2t", "Admin yang minta seed = penipu", "Nggak ada prosedur resmi yang minta 12 kata lewat chat, form web, atau 'validasi airdrop'. Wallet, bursa, dan proyek nggak kerja gitu.", {
          points: [
            "CS nggak pernah minta seed. Yang nyapa duluan di DM, curigai.",
            "'Seed buat sinkronisasi airdrop' itu omong kosong. Airdrop cukup alamat.",
            "Kalau udah terlanjur share seed: anggap rusak. Buat wallet baru, pindahin sisa aset, yang bocor jangan dipakai lagi.",
          ],
          example: "Telegram: 'Admin support, silakan validasi wallet dengan 12 kata biar whitelist.' Blokir. Jangan dikasih.",
          remember: "Minta seed → tolak & blokir.",
        }),
        c(
          "u6l2q1",
          "Seseorang mengaku admin dan meminta 12 kata kunci untuk 'validasi dompet'. Bagaimana tindakanmu?",
          [
            "Penipu. Blokir. Jangan dikasih",
            "Prosedur resmi semua wallet",
            "Syarat airdrop Binance",
            "Cara menaikkan streak",
          ],
          0,
          "Nggak ada validasi pakai seed. Titik.",
          "Aku serius. Ini hal yang bikin banyak orang nangis.",
        ),
        tf("u6l2q2", "Wallet resmi nggak akan minta seed phrase lewat form web biasa.", true, "Kalau form minta 12 kata, pergi."),
        j("u6l2q3","'Seed phrase buat sinkronisasi airdrop' itu apa?",["Omong kosong, itu penipuan","Standar token baru","Fitur keamanan wallet","Syarat klaim resmi"],0,"Airdrop nggak butuh seed. Cukup alamat wallet."),
        match(
          "u6l2q4",
          "Pasangin reaksi yang bener.",
          [
            { left: "Minta seed", right: "Tolak & blokir" },
            { left: "Minta alamat", right: "Boleh, buat kirim" },
            { left: "Link aneh", right: "Jangan connect" },
            { left: "CS nyapa DM", right: "Curigai" },
          ],
        ),
        order(
          "u6l2q5",
          "Susun langkah darurat jika kunci rahasia terlanjur bocor:",
          ["Pindahkan", "sisa", "aset", "ke", "wallet", "baru"],
          "Buat wallet baru dari seed baru. Yang bocor anggap rusak.",
        ),
      ]),
      L("u6", "u6-l3", "lesson", "Rugpull", "Likuiditas dibawa kabur.", "siren", [
        tip("u6l3t", "Toko tutup, DP dibawa kabur", "Rugpull: tim narik likuiditas atau nutup pintu jual, harga jatuh, pembeli tertinggal. Di crypto kecepatannya menit, bukan bulan.", {
          points: [
            "Likuiditas pool = kolam token tempat orang swap. Kalau dikosongin, harga bisa ke nol.",
            "Janji 'masuk sekarang, 100x malam ini, grup VIP' = pola pump-and-dump / rug.",
            "Likuiditas terkunci dan tim transparan memang mengurangi risiko, tapi bukan berarti menghilangkannya sama sekali.",
            "Koin baru di timeline: abaikan dulu. Kalau perlu, dana yang siap hilang. Jangan all-in gaji.",
          ],
          example: "Token baru, chart hijau, grup ramai, 10 menit kemudian pool dikosongin. Itu rugpull, bukan 'koreksi sehat'.",
          remember: "Yang butuh kamu buru-buru, biasanya butuh uangmu.",
        }),
        c(
          "u6l3q1",
          "Rugpull itu apaan?",
          [
            "Tim narik likuiditas / pintu keluar, harga jatuh, pembeli tertinggal",
            "Update software wallet",
            "Nama gas fee",
            "Cara staking resmi",
          ],
          0,
          "Mirip toko yang bawa kabur DP. Di crypto kecepatannya menit.",
        ),
        tf("u6l3q2", "Likuiditas yang dikunci dan tim yang transparan ngurangin (bukan ngapus) risiko rugpull.", true, "Ngurangin. Bukan ramuan kebal."),
        c(
          "u6l3q3",
          "Ajakan di grup: 'Masuk sekarang, dijamin naik 100x malam ini'. Apa arti sebenarnya?",
          [
            "Pola klasik pump-and-dump / rug",
            "Sinyal resmi bursa",
            "Program LPS",
            "Fitur L2",
          ],
          0,
          "Yang butuh kamu buru-buru, biasanya butuh uangmu, bukan kebaikanmu.",
        ),
        blank(
          "u6l3q4",
          "Kolam token tempat orang swap disebut liquidity ___.",
          ["pool", "seed", "mint", "floor"],
          0,
          "Kalau pool dikosongin, harga bisa jatuh ke nol.",
        ),
        c(
          "u6l3q5",
          "Cara paling aman nyikapin koin baru di timeline?",
          [
            "Abaikan dulu. Kalau perlu, riset tanpa FOMO, dana yang siap hilang",
            "All-in gaji pertama",
            "Pinjam paylater",
            "Share seed ke bot 'checker'",
          ],
          0,
          "Kebanyakan koin baru nggak layak waktu otakmu, apalagi uangmu.",
        ),
      ]),
      L("u6", "u6-chest", "chest", "Peti rute 6", "Hadiah buat yang waspada.", "gift", [], { xp: 0, gems: 25 }),
      L("u6", "u6-l4", "lesson", "Airdrop & 'double'", "Hadiah gratis yang tagihannya seed.", "gift", [
        tip("u6l4t", "Hadiah gratis yang tagihannya brankas", "Airdrop resmi mendarat ke alamat. Nggak pernah minta seed, nggak minta kamu transfer 1 ETH dulu buat 'syarat', nggak lewat DM admin.", {
          points: [
            "'Double your ETH in 10 minutes' = mesin penghisap. Kirim 1, dapet 0.",
            "Connect wallet ke situs klaim yang nggak kamu kenal bisa nandatanganin izin berbahaya.",
            "Gratis yang maksa kamu buru-buru hampir selalu berbayar mahal.",
          ],
          example: "Situs 'claim 2x ETH, send 0.2 dulu'. Itu bukan bug yang sah dipanen. Itu umpan.",
          remember: "Kalau terlalu indah, itu umpan.",
        }),
        c(
          "u6l4q1",
          "Bagaimana prosedur distribusi airdrop resmi yang sebenarnya?",
          [
            "Mendarat ke alamat, nggak pernah minta seed",
            "Minta 12 kata buat 'klaim'",
            "Minta kamu transfer dulu 1 ETH 'syarat'",
            "Wajib lewat DM admin",
          ],
          0,
          "Klaim yang minta deposit dulu = bukan hadiah.",
        ),
        tf(
          "u6l4q2",
          "Situs 'double your ETH in 10 minutes' itu amal.",
          false,
          "Itu mesin penghisap. Kirim 1, dapet 0.",
        ),
        c(
          "u6l4q3",
          "Menghubungkan dompet ke situs klaim hadiah yang tidak jelas asal-usulnya dapat berakibat apa?",
          [
            "Bisa nandatanganin izin berbahaya. Riset dulu atau jangan",
            "Selalu aman karena 'view only'",
            "Wajib buat semua airdrop",
            "Menambah nyawa Blobi",
          ],
          0,
          "Connect ≠ always harmless. Izin bisa dalam.",
        ),
        c("u6l4q4", "Seseorang menjanjikan keuntungan 10% per hari tanpa risiko sama sekali di grup chat. Sikapmu?", ["Curiga, itu pola penipuan klasik yang tidak realistis", "Langsung transfer semua tabungan", "Pinjam uang bank untuk modal", "Bantu sebarkan ke keluarga"], 0, "Keuntungan luar biasa tanpa risiko nyata hampir selalu merupakan skema penipuan piramida."),
        order(
          "u6l4q5",
          "Susun mantra pengingat bahaya di Web3:",
          ["Kalau", "terlalu", "indah", "itu", "umpan"],
          "Mantra ini mengingatkan bahwa setiap penawaran yang tampak terlalu mudah dan menguntungkan hampir selalu merupakan jebakan.",
        ),
      ]),
      L("u6", "u6-cp", "checkpoint", "Ujian rute 6", "Kalau lulus sini, Blobi tenang.", "flag", [
        tip("u6cpt", "Ulangan unit 6", "Kalau lulus sini, web3min agak tenang. Cek refleksmu.", {
          points: [
            "Admin minta seed = penipu. Phishing niru merek. Cek URL.",
            "Rugpull = likuiditas dibawa kabur. Double ETH 10 menit = scam.",
            "Airdrop resmi nggak butuh seed. Pop-up tanda tangan yang nggak kamu minta: tolak.",
          ],
          remember: "Napas. Cek. Baru klik.",
        }),
        j("u6cp1","Ada 'admin' yang minta seed phrase kamu. Dia siapa?",["Penipu","Tim support resmi","Petugas verifikasi airdrop","Moderator yang lagi bantu"],0,"Nggak ada pihak resmi yang pernah minta seed phrase. Langsung blokir."),
        M("u6cp2","Phishing meniru merek resmi supaya kamu salah klik.",true,"Benar. Selalu cek alamat situs (URL) sebelum connect wallet."),
        N("u6cp3","Tim yang kabur bawa dana likuiditas disebut ___pull.",["rug","tug","bug","hug"],0,"Rugpull: likuiditas ditarik, harga token jatuh, pembeli nggak bisa keluar."),
        j("u6cp4","Tawaran 'kirim 1 ETH, dapat 2 ETH dalam 10 menit' itu apa?",["Penipuan","Promo resmi exchange","Fitur staking","Bonus airdrop"],0,"Nggak ada yang menggandakan saldo. Yang kamu kirim nggak akan kembali."),
        M("u6cp5","Airdrop resmi butuh seed phrase untuk klaim.",false,"Salah. Airdrop cukup pakai alamat wallet. Yang minta seed pasti penipu."),
        j("u6cp6","Muncul pop-up tanda tangan yang nggak kamu minta. Harus gimana?",["Tolak","Tanda tangan biar cepat","Isi seed phrase","Tanya di grup sambil tanda tangan"],0,"Tanda tangan bisa berisi izin menarik token. Kalau kamu nggak memulainya, tolak."),
      ]),
    ],
  },
];

export const UNITS: Unit[] = withProofs(withGapLessons([...CORE_UNITS, ...MORE_UNITS, ...LATER_UNITS]));

export function allPathNodes(): Lesson[] {
  return UNITS.flatMap((unit) => unit.lessons);
}

export function sequentialNodes(): Lesson[] {
  return allPathNodes().filter((node) => node.kind !== "chest");
}

export function getLesson(id: string): Lesson | undefined {
  return allPathNodes().find((node) => node.id === id);
}

export function getUnit(id: string): Unit | undefined {
  return UNITS.find((unit) => unit.id === id);
}

export function isUnlocked(id: string, completed: string[]): boolean {
  const lesson = getLesson(id);
  if (!lesson) return false;
  if (lesson.kind === "chest") {
    const all = allPathNodes();
    const idx = all.findIndex((node) => node.id === id);
    for (let i = idx - 1; i >= 0; i--) {
      const prev = all[i];
      if (prev && prev.kind !== "chest") return completed.includes(prev.id);
    }
    return true;
  }
  const seq = sequentialNodes();
  const idx = seq.findIndex((node) => node.id === id);
  if (idx <= 0) return true;
  const prev = seq[idx - 1];
  return prev ? completed.includes(prev.id) : false;
}

export function firstIncompleteId(completed: string[]): string | null {
  return allPathNodes().find((node) => !completed.includes(node.id))?.id ?? null;
}

export function firstPlayableId(completed: string[]): string | null {
  return sequentialNodes().find((node) => !completed.includes(node.id))?.id ?? null;
}

export function scoredExerciseCount(lesson: Lesson): number {
  return lesson.exercises.filter((ex) => ex.type !== "tip").length;
}

export function unitEarned(unit: Unit, completed: string[]): boolean {
  const gym = unit.lessons.find((l) => l.kind === "checkpoint");
  if (gym) return completed.includes(gym.id);
  return unit.lessons.filter((l) => l.kind === "lesson").every((l) => completed.includes(l.id));
}

export const UNIT_THEME: Record<
  UnitColor,
  { bar: string; node: string; shadow: string; ink: string; soft: string }
> = {
  green: {
    bar: "bg-unit-green",
    node: "bg-unit-green",
    shadow: "border-primary-shadow",
    ink: "text-primary-ink",
    soft: "bg-primary-soft",
  },
  blue: {
    bar: "bg-candy-500",
    node: "bg-candy-500",
    shadow: "border-choco-900",
    ink: "text-white",
    soft: "bg-candy-100",
  },
  gold: {
    bar: "bg-unit-gold",
    node: "bg-unit-gold",
    shadow: "border-gold-shadow",
    ink: "text-fg",
    soft: "bg-cream",
  },
  purple: {
    bar: "bg-unit-purple",
    node: "bg-unit-purple",
    shadow: "border-blob-deep",
    ink: "text-primary-ink",
    soft: "bg-danger-soft",
  },
  teal: {
    bar: "bg-unit-teal",
    node: "bg-unit-teal",
    shadow: "border-primary-shadow",
    ink: "text-primary-ink",
    soft: "bg-primary-soft",
  },
  red: {
    bar: "bg-unit-red",
    node: "bg-unit-red",
    shadow: "border-danger-shadow",
    ink: "text-primary-ink",
    soft: "bg-danger-soft",
  },
};
