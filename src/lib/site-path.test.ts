import { describe, expect, it } from "vitest";
import { withSiteBasePath } from "./site-path";

describe("withSiteBasePath", () => {
  it("prefixes local assets for subpath deployments", () => {
    expect(
      withSiteBasePath(
        "/assets/product/xiaoan-dock.png",
        "/xiaoan-web-experiment",
      ),
    ).toBe("/xiaoan-web-experiment/assets/product/xiaoan-dock.png");
  });

  it("normalizes trailing and missing slashes", () => {
    expect(withSiteBasePath("assets/v2/product-dock.png", "/preview/")).toBe(
      "/preview/assets/v2/product-dock.png",
    );
    expect(withSiteBasePath("/assets/v2/product-dock.png", "")).toBe(
      "/assets/v2/product-dock.png",
    );
  });
});
