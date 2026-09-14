import { createFileRoute } from "@tanstack/react-router";

import MerchantApp from "@/merchant/App";

/**
 * The original merchant portal prototype, kept as a reference for the design
 * language the advertiser portal grew out of. Not part of the product.
 */
export const Route = createFileRoute("/merchant")({
  head: () => ({ meta: [{ title: "Merchant portal reference" }] }),
  component: MerchantApp,
});
