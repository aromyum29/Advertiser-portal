import { createFileRoute } from "@tanstack/react-router";

import { PaymentStep } from "@/advertiser/components/funnel/PaymentStep";

export const Route = createFileRoute("/_app/book/payment")({
  head: () => ({ meta: [{ title: "Payment · New booking" }] }),
  component: PaymentStep,
});
