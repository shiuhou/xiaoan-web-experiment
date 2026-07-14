import { describe, expect, it } from "vitest";
import { MOTION_LANGUAGE, NARRATIVE_TIMELINES } from "./narrative-motion";

describe("narrative motion plan", () => {
  it("assigns one semantic motion verb to every scene", () => {
    expect(NARRATIVE_TIMELINES.map((timeline) => timeline.scene)).toEqual([
      "awakening",
      "breaking",
      "perception",
      "edge",
      "understanding",
      "presence",
      "system",
      "closing",
    ]);
    expect(new Set(NARRATIVE_TIMELINES.map((timeline) => timeline.verb))).toEqual(
      new Set(["SIGNAL", "PROCESS", "DECISION", "ACTION", "QUIET"]),
    );
  });

  it("keeps the signature moment tied to the flat planes and physical reveal", () => {
    expect(MOTION_LANGUAGE.signatureMoment).toEqual({
      trigger: ".breaking-scene",
      planes: "[data-ui-plane]",
      reveal: "[data-product-reveal]",
    });
  });

  it("bounds scroll timelines instead of using extreme pins", () => {
    for (const timeline of NARRATIVE_TIMELINES) {
      expect(timeline.scrollLengthVh).toBeLessThanOrEqual(210);
      expect(timeline.scrollLengthVh).toBeGreaterThanOrEqual(100);
    }
  });
});
