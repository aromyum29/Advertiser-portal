import { describe, expect, it } from "vitest";

import {
  addDaysISO,
  diffDays,
  eachDay,
  fromISO,
  isWeekend,
  longDate,
  longRange,
  ordinal,
  rangeLength,
  shortRange,
  toISO,
} from "../dates";

describe("ISO round trips", () => {
  it("parses and formats the same local calendar date", () => {
    expect(toISO(fromISO("2027-04-05"))).toBe("2027-04-05");
  });

  it("does not drift across a daylight-saving style month boundary", () => {
    expect(addDaysISO("2026-10-29", 7)).toBe("2026-11-05");
    expect(addDaysISO("2026-12-27", 8)).toBe("2027-01-04");
  });

  it("handles leap years", () => {
    expect(addDaysISO("2028-02-28", 1)).toBe("2028-02-29");
    expect(addDaysISO("2027-02-28", 1)).toBe("2027-03-01");
  });
});

describe("range arithmetic", () => {
  it("counts a single day as one day, not zero", () => {
    expect(rangeLength("2026-11-23", "2026-11-23")).toBe(1);
    expect(diffDays("2026-11-23", "2026-11-23")).toBe(0);
  });

  it("counts both ends of a range", () => {
    expect(rangeLength("2026-11-23", "2026-11-30")).toBe(8);
  });

  it("enumerates every day in order", () => {
    expect(eachDay("2026-11-29", "2026-12-02")).toEqual([
      "2026-11-29",
      "2026-11-30",
      "2026-12-01",
      "2026-12-02",
    ]);
  });
});

describe("weekend detection", () => {
  it("flags Saturday and Sunday only", () => {
    // 2026-11-21 is a Saturday.
    expect(isWeekend("2026-11-21")).toBe(true);
    expect(isWeekend("2026-11-22")).toBe(true);
    expect(isWeekend("2026-11-23")).toBe(false);
    expect(isWeekend("2026-11-27")).toBe(false);
  });
});

describe("human-readable dates", () => {
  it("uses correct ordinal suffixes, including the teens", () => {
    expect(ordinal(1)).toBe("1st");
    expect(ordinal(2)).toBe("2nd");
    expect(ordinal(3)).toBe("3rd");
    expect(ordinal(4)).toBe("4th");
    expect(ordinal(11)).toBe("11th");
    expect(ordinal(12)).toBe("12th");
    expect(ordinal(13)).toBe("13th");
    expect(ordinal(21)).toBe("21st");
    expect(ordinal(22)).toBe("22nd");
    expect(ordinal(23)).toBe("23rd");
  });

  it("renders the long format used in summaries", () => {
    expect(longDate("2026-12-30")).toBe("30th December 2026");
    expect(longRange("2026-12-30", "2027-01-12")).toBe(
      "From 30th December 2026 to 12th January 2027",
    );
  });

  it("collapses a single-day range", () => {
    expect(shortRange("2026-08-28", "2026-08-28")).toBe("28 Aug");
    expect(shortRange("2026-08-10", "2026-08-16")).toBe("10 Aug to 16 Aug");
  });
});
