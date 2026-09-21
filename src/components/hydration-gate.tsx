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
    void Promise.resolve(useProgress.persist.rehydrate()).then(() => {
      useProgress.getState().tick();
      applyMotion(useProgress.getState().reduceMotion);
      setReady(true);
    });
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
