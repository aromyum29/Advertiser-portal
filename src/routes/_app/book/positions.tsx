import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/book/positions")({
  component: () => <div>positions</div>,
});
