/**
 * Date helpers.
 *
 * Every date in the booking flow is a local calendar date rather than an
 * instant, so all arithmetic goes through `YYYY-MM-DD` strings and midnight
 * local `Date` objects. That keeps a booking on "5 April" from sliding a day
 * either way depending on the advertiser's timezone.
 */
import type { ISODate } from "./types";

export const MS_DAY = 86_400_000;

export const WEEKDAY_SHORT = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"] as const;
export const MONTH_SHORT = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
] as const;
export const MONTH_FULL = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
] as const;

const pad2 = (n: number): string => String(n).padStart(2, "0");

/** Format a `Date` as a local `YYYY-MM-DD` string. */
export const toISO = (date: Date): ISODate =>
  `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`;

/** Parse `YYYY-MM-DD` into a local midnight `Date`. */
export const fromISO = (iso: ISODate): Date => {
  const [year, month, day] = iso.split("-").map(Number);
  return new Date(year, month - 1, day);
};

export const addDays = (date: Date, count: number): Date => {
  const next = new Date(date);
  next.setDate(next.getDate() + count);
  return next;
};

export const addDaysISO = (iso: ISODate, count: number): ISODate =>
  toISO(addDays(fromISO(iso), count));

/** Local midnight today. Injectable in tests via the optional `now` argument. */
export const startOfToday = (now: Date = new Date()): Date => {
  const today = new Date(now);
  today.setHours(0, 0, 0, 0);
  return today;
};

/** Whole days from `a` to `b`. Negative when `b` precedes `a`. */
export const diffDays = (a: ISODate, b: ISODate): number =>
  Math.round((fromISO(b).getTime() - fromISO(a).getTime()) / MS_DAY);

/** Inclusive count of days in a range, so a single day is 1. */
export const rangeLength = (startISO: ISODate, endISO: ISODate): number =>
  diffDays(startISO, endISO) + 1;

/** Every date in an inclusive range, in order. */
export const eachDay = (startISO: ISODate, endISO: ISODate): ISODate[] => {
  const days: ISODate[] = [];
  for (let i = 0; i <= diffDays(startISO, endISO); i += 1) days.push(addDaysISO(startISO, i));
  return days;
};

export const isWeekend = (iso: ISODate): boolean => {
  const day = fromISO(iso).getDay();
  return day === 0 || day === 6;
};

/** 1st, 2nd, 3rd, 4th … */
export const ordinal = (n: number): string => {
  const suffixes = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return `${n}${suffixes[(v - 20) % 10] ?? suffixes[v] ?? suffixes[0]}`;
};

/** "5th April 2027", the long form used in summaries and confirmations. */
export const longDate = (iso: ISODate): string => {
  const date = fromISO(iso);
  return `${ordinal(date.getDate())} ${MONTH_FULL[date.getMonth()]} ${date.getFullYear()}`;
};

/** "5 Apr", the compact form used in tables and chips. */
export const shortDate = (iso: ISODate): string => {
  const date = fromISO(iso);
  return `${date.getDate()} ${MONTH_SHORT[date.getMonth()]}`;
};

/** "5 Apr to 18 Apr", or just the single date when start and end match. */
export const shortRange = (startISO: ISODate, endISO: ISODate): string =>
  startISO === endISO ? shortDate(startISO) : `${shortDate(startISO)} to ${shortDate(endISO)}`;

/** "From 5th April 2027 to 18th April 2027". */
export const longRange = (startISO: ISODate, endISO: ISODate): string =>
  `From ${longDate(startISO)} to ${longDate(endISO)}`;
