/**
 * What one booking actually returned. Six figures, then the shape of the run.
 */
import { useNavigate } from "@tanstack/react-router";

import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { compact, count, money } from "../../domain/format";
import { conversionRate, roas, type BookingResult } from "../../domain/performance";
import { BookingResultChart } from "./PerformanceChart";

export function BookingResultDialog({
  result,
  onClose,
}: {
  result: BookingResult | null;
  onClose: () => void;
}) {
  const navigate = useNavigate();
  if (!result) return null;

  const aov = Math.round(result.value / result.orders);
  const returnOnSpend = roas(result.value, result.spend);
  const conversion = conversionRate(result.orders, result.visits);

  const stats: [string, string, string][] = [
    [
      "Store visits",
      compact(result.visits),
      `${compact(Math.round(result.visits / result.days))} a day`,
    ],
    ["Total orders", count(result.orders), `${conversion.toFixed(2)}% of visits`],
    ["Order value", money(result.value), "Attributed sales"],
    ["Average order value", money(aov), "Per attributed order"],
    [
      "Spent on advertising",
      money(result.spend),
      `${money(Math.round(result.spend / result.days))} a day`,
    ],
    [
      "Return on ad spend",
      `${returnOnSpend.toFixed(1)}×`,
      `${money(returnOnSpend)} back per Rs. 1`,
    ],
  ];

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[88vh] overflow-y-auto sm:max-w-3xl">
        <div>
          <DialogTitle className="text-xl font-bold tracking-tight">{result.name}</DialogTitle>
          <DialogDescription className="mt-0.5 text-sm text-muted-foreground">
            {result.dates} · Booking {result.id}
          </DialogDescription>
        </div>

        <dl className="mt-2 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {stats.map(([label, value, note]) => (
            <div key={label} className="rounded-xl border border-border/60 p-4">
              <dt className="text-[11px] font-bold uppercase leading-snug tracking-[0.06em] text-muted-foreground">
                {label}
              </dt>
              <dd className="mt-1.5 text-2xl font-bold tracking-tight tabular-nums">{value}</dd>
              <dd className="mt-1 text-[11px] text-muted-foreground">{note}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-1 rounded-xl border border-border/60 p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Store visits and orders by day
          </p>
          <div className="mt-4">
            <BookingResultChart series={result.series} />
          </div>
        </div>

        <div className="flex flex-col gap-2.5 sm:flex-row">
          <button
            type="button"
            onClick={() => {
              onClose();
              void navigate({ to: "/" });
            }}
            className="flex-1 rounded-lg bg-gray-900 px-6 py-3 text-sm font-bold text-white shadow-sm transition-colors hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-200"
          >
            Book this space again
          </button>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-border px-6 py-3 text-sm font-medium transition-colors hover:border-gray-900 dark:hover:border-gray-200"
          >
            Close
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
