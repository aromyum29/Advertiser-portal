import { createFileRoute } from "@tanstack/react-router";

import { PositionsStep } from "@/advertiser/components/funnel/PositionsStep";

export const Route = createFileRoute("/_app/book/positions")({
  head: () => ({ meta: [{ title: "Positions · New booking" }] }),
  component: PositionsStep,
});
