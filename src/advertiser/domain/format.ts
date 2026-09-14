/**
 * Number and money formatting. Sri Lankan rupees throughout, written the way
 * the merchant-facing copy does: "Rs. 129,500".
 */

export const money = (value: number): string => `Rs. ${Math.round(value).toLocaleString("en-US")}`;

/** "1.2M" / "480K" / "940", for view and impression counts. */
export const compact = (value: number): string =>
  new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 }).format(value);

/** Plain thousands separators, for order counts and similar whole numbers. */
export const count = (value: number): string => Math.round(value).toLocaleString("en-US");

export const percent = (fraction: number): string => `${Math.round(fraction * 100)}%`;

/** "1 day" / "12 days". */
export const days = (value: number): string => `${value} day${value === 1 ? "" : "s"}`;

/** "1 space" / "3 spaces". */
export const spaces = (value: number): string => `${value} space${value === 1 ? "" : "s"}`;
