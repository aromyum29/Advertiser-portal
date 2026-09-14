import { createFileRoute } from "@tanstack/react-router";

import { AdvertisePage } from "@/advertiser/components/AdvertisePage";

export const Route = createFileRoute("/_app/")({
  head: () => ({ meta: [{ title: "Advertise · Koko Advertiser Portal" }] }),
  component: AdvertisePage,
});
