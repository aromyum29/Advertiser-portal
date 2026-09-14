/**
 * Thank you.
 *
 * Says what was bought, what it cost, and — the part that actually matters
 * after paying — what happens next and where to watch for it.
 */
import { Link, useSearch } from "@tanstack/react-router";
import { Check } from "lucide-react";

import { days as daysLabel, money } from "../../domain/format";
import { useBookings } from "../../state/bookings";

export function ConfirmationPage() {
  const { ref } = useSearch({ from: "/_app/book/confirmation" });
  const { bookings, loading } = useBookings();
  const booking = bookings.find((b) => b.reference === ref);

  if (loading) {
    return (
      <div className="mx-auto max-w-2xl py-16 text-center" aria-busy="true">
        <p className="text-sm text-muted-foreground">Loading your booking…</p>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="mx-auto max-w-2xl rounded-2xl border border-border/60 bg-card p-8 text-center sm:p-10">
        <h1 className="text-2xl font-bold tracking-tight">We could not find that booking</h1>
        <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
          The reference {ref ? <span className="font-mono">{ref}</span> : "you followed"} is not in
          your bookings. It may have been made in a different browser.
        </p>
        <Link
          to="/bookings"
          className="mt-6 inline-flex rounded-lg bg-gray-900 px-7 py-3 text-sm font-medium text-white transition-colors hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-200"
        >
          Go to My bookings
        </Link>
      </div>
    );
  }

  const nextStep =
    booking.status === "pending"
      ? "Your creative passed the spec checks and is queued for review, which takes up to 2 business days."
      : booking.creative === "koko"
        ? "Koko's design team is creating your assets now. Approval is near-instant."
        : "Your store thumbnail is the creative, so there is nothing more to do.";

  return (
    <div className="mx-auto max-w-2xl">
      <div className="rounded-2xl border border-border/60 bg-card p-8 text-center shadow-sm sm:p-10">
        <div
          aria-hidden="true"
          className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-950"
        >
          <Check className="h-8 w-8 stroke-[3] text-emerald-600 dark:text-emerald-400" />
        </div>

        <h1 className="mt-5 text-2xl font-bold tracking-tight">
          Thank you. Your booking is confirmed
        </h1>

        <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
          Booking <span className="font-mono font-medium text-foreground">{booking.reference}</span>{" "}
          · {money(booking.spend)} · {booking.placementLabel}. {nextStep}
        </p>

        <dl className="mx-auto mt-6 grid max-w-md grid-cols-2 gap-3 text-left">
          <div className="rounded-xl border border-border/60 p-3.5">
            <dt className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              Dates
            </dt>
            <dd className="mt-1 text-sm font-bold">{booking.dateLabel}</dd>
            <dd className="text-xs text-muted-foreground">{daysLabel(booking.days)}</dd>
          </div>
          <div className="rounded-xl border border-border/60 p-3.5">
            <dt className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              Paid
            </dt>
            <dd className="mt-1 text-sm font-bold tabular-nums">{money(booking.spend)}</dd>
            <dd className="text-xs text-muted-foreground">
              {booking.payment === "credit"
                ? "Koko seller credit"
                : booking.payment === "card"
                  ? "Card"
                  : "JustPay"}
            </dd>
          </div>
        </dl>

        <p className="mt-5 text-sm font-semibold">
          Check <span className="underline underline-offset-2">My bookings</span> to see when your
          creative is approved and your ad goes live.
        </p>

        <div className="mt-6 flex flex-col justify-center gap-2 sm:flex-row">
          <Link
            to="/bookings"
            className="rounded-lg bg-gray-900 px-7 py-3 text-sm font-medium text-white transition-colors hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-200"
          >
            Check My bookings
          </Link>
          <Link
            to="/"
            className="rounded-lg border border-border px-7 py-3 text-sm font-medium transition-colors hover:border-gray-900 dark:hover:border-gray-200"
          >
            Back to Advertise
          </Link>
        </div>
      </div>
    </div>
  );
}
