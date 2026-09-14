/**
 * The last step: review, then pay.
 *
 * Every row that came from an earlier decision carries an Edit link back to the
 * step that set it, so changing your mind never means starting again. The
 * finality notice appears here and again in the summary, because "no refunds"
 * is the single most important thing on the page.
 */
import { Link, useNavigate } from "@tanstack/react-router";

import { cn } from "@/lib/utils";
import { findCampaign, FULL_PERIOD_DISCOUNT } from "../../domain/campaigns";
import { describePlacements } from "../../domain/bookings";
import { longRange } from "../../domain/dates";
import { compact, days as daysLabel, money, percent } from "../../domain/format";
import { PAYMENT_METHODS, UPCOMING_PAYOUT } from "../../domain/payment";
import { BUNDLE_DISCOUNT, DESIGN_FEE, needsCreative, quote } from "../../domain/pricing";
import { rangeLength } from "../../domain/dates";
import { useBookingDraft } from "../../state/booking-draft";
import { FinalSaleNotice, Panel, Radio, SectionHeading, Tag } from "../primitives";
import { PaymentMark } from "../primitives/marks";

interface ReviewRow {
  readonly label: string;
  readonly value: string;
  /** Where the Edit link goes, or undefined for rows nothing sets directly. */
  readonly editPath?: string;
}

export function PaymentStep() {
  const { draft, dispatch } = useBookingDraft();
  const navigate = useNavigate();

  const priced = quote(draft);
  const multi = draft.placementIds.length > 1;
  const banner = needsCreative(draft.placementIds);

  const rows: ReviewRow[] = [
    {
      label: multi ? "Spaces" : "Space",
      value: describePlacements(draft.placementIds, draft.positions),
      editPath: "/book/positions",
    },
  ];

  if (draft.startISO && draft.endISO) {
    rows.push({
      label: "Custom dates",
      value: `${longRange(draft.startISO, draft.endISO)} (${daysLabel(rangeLength(draft.startISO, draft.endISO))})`,
      editPath: "/book/dates",
    });
  }

  for (const selection of draft.campaigns) {
    const campaign = findCampaign(selection.id);
    if (!campaign) continue;
    rows.push({
      label: campaign.name,
      value: selection.full
        ? `Full period · ${daysLabel(campaign.periodDays)} · saved ${percent(FULL_PERIOD_DISCOUNT)}`
        : `${selection.days} of ${campaign.periodDays} days`,
      editPath: "/book/dates",
    });
  }

  if (draft.durationDeal) {
    rows.push({
      label: "Duration deal",
      value: `${draft.durationDeal.label} · saved ${percent(draft.durationDeal.pct)}`,
      editPath: "/book/dates",
    });
  }

  if (draft.bundleApplied && multi) {
    rows.push({
      label: "Bundle deal",
      value: `Spaces booked together · saved ${percent(BUNDLE_DISCOUNT)}`,
      editPath: "/book/positions",
    });
  }

  rows.push({
    label: "Estimated views",
    value: `${compact(priced.views)} over ${daysLabel(priced.days)}`,
  });
  // Gross then savings, matching the summary beside it: one booking should not
  // show two different numbers under the same label.
  rows.push({ label: "Slot charge", value: money(priced.mediaGross) });
  if (priced.totalSavings > 0) {
    rows.push({ label: "Savings", value: `− ${money(priced.totalSavings)}` });
  }

  if (banner) {
    rows.push({
      label: "Design service",
      value: draft.creative === "koko" ? money(DESIGN_FEE) : "Own upload, spec checked",
      editPath: "/book/assets",
    });
  }

  return (
    <div className="flex flex-col gap-7">
      <Panel className="flex flex-col gap-5">
        <SectionHeading
          title="Review your booking"
          subtitle="Nothing is charged until you confirm."
        />
        <dl className="flex flex-col">
          {rows.map((row) => (
            <div
              key={row.label}
              className="flex flex-wrap items-center justify-between gap-3 border-b border-border/40 py-3.5 last:border-0 sm:gap-5"
            >
              <dt className="flex-shrink-0 text-sm text-muted-foreground">{row.label}</dt>
              <dd className="ml-auto flex min-w-0 items-center gap-3">
                <span className="min-w-0 break-words text-right text-sm font-bold">
                  {row.value}
                </span>
                {row.editPath && (
                  <Link
                    to={row.editPath}
                    aria-label={`Edit ${row.label.toLowerCase()}`}
                    className="flex-shrink-0 text-xs font-semibold text-muted-foreground underline underline-offset-2 transition-colors hover:text-foreground"
                  >
                    Edit
                  </Link>
                )}
              </dd>
            </div>
          ))}
        </dl>
      </Panel>

      <Panel>
        <h2 className="text-[19px] font-bold tracking-tight">How would you like to pay?</h2>
        <div role="radiogroup" aria-label="Payment method" className="mt-4 space-y-2.5">
          {PAYMENT_METHODS.map((method) => {
            const active = draft.payment === method.id;
            const amount = Math.round(priced.subtotal * method.pct);
            return (
              <button
                key={method.id}
                type="button"
                role="radio"
                aria-checked={active}
                onClick={() => dispatch({ type: "setPayment", method: method.id })}
                className={cn(
                  "flex w-full items-start gap-3.5 rounded-xl border-[1.5px] p-5 text-left transition-colors duration-150",
                  active
                    ? "border-gray-900 dark:border-gray-200"
                    : "border-border hover:border-gray-400",
                )}
              >
                <span className="mt-0.5">
                  <Radio on={active} />
                </span>
                <span className="flex min-w-0 flex-1 flex-col gap-1.5">
                  <span className="flex flex-wrap items-center gap-2.5 text-sm font-bold">
                    {method.label}
                    {method.badge && <Tag>{method.badge}</Tag>}
                  </span>
                  <span className="block text-xs text-muted-foreground">{method.caption}</span>
                  <span
                    className={cn(
                      "block text-xs font-semibold tabular-nums",
                      method.adjustment === "discount"
                        ? "text-emerald-700 dark:text-emerald-400"
                        : "text-[#1A3A6B] dark:text-blue-300",
                    )}
                  >
                    {method.adjustment === "discount"
                      ? `${percent(method.pct)} discount`
                      : `+${percent(method.pct)} ${method.id === "credit" ? "convenience fee" : "card fee"}`}
                    {active &&
                      ` · ${method.adjustment === "discount" ? "−" : "+"} ${money(amount)}`}
                  </span>
                </span>
                <span className="mt-0.5 flex flex-shrink-0 items-center">
                  <PaymentMark id={method.id} />
                </span>
              </button>
            );
          })}
        </div>

        {draft.payment === "credit" && (
          <dl className="mt-3 space-y-2 rounded-lg border border-border/40 bg-muted/30 p-4 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Upcoming payout · {UPCOMING_PAYOUT.date}</dt>
              <dd className="font-medium tabular-nums">{money(UPCOMING_PAYOUT.amount)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Convenience fee (5%)</dt>
              <dd className="font-medium tabular-nums">+ {money(priced.paymentFee)}</dd>
            </div>
            <div className="flex justify-between border-t border-border/40 pt-2">
              <dt className="text-muted-foreground">After this booking</dt>
              <dd className="font-semibold tabular-nums">
                {money(UPCOMING_PAYOUT.amount - priced.total)}
              </dd>
            </div>
          </dl>
        )}

        {draft.payment === "justpay" && (
          <div className="mt-3 flex justify-between rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm dark:border-emerald-800 dark:bg-emerald-950/30">
            <span className="font-semibold text-emerald-800 dark:text-emerald-300">
              JustPay discount (2%)
            </span>
            <span className="font-bold tabular-nums text-emerald-800 dark:text-emerald-300">
              − {money(priced.paymentDiscount)}
            </span>
          </div>
        )}
      </Panel>

      <FinalSaleNotice />

      {draft.placementIds.length === 0 && (
        <button
          type="button"
          onClick={() => void navigate({ to: "/" })}
          className="self-start text-sm font-semibold underline underline-offset-2"
        >
          Go back and pick a space
        </button>
      )}
    </div>
  );
}
