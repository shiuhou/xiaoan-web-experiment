import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { SceneNavigator } from "./scene-navigator";

describe("SceneNavigator", () => {
  it("exposes all six acts through a compact keyboard-operable index", async () => {
    const user = userEvent.setup();
    render(<SceneNavigator />);

    const toggle = screen.getByRole("button", { name: /open scene index/i });
    expect(toggle).toHaveAttribute("aria-expanded", "false");

    await user.click(toggle);
    expect(toggle).toHaveAttribute("aria-expanded", "true");
    expect(document.body).toHaveAttribute("data-scene-index-open", "true");
    expect(screen.getAllByRole("link")).toHaveLength(6);
    expect(screen.getByRole("link", { name: /01 wake/i })).toHaveAttribute(
      "href",
      "#wake",
    );

    await user.click(screen.getByRole("link", { name: /04 edge-intent/i }));
    expect(toggle).toHaveAttribute("aria-expanded", "false");
    expect(document.body).not.toHaveAttribute("data-scene-index-open");
  });
});
