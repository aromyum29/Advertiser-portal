import { describe, expect, it } from "vitest";

import {
  anchorForMonth,
  blockedReason,
  bookedDates,
  buildCalendar,
  CALENDAR_WINDOW,
  earliestStart,
  LEAD_DAYS,
  validateRange,
} from "../availability";
import { addDaysISO } from "../dates";

const TODAY = "2026-09-14";

describe("lead time", () => {
  it("blocks today and the next two days", () => {
    expect(blockedReason(TODAY, TODAY)).toBe("lead");
    expect(blockedReason(addDaysISO(TODAY, 1), TODAY)).toBe("lead");
    expect(blockedReason(addDaysISO(TODAY, LEAD_DAYS - 1), TODAY)).toBe("lead");
  });

  it("opens up on the first day past the lead window", () => {
    expect(blockedReason(addDaysISO(TODAY, LEAD_DAYS), TODAY)).toBeNull();
    expect(earliestStart(TODAY)).toBe(addDaysISO(TODAY, LEAD_DAYS));
  });

  it("does not block dates in the past, which the window never shows anyway", () => {
    expect(blockedReason(addDaysISO(TODAY, -1), TODAY)).toBeNull();
  });
});

describe("occupied days", () => {
  it("reports the simulated booked days as blocked", () => {
    for (const iso of bookedDates(TODAY)) {
      expect(blockedReason(iso, TODAY)).toBe("booked");
    }
  });
});

describe("range validation", () => {
  const open = addDaysISO(TODAY, LEAD_DAYS);

  it("accepts a clear range", () => {
    expect(validateRange(open, addDaysISO(TODAY, 6), TODAY)).toBeNull();
  });

  it("rejects a range that starts inside the lead window", () => {
    expect(validateRange(TODAY, addDaysISO(TODAY, 5), TODAY)).toEqual({
      kind: "lead",
      earliestISO: earliestStart(TODAY),
    });
  });

  it("rejects a range that ends on a booked day", () => {
    const booked = bookedDates(TODAY)[0];
    expect(validateRange(open, booked, TODAY)).toEqual({ kind: "booked", iso: booked });
  });

  it("rejects a range that steps over a booked day", () => {
    const booked = bookedDates(TODAY)[0];
    expect(validateRange(open, addDaysISO(booked, 2), TODAY)).toEqual({ kind: "crosses-booked" });
  });
});

describe("calendar window", () => {
  const calendar = buildCalendar(TODAY, TODAY, ["hero"], {});

  it("shows a fixed window starting today", () => {
    expect(calendar).toHaveLength(CALENDAR_WINDOW);
    expect(calendar[0].iso).toBe(TODAY);
    expect(calendar[0].isToday).toBe(true);
  });

  it("never opens in the past", () => {
    expect(buildCalendar("2020-01-01", TODAY, ["hero"], {})[0].iso).toBe(TODAY);
  });

  it("prices every day for the current selection", () => {
    expect(calendar.every((day) => day.price > 0)).toBe(true);
  });

  it("marks weekend boost outside campaigns only", () => {
    for (const day of calendar) {
      if (day.campaign) expect(day.boost).toBe(false);
    }
  });

  it("jumps the window to the first of a chosen month", () => {
    expect(anchorForMonth(2026, 10, TODAY)).toBe("2026-11-01");
  });

  it("clamps a past month to today", () => {
    expect(anchorForMonth(2020, 0, TODAY)).toBe(TODAY);
  });
});
