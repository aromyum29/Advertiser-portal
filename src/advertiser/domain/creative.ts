/**
 * Creative specification and the client-side spec check.
 *
 * The check here is a courtesy that catches obvious problems before the
 * advertiser pays. Production re-runs every rule server side; a file that
 * passes here is still only queued for review.
 */

export const CREATIVE_SPEC = {
  maxBytes: 5 * 1024 * 1024,
  formats: ["image/jpeg", "image/png"] as const,
  minWidth: 1600,
  minHeight: 640,
} as const;

export type CreativeCheckId = "size" | "format" | "resolution";

export interface CreativeCheck {
  readonly id: CreativeCheckId;
  readonly label: string;
}

export const CREATIVE_CHECKS: readonly CreativeCheck[] = [
  { id: "size", label: "File size under 5 MB" },
  { id: "format", label: "JPG or PNG format" },
  { id: "resolution", label: "Resolution at least 1600 × 640 px" },
] as const;

/** Pending, running, passed or failed — one per rule, in `CREATIVE_CHECKS` order. */
export type CheckState = "pending" | "running" | "passed" | "failed";

export interface CreativeUpload {
  readonly name: string;
  readonly states: readonly CheckState[];
  readonly done: boolean;
  readonly passed: boolean;
}

/** Shape of what we need from a file, so the rules can be tested without a DOM. */
export interface FileFacts {
  readonly size: number;
  readonly type: string;
  readonly width: number;
  readonly height: number;
}

export const checkSize = (facts: Pick<FileFacts, "size">): boolean =>
  facts.size <= CREATIVE_SPEC.maxBytes;

export const checkFormat = (facts: Pick<FileFacts, "type">): boolean =>
  (CREATIVE_SPEC.formats as readonly string[]).includes(facts.type);

export const checkResolution = (facts: Pick<FileFacts, "width" | "height">): boolean =>
  facts.width >= CREATIVE_SPEC.minWidth && facts.height >= CREATIVE_SPEC.minHeight;

/** Run every rule against a file. Order matches `CREATIVE_CHECKS`. */
export const runSpecChecks = (facts: FileFacts): boolean[] => [
  checkSize(facts),
  checkFormat(facts),
  checkResolution(facts),
];

export const allPassed = (results: readonly boolean[]): boolean => results.every(Boolean);

/** Human-readable spec line shown on the upload dropzone. */
export const SPEC_SUMMARY = "JPG or PNG · at least 1600 × 640 px · max 5 MB";
