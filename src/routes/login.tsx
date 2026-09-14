import { createFileRoute } from "@tanstack/react-router";

import { LoginPage } from "@/advertiser/components/shell/LoginPage";

export const Route = createFileRoute("/login")({
  /** Where to return to after signing in, set by the guard that sent them here. */
  validateSearch: (search: Record<string, unknown>): { redirect?: string } => ({
    redirect: typeof search.redirect === "string" ? search.redirect : undefined,
  }),
  head: () => ({ meta: [{ title: "Sign in \u00b7 Koko Advertiser Portal" }] }),
  component: LoginPage,
});
