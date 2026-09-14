import { describe, expect, it } from "vitest";

import {
  allPassed,
  checkFormat,
  checkResolution,
  checkSize,
  CREATIVE_SPEC,
  runSpecChecks,
} from "../creative";

const good = { size: 1_000_000, type: "image/png", width: 1600, height: 640 };

describe("creative spec checks", () => {
  it("passes a file that meets every rule", () => {
    expect(allPassed(runSpecChecks(good))).toBe(true);
  });

  it("accepts a file exactly on each limit", () => {
    expect(checkSize({ size: CREATIVE_SPEC.maxBytes })).toBe(true);
    expect(
      checkResolution({ width: CREATIVE_SPEC.minWidth, height: CREATIVE_SPEC.minHeight }),
    ).toBe(true);
  });

  it("rejects a file one byte over the size limit", () => {
    expect(checkSize({ size: CREATIVE_SPEC.maxBytes + 1 })).toBe(false);
  });

  it("accepts JPEG and PNG and nothing else", () => {
    expect(checkFormat({ type: "image/jpeg" })).toBe(true);
    expect(checkFormat({ type: "image/png" })).toBe(true);
    expect(checkFormat({ type: "image/gif" })).toBe(false);
    expect(checkFormat({ type: "image/webp" })).toBe(false);
    expect(checkFormat({ type: "application/pdf" })).toBe(false);
  });

  it("rejects an image that is short in either dimension", () => {
    expect(checkResolution({ width: 1599, height: 640 })).toBe(false);
    expect(checkResolution({ width: 1600, height: 639 })).toBe(false);
  });

  it("reports each rule independently, in order", () => {
    expect(runSpecChecks({ ...good, type: "image/gif" })).toEqual([true, false, true]);
    expect(runSpecChecks({ ...good, size: 9_000_000 })).toEqual([false, true, true]);
    expect(allPassed(runSpecChecks({ ...good, width: 800 }))).toBe(false);
  });
});
