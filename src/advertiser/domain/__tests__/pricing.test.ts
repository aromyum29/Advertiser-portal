import { describe, expect, it } from "vitest";

import { FULL_PERIOD_DISCOUNT, getCampaign } from "../campaigns";
import { getPlacement, positionMultiplier } from "../inventory";
import {
  BUNDLE_DISCOUNT,
  campaignCost,
  campaignDayRate,
  dayFactor,
  dayRate,
  DESIGN_FEE,
  MONTH_DEAL,
  needsCreative,
  positionsComplete,
  quote,
  rangeCost,
  viewsPerDay,
  WEEK_DEAL,
  WEEKEND_FACTOR,
  weeklyBaseline,
} from "../pricing";
import type { BookingDraft } from "../types";

const draft = (overrides: Partial<BookingDraft> = {}): BookingDraft => ({
  placementIds: ["hero"],
  positions: {},
  startISO: null,
  endISO: null,
  durationDeal: null,
  campaigns: [],
  bundleApplied: false,
  creative: "koko",
  payment: "credit",
  ...overrides,
});

// A plain Wednesday, outside every campaign period.
const WEEKDAY = "2026-09-16";
const SATURDAY = "2026-09-19";
const SUNDAY = "2026-09-20";

describe("day factors", () => {
  it("is flat on an ordinary weekday", () => {
    expect(dayFactor(WEEKDAY)).toBe(1);
  });

  it("adds the weekend boost on Saturday and Sunday", () => {
    expect(dayFactor(SATURDAY)).toBe(WEEKEND_FACTOR);
    expect(dayFactor(SUNDAY)).toBe(WEEKEND_FACTOR);
  });

  it("uses the campaign multiple inside a campaign, and it wins over the weekend", () => {
    const blackFriday = getCampaign("black-friday");
    // 2026-11-28 is a Saturday inside Black Friday week.
    expect(dayFactor("2026-11-28")).toBe(blackFriday.multiple);
    expect(dayFactor("2026-11-28")).not.toBe(WEEKEND_FACTOR);
  });
});

describe("day rate", () => {
  it("is the base price when no position is chosen yet", () => {
    expect(dayRate(["hero"], {}, WEEKDAY)).toBe(getPlacement("hero").basePrice);
  });

  it("applies the hero position multiplier", () => {
    const hero = getPlacement("hero");
    expect(dayRate(["hero"], { hero: 1 }, WEEKDAY)).toBe(Math.round(hero.basePrice * 1.35));
    expect(dayRate(["hero"], { hero: 2 }, WEEKDAY)).toBe(Math.round(hero.basePrice * 1.15));
    expect(dayRate(["hero"], { hero: 5 }, WEEKDAY)).toBe(hero.basePrice);
  });

  it("leaves non-hero spaces flat across positions", () => {
    expect(positionMultiplier("trending", 1)).toBe(1);
    expect(dayRate(["trending"], { trending: 1 }, WEEKDAY)).toBe(
      dayRate(["trending"], { trending: 9 }, WEEKDAY),
    );
  });

  it("sums across every selected space", () => {
    expect(dayRate(["hero", "trending"], {}, WEEKDAY)).toBe(
      getPlacement("hero").basePrice + getPlacement("trending").basePrice,
    );
  });

  it("rounds per space per day, so totals are checkable by hand", () => {
    const expected =
      Math.round(getPlacement("hero").basePrice * WEEKEND_FACTOR) +
      Math.round(getPlacement("search").basePrice * WEEKEND_FACTOR);
    expect(dayRate(["hero", "search"], {}, SATURDAY)).toBe(expected);
  });
});

describe("range cost", () => {
  it("charges every day in the inclusive range", () => {
    const cost = rangeCost(["hero"], {}, WEEKDAY, "2026-09-18");
    expect(cost).toBe(getPlacement("hero").basePrice * 3);
  });

  it("charges a single day once", () => {
    expect(rangeCost(["hero"], {}, WEEKDAY, WEEKDAY)).toBe(getPlacement("hero").basePrice);
  });

  it("prices a week that crosses a weekend above a flat week", () => {
    // Mon 14 Sep to Sun 20 Sep contains one Saturday and one Sunday.
    const withWeekend = rangeCost(["hero"], {}, "2026-09-14", "2026-09-20");
    expect(withWeekend).toBeGreaterThan(getPlacement("hero").basePrice * 7);
  });
});

describe("campaign pricing", () => {
  const blackFriday = getCampaign("black-friday");

  it("prices campaign days at the campaign multiple", () => {
    expect(campaignDayRate(["hero"], {}, blackFriday.multiple)).toBe(
      Math.round(getPlacement("hero").basePrice * blackFriday.multiple),
    );
  });

  it("charges partial periods per day with no discount", () => {
    const perDay = campaignDayRate(["hero"], {}, blackFriday.multiple);
    expect(campaignCost(["hero"], {}, "black-friday", 3, false)).toBe(perDay * 3);
  });

  it("takes 15% off the whole period", () => {
    const perDay = campaignDayRate(["hero"], {}, blackFriday.multiple);
    expect(campaignCost(["hero"], {}, "black-friday", blackFriday.periodDays, true)).toBe(
      Math.round(perDay * blackFriday.periodDays * (1 - FULL_PERIOD_DISCOUNT)),
    );
  });

  it("makes the full period cheaper than buying every day separately", () => {
    const full = campaignCost(["hero"], {}, "black-friday", blackFriday.periodDays, true);
    const piecemeal = campaignCost(["hero"], {}, "black-friday", blackFriday.periodDays, false);
    expect(full).toBeLessThan(piecemeal);
  });
});

describe("views", () => {
  it("scales with the position multiplier", () => {
    const hero = getPlacement("hero");
    expect(viewsPerDay(["hero"], {})).toBe(hero.vpd);
    expect(viewsPerDay(["hero"], { hero: 1 })).toBeCloseTo(hero.vpd * 1.35);
  });

  it("quotes a seven-day baseline before any dates are picked", () => {
    expect(weeklyBaseline(["hero"], {}).views).toBe(getPlacement("hero").vpd * 7);
    expect(weeklyBaseline(["hero"], {}).price).toBe(getPlacement("hero").weekly);
  });

  it("multiplies campaign days by the campaign multiple", () => {
    const blackFriday = getCampaign("black-friday");
    const priced = quote(
      draft({ campaigns: [{ id: "black-friday", days: blackFriday.periodDays, full: true }] }),
    );
    expect(priced.views).toBe(
      Math.round(getPlacement("hero").vpd * blackFriday.periodDays * blackFriday.multiple),
    );
  });
});

describe("quote", () => {
  it("is zero until a period is chosen", () => {
    const priced = quote(draft());
    expect(priced.total).toBe(0);
    expect(priced.days).toBe(0);
    expect(priced.lines).toHaveLength(0);
  });

  it("is zero when no space is selected", () => {
    expect(quote(draft({ placementIds: [], startISO: WEEKDAY, endISO: WEEKDAY })).total).toBe(0);
  });

  it("adds the design fee only for spaces that need artwork", () => {
    expect(needsCreative(["hero"])).toBe(true);
    expect(needsCreative(["trending", "checkout"])).toBe(false);

    const banner = quote(draft({ startISO: WEEKDAY, endISO: WEEKDAY, payment: "card" }));
    expect(banner.designFee).toBe(DESIGN_FEE);

    const thumbnail = quote(
      draft({ placementIds: ["trending"], startISO: WEEKDAY, endISO: WEEKDAY, payment: "card" }),
    );
    expect(thumbnail.designFee).toBe(0);
  });

  it("drops the design fee when the advertiser uploads their own artwork", () => {
    const priced = quote(draft({ startISO: WEEKDAY, endISO: WEEKDAY, creative: "upload" }));
    expect(priced.designFee).toBe(0);
  });

  it("withholds the design fee until the assets step is reached", () => {
    const early = quote(draft({ startISO: WEEKDAY, endISO: WEEKDAY }), {
      includeDesignFee: false,
      includePaymentAdjustment: false,
    });
    expect(early.designFee).toBe(0);
    expect(early.total).toBe(early.mediaNet);
  });

  it("applies the duration deal to own dates only", () => {
    const base = draft({ startISO: "2026-09-14", endISO: "2026-09-20", payment: "card" });
    const plain = quote(base);
    const discounted = quote({ ...base, durationDeal: WEEK_DEAL });
    expect(discounted.durationSaving).toBe(plain.mediaGross - Math.round(plain.mediaGross * 0.95));
    expect(discounted.mediaNet).toBeLessThan(plain.mediaNet);
  });

  it("gives a bigger saving for a month than for a week", () => {
    const base = draft({ startISO: "2026-09-14", endISO: "2026-10-13", payment: "card" });
    const week = quote({ ...base, durationDeal: WEEK_DEAL });
    const month = quote({ ...base, durationDeal: MONTH_DEAL });
    expect(month.durationSaving).toBeGreaterThan(week.durationSaving);
    expect(month.total).toBeLessThan(week.total);
  });

  it("applies the bundle saving to all media cost, but only with two or more spaces", () => {
    const single = quote(
      draft({ startISO: WEEKDAY, endISO: WEEKDAY, bundleApplied: true, payment: "card" }),
    );
    expect(single.bundleSaving).toBe(0);

    const pair = draft({
      placementIds: ["hero", "checkout"],
      startISO: WEEKDAY,
      endISO: WEEKDAY,
      payment: "card",
    });
    const withBundle = quote({ ...pair, bundleApplied: true });
    expect(withBundle.bundleSaving).toBe(Math.round(quote(pair).mediaGross * BUNDLE_DISCOUNT));
  });

  it("stacks duration and bundle savings in the documented order", () => {
    const base = draft({
      placementIds: ["hero", "checkout"],
      startISO: "2026-09-14",
      endISO: "2026-09-20",
      durationDeal: WEEK_DEAL,
      bundleApplied: true,
      payment: "card",
    });
    const priced = quote(base);
    const afterDuration = priced.mediaGross - priced.durationSaving;
    // The bundle applies after the duration deal, not to the gross.
    expect(priced.bundleSaving).toBe(Math.round(afterDuration * BUNDLE_DISCOUNT));
    expect(priced.mediaNet).toBe(afterDuration - priced.bundleSaving);
  });

  it("adds a 5% fee on seller credit", () => {
    const base = draft({ startISO: WEEKDAY, endISO: WEEKDAY, payment: "credit" });
    const priced = quote(base);
    expect(priced.paymentFee).toBe(Math.round(priced.subtotal * 0.05));
    expect(priced.total).toBe(priced.subtotal + priced.paymentFee);
  });

  it("adds a 2% fee on card", () => {
    const priced = quote(draft({ startISO: WEEKDAY, endISO: WEEKDAY, payment: "card" }));
    expect(priced.paymentFee).toBe(Math.round(priced.subtotal * 0.02));
  });

  it("takes 2% off for JustPay", () => {
    const priced = quote(draft({ startISO: WEEKDAY, endISO: WEEKDAY, payment: "justpay" }));
    expect(priced.paymentDiscount).toBe(Math.round(priced.subtotal * 0.02));
    expect(priced.total).toBe(priced.subtotal - priced.paymentDiscount);
  });

  it("withholds the payment adjustment until the payment step", () => {
    const early = quote(draft({ startISO: WEEKDAY, endISO: WEEKDAY, payment: "credit" }), {
      includeDesignFee: true,
      includePaymentAdjustment: false,
    });
    expect(early.paymentFee).toBe(0);
    expect(early.total).toBe(early.subtotal);
  });

  it("combines own dates and a campaign week into one booking", () => {
    const blackFriday = getCampaign("black-friday");
    const priced = quote(
      draft({
        startISO: "2026-09-14",
        endISO: "2026-09-16",
        campaigns: [{ id: "black-friday", days: blackFriday.periodDays, full: true }],
        payment: "card",
      }),
    );
    expect(priced.days).toBe(3 + blackFriday.periodDays);
    expect(priced.campaignSaving).toBeGreaterThan(0);
  });

  it("never reports a total below zero or savings it did not give", () => {
    const priced = quote(draft({ startISO: WEEKDAY, endISO: WEEKDAY, payment: "justpay" }));
    expect(priced.total).toBeGreaterThan(0);
    expect(priced.totalSavings).toBe(
      priced.durationSaving + priced.campaignSaving + priced.bundleSaving,
    );
  });

  it("keeps the breakdown consistent with the total", () => {
    const priced = quote(
      draft({
        placementIds: ["hero", "checkout"],
        positions: { hero: 1, checkout: 3 },
        startISO: "2026-09-14",
        endISO: "2026-09-20",
        durationDeal: WEEK_DEAL,
        bundleApplied: true,
        payment: "credit",
      }),
    );
    const charges = priced.lines
      .filter((l) => l.kind !== "saving")
      .reduce((a, l) => a + l.amount, 0);
    const savings = priced.lines
      .filter((l) => l.kind === "saving")
      .reduce((a, l) => a + l.amount, 0);
    expect(charges - savings).toBe(priced.total);
  });
});

describe("step gating", () => {
  it("requires a position on every selected space", () => {
    expect(positionsComplete([], {})).toBe(false);
    expect(positionsComplete(["hero", "trending"], { hero: 1 })).toBe(false);
    expect(positionsComplete(["hero", "trending"], { hero: 1, trending: 4 })).toBe(true);
  });
});
