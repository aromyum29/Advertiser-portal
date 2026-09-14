/**
 * A mock app screen that slides to whichever position is selected, with a bar
 * chart of how engagement falls off down the rotation.
 *
 * Deliberately a drawn mock rather than a brand screenshot: this is about the
 * shape of the rotation and where in it you sit, and a real screenshot would
 * pull attention to its own content.
 */
import { cn } from "@/lib/utils";
import { engagementAt, POSITION_NOUN } from "../../domain/inventory";
import type { Placement } from "../../domain/types";

/** Positions shown in the preview. Longer rotations are represented, not enumerated. */
const MAX_SHOWN = 8;

export function PositionPreview({
  placement,
  position,
}: {
  placement: Placement;
  position: number | undefined;
}) {
  const count = Math.min(placement.positionCount, MAX_SHOWN);
  const shift = (position ?? 1) - 1;
  const peak = engagementAt(1);
  const noun = POSITION_NOUN[placement.id];

  return (
    <div className="flex flex-col items-center justify-center gap-3 overflow-hidden rounded-xl bg-muted/50 px-5 py-6">
      <div
        aria-hidden="true"
        className="w-[180px] flex-shrink-0 overflow-hidden rounded-[20px] border border-white/10 bg-[#17171c] shadow-[0_12px_40px_rgba(0,0,0,0.18)]"
      >
        <div className="flex items-center justify-between px-3 pb-1.5 pt-2.5">
          <span className="text-[8px] font-semibold text-white/70">9:41</span>
          <span className="flex gap-0.5">
            {[0, 1, 2].map((i) => (
              <span key={i} className="h-1 w-1 rounded-full bg-white/30" />
            ))}
          </span>
        </div>

        <div className="space-y-2 px-2.5 pb-3">
          {placement.id === "checkout" ? (
            <div className="rounded-lg bg-[#3ec97e]/20 py-1.5 text-center text-[8px] font-bold text-[#7de0a9]">
              Order confirmed ✓
            </div>
          ) : placement.id === "search" ? (
            <>
              <div className="h-3.5 rounded-full border border-white/15 bg-white/10" />
              <p className="py-0.5 text-center text-[8px] font-semibold text-white/60">
                No results found.
              </p>
            </>
          ) : (
            <div className="h-3.5 rounded-full border border-white/15 bg-white/10" />
          )}

          {placement.id === "secondary" && <div className="h-8 rounded-lg bg-white/10" />}

          <div className="overflow-hidden rounded-lg">
            <div
              className="flex gap-1.5 transition-transform duration-500 ease-out motion-reduce:transition-none"
              style={{ transform: `translateX(calc(${-shift} * (100% + 6px)))` }}
            >
              {Array.from({ length: count }, (_, i) => i + 1).map((slot) => (
                <div
                  key={slot}
                  className={cn(
                    "relative flex h-16 w-full flex-shrink-0 items-end rounded-lg border-2 p-1.5 transition-colors duration-300",
                    slot === position
                      ? "border-[#9356ff] bg-[#9356ff]/20"
                      : "border-dashed border-white/20 bg-white/5",
                  )}
                >
                  {slot === position ? (
                    <span className="rounded-full bg-[#6D28D9] px-1.5 py-0.5 text-[8px] font-bold leading-none text-white">
                      Your ad
                    </span>
                  ) : (
                    <span className="text-[8px] font-bold leading-none text-white/50">
                      {noun} {slot}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-center gap-1">
            {Array.from({ length: count }, (_, i) => i + 1).map((slot) => (
              <span
                key={slot}
                className={cn(
                  "h-1 rounded-full transition-all duration-500",
                  slot === position ? "w-3 bg-[#9356ff]" : "w-1 bg-white/25",
                )}
              />
            ))}
          </div>

          <div className="rounded-lg bg-white/5 px-2 pb-2 pt-1.5">
            <p className="text-[7px] font-bold uppercase tracking-wider text-white/50">
              Typical engagement by position
            </p>
            <div className="mt-1 flex h-9 items-end gap-1">
              {Array.from({ length: count }, (_, i) => i + 1).map((slot) => (
                <div
                  key={slot}
                  className="flex flex-1 flex-col items-center justify-end gap-0.5 self-stretch"
                >
                  <div
                    className={cn(
                      "w-full rounded-sm transition-all duration-500",
                      slot === position ? "bg-[#9356ff]" : "bg-white/20",
                    )}
                    style={{ height: `${Math.round((engagementAt(slot) / peak) * 100)}%` }}
                  />
                  <span
                    className={cn(
                      "text-[7px] font-bold leading-none",
                      slot === position ? "text-[#9356ff]" : "text-white/40",
                    )}
                  >
                    {slot}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-1">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-7 rounded-md bg-white/5" />
            ))}
          </div>
        </div>
      </div>

      <p className="max-w-[210px] text-center text-xs text-muted-foreground">
        {position ? (
          <>
            ≈
            <span className="font-bold text-foreground tabular-nums">
              {engagementAt(position).toFixed(1)}×
            </span>{" "}
            typical engagement at {noun.toLowerCase()} {position}
          </>
        ) : (
          "Earlier positions usually get more engagement."
        )}
      </p>
    </div>
  );
}
