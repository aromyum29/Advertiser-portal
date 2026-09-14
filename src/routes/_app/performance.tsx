import { RouteError } from "@/advertiser/components/shell/RouteError";
import { createFileRoute } from "@tanstack/react-router";

import { PerformancePage } from "@/advertiser/components/performance/PerformancePage";

export const Route = createFileRoute("/_app/performance")({
  head: () => ({ meta: [{ title: "Performance · Koko Advertiser Portal" }] }),
  errorComponent: RouteError,
  component: PerformancePage,
});
