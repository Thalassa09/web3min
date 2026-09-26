import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { Shield, Lock, EyeOff, Trash2, ArrowLeft, Database, CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/privacy")({ component: PrivacyPage });

function PrivacyPage() {
  return (
    <AppShell>
      <main className="max-w-3xl mx-auto px-4 py-6 sm:py-8 select-none">
        {/* Header Hero Banner */}
        <div className="p-6 sm:p-8 rounded-[32px] bg-linear-to-b from-[#FFF6EE] via-[#FFE3EC] to-[#FFD6E6] border-4 border-choco-900 shadow-[0_8px_0_#3B2218] text-choco-900">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 rounded-full bg-candy-800 border-2 border-choco-900 text-white font-pixel text-[10px] font-bold shadow-[0_2px_0_#3B2218]">
              PRIVASI & KEAMANAN DATA
            </span>
          </div>
          <h1 className="font-display font-black text-2xl sm:text-3xl text-choco-900 tracking-tight leading-tight">
            Kebijakan Privasi Web3min
          </h1>
          <p className="text-xs sm:text-sm font-semibold text-choco-700 mt-2 leading-relaxed max-w-xl">
            Kami memegang prinsip privasi terdesentralisasi: data belajarmu adalah milikmu. Nol pelacakan pihak ketiga, nol pengumpulan seed phrase.
          </p>
        </div>

        {/* Bento Privacy Cards */}
        <div className="mt-8 space-y-4">
          {/* Card 1: Zero Wallet Risk */}
          <div className="p-5 sm:p-6 rounded-2xl bg-white border-3 border-choco-900 shadow-[0_4px_0_#3B2218]">
            <div className="flex items-start gap-4">
              <div className="size-11 rounded-2xl bg-emerald-100 border-2 border-choco-900 flex items-center justify-center shrink-0 shadow-[0_2px_0_#3B2218]">
                <Lock className="size-6 text-emerald-800" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-pixel text-xs sm:text-sm font-bold text-choco-900">
                    Nol Akses Seed Phrase & Private Key
                  </h3>
                  <span className="px-2.5 py-0.5 rounded-full font-pixel text-[9px] font-bold bg-emerald-200 text-emerald-900 border border-choco-900">
                    Mutlak
                  </span>
                </div>
                <p className="text-xs font-semibold text-choco-700 mt-1.5 leading-relaxed">
                  Web3min tidak pernah dan tidak akan pernah meminta seed phrase, private key, atau kata sandi dompet kripto pribadimu. Kamu tidak perlu menghubungkan dompet untuk belajar. Alamat wallet hanya diminta jika kamu ikut undian slot mint.
                </p>
              </div>
            </div>
          </div>

          {/* Card 2: Local Storage & Supabase Sync */}
          <div className="p-5 sm:p-6 rounded-2xl bg-white border-3 border-choco-900 shadow-[0_4px_0_#3B2218]">
            <div className="flex items-start gap-4">
              <div className="size-11 rounded-2xl bg-amber-100 border-2 border-choco-900 flex items-center justify-center shrink-0 shadow-[0_2px_0_#3B2218]">
                <Database className="size-6 text-amber-800" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-pixel text-xs sm:text-sm font-bold text-choco-900">
                    Penyimpanan Progres & Anonimitas
                  </h3>
                  <span className="px-2.5 py-0.5 rounded-full font-pixel text-[9px] font-bold bg-amber-200 text-amber-900 border border-choco-900">
                    Transparan
                  </span>
                </div>
                <p className="text-xs font-semibold text-choco-700 mt-1.5 leading-relaxed">
                  Progres XP, nyawa, streak, dan koleksi outfit tersimpan di penyimpanan lokal browser (localStorage) dan disinkronkan ke Supabase hanya dengan username samaran yang kamu pilih. Tidak ada email pribadi atau nomor telepon yang diminta.
                </p>
              </div>
            </div>
          </div>

          {/* Card 3: No Ads & Tracking */}
          <div className="p-5 sm:p-6 rounded-2xl bg-white border-3 border-choco-900 shadow-[0_4px_0_#3B2218]">
            <div className="flex items-start gap-4">
              <div className="size-11 rounded-2xl bg-candy-100 border-2 border-choco-900 flex items-center justify-center shrink-0 shadow-[0_2px_0_#3B2218]">
                <EyeOff className="size-6 text-candy-800" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-pixel text-xs sm:text-sm font-bold text-choco-900">
                    Tanpa Iklan & Pelacak Pihak Ketiga
                  </h3>
                  <span className="px-2.5 py-0.5 rounded-full font-pixel text-[9px] font-bold bg-candy-200 text-candy-900 border border-choco-900">
                    Bersih
                  </span>
                </div>
                <p className="text-xs font-semibold text-choco-700 mt-1.5 leading-relaxed">
                  Kami tidak menyematkan script iklan pelacak perilaku (Google Ads, Facebook Pixel) atau menjual riwayat kuis belajarmu ke pihak luar.
                </p>
              </div>
            </div>
          </div>

          {/* Card 4: Full User Control */}
          <div className="p-5 sm:p-6 rounded-2xl bg-white border-3 border-choco-900 shadow-[0_4px_0_#3B2218]">
            <div className="flex items-start gap-4">
              <div className="size-11 rounded-2xl bg-rose-100 border-2 border-choco-900 flex items-center justify-center shrink-0 shadow-[0_2px_0_#3B2218]">
                <Trash2 className="size-6 text-rose-800" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-pixel text-xs sm:text-sm font-bold text-choco-900">
                    Hak Reset & Penghapusan Data
                  </h3>
                  <span className="px-2.5 py-0.5 rounded-full font-pixel text-[9px] font-bold bg-rose-200 text-rose-900 border border-choco-900">
                    Kendali Penuh
                  </span>
                </div>
                <p className="text-xs font-semibold text-choco-700 mt-1.5 leading-relaxed">
                  Kamu bisa menghapus seluruh riwayat progres kapan saja lewat tombol Reset di menu Pengaturan. Menghapus cookie & situs data di browsermu juga akan membersihkan data lokal secara seketika.
                </p>
              </div>
            </div>
          </div>

          {/* Card 5: Data Undian */}
          <div className="p-5 sm:p-6 rounded-2xl bg-white border-3 border-choco-900 shadow-[0_4px_0_#3B2218]">
            <div className="flex items-start gap-4">
              <div className="size-11 rounded-2xl bg-purple-100 border-2 border-choco-900 flex items-center justify-center shrink-0 shadow-[0_2px_0_#3B2218]">
                <Shield className="size-6 text-purple-800" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-pixel text-xs sm:text-sm font-bold text-choco-900">
                    Data Undian
                  </h3>
                  <span className="px-2.5 py-0.5 rounded-full font-pixel text-[9px] font-bold bg-purple-200 text-purple-900 border border-choco-900">
                    Transparan
                  </span>
                </div>
                <p className="text-xs font-semibold text-choco-700 mt-1.5 leading-relaxed">
                  Jika ikut undian slot mint, kami menyimpan alamat wallet publik dan akun X. Alamat wallet pemenang diteruskan ke proyek mitra untuk allowlist. Untuk undian item, kami tidak meminta alamat wallet. Data peserta yang tidak menang dihapus 30 hari setelah undian selesai. Kami tetap tidak pernah meminta seed phrase atau private key.
                </p>
              </div>
            </div>
          </div>

          {/* Card 6: Pedoman Komunitas & Sensor Username */}
          <div className="p-5 sm:p-6 rounded-2xl bg-white border-3 border-choco-900 shadow-[0_4px_0_#3B2218]">
            <div className="flex items-start gap-4">
              <div className="size-11 rounded-2xl bg-emerald-100 border-2 border-choco-900 flex items-center justify-center shrink-0 shadow-[0_2px_0_#3B2218]">
                <CheckCircle2 className="size-6 text-emerald-800" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-pixel text-xs sm:text-sm font-bold text-choco-900">
                    Pedoman Komunitas & Moderasi Nama
                  </h3>
                  <span className="px-2.5 py-0.5 rounded-full font-pixel text-[9px] font-bold bg-emerald-200 text-emerald-900 border border-choco-900">
                    Aman
                  </span>
                </div>
                <p className="text-xs font-semibold text-choco-700 mt-1.5 leading-relaxed">
                  Username yang melanggar pedoman komunitas dapat disensor secara otomatis maupun manual oleh admin tanpa menghapus akun. Progres belajar, XP, tiket, dan koin tetap tersimpan aman.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="mt-8 flex flex-col sm:flex-row gap-3">
          <Link
            to="/settings"
            className="flex-1 py-3.5 px-5 rounded-2xl bg-white hover:bg-cream-100 text-choco-900 font-pixel font-bold text-xs border-2 border-choco-900 shadow-[0_3px_0_#3B2218] active:translate-y-0.5 cursor-pointer flex items-center justify-center gap-2 text-center"
          >
            <ArrowLeft className="size-4" />
            <span>Kembali ke Pengaturan</span>
          </Link>
          <Link
            to="/about"
            className="py-3.5 px-6 rounded-2xl bg-candy-800 hover:bg-candy-950 text-white font-pixel font-bold text-xs border-3 border-choco-900 shadow-[0_3px_0_#3B2218] active:translate-y-0.5 cursor-pointer text-center"
          >
            Tentang Web3min
          </Link>
        </div>
      </main>
    </AppShell>
  );
}
