/**
 * The frame shared by every step of the booking.
 *
 * It owns the things that must be consistent across steps: which steps exist,
 * whether the current one can be left, what the primary button says and does,
 * and where to send someone who deep links further ahead than they have got.
 */
import { Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { createBooking } from "../../domain/bookings";
import { spaces as spacesLabel } from "../../domain/format";
import { useBookings } from "../../state/bookings";
import { useBookingDraft } from "../../state/booking-draft";
import {
  furthestAllowedStep,
  isStepComplete,
  nextStep,
  primaryActionLabel,
  stageFor,
  stepsFor,
  type StepId,
} from "../../state/funnel";
import { ConfirmDialog } from "./ConfirmDialog";
import { Stepper } from "./Stepper";
import { SummaryRail } from "./SummaryRail";

const STEP_FROM_PATH: Record<string, StepId> = {
  "/book/dates": "dates",
  "/book/positions": "positions",
  "/book/assets": "assets",
  "/book/payment": "payment",
};

export function BookingLayout() {
  const { draft, upload, restored, reset } = useBookingDraft();
  const { add, nextReference } = useBookings();
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  const [confirmOpen, setConfirmOpen] = useState(false);

  const steps = useMemo(() => stepsFor(draft), [draft]);
  const current = STEP_FROM_PATH[pathname];

  // The reference is fixed for the life of this draft, so the "held for 30 min"
  // note and the eventual booking agree.
  const reference = useMemo(() => nextReference(), [nextReference]);

  // Someone who lands further along than their draft supports — a bookmark, a
  // reload, a back button after clearing the basket — is moved to the step they
  // actually need to answer next.
  useEffect(() => {
    if (!current || !restored) return;
    if (draft.placementIds.length === 0) {
      void navigate({ to: "/", replace: true });
      return;
    }
    const allowed = furthestAllowedStep(draft, upload);
    const currentIndex = steps.findIndex((s) => s.id === current);
    const allowedIndex = steps.findIndex((s) => s.id === allowed.id);
    if (currentIndex > allowedIndex) void navigate({ to: allowed.path, replace: true });
  }, [current, restored, draft, upload, steps, navigate]);

  if (!current) return <Outlet />;

  const stepReady = isStepComplete(current, draft, upload);
  const next = nextStep(steps, current);

  const onPrimary = () => {
    if (!stepReady) return;
    if (next) {
      void navigate({ to: next.path });
      return;
    }
    // Last step: nothing is charged without an explicit second confirmation.
    setConfirmOpen(true);
  };

  const onConfirm = () => {
    setConfirmOpen(false);
    // Stored before the draft is cleared, so the confirmation page reads a real
    // booking rather than a draft that no longer exists.
    add(createBooking(draft, { reference }));
    reset();
    void navigate({ to: "/book/confirmation", search: { ref: reference }, replace: true });
  };

  return (
    <div className="mx-auto max-w-4xl space-y-8 pb-10">
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={() => void navigate({ to: "/" })}
          aria-label="Leave this booking and go back to Advertise"
          className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg border border-border bg-card transition-colors hover:border-gray-900 dark:hover:border-gray-200"
        >
          <ArrowLeft aria-hidden="true" className="h-4 w-4" />
        </button>
        <div>
          <h1 className="text-[26px] font-bold leading-tight tracking-tight">New booking</h1>
          <p className="mt-0.5 text-sm text-muted-foreground">
            {draft.placementIds.length > 1 ? `${spacesLabel(draft.placementIds.length)} · ` : ""}
            Pick dates, choose positions, then pay.
          </p>
        </div>
      </div>

      <Stepper steps={steps} current={current} />

      <div className="flex flex-col gap-7">
        <Outlet />

        <SummaryRail
          draft={draft}
          stage={stageFor(steps, current)}
          steps={steps}
          current={current}
          reference={reference}
          primaryLabel={primaryActionLabel(steps, current)}
          primaryDisabled={!stepReady}
          onPrimary={onPrimary}
        />
      </div>

      <ConfirmDialog
        open={confirmOpen}
        draft={draft}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={onConfirm}
      />
    </div>
  );
}
