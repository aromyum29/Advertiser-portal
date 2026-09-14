/**
 * The grid of bookable spaces. Multi-select: one booking can cover several
 * spaces over the same dates.
 */
import { useState, type ReactNode } from "react";

import { cn } from "@/lib/utils";
import { PLACEMENTS } from "../../domain/inventory";
import type { PlacementId } from "../../domain/types";
import { PlacementCard } from "./PlacementCard";
import { PlacementDetailsDialog } from "./PlacementDetailsDialog";

type SortKey = "views" | "price";

export function PlacementPicker({
  selectedIds,
  onToggle,
  heading,
  showPrices = false,
}: {
  selectedIds: readonly PlacementId[];
  onToggle: (id: PlacementId) => void;
  heading: ReactNode;
  showPrices?: boolean;
}) {
  const [detailId, setDetailId] = useState<PlacementId | null>(null);
  const [sort, setSort] = useState<SortKey>("views");

  const detail = PLACEMENTS.find((p) => p.id === detailId) ?? null;
  const ordered = [...PLACEMENTS].sort((a, b) =>
    sort === "price" ? a.weekly - b.weekly : b.weeklyImpressions - a.weeklyImpressions,
  );

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-6">
        {heading}
        {showPrices && (
          <div
            role="group"
            aria-label="Sort spaces"
            className="flex flex-shrink-0 gap-1 rounded-full bg-muted p-[3px]"
          >
            {(
              [
                ["views", "Most viewed"],
                ["price", "Cheapest"],
              ] as const
            ).map(([key, label]) => (
              <button
                key={key}
                type="button"
                onClick={() => setSort(key)}
                aria-pressed={sort === key}
                className={cn(
                  "rounded-full px-4.5 py-2 text-[13px] font-semibold transition-colors",
                  sort === key
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {label}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="mt-7 grid grid-cols-[repeat(auto-fill,minmax(min(100%,360px),1fr))] gap-6">
        {ordered.map((placement) => (
          <PlacementCard
            key={placement.id}
            placement={placement}
            selected={selectedIds.includes(placement.id)}
            showPrices={showPrices}
            onToggle={() => onToggle(placement.id)}
            onDetails={() => setDetailId(placement.id)}
          />
        ))}
      </div>

      <PlacementDetailsDialog
        placement={detail}
        selected={detail ? selectedIds.includes(detail.id) : false}
        onToggle={() => {
          if (detail) onToggle(detail.id);
          setDetailId(null);
        }}
        onClose={() => setDetailId(null)}
      />
    </div>
  );
}
