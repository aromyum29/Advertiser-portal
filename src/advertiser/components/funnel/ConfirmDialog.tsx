/**
 * The last look before anything is charged.
 *
 * The booking is final and non-refundable, so the primary action on the payment
 * step opens this rather than paying outright. It restates what is being bought,
 * what it costs, and that there is no way back.
 */
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { describeDatesShort, describePlacements } from "../../domain/bookings";
import { money } from "../../domain/format";
import { getPaymentMethod } from "../../domain/payment";
import { quote } from "../../domain/pricing";
import type { BookingDraft } from "../../domain/types";

export function ConfirmDialog({
  open,
  draft,
  onCancel,
  onConfirm,
}: {
  open: boolean;
  draft: BookingDraft;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  const total = quote(draft).total;
  const rows: [string, string][] = [
    [
      draft.placementIds.length > 1 ? "Spaces" : "Space",
      describePlacements(draft.placementIds, draft.positions),
    ],
    ["Dates", describeDatesShort(draft)],
    ["Payment", getPaymentMethod(draft.payment).label],
    ["Total", money(total)],
  ];

  return (
    <Dialog open={open} onOpenChange={(next) => !next && onCancel()}>
      <DialogContent className="sm:max-w-md">
        <DialogTitle className="text-lg font-bold tracking-tight">Confirm and pay?</DialogTitle>
        <DialogDescription className="text-sm text-muted-foreground">
          One last look before we charge you.
        </DialogDescription>

        <dl className="flex flex-col divide-y divide-border/40 rounded-xl border border-border/60 text-sm">
          {rows.map(([label, value]) => (
            <div key={label} className="flex items-center justify-between gap-4 px-4 py-2.5">
              <dt className="flex-shrink-0 text-muted-foreground">{label}</dt>
              <dd
                className={
                  label === "Total"
                    ? "text-right text-base font-bold tabular-nums"
                    : "text-right font-bold"
                }
              >
                {value}
              </dd>
            </div>
          ))}
        </dl>

        <p className="text-xs font-semibold leading-relaxed text-amber-700 dark:text-amber-400">
          This booking is final. No cancellations and no refunds.
        </p>

        <div className="flex flex-col gap-2">
          <button
            type="button"
            onClick={onConfirm}
            className="w-full rounded-lg bg-gray-900 px-6 py-3 text-sm font-bold text-white shadow-sm transition-colors hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-200"
          >
            Yes, confirm and pay {money(total)}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="w-full rounded-lg border border-border px-6 py-2.5 text-sm font-medium transition-colors hover:border-gray-900 dark:hover:border-gray-200"
          >
            Go back
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
