/**
 * The small, repeated pieces of the advertiser portal's design language.
 *
 * Kept together because they encode decisions rather than markup: what a badge
 * means, what "selected" looks like, which green says "you confirmed this" and
 * which blue says "Koko suggests this".
 */
import { AlertCircle, Check, TrendingDown, TrendingUp } from "lucide-react";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";
import { STATUS_LABEL } from "../../domain/bookings";
import type { BookingStatus } from "../../domain/types";

/** The Koko login gradient: light blue, lavender, pink. */
export const PASTEL_GRADIENT =
  "linear-gradient(149.739deg, rgb(189, 220, 238) 0%, rgb(224, 231, 255) 35%, rgb(243, 232, 255) 70%, rgb(252, 231, 243) 100%)";

/** Koko's brand accent, used wherever Koko is making a recommendation. */
export const BRAND_BLUE = "#BDDCEE";
/** The purple that marks "this is where your ad goes" in every app mockup. */
export const AD_PURPLE = "#9356ff";
/**
 * A darker step of the same hue for the small "Your ad" chips. White text on
 * AD_PURPLE is 3.9:1, under the 4.5:1 floor, and these chips are 8 to 9px.
 */
export const AD_PURPLE_INK = "#6D28D9";

type TagTone = "brand" | "emerald" | "amber" | "dark";

const TAG_TONES: Record<TagTone, string> = {
  brand: "bg-[#BDDCEE] text-gray-800",
  emerald: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400",
  amber: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
  dark: "bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900",
};

/** A small uppercase badge. One per decision, at most. */
export function Tag({
  children,
  tone = "brand",
  className,
}: {
  children: ReactNode;
  tone?: TagTone;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center whitespace-nowrap rounded-full px-3 py-1.5 text-[11px] font-bold uppercase leading-none tracking-[0.04em]",
        TAG_TONES[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

/**
 * The hero badge: the pastel gradient with a shine that sweeps across it.
 * Reserved for the single strongest recommendation on a screen.
 */
export function ShinyTag({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "relative inline-flex items-center overflow-hidden whitespace-nowrap rounded-full px-3.5 py-1.5 text-[11px] font-bold uppercase leading-none tracking-[0.04em] text-gray-900 shadow-sm",
        className,
      )}
      style={{ backgroundImage: PASTEL_GRADIENT }}
    >
      <span
        aria-hidden="true"
        className="absolute inset-y-0 left-0 w-1/2 animate-[badgeShine_2.8s_ease-in-out_infinite] bg-gradient-to-r from-transparent via-white/80 to-transparent motion-reduce:animate-none"
      />
      <span className="relative">{children}</span>
    </span>
  );
}

/** Radio dot, matching the one used across positions, creative and payment. */
export function Radio({ on }: { on: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "block h-[18px] w-[18px] flex-shrink-0 rounded-full border-2",
        on
          ? "border-gray-900 bg-gray-900 shadow-[inset_0_0_0_3px_#fff] dark:border-gray-100 dark:bg-gray-100 dark:shadow-[inset_0_0_0_3px_#1D232A]"
          : "border-border bg-card",
      )}
    />
  );
}

/**
 * Two-way expand and collapse. Animates grid rows rather than height so
 * content slides both ways instead of popping shut.
 */
export function Collapse({ open, children }: { open: boolean; children: ReactNode }) {
  return (
    <div
      className={cn(
        "grid transition-[grid-template-rows,opacity] duration-300 ease-[cubic-bezier(0.2,0.8,0.2,1)] motion-reduce:transition-none",
        open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
      )}
    >
      <div className="min-h-0 overflow-hidden">{children}</div>
    </div>
  );
}

const STATUS_STYLES: Record<BookingStatus, { dot: string; pill: string }> = {
  live: { dot: "bg-emerald-500", pill: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  completed: { dot: "bg-blue-500", pill: "bg-blue-50 text-blue-700 border-blue-200" },
  pending: { dot: "bg-amber-500", pill: "bg-amber-50 text-amber-700 border-amber-200" },
  confirmed: { dot: "bg-emerald-500", pill: "bg-emerald-50 text-emerald-700 border-emerald-200" },
};

export function StatusPill({ status }: { status: BookingStatus }) {
  const style = STATUS_STYLES[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium",
        style.pill,
      )}
    >
      <span aria-hidden="true" className={cn("h-1.5 w-1.5 rounded-full", style.dot)} />
      {STATUS_LABEL[status]}
    </span>
  );
}

/** Period-on-period change. Up is not always good, so the caller decides the copy. */
export function TrendPill({ up, children }: { up: boolean; children: ReactNode }) {
  const Icon = up ? TrendingUp : TrendingDown;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-semibold",
        up
          ? "border-emerald-200 bg-emerald-50 text-emerald-700"
          : "border-red-200 bg-red-50 text-red-700",
      )}
    >
      <Icon aria-hidden="true" className="h-3 w-3" />
      {children}
    </span>
  );
}

/** Green tick: something the advertiser has settled. */
export function DoneChip({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1 whitespace-nowrap rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[11px] font-bold leading-none text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400">
      <Check aria-hidden="true" className="h-2.5 w-2.5 stroke-[3]" />
      {children}
    </span>
  );
}

/** Amber alert: something still waiting on the advertiser. */
export function TodoChip({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1 whitespace-nowrap rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-[11px] font-bold leading-none text-amber-700 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-400">
      <AlertCircle aria-hidden="true" className="h-2.5 w-2.5" />
      {children}
    </span>
  );
}

/** Confirmation banner for something the advertiser just accepted. */
export function ConfirmBanner({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3.5 dark:border-emerald-800 dark:bg-emerald-950/30">
      <span
        aria-hidden="true"
        className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-emerald-600"
      >
        <Check className="h-3.5 w-3.5 stroke-[3] text-white" />
      </span>
      <p className="text-sm text-emerald-900 dark:text-emerald-200">{children}</p>
    </div>
  );
}

/** The finality notice, shown twice on the payment step by design. */
export function FinalSaleNotice({ compact = false }: { compact?: boolean }) {
  if (compact) {
    return (
      <p className="text-xs font-semibold leading-relaxed text-amber-700 dark:text-amber-400">
        Final sale. No cancellations or refunds.
      </p>
    );
  }
  return (
    <div className="rounded-xl border border-amber-200 bg-amber-50 px-5 py-4 dark:border-amber-800 dark:bg-amber-950/30">
      <p className="text-sm font-semibold text-amber-800 dark:text-amber-300">
        This booking is final. No cancellations and no refunds. Your slots are reserved just for
        you.
      </p>
    </div>
  );
}

/** Card-shaped section used for every block of the funnel. */
export function Panel({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <section className={cn("rounded-[18px] border border-border/60 bg-card p-6 sm:p-7", className)}>
      {children}
    </section>
  );
}

export function SectionHeading({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div>
      <h2 className="text-[19px] font-bold tracking-tight">{title}</h2>
      {subtitle && <p className="mt-0.5 text-sm text-muted-foreground">{subtitle}</p>}
    </div>
  );
}
