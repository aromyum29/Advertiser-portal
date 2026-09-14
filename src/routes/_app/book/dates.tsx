import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/book/dates")({
  component: () => <div>dates</div>,
});
