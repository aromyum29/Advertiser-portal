/**
 * Step three: the artwork.
 *
 * Only reached when something in the booking needs a banner. Two options, with
 * the recommended one made obviously heavier: most advertisers are better off
 * letting Koko design it, and the upload path is presented honestly as the
 * slower one rather than hidden.
 *
 * The spec check runs against the real file in the browser. It is a courtesy,
 * not an approval: production re-checks every rule server side.
 */
import { Check, UploadCloud, X } from "lucide-react";
import { useCallback, useRef } from "react";

import { cn } from "@/lib/utils";
import {
  CREATIVE_CHECKS,
  CREATIVE_SPEC,
  SPEC_SUMMARY,
  checkFormat,
  checkSize,
  checkResolution,
  type CheckState,
} from "../../domain/creative";
import { money } from "../../domain/format";
import { DESIGN_FEE } from "../../domain/pricing";
import { useBookingDraft } from "../../state/booking-draft";
import { Panel, Radio, SectionHeading, ShinyTag } from "../primitives";

const KOKO_BENEFITS = [
  "Designed by Koko's own team",
  "Approval in minutes, not days",
  "Koko brand rules handled for you",
  "Nothing to upload or fix",
];

const UPLOAD_CAVEATS = [
  "Review takes up to 2 business days",
  "Booking confirms only after approval",
  "Must pass the spec check below",
];

/** Roughly what the design fee works out at per day on a week-long booking. */
const PER_DAY_ON_A_WEEK = Math.round(DESIGN_FEE / 7 / 100) * 100;

export function AssetsStep() {
  const { draft, upload, dispatch, setUpload } = useBookingDraft();
  const inputRef = useRef<HTMLInputElement>(null);

  /**
   * Walk the rules one at a time so the advertiser sees which one is being
   * checked. Resolution needs the image decoded, so the whole run is async.
   */
  const runChecks = useCallback(
    (file: File) => {
      const sizeOk = checkSize(file);
      const formatOk = checkFormat(file);

      const step = (states: CheckState[], done = false, passed = false) =>
        setUpload({ name: file.name, states, done, passed });

      step(["running", "pending", "pending"]);

      const finish = (resolutionOk: boolean) => {
        const toState = (ok: boolean): CheckState => (ok ? "passed" : "failed");
        window.setTimeout(() => step([toState(sizeOk), "running", "pending"]), 400);
        window.setTimeout(() => step([toState(sizeOk), toState(formatOk), "running"]), 800);
        window.setTimeout(() => {
          const passed = sizeOk && formatOk && resolutionOk;
          step([toState(sizeOk), toState(formatOk), toState(resolutionOk)], true, passed);
        }, 1300);
      };

      if (!formatOk) {
        // A file we cannot decode cannot have its resolution checked either.
        finish(false);
        return;
      }

      const url = URL.createObjectURL(file);
      const image = new Image();
      image.onload = () => {
        finish(checkResolution({ width: image.naturalWidth, height: image.naturalHeight }));
        URL.revokeObjectURL(url);
      };
      image.onerror = () => {
        finish(false);
        URL.revokeObjectURL(url);
      };
      image.src = url;
    },
    [setUpload],
  );

  const accept = CREATIVE_SPEC.formats.join(",");

  return (
    <Panel>
      <SectionHeading
        title="Your ad creative"
        subtitle="One set of artwork covers all your banner spaces."
      />

      <p className="mt-4 rounded-lg bg-[#BDDCEE]/20 px-3.5 py-2.5 text-xs font-semibold text-foreground/80">
        9 of 10 merchants let Koko design their first ad.
      </p>

      <div
        role="radiogroup"
        aria-label="How to supply your artwork"
        className="mt-6 grid items-stretch gap-4 md:grid-cols-2"
      >
        <button
          type="button"
          role="radio"
          aria-checked={draft.creative === "koko"}
          onClick={() => dispatch({ type: "setCreative", choice: "koko" })}
          className={cn(
            "relative flex flex-col rounded-2xl border-2 p-6 pt-8 text-left transition-colors duration-150",
            draft.creative === "koko"
              ? "border-gray-900 shadow-md dark:border-gray-200"
              : "border-border hover:border-gray-400",
          )}
        >
          <ShinyTag className="absolute -top-3.5 left-5">Fastest approval</ShinyTag>
          <span className="flex items-center justify-between gap-2">
            <span className="text-base font-bold">Let Koko create your assets</span>
            <Radio on={draft.creative === "koko"} />
          </span>
          <span className="mt-2 flex items-baseline gap-1.5">
            <span className="text-xl font-bold tabular-nums">+ {money(DESIGN_FEE)}</span>
            <span className="text-xs text-muted-foreground">one time</span>
          </span>
          <span className="mt-0.5 block text-xs text-muted-foreground">
            About {money(PER_DAY_ON_A_WEEK)} a day on a week booking
          </span>
          <span className="mt-4 flex flex-col gap-2 border-t border-border/40 pt-4">
            {KOKO_BENEFITS.map((benefit) => (
              <span key={benefit} className="flex items-center gap-2.5 text-sm">
                <span
                  aria-hidden="true"
                  className="flex h-[18px] w-[18px] flex-shrink-0 items-center justify-center rounded-full bg-emerald-600"
                >
                  <Check className="h-2.5 w-2.5 stroke-[3] text-white" />
                </span>
                {benefit}
              </span>
            ))}
          </span>
        </button>

        <button
          type="button"
          role="radio"
          aria-checked={draft.creative === "upload"}
          onClick={() => dispatch({ type: "setCreative", choice: "upload" })}
          className={cn(
            "relative flex flex-col rounded-2xl border p-5 text-left transition-colors duration-150",
            draft.creative === "upload"
              ? "border-2 border-gray-900 dark:border-gray-200"
              : "border-border hover:border-gray-400",
          )}
        >
          <span className="flex items-center justify-between gap-2">
            <span className="text-base font-bold">Upload my own asset</span>
            <Radio on={draft.creative === "upload"} />
          </span>
          <span className="mt-2 flex items-baseline gap-1.5">
            <span className="text-xl font-bold">Free</span>
            <span className="text-xs text-muted-foreground">no design fee</span>
          </span>
          <span className="mt-0.5 block text-xs text-muted-foreground">The slower option</span>
          <span className="mt-4 flex flex-col gap-2 border-t border-border/40 pt-4">
            {UPLOAD_CAVEATS.map((caveat) => (
              <span
                key={caveat}
                className="flex items-center gap-2.5 text-sm text-muted-foreground"
              >
                <span
                  aria-hidden="true"
                  className="flex h-[18px] w-[18px] flex-shrink-0 items-center justify-center rounded-full border-2 border-amber-400"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                </span>
                {caveat}
              </span>
            ))}
          </span>
        </button>
      </div>

      {draft.creative === "upload" && (
        <div className="mt-4">
          {!upload ? (
            <label className="block cursor-pointer rounded-lg border-2 border-dashed border-border p-6 text-center transition-colors hover:bg-muted/30">
              <span
                aria-hidden="true"
                className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted"
              >
                <UploadCloud className="h-6 w-6 text-muted-foreground" />
              </span>
              <span className="mt-3 block text-sm font-medium">
                Click to upload or drag and drop
              </span>
              <span className="mt-0.5 block text-xs text-muted-foreground">{SPEC_SUMMARY}</span>
              <input
                ref={inputRef}
                type="file"
                accept={accept}
                className="sr-only"
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (file) runChecks(file);
                }}
              />
            </label>
          ) : (
            <div className="rounded-xl border border-border/60 p-5">
              <p className="truncate text-sm font-bold">{upload.name}</p>
              <div className="mt-2 divide-y divide-border/40" aria-live="polite">
                {CREATIVE_CHECKS.map((check, index) => (
                  <CheckRow
                    key={check.id}
                    label={check.label}
                    state={upload.states[index] ?? "pending"}
                  />
                ))}
              </div>

              {upload.done && upload.passed && (
                <p className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-300">
                  All checks passed. Your creative is ready for review.
                </p>
              )}

              {upload.done && !upload.passed && (
                <div className="mt-3 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 dark:border-red-800 dark:bg-red-950/30">
                  <p className="text-sm font-semibold text-red-700 dark:text-red-400">
                    Your file did not pass the spec. Fix the failed check and try again.
                  </p>
                  <label className="cursor-pointer rounded-lg border-[1.5px] border-red-600 px-4 py-1.5 text-xs font-medium text-red-700 transition-colors hover:bg-red-600 hover:text-white dark:text-red-400">
                    Try another file
                    <input
                      type="file"
                      accept={accept}
                      className="sr-only"
                      onChange={(event) => {
                        const file = event.target.files?.[0];
                        if (file) runChecks(file);
                      }}
                    />
                  </label>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </Panel>
  );
}

function CheckRow({ label, state }: { label: string; state: CheckState }) {
  return (
    <div className="flex items-center gap-2.5 py-2">
      {state === "pending" && (
        <span
          aria-hidden="true"
          className="h-5 w-5 flex-shrink-0 rounded-full border-2 border-border"
        />
      )}
      {state === "running" && (
        <span
          aria-hidden="true"
          className="h-5 w-5 flex-shrink-0 animate-spin rounded-full border-2 border-border border-t-gray-900 motion-reduce:animate-none dark:border-t-gray-100"
        />
      )}
      {state === "passed" && (
        <span
          aria-hidden="true"
          className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-emerald-600"
        >
          <Check className="h-3 w-3 stroke-[3] text-white" />
        </span>
      )}
      {state === "failed" && (
        <span
          aria-hidden="true"
          className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-red-600"
        >
          <X className="h-3 w-3 stroke-[3] text-white" />
        </span>
      )}
      <span
        className={cn(
          "text-sm",
          state === "failed"
            ? "font-semibold text-red-700 dark:text-red-400"
            : state === "passed"
              ? "text-foreground"
              : "text-muted-foreground",
        )}
      >
        {label}
        <span className="sr-only">
          {state === "passed"
            ? ", passed"
            : state === "failed"
              ? ", failed"
              : state === "running"
                ? ", checking"
                : ""}
        </span>
      </span>
    </div>
  );
}
