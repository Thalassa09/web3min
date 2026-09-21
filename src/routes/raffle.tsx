import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/raffle")({
  beforeLoad: () => {
    throw redirect({ to: "/leaderboard" });
  },
  component: () => null,
});
