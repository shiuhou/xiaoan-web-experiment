import { describe, expect, it } from "vitest";
import { getExperienceFrameLoop } from "./experience-canvas";

describe("ExperienceCanvas rendering budget", () => {
  it("renders continuously only while both the page and scene are visible", () => {
    expect(getExperienceFrameLoop(true, true)).toBe("always");
    expect(getExperienceFrameLoop(true, false)).toBe("never");
    expect(getExperienceFrameLoop(false, true)).toBe("never");
  });
});
