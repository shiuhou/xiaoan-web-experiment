import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const readStyle = (name: string) =>
  fs.readFileSync(path.join(process.cwd(), "src", "styles", "v2", name), "utf8");

describe("Reduced Motion static composition", () => {
  it("uses natural-height acts and keeps Action decisions and outputs visible", () => {
    const reduced = readStyle("reduced-motion.css");
    const action = readStyle("action.css");

    expect(reduced).toContain("height: auto");
    expect(reduced).toContain("[data-action-decision]");
    expect(reduced).toContain("[data-action-output]");
    expect(action).not.toMatch(
      /\.action-act__decision,\s*\n\s*\.action-act__outputs\s*\{\s*display:\s*none/,
    );
  });
});
