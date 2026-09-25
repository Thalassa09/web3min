import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/bubble")({
  beforeLoad: () => {
    throw redirect({ to: "/" });
  },
  component: () => null,
});
