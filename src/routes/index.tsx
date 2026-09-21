import { useEffect } from "react";
import { createFileRoute, useRouterState } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { CoachTour } from "@/components/coach";
import { DeskRail } from "@/components/desk-rail";
import { HomeDock } from "@/components/home-dock";
import { PathMap } from "@/components/path-map";
import { UNITS } from "@/lib/curriculum";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  const hash = useRouterState({ select: (s) => s.location.hash });
  const raw = hash.replace(/^#/, "");
  const focus = raw || null;
  const unitId = raw.startsWith("unit-") ? raw.slice(5) : null;

  useEffect(() => {
    if (!focus) return;
    const el = document.getElementById(focus);
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
    el.classList.add("unit-flash");
    const t = window.setTimeout(() => el.classList.remove("unit-flash"), 1200);
    return () => window.clearTimeout(t);
  }, [focus, unitId]);

  return (
    <AppShell rail={<DeskRail />}>
      <main className="space-y-4 pb-[calc(6rem+env(safe-area-inset-bottom))] sm:pb-28">
        <HomeDock />
        <PathMap units={UNITS} focusUnit={unitId} />
      </main>
      <CoachTour />
    </AppShell>
  );
}
