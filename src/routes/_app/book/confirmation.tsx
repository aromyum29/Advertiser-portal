import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/book/confirmation")({
  component: () => <div>confirmation</div>,
});
