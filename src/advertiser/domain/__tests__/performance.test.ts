import { describe, expect, it } from "vitest";

import {
  buildSeries,
  conversionRate,
  GRANULARITIES,
  METRICS,
  roas,
  totalFor,
  trendFor,
} from "../performance";

describe("series", () => {
  it("builds a series for every granularity offered", () => {
    for (const { id } of GRANULARITIES) {
      expect(buildSeries(id).length).toBeGreaterThan(0);
    }
  });

  it("derives average order value from value and orders", () => {
    for (const point of buildSeries("day")) {
      expect(point.aov).toBe(Math.round(point.value / point.orders));
    }
  });
});

describe("totals", () => {
  it("sums the plotted buckets, so cards and chart agree", () => {
    const series = buildSeries("week");
    expect(totalFor(series, "visits")).toBe(series.reduce((a, p) => a + p.visits, 0));
  });

  it("averages order value across the whole period rather than summing averages", () => {
    const series = buildSeries("month");
    const naive = series.reduce((a, p) => a + p.aov, 0);
    const actual = totalFor(series, "aov");
    expect(actual).not.toBe(naive);
    expect(actual).toBe(
      Math.round(
        series.reduce((a, p) => a + p.value, 0) / series.reduce((a, p) => a + p.orders, 0),
      ),
    );
  });

  it("returns zero for an empty series instead of dividing by nothing", () => {
    expect(totalFor([], "aov")).toBe(0);
    expect(totalFor([], "visits")).toBe(0);
    expect(trendFor([], "visits")).toBe(0);
  });

  it("formats every metric without throwing", () => {
    const series = buildSeries("day");
    for (const metric of METRICS) {
      expect(metric.format(totalFor(series, metric.key))).toBeTypeOf("string");
    }
  });
});

describe("derived rates", () => {
  it("computes return on ad spend", () => {
    expect(roas(3_120_000, 129_500)).toBeCloseTo(24.09, 1);
    expect(roas(100, 0)).toBe(0);
  });

  it("computes conversion rate as a percentage", () => {
    expect(conversionRate(214, 310_000)).toBeCloseTo(0.069, 3);
    expect(conversionRate(1, 0)).toBe(0);
  });
});
