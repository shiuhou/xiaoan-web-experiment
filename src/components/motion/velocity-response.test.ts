import { describe, expect, it } from "vitest";
import {
  VELOCITY_LIMITS,
  getVelocityResponse,
  normaliseScrollVelocity,
} from "./velocity-response";

describe("velocity response", () => {
  it("normalises scroll speed into a bounded signed range", () => {
    expect(normaliseScrollVelocity(0)).toBe(0);
    expect(normaliseScrollVelocity(800)).toBe(0.5);
    expect(normaliseScrollVelocity(3200)).toBe(1);
    expect(normaliseScrollVelocity(-3200)).toBe(-1);
    expect(normaliseScrollVelocity(Number.NaN)).toBe(0);
  });

  it("returns no velocity response for Reduced Motion", () => {
    expect(normaliseScrollVelocity(1600, true)).toBe(0);
    expect(getVelocityResponse(1600, true)).toEqual({
      normalised: 0,
      skewDeg: 0,
      ribbonStretch: 1,
      chromaticOffsetPx: 0,
    });
  });

  it("never exceeds the visual distortion budget", () => {
    const response = getVelocityResponse(100_000);
    expect(Math.abs(response.skewDeg)).toBeLessThanOrEqual(
      VELOCITY_LIMITS.skewDeg,
    );
    expect(response.ribbonStretch).toBeLessThanOrEqual(
      VELOCITY_LIMITS.ribbonStretch,
    );
    expect(Math.abs(response.chromaticOffsetPx)).toBeLessThanOrEqual(
      VELOCITY_LIMITS.chromaticOffsetPx,
    );
  });
});
