import { createFileRoute } from "@tanstack/react-router";

import { AssetsStep } from "@/advertiser/components/funnel/AssetsStep";

export const Route = createFileRoute("/_app/book/assets")({
  head: () => ({ meta: [{ title: "Assets · New booking" }] }),
  component: AssetsStep,
});
