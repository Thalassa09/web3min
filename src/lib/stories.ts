import { proofsById } from "@/lib/proof";
import { sequentialNodes } from "@/lib/curriculum";

export type StoryMood = "idle" | "wave" | "sad" | "celebrate" | "think" | "proud";

export type Speaker = "web3min" | "penipu" | "teman" | "cs" | "kamu";

export type StoryBeat =
  | { type: "talk"; who: Speaker; mood?: StoryMood; text: string }
  | { type: "proof"; proofId: string; text: string }
  | { type: "fork"; prompt: string; options: { label: string; good: boolean; reply: string }[] }
  | { type: "end"; text: string; remember: string };

export type Story = {
  id: string;
  title: string;
  blurb: string;
  minutes: number;
  xp: number;
  gems: number;
  unlockAfter: string | null;
  color: "rose" | "sky" | "gold" | "teal" | "purple";
  beats: StoryBeat[];
};

export type CaseStep = { look: string; say: string };

export type CaseStudy = {
  id: string;
  title: string;
  blurb: string;
  proofId: string;
  minutes: number;
  xp: number;
  gems: number;
  unlockAfter: string | null;
  steps: CaseStep[];
  remember: string;
};

export const SPEAKER_LABEL: Record<Speaker, string> = {
  web3min: "web3min",
  penipu: "Nomor asing",
  teman: "Teman",
  cs: "CS palsu",
  kamu: "Kamu",
};

export const STORIES: Story[] = [
  {
    id: "s-peta",
    title: "Web3 bukan cuma chart",
    blurb: "Trade satu gang. Ada DeFi, kerja, DAO, NFT.",
    minutes: 3,
    xp: 6,
    gems: 2,
    unlockAfter: null,
    color: "sky",
    beats: [
      {
        type: "talk",
        who: "teman",
        text: "Web3 itu trading, kan? Chart hijau, leverage, cuan. Gw mau yang itu.",
      },
      {
        type: "talk",
        who: "web3min",
        mood: "think",
        text: "Itu satu gang. Bukan seluruh kota. Banyak yang nyasar soalnya dikira cuma itu.",
      },
      {
        type: "talk",
        who: "web3min",
        mood: "wave",
        text: "Ada yang pegang kunci sendiri. Ada yang tukar dan pinjam di DeFi. Ada yang kerja community. Ada yang vote di DAO. Ada yang mint tiket. Bukan semua nge-chart.",
      },
      {
        type: "proof",
        proofId: "drop-arb-18k",
        text: "2.125 ARB, $18 ribu. Bukan all-in futures. Pake L2, gas murah, token nyangkut.",
      },
      {
        type: "fork",
        prompt: "Teman bilang 'yang penting entry BTC, yang lain buang waktu'. Kamu?",
        options: [
          {
            label: "Iya. Web3 = chart.",
            good: false,
            reply: "Chart nyata. Tapi kalo kunci ilang, NFT kena tipu, atau sign drainer, chart nggak nolong.",
          },
          {
            label: "Chart satu rute. Aku mau liat peta dulu.",
            good: true,
            reply: "Nah. 20 rute. Dompet, DeFi, NFT, airdrop, aman, on-chain. Trade ada, nanti.",
          },
        ],
      },
      {
        type: "end",
        text: "Kamu boleh trade. Tapi jangan masuk hutan cuma bawa satu peta. Yang lain juga hidup di rantai yang sama.",
        remember: "Web3 = internet yang kuncinya di kamu. Trading cuma salah satu pintunya.",
      },
    ],
  },
  {
    id: "s-defi",
    title: "Pinjam tanpa bank",
    blurb: "DeFi: lend, borrow, pool. Bukan chart, bukan LPS.",
    minutes: 4,
    xp: 6,
    gems: 2,
    unlockAfter: null,
    color: "teal",
    beats: [
      {
        type: "talk",
        who: "teman",
        text: "DeFi itu apaan, sih? Gw kira cuma swap biar bisa nge-chart.",
      },
      {
        type: "talk",
        who: "web3min",
        mood: "wave",
        text: "Swap pintu masuk. Di dalam: kamu bisa kasih pinjaman, minjem pake agunan, atau kasih likuiditas. Tanpa teller. Tanpa LPS.",
      },
      {
        type: "talk",
        who: "web3min",
        mood: "think",
        text: "Lend: orang minjem, kamu dapet bunga. Borrow: kunci ETH, cairin stable. Pool: taruh dua token, dapet fee. Harga geser, bisa kalah vs hold.",
      },
      {
        type: "fork",
        prompt: "Banner 4.000% APY, 'aman kayak deposito'. Kamu?",
        options: [
          {
            label: "Gas. DeFi kan tanpa bank, pasti cuan.",
            good: false,
            reply: "Tanpa bank juga tanpa LPS. Bunga gila sering dari token yang jatuh, atau duit orang baru.",
          },
          {
            label: "Tanya dulu: bunganya dari mana?",
            good: true,
            reply: "Nah. Peminjam bayar, atau fee swap — itu masuk akal. 4.000% dari angin — umpan.",
          },
        ],
      },
      {
        type: "end",
        text: "DeFi mesin uang tanpa teller. Bisa kepake hidup. Bisa nyita agunan. Baca dulu, baru taruh.",
        remember: "Bunga ada sumbernya, atau itu umpan. Nggak ada CS yang nahan likuidasi.",
      },
    ],
  },
  {
    id: "s-kerja",
    title: "Gaji, bukan chart",
    blurb: "Community, bounty, intern. Kerjaan beneran nggak nagi ETH.",
    minutes: 4,
    xp: 6,
    gems: 2,
    unlockAfter: null,
    color: "gold",
    beats: [
      {
        type: "talk",
        who: "teman",
        text: "Gw kira web3 cuma buat yang modal gede. Gw butuh kerjaan, bukan leverage.",
      },
      {
        type: "talk",
        who: "web3min",
        mood: "proud",
        text: "Ada. Orang jaga Discord. Ada yang nulis docs. Ada intern. Ada yang ngerjain bounty. Ada yang kode. Remote. Kadang dibayar USDC.",
      },
      {
        type: "talk",
        who: "teman",
        text: "Terus ada DM: kerja remote $5.000, transfer 0,05 ETH dulu biar kontrak kebuka.",
      },
      {
        type: "fork",
        prompt: "Kamu?",
        options: [
          {
            label: "Kirim. Takut kesempatan ilang.",
            good: false,
            reply: "Umpan. Kerjaan beneran nggak minta kamu bayar tiket masuk. HR nggak nagi gas.",
          },
          {
            label: "Blokir. Kerjaan nggak nagi transfer dulu.",
            good: true,
            reply: "Betul. Jejak waras: kontribusi, bounty, hackathon, portofolio. Kelihatan kerjanya, baru ditawarin.",
          },
        ],
      },
      {
        type: "end",
        text: "Skill nulis, desain, kode, jaga orang, baca rantai — itu tiket. Chart boleh. Gaji juga pintu.",
        remember: "Kerja yang beneran nggak minta kamu transfer dulu.",
      },
    ],
  },
  {
    id: "s-eth",
    title: "Umur Ethereum",
    blurb: "2015 Frontier. 2016 belah. 2022 ganti mesin.",
    minutes: 4,
    xp: 6,
    gems: 2,
    unlockAfter: null,
    color: "purple",
    beats: [
      {
        type: "talk",
        who: "teman",
        text: "ETH koin baru, kan? Kemarin muncul, besok mungkin ilang. Kayak meme.",
      },
      {
        type: "talk",
        who: "web3min",
        mood: "think",
        text: "Vitalik nulis gagasannya 2013. Jaringan Frontier hidup 30 Juli 2015. Lebih dari 10 tahun. Bukan token grup semalam.",
      },
      {
        type: "talk",
        who: "web3min",
        mood: "sad",
        text: "2016 The DAO di-hack puluhan juta. Komunitas belah. Yang rollback: Ethereum yang kamu kenal. Yang nolak: Ethereum Classic.",
      },
      {
        type: "fork",
        prompt: "Teman bilang Merge 2022 'nghapus ETH, ganti koin baru'. Kamu?",
        options: [
          {
            label: "Iya, harus jual semua.",
            good: false,
            reply: "Salah. Merge ganti mesin jaga jaringan: dari ditambang ke staking. Koinnnya tetep ETH.",
          },
          {
            label: "Bukan. Ganti mesin, koin yang sama.",
            good: true,
            reply: "PoW ke PoS. Listrik anjlok. Mining ETH selesai. ETH tetep ETH.",
          },
        ],
      },
      {
        type: "end",
        text: "2017 ICO. 2020 DeFi. 2021 NFT. 2022 Merge. Banyak belokan. Umur panjang ≠ harga aman. Tapi ini bukan koin semalam.",
        remember: "Frontier 2015. DAO fork 2016. Merge 2022. Hafalin belokannya, bukan harganya.",
      },
    ],
  },
  {
    id: "s-liq",
    title: "Agunan disikat semalem",
    blurb: "Health factor < 1. Bot masuk. CS nggak ada.",
    minutes: 4,
    xp: 6,
    gems: 2,
    unlockAfter: null,
    color: "rose",
    beats: [
      {
        type: "talk",
        who: "teman",
        text: "Gw minjem USDC pake agunan ETH. Kemarin hijau. Bangun-bangun ETH-nya ilang sebagian.",
      },
      {
        type: "talk",
        who: "web3min",
        mood: "sad",
        text: "Likuidasi. Kamu max pinjam. Harga jatuh. Health factor tembus di bawah 1. Bot bayar utangmu, nyita agunan plus bonus.",
      },
      {
        type: "proof",
        proofId: "rugi-liqs",
        text: "Peta darah. Bukan cuma DeFi — perps juga. Yang max, disikat dulu.",
      },
      {
        type: "talk",
        who: "teman",
        text: "Bisa komplain nggak? Kayak bank.",
      },
      {
        type: "fork",
        prompt: "Kamu jawab apa?",
        options: [
          {
            label: "Telpon CS protokol, minta ditahan.",
            good: false,
            reply: "Nggak ada CS. Nggak ada 'tunggu gajian'. Kode jalan jam 3 pagi. Bonus likuidasi dari agunanmu.",
          },
          {
            label: "Nggak ada CS. Seharusnya nambah agunan sebelum HF nyenggol 1.",
            good: true,
            reply: "Bantal. LTV jauh di bawah max. Siapin stable buat bayar. Oracle bisa ngejer harga jelek pas crash.",
          },
        ],
      },
      {
        type: "end",
        text: "Overcollateral itu syarat. Health factor itu alarm. Bot itu pemadam yang kamu bayar pake agunan. Max LTV = tiket ke mereka.",
        remember: "HF jauh di atas 1, atau jangan minjem. Nggak ada teller yang nahan.",
      },
    ],
  },
  {
    id: "s-flash",
    title: "Minjem 5 juta, lunas sedetik",
    blurb: "Flash loan. Tanpa agunan. Wajib balik sebelum transaksi selesai.",
    minutes: 5,
    xp: 6,
    gems: 2,
    unlockAfter: null,
    color: "teal",
    beats: [
      {
        type: "talk",
        who: "teman",
        text: "Orang di X pinjam 5 juta dolar tanpa agunan. Nol jaminan. Itu sulap atau bank bodong?",
      },
      {
        type: "talk",
        who: "web3min",
        mood: "wave",
        text: "Flash loan. Pinjam, kerjain sesuatu, kembalikan plus fee. Semua di satu transaksi. Kalau nggak balik, transaksi batal. Pool nggak rugi. Makanya tanpa agunan.",
      },
      {
        type: "talk",
        who: "teman",
        text: "Trus bedanya sama bank yang nyita rumah, atau bursa yang nyita margin?",
      },
      {
        type: "fork",
        prompt: "Intinya?",
        options: [
          {
            label: "Sama aja. Semua ngejar orang pake hukum.",
            good: false,
            reply: "Bank ngejar KTP, berbulan-bulan. Bursa nyita dari buku mereka. DeFi ngejar agunan. Flash loan bikin yang nyita nggak perlu kaya dulu.",
          },
          {
            label: "Bank ngejar orang. DeFi ngejar agunan. Flash loan: bot tanpa modal.",
            good: true,
            reply: "Pas. Hukum vs kode. Minggu vs detik. Liquidator kecil bisa nyita posisi gede, asal cuannya nutup fee.",
          },
        ],
      },
      {
        type: "talk",
        who: "web3min",
        mood: "think",
        text: "Warasnya: arbitrase, ganti agunan, likuidasi. Jahatnya: geser harga pool tipis, tipu oracle, sikat protokol, balikin harga, lunasin. Udah sering.",
      },
      {
        type: "end",
        text: "Flash loan bukan hadiah 5 juta. Utang yang wajib lunas sebelum blok selesai. Kamu yang max LTV: bot ini yang ngejar, bukan teller yang bisa diajak ngobrol.",
        remember: "Lunas di transaksi yang sama, atau seolah nggak terjadi. Bank ngejar orang. Flash loan ngejar agunan.",
      },
    ],
  },
  {
    id: "s-oracle",
    title: "Harga palsu sedetik",
    blurb: "Oracle ditipu. Protokol kira aman. Brankas kosong.",
    minutes: 5,
    xp: 6,
    gems: 2,
    unlockAfter: null,
    color: "rose",
    beats: [
      {
        type: "talk",
        who: "teman",
        text: "Protokol pinjem ini LTV 90% di token baru. Oracle-nya Uniswap pool. APY rame. Gas?",
      },
      {
        type: "talk",
        who: "web3min",
        mood: "sad",
        text: "Itu mulut harga yang bisa dibeli. Pool tipis. Flash loan geser harga, protokol kira token mahal, USDC-nya dipinjem max, harga dibalikin. Kodenya 'bener'. Yang salah: percaya harga sedetik.",
      },
      {
        type: "fork",
        prompt: "Masih mau titip?",
        options: [
          {
            label: "Gas. LTV tinggi = efisien.",
            good: false,
            reply: "LTV gila di koin sepi = undangan. Harvest, bZx, yang lain: pola yang sama.",
          },
          {
            label: "Nggak. Harga harus susah dibeli. Chainlink, cap, pool dalam.",
            good: true,
            reply: "Nah. Oracle aggregator, LTV rendah, likuiditas jauh di atas yang bisa dipinjam. Kalau nggak, kamu likuiditasnya penyerang.",
          },
        ],
      },
      {
        type: "end",
        text: "Arb nyamain harga dua tempat yang sah. Oracle attack bikin satu protokol percaya harga yang cuma hidup sedetik. Jangan ketuker.",
        remember: "Oracle murah = brankas terbuka. Jangan jadi likuiditasnya penyerang.",
      },
    ],
  },
  {
    id: "s-arb",
    title: "Selisih 12 dolar, bot yang makan",
    blurb: "Arb rapihin harga. Sandwich ngerampok tx kamu.",
    minutes: 4,
    xp: 6,
    gems: 2,
    unlockAfter: null,
    color: "teal",
    beats: [
      {
        type: "talk",
        who: "teman",
        text: "Gw swap ETH gede di Uni. Keisi lebih mahal dari Binance. Bot cuan. Mereka ngerampok gw?",
      },
      {
        type: "talk",
        who: "web3min",
        mood: "think",
        text: "Dua kemungkinan. Kamu dorong harga pool sendirian: slippage. Bot backrun, nyamain ke CEX. Itu arb — kamu yang ciptain selisihnya. Atau bot sandwich: beli dulu, kamu mahal, mereka jual. Itu pajak antrian.",
      },
      {
        type: "fork",
        prompt: "Lain kali?",
        options: [
          {
            label: "Slippage 15%, pool sepi, sekali pencet.",
            good: false,
            reply: "Undangan sandwich. Pool sepi + order gede = makanan bot.",
          },
          {
            label: "Pecah order, slippage ketat, jauhi pool sepi.",
            good: true,
            reply: "Arb tetap ada — itu yang bikin AMM nggak nyasar. Sandwich yang harus kamu sempitin.",
          },
        ],
      },
      {
        type: "end",
        text: "Arb: tukang rapih. Sandwich: pajak tx kamu. Oracle attack: sikat protokol. Tiga bot, jangan dikira satu.",
        remember: "Arb nyamain. Sandwich ngerampok tx. Oracle attack ngerampok brankas.",
      },
    ],
  },
  {
    id: "s-poison",
    title: "Ujungnya sama, tengahnya copet",
    blurb: "Address poisoning. Copas dari history = umpan.",
    minutes: 3,
    xp: 6,
    gems: 2,
    unlockAfter: null,
    color: "rose",
    beats: [
      {
        type: "talk",
        who: "teman",
        text: "Ada yang kirim 0,0001 ke gw. Alamatnya mirip temen gw. Gw copas dari history, kirim sisa gaji.",
      },
      {
        type: "talk",
        who: "web3min",
        mood: "sad",
        text: "Poisoning. Mereka nyontek ujung alamat. Tengahnya punya mereka. History bukan buku alamat.",
      },
      {
        type: "proof",
        proofId: "warn-scam-arc",
        text: "Pola copet on-chain itu industri. Bukan satu orang iseng. Cek ujung-pangkal, jangan copas history aneh.",
      },
      {
        type: "fork",
        prompt: "Lain kali?",
        options: [
          { label: "Copas dari tx masuk yang aneh. Cepet.", good: false, reply: "Itu umpannya." },
          { label: "Buku alamat. Cek 6 karakter awal dan akhir.", good: true, reply: "Plus cek lagi setelah paste. Clipboard bisa ditukar malware." },
        ],
      },
      {
        type: "end",
        text: "Tx sukses. Duit di mereka. Explorer hijau bukan 'sampe ke temen'.",
        remember: "Jangan copas penerima dari tx masuk aneh. Cek ujung-pangkal.",
      },
    ],
  },
  {
    id: "s-permit",
    title: "Nol ETH, USDC raib",
    blurb: "Drainer permit. Bukan seed. Cukup tanda tangan.",
    minutes: 4,
    xp: 6,
    gems: 2,
    unlockAfter: null,
    color: "purple",
    beats: [
      {
        type: "talk",
        who: "teman",
        text: "Klaim airdrop. Wallet nulis 0 ETH. Gw sign. ETH aman. USDC nol.",
      },
      {
        type: "talk",
        who: "web3min",
        mood: "think",
        text: "Permit. Izin tarik token, off-chain. Drainer nggak butuh 12 kata di langkah itu. Kamu buka pintu.",
      },
      {
        type: "proof",
        proofId: "scam-drainer",
        text: "Kit drainer dijual. Industri. Bukan iseng. Permit = kunci cadangan.",
      },
      {
        type: "fork",
        prompt: "Sekarang?",
        options: [
          { label: "DM 'helper' minta seed biar di-refund.", good: false, reply: "Gelombang dua. Jangan." },
          { label: "Cabut izin. Pindahin sisa. Jangan kasih seed.", good: true, reply: "Revoke. Wallet baru kalo kuncinya dicurigai. Helper di DM bukan polisi." },
        ],
      },
      {
        type: "end",
        text: "Hijau 0 ETH bukan restu. Baca spend, unlimited, setApprovalForAll.",
        remember: "Seed nyawa. Permit kunci cadangan. Cabut yang nggak kepake.",
      },
    ],
  },
  {
    id: "s-il",
    title: "Fee 12 dolar, kalah vs hold",
    blurb: "AMM. Kamu jadi pasar. IL nyata.",
    minutes: 3,
    xp: 6,
    gems: 2,
    unlockAfter: null,
    color: "gold",
    beats: [
      {
        type: "talk",
        who: "teman",
        text: "Gw LP ETH/USDC. Fee masuk. Tapi kalo hold ETH doang, gw lebih kaya. Ditipu pool?",
      },
      {
        type: "talk",
        who: "web3min",
        mood: "wave",
        text: "Impermanent loss. Pool jual ETH-mu ke yang beli pas naik. Kamu dapet fee, kehilangan upside. Bukan bug. Rumus.",
      },
      {
        type: "proof",
        proofId: "rugi-paper",
        text: "Hijau di kertas, belum di tangan. LP juga gitu: fee kelihatan, IL nunggu di belakang.",
      },
      {
        type: "fork",
        prompt: "Pair meme 2000% APY?",
        options: [
          { label: "Gas. Fee nutup semua.", good: false, reply: "Fee kecil. IL + rug gede. Pair liar bukan tabungan." },
          { label: "Pair ramai, paham IL, jangan max hidup.", good: true, reply: "Fee nyata. IL nyata. Banner 2000% umpan." },
        ],
      },
      {
        type: "end",
        text: "Kamu bukan deposito. Kamu jadi pasar. Harga cabut, rumus ngegeser porsi kamu.",
        remember: "AMM = rumus. IL = kalah vs hold. Fee belum tentu nutup.",
      },
    ],
  },
  {
    id: "s-dm",
    title: "DM jam 2 pagi",
    blurb: "Wallet 'kena suspend'. Mereka minta 12 kata.",
    minutes: 4,
    xp: 6,
    gems: 2,
    unlockAfter: null,
    color: "rose",
    beats: [
      {
        type: "talk",
        who: "web3min",
        mood: "wave",
        text: "Jam 2.14. HP bergetar. Bukan gebetan. Ini pola.",
      },
      {
        type: "talk",
        who: "penipu",
        text: "Hi, aku support. Wallet kamu kena suspend. Verifikasi seed phrase sekarang atau aset dikunci.",
      },
      {
        type: "talk",
        who: "web3min",
        mood: "think",
        text: "CS bursa nggak pernah DM duluan. Apalagi minta 12 kata. Yang pegang seed, itu yang pegang duit kamu.",
      },
      {
        type: "proof",
        proofId: "warn-never-dm",
        text: "Cuplikan dari X. Pola yang sama: ngaku CS, buru-buru, minta seed. Tiga-tiganya bohong.",
      },
      {
        type: "fork",
        prompt: "Kamu ngapain?",
        options: [
          {
            label: "Ketik 12 katanya, biar cepat",
            good: false,
            reply: "Wallet itu anggap mati. Penipu udah salin seed. Pindah sisa aset ke wallet baru — kalau masih sempat.",
          },
          {
            label: "Block. Cek di situs resmi, bukan dari chat",
            good: true,
            reply: "Betul. Buka bursa dari bookmark kamu sendiri. Kalau emang ada masalah, kamu yang chat mereka — bukan sebaliknya.",
          },
          {
            label: "Kirim ke grup, tanya temen",
            good: true,
            reply: "Boleh, asal jangan tempel seed-nya. Cukup: 'ada yang ngaku CS minta seed, ini scam kan?'",
          },
        ],
      },
      {
        type: "talk",
        who: "web3min",
        mood: "proud",
        text: "Buru-buru palsu itu umpan. Orang panik ngetik. Orang waras nutup chat.",
      },
      {
        type: "end",
        text: "Nggak ada CS yang minta seed. Nggak malam ini, nggak nanti.",
        remember: "DM + seed + 'sekarang juga' = tutup. Selalu.",
      },
    ],
  },
  {
    id: "s-seed",
    title: "12 kata di kafe",
    blurb: "Foto struk, foto seed. Satu galeri, dua bahaya.",
    minutes: 4,
    xp: 6,
    gems: 2,
    unlockAfter: "u2-l2",
    color: "gold",
    beats: [
      {
        type: "talk",
        who: "teman",
        text: "Gw foto seed di Notes biar gampang. Laptop rusak kemarin, untung ada cadangan.",
      },
      {
        type: "talk",
        who: "web3min",
        mood: "sad",
        text: "Cadangan di HP? Itu bukan cadangan, itu undangan. Malware galeri bisa baca 12 kata dari foto.",
      },
      {
        type: "proof",
        proofId: "warn-sparkkitty",
        text: "SparkKitty dan kawan-kawannya: app palsu, izin galeri, OCR seed. Bukan dongeng grup.",
      },
      {
        type: "fork",
        prompt: "Temenmu masih mau simpan di Notes. Kamu bilang apa?",
        options: [
          {
            label: "Boleh, yang penting ada password Notes",
            good: false,
            reply: "Password Notes nggak nahan malware yang udah masuk galeri. Seed harus offline: kertas, plat, brankas.",
          },
          {
            label: "Hapus. Tulis di kertas, simpan bukan di HP",
            good: true,
            reply: "Itu. Foto seed di HP = seed di internet. Cuma nunggu app yang salah.",
          },
        ],
      },
      {
        type: "proof",
        proofId: "warn-seed-rules",
        text: "Tulis. Jangan screenshot. Jangan cloud. Jangan DM ke diri sendiri.",
      },
      {
        type: "end",
        text: "Wallet cuma pintu. Seed-nya raja. Raja jangan dipajang di kamera.",
        remember: "Seed = kertas / plat. Bukan galeri, bukan Notes, bukan chat.",
      },
    ],
  },
  {
    id: "s-airdrop",
    title: "Token gratis",
    blurb: "Klik link, sign, hadiah. Urutannya jebakan.",
    minutes: 3,
    xp: 6,
    gems: 2,
    unlockAfter: "u6-l1",
    color: "purple",
    beats: [
      {
        type: "talk",
        who: "penipu",
        text: "Airdrop 2.400 token. Connect wallet, gas-nya kami yang bayar. 14 menit lagi ditutup.",
      },
      {
        type: "talk",
        who: "web3min",
        mood: "think",
        text: "Hadiah yang ngejar kamu hampir selalu tagihan. Airdrop beneran nggak DM, nggak countdown palsu.",
      },
      {
        type: "proof",
        proofId: "warn-airdrop-honey",
        text: "Kadang tokennya sampai. Terus nggak bisa dijual. Honeypot berbaju hadiah.",
      },
      {
        type: "fork",
        prompt: "Pop-up tanda tangan muncul. Kamu?",
        options: [
          {
            label: "Sign, gas-nya mereka yang bayar",
            good: false,
            reply: "Gas gratis sering berarti mereka yang nulis izinnya. Bisa jadi kamu setuju drain, bukan klaim.",
          },
          {
            label: "Tolak. Cek kontrak di explorer dulu",
            good: true,
            reply: "Betul. Kalau nggak bisa jelasin izin yang kamu kasih, jangan tanda tangan.",
          },
        ],
      },
      {
        type: "end",
        text: "Airdrop waras: kamu yang klaim di situs yang kamu ketik sendiri. Bukan link di DM.",
        remember: "Hadiah ngejar = jangan connect. Klaim dari sumber yang kamu buka sendiri.",
      },
    ],
  },
  {
    id: "s-drop-cuan",
    title: "Modal gas, cair token",
    blurb: "Bukan PnL. Airdrop. Orang pake produk, token nyangkut.",
    minutes: 4,
    xp: 6,
    gems: 2,
    unlockAfter: null,
    color: "purple",
    beats: [
      {
        type: "talk",
        who: "web3min",
        mood: "wave",
        text: "Orang kira web3 cuma chart hijau. Ada jalur lain: pake produk, snapshot, token nyangkut. Modalnya gas.",
      },
      {
        type: "talk",
        who: "teman",
        text: "Gw cuma swap 20 dolar di Uniswap. Taunya 400 UNI. Dijual, lebih dari gaji.",
      },
      {
        type: "proof",
        proofId: "drop-uni-400",
        text: "2020. Tiap wallet yang pernah pake Uniswap, 400 UNI. Bukan sinyal trading. Hadiah karena memakai produk.",
      },
      {
        type: "proof",
        proofId: "drop-uni-ath",
        text: "Di puncak, 400 UNI sempat ~$18 ribu. Satu-dua swap. Modal gas. Bukan all-in futures.",
      },
      {
        type: "proof",
        proofId: "drop-arb-18k",
        text: "2.125 ARB, $18 ribu di wallet. Pake L2. Bukan all-in chart.",
      },
      {
        type: "proof",
        proofId: "drop-wif-1k5",
        text: "1.000 WIF nyangkut $1.500. Modal nol. Bukan sinyal, bukan leverage.",
      },
      {
        type: "proof",
        proofId: "drop-met-34k",
        text: "Ada yang cair $34 ribu dari airdrop. Dijual. Bukan PnL futures.",
      },
      {
        type: "fork",
        prompt: "Teman suruh 'kirim dulu 0,05 ETH biar klaim HYPE kebuka'. Kamu?",
        options: [
          {
            label: "Kirim, takut ketinggalan",
            good: false,
            reply: "Itu umpan. Airdrop resmi nggak minta transfer dulu. Domain palsu tinggal 1 huruf.",
          },
          {
            label: "Tolak. Klaim di situs yang aku ketik sendiri",
            good: true,
            reply: "Betul. Bookmark. Tanda tangan pesan, bukan permit USDC.",
          },
        ],
      },
      {
        type: "end",
        text: "Airdrop itu lotre kerja. Kadang gede. Kadang nol. Yang pasti: nggak pernah minta kamu bayar dulu.",
        remember: "Pake produk beneran. Klaim di situs yang kamu ketik. Jangan utang buat farm.",
      },
    ],
  },
  {
    id: "s-copy",
    title: "Teman cuan 20 miliar",
    blurb: "Screenshot hijau. Grup 'sinyal'. Kamu diajak masuk.",
    minutes: 4,
    xp: 6,
    gems: 2,
    unlockAfter: "u7-l1",
    color: "teal",
    beats: [
      {
        type: "talk",
        who: "teman",
        text: "4 bulan, Rp20 miliar. Gw kirim screenshot. Join grup sinyal, copy aja.",
      },
      {
        type: "talk",
        who: "web3min",
        mood: "think",
        text: "Cuan itu nyata. Ada orang yang tembus. Tapi itu bukan undangan buat kamu nyalin entry-nya.",
      },
      {
        type: "proof",
        proofId: "cuan-20m",
        text: "Ini cuplikan yang sama. Angkanya gede. Yang nggak kelihatan: modal, risiko, yang hangus di jalur yang sama.",
      },
      {
        type: "proof",
        proofId: "rugi-33m",
        text: "Satu short, −$33 juta. Sisi lain dari layar hijau. Dua-duanya dari X, bukan dongeng.",
      },
      {
        type: "fork",
        prompt: "Grup sinyal minta 2 juta 'biaya mentor'. Kamu?",
        options: [
          {
            label: "Bayar. Yang Rp20 M itu bukti",
            good: false,
            reply: "Orang lain cuan bukan berarti sinyal mereka valid. Mentor bayar di muka? Hampir selalu toko harapan.",
          },
          {
            label: "Tolak. Belajar sendiri, jangan beli entry",
            good: true,
            reply: "Itu peta yang aku kerjain. Kamu yang nyetir. Screenshot orang lain bukan setir kamu.",
          },
        ],
      },
      {
        type: "end",
        text: "Jual mimpi itu gampang. Jual peta itu kerjaan aku. Kamu yang pilih jalan.",
        remember: "PnL orang lain = fakta mereka, bukan sinyal kamu. Jangan bayar entry.",
      },
    ],
  },
  {
    id: "s-honey",
    title: "Hijau, tombol mati",
    blurb: "+605% di layar. Jual? Nggak bisa.",
    minutes: 3,
    xp: 6,
    gems: 2,
    unlockAfter: "u9-l1",
    color: "gold",
    beats: [
      {
        type: "talk",
        who: "kamu",
        text: "Chart-nya gila. Beli $10, sekarang $200. Gw jual dikit dulu.",
      },
      {
        type: "talk",
        who: "web3min",
        mood: "sad",
        text: "Tombol jual muter terus. Bukan lag. Itu honeypot: beli boleh, jual nggak.",
      },
      {
        type: "proof",
        proofId: "warn-honeypot",
        text: "+605% kertas. Semua hijau. Nggak ada yang keluar. Ini yang kelihatan di X tiap minggu.",
      },
      {
        type: "fork",
        prompt: "Sebelum beli token random, kamu cek apa?",
        options: [
          {
            label: "Market cap sama nama di Telegram",
            good: false,
            reply: "Nama bisa ditiru. Yang dicek: bisa dijual nggak, pajak berapa, likuiditas dikunci siapa.",
          },
          {
            label: "Bisa sell nggak, pajak, siapa yang pegang LP",
            good: true,
            reply: "Itu DYOR yang berguna. Kalau simulasi jual gagal di tes kecil, jangan naikin modal.",
          },
        ],
      },
      {
        type: "end",
        text: "Hijau di layar bukan uang. Uang itu yang berhasil kamu tarik.",
        remember: "Tes jual dulu pakai pecahan. Kalau macet, anggap hangus — jangan nambah.",
      },
    ],
  },
  {
    id: "s-cs",
    title: "Situs hampir sama",
    blurb: "Satu huruf beda. Form seed. Kamu hampir isi.",
    minutes: 3,
    xp: 6,
    gems: 2,
    unlockAfter: "u6-l2",
    color: "sky",
    beats: [
      {
        type: "talk",
        who: "cs",
        text: "Kak, Binance security alert. Mohon login ulang di tautan ini segera. 10 menit atau akun Anda dibekukan.",
      },
      {
        type: "talk",
        who: "web3min",
        mood: "think",
        text: "Domain-nya binancce, dua c. Jari panik nggak baca. Itu desainnya.",
      },
      {
        type: "proof",
        proofId: "warn-phishing",
        text: "Pas bursa 'tutup' atau 'maintenance', phishing meledak. Umpan pakai berita.",
      },
      {
        type: "proof",
        proofId: "warn-official",
        text: "Cek domain. Ketik sendiri. Bookmark. Jangan dari chat, jangan dari iklan.",
      },
      {
        type: "fork",
        prompt: "Form udah terbuka, kolom seed kosong. Kamu?",
        options: [
          {
            label: "Isi, takut akun dibekukan",
            good: false,
            reply: "Bursa nggak minta seed di form web. Yang minta seed = pencuri. Akun kamu nggak dibekukan. Dompet kamu yang hampir.",
          },
          {
            label: "Tutup. Buka dari bookmark",
            good: true,
            reply: "Itu. Ketik alamat sendiri, atau jangan buka. Refleks, bukan pikiran.",
          },
        ],
      },
      {
        type: "end",
        text: "Huruf ekstra di domain lebih mahal dari gas fee seumur hidup.",
        remember: "Jangan isi seed di situs. Bursa nggak minta. Wallet nggak minta. Nggak ada yang minta.",
      },
    ],
  },
  {
    id: "s-izin",
    title: "Tanda tangan diam-diam",
    blurb: "Simulasi aman. Transaksi asli nguras.",
    minutes: 4,
    xp: 6,
    gems: 2,
    unlockAfter: "u18-l1",
    color: "rose",
    beats: [
      {
        type: "talk",
        who: "kamu",
        text: "Wallet-nya nampilin 'simulasi sukses, kamu terima 2.400 token'. Kelihatan aman.",
      },
      {
        type: "talk",
        who: "web3min",
        mood: "sad",
        text: "Simulasi bisa dibohongi kok. Preview hijau, di belakang ada setApprovalForAll atau transferFrom.",
      },
      {
        type: "proof",
        proofId: "warn-redpill",
        text: "Pola red pill: layar bilang aman, kontrak nguras. Jangan percaya preview doang.",
      },
      {
        type: "proof",
        proofId: "scam-drainer",
        text: "Kit drainer dijual $210. 610+ wallet. Ini industri, bukan iseng anak kemarin sore.",
      },
      {
        type: "fork",
        prompt: "Izin unlimited ke kontrak yang baru kamu kenal. Kamu?",
        options: [
          {
            label: "Approve unlimited, biar nggak sign berkali-kali",
            good: false,
            reply: "Unlimited = mereka boleh sedot kapan aja, bukan cuma sekali. Radiant dan yang lain udah contohnya.",
          },
          {
            label: "Tolak. Approve pas-pasan, atau jangan",
            good: true,
            reply: "Pas-pasan. Habis pakai, revoke. Kontrak random nggak perlu kunci rumah kamu.",
          },
        ],
      },
      {
        type: "proof",
        proofId: "warn-revoke",
        text: "revoke.cash dan yang sejenis. Cabut izin setelah main di situs degen. Ini PR, bukan opsional.",
      },
      {
        type: "end",
        text: "Tanda tangan itu bukan 'OK'. Itu kunci. Baca yang kamu kasih, atau jangan kasih.",
        remember: "Jangan approve unlimited. Cabut izin setelah selesai. Simulasi bukan jaminan.",
      },
    ],
  },
  {
    id: "s-cukup",
    title: "Udah cukup",
    blurb: "Hijau di layar. Belum keluar. Greed nungguin.",
    minutes: 3,
    xp: 6,
    gems: 2,
    unlockAfter: "u13-l1",
    color: "teal",
    beats: [
      {
        type: "talk",
        who: "teman",
        text: "Masih naik. Jangan dijual. Nanti 10x. FOMO kalah sama yang hold.",
      },
      {
        type: "talk",
        who: "web3min",
        mood: "think",
        text: "Hijau di layar itu kertas. Yang di rekening itu yang udah kamu tarik. Dua angka beda.",
      },
      {
        type: "proof",
        proofId: "rugi-paper",
        text: "Masih kertas. Orang pamer hijau, belum keluar. Besok bisa 0, postingan tetap ada.",
      },
      {
        type: "proof",
        proofId: "fumble-193m",
        text: "Ada yang jual 2 menit keburu, ketinggalan $193 juta. Ada juga yang nggak jual, balik ke 0. Dua-duanya luka.",
      },
      {
        type: "fork",
        prompt: "Target awal kamu udah kena. Kamu?",
        options: [
          {
            label: "Tahan semua, naikin target",
            good: false,
            reply: "Naikin target tanpa aturan = greed yang nyetir. Ambil sebagian. Sisanya boleh main.",
          },
          {
            label: "Tarik modal awal. Sisanya biar kerja",
            good: true,
            reply: "Itu kepala dingin. Kalah nggak bikin kamu utang. Menang nggak bikin kamu dewa.",
          },
        ],
      },
      {
        type: "end",
        text: "Aku peta, bukan dukun. Cukup itu keputusan, bukan perasaan.",
        remember: "Hijau kertas ≠ cuan. Tarik sesuai aturan kamu, bukan sesuai grup.",
      },
    ],
  },
];

export const CASES: CaseStudy[] = [
  {
    id: "b-seed",
    title: "Layar 12 kata",
    blurb: "Ini bukan chart. Ini kunci rumah.",
    proofId: "warn-seed",
    minutes: 2,
    xp: 4,
    gems: 1,
    unlockAfter: null,
    steps: [
      { look: "Semua kata di satu layar.", say: "Itu seed. Siapa yang lihat = siapa yang bisa kosongin wallet, tanpa password tambahan." },
      { look: "Bukan angka hijau, bukan candle.", say: "Orang sering screenshot 'buat cadangan'. Cadangan di HP = umpan malware galeri." },
      { look: "Nggak ada CS, nggak ada tombol recover resmi.", say: "Nggak ada yang boleh minta kamu tempel ini ke web, chat, atau form." },
    ],
    remember: "Seed cuma ditulis di kertas atau plat, offline. Bukan foto.",
  },
  {
    id: "b-dm",
    title: "CS yang DM duluan",
    blurb: "Support nggak pernah chat duluan.",
    proofId: "warn-never-dm",
    minutes: 2,
    xp: 4,
    gems: 1,
    unlockAfter: "u2-l2",
    steps: [
      { look: "Pesan masuk, bukan kamu yang chat.", say: "Pola: mereka yang sapa. CS asli nunggu tiket yang kamu buka." },
      { look: "Minta seed, password, atau remote.", say: "Tiga permintaan itu nggak pernah resmi. Satu aja udah cukup buat tutup." },
      { look: "Ada rasa 'sekarang juga'.", say: "Buru-buru palsu. Panik itu bahan bakar scam." },
    ],
    remember: "Kamu yang chat CS, dari situs yang kamu ketik. Bukan sebaliknya.",
  },
  {
    id: "b-phish",
    title: "Bursa 'tutup'",
    blurb: "Berita dipakai jadi umpan.",
    proofId: "warn-phishing",
    minutes: 2,
    xp: 4,
    gems: 1,
    unlockAfter: "u6-l1",
    steps: [
      { look: "Judulnya kelihatan berita.", say: "Pas bursa ada isu, link palsu meledak. Mereka numpang panik publik." },
      { look: "Link-nya bukan domain yang kamu hafal.", say: "Satu huruf ekstra. Subdomain aneh. Itu cukup." },
      { look: "Form minta isi ulang kunci.", say: "Login ulang dari bookmark. Jangan dari chat, jangan dari timeline." },
    ],
    remember: "Berita panas + link cepat = jangan klik. Ketik sendiri.",
  },
  {
    id: "b-honey",
    title: "Hijau yang macet",
    blurb: "+605% dan nggak ada yang bisa keluar.",
    proofId: "warn-honeypot",
    minutes: 3,
    xp: 4,
    gems: 1,
    unlockAfter: "u9-l1",
    steps: [
      { look: "Angka plus besar.", say: "Kertas. Belum ada yang berhasil jual. Chart nggak peduli kamu bisa cair atau nggak." },
      { look: "Nggak ada volume keluar yang sehat.", say: "Honeypot: beli boleh, jual dikunci. Pajak 100%, blacklist, atau fungsi sell palsu." },
      { look: "Caption orang yang nyangkut.", say: "Tes jual pecahan dulu. Kalau gagal, jangan nambah — anggap pelajaran." },
    ],
    remember: "Bisa beli ≠ bisa jual. Tes keluar sebelum nambah modal.",
  },
  {
    id: "b-drain",
    title: "Kit $210",
    blurb: "Drainer itu produk, bukan ulah iseng.",
    proofId: "scam-drainer",
    minutes: 2,
    xp: 4,
    gems: 1,
    unlockAfter: "u6-l3",
    steps: [
      { look: "Harga kit-nya murah.", say: "$210. 610+ wallet. Ini toko. Ada yang jual, ada yang beli, ada yang jadi korban." },
      { look: "Bukan hacker jenius di film.", say: "Kebanyakan korban klik link, sign izin. Bukan karena kalah matematika." },
      { look: "Skalanya ratusan wallet.", say: "Satu link, banyak korban. Makanya jangan jadi yang ke-611." },
    ],
    remember: "Jangan sign dari link asing. Drainer murah, aset kamu nggak.",
  },
  {
    id: "b-sim",
    title: "Simulasi bohong",
    blurb: "Preview aman, tx asli nguras.",
    proofId: "warn-redpill",
    minutes: 3,
    xp: 4,
    gems: 1,
    unlockAfter: "u18-l1",
    steps: [
      { look: "Layar bilang kamu terima token.", say: "Simulasi bisa dibohongi. Jangan percaya ringkasan cantik di pop-up." },
      { look: "Izin yang diminta di belakang.", say: "setApprovalForAll, transferFrom, incrementAllowance — itu bahasa nguras." },
      { look: "Sumber link-nya.", say: "Situs resmi yang kamu ketik. Kalau ragu, jangan sign. Nggak ada airdrop yang kabur." },
    ],
    remember: "Simulasi bukan auditor. Baca izin, atau jangan tanda tangan.",
  },
  {
    id: "b-cuan",
    title: "Rp20 miliar, 4 bulan",
    blurb: "Nyata. Bukan undangan copy.",
    proofId: "cuan-20m",
    minutes: 3,
    xp: 4,
    gems: 1,
    unlockAfter: "u7-l1",
    steps: [
      { look: "Angka yang gila.", say: "Ada orang yang tembus. Itu fakta dia. Bukan sinyal entry buat kamu." },
      { look: "Yang nggak tertulis: modal, drawdown, yang kalah.", say: "Screenshot menang nggak bawa yang hangus. Dua sisi hidup di unit 7." },
      { look: "Ajakan 'copy saya'.", say: "Kalau ada yang jual sinyal pakai angka ini, yang dijual harapan, bukan peta." },
    ],
    remember: "Cuan orang lain nyata. Copy buta tetap judi. Kamu nyetir.",
  },
  {
    id: "b-drop",
    title: "2.125 ARB, modal gas",
    blurb: "Hadiah, syarat, dan risiko. Bukan PnL chart.",
    proofId: "drop-arb-18k",
    minutes: 3,
    xp: 4,
    gems: 1,
    unlockAfter: null,
    steps: [
      { look: "2.125 ARB, $18 ribu.", say: "Ini bukan trading. Orang pake L2, snapshot, token nyangkut. Modalnya gas." },
      { look: "Nggak ada 'kirim dulu'.", say: "Resmi: connect, tanda tangan pesan, klaim. Yang minta ETH dulu = umpan." },
      { look: "1.000 WIF modal nol. $34 rb dicairin.", say: "Ada yang gede, ada yang kecil. Rata-rata bukan jaminan kamu. Jangan utang buat kejar." },
    ],
    remember: "Airdrop = hadiah pake. Bukan gaji, bukan sinyal. Klaim di situs yang kamu ketik.",
  },
  {
    id: "b-rugi",
    title: "Satu short, −$33 juta",
    blurb: "Sisi lain dari layar hijau.",
    proofId: "rugi-33m",
    minutes: 2,
    xp: 4,
    gems: 1,
    unlockAfter: "u7-l1",
    steps: [
      { look: "Minus yang nggak muat di gaji.", say: "Leverage ngebesarin menang dan kalah. Yang ini kalah sekali, selesai." },
      { look: "Satu posisi, bukan 'salah klik kecil'.", say: "Ukuran posisi itu keputusan. Bukan keberanian." },
      { look: "Ini dipost di X, publik.", say: "Kalau paus bisa hangus segini, kamu nggak kebal karena 'udah riset'." },
    ],
    remember: "Leverage bukan percepatan. Itu pembesar luka. Satu peluru per trade.",
  },
  {
    id: "b-zach",
    title: "Email Trezor palsu",
    blurb: "$1,2 juta. Ketik seed di web.",
    proofId: "warn-zach",
    minutes: 3,
    xp: 4,
    gems: 1,
    unlockAfter: "u18-l1",
    steps: [
      { look: "Pengirim kelihatan merek wallet.", say: "Email bisa dipalsukan. Hardware wallet nggak pernah minta seed di web." },
      { look: "Korbannya bukan pemula buta.", say: "ZachXBT yang dokumentasiin. Orang yang 'udah tau' tetap ketik karena panik firmware." },
      { look: "Nominal $1,2 juta.", say: "Satu form. Satu kali. Nggak ada tombol undo on-chain." },
    ],
    remember: "Firmware update dari perangkat, bukan dari email. Seed nggak pernah diketik di browser.",
  },
  {
    id: "b-paper",
    title: "Hijau belum keluar",
    blurb: "Pamer kertas. Rekening masih biasa.",
    proofId: "rugi-paper",
    minutes: 2,
    xp: 4,
    gems: 1,
    unlockAfter: "u13-l1",
    steps: [
      { look: "PnL hijau di aplikasi.", say: "Itu mark-to-market. Belum di rekening. Spread, pajak, likuiditas bisa makan." },
      { look: "Postingan udah jalan.", say: "Orang pamer dulu, cair belakangan — atau nggak pernah. Timeline nggak refund." },
      { look: "Nggak ada bukti withdraw.", say: "Cuan = yang udah kamu tarik sesuai aturan kamu. Sisanya masih permainan." },
    ],
    remember: "Hijau di layar bukan gaji. Gaji itu yang udah keluar.",
  },
  {
    id: "b-revoke",
    title: "Cabut izin",
    blurb: "PR setelah degen.",
    proofId: "warn-revoke",
    minutes: 2,
    xp: 4,
    gems: 1,
    unlockAfter: "u18-l3",
    steps: [
      { look: "Daftar approval.", say: "Tiap dapp yang kamu sign bisa masih pegang kunci. Nggak hilang sendiri." },
      { look: "Alat revoke.", say: "revoke.cash dan sejenis. Bukan iklan, ini sapu. Pakai yang kamu ketik sendiri." },
      { look: "Setelah situs random.", say: "Habis mint, habis claim, habis iseng — cabut. Jangan nunggu berita hack." },
    ],
    remember: "Izin nggak kadaluarsa sendiri. Cabut. Rutin.",
  },
  {
    id: "b-coinex",
    title: "CEX bobol",
    blurb: "$54,7 juta. 147 ribu alamat. 3 hari.",
    proofId: "warn-coinex",
    minutes: 3,
    xp: 4,
    gems: 1,
    unlockAfter: "u11-l1",
    steps: [
      { look: "Bursa kena. Saldo titipan.", say: "Not your keys. Yang di CEX itu IOU. Pas bobol, antrian tarik." },
      { look: "147 ribu alamat, 70% keambil 3 hari.", say: "Cepat. Bukan 'nanti ganti semua, tenang'. Ada yang keburu ilang." },
      { look: "On-ramp boleh. Tabungan jangan.", say: "Beli di CEX berizin, tarik. Gaji setahun di sana = satu berita, hidup goyang." },
    ],
    remember: "CEX buat masuk-keluar. Bukan brankas. Kunci jangka panjang di kamu.",
  },
  {
    id: "b-dict",
    title: "Seed kena kamus",
    blurb: "$3,5 juta. 1.444 wallet. 12 kata lemah.",
    proofId: "warn-dict",
    minutes: 3,
    xp: 4,
    gems: 1,
    unlockAfter: "u2-l2",
    steps: [
      { look: "Bukan phishing. Brute-force.", say: "Seed yang lemah / di-generate asal / ketik di komputer bisa di-tebak. 12 kata bukan mantra suci kalo entropinya jelek." },
      { look: "1.444 korban, $3,5 juta.", say: "Skala. Bukan satu orang sial. Pola." },
      { look: "Di mana seed-mu hidup.", say: "Jangan foto, jangan iCloud, jangan notes HP. Baja/kertas, offline. Hardware kalo udah gede." },
    ],
    remember: "Seed dari wallet resmi, ditulis offline. Bukan screenshot. Bukan generator random di web.",
  },
];

const STORY_IDS = new Set(STORIES.map((s) => s.id));
const CASE_IDS = new Set(CASES.map((c) => c.id));

export function getStory(id: string): Story | undefined {
  return STORIES.find((s) => s.id === id);
}

export function getCase(id: string): CaseStudy | undefined {
  return CASES.find((c) => c.id === id);
}

export function knownStoryIds(ids: unknown): string[] {
  if (!Array.isArray(ids)) return [];
  const unique = new Set<string>();
  for (const id of ids) {
    if (typeof id === "string" && STORY_IDS.has(id)) unique.add(id);
  }
  return [...unique];
}

export function knownCaseIds(ids: unknown): string[] {
  if (!Array.isArray(ids)) return [];
  const unique = new Set<string>();
  for (const id of ids) {
    if (typeof id === "string" && CASE_IDS.has(id)) unique.add(id);
  }
  return [...unique];
}

export function isOpen(unlockAfter: string | null, completedLessons: string[]): boolean {
  if (!unlockAfter) return true;
  return completedLessons.includes(unlockAfter);
}

export function unlockProgress(unlockAfter: string | null, completedLessons: string[]) {
  if (!unlockAfter) return { remaining: 0, total: 0, have: 0 };
  const nodes = sequentialNodes();
  const idx = nodes.findIndex((n) => n.id === unlockAfter);
  if (idx < 0) {
    const done = completedLessons.includes(unlockAfter);
    return { remaining: done ? 0 : 1, total: 1, have: done ? 1 : 0 };
  }
  const need = nodes.slice(0, idx + 1);
  const have = need.filter((n) => completedLessons.includes(n.id)).length;
  return { remaining: Math.max(0, need.length - have), total: need.length, have };
}

export function storyMinutes(): number {
  return STORIES.reduce((n, s) => n + s.minutes, 0) + CASES.reduce((n, c) => n + c.minutes, 0);
}

export function caseProof(id: string) {
  return proofsById([id])[0];
}
