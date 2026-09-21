import { useEffect, useState, type ReactNode } from "react";
import { useProgress } from "@/lib/store";
import { BootScreen } from "@/components/boot-screen";

function applyMotion(on: boolean) {
  if (typeof document === "undefined") return;
  const prefer = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  document.documentElement.classList.toggle("reduce-motion", on || prefer);
}

export function HydrationGate({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let mounted = true;
    const finish = () => {
      if (!mounted) return;
      try {
        useProgress.getState().tick();
        applyMotion(useProgress.getState().reduceMotion);
      } catch {}
      setReady(true);
    };

    try {
      const p = useProgress.persist?.rehydrate?.();
      void Promise.resolve(p).then(finish).catch(finish);
    } catch {
      finish();
    }

    // Guard timeout: never let users get stuck on BootScreen
    const timer = window.setTimeout(finish, 200);

    return () => {
      mounted = false;
      window.clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    if (!ready) return;
    const id = window.setInterval(() => useProgress.getState().tick(), 30000);
    const unsub = useProgress.subscribe((s, prev) => {
      if (s.reduceMotion !== prev.reduceMotion) applyMotion(s.reduceMotion);
    });
    return () => {
      window.clearInterval(id);
      unsub();
    };
  }, [ready]);

  if (!ready) return <BootScreen />;

  return children;
}
