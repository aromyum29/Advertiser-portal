/**
 * The pricing engine.
 *
 * Every price, saving and view estimate the advertiser sees comes from
 * `quote()`. Nothing in the UI does its own arithmetic, so the summary rail,
 * the review table, the confirmation dialog and the saved booking can never
 * disagree with each other.
 *
 * The model, in order:
 *
 *   1. Day rate  = Σ spaces of round(basePrice × positionMultiplier × dayFactor)
 *      where dayFactor is the campaign multiple inside a campaign period,
 *      1.09 on a weekend, and 1 otherwise.
 *   2. Own dates cost  = sum of day rates over the range, less the duration
 *      deal (5% for a full week, 10% for a full month).
 *   3. Campaign cost   = campaign day rate × days, less 15% when the whole
 *      period is taken.
 *   4. Bundle saving   = 5% off all media cost when spaces are booked together.
 *   5. Design fee      = Rs. 12,500 when Koko creates the artwork.
 *   6. Payment         = +5% on seller credit, +2% on card, −2% on JustPay.
 *
 * Rounding happens per space per day, matching the rate card, so totals are
 * always the sum of figures the advertiser could check by hand.
 */
import { campaignForDate, findCampaign, FULL_PERIOD_DISCOUNT } from "./campaigns";
import { eachDay, isWeekend, rangeLength } from "./dates";
import { getPlacements, positionMultiplier } from "./inventory";
import { PAYMENT_METHODS } from "./payment";
import type {
  BookingDraft,
  ISODate,
  Placement,
  PlacementId,
  PositionSelection,
  PriceLine,
  Quote,
} from "./types";

/** One-time fee when Koko's design team creates the artwork. */
export const DESIGN_FEE = 12_500;
/** Saving for booking two spaces together. */
export const BUNDLE_DISCOUNT = 0.05;
/** Extra demand on Saturdays and Sundays. */
export const WEEKEND_FACTOR = 1.09;
/** Duration deals offered on the advertiser's own dates. */
export const WEEK_DEAL = { label: "Full week", pct: 0.05 } as const;
export const MONTH_DEAL = { label: "Full month", pct: 0.1 } as const;

/**
 * Price multiplier for a space given the positions chosen so far. Before the
 * advertiser picks a position we quote a neutral 1.0× rather than assuming the
 * cheapest or the dearest slot.
 */
const multiplierFor = (placement: Placement, positions: PositionSelection): number => {
  const position = positions[placement.id];
  return position ? positionMultiplier(placement.id, position) : 1;
};

/** How much demand a single date carries: campaign multiple, weekend, or flat. */
export const dayFactor = (iso: ISODate): number => {
  const campaign = campaignForDate(iso);
  if (campaign) return campaign.multiple;
  return isWeekend(iso) ? WEEKEND_FACTOR : 1;
};

/** Combined rate for one date across all selected spaces. */
export const dayRate = (
  placementIds: readonly PlacementId[],
  positions: PositionSelection,
  iso: ISODate,
): number => {
  const factor = dayFactor(iso);
  return getPlacements(placementIds).reduce(
    (total, placement) =>
      total + Math.round(placement.basePrice * multiplierFor(placement, positions) * factor),
    0,
  );
};

/** Undiscounted cost of an inclusive own-date range. */
export const rangeCost = (
  placementIds: readonly PlacementId[],
  positions: PositionSelection,
  startISO: ISODate,
  endISO: ISODate,
): number =>
  eachDay(startISO, endISO).reduce(
    (total, iso) => total + dayRate(placementIds, positions, iso),
    0,
  );

/** Combined daily rate inside a campaign period, at that campaign's multiple. */
export const campaignDayRate = (
  placementIds: readonly PlacementId[],
  positions: PositionSelection,
  multiple: number,
): number =>
  getPlacements(placementIds).reduce(
    (total, placement) =>
      total + Math.round(placement.basePrice * multiplierFor(placement, positions) * multiple),
    0,
  );

/** Cost of taking `days` of a campaign, with the full-period saving when whole. */
export const campaignCost = (
  placementIds: readonly PlacementId[],
  positions: PositionSelection,
  campaignId: string,
  days: number,
  full: boolean,
): number => {
  const campaign = findCampaign(campaignId);
  if (!campaign) return 0;
  const perDay = campaignDayRate(placementIds, positions, campaign.multiple);
  return full
    ? Math.round(perDay * campaign.periodDays * (1 - FULL_PERIOD_DISCOUNT))
    : perDay * days;
};

/** Combined views per day across the selected spaces, at their position multipliers. */
export const viewsPerDay = (
  placementIds: readonly PlacementId[],
  positions: PositionSelection,
): number =>
  getPlacements(placementIds).reduce(
    (total, placement) => total + placement.vpd * multiplierFor(placement, positions),
    0,
  );

/** True when any selected space needs artwork, which is what adds the Assets step. */
export const needsCreative = (placementIds: readonly PlacementId[]): boolean =>
  getPlacements(placementIds).some((p) => p.creative === "banner");

/** True once every selected space has a position, which gates the Positions step. */
export const positionsComplete = (
  placementIds: readonly PlacementId[],
  positions: PositionSelection,
): boolean => placementIds.length > 0 && placementIds.every((id) => Boolean(positions[id]));

/** True once the advertiser has chosen any dates at all. */
export const hasPeriod = (draft: BookingDraft): boolean =>
  Boolean(draft.startISO && draft.endISO) || draft.campaigns.length > 0;

/**
 * Which parts of the price are live yet. The funnel reveals the design fee only
 * once the advertiser reaches Assets, and payment adjustments only at Payment,
 * so the total never moves for a reason they have not seen.
 */
export interface QuoteStage {
  readonly includeDesignFee: boolean;
  readonly includePaymentAdjustment: boolean;
}

const FULL_STAGE: QuoteStage = { includeDesignFee: true, includePaymentAdjustment: true };

const EMPTY_QUOTE: Quote = {
  mediaGross: 0,
  durationSaving: 0,
  campaignSaving: 0,
  bundleSaving: 0,
  mediaNet: 0,
  designFee: 0,
  subtotal: 0,
  paymentFee: 0,
  paymentDiscount: 0,
  total: 0,
  totalSavings: 0,
  days: 0,
  views: 0,
  lines: [],
};

/** Price a draft. The one function the whole funnel reads its numbers from. */
export const quote = (draft: BookingDraft, stage: QuoteStage = FULL_STAGE): Quote => {
  const { placementIds, positions, startISO, endISO } = draft;
  if (!hasPeriod(draft) || placementIds.length === 0) return EMPTY_QUOTE;

  const lines: PriceLine[] = [];

  // 1 and 2: the advertiser's own dates.
  const ownDays = startISO && endISO ? rangeLength(startISO, endISO) : 0;
  const ownGross = startISO && endISO ? rangeCost(placementIds, positions, startISO, endISO) : 0;
  const durationSaving = draft.durationDeal
    ? ownGross - Math.round(ownGross * (1 - draft.durationDeal.pct))
    : 0;

  // 3: campaign weeks.
  let campaignGross = 0;
  let campaignSaving = 0;
  let campaignDays = 0;
  let campaignViews = 0;
  for (const selection of draft.campaigns) {
    const campaign = findCampaign(selection.id);
    if (!campaign) continue;
    const perDay = campaignDayRate(placementIds, positions, campaign.multiple);
    const gross = perDay * (selection.full ? campaign.periodDays : selection.days);
    const net = campaignCost(placementIds, positions, selection.id, selection.days, selection.full);
    campaignGross += gross;
    campaignSaving += gross - net;
    campaignDays += selection.full ? campaign.periodDays : selection.days;
    campaignViews +=
      viewsPerDay(placementIds, positions) *
      (selection.full ? campaign.periodDays : selection.days) *
      campaign.multiple;
  }

  const mediaGross = ownGross + campaignGross;
  const afterPeriodSavings = mediaGross - durationSaving - campaignSaving;

  // 4: the bundle saving applies to all media cost, and only with two or more spaces.
  const bundleActive = draft.bundleApplied && placementIds.length > 1;
  const bundleSaving = bundleActive ? Math.round(afterPeriodSavings * BUNDLE_DISCOUNT) : 0;
  const mediaNet = afterPeriodSavings - bundleSaving;

  // 5: artwork.
  const designFee =
    stage.includeDesignFee && needsCreative(placementIds) && draft.creative === "koko"
      ? DESIGN_FEE
      : 0;

  const subtotal = mediaNet + designFee;

  // 6: how they pay.
  const method = PAYMENT_METHODS.find((m) => m.id === draft.payment);
  const adjustment =
    stage.includePaymentAdjustment && method ? Math.round(subtotal * method.pct) : 0;
  const paymentFee = method?.adjustment === "fee" ? adjustment : 0;
  const paymentDiscount = method?.adjustment === "discount" ? adjustment : 0;

  const total = subtotal + paymentFee - paymentDiscount;
  const ownViews = viewsPerDay(placementIds, positions) * ownDays;

  lines.push({ id: "media", label: "Slot charge", amount: mediaGross, kind: "charge" });
  if (durationSaving > 0)
    lines.push({
      id: "duration",
      label: `${draft.durationDeal?.label} saving`,
      amount: durationSaving,
      kind: "saving",
    });
  if (campaignSaving > 0)
    lines.push({
      id: "campaign",
      label: "Full campaign period saving",
      amount: campaignSaving,
      kind: "saving",
    });
  if (bundleSaving > 0)
    lines.push({ id: "bundle", label: "Bundle saving", amount: bundleSaving, kind: "saving" });
  if (designFee > 0)
    lines.push({ id: "design", label: "Design service", amount: designFee, kind: "charge" });
  if (paymentFee > 0)
    lines.push({
      id: "payment-fee",
      label: method?.adjustmentLabel ?? "Payment fee",
      amount: paymentFee,
      kind: "fee",
    });
  if (paymentDiscount > 0)
    lines.push({
      id: "payment-discount",
      label: method?.adjustmentLabel ?? "Payment discount",
      amount: paymentDiscount,
      kind: "saving",
    });

  return {
    mediaGross,
    durationSaving,
    campaignSaving,
    bundleSaving,
    mediaNet,
    designFee,
    subtotal,
    paymentFee,
    paymentDiscount,
    total,
    totalSavings: durationSaving + campaignSaving + bundleSaving,
    days: ownDays + campaignDays,
    views: Math.round(ownViews + campaignViews),
    lines,
  };
};

/**
 * What a week of the current selection would cost and deliver, used as the
 * baseline estimate before any dates are picked.
 */
export const weeklyBaseline = (
  placementIds: readonly PlacementId[],
  positions: PositionSelection,
): { views: number; price: number } => ({
  views: Math.round(viewsPerDay(placementIds, positions) * 7),
  price: getPlacements(placementIds).reduce((total, p) => total + p.weekly, 0),
});
