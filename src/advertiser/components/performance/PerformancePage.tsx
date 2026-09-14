/**
 * Performance.
 *
 * The metric cards are the control: whichever one is selected is what the chart
 * plots, so the headline number and the curve are always the same thing. Every
 * total is the sum of the plotted buckets, never a separate figure that could
 * drift from them.
 */
import { useMemo, useState } from "react";

import { cn } from "@/lib/utils";
import {
  BOOKING_RESULTS,
  buildSeries,
  GRANULARITIES,
  METRICS,
  totalFor,
  trendFor,
  type BookingResult,
  type Granularity,
  type MetricKey,
} from "../../domain/performance";
import { money } from "../../domain/format";
import { TrendPill } from "../primitives";
import { BookingResultDialog } from "./BookingResultDialog";
import { PerformanceChart } from "./PerformanceChart";

export function PerformancePage() {
  const [granularity, setGranularity] = useState<Granularity>("day");
  const [metricKey, setMetricKey] = useState<MetricKey>("visits");
  const [open, setOpen] = useState<BookingResult | null>(null);

  const series = useMemo(() => buildSeries(granularity), [granularity]);
  const metric = METRICS.find((m) => m.key === metricKey) ?? METRICS[0];
  const range = GRANULARITIES.find((g) => g.id === granularity)?.range ?? "";

  return (
    <div className="space-y-5">
      <header className="pt-1">
        <h1 className="text-3xl font-extrabold leading-tight tracking-tight">Performance</h1>
        <p className="mt-1.5 text-base text-muted-foreground">
          What your advertising on Koko returned.
        </p>
      </header>

      <div className="flex flex-wrap items-start justify-between gap-4">
        <p className="max-w-2xl rounded-xl border border-[#BDDCEE]/40 bg-[#BDDCEE]/15 px-4 py-3 text-sm">
          <span className="font-semibold">Attributed</span>
          <span className="text-muted-foreground">
            {" "}
            means an order within 7 days of a shopper clicking you, or 1 day after seeing you.
            Windows are adjustable.
          </span>
        </p>
        <div role="group" aria-label="Chart range" className="flex gap-1 rounded-lg bg-muted p-1">
          {GRANULARITIES.map((option) => (
            <button
              key={option.id}
              type="button"
              onClick={() => setGranularity(option.id)}
              aria-pressed={granularity === option.id}
              className={cn(
                "rounded-md px-3.5 py-1.5 text-[13px] font-semibold transition-colors",
                granularity === option.id
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <section className="overflow-hidden rounded-2xl border border-border/60 bg-card shadow-sm">
        <div className="px-6 pb-2 pt-6">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Advertising performance
            </h2>
            <span className="rounded-full border border-border/40 bg-muted/40 px-3 py-1 text-xs font-medium">
              {range}
            </span>
          </div>

          <div
            role="group"
            aria-label="Choose what the chart plots"
            className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5"
          >
            {METRICS.map((definition) => {
              const active = definition.key === metricKey;
              const total = totalFor(series, definition.key);
              const trend = trendFor(series, definition.key);
              return (
                <button
                  key={definition.key}
                  type="button"
                  onClick={() => setMetricKey(definition.key)}
                  aria-pressed={active}
                  className={cn(
                    "rounded-xl border-[1.5px] p-4 text-left transition-colors duration-150",
                    active
                      ? "border-gray-900 bg-muted/30 dark:border-gray-200"
                      : "border-border hover:border-gray-400",
                  )}
                >
                  <p className="text-[11px] font-bold uppercase leading-snug tracking-[0.06em] text-muted-foreground">
                    {definition.label}
                  </p>
                  <p className="mt-1.5 text-xl font-bold tracking-tight tabular-nums sm:text-2xl">
                    {definition.format(total)}
                  </p>
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <TrendPill up={trend >= 0}>
                      {trend >= 0 ? "+" : ""}
                      {(trend * 100).toFixed(1)}%
                    </TrendPill>
                  </div>
                  <p className="mt-1.5 text-[11px] leading-snug text-muted-foreground">
                    {definition.note}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        <div className="px-4 pb-5 pt-4 sm:px-6">
          <PerformanceChart series={series} metric={metric} />
        </div>
      </section>

      <section className="overflow-hidden rounded-2xl border border-border/60 bg-card">
        <div className="border-b border-border/60 px-6 py-4">
          <h2 className="text-base font-bold tracking-tight">Results by booking</h2>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Select a booking to see how it performed day by day.
          </p>
        </div>
        <ul className="divide-y divide-border/40">
          {BOOKING_RESULTS.map((result) => (
            <li key={result.id}>
              <button
                type="button"
                onClick={() => setOpen(result)}
                className="flex w-full flex-wrap items-center justify-between gap-4 px-6 py-4 text-left transition-colors hover:bg-muted/30"
              >
                <span className="min-w-0">
                  <span className="block text-sm font-bold">{result.name}</span>
                  <span className="block text-xs text-muted-foreground">
                    {result.dates} · <span className="font-mono">{result.id}</span>
                  </span>
                </span>
                <span className="flex flex-wrap items-center gap-5 text-sm">
                  <span className="text-muted-foreground">
                    Spend{" "}
                    <span className="font-semibold text-foreground tabular-nums">
                      {money(result.spend)}
                    </span>
                  </span>
                  <span className="text-muted-foreground">
                    Sales{" "}
                    <span className="font-semibold text-foreground tabular-nums">
                      {money(result.value)}
                    </span>
                  </span>
                  <span className="font-semibold tabular-nums">
                    {(result.value / result.spend).toFixed(1)}× return
                  </span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      </section>

      <BookingResultDialog result={open} onClose={() => setOpen(null)} />
    </div>
  );
}
