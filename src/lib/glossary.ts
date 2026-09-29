/**
 * Kamus istilah web3min (U9).
 *
 * Aturan produk (disetujui pemilik repo):
 *  - Definisi = teks BARU yang ditulis di sini; tidak ada teks materi yang diubah.
 *  - Halaman `/kamus` menampilkan daftar lengkap; `splitGlossary` dipakai untuk
 *    tautan "ketuk untuk arti" DI DALAM materi (rangkuman kilat & penjelasan
 *    jawaban). Sumber teks materi tetap utuh: pencocokan terjadi saat render.
 *  - Satu istilah hanya ditautkan SEKALI per blok teks (yang pertama), supaya
 *    halaman tidak penuh garis bawah.
 *  - Pencocokan case-insensitive, batas kata, sadar akhiran -nya/-mu/-ku/-lah/
 *    -kah/-pun (mis. "dompetnya" ikut tertaut). Frasa lebih panjang menang
 *    (mis. "biaya gas" ditautkan utuh, bukan cuma "gas").
 */
export interface GlossaryEntry {
  id: string;
  term: string;
  /** Ejaan lain yang ikut dikenali saat pencocokan teks. */
  aliases?: string[];
  /** Arti singkat, 1-2 kalimat, bahasa santai seperti materi. */
  def: string;
  /** id istilah terkait untuk "Lihat juga". */
  related?: string[];
}

export const GLOSSARY: GlossaryEntry[] = [
  {
    id: "web3",
    term: "Web3",
    def: "Internet yang dibangun di atas blockchain: datanya tidak dipegang satu perusahaan, tapi dicatat bersama di banyak komputer.",
    related: ["web2", "blockchain"],
  },
  {
    id: "web2",
    term: "Web2",
    def: "Internet yang kita pakai sehari-hari, seperti Instagram, GoPay, dan m-banking. Datanya hidup di server perusahaan.",
    related: ["web3"],
  },
  {
    id: "blockchain",
    term: "blockchain",
    def: "Buku kas digital yang disalin ke banyak komputer. Tiap blok mencatat transaksi dan menyambung ke blok sebelumnya.",
    related: ["gas", "explorer"],
  },
  {
    id: "wallet",
    term: "wallet",
    aliases: ["dompet"],
    def: "Aplikasi atau perangkat untuk menyimpan kunci dan mengelola aset kripto. Isinya kunci, bukan koin fisik.",
    related: ["seed-phrase", "private-key"],
  },
  {
    id: "seed-phrase",
    term: "seed phrase",
    def: "12 atau 24 kata yang bisa memulihkan seluruh isi dompetmu. Siapa pun yang tahu kata-katanya bisa mengambil alih dompetmu.",
    related: ["private-key", "wallet"],
  },
  {
    id: "private-key",
    term: "private key",
    def: "Kunci rahasia yang membuktikan dompet itu milikmu. Jangan pernah dikirim atau ditempel ke situs mana pun.",
    related: ["seed-phrase", "wallet"],
  },
  {
    id: "gas",
    term: "gas",
    aliases: ["biaya gas", "gas fee"],
    def: "Biaya yang dibayar untuk memproses transaksi di blockchain. Besarnya naik-turun tergantung seberapa ramai jaringannya.",
    related: ["gwei", "blockchain"],
  },
  {
    id: "gwei",
    term: "gwei",
    def: "Satuan kecil untuk mengukur biaya gas di jaringan Ethereum. 1 gwei jauh lebih kecil dari 1 ETH.",
    related: ["gas"],
  },
  {
    id: "nft",
    term: "NFT",
    def: "Token unik yang membuktikan kepemilikan sebuah karya atau item digital. Bisa dipindah dan dijual, tapi tidak menjamin nilainya.",
    related: ["blockchain"],
  },
  {
    id: "defi",
    term: "DeFi",
    def: "Layanan keuangan seperti pinjam, simpan, dan tukar yang berjalan lewat smart contract, tanpa bank perantara.",
    related: ["smart-contract", "dex"],
  },
  {
    id: "dex",
    term: "DEX",
    def: "Bursa tukar token yang berjalan on-chain lewat kontrak, bukan perusahaan. Kamu menukar langsung dari dompetmu.",
    related: ["defi", "slippage"],
  },
  {
    id: "stablecoin",
    term: "stablecoin",
    def: "Token yang nilainya dipatok ke mata uang biasa, biasanya dolar AS. Dipakai untuk menyimpan nilai tanpa keluar dari kripto.",
    related: ["wallet"],
  },
  {
    id: "smart-contract",
    term: "smart contract",
    def: "Program yang berjalan di blockchain dan biasanya tidak bisa diubah setelah dipasang. Aturannya dijalankan otomatis.",
    related: ["defi", "blockchain"],
  },
  {
    id: "staking",
    term: "staking",
    def: "Mengunci token di jaringan untuk ikut menjaga keamanannya, biasanya dapat imbalan. Tokenmu bisa terkunci atau berisiko kalau salah pilih.",
    related: ["apy"],
  },
  {
    id: "airdrop",
    term: "airdrop",
    def: "Pembagian token gratis ke pengguna, sering sebagai hadiah karena sudah mencoba sebuah proyek. Banyak juga yang jadi umpan penipuan.",
    related: ["phishing"],
  },
  {
    id: "bridge",
    term: "bridge",
    def: "Jembatan untuk memindahkan aset dari satu jaringan ke jaringan lain. Risikonya besar: banyak peretasan terjadi di bridge.",
    related: ["l2"],
  },
  {
    id: "likuiditas",
    term: "likuiditas",
    def: "Stok token yang tersedia untuk ditukar di sebuah pool. Makin besar stoknya, makin kecil perubahan harga saat kamu menukar.",
    related: ["dex", "slippage"],
  },
  {
    id: "slippage",
    term: "slippage",
    def: "Selisih antara harga yang kamu harap dan harga yang benar-benar jadi saat swap. Pasar yang bergerak cepat membuat selisihnya makin besar.",
    related: ["dex", "likuiditas"],
  },
  {
    id: "oracle",
    term: "oracle",
    def: "Layanan yang memasukkan data dunia nyata, misalnya harga, ke blockchain. Kalau datanya dimanipulasi, kontrak bisa salah hitung.",
    related: ["smart-contract"],
  },
  {
    id: "memecoin",
    term: "memecoin",
    def: "Token yang lahir dari lelucon atau tren, biasanya tanpa produk. Bisa naik cepat, bisa rugi total lebih cepat.",
    related: ["rug-pull"],
  },
  {
    id: "rug-pull",
    term: "rug pull",
    def: "Pengembang kabur membawa dana pengguna, biasanya lewat likuiditas yang ditarik. Tanda-tandanya sering kelihatan sebelum kejadian.",
    related: ["likuiditas", "memecoin"],
  },
  {
    id: "testnet",
    term: "testnet",
    def: "Jaringan uji coba tempat tokennya tidak bernilai uang. Tempat aman untuk latihan sebelum menyentuh jaringan asli.",
    related: ["faucet"],
  },
  {
    id: "faucet",
    term: "faucet",
    def: "Situs atau bot yang membagikan token testnet gratis untuk latihan. Tokennya palsu dan tidak ada harganya.",
    related: ["testnet"],
  },
  {
    id: "apy",
    term: "APY",
    def: "Perkiraan hasil tahunan dari staking atau simpan-pinjam, sudah termasuk efek bunga berbunga. Angka tinggi biasanya datang dengan risiko tinggi.",
    related: ["staking"],
  },
  {
    id: "mev",
    term: "MEV",
    def: "Keuntungan yang diambil bot dengan menyerobot urutan transaksi di antrean. Efeknya untuk pengguna: harga jadi sedikit lebih buruk.",
    related: ["slippage"],
  },
  {
    id: "dao",
    term: "DAO",
    def: "Organisasi yang dijalankan aturan on-chain dan suara anggotanya, bukan satu bos. Kasnya biasanya transparan di blockchain.",
    related: ["blockchain"],
  },
  {
    id: "explorer",
    term: "explorer",
    def: "Situs untuk melihat isi blockchain: transaksi, alamat, dan kontrak. Alat wajib untuk mengecek sebelum kirim aset.",
    related: ["blockchain"],
  },
  {
    id: "halving",
    term: "halving",
    def: "Pemotongan imbalan penambang Bitcoin jadi separuh, terjadi sekitar tiap 4 tahun. Pasokan barunya makin langka.",
    related: ["blockchain"],
  },
  {
    id: "phishing",
    term: "phishing",
    def: "Penipuan yang menyamar jadi situs atau pesan resmi untuk mencuri kata sandi dan seed phrase. Cek alamat situs sebelum mengisi apa pun.",
    related: ["seed-phrase", "honeypot"],
  },
  {
    id: "honeypot",
    term: "honeypot",
    def: "Token atau kontrak yang cuma bisa dibeli, tidak bisa dijual. Kamu bisa masuk, tapi tidak bisa keluar.",
    related: ["rug-pull"],
  },
  {
    id: "multisig",
    term: "multisig",
    def: "Dompet yang butuh beberapa tanda tangan untuk mengirim aset. Dipakai untuk kas bersama supaya tidak bisa dibawa kabur satu orang.",
    related: ["wallet"],
  },
  {
    id: "p2p",
    term: "P2P",
    def: "Transaksi antar-orang langsung, tanpa bursa perantara. Risikonya: harus lebih hati-hati memilih lawan transaksi.",
    related: [],
  },
  {
    id: "tvl",
    term: "TVL",
    def: "Total nilai aset yang dikunci di sebuah protokol DeFi. Bukan jaminan aman, hanya ukuran seberapa besar dananya.",
    related: ["defi"],
  },
  {
    id: "impermanent-loss",
    term: "impermanent loss",
    def: "Kerugian relatif yang muncul saat harga token di pool berubah dibanding kalau kamu simpan saja. Sering muncul di pool likuiditas.",
    related: ["likuiditas"],
  },
  {
    id: "leverage",
    term: "leverage",
    def: "Pinjaman berlipat untuk membuka posisi lebih besar dari modalmu. Memperbesar untung sekaligus memperbesar rugi.",
    related: [],
  },
  {
    id: "l2",
    term: "L2",
    aliases: ["layer 2"],
    def: "Jaringan di atas Ethereum yang memproses transaksi lebih murah dan cepat. Dananya tetap diamankan jaringan utama.",
    related: ["bridge", "gas"],
  },
  {
    id: "hash",
    term: "hash",
    def: "Sidik jari digital dari sebuah data. Sekecil apa pun perubahannya, hasil hash-nya berubah total.",
    related: ["blockchain"],
  },
];

const byId = new Map(GLOSSARY.map((e) => [e.id, e]));

export function glossaryEntry(id: string): GlossaryEntry | undefined {
  return byId.get(id);
}

/** Akhiran Indonesia yang boleh menempel di istilah (mis. "dompetnya"). */
const SUFFIX = "(?:nya|mu|ku|lah|kah|pun)?";

function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** Varian (istilah + alias) diurutkan panjang dulu supaya frasa menang. */
const VARIANTS: Array<{ pattern: string; id: string }> = GLOSSARY.flatMap((e) =>
  [e.term, ...(e.aliases ?? [])].map((v) => ({ pattern: v, id: e.id })),
).sort((a, b) => b.pattern.length - a.pattern.length);

const VARIANT_BY_LOWER = new Map(VARIANTS.map((v) => [v.pattern.toLowerCase(), v.id]));

const SCAN = new RegExp(`\\b(${VARIANTS.map((v) => escapeRegExp(v.pattern)).join("|")})${SUFFIX}\\b`, "giu");

export type GlossarySegment =
  | { text: string; entry: null }
  | { text: string; entry: GlossaryEntry };

/**
 * Pecah teks menjadi segmen biasa dan segmen istilah (untuk ditautkan).
 * Satu istilah hanya muncul SEKALI sebagai tautan per pemanggilan; kemunculan
 * berikutnya tetap teks biasa.
 */
export function splitGlossary(text: string): GlossarySegment[] {
  if (!text) return [{ text, entry: null }];
  const out: GlossarySegment[] = [];
  const seen = new Set<string>();
  let last = 0;
  for (const m of text.matchAll(SCAN)) {
    const id = VARIANT_BY_LOWER.get(m[1].toLowerCase());
    const entry = id ? byId.get(id) : undefined;
    const start = m.index ?? 0;
    if (!entry || seen.has(entry.id)) continue;
    seen.add(entry.id);
    if (start > last) out.push({ text: text.slice(last, start), entry: null });
    out.push({ text: text.slice(start, start + m[0].length), entry });
    last = start + m[0].length;
  }
  if (last < text.length) out.push({ text: text.slice(last), entry: null });
  return out.length > 0 ? out : [{ text, entry: null }];
}
