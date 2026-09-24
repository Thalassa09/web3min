import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { Mascot } from "@/components/mascot";
import { ArrowRight, Compass, Heart, Signpost, Sparkles, BookOpen, ShieldAlert, Award } from "lucide-react";

export const Route = createFileRoute("/cara")({ component: CaraPage });

const STEPS = [
  {
    num: "01",
    title: "Mulai dari Modul Pertama",
    desc: "Buka halaman peta Pulau Rantai. Tekan tombol modul aktif untuk memulai kuis. Baca rangkuman kilat 3 menit sebelum menjawab.",
    icon: Compass,
    badge: "Langkah Awal",
    badgeColor: "bg-lemon text-choco-900",
  },
  {
    num: "02",
    title: "Jaga Nyawa Petualangan",
    desc: "Setiap salah menjawab kuis, 1 nyawa berkurang. Nyawa pulih berkala secara otomatis, atau kamu bisa isi ulang di Toko.",
    icon: Heart,
    badge: "Aturan Main",
    badgeColor: "bg-rose-100 text-rose-800",
  },
  {
    num: "03",
    title: "Rute Terbuka Berurutan",
    desc: "Node pulau saling terhubung. Selesaikan satu blok untuk membuka blok berikutnya. Bangun fondasimu dari nol tanpa lompat-lompat.",
    icon: Signpost,
    badge: "Progresi",
    badgeColor: "bg-amber-100 text-amber-800",
  },
  {
    num: "04",
    title: "Kumpulkan Koin & Bintang XP",
    desc: "Dapatkan XP dan koin dari setiap latihan, streak harian, dan peti misteri. Gunakan koin untuk outfit Blobi dan tiket undian!",
    icon: Sparkles,
    badge: "Reward",
    badgeColor: "bg-candy-100 text-candy-800",
  },
  {
    num: "05",
    title: "Bedah Kisah & Kasus Nyata",
    desc: "Buka menu Kisah untuk membaca studi kasus hack kripto, peretasan smart contract, dan trik membedakan proyek asli vs bodong.",
    icon: BookOpen,
    badge: "Analisis",
    badgeColor: "bg-sky-100 text-sky-800",
  },
  {
    num: "06",
    title: "Sikat Undian Tiket Mingguan",
    desc: "Tukarkan koinmu dengan tiket undian mingguan untuk memperebutkan artefak NFT langka dan merchandise Web3min.",
    icon: Award,
    badge: "Hadiah NFT",
    badgeColor: "bg-emerald-100 text-emerald-800",
  },
];

function CaraPage() {
  return (
    <AppShell>
      <main className="max-w-3xl mx-auto px-4 py-6 sm:py-8 select-none">
        {/* Hero Banner */}
        <div className="p-6 sm:p-8 rounded-[32px] bg-linear-to-b from-[#FFF5F8] to-[#FED7E2] border-4 border-choco-900 shadow-[0_8px_0_#3B2218] flex flex-col sm:flex-row items-center sm:items-start justify-between gap-5 text-center sm:text-left">
          <div className="flex-1">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-candy-500 border-2 border-choco-900 text-white font-pixel text-[10px] font-bold shadow-[0_2px_0_#3B2218] mb-2.5">
              🎮 BUKU PANDUAN ARCADE
            </span>
            <h1 className="font-display font-black text-2xl sm:text-3xl text-choco-900 tracking-tight leading-tight">
              Cara Main & Belajar di Web3min
            </h1>
            <p className="text-xs sm:text-sm font-semibold text-choco-700 mt-2 leading-relaxed max-w-lg">
              100% simulasi edukatif tanpa modal, tanpa deposit, tanpa trading, dan tanpa perlu menghubungkan dompet kripto aslimu.
            </p>
          </div>
          <div className="shrink-0 size-20 sm:size-24 flex items-center justify-center">
            <Mascot mood="think" size={80} float interactive />
          </div>
        </div>

        {/* Steps Grid */}
        <div className="mt-8 space-y-4">
          <div className="flex items-center justify-between px-1">
            <h2 className="font-pixel text-xs sm:text-sm font-bold text-choco-900 uppercase tracking-wider">
              Enam Prinsip Petualangan
            </h2>
            <span className="font-pixel text-[10px] text-choco-600 bg-amber-100 border border-choco-900 px-2 py-0.5 rounded-full">
              6 Langkah Santai
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {STEPS.map((s) => (
              <div
                key={s.num}
                className="p-5 rounded-2xl bg-white border-3 border-choco-900 shadow-[0_4px_0_#3B2218] hover:translate-y-[-2px] hover:shadow-[0_6px_0_#3B2218] transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="size-9 rounded-xl bg-candy-100 border-2 border-choco-900 flex items-center justify-center font-pixel font-bold text-xs text-choco-900 shadow-[0_2px_0_#3B2218]">
                      {s.num}
                    </span>
                    <span className={`px-2.5 py-0.5 rounded-full font-pixel text-[9px] font-bold border border-choco-900 ${s.badgeColor}`}>
                      {s.badge}
                    </span>
                  </div>
                  <h3 className="font-pixel text-xs sm:text-sm font-bold text-choco-900 leading-tight">
                    {s.title}
                  </h3>
                  <p className="text-xs font-semibold text-choco-700 mt-1.5 leading-relaxed">
                    {s.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Safety Callout */}
        <div className="mt-8 p-5 sm:p-6 rounded-2xl bg-amber-200 border-3 border-choco-900 shadow-[0_5px_0_#3B2218] flex items-start gap-4 text-choco-900">
          <div className="size-11 rounded-2xl bg-choco-900 text-amber-300 flex items-center justify-center shrink-0 shadow-[0_2px_0_#3B2218]">
            <ShieldAlert className="size-6" />
          </div>
          <div>
            <span className="font-pixel text-[9px] uppercase font-bold text-choco-800 bg-amber-300 px-2 py-0.5 rounded-full border border-choco-900">
              Peringatan Keamanan Mutlak
            </span>
            <h4 className="font-pixel text-xs sm:text-sm font-bold text-choco-900 mt-1">
              web3min Tidak Pernah Meminta Seed Phrase!
            </h4>
            <p className="text-xs font-semibold text-choco-800 mt-1 leading-relaxed">
              web3min adalah platform edukasi sandbox. Jangan pernah membocorkan seed phrase, private key, atau kata sandi dompet kripto aslimu kepada siapa pun di internet.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row gap-3">
          <Link
            to="/"
            className="flex-1 py-4 px-6 rounded-2xl bg-candy-500 hover:bg-candy-600 text-white font-pixel font-bold text-xs sm:text-sm border-3 border-choco-900 shadow-[0_4px_0_#3B2218] active:translate-y-1 active:shadow-[0_1px_0_#3B2218] cursor-pointer flex items-center justify-center gap-2 transition-all text-center"
          >
            <span>Mulai Petualangan Pulau Rantai</span>
            <ArrowRight className="size-4" />
          </Link>
          <Link
            to="/about"
            className="py-4 px-6 rounded-2xl bg-white hover:bg-cream-100 text-choco-900 font-pixel font-bold text-xs sm:text-sm border-2 border-choco-900 shadow-[0_3px_0_#3B2218] active:translate-y-0.5 cursor-pointer text-center"
          >
            Tentang Web3min
          </Link>
        </div>
      </main>
    </AppShell>
  );
}
