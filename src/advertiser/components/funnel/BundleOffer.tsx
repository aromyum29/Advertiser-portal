/**
 * Koko's pairing suggestion.
 *
 * Offered only when exactly one space is selected and its position is settled:
 * before that the advertiser is still deciding the thing in front of them, and
 * a second decision on top of an unfinished one is just noise. Once taken, the
 * offer is replaced by a confirmation rather than lingering.
 */
import { useState } from "react";

import { compact, money, percent } from "../../domain/format";
import { BUNDLE_PARTNER, PLACEMENTS } from "../../domain/inventory";
import { BUNDLE_DISCOUNT } from "../../domain/pricing";
import type { Placement, PlacementId } from "../../domain/types";
import { Collapse, Tag } from "../primitives";
import { PlacementMockup } from "../placements/PlacementMockup";

/** How many pairings to offer. More than a handful is a catalogue, not a suggestion. */
const MAX_OFFERS = 4;

export function BundleOffer({
  anchor,
  selectedIds,
  onTake,
}: {
  anchor: Placement;
  selectedIds: readonly PlacementId[];
  onTake: (partner: PlacementId) => void;
}) {
  const [openId, setOpenId] = useState<PlacementId | null>(null);

  const recommended = BUNDLE_PARTNER[anchor.id];
  const offers = PLACEMENTS.filter((p) => !selectedIds.includes(p.id))
    .sort((a, b) => {
      if (a.id === recommended) return -1;
      if (b.id === recommended) return 1;
      return b.weeklyImpressions - a.weeklyImpressions;
    })
    .slice(0, MAX_OFFERS);

  if (offers.length === 0) return null;

  return (
    <div className="rounded-[18px] border-[1.5px] border-[#BDDCEE] bg-[#BDDCEE]/10 p-5 sm:p-6">
      <div>
        <Tag>Koko recommends</Tag>
        <h3 className="mt-2.5 text-base font-bold">
          Bundle another space, save {percent(BUNDLE_DISCOUNT)}
        </h3>
        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
          Add a second space. The {percent(BUNDLE_DISCOUNT)} comes off your whole booking.
        </p>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {offers.map((partner) => {
          const combined = anchor.weekly + partner.weekly;
          const open = openId === partner.id;
          return (
            <div
              key={partner.id}
              className="relative flex flex-col overflow-hidden rounded-[14px] border-[1.5px] border-border bg-card"
            >
              {partner.id === recommended && (
                <Tag className="absolute right-3 top-3 z-10">Best match</Tag>
              )}
              <div className="flex h-[120px] items-end justify-center gap-3 overflow-hidden bg-muted/50 pt-4">
                <PlacementMockup id={anchor.id} width={72} height={104} emphasised />
                <span
                  aria-hidden="true"
                  className="self-center pb-8 text-base font-bold text-muted-foreground"
                >
                  +
                </span>
                <PlacementMockup id={partner.id} width={72} height={104} emphasised />
              </div>
              <div className="flex flex-1 flex-col gap-2 p-4">
                <p className="text-sm font-bold leading-snug">
                  {anchor.name} + {partner.name}
                </p>
                <div className="mt-auto flex flex-wrap items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => setOpenId(open ? null : partner.id)}
                    aria-expanded={open}
                    className="whitespace-nowrap text-xs font-semibold text-muted-foreground underline underline-offset-2 transition-colors hover:text-foreground"
                  >
                    {open ? "Hide details" : "More details"}
                  </button>
                  <button
                    type="button"
                    onClick={() => onTake(partner.id)}
                    className="flex-shrink-0 whitespace-nowrap rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:-translate-y-px hover:bg-gray-800 hover:shadow-md active:scale-[0.98] dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-200"
                  >
                    Add bundle · save {percent(BUNDLE_DISCOUNT)}
                  </button>
                </div>
                <Collapse open={open}>
                  <div className="mt-1 flex flex-col gap-1 border-t border-border/40 pt-2.5">
                    <p className="text-xs text-muted-foreground">{partner.description}</p>
                    <p className="whitespace-nowrap text-xs text-muted-foreground tabular-nums">
                      Adds ~{compact(partner.weeklyImpressions)} views / week
                    </p>
                    <p className="whitespace-nowrap text-sm tabular-nums">
                      <span className="mr-1.5 text-muted-foreground line-through">
                        {money(combined)}
                      </span>
                      <span className="font-bold">
                        {money(Math.round(combined * (1 - BUNDLE_DISCOUNT)))}
                      </span>
                      <span className="text-muted-foreground"> / week together</span>
                    </p>
                  </div>
                </Collapse>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
