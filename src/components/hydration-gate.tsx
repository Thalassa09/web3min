import { useEffect, useState, type ReactNode } from "react";
import { useProgress } from "@/lib/store";
import { supabase } from "@/lib/supabase";
import { syncProgressFromServer } from "@/lib/server-sync";
import { BootScreen } from "@/components/boot-screen";

function applyMotion(on: boolean) {
  if (typeof document === "undefined") return;
  const prefer = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isReduced = on || prefer;
  document.documentElement.classList.toggle("reduce-motion", isReduced);
  document.documentElement.dataset.motion = isReduced ? "reduced" : "full";
}

export function HydrationGate({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let mounted = true;
    let hydrated = false;
    const finish = () => {
      if (!mounted || hydrated) return;
      hydrated = true;
      try {
        useProgress.getState().tick();
        applyMotion(useProgress.getState().reduceMotion);
      } catch {}
      setReady(true);
    };

    try {
      const p = useProgress.persist?.rehydrate?.();
      if (p && typeof p.then === "function") {
        void p.then(finish).catch(finish);
      } else {
        finish();
      }
    } catch {
      finish();
    }

    // Fallback timer: ensure the app boots even if storage is slow or blocked
    const timer = window.setTimeout(finish, 1200);

    return () => {
      mounted = false;
      window.clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    if (!ready) return;
    if (!supabase) return;
    void supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) void syncProgressFromServer();
    });
  }, [ready]);

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
