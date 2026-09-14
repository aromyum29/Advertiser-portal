/**
 * Step two: where in the rotation.
 *
 * One space is open at a time, so the advertiser compares positions within a
 * space rather than across all of them at once. Picking a position keeps the
 * panel open — the preview animates to the slot they chose, which is the whole
 * point — and offers an explicit way on to the next space.
 */
import { AlertCircle, Check } from "lucide-react";
import { useState } from "react";

import { cn } from "@/lib/utils";
import { compact, money, percent } from "../../domain/format";
import {
  engagementAt,
  getPlacement,
  getPlacements,
  PLACEMENTS,
  POSITION_NOUN,
  positionMultiplier,
} from "../../domain/inventory";
import { BUNDLE_DISCOUNT, positionsComplete } from "../../domain/pricing";
import type { Placement, PlacementId } from "../../domain/types";
import { useBookingDraft } from "../../state/booking-draft";
import { Collapse, ConfirmBanner, Radio, Tag } from "../primitives";
import { BundleOffer } from "./BundleOffer";
import { PositionPreview } from "./PositionPreview";

/** Positions offered self-serve. Deeper slots go through a Koko manager. */
const SELF_SERVE_POSITIONS = 8;

/** What each position means, in plain language. */
const positionNote = (position: number): string => {
  if (position === 1) return "seen first by every shopper";
  if (position === 2) return "second in view";
  return `position ${position} in the rotation`;
};

export function PositionsStep() {
  const { draft, dispatch, takeBundle } = useBookingDraft();
  const selected = getPlacements(draft.placementIds);

  const [openId, setOpenId] = useState<PlacementId | null>(
    () => selected.find((p) => !draft.positions[p.id])?.id ?? selected[0]?.id ?? null,
  );
  const [addOpen, setAddOpen] = useState(false);

  const multi = selected.length > 1;
  const complete = positionsComplete(draft.placementIds, draft.positions);
  const unselected = PLACEMENTS.filter((p) => !draft.placementIds.includes(p.id));
  const bundleOffered = selected.length === 1 && complete && !draft.bundleApplied;

  return (
    <div className="flex flex-col gap-3">
      <div>
        <h2 className="text-[19px] font-bold tracking-tight">Pick your positions</h2>
        <p className="mt-0.5 text-sm text-muted-foreground">
          Earlier positions get more engagement.
        </p>
      </div>

      {draft.bundleApplied && multi && (
        <ConfirmBanner>
          <span className="font-bold">{selected.map((p) => p.name).join(" + ")} bundle.</span>{" "}
          You're saving {percent(BUNDLE_DISCOUNT)} on this bundle.
        </ConfirmBanner>
      )}

      {selected.map((placement) => (
        <SpacePanel
          key={placement.id}
          placement={placement}
          chosen={draft.positions[placement.id]}
          open={openId === placement.id}
          removable={multi}
          onToggleOpen={() => setOpenId(openId === placement.id ? null : placement.id)}
          onPick={(position) => dispatch({ type: "setPosition", id: placement.id, position })}
          onRemove={() => dispatch({ type: "removeSpace", id: placement.id })}
          nextUnpicked={selected.find((p) => p.id !== placement.id && !draft.positions[p.id])}
          onGoToNext={(id) => setOpenId(id)}
        />
      ))}

      {bundleOffered && (
        <BundleOffer
          anchor={getPlacement(draft.placementIds[0])}
          selectedIds={draft.placementIds}
          onTake={() => takeBundle()}
        />
      )}

      {unselected.length > 0 && (
        <div>
          <button
            type="button"
            onClick={() => setAddOpen(!addOpen)}
            aria-expanded={addOpen}
            className="w-full rounded-lg border-[1.5px] border-gray-400 bg-card px-8 py-3.5 text-[15px] font-medium text-foreground transition-colors hover:border-gray-900 hover:bg-muted/40 sm:w-auto dark:border-gray-500 dark:hover:border-gray-200"
          >
            {addOpen ? "Close" : "+ Add another space"}
          </button>
          <Collapse open={addOpen}>
            <ul className="mt-3 divide-y divide-border/40 rounded-[18px] border border-border/60 bg-card">
              {unselected.map((placement) => (
                <li
                  key={placement.id}
                  className="flex items-center justify-between gap-4 px-5 py-3.5"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-bold">{placement.name}</p>
                    <p className="text-xs text-muted-foreground tabular-nums">
                      {compact(placement.weeklyImpressions)} views / week · from{" "}
                      {money(placement.weekly)} / week
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      dispatch({ type: "addSpace", id: placement.id });
                      setOpenId(placement.id);
                      setAddOpen(false);
                    }}
                    className="flex-shrink-0 rounded-lg border-[1.5px] border-gray-900 px-4 py-1.5 text-xs font-medium transition-colors hover:bg-gray-900 hover:text-white dark:border-gray-200 dark:hover:bg-gray-200 dark:hover:text-gray-900"
                  >
                    Add
                  </button>
                </li>
              ))}
            </ul>
          </Collapse>
        </div>
      )}
    </div>
  );
}

function SpacePanel({
  placement,
  chosen,
  open,
  removable,
  onToggleOpen,
  onPick,
  onRemove,
  nextUnpicked,
  onGoToNext,
}: {
  placement: Placement;
  chosen: number | undefined;
  open: boolean;
  removable: boolean;
  onToggleOpen: () => void;
  onPick: (position: number) => void;
  onRemove: () => void;
  nextUnpicked: Placement | undefined;
  onGoToNext: (id: PlacementId) => void;
}) {
  const noun = POSITION_NOUN[placement.id];
  const shown = Math.min(placement.positionCount, SELF_SERVE_POSITIONS);
  const panelId = `positions-${placement.id}`;

  return (
    <div className="overflow-hidden rounded-[18px] border border-border/60 bg-card">
      <div className="flex w-full items-center justify-between gap-4 px-6 py-4">
        <button
          type="button"
          onClick={onToggleOpen}
          aria-expanded={open}
          aria-controls={panelId}
          className="flex min-w-0 flex-1 items-center gap-3 text-left"
        >
          <span
            aria-hidden="true"
            className={cn(
              "flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full",
              chosen ? "bg-emerald-600" : "bg-amber-100 dark:bg-amber-900/40",
            )}
          >
            {chosen ? (
              <Check className="h-3.5 w-3.5 stroke-[3] text-white" />
            ) : (
              <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            )}
          </span>
          <span className="min-w-0">
            <span className="block text-sm font-bold">{placement.name}</span>
            <span
              className={cn(
                "block text-xs",
                chosen
                  ? "text-muted-foreground"
                  : "font-semibold text-amber-700 dark:text-amber-400",
              )}
            >
              {chosen ? `${noun} ${chosen} selected` : "Select a position to continue"}
            </span>
          </span>
        </button>

        <span className="flex flex-shrink-0 items-center gap-4">
          <button
            type="button"
            onClick={onToggleOpen}
            className="text-xs font-semibold text-muted-foreground underline underline-offset-2 transition-colors hover:text-foreground"
          >
            {open ? "Collapse" : "Edit"}
          </button>
          {removable && (
            <button
              type="button"
              onClick={onRemove}
              aria-label={`Remove ${placement.name} from this booking`}
              className="text-xs font-semibold text-red-600 underline underline-offset-2 transition-colors hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
            >
              Remove
            </button>
          )}
        </span>
      </div>

      <Collapse open={open}>
        <div
          id={panelId}
          className="grid items-start gap-5 px-6 pb-6 lg:grid-cols-[230px_minmax(0,1fr)]"
        >
          <PositionPreview placement={placement} position={chosen} />
          <div>
            <div
              role="radiogroup"
              aria-label={`Position for ${placement.name}`}
              className="grid grid-cols-1 gap-3 sm:grid-cols-2"
            >
              {Array.from({ length: shown }, (_, i) => i + 1).map((position) => {
                const active = chosen === position;
                const multiplier = positionMultiplier(placement.id, position);
                const weekly = Math.round(placement.basePrice * multiplier) * 7;
                return (
                  <button
                    key={position}
                    type="button"
                    role="radio"
                    aria-checked={active}
                    onClick={() => onPick(position)}
                    className={cn(
                      "flex items-start gap-3 rounded-xl border-[1.5px] bg-card px-4 py-3.5 text-left transition-colors duration-150",
                      active
                        ? "border-gray-900 dark:border-gray-200"
                        : "border-border hover:border-gray-400",
                    )}
                  >
                    <span className="mt-0.5">
                      <Radio on={active} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex flex-wrap items-center gap-2 text-sm font-bold">
                        {noun} {position}
                        {position === 1 && <Tag>Most popular</Tag>}
                      </span>
                      <span className="mt-1 block text-xs leading-relaxed text-muted-foreground">
                        <span className="font-bold text-foreground tabular-nums">
                          ≈{engagementAt(position).toFixed(1)}×
                        </span>{" "}
                        engagement · {positionNote(position)}
                      </span>
                      {multiplier !== 1 && (
                        <span className="mt-1 block text-xs font-semibold tabular-nums">
                          {money(weekly)} / week
                        </span>
                      )}
                    </span>
                  </button>
                );
              })}
            </div>

            {placement.positionCount > shown && (
              <p className="mt-2.5 text-xs text-muted-foreground">
                +{placement.positionCount - shown} more positions available through your Koko
                manager.
              </p>
            )}

            {chosen &&
              (nextUnpicked ? (
                <button
                  type="button"
                  onClick={() => onGoToNext(nextUnpicked.id)}
                  className="mt-4 rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-200"
                >
                  Next: {nextUnpicked.name} →
                </button>
              ) : (
                <p className="mt-4 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                  All positions picked. You're good to continue.
                </p>
              ))}
          </div>
        </div>
      </Collapse>
    </div>
  );
}
