/**
 * Domain types for the Koko advertiser portal.
 *
 * Everything an advertiser can buy, and everything that shapes its price, is
 * described here. The modules in this folder are pure: no React, no browser
 * APIs, no side effects, so the rules can be unit tested on their own and
 * reused from anywhere in the app.
 */

/** ISO calendar date, `YYYY-MM-DD`, always interpreted in local time. */
export type ISODate = string;

/** The six bookable surfaces inside the Koko shopper app. */
export type PlacementId = "hero" | "secondary" | "trending" | "search" | "shop" | "checkout";

/**
 * What the advertiser has to supply for a space.
 * - `banner`: needs artwork, so the booking passes through the Assets step.
 * - `existing`: the store's own thumbnail is the creative, nothing to upload.
 */
export type CreativeKind = "banner" | "existing";

export interface Placement {
  readonly id: PlacementId;
  /** Merchant-facing name, e.g. "Hero banner". */
  readonly name: string;
  /** What a single bookable unit is called: Slide, Card, Slot. */
  readonly unit: string;
  /** Where in the app it renders, e.g. "Top of the Koko home screen". */
  readonly location: string;
  /** One-line summary shown on the placement card. */
  readonly description: string;
  /** Long-form explainer shown in the details dialog. */
  readonly details: string;
  /** Estimated views over seven days, used as the card's value anchor. */
  readonly weeklyImpressions: number;
  /** Rate card price per day per space, in LKR, before any multiplier. */
  readonly basePrice: number;
  /** Views per day. */
  readonly vpd: number;
  /** Indicative weekly price shown before dates are chosen. */
  readonly weekly: number;
  /** How many positions exist in the rotation. */
  readonly positionCount: number;
  /** Which of those positions are currently sellable. */
  readonly availablePositions: readonly number[];
  readonly creative: CreativeKind;
  /** Optional merchandising badge on the placement card. */
  readonly badge?: { readonly label: string; readonly tone: "brand" | "green" };
  /** Optional strike-through price and discount pill, for the priced variant. */
  readonly promo?: { readonly label: string; readonly wasPrice: number };
}

/**
 * A Koko-run shopping moment with pre-set dates and a traffic multiple.
 * Booking inside one costs more per day but delivers proportionally more views.
 */
export interface CampaignPeriod {
  readonly id: string;
  readonly name: string;
  /** Human-readable span, e.g. "23 to 30 Nov 2026". */
  readonly dates: string;
  /** Traffic multiple applied to both price and views on campaign days. */
  readonly multiple: number;
  /** Merchandising note shown on the campaign card. */
  readonly note: string;
  readonly earlyBird: boolean;
  readonly periodDays: number;
  readonly startISO: ISODate;
  /** Card colour band and its readable ink colour. */
  readonly band: string;
  readonly ink: string;
}

/** Map of placement to the position number chosen in its rotation. */
export type PositionSelection = Partial<Record<PlacementId, number>>;

/** A duration discount the advertiser accepted on their own dates. */
export interface DurationDeal {
  readonly label: string;
  /** Fraction off, e.g. 0.05 for five percent. */
  readonly pct: number;
}

/** A campaign week added to the booking, whole or in part. */
export interface CampaignSelection {
  readonly id: string;
  readonly days: number;
  /** True when the advertiser took the whole period and earned the 15% saving. */
  readonly full: boolean;
}

export type CreativeChoice = "koko" | "upload";

export type PaymentMethodId = "credit" | "card" | "justpay";

export interface PaymentMethod {
  readonly id: PaymentMethodId;
  readonly label: string;
  readonly caption: string;
  /** How the adjustment reads on screen, e.g. "+5% convenience fee". */
  readonly adjustmentLabel: string;
  readonly adjustment: "fee" | "discount";
  readonly pct: number;
  readonly badge?: string;
}

/** Everything the advertiser has chosen so far. The input to the pricing engine. */
export interface BookingDraft {
  readonly placementIds: readonly PlacementId[];
  readonly positions: PositionSelection;
  /** Inclusive start of the advertiser's own date range. */
  readonly startISO: ISODate | null;
  /** Inclusive end of the advertiser's own date range. */
  readonly endISO: ISODate | null;
  readonly durationDeal: DurationDeal | null;
  readonly campaigns: readonly CampaignSelection[];
  readonly bundleApplied: boolean;
  readonly creative: CreativeChoice;
  readonly payment: PaymentMethodId;
}

/** A single money line in the price breakdown. */
export interface PriceLine {
  readonly id: string;
  readonly label: string;
  readonly amount: number;
  readonly kind: "charge" | "saving" | "fee";
}

/** The fully resolved price of a draft. Every figure on screen comes from here. */
export interface Quote {
  /** Media cost before any discount. */
  readonly mediaGross: number;
  readonly durationSaving: number;
  readonly campaignSaving: number;
  readonly bundleSaving: number;
  /** Media cost after all savings. */
  readonly mediaNet: number;
  readonly designFee: number;
  readonly subtotal: number;
  readonly paymentFee: number;
  readonly paymentDiscount: number;
  readonly total: number;
  readonly totalSavings: number;
  /** Total days booked across own dates and campaign weeks. */
  readonly days: number;
  /** Estimated views over the whole booking. */
  readonly views: number;
  readonly lines: readonly PriceLine[];
}

export type BookingStatus = "live" | "pending" | "confirmed" | "completed";

export interface BookingRecord {
  readonly id: string;
  readonly reference: string;
  readonly placementIds: readonly PlacementId[];
  readonly positions: PositionSelection;
  /** Rendered summary of the spaces and positions, e.g. "Hero banner Slide 2". */
  readonly placementLabel: string;
  readonly dateLabel: string;
  readonly startISO: ISODate | null;
  readonly endISO: ISODate | null;
  readonly campaigns: readonly CampaignSelection[];
  readonly status: BookingStatus;
  readonly spend: number;
  readonly days: number;
  readonly views: number;
  readonly creative: CreativeChoice;
  readonly payment: PaymentMethodId;
  readonly createdAt: string;
  /** Plain-language outcome line shown in the bookings table. */
  readonly result: string;
}
