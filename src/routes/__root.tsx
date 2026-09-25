import { useEffect } from "react";
import { createRootRoute, HeadContent, Outlet, Scripts } from "@tanstack/react-router";
import { AuthProvider } from "@/lib/auth/provider";
import { HydrationGate } from "@/components/hydration-gate";
import { setAudioEnabled, primeAudio } from "@/lib/audio";
import { useProgress } from "@/lib/store";
import appCss from "../styles.css?url";

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

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
      { title: "web3min" },
      { name: "description", content: "Platform edukasi dan simulasi Web3 interaktif." },
      { name: "theme-color", content: "#E8437F" },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "web3min" },
      { property: "og:title", content: "web3min" },
      { property: "og:description", content: "Platform edukasi dan simulasi Web3 interaktif." },
      { property: "og:url", content: "https://web3min.com" },
      { property: "og:image", content: "https://web3min.com/og-image.png" },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "web3min" },
      { name: "twitter:description", content: "Platform edukasi dan simulasi Web3 interaktif." },
      { name: "twitter:image", content: "https://web3min.com/og-image.png" },
    ],
    links: [
      { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,600..800&family=Plus+Jakarta+Sans:wght@500;600;700;800&family=JetBrains+Mono:wght@600;700&family=Silkscreen:wght@400;700&family=Pixelify+Sans:wght@600;700&display=swap",
      },
      { rel: "stylesheet", href: appCss },
      { rel: "manifest", href: "/manifest.json" },
      { rel: "apple-touch-icon", href: "/icon-180.png" },
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
