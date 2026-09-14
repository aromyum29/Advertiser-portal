/**
 * Koko campaign weeks: shopping moments with pre-set dates that carry a
 * traffic multiple. Booking inside one costs more per day and is quoted with
 * proportionally more views, and taking a whole period earns a 15% saving.
 */
import { addDaysISO, diffDays, fromISO, MONTH_SHORT } from "./dates";
import type { CampaignPeriod, ISODate } from "./types";

/** Saving for committing to a campaign's whole period. */
export const FULL_PERIOD_DISCOUNT = 0.15;

export const CAMPAIGN_PERIODS: readonly CampaignPeriod[] = [
  {
    id: "black-friday",
    name: "Black Friday",
    dates: "23 to 30 Nov 2026",
    multiple: 2.4,
    note: "Early-bird rate ends 15 Oct",
    earlyBird: true,
    periodDays: 8,
    startISO: "2026-11-23",
    band: "#12281a",
    ink: "#eef4ee",
  },
  {
    id: "christmas",
    name: "Christmas",
    dates: "15 to 31 Dec 2026",
    multiple: 2.1,
    note: "Priority slots now open",
    earlyBird: false,
    periodDays: 17,
    startISO: "2026-12-15",
    band: "#dcd3ec",
    ink: "#241a38",
  },
  {
    id: "avurudu",
    name: "Avurudu 2027",
    dates: "5 to 18 Apr 2027",
    multiple: 2.7,
    note: "Book early for slide choice",
    earlyBird: false,
    periodDays: 14,
    startISO: "2027-04-05",
    band: "#33421f",
    ink: "#f0f4e8",
  },
  {
    id: "diwali",
    name: "Diwali",
    dates: "29 Oct to 4 Nov 2026",
    multiple: 1.9,
    note: "Strong week for fashion and gifting",
    earlyBird: false,
    periodDays: 7,
    startISO: "2026-10-29",
    band: "#3d2914",
    ink: "#f4e3c1",
  },
  {
    id: "year-end",
    name: "Year-end clearance",
    dates: "27 Dec 2026 to 3 Jan 2027",
    multiple: 1.7,
    note: "Shoppers hunting deals after Christmas",
    earlyBird: false,
    periodDays: 8,
    startISO: "2026-12-27",
    band: "#1d3a4a",
    ink: "#dcecf4",
  },
  {
    id: "back-to-school",
    name: "Back to school",
    dates: "4 to 17 Jan 2027",
    multiple: 1.5,
    note: "Two-week window, families stocking up",
    earlyBird: false,
    periodDays: 14,
    startISO: "2027-01-04",
    band: "#2a2f4a",
    ink: "#dfe3f4",
  },
  {
    id: "independence",
    name: "Independence week",
    dates: "1 to 7 Feb 2027",
    multiple: 1.4,
    note: "Long-weekend shopping bump",
    earlyBird: false,
    periodDays: 7,
    startISO: "2027-02-01",
    band: "#4a1d1d",
    ink: "#f4dcdc",
  },
  {
    id: "ramadan-eid",
    name: "Ramadan & Eid",
    dates: "10 Mar to 10 Apr 2027",
    multiple: 2.2,
    note: "Early-bird rate ends 1 Feb",
    earlyBird: true,
    periodDays: 32,
    startISO: "2027-03-10",
    band: "#1d4a3a",
    ink: "#dcf4e8",
  },
  {
    id: "vesak",
    name: "Vesak week",
    dates: "17 to 23 May 2027",
    multiple: 1.6,
    note: "Holiday week, high evening traffic",
    earlyBird: false,
    periodDays: 7,
    startISO: "2027-05-17",
    band: "#4a3a1d",
    ink: "#f4ecd0",
  },
  {
    id: "koko-birthday",
    name: "Koko Birthday",
    dates: "5 to 12 Jul 2027",
    multiple: 1.8,
    note: "Platform-wide birthday promotions",
    earlyBird: false,
    periodDays: 8,
    startISO: "2027-07-05",
    band: "#3a1d4a",
    ink: "#ecdcf4",
  },
] as const;

const BY_ID = new Map(CAMPAIGN_PERIODS.map((c) => [c.id, c]));

export const getCampaign = (id: string): CampaignPeriod => {
  const campaign = BY_ID.get(id);
  if (!campaign) throw new Error(`Unknown campaign: ${id}`);
  return campaign;
};

export const findCampaign = (id: string): CampaignPeriod | undefined => BY_ID.get(id);

/** The campaign a date falls inside, if any. Periods never overlap. */
export const campaignForDate = (iso: ISODate): CampaignPeriod | undefined =>
  CAMPAIGN_PERIODS.find((c) => {
    const offset = diffDays(c.startISO, iso);
    return offset >= 0 && offset < c.periodDays;
  });

/** Every date inside a campaign period, in order. */
export const campaignDays = (campaign: CampaignPeriod): ISODate[] =>
  Array.from({ length: campaign.periodDays }, (_, i) => addDaysISO(campaign.startISO, i));

/**
 * Day and month label for the nth day of a campaign, e.g. `{ day: 1, month: "Nov" }`
 * for the ninth day of a period starting 24 October. Rolls over month ends.
 */
export const campaignDayLabel = (
  campaign: CampaignPeriod,
  index: number,
): { day: number; month: string } => {
  const date = fromISO(addDaysISO(campaign.startISO, index));
  return { day: date.getDate(), month: MONTH_SHORT[date.getMonth()] };
};

/** Campaigns that have not already started, newest opportunity first. */
export const upcomingCampaigns = (todayISO: ISODate): CampaignPeriod[] =>
  CAMPAIGN_PERIODS.filter((c) => diffDays(todayISO, c.startISO) >= 0);
