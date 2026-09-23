import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { BubbleMenu, type MenuItem } from "@/components/bubble-menu";
import { Compass, BookOpen, Trophy, ShoppingBag, User, Smartphone, RotateCcw, ArrowLeft, Sparkles } from "lucide-react";

export const Route = createFileRoute("/bubble")({
  component: BubbleMenuShowcasePage
});

function BubbleMenuShowcasePage() {
  const [replayKey, setReplayKey] = useState(0);

  const candyItems: MenuItem[] = [
    {
      label: "Belajar",
      href: "/",
      ariaLabel: "Pulau Rantai",
      rotation: 0,
      icon: <Compass className="size-6 text-candy-deep stroke-[2.5]" />,
      badge: "148 BLOK",
      description: "Peta petualangan kurva Catmull-Rom",
      hoverStyles: { bgColor: "#F26A99", textColor: "#ffffff" }
    },
    {
      label: "Kisah",
      href: "/kisah",
      ariaLabel: "Kisah On-Chain",
      rotation: 0,
      icon: <BookOpen className="size-6 text-grape stroke-[2.5]" />,
      badge: "LORE",
      description: "20 kisah nyata sejarah web3",
      hoverStyles: { bgColor: "#8B5CF6", textColor: "#ffffff" }
    },
    {
      label: "Arena",
      href: "/leaderboard",
      ariaLabel: "Arena Belajar",
      rotation: 0,
      icon: <Trophy className="size-6 text-coin stroke-[2.5]" />,
      badge: "LIGA XP",
      description: "Papan peringkat mingguan",
      hoverStyles: { bgColor: "#FFC61A", textColor: "#1B1440" }
    },
    {
      label: "Toko",
      href: "/shop",
      ariaLabel: "Toko Blobi",
      rotation: 0,
      icon: <ShoppingBag className="size-6 text-flame stroke-[2.5]" />,
      badge: "RELOAD",
      description: "Beli oksigen & pelindung streak",
      hoverStyles: { bgColor: "#F2841F", textColor: "#ffffff" }
    },
    {
      label: "Profil",
      href: "/profile",
      ariaLabel: "Profil Penjelajah",
      rotation: 0,
      icon: <User className="size-6 text-sky stroke-[2.5]" />,
      badge: "ANALITIK",
      description: "Lisensi penjelajah & struk blok",
      hoverStyles: { bgColor: "#1CB0F6", textColor: "#ffffff" }
    },
    {
      label: "Stage",
      href: "/rantai",
      ariaLabel: "Stage 3-Phone",
      rotation: 0,
      icon: <Smartphone className="size-6 text-candy-deep stroke-[2.5]" />,
      badge: "3D PHONE",
      description: "Simulator panggung ponsel",
      hoverStyles: { bgColor: "#D62A78", textColor: "#ffffff" }
    }
  ];

  return (
    <div className="min-h-screen bg-[#F6EFF6] flex flex-col items-center justify-center p-4 sm:p-12 font-sans select-none">
      {/* Top Bar Navigation */}
      <div className="w-full max-w-4xl flex items-center justify-between mb-8">
        <Link
          to="/"
          className="inline-flex items-center gap-2 rounded-full border-2 border-ink-900 bg-white px-4 py-2 text-xs font-black text-ink-900 shadow-ink-sm transition-transform active:translate-y-0.5"
        >
          <ArrowLeft className="size-4" /> Kembali ke Belajar
        </Link>
        <div className="flex items-center gap-2">
          <span className="rounded-full border-2 border-ink-900 bg-candy px-3 py-1 text-xs font-black text-white shadow-ink-xs">
            🌸 Pink Candy Edition
          </span>
        </div>
      </div>

      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-1.5 rounded-full border-2 border-ink-900 bg-candy-soft px-4 py-1 text-xs font-black uppercase text-candy-deep shadow-ink-xs mb-3">
          <Sparkles className="size-3.5" /> Interactive GSAP Component
        </div>
        <h1 className="text-3xl sm:text-4xl font-display font-black text-ink-900 tracking-tight">
          Bubble Menu Showcase
        </h1>
        <p className="mt-2 text-sm font-bold text-ink-500 max-w-md mx-auto">
          Menu navigasi interaktif bergaya gelembung pil melayang dengan animasi GSAP staggered dan warna Pink Candy.
        </p>
      </div>

      {/* Interactive Showcase Frame */}
      <div
        key={replayKey}
        className="relative w-full max-w-4xl h-[560px] sm:h-[620px] border-2 border-ink-900 rounded-[36px] bg-white shadow-ink overflow-hidden"
      >
        <BubbleMenu
          logo={
            <div className="flex items-center gap-2">
              <span className="grid size-8 place-items-center rounded-full border-2 border-ink-900 bg-candy text-xs font-black text-white shadow-ink-xs">
                W3
              </span>
              <span className="font-display text-lg font-black text-ink-900">
                web3<span className="text-candy-deep">min</span>
              </span>
            </div>
          }
          items={candyItems}
          menuAriaLabel="Toggle navigation"
          menuBg="#F26A99"
          menuContentColor="#ffffff"
          useFixedPosition={false}
          animationEase="back.out(1.5)"
          animationDuration={0.5}
          staggerDelay={0.09}
        />

        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none p-6 text-center">
          <div className="size-16 rounded-full border-2 border-dashed border-candy/40 flex items-center justify-center mb-3 animate-pulse">
            <Sparkles className="size-8 text-candy" />
          </div>
          <p className="text-ink-500/70 font-display font-bold text-lg">
            Klik tombol bubble di kanan atas untuk membuka menu
          </p>
          <span className="mt-1 text-xs font-mono font-bold text-ink-300">
            [GSAP staggered pills · elastic bounce · rotate hover]
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
        <button
          type="button"
          onClick={() => setReplayKey((k) => k + 1)}
          className="px-6 py-2.5 rounded-full border-2 border-ink-900 bg-white hover:bg-candy-soft transition-all text-sm font-black text-ink-900 shadow-ink-sm active:translate-y-0.5 active:shadow-none flex items-center gap-2"
        >
          <RotateCcw className="size-4 text-candy-deep" />
          Replay Animation
        </button>

        <Link
          to="/rantai"
          className="px-6 py-2.5 rounded-full border-2 border-ink-900 bg-candy text-white hover:bg-candy-deep transition-all text-sm font-black shadow-ink-sm active:translate-y-0.5 active:shadow-none flex items-center gap-2"
        >
          <Smartphone className="size-4" />
          Buka 3-Phone Stage Simulator
        </Link>
      </div>
    </div>
  );
}
