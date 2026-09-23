import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/rantai")({
  beforeLoad: () => {
    throw redirect({ to: "/" });
  },
  component: () => null,
});
