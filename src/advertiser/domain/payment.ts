/**
 * How an advertiser can pay, and what each method does to the total.
 *
 * Adjustments apply to the subtotal (media plus design) and only from the
 * payment step onward, so the number never moves for a reason the advertiser
 * has not been shown yet.
 */
import type { PaymentMethod } from "./types";

export const PAYMENT_METHODS: readonly PaymentMethod[] = [
  {
    id: "credit",
    label: "Koko seller credit",
    caption: "Deducted from your payout",
    adjustmentLabel: "Convenience fee (5%)",
    adjustment: "fee",
    pct: 0.05,
    badge: "Fastest & most convenient",
  },
  {
    id: "card",
    label: "Card",
    caption: "Visa or Mastercard",
    adjustmentLabel: "Card fee (2%)",
    adjustment: "fee",
    pct: 0.02,
  },
  {
    id: "justpay",
    label: "JustPay",
    caption: "Pay from your bank account",
    adjustmentLabel: "JustPay discount (2%)",
    adjustment: "discount",
    pct: 0.02,
  },
] as const;

export const getPaymentMethod = (id: string): PaymentMethod => {
  const method = PAYMENT_METHODS.find((m) => m.id === id);
  if (!method) throw new Error(`Unknown payment method: ${id}`);
  return method;
};

/**
 * The seller's next payout, used to show the before and after when they pay
 * from Koko credit. Hardcoded in the prototype; comes from the payouts service
 * in production.
 */
export const UPCOMING_PAYOUT = { amount: 486_200, date: "31 Aug" } as const;

/** How long a slot is held while the advertiser completes checkout. */
export const SLOT_HOLD_MINUTES = 30;
