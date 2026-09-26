"use client";

import React from "react";
import { cn } from "@/lib/utils";
import {
  ArrowRight,
  Bath,
  BedDouble,
  Expand,
  MapPin,
  Sparkles,
  Zap,
  Star,
} from "lucide-react";

/**
 * Card 14 — Perspective Flip Card, disesuaikan ke kontrak Tactile Spatial Arcade
 * (DESIGN.md). Efek flip 3D dipertahankan apa adanya; yang diubah hanya bahasa
 * visualnya supaya menyatu dengan sisa web3min:
 *   - border solid `border-2 border-choco-900` (bukan `border` tanpa ketebalan)
 *   - hard slab `shadow-[0_Npx_0_#3B2218]` (bukan shadow-lg/shadow-sm ber-blur)
 *   - radius `rounded-3xl` (32px) sesuai skala web3min
 *   - token `candy`/`choco`/`lemon`/`mint` (bukan --muted/--accent yang tidak ada)
 *
 * Token shadcn yang DIPAKAI di sini adalah yang benar-benar terdeklarasi di
 * blok `@theme` src/styles.css: --color-primary, --color-card,
 * --color-card-foreground, --color-foreground, --color-border, --color-ring.
 * `--color-background`, `--color-muted`, dan `--color-accent` TIDAK ada, jadi
 * padanannya memakai token web3min (cream / choco-100 / candy-50) — jangan
 * ditambahkan token shadcn baru tanpa keputusan pemilik repo.
 */
interface PerspectiveFlipCardProps {
  className?: string;
  front: React.ReactNode;
  back: React.ReactNode;
  h?: string;
  w?: string;
}

/**
 * Card 14 - Perspective Real Estate Card (Final Fix)
 * Uses standard rounded-2xl border radius and optimized 3D depth.
 * Removed overflow-hidden from faces to allow Z-translation to work correctly.
 */
export function PerspectiveFlipCard({
  className,
  front,
  back,
  h = "h-[500px]",
  w = "w-full max-w-[360px]",
}: PerspectiveFlipCardProps) {
  return (
    <div className={cn("group/p-card [perspective:2000px]", h, w, className)}>
      <div
        className={cn(
          "relative h-full w-full transition-all duration-700 [transform-style:preserve-3d] group-hover/p-card:[transform:rotateY(180deg)]",
          "rounded-3xl",
        )}
      >
        {/* Front Face: Property Overview */}
        <div className="absolute inset-0 size-full rounded-3xl border-2 border-choco-900 bg-card text-card-foreground shadow-[0_6px_0_#3B2218] [transform-style:preserve-3d] [backface-visibility:hidden]">
          <div className="size-full [transform-style:preserve-3d] p-3">
            {front}
          </div>
        </div>

        {/* Back Face: Property Specs */}
        <div className="absolute inset-0 size-full rounded-3xl border-2 border-choco-900 bg-card text-card-foreground shadow-[0_6px_0_#3B2218] [transform-style:preserve-3d] [backface-visibility:hidden] [transform:rotateY(180deg)]">
          <div className="size-full [transform-style:preserve-3d] p-8 text-center flex flex-col items-center justify-center">
            {back}
          </div>
        </div>
      </div>
    </div>
  );
}

const PerspectiveFront = () => (
  <div className="size-full flex flex-col [transform-style:preserve-3d]">
    {/* Image Section (Z: 50px) */}
    <div className="relative h-64 w-full [transform-style:preserve-3d] [transform:translateZ(50px)]">
      <div className="absolute inset-0 rounded-2xl bg-choco-100 overflow-hidden border-2 border-choco-900">
        <img
          src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80"
          alt="Serenity Residential"
          className="h-full w-full object-cover transition duration-700 group-hover/p-card:scale-110"
        />
      </div>

      {/* Floating Rating Badge (Z: 100px) */}
      <div className="absolute bottom-4 left-4 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-card border-2 border-choco-900 text-[11px] font-bold tracking-tight text-choco-900 shadow-[0_2px_0_#3B2218] [transform:translateZ(80px)]">
        <Star className="size-3.5 fill-lemon text-lemon-deep" />
        <span>4.9 (120 Reviews)</span>
      </div>
    </div>

    {/* Content Section (Z: 60px) */}
    <div className="flex flex-col justify-between flex-grow p-6 py-8 [transform-style:preserve-3d]">
      <div className="space-y-2 [transform-style:preserve-3d] [transform:translateZ(60px)]">
        <div className="flex items-center gap-2 text-candy-700 text-xs font-bold tracking-wide">
          <Sparkles className="size-4" />
          <span>Exclusive Listing</span>
        </div>
        <h3 className="text-2xl font-medium tracking-tight text-choco-900 transition duration-300 group-hover/p-card:text-candy-700 leading-tight">
          Serenity Residential Home
        </h3>
        <p className="text-[15px] font-medium text-choco-600 flex items-center gap-1.5 leading-none mt-2">
          <MapPin className="size-4 text-candy-500" />
          15 S Aurora Ave, Miami
        </p>
      </div>

      <div className="flex items-center justify-between text-xs font-bold tracking-wider text-choco-600 [transform:translateZ(40px)]">
        <span className="group-hover/p-card:text-candy-700 group-hover/p-card:translate-x-1 transition-all">
          Hover untuk lihat detail
        </span>
        <ArrowRight className="size-4 group-hover/p-card:text-candy-700" />
      </div>
    </div>
  </div>
);

const PerspectiveBack = () => (
  <div className="size-full flex flex-col items-center justify-center [transform-style:preserve-3d]">
    {/* Feature Icons (Z: 130px) */}
    <div className="mb-10 w-full [transform-style:preserve-3d] flex justify-center gap-4">
      <div className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-choco-50 border-2 border-choco-900 [transform:translateZ(130px)] min-w-[90px] [transform-style:preserve-3d]">
        <div className="p-2 rounded-xl bg-card border-2 border-choco-900 text-candy-600 [transform:translateZ(20px)] shadow-[0_2px_0_#3B2218]">
          <BedDouble className="size-6" />
        </div>
        <p className="text-[11px] font-bold [transform:translateZ(10px)] tracking-tight">
          5 Beds
        </p>
      </div>
      <div className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-choco-50 border-2 border-choco-900 [transform:translateZ(160px)] min-w-[90px] [transform-style:preserve-3d]">
        <div className="p-2 rounded-xl bg-card border-2 border-choco-900 text-candy-600 [transform:translateZ(25px)] shadow-[0_2px_0_#3B2218]">
          <Bath className="size-6" />
        </div>
        <p className="text-[11px] font-bold [transform:translateZ(10px)] tracking-tight">
          3 Baths
        </p>
      </div>
      <div className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-choco-50 border-2 border-choco-900 [transform:translateZ(130px)] min-w-[90px] [transform-style:preserve-3d]">
        <div className="p-2 rounded-xl bg-card border-2 border-choco-900 text-candy-600 [transform:translateZ(20px)] shadow-[0_2px_0_#3B2218]">
          <Expand className="size-6" />
        </div>
        <p className="text-[11px] font-bold [transform:translateZ(10px)] tracking-tight">
          120m²
        </p>
      </div>
    </div>

    {/* Description (Z: 80px) */}
    <div className="space-y-3 [transform-style:preserve-3d] px-6">
      <h3 className="text-xl font-medium tracking-tight text-choco-900 [transform:translateZ(80px)]">
        Property Highlights
      </h3>
      <p className="text-[13px] font-medium text-choco-600 leading-relaxed [transform:translateZ(40px)] max-w-[280px] mx-auto">
        Award-winning residential design with 24/7 smart security and
        unparalleled tranquility.
      </p>
    </div>

    {/* Action (Z: 100px) */}
    <div className="mt-8 [transform-style:preserve-3d] w-full px-6">
      <button className="h-11 w-full rounded-xl bg-gradient-to-b from-candy-500 via-candy-600 to-candy-700 text-white text-xs font-bold tracking-wider shadow-[0_3px_0_#3B2218] transition-all hover:scale-[1.03] active:translate-y-[2px] active:shadow-[0_1px_0_#3B2218] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-candy-700 [transform:translateZ(100px)]">
        <Zap className="mr-2 size-3.5 inline-block fill-current" />
        Book Viewing
      </button>
    </div>
  </div>
);

export default function Card14Demo() {
  return (
    <div className="flex items-center justify-center min-h-[600px] p-4 sm:p-12 bg-cream">
      <PerspectiveFlipCard
        front={<PerspectiveFront />}
        back={<PerspectiveBack />}
      />
    </div>
  );
}
