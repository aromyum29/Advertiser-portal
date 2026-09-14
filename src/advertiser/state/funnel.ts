/**
 * The shape of the booking funnel: which steps exist for a given selection,
 * what each one needs before it can be left, and where an advertiser who deep
 * links too far ahead should land instead.
 */
import { hasPeriod, needsCreative, positionsComplete } from "../domain/pricing";
import type { BookingDraft } from "../domain/types";
import type { CreativeUpload } from "../domain/creative";

export type StepId = "dates" | "positions" | "assets" | "payment";

export interface Step {
  readonly id: StepId;
  readonly label: string;
  readonly path: string;
}

const ALL_STEPS: Record<StepId, Step> = {
  dates: { id: "dates", label: "Select dates", path: "/book/dates" },
  positions: { id: "positions", label: "Positions", path: "/book/positions" },
  assets: { id: "assets", label: "Assets", path: "/book/assets" },
  payment: { id: "payment", label: "Payment", path: "/book/payment" },
};

/**
 * Steps for this booking. Assets only exists when something in the selection
 * needs artwork; a booking made entirely of store thumbnails skips it.
 */
export const stepsFor = (draft: BookingDraft): Step[] => [
  ALL_STEPS.dates,
  ALL_STEPS.positions,
  ...(needsCreative(draft.placementIds) ? [ALL_STEPS.assets] : []),
  ALL_STEPS.payment,
];

/** Whether a step's requirements are met, which is what unlocks the one after it. */
export const isStepComplete = (
  step: StepId,
  draft: BookingDraft,
  upload: CreativeUpload | null,
): boolean => {
  switch (step) {
    case "dates":
      return hasPeriod(draft);
    case "positions":
      return positionsComplete(draft.placementIds, draft.positions);
    case "assets":
      return draft.creative === "koko" || Boolean(upload?.passed);
    case "payment":
      return true;
  }
};

/**
 * The furthest step the advertiser has legitimately reached. Deep links beyond
 * it redirect back here rather than showing a payment page for an empty basket.
 */
export const furthestAllowedStep = (draft: BookingDraft, upload: CreativeUpload | null): Step => {
  const steps = stepsFor(draft);
  for (const step of steps) {
    if (!isStepComplete(step.id, draft, upload)) return step;
  }
  return steps[steps.length - 1];
};

export const stepIndex = (steps: readonly Step[], id: StepId): number =>
  steps.findIndex((step) => step.id === id);

/** The step before this one, or null at the start of the funnel. */
export const previousStep = (steps: readonly Step[], id: StepId): Step | null => {
  const index = stepIndex(steps, id);
  return index > 0 ? steps[index - 1] : null;
};

/** The step after this one, or null on the last step. */
export const nextStep = (steps: readonly Step[], id: StepId): Step | null => {
  const index = stepIndex(steps, id);
  return index >= 0 && index < steps.length - 1 ? steps[index + 1] : null;
};

/** Label for the primary button, which always names where it goes. */
export const primaryActionLabel = (steps: readonly Step[], id: StepId): string => {
  const next = nextStep(steps, id);
  return next ? `Continue to ${next.label.toLowerCase()}` : "Confirm and pay";
};

/** Which parts of the price are revealed by the time this step is on screen. */
export const stageFor = (steps: readonly Step[], id: StepId) => {
  const index = stepIndex(steps, id);
  const assets = stepIndex(steps, "assets");
  const payment = stepIndex(steps, "payment");
  return {
    // No assets step means the fee never applies, so it is never revealed.
    includeDesignFee: assets >= 0 && index >= assets,
    includePaymentAdjustment: index >= payment,
  };
};
