/**
 * Booking records: turning a completed draft into something the advertiser can
 * look back at, and the seeded history that gives the prototype a past.
 */
import { findCampaign } from "./campaigns";
import { longRange, shortDate, shortRange } from "./dates";
import { getPlacement, POSITION_NOUN } from "./inventory";
import { needsCreative, quote } from "./pricing";
import type {
  BookingDraft,
  BookingRecord,
  BookingStatus,
  ISODate,
  PlacementId,
  PositionSelection,
} from "./types";

/** "Hero banner Slide 2, Trending Card 4" — how a booking reads in one line. */
export const describePlacements = (
  placementIds: readonly PlacementId[],
  positions: PositionSelection,
): string =>
  placementIds
    .map((id) => {
      const placement = getPlacement(id);
      const noun = POSITION_NOUN[id];
      const position = positions[id];
      const unit = position ? `${noun} ${position}` : noun;
      return id === "hero" ? unit : `${placement.name} ${unit}`;
    })
    .join(", ");

/** Long-form dates for the confirmation screen and booking detail. */
export const describeDates = (draft: BookingDraft): string => {
  const parts: string[] = [];
  if (draft.startISO && draft.endISO) parts.push(longRange(draft.startISO, draft.endISO));
  for (const selection of draft.campaigns) {
    const campaign = findCampaign(selection.id);
    if (campaign) parts.push(campaign.name);
  }
  return parts.length > 0 ? parts.join(" + ") : "Not chosen yet";
};

/** Compact dates for the summary rail and tables. */
export const describeDatesShort = (draft: BookingDraft): string => {
  const parts: string[] = [];
  if (draft.startISO && draft.endISO) parts.push(shortRange(draft.startISO, draft.endISO));
  for (const selection of draft.campaigns) {
    const campaign = findCampaign(selection.id);
    if (!campaign) continue;
    parts.push(
      selection.full
        ? `${campaign.name} (${campaign.dates})`
        : `${campaign.name} (${selection.days} of ${campaign.periodDays} days)`,
    );
  }
  return parts.length > 0 ? parts.join(" + ") : "Not picked";
};

/**
 * Booking references are `KAD-` plus a four digit sequence. Generated from the
 * existing count so a prototype session produces believable, increasing refs.
 */
export const nextReference = (existingCount: number): string =>
  `KAD-${String(1084 + existingCount).padStart(4, "0")}`;

/**
 * Turn a confirmed draft into a stored record. A booking whose artwork is being
 * reviewed sits in `pending` until it clears; Koko-designed artwork is approved
 * near instantly, so those are `confirmed` straight away.
 */
export const createBooking = (
  draft: BookingDraft,
  options: { reference: string; now?: Date },
): BookingRecord => {
  const priced = quote(draft);
  const artworkPending = needsCreative(draft.placementIds) && draft.creative === "upload";
  const now = options.now ?? new Date();
  return {
    id: options.reference,
    reference: options.reference,
    placementIds: [...draft.placementIds],
    positions: { ...draft.positions },
    placementLabel: describePlacements(draft.placementIds, draft.positions),
    dateLabel: describeDatesShort(draft),
    startISO: draft.startISO,
    endISO: draft.endISO,
    campaigns: [...draft.campaigns],
    status: artworkPending ? "pending" : "confirmed",
    spend: priced.total,
    days: priced.days,
    views: priced.views,
    creative: draft.creative,
    payment: draft.payment,
    createdAt: now.toISOString(),
    result: artworkPending
      ? "Waiting on creative review"
      : "Booked and scheduled. Results appear once it goes live.",
  };
};

/** What the advertiser is told to expect next, right after paying. */
export const creativeNextStep = (draft: BookingDraft): string => {
  if (!needsCreative(draft.placementIds))
    return "Your store thumbnail is the creative, so there is nothing more to do.";
  return draft.creative === "upload"
    ? "Your creative passed the spec checks and is queued for review, which takes up to 2 business days."
    : "Koko's design team is creating your assets now. Approval is near-instant.";
};

/** Seeded history so My bookings has something to show on a first visit. */
export const SEED_BOOKINGS: readonly BookingRecord[] = [
  {
    id: "KAD-1048",
    reference: "KAD-1048",
    placementIds: ["hero"],
    positions: { hero: 2 },
    placementLabel: "Hero banner · Slide 2",
    dateLabel: "10 Aug to 16 Aug",
    startISO: "2026-08-10",
    endISO: "2026-08-16",
    campaigns: [],
    status: "live",
    spend: 129_500,
    days: 7,
    views: 310_000,
    creative: "koko",
    payment: "credit",
    createdAt: "2026-08-04T09:12:00.000Z",
    result: "128 orders so far · Rs. 1.86M in sales",
  },
  {
    id: "KAD-0987",
    reference: "KAD-0987",
    placementIds: ["trending"],
    positions: { trending: 4 },
    placementLabel: "Trending · Card 4",
    dateLabel: "20 Jul to 26 Jul",
    startISO: "2026-07-20",
    endISO: "2026-07-26",
    campaigns: [],
    status: "completed",
    spend: 53_200,
    days: 7,
    views: 170_000,
    creative: "koko",
    payment: "card",
    createdAt: "2026-07-14T11:40:00.000Z",
    result: "Drove 214 orders · Rs. 3.12M in sales",
  },
  {
    id: "KAD-1061",
    reference: "KAD-1061",
    placementIds: ["checkout"],
    positions: { checkout: 2 },
    placementLabel: "Post-checkout card · Card 2",
    dateLabel: "28 Aug",
    startISO: "2026-08-28",
    endISO: "2026-08-28",
    campaigns: [],
    status: "pending",
    spend: 9_800,
    days: 1,
    views: 10_300,
    creative: "upload",
    payment: "justpay",
    createdAt: "2026-08-21T15:05:00.000Z",
    result: "Waiting on template review",
  },
] as const;

export const STATUS_LABEL: Record<BookingStatus, string> = {
  live: "Live",
  pending: "Pending approval",
  confirmed: "Confirmed",
  completed: "Completed",
};

/** Headline counts for the strip above the bookings table. */
export const summarise = (records: readonly BookingRecord[]) => ({
  live: records.filter((b) => b.status === "live").length,
  pending: records.filter((b) => b.status === "pending").length,
  completed: records.filter((b) => b.status === "completed").length,
  confirmed: records.filter((b) => b.status === "confirmed").length,
  totalSpend: records.reduce((total, b) => total + b.spend, 0),
});

/** Single-day bookings read better as one date than as a range. */
export const bookingDateLabel = (startISO: ISODate | null, endISO: ISODate | null): string => {
  if (!startISO || !endISO) return "Campaign week";
  return startISO === endISO ? shortDate(startISO) : shortRange(startISO, endISO);
};
