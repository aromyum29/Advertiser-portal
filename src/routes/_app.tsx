import { createFileRoute, Outlet } from "@tanstack/react-router";

import { AppShell } from "@/advertiser/components/shell/AppShell";
import { RequireSession } from "@/advertiser/components/shell/RequireSession";
import { BookingDraftProvider } from "@/advertiser/state/booking-draft";

/**
 * Everything behind the sign-in wall. The booking draft lives here rather than
 * inside the funnel so a selection made on the Advertise page is still there
 * when the advertiser starts booking.
 */
export const Route = createFileRoute("/_app")({
  component: AppLayout,
});

function AppLayout() {
  return (
    <RequireSession>
      <BookingDraftProvider>
        <AppShell>
          <Outlet />
        </AppShell>
      </BookingDraftProvider>
    </RequireSession>
  );
}
