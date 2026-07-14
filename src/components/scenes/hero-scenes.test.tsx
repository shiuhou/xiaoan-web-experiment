import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { AwakeningScene } from "./awakening-scene";
import { BreakingScene } from "./breaking-scene";

describe("AwakeningScene", () => {
  it("uses the real product as a layered poster anchor", () => {
    const { container } = render(<AwakeningScene />);

    expect(
      screen.getByRole("heading", { name: /meet xiao-an/i }),
    ).toBeVisible();
    expect(screen.getByText("SYSTEM / ONLINE")).toBeVisible();
    expect(screen.getByText("EDGE / CONNECTED")).toBeVisible();
    expect(screen.getByText("AGENT / AWAKE")).toBeVisible();
    expect(container.querySelectorAll("[data-product-layer]").length).toBe(2);
    expect(screen.getByAltText(/xiao-an robot and dock/i)).toHaveAttribute(
      "src",
      expect.stringContaining("xiaoan-dock"),
    );
  });
});

describe("BreakingScene", () => {
  it("contains the semantic targets required for the plane-to-depth signature moment", () => {
    const { container } = render(<BreakingScene />);

    expect(
      screen.getByRole("heading", { name: /not another screen\. a presence\./i }),
    ).toBeVisible();
    expect(container.querySelectorAll("[data-ui-plane]")).toHaveLength(4);
    expect(container.querySelector("[data-product-reveal]")).toBeInTheDocument();
    expect(container.querySelector("[data-signature-frame]")).toBeInTheDocument();
    expect(screen.getByText("SOFTWARE / FLAT")).toBeVisible();
    expect(screen.getByText("PRESENCE / DEPTH")).toBeVisible();
  });
});
