import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/wardrobe")({
  beforeLoad: () => {
    throw redirect({ to: "/shop", search: { tab: "wardrobe" } });
  },
  component: () => null,
});
