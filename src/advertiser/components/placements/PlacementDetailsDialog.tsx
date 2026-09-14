/**
 * The long explanation of a space: what it is, who sees it, and what a week of
 * it costs. Opened from a card's Details button.
 */
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { compact, money } from "../../domain/format";
import type { Placement } from "../../domain/types";
import { PlacementMockup } from "./PlacementMockup";

/** Views per month, from the weekly figure: 52 weeks over 12 months. */
const MONTHLY_FACTOR = 4.33;

export function PlacementDetailsDialog({
  placement,
  selected,
  onToggle,
  onClose,
}: {
  placement: Placement | null;
  selected: boolean;
  onToggle: () => void;
  onClose: () => void;
}) {
  return (
    <Dialog open={Boolean(placement)} onOpenChange={(open) => !open && onClose()}>
      {placement && (
        <DialogContent className="gap-0 overflow-hidden p-0 sm:max-w-2xl">
          <div className="grid sm:grid-cols-[280px_minmax(0,1fr)]">
            <div className="hidden items-end justify-center overflow-hidden bg-muted/60 px-6 pt-8 sm:flex">
              <PlacementMockup id={placement.id} width={220} height={430} emphasised />
            </div>
            <div className="flex flex-col gap-4 p-6 sm:p-7">
              <div>
                <DialogTitle className="text-xl font-bold tracking-tight">
                  {placement.name}
                </DialogTitle>
                <p className="mt-0.5 text-[13px] text-muted-foreground">{placement.location}</p>
              </div>
              <DialogDescription className="text-sm leading-relaxed text-foreground/80">
                {placement.details}
              </DialogDescription>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-border/60 p-3.5">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                    Est. views / week
                  </p>
                  <p className="mt-1 text-2xl font-bold tracking-tight tabular-nums">
                    {compact(placement.weeklyImpressions)}
                  </p>
                  <p className="mt-0.5 text-[11px] text-muted-foreground">Times shoppers see you</p>
                </div>
                <div className="rounded-xl border border-border/60 p-3.5">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                    Impressions / month
                  </p>
                  <p className="mt-1 text-2xl font-bold tracking-tight tabular-nums">
                    {compact(Math.round(placement.weeklyImpressions * MONTHLY_FACTOR))}
                  </p>
                  <p className="mt-0.5 text-[11px] text-muted-foreground">
                    Rendered in shoppers' view
                  </p>
                </div>
              </div>

              <p className="text-sm text-muted-foreground">
                From{" "}
                <span className="font-bold text-foreground tabular-nums">
                  {money(placement.weekly)}
                </span>{" "}
                / week
              </p>

              <button
                type="button"
                onClick={onToggle}
                className={cn(
                  "mt-auto w-full rounded-lg px-6 py-3 text-sm font-medium transition-colors",
                  selected
                    ? "border-[1.5px] border-gray-900 bg-card text-foreground dark:border-gray-200"
                    : "bg-gray-900 text-white hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-200",
                )}
              >
                {selected ? "Remove from selection" : "Select this space"}
              </button>
            </div>
          </div>
        </DialogContent>
      )}
    </Dialog>
  );
}
