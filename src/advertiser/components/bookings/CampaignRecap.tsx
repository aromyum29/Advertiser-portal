/**
 * The end-of-run celebration.
 *
 * When a booking finishes, the advertiser gets a summary worth screenshotting
 * rather than a row turning grey. It leads with what they got, not what they
 * paid, and the primary action is to run it again.
 */
import { X } from "lucide-react";
import { useEffect, useRef } from "react";

import { money } from "../../domain/format";
import { findBookingResult, roas } from "../../domain/performance";
import type { BookingRecord } from "../../domain/types";
import { PASTEL_GRADIENT, ShinyTag } from "../primitives";

const CONFETTI_COLORS = ["#BDDCEE", "#F9C8DC", "#0f7b3d", "#9356ff", "#FBBF24", "#2b3ce0"];

/**
 * Share of reached shoppers who had not seen this store before. A prototype
 * placeholder standing in for the audience service.
 */
const FIRST_TIME_SHARE = 0.28;

/**
 * Deterministic spread rather than random, so the burst looks evenly
 * distributed instead of clumping. Hidden entirely under reduced motion.
 */
function Confetti({ pieces = 70 }: { pieces?: number }) {
  const bits = Array.from({ length: pieces }, (_, i) => ({
    left: ((i * 37) % 100) + (i % 3) - 1,
    delay: ((i * 13) % 26) / 10,
    duration: 2.6 + ((i * 7) % 18) / 10,
    color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
    round: i % 4 === 0,
    size: 7 + (i % 4) * 2,
  }));

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[120] overflow-hidden motion-reduce:hidden"
    >
      {bits.map((bit, i) => (
        <span
          key={i}
          className="absolute top-0 animate-[confettiFall_linear_infinite]"
          style={{
            left: `${bit.left}%`,
            width: bit.size,
            height: bit.size * (bit.round ? 1 : 1.6),
            background: bit.color,
            borderRadius: bit.round ? "50%" : 2,
            animationDelay: `${bit.delay}s`,
            animationDuration: `${bit.duration}s`,
          }}
        />
      ))}
    </div>
  );
}

export function CampaignRecap({
  booking,
  onClose,
  onBookAgain,
}: {
  booking: BookingRecord;
  onClose: () => void;
  onBookAgain: () => void;
}) {
  const closeRef = useRef<HTMLButtonElement>(null);

  // Focus lands inside the dialog, and Escape closes it, as any dialog should.
  useEffect(() => {
    closeRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  const result = findBookingResult(booking.reference);
  const visits = result?.visits ?? booking.views;
  const orders = result?.orders ?? 0;
  const value = result?.value ?? 0;

  const stats: [string, string, string][] = [
    ["Store visits", formatCount(visits), "People who saw your ad and came to look"],
    [
      "New shoppers reached",
      formatCount(Math.round(visits * FIRST_TIME_SHARE)),
      "First time they had seen your store",
    ],
    ["Orders", orders.toLocaleString("en-US"), "Bought after seeing your ad"],
    [
      // Conversion from impressions is a fraction of a percent and says nothing
      // useful here. Cost per order is the figure an advertiser acts on.
      "Cost per order",
      orders > 0 ? money(Math.round(booking.spend / orders)) : "—",
      "What each attributed order cost you",
    ],
  ];

  return (
    <>
      <Confetti />
      <div
        className="animate-in fade-in fixed inset-0 z-[110] flex items-center justify-center bg-black/60 p-6 duration-300"
        onClick={onClose}
      >
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="recap-title"
          onClick={(event) => event.stopPropagation()}
          className="animate-in zoom-in-95 slide-in-from-bottom-4 relative max-h-full w-full max-w-lg overflow-y-auto rounded-3xl shadow-2xl duration-500"
          style={{ backgroundImage: PASTEL_GRADIENT }}
        >
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Close recap"
            className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-white/70 text-gray-700 transition-colors hover:bg-white"
          >
            <X aria-hidden="true" className="h-4 w-4" />
          </button>

          <div className="p-6 text-gray-900 sm:p-10">
            <ShinyTag>That's a wrap</ShinyTag>
            <h2
              id="recap-title"
              className="mt-4 text-[30px] font-extrabold leading-tight tracking-tight"
            >
              Your {booking.placementLabel.split(" · ")[0]} run is done
            </h2>
            <p className="mt-1.5 text-sm text-gray-700">
              {booking.dateLabel} · Booking {booking.reference}
            </p>

            <div className="mt-7 grid grid-cols-2 gap-3">
              {stats.map(([label, stat, note]) => (
                <div key={label} className="rounded-2xl bg-white/70 p-4 backdrop-blur">
                  <p className="text-[11px] font-bold uppercase tracking-[0.06em] text-gray-600">
                    {label}
                  </p>
                  <p className="mt-1.5 text-[28px] font-extrabold leading-none tracking-tight tabular-nums">
                    {stat}
                  </p>
                  <p className="mt-1.5 text-[11px] leading-snug text-gray-600">{note}</p>
                </div>
              ))}
            </div>

            <div className="mt-3 rounded-2xl bg-gray-900 p-5 text-white">
              <p className="text-[11px] font-bold uppercase tracking-[0.06em] text-gray-400">
                Sales from this booking
              </p>
              <p className="mt-1.5 text-[34px] font-extrabold leading-none tracking-tight tabular-nums">
                {money(value)}
              </p>
              <p className="mt-2 text-xs text-gray-300">
                That is{" "}
                <span className="font-bold text-white">
                  {roas(value, booking.spend).toFixed(1)}×
                </span>{" "}
                what you spent on the slot.
              </p>
            </div>

            <div className="mt-7 flex flex-col gap-2.5 sm:flex-row">
              <button
                type="button"
                onClick={onBookAgain}
                className="flex-1 rounded-lg bg-gray-900 px-6 py-3 text-sm font-bold text-white shadow-sm transition-colors hover:bg-gray-800"
              >
                Book this space again
              </button>
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg border-[1.5px] border-gray-900/30 bg-white/60 px-6 py-3 text-sm font-medium text-gray-900 transition-colors hover:bg-white"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

const formatCount = (value: number): string =>
  value >= 1_000_000 ? `${(value / 1_000_000).toFixed(1)}M` : `${(value / 1000).toFixed(1)}K`;
