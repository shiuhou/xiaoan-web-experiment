import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { AGENT_INPUTS, AGENT_OUTPUTS, V2_ACTS, V2_ASSETS } from "./v2-content";

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

  it("keeps derived V2 assets local and available", () => {
    expect(V2_ASSETS.expressionCare).toBe("/assets/v2/expression-care.png");
    for (const asset of Object.values(V2_ASSETS)) {
      expect(asset).not.toMatch(/^https?:/);
      expect(fs.existsSync(path.join(process.cwd(), "public", asset.slice(1)))).toBe(
        true,
      );
    }
  });
});
