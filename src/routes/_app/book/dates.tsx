import { createFileRoute } from "@tanstack/react-router";

import { DatesStep } from "@/advertiser/components/funnel/DatesStep";

export const Route = createFileRoute("/_app/book/dates")({
  head: () => ({ meta: [{ title: "Select dates · New booking" }] }),
  component: DatesStep,
});
