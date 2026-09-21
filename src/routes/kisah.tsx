import { Outlet, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/kisah")({ component: KisahLayout });

function KisahLayout() {
  return <Outlet />;
}
