import React, { useMemo } from "react";
import { PulauIcon } from "@/lib/pulau-icons";

/**
 * CloudFog — kabut awan penutup untuk rute yang belum terbuka (fog of war).
 *
 * Kenapa ada: peta rantai menampilkan 20 rute sekaligus. Tanpa penanda, user
 * baru tidak tahu rute mana yang sudah bisa dimainkan — semua node terlihat
 * sama redupnya. Kabut membuat batas "wilayah yang sudah terbuka" terlihat
 * sekilas, tanpa harus membaca satu per satu.
 *
 * Aturan yang dijaga di sini:
 *  - Posisi awan ditentukan PRNG ber-seed `unitIndex`, BUKAN Math.random().
 *    Kalau random, awan melompat setiap re-render (setiap kali user menyelesaikan
 *    satu blok, seluruh peta bergeser sendiri — terlihat seperti bug).
 *  - Papan nama rute (`z-10`) HARUS tetap di atas awan. Awan memakai `z-3`:
 *    node memakai `z-2`, dan DUA elemen ber-z-index sama tidak dijamin
 *    diselesaikan oleh urutan DOM (terbukti: `elementFromPoint` di titik
 *    node rute terkunci mengembalikan tombol node, bukan awan). `z-3`
 *    memastikan awan menang, sementara papan nama `z-10` tetap di atasnya.
 *  - Animasi pembuka hanya berjalan SEKALI per rute perangkat
 *    (localStorage `web3min-fog-cleared`). Kalau tidak, setiap kunjungan
 *    ulang akan memutar animasi 1,2 detik dan terasa lambat.
 *  - `prefers-reduced-motion`: drift dimatikan total, pembuka jadi fade instan.
 */

/** PRNG deterministik (mulberry32). Seed sama -> urutan sama, selamanya. */
function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export interface CloudFogProps {
  /** Index rute (1-based) — jadi seed PRNG. Rute sama selalu dapat awan sama. */
  unitIndex: number;
  /** Nomor rute yang harus diselesaikan dulu (untuk hint). */
  prevUnitIndex: number;
  /** Judul rute sebelumnya, kalau ada — dipakai di hint supaya lebih manusiawi. */
  prevUnitTitle?: string;
  /** Tinggi area rute dalam px; awan disebar sepanjang tinggi ini. */
  height: number;
  /** Fase: "open" memutar animasi buka, lalu parent meng-unmount. */
  phase?: "closed" | "open";
  /** Dipanggil saat user menekan area awan. */
  onDeny?: () => void;
}

interface CloudSpec {
  left: number;
  top: number;
  scale: number;
  duration: number;
  delay: number;
  flip: boolean;
}

/**
 * Awan pixel SVG. Digambar dengan blok-blok persegi + `shapeRendering`
 * crispEdges supaya tepinya tajam seperti pixel art — bukan kurva halus.
 * Tiga lapis warna: badan #FFF9FB, bayangan bawah #EADCE8, outline #8C7285.
 */
function PixelCloud({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 40"
      className={className}
      shapeRendering="crispEdges"
      aria-hidden="true"
      focusable="false"
    >
      {/* Badan awan — blok-blok bertingkat */}
      <g fill="#FFF9FB">
        <rect x="8" y="16" width="48" height="16" />
        <rect x="14" y="8" width="16" height="12" />
        <rect x="30" y="4" width="18" height="16" />
        <rect x="44" y="12" width="14" height="12" />
        <rect x="4" y="20" width="8" height="12" />
        <rect x="52" y="20" width="8" height="12" />
      </g>

      {/* Bayangan bawah — memberi bobot, bukan gradien */}
      <g fill="#EADCE8">
        <rect x="8" y="30" width="48" height="4" />
        <rect x="4" y="30" width="6" height="3" />
        <rect x="54" y="30" width="6" height="3" />
        <rect x="44" y="22" width="14" height="4" />
      </g>

      {/* Outline — hanya sisi luar, mengikuti siluet blok */}
      <g fill="#8C7285">
        <rect x="8" y="14" width="48" height="2" />
        <rect x="6" y="16" width="2" height="16" />
        <rect x="56" y="16" width="2" height="16" />
        <rect x="8" y="32" width="48" height="2" />
        <rect x="14" y="6" width="16" height="2" />
        <rect x="12" y="8" width="2" height="6" />
        <rect x="30" y="2" width="18" height="2" />
        <rect x="48" y="4" width="2" height="8" />
        <rect x="44" y="10" width="14" height="2" />
        <rect x="4" y="18" width="2" height="12" />
        <rect x="58" y="18" width="2" height="12" />
        <rect x="2" y="28" width="2" height="2" />
        <rect x="60" y="28" width="2" height="2" />
      </g>
    </svg>
  );
}

export function CloudFog({
  unitIndex,
  prevUnitIndex,
  prevUnitTitle,
  height,
  phase = "closed",
  onDeny,
}: CloudFogProps) {
  // Awan disebar memenuhi tinggi rute. Jumlah ikut tinggi supaya rute panjang
  // tidak kebagian awan jarang dan rute pendek tidak terlalu padat.
  const clouds = useMemo<CloudSpec[]>(() => {
    const rand = mulberry32(unitIndex * 7919 + 13);
    const count = Math.max(5, Math.min(11, Math.round(height / 95)));
    const out: CloudSpec[] = [];
    for (let i = 0; i < count; i++) {
      // Sebar merata secara vertikal + sedikit jitter, lalu selang-seling kiri/kanan.
      const slot = (i + 0.5) / count;
      const top = slot * height + (rand() - 0.5) * (height / count) * 0.7;
      const onLeft = i % 2 === 0;
      out.push({
        // Menjorok keluar tepi supaya siluetnya terpotong — terlihat seperti
        // kabut yang menutupi, bukan stiker awan yang ditempel.
        left: onLeft ? -6 + rand() * 14 : 74 + rand() * 16,
        top: Math.max(4, Math.min(height - 44, top - 20)),
        scale: 0.85 + rand() * 0.75,
        duration: 9 + rand() * 9,
        delay: rand() * 6,
        flip: rand() > 0.5,
      });
    }
    return out;
  }, [unitIndex, height]);

  const isOpen = phase === "open";

  return (
    /*
     * SELURUH area awan adalah satu <button> — sesuai spesifikasi: satu tap di
     * mana pun di area ini menjalankan playDeny() + toast.
     *
     * `touch-action: pan-y` WAJIB. Tanpa itu tombol setinggi rute (sampai 820px)
     * menelan gesture swipe, dan user terkunci: tidak bisa scroll melewati rute
     * berawan sama sekali. Dengan pan-y, swipe vertikal tetap men-scroll
     * halaman sementara tap tetap ditangkap tombol ini.
     *
     * Badge di dalamnya sengaja <div>, bukan <button> — nested button adalah
     * HTML tidak valid dan membingungkan screen reader.
     */
    <button
      type="button"
      onClick={onDeny}
      aria-label={`Rute ${unitIndex} masih tertutup awan. Selesaikan Rute ${prevUnitIndex} dulu.`}
      data-cloud-fog={unitIndex}
      className="absolute inset-0 z-3 cloud-fog-hit cursor-pointer"
      style={{ touchAction: "pan-y" }}
    >
      {/* Lapisan kabut gradien. Bagian atas dibiarkan transparan supaya papan
          nama rute (z-10) tetap terbaca. */}
      <span
        className={`absolute inset-x-0 bottom-0 h-[94%] cloud-fog-mist block ${
          isOpen ? "cloud-fog-mist-out" : ""
        }`}
      />

      {/* Awan bergerak pelan ke kiri-kanan. Saat `phase=open`, awan kiri keluar
          ke kiri dan awan kanan ke kanan, lalu parent meng-unmount. */}
      {clouds.map((c, i) => {
        const side = i % 2 === 0 ? "left" : "right";
        return (
          <span
            key={i}
            className={`absolute cloud-fog-bit ${isOpen ? `cloud-fog-out-${side}` : ""}`}
            style={{
              left: `${c.left}%`,
              top: `${c.top}px`,
              width: `${64 * c.scale}px`,
              animationDuration: `${c.duration}s`,
              animationDelay: `${c.delay}s`,
              // Arah flip ditentukan PRNG yang sama dengan posisi.
              transform: c.flip ? "scaleX(-1)" : undefined,
            }}
          >
            <PixelCloud className="w-full h-auto" />
          </span>
        );
      })}

      {/* Badge ajakan — visual saja, kliknya ditangani tombol induk. */}
      <span className="absolute left-1/2 top-[42%] -translate-x-1/2 -translate-y-1/2 cloud-fog-badge inline-flex flex-col items-center gap-1.5 rounded-3xl border-2 border-choco-900/25 bg-white/92 px-4 py-3.5 backdrop-blur-md shadow-[0_4px_0_#3B2218,0_10px_20px_-6px_rgba(59,34,24,0.22)] max-w-[calc(100%-32px)]">
        <span className="grid size-11 place-items-center rounded-full border-2 border-choco-900/25 bg-cream-fill text-choco-900/70">
          <PulauIcon name="lock" size={20} />
        </span>
        <span className="font-pixel font-bold text-xs text-choco-900 text-center leading-tight">
          Rute masih tertutup awan
        </span>
        <span className="text-[11px] font-semibold text-choco-600 text-center leading-tight max-w-[190px]">
          Selesaikan Rute {prevUnitIndex}
          {prevUnitTitle ? ` (${prevUnitTitle})` : ""} dulu
        </span>
      </span>
    </button>
  );
}

export default CloudFog;
