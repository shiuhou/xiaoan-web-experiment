import { describe, expect, it } from "vitest";
import { AGENT_INPUTS, AGENT_OUTPUTS, V2_ACTS } from "./v2-content";

describe("V2 narrative contract", () => {
  it("uses six acts with Chinese as the primary line", () => {
    expect(V2_ACTS.map((act) => act.id)).toEqual([
      "wake",
      "break",
      "signal",
      "edge-intent",
      "action",
      "presence",
    ]);

    for (const act of V2_ACTS) {
      expect(act.zh.length).toBeGreaterThan(4);
      expect(act.en.length).toBeLessThanOrEqual(48);
    }
  });

  it("does not reveal outputs on the input side", () => {
    expect(AGENT_INPUTS.every((input) => !("output" in input))).toBe(true);
    expect(AGENT_OUTPUTS).toEqual(["REMINDER", "CARE", "WAIT"]);
  });
});
