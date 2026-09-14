/**
 * The rate card: what Koko sells, what it costs, and how much traffic it sees.
 *
 * In production this comes from the ops-configured inventory service. It is a
 * frozen module here so the prototype has one honest source of truth rather
 * than numbers scattered through the UI.
 */
import type { Placement, PlacementId } from "./types";

export const PLACEMENTS: readonly Placement[] = [
  {
    id: "hero",
    name: "Hero banner",
    unit: "Slide",
    location: "Top of the Koko home screen",
    description: "The first thing shoppers see when they open Koko.",
    details:
      "The hero banner is the full-width carousel at the very top of the Koko home screen. It is the single most seen surface in the app. Every shopper who opens Koko sees it before anything else, which makes it the strongest space for launches and big offers.",
    weeklyImpressions: 480_000,
    basePrice: 18_500,
    vpd: 68_600,
    weekly: 129_500,
    positionCount: 5,
    availablePositions: [1, 2, 5],
    creative: "banner",
    badge: { label: "Most popular", tone: "brand" },
  },
  {
    id: "secondary",
    name: "Secondary banner",
    unit: "Slide",
    location: "Koko home, below featured stores",
    description: "Same size as the hero, a few scrolls down the home page.",
    details:
      "The secondary banner sits a few scrolls down the home page, after the featured stores. It reaches shoppers who are already browsing with intent, at a noticeably lower price than the hero.",
    weeklyImpressions: 295_000,
    basePrice: 11_200,
    vpd: 42_100,
    weekly: 78_400,
    positionCount: 5,
    availablePositions: [1, 2, 3, 4, 5],
    creative: "banner",
    promo: { label: "5% off", wasPrice: 82_500 },
  },
  {
    id: "trending",
    name: "Trending",
    unit: "Card",
    location: "Trending stores on home",
    description: "Your existing store card, placed where shoppers browse what is popular.",
    details:
      "Trending places your existing store card in the row shoppers browse when they want what is popular right now. No artwork needed, your store thumbnail is the creative.",
    weeklyImpressions: 210_000,
    basePrice: 7_600,
    vpd: 30_000,
    weekly: 53_200,
    positionCount: 20,
    availablePositions: Array.from({ length: 12 }, (_, i) => i + 1),
    creative: "existing",
    badge: { label: "Best value", tone: "green" },
  },
  {
    id: "search",
    name: "Empty search",
    unit: "Slot",
    location: "Shown when a search finds nothing",
    description: "Your store suggested when a search comes up empty.",
    details:
      "When a search returns no results, Koko suggests stores instead. Your store appears in that suggestion row, reaching shoppers at the exact moment they are looking for something to buy.",
    weeklyImpressions: 96_000,
    basePrice: 3_560,
    vpd: 13_700,
    weekly: 24_900,
    positionCount: 4,
    availablePositions: [1, 2, 3, 4],
    creative: "existing",
    promo: { label: "10% off", wasPrice: 27_700 },
  },
  {
    id: "shop",
    name: "Shop page banner",
    unit: "Slot",
    location: "Inside other shop pages",
    description: "A banner inside shop pages in your category.",
    details:
      "A banner shown inside other shop pages in your category. Shoppers comparing similar stores see your banner while they browse, which is ideal for winning over undecided buyers.",
    weeklyImpressions: 140_000,
    basePrice: 5_530,
    vpd: 20_000,
    weekly: 38_700,
    positionCount: 10,
    availablePositions: [1, 4, 6, 9],
    creative: "banner",
  },
  {
    id: "checkout",
    name: "Post-checkout card",
    unit: "Card",
    location: "After a completed order",
    description: "Reach shoppers right when they finish buying.",
    details:
      "Shown right after a shopper completes an order, when they are most engaged. Your store card appears in the post-checkout row and catches shoppers at their highest buying momentum.",
    weeklyImpressions: 72_000,
    basePrice: 2_790,
    vpd: 10_300,
    weekly: 19_500,
    positionCount: 20,
    availablePositions: Array.from({ length: 20 }, (_, i) => i + 1),
    creative: "existing",
  },
] as const;

const BY_ID = new Map<PlacementId, Placement>(PLACEMENTS.map((p) => [p.id, p]));

/** Look up a placement, throwing on an unknown id so bad data fails loudly. */
export const getPlacement = (id: PlacementId): Placement => {
  const placement = BY_ID.get(id);
  if (!placement) throw new Error(`Unknown placement: ${id}`);
  return placement;
};

/** Resolve a list of ids to placements, in rate-card order and without gaps. */
export const getPlacements = (ids: readonly PlacementId[]): Placement[] =>
  PLACEMENTS.filter((p) => ids.includes(p.id));

export const isPlacementId = (value: string): value is PlacementId =>
  BY_ID.has(value as PlacementId);

/** What a single unit of this space is called in position lists: "Slide 2", "Card 4". */
export const POSITION_NOUN: Record<PlacementId, string> = {
  hero: "Hero banner",
  secondary: "Banner",
  trending: "Card",
  search: "Slot",
  shop: "Slot",
  checkout: "Card",
};

/**
 * How much more engagement an earlier position typically earns. Prototype
 * placeholders standing in for the platform benchmarks service.
 */
export const ENGAGEMENT_LADDER = [3.0, 2.1, 1.6, 1.3, 1.15, 1.1, 1.05, 1.0] as const;

export const engagementAt = (position: number): number =>
  ENGAGEMENT_LADDER[Math.min(position, ENGAGEMENT_LADDER.length) - 1];

/**
 * Price multiplier for a position. Only the hero carousel charges more for the
 * front of the rotation; every other space is flat.
 */
export const positionMultiplier = (id: PlacementId, position: number): number => {
  if (id !== "hero") return 1;
  if (position === 1) return 1.35;
  if (position === 2) return 1.15;
  return 1;
};

/** Which space Koko suggests pairing with each one, for the bundle offer. */
export const BUNDLE_PARTNER: Record<PlacementId, PlacementId> = {
  hero: "checkout",
  secondary: "trending",
  trending: "checkout",
  search: "trending",
  shop: "trending",
  checkout: "hero",
};

/** Headline traffic figures shown on the landing page. */
export const AUDIENCE_METRICS = [
  {
    label: "People using Koko",
    value: "2.5M",
    note: "Installed on iOS and Android",
    icon: "people",
  },
  {
    label: "Average number of shoppers every month",
    value: "600K",
    note: "Active and browsing",
    icon: "shoppers",
  },
  {
    label: "New users every month",
    value: "35K",
    note: "Fresh shoppers every month, on average",
    icon: "newUsers",
  },
] as const;
