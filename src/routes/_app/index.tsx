import { RouteError } from "@/advertiser/components/shell/RouteError";
import { createFileRoute } from "@tanstack/react-router";

import { AdvertisePage } from "@/advertiser/components/AdvertisePage";

export const Route = createFileRoute("/_app/")({
  head: () => ({ meta: [{ title: "Advertise · Koko Advertiser Portal" }] }),
  errorComponent: RouteError,
  component: AdvertisePage,
});
