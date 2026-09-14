/**
 * The Advertise landing page.
 *
 * The order is deliberate: what Koko's audience is, then where you can appear,
 * then the price. Value anchors price rather than the other way round, and
 * nothing on this page claims availability, because availability depends on
 * dates the advertiser has not chosen yet.
 */
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";

import { compact, money, spaces as spacesLabel } from "../domain/format";
import { getPlacements } from "../domain/inventory";
import metricNewUsers from "figma:asset/metric-new-users.gif";
import metricPeople from "figma:asset/metric-people.gif";
import metricShoppers from "figma:asset/metric-shoppers.gif";
import { useBookingDraft } from "../state/booking-draft";
import { PlacementPicker } from "./placements/PlacementPicker";

const METRICS = [
  {
    label: "People using Koko",
    value: "2.5M",
    note: "Installed on iOS and Android",
    gif: metricPeople,
  },
  {
    label: "Average number of shoppers every month",
    value: "600K",
    note: "Active and browsing",
    gif: metricShoppers,
  },
  {
    label: "New users every month",
    value: "35K",
    note: "Fresh shoppers every month, on average",
    gif: metricNewUsers,
  },
] as const;

export function AdvertisePage() {
  const { draft, dispatch } = useBookingDraft();
  const navigate = useNavigate();
  // Prices are hidden on the cards by default so views lead the decision.
  const [showPrices, setShowPrices] = useState(false);

  const selected = getPlacements(draft.placementIds);
  const totalViews = selected.reduce((sum, p) => sum + p.weeklyImpressions, 0);
  const totalWeekly = selected.reduce((sum, p) => sum + p.weekly, 0);

  return (
    <div className="min-w-0 space-y-10 pb-28">
      <header className="pt-1">
        <h1 className="text-3xl font-extrabold leading-tight tracking-tight">Advertise with Koko</h1>
        <p className="mt-1.5 text-base text-muted-foreground">
          Put your brand in front of shoppers who already use Koko.
        </p>
      </header>

      <section>
        <p className="max-w-2xl text-lg font-bold tracking-tight">
          You already sell on Koko. Now get seen on it.
        </p>
        <p className="mt-1.5 max-w-2xl text-[15px] leading-relaxed text-muted-foreground">
          Pick a space, choose your dates, pay the price on screen. No bidding. The slot is yours for
          the full period.
        </p>

        <div className="mt-7 grid grid-cols-[repeat(auto-fit,minmax(min(100%,240px),1fr))] gap-4">
          {METRICS.map((metric) => (
            <div
              key={metric.label}
              className="flex flex-col gap-2.5 rounded-[20px] border border-border/60 bg-card px-6 py-5 shadow-sm"
            >
              <img
                src={metric.gif}
                alt=""
                aria-hidden="true"
                className="pointer-events-none h-10 w-10 flex-shrink-0 select-none object-contain"
              />
              <span className="text-balance text-[11px] font-semibold uppercase leading-snug tracking-[0.06em] text-muted-foreground/80">
                {metric.label}
              </span>
              <p className="text-3xl font-extrabold leading-none tracking-tight tabular-nums">
                {metric.value}
              </p>
              <p className="text-[13px] leading-snug text-muted-foreground/80">{metric.note}</p>
            </div>
          ))}
        </div>
        <p className="mt-3 text-[13px] text-muted-foreground">
          Every estimate below comes from this live shopper traffic.
        </p>
      </section>

      <PlacementPicker
        selectedIds={draft.placementIds}
        onToggle={(id) => dispatch({ type: "toggleSpace", id })}
        showPrices={showPrices}
        heading={
          <div>
            <h2 className="text-[26px] font-extrabold tracking-tight">Choose where you want to be seen</h2>
            <p className="mt-1.5 max-w-3xl text-[15px] text-muted-foreground">
              Pick one space or a few. One booking covers all of them for the same dates.
            </p>
            <button
              type="button"
              onClick={() => setShowPrices((shown) => !shown)}
              aria-pressed={showPrices}
              className="mt-3 text-[13px] font-semibold text-muted-foreground underline underline-offset-4 transition-colors hover:text-foreground"
            >
              {showPrices ? "Hide prices" : "Show prices"}
            </button>
          </div>
        }
      />

      {selected.length > 0 && (
        <div
          role="region"
          aria-label="Current selection"
          className="fixed bottom-4 left-1/2 z-40 w-[calc(100vw-32px)] -translate-x-1/2 sm:bottom-7 sm:w-auto sm:max-w-[calc(100vw-48px)]"
        >
          <div className="flex flex-col items-stretch gap-3 rounded-2xl bg-gray-900 p-4 text-white shadow-[0_20px_48px_-8px_rgba(13,15,20,0.55),0_8px_20px_-6px_rgba(13,15,20,0.4)] ring-1 ring-white/10 sm:flex-row sm:items-center sm:gap-8 sm:rounded-full sm:py-4 sm:pl-8 sm:pr-4 dark:bg-gray-100 dark:text-gray-900">
            <div className="flex flex-wrap items-baseline gap-2.5 whitespace-nowrap">
              <span className="text-[15px] font-bold">{spacesLabel(selected.length)} selected</span>
              {showPrices && (
                <>
                  <span aria-hidden="true" className="text-sm text-gray-500 dark:text-gray-400">·</span>
                  <span className="text-[15px] tabular-nums">
                    {money(totalWeekly)} <span className="font-bold">/ week</span>
                  </span>
                </>
              )}
              <span aria-hidden="true" className="text-sm text-gray-500 dark:text-gray-400">·</span>
              <span className="text-sm tabular-nums text-gray-300 dark:text-gray-600">
                ~{compact(totalViews)} {showPrices ? "views" : "store visits"} / 7 days
              </span>
              <button
                type="button"
                onClick={() => dispatch({ type: "clearSpaces" })}
                className="ml-1.5 text-sm font-semibold text-gray-300 underline underline-offset-2 transition-colors hover:text-white dark:text-gray-600 dark:hover:text-gray-900"
              >
                Clear
              </button>
            </div>
            <button
              type="button"
              onClick={() => void navigate({ to: "/book/dates" })}
              className="w-full flex-shrink-0 whitespace-nowrap rounded-xl bg-white px-7 py-3 text-[15px] font-bold text-gray-900 shadow-md transition-all hover:bg-gray-100 hover:shadow-lg active:scale-[0.98] sm:w-auto sm:rounded-full dark:bg-gray-900 dark:text-white dark:hover:bg-gray-800"
            >
              Start a booking →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
