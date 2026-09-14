/**
 * The advertiser's own dates: a rolling thirty-day window.
 *
 * Every cell carries its own price, because what a day costs depends on when it
 * is — a campaign day, a weekend, or an ordinary Tuesday — and burying that in
 * a total would make the calendar feel arbitrary. Days that cannot be booked
 * say why rather than simply going grey.
 */
import { useMemo, useState } from "react";

import { cn } from "@/lib/utils";
import { anchorForMonth, buildCalendar, LEAD_DAYS } from "../../domain/availability";
import { fromISO, longDate, MONTH_SHORT } from "../../domain/dates";
import { compact, days as daysLabel, money, percent } from "../../domain/format";
import { rangeCost } from "../../domain/pricing";
import type { BookingDraft, ISODate } from "../../domain/types";
import { addDaysISO, rangeLength } from "../../domain/dates";
import { durationUpsell } from "../../state/booking-draft";
import { ConfirmBanner, Tag } from "../primitives";

/** Years the window can jump to. Booking more than a season ahead is the exception. */
const YEARS = [2026, 2027] as const;

export function DateCalendar({
  draft,
  todayISO,
  hint,
  onPickDay,
  onExtend,
}: {
  draft: BookingDraft;
  todayISO: ISODate;
  hint: string | null;
  onPickDay: (iso: ISODate) => void;
  onExtend: (endISO: ISODate, deal: { label: string; pct: number }) => void;
}) {
  const [anchor, setAnchor] = useState<ISODate>(todayISO);
  const anchorDate = fromISO(anchor);

  const calendar = useMemo(
    () => buildCalendar(anchor, todayISO, draft.placementIds, draft.positions),
    [anchor, todayISO, draft.placementIds, draft.positions],
  );

  const { startISO, endISO } = draft;
  const complete = Boolean(startISO && endISO);
  const length = complete ? rangeLength(startISO!, endISO!) : 0;

  const upsell = durationUpsell(draft);
  const upsellEnd = upsell && startISO ? addDaysISO(startISO, upsell.days - 1) : null;
  const upsellGross =
    upsellEnd && startISO ? rangeCost(draft.placementIds, draft.positions, startISO, upsellEnd) : 0;
  const upsellPrice = upsell ? Math.round(upsellGross * (1 - upsell.deal.pct)) : 0;

  return (
    <section className="animate-in fade-in slide-in-from-top-2 rounded-[18px] border border-border/60 bg-card p-6 duration-300 sm:p-7">
      <div className="flex flex-wrap items-end justify-between gap-5">
        <div>
          <h2 className="text-[19px] font-bold tracking-tight">Pick your dates</h2>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Tap a start date, then an end date. Bookings need {LEAD_DAYS} days for approval.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <select
            aria-label="Jump to month"
            value={anchorDate.getMonth()}
            onChange={(event) =>
              setAnchor(
                anchorForMonth(anchorDate.getFullYear(), Number(event.target.value), todayISO),
              )
            }
            className="h-9 rounded-lg border border-border bg-card px-2.5 text-sm font-semibold"
          >
            {MONTH_SHORT.map((month, index) => (
              <option key={month} value={index}>
                {month}
              </option>
            ))}
          </select>
          <select
            aria-label="Jump to year"
            value={anchorDate.getFullYear()}
            onChange={(event) =>
              setAnchor(anchorForMonth(Number(event.target.value), anchorDate.getMonth(), todayISO))
            }
            className="h-9 rounded-lg border border-border bg-card px-2.5 text-sm font-semibold"
          >
            {YEARS.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-5 gap-1.5 sm:grid-cols-6 lg:grid-cols-10">
        {calendar.map((cell) => {
          const inRange = startISO
            ? endISO
              ? cell.iso >= startISO && cell.iso <= endISO
              : cell.iso === startISO
            : false;
          const disabled = cell.blocked !== null;
          const label = disabled
            ? cell.blocked === "lead"
              ? `${longDate(cell.iso)}, inside the approval lead time`
              : `${longDate(cell.iso)}, already booked`
            : `${longDate(cell.iso)}, ${money(cell.price)} per day`;

          return (
            <button
              key={cell.iso}
              type="button"
              onClick={() => onPickDay(cell.iso)}
              aria-label={label}
              aria-disabled={disabled}
              aria-pressed={inRange}
              className={cn(
                "flex min-w-0 flex-col gap-0.5 rounded-lg border-[1.5px] px-2 py-2 text-left transition-colors duration-150",
                disabled
                  ? "cursor-not-allowed border-dashed border-border bg-muted/50"
                  : inRange
                    ? "border-gray-900 bg-gray-900 dark:border-gray-100 dark:bg-gray-100"
                    : cell.campaign
                      ? "border-[#BDDCEE] bg-[#BDDCEE]/25 hover:border-[#7DB1D5]"
                      : "border-border bg-card hover:border-gray-900 dark:hover:border-gray-200",
              )}
            >
              <span
                className={cn(
                  "text-[8px] font-bold tracking-[0.06em]",
                  cell.isToday
                    ? "text-[#9356ff]"
                    : inRange
                      ? "text-gray-400 dark:text-gray-500"
                      : "text-muted-foreground",
                )}
              >
                {cell.isToday ? "TODAY" : cell.weekday}
              </span>
              <span
                className={cn(
                  "text-base font-bold leading-none tracking-tight tabular-nums",
                  disabled
                    ? "text-muted-foreground"
                    : inRange
                      ? "text-white dark:text-gray-900"
                      : "text-foreground",
                )}
              >
                {cell.day}
                <span className="ml-0.5 align-top text-[8px] font-semibold">{cell.month}</span>
              </span>
              <span
                className={cn(
                  "text-[9px] font-semibold leading-tight tabular-nums",
                  inRange ? "text-gray-300 dark:text-gray-600" : "text-muted-foreground",
                )}
              >
                {cell.blocked === "lead"
                  ? "Lead time"
                  : cell.blocked === "booked"
                    ? "Booked"
                    : compact(cell.price)}
              </span>
              {!disabled && !inRange && cell.campaign && (
                <span className="w-full truncate text-[8px] font-bold leading-tight text-[#1f5f7a] dark:text-[#7DB1D5]">
                  {cell.campaign.name} {cell.campaign.multiple}×
                </span>
              )}
              {!disabled && !inRange && !cell.campaign && cell.boost && (
                <span className="text-[8px] font-bold leading-tight text-[#9356ff]">Boost</span>
              )}
            </button>
          );
        })}
      </div>

      {(hint || !complete) && (
        <p
          role={hint ? "status" : undefined}
          className={cn(
            "mt-4 text-[13px]",
            hint ? "font-semibold text-amber-700 dark:text-amber-400" : "text-muted-foreground",
          )}
        >
          {hint ??
            (!startISO
              ? "Tap a start date. Dashed days are unavailable."
              : "Now tap your end date.")}
        </p>
      )}

      {complete && !hint && (
        <div className="mt-4">
          <ConfirmBanner>
            <span className="font-bold">Currently selected:</span> {longDate(startISO!)} to{" "}
            {longDate(endISO!)} · {daysLabel(length)}
          </ConfirmBanner>
        </div>
      )}

      {upsell && upsellEnd && (
        <div className="animate-in slide-in-from-top-2 mt-4 flex flex-wrap items-center justify-between gap-4 rounded-xl border-[1.5px] border-[#BDDCEE] bg-[#BDDCEE]/10 p-5 shadow-sm duration-200">
          <div>
            <Tag>Save {percent(upsell.deal.pct)}</Tag>
            <p className="mt-2.5 text-base font-bold">
              Make it a {upsell.deal.label.toLowerCase()}
            </p>
            <p className="mt-0.5 text-sm text-muted-foreground tabular-nums">
              {daysLabel(upsell.days)} to {longDate(upsellEnd)} ·{" "}
              <span className="line-through opacity-60">{money(upsellGross)}</span>{" "}
              <span className="font-bold text-foreground">{money(upsellPrice)}</span>
            </p>
          </div>
          <button
            type="button"
            onClick={() => onExtend(upsellEnd, upsell.deal)}
            className="w-full rounded-lg bg-gray-900 px-6 py-3 text-sm font-medium text-white shadow-sm transition-all hover:bg-gray-800 hover:shadow-md active:scale-[0.98] sm:w-auto dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-200"
          >
            Book the {upsell.deal.label.toLowerCase().replace("full ", "")}
          </button>
        </div>
      )}
    </section>
  );
}
