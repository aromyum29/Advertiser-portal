import { createFileRoute } from "@tanstack/react-router";

import { ConfirmationPage } from "@/advertiser/components/funnel/ConfirmationPage";

export const Route = createFileRoute("/_app/book/confirmation")({
  /** Which booking to show. Set when the funnel completes. */
  validateSearch: (search: Record<string, unknown>): { ref?: string } => ({
    ref: typeof search.ref === "string" ? search.ref : undefined,
  }),
  head: () => ({ meta: [{ title: "Booking confirmed · Koko Advertiser Portal" }] }),
  component: ConfirmationPage,
});
