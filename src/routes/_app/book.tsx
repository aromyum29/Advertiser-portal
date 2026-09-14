import { RouteError } from "@/advertiser/components/shell/RouteError";
import { createFileRoute } from "@tanstack/react-router";

import { BookingLayout } from "@/advertiser/components/funnel/BookingLayout";

export const Route = createFileRoute("/_app/book")({
  errorComponent: RouteError,
  component: BookingLayout,
});
