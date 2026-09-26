import { useEffect } from "react";
import { createRootRoute, HeadContent, Outlet, Scripts } from "@tanstack/react-router";
import { AuthProvider } from "@/lib/auth/provider";
import { HydrationGate } from "@/components/hydration-gate";
import { setAudioEnabled, primeAudio } from "@/lib/audio";
import { useProgress } from "@/lib/store";
import appCss from "../styles.css?url";
import { buildMeta } from "@/lib/seo";

const APP_NAME = "web3min";

function AudioEffectBridge() {
  const sound = useProgress((s) => s.sound);
  const reduceMotion = useProgress((s) => s.reduceMotion);

  useEffect(() => {
    document.documentElement.dataset.motion = reduceMotion ? "reduced" : "full";
  }, [reduceMotion]);

  useEffect(() => {
    setAudioEnabled(sound);
  }, [sound]);

  useEffect(() => {
    const boot = () => {
      void primeAudio();
    };
    window.addEventListener("pointerdown", boot, { passive: true });
    window.addEventListener("touchstart", boot, { passive: true });
    window.addEventListener("keydown", boot, { passive: true });
    return () => {
      window.removeEventListener("pointerdown", boot);
      window.removeEventListener("touchstart", boot);
      window.removeEventListener("keydown", boot);
    };
  }, []);

  return null;
}

const defaultSeo = buildMeta();

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
      { name: "theme-color", content: "#E8437F" },
      ...defaultSeo.meta,
    ],
    links: [
      { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
      { rel: "icon", type: "image/png", sizes: "192x192", href: "/icon-192.png" },
      { rel: "icon", type: "image/png", sizes: "512x512", href: "/icon-512.png" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,600..800&family=Plus+Jakarta+Sans:wght@500;600;700;800&family=Pixelify+Sans:wght@400;600;700&display=swap",
      },
      { rel: "stylesheet", href: appCss },
      { rel: "manifest", href: "/manifest.json" },
      { rel: "apple-touch-icon", href: "/icon-180.png" },
      { rel: "preload", as: "image", href: "/worlds/u1.webp?v=hd3", type: "image/webp", fetchPriority: "high" },
      ...defaultSeo.links,
    ],
  }),
  component: RootDocument,
});

function RootDocument() {
  return (
    <html lang="id" className="antialiased" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body className="bg-canvas text-ink-900 font-sans">
        <AuthProvider>
          <HydrationGate>
            <AudioEffectBridge />
            <Outlet />
          </HydrationGate>
        </AuthProvider>
        <Scripts />
      </body>
    </html>
  );
}
