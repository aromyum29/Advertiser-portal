import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/book/payment")({
  component: () => <div>payment</div>,
});
