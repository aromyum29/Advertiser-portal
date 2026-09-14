/**
 * What can actually be booked, and when.
 *
 * Inventory is first come first served, so the calendar has to say plainly
 * which days are gone and which are still open. Two rules shape it: creative
 * review needs a few days' lead time, and days another advertiser already holds
 * are blocked.
 *
 * Occupancy is simulated here. In production it comes from the inventory
 * service, per space and position rather than for the account as a whole.
 */
import { campaignForDate } from "./campaigns";
import {
  addDaysISO,
  diffDays,
  eachDay,
  fromISO,
  isWeekend,
  MONTH_SHORT,
  toISO,
  WEEKDAY_SHORT,
} from "./dates";
import { dayRate } from "./pricing";
import type { CampaignPeriod, ISODate, PlacementId, PositionSelection } from "./types";

/** Days of creative review that must fit before a booking can start. */
export const LEAD_DAYS = 3;

/** How many days the own-dates calendar shows at once. */
export const CALENDAR_WINDOW = 30;

/**
 * Days already taken. Simulated as a fixed offset from today so the prototype
 * always demonstrates the blocked-date recovery path.
 */
export const bookedDates = (todayISO: ISODate): ISODate[] => [
  addDaysISO(todayISO, 7),
  addDaysISO(todayISO, 13),
];

/** The earliest date a booking can start, once lead time is allowed for. */
export const earliestStart = (todayISO: ISODate): ISODate => addDaysISO(todayISO, LEAD_DAYS);

/** Why a day cannot be picked, or `null` when it can. */
export type BlockedReason = "lead" | "booked" | null;

export const blockedReason = (iso: ISODate, todayISO: ISODate): BlockedReason => {
  const offset = diffDays(todayISO, iso);
  if (offset >= 0 && offset < LEAD_DAYS) return "lead";
  if (bookedDates(todayISO).includes(iso)) return "booked";
  return null;
};

/** One cell in the own-dates calendar, with everything it needs to render. */
export interface CalendarDay {
  readonly iso: ISODate;
  readonly day: number;
  readonly weekday: string;
  readonly month: string;
  readonly isToday: boolean;
  readonly blocked: BlockedReason;
  /** Weekend demand applies only outside campaign periods. */
  readonly boost: boolean;
  readonly campaign: CampaignPeriod | undefined;
  /** Combined price of this day for the current selection. */
  readonly price: number;
}

/**
 * Build the visible calendar window starting at `anchorISO`, never earlier than
 * today, tagging each day with why it is priced or blocked the way it is.
 */
export const buildCalendar = (
  anchorISO: ISODate,
  todayISO: ISODate,
  placementIds: readonly PlacementId[],
  positions: PositionSelection,
): CalendarDay[] => {
  const start = anchorISO < todayISO ? todayISO : anchorISO;
  return Array.from({ length: CALENDAR_WINDOW }, (_, index) => {
    const iso = addDaysISO(start, index);
    const date = fromISO(iso);
    const campaign = campaignForDate(iso);
    return {
      iso,
      day: date.getDate(),
      weekday: WEEKDAY_SHORT[date.getDay()],
      month: MONTH_SHORT[date.getMonth()],
      isToday: iso === todayISO,
      blocked: blockedReason(iso, todayISO),
      boost: isWeekend(iso) && !campaign,
      campaign,
      price: dayRate(placementIds, positions, iso),
    };
  });
};

/**
 * Move the calendar window to the first of a chosen month, clamped so it never
 * opens in the past.
 */
export const anchorForMonth = (year: number, monthIndex: number, todayISO: ISODate): ISODate => {
  const first = toISO(new Date(year, monthIndex, 1));
  return first < todayISO ? todayISO : first;
};

export type RangeProblem =
  | { readonly kind: "lead"; readonly earliestISO: ISODate }
  | { readonly kind: "booked"; readonly iso: ISODate }
  | { readonly kind: "crosses-booked" };

/** Validate a candidate range, returning the first problem that blocks it. */
export const validateRange = (
  startISO: ISODate,
  endISO: ISODate,
  todayISO: ISODate,
): RangeProblem | null => {
  for (const iso of eachDay(startISO, endISO)) {
    const reason = blockedReason(iso, todayISO);
    if (reason === "lead") return { kind: "lead", earliestISO: earliestStart(todayISO) };
    if (reason === "booked")
      return iso === startISO || iso === endISO
        ? { kind: "booked", iso }
        : { kind: "crosses-booked" };
  }
  return null;
};
