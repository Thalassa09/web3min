import { useEffect } from "react";
import { createRootRoute, HeadContent, Outlet, Scripts } from "@tanstack/react-router";
import { AuthProvider } from "@/lib/auth/provider";
import { PreviewHostBridge } from "@/components/preview-host-bridge";
import { HydrationGate } from "@/components/hydration-gate";
import { setAudioEnabled, primeAudio } from "@/lib/audio";
import { useProgress } from "@/lib/store";
import appCss from "../styles.css?url";

const APP_NAME = "web3min";

function AudioEffectBridge() {
  const sound = useProgress((s) => s.sound);

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
      { title: APP_NAME },
      { name: "description", content: "Belajar Web3 bareng web3min. Santai, berjenjang, bahasa orang." },
      { name: "theme-color", content: "#0B63F6" },
    ],
    links: [
      { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Fredoka:wght@500;600;700&family=JetBrains+Mono:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Bricolage+Grotesque:opsz,wght@12..96,600;700;800&display=swap",
      },
      { rel: "stylesheet", href: appCss },
      { rel: "manifest", href: "/__grok/manifest.webmanifest" },
      { rel: "apple-touch-icon", href: "/__grok/icon-180.png" },
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
      <body className="bg-bg text-fg font-sans">
        <PreviewHostBridge />
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
