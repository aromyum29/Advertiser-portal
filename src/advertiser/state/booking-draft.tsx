/**
 * The booking draft: everything the advertiser has chosen, and the rules for
 * changing it.
 *
 * All of it lives in one reducer so the interaction rules are readable in a
 * single place — picking a date range clears the duration deal, removing a
 * space cancels the bundle, choosing a campaign replaces the previous one —
 * rather than being spread across the step components that trigger them.
 */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useState,
  type ReactNode,
} from "react";

import {
  blockedReason,
  earliestStart,
  validateRange,
  type RangeProblem,
} from "../domain/availability";
import { getCampaign } from "../domain/campaigns";
import type { CreativeUpload } from "../domain/creative";
import { addDaysISO, longDate, rangeLength, toISO, startOfToday } from "../domain/dates";
import { BUNDLE_PARTNER } from "../domain/inventory";
import { MONTH_DEAL, WEEK_DEAL } from "../domain/pricing";
import type {
  BookingDraft,
  CreativeChoice,
  DurationDeal,
  ISODate,
  PaymentMethodId,
  PlacementId,
} from "../domain/types";
import { readJSON, remove, writeJSON } from "./storage";

const STORAGE_KEY = "draft";

export const EMPTY_DRAFT: BookingDraft = {
  placementIds: [],
  positions: {},
  startISO: null,
  endISO: null,
  durationDeal: null,
  campaigns: [],
  bundleApplied: false,
  creative: "koko",
  payment: "credit",
};

type Action =
  | { type: "toggleSpace"; id: PlacementId }
  | { type: "addSpace"; id: PlacementId }
  | { type: "removeSpace"; id: PlacementId }
  | { type: "clearSpaces" }
  | { type: "setPosition"; id: PlacementId; position: number }
  | { type: "setRange"; startISO: ISODate; endISO: ISODate | null }
  | { type: "extendTo"; endISO: ISODate; deal: DurationDeal }
  | { type: "clearDates" }
  | { type: "selectCampaign"; id: string; days: number; full: boolean }
  | { type: "removeCampaign"; id: string }
  | { type: "applyBundle"; partner: PlacementId }
  | { type: "setCreative"; choice: CreativeChoice }
  | { type: "setPayment"; method: PaymentMethodId }
  | { type: "restore"; draft: BookingDraft }
  | { type: "reset" };

const withoutPosition = (draft: BookingDraft, id: PlacementId) => {
  const positions = { ...draft.positions };
  delete positions[id];
  return positions;
};

export function reducer(draft: BookingDraft, action: Action): BookingDraft {
  switch (action.type) {
    case "toggleSpace": {
      const selected = draft.placementIds.includes(action.id);
      return selected
        ? reducer(draft, { type: "removeSpace", id: action.id })
        : reducer(draft, { type: "addSpace", id: action.id });
    }

    case "addSpace":
      if (draft.placementIds.includes(action.id)) return draft;
      return { ...draft, placementIds: [...draft.placementIds, action.id] };

    case "removeSpace": {
      if (!draft.placementIds.includes(action.id)) return draft;
      const placementIds = draft.placementIds.filter((id) => id !== action.id);
      return {
        ...draft,
        placementIds,
        positions: withoutPosition(draft, action.id),
        // A bundle is a discount for booking two spaces together; dropping one ends it.
        bundleApplied: placementIds.length > 1 ? draft.bundleApplied : false,
      };
    }

    case "clearSpaces":
      return { ...draft, placementIds: [], positions: {}, bundleApplied: false };

    case "setPosition":
      return { ...draft, positions: { ...draft.positions, [action.id]: action.position } };

    case "setRange":
      // Any change to the dates invalidates a deal that was priced off the old ones.
      return { ...draft, startISO: action.startISO, endISO: action.endISO, durationDeal: null };

    case "extendTo":
      return { ...draft, endISO: action.endISO, durationDeal: action.deal };

    case "clearDates":
      return { ...draft, startISO: null, endISO: null, durationDeal: null };

    case "selectCampaign":
      // One campaign per booking: choosing another replaces it.
      return { ...draft, campaigns: [{ id: action.id, days: action.days, full: action.full }] };

    case "removeCampaign":
      return { ...draft, campaigns: draft.campaigns.filter((c) => c.id !== action.id) };

    case "applyBundle":
      if (draft.placementIds.includes(action.partner)) return { ...draft, bundleApplied: true };
      return {
        ...draft,
        placementIds: [...draft.placementIds, action.partner],
        bundleApplied: true,
      };

    case "setCreative":
      return { ...draft, creative: action.choice };

    case "setPayment":
      return { ...draft, payment: action.method };

    case "restore":
      // Trust only the shape, not the contents: an old draft from a previous
      // release should not be able to put the funnel into an impossible state.
      return { ...EMPTY_DRAFT, ...action.draft };

    case "reset":
      return EMPTY_DRAFT;
  }
}

/** Plain-language explanation of why a date cannot be used. */
export const explainProblem = (problem: RangeProblem): string => {
  switch (problem.kind) {
    case "lead":
      return `Bookings need 3 days for approval. The earliest start is ${longDate(problem.earliestISO)}.`;
    case "booked":
      return `${longDate(problem.iso)} is already booked. Pick around it.`;
    case "crosses-booked":
      return "That range crosses a booked date. Pick around it.";
  }
};

interface DraftValue {
  readonly draft: BookingDraft;
  /** Local midnight today, resolved once so the whole funnel agrees on "today". */
  readonly todayISO: ISODate;
  /** Why the last date tap was refused, or null. */
  readonly dateHint: string | null;
  readonly upload: CreativeUpload | null;
  /** False until any saved draft has been read back, so guards do not fire early. */
  readonly restored: boolean;
  dispatch(action: Action): void;
  /** Tap a day in the calendar: sets the start, then the end, refusing blocked days. */
  pickDay(iso: ISODate): void;
  /** Add Koko's suggested partner space and take the bundle saving. */
  takeBundle(): void;
  /** The space Koko suggests pairing with the current selection, if any. */
  readonly bundlePartner: PlacementId | null;
  setUpload(upload: CreativeUpload | null): void;
  reset(): void;
}

const DraftContext = createContext<DraftValue | null>(null);

export function BookingDraftProvider({ children }: { children: ReactNode }) {
  const [draft, dispatch] = useReducer(reducer, EMPTY_DRAFT);
  const [dateHint, setDateHint] = useState<string | null>(null);
  const [upload, setUpload] = useState<CreativeUpload | null>(null);
  const [restored, setRestored] = useState(false);

  // A half-finished booking survives a reload. Restored on the client only, so
  // the server-rendered markup and the first client render still agree.
  useEffect(() => {
    const saved = readJSON<BookingDraft | null>(STORAGE_KEY, null);
    if (saved) dispatch({ type: "restore", draft: saved });
    setRestored(true);
  }, []);

  useEffect(() => {
    if (!restored) return;
    if (draft === EMPTY_DRAFT) remove(STORAGE_KEY);
    else writeJSON(STORAGE_KEY, draft);
  }, [draft, restored]);

  // Resolved once per mount: the funnel should not change its mind about
  // "today" partway through a booking.
  const todayISO = useMemo(() => toISO(startOfToday()), []);

  const pickDay = useCallback(
    (iso: ISODate) => {
      const reason = blockedReason(iso, todayISO);
      if (reason === "lead") {
        setDateHint(explainProblem({ kind: "lead", earliestISO: earliestStart(todayISO) }));
        return;
      }
      if (reason === "booked") {
        setDateHint(explainProblem({ kind: "booked", iso }));
        return;
      }

      // First tap, or a fresh start after a complete range: this becomes the start.
      const startingOver = !draft.startISO || Boolean(draft.endISO) || iso < draft.startISO;
      if (startingOver) {
        setDateHint(null);
        dispatch({ type: "setRange", startISO: iso, endISO: null });
        return;
      }

      const problem = validateRange(draft.startISO, iso, todayISO);
      if (problem) {
        setDateHint(explainProblem(problem));
        return;
      }
      setDateHint(null);
      dispatch({ type: "setRange", startISO: draft.startISO, endISO: iso });
    },
    [draft.startISO, draft.endISO, todayISO],
  );

  const bundlePartner = useMemo<PlacementId | null>(() => {
    // Koko only suggests a pairing while exactly one space is selected.
    if (draft.placementIds.length !== 1 || draft.bundleApplied) return null;
    return BUNDLE_PARTNER[draft.placementIds[0]];
  }, [draft.placementIds, draft.bundleApplied]);

  const takeBundle = useCallback(() => {
    if (bundlePartner) dispatch({ type: "applyBundle", partner: bundlePartner });
  }, [bundlePartner]);

  const reset = useCallback(() => {
    dispatch({ type: "reset" });
    remove(STORAGE_KEY);
    setDateHint(null);
    setUpload(null);
  }, []);

  const value = useMemo<DraftValue>(
    () => ({
      draft,
      todayISO,
      dateHint,
      upload,
      restored,
      dispatch,
      pickDay,
      takeBundle,
      bundlePartner,
      setUpload,
      reset,
    }),
    [draft, todayISO, dateHint, upload, restored, pickDay, takeBundle, bundlePartner, reset],
  );

  return <DraftContext.Provider value={value}>{children}</DraftContext.Provider>;
}

export function useBookingDraft(): DraftValue {
  const value = useContext(DraftContext);
  if (!value) throw new Error("useBookingDraft must be used inside a BookingDraftProvider");
  return value;
}

/**
 * The duration upsell on offer for the current range, if any. One at a time:
 * short bookings are nudged to a week, week-ish bookings to a month, and a
 * booking already past three weeks is left alone.
 *
 * The extended range has to be bookable. Offering "make it a full week" when
 * the seventh day is already taken would either sell a slot twice or bounce
 * the advertiser with an error they could not have anticipated.
 */
export const durationUpsell = (
  draft: BookingDraft,
  todayISO: ISODate,
): { deal: DurationDeal; days: number; endISO: ISODate } | null => {
  if (!draft.startISO || !draft.endISO) return null;

  const length = rangeLength(draft.startISO, draft.endISO);
  const candidate =
    length < 7
      ? { deal: WEEK_DEAL, days: 7 }
      : length <= 21 && length >= 8
        ? { deal: MONTH_DEAL, days: 30 }
        : null;
  if (!candidate) return null;

  const endISO = addDaysISO(draft.startISO, candidate.days - 1);
  if (validateRange(draft.startISO, endISO, todayISO)) return null;

  return { ...candidate, endISO };
};

/** Days taken of a campaign period, given the chip range the advertiser dragged. */
export const campaignDaysTaken = (
  campaignId: string,
  from: number | null,
  to: number | null,
): number => {
  if (from === null) return 0;
  const campaign = getCampaign(campaignId);
  const end = to === null ? from : to;
  return Math.min(end - from + 1, campaign.periodDays);
};
