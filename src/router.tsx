import { createRouter } from "@tanstack/react-router";
import { AppErrorComponent, AppNotFound } from "@/lib/error-component";
import { routeTree } from "./routeTree.gen";
import { CandyLoader } from "@/components/ui/progress-bar";

export function RoutePending() {
  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center p-8 space-y-4">
      <CandyLoader size="lg" label="MEMUAT HALAMAN…" />
    </div>
  );
}

export function getRouter() {
  return createRouter({
    routeTree,
    defaultErrorComponent: AppErrorComponent,
    defaultNotFoundComponent: AppNotFound,
    defaultPendingComponent: RoutePending,
  });
}
