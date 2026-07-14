import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import {
  ASSETS,
  CONCEPT_STATES,
  SCENES,
  withSiteBasePath,
} from "./site-content";

describe("Xiao-An narrative content", () => {
  it("prefixes public assets for subpath deployments", () => {
    expect(
      withSiteBasePath(
        "/assets/product/xiaoan-dock.png",
        "/xiaoan-web-experiment",
      ),
    ).toBe("/xiaoan-web-experiment/assets/product/xiaoan-dock.png");
    expect(withSiteBasePath("/assets/product/xiaoan-dock.png", "")).toBe(
      "/assets/product/xiaoan-dock.png",
    );
  });

  it("keeps exactly eight scenes in the intended narrative order", () => {
    expect(SCENES.map((scene) => scene.id)).toEqual([
      "awakening",
      "breaking",
      "perception",
      "edge",
      "understanding",
      "presence",
      "system",
      "closing",
    ]);
  });

  it("keeps scene copy short and bilingual", () => {
    for (const scene of SCENES) {
      expect(scene.eyebrow.length).toBeGreaterThan(0);
      expect(scene.title.length).toBeGreaterThan(0);
      expect(scene.zh.length).toBeGreaterThan(0);
      expect(scene.body.length).toBeLessThanOrEqual(120);
    }
  });

  it("uses only local assets that exist in public", () => {
    for (const assetPath of Object.values(ASSETS)) {
      expect(assetPath).toMatch(/^\/assets\//);
      expect(assetPath).not.toMatch(/^https?:/);
      expect(
        fs.existsSync(path.join(process.cwd(), "public", assetPath.slice(1))),
      ).toBe(true);
    }
  });

  it("labels concept states without fabricated measured metrics", () => {
    const serialized = JSON.stringify({ SCENES, CONCEPT_STATES });
    expect(CONCEPT_STATES).toEqual([
      "STATE / FATIGUE POSSIBLE",
      "QUALITY / VALID",
      "CONTEXT / WORK SESSION",
      "ACTION / WAIT",
    ]);
    expect(serialized).not.toMatch(/\b\d+(?:\.\d+)?\s*(?:ms|%|x|倍)\b/i);
  });
});
