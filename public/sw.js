/**
 * web3min offline shell.
 *
 * Hand-rolled, no Workbox: the app needs exactly two things offline —
 * 1. navigation requests still render the SPA shell (so TanStack Router shows
 *    the offline screen instead of the browser's ERR_INTERNET_DISCONNECTED), and
 * 2. the tiny asset set needed to paint that shell.
 *
 * Progres belajar hidup di localStorage + Supabase, jadi syarat #3 AGENTS.md
 * ("offline: tampilkan data tersimpan") sudah terpenuhi tanpa cache API.
 *
 * ponytail: cache-first untuk GET statis saja; halaman baru (yang belum
 * pernah dibuka online) jatuh ke shell lalu ke layar offline, bukan error
 * browser. Upgrade ke Workbox + precache penuh kalau butuh offline penuh
 * buat semua 20 rute.
 *
 * CATATAN URL: Vercel mengaktifkan clean URLs — /offline-shell.html di-serve
 * sebagai /offline-shell dan path ber-ekstensi .html dijawab 404. Selalu pakai
 * SHELL_URL tanpa ekstensi, dan bump VERSION kalau isi shell berubah supaya
 * cache lama tidak nyangkut.
 */

const VERSION = "w3m-v3";
const SHELL_CACHE = `${VERSION}-shell`;
const ASSET_CACHE = `${VERSION}-assets`;

const SHELL_URL = "/offline-shell";

// Hanya aset yang dibutuhkan buat mengecat shell offline. Jangan tambah
// bundel utama — ukurannya beda tiap deploy dan cache-nya cepat basi.
const PRECACHE = [SHELL_URL, "/icon-192.png", "/favicon.svg", "/manifest.json"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(SHELL_CACHE)
      .then((cache) => cache.addAll(PRECACHE))
      .then(() => self.skipWaiting())
      .catch(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => !k.startsWith(VERSION)).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

function isStaticAsset(url) {
  return /\.(?:js|css|woff2?|ttf|png|jpe?g|webp|gif|svg|ico|json)$/i.test(url.pathname);
}

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  // API: jangan pernah di-cache, tapi jangan biarkan browser menampilkan
  // error mentah saat offline — balas 503 JSON supaya pemanggil bisa
  // menampilkan pesan "kamu sedang offline" sendiri.
  if (url.pathname.startsWith("/api/")) {
    event.respondWith(
      fetch(request).catch(
        () =>
          new Response(JSON.stringify({ ok: false, offline: true, error: "Kamu sedang offline." }), {
            status: 503,
            headers: { "content-type": "application/json" },
          }),
      ),
    );
    return;
  }

  // Navigasi: selalu coba jaringan dulu supaya user tidak terjebak versi lama.
  // Kalau gagal, sajikan shell dari cache — shell inilah yang menjalankan app
  // dan menampilkan layar offline.
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request).catch(async () => {
        const cache = await caches.open(SHELL_CACHE);
        const shell = await cache.match(SHELL_URL);
        return shell || new Response("Offline", { status: 503, headers: { "content-type": "text/plain" } });
      }),
    );
    return;
  }

  if (!isStaticAsset(url)) return;

  // Aset statis: cache dulu, isi cache di latar belakang saat sudah ada.
  event.respondWith(
    caches.match(request).then((hit) => {
      if (hit) {
        fetch(request)
          .then((res) => {
            if (res && res.ok) caches.open(ASSET_CACHE).then((c) => c.put(request, res.clone()));
          })
          .catch(() => {});
        return hit;
      }
      return fetch(request)
        .then((res) => {
          if (res && res.ok) {
            const copy = res.clone();
            caches.open(ASSET_CACHE).then((c) => c.put(request, copy));
          }
          return res;
        })
        .catch(() => new Response("", { status: 504 }));
    }),
  );
});

self.addEventListener("message", (event) => {
  if (event.data === "skip-waiting") self.skipWaiting();
});