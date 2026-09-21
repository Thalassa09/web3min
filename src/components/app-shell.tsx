import { useEffect, type ReactNode } from "react";
import { useNavigate, useRouterState } from "@tanstack/react-router";
import { BottomNav } from "@/components/bottom-nav";
import { SideNav } from "@/components/side-nav";
import { TopStatus } from "@/components/top-status";
import { primeAudio, setAudioEnabled } from "@/lib/audio";
import { rememberPath, locationHref } from "@/lib/continue-to";
import { useProgress } from "@/lib/store";

export function AppShell({ children, rail }: { children: ReactNode; rail?: ReactNode }) {
  const onboarded = useProgress((s) => s.onboarded);
  const introSeen = useProgress((s) => s.introSeen);
  const sound = useProgress((s) => s.sound);
  const navigate = useNavigate();
  const location = useRouterState({ select: (s) => s.location });
  const pathname = location.pathname;

  useEffect(() => {
    const href = locationHref({
      pathname,
      searchStr: location.searchStr,
      hash: location.hash,
    });
    if (!onboarded) {
      rememberPath(href);
      if (pathname !== "/onboarding" && pathname !== "/masuk") void navigate({ to: "/onboarding" });
    } else if (!introSeen && pathname !== "/intro") {
      rememberPath(href);
      void navigate({ to: "/intro" });
    }
  }, [onboarded, introSeen, pathname, location.hash, location.searchStr, navigate]);

  useEffect(() => {
    setAudioEnabled(sound);
  }, [sound]);

  useEffect(() => {
    const boot = () => {
      void primeAudio();
    };
    window.addEventListener("pointerdown", boot, { once: true });
    window.addEventListener("keydown", boot, { once: true });
    return () => {
      window.removeEventListener("pointerdown", boot);
      window.removeEventListener("keydown", boot);
    };
  }, []);

  if (!onboarded || !introSeen) return null;

  return (
    <div className="desk-shell hex-wash">
      <SideNav />
      <div className="desk-stage">
        <TopStatus />
        <div className={rail ? "desk-split" : "desk-split desk-split-solo"}>
          <div className="desk-center">{children}</div>
          {rail ? <aside className="desk-rail">{rail}</aside> : null}
        </div>
        <BottomNav />
      </div>
    </div>
  );
}
