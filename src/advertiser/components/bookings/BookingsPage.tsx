/**
 * My bookings.
 *
 * Everything the advertiser has booked, newest first, with the seeded history
 * underneath. Bookings made in the funnel persist, so this is a real record
 * rather than a static table.
 *
 * A table on desktop and cards on mobile: a seven-column table squeezed onto a
 * phone is unreadable, and horizontal scrolling hides the columns that matter.
 */
import { Link, useNavigate } from "@tanstack/react-router";
import { Bell, X } from "lucide-react";
import { useState } from "react";

import { cn } from "@/lib/utils";
import { summarise } from "../../domain/bookings";
import { money } from "../../domain/format";
import type { BookingRecord } from "../../domain/types";
import { useBookings } from "../../state/bookings";
import { StatusPill } from "../primitives";
import { CampaignRecap } from "./CampaignRecap";

const COLUMNS = [
  ["Booking", "w-[120px]"],
  ["Placement", "w-[220px]"],
  ["Dates", "w-[150px]"],
  ["Status", "w-[160px]"],
  ["Spend", "w-[120px]"],
  ["Result", ""],
  ["Action", "w-[150px]"],
] as const;

export function BookingsPage() {
  const { bookings, loading } = useBookings();
  const navigate = useNavigate();

  const [recap, setRecap] = useState<BookingRecord | null>(null);
  const [waitlisted, setWaitlisted] = useState(true);

  const stats = summarise(bookings);
  const completed = bookings.find((b) => b.status === "completed");

  if (loading) {
    return (
      <div className="space-y-5" aria-busy="true">
        <Header />
        <div className="h-[72px] animate-pulse rounded-xl bg-muted/50 motion-reduce:animate-none" />
        <div className="h-64 animate-pulse rounded-xl bg-muted/50 motion-reduce:animate-none" />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <Header />

      {recap && (
        <CampaignRecap
          booking={recap}
          onClose={() => setRecap(null)}
          onBookAgain={() => {
            setRecap(null);
            void navigate({ to: "/" });
          }}
        />
      )}

      <div className="flex flex-wrap items-center gap-6 rounded-xl border border-border/40 bg-muted/30 p-4">
        {(
          [
            ["Live", String(stats.live), "text-emerald-600"],
            ["Pending approval", String(stats.pending), "text-amber-600"],
            ["Confirmed", String(stats.confirmed), ""],
            ["Completed", String(stats.completed), ""],
            ["Total spend", money(stats.totalSpend), ""],
          ] as const
        ).map(([label, value, tone], index) => (
          <div key={label} className="flex items-center gap-6">
            {index > 0 && (
              <div aria-hidden="true" className="hidden w-px self-stretch bg-border/60 sm:block" />
            )}
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                {label}
              </p>
              <p className={cn("text-xl font-bold tabular-nums", tone)}>{value}</p>
            </div>
          </div>
        ))}
      </div>

      {bookings.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          <div className="hidden overflow-hidden rounded-xl border border-border/60 bg-card md:block">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[940px] table-fixed border-separate border-spacing-0">
                <caption className="sr-only">Your advertising bookings</caption>
                <thead className="bg-muted/40">
                  <tr>
                    {COLUMNS.map(([heading, width]) => (
                      <th
                        key={heading}
                        scope="col"
                        className={cn(
                          "border-b border-border/60 px-4 py-4 text-left align-top text-xs font-semibold uppercase leading-tight tracking-wider text-muted-foreground first:pl-6 last:pr-6 last:text-right",
                          width,
                        )}
                      >
                        {heading}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((booking) => (
                    <tr key={booking.id} className="transition-colors hover:bg-muted/30">
                      <td className="whitespace-nowrap border-b border-border/40 px-4 py-3.5 font-mono text-sm font-medium first:pl-6">
                        {booking.reference}
                      </td>
                      <td className="whitespace-nowrap border-b border-border/40 px-4 py-3.5 text-sm font-medium">
                        {booking.placementLabel}
                      </td>
                      <td className="whitespace-nowrap border-b border-border/40 px-4 py-3.5 text-sm text-muted-foreground">
                        {booking.dateLabel}
                      </td>
                      <td className="whitespace-nowrap border-b border-border/40 px-4 py-3.5 text-sm">
                        <StatusPill status={booking.status} />
                      </td>
                      <td className="whitespace-nowrap border-b border-border/40 px-4 py-3.5 text-sm font-medium tabular-nums">
                        {money(booking.spend)}
                      </td>
                      <td
                        className="truncate border-b border-border/40 px-4 py-3.5 text-sm"
                        title={booking.result}
                      >
                        {booking.result}
                      </td>
                      <td className="whitespace-nowrap border-b border-border/40 px-4 py-3.5 text-right text-sm last:pr-6">
                        <RowAction booking={booking} onRecap={() => setRecap(booking)} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <ul className="flex flex-col gap-3 md:hidden">
            {bookings.map((booking) => (
              <li
                key={booking.id}
                className="flex flex-col gap-3 rounded-xl border border-border/60 bg-card p-5"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-base font-semibold">{booking.placementLabel}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {booking.dateLabel} · <span className="font-mono">{booking.reference}</span>
                    </p>
                  </div>
                  <StatusPill status={booking.status} />
                </div>
                <p className="text-sm font-medium">{booking.result}</p>
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm text-muted-foreground">
                    Spend{" "}
                    <span className="font-semibold text-foreground tabular-nums">
                      {money(booking.spend)}
                    </span>
                  </p>
                  <RowAction booking={booking} onRecap={() => setRecap(booking)} />
                </div>
              </li>
            ))}
          </ul>
        </>
      )}

      {completed && !recap && (
        <button
          type="button"
          onClick={() => setRecap(completed)}
          className="text-sm font-semibold text-muted-foreground underline underline-offset-4 transition-colors hover:text-foreground"
        >
          See the recap for {completed.reference}
        </button>
      )}

      {waitlisted && (
        <div className="flex flex-col gap-3 rounded-xl border border-[#BDDCEE]/40 bg-[#BDDCEE]/15 px-4 py-3.5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <Bell
              aria-hidden="true"
              className="mt-0.5 h-4 w-4 flex-shrink-0 text-gray-700 dark:text-gray-300"
            />
            <div>
              <p className="text-sm font-semibold">
                Waitlist — Hero banner, slide 1, Black Friday week
              </p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                If it opens, you're notified first. First notified, first served.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setWaitlisted(false)}
            className="inline-flex items-center gap-1.5 self-start text-sm font-medium text-muted-foreground transition-colors hover:text-foreground sm:self-center"
          >
            <X aria-hidden="true" className="h-3.5 w-3.5" />
            Leave waitlist
          </button>
        </div>
      )}
    </div>
  );
}

function Header() {
  return (
    <header className="pt-1">
      <h1 className="text-3xl font-extrabold leading-tight tracking-tight">My bookings</h1>
      <p className="mt-1.5 text-base text-muted-foreground">
        Everything you have booked, and how each one is doing.
      </p>
    </header>
  );
}

function RowAction({ booking, onRecap }: { booking: BookingRecord; onRecap: () => void }) {
  if (booking.status === "completed") {
    return (
      <button
        type="button"
        onClick={onRecap}
        className="rounded-lg bg-gray-900 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-200"
      >
        See recap
      </button>
    );
  }
  return (
    <Link
      to="/performance"
      className="inline-flex rounded-lg border border-border px-3 py-1.5 text-xs font-medium transition-colors hover:border-gray-900 dark:hover:border-gray-200"
    >
      {booking.status === "live" ? "Live performance" : "Details"}
    </Link>
  );
}

function EmptyState() {
  return (
    <div className="rounded-xl border border-dashed border-border bg-card px-6 py-16 text-center">
      <h2 className="text-lg font-bold tracking-tight">No bookings yet</h2>
      <p className="mx-auto mt-1.5 max-w-sm text-sm text-muted-foreground">
        Pick a space inside the Koko shopper app and your bookings will appear here.
      </p>
      <Link
        to="/"
        className="mt-6 inline-flex rounded-lg bg-gray-900 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-200"
      >
        Choose a space
      </Link>
    </div>
  );
}
