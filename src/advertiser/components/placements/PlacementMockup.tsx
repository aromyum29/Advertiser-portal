/**
 * A real Koko app screenshot in a phone frame, with the bookable surface
 * outlined in purple.
 *
 * The highlight is always visible rather than revealed on hover: the whole
 * point of the card is to answer "where exactly does my ad go?", and an
 * advertiser should not have to discover that by accident. Hover adds a glow
 * and a pulse on top, and both are dropped under reduced motion.
 */
import { Check } from "lucide-react";

import { cn } from "@/lib/utils";
import appHome from "figma:asset/app-home.png";
import appSale from "figma:asset/app-sale.png";
import appSearch from "figma:asset/app-search.png";
import appShopDetails from "figma:asset/app-shop-details.png";
import type { PlacementId } from "../../domain/types";

interface Region {
  readonly left: string;
  readonly top: string;
  readonly width: string;
  readonly height: string;
}

/** Where each space sits on its screenshot, as a fraction of the frame. */
const SHOTS: Record<PlacementId, { image: string | null; region: Region }> = {
  hero: { image: appHome, region: { left: "4%", top: "25%", width: "92%", height: "16%" } },
  secondary: { image: appHome, region: { left: "4%", top: "46%", width: "92%", height: "21%" } },
  trending: { image: appSale, region: { left: "4%", top: "56%", width: "92%", height: "23%" } },
  search: { image: appSearch, region: { left: "3%", top: "68%", width: "94%", height: "19%" } },
  shop: {
    image: appShopDetails,
    region: { left: "4%", top: "39.5%", width: "92%", height: "15%" },
  },
  checkout: { image: null, region: { left: "7%", top: "47%", width: "86%", height: "22%" } },
};

const EASE = "ease-[cubic-bezier(0.2,0.8,0.2,1)]";

/** No screenshot of the post-checkout screen exists yet, so it is drawn. */
function OrderConfirmedMock() {
  return (
    <div className="absolute inset-0 space-y-2 p-2.5">
      <div className="flex items-center justify-between pt-1">
        <span className="text-[8px] font-semibold text-white/70">9:41</span>
        <span className="flex gap-0.5">
          {[0, 1, 2].map((i) => (
            <span key={i} className="h-1 w-1 rounded-full bg-white/30" />
          ))}
        </span>
      </div>
      <div className="mt-3 flex flex-col items-center gap-1.5 rounded-lg bg-[#3ec97e]/20 py-4">
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#3ec97e]/80">
          <Check className="h-3.5 w-3.5 stroke-[3] text-white" />
        </span>
        <span className="text-[9px] font-bold text-[#7de0a9]">Order confirmed</span>
      </div>
      <div className="mt-3 h-1.5 w-16 rounded-full bg-white/25" />
      {[0, 1].map((row) => (
        <div key={row} className="grid grid-cols-2 gap-1.5">
          {[0, 1].map((i) => (
            <div key={i} className="h-16 rounded-lg bg-white/5" />
          ))}
        </div>
      ))}
    </div>
  );
}

export function PlacementMockup({
  id,
  width = 138,
  height = 282,
  /** Force the hover treatment on, for the details dialog where there is no card to hover. */
  emphasised = false,
}: {
  id: PlacementId;
  width?: number;
  height?: number;
  emphasised?: boolean;
}) {
  const shot = SHOTS[id];
  return (
    <div
      style={{ width, height }}
      className={cn(
        "relative overflow-hidden rounded-t-[18px] bg-[#1c1c1f] shadow-[0_10px_36px_rgba(0,0,0,0.18)]",
        // Sits slightly below the frame edge so the hover lift never opens a gap.
        "-mb-2 transition-transform duration-[400ms] group-hover:-translate-y-2 motion-reduce:transform-none motion-reduce:transition-none",
        EASE,
      )}
    >
      {shot.image ? (
        <img
          src={shot.image}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover object-top"
        />
      ) : (
        <OrderConfirmedMock />
      )}
      <div
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute rounded-lg border-2 border-[#9356ff] bg-[#9356ff]/15 transition-shadow duration-300",
          "group-hover:animate-[adpulse_1.6s_ease_infinite] group-hover:shadow-[0_0_20px_rgba(147,86,255,0.7)]",
          "motion-reduce:animate-none motion-reduce:transition-none",
          emphasised &&
            "animate-[adpulse_1.6s_ease_infinite] shadow-[0_0_20px_rgba(147,86,255,0.7)]",
          EASE,
        )}
        style={shot.region}
      >
        <span className="absolute -top-[9px] left-1.5 whitespace-nowrap rounded-full bg-[#9356ff] px-[7px] py-px text-[9px] font-bold text-white">
          Your ad
        </span>
      </div>
    </div>
  );
}
