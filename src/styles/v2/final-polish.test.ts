import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const read = (name: string) =>
  fs.readFileSync(path.join(process.cwd(), "src", "styles", "v2", name), "utf8");

describe("V2 final visual polish", () => {
  it("integrates the edge source image through a mask and optical blend", () => {
    const edge = read("edge-intent.css");

    expect(edge).toContain("mask-image");
    expect(edge).toContain("mix-blend-mode");
    expect(edge).toContain("data-edge-optical-frame");
  });
});
