/**
 * The running total.
 *
 * Deliberately placed after the step content rather than beside it: the
 * advertiser should read what they are choosing, then what it adds up to, then
 * the button that commits them. It shows Rs. 0.00 until dates exist rather
 * than guessing, and only reveals the design fee and payment adjustment once
 * the steps that set them have been reached.
 */
import { Link } from "@tanstack/react-router";

import { cn } from "@/lib/utils";
import { describeDatesShort } from "../../domain/bookings";
import { days as daysLabel, compact, money } from "../../domain/format";
import { getPlacements, POSITION_NOUN } from "../../domain/inventory";
import { SLOT_HOLD_MINUTES } from "../../domain/payment";
import { hasPeriod, quote, viewsPerDay, type QuoteStage } from "../../domain/pricing";
import type { BookingDraft } from "../../domain/types";
import { previousStep, type Step, type StepId } from "../../state/funnel";
import { DoneChip, FinalSaleNotice, TodoChip } from "../primitives";

export function SummaryRail({
  draft,
  stage,
  steps,
  current,
  reference,
  primaryLabel,
  primaryDisabled,
  onPrimary,
}: {
  draft: BookingDraft;
  stage: QuoteStage;
  steps: readonly Step[];
  current: StepId;
  reference: string;
  primaryLabel: string;
  primaryDisabled: boolean;
  onPrimary: () => void;
}) {
  const priced = quote(draft, stage);
  const selected = getPlacements(draft.placementIds);
  const periodChosen = hasPeriod(draft);
  const back = previousStep(steps, current);
  const onPayment = current === "payment";
  const positionsReached =
    steps.findIndex((s) => s.id === current) >= steps.findIndex((s) => s.id === "positions");

  return (
    <aside
      aria-label="Booking summary"
      className="flex flex-col gap-[18px] rounded-[18px] border border-border/60 bg-card p-6"
    >
      <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-muted-foreground">
        Booking summary
      </p>

      <div className="flex flex-col gap-2.5">
        {selected.length === 0 && (
          <p className="text-sm text-muted-foreground">No spaces picked yet</p>
        )}
        {selected.map((placement) => {
          const position = draft.positions[placement.id];
          return (
            <div key={placement.id} className="flex items-center justify-between gap-3">
              <p className="truncate text-sm font-bold leading-tight">{placement.name}</p>
              {position ? (
                <DoneChip>
                  {POSITION_NOUN[placement.id]} {position}
                </DoneChip>
              ) : positionsReached ? (
                <TodoChip>No position</TodoChip>
              ) : null}
            </div>
          );
        })}
      </div>

      <dl className="flex flex-col gap-2.5 border-t border-border/40 pt-4">
        <div className="flex justify-between gap-3 text-sm">
          <dt className="text-muted-foreground">Dates</dt>
          <dd className="text-right font-bold">{describeDatesShort(draft)}</dd>
        </div>

        {periodChosen && (
          <div className="flex justify-between gap-3 text-sm">
            <dt className="text-muted-foreground">Slot charge</dt>
            <dd className="font-bold tabular-nums">{money(priced.mediaGross)}</dd>
          </div>
        )}

        {priced.totalSavings > 0 && (
          <div className="flex justify-between gap-3 text-sm text-emerald-700 dark:text-emerald-400">
            <dt>Savings</dt>
            <dd className="font-bold tabular-nums">− {money(priced.totalSavings)}</dd>
          </div>
        )}

        {priced.designFee > 0 && (
          <div className="flex justify-between gap-3 text-sm">
            <dt className="text-muted-foreground">Design</dt>
            <dd className="font-bold tabular-nums">+ {money(priced.designFee)}</dd>
          </div>
        )}

        {priced.paymentFee > 0 && (
          <div className="flex justify-between gap-3 text-sm">
            <dt className="text-muted-foreground">
              {draft.payment === "credit" ? "Convenience fee (5%)" : "Card fee (2%)"}
            </dt>
            <dd className="font-bold tabular-nums">+ {money(priced.paymentFee)}</dd>
          </div>
        )}

        {priced.paymentDiscount > 0 && (
          <div className="flex justify-between gap-3 text-sm text-emerald-700 dark:text-emerald-400">
            <dt>JustPay discount (2%)</dt>
            <dd className="font-bold tabular-nums">− {money(priced.paymentDiscount)}</dd>
          </div>
        )}

        <div className="flex justify-between gap-3 text-sm">
          <dt className="text-muted-foreground">Estimated views</dt>
          <dd className="font-bold tabular-nums">
            {periodChosen
              ? compact(priced.views)
              : `${compact(viewsPerDay(draft.placementIds, draft.positions) * 7)} / week`}
          </dd>
        </div>
      </dl>

      <div className="border-t border-border/40 pt-4">
        <p className="text-xs font-bold uppercase tracking-[0.1em] text-muted-foreground">Total</p>
        <p className="mt-0.5 whitespace-nowrap text-[30px] font-bold tracking-tight tabular-nums">
          {periodChosen ? money(priced.total) : "Rs. 0.00"}
        </p>
        <p className="mt-0.5 text-xs text-muted-foreground">
          {periodChosen
            ? `${daysLabel(priced.days)}${priced.designFee > 0 ? " + design" : ""}`
            : "Updates when you pick your dates"}
        </p>
      </div>

      {onPayment && <FinalSaleNotice compact />}

      <button
        type="button"
        onClick={onPrimary}
        disabled={primaryDisabled}
        className={cn(
          "w-full whitespace-nowrap rounded-lg px-6 py-3.5 text-[15px] font-bold transition-colors",
          primaryDisabled
            ? "cursor-not-allowed bg-gray-200 text-gray-500 dark:bg-gray-700 dark:text-gray-400"
            : "bg-gray-900 text-white hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-200",
        )}
      >
        {primaryLabel}
      </button>

      {back && (
        <Link
          to={back.path}
          className="w-full rounded-lg border border-border px-6 py-3 text-center text-sm font-medium transition-colors hover:border-gray-900 dark:hover:border-gray-200"
        >
          Back
        </Link>
      )}

      <p className="text-center text-xs text-muted-foreground">
        Held for {SLOT_HOLD_MINUTES} min · {reference}
      </p>
    </aside>
  );
}
