import { RouteError } from "@/advertiser/components/shell/RouteError";
import { createFileRoute } from "@tanstack/react-router";

import { BookingsPage } from "@/advertiser/components/bookings/BookingsPage";

export const Route = createFileRoute("/_app/bookings")({
  head: () => ({ meta: [{ title: "My bookings · Koko Advertiser Portal" }] }),
  errorComponent: RouteError,
  component: BookingsPage,
});
