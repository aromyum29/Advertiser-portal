import { describe, expect, it } from "vitest";

import {
  createBooking,
  describeDates,
  describeDatesShort,
  describePlacements,
  nextReference,
  summarise,
  SEED_BOOKINGS,
} from "../bookings";
import type { BookingDraft } from "../types";

const draft = (overrides: Partial<BookingDraft> = {}): BookingDraft => ({
  placementIds: ["hero"],
  positions: { hero: 2 },
  startISO: "2026-10-05",
  endISO: "2026-10-11",
  durationDeal: null,
  campaigns: [],
  bundleApplied: false,
  creative: "koko",
  payment: "card",
  ...overrides,
});

describe("describing a booking", () => {
  it("names the hero by its position alone, and other spaces by name", () => {
    expect(describePlacements(["hero"], { hero: 2 })).toBe("Hero banner 2");
    expect(describePlacements(["trending"], { trending: 4 })).toBe("Trending Card 4");
  });

  it("lists every selected space", () => {
    expect(describePlacements(["hero", "checkout"], { hero: 1, checkout: 3 })).toBe(
      "Hero banner 1, Post-checkout card Card 3",
    );
  });

  it("falls back to the unit when no position is picked", () => {
    expect(describePlacements(["trending"], {})).toBe("Trending Card");
  });

  it("says so plainly when no dates are chosen", () => {
    expect(describeDates(draft({ startISO: null, endISO: null }))).toBe("Not chosen yet");
    expect(describeDatesShort(draft({ startISO: null, endISO: null }))).toBe("Not picked");
  });

  it("joins own dates and campaign weeks", () => {
    const withBoth = draft({ campaigns: [{ id: "black-friday", days: 8, full: true }] });
    expect(describeDates(withBoth)).toContain("Black Friday");
    expect(describeDates(withBoth)).toContain("From 5th October 2026");
    expect(describeDatesShort(withBoth)).toContain("Black Friday (23 to 30 Nov 2026)");
  });

  it("shows partial campaign take-up as days of the period", () => {
    expect(
      describeDatesShort(
        draft({
          startISO: null,
          endISO: null,
          campaigns: [{ id: "black-friday", days: 3, full: false }],
        }),
      ),
    ).toBe("Black Friday (3 of 8 days)");
  });
});

describe("references", () => {
  it("increases with the number of bookings already made", () => {
    expect(nextReference(0)).toBe("KAD-1084");
    expect(nextReference(3)).toBe("KAD-1087");
  });
});

describe("creating a booking", () => {
  it("records what the advertiser was actually charged", () => {
    const booking = createBooking(draft(), { reference: "KAD-1084" });
    expect(booking.reference).toBe("KAD-1084");
    expect(booking.spend).toBeGreaterThan(0);
    expect(booking.days).toBe(7);
  });

  it("confirms Koko-designed artwork straight away", () => {
    expect(createBooking(draft(), { reference: "KAD-1084" }).status).toBe("confirmed");
  });

  it("holds an uploaded creative as pending review", () => {
    const booking = createBooking(draft({ creative: "upload" }), { reference: "KAD-1084" });
    expect(booking.status).toBe("pending");
    expect(booking.result).toMatch(/review/i);
  });

  it("confirms straight away when the space needs no artwork", () => {
    const booking = createBooking(
      draft({ placementIds: ["trending"], positions: { trending: 4 }, creative: "upload" }),
      { reference: "KAD-1084" },
    );
    expect(booking.status).toBe("confirmed");
  });

  it("does not share mutable state with the draft it came from", () => {
    const source = draft();
    const booking = createBooking(source, { reference: "KAD-1084" });
    expect(booking.positions).not.toBe(source.positions);
    expect(booking.placementIds).not.toBe(source.placementIds);
  });
});

describe("summary strip", () => {
  it("counts each status and totals the spend", () => {
    const summary = summarise(SEED_BOOKINGS);
    expect(summary.live).toBe(1);
    expect(summary.pending).toBe(1);
    expect(summary.completed).toBe(1);
    expect(summary.totalSpend).toBe(129_500 + 53_200 + 9_800);
  });

  it("handles an empty history", () => {
    expect(summarise([])).toEqual({
      live: 0,
      pending: 0,
      completed: 0,
      confirmed: 0,
      totalSpend: 0,
    });
  });
});
