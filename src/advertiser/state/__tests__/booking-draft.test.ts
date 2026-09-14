import { describe, expect, it } from "vitest";

import { bookedDates, LEAD_DAYS } from "../../domain/availability";
import { addDaysISO } from "../../domain/dates";
import { WEEK_DEAL } from "../../domain/pricing";
import { campaignDaysTaken, durationUpsell, EMPTY_DRAFT, reducer } from "../booking-draft";
import type { BookingDraft } from "../../domain/types";

const apply = (draft: BookingDraft, ...actions: Parameters<typeof reducer>[1][]) =>
  actions.reduce(reducer, draft);

describe("selecting spaces", () => {
  it("toggles a space on and off", () => {
    const on = reducer(EMPTY_DRAFT, { type: "toggleSpace", id: "hero" });
    expect(on.placementIds).toEqual(["hero"]);
    expect(reducer(on, { type: "toggleSpace", id: "hero" }).placementIds).toEqual([]);
  });

  it("does not add the same space twice", () => {
    const twice = apply(
      EMPTY_DRAFT,
      { type: "addSpace", id: "hero" },
      { type: "addSpace", id: "hero" },
    );
    expect(twice.placementIds).toEqual(["hero"]);
  });

  it("forgets the position when its space is removed", () => {
    const draft = apply(
      EMPTY_DRAFT,
      { type: "addSpace", id: "hero" },
      { type: "setPosition", id: "hero", position: 2 },
      { type: "removeSpace", id: "hero" },
    );
    expect(draft.positions.hero).toBeUndefined();
  });

  it("cancels the bundle when the selection drops back to one space", () => {
    const bundled = apply(
      EMPTY_DRAFT,
      { type: "addSpace", id: "hero" },
      { type: "applyBundle", partner: "checkout" },
    );
    expect(bundled.bundleApplied).toBe(true);
    expect(reducer(bundled, { type: "removeSpace", id: "checkout" }).bundleApplied).toBe(false);
  });

  it("keeps the bundle when three spaces drop to two", () => {
    const draft = apply(
      EMPTY_DRAFT,
      { type: "addSpace", id: "hero" },
      { type: "addSpace", id: "trending" },
      { type: "applyBundle", partner: "checkout" },
      { type: "removeSpace", id: "trending" },
    );
    expect(draft.bundleApplied).toBe(true);
  });

  it("clears everything selection-related at once", () => {
    const draft = apply(
      EMPTY_DRAFT,
      { type: "addSpace", id: "hero" },
      { type: "setPosition", id: "hero", position: 1 },
      { type: "applyBundle", partner: "checkout" },
      { type: "clearSpaces" },
    );
    expect(draft).toMatchObject({ placementIds: [], positions: {}, bundleApplied: false });
  });

  it("takes the bundle without duplicating a partner already selected", () => {
    const draft = apply(
      EMPTY_DRAFT,
      { type: "addSpace", id: "hero" },
      { type: "addSpace", id: "checkout" },
      { type: "applyBundle", partner: "checkout" },
    );
    expect(draft.placementIds).toEqual(["hero", "checkout"]);
    expect(draft.bundleApplied).toBe(true);
  });
});

describe("dates", () => {
  const dated: BookingDraft = {
    ...EMPTY_DRAFT,
    startISO: "2026-10-05",
    endISO: "2026-10-08",
    durationDeal: WEEK_DEAL,
  };

  it("drops a duration deal when the range changes", () => {
    const changed = reducer(dated, { type: "setRange", startISO: "2026-10-06", endISO: null });
    expect(changed.durationDeal).toBeNull();
    expect(changed.endISO).toBeNull();
  });

  it("keeps the deal when the range is extended by taking the upsell", () => {
    const extended = reducer(
      { ...dated, durationDeal: null },
      { type: "extendTo", endISO: "2026-10-11", deal: WEEK_DEAL },
    );
    expect(extended.durationDeal).toEqual(WEEK_DEAL);
    expect(extended.endISO).toBe("2026-10-11");
  });

  it("clears both ends and the deal together", () => {
    expect(reducer(dated, { type: "clearDates" })).toMatchObject({
      startISO: null,
      endISO: null,
      durationDeal: null,
    });
  });
});

describe("campaigns", () => {
  it("replaces the previous campaign, because a booking takes one", () => {
    const draft = apply(
      EMPTY_DRAFT,
      { type: "selectCampaign", id: "black-friday", days: 8, full: true },
      { type: "selectCampaign", id: "christmas", days: 4, full: false },
    );
    expect(draft.campaigns).toEqual([{ id: "christmas", days: 4, full: false }]);
  });

  it("removes a campaign by id", () => {
    const draft = apply(
      EMPTY_DRAFT,
      { type: "selectCampaign", id: "black-friday", days: 8, full: true },
      { type: "removeCampaign", id: "black-friday" },
    );
    expect(draft.campaigns).toEqual([]);
  });
});

describe("duration upsell", () => {
  // Far enough ahead that neither lead time nor the simulated occupancy
  // interferes, so these cases test the length rules on their own.
  const TODAY = "2026-09-14";

  it("offers a full week on a short booking", () => {
    expect(
      durationUpsell({ ...EMPTY_DRAFT, startISO: "2026-10-05", endISO: "2026-10-07" }, TODAY)?.deal,
    ).toEqual(WEEK_DEAL);
  });

  it("names the day the extended range would end on", () => {
    expect(
      durationUpsell({ ...EMPTY_DRAFT, startISO: "2026-10-05", endISO: "2026-10-07" }, TODAY)
        ?.endISO,
    ).toBe("2026-10-11");
  });

  it("offers nothing on an exact week, which already earned its deal", () => {
    expect(
      durationUpsell({ ...EMPTY_DRAFT, startISO: "2026-10-05", endISO: "2026-10-11" }, TODAY),
    ).toBeNull();
  });

  it("offers a full month between eight and twenty-one days", () => {
    expect(
      durationUpsell({ ...EMPTY_DRAFT, startISO: "2026-10-05", endISO: "2026-10-12" }, TODAY)?.days,
    ).toBe(30);
    expect(
      durationUpsell({ ...EMPTY_DRAFT, startISO: "2026-10-05", endISO: "2026-10-25" }, TODAY)?.days,
    ).toBe(30);
  });

  it("leaves a long booking alone", () => {
    expect(
      durationUpsell({ ...EMPTY_DRAFT, startISO: "2026-10-05", endISO: "2026-10-30" }, TODAY),
    ).toBeNull();
  });

  it("offers nothing without a complete range", () => {
    expect(
      durationUpsell({ ...EMPTY_DRAFT, startISO: "2026-10-05", endISO: null }, TODAY),
    ).toBeNull();
  });

  it("does not offer a week that would run over a day someone else booked", () => {
    // Occupancy sits at today+7, so a booking starting at today+3 would have to
    // cross it to reach seven days.
    const start = addDaysISO(TODAY, LEAD_DAYS);
    const draft = { ...EMPTY_DRAFT, startISO: start, endISO: addDaysISO(start, 2) };
    expect(bookedDates(TODAY)).toContain(addDaysISO(start, 4));
    expect(durationUpsell(draft, TODAY)).toBeNull();
  });

  it("still offers the week when the extended range is clear", () => {
    // Starting past both occupied days, a full week has nothing in its way.
    const start = addDaysISO(TODAY, 14);
    const draft = { ...EMPTY_DRAFT, startISO: start, endISO: addDaysISO(start, 2) };
    expect(durationUpsell(draft, TODAY)?.deal).toEqual(WEEK_DEAL);
  });
});

describe("campaign chip range", () => {
  it("counts a single chip as one day", () => {
    expect(campaignDaysTaken("black-friday", 0, null)).toBe(1);
  });

  it("counts both ends of a chip range", () => {
    expect(campaignDaysTaken("black-friday", 1, 4)).toBe(4);
  });

  it("never exceeds the length of the period", () => {
    expect(campaignDaysTaken("black-friday", 0, 99)).toBe(8);
  });

  it("is zero before anything is picked", () => {
    expect(campaignDaysTaken("black-friday", null, null)).toBe(0);
  });
});

describe("reset", () => {
  it("returns to an empty draft", () => {
    const draft = apply(
      EMPTY_DRAFT,
      { type: "addSpace", id: "hero" },
      { type: "setPayment", method: "justpay" },
      { type: "reset" },
    );
    expect(draft).toEqual(EMPTY_DRAFT);
  });
});
