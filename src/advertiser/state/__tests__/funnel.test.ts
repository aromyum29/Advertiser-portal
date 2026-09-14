import { describe, expect, it } from "vitest";

import type { CreativeUpload } from "../../domain/creative";
import type { BookingDraft } from "../../domain/types";
import { EMPTY_DRAFT } from "../booking-draft";
import {
  furthestAllowedStep,
  isStepComplete,
  nextStep,
  previousStep,
  primaryActionLabel,
  stageFor,
  stepsFor,
} from "../funnel";

const banner: BookingDraft = { ...EMPTY_DRAFT, placementIds: ["hero"] };
const thumbnail: BookingDraft = { ...EMPTY_DRAFT, placementIds: ["trending"] };
const passed: CreativeUpload = { name: "ad.png", states: [], done: true, passed: true };

describe("which steps exist", () => {
  it("includes assets when a space needs artwork", () => {
    expect(stepsFor(banner).map((s) => s.id)).toEqual(["dates", "positions", "assets", "payment"]);
  });

  it("skips assets when the store thumbnail is the creative", () => {
    expect(stepsFor(thumbnail).map((s) => s.id)).toEqual(["dates", "positions", "payment"]);
  });
});

describe("step completion", () => {
  it("needs a period before leaving dates", () => {
    expect(isStepComplete("dates", banner, null)).toBe(false);
    expect(isStepComplete("dates", { ...banner, startISO: "2026-10-05", endISO: "2026-10-07" }, null)).toBe(true);
    expect(isStepComplete("dates", { ...banner, campaigns: [{ id: "black-friday", days: 8, full: true }] }, null)).toBe(true);
  });

  it("needs a position on every space before leaving positions", () => {
    expect(isStepComplete("positions", banner, null)).toBe(false);
    expect(isStepComplete("positions", { ...banner, positions: { hero: 1 } }, null)).toBe(true);
  });

  it("lets Koko-designed artwork through, but holds a failed upload", () => {
    expect(isStepComplete("assets", banner, null)).toBe(true);
    expect(isStepComplete("assets", { ...banner, creative: "upload" }, null)).toBe(false);
    expect(isStepComplete("assets", { ...banner, creative: "upload" }, passed)).toBe(true);
    expect(
      isStepComplete("assets", { ...banner, creative: "upload" }, { ...passed, passed: false }),
    ).toBe(false);
  });
});

describe("where a deep link lands", () => {
  it("sends an empty draft back to dates", () => {
    expect(furthestAllowedStep(banner, null).id).toBe("dates");
  });

  it("advances as each requirement is met", () => {
    const dated = { ...banner, startISO: "2026-10-05", endISO: "2026-10-07" };
    expect(furthestAllowedStep(dated, null).id).toBe("positions");
  });

  it("lets a default Koko-designed booking through assets, since it needs no input", () => {
    const dated = { ...banner, startISO: "2026-10-05", endISO: "2026-10-07", positions: { hero: 1 } };
    expect(furthestAllowedStep(dated, null).id).toBe("payment");
  });

  it("stops at assets once the advertiser opts into uploading their own", () => {
    const uploading = {
      ...banner,
      startISO: "2026-10-05",
      endISO: "2026-10-07",
      positions: { hero: 1 },
      creative: "upload" as const,
    };
    expect(furthestAllowedStep(uploading, null).id).toBe("assets");
    expect(furthestAllowedStep(uploading, passed).id).toBe("payment");
  });

  it("reaches payment once everything before it is done", () => {
    const ready = { ...banner, startISO: "2026-10-05", endISO: "2026-10-07", positions: { hero: 1 } };
    expect(furthestAllowedStep(ready, null).id).toBe("payment");
  });
});

describe("navigation", () => {
  const steps = stepsFor(banner);

  it("knows the way forward and back", () => {
    expect(nextStep(steps, "dates")?.id).toBe("positions");
    expect(previousStep(steps, "positions")?.id).toBe("dates");
    expect(previousStep(steps, "dates")).toBeNull();
    expect(nextStep(steps, "payment")).toBeNull();
  });

  it("names the destination on the primary button", () => {
    expect(primaryActionLabel(steps, "dates")).toBe("Continue to positions");
    expect(primaryActionLabel(steps, "payment")).toBe("Confirm and pay");
  });

  it("skips the missing assets step when naming the next one", () => {
    expect(primaryActionLabel(stepsFor(thumbnail), "positions")).toBe("Continue to payment");
  });
});

describe("progressive price reveal", () => {
  const steps = stepsFor(banner);

  it("hides the design fee until assets is on screen", () => {
    expect(stageFor(steps, "dates").includeDesignFee).toBe(false);
    expect(stageFor(steps, "assets").includeDesignFee).toBe(true);
    expect(stageFor(steps, "payment").includeDesignFee).toBe(true);
  });

  it("hides payment adjustments until the payment step", () => {
    expect(stageFor(steps, "assets").includePaymentAdjustment).toBe(false);
    expect(stageFor(steps, "payment").includePaymentAdjustment).toBe(true);
  });

  it("never reveals a design fee for a booking that has no assets step", () => {
    const noAssets = stepsFor(thumbnail);
    expect(stageFor(noAssets, "payment").includeDesignFee).toBe(false);
  });
});
