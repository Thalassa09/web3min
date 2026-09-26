import { useEffect, useState } from "react";
import { WifiOff, RefreshCw } from "lucide-react";

/**
 * Banner offline global. Mount sekali di __root, jadi semua rute dapat.
 *
 * Mengapa di root, bukan di dalam AppShell: 11 rute tidak memakai AppShell
 * (onboarding, masuk, lesson, cerita, dll) — justru itu rute yang paling
 * sering dibuka dari HP. Banner di AppShell akan bocor di situ.
 *
 * `navigator.onLine` saja tidak cukup: artinya "ada antarmuka jaringan",
 * bukan "server bisa dihubungi" — WSL/hotspot sering melaporkan online
 * padahal tidak ada internet. Karena itu pesannya tidak pernah bilang
 * "tidak ada koneksi"; kegagalan permintaan sungguhan ditangani oleh
 * pesan error inline di masing-masing rute.
 */
export function OfflineBanner() {
  const [offline, setOffline] = useState(false);
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    // Baca saat mount: kalau halaman dimuat dari cache shell SW, browser sudah
    // tahu status koneksi sebelum React sempat jalan.
    setOffline(!navigator.onLine);

    const goOffline = () => setOffline(true);
    const goOnline = () => {
      setOffline(false);
      setChecking(false);
    };

    window.addEventListener("offline", goOffline);
    window.addEventListener("online", goOnline);
    return () => {
      window.removeEventListener("offline", goOffline);
      window.removeEventListener("online", goOnline);
    };
  }, []);

  useEffect(() => {
    // Daftarkan service worker. Ini yang membuat navigasi offline menyajikan
    // /offline-shell.html alih-alih ERR_INTERNET_DISCONNECTED.
    if (!("serviceWorker" in navigator)) return;
    const register = () => {
      navigator.serviceWorker.register("/sw.js", { scope: "/" }).catch(() => {
        // Offline shell tidak tersedia; banner ini tetap jalan tanpa SW.
      });
    };
    if (document.readyState === "complete") register();
    else window.addEventListener("load", register, { once: true });
  }, []);

  if (!offline) return null;

  return (
    <div
      data-offline="true"
      role="status"
      aria-live="polite"
      className="fixed inset-x-0 top-0 z-[1001] flex items-center gap-2.5 border-b-2 border-choco-900 bg-lemon px-3 py-2 text-choco-900 shadow-[0_3px_0_#3B2218]"
      style={{ paddingTop: "calc(0.5rem + env(safe-area-inset-top))" }}
    >
      <WifiOff className="size-4 shrink-0" aria-hidden="true" />
      <p className="min-w-0 flex-1 text-[11px] font-bold leading-snug sm:text-xs">
        Kamu sedang offline. Progres tersimpan di perangkat ini.
      </p>
      <button
        type="button"
        onClick={() => {
          setChecking(true);
          // Ke beranda, bukan reload — reload saat masih offline hanya
          // memutar ulang halaman yang sama dan user tidak melihat kemajuan.
          window.location.assign("/");
        }}
        disabled={checking}
        className="inline-flex min-h-11 shrink-0 items-center gap-1.5 rounded-full border-2 border-choco-900 bg-white px-3 text-[11px] font-bold shadow-[0_2px_0_#3B2218] transition-transform active:translate-y-0.5 active:shadow-none disabled:opacity-60"
      >
        <RefreshCw className={`size-3.5 ${checking ? "animate-spin" : ""}`} aria-hidden="true" />
        {checking ? "Menyambung…" : "Coba lagi"}
      </button>
    </div>
  );
}