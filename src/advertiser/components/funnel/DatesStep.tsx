/**
 * Step one: when.
 *
 * Dates come before positions because the campaign weeks are the strongest
 * thing Koko sells, and they are only persuasive while the advertiser still has
 * an open mind about timing. The two routes to a period are presented as a
 * choice up front, and only the chosen one is shown, so the page stays short.
 */
import { Check } from "lucide-react";
import { useState } from "react";

import { cn } from "@/lib/utils";
import { findCampaign } from "../../domain/campaigns";
import { days as daysLabel } from "../../domain/format";
import { rangeLength } from "../../domain/dates";
import kokoWordmark from "figma:asset/2fb784bf4eb111e438185f3f72d368e7963516ad.png";
import { useBookingDraft } from "../../state/booking-draft";
import { Radio, ShinyTag } from "../primitives";
import { CampaignPicker } from "./CampaignPicker";
import { DateCalendar } from "./DateCalendar";

type Mode = "campaign" | "own";

const CAMPAIGN_BENEFITS = [
  "Up to 3x the usual audience",
  "Guaranteed slot for the period",
  "Fixed dates, zero guesswork",
];

const OWN_CAVEATS = ["Any start and end date", "30 day window", "Needs 3 days for approval"];

export function DatesStep() {
  const { draft, todayISO, dateHint, dispatch, pickDay } = useBookingDraft();

  // Start on whichever the advertiser already used, otherwise lead with campaigns.
  const [mode, setMode] = useState<Mode>(() =>
    draft.startISO && draft.campaigns.length === 0 ? "own" : "campaign",
  );

  const chosenCampaign = draft.campaigns[0] ? findCampaign(draft.campaigns[0].id) : undefined;
  const rangeDays = draft.startISO && draft.endISO ? rangeLength(draft.startISO, draft.endISO) : 0;

  return (
    <div className="flex flex-col gap-7">
      <section className="flex flex-col gap-3">
        <h2 className="text-[19px] font-bold tracking-tight">
          When do you want to grow your brand on Koko?
        </h2>

        <div
          role="radiogroup"
          aria-label="How to choose your dates"
          className="mt-2 grid items-stretch gap-4 md:grid-cols-2"
        >
          <button
            type="button"
            role="radio"
            aria-checked={mode === "campaign"}
            onClick={() => setMode("campaign")}
            className={cn(
              "relative flex flex-col rounded-2xl border-2 p-6 pt-8 text-left transition-colors duration-150",
              mode === "campaign"
                ? "border-gray-900 shadow-md dark:border-gray-200"
                : "border-border hover:border-gray-400",
            )}
          >
            <ShinyTag className="absolute -top-3.5 left-5">Most popular</ShinyTag>
            <span className="flex items-center justify-between gap-2">
              <span className="flex items-center gap-1.5 text-base font-bold">
                <img src={kokoWordmark} alt="Koko" className="h-4 w-auto select-none" /> campaign
                week
              </span>
              <Radio on={mode === "campaign"} />
            </span>
            <span className="mt-4 flex flex-col gap-2">
              {CAMPAIGN_BENEFITS.map((benefit) => (
                <span key={benefit} className="flex items-center gap-2.5 text-sm">
                  <span
                    aria-hidden="true"
                    className="flex h-[18px] w-[18px] flex-shrink-0 items-center justify-center rounded-full bg-emerald-600"
                  >
                    <Check className="h-2.5 w-2.5 stroke-[3] text-white" />
                  </span>
                  {benefit}
                </span>
              ))}
            </span>
            {chosenCampaign && (
              <span className="mt-3 block text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                Selected: {chosenCampaign.name}
              </span>
            )}
          </button>

          <button
            type="button"
            role="radio"
            aria-checked={mode === "own"}
            onClick={() => setMode("own")}
            className={cn(
              "relative flex flex-col rounded-2xl border-2 p-6 text-left transition-colors duration-150",
              mode === "own"
                ? "border-gray-900 shadow-md dark:border-gray-200"
                : "border-border hover:border-gray-400",
            )}
          >
            <span className="flex items-center justify-between gap-2">
              <span className="text-base font-bold">Custom dates</span>
              <Radio on={mode === "own"} />
            </span>
            <span className="mt-4 flex flex-col gap-2">
              {OWN_CAVEATS.map((caveat) => (
                <span
                  key={caveat}
                  className="flex items-center gap-2.5 text-sm text-muted-foreground"
                >
                  <span
                    aria-hidden="true"
                    className="flex h-[18px] w-[18px] flex-shrink-0 items-center justify-center rounded-full border-2 border-amber-400"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                  </span>
                  {caveat}
                </span>
              ))}
            </span>
            {rangeDays > 0 && (
              <span className="mt-3 block text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                Selected: {daysLabel(rangeDays)}
              </span>
            )}
          </button>
        </div>
      </section>

      {mode === "campaign" ? (
        <CampaignPicker
          draft={draft}
          onSelect={(campaign, days, full) =>
            dispatch({ type: "selectCampaign", id: campaign.id, days, full })
          }
          onClear={() =>
            draft.campaigns.forEach((c) => dispatch({ type: "removeCampaign", id: c.id }))
          }
        />
      ) : (
        <DateCalendar
          draft={draft}
          todayISO={todayISO}
          hint={dateHint}
          onPickDay={pickDay}
          onExtend={(endISO, deal) => dispatch({ type: "extendTo", endISO, deal })}
        />
      )}
    </div>
  );
}
