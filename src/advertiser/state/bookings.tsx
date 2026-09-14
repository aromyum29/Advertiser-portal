/**
 * The advertiser's bookings.
 *
 * Confirmed bookings persist across reloads so the prototype behaves like a
 * product rather than a slideshow: pay for a slot, and it is still in My
 * bookings tomorrow. The seeded history is merged in underneath so the list is
 * never empty on a first visit.
 */
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

import { nextReference, SEED_BOOKINGS } from "../domain/bookings";
import type { BookingRecord } from "../domain/types";
import { readJSON, writeJSON } from "./storage";

const STORAGE_KEY = "bookings";

interface BookingsValue {
  /** Bookings the advertiser made in this prototype, newest first, then the seeded history. */
  readonly bookings: readonly BookingRecord[];
  /** True until local storage has been read, so lists can show a skeleton. */
  readonly loading: boolean;
  add(booking: BookingRecord): void;
  /** The reference the next booking will be given. */
  nextReference(): string;
  findByReference(reference: string): BookingRecord | undefined;
}

const BookingsContext = createContext<BookingsValue | null>(null);

export function BookingsProvider({ children }: { children: ReactNode }) {
  const [created, setCreated] = useState<readonly BookingRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setCreated(readJSON<BookingRecord[]>(STORAGE_KEY, []));
    setLoading(false);
  }, []);

  const add = useCallback((booking: BookingRecord) => {
    setCreated((previous) => {
      const next = [booking, ...previous];
      writeJSON(STORAGE_KEY, next);
      return next;
    });
  }, []);

  const bookings = useMemo<readonly BookingRecord[]>(
    () => [...created, ...SEED_BOOKINGS],
    [created],
  );

  const value = useMemo<BookingsValue>(
    () => ({
      bookings,
      loading,
      add,
      nextReference: () => nextReference(created.length),
      findByReference: (reference) => bookings.find((b) => b.reference === reference),
    }),
    [bookings, loading, add, created.length],
  );

  return <BookingsContext.Provider value={value}>{children}</BookingsContext.Provider>;
}

export function useBookings(): BookingsValue {
  const value = useContext(BookingsContext);
  if (!value) throw new Error("useBookings must be used inside a BookingsProvider");
  return value;
}
