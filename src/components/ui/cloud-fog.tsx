import React, { useMemo } from "react";
import { PulauIcon } from "@/lib/pulau-icons";

/**
 * CloudFog — lapisan awan penutup untuk rute yang belum terbuka (fog of war).
 *
 * Kenapa ada: peta rantai menampilkan 20 rute sekaligus. Tanpa penanda, user
 * baru tidak tahu rute mana yang sudah bisa dimainkan — semua node terlihat
 * sama redupnya. Awan membuat batas "wilayah yang sudah terbuka" terlihat
 * sekilas, tanpa harus membaca satu per satu.
 *
 * URUTAN Z-INDEX (semuanya sudah terverifikasi ADA di CSS hasil build —
 * kelas z yang tidak terdaftar gagal SENYAP, jadi jangan mengarang nilai):
 *   node rantai   z-2
 *   maskot Blobi  z-10
 *   awan ini      z-20   <- menutupi node DAN maskot
 *   papan nama    z-30   <- tetap terbaca di atas awan
 *   toast/modal   z-50
 *
 * Aturan lain yang dijaga di sini:
 *  - Posisi awan ditentukan PRNG ber-seed `unitIndex`, BUKAN Math.random().
 *    Kalau random, awan melompat setiap re-render (setiap kali user menyelesaikan
 *    satu blok, seluruh peta bergeser sendiri — terlihat seperti bug).
 *  - Parent WAJIB menahan render sampai `hydrated`. Store memakai
 *    `skipHydration`, jadi render pertama selalu `completed: []` — semua rute
 *    terlihat terkunci. Tanpa penahan itu, user lama melihat awan di 19 rute
 *    lalu semuanya hilang sekejap (dan berisiko hydration mismatch #418).
 *  - Animasi pembuka hanya berjalan SEKALI per rute perangkat
 *    (localStorage `web3min-fog-cleared`). Kalau tidak, setiap kunjungan
 *    ulang akan memutar animasi dan terasa lambat.
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
 * Awan pixel SVG — gumpalan krem/putih dengan outline choco-900.
 *
 * Digambar sebagai SATU path bertingkat (bukan tumpukan rect) supaya outline
 * bisa memakai `vectorEffect="non-scaling-stroke"`: tebal garis tetap **2px**
 * di skala awan mana pun (awan di sini diskalakan 0.85–1.6×; kalau outline
 * digambar sebagai rect terpisah, tebalnya ikut membesar dan terlihat tebal
 * tidak konsisten antar awan).
 *
 * Dua warna isi: badan `#FFFFFF`, pita perut `#FFF6EE` (krem) — memberi bobot
 * di bawah tanpa gradien, jadi tetap terasa pixel art.
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
      {/* Siluet awan — blok bertingkat, outline choco-900 (#3B2218) 2px. */}
      <path
        d="M4 32 L4 20 L8 20 L8 16 L14 16 L14 8 L30 8 L30 4 L48 4 L48 12 L44 12 L44 16 L56 16 L56 20 L60 20 L60 32 Z"
        fill="#FFFFFF"
        stroke="#3B2218"
        strokeWidth="2"
        strokeLinejoin="miter"
        vectorEffect="non-scaling-stroke"
      />
      {/* Pita krem di perut awan. Duduk di DALAM siluet (x 6..58, y 26..31)
          supaya tidak menutupi outline di tepi. */}
      <path d="M6 26 H58 V31 H6 Z" fill="#FFF6EE" />
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
        // 8–12 detik: cukup pelan untuk terasa hidup tanpa menarik perhatian.
        // Kalau lebih cepat, mata tertarik ke rute terkunci padahal yang penting
        // justru rute aktif.
        duration: 8 + rand() * 4,
        delay: rand() * 6,
        flip: rand() > 0.5,
      });
    }
    return out;
  }, [unitIndex, height]);

  const isOpen = phase === "open";

  return (
    /*
     * SELURUH area awan adalah satu <button>.
     *
     * Kenapa <button> dan bukan <div role="button">: elemen <button> native
     * SUDAH memberi role="button" implisit, sudah fokusable (tabIndex 0), dan
     * sudah memicu `click` dari Enter maupun Space. Menambahkan role/tabIndex/
     * onKeyDown secara manual justru REDUNDAN, dan onKeyDown manual pada button
     * menyebabkan aksi berjalan DUA KALI (keydown -> click bawaan + handler
     * sendiri). Jadi tiga syarat aksesibilitas itu terpenuhi oleh elemennya.
     *
     * `touch-action: pan-y` WAJIB. Tanpa itu tombol setinggi rute (sampai 820px)
     * menelan gesture swipe, dan user terkunci: tidak bisa scroll melewati rute
     * berawan sama sekali. Dengan pan-y, swipe vertikal tetap men-scroll
     * halaman sementara tap tetap ditangkap tombol ini.
     */
    <button
      type="button"
      onClick={onDeny}
      aria-label={`Rute ${unitIndex} masih tertutup awan. Selesaikan Rute ${prevUnitIndex} untuk membuka.`}
      data-cloud-fog={unitIndex}
      className="absolute inset-0 z-20 cloud-fog-hit cursor-pointer"
      style={{ touchAction: "pan-y" }}
    >
      {/* Lapisan kabut. Bagian atas dibiarkan transparan supaya papan nama rute
          (z-30) tetap terbaca. */}
      <span
        className={`absolute inset-x-0 bottom-0 h-[88%] cloud-fog-mist block ${
          isOpen ? "cloud-fog-mist-out" : ""
        }`}
      />

      {/* Awan bergerak pelan ke kiri-kanan. Saat `phase=open`, seluruh lapisan
          memudar + mengecil ~400ms, lalu parent meng-unmount. */}
      {clouds.map((c, i) => (
        <span
          key={i}
          className={`absolute cloud-fog-bit ${isOpen ? "cloud-fog-out" : ""}`}
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
      ))}

      {/* Badge tengah — visual saja, kliknya ditangani tombol induk.
          `pointer-events-none` supaya tidak ada elemen yang menghalangi
          pengukuran `elementFromPoint` saat diuji.

          Isinya SENGAJA hanya teks, tanpa chip: chip "Terkunci" sudah ada di
          papan nama (z-30) yang selalu terbaca. Menaruhnya di sini juga membuat
          satu informasi muncul dua kali dalam satu layar. */}
      <span
        className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 cloud-fog-badge pointer-events-none inline-flex flex-col items-center gap-2 ${
          isOpen ? "cloud-fog-badge-out" : ""
        }`}
      >
        <span className="grid size-11 place-items-center rounded-full border-2 border-choco-900 bg-cream-fill text-choco-900 shadow-[0_2px_0_#3B2218]">
          <PulauIcon name="lock" size={20} />
        </span>
        <span className="max-w-[210px] rounded-2xl border-2 border-choco-900 bg-white/95 px-4 py-2.5 text-center font-pixel text-xs font-bold leading-tight text-choco-900 shadow-[0_3px_0_#3B2218] backdrop-blur-sm">
          Selesaikan Rute {prevUnitIndex} untuk membuka
          {prevUnitTitle ? (
            <span className="mt-0.5 block text-[10px] font-semibold text-choco-600">
              {prevUnitTitle}
            </span>
          ) : null}
        </span>
      </span>
    </button>
  );
}

export default CloudFog;
