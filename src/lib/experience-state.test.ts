import { describe, expect, it } from "vitest";
import {
  clampProgress,
  createExperienceFrame,
  frameKeyForAct,
} from "./experience-state";

describe("experience state", () => {
  it("clamps finite progress and rejects invalid values", () => {
    expect(clampProgress(-1)).toBe(0);
    expect(clampProgress(0.42)).toBe(0.42);
    expect(clampProgress(1.4)).toBe(1);
    expect(clampProgress(Number.NaN)).toBe(0);
    expect(clampProgress(Number.POSITIVE_INFINITY)).toBe(0);
  });

  it("starts every act and velocity at zero", () => {
    expect(createExperienceFrame()).toEqual({
      wake: 0,
      break: 0,
      signal: 0,
      edgeIntent: 0,
      action: 0,
      presence: 0,
      velocity: 0,
    });
  });

  it("maps hyphenated act ids to stable frame keys", () => {
    expect(frameKeyForAct("edge-intent")).toBe("edgeIntent");
    expect(frameKeyForAct("presence")).toBe("presence");
  });
});
