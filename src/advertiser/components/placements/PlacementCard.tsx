/**
 * One bookable space, as a card.
 *
 * Value comes before price throughout: the estimated views are the biggest
 * thing on the card, and the price sits underneath. The whole card is a toggle,
 * with an explicit Select button for anyone who does not expect that.
 */
import { cn } from "@/lib/utils";
import { compact, money } from "../../domain/format";
import type { Placement } from "../../domain/types";
import { PASTEL_GRADIENT, Tag } from "../primitives";
import { PlacementMockup } from "./PlacementMockup";

export function PlacementCard({
  placement,
  selected,
  showPrices,
  onToggle,
  onDetails,
}: {
  placement: Placement;
  selected: boolean;
  showPrices: boolean;
  onToggle: () => void;
  onDetails: () => void;
}) {
  const headingId = `placement-${placement.id}-name`;
  return (
    <div
      role="button"
      tabIndex={0}
      aria-pressed={selected}
      aria-labelledby={headingId}
      onClick={onToggle}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onToggle();
        }
      }}
      className={cn(
        "group relative flex cursor-pointer flex-col overflow-hidden rounded-[22px] border-2 bg-card shadow-sm transition-[border-color,box-shadow] duration-150",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2",
        selected
          ? "border-gray-900 shadow-[0_8px_28px_rgba(13,15,20,0.14)] ring-4 ring-gray-900/10 dark:border-gray-200 dark:ring-gray-100/15"
          : "border-border/60 hover:border-gray-900 hover:shadow-[0_8px_24px_rgba(13,15,20,0.08)] dark:hover:border-gray-200",
      )}
    >
      <div className="relative flex h-[300px] items-end justify-center overflow-hidden bg-muted/60 transition-colors duration-300 group-hover:bg-[#BDDCEE]/30 dark:group-hover:bg-[#BDDCEE]/10">
        {placement.badge && (
          <Tag
            tone={placement.badge.tone === "green" ? "emerald" : "brand"}
            className="absolute left-4 top-4 z-10 shadow-md"
          >
            {placement.badge.label}
          </Tag>
        )}
        <PlacementMockup id={placement.id} />
      </div>

      <div className="flex flex-1 flex-col px-7 pb-7 pt-6">
        <div>
          <p id={headingId} className="text-lg font-bold leading-tight tracking-tight">
            {placement.name}
          </p>
          <p className="mt-0.5 text-[13px] text-muted-foreground">{placement.location}</p>
        </div>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          {placement.description}
        </p>

        <div className="mt-5 flex items-baseline gap-2">
          <span className="text-[28px] font-extrabold leading-none tracking-tight tabular-nums">
            {compact(placement.weeklyImpressions)}
          </span>
          <span className="text-[13px] text-muted-foreground">
            {showPrices ? "est. views / 7 days" : "estimated store visits / 7 days"}
          </span>
        </div>

        <div className="mt-auto h-px bg-border/60 my-4.5" />

        <div
          className={cn(
            "flex flex-wrap items-end gap-3",
            showPrices ? "justify-between" : "justify-start",
          )}
        >
          {showPrices && (
            <div className="flex flex-shrink-0 flex-col gap-0.5">
              {placement.promo && (
                <span className="flex items-center gap-2 whitespace-nowrap">
                  <span className="whitespace-nowrap text-xs text-muted-foreground line-through tabular-nums">
                    {money(placement.promo.wasPrice)}
                  </span>
                  <span className="whitespace-nowrap rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-medium text-amber-800 dark:bg-amber-900/30 dark:text-amber-400">
                    {placement.promo.label}
                  </span>
                </span>
              )}
              <span className="text-xs text-muted-foreground">From</span>
              <span className="whitespace-nowrap text-lg font-bold leading-tight tracking-tight tabular-nums">
                {money(placement.weekly)}
                <span className="text-[13px] font-normal text-muted-foreground"> / week</span>
              </span>
            </div>
          )}

          <div className={cn("flex gap-2.5", showPrices ? "items-center" : "w-full flex-col")}>
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                onToggle();
              }}
              style={selected ? { backgroundImage: PASTEL_GRADIENT } : undefined}
              className={cn(
                "whitespace-nowrap rounded-lg px-4.5 py-2.5 text-[13px] font-medium transition-colors",
                showPrices ? "order-2 flex-shrink-0" : "w-full",
                selected
                  ? "border-[1.5px] border-gray-900 text-gray-900 dark:border-gray-200"
                  : "bg-gray-900 text-white shadow-sm hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-200",
              )}
            >
              {selected ? "✓ Selected" : "Select space"}
            </button>
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                onDetails();
              }}
              className={cn(
                "whitespace-nowrap rounded-lg border-[1.5px] border-border bg-card px-4.5 py-2.5 text-[13px] font-semibold transition-colors hover:border-gray-900 dark:hover:border-gray-200",
                showPrices ? "order-1" : "w-full",
              )}
            >
              Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
