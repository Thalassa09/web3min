import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/bubble")({
  beforeLoad: () => {
    throw redirect({ to: "/" });
  },
  component: () => null,
});

function ArcadeCandyComponentsShowcase() {
  const pixelMode = useProgress((s) => s.pixelMode);
  const setPixelMode = useProgress((s) => s.setPixelMode);
  const [soundOn, setSoundOn] = useState(true);
  const [hapticOn, setHapticOn] = useState(true);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [activeSlot, setActiveSlot] = useState<number>(0);
  const [coinCount, setCoinCount] = useState<number>(150);

  return (
    <div className="min-h-screen bg-cream text-choco-900 px-4 py-8 md:py-12 pb-24 font-sans selection:bg-candy-200">
      {/* Container */}
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Top Header */}
        <header className="space-y-3 border-b-4 border-choco-900 pb-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Sparkles className="size-8 text-candy-500 animate-bounce" />
              <h1 className="font-pixel text-2xl md:text-3xl uppercase tracking-wider text-choco-900">
                ARCADE CANDY <span className="text-candy-500">: CHECKPOINT 1</span>
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <Lollipop level={12} />
              <CoinToken amount={coinCount} />
            </div>
          </div>
          <p className="text-choco-600 text-sm md:text-base font-bold">
            Komponen Dasar (Step 2 Checkpoint): Gummy 3D Buttons, DNA CandyBox, Candy-Stripe ProgressBar, Lollipops & Badges, CoinToken, InvSlots, Section Titles & Toggles.
          </p>
        </header>

        {/* 1. BUTTONS (GUMMY) */}
        <section className="space-y-4">
          <SectionTitle
            title="1. GUMMY BUTTONS (DNA 3D, GLOSS REFLECTION, 4PX ACTIVE DROP)"
            subtitle="Tombol jeli mengkilap dengan highlight glare ::after, border 3px choco-900, dan bayangan 3D solid."
          />
          <CandyBox className="p-6 md:p-8 space-y-6">
            <div>
              <div className="text-xs font-pixel uppercase tracking-widest text-choco-600 mb-3">
                VARIAN UTAMA (MAX 1 PRIMARY PER SCREEN)
              </div>
              <div className="flex flex-wrap gap-4 items-center">
                <Button
                  variant="primary"
                  onClick={() => setCoinCount((c) => c + 10)}
                  leftIcon={<Sparkles className="size-4" />}
                >
                  INSERT COIN (+10)
                </Button>
                <Button variant="secondary" leftIcon={<Compass className="size-4" />}>
                  KEMBALI KE LOBBY
                </Button>
                <Button variant="danger" leftIcon={<ShieldAlert className="size-4" />}>
                  HAPUS SAVE FILE
                </Button>
                <Button variant="primary" disabled>
                  KOIN KURANG (DISABLED)
                </Button>
              </div>
            </div>

            <div className="pt-4 border-t-2 border-choco-900/10">
              <div className="text-xs font-pixel uppercase tracking-widest text-choco-600 mb-3">
                SKALA UKURAN (SM / MD / LG / FULL WIDTH)
              </div>
              <div className="flex flex-wrap items-center gap-4">
                <Button size="sm" variant="primary">
                  SM BUTTON
                </Button>
                <Button size="md" variant="primary">
                  MD BUTTON (DEFAULT)
                </Button>
                <Button size="lg" variant="primary" rightIcon={<ArrowRight className="size-5" />}>
                  LG ACTION BUTTON
                </Button>
              </div>
              <div className="mt-4 max-w-sm">
                <Button wide variant="primary">
                  FULL WIDTH MOBILE CTA ▶️
                </Button>
              </div>
            </div>
          </CandyBox>
        </section>

        {/* 2. CANDYBOX DNA */}
        <section className="space-y-4">
          <SectionTitle
            title="2. DNA BOX (WAJIB UNTUK SEMUA BOX DI APP)"
            subtitle="Border 3px solid choco-900, radius 22px, box-shadow 0 6px 0 choco-900. Nol border 1px & nol blur shadow."
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Default Box */}
            <CandyBox className="p-6 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-pixel text-lg font-bold text-choco-900">.candy-box (DEFAULT)</span>
                <Badge variant="brand">CREAM FILL</Badge>
              </div>
              <p className="text-sm text-choco-600 leading-relaxed font-bold">
                Latar krem hangat #FFF6EE, border choco 3px, bayangan solid 6px. Digunakan untuk seluruh kartu, container, dan panel pelajaran.
              </p>
            </CandyBox>

            {/* Hover Box */}
            <CandyBox variant="hover" className="p-6 space-y-2 cursor-pointer">
              <div className="flex items-center justify-between">
                <span className="font-pixel text-lg font-bold text-choco-900">.candy-box--hover</span>
                <Badge variant="mint">INTERACTIVE</Badge>
              </div>
              <p className="text-sm text-choco-600 leading-relaxed font-bold">
                Hover me! Melompat naik 3px dengan transisi steps(2) dan bayangan menebal menjadi 9px. Sangat tactile untuk kartu rute & kuis!
              </p>
            </CandyBox>

            {/* Pink Box */}
            <CandyBox variant="pink" className="p-6 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-pixel text-lg font-bold text-white">.candy-box--pink</span>
                <Badge variant="coin">BRAND ACCENT</Badge>
              </div>
              <p className="text-sm text-white/90 leading-relaxed font-bold">
                Latar candy-400 (#F26A99) dengan teks putih kontras. Digunakan untuk mobile bottom tab, kartu pemain, dan panggung Blobi.
              </p>
            </CandyBox>

            {/* Dark Arcade Box */}
            <CandyBox variant="dark" className="p-6 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-pixel text-lg font-bold text-lemon">.candy-box--dark</span>
                <Badge variant="coin">HIGH SCORE</Badge>
              </div>
              <p className="text-sm text-lemon/80 leading-relaxed font-bold">
                Latar cokelat pekat choco-900 dengan teks lemon pixel. Digunakan untuk papan HIGH SCORE mingguan dan kabinet retro.
              </p>
            </CandyBox>

            {/* Glitch Box */}
            <CandyBox variant="glitch" className="p-6 space-y-2 md:col-span-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Zap className="size-5 text-grape" />
                  <span className="font-pixel text-lg font-bold text-grape-deep">.candy-box--glitch (ZONA BOSS / BAHAYA)</span>
                </div>
                <Badge variant="grape">GLITCH 8-BIT</Badge>
              </div>
              <p className="text-sm text-grape-deep leading-relaxed font-bold">
                Border grape-deep dengan latar lavender #F3ECFF dan bayangan grape. Digunakan saat jawaban salah, blok rusak, atau Zona Boss (Rute 16 s.d. 20).
              </p>
            </CandyBox>
          </div>
        </section>

        {/* 3. PROGRESS BARS (CANDY-STRIPE) */}
        <section className="space-y-4">
          <SectionTitle
            title="3. PROGRESS BAR (CANDY-STRIPE ANIMATED)"
            subtitle="Garis belang permen tongkat berputar halus infinite, berbingkai 3px solid choco-900."
          />
          <CandyBox className="p-6 md:p-8 space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs font-pixel uppercase tracking-wider text-choco-900">
                <span>KONFIRMASI BLOK (1/3)</span>
                <span>33%</span>
              </div>
              <ProgressBar value={33} showLabel />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs font-pixel uppercase tracking-wider text-choco-900">
                <span>PROGRES ZONA 1 (HUTAN PERMEN)</span>
                <span>65%</span>
              </div>
              <ProgressBar value={65} size="md" showLabel />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs font-pixel uppercase tracking-wider text-choco-900">
                <span>RANTAI TERVALIDASI (100% SELESAI)</span>
                <span className="text-mint-deep font-bold">PERFECT</span>
              </div>
              <ProgressBar value={100} size="lg" showLabel />
            </div>

            <div className="pt-4 border-t-2 border-dashed border-choco-900/20 space-y-3">
              <div className="text-xs font-pixel uppercase tracking-wider text-choco-900">
                INDETERMINATE CANDY LOADER ("SEMUA LOADING HARUS BEGINI")
              </div>
              <CandyLoader size="md" label="MEMUAT DATA BLOK & TRANSAKSI ON-CHAIN…" />
            </div>
          </CandyBox>
        </section>

        {/* 4. BADGES & LOLLIPOPS */}
        <section className="space-y-4">
          <SectionTitle
            title="4. BADGES, LOLLIPOPS & COIN TOKENS"
            subtitle="Indikator status semantik: Lemon KHUSUS koin & XP, Oranye KHUSUS streak, Mint benar, Grape bahaya."
          />
          <CandyBox className="p-6 md:p-8 space-y-6">
            <div>
              <div className="text-xs font-pixel uppercase tracking-widest text-choco-600 mb-3">
                LOLLIPOP LEVEL & COIN TOKENS
              </div>
              <div className="flex flex-wrap items-center gap-4">
                <Lollipop level={1} />
                <Lollipop level={5} />
                <Lollipop level={99} />
                <CoinToken amount={30} size="sm" />
                <CoinToken amount={150} size="md" />
                <CoinToken amount="1.250" size="lg" />
              </div>
            </div>

            <div className="pt-4 border-t-2 border-choco-900/10">
              <div className="text-xs font-pixel uppercase tracking-widest text-choco-600 mb-3">
                BADGE SEMANTIK ON-CHAIN & GAMEPLAY
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <Badge variant="brand">BRAND PINK</Badge>
                <Badge variant="hash">#0x01 HASH</Badge>
                <Badge variant="coin">+30 XP</Badge>
                <Badge variant="streak">5 COMBO</Badge>
                <Badge variant="mint">DIPERBAIKI</Badge>
                <Badge variant="grape">GLITCH UNGU</Badge>
                <Badge variant="danger">RUSAK</Badge>
                <Badge variant="level">LEVEL UP</Badge>
              </div>
            </div>

            <div className="pt-4 border-t-2 border-choco-900/10">
              <div className="text-xs font-pixel uppercase tracking-widest text-choco-600 mb-3">
                STREAK BADGES BERWARNA (SHADCN CVA + TACTILE ARCADE)
              </div>
              <div className="flex flex-wrap items-center gap-4">
                <StreakBadge length={7} frequency="daily" variant="colored" size="sm" subtitle="HARI AKTIF" />
                <StreakBadge length={14} frequency="daily" variant="flame" size="default" subtitle="API BELAJAR" />
                <StreakBadge length={30} frequency="daily" variant="glow" size="default" subtitle="LEGEND STREAK" />
                <StreakBadge length={100} frequency="daily" variant="candy" size="sm" subtitle="MASTERY" />
              </div>
            </div>
          </CandyBox>
        </section>

        {/* 5. INVENTORY SLOTS (INVSLOT) */}
        <section className="space-y-4">
          <SectionTitle
            title="5. INVENTORY SLOTS (DASHED PINK, 'x0')"
            subtitle="Slot tas pemain berukuran 68x68 dengan bingkai putus-putus pink candy-400 dan indikator kuantitas pixel."
          />
          <CandyBox className="p-6 md:p-8">
            <div className="flex flex-wrap items-center gap-6">
              <InvSlot
                count="x0"
                label="SLOT KOSONG"
                selected={activeSlot === 0}
                onClick={() => setActiveSlot(0)}
              />
              <InvSlot
                count="x1"
                icon={<ShieldAlert className="size-6 text-candy-500" />}
                label="PELINDUNG"
                selected={activeSlot === 1}
                onClick={() => setActiveSlot(1)}
              />
              <InvSlot
                count="x3"
                icon={<Flame className="size-6 text-streak" />}
                label="BEKU STREAK"
                selected={activeSlot === 2}
                onClick={() => setActiveSlot(2)}
              />
              <InvSlot
                count="x5"
                icon={<Coins className="size-6 text-lemon-deep" />}
                label="DOUBLE XP"
                selected={activeSlot === 3}
                onClick={() => setActiveSlot(3)}
              />
              <InvSlot
                count="???"
                icon={<Gift className="size-6 text-grape" />}
                label="RAK PIALA"
                selected={activeSlot === 4}
                onClick={() => setActiveSlot(4)}
              />
            </div>
          </CandyBox>
        </section>

        {/* 6. CANDY TOGGLES */}
        <section className="space-y-4">
          <SectionTitle
            title="6. CANDY TOGGLE (PENGATURAN OPTIONS)"
            subtitle="Switch taktil dengan knob jeli pink/choco dan status on/off arcade."
          />
          <CandyBox className="p-6 md:p-8 space-y-4">
            <CandyToggle
              checked={soundOn}
              onChange={setSoundOn}
              label="EFEK SUARA 8-BIT"
              description="Putar suara 'ting!' saat blok diperbaiki dan sfx tap arcade."
            />
            <CandyToggle
              checked={hapticOn}
              onChange={setHapticOn}
              label="GETAR & HAPTIC"
              description="Getar halus saat tombol ditekan atau blok retak."
            />
            <CandyToggle
              checked={reduceMotion}
              onChange={setReduceMotion}
              label="KURANGI ANIMASI (REDUCED MOTION)"
              description="Matikan animasi candy-stripe, glitch, bounce, dan goyangan."
            />
          </CandyBox>
        </section>

        {/* 7. ESTETIKA & PIXEL CRAFT ENGINE */}
        <section className="space-y-4">
          <SectionTitle
            title="7. ESTETIKA & PIXEL CRAFT ENGINE (ANTI-PASARAN)"
            subtitle="Peralihan instan antara Pristine Modern (Bricolage Grotesque & Plus Jakarta Sans) dan Retro 8-bit Arcade."
          />
          <CandyBox className="p-6 md:p-8 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xl select-none">{pixelMode ? <Gamepad2 className="size-5 text-amber-500" /> : <Sparkles className="size-5 text-candy-500" />}</span>
                  <p className="font-display font-bold text-lg text-choco-900">
                    {pixelMode ? "Mode Aktif: Retro Pixel Arcade" : "Mode Aktif: Pristine Modern Editorial"}
                  </p>
                </div>
                <p className="text-sm font-sans text-choco-600 mt-1">
                  {pixelMode
                    ? "Font 8-bit Silkscreen & Pixelify aktif pada judul dan badge. Tekan untuk beralih ke mode modern yang bersih."
                    : "Font Bricolage Grotesque & Plus Jakarta Sans aktif. Tampilan bersih, elegan, dan non-pasaran tanpa neo-brutalism murahan."}
                </p>
              </div>
              <Button
                variant={pixelMode ? "secondary" : "primary"}
                onClick={() => setPixelMode(!pixelMode)}
                className="shrink-0"
              >
                {pixelMode ? "Ganti ke Pristine Modern" : "Ganti ke Retro Pixel"}
              </Button>
            </div>

            {/* Retro 8-bit Game Progress Component */}
            <div className="pt-4 border-t border-choco-900/10">
              <p className="text-xs font-pixel text-choco-600 mb-3 tracking-wide">
                [LIVE 8-BIT GAME PROGRESS MODULE]
              </p>
              <div className="flex justify-center p-2 bg-choco-900/5 rounded-xl">
                <GameProgress className="w-full max-w-md" />
              </div>
            </div>
          </CandyBox>
        </section>

        {/* Navigation Back */}
        <div className="text-center pt-8">
          <Link to="/">
            <Button size="lg" variant="primary" leftIcon={<Compass className="size-5" />}>
              KEMBALI KE PETA PULAU RANTAI ▶️
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ArcadeCandyComponentsShowcase;
