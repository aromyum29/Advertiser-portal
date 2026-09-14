import { createFileRoute } from "@tanstack/react-router";
import App from "@/merchant/App";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Koko Merchant Portal" },
      { name: "description", content: "Koko Merchant Portal — accept BNPL payments, manage orders, and grow your store." },
    ],
  }),
  component: App,
});
