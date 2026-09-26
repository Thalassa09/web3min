"use client";

import { PerspectiveFlipCard } from "@/components/ui/card-14";
import {
  Bath,
  BedDouble,
  Expand,
  MapPin,
  Sparkles,
  Star,
  Zap,
} from "lucide-react";

/**
 * Demo `card-14` — contoh pemakaian dengan data properti.
 *
 * Catatan integrasi: berkas `card-14.tsx` TIDAK punya named export `Card14`
 * (hanya `PerspectiveFlipCard` + default `Card14Demo`). Contoh asli mengimpor
 * `@/components/ui/card-14` sebagai default dan merender `<Card14 />`, yang akan
 * gagal karena default-nya adalah komponen full-page dengan demo bawaan.
 * Di sini kita merakit sendiri lewat `PerspectiveFlipCard` supaya polanya benar
 * dan tidak bergantung pada halaman demo bawaan.
 */

function FrontFace() {
  return (
    <div className="size-full flex flex-col [transform-style:preserve-3d]">
      <div className="relative h-64 w-full [transform-style:preserve-3d] [transform:translateZ(50px)]">
        <div className="absolute inset-0 rounded-2xl bg-choco-100 overflow-hidden border-2 border-choco-900">
          <img
            src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80"
            alt="Serenity Residential"
            className="h-full w-full object-cover transition duration-700 group-hover/p-card:scale-110"
          />
        </div>
        <div className="absolute bottom-4 left-4 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-card border-2 border-choco-900 text-[11px] font-bold text-choco-900 shadow-[0_2px_0_#3B2218] [transform:translateZ(80px)]">
          <Star className="size-3.5 fill-lemon text-lemon-deep" />
          <span>4.9 (120 Reviews)</span>
        </div>
      </div>

      <div className="flex flex-col justify-between flex-grow p-6 py-8 [transform-style:preserve-3d]">
        <div className="space-y-2 [transform-style:preserve-3d] [transform:translateZ(60px)]">
          <div className="flex items-center gap-2 text-candy-700 text-xs font-bold tracking-wide">
            <Sparkles className="size-4" />
            <span>Exclusive Listing</span>
          </div>
          <h3 className="text-2xl font-medium tracking-tight text-choco-900 leading-tight">
            Serenity Residential Home
          </h3>
          <p className="text-[15px] font-medium text-choco-600 flex items-center gap-1.5 leading-none mt-2">
            <MapPin className="size-4 text-candy-500" />
            15 S Aurora Ave, Miami
          </p>
        </div>
      </div>
    </div>
  );
}

function BackFace() {
  return (
    <div className="size-full flex flex-col items-center justify-center [transform-style:preserve-3d]">
      <div className="mb-10 w-full flex justify-center gap-4">
        {[
          { icon: BedDouble, label: "5 Beds" },
          { icon: Bath, label: "3 Baths" },
          { icon: Expand, label: "120m²" },
        ].map(({ icon: Icon, label }) => (
          <div
            key={label}
            className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-choco-50 border-2 border-choco-900 min-w-[90px]"
          >
            <div className="p-2 rounded-xl bg-card border-2 border-choco-900 text-candy-600 shadow-[0_2px_0_#3B2218]">
              <Icon className="size-6" />
            </div>
            <p className="text-[11px] font-bold tracking-tight">{label}</p>
          </div>
        ))}
      </div>

      <div className="space-y-3 px-6">
        <h3 className="text-xl font-medium tracking-tight text-choco-900">
          Property Highlights
        </h3>
        <p className="text-[13px] font-medium text-choco-600 leading-relaxed max-w-[280px] mx-auto">
          Award-winning residential design with 24/7 smart security and
          unparalleled tranquility.
        </p>
      </div>

      <div className="mt-8 w-full px-6">
        <button className="h-11 w-full rounded-xl bg-gradient-to-b from-candy-500 via-candy-600 to-candy-700 text-white text-xs font-bold tracking-wider shadow-[0_3px_0_#3B2218] transition-all hover:scale-[1.03] active:translate-y-[2px] active:shadow-[0_1px_0_#3B2218]">
          <Zap className="mr-2 size-3.5 inline-block fill-current" />
          Book Viewing
        </button>
      </div>
    </div>
  );
}

export default function Card14DemoUsage() {
  return (
    <div className="flex items-center justify-center min-h-screen w-full bg-cream p-4 sm:p-12">
      <PerspectiveFlipCard front={<FrontFace />} back={<BackFace />} />
    </div>
  );
}
