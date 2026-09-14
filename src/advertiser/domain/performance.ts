/**
 * Performance reporting.
 *
 * Every metric on the dashboard is derived from one set of buckets per
 * granularity, so the totals in the cards are always the sum of what the chart
 * plots. The numbers are deliberately irregular — weekend bumps, an Avurudu
 * spike, ad spend that steps as fixed-price slots start and end — and
 * internally consistent: orders are roughly 0.07% of visits and average order
 * value sits around Rs. 13–15K.
 *
 * In production these come from the reporting service.
 */
import { compact, count, money } from "./format";

export type Granularity = "day" | "week" | "month" | "year";

/** [label, store visits, orders, order value, ad spend] */
type Bucket = readonly [string, number, number, number, number];

const BUCKETS: Record<Granularity, readonly Bucket[]> = {
  day: [
    ["18 Aug", 61_300, 41, 604_700, 25_500],
    ["19 Aug", 58_900, 38, 517_400, 25_500],
    ["20 Aug", 66_400, 47, 699_800, 27_500],
    ["21 Aug", 63_100, 44, 653_900, 27_500],
    ["22 Aug", 79_800, 58, 802_300, 27_500],
    ["23 Aug", 84_200, 61, 908_600, 29_500],
    ["24 Aug", 67_200, 45, 641_200, 29_500],
  ],
  week: [
    ["28 Jul", 401_200, 289, 4_214_000, 148_000],
    ["4 Aug", 379_600, 261, 3_842_000, 148_000],
    ["11 Aug", 452_800, 322, 4_690_000, 182_700],
    ["18 Aug", 480_900, 334, 4_827_900, 192_500],
  ],
  month: [
    ["Mar", 1_284_000, 861, 12_470_000, 512_000],
    ["Apr", 1_671_300, 1_204, 17_890_000, 663_500],
    ["May", 1_402_800, 923, 13_210_000, 549_000],
    ["Jun", 1_318_500, 884, 12_960_000, 520_000],
    ["Jul", 1_585_200, 1_092, 15_730_000, 615_800],
    ["Aug", 1_742_600, 1_181, 17_240_000, 668_900],
  ],
  year: [
    ["2024", 8_412_000, 5_309, 74_300_000, 2_860_000],
    ["2025", 14_876_000, 9_842, 141_600_000, 5_214_000],
    ["2026 YTD", 11_204_000, 7_466, 108_900_000, 4_010_000],
  ],
};

export const GRANULARITIES: readonly { id: Granularity; label: string; range: string }[] = [
  { id: "day", label: "Day", range: "Last 7 days" },
  { id: "week", label: "Week", range: "Last 4 weeks" },
  { id: "month", label: "Month", range: "Last 6 months" },
  { id: "year", label: "Year", range: "Since 2024" },
] as const;

export interface PerformancePoint {
  readonly label: string;
  readonly visits: number;
  readonly orders: number;
  readonly value: number;
  readonly spend: number;
  readonly aov: number;
}

export const buildSeries = (granularity: Granularity): PerformancePoint[] =>
  BUCKETS[granularity].map(([label, visits, orders, value, spend]) => ({
    label,
    visits,
    orders,
    value,
    spend,
    aov: Math.round(value / orders),
  }));

export type MetricKey = "visits" | "orders" | "value" | "aov" | "spend";

export interface MetricDefinition {
  readonly key: MetricKey;
  readonly label: string;
  readonly axis: string;
  readonly note: string;
  readonly format: (value: number) => string;
  /** Averaged rather than summed across buckets, because a sum would be meaningless. */
  readonly derived?: boolean;
}

export const METRICS: readonly MetricDefinition[] = [
  {
    key: "visits",
    label: "Store visits",
    axis: "Store visits",
    note: "Shoppers who saw your ad",
    format: compact,
  },
  {
    key: "orders",
    label: "Total orders",
    axis: "Orders",
    note: "Attributed to your ads",
    format: count,
  },
  {
    key: "value",
    label: "Order value for period",
    axis: "Order value",
    note: "Sales from attributed orders",
    format: money,
  },
  {
    key: "aov",
    label: "Average order value",
    axis: "Avg order value",
    note: "Order value ÷ orders",
    format: money,
    derived: true,
  },
  {
    key: "spend",
    label: "Total spent on advertising",
    axis: "Ad spend",
    note: "What you paid for slots",
    format: money,
  },
] as const;

/**
 * Total a metric across the plotted buckets. Average order value is an average
 * of the whole period rather than a sum of per-bucket averages, so it stays
 * truthful at every granularity.
 */
export const totalFor = (series: readonly PerformancePoint[], key: MetricKey): number => {
  if (series.length === 0) return 0;
  if (key === "aov") {
    const value = series.reduce((sum, p) => sum + p.value, 0);
    const orders = series.reduce((sum, p) => sum + p.orders, 0);
    return orders === 0 ? 0 : Math.round(value / orders);
  }
  return series.reduce((sum, p) => sum + p[key], 0);
};

/** Change from the first bucket to the last, as a signed fraction. */
export const trendFor = (series: readonly PerformancePoint[], key: MetricKey): number => {
  if (series.length < 2) return 0;
  const first = series[0][key];
  const last = series[series.length - 1][key];
  if (first === 0) return 0;
  return (last - first) / first;
};

/** Per-booking results, used by the booking detail dialog. */
export interface BookingResult {
  readonly id: string;
  readonly name: string;
  readonly dates: string;
  readonly days: number;
  readonly visits: number;
  readonly orders: number;
  readonly value: number;
  readonly spend: number;
  readonly series: readonly { label: string; visits: number; orders: number }[];
}

const toDaily = (rows: readonly (readonly [string, number, number])[]) =>
  rows.map(([label, visits, orders]) => ({ label, visits, orders }));

export const BOOKING_RESULTS: readonly BookingResult[] = [
  {
    id: "KAD-1048",
    name: "Hero banner · Slide 2",
    dates: "10 – 16 Aug 2026",
    days: 7,
    visits: 310_000,
    orders: 214,
    value: 3_120_000,
    spend: 129_500,
    series: toDaily([
      ["10 Aug", 39_800, 27],
      ["11 Aug", 36_400, 24],
      ["12 Aug", 44_100, 31],
      ["13 Aug", 41_700, 29],
      ["14 Aug", 47_900, 33],
      ["15 Aug", 52_600, 38],
      ["16 Aug", 47_500, 32],
    ]),
  },
  {
    id: "KAD-0987",
    name: "Trending · Card 4",
    dates: "20 – 26 Jul 2026",
    days: 7,
    visits: 170_000,
    orders: 128,
    value: 1_860_000,
    spend: 53_200,
    series: toDaily([
      ["20 Jul", 21_900, 16],
      ["21 Jul", 19_600, 14],
      ["22 Jul", 24_800, 19],
      ["23 Jul", 23_200, 17],
      ["24 Jul", 26_700, 21],
      ["25 Jul", 28_900, 23],
      ["26 Jul", 24_900, 18],
    ]),
  },
] as const;

export const findBookingResult = (id: string): BookingResult | undefined =>
  BOOKING_RESULTS.find((r) => r.id === id);

/** Return on ad spend: sales generated for every rupee paid. */
export const roas = (value: number, spend: number): number => (spend === 0 ? 0 : value / spend);

/** Share of visits that turned into an attributed order, as a percentage. */
export const conversionRate = (orders: number, visits: number): number =>
  visits === 0 ? 0 : (orders / visits) * 100;
